const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { parse } = require('json2csv');

// Initialize Supabase client
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Corrections based on actual invoice verification
const corrections = {
  785503: { shipping: 211.86, total: 5934.06, netSales: 5722.2 },
  785504: { shipping: 567.12, total: 3195.87, netSales: 2628.75 },
  785505: { shipping: 348.17, total: 2976.92, netSales: 2628.75 },
  785682: {
    // Split invoice - need to handle both parts
    'BB-M': { shipping: 0, total: 4323.0, netSales: 4323.0, tax: 0 },
    'BB-W': { shipping: 133.44, total: 3878.94, netSales: 3745.5, tax: 0 },
  },
  785795: { shipping: 20.15, total: 124.85, netSales: 104.7 },
  785998: { shipping: 602.41, total: 3231.16, netSales: 2628.75 },
  786426: { shipping: 247.94, total: 1401.0, netSales: 1148.16, tax: 4.9 },
  787802: { shipping: 34.47, total: 468.19, netSales: 433.72 },
  787803: {
    // Split invoice - 3 parts
    part1: { shipping: 293.1, total: 2921.85, netSales: 2628.75 },
    part2: { shipping: 0, total: 1522.5, netSales: 1522.5 },
    part3: { shipping: 0, total: 3105.77, netSales: 3105.77 },
  },
  787806: { shipping: 209.65, total: 537.58, netSales: 278.82, tax: 49.11 },
  787807: { shipping: 531.64, total: 3160.39, netSales: 2628.75 },
  787984: { shipping: 19.89, total: 115.31, netSales: 95.42 },
  788788: { shipping: 18.33, total: 433.33, netSales: 415.0 },
  789584: { shipping: 0, total: 120.0, netSales: 120.0 },
  789585: { shipping: 75.01, total: 262.45, netSales: 187.44 },
  790026: { shipping: 680.38, total: 3506.29, netSales: 2628.75, tax: 197.16 },
  790027: { shipping: 933.21, total: 3790.66, netSales: 2628.75, tax: 228.7 },
  790028: { shipping: 439.71, total: 2226.39, netSales: 1617.0, tax: 169.68 },
  790029: { shipping: 16.47, total: 40.0, netSales: 23.54, tax: 0 },
  790279: { shipping: 129.01, total: 1702.18, netSales: 1445.32, tax: 127.85 },
  790280: { shipping: 428.07, total: 7209.56, netSales: 6337.84, tax: 443.65 },
  790281: { shipping: 86.5, total: 868.17, netSales: 737.1, tax: 44.57 },
  790906: { shipping: 10.74, total: 42.84, netSales: 30.0, tax: 2.1 },
  791346: {
    // Split invoice - 2 parts
    part1: { shipping: 186.6, total: 2815.35, netSales: 2628.75 },
    part2: { shipping: 0, total: 94.5, netSales: 94.5 },
  },
  791347: { shipping: 31.99, total: 300.37, netSales: 245.7, tax: 22.68 },
  791348: { shipping: 98.01, total: 284.9, netSales: 185.88, tax: 1.01 },
  791349: { shipping: 58.82, total: 1675.82, netSales: 1617.0 },
  792131: { shipping: 300.33, total: 3198.96, netSales: 2866.23, tax: 32.4 },
};

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
  XC: 'Cross Country',
  SC: 'Soccer',
  VB: 'Volleyball',
  WBB: "Women's Basketball",
  MBB: "Men's Basketball",
  WR: 'Wrestling',
  GYM: 'Gymnastics',
  EQ: 'Equestrian',
  SD: 'Swimming & Diving',
  MGO: "Men's Golf",
  WGO: "Women's Golf",
  BVB: 'Beach Volleyball',
  MTN: "Men's Tennis",
  LAX: 'Lacrosse',
  ITK: 'Indoor Track',
  RW: 'Rowing',
  SB: 'Softball',
  BSB: 'Baseball',
  WTN: "Women's Tennis",
};

async function createCorrectedCSV() {
  console.log('Creating corrected payment request CSV...\n');

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

    // Process each invoice entry with corrections
    const correctedInvoices = invoices.map((inv) => {
      let netSales, tax, shipping, total;

      // Check if we have corrections for this invoice
      if (corrections[inv.invoice_number]) {
        const correction = corrections[inv.invoice_number];

        // Handle split invoices
        if (inv.invoice_number === '785682') {
          const part =
            inv.sport_code === 'BB-M' ? correction['BB-M'] : correction['BB-W'];
          netSales = part.netSales;
          tax = part.tax || 0;
          shipping = part.shipping;
          total = part.total;
        } else if (inv.invoice_number === '787803') {
          // Determine which part based on amount or description
          if (
            inv.award_description &&
            inv.award_description.includes('Championship Trophy')
          ) {
            netSales = correction.part1.netSales;
            shipping = correction.part1.shipping;
            total = correction.part1.total;
          } else if (
            inv.award_description &&
            inv.award_description.includes('Tournament Championship')
          ) {
            netSales = correction.part2.netSales;
            shipping = correction.part2.shipping;
            total = correction.part2.total;
          } else {
            netSales = correction.part3.netSales;
            shipping = correction.part3.shipping;
            total = correction.part3.total;
          }
          tax = 0;
        } else if (inv.invoice_number === '791346') {
          // Baseball split invoice
          if (
            inv.award_description &&
            inv.award_description.includes('Championship Trophy')
          ) {
            netSales = correction.part1.netSales;
            shipping = correction.part1.shipping;
            total = correction.part1.total;
          } else {
            netSales = correction.part2.netSales;
            shipping = correction.part2.shipping;
            total = correction.part2.total;
          }
          tax = 0;
        } else {
          // Single invoice correction
          netSales =
            correction.netSales ||
            inv.amount - (correction.tax || 0) - correction.shipping;
          tax = correction.tax || 0;
          shipping = correction.shipping;
          total = correction.total;
        }
      } else {
        // No correction needed - use original values but fix obvious decimal errors
        shipping = inv.shipping_cost || 0;
        tax = inv.tax_amount || 0;

        // Check for obvious decimal point errors (shipping > $10,000)
        if (shipping > 10000) {
          shipping = shipping / 100; // Fix decimal point error
        }

        // Recalculate based on corrected shipping
        netSales = inv.amount - tax - shipping;
        total = inv.amount;

        // Fix total if it's obviously wrong (> $100,000 for a single invoice)
        if (total > 100000 && inv.invoice_number !== '790280') {
          // Rowing is legitimately high
          total = total / 100;
          netSales = total - tax - shipping;
        }
      }

      // Clean up description
      let description = inv.award_description || inv.notes || '';
      description = description.replace(/\s*-\s*Invoice.*$/i, '').trim();

      // Add split indicator if needed
      const invoiceCount = invoices.filter(
        (i) => i.invoice_number === inv.invoice_number
      ).length;
      if (invoiceCount > 1) {
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
        Tax: tax.toFixed(2),
        Subtotal: (netSales + tax).toFixed(2),
        Shipping: shipping.toFixed(2),
        'Balance Due': total.toFixed(2),
        'Budget Supervisor': inv.supervisor || '',
      };
    });

    // Generate CSV
    const csv = parse(correctedInvoices);
    fs.writeFileSync('corrected_payment_request.csv', csv);

    console.log('Corrected CSV exported to: corrected_payment_request.csv');
    console.log(`Total invoice entries: ${correctedInvoices.length}`);

    // Calculate corrected totals
    const totalNetSales = correctedInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv['Net Sales']),
      0
    );
    const totalTax = correctedInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv['Tax']),
      0
    );
    const totalShipping = correctedInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv['Shipping']),
      0
    );
    const totalBalance = correctedInvoices.reduce(
      (sum, inv) => sum + parseFloat(inv['Balance Due']),
      0
    );

    console.log('\n=== CORRECTED TOTALS ===');
    console.log(`Net Sales: $${totalNetSales.toLocaleString()}`);
    console.log(`Tax: $${totalTax.toLocaleString()}`);
    console.log(`Shipping: $${totalShipping.toLocaleString()}`);
    console.log(`Total Balance Due: $${totalBalance.toLocaleString()}`);

    console.log('\n=== COMPARISON ===');
    console.log('Original totals from database:');
    console.log('  Total: $10,881,971');
    console.log('  Shipping: $899,121');
    console.log(
      `Corrected totals: $${totalBalance.toLocaleString()} (Shipping: $${totalShipping.toLocaleString()})`
    );
    console.log(`Difference: $${(10881971 - totalBalance).toLocaleString()}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
createCorrectedCSV();
