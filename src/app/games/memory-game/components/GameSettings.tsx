'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES, LANGUAGES, TOPICS, DIFFICULTIES } from '../data/gameConstants';
import { WordPair } from './CustomWordsModal';
import CustomWordsModal from './CustomWordsModal';
import ModernCategoryModal from './ModernCategoryModal';
import { useGameVocabulary } from '../../../../hooks/useGameVocabulary';

type GameSettingsProps = {
  onStartGame: (settings: { 
    language: string; 
    topic: string; 
    difficulty: string;
    theme: string;
    customWords?: WordPair[];
  }) => void;
};

// Enhanced categories with emojis and descriptions
const ENHANCED_TOPICS = [
  { id: 'animals', name: 'Animals', emoji: '🐾', description: 'Pets, wildlife & creatures' },
  { id: 'colors', name: 'Colors', emoji: '🎨', description: 'Colors & shades' },
  { id: 'food', name: 'Food', emoji: '🍎', description: 'Meals, snacks & treats' },
  { id: 'countries', name: 'Countries', emoji: '🌎', description: 'Nations & places' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢', description: 'Counting & math' },
  { id: 'custom', name: 'Custom Words', emoji: '✏️', description: 'Your own vocabulary' },
];

// Enhanced languages with emojis and native names
const ENHANCED_LANGUAGES = [
  { id: 'english', name: 'English', emoji: '🇬🇧', native: 'English' },
  { id: 'spanish', name: 'Spanish', emoji: '🇪🇸', native: 'Español' },
  { id: 'french', name: 'French', emoji: '🇫🇷', native: 'Français' },
  { id: 'german', name: 'German', emoji: '🇩🇪', native: 'Deutsch' },
  { id: 'italian', name: 'Italian', emoji: '🇮🇹', native: 'Italiano' },
  { id: 'portuguese', name: 'Portuguese', emoji: '🇵🇹', native: 'Português' },
];

// Enhanced difficulties with descriptions
const ENHANCED_DIFFICULTIES = [
  { id: 'easy-1', name: 'Easy', emoji: '🟢', description: '3 pairs (3×2 grid)', pairs: 3 },
  { id: 'easy-2', name: 'Easy+', emoji: '🟡', description: '4 pairs (4×2 grid)', pairs: 4 },
  { id: 'medium-1', name: 'Medium', emoji: '🟠', description: '5 pairs (5×2 grid)', pairs: 5 },
  { id: 'medium-2', name: 'Medium+', emoji: '🔴', description: '6 pairs (4×3 grid)', pairs: 6 },
  { id: 'hard-2', name: 'Hard', emoji: '🟣', description: '8 pairs (4×4 grid)', pairs: 8 },
  { id: 'expert', name: 'Expert', emoji: '⚫', description: '10 pairs (5×4 grid)', pairs: 10 },
];

// Enhanced themes with descriptions
const ENHANCED_THEMES = [
  { id: 'Default', name: 'Classic', emoji: '🎯', description: 'Clean & simple' },
  { id: 'Spanish Theme', name: 'Spanish', emoji: '🇪🇸', description: 'Spanish vibes' },
  { id: 'French Theme', name: 'French', emoji: '🇫🇷', description: 'French elegance' },
  { id: 'Classroom', name: 'Classroom', emoji: '🏫', description: 'School setting' },
  { id: 'Forest', name: 'Forest', emoji: '🌲', description: 'Nature & trees' },
  { id: 'Temple', name: 'Temple', emoji: '🏛️', description: 'Ancient mystery' },
  { id: 'Cave', name: 'Cave', emoji: '🕳️', description: 'Underground adventure' },
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  // Category/Subcategory selection
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  
  // Other settings
  const [language, setLanguage] = useState(ENHANCED_LANGUAGES[1]); // Default to Spanish
  const [difficulty, setDifficulty] = useState(ENHANCED_DIFFICULTIES[0]);
  const [theme, setTheme] = useState(ENHANCED_THEMES[0]);
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  
  // Custom words state
  const [customWords, setCustomWords] = useState<WordPair[]>([]);

  // Fetch vocabulary based on category selection
  const { vocabulary, loading: vocabLoading, error: vocabError } = useGameVocabulary({
    language: language.id === 'spanish' ? 'es' : 'en',
    categoryId: selectedCategory,
    subcategoryId: selectedSubcategory,
    difficultyLevel: 'beginner',
    curriculumLevel: 'KS3',
    limit: 50,
    randomize: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      setShowCategoryModal(true);
      return;
    }

    // Convert vocabulary to WordPair format for the game
    const gameWords: WordPair[] = vocabulary.slice(0, difficulty.pairs).map((item, index) => ({
      id: item.id || `word-${index}`,
      term: item.word || '',
      translation: item.translation || '',
      type: 'word' as const
    }));

    onStartGame({ 
      language: language.id, 
      topic: selectedSubcategory || selectedCategory,
      difficulty: difficulty.id,
      theme: theme.name,
      customWords: gameWords
    });
  };

  const handleCustomWordsStart = (wordPairs: WordPair[]) => {
    setCustomWords(wordPairs);
    onStartGame({ 
      language: language.id, 
      topic: 'custom',
      difficulty: difficulty.id,
      theme: theme.name,
      customWords: wordPairs
    });
  };



  return (
    <motion.div
      className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        {/* Game Description */}
        <div className="text-center mb-8">
          <p className="text-white/80 text-lg">Test your memory and learn vocabulary!</p>
        </div>
        
        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Category Selector */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Topic</label>
            <motion.div
              onClick={() => setShowCategoryModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowCategoryModal(true);
                }
              }}
              className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">📚</div>
              <div className="font-medium text-xl">
                {selectedSubcategory ? selectedSubcategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                 selectedCategory ? selectedCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                 'Choose Topic'}
              </div>
              <div className="text-sm mt-1 opacity-75">
                {selectedCategory ? `${vocabulary.length} words available` : 'Vocabulary topics'}
              </div>
              <div className="text-xs mt-2 opacity-50">Click to change</div>
              {vocabLoading && (
                <div className="text-xs mt-1 opacity-75">Loading vocabulary...</div>
              )}
            </motion.div>
          </div>
          
          {/* Language Selector */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Language</label>
            <motion.div
              onClick={() => setShowLanguageModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowLanguageModal(true);
                }
              }}
              className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">{language.emoji}</div>
              <div className="font-medium text-xl">{language.name}</div>
              <div className="text-sm mt-1 opacity-75">{language.native}</div>
              <div className="text-xs mt-2 opacity-50">Click to change</div>
            </motion.div>
          </div>
          
          {/* Difficulty Selector */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Difficulty</label>
            <motion.div
              onClick={() => setShowDifficultyModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowDifficultyModal(true);
                }
              }}
              className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">{difficulty.emoji}</div>
              <div className="font-medium text-xl">{difficulty.name}</div>
              <div className="text-sm mt-1 opacity-75">{difficulty.description}</div>
              <div className="text-xs mt-2 opacity-50">Click to change</div>
            </motion.div>
          </div>
          
          {/* Theme Selector */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Theme</label>
            <motion.div
              onClick={() => setShowThemeModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowThemeModal(true);
                }
              }}
              className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">{theme.emoji}</div>
              <div className="font-medium text-xl">{theme.name}</div>
              <div className="text-sm mt-1 opacity-75">{theme.description}</div>
              <div className="text-xs mt-2 opacity-50">Click to change</div>
            </motion.div>
          </div>
          
        </div>
        
        {/* Vocabulary Status */}
        {selectedCategory && (
          <motion.div
            className="mb-6 p-4 bg-white/5 rounded-xl border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">
                📚 Ready to Practice: {selectedSubcategory ? selectedSubcategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : selectedCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <p className="text-sm text-white/80">
                {vocabLoading ? 'Loading vocabulary...' :
                 vocabError ? 'Error loading vocabulary' :
                 `${vocabulary.length} vocabulary words available`}
              </p>
              {vocabulary.length > 0 && (
                <p className="text-xs text-white/60 mt-1">
                  Game will use up to {difficulty.pairs} word pairs
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Start Button */}
        <div className="text-center">
          <motion.button
            type="submit"
            disabled={!selectedCategory || vocabulary.length === 0 || vocabLoading}
            className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-full text-xl transition-all shadow-xl hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {!selectedCategory ? '📚 Choose a Topic First' :
             vocabLoading ? '⏳ Loading...' :
             vocabulary.length === 0 ? '❌ No Vocabulary Available' :
             '🚀 Start Memory Game'}
          </motion.button>
          {!selectedCategory && (
            <p className="text-sm text-white/60 mt-2">Select a learning topic to begin</p>
          )}
        </div>
      </form>

      {/* Modern Category Selection Modal */}
      <ModernCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategorySelect={(categoryId: string, subcategoryId?: string) => {
          setSelectedCategory(categoryId);
          if (subcategoryId) {
            setSelectedSubcategory(subcategoryId);
          } else {
            setSelectedSubcategory('');
          }
        }}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
      />

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {ENHANCED_DIFFICULTIES.map((item) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => {
                      setDifficulty(item);
                      setShowDifficultyModal(false);
                    }}
                    className={`
                      cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                      ${difficulty.id === item.id 
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

      {/* Theme Selection Modal */}
      <AnimatePresence>
        {showThemeModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowThemeModal(false)}
          >
            <motion.div
              className="bg-white backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Choose Theme</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {ENHANCED_THEMES.map((item) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => {
                      setTheme(item);
                      setShowThemeModal(false);
                    }}
                    className={`
                      cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                      ${theme.id === item.id 
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
                  onClick={() => setShowThemeModal(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Words Modal */}
      <CustomWordsModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onStartGame={handleCustomWordsStart}
      />
    </motion.div>
  );
}
