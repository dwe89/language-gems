// Student-Specific Authentication Provider
// Handles student login, registration, and session management with age-appropriate features

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useSupabase } from '../supabase/SupabaseProvider';

interface StudentProfile {
  id: string;
  student_id: string;
  display_name: string;
  year_group: number;
  school_name?: string;
  teacher_id: string;
  created_at: string;
  last_active: string;
  preferences: {
    theme: 'light' | 'dark' | 'colorful';
    language: 'spanish' | 'french' | 'german';
    difficulty_preference: 'easy' | 'medium' | 'hard';
    sound_enabled: boolean;
    notifications_enabled: boolean;
  };
  achievements: {
    total_points: number;
    current_level: number;
    badges_earned: string[];
    current_streak: number;
    longest_streak: number;
  };
}

interface StudentAuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  loading: boolean;
  signIn: (studentId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
}

interface StudentAuthProviderProps {
  children: React.ReactNode;
}

export function StudentAuthProvider({ children }: StudentAuthProviderProps) {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadStudentProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadStudentProfile(session.user.id);
        } else {
          setStudentProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const loadStudentProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          student_achievements (
            total_points,
            current_level,
            badges_earned,
            current_streak,
            longest_streak
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading student profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const profile: StudentProfile = {
          id: data.id,
          student_id: data.student_id,
          display_name: data.display_name,
          year_group: data.year_group,
          school_name: data.school_name,
          teacher_id: data.teacher_id,
          created_at: data.created_at,
          last_active: data.last_active,
          preferences: data.preferences || {
            theme: 'colorful',
            language: 'spanish',
            difficulty_preference: 'medium',
            sound_enabled: true,
            notifications_enabled: true
          },
          achievements: data.student_achievements || {
            total_points: 0,
            current_level: 1,
            badges_earned: [],
            current_streak: 0,
            longest_streak: 0
          }
        };

        setStudentProfile(profile);

        // Update last active timestamp
        await supabase
          .from('student_profiles')
          .update({ last_active: new Date().toISOString() })
          .eq('user_id', userId);
      }
    } catch (error) {
      console.error('Error in loadStudentProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (studentId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      // Student IDs are in format: firstname.lastname.2digits (e.g., john.smith.23)
      const email = `${studentId}@student.languagegems.com`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { 
          success: false, 
          error: error.message.includes('Invalid login credentials') 
            ? 'Student ID or password is incorrect. Please check and try again.'
            : error.message 
        };
      }

      if (data.user) {
        await loadStudentProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };

    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: 'Something went wrong. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setStudentProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<StudentProfile>): Promise<boolean> => {
    if (!user || !studentProfile) return false;

    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({
          display_name: updates.display_name,
          preferences: updates.preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      // Update local state
      setStudentProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;

    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadStudentProfile(user.id);
    }
  };

  const value: StudentAuthContextType = {
    user,
    studentProfile,
    loading,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  };

  return (
    <StudentAuthContext.Provider value={value}>
      {children}
    </StudentAuthContext.Provider>
  );
}

// Student Profile Database Schema (for reference)
/*
CREATE TABLE student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL, -- firstname.lastname.2digits format
  display_name TEXT NOT NULL,
  year_group INTEGER NOT NULL CHECK (year_group BETWEEN 7 AND 13),
  school_name TEXT,
  teacher_id UUID REFERENCES auth.users(id),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE student_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  badges_earned TEXT[] DEFAULT '{}',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_student_profiles_student_id ON student_profiles(student_id);
CREATE INDEX idx_student_profiles_teacher_id ON student_profiles(teacher_id);
CREATE INDEX idx_student_achievements_student_id ON student_achievements(student_id);
*/
