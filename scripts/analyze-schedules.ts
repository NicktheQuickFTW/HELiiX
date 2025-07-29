import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeSchedules() {
  console.log('🗓️  Analyzing schedules table...\n');

  try {
    // First check if table exists
    const { count, error: countError } = await supabase
      .from('schedules')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error accessing schedules table:', countError.message);

      // Try alternative table names
      const alternativeNames = [
        'schedule',
        'games',
        'events',
        'competitions',
        'matches',
      ];
      console.log('\n🔍 Checking alternative table names...\n');

      for (const tableName of alternativeNames) {
        const { count: altCount, error: altError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (!altError) {
          console.log(`✅ Found table: ${tableName} with ${altCount} records`);

          // Get sample data
          const { data: sample } = await supabase
            .from(tableName)
            .select('*')
            .limit(5);

          if (sample && sample.length > 0) {
            console.log(`\nTable structure for ${tableName}:`);
            console.log('Fields:', Object.keys(sample[0]).join(', '));
            console.log('\nSample data:');
            console.log(JSON.stringify(sample, null, 2));
          }
        }
      }

      return;
    }

    console.log(`✅ Schedules table found with ${count} records\n`);

    // Get table structure
    const { data: sample, error: sampleError } = await supabase
      .from('schedules')
      .select('*')
      .limit(5);

    if (!sampleError && sample && sample.length > 0) {
      console.log('Table structure:');
      console.log('Fields:', Object.keys(sample[0]).join(', '));
      console.log('\nSample data:');
      console.log(JSON.stringify(sample, null, 2));
    }

    // Get some statistics
    const { data: stats } = await supabase
      .from('schedules')
      .select('sport_id, count')
      .limit(100);

    if (stats) {
      console.log('\n📊 Schedule statistics:');
      // Group by sport if sport_id exists
      const sportCounts = stats.reduce((acc: any, item: any) => {
        if (item.sport_id) {
          acc[item.sport_id] = (acc[item.sport_id] || 0) + 1;
        }
        return acc;
      }, {});

      Object.entries(sportCounts).forEach(([sport, count]) => {
        console.log(`- Sport ${sport}: ${count} games`);
      });
    }
  } catch (error) {
    console.error('Error analyzing schedules:', error);
  }
}

analyzeSchedules();
