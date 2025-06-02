'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WordGuesserSettings } from '../types';

interface GameSettingsProps {
  onStartGame: (settings: WordGuesserSettings) => void;
}

// Available languages
const languages = [
  { id: 'english', name: 'English', flag: '🇬🇧' },
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'french', name: 'French', flag: '🇫🇷' },
  { id: 'german', name: 'German', flag: '🇩🇪' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹' },
  { id: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
  { id: 'japanese', name: 'Japanese', flag: '🇯🇵' },
  { id: 'mandarin', name: 'Mandarin', flag: '🇨🇳' },
  { id: 'russian', name: 'Russian', flag: '🇷🇺' },
  { id: 'arabic', name: 'Arabic', flag: '🇦🇪' },
];

// Categories for word selection
const categories = [
  { id: 'animals', name: 'Animals' },
  { id: 'food', name: 'Food' },
  { id: 'colors', name: 'Colors' },
  { id: 'numbers', name: 'Numbers' },
  { id: 'family', name: 'Family' },
  { id: 'countries', name: 'Countries' },
  { id: 'bodyparts', name: 'Body Parts' },
  { id: 'household', name: 'Household Items' },
  { id: 'professions', name: 'Professions' },
  { id: 'verbs', name: 'Common Verbs' },
  { id: 'adjectives', name: 'Adjectives' },
];

// Difficulty levels
const difficulties = [
  { id: 'beginner', name: 'Beginner', description: 'Short words (3-4 letters)' },
  { id: 'intermediate', name: 'Intermediate', description: 'Medium words (5-6 letters)' },
  { id: 'advanced', name: 'Advanced', description: 'Longer words (7+ letters)' },
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  const [currentStep, setCurrentStep] = useState<'language' | 'category' | 'difficulty'>('language');
  const [settings, setSettings] = useState<WordGuesserSettings>({
    language: 'english',
    category: 'animals',
    difficulty: 'beginner',
    maxAttempts: 6,
  });
  
  // Step navigation
  const goToNextStep = () => {
    if (currentStep === 'language') {
      setCurrentStep('category');
    } else if (currentStep === 'category') {
      setCurrentStep('difficulty');
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep === 'category') {
      setCurrentStep('language');
    } else if (currentStep === 'difficulty') {
      setCurrentStep('category');
    }
  };
  
  // Handle selections
  const selectLanguage = (languageId: string) => {
    setSettings({ ...settings, language: languageId });
  };
  
  const selectCategory = (categoryId: string) => {
    setSettings({ ...settings, category: categoryId });
  };
  
  const selectDifficulty = (difficultyId: string) => {
    const maxAttempts = difficultyId === 'beginner' ? 7 : 
                        difficultyId === 'intermediate' ? 6 : 5;
                        
    setSettings({ ...settings, difficulty: difficultyId, maxAttempts });
  };
  
  // Start the game with current settings
  const handleStartGame = () => {
    onStartGame(settings);
  };
  
  // Check if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 'language') {
      return !!settings.language;
    } else if (currentStep === 'category') {
      return !!settings.category;
    } else if (currentStep === 'difficulty') {
      return !!settings.difficulty;
    }
    return false;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white flex items-center">
          <span className="inline-block mr-2">🌍</span>
          Select Language
        </h2>
        <div className="language-select-container">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className={`language-option ${settings.language === lang.id ? 'selected' : ''}`}
              onClick={() => selectLanguage(lang.id)}
            >
              <div className="language-flag">{lang.flag}</div>
              <div className="text-gray-700 dark:text-gray-200">{lang.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white flex items-center">
          <span className="inline-block mr-2">🔠</span>
          Choose Category
        </h2>
        <div className="category-select-container">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-option ${settings.category === cat.id ? 'selected' : ''}`}
              onClick={() => selectCategory(cat.id)}
            >
              <div className="text-gray-700 dark:text-gray-200">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white flex items-center">
          <span className="inline-block mr-2">🏆</span>
          Set Difficulty
        </h2>
        <div className="difficulty-select-container">
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              className={`difficulty-option ${settings.difficulty === diff.id ? 'selected' : ''}`}
              onClick={() => selectDifficulty(diff.id)}
            >
              <div className="text-gray-700 dark:text-gray-200 font-semibold">{diff.name}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">{diff.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleStartGame}
        className="w-full py-3 px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
      >
        <span className="mr-2">🎮</span>
        Start Game
      </button>
      
      <div className="flex justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-md text-center">
          Words are selected based on your language, category, and difficulty choices. Good luck!
        </p>
      </div>
    </div>
  );
} 