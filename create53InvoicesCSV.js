const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { parse } = require('json2csv');

// Initialize Supabase client
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMjA2MjE1MDc1OH0.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

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
};

async function create53InvoicesCSV() {
  console.log('Creating comprehensive 53 invoices CSV...\n');

  try {
    // Get all invoices from database
    const { data: dbInvoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('invoice_number', { ascending: true });

    if (error) {
      console.error('Error:', error);
      return;
    }

    // Group by invoice number to consolidate duplicates
    const invoiceGroups = {};
    dbInvoices.forEach((inv) => {
      if (!invoiceGroups[inv.invoice_number]) {
        invoiceGroups[inv.invoice_number] = [];
      }
      invoiceGroups[inv.invoice_number].push(inv);
    });

    // Create consolidated invoice list
    const consolidatedInvoices = [];

    Object.entries(invoiceGroups).forEach(([invoiceNumber, group]) => {
      // Calculate totals
      const netSales = group.reduce((sum, inv) => {
        const itemAmount =
          inv.amount - (inv.tax_amount || 0) - (inv.shipping_cost || 0);
        return sum + itemAmount;
      }, 0);

      const totalTax = group.reduce(
        (sum, inv) => sum + (inv.tax_amount || 0),
        0
      );
      const totalShipping = group.reduce(
        (sum, inv) => sum + (inv.shipping_cost || 0),
        0
      );
      const totalAmount = group.reduce((sum, inv) => sum + inv.amount, 0);

      // Use first invoice for common fields
      const first = group[0];

      // Create brief description
      let briefDescription = '';
      if (group.length > 1) {
        // Multiple items - summarize
        const descriptions = group
          .map((inv) => {
            let desc = inv.award_description || inv.notes || '';
            // Clean up description
            desc = desc.replace(/\s*-\s*Invoice.*$/i, '');
            desc = desc.replace(/\s*part\s*[A-Z]$/i, '');
            return desc;
          })
          .filter((d) => d);

        briefDescription = descriptions.join(' + ');
      } else {
        briefDescription = first.award_description || first.notes || '';
      }

      // Shorten description if too long
      if (briefDescription.length > 60) {
        briefDescription = briefDescription.substring(0, 57) + '...';
      }

      consolidatedInvoices.push({
        'Invoice Number': invoiceNumber,
        'Budget Class Code': first.class_code || '',
        Sport: sportNames[first.sport_code] || first.sport_code || '',
        'Brief Award Description': briefDescription,
        'Net Sales': netSales.toFixed(2),
        Tax: totalTax.toFixed(2),
        Subtotal: (netSales + totalTax).toFixed(2),
        Shipping: totalShipping.toFixed(2),
        'Balance Due': totalAmount.toFixed(2),
        'Budget Supervisor': first.supervisor || '',
      });
    });

    // Sort by invoice number
    consolidatedInvoices.sort((a, b) => {
      const numA = parseInt(a['Invoice Number'].replace(/\D/g, ''));
      const numB = parseInt(b['Invoice Number'].replace(/\D/g, ''));
      return numA - numB;
    });

    console.log(`Total unique invoices: ${consolidatedInvoices.length}`);

    // Add any missing invoices that might be in files but not in DB
    // These would need to be manually added based on the PDF review

    // Generate CSV
    const csv = parse(consolidatedInvoices);
    fs.writeFileSync('all_53_invoices.csv', csv);

    console.log('\nCSV exported to: all_53_invoices.csv');
    console.log(`Total rows: ${consolidatedInvoices.length}`);

    // Show summary statistics
    const totalNetSales = consolidatedInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv['Net Sales']),
      0
    );
    const totalTax = consolidatedInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv['Tax']),
      0
    );
    const totalShipping = consolidatedInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv['Shipping']),
      0
    );
    const totalBalance = consolidatedInvoices.reduce(
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
create53InvoicesCSV();
