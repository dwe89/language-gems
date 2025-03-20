'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameSettings from './components/GameSettings';
import SentenceBuilderGame from './components/SentenceBuilderGame';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type GameStats = {
  gamesPlayed: number;
  highScore: number;
  averageTime: number;
  totalSentencesCompleted: number;
};

export default function SentenceBuilderPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'beginner',
    category: 'general',
    language: 'english',
  });
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    highScore: 0,
    averageTime: 0,
    totalSentencesCompleted: 0,
  });

  // Load stats from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('sentenceBuilderStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, []);

  // Update stats
  const updateStats = (gameResult: { score: number; time: number; sentencesCompleted: number }) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      highScore: Math.max(stats.highScore, gameResult.score),
      averageTime: stats.gamesPlayed === 0
        ? gameResult.time
        : (stats.averageTime * stats.gamesPlayed + gameResult.time) / (stats.gamesPlayed + 1),
      totalSentencesCompleted: stats.totalSentencesCompleted + gameResult.sentencesCompleted,
    };
    
    setStats(newStats);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sentenceBuilderStats', JSON.stringify(newStats));
    }
  };

  // Start game with settings
  const startGame = (settings: typeof gameSettings) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-6 flex items-center">
        <Link href="/games" className="inline-flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Games</span>
        </Link>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-indigo-700">
        Sentence Builder
      </h1>
      
      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Game Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">Games Played</p>
                <p className="text-2xl font-bold">{stats.gamesPlayed}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">High Score</p>
                <p className="text-2xl font-bold">{stats.highScore}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">Avg. Time (s)</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageTime)}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">Sentences Built</p>
                <p className="text-2xl font-bold">{stats.totalSentencesCompleted}</p>
              </div>
            </div>
          </div>
          
          <GameSettings onStartGame={startGame} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SentenceBuilderGame 
            settings={gameSettings}
            onBackToMenu={handleBackToMenu}
            onGameComplete={updateStats}
          />
        </motion.div>
      )}
    </div>
  );
} 