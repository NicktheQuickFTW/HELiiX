const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://vfzgnvcwakjxtdsaedfq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmemdudmN3YWtqeHRkc2FlZGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU3NDc1OCwiZXhwIjoyMDYyMTUwNzU4fQ.7wg6H2_TBldGAWEYLl12_1yhTnX_P8YNk9AUX19_SfM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function compareInvoices() {
  console.log('Comparing invoice files with database...\n');

  try {
    // Get all invoices from database
    const { data: dbInvoices, error } = await supabase
      .from('invoices')
      .select(
        'invoice_id, invoice_number, vendor_name, amount, award_description, sport_code, class_code'
      )
      .order('invoice_number', { ascending: true });

    if (error) {
      console.error('Error:', error);
      return;
    }

    // Get all PNG files from directory
    const invoiceDir = '/Users/nickw/Desktop/2024-25 Jostens-Awards Invoices';
    const files = fs
      .readdirSync(invoiceDir)
      .filter((file) => file.endsWith('.png'))
      .sort();

    // Extract invoice numbers from filenames
    const fileInvoices = {};
    files.forEach((file) => {
      // Extract invoice number (first part before hyphen)
      const invoiceNum = file.split('-')[0];
      if (!fileInvoices[invoiceNum]) {
        fileInvoices[invoiceNum] = [];
      }
      fileInvoices[invoiceNum].push(file);
    });

    // Get unique invoice numbers from database
    const dbInvoiceNumbers = [
      ...new Set(dbInvoices.map((inv) => inv.invoice_number)),
    ].sort();

    // Get unique invoice numbers from files
    const fileInvoiceNumbers = Object.keys(fileInvoices).sort();

    console.log('=== SUMMARY ===');
    console.log(
      `Database invoices: ${dbInvoices.length} entries (${dbInvoiceNumbers.length} unique invoice numbers)`
    );
    console.log(
      `File invoices: ${files.length} files (${fileInvoiceNumbers.length} unique invoice numbers)\n`
    );

    // Find mismatches
    console.log('=== INVOICE NUMBERS IN FILES BUT NOT IN DATABASE ===');
    const inFilesNotInDb = fileInvoiceNumbers.filter(
      (num) => !dbInvoiceNumbers.includes(num)
    );
    if (inFilesNotInDb.length === 0) {
      console.log('None found.\n');
    } else {
      inFilesNotInDb.forEach((num) => {
        console.log(`${num}: ${fileInvoices[num].join(', ')}`);
      });
      console.log(`\nTotal: ${inFilesNotInDb.length} invoice numbers\n`);
    }

    console.log('=== INVOICE NUMBERS IN DATABASE BUT NOT IN FILES ===');
    const inDbNotInFiles = dbInvoiceNumbers.filter(
      (num) => !fileInvoiceNumbers.includes(num)
    );
    if (inDbNotInFiles.length === 0) {
      console.log('None found.\n');
    } else {
      inDbNotInFiles.forEach((num) => {
        const dbEntries = dbInvoices.filter(
          (inv) => inv.invoice_number === num
        );
        console.log(`${num}:`);
        dbEntries.forEach((entry) => {
          console.log(
            `  - ID: ${entry.invoice_id}, Amount: $${entry.amount}, Desc: ${entry.award_description}`
          );
        });
      });
      console.log(`\nTotal: ${inDbNotInFiles.length} invoice numbers\n`);
    }

    // Show mapping between file names and potential database matches
    console.log('=== FILE TO DATABASE MAPPING ===');
    console.log(
      'Note: Some file invoice numbers (791xxx) may need to be mapped to actual invoice numbers\n'
    );

    // Look for patterns - files starting with 791xxx might be mapped differently
    const mappingIssues = fileInvoiceNumbers.filter((num) =>
      num.startsWith('791')
    );
    if (mappingIssues.length > 0) {
      console.log(
        `Found ${mappingIssues.length} files with 791xxx numbers that may need mapping:`
      );
      mappingIssues.forEach((num) => {
        const files = fileInvoices[num];
        console.log(`\n${num}:`);
        files.forEach((file) => {
          // Extract description from filename
          const parts = file.split('-');
          const classCode = parts.slice(1, 6).join('-');
          const desc = parts
            .slice(6)
            .join('-')
            .replace('.png', '')
            .replace(/-/g, ' ');
          console.log(`  File: ${file}`);
          console.log(`  Class: ${classCode}`);
          console.log(`  Desc: ${desc}`);

          // Try to find matching database entry by class code and description
          const possibleMatches = dbInvoices.filter(
            (inv) =>
              inv.class_code === classCode ||
              (inv.award_description &&
                inv.award_description
                  .toLowerCase()
                  .includes(desc.toLowerCase().substring(0, 10)))
          );

          if (possibleMatches.length > 0) {
            console.log(`  Possible DB matches:`);
            possibleMatches.forEach((match) => {
              console.log(
                `    - Invoice #${match.invoice_number}: ${match.award_description} (${match.class_code})`
              );
            });
          }
        });
      });
    }

    // Create mapping file
    const mapping = {
      summary: {
        totalDbEntries: dbInvoices.length,
        uniqueDbInvoices: dbInvoiceNumbers.length,
        totalFiles: files.length,
        uniqueFileInvoices: fileInvoiceNumbers.length,
        inFilesNotInDb: inFilesNotInDb.length,
        inDbNotInFiles: inDbNotInFiles.length,
      },
      filesNotInDb: inFilesNotInDb,
      dbNotInFiles: inDbNotInFiles,
      allFileInvoices: fileInvoices,
      allDbInvoices: dbInvoiceNumbers,
    };

    fs.writeFileSync(
      'invoice_comparison.json',
      JSON.stringify(mapping, null, 2)
    );
    console.log('\nDetailed comparison saved to: invoice_comparison.json');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute
compareInvoices();
