'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useUnifiedAuth } from '../../../../hooks/useUnifiedAuth';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
// Removed unused SpacedRepetitionService import - using direct database operations instead
import {
  Home, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw,
  Volume2, Eye, EyeOff, Clock, Star, Brain, Target,
  Zap, TrendingUp, Award, ChevronRight, Headphones,
  BookOpen, PenTool, Lightbulb, VolumeX, Play, Pause,
  Keyboard, ToggleLeft, ToggleRight, Pickaxe, Gem, Sparkles, Diamond, Crown,
  Mic, CreditCard
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
  gameMode: 'learn' | 'recall' | 'speed' | 'multiple_choice' | 'listening' | 'cloze' | 'typing' | 'match_up' | 'match' | 'dictation' | 'flashcards';
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
  speedModeTimeLeft: number;
  // Flashcard state
  isFlashcardFlipped: boolean;
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
// INTEGRATED STATISTICS DASHBOARD COMPONENT
// =====================================================

interface IntegratedStatsDashboardProps {
  userStats: {
    wordsLearned: number;
    totalWords: number;
    currentStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
  };
  gemStats: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  dailyGoals: {
    targetWords: number;
    wordsPracticed: number;
    targetMinutes: number;
    minutesPracticed: number;
    targetAccuracy: number;
    currentAccuracy: number;
  };
  gameState: GameState;
}

const IntegratedStatsDashboard: React.FC<IntegratedStatsDashboardProps> = ({
  userStats,
  gemStats,
  dailyGoals,
  gameState
}) => {
  return (
    <div className="bg-black/10 backdrop-blur-sm border-b border-white/5 p-3">
      <div className="max-w-4xl mx-auto">
        {/* Compact Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{userStats.wordsLearned}</div>
            <div className="text-xs text-blue-200">Words Learned</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{userStats.currentStreak}</div>
            <div className="text-xs text-blue-200">Day Streak</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100)}%</div>
            <div className="text-xs text-blue-200">Weekly Goal</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{dailyGoals.wordsPracticed}/{dailyGoals.targetWords}</div>
            <div className="text-xs text-blue-200">Daily Words</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{dailyGoals.minutesPracticed}/{dailyGoals.targetMinutes}</div>
            <div className="text-xs text-blue-200">Daily Minutes</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{dailyGoals.currentAccuracy}%</div>
            <div className="text-xs text-blue-200">Accuracy</div>
          </div>
        </div>

        {/* Compact Gem Collection */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm font-semibold flex items-center">
              <span className="text-lg mr-2">💎</span>
              Gem Collection
            </div>
            <div className="flex items-center space-x-2">
              {[
                { type: 'common', name: 'Common', color: 'bg-blue-500', count: gemStats.common },
                { type: 'uncommon', name: 'Uncommon', color: 'bg-green-500', count: gemStats.uncommon },
                { type: 'rare', name: 'Rare', color: 'bg-purple-500', count: gemStats.rare },
                { type: 'epic', name: 'Epic', color: 'bg-pink-500', count: gemStats.epic },
                { type: 'legendary', name: 'Legendary', color: 'bg-yellow-500', count: gemStats.legendary }
              ].map((gem) => (
                <div key={gem.type} className="flex items-center">
                  <div className={`w-4 h-4 ${gem.color} rounded-full flex items-center justify-center text-white font-bold text-xs mr-1`}>
                    {gem.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// DEMO MODE SIMULATION FUNCTIONS
// =====================================================

// Simulate gem type progression for demo users
const simulateDemoGemType = (word: VocabularyWord, isCorrect: boolean): GemType => {
  if (!isCorrect) return 'common';

  // Simple simulation based on word ID hash for consistency
  const wordHash = word.id.toString().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const randomValue = Math.abs(wordHash) % 100;

  // Progressive gem type distribution for demo
  if (randomValue < 40) return 'common';
  if (randomValue < 65) return 'uncommon';
  if (randomValue < 80) return 'rare';
  if (randomValue < 92) return 'epic';
  return 'legendary';
};

// Simulate achievements for demo users
const simulateDemoAchievements = (correctAnswers: number, streak: number): Achievement[] => {
  const achievements: Achievement[] = [];

  // First word achievement
  if (correctAnswers === 1) {
    achievements.push({
      id: 'demo_first_word',
      name: 'First Success!',
      description: 'Got your first word correct',
      icon: '🎯',
      rarity: 'common',
      progress: 1,
      maxProgress: 1,
      unlocked: true
    });
  }

  // Streak achievements
  if (streak === 5) {
    achievements.push({
      id: 'demo_streak_5',
      name: 'On Fire!',
      description: 'Got 5 words correct in a row',
      icon: '🔥',
      rarity: 'uncommon',
      progress: 5,
      maxProgress: 5,
      unlocked: true
    });
  }

  if (streak === 10) {
    achievements.push({
      id: 'demo_streak_10',
      name: 'Unstoppable!',
      description: 'Got 10 words correct in a row',
      icon: '⚡',
      rarity: 'rare',
      progress: 10,
      maxProgress: 10,
      unlocked: true
    });
  }

  return achievements;
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
  const { user: unifiedUser, isDemo } = useUnifiedAuth();
  const { supabase } = useSupabase();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const speedTimerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio system - enable by default, can be disabled via config
  const [soundEnabled, setSoundEnabled] = useState(config?.enableAudio !== false);

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
    currentGemType: 'common',
    speedModeTimeLeft: 10,
    // Flashcard state
    isFlashcardFlipped: false
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

  // Integrated statistics state
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
    // Only save to database for authenticated users
    if (!user || !supabase || isDemo) return;

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
  const retryDatabaseOperation = async function <T>(
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

  // Load integrated statistics for the dashboard
  const loadIntegratedStats = async () => {
    if (!user || !supabase) return;

    try {
      // Get user's vocabulary progress from vocabulary_gem_collection
      const { data: progressData, error: progressError } = await supabase
        .from('vocabulary_gem_collection')
        .select('*')
        .eq('student_id', user.id);

      if (progressError) {
        console.error('Error loading user progress:', progressError);
        return;
      }

      // Calculate stats from vocabulary_gem_collection
      const wordsLearned = progressData?.filter(p => p.correct_encounters > 0).length || 0;
      const totalWords = progressData?.length || 0;

      // Calculate real daily streak from vocabulary_daily_goals
      const { data: dailyGoalsData } = await supabase
        .from('vocabulary_daily_goals')
        .select('goal_date, goal_completed')
        .eq('student_id', user.id)
        .order('goal_date', { ascending: false })
        .limit(30);

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

      // Calculate weekly progress
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
          targetAccuracy: 80,
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
      console.error('Error loading integrated stats:', error);
    }
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
    if (unifiedUser && supabase) {
      // For authenticated users, load real progress
      if (user && !isDemo) {
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
              loadIntegratedStats();
            } else {
              console.warn('No valid session found');
            }
          } catch (error) {
            console.error('Error checking session:', error);
          }
        };

        initializeWithAuth();
      } else if (isDemo) {
        // For demo users, initialize with default values
        console.log('Demo user detected, initializing with demo values');
        setTotalXP(0);
        setCurrentLevel(1);
        setXpToNextLevel(100);

        // Initialize demo stats
        setUserStats({
          wordsLearned: 0,
          totalWords: vocabulary.length,
          currentStreak: 0,
          weeklyGoal: 50,
          weeklyProgress: 0
        });

        setGemStats({
          common: 0,
          uncommon: 0,
          rare: 0,
          epic: 0,
          legendary: 0
        });

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
  }, [unifiedUser, user, isDemo, supabase, vocabulary.length]);

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

  // Speed mode timer
  useEffect(() => {
    if (gameState.gameMode === 'speed' && !gameState.showAnswer) {
      speedTimerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.speedModeTimeLeft <= 1) {
            // Time's up - mark as incorrect and move to next word
            handleAnswer('', false);
            return prev;
          }
          return {
            ...prev,
            speedModeTimeLeft: prev.speedModeTimeLeft - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (speedTimerRef.current) {
        clearInterval(speedTimerRef.current);
      }
    };
  }, [gameState.gameMode, gameState.showAnswer, gameState.currentWordIndex]);

  const initializeGame = async () => {
    const firstWord = vocabulary[0];
    const gemType = await determineGemType(firstWord);

    setGameState(prev => ({
      ...prev,
      currentWord: firstWord,
      totalWords: vocabulary.length,
      currentGemType: gemType
    }));

    // Initialize based on current game mode
    if (gameState.gameMode === 'multiple_choice') {
      generateMultipleChoiceOptions(firstWord);
    }

    // Auto-play audio for listening mode
    if (gameState.gameMode === 'listening' && firstWord.audio_url) {
      setTimeout(() => playAudio(true), 500);
    }

    // Auto-play audio for dictation mode
    if (gameState.gameMode === 'dictation' && firstWord.audio_url) {
      setTimeout(() => playAudio(true), 500);
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
    console.log('🎯 Generating multiple choice for:', word, 'Correct answer:', correctAnswer);
    
    if (!correctAnswer) {
      console.error('No correct answer found for word:', word);
      return;
    }
    
    const otherWords = vocabulary.filter(w => w.id !== word.id);
    console.log('🎯 Available other words:', otherWords.length);
    
    if (otherWords.length < 3) {
      console.warn('Not enough vocabulary for multiple choice options, need at least 4 words total');
      return;
    }
    
    const wrongAnswers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => getWordProperty(w, 'english'))
      .filter(answer => answer && answer !== correctAnswer); // Filter out empty answers

    const allOptions = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5)
      .map(text => ({
        text,
        isCorrect: text === correctAnswer
      }));

    console.log('🎯 Generated multiple choice options:', allOptions);
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

    let validationResult = { isCorrect: false, missingAccents: false };
    let correctAnswer = '';

    if (isMultipleChoice) {
      validationResult.isCorrect = multipleChoiceOptions[parseInt(answer)]?.isCorrect || false;
      correctAnswer = getWordProperty(gameState.currentWord, 'english');
    } else {
      // For dictation mode, validate against the target language (spanish)
      if (gameState.gameMode === 'dictation') {
        const targetWord = gameState.currentWord.spanish;
        if (!targetWord) {
          console.error('No target language word found for dictation:', gameState.currentWord);
          return;
        }
        validationResult = validateAnswer(answer, targetWord);
        correctAnswer = targetWord;
      } else {
        // For other modes, validate against English translation
        const englishWord = getWordProperty(gameState.currentWord, 'english');
        if (!englishWord) {
          console.error('No English translation found for word:', gameState.currentWord);
          return;
        }
        validationResult = validateAnswer(answer, englishWord);
        correctAnswer = englishWord;
      }
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
      score: isCorrect ? prev.score + (prev.gameMode === 'typing' ? GEM_TYPES[prev.currentGemType].points * 2 : GEM_TYPES[prev.currentGemType].points) : prev.score,
      gemsCollected: isCorrect ? prev.gemsCollected + 1 : prev.gemsCollected,
      feedback: isCorrect ? 'Correct! Gem collected!' : `Incorrect. The answer is: ${correctAnswer}`
    }));

    // Play audio feedback
    if (gameState.currentWord?.audio_url && soundEnabled) {
      setTimeout(() => {
        playAudio(true);
      }, 800); // Play audio after showing the answer
    }

    // Play sound effects for incorrect answers (correct answers play gem collection sounds)
    if (soundEnabled && !isCorrect) {
      console.log('🎵 VocabularyMining: Playing error sound for incorrect answer');
      audioFeedbackService.playErrorSound();
    }

    // Handle gem collection and audio feedback for all users (demo and authenticated)
    if (unifiedUser && gameState.currentWord) {
      const previousGemType = gameState.currentGemType;

      // Track words practiced for achievements (demo users get visual feedback but no database saves)
      setWordsPracticed(prev => prev + 1);

      // Only record progress to database for authenticated users
      if (user && !isDemo) {
        await recordWordPractice(gameState.currentWord, isCorrect, responseTime);
      }

      // Update gem type and show collection animation (for correct answers)
      if (isCorrect) {
        // For demo users, simulate gem progression without database lookup
        const newGemType = user && !isDemo
          ? await determineGemType(gameState.currentWord)
          : simulateDemoGemType(gameState.currentWord, isCorrect);

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

        // Check for achievements (demo users get visual feedback but no database saves)
        let newAchievements: Achievement[] = [];
        if (user && !isDemo) {
          newAchievements = await achievementService.checkAchievements({
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
        } else {
          // Simulate achievements for demo users
          newAchievements = simulateDemoAchievements(gameState.correctAnswers + 1, gameState.streak + 1);
        }

        // Show achievement notification if any new achievements
        if (newAchievements.length > 0) {
          setCurrentAchievement(newAchievements[0]); // Show first achievement
          setShowAchievement(true);

          // Play achievement sound for ALL users (demo and authenticated)
          if (soundEnabled) {
            const achievement = newAchievements[0];
            const rarity = achievement.rarity === 'epic' ? 'rare' : achievement.rarity;
            console.log(`🎵 VocabularyMining: Playing achievement sound for ${rarity} achievement: ${achievement.name}`);
            audioFeedbackService.playAchievementSound(rarity as 'common' | 'rare' | 'legendary');
          }
        }

        // Play gem collection sound effects for ALL users (demo and authenticated)
        if (soundEnabled) {
          // Always play the gem collection sound (this serves as both collection and upgrade feedback)
          console.log(`🎵 VocabularyMining: Playing gem collection sound for ${newGemType} gem`);
          audioFeedbackService.playGemCollectionSound(newGemType);

          // Play special victory sound for streak milestones
          const newStreak = gameState.streak + 1;
          if (newStreak > 0 && newStreak % 5 === 0) {
            // Play special sound for streak milestones (5, 10, 15, etc.)
            console.log(`🎵 VocabularyMining: Playing streak milestone sound for streak ${newStreak}`);
            setTimeout(() => {
              audioFeedbackService.playSuccessSound();
            }, 500);
          }
        }

        // Show gem collection animation for ALL users
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
      if (soundEnabled) {
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
      currentGemType: gemType,
      speedModeTimeLeft: prev.gameMode === 'speed' ? 10 : prev.speedModeTimeLeft,
      // Reset flashcard flip state
      isFlashcardFlipped: false
    }));

    if (gameState.gameMode === 'multiple_choice') {
      generateMultipleChoiceOptions(nextWordData);
    }

    // Auto-play audio for listening mode
    if (gameState.gameMode === 'listening' && nextWordData.audio_url) {
      setTimeout(() => playAudio(true), 500);
    }

    // Auto-play audio for dictation mode
    if (gameState.gameMode === 'dictation' && nextWordData.audio_url) {
      setTimeout(() => playAudio(true), 500);
    }
  };

  const playAudio = (autoPlay = false) => {
    if (!gameState.currentWord?.audio_url || !soundEnabled) return;

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
    if (gameState.currentWord?.audio_url && soundEnabled) {
      // Small delay to ensure the word is displayed first
      setTimeout(() => {
        playAudio(true);
      }, 500);
    }
  }, [gameState.currentWord?.id, soundEnabled]);

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
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      <audio ref={audioRef} onEnded={() => setGameState(prev => ({ ...prev, audioPlaying: false }))} />

      {/* Improved Header - Clean but Functional */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onExit}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              {isAssignmentMode ? 'Back to Assignments' : 'Exit Mining'}
            </button>

            {/* Current Session Stats */}
            <div className="flex items-center space-x-6 text-white">
              {isAssignmentMode && assignmentTitle && (
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-400" />
                  <span className="font-semibold">{assignmentTitle}</span>
                </div>
              )}
              
              {/* Session Progress */}
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <span className="text-sm font-medium mr-2">Progress:</span>
                <span className="font-bold">{gameState.currentWordIndex + 1} / {gameState.totalWords}</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <GemIcon type={gameState.currentGemType} size="small" animated={true} className="mr-1" />
                  <span className="font-semibold">{gameState.gemsCollected}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>Lv.{currentLevel}</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-blue-400" />
                  <span>{sessionXP} XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const newSoundState = !soundEnabled;
                console.log(`🎵 VocabularyMining: Sound toggled to ${newSoundState ? 'ON' : 'OFF'}`);
                setSoundEnabled(newSoundState);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
              title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>

          {/* Learning Mode Selector - Larger and More Prominent */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white text-lg font-medium mr-6">Mode:</span>
              <div className="flex bg-white/10 rounded-xl p-2 space-x-2">
                {[
                  { mode: 'learn', icon: <Brain className="h-5 w-5" />, label: 'Learn', description: 'Standard learning mode' },
                  { mode: 'dictation', icon: <Mic className="h-5 w-5" />, label: 'Dictation', description: 'Listen and write what you hear' },
                  { mode: 'flashcards', icon: <CreditCard className="h-5 w-5" />, label: 'Flashcards', description: 'Quick review with cards' },
                  { mode: 'speed', icon: <Zap className="h-5 w-5" />, label: 'Speed', description: 'Quick-fire practice' },
                  { mode: 'multiple_choice', icon: <Target className="h-5 w-5" />, label: 'Multiple Choice', description: 'Choose the correct translation' },
                  { mode: 'listening', icon: <Headphones className="h-5 w-5" />, label: 'Listening', description: 'Audio recognition practice' },
                  { mode: 'typing', icon: <Keyboard className="h-5 w-5" />, label: 'Typing', description: 'Type for double points' }
                ].map(({ mode, icon, label, description }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setGameState(prev => ({ ...prev, gameMode: mode as any }));
                      if (mode === 'multiple_choice' && gameState.currentWord) {
                        generateMultipleChoiceOptions(gameState.currentWord);
                      }

                      if (mode === 'dictation' && gameState.currentWord?.audio_url) {
                        // Auto-play audio for dictation mode
                        setTimeout(() => {
                          const audio = new Audio(gameState.currentWord!.audio_url!);
                          audio.play();
                        }, 500);
                      }
                    }}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      gameState.gameMode === mode
                        ? 'bg-white text-purple-900 shadow-lg scale-105'
                        : 'text-white hover:bg-white/20 hover:scale-105'
                    }`}
                    title={description}
                  >
                    {icon}
                    <span className="ml-2">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Stats Row with XP Chart */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Gem Collection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
              <div className="text-center mb-3">
                <div className="text-white text-sm font-semibold flex items-center justify-center">
                  <span className="text-lg mr-2">💎</span>
                  Gems Collected
                </div>
              </div>
              <div className="flex justify-center space-x-2 flex-1 items-center">
                {[
                  { type: 'common', name: 'Common', color: 'bg-blue-500', count: gemStats.common },
                  { type: 'uncommon', name: 'Uncommon', color: 'bg-green-500', count: gemStats.uncommon },
                  { type: 'rare', name: 'Rare', color: 'bg-purple-500', count: gemStats.rare },
                  { type: 'epic', name: 'Epic', color: 'bg-pink-500', count: gemStats.epic },
                  { type: 'legendary', name: 'Legendary', color: 'bg-yellow-500', count: gemStats.legendary }
                ].map((gem) => (
                  <div key={gem.type} className="text-center">
                    <div className={`w-6 h-6 ${gem.color} rounded-full flex items-center justify-center text-white font-bold text-xs mb-1`}>
                      {gem.count}
                    </div>
                    <div className="text-white text-xs">{gem.name.charAt(0)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
              <div className="text-center mb-3">
                <div className="text-white text-sm font-semibold">Session Stats</div>
              </div>
              <div className="space-y-1 text-xs flex-1 flex flex-col justify-center">
                <div className="flex justify-between text-white">
                  <span>Correct:</span>
                  <span className="font-bold">{gameState.correctAnswers}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Streak:</span>
                  <span className="font-bold">{gameState.streak}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Accuracy:</span>
                  <span className="font-bold">
                    {gameState.correctAnswers + gameState.incorrectAnswers > 0 
                      ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* XP Progress Chart */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
              <div className="text-center mb-3">
                <div className="text-white text-sm font-semibold">XP Progress</div>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="text-lg font-bold text-white mb-2">Level {currentLevel}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(5, Math.min(95, 
                        ((calculateXPForLevel(currentLevel + 1) - xpToNextLevel) / calculateXPForLevel(currentLevel + 1)) * 100
                      ))}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-yellow-200">+{sessionXP} XP this session</div>
                <div className="text-xs text-blue-200 mt-1">{xpToNextLevel} XP to Level {currentLevel + 1}</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
              <div className="text-center mb-3">
                <div className="text-white text-sm font-semibold">Mining Progress</div>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="text-lg font-bold text-white mb-2">{gameState.currentWordIndex + 1} / {gameState.totalWords}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-emerald-200">{Math.round(((gameState.currentWordIndex + 1) / gameState.totalWords) * 100)}% Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area - Immersive Mining Experience */}
      <div className="flex-1 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          {/* Mining Cave Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 pointer-events-none" />
          
          {/* Depth Lines for Mine Effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        </div>

        {/* Central Mining Chamber */}
        <div className="relative z-10 flex items-center justify-center min-h-full p-8">
          <div className="max-w-6xl w-full">

            {/* Main Mining Interface - Symmetrical Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Side - Gem Discovery Zone */}
              <div className="order-1">
                <motion.div
                  key={gameState.currentWordIndex}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative"
                >
                  {/* Gem Discovery Chamber */}
                  <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl 
                                rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl overflow-hidden">
                    
                    {/* Inner Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-10 rounded-3xl
                      ${gameState.currentGemType === 'legendary' ? 'from-yellow-400 to-orange-500' :
                        gameState.currentGemType === 'epic' ? 'from-pink-400 to-purple-500' :
                        gameState.currentGemType === 'rare' ? 'from-purple-400 to-indigo-500' :
                        gameState.currentGemType === 'uncommon' ? 'from-green-400 to-emerald-500' :
                        'from-blue-400 to-cyan-500'}`} 
                    />
                    
                    {/* Gem Spotlight */}
                    <div className="text-center relative z-10">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mb-6 flex justify-center"
                      >
                        <GemIcon
                          type={gameState.currentGemType}
                          size="xl"
                          animated={true}
                        />
                      </motion.div>
                      
                      {/* Gem Information */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">
                          {GEM_TYPES[gameState.currentGemType].name}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {GEM_TYPES[gameState.currentGemType].description}
                        </p>
                        
                        {/* XP Value Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 
                                      backdrop-blur-sm border border-yellow-500/30 rounded-full">
                          <span className="text-yellow-300 font-bold">
                            Worth {gameState.gameMode === 'typing' ? (
                              <span className="flex items-center space-x-2">
                                <span>{GEM_TYPES[gameState.currentGemType].points * 2} XP</span>
                                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">2x BONUS</span>
                              </span>
                            ) : (
                              <span>{GEM_TYPES[gameState.currentGemType].points} XP</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mining Tool Indicator */}
                    <div className="absolute bottom-4 right-4 text-3xl opacity-30">
                      ⛏️
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Center - Word Challenge */}
              <div className="order-2 flex justify-center">
                <motion.div
                  key={`word-${gameState.currentWordIndex}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
                  className="text-center w-full"
                >
                  {/* Word Display */}
                  <div className="relative">
                    {/* Word Container */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl 
                                  border-2 border-white/20 p-8 shadow-2xl min-h-[300px] flex flex-col justify-center">
                      
                      {gameState.gameMode === 'listening' ? (
                        <div className="space-y-6">
                          <div className="text-6xl mb-4">🎧</div>
                          <h2 className="text-2xl font-bold text-white">Listen Carefully</h2>
                          <button
                            onClick={() => playAudio(false)}
                            disabled={!gameState.canReplayAudio}
                            className={`mx-auto p-4 rounded-full transition-all transform hover:scale-110 ${
                              gameState.canReplayAudio
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <Volume2 className="h-6 w-6" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            {getWordProperty(gameState.currentWord, 'spanish')}
                          </h1>
                          
                          {gameState.currentWord.part_of_speech && (
                            <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm 
                                          border border-blue-500/30 rounded-full text-blue-200 text-base">
                              {gameState.currentWord.part_of_speech}
                            </div>
                          )}
                          
                          {/* Audio Button */}
                          {gameState.currentWord.audio_url && (
                            <div className="mt-6">
                              <button
                                onClick={() => playAudio(false)}
                                disabled={!gameState.canReplayAudio}
                                className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                                  gameState.canReplayAudio
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                }`}
                              >
                                <Volume2 className="h-6 w-6" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Speed Mode Timer */}
                      {gameState.gameMode === 'speed' && !gameState.showAnswer && (
                        <motion.div
                          animate={{ scale: gameState.speedModeTimeLeft <= 3 ? [1, 1.1, 1] : 1 }}
                          transition={{ duration: 0.5, repeat: gameState.speedModeTimeLeft <= 3 ? Infinity : 0 }}
                          className={`absolute -top-4 -right-4 px-4 py-2 rounded-full font-bold text-lg
                            ${gameState.speedModeTimeLeft <= 3 
                              ? 'bg-red-500 text-white shadow-red-500/50' 
                              : 'bg-yellow-500 text-black shadow-yellow-500/50'
                            } shadow-lg`}
                        >
                          ⏱️ {gameState.speedModeTimeLeft}s
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Mining Interface */}
              <div className="order-3">
                {/* Answer Input */}
                {!gameState.showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl 
                             rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">🔍 Mine the Translation</h3>
                      <p className="text-slate-300">Extract the English meaning</p>
                    </div>

                    {gameState.gameMode === 'multiple_choice' ? (
                      <div className="space-y-3">
                        {multipleChoiceOptions.map((option, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswer(index.toString(), true)}
                            className="w-full bg-gradient-to-r from-slate-700/60 to-slate-800/60 hover:from-slate-600/60 hover:to-slate-700/60 
                                     border-2 border-slate-600/30 hover:border-slate-500/50 rounded-xl p-4 text-white text-left 
                                     transition-all duration-200 backdrop-blur-sm"
                          >
                            <span className="font-medium">{option.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    ) : gameState.gameMode === 'dictation' ? (
                      <div className="space-y-4">
                        <div className="text-center text-green-200 text-sm mb-4">🎤 Listen carefully and write what you hear</div>
                        <div className="text-center mb-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (gameState.currentWord?.audio_url) {
                                const audio = new Audio(gameState.currentWord.audio_url);
                                audio.play();
                              }
                            }}
                            className="bg-gradient-to-r from-green-600/60 to-emerald-600/60 hover:from-green-500/60 hover:to-emerald-500/60 
                                     border-2 border-green-500/30 rounded-full p-4 text-white transition-all duration-200"
                          >
                            <Volume2 className="h-8 w-8" />
                          </motion.button>
                          <div className="text-green-300 text-sm mt-2">Click to replay audio</div>
                        </div>
                        <div className="relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={gameState.userAnswer}
                            onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnswer(gameState.userAnswer)}
                            placeholder="Type what you heard..."
                            className="w-full bg-slate-700/40 border-2 border-slate-600/30 focus:border-green-500/50 
                                     rounded-xl px-6 py-4 text-white text-lg placeholder-slate-400 
                                     focus:ring-4 focus:ring-green-500/20 focus:outline-none backdrop-blur-sm
                                     transition-all duration-200"
                            autoFocus
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(gameState.userAnswer)}
                          disabled={!gameState.userAnswer.trim()}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 
                                   disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl 
                                   transition-all duration-200 disabled:cursor-not-allowed shadow-lg text-lg
                                   disabled:opacity-50 transform hover:shadow-green-500/25"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <Mic className="h-5 w-5" />
                            <span>Submit Dictation</span>
                          </span>
                        </motion.button>
                      </div>
                    ) : gameState.gameMode === 'flashcards' ? (
                      <div className="space-y-4">
                        {/* Flashcard */}
                        <motion.div
                          className="relative h-40 w-full max-w-md mx-auto cursor-pointer"
                          onClick={() => setGameState(prev => ({ ...prev, isFlashcardFlipped: !prev.isFlashcardFlipped }))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 w-full h-full rounded-xl shadow-lg"
                            initial={false}
                            animate={{ rotateY: gameState.isFlashcardFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            {/* Front of card (Target Language) */}
                            <div
                              className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20
                                       border-2 border-yellow-500/30 rounded-xl p-4 flex flex-col justify-center items-center
                                       backface-hidden"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <div className="text-yellow-300 text-xs mb-2 text-center">
                                📚 Click the card to flip it
                              </div>
                              <div className="text-white font-bold text-2xl text-center">
                                {gameState.currentWord?.spanish || ''}
                              </div>
                            </div>

                            {/* Back of card (English) */}
                            <div
                              className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20
                                       border-2 border-green-500/30 rounded-xl p-4 flex flex-col justify-center items-center
                                       backface-hidden"
                              style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)"
                              }}
                            >
                              <div className="text-green-300 text-xs mb-2 text-center">
                                📚 Click the card to flip it
                              </div>
                              <div className="text-white font-bold text-2xl text-center">
                                {gameState.currentWord?.english || ''}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setGameState(prev => ({
                                ...prev,
                                correctAnswers: prev.correctAnswers + 1,
                                score: prev.score + 10,
                                streak: prev.streak + 1,
                                maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
                                isFlashcardFlipped: false
                              }));
                              setTimeout(() => nextWord(), 500);
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                                     text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg
                                     transform hover:shadow-green-500/25"
                          >
                            <span className="flex items-center justify-center space-x-2">
                              <span>✓ I knew it</span>
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setGameState(prev => ({
                                ...prev,
                                incorrectAnswers: prev.incorrectAnswers + 1,
                                streak: 0,
                                isFlashcardFlipped: false
                              }));
                              setTimeout(() => nextWord(), 500);
                            }}
                            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500
                                     text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg
                                     transform hover:shadow-red-500/25"
                          >
                            <span className="flex items-center justify-center space-x-2">
                              <span>✗ I didn't know</span>
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {gameState.gameMode === 'listening' && (
                          <div className="text-center mb-4">
                            <div className="text-blue-200 text-sm mb-3">🎧 Type what you heard</div>
                          </div>
                        )}
                        
                        <div className="relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={gameState.userAnswer}
                            onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnswer(gameState.userAnswer)}
                            placeholder={gameState.gameMode === 'listening' ? "Type what you heard..." : "Type the English translation..."}
                            className="w-full bg-slate-700/40 border-2 border-slate-600/30 focus:border-blue-500/50 
                                     rounded-xl px-6 py-4 text-white text-lg placeholder-slate-400 
                                     focus:ring-4 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm
                                     transition-all duration-200"
                            autoFocus
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none" />
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(gameState.userAnswer)}
                          disabled={!gameState.userAnswer.trim()}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 
                                   disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl 
                                   transition-all duration-200 disabled:cursor-not-allowed shadow-lg text-lg
                                   disabled:opacity-50 transform hover:shadow-emerald-500/25"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <span>⛏️</span>
                            <span>Mine This Gem</span>
                            <span>💎</span>
                          </span>
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Feedback Display */}
                {gameState.showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`bg-gradient-to-br backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl ${
                      gameState.isCorrect
                        ? 'from-emerald-500/20 to-green-500/20 border-emerald-500/40'
                        : 'from-red-500/20 to-rose-500/20 border-red-500/40'
                    }`}
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
                        className="mb-4"
                      >
                        {gameState.isCorrect ? (
                          <div className="text-6xl mb-2">🎉</div>
                        ) : (
                          <div className="text-6xl mb-2">💔</div>
                        )}
                      </motion.div>
                      
                      <h3 className={`text-2xl font-bold mb-3 ${
                        gameState.isCorrect ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {gameState.isCorrect ? 'Gem Mined Successfully!' : 'Mining Failed'}
                      </h3>
                      
                      <p className="text-white text-lg mb-4 font-medium">
                        {gameState.feedback}
                      </p>
                      
                      {/* Example Sentence */}
                      {gameState.currentWord.example_sentence && (
                        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                          <div className="text-sm text-slate-300 space-y-2">
                            <div className="italic">"{gameState.currentWord.example_sentence}"</div>
                            {gameState.currentWord.example_translation && (
                              <div className="text-slate-400">"{gameState.currentWord.example_translation}"</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
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
