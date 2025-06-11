-- XII Conference Contacts Table Schema
-- Generated from Notion Database: 13779839c200819db58bd3f239672f9a
-- Database Title: XII Conference Contacts
-- Total Properties: 20

CREATE TABLE IF NOT EXISTS big12_contacts (
  -- Notion metadata
  notion_id TEXT PRIMARY KEY,
  notion_url TEXT,
  created_time TIMESTAMP WITH TIME ZONE,
  last_edited_time TIMESTAMP WITH TIME ZONE,
  
  -- Contact Information
  name TEXT NOT NULL,  -- title property (primary identifier)
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  birthdate DATE,
  
  -- Organizational Information
  affiliation TEXT,  -- select: Big 12 Conference, schools, etc.
  title TEXT,  -- select: position titles
  department_conf_office TEXT,  -- select: conference office departments
  member_status TEXT,  -- select: Legacy, Affiliate
  
  -- Sports and Roles
  sport JSONB,  -- multi_select: sports they're associated with
  sport_role JSONB,  -- multi_select: roles within sports
  governance_group JSONB,  -- multi_select: President, AD, SWA, FAR, DOC, ADID
  
  -- Sport Liaison Responsibilities
  sport_liaison_for JSONB,  -- multi_select: sports they liaison for
  secondary_liaison_for JSONB,  -- multi_select: secondary sport liaisons
  communications_liaison_for JSONB,  -- multi_select: sports communication liaison
  marketing_liaison_for JSONB,  -- multi_select: sports marketing liaison
  swa_liaison_for JSONB,  -- multi_select: SWA liaison responsibilities
  secondary_swa_liaison_for JSONB,  -- multi_select: secondary SWA liaison
  liaison_to_officials_for JSONB,  -- multi_select: officials liaison for sports
  
  -- Sync and audit fields
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sync_status TEXT DEFAULT 'active',
  
  -- Indexes for common queries
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_big12_contacts_affiliation ON big12_contacts(affiliation);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_title ON big12_contacts(title);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_email ON big12_contacts(email);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_name ON big12_contacts(name);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sync_status ON big12_contacts(sync_status);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_last_edited ON big12_contacts(last_edited_time);

-- Create GIN indexes for JSONB fields to enable fast searching
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport_gin ON big12_contacts USING GIN(sport);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport_role_gin ON big12_contacts USING GIN(sport_role);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_governance_gin ON big12_contacts USING GIN(governance_group);
CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport_liaison_gin ON big12_contacts USING GIN(sport_liaison_for);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_big12_contacts_updated_at 
    BEFORE UPDATE ON big12_contacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE big12_contacts IS 'XII Conference contacts synced from Notion database';
COMMENT ON COLUMN big12_contacts.notion_id IS 'Unique identifier from Notion';
COMMENT ON COLUMN big12_contacts.name IS 'Full name (title property from Notion)';
COMMENT ON COLUMN big12_contacts.sport IS 'JSON array of sports associated with this contact';
COMMENT ON COLUMN big12_contacts.sport_role IS 'JSON array of roles within sports organizations';
COMMENT ON COLUMN big12_contacts.governance_group IS 'JSON array of governance roles (President, AD, SWA, etc.)';
COMMENT ON COLUMN big12_contacts.sport_liaison_for IS 'JSON array of sports this person serves as liaison for';
COMMENT ON COLUMN big12_contacts.synced_at IS 'Timestamp of last sync from Notion';
COMMENT ON COLUMN big12_contacts.sync_status IS 'Status of sync: active, archived, error';