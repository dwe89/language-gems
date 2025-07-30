'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  Target,
  Star,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { readingComprehensionContent } from '../../data/reading-comprehension-content';

// Define the Category and Subcategory interfaces based on user's provided structure
interface KSCategory {
  id: string;
  name: string; // This is the internal name like 'basics_core_language'
  displayName: string; // This is the user-friendly name
  icon: string;
  subcategories: KSSubcategory[];
}

interface KSSubcategory {
  id: string;
  name: string; // Internal name
  displayName: string; // User-friendly name
  categoryId: string;
}

// User's provided KS3 Spanish Categories
const KS3_SPANISH_CATEGORIES: KSCategory[] = [
  {
    id: 'basics_core_language',
    name: 'basics_core_language',
    displayName: 'Basics & Core Language',
    icon: '💬',
    subcategories: [
      { id: 'greetings_introductions', name: 'greetings_introductions', displayName: 'Greetings & Introductions', categoryId: 'basics_core_language' },
      { id: 'common_phrases', name: 'common_phrases', displayName: 'Common Phrases', categoryId: 'basics_core_language' },
      { id: 'opinions', name: 'opinions', displayName: 'Opinions', categoryId: 'basics_core_language' },
      { id: 'numbers_1_30', name: 'numbers_1_30', displayName: 'Numbers 1-30', categoryId: 'basics_core_language' },
      { id: 'numbers_40_100', name: 'numbers_40_100', displayName: 'Numbers 40-100', categoryId: 'basics_core_language' },
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


// Data structure for AQA themes and topics
const AQA_THEMES_TOPICS = {
  'theme_1_people_lifestyle': {
    name: 'Theme 1: People and lifestyle',
    topics: [
      { id: 'identity_relationships', name: 'Topic 1: Identity and relationships with others' },
      { id: 'healthy_living', name: 'Topic 2: Healthy living and lifestyle' },
      { id: 'education_work', name: 'Topic 3: Education and work' },
    ]
  },
  'theme_2_popular_culture': {
    name: 'Theme 2: Popular culture',
    topics: [
      { id: 'free_time_activities', name: 'Topic 1: Free-time activities' },
      { id: 'customs_festivals', name: 'Topic 2: Customs, festivals and celebrations' },
      { id: 'celebrity_culture', name: 'Topic 3: Celebrity culture' },
    ]
  },
  'theme_3_communication_world': {
    name: 'Theme 3: Communication and the world around us',
    topics: [
      { id: 'travel_tourism', name: 'Topic 1: Travel and tourism, including places of interest' },
      { id: 'media_technology', name: 'Topic 2: Media and technology' },
      { id: 'environment_where_people_live', name: 'Topic 3: The environment and where people live' },
    ]
  }
};

export default function ReadingComprehensionPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'spanish' | 'french' | 'german'>('spanish');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<string>(''); // New state for curriculum level
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>(''); // New state for exam board
  const [selectedThemeTopic, setSelectedThemeTopic] = useState<string>(''); // New state for theme/topic
  const [searchTerm, setSearchTerm] = useState('');

  // Get available categories and subcategories from content
  const getCategories = (): (KSCategory)[] => {
    // If KS3 is selected, use the static KS3_SPANISH_CATEGORIES
    if (selectedCurriculumLevel === 'ks3') {
      return KS3_SPANISH_CATEGORIES;
    }

    // If KS4 or no level is selected, return an empty array for categories
    // as categories are only relevant for KS3 now.
    return [];
  };


  // Helper to format category names, prioritizing displayName if available (for KS3 categories)
  const formatCategoryName = (category: string, isKS3: boolean = false): string => {
    if (isKS3) {
      // Find the category in KS3_SPANISH_CATEGORIES by its ID and return its displayName
      const ks3Category = KS3_SPANISH_CATEGORIES.find(cat => cat.id === category);
      return ks3Category ? ks3Category.displayName : category;
    }
    // Fallback for non-KS3 categories (old logic, though not used for display now)
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to format subcategory names, prioritizing displayName if available (for KS3 subcategories)
  const formatSubcategoryName = (subcategory: string, categoryId: string, isKS3: boolean = false): string => {
    if (isKS3) {
      const ks3Category = KS3_SPANISH_CATEGORIES.find(cat => cat.id === categoryId);
      const ks3Subcategory = ks3Category?.subcategories.find(sub => sub.id === subcategory);
      return ks3Subcategory ? ks3Subcategory.displayName : subcategory;
    }
    // Fallback for non-KS3 subcategories (old logic, though not used for display now)
    return subcategory
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to get category description (will be empty for KS3 as per new data structure)
  const getCategoryDescription = (category: string, isKS3: boolean = false): string => {
    if (isKS3) {
      // KS3 categories do not have a 'description' field in the provided data
      return '';
    }
    const descriptions: Record<string, string> = {
      'food_drink': 'Texts about food, drinks, restaurants and eating habits',
      'home_local_area': 'Descriptions of places, landmarks and urban life',
      'school_jobs_future': 'School life, daily routines and educational experiences',
      'identity_personal_life': 'Family relationships, friendships and celebrations',
      'free_time_leisure': 'Leisure activities, sports and hobbies',
      'holidays_travel_culture': 'Travel, holidays and tourist experiences',
      'nature_environment': 'Environment, nature and sustainability',
      'technology_media': 'Technology, social media and digital life',
      'basics_core_language': 'Core language elements and basic communication',
      'health_lifestyle': 'Health, lifestyle and wellbeing topics',
      'social_global_issues': 'Social issues and global problems'
    };
    return descriptions[category] || 'Reading comprehension texts';
  };

  // Helper to get subcategory description (will be empty for KS3 as per new data structure)
  const getSubcategoryDescription = (subcategory: string, isKS3: boolean = false): string => {
    if (isKS3) {
      // KS3 subcategories do not have a 'description' field in the provided data
      return '';
    }
    const descriptions: Record<string, string> = {
      'ordering_cafes_restaurants': 'Situations in cafes and restaurants, ordering food',
      'food_drink_vocabulary': 'Food and drink vocabulary and experiences',
      'meals': 'Meal times and family dining experiences',
      'places_in_town': 'Town landmarks and important places',
      'school_life': 'Daily school routines and educational experiences',
      'family_friends': 'Family relationships and celebrations',
      'daily_routine': 'Daily routines and schedules',
      'hobbies_interests': 'Hobbies and personal interests',
      'sports_outdoor': 'Outdoor sports and activities',
      'countries': 'Countries and travel destinations',
      'transport': 'Transportation and travel methods',
      'environmental_issues': 'Climate change and environmental problems'
    };
    return descriptions[subcategory] || 'Specialized texts';
  };

  // Helper to get category icon, prioritizing icon from KS3 data if available
  const getCategoryIcon = (category: string, isKS3: boolean = false): string => {
    if (isKS3) {
      const ks3Category = KS3_SPANISH_CATEGORIES.find(cat => cat.id === category);
      return ks3Category ? ks3Category.icon : '📚'; // Fallback icon
    }
    const icons: Record<string, string> = {
      'food_drink': '🍽️',
      'home_local_area': '🏛️',
      'school_jobs_future': '🎓',
      'identity_personal_life': '👨‍👩‍👧‍👦',
      'free_time_leisure': '⚽',
      'holidays_travel_culture': '✈️',
      'nature_environment': '🌱',
      'technology_media': '💻',
      'basics_core_language': '�',
      'health_lifestyle': '💪',
      'social_global_issues': '🌍'
    };
    return icons[category] || '📚';
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      'foundation': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'higher': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handleStartTask = () => {
    const params = new URLSearchParams({
      language: selectedLanguage,
      ...(selectedCurriculumLevel && { curriculumLevel: selectedCurriculumLevel }),
      ...(selectedExamBoard && { examBoard: selectedExamBoard }),
      ...(selectedThemeTopic && { themeTopic: selectedThemeTopic }),
      // Only add category and subcategory if KS4 is NOT selected
      ...(selectedCurriculumLevel !== 'ks4' && selectedCategory && { category: selectedCategory }),
      ...(selectedCurriculumLevel !== 'ks4' && selectedSubcategory && { subcategory: selectedSubcategory }),
      ...(selectedDifficulty && { difficulty: selectedDifficulty }),
    });

    router.push(`/reading-comprehension/task?${params.toString()}`);
  };

  const categories = getCategories();
  // No need to filter categories for display grid anymore, as it's removed.
  // The filtering for the dropdowns is handled implicitly by `getCategories`.

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Reading Comprehension</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Improve your reading skills with authentic texts organized by topics and levels
          </p>
        </div>

        {/* Language and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'spanish' | 'french' | 'german')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

            {/* Curriculum Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Level
              </label>
              <select
                value={selectedCurriculumLevel}
                onChange={(e) => {
                  setSelectedCurriculumLevel(e.target.value);
                  setSelectedExamBoard(''); // Reset exam board when curriculum level changes
                  setSelectedThemeTopic(''); // Reset theme/topic when curriculum level changes
                  setSelectedCategory(''); // Reset category when curriculum level changes
                  setSelectedSubcategory(''); // Reset subcategory when curriculum level changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="ks3">KS3</option>
                <option value="ks4">KS4</option>
              </select>
            </div>

            {/* Exam Board Filter (visible only for KS4) */}
            {selectedCurriculumLevel === 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Board
                </label>
                <select
                  value={selectedExamBoard}
                  onChange={(e) => {
                    setSelectedExamBoard(e.target.value);
                    setSelectedThemeTopic(''); // Reset theme/topic when exam board changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Boards</option>
                  <option value="aqa">AQA</option>
                  <option value="edexcel">Edexcel</option>
                </select>
              </div>
            )}

            {/* AQA Themes and Topics Filter (visible only for AQA) */}
            {selectedExamBoard === 'aqa' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AQA Theme/Topic
                </label>
                <select
                  value={selectedThemeTopic}
                  onChange={(e) => setSelectedThemeTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Themes/Topics</option>
                  {Object.entries(AQA_THEMES_TOPICS).map(([themeId, theme]) => (
                    <optgroup key={themeId} label={theme.name}>
                      {theme.topics.map(topic => (
                        <option key={topic.id} value={`${themeId}_${topic.id}`}>
                          {topic.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Category Filter (visible only if KS4 is NOT selected) */}
            {selectedCurriculumLevel !== 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory(''); // Reset subcategory when category changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {getCategoryIcon(category.id, selectedCurriculumLevel === 'ks3')} {formatCategoryName(category.id, selectedCurriculumLevel === 'ks3')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subcategory Filter (visible only if KS4 is NOT selected) */}
            {selectedCurriculumLevel !== 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">All subcategories</option>
                  {selectedCategory && categories
                    .find(cat => cat.id === selectedCategory)
                    ?.subcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {formatSubcategoryName(subcategory.id, selectedCategory, selectedCurriculumLevel === 'ks3')}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All difficulties</option>
                <option value="foundation">Foundation</option>
                <option value="intermediate">Intermediate</option>
                <option value="higher">Higher</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStartTask}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Target className="h-5 w-5 mr-2" />
              Start Reading Task
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {selectedCurriculumLevel === 'ks3' ? KS3_SPANISH_CATEGORIES.reduce((sum, cat) => sum + cat.subcategories.length, 0) : readingComprehensionContent.texts[selectedLanguage]?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Available Texts</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {selectedCurriculumLevel === 'ks3' ? KS3_SPANISH_CATEGORIES.length : 0} {/* Updated to 0 for non-KS3 */}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {selectedCurriculumLevel === 'ks3' ? KS3_SPANISH_CATEGORIES.reduce((sum, cat) => sum + cat.subcategories.length, 0) : 0} {/* Updated to 0 for non-KS3 */}
              </div>
              <div className="text-sm text-gray-600">Subcategories</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {readingComprehensionContent.questions[selectedLanguage]?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}