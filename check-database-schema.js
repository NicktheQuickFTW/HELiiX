#!/usr/bin/env node

/**
 * Database Schema Checker for Big 12 Policies Import
 * Verifies that required tables exist and have correct structure
 */

require('dotenv').config({ path: '/Users/nickw/.env/flextime.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check if a table exists and get its structure
 */
async function checkTable(tableName) {
  console.log(`🔍 Checking table: ${tableName}`);

  try {
    // Try to select from the table to check if it exists
    const { data, error } = await supabase.from(tableName).select('*').limit(0); // Just check structure, don't return data

    if (error) {
      console.log(`❌ Table '${tableName}' error:`, error.message);
      return false;
    }

    console.log(`✅ Table '${tableName}' exists and is accessible`);
    return true;
  } catch (error) {
    console.log(`❌ Error checking table '${tableName}':`, error.message);
    return false;
  }
}

/**
 * Get sample data from a table to understand its structure
 */
async function getSampleData(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(3);

    if (error) {
      console.log(
        `❌ Error getting sample data from '${tableName}':`,
        error.message
      );
      return null;
    }

    if (data && data.length > 0) {
      console.log(`📊 Sample record from '${tableName}':`);
      console.log('   Columns:', Object.keys(data[0]).join(', '));
      console.log(`   Records found: ${data.length}`);
    } else {
      console.log(`📭 Table '${tableName}' is empty`);
    }

    return data;
  } catch (error) {
    console.log(
      `❌ Error getting sample data from '${tableName}':`,
      error.message
    );
    return null;
  }
}

/**
 * Create missing tables with suggested schema
 */
async function suggestTableCreation(tableName) {
  console.log(`\n💡 Suggested SQL to create '${tableName}' table:`);

  switch (tableName) {
    case 'policies':
      console.log(`
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_id VARCHAR(20) UNIQUE NOT NULL,
    sport VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'all',
    year VARCHAR(10) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    table_of_contents TEXT,
    sections JSONB,
    word_count INTEGER,
    last_modified TIMESTAMP DEFAULT NOW(),
    source_file VARCHAR(255),
    category VARCHAR(50) DEFAULT 'sport_policy',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_policies_sport ON policies(sport);
CREATE INDEX idx_policies_gender ON policies(gender);
CREATE INDEX idx_policies_year ON policies(year);
CREATE INDEX idx_policies_category ON policies(category);
            `);
      break;

    case 'awards':
      console.log(`
CREATE TABLE awards (
    id SERIAL PRIMARY KEY,
    policy_id VARCHAR(20) REFERENCES policies(policy_id),
    sport VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'all',
    year VARCHAR(10) NOT NULL,
    award_name VARCHAR(200),
    award_type VARCHAR(100),
    criteria TEXT,
    eligibility_requirements TEXT,
    selection_process TEXT,
    recognition_type VARCHAR(100),
    voting_deadline DATE,
    announcement_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_awards_sport ON awards(sport);
CREATE INDEX idx_awards_type ON awards(award_type);
CREATE INDEX idx_awards_policy_id ON awards(policy_id);
            `);
      break;

    case 'scheduling_parameters':
      console.log(`
CREATE TABLE scheduling_parameters (
    id SERIAL PRIMARY KEY,
    policy_id VARCHAR(20) REFERENCES policies(policy_id),
    sport VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'all',
    year VARCHAR(10) NOT NULL,
    parameter_type VARCHAR(100),
    parameter_name VARCHAR(200),
    parameter_value TEXT,
    numeric_value INTEGER,
    is_core_principle BOOLEAN DEFAULT false,
    is_soft_principle BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_scheduling_sport ON scheduling_parameters(sport);
CREATE INDEX idx_scheduling_type ON scheduling_parameters(parameter_type);
CREATE INDEX idx_scheduling_policy_id ON scheduling_parameters(policy_id);
            `);
      break;

    default:
      console.log(`No schema suggestion available for table: ${tableName}`);
  }
}

/**
 * Main function to check database schema
 */
async function main() {
  console.log('🗄️  Database Schema Checker');
  console.log('==========================\n');

  const requiredTables = ['policies', 'awards', 'scheduling_parameters'];
  const tableStatus = {};

  // Check each required table
  for (const table of requiredTables) {
    const exists = await checkTable(table);
    tableStatus[table] = exists;

    if (exists) {
      await getSampleData(table);
    } else {
      await suggestTableCreation(table);
    }

    console.log(''); // Add spacing
  }

  // Summary
  console.log('📋 Summary:');
  console.log('============');

  const existingTables = Object.entries(tableStatus).filter(
    ([, exists]) => exists
  );
  const missingTables = Object.entries(tableStatus).filter(
    ([, exists]) => !exists
  );

  if (existingTables.length > 0) {
    console.log('✅ Existing tables:');
    existingTables.forEach(([table]) => console.log(`   • ${table}`));
  }

  if (missingTables.length > 0) {
    console.log('❌ Missing tables:');
    missingTables.forEach(([table]) => console.log(`   • ${table}`));
    console.log(
      '\n💡 Run the suggested SQL commands above to create missing tables.'
    );
  }

  if (missingTables.length === 0) {
    console.log(
      '\n🎉 All required tables exist! You can proceed with the import.'
    );
  } else {
    console.log(
      '\n⚠️  Please create the missing tables before running the import script.'
    );
  }
}

if (require.main === module) {
  main().catch(console.error);
}
