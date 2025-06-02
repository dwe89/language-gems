'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type GameSettingsProps = {
  onStartGame?: (settings: {
    difficulty: string;
    language: string;
    tense: string;
    theme: string;
  }) => void;
  setupStage?: 'language' | 'difficulty' | 'tense';
  onLanguageSelect?: (language: string) => void;
  onDifficultySelect?: (difficulty: string) => void;
  onTenseSelect?: (tense: string, theme: string) => void;
};

const difficulties = [
  { 
    id: 'beginner', 
    label: 'Beginner', 
    description: 'Simple present tense conjugations',
    icon: '🔰'
  },
  { 
    id: 'intermediate', 
    label: 'Intermediate', 
    description: 'More complex tenses, shorter time',
    icon: '🌟'
  },
  { 
    id: 'advanced', 
    label: 'Advanced', 
    description: 'All tenses, irregular verbs, tight time limit',
    icon: '⚡'
  }
];

const tenses = [
  { id: 'present', label: 'Present Tense', icon: '⏰', bgColor: 'bg-blue-50', description: 'Conjugate verbs in the present tense' },
  { id: 'past', label: 'Past Tense', icon: '⏮️', bgColor: 'bg-amber-50', description: 'Conjugate verbs in the past tense' },
  { id: 'future', label: 'Future Tense', icon: '⏭️', bgColor: 'bg-green-50', description: 'Conjugate verbs in the future tense' },
  { id: 'conditional', label: 'Conditional', icon: '🤔', bgColor: 'bg-purple-50', description: 'Conjugate verbs in the conditional tense' },
  { id: 'imperative', label: 'Imperative', icon: '📢', bgColor: 'bg-red-50', description: 'Conjugate verbs in the imperative mood' },
  { id: 'mixed', label: 'Mixed Tenses', icon: '🔄', bgColor: 'bg-indigo-50', description: 'Test your skills with a mix of different tenses' },
];

const languages = [
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸', bgColor: 'bg-red-50' },
  { id: 'french', label: 'French', flag: '🇫🇷', bgColor: 'bg-blue-50' },
  { id: 'english', label: 'English', flag: '🇬🇧', bgColor: 'bg-blue-50' },
];

const themes = [
  { 
    id: 'default', 
    label: 'Classic', 
    description: 'Traditional ladder game look',
    icon: '🎮'
  },
  { 
    id: 'space', 
    label: 'Space Adventure', 
    description: 'Navigate through space with an astronaut',
    icon: '🚀'
  },
  { 
    id: 'ocean', 
    label: 'Ocean Deep', 
    description: 'Explore underwater depths with a diver',
    icon: '🌊'
  },
  { 
    id: 'mountain', 
    label: 'Mountain Climb', 
    description: 'Scale a mountain peak with a climber',
    icon: '🏔️'
  },
];

export default function GameSettings({ 
  onStartGame, 
  setupStage = 'language', 
  onLanguageSelect, 
  onDifficultySelect, 
  onTenseSelect 
}: GameSettingsProps) {
  
  const [settings, setSettings] = useState({
    difficulty: 'beginner',
    language: 'spanish',
    tense: 'present',
    theme: 'default',
  });
  
  const [selectedTheme, setSelectedTheme] = useState('default');
  
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onStartGame) {
      onStartGame({
        ...settings,
        theme: selectedTheme
      });
    }
  };

  const handleLanguageClick = (languageId: string) => {
    setSettings(prev => ({ ...prev, language: languageId }));
    if (onLanguageSelect) {
      onLanguageSelect(languageId);
    }
  };

  const handleDifficultyClick = (difficultyId: string) => {
    setSettings(prev => ({ ...prev, difficulty: difficultyId }));
    if (onDifficultySelect) {
      onDifficultySelect(difficultyId);
    }
  };

  const handleTenseClick = (tenseId: string) => {
    setSettings(prev => ({ ...prev, tense: tenseId }));
    if (onTenseSelect) {
      onTenseSelect(tenseId, selectedTheme);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Verb Adventure Settings</h2>
      
      {setupStage === 'language' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-xl font-semibold mb-4">Select a Language</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {languages.map((language) => (
              <div
                key={language.id}
                className={`${language.bgColor} p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer transition-transform hover:scale-105 ${
                  settings.language === language.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleLanguageClick(language.id)}
              >
                <div className="text-5xl mb-2">{language.flag}</div>
                <h4 className="text-lg font-medium">{language.label}</h4>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {setupStage === 'difficulty' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-xl font-semibold mb-4">Select Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {difficulties.map((difficulty) => (
              <div
                key={difficulty.id}
                className={`bg-white border border-gray-200 p-4 rounded-lg shadow-md cursor-pointer transition-all ${
                  settings.difficulty === difficulty.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleDifficultyClick(difficulty.id)}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{difficulty.icon}</span>
                  <h4 className="text-lg font-medium">{difficulty.label}</h4>
                </div>
                <p className="text-sm text-gray-600">{difficulty.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {setupStage === 'tense' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">Select Tense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {tenses.map((tense) => (
              <div
                key={tense.id}
                className={`${tense.bgColor} p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 ${
                  settings.tense === tense.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleTenseClick(tense.id)}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{tense.icon}</span>
                  <h4 className="text-lg font-medium">{tense.label}</h4>
                </div>
                <p className="text-sm">{tense.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Select a Theme</h3>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`cursor-pointer transition-all ${
                    selectedTheme === theme.id
                      ? 'theme-selected'
                      : ''
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <div className={`theme-card theme-${theme.id}`}>
                    <div className="theme-preview-icon">
                      {theme.id === 'default' && <span className="text-4xl">{theme.icon}</span>}
                      {theme.id === 'space' && <img src="/images/verb-ladder/space/astronaut.svg" alt="" width="40" height="40" />}
                      {theme.id === 'ocean' && <img src="/images/verb-ladder/ocean/diver.svg" alt="" width="40" height="40" />}
                      {theme.id === 'mountain' && <img src="/images/verb-ladder/mountain/climber.svg" alt="" width="40" height="40" />}
                    </div>
                    <div className="theme-title">{theme.label}</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              onClick={() => handleTenseClick(settings.tense)}
            >
              Start Game
            </button>
          </div>
        </motion.div>
      )}

      {/* Manual mode if setupStage prop is not provided */}
      {!setupStage && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={settings.difficulty}
                onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              >
                {difficulties.map((diff) => (
                  <option key={diff.id} value={diff.id}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tense</label>
              <select
                name="tense"
                value={settings.tense}
                onChange={(e) => setSettings({ ...settings, tense: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              >
                {tenses.map((tense) => (
                  <option key={tense.id} value={tense.id}>
                    {tense.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`cursor-pointer transition-all ${
                      selectedTheme === theme.id
                        ? 'theme-selected'
                        : ''
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className={`theme-card theme-${theme.id}`}>
                      <div className="theme-preview-icon">
                        {theme.id === 'default' && <span className="text-4xl">{theme.icon}</span>}
                        {theme.id === 'space' && <img src="/images/verb-ladder/space/astronaut.svg" alt="" width="40" height="40" />}
                        {theme.id === 'ocean' && <img src="/images/verb-ladder/ocean/diver.svg" alt="" width="40" height="40" />}
                        {theme.id === 'mountain' && <img src="/images/verb-ladder/mountain/climber.svg" alt="" width="40" height="40" />}
                      </div>
                      <div className="theme-title">{theme.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
} 