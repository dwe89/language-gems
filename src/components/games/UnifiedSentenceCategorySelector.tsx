'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCountryFlag from 'react-country-flag';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Target,
  Play,
  Lock,
  Sparkles,
  Clock,
  Award,
  Home,
  School,
  Gamepad2,
  Utensils,
  Shirt,
  Laptop,
  Plane,
  Leaf,
  Earth,
  Lightbulb,
  Clipboard,
  User,
  Stethoscope
} from 'lucide-react';
import { useDemoAuth } from '../auth/DemoAuthProvider';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types
export interface SentenceSelectionConfig {
  language: string;
  curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5';
  categoryId: string;
  subcategoryId?: string;
  customMode?: boolean;
  customContentType?: 'vocabulary' | 'sentences' | 'mixed';
  customSentences?: CustomSentenceItem[];
  customListId?: string;
}

export interface CustomSentenceItem {
  id: string;
  sentence: string;
  translation: string;
  context?: string;
}

export interface UnifiedSentenceCategorySelectorProps {
  onSelectionComplete: (config: SentenceSelectionConfig) => void;
  onBack?: () => void;
  gameName: string;
  supportedLanguages?: string[];
  showCustomMode?: boolean;
  title?: string;
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
    code: 'spanish',
    name: 'Spanish',
    icon: (
      <div className="rounded-full shadow-lg overflow-hidden flex justify-center items-center" style={{ width: '2rem', height: '2rem' }}>
        <ReactCountryFlag countryCode="ES" svg style={{ width: '3rem', height: '3rem' }} />
      </div>
    ),
    description: 'Learn Spanish sentences',
    color: 'from-red-500 to-yellow-500'
  },
  {
    code: 'french',
    name: 'French',
    icon: (
      <div className="rounded-full shadow-lg overflow-hidden flex justify-center items-center" style={{ width: '2rem', height: '2rem' }}>
        <ReactCountryFlag countryCode="FR" svg style={{ width: '3rem', height: '3rem' }} />
      </div>
    ),
    description: 'Master French sentence skills',
    color: 'from-blue-500 to-red-500'
  },
  {
    code: 'german',
    name: 'German',
    icon: <ReactCountryFlag countryCode="DE" svg style={{ width: '2rem', height: '2rem' }} className="rounded-full shadow-lg" />,
    description: 'Build German sentence proficiency',
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
    icon: <BookOpen className="h-8 w-8" />,
    color: 'from-green-500 to-emerald-600',
    comingSoon: true
  },
  {
    code: 'KS3' as const,
    name: 'KS3',
    displayName: 'Key Stage 3',
    description: 'Foundation sentence skills and basic structures',
    ageRange: 'Ages 11-14',
    icon: <School className="h-8 w-8" />,
    color: 'from-blue-500 to-indigo-600',
    comingSoon: false
  },
  {
    code: 'KS4' as const,
    name: 'KS4 (GCSE)',
    displayName: 'Key Stage 4 (GCSE)',
    description: 'GCSE-level sentence structures with foundation and higher tiers',
    ageRange: 'Ages 14-16',
    icon: <GraduationCap className="h-8 w-8" />,
    color: 'from-purple-500 to-pink-600',
    comingSoon: true
  },
  {
    code: 'KS5' as const,
    name: 'KS5 (A-Level)',
    displayName: 'Key Stage 5 (A-Level)',
    description: 'Coming Soon - Advanced sentence proficiency',
    ageRange: 'Ages 16-18',
    icon: <Award className="h-8 w-8" />,
    color: 'from-red-500 to-orange-600',
    comingSoon: true
  }
];

// Category interface
export interface SentenceCategory {
  id: string;
  name: string;
  displayName: string;
  icon: React.ElementType;
  color: string;
  subcategories: SentenceSubcategory[];
  sentenceCount: number;
}

export interface SentenceSubcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
  sentenceCount: number;
}

// Category icon mapping
const CATEGORY_ICONS: { [key: string]: React.ElementType } = {
  'basics_core_language': Clipboard,
  'identity_personal_life': User,
  'home_local_area': Home,
  'free_time_leisure': Gamepad2,
  'food_drink': Utensils,
  'clothes_shopping': Shirt,
  'technology_media': Laptop,
  'health_lifestyle': Stethoscope,
  'holidays_travel_culture': Plane,
  'nature_environment': Leaf,
  'social_global_issues': Earth,
  'general_concepts': Lightbulb,
  'daily_life': Clock,
  'school_jobs_future': GraduationCap
};

// Category colors
const CATEGORY_COLORS: { [key: string]: string } = {
  'basics_core_language': 'from-blue-500 to-indigo-600',
  'identity_personal_life': 'from-purple-500 to-pink-600',
  'home_local_area': 'from-green-500 to-emerald-600',
  'free_time_leisure': 'from-orange-500 to-red-600',
  'food_drink': 'from-yellow-500 to-orange-600',
  'clothes_shopping': 'from-pink-500 to-rose-600',
  'technology_media': 'from-cyan-500 to-blue-600',
  'health_lifestyle': 'from-red-500 to-pink-600',
  'holidays_travel_culture': 'from-sky-500 to-cyan-600',
  'nature_environment': 'from-green-600 to-teal-600',
  'social_global_issues': 'from-indigo-500 to-purple-600',
  'general_concepts': 'from-amber-500 to-yellow-600',
  'daily_life': 'from-slate-500 to-gray-600',
  'school_jobs_future': 'from-violet-500 to-purple-600'
};

// Display name mapping
const CATEGORY_DISPLAY_NAMES: { [key: string]: string } = {
  'basics_core_language': 'Basics & Core Language',
  'identity_personal_life': 'Identity & Personal Life',
  'home_local_area': 'Home & Local Area',
  'free_time_leisure': 'Free Time & Leisure',
  'food_drink': 'Food & Drink',
  'clothes_shopping': 'Clothes & Shopping',
  'technology_media': 'Technology & Media',
  'health_lifestyle': 'Health & Lifestyle',
  'holidays_travel_culture': 'Holidays, Travel & Culture',
  'nature_environment': 'Nature & Environment',
  'social_global_issues': 'Social & Global Issues',
  'general_concepts': 'General Concepts',
  'daily_life': 'Daily Life',
  'school_jobs_future': 'School, Jobs & Future'
};

// Subcategory display name mapping (abbreviated for space)
const SUBCATEGORY_DISPLAY_NAMES: { [key: string]: string } = {
  // Basics & Core Language
  'colours': 'Colours',
  'common_adverbs': 'Common Adverbs',
  'common_irregular_verbs': 'Common Irregular Verbs',
  'common_phrases': 'Common Phrases',
  'common_regular_verbs': 'Common Regular Verbs',
  'comparatives_superlatives': 'Comparatives & Superlatives',
  'conjunctions': 'Conjunctions',
  'days': 'Days',
  'demonstratives': 'Demonstratives',
  'general_prepositions': 'General Prepositions',
  'greetings_core_language': 'Greetings Core Language',
  'greetings_introductions': 'Greetings & Introductions',
  'months': 'Months',
  'numbers_1_30': 'Numbers 1-30',
  'numbers_40_100': 'Numbers 40-100',
  'numbers_beyond_100': 'Numbers Beyond 100',
  'object_descriptions': 'Object Descriptions',
  'opinions': 'Opinions',
  'ordinal_numbers': 'Ordinal Numbers',
  'pronouns': 'Pronouns',
  'qualifiers_intensifiers': 'Qualifiers & Intensifiers',
  'question_words': 'Question Words',
  'reflexive_verbs': 'Reflexive Verbs',
  'shapes': 'Shapes',
  'telling_time': 'Telling Time',
  'time_sequencers': 'Time Sequencers',

  // Other categories (abbreviated)
  'clothes_accessories': 'Clothes & Accessories',
  'daily_routine': 'Daily Routine',
  'food_drink_vocabulary': 'Food & Drink Vocabulary',
  'meals': 'Meals',
  'ordering_cafes_restaurants': 'Ordering in Cafes & Restaurants',
  'hobbies_interests': 'Hobbies & Interests',
  'hobbies_interests_1st_person': 'Hobbies & Interests (1st Person)',
  'social_activities': 'Social Activities',
  'sports_ball_games': 'Sports - Ball Games',
  'sports_indoor': 'Sports - Indoor',
  'sports_outdoor': 'Sports - Outdoor',
  'materials': 'Materials',
  'measurements_quantities': 'Measurements & Quantities',
  'at_the_doctors': 'At the Doctors',
  'healthy_living': 'Healthy Living',
  'parts_of_body': 'Parts of Body',
  'accommodation': 'Accommodation',
  'countries': 'Countries',
  'festivals_celebrations': 'Festivals & Celebrations',
  'holiday_activities': 'Holiday Activities',
  'nationalities': 'Nationalities',
  'transport': 'Transport',
  'travel_destinations_types': 'Travel Destinations & Types',
  'weathers': 'Weather',
  'chores': 'Chores',
  'directions': 'Directions',
  'directions_prepositions': 'Directions & Prepositions',
  'furniture': 'Furniture',
  'household_items': 'Household Items',
  'house_rooms': 'House & Rooms',
  'places_in_town': 'Places in Town',
  'family_friends': 'Family & Friends',
  'feelings_emotions': 'Feelings & Emotions',
  'personal_information': 'Personal Information',
  'pets': 'Pets',
  'physical_personality_descriptions': 'Physical & Personality Descriptions',
  'relationships': 'Relationships',
  'environmental_issues': 'Environmental Issues',
  'farm_animals': 'Farm Animals',
  'insects_bugs': 'Insects & Bugs',
  'landscapes_features': 'Landscapes & Features',
  'plants': 'Plants',
  'sea_animals': 'Sea Animals',
  'seasons': 'Seasons',
  'wild_animals': 'Wild Animals',
  'adjective': 'Adjectives',
  'classroom_objects': 'Classroom Objects',
  'future_ambitions': 'Future Ambitions',
  'learning_work_verbs': 'Learning & Work Verbs',
  'noun': 'Nouns',
  'professions_jobs': 'Professions & Jobs',
  'qualities_skills': 'Qualities & Skills',
  'school_life': 'School Life',
  'school_rules': 'School Rules',
  'school_subjects': 'School Subjects',
  'current_affairs_world_events': 'Current Affairs & World Events',
  'global_problems_solutions': 'Global Problems & Solutions',
  'human_rights': 'Human Rights',
  'social_issues': 'Social Issues',
  'film': 'Film',
  'internet_digital_devices': 'Internet & Digital Devices',
  'mobile_phones_social_media': 'Mobile Phones & Social Media',
  'music': 'Music',
  'online_safety': 'Online Safety',
  'tv': 'TV'
};

export default function UnifiedSentenceCategorySelector({
  onSelectionComplete,
  onBack,
  gameName,
  supportedLanguages = ['spanish', 'french', 'german'],
  showCustomMode = true,
  title
}: UnifiedSentenceCategorySelectorProps) {
  const { isDemo } = useDemoAuth();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'language' | 'curriculum' | 'category' | 'subcategory'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<'KS2' | 'KS3' | 'KS4' | 'KS5'>('KS3');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<SentenceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [urlParamsChecked, setUrlParamsChecked] = useState(false);

  // Filter languages based on supported languages
  const availableLanguages = AVAILABLE_LANGUAGES.filter(lang =>
    supportedLanguages.includes(lang.code)
  );

  // Get current category data
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  // Demo restrictions - only allow first category to be fully unlocked
  const isDemoRestricted = (categoryId: string) => {
    if (!isDemo) return false;
    return categoryId !== 'basics_core_language';
  };

  // Load categories from database
  const loadCategories = async (language: string, curriculumLevel: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sentences')
        .select('category, subcategory')
        .eq('source_language', language)
        .eq('curriculum_level', curriculumLevel)
        .eq('is_active', true)
        .eq('is_public', true);

      if (error) throw error;

      // Group by category and subcategory
      const categoryMap = new Map<string, Map<string, number>>();

      data?.forEach(row => {
        if (!categoryMap.has(row.category)) {
          categoryMap.set(row.category, new Map());
        }
        const subcategoryMap = categoryMap.get(row.category)!;
        subcategoryMap.set(row.subcategory, (subcategoryMap.get(row.subcategory) || 0) + 1);
      });

      // Convert to category structure
      const categoryList: SentenceCategory[] = Array.from(categoryMap.entries()).map(([categoryId, subcategoryMap]) => {
        const subcategories: SentenceSubcategory[] = Array.from(subcategoryMap.entries()).map(([subcategoryId, count]) => ({
          id: subcategoryId,
          name: subcategoryId,
          displayName: SUBCATEGORY_DISPLAY_NAMES[subcategoryId] || subcategoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          categoryId,
          sentenceCount: count
        }));

        const totalSentences = Array.from(subcategoryMap.values()).reduce((sum, count) => sum + count, 0);

        return {
          id: categoryId,
          name: categoryId,
          displayName: CATEGORY_DISPLAY_NAMES[categoryId] || categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: CATEGORY_ICONS[categoryId] || BookOpen,
          color: CATEGORY_COLORS[categoryId] || 'from-gray-500 to-gray-600',
          subcategories,
          sentenceCount: totalSentences
        };
      });

      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Check for URL parameters and auto-start game
  useEffect(() => {
    const checkUrlParams = async () => {
      console.log('🔍 [UnifiedSentenceCategorySelector] Checking URL params...', {
        urlParamsChecked,
        gameName
      });

      if (urlParamsChecked) {
        console.log('❌ [UnifiedSentenceCategorySelector] URL params already checked');
        return;
      }

      const lang = searchParams?.get('lang');
      const level = searchParams?.get('level') as 'KS2' | 'KS3' | 'KS4' | 'KS5';
      const cat = searchParams?.get('cat');
      const subcat = searchParams?.get('subcat');

      console.log('📋 [UnifiedSentenceCategorySelector] URL Parameters:', { lang, level, cat, subcat });

      if (lang && level && cat) {
        console.log(`✅ [UnifiedSentenceCategorySelector] Found URL parameters, auto-starting ${gameName}...`);

        // Map language codes to full names
        const languageMap: { [key: string]: string } = {
          'es': 'spanish',
          'fr': 'french',
          'de': 'german'
        };

        const fullLanguage = languageMap[lang] || lang;

        const config: SentenceSelectionConfig = {
          language: fullLanguage,
          curriculumLevel: level,
          categoryId: cat,
          subcategoryId: subcat || undefined,
          customMode: false
        };

        console.log(`🚀 [UnifiedSentenceCategorySelector] Auto-completing selection for ${gameName}:`, config);
        onSelectionComplete(config);
      } else {
        console.log(`❌ [UnifiedSentenceCategorySelector] Missing required URL parameters:`, { lang, level, cat });
      }

      setUrlParamsChecked(true);
    };

    checkUrlParams();
  }, [searchParams, urlParamsChecked, gameName, onSelectionComplete]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setStep('curriculum');
  };

  const handleCurriculumSelect = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
    // Check if this is a coming soon level
    const selectedLevel = CURRICULUM_LEVELS.find(l => l.code === level);
    if (selectedLevel?.comingSoon) {
      alert('This curriculum level is coming soon! Please select KS3 for now.');
      return;
    }

    setSelectedCurriculumLevel(level);
    loadCategories(selectedLanguage, level);
    setStep('category');
  };

  const handleCategorySelect = (categoryId: string) => {
    if (isDemoRestricted(categoryId)) {
      return; // Don't allow selection of restricted categories
    }

    setSelectedCategory(categoryId);
    const category = categories.find(cat => cat.id === categoryId);

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
    onSelectionComplete({
      language: selectedLanguage,
      curriculumLevel: selectedCurriculumLevel,
      categoryId: selectedCategory,
      subcategoryId
    });
  };

  const handleCustomMode = () => {
    // For custom mode, we'll skip the sentence loading step
    // and let the game handle custom sentence input
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
                onCustomMode={showCustomMode ? handleCustomMode : undefined}
                selectedLanguage={selectedLanguage}
              />
            )}

            {step === 'category' && (
              <CategorySelection
                categories={categories}
                onSelect={handleCategorySelect}
                onCustomMode={showCustomMode ? handleCustomMode : undefined}
                isDemoRestricted={isDemoRestricted}
                loading={loading}
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
        <div className="rounded-sm overflow-hidden flex justify-center items-center" style={{ width: '1.5rem', height: '1.5rem' }}>
          <ReactCountryFlag countryCode="ES" svg style={{ width: '2.25rem', height: '2.25rem' }} />
        </div>
        <div className="rounded-sm overflow-hidden flex justify-center items-center" style={{ width: '1.5rem', height: '1.5rem' }}>
          <ReactCountryFlag countryCode="FR" svg style={{ width: '2.25rem', height: '2.25rem' }} />
        </div>
        <div className="rounded-sm overflow-hidden flex justify-center items-center" style={{ width: '1.5rem', height: '1.5rem' }}>
          <ReactCountryFlag countryCode="DE" svg style={{ width: '2.25rem', height: '2.25rem' }} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Language</h2>
      <p className="text-white/80">Select the language you want to practice sentences in</p>
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
          Learning {language?.name} sentences - Select your educational level
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
  categories: SentenceCategory[];
  onSelect: (categoryId: string) => void;
  onCustomMode?: () => void;
  isDemoRestricted: (categoryId: string) => boolean;
  loading: boolean;
}> = ({ categories, onSelect, onCustomMode, isDemoRestricted, loading }) => (
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
      <p className="text-white/80">Select the sentence theme you want to practice</p>
    </div>

    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <span className="ml-4 text-white">Loading categories...</span>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const isRestricted = isDemoRestricted(category.id);
          const IconComponent = category.icon;

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
                    <IconComponent className="h-8 w-8" />
                    {isRestricted && (
                      <Lock className="h-5 w-5 text-white/80" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-left">{category.displayName}</h3>
                  <p className="text-white/90 text-sm text-left mb-3">
                    {category.sentenceCount} sentences available
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
              <Sparkles className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-bold mb-2 text-left">Custom Sentences</h3>
              <p className="text-white/90 text-sm text-left mb-3">
                Create your own sentence list
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs">Your sentences</span>
                <ArrowRight className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        )}
      </div>
    )}
  </motion.div>
);

// Subcategory Selection Component
const SubcategorySelection: React.FC<{
  category: SentenceCategory;
  onSelect: (subcategoryId: string) => void;
}> = ({ category, onSelect }) => {
  const IconComponent = category.icon;

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
          Select from <span className="font-semibold">{category.displayName}</span> topics
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
              <IconComponent className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-bold mb-2 text-left">{subcategory.displayName}</h3>
              <p className="text-white/90 text-sm text-left mb-3">
                {subcategory.sentenceCount} sentences available
              </p>
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