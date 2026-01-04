'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shuffle,
  Share2,
  Link
} from 'lucide-react';
import ShareVocabularyButton from './ShareVocabularyButton';
import { parseVocabularyFromUrl, getGameSlug as getGameSlugFromName } from '../../utils/shareableVocabulary';
import { useDemoAuth } from '../auth/DemoAuthProvider';
import { useUserAccess } from '@/hooks/useUserAccess';
import { supabaseBrowser } from '../auth/AuthProvider';
import { VOCABULARY_CATEGORIES as KS3_CATEGORIES, KS2_VOCABULARY_CATEGORIES as KS2_CATEGORIES } from './ModernCategorySelector';
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
    description: 'Primary vocabulary and fun entry-level topics',
    ageRange: 'Ages 7-11',
    icon: <BookOpen className="h-8 w-8" />, // This is already correctly rendering JSX
    color: 'from-green-500 to-emerald-600',
    comingSoon: false
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
  if (level === 'KS2') return KS2_CATEGORIES;
  // For KS5 (coming soon), return empty array for now
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
  const { userType, canAccessFeature } = useUserAccess();



  // Fallback function to prevent crashes during hydration
  const safeCanAccessFeature = canAccessFeature || (() => false);
  const [step, setStep] = useState<'language' | 'curriculum' | 'category' | 'subcategory' | 'custom'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<'KS2' | 'KS3' | 'KS4' | 'KS5'>('KS3');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [learnerMode, setLearnerMode] = useState<'school' | 'independent'>('school');

  // Persist learner mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('languagegems_learner_mode');
      if (savedMode === 'independent') {
        setLearnerMode('independent');
      }
    }
  }, []);

  const toggleLearnerMode = (mode: 'school' | 'independent') => {
    setLearnerMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('languagegems_learner_mode', mode);
    }
  };

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

  // Demo restrictions - OPEN BETA: Remove all restrictions
  const isDemoRestricted = (categoryId: string) => {
    // Open Beta: All categories unlocked!
    return false;
  };

  // Demo subcategory restrictions - only allow specific subcategories for demo users
  const DEMO_AVAILABLE_SUBCATEGORIES: Record<string, string[]> = {
    'basics_core_language': [
      'greetings_introductions',
      'common_phrases',
      'numbers_1_30',
      'colours'
    ]
  };

  const isSubcategoryAvailable = (categoryId: string, subcategoryId: string): boolean => {
    // Open Beta: All subcategories unlocked!
    return true;
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
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
                <span className="text-blue-200 text-sm font-medium">OPEN BETA</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {['language', 'curriculum', 'category', step === 'custom' ? 'custom' : 'subcategory'].map((stepName, index) => {
              const isActive = step === stepName;
              const stepOrder = ['language', 'curriculum', 'category', step === 'custom' ? 'custom' : 'subcategory'];
              const isCompleted = stepOrder.indexOf(step) > index;

              return (
                <React.Fragment key={stepName}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isActive
                    ? 'bg-white text-purple-900'
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white/60'
                    }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : stepName === 'custom' ? <Pencil className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 transition-all ${isCompleted ? 'bg-green-500' : 'bg-white/20'
                      }`} />
                  )}
                </React.Fragment>
              );
            })}
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
                canAccessCustom={true}
                selectedLanguage={selectedLanguage}
                learnerMode={learnerMode}
                onToggleLearnerMode={toggleLearnerMode}
              />
            )}

            {step === 'category' && (
              <CategorySelection
                categories={currentCategories}
                onSelect={handleCategorySelect}
                onCustomMode={showCustomMode ? handleCustomMode : undefined}
                canAccessCustom={true}
                isDemoRestricted={isDemoRestricted}
              />
            )}

            {step === 'subcategory' && currentCategory && (
              <SubcategorySelection
                category={currentCategory}
                onSelect={handleSubcategorySelect}
                isSubcategoryAvailable={isSubcategoryAvailable}
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
                gameName={gameName}
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
  canAccessCustom?: boolean;
  selectedLanguage: string;
  learnerMode: 'school' | 'independent';
  onToggleLearnerMode: (mode: 'school' | 'independent') => void;
}> = ({ levels, onSelect, onCustomMode, canAccessCustom = true, selectedLanguage, learnerMode, onToggleLearnerMode }) => {
  const language = AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage);

  // Derive levels based on learner mode
  const displayLevels = levels.map(level => {
    if (learnerMode === 'independent') {
      if (level.code === 'KS2') return { ...level, name: 'Primary (Ages 7-11)', description: 'Fun language introduction for kids' };
      if (level.code === 'KS3') return { ...level, name: 'Beginner (A1-A2)', description: 'Essential phrases and foundation vocab' };
      if (level.code === 'KS4') return { ...level, name: 'Intermediate (B1-B2)', description: 'Conversational fluency and core topics' };
      if (level.code === 'KS5') return { ...level, name: 'Advanced (C1-C2)', description: 'Complex themes and native-level fluency' };
    }
    return level;
  });

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

        {/* Learner Mode Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-white/10 p-1 rounded-xl flex backdrop-blur-sm border border-white/10">
            <button
              onClick={() => onToggleLearnerMode('school')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${learnerMode === 'school'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-white/70 hover:text-white'
                }`}
            >
              School
            </button>
            <button
              onClick={() => onToggleLearnerMode('independent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${learnerMode === 'independent'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-white/70 hover:text-white'
                }`}
            >
              Independent
            </button>
          </div>
        </div>

        <p className="text-white/80">
          Learning {language?.name} - Select your level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Custom Content Option - First */}
        {onCustomMode && (
          <motion.button
            onClick={() => onCustomMode()}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer`}
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
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        )}

        {/* Standard Curriculum Levels */}
        {displayLevels.map((level) => (
          <motion.button
            key={level.code}
            onClick={() => onSelect(level.code)}
            whileHover={!level.comingSoon ? { scale: 1.02, y: -4 } : {}}
            whileTap={!level.comingSoon ? { scale: 0.98 } : {}}
            disabled={level.comingSoon}
            className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 text-white shadow-lg transition-all duration-300 group relative overflow-hidden ${level.comingSoon
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:shadow-xl cursor-pointer'
              }`}
          >
            <div className="relative z-10">
              {/* This was already correct as level.icon already holds JSX */}
              {level.icon}
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
  canAccessCustom?: boolean;
  isDemoRestricted: (categoryId: string) => boolean;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ categories, onSelect, onCustomMode, canAccessCustom = true, isDemoRestricted }) => (
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
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              disabled={isRestricted}
              className={`w-full bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white shadow-lg transition-all duration-300 relative overflow-hidden ${isRestricted
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:shadow-xl cursor-pointer'
                }`}
            >
              <div className="relative z-10">
                {/* FIX IS HERE: Render the component directly */}
                <IconComponent className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-left">{category.displayName}</h3>
              <p className="text-white/90 text-sm text-left mb-3">
                {category.subcategories.length} topics available
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs">
                  {category.subcategories.length} topics
                </span>
                <ArrowRight className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
              </div>
            </motion.button>

            {/* Overlays removed for Open Beta */}
          </motion.div>
        );
      })}

      {/* Custom Mode Option */}
      {onCustomMode && (
        <motion.button
          onClick={() => onCustomMode()}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={`bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg transition-all duration-300 group relative overflow-hidden border-2 border-purple-400/50 cursor-pointer`}
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
  isSubcategoryAvailable: (categoryId: string, subcategoryId: string) => boolean;
}> = ({ category, onSelect, isSubcategoryAvailable }) => {
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
        {category.subcategories.map((subcategory, index) => {
          const isRestricted = !isSubcategoryAvailable(category.id, subcategory.id);
          return (
            <motion.button
              key={subcategory.id}
              onClick={() => !isRestricted && onSelect(subcategory.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer`}
            >
              <div className="relative z-10">
                <IconComponent className="h-8 w-8 text-white mb-4" />
                <h3 className="text-lg font-bold mb-2 text-left">{subcategory.displayName}</h3>
                <div className="flex items-center justify-end mt-4">
                  <Play className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          );
        })}
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
  gameName: string;
}> = ({
  contentType,
  onContentTypeChange,
  customInput,
  onCustomInputChange,
  selectedCustomList,
  onCustomListChange,
  onComplete,
  gameCompatibility,
  language,
  gameName
}) => {
    const [activeTab, setActiveTab] = useState<'input' | 'lists' | 'upload'>('input');
    const [showShareSuccess, setShowShareSuccess] = useState(false);

    // Parse vocabulary from customInput for sharing
    const parseVocabularyForShare = () => {
      if (!customInput.trim()) return [];
      const lines = customInput.trim().split('\n').filter(line => line.trim());
      return lines.map((line, index) => {
        const parts = line.split(/[-,\t]/).map(s => s.trim());
        return {
          term: parts[0] || line,
          translation: parts[1] || ''
        };
      });
    };

    // Get game slug from gameName using the utility for correct URL mapping
    const getGameSlug = () => {
      return getGameSlugFromName(gameName);
    };

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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileName = file.name.toLowerCase();

      // Handle Excel files (.xlsx, .xls)
      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        try {
          // Dynamically import xlsx to avoid SSR issues
          const XLSX = await import('xlsx');

          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to array of arrays
          const data: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Convert each row to "term - translation" format
          // Assuming first column is term, second is translation
          const lines = data
            .filter(row => row.length >= 1 && row[0]) // Filter empty rows
            .map(row => {
              const term = String(row[0] || '').trim();
              const translation = String(row[1] || '').trim();
              return translation ? `${term} - ${translation}` : term;
            })
            .join('\n');

          onCustomInputChange(lines);
          setActiveTab('input');
        } catch (error) {
          console.error('Error reading Excel file:', error);
          alert('Error reading Excel file. Please try a .csv or .txt file instead.');
        }
        return;
      }

      // Handle text files (.txt, .csv)
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          // For CSV, convert comma-separated values to dash-separated
          let processed = text;
          if (fileName.endsWith('.csv')) {
            // Split by lines and process each
            processed = text.split('\n')
              .map(line => {
                // If line contains comma but no dash, convert first comma to dash
                if (line.includes(',') && !line.includes(' - ')) {
                  const parts = line.split(',');
                  if (parts.length >= 2) {
                    return `${parts[0].trim()} - ${parts.slice(1).join(',').trim()}`;
                  }
                }
                return line;
              })
              .join('\n');
          }
          onCustomInputChange(processed);
          setActiveTab('input');
        }
      };
      reader.readAsText(file);
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
                  className={`p-4 rounded-xl border-2 transition-all ${isSelected
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
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
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
              <p className="text-white/60 mb-6">Upload an Excel, CSV, or TXT file with your vocabulary</p>

              <div className="flex justify-center">
                <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span>Select File</span>
                  <input
                    type="file"
                    accept=".txt,.csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <p className="text-white/40 text-sm mt-4">
                Supported formats: .xlsx, .xls, .csv, .txt
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-6">
          {/* Main action buttons row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onComplete}
              disabled={!canComplete}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${canComplete
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
                }`}
            >
              ▶️ Start Playing
            </button>

            {/* Prominent Share Button */}
            {canComplete && activeTab === 'input' && customInput.trim() && (
              <ShareVocabularyButton
                gameSlug={getGameSlug()}
                vocabulary={parseVocabularyForShare()}
                language={language}
                contentType={contentType}
                variant="button"
                className="px-6 py-4 text-lg"
              />
            )}
          </div>

          {!canComplete && (
            <p className="text-white/60 text-sm">
              Please enter some {contentType} to continue
            </p>
          )}

          {/* Share explanation card - only show when vocabulary is entered */}
          {canComplete && activeTab === 'input' && customInput.trim() && (
            <div className="max-w-md mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-4 mt-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Link className="h-5 w-5 text-blue-300" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-semibold text-sm">Share with others!</h4>
                  <p className="text-white/70 text-xs mt-1">
                    Click "Share Vocabulary" to get a magic link. Anyone with this link will see your exact vocabulary list!
                  </p>
                </div>
              </div>
            </div>
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

  const normalizeLanguageFilter = (languageCode: string) => {
    if (!languageCode || languageCode === 'all') return null;
    const mapping: Record<string, string> = {
      es: 'spanish',
      fr: 'french',
      de: 'german'
    };
    const normalized = mapping[languageCode.toLowerCase()];
    return normalized || languageCode.toLowerCase();
  };

  const normalizeContentTypeFilter = (type: 'vocabulary' | 'sentences' | 'mixed') => {
    switch (type) {
      case 'vocabulary':
        return 'words';
      case 'sentences':
        return 'sentences';
      case 'mixed':
      default:
        return 'mixed';
    }
  };

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
        const languageFilter = normalizeLanguageFilter(language);
        const contentTypeFilter = normalizeContentTypeFilter(contentType);

        const filteredLists = (data || []).filter((list: any) => {
          if (languageFilter && list.language?.toLowerCase() !== languageFilter) {
            return false;
          }
          if (
            contentTypeFilter !== 'mixed' &&
            list.content_type &&
            list.content_type !== contentTypeFilter
          ) {
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
        <p className="text-white/60 mb-4">You haven&apos;t created any vocabulary collections yet</p>
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
