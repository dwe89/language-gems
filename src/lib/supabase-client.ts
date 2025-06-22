import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xetsvpfunazwkontdpdh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldHN2cGZ1bmF6d2tvbnRkcGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjMwMDIsImV4cCI6MjA1NTM5OTAwMn0.Y99h1LBL9COrpgortCXrn7KGKznr3uc-LyxHnKcmICs';

export const createBrowserClient = () => {
  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
};

export { supabaseUrl, supabaseAnonKey }; 