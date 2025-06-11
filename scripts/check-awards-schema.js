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
    // Check if tables exist and their structure
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_info', { table_schema: 'public' })
      .catch(() => null);

    // Try to query awards_program table
    console.log('📋 Checking awards_program table...');
    const { data: awardsData, error: awardsError } = await supabase
      .from('awards_program')
      .select('*')
      .limit(1);

    if (awardsError) {
      console.log('❌ awards_program table error:', awardsError.message);
    } else {
      console.log('✅ awards_program table exists');
      if (awardsData.length > 0) {
        console.log('📊 Sample record columns:', Object.keys(awardsData[0]));
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
      if (budgetData.length > 0) {
        console.log('📊 Sample record columns:', Object.keys(budgetData[0]));
      }
    }

    // Check all tables in the public schema
    console.log('\n📋 Checking all tables...');
    const { data: allTables, error: allTablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (!allTablesError && allTables) {
      console.log('📊 Available tables:');
      allTables.forEach(table => console.log(`- ${table.table_name}`));
    }

    // Try a simple insert test
    console.log('\n🧪 Testing simple insert...');
    const testData = {
      award_name: 'Test Award',
      sport_name: 'Test Sport',
      sport_code: 'TEST',
      season_year: 2025,
      academic_year: '2024-25',
      class_code: 'TEST-CODE',
      vendor_name: 'Test Vendor'
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('awards_program')
      .insert(testData)
      .select();

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
      console.log('💡 Error details:', insertError.details);
      console.log('💡 Error hint:', insertError.hint);
    } else {
      console.log('✅ Insert test successful');
      
      // Clean up test record
      await supabase
        .from('awards_program')
        .delete()
        .eq('award_name', 'Test Award');
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Run the script
checkSchema()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });