'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
// // Create a simple theme selector component inline
const THEME_OPTIONS = [
  { id: 'default', name: 'Classic', icon: '🎮', accentColor: 'bg-blue-500' },
  { id: 'tokyo', name: 'Tokyo Nights', icon: '🏙️', accentColor: 'bg-pink-600' },
  { id: 'pirate', name: 'Pirate Adventure', icon: '🏴‍☠️', accentColor: 'bg-amber-600' },
  { id: 'space', name: 'Space Explorer', icon: '🚀', accentColor: 'bg-purple-600' },
  { id: 'temple', name: 'Lava Temple', icon: '🌋', accentColor: 'bg-orange-600' }
];

const ThemeSelector = ({ selectedTheme, onThemeChange }: { selectedTheme: string; onThemeChange: (theme: string) => void }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-white mb-4 text-center">Choose Your Adventure Theme</h3>
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {THEME_OPTIONS.map((theme) => (
        <motion.button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-xl border-2 transition-all text-center ${
            selectedTheme === theme.id
              ? `${theme.accentColor} border-white text-white shadow-lg`
              : 'bg-white/10 border-white/40 hover:bg-white/20 hover:border-white/60 text-white'
          }`}
        >
          <div className="text-3xl mb-2">{theme.icon}</div>
          <div className="font-semibold text-sm">{theme.name}</div>
        </motion.button>
      ))}
    </div>
  </div>
);
import { useAudio } from '../../noughts-and-crosses/hooks/useAudio';
import { VocabBlastGameSettings } from '../page';
import CategorySelector from '../../../../components/games/CategorySelector';

const ENHANCED_LANGUAGES = [
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { id: 'french', name: 'French', flag: '🇫🇷', native: 'Français' },
  { id: 'german', name: 'German', flag: '🇩🇪', native: 'Deutsch' }
];

interface VocabBlastSettingsProps {
  currentSettings: VocabBlastGameSettings;
  onStartGame: (settings: VocabBlastGameSettings) => void;
  onBackToMenu: () => void;
}

const DIFFICULTY_OPTIONS = [
  { id: 'beginner', name: 'Beginner', description: 'Easy words, more time' },
  { id: 'intermediate', name: 'Intermediate', description: 'Medium difficulty' },
  { id: 'advanced', name: 'Advanced', description: 'Challenging words' }
];

const TIME_LIMIT_OPTIONS = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 90, label: '1.5 minutes' },
  { value: 120, label: '2 minutes' }
];

export default function VocabBlastSettings({ 
  currentSettings, 
  onStartGame, 
  onBackToMenu 
}: VocabBlastSettingsProps) {
  const [settings, setSettings] = useState<VocabBlastGameSettings>(currentSettings);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [soundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);

  const handleThemeChange = (themeId: string) => {
    playSFX('button-click');
    setSettings(prev => ({ ...prev, theme: themeId }));
  };

  const handleCategorySelect = (categoryId: string, subcategoryId: string | null) => {
    setSettings(prev => ({
      ...prev,
      category: categoryId,
      subcategory: subcategoryId || undefined
    }));
    setShowCategorySelector(false);
  };

  const handleLanguageChange = (languageId: string) => {
    playSFX('button-click');
    setSettings(prev => ({ ...prev, language: languageId }));
  };

  const handleDifficultyChange = (difficulty: string) => {
    playSFX('button-click');
    setSettings(prev => ({ ...prev, difficulty }));
  };

  const handleTimeLimitChange = (timeLimit: number) => {
    playSFX('button-click');
    setSettings(prev => ({ ...prev, timeLimit }));
  };

  const handleStartGame = () => {
    if (!settings.category) {
      playSFX('wrong-answer');
      return;
    }
    playSFX('button-click');
    onStartGame(settings);
  };

  const selectedLanguage = ENHANCED_LANGUAGES.find(lang => lang.id === settings.language);

  if (showCategorySelector) {
    return (
      <CategorySelector
        onCategorySelect={handleCategorySelect}
        selectedLanguage={settings.language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </button>
          <h1 className="text-3xl font-bold">Game Settings</h1>
          <div></div>
        </motion.div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl"
        >
          {/* Theme Selector - Full Width */}
          <div className="mb-8">
            <ThemeSelector 
              selectedTheme={settings.theme} 
              onThemeChange={handleThemeChange} 
            />
          </div>

          {/* Horizontal Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Category Selection */}
            <div>
              <label className="block text-lg font-medium text-white mb-4">Category</label>
              <motion.div
                onClick={() => {
                  playSFX('button-click');
                  setShowCategorySelector(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer text-center p-6 rounded-xl border-2 transition-all bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 min-h-[100px] flex flex-col justify-center"
              >
                <div className="text-4xl mb-2">📚</div>
                <div className="font-medium text-xl">
                  {settings.category || 'Select Category'}
                </div>
                <div className="text-sm mt-1 opacity-75">
                  {settings.subcategory || (settings.category ? 'All topics' : 'Choose your topic')}
                </div>
                <div className="text-xs mt-2 opacity-50">Click to change</div>
              </motion.div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-lg font-medium text-white mb-4">Language</label>
              <div className="space-y-2">
                {ENHANCED_LANGUAGES.map((language) => (
                  <motion.button
                    key={language.id}
                    onClick={() => handleLanguageChange(language.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      settings.language === language.id
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>



            {/* Time Limit Selection */}
            <div>
              <label className="block text-lg font-medium text-white mb-4">Time Limit</label>
              <div className="space-y-2">
                {TIME_LIMIT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleTimeLimitChange(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      settings.timeLimit === option.value
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/60 text-white'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <motion.button
              onClick={handleStartGame}
              whileHover={settings.category ? { scale: 1.05 } : {}}
              whileTap={settings.category ? { scale: 0.95 } : {}}
              disabled={!settings.category}
              className={`flex items-center justify-center gap-3 px-12 py-4 rounded-xl font-bold text-xl transition-all shadow-lg mx-auto ${
                settings.category
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white hover:shadow-xl cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <Play className="w-6 h-6" />
              {settings.category ? 'Start Game' : 'Select Category First'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
