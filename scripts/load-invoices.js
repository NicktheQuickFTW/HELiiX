#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Invoice loader class for batch operations
class InvoiceLoader {
  constructor() {
    this.batchSize = 50;
    this.errors = [];
    this.successes = 0;
  }

  // Validate invoice data before insertion
  validateInvoice(invoice) {
    const required = ['invoice_number', 'vendor_name', 'amount'];
    const missing = required.filter(field => !invoice[field]);
    
    if (missing.length > 0) {
      return { valid: false, error: `Missing required fields: ${missing.join(', ')}` };
    }

    // Validate amount is a number
    if (typeof invoice.amount !== 'number' || invoice.amount < 0) {
      return { valid: false, error: 'Amount must be a positive number' };
    }

    return { valid: true };
  }

  // Load invoices from various sources
  async loadFromJSON(filePath) {
    try {
      const fs = require('fs');
      const data = fs.readFileSync(filePath, 'utf8');
      const invoices = JSON.parse(data);
      
      console.log(`📂 Loaded ${invoices.length} invoices from ${filePath}`);
      return invoices;
    } catch (error) {
      console.error(`❌ Error loading JSON file: ${error.message}`);
      return [];
    }
  }

  // Transform invoice data to match database schema
  transformInvoice(invoice) {
    return {
      invoice_number: invoice.invoice_number || invoice.invoiceNumber,
      vendor_name: invoice.vendor_name || invoice.vendor || 'Unknown Vendor',
      amount: invoice.amount || invoice.total_amount || 0,
      date: invoice.invoice_date || invoice.date || new Date().toISOString(),
      due_date: invoice.due_date || null,
      status: invoice.status || 'planned',
      notes: invoice.description || invoice.notes || '',
      
      // Award-specific fields
      sport_id: invoice.sport_id || null,
      sport_code: invoice.sport_code || null,
      award_type: invoice.award_type || null,
      class_code: invoice.class_code || null,
      supervisor: invoice.supervisor || null,
      award_description: invoice.award_description || null,
      award_id_new: invoice.award_id_new || null,
      academic_year: invoice.academic_year || '2024-25',
      quantity: invoice.quantity || 1,
      unit_cost: invoice.unit_cost || null,
      tax_amount: invoice.tax_amount || 0,
      shipping_cost: invoice.shipping_cost || 0,
      account_code: invoice.account_code || (invoice.vendor_name === 'Jostens' ? '4105' : null),
      
      // Metadata
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Load invoices in batches
  async loadBatch(invoices) {
    const batches = [];
    for (let i = 0; i < invoices.length; i += this.batchSize) {
      batches.push(invoices.slice(i, i + this.batchSize));
    }

    console.log(`\n📦 Processing ${batches.length} batches of invoices...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const transformedBatch = [];
      
      // Validate and transform each invoice
      for (const invoice of batch) {
        const validation = this.validateInvoice(invoice);
        if (validation.valid) {
          transformedBatch.push(this.transformInvoice(invoice));
        } else {
          this.errors.push({
            invoice: invoice.invoice_number || 'Unknown',
            error: validation.error
          });
        }
      }

      // Insert batch
      if (transformedBatch.length > 0) {
        const { data, error } = await supabase
          .from('invoices')
          .insert(transformedBatch)
          .select();

        if (error) {
          console.error(`❌ Batch ${i + 1} error:`, error.message);
          this.errors.push({
            batch: i + 1,
            error: error.message
          });
        } else {
          this.successes += data.length;
          console.log(`✅ Batch ${i + 1}: Inserted ${data.length} invoices`);
        }
      }
    }
  }

  // Load sample invoices for testing
  async loadSampleInvoices() {
    const sampleInvoices = [
      {
        invoice_number: 'INV-2025-001',
        vendor_name: 'Jostens',
        amount: 290985,
        invoice_date: '2025-01-15',
        description: 'Baseball Championship Awards',
        sport_code: 'BSB',
        award_type: 'championship',
        class_code: 'S-050-00-HB-0',
        supervisor: 'Lizzie',
        award_description: 'Championship Trophy and MOP Award',
        academic_year: '2024-25',
        quantity: 2,
        unit_cost: 136218,
        tax_amount: 0,
        shipping_cost: 18549,
        account_code: '4105'
      },
      {
        invoice_number: 'INV-2025-002',
        vendor_name: 'Jostens',
        amount: 21231,
        invoice_date: '2025-01-10',
        description: 'Beach Volleyball Most Outstanding Pair',
        sport_code: 'BVB',
        award_type: 'regular_season',
        class_code: 'S-050-00-BV-W',
        supervisor: 'Lizzie',
        award_description: 'Most Outstanding Pair Awards',
        academic_year: '2024-25',
        quantity: 2,
        unit_cost: 9450,
        tax_amount: 0,
        shipping_cost: 2331,
        account_code: '4105'
      },
      {
        invoice_number: 'INV-2025-003',
        vendor_name: 'Big 12 Conference',
        amount: 150000,
        invoice_date: '2025-01-01',
        description: 'Q1 2025 Member Assessment',
        status: 'planned'
      }
    ];

    console.log('📝 Loading sample invoices...');
    await this.loadBatch(sampleInvoices);
  }

  // Generate summary report
  generateReport() {
    console.log('\n📊 Invoice Loading Summary:');
    console.log(`✅ Successfully loaded: ${this.successes} invoices`);
    console.log(`❌ Failed: ${this.errors.length} invoices`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach((err, index) => {
        console.log(`${index + 1}. ${JSON.stringify(err)}`);
      });
    }
  }
}

// Main execution
async function main() {
  const loader = new InvoiceLoader();
  
  console.log('🚀 Starting invoice loader...');
  console.log(`📍 Supabase URL: ${process.env.SUPABASE_URL}`);
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--sample') {
    // Load sample invoices
    await loader.loadSampleInvoices();
  } else if (args[0] === '--file' && args[1]) {
    // Load from JSON file
    const invoices = await loader.loadFromJSON(args[1]);
    if (invoices.length > 0) {
      await loader.loadBatch(invoices);
    }
  } else if (args[0] === '--help') {
    console.log(`
Invoice Loader Usage:
  node load-invoices.js                  Load sample invoices
  node load-invoices.js --sample         Load sample invoices
  node load-invoices.js --file <path>    Load invoices from JSON file
  node load-invoices.js --help           Show this help message

JSON File Format:
  [
    {
      "invoice_number": "INV-001",
      "vendor_name": "Vendor Name",
      "amount": 10000,
      "invoice_date": "2025-01-01",
      "description": "Invoice description",
      // Optional fields:
      "sport_code": "BSB",
      "award_type": "championship",
      "class_code": "S-050-00-HB-0",
      "supervisor": "Lizzie",
      "quantity": 1,
      "unit_cost": 10000,
      "tax_amount": 0,
      "shipping_cost": 0
    }
  ]
    `);
    return;
  } else {
    console.error('❌ Invalid arguments. Use --help for usage information.');
    process.exit(1);
  }
  
  // Generate final report
  loader.generateReport();
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled rejection:', error);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✨ Invoice loader completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { InvoiceLoader };