'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useGameVocabulary, transformVocabularyForGame } from '../../../hooks/useGameVocabulary';
import { VOCABULARY_CATEGORIES } from '../../../components/games/ModernCategorySelector';
import WordScrambleGameEnhanced from './components/WordScrambleGameEnhanced';
import GameSettingsEnhanced from './components/GameSettingsEnhanced';

// Game configuration types
type GameMode = 'classic' | 'blitz' | 'marathon' | 'timed_attack' | 'word_storm' | 'zen';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface GameSettings {
  difficulty: Difficulty;
  category: string;
  subcategory: string | null;
  language: string;
  gameMode: GameMode;
}

interface GameStats {
  score: number;
  streak: number;
  multiplier: number;
  wordsCompleted: number;
  perfectWords: number;
  powerUps: any[];
  achievements: any[];
  timeBonus: number;
  consecutiveCorrect: number;
  letterAccuracy: number;
  avgSolveTime: number;
}

interface GameResult {
  won: boolean;
  score: number;
  stats: GameStats;
}

const GAME_MODES = [
  { 
    id: 'classic' as GameMode, 
    name: 'Classic', 
    description: 'Standard word scramble with time limit',
    icon: '📝',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'blitz' as GameMode, 
    name: 'Speed Blitz', 
    description: 'Fast-paced rapid-fire word solving',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'marathon' as GameMode, 
    name: 'Marathon', 
    description: 'Long endurance challenge',
    icon: '🏃',
    color: 'from-green-500 to-green-600'
  },
  { 
    id: 'timed_attack' as GameMode, 
    name: 'Timed Attack', 
    description: 'Quick burst challenges',
    icon: '💥',
    color: 'from-red-500 to-red-600'
  },
  { 
    id: 'word_storm' as GameMode, 
    name: 'Word Storm', 
    description: 'Rapid changing word challenges',
    icon: '🌪️',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    id: 'zen' as GameMode, 
    name: 'Zen Mode', 
    description: 'Relaxed, no time pressure',
    icon: '🧘',
    color: 'from-teal-500 to-cyan-500'
  }
];

export default function WordScramblePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const language = searchParams?.get('language') || 'spanish';
  const difficulty = searchParams?.get('difficulty') || 'medium';
  const category = searchParams?.get('category') || 'basics_core_language';

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Word Scramble...</p>
        </div>
      </div>
    );
  }

  const [gameState, setGameState] = useState<'menu' | 'settings' | 'playing' | 'results'>(assignmentId ? 'playing' : 'menu');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    difficulty: assignmentId ? (difficulty as Difficulty) : 'medium',
    category: assignmentId ? category : 'basics_core_language',
    subcategory: null,
    language: assignmentId ? language : 'spanish',
    gameMode: 'classic'
  });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isGameStarting, setIsGameStarting] = useState(false);
  
  // Category selection state
  const [selectedCategory, setSelectedCategory] = useState<string>('basics_core_language');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  
  // Map language for vocabulary loading
  const mapLanguageForVocab = (lang: string) => {
    const mapping: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };
    return mapping[lang] || 'es';
  };

  // Use category-based vocabulary when categories are selected
  const {
    vocabulary: categoryVocabulary,
    loading: categoryLoading,
    error: categoryError
  } = useGameVocabulary({
    language: mapLanguageForVocab(gameSettings.language),
    categoryId: selectedCategory || undefined,
    subcategoryId: selectedSubcategory || undefined,
    limit: 100,
    randomize: true
  });

  const handleGameStart = (settings: GameSettings) => {
    setGameSettings(settings);
    setIsGameStarting(true);
    setTimeout(() => {
      setGameState('playing');
      setIsGameStarting(false);
    }, 1500);
  };

  const handleGameEnd = (result: GameResult) => {
    setGameResult(result);
    setGameState('results');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setGameResult(null);
  };

  if (isGameStarting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-8xl mb-4"
          >
            {GAME_MODES.find(mode => mode.id === gameSettings.gameMode)?.icon}
          </motion.div>
          <h2 className="text-4xl font-bold mb-2">Get Ready!</h2>
          <p className="text-xl text-white/80">
            Starting {GAME_MODES.find(mode => mode.id === gameSettings.gameMode)?.name}...
          </p>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <WordScrambleGameEnhanced
        settings={gameSettings}
        onBackToMenu={handleBackToMenu}
        onGameEnd={handleGameEnd}
        categoryVocabulary={categoryVocabulary}
        assignmentId={assignmentId}
        userId={user?.id}
        isAssignmentMode={!!assignmentId}
      />
    );
  }

  if (gameState === 'settings') {
    return (
      <GameSettingsEnhanced
        onStart={handleGameStart}
        onBack={handleBackToMenu}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
      />
    );
  }

  if (gameState === 'results' && gameResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center text-white max-w-2xl w-full shadow-2xl border border-white/20"
        >
          <div className="text-8xl mb-6">
            {gameResult.won ? '🏆' : '💫'}
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {gameResult.won ? 'Incredible Performance!' : 'Great Effort!'}
          </h2>
          
          {/* Enhanced Results Display */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-400/30">
              <div className="text-3xl font-bold text-yellow-300">{gameResult.score.toLocaleString()}</div>
              <div className="text-sm text-white/80">Final Score</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-400/30">
              <div className="text-3xl font-bold">{gameResult.stats.wordsCompleted}</div>
              <div className="text-sm text-white/80">Words Solved</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-400/30">
              <div className="text-3xl font-bold">{gameResult.stats.perfectWords}</div>
              <div className="text-sm text-white/80">Perfect Words</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg p-4 border border-orange-400/30">
              <div className="text-3xl font-bold">{gameResult.stats.streak}</div>
              <div className="text-sm text-white/80">Best Streak</div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/10">
            <h3 className="text-xl font-bold mb-3">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span>Average Solve Time:</span>
                <span className="font-semibold">{Math.floor(gameResult.stats.avgSolveTime * 10) / 10}s</span>
              </div>
              <div className="flex justify-between">
                <span>Max Multiplier:</span>
                <span className="font-semibold">{gameResult.stats.multiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span>Time Bonus:</span>
                <span className="font-semibold">+{gameResult.stats.timeBonus}</span>
              </div>
              <div className="flex justify-between">
                <span>Letter Accuracy:</span>
                <span className="font-semibold">{Math.floor(gameResult.stats.letterAccuracy)}%</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {gameResult.stats.achievements.some(a => a.unlocked) && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">🏆 Achievements</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {gameResult.stats.achievements.filter(a => a.unlocked).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg px-3 py-2 border border-yellow-400/30"
                  >
                    <span className="text-lg mr-2">{achievement.icon}</span>
                    <span className="text-sm font-semibold">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState('settings')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold transition-all shadow-lg"
            >
              🎮 Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToMenu}
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 rounded-xl font-semibold transition-all shadow-lg"
            >
              🏠 Main Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/10"></div>
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center max-w-4xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Epic Word
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Scramble
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience the ultimate word scrambling adventure with multiple game modes, power-ups, and achievements!
          </p>
        </motion.div>

        {/* Game Mode Preview */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6">🎮 Choose Your Adventure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAME_MODES.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`bg-gradient-to-br ${mode.color}/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-white hover:scale-105 transition-transform`}
              >
                <div className="text-4xl mb-3">{mode.icon}</div>
                <h4 className="text-xl font-bold mb-2">{mode.name}</h4>
                <p className="text-sm text-white/80">{mode.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="text-lg font-bold text-white mb-2">Power-ups</h4>
              <p className="text-sm text-white/70">Use strategic power-ups to boost your performance</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h4 className="text-lg font-bold text-white mb-2">Achievements</h4>
              <p className="text-sm text-white/70">Unlock rewards as you master the game</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔥</div>
              <h4 className="text-lg font-bold text-white mb-2">Streaks & Combos</h4>
              <p className="text-sm text-white/70">Chain correct answers for massive score multipliers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="text-lg font-bold text-white mb-2">Multiple Categories</h4>
              <p className="text-sm text-white/70">Animals, space, technology, and more!</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col md:flex-row gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameState('settings')}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all transform"
          >
            🚀 Start Game
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGameStart({...gameSettings, gameMode: 'classic', subcategory: selectedSubcategory})}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all"
          >
            ⚡ Quick Play
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center text-white/60 text-sm"
        >
          <p>Test your vocabulary skills • Challenge your mind • Have epic fun!</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
