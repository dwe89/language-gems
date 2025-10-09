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
 * NOTE: Currently returns hardcoded categories as centralized_vocabulary table doesn't exist
 */
export async function fetchKS3Categories(): Promise<DatabaseCategory[]> {
  // Return hardcoded KS3 categories
  // TODO: Replace with database query when centralized_vocabulary table is created
  const categories: DatabaseCategory[] = [
    {
      id: 'basics_core_language',
      name: 'basics_core_language',
      displayName: 'Basics & Core Language',
      icon: Book,
      color: 'from-blue-500 to-cyan-600',
      subcategories: [
        { id: 'greetings_introductions', name: 'greetings_introductions', displayName: 'Greetings & Introductions', categoryId: 'basics_core_language' },
        { id: 'common_phrases', name: 'common_phrases', displayName: 'Common Phrases', categoryId: 'basics_core_language' },
        { id: 'opinions', name: 'opinions', displayName: 'Opinions', categoryId: 'basics_core_language' },
        { id: 'numbers_1_30', name: 'numbers_1_30', displayName: 'Numbers 1-30', categoryId: 'basics_core_language' },
        { id: 'numbers_40_100', name: 'numbers_40_100', displayName: 'Numbers 40-100', categoryId: 'basics_core_language' },
        { id: 'colours', name: 'colours', displayName: 'Colours', categoryId: 'basics_core_language' },
        { id: 'days_months', name: 'days_months', displayName: 'Days & Months', categoryId: 'basics_core_language' }
      ]
    },
    {
      id: 'identity_personal_life',
      name: 'identity_personal_life',
      displayName: 'Identity & Personal Life',
      icon: User,
      color: 'from-purple-500 to-pink-600',
      subcategories: [
        { id: 'family_friends', name: 'family_friends', displayName: 'Family & Friends', categoryId: 'identity_personal_life' },
        { id: 'physical_descriptions', name: 'physical_descriptions', displayName: 'Physical Descriptions', categoryId: 'identity_personal_life' },
        { id: 'personality_character', name: 'personality_character', displayName: 'Personality & Character', categoryId: 'identity_personal_life' },
        { id: 'hobbies_interests', name: 'hobbies_interests', displayName: 'Hobbies & Interests', categoryId: 'identity_personal_life' },
        { id: 'daily_routine', name: 'daily_routine', displayName: 'Daily Routine', categoryId: 'identity_personal_life' }
      ]
    },
    {
      id: 'home_local_area',
      name: 'home_local_area',
      displayName: 'Home & Local Area',
      icon: Home,
      color: 'from-green-500 to-emerald-600',
      subcategories: [
        { id: 'house_rooms_furniture', name: 'house_rooms_furniture', displayName: 'House, Rooms & Furniture', categoryId: 'home_local_area' },
        { id: 'household_items_chores', name: 'household_items_chores', displayName: 'Household Items & Chores', categoryId: 'home_local_area' },
        { id: 'local_area_facilities', name: 'local_area_facilities', displayName: 'Local Area & Facilities', categoryId: 'home_local_area' },
        { id: 'directions', name: 'directions', displayName: 'Directions', categoryId: 'home_local_area' }
      ]
    },
    {
      id: 'school_jobs_future',
      name: 'school_jobs_future',
      displayName: 'School, Jobs & Future',
      icon: GraduationCap,
      color: 'from-yellow-500 to-orange-600',
      subcategories: [
        { id: 'school_subjects', name: 'school_subjects', displayName: 'School Subjects', categoryId: 'school_jobs_future' },
        { id: 'school_facilities_activities', name: 'school_facilities_activities', displayName: 'School Facilities & Activities', categoryId: 'school_jobs_future' },
        { id: 'jobs_careers', name: 'jobs_careers', displayName: 'Jobs & Careers', categoryId: 'school_jobs_future' },
        { id: 'future_plans', name: 'future_plans', displayName: 'Future Plans', categoryId: 'school_jobs_future' }
      ]
    },
    {
      id: 'food_drink',
      name: 'food_drink',
      displayName: 'Food & Drink',
      icon: Utensils,
      color: 'from-red-500 to-rose-600',
      subcategories: [
        { id: 'food_drink_vocabulary', name: 'food_drink_vocabulary', displayName: 'Food & Drink Vocabulary', categoryId: 'food_drink' },
        { id: 'meals_eating_out', name: 'meals_eating_out', displayName: 'Meals & Eating Out', categoryId: 'food_drink' },
        { id: 'healthy_eating', name: 'healthy_eating', displayName: 'Healthy Eating', categoryId: 'food_drink' }
      ]
    },
    {
      id: 'clothes_shopping',
      name: 'clothes_shopping',
      displayName: 'Clothes & Shopping',
      icon: Shirt,
      color: 'from-pink-500 to-fuchsia-600',
      subcategories: [
        { id: 'clothes_accessories', name: 'clothes_accessories', displayName: 'Clothes & Accessories', categoryId: 'clothes_shopping' },
        { id: 'shopping', name: 'shopping', displayName: 'Shopping', categoryId: 'clothes_shopping' }
      ]
    },
    {
      id: 'technology_media',
      name: 'technology_media',
      displayName: 'Technology & Media',
      icon: Laptop,
      color: 'from-indigo-500 to-blue-600',
      subcategories: [
        { id: 'technology_devices', name: 'technology_devices', displayName: 'Technology & Devices', categoryId: 'technology_media' },
        { id: 'social_media_communication', name: 'social_media_communication', displayName: 'Social Media & Communication', categoryId: 'technology_media' },
        { id: 'tv_films_music', name: 'tv_films_music', displayName: 'TV, Films & Music', categoryId: 'technology_media' }
      ]
    },
    {
      id: 'health_wellbeing',
      name: 'health_wellbeing',
      displayName: 'Health & Wellbeing',
      icon: Stethoscope,
      color: 'from-teal-500 to-cyan-600',
      subcategories: [
        { id: 'body_parts', name: 'body_parts', displayName: 'Body Parts', categoryId: 'health_wellbeing' },
        { id: 'health_illness', name: 'health_illness', displayName: 'Health & Illness', categoryId: 'health_wellbeing' },
        { id: 'sports_exercise', name: 'sports_exercise', displayName: 'Sports & Exercise', categoryId: 'health_wellbeing' }
      ]
    },
    {
      id: 'holidays_travel_culture',
      name: 'holidays_travel_culture',
      displayName: 'Holidays, Travel & Culture',
      icon: Plane,
      color: 'from-sky-500 to-blue-600',
      subcategories: [
        { id: 'holidays_accommodation', name: 'holidays_accommodation', displayName: 'Holidays & Accommodation', categoryId: 'holidays_travel_culture' },
        { id: 'transport', name: 'transport', displayName: 'Transport', categoryId: 'holidays_travel_culture' },
        { id: 'weather_seasons', name: 'weather_seasons', displayName: 'Weather & Seasons', categoryId: 'holidays_travel_culture' },
        { id: 'festivals_celebrations', name: 'festivals_celebrations', displayName: 'Festivals & Celebrations', categoryId: 'holidays_travel_culture' }
      ]
    },
    {
      id: 'nature_environment',
      name: 'nature_environment',
      displayName: 'Nature & Environment',
      icon: Leaf,
      color: 'from-lime-500 to-green-600',
      subcategories: [
        { id: 'animals', name: 'animals', displayName: 'Animals', categoryId: 'nature_environment' },
        { id: 'environment_sustainability', name: 'environment_sustainability', displayName: 'Environment & Sustainability', categoryId: 'nature_environment' }
      ]
    }
  ];

  return categories;
}

/**
 * Fetch KS4 themes and units from the database for a specific exam board
 * NOTE: Currently returns hardcoded themes as centralized_vocabulary table doesn't exist
 */
export async function fetchKS4Themes(examBoard: 'AQA' | 'edexcel'): Promise<KS4Theme[]> {
  // Return hardcoded KS4 themes based on exam board
  // TODO: Replace with database query when centralized_vocabulary table is created

  if (examBoard === 'AQA') {
    return [
      {
        id: 'identity_culture',
        name: 'identity_culture',
        displayName: 'Identity & Culture',
        icon: Globe,
        color: 'from-blue-600 to-indigo-700',
        units: [
          { id: 'me_family_friends', name: 'me_family_friends', displayName: 'Me, My Family & Friends', themeId: 'identity_culture' },
          { id: 'technology_social_media', name: 'technology_social_media', displayName: 'Technology & Social Media', themeId: 'identity_culture' },
          { id: 'free_time_activities', name: 'free_time_activities', displayName: 'Free-time Activities', themeId: 'identity_culture' }
        ]
      },
      {
        id: 'local_national_international',
        name: 'local_national_international',
        displayName: 'Local, National, International & Global Areas of Interest',
        icon: Earth,
        color: 'from-green-600 to-emerald-700',
        units: [
          { id: 'home_town_neighbourhood', name: 'home_town_neighbourhood', displayName: 'Home, Town, Neighbourhood & Region', themeId: 'local_national_international' },
          { id: 'social_issues', name: 'social_issues', displayName: 'Social Issues', themeId: 'local_national_international' },
          { id: 'global_issues', name: 'global_issues', displayName: 'Global Issues', themeId: 'local_national_international' }
        ]
      },
      {
        id: 'current_future_study_employment',
        name: 'current_future_study_employment',
        displayName: 'Current & Future Study & Employment',
        icon: GraduationCap,
        color: 'from-purple-600 to-pink-700',
        units: [
          { id: 'my_studies', name: 'my_studies', displayName: 'My Studies', themeId: 'current_future_study_employment' },
          { id: 'life_at_school', name: 'life_at_school', displayName: 'Life at School/College', themeId: 'current_future_study_employment' },
          { id: 'education_post_16', name: 'education_post_16', displayName: 'Education Post-16', themeId: 'current_future_study_employment' }
        ]
      }
    ];
  } else {
    // Edexcel themes
    return [
      {
        id: 'identity_culture',
        name: 'identity_culture',
        displayName: 'Identity & Culture',
        icon: Globe,
        color: 'from-blue-600 to-indigo-700',
        units: [
          { id: 'who_am_i', name: 'who_am_i', displayName: 'Who Am I?', themeId: 'identity_culture' },
          { id: 'daily_life', name: 'daily_life', displayName: 'Daily Life', themeId: 'identity_culture' },
          { id: 'cultural_life', name: 'cultural_life', displayName: 'Cultural Life', themeId: 'identity_culture' }
        ]
      },
      {
        id: 'local_national_international',
        name: 'local_national_international',
        displayName: 'Local, National, International & Global Areas of Interest',
        icon: Earth,
        color: 'from-green-600 to-emerald-700',
        units: [
          { id: 'holidays', name: 'holidays', displayName: 'Holidays', themeId: 'local_national_international' },
          { id: 'travel_tourism', name: 'travel_tourism', displayName: 'Travel & Tourism', themeId: 'local_national_international' },
          { id: 'my_region', name: 'my_region', displayName: 'My Region', themeId: 'local_national_international' }
        ]
      },
      {
        id: 'current_future_study_employment',
        name: 'current_future_study_employment',
        displayName: 'Current & Future Study & Employment',
        icon: GraduationCap,
        color: 'from-purple-600 to-pink-700',
        units: [
          { id: 'current_study', name: 'current_study', displayName: 'Current Study', themeId: 'current_future_study_employment' },
          { id: 'world_of_work', name: 'world_of_work', displayName: 'World of Work', themeId: 'current_future_study_employment' },
          { id: 'jobs_career_choices', name: 'jobs_career_choices', displayName: 'Jobs, Career Choices & Ambitions', themeId: 'current_future_study_employment' }
        ]
      }
    ];
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
