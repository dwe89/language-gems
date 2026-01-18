'use client';

import React, { ReactNode, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCapacitor } from './CapacitorProvider';
import { usePlatformGestures, useGesturesEnabled } from './usePlatformGestures';
import { ChevronLeft, ChevronRight, MoreVertical, Share, Bookmark, Trash2 } from 'lucide-react';

interface SwipeNavigationProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  children,
  className = '',
  disabled = false,
}: SwipeNavigationProps) {
  const { useSwipe } = usePlatformGestures();
  const gesturesEnabled = useGesturesEnabled();

  const swipeHandlers = disabled || !gesturesEnabled ? {} : useSwipe({
    onSwipeLeft,
    onSwipeRight,
  });

  return (
    <div
      className={`relative ${className}`}
      {...swipeHandlers}
    >
      {children}
    </div>
  );
}

interface SwipeBackNavigationProps {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
}

export function SwipeBackNavigation({ children, className = '', enabled = true }: SwipeBackNavigationProps) {
  const router = useRouter();
  const { platform } = useCapacitor();
  const { useSwipe } = usePlatformGestures();
  const gesturesEnabled = useGesturesEnabled();
  const [showBackIndicator, setShowBackIndicator] = useState(false);

  const swipeHandlers = !enabled || !gesturesEnabled ? {} : useSwipe({
    onSwipeRight: () => {
      router.back();
      setShowBackIndicator(false);
    },
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX < 30) {
      setShowBackIndicator(true);
    }
    swipeHandlers.onTouchStart?.(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setShowBackIndicator(false);
    swipeHandlers.onTouchEnd?.(e);
  };

  return (
    <div
      className={`relative ${className}`}
      {...swipeHandlers}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {showBackIndicator && (
        <div className="fixed inset-y-0 left-0 w-16 flex items-center justify-start pl-3 pointer-events-none z-50">
          <div className="bg-gray-900/20 dark:bg-white/20 rounded-full p-3 backdrop-blur-sm">
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

interface LongPressButtonProps {
  onLongPress?: () => void;
  onPress?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  variant?: 'default' | 'ghost' | 'outline';
}

export function LongPressButton({
  onLongPress,
  onPress,
  children,
  className = '',
  disabled = false,
  hapticFeedback = 'medium',
  variant = 'default',
}: LongPressButtonProps) {
  const { useLongPress } = usePlatformGestures();
  const gesturesEnabled = useGesturesEnabled();
  const [isPressing, setIsPressing] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handlePress = useCallback(() => {
    if (onPress) onPress();
  }, [onPress]);

  const handleLongPress = useCallback(() => {
    setIsLongPressing(true);
    if (onLongPress) onLongPress();
  }, [onLongPress]);

  const gestureHandlers = disabled || !gesturesEnabled ? {} : useLongPress({
    threshold: 500,
    onLongPress: handleLongPress,
    onPress: handlePress,
    hapticFeedback,
  });

  const getVariantStyles = () => {
    switch (variant) {
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800';
      case 'outline':
        return 'bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';
    }
  };

  const getActiveStyles = () => {
    if (isLongPressing) {
      return 'scale-95 opacity-90 ring-2 ring-indigo-500 ring-offset-2';
    }
    if (isPressing) {
      return 'scale-98 opacity-95';
    }
    return '';
  };

  return (
    <button
      className={`relative overflow-hidden rounded-lg transition-all duration-150 active:duration-75 ${getVariantStyles()} ${getActiveStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...gestureHandlers}
      onTouchStart={(e) => {
        setIsPressing(true);
        gestureHandlers.onTouchStart?.(e);
      }}
      onTouchEnd={(e) => {
        setIsPressing(false);
        setIsLongPressing(false);
        gestureHandlers.onTouchEnd?.(e);
      }}
      onTouchMove={(e) => {
        gestureHandlers.onTouchMove?.(e);
      }}
    >
      {children}

      {isLongPressing && (
        <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
      )}
    </button>
  );
}

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
  className?: string;
  leftAction?: {
    icon?: ReactNode;
    label?: string;
    color?: string;
  };
  rightAction?: {
    icon?: ReactNode;
    label?: string;
    color?: string;
  };
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 100,
  className = '',
  leftAction,
  rightAction,
}: SwipeableCardProps) {
  const { platform } = useCapacitor();
  const { useSwipe } = usePlatformGestures();
  const gesturesEnabled = useGesturesEnabled();
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gesturesEnabled) return;
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !gesturesEnabled) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startXRef.current;

    if (rightAction && deltaX > 0) {
      setTranslateX(Math.min(deltaX, swipeThreshold));
    } else if (leftAction && deltaX < 0) {
      setTranslateX(Math.max(deltaX, -swipeThreshold));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !gesturesEnabled) {
      setIsDragging(false);
      return;
    }

    if (translateX > swipeThreshold * 0.7 && rightAction) {
      onSwipeRight?.();
    } else if (translateX < -swipeThreshold * 0.7 && leftAction) {
      onSwipeLeft?.();
    }

    setTranslateX(0);
    setIsDragging(false);
  };

  const getLeftActionStyle = () => {
    if (!leftAction) return {};
    return {
      backgroundColor: leftAction.color || '#ef4444',
      transform: `translateX(${Math.min(translateX + swipeThreshold, 0)}px)`,
      opacity: Math.abs(translateX) / swipeThreshold,
    };
  };

  const getRightActionStyle = () => {
    if (!rightAction) return {};
    return {
      backgroundColor: rightAction.color || '#22c55e',
      transform: `translateX(${Math.max(translateX - swipeThreshold, 0)}px)`,
      opacity: translateX / swipeThreshold,
    };
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {leftAction && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-end pr-4 transition-transform"
          style={getLeftActionStyle()}
        >
          <div className="flex flex-col items-center text-white">
            {leftAction.icon}
            {leftAction.label && <span className="text-xs mt-1">{leftAction.label}</span>}
          </div>
        </div>
      )}

      {rightAction && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-start pl-4 transition-transform"
          style={getRightActionStyle()}
        >
          <div className="flex flex-col items-center text-white">
            {rightAction.icon}
            {rightAction.label && <span className="text-xs mt-1">{rightAction.label}</span>}
          </div>
        </div>
      )}

      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

interface ContextMenuButtonProps {
  children: ReactNode;
  menuItems: {
    label: string;
    icon?: ReactNode;
    onPress: () => void;
    destructive?: boolean;
  }[];
  className?: string;
}

export function ContextMenuButton({ children, menuItems, className = '' }: ContextMenuButtonProps) {
  const { platform } = useCapacitor();
  const { useLongPress } = usePlatformGestures();
  const gesturesEnabled = useGesturesEnabled();
  const [showMenu, setShowMenu] = useState(false);

  const handleLongPress = () => {
    setShowMenu(true);
  };

  const gestureHandlers = !gesturesEnabled ? {} : useLongPress({
    threshold: 500,
    onLongPress: handleLongPress,
    hapticFeedback: 'medium',
  });

  return (
    <div className={`relative ${className}`}>
      <div {...gestureHandlers}>{children}</div>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onPress();
                  setShowMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm ${
                  item.destructive
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { triggerHaptic, triggerNotification } from './usePlatformGestures';
