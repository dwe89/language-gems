'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type GameMode = 'classic' | 'blitz' | 'marathon' | 'timed_attack' | 'word_storm' | 'zen';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface GameSettings {
  difficulty: Difficulty;
  category: string;
  language: string;
  gameMode: GameMode;
}

type GameSettingsProps = {
  onStart: (settings: GameSettings) => void;
  onBack: () => void;
};

const GAME_MODES = [
  { 
    id: 'classic' as GameMode, 
    name: 'Classic', 
    description: 'Standard scramble with 2 minutes',
    icon: '📝',
    color: 'from-blue-500 to-blue-600',
    timeLimit: 120,
    wordLimit: 20
  },
  { 
    id: 'blitz' as GameMode, 
    name: 'Speed Blitz', 
    description: 'Fast 60-second challenges',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    timeLimit: 60,
    wordLimit: 15
  },
  { 
    id: 'marathon' as GameMode, 
    name: 'Marathon', 
    description: '5-minute endurance test',
    icon: '🏃',
    color: 'from-green-500 to-green-600',
    timeLimit: 300,
    wordLimit: 50
  },
  { 
    id: 'timed_attack' as GameMode, 
    name: 'Timed Attack', 
    description: '30-second burst rounds',
    icon: '💥',
    color: 'from-red-500 to-red-600',
    timeLimit: 30,
    wordLimit: 10
  },
  { 
    id: 'word_storm' as GameMode, 
    name: 'Word Storm', 
    description: 'Rapid word changes',
    icon: '🌪️',
    color: 'from-purple-500 to-purple-600',
    timeLimit: 90,
    wordLimit: 25
  },
  { 
    id: 'zen' as GameMode, 
    name: 'Zen Mode', 
    description: 'Relaxed, no time limits',
    icon: '🧘',
    color: 'from-teal-500 to-cyan-500',
    timeLimit: 0,
    wordLimit: 0
  }
];

const DIFFICULTIES = [
  { 
    id: 'easy' as Difficulty, 
    name: 'Easy', 
    description: 'Simple words, lots of hints',
    icon: '🟢',
    multiplier: 1,
    hints: 3
  },
  { 
    id: 'medium' as Difficulty, 
    name: 'Medium', 
    description: 'Moderate challenge',
    icon: '🟡',
    multiplier: 1.5,
    hints: 2
  },
  { 
    id: 'hard' as Difficulty, 
    name: 'Hard', 
    description: 'Complex words, fewer hints',
    icon: '🟠',
    multiplier: 2,
    hints: 1
  },
  { 
    id: 'expert' as Difficulty, 
    name: 'Expert', 
    description: 'Maximum challenge, no hints',
    icon: '🔴',
    multiplier: 3,
    hints: 0
  }
];

const CATEGORIES = [
  { id: 'animals', name: 'Animals', emoji: '🐾', description: 'Wildlife and pets' },
  { id: 'space', name: 'Space', emoji: '🚀', description: 'Cosmic adventures' },
  { id: 'technology', name: 'Technology', emoji: '💻', description: 'Digital world' }
];

const LANGUAGES = [
  { id: 'english', name: 'English', flag: '🇺🇸', description: 'International language' },
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸', description: 'Romance language' }
];

export default function GameSettingsEnhanced({ onStart, onBack }: GameSettingsProps) {
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'medium',
    category: 'animals',
    language: 'english',
    gameMode: 'classic'
  });

  const [selectedTab, setSelectedTab] = useState<'mode' | 'difficulty' | 'category' | 'language'>('mode');

  const handleStart = () => {
    onStart(settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/10"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
            >
              ← Back
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Game Settings
              </h1>
              <p className="text-white/70">Customize your word scramble adventure</p>
            </motion.div>

            <div className="w-20"></div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="flex-1 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                {(['mode', 'difficulty', 'category', 'language'] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedTab === tab 
                        ? 'bg-white text-purple-900 shadow-lg' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[400px]"
            >
              {/* Game Mode Selection */}
              {selectedTab === 'mode' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Game Mode</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {GAME_MODES.map((mode) => (
                      <motion.button
                        key={mode.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSettings({ ...settings, gameMode: mode.id })}
                        className={`p-6 rounded-xl text-left transition-all border-2 ${
                          settings.gameMode === mode.id
                            ? `bg-gradient-to-br ${mode.color}/30 border-white shadow-2xl`
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-4xl">{mode.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{mode.name}</h3>
                            <p className="text-sm text-white/70">{mode.description}</p>
                          </div>
                        </div>
                        <div className="text-xs text-white/60">
                          {mode.timeLimit > 0 ? `${Math.floor(mode.timeLimit / 60)}:${(mode.timeLimit % 60).toString().padStart(2, '0')} minutes` : 'No time limit'} • 
                          {mode.wordLimit > 0 ? ` ${mode.wordLimit} words` : ' Unlimited words'}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty Selection */}
              {selectedTab === 'difficulty' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Difficulty Level</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {DIFFICULTIES.map((difficulty) => (
                      <motion.button
                        key={difficulty.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSettings({ ...settings, difficulty: difficulty.id })}
                        className={`p-6 rounded-xl text-left transition-all border-2 ${
                          settings.difficulty === difficulty.id
                            ? 'bg-gradient-to-br from-green-500/30 to-blue-500/30 border-white shadow-2xl'
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-4xl">{difficulty.icon}</div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{difficulty.name}</h3>
                            <p className="text-white/70">{difficulty.description}</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-white/60">
                          <span>Score Multiplier: {difficulty.multiplier}x</span>
                          <span>Hints: {difficulty.hints}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Selection */}
              {selectedTab === 'category' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Word Category</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CATEGORIES.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSettings({ ...settings, category: category.id })}
                        className={`p-8 rounded-xl text-center transition-all border-2 ${
                          settings.category === category.id
                            ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-white shadow-2xl'
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="text-6xl mb-4">{category.emoji}</div>
                        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-white/70">{category.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Language Selection */}
              {selectedTab === 'language' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Language</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {LANGUAGES.map((language) => (
                      <motion.button
                        key={language.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSettings({ ...settings, language: language.id })}
                        className={`p-8 rounded-xl text-center transition-all border-2 ${
                          settings.language === language.id
                            ? 'bg-gradient-to-br from-orange-500/30 to-red-500/30 border-white shadow-2xl'
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="text-6xl mb-4">{language.flag}</div>
                        <h3 className="text-2xl font-bold text-white mb-2">{language.name}</h3>
                        <p className="text-white/70">{language.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Current Selection Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">Your Configuration</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">{GAME_MODES.find(m => m.id === settings.gameMode)?.icon}</div>
                  <div className="text-sm text-white/70">Mode</div>
                  <div className="text-white font-semibold">{GAME_MODES.find(m => m.id === settings.gameMode)?.name}</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">{DIFFICULTIES.find(d => d.id === settings.difficulty)?.icon}</div>
                  <div className="text-sm text-white/70">Difficulty</div>
                  <div className="text-white font-semibold">{DIFFICULTIES.find(d => d.id === settings.difficulty)?.name}</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">{CATEGORIES.find(c => c.id === settings.category)?.emoji}</div>
                  <div className="text-sm text-white/70">Category</div>
                  <div className="text-white font-semibold">{CATEGORIES.find(c => c.id === settings.category)?.name}</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">{LANGUAGES.find(l => l.id === settings.language)?.flag}</div>
                  <div className="text-sm text-white/70">Language</div>
                  <div className="text-white font-semibold">{LANGUAGES.find(l => l.id === settings.language)?.name}</div>
                </div>
              </div>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="px-16 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl font-bold rounded-2xl shadow-2xl transition-all"
              >
                🚀 Start Game
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
