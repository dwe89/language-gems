'use client';

import { useCapacitor } from './CapacitorProvider';
import { triggerHaptic } from './MobileTabBar';
import * as LucideIcons from 'lucide-react';

export interface PlatformIconProps {
  icon: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  color?: string;
}

const iOSSymbolStyles = {
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const androidMaterialStyles = {
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function PlatformIcon({ icon, size = 24, className = '', color }: PlatformIconProps) {
  const { platform } = useCapacitor();

  const iOS = platform === 'ios';
  const android = platform === 'android';

  const IconComponent = LucideIcons[icon];
  if (!IconComponent || typeof IconComponent !== 'function') {
    console.warn(`[PlatformIcon] Unknown icon: ${icon}`);
    return null;
  }

  const iconStyles = iOS ? iOSSymbolStyles : android ? androidMaterialStyles : {};
  const iconColor = color || (iOS ? 'currentColor' : android ? 'currentColor' : undefined);

  const LucideIcon = IconComponent as any;

  return (
    <LucideIcon
      size={size}
      className={className}
      color={iconColor}
      {...iconStyles}
    />
  );
}

export const PlatformIcons = {
  Home: 'Home' as const,
  ChevronLeft: 'ChevronLeft' as const,
  ChevronRight: 'ChevronRight' as const,
  ChevronDown: 'ChevronDown' as const,
  ChevronUp: 'ChevronUp' as const,
  X: 'X' as const,
  Check: 'Check' as const,
  AlertCircle: 'AlertCircle' as const,
  Info: 'Info' as const,
  AlertTriangle: 'AlertTriangle' as const,
  Volume2: 'Volume2' as const,
  VolumeX: 'VolumeX' as const,
  Play: 'Play' as const,
  Pause: 'Pause' as const,
  Settings: 'Settings' as const,
  User: 'User' as const,
  Menu: 'Menu' as const,
  Search: 'Search' as const,
  Filter: 'Filter' as const,
  MoreHorizontal: 'MoreHorizontal' as const,
  MoreVertical: 'MoreVertical' as const,
  Star: 'Star' as const,
  Trophy: 'Trophy' as const,
  Zap: 'Zap' as const,
  Heart: 'Heart' as const,
  Timer: 'Timer' as const,
  Flame: 'Flame' as const,
  LogOut: 'LogOut' as const,
  Gamepad2: 'Gamepad2' as const,
  BookOpen: 'BookOpen' as const,
  BarChart3: 'BarChart3' as const,
  ArrowLeft: 'ArrowLeft' as const,
  RotateCcw: 'RotateCcw' as const,
  Target: 'Target' as const,
};
