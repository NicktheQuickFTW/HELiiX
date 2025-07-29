import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBasketballData() {
  console.log('🏀 Setting up Basketball Data...\n');

  try {
    // Step 1: Check if conferences table exists and insert data
    console.log('📋 Setting up conferences...');
    const conferenceData = [
      {
        conference_id: 1,
        conference_name: 'Big 12 Conference',
        conference_abbreviation: 'XII',
      },
      {
        conference_id: 2,
        conference_name: 'Atlantic Coast Conference',
        conference_abbreviation: 'ACC',
      },
      {
        conference_id: 3,
        conference_name: 'Big Ten Conference',
        conference_abbreviation: 'B1G',
      },
      {
        conference_id: 4,
        conference_name: 'Southeastern Conference',
        conference_abbreviation: 'SEC',
      },
    ];

    const { error: confError } = await supabase
      .from('conferences')
      .upsert(conferenceData, { onConflict: 'conference_id' });

    if (confError) {
      console.log(
        '⚠️  Conferences table might not exist yet. Please run the migration first.'
      );
      console.log(
        'Go to: https://supabase.com/dashboard/project/vfzgnvcwakjxtdsaedfq/sql'
      );
      console.log(
        'And execute the content from: supabase/migrations/10-team-sheets-and-games.sql\n'
      );
      return;
    } else {
      console.log('✅ Conferences set up successfully');
    }

    // Step 2: Check schools table
    console.log('\n📋 Checking schools table...');
    const { data: schools, error: schoolError } = await supabase
      .from('schools')
      .select('school_id, school_name, school_abbreviation')
      .order('school_id');

    if (!schoolError && schools) {
      console.log(`✅ Found ${schools.length} schools`);

      // Display Big 12 schools
      const big12Schools = schools.filter(
        (s) => s.school_id >= 1 && s.school_id <= 16
      );
      console.log('\nBig 12 Schools:');
      big12Schools.forEach((school) => {
        console.log(
          `  ${school.school_id}: ${school.school_name} (${school.school_abbreviation})`
        );
      });
    }

    // Step 3: Import sample Big 12 team data
    console.log("\n📋 Importing Big 12 Men's Basketball teams...");

    // Sample data for demonstration - replace with actual data from team sheets
    const big12Teams = [
      {
        team_id: '010102', // Conference 01 + School 01 + Sport 02
        team_name: "Arizona Men's Basketball",
        conference_id: 1,
        school_id: 1,
        sport_id: 2,
        sport_name: "Men's Basketball",
        season: '2024-25',
        overall_wins: 24,
        overall_losses: 11,
        conference_wins: 14,
        conference_losses: 6,
        net_ranking: 18,
      },
      {
        team_id: '010202', // Conference 01 + School 02 + Sport 02
        team_name: "Arizona State Men's Basketball",
        conference_id: 1,
        school_id: 2,
        sport_id: 2,
        sport_name: "Men's Basketball",
        season: '2024-25',
        overall_wins: 13,
        overall_losses: 20,
        conference_wins: 4,
        conference_losses: 16,
        net_ranking: 150,
      },
      // Add more teams as needed
    ];

    const { error: teamError } = await supabase
      .from('teams')
      .upsert(big12Teams, { onConflict: 'team_id' });

    if (teamError) {
      console.error('Error inserting teams:', teamError);
    } else {
      console.log('✅ Teams imported successfully');
    }

    // Step 4: Display current status
    console.log('\n📊 Current Database Status:');

    const { count: teamCount } = await supabase
      .from('teams')
      .select('*', { count: 'exact', head: true });

    const { count: gameCount } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true });

    console.log(`- Teams: ${teamCount || 0} records`);
    console.log(`- Games: ${gameCount || 0} records`);

    console.log('\n✅ Setup complete!');
    console.log('\nNext steps:');
    console.log('1. Extract data from the PNG team sheets');
    console.log('2. Update the team data with actual values');
    console.log('3. Import game data from the FlexTime SQL files');
  } catch (error) {
    console.error('Error:', error);
  }
}

setupBasketballData();
