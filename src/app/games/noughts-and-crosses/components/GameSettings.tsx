'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSelector from './ThemeSelector';
import { useAudio } from '../hooks/useAudio';

type GameSettingsProps = {
  onStartGame: (settings: { 
    difficulty: string; 
    category: string; 
    language: string;
    theme: string;
    playerMark: string;
    computerMark: string;
  }) => void;
};

const CATEGORIES = [
  { id: 'animals', name: 'Animals', emoji: '🐾', description: 'Pets, wildlife & creatures' },
  { id: 'food', name: 'Food & Drinks', emoji: '🍎', description: 'Meals, snacks & beverages' },
  { id: 'colors', name: 'Colors', emoji: '🎨', description: 'Colors & shades' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢', description: 'Basic counting & math' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Family members & relations' },
  { id: 'body', name: 'Body Parts', emoji: '👋', description: 'Body parts & anatomy' },
  { id: 'clothes', name: 'Clothing', emoji: '👕', description: 'Clothes & accessories' },
  { id: 'house', name: 'House & Home', emoji: '🏠', description: 'Rooms, furniture & items' },
  { id: 'school', name: 'School', emoji: '📚', description: 'Education & learning' },
  { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Games, sports & activities' },
  { id: 'weather', name: 'Weather', emoji: '🌤️', description: 'Weather & seasons' },
  { id: 'transport', name: 'Transportation', emoji: '🚗', description: 'Vehicles & travel' },
  { id: 'emotions', name: 'Emotions', emoji: '😊', description: 'Feelings & moods' },
  { id: 'time', name: 'Time', emoji: '⏰', description: 'Days, months & time' },
  { id: 'nature', name: 'Nature', emoji: '🌳', description: 'Plants, landscapes & outdoors' },
  { id: 'technology', name: 'Technology', emoji: '💻', description: 'Computers, phones & gadgets' },
  { id: 'music', name: 'Music', emoji: '🎵', description: 'Instruments & musical terms' },
  { id: 'travel', name: 'Travel', emoji: '✈️', description: 'Places, countries & tourism' }
];

const LANGUAGES = [
  { id: 'spanish', name: 'Spanish', emoji: '🇪🇸', native: 'Español' },
  { id: 'french', name: 'French', emoji: '🇫🇷', native: 'Français' },
  { id: 'german', name: 'German', emoji: '🇩🇪', native: 'Deutsch' }
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);
  
  // Set default values to first items in arrays
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [theme, setTheme] = useState('default');
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onStartGame({ 
      difficulty: 'intermediate', // Default difficulty 
      category: category.id, 
      language: language.id,
      theme,
      playerMark: 'X', // Default to X
      computerMark: 'O' // Default to O
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl text-white"
    >      
      <form onSubmit={handleSubmit} className="text-white">
        {/* Theme Selector - Full Width */}
        <div className="mb-8">
          <ThemeSelector selectedTheme={theme} onThemeChange={(newTheme) => {
            playSFX('button-click');
            setTheme(newTheme);
          }} />
        </div>
        
        {/* Settings Grid - Modal-based Selection */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Category - Modal Selector */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Category</label>
            <div 
              onClick={() => {
                playSFX('button-click');
                setShowCategoryModal(true);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  playSFX('button-click');
                  setShowCategoryModal(true);
                }
              }}
              className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all transform hover:scale-105 bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
            >
              <div className="text-4xl mb-2">{category.emoji}</div>
              <div className="font-medium text-xl">{category.name}</div>
              <div className="text-sm mt-1 opacity-75">{category.description}</div>
              <div className="text-xs mt-2 opacity-50">Click to change</div>
            </div>
          </div>
          
          {/* Language - Modal Selector */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Language</label>
            <div 
              onClick={() => {
                playSFX('button-click');
                setShowLanguageModal(true);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  playSFX('button-click');
                  setShowLanguageModal(true);
                }
              }}
              className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all transform hover:scale-105 bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
            >
              <div className="text-4xl mb-2">{language.emoji}</div>
              <div className="font-medium text-xl">{language.name}</div>
              <div className="text-sm mt-1 opacity-75">{language.native}</div>
              <div className="text-xs mt-2 opacity-50">Click to change</div>
            </div>
          </div>
          
        </div>
        
        {/* Start Button */}
        <div className="text-center">
          <button 
            type="submit"
            onClick={() => playSFX('button-click')}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full text-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 hover:y-1"
          >
            🚀 Start Adventure
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
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl text-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-center mb-8">Choose Learning Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {CATEGORIES.map((item) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => {
                      playSFX('button-click');
                      setCategory(item);
                      setShowCategoryModal(false);
                    }}
                    className={`
                      cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                      ${category.id === item.id 
                        ? 'bg-white/25 border-white/60 text-white shadow-lg ring-2 ring-white/40' 
                        : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs mt-1 opacity-75">{item.description}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => {
                    playSFX('button-click');
                    setShowCategoryModal(false);
                  }}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
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
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl text-white max-w-2xl w-full"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-center mb-8">Choose Language</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {LANGUAGES.map((lang) => (
                  <motion.div 
                    key={lang.id}
                    onClick={() => {
                      playSFX('button-click');
                      setLanguage(lang);
                      setShowLanguageModal(false);
                    }}
                    className={`
                      cursor-pointer text-center p-6 rounded-xl border-2 transition-all
                      ${language.id === lang.id 
                        ? 'bg-white/25 border-white/60 text-white shadow-lg ring-2 ring-white/40' 
                        : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-4xl mb-3">{lang.emoji}</div>
                    <div className="font-medium text-lg">{lang.name}</div>
                    <div className="text-sm mt-1 opacity-75">{lang.native}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => {
                    playSFX('button-click');
                    setShowLanguageModal(false);
                  }}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}