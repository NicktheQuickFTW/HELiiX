#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addAccountColumn() {
  console.log('🔧 Adding account_code column to invoices table...\n');

  try {
    // First, let's add the column using raw SQL
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE invoices 
        ADD COLUMN IF NOT EXISTS account_code VARCHAR(10);
        
        COMMENT ON COLUMN invoices.account_code IS 'Big 12 account code (e.g., 4105 for Awards, 4170 for Lodging)';
      `
    });

    if (alterError) {
      console.log('⚠️  Could not add column via RPC, trying direct approach...');
      
      // If RPC doesn't work, we'll update existing records to test
      const { data: testData, error: testError } = await supabase
        .from('invoices')
        .select('invoice_id')
        .limit(1);
      
      if (testError) {
        console.error('❌ Error accessing invoices table:', testError);
        return;
      }
    }

    console.log('✅ Account column addition attempted');
    
    // Update all Jostens invoices with account code 4105 (Awards)
    console.log('\n📝 Updating Jostens invoices with account code 4105...');
    
    const { data: updatedInvoices, error: updateError } = await supabase
      .from('invoices')
      .update({ account_code: '4105' })
      .eq('vendor_name', 'Jostens')
      .select('invoice_number, account_code');

    if (updateError) {
      console.error('❌ Error updating invoices:', updateError);
      console.log('\n💡 You may need to run this SQL in Supabase dashboard:');
      console.log(`
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS account_code VARCHAR(10);

COMMENT ON COLUMN invoices.account_code IS 'Big 12 account code (e.g., 4105 for Awards, 4170 for Lodging)';

-- Update all Jostens invoices with Awards account code
UPDATE invoices 
SET account_code = '4105' 
WHERE vendor_name = 'Jostens';
      `);
    } else {
      console.log(`✅ Updated ${updatedInvoices?.length || 0} invoices with account code 4105`);
      
      // Show summary
      const { data: summary, error: summaryError } = await supabase
        .from('invoices')
        .select('account_code, vendor_name')
        .not('account_code', 'is', null);
      
      if (!summaryError && summary) {
        const accountSummary = {};
        summary.forEach(inv => {
          const key = `${inv.account_code} - ${inv.vendor_name}`;
          accountSummary[key] = (accountSummary[key] || 0) + 1;
        });
        
        console.log('\n📊 Account code summary:');
        Object.entries(accountSummary).forEach(([key, count]) => {
          console.log(`  ${key}: ${count} invoices`);
        });
      }
    }

    // Update the invoice loader to include account_code
    console.log('\n💡 Note: Update the invoice loader to include account_code mapping:');
    console.log('  - 4105: Awards (trophies, medals, plaques)');
    console.log('  - 4170: Lodging and meals');
    console.log('  - 4262: Rental - event facility');
    console.log('  - 4325: Video and TV production');
    console.log('  - etc.');

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the script
addAccountColumn()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });