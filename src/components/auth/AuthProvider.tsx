'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import type { Database } from '../../lib/database.types';
import { DemoAuthProvider } from './DemoAuthProvider';
import { createClient } from '../../utils/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; user?: User | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  userRole: string | null;
  hasSubscription: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize a single Supabase browser client instance with unified cookie configuration
export const supabaseBrowser = createClient();

export function AuthProvider({ children }: { ReactNode }) {
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
        
      } else {
        
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
      // Temporary admin override for specific email during testing - MUST BE FIRST
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@languagegems.com";
      const devAdminEmail = "danieletienne89@gmail.com";
      
      if (currentUser.email === adminEmail || currentUser.email === devAdminEmail) {
        const result = { role: 'admin', hasSubscription: true };
        return result;
      }

      // First check metadata
      let role = currentUser.user_metadata?.role;
      
      // If no role in metadata, check user_profiles table
      if (!role) {
        const { data: profileData, error: profileError } = await supabaseBrowser
          .from('user_profiles')
          .select('role')
          .eq('user_id', currentUser.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          
        } else if (profileData) {
          role = profileData.role;
        }
      }

      let hasSubscription = false;
      if (role === 'admin' || role === 'teacher') {
        // Admins and teachers always have subscription access
        hasSubscription = true;
      } else {
        // For now, give all students subscription access
        // TODO: Implement proper subscription system when needed
        hasSubscription = true;
      }
      
      const result = { role, hasSubscription };
      return result;
    } catch (error) {
      
      return { role: null, hasSubscription: false };
    }
  };

  // Function to update auth state safely
  const updateAuthState = useCallback(async (currentSession: Session | null) => {
    try {
      setSession(currentSession);
      setUser(currentSession?.user || null);

      // Get complete user data if we have a user
      if (currentSession?.user) {
        const userData = await getUserData(currentSession.user);
        setUserRole(userData.role);
        setHasSubscription(userData.hasSubscription);
        currentUserId.current = currentSession.user.id;
      } else {
        setUserRole(null);
        setHasSubscription(false);
        currentUserId.current = null;
      }
      
      setIsLoading(false);
    } catch (error) {
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setUserRole(null);
      setHasSubscription(false);
      setIsLoading(false);
    }
  }, []);

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    if (isLoading) {
      return;
    }

    try {
      const { data: { session: refreshedSession }, error } = await supabaseBrowser.auth.getSession();
      
      if (error) {
        return;
      }

      await updateAuthState(refreshedSession);
    } catch (error) {
      
    }
  }, [isLoading]);

  useEffect(() => {
    let mounted = true;
    
    // If already initialized, don't run again
    if (isInitializing.current === false && !isLoading) {
      return;
    }

    isInitializing.current = true;

    // Optional warning if initialization takes a long time, but with a shorter timeout
    authTimeout.current = setTimeout(() => {
      if (mounted && isInitializing.current) {
        // Force completion if it's been too long
        setIsLoading(false);
        isInitializing.current = false;
      }
    }, 3000);

    // Get the current session
    const initializeAuth = async () => {
      try {
        // Normal session check
        const { data: { session: currentSession }, error } = await supabaseBrowser.auth.getSession();

        if (error) {
          if (mounted) {
            setIsLoading(false);
            isInitializing.current = false;
            if (authTimeout.current) {
              clearTimeout(authTimeout.current);
            }
          }
          return;
        }

        if (mounted) {
          // Clear the timeout since we're about to complete
          if (authTimeout.current) {
            clearTimeout(authTimeout.current);
          }

          await updateAuthState(currentSession);
          isInitializing.current = false;
        }
      } catch (error) {
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
        
        try {
          // Only process auth changes if not in initial loading state
          if (!isInitializing.current) {
            await updateAuthState(currentSession);
          }

          // Handle cleanup for signout only
          if (event === 'SIGNED_OUT') {
            // Clear cached data
            profileCache.current.clear();
            lastProfileFetch.current.clear();
            currentUserId.current = null;
            isInitializing.current = false;
          }
        } catch (error) {
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
      }
      
      // Force a hard redirect to home page and prevent back navigation
      router.refresh();
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
    } catch (error: any) {
      if (error.name === 'AbortError') {
      } else {
      }
      // If there's an error, still try to redirect
      window.location.replace('/');
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null; user?: User | null }> => {
    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null, user: data.user };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signOut, refreshSession, userRole, hasSubscription, isAdmin, isTeacher, isStudent }}>
      <DemoAuthProvider realUser={user} isLoading={isLoading}>
        {children}
      </DemoAuthProvider>
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
