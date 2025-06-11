#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSportTable() {
  console.log('🔍 Checking sport table for numeric sport_ids...\n');

  try {
    // Check sports table
    const { data: sportsData, error: sportsError } = await supabase
      .from('sports')
      .select('*')
      .order('sport_id');

    if (sportsError) {
      console.log('❌ Error accessing sports table:', sportsError.message);
      
      // Try alternative table names
      const altTables = ['sport', 'big12_sports', 'conference_sports'];
      for (const tableName of altTables) {
        console.log(`🔍 Trying table: ${tableName}`);
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(5);
          
        if (!error && data) {
          console.log(`✅ Found table: ${tableName}`);
          console.log('Sample data:', data);
          break;
        }
      }
    } else {
      console.log('✅ Sports table found!');
      console.log(`📊 Total sports: ${sportsData.length}\n`);
      
      console.log('🏆 Sport ID Mappings:');
      sportsData.forEach(sport => {
        console.log(`${String(sport.sport_id).padStart(2, '0')}: ${sport.sport_name || sport.name} (${sport.sport_code || sport.code || 'N/A'})`);
      });
      
      return sportsData;
    }

    // Also check for any award-related tables
    console.log('\n🏅 Checking for award tables...');
    const awardTables = ['awards', 'award_types', 'awards_program', 'award_categories'];
    for (const tableName of awardTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);
        
      if (!error && data) {
        console.log(`✅ Found table: ${tableName}`);
        if (data.length > 0) {
          console.log('Sample columns:', Object.keys(data[0]));
          console.log('Sample data:', data[0]);
        }
      }
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the script
checkSportTable()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });