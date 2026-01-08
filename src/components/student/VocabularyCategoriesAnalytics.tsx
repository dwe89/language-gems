'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, BarChart3, Target, CheckCircle, AlertCircle, Clock,
  BookOpen, Brain, Zap, TrendingUp, ChevronDown, ChevronRight,
  PlayCircle, Star, Award, RefreshCw, Eye, Gamepad2
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import Link from 'next/link';

interface VocabularyCategory {
  curriculum_level: string;
  category: string;
  subcategory: string | null;
  exam_board_code: string | null;
  theme_name: string | null;
  unit_name: string | null;
  total_words: number;
  mastered_words: number;
  struggling_words: number;
  accuracy_percentage: number;
  last_practiced: string | null;
  total_attempts: number;
  correct_attempts: number;
}

interface FilterState {
  curriculumLevel: 'all' | 'KS2' | 'KS3' | 'KS4' | 'KS5';
  examBoard: 'all' | 'AQA' | 'edexcel';
  category: string;
  subcategory: string;
  theme: string;
}

export default function VocabularyCategoriesAnalytics() {
  const { user } = useAuth();
  const { supabase } = useSupabase();

  console.log('🔍 [VOCAB CATEGORIES] Component loaded:', { user: user?.id, hasSupabase: !!supabase });

  // Early return if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to view vocabulary categories.</p>
        </div>
      </div>
    );
  }

  const [categories, setCategories] = useState<VocabularyCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<VocabularyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    curriculumLevel: 'all',
    examBoard: 'all',
    category: 'all',
    subcategory: 'all',
    theme: 'all'
  });

  const [availableOptions, setAvailableOptions] = useState({
    categories: [] as string[],
    subcategories: [] as string[],
    themes: [] as string[],
    examBoards: [] as string[]
  });

  useEffect(() => {
    console.log('🔍 [VOCAB CATEGORIES] useEffect triggered:', { userId: user?.id, hasUser: !!user });
    if (user?.id) {
      console.log('🔍 [VOCAB CATEGORIES] Loading category data for user:', user.id);
      loadCategoryData();
    } else {
      console.log('🔍 [VOCAB CATEGORIES] No user ID available, skipping data load');
    }
  }, [user?.id]);

  useEffect(() => {
    applyFilters();
  }, [filters, categories]);

  const loadCategoryData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // First, get vocabulary collection data without join
      const { data: vocabularyData, error: vocabError } = await supabase
        .from('vocabulary_gem_collection')
        .select(`
          vocabulary_item_id,
          total_encounters,
          correct_encounters,
          mastery_level,
          last_encountered_at,
          centralized_vocabulary_id
        `)
        .eq('student_id', user.id)
        .not('centralized_vocabulary_id', 'is', null);

      if (vocabError) {
        console.error('🔍 [VOCAB CATEGORIES] Supabase query error:', vocabError);
        throw vocabError;
      }

      console.log('🔍 [VOCAB CATEGORIES] Raw vocabulary data:', vocabularyData);
      console.log('🔍 [VOCAB CATEGORIES] Sample item structure:', vocabularyData?.[0]);

      if (!vocabularyData || vocabularyData.length === 0) {
        console.log('🔍 [VOCAB CATEGORIES] No vocabulary data found, setting empty state');
        setCategories([]);
        updateAvailableOptions([]);
        return;
      }

      // Get unique vocabulary IDs
      const vocabularyIds = [...new Set(vocabularyData.map(item => item.centralized_vocabulary_id).filter(Boolean))];
      console.log('🔍 [VOCAB CATEGORIES] Fetching centralized vocabulary for IDs:', vocabularyIds);

      // Fetch centralized vocabulary data
      const { data: centralizedVocabData, error: centralizedError } = await supabase
        .from('centralized_vocabulary')
        .select('id, curriculum_level, category, subcategory, exam_board_code, theme_name, unit_name')
        .in('id', vocabularyIds);

      if (centralizedError) {
        console.error('🔍 [VOCAB CATEGORIES] Centralized vocabulary query error:', centralizedError);
        throw centralizedError;
      }

      console.log('🔍 [VOCAB CATEGORIES] Centralized vocabulary data:', centralizedVocabData);

      // Create a map for faster lookup
      const vocabMap = new Map(centralizedVocabData?.map(v => [v.id, v]) || []);

      // Process and aggregate data by category/subcategory
      const categoryMap = new Map<string, VocabularyCategory>();

      vocabularyData?.forEach(item => {
        // Look up the centralized vocabulary data using the ID
        const vocab = vocabMap.get(item.centralized_vocabulary_id);
        
        if (!vocab) {
          console.warn('No centralized_vocabulary data for item:', item);
          // Skip items without vocabulary data instead of crashing
          return;
        }

        // For KS4 vocabulary, use theme_name/unit_name when category/subcategory are null
        const displayCategory = vocab.category || vocab.theme_name || 'Unknown';
        const displaySubcategory = vocab.subcategory || vocab.unit_name || 'Unknown';

        const key = `${vocab.curriculum_level}-${displayCategory}-${displaySubcategory}`;

        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            curriculum_level: vocab.curriculum_level,
            category: displayCategory,
            subcategory: displaySubcategory,
            exam_board_code: vocab.exam_board_code,
            theme_name: vocab.theme_name,
            unit_name: vocab.unit_name,
            total_words: 0,
            mastered_words: 0,
            struggling_words: 0,
            accuracy_percentage: 0,
            last_practiced: null,
            total_attempts: 0,
            correct_attempts: 0
          });
        }

        const category = categoryMap.get(key)!;
        category.total_words++;
        category.total_attempts += item.total_encounters || 0;
        category.correct_attempts += item.correct_encounters || 0;
        
        if (item.mastery_level >= 4) {
          category.mastered_words++;
        } else if (item.mastery_level <= 2) {
          category.struggling_words++;
        }

        if (item.last_encountered_at) {
          if (!category.last_practiced || item.last_encountered_at > category.last_practiced) {
            category.last_practiced = item.last_encountered_at;
          }
        }
      });

      // Calculate accuracy percentages
      const processedCategories = Array.from(categoryMap.values()).map(category => ({
        ...category,
        accuracy_percentage: category.total_attempts > 0 
          ? Math.round((category.correct_attempts / category.total_attempts) * 100)
          : 0
      }));

      console.log('🔍 [VOCAB CATEGORIES] Processed categories:', processedCategories);

      setCategories(processedCategories);
      updateAvailableOptions(processedCategories);

    } catch (error) {
      console.error('Error loading category data:', error);
      setError('Failed to load vocabulary categories');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailableOptions = (data: VocabularyCategory[]) => {
  const categories = [...new Set(data.map(item => item.category).filter(Boolean))].sort() as string[];
  const subcategories = [...new Set(data.map(item => item.subcategory).filter(Boolean))].sort() as string[];
    const themes = [...new Set(data.map(item => item.theme_name).filter(Boolean))].sort() as string[];
    const examBoards = [...new Set(data.map(item => item.exam_board_code).filter(Boolean))].sort() as string[];

    setAvailableOptions({
      categories,
      subcategories,
      themes,
      examBoards
    });
  };

  const applyFilters = () => {
    let filtered = [...categories];

    // Filter by curriculum level
    if (filters.curriculumLevel !== 'all') {
      filtered = filtered.filter(item => item.curriculum_level === filters.curriculumLevel);
    }

    // Filter by exam board (only relevant for KS4)
    if (filters.examBoard !== 'all' && filters.curriculumLevel === 'KS4') {
      filtered = filtered.filter(item => item.exam_board_code === filters.examBoard);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by subcategory
    if (filters.subcategory !== 'all') {
      filtered = filtered.filter(item => item.subcategory === filters.subcategory);
    }

    // Filter by theme
    if (filters.theme !== 'all') {
      filtered = filtered.filter(item => item.theme_name === filters.theme);
    }

    setFilteredCategories(filtered);
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: value };
      
      // Reset dependent filters when parent filter changes
      if (filterType === 'curriculumLevel') {
        newFilters.examBoard = 'all';
        newFilters.category = 'all';
        newFilters.subcategory = 'all';
        newFilters.theme = 'all';
      } else if (filterType === 'category') {
        newFilters.subcategory = 'all';
      }
      
      return newFilters;
    });
  };

  const getAvailableOptionsForCurrentFilter = (filterType: string) => {
    let baseData = categories;

    // Apply current filters to determine available options
    if (filters.curriculumLevel !== 'all') {
      baseData = baseData.filter(item => item.curriculum_level === filters.curriculumLevel);
    }
    if (filters.examBoard !== 'all') {
      baseData = baseData.filter(item => item.exam_board_code === filters.examBoard);
    }
    if (filters.category !== 'all' && filterType !== 'category') {
      baseData = baseData.filter(item => item.category === filters.category);
    }

    switch (filterType) {
      case 'category':
        return [...new Set(baseData.map(item => item.category))].sort();
      case 'subcategory':
  return [...new Set(baseData.map(item => item.subcategory).filter(Boolean))].sort() as string[];
      case 'theme':
        return [...new Set(baseData.map(item => item.theme_name).filter(Boolean))].sort();
      default:
        return [];
    }
  };

  const getCurriculumLevelMessage = () => {
    if (filters.curriculumLevel === 'KS2' || filters.curriculumLevel === 'KS5') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            No Vocabulary Available for {filters.curriculumLevel}
          </h3>
          <p className="text-yellow-700">
            Vocabulary content is currently available for KS3 and KS4 levels only.
          </p>
        </div>
      );
    }
    return null;
  };

  const formatCategoryName = (category: string) => {
    if (!category) return 'General';
    return category
      .replace(/^KS\d+_/, '') // Remove KS prefix
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  };

  const formatSubcategoryName = (subcategory: string) => {
    if (!subcategory) return 'General';
    return subcategory
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const extractPrimaryUnit = (unitName: string) => {
    if (!unitName) return '';
    // Split by semicolon and take the last unit (usually the most specific)
    const units = unitName.split(';').map(unit => unit.trim());
    return units[units.length - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary categories...</p>
          <p className="text-xs text-gray-500 mt-2">User ID: {user?.id || 'No user'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadCategoryData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Categories</h1>
        <p className="text-gray-600">
          Analyze your performance across different vocabulary categories and topics
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filter Categories</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Curriculum Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Stage
            </label>
            <select
              value={filters.curriculumLevel}
              onChange={(e) => handleFilterChange('curriculumLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="KS2">KS2</option>
              <option value="KS3">KS3</option>
              <option value="KS4">KS4</option>
              <option value="KS5">KS5</option>
            </select>
          </div>

          {/* Exam Board (only for KS4) */}
          {filters.curriculumLevel === 'KS4' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Board
              </label>
              <select
                value={filters.examBoard}
                onChange={(e) => handleFilterChange('examBoard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Boards</option>
                <option value="AQA">AQA</option>
                <option value="edexcel">Edexcel</option>
              </select>
            </div>
          )}

          {/* Theme (for KS4) */}
          {filters.curriculumLevel === 'KS4' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={filters.theme}
                onChange={(e) => handleFilterChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Themes</option>
                {getAvailableOptionsForCurrentFilter('theme').map(theme => (
                  theme && <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={filters.curriculumLevel === 'KS2' || filters.curriculumLevel === 'KS5'}
            >
              <option value="all">All Categories</option>
              {getAvailableOptionsForCurrentFilter('category').map(category => (
                category && <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={filters.subcategory}
              onChange={(e) => handleFilterChange('subcategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={filters.category === 'all' || filters.curriculumLevel === 'KS2' || filters.curriculumLevel === 'KS5'}
            >
              <option value="all">All Subcategories</option>
              {getAvailableOptionsForCurrentFilter('subcategory').map(subcategory => (
                subcategory && <option key={subcategory} value={subcategory}>
                  {formatSubcategoryName(subcategory)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* No vocabulary message for KS2/KS5 */}
      {getCurriculumLevelMessage()}

      {/* Results */}
      {(filters.curriculumLevel === 'all' || filters.curriculumLevel === 'KS3' || filters.curriculumLevel === 'KS4') && (
        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-600">
                No vocabulary categories match your current filters. Try adjusting your selection.
              </p>
            </div>
          ) : (
            filteredCategories.map((category, index) => (
              <motion.div
                key={`${category.curriculum_level}-${category.category}-${category.subcategory}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.curriculum_level === 'KS4' && category.unit_name
                        ? extractPrimaryUnit(category.unit_name)
                        : formatSubcategoryName(category.subcategory ?? '')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.curriculum_level === 'KS4' && category.theme_name
                        ? category.theme_name
                        : formatCategoryName(category.category ?? '')
                      } • {category.curriculum_level}
                      {category.curriculum_level === 'KS4' && category.unit_name && ` • ${extractPrimaryUnit(category.unit_name)}`}
                      {category.curriculum_level !== 'KS4' && category.theme_name && ` • ${category.theme_name}`}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {category.accuracy_percentage}%
                    </div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{category.total_words}</div>
                    <div className="text-xs text-gray-600">Total Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{category.mastered_words}</div>
                    <div className="text-xs text-gray-600">Mastered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{category.struggling_words}</div>
                    <div className="text-xs text-gray-600">Struggling</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{category.total_attempts}</div>
                    <div className="text-xs text-gray-600">Total Attempts</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {category.last_practiced 
                      ? `Last practiced: ${new Date(category.last_practiced).toLocaleDateString()}`
                      : 'Never practiced'
                    }
                  </div>
                  
                    <Link
                    href={`/student-dashboard/activities?category=${encodeURIComponent(category.category)}&subcategory=${encodeURIComponent(category.subcategory ?? '')}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Practice</span>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
