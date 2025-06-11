-- Add award-specific columns to existing invoices table
-- Run this in Supabase SQL Editor

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS sport_id INTEGER,
ADD COLUMN IF NOT EXISTS sport_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS award_type VARCHAR(20) CHECK (award_type IN ('championship', 'regular_season', 'academic', 'special')),
ADD COLUMN IF NOT EXISTS class_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS supervisor VARCHAR(50),
ADD COLUMN IF NOT EXISTS award_description TEXT,
ADD COLUMN IF NOT EXISTS award_id_new VARCHAR(20), -- New format: 01-01-01-2026
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(10),
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS unit_cost INTEGER, -- in cents
ADD COLUMN IF NOT EXISTS tax_amount INTEGER DEFAULT 0, -- in cents
ADD COLUMN IF NOT EXISTS shipping_cost INTEGER DEFAULT 0; -- in cents

-- Add foreign key constraint to sports table
ALTER TABLE invoices 
ADD CONSTRAINT fk_invoices_sport 
FOREIGN KEY (sport_id) REFERENCES sports(sport_id);

-- Add comments for documentation
COMMENT ON COLUMN invoices.sport_id IS '2-digit sport ID from sports table';
COMMENT ON COLUMN invoices.sport_code IS 'Sport abbreviation: BSB, BVB, EQ, etc.';
COMMENT ON COLUMN invoices.award_type IS 'championship, regular_season, academic, special';
COMMENT ON COLUMN invoices.class_code IS 'Big 12 class code: S-050-00-HB-0, S-060-00-BV-W, etc.';
COMMENT ON COLUMN invoices.supervisor IS 'Budget supervisor: Lizzie, Scott, etc.';
COMMENT ON COLUMN invoices.award_description IS 'Award description: Championship Trophy, MOP, etc.';
COMMENT ON COLUMN invoices.award_id_new IS 'New award ID format: 01-01-01-2026';
COMMENT ON COLUMN invoices.academic_year IS 'Academic year: 2024-25, 2025-26, etc.';
COMMENT ON COLUMN invoices.quantity IS 'Number of awards in this invoice line';
COMMENT ON COLUMN invoices.unit_cost IS 'Cost per unit in cents';
COMMENT ON COLUMN invoices.tax_amount IS 'Tax amount in cents';
COMMENT ON COLUMN invoices.shipping_cost IS 'Shipping cost in cents';