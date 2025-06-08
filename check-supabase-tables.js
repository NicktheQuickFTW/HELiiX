import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkTables() {
  console.log('Checking Supabase tables...\n')

  // Check awards table
  const { data: awards, error: awardsError } = await supabase
    .from('awards')
    .select('*')
    .limit(5)

  if (awardsError) {
    console.log('❌ Awards table:', awardsError.message)
  } else {
    console.log('✅ Awards table exists')
    console.log(`   Found ${awards.length} records`)
  }

  // Check invoices table
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select('*')
    .limit(5)

  if (invoicesError) {
    console.log('❌ Invoices table:', invoicesError.message)
  } else {
    console.log('✅ Invoices table exists')
    console.log(`   Found ${invoices.length} records`)
  }

  // Check documents table
  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('*')
    .limit(5)

  if (documentsError) {
    console.log('❌ Documents table:', documentsError.message)
  } else {
    console.log('✅ Documents table exists')
    console.log(`   Found ${documents.length} records`)
  }

  // Check storage buckets
  console.log('\nChecking storage buckets...')
  
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets()

  if (bucketsError) {
    console.log('❌ Could not list buckets:', bucketsError.message)
  } else {
    const awardsBucket = buckets.find(b => b.name === 'heliix-awards')
    const invoicesBucket = buckets.find(b => b.name === 'heliix-invoices')
    
    console.log(awardsBucket ? '✅ heliix-awards bucket exists' : '❌ heliix-awards bucket missing')
    console.log(invoicesBucket ? '✅ heliix-invoices bucket exists' : '❌ heliix-invoices bucket missing')
  }
}

checkTables().catch(console.error)