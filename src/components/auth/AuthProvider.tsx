'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import type { Database } from '../../lib/database.types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  userRole: string | null;
  hasSubscription: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// At top, after imports, create client once
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize a single Supabase browser client instance (module-level singleton)
export const supabaseBrowser = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const router = useRouter();
  const profileCache = useRef<Map<string, any>>(new Map());
  const lastProfileFetch = useRef<Map<string, number>>(new Map());
  const isInitializing = useRef(true);
  const authTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentUserId = useRef<string | null>(null);
  
  // Derived authentication states
  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher' || isAdmin;
  const isStudent = userRole === 'student';

  // Helper function to fetch user profile with caching
  const fetchUserProfile = useCallback(async (userId: string) => {
    const cacheKey = userId;
    const now = Date.now();
    const lastFetch = lastProfileFetch.current.get(cacheKey) || 0;
    
    // Only fetch if we haven't fetched in the last 5 minutes
    if (profileCache.current.has(cacheKey) && (now - lastFetch) < 5 * 60 * 1000) {
      return profileCache.current.get(cacheKey);
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const { data: profile, error } = await supabaseBrowser
        .from('user_profiles')
        .select('role, subscription_type')
        .eq('user_id', userId)
        .abortSignal(controller.signal)
        .single();
      
      clearTimeout(timeoutId);
      
      if (!error && profile) {
        profileCache.current.set(cacheKey, profile);
        lastProfileFetch.current.set(cacheKey, now);
        return profile;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('Profile fetch timed out for user:', userId);
      } else {
        console.error('Error fetching user profile:', error);
      }
    }
    
    return null;
  }, []);
  
  // Unified function to get complete user data
  const getUserData = async (currentUser: User): Promise<{
    role: string | null;
    hasSubscription: boolean;
  }> => {
    try {
      // First check metadata
      let role = currentUser.user_metadata?.role;
      
      // If no role in metadata, check user_profiles
      if (!role) {
        const { data: profileData } = await supabaseBrowser
          .from('user_profiles')
          .select('role')
          .eq('user_id', currentUser.id)
          .single();
        role = profileData?.role;
      }
      
      // Check subscription status
      let hasSubscription = false;
      if (role === 'admin') {
        // Admins always have subscription access
        hasSubscription = true;
      } else {
        // Check subscriptions table for others
        const { data: subData } = await supabaseBrowser
          .from('subscriptions')
          .select('status')
          .eq('user_id', currentUser.id)
          .eq('status', 'active')
          .single();
        hasSubscription = !!subData;
      }
      
      return { role, hasSubscription };
    } catch (error) {
      console.error('Error getting user data:', error);
      return { role: null, hasSubscription: false };
    }
  };

  // Function to update auth state safely
  const updateAuthState = useCallback(async (currentSession: Session | null) => {
    try {
      let updatedSession = currentSession;
      
      // If we have a session and user, fetch profile data
      if (currentSession?.user) {
        const userId = currentSession.user.id;
        
        // Only fetch profile if user ID changed or we don't have cached data
        if (currentUserId.current !== userId || !profileCache.current.has(userId)) {
          const profile = await fetchUserProfile(userId);
          
          if (profile) {
            // Create a new session object with updated user metadata
            updatedSession = {
              ...currentSession,
              user: {
                ...currentSession.user,
                user_metadata: {
                  ...currentSession.user.user_metadata,
                  role: profile.role,
                  subscription_type: profile.subscription_type
                }
              }
            };
          }
        }
        
        currentUserId.current = userId;
      } else {
        currentUserId.current = null;
      }
      
      setSession(updatedSession);
      setUser(updatedSession?.user || null);
      setIsLoading(false);

      // Get complete user data
      if (updatedSession?.user) {
        const userData = await getUserData(updatedSession.user);
        setUserRole(userData.role);
        setHasSubscription(userData.hasSubscription);
      } else {
        setUserRole(null);
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    if (isLoading) {
      console.log('Auth still loading, skipping refresh');
      return;
    }

    try {
      const { data: { session: refreshedSession }, error } = await supabaseBrowser.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }

      await updateAuthState(refreshedSession);
    } catch (error) {
      console.error('Exception during session refresh:', error);
    }
  }, [isLoading]);

  useEffect(() => {
    let mounted = true;
    
    // If already initialized, don't run again
    if (isInitializing.current === false && !isLoading) {
      return;
    }

    console.log('Starting auth initialization...');
    isInitializing.current = true;

    // Optional warning if initialization takes a long time. We no longer
    // force-fail authentication after an arbitrary timeout because that was
    // causing false negatives (e.g. on slow connections). Instead, simply log
    // a warning so we still allow the normal auth flow (or the
    // onAuthStateChange callback) to complete.
    authTimeout.current = setTimeout(() => {
      if (mounted) {
        console.warn('Authentication initialization is taking longer than expected (>8s)');
        // NOTE: We deliberately DO NOT mutate isLoading or isInitializing here
        // to avoid prematurely treating the user as unauthenticated.
      }
    }, 8000);

    // Get the current session
    const initializeAuth = async () => {
      try {
        console.log('Fetching current session...');
        const { data: { session: currentSession }, error } = await supabaseBrowser.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
            isInitializing.current = false;
            if (authTimeout.current) {
              clearTimeout(authTimeout.current);
            }
          }
          return;
        }

        console.log('Session fetched, updating auth state...', !!currentSession);

        if (mounted) {
          // Clear the timeout since we're about to complete
          if (authTimeout.current) {
            clearTimeout(authTimeout.current);
          }

          await updateAuthState(currentSession);
          isInitializing.current = false;
          console.log('Auth initialization completed successfully');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
          isInitializing.current = false;
          if (authTimeout.current) {
            clearTimeout(authTimeout.current);
          }
        }
      }
    };

    initializeAuth();

    // Listen for authentication changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      async (event: any, currentSession: Session | null) => {
        if (!mounted) return;
        
        console.log('Auth state change event:', event, 'Session:', !!currentSession);
        
        try {
          await updateAuthState(currentSession);

          // Handle cleanup for signout only
          if (event === 'SIGNED_OUT') {
            // Clear cached data
            profileCache.current.clear();
            lastProfileFetch.current.clear();
            currentUserId.current = null;
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to prevent re-running

  const signOut = async () => {
    try {
      // First clear local state to prevent flashes of authenticated content
      setUser(null);
      setSession(null);
      setIsLoading(false);
      
      // Clear caches
      profileCache.current.clear();
      lastProfileFetch.current.clear();
      currentUserId.current = null;
      
      // Set a signedOut cookie to help middleware detect signout
      document.cookie = "signedOut=true; path=/; max-age=60";
      
      // Clear any authentication cookies or localStorage items
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        if (name.trim().includes('supabase') || name.trim().includes('sb-')) {
          document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        }
      });
      
      // Then perform Supabase sign out with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const { error } = await supabaseBrowser.auth.signOut();
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Force a hard redirect to home page and prevent back navigation
      router.refresh();
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('Sign out timed out, forcing redirect');
      } else {
        console.error('Exception signing out:', error);
      }
      // If there's an error, still try to redirect
      window.location.replace('/');
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signOut, refreshSession, userRole, hasSubscription, isAdmin, isTeacher, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 