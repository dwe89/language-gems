'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCountryFlag from 'react-country-flag';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Globe,
  GraduationCap,
  Target,
  Play,
  Lock,
  Sparkles,
  Clock,
  Award,
  Star,
  Users,
  Home,
  School,
  Gamepad2,
  Utensils,
  Shirt,
  Laptop,
  Heart, // Assuming this is for Health & Lifestyle, if not already used
  Plane,
  Leaf,
  Earth, // Used for Social & Global Issues
  Lightbulb,
  Calendar, // Could be used for Dates & Time categories if icons were in those
  Clipboard, // For Basics & Core Language
  User, // For Identity & Personal Life
  Stethoscope // For Health & Lifestyle
} from 'lucide-react';
import { useDemoAuth } from '../auth/DemoAuthProvider';

// Types
export interface UnifiedSelectionConfig {
  language: string;
  curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5';
  categoryId: string;
  subcategoryId?: string;
  customMode?: boolean;
  // KS4-specific fields
  examBoard?: 'AQA' | 'edexcel';
  tier?: 'foundation' | 'higher';
}

export interface UnifiedCategorySelectorProps {
  onSelectionComplete: (config: UnifiedSelectionConfig) => void;
  onBack?: () => void;
  gameName: string;
  supportedLanguages?: string[];
  showCustomMode?: boolean;
  title?: string;
  presetConfig?: UnifiedSelectionConfig;
}

// Language options with country flags
const AVAILABLE_LANGUAGES = [
  {
    code: 'es',
    name: 'Spanish',
    icon: <ReactCountryFlag countryCode="ES" svg style={{ width: '2rem', height: '2rem' }} className="rounded-full shadow-lg" />,
    description: 'Learn Spanish vocabulary',
    color: 'from-red-500 to-yellow-500'
  },
  {
    code: 'fr',
    name: 'French',
    icon: <ReactCountryFlag countryCode="FR" svg style={{ width: '2rem', height: '2rem' }} className="rounded-full shadow-lg" />,
    description: 'Master French language skills',
    color: 'from-blue-500 to-red-500'
  },
  {
    code: 'de',
    name: 'German',
    icon: <ReactCountryFlag countryCode="DE" svg style={{ width: '2rem', height: '2rem' }} className="rounded-full shadow-lg" />,
    description: 'Build German language proficiency',
    color: 'from-gray-800 to-red-600'
  },
];

// Curriculum levels
const CURRICULUM_LEVELS = [
  {
    code: 'KS2' as const,
    name: 'KS2',
    displayName: 'Key Stage 2',
    description: 'Coming Soon - Primary language introduction',
    ageRange: 'Ages 7-11',
    icon: <BookOpen className="h-8 w-8" />, // This is already correctly rendering JSX
    color: 'from-green-500 to-emerald-600',
    comingSoon: true
  },
  {
    code: 'KS3' as const,
    name: 'KS3',
    displayName: 'Key Stage 3',
    description: 'Foundation language skills and basic vocabulary',
    ageRange: 'Ages 11-14',
    icon: <School className="h-8 w-8" />, // This is already correctly rendering JSX
    color: 'from-blue-500 to-indigo-600',
    comingSoon: false
  },
  {
    code: 'KS4' as const,
    name: 'KS4 (GCSE)',
    displayName: 'Key Stage 4 (GCSE)',
    description: 'GCSE-level curriculum with foundation and higher tiers',
    ageRange: 'Ages 14-16',
    icon: <GraduationCap className="h-8 w-8" />, // This is already correctly rendering JSX
    color: 'from-purple-500 to-pink-600',
    comingSoon: false
  },
  {
    code: 'KS5' as const,
    name: 'KS5 (A-Level)',
    displayName: 'Key Stage 5 (A-Level)',
    description: 'Coming Soon - Advanced language proficiency',
    ageRange: 'Ages 16-18',
    icon: <Award className="h-8 w-8" />, // This is already correctly rendering JSX
    color: 'from-red-500 to-orange-600',
    comingSoon: true
  }
];

// Define the comprehensive category structure
// NOTE: I've moved the Category interface here and updated it.
// This is crucial because KS3_CATEGORIES from ModernCategorySelector.ts
// now uses React.ElementType for its icons.
export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: React.ElementType; // Changed from string to React.ElementType
  color: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

// Import complete category systems
// These should ideally match the updated Category interface type.
// If ModernCategorySelector.ts also uses the old string for icon,
// you'll need to update that file with Lucide icons (as previously discussed)
// and its Category interface.
import { VOCABULARY_CATEGORIES as KS3_CATEGORIES } from './ModernCategorySelector';
import { KS4_VOCABULARY_CATEGORIES as KS4_CATEGORIES } from './KS4CategorySystem';


// Get categories based on curriculum level
const getCategoriesByCurriculum = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
  if (level === 'KS4') return KS4_CATEGORIES;
  if (level === 'KS3') return KS3_CATEGORIES;
  // For KS2 and KS5 (coming soon), return empty array for now
  return [];
};

export default function UnifiedCategorySelector({
  onSelectionComplete,
  onBack,
  gameName,
  supportedLanguages = ['es', 'fr', 'de'],
  showCustomMode = true,
  title,
  presetConfig
}: UnifiedCategorySelectorProps) {
  const { isDemo } = useDemoAuth();
  const [step, setStep] = useState<'language' | 'curriculum' | 'category' | 'subcategory'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<'KS2' | 'KS3' | 'KS4' | 'KS5'>('KS3');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  // Apply preset config if provided
  useEffect(() => {
    if (presetConfig) {
      console.log('✅ Applying preset config to UnifiedCategorySelector:', presetConfig);
      setSelectedLanguage(presetConfig.language || '');
      setSelectedCurriculumLevel(presetConfig.curriculumLevel || 'KS3');
      setSelectedCategory(presetConfig.categoryId || '');
      setSelectedSubcategory(presetConfig.subcategoryId || '');

      // Auto-complete selection if all required fields are present
      if (presetConfig.language && presetConfig.curriculumLevel && presetConfig.categoryId) {
        onSelectionComplete(presetConfig);
      }
    }
  }, [presetConfig, onSelectionComplete]);

  // Filter languages based on supported languages
  const availableLanguages = AVAILABLE_LANGUAGES.filter(lang =>
    supportedLanguages.includes(lang.code)
  );

  // Get categories for current curriculum level
  const currentCategories = getCategoriesByCurriculum(selectedCurriculumLevel);

  // Debug logging
  console.log('UnifiedCategorySelector - Current curriculum level:', selectedCurriculumLevel);
  console.log('UnifiedCategorySelector - Current categories:', currentCategories.length, currentCategories.map(c => c.id));
  console.log('UnifiedCategorySelector - Is demo:', isDemo);

  // Get current category data
  const currentCategory = currentCategories.find(cat => cat.id === selectedCategory);

  // Demo restrictions - only allow first category to be fully unlocked
  const isDemoRestricted = (categoryId: string) => {
    if (!isDemo) return false;
    return categoryId !== 'basics_core_language';
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setStep('curriculum');
  };

  const handleCurriculumSelect = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
    // Check if this is a coming soon level
    const selectedLevel = CURRICULUM_LEVELS.find(l => l.code === level);
    if (selectedLevel?.comingSoon) {
      alert('This curriculum level is coming soon! Please select KS3 or KS4 for now.');
      return;
    }

    setSelectedCurriculumLevel(level);
    setStep('category');
  };

  const handleCategorySelect = (categoryId: string) => {
    if (isDemoRestricted(categoryId)) {
      return; // Don't allow selection of restricted categories
    }

    setSelectedCategory(categoryId);
    const category = currentCategories.find(cat => cat.id === categoryId);

    if (category && category.subcategories.length > 0) {
      setStep('subcategory');
    } else {
      // No subcategories, complete selection
      onSelectionComplete({
        language: selectedLanguage,
        curriculumLevel: selectedCurriculumLevel,
        categoryId,
        subcategoryId: undefined
      });
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    onSelectionComplete({
      language: selectedLanguage,
      curriculumLevel: selectedCurriculumLevel,
      categoryId: selectedCategory,
      subcategoryId
    });
  };

  const handleCustomMode = () => {
    // For custom mode, we'll skip the vocabulary loading step
    // and let the game handle custom vocabulary input
    onSelectionComplete({
      language: selectedLanguage,
      curriculumLevel: selectedCurriculumLevel,
      categoryId: 'custom',
      customMode: true
    });
  };

  const goBack = () => {
    switch (step) {
      case 'curriculum':
        setStep('language');
        setSelectedLanguage('');
        break;
      case 'category':
        setStep('curriculum');
        setSelectedCurriculumLevel('KS3'); // Default back to KS3
        break;
      case 'subcategory':
        setStep('category');
        setSelectedCategory('');
        break;
      default:
        onBack?.();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {(step !== 'language' || onBack) && (
                <button
                  onClick={goBack}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {title || `${gameName} - Select Content`}
                </h1>
                <p className="text-white/80 mt-1">
                  Choose your language, level, and topics to get started
                </p>
              </div>
            </div>

            {isDemo && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <span className="text-yellow-200 text-sm font-medium">DEMO MODE</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {['language', 'curriculum', 'category', 'subcategory'].map((stepName, index) => {
                const isActive = step === stepName;
                const isCompleted = ['language', 'curriculum', 'category', 'subcategory'].indexOf(step) > index;

                return (
                  <React.Fragment key={stepName}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-white text-purple-900'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white/20 text-white/60'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    {index < 3 && (
                      <div className={`w-8 h-0.5 transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-white/20'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {step === 'language' && (
              <LanguageSelection
                languages={availableLanguages}
                onSelect={handleLanguageSelect}
              />
            )}

            {step === 'curriculum' && (
              <CurriculumSelection
                levels={CURRICULUM_LEVELS}
                onSelect={handleCurriculumSelect}
                selectedLanguage={selectedLanguage}
              />
            )}

            {step === 'category' && (
              <CategorySelection
                categories={currentCategories}
                onSelect={handleCategorySelect}
                onCustomMode={showCustomMode ? handleCustomMode : undefined}
                isDemoRestricted={isDemoRestricted}
              />
            )}

            {step === 'subcategory' && currentCategory && (
              <SubcategorySelection
                category={currentCategory}
                onSelect={handleSubcategorySelect}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Language Selection Component
const LanguageSelection: React.FC<{
  languages: typeof AVAILABLE_LANGUAGES;
  onSelect: (code: string) => void;
}> = ({ languages, onSelect }) => (
  <motion.div
    key="language"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <div className="flex justify-center space-x-2 mb-4">
        <ReactCountryFlag countryCode="ES" svg style={{ width: '1.5rem', height: '1.5rem' }} className="rounded-sm" />
        <ReactCountryFlag countryCode="FR" svg style={{ width: '1.5rem', height: '1.5rem' }} className="rounded-sm" />
        <ReactCountryFlag countryCode="DE" svg style={{ width: '1.5rem', height: '1.5rem' }} className="rounded-sm" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Language</h2>
      <p className="text-white/80">Select the language you want to practice</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {languages.map((language) => (
        <motion.button
          key={language.code}
          onClick={() => onSelect(language.code)}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 rounded-2xl p-6 text-center transition-all duration-300 group"
        >
          {/* Country flag with enhanced styling */}
          <div className="mb-4 flex justify-center">
            <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              {language.icon}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{language.name}</h3>
          <p className="text-white/70 text-sm">{language.description}</p>
          <div className="mt-4 flex items-center justify-center text-white/60 group-hover:text-white/80 transition-colors">
            <span className="text-sm font-medium">Select</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </div>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// Curriculum Selection Component
const CurriculumSelection: React.FC<{
  levels: typeof CURRICULUM_LEVELS;
  onSelect: (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => void;
  selectedLanguage: string;
}> = ({ levels, onSelect, selectedLanguage }) => {
  const language = AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <motion.div
      key="curriculum"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Curriculum Level</h2>
        <p className="text-white/80">
          Learning {language?.name} - Select your educational level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {levels.map((level) => (
          <motion.button
            key={level.code}
            onClick={() => onSelect(level.code)}
            whileHover={!level.comingSoon ? { scale: 1.02, y: -4 } : {}}
            whileTap={!level.comingSoon ? { scale: 0.98 } : {}}
            disabled={level.comingSoon}
            className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 text-white shadow-lg transition-all duration-300 group relative overflow-hidden ${
              level.comingSoon
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:shadow-xl cursor-pointer'
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                {/* This was already correct as level.icon already holds JSX */}
                {level.icon}
                {level.comingSoon && (
                  <Lock className="h-5 w-5 ml-2 text-white/80" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{level.name}</h3>
              <p className="text-white/90 text-sm mb-2">{level.description}</p>
              <p className="text-white/70 text-xs">{level.ageRange}</p>
              <div className="mt-4 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">
                  {level.comingSoon ? 'Coming Soon' : 'Select Level'}
                </span>
                {!level.comingSoon && (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </div>
            </div>
            {!level.comingSoon && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Category Selection Component
const CategorySelection: React.FC<{
  // Ensure this type matches the actual categories being passed (KS3_CATEGORIES/KS4_CATEGORIES)
  // and that their 'icon' property is React.ElementType
  categories: Category[]; // Using the updated Category interface defined above
  onSelect: (categoryId: string) => void;
  onCustomMode?: () => void;
  isDemoRestricted: (categoryId: string) => boolean;
}> = ({ categories, onSelect, onCustomMode, isDemoRestricted }) => (
  <motion.div
    key="category"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Topic Category</h2>
      <p className="text-white/80">Select the vocabulary theme you want to practice</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category, index) => {
        const isRestricted = isDemoRestricted(category.id);
        const IconComponent = category.icon; // Get the component reference

        console.log('Rendering category:', category.id, 'isRestricted:', isRestricted);

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <motion.button
              onClick={() => !isRestricted && onSelect(category.id)}
              whileHover={!isRestricted ? { scale: 1.02, y: -4 } : {}}
              whileTap={!isRestricted ? { scale: 0.98 } : {}}
              disabled={isRestricted}
              className={`w-full bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white shadow-lg transition-all duration-300 relative overflow-hidden ${
                isRestricted
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-xl cursor-pointer'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  {/* FIX IS HERE: Render the component directly */}
                  <IconComponent className="h-8 w-8" />
                  {isRestricted && (
                    <Lock className="h-5 w-5 text-white/80" />
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 text-left">{category.displayName}</h3>
                <p className="text-white/90 text-sm text-left mb-3">
                  {category.subcategories.length} topics available
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">
                    {category.subcategories.length} topics
                  </span>
                  {!isRestricted && (
                    <ArrowRight className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              {!isRestricted && (
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </motion.button>

            {isRestricted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-white mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Sign up to unlock</p>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Custom Mode Option */}
      {onCustomMode && (
        <motion.button
          onClick={onCustomMode}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
        >
          <div className="relative z-10">
            {/* FIX IS HERE: Render the Sparkles icon for custom mode */}
            <Sparkles className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-bold mb-2 text-left">Custom Vocabulary</h3>
            <p className="text-white/90 text-sm text-left mb-3">
              Create your own vocabulary list
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Your words</span>
              <ArrowRight className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      )}
    </div>
  </motion.div>
);

// Subcategory Selection Component
const SubcategorySelection: React.FC<{
  // Ensure this type matches the actual category being passed
  category: Category; // Using the updated Category interface defined above
  onSelect: (subcategoryId: string) => void;
}> = ({ category, onSelect }) => {
  const IconComponent = category.icon; // Get the component reference

  return (
    <motion.div
      key="subcategory"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Target className="h-12 w-12 text-white mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Choose Specific Topic</h2>
        <p className="text-white/80">
          Select from <span className="font-semibold">{category.name}</span> topics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {category.subcategories.map((subcategory, index) => (
          <motion.button
            key={subcategory.id}
            onClick={() => onSelect(subcategory.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
          >
            <div className="relative z-10">
              {/* FIX IS HERE: Render the component directly */}
              <IconComponent className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-bold mb-2 text-left">{subcategory.displayName}</h3>
              <div className="flex items-center justify-end mt-4">
                <Play className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};