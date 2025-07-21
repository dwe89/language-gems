'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { KS3_SPANISH_CATEGORIES, Category, Subcategory } from '../../utils/categories';

interface CategorySelectorProps {
  onCategorySelect: (categoryId: string, subcategoryId: string | null) => void;
  selectedLanguage?: string;
}

// Create a universal category structure that works for multiple languages
const UNIVERSAL_CATEGORIES: Category[] = [
  {
    id: 'basics_core_language',
    name: 'basics_core_language', 
    displayName: 'Basics & Core Language',
    icon: '📝',
    subcategories: [
      { id: 'colours', name: 'colours', displayName: 'Colors', categoryId: 'basics_core_language' },
      { id: 'Colours', name: 'Colours', displayName: 'Colours', categoryId: 'basics_core_language' },
      { id: 'colors', name: 'colors', displayName: 'Colors', categoryId: 'basics_core_language' },
      { id: 'common_phrases', name: 'common_phrases', displayName: 'Common Phrases', categoryId: 'basics_core_language' },
      { id: 'Common Phrases', name: 'Common Phrases', displayName: 'Common Phrases', categoryId: 'basics_core_language' },
      { id: 'numbers', name: 'numbers', displayName: 'Numbers', categoryId: 'basics_core_language' },
      { id: 'Numbers 1-20', name: 'Numbers 1-20', displayName: 'Numbers 1-20', categoryId: 'basics_core_language' },
      { id: 'greetings_introductions', name: 'greetings_introductions', displayName: 'Greetings & Introductions', categoryId: 'basics_core_language' },
      { id: 'greetings', name: 'greetings', displayName: 'Greetings', categoryId: 'basics_core_language' },
      { id: 'dates_time', name: 'dates_time', displayName: 'Dates & Time', categoryId: 'basics_core_language' },
      { id: 'days_months', name: 'days_months', displayName: 'Days & Months', categoryId: 'basics_core_language' },
      { id: 'opinions', name: 'opinions', displayName: 'Opinions', categoryId: 'basics_core_language' }
    ]
  },
  {
    id: 'identity_personal_life',
    name: 'identity_personal_life',
    displayName: 'Identity & Personal Life', 
    icon: '👤',
    subcategories: [
      { id: 'family_friends', name: 'family_friends', displayName: 'Family & Friends', categoryId: 'identity_personal_life' },
      { id: 'Family & Friends', name: 'Family & Friends', displayName: 'Family & Friends', categoryId: 'identity_personal_life' },
      { id: 'family', name: 'family', displayName: 'Family', categoryId: 'identity_personal_life' },
      { id: 'family_relationships', name: 'family_relationships', displayName: 'Family Relationships', categoryId: 'identity_personal_life' },
      { id: 'personal_information', name: 'personal_information', displayName: 'Personal Information', categoryId: 'identity_personal_life' },
      { id: 'Personal Information', name: 'Personal Information', displayName: 'Personal Information', categoryId: 'identity_personal_life' },
      { id: 'personal_description', name: 'personal_description', displayName: 'Personal Description', categoryId: 'identity_personal_life' },
      { id: 'physical_personality_descriptions', name: 'physical_personality_descriptions', displayName: 'Physical & Personality Descriptions', categoryId: 'identity_personal_life' },
      { id: 'Physical & Personality Descriptions', name: 'Physical & Personality Descriptions', displayName: 'Physical & Personality Descriptions', categoryId: 'identity_personal_life' },
      { id: 'pets', name: 'pets', displayName: 'Pets', categoryId: 'identity_personal_life' },
      { id: 'relationships', name: 'relationships', displayName: 'Relationships', categoryId: 'identity_personal_life' }
    ]
  },
  {
    id: 'food_drink',
    name: 'food_drink',
    displayName: 'Food & Drink',
    icon: '🍽️',
    subcategories: [
      { id: 'food_drink_vocabulary', name: 'food_drink_vocabulary', displayName: 'Food & Drink Vocabulary', categoryId: 'food_drink' },
      { id: 'Food & Drink Vocabulary', name: 'Food & Drink Vocabulary', displayName: 'Food & Drink Vocabulary', categoryId: 'food_drink' },
      { id: 'food', name: 'food', displayName: 'Food', categoryId: 'food_drink' },
      { id: 'food_basics', name: 'food_basics', displayName: 'Food Basics', categoryId: 'food_drink' },
      { id: 'beverages', name: 'beverages', displayName: 'Beverages', categoryId: 'food_drink' },
      { id: 'fruits_vegetables', name: 'fruits_vegetables', displayName: 'Fruits & Vegetables', categoryId: 'food_drink' },
      { id: 'meals', name: 'meals', displayName: 'Meals', categoryId: 'food_drink' },
      { id: 'cooking_ingredients', name: 'cooking_ingredients', displayName: 'Cooking & Ingredients', categoryId: 'food_drink' },
      { id: 'dining_out', name: 'dining_out', displayName: 'Dining Out', categoryId: 'food_drink' },
      { id: 'eating_expressions', name: 'eating_expressions', displayName: 'Eating Expressions', categoryId: 'food_drink' },
      { id: 'shopping_for_food', name: 'shopping_for_food', displayName: 'Shopping for Food', categoryId: 'food_drink' },
      { id: 'ordering_cafes_restaurants', name: 'ordering_cafes_restaurants', displayName: 'Ordering at Cafes & Restaurants', categoryId: 'food_drink' }
    ]
  },
  {
    id: 'animals',
    name: 'animals',
    displayName: 'Animals',
    icon: '🐾',
    subcategories: []
  },
  {
    id: 'nature_environment',
    name: 'nature_environment',
    displayName: 'Nature & Environment',
    icon: '🌿',
    subcategories: [
      { id: 'Animals', name: 'Animals', displayName: 'Animals', categoryId: 'nature_environment' },
      { id: 'plants', name: 'plants', displayName: 'Plants', categoryId: 'nature_environment' },
      { id: 'environmental_problems', name: 'environmental_problems', displayName: 'Environmental Problems', categoryId: 'nature_environment' }
    ]
  },
  {
    id: 'school_jobs_future',
    name: 'school_jobs_future',
    displayName: 'School, Jobs & Future',
    icon: '🎓',
    subcategories: [
      { id: 'school_subjects', name: 'school_subjects', displayName: 'School Subjects', categoryId: 'school_jobs_future' },
      { id: 'School Subjects', name: 'School Subjects', displayName: 'School Subjects', categoryId: 'school_jobs_future' },
      { id: 'education', name: 'education', displayName: 'Education', categoryId: 'school_jobs_future' },
      { id: 'school_activities', name: 'school_activities', displayName: 'School Activities', categoryId: 'school_jobs_future' },
      { id: 'school_equipment', name: 'school_equipment', displayName: 'School Equipment', categoryId: 'school_jobs_future' },
      { id: 'jobs_career', name: 'jobs_career', displayName: 'Jobs & Career', categoryId: 'school_jobs_future' },
      { id: 'Professions & Jobs', name: 'Professions & Jobs', displayName: 'Professions & Jobs', categoryId: 'school_jobs_future' },
      { id: 'professions_jobs', name: 'professions_jobs', displayName: 'Professions & Jobs', categoryId: 'school_jobs_future' },
      { id: 'Classroom Objects', name: 'Classroom Objects', displayName: 'Classroom Objects', categoryId: 'school_jobs_future' },
      { id: 'classroom_objects', name: 'classroom_objects', displayName: 'Classroom Objects', categoryId: 'school_jobs_future' },
      { id: 'Daily Routine at School', name: 'Daily Routine at School', displayName: 'Daily Routine at School', categoryId: 'school_jobs_future' },
      { id: 'daily_routine_school', name: 'daily_routine_school', displayName: 'Daily Routine at School', categoryId: 'school_jobs_future' },
      { id: 'Future Aspirations', name: 'Future Aspirations', displayName: 'Future Aspirations', categoryId: 'school_jobs_future' },
      { id: 'future_ambitions', name: 'future_ambitions', displayName: 'Future Ambitions', categoryId: 'school_jobs_future' },
      { id: 'qualities_for_jobs', name: 'qualities_for_jobs', displayName: 'Qualities for Jobs', categoryId: 'school_jobs_future' },
      { id: 'school_rules', name: 'school_rules', displayName: 'School Rules', categoryId: 'school_jobs_future' }
    ]
  },
  {
    id: 'clothes_shopping',
    name: 'clothes_shopping',
    displayName: 'Clothes & Shopping',
    icon: '👕',
    subcategories: [
      { id: 'clothes_accessories', name: 'clothes_accessories', displayName: 'Clothes & Accessories', categoryId: 'clothes_shopping' },
      { id: 'Clothes & Accessories', name: 'Clothes & Accessories', displayName: 'Clothes & Accessories', categoryId: 'clothes_shopping' },
      { id: 'clothing', name: 'clothing', displayName: 'Clothing', categoryId: 'clothes_shopping' },
      { id: 'Shopping Phrases & Prices', name: 'Shopping Phrases & Prices', displayName: 'Shopping Phrases & Prices', categoryId: 'clothes_shopping' }
    ]
  },
  {
    id: 'colors',
    name: 'colors',
    displayName: 'Colors',
    icon: '🎨',
    subcategories: []
  },
  {
    id: 'transport',
    name: 'transport',
    displayName: 'Transport',
    icon: '🚗',
    subcategories: []
  },
  {
    id: 'weather',
    name: 'weather',
    displayName: 'Weather',
    icon: '🌤️',
    subcategories: []
  },
  {
    id: 'household',
    name: 'household',
    displayName: 'Household',
    icon: '🏠',
    subcategories: []
  },
  {
    id: 'home_local_area', 
    name: 'home_local_area',
    displayName: 'Home & Local Area',
    icon: '�',
    subcategories: [
      { id: 'house_rooms_furniture', name: 'house_rooms_furniture', displayName: 'House, Rooms & Furniture', categoryId: 'home_local_area' },
      { id: 'House, Rooms & Furniture', name: 'House, Rooms & Furniture', displayName: 'House, Rooms & Furniture', categoryId: 'home_local_area' },
      { id: 'household_items_chores', name: 'household_items_chores', displayName: 'Household Items & Chores', categoryId: 'home_local_area' },
      { id: 'local_area_places_town', name: 'local_area_places_town', displayName: 'Local Area & Places in Town', categoryId: 'home_local_area' },
      { id: 'Local Area & Places in Town', name: 'Local Area & Places in Town', displayName: 'Local Area & Places in Town', categoryId: 'home_local_area' },
      { id: 'directions_prepositions', name: 'directions_prepositions', displayName: 'Directions & Prepositions', categoryId: 'home_local_area' },
      { id: 'shops_services', name: 'shops_services', displayName: 'Shops & Services', categoryId: 'home_local_area' },
      { id: 'types_of_housing', name: 'types_of_housing', displayName: 'Types of Housing', categoryId: 'home_local_area' }
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
            {selectedCategory.icon} {selectedCategory.displayName}
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
            <div className="text-3xl mb-3">🎯</div>
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
              <div className="text-2xl mb-3">📚</div>
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
            <div className="text-4xl mb-4">{category.icon}</div>
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
