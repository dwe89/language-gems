'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Globe, 
  GraduationCap, 
  Target,
  Play,
  Lock,
  Sparkles
} from 'lucide-react';
import { useDemoAuth } from '../auth/DemoAuthProvider';

// Types
export interface UnifiedSelectionConfig {
  language: string;
  curriculumLevel: 'KS3' | 'KS4';
  categoryId: string;
  subcategoryId?: string;
  customMode?: boolean;
}

export interface UnifiedCategorySelectorProps {
  onSelectionComplete: (config: UnifiedSelectionConfig) => void;
  onBack?: () => void;
  gameName: string;
  supportedLanguages?: string[];
  showCustomMode?: boolean;
  title?: string;
}

// Complete language options - supporting ALL languages used across games
const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', description: 'Learn English vocabulary and grammar' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', description: 'Learn Spanish vocabulary and grammar' },
  { code: 'fr', name: 'French', flag: '🇫🇷', description: 'Master French language skills' },
  { code: 'de', name: 'German', flag: '🇩🇪', description: 'Build German language proficiency' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', description: 'Learn Italian language and culture' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', description: 'Master Portuguese language skills' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', description: 'Learn Chinese characters and pronunciation' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', description: 'Master Japanese hiragana, katakana, and kanji' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', description: 'Learn Korean hangul and grammar' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', description: 'Learn Arabic script and vocabulary' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', description: 'Master Russian Cyrillic and grammar' },
];

// Curriculum levels
const CURRICULUM_LEVELS = [
  {
    code: 'KS3' as const,
    name: 'KS3',
    displayName: 'Key Stage 3',
    description: 'Foundation language skills and basic vocabulary',
    ageRange: 'Ages 11-14',
    icon: '📚',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    code: 'KS4' as const,
    name: 'KS4 (GCSE)',
    displayName: 'Key Stage 4 (GCSE)',
    description: 'GCSE-level curriculum with foundation and higher tiers',
    ageRange: 'Ages 14-16',
    icon: '🎓',
    color: 'from-purple-500 to-pink-600'
  }
];

// Categories with enhanced styling
const VOCABULARY_CATEGORIES = [
  {
    id: 'basics_core_language',
    name: 'Basics & Core Language',
    icon: '📝',
    color: 'from-blue-500 to-indigo-600',
    description: 'Essential vocabulary and common phrases',
    subcategories: [
      { id: 'greetings_introductions', name: 'Greetings & Introductions' },
      { id: 'common_phrases', name: 'Common Phrases' },
      { id: 'opinions', name: 'Opinions' },
      { id: 'numbers_1_30', name: 'Numbers 1-30' },
      { id: 'numbers_40_100', name: 'Numbers 40-100' },
    ]
  },
  {
    id: 'identity_personal_life',
    name: 'Identity & Personal Life',
    icon: '👤',
    color: 'from-purple-500 to-pink-600',
    description: 'Personal information and relationships',
    subcategories: [
      { id: 'personal_information', name: 'Personal Information' },
      { id: 'family_friends', name: 'Family & Friends' },
      { id: 'physical_personality', name: 'Physical & Personality' },
    ]
  },
  {
    id: 'home_local_area',
    name: 'Home & Local Area',
    icon: '🏠',
    color: 'from-green-500 to-teal-600',
    description: 'Home environment and local community',
    subcategories: [
      { id: 'house_rooms', name: 'House & Rooms' },
      { id: 'furniture', name: 'Furniture' },
      { id: 'household_items', name: 'Household Items' },
    ]
  },
  {
    id: 'school_jobs_future',
    name: 'School, Jobs & Future',
    icon: '🎓',
    color: 'from-orange-500 to-red-600',
    description: 'Education, careers and future plans',
    subcategories: [
      { id: 'school_subjects', name: 'School Subjects' },
      { id: 'school_rules', name: 'School Rules' },
      { id: 'classroom_objects', name: 'Classroom Objects' },
    ]
  },
  {
    id: 'free_time_leisure',
    name: 'Free Time & Leisure',
    icon: '🎮',
    color: 'from-cyan-500 to-blue-600',
    description: 'Hobbies, sports and entertainment',
    subcategories: [
      { id: 'hobbies_interests', name: 'Hobbies & Interests' },
      { id: 'sports', name: 'Sports' },
      { id: 'social_activities', name: 'Social Activities' },
    ]
  },
  {
    id: 'food_drink',
    name: 'Food & Drink',
    icon: '🍽️',
    color: 'from-yellow-500 to-orange-600',
    description: 'Meals, ingredients and dining',
    subcategories: [
      { id: 'meals', name: 'Meals' },
      { id: 'food_drink_items', name: 'Food & Drink Items' },
      { id: 'ordering_restaurant', name: 'Ordering at Restaurant' },
    ]
  },
  {
    id: 'clothes_shopping',
    name: 'Clothes & Shopping',
    icon: '👕',
    color: 'from-pink-500 to-purple-600',
    description: 'Fashion, clothing and shopping',
    subcategories: [
      { id: 'clothes_accessories', name: 'Clothes & Accessories' },
      { id: 'shopping_phrases', name: 'Shopping Phrases' },
    ]
  },
  {
    id: 'technology_media',
    name: 'Technology & Media',
    icon: '💻',
    color: 'from-indigo-500 to-purple-600',
    description: 'Digital technology and media',
    subcategories: [
      { id: 'mobile_phones', name: 'Mobile Phones' },
      { id: 'internet_digital', name: 'Internet & Digital' },
      { id: 'tv', name: 'TV' },
    ]
  }
];

export default function UnifiedCategorySelector({
  onSelectionComplete,
  onBack,
  gameName,
  supportedLanguages = ['es', 'fr', 'de'],
  showCustomMode = true,
  title
}: UnifiedCategorySelectorProps) {
  const { isDemo } = useDemoAuth();
  const [step, setStep] = useState<'language' | 'curriculum' | 'category' | 'subcategory'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<'KS3' | 'KS4'>('KS3');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  // Filter languages based on supported languages
  const availableLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    supportedLanguages.includes(lang.code)
  );

  // Get current category data
  const currentCategory = VOCABULARY_CATEGORIES.find(cat => cat.id === selectedCategory);

  // Demo restrictions - only allow first category to be fully unlocked
  const isDemoRestricted = (categoryId: string) => {
    if (!isDemo) return false;
    return categoryId !== 'basics_core_language';
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setStep('curriculum');
  };

  const handleCurriculumSelect = (level: 'KS3' | 'KS4') => {
    setSelectedCurriculumLevel(level);
    setStep('category');
  };

  const handleCategorySelect = (categoryId: string) => {
    if (isDemoRestricted(categoryId)) {
      return; // Don't allow selection of restricted categories
    }
    
    setSelectedCategory(categoryId);
    const category = VOCABULARY_CATEGORIES.find(cat => cat.id === categoryId);
    
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
        setSelectedCurriculumLevel('KS3');
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
                categories={VOCABULARY_CATEGORIES}
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
      <Globe className="h-12 w-12 text-white mx-auto mb-4" />
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
          <div className="text-4xl mb-4">{language.flag}</div>
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
  onSelect: (level: 'KS3' | 'KS4') => void;
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
        <GraduationCap className="h-12 w-12 text-white mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Curriculum Level</h2>
        <p className="text-white/80">
          Learning {language?.flag} {language?.name} - Select your educational level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {levels.map((level) => (
          <motion.button
            key={level.code}
            onClick={() => onSelect(level.code)}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-4">{level.icon}</div>
              <h3 className="text-xl font-bold mb-2">{level.name}</h3>
              <p className="text-white/90 text-sm mb-2">{level.description}</p>
              <p className="text-white/70 text-xs">{level.ageRange}</p>
              <div className="mt-4 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">Select Level</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Category Selection Component
const CategorySelection: React.FC<{
  categories: typeof VOCABULARY_CATEGORIES;
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
                  <div className="text-3xl">{category.icon}</div>
                  {isRestricted && (
                    <Lock className="h-5 w-5 text-white/80" />
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 text-left">{category.name}</h3>
                <p className="text-white/90 text-sm text-left mb-3">{category.description}</p>
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
            <div className="text-3xl mb-4">✏️</div>
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
  category: typeof VOCABULARY_CATEGORIES[0];
  onSelect: (subcategoryId: string) => void;
}> = ({ category, onSelect }) => (
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
            <div className="text-2xl mb-4">{category.icon}</div>
            <h3 className="text-lg font-bold mb-2 text-left">{subcategory.name}</h3>
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
