-- Policy Management System for Big 12 Conference
-- Tracking policies across sports, versions, and manual generation

-- Policy categories enum
CREATE TYPE policy_category AS ENUM (
  'governance',
  'playing_rules', 
  'championship_procedures',
  'officiating',
  'sport_specific',
  'administrative',
  'compliance',
  'ncaa_guidelines',
  'conference_operations',
  'weather_policies',
  'competition_limits',
  'season_format',
  'eligibility_requirements',
  'equipment_specifications',
  'facility_standards',
  'travel_procedures',
  'media_relations',
  'safety_protocols',
  'drug_testing',
  'academic_standards',
  'recruiting_rules',
  'transfer_policies',
  'postseason_procedures',
  'awards_recognition',
  'disciplinary_actions',
  'financial_regulations',
  'broadcasting_standards',
  'tournament_operations',
  'venue_requirements',
  'scheduling_policies'
);

-- Policy status enum
CREATE TYPE policy_status AS ENUM (
  'draft',
  'under_review', 
  'pending_approval',
  'current',
  'archived',
  'superseded'
);

-- Manual template types
CREATE TYPE manual_template_type AS ENUM (
  'championship_manual',
  'playing_rules',
  'officials_manual',
  'administrative_guide',
  'sport_handbook'
);

-- Main policies table
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  short_name TEXT, -- For easier reference
  category policy_category NOT NULL,
  sport_id INTEGER REFERENCES sports(sport_id), -- NULL for conference-wide policies
  policy_number TEXT UNIQUE, -- e.g., "POL-FB-001" for Football Policy 001
  version TEXT NOT NULL DEFAULT '1.0',
  status policy_status NOT NULL DEFAULT 'draft',
  
  -- Content storage
  content_url TEXT, -- PDF/document URL in Supabase storage
  content_text TEXT, -- Extracted text for searching
  summary TEXT, -- Brief description
  
  -- Dates and lifecycle
  effective_date DATE,
  expiration_date DATE, -- NULL for indefinite policies
  last_review_date DATE,
  next_review_date DATE,
  
  -- Approval workflow
  created_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approval_date TIMESTAMPTZ,
  
  -- Change tracking
  change_summary TEXT, -- What changed in this version
  parent_policy_id UUID REFERENCES policies(id), -- Links to previous version
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}', -- For enhanced search
  applies_to_sports TEXT[] DEFAULT '{}', -- Sport codes this policy affects
  related_policies UUID[] DEFAULT '{}', -- Array of related policy IDs
  
  -- JSON metadata for flexibility
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policy versions history table
CREATE TABLE policy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  version_name TEXT, -- e.g., "2024-25 Season Update"
  
  -- Content at this version
  content_url TEXT,
  content_text TEXT,
  
  -- Change details
  changes_made TEXT NOT NULL,
  change_reason TEXT,
  
  -- Version metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(policy_id, version_number)
);

-- Policy comparisons for tracking differences
CREATE TABLE policy_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES policies(id),
  version_from TEXT NOT NULL,
  version_to TEXT NOT NULL,
  
  -- Comparison results (JSON diff)
  comparison_data JSONB NOT NULL DEFAULT '{}',
  
  -- Summary of changes
  changes_summary TEXT,
  significant_changes BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(policy_id, version_from, version_to)
);

-- Manual templates for generating sport-specific manuals
CREATE TABLE manual_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type manual_template_type NOT NULL,
  sport_id INTEGER REFERENCES sports(sport_id), -- NULL for generic templates
  
  -- Template content
  template_content JSONB NOT NULL DEFAULT '{}', -- Template structure
  template_file_url TEXT, -- Base template file
  
  -- Generation settings
  auto_include_policies TEXT[] DEFAULT '{}', -- Policy categories to auto-include
  required_sections TEXT[] DEFAULT '{}', -- Required manual sections
  
  -- Metadata
  description TEXT,
  version TEXT DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated manuals tracking
CREATE TABLE generated_manuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES manual_templates(id),
  sport_id INTEGER REFERENCES sports(sport_id),
  
  -- Manual details
  title TEXT NOT NULL,
  season_year TEXT, -- e.g., "2024-25"
  file_url TEXT, -- Generated PDF URL
  
  -- Generation metadata
  policies_included UUID[] DEFAULT '{}', -- Array of policy IDs included
  generation_date TIMESTAMPTZ DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id),
  
  -- Status
  status TEXT DEFAULT 'generated', -- 'generating', 'generated', 'published', 'archived'
  
  -- Manual metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policy review schedule for compliance tracking
CREATE TABLE policy_review_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  
  -- Review scheduling
  review_frequency_months INTEGER NOT NULL DEFAULT 12, -- Annual by default
  next_review_date DATE NOT NULL,
  assigned_reviewer UUID REFERENCES auth.users(id),
  
  -- Review status
  review_status TEXT DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'overdue'
  review_notes TEXT,
  
  -- Compliance tracking
  compliance_required BOOLEAN DEFAULT false,
  compliance_deadline DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_policies_sport_id ON policies(sport_id);
CREATE INDEX idx_policies_category ON policies(category);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_effective_date ON policies(effective_date);
CREATE INDEX idx_policies_policy_number ON policies(policy_number);
CREATE INDEX idx_policies_text_search ON policies USING gin(to_tsvector('english', title || ' ' || coalesce(summary, '') || ' ' || coalesce(content_text, '')));

CREATE INDEX idx_policy_versions_policy_id ON policy_versions(policy_id);
CREATE INDEX idx_policy_comparisons_policy_id ON policy_comparisons(policy_id);

CREATE INDEX idx_manual_templates_sport_id ON manual_templates(sport_id);
CREATE INDEX idx_manual_templates_type ON manual_templates(template_type);

CREATE INDEX idx_generated_manuals_sport_id ON generated_manuals(sport_id);
CREATE INDEX idx_generated_manuals_season ON generated_manuals(season_year);

CREATE INDEX idx_review_schedule_next_date ON policy_review_schedule(next_review_date);
CREATE INDEX idx_review_schedule_status ON policy_review_schedule(review_status);

-- Row Level Security (RLS)
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_review_schedule ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users to read/write)
CREATE POLICY "Enable read access for authenticated users" ON policies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON policies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON policies FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON policy_versions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON policy_versions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON policy_comparisons FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON policy_comparisons FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON manual_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON manual_templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON manual_templates FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON generated_manuals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON generated_manuals FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON policy_review_schedule FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON policy_review_schedule FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON policy_review_schedule FOR UPDATE USING (auth.role() = 'authenticated');

-- Functions for policy management
CREATE OR REPLACE FUNCTION update_policy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW
  EXECUTE FUNCTION update_policy_updated_at();

CREATE TRIGGER update_manual_templates_updated_at
  BEFORE UPDATE ON manual_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_policy_updated_at();

CREATE TRIGGER update_policy_review_schedule_updated_at
  BEFORE UPDATE ON policy_review_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_policy_updated_at();

-- Function to get policies for a sport
CREATE OR REPLACE FUNCTION get_sport_policies(sport_code TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category policy_category,
  version TEXT,
  status policy_status,
  effective_date DATE,
  summary TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.category,
    p.version,
    p.status,
    p.effective_date,
    p.summary
  FROM policies p
  LEFT JOIN sports s ON p.sport_id = s.sport_id
  WHERE s.sport_code = sport_code
     OR p.sport_id IS NULL -- Include conference-wide policies
     OR sport_code = ANY(p.applies_to_sports)
  ORDER BY p.category, p.title;
END;
$$ LANGUAGE plpgsql;

-- Function to search policies
CREATE OR REPLACE FUNCTION search_policies(search_term TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category policy_category,
  sport_name TEXT,
  version TEXT,
  status policy_status,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.category,
    s.sport_name,
    p.version,
    p.status,
    ts_rank(to_tsvector('english', p.title || ' ' || coalesce(p.summary, '') || ' ' || coalesce(p.content_text, '')), 
            plainto_tsquery('english', search_term)) AS rank
  FROM policies p
  LEFT JOIN sports s ON p.sport_id = s.sport_id
  WHERE to_tsvector('english', p.title || ' ' || coalesce(p.summary, '') || ' ' || coalesce(p.content_text, ''))
        @@ plainto_tsquery('english', search_term)
  ORDER BY rank DESC, p.title;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE policies IS 'Main table for tracking Big 12 Conference policies across all sports and categories';
COMMENT ON TABLE policy_versions IS 'Version history for policy changes and updates';
COMMENT ON TABLE policy_comparisons IS 'Tracks differences between policy versions for analysis';
COMMENT ON TABLE manual_templates IS 'Templates for generating sport-specific manuals from policies';
COMMENT ON TABLE generated_manuals IS 'Tracking of generated manual files and their metadata';
COMMENT ON TABLE policy_review_schedule IS 'Compliance and review scheduling for policies';