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
  Play
} from 'lucide-react';

interface FeaturedVocabMasterCardProps {
  onChooseContent: () => void;
}

export default function FeaturedVocabMasterCard({ onChooseContent }: FeaturedVocabMasterCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="col-span-full lg:col-span-2 mb-4"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-yellow-300 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">VocabMaster</h2>
                </div>
                <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                  RECOMMENDED
                </div>
              </div>

              <p className="text-lg text-white/90 mb-4 leading-relaxed max-w-2xl">
                Master vocabulary with intelligent spaced repetition, adaptive learning, and 8 engaging game modes. 
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 text-white/80">
                  <TrendingUp className="h-4 w-4 text-green-300" />
                  <span className="text-xs">Intelligent Spaced Repetition</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="h-4 w-4 text-purple-300" />
                  <span className="text-xs">8 Learning Modes</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="h-4 w-4 text-blue-300" />
                  <span className="text-xs">Teacher Recommended</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={onChooseContent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="h-4 w-4" />
                  Play
                </motion.button>

                <Link
                  href="/student-dashboard/vocabmaster"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
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

        </div>
      </div>
    </motion.div>
  );
}
