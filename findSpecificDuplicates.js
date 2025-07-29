const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with credentials
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findSpecificDuplicates() {
  console.log(
    'Searching for specific invoice numbers that may have duplicates...\n'
  );

  // Invoice numbers to check (including partial matches)
  const suspectNumbers = [
    '785682',
    '787803',
    '787985',
    '788239',
    '789042',
    '789582',
    '791346',
  ];

  try {
    // Get all invoices
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('invoice_number', { ascending: true });

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('=== CHECKING SPECIFIC INVOICE NUMBERS ===\n');

    suspectNumbers.forEach((baseNum) => {
      // Find all invoices that contain this base number
      const matches = invoices.filter((inv) =>
        inv.invoice_number.includes(baseNum)
      );

      if (matches.length > 1) {
        console.log(
          `Base Number: ${baseNum} - Found ${matches.length} invoices:`
        );
        console.log('----------------------------------------');

        matches.forEach((inv) => {
          console.log(
            `  Invoice #: ${inv.invoice_number} (ID: ${inv.invoice_id})`
          );
          console.log(`  Amount: $${inv.amount}`);
          console.log(`  Vendor: ${inv.vendor_name}`);
          console.log(`  Date: ${inv.date}`);
          console.log(`  Description: ${inv.award_description}`);
          console.log(`  Class Code: ${inv.class_code}`);
          console.log(
            `  Created: ${new Date(inv.created_at).toLocaleString()}`
          );
          console.log('');
        });

        // Check if these are true duplicates or related invoices
        const amounts = [...new Set(matches.map((m) => m.amount))];
        const dates = [...new Set(matches.map((m) => m.date))];

        if (amounts.length === 1 && dates.length === 1) {
          console.log(`  ⚠️  LIKELY DUPLICATES - Same amount and date!\n`);
        } else {
          console.log(
            `  ℹ️  Different amounts or dates - may be related but distinct invoices\n`
          );
        }

        console.log('========================================\n');
      } else if (matches.length === 1) {
        console.log(
          `Base Number: ${baseNum} - Only 1 invoice found (no duplicates)\n`
        );
      } else {
        console.log(`Base Number: ${baseNum} - Not found\n`);
      }
    });

    // Also check for invoice numbers that are similar patterns
    console.log('\n=== INVOICE NUMBER PATTERNS ===\n');

    // Group by base invoice number (removing suffixes like -A, -B, -C)
    const baseNumbers = {};
    invoices.forEach((inv) => {
      const base = inv.invoice_number.replace(/[-_][A-Z0-9]+$/, '');
      if (!baseNumbers[base]) {
        baseNumbers[base] = [];
      }
      baseNumbers[base].push(inv);
    });

    // Show groups with multiple invoices
    Object.entries(baseNumbers)
      .filter(([base, invs]) => invs.length > 1)
      .forEach(([base, invs]) => {
        console.log(`Base: ${base} (${invs.length} invoices)`);
        invs.forEach((inv) => {
          console.log(
            `  ${inv.invoice_number}: $${inv.amount} - ${inv.award_description}`
          );
        });
        console.log('');
      });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
findSpecificDuplicates();
