import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const dbPassword = process.env.SUPABASE_DB_PASSWORD!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  const projectRef = 'vfzgnvcwakjxtdsaedfq';
  const dbHost = `db.${projectRef}.supabase.co`;

  try {
    // Read the migration file
    const migrationPath = path.resolve(
      process.cwd(),
      'supabase/migrations/10-team-sheets-and-games.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Create a temporary file with the migration
    const tempFile = '/tmp/migration.sql';
    fs.writeFileSync(tempFile, migrationSQL);

    // Run the migration using psql
    const psqlCommand = `PGPASSWORD="${dbPassword}" psql -h ${dbHost} -U postgres -d postgres -f ${tempFile}`;

    console.log('Executing migration...');
    execSync(psqlCommand, { stdio: 'inherit' });

    console.log('✅ Migration completed successfully!\n');

    // Clean up
    fs.unlinkSync(tempFile);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log(
      '\nAlternative: Run the migration manually in Supabase SQL Editor:'
    );
    console.log(`https://supabase.com/dashboard/project/${projectRef}/sql`);
  }
}

async function checkTables() {
  console.log('📋 Checking if tables were created...\n');

  const tables = ['conferences', 'teams', 'games'];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ Table '${table}' exists with ${count || 0} records`);
    } else {
      console.log(`❌ Table '${table}' not found or error: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🏀 Basketball Data Migration and Import Process\n');

  // Step 1: Run migration
  await runMigration();

  // Step 2: Check tables
  await checkTables();

  console.log('\n✅ Process complete!');
  console.log('\nNext steps:');
  console.log('1. Run the team data import script');
  console.log('2. Run the game data import script');
}

main().catch(console.error);
