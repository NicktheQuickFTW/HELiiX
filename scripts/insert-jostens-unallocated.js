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
  fs.readFileSync(join(__dirname, 'jostens-invoices-2024-25-unallocated.json'), 'utf8')
);

// Sport code mapping
const sportCodeMap = {
  'Unallocated - Academic Awards': { code: 'XX', id: 1 }, // Using Baseball as placeholder for unallocated
  'Unallocated - Dummy Medals': { code: 'XX', id: 1 }, // Using Baseball as placeholder for unallocated
  'Unallocated - Trophy Repair': { code: 'XX', id: 1 }, // Using Baseball as placeholder for unallocated
  'Equestrian': { code: 'EQ', id: 7 },
  'Indoor Track & Field - Men': { code: 'MITF', id: 20 },
  'Lacrosse - Women': { code: 'LAX', id: 12 },
  'Rowing - Women': { code: 'ROW', id: 13 }
};

async function insertInvoices() {
  console.log('Starting unallocated invoice insertion...');
  let successCount = 0;

  for (const invoice of invoiceData.invoices) {
    try {
      const sportInfo = sportCodeMap[invoice.sport] || { code: 'XX', id: 0 };
      
      // Calculate totals from items
      let totalQuantity = 0;
      invoice.items.forEach(item => {
        totalQuantity += item.quantity;
      });

      // Determine supervisor based on sport/type
      let supervisor = 'Lizzie'; // Default for most unallocated
      if (invoice.sport.includes('Academic')) {
        supervisor = 'Nicole';
      }

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
          sport_id: sportInfo.id,
          sport_code: sportInfo.code,
          award_type: 'regular_season',
          class_code: invoice.account_code,
          supervisor: supervisor,
          award_description: getAwardDescription(invoice),
          academic_year: invoice.academic_year,
          quantity: totalQuantity,
          unit_cost: Math.round((invoice.net_sales / totalQuantity) * 100), // Average unit cost in cents
          tax_amount: Math.round((invoice.tax || 0) * 100), // Convert to cents
          shipping_cost: Math.round((invoice.shipping_cost || 0) * 100) // Convert to cents
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

  console.log('\nUnallocated invoice insertion complete!');
  console.log(`Successfully inserted: ${successCount} of ${invoiceData.invoices.length} invoices`);
  console.log(`Total amount: $${invoiceData.summary.total_amount.toFixed(2)}`);
  
  // Display summary by category
  console.log('\nSummary by Category:');
  Object.entries(invoiceData.summary.by_category).forEach(([category, data]) => {
    console.log(`  ${category}: ${data.count} invoice(s) - $${data.amount.toFixed(2)}`);
  });
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
  date.setDate(date.getDate() + 30); // Default to Net 30
  return date.toISOString().split('T')[0];
}

function getAwardDescription(invoice) {
  if (invoice.sport.includes('Academic')) {
    return 'Academic Awards - All-Rookie Team Certificates';
  } else if (invoice.sport.includes('Dummy')) {
    return 'Display/Demo Medals';
  } else if (invoice.sport.includes('Trophy Repair')) {
    return 'Trophy Repair & Replacement Parts';
  } else if (invoice.items.some(item => item.description.toLowerCase().includes('nameplate') || item.description.toLowerCase().includes('plate'))) {
    return 'Nameplates';
  } else if (invoice.items.some(item => item.description.toLowerCase().includes('medal'))) {
    return 'Medals & Awards';
  }
  return 'Miscellaneous Awards';
}

// Run the insertion
insertInvoices().catch(console.error);