'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GameSettingsProps = {
  onStartGame: (settings: { 
    difficulty: string; 
    category: string; 
    language: string; 
    gameMode: string;
    customWords?: string;
  }) => void;
};

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CATEGORIES = ['general', 'academic', 'business', 'technology', 'nature', 'custom'];
const LANGUAGES = ['english', 'spanish', 'french', 'german', 'italian'];
const GAME_MODES = [
  { id: 'classic', name: 'Classic', description: 'Traditional word association', icon: '🎯' },
  { id: 'speed', name: 'Speed Round', description: 'Fast-paced 15-second rounds', icon: '⚡' },
  { id: 'chain', name: 'Chain Reaction', description: 'Build connected word chains', icon: '🔗' },
  { id: 'memory', name: 'Memory Palace', description: 'Remember previous associations', icon: '🧠' },
  { id: 'battle', name: 'Battle Mode', description: 'Competitive scoring system', icon: '⚔️' },
  { id: 'survival', name: 'Survival', description: 'Last as long as you can', icon: '🏆' }
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [gameMode, setGameMode] = useState(GAME_MODES[0].id);
  const [customWords, setCustomWords] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (category === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({ 
      difficulty, 
      category, 
      language,
      gameMode,
      customWords: category === 'custom' ? customWords : undefined 
    });
  };

  const difficultyDescriptions = {
    easy: '2-3 related words per prompt',
    medium: '3-4 related words per prompt',
    hard: '4-5 related words per prompt',
  };

  const categoryDescriptions = {
    general: 'Everyday vocabulary',
    academic: 'School and education related',
    business: 'Professional and workplace terms',
    technology: 'Digital and tech vocabulary',
    nature: 'Environmental and natural world',
    custom: 'Your own custom words'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-xl text-gray-700"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Choose Your Adventure
        </h2>
        <p className="text-lg text-gray-600">
          Select your game mode and settings for an epic word association experience
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Game Mode Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-4">🎮 Game Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAME_MODES.map((mode) => (
              <motion.div 
                key={mode.id}
                onClick={() => setGameMode(mode.id)}
                className={`
                  cursor-pointer p-6 rounded-xl border-2 transition-all duration-300
                  ${gameMode === mode.id 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500 text-white shadow-lg scale-105' 
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'}
                `}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-3xl mb-2">{mode.icon}</div>
                <div className="font-bold text-lg mb-1">{mode.name}</div>
                <div className={`text-sm ${gameMode === mode.id ? 'text-purple-100' : 'text-gray-500'}`}>
                  {mode.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4">💪 Difficulty</label>
            <div className="space-y-3">
              {DIFFICULTIES.map((level) => (
                <motion.div 
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`
                    cursor-pointer p-4 rounded-xl border-2 transition-all duration-300
                    ${difficulty === level 
                      ? 'bg-gradient-to-r from-green-400 to-blue-400 border-green-400 text-white shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'}
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold capitalize text-lg">{level}</div>
                      <div className={`text-sm ${difficulty === level ? 'text-green-100' : 'text-gray-500'}`}>
                        {difficultyDescriptions[level as keyof typeof difficultyDescriptions]}
                      </div>
                    </div>
                    <div className="text-2xl">
                      {level === 'easy' ? '😊' : level === 'medium' ? '😐' : '😤'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-4">📚 Category</label>
            <div className="space-y-3">
              {CATEGORIES.map((item) => (
                <motion.div 
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`
                    cursor-pointer p-4 rounded-xl border-2 transition-all duration-300
                    ${category === item 
                      ? 'bg-gradient-to-r from-orange-400 to-red-400 border-orange-400 text-white shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'}
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold capitalize text-lg">{item}</div>
                      <div className={`text-sm ${category === item ? 'text-orange-100' : 'text-gray-500'}`}>
                        {categoryDescriptions[item as keyof typeof categoryDescriptions]}
                      </div>
                    </div>
                    <div className="text-2xl">
                      {item === 'general' ? '🌍' : 
                       item === 'academic' ? '🎓' : 
                       item === 'business' ? '💼' : 
                       item === 'technology' ? '💻' : 
                       item === 'nature' ? '🌳' : '✏️'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-4">🌐 Language</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {LANGUAGES.map((lang) => (
              <motion.div 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`
                  cursor-pointer text-center p-4 rounded-xl border-2 transition-all duration-300
                  ${language === lang 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-500 text-white shadow-lg' 
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'}
                `}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-bold capitalize text-lg">{lang}</div>
                <div className="text-2xl mt-1">
                  {lang === 'english' ? '🇺🇸' : 
                   lang === 'spanish' ? '🇪🇸' : 
                   lang === 'french' ? '🇫🇷' : 
                   lang === 'german' ? '🇩🇪' : '🇮🇹'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom Words Input */}
        <AnimatePresence>
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-xl font-bold text-gray-800 mb-4">✏️ Custom Words</label>
              <div className="bg-white p-6 rounded-xl border-2 border-purple-200">
                <textarea
                  value={customWords}
                  onChange={(e) => setCustomWords(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none h-32"
                  placeholder="Enter your custom words separated by commas (minimum 10 words)..."
                />
                <div className="text-sm text-gray-500 mt-2">
                  💡 Example: ocean, wave, blue, deep, swim, salt, beach, tide, sailor, lighthouse
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Game Button */}
        <div className="text-center pt-6">
          <motion.button
            type="submit"
            disabled={category === 'custom' && customWords.split(',').length < 10}
            className={`
              px-12 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all duration-300
              ${category === 'custom' && customWords.split(',').length < 10
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl transform hover:scale-105'}
            `}
            whileHover={category !== 'custom' || customWords.split(',').length >= 10 ? { scale: 1.05 } : {}}
            whileTap={category !== 'custom' || customWords.split(',').length >= 10 ? { scale: 0.95 } : {}}
          >
            🚀 Start Epic Adventure
          </motion.button>
          
          {category === 'custom' && customWords.split(',').length < 10 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-2 text-sm"
            >
              Please enter at least 10 custom words to continue
            </motion.p>
          )}
        </div>
      </form>
    </motion.div>
  );
} 