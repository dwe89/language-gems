'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useUnifiedAuth } from '../../../../hooks/useUnifiedAuth';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { Volume2 } from 'lucide-react';
import GemIcon, { GemType } from '../../../../components/ui/GemIcon';
import GemCollectionAnimation from '../../../../components/ui/GemCollectionAnimation';
import AchievementNotification from '../../../../components/ui/AchievementNotification';
import { audioFeedbackService } from '../../../../services/audioFeedbackService';
import { achievementService, Achievement } from '../../../../services/achievementService';
import { EnhancedGameService } from '../../../../services/enhancedGameService';

// Import custom hooks
import { useGameLogic } from '../hooks/useGameLogic';
import { useUserProgress } from '../hooks/useUserProgress';
import { useAudio } from '../hooks/useAudio';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useSessionSaving } from '../hooks/useSessionSaving';

// Import UI components
import { GameHeader } from './GameHeader';
import { LevelCompleteScreen } from './LevelCompleteScreen';
import { GameCompleteScreen } from './GameCompleteScreen';
import { GameStats } from './GameStats';
import { GameModeInline } from './GameModeInline';
import { AnswerInterface } from './AnswerInterface';

// Import utilities and constants
import { GEM_TYPES, getWordProperty, calculateXPForLevel, GameModeType } from '../utils/gameConstants';
import { validateAnswer } from '../utils/answerValidation';
import { RewardEngine, type GemRarity } from '../../../../services/rewards/RewardEngine';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

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
      category: 'practice',
      rarity: 'common',
      requirement: { type: 'words_practiced', target: 1 },
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
      category: 'streak',
      rarity: 'common', // Fixed: changed from 'uncommon' to 'common'
      requirement: { type: 'streak', target: 5 },
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
      category: 'streak',
      rarity: 'rare',
      requirement: { type: 'streak', target: 10 },
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

  // Audio ref for word pronunciation
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Input ref for text input focus
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Initialize custom hooks
  const gameLogic = useGameLogic(vocabulary);
  const userProgress = useUserProgress(supabase, user?.id || null);
  const audioSystem = useAudio(soundEnabled);
  const spacedRepetition = useSpacedRepetition(supabase, user?.id || null);
  const sessionSaving = useSessionSaving(supabase, user?.id || null, gameLogic.gameState, vocabulary, isDemo);

  // Extract refs and state from gameLogic hook
  const {
    gameState,
    setGameState,
    multipleChoiceOptions,
    setMultipleChoiceOptions,
    gameComplete,
    setGameComplete,
    showHint,
    setShowHint,
    timerRef,
    speedTimerRef,
    initializeGame,
    generateMultipleChoiceOptions
  } = gameLogic;

  // Additional state not handled by hooks

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

  // Session saving is now handled by useSessionSaving hook

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
      initializeGame();
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

  // initializeGame function is now provided by useGameLogic hook

  const determineGemType = async (word: VocabularyWord, responseTime: number = 3000, hintUsed: boolean = false): Promise<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'> => {
    if (!user || !supabase) return 'common';

    try {
      // Use word.id directly as UUID (from centralized_vocabulary)
      const vocabularyId = word.id;

      // Get user's progress for this word from vocabulary_gem_collection
      const { data: progressData, error: progressError } = await supabase
        .from('vocabulary_gem_collection')
        .select('correct_encounters, mastery_level, max_gem_rarity')
        .eq('student_id', user.id)
        .eq('vocabulary_item_id', vocabularyId);

      if (progressError) {
        console.error('🚨 Error querying progress for gem type:', progressError);
        return 'common'; // fallback
      }

      const progress = progressData && progressData.length > 0 ? progressData[0] : null;

      // Use RewardEngine to calculate gem rarity
      const rarity = RewardEngine.calculateGemRarity('vocabulary-mining', {
        responseTimeMs: responseTime,
        streakCount: gameState.streak,
        hintUsed,
        isTypingMode: gameState.gameMode === 'typing',
        isDictationMode: false,
        masteryLevel: progress?.mastery_level || 0,
        maxGemRarity: progress?.max_gem_rarity as GemRarity || 'rare'
      });

      return rarity;
    } catch (error) {
      console.error('Error determining gem type:', error);
      return 'common';
    }
  };

  // generateMultipleChoiceOptions function is now provided by useGameLogic hook

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
          ? await determineGemType(gameState.currentWord, responseTime, gameState.isAnswerRevealed)
          : simulateDemoGemType(gameState.currentWord, isCorrect);

        const upgraded = newGemType !== previousGemType;

        // Calculate points using RewardEngine
        const points = RewardEngine.getXPValue(newGemType);

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
    const gemType = await determineGemType(nextWordData, 3000, false); // Default values for new word

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
      // Reset audio replay state for new word
      audioReplayCount: 0,
      canReplayAudio: true,
      // Reset flashcard flip state
      isFlashcardFlipped: false
    }));

    // Reset hint state
    setShowHint(false);

    if (gameState.gameMode === 'multiple_choice') {
      const options = generateMultipleChoiceOptions(nextWordData);
      setMultipleChoiceOptions(options);
    }

    // Auto-play audio for listening mode and learn mode (but not typing mode)
    if (gameState.gameMode === 'listening' && nextWordData.audio_url) {
      setTimeout(() => playAudio(true), 500);
    }

    // Auto-play audio for dictation mode
    if (gameState.gameMode === 'dictation' && nextWordData.audio_url) {
      setTimeout(() => playAudio(true), 500);
    }

    // Auto-play audio for learn mode (slower pace)
    if (gameState.gameMode === 'learn' && nextWordData.audio_url) {
      setTimeout(() => playAudio(true), 1500);
      // Auto-show hint after 5 seconds in learn mode
      setTimeout(() => setShowHint(true), 5000);
    }
  };

  const playAudio = (autoPlay = false) => {
    if (!gameState.currentWord?.audio_url || !soundEnabled) return;

    // For manual clicks, check replay limit (max 3 replays)
    if (!autoPlay && gameState.audioReplayCount >= 3) {
      console.log('Audio replay limit reached');
      return;
    }

    // Use the enhanced audio system for auto-play
    if (autoPlay) {
      audioSystem.autoPlayWordAudio(gameState.currentWord.audio_url, gameState.gameMode);
      setGameState(prev => ({
        ...prev,
        audioPlaying: true
      }));
    } else {
      // Manual play - track replay count
      audioSystem.playWordAudio(gameState.currentWord.audio_url, gameState.canReplayAudio)
        .then(() => {
          setGameState(prev => ({
            ...prev,
            audioPlaying: false
          }));
        });

      setGameState(prev => ({
        ...prev,
        audioPlaying: true,
        audioReplayCount: prev.audioReplayCount + 1,
        canReplayAudio: prev.audioReplayCount < 2 // Allow up to 3 total plays (initial + 2 replays)
      }));
    }
  };

  // Removed conflicting auto-play useEffect - audio is now controlled explicitly in nextWord function

  // Handle flashcard responses with proper XP and progress tracking
  const handleFlashcardResponse = async (knew: boolean) => {
    if (!gameState.currentWord) return;

    const responseTime = Date.now() - gameState.startTime.getTime();

    // Update game state
    setGameState(prev => ({
      ...prev,
      isCorrect: knew,
      showAnswer: false, // Don't show answer for flashcards
      correctAnswers: knew ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: knew ? prev.incorrectAnswers : prev.incorrectAnswers + 1,
      streak: knew ? prev.streak + 1 : 0,
      maxStreak: knew ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
      isFlashcardFlipped: false
    }));

    // Play audio feedback
    if (soundEnabled) {
      if (knew) {
        audioSystem.playGemSound(gameState.currentGemType);
      } else {
        audioSystem.playFeedbackSound('incorrect');
      }
    }

    // Handle gem collection and progress tracking for authenticated users
    if (user && !isDemo && gameState.currentWord) {
      try {
        const result = await spacedRepetition.recordWordPractice(
          gameState.currentWord,
          knew,
          responseTime
        );

        if (result) {
          // Update XP and gem stats
          const { leveledUp } = userProgress.addXP(result.points);

          // Update gem collection state
          setGemsByType(prev => ({
            ...prev,
            [result.gemType as GemType]: prev[result.gemType as GemType] + 1
          }));

          // Show gem collection animation
          setCollectedGemType(result.gemType as GemType);
          setGemPoints(result.points);
          setGemUpgraded(result.upgraded);
          setShowGemAnimation(true);

          // Check for achievements
          const newAchievements = await achievementService.checkAchievements({
            gemsCollected: gameState.gemsCollected + 1,
            gemsByType: { ...gemsByType, [result.gemType as GemType]: gemsByType[result.gemType as GemType] + 1 },
            currentStreak: knew ? gameState.streak + 1 : 0,
            maxStreak: knew ? Math.max(gameState.maxStreak, gameState.streak + 1) : gameState.maxStreak,
            currentLevel: currentLevel,
            wordsPracticed: wordsPracticed + 1,
            sessionAccuracy: gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)
          });

          if (newAchievements.length > 0) {
            setCurrentAchievement(newAchievements[0]);
            setShowAchievement(true);
          }
        }
      } catch (error) {
        console.error('Error recording flashcard practice:', error);
      }
    } else if (isDemo) {
      // Demo mode - simulate progress
      const points = knew ? 25 : 5; // Give some points even for "didn't know" to encourage learning
      userProgress.addXP(points);

      // Simulate achievements for demo
      const demoAchievements = simulateDemoAchievements(gameState.correctAnswers + (knew ? 1 : 0), knew ? gameState.streak + 1 : 0);
      if (demoAchievements.length > 0) {
        setCurrentAchievement(demoAchievements[0]);
        setShowAchievement(true);
      }
    }

    // Auto-advance to next word after a short delay
    setTimeout(async () => {
      await nextWord();
    }, 1000);
  };

  if (gameComplete) {
    return (
      <GameCompleteScreen
        gameState={gameState}
        isAssignmentMode={isAssignmentMode}
        onExit={onExit || (() => {})}
      />
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

      {/* Game Header */}
      <GameHeader
        onExit={onExit || (() => {})}
        assignmentTitle={assignmentTitle}
        isAssignmentMode={isAssignmentMode}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const newSoundState = !soundEnabled;
          console.log(`🎵 VocabularyMining: Sound toggled to ${newSoundState ? 'ON' : 'OFF'}`);
          setSoundEnabled(newSoundState);
        }}
        currentLevel={currentLevel}
        totalXP={totalXP}
        xpToNextLevel={xpToNextLevel}
        sessionXP={sessionXP}
        gemsCollected={gameState.gemsCollected}
        currentGemType={gameState.currentGemType}
        progress={gameState.currentWordIndex + 1}
        totalWords={gameState.totalWords}
        streak={gameState.streak}
        maxStreak={gameState.maxStreak}
      />

      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Learning Mode Selector - Larger and More Prominent */}
          <GameModeInline
            currentMode={gameState.gameMode as GameModeType}
            onModeChange={(mode) => {
              setGameState(prev => ({ ...prev, gameMode: mode as any }));
            }}
            onModeChangeCallback={(mode, currentWord) => {
              if (mode === 'multiple_choice' && currentWord) {
                const options = generateMultipleChoiceOptions(currentWord);
                setMultipleChoiceOptions(options);
              }

              if (mode === 'dictation' && currentWord?.audio_url) {
                // Auto-play audio for dictation mode
                setTimeout(() => {
                  const audio = new Audio(currentWord.audio_url!);
                  audio.play();
                }, 500);
              }
            }}
            currentWord={gameState.currentWord}
          />

          {/* Enhanced Stats Row with XP Chart */}
          <GameStats
            gameState={gameState}
            gemStats={gemsByType} // <--- CHANGED THIS LINE
            currentLevel={currentLevel}
            sessionXP={sessionXP}
            xpToNextLevel={xpToNextLevel}
            calculateXPForLevel={calculateXPForLevel}
          />
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
                            className={`mx-auto p-4 rounded-full transition-all transform hover:scale-110 ${gameState.canReplayAudio
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              }`}
                          >
                            <Volume2 className="h-6 w-6" />
                          </button>
                        </div>
                      ) : gameState.gameMode === 'dictation' ? (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">Listen & Write</h2>
                          <p className="text-white/80 text-lg">Listen carefully and type what you hear</p>
                          <button
                            onClick={() => playAudio(false)}
                            disabled={!gameState.canReplayAudio}
                            className={`mx-auto p-4 rounded-full transition-all transform hover:scale-110 ${gameState.canReplayAudio
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              }`}
                          >
                            <Volume2 className="h-6 w-6" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight break-words">
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
                                className={`p-4 rounded-full transition-all transform hover:scale-110 ${gameState.canReplayAudio
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
                <AnswerInterface
                  gameState={gameState}
                  multipleChoiceOptions={multipleChoiceOptions}
                  showHint={showHint}
                  handleAnswer={handleAnswer}
                  handleFlashcardResponse={handleFlashcardResponse}
                  setGameState={setGameState}
                  setShowHint={setShowHint}
                  getWordProperty={getWordProperty}
                />
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
      <LevelCompleteScreen
        show={showLevelComplete}
        stats={levelCompleteStats}
        onContinue={async () => {
          setShowLevelComplete(false);

          // Save session data to database using enhanced session saving
          await sessionSaving.saveNow();

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
      />
    </div>
  );
}