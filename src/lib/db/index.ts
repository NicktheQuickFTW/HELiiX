import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// For direct SQL access, we'll use Supabase client instead of Drizzle
export const db = supabase

export * from './schema'