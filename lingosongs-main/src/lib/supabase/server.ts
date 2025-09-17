import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Use the basic client for server-side operations
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      }
    }
  );
} 