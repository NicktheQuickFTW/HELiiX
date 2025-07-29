const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { parse } = require('json2csv');

// Initialize Supabase client
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sport code to name mapping
const sportNames = {
  'BB-M': "Men's Basketball",
  'BB-W': "Women's Basketball",
  'BV-W': 'Beach Volleyball',
  'CC-M': "Men's Cross Country",
  'CC-W': "Women's Cross Country",
  'EQ-W': 'Equestrian',
  'FB-0': 'Football',
  'GF-M': "Men's Golf",
  'GF-W': "Women's Golf",
  'GY-W': 'Gymnastics',
  'HB-0': 'Baseball',
  'IT-M': "Men's Indoor Track",
  'IT-W': "Women's Indoor Track",
  'LX-W': 'Lacrosse',
  'OT-M': "Men's Outdoor Track",
  'OT-W': "Women's Outdoor Track",
  'RW-W': 'Rowing',
  'SB-W': 'Softball',
  'SC-W': 'Soccer',
  'SD-M': "Men's Swimming & Diving",
  'SD-W': "Women's Swimming & Diving",
  'TN-M': "Men's Tennis",
  'TN-W': "Women's Tennis",
  'VB-W': 'Volleyball',
  'WW-M': 'Wrestling',
  'XX-0': 'Unallocated/Special',
  XX: 'Unallocated/Special',
};

async function createPaymentRequestCSV() {
  console.log('Creating payment request CSV with all invoice entries...\n');

  try {
    // Get all invoices from database
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('invoice_number', { ascending: true })
      .order('invoice_id', { ascending: true });

    if (error) {
      console.error('Error:', error);
      return;
    }

    // Process each invoice entry
    const paymentRequests = invoices.map((inv) => {
      // Calculate net sales (amount minus tax and shipping)
      const netSales =
        inv.amount - (inv.tax_amount || 0) - (inv.shipping_cost || 0);

      // Clean up description
      let description = inv.award_description || inv.notes || '';
      description = description.replace(/\s*-\s*Invoice.*$/i, '').trim();

      // Add split indicator if this is a split invoice
      const invoiceCount = invoices.filter(
        (i) => i.invoice_number === inv.invoice_number
      ).length;
      if (invoiceCount > 1) {
        // Find which part this is
        const sameInvoices = invoices.filter(
          (i) => i.invoice_number === inv.invoice_number
        );
        const partIndex =
          sameInvoices.findIndex((i) => i.invoice_id === inv.invoice_id) + 1;
        description = `${description} (Split ${partIndex}/${invoiceCount})`;
      }

      return {
        'Invoice Number': inv.invoice_number,
        'Budget Class Code': inv.class_code || '',
        Sport: sportNames[inv.sport_code] || inv.sport_code || '',
        'Brief Award Description': description,
        'Net Sales': netSales.toFixed(2),
        Tax: (inv.tax_amount || 0).toFixed(2),
        Subtotal: (netSales + (inv.tax_amount || 0)).toFixed(2),
        Shipping: (inv.shipping_cost || 0).toFixed(2),
        'Balance Due': inv.amount.toFixed(2),
        'Budget Supervisor': inv.supervisor || '',
      };
    });

    // Generate CSV
    const csv = parse(paymentRequests);
    fs.writeFileSync('payment_request_all_invoices.csv', csv);

    console.log('CSV exported to: payment_request_all_invoices.csv');
    console.log(`Total invoice entries: ${paymentRequests.length}`);

    // Count unique invoices
    const uniqueInvoices = [
      ...new Set(invoices.map((inv) => inv.invoice_number)),
    ];
    console.log(`Unique invoice numbers: ${uniqueInvoices.length}`);

    // Identify split invoices
    const splitInvoices = {};
    invoices.forEach((inv) => {
      if (!splitInvoices[inv.invoice_number]) {
        splitInvoices[inv.invoice_number] = 0;
      }
      splitInvoices[inv.invoice_number]++;
    });

    const splitCount = Object.entries(splitInvoices).filter(
      ([num, count]) => count > 1
    );
    console.log(
      `\nSplit invoices (${splitCount.length} invoice numbers split into multiple entries):`
    );
    splitCount.forEach(([num, count]) => {
      console.log(`  ${num}: ${count} entries`);
    });

    // Calculate totals
    const totalNetSales = paymentRequests.reduce(
      (sum, inv) => sum + parseFloat(inv['Net Sales']),
      0
    );
    const totalTax = paymentRequests.reduce(
      (sum, inv) => sum + parseFloat(inv['Tax']),
      0
    );
    const totalShipping = paymentRequests.reduce(
      (sum, inv) => sum + parseFloat(inv['Shipping']),
      0
    );
    const totalBalance = paymentRequests.reduce(
      (sum, inv) => sum + parseFloat(inv['Balance Due']),
      0
    );

    console.log('\n=== TOTALS ===');
    console.log(`Net Sales: $${totalNetSales.toLocaleString()}`);
    console.log(`Tax: $${totalTax.toLocaleString()}`);
    console.log(`Shipping: $${totalShipping.toLocaleString()}`);
    console.log(`Total Balance Due: $${totalBalance.toLocaleString()}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
createPaymentRequestCSV();
