'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import GameSettings from './components/GameSettings';
import TicTacToeGame from './components/TicTacToeGame';

interface GameStats {
  gamesPlayed: number;
  wins: number;
  wordsLearned: number;
}

export default function NoughtsAndCrossesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    difficulty: '',
    category: '',
    language: '',
    playerMark: 'X',
    computerMark: 'O'
  });
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    wins: 0,
    wordsLearned: 0
  });

  // Load stats on initial render - with browser check
  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('ticTacToeStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, []);

  const startGame = (settings: { 
    difficulty: string; 
    category: string; 
    language: string;
    playerMark: string;
    computerMark: string;
  }) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  const endGame = (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number }) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      wins: stats.wins + (result.outcome === 'win' ? 1 : 0),
      wordsLearned: stats.wordsLearned + result.wordsLearned
    };
    
    setStats(newStats);
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      localStorage.setItem('ticTacToeStats', JSON.stringify(newStats));
    }
    setGameStarted(false);
  };

  const backToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen text-gray-700">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600">Noughts & Crosses</h1>
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
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">Learn Vocabulary While Playing</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Improve your language skills with this educational take on the classic game. 
                Correctly answer vocabulary questions to earn extra moves.
              </p>
            </div>
            
            {stats.gamesPlayed > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto mb-8 bg-indigo-50 rounded-lg p-4 shadow"
              >
                <h2 className="text-lg font-semibold text-indigo-700 mb-2">Your Stats</h2>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xl font-bold text-indigo-600">{stats.gamesPlayed}</div>
                    <div className="text-sm text-gray-500">Games</div>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xl font-bold text-indigo-600">{stats.wins}</div>
                    <div className="text-sm text-gray-500">Wins</div>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xl font-bold text-indigo-600">{stats.wordsLearned}</div>
                    <div className="text-sm text-gray-500">Words Learned</div>
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
            className="max-w-3xl mx-auto"
          >
            <TicTacToeGame
              settings={gameSettings}
              onBackToMenu={backToMenu}
              onGameEnd={endGame}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 