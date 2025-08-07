'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, TrendingDown, TrendingUp, Target, Clock, Star,
  PlayCircle, BookOpen, Zap, AlertCircle, CheckCircle,
  RefreshCw, Filter, Eye, Gamepad2, Award, Lightbulb
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { UnifiedVocabularyService, VocabularyItem } from '../../services/unifiedVocabularyService';
import Link from 'next/link';

interface WeakWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  subcategory: string;
  accuracy: number;
  totalAttempts: number;
  correctAttempts: number;
  lastPracticed: string;
  difficultyLevel: string;
  recommendedGames: string[];
  // FSRS Memory Data
  fsrsData?: {
    difficulty: number;      // 1-10 scale
    stability: number;       // Days
    retrievability: number;  // 0-1 probability
    optimalInterval: number; // Days until next review
    masteryLevel: 'new' | 'learning' | 'review' | 'relearning';
    reviewCount: number;
    lapseCount: number;
  };
}

interface StrongWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  subcategory: string;
  accuracy: number;
  totalAttempts: number;
  masteryLevel: number;
  lastPracticed: string;
  // FSRS Memory Data
  fsrsData?: {
    difficulty: number;
    stability: number;
    retrievability: number;
    optimalInterval: number;
    masteryLevel: 'new' | 'learning' | 'review' | 'relearning';
    reviewCount: number;
    lapseCount: number;
  };
}

interface AIRecommendation {
  type: 'game' | 'practice' | 'review';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  targetWords: string[];
}

interface AnalysisData {
  weakWords: WeakWord[];
  strongWords: StrongWord[];
  recommendations: AIRecommendation[];
  summary: {
    totalWords: number;
    weakWordsCount: number;
    strongWordsCount: number;
    averageAccuracy: number;
  };
}

export default function WeakWordsAnalysis() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [vocabularyService] = useState(() => new UnifiedVocabularyService(supabase));
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'weak' | 'strong' | 'recommendations'>('weak');
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<string>('');
  const [availableFilters, setAvailableFilters] = useState<any>(null);

  // Language display mapping
  const languageDisplayNames: { [key: string]: string } = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'en': 'English',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian'
  };

  // Get filtered options for cascading filters
  const getFilteredOptions = () => {
    if (!availableFilters) return { categories: [], subcategories: [], curriculumLevels: [] };

    // This would ideally come from the API, but for now we'll use the full lists
    // In a real implementation, the API should return filtered options based on selected filters
    return {
      categories: availableFilters.categories || [],
      subcategories: availableFilters.subcategories || [],
      curriculumLevels: availableFilters.curriculumLevels || []
    };
  };

  useEffect(() => {
    if (user) {
      fetchAnalysisData();
    }
  }, [user]);

  // Refetch data when filters change
  useEffect(() => {
    if (user && availableFilters) {
      fetchAnalysisData();
    }
  }, [selectedLanguage, selectedCategory, selectedSubcategory, selectedCurriculumLevel]);

  // Reset dependent filters when parent filter changes
  useEffect(() => {
    // Reset curriculum level, category, and subcategory when language changes
    setSelectedCurriculumLevel('');
    setSelectedCategory('');
    setSelectedSubcategory('');
  }, [selectedLanguage]);

  useEffect(() => {
    // Reset category and subcategory when curriculum level changes
    setSelectedCategory('');
    setSelectedSubcategory('');
  }, [selectedCurriculumLevel]);

  useEffect(() => {
    // Reset subcategory when category changes
    setSelectedSubcategory('');
  }, [selectedCategory]);

  const fetchAnalysisData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get vocabulary data using unified service
      const { items, stats } = await vocabularyService.getVocabularyData(user.id);

      // Apply filters
      let filteredItems = items;
      if (selectedLanguage) {
        filteredItems = filteredItems.filter(item => item.language === selectedLanguage);
      }
      if (selectedCategory) {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
      }
      if (selectedSubcategory) {
        filteredItems = filteredItems.filter(item => item.subcategory === selectedSubcategory);
      }
      if (selectedCurriculumLevel) {
        filteredItems = filteredItems.filter(item => item.curriculumLevel === selectedCurriculumLevel);
      }

      // Get weak and strong words
      const weakWords = filteredItems.filter(item => item.isStruggling);
      const strongWords = filteredItems.filter(item => item.isMastered);

      // Create analysis data
      const analysisData: AnalysisData = {
        weakWords: weakWords.map(item => ({
          id: item.id,
          word: item.word,
          translation: item.translation,
          category: item.category,
          subcategory: item.subcategory,
          accuracy: item.accuracy,
          totalAttempts: item.totalEncounters,
          correctAttempts: item.correctEncounters,
          lastPracticed: item.lastEncountered || '',
          difficultyLevel: item.accuracy < 50 ? 'Very Hard' : item.accuracy < 70 ? 'Hard' : 'Medium',
          recommendedGames: ['VocabMaster', 'Word Blast'],
          fsrsData: item.fsrsDifficulty ? {
            difficulty: item.fsrsDifficulty,
            stability: item.fsrsStability || 0,
            retrievability: item.fsrsRetrievability || 0,
            optimalInterval: 1,
            masteryLevel: 'learning',
            reviewCount: item.totalEncounters,
            lapseCount: item.totalEncounters - item.correctEncounters
          } : undefined
        })),
        strongWords: strongWords.map(item => ({
          id: item.id,
          word: item.word,
          translation: item.translation,
          category: item.category,
          subcategory: item.subcategory,
          accuracy: item.accuracy,
          totalAttempts: item.totalEncounters,
          masteryLevel: item.masteryLevel,
          lastPracticed: item.lastEncountered || '',
          fsrsData: item.fsrsDifficulty ? {
            difficulty: item.fsrsDifficulty,
            stability: item.fsrsStability || 0,
            retrievability: item.fsrsRetrievability || 0,
            optimalInterval: 1,
            masteryLevel: 'review',
            reviewCount: item.totalEncounters,
            lapseCount: item.totalEncounters - item.correctEncounters
          } : undefined
        })),
        recommendations: [
          {
            type: 'practice',
            title: 'Focus on Weak Words',
            description: `Practice your ${weakWords.length} struggling words`,
            action: 'Practice Now',
            priority: 'high',
            estimatedTime: '15-20 min',
            targetWords: weakWords.slice(0, 5).map(w => w.word)
          }
        ],
        summary: {
          weakWordsCount: weakWords.length,
          strongWordsCount: strongWords.length,
          averageAccuracy: stats.averageAccuracy
        },
        availableFilters: {
          languages: [...new Set(items.map(item => item.language))],
          categories: [...new Set(items.map(item => item.category))],
          subcategories: [...new Set(items.map(item => item.subcategory))],
          curriculumLevels: [...new Set(items.map(item => item.curriculumLevel))]
        }
      };

      setData(analysisData);
      setAvailableFilters(analysisData.availableFilters);
    } catch (err) {
      console.error('Error fetching weak words analysis:', err);
      setError('Failed to load vocabulary analysis. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalysisData();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return 'text-green-600 bg-green-50';
    if (accuracy >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatLastPracticed = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your vocabulary progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAnalysisData}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
        <p className="text-gray-500">Start practicing vocabulary to see your analysis!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Vocabulary Analysis</h1>
            <p className="text-blue-100">Discover your strengths and areas for improvement</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{data.summary.totalWords}</div>
            <div className="text-sm text-blue-100">Total Words</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-300">{data.summary.weakWordsCount}</div>
            <div className="text-sm text-blue-100">Weak Words</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-300">{data.summary.strongWordsCount}</div>
            <div className="text-sm text-blue-100">Strong Words</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{data.summary.averageAccuracy}%</div>
            <div className="text-sm text-blue-100">Avg Accuracy</div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      {availableFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Vocabulary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Filter - First */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Languages</option>
                {availableFilters.languages?.map((lang: string) => (
                  <option key={lang} value={lang}>
                    {languageDisplayNames[lang] || lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Curriculum Level Filter - Second */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Level
              </label>
              <select
                value={selectedCurriculumLevel}
                onChange={(e) => setSelectedCurriculumLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedLanguage}
              >
                <option value="">All Levels</option>
                {availableFilters.curriculumLevels?.map((level: string) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {!selectedLanguage && (
                <p className="text-xs text-gray-500 mt-1">Select a language first</p>
              )}
            </div>

            {/* Category Filter - Third */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCurriculumLevel}
              >
                <option value="">All Categories</option>
                {availableFilters.categories?.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {!selectedCurriculumLevel && (
                <p className="text-xs text-gray-500 mt-1">Select curriculum level first</p>
              )}
            </div>

            {/* Subcategory Filter - Fourth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCategory}
              >
                <option value="">All Subcategories</option>
                {availableFilters.subcategories?.map((subcat: string) => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
              {!selectedCategory && (
                <p className="text-xs text-gray-500 mt-1">Select category first</p>
              )}
            </div>
          </div>

          {/* Applied Filters Display */}
          {(selectedLanguage || selectedCategory || selectedSubcategory || selectedCurriculumLevel) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Applied filters:</span>
              {selectedLanguage && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Language: {languageDisplayNames[selectedLanguage] || selectedLanguage}
                  <button
                    onClick={() => setSelectedLanguage('')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSubcategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Subcategory: {selectedSubcategory}
                  <button
                    onClick={() => setSelectedSubcategory('')}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCurriculumLevel && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Level: {selectedCurriculumLevel}
                  <button
                    onClick={() => setSelectedCurriculumLevel('')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'weak', label: 'Weak Words', icon: TrendingDown, count: data.weakWords.length },
              { id: 'strong', label: 'Strong Words', icon: TrendingUp, count: data.strongWords.length },
              { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb, count: data.recommendations?.length || 0 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'weak' && (
              <motion.div
                key="weak"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {data.weakWords.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Words That Need Practice ({data.weakWords.length})
                      </h3>
                      <Link
                        href="/student-dashboard/vocabulary/practice?focus=weak"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Practice Weak Words</span>
                      </Link>
                    </div>

                    <div className="grid gap-4">
                      {data.weakWords.map((word, index) => (
                        <div key={word.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg font-semibold text-gray-900">{word.word}</span>
                                <span className="text-gray-600">→</span>
                                <span className="text-gray-700">{word.translation}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccuracyColor(word.accuracy)}`}>
                                  {word.accuracy}% accuracy
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>{word.category}</span>
                                {word.subcategory && <span>• {word.subcategory}</span>}
                                <span>• {word.correctAttempts}/{word.totalAttempts} correct</span>
                                <span>• Last practiced: {formatLastPracticed(word.lastPracticed)}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {word.recommendedGames?.slice(0, 2).map((game) => (
                                <span key={game} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {game}
                                </span>
                              )) || null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Job!</h3>
                    <p className="text-gray-600">You don't have any weak words right now. Keep up the excellent work!</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'strong' && (
              <motion.div
                key="strong"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {data.strongWords.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Words You've Mastered ({data.strongWords.length})
                      </h3>
                      <Link
                        href="/student-dashboard/vocabulary/review?focus=strong"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Star className="h-4 w-4" />
                        <span>Review Strong Words</span>
                      </Link>
                    </div>

                    <div className="grid gap-4">
                      {data.strongWords.map((word) => (
                        <div key={word.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg font-semibold text-gray-900">{word.word}</span>
                                <span className="text-gray-600">→</span>
                                <span className="text-gray-700">{word.translation}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccuracyColor(word.accuracy)}`}>
                                  {word.accuracy}% accuracy
                                </span>
                                <div className="flex items-center">
                                  {[...Array(word.masteryLevel)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>{word.category}</span>
                                {word.subcategory && <span>• {word.subcategory}</span>}
                                <span>• {word.totalAttempts} attempts</span>
                                <span>• Last practiced: {formatLastPracticed(word.lastPracticed)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">Mastery Level {word.masteryLevel}</div>
                              <div className="text-xs text-gray-500">Keep it up!</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Strong Words Yet</h3>
                    <p className="text-gray-600">Keep practicing to build up your vocabulary mastery!</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {data.recommendations.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Personalized Learning Recommendations
                    </h3>

                    <div className="space-y-4">
                      {data.recommendations.map((rec, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)} mt-2`}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-500">{rec.estimatedTime}</span>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4">{rec.description}</p>

                              {rec.targetWords.length > 0 && (
                                <div className="mb-4">
                                  <div className="text-sm font-medium text-gray-700 mb-2">Target Words:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {rec.targetWords.slice(0, 8).map((word) => (
                                      <span key={word} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                        {word}
                                      </span>
                                    ))}
                                    {rec.targetWords.length > 8 && (
                                      <span className="text-sm text-gray-500">+{rec.targetWords.length - 8} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              <Link
                                href={rec.action}
                                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                {rec.type === 'game' && <Gamepad2 className="h-4 w-4" />}
                                {rec.type === 'practice' && <PlayCircle className="h-4 w-4" />}
                                {rec.type === 'review' && <BookOpen className="h-4 w-4" />}
                                <span>
                                  {rec.type === 'game' && 'Play Game'}
                                  {rec.type === 'practice' && 'Start Practice'}
                                  {rec.type === 'review' && 'Review Words'}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
                    <p className="text-gray-600">Practice more vocabulary to get personalized recommendations!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
