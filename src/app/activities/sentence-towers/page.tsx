'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Flame, Clock, Trophy, Star, Settings,
  Volume2, VolumeX, Pause, Play, RotateCcw, Maximize, Minimize, BookOpen, Target
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { useSounds } from './hooks/useSounds';

import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { EnhancedGameService } from '../../../services/enhancedGameService';
import { RewardEngine } from '../../../services/rewards/RewardEngine';
import { getBufferedGameSessionService } from '../../../services/buffered/BufferedGameSessionService';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import { useSentences } from '../../../hooks/useSentences';
import { FSRSService } from '../../../services/fsrsService';

// Enhanced Types
interface TowerBlock {
  id: string;
  type: 'standard' | 'bonus' | 'challenge' | 'fragile';
  word: string;
  translation: string;
  points: number;
  position: number;
  isShaking: boolean;
  createdAt: number;
  responseTime?: number; // Add response time for time-based scoring
}

interface GameState {
  status: 'ready' | 'playing' | 'paused' | 'failed';
  score: number;
  blocksPlaced: number;
  blocksFallen: number;
  currentHeight: number;
  maxHeight: number;
  currentLevel: number;
  accuracy: number;
  streak: number;
  multiplier: number;
  timeLeft: number;
  wordsCompleted: number;
  totalWords: number;
  needsVocabularyReset?: boolean;
}

interface WordOption {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  difficulty: number;
  isCustomVocabulary?: boolean; // ✅ Track if from enhanced_vocabulary_items
}

interface ParticleEffect {
  id: string;
  type: 'success' | 'error' | 'placement' | 'destruction' | 'combo' | 'lightning' | 'timebonus';
  position: { x: number; y: number };
  intensity: number;
  timestamp: number;
}

interface GameSettings {
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  towerFalling: boolean;
  soundEnabled: boolean;
  showHints: boolean;
  animationSpeed: number;
}

// Vocabulary is now loaded dynamically from the category system

// Enhanced Particle System Component
const ParticleSystem = ({ effects }: { effects: ParticleEffect[] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {effects.map((effect) => (
        <motion.div
          key={effect.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
          style={{
            left: effect.position.x,
            top: effect.position.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {effect.type === 'success' && (
            <div className="text-green-400 text-4xl font-bold animate-bounce">
              +{effect.intensity * 10}
            </div>
          )}
          {effect.type === 'error' && (
            <div className="text-red-400 text-3xl font-bold animate-pulse">
              ❌
            </div>
          )}
          {effect.type === 'combo' && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.5, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-yellow-400 text-5xl font-bold"
            >
              <div className="relative">
                🔥 COMBO x{effect.intensity}
                <div className="absolute inset-0 animate-pulse bg-yellow-400/20 rounded-full blur-xl"></div>
              </div>
            </motion.div>
          )}
          {effect.type === 'lightning' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5] }}
              transition={{ duration: 0.8, times: [0, 0.3, 1] }}
              className="text-electric-blue text-6xl font-bold"
            >
              ⚡ MULTIPLIER x{effect.intensity}!
            </motion.div>
          )}
          {effect.type === 'timebonus' && (
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -50, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="text-cyan-400 text-3xl font-bold"
            >
              ⏱️ SPEED BONUS +{effect.intensity}!
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Crane Component
const AnimatedCrane = ({
  isLifting,
  liftedWord,
  onComplete,
  towerHeight
}: {
  isLifting: boolean;
  liftedWord: string;
  onComplete: () => void;
  towerHeight: number;
}) => {
  const [phase, setPhase] = useState<'idle' | 'descending' | 'lifting' | 'moving' | 'dropping'>('idle');

  useEffect(() => {
    if (isLifting) {
      setPhase('descending'); // Crane starts moving IMMEDIATELY - no delay
      const sequence = async () => {
        await new Promise(resolve => setTimeout(resolve, 400)); // More natural descending time
        setPhase('lifting');
        await new Promise(resolve => setTimeout(resolve, 300)); // Good lifting time
        setPhase('moving');
        await new Promise(resolve => setTimeout(resolve, 500)); // Smooth moving time
        setPhase('dropping');
        await new Promise(resolve => setTimeout(resolve, 200)); // Quick drop
        setPhase('idle');
        onComplete();
      };
      sequence();
    }
  }, [isLifting, onComplete]);

  return (
    <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-40">
      <motion.div
        className="relative"
        animate={{
          x: phase === 'moving' ? 0 : phase === 'descending' || phase === 'lifting' ? -120 : 0
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }} // Natural movement speed - not too fast, not too slow
      >
        {/* Crane base and mast */}
        <div className="relative">
          <div className="w-6 h-32 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-lg shadow-2xl border-2 border-yellow-700"></div>

          {/* Crane jib (horizontal arm) */}
          <div className="absolute top-4 left-6 w-32 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-r-lg shadow-lg border border-yellow-700"></div>

          {/* Crane counterweight */}
          <div className="absolute top-4 right-0 w-4 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded shadow-lg"></div>

          {/* Operator cabin */}
          <div className="absolute top-8 left-2 w-8 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded shadow-lg border border-blue-700"></div>
        </div>

        {/* Crane cable */}
        <motion.div
          className="absolute top-6 left-32 w-1 bg-gray-800 shadow-sm"
          animate={{
            height: phase === 'descending' ? 100 + (towerHeight * 17) :
              phase === 'lifting' || phase === 'moving' ? 80 + (towerHeight * 17) :
                50 + (towerHeight * 17)
          }}
          transition={{ duration: 0.3 }} // Natural cable extension speed
        />

        {/* Crane hook with word */}
        <motion.div
          className="absolute left-31 bg-gray-700 w-3 h-3 rounded-full shadow-lg border border-gray-900"
          animate={{
            top: phase === 'descending' ? 106 + (towerHeight * 17) :
              phase === 'lifting' || phase === 'moving' ? 86 + (towerHeight * 17) :
                56 + (towerHeight * 17)
          }}
          transition={{ duration: 0.3 }} // Natural hook movement speed
        >
          {liftedWord && (phase === 'lifting' || phase === 'moving') && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-2xl border border-blue-800">
              {liftedWord}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Enhanced Background Component
const DynamicBackground = ({
  level,
  timeOfDay,
  weather
}: {
  level: number;
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  weather: 'clear' | 'cloudy' | 'rain';
}) => {
  const getOverlayColor = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-orange-400/20';
      case 'day':
        return 'bg-blue-400/10';
      case 'evening':
        return 'bg-orange-500/30';
      case 'night':
        return 'bg-purple-900/40';
      default:
        return 'bg-blue-400/10';
    }
  };

  return (
    <div className="absolute inset-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/games/sentence-towers/background.png)'
        }}
      />

      {/* Dynamic time overlay */}
      <div className={`absolute inset-0 ${getOverlayColor()} transition-all duration-1000`} />

      {/* Weather effects */}
      {weather === 'rain' && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-6 bg-blue-300/60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`
              }}
              animate={{
                y: ['0vh', '110vh']
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function SentenceTowersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Option B: Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Load assignment data if in assignment mode (hook must be called unconditionally)
  // filterOutstanding=true filters out mastered words (accuracy ≥ 80% AND encounters ≥ 3)
  const { assignment, vocabulary: assignmentVocabulary, sentences: assignmentSentences, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'sentence-towers', true);

  // Build assignment JSX after all hooks
  let assignmentJSX: JSX.Element | null = null;

  if (isAssignmentMode) {
    if (!user) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-xl">Please log in to access this assignment</div>
        </div>
      );
    } else if (assignmentLoading) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-xl">Loading assignment...</div>
        </div>
      );
    } else if (assignmentError || !assignmentVocabulary || assignmentVocabulary.length === 0) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-xl">Error loading assignment: {assignmentError || 'No vocabulary found'}</div>
        </div>
      );
    } else {
      // Convert assignment data to game format - use sentences if available, otherwise vocabulary
      const gameVocabulary = assignmentSentences && assignmentSentences.length > 0
        ? assignmentSentences.map(item => ({
          id: item.id,
          word: item.source_sentence || item.sentence_original || item.original || item.text,
          translation: item.english_translation || item.sentence_translation || item.translation || item.translation_text,
          language: item.source_language || assignment?.vocabulary_criteria?.language || 'spanish',
          category: item.category || 'assignment',
          subcategory: item.subcategory || 'assignment',
          part_of_speech: 'sentence',
          example_sentence_original: item.source_sentence || item.sentence_original || item.original || item.text,
          example_sentence_translation: item.english_translation || item.sentence_translation || item.translation || item.translation_text,
          difficulty_level: item.difficulty_level || 'intermediate'
        }))
        : assignmentVocabulary.map(item => ({
          id: item.id,
          word: item.word,
          translation: item.translation,
          language: item.language || assignment?.vocabulary_criteria?.language || 'spanish',
          category: item.category || 'assignment',
          subcategory: item.subcategory || 'assignment',
          part_of_speech: item.part_of_speech || 'noun',
          example_sentence_original: '',
          example_sentence_translation: '',
          difficulty_level: 'beginner'
        }));

      assignmentJSX = (
        <ImprovedSentenceTowersGame
          gameVocabulary={gameVocabulary}
          onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
          config={{
            language: assignment?.vocabulary_criteria?.language || 'spanish',
            categoryId: assignment?.vocabulary_criteria?.category || 'assignment',
            subcategoryId: assignment?.vocabulary_criteria?.subcategory || 'assignment',
            curriculumLevel: (assignment?.curriculum_level as 'KS2' | 'KS3' | 'KS4' | 'KS5') || 'KS3'
          }}
          assignmentMode={true}
          isAssignmentMode={true}
          assignmentId={assignmentId!}
          userId={user.id}
          assignmentTitle={assignment?.title}
        />
      );
    }
  }

  // Return assignment JSX if in assignment mode
  if (assignmentJSX) {
    return assignmentJSX;
  }

  // Game state management for free play
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<SentenceSelectionConfig | null>(null);

  // Load sentences for free play mode based on config
  const { sentences: freePlaySentences, loading: sentencesLoading } = useSentences({
    language: gameConfig?.language || 'es',
    category: gameConfig?.categoryId || undefined,
    subcategory: gameConfig?.subcategoryId || undefined,
    curriculumLevel: gameConfig?.curriculumLevel || 'KS3',
    limit: 50
  });

  // Handle selection complete from UnifiedSentenceCategorySelector
  const handleSelectionComplete = (config: SentenceSelectionConfig) => {
    console.log('Sentence Towers starting with config:', config);
    setGameConfig(config);
    setGameStarted(true);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Show sentence category selector if game not started
  if (!gameStarted) {
    return (
      <UnifiedSentenceCategorySelector
        gameName="Sentence Towers"
        title="Sentence Towers - Select Content"
        supportedLanguages={['spanish', 'french', 'german']}
        showCustomMode={false} // Uses pre-generated sentence database
        onSelectionComplete={handleSelectionComplete}
        onBack={() => router.push('/games')}
      />
    );
  }

  // Show game if started and sentences are loaded
  if (gameStarted && gameConfig && freePlaySentences.length > 0) {
    // Convert sentences to game format
    const gameVocabulary = freePlaySentences.map(sentence => ({
      id: sentence.id,
      word: sentence.source_sentence,
      translation: sentence.english_translation,
      language: sentence.source_language,
      category: sentence.category || 'general',
      subcategory: sentence.subcategory || 'general',
      part_of_speech: 'sentence',
      example_sentence_original: sentence.source_sentence,
      example_sentence_translation: sentence.english_translation,
      difficulty_level: sentence.difficulty_level || 'intermediate'
    }));

    const config: UnifiedSelectionConfig = {
      language: gameConfig.language,
      categoryId: gameConfig.categoryId || 'general',
      subcategoryId: gameConfig.subcategoryId || '',
      curriculumLevel: gameConfig.curriculumLevel as any
    };

    return (
      <ImprovedSentenceTowersGame
        gameVocabulary={gameVocabulary}
        onBackToMenu={handleBackToMenu}
        config={config}
      />
    );
  }

  // Loading state
  if (gameStarted && sentencesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading sentences...</div>
      </div>
    );
  }

  // Fallback
  return null;
}

// Extract the main game logic into a separate component
export function ImprovedSentenceTowersGame({
  gameVocabulary,
  onBackToMenu,
  config,
  assignmentMode = false,
  isAssignmentMode = false,
  assignmentId,
  userId,
  onGameComplete,
  onProgressUpdate,
  assignmentTitle
}: {
  gameVocabulary: any[];
  onBackToMenu: () => void;
  config: UnifiedSelectionConfig;
  assignmentMode?: boolean;
  isAssignmentMode?: boolean;
  assignmentId?: string;
  userId?: string;
  onGameComplete?: (gameProgress: any) => void;
  onProgressUpdate?: (progress: any) => void;
  assignmentTitle?: string;
}) {

  // Authentication and services
  const { user } = useAuth();
  const { supabase } = useSupabase();

  // Initialize FSRS spaced repetition system
  const [fsrsService, setFsrsService] = useState<FSRSService | null>(null);
  const [enhancedGameService, setEnhancedGameService] = useState<EnhancedGameService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  // Initialize Enhanced Game Service and FSRS Service
  useEffect(() => {
    if (supabase) {
      setEnhancedGameService(new EnhancedGameService(supabase));
      setFsrsService(new FSRSService(supabase));
    }
  }, [supabase]);

  // Typing mode state - disabled
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showTypingInput, setShowTypingInput] = useState(false);

  // Enhanced game state
  const [gameState, setGameState] = useState<GameState>({
    status: 'ready',
    score: 0,
    blocksPlaced: 0,
    blocksFallen: 0,
    currentHeight: 0,
    maxHeight: 0,
    currentLevel: 1,
    accuracy: 1,
    streak: 0,
    multiplier: 1,
    timeLeft: 120,
    wordsCompleted: 0,
    totalWords: 0 // Will be updated when vocabulary loads
  });

  const [settings, setSettings] = useState<GameSettings>({
    timeLimit: 120,
    difficulty: 'medium',
    towerFalling: true,
    soundEnabled: true,
    showHints: true,
    animationSpeed: 1
  });

  const [towerBlocks, setTowerBlocks] = useState<TowerBlock[]>([]);
  const [fallingBlocks, setFallingBlocks] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<WordOption[]>([]);
  const [currentTargetWord, setCurrentTargetWord] = useState<WordOption | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState<'correct' | 'incorrect' | null>(null);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  // Transform loaded vocabulary to game format
  const [vocabulary, setVocabulary] = useState<any[]>([]);

  // Update vocabulary when gameVocabulary changes
  useEffect(() => {
    if (gameVocabulary && gameVocabulary.length > 0) {
      const transformedVocabulary = gameVocabulary.map((word, index) => ({
        id: word.id || `word-${index}`,
        word: word.word,
        translation: word.translation,
        difficulty: 2, // Default difficulty for unified vocabulary
        correct: false
      }));
      setVocabulary(transformedVocabulary);

      // Update total words count
      setGameState(prev => ({
        ...prev,
        totalWords: transformedVocabulary.length
      }));
    }
  }, [gameVocabulary]);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [craneLifting, setCraneLifting] = useState(false);
  const [craneWord, setCraneWord] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const effectIdRef = useRef(0);

  // Constants for tower display - increased for better gameplay experience
  const VISIBLE_BLOCKS = 6; // Show last 6 blocks to fit in fixed height container

  // Sound effects hook
  const sounds = useSounds(settings.soundEnabled);

  // Enhanced particle effect system
  const addParticleEffect = useCallback((
    type: ParticleEffect['type'],
    position: { x: number; y: number },
    intensity: number = 1
  ) => {
    const newEffect: ParticleEffect = {
      id: `effect-${effectIdRef.current++}`,
      type,
      position,
      intensity,
      timestamp: Date.now()
    };

    setParticleEffects(prev => [...prev, newEffect]);

    // Auto-remove effect after animation
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(e => e.id !== newEffect.id));
    }, 2000);
  }, []);



  // Enhanced timer with pause functionality
  useEffect(() => {
    if (gameState.status === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            clearInterval(timerRef.current!);
            return { ...prev, status: 'failed', timeLeft: 0 };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status]);

  // Save game session when game ends
  const saveGameSession = useCallback(async () => {
    if (!user || !enhancedGameService || !supabase) return;

    try {
      const sessionData = {
        student_id: user.id,
        game_type: 'sentence-towers',
        session_mode: 'free_play' as const,
        started_at: new Date(Date.now() - (settings.timeLimit - gameState.timeLeft) * 1000),
        ended_at: new Date(),
        duration_seconds: settings.timeLimit - gameState.timeLeft,
        final_score: gameState.score,
        max_score_possible: gameState.totalWords * 100, // Assuming max 100 points per word
        accuracy_percentage: Math.round(gameState.accuracy * 100),
        completion_percentage: Math.round((gameState.wordsCompleted / gameState.totalWords) * 100),
        level_reached: gameState.currentLevel,
        lives_used: 0,
        power_ups_used: [],
        achievements_earned: [],
        words_attempted: gameState.blocksPlaced + gameState.blocksFallen,
        words_correct: gameState.blocksPlaced,
        unique_words_practiced: gameState.wordsCompleted,
        average_response_time_ms: 0,
        pause_count: 0,
        hint_requests: 0,
        retry_attempts: 0,
        session_data: {
          difficulty: settings.difficulty,
          tower_falling_enabled: settings.towerFalling,
          max_height: gameState.maxHeight,
          blocks_fallen: gameState.blocksFallen,
          max_streak: gameState.streak,
          multiplier_achieved: gameState.multiplier,
          time_limit: settings.timeLimit,
          typing_mode: isTypingMode,
          language: config.language,
          category: config.categoryId,
          subcategory: config.subcategoryId
        },
        device_info: {}
      };

      // Calculate XP bonuses
      const accuracyBonus = gameState.accuracy >= 0.9 ? RewardEngine.getXPValue('rare') : 0;
      const heightBonus = gameState.maxHeight >= 10 ? RewardEngine.getXPValue('epic') : 0;
      const streakBonus = gameState.streak >= 5 ? RewardEngine.getXPValue('legendary') : 0;
      const totalXP = gameState.blocksPlaced * 10; // 10 XP per block placed (gems-first)

      // End the existing session instead of creating a new one
      if (gameSessionId) {
        const sessionService = getBufferedGameSessionService();
        await sessionService.endGameSession(gameSessionId, {
          student_id: userId || user.id,
          assignment_id: isAssignmentMode ? assignmentId : undefined,
          game_type: 'sentence-towers',
          session_mode: isAssignmentMode ? 'assignment' : 'free_play',
          final_score: gameState.score,
          accuracy_percentage: Math.round(gameState.accuracy * 100),
          completion_percentage: Math.round((gameState.wordsCompleted / gameState.totalWords) * 100),
          words_attempted: gameState.blocksPlaced + gameState.blocksFallen,
          words_correct: gameState.blocksPlaced,
          unique_words_practiced: gameState.wordsCompleted,
          duration_seconds: settings.timeLimit - gameState.timeLeft,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + heightBonus + streakBonus,
          session_data: sessionData.session_data
        });
        console.log(`🔮 [${isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Sentence Towers game session ended with XP:`, totalXP);
      }
    } catch (error) {
      console.error('Error ending Sentence Towers game session:', error);
    }
  }, [gameSessionId, userId, user, isAssignmentMode, assignmentId, gameState, settings, isTypingMode, config]);

  // Watch for game end and save session
  useEffect(() => {
    if (gameState.status === 'failed' && gameState.blocksPlaced > 0) {
      saveGameSession();

      // Handle assignment completion if in assignment mode
      if (assignmentMode && onGameComplete) {
        const gameProgress = {
          wordsCompleted: gameState.wordsCompleted,
          totalWords: gameState.totalWords,
          score: gameState.score,
          accuracy: gameState.accuracy,
          timeSpent: settings.timeLimit - gameState.timeLeft,
          correctAnswers: gameState.blocksPlaced,
          sessionData: {
            finalScore: gameState.score,
            blocksPlaced: gameState.blocksPlaced,
            maxHeight: gameState.maxHeight,
            streak: gameState.streak,
            multiplier: gameState.multiplier,
            difficulty: settings.difficulty
          }
        };
        onGameComplete(gameProgress);
      }
    }
  }, [gameState.status, gameState.blocksPlaced, saveGameSession, assignmentMode, onGameComplete, gameState, settings]);

  // Improved distractor selection algorithm
  const selectBestDistractors = (targetWord: any, candidates: any[], count: number) => {
    if (candidates.length === 0) return [];

    // Score each candidate based on multiple factors
    const scoredCandidates = candidates.map(candidate => {
      let score = 0;

      // Factor 1: Similar difficulty level (prefer words with similar difficulty)
      const difficultyDiff = Math.abs(candidate.difficulty - targetWord.difficulty);
      score += (5 - difficultyDiff) * 2; // Higher score for similar difficulty

      // Factor 2: Different word length (avoid obvious length-based answers)
      const lengthDiff = Math.abs(candidate.word.length - targetWord.word.length);
      if (lengthDiff > 0) score += 3; // Bonus for different lengths

      // Factor 3: Different translation length (avoid obvious translation length patterns)
      const translationLengthDiff = Math.abs(candidate.translation.length - targetWord.translation.length);
      if (translationLengthDiff > 2) score += 2;

      // Factor 4: Avoid words that start with the same letter (too obvious)
      if (candidate.word[0].toLowerCase() !== targetWord.word[0].toLowerCase()) {
        score += 1;
      }

      // Factor 5: Avoid translations that start with the same letter
      if (candidate.translation[0].toLowerCase() !== targetWord.translation[0].toLowerCase()) {
        score += 1;
      }

      // Add some randomness to prevent predictable patterns
      score += Math.random() * 2;

      return { ...candidate, score };
    });

    // Sort by score (highest first) and take the best candidates
    const bestCandidates = scoredCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, count);

    // Shuffle the selected candidates to avoid position-based patterns
    return bestCandidates.sort(() => Math.random() - 0.5);
  };

  // Enhanced word generation with difficulty scaling
  const generateWordOptions = useCallback(() => {
    // Don't generate options if vocabulary is empty
    if (vocabulary.length === 0) {
      return;
    }

    const unusedWords = vocabulary.filter(word => !word.correct);

    // If we've used all words, mark for reset (handled by separate useEffect)
    if (unusedWords.length === 0) {
      // Signal that vocabulary needs to be reset
      setGameState(prev => ({ ...prev, needsVocabularyReset: true }));
      return;
    }

    // Use the current unused words - simple case when we have enough words
    if (unusedWords.length >= 4) {
      const shuffled = [...unusedWords].sort(() => Math.random() - 0.5);
      const targetWord = shuffled[0];

      setCurrentTargetWord({
        id: targetWord.id,
        word: targetWord.word,
        translation: targetWord.translation,
        isCorrect: true,
        difficulty: targetWord.difficulty
      });

      // Record question start time for speed bonuses
      setQuestionStartTime(Date.now());

      // Ensure we have at least 4 options
      const incorrectOptions = shuffled.slice(1, 4);
      const allOptions = [targetWord, ...incorrectOptions].sort(() => Math.random() - 0.5);

      setWordOptions(allOptions.map(word => ({
        id: word.id,
        word: word.word,
        translation: word.translation,
        isCorrect: word.id === targetWord.id,
        difficulty: word.difficulty
      })));
      return;
    }

    // Dynamic difficulty: increase based on current level and accuracy
    const baseDifficulty = Math.min(5, Math.floor(gameState.currentLevel / 2) + 1);
    const accuracyBonus = gameState.accuracy > 0.8 ? 1 : 0;
    const levelDifficulty = baseDifficulty + accuracyBonus;

    const availableWords = unusedWords.filter(word =>
      word.difficulty <= levelDifficulty + 1 && word.difficulty >= levelDifficulty - 1
    );

    // Ensure we have enough words for options
    const targetWords = availableWords.length >= 4 ? availableWords : unusedWords;
    if (targetWords.length < 4) {
      // If still not enough, use the full vocabulary
      const fullVocab = gameVocabulary.map((word, index) => ({
        id: word.id || `word-${index}`,
        word: word.word,
        translation: word.translation,
        difficulty: word.difficulty_level === 'beginner' ? 1 :
          word.difficulty_level === 'intermediate' ? 3 :
            word.difficulty_level === 'advanced' ? 5 : 2,
        correct: false
      }));
      const shuffledFullVocab = [...fullVocab].sort(() => Math.random() - 0.5);
      const targetWord = shuffledFullVocab[0];

      setCurrentTargetWord({
        id: targetWord.id,
        word: targetWord.word,
        translation: targetWord.translation,
        isCorrect: true,
        difficulty: targetWord.difficulty
      });

      // Record question start time for speed bonuses
      setQuestionStartTime(Date.now());

      // Improved distractor selection
      const incorrectOptions = selectBestDistractors(targetWord, shuffledFullVocab.slice(1), 3);
      const allOptions = [targetWord, ...incorrectOptions].sort(() => Math.random() - 0.5);

      setWordOptions(allOptions.map(word => ({
        id: word.id,
        word: word.word,
        translation: word.translation,
        isCorrect: word.id === targetWord.id,
        difficulty: word.difficulty
      })));
      return;
    }

    const shuffledTargetWords = [...targetWords].sort(() => Math.random() - 0.5);
    const targetWord = shuffledTargetWords[0];

    setCurrentTargetWord({
      id: targetWord.id,
      word: targetWord.word,
      translation: targetWord.translation,
      isCorrect: true,
      difficulty: targetWord.difficulty
    });

    // Record question start time for speed bonuses
    setQuestionStartTime(Date.now());

    // Always ensure 4 options by selecting 3 incorrect ones with improved logic
    const remainingWords = shuffledTargetWords.slice(1);
    const incorrectOptions = selectBestDistractors(targetWord, remainingWords, 3);

    // If we don't have enough incorrect options from filtered words, add from all words
    if (incorrectOptions.length < 3) {
      const fullVocab = gameVocabulary.map((word, index) => ({
        id: word.id || `word-${index}`,
        word: word.word,
        translation: word.translation,
        difficulty: word.difficulty_level === 'beginner' ? 1 :
          word.difficulty_level === 'intermediate' ? 3 :
            word.difficulty_level === 'advanced' ? 5 : 2,
        correct: false
      }));
      const additionalCandidates = fullVocab.filter(word =>
        word.id !== targetWord.id &&
        !incorrectOptions.some(opt => opt.id === word.id)
      );
      const additionalDistractors = selectBestDistractors(targetWord, additionalCandidates, 3 - incorrectOptions.length);
      incorrectOptions.push(...additionalDistractors);
    }

    const allOptions = [targetWord, ...incorrectOptions].sort(() => Math.random() - 0.5);

    setWordOptions(allOptions.map(word => ({
      id: word.id,
      word: word.word,
      translation: word.translation,
      isCorrect: word.id === targetWord.id,
      difficulty: word.difficulty
    })));
  }, [vocabulary, gameState.currentLevel, gameState.accuracy]);

  // Enhanced correct answer handling
  const handleCorrectAnswer = useCallback(async (option: WordOption, isTypingMode = false) => {
    // Play correct answer sound
    sounds.playCorrectAnswer();

    // 🚀 IMMEDIATE CRANE ANIMATION - Start crane immediately before any database calls
    const responseTime = Date.now() - questionStartTime;
    const speedBonus = responseTime < 3000 ? Math.floor((3000 - responseTime) / 100) * 5 : 0;

    // Enhanced scoring with multipliers and speed bonuses
    const basePoints = 10 + (option.difficulty * 5);
    const streakBonus = Math.floor(gameState.streak / 3) * 5;
    const levelBonus = gameState.currentLevel * 2;
    const typingBonus = isTypingMode ? basePoints : 0; // Double points for typing mode
    const totalPoints = Math.floor((basePoints + streakBonus + levelBonus + speedBonus + typingBonus) * gameState.multiplier);

    const newBlock: TowerBlock = {
      id: `block-${Date.now()}`,
      type: getBlockType(option.difficulty),
      word: option.word,
      translation: option.translation,
      points: totalPoints,
      position: towerBlocks.length,
      isShaking: false,
      createdAt: Date.now(),
      responseTime
    };

    // 🚀 START CRANE ANIMATION IMMEDIATELY
    setCraneLifting(true);
    setCraneWord(option.word);
    sounds.playCraneMovement();

    // 📦 ADD BLOCK TO TOWER IMMEDIATELY - Same time as crane starts moving
    setTowerBlocks(prev => [...prev, newBlock]);

    // Show speed bonus effect if applicable
    if (speedBonus > 0) {
      addParticleEffect('timebonus', { x: window.innerWidth / 2, y: window.innerHeight / 3 }, speedBonus);
    }

    // Show typing bonus effect if applicable
    if (isTypingMode) {
      addParticleEffect('combo', { x: window.innerWidth / 2, y: window.innerHeight / 4 }, 2);
    }

    // 📊 ALL DATABASE OPERATIONS HAPPEN IN BACKGROUND (don't block crane animation)
    // Record word practice with FSRS system
    if (option) {
      try {
        const wordData = {
          id: option.id || `${option.word}-${option.translation}`,
          word: option.word,
          translation: option.translation,
          language: config.language === 'spanish' ? 'es' : config.language === 'french' ? 'fr' : 'en'
        };

        // Calculate confidence based on typing mode and response time
        let confidence = 0.8; // Base confidence for correct answers
        if (isTypingMode) {
          confidence = 0.9; // Higher confidence for typing mode
        }

        // Adjust for response time
        if (responseTime < 3000) confidence += 0.1;
        else if (responseTime > 10000) confidence -= 0.2;

        confidence = Math.max(0.1, Math.min(0.95, confidence));

        // Record practice with FSRS
        if (fsrsService && user?.id) {
          try {
            const fsrsResult = await fsrsService.updateProgress(
              user.id,
              option.id,
              true, // Correct answer
              responseTime,
              confidence
            );

            if (fsrsResult) {
              console.log(`FSRS recorded for ${option.word} (${isTypingMode ? 'typing' : 'selection'}):`, {
                nextReview: fsrsResult.nextReviewDate,
                interval: fsrsResult.interval,
                difficulty: fsrsResult.card.difficulty,
                stability: fsrsResult.card.stability
              });
            }
          } catch (error) {
            console.error('Error recording FSRS practice:', error);
          }
        }
      } catch (error) {
        console.error('Error recording FSRS practice:', error);
      }
    }

    // Record gem in assignment mode using GameAssignmentWrapper's system
    if (typeof window !== 'undefined' && (window as any).recordVocabularyInteraction) {
      console.log('🔮 [SENTENCE TOWERS] Recording gem for assignment mode (correct answer)...');
      try {
        const responseTime = (Date.now() - questionStartTime);
        await (window as any).recordVocabularyInteraction(
          option.word, // wordText
          option.translation, // translationText
          true, // wasCorrect
          responseTime, // responseTimeMs
          false, // hintUsed
          gameState.streak + 1 // streakCount
        );
        console.log('🔮 [SENTENCE TOWERS] Gem recorded successfully for correct answer');
      } catch (error) {
        console.error('🔮 [SENTENCE TOWERS] Error recording gem:', error);
      }
    }

    // Record sentence attempt using new gems system - this will parse sentences and award gems for individual vocabulary words
    if (gameSessionId && user) {
      const responseTime = (Date.now() - questionStartTime) / 1000;
      try {
        const sessionService = getBufferedGameSessionService();
        await sessionService.recordSentenceAttempt(gameSessionId, 'sentence-towers', {
          // ✅ FIXED: Use correct ID field based on vocabulary source
          sentenceId: option.isCustomVocabulary ? undefined : (option.id || `sentence-${Date.now()}`),
          enhancedSentenceId: option.isCustomVocabulary ? option.id : undefined,
          sourceText: option.word, // The full sentence in target language
          targetText: option.translation, // The full sentence translation
          responseTimeMs: Math.round(responseTime * 1000),
          wasCorrect: true,
          hintUsed: false,
          streakCount: gameState.streak + 1,
          difficultyLevel: settings.difficulty,
          gameMode: isTypingMode ? 'typing' : 'multiple_choice',
          contextData: {
            towerHeight: gameState.currentHeight,
            blockPosition: gameState.blocksPlaced + 1,
            multiplier: gameState.multiplier,
            doublePoints: isTypingMode,
            sentenceType: 'full_sentence'
          },
          language: config.language, // 🎯 NEW: For vocabulary extraction
          assignmentId: isAssignmentMode ? assignmentId : undefined, // 🎯 NEW: For Layer 2
          studentId: isAssignmentMode ? userId : undefined // 🎯 NEW: For Layer 2
        });

        console.log(`🔮 Sentence Towers recorded sentence: "${option.word}" -> parsed for individual vocabulary gems`);
      } catch (error) {
        console.error('Error recording sentence attempt:', error);
      }
    }

    setVocabulary(prev =>
      prev.map(word =>
        word.id === option.id ? { ...word, correct: true } : word
      )
    );

    // 🎵 Play block placement sound and effects when crane would actually drop it
    setTimeout(() => {
      sounds.playBlockPlacement();
      addParticleEffect('success', { x: window.innerWidth / 2, y: window.innerHeight / 2 }, gameState.multiplier);

      // Enhanced combo celebrations
      if (gameState.streak > 0 && (gameState.streak + 1) % 5 === 0) {
        addParticleEffect('combo', { x: window.innerWidth / 2, y: window.innerHeight / 3 }, (gameState.streak + 1) / 5);
      }

      // Lightning effect for high multipliers
      if (gameState.multiplier >= 2) {
        addParticleEffect('lightning', { x: window.innerWidth / 2, y: window.innerHeight / 4 }, gameState.multiplier);
      }
    }, 900); // Sound and effects still timed with crane drop

    // Update game state
    setGameState(prev => {
      const newWordsCompleted = prev.wordsCompleted + 1;
      const newStreak = prev.streak + 1;
      const updatedState = {
        ...prev,
        score: prev.score + totalPoints,
        blocksPlaced: prev.blocksPlaced + 1,
        currentHeight: prev.currentHeight + 1,
        maxHeight: Math.max(prev.maxHeight, prev.currentHeight + 1),
        streak: newStreak,
        multiplier: Math.min(3, 1 + Math.floor(newStreak / 10) * 0.5),
        wordsCompleted: newWordsCompleted,
        currentLevel: Math.floor(prev.blocksPlaced / 5) + 1,
        accuracy: (prev.blocksPlaced + 1) > 0 ? (prev.blocksPlaced + 1 - prev.blocksFallen) / (prev.blocksPlaced + 1) : 1
      };

      // Update assignment progress if in assignment mode
      if (assignmentMode && onProgressUpdate) {
        onProgressUpdate({
          wordsCompleted: newWordsCompleted,
          totalWords: updatedState.totalWords,
          score: updatedState.score,
          accuracy: updatedState.accuracy * 100
        });
      }

      return updatedState;
    });
  }, [gameState, towerBlocks, addParticleEffect, sounds, questionStartTime]);

  // Enhanced incorrect answer handling
  const handleIncorrectAnswer = useCallback(async (incorrectOption?: WordOption) => {
    // 🚨 IMMEDIATE VISUAL/AUDIO FEEDBACK - No delay!
    sounds.playWrongAnswer();

    // 🎨 Better visual feedback instead of screen shake
    addParticleEffect('error', { x: window.innerWidth / 2, y: window.innerHeight / 2 }, 1);
    addParticleEffect('destruction', { x: window.innerWidth / 2, y: window.innerHeight / 2 + 100 }, 1);

    // 🏗️ Handle tower falling immediately if enabled
    if (settings.towerFalling && towerBlocks.length > 0) {
      const fallCount = getDifficultySettings(settings.difficulty).fallCount;
      const blocksToFall = Math.min(fallCount, towerBlocks.length);
      const fallingIds = towerBlocks.slice(-blocksToFall).map(block => block.id);

      setFallingBlocks(fallingIds);
      sounds.playBlockFalling();

      setTimeout(() => {
        setTowerBlocks(prev => prev.filter(block => !fallingIds.includes(block.id)));
        setFallingBlocks([]);

        setGameState(prev => ({
          ...prev,
          blocksFallen: prev.blocksFallen + blocksToFall,
          currentHeight: prev.currentHeight - blocksToFall,
          streak: 0,
          multiplier: 1,
          accuracy: prev.blocksPlaced > 0 ? (prev.blocksPlaced - (prev.blocksFallen + blocksToFall)) / prev.blocksPlaced : 1
        }));
      }, 1000);
    } else {
      // Reset streak/multiplier even if no blocks fall
      setGameState(prev => ({ ...prev, streak: 0, multiplier: 1 }));
    }

    // 📊 ALL DATABASE OPERATIONS HAPPEN IN BACKGROUND (don't block feedback)
    // Record word practice with FSRS system for incorrect answer
    if (currentTargetWord) {
      try {
        const wordData = {
          id: currentTargetWord.id || `${currentTargetWord.word}-${currentTargetWord.translation}`,
          word: currentTargetWord.word,
          translation: currentTargetWord.translation,
          language: config.language === 'spanish' ? 'es' : config.language === 'french' ? 'fr' : 'en'
        };

        const responseTime = (Date.now() - questionStartTime);

        // Record failed attempt with FSRS
        if (fsrsService && user?.id) {
          try {
            const fsrsResult = await fsrsService.updateProgress(
              user.id,
              currentTargetWord.id,
              false, // Incorrect answer
              responseTime,
              0.2 // Low confidence for incorrect answers
            );

            if (fsrsResult) {
              console.log(`FSRS recorded failed attempt for ${currentTargetWord.word}:`, {
                nextReview: fsrsResult.nextReviewDate,
                interval: fsrsResult.interval,
                difficulty: fsrsResult.card.difficulty,
                stability: fsrsResult.card.stability
              });
            }
          } catch (error) {
            console.error('Error recording FSRS failed practice:', error);
          }
        }
      } catch (error) {
        console.error('Error recording FSRS failed practice:', error);
      }
    }

    // Record gem in assignment mode using GameAssignmentWrapper's system
    if (typeof window !== 'undefined' && (window as any).recordVocabularyInteraction) {
      console.log('🔮 [SENTENCE TOWERS] Recording gem for assignment mode (incorrect answer)...');
      try {
        const responseTime = (Date.now() - questionStartTime);
        await (window as any).recordVocabularyInteraction(
          currentTargetWord.word, // wordText (the correct word)
          currentTargetWord.translation, // translationText (the correct translation)
          false, // wasCorrect
          responseTime, // responseTimeMs
          false, // hintUsed
          0 // streakCount (reset on incorrect)
        );
        console.log('🔮 [SENTENCE TOWERS] Gem recorded successfully for incorrect answer');
      } catch (error) {
        console.error('🔮 [SENTENCE TOWERS] Error recording gem:', error);
      }
    }

    // Record incorrect sentence attempt using new gems system
    if (gameSessionId && user && incorrectOption && currentTargetWord) {
      const responseTime = (Date.now() - questionStartTime) / 1000;
      try {
        const sessionService = getBufferedGameSessionService();
        await sessionService.recordSentenceAttempt(gameSessionId, 'sentence-towers', {
          // ✅ FIXED: Use correct ID field based on vocabulary source
          sentenceId: currentTargetWord.isCustomVocabulary ? undefined : (currentTargetWord.id || `sentence-${Date.now()}`),
          enhancedSentenceId: currentTargetWord.isCustomVocabulary ? currentTargetWord.id : undefined,
          sourceText: currentTargetWord.word, // The correct sentence
          targetText: currentTargetWord.translation, // The correct translation
          responseTimeMs: Math.round(responseTime * 1000),
          wasCorrect: false,
          hintUsed: false,
          streakCount: 0,
          difficultyLevel: settings.difficulty,
          gameMode: isTypingMode ? 'typing' : 'multiple_choice',
          contextData: {
            correctAnswer: currentTargetWord.word,
            selectedAnswer: incorrectOption.word,
            towerHeight: gameState.currentHeight,
            blockPosition: gameState.blocksPlaced + 1,
            multiplier: gameState.multiplier,
            errorType: 'incorrect_selection',
            sentenceType: 'full_sentence'
          },
          language: config.language, // 🎯 NEW: For vocabulary extraction
          assignmentId: isAssignmentMode ? assignmentId : undefined, // 🎯 NEW: For Layer 2
          studentId: isAssignmentMode ? userId : undefined // 🎯 NEW: For Layer 2
        });

        console.log(`❌ Sentence Towers recorded incorrect sentence: "${currentTargetWord.word}" (selected: "${incorrectOption.word}")`);
      } catch (error) {
        console.error('Error recording sentence attempt:', error);
      }
    }
  }, [settings, towerBlocks, addParticleEffect, sounds, gameState, currentTargetWord, questionStartTime, fsrsService, user, config, gameSessionId, isTypingMode]);

  // Enhanced option selection
  const handleSelectOption = useCallback((option: WordOption) => {
    if (gameState.status !== 'playing' || selectedOption) return;

    setSelectedOption(option.id);
    setFeedbackVisible(option.isCorrect ? 'correct' : 'incorrect');

    if (option.isCorrect) {
      handleCorrectAnswer(option);
    } else {
      handleIncorrectAnswer(option);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setFeedbackVisible(null);
      generateWordOptions();
    }, option.isCorrect ? 1500 : 1500); // Set to match total crane animation time (1400ms) plus small buffer
  }, [gameState.status, selectedOption, handleCorrectAnswer, handleIncorrectAnswer, generateWordOptions]);

  // Handle typed answer in typing mode
  const handleTypedAnswer = useCallback(() => {
    if (!currentTargetWord || !typedAnswer.trim() || selectedOption) return;

    const userAnswer = typedAnswer.trim().toLowerCase();
    const correctAnswer = currentTargetWord.translation.toLowerCase();

    // Check if the answer is correct (allow for minor variations)
    const isCorrect = userAnswer === correctAnswer ||
      correctAnswer.includes(userAnswer) ||
      userAnswer.includes(correctAnswer);

    setSelectedOption(currentTargetWord.id);
    setFeedbackVisible(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      // Double points for typing mode
      const doublePointsOption = { ...currentTargetWord, isCorrect: true };
      handleCorrectAnswer(doublePointsOption, true); // Pass true for double points
    } else {
      handleIncorrectAnswer();
    }

    // Reset typing input and generate new options
    setTimeout(() => {
      setTypedAnswer('');
      setSelectedOption(null);
      setFeedbackVisible(null);
      generateWordOptions();
    }, isCorrect ? 3000 : 1500);
  }, [currentTargetWord, typedAnswer, selectedOption, handleCorrectAnswer, handleIncorrectAnswer, generateWordOptions]);

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: UnifiedSelectionConfig, newVocabulary: any[]) => {
    console.log('🔄 Updating game configuration:', newConfig);
    // Note: This would need to be passed up to parent component to update the actual config
    // For now, just close the panel
    setShowConfigPanel(false);
  };

  // Utility functions
  const getBlockType = (difficulty: number): TowerBlock['type'] => {
    if (difficulty >= 4) return 'challenge';
    if (difficulty >= 3) return 'bonus';
    if (difficulty <= 1) return 'fragile';
    return 'standard';
  };

  const getDifficultySettings = (difficulty: GameSettings['difficulty']) => {
    const settings = {
      easy: { fallCount: 1, timeBonus: 30, optionCount: 3 },
      medium: { fallCount: 2, timeBonus: 0, optionCount: 4 },
      hard: { fallCount: 3, timeBonus: -30, optionCount: 4 },
      expert: { fallCount: 4, timeBonus: -60, optionCount: 5 }
    };
    return settings[difficulty];
  };

  const getBlockStyle = (type: TowerBlock['type'], isShaking: boolean = false) => {
    const baseStyle = isShaking ? 'animate-pulse' : '';
    const styles = {
      standard: `${baseStyle} bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-600 shadow-cyan-500/50`,
      bonus: `${baseStyle} bg-gradient-to-r from-orange-400 to-yellow-500 border-orange-600 shadow-orange-500/50`,
      challenge: `${baseStyle} bg-gradient-to-r from-red-400 to-pink-500 border-red-600 shadow-red-500/50`,
      fragile: `${baseStyle} bg-gradient-to-r from-gray-400 to-gray-600 border-gray-700 shadow-gray-500/50`
    };
    return styles[type];
  };

  const startGame = async () => {
    setGameState({
      status: 'playing',
      score: 0,
      blocksPlaced: 0,
      blocksFallen: 0,
      currentHeight: 0,
      maxHeight: 0,
      currentLevel: 1,
      accuracy: 1,
      streak: 0,
      multiplier: 1,
      timeLeft: settings.timeLimit,
      wordsCompleted: 0,
      totalWords: gameVocabulary.length
    });
    setTowerBlocks([]);
    setFallingBlocks([]);
    setParticleEffects([]);

    // Reset vocabulary to unused state
    const resetVocabulary = gameVocabulary.map((word, index) => ({
      id: word.id || `word-${index}`,
      word: word.word,
      translation: word.translation,
      difficulty: word.difficulty_level === 'beginner' ? 1 :
        word.difficulty_level === 'intermediate' ? 3 :
          word.difficulty_level === 'advanced' ? 5 : 2,
      correct: false
    }));
    setVocabulary(resetVocabulary);
    generateWordOptions();

    // Create game session using EnhancedGameSessionService
    if ((userId || user) && !gameSessionId) {
      try {
        const sessionService = getBufferedGameSessionService();
        const sessionId = await sessionService.startGameSession({
          student_id: userId || user!.id,
          assignment_id: isAssignmentMode ? assignmentId : undefined,
          game_type: 'sentence-towers',
          session_mode: isAssignmentMode ? 'assignment' : 'free_play',
          max_score_possible: gameVocabulary.length * 100,
          session_data: {
            vocabularyCount: gameVocabulary.length,
            language: config.language,
            difficulty: settings.difficulty
          }
        });
        setGameSessionId(sessionId);
        console.log(`🔮 [${isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Sentence Towers game session started:`, sessionId);
      } catch (error) {
        console.error('Failed to start game session:', error);
      }
    }

    // Start background music
    sounds.playBackgroundMusic();
  };

  const pauseGame = () => {
    const newStatus = gameState.status === 'playing' ? 'paused' : 'playing';
    setGameState(prev => ({
      ...prev,
      status: newStatus
    }));

    // Control background music based on pause state
    if (newStatus === 'paused') {
      sounds.stopBackgroundMusic();
    } else {
      sounds.playBackgroundMusic();
    }
  };

  const resetGame = () => {
    setGameState(prev => ({ ...prev, status: 'ready' }));
    setTowerBlocks([]);
    setFallingBlocks([]);
    setParticleEffects([]);

    // Stop background music
    sounds.stopBackgroundMusic();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle vocabulary reset when all words are used
  useEffect(() => {
    if (gameState.needsVocabularyReset && gameVocabulary.length > 0) {
      const resetVocabulary = gameVocabulary.map((word, index) => ({
        id: word.id || `word-${index}`,
        word: word.word,
        translation: word.translation,
        difficulty: word.difficulty_level === 'beginner' ? 1 :
          word.difficulty_level === 'intermediate' ? 3 :
            word.difficulty_level === 'advanced' ? 5 : 2,
        correct: false
      }));
      setVocabulary(resetVocabulary);

      // Clear the reset flag and regenerate options
      setGameState(prev => ({ ...prev, needsVocabularyReset: false }));
    }
  }, [gameState.needsVocabularyReset, gameVocabulary]);

  // Initialize word options
  useEffect(() => {
    if (gameState.status === 'playing' && wordOptions.length === 0 && !gameState.needsVocabularyReset) {
      generateWordOptions();
    }
  }, [gameState.status, wordOptions.length, gameState.needsVocabularyReset, generateWordOptions]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="w-full h-full">
        {/* Enhanced Background */}
        <DynamicBackground
          level={gameState.currentLevel}
          timeOfDay={gameState.currentLevel <= 5 ? 'day' : gameState.currentLevel <= 10 ? 'evening' : 'night'}
          weather={gameState.streak > 10 ? 'clear' : 'cloudy'}
        />

        {/* Particle Effects */}
        <ParticleSystem effects={particleEffects} />

        {/* Simplified Header with left-aligned title */}
        <div className="relative z-20 flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToMenu}
              className="p-2 md:p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 flex items-center space-x-2"
              title={isAssignmentMode ? "Back to Assignment" : "Back to Games"}
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
              <span className="hidden md:inline text-white font-medium">
                {isAssignmentMode ? "Back to Assignment" : "Back"}
              </span>
            </button>

            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
                Sentence Towers
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 md:p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4 md:h-5 md:w-5 text-white" />
              ) : (
                <Maximize className="h-4 w-4 md:h-5 md:w-5 text-white" />
              )}
            </button>

            <button
              onClick={() => {
                const newSoundEnabled = !settings.soundEnabled;
                setSettings(prev => ({ ...prev, soundEnabled: newSoundEnabled }));
                sounds.mute(!newSoundEnabled);
                if (!newSoundEnabled) {
                  sounds.stopBackgroundMusic();
                } else if (gameState.status === 'playing') {
                  sounds.playBackgroundMusic();
                }
              }}
              className="p-2 md:p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
            >
              {settings.soundEnabled ? (
                <Volume2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
              ) : (
                <VolumeX className="h-4 w-4 md:h-5 md:w-5 text-white" />
              )}
            </button>

            {gameState.status === 'playing' && (
              <button
                onClick={pauseGame}
                className="p-2 md:p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
              >
                <Pause className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </button>
            )}

            <button
              onClick={handleOpenConfigPanel}
              className="relative inline-flex items-center justify-center px-4 py-2 overflow-hidden font-semibold rounded-full 
            bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 
            hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-purple-700 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black/50
            border border-white/20 backdrop-blur-sm"
              title="Change Language, Level, Topic & Theme"
            >
              <Target className="h-4 w-4 md:h-5 md:w-5 text-white mr-2" />
              <span className="hidden md:inline">Game settings</span>
            </button>
          </div>
        </div>

        {/* Left Sidebar Stats - hidden on mobile, positioned to avoid tower overlap */}
        <div className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
          {/* Score */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-orange-500/30 min-w-[80px]">
            <div className="text-orange-400 text-xs font-bold mb-1">SCORE</div>
            <div className="text-lg font-bold text-white">{gameState.score.toLocaleString()}</div>
            {gameState.multiplier > 1 && (
              <div className="text-xs text-yellow-400">×{gameState.multiplier.toFixed(1)}</div>
            )}
          </div>

          {/* Streak */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-red-500/30">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-red-400" />
              <div>
                <div className="text-red-400 text-xs font-bold">STREAK</div>
                <div className="text-white font-bold text-lg">{gameState.streak}</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-purple-500/30">
            <div className="text-purple-400 text-xs font-bold mb-2">LEVEL</div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{gameState.currentLevel}</div>
              <div className="text-xs text-white/60">current level</div>
            </div>
            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${((gameState.blocksPlaced % 5) / 5) * 100}%` }}
              />
            </div>
            <div className="text-white text-xs mt-1">{gameState.blocksPlaced % 5}/5 to next</div>
          </div>
        </div>

        {/* Right Sidebar Stats + Translation Box */}
        <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
          {/* Target Word Display - moved to right sidebar */}
          {currentTargetWord && gameState.status === 'playing' && (
            <motion.div
              key={currentTargetWord.id}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl p-4 shadow-2xl border-4 border-orange-300 min-w-[200px]"
            >
              <div className="text-center">
                <div className="text-sm font-semibold text-orange-100 mb-1">
                  Translate:
                </div>
                <div className="text-2xl font-bold text-white">
                  {currentTargetWord.word}
                </div>

              </div>
            </motion.div>
          )}

          {/* Timer */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-blue-500/30">
            <div className="text-blue-400 text-xs font-bold mb-1 text-center">TIME</div>
            <div className={`text-xl font-bold text-center ${gameState.timeLeft <= 30 ? 'text-red-400' :
              gameState.timeLeft <= 60 ? 'text-orange-400' : 'text-green-400'
              }`}>
              {formatTime(gameState.timeLeft)}
            </div>
          </div>

          {/* Current Height */}
          {towerBlocks.length > 0 && (
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-green-500/30">
              <div className="text-green-400 text-xs font-bold mb-1 text-center">TOWER HEIGHT</div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{gameState.currentHeight}</div>
                <div className="text-xs text-white/60">total blocks</div>
                {towerBlocks.length > VISIBLE_BLOCKS && (
                  <div className="text-xs text-green-400 mt-1">
                    Showing top {Math.min(VISIBLE_BLOCKS, towerBlocks.length)}
                  </div>
                )}
              </div>
              {gameState.maxHeight > gameState.currentHeight && (
                <div className="text-xs text-green-400 mt-1 text-center">
                  Best: {gameState.maxHeight}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile translation box and bottom stats bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 px-4 pb-2 space-y-2">
          {/* Mobile Translation Box */}
          {currentTargetWord && gameState.status === 'playing' && (
            <motion.div
              key={currentTargetWord.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl p-4 shadow-2xl border-4 border-orange-300"
            >
              <div className="text-center">
                <div className="text-sm font-semibold text-orange-100 mb-1">
                  Translate:
                </div>
                <div className="text-xl font-bold text-white">
                  {currentTargetWord.word}
                </div>
                <div className="text-xs text-orange-200 mt-1">
                  Difficulty: {currentTargetWord.difficulty}/5
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile Stats Bar */}
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-2 border border-white/30">
            <div className="flex justify-between items-center text-xs">
              <div className="text-center">
                <div className="text-orange-400 text-[10px] font-bold">SCORE</div>
                <div className="text-white font-bold text-sm">{gameState.score.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className={`text-[10px] font-bold ${gameState.timeLeft <= 30 ? 'text-red-400' :
                  gameState.timeLeft <= 60 ? 'text-orange-400' : 'text-blue-400'
                  }`}>TIME</div>
                <div className={`font-bold text-sm ${gameState.timeLeft <= 30 ? 'text-red-400' :
                  gameState.timeLeft <= 60 ? 'text-orange-400' : 'text-green-400'
                  }`}>
                  {formatTime(gameState.timeLeft)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 text-[10px] font-bold">LEVEL</div>
                <div className="text-white font-bold text-sm">{gameState.currentLevel}</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 text-[10px] font-bold">STREAK</div>
                <div className="text-white font-bold text-sm">{gameState.streak}</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 text-[10px] font-bold">HEIGHT</div>
                <div className="text-white font-bold text-sm">{gameState.currentHeight}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="relative z-10 px-4 flex flex-col items-center pt-4">
          {/* Tower container - fixed height to prevent layout shifts */}
          <div className="flex justify-center items-end mb-4 relative" style={{ height: '500px', overflow: 'hidden' }}>
            {/* Enhanced Tower with Crane */}
            <div className="flex flex-col-reverse items-center space-y-reverse space-y-1 relative">
              {/* Height indicator when blocks are hidden */}
              {towerBlocks.length > VISIBLE_BLOCKS && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-lg px-3 py-1 text-xs text-white/80 border border-white/30">
                  Showing {VISIBLE_BLOCKS} of {towerBlocks.length} blocks
                  <div className="text-center text-yellow-400 font-bold">↓ +{towerBlocks.length - VISIBLE_BLOCKS} below</div>
                </div>
              )}
              <AnimatedCrane
                isLifting={craneLifting}
                liftedWord={craneWord}
                towerHeight={towerBlocks.length}
                onComplete={() => {
                  setCraneLifting(false);
                  setCraneWord('');
                }}
              />

              {/* Tower Blocks - Only show last VISIBLE_BLOCKS for better fullscreen experience */}
              {towerBlocks.slice(-VISIBLE_BLOCKS).map((block, index) => {
                const relativeIndex = towerBlocks.length > VISIBLE_BLOCKS ?
                  index :
                  towerBlocks.length - towerBlocks.slice(-VISIBLE_BLOCKS).length + index;

                return (
                  <motion.div
                    key={block.id}
                    initial={{ y: -200, opacity: 0, scale: 0, rotate: -10 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      rotate: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 45 : -45) : 0,
                      x: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 300 : -300) : 0
                    }}
                    exit={{
                      y: 500,
                      opacity: 0,
                      scale: 0.5,
                      rotate: Math.random() * 360,
                      transition: { duration: 1 }
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    className={`w-96 h-20 rounded-lg border-4 shadow-2xl backdrop-blur-md relative overflow-hidden ${getBlockStyle(block.type, block.isShaking)}`}
                    style={{ zIndex: VISIBLE_BLOCKS - index }}
                  >
                    {/* Block content */}
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-xl truncate">{block.word}</div>
                        <div className="text-white/80 text-base truncate">{block.translation}</div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="text-white/60 text-xs uppercase font-semibold">
                          {block.type}
                        </div>
                        <div className="text-yellow-300 font-bold">+{block.points}</div>
                      </div>
                    </div>

                    {/* Block type indicator */}
                    <div className="absolute top-1 right-1">
                      {block.type === 'bonus' && (
                        <Star className="h-4 w-4 text-yellow-300" />
                      )}
                      {block.type === 'challenge' && (
                        <Trophy className="h-4 w-4 text-red-300" />
                      )}
                      {block.type === 'fragile' && (
                        <div className="h-3 w-3 bg-gray-400 rounded-full" />
                      )}
                    </div>

                    {/* Particle trails for falling blocks */}
                    {fallingBlocks.includes(block.id) && (
                      <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                    )}
                  </motion.div>
                );
              })}

              {/* Tower base */}
              <div className="w-80 h-8 bg-gradient-to-r from-stone-600 to-stone-800 rounded-lg border-4 border-stone-700 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent rounded-md" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-stone-200 font-bold text-sm">
                  FOUNDATION
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Word Options */}
        {gameState.status === 'playing' && wordOptions.length > 0 && (
          <div className="relative z-20 px-4 mb-32 lg:mb-4">
            {!isTypingMode ? (
              // Multiple Choice Mode
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-3"
              >
                {wordOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelectOption(option)}
                    disabled={selectedOption !== null}
                    className={`
                    relative px-6 py-4 rounded-2xl border-4 backdrop-blur-md shadow-2xl transition-all duration-300 min-w-[200px] max-w-[600px] group
                    ${selectedOption === option.id
                        ? option.isCorrect
                          ? 'bg-green-500/30 border-green-400 scale-105'
                          : 'bg-red-500/30 border-red-400 scale-105'
                        : 'bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/50 hover:scale-102'
                      }
                    ${selectedOption && selectedOption !== option.id ? 'opacity-50' : ''}
                  `}
                  >
                    <div className="text-center">
                      <div className="text-white font-bold text-sm md:text-base leading-relaxed group-hover:scale-105 transition-transform break-words">
                        {option.translation}
                      </div>
                    </div>

                    {/* Selection feedback */}
                    {selectedOption === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 rounded-2xl bg-white/20 border-4 border-white/50"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              // Typing Mode
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border-4 border-white/30 p-6">
                  <div className="text-center mb-4">
                    <div className="text-yellow-400 text-sm font-bold mb-2">⚡ TYPING MODE - DOUBLE POINTS!</div>
                    <div className="text-white/80 text-sm">Type the translation for:</div>
                    <div className="text-white font-bold text-xl mt-2">{currentTargetWord?.word}</div>
                  </div>

                  <input
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && typedAnswer.trim()) {
                        handleTypedAnswer();
                      }
                    }}
                    placeholder="Type your answer..."
                    className="w-full bg-white/20 text-white placeholder-white/50 rounded-xl p-4 border-2 border-white/30 focus:border-white/50 focus:outline-none text-lg text-center"
                    disabled={selectedOption !== null}
                    autoFocus
                  />

                  <button
                    onClick={handleTypedAnswer}
                    disabled={!typedAnswer.trim() || selectedOption !== null}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Submit Answer
                  </button>
                </div>
              </motion.div>
            )}

            {/* Feedback display */}
            <AnimatePresence>
              {feedbackVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className={`
                  text-4xl md:text-6xl font-bold px-6 py-4 md:px-8 md:py-6 rounded-3xl backdrop-blur-md border-4 shadow-2xl
                  ${feedbackVisible === 'correct'
                      ? 'text-green-400 bg-green-500/20 border-green-400'
                      : 'text-red-400 bg-red-500/20 border-red-400'
                    }
                `}>
                    {feedbackVisible === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Game State Overlays */}
        <AnimatePresence>
          {/* Start Screen */}
          {gameState.status === 'ready' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-md rounded-3xl p-12 border-4 border-orange-400/50 text-center max-w-lg mx-4"
              >
                <div className="mb-8">
                  <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-4">
                    Sentence Towers
                  </h2>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Build the tallest tower possible! Answer translation questions correctly to add blocks.
                    Wrong answers make blocks fall. How high can you build before time runs out?
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Difficulty:</span>
                    <span className="capitalize font-semibold">{settings.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>Time Limit:</span>
                    <span className="font-semibold">{formatTime(settings.timeLimit)}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>Challenge:</span>
                    <span className="font-semibold">Build as high as possible!</span>
                  </div>
                </div>

                {/* Game Info */}
                <div className="mb-6">
                  <div className="w-full p-4 rounded-xl border-2 border-white/30 bg-white/10 text-white">
                    <div className="text-2xl mb-2 flex justify-center">
                      <BookOpen className="h-8 w-8 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">
                      {isAssignmentMode && assignmentTitle ?
                        assignmentTitle :
                        (config.subcategoryId ?
                          `${config.categoryId} - ${config.subcategoryId}` :
                          config.categoryId)
                      }
                    </h3>
                    <p className="text-white/70 text-sm">
                      {gameVocabulary.length} words ready • Language: {config.language.toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  disabled={gameVocabulary.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Start Building! 🏗️
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Pause Screen */}
          {gameState.status === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8 border-4 border-blue-400/50 text-center"
              >
                <Pause className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-6">Game Paused</h2>
                <div className="space-y-4">
                  <button
                    onClick={pauseGame}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Resume Game
                  </button>
                  <button
                    onClick={resetGame}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Restart Game
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Failure Screen */}
          {gameState.status === 'failed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-12 border-4 border-red-400/50 text-center max-w-lg mx-4"
              >
                <Clock className="h-20 w-20 text-red-400 mx-auto mb-6" />
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">
                  Tower Complete!
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Amazing! Your tower reached {gameState.currentHeight} blocks high!
                  {gameState.currentHeight >= 10 ? " That's incredible!" :
                    gameState.currentHeight >= 5 ? " Great building!" : " Keep practicing!"}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-yellow-400 text-sm font-bold">FINAL SCORE</div>
                    <div className="text-2xl font-bold text-white">{gameState.score.toLocaleString()}</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-green-400 text-sm font-bold">WORDS LEARNED</div>
                    <div className="text-2xl font-bold text-white">{gameState.wordsCompleted}</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-blue-400 text-sm font-bold">ACCURACY</div>
                    <div className="text-2xl font-bold text-white">{Math.round(gameState.accuracy * 100)}%</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-purple-400 text-sm font-bold">BEST STREAK</div>
                    <div className="text-2xl font-bold text-white">{gameState.streak}</div>
                  </div>
                </div>

                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Try Again! 🔄
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* In-game configuration panel */}
        {config && (
          <InGameConfigPanel
            currentConfig={config}
            onConfigChange={handleConfigChange}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={false}
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
          />
        )}
      </div>
    </div>
  );
}