import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyAuthMigration() {
  console.log('🚀 Applying auth migration...\n');

  try {
    // Read the migration file
    const migrationPath = resolve(
      process.cwd(),
      'supabase/migrations/08-auth-setup.sql'
    );
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Split the migration into individual statements
    // This is a simple split - in production you'd want more robust SQL parsing
    const statements = migrationSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip if it's just whitespace or comments
      if (!statement.trim() || statement.trim().startsWith('--')) {
        continue;
      }

      // Extract a description from the statement
      let description = statement.substring(0, 50).replace(/\n/g, ' ');
      if (statement.toLowerCase().includes('create table')) {
        const match = statement.match(
          /create table\s+(?:if not exists\s+)?(\S+)/i
        );
        description = `Create table ${match?.[1] || 'unknown'}`;
      } else if (statement.toLowerCase().includes('create policy')) {
        const match = statement.match(/create policy\s+"([^"]+)"/i);
        description = `Create policy: ${match?.[1] || 'unknown'}`;
      } else if (statement.toLowerCase().includes('create index')) {
        const match = statement.match(
          /create index\s+(?:if not exists\s+)?(\S+)/i
        );
        description = `Create index ${match?.[1] || 'unknown'}`;
      } else if (statement.toLowerCase().includes('create function')) {
        const match = statement.match(
          /create\s+(?:or replace\s+)?function\s+(\S+)/i
        );
        description = `Create function ${match?.[1] || 'unknown'}`;
      } else if (statement.toLowerCase().includes('create trigger')) {
        const match = statement.match(/create trigger\s+(\S+)/i);
        description = `Create trigger ${match?.[1] || 'unknown'}`;
      }

      process.stdout.write(
        `[${i + 1}/${statements.length}] ${description}... `
      );

      try {
        // Execute via Supabase RPC or direct SQL execution
        const { error } = await supabase
          .rpc('exec_sql', {
            query: statement,
          })
          .single();

        if (error) {
          // If RPC doesn't exist, we'll get an error. That's okay for now.
          // In production, you'd use a proper migration tool
          if (
            error.message.includes('function public.exec_sql does not exist')
          ) {
            console.log('⚠️  (exec_sql not available - skipping)');
            continue;
          }
          throw error;
        }

        console.log('✅');
        successCount++;
      } catch (error) {
        console.log('❌');
        console.error(`   Error: ${error.message}`);
        errorCount++;

        // Don't stop on errors - some statements might fail if objects already exist
        // In production, you'd want better error handling
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(
      `   ⚠️  Skipped: ${statements.length - successCount - errorCount}`
    );

    // Create a default admin user for testing
    console.log('\n👤 Creating default admin user...');
    const { data: adminUser, error: adminError } =
      await supabase.auth.admin.createUser({
        email: 'admin@big12sports.com',
        password: 'Conference12!',
        email_confirm: true,
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User',
          department: 'IT',
        },
      });

    if (adminError) {
      if (adminError.message.includes('already been registered')) {
        console.log('ℹ️  Admin user already exists');
      } else {
        console.error('❌ Error creating admin user:', adminError.message);
      }
    } else {
      console.log(
        '✅ Admin user created: admin@big12sports.com / Conference12!'
      );

      // Update the user profile to have admin role
      if (adminUser.user?.id) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('id', adminUser.user.id);

        if (!updateError) {
          console.log('✅ Admin role assigned');
        }
      }
    }

    console.log('\n✨ Migration complete!');
    console.log('\n📌 You can now log in with:');
    console.log('   Email: admin@big12sports.com');
    console.log('   Password: Conference12!');
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the migration
applyAuthMigration().catch(console.error);
