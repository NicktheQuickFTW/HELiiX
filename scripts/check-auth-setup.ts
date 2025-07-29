import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

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

async function checkAuthSetup() {
  console.log('🔍 Checking authentication setup...\n');

  // Check if user_profiles table exists
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', ['user_profiles', 'user_audit_log', 'user_sessions']);

  if (tablesError) {
    console.error('❌ Error checking tables:', tablesError.message);

    // Try a simpler check
    const { error: profileError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (profileError?.code === '42P01') {
      console.log('❌ user_profiles table does not exist');
      console.log('📝 Run the auth migration to create required tables');
      return false;
    }
  } else {
    console.log(
      '✅ Found tables:',
      tables?.map((t) => t.table_name).join(', ')
    );
  }

  // Check for existing users
  const { data: users, error: usersError } = await supabase
    .from('user_profiles')
    .select('id, email, role, created_at')
    .limit(5);

  if (usersError) {
    console.error('❌ Error fetching users:', usersError.message);
  } else {
    console.log(`\n👥 Found ${users?.length || 0} users:`);
    users?.forEach((user) => {
      console.log(`   - ${user.email} (${user.role})`);
    });
  }

  // Check RLS policies
  const { data: policies, error: policiesError } = await supabase
    .rpc('get_policies', { table_name: 'user_profiles' })
    .select('*');

  if (!policiesError && policies) {
    console.log(
      `\n🔒 RLS is ${policies.length > 0 ? 'enabled' : 'disabled'} on user_profiles`
    );
  }

  // Test creating a test user
  console.log('\n🧪 Testing user creation...');
  const testEmail = `test.${Date.now()}@big12sports.com`;
  const { data: newUser, error: signUpError } =
    await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        first_name: 'Test',
        last_name: 'User',
        department: 'Testing',
      },
    });

  if (signUpError) {
    console.error('❌ Error creating test user:', signUpError.message);
  } else {
    console.log('✅ Test user created:', newUser.user?.email);

    // Check if profile was created
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', newUser.user?.id)
      .single();

    if (profile) {
      console.log('✅ User profile created automatically');
    } else {
      console.log('❌ User profile was not created (trigger may be missing)');
    }

    // Clean up test user
    if (newUser.user?.id) {
      await supabase.auth.admin.deleteUser(newUser.user.id);
      console.log('🧹 Test user cleaned up');
    }
  }

  console.log('\n✨ Auth setup check complete!');
}

// Run the check
checkAuthSetup().catch(console.error);
