#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addInvoiceColumns() {
  console.log('🔧 Adding award-specific columns to invoices table...\n');

  const alterTableSQL = `
    -- Add columns for award tracking to invoices table
    ALTER TABLE invoices 
    ADD COLUMN IF NOT EXISTS sport_id INTEGER REFERENCES sports(sport_id),
    ADD COLUMN IF NOT EXISTS sport_code VARCHAR(10),
    ADD COLUMN IF NOT EXISTS award_type VARCHAR(20) CHECK (award_type IN ('championship', 'regular_season', 'academic', 'special')),
    ADD COLUMN IF NOT EXISTS class_code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS supervisor VARCHAR(50),
    ADD COLUMN IF NOT EXISTS award_description TEXT,
    ADD COLUMN IF NOT EXISTS award_id_new VARCHAR(20), -- New award ID format: 01-01-01-2026
    ADD COLUMN IF NOT EXISTS academic_year VARCHAR(10),
    ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS unit_cost INTEGER, -- in cents
    ADD COLUMN IF NOT EXISTS tax_amount INTEGER DEFAULT 0, -- in cents
    ADD COLUMN IF NOT EXISTS shipping_cost INTEGER DEFAULT 0; -- in cents
    
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
  `;

  try {
    console.log('📝 Executing ALTER TABLE statement...');
    
    // Split the SQL into individual statements and execute them
    const statements = alterTableSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.includes('ALTER TABLE')) {
        console.log(`🔧 Adding columns...`);
        
        // For Supabase, we need to use raw SQL
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });

        if (error) {
          console.log('❌ Error with RPC, trying direct approach...');
          console.log('Statement:', statement);
          console.log('Error:', error.message);
        } else {
          console.log('✅ Columns added successfully');
        }
      }
    }

    // Test the new structure
    console.log('\n🧪 Testing updated table structure...');
    const { data: testData, error: testError } = await supabase
      .from('invoices')
      .select('*')
      .limit(1);

    if (!testError && testData) {
      console.log('📊 Updated table columns:');
      if (testData.length > 0) {
        const columns = Object.keys(testData[0]);
        columns.forEach(col => {
          console.log(`  - ${col}`);
        });
      }
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
    
    // Provide manual SQL for user to run
    console.log('\n📋 Manual SQL to run in Supabase SQL Editor:');
    console.log(alterTableSQL);
  }
}

// Run the script
addInvoiceColumns()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });