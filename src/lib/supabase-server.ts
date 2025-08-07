import { cookies } from 'next/headers';
import { createServerSideClient } from '../utils/supabase/client';

export const createClient = async () => {
  // Await cookies before using them for Next.js 15 compatibility
  const cookieStore = await cookies();

  return createServerSideClient(cookieStore);
};