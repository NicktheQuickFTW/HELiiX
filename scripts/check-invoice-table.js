#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkInvoiceTable() {
  console.log('🔍 Checking existing invoice table structure...\n');

  try {
    // Check invoices table
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .limit(3);

    if (invoicesError) {
      console.log('❌ Error accessing invoices table:', invoicesError.message);
      
      // Try alternative table names
      const altTables = ['invoice', 'jostens_invoices', 'awards_invoices', 'financial_tracking'];
      for (const tableName of altTables) {
        console.log(`🔍 Trying table: ${tableName}`);
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(2);
          
        if (!error && data) {
          console.log(`✅ Found table: ${tableName}`);
          if (data.length > 0) {
            console.log('📊 Sample columns:', Object.keys(data[0]));
            console.log('📊 Sample record:', data[0]);
          }
          break;
        }
      }
    } else {
      console.log('✅ Invoices table found!');
      console.log(`📊 Records found: ${invoicesData.length}\n`);
      
      if (invoicesData.length > 0) {
        console.log('📋 Current table structure:');
        const columns = Object.keys(invoicesData[0]);
        columns.forEach(col => {
          const value = invoicesData[0][col];
          const type = typeof value;
          console.log(`  ${col}: ${type} (example: ${value})`);
        });
        
        console.log('\n📊 Sample records:');
        invoicesData.forEach((record, index) => {
          console.log(`${index + 1}. ${JSON.stringify(record, null, 2)}`);
        });
      } else {
        console.log('📊 Table exists but is empty');
      }
    }

    // Show what columns we need to add
    console.log('\n🔧 Columns needed for Jostens data:');
    const neededColumns = [
      'sport_id (integer) - 2-digit sport ID from sports table',
      'sport_code (varchar) - BSB, BVB, EQ, etc.',
      'award_type (varchar) - championship, regular_season', 
      'class_code (varchar) - S-050-00-HB-0, S-060-00-BV-W, etc.',
      'supervisor (varchar) - Lizzie, Scott, etc.',
      'award_description (text) - Championship Trophy, MOP, etc.',
      'award_id (varchar) - 01-01-01-2026 format',
      'academic_year (varchar) - 2024-25',
      'quantity (integer) - number of awards'
    ];
    
    neededColumns.forEach(col => console.log(`  + ${col}`));

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the script
checkInvoiceTable()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });