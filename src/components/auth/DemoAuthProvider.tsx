'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';

interface DemoUser extends Partial<User> {
  id: string;
  email: string;
  user_metadata: {
    role: string;
    username: string;
  };
  isDemoUser: boolean;
}

interface DemoAuthContextType {
  user: DemoUser | User | null;
  isDemo: boolean;
  isDemoRoute: boolean;
  isAdmin: boolean;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

interface DemoAuthProviderProps {
  children: React.ReactNode;
  realUser: User | null;
  isLoading: boolean;
}

export function DemoAuthProvider({ children, realUser, isLoading }: DemoAuthProviderProps) {
  const pathname = usePathname();

  // Check if current route is a demo route
  const demoRoutes = ['/games', '/vocabulary-games'];
  const isDemoRoute = demoRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Create demo user when on demo routes and no real user
  const createDemoUser = (): DemoUser => ({
    id: 'demo-user-id',
    email: 'demo@languagegems.com',
    user_metadata: {
      role: 'demo',
      username: 'Demo User'
    },
    isDemoUser: true,
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    app_metadata: {},
    phone: '',
    confirmed_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString()
  });

  // Determine the effective user
  const effectiveUser = (() => {
    // Admin user always gets full access
    if (realUser?.email === 'danieletienne89@gmail.com') {
      return realUser;
    }

    // If we have a real user, use it
    if (realUser) {
      return realUser;
    }

    // Only provide demo user if auth is not loading AND we're on a demo route AND no real user
    // This prevents the race condition where demo user is returned during auth loading
    if (isDemoRoute && !realUser && !isLoading) {
      return createDemoUser();
    }

    return null;
  })();

  // Enhanced demo detection:
  // 1. True demo users (no auth on demo routes)
  // 2. Users without valid subscriptions (treated as demo for access control)
  const isDemo = effectiveUser?.isDemoUser === true;
  const isAdmin = realUser?.email === 'danieletienne89@gmail.com';



  const contextValue: DemoAuthContextType = {
    user: effectiveUser,
    isDemo,
    isDemoRoute,
    isAdmin
  };

  return (
    <DemoAuthContext.Provider value={contextValue}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};
