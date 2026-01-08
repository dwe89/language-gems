'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface SentenceGameLauncherProps {
  onGameStart: (config: {
    language: 'spanish' | 'french' | 'german';
    category: string;
    subcategory: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }) => void;
  onBack: () => void;
}

type Step = 'language' | 'category' | 'subcategory' | 'summary';

export default function SentenceGameLauncher({ onGameStart, onBack }: SentenceGameLauncherProps) {
  const [currentStep, setCurrentStep] = useState<Step>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<'spanish' | 'french' | 'german' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
  const [sentenceCount, setSentenceCount] = useState<number>(0);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const languages = [
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸', color: 'from-red-500 to-yellow-500' },
    { id: 'french', name: 'French', flag: '🇫🇷', color: 'from-blue-500 to-red-500' },
    { id: 'german', name: 'German', flag: '🇩🇪', color: 'from-black to-red-500' }
  ];



  // Category metadata for display
  const categoryMetadata: Record<string, { name: string; icon: string; description: string }> = {
    'basics_core_language': {
      name: 'Basics & Core Language',
      icon: 'BookOpen',
      description: 'Essential vocabulary and basic language concepts'
    },
    'identity_personal_life': {
      name: 'Identity & Personal Life',
      icon: '👤',
      description: 'Personal information and relationships'
    },
    'food_drink': {
      name: 'Food & Drink',
      icon: '🍽️',
      description: 'Meals, beverages, and dining experiences'
    },
    'home_local_area': {
      name: 'Home & Local Area',
      icon: '🏠',
      description: 'Houses, rooms, and places around town'
    },
    'school_jobs_future': {
      name: 'School, Jobs & Future',
      icon: '🎓',
      description: 'Education, careers, and future plans'
    }
  };

  // Subcategory metadata for display
  const subcategoryMetadata: Record<string, { name: string; description: string }> = {
    'colours': { name: 'Colours', description: 'Learn color names and descriptions' },
    'days': { name: 'Days of the Week', description: 'Days, dates, and time expressions' },
    'family_friends': { name: 'Family & Friends', description: 'Family members, relationships, and friendships' },
    'food_drink_vocabulary': { name: 'Food & Drink Vocabulary', description: 'Food items, drinks, and restaurant language' },
    'meals': { name: 'Meals', description: 'Breakfast, lunch, dinner, and meal times' },
    'house_rooms': { name: 'House & Rooms', description: 'Different rooms and areas of the house' },
    'places_in_town': { name: 'Places in Town', description: 'Shops, buildings, and locations around town' },
    'school_subjects': { name: 'School Subjects', description: 'Academic subjects and school topics' },
    'professions_jobs': { name: 'Professions & Jobs', description: 'Different careers and occupations' }
  };

  // Load available categories when language is selected
  useEffect(() => {
    if (selectedLanguage) {
      loadAvailableCategories();
    }
  }, [selectedLanguage]);

  // Load available subcategories when category is selected
  useEffect(() => {
    if (selectedLanguage && selectedCategory) {
      loadAvailableSubcategories();
    }
  }, [selectedLanguage, selectedCategory]);

  // Load sentence count for summary
  useEffect(() => {
    if (selectedLanguage && selectedCategory && selectedSubcategory) {
      loadSentenceCount();
    }
  }, [selectedLanguage, selectedCategory, selectedSubcategory]);

  const loadAvailableCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('sentences')
        .select('category')
        .eq('source_language', selectedLanguage)
        .eq('curriculum_level', 'KS3')
        .eq('is_active', true)
        .eq('is_public', true);

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(item => item.category))];
      const categoriesWithMetadata = uniqueCategories.map(categoryId => ({
        id: categoryId,
        ...categoryMetadata[categoryId] || { name: categoryId, icon: '📁', description: 'Category description' }
      }));

      setAvailableCategories(categoriesWithMetadata);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadAvailableSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('sentences')
        .select('subcategory')
        .eq('source_language', selectedLanguage)
        .eq('category', selectedCategory)
        .eq('curriculum_level', 'KS3')
        .eq('is_active', true)
        .eq('is_public', true);

      if (error) throw error;

      const uniqueSubcategories = [...new Set(data.map(item => item.subcategory))];
      const subcategoriesWithMetadata = uniqueSubcategories.map(subcategoryId => ({
        id: subcategoryId,
        ...subcategoryMetadata[subcategoryId] || { name: subcategoryId, description: 'Subcategory description' }
      }));

      setAvailableSubcategories(subcategoriesWithMetadata);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const loadSentenceCount = async () => {
    try {
      const { count, error } = await supabase
        .from('sentences')
        .select('*', { count: 'exact', head: true })
        .eq('source_language', selectedLanguage)
        .eq('category', selectedCategory)
        .eq('subcategory', selectedSubcategory)
        .eq('curriculum_level', 'KS3')
        .eq('is_active', true)
        .eq('is_public', true);

      if (error) throw error;
      setSentenceCount(count || 0);
    } catch (error) {
      console.error('Error loading sentence count:', error);
      setSentenceCount(0);
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'language':
        if (selectedLanguage) setCurrentStep('category');
        break;
      case 'category':
        if (selectedCategory) setCurrentStep('subcategory');
        break;
      case 'subcategory':
        if (selectedSubcategory) setCurrentStep('summary');
        break;
      case 'summary':
        if (selectedLanguage && selectedCategory && selectedSubcategory) {
          onGameStart({
            language: selectedLanguage,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            difficulty: 'beginner' // Default to beginner since we removed difficulty selection
          });
        }
        break;
    }
  };

  // Auto-advance functions for immediate navigation
  const handleLanguageSelect = (language: 'spanish' | 'french' | 'german') => {
    setSelectedLanguage(language);
    // Auto-advance to category selection after a brief delay for visual feedback
    setTimeout(() => {
      setCurrentStep('category');
    }, 300);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Auto-advance to subcategory selection after a brief delay
    setTimeout(() => {
      setCurrentStep('subcategory');
    }, 300);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    // Auto-advance to summary after a brief delay
    setTimeout(() => {
      setCurrentStep('summary');
    }, 300);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'category':
        setCurrentStep('language');
        setSelectedCategory(null);
        break;
      case 'subcategory':
        setCurrentStep('category');
        setSelectedSubcategory(null);
        break;
      case 'summary':
        setCurrentStep('subcategory');
        break;
      default:
        onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'language': return selectedLanguage !== null;
      case 'category': return selectedCategory !== null;
      case 'subcategory': return selectedSubcategory !== null;
      case 'summary': return sentenceCount > 0;
      default: return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'language': return 'Select Language';
      case 'category': return 'Select Category';
      case 'subcategory': return 'Select Topic';
      case 'summary': return 'Ready to Explore!';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-orange-900 to-yellow-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            {currentStep === 'language' ? 'Back to Games' : 'Back'}
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">🏛️ Lava Temple: Word Restore</h1>
            <p className="text-orange-200">Restore ancient inscriptions by filling in missing words</p>
          </div>

          <div className="w-20"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {['language', 'category', 'subcategory', 'summary'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step ? 'bg-yellow-400 text-black' :
                  ['language', 'category', 'subcategory', 'summary'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                  'bg-gray-600 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-600 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{getStepTitle()}</h2>

          <AnimatePresence mode="wait">
            {/* Language Selection */}
            {currentStep === 'language' && (
              <motion.div
                key="language"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {languages.map((language) => (
                  <motion.button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language.id as 'spanish' | 'french' | 'german')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedLanguage === language.id
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/20'
                        : 'border-orange-600/50 bg-black/30 hover:border-orange-400 hover:bg-orange-400/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{language.flag}</div>
                      <div className="text-white font-bold text-xl">{language.name}</div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Category Selection */}
            {currentStep === 'category' && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {availableCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedCategory === category.id
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/20'
                        : 'border-orange-600/50 bg-black/30 hover:border-orange-400 hover:bg-orange-400/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{category.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-lg mb-1">{category.name}</div>
                        <div className="text-orange-200 text-sm">{category.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Subcategory Selection */}
            {currentStep === 'subcategory' && (
              <motion.div
                key="subcategory"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {availableSubcategories.map((subcategory) => (
                  <motion.button
                    key={subcategory.id}
                    onClick={() => handleSubcategorySelect(subcategory.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedSubcategory === subcategory.id
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/20'
                        : 'border-orange-600/50 bg-black/30 hover:border-orange-400 hover:bg-orange-400/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-white font-bold text-lg mb-2">{subcategory.name}</div>
                    <div className="text-orange-200 text-sm">{subcategory.description}</div>
                    <div className="text-yellow-400 text-xs mt-2">
                      📜 Ancient inscriptions available
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}



            {/* Summary */}
            {currentStep === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <div className="bg-black/50 rounded-xl p-8 max-w-2xl mx-auto">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Temple Configuration Complete</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
                    <div className="bg-orange-900/30 rounded-lg p-4">
                      <div className="text-orange-300 text-sm font-semibold mb-1">Language</div>
                      <div className="text-white text-lg">{languages.find(l => l.id === selectedLanguage)?.name}</div>
                    </div>
                    <div className="bg-orange-900/30 rounded-lg p-4">
                      <div className="text-orange-300 text-sm font-semibold mb-1">Category</div>
                      <div className="text-white text-lg">{availableCategories.find(c => c.id === selectedCategory)?.name}</div>
                    </div>
                    <div className="bg-orange-900/30 rounded-lg p-4">
                      <div className="text-orange-300 text-sm font-semibold mb-1">Topic</div>
                      <div className="text-white text-lg">{availableSubcategories.find(s => s.id === selectedSubcategory)?.name}</div>
                    </div>
                  </div>

                  <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg p-4 mb-6">
                    <div className="text-yellow-400 font-bold text-lg mb-2">
                      📜 {sentenceCount} Ancient Inscriptions Found
                    </div>
                    <div className="text-yellow-200 text-sm">
                      Ready to restore missing words from eroded stone tablets
                    </div>
                  </div>

                  {sentenceCount === 0 && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                      <div className="text-red-400 font-bold mb-2">⚠️ No Inscriptions Available</div>
                      <div className="text-red-200 text-sm">
                        No sentences found for this configuration. Please try a different selection.
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Continue Button */}
        {canProceed() && (
          <div className="text-center">
            <motion.button
              onClick={handleNext}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-8 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                {currentStep === 'summary' ? (
                  <>
                    <Play className="h-5 w-5" />
                    Begin Restoration
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </div>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}