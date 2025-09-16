'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlagIcon from '@/components/ui/FlagIcon';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Globe,
  GraduationCap,
  Target,
  Award,
  Star,
  Users,
  Home,
  School,
  Gamepad2,
  Utensils,
  Shirt,
  Laptop,
  Heart,
  Plane,
  Leaf,
  Earth,
  Lightbulb,
  Calendar,
  Clipboard,
  User,
  Stethoscope,
  Palette
} from 'lucide-react';
import { useDemoAuth } from '../auth/DemoAuthProvider';

// Import category data
import { VOCABULARY_CATEGORIES as KS3_CATEGORIES } from './ModernCategorySelector';
import { KS4_VOCABULARY_CATEGORIES as KS4_CATEGORIES } from './KS4CategorySystem';
import KS4ExamBoardSelector from '@/components/vocabulary/KS4ExamBoardSelector';
import KS4TierSelector from '@/components/vocabulary/KS4TierSelector';

// Import the same types and data from UnifiedCategorySelector
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

// Category interface
interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: React.ElementType;
  color: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

export interface CompactCategorySelectorProps {
  onSelectionComplete: (config: UnifiedSelectionConfig, theme?: string) => void;
  onBack?: () => void;
  gameName: string;
  supportedLanguages?: string[];
  showCustomMode?: boolean;
  supportsThemes?: boolean;
  themes?: Array<{
    id: string;
    name: string;
    displayName: string;
    description: string;
    preview: string;
  }>;
  defaultTheme?: string;
}

// Simplified language data for compact view
const AVAILABLE_LANGUAGES = [
  {
    code: 'es',
    name: 'Spanish',
    icon: <FlagIcon countryCode="ES" size="lg" />
  },
  {
    code: 'fr',
    name: 'French',
    icon: <FlagIcon countryCode="FR" size="lg" />
  },
  {
    code: 'de',
    name: 'German',
    icon: <FlagIcon countryCode="DE" size="lg" />
  }
];

const CURRICULUM_LEVELS = [
  {
    code: 'KS3' as const,
    name: 'KS3',
    displayName: 'Key Stage 3',
    icon: <School className="h-6 w-6" />,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    code: 'KS4' as const,
    name: 'KS4 (GCSE)',
    displayName: 'Key Stage 4 (GCSE)',
    icon: <GraduationCap className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-600'
  }
];

// Get categories based on curriculum level
const getCategoriesByCurriculum = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5'): Category[] => {
  if (level === 'KS4') return KS4_CATEGORIES;
  if (level === 'KS3') return KS3_CATEGORIES;
  // For KS2 and KS5 (coming soon), return empty array for now
  return [];
};

export default function CompactCategorySelector({
  onSelectionComplete,
  onBack,
  gameName,
  supportedLanguages = ['es', 'fr', 'de'],
  showCustomMode = true,
  supportsThemes = false,
  themes = [],
  defaultTheme = 'default'
}: CompactCategorySelectorProps) {
  const { isDemo } = useDemoAuth();
  const [step, setStep] = useState<'language' | 'curriculum' | 'examBoard' | 'tier' | 'category' | 'subcategory' | 'theme'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<'KS2' | 'KS3' | 'KS4' | 'KS5'>('KS3');
  const [selectedExamBoard, setSelectedExamBoard] = useState<'AQA' | 'edexcel'>('AQA');
  const [selectedTier, setSelectedTier] = useState<'foundation' | 'higher'>('foundation');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);

  const currentCategories = getCategoriesByCurriculum(selectedCurriculumLevel);
  const currentCategory = currentCategories.find(cat => cat.id === selectedCategory);

  const availableLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    supportedLanguages.includes(lang.code)
  );

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setStep('curriculum');
  };

  const handleCurriculumSelect = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
    setSelectedCurriculumLevel(level);
    // For KS4, we need exam board and tier selection first
    if (level === 'KS4') {
      setStep('examBoard');
    } else {
      setStep('category');
    }
  };

  const handleExamBoardSelect = (examBoard: 'AQA' | 'edexcel') => {
    setSelectedExamBoard(examBoard);
    setStep('tier');
  };

  const handleTierSelect = (tier: 'foundation' | 'higher') => {
    setSelectedTier(tier);
    setStep('category');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = currentCategories.find(cat => cat.id === categoryId);

    if (category && category.subcategories.length > 0) {
      setStep('subcategory');
    } else {
      // No subcategories, check for theme selection
      if (supportsThemes && themes.length > 1) {
        setStep('theme');
      } else {
        // Complete selection
        onSelectionComplete({
          language: selectedLanguage,
          curriculumLevel: selectedCurriculumLevel,
          categoryId,
          subcategoryId: undefined,
          examBoard: selectedCurriculumLevel === 'KS4' ? selectedExamBoard : undefined,
          tier: selectedCurriculumLevel === 'KS4' ? selectedTier : undefined
        }, selectedTheme);
      }
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);

    // Check for theme selection
    if (supportsThemes && themes.length > 1) {
      setStep('theme');
    } else {
      // Complete selection
      onSelectionComplete({
        language: selectedLanguage,
        curriculumLevel: selectedCurriculumLevel,
        categoryId: selectedCategory,
        subcategoryId,
        examBoard: selectedCurriculumLevel === 'KS4' ? selectedExamBoard : undefined,
        tier: selectedCurriculumLevel === 'KS4' ? selectedTier : undefined
      }, selectedTheme);
    }
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);

    // Complete selection with theme
    onSelectionComplete({
      language: selectedLanguage,
      curriculumLevel: selectedCurriculumLevel,
      categoryId: selectedCategory,
      subcategoryId: selectedSubcategory || undefined,
      examBoard: selectedCurriculumLevel === 'KS4' ? selectedExamBoard : undefined,
      tier: selectedCurriculumLevel === 'KS4' ? selectedTier : undefined
    }, themeId);
  };

  const goBack = () => {
    switch (step) {
      case 'curriculum':
        setStep('language');
        setSelectedLanguage('');
        break;
      case 'examBoard':
        setStep('curriculum');
        break;
      case 'tier':
        setStep('examBoard');
        setSelectedExamBoard('AQA');
        break;
      case 'category':
        if (selectedCurriculumLevel === 'KS4') {
          setStep('tier');
        } else {
          setStep('curriculum');
        }
        break;
      case 'subcategory':
        setStep('category');
        setSelectedCategory('');
        break;
      case 'theme':
        // Go back to subcategory if it exists, otherwise category
        if (selectedSubcategory) {
          setStep('subcategory');
        } else {
          setStep('category');
        }
        break;
      default:
        onBack?.();
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {step !== 'language' && (
            <button
              onClick={goBack}
              className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded-lg hover:bg-indigo-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {gameName} - Select Content
            </h3>
            <p className="text-gray-600 text-sm">
              Choose your preferences to get started
            </p>
          </div>
        </div>
      </div>

      {/* Compact Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2">
          {(() => {
            const steps = ['language', 'curriculum', 'category', 'subcategory'];
            if (supportsThemes && themes.length > 1) {
              steps.push('theme');
            }
            return steps;
          })().map((stepName, index) => {
            const allSteps = ['language', 'curriculum', 'category', 'subcategory', 'theme'];
            const isActive = step === stepName;
            const isCompleted = allSteps.indexOf(step) > allSteps.indexOf(stepName);
            const shouldShow = index < 3 || (currentCategory && currentCategory.subcategories.length > 0);

            if (!shouldShow) return null;

            return (
              <React.Fragment key={stepName}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && shouldShow && (
                  <div className={`w-8 h-0.5 transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Compact Content */}
      <AnimatePresence mode="wait">
        {step === 'language' && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <Globe className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-900">Choose Language</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  <div className="flex-shrink-0">
                    {language.icon}
                  </div>
                  <span className="font-medium text-gray-900">{language.name}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'curriculum' && (
          <motion.div
            key="curriculum"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <GraduationCap className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-900">Choose Level</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {CURRICULUM_LEVELS.map((level) => (
                <button
                  key={level.code}
                  onClick={() => handleCurriculumSelect(level.code)}
                  className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${level.color} text-white rounded-lg hover:shadow-lg transition-all`}
                >
                  <div className="flex-shrink-0">
                    {level.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{level.displayName}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'examBoard' && (
          <motion.div
            key="examBoard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <KS4ExamBoardSelector
              onExamBoardSelect={handleExamBoardSelect}
              onBack={goBack}
              selectedLanguage={AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'Spanish'}
            />
          </motion.div>
        )}

        {step === 'tier' && (
          <motion.div
            key="tier"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <KS4TierSelector
              onTierSelect={handleTierSelect}
              onBack={goBack}
              selectedExamBoard={selectedExamBoard}
              selectedLanguage={AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'Spanish'}
            />
          </motion.div>
        )}

        {step === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-900">Choose Topic</h4>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {currentCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${category.color} text-white rounded-lg hover:shadow-lg transition-all text-left`}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{category.displayName}</span>
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'subcategory' && currentCategory && (
          <motion.div
            key="subcategory"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <Target className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-900">Choose Subtopic</h4>
              <p className="text-sm text-gray-600">Select from {currentCategory.displayName}</p>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {currentCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleSubcategorySelect(subcategory.id)}
                  className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${currentCategory.color} text-white rounded-lg hover:shadow-lg transition-all text-left`}
                >
                  <Star className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{subcategory.displayName}</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'theme' && supportsThemes && themes.length > 1 && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <Palette className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-900">Choose Theme</h4>
              <p className="text-sm text-gray-600">Select your preferred game style</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTheme === theme.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{theme.preview}</span>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm">{theme.displayName}</h5>
                      <p className="text-xs text-gray-600">{theme.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
