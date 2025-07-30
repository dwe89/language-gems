import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cache for categories - in production, consider using Redis or similar
let categoriesCache: {
  ks3: any[];
  ks4: any[];
  lastUpdated: number;
} | null = null;



const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

// Helper function to format display names
const formatDisplayName = (str: string): string => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to get category icons
const getCategoryIcon = (categoryId: string): string => {
  const icons: Record<string, string> = {
    'clothes_shopping': '👕',
    'daily_life': '🏃',
    'food_drink': '🍽️',
    'free_time_leisure': '🎮',
    'health_lifestyle': '⚕️',
    'holidays_travel_culture': '✈️',
    'home_local_area': '🏠',
    'identity_personal_life': '👤',
    'nature_environment': '🌿',
    'school_jobs_future': '🎓',
    'social_global_issues': '🌍',
    'technology_media': '📱'
  };
  return icons[categoryId] || '📚';
};

async function loadCategoriesFromDatabase() {
  try {
    // Define categories and subcategories suitable for reading comprehension
    const readingComprehensionCategories = {
      'clothes_shopping': ['clothes_accessories'],
      'daily_life': ['daily_routine'],
      'food_drink': ['food_drink_vocabulary', 'meals', 'ordering_cafes_restaurants'],
      'free_time_leisure': ['hobbies_interests', 'social_activities', 'sports_ball_games', 'sports_indoor', 'sports_outdoor'],
      'health_lifestyle': ['at_the_doctors', 'healthy_living', 'parts_of_body'],
      'holidays_travel_culture': ['accommodation', 'countries', 'festivals_celebrations', 'holiday_activities', 'nationalities', 'transport', 'travel_destinations_types', 'weathers'],
      'home_local_area': ['chores', 'directions', 'furniture', 'household_items', 'house_rooms', 'places_in_town'],
      'identity_personal_life': ['family_friends', 'feelings_emotions', 'personal_information', 'pets', 'physical_personality_descriptions', 'relationships'],
      'nature_environment': ['environmental_issues', 'farm_animals', 'insects_bugs', 'landscapes_features', 'plants', 'sea_animals', 'seasons', 'wild_animals'],
      'school_jobs_future': ['classroom_objects', 'future_ambitions', 'professions_jobs', 'qualities_skills', 'school_life', 'school_rules', 'school_subjects'],
      'social_global_issues': ['current_affairs_world_events', 'global_problems_solutions', 'human_rights', 'social_issues'],
      'technology_media': ['film', 'internet_digital_devices', 'mobile_phones_social_media', 'music', 'online_safety', 'tv']
    };

    // Load KS3 categories from database to verify they exist
    // Handle pagination to get all records (Supabase has a 1000 record default limit)
    let allKs3Categories: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data: batch, error: batchError } = await supabase
        .from('centralized_vocabulary')
        .select('category, subcategory')
        .eq('curriculum_level', 'KS3')
        .not('category', 'is', null)
        .not('subcategory', 'is', null)
        .range(from, from + batchSize - 1);

      if (batchError) throw batchError;

      if (batch && batch.length > 0) {
        allKs3Categories = allKs3Categories.concat(batch);
        from += batchSize;
        hasMore = batch.length === batchSize; // Continue if we got a full batch
      } else {
        hasMore = false;
      }
    }

    const ks3Categories = allKs3Categories;
    const ks3Error = null;

    if (ks3Error) throw ks3Error;

    // Create a set of existing category-subcategory combinations from database
    const existingCombinations = new Set<string>();
    ks3Categories?.forEach((item: any) => {
      existingCombinations.add(`${item.category}:${item.subcategory}`);
    });

    // Build formatted categories only for those suitable for reading comprehension
    const formattedKS3Categories = Object.entries(readingComprehensionCategories).map(([categoryId, allowedSubcategories]) => {
      // Filter subcategories to only include those that exist in the database
      const existingSubcategories = allowedSubcategories.filter(subcategoryId =>
        existingCombinations.has(`${categoryId}:${subcategoryId}`)
      );

      // Only include category if it has at least one existing subcategory
      if (existingSubcategories.length === 0) {
        return null;
      }

      const subcategories = existingSubcategories.map(subcategoryId => ({
        id: subcategoryId,
        name: subcategoryId,
        displayName: formatDisplayName(subcategoryId),
        categoryId
      }));

      return {
        id: categoryId,
        name: categoryId,
        displayName: formatDisplayName(categoryId),
        icon: getCategoryIcon(categoryId),
        subcategories
      };
    }).filter(Boolean); // Remove null entries

    // Load KS4 themes
    const { data: ks4Themes, error: ks4Error } = await supabase
      .from('centralized_vocabulary')
      .select('category, subcategory, theme_name')
      .eq('curriculum_level', 'KS4')
      .not('theme_name', 'is', null);

    if (ks4Error) throw ks4Error;

    // Group KS4 themes
    const themeMap = new Map<string, Set<string>>();
    ks4Themes?.forEach((item: any) => {
      if (!themeMap.has(item.theme_name)) {
        themeMap.set(item.theme_name, new Set());
      }
      themeMap.get(item.theme_name)?.add(item.subcategory);
    });

    const formattedKS4Themes = Array.from(themeMap.entries()).map(([themeName, topicSet]) => ({
      name: themeName,
      topics: Array.from(topicSet).map(topic => ({
        id: topic.toLowerCase().replace(/\s+/g, '_'),
        name: topic
      }))
    }));

    return {
      ks3: formattedKS3Categories,
      ks4: formattedKS4Themes
    };

  } catch (error) {
    console.error('Error loading categories from database:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (categoriesCache && (now - categoriesCache.lastUpdated) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        categories: categoriesCache,
        cached: true
      });
    }

    // Load fresh data from database
    const categories = await loadCategoriesFromDatabase();
    
    // Update cache
    categoriesCache = {
      ...categories,
      lastUpdated: now
    };

    return NextResponse.json({
      success: true,
      categories: categoriesCache,
      cached: false
    });

  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load categories',
        categories: null
      },
      { status: 500 }
    );
  }
}
