#!/usr/bin/env node

/**
 * Verify Awards Tracker Setup
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function verifySetup() {
  console.log('🔍 Verifying Awards Tracker Setup...\n');
  
  const results = {
    tables: { success: 0, failed: 0 },
    buckets: { success: 0, failed: 0 }
  };
  
  // Check tables
  console.log('📊 Checking Tables:');
  const tables = ['awards', 'documents', 'invoices'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ Table '${table}' - OK (${count} records)`);
        results.tables.success++;
      } else {
        console.log(`❌ Table '${table}' - Error: ${error.message}`);
        results.tables.failed++;
      }
    } catch (e) {
      console.log(`❌ Table '${table}' - Error: ${e.message}`);
      results.tables.failed++;
    }
  }
  
  // Check storage buckets
  console.log('\n🪣 Checking Storage Buckets:');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (!bucketsError && buckets) {
    const requiredBuckets = ['heliix-awards', 'heliix-invoices'];
    
    for (const bucketName of requiredBuckets) {
      const exists = buckets.some(b => b.name === bucketName);
      if (exists) {
        console.log(`✅ Bucket '${bucketName}' - OK`);
        results.buckets.success++;
      } else {
        console.log(`❌ Bucket '${bucketName}' - Not found`);
        results.buckets.failed++;
      }
    }
  }
  
  // Test creating a sample award
  console.log('\n🧪 Testing Award Creation:');
  try {
    const { data: award, error } = await supabase
      .from('awards')
      .insert({
        name: 'Test Award',
        description: 'Testing awards functionality',
        status: 'planned',
        quantity: 1
      })
      .select()
      .single();
    
    if (!error && award) {
      console.log(`✅ Successfully created test award (ID: ${award.id})`);
      
      // Clean up test award
      await supabase.from('awards').delete().eq('id', award.id);
      console.log('✅ Test award cleaned up');
    } else {
      console.log(`❌ Failed to create test award: ${error?.message}`);
    }
  } catch (e) {
    console.log(`❌ Test failed: ${e.message}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 Setup Verification Summary:');
  console.log(`Tables: ${results.tables.success}/${tables.length} successful`);
  console.log(`Buckets: ${results.buckets.success}/2 successful`);
  console.log('='.repeat(50));
  
  if (results.tables.failed === 0 && results.buckets.failed === 0) {
    console.log('\n✅ Awards Tracker is fully set up and ready to use!');
  } else {
    console.log('\n⚠️  Some components need attention. Check the errors above.');
  }
}

verifySetup();