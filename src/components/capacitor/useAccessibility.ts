'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useCapacitor } from './CapacitorProvider';

export type ReducedMotionPreference = 'no-preference' | 'reduce';

export function useAccessibility() {
  const { isNativeApp, platform } = useCapacitor();

  const checkReducedMotion = useCallback((): ReducedMotionPreference => {
    if (typeof window === 'undefined') return 'no-preference';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'reduce'
      : 'no-preference';
  }, []);

  const checkHighContrast = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: high)').matches;
  }, []);

  const checkPrefersDark = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  const announceForScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof document === 'undefined') return;

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';

    Object.assign(liveRegion.style, {
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    });

    document.body.appendChild(liveRegion);
    liveRegion.textContent = message;

    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, []);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  }, []);

  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const saveFocus = useCallback((): (() => void) => {
    const activeElement = document.activeElement as HTMLElement;
    return () => {
      if (activeElement && document.body.contains(activeElement)) {
        focusElement(activeElement);
      }
    };
  }, [focusElement]);

  return {
    checkReducedMotion,
    checkHighContrast,
    checkPrefersDark,
    announceForScreenReader,
    focusElement,
    trapFocus,
    saveFocus,
    isNativeApp,
    platform,
  };
}

export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const { trapFocus } = useAccessibility();

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const cleanup = trapFocus(containerRef.current);
    return cleanup;
  }, [active, trapFocus]);

  return containerRef;
}

export function useScreenReaderAnnouncement() {
  const { announceForScreenReader } = useAccessibility();

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceForScreenReader(message, priority);
  }, [announceForScreenReader]);

  return announce;
}

export function useReducedMotion() {
  const { checkReducedMotion } = useAccessibility();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<ReducedMotionPreference>('no-preference');

  useEffect(() => {
    const check = () => setPrefersReducedMotion(checkReducedMotion());
    check();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', check);

    return () => {
      mediaQuery.removeEventListener('change', check);
    };
  }, [checkReducedMotion]);

  return prefersReducedMotion === 'reduce';
}

export function useHighContrast() {
  const { checkHighContrast } = useAccessibility();
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const check = () => setPrefersHighContrast(checkHighContrast());
    check();

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    mediaQuery.addEventListener('change', check);

    return () => {
      mediaQuery.removeEventListener('change', check);
    };
  }, [checkHighContrast]);

  return prefersHighContrast;
}

export function useFocusManager() {
  const { focusElement } = useAccessibility();

  const setFocus = useCallback((element: HTMLElement | null) => {
    focusElement(element);
  }, [focusElement]);

  const restoreFocus = useCallback((previousElement: HTMLElement | null) => {
    if (previousElement) {
      focusElement(previousElement);
    }
  }, [focusElement]);

  const saveFocus = useCallback((): (() => void) => {
    const activeElement = document.activeElement as HTMLElement;
    return () => {
      if (activeElement && document.body.contains(activeElement)) {
        focusElement(activeElement);
      }
    };
  }, [focusElement]);

  return {
    setFocus,
    restoreFocus,
    saveFocus,
  };
}

import { useState } from 'react';

export function useScreenReaderDetection() {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const check = () => {
      const hasScreenReader = window.navigator.userAgent.match(/JAWS|NVDA|VoiceOver|TalkBack/i);
      setIsScreenReaderActive(!!hasScreenReader);
    };

    check();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', check);

    return () => {
      mediaQuery.removeEventListener('change', check);
    };
  }, []);

  return isScreenReaderActive;
}
