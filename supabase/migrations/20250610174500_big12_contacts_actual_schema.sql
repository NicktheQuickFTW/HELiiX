-- XII Conference Contacts Table - Exact Schema Match
-- Generated from Notion Database: 13779839c200819db58bd3f239672f9a
-- Database Title: XII Conference Contacts

CREATE TABLE IF NOT EXISTS big12_contacts (
  -- Notion metadata
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE NOT NULL,
  notion_url TEXT,
  notion_created_time TIMESTAMPTZ,
  notion_last_edited_time TIMESTAMPTZ,
  
  -- Core Contact Information (from your actual Notion fields)
  name TEXT,  -- "Name" (title property)
  first_name TEXT,  -- "First Name" (rich_text)
  last_name TEXT,  -- "Last Name" (rich_text)
  email TEXT,  -- "E-Mail" (email)
  phone TEXT,  -- "Phone" (phone_number)
  birthdate DATE,  -- "Birthdate" (date)
  
  -- Organizational Information
  affiliation TEXT,  -- "Affiliation" (select)
  title TEXT,  -- "Title" (select)
  department_conf_office TEXT,  -- "Department [Conf. Office]" (select)
  member_status TEXT,  -- "Member Status" (select)
  
  -- Sports and Roles (stored as JSONB for multi-select fields)
  sport JSONB DEFAULT '[]'::jsonb,  -- "Sport" (multi_select)
  sport_role JSONB DEFAULT '[]'::jsonb,  -- "Sport Role" (multi_select)
  governance_group JSONB DEFAULT '[]'::jsonb,  -- "Governance Group" (multi_select)
  
  -- Sport Liaison Responsibilities
  sport_liaison_for JSONB DEFAULT '[]'::jsonb,  -- "Sport Liaison For" (multi_select)
  secondary_liaison_for JSONB DEFAULT '[]'::jsonb,  -- "Secondary Liaison For" (multi_select)
  communications_liaison_for JSONB DEFAULT '[]'::jsonb,  -- "Communications Liaison For" (multi_select)
  marketing_liaison_for JSONB DEFAULT '[]'::jsonb,  -- "Marketing Liaison For" (multi_select)
  swa_liaison_for JSONB DEFAULT '[]'::jsonb,  -- "SWA Liaison For" (multi_select)
  secondary_swa_liaison_for JSONB DEFAULT '[]'::jsonb,  -- "Secondary SWA Liaison For" (multi_select)
  liaison_to_officials_for JSONB DEFAULT '[]'::jsonb,  -- "Liaison to Officials For" (multi_select)
  
  -- System fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sync_status TEXT DEFAULT 'pending',
  sync_error TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_big12_contacts_notion_id ON big12_contacts(notion_id);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_email ON big12_contacts(email);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_affiliation ON big12_contacts(affiliation);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_title ON big12_contacts(title);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_name ON big12_contacts(name);

-- GIN indexes for JSONB fields (enables fast querying of multi-select data)
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport ON big12_contacts USING GIN(sport);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport_role ON big12_contacts USING GIN(sport_role);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_governance_group ON big12_contacts USING GIN(governance_group);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport_liaison_for ON big12_contacts USING GIN(sport_liaison_for);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_big12_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_big12_contacts_updated_at 
    BEFORE UPDATE ON big12_contacts
    FOR EACH ROW EXECUTE FUNCTION update_big12_contacts_updated_at();

-- Row Level Security
ALTER TABLE big12_contacts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON big12_contacts
    FOR ALL USING (auth.role() = 'authenticated');

-- Useful views for common queries
CREATE OR REPLACE VIEW big12_coaches AS
SELECT *
FROM big12_contacts
WHERE sport_role ? 'Head Coach' 
   OR sport_role ? 'Assistant Coach'
   OR sport_role ? 'Associate Head Coach'
   AND sync_status = 'synced';

CREATE OR REPLACE VIEW big12_athletic_directors AS
SELECT *
FROM big12_contacts
WHERE governance_group ? 'AD'
   OR title ILIKE '%athletic director%'
   AND sync_status = 'synced';

CREATE OR REPLACE VIEW big12_conference_staff AS
SELECT *
FROM big12_contacts
WHERE affiliation = 'Big 12 Conference'
   AND sync_status = 'synced';