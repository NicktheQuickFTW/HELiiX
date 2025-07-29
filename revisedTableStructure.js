const { createClient } = require('@supabase/supabase-js');
const { parse } = require('json2csv');
const fs = require('fs');

// Initialize Supabase client with credentials
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to calculate fiscal year (July 1 - June 30)
function getFiscalYear(date) {
  const d = new Date(date);
  const month = d.getMonth(); // 0-11
  const year = d.getFullYear();

  // If July (6) or later, fiscal year is next year
  if (month >= 6) {
    return `FY${(year + 1).toString().slice(-2)}`;
  } else {
    return `FY${year.toString().slice(-2)}`;
  }
}

// Helper function to format award description
function formatAwardDescription(desc, notes) {
  // Clean up the description
  if (!desc || desc === '') {
    desc = notes || 'Award';
  }

  // Remove redundant text and clean up
  desc = desc.replace(/\s*-\s*Invoice\s*\d+.*$/i, '');
  desc = desc.replace(/\s*part\s*[A-Z]$/i, '');

  // Capitalize first letter of each word
  desc = desc
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return desc;
}

async function createRevisedStructure() {
  console.log('Creating revised table structure...\n');

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

    // Group by invoice number to consolidate duplicates
    const invoiceGroups = {};

    invoices.forEach((inv) => {
      if (!invoiceGroups[inv.invoice_number]) {
        invoiceGroups[inv.invoice_number] = [];
      }
      invoiceGroups[inv.invoice_number].push(inv);
    });

    const consolidatedInvoices = [];
    const awardEntries = [];

    Object.entries(invoiceGroups).forEach(([invoiceNumber, group]) => {
      // Calculate totals for the group
      const totalAmount = group.reduce(
        (sum, inv) => sum + (inv.amount || 0),
        0
      );
      const totalTax = group.reduce(
        (sum, inv) => sum + (inv.tax_amount || 0),
        0
      );
      const totalShipping = group.reduce(
        (sum, inv) => sum + (inv.shipping_cost || 0),
        0
      );

      // Use the first invoice as the base
      const first = group[0];
      const mainInvoiceId = Math.min(...group.map((inv) => inv.invoice_id));

      // Create description from all award descriptions
      let description = '';
      if (group.length > 1) {
        description = group
          .map((inv) =>
            formatAwardDescription(inv.award_description, inv.notes)
          )
          .join(' + ');
      } else {
        description =
          first.notes ||
          formatAwardDescription(first.award_description, first.notes);
      }

      // Calculate balance_due (for now, same as total_amount since all are "planned")
      const balanceDue = first.status === 'paid' ? 0 : totalAmount;

      // Create consolidated invoice
      const consolidatedInvoice = {
        invoice_id: mainInvoiceId,
        invoice_number: invoiceNumber,
        vendor_name: first.vendor_name,
        total_amount: totalAmount,
        balance_due: balanceDue,
        status: first.status,
        date: first.date,
        due_date: first.due_date,
        description: description, // renamed from notes
        year: first.academic_year, // renamed from academic_year
        fiscal_year: getFiscalYear(first.date),
        created_at: first.created_at,
        updated_at: first.updated_at,
      };

      consolidatedInvoices.push(consolidatedInvoice);

      // Create award entries
      group.forEach((inv, index) => {
        // Calculate item amount (excluding tax and shipping)
        const itemAmount =
          inv.amount - (inv.tax_amount || 0) - (inv.shipping_cost || 0);

        const award = {
          award_id: `${mainInvoiceId}-${index + 1}`, // temporary ID for demo
          invoice_id: mainInvoiceId,
          vendor_name: inv.vendor_name,
          amount: inv.amount, // total amount including tax/shipping
          status: 'delivered', // default status
          description: formatAwardDescription(inv.award_description, inv.notes),
          quantity: inv.quantity || 1,
          unit_cost: inv.unit_cost || itemAmount,
          sport_code: inv.sport_code,
          class_code: inv.class_code,
          award_type: inv.award_type,
          supervisor: inv.supervisor,
          year: inv.academic_year,
          fiscal_year: getFiscalYear(inv.date),
          tax_amount: inv.tax_amount || 0,
          shipping_cost: inv.shipping_cost || 0,
        };

        awardEntries.push(award);
      });
    });

    // Display summary
    console.log('=== CONSOLIDATION SUMMARY ===');
    console.log(`Original invoices: ${invoices.length}`);
    console.log(`Consolidated invoices: ${consolidatedInvoices.length}`);
    console.log(
      `Reduction: ${invoices.length - consolidatedInvoices.length} duplicate entries removed`
    );
    console.log(`Total award line items: ${awardEntries.length}\n`);

    // Show some examples
    console.log('=== EXAMPLE CONSOLIDATED INVOICES ===\n');

    // Show invoices that were consolidated
    const consolidatedExamples = Object.entries(invoiceGroups)
      .filter(([num, group]) => group.length > 1)
      .slice(0, 3);

    consolidatedExamples.forEach(([invoiceNumber, group]) => {
      const invoice = consolidatedInvoices.find(
        (inv) => inv.invoice_number === invoiceNumber
      );
      console.log(`Invoice #${invoiceNumber}:`);
      console.log(`  Total Amount: $${invoice.total_amount.toLocaleString()}`);
      console.log(`  Description: ${invoice.description}`);
      console.log(`  Fiscal Year: ${invoice.fiscal_year}`);
      console.log(`  Awards (${group.length} items):`);

      const awards = awardEntries.filter(
        (award) => award.invoice_id === invoice.invoice_id
      );
      awards.forEach((award) => {
        console.log(
          `    - ${award.description}: $${award.amount.toLocaleString()} (${award.sport_code})`
        );
      });
      console.log('');
    });

    // Export files
    const invoicesCsv = parse(consolidatedInvoices);
    fs.writeFileSync('revised_invoices.csv', invoicesCsv);
    console.log('Exported revised invoices to: revised_invoices.csv');

    const awardsCsv = parse(awardEntries);
    fs.writeFileSync('revised_awards.csv', awardsCsv);
    console.log('Exported revised awards to: revised_awards.csv\n');

    // Show final table structure
    console.log('=== FINAL TABLE STRUCTURE ===\n');

    console.log('INVOICES TABLE (one row per unique invoice number):');
    console.log('- invoice_id (primary key)');
    console.log('- invoice_number (unique)');
    console.log('- vendor_name');
    console.log('- total_amount');
    console.log('- balance_due');
    console.log('- status');
    console.log('- date');
    console.log('- due_date');
    console.log('- description (renamed from notes)');
    console.log('- year (renamed from academic_year)');
    console.log('- fiscal_year (e.g., FY25)');
    console.log('- created_at');
    console.log('- updated_at\n');

    console.log('AWARDS TABLE (multiple rows per invoice):');
    console.log('- award_id (auto-generated primary key)');
    console.log('- invoice_id (foreign key to invoices.invoice_id)');
    console.log('- vendor_name');
    console.log('- amount (total including tax/shipping)');
    console.log('- status (default: "delivered")');
    console.log(
      '- description (formatted like "Soccer 24 Regular Season Champion Trophy")'
    );
    console.log('- quantity');
    console.log('- unit_cost');
    console.log('- sport_code');
    console.log('- class_code');
    console.log('- award_type');
    console.log('- supervisor');
    console.log('- year');
    console.log('- fiscal_year');
    console.log('- tax_amount');
    console.log('- shipping_cost');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
createRevisedStructure();
