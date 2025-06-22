'use client';

import React, { useState } from 'react';
import { Settings, X, Play, Star } from 'lucide-react';

interface GemCollectorSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (settings: GameSettings) => void;
  currentSettings?: GameSettings;
}

export interface GameSettings {
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  theme?: string;
  topic?: string;
  sentenceCount: number;
  livesCount: number;
  speedBoostEnabled: boolean;
  timeLimit: number; // in seconds
}

const DEFAULT_SETTINGS: GameSettings = {
  language: 'spanish',
  difficulty: 'beginner',
  sentenceCount: 10,
  livesCount: 3,
  speedBoostEnabled: true,
  timeLimit: 600 // 10 minutes
};

const LANGUAGES = [
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' }
];

const THEMES = [
  'People and lifestyle',
  'Communication and the world around us',
  'Leisure and entertainment',
  'Education and work',
  'Travel and tourism',
  'Food and drink',
  'Health and fitness',
  'Shopping and services'
];

const TOPICS = [
  'Identity and relationships',
  'Free time activities',
  'School life',
  'Environment and where people live',
  'Weather and climate',
  'Food and eating out',
  'Sports and exercise',
  'Shopping and money'
];

export default function GemCollectorSettings({ 
  isOpen, 
  onClose, 
  onStartGame, 
  currentSettings 
}: GemCollectorSettingsProps) {
  const [settings, setSettings] = useState<GameSettings>(currentSettings || DEFAULT_SETTINGS);

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStartGame = () => {
    onStartGame(settings);
    onClose();
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Simple sentences with basic vocabulary';
      case 'intermediate':
        return 'More complex sentences with varied grammar';
      case 'advanced':
        return 'Complex sentences with advanced vocabulary';
      default:
        return '';
    }
  };

  const getTimeLimitLabel = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gem Collector Settings</h2>
              <p className="text-sm text-gray-600">Customize your sentence translation adventure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Target Language
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => handleSettingChange('language', lang.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.language === lang.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-sm font-medium">{lang.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Difficulty Level
            </label>
            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => handleSettingChange('difficulty', level)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    settings.difficulty === level
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold capitalize ${
                        settings.difficulty === level ? 'text-purple-700' : 'text-gray-900'
                      }`}>
                        {level}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getDifficultyDescription(level)}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      settings.difficulty === level
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {settings.difficulty === level && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Game Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentence Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Sentences
              </label>
              <select
                value={settings.sentenceCount}
                onChange={(e) => handleSettingChange('sentenceCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={5}>5 sentences (Quick - 3-5 min)</option>
                <option value={10}>10 sentences (Standard - 5-8 min)</option>
                <option value={15}>15 sentences (Extended - 8-12 min)</option>
                <option value={20}>20 sentences (Marathon - 12-15 min)</option>
              </select>
            </div>

            {/* Lives Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lives
              </label>
              <select
                value={settings.livesCount}
                onChange={(e) => handleSettingChange('livesCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={1}>1 life (Expert)</option>
                <option value={3}>3 lives (Standard)</option>
                <option value={5}>5 lives (Relaxed)</option>
                <option value={10}>10 lives (Practice)</option>
              </select>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Limit
              </label>
              <select
                value={settings.timeLimit}
                onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
                <option value={900}>15 minutes</option>
                <option value={1200}>20 minutes</option>
                <option value={0}>No time limit</option>
              </select>
            </div>

            {/* Speed Boost */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Speed Boost
                </label>
                <p className="text-xs text-gray-600">Press → to activate</p>
              </div>
              <button
                onClick={() => handleSettingChange('speedBoostEnabled', !settings.speedBoostEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.speedBoostEnabled ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.speedBoostEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Optional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Theme (Optional)
              </label>
              <select
                value={settings.theme || ''}
                onChange={(e) => handleSettingChange('theme', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Any theme</option>
                {THEMES.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Topic (Optional)
              </label>
              <select
                value={settings.topic || ''}
                onChange={(e) => handleSettingChange('topic', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Any topic</option>
                {TOPICS.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartGame}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
