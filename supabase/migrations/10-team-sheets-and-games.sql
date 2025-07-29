-- Team Sheets and Games Schema for 2024-25 Basketball Season
-- This migration creates comprehensive tables for team performance metrics and game results

-- Create conferences table if not exists
CREATE TABLE IF NOT EXISTS conferences (
  conference_id INTEGER PRIMARY KEY,
  conference_name VARCHAR(100) NOT NULL,
  conference_abbreviation VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert/Update conferences
INSERT INTO conferences (conference_id, conference_name, conference_abbreviation) VALUES
  (1, 'Big 12 Conference', 'XII'),
  (2, 'Atlantic Coast Conference', 'ACC'),
  (3, 'Big Ten Conference', 'B1G'),
  (4, 'Southeastern Conference', 'SEC')
ON CONFLICT (conference_id) DO UPDATE 
SET conference_name = EXCLUDED.conference_name,
    conference_abbreviation = EXCLUDED.conference_abbreviation,
    updated_at = NOW();

-- Create teams table with new structure
CREATE TABLE IF NOT EXISTS teams (
  team_id VARCHAR(20) PRIMARY KEY, -- Format: conference_id + school_id + sport_id
  team_name VARCHAR(255) NOT NULL, -- Format: preferred_school_name + sport_name
  conference_id INTEGER REFERENCES conferences(conference_id),
  school_id INTEGER REFERENCES schools(school_id),
  sport_id INTEGER REFERENCES sports(sport_id),
  sport_name VARCHAR(100),
  season VARCHAR(10) NOT NULL, -- e.g., '2024-25'
  
  -- Ranking metrics
  national_rank INTEGER,
  net_ranking INTEGER,
  net_sos_rank INTEGER,
  rpi_ranking INTEGER,
  rpi_sos_rank INTEGER,
  
  -- Overall records (wins and losses as separate columns)
  overall_wins INTEGER DEFAULT 0,
  overall_losses INTEGER DEFAULT 0,
  conference_wins INTEGER DEFAULT 0,
  conference_losses INTEGER DEFAULT 0,
  div1_non_conf_wins INTEGER DEFAULT 0,
  div1_non_conf_losses INTEGER DEFAULT 0,
  home_wins INTEGER DEFAULT 0,
  home_losses INTEGER DEFAULT 0,
  neutral_wins INTEGER DEFAULT 0,
  neutral_losses INTEGER DEFAULT 0,
  road_wins INTEGER DEFAULT 0,
  road_losses INTEGER DEFAULT 0,
  
  -- Quadrant records (overall)
  quad1_wins INTEGER DEFAULT 0,
  quad1_losses INTEGER DEFAULT 0,
  quad2_wins INTEGER DEFAULT 0,
  quad2_losses INTEGER DEFAULT 0,
  quad3_wins INTEGER DEFAULT 0,
  quad3_losses INTEGER DEFAULT 0,
  quad4_wins INTEGER DEFAULT 0,
  quad4_losses INTEGER DEFAULT 0,
  
  -- Non-conference quadrant records
  non_conf_quad1_wins INTEGER DEFAULT 0,
  non_conf_quad1_losses INTEGER DEFAULT 0,
  non_conf_quad2_wins INTEGER DEFAULT 0,
  non_conf_quad2_losses INTEGER DEFAULT 0,
  non_conf_quad3_wins INTEGER DEFAULT 0,
  non_conf_quad3_losses INTEGER DEFAULT 0,
  non_conf_quad4_wins INTEGER DEFAULT 0,
  non_conf_quad4_losses INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  game_id VARCHAR(50) PRIMARY KEY, -- Format: sport_id + date(ddmmyy) + home_team_id + away_team_id
  schedule_id VARCHAR(100), -- Format: sport_id + game_date + home_team_id + away_team_id
  game_name VARCHAR(255), -- Format: home_team_name + away_team_name + mm-dd-yy
  
  -- Team information
  home_team_id VARCHAR(20) REFERENCES teams(team_id),
  away_team_id VARCHAR(20) REFERENCES teams(team_id),
  home_team_name VARCHAR(255),
  away_team_name VARCHAR(255),
  
  -- Game details
  sport_id INTEGER REFERENCES sports(sport_id),
  game_date DATE NOT NULL,
  game_time TIME,
  site VARCHAR(20) CHECK (site IN ('home', 'away', 'neutral')),
  venue_id INTEGER REFERENCES venues(venue_id),
  
  -- Game results
  home_team_score INTEGER,
  away_team_score INTEGER,
  win_team_id VARCHAR(20),
  loss_team_id VARCHAR(20),
  game_status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  
  -- Rankings at time of game
  net_ranking_home INTEGER,
  net_ranking_away INTEGER,
  
  -- Additional metadata
  tv_network VARCHAR(100),
  attendance INTEGER,
  conference_game BOOLEAN DEFAULT FALSE,
  tournament_game BOOLEAN DEFAULT FALSE,
  tournament_name VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_teams_conference ON teams(conference_id);
CREATE INDEX idx_teams_school ON teams(school_id);
CREATE INDEX idx_teams_sport ON teams(sport_id);
CREATE INDEX idx_teams_season ON teams(season);
CREATE INDEX idx_games_date ON games(game_date);
CREATE INDEX idx_games_home_team ON games(home_team_id);
CREATE INDEX idx_games_away_team ON games(away_team_id);
CREATE INDEX idx_games_sport ON games(sport_id);
CREATE INDEX idx_games_schedule ON games(schedule_id);

-- Create function to update team records after game insertion
CREATE OR REPLACE FUNCTION update_team_records()
RETURNS TRIGGER AS $$
BEGIN
  -- This function could be implemented to automatically update team win/loss records
  -- when games are inserted or updated
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic record updates
CREATE TRIGGER update_team_records_trigger
AFTER INSERT OR UPDATE ON games
FOR EACH ROW
WHEN (NEW.game_status = 'completed')
EXECUTE FUNCTION update_team_records();

-- Add RLS policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Policy for teams (anyone can read)
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

-- Policy for games (anyone can read)
CREATE POLICY "Games are viewable by everyone" ON games
  FOR SELECT USING (true);

-- Policy for authenticated users to insert/update
CREATE POLICY "Authenticated users can manage teams" ON teams
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage games" ON games
  FOR ALL USING (auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE teams IS 'Stores team performance metrics and records for each season';
COMMENT ON TABLE games IS 'Stores individual game results and details';
COMMENT ON COLUMN teams.team_id IS 'Format: conference_id (2 digits) + school_id (2 digits) + sport_id (2 digits)';
COMMENT ON COLUMN teams.team_name IS 'Format: preferred_school_name + sport_name';
COMMENT ON COLUMN games.game_id IS 'Format: sport_id + date(ddmmyy) + home_team_id + away_team_id';
COMMENT ON COLUMN games.schedule_id IS 'Format: sport_id + game_date + home_team_id + away_team_id';
COMMENT ON COLUMN games.game_name IS 'Format: home_team_name + away_team_name + mm-dd-yy';