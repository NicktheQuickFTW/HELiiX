import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testBuckets() {
  console.log('Testing storage buckets...\n')

  // Create a test file
  const testContent = new Blob(['test'], { type: 'text/plain' })
  
  // Test awards bucket
  const { data: awardsData, error: awardsError } = await supabase
    .storage
    .from('heliix-awards')
    .upload('test.txt', testContent, { upsert: true })

  if (awardsError) {
    console.log('❌ heliix-awards bucket:', awardsError.message)
  } else {
    console.log('✅ heliix-awards bucket is working')
    // Clean up
    await supabase.storage.from('heliix-awards').remove(['test.txt'])
  }

  // Test invoices bucket
  const { data: invoicesData, error: invoicesError } = await supabase
    .storage
    .from('heliix-invoices')
    .upload('test.txt', testContent, { upsert: true })

  if (invoicesError) {
    console.log('❌ heliix-invoices bucket:', invoicesError.message)
  } else {
    console.log('✅ heliix-invoices bucket is working')
    // Clean up
    await supabase.storage.from('heliix-invoices').remove(['test.txt'])
  }
}

testBuckets().catch(console.error)