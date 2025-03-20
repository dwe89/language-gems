'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import GameSettings from './components/GameSettings';
import TicTacToeGame from './components/TicTacToeGame';

export default function NoughtsAndCrossesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'beginner',
    category: 'animals',
    language: 'spanish'
  });
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesTied: 0,
    gamesLost: 0,
    streak: 0,
    bestStreak: 0,
    wordsLearned: 0
  });
  
  useEffect(() => {
    // Load game stats from local storage
    const savedStats = localStorage.getItem('ticTacToeGameStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  const updateGameStats = (result: { outcome: 'win' | 'loss' | 'tie', wordsLearned: number }) => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed++;
    
    if (result.outcome === 'win') {
      newStats.gamesWon++;
      newStats.streak++;
      if (newStats.streak > newStats.bestStreak) {
        newStats.bestStreak = newStats.streak;
      }
    } else if (result.outcome === 'loss') {
      newStats.gamesLost++;
      newStats.streak = 0;
    } else {
      newStats.gamesTied++;
    }
    
    newStats.wordsLearned += result.wordsLearned;

    setGameStats(newStats);
    localStorage.setItem('ticTacToeGameStats', JSON.stringify(newStats));
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
        <h1 className="text-4xl font-bold text-pink-600">Noughts & Crosses</h1>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Game Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-gray-700">{gameStats.gamesPlayed}</p>
                  <p className="text-gray-600">Games Played</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{gameStats.gamesWon}</p>
                  <p className="text-gray-600">Wins</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-600">{gameStats.gamesTied}</p>
                  <p className="text-gray-600">Ties</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-600">{gameStats.gamesLost}</p>
                  <p className="text-gray-600">Losses</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center mt-4">
                <div>
                  <p className="text-3xl font-bold text-purple-600">{gameStats.bestStreak}</p>
                  <p className="text-gray-600">Best Streak</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{gameStats.wordsLearned}</p>
                  <p className="text-gray-600">Words Learned</p>
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
            <TicTacToeGame 
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