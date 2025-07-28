'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useDemoAuth } from '../../../components/auth/DemoAuthProvider';
import WordBlastAssignmentWrapper from './components/WordBlastAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import { 
  WordItem, 
  GameState, 
  GameSettings, 
  GameStats, 
  FallingGem, 
  GemType 
} from './types';

// Import the existing game components
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Star, 
  CheckCircle2, 
  Zap, 
  Shield,
  Award,
  Settings,
  Home,
  Gem,
  BookOpen
} from 'lucide-react';

/**
 * Unified Word Blast Game Page
 * 
 * This demonstrates how to integrate the new unified category selector
 * with an existing game while maintaining all existing functionality.
 */
export default function UnifiedWordBlastGame() {
  const { user, isLoading } = useAuth();
  const { isDemo } = useDemoAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If in assignment mode, use the assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <WordBlastAssignmentWrapper
        assignmentId={assignmentId}
      />
    );
  }

  // Game state management
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 60,
    survivalMode: false,
    powerUpsEnabled: true,
    vocabularyId: null,
    difficulty: 'medium',
    gemSpeed: 100,
    maxGems: 8,
    comboMultiplier: 1.5
  });
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    wordsCollected: 0,
    accuracy: 100,
    combo: 0,
    timeRemaining: 60
  });

  // Vocabulary and configuration from unified selector
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [gameVocabulary, setGameVocabulary] = useState<WordItem[]>([]);

  // Conditional logic for authentication
  if (!isLoading && !user && !isDemo) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Word Blast...</p>
        </div>
      </div>
    );
  }

  // Transform unified vocabulary to game format
  const transformVocabularyForGame = (vocabulary: UnifiedVocabularyItem[]): WordItem[] => {
    return vocabulary.map((item, index) => ({
      id: item.id,
      word: item.translation, // Spanish word
      translation: item.word, // English translation
      correct: false,
      points: 10 + (index % 3) * 5, // Vary points: 10, 15, 20
      category: item.part_of_speech || 'noun'
    }));
  };

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setSelectedConfig(config);
    const transformedVocabulary = transformVocabularyForGame(vocabulary);
    setGameVocabulary(transformedVocabulary);
    setGameState('playing');
    
    console.log('Word Blast started with:', {
      config,
      vocabularyCount: vocabulary.length,
      transformedCount: transformedVocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameState('ready');
    setSelectedConfig(null);
    setGameVocabulary([]);
    setGameStats({
      score: 0,
      wordsCollected: 0,
      accuracy: 100,
      combo: 0,
      timeRemaining: gameSettings.timeLimit
    });
  };

  // Game state: Show unified launcher
  if (gameState === 'ready') {
    return (
      <UnifiedGameLauncher
        gameName="Word Blast"
        gameDescription="Collect falling gems by typing the correct Spanish words"
        supportedLanguages={['es']} // Word Blast is Spanish-focused
        showCustomMode={true}
        minVocabularyRequired={5}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        requiresAudio={false}
      >
        {/* Custom game-specific settings can go here */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3">Game Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Time Limit</span>
              <select
                value={gameSettings.timeLimit}
                onChange={(e) => setGameSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                className="bg-white/20 text-white text-sm rounded px-2 py-1 border border-white/30"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Difficulty</span>
              <select
                value={gameSettings.difficulty}
                onChange={(e) => setGameSettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="bg-white/20 text-white text-sm rounded px-2 py-1 border border-white/30"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Power-ups</span>
              <button
                onClick={() => setGameSettings(prev => ({ ...prev, powerUpsEnabled: !prev.powerUpsEnabled }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  gameSettings.powerUpsEnabled ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  gameSettings.powerUpsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Game state: Playing (render the actual game)
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-700">
        {/* Game Header */}
        <div className="flex items-center justify-between p-4 bg-black/20">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToMenu}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Home className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-white font-bold text-xl">Word Blast</h1>
              <p className="text-white/80 text-sm">
                {selectedConfig?.language?.toUpperCase()} • {selectedConfig?.categoryId}
              </p>
            </div>
          </div>
          
          {/* Game Stats */}
          <div className="flex items-center space-x-6 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{gameStats.score}</div>
              <div className="text-xs opacity-80">SCORE</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{gameStats.combo}x</div>
              <div className="text-xs opacity-80">COMBO</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{gameStats.timeRemaining}</div>
              <div className="text-xs opacity-80">TIME</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="text-6xl mb-6">🎮</div>
            <h2 className="text-3xl font-bold mb-4">Game Starting Soon!</h2>
            <p className="text-xl mb-6">
              Ready to blast {gameVocabulary.length} Spanish words?
            </p>
            
            {/* Vocabulary Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Your Vocabulary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gameVocabulary.slice(0, 6).map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-2 text-sm">
                    <div className="font-medium">{item.word}</div>
                    <div className="text-white/70">{item.translation}</div>
                  </div>
                ))}
              </div>
              {gameVocabulary.length > 6 && (
                <p className="text-white/60 text-sm mt-3">
                  ...and {gameVocabulary.length - 6} more words
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  // Here you would initialize the actual game engine
                  console.log('Starting Word Blast game with vocabulary:', gameVocabulary);
                  // For now, just show a message
                  alert(`Game would start with ${gameVocabulary.length} vocabulary items!`);
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Play className="inline-block w-6 h-6 mr-2" />
                Start Blasting!
              </button>
              
              <div>
                <button
                  onClick={handleBackToMenu}
                  className="text-white/80 hover:text-white transition-colors text-sm underline"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
