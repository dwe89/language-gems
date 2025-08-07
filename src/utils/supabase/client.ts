import { createBrowserClient, createServerClient } from '@supabase/ssr';
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
