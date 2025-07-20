'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSelector from './ThemeSelector';

type GameSettingsProps = {
  onStartGame: (settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords: string[];
  }) => void;
};

// Enhanced difficulties with emojis and descriptions
const ENHANCED_DIFFICULTIES = [
  { 
    id: 'beginner', 
    name: 'Beginner', 
    emoji: '🔰',
    description: 'Shorter words, more time'
  },
  { 
    id: 'intermediate', 
    name: 'Intermediate', 
    emoji: '🌟',
    description: 'Medium length words'
  },
  { 
    id: 'advanced', 
    name: 'Advanced', 
    emoji: '⚡',
    description: 'Longer words, less time'
  },
  { 
    id: 'expert', 
    name: 'Expert', 
    emoji: '🏆',
    description: 'Challenging words, tight time limit'
  },
];

// Enhanced languages with emojis and native names
const ENHANCED_LANGUAGES = [
  { id: 'spanish', name: 'Spanish', emoji: '🇪🇸', native: 'Español' },
  { id: 'french', name: 'French', emoji: '🇫🇷', native: 'Français' },
  { id: 'german', name: 'German', emoji: '🇩🇪', native: 'Deutsch' },
  { id: 'italian', name: 'Italian', emoji: '🇮🇹', native: 'Italiano' },
  { id: 'english', name: 'English', emoji: '🇬🇧', native: 'English' },
  { id: 'portuguese', name: 'Portuguese', emoji: '🇵🇹', native: 'Português' },
];

// Enhanced categories with emojis and descriptions
const ENHANCED_CATEGORIES = [
  { id: 'animals', name: 'Animals', emoji: '🐾', description: 'Pets, wildlife & creatures' },
  { id: 'foods', name: 'Food', emoji: '🍔', description: 'Common foods & meals' },
  { id: 'countries', name: 'Countries', emoji: '🌎', description: 'Nations & places' },
  { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Games & activities' },
  { id: 'professions', name: 'Jobs', emoji: '👨‍⚕️', description: 'Careers & work' },
  { id: 'family', name: 'Family', emoji: '👪', description: 'Family members' },
  { id: 'colors', name: 'Colors', emoji: '🎨', description: 'Colors & shades' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢', description: 'Counting & math' },
  { id: 'weather', name: 'Weather', emoji: '☀️', description: 'Weather conditions' },
  { id: 'transport', name: 'Transport', emoji: '🚆', description: 'Vehicles & travel' },
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  // Set default values
  const [category, setCategory] = useState(ENHANCED_CATEGORIES[0]);
  const [language, setLanguage] = useState(ENHANCED_LANGUAGES[0]);
  const [difficulty, setDifficulty] = useState(ENHANCED_DIFFICULTIES[0]);
  const [theme, setTheme] = useState('default');
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onStartGame({ 
      difficulty: difficulty.id,
      category: category.id,
      language: language.id,
      theme,
      customWords: []
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">      
      <form onSubmit={handleSubmit}>
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Hangman</h1>
          <p className="text-gray-600">Guess the word letter by letter!</p>
        </div>

        {/* Theme Selector - Full Width */}
        <div className="mb-8">
          <ThemeSelector 
            selectedTheme={theme} 
            onThemeChange={setTheme} 
          />
        </div>
        
        {/* Settings Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* Category Selector */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Category</label>
            <div 
              onClick={() => setShowCategoryModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowCategoryModal(true);
                }
              }}
              className="cursor-pointer text-center p-4 rounded-xl border-2 transition-all transform hover:scale-105 bg-white border-gray-300 hover:bg-gray-50 hover:border-blue-400 min-h-[120px] flex flex-col justify-center"
            >
              <div className="text-3xl mb-2">{category.emoji}</div>
              <div className="font-medium text-lg text-gray-800">{category.name}</div>
              <div className="text-sm mt-1 text-gray-600">{category.description}</div>
              <div className="text-xs mt-2 text-blue-500">Click to change</div>
            </div>
          </div>
          
          {/* Language Selector */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Language</label>
            <div 
              onClick={() => setShowLanguageModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowLanguageModal(true);
                }
              }}
              className="cursor-pointer text-center p-4 rounded-xl border-2 transition-all transform hover:scale-105 bg-white border-gray-300 hover:bg-gray-50 hover:border-blue-400 min-h-[120px] flex flex-col justify-center"
            >
              <div className="text-3xl mb-2">{language.emoji}</div>
              <div className="font-medium text-lg text-gray-800">{language.name}</div>
              <div className="text-sm mt-1 text-gray-600">{language.native}</div>
              <div className="text-xs mt-2 text-blue-500">Click to change</div>
            </div>
          </div>
          
          {/* Difficulty Selector */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Difficulty</label>
            <div 
              onClick={() => setShowDifficultyModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowDifficultyModal(true);
                }
              }}
              className="cursor-pointer text-center p-4 rounded-xl border-2 transition-all transform hover:scale-105 bg-white border-gray-300 hover:bg-gray-50 hover:border-blue-400 min-h-[120px] flex flex-col justify-center"
            >
              <div className="text-3xl mb-2">{difficulty.emoji}</div>
              <div className="font-medium text-lg text-gray-800">{difficulty.name}</div>
              <div className="text-sm mt-1 text-gray-600">{difficulty.description}</div>
              <div className="text-xs mt-2 text-blue-500">Click to change</div>
            </div>
          </div>
          
        </div>
        
        {/* Start Button */}
        <div className="text-center">
          <button 
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-full text-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            🎯 Start Hangman Game
          </button>
        </div>
      </form>

      {/* Category Selection Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              className="bg-white backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Choose Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {ENHANCED_CATEGORIES.map((item) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => {
                      setCategory(item);
                      setShowCategoryModal(false);
                    }}
                    className={`
                      cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                      ${category.id === item.id 
                        ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-lg ring-2 ring-blue-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-800'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-medium text-lg">{item.name}</div>
                    <div className="text-sm mt-1 opacity-75">{item.description}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <button 
                  onClick={() => setShowCategoryModal(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLanguageModal(false)}
          >
            <motion.div
              className="bg-white backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Choose Language</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {ENHANCED_LANGUAGES.map((item) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => {
                      setLanguage(item);
                      setShowLanguageModal(false);
                    }}
                    className={`
                      cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                      ${language.id === item.id 
                        ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-lg ring-2 ring-blue-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-800'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-medium text-lg">{item.name}</div>
                    <div className="text-sm mt-1 opacity-75">{item.native}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <button 
                  onClick={() => setShowLanguageModal(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Difficulty Selection Modal */}
      <AnimatePresence>
        {showDifficultyModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDifficultyModal(false)}
          >
            <motion.div
              className="bg-white backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Choose Difficulty</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {ENHANCED_DIFFICULTIES.map((item) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => {
                      setDifficulty(item);
                      setShowDifficultyModal(false);
                    }}
                    className={`
                      cursor-pointer text-center p-6 rounded-xl border-2 transition-all
                      ${difficulty.id === item.id 
                        ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-lg ring-2 ring-blue-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-800'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="font-medium text-xl">{item.name}</div>
                    <div className="text-sm mt-2 opacity-75">{item.description}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <button 
                  onClick={() => setShowDifficultyModal(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}