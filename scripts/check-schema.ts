import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('📊 Checking database schema...\n');

  try {
    // Get column information for teams table
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'teams')
      .order('ordinal_position');

    if (error) {
      console.error('Error fetching schema:', error);
      return;
    }

    console.log('Teams table columns:');
    columns?.forEach((col) => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    // Get some sample data
    const { data: teams, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .limit(5);

    if (!teamError && teams && teams.length > 0) {
      console.log('\nSample team data:');
      console.log(JSON.stringify(teams[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();
