#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createTables() {
  console.log('🏗️  Creating simple awards and invoices tables...\n');

  try {
    // Create a simple jostens_invoices table first
    const createInvoicesTable = `
      CREATE TABLE IF NOT EXISTS jostens_invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(20) NOT NULL UNIQUE,
        sport_name VARCHAR(50) NOT NULL,
        sport_code VARCHAR(10) NOT NULL,
        award_type VARCHAR(50) NOT NULL, -- 'championship' or 'regular_season'
        class_code VARCHAR(20) NOT NULL,
        supervisor VARCHAR(50) NOT NULL,
        net_sales INTEGER NOT NULL, -- in cents
        tax INTEGER NOT NULL DEFAULT 0, -- in cents
        subtotal INTEGER NOT NULL, -- in cents
        shipping INTEGER NOT NULL DEFAULT 0, -- in cents
        balance_due INTEGER NOT NULL, -- in cents
        award_description TEXT,
        quantity INTEGER DEFAULT 1,
        vendor_name VARCHAR(50) DEFAULT 'Jostens',
        academic_year VARCHAR(10) DEFAULT '2024-25',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('📝 Creating jostens_invoices table...');
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: createInvoicesTable
    });

    if (tableError) {
      console.log('❌ Error creating table via rpc, trying direct approach...');
      
      // Try using the REST API approach for table creation
      console.log('🔧 Using raw SQL execution...');
      
      // Alternative: create via SQL using the query builder
      const { data, error } = await supabase
        .from('_supabase_admin')
        .select('*')
        .limit(1);
        
      console.log('Query result:', { data, error });
      
    } else {
      console.log('✅ jostens_invoices table created successfully');
    }

    // Test the table
    console.log('\n🧪 Testing table access...');
    const { data: testData, error: testError } = await supabase
      .from('jostens_invoices')
      .select('*')
      .limit(1);

    if (testError) {
      console.log('❌ Table test failed:', testError.message);
      
      // Let's try creating using a different method - insert a migration
      console.log('🔄 Trying alternative table creation...');
      
      const simpleInsert = `
        INSERT INTO _migrations (version, statements) VALUES (
          '20250610_jostens_invoices',
          '${createInvoicesTable.replace(/'/g, "''")}'
        );
      `;
      
      console.log('Would execute:', simpleInsert);
      
    } else {
      console.log('✅ Table is accessible');
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
    
    // Direct approach - let's insert our data into any existing table
    console.log('\n🔍 Let\'s check what tables exist...');
    
    // Try to find any table we can use
    const testTables = ['invoices', 'awards', 'financial_tracking', 'expenses'];
    
    for (const tableName of testTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
      if (!error) {
        console.log(`✅ Found table: ${tableName}`);
        if (data && data.length > 0) {
          console.log('Sample columns:', Object.keys(data[0]));
        }
      }
    }
  }
}

// Run the script
createTables()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });