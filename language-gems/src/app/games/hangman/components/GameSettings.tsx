'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ThemeSelector from './ThemeSelector';

type GameSettingsProps = {
  onStartGame?: (settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords: string[];
  }) => void;
  setupStage?: 'language' | 'category' | 'difficulty';
  onLanguageSelect?: (language: string) => void;
  onCategorySelect?: (category: string, customWords?: string[]) => void;
  onDifficultySelect?: (difficulty: string, theme: string) => void;
};

const difficulties = [
  { 
    id: 'beginner', 
    label: 'Beginner', 
    description: 'Shorter words, more time',
    icon: '🔰'
  },
  { 
    id: 'intermediate', 
    label: 'Intermediate', 
    description: 'Medium length words',
    icon: '🌟'
  },
  { 
    id: 'advanced', 
    label: 'Advanced', 
    description: 'Longer words, less time',
    icon: '⚡'
  },
  { 
    id: 'expert', 
    label: 'Expert', 
    description: 'Challenging words, tight time limit',
    icon: '🏆'
  },
];

const categories = [
  { id: 'animals', label: 'Animals', emoji: '🐾', bgColor: 'bg-blue-50' },
  { id: 'food', label: 'Food', emoji: '🍔', bgColor: 'bg-green-50' },
  { id: 'countries', label: 'Countries', emoji: '🌎', bgColor: 'bg-yellow-50' },
  { id: 'sports', label: 'Sports', emoji: '⚽', bgColor: 'bg-red-50' },
  { id: 'professions', label: 'Professions', emoji: '👨‍⚕️', bgColor: 'bg-purple-50' },
  { id: 'technology', label: 'Technology', emoji: '💻', bgColor: 'bg-indigo-50' },
  { id: 'music', label: 'Music', emoji: '🎵', bgColor: 'bg-pink-50' },
  { id: 'movies', label: 'Movies', emoji: '🎬', bgColor: 'bg-amber-50' },
  { id: 'clothing', label: 'Clothing', emoji: '👕', bgColor: 'bg-teal-50' },
  { id: 'nature', label: 'Nature', emoji: '🏞️', bgColor: 'bg-emerald-50' },
];

const languages = [
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸', bgColor: 'bg-red-50' },
  { id: 'french', label: 'French', flag: '🇫🇷', bgColor: 'bg-blue-50' },
  { id: 'german', label: 'German', flag: '🇩🇪', bgColor: 'bg-yellow-50' },
  { id: 'italian', label: 'Italian', flag: '🇮🇹', bgColor: 'bg-green-50' },
  { id: 'english', label: 'English', flag: '🇬🇧', bgColor: 'bg-blue-50' },
  { id: 'japanese', label: 'Japanese', flag: '🇯🇵', bgColor: 'bg-white' },
  { id: 'mandarin', label: 'Mandarin', flag: '🇨🇳', bgColor: 'bg-red-50' },
  { id: 'portuguese', label: 'Portuguese', flag: '🇵🇹', bgColor: 'bg-green-50' },
  { id: 'arabic', label: 'Arabic', flag: '🇸🇦', bgColor: 'bg-green-50' },
  { id: 'russian', label: 'Russian', flag: '🇷🇺', bgColor: 'bg-blue-50' },
];

export default function GameSettings({ 
  onStartGame, 
  setupStage = 'language', 
  onLanguageSelect, 
  onCategorySelect, 
  onDifficultySelect 
}: GameSettingsProps) {
  
  const [settings, setSettings] = useState({
    difficulty: 'beginner',
    category: 'animals',
    language: 'spanish',
    theme: 'default',
    customWords: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customWordsInput, setCustomWordsInput] = useState('');
  const [customWordsError, setCustomWordsError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThemeChange = (themeId: string) => {
    setSettings((prev) => ({
      ...prev,
      theme: themeId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // If we're using the legacy flow
    if (onStartGame) {
      onStartGame(settings);
    }
    
    setIsSubmitting(false);
  };
  
  const handleLanguageClick = (languageId: string) => {
    setSettings(prev => ({...prev, language: languageId}));
    if (onLanguageSelect) {
      onLanguageSelect(languageId);
    }
  };
  
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'custom') {
      // Show custom words input field, handled in the UI
      setSettings(prev => ({...prev, category: categoryId}));
    } else {
      setSettings(prev => ({...prev, category: categoryId}));
      if (onCategorySelect) {
        onCategorySelect(categoryId);
      }
    }
  };
  
  const handleCustomWordsSubmit = () => {
    // Parse and validate custom words
    const words = customWordsInput
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    if (words.length < 3) {
      setCustomWordsError('Please enter at least 3 words separated by commas');
      return;
    }
    
    setSettings(prev => ({...prev, customWords: words}));
    if (onCategorySelect) {
      onCategorySelect('custom', words);
    }
  };
  
  const handleDifficultyClick = (difficultyId: string) => {
    setSettings(prev => ({...prev, difficulty: difficultyId}));
    if (onDifficultySelect) {
      onDifficultySelect(difficultyId, settings.theme);
    }
  };

  // Render language selection screen
  if (setupStage === 'language') {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Language</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageClick(language.id)}
              className={`p-5 rounded-lg flex flex-col items-center justify-center ${language.bgColor} hover:bg-opacity-80 transition-all text-gray-800`}
            >
              <span className="text-4xl mb-2">{language.flag}</span>
              <span className="font-medium">{language.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // Render category selection screen
  if (setupStage === 'category') {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`p-5 rounded-lg flex flex-col items-center justify-center ${category.bgColor} hover:bg-opacity-80 transition-all ${settings.category === category.id ? 'ring-2 ring-purple-500' : ''} text-gray-800`}
            >
              <span className="text-4xl mb-2">{category.emoji}</span>
              <span className="font-medium">{category.label}</span>
            </button>
          ))}
        </div>
        
        {settings.category === 'custom' && (
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter your custom words (comma separated)
            </label>
            <textarea
              value={customWordsInput}
              onChange={(e) => setCustomWordsInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              placeholder="apple, banana, orange, book, computer..."
            />
            {customWordsError && (
              <p className="text-red-500 text-xs italic mt-1">{customWordsError}</p>
            )}
            <button 
              onClick={handleCustomWordsSubmit}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // Render difficulty selection screen
  if (setupStage === 'difficulty') {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Difficulty</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => handleDifficultyClick(difficulty.id)}
              className={`p-5 rounded-lg border-2 ${
                settings.difficulty === difficulty.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{difficulty.icon}</span>
                <div>
                  <div className="font-medium text-left text-gray-800">{difficulty.label}</div>
                  <div className="text-sm text-gray-600 text-left">{difficulty.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-gray-700">Choose Theme</h3>
          <ThemeSelector selectedTheme={settings.theme} onThemeChange={handleThemeChange} />
        </div>
      </div>
    );
  }
  
  // Legacy full settings form (if setupStage is not provided)
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Game Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Language</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {languages.map((language) => (
              <label
                key={language.id}
                className={`group cursor-pointer ${language.bgColor} p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                  settings.language === language.id
                    ? 'ring-2 ring-purple-500'
                    : 'hover:ring-2 hover:ring-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value={language.id}
                  checked={settings.language === language.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-4xl mb-2">{language.flag}</span>
                <span className="font-medium text-gray-800">{language.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <label
                key={category.id}
                className={`group cursor-pointer ${category.bgColor} p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                  settings.category === category.id
                    ? 'ring-2 ring-purple-500'
                    : 'hover:ring-2 hover:ring-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={settings.category === category.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-4xl mb-2">{category.emoji}</span>
                <span className="font-medium text-gray-800">{category.label}</span>
              </label>
            ))}
          </div>
          
          {settings.category === 'custom' && (
            <div className="mt-4">
              <textarea
                value={customWordsInput}
                onChange={(e) => setCustomWordsInput(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                placeholder="Enter your custom words, separated by commas (e.g., apple, banana, orange)"
              />
              {customWordsError && (
                <p className="text-red-500 text-xs italic mt-1">{customWordsError}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Difficulty</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {difficulties.map((difficulty) => (
              <label
                key={difficulty.id}
                className={`group cursor-pointer border-2 p-4 rounded-lg transition-all ${
                  settings.difficulty === difficulty.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty.id}
                  checked={settings.difficulty === difficulty.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{difficulty.icon}</span>
                  <div>
                    <div className="font-medium text-left text-gray-800">{difficulty.label}</div>
                    <div className="text-sm text-gray-600 text-left">{difficulty.description}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Theme</h3>
          <ThemeSelector selectedTheme={settings.theme} onThemeChange={handleThemeChange} />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Starting Game...' : 'Start Game'}
        </button>
      </form>
    </div>
  );
} 