'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { SpacedRepetitionService } from '../../../../services/spacedRepetitionService';
import {
  ArrowRight, Shuffle, Target, Brain, Headphones, BookOpen,
  TrendingUp, Clock, Settings, Play, Lightbulb, Zap,
  RotateCcw, Flame, Trophy, ChevronRight, Volume2, Grid3X3
} from 'lucide-react';
import VocabularyMiningGame from './VocabularyMiningGame';

// Category system imports
import DemoAwareCategorySelector from '../../../../components/games/DemoAwareCategorySelector';
import { useDemoGameVocabulary } from '../../../../hooks/useDemoGameVocabulary';

// Helper function to get category display name
const getCategoryById = (id: string) => {
  const categoryMap: Record<string, { displayName: string }> = {
    'basics_core_language': { displayName: 'Basics & Core Language' },
    'identity_personal_life': { displayName: 'Identity & Personal Life' },
    'home_local_area': { displayName: 'Home & Local Area' },
    'school_jobs_future': { displayName: 'School, Jobs & Future' },
    'free_time_leisure': { displayName: 'Free Time & Leisure' },
    'food_drink': { displayName: 'Food & Drink' },
    'clothes_shopping': { displayName: 'Clothes & Shopping' },
    'technology_media': { displayName: 'Technology & Media' },
    'health_lifestyle': { displayName: 'Health & Lifestyle' },
    'holidays_travel_culture': { displayName: 'Holidays, Travel & Culture' },
    'nature_environment': { displayName: 'Nature & Environment' },
    'social_global_issues': { displayName: 'Social & Global Issues' },
    'general_concepts': { displayName: 'General Concepts' },
    'daily_life': { displayName: 'Daily Life' }
  };
  return categoryMap[id] || { displayName: id };
};

interface VocabularyWord {
  id: string | number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
  part_of_speech: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  times_seen?: number;
  times_correct?: number;
  last_seen?: Date;
  is_learned?: boolean;
  mastery_level?: number;
  difficulty_rating?: number;
}

interface GameSession {
  mode: string;
  vocabulary: VocabularyWord[];
  settings: GameSettings;
}

interface GameSettings {
  wordsPerSession: number;
  showTranslations: boolean;
  enableAudio: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  theme?: string;
  topic?: string;
  category?: string;
  subcategory?: string;
}

// Learning modes configuration
const LEARNING_MODES = [
  {
    id: 'learn_new',
    name: 'Learn New Words',
    description: 'Discover vocabulary you haven\'t seen before',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-green-400 to-blue-500'
  },
  {
    id: 'review_weak',
    name: 'Review Weak Words',
    description: 'Practice words you\'re struggling with',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-red-400 to-pink-500'
  },
  {
    id: 'spaced_repetition',
    name: 'Spaced Repetition',
    description: 'Review words at optimal intervals',
    icon: <Brain className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-purple-400 to-indigo-500'
  },
  {
    id: 'listening_practice',
    name: 'Listening Practice',
    description: 'Focus on pronunciation and audio recognition',
    icon: <Headphones className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
  },
  {
    id: 'speed_challenge',
    name: 'Speed Challenge',
    description: 'Quick-fire vocabulary practice',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-cyan-400 to-teal-500'
  },
  {
    id: 'comprehensive_review',
    name: 'Comprehensive Review',
    description: 'All exercise types in one session',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-emerald-400 to-green-500'
  },
  {
    id: 'mixed_review',
    name: 'Mixed Review',
    description: 'Random mix of all learned vocabulary',
    icon: <Shuffle className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-indigo-400 to-purple-500'
  },
  {
    id: 'match_up',
    name: 'Match Up',
    description: 'Match words with their translations',
    icon: <Grid3X3 className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-pink-400 to-rose-500'
  }
];

interface VocabularyMiningLauncherProps {
  preselectedConfig?: {
    language: string;
    curriculumLevel: string;
    category: string;
    subcategory?: string;
  };
  onBackToMenu?: () => void;
  streamlinedMode?: boolean; // Hide category selector when true
}

export default function VocabularyMiningLauncher({
  preselectedConfig,
  onBackToMenu,
  streamlinedMode = false
}: VocabularyMiningLauncherProps = {}) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [userStats, setUserStats] = useState({
    wordsLearned: 0,
    totalWords: 0,
    currentStreak: 0,
    weeklyGoal: 50,
    weeklyProgress: 0
  });

  const [gemStats, setGemStats] = useState({
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  });

  const [dailyGoals, setDailyGoals] = useState({
    targetWords: 20,
    wordsPracticed: 0,
    targetMinutes: 30,
    minutesPracticed: 0,
    targetAccuracy: 80,
    currentAccuracy: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCategorySelector, setShowCategorySelector] = useState(!preselectedConfig && !streamlinedMode);
  const [selectedCategory, setSelectedCategory] = useState<string>(preselectedConfig?.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(preselectedConfig?.subcategory || '');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(preselectedConfig?.language || 'es');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    wordsPerSession: 10,
    showTranslations: true,
    enableAudio: true,
    difficulty: 'intermediate'
  });

  // Available languages from database
  const [availableLanguages, setAvailableLanguages] = useState<Array<{code: string, name: string, flag: string}>>([
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' }
  ]);

  // Use the demo-aware vocabulary hook with correct parameters
  const {
    vocabulary: categoryVocabulary,
    loading: vocabularyLoading,
    error: vocabularyError,
    refetch: refetchVocabulary,
    isDemoRestricted,
    demoMessage
  } = useDemoGameVocabulary({
    language: selectedLanguage,
    categoryId: selectedCategory || undefined,
    subcategoryId: selectedSubcategory || undefined,
    limit: 100,
    randomize: true
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadVocabulary();
    }
  }, [user, selectedLanguage]);

  useEffect(() => {
    if (categoryVocabulary && categoryVocabulary.length > 0) {
      // Transform the demo-aware vocabulary data to match the expected interface
      const transformedVocabulary: VocabularyWord[] = categoryVocabulary
        .filter(item => item.word && item.translation)
        .map(item => ({
          id: item.id,
          spanish: selectedLanguage === 'es' ? item.word || '' : item.translation || '',
          english: selectedLanguage === 'es' ? item.translation || '' : item.word || '',
          theme: item.category || 'general',
          topic: item.subcategory || item.category || 'general',
          part_of_speech: item.part_of_speech || 'word',
          example_sentence: item.example_sentence || undefined,
          example_translation: item.example_translation || undefined,
          audio_url: item.audio_url || undefined,
          times_seen: 0,
          times_correct: 0,
          last_seen: undefined,
          is_learned: false,
          mastery_level: 0,
          difficulty_rating: 1
        }));

      console.log('Loaded category vocabulary:', transformedVocabulary.length, 'words for language:', selectedLanguage);
      setVocabulary(transformedVocabulary);
    }
  }, [categoryVocabulary, selectedLanguage]);

  const loadUserStats = async () => {
    if (!user || !supabase) return;

    try {
      // Get user's vocabulary progress from vocabulary_gem_collection (not user_vocabulary_progress)
      const { data: progressData, error: progressError } = await supabase
        .from('vocabulary_gem_collection')
        .select('*')
        .eq('student_id', user.id);

      if (progressError) {
        console.error('Error loading user progress:', progressError);
        return;
      }

      // Calculate stats from vocabulary_gem_collection
      // Count words as "learned" if they have at least 1 correct encounter
      const wordsLearned = progressData?.filter(p => p.correct_encounters > 0).length || 0;
      const totalWords = progressData?.length || 0;

      // Calculate real daily streak from vocabulary_daily_goals
      const { data: dailyGoalsData } = await supabase
        .from('vocabulary_daily_goals')
        .select('goal_date, goal_completed')
        .eq('student_id', user.id)
        .order('goal_date', { ascending: false })
        .limit(30); // Check last 30 days

      // Calculate consecutive days of completed goals
      let currentStreak = 0;
      if (dailyGoalsData && dailyGoalsData.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        let checkDate = new Date(today);

        for (const goal of dailyGoalsData) {
          const goalDate = goal.goal_date;
          const expectedDate = checkDate.toISOString().split('T')[0];

          if (goalDate === expectedDate && goal.goal_completed) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Calculate real weekly progress from recent sessions
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: weeklySessionsData } = await supabase
        .from('enhanced_game_sessions')
        .select('words_practiced')
        .eq('student_id', user.id)
        .eq('game_type', 'vocabulary-mining')
        .gte('created_at', oneWeekAgo.toISOString());

      const weeklyProgress = weeklySessionsData?.reduce((total, session) =>
        total + (session.words_practiced || 0), 0
      ) || 0;

      setUserStats({
        wordsLearned,
        totalWords,
        currentStreak,
        weeklyGoal: 50,
        weeklyProgress
      });

      // Calculate gem statistics by mastery level
      const gemCounts = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      };

      progressData?.forEach(progress => {
        const masteryLevel = progress.mastery_level || 0;
        if (masteryLevel >= 4) {
          gemCounts.legendary++;
        } else if (masteryLevel >= 3) {
          gemCounts.epic++;
        } else if (masteryLevel >= 2) {
          gemCounts.rare++;
        } else if (masteryLevel >= 1) {
          gemCounts.uncommon++;
        } else {
          gemCounts.common++;
        }
      });

      setGemStats(gemCounts);

      // Load today's daily goals
      const today = new Date().toISOString().split('T')[0];
      const { data: todayGoals } = await supabase
        .from('vocabulary_daily_goals')
        .select('*')
        .eq('student_id', user.id)
        .eq('goal_date', today)
        .single();

      if (todayGoals) {
        // Calculate current accuracy from today's sessions
        const { data: todaySessions } = await supabase
          .from('enhanced_game_sessions')
          .select('words_correct, words_attempted')
          .eq('student_id', user.id)
          .eq('game_type', 'vocabulary-mining')
          .gte('created_at', today + 'T00:00:00.000Z')
          .lt('created_at', today + 'T23:59:59.999Z');

        const totalCorrect = todaySessions?.reduce((sum, session) => sum + (session.words_correct || 0), 0) || 0;
        const totalAttempted = todaySessions?.reduce((sum, session) => sum + (session.words_attempted || 0), 0) || 0;
        const currentAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

        setDailyGoals({
          targetWords: todayGoals.target_words || 20,
          wordsPracticed: todayGoals.words_practiced || 0,
          targetMinutes: todayGoals.target_minutes || 30,
          minutesPracticed: todayGoals.minutes_practiced || 0,
          targetAccuracy: 80, // Default target
          currentAccuracy
        });
      } else {
        // Create today's goals if they don't exist
        const { error: insertError } = await supabase
          .from('vocabulary_daily_goals')
          .insert({
            student_id: user.id,
            goal_date: today,
            target_words: 20,
            target_minutes: 30,
            words_practiced: 0,
            minutes_practiced: 0,
            gems_collected: 0,
            goal_completed: false,
            streak_count: currentStreak
          });

        if (!insertError) {
          setDailyGoals({
            targetWords: 20,
            wordsPracticed: 0,
            targetMinutes: 30,
            minutesPracticed: 0,
            targetAccuracy: 80,
            currentAccuracy: 0
          });
        }
      }

    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadVocabulary = async () => {
    if (!supabase) return;

    try {
      setLoading(true);

      // If we have category vocabulary from the hook, use that instead
      if (categoryVocabulary && categoryVocabulary.length > 0) {
        console.log('Using category vocabulary from hook');
        return;
      }

      // Load all vocabulary for selected language if no categories selected
      const { data: vocabData, error: vocabError } = await supabase
        .from('centralized_vocabulary')
        .select('*')
        .eq('language', selectedLanguage)
        .order('created_at')
        .limit(10000);

      if (vocabError) {
        console.error('Error loading vocabulary for', selectedLanguage, ':', vocabError);
        return;
      }

      // Transform the vocabulary data to match the expected interface
      const transformedVocabulary: VocabularyWord[] = (vocabData || [])
        .filter(item => item.word && item.translation)
        .map(item => ({
          id: item.id,
          spanish: selectedLanguage === 'es' ? item.word || '' : item.translation || '',
          english: selectedLanguage === 'es' ? item.translation || '' : item.word || '',
          theme: item.category || 'general',
          topic: item.subcategory || item.category || 'general',
          part_of_speech: item.part_of_speech || 'word',
          example_sentence: item.example_sentence || undefined,
          example_translation: item.example_translation || undefined,
          audio_url: item.audio_url || undefined,
          times_seen: 0,
          times_correct: 0,
          last_seen: undefined,
          is_learned: false,
          mastery_level: 0,
          difficulty_rating: 1
        }));

      console.log('Loaded all vocabulary:', transformedVocabulary.length, 'words for language:', selectedLanguage);
      setVocabulary(transformedVocabulary);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGameSession = async (modeId: string) => {
    if (!vocabulary || vocabulary.length === 0) {
      console.error('Cannot start game: no vocabulary loaded');
      alert('Please wait for vocabulary to load before starting the game.');
      return;
    }

    try {
      let vocabularySubset: VocabularyWord[] = [];
      const spacedRepetitionService = new SpacedRepetitionService(supabase);

      switch (modeId) {
        case 'learn_new':
          vocabularySubset = await getNewWords();
          break;

        case 'review_weak':
          vocabularySubset = await getWeakWords();
          break;

        case 'spaced_repetition':
          if (user) {
            vocabularySubset = await spacedRepetitionService.getWordsForReview(user.id);
          }
          break;

        case 'mixed_review':
          vocabularySubset = vocabulary
            .sort(() => Math.random() - 0.5)
            .slice(0, settings.wordsPerSession);
          break;

        case 'listening_practice':
          vocabularySubset = vocabulary
            .filter(word => word.audio_url)
            .sort(() => Math.random() - 0.5)
            .slice(0, settings.wordsPerSession);
          break;

        case 'speed_challenge':
          vocabularySubset = await getFamiliarWords();
          break;

        case 'match_up':
          vocabularySubset = vocabulary
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(8, settings.wordsPerSession)); // Match up works best with 8 pairs
          break;

        default:
          vocabularySubset = vocabulary.slice(0, settings.wordsPerSession);
      }

      if (vocabularySubset.length === 0) {
        alert('No vocabulary available for this mode. Please try a different mode or load more vocabulary.');
        return;
      }

      const session: GameSession = {
        mode: modeId,
        vocabulary: vocabularySubset,
        settings: { ...settings, category: selectedCategory, subcategory: selectedSubcategory }
      };

      setGameSession(session);
    } catch (error) {
      console.error('Error starting game session:', error);
      alert('Failed to start game session. Please try again.');
    }
  };

  const getNewWords = async (): Promise<VocabularyWord[]> => {
    if (!user) return vocabulary.slice(0, settings.wordsPerSession);

    try {
      const { data: progressData } = await supabase
        .from('vocabulary_gem_collection')
        .select('vocabulary_item_id')
        .eq('student_id', user.id);

      const seenWordIds = new Set(progressData?.map(p => p.vocabulary_item_id) || []);
      const newWords = vocabulary.filter(word => !seenWordIds.has(word.id));

      return newWords.slice(0, settings.wordsPerSession);
    } catch (error) {
      console.error('Error getting new words:', error);
      return vocabulary.slice(0, settings.wordsPerSession);
    }
  };

  const getWeakWords = async (): Promise<VocabularyWord[]> => {
    if (!user) return vocabulary.slice(0, settings.wordsPerSession);

    try {
      const { data: progressData } = await supabase
        .from('vocabulary_gem_collection')
        .select('vocabulary_item_id, correct_encounters, total_encounters')
        .eq('student_id', user.id);

      // Filter for words with accuracy < 70%
      const weakProgress = progressData?.filter(p =>
        p.total_encounters > 0 && (p.correct_encounters / p.total_encounters) < 0.7
      ) || [];

      const weakWordIds = new Set(weakProgress.map(p => p.vocabulary_item_id));
      const weakWords = vocabulary.filter(word => weakWordIds.has(word.id));

      return weakWords.slice(0, settings.wordsPerSession);
    } catch (error) {
      console.error('Error getting weak words:', error);
      return vocabulary.slice(0, settings.wordsPerSession);
    }
  };

  const getFamiliarWords = async (): Promise<VocabularyWord[]> => {
    if (!user) return vocabulary.slice(0, settings.wordsPerSession);

    try {
      const { data: progressData } = await supabase
        .from('vocabulary_gem_collection')
        .select('vocabulary_item_id, correct_encounters, total_encounters')
        .eq('student_id', user.id);

      // Filter for words with accuracy >= 80%
      const familiarProgress = progressData?.filter(p =>
        p.total_encounters > 0 && (p.correct_encounters / p.total_encounters) >= 0.8
      ) || [];

      const familiarWordIds = new Set(familiarProgress.map(p => p.vocabulary_item_id));
      const familiarWords = vocabulary.filter(word => familiarWordIds.has(word.id));

      return familiarWords.slice(0, settings.wordsPerSession);
    } catch (error) {
      console.error('Error getting familiar words:', error);
      return vocabulary.slice(0, settings.wordsPerSession);
    }
  };

  const handleGameComplete = async (results: any) => {
    setGameSession(null);

    // Wait a moment for the session to be saved, then refresh stats
    setTimeout(() => {
      loadUserStats(); // Refresh stats after game completion
    }, 1000);
  };

  const handleCategorySelect = (category: string, subcategory: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory || '');
    setShowCategorySelector(false);

    // Update settings with selected category
    setSettings(prev => ({
      ...prev,
      category,
      subcategory: subcategory || undefined
    }));
  };

  // Show game session if active
  if (gameSession) {
    return (
      <VocabularyMiningGame
        mode={gameSession.mode}
        vocabulary={gameSession.vocabulary}
        config={gameSession.settings}
        onComplete={handleGameComplete}
        onExit={() => setGameSession(null)}
      />
    );
  }

  // Show category selector if requested
  if (showCategorySelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">Select Vocabulary Category</h1>
              <button
                onClick={() => setShowCategorySelector(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <ArrowRight className="h-6 w-6 rotate-180" />
              </button>
            </div>

            <DemoAwareCategorySelector
              onCategorySelect={handleCategorySelect}
              gameName="Vocabulary Mining"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      <div className="container mx-auto px-3 py-2">
        <div className="max-w-7xl mx-auto h-screen flex flex-col">
          {/* Ultra Compact Header */}
          <div className="flex items-center justify-between mb-3">
            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white transition-colors text-sm"
              >
                <ArrowRight className="h-3 w-3 rotate-180" />
                Back
              </button>
            )}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center flex-1"
            >
              <h1 className="text-2xl font-bold text-white">
                ⛏️ Vocabulary Mining
              </h1>
            </motion.div>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>

          {/* Selected Category Indicator (Streamlined Mode) */}
          {streamlinedMode && preselectedConfig && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-white/80 text-sm">Selected Category:</span>
                <span className="text-white font-semibold text-sm">
                  {getCategoryById(preselectedConfig.category).displayName}
                  {preselectedConfig.subcategory && ` • ${preselectedConfig.subcategory}`}
                </span>
                <span className="text-white/60 text-xs">
                  ({preselectedConfig.language.toUpperCase()})
                </span>
              </div>
            </motion.div>
          )}

          {/* Dashboard Layout - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3 flex-1">
            
            {/* Left Column - Stats & Progress */}
            <div className="lg:col-span-2 space-y-3">
              
              {/* Compact Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{userStats.wordsLearned}</div>
                    <div className="text-xs text-blue-200">Words Learned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{userStats.currentStreak}</div>
                    <div className="text-xs text-blue-200">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100)}%
                    </div>
                    <div className="text-xs text-blue-200">Weekly Goal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{dailyGoals.currentAccuracy}%</div>
                    <div className="text-xs text-blue-200">Accuracy</div>
                  </div>
                </div>
              </motion.div>

              {/* Combined Progress Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Gem Collection - Horizontal Layout */}
                  <div>
                    <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
                      <span className="text-lg mr-2">💎</span>
                      Gem Collection
                    </h3>
                    <div className="flex items-center justify-between">
                      {[
                        { type: 'common', name: 'C', color: 'bg-blue-500', count: gemStats.common },
                        { type: 'uncommon', name: 'U', color: 'bg-green-500', count: gemStats.uncommon },
                        { type: 'rare', name: 'R', color: 'bg-purple-500', count: gemStats.rare },
                        { type: 'epic', name: 'E', color: 'bg-pink-500', count: gemStats.epic },
                        { type: 'legendary', name: 'L', color: 'bg-yellow-500', count: gemStats.legendary }
                      ].map((gem) => (
                        <div key={gem.type} className="text-center">
                          <div className={`w-6 h-6 ${gem.color} rounded-full flex items-center justify-center text-white font-bold text-xs mb-1`}>
                            {gem.count}
                          </div>
                          <div className="text-white text-xs">{gem.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Goals - Compact */}
                  <div>
                    <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
                      <span className="text-lg mr-2">🎯</span>
                      Daily Goals
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white">Words: {dailyGoals.wordsPracticed}/{dailyGoals.targetWords}</span>
                        <div className="w-16 bg-white/20 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min((dailyGoals.wordsPracticed / dailyGoals.targetWords) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white">Time: {dailyGoals.minutesPracticed}/{dailyGoals.targetMinutes}m</span>
                        <div className="w-16 bg-white/20 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min((dailyGoals.minutesPracticed / dailyGoals.targetMinutes) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-3">
              
              {/* Language Selection - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <h3 className="text-white text-sm font-semibold mb-3">Language</h3>
                <button
                  onClick={() => setShowLanguageModal(true)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span className="text-lg">
                    {availableLanguages.find(lang => lang.code === selectedLanguage)?.flag}
                  </span>
                  <span className="text-sm">
                    {availableLanguages.find(lang => lang.code === selectedLanguage)?.name}
                  </span>
                </button>
              </motion.div>

              {/* Category Selection - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <h3 className="text-white text-sm font-semibold mb-3">Category</h3>
                <button
                  onClick={() => setShowCategorySelector(true)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-between"
                >
                  <span className="text-sm truncate">
                    {selectedCategory ? getCategoryById(selectedCategory).displayName : 'All Categories'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>

              {/* Settings - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <h3 className="text-white text-sm font-semibold mb-3">Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs">Words per session</span>
                    <select
                      value={settings.wordsPerSession}
                      onChange={(e) => setSettings(prev => ({ ...prev, wordsPerSession: parseInt(e.target.value) }))}
                      className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs">Audio</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, enableAudio: !prev.enableAudio }))}
                      className={`w-8 h-4 rounded-full transition-colors ${settings.enableAudio ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${settings.enableAudio ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Ultra Compact Learning Modes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 flex-1"
          >
            <h3 className="text-white text-sm font-semibold mb-2 flex items-center">
              <span className="text-lg mr-2">🎮</span>
              Learning Modes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 h-full">
              {LEARNING_MODES.map((mode, index) => (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-2 border border-white/20 transition-all duration-200 cursor-pointer group text-left h-fit"
                  onClick={() => startGameSession(mode.id)}
                >
                  <div className={`w-6 h-6 rounded ${mode.color} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                    <div className="scale-50">
                      {mode.icon}
                    </div>
                  </div>
                  <h4 className="text-white text-xs font-medium mb-0.5 leading-tight">{mode.name}</h4>
                  <p className="text-blue-200 text-xs leading-tight opacity-80">{mode.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>


        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLanguageModal(false)}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl max-w-md w-full"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Choose Language</h2>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {availableLanguages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => {
                    setSelectedLanguage(language.code);
                    // Reset category selection when language changes
                    setSelectedCategory('');
                    setSelectedSubcategory('');
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                    selectedLanguage === language.code
                      ? 'border-blue-400 bg-blue-500/20 text-blue-200'
                      : 'border-white/20 bg-white/10 text-white hover:border-white/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <span className="font-semibold text-lg">{language.name}</span>
                  {selectedLanguage === language.code && (
                    <span className="ml-auto text-blue-300">✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
