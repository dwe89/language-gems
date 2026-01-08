'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ThemeSelector from './ThemeSelector';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';
import { useAudio } from '../hooks/useAudio';

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  category?: string;
  subcategory?: string;
}

type GameSettingsProps = {
  onStartGame: (settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords: string[];
    subcategory?: string;
  }) => void;
  onStart?: (settings: {
    selectedCategory: string;
    selectedSubcategory: string;
    selectedLanguage: string;
    customWords?: string[];
    theme: string;
  }) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange?: (category: string) => void;
  onSubcategoryChange?: (subcategory: string) => void;
  categoryVocabulary?: VocabularyItem[];
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
  vocabularyLoading?: boolean;
  inModal?: boolean; // New prop to indicate modal context
};

// Helper function to get category display name from ModernCategorySelector
const getCategoryById = (id: string) => {
  const category = VOCABULARY_CATEGORIES.find(cat => cat.id === id);
  return category || { displayName: id };
};



// Enhanced languages with emojis and native names
const ENHANCED_LANGUAGES = [
  { id: 'spanish', name: 'Spanish', emoji: '🇪🇸', native: 'Español' },
  { id: 'french', name: 'French', emoji: '🇫🇷', native: 'Français' },
  { id: 'german', name: 'German', emoji: '🇩🇪', native: 'Deutsch' },
];

export default function GameSettings({
  onStartGame,
  onStart,
  onLanguageChange,
  selectedLanguage,
  vocabularyLoading,
  categoryVocabulary,
  onCategoryChange,
  onSubcategoryChange,
  inModal = false
}: GameSettingsProps) {
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);

  const [selectedCategory, setSelectedCategory] = useState(VOCABULARY_CATEGORIES[0]?.id || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [customWords, setCustomWords] = useState('');
  const [mode, setMode] = useState<'categories' | 'custom'>('categories');
  const [theme, setTheme] = useState('default');
  const [language, setLanguage] = useState(ENHANCED_LANGUAGES[0]);

    // Modal states
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [categoryView, setCategoryView] = useState<'categories' | 'subcategories'>('categories');
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<any>(null);

  useEffect(() => {
    const currentLanguage = ENHANCED_LANGUAGES.find(lang => lang.id === selectedLanguage) || ENHANCED_LANGUAGES[0];
    setLanguage(currentLanguage);
  }, [selectedLanguage]);

  // Initialize with default category
  useEffect(() => {
    if (selectedCategory && onCategoryChange) {
      onCategoryChange(selectedCategory);
    }
  }, [selectedCategory, onCategoryChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('GameSettings handleSubmit - Current state:', {
      mode,
      selectedCategory,
      selectedSubcategory,
      difficulty: 'beginner', // Default difficulty
      language: language.id,
      theme,
      customWords: customWords.trim()
    });

    if (mode === 'custom' && customWords.trim()) {
      const words = customWords.split('\n').filter(word => word.trim());
      const settings = {
        difficulty: 'beginner', // Default difficulty
        category: selectedCategory,
        language: language.id,
        theme,
        customWords: words,
        subcategory: selectedSubcategory
      };
      console.log('Calling onStartGame with custom settings:', settings);
      onStartGame?.(settings);
    } else if (mode === 'categories' && selectedCategory) {
      const settings = {
        difficulty: 'beginner', // Default difficulty
        category: selectedCategory,
        language: language.id,
        theme,
        customWords: [],
        subcategory: selectedSubcategory
      };
      console.log('Calling onStartGame with category settings:', settings);
      onStartGame?.(settings);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    console.log('handleSubcategoryChange called with:', subcategory);
    setSelectedSubcategory(subcategory);
    onSubcategoryChange?.(subcategory);
    console.log('selectedSubcategory should now be:', subcategory);
  };

  return (
    <div className="w-full">
      {!inModal && (
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
            <div className="grid lg:grid-cols-3 gap-8 mb-8">

              {/* Category - Modal Selector */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">Category</label>
                <motion.div
                  onClick={() => {
                    playSFX('button-click');
                    setCategoryView('categories');
                    setSelectedCategoryForModal(null);
                    setShowCategorySelector(true);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      playSFX('button-click');
                      setCategoryView('categories');
                      setSelectedCategoryForModal(null);
                      setShowCategorySelector(true);
                    }
                  }}
                  className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-4xl mb-2">📚</div>
                  <div className="font-medium text-xl">
                    {selectedCategory ?
                      getCategoryById(selectedCategory)?.displayName || selectedCategory :
                      'Select Category'
                    }
                  </div>
                  <div className="text-sm mt-1 opacity-75">
                    {selectedSubcategory || 'Choose your topic'}
                  </div>
                  <div className="text-xs mt-2 opacity-50">Click to change</div>
                </motion.div>
              </div>

              {/* Custom Mode - Modal Selector */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">Custom Mode</label>
                <motion.div
                  onClick={() => {
                    playSFX('button-click');
                    setMode(mode === 'custom' ? 'categories' : 'custom');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      playSFX('button-click');
                      setMode(mode === 'custom' ? 'categories' : 'custom');
                    }
                  }}
                  className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-4xl mb-2">✏️</div>
                  <div className="font-medium text-xl">{mode === 'custom' ? 'Custom Words' : 'Use Categories'}</div>
                  <div className="text-sm mt-1 opacity-75">{mode === 'custom' ? 'Your own words' : 'Vocabulary topics'}</div>
                  <div className="text-xs mt-2 opacity-50">Click to change</div>
                </motion.div>
              </div>

              {/* Language - Modal Selector */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">Language</label>
                <motion.div
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



            </div>

            {/* Custom Words Input */}
            {mode === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-white/5 rounded-xl border border-white/20"
              >
                <label className="block text-lg font-medium text-white mb-4">
                  Enter Your Custom Words
                </label>
                <textarea
                  value={customWords}
                  onChange={(e) => setCustomWords(e.target.value)}
                  className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-white/40 focus:border-white/60"
                  placeholder="Enter your words here...&#10;One word per line&#10;Examples:&#10;gato&#10;perro&#10;casa"
                />
                <p className="text-sm text-white/70 mt-2">
                  Enter one word per line. You can include spaces for phrases.
                </p>
              </motion.div>
            )}

            {/* Start Button */}
            <div className="text-center">
              <motion.button
                type="submit"
                disabled={vocabularyLoading || (mode === 'categories' && !selectedCategory) || (mode === 'custom' && !customWords.trim())}
                className="px-12 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-full text-xl transition-all shadow-xl hover:shadow-2xl disabled:cursor-not-allowed"
                onClick={() => {
                  playSFX('button-click');
                  console.log('Start button clicked!', {
                    mode,
                    selectedCategory,
                    selectedSubcategory,
                    customWords: customWords.trim(),
                    vocabularyLoading,
                    disabled: vocabularyLoading || (mode === 'categories' && !selectedCategory) || (mode === 'custom' && !customWords.trim())
                  });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                🚀 Start Adventure
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Show simplified version for modal */}
      {inModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl text-white"
        >      
          <form onSubmit={handleSubmit} className="text-white">
            {/* Theme Selector - Full Width */}
            <div className="mb-8">
              <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />
            </div>
            
            {/* Settings Grid - Modal-based Selection */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              
              {/* Category - Modal Selector */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">Category</label>
                <div
                  onClick={() => {
                    playSFX('button-click');
                    setCategoryView('categories');
                    setSelectedCategoryForModal(null);
                    setShowCategorySelector(true);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setCategoryView('categories');
                      setSelectedCategoryForModal(null);
                      setShowCategorySelector(true);
                    }
                  }}
                  className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all transform hover:scale-105 bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
                >
                  <div className="text-4xl mb-2">📚</div>
                  <div className="font-medium text-xl">
                    {selectedCategory ?
                      getCategoryById(selectedCategory)?.displayName || selectedCategory :
                      'Select Category'
                    }
                  </div>
                  <div className="text-sm mt-1 opacity-75">
                    {selectedSubcategory || 'Choose your topic'}
                  </div>
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
                className="px-12 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold rounded-full text-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 hover:y-1"
              >
                🚀 Start Adventure
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Category Selection Modal */}
      <AnimatePresence>
        {showCategorySelector && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCategorySelector(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl text-white max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {categoryView === 'categories' ? (
                <>
                  <h2 className="text-3xl font-bold text-center mb-8">Choose Learning Category</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {VOCABULARY_CATEGORIES.map((item) => (
                      <motion.div
                        key={item.id}
                        onClick={() => {
                          playSFX('button-click');
                          if (item.subcategories.length > 0) {
                            setSelectedCategoryForModal(item);
                            setCategoryView('subcategories');
                          } else {
                            handleCategoryChange(item.id);
                            handleSubcategoryChange('');
                            setShowCategorySelector(false);
                          }
                        }}
                        className={`
                          cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                          ${selectedCategory === item.id
                            ? 'bg-white/25 border-white/60 text-white shadow-lg ring-2 ring-white/40'
                            : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40'}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <div className="font-medium text-sm">{item.displayName}</div>
                        <div className="text-xs mt-1 opacity-75">{item.subcategories.length} topics</div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() => {
                        playSFX('button-click');
                        setCategoryView('categories');
                      }}
                      className="flex items-center text-white/80 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Categories
                    </button>
                    <h2 className="text-3xl font-bold text-center">Choose Topic</h2>
                    <div className="w-24"></div>
                  </div>

                  {selectedCategoryForModal && (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-2">{selectedCategoryForModal.icon}</div>
                        <h3 className="text-xl font-semibold">{selectedCategoryForModal.displayName}</h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {selectedCategoryForModal.subcategories.map((subcategory: any) => (
                          <motion.div
                            key={subcategory.id}
                            onClick={() => {
                              playSFX('button-click');
                              handleCategoryChange(selectedCategoryForModal.id);
                              handleSubcategoryChange(subcategory.id);
                              setShowCategorySelector(false);
                              setCategoryView('categories');
                              setSelectedCategoryForModal(null);
                            }}
                            className={`
                              cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                              ${selectedSubcategory === subcategory.id
                                ? 'bg-white/25 border-white/60 text-white shadow-lg ring-2 ring-white/40'
                                : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40'}
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="font-medium text-sm">{subcategory.displayName}</div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    playSFX('button-click');
                    setShowCategorySelector(false);
                    setCategoryView('categories');
                    setSelectedCategoryForModal(null);
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
                {ENHANCED_LANGUAGES.map((lang) => (
                  <motion.div
                    key={lang.id}
                    onClick={() => {
                      playSFX('button-click');
                      setLanguage(lang);
                      onLanguageChange?.(lang.id);
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


    </div>
  );
}