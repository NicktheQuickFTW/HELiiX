import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAndImportInvoices() {
  console.log('🏗️  Creating invoices table and importing CSV data...\n');

  try {
    // First create the table using raw SQL
    console.log('1. Creating invoices table...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.invoices (
        invoice_id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        vendor_name VARCHAR(255) NOT NULL DEFAULT 'Jostens',
        total_amount INTEGER NOT NULL DEFAULT 0,
        tax_amount INTEGER DEFAULT 0,
        shipping_cost INTEGER DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'planned',
        date DATE,
        due_date DATE,
        notes TEXT,
        academic_year VARCHAR(10) DEFAULT '2024-25',
        class_code VARCHAR(50),
        sport VARCHAR(100),
        award_type VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Enable all for service role" ON public.invoices
      FOR ALL USING (true) WITH CHECK (true);
    `;

    // Use direct database connection for DDL
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await pool.query(createTableSQL);
    console.log('✅ Table created successfully!');

    // Now import the CSV data
    console.log('2. Reading CSV data...');
    const csvData = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream('./consolidated_invoices.csv')
        .pipe(csv())
        .on('data', (row) => {
          // Convert CSV row to database format
          const invoice = {
            invoice_number: row.invoice_number,
            vendor_name: row.vendor_name || 'Jostens',
            total_amount: parseInt(row.total_amount) || 0,
            tax_amount: parseInt(row.tax_amount) || 0,
            shipping_cost: parseInt(row.shipping_cost) || 0,
            status: row.status || 'planned',
            date: row.date
              ? new Date(row.date).toISOString().split('T')[0]
              : null,
            due_date: row.due_date
              ? new Date(row.due_date).toISOString().split('T')[0]
              : null,
            notes: row.notes || '',
            academic_year: row.academic_year || '2024-25',
          };
          csvData.push(invoice);
        })
        .on('end', async () => {
          console.log(`📊 Found ${csvData.length} invoices in CSV`);

          try {
            // Insert data in batches
            console.log('3. Inserting data into Supabase...');

            const batchSize = 50;
            let imported = 0;

            for (let i = 0; i < csvData.length; i += batchSize) {
              const batch = csvData.slice(i, i + batchSize);

              const { data, error } = await supabase
                .from('invoices')
                .insert(batch)
                .select();

              if (error) {
                console.error(
                  `❌ Error inserting batch ${i / batchSize + 1}:`,
                  error
                );
                continue;
              }

              imported += batch.length;
              console.log(
                `   Imported ${imported}/${csvData.length} invoices...`
              );
            }

            console.log(`✅ Successfully imported ${imported} invoices!`);

            // Verify the import
            const { count } = await supabase
              .from('invoices')
              .select('*', { count: 'exact', head: true });

            console.log(`📈 Total invoices in database: ${count}`);

            // Show summary
            const { data: summary } = await supabase
              .from('invoices')
              .select('status, vendor_name, total_amount')
              .limit(1000);

            if (summary) {
              const totalAmount = summary.reduce(
                (sum, inv) => sum + inv.total_amount,
                0
              );
              const statusCounts = {};
              const vendorCounts = {};

              summary.forEach((inv) => {
                statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
                vendorCounts[inv.vendor_name] =
                  (vendorCounts[inv.vendor_name] || 0) + 1;
              });

              console.log(`\n📊 SUMMARY:`);
              console.log(
                `   Total Amount: $${(totalAmount / 100).toLocaleString()}`
              );
              console.log(`   By Status:`, statusCounts);
              console.log(`   By Vendor:`, vendorCounts);
            }

            resolve(true);
          } catch (error) {
            console.error('❌ Error during import:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('❌ Error reading CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Run the import
createAndImportInvoices();
