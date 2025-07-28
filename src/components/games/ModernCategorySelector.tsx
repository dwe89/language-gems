'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  X,
  CheckCircle,
  Book,         // For KS3
  GraduationCap, // For KS4, School, Jobs & Future
  Clipboard,    // For Basics & Core Language
  User,         // For Identity & Personal Life
  Home,         // For Home & Local Area
  Gamepad,      // For Free Time & Leisure
  Utensils,     // For Food & Drink
  Shirt,        // For Clothes & Shopping
  Laptop,       // For Technology & Media
  Stethoscope,  // For Health & Lifestyle (replacing 🏥)
  Plane,        // For Holidays, Travel & Culture (replacing ✈️)
  Leaf,         // For Nature & Environment (replacing 🌿)
  Globe,        // For Social & Global Issues (replacing 🌍)
  Lightbulb,    // For General Concepts (replacing 💡)
  Clock,        // For Daily Life (replacing 🕐)
} from 'lucide-react';
import { getCategoriesByCurriculum, type CurriculumLevel } from './KS4CategorySystem';

// Define the comprehensive category structure with all your new categories
export interface Category {
  id: string;
  name: string;
  displayName: string;
  // Change icon type from string to React.ElementType for Lucide components
  icon: React.ElementType;
  color: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

// Curriculum levels - Assuming these are from your previous component and will be used or are implicitly passed
// If these are defined elsewhere (e.g., in a central config), you'd update them there.
const CURRICULUM_LEVELS_CONFIG = [
  {
    code: 'KS3' as const,
    name: 'KS3',
    displayName: 'Key Stage 3',
    description: 'Foundation language skills and basic vocabulary',
    ageRange: 'Ages 11-14',
    icon: Book, // Changed from 📚 to Lucide Book
    color: 'from-blue-500 to-indigo-600'
  },
  {
    code: 'KS4' as const,
    name: 'KS4 (GCSE)',
    displayName: 'Key Stage 4 (GCSE)',
    description: 'GCSE-level curriculum with foundation and higher tiers',
    ageRange: 'Ages 14-16',
    icon: GraduationCap, // Changed from 🎓 to Lucide GraduationCap
    color: 'from-purple-500 to-pink-600'
  }
];


// Complete category system with all your specified categories and subcategories
export const VOCABULARY_CATEGORIES: Category[] = [
  {
    id: 'basics_core_language',
    name: 'basics_core_language',
    displayName: 'Basics & Core Language',
    icon: Clipboard, // Changed from '📝' to Lucide Clipboard
    color: 'from-blue-500 to-indigo-600',
    subcategories: [
      { id: 'greetings_introductions', name: 'greetings_introductions', displayName: 'Greetings & Introductions', categoryId: 'basics_core_language' },
      { id: 'common_phrases', name: 'common_phrases', displayName: 'Common Phrases', categoryId: 'basics_core_language' },
      { id: 'opinions', name: 'opinions', displayName: 'Opinions', categoryId: 'basics_core_language' },
      { id: 'numbers_1_30', name: 'numbers_1_30', displayName: 'Numbers 1-30', categoryId: 'basics_core_language' },
      { id: 'numbers_31_50', name: 'numbers_31_50', displayName: 'Numbers 31-50', categoryId: 'basics_core_language' },
      { id: 'numbers_51_100', name: 'numbers_51_100', displayName: 'Numbers 51-100', categoryId: 'basics_core_language' },
      { id: 'numbers_beyond_100', name: 'numbers_beyond_100', displayName: 'Numbers Beyond 100', categoryId: 'basics_core_language' },
      { id: 'dates_time', name: 'dates_time', displayName: 'Dates & Time', categoryId: 'basics_core_language' },
      { id: 'colours', name: 'colours', displayName: 'Colours', categoryId: 'basics_core_language' },
      { id: 'days', name: 'days', displayName: 'Days', categoryId: 'basics_core_language' },
      { id: 'months', name: 'months', displayName: 'Months', categoryId: 'basics_core_language' },
      { id: 'shapes', name: 'shapes', displayName: 'Shapes', categoryId: 'basics_core_language' },
      { id: 'object_descriptions', name: 'object_descriptions', displayName: 'Object Descriptions', categoryId: 'basics_core_language' },
      { id: 'question_words', name: 'question_words', displayName: 'Question Words', categoryId: 'basics_core_language' },
      { id: 'pronouns', name: 'pronouns', displayName: 'Pronouns', categoryId: 'basics_core_language' },
      { id: 'common_adverbs', name: 'common_adverbs', displayName: 'Common Adverbs', categoryId: 'basics_core_language' },
      { id: 'general_prepositions', name: 'general_prepositions', displayName: 'General Prepositions', categoryId: 'basics_core_language' },
      { id: 'conjunctions', name: 'conjunctions', displayName: 'Conjunctions', categoryId: 'basics_core_language' },
      { id: 'time_sequencers', name: 'time_sequencers', displayName: 'Time Sequencers', categoryId: 'basics_core_language' },
      { id: 'common_regular_verbs', name: 'common_regular_verbs', displayName: 'Common Regular Verbs', categoryId: 'basics_core_language' },
      { id: 'common_irregular_verbs', name: 'common_irregular_verbs', displayName: 'Common Irregular Verbs', categoryId: 'basics_core_language' },
      { id: 'demonstratives', name: 'demonstratives', displayName: 'Demonstratives', categoryId: 'basics_core_language' },
      { id: 'comparatives_superlatives', name: 'comparatives_superlatives', displayName: 'Comparatives & Superlatives', categoryId: 'basics_core_language' },
      { id: 'reflexive_verbs', name: 'reflexive_verbs', displayName: 'Reflexive Verbs', categoryId: 'basics_core_language' },
      { id: 'telling_time', name: 'telling_time', displayName: 'Telling Time', categoryId: 'basics_core_language' },
      { id: 'ordinal_numbers', name: 'ordinal_numbers', displayName: 'Ordinal Numbers', categoryId: 'basics_core_language' }
    ]
  },
  {
    id: 'identity_personal_life',
    name: 'identity_personal_life',
    displayName: 'Identity & Personal Life',
    icon: User, // Changed from '👤' to Lucide User
    color: 'from-purple-500 to-pink-600',
    subcategories: [
      { id: 'personal_information', name: 'personal_information', displayName: 'Personal Information', categoryId: 'identity_personal_life' },
      { id: 'family_friends', name: 'family_friends', displayName: 'Family & Friends', categoryId: 'identity_personal_life' },
      { id: 'physical_personality_descriptions', name: 'physical_personality_descriptions', displayName: 'Physical & Personality Descriptions', categoryId: 'identity_personal_life' },
      { id: 'pets', name: 'pets', displayName: 'Pets', categoryId: 'identity_personal_life' },
      { id: 'relationships', name: 'relationships', displayName: 'Relationships', categoryId: 'identity_personal_life' },
      { id: 'feelings_emotions', name: 'feelings_emotions', displayName: 'Feelings & Emotions', categoryId: 'identity_personal_life' }
    ]
  },
  {
    id: 'home_local_area',
    name: 'home_local_area',
    displayName: 'Home & Local Area',
    icon: Home, // Changed from '🏠' to Lucide Home
    color: 'from-green-500 to-teal-600',
    subcategories: [
      { id: 'house_rooms', name: 'house_rooms', displayName: 'House & Rooms', categoryId: 'home_local_area' },
      { id: 'furniture', name: 'furniture', displayName: 'Furniture', categoryId: 'home_local_area' },
      { id: 'household_items', name: 'household_items', displayName: 'Household Items', categoryId: 'home_local_area' },
      { id: 'chores', name: 'chores', displayName: 'Chores', categoryId: 'home_local_area' },
      { id: 'types_of_housing', name: 'types_of_housing', displayName: 'Types of Housing', categoryId: 'home_local_area' },
      { id: 'places_in_town', name: 'places_in_town', displayName: 'Places in Town', categoryId: 'home_local_area' },
      { id: 'directions', name: 'directions', displayName: 'Directions', categoryId: 'home_local_area' }
    ]
  },
  {
    id: 'school_jobs_future',
    name: 'school_jobs_future',
    displayName: 'School, Jobs & Future',
    icon: GraduationCap, // Changed from '🎓' to Lucide GraduationCap
    color: 'from-orange-500 to-red-600',
    subcategories: [
      { id: 'school_subjects', name: 'school_subjects', displayName: 'School Subjects', categoryId: 'school_jobs_future' },
      { id: 'school_rules', name: 'school_rules', displayName: 'School Rules', categoryId: 'school_jobs_future' },
      { id: 'classroom_objects', name: 'classroom_objects', displayName: 'Classroom Objects', categoryId: 'school_jobs_future' },
      { id: 'school_life', name: 'school_life', displayName: 'School Life', categoryId: 'school_jobs_future' },
      { id: 'professions_jobs', name: 'professions_jobs', displayName: 'Professions & Jobs', categoryId: 'school_jobs_future' },
      { id: 'future_ambitions', name: 'future_ambitions', displayName: 'Future Ambitions', categoryId: 'school_jobs_future' },
      { id: 'qualities_skills', name: 'qualities_skills', displayName: 'Qualities & Skills', categoryId: 'school_jobs_future' },
      { id: 'learning_work_verbs', name: 'learning_work_verbs', displayName: 'Learning & Work Verbs', categoryId: 'school_jobs_future' }
    ]
  },
  {
    id: 'free_time_leisure',
    name: 'free_time_leisure',
    displayName: 'Free Time & Leisure',
    icon: Gamepad, // Changed from '🎮' to Lucide Gamepad
    color: 'from-cyan-500 to-blue-600',
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
    icon: Utensils, // Changed from '🍽️' to Lucide Utensils
    color: 'from-yellow-500 to-orange-600',
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
    icon: Shirt, // Changed from '👕' to Lucide Shirt
    color: 'from-pink-500 to-purple-600',
    subcategories: [
      { id: 'clothes_accessories', name: 'clothes_accessories', displayName: 'Clothes & Accessories', categoryId: 'clothes_shopping' },
      { id: 'shopping_phrases_prices', name: 'shopping_phrases_prices', displayName: 'Shopping Phrases & Prices', categoryId: 'clothes_shopping' }
    ]
  },
  {
    id: 'technology_media',
    name: 'technology_media',
    displayName: 'Technology & Media',
    icon: Laptop, // Changed from '💻' to Lucide Laptop
    color: 'from-indigo-500 to-purple-600',
    subcategories: [
      { id: 'mobile_phones_social_media', name: 'mobile_phones_social_media', displayName: 'Mobile Phones & Social Media', categoryId: 'technology_media' },
      { id: 'internet_digital_devices', name: 'internet_digital_devices', displayName: 'Internet & Digital Devices', categoryId: 'technology_media' },
      { id: 'tv', name: 'tv', displayName: 'TV', categoryId: 'technology_media' },
      { id: 'film', name: 'film', displayName: 'Film', categoryId: 'technology_media' },
      { id: 'music', name: 'music', displayName: 'Music', categoryId: 'technology_media' },
      { id: 'online_safety', name: 'online_safety', displayName: 'Online Safety', categoryId: 'technology_media' }
    ]
  },
  {
    id: 'health_lifestyle',
    name: 'health_lifestyle',
    displayName: 'Health & Lifestyle',
    icon: Stethoscope, // Changed from '🏥' to Lucide Stethoscope
    color: 'from-red-500 to-pink-600',
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
    icon: Plane, // Changed from '✈️' to Lucide Plane
    color: 'from-teal-500 to-green-600',
    subcategories: [
      { id: 'countries', name: 'countries', displayName: 'Countries', categoryId: 'holidays_travel_culture' },
      { id: 'nationalities', name: 'nationalities', displayName: 'Nationalities', categoryId: 'holidays_travel_culture' },
      { id: 'transport', name: 'transport', displayName: 'Transport', categoryId: 'holidays_travel_culture' },
      { id: 'travel_phrases', name: 'travel_phrases', displayName: 'Travel Phrases', categoryId: 'holidays_travel_culture' },
      { id: 'accommodation', name: 'accommodation', displayName: 'Accommodation', categoryId: 'holidays_travel_culture' },
      { id: 'holiday_activities', name: 'holiday_activities', displayName: 'Holiday Activities', categoryId: 'holidays_travel_culture' },
      { id: 'weathers', name: 'weathers', displayName: 'Weather', categoryId: 'holidays_travel_culture' },
      { id: 'spanish_speaking_countries_traditions', name: 'spanish_speaking_countries_traditions', displayName: 'Spanish Speaking Countries & Traditions', categoryId: 'holidays_travel_culture' },
      { id: 'festivals_celebrations', name: 'festivals_celebrations', displayName: 'Festivals & Celebrations', categoryId: 'holidays_travel_culture' },
      { id: 'travel_destinations_types', name: 'travel_destinations_types', displayName: 'Travel Destinations & Types', categoryId: 'holidays_travel_culture' }
    ]
  },
  {
    id: 'nature_environment',
    name: 'nature_environment',
    displayName: 'Nature & Environment',
    icon: Leaf, // Changed from '🌿' to Lucide Leaf
    color: 'from-green-600 to-emerald-700',
    subcategories: [
      { id: 'farm_animals', name: 'farm_animals', displayName: 'Farm Animals', categoryId: 'nature_environment' },
      { id: 'wild_animals', name: 'wild_animals', displayName: 'Wild Animals', categoryId: 'nature_environment' },
      { id: 'insects_bugs', name: 'insects_bugs', displayName: 'Insects & Bugs', categoryId: 'nature_environment' },
      { id: 'sea_animals', name: 'sea_animals', displayName: 'Sea Animals', categoryId: 'nature_environment' },
      { id: 'plants', name: 'plants', displayName: 'Plants', categoryId: 'nature_environment' },
      { id: 'landscapes_features', name: 'landscapes_features', displayName: 'Landscapes & Features', categoryId: 'nature_environment' },
      { id: 'seasons', name: 'seasons', displayName: 'Seasons', categoryId: 'nature_environment' },
      { id: 'environmental_issues', name: 'environmental_issues', displayName: 'Environmental Issues', categoryId: 'nature_environment' }
    ]
  },
  {
    id: 'social_global_issues',
    name: 'social_global_issues',
    displayName: 'Social & Global Issues',
    icon: Globe, // Changed from '🌍' to Lucide Globe (already imported for other uses)
    color: 'from-slate-600 to-gray-700',
    subcategories: [
      { id: 'social_issues', name: 'social_issues', displayName: 'Social Issues', categoryId: 'social_global_issues' },
      { id: 'human_rights', name: 'human_rights', displayName: 'Human Rights', categoryId: 'social_global_issues' },
      { id: 'global_problems_solutions', name: 'global_problems_solutions', displayName: 'Global Problems & Solutions', categoryId: 'social_global_issues' },
      { id: 'current_affairs_world_events', name: 'current_affairs_world_events', displayName: 'Current Affairs & World Events', categoryId: 'social_global_issues' }
    ]
  },
  {
    id: 'general_concepts',
    name: 'general_concepts',
    displayName: 'General Concepts',
    icon: Lightbulb, // Changed from '💡' to Lucide Lightbulb
    color: 'from-amber-500 to-yellow-600',
    subcategories: [
      { id: 'measurements_quantities', name: 'measurements_quantities', displayName: 'Measurements & Quantities', categoryId: 'general_concepts' },
      { id: 'materials', name: 'materials', displayName: 'Materials', categoryId: 'general_concepts' }
    ]
  },
  {
    id: 'daily_life',
    name: 'daily_life',
    displayName: 'Daily Life',
    icon: Clock, // Changed from '🕐' to Lucide Clock
    color: 'from-blue-600 to-indigo-700',
    subcategories: [
      { id: 'daily_routine', name: 'daily_routine', displayName: 'Daily Routine', categoryId: 'daily_life' }
    ]
  }
];

interface ModernCategorySelectorProps {
  onCategorySelect: (categoryId: string, subcategoryId: string | null) => void;
  selectedLanguage?: string;
  gameName?: string;
  showAllCategories?: boolean;
  maxSelections?: number;
  curriculumLevel?: 'KS3' | 'KS4';
}

export default function ModernCategorySelector({
  onCategorySelect,
  selectedLanguage = 'es',
  gameName = 'Game',
  showAllCategories = false,
  maxSelections = 1,
  curriculumLevel = 'KS3'
}: ModernCategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'categories' | 'subcategories'>('categories');
  const [currentCurriculumLevel, setCurrentCurriculumLevel] = useState<CurriculumLevel>(curriculumLevel as CurriculumLevel);

  // Get categories based on curriculum level
  // Note: getCategoriesByCurriculum is imported, ensure it correctly filters VOCABULARY_CATEGORIES
  const currentCategories = getCategoriesByCurriculum(currentCurriculumLevel);

  // Filter categories based on search
  const filteredCategories = currentCategories.filter(category =>
    category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub =>
      sub.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setView('subcategories');

    // If category has no subcategories or showAllCategories is true, select the whole category
    if (category.subcategories.length === 0 || showAllCategories) {
      onCategorySelect(category.id, null);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    if (maxSelections === 1) {
      onCategorySelect(selectedCategory!.id, subcategory.id);
    } else {
      // Multi-selection mode
      const newSelected = new Set(selectedSubcategories);
      if (newSelected.has(subcategory.id)) {
        newSelected.delete(subcategory.id);
      } else if (newSelected.size < maxSelections) {
        newSelected.add(subcategory.id);
      }
      setSelectedSubcategories(newSelected);
    }
  };

  const handleStartGame = () => {
    if (selectedCategory && selectedSubcategories.size > 0) {
      // For multi-selection, we might need to handle this differently
      // For now, just select the first one
      const firstSelected = Array.from(selectedSubcategories)[0];
      onCategorySelect(selectedCategory.id, firstSelected);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Choose Your Topic for {gameName}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Select a category and topic to start learning vocabulary
        </p>

        {/* Curriculum Level Selector */}
        {/* Assuming you want to replace these with Lucide icons too if they were emojis */}
        {/* If getCategoriesByCurriculum needs CURRICULUM_LEVELS_CONFIG, ensure it's accessible */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Curriculum Level:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {CURRICULUM_LEVELS_CONFIG.map(level => {
              const IconComponent = level.icon; // Get the Lucide component
              return (
                <button
                  key={level.code}
                  onClick={() => {
                    setCurrentCurriculumLevel(level.code);
                    setSelectedCategory(null);
                    setView('categories');
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    currentCurriculumLevel === level.code
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-4 w-4" /> {/* Render the Lucide icon */}
                  {level.displayName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search categories or topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'categories' ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category) => {
                const IconComponent = category.icon; // Get the Lucide component
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12"></div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <IconComponent className="h-10 w-10" /> {/* Render the Lucide icon */}
                          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>

                        <h3 className="text-xl font-bold mb-2">{category.displayName}</h3>

                        <p className="text-sm opacity-90 mb-4">
                          {category.subcategories.length} topics available
                        </p>

                        {/* Mini subcategory preview */}
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <span
                              key={sub.id}
                              className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full"
                            >
                              {sub.displayName.length > 12
                                ? sub.displayName.substring(0, 12) + '...'
                                : sub.displayName
                              }
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                              +{category.subcategories.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="subcategories"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Subcategories View */}
            <div className="mb-6">
              <button
                onClick={() => setView('categories')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Categories
              </button>

              {selectedCategory && (
                <div className={`bg-gradient-to-r ${selectedCategory.color} p-6 rounded-2xl text-white mb-6`}>
                  <div className="flex items-center">
                    {/* Render the Lucide icon for the selected category */}
                    <selectedCategory.icon className="h-12 w-12 mr-4" />
                    <div>
                      <h2 className="text-3xl font-bold">{selectedCategory.displayName}</h2>
                      <p className="text-lg opacity-90">Choose a specific topic to practice</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subcategories Grid */}
            {selectedCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategory.subcategories.map((subcategory) => (
                  <motion.div
                    key={subcategory.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedSubcategories.has(subcategory.id)
                        ? `border-blue-500 bg-blue-50`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{subcategory.displayName}</h3>
                      {selectedSubcategories.has(subcategory.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                      {maxSelections === 1 && (
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Multi-selection controls */}
            {maxSelections > 1 && selectedSubcategories.size > 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  {selectedSubcategories.size} of {maxSelections} topics selected
                </p>
                <button
                  onClick={handleStartGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  Start {gameName}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}