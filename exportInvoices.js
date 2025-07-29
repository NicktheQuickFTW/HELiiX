const { createClient } = require('@supabase/supabase-js');
const { parse } = require('json2csv');
const fs = require('fs');

// Initialize Supabase client with credentials
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test connection by listing tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);

    if (error) {
      // Try a simpler query
      const { data: tables, error: tablesError } = await supabase.rpc(
        'get_tables',
        {}
      );

      if (tablesError) {
        console.log('Connection established but cannot list tables.');
        console.log(
          "This is normal if the user doesn't have schema permissions."
        );
      } else {
        console.log('Available tables:', tables);
      }
    } else {
      console.log('Connected successfully! Available tables:', data);
    }

    console.log('\nSupabase connection successful!');
    console.log('URL:', supabaseUrl);
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

async function exportInvoices() {
  console.log('\nFetching invoices...');

  try {
    // Adjust table name as needed - common names: invoices, invoice, billing, etc.
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error.message);
      console.log('\nTrying alternative table names...');

      // Try alternative table names
      const tableNames = ['invoice', 'billing', 'bills', 'payments'];
      for (const tableName of tableNames) {
        const { data, error: altError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!altError) {
          console.log(`Found table: ${tableName}`);
          const { data: allData } = await supabase.from(tableName).select('*');

          if (allData && allData.length > 0) {
            await exportToCSV(allData, tableName);
          }
          return;
        }
      }

      console.log(
        '\nCould not find invoice table. Please specify the correct table name.'
      );
      return;
    }

    if (!invoices || invoices.length === 0) {
      console.log('No invoices found.');
      return;
    }

    console.log(`Found ${invoices.length} invoices`);
    await exportToCSV(invoices, 'invoices');
  } catch (err) {
    console.error('Export error:', err.message);
  }
}

async function exportToCSV(data, tableName) {
  try {
    const csv = parse(data);
    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`;

    fs.writeFileSync(filename, csv);
    console.log(`\nExported to ${filename}`);
    console.log(`Total records: ${data.length}`);
  } catch (err) {
    console.error('CSV export error:', err.message);
  }
}

// Run the connection test and export
(async () => {
  await testConnection();
  await exportInvoices();
})();
