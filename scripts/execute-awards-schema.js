#!/usr/bin/env node

/**
 * Execute Awards Tracker Schema in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function executeSchema() {
  console.log('🚀 Adding Awards Tracker schema to Supabase...\n');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'src/migrations/05-add-awards-tracker-schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📄 Executing schema...');
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: schema
    });
    
    if (error) {
      // If RPC doesn't exist, try direct execution
      console.log('Trying alternative execution method...');
      
      // Split into individual statements and execute
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const statement of statements) {
        try {
          // Skip comments and empty statements
          if (!statement || statement.startsWith('--')) continue;
          
          // For Supabase, we'll need to use the REST API directly
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          
          // Note: Supabase doesn't provide direct SQL execution via JS client
          // You'll need to run this in the Supabase SQL editor
          console.log('⚠️  Statement needs to be run in Supabase SQL editor');
          
        } catch (err) {
          console.error(`❌ Error in statement: ${err.message}`);
          errorCount++;
        }
      }
      
      console.log('\n' + '='.repeat(50));
      console.log(`📋 Since Supabase JS client doesn't support direct SQL execution,`);
      console.log(`   please run the schema file in the Supabase SQL editor:`);
      console.log(`   ${schemaPath}`);
      console.log('='.repeat(50));
      
    } else {
      console.log('✅ Schema executed successfully!');
    }
    
    // Verify the tables were created
    console.log('\n🔍 Verifying tables...');
    
    const tablesToCheck = ['awards', 'documents', 'invoices'];
    
    for (const table of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`✅ Table '${table}' exists - ${count} records`);
        } else {
          console.log(`❌ Table '${table}' - Error: ${error.message}`);
        }
      } catch (e) {
        console.log(`❌ Table '${table}' - Error: ${e.message}`);
      }
    }
    
    console.log('\n📦 Storage Buckets Required:');
    console.log('Please create these buckets in your Supabase dashboard:');
    console.log('1. heliix-awards (for award images)');
    console.log('2. heliix-invoices (for invoice documents)');
    console.log('\nGo to: Storage → New Bucket → Create with names above');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

executeSchema();