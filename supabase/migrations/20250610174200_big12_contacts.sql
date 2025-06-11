-- Create Big 12 contacts table for syncing with Notion
CREATE TABLE IF NOT EXISTS big12_contacts (
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
CREATE INDEX IF NOT EXISTS idx_big12_contacts_notion_id ON big12_contacts(notion_id);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_email ON big12_contacts(email);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_organization ON big12_contacts(organization);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport ON big12_contacts(sport);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sports ON big12_contacts USING GIN(sports);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sync_status ON big12_contacts(sync_status);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_updated_at ON big12_contacts(updated_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_big12_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_big12_contacts_updated_at BEFORE UPDATE ON big12_contacts
    FOR EACH ROW EXECUTE FUNCTION update_big12_contacts_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE big12_contacts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON big12_contacts
    FOR ALL USING (auth.role() = 'authenticated');

-- Create view for easy querying by sport
CREATE OR REPLACE VIEW big12_contacts_by_sport AS
SELECT 
  c.*,
  CASE 
    WHEN c.sport IS NOT NULL THEN ARRAY[c.sport]
    WHEN c.sports IS NOT NULL THEN c.sports
    ELSE ARRAY[]::TEXT[]
  END as all_sports
FROM big12_contacts c
WHERE c.sync_status = 'synced';

-- Create view for conference staff
CREATE OR REPLACE VIEW big12_conference_staff AS
SELECT *
FROM big12_contacts
WHERE (
  organization ILIKE '%big 12%' 
  OR organization ILIKE '%conference%'
  OR title ILIKE '%commissioner%'
  OR title ILIKE '%associate commissioner%'
  OR title ILIKE '%senior associate%'
) AND sync_status = 'synced';

-- Create view for coaching staff by sport
CREATE OR REPLACE VIEW big12_coaching_staff AS
SELECT 
  c.*,
  CASE 
    WHEN c.sport IS NOT NULL THEN c.sport
    WHEN c.sports IS NOT NULL AND array_length(c.sports, 1) > 0 THEN c.sports[1]
    ELSE 'unknown'
  END as primary_sport
FROM big12_contacts c
WHERE (
  title ILIKE '%coach%'
  OR role ILIKE '%coach%'
  OR position ILIKE '%coach%'
) AND sync_status = 'synced';