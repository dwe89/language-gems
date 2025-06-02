'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import GameSettings from './components/GameSettings';
import WordScrambleGame from './components/WordScrambleGame';

export default function WordScramblePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'beginner',
    category: 'fruits',
    language: 'spanish'
  });
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    highScore: 0,
    totalScore: 0,
    bestStreak: 0
  });
  
  useEffect(() => {
    // Load game stats from local storage
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('wordScrambleGameStats');
      if (savedStats) {
        setGameStats(JSON.parse(savedStats));
      }
    }
  }, []);

  const updateGameStats = (result: { won: boolean, score: number, streak?: number }) => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed++;
    
    if (result.won) {
      newStats.gamesWon++;
      newStats.totalScore += result.score;
      
      if (result.score > newStats.highScore) {
        newStats.highScore = result.score;
      }
      
      if (result.streak && result.streak > newStats.bestStreak) {
        newStats.bestStreak = result.streak;
      }
    }

    setGameStats(newStats);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordScrambleGameStats', JSON.stringify(newStats));
    }
  };

  const handleStartGame = (settings: typeof gameSettings) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-600">Word Scramble</h1>
        <Link 
          href="/games" 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full transition-colors"
        >
          Back to Games
        </Link>
      </div>
      
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-green-50 shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Game Statistics</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-600">{gameStats.gamesPlayed}</p>
                  <p className="text-gray-600">Games Played</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{gameStats.gamesWon}</p>
                  <p className="text-gray-600">Games Won</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-600">{Math.round((gameStats.gamesWon / (gameStats.gamesPlayed || 1)) * 100)}%</p>
                  <p className="text-gray-600">Win Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{gameStats.highScore}</p>
                  <p className="text-gray-600">High Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{gameStats.bestStreak}</p>
                  <p className="text-gray-600">Best Streak</p>
                </div>
              </div>
            </div>
            
            <GameSettings onStartGame={handleStartGame} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WordScrambleGame 
              settings={gameSettings} 
              onBackToMenu={handleBackToMenu}
              onGameEnd={updateGameStats}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 