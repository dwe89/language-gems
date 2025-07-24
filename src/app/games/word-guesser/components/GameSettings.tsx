'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WordGuesserSettings } from '../types';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';
import { useVocabularyByCategory } from '../../../../hooks/useVocabulary';

interface GameSettingsProps {
  onStartGame: (settings: WordGuesserSettings & {
    selectedCategory: string;
    selectedSubcategory: string | null;
    theme: string;
  }) => void;
}

// Available languages
const languages = [
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸', code: 'es' },
  { id: 'french', name: 'French', flag: '🇫🇷', code: 'fr' },
  { id: 'german', name: 'German', flag: '🇩🇪', code: 'de' },
];

// Themes
const themes = [
  { id: 'forest', name: 'Forest', icon: '🌲', description: 'Natural forest theme' },
  { id: 'tokyo', name: 'Tokyo Nights', icon: '🏙️', description: 'Neon cyberpunk vibes' },
  { id: 'neon', name: 'Neon Glow', icon: '✨', description: 'Electric neon aesthetic' },
  { id: 'space', name: 'Space Explorer', icon: '🚀', description: 'Cosmic adventure' },
];

// Difficulty levels
const difficulties = [
  { id: 'beginner', name: 'Beginner', description: 'Short words (3-4 letters)' },
  { id: 'intermediate', name: 'Intermediate', description: 'Medium words (5-6 letters)' },
  { id: 'advanced', name: 'Advanced', description: 'Longer words (7+ letters)' },
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  const [currentStep, setCurrentStep] = useState<'theme' | 'language' | 'category' | 'difficulty'>('theme');
  const [settings, setSettings] = useState<WordGuesserSettings>({
    language: 'spanish',
    category: 'animals',
    difficulty: 'beginner',
    maxAttempts: 6,
  });
  const [selectedTheme, setSelectedTheme] = useState('tokyo');
  const [selectedCategory, setSelectedCategory] = useState('basics_core_language');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Map language for vocabulary loading
  const mapLanguageForVocab = (lang: string) => {
    const langObj = languages.find(l => l.id === lang);
    return langObj?.code || 'es';
  };

  // Load vocabulary using the category system
  const { vocabulary, loading: vocabularyLoading } = useVocabularyByCategory({
    language: mapLanguageForVocab(settings.language),
    categoryId: selectedCategory,
    subcategoryId: selectedSubcategory,
    difficultyLevel: settings.difficulty,
    curriculumLevel: 'KS3'
  });
  
  // Step navigation
  const goToNextStep = () => {
    if (currentStep === 'theme') {
      setCurrentStep('language');
    } else if (currentStep === 'language') {
      setCurrentStep('category');
    } else if (currentStep === 'category') {
      setCurrentStep('difficulty');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'language') {
      setCurrentStep('theme');
    } else if (currentStep === 'category') {
      setCurrentStep('language');
    } else if (currentStep === 'difficulty') {
      setCurrentStep('category');
    }
  };
  
  // Handle selections
  const selectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const selectLanguage = (languageId: string) => {
    setSettings({ ...settings, language: languageId });
  };

  const handleCategorySelect = (categoryId: string, subcategoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setShowCategoryModal(false);
  };

  const selectDifficulty = (difficultyId: string) => {
    const maxAttempts = difficultyId === 'beginner' ? 7 :
                        difficultyId === 'intermediate' ? 6 : 5;

    setSettings({ ...settings, difficulty: difficultyId, maxAttempts });
  };

  // Start the game with current settings
  const handleStartGame = () => {
    onStartGame({
      ...settings,
      selectedCategory,
      selectedSubcategory,
      theme: selectedTheme
    });
  };
  
  // Check if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 'theme') {
      return !!selectedTheme;
    } else if (currentStep === 'language') {
      return !!settings.language;
    } else if (currentStep === 'category') {
      return !!selectedCategory;
    } else if (currentStep === 'difficulty') {
      return !!settings.difficulty;
    }
    return false;
  };

  // Get category display name
  const getCategoryDisplayName = () => {
    const category = VOCABULARY_CATEGORIES.find(cat => cat.id === selectedCategory);
    const subcategory = category?.subcategories.find(sub => sub.id === selectedSubcategory);
    return subcategory ? `${category?.displayName} - ${subcategory.displayName}` : category?.displayName || 'Select Category';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-center space-x-4 mb-4">
          {['theme', 'language', 'category', 'difficulty'].map((step, index) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === step
                  ? 'bg-blue-600 text-white'
                  : index < ['theme', 'language', 'category', 'difficulty'].indexOf(currentStep)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="text-center text-gray-600 dark:text-gray-300 capitalize">
          Step {['theme', 'language', 'category', 'difficulty'].indexOf(currentStep) + 1}: {currentStep}
        </div>
      </div>

      {/* Theme Selection */}
      {currentStep === 'theme' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Choose Your Theme</h2>
            <p className="text-gray-600 dark:text-gray-300">Select the visual style for your word guessing adventure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => selectTheme(theme.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-4xl mb-3">{theme.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{theme.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{theme.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Language Selection */}
      {currentStep === 'language' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Select Language</h2>
            <p className="text-gray-600 dark:text-gray-300">Choose the language you want to practice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map((lang) => (
              <motion.button
                key={lang.id}
                onClick={() => selectLanguage(lang.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  settings.language === lang.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-4xl mb-3">{lang.flag}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{lang.name}</h3>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Selection */}
      {currentStep === 'category' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Choose Category</h2>
            <p className="text-gray-600 dark:text-gray-300">Select the vocabulary topic you want to practice</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="w-full p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all bg-white dark:bg-gray-800"
            >
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{getCategoryDisplayName()}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Click to change category</p>
            </button>
          </div>
        </motion.div>
      )}

      {/* Difficulty Selection */}
      {currentStep === 'difficulty' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Set Difficulty</h2>
            <p className="text-gray-600 dark:text-gray-300">Choose your challenge level</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.id}
                onClick={() => selectDifficulty(diff.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  settings.difficulty === diff.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{diff.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{diff.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 'theme'}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {currentStep === 'difficulty' ? (
          <button
            onClick={handleStartGame}
            disabled={vocabularyLoading || !canProceed()}
            className="flex items-center space-x-2 px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold transition-colors"
          >
            <span>🎮</span>
            <span>{vocabularyLoading ? 'Loading...' : 'Start Game'}</span>
          </button>
        ) : (
          <button
            onClick={goToNextStep}
            disabled={!canProceed()}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Select Category</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VOCABULARY_CATEGORIES.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <button
                      onClick={() => {
                        if (category.subcategories.length === 0) {
                          handleCategorySelect(category.id, null);
                        }
                      }}
                      className="w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-bold text-gray-800 dark:text-white">{category.displayName}</h4>
                      {category.subcategories.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">{category.subcategories.length} topics</p>
                      )}
                    </button>

                    {category.subcategories.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => handleCategorySelect(category.id, subcategory.id)}
                            className="w-full p-2 text-left text-sm rounded border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            {subcategory.displayName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}