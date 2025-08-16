'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Database } from '../../lib/database.types';
import { createClient } from '../../utils/supabase/client';

type SupabaseContext = {
  supabase: ReturnType<typeof createClient>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
    
    // Expose Supabase client globally for console testing
    if (typeof window !== 'undefined') {
      (window as any).supabase_client = supabase;
      console.log('🔧 [SUPABASE] Client exposed globally for console testing');
    }
    
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