-- HELiiX Awards Tracker - Recipients Tracking System
-- Version: 1.0
-- Date: 2025-06-07
-- Description: Adds proper recipient tracking with team/sport/school connections

-- ========================================
-- Add team, sport, and school connections to awards
-- ========================================

-- Add columns to connect awards to teams/sports/schools
-- All three for maximum flexibility in querying and reporting
ALTER TABLE awards 
ADD COLUMN IF NOT EXISTS team_id INTEGER REFERENCES teams(id),
ADD COLUMN IF NOT EXISTS sport_id INTEGER REFERENCES sports(id),
ADD COLUMN IF NOT EXISTS school_id INTEGER REFERENCES schools(id),
ADD COLUMN IF NOT EXISTS season_year INTEGER,
ADD COLUMN IF NOT EXISTS award_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS recipient_name TEXT,
ADD COLUMN IF NOT EXISTS recipient_details JSONB;

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_awards_team_id ON awards(team_id);
CREATE INDEX IF NOT EXISTS idx_awards_sport_id ON awards(sport_id);
CREATE INDEX IF NOT EXISTS idx_awards_school_id ON awards(school_id);
CREATE INDEX IF NOT EXISTS idx_awards_season_year ON awards(season_year);
CREATE INDEX IF NOT EXISTS idx_awards_type ON awards(award_type);
CREATE INDEX IF NOT EXISTS idx_awards_recipient ON awards(recipient_name);

-- Add check constraint for award types
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_award_type' 
    AND conrelid = 'awards'::regclass
  ) THEN
    ALTER TABLE awards
    ADD CONSTRAINT check_award_type CHECK (
      award_type IN (
        'championship',
        'tournament_champion',
        'regular_season_champion',
        'conference_champion',
        'player_of_year',
        'coach_of_year',
        'freshman_of_year',
        'all_conference',
        'all_american',
        'academic_honor',
        'hall_of_fame',
        'retired_number',
        'milestone',
        'sportsmanship',
        'team_award',
        'individual_award',
        'other'
      )
    );
  END IF;
END $$;

-- ========================================
-- Create Award Recipients History Table
-- ========================================
CREATE TABLE IF NOT EXISTS award_recipients (
  id SERIAL PRIMARY KEY,
  award_id INTEGER REFERENCES awards(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id),
  sport_id INTEGER REFERENCES sports(id),
  school_id INTEGER REFERENCES schools(id),
  season_year INTEGER NOT NULL,
  recipient_type VARCHAR(20) CHECK (recipient_type IN ('team', 'individual', 'coach', 'school')),
  recipient_name TEXT NOT NULL,
  recipient_details JSONB, -- {position, jersey_number, stats, etc}
  announcement_date DATE,
  ceremony_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for recipients table
CREATE INDEX IF NOT EXISTS idx_recipients_award_id ON award_recipients(award_id);
CREATE INDEX IF NOT EXISTS idx_recipients_team_id ON award_recipients(team_id);
CREATE INDEX IF NOT EXISTS idx_recipients_sport_id ON award_recipients(sport_id);
CREATE INDEX IF NOT EXISTS idx_recipients_school_id ON award_recipients(school_id);
CREATE INDEX IF NOT EXISTS idx_recipients_season_year ON award_recipients(season_year);
CREATE INDEX IF NOT EXISTS idx_recipients_name ON award_recipients(recipient_name);

-- ========================================
-- Create views for comprehensive reporting
-- ========================================

-- View: Awards with full details including school/sport/team info
CREATE OR REPLACE VIEW v_awards_full AS
SELECT 
  a.*,
  s.name as school_name,
  s.abbreviation as school_abbreviation,
  s.mascot as school_mascot,
  sp.name as sport_name,
  sp.code as sport_code,
  sp.gender as sport_gender,
  t.name as team_name,
  COUNT(DISTINCT i.id) as invoice_count,
  COALESCE(SUM(i.amount), 0) as total_cost,
  COUNT(DISTINCT ar.id) as recipient_count
FROM awards a
LEFT JOIN schools s ON a.school_id = s.id
LEFT JOIN sports sp ON a.sport_id = sp.id
LEFT JOIN teams t ON a.team_id = t.id
LEFT JOIN invoices i ON i.award_id = a.id
LEFT JOIN award_recipients ar ON ar.award_id = a.id
GROUP BY 
  a.id, 
  s.name, s.abbreviation, s.mascot,
  sp.name, sp.code, sp.gender,
  t.name;

-- View: Award recipients with full context
CREATE OR REPLACE VIEW v_award_recipients_full AS
SELECT 
  ar.*,
  a.name as award_name,
  a.award_type,
  s.name as school_name,
  s.abbreviation as school_abbreviation,
  sp.name as sport_name,
  sp.code as sport_code,
  t.name as team_name
FROM award_recipients ar
JOIN awards a ON ar.award_id = a.id
LEFT JOIN schools s ON ar.school_id = s.id
LEFT JOIN sports sp ON ar.sport_id = sp.id
LEFT JOIN teams t ON ar.team_id = t.id;

-- View: Awards by school/sport/year summary
CREATE OR REPLACE VIEW v_awards_summary AS
SELECT 
  s.name as school_name,
  sp.name as sport_name,
  ar.season_year,
  a.award_type,
  COUNT(DISTINCT ar.id) as recipient_count,
  STRING_AGG(DISTINCT ar.recipient_name, ', ' ORDER BY ar.recipient_name) as recipients
FROM award_recipients ar
JOIN awards a ON ar.award_id = a.id
LEFT JOIN schools s ON ar.school_id = s.id
LEFT JOIN sports sp ON ar.sport_id = sp.id
GROUP BY 
  s.name,
  sp.name,
  ar.season_year,
  a.award_type
ORDER BY 
  ar.season_year DESC,
  s.name,
  sp.name;

-- ========================================
-- Update triggers for award_recipients
-- ========================================
CREATE TRIGGER update_award_recipients_updated_at 
BEFORE UPDATE ON award_recipients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Enable RLS on new table
-- ========================================
ALTER TABLE award_recipients ENABLE ROW LEVEL SECURITY;

-- Create policies for award_recipients
CREATE POLICY "Allow read access for authenticated users" ON award_recipients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role has full access" ON award_recipients
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ========================================
-- Add comments for documentation
-- ========================================
COMMENT ON TABLE award_recipients IS 'Historical tracking of award recipients by year';

COMMENT ON COLUMN awards.team_id IS 'Links to specific team (school + sport combination)';
COMMENT ON COLUMN awards.sport_id IS 'Links to sport - included for flexible querying';
COMMENT ON COLUMN awards.school_id IS 'Links to school - included for flexible querying';
COMMENT ON COLUMN awards.season_year IS 'Year the award was most recently earned';
COMMENT ON COLUMN awards.award_type IS 'Type of award/recognition';
COMMENT ON COLUMN awards.recipient_name IS 'Most recent recipient (for quick reference)';
COMMENT ON COLUMN awards.recipient_details IS 'JSON details about most recent recipient';

COMMENT ON COLUMN award_recipients.recipient_type IS 'Type of recipient: team, individual, coach, or school';
COMMENT ON COLUMN award_recipients.recipient_details IS 'JSON with details like position, stats, achievements';

-- ========================================
-- Sample data showing the flexibility
-- ========================================
-- Example 1: Team Championship (uses team_id which implicitly includes school and sport)
-- INSERT INTO awards (name, description, team_id, sport_id, school_id, award_type, status)
-- VALUES (
--   'Big 12 Tournament Championship Trophy',
--   'Men''s Basketball Tournament Champions',
--   901,  -- Kansas Men's Basketball (9*100 + 1)
--   1,    -- Men's Basketball (redundant but available for queries)
--   9,    -- Kansas (redundant but available for queries)
--   'tournament_champion',
--   'ordered'
-- );

-- Example 2: Individual Award (can query by any combination)
-- INSERT INTO awards (name, description, team_id, sport_id, school_id, award_type, status)
-- VALUES (
--   'Big 12 Player of the Year',
--   'Conference Player of the Year Award',
--   NULL, -- Not team-specific
--   1,    -- Men's Basketball
--   NULL, -- Not school-specific (conference-wide)
--   'player_of_year',
--   'planned'
-- );

-- Example 3: School-wide Award
-- INSERT INTO awards (name, description, team_id, sport_id, school_id, award_type, status)
-- VALUES (
--   'Directors Cup',
--   'Excellence in overall athletic program',
--   NULL, -- Not team-specific
--   NULL, -- Not sport-specific
--   9,    -- Kansas
--   'other',
--   'planned'
-- );