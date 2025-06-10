const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
(async () => {
  try {
    const { data, error } = await supabase.from('awards').select('*').limit(1);
    if (error) {
      console.log('Awards table error:', error.message);
      console.log('Need to run migrations');
    } else {
      console.log('Awards table exists, connection successful');
      console.log('Current awards:', data);
    }
  } catch (err) {
    console.error('Connection error:', err.message);
  }
})();