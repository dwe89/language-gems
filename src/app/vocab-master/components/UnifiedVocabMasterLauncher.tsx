'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';

import {
  ArrowRight, Shuffle, Target, Brain, Headphones, BookOpen,
  TrendingUp, Clock, Settings, Play, Lightbulb, Zap,
  RotateCcw, Flame, Trophy, ChevronRight, Volume2, Keyboard,
  PenTool, CreditCard, Mic, Sparkles, ToggleLeft, ToggleRight,
  ChevronDown, Globe, GraduationCap, FolderOpen, BarChart3, Award, Link
} from 'lucide-react';
import { useGameVocabulary } from '../../../hooks/useGameVocabulary';
import { getCategoriesByCurriculum } from '../../../components/games/KS4CategorySystem';
import { VOCABULARY_CATEGORIES } from '../../../components/games/ModernCategorySelector';

// Unified Game Mode Interface
interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'learning' | 'practice' | 'review' | 'challenge' | 'core' | 'skills';
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Variable';
  isRecommended?: boolean;
  isPremium?: boolean;
  source: 'vocab-master' | 'vocab-mining' | 'unified';
}

// Streamlined Mode Definitions - Professional color palette for intelligent learning
const CONSOLIDATED_GAME_MODES: GameMode[] = [
  // I. Core Learning & Review (Primary, recurring activities)
  {
    id: 'learn_new',
    name: 'Learn New Words',
    description: 'Start with unfamiliar vocabulary. Choose your practice style inside!',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-teal-600 to-blue-700',
    category: 'core',
    estimatedTime: '10-15 min',
    difficulty: 'Beginner',
    isRecommended: true,
    source: 'unified'
  },
  {
    id: 'review_weak',
    name: 'Review Weak Words',
    description: 'Practice words you find challenging. Multiple practice styles available!',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-rose-600 to-violet-700',
    category: 'core',
    estimatedTime: '8-12 min',
    difficulty: 'Variable',
    source: 'unified'
  },
  {
    id: 'mixed_review',
    name: 'Mixed Review',
    description: 'Practice all your vocabulary with different exercise types',
    icon: <Shuffle className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-indigo-700 to-purple-800',
    category: 'core',
    estimatedTime: '10-20 min',
    difficulty: 'Variable',
    source: 'unified'
  },

  // II. Skill Builders & Specific Practice
  {
    id: 'context_practice',
    name: 'Context Practice',
    description: 'Learn words within full sentences and real examples',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-emerald-600 to-teal-700',
    category: 'skills',
    estimatedTime: '12-18 min',
    difficulty: 'Intermediate',
    source: 'unified'
  },
  {
    id: 'dictation',
    name: 'Dictation',
    description: 'Listen carefully and type what you hear',
    icon: <PenTool className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-indigo-600 to-blue-700',
    category: 'skills',
    estimatedTime: '8-12 min',
    difficulty: 'Advanced',
    source: 'unified'
  },
  {
    id: 'listening_comprehension',
    name: 'Listening Comprehension',
    description: 'Listen to words and type the English translation',
    icon: <Headphones className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-blue-600 to-cyan-700',
    category: 'skills',
    estimatedTime: '10-15 min',
    difficulty: 'Intermediate',
    source: 'unified'
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Quick self-assessment - do you know this word?',
    icon: <CreditCard className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-red-600 to-rose-700',
    category: 'skills',
    estimatedTime: '5-10 min',
    difficulty: 'Beginner',
    source: 'unified'
  },
  {
    id: 'matching',
    name: 'Match-Up Challenge',
    description: 'Connect Spanish words with their English translations',
    icon: <Link className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-pink-600 to-rose-700',
    category: 'skills',
    estimatedTime: '8-12 min',
    difficulty: 'Intermediate',
    source: 'unified'
  },

  // III. Challenges & Speed
  {
    id: 'speed_challenge',
    name: 'Speed Challenge',
    description: 'Test your reaction time - answer before time runs out!',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    category: 'challenge',
    estimatedTime: '5-8 min',
    difficulty: 'Intermediate',
    source: 'unified'
  },
  {
    id: 'word_builder',
    name: 'Word Builder',
    description: 'Build words letter by letter with hints and clues',
    icon: <Keyboard className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-emerald-600 to-green-700',
    category: 'challenge',
    estimatedTime: '10-15 min',
    difficulty: 'Intermediate',
    source: 'unified'
  },

  {
    id: 'word_race',
    name: 'Word Race',
    description: 'Competitive speed typing - beat your best time!',
    icon: <Trophy className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-orange-600 to-red-700',
    category: 'challenge',
    estimatedTime: '5-10 min',
    difficulty: 'Advanced',
    source: 'unified'
  }
];

interface UnifiedVocabMasterLauncherProps {
  onGameStart: (mode: string, vocabulary: any[], config: Record<string, any>) => void;
  onBack: () => void;
  presetConfig?: {
    language?: string;
    curriculumLevel?: 'KS2' | 'KS3' | 'KS4' | 'KS5';
    categoryId?: string;
    subcategoryId?: string;
    examBoard?: 'AQA' | 'edexcel';
    tier?: 'foundation' | 'higher';
  } | null;
  onFilterChange?: (config: { language: string; curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5'; categoryId: string; subcategoryId: string }) => void;
}

export default function UnifiedVocabMasterLauncher({ onGameStart, onBack, presetConfig, onFilterChange }: UnifiedVocabMasterLauncherProps) {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const { supabase } = useSupabase();

  // Dynamic filter state - the core of the new single-page experience
  const [selectedLanguage, setSelectedLanguage] = useState<string>(presetConfig?.language || 'spanish');
  const [selectedLevel, setSelectedLevel] = useState<'KS2' | 'KS3' | 'KS4' | 'KS5'>(presetConfig?.curriculumLevel || 'KS3');
  const [selectedCategory, setSelectedCategory] = useState<string>(presetConfig?.categoryId || ''); // Default to "All Topics"
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(presetConfig?.subcategoryId || ''); // Default to "All Subtopics"

  // KS4-specific state
  const [selectedExamBoard, setSelectedExamBoard] = useState<'AQA' | 'edexcel'>('AQA');
  const [selectedTier, setSelectedTier] = useState<'foundation' | 'higher'>('foundation');

  // Dynamic categories based on curriculum level and exam board
  const [availableCategories, setAvailableCategories] = useState<Array<{ value: string, label: string }>>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Array<{ value: string, label: string }>>([]);

  // Track initialization state to prevent infinite loops
  const [isInitialized, setIsInitialized] = useState(false);

  // Store the applied preset config to prevent losing it
  const [appliedPresetConfig, setAppliedPresetConfig] = useState<typeof presetConfig>(null);

  // Update state when presetConfig changes (but don't lose it once applied)
  useEffect(() => {
    console.log('🔄 Preset config effect running:', { presetConfig, appliedPresetConfig, isInitialized });
    if (presetConfig && (!appliedPresetConfig || JSON.stringify(presetConfig) !== JSON.stringify(appliedPresetConfig))) {
      console.log('✅ Applying preset config:', presetConfig);
      setSelectedLanguage(presetConfig.language || 'spanish');
      setSelectedLevel(presetConfig.curriculumLevel || 'KS3');
      setSelectedCategory(presetConfig.categoryId || '');
      setSelectedSubcategory(presetConfig.subcategoryId || '');
      // Set KS4-specific parameters from preset config
      if (presetConfig.examBoard) {
        setSelectedExamBoard(presetConfig.examBoard as 'AQA' | 'edexcel');
      }
      if (presetConfig.tier) {
        setSelectedTier(presetConfig.tier as 'foundation' | 'higher');
      }
      setAppliedPresetConfig(presetConfig);
      // Only set isInitialized to true ONCE after applying preset config
      if (!isInitialized) setIsInitialized(true);
      console.log('✅ State updated to:', {
        language: presetConfig.language,
        category: presetConfig.categoryId,
        subcategory: presetConfig.subcategoryId
      });
    } else if (!presetConfig && appliedPresetConfig && isInitialized) {
      console.log('⚠️ Preset config became null but we already applied one - keeping current state');
    } else if (!presetConfig && !isInitialized) {
      console.log('❌ No preset config available - initializing with defaults');
      setIsInitialized(true); // Initialize with defaults
    } else {
      console.log('👌 No preset config change or already initialized/applied.');
    }
  }, [presetConfig, appliedPresetConfig, isInitialized]);

  // Game state management
  // If you need a local loading state, use a different variable name
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showPracticeMethodSelector, setShowPracticeMethodSelector] = useState(false);
  const [selectedPracticeMethod, setSelectedPracticeMethod] = useState<'multiple_choice' | 'typing' | 'mixed'>('multiple_choice');

  // Category filter for game modes (separate from content category)
  const [gameModeCategory, setGameModeCategory] = useState<string>('all');



  // Settings
  const [settings, setSettings] = useState({
    wordsPerSession: 20,
    difficulty: 'mixed',
    audioEnabled: true,
    theme: 'mixed'
  });

  // Dynamic vocabulary loading based on current filter selection
  const vocabularyParams = useMemo(() => {
    const params = {
      language: selectedLanguage === 'spanish' ? 'es' : selectedLanguage === 'french' ? 'fr' : 'de',
      categoryId: selectedCategory === '' ? undefined : selectedCategory, // Empty string means "All Topics"
      subcategoryId: selectedSubcategory === '' ? undefined : selectedSubcategory, // Empty string means "All Subtopics"
      curriculumLevel: selectedLevel,
      // KS4-specific parameters
      examBoard: selectedLevel === 'KS4' ? selectedExamBoard : undefined,
      tier: selectedLevel === 'KS4' ? selectedTier : undefined,
      limit: 500, // Increased limit to get more realistic counts
      randomize: true
    };
    console.log('🎯 Vocabulary params:', params, 'from state:', {
      selectedLanguage,
      selectedCategory,
      selectedSubcategory,
      selectedLevel,
      presetConfig
    });
    return params;
  }, [selectedLanguage, selectedCategory, selectedSubcategory, selectedLevel, selectedExamBoard, selectedTier]);

  const {
    vocabulary,
    loading: vocabularyLoading,
    error: vocabularyError
  } = useGameVocabulary({
    ...vocabularyParams,
    enabled: isInitialized // Only fetch vocabulary after component is properly initialized
  });

  // Get realistic vocabulary count based on selection
  const getVocabularyCount = () => {
    if (vocabularyLoading) return '...';
    if (vocabularyError) return '0';
    if (vocabulary.length === 0) return '0';

    // Show actual count, but if it hits the limit, indicate there are more
    if (vocabulary.length >= 500) {
      return '500+';
    }
    return vocabulary.length.toString();
  };

  // User stats
  const [userStats, setUserStats] = useState({
    wordsLearned: 0,
    totalWords: 0,
    currentStreak: 0,
    weeklyGoal: 50,
    weeklyProgress: 0
  });

  // Load categories dynamically based on curriculum level and exam board
  const loadCategories = () => {
    if (selectedLevel === 'KS4') {
      const categories = getCategoriesByCurriculum('KS4', selectedExamBoard);
      const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.displayName
      }));
      setAvailableCategories(categoryOptions);
    } else {
      // For KS3 and other levels, use the standard categories
      const categories = selectedLevel === 'KS3' ? VOCABULARY_CATEGORIES : [];
      const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.displayName
      }));
      setAvailableCategories(categoryOptions);
    }
  };

  // Load subcategories when category changes
  const loadSubcategories = (categoryId: string) => {
    if (!categoryId) {
      setAvailableSubcategories([]);
      return;
    }

    if (selectedLevel === 'KS4') {
      const categories = getCategoriesByCurriculum('KS4', selectedExamBoard);
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      if (selectedCategory) {
        const subcategoryOptions = selectedCategory.subcategories.map(sub => ({
          value: sub.id,
          label: sub.displayName
        }));
        setAvailableSubcategories(subcategoryOptions);
      }
    } else {
      // For KS3, load from database
      loadAvailableSubtopics(categoryId);
    }
  };

  // Load available subtopics when category changes (for KS3 and fallback)
  const loadAvailableSubtopics = async (categoryId: string) => {
    if (!supabase || !categoryId) {
      setAvailableSubcategories([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('centralized_vocabulary')
        .select('subcategory')
        .eq('category', categoryId)
        .not('subcategory', 'is', null)
        .order('subcategory');

      if (error) throw error;

      // Get unique subtopics and format them
      const uniqueSubtopics = [...new Set(data.map(item => item.subcategory))]
        .filter(Boolean)
        .map(subcategory => ({
          value: subcategory,
          label: subcategory.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
        }));

      setAvailableSubcategories(uniqueSubtopics);
    } catch (error) {
      console.error('Error loading subtopics:', error);
      setAvailableSubcategories([]);
    }
  };

  // Load categories when level or exam board changes
  useEffect(() => {
    loadCategories();
    // Reset category and subcategory when level/exam board changes
    if (isInitialized && !presetConfig) {
      setSelectedCategory('');
      setSelectedSubcategory('');
    }
  }, [selectedLevel, selectedExamBoard, isInitialized, presetConfig]);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== '') {
      loadSubcategories(selectedCategory);
    } else {
      setAvailableSubcategories([]);
    }
    // Only reset subtopic when category changes AND we're not initializing from presetConfig
    if (isInitialized && !presetConfig) {
      setSelectedSubcategory('');
    }
  }, [selectedCategory, selectedLevel, selectedExamBoard, supabase, isInitialized, presetConfig]);

  // Load user stats when filters change
  useEffect(() => {
    loadUserStats();
  }, [selectedLanguage, selectedLevel, selectedCategory, selectedSubcategory]);

  // Notify parent of filter changes (only when filters actually change, not on mount)

  useEffect(() => {
    // Notify parent of filter changes when user manually changes filters
    if (isInitialized && onFilterChange) {
      console.log('📤 Notifying parent of filter changes:', {
        language: selectedLanguage,
        curriculumLevel: selectedLevel,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory
      });
      onFilterChange({
        language: selectedLanguage,
        curriculumLevel: selectedLevel,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory
      });
    }
  }, [selectedLanguage, selectedLevel, selectedCategory, selectedSubcategory, isInitialized, onFilterChange]);

  const loadUserStats = async () => {
    if (!user || !supabase) {
      setUserStats({
        wordsLearned: 0,
        totalWords: vocabulary.length,
        currentStreak: 0,
        weeklyGoal: 50,
        weeklyProgress: 0
      });
      return;
    }

    try {
      // Map UI language selection to database language values
      const languageMapping: { [key: string]: string } = {
        'spanish': 'spanish',
        'es': 'spanish',
        'french': 'french',
        'fr': 'french',
        'german': 'german',
        'de': 'german'
      };
      const dbLanguage = languageMapping[selectedLanguage] || 'spanish';

      console.log('🔍 Loading user stats for:', { selectedLanguage, dbLanguage, selectedLevel, user: user.id });

      // Query word_performance_logs for this specific user and language/level combination
      let performanceQuery = supabase
        .from('word_performance_logs')
        .select(`
          *,
          enhanced_game_sessions!inner(student_id)
        `)
        .eq('enhanced_game_sessions.student_id', user.id)
        .eq('language', dbLanguage);

      // Add curriculum level filter if available
      if (selectedLevel) {
        performanceQuery = performanceQuery.eq('curriculum_level', selectedLevel);
      }

      const { data: performanceData, error } = await performanceQuery;

      if (error) {
        console.error('❌ Error loading user performance data:', error);
      } else {
        console.log('📊 Performance data loaded:', performanceData?.length || 0, 'records');
      }

      // Also check user_vocabulary_progress table for additional stats
      const { data: vocabProgressData, error: vocabError } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id);

      if (vocabError) {
        console.error('❌ Error loading vocabulary progress:', vocabError);
      } else {
        console.log('📈 Vocabulary progress data loaded:', vocabProgressData?.length || 0, 'records');
      }

      // Also check vocabulary_gem_collection for spaced repetition progress
      // Join with centralized_vocabulary to filter by language and curriculum level
      let gemQuery = supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          centralized_vocabulary!inner(
            language,
            curriculum_level
          )
        `)
        .eq('student_id', user.id)
        .eq('centralized_vocabulary.language', dbLanguage);

      // Add curriculum level filter if available
      if (selectedLevel) {
        gemQuery = gemQuery.eq('centralized_vocabulary.curriculum_level', selectedLevel);
      }

      const { data: gemCollectionData, error: gemError } = await gemQuery;

      if (gemError) {
        console.error('❌ Error loading gem collection data:', gemError);
      } else {
        console.log('💎 Gem collection data loaded:', gemCollectionData?.length || 0, 'records');
      }

      // Calculate stats from performance data
      const totalAttempts = performanceData?.length || 0;
      const correctAttempts = performanceData?.filter(log => log.was_correct).length || 0;
      const uniqueWordsFromPerformance = new Set(performanceData?.map(log => log.word_text) || []).size;
      const learnedWordsFromProgress = vocabProgressData?.filter(item => item.is_learned).length || 0;

      // Calculate learned words from gem collection (mastery level >= 3)
      const learnedWordsFromGems = gemCollectionData?.filter(item => item.mastery_level >= 3).length || 0;

      // Use the highest count from all sources
      const wordsLearned = Math.max(uniqueWordsFromPerformance, learnedWordsFromProgress, learnedWordsFromGems);

      console.log('📊 Words learned calculation:', {
        uniqueWordsFromPerformance,
        learnedWordsFromProgress,
        learnedWordsFromGems,
        finalWordsLearned: wordsLearned
      });

      // Calculate current streak from consecutive practice days (not consecutive correct answers)
      const sortedLogs = (performanceData || []).sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      let currentStreak = 0;
      if (sortedLogs.length > 0) {
        // Group performance data by calendar day (YYYY-MM-DD format)
        const practiceByDay = new Map<string, boolean>();

        sortedLogs.forEach(log => {
          const dayKey = new Date(log.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
          practiceByDay.set(dayKey, true);
        });

        // Get sorted array of practice days (most recent first)
        const practiceDays = Array.from(practiceByDay.keys()).sort().reverse();

        // Calculate consecutive days streak
        const today = new Date().toISOString().split('T')[0];
        let checkDate = new Date();

        // Start from today and work backwards
        for (let i = 0; i < 365; i++) { // Check up to 365 days back
          const dayKey = checkDate.toISOString().split('T')[0];

          if (practiceDays.includes(dayKey)) {
            currentStreak++;
            // Move to previous day
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            // If today has no practice, allow one day gap (streak continues if practiced yesterday)
            if (i === 0 && dayKey === today) {
              checkDate.setDate(checkDate.getDate() - 1);
              continue;
            }
            // Otherwise, streak is broken
            break;
          }
        }
      }

      // Calculate weekly progress (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyCorrectWords = performanceData?.filter(log =>
        new Date(log.timestamp) >= weekAgo && log.was_correct
      ).length || 0;

      const finalStats = {
        wordsLearned,
        totalWords: Math.max(vocabulary.length, wordsLearned + 50), // Add buffer for realistic total
        currentStreak,
        weeklyGoal: 50,
        weeklyProgress: weeklyCorrectWords
      };

      console.log('📈 Final user stats calculated:', finalStats);
      setUserStats(finalStats);

    } catch (error) {
      console.error('❌ Error in loadUserStats:', error);
      setUserStats({
        wordsLearned: 0,
        totalWords: vocabulary.length,
        currentStreak: 0,
        weeklyGoal: 50,
        weeklyProgress: 0
      });
    }
  };

  // Filter modes by game mode category (not content category)
  const getFilteredModes = () => {
    return gameModeCategory === 'all'
      ? CONSOLIDATED_GAME_MODES
      : CONSOLIDATED_GAME_MODES.filter(mode => mode.category === gameModeCategory);
  };

  // Start game session
  const startGameSession = async (modeId: string) => {
    setLocalLoading(true);
    setSelectedMode(modeId);

    try {
      // Get vocabulary subset based on mode
      let vocabularySubset = vocabulary.slice(0, settings.wordsPerSession);

      // Apply mode-specific vocabulary filtering logic here
      // (This would include the complex logic from both original games)

      const gameConfig = {
        wordsPerSession: Math.min(settings.wordsPerSession, vocabularySubset.length),
        difficulty: settings.difficulty,
        audioEnabled: settings.audioEnabled,
        theme: 'mastery',
        mode: modeId,
        gamificationEnabled: false,
        // Include current filter context
        language: selectedLanguage,
        curriculumLevel: selectedLevel,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory
      };

      console.log('🎯 Starting VocabMaster with context:', {
        mode: modeId,
        language: selectedLanguage,
        level: selectedLevel,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        vocabularyCount: vocabularySubset.length
      });

      console.log('🎮 Starting game with config:', {
        theme: 'mastery',
        gamificationEnabled: false,
        gameConfig
      });

      onGameStart(modeId, vocabularySubset, gameConfig);
    } catch (error) {
      console.error('Error starting game session:', error);
      setLocalLoading(false);
      setSelectedMode('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-full shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">VocabMaster</h1>
          <p className="text-gray-600 text-lg">
            Master vocabulary with intelligent learning modes
          </p>
        </motion.div>

        {/* Dynamic Filter Bar - Only show if no preset config or if user wants to change */}
        {(!presetConfig || showSettings) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Choose Your Learning Focus
                </h3>
                <div className="text-sm text-gray-500">
                  {getVocabularyCount()} words available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Language Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>

                {/* Level Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="h-4 w-4 inline mr-1" />
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as 'KS2' | 'KS3' | 'KS4' | 'KS5')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="KS2">KS2 (Ages 7-11)</option>
                    <option value="KS3">KS3 (Ages 11-14)</option>
                    <option value="KS4">KS4 (Ages 14-16)</option>
                    <option value="KS5">KS5 (Ages 16-18)</option>
                  </select>
                </div>

                {/* Exam Board Selector - Only show for KS4 */}
                {selectedLevel === 'KS4' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Award className="h-4 w-4 inline mr-1" />
                      Exam Board
                    </label>
                    <select
                      value={selectedExamBoard}
                      onChange={(e) => setSelectedExamBoard(e.target.value as 'AQA' | 'edexcel')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="AQA">AQA</option>
                      <option value="edexcel">Edexcel</option>
                    </select>
                  </div>
                )}

                {/* Tier Selector - Only show for KS4 */}
                {selectedLevel === 'KS4' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Target className="h-4 w-4 inline mr-1" />
                      Tier
                    </label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value as 'foundation' | 'higher')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="foundation">Foundation Tier (Grades 1-5)</option>
                      <option value="higher">Higher Tier (Grades 4-9)</option>
                    </select>
                  </div>
                )}

                {/* Category Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FolderOpen className="h-4 w-4 inline mr-1" />
                    Topic
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Topics</option>
                    {availableCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subtopic Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BarChart3 className="h-4 w-4 inline mr-1" />
                    Subtopic
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!selectedCategory || selectedCategory === ''}
                  >
                    <option value="">All Subtopics</option>
                    {availableSubcategories.map(subcategory => (
                      <option key={subcategory.value} value={subcategory.value}>
                        {subcategory.label}
                      </option>
                    ))}
                  </select>
                  {(!selectedCategory || selectedCategory === '') && (
                    <p className="text-xs text-gray-500 mt-1">Select a topic first to see subtopics</p>
                  )}
                </div>
              </div>

              {/* Done button when changing preset config */}
              {presetConfig && showSettings && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}

              {vocabularyError && (
                <div className="mt-4 text-center text-red-500">
                  Error loading vocabulary. Please try again.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Pre-selected Categories Summary - Show when categories are preset */}
        {presetConfig && !showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Selected Learning Focus
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {getVocabularyCount()} words available
                  </div>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Change
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Language</div>
                  <div className="text-lg font-semibold text-blue-700 capitalize">
                    {selectedLanguage}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Level</div>
                  <div className="text-lg font-semibold text-green-700">
                    {selectedLevel}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Topic</div>
                  <div className="text-lg font-semibold text-purple-700">
                    {selectedCategory ? selectedCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Topics'}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Subtopic</div>
                  <div className="text-lg font-semibold text-orange-700">
                    {selectedSubcategory ? selectedSubcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Subtopics'}
                  </div>
                </div>
              </div>

              {vocabularyError && (
                <div className="mt-4 text-center text-red-500">
                  Error loading vocabulary. Please try again.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Context-Aware User Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Your Progress in {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} ({selectedLevel})
              </h3>
              <div className="text-sm text-gray-500">
                {selectedCategory === '' ? 'All Topics' : selectedCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {selectedSubcategory && selectedSubcategory !== '' && ` • ${selectedSubcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                {selectedSubcategory === '' && selectedCategory !== '' && ' • All Subtopics'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{userStats.wordsLearned}</div>
                <div className="text-sm text-gray-600 font-medium">Words Mastered</div>
                <div className="text-xs text-gray-400">in this selection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{userStats.currentStreak}</div>
                <div className="text-sm text-gray-600 font-medium">Day Streak</div>
                <div className="text-xs text-gray-400">overall</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{userStats.weeklyProgress}</div>
                <div className="text-sm text-gray-600 font-medium">Weekly Correct Attempts</div>
                <div className="text-xs text-gray-400">{userStats.weeklyGoal - userStats.weeklyProgress} to goal</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {userStats.totalWords > 0 ? Math.round((userStats.wordsLearned / userStats.totalWords) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 font-medium">Mastery Progress</div>
                <div className="text-xs text-gray-400">{userStats.totalWords} total available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Primary Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <button
              onClick={() => {
                // Determine the best mode based on user stats
                const hasWeakWords = userStats.wordsLearned > 0 && userStats.wordsLearned < userStats.totalWords * 0.5;
                const recommendedMode = hasWeakWords ? 'review_weak' : 'learn_new';
                startGameSession(recommendedMode);
              }}
              disabled={vocabularyLoading || vocabulary.length === 0}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center space-x-3">
                <Play className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-lg font-bold">
                    {userStats.wordsLearned > 0 && userStats.wordsLearned < userStats.totalWords * 0.5
                      ? `Review ${Math.min(20, vocabulary.length)} Weak Words`
                      : 'Start Learning New Words'}
                  </div>
                  <div className="text-sm text-blue-100">
                    {vocabularyLoading ? 'Loading...' : vocabulary.length === 0 ? 'No vocabulary available' : 'Recommended next step'}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'core', label: 'Core Learning' },
              { id: 'skills', label: 'Skill Builders' },
              { id: 'challenge', label: 'Challenges' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setGameModeCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${gameModeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mode Grid with Section Headers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {gameModeCategory === 'all' ? (
            // Show all modes organized by sections
            <>
              {/* Core Learning & Review Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg mr-3">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Core Learning & Review</h3>
                </div>
                <p className="text-gray-600 mb-6 text-base">
                  Primary activities that use spaced repetition to help you learn and remember vocabulary
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CONSOLIDATED_GAME_MODES.filter(mode => mode.category === 'core').map((mode, index) => (
                    <ModeCard key={mode.id} mode={mode} index={index} onSelect={startGameSession} isLoading={isLoading} selectedMode={selectedMode} vocabularyLength={vocabulary.length} />
                  ))}
                </div>
              </div>

              {/* Skill Builders Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-2 rounded-lg mr-3">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Skill Builders & Specific Practice</h3>
                </div>
                <p className="text-gray-600 mb-6 text-base">
                  Focused practice modes to develop specific language skills like listening and context understanding
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CONSOLIDATED_GAME_MODES.filter(mode => mode.category === 'skills').map((mode, index) => (
                    <ModeCard key={mode.id} mode={mode} index={index + 3} onSelect={startGameSession} isLoading={isLoading} selectedMode={selectedMode} vocabularyLength={vocabulary.length} />
                  ))}
                </div>
              </div>

              {/* Challenges Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg mr-3">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Challenges & Speed</h3>
                </div>
                <p className="text-gray-600 mb-6 text-base">
                  Test your skills under time pressure and compete with yourself
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CONSOLIDATED_GAME_MODES.filter(mode => mode.category === 'challenge').map((mode, index) => (
                    <ModeCard key={mode.id} mode={mode} index={index + 7} onSelect={startGameSession} isLoading={isLoading} selectedMode={selectedMode} vocabularyLength={vocabulary.length} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Show filtered modes in simple grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredModes().map((mode, index) => (
                <ModeCard key={mode.id} mode={mode} index={index} onSelect={startGameSession} isLoading={isLoading} selectedMode={selectedMode} vocabularyLength={vocabulary.length} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Extracted ModeCard component for reusability
interface ModeCardProps {
  mode: GameMode;
  index: number;
  onSelect: (modeId: string) => void;
  isLoading: boolean;
  selectedMode: string;
  vocabularyLength: number;
}

function ModeCard({ mode, index, onSelect, isLoading, selectedMode, vocabularyLength }: ModeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={() => onSelect(mode.id)}
        disabled={isLoading && selectedMode === mode.id || vocabularyLength === 0}
        className={`w-full text-left p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${isLoading && selectedMode === mode.id || vocabularyLength === 0
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:transform hover:-translate-y-1'
          }`}
      >
        <div className={`absolute inset-0 ${mode.color} opacity-90`} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/90">
              {mode.icon}
            </div>
            <div className="flex space-x-1">
              {mode.isRecommended && (
                <div className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                  Recommended
                </div>
              )}
              {mode.isPremium && (
                <div className="bg-purple-400 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
                  Premium
                </div>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {mode.name}
          </h3>

          <p className="text-white/90 text-sm leading-relaxed">
            {mode.description}
          </p>

          {isLoading && selectedMode === mode.id && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </button>
    </motion.div>
  );
}