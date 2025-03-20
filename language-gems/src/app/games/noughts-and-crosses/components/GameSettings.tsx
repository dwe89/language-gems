'use client';

import { useState } from 'react';

type GameSettingsProps = {
  onStartGame: (settings: {
    difficulty: string;
    category: string;
    language: string;
  }) => void;
};

const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', description: 'Easier vocabulary words and simpler AI opponent' },
  { id: 'intermediate', label: 'Intermediate', description: 'Medium difficulty vocabulary and smarter AI' },
  { id: 'advanced', label: 'Advanced', description: 'Challenging vocabulary and strategic AI opponent' }
];

const CATEGORIES = [
  { id: 'animals', label: 'Animals', emoji: '🐱' },
  { id: 'food', label: 'Food', emoji: '🍎' },
  { id: 'colors', label: 'Colors', emoji: '🎨' },
  { id: 'places', label: 'Places', emoji: '🏠' }
];

const LANGUAGES = [
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'french', label: 'French', flag: '🇫🇷' },
  { id: 'german', label: 'German', flag: '🇩🇪' },
  { id: 'italian', label: 'Italian', flag: '🇮🇹' }
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  const [settings, setSettings] = useState({
    difficulty: 'beginner',
    category: 'animals',
    language: 'spanish'
  });
  
  const handleDifficultyChange = (difficulty: string) => {
    setSettings({ ...settings, difficulty });
  };
  
  const handleCategoryChange = (category: string) => {
    setSettings({ ...settings, category });
  };
  
  const handleLanguageChange = (language: string) => {
    setSettings({ ...settings, language });
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Game Settings</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Difficulty</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => handleDifficultyChange(difficulty.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.difficulty === difficulty.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="font-medium mb-1">{difficulty.label}</div>
              <div className="text-sm text-gray-600">{difficulty.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Word Category</h3>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.category === category.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="text-2xl mb-2">{category.emoji}</div>
              <div className="font-medium">{category.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LANGUAGES.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageChange(language.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.language === language.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="text-2xl mb-2">{language.flag}</div>
              <div className="font-medium">{language.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => onStartGame(settings)}
        className="w-full py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
      >
        Start Game
      </button>
    </div>
  );
} 