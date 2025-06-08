#!/usr/bin/env node

/**
 * Create Storage Buckets for Awards Tracker
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createStorageBuckets() {
  console.log('🪣 Creating storage buckets for Awards Tracker...\n');
  
  const buckets = [
    {
      name: 'heliix-awards',
      public: false,
      fileSizeLimit: 52428800, // 50MB in bytes
      allowedMimeTypes: ['image/*', 'application/pdf']
    },
    {
      name: 'heliix-invoices', 
      public: false,
      fileSizeLimit: 52428800, // 50MB in bytes
      allowedMimeTypes: ['image/*', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    }
  ];
  
  for (const bucket of buckets) {
    try {
      console.log(`Creating bucket: ${bucket.name}...`);
      
      // Check if bucket already exists
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const exists = existingBuckets?.some(b => b.name === bucket.name);
      
      if (exists) {
        console.log(`✅ Bucket '${bucket.name}' already exists`);
        continue;
      }
      
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes
      });
      
      if (error) {
        console.error(`❌ Error creating bucket '${bucket.name}':`, error.message);
      } else {
        console.log(`✅ Bucket '${bucket.name}' created successfully`);
      }
      
    } catch (error) {
      console.error(`❌ Error with bucket '${bucket.name}':`, error.message);
    }
  }
  
  console.log('\n📋 Storage Bucket Configuration:');
  console.log('- heliix-awards: For award images');
  console.log('- heliix-invoices: For invoice documents');
  console.log('\n✅ Storage setup complete!');
  
  console.log('\n🔒 Bucket Policies:');
  console.log('Note: You may want to add RLS policies for these buckets in Supabase dashboard');
  console.log('Go to: Storage → Policies → New Policy');
}

createStorageBuckets();