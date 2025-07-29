-- Create contacts table for syncing with Notion
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE NOT NULL,
  
  -- Basic Information
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  title TEXT,
  position TEXT,
  role TEXT,
  
  -- Contact Information
  email TEXT,
  phone TEXT,
  mobile TEXT,
  website TEXT,
  
  -- Organization
  organization TEXT,
  school TEXT,
  institution TEXT,
  department TEXT,
  
  -- Sport Information
  sport TEXT,
  sports TEXT[],
  sport_responsibility TEXT,
  program TEXT,
  
  -- Location
  location TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  
  -- Metadata
  notion_created_time TIMESTAMPTZ,
  notion_last_edited_time TIMESTAMPTZ,
  notion_url TEXT,
  
  -- System fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sync_status TEXT DEFAULT 'pending',
  sync_error TEXT,
  
  -- Additional fields for flexible schema
  additional_properties JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_notion_id ON contacts(notion_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_organization ON contacts(organization);
CREATE INDEX IF NOT EXISTS idx_contacts_sport ON contacts(sport);
CREATE INDEX IF NOT EXISTS idx_contacts_sports ON contacts USING GIN(sports);
CREATE INDEX IF NOT EXISTS idx_contacts_sync_status ON contacts(sync_status);
CREATE INDEX IF NOT EXISTS idx_contacts_updated_at ON contacts(updated_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create sync log table
CREATE TABLE IF NOT EXISTS notion_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL, -- 'full', 'incremental', 'manual'
  status TEXT NOT NULL, -- 'running', 'completed', 'failed'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_deleted INTEGER DEFAULT 0,
  error_message TEXT,
  sync_details JSONB DEFAULT '{}'::jsonb
);

-- Create index on sync log
CREATE INDEX IF NOT EXISTS idx_notion_sync_log_started_at ON notion_sync_log(started_at);
CREATE INDEX IF NOT EXISTS idx_notion_sync_log_status ON notion_sync_log(status);

-- Row Level Security (RLS) policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_sync_log ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all operations for authenticated users" ON contacts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to sync log" ON notion_sync_log
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create view for easy querying by sport
CREATE OR REPLACE VIEW contacts_by_sport AS
SELECT 
  c.*,
  CASE 
    WHEN c.sport IS NOT NULL THEN ARRAY[c.sport]
    WHEN c.sports IS NOT NULL THEN c.sports
    ELSE ARRAY[]::TEXT[]
  END as all_sports
FROM contacts c
WHERE c.sync_status = 'synced';

-- Create view for conference staff
CREATE OR REPLACE VIEW conference_staff AS
SELECT *
FROM contacts
WHERE (
  organization ILIKE '%big 12%' 
  OR organization ILIKE '%conference%'
  OR title ILIKE '%commissioner%'
  OR title ILIKE '%associate commissioner%'
  OR title ILIKE '%senior associate%'
) AND sync_status = 'synced';

-- Create view for coaching staff by sport
CREATE OR REPLACE VIEW coaching_staff AS
SELECT 
  c.*,
  CASE 
    WHEN c.sport IS NOT NULL THEN c.sport
    WHEN c.sports IS NOT NULL AND array_length(c.sports, 1) > 0 THEN c.sports[1]
    ELSE 'unknown'
  END as primary_sport
FROM contacts c
WHERE (
  title ILIKE '%coach%'
  OR role ILIKE '%coach%'
  OR position ILIKE '%coach%'
) AND sync_status = 'synced';