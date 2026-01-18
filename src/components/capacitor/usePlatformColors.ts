'use client';

import { useCapacitor } from './CapacitorProvider';

export type ColorTheme = 'ios' | 'android' | 'web';

interface ColorPalette {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  accent: string;
  accentHover: string;
  accentActive: string;
  success: string;
  successHover: string;
  successActive: string;
  warning: string;
  warningHover: string;
  warningActive: string;
  error: string;
  errorHover: string;
  errorActive: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
}

const iOSColors: ColorPalette = {
  primary: '#007AFF',
  primaryHover: '#0056D6',
  primaryActive: '#0044A8',
  secondary: '#F2F2F7',
  secondaryHover: '#E5E5EA',
  secondaryActive: '#D1D1D6',
  accent: '#5856D6',
  accentHover: '#4845C3',
  accentActive: '#3A37B1',
  success: '#34C759',
  successHover: '#28A746',
  successActive: '#228B22',
  warning: '#FF9500',
  warningHover: '#E68300',
  warningActive: '#CC7200',
  error: '#FF3B30',
  errorHover: '#E63328',
  errorActive: '#CC2B21',
  background: '#F2F2F7',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E5E5EA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#C6C6C8',
  text: '#000000',
  textSecondary: '#3C3C4399',
  textTertiary: '#3C3C4366',
  textInverse: '#FFFFFF',
};

const androidColors: ColorPalette = {
  primary: '#6200EE',
  primaryHover: '#3700B3',
  primaryActive: '#2D0085',
  secondary: '#E1E1E1',
  secondaryHover: '#D5D5D5',
  secondaryActive: '#C9C9C9',
  accent: '#03DAC6',
  accentHover: '#02C3B3',
  accentActive: '#01AC9F',
  success: '#4CAF50',
  successHover: '#439A46',
  successActive: '#388E3C',
  warning: '#FF9800',
  warningHover: '#E68900',
  warningActive: '#CC7A00',
  error: '#F44336',
  errorHover: '#E53935',
  errorActive: '#D32F2F',
  background: '#FAFAFA',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#EEEEEE',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F5F5',
  border: '#E0E0E0',
  text: '#000000',
  textSecondary: '#9E9E9E',
  textTertiary: '#757575',
  textInverse: '#FFFFFF',
};

const webColors: ColorPalette = {
  primary: '#7C3AED',
  primaryHover: '#6D28D9',
  primaryActive: '#5B21B6',
  secondary: '#1F2937',
  secondaryHover: '#1F2937',
  secondaryActive: '#1F2937',
  accent: '#8B5CF6',
  accentHover: '#7C3AED',
  accentActive: '#6D28D9',
  success: '#10B981',
  successHover: '#059669',
  successActive: '#047857',
  warning: '#F59E0B',
  warningHover: '#D97706',
  warningActive: '#B45309',
  error: '#EF4444',
  errorHover: '#DC2626',
  errorActive: '#B91C1C',
  background: '#111827',
  backgroundSecondary: '#1F2937',
  backgroundTertiary: '#374151',
  surface: '#1F2937',
  surfaceElevated: '#374151',
  border: '#4B5563',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textInverse: '#111827',
};

const darkModeColors: Partial<ColorPalette> = {
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  border: '#38383A',
  text: '#FFFFFF',
  textSecondary: '#98989D',
  textTertiary: '#636366',
  textInverse: '#000000',
};

export function usePlatformColors() {
  const { platform } = useCapacitor();

  const getPalette = (darkMode: boolean = false): ColorPalette => {
    let baseColors: ColorPalette;

    switch (platform) {
      case 'ios':
        baseColors = { ...iOSColors };
        break;
      case 'android':
        baseColors = { ...androidColors };
        break;
      default:
        baseColors = { ...webColors };
    }

    if (darkMode) {
      return { ...baseColors, ...darkModeColors };
    }

    return baseColors;
  };

  const getColor = (colorName: keyof ColorPalette, darkMode: boolean = false): string => {
    const palette = getPalette(darkMode);
    return palette[colorName];
  };

  const getGradient = (type: 'primary' | 'secondary' | 'accent', darkMode: boolean = false): string => {
    const palette = getPalette(darkMode);
    const colors = {
      primary: [palette.primary, palette.primaryHover],
      secondary: [palette.secondary, palette.secondaryHover],
      accent: [palette.accent, palette.accentHover],
    };
    return `linear-gradient(135deg, ${colors[type][0]}, ${colors[type][1]})`;
  };

  const getElevation = (level: 0 | 1 | 2 | 3 | 4 | 5): string => {
    const shadows = {
      0: 'none',
      1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      2: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
      3: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
      4: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
      5: '0 20px 40px rgba(0, 0, 0, 0.20), 0 8px 16px rgba(0, 0, 0, 0.10)',
    };
    return shadows[level];
  };

  const getOpacity = (colorName: keyof ColorPalette, opacity: number, darkMode: boolean = false): string => {
    const color = getColor(colorName, darkMode);
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
    };
    const rgb = hexToRgb(color);
    return `rgba(${rgb}, ${opacity})`;
  };

  return {
    getPalette,
    getColor,
    getGradient,
    getElevation,
    getOpacity,
  };
}

export default usePlatformColors;
