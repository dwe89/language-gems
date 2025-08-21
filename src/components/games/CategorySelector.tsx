'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, BookOpen, Gamepad2, Target, Home, User, Clipboard } from 'lucide-react';
import { KS3_SPANISH_CATEGORIES, Category, Subcategory } from '../../utils/categories';

interface CategorySelectorProps {
  onCategorySelect: (categoryId: string, subcategoryId: string | null) => void;
  selectedLanguage?: string;
}

// Create a universal category structure that uses ONLY the exact standard categories
const UNIVERSAL_CATEGORIES: Category[] = [
  {
    id: 'basics_core_language',
    name: 'basics_core_language', 
    displayName: 'Basics & Core Language',
    icon: '📝',
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
    displayName: 'School, Jobs & Future',
    icon: '�',
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
      { id: 'ordering_cafes_restaurants', name: 'ordering_cafes_restaurants', displayName: 'Ordering at Cafes & Restaurants', categoryId: 'food_drink' },
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
    icon: '🏥',
    subcategories: [
      { id: 'parts_of_body', name: 'parts_of_body', displayName: 'Parts of Body', categoryId: 'health_lifestyle' },
      { id: 'illnesses_symptoms', name: 'illnesses_symptoms', displayName: 'Illnesses & Symptoms', categoryId: 'health_lifestyle' },
      { id: 'at_the_doctors', name: 'at_the_doctors', displayName: 'At the Doctors', categoryId: 'health_lifestyle' },
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
      { id: 'spanish_speaking_countries_traditions', name: 'spanish_speaking_countries_traditions', displayName: 'Spanish Speaking Countries & Traditions', categoryId: 'holidays_travel_culture' },
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

export default function CategorySelector({ onCategorySelect, selectedLanguage = 'es' }: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  // Use universal categories that work across languages
  const categoriesData = UNIVERSAL_CATEGORIES;

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowSubcategories(true);
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    onCategorySelect(selectedCategory!.id, subcategory.id);
  };

  const handleAllCategoryClick = () => {
    onCategorySelect(selectedCategory!.id, null);
  };

  const goBack = () => {
    setSelectedCategory(null);
    setShowSubcategories(false);
  };

  // Get language display name
  const getLanguageDisplay = () => {
    const languageMap: Record<string, string> = {
      'es': 'Spanish',
      'fr': 'French', 
      'de': 'German'
    };
    return languageMap[selectedLanguage] || 'Spanish';
  };

  const iconFromEmoji = (icon?: string) => {
    if (!icon) return <BookOpen className="h-8 w-8 inline-block" />;
    if (icon.includes('🎮')) return <Gamepad2 className="h-8 w-8 inline-block" />;
    if (icon.includes('📚')) return <BookOpen className="h-8 w-8 inline-block" />;
    if (icon.includes('📝')) return <Clipboard className="h-8 w-8 inline-block" />;
    if (icon.includes('👤')) return <User className="h-8 w-8 inline-block" />;
    if (icon.includes('🏠')) return <Home className="h-8 w-8 inline-block" />;
    if (icon.includes('✈') || icon.includes('🚀')) return <Target className="h-8 w-8 inline-block" />;
    return <BookOpen className="h-8 w-8 inline-block" />;
  };

  if (showSubcategories && selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {iconFromEmoji(selectedCategory.icon)} {selectedCategory.displayName}
          </h1>
          <p className="text-slate-600">Choose a specific topic to practice in {getLanguageDisplay()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* All Category Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            onClick={handleAllCategoryClick}
          >
            <div className="text-3xl mb-3"><Target className="mx-auto h-8 w-8 text-white mb-3" /></div>
            <h3 className="text-xl font-semibold mb-2">All Topics</h3>
            <p className="text-purple-100 text-sm">Practice all vocabulary from this category</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium">Mixed Practice</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Individual Subcategories */}
          {selectedCategory.subcategories.map((subcategory, index) => (
            <motion.div
              key={subcategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 border border-slate-200"
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              <div className="text-2xl mb-3"><BookOpen className="mx-auto h-6 w-6 text-slate-700 mb-3" /></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {subcategory.displayName}
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Practice vocabulary specific to this topic
              </p>
              <div className="flex items-center justify-between text-indigo-600">
                <span className="text-sm font-medium">Start Practice</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Choose Your {getLanguageDisplay()} Topic
        </h1>
        <p className="text-xl text-slate-600">
          Select a category to start practicing vocabulary
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoriesData.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 border border-slate-200"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="text-4xl mb-4">{iconFromEmoji(category.icon)}</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              {category.displayName}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {category.subcategories.length} topics available
            </p>
            <div className="flex items-center justify-between text-indigo-600">
              <span className="text-sm font-medium">Explore Topics</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
