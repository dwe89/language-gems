'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import type { Database } from '../../lib/database.types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

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
  const router = useRouter();
  const profileCache = useRef<Map<string, any>>(new Map());
  const lastProfileFetch = useRef<Map<string, number>>(new Map());
  const isInitializing = useRef(false);
  const authTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Helper function to fetch user profile with caching and timeout
  const fetchUserProfile = async (userId: string) => {
    const cacheKey = userId;
    const now = Date.now();
    const lastFetch = lastProfileFetch.current.get(cacheKey) || 0;
    
    // Only fetch if we haven't fetched in the last 2 minutes (reduced from 5)
    if (profileCache.current.has(cacheKey) && (now - lastFetch) < 2 * 60 * 1000) {
      return profileCache.current.get(cacheKey);
    }
    
    try {
      // Reduced timeout for faster response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduced to 2 seconds
      
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
  };
  
  // Function to refresh the session and update state
  const refreshSession = async () => {
    try {
      // Reduced timeout for faster response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced to 3 seconds
      
      const { data: { session: currentSession }, error } = await supabaseBrowser.auth.getSession();
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error refreshing session:', error);
        // If there's an error, try to get user directly with timeout
        try {
          const userController = new AbortController();
          const userTimeoutId = setTimeout(() => userController.abort(), 2000); // Reduced timeout
          
          const { data: { user: currentUser } } = await supabaseBrowser.auth.getUser();
          clearTimeout(userTimeoutId);
          
          if (currentUser) {
            setUser(currentUser);
            setIsLoading(false);
          }
        } catch (userError) {
          console.error('Fallback user fetch failed:', userError);
        }
        return;
      }

      // If we have a session, fetch the user's profile with timeout
      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user.id);

        if (profile) {
          // Update the user's metadata with the role from the profile
          currentSession.user.user_metadata = {
            ...currentSession.user.user_metadata,
            role: profile.role,
            subscription_type: profile.subscription_type
          };
        }
      }
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setIsLoading(false);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('Session refresh timed out');
      } else {
        console.error('Exception refreshing auth:', error);
      }
      
      // Set loading to false if we're stuck
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Prevent multiple initializations
    if (isInitializing.current) {
      return;
    }
    
    isInitializing.current = true;

    // Reduced maximum loading timeout to prevent infinite loading
    authTimeout.current = setTimeout(() => {
      if (mounted) {
        console.warn('Authentication initialization timed out');
        setIsLoading(false);
        isInitializing.current = false;
      }
    }, 5000); // Reduced to 5 seconds

    // Get the current session
    const initializeAuth = async () => {
      try {
        // Reduced timeout for faster initialization
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced to 3 seconds
        
        const { data: { session: currentSession }, error } = await supabaseBrowser.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
            isInitializing.current = false;
          }
          return;
        }

        // If we have a session, fetch the user's profile with timeout
        if (currentSession?.user && mounted) {
          const profile = await fetchUserProfile(currentSession.user.id);

          if (profile) {
            // Update the user's metadata with the role from the profile
            currentSession.user.user_metadata = {
              ...currentSession.user.user_metadata,
              role: profile.role,
              subscription_type: profile.subscription_type
            };
          }
        }
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsLoading(false);
          isInitializing.current = false;
          if (authTimeout.current) {
            clearTimeout(authTimeout.current);
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn('Auth initialization timed out');
        } else {
          console.error('Error initializing auth:', error);
        }
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

    // Listen for authentication changes with timeout protection
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      async (event: any, currentSession: Session | null) => {
        if (!mounted) return;
        
        console.log('Auth state change event:', event, 'Session:', !!currentSession);
        
        try {
          // If we have a session, fetch the user's profile with timeout
          if (currentSession?.user) {
            const profile = await fetchUserProfile(currentSession.user.id);

            if (profile) {
              // Update the user's metadata with the role from the profile
              currentSession.user.user_metadata = {
                ...currentSession.user.user_metadata,
                role: profile.role,
                subscription_type: profile.subscription_type
              };
            }
          }

          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsLoading(false);

          // Handle navigation based on auth state (only for certain events)
          if (event === 'SIGNED_IN') {
            // Only redirect if we're on the login page or home page
            const currentPath = window.location.pathname;
            if (currentPath === '/auth/login' || currentPath === '/') {
              // Small delay to ensure state is set
              setTimeout(() => {
                // Redirect based on user role
                if (currentSession?.user?.user_metadata?.role === 'student') {
                  router.push('/student-dashboard');
                } else if (currentSession?.user?.user_metadata?.role === 'teacher' || 
                           currentSession?.user?.user_metadata?.role === 'admin') {
                  router.push('/dashboard');
                } else {
                  // Default to account page for unknown roles
                  router.push('/account');
                }
              }, 100);
            }
            // Don't redirect if user is already on a specific page (like shop, cart, etc.)
          } else if (event === 'SIGNED_OUT') {
            // Small delay to ensure cleanup
            setTimeout(() => {
              router.push('/');
            }, 100);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      isInitializing.current = false;
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      // First clear local state to prevent flashes of authenticated content
      setUser(null);
      setSession(null);
      setIsLoading(false); // Ensure loading state is cleared
      
      // Set a signedOut cookie to help middleware detect signout
      document.cookie = "signedOut=true; path=/; max-age=60"; // Valid for 60 seconds
      
      // Clear any authentication cookies or localStorage items
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        if (name.trim().includes('supabase') || name.trim().includes('sb-')) {
          document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        }
      });
      
      // Then perform Supabase sign out with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const { error } = await supabaseBrowser.auth.signOut();
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Force a hard redirect to home page and prevent back navigation
      router.refresh(); // Clear Next.js cache 
      setTimeout(() => {
        window.location.replace('/'); // Hard redirect that replaces history
      }, 100); // Small delay to ensure cookies are processed
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

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, refreshSession }}>
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