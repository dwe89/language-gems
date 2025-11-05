import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';

// Standard browser client - no special configuration needed
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Server-side client factory - standard configuration
export const createServerSideClient = (cookiesStore: any) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookiesStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookiesStore.set(name, value, options);
        },
        remove: (name: string, options: any) => {
          cookiesStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};

// Service role client for API routes - bypasses RLS
export const createServiceRoleClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not defined!');
    console.error('❌ Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  
  console.log('✅ Service role key loaded, length:', serviceRoleKey.length);
  
  // Create client with service role key - this should bypass RLS
  const client = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'apikey': serviceRoleKey
        }
      }
    }
  );
  
  return client;
};
