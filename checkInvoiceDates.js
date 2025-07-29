const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with credentials
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvoiceDates() {
  console.log('Checking invoice creation dates...\n');

  try {
    // Get all invoices sorted by creation date
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('invoice_id, invoice_number, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error:', error);
      return;
    }

    // Group by creation date
    const dateGroups = {};
    invoices.forEach((inv) => {
      const date = new Date(inv.created_at).toLocaleDateString();
      if (!dateGroups[date]) {
        dateGroups[date] = [];
      }
      dateGroups[date].push(inv);
    });

    // Display grouped results
    console.log('Invoices grouped by creation date:');
    console.log('==================================');

    Object.entries(dateGroups).forEach(([date, invs]) => {
      console.log(`\n${date}: ${invs.length} invoices`);
      console.log('------------------------');
      invs.forEach((inv) => {
        console.log(
          `  ID: ${inv.invoice_id}, Invoice #: ${inv.invoice_number}`
        );
        console.log(`  Created: ${new Date(inv.created_at).toLocaleString()}`);
      });
    });

    console.log(`\nTotal invoices: ${invoices.length}`);

    // Check for recent additions (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentInvoices = invoices.filter(
      (inv) => new Date(inv.created_at) > yesterday
    );

    if (recentInvoices.length > 0) {
      console.log(
        `\nInvoices added in last 24 hours: ${recentInvoices.length}`
      );
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
checkInvoiceDates();
