import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeGames() {
  console.log('🏈 Looking for game/competition data...\n');

  try {
    // Check for schedule_games table (linked to schedules)
    const { count: gamesCount, error: gamesError } = await supabase
      .from('schedule_games')
      .select('*', { count: 'exact', head: true });

    if (!gamesError) {
      console.log(`✅ Found schedule_games table with ${gamesCount} records\n`);

      // Get sample games
      const { data: games } = await supabase
        .from('schedule_games')
        .select('*')
        .limit(10)
        .order('game_date', { ascending: true });

      if (games && games.length > 0) {
        console.log('Table structure:');
        console.log('Fields:', Object.keys(games[0]).join(', '));
        console.log('\nSample games:');
        games.forEach((game) => {
          console.log(
            `- ${game.game_date}: ${game.home_team} vs ${game.away_team} (${game.sport_id})`
          );
        });

        // Get sport breakdown
        const { data: sportStats } = await supabase
          .from('schedule_games')
          .select('sport_id');

        if (sportStats) {
          const sportCounts = sportStats.reduce((acc: any, item: any) => {
            acc[item.sport_id] = (acc[item.sport_id] || 0) + 1;
            return acc;
          }, {});

          console.log('\n📊 Games by sport:');

          // Get sport names
          const sportIds = Object.keys(sportCounts);
          const { data: sports } = await supabase
            .from('sports')
            .select('sport_id, sport_name')
            .in('sport_id', sportIds);

          sports?.forEach((sport) => {
            console.log(
              `- ${sport.sport_name}: ${sportCounts[sport.sport_id]} games`
            );
          });
        }
      }
    } else {
      console.log('❌ schedule_games table not found');

      // Check for competitions table
      const { count: compCount, error: compError } = await supabase
        .from('competitions')
        .select('*', { count: 'exact', head: true });

      if (!compError) {
        console.log(`✅ Found competitions table with ${compCount} records`);
      }
    }
  } catch (error) {
    console.error('Error analyzing games:', error);
  }
}

analyzeGames();
