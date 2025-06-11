import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('Checking invoices table schema...\n');

  // Try to get one record to see the columns
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Current columns in invoices table:');
    Object.keys(data[0]).forEach(col => {
      console.log(`  - ${col}: ${typeof data[0][col]} = ${data[0][col]}`);
    });
  } else {
    console.log('No records found. Attempting to insert a test record...');
    
    // Try different column combinations
    const testInserts = [
      { invoice_number: 'TEST001', vendor: 'Test', amount: 100.00 },
      { invoice_number: 'TEST002', vendor_name: 'Test', total_amount: 100.00 },
      { invoice_id: 'TEST003', vendor: 'Test', amount: 100.00 },
      { number: 'TEST004', vendor: 'Test', amount: 100.00 }
    ];

    for (const testData of testInserts) {
      const { data: insertData, error: insertError } = await supabase
        .from('invoices')
        .insert(testData)
        .select();

      if (!insertError) {
        console.log('\nSuccessful insert with columns:', Object.keys(testData));
        console.log('Returned data:', insertData);
        
        // Delete the test record
        await supabase.from('invoices').delete().eq('invoice_number', testData.invoice_number || testData.invoice_id || testData.number);
        break;
      } else {
        console.log(`\nFailed with: ${JSON.stringify(testData)}`);
        console.log('Error:', insertError.message);
      }
    }
  }
}

checkSchema().catch(console.error);