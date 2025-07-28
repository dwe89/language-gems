'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
// Removed unused SpacedRepetitionService import - using direct database operations instead
import { 
  Home, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw,
  Volume2, Eye, EyeOff, Clock, Star, Brain, Target,
  Zap, TrendingUp, Award, ChevronRight, Headphones, 
  BookOpen, PenTool, Lightbulb, VolumeX, Play, Pause,
  Keyboard, ToggleLeft, ToggleRight, Pickaxe, Gem, Sparkles, Diamond, Crown
} from 'lucide-react';
import GemIcon, { GemType } from '../../../../components/ui/GemIcon';
import GemCollectionAnimation from '../../../../components/ui/GemCollectionAnimation';
import AchievementNotification from '../../../../components/ui/AchievementNotification';
import { audioFeedbackService } from '../../../../services/audioFeedbackService';
import { achievementService, Achievement } from '../../../../services/achievementService';
import { EnhancedGameService } from '../../../../services/enhancedGameService';

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Helper function to handle different vocabulary data structures
const getWordProperty = (word: any, property: 'spanish' | 'english'): string => {
  if (property === 'spanish') {
    return word.spanish || word.word || '';
  } else {
    return word.english || word.translation || '';
  }
};

// =====================================================
// TYPES
// =====================================================

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

interface GameState {
  currentWordIndex: number;
  currentWord: VocabularyWord | null;
  userAnswer: string;
  selectedChoice: number | null;
  showAnswer: boolean;
  isCorrect: boolean | null;
  score: number;
  totalWords: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  maxStreak: number;
  gameMode: 'learn' | 'recall' | 'speed' | 'multiple_choice' | 'listening' | 'cloze' | 'typing' | 'match_up';
  timeSpent: number;
  startTime: Date;
  wordsLearned: string[];
  wordsStruggling: string[];
  feedback: string;
  audioPlaying: boolean;
  canReplayAudio: boolean;
  audioReplayCount: number;
  isAnswerRevealed: boolean;
  gemsCollected: number;
  currentGemType: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

interface Props {
  mode: string;
  vocabulary: VocabularyWord[];
  config?: Record<string, any>;
  onComplete?: (results: any) => void;
  onExit?: () => void;
}

// Gem types and their properties - Progressive mastery system
const GEM_TYPES = {
  common: {
    name: 'Common Gems',
    icon: <Gem className="h-5 w-5" />,
    color: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'First exposure - everyday vocabulary gems',
    points: 10,
    masteryLevel: 0
  },
  uncommon: {
    name: 'Uncommon Gems',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'from-green-400 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: '1st correct review - useful vocabulary gems',
    points: 25,
    masteryLevel: 1
  },
  rare: {
    name: 'Rare Gems',
    icon: <Star className="h-5 w-5" />,
    color: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: '2nd correct review - valuable vocabulary gems',
    points: 50,
    masteryLevel: 2
  },
  epic: {
    name: 'Epic Gems',
    icon: <Diamond className="h-5 w-5" />,
    color: 'from-pink-400 to-pink-600',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: '3rd correct review - powerful vocabulary gems',
    points: 100,
    masteryLevel: 3
  },
  legendary: {
    name: 'Legendary Gems',
    icon: <Crown className="h-5 w-5" />,
    color: 'from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: '4+ correct reviews - legendary mastery',
    points: 200,
    masteryLevel: 4
  }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function VocabularyMiningGame({
  mode,
  vocabulary,
  config = {},
  onComplete,
  onExit
}: Props) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if we're in assignment mode
  const isAssignmentMode = config?.assignmentMode === true;
  const assignmentTitle = config?.assignmentTitle || '';

  // Initialize Enhanced Game Service for leaderboard updates
  const [enhancedGameService, setEnhancedGameService] = useState<EnhancedGameService | null>(null);

  useEffect(() => {
    if (supabase) {
      setEnhancedGameService(new EnhancedGameService(supabase));
    }
  }, [supabase]);

  // State
  const [gameState, setGameState] = useState<GameState>({
    currentWordIndex: 0,
    currentWord: null,
    userAnswer: '',
    selectedChoice: null,
    showAnswer: false,
    isCorrect: null,
    score: 0,
    totalWords: vocabulary.length,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    maxStreak: 0,
    gameMode: 'learn',
    timeSpent: 0,
    startTime: new Date(),
    wordsLearned: [],
    wordsStruggling: [],
    feedback: '',
    audioPlaying: false,
    canReplayAudio: true,
    audioReplayCount: 0,
    isAnswerRevealed: false,
    gemsCollected: 0,
    currentGemType: 'common'
  });

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<MultipleChoiceOption[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  // Gem collection animation state
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [collectedGemType, setCollectedGemType] = useState<GemType>('common');
  const [gemPoints, setGemPoints] = useState(0);
  const [gemUpgraded, setGemUpgraded] = useState(false);
  const [previousGemType, setPreviousGemType] = useState<GemType | undefined>();

  // XP and Level system (persistent across sessions)
  const [totalXP, setTotalXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [sessionXP, setSessionXP] = useState(0); // XP gained this session only

  // Achievement system
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [gemsByType, setGemsByType] = useState<Record<GemType, number>>({
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  });
  const [wordsPracticed, setWordsPracticed] = useState(0);

  // Level completion state
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelCompleteStats, setLevelCompleteStats] = useState<{
    totalWords: number;
    correctAnswers: number;
    accuracy: number;
    totalXP: number;
    gemsCollected: number;
  } | null>(null);

  // Refs for managing timeouts
  const xpTimeoutRef = useRef<NodeJS.Timeout>();

  // Update daily goals progress
  const updateDailyGoals = async () => {
    if (!user || !supabase) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Get or create today's goals
      const { data: existingGoals, error: selectError } = await supabase
        .from('vocabulary_daily_goals')
        .select('*')
        .eq('student_id', user.id)
        .eq('goal_date', today)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error querying daily goals:', selectError);
        return;
      }

      const currentWordsPracticed = (existingGoals?.words_practiced || 0) + 1;
      const currentMinutesPracticed = existingGoals?.minutes_practiced || 0; // Will be updated on game completion
      const currentGemsCollected = (existingGoals?.gems_collected || 0) + (gameState.gemsCollected > 0 ? 1 : 0);

      if (existingGoals) {
        // Update existing goals
        await supabase
          .from('vocabulary_daily_goals')
          .update({
            words_practiced: currentWordsPracticed,
            gems_collected: currentGemsCollected,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingGoals.id);
      } else {
        // Create new daily goals
        await supabase
          .from('vocabulary_daily_goals')
          .insert({
            student_id: user.id,
            goal_date: today,
            target_words: 20,
            target_minutes: 30,
            words_practiced: currentWordsPracticed,
            minutes_practiced: 0,
            gems_collected: currentGemsCollected,
            goal_completed: false,
            streak_count: 0
          });
      }
    } catch (error) {
      console.error('Error updating daily goals:', error);
    }
  };

  // Save game session data to enhanced_game_sessions table
  const saveGameSession = async () => {
    if (!user || !supabase) return;

    try {
      const totalQuestions = gameState.correctAnswers + gameState.incorrectAnswers;
      const accuracy = totalQuestions > 0 ? (gameState.correctAnswers / totalQuestions) * 100 : 0;
      const timeSpentMinutes = Math.max(1, Math.round(gameState.timeSpent / 60)); // Convert seconds to minutes, minimum 1 minute

      // Create session data object for EnhancedGameService
      const sessionData = {
        student_id: user.id,
        game_type: 'vocabulary-mining',
        session_mode: 'free_play' as const,
        started_at: new Date(Date.now() - gameState.timeSpent * 1000), // Calculate start time
        ended_at: new Date(),
        duration_seconds: gameState.timeSpent,
        final_score: gameState.score,
        max_score_possible: vocabulary.length * 200, // Assuming max legendary gem points
        accuracy_percentage: Math.round(accuracy),
        completion_percentage: Math.round((totalQuestions / vocabulary.length) * 100),
        level_reached: currentLevel,
        lives_used: 0,
        power_ups_used: [],
        achievements_earned: [],
        words_attempted: totalQuestions,
        words_correct: gameState.correctAnswers,
        unique_words_practiced: wordsPracticed,
        average_response_time_ms: 0,
        pause_count: 0,
        hint_requests: 0,
        retry_attempts: 0,
        session_data: {
          mode: mode,
          difficulty: config?.difficulty || 'intermediate',
          vocabulary_count: vocabulary.length,
          xp_gained: sessionXP,
          gems_collected: gameState.gemsCollected,
          max_streak: gameState.maxStreak
        },
        device_info: {}
      };

      // Use EnhancedGameService if available, otherwise fallback to direct insert
      if (enhancedGameService) {
        try {
          // Start and immediately end the session with the service
          const sessionId = await enhancedGameService.startGameSession(sessionData);
          await enhancedGameService.endGameSession(sessionId, sessionData);
          console.log('Game session saved and leaderboards updated successfully');
        } catch (serviceError) {
          console.error('Error with EnhancedGameService:', serviceError);
          // Fallback to direct insert
          await directInsertSession(sessionData);
        }
      } else {
        // Fallback to direct insert
        await directInsertSession(sessionData);
      }

      // Helper function for direct database insert
      async function directInsertSession(data: any) {
        const { error: sessionError } = await supabase
          .from('enhanced_game_sessions')
          .insert(data);

        if (sessionError) {
          console.error('Error saving game session:', sessionError);
        } else {
          console.log('Game session saved successfully (direct insert)');
        }
      }

      // Update daily goals with practice time and words
      const today = new Date().toISOString().split('T')[0];
      const { data: existingGoals } = await supabase
        .from('vocabulary_daily_goals')
        .select('minutes_practiced, words_practiced')
        .eq('student_id', user.id)
        .eq('goal_date', today)
        .single();

      if (existingGoals) {
        const updatedMinutes = (existingGoals.minutes_practiced || 0) + timeSpentMinutes;
        const updatedWords = (existingGoals.words_practiced || 0) + wordsPracticed;
        
        await supabase
          .from('vocabulary_daily_goals')
          .update({
            minutes_practiced: updatedMinutes,
            words_practiced: updatedWords,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', user.id)
          .eq('goal_date', today);
      }

    } catch (error) {
      console.error('Error saving game session:', error);
    }
  };

  // Retry helper function for database operations
  const retryDatabaseOperation = async function<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        console.warn(`Database operation attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    throw new Error('Max retries exceeded');
  };

  // Load user's persistent XP and level data
  const loadUserProgress = async () => {
    if (!user || !supabase) return;

    try {
      // Get user's total XP from all gem collections
      const { data: gemData } = await supabase
        .from('vocabulary_gem_collection')
        .select('mastery_level, correct_encounters')
        .eq('student_id', user.id);

      if (gemData) {
        // Calculate total XP based on all gem collections
        const calculatedXP = gemData.reduce((total, gem) => {
          const correctAnswers = gem.correct_encounters || 0;
          // Award XP based on mastery level: 10, 25, 50, 100, 200
          const xpPerLevel = [10, 25, 50, 100, 200];
          const masteryLevel = Math.min(gem.mastery_level || 0, 4);
          return total + (correctAnswers * xpPerLevel[masteryLevel]);
        }, 0);

        setTotalXP(calculatedXP);

        // Calculate level based on total XP
        let level = 1;
        let xpRequired = calculateXPForLevel(level);
        while (calculatedXP >= xpRequired) {
          level++;
          xpRequired = calculateXPForLevel(level);
        }

        const actualLevel = level - 1; // Adjust because we went one level too far
        setCurrentLevel(actualLevel);

        // Calculate XP needed for NEXT level (not current level)
        const xpForNextLevel = calculateXPForLevel(actualLevel + 1);
        setXpToNextLevel(xpForNextLevel - calculatedXP);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  // Calculate XP required for next level (exponential growth)
  const calculateXPForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  // Handle XP gain and level progression
  const addXP = (points: number) => {
    const newTotalXP = totalXP + points;
    const newSessionXP = sessionXP + points;

    setTotalXP(newTotalXP);
    setSessionXP(newSessionXP);
    setXpGained(points);
    setShowXPGain(true);

    // Check for level up
    let newLevel = currentLevel;
    let xpForCurrentLevel = calculateXPForLevel(newLevel);

    while (newTotalXP >= xpForCurrentLevel) {
      newLevel++;
      xpForCurrentLevel = calculateXPForLevel(newLevel);
    }

    if (newLevel > currentLevel) {
      setCurrentLevel(newLevel);
      // Play level up sound or show animation here
      console.log(`Level up! Now level ${newLevel}`);
    }

    // Calculate XP needed for next level
    const xpForNextLevel = calculateXPForLevel(newLevel);
    setXpToNextLevel(xpForNextLevel - newTotalXP);

    // Clear any existing XP timeout
    if (xpTimeoutRef.current) {
      clearTimeout(xpTimeoutRef.current);
    }

    // Hide XP gain animation after delay
    xpTimeoutRef.current = setTimeout(() => setShowXPGain(false), 2000);
  };

  // Initialize game
  useEffect(() => {
    if (vocabulary.length > 0) {
      initializeGame().catch(console.error);
    }
  }, [vocabulary]);

  // Load user progress on component mount
  useEffect(() => {
    if (user && supabase) {
      // Ensure we have a valid session before loading progress
      const initializeWithAuth = async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Session error:', error);
            return;
          }

          if (session) {
            console.log('Valid session found, loading user progress');
            
            // Initialize achievement service with supabase and user ID
            await achievementService.initialize(supabase, user.id);
            
            loadUserProgress();
          } else {
            console.warn('No valid session found');
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
      };

      initializeWithAuth();
    }
  }, [user, supabase]);

  // Timer for tracking time spent
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
      }));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const initializeGame = async () => {
    const firstWord = vocabulary[0];
    const gemType = await determineGemType(firstWord);

    setGameState(prev => ({
      ...prev,
      currentWord: firstWord,
      totalWords: vocabulary.length,
      currentGemType: gemType
    }));

    if (mode === 'multiple_choice') {
      generateMultipleChoiceOptions(firstWord);
    }
  };

  const determineGemType = async (word: VocabularyWord): Promise<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'> => {
    if (!user || !supabase) return 'common';

    try {
      // Use word.id directly as UUID (from centralized_vocabulary)
      const vocabularyId = word.id;

      // Debug authentication before querying
      const { data: { session: debugSession } } = await supabase.auth.getSession();
      console.log('🔍 Auth debug for determineGemType:', {
        userId: user.id,
        sessionUserId: debugSession?.user?.id,
        hasValidSession: !!debugSession,
        vocabularyId
      });

      // Get user's progress for this word from vocabulary_gem_collection
      const { data: progressData, error: progressError } = await supabase
        .from('vocabulary_gem_collection')
        .select('correct_encounters, mastery_level')
        .eq('student_id', user.id)
        .eq('vocabulary_item_id', vocabularyId);

      if (progressError) {
        console.error('🚨 Error querying progress for gem type:', progressError);
        return 'common'; // fallback
      }

      const progress = progressData && progressData.length > 0 ? progressData[0] : null;

      if (!progress) {
        // First time seeing this word
        return 'common';
      }

      // Progressive gem system based on correct encounters
      const correctAnswers = progress.correct_encounters || 0;

      if (correctAnswers >= 4) return 'legendary';  // 4+ correct reviews
      if (correctAnswers >= 3) return 'epic';       // 3rd correct review
      if (correctAnswers >= 2) return 'rare';       // 2nd correct review
      if (correctAnswers >= 1) return 'uncommon';   // 1st correct review

      return 'common'; // First exposure or no correct answers yet
    } catch (error) {
      console.error('Error determining gem type:', error);
      return 'common';
    }
  };

  const generateMultipleChoiceOptions = (word: VocabularyWord) => {
    // Handle different data structures - centralized_vocabulary uses 'translation' for English
    const correctAnswer = getWordProperty(word, 'english');
    const otherWords = vocabulary.filter(w => w.id !== word.id);
    const wrongAnswers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => getWordProperty(w, 'english'));

    const allOptions = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5)
      .map(text => ({
        text,
        isCorrect: text === correctAnswer
      }));

    setMultipleChoiceOptions(allOptions);
  };

  // Comprehensive answer validation from vocab-master
  const validateAnswer = (userAnswer: string, correctAnswer: string): { isCorrect: boolean; missingAccents: boolean } => {
    // Remove punctuation and text in brackets/parentheses for comparison
    const removePunctuation = (text: string) => {
      // First remove text in brackets/parentheses (informal, formal, etc.)
      const withoutBrackets = text.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
      // Normalize curly quotes to straight quotes before removing punctuation
      const normalizedQuotes = withoutBrackets.replace(/['']/g, "'").replace(/[""]/g, '"');
      return normalizedQuotes.replace(/[¿¡?!.,;:()""''«»\-]/g, '').trim().toLowerCase();
    };

    // Remove accents for comparison
    const removeAccents = (text: string) => {
      return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const userAnswerClean = removePunctuation(userAnswer);
    const correctAnswerClean = removePunctuation(correctAnswer);

    // Check for missing accents
    const userAnswerNoAccents = removeAccents(userAnswerClean);
    const correctAnswerNoAccents = removeAccents(correctAnswerClean);
    const missingAccents = userAnswerClean !== userAnswerNoAccents && userAnswerNoAccents === correctAnswerNoAccents;

    // Split by multiple delimiters: comma, pipe (|), semicolon, forward slash, "and", "or"
    const correctAnswers = correctAnswer
      .split(/[,|;\/]|\band\b|\bor\b/)
      .map(ans => removePunctuation(ans))
      .filter(ans => ans.length > 0);

    // Also handle parenthetical variations and gender indicators
    const expandedAnswers = correctAnswers.flatMap(answer => {
      const variations = [answer];

      // Also add the original answer without punctuation removal for exact matching
      const originalAnswer = removePunctuation(answer);
      if (originalAnswer !== answer) {
        variations.push(originalAnswer);
      }

      // Handle contractions: I'm = I am, we'll = we will, etc.
      const contractionMap: Record<string, string> = {
        "i'm": "i am",
        "you're": "you are",
        "he's": "he is",
        "she's": "she is",
        "it's": "it is",
        "we're": "we are",
        "they're": "they are",
        "i'll": "i will",
        "you'll": "you will",
        "he'll": "he will",
        "she'll": "she will",
        "it'll": "it will",
        "we'll": "we will",
        "they'll": "they will",
        "won't": "will not",
        "can't": "cannot",
        "don't": "do not",
        "doesn't": "does not",
        "didn't": "did not",
        "isn't": "is not",
        "aren't": "are not",
        "wasn't": "was not",
        "weren't": "were not",
        "haven't": "have not",
        "hasn't": "has not",
        "hadn't": "had not"
      };

      // Add contraction variations
      Object.entries(contractionMap).forEach(([contraction, expansion]) => {
        if (answer.includes(contraction)) {
          variations.push(answer.replace(contraction, expansion));
        }
        if (answer.includes(expansion)) {
          variations.push(answer.replace(expansion, contraction));
        }
      });

      // Remove content in parentheses for comparison (like "(informal)")
      const withoutParentheses = answer.replace(/\s*\([^)]*\)/g, '').trim();
      if (withoutParentheses !== answer && withoutParentheses.length > 0) {
        variations.push(withoutParentheses);
      }

      return variations;
    });

    // Check if user answer matches any variation
    const isExactMatch = expandedAnswers.some(correctAns =>
      userAnswerClean === correctAns ||
      removeAccents(userAnswerClean) === removeAccents(correctAns)
    );

    if (isExactMatch) {
      return { isCorrect: true, missingAccents };
    }

    // Handle number words vs digits (both Spanish and English)
    const numberMap: Record<string, string> = {
      // Spanish numbers
      'cero': '0', 'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4',
      'cinco': '5', 'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9',
      'diez': '10', 'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14',
      'quince': '15', 'dieciséis': '16', 'diecisiete': '17', 'dieciocho': '18',
      'diecinueve': '19', 'veinte': '20', 'veintiuno': '21', 'treinta': '30',
      'cuarenta': '40', 'cincuenta': '50', 'sesenta': '60', 'setenta': '70',
      'ochenta': '80', 'noventa': '90', 'cien': '100', 'ciento': '100',
      // English numbers (single words)
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14',
      'fifteen': '15', 'sixteen': '16', 'seventeen': '17', 'eighteen': '18',
      'nineteen': '19', 'twenty': '20', 'thirty': '30', 'forty': '40',
      'fifty': '50', 'sixty': '60', 'seventy': '70', 'eighty': '80',
      'ninety': '90', 'hundred': '100',
      // English hyphenated numbers
      'twenty-one': '21', 'twenty-two': '22', 'twenty-three': '23', 'twenty-four': '24',
      'twenty-five': '25', 'twenty-six': '26', 'twenty-seven': '27', 'twenty-eight': '28',
      'twenty-nine': '29', 'thirty-one': '31', 'thirty-two': '32', 'thirty-three': '33',
      'thirty-four': '34', 'thirty-five': '35', 'thirty-six': '36', 'thirty-seven': '37',
      'thirty-eight': '38', 'thirty-nine': '39', 'forty-one': '41', 'forty-two': '42',
      'forty-three': '43', 'forty-four': '44', 'forty-five': '45', 'forty-six': '46',
      'forty-seven': '47', 'forty-eight': '48', 'forty-nine': '49', 'fifty-one': '51',
      'fifty-two': '52', 'fifty-three': '53', 'fifty-four': '54', 'fifty-five': '55',
      'fifty-six': '56', 'fifty-seven': '57', 'fifty-eight': '58', 'fifty-nine': '59',
      'sixty-one': '61', 'sixty-two': '62', 'sixty-three': '63', 'sixty-four': '64',
      'sixty-five': '65', 'sixty-six': '66', 'sixty-seven': '67', 'sixty-eight': '68',
      'sixty-nine': '69', 'seventy-one': '71', 'seventy-two': '72', 'seventy-three': '73',
      'seventy-four': '74', 'seventy-five': '75', 'seventy-six': '76', 'seventy-seven': '77',
      'seventy-eight': '78', 'seventy-nine': '79', 'eighty-one': '81', 'eighty-two': '82',
      'eighty-three': '83', 'eighty-four': '84', 'eighty-five': '85', 'eighty-six': '86',
      'eighty-seven': '87', 'eighty-eight': '88', 'eighty-nine': '89', 'ninety-one': '91',
      'ninety-two': '92', 'ninety-three': '93', 'ninety-four': '94', 'ninety-five': '95',
      'ninety-six': '96', 'ninety-seven': '97', 'ninety-eight': '98', 'ninety-nine': '99'
    };

    // Check if any correct answer is a number word that matches the user's digit
    for (const correctAns of correctAnswers) {
      if (numberMap[correctAns] === userAnswerClean) {
        return { isCorrect: true, missingAccents: false };
      }

      // Handle compound English numbers like "thirty four" (without hyphen)
      const compoundMatch = correctAns.match(/^(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(one|two|three|four|five|six|seven|eight|nine)$/);
      if (compoundMatch) {
        const tens = numberMap[compoundMatch[1]] || '0';
        const ones = numberMap[compoundMatch[2]] || '0';
        const compoundValue = (parseInt(tens) + parseInt(ones)).toString();
        if (compoundValue === userAnswerClean) {
          return { isCorrect: true, missingAccents: false };
        }
      }
    }

    // Also check the reverse: if user types a number word and answer is a digit
    const reverseNumberMap: Record<string, string[]> = {};
    Object.entries(numberMap).forEach(([word, digit]) => {
      if (!reverseNumberMap[digit]) {
        reverseNumberMap[digit] = [];
      }
      reverseNumberMap[digit].push(word);
    });

    for (const correctAns of correctAnswers) {
      if (reverseNumberMap[correctAns]?.includes(userAnswerClean)) {
        return { isCorrect: true, missingAccents: false };
      }

      // Handle compound numbers in user input like "thirty four" when answer is "34"
      const userCompoundMatch = userAnswerClean.match(/^(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-]+(one|two|three|four|five|six|seven|eight|nine)$/);
      if (userCompoundMatch) {
        const tens = numberMap[userCompoundMatch[1]] || '0';
        const ones = numberMap[userCompoundMatch[2]] || '0';
        const compoundValue = (parseInt(tens) + parseInt(ones)).toString();
        if (compoundValue === correctAns) {
          return { isCorrect: true, missingAccents: false };
        }
      }
    }

    return { isCorrect: false, missingAccents };
  };

  const handleAnswer = async (answer: string, isMultipleChoice = false) => {
    if (!gameState.currentWord) return;

    // Handle different data structures - centralized_vocabulary uses 'translation' for English
    const englishWord = getWordProperty(gameState.currentWord, 'english');
    if (!englishWord) {
      console.error('No English translation found for word:', gameState.currentWord);
      return;
    }

    let validationResult = { isCorrect: false, missingAccents: false };

    if (isMultipleChoice) {
      validationResult.isCorrect = multipleChoiceOptions[parseInt(answer)]?.isCorrect || false;
    } else {
      validationResult = validateAnswer(answer, englishWord);
    }

    const isCorrect = validationResult.isCorrect;

    const responseTime = Date.now() - gameState.startTime.getTime();
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      isCorrect,
      showAnswer: true,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: isCorrect ? prev.incorrectAnswers : prev.incorrectAnswers + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: isCorrect ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
      score: isCorrect ? prev.score + GEM_TYPES[prev.currentGemType].points : prev.score,
      gemsCollected: isCorrect ? prev.gemsCollected + 1 : prev.gemsCollected,
      feedback: isCorrect ? 'Correct! Gem collected!' : `Incorrect. The answer is: ${englishWord}`
    }));

    // Play audio feedback
    if (gameState.currentWord?.audio_url && config?.enableAudio !== false) {
      setTimeout(() => {
        playAudio(true);
      }, 800); // Play audio after showing the answer
    }

    // Play sound effects for incorrect answers (correct answers play gem collection sounds)
    if (config?.enableAudio !== false && !isCorrect) {
      audioFeedbackService.playErrorSound();
    }

    // Record progress and handle gem collection
    if (user && gameState.currentWord) {
      const previousGemType = gameState.currentGemType;

      // Track words practiced for achievements
      setWordsPracticed(prev => prev + 1);

      await recordWordPractice(gameState.currentWord, isCorrect, responseTime);

      // Update gem type and show collection animation (for correct answers)
      if (isCorrect) {
        const newGemType = await determineGemType(gameState.currentWord);
        const upgraded = newGemType !== previousGemType;

        // Calculate points based on gem type
        const gemPointValues = {
          common: 10,
          uncommon: 25,
          rare: 50,
          epic: 100,
          legendary: 200
        };

        const points = gemPointValues[newGemType];

        // Update game state and XP
        setGameState(prev => ({
          ...prev,
          currentGemType: newGemType,
          score: prev.score + points,
          gemsCollected: prev.gemsCollected + 1
        }));

        // Add XP and handle level progression
        addXP(points);

        // Update gem tracking for achievements
        setGemsByType(prev => ({
          ...prev,
          [newGemType]: prev[newGemType] + 1
        }));

        // Check for achievements
        const newAchievements = await achievementService.checkAchievements({
          gemsCollected: gameState.gemsCollected + 1,
          gemsByType: {
            ...gemsByType,
            [newGemType]: gemsByType[newGemType] + 1
          },
          currentStreak: gameState.streak + 1,
          maxStreak: Math.max(gameState.maxStreak, gameState.streak + 1),
          currentLevel,
          wordsPracticed: wordsPracticed + 1,
          sessionAccuracy: gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers + 1)
        });

        // Show achievement notification if any new achievements
        if (newAchievements.length > 0) {
          setCurrentAchievement(newAchievements[0]); // Show first achievement
          setShowAchievement(true);
        }

        // Play gem collection sound effects
        if (config?.enableAudio !== false) {
          // Always play the gem collection sound (this serves as both collection and upgrade feedback)
          audioFeedbackService.playGemCollectionSound(newGemType);
        }

        // Show gem collection animation
        setCollectedGemType(newGemType);
        setGemPoints(points);
        setGemUpgraded(upgraded);
        setPreviousGemType(upgraded ? previousGemType : undefined);
        setShowGemAnimation(true);
      }
    }

    // Auto-advance after showing answer
    setTimeout(async () => {
      await nextWord();
    }, 2000);
  };

  const recordWordPractice = async (word: VocabularyWord, correct: boolean, responseTime: number) => {
    if (!user || !supabase) {
      console.error('Missing user or supabase client', { user: !!user, supabase: !!supabase });
      return;
    }

    try {
      // Check authentication status
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error('Authentication error:', authError);
        return;
      }

      if (!session) {
        console.error('No active session found');
        return;
      }

      console.log('Recording word practice:', {
        correct,
        responseTime,
        word: getWordProperty(word, 'spanish'),
        userId: user.id,
        wordId: word.id,
        sessionUserId: session.user.id
      });

      // Anti-spam check: Prevent practicing words too frequently
      const now = new Date();
      const minimumInterval = 10 * 60 * 1000; // 10 minutes minimum between practices

      // Use word.id directly as UUID (don't convert to string)
      const vocabularyId = word.id;

      // Get existing gem collection record
      const { data: existingGemData, error: selectError } = await supabase
        .from('vocabulary_gem_collection')
        .select('*')
        .eq('student_id', user.id)
        .eq('vocabulary_item_id', vocabularyId);

      if (selectError) {
        console.error('🚨 Error querying gem collection:', selectError);
        return;
      }

      const existingGem = existingGemData && existingGemData.length > 0 ? existingGemData[0] : null;

      // Anti-spam check: Prevent practicing words too frequently
      if (existingGem && existingGem.last_encountered_at) {
        const lastPracticed = new Date(existingGem.last_encountered_at);
        const timeSinceLastPractice = now.getTime() - lastPracticed.getTime();

        if (timeSinceLastPractice < minimumInterval) {
          console.log('⏰ Word practiced too recently, skipping progress update:', {
            word: getWordProperty(word, 'spanish'),
            timeSinceLastPractice: Math.round(timeSinceLastPractice / 1000 / 60),
            minimumMinutes: minimumInterval / 1000 / 60
          });
          return; // Don't update progress if practiced too recently
        }
      }

      if (existingGem) {
        // Update existing gem collection
        const newCorrectEncounters = correct ? existingGem.correct_encounters + 1 : existingGem.correct_encounters;
        const newIncorrectEncounters = correct ? existingGem.incorrect_encounters : existingGem.incorrect_encounters + 1;
        const newTotalEncounters = existingGem.total_encounters + 1;
        const newCurrentStreak = correct ? existingGem.current_streak + 1 : 0;
        const newBestStreak = Math.max(existingGem.best_streak, newCurrentStreak);

        // Calculate new mastery level based on correct encounters
        let newMasteryLevel = 0;
        if (newCorrectEncounters >= 4) newMasteryLevel = 4; // Legendary
        else if (newCorrectEncounters >= 3) newMasteryLevel = 3; // Epic
        else if (newCorrectEncounters >= 2) newMasteryLevel = 2; // Rare
        else if (newCorrectEncounters >= 1) newMasteryLevel = 1; // Uncommon

        // Calculate next review interval based on spaced repetition algorithm
        // Progressive intervals: 10 minutes → 1 day → 3 days → 1 week → 3 weeks → 2 months → 6 months
        let nextReviewDays = 0;

        if (newCorrectEncounters === 0) {
          nextReviewDays = 0; // Immediate review for incorrect answers
        } else if (newCorrectEncounters === 1) {
          nextReviewDays = 1; // 1 day (Uncommon gem)
        } else if (newCorrectEncounters === 2) {
          nextReviewDays = 3; // 3 days (Rare gem)
        } else if (newCorrectEncounters === 3) {
          nextReviewDays = 7; // 1 week (Epic gem)
        } else if (newCorrectEncounters === 4) {
          nextReviewDays = 21; // 3 weeks (Legendary gem)
        } else if (newCorrectEncounters === 5) {
          nextReviewDays = 60; // 2 months
        } else {
          nextReviewDays = 180; // 6 months for mastered words
        }
        const nextReviewAt = new Date();

        // Handle special case for first correct answer (10 minutes)
        if (newCorrectEncounters === 1 && correct) {
          nextReviewAt.setMinutes(nextReviewAt.getMinutes() + 10);
        } else if (nextReviewDays === 0) {
          // Immediate review for incorrect answers
          nextReviewAt.setMinutes(nextReviewAt.getMinutes() + 1);
        } else {
          nextReviewAt.setDate(nextReviewAt.getDate() + nextReviewDays);
        }

        const { error: updateError } = await supabase
          .from('vocabulary_gem_collection')
          .update({
            total_encounters: newTotalEncounters,
            correct_encounters: newCorrectEncounters,
            incorrect_encounters: newIncorrectEncounters,
            current_streak: newCurrentStreak,
            best_streak: newBestStreak,
            mastery_level: newMasteryLevel,
            last_encountered_at: new Date().toISOString(),
            next_review_at: nextReviewAt.toISOString(),
            spaced_repetition_interval: nextReviewDays,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', user.id)
          .eq('vocabulary_item_id', vocabularyId);

        if (updateError) {
          console.error('Error updating gem collection:', updateError);
          return;
        }

        console.log('Successfully updated gem collection:', {
          vocabularyId,
          newMasteryLevel,
          newCorrectEncounters,
          newTotalEncounters
        });
      } else {
        // Create new gem collection record
        const nextReviewAt = new Date();
        nextReviewAt.setDate(nextReviewAt.getDate() + (correct ? 1 : 0)); // 1 day if correct, immediate if incorrect

        const { error: insertError } = await supabase
          .from('vocabulary_gem_collection')
          .upsert({
            student_id: user.id,
            vocabulary_item_id: vocabularyId,
            gem_level: 1,
            mastery_level: correct ? 1 : 0,
            total_encounters: 1,
            correct_encounters: correct ? 1 : 0,
            incorrect_encounters: correct ? 0 : 1,
            current_streak: correct ? 1 : 0,
            best_streak: correct ? 1 : 0,
            first_learned_at: new Date().toISOString(),
            last_encountered_at: new Date().toISOString(),
            next_review_at: nextReviewAt.toISOString(),
            spaced_repetition_interval: correct ? 1 : 0,
            spaced_repetition_ease_factor: 2.5,
            difficulty_rating: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'student_id,vocabulary_item_id'
          });

        if (insertError) {
          console.error('Error inserting new gem collection:', insertError);
          return;
        }

        console.log('Successfully created new gem collection:', {
          vocabularyId,
          masteryLevel: correct ? 1 : 0,
          correctEncounters: correct ? 1 : 0
        });
      }

      // Update daily goals progress
      await updateDailyGoals();

    } catch (error) {
      console.error('Error recording word practice:', error);
    }
  };

  const nextWord = async () => {
    const nextIndex = gameState.currentWordIndex + 1;

    if (nextIndex >= vocabulary.length) {
      // Level complete - show completion screen
      const accuracy = gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers) * 100;

      setLevelCompleteStats({
        totalWords: vocabulary.length,
        correctAnswers: gameState.correctAnswers,
        accuracy: Math.round(accuracy || 0),
        totalXP: sessionXP, // Show XP gained this session, not total XP
        gemsCollected: gameState.gemsCollected
      });

      setShowLevelComplete(true);

      // Play level complete sound
      if (config?.enableAudio !== false) {
        audioFeedbackService.playLevelCompleteSound();
      }

      // Don't call onComplete immediately - wait for user to click Continue
      // This prevents auto-redirect to main screen
      return;
    }

    const nextWordData = vocabulary[nextIndex];
    const gemType = await determineGemType(nextWordData);

    setGameState(prev => ({
      ...prev,
      currentWordIndex: nextIndex,
      currentWord: nextWordData,
      userAnswer: '',
      selectedChoice: null,
      showAnswer: false,
      isCorrect: null,
      feedback: '',
      isAnswerRevealed: false,
      currentGemType: gemType
    }));

    if (mode === 'multiple_choice') {
      generateMultipleChoiceOptions(nextWordData);
    }
  };

  const playAudio = (autoPlay = false) => {
    if (!gameState.currentWord?.audio_url) return;

    // For manual clicks, check replay limit
    if (!autoPlay && gameState.audioReplayCount >= 2) return;

    if (audioRef.current) {
      audioRef.current.src = gameState.currentWord.audio_url;
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error);
      });

      if (!autoPlay) {
        setGameState(prev => ({
          ...prev,
          audioPlaying: true,
          audioReplayCount: prev.audioReplayCount + 1,
          canReplayAudio: prev.audioReplayCount < 1
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          audioPlaying: true
        }));
      }
    }
  };

  // Auto-play audio when word changes
  useEffect(() => {
    if (gameState.currentWord?.audio_url && config?.enableAudio !== false) {
      // Small delay to ensure the word is displayed first
      setTimeout(() => {
        playAudio(true);
      }, 500);
    }
  }, [gameState.currentWord?.id]);

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md mx-4"
        >
          <div className="text-6xl mb-4">⛏️</div>
          <h2 className="text-3xl font-bold text-white mb-4">Mining Complete!</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-white">
              <span>Gems Collected:</span>
              <span className="font-bold">{gameState.gemsCollected}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Score:</span>
              <span className="font-bold">{gameState.score}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Accuracy:</span>
              <span className="font-bold">
                {Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Max Streak:</span>
              <span className="font-bold">{gameState.maxStreak}</span>
            </div>
          </div>
          <button
            onClick={onExit}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
          >
            {isAssignmentMode ? 'Back to Assignments' : 'Return to Mining Hub'}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!gameState.currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading vocabulary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <audio ref={audioRef} onEnded={() => setGameState(prev => ({ ...prev, audioPlaying: false }))} />

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            {isAssignmentMode ? 'Back to Assignments' : 'Exit Mining'}
          </button>

          <div className="flex items-center space-x-6 text-white">
            {isAssignmentMode && assignmentTitle && (
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-400" />
                <span className="font-semibold">{assignmentTitle}</span>
              </div>
            )}
            <div className="flex items-center">
              <GemIcon type={gameState.currentGemType} size="small" animated={true} className="mr-2" />
              <span>{gameState.gemsCollected} Gems</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              <span>Level {currentLevel}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-400" />
              <span>{totalXP} XP</span>
            </div>
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              <span>{gameState.correctAnswers}/{gameState.correctAnswers + gameState.incorrectAnswers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black/20 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Progress</span>
            <span>{gameState.currentWordIndex + 1} / {gameState.totalWords}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
            />
          </div>

          {/* XP Progress Bar */}
          <div className="flex justify-between text-white text-xs mb-1">
            <span>Level {currentLevel}</span>
            <span>{xpToNextLevel} XP to next level</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, ((calculateXPForLevel(currentLevel + 1) - xpToNextLevel) / calculateXPForLevel(currentLevel + 1)) * 100))}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Current Gem Display */}
          <motion.div
            key={gameState.currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <GemIcon
                type={gameState.currentGemType}
                size="xl"
                animated={true}
              />
            </div>
            <div className="text-white text-lg mb-2">
              {GEM_TYPES[gameState.currentGemType].name}
            </div>
            <div className="text-blue-200 text-sm">
              {GEM_TYPES[gameState.currentGemType].description}
            </div>
            <div className="text-yellow-300 text-sm font-semibold mt-1">
              Worth {GEM_TYPES[gameState.currentGemType].points} XP
            </div>
          </motion.div>

          {/* Word Display */}
          <motion.div
            key={`word-${gameState.currentWordIndex}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-4">
                {getWordProperty(gameState.currentWord, 'spanish')}
              </div>

              {gameState.currentWord.audio_url && (
                <button
                  onClick={() => playAudio(false)}
                  disabled={!gameState.canReplayAudio}
                  className={`mb-4 p-3 rounded-full transition-all ${
                    gameState.canReplayAudio
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              )}

              {gameState.currentWord.part_of_speech && (
                <div className="text-blue-200 text-sm mb-4">
                  {gameState.currentWord.part_of_speech}
                </div>
              )}
            </div>
          </motion.div>

          {/* Answer Input */}
          {!gameState.showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              {mode === 'multiple_choice' ? (
                <div className="space-y-3">
                  {multipleChoiceOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index.toString(), true)}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-white text-left transition-all duration-200"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={gameState.userAnswer}
                    onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnswer(gameState.userAnswer)}
                    placeholder="Type the English translation..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAnswer(gameState.userAnswer)}
                    disabled={!gameState.userAnswer.trim()}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    Mine This Gem
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Feedback */}
          {gameState.showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center p-6 rounded-xl mb-6 ${
                gameState.isCorrect
                  ? 'bg-green-500/20 border border-green-500/30 text-green-100'
                  : 'bg-red-500/20 border border-red-500/30 text-red-100'
              }`}
            >
              <div className="text-2xl mb-2">
                {gameState.isCorrect ? <CheckCircle className="h-8 w-8 mx-auto" /> : <XCircle className="h-8 w-8 mx-auto" />}
              </div>
              <div className="text-lg font-semibold mb-2">{gameState.feedback}</div>
              {gameState.currentWord.example_sentence && (
                <div className="text-sm opacity-80">
                  <div className="mb-1">"{gameState.currentWord.example_sentence}"</div>
                  {gameState.currentWord.example_translation && (
                    <div>"{gameState.currentWord.example_translation}"</div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXPGain && (
          <motion.div
            className="fixed top-20 right-8 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              +{xpGained} XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={currentAchievement}
        show={showAchievement}
        onComplete={() => {
          setShowAchievement(false);
          setCurrentAchievement(null);
        }}
      />

      {/* Level Complete Screen */}
      <AnimatePresence>
        {showLevelComplete && levelCompleteStats && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
              <p className="text-blue-200 mb-6">Excellent work mining vocabulary gems!</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white">
                  <span>Words Practiced:</span>
                  <span className="font-bold">{levelCompleteStats.totalWords}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Correct Answers:</span>
                  <span className="font-bold">{levelCompleteStats.correctAnswers}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Accuracy:</span>
                  <span className="font-bold">{levelCompleteStats.accuracy}%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Gems Collected:</span>
                  <span className="font-bold">{levelCompleteStats.gemsCollected}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>XP Earned This Session:</span>
                  <span className="font-bold text-yellow-400">{levelCompleteStats.totalXP}</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  setShowLevelComplete(false);

                  // Save session data to database
                  await saveGameSession();

                  // Call onComplete with final stats
                  if (onComplete) {
                    onComplete({
                      score: gameState.score,
                      correctAnswers: gameState.correctAnswers,
                      incorrectAnswers: gameState.incorrectAnswers,
                      totalWords: vocabulary.length,
                      timeSpent: gameState.timeSpent,
                      gemsCollected: gameState.gemsCollected,
                      maxStreak: gameState.maxStreak
                    });
                  }

                  onExit?.();
                }}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
