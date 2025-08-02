'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowLeft, Globe, BookOpen, Target, Star, Palette } from 'lucide-react';
import { UnifiedSelectionConfig } from '../../hooks/useUnifiedVocabulary';

interface GameTheme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface GameStartConfirmationProps {
  gameName: string;
  config: UnifiedSelectionConfig;
  themes?: GameTheme[];
  defaultTheme?: string;
  onStartGame: (theme: string) => void;
  onBack: () => void;
}

// Default themes for games that support them
const DEFAULT_THEMES: GameTheme[] = [
  {
    id: 'default',
    name: 'default',
    displayName: 'Classic',
    description: 'Clean and professional design',
    preview: '🎯',
    colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4' }
  },
  {
    id: 'tokyo-nights',
    name: 'tokyo-nights',
    displayName: 'Tokyo Nights',
    description: 'Neon cyberpunk aesthetic',
    preview: '🌃',
    colors: { primary: '#ff0080', secondary: '#00ffff', accent: '#ff4081' }
  },
  {
    id: 'pirate-adventure',
    name: 'pirate-adventure',
    displayName: 'Pirate Adventure',
    description: 'Swashbuckling maritime theme',
    preview: '🏴‍☠️',
    colors: { primary: '#8b4513', secondary: '#daa520', accent: '#cd853f' }
  },
  {
    id: 'space-explorer',
    name: 'space-explorer',
    displayName: 'Space Explorer',
    description: 'Futuristic space adventure',
    preview: '🚀',
    colors: { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#06b6d4' }
  },
  {
    id: 'lava-temple',
    name: 'lava-temple',
    displayName: 'Lava Temple',
    description: 'Ancient temple with fiery elements',
    preview: '🌋',
    colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#f59e0b' }
  }
];

// Language display names
const LANGUAGE_NAMES: Record<string, string> = {
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German'
};

// Curriculum level display names
const CURRICULUM_NAMES: Record<string, string> = {
  'KS2': 'Key Stage 2 (Ages 7-11)',
  'KS3': 'Key Stage 3 (Ages 11-14)',
  'KS4': 'Key Stage 4 - GCSE (Ages 14-16)',
  'KS5': 'Key Stage 5 - A-Level (Ages 16-18)'
};

export default function GameStartConfirmation({
  gameName,
  config,
  themes = DEFAULT_THEMES,
  defaultTheme = 'default',
  onStartGame,
  onBack
}: GameStartConfirmationProps) {
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);

  const handleStartGame = () => {
    onStartGame(selectedTheme);
  };

  const selectedThemeData = themes.find(t => t.id === selectedTheme) || themes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{gameName}</h1>
              <p className="text-indigo-100">Ready to start your game?</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Configuration Summary */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <span>Game Configuration</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Language */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-gray-700">Language</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {LANGUAGE_NAMES[config.language] || config.language}
                </p>
              </div>

              {/* Curriculum Level */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-gray-700">Level</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {CURRICULUM_NAMES[config.curriculumLevel] || config.curriculumLevel}
                </p>
              </div>

              {/* Category */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-gray-700">Category</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {config.categoryId.replace(/_/g, ' ')}
                </p>
              </div>

              {/* Subcategory */}
              {config.subcategoryId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-gray-700">Subtopic</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {config.subcategoryId.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Theme Selection */}
          {themes.length > 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Palette className="h-5 w-5 text-indigo-600" />
                <span>Choose Your Theme</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTheme === theme.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{theme.preview}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{theme.displayName}</h3>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                    </div>
                    
                    {/* Color preview */}
                    <div className="flex space-x-1 mt-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start Game Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              onClick={handleStartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all"
            >
              <Play className="h-6 w-6" />
              <span>Start Game</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
