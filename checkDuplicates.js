const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with credentials
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  console.log('Checking for duplicate invoices...\n');

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

    // Check for duplicate invoice numbers
    const invoiceNumbers = {};
    const duplicateNumbers = [];

    invoices.forEach((inv) => {
      if (invoiceNumbers[inv.invoice_number]) {
        duplicateNumbers.push(inv.invoice_number);
        invoiceNumbers[inv.invoice_number].push(inv);
      } else {
        invoiceNumbers[inv.invoice_number] = [inv];
      }
    });

    console.log('=== DUPLICATE INVOICE NUMBERS ===');
    if (duplicateNumbers.length === 0) {
      console.log('No duplicate invoice numbers found.\n');
    } else {
      const uniqueDups = [...new Set(duplicateNumbers)];
      console.log(
        `Found ${uniqueDups.length} invoice numbers with duplicates:\n`
      );

      uniqueDups.forEach((num) => {
        const dups = invoiceNumbers[num];
        console.log(`Invoice Number: ${num} (${dups.length} occurrences)`);
        dups.forEach((inv) => {
          console.log(
            `  ID: ${inv.invoice_id}, Amount: $${inv.amount}, Date: ${inv.date}, Vendor: ${inv.vendor_name}`
          );
          console.log(`  Description: ${inv.award_description}`);
          console.log(
            `  Created: ${new Date(inv.created_at).toLocaleString()}`
          );
        });
        console.log('');
      });
    }

    // Check for potential duplicates based on same amount, vendor, and date
    console.log(
      '\n=== POTENTIAL DUPLICATES (Same Amount, Vendor, and Date) ==='
    );
    const potentialDups = [];

    for (let i = 0; i < invoices.length; i++) {
      for (let j = i + 1; j < invoices.length; j++) {
        if (
          invoices[i].amount === invoices[j].amount &&
          invoices[i].vendor_name === invoices[j].vendor_name &&
          invoices[i].date === invoices[j].date &&
          invoices[i].invoice_number !== invoices[j].invoice_number
        ) {
          potentialDups.push([invoices[i], invoices[j]]);
        }
      }
    }

    if (potentialDups.length === 0) {
      console.log(
        'No potential duplicates found based on amount, vendor, and date.\n'
      );
    } else {
      console.log(`Found ${potentialDups.length} potential duplicate pairs:\n`);
      potentialDups.forEach(([inv1, inv2], idx) => {
        console.log(`Potential Duplicate Pair ${idx + 1}:`);
        console.log(
          `  Invoice 1: #${inv1.invoice_number} (ID: ${inv1.invoice_id})`
        );
        console.log(
          `  Invoice 2: #${inv2.invoice_number} (ID: ${inv2.invoice_id})`
        );
        console.log(
          `  Amount: $${inv1.amount}, Vendor: ${inv1.vendor_name}, Date: ${inv1.date}`
        );
        console.log(`  Desc 1: ${inv1.award_description}`);
        console.log(`  Desc 2: ${inv2.award_description}`);
        console.log('');
      });
    }

    // Check for invoices with very similar descriptions
    console.log('\n=== SIMILAR DESCRIPTIONS ===');
    const similarDescs = [];

    for (let i = 0; i < invoices.length; i++) {
      for (let j = i + 1; j < invoices.length; j++) {
        const desc1 = (invoices[i].award_description || '').toLowerCase();
        const desc2 = (invoices[j].award_description || '').toLowerCase();

        // Check if descriptions are very similar (contain same key words)
        if (desc1 && desc2 && desc1 !== desc2) {
          const words1 = desc1.split(/\s+/);
          const words2 = desc2.split(/\s+/);
          const commonWords = words1.filter(
            (w) => words2.includes(w) && w.length > 3
          );

          if (
            commonWords.length >= 3 &&
            invoices[i].amount === invoices[j].amount
          ) {
            similarDescs.push([invoices[i], invoices[j]]);
          }
        }
      }
    }

    if (similarDescs.length > 0) {
      console.log(
        `Found ${similarDescs.length} pairs with similar descriptions and same amount:\n`
      );
      similarDescs.forEach(([inv1, inv2], idx) => {
        console.log(`Similar Pair ${idx + 1}:`);
        console.log(
          `  Invoice 1: #${inv1.invoice_number} (ID: ${inv1.invoice_id}) - $${inv1.amount}`
        );
        console.log(`  Desc 1: ${inv1.award_description}`);
        console.log(
          `  Invoice 2: #${inv2.invoice_number} (ID: ${inv2.invoice_id}) - $${inv2.amount}`
        );
        console.log(`  Desc 2: ${inv2.award_description}`);
        console.log('');
      });
    }

    console.log(`\nTotal invoices analyzed: ${invoices.length}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
checkDuplicates();
