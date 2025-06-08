import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// Use service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createBuckets() {
  console.log('Creating storage buckets...\n')

  // Create heliix-awards bucket
  const { data: awardsBucket, error: awardsError } = await supabase
    .storage
    .createBucket('heliix-awards', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    })

  if (awardsError) {
    console.log('❌ heliix-awards:', awardsError.message)
  } else {
    console.log('✅ Created heliix-awards bucket')
  }

  // Create heliix-invoices bucket
  const { data: invoicesBucket, error: invoicesError } = await supabase
    .storage
    .createBucket('heliix-invoices', {
      public: true,
      fileSizeLimit: 16777216, // 16MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png']
    })

  if (invoicesError) {
    console.log('❌ heliix-invoices:', invoicesError.message)
  } else {
    console.log('✅ Created heliix-invoices bucket')
  }

  console.log('\nDone!')
}

createBuckets().catch(console.error)