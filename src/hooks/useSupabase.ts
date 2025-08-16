/**
 * useSupabase Hook
 * 
 * Provides access to the Supabase client instance.
 * This is a simple wrapper around the browser client for consistency.
 */

import { supabaseBrowser } from '@/components/auth/AuthProvider';

export function useSupabase() {
  return {
    supabase: supabaseBrowser
  };
}
