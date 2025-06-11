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
  fs.readFileSync(join(__dirname, 'jostens-invoices-2024-25-batch3-account4250.json'), 'utf8')
);

// Sport code mapping
const sportCodeMap = {
  'Basketball - Men': { code: 'BB-M', id: 9 },
  'Basketball - Women': { code: 'BB-W', id: 10 }
};

async function insertInvoices() {
  console.log('Starting invoice insertion for Account 4250 batch...');
  let successCount = 0;

  for (const invoice of invoiceData.invoices) {
    try {
      const sportInfo = sportCodeMap[invoice.sport] || { code: 'XX', id: 0 };
      
      // Calculate totals from items
      let totalQuantity = 0;
      let totalAmount = 0;
      invoice.items.forEach(item => {
        totalQuantity += item.quantity;
        totalAmount += item.amount;
      });

      // Insert main invoice record
      const { data: invoiceRecord, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: `${invoice.invoice_number}-${invoice.account_code}`,
          vendor_name: 'Jostens',
          amount: Math.round(invoice.balance_due * 100), // Convert to cents
          status: 'planned',
          date: invoice.invoice_date,
          due_date: calculateDueDate(invoice.invoice_date, invoice.terms),
          notes: `${invoice.sport} - Account ${invoice.account_number} - Promotional Items (${invoice.items.length} different items)`,
          sport_id: sportInfo.id,
          sport_code: sportInfo.code,
          award_type: 'regular_season',
          class_code: invoice.account_code,
          supervisor: invoice.account_code.includes('BB-M') ? 'Brian' : 'Dayna',
          award_description: 'Promotional Items - Magnets',
          academic_year: '2024-25',
          quantity: totalQuantity,
          unit_cost: Math.round(3.93 * 100), // Convert to cents
          tax_amount: Math.round(invoice.tax * 100), // Convert to cents
          shipping_cost: Math.round(invoice.shipping_handling * 100) // Convert to cents
        })
        .select()
        .single();

      if (invoiceError) {
        console.error(`Error inserting invoice ${invoice.invoice_number}:`, invoiceError);
        continue;
      }

      successCount++;
      console.log(`✓ Inserted invoice ${invoice.invoice_number} for ${invoice.sport}`);
      console.log(`  Account: ${invoice.account_code} (${invoice.account_number})`);
      console.log(`  Amount: $${invoice.balance_due.toFixed(2)}`);
      console.log(`  Items: ${invoice.items.length} types, ${totalQuantity} total quantity`);

    } catch (error) {
      console.error(`Unexpected error processing invoice ${invoice.invoice_number}:`, error);
    }
  }

  console.log('\nInvoice insertion complete!');
  console.log(`Successfully inserted: ${successCount} of ${invoiceData.invoices.length} invoices`);
  console.log(`Total amount: $${invoiceData.summary.total_amount.toFixed(2)}`);
  
  // Display summary by sport
  console.log('\nSummary by Sport:');
  Object.entries(invoiceData.summary.by_sport).forEach(([sport, data]) => {
    console.log(`  ${sport}: ${data.count} invoice(s) - $${data.amount.toFixed(2)}`);
  });
}

function calculateDueDate(invoiceDate, terms) {
  const date = new Date(invoiceDate);
  if (terms.includes('Net 10')) {
    date.setDate(date.getDate() + 10);
  } else if (terms.includes('Net 30')) {
    date.setDate(date.getDate() + 30);
  }
  return date.toISOString().split('T')[0];
}

// Run the insertion
insertInvoices().catch(console.error);