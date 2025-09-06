'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, TrendingDown, TrendingUp, Target, Clock, Star,
  PlayCircle, BookOpen, Zap, AlertCircle, CheckCircle,
  RefreshCw, Filter, Eye, Gamepad2, Award, Lightbulb,
  ChevronDown, ChevronRight, BarChart3, Users, Calendar,
  Gem, Trophy, Flame, Heart, Shield
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { UnifiedVocabularyService, VocabularyItem, VocabularyStats } from '../../services/unifiedVocabularyService';
import Link from 'next/link';

interface FilterState {
  curriculumLevel: 'all' | 'KS2' | 'KS3' | 'KS4' | 'KS5';
  examBoard: 'all' | 'AQA' | 'edexcel';
  category: string;
  subcategory: string;
  theme: string;
  language: 'all' | 'fr' | 'es' | 'de';
  masteryStatus: 'all' | 'mastered' | 'struggling' | 'learning' | 'new';
}

interface CategoryGroup {
  curriculum_level: string;
  category: string;
  subcategory: string;
  exam_board_code: string | null;
  theme_name: string | null;
  unit_name: string | null;
  language: string;
  total_words: number;
  mastered_words: number;
  struggling_words: number;
  learning_words: number;
  new_words: number;
  accuracy_percentage: number;
  last_practiced: string | null;
  total_attempts: number;
  correct_attempts: number;
  words: VocabularyItem[];
}

interface ViewMode {
  type: 'categories' | 'words';
  expandedCategories: Set<string>;
}

const MASTERY_LEVELS = {
  0: { name: 'New', color: 'bg-gray-100 text-gray-700', icon: Eye, description: 'Never practiced' },
  1: { name: 'Seen', color: 'bg-blue-100 text-blue-700', icon: Eye, description: 'Encountered once' },
  2: { name: 'Learning', color: 'bg-yellow-100 text-yellow-700', icon: BookOpen, description: 'In progress' },
  3: { name: 'Practiced', color: 'bg-orange-100 text-orange-700', icon: Target, description: 'Getting familiar' },
  4: { name: 'Mastered', color: 'bg-green-100 text-green-700', icon: CheckCircle, description: 'Consistently correct' },
  5: { name: 'Expert', color: 'bg-purple-100 text-purple-700', icon: Trophy, description: 'Perfect mastery' },
} as const;

export default function UnifiedVocabularyDashboard() {
  console.log('🎯 [UNIFIED DASHBOARD] Component loaded!');

  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [vocabularyService] = useState(() => new UnifiedVocabularyService(supabase));
  
  const [data, setData] = useState<{
    items: VocabularyItem[];
    stats: VocabularyStats;
    categories: CategoryGroup[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    curriculumLevel: 'all',
    examBoard: 'all',
    category: '',
    subcategory: '',
    theme: '',
    language: 'all',
    masteryStatus: 'all'
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>({
    type: 'categories',
    expandedCategories: new Set()
  });

  const [availableFilters, setAvailableFilters] = useState<{
    languages: string[];
    categories: string[];
    subcategories: string[];
    themes: string[];
    curriculumLevels: string[];
    examBoards: string[];
  }>({
    languages: [],
    categories: [],
    subcategories: [],
    themes: [],
    curriculumLevels: [],
    examBoards: []
  });

  // Language display mapping
  const languageNames: Record<string, string> = {
    'fr': 'French',
    'es': 'Spanish', 
    'de': 'German'
  };

  useEffect(() => {
    console.log('🔄 [UNIFIED DASHBOARD] useEffect triggered:', { userId: user?.id });
    if (user?.id) {
      loadVocabularyData();
    }
  }, [user?.id]);

  const loadVocabularyData = async () => {
    if (!user?.id) return;
    
    try {
      setError(null);
      console.log('🔄 [UNIFIED DASHBOARD] Loading vocabulary data...');
      
      const result = await vocabularyService.getVocabularyData(user.id);
      console.log('📊 [UNIFIED DASHBOARD] Vocabulary data loaded:', {
        itemsCount: result.items.length,
        stats: result.stats
      });
      
      // Process categories with improved struggling logic
      const categoryMap = new Map<string, CategoryGroup>();



      result.items.forEach(item => {
        // For KS4 vocabulary, use theme_name/unit_name when category/subcategory are null
        // Handle semicolon-separated theme/unit names by taking the first (primary) one
        const parseMultiValue = (value: string | null) => {
          if (!value) return null;
          return value.split(';')[0].trim();
        };

        const displayCategory = item.category || parseMultiValue(item.themeName) || 'Unknown';
        const displaySubcategory = item.subcategory || parseMultiValue(item.unitName) || 'Unknown';

        // For AQA, create a more specific key to avoid duplicates across multiple theme/unit combinations
        // Include exam board and theme/unit info in the key for better separation
        const keyParts = [
          item.curriculumLevel,
          item.examBoardCode || 'no-board',
          displayCategory,
          displaySubcategory,
          item.language
        ];
        const key = keyParts.join('-');

        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            curriculum_level: item.curriculumLevel,
            category: displayCategory,
            subcategory: displaySubcategory,
            exam_board_code: item.examBoardCode || null,
            theme_name: item.themeName || null,
            unit_name: item.unitName || null,
            language: item.language,
            total_words: 0,
            mastered_words: 0,
            struggling_words: 0,
            learning_words: 0,
            new_words: 0,
            accuracy_percentage: 0,
            last_practiced: null,
            total_attempts: 0,
            correct_attempts: 0,
            words: []
          });
        }
        
        const category = categoryMap.get(key)!;
        category.total_words++;
        category.words.push(item);
        
        // Improved mastery classification
        if (item.masteryLevel >= 4) {
          category.mastered_words++;
        } else if (item.masteryLevel >= 2 && item.accuracy < 70 && item.totalEncounters >= 3) {
          // Only struggling if they've had multiple attempts and low accuracy
          category.struggling_words++;
        } else if (item.masteryLevel >= 1 && item.totalEncounters >= 2) {
          // Learning: has some practice but not mastered
          category.learning_words++;
        } else {
          // New: first encounter or no encounters
          category.new_words++;
        }
        
        category.total_attempts += item.totalEncounters;
        category.correct_attempts += item.correctEncounters;
        
        if (item.lastEncountered && (!category.last_practiced || item.lastEncountered > category.last_practiced)) {
          category.last_practiced = item.lastEncountered;
        }
      });
      
      // Calculate accuracy for each category
      categoryMap.forEach(category => {
        category.accuracy_percentage = category.total_attempts > 0 
          ? Math.round((category.correct_attempts / category.total_attempts) * 100)
          : 0;
      });
      
      const categories = Array.from(categoryMap.values())
        .sort((a, b) => {
          // Sort by curriculum level, then by category name
          if (a.curriculum_level !== b.curriculum_level) {
            const levelOrder = ['KS2', 'KS3', 'KS4', 'KS5'];
            return levelOrder.indexOf(a.curriculum_level) - levelOrder.indexOf(b.curriculum_level);
          }
          return a.category.localeCompare(b.category);
        });
      
      // Extract available filter options
      const parseMultiValue = (value: string | null) => {
        if (!value) return null;
        return value.split(';')[0].trim();
      };

      const languages = [...new Set(result.items.map(item => item.language))];
      const categoriesSet = [...new Set(result.items.map(item => item.category || parseMultiValue(item.themeName)).filter(Boolean))];
      const subcategoriesSet = [...new Set(result.items.map(item => item.subcategory || parseMultiValue(item.unitName)).filter(Boolean))];
      const themesSet = [...new Set(result.items.map(item => parseMultiValue(item.themeName)).filter(Boolean))];
      const curriculumLevels = [...new Set(result.items.map(item => item.curriculumLevel))];
      const examBoards = [...new Set(result.items.map(item => item.examBoardCode).filter(Boolean))];
      
      setAvailableFilters({
        languages,
        categories: categoriesSet,
        subcategories: subcategoriesSet,
        themes: themesSet,
        curriculumLevels,
        examBoards
      });
      
      setData({
        items: result.items,
        stats: result.stats,
        categories
      });
      
    } catch (err) {
      console.error('❌ [UNIFIED DASHBOARD] Error loading vocabulary data:', err);
      setError('Failed to load vocabulary data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVocabularyData();
  };

  const toggleCategoryExpansion = (categoryKey: string) => {
    const newExpanded = new Set(viewMode.expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setViewMode({
      ...viewMode,
      expandedCategories: newExpanded
    });
  };

  // Apply filters to categories
  const filteredCategories = data?.categories.filter(category => {
    if (filters.curriculumLevel !== 'all' && category.curriculum_level !== filters.curriculumLevel) return false;
    if (filters.examBoard !== 'all' && category.exam_board_code !== filters.examBoard) return false;
    if (filters.language !== 'all' && category.language !== filters.language) return false;
    if (filters.category && !category.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (filters.subcategory && !category.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase())) return false;
    if (filters.theme && category.theme_name && !category.theme_name.toLowerCase().includes(filters.theme.toLowerCase())) return false;

    if (filters.masteryStatus !== 'all') {
      switch (filters.masteryStatus) {
        case 'mastered':
          return category.mastered_words > 0;
        case 'struggling':
          return category.struggling_words > 0;
        case 'learning':
          return category.learning_words > 0;
        case 'new':
          return category.new_words > 0;
      }
    }

    return true;
  }) || [];

  // Apply filters to individual words
  const filteredWords = data?.items.filter(word => {
    if (filters.curriculumLevel !== 'all' && word.curriculumLevel !== filters.curriculumLevel) return false;
    if (filters.examBoard !== 'all' && word.examBoardCode !== filters.examBoard) return false;
    if (filters.language !== 'all' && word.language !== filters.language) return false;

    // Parse multi-value fields for consistent filtering
    const parseMultiValue = (value: string | null) => {
      if (!value) return null;
      return value.split(';')[0].trim();
    };

    const displayCategory = word.category || parseMultiValue(word.themeName) || 'Unknown';
    const displaySubcategory = word.subcategory || parseMultiValue(word.unitName) || 'Unknown';

    if (filters.category && !displayCategory.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (filters.subcategory && !displaySubcategory.toLowerCase().includes(filters.subcategory.toLowerCase())) return false;
    if (filters.theme && word.themeName && !parseMultiValue(word.themeName)?.toLowerCase().includes(filters.theme.toLowerCase())) return false;

    if (filters.masteryStatus !== 'all') {
      switch (filters.masteryStatus) {
        case 'mastered':
          return word.isMastered;
        case 'struggling':
          return word.isStruggling;
        case 'learning':
          return word.masteryLevel >= 1 && word.totalEncounters >= 2 && !word.isMastered && !word.isStruggling;
        case 'new':
          return word.masteryLevel <= 1 && word.totalEncounters <= 1;
      }
    }

    return true;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your vocabulary progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vocabulary Data</h3>
          <p className="text-gray-600">Start playing games to build your vocabulary collection!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Brain className="h-8 w-8 text-blue-600" />
                <span>Vocabulary Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1">Track your language learning progress</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Words</p>
                <p className="text-2xl font-bold text-gray-900">{data.stats.totalWords}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mastered</p>
                <p className="text-2xl font-bold text-green-600">{data.stats.masteredWords}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Practice</p>
                <p className="text-2xl font-bold text-orange-600">{data.stats.strugglingWords}</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-blue-600">{data.stats.averageAccuracy}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Curriculum Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curriculum Level
              </label>
              <select
                value={filters.curriculumLevel}
                onChange={(e) => setFilters({...filters, curriculumLevel: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                {availableFilters.curriculumLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Exam Board */}
            {filters.curriculumLevel === 'KS4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Board
                </label>
                <select
                  value={filters.examBoard}
                  onChange={(e) => setFilters({...filters, examBoard: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Boards</option>
                  <option value="AQA">AQA</option>
                  <option value="edexcel">Edexcel</option>
                </select>
              </div>
            )}

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Languages</option>
                {availableFilters.languages.map(lang => (
                  <option key={lang} value={lang}>{languageNames[lang] || lang}</option>
                ))}
              </select>
            </div>

            {/* Mastery Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mastery Status
              </label>
              <select
                value={filters.masteryStatus}
                onChange={(e) => setFilters({...filters, masteryStatus: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="mastered">Mastered</option>
                <option value="learning">Learning</option>
                <option value="struggling">Need Practice</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Category
              </label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                placeholder="Search categories..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Subcategory
              </label>
              <input
                type="text"
                value={filters.subcategory}
                onChange={(e) => setFilters({...filters, subcategory: e.target.value})}
                placeholder="Search subcategories..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Theme
              </label>
              <input
                type="text"
                value={filters.theme}
                onChange={(e) => setFilters({...filters, theme: e.target.value})}
                placeholder="Search themes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'categories', label: 'Categories', icon: BookOpen },
                { id: 'words', label: 'All Words', icon: Eye }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode({...viewMode, type: tab.id as any})}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      viewMode.type === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {viewMode.type === 'categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredCategories.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Vocabulary Categories ({filteredCategories.length})
                        </h3>
                      </div>

                      {filteredCategories.map((category) => {
                        const categoryKey = `${category.curriculum_level}-${category.category}-${category.subcategory}-${category.language}`;
                        const isExpanded = viewMode.expandedCategories.has(categoryKey);

                        return (
                          <div key={categoryKey} className="bg-gray-50 border border-gray-200 rounded-lg">
                            <div
                              className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => toggleCategoryExpansion(categoryKey)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    {isExpanded ? (
                                      <ChevronDown className="h-5 w-5 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 text-gray-400" />
                                    )}
                                    <div>
                                      <h4 className="font-semibold text-gray-900">
                                        {category.category}
                                        {category.subcategory !== category.category && (
                                          <span className="text-gray-600"> → {category.subcategory}</span>
                                        )}
                                      </h4>
                                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                        <span>{category.curriculum_level}</span>
                                        <span>{languageNames[category.language] || category.language}</span>
                                        {category.exam_board_code && (
                                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                            {category.exam_board_code.toUpperCase()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">{category.total_words}</div>
                                    <div className="text-xs text-gray-600">Total</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{category.mastered_words}</div>
                                    <div className="text-xs text-gray-600">Mastered</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-600">{category.learning_words}</div>
                                    <div className="text-xs text-gray-600">Learning</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-orange-600">{category.struggling_words}</div>
                                    <div className="text-xs text-gray-600">Struggling</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-gray-600">{category.new_words}</div>
                                    <div className="text-xs text-gray-600">New</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{category.accuracy_percentage}%</div>
                                    <div className="text-xs text-gray-600">Accuracy</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-gray-200 p-4 bg-white"
                              >
                                <h5 className="font-medium text-gray-900 mb-3">Individual Words ({category.words.length})</h5>
                                <div className="grid gap-3">
                                  {category.words.map((word) => {
                                    const masteryInfo = MASTERY_LEVELS[word.masteryLevel as keyof typeof MASTERY_LEVELS] || MASTERY_LEVELS[0];
                                    const MasteryIcon = masteryInfo.icon;

                                    return (
                                      <div key={word.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <span className="text-lg font-semibold text-gray-900">{word.word}</span>
                                          <span className="text-gray-600">→</span>
                                          <span className="text-gray-700">{word.translation}</span>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                          <div className="text-center">
                                            <div className="text-sm font-medium text-gray-900">{word.accuracy}%</div>
                                            <div className="text-xs text-gray-600">Accuracy</div>
                                          </div>
                                          <div className="text-center">
                                            <div className="text-sm font-medium text-gray-900">{word.totalEncounters}</div>
                                            <div className="text-xs text-gray-600">Attempts</div>
                                          </div>
                                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${masteryInfo.color}`}>
                                            <MasteryIcon className="h-3 w-3" />
                                            <span>{masteryInfo.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
                      <p className="text-gray-600">Try adjusting your filters or start playing games to build your vocabulary!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {viewMode.type === 'words' && (
                <motion.div
                  key="words"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredWords.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          All Words ({filteredWords.length})
                        </h3>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Word
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Translation
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Accuracy
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Attempts
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredWords.map((word) => {
                                const masteryInfo = MASTERY_LEVELS[word.masteryLevel as keyof typeof MASTERY_LEVELS] || MASTERY_LEVELS[0];
                                const MasteryIcon = masteryInfo.icon;

                                // Parse multi-value fields for display
                                const parseMultiValue = (value: string | null) => {
                                  if (!value) return null;
                                  return value.split(';')[0].trim();
                                };

                                const displayCategory = word.category || parseMultiValue(word.themeName) || 'Unknown';
                                const displaySubcategory = word.subcategory || parseMultiValue(word.unitName) || 'Unknown';

                                return (
                                  <tr key={word.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">{word.word}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-700">{word.translation}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{displayCategory}</div>
                                      {displaySubcategory !== displayCategory && (
                                        <div className="text-xs text-gray-500">{displaySubcategory}</div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{word.curriculumLevel}</div>
                                      {word.examBoardCode && (
                                        <div className="text-xs text-blue-600">{word.examBoardCode.toUpperCase()}</div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">{word.accuracy}%</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{word.totalEncounters}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${masteryInfo.color}`}>
                                        <MasteryIcon className="h-3 w-3 mr-1" />
                                        {masteryInfo.name}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibent text-gray-900 mb-2">No Words Found</h3>
                      <p className="text-gray-600">Start playing games to build your vocabulary collection!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
