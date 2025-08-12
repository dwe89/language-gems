/**
 * Mapping from sentence game categories to sentences table category/subcategory pairs
 * This ensures sentence-based games (Lava Temple, Case File Translator) use the correct
 * category/subcategory combinations from the sentences table.
 */

export interface SentenceCategoryMapping {
  category: string;
  subcategory: string;
}

export const SENTENCE_CATEGORY_MAPPINGS: SentenceCategoryMapping[] = [
  {
    "category": "social_global_issues",
    "subcategory": "human_rights"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "school_rules"
  },
  {
    "category": "technology_media",
    "subcategory": "mobile_phones_social_media"
  },
  {
    "category": "nature_environment",
    "subcategory": "environmental_issues"
  },
  {
    "category": "basics_core_language",
    "subcategory": "colours"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "transport"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "professions_jobs"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "accommodation"
  },
  {
    "category": "basics_core_language",
    "subcategory": "greetings_core_language"
  },
  {
    "category": "technology_media",
    "subcategory": "online_safety"
  },
  {
    "category": "health_lifestyle",
    "subcategory": "parts_of_body"
  },
  {
    "category": "food_drink",
    "subcategory": "ordering_cafes_restaurants"
  },
  {
    "category": "free_time_leisure",
    "subcategory": "sports_indoor"
  },
  {
    "category": "daily_life",
    "subcategory": "daily_routine"
  },
  {
    "category": "home_local_area",
    "subcategory": "places_in_town"
  },
  {
    "category": "basics_core_language",
    "subcategory": "shapes"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "adjective"
  },
  {
    "category": "home_local_area",
    "subcategory": "furniture"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "festivals_celebrations"
  },
  {
    "category": "basics_core_language",
    "subcategory": "question_words"
  },
  {
    "category": "nature_environment",
    "subcategory": "insects_bugs"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "school_life"
  },
  {
    "category": "nature_environment",
    "subcategory": "landscapes_features"
  },
  {
    "category": "basics_core_language",
    "subcategory": "opinions"
  },
  {
    "category": "identity_personal_life",
    "subcategory": "feelings_emotions"
  },
  {
    "category": "basics_core_language",
    "subcategory": "numbers_beyond_100"
  },
  {
    "category": "health_lifestyle",
    "subcategory": "at_the_doctors"
  },
  {
    "category": "basics_core_language",
    "subcategory": "ordinal_numbers"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "qualities_skills"
  },
  {
    "category": "nature_environment",
    "subcategory": "farm_animals"
  },
  {
    "category": "basics_core_language",
    "subcategory": "qualifiers_intensifiers"
  },
  {
    "category": "basics_core_language",
    "subcategory": "months"
  },
  {
    "category": "home_local_area",
    "subcategory": "directions_prepositions"
  },
  {
    "category": "home_local_area",
    "subcategory": "chores"
  },
  {
    "category": "free_time_leisure",
    "subcategory": "hobbies_interests"
  },
  {
    "category": "social_global_issues",
    "subcategory": "current_affairs_world_events"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "countries"
  },
  {
    "category": "nature_environment",
    "subcategory": "sea_animals"
  },
  {
    "category": "basics_core_language",
    "subcategory": "general_prepositions"
  },
  {
    "category": "identity_personal_life",
    "subcategory": "family_friends"
  },
  {
    "category": "home_local_area",
    "subcategory": "household_items"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "future_ambitions"
  },
  {
    "category": "free_time_leisure",
    "subcategory": "social_activities"
  },
  {
    "category": "general_concepts",
    "subcategory": "measurements_quantities"
  },
  {
    "category": "food_drink",
    "subcategory": "meals"
  },
  {
    "category": "free_time_leisure",
    "subcategory": "hobbies_interests_1st_person"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "nationalities"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "classroom_objects"
  },
  {
    "category": "basics_core_language",
    "subcategory": "reflexive_verbs"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "travel_destinations_types"
  },
  {
    "category": "basics_core_language",
    "subcategory": "numbers_40_100"
  },
  {
    "category": "identity_personal_life",
    "subcategory": "physical_personality_descriptions"
  },
  {
    "category": "basics_core_language",
    "subcategory": "comparatives_superlatives"
  },
  {
    "category": "basics_core_language",
    "subcategory": "object_descriptions"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "noun"
  },
  {
    "category": "clothes_shopping",
    "subcategory": "clothes_accessories"
  },
  {
    "category": "nature_environment",
    "subcategory": "seasons"
  },
  {
    "category": "identity_personal_life",
    "subcategory": "pets"
  },
  {
    "category": "home_local_area",
    "subcategory": "directions"
  },
  {
    "category": "food_drink",
    "subcategory": "food_drink_vocabulary"
  },
  {
    "category": "identity_personal_life",
    "subcategory": "personal_information"
  },
  {
    "category": "basics_core_language",
    "subcategory": "conjunctions"
  },
  {
    "category": "basics_core_language",
    "subcategory": "common_regular_verbs"
  },
  {
    "category": "social_global_issues",
    "subcategory": "social_issues"
  },
  {
    "category": "social_global_issues",
    "subcategory": "global_problems_solutions"
  },
  {
    "category": "general_concepts",
    "subcategory": "materials"
  },
  {
    "category": "technology_media",
    "subcategory": "tv"
  },
  {
    "category": "basics_core_language",
    "subcategory": "common_irregular_verbs"
  },
  {
    "category": "basics_core_language",
    "subcategory": "common_adverbs"
  },
  {
    "category": "nature_environment",
    "subcategory": "plants"
  },
  {
    "category": "health_lifestyle",
    "subcategory": "healthy_living"
  },
  {
    "category": "basics_core_language",
    "subcategory": "demonstratives"
  },
  {
    "category": "technology_media",
    "subcategory": "internet_digital_devices"
  },
  {
    "category": "free_time_leisure",
    "subcategory": "sports_outdoor"
  },
  {
    "category": "technology_media",
    "subcategory": "film"
  },
  {
    "category": "free_time_leisure",
    "subcategory": "sports_ball_games"
  },
  {
    "category": "nature_environment",
    "subcategory": "wild_animals"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "weathers"
  },
  {
    "category": "basics_core_language",
    "subcategory": "pronouns"
  },
  {
    "category": "basics_core_language",
    "subcategory": "time_sequencers"
  },
  {
    "category": "identity_personal_life",
    "subcategory": "relationships"
  },
  {
    "category": "basics_core_language",
    "subcategory": "telling_time"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "learning_work_verbs"
  },
  {
    "category": "basics_core_language",
    "subcategory": "greetings_introductions"
  },
  {
    "category": "basics_core_language",
    "subcategory": "days"
  },
  {
    "category": "basics_core_language",
    "subcategory": "numbers_1_30"
  },
  {
    "category": "school_jobs_future",
    "subcategory": "school_subjects"
  },
  {
    "category": "basics_core_language",
    "subcategory": "common_phrases"
  },
  {
    "category": "technology_media",
    "subcategory": "music"
  },
  {
    "category": "home_local_area",
    "subcategory": "house_rooms"
  },
  {
    "category": "holidays_travel_culture",
    "subcategory": "holiday_activities"
  }
];

/**
 * Get all unique categories from the sentence mappings
 */
export function getSentenceCategories(): string[] {
  const categories = new Set(SENTENCE_CATEGORY_MAPPINGS.map(m => m.category));
  return Array.from(categories).sort();
}

/**
 * Get subcategories for a specific category
 */
export function getSentenceSubcategories(category: string): string[] {
  return SENTENCE_CATEGORY_MAPPINGS
    .filter(m => m.category === category)
    .map(m => m.subcategory)
    .sort();
}

/**
 * Check if a category/subcategory combination exists in the sentences table
 */
export function isValidSentenceCategoryPair(category: string, subcategory: string): boolean {
  return SENTENCE_CATEGORY_MAPPINGS.some(m => 
    m.category === category && m.subcategory === subcategory
  );
}
