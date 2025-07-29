-- HELiiX Event Store Enhancement Migration
-- This adds advanced event sourcing capabilities
-- Version: 1.0.0
-- Date: 2025-01-28

-- =====================================================
-- EVENT STORE ENHANCEMENTS
-- =====================================================

-- Event snapshots for performance optimization
CREATE TABLE IF NOT EXISTS event_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_id TEXT NOT NULL,
    aggregate_type TEXT NOT NULL,
    version INTEGER NOT NULL,
    data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(aggregate_id, version)
);

-- Indexes for event snapshots
CREATE INDEX idx_event_snapshots_aggregate ON event_snapshots(aggregate_id);
CREATE INDEX idx_event_snapshots_type ON event_snapshots(aggregate_type);

-- Event projections for read models
CREATE TABLE IF NOT EXISTS event_projections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projection_name TEXT NOT NULL,
    projection_key TEXT NOT NULL,
    projection_data JSONB NOT NULL,
    last_event_id UUID REFERENCES events(id),
    last_event_timestamp TIMESTAMPTZ,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(projection_name, projection_key)
);

-- Indexes for event projections
CREATE INDEX idx_event_projections_name ON event_projections(projection_name);
CREATE INDEX idx_event_projections_key ON event_projections(projection_key);
CREATE INDEX idx_event_projections_updated ON event_projections(updated_at DESC);

-- Dead letter queue for failed events
CREATE TABLE IF NOT EXISTS event_dead_letter_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_event_id UUID REFERENCES events(id),
    subscriber_service_id TEXT NOT NULL,
    failure_reason TEXT NOT NULL,
    failure_details JSONB,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dead letter queue
CREATE INDEX idx_dlq_service ON event_dead_letter_queue(subscriber_service_id);
CREATE INDEX idx_dlq_retry ON event_dead_letter_queue(next_retry_at) WHERE resolved_at IS NULL;
CREATE INDEX idx_dlq_unresolved ON event_dead_letter_queue(created_at) WHERE resolved_at IS NULL;

-- =====================================================
-- REAL-TIME SUBSCRIPTIONS
-- =====================================================

-- WebSocket subscription management
CREATE TABLE IF NOT EXISTS realtime_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_filter JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    last_ping_at TIMESTAMPTZ DEFAULT NOW(),
    disconnected_at TIMESTAMPTZ
);

-- Indexes for realtime subscriptions
CREATE INDEX idx_realtime_subs_connection ON realtime_subscriptions(connection_id);
CREATE INDEX idx_realtime_subs_service ON realtime_subscriptions(service_id);
CREATE INDEX idx_realtime_subs_active ON realtime_subscriptions(is_active);
CREATE INDEX idx_realtime_subs_ping ON realtime_subscriptions(last_ping_at) WHERE is_active = true;

-- =====================================================
-- MESSAGE QUEUE
-- =====================================================

-- Internal message queue for async processing
CREATE TABLE IF NOT EXISTS message_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_name TEXT NOT NULL DEFAULT 'default',
    message_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    max_attempts INTEGER DEFAULT 3,
    attempt_count INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    locked_by TEXT,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for message queue
CREATE INDEX idx_message_queue_ready ON message_queue(scheduled_for, priority DESC) 
    WHERE completed_at IS NULL AND failed_at IS NULL AND (locked_until IS NULL OR locked_until < NOW());
CREATE INDEX idx_message_queue_type ON message_queue(queue_name, message_type);
CREATE INDEX idx_message_queue_locked ON message_queue(locked_by, locked_until) WHERE locked_by IS NOT NULL;

-- =====================================================
-- ADVANCED EVENT FUNCTIONS
-- =====================================================

-- Get events for replay
CREATE OR REPLACE FUNCTION get_events_for_replay(
    p_aggregate_id TEXT,
    p_from_version INTEGER DEFAULT 0,
    p_to_version INTEGER DEFAULT NULL
) RETURNS TABLE (
    event_id UUID,
    event_type TEXT,
    payload JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.event_type,
        e.payload,
        e.metadata,
        e.created_at
    FROM events e
    WHERE 
        e.metadata->>'aggregate_id' = p_aggregate_id
        AND (e.metadata->>'version')::INTEGER > p_from_version
        AND (p_to_version IS NULL OR (e.metadata->>'version')::INTEGER <= p_to_version)
    ORDER BY (e.metadata->>'version')::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Process event subscriptions
CREATE OR REPLACE FUNCTION process_event_subscription(
    p_event_id UUID
) RETURNS VOID AS $$
DECLARE
    v_event RECORD;
    v_subscription RECORD;
BEGIN
    -- Get the event
    SELECT * INTO v_event FROM events WHERE id = p_event_id;
    
    -- Find matching subscriptions
    FOR v_subscription IN 
        SELECT * FROM event_subscriptions 
        WHERE event_type = v_event.event_type 
        AND is_active = true
    LOOP
        -- Add to message queue for async processing
        INSERT INTO message_queue (
            queue_name,
            message_type,
            payload,
            metadata,
            priority
        ) VALUES (
            'event_delivery',
            'webhook',
            jsonb_build_object(
                'subscription_id', v_subscription.id,
                'event_id', v_event.id,
                'endpoint', v_subscription.endpoint
            ),
            jsonb_build_object(
                'event_type', v_event.event_type,
                'service_id', v_subscription.service_id
            ),
            CASE 
                WHEN v_event.event_type LIKE '%CRITICAL%' THEN 9
                WHEN v_event.event_type LIKE '%ERROR%' THEN 8
                ELSE 5
            END
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create event snapshot
CREATE OR REPLACE FUNCTION create_event_snapshot(
    p_aggregate_id TEXT,
    p_aggregate_type TEXT,
    p_data JSONB
) RETURNS UUID AS $$
DECLARE
    v_version INTEGER;
    v_snapshot_id UUID;
BEGIN
    -- Get latest version
    SELECT COALESCE(MAX((metadata->>'version')::INTEGER), 0) INTO v_version
    FROM events
    WHERE metadata->>'aggregate_id' = p_aggregate_id;
    
    -- Create snapshot
    INSERT INTO event_snapshots (
        aggregate_id,
        aggregate_type,
        version,
        data
    ) VALUES (
        p_aggregate_id,
        p_aggregate_type,
        v_version,
        p_data
    ) RETURNING id INTO v_snapshot_id;
    
    RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- EVENT TRIGGERS
-- =====================================================

-- Trigger to process subscriptions after event insert
CREATE OR REPLACE FUNCTION trigger_process_event_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM process_event_subscription(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_event_subscriptions_trigger
    AFTER INSERT ON events
    FOR EACH ROW
    EXECUTE FUNCTION trigger_process_event_subscriptions();

-- =====================================================
-- MESSAGE QUEUE PROCESSING
-- =====================================================

-- Claim messages from queue
CREATE OR REPLACE FUNCTION claim_messages(
    p_queue_name TEXT,
    p_worker_id TEXT,
    p_limit INTEGER DEFAULT 10,
    p_lock_duration INTERVAL DEFAULT '5 minutes'
) RETURNS TABLE (
    id UUID,
    message_type TEXT,
    payload JSONB,
    metadata JSONB,
    attempt_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH claimed AS (
        UPDATE message_queue
        SET 
            locked_by = p_worker_id,
            locked_until = NOW() + p_lock_duration,
            attempt_count = attempt_count + 1
        WHERE id IN (
            SELECT mq.id
            FROM message_queue mq
            WHERE 
                mq.queue_name = p_queue_name
                AND mq.completed_at IS NULL
                AND mq.failed_at IS NULL
                AND mq.scheduled_for <= NOW()
                AND (mq.expires_at IS NULL OR mq.expires_at > NOW())
                AND (mq.locked_until IS NULL OR mq.locked_until < NOW())
                AND mq.attempt_count < mq.max_attempts
            ORDER BY mq.priority DESC, mq.created_at
            LIMIT p_limit
            FOR UPDATE SKIP LOCKED
        )
        RETURNING *
    )
    SELECT 
        claimed.id,
        claimed.message_type,
        claimed.payload,
        claimed.metadata,
        claimed.attempt_count
    FROM claimed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete message processing
CREATE OR REPLACE FUNCTION complete_message(
    p_message_id UUID,
    p_worker_id TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_updated INTEGER;
BEGIN
    UPDATE message_queue
    SET 
        completed_at = NOW(),
        locked_by = NULL,
        locked_until = NULL
    WHERE 
        id = p_message_id
        AND locked_by = p_worker_id
        AND completed_at IS NULL;
    
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fail message processing
CREATE OR REPLACE FUNCTION fail_message(
    p_message_id UUID,
    p_worker_id TEXT,
    p_error_message TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_message RECORD;
    v_updated INTEGER;
BEGIN
    -- Get message details
    SELECT * INTO v_message 
    FROM message_queue 
    WHERE id = p_message_id AND locked_by = p_worker_id;
    
    IF v_message.attempt_count >= v_message.max_attempts THEN
        -- Move to failed state
        UPDATE message_queue
        SET 
            failed_at = NOW(),
            error_message = p_error_message,
            locked_by = NULL,
            locked_until = NULL
        WHERE 
            id = p_message_id
            AND locked_by = p_worker_id;
    ELSE
        -- Release lock for retry with exponential backoff
        UPDATE message_queue
        SET 
            locked_by = NULL,
            locked_until = NULL,
            scheduled_for = NOW() + (v_message.attempt_count || ' minutes')::INTERVAL,
            error_message = p_error_message
        WHERE 
            id = p_message_id
            AND locked_by = p_worker_id;
    END IF;
    
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MONITORING VIEWS
-- =====================================================

-- Event processing status
CREATE OR REPLACE VIEW event_processing_status AS
SELECT 
    service_id,
    event_type,
    COUNT(*) as total_events,
    COUNT(processed_at) as processed_events,
    COUNT(*) - COUNT(processed_at) as pending_events,
    AVG(EXTRACT(EPOCH FROM (processed_at - created_at))) as avg_processing_time_seconds,
    MAX(created_at) as last_event_time
FROM events
GROUP BY service_id, event_type;

-- Message queue status
CREATE OR REPLACE VIEW message_queue_status AS
SELECT 
    queue_name,
    message_type,
    COUNT(*) FILTER (WHERE completed_at IS NULL AND failed_at IS NULL) as pending,
    COUNT(*) FILTER (WHERE locked_by IS NOT NULL) as processing,
    COUNT(*) FILTER (WHERE completed_at IS NOT NULL) as completed,
    COUNT(*) FILTER (WHERE failed_at IS NOT NULL) as failed,
    AVG(attempt_count) FILTER (WHERE completed_at IS NOT NULL) as avg_attempts
FROM message_queue
GROUP BY queue_name, message_type;

-- Service health overview
CREATE OR REPLACE VIEW service_health_overview AS
SELECT 
    s.service_id,
    s.name,
    s.status,
    s.health_status,
    s.last_health_check,
    EXTRACT(EPOCH FROM (NOW() - s.last_health_check)) as seconds_since_health_check,
    COUNT(DISTINCT e.id) as events_last_hour,
    COUNT(DISTINCT al.id) as audit_entries_last_hour
FROM services s
LEFT JOIN events e ON e.service_id = s.service_id 
    AND e.created_at > NOW() - INTERVAL '1 hour'
LEFT JOIN audit_log al ON al.service_id = s.service_id 
    AND al.created_at > NOW() - INTERVAL '1 hour'
GROUP BY s.service_id, s.name, s.status, s.health_status, s.last_health_check;

-- =====================================================
-- CLEANUP FUNCTIONS
-- =====================================================

-- Archive old events
CREATE OR REPLACE FUNCTION archive_old_events(
    p_days_to_keep INTEGER DEFAULT 90
) RETURNS INTEGER AS $$
DECLARE
    v_archived INTEGER;
BEGIN
    -- Move to archive table (create archive table first in production)
    WITH archived AS (
        DELETE FROM events
        WHERE 
            created_at < NOW() - (p_days_to_keep || ' days')::INTERVAL
            AND processed_at IS NOT NULL
        RETURNING *
    )
    SELECT COUNT(*) INTO v_archived FROM archived;
    
    RETURN v_archived;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up completed messages
CREATE OR REPLACE FUNCTION cleanup_completed_messages(
    p_days_to_keep INTEGER DEFAULT 7
) RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM message_queue
    WHERE 
        completed_at < NOW() - (p_days_to_keep || ' days')::INTERVAL
        OR (failed_at < NOW() - (p_days_to_keep * 2 || ' days')::INTERVAL);
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES FOR NEW TABLES
-- =====================================================

ALTER TABLE event_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_dead_letter_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_queue ENABLE ROW LEVEL SECURITY;

-- Service-level access for event operations
CREATE POLICY "Services can manage their snapshots" ON event_snapshots
    FOR ALL USING (
        aggregate_type IN (
            SELECT service_id FROM api_keys 
            WHERE key_id = current_setting('app.api_key_id', true)
        )
    );

CREATE POLICY "Services can manage their projections" ON event_projections
    FOR ALL USING (
        projection_name LIKE current_setting('app.service_id', true) || '%'
    );

CREATE POLICY "Services can view their DLQ entries" ON event_dead_letter_queue
    FOR SELECT USING (
        subscriber_service_id = current_setting('app.service_id', true)
    );

CREATE POLICY "Services can manage their realtime subscriptions" ON realtime_subscriptions
    FOR ALL USING (
        service_id = current_setting('app.service_id', true)
    );

CREATE POLICY "Services can access their messages" ON message_queue
    FOR ALL USING (
        metadata->>'service_id' = current_setting('app.service_id', true)
        OR locked_by = current_setting('app.worker_id', true)
    );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Compound indexes for common queries
CREATE INDEX idx_events_service_type_time ON events(service_id, event_type, created_at DESC);
CREATE INDEX idx_audit_log_service_action_time ON audit_log(service_id, action, created_at DESC);
CREATE INDEX idx_message_queue_worker_status ON message_queue(locked_by, completed_at, failed_at);

-- Partial indexes for active records
CREATE INDEX idx_active_subscriptions ON event_subscriptions(service_id) WHERE is_active = true;
CREATE INDEX idx_pending_messages ON message_queue(queue_name, priority DESC, created_at) 
    WHERE completed_at IS NULL AND failed_at IS NULL;

-- =====================================================
-- INITIAL CONFIGURATION
-- =====================================================

-- Create default event subscriptions for core services
INSERT INTO event_subscriptions (service_id, event_type, endpoint) VALUES
    ('heliix-core', 'SERVICE_REGISTERED', 'internal://heliix-core/events/service-registered'),
    ('heliix-core', 'SERVICE_HEALTH_CHANGED', 'internal://heliix-core/events/health-changed'),
    ('heliix-core', 'ORGANIZATION_CREATED', 'internal://heliix-core/events/org-created')
ON CONFLICT (service_id, event_type) DO NOTHING;