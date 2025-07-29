import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('📋 Applying team sheets and games migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.resolve(
      process.cwd(),
      'supabase/migrations/10-team-sheets-and-games.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .filter((stmt) => stmt.trim().length > 0)
      .map((stmt) => stmt.trim() + ';');

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments
      if (
        statement.trim().startsWith('--') ||
        statement.trim().startsWith('COMMENT')
      ) {
        continue;
      }

      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      // For now, we'll use the REST API to check if tables exist
      // Since we can't execute raw SQL directly through the client SDK

      if (statement.includes('CREATE TABLE')) {
        console.log(
          '✅ Table creation statement - would be executed via SQL editor'
        );
      } else if (statement.includes('INSERT INTO conferences')) {
        // We can handle data insertions
        console.log('✅ Conference data ready for insertion');
      }
    }

    console.log('\n⚠️  To complete the migration:');
    console.log(
      '1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/vfzgnvcwakjxtdsaedfq/sql'
    );
    console.log(
      '2. Copy the content from: supabase/migrations/10-team-sheets-and-games.sql'
    );
    console.log('3. Execute the SQL in the editor');
    console.log(
      '\nAfter that, run the data import script to populate the teams and games.'
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

applyMigration();
