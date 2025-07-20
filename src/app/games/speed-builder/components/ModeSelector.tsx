'use client';

import React, { useState } from 'react';
import { BookOpen, Play, Settings, Star, Trophy, Target, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode, GCSETier, FreePlayConfig } from '../types';

interface ModeSelectorProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  freePlayConfig: FreePlayConfig;
  onFreePlayConfigChange: (config: Partial<FreePlayConfig>) => void;
  isAssignmentMode: boolean;
  assignmentData?: {
    title: string;
    description?: string;
    curriculum: {
      tier: GCSETier;
      theme: string;
      topic: string;
      grammarFocus?: string;
    };
  };
}

const THEMES = [
  'People and lifestyle',
  'Communication and the world around us',
  'Popular culture'
];

const TOPICS = [
  'Identity and relationships',
  'Education and work',
  'Free time activities',
  'Healthy living and lifestyle',
  'Environment and where people live',
  'Customs, festivals and celebrations'
];

const GRAMMAR_FOCUSES = [
  'present-tense',
  'ser-estar',
  'adjective-agreement',
  'gustar-verb',
  'reflexive-verbs',
  'numbers-age',
  'family-professions',
  'school-subjects',
  'weather-seasons',
  'questions'
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  gameMode,
  onModeChange,
  freePlayConfig,
  onFreePlayConfigChange,
  isAssignmentMode,
  assignmentData
}) => {
  const [showFilters, setShowFilters] = useState(false);

  if (isAssignmentMode && assignmentData) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900">{assignmentData.title}</h3>
            <p className="text-blue-700">Assignment Mode</p>
          </div>
        </div>
        
        {assignmentData.description && (
          <p className="text-gray-700 mb-4">{assignmentData.description}</p>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <span className="font-semibold text-white/80">Tier:</span>
            <p className="text-white">{assignmentData.curriculum.tier}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <span className="font-semibold text-white/80">Theme:</span>
            <p className="text-white">{assignmentData.curriculum.theme}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
            <span className="font-semibold text-white/80">Topic:</span>
            <p className="text-white">{assignmentData.curriculum.topic}</p>
          </div>
          {assignmentData.curriculum.grammarFocus && (
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
              <span className="font-semibold text-white/80">Grammar:</span>
              <p className="text-white">{assignmentData.curriculum.grammarFocus.replace('-', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gray-200 p-1 rounded-lg flex">
          <motion.button
            onClick={() => onModeChange('freeplay')}
            className={`px-6 py-3 rounded-md font-semibold transition-colors flex items-center gap-2 ${
              gameMode === 'freeplay'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="h-5 w-5" />
            Free Play
          </motion.button>
          <motion.button
            onClick={() => onModeChange('assignment')}
            className={`px-6 py-3 rounded-md font-semibold transition-colors flex items-center gap-2 ${
              gameMode === 'assignment'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen className="h-5 w-5" />
            Assignment
          </motion.button>
        </div>
      </div>

      {/* Free Play Configuration */}
      <AnimatePresence>
        {gameMode === 'freeplay' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900">Free Play Mode</h3>
                  <p className="text-green-700">Customize your learning experience</p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-green-200/50 hover:border-green-300/70 transition-colors text-white"
                whileHover={{ scale: 1.02 }}
              >
                <Filter className="h-4 w-4" />
                Filters
              </motion.button>
            </div>

            {/* GCSE Tier Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">GCSE Tier</label>
              <div className="flex gap-2">
                {(['Foundation', 'Higher'] as GCSETier[]).map((tier) => (
                  <motion.button
                    key={tier}
                    onClick={() => onFreePlayConfigChange({ selectedTier: tier })}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      freePlayConfig.selectedTier === tier
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 border-2 border-white/20 hover:border-green-300/70 text-white backdrop-blur-sm'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                >
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
                    <select
                      value={freePlayConfig.selectedTheme || ''}
                      onChange={(e) => onFreePlayConfigChange({ selectedTheme: e.target.value || undefined })}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="">All Themes</option>
                      {THEMES.map((theme) => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                  </div>

                  {/* Topic Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                    <select
                      value={freePlayConfig.selectedTopic || ''}
                      onChange={(e) => onFreePlayConfigChange({ selectedTopic: e.target.value || undefined })}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="">All Topics</option>
                      {TOPICS.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grammar Focus */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grammar Focus</label>
                    <select
                      value={freePlayConfig.grammarFocus || ''}
                      onChange={(e) => onFreePlayConfigChange({ grammarFocus: e.target.value || undefined })}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="">All Grammar</option>
                      {GRAMMAR_FOCUSES.map((focus) => (
                        <option key={focus} value={focus}>{focus.replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gamification Options */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <motion.label
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  checked={freePlayConfig.enableStars}
                  onChange={(e) => onFreePlayConfigChange({ enableStars: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Stars & XP</span>
                </div>
              </motion.label>

              <motion.label
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  checked={freePlayConfig.enableLeaderboard}
                  onChange={(e) => onFreePlayConfigChange({ enableLeaderboard: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Leaderboard</span>
                </div>
              </motion.label>

              <motion.label
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  checked={freePlayConfig.enableAdaptiveLearning}
                  onChange={(e) => onFreePlayConfigChange({ enableAdaptiveLearning: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Adaptive Learning</span>
                </div>
              </motion.label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 