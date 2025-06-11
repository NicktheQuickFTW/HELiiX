import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createBig12ContactsTable() {
  console.log('🚀 Creating big12_contacts table...')
  
  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '../supabase/migrations/20250610174500_big12_contacts_actual_schema.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📝 Executing SQL migration...')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('execute_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ Error creating table:', error)
      return false
    }
    
    console.log('✅ Table created successfully!')
    
    // Verify the table exists
    const { data: tableCheck, error: checkError } = await supabase
      .from('big12_contacts')
      .select('count')
      .limit(1)
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error verifying table:', checkError)
      return false
    }
    
    console.log('🎯 Table verification complete!')
    console.log('📊 Ready to sync Notion data!')
    
    return true
    
  } catch (err) {
    console.error('❌ Script error:', err)
    return false
  }
}

// Alternative approach - execute SQL directly
async function executeSqlDirect() {
  console.log('🔧 Executing SQL directly...')
  
  const sql = `
    -- XII Conference Contacts Table - Exact Schema Match
    CREATE TABLE IF NOT EXISTS big12_contacts (
      -- Notion metadata
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      notion_id TEXT UNIQUE NOT NULL,
      notion_url TEXT,
      notion_created_time TIMESTAMPTZ,
      notion_last_edited_time TIMESTAMPTZ,
      
      -- Core Contact Information
      name TEXT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      birthdate DATE,
      
      -- Organizational Information
      affiliation TEXT,
      title TEXT,
      department_conf_office TEXT,
      member_status TEXT,
      
      -- Sports and Roles (JSONB for multi-select)
      sport JSONB DEFAULT '[]'::jsonb,
      sport_role JSONB DEFAULT '[]'::jsonb,
      governance_group JSONB DEFAULT '[]'::jsonb,
      
      -- Sport Liaison Responsibilities
      sport_liaison_for JSONB DEFAULT '[]'::jsonb,
      secondary_liaison_for JSONB DEFAULT '[]'::jsonb,
      communications_liaison_for JSONB DEFAULT '[]'::jsonb,
      marketing_liaison_for JSONB DEFAULT '[]'::jsonb,
      swa_liaison_for JSONB DEFAULT '[]'::jsonb,
      secondary_swa_liaison_for JSONB DEFAULT '[]'::jsonb,
      liaison_to_officials_for JSONB DEFAULT '[]'::jsonb,
      
      -- System fields
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      sync_status TEXT DEFAULT 'pending',
      sync_error TEXT
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_big12_contacts_notion_id ON big12_contacts(notion_id);
    CREATE INDEX IF NOT EXISTS idx_big12_contacts_email ON big12_contacts(email);
    CREATE INDEX IF NOT EXISTS idx_big12_contacts_affiliation ON big12_contacts(affiliation);
    CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport ON big12_contacts USING GIN(sport);
    CREATE INDEX IF NOT EXISTS idx_big12_contacts_sport_role ON big12_contacts USING GIN(sport_role);
  `
  
  try {
    // Try to execute using the SQL editor approach
    const { data, error } = await supabase
      .from('big12_contacts')
      .select('count')
      .limit(0)
    
    if (error && error.message.includes('does not exist')) {
      console.log('🎯 Table does not exist, need to create it manually')
      console.log('📋 Copy this SQL and run it in your Supabase SQL Editor:')
      console.log('\n' + '='.repeat(60))
      console.log(sql)
      console.log('='.repeat(60) + '\n')
      return false
    } else if (error) {
      console.error('❌ Error checking table:', error)
      return false
    } else {
      console.log('✅ Table already exists!')
      return true
    }
    
  } catch (err) {
    console.error('❌ Error:', err)
    return false
  }
}

// Run the script
console.log('🏈 Big 12 Contacts Table Creator')
console.log('================================')

executeSqlDirect()
  .then(success => {
    if (success) {
      console.log('🎉 All done! Ready to sync!')
    } else {
      console.log('⚠️  Manual setup required - check output above')
    }
    process.exit(0)
  })
  .catch(err => {
    console.error('💥 Fatal error:', err)
    process.exit(1)
  })