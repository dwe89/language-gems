'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Search, Filter, X, CheckCircle, Lock, Crown } from 'lucide-react';
import { useDemoAuth } from '../auth/DemoAuthProvider';
import { useUserAccess } from '@/hooks/useUserAccess';
import { getCategoriesByCurriculum, type CurriculumLevel } from './KS4CategorySystem';
import { Category, Subcategory, VOCABULARY_CATEGORIES } from './ModernCategorySelector';
import { CategoryDemoBanner } from '../demo/DemoBanner';
import { CategoryUpgradePrompt } from '../demo/DemoUpgradePrompt';

interface DemoAwareCategorySelectorProps {
  onCategorySelect: (categoryId: string, subcategoryId: string | null) => void;
  selectedLanguage?: string;
  gameName?: string;
  showAllCategories?: boolean;
  maxSelections?: number;
  curriculumLevel?: string;
}

// Define which categories are available in demo mode
const DEMO_AVAILABLE_CATEGORIES = [
  'basics_core_language'
];

// Define which subcategories are available in demo mode for each category
const DEMO_AVAILABLE_SUBCATEGORIES: Record<string, string[]> = {
  'basics_core_language': [
    'greetings_introductions',
    'common_phrases',
    'numbers_1_30',
    'colours'
  ]
};

export default function DemoAwareCategorySelector({
  onCategorySelect,
  selectedLanguage = 'es',
  gameName = 'Game',
  showAllCategories = false,
  maxSelections = 1,
  curriculumLevel = 'KS3'
}: DemoAwareCategorySelectorProps) {
  const { isDemo, isAdmin } = useDemoAuth();
  const { userType } = useUserAccess();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'categories' | 'subcategories'>('categories');
  const [currentCurriculumLevel, setCurrentCurriculumLevel] = useState<CurriculumLevel>(curriculumLevel as CurriculumLevel);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [restrictedItem, setRestrictedItem] = useState<string>('');
  const [learnerMode, setLearnerMode] = useState<'school' | 'independent'>('school');

  // Persist learner mode preference
  React.useEffect(() => {
    const savedMode = localStorage.getItem('languagegems_learner_mode');
    if (savedMode === 'independent') {
      setLearnerMode('independent');
    }
  }, []);

  const toggleLearnerMode = (mode: 'school' | 'independent') => {
    setLearnerMode(mode);
    localStorage.setItem('languagegems_learner_mode', mode);
  };

  // Get categories based on curriculum level
  const currentCategories = getCategoriesByCurriculum(currentCurriculumLevel);

  // Filter categories based on search
  const filteredCategories = currentCategories.filter(category =>
    category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub =>
      sub.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Check if a category is available in demo mode
  const isCategoryAvailable = (categoryId: string): boolean => {
    // Open Beta: All categories unlocked!
    return true;
  };

  // Check if a subcategory is available in demo mode
  const isSubcategoryAvailable = (categoryId: string, subcategoryId: string): boolean => {
    // Open Beta: All subcategories unlocked!
    return true;
  };

  const handleCategoryClick = (category: Category) => {
    if (!isCategoryAvailable(category.id)) {
      // Show upgrade prompt for restricted category
      setRestrictedItem(category.displayName);
      setShowUpgradePrompt(true);
      return;
    }

    setSelectedCategory(category);
    setView('subcategories');

    // If category has no subcategories or showAllCategories is true, select the whole category
    if (category.subcategories.length === 0 || showAllCategories) {
      onCategorySelect(category.id, null);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    if (!isSubcategoryAvailable(selectedCategory!.id, subcategory.id)) {
      // Show upgrade prompt for restricted subcategory
      setRestrictedItem(subcategory.displayName);
      setShowUpgradePrompt(true);
      return;
    }

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

  const renderCategoryCard = (category: Category) => {
    const isAvailable = isCategoryAvailable(category.id);

    return (
      <motion.div
        key={category.id}
        whileHover={isAvailable ? { scale: 1.02, y: -4 } : {}}
        whileTap={isAvailable ? { scale: 0.98 } : {}}
        className={`group ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={() => handleCategoryClick(category)}
      >
        <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${!isAvailable ? 'opacity-60' : ''
          }`}>


          {/* Admin crown for admin users */}
          {isAdmin && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-yellow-500 bg-opacity-80 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>
          )}

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-4 text-white">
              <category.icon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">{category.displayName}</h3>
            <p className="text-sm opacity-90 mb-4">
              {category.subcategories.length} subcategories
            </p>



            {/* Mini subcategory preview */}
            <div className="flex flex-wrap gap-1">
              {category.subcategories.slice(0, 3).map((sub) => (
                <span
                  key={sub.id}
                  className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-20`}
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
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your {gameName} Category
        </h1>
        {isDemo && (
          <div className="mb-6">
            <CategoryDemoBanner />
          </div>
        )}
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a vocabulary category to start your learning adventure.
          {isDemo ? ' Welcome to the Open Beta! Enjoy full access to all categories.' : ''}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 items-center">
          {/* Learner Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => toggleLearnerMode('school')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${learnerMode === 'school'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              School
            </button>
            <button
              onClick={() => toggleLearnerMode('independent')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${learnerMode === 'independent'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Independent
            </button>
          </div>

          <select
            value={currentCurriculumLevel}
            onChange={(e) => setCurrentCurriculumLevel(e.target.value as CurriculumLevel)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
          >
            <option value="KS3">
              {learnerMode === 'school' ? 'KS3 Level (Ages 11-14)' : 'Beginner (A1-A2)'}
            </option>
            <option value="KS4">
              {learnerMode === 'school' ? 'KS4/GCSE Level (Ages 14-16)' : 'Intermediate (B1-B2)'}
            </option>
          </select>
        </div>
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
              {filteredCategories.map((category) => renderCategoryCard(category))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="subcategories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back Button */}
            <button
              onClick={() => setView('categories')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Categories</span>
            </button>

            {/* Selected Category Header */}
            {selectedCategory && (
              <div className="text-center mb-8">
                <div className="mb-4 text-blue-600">
                  <selectedCategory.icon className="h-16 w-16 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCategory.displayName}
                </h2>
                <p className="text-gray-600">
                  Choose a specific topic to focus your learning
                </p>
              </div>
            )}

            {/* Subcategories Grid */}
            {selectedCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategory.subcategories.map((subcategory) => {
                  const isAvailable = isSubcategoryAvailable(selectedCategory.id, subcategory.id);

                  return (
                    <motion.div
                      key={subcategory.id}
                      whileHover={isAvailable ? { scale: 1.02 } : {}}
                      whileTap={isAvailable ? { scale: 0.98 } : {}}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 relative ${selectedSubcategories.has(subcategory.id)
                        ? `border-blue-500 bg-blue-50`
                        : isAvailable
                          ? 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 cursor-pointer'
                          : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        }`}
                      onClick={() => handleSubcategoryClick(subcategory)}
                    >


                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                          {subcategory.displayName}
                        </h3>
                        {selectedSubcategories.has(subcategory.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>


                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Multi-selection controls */}
            {maxSelections > 1 && selectedSubcategories.size > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleStartGame}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Start Game with {selectedSubcategories.size} Topic{selectedSubcategories.size > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Upgrade Prompt */}
      <CategoryUpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        categoryName={restrictedItem}
      />
    </div>
  );
}
