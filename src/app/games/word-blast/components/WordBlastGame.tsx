'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  RefreshCw,
  Star,
  Zap,
  Shield,
  Home,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../../components/games/UnifiedSentenceCategorySelector';
import WordBlastEngine from './WordBlastEngine';
import InGameConfigPanel from '../../../../components/games/InGameConfigPanel';
import { useAudio, AudioFiles } from '../hooks/useAudio';
import {
  SentenceChallenge,
  ThemeConfig,
  GameState,
  GameStats
} from '../types';

// Available themes for Word Blast
const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'temple',
    name: 'temple',
    displayName: 'Lava Temple',
    description: 'Ancient stone tablets in a fiery temple',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD700',
      background: '#8B4513'
    },
    effects: {
      particles: true,
      animations: true,
      sounds: true
    }
  },
  {
    id: 'tokyo',
    name: 'tokyo',
    displayName: 'Tokyo Nights',
    description: 'Cyberpunk data packets in neon city',
    colors: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      background: '#1A0A2A'
    },
    effects: {
      particles: true,
      animations: true,
      sounds: true
    }
  },
  {
    id: 'pirate',
    name: 'pirate',
    displayName: 'Pirate Adventure',
    description: 'Cannon battles on the high seas',
    colors: {
      primary: '#D97706',
      secondary: '#92400E',
      accent: '#FCD34D',
      background: '#1E40AF'
    },
    effects: {
      particles: true,
      animations: true,
      sounds: true
    }
  },
  {
    id: 'space',
    name: 'space',
    displayName: 'Space Explorer',
    description: 'Laser battles with cosmic comets',
    colors: {
      primary: '#06B6D4',
      secondary: '#3B82F6',
      accent: '#10B981',
      background: '#000011'
    },
    effects: {
      particles: true,
      animations: true,
      sounds: true
    }
  },
  {
    id: 'classic',
    name: 'classic',
    displayName: 'Classic',
    description: 'Traditional falling gems',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#06B6D4',
      background: '#1E293B'
    },
    effects: {
      particles: true,
      animations: true,
      sounds: true
    }
  }
];

// Sound effects mapping for different themes
const THEME_SOUND_MAPPING = {
  'temple': { correct: 'gem', incorrect: 'wrong-answer' },
  'tokyo': { correct: 'gem', incorrect: 'wrong-answer' },
  'pirate': { correct: 'gem', incorrect: 'wrong-answer' },
  'space': { correct: 'gem', incorrect: 'wrong-answer' },
  'classic': { correct: 'gem', incorrect: 'wrong-answer' }
};

// Initial game stats
const initialStats: GameStats = {
  score: 0,
  combo: 0,
  maxCombo: 0,
  gemsCollected: 0,
  gemsMissed: 0,
  wordsCollected: 0,
  accuracy: 0,
  fastestResponse: 0,
  totalPlayTime: 0,
  timeRemaining: 0,
  gemsByType: {
    ruby: 0,
    sapphire: 0,
    emerald: 0,
    diamond: 0,
    amethyst: 0,
    topaz: 0
  }
};

interface WordBlastGameProps {
  onBackToMenu?: () => void;
  onGameComplete?: (results: any) => void;
  assignmentMode?: boolean;
  assignmentConfig?: any;
  userId?: string;
  gameSessionId?: string | null;
  gameService?: EnhancedGameService | null;
  onWordMatch?: (
    word: string,
    translation: string,
    answer: string,
    isCorrect: boolean,
    responseTime: number,
    comboLevel: number,
    chainPosition?: number
  ) => void;
  onChainReaction?: (chainLength: number, wordsInChain: string[], totalScore: number) => void;
  onBlastCombo?: (comboLevel: number, comboScore: number, comboBroken: boolean) => void;
}

export default function WordBlastGame({
  onBackToMenu,
  onGameComplete,
  assignmentMode = false,
  assignmentConfig,
  userId,
  gameSessionId,
  gameService,
  onWordMatch,
  onChainReaction,
  onBlastCombo
}: WordBlastGameProps) {
  // Initialize FSRS spaced repetition system

  // Game flow state
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SentenceSelectionConfig | null>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>('ready');
  const [selectedTheme, setSelectedTheme] = useState<string>('temple');
  const [gameStats, setGameStats] = useState<GameStats>(initialStats);

  // Game data
  const [challenges, setChallenges] = useState<SentenceChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { playSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(audioEnabled);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Performance tracking
  const [wordStartTime, setWordStartTime] = useState<number>(0);
  const [currentChainLength, setCurrentChainLength] = useState(0);
  const [wordsInCurrentChain, setWordsInCurrentChain] = useState<string[]>([]);

  // Auto-start game when challenges are loaded
  useEffect(() => {
    if (challenges.length > 0 && gameState === 'ready') {
      console.log('[WordBlast] Auto-starting game with', challenges.length, 'challenges');
      setGameState('playing');
    }
  }, [challenges, gameState]);

  // Start background music when game starts
  useEffect(() => {
    if (gameState === 'playing' && selectedTheme) {
      startBackgroundMusic(selectedTheme as keyof typeof THEME_SOUND_MAPPING);
    } else {
      stopBackgroundMusic();
    }
  }, [gameState, selectedTheme, startBackgroundMusic, stopBackgroundMusic]);

  // Set word start time when new challenge appears
  useEffect(() => {
    if (challenges[currentChallengeIndex] && gameState === 'playing') {
      setWordStartTime(Date.now());
    }
  }, [currentChallengeIndex, challenges, gameState]);

  // Fetch challenges from API
  const fetchChallenges = async () => {
    if (!selectedConfig) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        language: selectedConfig.language,
        category: selectedConfig.categoryId,
        difficulty: 'beginner',
        curriculumLevel: selectedConfig.curriculumLevel,
        count: '10'
      });

      if (selectedConfig.subcategoryId) {
        params.append('subcategory', selectedConfig.subcategoryId);
      }
      
      if (assignmentConfig?.assignmentId) {
        params.append('assignmentId', assignmentConfig.assignmentId);
      }
      
      const response = await fetch(`/api/games/word-blast/sentences?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }
      
      const data = await response.json();
      setChallenges(data.challenges || []);
      setCurrentChallengeIndex(0);
      
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Failed to load challenges. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection from UnifiedSentenceCategorySelector
  const handleSelectionComplete = (config: SentenceSelectionConfig) => {
    setSelectedConfig(config);
    setGameStarted(true);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    if (onBackToMenu) {
      onBackToMenu();
    } else {
      setGameStarted(false);
      setSelectedConfig(null);
      setGameState('ready');
      setChallenges([]);
      setCurrentChallengeIndex(0);
      setLives(3);
      setGameStats(initialStats);
    }
  };

  // Start game
  const startGame = async () => {
    console.log('[WordBlast] Starting game with config:', selectedConfig);
    await fetchChallenges();
    setGameState('playing');
    setGameStats(initialStats);
    setCurrentChallengeIndex(0);
    setLives(3);
  };

  // Enhanced correct answer handler with analytics
  const handleCorrectAnswer = async (points: number) => {
    const responseTime = wordStartTime > 0 ? Date.now() - wordStartTime : 0;
    const currentChallenge = challenges[currentChallengeIndex];
    
    // Update game stats first
    let newCombo = 0;
    setGameStats(prev => {
      newCombo = prev.combo + 1;
      const newStats = {
        ...prev,
        score: prev.score + points,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        wordsCollected: prev.wordsCollected + 1
      };
      return newStats;
    });

    // Record vocabulary interaction using gems-first system (moved outside state setter)
    if (gameSessionId && currentChallenge) {
      try {
        // 🔍 INSTRUMENTATION: Log vocabulary tracking details
        console.log('🔍 [VOCAB TRACKING] Starting vocabulary tracking for challenge:', {
          challengeId: currentChallenge.id,
          challengeIdType: typeof currentChallenge.id,
          spanish: currentChallenge.spanish,
          english: currentChallenge.english,
          isCorrect: true,
          gameSessionId,
          responseTimeMs: responseTime
        });

        const sessionService = new EnhancedGameSessionService();
        const gemEvent = await sessionService.recordSentenceAttempt(gameSessionId, 'word-blast', {
          sentenceId: currentChallenge.id, // ✅ FIXED: Use challenge ID for sentence-based tracking
          sourceText: currentChallenge.spanish,
          targetText: currentChallenge.english,
          responseTimeMs: responseTime,
          wasCorrect: true,
          hintUsed: false, // No hints in word-blast
          streakCount: newCombo,
          masteryLevel: 1, // Default mastery for action games
          maxGemRarity: 'rare', // Cap at rare for fast-paced games
          gameMode: 'word_matching',
          difficultyLevel: selectedConfig?.difficulty || 'medium',
          skipSpacedRepetition: true // Skip SRS - FSRS is handling spaced repetition
        });

        // Show gem feedback if gem was awarded
        if (gemEvent) {
          console.log(`🔮 Word Blast earned ${gemEvent.rarity} gem (${gemEvent.xpValue} XP) for "${currentChallenge.spanish}"`);
        }
      } catch (error) {
        console.error('Failed to record vocabulary interaction:', error);
      }
    }

    // Record word practice with FSRS system (works in both assignment and free play modes)
    if (currentChallenge) {
      try {
        const wordData = {
          id: `word-blast-${currentChallenge.english}`,
          word: currentChallenge.spanish,
          translation: currentChallenge.english,
          language: selectedConfig?.language === 'spanish' ? 'es' : selectedConfig?.language === 'french' ? 'fr' : 'en'
        };

        // Calculate confidence based on combo level and response time
        const baseConfidence = 0.7; // Good confidence for word matching
        const comboBonus = Math.min(newCombo * 0.05, 0.2); // Up to 20% bonus for combos
        const speedBonus = responseTime < 2000 ? 0.1 : responseTime < 4000 ? 0.05 : 0;
        const confidence = Math.min(0.95, baseConfidence + comboBonus + speedBonus);

        // Record practice with FSRS
      } catch (error) {
        console.error('Error setting up FSRS recording for word-blast:', error);
      }
    }

    // Log word match performance
    if (onWordMatch && currentChallenge) {
      onWordMatch(
        currentChallenge.english,
        currentChallenge.spanish,
        currentChallenge.spanish, // Assuming correct answer
        true,
        responseTime,
        newCombo
      );
    }

    // Check for chain reaction
    if (newCombo > 1) {
      setCurrentChainLength(prev => prev + 1);
      setWordsInCurrentChain(prev => [...prev, currentChallenge?.english || '']);
      
      if (newCombo >= 3 && onChainReaction) {
        onChainReaction(newCombo, wordsInCurrentChain, points * newCombo);
      }
    } else {
      setCurrentChainLength(1);
      setWordsInCurrentChain([currentChallenge?.english || '']);
    }

    // Log blast combo
    if (onBlastCombo) {
      onBlastCombo(newCombo, points * newCombo, false);
    }

    const soundMapping = THEME_SOUND_MAPPING[selectedTheme as keyof typeof THEME_SOUND_MAPPING];
    playSFX(soundMapping.correct as 'gem' | 'wrong-answer' | 'defeat');
  };

  // Enhanced incorrect answer handler with analytics
  const handleIncorrectAnswer = async () => {
    const responseTime = wordStartTime > 0 ? Date.now() - wordStartTime : 0;
    const currentChallenge = challenges[currentChallengeIndex];
    
    setLives(prev => Math.max(0, prev - 1));
    
    // Record incorrect vocabulary interaction using gems-first system
    if (gameSessionId && currentChallenge) {
      try {
        // 🔍 INSTRUMENTATION: Log vocabulary tracking details for incorrect answer
        console.log('🔍 [VOCAB TRACKING] Starting vocabulary tracking for incorrect challenge:', {
          challengeId: currentChallenge.id,
          challengeIdType: typeof currentChallenge.id,
          spanish: currentChallenge.spanish,
          english: currentChallenge.english,
          isCorrect: false,
          gameSessionId,
          responseTimeMs: responseTime
        });

        const sessionService = new EnhancedGameSessionService();
        const gemEvent = await sessionService.recordSentenceAttempt(gameSessionId, 'word-blast', {
          sentenceId: currentChallenge.id, // ✅ FIXED: Use challenge ID for sentence-based tracking
          sourceText: currentChallenge.spanish,
          targetText: currentChallenge.english,
          responseTimeMs: responseTime,
          wasCorrect: false,
          hintUsed: false, // No hints in word-blast
          streakCount: 0, // Reset streak on incorrect
          masteryLevel: 0, // Low mastery for incorrect answers
          maxGemRarity: 'common', // Cap at common for incorrect answers
          gameMode: 'word_matching',
          difficultyLevel: selectedConfig?.difficulty || 'medium',
          skipSpacedRepetition: true // Skip SRS - FSRS is handling spaced repetition
        });

        // 🔍 INSTRUMENTATION: Log gem event result for incorrect answer
        console.log('🔍 [VOCAB TRACKING] Gem event result (incorrect):', {
          gemEventExists: !!gemEvent,
          gemEvent: gemEvent ? {
            rarity: gemEvent.rarity,
            xpValue: gemEvent.xpValue,
            vocabularyId: gemEvent.vocabularyId,
            wordText: gemEvent.wordText
          } : null,
          wasCorrect: false
        });
      } catch (error) {
        console.error('Failed to record vocabulary interaction:', error);
      }
    } else {
      console.log('🔍 [SRS UPDATE] Skipping SRS update for incorrect answer:', {
        hasCurrentChallenge: !!currentChallenge,
        hasGameSessionId: !!gameSessionId,
        gameSessionId
      });
    }

    // Record word practice with FSRS system for incorrect answer (works in both assignment and free play modes)
    if (currentChallenge) {
      try {
        const wordData = {
          id: `word-blast-${currentChallenge.english}`,
          word: currentChallenge.spanish,
          translation: currentChallenge.english,
          language: selectedConfig?.language === 'spanish' ? 'es' : selectedConfig?.language === 'french' ? 'fr' : 'en'
        };

        // Record failed attempt with FSRS
      } catch (error) {
        console.error('Error setting up FSRS recording for failed word-blast:', error);
      }
    }

    setGameStats(prev => {
      // Log word match performance
      if (onWordMatch && currentChallenge) {
        onWordMatch(
          currentChallenge.english,
          currentChallenge.spanish,
          'incorrect', // User's incorrect answer
          false,
          responseTime,
          prev.combo
        );
      }

      // Log combo break
      if (onBlastCombo && prev.combo > 0) {
        onBlastCombo(prev.combo, 0, true);
      }

      // Reset chain tracking
      setCurrentChainLength(0);
      setWordsInCurrentChain([]);

      return {
        ...prev,
        combo: 0
      };
    });

    const soundMapping = THEME_SOUND_MAPPING[selectedTheme as keyof typeof THEME_SOUND_MAPPING];
    playSFX(soundMapping.incorrect as 'gem' | 'wrong-answer' | 'defeat');

    // Check game over
    if (lives <= 1) {
      setGameState('completed');
      playSFX('defeat');
      stopBackgroundMusic();
      
      // Call game completion handler
      if (onGameComplete) {
        onGameComplete({
          outcome: 'loss',
          score: gameStats.score,
          maxCombo: gameStats.maxCombo,
          wordsCollected: gameStats.wordsCollected,
          totalAttempts: gameStats.wordsCollected + gameStats.gemsMissed,
          correctAnswers: gameStats.wordsCollected,
          incorrectAnswers: gameStats.gemsMissed,
          accuracy: gameStats.accuracy,
          timeSpent: Math.floor((Date.now() - (wordStartTime || Date.now())) / 1000)
        });
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Handle challenge complete
  const handleChallengeComplete = () => {
    const nextIndex = currentChallengeIndex + 1;

    if (nextIndex >= challenges.length) {
      // All challenges completed
      setGameState('completed');
      stopBackgroundMusic();
      
      // Call game completion handler
      if (onGameComplete) {
        onGameComplete({
          outcome: 'win',
          score: gameStats.score,
          maxCombo: gameStats.maxCombo,
          wordsCollected: gameStats.wordsCollected,
          totalAttempts: gameStats.wordsCollected + gameStats.gemsMissed,
          correctAnswers: gameStats.wordsCollected,
          incorrectAnswers: gameStats.gemsMissed,
          accuracy: gameStats.accuracy,
          timeSpent: Math.floor((Date.now() - (wordStartTime || Date.now())) / 1000)
        });
      }
      
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    } else {
      // Move to next challenge
      setCurrentChallengeIndex(nextIndex);
    }
  };

  // Show sentence category selector if game not started
  if (!gameStarted) {
    return (
      <UnifiedSentenceCategorySelector
        gameName="Word Blast"
        title="Word Blast - Select Content"
        supportedLanguages={['spanish', 'french', 'german']}
        showCustomMode={false}
        onSelectionComplete={handleSelectionComplete}
        onBack={handleBackToMenu}
      />
    );
  }

  // Show theme selection and game setup if started but not playing
  if (gameStarted && selectedConfig && gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Header */}
        <div className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Home size={20} />
                  <span>Back</span>
                </button>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Word Blast
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Audio Toggle */}
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    audioEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selection and Start */}
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            {/* Theme Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Choose Your Theme</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {AVAILABLE_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTheme === theme.name
                        ? 'border-blue-400 bg-blue-400/20'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-lg font-bold mb-2">{theme.displayName}</div>
                    <div className="text-sm text-gray-300">{theme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startGame}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                <Play size={24} />
                {isLoading ? 'Loading...' : 'Start Game'}
              </button>

              {error && (
                <div className="mt-4 text-red-400 text-center">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentChallenge = challenges[currentChallengeIndex];

  // Show game if playing
  if (gameState === 'playing' && currentChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Header */}
        <div className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Home size={20} />
                  <span>Back</span>
                </button>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Word Blast
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Audio Toggle */}
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    audioEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>

                {/* Game Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} />
                    <span>{gameStats.score}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="text-orange-400" size={16} />
                    <span>{gameStats.combo}x</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="text-red-400" size={16} />
                    <span>{lives}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Engine */}
        <WordBlastEngine
          theme={selectedTheme}
          currentChallenge={currentChallenge}
          challenges={challenges}
          onCorrectAnswer={handleCorrectAnswer}
          onIncorrectAnswer={handleIncorrectAnswer}
          onChallengeComplete={handleChallengeComplete}
          isPaused={false}
          gameActive={true}
          difficulty="beginner"
          lives={lives}
          score={gameStats.score}
          combo={gameStats.combo}
          playSFX={(sound: string) => playSFX(sound as 'gem' | 'wrong-answer' | 'defeat')}
        />
      </div>
    );
  }

  // Show completion screen
  if (gameState === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Final Score:</span>
              <span className="font-bold">{score}</span>
            </div>
            <div className="flex justify-between">
              <span>Max Combo:</span>
              <span className="font-bold">{gameStats.maxCombo}x</span>
            </div>
            <div className="flex justify-between">
              <span>Words Collected:</span>
              <span className="font-bold">{gameStats.wordsCollected}</span>
            </div>
          </div>
          <button
            onClick={handleBackToMenu}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
