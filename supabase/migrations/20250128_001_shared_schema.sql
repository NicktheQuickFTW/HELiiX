-- HELiiX Shared Schema Migration
-- This creates the foundational tables used by all services
-- Version: 1.0.0
-- Date: 2025-01-28

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- =====================================================
-- ORGANIZATIONS (Multi-tenant foundation)
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('conference', 'institution', 'enterprise', 'other')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    metadata JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_metadata ON organizations USING GIN (metadata);

-- =====================================================
-- SERVICE REGISTRY
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    endpoint TEXT NOT NULL,
    health_endpoint TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'deprecated')),
    capabilities JSONB NOT NULL DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    last_health_check TIMESTAMPTZ,
    health_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for services
CREATE INDEX idx_services_service_id ON services(service_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_capabilities ON services USING GIN (capabilities);

-- =====================================================
-- EVENT STORE (Event Sourcing)
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::TEXT,
    event_type TEXT NOT NULL,
    event_version TEXT DEFAULT '1.0',
    service_id TEXT NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    correlation_id TEXT,
    causation_id TEXT,
    payload JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processing_attempts INTEGER DEFAULT 0,
    error_message TEXT,
    error_details JSONB
);

-- Indexes for events
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_service_id ON events(service_id);
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_processed_at ON events(processed_at) WHERE processed_at IS NULL;
CREATE INDEX idx_events_correlation_id ON events(correlation_id) WHERE correlation_id IS NOT NULL;

-- =====================================================
-- EVENT SUBSCRIPTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS event_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    auth_type TEXT DEFAULT 'bearer',
    auth_config JSONB DEFAULT '{}',
    retry_config JSONB DEFAULT '{"max_attempts": 3, "backoff_multiplier": 2}',
    filter_expression JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_id, event_type)
);

-- Indexes for event subscriptions
CREATE INDEX idx_event_subscriptions_service ON event_subscriptions(service_id);
CREATE INDEX idx_event_subscriptions_event_type ON event_subscriptions(event_type);
CREATE INDEX idx_event_subscriptions_active ON event_subscriptions(is_active);

-- =====================================================
-- AUDIT LOG
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::TEXT,
    service_id TEXT NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    resource_data JSONB,
    changes JSONB,
    result TEXT CHECK (result IN ('success', 'failure', 'partial')),
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    request_id TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit log
CREATE INDEX idx_audit_log_service ON audit_log(service_id);
CREATE INDEX idx_audit_log_organization ON audit_log(organization_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- =====================================================
-- API KEYS (Service Authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_id TEXT UNIQUE NOT NULL,
    key_hash TEXT NOT NULL, -- Store bcrypt hash of the key
    service_id TEXT NOT NULL REFERENCES services(service_id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for API keys
CREATE INDEX idx_api_keys_key_id ON api_keys(key_id);
CREATE INDEX idx_api_keys_service ON api_keys(service_id);
CREATE INDEX idx_api_keys_organization ON api_keys(organization_id);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- =====================================================
-- FEATURE FLAGS
-- =====================================================
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    flag_type TEXT DEFAULT 'boolean' CHECK (flag_type IN ('boolean', 'percentage', 'variant')),
    default_value JSONB NOT NULL,
    rules JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature flag evaluations per organization/service
CREATE TABLE IF NOT EXISTS feature_flag_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_key TEXT NOT NULL REFERENCES feature_flags(flag_key) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES services(service_id) ON DELETE CASCADE,
    value JSONB NOT NULL,
    reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(flag_key, organization_id, service_id)
);

-- =====================================================
-- SHARED CONFIGURATION
-- =====================================================
CREATE TABLE IF NOT EXISTS configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key TEXT NOT NULL,
    service_id TEXT REFERENCES services(service_id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    config_value JSONB NOT NULL,
    config_type TEXT DEFAULT 'json' CHECK (config_type IN ('json', 'text', 'number', 'boolean')),
    is_encrypted BOOLEAN DEFAULT false,
    is_secret BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(config_key, service_id, organization_id)
);

-- Indexes for configurations
CREATE INDEX idx_configurations_key ON configurations(config_key);
CREATE INDEX idx_configurations_service ON configurations(service_id);
CREATE INDEX idx_configurations_organization ON configurations(organization_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_subscriptions_updated_at BEFORE UPDATE ON event_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configurations_updated_at BEFORE UPDATE ON configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- EVENT PUBLISHING FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION publish_event(
    p_event_type TEXT,
    p_service_id TEXT,
    p_payload JSONB,
    p_organization_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_correlation_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO events (
        event_type,
        service_id,
        organization_id,
        user_id,
        correlation_id,
        payload
    ) VALUES (
        p_event_type,
        p_service_id,
        COALESCE(p_organization_id, (SELECT organization_id FROM auth.users WHERE id = p_user_id)),
        COALESCE(p_user_id, auth.uid()),
        p_correlation_id,
        p_payload
    ) RETURNING id INTO v_event_id;

    -- Notify subscribers via PostgreSQL NOTIFY
    PERFORM pg_notify(
        'events_channel',
        json_build_object(
            'event_id', v_event_id,
            'event_type', p_event_type,
            'service_id', p_service_id
        )::TEXT
    );

    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SERVICE HEALTH CHECK FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_service_health(
    p_service_id TEXT,
    p_health_status TEXT,
    p_metadata JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE services
    SET 
        last_health_check = NOW(),
        health_status = p_health_status,
        metadata = COALESCE(
            metadata || p_metadata,
            metadata
        )
    WHERE service_id = p_service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flag_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM auth.users WHERE id = auth.uid()
        )
    );

-- Services: Public read, authenticated write
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can manage services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

-- Events: Organization isolation
CREATE POLICY "Users can view their organization's events" ON events
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM auth.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Services can insert events" ON events
    FOR INSERT WITH CHECK (
        service_id IN (
            SELECT service_id FROM api_keys 
            WHERE key_id = current_setting('app.api_key_id', true)
        )
    );

-- Audit log: Organization isolation
CREATE POLICY "Users can view their organization's audit log" ON audit_log
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM auth.users WHERE id = auth.uid()
        )
    );

-- API Keys: Service and organization isolation
CREATE POLICY "Users can manage their organization's API keys" ON api_keys
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM auth.users WHERE id = auth.uid()
        )
    );

-- Feature flags: Public read
CREATE POLICY "Public can view active feature flags" ON feature_flags
    FOR SELECT USING (is_active = true);

-- Feature flag overrides: Organization isolation
CREATE POLICY "Users can view their organization's feature flag overrides" ON feature_flag_overrides
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM auth.users WHERE id = auth.uid()
        )
    );

-- Configurations: Service and organization isolation
CREATE POLICY "Users can view their organization's configurations" ON configurations
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM auth.users WHERE id = auth.uid()
        ) AND NOT is_secret
    );

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert HELiiX as the first service
INSERT INTO services (
    service_id,
    name,
    version,
    description,
    endpoint,
    health_endpoint,
    capabilities
) VALUES (
    'heliix-core',
    'HELiiX Core Platform',
    '1.0.0',
    'Central orchestration platform for HELiiX AI Solutions',
    'https://api.heliixai.com',
    '/health',
    '{"orchestration": true, "authentication": true, "api_gateway": true}'::JSONB
) ON CONFLICT (service_id) DO NOTHING;

-- Insert default feature flags
INSERT INTO feature_flags (flag_key, name, description, default_value) VALUES
    ('multi_service_enabled', 'Multi-Service Support', 'Enable multi-service architecture', 'true'::JSONB),
    ('event_bus_enabled', 'Event Bus', 'Enable event-driven communication', 'true'::JSONB),
    ('api_gateway_enabled', 'API Gateway', 'Enable API gateway routing', 'true'::JSONB)
ON CONFLICT (flag_key) DO NOTHING;

-- =====================================================
-- GRANTS (Adjust based on your Supabase setup)
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant appropriate permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;