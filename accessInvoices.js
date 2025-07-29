import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with credentials
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function accessInvoices() {
  console.log('Accessing invoices table...\n');

  try {
    // Get first 10 invoices with all columns
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error accessing invoices:', error);
      return;
    }

    if (!invoices || invoices.length === 0) {
      console.log('No invoices found.');
      return;
    }

    // Display summary
    console.log(`Found ${invoices.length} invoices (showing first 10)\n`);

    // Display column headers
    const columns = Object.keys(invoices[0]);
    console.log('Columns:', columns.join(', '), '\n');

    // Display each invoice
    invoices.forEach((invoice, index) => {
      console.log(`Invoice ${index + 1}:`);
      console.log('------------------------');

      // Display key fields
      if (invoice.id) console.log(`ID: ${invoice.id}`);
      if (invoice.invoice_number)
        console.log(`Invoice Number: ${invoice.invoice_number}`);
      if (invoice.client_name) console.log(`Client: ${invoice.client_name}`);
      if (invoice.amount) console.log(`Amount: $${invoice.amount}`);
      if (invoice.status) console.log(`Status: ${invoice.status}`);
      if (invoice.due_date) console.log(`Due Date: ${invoice.due_date}`);
      if (invoice.created_at)
        console.log(
          `Created: ${new Date(invoice.created_at).toLocaleDateString()}`
        );

      console.log('\nFull record:');
      console.log(JSON.stringify(invoice, null, 2));
      console.log('\n========================================\n');
    });

    // Get total count
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });

    console.log(`Total invoices in table: ${count}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run specific queries
async function runQueries() {
  console.log('\n=== RUNNING SPECIFIC QUERIES ===\n');

  // Query 1: Get unpaid invoices
  const { data: unpaid, error: unpaidError } = await supabase
    .from('invoices')
    .select('*')
    .eq('status', 'unpaid')
    .order('due_date', { ascending: true });

  if (!unpaidError) {
    console.log(`Unpaid invoices: ${unpaid.length}`);
  }

  // Query 2: Get total amount by status
  const { data: statusTotals, error: statusError } = await supabase
    .from('invoices')
    .select('status, amount');

  if (!statusError) {
    const totals = {};
    statusTotals.forEach((inv) => {
      if (!totals[inv.status]) totals[inv.status] = 0;
      totals[inv.status] += parseFloat(inv.amount) || 0;
    });

    console.log('\nTotal amounts by status:');
    Object.entries(totals).forEach(([status, total]) => {
      console.log(`${status}: $${total.toFixed(2)}`);
    });
  }
}

// Execute
(async () => {
  await accessInvoices();
  await runQueries();
})();
