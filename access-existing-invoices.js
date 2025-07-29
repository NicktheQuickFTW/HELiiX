import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function accessExistingInvoices() {
  console.log('🔍 Accessing existing invoices table...\n');

  try {
    // Direct access with basic select
    console.log('Attempting direct access...');

    const {
      data: invoices,
      error,
      count,
    } = await supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .limit(10);

    if (error) {
      console.error('❌ Direct access error:', error);

      // Try alternative approach - maybe it's in a different format
      console.log('\nTrying alternative access methods...');

      // Check if we can access with just count
      const { count: countOnly, error: countError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true });

      if (!countError) {
        console.log(`✅ Found ${countOnly} invoices in the table!`);

        // Try to get just a few columns
        const { data: limited, error: limitedError } = await supabase
          .from('invoices')
          .select('id, invoice_number, vendor_name, total_amount, status')
          .limit(5);

        if (!limitedError && limited) {
          console.log('✅ Successfully accessed invoices:');
          limited.forEach((invoice, i) => {
            console.log(
              `${i + 1}. #${invoice.invoice_number} - ${invoice.vendor_name} - $${invoice.total_amount / 100} - ${invoice.status}`
            );
          });
        }
      } else {
        console.error('❌ Count access error:', countError);
      }

      return;
    }

    console.log(`✅ Successfully accessed invoices table!`);
    console.log(`📊 Found ${count} total invoices (showing first 10):\n`);

    if (invoices && invoices.length > 0) {
      // Show column structure
      console.log(
        '📋 Available columns:',
        Object.keys(invoices[0]).join(', '),
        '\n'
      );

      // Display invoices
      invoices.forEach((invoice, i) => {
        console.log(`${i + 1}. Invoice #${invoice.invoice_number}`);
        console.log(`   Vendor: ${invoice.vendor_name}`);
        console.log(`   Amount: $${(invoice.total_amount || 0) / 100}`);
        console.log(`   Status: ${invoice.status}`);
        console.log(`   Date: ${invoice.date || 'N/A'}`);
        if (invoice.class_code)
          console.log(`   Class Code: ${invoice.class_code}`);
        console.log('');
      });

      // Get summary statistics
      const { data: allInvoices } = await supabase
        .from('invoices')
        .select('total_amount, status, vendor_name, academic_year');

      if (allInvoices) {
        const totalAmount = allInvoices.reduce(
          (sum, inv) => sum + (inv.total_amount || 0),
          0
        );
        const statusCounts = {};
        const vendorCounts = {};

        allInvoices.forEach((inv) => {
          statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
          vendorCounts[inv.vendor_name] =
            (vendorCounts[inv.vendor_name] || 0) + 1;
        });

        console.log('📈 SUMMARY STATISTICS:');
        console.log(
          `   Total Amount: $${(totalAmount / 100).toLocaleString()}`
        );
        console.log(`   Total Count: ${count}`);
        console.log(`   By Status:`, statusCounts);
        console.log(`   By Vendor:`, vendorCounts);
      }
    } else {
      console.log('📭 No invoices found in the table.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the access
accessExistingInvoices();
