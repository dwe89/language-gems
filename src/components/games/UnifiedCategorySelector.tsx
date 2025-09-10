'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCountryFlag from 'react-country-flag';
import FlagIcon from '@/components/ui/FlagIcon';
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
  Stethoscope, // For Health & Lifestyle
  Pencil,
  Folder,
  Check,
  Type,
  MessageSquare,
  Shuffle
} from 'lucide-react';
import { useDemoAuth } from '../auth/DemoAuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';
import { VOCABULARY_CATEGORIES as KS3_CATEGORIES } from './ModernCategorySelector';
import { KS4_VOCABULARY_CATEGORIES as KS4_CATEGORIES } from './KS4CategorySystem';

// Types
export interface UnifiedSelectionConfig {
  language: string;
  curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5';
  categoryId: string;
  subcategoryId?: string;
  customMode?: boolean;
  customContentType?: 'vocabulary' | 'sentences' | 'mixed';
  customVocabulary?: CustomVocabularyItem[];
  customListId?: string;
  // KS4-specific fields
  examBoard?: 'AQA' | 'edexcel';
  tier?: 'foundation' | 'higher';
}

export interface CustomVocabularyItem {
  id: string;
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
  context_translation?: string;
}

export interface UnifiedCategorySelectorProps {
  onSelectionComplete: (config: UnifiedSelectionConfig) => void;
  onBack?: () => void;
  gameName: string;
  supportedLanguages?: string[];
  showCustomMode?: boolean;
  title?: string;
  presetConfig?: UnifiedSelectionConfig;
  preferredContentType?: 'vocabulary' | 'sentences' | 'mixed';
  gameCompatibility?: {
    supportsVocabulary: boolean;
    supportsSentences: boolean;
    supportsMixed: boolean;
    minItems?: number;
    maxItems?: number;
  };
}

// Language options with country flags
const AVAILABLE_LANGUAGES = [
  {
    code: 'es',
    name: 'Spanish',
    icon: <FlagIcon countryCode="ES" size="lg" />,
    description: 'Learn Spanish vocabulary',
    color: 'from-red-500 to-yellow-500'
  },
  {
    code: 'fr',
    name: 'French',
    icon: <FlagIcon countryCode="FR" size="lg" />,
    description: 'Master French language skills',
    color: 'from-blue-500 to-red-500'
  },
  {
    code: 'de',
    name: 'German',
    icon: <FlagIcon countryCode="DE" size="lg" />,
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
  presetConfig,
  preferredContentType = 'vocabulary',
  gameCompatibility
}: UnifiedCategorySelectorProps) {
  const { isDemo } = useDemoAuth();
  const [step, setStep] = useState<'language' | 'curriculum' | 'category' | 'subcategory' | 'custom'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<'KS2' | 'KS3' | 'KS4' | 'KS5'>('KS3');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  // Custom mode state
  const [customContentType, setCustomContentType] = useState<'vocabulary' | 'sentences' | 'mixed'>(preferredContentType);
  const [customVocabulary, setCustomVocabulary] = useState<CustomVocabularyItem[]>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [selectedCustomList, setSelectedCustomList] = useState<string>('');

  // Apply preset config if provided
  useEffect(() => {
    if (presetConfig) {
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
    // Navigate to custom input step instead of completing immediately
    setSelectedCategory('custom');
    setStep('custom');
  };

  const handleCustomComplete = () => {
    // Parse custom input if provided
    let parsedVocabulary: CustomVocabularyItem[] = [];

    // Only parse input vocabulary if no custom list is selected
    if (customInput.trim() && !selectedCustomList) {
      const lines = customInput.trim().split('\n').filter(line => line.trim());
      parsedVocabulary = lines.map((line, index) => {
        const parts = line.split(/[-,\t]/).map(s => s.trim());
        return {
          id: `custom-${index}`,
          term: parts[0] || line,
          translation: parts[1] || '',
          part_of_speech: parts[2] || undefined,
          context_sentence: parts[3] || undefined,
          context_translation: parts[4] || undefined
        };
      });
    }

    onSelectionComplete({
      language: selectedLanguage,
      curriculumLevel: selectedCurriculumLevel,
      categoryId: 'custom',
      customMode: true,
      customContentType,
      customVocabulary: parsedVocabulary.length > 0 ? parsedVocabulary : customVocabulary,
      customListId: selectedCustomList || undefined
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
      case 'custom':
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
              {['language', 'curriculum', 'category', step === 'custom' ? 'custom' : 'subcategory'].map((stepName, index) => {
                const isActive = step === stepName;
                const stepOrder = ['language', 'curriculum', 'category', step === 'custom' ? 'custom' : 'subcategory'];
                const isCompleted = stepOrder.indexOf(step) > index;

                return (
                  <React.Fragment key={stepName}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-white text-purple-900'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white/20 text-white/60'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : stepName === 'custom' ? <Pencil className="h-4 w-4" /> : index + 1}
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
                onCustomMode={showCustomMode ? handleCustomMode : undefined}
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

            {step === 'custom' && (
              <CustomContentSelection
                contentType={customContentType}
                onContentTypeChange={setCustomContentType}
                customInput={customInput}
                onCustomInputChange={setCustomInput}
                selectedCustomList={selectedCustomList}
                onCustomListChange={setSelectedCustomList}
                onComplete={handleCustomComplete}
                gameCompatibility={gameCompatibility}
                language={selectedLanguage}
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
      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Language</h2>
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
  onCustomMode?: () => void;
  selectedLanguage: string;
}> = ({ levels, onSelect, onCustomMode, selectedLanguage }) => {
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
        {/* Custom Content Option - First */}
        {onCustomMode && (
          <motion.button
            onClick={onCustomMode}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg transition-all duration-300 group relative overflow-hidden hover:shadow-xl cursor-pointer"
          >
            <div className="relative z-10">
              <Pencil className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Custom Content</h3>
            <p className="text-white/90 text-sm mb-2">Create your own vocabulary and content</p>
            <p className="text-white/70 text-xs">Perfect for personalized learning</p>
            <div className="mt-4 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
              <span className="text-sm font-medium">Create Content</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </motion.button>
        )}

        {/* Standard Curriculum Levels */}
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
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Category Selection Component
interface CategorySelectionProps {
  // Ensure this type matches the actual categories being passed (KS3_CATEGORIES/KS4_CATEGORIES)
  // and that their 'icon' property is React.ElementType
  categories: Category[]; // Using the updated Category interface defined above
  onSelect: (categoryId: string) => void;
  onCustomMode?: () => void;
  isDemoRestricted: (categoryId: string) => boolean;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ categories, onSelect, onCustomMode, isDemoRestricted }) => (
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
          className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden border-2 border-purple-400/50"
        >
          <div className="relative z-10">
            <Pencil className="h-8 w-8 mb-3 mx-auto" />
            <h3 className="text-lg font-bold mb-2 text-left">Custom Content</h3>
            <p className="text-white/90 text-sm text-left mb-3">
              Create your own vocabulary or sentences
            </p>
            <div className="flex items-center justify-between">
              <span className="text-purple-200 text-xs font-medium">Personalized</span>
              <ArrowRight className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2">
            <Sparkles className="h-5 w-5 text-purple-200 animate-pulse" />
          </div>
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

// Custom Content Selection Component
const CustomContentSelection: React.FC<{
  contentType: 'vocabulary' | 'sentences' | 'mixed';
  onContentTypeChange: (type: 'vocabulary' | 'sentences' | 'mixed') => void;
  customInput: string;
  onCustomInputChange: (input: string) => void;
  selectedCustomList: string;
  onCustomListChange: (listId: string) => void;
  onComplete: () => void;
  gameCompatibility?: {
    supportsVocabulary: boolean;
    supportsSentences: boolean;
    supportsMixed: boolean;
    minItems?: number;
    maxItems?: number;
  };
  language: string;
}> = ({
  contentType,
  onContentTypeChange,
  customInput,
  onCustomInputChange,
  selectedCustomList,
  onCustomListChange,
  onComplete,
  gameCompatibility,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'input' | 'lists' | 'upload'>('input');

  const getContentTypeIcon = (type: 'vocabulary' | 'sentences' | 'mixed') => {
    switch (type) {
      case 'vocabulary': return <Type className="h-8 w-8" />;
      case 'sentences': return <MessageSquare className="h-8 w-8" />;
      case 'mixed': return <Shuffle className="h-8 w-8" />;
    }
  };

  const getContentTypeDescription = (type: 'vocabulary' | 'sentences' | 'mixed') => {
    switch (type) {
      case 'vocabulary': return 'Individual words with translations';
      case 'sentences': return 'Complete sentences for practice';
      case 'mixed': return 'Combination of words and sentences';
    }
  };

  const isContentTypeSupported = (type: 'vocabulary' | 'sentences' | 'mixed') => {
    if (!gameCompatibility) return true;
    switch (type) {
      case 'vocabulary': return gameCompatibility.supportsVocabulary;
      case 'sentences': return gameCompatibility.supportsSentences;
      case 'mixed': return gameCompatibility.supportsMixed;
    }
  };

  const getInputPlaceholder = () => {
    switch (contentType) {
      case 'vocabulary':
        return `casa - house
perro - dog
gato - cat
libro - book`;
      case 'sentences':
        return `Hola, ¿cómo estás? - Hello, how are you?
Me gusta la pizza - I like pizza
¿Dónde está el baño? - Where is the bathroom?`;
      case 'mixed':
        return `casa - house
Hola, ¿cómo estás? - Hello, how are you?
perro - dog
Me gusta la pizza - I like pizza`;
    }
  };

  const canComplete = customInput.trim().length > 0 || selectedCustomList;

  return (
    <motion.div
      key="custom"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Pencil className="h-16 w-16 mb-4 mx-auto text-white" />
        <h2 className="text-2xl font-bold text-white mb-2">Create Custom Content</h2>
        <p className="text-white/80">
          Add your own vocabulary or sentences for personalized practice
        </p>
      </div>

      {/* Content Type Selection */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">Content Type</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['vocabulary', 'sentences', 'mixed'] as const).map((type) => {
            const isSupported = isContentTypeSupported(type);
            const isSelected = contentType === type;

            return (
              <button
                key={type}
                onClick={() => isSupported && onContentTypeChange(type)}
                disabled={!isSupported}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-white bg-white/20 text-white'
                    : isSupported
                      ? 'border-white/30 bg-white/10 text-white/80 hover:border-white/50 hover:bg-white/15'
                      : 'border-white/10 bg-white/5 text-white/40 cursor-not-allowed'
                }`}
              >
                <div className="mb-2 flex justify-center">{getContentTypeIcon(type)}</div>
                <div className="font-medium capitalize">{type}</div>
                <div className="text-xs mt-1 opacity-80">
                  {getContentTypeDescription(type)}
                </div>
                {!isSupported && (
                  <div className="text-xs mt-1 text-red-300">Not supported</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Selection */}
      <div className="max-w-2xl mx-auto">
        <div className="flex bg-white/10 rounded-lg p-1">
          {[
            { id: 'input', label: 'Quick Input', icon: Pencil },
            { id: 'lists', label: 'My Collections', icon: BookOpen },
            { id: 'upload', label: 'Upload File', icon: Folder }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Enter your {contentType} (one per line)
              </label>
              <textarea
                value={customInput}
                onChange={(e) => onCustomInputChange(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="w-full h-48 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
              />
              <p className="text-white/60 text-sm mt-2">
                Format: {contentType === 'vocabulary' ? 'Spanish word - English translation (optional for some games)' : 'Spanish sentence - English translation'}
              </p>
              <p className="text-white/50 text-xs mt-1">
                💡 Tip: For games like Hangman, you can enter just the Spanish words without translations
              </p>
            </div>
          </div>
        )}

        {activeTab === 'lists' && (
          <CustomVocabularyLists
            selectedListId={selectedCustomList}
            onSelectList={onCustomListChange}
            language={language}
            contentType={contentType}
          />
        )}

        {activeTab === 'upload' && (
          <div className="text-center py-8">
            <Folder className="h-16 w-16 mb-4 mx-auto text-white" />
            <h3 className="text-lg font-semibold text-white mb-2">Upload File</h3>
            <p className="text-white/60 mb-4">Upload a CSV or TXT file with your content</p>
            <div className="text-white/40 text-sm">
              Coming soon - file upload functionality
            </div>
          </div>
        )}
      </div>

      {/* Complete Button */}
      <div className="text-center">
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
            canComplete
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-white/20 text-white/50 cursor-not-allowed'
          }`}
        >
          Continue with Custom Content
        </button>
        {!canComplete && (
          <p className="text-white/60 text-sm mt-2">
            Please enter some {contentType} to continue
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Custom Vocabulary Lists Component
const CustomVocabularyLists: React.FC<{
  selectedListId: string;
  onSelectList: (listId: string) => void;
  language: string;
  contentType: 'vocabulary' | 'sentences' | 'mixed';
}> = ({ selectedListId, onSelectList, language, contentType }) => {
  const [customLists, setCustomLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListDetails, setSelectedListDetails] = useState<any>(null);

  // Load user's custom vocabulary lists
  useEffect(() => {
    const loadCustomLists = async () => {
      setLoading(true);
      try {
        const supabase = supabaseBrowser;
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          setCustomLists([]);
          return;
        }

        const { data, error } = await supabase
          .from('enhanced_vocabulary_lists')
          .select(`
            id,
            name,
            description,
            language,
            word_count,
            difficulty_level,
            content_type,
            created_at
          `)
          .eq('teacher_id', user.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filter by language and content type if needed
        const filteredLists = (data || []).filter((list: any) => {
          if (language && language !== 'all' && list.language !== language) {
            return false;
          }
          if (contentType !== 'mixed' && list.content_type && list.content_type !== contentType) {
            return false;
          }
          return true;
        });

        setCustomLists(filteredLists);
      } catch (error) {
        console.error('Error loading custom lists:', error);
        setCustomLists([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomLists();
  }, [language, contentType]);

  // Load details for selected list
  useEffect(() => {
    if (!selectedListId) {
      setSelectedListDetails(null);
      return;
    }

    const loadListDetails = async () => {
      try {
        const supabase = supabaseBrowser;
        const listData = customLists.find(list => list.id === selectedListId);
        
        if (!listData) return;

        // Get first 5 items for preview
        const { data: itemsData, error: itemsError } = await supabase
          .from('enhanced_vocabulary_items')
          .select('*')
          .eq('list_id', selectedListId)
          .limit(5);

        if (itemsError) throw itemsError;

        setSelectedListDetails({
          ...listData,
          items: itemsData || []
        });
      } catch (error) {
        console.error('Error loading list details:', error);
      }
    };

    loadListDetails();
  }, [selectedListId, customLists]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">Loading your vocabulary collections...</p>
      </div>
    );
  }

  if (customLists.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-16 w-16 mb-4 mx-auto text-white/60" />
        <h3 className="text-lg font-semibold text-white mb-2">No Collections Found</h3>
        <p className="text-white/60 mb-4">You haven't created any vocabulary collections yet</p>
        <div className="bg-white/10 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-white/80 text-sm">
            Create vocabulary collections in the{' '}
            <span className="text-white font-medium">Vocabulary Management</span> section
            to use them in games.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white font-medium mb-2">
          Select a Vocabulary Collection
        </label>
        <select
          value={selectedListId}
          onChange={(e) => onSelectList(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
        >
          <option value="">Choose a collection...</option>
          {customLists.map((list) => (
            <option key={list.id} value={list.id} className="bg-gray-800 text-white">
              {list.name} ({list.word_count} words, {list.language})
            </option>
          ))}
        </select>
      </div>

      {selectedListDetails && (
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Collection Preview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Name:</span>
              <span className="font-medium text-white">{selectedListDetails.name}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Language:</span>
              <span className="font-medium text-white capitalize">{selectedListDetails.language}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Word Count:</span>
              <span className="font-medium text-white">{selectedListDetails.word_count} words</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Difficulty:</span>
              <span className="font-medium text-white capitalize">{selectedListDetails.difficulty_level}</span>
            </div>

            {selectedListDetails.items && selectedListDetails.items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-sm font-medium text-white mb-2">Sample Words:</p>
                <div className="space-y-1">
                  {selectedListDetails.items.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="text-sm text-white/80">
                      <span className="font-medium">{item.term}</span> → {item.translation}
                    </div>
                  ))}
                  {selectedListDetails.word_count > 3 && (
                    <div className="text-sm text-white/60 italic">
                      ...and {selectedListDetails.word_count - 3} more words
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
