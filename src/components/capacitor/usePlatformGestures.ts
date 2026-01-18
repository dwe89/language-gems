'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useCapacitor } from './CapacitorProvider';

type HapticImpactStyle = 'light' | 'medium' | 'heavy';
type HapticNotificationType = 'success' | 'warning' | 'error';

interface SwipeConfig {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface LongPressConfig {
  threshold?: number;
  onLongPress?: () => void;
  onPress?: () => void;
  hapticFeedback?: HapticImpactStyle;
}

interface GestureHandlers {
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  isSwiping: boolean;
}

interface LongPressState {
  startX: number;
  startY: number;
  timer: NodeJS.Timeout | null;
  isLongPress: boolean;
  hasTriggered: boolean;
}

let hapticModule: typeof import('@capacitor/haptics') | null = null;

async function loadHapticModule() {
  if (typeof window === 'undefined') return null;
  try {
    hapticModule = await import('@capacitor/haptics');
    return hapticModule;
  } catch (error) {
    console.warn('[usePlatformGestures] Haptics module not available:', error);
    return null;
  }
}

export async function triggerHaptic(impact: HapticImpactStyle = 'light') {
  if (hapticModule) {
    try {
      const impactStyle = {
        light: hapticModule.ImpactStyle.Light,
        medium: hapticModule.ImpactStyle.Medium,
        heavy: hapticModule.ImpactStyle.Heavy,
      }[impact];

      await hapticModule.Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.warn('[triggerHaptic] Failed to trigger haptic:', error);
    }
  }
}

export async function triggerNotification(type: HapticNotificationType = 'success') {
  if (hapticModule) {
    try {
      const notificationType = {
        success: hapticModule.NotificationType.Success,
        warning: hapticModule.NotificationType.Warning,
        error: hapticModule.NotificationType.Error,
      }[type];

      await hapticModule.Haptics.notification({ type: notificationType });
    } catch (error) {
      console.warn('[triggerNotification] Failed to trigger notification:', error);
    }
  }
}

export function usePlatformGestures() {
  const { isNativeApp, platform } = useCapacitor();

  useEffect(() => {
    if (isNativeApp) {
      loadHapticModule();
    }
  }, [isNativeApp]);

  const useSwipe = useCallback((config: SwipeConfig): GestureHandlers => {
    const { threshold = 50, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown } = config;
    const stateRef = useRef<SwipeState>({ startX: 0, startY: 0, isSwiping: false });

    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      stateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        isSwiping: true,
      };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!stateRef.current.isSwiping) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - stateRef.current.startX;
      const deltaY = touch.clientY - stateRef.current.startY;

      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        stateRef.current.isSwiping = false;
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (!stateRef.current.isSwiping) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - stateRef.current.startX;
      const deltaY = touch.clientY - stateRef.current.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > threshold && absX > absY) {
        if (deltaX > 0 && onSwipeRight) {
          triggerHaptic('light');
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          triggerHaptic('light');
          onSwipeLeft();
        }
      } else if (absY > threshold && absY > absX) {
        if (deltaY > 0 && onSwipeDown) {
          triggerHaptic('light');
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          triggerHaptic('light');
          onSwipeUp();
        }
      }

      stateRef.current.isSwiping = false;
    };

    return {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    };
  }, [platform]);

  const useLongPress = useCallback((config: LongPressConfig): GestureHandlers => {
    const { threshold = 500, onLongPress, onPress, hapticFeedback } = config;
    const stateRef = useRef<LongPressState>({
      startX: 0,
      startY: 0,
      timer: null,
      isLongPress: false,
      hasTriggered: false,
    });

    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      stateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        timer: null,
        isLongPress: false,
        hasTriggered: false,
      };

      const timer = setTimeout(() => {
        stateRef.current.isLongPress = true;
        stateRef.current.hasTriggered = true;
        if (hapticFeedback) {
          triggerHaptic(hapticFeedback);
        }
        if (onLongPress) {
          onLongPress();
        }
      }, threshold);

      stateRef.current.timer = timer;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (stateRef.current.hasTriggered) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - stateRef.current.startX);
      const deltaY = Math.abs(touch.clientY - stateRef.current.startY);
      const moveThreshold = 10;

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        if (stateRef.current.timer) {
          clearTimeout(stateRef.current.timer);
          stateRef.current.timer = null;
        }
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (stateRef.current.timer) {
        clearTimeout(stateRef.current.timer);
        stateRef.current.timer = null;
      }

      if (!stateRef.current.isLongPress && !stateRef.current.hasTriggered && onPress) {
        onPress();
      }

      stateRef.current.isLongPress = false;
      stateRef.current.hasTriggered = false;
    };

    return {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    };
  }, [platform]);

  return {
    useSwipe,
    useLongPress,
    triggerHaptic,
    triggerNotification,
  };
}

export function useGesturesEnabled() {
  const { isNativeApp } = useCapacitor();
  return isNativeApp;
}
