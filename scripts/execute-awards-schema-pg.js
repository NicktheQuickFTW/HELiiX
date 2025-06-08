#!/usr/bin/env node

/**
 * Execute Awards Tracker Schema in Supabase using PostgreSQL
 */

import pg from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create PostgreSQL connection
const pool = new pg.Pool({
  connectionString: `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_DB_HOST}:5432/postgres`,
  ssl: { rejectUnauthorized: false }
});

async function executeSchema() {
  console.log('🚀 Adding Awards Tracker schema to Supabase...\n');
  
  let client;
  try {
    // Get a client from the pool
    client = await pool.connect();
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'src/migrations/05-add-awards-tracker-schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📄 Executing schema as a single transaction...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    try {
      // Execute the entire schema
      await client.query(schema);
      
      // Commit transaction
      await client.query('COMMIT');
      console.log('✅ Schema executed successfully!');
      
    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw error;
    }
    
    // Verify the tables were created
    console.log('\n🔍 Verifying tables...');
    
    const verifyQuery = `
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('awards', 'documents', 'invoices')
      ORDER BY table_name;
    `;
    
    const { rows: tables } = await client.query(verifyQuery);
    
    console.log('\nCreated tables:');
    for (const table of tables) {
      console.log(`✅ ${table.table_name} - ${table.column_count} columns`);
    }
    
    // Check if enum type was created
    const enumQuery = `
      SELECT typname 
      FROM pg_type 
      WHERE typname = 'status' 
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `;
    
    const { rows: enums } = await client.query(enumQuery);
    if (enums.length > 0) {
      console.log(`✅ Enum type 'status' created`);
    }
    
    // Count records in each table
    console.log('\nTable contents:');
    for (const table of ['awards', 'documents', 'invoices']) {
      const { rows } = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${rows[0].count} records`);
    }
    
    console.log('\n✅ Awards Tracker schema successfully added to Supabase!');
    
    console.log('\n📦 Next Steps:');
    console.log('1. Create storage buckets in Supabase dashboard:');
    console.log('   - heliix-awards (for award images)');
    console.log('   - heliix-invoices (for invoice documents)');
    console.log('2. Go to: Storage → New Bucket → Create with names above');
    console.log('3. Set both as private buckets with 50MB limit');
    
  } catch (error) {
    console.error('❌ Error executing schema:', error.message);
    if (error.detail) {
      console.error('Details:', error.detail);
    }
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
    process.exit(1);
  } finally {
    // Release the client back to the pool
    if (client) client.release();
    
    // End the pool
    await pool.end();
  }
}

executeSchema();