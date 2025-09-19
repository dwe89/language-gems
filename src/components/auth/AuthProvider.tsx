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
  signIn: (email: string, password: string, expectedUserType?: 'teacher' | 'student' | 'learner') => Promise<{ error: string | null; user?: User | null }>;
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

  // Check if subscription is active
  const checkSubscriptionActive = (profile: any): boolean => {
    if (!profile) return false;

    const now = new Date();
    const status = profile.subscription_status;

    if (status === 'active' || status === 'trialing') {
      if (profile.subscription_expires_at) {
        const expiresAt = new Date(profile.subscription_expires_at);
        return expiresAt > now;
      }

      if (status === 'trialing' && profile.trial_ends_at) {
        const trialEnds = new Date(profile.trial_ends_at);
        return trialEnds > now;
      }

      return true;
    }

    return false;
  };

  // Check user subscription status
  const checkUserSubscription = async (userId: string, role: string): Promise<boolean> => {
    try {
      // Admin override
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@languagegems.com";
      const devAdminEmail = "danieletienne89@gmail.com";

      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (user?.email === adminEmail || user?.email === devAdminEmail) {
        return true;
      }

      // For learners, check their individual subscription
      if (role === 'learner') {
        const { data: profile } = await supabaseBrowser
          .from('user_profiles')
          .select('subscription_status, subscription_expires_at, trial_ends_at')
          .eq('user_id', userId)
          .single();

        return checkSubscriptionActive(profile);
      }

      // For teachers, check school subscription or individual subscription
      if (role === 'teacher') {
        const { data: profile } = await supabaseBrowser
          .from('user_profiles')
          .select(`
            subscription_status,
            subscription_expires_at,
            trial_ends_at,
            school_owner_id,
            is_school_owner
          `)
          .eq('user_id', userId)
          .single();

        if (!profile) return false;

        // If user is a school owner, check their own subscription
        if (profile.is_school_owner) {
          return checkSubscriptionActive(profile);
        }

        // If user has a school owner, check the owner's subscription
        if (profile.school_owner_id) {
          const { data: ownerData } = await supabaseBrowser
            .from('user_profiles')
            .select('subscription_status, subscription_expires_at, trial_ends_at')
            .eq('user_id', profile.school_owner_id)
            .single();

          return checkSubscriptionActive(ownerData);
        }

        // Individual teacher - check their own subscription
        return checkSubscriptionActive(profile);
      }

      // Students and other roles don't need subscriptions
      return true;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  };

  // Unified function to get complete user data with faster execution
  const getUserData = async (currentUser: User): Promise<{
    role: string | null;
    hasSubscription: boolean;
  }> => {
    try {
      // Temporary admin override for specific email during testing - MUST BE FIRST
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@languagegems.com";
      const devAdminEmail = "danieletienne89@gmail.com";
      
      if (currentUser.email === adminEmail || currentUser.email === devAdminEmail) {
        console.log('Setting admin role for email:', currentUser.email);
        return { role: 'admin', hasSubscription: true };
      }

      // First check metadata (fastest)
      let role = currentUser.user_metadata?.role;
      console.log('Role from user_metadata:', role);
      
      // If no role in metadata, check user_profiles table with timeout
      if (!role) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout
          
          const { data: profileData, error: profileError } = await supabaseBrowser
            .from('user_profiles')
            .select('role')
            .eq('user_id', currentUser.id)
            .abortSignal(controller.signal)
            .single();
          
          clearTimeout(timeoutId);
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching user profile:', profileError);
          } else if (profileData) {
            role = profileData.role;
            console.log('Role from user_profiles:', role);
          }
        } catch (dbError: any) {
          if (dbError.name === 'AbortError') {
            console.warn('Profile fetch timed out, using metadata fallback');
          } else {
            console.error('Database error, using metadata fallback:', dbError);
          }
          // Fallback to basic role or default
          role = 'student'; // Default fallback
        }
      }

      // Proper subscription logic - check actual subscription status
      const hasSubscription = await checkUserSubscription(currentUser.id, role || 'student');
      
      const result = { role, hasSubscription };
      console.log('getUserData returning:', result);
      return result;
    } catch (error) {
      console.error('Error getting user data:', error);
      return { role: 'student', hasSubscription: false }; // Safe defaults - no free access
    }
  };

  // Function to update auth state safely
  const updateAuthState = useCallback(async (currentSession: Session | null) => {
    try {
      console.log('updateAuthState called with session:', !!currentSession);
      setSession(currentSession);
      setUser(currentSession?.user || null);

      // Get complete user data if we have a user
      if (currentSession?.user) {
        console.log('Getting user data for:', currentSession.user.email);
        
        // Run user data fetch with timeout to prevent hanging
        const userDataPromise = getUserData(currentSession.user);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User data fetch timeout')), 2000)
        );

        try {
          const userData = await Promise.race([userDataPromise, timeoutPromise]) as any;
          console.log('Setting user role in state:', userData.role);
          console.log('Setting subscription status:', userData.hasSubscription);
          setUserRole(userData.role);
          setHasSubscription(userData.hasSubscription);
          currentUserId.current = currentSession.user.id;
        } catch (timeoutError) {
          console.warn('User data fetch timed out, using defaults');
          // Set safe defaults if fetch times out
          setUserRole(currentSession.user.user_metadata?.role || null);
          setHasSubscription(true); // Default to true for now
          currentUserId.current = currentSession.user.id;
        }
      } else {
        console.log('No user session, clearing auth state');
        setUserRole(null);
        setHasSubscription(false);
        currentUserId.current = null;
      }
      
      setIsLoading(false);
      console.log('updateAuthState completed');
    } catch (error) {
      console.error('Error updating auth state:', error);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setUserRole(currentSession?.user?.user_metadata?.role || null);
      setHasSubscription(true); // Default to true on error
      setIsLoading(false);
    }
  }, []);

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
    if (isInitializing.current === false) {
      return;
    }

    console.log('Starting auth initialization...');
    isInitializing.current = true;

    // Shorter timeout for faster fallback
    authTimeout.current = setTimeout(() => {
      if (mounted && isInitializing.current) {
        console.warn('Authentication initialization is taking longer than expected (>2s)');
        // Force completion if it's been too long
        if (mounted) {
          setIsLoading(false);
          isInitializing.current = false;
        }
      }
    }, 2000); // Reduced from 3000 to 2000ms

    // Get the current session with faster timeout
    const initializeAuth = async () => {
      try {
        console.log('🔍 Fetching current session...');

        // Create abort controller for faster timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout

        // Normal session check with abort signal
        const { data: { session: currentSession }, error } = await supabaseBrowser.auth.getSession();
        
        clearTimeout(timeoutId);

        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
            isInitializing.current = false;
            if (authTimeout.current) {
              clearTimeout(authTimeout.current);
            }
          }
          return;
        }

        console.log('📊 Session fetched:', {
          hasSession: !!currentSession,
          userId: currentSession?.user?.id,
          email: currentSession?.user?.email
        });

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

    // Listen for authentication changes with optimized handling
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      async (event: any, currentSession: Session | null) => {
        if (!mounted) return;
        
        console.log('Auth state change event:', event, 'Session:', !!currentSession);
        
        try {
          // Skip processing during initial load to avoid conflicts
          if (isInitializing.current) {
            console.log('Skipping auth state change during initialization');
            return;
          }

          // Handle different events efficiently
          if (event === 'SIGNED_OUT') {
            // Clear cached data immediately
            profileCache.current.clear();
            lastProfileFetch.current.clear();
            currentUserId.current = null;
            setUser(null);
            setSession(null);
            setUserRole(null);
            setHasSubscription(false);
            setIsLoading(false);
            return;
          }

          // For sign in events, update state
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await updateAuthState(currentSession);
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

  const signIn = async (email: string, password: string, expectedUserType?: 'teacher' | 'student' | 'learner'): Promise<{ error: string | null; user?: User | null }> => {
    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // If user type validation is requested, check the user's role
      if (expectedUserType && data.user) {
        try {
          // Fetch user profile to check role
          const { data: profile, error: profileError } = await supabaseBrowser
            .from('user_profiles')
            .select('role')
            .eq('user_id', data.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile for validation:', profileError);
            // If we can't fetch profile, check user metadata as fallback
            const userMetadata = data.user.user_metadata || {};
            const metadataRole = userMetadata.role;
            const userType = userMetadata.user_type;

            // Validate based on metadata
            if (expectedUserType === 'teacher' && metadataRole !== 'teacher' && userType !== 'b2b') {
              await supabaseBrowser.auth.signOut(); // Sign out the user
              return { error: 'Access denied. This login is for teachers only.' };
            }
            if (expectedUserType === 'student' && metadataRole !== 'student') {
              await supabaseBrowser.auth.signOut(); // Sign out the user
              return { error: 'Access denied. This login is for students only.' };
            }
            if (expectedUserType === 'learner' && metadataRole !== 'learner' && userType !== 'b2c') {
              await supabaseBrowser.auth.signOut(); // Sign out the user
              return { error: 'Access denied. This login is for individual learners only.' };
            }
          } else {
            // Validate based on profile role
            const userRole = profile.role;

            if (expectedUserType === 'teacher' && userRole !== 'teacher' && userRole !== 'admin') {
              await supabaseBrowser.auth.signOut(); // Sign out the user
              return { error: 'Access denied. This login is for teachers only.' };
            }
            if (expectedUserType === 'student' && userRole !== 'student') {
              await supabaseBrowser.auth.signOut(); // Sign out the user
              return { error: 'Access denied. This login is for students only.' };
            }
            if (expectedUserType === 'learner' && userRole !== 'learner') {
              await supabaseBrowser.auth.signOut(); // Sign out the user
              return { error: 'Access denied. This login is for individual learners only.' };
            }
          }
        } catch (validationError) {
          console.error('Error during user type validation:', validationError);
          await supabaseBrowser.auth.signOut(); // Sign out the user on validation error
          return { error: 'Unable to verify user permissions. Please try again.' };
        }
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