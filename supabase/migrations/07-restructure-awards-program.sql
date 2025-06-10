-- HELiiX Awards Program - Complete Restructure
-- Version: 2.0
-- Date: 2025-06-10
-- Description: Restructures awards system with comprehensive program tracking

-- ========================================
-- Drop existing tables and recreate with better structure
-- ========================================

-- Drop existing tables in correct order (foreign keys first)
DROP TABLE IF EXISTS award_recipients CASCADE;
DROP TABLE IF EXISTS awards CASCADE;

-- ========================================
-- Create enhanced Awards Program table
-- ========================================

-- Create improved status enum
DO $$ 
BEGIN
  DROP TYPE IF EXISTS award_status CASCADE;
  CREATE TYPE award_status AS ENUM(
    'planned',
    'approved', 
    'ordered',
    'in_production',
    'shipped',
    'delivered',
    'distributed',
    'completed',
    'cancelled'
  );
END $$;

-- Create award type enum
DO $$ 
BEGIN
  DROP TYPE IF EXISTS award_type_enum CASCADE;
  CREATE TYPE award_type_enum AS ENUM(
    'championship_trophy',
    'tournament_trophy',
    'regular_season_trophy',
    'player_of_year',
    'coach_of_year',
    'freshman_of_year',
    'newcomer_of_year',
    'defensive_player',
    'offensive_player',
    'scholar_athlete',
    'all_conference_first',
    'all_conference_second',
    'all_conference_honorable',
    'most_outstanding_player',
    'sixth_man',
    'most_improved',
    'team_award',
    'individual_recognition',
    'academic_honor',
    'sportsmanship',
    'milestone_achievement',
    'hall_of_fame',
    'medallion',
    'other'
  );
END $$;

-- Create sport season enum
DO $$ 
BEGIN
  DROP TYPE IF EXISTS sport_season CASCADE;
  CREATE TYPE sport_season AS ENUM(
    'fall',
    'winter', 
    'spring',
    'year_round'
  );
END $$;

-- Create main Awards Program table
CREATE TABLE awards_program (
  id SERIAL PRIMARY KEY,
  
  -- Basic Award Information
  award_name TEXT NOT NULL,
  award_description TEXT,
  award_type award_type_enum NOT NULL,
  status award_status DEFAULT 'planned' NOT NULL,
  
  -- Sport & Competition Details
  sport_name TEXT NOT NULL,
  sport_code VARCHAR(10) NOT NULL, -- BB, FB, SB, etc.
  sport_gender CHAR(1) CHECK (sport_gender IN ('M', 'W', 'X')), -- M/W/X(mixed)
  sport_season sport_season,
  competition_level TEXT, -- 'Conference', 'National', 'Regional'
  
  -- Season & Timeline
  season_year INTEGER NOT NULL,
  academic_year VARCHAR(10), -- '2024-25', '2025-26'
  award_date DATE,
  ceremony_date DATE,
  deadline_date DATE,
  
  -- Financial & Procurement
  class_code VARCHAR(20) NOT NULL, -- S-050-00-BB-M format
  account_code VARCHAR(20) DEFAULT '4105', -- Big 12 account system
  unit_cost INTEGER, -- in cents
  tax_rate DECIMAL(5,4) DEFAULT 0.05,
  total_cost INTEGER, -- in cents, includes tax
  quantity_ordered INTEGER DEFAULT 0,
  quantity_received INTEGER DEFAULT 0,
  
  -- Vendor & Production
  vendor_name TEXT,
  vendor_contact_info JSONB,
  production_timeline JSONB, -- {estimated_days, rush_available, etc}
  shipping_method TEXT,
  
  -- Award Physical Details
  award_material TEXT, -- 'Crystal', 'Metal', 'Acrylic', etc.
  award_dimensions TEXT, -- '12" x 8" x 3"'
  award_weight TEXT,
  engraving_details TEXT,
  packaging_type TEXT,
  
  -- Recipients & Distribution
  recipient_count INTEGER DEFAULT 0,
  recipient_type TEXT, -- 'individual', 'team', 'coach', 'school'
  distribution_method TEXT, -- 'direct_ship', 'conference_pickup', 'ceremony'
  
  -- Images & Documents
  award_image_url TEXT,
  design_files JSONB, -- URLs to design files, proofs, etc.
  documentation JSONB, -- Order confirmations, shipping docs, etc.
  
  -- Notes & Special Instructions
  special_instructions TEXT,
  internal_notes TEXT,
  public_description TEXT, -- For press releases, etc.
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  created_by TEXT,
  last_modified_by TEXT
);

-- ========================================
-- Create Award Recipients table
-- ========================================
CREATE TABLE award_recipients (
  id SERIAL PRIMARY KEY,
  award_id INTEGER REFERENCES awards_program(id) ON DELETE CASCADE,
  
  -- Recipient Details
  recipient_name TEXT NOT NULL,
  recipient_type VARCHAR(20) CHECK (recipient_type IN ('individual', 'team', 'coach', 'staff', 'school')),
  
  -- School & Team Information
  school_id INTEGER, -- Will reference schools table when created
  school_name TEXT NOT NULL,
  school_code VARCHAR(10),
  team_name TEXT,
  
  -- Individual Details (for players/coaches)
  position_title TEXT, -- 'Point Guard', 'Head Coach', 'Assistant AD'
  jersey_number INTEGER,
  class_year VARCHAR(20), -- 'Senior', 'Junior', 'Graduate'
  
  -- Achievement Context
  achievement_details JSONB, -- Stats, records, accomplishments
  selection_criteria TEXT,
  voting_details JSONB, -- How they were selected
  
  -- Award Specific
  award_presentation_date DATE,
  presenter_name TEXT,
  ceremony_location TEXT,
  media_coverage JSONB, -- Links to coverage, photos, etc.
  
  -- Shipping & Distribution
  shipping_contact TEXT,
  shipping_address JSONB, -- Full address object
  tracking_number TEXT,
  delivery_status TEXT,
  delivery_date DATE,
  delivery_confirmation JSONB,
  
  -- Historical Context
  previous_winners JSONB, -- Historical context
  award_significance TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- ========================================
-- Create Award Budget Tracking table
-- ========================================
CREATE TABLE award_budget_tracking (
  id SERIAL PRIMARY KEY,
  award_id INTEGER REFERENCES awards_program(id) ON DELETE CASCADE,
  
  -- Budget Information
  fiscal_year VARCHAR(10) NOT NULL,
  budget_category TEXT, -- 'Championships', 'Regular Season', 'Special Events'
  budgeted_amount INTEGER, -- in cents
  actual_cost INTEGER, -- in cents
  variance INTEGER, -- budgeted - actual
  
  -- Procurement Details
  purchase_order_number TEXT,
  invoice_number TEXT,
  vendor_invoice_amount INTEGER,
  tax_amount INTEGER,
  shipping_cost INTEGER,
  
  -- Payment Tracking
  payment_status TEXT CHECK (payment_status IN ('pending', 'approved', 'paid', 'overdue')),
  payment_date DATE,
  payment_method TEXT,
  
  -- Approval Workflow
  requested_by TEXT,
  approved_by TEXT,
  approval_date DATE,
  approval_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- Create comprehensive indexes
-- ========================================

-- Awards Program indexes
CREATE INDEX idx_awards_program_sport ON awards_program(sport_code, sport_gender);
CREATE INDEX idx_awards_program_season ON awards_program(season_year, academic_year);
CREATE INDEX idx_awards_program_status ON awards_program(status);
CREATE INDEX idx_awards_program_class_code ON awards_program(class_code);
CREATE INDEX idx_awards_program_award_type ON awards_program(award_type);
CREATE INDEX idx_awards_program_award_date ON awards_program(award_date DESC);
CREATE INDEX idx_awards_program_vendor ON awards_program(vendor_name);

-- Recipients indexes
CREATE INDEX idx_recipients_award_id ON award_recipients(award_id);
CREATE INDEX idx_recipients_school ON award_recipients(school_name, school_code);
CREATE INDEX idx_recipients_name ON award_recipients(recipient_name);
CREATE INDEX idx_recipients_type ON award_recipients(recipient_type);
CREATE INDEX idx_recipients_season ON award_recipients(award_presentation_date DESC);

-- Budget tracking indexes
CREATE INDEX idx_budget_award_id ON award_budget_tracking(award_id);
CREATE INDEX idx_budget_fiscal_year ON award_budget_tracking(fiscal_year);
CREATE INDEX idx_budget_status ON award_budget_tracking(payment_status);
CREATE INDEX idx_budget_po ON award_budget_tracking(purchase_order_number);

-- ========================================
-- Create comprehensive views
-- ========================================

-- Complete awards overview
CREATE OR REPLACE VIEW v_awards_program_complete AS
SELECT 
  ap.*,
  COUNT(DISTINCT ar.id) as total_recipients,
  STRING_AGG(DISTINCT ar.recipient_name, ', ' ORDER BY ar.recipient_name) as recipient_list,
  STRING_AGG(DISTINCT ar.school_name, ', ' ORDER BY ar.school_name) as schools_represented,
  abt.budgeted_amount,
  abt.actual_cost,
  abt.variance,
  abt.payment_status,
  CASE 
    WHEN ap.class_code LIKE 'S-050%' THEN 'Regular Season'
    WHEN ap.class_code LIKE 'S-060%' THEN 'Championship'
    ELSE 'Other'
  END as award_category
FROM awards_program ap
LEFT JOIN award_recipients ar ON ap.id = ar.award_id
LEFT JOIN award_budget_tracking abt ON ap.id = abt.award_id
GROUP BY 
  ap.id, 
  abt.budgeted_amount, 
  abt.actual_cost, 
  abt.variance, 
  abt.payment_status;

-- Financial summary by sport
CREATE OR REPLACE VIEW v_awards_financial_by_sport AS
SELECT 
  ap.sport_name,
  ap.sport_code,
  ap.sport_gender,
  ap.season_year,
  COUNT(DISTINCT ap.id) as award_count,
  SUM(ap.total_cost * ap.quantity_ordered) as total_budget,
  SUM(abt.actual_cost) as total_spent,
  SUM(abt.budgeted_amount - COALESCE(abt.actual_cost, 0)) as budget_variance,
  COUNT(DISTINCT ar.id) as total_recipients
FROM awards_program ap
LEFT JOIN award_budget_tracking abt ON ap.id = abt.award_id
LEFT JOIN award_recipients ar ON ap.id = ar.award_id
GROUP BY 
  ap.sport_name,
  ap.sport_code, 
  ap.sport_gender,
  ap.season_year
ORDER BY 
  ap.season_year DESC,
  ap.sport_name;

-- Class code summary
CREATE OR REPLACE VIEW v_awards_by_class_code AS
SELECT 
  ap.class_code,
  CASE 
    WHEN ap.class_code LIKE 'S-050%' THEN 'Regular Season (RS)'
    WHEN ap.class_code LIKE 'S-060%' THEN 'Championship (CC)'
    ELSE 'Other'
  END as classification,
  ap.sport_name,
  ap.sport_gender,
  COUNT(DISTINCT ap.id) as award_types,
  SUM(ap.quantity_ordered) as total_quantity,
  SUM(ap.total_cost * ap.quantity_ordered) as total_value,
  COUNT(DISTINCT ar.id) as total_recipients
FROM awards_program ap
LEFT JOIN award_recipients ar ON ap.id = ar.award_id
GROUP BY 
  ap.class_code,
  ap.sport_name,
  ap.sport_gender
ORDER BY 
  ap.class_code;

-- ========================================
-- Update triggers
-- ========================================
CREATE TRIGGER update_awards_program_updated_at 
BEFORE UPDATE ON awards_program
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_award_recipients_updated_at 
BEFORE UPDATE ON award_recipients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_award_budget_tracking_updated_at 
BEFORE UPDATE ON award_budget_tracking
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Row Level Security
-- ========================================
ALTER TABLE awards_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_budget_tracking ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Allow read access for authenticated users" ON awards_program
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for authenticated users" ON award_recipients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for authenticated users" ON award_budget_tracking
  FOR SELECT TO authenticated USING (true);

-- Service role policies
CREATE POLICY "Service role has full access" ON awards_program
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access" ON award_recipients
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access" ON award_budget_tracking
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ========================================
-- Table comments
-- ========================================
COMMENT ON TABLE awards_program IS 'Comprehensive Big 12 Awards Program tracking system';
COMMENT ON TABLE award_recipients IS 'Detailed recipient tracking with school and achievement context';
COMMENT ON TABLE award_budget_tracking IS 'Financial tracking and budget management for awards';

COMMENT ON COLUMN awards_program.class_code IS 'Big 12 financial class code: S-050 (Regular Season), S-060 (Championship)';
COMMENT ON COLUMN awards_program.account_code IS 'Big 12 account code (4105 - Awards)';
COMMENT ON COLUMN awards_program.unit_cost IS 'Cost per unit in cents';
COMMENT ON COLUMN awards_program.total_cost IS 'Total cost including tax in cents';
COMMENT ON COLUMN award_recipients.achievement_details IS 'JSON with stats, records, accomplishments';
COMMENT ON COLUMN award_budget_tracking.variance IS 'Budget variance: budgeted - actual (positive = under budget)';

-- ========================================
-- Sample data structure examples (commented)
-- ========================================
/*
-- Example award entry:
INSERT INTO awards_program (
  award_name, award_description, award_type, sport_name, sport_code, sport_gender,
  season_year, academic_year, class_code, unit_cost, total_cost, quantity_ordered
) VALUES (
  'Big 12 Player of the Year - Men''s Basketball',
  'Annual award recognizing the outstanding player in Big 12 men''s basketball',
  'player_of_year',
  'Men''s Basketball', 'BB', 'M',
  2025, '2024-25', 'S-050-00-BB-M',
  15000, 15750, 1
);

-- Example recipient entry:
INSERT INTO award_recipients (
  award_id, recipient_name, recipient_type, school_name, school_code,
  position_title, class_year, achievement_details
) VALUES (
  1, 'John Smith', 'individual', 'University of Kansas', 'KU',
  'Point Guard', 'Senior', 
  '{"ppg": 18.5, "apg": 6.2, "fg_pct": 0.485, "leadership": "Team Captain"}'::jsonb
);
*/