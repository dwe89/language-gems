'use client';

import { MouseEvent, TouchEvent, useState, useRef, ReactNode } from 'react';
import { useCapacitor } from './CapacitorProvider';
import { triggerHaptic, triggerNotification } from './usePlatformGestures';

interface PlatformButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

/**
 * Platform-specific button with touch feedback
 * iOS: Native press animation + haptic
 * Android: Material ripple effect + haptic
 */
export function PlatformButton({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  hapticFeedback = 'light',
}: PlatformButtonProps) {
  const { platform } = useCapacitor();
  const [rippleState, setRippleState] = useState({ x: 0, y: 0, active: false });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const iOS = platform === 'ios';
  const android = platform === 'android';

  const handlePress = (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (hapticFeedback === 'success' || hapticFeedback === 'warning' || hapticFeedback === 'error') {
      triggerNotification(hapticFeedback);
    } else {
      triggerHaptic(hapticFeedback);
    }

    if (android) {
      const rect = buttonRef.current?.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (rect) {
        setRippleState({
          x: clientX - rect.left,
          y: clientY - rect.top,
          active: true,
        });

        setTimeout(() => setRippleState(prev => ({ ...prev, active: false })), 400);
      }
    }

    onPress?.();
  };

  const baseClasses = 'relative overflow-hidden transition-all duration-200 font-medium';

  const variantClasses = {
    primary: iOS
      ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'
      : android
      ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-surface-elevated'
      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:from-purple-800 active:to-indigo-800 text-white shadow-lg',
    secondary: iOS
      ? 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-900'
      : android
      ? 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-900 shadow-surface-elevated'
      : 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20',
    ghost: iOS
      ? 'hover:bg-blue-500/10 active:bg-blue-500/20 text-blue-500'
      : android
      ? 'hover:bg-indigo-600/10 active:bg-indigo-600/20 text-indigo-600'
      : 'hover:bg-purple-400/10 active:bg-purple-400/20 text-purple-400',
  };

  const sizeClasses = {
    small: iOS ? 'px-3 py-1.5 text-xs' : android ? 'px-3 py-1.5 text-xs' : 'px-3 py-1.5 text-xs',
    medium: iOS ? 'px-4 py-2 text-sm' : android ? 'px-4 py-2 text-sm' : 'px-4 py-2 text-sm',
    large: iOS ? 'px-6 py-3 text-base' : android ? 'px-6 py-3 text-base' : 'px-6 py-3 text-base',
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer active:scale-95';

  return (
    <button
      ref={buttonRef}
      onClick={handlePress}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} rounded-lg ${className}`}
    >
      {android && (
        <span
          className={`absolute bg-white/30 rounded-full pointer-events-none transition-transform duration-400 ${
            rippleState.active ? 'scale-100' : 'scale-0'
          }`}
          style={{
            left: rippleState.x,
            top: rippleState.y,
            width: '100px',
            height: '100px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {children}
    </button>
  );
}

/**
 * Platform-specific card component
 * iOS: Subtle shadow with border radius
 * Android: Material elevation with surface background
 */
interface PlatformCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onPress?: () => void;
}

export function PlatformCard({
  children,
  className = '',
  interactive = false,
  onPress,
}: PlatformCardProps) {
  const { platform } = useCapacitor();

  const iOS = platform === 'ios';
  const android = platform === 'android';

  const baseClasses = 'rounded-xl transition-all duration-200';

  const styleClasses = iOS
    ? 'bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg'
    : android
    ? 'bg-surface-elevated shadow-surface-elevated'
    : 'bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg';

  const interactiveClasses = interactive
    ? 'cursor-pointer active:scale-[0.98]'
    : '';

  const handleClick = () => {
    if (interactive && onPress) {
      triggerHaptic('light');
      onPress();
    }
  };

  if (interactive && onPress) {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} ${styleClasses} ${interactiveClasses} p-4 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${baseClasses} ${styleClasses} p-4 ${className}`}>
      {children}
    </div>
  );
}
