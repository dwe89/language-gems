'use client';

import { useAuth } from '../components/auth/AuthProvider';
import { useDemoAuth } from '../components/auth/DemoAuthProvider';

/**
 * Unified authentication hook that provides either real user or demo user
 * depending on the context. This allows games to work in both authenticated
 * and demo modes seamlessly.
 */
export const useUnifiedAuth = () => {
  const realAuth = useAuth();
  const demoAuth = useDemoAuth();

  // If we're in demo mode and have a demo user, use demo context
  if (demoAuth.isDemo && demoAuth.user) {
    return {
      user: demoAuth.user,
      isLoading: false,
      isDemo: true,
      isAdmin: demoAuth.isAdmin,
      isDemoRoute: demoAuth.isDemoRoute,
      // Demo users don't have sessions, roles, or subscriptions in the traditional sense
      session: null,
      userRole: demoAuth.user.user_metadata?.role || 'demo',
      hasSubscription: false,
      isTeacher: false,
      isStudent: false,
      signIn: realAuth.signIn,
      signOut: realAuth.signOut,
      refreshSession: realAuth.refreshSession
    };
  }

  // Otherwise use real auth context
  return {
    ...realAuth,
    isDemo: false,
    isDemoRoute: demoAuth.isDemoRoute,
    isAdmin: realAuth.isAdmin || demoAuth.isAdmin
  };
};
