import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkMBBData() {
  console.log("🏀 Checking 2024-25 Men's Basketball Data...\n");

  try {
    // Check if teams table exists and get MBB data
    const { data: teams, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('sport_id', 2) // Men's Basketball
      .eq('season', '2024-25')
      .order('conference_wins', { ascending: false });

    if (teamError) {
      if (teamError.code === '42P01') {
        console.log('❌ Teams table does not exist yet.');
        console.log(
          'Please run the migration at: supabase/migrations/10-team-sheets-and-games.sql\n'
        );
        return;
      }
      console.error('Error fetching teams:', teamError);
      return;
    }

    if (!teams || teams.length === 0) {
      console.log(
        "⚠️  No 2024-25 Men's Basketball data found in the database."
      );
      console.log('\nTo import data:');
      console.log(
        '1. Run the migration: supabase/migrations/10-team-sheets-and-games.sql'
      );
      console.log('2. Use scripts/import-mbb-team-data.ts to import team data');
      return;
    }

    // Display team standings
    console.log("📊 Big 12 Men's Basketball Standings (2024-25 Season)\n");
    console.log(
      'Team                           | Conf W-L  | Overall  | NET | RPI'
    );
    console.log(
      '-------------------------------|-----------|----------|-----|-----'
    );

    teams.forEach((team) => {
      const teamName = team.team_name.padEnd(30);
      const confRecord =
        `${team.conference_wins}-${team.conference_losses}`.padEnd(9);
      const overallRecord =
        `${team.overall_wins}-${team.overall_losses}`.padEnd(8);
      const netRank = (team.net_ranking || '-').toString().padEnd(3);
      const rpiRank = (team.rpi_ranking || '-').toString().padEnd(3);

      console.log(
        `${teamName} | ${confRecord} | ${overallRecord} | ${netRank} | ${rpiRank}`
      );
    });

    // Check for games data
    const {
      data: games,
      error: gameError,
      count: gameCount,
    } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })
      .eq('sport_id', 2)
      .gte('game_date', '2024-07-01')
      .lte('game_date', '2025-06-30');

    if (!gameError) {
      console.log(`\n📅 Total Games in Database: ${gameCount || 0}`);
    }

    // Get recent games
    const { data: recentGames, error: recentError } = await supabase
      .from('games')
      .select('*')
      .eq('sport_id', 2)
      .eq('game_status', 'completed')
      .gte('game_date', '2024-07-01')
      .order('game_date', { ascending: false })
      .limit(5);

    if (recentGames && recentGames.length > 0) {
      console.log('\n🏆 Recent Game Results:');
      recentGames.forEach((game) => {
        const date = new Date(game.game_date).toLocaleDateString();
        console.log(
          `${date}: ${game.home_team_name} ${game.home_team_score} - ${game.away_team_score} ${game.away_team_name}`
        );
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkMBBData();
