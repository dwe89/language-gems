'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Trophy, Zap, Star, ArrowRight } from 'lucide-react';
import { GemButton, GemCard } from '../ui/GemTheme';

interface PracticeModeOption {
  id: 'quick' | 'standard' | 'mastery';
  title: string;
  subtitle: string;
  questions: number;
  duration: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  recommended?: boolean;
}

interface PracticeModeSelectorProps {
  onModeSelect: (mode: 'quick' | 'standard' | 'mastery', questionCount: number) => void;
  totalQuestions: number;
  topicTitle: string;
}

export default function PracticeModeSelector({ 
  onModeSelect, 
  totalQuestions, 
  topicTitle 
}: PracticeModeSelectorProps) {
  const modes: PracticeModeOption[] = [
    {
      id: 'quick',
      title: 'Quick Practice',
      subtitle: 'Fast Review',
      questions: Math.min(10, totalQuestions),
      duration: '3-5 min',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500',
      description: 'Perfect for maintaining streaks and quick reviews on-the-go'
    },
    {
      id: 'standard',
      title: 'Standard Practice',
      subtitle: 'Balanced Session',
      questions: Math.min(20, totalQuestions),
      duration: '8-12 min',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-400 to-indigo-500',
      description: 'Ideal balance of practice and time commitment',
      recommended: true
    },
    {
      id: 'mastery',
      title: 'Full Mastery Drill',
      subtitle: 'Complete Coverage',
      questions: totalQuestions,
      duration: '15-20 min',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-purple-400 to-pink-500',
      description: 'Master every concept before taking the quiz'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Practice Mode</h1>
          <p className="text-xl text-purple-200 mb-1">{topicTitle}</p>
          <p className="text-purple-300">{totalQuestions} questions available</p>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-3 gap-8 pt-6">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="group relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
              onClick={() => onModeSelect(mode.id, mode.questions)}
            >
              {/* Recommended Badge */}
              {mode.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    Recommended
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8 h-full flex flex-col">
                {/* Icon */}
                <div className="flex justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${mode.color} flex items-center justify-center text-white shadow-lg`}>
                    {mode.icon}
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{mode.title}</h3>
                  <p className="text-lg font-medium text-gray-600">{mode.subtitle}</p>
                </div>

                {/* Stats */}
                <div className="flex justify-center items-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">{mode.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{mode.duration}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1 mb-8">
                  <p className="text-gray-600 text-center leading-relaxed">{mode.description}</p>
                </div>

                {/* Button */}
                <button className={`w-full py-4 px-6 bg-gradient-to-r ${mode.color} text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}>
                  <span>Start Practice</span>
                  <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-purple-300"
        >
          <p className="text-sm">
            Questions are randomly selected from the complete question pool. 
            Your progress is saved automatically.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
