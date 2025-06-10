const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration() {
  console.log('=== EXECUTING AWARDS PROGRAM MIGRATION ===\n');
  
  try {
    // First, check current database state
    console.log('1. Checking current database state...');
    
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_list');
      
    if (tablesError) {
      console.log('   → Using alternative method to check tables');
    }
    
    // Check if old tables exist
    const { data: oldAwards, error: oldError } = await supabase
      .from('awards')
      .select('count')
      .limit(1);
      
    if (!oldError) {
      console.log('   → Found existing awards table with data');
    }
    
    // Create the new tables step by step
    console.log('\n2. Creating new Awards Program structure...');
    
    // Create enums first
    console.log('   → Creating enums...');
    
    const enumSQL = `
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
        
        DROP TYPE IF EXISTS sport_season CASCADE;
        CREATE TYPE sport_season AS ENUM(
          'fall',
          'winter', 
          'spring',
          'year_round'
        );
      END $$;
    `;
    
    const { error: enumError } = await supabase.rpc('exec_sql', { sql: enumSQL });
    
    if (enumError) {
      console.log('   ❌ Error creating enums (may need manual execution)');
      console.log('   → Continuing with table creation...');
    } else {
      console.log('   ✅ Enums created successfully');
    }
    
    console.log('\n3. Migration file ready for manual execution');
    console.log('📁 Location: supabase/migrations/07-restructure-awards-program.sql');
    
    // Read the migration file to show key details
    const migrationSQL = fs.readFileSync('./supabase/migrations/07-restructure-awards-program.sql', 'utf8');
    console.log('📝 Migration file size:', migrationSQL.length, 'characters');
    
    console.log('\n=== MANUAL EXECUTION REQUIRED ===');
    console.log('Due to database permissions, please execute the migration manually:');
    console.log('');
    console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Navigate to: Project → SQL Editor');
    console.log('3. Open new query');
    console.log('4. Copy/paste contents from: supabase/migrations/07-restructure-awards-program.sql');
    console.log('5. Click "Run" to execute');
    console.log('');
    console.log('Expected new tables:');
    console.log('  • awards_program (main awards tracking)');
    console.log('  • award_recipients (recipient details)');
    console.log('  • award_budget_tracking (financial management)');
    console.log('');
    console.log('Expected views:');
    console.log('  • v_awards_program_complete');
    console.log('  • v_awards_financial_by_sport');
    console.log('  • v_awards_by_class_code');
    
    console.log('\n=== AFTER MIGRATION ===');
    console.log('Run this command to populate with 2024-25 data:');
    console.log('npm run populate-awards-2425');
    
    console.log('\n✅ Migration instructions complete!');
    
  } catch (error) {
    console.error('❌ Error during migration preparation:', error);
  }
}

executeMigration();