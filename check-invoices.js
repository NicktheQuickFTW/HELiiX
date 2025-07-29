import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvoices() {
  console.log('🔍 Checking invoices table...\n');

  try {
    // Check what tables exist in public schema
    console.log('Checking available tables...');

    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public');

    if (!tablesError && tables) {
      console.log('Available tables:');
      tables.forEach((table) => console.log(`  - ${table.table_name}`));
    }

    // Try accessing the invoices table directly with different approaches
    console.log('\nTrying direct access to invoices table...');

    // Try with different schema approaches
    const approaches = [
      {
        name: 'public.invoices',
        fn: () => supabase.from('invoices').select('*').limit(5),
      },
      {
        name: 'with explicit public schema',
        fn: () =>
          supabase.schema('public').from('invoices').select('*').limit(5),
      },
      {
        name: 'awards table',
        fn: () => supabase.from('awards').select('*').limit(5),
      },
      {
        name: 'award_orders table',
        fn: () => supabase.from('award_orders').select('*').limit(5),
      },
    ];

    for (const approach of approaches) {
      console.log(`\nTrying: ${approach.name}`);
      try {
        const { data: records, error } = await approach.fn();

        if (!error && records) {
          console.log(`✅ Found table: ${approach.name}`);
          console.log(`📊 Found ${records.length} records (showing first 5):`);

          records.forEach((record, i) => {
            console.log(
              `\n${i + 1}. Record #${record.invoice_number || record.id || record.award_id}`
            );
            console.log(`   Details:`, JSON.stringify(record, null, 2));
          });

          // Get column names to understand structure
          if (records.length > 0) {
            console.log(
              `\n📋 Available columns: ${Object.keys(records[0]).join(', ')}`
            );
          }

          return; // Found a working table, exit
        } else {
          console.log(`❌ ${approach.name}: ${error?.message || 'not found'}`);
        }
      } catch (err) {
        console.log(`❌ ${approach.name}: ${err.message}`);
      }
    }

    console.log(
      '\n❌ No invoice tables found. Let me create one based on your CSV data.'
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkInvoices();
