'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../../lib/database.types';

type SupabaseContext = {
  supabase: ReturnType<typeof createBrowserClient<Database>>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [supabase] = useState(() => createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
}; 