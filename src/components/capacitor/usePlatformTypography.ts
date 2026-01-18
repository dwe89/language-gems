'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCapacitor } from './CapacitorProvider';

interface PlatformTypography {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  letterSpacing: string;
  lineHeight: string;
}

const iOSTypography: Record<string, PlatformTypography> = {
  caption: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    lineHeight: '1.2',
  },
  footnote: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '0.8125rem',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    lineHeight: '1.2',
  },
  subheadline: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '-0.005em',
    lineHeight: '1.2',
  },
  callout: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '0.9375rem',
    fontWeight: 400,
    letterSpacing: '-0.003em',
    lineHeight: '1.2',
  },
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: '-0.001em',
    lineHeight: '1.4',
  },
  headline: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '1.0625rem',
    fontWeight: 600,
    letterSpacing: '-0.001em',
    lineHeight: '1.2',
  },
  title1: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '1.25rem',
    fontWeight: 600,
    letterSpacing: '-0.001em',
    lineHeight: '1.2',
  },
  title2: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '-0.001em',
    lineHeight: '1.2',
  },
  title3: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '1.75rem',
    fontWeight: 600,
    letterSpacing: '-0.001em',
    lineHeight: '1.2',
  },
  largeTitle: {
    fontFamily: '-apple-system, BlinkMacSystemFont',
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '-0.001em',
    lineHeight: '1.2',
  },
};

const androidTypography: Record<string, PlatformTypography> = {
  caption: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: '0.033em',
    lineHeight: '1.2',
  },
  footnote: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: '0.025em',
    lineHeight: '1.4',
  },
  subheadline: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.007em',
    lineHeight: '1.57',
  },
  body: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.017em',
    lineHeight: '1.5',
  },
  button: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.089em',
    lineHeight: '1.75',
  },
  overline: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.143em',
    lineHeight: '1.33',
  },
  h6: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.007em',
    lineHeight: '1.6',
  },
  h5: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '1.5rem',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: '1.33',
  },
  h4: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '2.125rem',
    fontWeight: 400,
    letterSpacing: '0.007em',
    lineHeight: '1.17',
  },
  h3: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '2.625rem',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: '1.2',
  },
  h2: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '3rem',
    fontWeight: 400,
    letterSpacing: '0',
    lineHeight: '1.2',
  },
  h1: {
    fontFamily: 'Roboto, Noto Sans',
    fontSize: '3.375rem',
    fontWeight: 400,
    letterSpacing: '-0.015em',
    lineHeight: '1.2',
  },
};

/**
 * Hook to get platform-specific typography styles
 * Returns correct font family, size, weight, and spacing for iOS or Android
 */
export function usePlatformTypography() {
  const { platform } = useCapacitor();
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const loadFontScale = () => {
      const savedScale = localStorage.getItem('font-scale');
      if (savedScale) {
        setFontScale(parseFloat(savedScale));
      }
    };

    loadFontScale();

    const handleAccessibilityChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setFontScale(1.2);
      } else {
        setFontScale(1);
      }
    };

    const prefersLargerTexts = window.matchMedia('(prefers-reduced-data: no) and (prefers-contrast: more)');
    prefersLargerTexts.addEventListener('change', handleAccessibilityChange);
    handleAccessibilityChange({ matches: prefersLargerTexts.matches } as MediaQueryListEvent);

    return () => {
      prefersLargerTexts.removeEventListener('change', handleAccessibilityChange);
    };
  }, []);

  const getTypography = useCallback((style: string): PlatformTypography => {
    const typography = platform === 'ios' ? iOSTypography : androidTypography;
    return typography[style] || typography.body;
  }, [platform]);

  const setFontScaleValue = useCallback((scale: number) => {
    setFontScale(scale);
    localStorage.setItem('font-scale', scale.toString());
    document.documentElement.style.setProperty('--font-scale', scale.toString());
  }, []);

  return {
    getTypography,
    fontScale,
    setFontScale: setFontScaleValue,
    platform,
    typography: platform === 'ios' ? iOSTypography : androidTypography,
  };
}

/**
 * Hook to apply platform typography to text elements
 */
export function useTypography() {
  const { platform } = useCapacitor();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    isHydrated,
    platform,
    textClass: platform === 'ios' ? 'text-platform-ios' : platform === 'android' ? 'text-platform-android' : '',
  };
}
