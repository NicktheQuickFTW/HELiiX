#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function executeMigration() {
  console.log('🚀 Executing account code migration and cleanup...\n');

  try {
    // First, delete mock data
    console.log('🗑️  Cleaning up mock/test invoices...');
    
    const mockPatterns = [
      { column: 'invoice_number', operator: 'like', value: 'AWD-%' },
      { column: 'invoice_number', operator: 'like', value: 'INV-2025-%' },
      { column: 'vendor_name', operator: 'eq', value: 'TBD - Awards Vendor' },
      { column: 'vendor_name', operator: 'eq', value: 'Big 12 Conference' }
    ];

    let totalDeleted = 0;
    for (const pattern of mockPatterns) {
      let query = supabase.from('invoices').delete();
      
      if (pattern.operator === 'like') {
        query = query.like(pattern.column, pattern.value);
      } else {
        query = query.eq(pattern.column, pattern.value);
      }
      
      const { data, error, count } = await query.select('invoice_number');
      
      if (!error && data) {
        console.log(`  Deleted ${data.length} invoices matching ${pattern.column} ${pattern.operator} '${pattern.value}'`);
        totalDeleted += data.length;
      }
    }
    
    console.log(`\n✅ Deleted ${totalDeleted} mock invoices total`);

    // Check remaining invoices
    const { data: remaining, count } = await supabase
      .from('invoices')
      .select('invoice_number, vendor_name', { count: 'exact' });
    
    console.log(`\n📊 Remaining invoices: ${count}`);
    
    // Show vendor summary
    const vendorSummary = {};
    remaining.forEach(inv => {
      vendorSummary[inv.vendor_name] = (vendorSummary[inv.vendor_name] || 0) + 1;
    });
    
    console.log('\n📋 Invoices by vendor:');
    Object.entries(vendorSummary).forEach(([vendor, count]) => {
      console.log(`  ${vendor}: ${count} invoices`);
    });

    console.log('\n⚠️  IMPORTANT: To add the account_code column, run this SQL in Supabase Dashboard:');
    console.log('\n--- Copy below this line ---\n');
    console.log(`-- Add account_code column to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS account_code VARCHAR(10);

-- Add comment for documentation  
COMMENT ON COLUMN invoices.account_code IS 'Big 12 account code (e.g., 4105 for Awards, 4170 for Lodging)';

-- Update all Jostens invoices with Awards account code
UPDATE invoices 
SET account_code = '4105' 
WHERE vendor_name = 'Jostens';`);
    console.log('\n--- Copy above this line ---');

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the script
executeMigration()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });