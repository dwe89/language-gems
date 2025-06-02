'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type GameSettingsProps = {
  onStartGame: (settings: { difficulty: string; category: string; language: string; customWords?: string }) => void;
};

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CATEGORIES = ['general', 'academic', 'business', 'technology', 'nature', 'custom'];
const LANGUAGES = ['english', 'spanish', 'french', 'german', 'italian'];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
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
      customWords: category === 'custom' ? customWords : undefined 
    });
  };

  const difficultyDescriptions = {
    easy: '2 related words per prompt',
    medium: '3 related words per prompt',
    hard: '4 related words per prompt',
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
      className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-gray-700"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Game Settings</h2>
      
      <form onSubmit={handleSubmit} className="text-gray-700">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((level) => (
              <div 
                key={level}
                onClick={() => setDifficulty(level)}
                className={`
                  cursor-pointer text-center p-3 rounded-lg border-2 transition
                  ${difficulty === level 
                    ? 'bg-purple-100 border-purple-500 text-purple-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="font-medium capitalize">{level}</div>
                <div className="text-xs text-gray-500 mt-1">{difficultyDescriptions[level as keyof typeof difficultyDescriptions]}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((item) => (
              <div 
                key={item}
                onClick={() => setCategory(item)}
                className={`
                  cursor-pointer text-center p-3 rounded-lg border-2 transition
                  ${category === item 
                    ? 'bg-purple-100 border-purple-500 text-purple-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="font-medium capitalize">{item}</div>
                <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                  {categoryDescriptions[item as keyof typeof categoryDescriptions]}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {LANGUAGES.map((lang) => (
              <div 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`
                  cursor-pointer text-center p-2 rounded-lg border-2 transition
                  ${language === lang 
                    ? 'bg-purple-100 border-purple-500 text-purple-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="font-medium capitalize">{lang}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            You'll be shown {language === 'english' ? 'English' : 'English and ' + language.charAt(0).toUpperCase() + language.slice(1)} words.
          </p>
        </div>
        
        {showCustomInput && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Words</label>
            <textarea
              value={customWords}
              onChange={(e) => setCustomWords(e.target.value)}
              placeholder="Enter words separated by commas (e.g., apple, orange, banana)"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter at least 10 words separated by commas for best experience
            </p>
          </div>
        )}
        
        <button 
          type="submit"
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-center transition-colors"
        >
          Start Game
        </button>
      </form>
    </motion.div>
  );
} 