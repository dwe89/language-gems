'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { SpacedRepetitionService } from '../../../../services/spacedRepetitionService';
import { 
  ArrowRight, Shuffle, Target, Brain, Headphones, BookOpen, 
  TrendingUp, Clock, Settings, Play, Lightbulb, Zap, 
  RotateCcw, Flame, Trophy, ChevronRight, Volume2
} from 'lucide-react';
import VocabMasterGame from './VocabMasterGame';

// Category system imports
import CategorySelector from '../../../../components/games/CategorySelector';
import { useVocabularyByCategory } from '../../../../hooks/useVocabulary';

// Helper function to get category display name
const getCategoryById = (id: string) => {
  const categoryMap: Record<string, { displayName: string }> = {
    'basics_core_language': { displayName: 'Basics & Core Language' },
    'identity_personal_life': { displayName: 'Identity & Personal Life' },
    'food_drink': { displayName: 'Food & Drink' },
    'nature_environment': { displayName: 'Nature & Environment' },
    'school_jobs_future': { displayName: 'School, Jobs & Future' },
    'clothes_shopping': { displayName: 'Clothes & Shopping' },
    'home_local_area': { displayName: 'Home & Local Area' },
    'holidays_travel_culture': { displayName: 'Holidays, Travel & Culture' },
    'health_lifestyle': { displayName: 'Health & Lifestyle' },
    'free_time_leisure': { displayName: 'Free Time & Leisure' },
    'technology_media': { displayName: 'Technology & Media' },
    'social_global_issues': { displayName: 'Social & Global Issues' }
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
  config: Record<string, any>;
}

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isRecommended?: boolean;
  isPremium?: boolean;
}

const LEARNING_MODES: LearningMode[] = [
  {
    id: 'learn_new',
    name: 'Learn New Words',
    description: 'Start with unfamiliar vocabulary using spaced repetition',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-green-400 to-blue-500',
    isRecommended: true
  },
  {
    id: 'review_weak',
    name: 'Review Weak Words',
    description: 'Focus on words you\'ve struggled with before',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-red-400 to-pink-500'
  },
  {
    id: 'spaced_repetition',
    name: 'Spaced Repetition',
    description: 'Review words at scientifically optimized intervals',
    icon: <Brain className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-purple-400 to-indigo-500'
  },
  {
    id: 'speed_review',
    name: 'Speed Review',
    description: 'Quick-fire practice to improve reaction time',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
  },
  {
    id: 'listening_practice',
    name: 'Listening Practice',
    description: 'Hear words and type what you understand',
    icon: <Headphones className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-blue-400 to-cyan-500'
  },
  {
    id: 'context_practice',
    name: 'Context Practice',
    description: 'Learn words through example sentences and context',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-teal-400 to-green-500'
  },
  {
    id: 'mixed_review',
    name: 'Mixed Review',
    description: 'Random mix of all learned vocabulary',
    icon: <Shuffle className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-indigo-400 to-purple-500'
  }
];

export default function VocabMasterLauncher() {
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
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVocabulary, setIsLoadingVocabulary] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    wordsPerSession: 20,
    difficulty: 'mixed',
    audioEnabled: true,
    theme: 'mixed',
    language: 'es' // Add language to settings
  });

  // Category Selection State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es'); // Spanish by default
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Available languages from database
  const [availableLanguages, setAvailableLanguages] = useState<Array<{code: string, name: string, flag: string}>>([
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' }
  ]);

  // Dynamic vocabulary loading based on category selection
  const { vocabulary: categoryVocabulary, loading: vocabLoading, error: vocabError } = useVocabularyByCategory({
    language: selectedLanguage,
    categoryId: selectedCategory,
    subcategoryId: selectedSubcategory,
    difficultyLevel: 'beginner',
    curriculumLevel: 'KS3'
  });

  // Load vocabulary and user stats on component mount
  useEffect(() => {
    loadVocabulary();
    loadUserStats();
  }, [user, selectedLanguage]);

  // Use category-based vocabulary when categories are selected
  const { 
    vocabulary: filteredVocabulary, 
    loading: categoryLoading, 
    error: categoryError 
  } = useVocabularyByCategory({
    language: selectedLanguage,
    categoryId: selectedCategory || undefined,
    subcategoryId: selectedSubcategory || undefined
  });

  // Reload vocabulary when categories change or when component mounts
  useEffect(() => {
    loadVocabulary();
  }, [selectedLanguage, selectedCategory, selectedSubcategory, filteredVocabulary]);

  const loadVocabulary = async () => {
    setIsLoadingVocabulary(true);
    try {
      // Use category-filtered vocabulary if categories are selected
      if ((selectedCategory && selectedCategory !== '') && filteredVocabulary) {
        if (filteredVocabulary.length > 0) {
          // Transform the category vocabulary data to match the expected interface
          const transformedVocabulary: VocabularyWord[] = filteredVocabulary
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
        } else {
          console.log('No vocabulary found for selected category/subcategory in language:', selectedLanguage);
          setVocabulary([]);
        }
      } else {
        // Load all vocabulary for selected language if no categories selected
        const { data: vocabularyData, error } = await supabase
          .from('centralized_vocabulary')
          .select('*')
          .eq('language', selectedLanguage)
          .order('created_at');

        if (error) {
          console.error('Error loading vocabulary for', selectedLanguage, ':', error);
          return;
        }

        // Transform the vocabulary data to match the expected interface
        const transformedVocabulary: VocabularyWord[] = (vocabularyData || [])
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
      }
    } catch (error) {
      console.error('Failed to load vocabulary:', error);
    } finally {
      setIsLoadingVocabulary(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Get user progress stats
      const { data: progressData } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id);

      const totalLearned = progressData?.filter(p => p.is_learned).length || 0;
      const currentStreak = await calculateCurrentStreak();
      const weeklyProgress = await calculateWeeklyProgress();

      setUserStats(prev => ({
        ...prev,
        wordsLearned: totalLearned,
        totalWords: vocabulary.length,
        currentStreak,
        weeklyProgress
      }));
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const calculateCurrentStreak = async (): Promise<number> => {
    if (!user) return 0;
    
    try {
      // Get recent sessions to calculate streak
      const { data } = await supabase
        .from('user_vocabulary_progress')
        .select('last_seen')
        .eq('user_id', user.id)
        .order('last_seen', { ascending: false })
        .limit(1);

      // Simple streak calculation - would be more complex in real implementation
      return data && data.length > 0 ? 3 : 0; // Placeholder
    } catch {
      return 0;
    }
  };

  const calculateWeeklyProgress = async (): Promise<number> => {
    if (!user) return 0;
    
    // Calculate progress towards weekly goal
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    try {
      const { data } = await supabase
        .from('user_vocabulary_progress')
        .select('id')
        .eq('user_id', user.id)
        .gte('updated_at', weekStart.toISOString());

      return Math.min((data?.length || 0), userStats.weeklyGoal);
    } catch {
      return 0;
    }
  };

  const startGameSession = async (modeId: string) => {
    if (!vocabulary || vocabulary.length === 0) {
      console.error('Cannot start game: no vocabulary loaded');
      alert('Please wait for vocabulary to load before starting the game.');
      return;
    }

    setIsLoading(true);
    setSelectedMode(modeId);

    try {
      let vocabularySubset: VocabularyWord[] = [];
      const spacedRepetitionService = new SpacedRepetitionService(supabase);

      switch (modeId) {
        case 'learn_new':
          // Get words the user hasn't seen or has seen less than 3 times
          vocabularySubset = await getNewWords();
          break;
          
        case 'review_weak':
          // Get words with low success rate
          vocabularySubset = await getWeakWords();
          break;
          
        case 'spaced_repetition':
          // Get words due for review based on spaced repetition algorithm
          if (user) {
            vocabularySubset = await spacedRepetitionService.getWordsForReview(user.id);
          }
          break;
          
        case 'mixed_review':
          // Random mix of all vocabulary
          vocabularySubset = vocabulary
            .sort(() => Math.random() - 0.5)
            .slice(0, settings.wordsPerSession);
          break;
          
        case 'listening_practice':
          // Get words with audio for listening practice
          vocabularySubset = vocabulary
            .filter(word => word.audio_url)
            .sort(() => Math.random() - 0.5)
            .slice(0, settings.wordsPerSession);
          break;
          
        case 'context_practice':
          // Get words with example sentences
          vocabularySubset = vocabulary
            .filter(word => word.example_sentence)
            .sort(() => Math.random() - 0.5)
            .slice(0, settings.wordsPerSession);
          break;
          
        case 'speed_review':
          // Quick review of familiar words
          vocabularySubset = await getFamiliarWords();
          break;
          
        default:
          vocabularySubset = vocabulary.slice(0, settings.wordsPerSession);
      }

      // Filter by theme if specified
      if (settings.theme !== 'mixed') {
        vocabularySubset = vocabularySubset.filter(word => 
          word.theme.toLowerCase() === settings.theme.toLowerCase()
        );
      }

      // Ensure we have enough words
      if (vocabularySubset.length === 0) {
        console.warn('No vocabulary subset found, using random vocabulary');
        vocabularySubset = vocabulary
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(settings.wordsPerSession, vocabulary.length));
      }

      console.log('Starting game session with:', vocabularySubset.length, 'words');
      console.log('First word:', vocabularySubset[0]);

      const gameConfig = {
        wordsPerSession: Math.min(settings.wordsPerSession, vocabularySubset.length),
        difficulty: settings.difficulty,
        audioEnabled: settings.audioEnabled,
        mode: modeId
      };

      setGameSession({
        mode: modeId,
        vocabulary: vocabularySubset,
        config: gameConfig
      });

    } catch (error) {
      console.error('Failed to start game session:', error);
      // Fallback to random words
      const fallbackVocab = vocabulary
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordsPerSession);
      
      setGameSession({
        mode: modeId,
        vocabulary: fallbackVocab,
        config: settings
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNewWords = async (): Promise<VocabularyWord[]> => {
    if (!user) {
      return vocabulary
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordsPerSession);
    }

    try {
      // Get words with no progress or very little exposure
      const { data: progressData } = await supabase
        .from('user_vocabulary_progress')
        .select('vocabulary_id, times_seen')
        .eq('user_id', user.id);

      const progressMap = new Map(progressData?.map(p => [p.vocabulary_id, p.times_seen]) || []);
      
      const newWords = vocabulary
        .filter(word => !progressMap.has(word.id) || (progressMap.get(word.id) || 0) < 3)
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordsPerSession);

      return newWords.length > 0 ? newWords : vocabulary.slice(0, settings.wordsPerSession);
    } catch (error) {
      console.error('Error getting new words:', error);
      return vocabulary.slice(0, settings.wordsPerSession);
    }
  };

  const getWeakWords = async (): Promise<VocabularyWord[]> => {
    if (!user) {
      return vocabulary
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordsPerSession);
    }

    try {
      // Get words with low success rate (< 70%)
      const { data: progressData } = await supabase
        .from('user_vocabulary_progress')
        .select('vocabulary_id, times_seen, times_correct')
        .eq('user_id', user.id)
        .gt('times_seen', 2);

      const weakWordIds = progressData
        ?.filter(p => (p.times_correct / p.times_seen) < 0.7)
        .map(p => p.vocabulary_id) || [];

      const weakWords = vocabulary
        .filter(word => weakWordIds.includes(word.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordsPerSession);

      return weakWords.length > 0 ? weakWords : vocabulary.slice(0, settings.wordsPerSession);
    } catch (error) {
      console.error('Error getting weak words:', error);
      return vocabulary.slice(0, settings.wordsPerSession);
    }
  };

  const getFamiliarWords = async (): Promise<VocabularyWord[]> => {
    if (!user) {
      return vocabulary
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordsPerSession);
    }

    try {
      // Get words with decent success rate (> 60%) for speed practice
      const { data: progressData } = await supabase
        .from('user_vocabulary_progress')
        .select('vocabulary_id, times_seen, times_correct')
        .eq('user_id', user.id)
        .gt('times_seen', 1);

      const familiarWordIds = progressData
        ?.filter(p => (p.times_correct / p.times_seen) >= 0.6)
        .map(p => p.vocabulary_id) || [];

      const familiarWords = vocabulary
        .filter(word => familiarWordIds.includes(word.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordsPerSession);

      return familiarWords.length > 0 ? familiarWords : vocabulary.slice(0, settings.wordsPerSession);
    } catch (error) {
      console.error('Error getting familiar words:', error);
      return vocabulary.slice(0, settings.wordsPerSession);
    }
  };

  const handleGameComplete = (results: any) => {
    // Update user stats
    loadUserStats();
    setGameSession(null);
    setSelectedMode('');
    
    console.log('Game completed with results:', results);
  };

  const handleGameExit = () => {
    setGameSession(null);
    setSelectedMode('');
  };

  // Render game if session is active
  if (gameSession) {
    return (
      <VocabMasterGame
        mode={gameSession.mode}
        vocabulary={gameSession.vocabulary}
        config={gameSession.config}
        onComplete={handleGameComplete}
        onExit={handleGameExit}
      />
    );
  }

  // Show loading screen while vocabulary is loading
  if (isLoadingVocabulary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading VocabMaster</h2>
          <p className="text-gray-600">Preparing your vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">VocabMaster</h1>
          <p className="text-gray-600 text-lg">
            Master vocabulary with intelligent spaced repetition
          </p>
        </motion.div>

        {/* Language and Topic Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <button
                onClick={() => setShowLanguageModal(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {availableLanguages.find(lang => lang.code === selectedLanguage)?.flag}
                  </span>
                  <span className="font-medium">
                    {availableLanguages.find(lang => lang.code === selectedLanguage)?.name}
                  </span>
                </div>
                <span className="text-gray-400">↓</span>
              </button>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <button
                onClick={() => setShowCategorySelector(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {selectedCategory ? 
                      `${getCategoryById(selectedCategory)?.displayName || selectedCategory}${selectedSubcategory ? ` - ${selectedSubcategory}` : ''}` : 
                      'All Topics'
                    }
                  </span>
                </div>
                <span className="text-gray-400">↓</span>
              </button>
            </div>
          </div>
          
          {/* Vocabulary Count Display */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLoadingVocabulary ? 'bg-yellow-400 animate-pulse' : vocabulary.length > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium text-blue-800">
                {isLoadingVocabulary || categoryLoading ? 
                  'Loading vocabulary...' : 
                  `${vocabulary.length} words available`
                }
              </span>
            </div>
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Clear selection
              </button>
            )}
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {userStats.wordsLearned}
              </div>
              <div className="text-sm text-gray-500">Words Learned</div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {userStats.totalWords}
              </div>
              <div className="text-sm text-gray-500">Total Words</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {userStats.currentStreak}
              </div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Weekly Goal</div>
            </div>
          </div>

          {/* Weekly Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Weekly Progress</span>
              <span className="text-sm text-gray-600">
                {userStats.weeklyProgress} / {userStats.weeklyGoal} words
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((userStats.weeklyProgress / userStats.weeklyGoal) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Learning Modes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Choose Learning Mode</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold mb-4">Session Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Words per session
                  </label>
                  <select
                    value={settings.wordsPerSession}
                    onChange={(e) => setSettings(prev => ({ ...prev, wordsPerSession: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={10}>10 words</option>
                    <option value={20}>20 words</option>
                    <option value={30}>30 words</option>
                    <option value={50}>50 words</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Focus
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="mixed">All themes</option>
                    <option value="daily-life">Daily Life</option>
                    <option value="travel">Travel</option>
                    <option value="work">Work</option>
                    <option value="family">Family</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mode Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_MODES.map((mode) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => startGameSession(mode.id)}
                  disabled={isLoading && selectedMode === mode.id || vocabulary.length === 0}
                  className={`w-full text-left p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                    isLoading && selectedMode === mode.id || vocabulary.length === 0
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
                    
                    <h3 className="text-xl font-bold text-white mb-2">
                      {mode.name}
                    </h3>
                    
                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                      {mode.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isLoading && selectedMode === mode.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                          <Play className="h-5 w-5 text-white" />
                        )}
                        <span className="text-white font-medium">
                          {isLoading && selectedMode === mode.id 
                            ? 'Loading...' 
                            : vocabulary.length === 0 
                              ? 'No vocabulary' 
                              : 'Start'}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/70" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => startGameSession('learn_new')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Learn New</span>
            </button>
            <button
              onClick={() => startGameSession('spaced_repetition')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span>Review Due</span>
            </button>
            <button
              onClick={() => startGameSession('listening_practice')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
            >
              <Headphones className="h-4 w-4" />
              <span>Audio Practice</span>
            </button>
          </div>
        </motion.div>

        {/* Category Selection Modal */}
        <AnimatePresence>
          {showCategorySelector && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategorySelector(false)}
            >
              <motion.div
                className="bg-white backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Choose Learning Topic</h2>
                  <button 
                    onClick={() => setShowCategorySelector(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <CategorySelector 
                  onCategorySelect={(categoryId, subcategoryId) => {
                    setSelectedCategory(categoryId);
                    setSelectedSubcategory(subcategoryId || '');
                    setShowCategorySelector(false);
                  }}
                  selectedLanguage={selectedLanguage}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Language Selection Modal */}
        <AnimatePresence>
          {showLanguageModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguageModal(false)}
            >
              <motion.div
                className="bg-white backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-2xl max-w-md w-full"
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Choose Language</h2>
                  <button 
                    onClick={() => setShowLanguageModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                        setSettings(prev => ({ ...prev, language: language.code }));
                        // Reset category selection when language changes
                        setSelectedCategory('');
                        setSelectedSubcategory('');
                        setShowLanguageModal(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                        selectedLanguage === language.code 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <span className="font-semibold text-lg">{language.name}</span>
                      {selectedLanguage === language.code && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
