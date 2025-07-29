// Re-export supabase client from the main lib
export { supabase } from '../supabase';

// For direct SQL access, we'll use the same Supabase client
export { supabase as db } from '../supabase';

export * from './awardschema';
