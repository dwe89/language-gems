'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GameResults {
  score: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  duration: number;
  tabletsRestored: number;
  language: string;
  difficulty: string;
}

interface TabletCompletedProps {
  results: GameResults;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export default function TabletCompleted({
  results,
  onPlayAgain,
  onBackToMenu
}: TabletCompletedProps) {
  const victoryMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play victory music
    if (typeof window !== 'undefined') {
      victoryMusicRef.current = new Audio('/audio/sfx/victory.mp3');
      if (victoryMusicRef.current) {
        victoryMusicRef.current.volume = 0.5;
        victoryMusicRef.current.play().catch(console.log);
      }
    }

    return () => {
      if (victoryMusicRef.current) {
        victoryMusicRef.current.pause();
        victoryMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  const getArchaeologistRank = (accuracy: number, score: number) => {
    if (accuracy >= 90 && score >= 200) return { rank: 'Master Archaeologist', icon: '👑', color: 'text-yellow-400' };
    if (accuracy >= 80 && score >= 150) return { rank: 'Expert Linguist', icon: '🏆', color: 'text-orange-400' };
    if (accuracy >= 70 && score >= 100) return { rank: 'Temple Explorer', icon: '⭐', color: 'text-blue-400' };
    if (accuracy >= 60) return { rank: 'Apprentice Scholar', icon: '📚', color: 'text-green-400' };
    return { rank: 'Novice Archaeologist', icon: '🔍', color: 'text-gray-400' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const archaeologistRank = getArchaeologistRank(results.accuracy, results.score);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-8xl mb-6"
          >
            🏛️
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
            Temple Exploration Complete!
          </h1>
          <p className="text-xl text-orange-200 max-w-2xl mx-auto">
            You have successfully restored the ancient inscriptions and unlocked the secrets of the temple!
          </p>
        </motion.div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-b from-yellow-600 to-orange-700 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4 border-4 border-yellow-400 shadow-lg shadow-yellow-400/30">
            <span className="text-4xl">{archaeologistRank.icon}</span>
          </div>
          <h2 className={`text-2xl font-bold ${archaeologistRank.color} mb-2`}>
            {archaeologistRank.rank}
          </h2>
          <p className="text-orange-200">
            Your archaeological expertise has been recognized!
          </p>
        </motion.div>

        {/* Results Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-black/60 rounded-xl p-6 text-center border border-orange-600/30">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-yellow-400">{results.score}</div>
            <div className="text-sm text-orange-200">Total Score</div>
          </div>

          <div className="bg-black/60 rounded-xl p-6 text-center border border-orange-600/30">
            <div className="text-3xl mb-2">📜</div>
            <div className="text-2xl font-bold text-green-400">{results.tabletsRestored}</div>
            <div className="text-sm text-orange-200">Tablets Restored</div>
          </div>

          <div className="bg-black/60 rounded-xl p-6 text-center border border-orange-600/30">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-blue-400">{Math.round(results.accuracy)}%</div>
            <div className="text-sm text-orange-200">Accuracy</div>
          </div>

          <div className="bg-black/60 rounded-xl p-6 text-center border border-orange-600/30">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-purple-400">{formatTime(results.duration)}</div>
            <div className="text-sm text-orange-200">Time Taken</div>
          </div>
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-black/60 rounded-xl p-8 mb-12 border border-orange-600/30"
        >
          <h3 className="text-xl font-bold text-yellow-400 mb-6 text-center">
            Archaeological Report
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-orange-300 mb-4">Restoration Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-orange-200">Correct Restorations:</span>
                  <span className="text-green-400 font-bold">{results.correctAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Total Attempts:</span>
                  <span className="text-white font-bold">{results.totalAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Success Rate:</span>
                  <span className="text-blue-400 font-bold">{Math.round(results.accuracy)}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-orange-300 mb-4">Expedition Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-orange-200">Language Studied:</span>
                  <span className="text-white font-bold capitalize">{results.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Difficulty Level:</span>
                  <span className="text-white font-bold capitalize">{results.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Average per Tablet:</span>
                  <span className="text-purple-400 font-bold">
                    {results.totalAttempts > 0 ? formatTime(Math.round(results.duration / results.totalAttempts)) : '0:00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏛️ Explore Another Temple
          </motion.button>

          <motion.button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-black/50 text-orange-200 border border-orange-600/50 hover:bg-orange-600/20 hover:border-orange-400 rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Return to Games
          </motion.button>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-center mt-12"
        >
          <div className="bg-black/40 rounded-xl p-6 max-w-2xl mx-auto border border-orange-600/30">
            <h4 className="text-lg font-bold text-yellow-400 mb-3">
              {results.accuracy >= 80 ? 'Outstanding Work!' : 
               results.accuracy >= 60 ? 'Good Progress!' : 
               'Keep Exploring!'}
            </h4>
            <p className="text-orange-200 text-sm">
              {results.accuracy >= 80 
                ? 'Your linguistic archaeology skills are exceptional! The ancient texts reveal their secrets to you with ease.'
                : results.accuracy >= 60 
                ? 'You\'re developing strong restoration abilities. Continue practicing to unlock more complex inscriptions.'
                : 'Every archaeologist starts somewhere. Keep studying the patterns and context clues to improve your restoration skills.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
