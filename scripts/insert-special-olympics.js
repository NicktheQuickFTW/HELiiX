import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the JSON file
const invoiceData = JSON.parse(
  fs.readFileSync(join(__dirname, 'jostens-invoices-special-olympics.json'), 'utf8')
);

async function insertInvoices() {
  console.log('Starting Special Olympics invoice insertion...');
  let successCount = 0;

  for (const invoice of invoiceData.invoices) {
    try {
      // Calculate totals from items
      let totalQuantity = 0;
      invoice.items.forEach(item => {
        totalQuantity += item.quantity;
      });

      // Insert main invoice record
      const { data: invoiceRecord, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoice.invoice_number,
          vendor_name: 'Jostens',
          amount: Math.round(invoice.balance_due * 100), // Convert to cents
          status: 'planned',
          date: formatDate(invoice.invoice_date),
          due_date: calculateDueDate(invoice.invoice_date),
          notes: invoice.notes,
          sport_id: 1, // Using Baseball as placeholder for unallocated
          sport_code: 'XX',
          award_type: 'regular_season',
          class_code: invoice.account_code,
          supervisor: 'Jenn H', // Special Olympics typically under Community/DEI
          award_description: getAwardDescription(invoice),
          academic_year: invoice.academic_year,
          quantity: totalQuantity,
          unit_cost: Math.round((invoice.net_sales / totalQuantity) * 100), // Average unit cost in cents
          tax_amount: Math.round((invoice.tax || 0) * 100), // Convert to cents
          shipping_cost: Math.round((invoice.shipping_handling || 0) * 100) // Convert to cents
        })
        .select()
        .single();

      if (invoiceError) {
        console.error(`Error inserting invoice ${invoice.invoice_number}:`, invoiceError);
        continue;
      }

      successCount++;
      console.log(`✓ Inserted invoice ${invoice.invoice_number} - ${invoice.notes}`);
      console.log(`  Amount: $${invoice.balance_due.toFixed(2)}`);
      console.log(`  Items: ${totalQuantity} total`);

    } catch (error) {
      console.error(`Unexpected error processing invoice ${invoice.invoice_number}:`, error);
    }
  }

  console.log('\nSpecial Olympics invoice insertion complete!');
  console.log(`Successfully inserted: ${successCount} of ${invoiceData.invoices.length} invoices`);
  console.log(`Total amount: $${invoiceData.summary.total_amount.toFixed(2)}`);
  
  // Display summary
  console.log('\nSummary:');
  console.log(`  Ring Boxes: ${invoiceData.summary.details.total_ring_boxes} units`);
  console.log(`  Gold Medals: ${invoiceData.summary.details.total_medals} units`);
  console.log(`  Budget Class: ${invoiceData.summary.details.budget_class}`);
}

function formatDate(dateStr) {
  // Convert MM/DD/YY to YYYY-MM-DD
  const parts = dateStr.split('/');
  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  let year = parts[2];
  
  // Handle 2-digit year
  if (year.length === 2) {
    year = parseInt(year) < 50 ? `20${year}` : `19${year}`;
  }
  
  return `${year}-${month}-${day}`;
}

function calculateDueDate(invoiceDate) {
  const date = new Date(formatDate(invoiceDate));
  date.setDate(date.getDate() + 10); // Net 10 Days
  return date.toISOString().split('T')[0];
}

function getAwardDescription(invoice) {
  if (invoice.items[0].description.includes('RING BOX')) {
    return 'Special Olympics Ring Boxes';
  } else if (invoice.items[0].description.includes('MEDAL')) {
    return 'Special Olympics Medals';
  }
  return 'Special Olympics Awards';
}

// Run the insertion
insertInvoices().catch(console.error);