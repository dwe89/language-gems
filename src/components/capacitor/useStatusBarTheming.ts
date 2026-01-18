'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useCapacitor } from './CapacitorProvider';

type StatusBarTheme = 'light' | 'dark' | 'auto';
type StatusBarOverride = Record<string, StatusBarTheme>;

const defaultStatusBarConfig: StatusBarTheme = 'auto';

const statusBarOverrides: StatusBarOverride = {
  '/dashboard': 'dark',
  '/student-dashboard': 'dark',
  '/learner-dashboard': 'dark',
  '/activities': 'dark',
  '/vocab-master': 'dark',
  '/mobile-home': 'dark',
  '/auth/login': 'light',
  '/auth/signup': 'light',
  '/pricing': 'light',
};

/**
 * Hook to dynamically set status bar style based on current route
 * Automatically detects page background and adjusts status bar for proper contrast
 */
export function useStatusBarTheming() {
  const pathname = usePathname();
  const { isNativeApp, isReady, platform } = useCapacitor();

  const updateStatusBar = useCallback(async () => {
    if (!isReady || !isNativeApp) return;

    try {
      const theme = statusBarOverrides[pathname || '/'] || defaultStatusBarConfig;

      const style = theme === 'auto'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? Style.Dark : Style.Light)
        : theme === 'dark'
        ? Style.Dark
        : Style.Light;

      await StatusBar.setStyle({ style });

      if (platform === 'android') {
        const backgroundColor = theme === 'dark' ? '#1a1a2e' : '#ffffff';
        await StatusBar.setBackgroundColor({ color: backgroundColor });
      }

      if (platform === 'ios') {
        await StatusBar.setOverlaysWebView({ overlay: true });
      }
    } catch (error) {
      console.warn('[useStatusBarTheming] Failed to update status bar:', error);
    }
  }, [isReady, isNativeApp, pathname, platform]);

  useEffect(() => {
    updateStatusBar();
  }, [updateStatusBar]);

  return { updateStatusBar };
}

/**
 * Hook to programmatically set status bar style
 * Useful for components that change theme dynamically (e.g., dark mode toggle)
 */
export function useSetStatusBar() {
  const { isNativeApp, isReady, platform } = useCapacitor();

  const setStatusBar = useCallback(async (theme: StatusBarTheme, backgroundColor?: string) => {
    if (!isReady || !isNativeApp) return;

    try {
      const style = theme === 'auto'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? Style.Dark : Style.Light)
        : theme === 'dark'
        ? Style.Dark
        : Style.Light;

      await StatusBar.setStyle({ style });

      if (platform === 'android' && backgroundColor) {
        await StatusBar.setBackgroundColor({ color: backgroundColor });
      }
    } catch (error) {
      console.warn('[useSetStatusBar] Failed to set status bar:', error);
    }
  }, [isReady, isNativeApp, platform]);

  return { setStatusBar };
}
