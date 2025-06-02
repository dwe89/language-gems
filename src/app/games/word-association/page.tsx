'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import GameSettings from './components/GameSettings';
import WordAssociationGame from './components/WordAssociationGame';

interface GameStats {
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
}

export default function WordAssociationPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    difficulty: '',
    category: '',
    language: '',
  });
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    bestScore: 0,
    averageScore: 0,
  });

  // Load stats from local storage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('wordAssociationStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, []);

  const updateStats = (score: number) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      bestScore: Math.max(stats.bestScore, score),
      averageScore: ((stats.averageScore * stats.gamesPlayed) + score) / (stats.gamesPlayed + 1),
    };
    
    setStats(newStats);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordAssociationStats', JSON.stringify(newStats));
    }
  };

  const startGame = (settings: { difficulty: string; category: string; language: string }) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  const backToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600">Word Association</h1>
        <Link 
          href="/games" 
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors"
        >
          Back to Games
        </Link>
      </div>
      
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">Test Your Word Associations</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Challenge yourself to identify words that are related to the given prompt word. 
                Build your vocabulary by exploring semantic relationships between words.
              </p>
            </div>
            
            {stats.gamesPlayed > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto mb-8 bg-purple-50 rounded-lg p-4 shadow"
              >
                <h2 className="text-lg font-semibold text-purple-700 mb-2">Your Stats</h2>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xl font-bold text-purple-600">{stats.gamesPlayed}</div>
                    <div className="text-sm text-gray-500">Games</div>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xl font-bold text-purple-600">{stats.bestScore}</div>
                    <div className="text-sm text-gray-500">Best Score</div>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xl font-bold text-purple-600">
                      {stats.averageScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Avg Score</div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <GameSettings onStartGame={startGame} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WordAssociationGame
              difficulty={gameSettings.difficulty}
              category={gameSettings.category}
              language={gameSettings.language}
              onBackToMenu={backToMenu}
              onGameComplete={updateStats}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 