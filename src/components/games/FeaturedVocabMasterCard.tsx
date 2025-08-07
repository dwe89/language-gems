'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Brain, 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Play,
  Settings
} from 'lucide-react';

interface FeaturedVocabMasterCardProps {
  onChooseContent: () => void;
}

export default function FeaturedVocabMasterCard({ onChooseContent }: FeaturedVocabMasterCardProps) {
  const router = useRouter();

  const handleQuickStart = () => {
    router.push('/student-dashboard/vocabmaster');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="col-span-full mb-8"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-yellow-300 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-white" />
                  <h2 className="text-3xl font-bold text-white">VocabMaster</h2>
                </div>
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  RECOMMENDED
                </div>
              </div>

              <p className="text-xl text-white/90 mb-6 leading-relaxed max-w-2xl">
                Master vocabulary with intelligent spaced repetition, adaptive learning, and 8 engaging game modes. 
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/80">
                  <TrendingUp className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Intelligent Spaced Repetition</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="h-5 w-5 text-purple-300" />
                  <span className="text-sm">8 Learning Modes</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="h-5 w-5 text-blue-300" />
                  <span className="text-sm">Teacher Recommended</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleQuickStart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="h-5 w-5" />
                  Quick Start
                </motion.button>

                <motion.button
                  onClick={onChooseContent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200"
                >
                  <Settings className="h-5 w-5" />
                  Choose Content
                </motion.button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Floating Gems Animation */}
                <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg"
                  />
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute top-4 right-0 w-6 h-6 bg-gradient-to-br from-green-300 to-green-500 rounded-lg shadow-lg"
                  />
                  <motion.div
                    animate={{ 
                      y: [0, -12, 0],
                      rotate: [0, 3, 0]
                    }}
                    transition={{ 
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg shadow-lg"
                  />
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, -3, 0]
                    }}
                    transition={{ 
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                    className="absolute bottom-0 right-4 w-7 h-7 bg-gradient-to-br from-blue-300 to-blue-500 rounded-lg shadow-lg"
                  />
                  
                  {/* Central Trophy */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <Trophy className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex flex-wrap items-center justify-between gap-4 text-white/70 text-sm">
              <div className="flex items-center gap-6">
                <span>🎯 Most Effective for Long-term Retention</span>
                <span>📈 Proven Results in Vocabulary Mastery</span>
                
              </div>
              <Link
                href="/student-dashboard/vocabmaster"
                className="flex items-center gap-1 text-white/60 hover:text-white/80 transition-colors"
              >
                <span>Learn more</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
