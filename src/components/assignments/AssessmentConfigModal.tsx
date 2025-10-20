'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Check } from 'lucide-react';

interface AssessmentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentType: {
    id: string;
    name: string;
    type: string;
    estimatedTime: string;
    skills: string[];
    description: string;
  };
  currentConfig?: {
    language?: 'spanish' | 'french' | 'german';
    level?: 'KS3' | 'KS4';
    difficulty?: 'foundation' | 'higher';
    examBoard?: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
    paper?: string; // e.g., 'paper-1', 'paper-2', etc.
    category?: string;
    subcategory?: string;
    theme?: string;
    topic?: string;
    timeLimit?: number;
    maxAttempts?: number;
    autoGrade?: boolean;
    feedbackEnabled?: boolean;
  };
  onSave: (config: any) => void;
}

// KS3 Categories and Subcategories
const KS3_CATEGORIES = {
  basics_core_language: {
    name: 'Basics & Core Language',
    subcategories: ['colours']
  },
  clothes_shopping: {
    name: 'Clothes & Shopping',
    subcategories: ['clothes_accessories']
  },
  daily_life: {
    name: 'Daily Life',
    subcategories: ['daily_routine']
  },
  food_drink: {
    name: 'Food & Drink',
    subcategories: ['food_drink_vocabulary', 'meals', 'ordering_cafes_restaurants']
  },
  free_time_leisure: {
    name: 'Free Time & Leisure',
    subcategories: ['hobbies_interests', 'sports']
  },
  health_lifestyle: {
    name: 'Health & Lifestyle',
    subcategories: ['at_the_doctors', 'healthy_living', 'parts_of_body']
  },
  holidays_travel_culture: {
    name: 'Holidays, Travel & Culture',
    subcategories: ['accommodation', 'countries', 'festivals_celebrations', 'holiday_activities', 'nationalities', 'transport', 'travel_destinations_types', 'weather_seasons']
  },
  home_local_area: {
    name: 'Home & Local Area',
    subcategories: ['chores', 'directions', 'furniture', 'household_items', 'household_items_chores', 'house_rooms', 'house_rooms_furniture', 'places_in_town']
  },
  identity_personal_life: {
    name: 'Identity & Personal Life',
    subcategories: ['family_friends', 'feelings_emotions', 'personal_information', 'pets', 'physical_personality_descriptions', 'relationships']
  },
  nature_environment: {
    name: 'Nature & Environment',
    subcategories: ['environmental_issues', 'farm_animals', 'insects_bugs', 'landscapes_features', 'plants', 'sea_animals', 'wild_animals']
  },
  school_jobs_future: {
    name: 'School, Jobs & Future',
    subcategories: ['classroom_objects', 'future_ambitions', 'professions_jobs', 'qualities_for_jobs', 'qualities_skills', 'school_life', 'school_rules', 'school_subjects']
  },
  social_global_issues: {
    name: 'Social & Global Issues',
    subcategories: ['current_affairs_world_events', 'global_problems_solutions', 'human_rights', 'social_issues']
  },
  technology_media: {
    name: 'Technology & Media',
    subcategories: ['film', 'internet_digital_devices', 'mobile_phones_social_media', 'music', 'online_safety', 'tv']
  }
};

// KS4 Themes and Topics (AQA/Edexcel)
const KS4_THEMES = {
  AQA: {
    theme1: {
      name: 'Identity and Culture',
      topics: ['me_family_friends', 'technology', 'free_time', 'customs_festivals']
    },
    theme2: {
      name: 'Local, National, International and Global Areas of Interest',
      topics: ['home_town_region', 'social_issues', 'global_issues', 'travel_tourism']
    },
    theme3: {
      name: 'Current and Future Study and Employment',
      topics: ['education', 'career_plans', 'jobs']
    }
  },
  Edexcel: {
    theme1: {
      name: 'Identity and Culture',
      topics: ['who_am_i', 'daily_life', 'cultural_life', 'identity_culture']
    },
    theme2: {
      name: 'Local Area, Holiday and Travel',
      topics: ['holidays', 'travel_transport', 'town_region']
    },
    theme3: {
      name: 'School',
      topics: ['school_life', 'school_studies']
    },
    theme4: {
      name: 'Future Aspirations, Study and Work',
      topics: ['using_languages_beyond_classroom', 'ambitions', 'work']
    },
    theme5: {
      name: 'International and Global Dimension',
      topics: ['bringing_world_together', 'environmental_issues']
    }
  }
};

export default function AssessmentConfigModal({
  isOpen,
  onClose,
  assessmentType,
  currentConfig,
  onSave
}: AssessmentConfigModalProps) {
  const [config, setConfig] = useState({
    language: currentConfig?.language || 'spanish',
    level: currentConfig?.level || 'KS3',
    difficulty: currentConfig?.difficulty || 'foundation',
    examBoard: currentConfig?.examBoard || 'General',
    paper: currentConfig?.paper || '',
    category: currentConfig?.category || '',
    subcategory: currentConfig?.subcategory || '',
    theme: currentConfig?.theme || '',
    topic: currentConfig?.topic || '',
    timeLimit: currentConfig?.timeLimit || 30,
    maxAttempts: currentConfig?.maxAttempts || 3,
    autoGrade: currentConfig?.autoGrade ?? true,
    feedbackEnabled: currentConfig?.feedbackEnabled ?? true,
  });

  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  // Update subcategories when category changes (KS3)
  useEffect(() => {
    if (config.level === 'KS3' && config.category) {
      const categoryData = KS3_CATEGORIES[config.category as keyof typeof KS3_CATEGORIES];
      setAvailableSubcategories(categoryData?.subcategories || []);
    }
  }, [config.category, config.level]);

  // Update topics when theme changes (KS4)
  useEffect(() => {
    if (config.level === 'KS4' && config.theme && config.examBoard !== 'General') {
      const examBoardThemes = KS4_THEMES[config.examBoard as 'AQA' | 'Edexcel'];
      const themeData = examBoardThemes?.[config.theme as keyof typeof examBoardThemes];
      setAvailableTopics(themeData?.topics || []);
    }
  }, [config.theme, config.level, config.examBoard]);

  // Reset category/subcategory when switching between KS3/KS4
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      category: '',
      subcategory: '',
      theme: '',
      topic: ''
    }));
  }, [config.level]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const isConfigComplete = () => {
    if (!config.language) return false;
    if (!config.level) return false;

    // For GCSE exams, require paper selection
    if ((assessmentType.id === 'gcse-reading' || assessmentType.id === 'gcse-listening') && config.examBoard !== 'General') {
      if (!config.paper) return false;
    }

    if (config.level === 'KS3') {
      return config.category && config.subcategory;
    } else {
      // KS4
      if (config.examBoard === 'General') {
        return config.category && config.subcategory;
      } else {
        return config.theme && config.topic && config.difficulty;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Configure Assessment</h2>
                <p className="text-sm text-gray-600">{assessmentType.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                value={config.language}
                onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

            {/* Curriculum Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, level: 'KS3' }))}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    config.level === 'KS3'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold">KS3</div>
                  <div className="text-xs text-gray-600">Years 7-9</div>
                </button>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, level: 'KS4' }))}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    config.level === 'KS4'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold">KS4 (GCSE)</div>
                  <div className="text-xs text-gray-600">Years 10-11</div>
                </button>
              </div>
            </div>

            {/* KS4 Exam Board Selection */}
            {config.level === 'KS4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Board <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.examBoard}
                  onChange={(e) => setConfig(prev => ({ ...prev, examBoard: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="General">General (Non-exam specific)</option>
                  <option value="AQA">AQA</option>
                  <option value="Edexcel">Edexcel</option>
                  <option value="Eduqas">Eduqas</option>
                </select>
              </div>
            )}

            {/* KS4 Tier/Difficulty */}
            {config.level === 'KS4' && config.examBoard !== 'General' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, difficulty: 'foundation' }))}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      config.difficulty === 'foundation'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Foundation
                  </button>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, difficulty: 'higher' }))}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      config.difficulty === 'higher'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Higher
                  </button>
                </div>
              </div>
            )}

            {/* Paper Selection for GCSE Exams */}
            {(assessmentType.id === 'gcse-reading' || assessmentType.id === 'gcse-listening') && config.examBoard !== 'General' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paper <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.paper}
                  onChange={(e) => setConfig(prev => ({ ...prev, paper: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a paper...</option>
                  <option value="paper-1">Paper 1</option>
                  <option value="paper-2">Paper 2</option>
                  <option value="paper-3">Paper 3</option>
                  <option value="paper-4">Paper 4</option>
                </select>
              </div>
            )}

            {/* Content Selection - KS3 */}
            {config.level === 'KS3' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={config.category}
                    onChange={(e) => setConfig(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a category...</option>
                    {Object.entries(KS3_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>

                {config.category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={config.subcategory}
                      onChange={(e) => setConfig(prev => ({ ...prev, subcategory: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a subcategory...</option>
                      {availableSubcategories.map(sub => (
                        <option key={sub} value={sub}>{sub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Content Selection - KS4 with Exam Board */}
            {config.level === 'KS4' && config.examBoard !== 'General' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={config.theme}
                    onChange={(e) => setConfig(prev => ({ ...prev, theme: e.target.value, topic: '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a theme...</option>
                    {Object.entries(KS4_THEMES[config.examBoard as 'AQA' | 'Edexcel'] || {}).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>

                {config.theme && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={config.topic}
                      onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a topic...</option>
                      {availableTopics.map(topic => (
                        <option key={topic} value={topic}>{topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Content Selection - KS4 General */}
            {config.level === 'KS4' && config.examBoard === 'General' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={config.category}
                    onChange={(e) => setConfig(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a category...</option>
                    {Object.entries(KS3_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>

                {config.category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={config.subcategory}
                      onChange={(e) => setConfig(prev => ({ ...prev, subcategory: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a subcategory...</option>
                      {availableSubcategories.map(sub => (
                        <option key={sub} value={sub}>{sub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isConfigComplete()}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                isConfigComplete()
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check className="h-4 w-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

