#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function runMigration() {
  console.log('🚀 Running awards program migration...\n');

  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync('./supabase/migrations/07-restructure-awards-program.sql', 'utf8');
    
    console.log('📝 Migration file loaded, executing SQL...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec', {
      query: migrationSQL
    });

    if (error) {
      console.log('❌ Migration failed, trying raw query approach...');
      console.log('Error:', error.message);
      
      // Try executing parts of the migration manually
      const sqlStatements = migrationSQL.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (let i = 0; i < Math.min(3, sqlStatements.length); i++) {
        const statement = sqlStatements[i].trim();
        if (statement) {
          console.log(`🔧 Executing statement ${i + 1}...`);
          const { error: stmtError } = await supabase.rpc('exec', { query: statement });
          if (stmtError) {
            console.log(`❌ Statement ${i + 1} failed:`, stmtError.message);
          } else {
            console.log(`✅ Statement ${i + 1} successful`);
          }
        }
      }
    } else {
      console.log('✅ Migration completed successfully');
    }

    // Test if tables were created
    console.log('\n🔍 Testing table creation...');
    const { data: testData, error: testError } = await supabase
      .from('awards_program')
      .select('*')
      .limit(1);

    if (testError) {
      console.log('❌ awards_program table still not available:', testError.message);
    } else {
      console.log('✅ awards_program table is now available');
    }

  } catch (error) {
    console.error('💥 Error running migration:', error.message);
  }
}

// Run the script
runMigration()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });