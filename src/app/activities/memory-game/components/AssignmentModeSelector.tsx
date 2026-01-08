'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Clock, Target, Settings, BookOpen, Users, CheckCircle } from 'lucide-react';

interface VocabularyItem {
  id: number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
}

interface AssignmentConfig {
  difficulty: 'easy-1' | 'easy-2' | 'medium-1' | 'medium-2' | 'hard-2' | 'expert';
  vocabularySelection: {
    type: 'theme_based' | 'topic_based' | 'custom_list' | 'manual_selection';
    theme?: string;
    topic?: string;
    customListId?: string;
    selectedWords?: number[];
    wordCount: number;
  };
  gameSettings: {
    timeLimit?: number; // 0 for no time limit
    allowRetries: boolean;
    showProgress: boolean;
    shuffleCards: boolean;
  };
  tracking: {
    trackTime: boolean;
    trackAttempts: boolean;
    trackAccuracy: boolean;
    trackWordsLearned: boolean;
  };
}

interface AssignmentModeSelectorProps {
  onConfigChange: (config: AssignmentConfig) => void;
  availableVocabulary: VocabularyItem[];
  isVisible: boolean;
}

const DIFFICULTY_OPTIONS = [
  { 
    code: 'easy-1', 
    name: 'Easy (3×2)', 
    pairs: 3, 
    grid: '3x2',
    description: 'Perfect for beginners - 3 pairs in a 3×2 grid',
    recommendedTime: 120 // 2 minutes
  },
  { 
    code: 'easy-2', 
    name: 'Easy (4×2)', 
    pairs: 4, 
    grid: '4x2',
    description: 'Simple layout - 4 pairs in a 4×2 grid',
    recommendedTime: 150 // 2.5 minutes
  },
  { 
    code: 'medium-1', 
    name: 'Medium (5×2)', 
    pairs: 5, 
    grid: '5x2',
    description: 'Moderate challenge - 5 pairs in a 5×2 grid',
    recommendedTime: 180 // 3 minutes
  },
  { 
    code: 'medium-2', 
    name: 'Medium (4×3)', 
    pairs: 6, 
    grid: '4x3',
    description: 'Balanced difficulty - 6 pairs in a 4×3 grid',
    recommendedTime: 240 // 4 minutes
  },
  { 
    code: 'hard-2', 
    name: 'Hard (4×4)', 
    pairs: 8, 
    grid: '4x4',
    description: 'Challenging - 8 pairs in a 4×4 grid',
    recommendedTime: 300 // 5 minutes
  },
  { 
    code: 'expert', 
    name: 'Expert (5×4)', 
    pairs: 10, 
    grid: '5x4',
    description: 'Maximum challenge - 10 pairs in a 5×4 grid',
    recommendedTime: 360 // 6 minutes
  }
] as const;

const VOCABULARY_THEMES = [
  'Animals', 'Food', 'Colors', 'Family', 'Numbers', 'School', 'Transportation', 'Home', 'Weather', 'Clothing'
];

const VOCABULARY_TOPICS = [
  'Basic Conversation', 'Travel', 'Shopping', 'Dining', 'Work', 'Hobbies', 'Sports', 'Health', 'Environment'
];

export default function AssignmentModeSelector({ 
  onConfigChange, 
  availableVocabulary, 
  isVisible 
}: AssignmentModeSelectorProps) {
  const [config, setConfig] = useState<AssignmentConfig>({
    difficulty: 'medium-2',
    vocabularySelection: {
      type: 'theme_based',
      wordCount: 6
    },
    gameSettings: {
      timeLimit: 240, // 4 minutes default
      allowRetries: true,
      showProgress: true,
      shuffleCards: true
    },
    tracking: {
      trackTime: true,
      trackAttempts: true,
      trackAccuracy: true,
      trackWordsLearned: true
    }
  });

  const [previewVocabulary, setPreviewVocabulary] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  useEffect(() => {
    // Update word count when difficulty changes
    const selectedDifficulty = DIFFICULTY_OPTIONS.find(d => d.code === config.difficulty);
    if (selectedDifficulty) {
      setConfig(prev => ({
        ...prev,
        vocabularySelection: {
          ...prev.vocabularySelection,
          wordCount: selectedDifficulty.pairs
        },
        gameSettings: {
          ...prev.gameSettings,
          timeLimit: prev.gameSettings.timeLimit || selectedDifficulty.recommendedTime
        }
      }));
    }
  }, [config.difficulty]);

  const updateConfig = (section: keyof AssignmentConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        ...updates
      }
    }));
  };

  const handleVocabularyPreview = () => {
    // Simulate vocabulary selection based on current criteria
    let filtered = availableVocabulary;
    
    if (config.vocabularySelection.type === 'theme_based' && config.vocabularySelection.theme) {
      filtered = filtered.filter(item => item.theme === config.vocabularySelection.theme);
    } else if (config.vocabularySelection.type === 'topic_based' && config.vocabularySelection.topic) {
      filtered = filtered.filter(item => item.topic === config.vocabularySelection.topic);
    }
    
    // Take required number of words
    const preview = filtered.slice(0, config.vocabularySelection.wordCount);
    setPreviewVocabulary(preview);
  };

  if (!isVisible) return null;

  const selectedDifficulty = DIFFICULTY_OPTIONS.find(d => d.code === config.difficulty);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          Memory Game Assignment Configuration
        </h2>
        <p className="text-gray-600">Configure the memory game settings for your students</p>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 text-blue-600 mr-2" />
          Choose Difficulty Level
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIFFICULTY_OPTIONS.map((difficulty) => (
            <div
              key={difficulty.code}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                config.difficulty === difficulty.code
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateConfig('difficulty', { code: difficulty.code })}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{difficulty.name}</h4>
                <span className="text-sm text-gray-500">{difficulty.pairs} pairs</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{difficulty.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                ~{Math.floor(difficulty.recommendedTime / 60)} min
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BookOpen className="h-5 w-5 text-green-600 mr-2" />
          Vocabulary Selection
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selection Method
            </label>
            <select
              value={config.vocabularySelection.type}
              onChange={(e) => updateConfig('vocabularySelection', { 
                type: e.target.value,
                theme: '',
                topic: '',
                customListId: ''
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="theme_based">By Theme</option>
              <option value="topic_based">By Topic</option>
              <option value="custom_list">Custom Word List</option>
              <option value="manual_selection">Manual Selection</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Word Pairs
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={config.vocabularySelection.wordCount}
              onChange={(e) => updateConfig('vocabularySelection', { wordCount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={true} // Auto-set based on difficulty
            />
            <p className="text-xs text-gray-500 mt-1">Automatically set based on difficulty level</p>
          </div>
        </div>

        {config.vocabularySelection.type === 'theme_based' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Theme
            </label>
            <select
              value={config.vocabularySelection.theme || ''}
              onChange={(e) => updateConfig('vocabularySelection', { theme: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a theme...</option>
              {VOCABULARY_THEMES.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
        )}

        {config.vocabularySelection.type === 'topic_based' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Topic
            </label>
            <select
              value={config.vocabularySelection.topic || ''}
              onChange={(e) => updateConfig('vocabularySelection', { topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a topic...</option>
              {VOCABULARY_TOPICS.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleVocabularyPreview}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Preview Selected Vocabulary
        </button>

        {previewVocabulary.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Vocabulary Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {previewVocabulary.map((item, index) => (
                <div key={item.id} className="flex justify-between text-sm bg-white p-2 rounded">
                  <span className="font-medium">{item.spanish}</span>
                  <span className="text-gray-600">{item.english}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Game Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Settings className="h-5 w-5 text-purple-600 mr-2" />
          Game Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Limit (seconds)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={config.gameSettings.timeLimit || 0}
                onChange={(e) => updateConfig('gameSettings', { timeLimit: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => updateConfig('gameSettings', { timeLimit: 0 })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                No Limit
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">0 = No time limit</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.gameSettings.allowRetries}
                onChange={(e) => updateConfig('gameSettings', { allowRetries: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Allow retries</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.gameSettings.showProgress}
                onChange={(e) => updateConfig('gameSettings', { showProgress: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show progress indicators</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.gameSettings.shuffleCards}
                onChange={(e) => updateConfig('gameSettings', { shuffleCards: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Shuffle card positions</span>
            </label>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 text-orange-600 mr-2" />
          Progress Tracking
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.tracking.trackTime}
              onChange={(e) => updateConfig('tracking', { trackTime: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Time spent</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.tracking.trackAttempts}
              onChange={(e) => updateConfig('tracking', { trackAttempts: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Attempts</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.tracking.trackAccuracy}
              onChange={(e) => updateConfig('tracking', { trackAccuracy: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Accuracy</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.tracking.trackWordsLearned}
              onChange={(e) => updateConfig('tracking', { trackWordsLearned: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Words learned</span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          Assignment Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-900">Difficulty:</span>
            <p className="text-blue-700">{selectedDifficulty?.name} - {selectedDifficulty?.pairs} pairs</p>
          </div>
          <div>
            <span className="font-medium text-blue-900">Time Limit:</span>
            <p className="text-blue-700">
              {config.gameSettings.timeLimit ? `${Math.floor(config.gameSettings.timeLimit / 60)}:${String(config.gameSettings.timeLimit % 60).padStart(2, '0')}` : 'No limit'}
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-900">Vocabulary:</span>
            <p className="text-blue-700">
              {config.vocabularySelection.wordCount} words from {config.vocabularySelection.type.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 