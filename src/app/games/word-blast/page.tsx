'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import WordBlastEngine from './components/WordBlastEngine';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { useAudio } from './hooks/useAudio';
import {
  SentenceChallenge,
  ThemeConfig,
  GameState,
  GameStats
} from './types';

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

export default function WordBlastPage() {
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

  // URL parameters
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment') || searchParams?.get('assignmentId') || null;
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    // Import the assignment wrapper dynamically
    const WordBlastAssignmentWrapper = React.lazy(() => import('./components/WordBlastAssignmentWrapper'));

    return (
      <React.Suspense fallback={<div>Loading assignment...</div>}>
        <WordBlastAssignmentWrapper assignmentId={assignmentId} />
      </React.Suspense>
    );
  }

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

  // Fetch challenges from API
  const fetchChallenges = async () => {
    if (!selectedConfig) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        language: selectedConfig.language,
        category: selectedConfig.categoryId,
        difficulty: 'beginner', // Default difficulty
        curriculumLevel: selectedConfig.curriculumLevel,
        count: '10'
      });

      if (selectedConfig.subcategoryId) {
        params.append('subcategory', selectedConfig.subcategoryId);
      }
      
      if (assignmentId) {
        params.append('assignmentId', assignmentId);
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
    setGameStarted(false);
    setSelectedConfig(null);
    setGameState('ready');
    setChallenges([]);
    setCurrentChallengeIndex(0);
    setLives(3);
    setGameStats(initialStats);
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: SentenceSelectionConfig) => {
    console.log('🔄 Updating game configuration:', newConfig);
    setSelectedConfig(newConfig);
    // Reload challenges with new configuration
    if (gameStarted) {
      fetchChallenges();
    }
  };

  // Start game
  const startGame = async () => {
    console.log('[WordBlast] Starting game with config:', selectedConfig);

    // Always fetch fresh challenges when starting
    await fetchChallenges();

    console.log('[WordBlast] Challenges loaded:', challenges.length);

    // Set game state to playing
    setGameState('playing');
    setGameStats(initialStats);
    setCurrentChallengeIndex(0);
    setLives(3);

    console.log('[WordBlast] Game state set to playing');
  };

  // Handle correct answer
  const handleCorrectAnswer = (points: number) => {
    setGameStats(prev => ({
      ...prev,
      score: prev.score + points,
      combo: prev.combo + 1,
      maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
      wordsCollected: prev.wordsCollected + 1
    }));

    const soundMapping = THEME_SOUND_MAPPING[selectedTheme as keyof typeof THEME_SOUND_MAPPING];
    playSFX(soundMapping.correct);
  };

  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    setLives(prev => Math.max(0, prev - 1));
    setGameStats(prev => ({
      ...prev,
      combo: 0
    }));

    const soundMapping = THEME_SOUND_MAPPING[selectedTheme as keyof typeof THEME_SOUND_MAPPING];
    playSFX(soundMapping.incorrect);

    // Check game over
    if (lives <= 1) {
      setGameState('completed');
      playSFX('defeat');
      stopBackgroundMusic();
      // Show final score with confetti
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

  // Reset game
  const resetGame = () => {
    setGameState('ready');
    setGameStats(initialStats);
    setCurrentChallengeIndex(0);
    setLives(3);
    setChallenges([]);
    stopBackgroundMusic();
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
        onBack={() => window.history.back()}
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

            {/* Selected Configuration Display */}
            <div className="mb-8 p-4 bg-black/30 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Selected Configuration:</h3>
              <div className="text-sm text-gray-300">
                <div>Language: {selectedConfig.language}</div>
                <div>Level: {selectedConfig.curriculumLevel}</div>
                <div>Category: {selectedConfig.categoryId}</div>
                {selectedConfig.subcategoryId && <div>Subcategory: {selectedConfig.subcategoryId}</div>}
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
          playSFX={playSFX}
          onOpenSettings={handleOpenConfigPanel}
        />

        {/* In-game configuration panel */}
        {selectedConfig && (
          <InGameConfigPanel
            currentConfig={selectedConfig as any}
            onConfigChange={handleConfigChange as any}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={true}
            currentTheme={selectedTheme}
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
          />
        )}
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
              <span className="font-bold">{gameStats.score}</span>
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
