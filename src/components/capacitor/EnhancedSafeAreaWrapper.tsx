'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useCapacitor } from './CapacitorProvider';

interface SafeAreaContextType {
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  safeAreaPadding: {
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
  };
}

const SafeAreaContext = createContext<SafeAreaContextType>({
  safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
  safeAreaPadding: {
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
  },
});

export function useSafeArea() {
  return useContext(SafeAreaContext);
}

interface Props {
  children: ReactNode;
  statusBarStyle?: 'dark' | 'light' | 'auto';
  statusBarColor?: string;
  /** Content to hide when in native app mode */
  webOnlyContent?: ReactNode;
}

/**
 * Enhanced wrapper with proper safe area handling and status bar theming
 * Handles notches, dynamic islands, home indicators, and status bar styling
 */
export function MobileAppWrapper({ children, statusBarStyle = 'dark', statusBarColor, webOnlyContent }: Props) {
  const { isNativeApp, isReady, platform } = useCapacitor();
  const [safeAreaInsets, setSafeAreaInsets] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    if (!isReady || !isNativeApp) return;

    const updateSafeArea = () => {
      const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')) || 0;
      const bottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')) || 0;
      const left = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left')) || 0;
      const right = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right')) || 0;

      setSafeAreaInsets({ top, bottom, left, right });
    };

    updateSafeArea();

    const handleResize = () => {
      updateSafeArea();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isReady, isNativeApp]);

  useEffect(() => {
    if (!isReady || !isNativeApp) return;

    const setStatusBar = async () => {
      try {
        const style = statusBarStyle === 'auto'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? Style.Dark : Style.Light)
          : statusBarStyle === 'dark'
          ? Style.Dark
          : Style.Light;

        await StatusBar.setStyle({ style });

        if (statusBarColor) {
          if (platform === 'ios') {
            await StatusBar.setOverlaysWebView({ overlay: true });
          } else {
            await StatusBar.setBackgroundColor({ color: statusBarColor });
          }
        }
      } catch (error) {
        console.warn('[MobileAppWrapper] Failed to set status bar:', error);
      }
    };

    setStatusBar();
  }, [isReady, isNativeApp, statusBarStyle, statusBarColor, platform]);

  const safeAreaPadding = {
    paddingTop: `${safeAreaInsets.top}px`,
    paddingBottom: `${safeAreaInsets.bottom + 64}px`,
    paddingLeft: `${safeAreaInsets.left}px`,
    paddingRight: `${safeAreaInsets.right}px`,
  };

  if (!isReady) {
    return (
      <>
        {children}
        {webOnlyContent}
      </>
    );
  }

  if (!isNativeApp) {
    return (
      <>
        {children}
        {webOnlyContent}
      </>
    );
  }

  return (
    <SafeAreaContext.Provider value={{ safeAreaInsets, safeAreaPadding }}>
      <div
        className="mobile-app-container min-h-screen bg-[#1a1a2e]"
        style={safeAreaPadding}
      >
        {children}
      </div>
    </SafeAreaContext.Provider>
  );
}

/**
 * Component that only renders its children on web, hidden in native app
 */
export function WebOnly({ children }: { children: ReactNode }) {
  const { isNativeApp, isReady } = useCapacitor();

  if (!isReady) return <>{children}</>;
  if (isNativeApp) return null;

  return <>{children}</>;
}

/**
 * Component that only renders its children in native app, hidden on web
 */
export function NativeOnly({ children }: { children: ReactNode }) {
  const { isNativeApp, isReady } = useCapacitor();

  if (!isReady) return null;
  if (!isNativeApp) return null;

  return <>{children}</>;
}

/**
 * Hook to get platform-specific header height
 */
export function useHeaderHeight() {
  const { isNativeApp, platform } = useCapacitor();
  const { safeAreaInsets } = useSafeArea();

  if (!isNativeApp) return 64;

  if (platform === 'ios') {
    return 44 + safeAreaInsets.top;
  }

  return 56 + safeAreaInsets.top;
}

/**
 * Hook to get bottom tab bar height
 */
export function useTabBarHeight() {
  const { isNativeApp, platform } = useCapacitor();
  const { safeAreaInsets } = useSafeArea();

  if (!isNativeApp) return 0;

  return 50 + safeAreaInsets.bottom;
}
