export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

export const KS3_SPANISH_CATEGORIES: Category[] = [
  {
    id: 'basics_core_language',
    name: 'basics_core_language',
    displayName: 'Basics & Core Language',
    icon: '💬',
    subcategories: [
      { id: 'greetings_introductions', name: 'greetings_introductions', displayName: 'Greetings & Introductions', categoryId: 'basics_core_language' },
      { id: 'common_phrases', name: 'common_phrases', displayName: 'Common Phrases', categoryId: 'basics_core_language' },
      { id: 'opinions', name: 'opinions', displayName: 'Opinions', categoryId: 'basics_core_language' },
      { id: 'numbers_1_20', name: 'numbers_1_20', displayName: 'Numbers 1-20', categoryId: 'basics_core_language' },
      { id: 'numbers_1_50', name: 'numbers_1_50', displayName: 'Numbers 1-50', categoryId: 'basics_core_language' },
      { id: 'numbers_1_100', name: 'numbers_1_100', displayName: 'Numbers 1-100', categoryId: 'basics_core_language' },
      { id: 'dates_time', name: 'dates_time', displayName: 'Dates & Time', categoryId: 'basics_core_language' },
      { id: 'colours', name: 'colours', displayName: 'Colours', categoryId: 'basics_core_language' },
      { id: 'days', name: 'days', displayName: 'Days', categoryId: 'basics_core_language' },
      { id: 'months', name: 'months', displayName: 'Months', categoryId: 'basics_core_language' }
    ]
  },
  {
    id: 'identity_personal_life',
    name: 'identity_personal_life',
    displayName: 'Identity & Personal Life',
    icon: '👤',
    subcategories: [
      { id: 'personal_information', name: 'personal_information', displayName: 'Personal Information', categoryId: 'identity_personal_life' },
      { id: 'family_friends', name: 'family_friends', displayName: 'Family & Friends', categoryId: 'identity_personal_life' },
      { id: 'physical_personality_descriptions', name: 'physical_personality_descriptions', displayName: 'Physical & Personality Descriptions', categoryId: 'identity_personal_life' },
      { id: 'pets', name: 'pets', displayName: 'Pets', categoryId: 'identity_personal_life' }
    ]
  },
  {
    id: 'home_local_area',
    name: 'home_local_area',
    displayName: 'Home & Local Area',
    icon: '🏠',
    subcategories: [
      { id: 'house_rooms_furniture', name: 'house_rooms_furniture', displayName: 'House, Rooms & Furniture', categoryId: 'home_local_area' },
      { id: 'household_items_chores', name: 'household_items_chores', displayName: 'Household Items & Chores', categoryId: 'home_local_area' },
      { id: 'types_of_housing', name: 'types_of_housing', displayName: 'Types of Housing', categoryId: 'home_local_area' },
      { id: 'local_area_places_town', name: 'local_area_places_town', displayName: 'Local Area & Places in Town', categoryId: 'home_local_area' },
      { id: 'shops_services', name: 'shops_services', displayName: 'Shops & Services', categoryId: 'home_local_area' },
      { id: 'directions_prepositions', name: 'directions_prepositions', displayName: 'Directions & Prepositions', categoryId: 'home_local_area' }
    ]
  },
  {
    id: 'school_jobs_future',
    name: 'school_jobs_future',
    displayName: 'School, Jobs & Future Plans',
    icon: '🎓',
    subcategories: [
      { id: 'school_subjects', name: 'school_subjects', displayName: 'School Subjects', categoryId: 'school_jobs_future' },
      { id: 'school_rules', name: 'school_rules', displayName: 'School Rules', categoryId: 'school_jobs_future' },
      { id: 'classroom_objects', name: 'classroom_objects', displayName: 'Classroom Objects', categoryId: 'school_jobs_future' },
      { id: 'daily_routine_school', name: 'daily_routine_school', displayName: 'Daily Routine at School', categoryId: 'school_jobs_future' },
      { id: 'professions_jobs', name: 'professions_jobs', displayName: 'Professions & Jobs', categoryId: 'school_jobs_future' },
      { id: 'future_ambitions', name: 'future_ambitions', displayName: 'Future Ambitions', categoryId: 'school_jobs_future' },
      { id: 'qualities_for_jobs', name: 'qualities_for_jobs', displayName: 'Qualities for Jobs', categoryId: 'school_jobs_future' }
    ]
  },
  {
    id: 'free_time_leisure',
    name: 'free_time_leisure',
    displayName: 'Free Time & Leisure',
    icon: '🎮',
    subcategories: [
      { id: 'hobbies_interests', name: 'hobbies_interests', displayName: 'Hobbies & Interests', categoryId: 'free_time_leisure' },
      { id: 'sports', name: 'sports', displayName: 'Sports', categoryId: 'free_time_leisure' },
      { id: 'social_activities', name: 'social_activities', displayName: 'Social Activities', categoryId: 'free_time_leisure' }
    ]
  },
  {
    id: 'food_drink',
    name: 'food_drink',
    displayName: 'Food & Drink',
    icon: '🍽️',
    subcategories: [
      { id: 'meals', name: 'meals', displayName: 'Meals', categoryId: 'food_drink' },
      { id: 'food_drink_vocabulary', name: 'food_drink_vocabulary', displayName: 'Food & Drink Vocabulary', categoryId: 'food_drink' },
      { id: 'ordering_cafes_restaurants', name: 'ordering_cafes_restaurants', displayName: 'Ordering in Cafés & Restaurants', categoryId: 'food_drink' },
      { id: 'shopping_for_food', name: 'shopping_for_food', displayName: 'Shopping for Food', categoryId: 'food_drink' }
    ]
  },
  {
    id: 'clothes_shopping',
    name: 'clothes_shopping',
    displayName: 'Clothes & Shopping',
    icon: '👕',
    subcategories: [
      { id: 'clothes_accessories', name: 'clothes_accessories', displayName: 'Clothes & Accessories', categoryId: 'clothes_shopping' },
      { id: 'shopping_phrases_prices', name: 'shopping_phrases_prices', displayName: 'Shopping Phrases & Prices', categoryId: 'clothes_shopping' }
    ]
  },
  {
    id: 'technology_media',
    name: 'technology_media',
    displayName: 'Technology & Media',
    icon: '📱',
    subcategories: [
      { id: 'mobile_phones_social_media', name: 'mobile_phones_social_media', displayName: 'Mobile Phones & Social Media', categoryId: 'technology_media' },
      { id: 'internet_digital_devices', name: 'internet_digital_devices', displayName: 'Internet & Digital Devices', categoryId: 'technology_media' },
      { id: 'tv', name: 'tv', displayName: 'TV', categoryId: 'technology_media' },
      { id: 'film', name: 'film', displayName: 'Film', categoryId: 'technology_media' },
      { id: 'music', name: 'music', displayName: 'Music', categoryId: 'technology_media' }
    ]
  },
  {
    id: 'health_lifestyle',
    name: 'health_lifestyle',
    displayName: 'Health & Lifestyle',
    icon: '⚕️',
    subcategories: [
      { id: 'parts_of_body', name: 'parts_of_body', displayName: 'Parts of the Body', categoryId: 'health_lifestyle' },
      { id: 'illnesses_symptoms', name: 'illnesses_symptoms', displayName: 'Illnesses & Symptoms', categoryId: 'health_lifestyle' },
      { id: 'at_the_doctors', name: 'at_the_doctors', displayName: 'At the Doctor\'s', categoryId: 'health_lifestyle' },
      { id: 'healthy_living', name: 'healthy_living', displayName: 'Healthy Living', categoryId: 'health_lifestyle' }
    ]
  },
  {
    id: 'holidays_travel_culture',
    name: 'holidays_travel_culture',
    displayName: 'Holidays, Travel & Culture',
    icon: '✈️',
    subcategories: [
      { id: 'countries', name: 'countries', displayName: 'Countries', categoryId: 'holidays_travel_culture' },
      { id: 'nationalities', name: 'nationalities', displayName: 'Nationalities', categoryId: 'holidays_travel_culture' },
      { id: 'transport', name: 'transport', displayName: 'Transport', categoryId: 'holidays_travel_culture' },
      { id: 'travel_phrases', name: 'travel_phrases', displayName: 'Travel Phrases', categoryId: 'holidays_travel_culture' },
      { id: 'accommodation', name: 'accommodation', displayName: 'Accommodation', categoryId: 'holidays_travel_culture' },
      { id: 'holiday_activities', name: 'holiday_activities', displayName: 'Holiday Activities', categoryId: 'holidays_travel_culture' },
      { id: 'weather_seasons', name: 'weather_seasons', displayName: 'Weather & Seasons', categoryId: 'holidays_travel_culture' },
      { id: 'spanish_speaking_countries_traditions', name: 'spanish_speaking_countries_traditions', displayName: 'Spanish-speaking Countries & Traditions', categoryId: 'holidays_travel_culture' },
      { id: 'festivals_celebrations', name: 'festivals_celebrations', displayName: 'Festivals & Celebrations', categoryId: 'holidays_travel_culture' }
    ]
  },
  {
    id: 'nature_environment',
    name: 'nature_environment',
    displayName: 'Nature & Environment',
    icon: '🌿',
    subcategories: [
      { id: 'animals', name: 'animals', displayName: 'Animals', categoryId: 'nature_environment' },
      { id: 'plants', name: 'plants', displayName: 'Plants', categoryId: 'nature_environment' },
      { id: 'environmental_problems', name: 'environmental_problems', displayName: 'Environmental Problems', categoryId: 'nature_environment' }
    ]
  },
  {
    id: 'social_global_issues',
    name: 'social_global_issues',
    displayName: 'Social & Global Issues',
    icon: '🌍',
    subcategories: [
      { id: 'social_issues', name: 'social_issues', displayName: 'Social Issues', categoryId: 'social_global_issues' },
      { id: 'human_rights', name: 'human_rights', displayName: 'Human Rights', categoryId: 'social_global_issues' },
      { id: 'global_problems_solutions', name: 'global_problems_solutions', displayName: 'Global Problems & Solutions', categoryId: 'social_global_issues' },
      { id: 'current_affairs_world_events', name: 'current_affairs_world_events', displayName: 'Current Affairs & World Events', categoryId: 'social_global_issues' }
    ]
  }
];

// Mapping existing database categories to KS3 categories
export const DATABASE_CATEGORY_MAPPING: { [key: string]: { category: string, subcategory?: string } } = {
  'animals': { category: 'nature_environment', subcategory: 'Animals' },
  'clothing': { category: 'clothes_shopping', subcategory: 'Clothes & Accessories' },
  'colors': { category: 'basics_core_language', subcategory: 'Colours' },
  'family': { category: 'identity_personal_life', subcategory: 'Family & Friends' },
  'food': { category: 'food_drink', subcategory: 'Food & Drink Vocabulary' },
  'furniture': { category: 'home_local_area', subcategory: 'House, Rooms & Furniture' },
  'household': { category: 'home_local_area', subcategory: 'Household Items & Chores' },
  'numbers': { category: 'basics_core_language', subcategory: 'Numbers 1-100' },
  'school': { category: 'school_jobs_future', subcategory: 'School Subjects' },
  'transport': { category: 'holidays_travel_culture', subcategory: 'Transport' },
  'weather': { category: 'holidays_travel_culture', subcategory: 'Weather & Seasons' }
};

// Reverse mapping - KS3 to database categories
export const KS3_TO_DATABASE_MAPPING: { [key: string]: string[] } = {
  'basics_core_language': ['colors', 'numbers'],
  'identity_personal_life': ['family'],
  'home_local_area': ['furniture', 'household'],
  'school_jobs_future': ['school'],
  'food_drink': ['food'],
  'clothes_shopping': ['clothing'],
  'holidays_travel_culture': ['transport', 'weather'],
  'nature_environment': ['animals']
};

// Get database categories for a KS3 category
export function getDatabaseCategories(ks3CategoryId: string): string[] {
  return KS3_TO_DATABASE_MAPPING[ks3CategoryId] || [];
}

// Get KS3 mapping for a database category
export function getKS3Mapping(databaseCategory: string): { category: string, subcategory?: string } | null {
  return DATABASE_CATEGORY_MAPPING[databaseCategory] || null;
}

// Helper functions for category management
export function getCategoryById(id: string): Category | undefined {
  return KS3_SPANISH_CATEGORIES.find(cat => cat.id === id);
}

export function getSubcategoryById(subcategoryId: string): Subcategory | undefined {
  for (const category of KS3_SPANISH_CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
    if (subcategory) return subcategory;
  }
  return undefined;
}

export function getSubcategoriesByCategory(categoryId: string): Subcategory[] {
  const category = getCategoryById(categoryId);
  return category?.subcategories || [];
}

export function getAllSubcategories(): Subcategory[] {
  return KS3_SPANISH_CATEGORIES.flatMap(cat => cat.subcategories);
}

// Generate category/subcategory options for forms
export function getCategoryOptions(): Array<{ value: string; label: string }> {
  return KS3_SPANISH_CATEGORIES.map(cat => ({
    value: cat.id,
    label: cat.displayName
  }));
}

export function getSubcategoryOptions(categoryId?: string): Array<{ value: string; label: string }> {
  if (!categoryId) return [];
  const category = getCategoryById(categoryId);
  return category?.subcategories.map(sub => ({
    value: sub.id,
    label: sub.displayName
  })) || [];
}
