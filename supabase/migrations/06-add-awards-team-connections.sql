-- HELiiX Awards Tracker - Team/Sport Connections
-- Version: 1.0
-- Date: 2025-06-07
-- Description: Adds connections between awards and teams/sports

-- ========================================
-- Add team and sport connections to awards
-- ========================================

-- Add columns to connect awards to teams/sports
ALTER TABLE awards 
ADD COLUMN IF NOT EXISTS team_id INTEGER REFERENCES teams(id),
ADD COLUMN IF NOT EXISTS sport_id INTEGER REFERENCES sports(id),
ADD COLUMN IF NOT EXISTS school_id INTEGER REFERENCES schools(id),
ADD COLUMN IF NOT EXISTS season_year INTEGER,
ADD COLUMN IF NOT EXISTS award_type VARCHAR(50);

-- Create index for lookups
CREATE INDEX IF NOT EXISTS idx_awards_team_id ON awards(team_id);
CREATE INDEX IF NOT EXISTS idx_awards_sport_id ON awards(sport_id);
CREATE INDEX IF NOT EXISTS idx_awards_school_id ON awards(school_id);
CREATE INDEX IF NOT EXISTS idx_awards_season_year ON awards(season_year);
CREATE INDEX IF NOT EXISTS idx_awards_type ON awards(award_type);

-- Add check constraint for award types
ALTER TABLE awards
ADD CONSTRAINT check_award_type CHECK (
  award_type IN (
    'championship',
    'tournament_champion',
    'regular_season_champion',
    'player_award',
    'coach_award',
    'team_award',
    'academic_award',
    'hall_of_fame',
    'milestone',
    'other'
  )
);

-- ========================================
-- Create a view for awards with full details
-- ========================================
CREATE OR REPLACE VIEW v_awards_full AS
SELECT 
  a.*,
  s.name as school_name,
  s.abbreviation as school_abbreviation,
  sp.name as sport_name,
  sp.code as sport_code,
  t.name as team_name,
  COUNT(i.id) as invoice_count,
  SUM(i.amount) as total_cost
FROM awards a
LEFT JOIN schools s ON a.school_id = s.id
LEFT JOIN sports sp ON a.sport_id = sp.id
LEFT JOIN teams t ON a.team_id = t.id
LEFT JOIN invoices i ON i.award_id = a.id
GROUP BY a.id, s.name, s.abbreviation, sp.name, sp.code, t.name;

-- ========================================
-- Add comments for documentation
-- ========================================
COMMENT ON COLUMN awards.team_id IS 'Links to specific team (school + sport combination)';
COMMENT ON COLUMN awards.sport_id IS 'Links to sport (can be used without team for conference-wide awards)';
COMMENT ON COLUMN awards.school_id IS 'Links to school (for school-wide awards not specific to a sport)';
COMMENT ON COLUMN awards.season_year IS 'Year the award was earned (e.g., 2025)';
COMMENT ON COLUMN awards.award_type IS 'Type of award/recognition';

-- ========================================
-- Sample data showing the connections
-- ========================================
-- Example: Kansas Basketball wins Big 12 Tournament
-- INSERT INTO awards (name, description, team_id, sport_id, school_id, season_year, award_type, status)
-- VALUES (
--   'Big 12 Tournament Championship Trophy',
--   'Men''s Basketball Tournament Champions',
--   901,  -- Kansas Men's Basketball (school_id 9 * 100 + sport_id 1)
--   1,    -- Men's Basketball
--   9,    -- Kansas
--   2025,
--   'tournament_champion',
--   'ordered'
-- );