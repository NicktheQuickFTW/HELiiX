#!/usr/bin/env node

/**
 * Execute Awards Recipients Tracking Schema
 */

import pg from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from parent directory
dotenv.config({ path: path.join(path.dirname(__dirname), '.env') });

// Create PostgreSQL connection
const pool = new pg.Pool({
  connectionString: `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_DB_HOST}:5432/postgres`,
  ssl: { rejectUnauthorized: false }
});

async function executeSchema() {
  console.log('🚀 Adding Awards Recipients Tracking schema...\n');
  
  let client;
  try {
    client = await pool.connect();
    
    // Read the schema file
    const schemaPath = path.join(path.dirname(__dirname), 'migrations/06-add-awards-recipients-tracking.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📄 Executing recipients tracking schema...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    try {
      await client.query(schema);
      await client.query('COMMIT');
      console.log('✅ Recipients tracking schema executed successfully!');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying schema updates...');
    
    // Check new columns on awards table
    const { rows: columns } = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'awards' 
      AND column_name IN ('team_id', 'sport_id', 'school_id', 'season_year', 'award_type', 'recipient_name')
      ORDER BY column_name;
    `);
    
    console.log('\nNew columns added to awards table:');
    columns.forEach(col => {
      console.log(`✅ ${col.column_name} (${col.data_type})`);
    });
    
    // Check if award_recipients table was created
    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'award_recipients';
    `);
    
    if (tables.length > 0) {
      console.log('\n✅ award_recipients table created successfully');
      
      // Count columns
      const { rows: recipientCols } = await client.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_name = 'award_recipients';
      `);
      console.log(`   - ${recipientCols[0].count} columns`);
    }
    
    // Check views
    const { rows: views } = await client.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'v_award%'
      ORDER BY table_name;
    `);
    
    console.log('\nViews created:');
    views.forEach(v => {
      console.log(`✅ ${v.table_name}`);
    });
    
    console.log('\n✅ Awards tracking system is now fully integrated with teams/sports/schools!');
    console.log('\n📋 You can now:');
    console.log('- Track awards by team (with team_id)');
    console.log('- Track awards by sport (with sport_id)');  
    console.log('- Track awards by school (with school_id)');
    console.log('- Track recipients for each award by year');
    console.log('- Query using any combination of team/sport/school');
    
  } catch (error) {
    console.error('❌ Error executing schema:', error.message);
    if (error.detail) console.error('Details:', error.detail);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

executeSchema();