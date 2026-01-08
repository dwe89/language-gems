'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

interface GameCompletionModalProps {
  isOpen: boolean;
  gameName: string;
  wordsCompleted: number;
  threshold: number;
  accuracy?: number;
  timeSpent?: number;
  gemsEarned?: number;
  onBackToAssignment: () => void;
  onPlayAgain?: () => void;
  assignmentId?: string;
}

export default function GameCompletionModal({
  isOpen,
  gameName,
  wordsCompleted,
  threshold,
  accuracy = 0,
  timeSpent = 0,
  gemsEarned = 0,
  onBackToAssignment,
  onPlayAgain,
  assignmentId
}: GameCompletionModalProps) {
  // Trigger confetti on open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Try to use canvas-confetti if available
      try {
        const confetti = (window as any).confetti;
        if (confetti) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (error) {
        console.log('Confetti not available');
      }
    }
  }, [isOpen]);

  // Handle Enter key to continue
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onBackToAssignment();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onBackToAssignment]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => {
          // Close modal when clicking backdrop
          if (e.target === e.currentTarget) {
            onBackToAssignment();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-8 max-w-md w-full shadow-2xl text-white text-center"
        >
          {/* Trophy Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-14 h-14 text-yellow-800" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            🎉 Game Complete!
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 mb-6"
          >
            You've mastered {gameName}!
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-3xl font-bold">{wordsCompleted}/{threshold}</div>
              <div className="text-sm text-white/80">Words Mastered</div>
            </div>
            {accuracy > 0 && (
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold">{Math.round(accuracy)}%</div>
                <div className="text-sm text-white/80">Accuracy</div>
              </div>
            )}
            {timeSpent > 0 && (
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold">{formatTime(timeSpent)}</div>
                <div className="text-sm text-white/80">Time</div>
              </div>
            )}
            {gemsEarned > 0 && (
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-1" />
                  {gemsEarned}
                </div>
                <div className="text-sm text-white/80">Gems Earned</div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <button
              onClick={onBackToAssignment}
              className="w-full py-4 px-6 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Assignment
              <span className="text-sm text-gray-500 ml-2">(Press Enter)</span>
            </button>

            {onPlayAgain && (
              <button
                onClick={onPlayAgain}
                className="w-full py-3 px-6 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
