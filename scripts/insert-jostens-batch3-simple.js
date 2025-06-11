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

async function insertInvoices() {
  console.log('Starting invoice insertion for Account 4250 batch...');

  for (const invoice of invoiceData.invoices) {
    try {
      // Insert main invoice record with only basic fields
      const { data: invoiceRecord, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoice.invoice_number,
          invoice_date: invoice.invoice_date,
          vendor: 'Jostens',
          description: `${invoice.account_code} - ${invoice.sport} - Promotional Items`,
          amount: invoice.balance_due,
          status: 'pending',
          due_date: calculateDueDate(invoice.invoice_date, invoice.terms)
        })
        .select()
        .single();

      if (invoiceError) {
        console.error(`Error inserting invoice ${invoice.invoice_number}:`, invoiceError);
        continue;
      }

      console.log(`✓ Inserted invoice ${invoice.invoice_number} for ${invoice.sport} (${invoice.account_code})`);
      console.log(`  Amount: $${invoice.balance_due.toFixed(2)}`);
      console.log(`  Items: ${invoice.items.length}`);

    } catch (error) {
      console.error(`Unexpected error processing invoice ${invoice.invoice_number}:`, error);
    }
  }

  console.log('\nInvoice insertion complete!');
  console.log(`Total invoices processed: ${invoiceData.invoices.length}`);
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