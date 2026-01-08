'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelCompleteScreenProps {
  show: boolean;
  stats: {
    totalWords: number;
    correctAnswers: number;
    accuracy: number;
    totalXP: number;
    gemsCollected: number;
  } | null;
  onContinue: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  show,
  stats,
  onContinue
}) => {
  return (
    <AnimatePresence>
      {show && stats && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
            <p className="text-blue-200 mb-6">Excellent work mining vocabulary gems!</p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-white">
                <span>Words Practiced:</span>
                <span className="font-bold">{stats.totalWords}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Correct Answers:</span>
                <span className="font-bold">{stats.correctAnswers}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Accuracy:</span>
                <span className="font-bold">{stats.accuracy}%</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Gems Collected:</span>
                <span className="font-bold">{stats.gemsCollected}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>XP Earned This Session:</span>
                <span className="font-bold text-yellow-400">{stats.totalXP}</span>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
