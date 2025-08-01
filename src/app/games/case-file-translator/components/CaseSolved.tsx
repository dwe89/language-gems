'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Clock, Target, RotateCcw, Home, Languages, CheckCircle } from 'lucide-react';
interface CaseGameProgress {
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  accuracy: number;
  completedAt: string | null;
}

interface CaseSolvedProps {
  caseType: string;
  gameProgress: CaseGameProgress;
  onNewCase: () => void;
  onBackToMenu: () => void;
}

export default function CaseSolved({ caseType, gameProgress, onNewCase, onBackToMenu }: CaseSolvedProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  
  const scorePercentage = Math.round(gameProgress.accuracy || 0);
  const performance = scorePercentage >= 90 ? 'excellent' : scorePercentage >= 70 ? 'good' : scorePercentage >= 50 ? 'fair' : 'needs-improvement';

  const performanceData = {
    excellent: {
      title: 'Master Detective',
      message: 'Outstanding translation work! You cracked the case with precision.',
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500',
      badge: '🏆'
    },
    good: {
      title: 'Skilled Detective',
      message: 'Great detective work! Your translations helped solve the case.',
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500',
      badge: '🥈'
    },
    fair: {
      title: 'Junior Detective',
      message: 'Good effort! Keep practicing to improve your translation skills.',
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500',
      badge: '🥉'
    },
    'needs-improvement': {
      title: 'Detective Trainee',
      message: 'The case is solved, but more training is needed. Keep practicing!',
      color: 'text-red-400',
      bgColor: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500',
      badge: '📚'
    }
  };

  const currentPerformance = performanceData[performance];

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 100],
                x: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 3,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-8xl mb-4">{currentPerformance.badge}</div>
            <h1 className="text-4xl font-bold text-amber-400 mb-2">Case Solved!</h1>
            <p className="text-amber-300/70 text-lg">Translation mission complete</p>
          </motion.div>

          {/* Main results card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${currentPerformance.bgColor} backdrop-blur-sm border ${currentPerformance.borderColor} rounded-xl p-8 mb-6`}
          >
            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold ${currentPerformance.color} mb-2`}>
                {currentPerformance.title}
              </h2>
              <p className="text-slate-300 text-lg">
                {currentPerformance.message}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {gameProgress.correctAnswers}
                </div>
                <div className="text-slate-400 text-sm">Correct</div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Languages className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {gameProgress.totalQuestions}
                </div>
                <div className="text-slate-400 text-sm">Total</div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {scorePercentage}%
                </div>
                <div className="text-slate-400 text-sm">Accuracy</div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatTime(gameProgress.timeSpent || 0)}
                </div>
                <div className="text-slate-400 text-sm">Time</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Translation Accuracy</span>
                <span>{scorePercentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full bg-gradient-to-r ${
                    performance === 'excellent' ? 'from-green-500 to-emerald-500' :
                    performance === 'good' ? 'from-blue-500 to-cyan-500' :
                    performance === 'fair' ? 'from-yellow-500 to-orange-500' :
                    'from-red-500 to-pink-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Achievement badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {gameProgress.correctAnswers === gameProgress.totalQuestions && (
                <div className="bg-green-900/30 border border-green-500 rounded-lg px-3 py-1 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Perfect Translation</span>
                </div>
              )}
              
              {(gameProgress.timeSpent || 0) < 300 && (
                <div className="bg-blue-900/30 border border-blue-500 rounded-lg px-3 py-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-semibold">Speed Detective</span>
                </div>
              )}
              
              {scorePercentage >= 90 && (
                <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg px-3 py-1 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-semibold">Master Translator</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={onNewCase}
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              <RotateCcw className="h-5 w-5" />
              New Case
            </button>
            
            <button
              onClick={onBackToMenu}
              className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              <Home className="h-5 w-5" />
              Back to Menu
            </button>
          </motion.div>

          {/* Case file stamp */}
          <motion.div
            initial={{ opacity: 0, rotate: -45, scale: 0 }}
            animate={{ opacity: 1, rotate: -12, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="absolute top-20 right-20 w-32 h-32 border-4 border-red-600 rounded-lg flex items-center justify-center bg-red-100/10 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="text-red-400 font-bold text-lg">CASE</div>
              <div className="text-red-400 font-bold text-lg">SOLVED</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
