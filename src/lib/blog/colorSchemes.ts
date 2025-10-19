/**
 * Color scheme configurations for blog posts
 * Each scheme includes gradient backgrounds, accent colors, and tag colors
 */

export interface ColorScheme {
  name: string;
  gradient: string;
  headerBg: string;
  accentColor: string;
  accentHover: string;
  tagBg: string;
  tagText: string;
  iconBg: string;
  iconColor: string;
  buttonGradient: string;
}

export const colorSchemes: Record<string, ColorScheme> = {
  blue: {
    name: 'Blue',
    gradient: 'from-blue-50 to-indigo-100',
    headerBg: 'bg-blue-100',
    accentColor: 'text-blue-600',
    accentHover: 'hover:text-blue-800',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonGradient: 'from-blue-600 to-indigo-600',
  },
  indigo: {
    name: 'Indigo',
    gradient: 'from-indigo-50 to-purple-100',
    headerBg: 'bg-indigo-100',
    accentColor: 'text-indigo-600',
    accentHover: 'hover:text-indigo-800',
    tagBg: 'bg-indigo-100',
    tagText: 'text-indigo-800',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    buttonGradient: 'from-indigo-600 to-purple-600',
  },
  purple: {
    name: 'Purple',
    gradient: 'from-purple-50 to-pink-100',
    headerBg: 'bg-purple-100',
    accentColor: 'text-purple-600',
    accentHover: 'hover:text-purple-800',
    tagBg: 'bg-purple-100',
    tagText: 'text-purple-800',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    buttonGradient: 'from-purple-600 to-pink-600',
  },
  green: {
    name: 'Green',
    gradient: 'from-green-50 to-emerald-100',
    headerBg: 'bg-green-100',
    accentColor: 'text-green-600',
    accentHover: 'hover:text-green-800',
    tagBg: 'bg-green-100',
    tagText: 'text-green-800',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    buttonGradient: 'from-green-600 to-emerald-600',
  },
  orange: {
    name: 'Orange',
    gradient: 'from-orange-50 to-amber-100',
    headerBg: 'bg-orange-100',
    accentColor: 'text-orange-600',
    accentHover: 'hover:text-orange-800',
    tagBg: 'bg-orange-100',
    tagText: 'text-orange-800',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    buttonGradient: 'from-orange-600 to-amber-600',
  },
  red: {
    name: 'Red',
    gradient: 'from-red-50 to-rose-100',
    headerBg: 'bg-red-100',
    accentColor: 'text-red-600',
    accentHover: 'hover:text-red-800',
    tagBg: 'bg-red-100',
    tagText: 'text-red-800',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonGradient: 'from-red-600 to-rose-600',
  },
  teal: {
    name: 'Teal',
    gradient: 'from-teal-50 to-cyan-100',
    headerBg: 'bg-teal-100',
    accentColor: 'text-teal-600',
    accentHover: 'hover:text-teal-800',
    tagBg: 'bg-teal-100',
    tagText: 'text-teal-800',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    buttonGradient: 'from-teal-600 to-cyan-600',
  },
  slate: {
    name: 'Slate',
    gradient: 'from-slate-50 to-gray-100',
    headerBg: 'bg-slate-100',
    accentColor: 'text-slate-600',
    accentHover: 'hover:text-slate-800',
    tagBg: 'bg-slate-100',
    tagText: 'text-slate-800',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    buttonGradient: 'from-slate-600 to-gray-600',
  },
};

/**
 * Get color scheme by name, fallback to blue if not found
 */
export function getColorScheme(schemeName?: string | null): ColorScheme {
  if (!schemeName) return colorSchemes.blue;
  return colorSchemes[schemeName.toLowerCase()] || colorSchemes.blue;
}

/**
 * Get Lucide icon component by name
 */
export function getIconComponent(iconName?: string | null) {
  // This will be imported dynamically in the component
  return iconName || 'BookOpen';
}

