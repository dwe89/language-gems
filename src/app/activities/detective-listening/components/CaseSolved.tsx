'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, RotateCcw, Home, CheckCircle, Award, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getCaseTypeById } from '../data/gameData';

interface CaseSolvedProps {
  caseType: string;
  gameProgress: {
    correctAnswers: number;
    totalEvidence: number;
    evidenceCollected: any[];
  };
  onNewCase: () => void;
  onBackToMenu: () => void;
}

export default function CaseSolved({ caseType, gameProgress, onNewCase, onBackToMenu }: CaseSolvedProps) {
  const [showDetails, setShowDetails] = useState(false);
  const caseInfo = getCaseTypeById(caseType);
  
  const scorePercentage = Math.round((gameProgress.correctAnswers / gameProgress.totalEvidence) * 100);
  const performance = scorePercentage >= 90 ? 'excellent' : scorePercentage >= 70 ? 'good' : scorePercentage >= 50 ? 'fair' : 'needs-improvement';

  const getPerformanceData = () => {
    switch (performance) {
      case 'excellent':
        return {
          title: 'Outstanding Detective Work!',
          message: 'You solved the case with exceptional skill!',
          badge: '🏆',
          color: 'from-yellow-400 to-orange-500',
          textColor: 'text-yellow-100',
          stars: 3
        };
      case 'good':
        return {
          title: 'Great Detective Work!',
          message: 'You successfully cracked the case!',
          badge: '🥇',
          color: 'from-green-400 to-emerald-500',
          textColor: 'text-green-100',
          stars: 2
        };
      case 'fair':
        return {
          title: 'Case Closed!',
          message: 'Good work, detective. Room for improvement!',
          badge: '🥈',
          color: 'from-blue-400 to-indigo-500',
          textColor: 'text-blue-100',
          stars: 1
        };
      default:
        return {
          title: 'Case Completed',
          message: 'Keep practicing to improve your detective skills!',
          badge: '🥉',
          color: 'from-gray-400 to-slate-500',
          textColor: 'text-gray-100',
          stars: 1
        };
    }
  };

  const performanceData = getPerformanceData();

  useEffect(() => {
    // Trigger confetti for good performance
    if (performance === 'excellent' || performance === 'good') {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#d97706', '#92400e']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#d97706', '#92400e']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }

    // Show details after animation
    setTimeout(() => setShowDetails(true), 1000);
  }, [performance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 relative overflow-hidden">
      {/* Detective Room Background */}
      <div className="absolute inset-0 opacity-30">
        {/* Desk */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-amber-800 to-amber-700"></div>
        
        {/* Solved Case File */}
        <div className="absolute bottom-80 left-1/2 transform -translate-x-1/2 w-64 h-80 bg-amber-100 rounded-lg shadow-2xl border-4 border-amber-800">
          <div className="p-4 text-center">
            <div className="text-6xl mb-4">📁</div>
            <div className="text-amber-900 font-bold text-lg mb-2">{caseInfo?.name}</div>
            <div className="text-red-600 font-bold text-2xl transform -rotate-12 border-4 border-red-600 rounded-lg p-2 bg-red-100">
              SOLVED
            </div>
          </div>
        </div>

        {/* Trophy */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
          <Trophy className="h-16 w-16 text-yellow-900" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${performanceData.color} rounded-full shadow-2xl mb-6`}>
            <span className="text-4xl">{performanceData.badge}</span>
          </div>
          
          <h1 className={`text-5xl font-bold ${performanceData.textColor} mb-4`}>
            {performanceData.title}
          </h1>
          
          <p className="text-xl text-amber-200 mb-6">
            {performanceData.message}
          </p>

          {/* Stars */}
          <div className="flex justify-center space-x-2 mb-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 200 }}
              >
                <Star
                  className={`h-8 w-8 ${
                    i < performanceData.stars
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-500'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-amber-100/10 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/30 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {gameProgress.correctAnswers}
              </div>
              <div className="text-amber-200">Evidence Confirmed</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {scorePercentage}%
              </div>
              <div className="text-amber-200">Accuracy Rate</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {performanceData.stars}
              </div>
              <div className="text-amber-200">Stars Earned</div>
            </div>
          </div>
        </motion.div>

        {/* Evidence Summary */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-amber-100/5 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/20 mb-8"
            >
              <h3 className="text-2xl font-bold text-amber-100 mb-6 text-center">
                Case Summary
              </h3>
              
              <div className="text-center text-amber-200 mb-6">
                <p>
                  You identified <span className="text-amber-100 font-bold">{gameProgress.correctAnswers}</span> out of{' '}
                  <span className="text-amber-100 font-bold">{gameProgress.totalEvidence}</span> pieces of evidence!
                </p>
              </div>

              {/* Evidence Grid */}
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                {[...Array(gameProgress.totalEvidence)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                      i < gameProgress.correctAnswers
                        ? 'bg-green-500/20 border-green-400'
                        : 'bg-red-500/20 border-red-400'
                    }`}
                  >
                    {i < gameProgress.correctAnswers ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <span className="text-red-400 font-bold">✗</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewCase}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Solve Another Case</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
          >
            <Home className="h-5 w-5" />
            <span>Back to Menu</span>
          </motion.button>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-8"
        >
          <p className="text-amber-300 text-sm">
            {performance === 'excellent' 
              ? "🎉 Exceptional detective work! You're ready for the toughest cases!"
              : performance === 'good'
              ? "🌟 Great job! Keep practicing to become a master detective!"
              : "💪 Every great detective started somewhere. Keep investigating!"
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}
