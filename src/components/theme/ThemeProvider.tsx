'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

type Theme = 'light' | 'dark' | 'student';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isStudentTheme: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

// =====================================================
// THEME CONTEXT
// =====================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =====================================================
// THEME PROVIDER COMPONENT
// =====================================================

export function ThemeProvider({ 
  children, 
  defaultTheme = 'light' 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('languagegems-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'student'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // Auto-detect student theme based on URL or user type
      const isStudentPortal = window.location.hostname.includes('students') || 
                             window.location.pathname.includes('student');
      if (isStudentPortal) {
        setTheme('student');
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'student');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Apply theme-specific CSS variables
    switch (theme) {
      case 'light':
        applyLightTheme(root);
        break;
      case 'dark':
        applyDarkTheme(root);
        break;
      case 'student':
        applyStudentTheme(root);
        break;
    }
    
    // Save theme to localStorage
    localStorage.setItem('languagegems-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('student');
    } else {
      setTheme('light');
    }
  };

  const isStudentTheme = theme === 'student';

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isStudentTheme
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// =====================================================
// THEME HOOK
// =====================================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// =====================================================
// THEME APPLICATION FUNCTIONS
// =====================================================

function applyLightTheme(root: HTMLElement) {
  root.style.setProperty('--color-primary', '#3B82F6');
  root.style.setProperty('--color-primary-dark', '#2563EB');
  root.style.setProperty('--color-secondary', '#6B7280');
  root.style.setProperty('--color-background', '#FFFFFF');
  root.style.setProperty('--color-surface', '#F9FAFB');
  root.style.setProperty('--color-text-primary', '#111827');
  root.style.setProperty('--color-text-secondary', '#6B7280');
  root.style.setProperty('--color-border', '#E5E7EB');
  root.style.setProperty('--color-success', '#10B981');
  root.style.setProperty('--color-warning', '#F59E0B');
  root.style.setProperty('--color-error', '#EF4444');
}

function applyDarkTheme(root: HTMLElement) {
  root.style.setProperty('--color-primary', '#60A5FA');
  root.style.setProperty('--color-primary-dark', '#3B82F6');
  root.style.setProperty('--color-secondary', '#9CA3AF');
  root.style.setProperty('--color-background', '#111827');
  root.style.setProperty('--color-surface', '#1F2937');
  root.style.setProperty('--color-text-primary', '#F9FAFB');
  root.style.setProperty('--color-text-secondary', '#D1D5DB');
  root.style.setProperty('--color-border', '#374151');
  root.style.setProperty('--color-success', '#34D399');
  root.style.setProperty('--color-warning', '#FBBF24');
  root.style.setProperty('--color-error', '#F87171');
}

function applyStudentTheme(root: HTMLElement) {
  // Student theme - vibrant and engaging colors for 11-16 year olds
  root.style.setProperty('--color-primary', '#6366F1');
  root.style.setProperty('--color-primary-dark', '#4F46E5');
  root.style.setProperty('--color-secondary', '#8B5CF6');
  root.style.setProperty('--color-background', '#FEFEFE');
  root.style.setProperty('--color-surface', '#F8FAFC');
  root.style.setProperty('--color-text-primary', '#1E293B');
  root.style.setProperty('--color-text-secondary', '#64748B');
  root.style.setProperty('--color-border', '#E2E8F0');
  root.style.setProperty('--color-success', '#22C55E');
  root.style.setProperty('--color-warning', '#F59E0B');
  root.style.setProperty('--color-error', '#EF4444');
  
  // Student-specific colors
  root.style.setProperty('--student-primary', '#6366F1');
  root.style.setProperty('--student-secondary', '#8B5CF6');
  root.style.setProperty('--student-accent', '#EC4899');
  root.style.setProperty('--student-success', '#22C55E');
  root.style.setProperty('--student-warning', '#F59E0B');
  root.style.setProperty('--student-info', '#06B6D4');
  root.style.setProperty('--student-background', '#FEFEFE');
  root.style.setProperty('--student-surface', '#F8FAFC');
  root.style.setProperty('--student-card', '#FFFFFF');
  root.style.setProperty('--student-border', '#E2E8F0');
  root.style.setProperty('--student-text-primary', '#1E293B');
  root.style.setProperty('--student-text-secondary', '#64748B');
  root.style.setProperty('--student-text-muted', '#94A3B8');
  
  // Gradient colors for student theme
  root.style.setProperty('--student-gradient-primary', 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)');
  root.style.setProperty('--student-gradient-secondary', 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)');
  root.style.setProperty('--student-gradient-success', 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)');
  root.style.setProperty('--student-gradient-warning', 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)');
  root.style.setProperty('--student-gradient-info', 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)');
  
  // Achievement colors
  root.style.setProperty('--achievement-bronze', '#CD7F32');
  root.style.setProperty('--achievement-silver', '#C0C0C0');
  root.style.setProperty('--achievement-gold', '#FFD700');
  root.style.setProperty('--achievement-platinum', '#E5E4E2');
  root.style.setProperty('--achievement-diamond', '#B9F2FF');
  
  // Streak colors
  root.style.setProperty('--streak-fire', '#FF6B35');
  root.style.setProperty('--streak-hot', '#F7931E');
  root.style.setProperty('--streak-warm', '#FFD23F');
  
  // XP and level colors
  root.style.setProperty('--xp-primary', '#6366F1');
  root.style.setProperty('--xp-secondary', '#8B5CF6');
  root.style.setProperty('--level-beginner', '#22C55E');
  root.style.setProperty('--level-intermediate', '#F59E0B');
  root.style.setProperty('--level-advanced', '#EF4444');
}

// =====================================================
// THEME UTILITIES
// =====================================================

export const getThemeColors = (theme: Theme) => {
  switch (theme) {
    case 'light':
      return {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        border: '#E5E7EB'
      };
    case 'dark':
      return {
        primary: '#60A5FA',
        secondary: '#9CA3AF',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        border: '#374151'
      };
    case 'student':
      return {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        background: '#FEFEFE',
        surface: '#F8FAFC',
        text: '#1E293B',
        border: '#E2E8F0'
      };
    default:
      return {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        border: '#E5E7EB'
      };
  }
};

export const isStudentPortal = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('students') || 
         window.location.pathname.includes('student');
};

// =====================================================
// THEME DETECTION HOOK
// =====================================================

export function useThemeDetection() {
  const [isStudent, setIsStudent] = useState(false);
  
  useEffect(() => {
    setIsStudent(isStudentPortal());
  }, []);
  
  return { isStudent };
}