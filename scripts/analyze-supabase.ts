import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeSupabase() {
  console.log('🔍 Connecting to Supabase...\n');
  console.log(`URL: ${supabaseUrl}\n`);

  try {
    // Get all tables from the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      // Try alternative approach - query known tables
      console.log('📋 Checking known tables...\n');

      const knownTables = [
        'user_profiles',
        'user_audit_log',
        'user_sessions',
        'password_reset_tokens',
        'user_invitations',
        'awards',
        'awards_schools',
        'documents',
        'events',
        'schools',
        'sports',
        'venues',
        'travel_parties',
        'accommodations',
        'meals',
        'transportation',
        'budget_items',
        'expense_reports',
      ];

      for (const table of knownTables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

          if (!error) {
            console.log(`✅ ${table}: ${count} records`);

            // Get sample data for each table
            const { data: sample } = await supabase
              .from(table)
              .select('*')
              .limit(3);

            if (sample && sample.length > 0) {
              console.log(
                `   Sample fields: ${Object.keys(sample[0]).join(', ')}`
              );
            }
          } else {
            console.log(`❌ ${table}: Not found or no access`);
          }
        } catch (e) {
          console.log(`❌ ${table}: Error accessing`);
        }
      }
    } else {
      console.log('📋 Available tables:\n');
      tables?.forEach((table) => {
        console.log(`- ${table.table_name}`);
      });
    }

    // Check auth users
    console.log('\n👥 Checking auth.users...');
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (!usersError && users) {
      console.log(`Total users: ${users.users.length}`);
      users.users.forEach((user) => {
        console.log(`- ${user.email} (${user.id})`);
      });
    } else {
      console.log(
        'Unable to access auth.users - this requires service role key'
      );
    }
  } catch (error) {
    console.error('Error analyzing Supabase:', error);
  }
}

analyzeSupabase();
