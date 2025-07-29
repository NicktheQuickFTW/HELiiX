const { createClient } = require('@supabase/supabase-js');
const { parse } = require('json2csv');
const fs = require('fs');

// Initialize Supabase client with credentials
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function consolidateInvoices() {
  console.log('Consolidating split invoices...\n');

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

    // Group invoices by base number (removing suffixes)
    const invoiceGroups = {};
    const consolidatedInvoices = [];
    const awardEntries = [];

    // First pass: identify all split invoices
    const splitPatterns = new Set();
    invoices.forEach((inv) => {
      // Check for common split patterns: -A, -B, -C or -S-xxx-xx-xx-x
      if (
        inv.invoice_number.match(/[-_][A-Z]$/) ||
        inv.invoice_number.match(/-S-\d{3}-\d{2}-[A-Z]{2}-[A-Z0-9]$/)
      ) {
        const baseNumber = inv.invoice_number
          .replace(/[-_][A-Z]$/, '')
          .replace(/-S-\d{3}-\d{2}-[A-Z]{2}-[A-Z0-9]$/, '');
        splitPatterns.add(baseNumber);
      }
    });

    invoices.forEach((inv) => {
      // Extract base invoice number
      const baseNumber = inv.invoice_number
        .replace(/[-_][A-Z]$/, '')
        .replace(/-S-\d{3}-\d{2}-[A-Z]{2}-[A-Z0-9]$/, '');

      // Check if this invoice is part of a split group
      if (splitPatterns.has(baseNumber)) {
        if (!invoiceGroups[baseNumber]) {
          invoiceGroups[baseNumber] = [];
        }
        invoiceGroups[baseNumber].push(inv);
      } else {
        // Standalone invoice
        consolidatedInvoices.push({
          invoice_id: inv.invoice_id,
          invoice_number: inv.invoice_number,
          vendor_name: inv.vendor_name,
          total_amount: inv.amount,
          status: inv.status,
          date: inv.date,
          due_date: inv.due_date,
          notes: inv.notes || inv.award_description,
          academic_year: inv.academic_year,
          created_at: inv.created_at,
          tax_amount: inv.tax_amount || 0,
          shipping_cost: inv.shipping_cost || 0,
        });

        // Create single award entry
        awardEntries.push({
          invoice_id: inv.invoice_id,
          invoice_number: inv.invoice_number,
          award_description: inv.award_description,
          amount: inv.amount - (inv.tax_amount || 0) - (inv.shipping_cost || 0),
          quantity: inv.quantity,
          unit_cost: inv.unit_cost,
          sport_code: inv.sport_code,
          class_code: inv.class_code,
          award_type: inv.award_type,
          supervisor: inv.supervisor,
        });
      }
    });

    // Process grouped invoices
    console.log('=== CONSOLIDATED INVOICES ===\n');

    Object.entries(invoiceGroups).forEach(([baseNumber, group]) => {
      // Calculate totals
      const totalAmount = group.reduce((sum, inv) => sum + inv.amount, 0);
      const totalTax = group.reduce(
        (sum, inv) => sum + (inv.tax_amount || 0),
        0
      );
      const totalShipping = group.reduce(
        (sum, inv) => sum + (inv.shipping_cost || 0),
        0
      );

      // Get common fields (should be same across group)
      const first = group[0];

      // Create award descriptions summary
      const descriptions = group
        .map((inv) => inv.award_description)
        .join(' + ');

      // Use the first invoice_id from the group as the main invoice_id
      const mainInvoiceId = Math.min(...group.map((inv) => inv.invoice_id));

      const consolidated = {
        invoice_id: mainInvoiceId,
        invoice_number: baseNumber,
        vendor_name: first.vendor_name,
        total_amount: totalAmount,
        status: first.status,
        date: first.date,
        due_date: first.due_date,
        notes: descriptions,
        academic_year: first.academic_year,
        created_at: first.created_at,
        tax_amount: totalTax,
        shipping_cost: totalShipping,
      };

      consolidatedInvoices.push(consolidated);

      console.log(`Invoice #${baseNumber} (ID: ${mainInvoiceId}):`);
      console.log(`  Total Amount: $${totalAmount}`);
      console.log(`  Items: ${descriptions}`);
      console.log(`  Split into ${group.length} awards:`);

      // Create award entries
      group.forEach((inv) => {
        const award = {
          invoice_id: mainInvoiceId, // Link to the main invoice_id
          original_invoice_id: inv.invoice_id, // Track original for reference
          invoice_number: baseNumber,
          award_description: inv.award_description,
          amount: inv.amount - (inv.tax_amount || 0) - (inv.shipping_cost || 0),
          quantity: inv.quantity,
          unit_cost: inv.unit_cost,
          sport_code: inv.sport_code,
          class_code: inv.class_code,
          award_type: inv.award_type,
          supervisor: inv.supervisor,
        };

        awardEntries.push(award);

        console.log(
          `    - ${inv.award_description}: $${inv.amount} (${inv.sport_code})`
        );
      });

      console.log('');
    });

    console.log(`\n=== SUMMARY ===`);
    console.log(`Original invoices: ${invoices.length}`);
    console.log(`Consolidated invoices: ${consolidatedInvoices.length}`);
    console.log(`Award entries: ${awardEntries.length}`);
    console.log(
      `Reduction: ${invoices.length - consolidatedInvoices.length} duplicate invoice entries removed`
    );

    // Export consolidated invoices
    const invoicesCsv = parse(consolidatedInvoices);
    fs.writeFileSync('consolidated_invoices.csv', invoicesCsv);
    console.log(
      '\nExported consolidated invoices to: consolidated_invoices.csv'
    );

    // Export award entries
    const awardsCsv = parse(awardEntries);
    fs.writeFileSync('award_entries.csv', awardsCsv);
    console.log('Exported award entries to: award_entries.csv');

    // Show proposed table structure
    console.log('\n=== PROPOSED TABLE STRUCTURE ===');
    console.log('\nINVOICES TABLE (one row per invoice):');
    console.log('- invoice_id (primary key)');
    console.log('- invoice_number (unique)');
    console.log('- vendor_name');
    console.log('- total_amount');
    console.log('- tax_amount');
    console.log('- shipping_cost');
    console.log('- status');
    console.log('- date');
    console.log('- due_date');
    console.log('- notes (summary of items)');
    console.log('- academic_year');

    console.log('\nAWARDS TABLE (multiple rows per invoice):');
    console.log('- award_id (auto-generated primary key)');
    console.log('- invoice_id (foreign key to invoices.invoice_id)');
    console.log('- award_description');
    console.log('- amount (excluding tax/shipping)');
    console.log('- quantity');
    console.log('- unit_cost');
    console.log('- sport_code');
    console.log('- class_code');
    console.log('- award_type');
    console.log('- supervisor');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
consolidateInvoices();
