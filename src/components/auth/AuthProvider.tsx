'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to refresh the session and update state
  const refreshSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }

      // If we have a session, fetch the user's profile to ensure we have role information
      if (currentSession?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', currentSession.user.id)
          .single();

        if (profile) {
          // Update the user's metadata with the role from the profile
          currentSession.user.user_metadata = {
            ...currentSession.user.user_metadata,
            role: profile.role
          };
        }
      }
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
    } catch (error) {
      console.error('Exception refreshing auth:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get the current session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        // If we have a session, fetch the user's profile
        if (currentSession?.user && mounted) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', currentSession.user.id)
            .single();

          if (profile) {
            // Update the user's metadata with the role from the profile
            currentSession.user.user_metadata = {
              ...currentSession.user.user_metadata,
              role: profile.role
            };
          }
        }
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (mounted) {
          // If we have a session, fetch the user's profile
          if (currentSession?.user) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('role')
              .eq('user_id', currentSession.user.id)
              .single();

            if (profile) {
              // Update the user's metadata with the role from the profile
              currentSession.user.user_metadata = {
                ...currentSession.user.user_metadata,
                role: profile.role
              };
            }
          }

          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsLoading(false);

          // Handle navigation based on auth state
          if (event === 'SIGNED_IN') {
            // Redirect based on user role
            if (currentSession?.user?.user_metadata?.role === 'student') {
              router.push('/student-dashboard');
            } else if (currentSession?.user?.user_metadata?.role === 'teacher' || 
                       currentSession?.user?.user_metadata?.role === 'admin') {
              router.push('/dashboard');
            } else {
              // Default to dashboard for unknown roles
              console.warn('User has unknown role:', currentSession?.user?.user_metadata?.role);
              router.push('/dashboard');
            }
          } else if (event === 'SIGNED_OUT') {
            router.push('/');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove router from dependencies

  const signOut = async () => {
    try {
      // First clear local state to prevent flashes of authenticated content
      setUser(null);
      setSession(null);
      
      // Set a signedOut cookie to help middleware detect signout
      document.cookie = "signedOut=true; path=/; max-age=60"; // Valid for 60 seconds
      
      // Clear any authentication cookies or localStorage items
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        if (name.trim().includes('supabase') || name.trim().includes('sb-')) {
          document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        }
      });
      
      // Then perform Supabase sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Force a hard redirect to home page and prevent back navigation
      router.refresh(); // Clear Next.js cache 
      setTimeout(() => {
        window.location.replace('/'); // Hard redirect that replaces history
      }, 100); // Small delay to ensure cookies are processed
    } catch (error) {
      console.error('Exception signing out:', error);
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