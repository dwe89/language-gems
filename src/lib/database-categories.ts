import { createClient } from '@/utils/supabase/client';
import {
  Book,
  GraduationCap,
  Clipboard,
  User,
  Home,
  Gamepad2,
  Utensils,
  Shirt,
  Laptop,
  Stethoscope,
  Plane,
  Leaf,
  Globe,
  Lightbulb,
  Clock,
  Target,
  Award,
  Star,
  Users,
  School,
  Heart,
  Earth,
  Palette
} from 'lucide-react';

export interface DatabaseCategory {
  id: string;
  name: string;
  displayName: string;
  icon: React.ElementType;
  color: string;
  subcategories: DatabaseSubcategory[];
}

export interface DatabaseSubcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

export interface KS4Theme {
  id: string;
  name: string;
  displayName: string;
  icon: React.ElementType;
  color: string;
  units: KS4Unit[];
}

export interface KS4Unit {
  id: string;
  name: string;
  displayName: string;
  themeId: string;
}

/**
 * Fetch KS3 categories and subcategories from the database
 */
export async function fetchKS3Categories(): Promise<DatabaseCategory[]> {
  const supabase = createClient();
  
  try {
    // Get distinct categories and subcategories for KS3
    const { data, error } = await supabase
      .from('centralized_vocabulary')
      .select('category, subcategory')
      .not('category', 'is', null)
      .not('subcategory', 'is', null)
      .or('curriculum_level.is.null,curriculum_level.eq.KS3')
      .order('category')
      .order('subcategory');

    if (error) {
      console.error('Error fetching KS3 categories:', error);
      return [];
    }

    // Group subcategories by category
    const categoryMap = new Map<string, Set<string>>();
    
    data.forEach(({ category, subcategory }) => {
      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Set());
      }
      categoryMap.get(category)!.add(subcategory);
    });

    // Convert to the expected format
    const categories: DatabaseCategory[] = Array.from(categoryMap.entries()).map(([category, subcategoriesSet]) => {
      const subcategories: DatabaseSubcategory[] = Array.from(subcategoriesSet).map(subcategory => ({
        id: subcategory,
        name: subcategory,
        displayName: formatDisplayName(subcategory),
        categoryId: category
      }));

      const { icon, color } = getCategoryIconAndColor(category);

      return {
        id: category,
        name: category,
        displayName: formatDisplayName(category),
        icon,
        color,
        subcategories
      };
    });

    return categories;
  } catch (error) {
    console.error('Error fetching KS3 categories:', error);
    return [];
  }
}

/**
 * Fetch KS4 themes and units from the database for a specific exam board
 */
export async function fetchKS4Themes(examBoard: 'AQA' | 'edexcel'): Promise<KS4Theme[]> {
  const supabase = createClient();
  
  try {
    // Get distinct themes and units for KS4 and specific exam board
    const { data, error } = await supabase
      .from('centralized_vocabulary')
      .select('theme_name, unit_name')
      .not('theme_name', 'is', null)
      .not('unit_name', 'is', null)
      .eq('curriculum_level', 'KS4')
      .eq('exam_board_code', examBoard)
      .order('theme_name')
      .order('unit_name');

    if (error) {
      console.error('Error fetching KS4 themes:', error);
      return [];
    }

    // Group units by theme
    const themeMap = new Map<string, Set<string>>();
    
    data.forEach(({ theme_name, unit_name }) => {
      if (!themeMap.has(theme_name)) {
        themeMap.set(theme_name, new Set());
      }
      themeMap.get(theme_name)!.add(unit_name);
    });

    // Convert to the expected format
    const themes: KS4Theme[] = Array.from(themeMap.entries()).map(([theme, unitsSet]) => {
      const units: KS4Unit[] = Array.from(unitsSet).map(unit => ({
        id: unit,
        name: unit,
        displayName: formatDisplayName(unit),
        themeId: theme
      }));

      const { icon, color } = getCategoryIconAndColor(theme);

      return {
        id: theme,
        name: theme,
        displayName: formatDisplayName(theme),
        icon,
        color,
        units
      };
    });

    return themes;
  } catch (error) {
    console.error('Error fetching KS4 themes:', error);
    return [];
  }
}

/**
 * Format a database name into a display-friendly format
 */
function formatDisplayName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();
}

/**
 * Get icon and color for a category based on its name
 */
function getCategoryIconAndColor(categoryName: string): { icon: React.ElementType; color: string } {
  const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
    'basics_core_language': { icon: Clipboard, color: 'from-blue-500 to-indigo-600' },
    'identity_personal_life': { icon: User, color: 'from-purple-500 to-pink-600' },
    'home_local_area': { icon: Home, color: 'from-green-500 to-teal-600' },
    'school_jobs_future': { icon: GraduationCap, color: 'from-orange-500 to-red-600' },
    'free_time_leisure': { icon: Gamepad2, color: 'from-yellow-500 to-orange-600' },
    'food_drink': { icon: Utensils, color: 'from-red-500 to-pink-600' },
    'clothes_shopping': { icon: Shirt, color: 'from-pink-500 to-rose-600' },
    'technology_media': { icon: Laptop, color: 'from-gray-500 to-slate-600' },
    'health_lifestyle': { icon: Stethoscope, color: 'from-emerald-500 to-teal-600' },
    'holidays_travel_culture': { icon: Plane, color: 'from-sky-500 to-blue-600' },
    'nature_environment': { icon: Leaf, color: 'from-lime-500 to-green-600' },
    'social_global_issues': { icon: Globe, color: 'from-cyan-500 to-blue-600' },
    'general_concepts': { icon: Lightbulb, color: 'from-amber-500 to-yellow-600' },
    'daily_life': { icon: Clock, color: 'from-indigo-500 to-purple-600' },
  };

  // Default fallback
  return iconMap[categoryName] || { icon: Target, color: 'from-gray-500 to-gray-600' };
}

/**
 * Get available tiers for a specific exam board
 */
export async function fetchAvailableTiers(examBoard: 'AQA' | 'edexcel'): Promise<string[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('centralized_vocabulary')
      .select('tier')
      .eq('exam_board_code', examBoard)
      .not('tier', 'is', null);

    if (error) {
      console.error('Error fetching tiers:', error);
      return ['foundation', 'higher']; // fallback
    }

    const tiers = [...new Set(data.map(item => item.tier))].filter(tier => tier !== 'both');
    return tiers.length > 0 ? tiers : ['foundation', 'higher'];
  } catch (error) {
    console.error('Error fetching tiers:', error);
    return ['foundation', 'higher']; // fallback
  }
}
