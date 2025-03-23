import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Default fallback values for build time (will never be used in runtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback-key-for-build-time';

// Only throw error in client-side code, not during build
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.error('Supabase URL and/or Anon Key not defined in environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey); 