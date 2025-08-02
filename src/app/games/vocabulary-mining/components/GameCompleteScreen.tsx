'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameCompleteScreenProps {
  gameState: {
    gemsCollected: number;
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    maxStreak: number;
  };
  isAssignmentMode: boolean;
  onExit: () => void;
}

export const GameCompleteScreen: React.FC<GameCompleteScreenProps> = ({
  gameState,
  isAssignmentMode,
  onExit
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md mx-4"
      >
        <div className="text-6xl mb-4">⛏️</div>
        <h2 className="text-3xl font-bold text-white mb-4">Mining Complete!</h2>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-white">
            <span>Gems Collected:</span>
            <span className="font-bold">{gameState.gemsCollected}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Score:</span>
            <span className="font-bold">{gameState.score}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Accuracy:</span>
            <span className="font-bold">
              {Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100)}%
            </span>
          </div>
          <div className="flex justify-between text-white">
            <span>Max Streak:</span>
            <span className="font-bold">{gameState.maxStreak}</span>
          </div>
        </div>
        <button
          onClick={onExit}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
        >
          {isAssignmentMode ? 'Back to Assignments' : 'Return to Mining Hub'}
        </button>
      </motion.div>
    </div>
  );
};
