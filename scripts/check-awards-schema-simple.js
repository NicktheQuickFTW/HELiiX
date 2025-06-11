#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSchema() {
  console.log('🔍 Checking awards table schema...\n');

  try {
    // Try to query awards_program table
    console.log('📋 Checking awards_program table...');
    const { data: awardsData, error: awardsError } = await supabase
      .from('awards_program')
      .select('*')
      .limit(1);

    if (awardsError) {
      console.log('❌ awards_program table error:', awardsError.message);
      console.log('Details:', JSON.stringify(awardsError, null, 2));
    } else {
      console.log('✅ awards_program table exists');
      if (awardsData && awardsData.length > 0) {
        console.log('📊 Sample record columns:', Object.keys(awardsData[0]));
      } else {
        console.log('📊 Table is empty - no sample data');
      }
    }

    // Check award_budget_tracking table
    console.log('\n📋 Checking award_budget_tracking table...');
    const { data: budgetData, error: budgetError } = await supabase
      .from('award_budget_tracking')
      .select('*')
      .limit(1);

    if (budgetError) {
      console.log('❌ award_budget_tracking table error:', budgetError.message);
    } else {
      console.log('✅ award_budget_tracking table exists');
      if (budgetData && budgetData.length > 0) {
        console.log('📊 Sample record columns:', Object.keys(budgetData[0]));
      } else {
        console.log('📊 Table is empty - no sample data');
      }
    }

    // Try a simple insert test
    console.log('\n🧪 Testing simple insert with minimal data...');
    const testData = {
      award_name: 'Test Award',
      sport_name: 'Test Sport',
      sport_code: 'TEST',
      season_year: 2025
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('awards_program')
      .insert(testData)
      .select();

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
      if (insertError.details) console.log('💡 Error details:', insertError.details);
      if (insertError.hint) console.log('💡 Error hint:', insertError.hint);
      if (insertError.code) console.log('💡 Error code:', insertError.code);
    } else {
      console.log('✅ Insert test successful');
      console.log('🔧 Inserted record:', insertTest);
      
      // Clean up test record
      if (insertTest && insertTest.length > 0) {
        await supabase
          .from('awards_program')
          .delete()
          .eq('id', insertTest[0].id);
        console.log('🧹 Cleaned up test record');
      }
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the script
checkSchema()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });