import { createClient } from '@supabase/supabase-js';

// Get environment variables with proper fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dhymetycpnnjtxfkymtz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeW1ldHljcG5uanR4Zmt5bXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjM4MjEsImV4cCI6MjA1NDY5OTgyMX0.V9yQznC4P4NctEzOcaaPWip8_oRhDTtr6BK6Cn_tJl8';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    'Missing Supabase environment variables. Using hardcoded fallback values.',
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Defined' : 'Using fallback',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Defined' : 'Using fallback',
    }
  );
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-client-info': 'lingo-songs-next/1.0.0',
      },
    },
  }
);

// Function to get Supabase client with admin privileges (server-side only)
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY for admin operations');
    throw new Error('Missing service role key');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}; 