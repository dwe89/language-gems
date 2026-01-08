'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Target, Clock, Star,
  PlayCircle, BookOpen, Zap, AlertCircle, CheckCircle,
  RefreshCw, Filter, Eye, Gamepad2, Award, ChevronDown,
  ChevronRight, PieChart, Activity, Brain
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { EnhancedStudentAnalyticsService, CategoryMastery } from '../../services/enhancedStudentAnalyticsService';
import Link from 'next/link';

interface SubcategoryPerformance {
  subcategory: string;
  totalWords: number;
  masteredWords: number;
  averageAccuracy: number;
  timeSpent: number;
  lastPracticed: string;
  weakWords: number;
  strongWords: number;
}

interface CategoryPerformanceData extends CategoryMastery {
  subcategories: SubcategoryPerformance[];
  trend: 'improving' | 'declining' | 'stable';
  recommendedActions: string[];
  priority: 'high' | 'medium' | 'low';
}

interface PerformanceBreakdownData {
  categories: CategoryPerformanceData[];
  overallStats: {
    totalCategories: number;
    strongCategories: number;
    weakCategories: number;
    averageAccuracy: number;
  };
}

export default function CategoryPerformanceBreakdown() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [data, setData] = useState<PerformanceBreakdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'accuracy' | 'mastery' | 'time'>('accuracy');
  const [filterBy, setFilterBy] = useState<'all' | 'strong' | 'weak'>('all');

  useEffect(() => {
    if (user) {
      fetchPerformanceData();
    }
  }, [user]);

  const fetchPerformanceData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const analyticsService = new EnhancedStudentAnalyticsService(supabase);
      const analyticsData = await analyticsService.getStudentAnalytics(user.id);
      
      // Transform the data to include subcategory breakdown and additional metrics
      const categoriesWithSubcategories = await Promise.all(
        analyticsData.vocabularyMastery.categoryBreakdown.map(async (category) => {
          const subcategories = await getSubcategoryPerformance(user.id, category.category);
          
          return {
            ...category,
            subcategories,
            trend: calculateTrend(category),
            recommendedActions: generateRecommendations(category),
            priority: calculatePriority(category)
          };
        })
      );

      const overallStats = {
        totalCategories: categoriesWithSubcategories.length,
        strongCategories: categoriesWithSubcategories.filter(c => c.averageAccuracy >= 80).length,
        weakCategories: categoriesWithSubcategories.filter(c => c.averageAccuracy < 70).length,
        averageAccuracy: Math.round(
          categoriesWithSubcategories.reduce((sum, c) => sum + c.averageAccuracy, 0) / 
          categoriesWithSubcategories.length
        )
      };

      setData({
        categories: categoriesWithSubcategories,
        overallStats
      });

    } catch (err) {
      console.error('Error fetching category performance:', err);
      setError('Failed to load category performance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoryPerformance = async (studentId: string, category: string): Promise<SubcategoryPerformance[]> => {
    // This would typically fetch from the API, but for now we'll simulate it
    // In a real implementation, this would query the database for subcategory-specific data
    return [
      {
        subcategory: `${category}_basic`,
        totalWords: 15,
        masteredWords: 12,
        averageAccuracy: 85,
        timeSpent: 120,
        lastPracticed: new Date().toISOString(),
        weakWords: 2,
        strongWords: 10
      },
      {
        subcategory: `${category}_advanced`,
        totalWords: 10,
        masteredWords: 6,
        averageAccuracy: 65,
        timeSpent: 90,
        lastPracticed: new Date(Date.now() - 86400000).toISOString(),
        weakWords: 4,
        strongWords: 6
      }
    ];
  };

  const calculateTrend = (category: CategoryMastery): 'improving' | 'declining' | 'stable' => {
    // This would calculate based on historical data
    // For now, we'll simulate based on accuracy
    if (category.averageAccuracy >= 80) return 'improving';
    if (category.averageAccuracy < 60) return 'declining';
    return 'stable';
  };

  const generateRecommendations = (category: CategoryMastery): string[] => {
    const recommendations = [];
    
    if (category.averageAccuracy < 70) {
      recommendations.push(`Focus on ${category.category} basics`);
      recommendations.push('Practice with memory games');
    }
    
    if (category.masteredWords / category.totalWords < 0.5) {
      recommendations.push('Increase practice frequency');
    }
    
    if (category.timeSpent < 300) { // Less than 5 minutes
      recommendations.push('Spend more time on this category');
    }

    return recommendations;
  };

  const calculatePriority = (category: CategoryMastery): 'high' | 'medium' | 'low' => {
    if (category.averageAccuracy < 60) return 'high';
    if (category.averageAccuracy < 80) return 'medium';
    return 'low';
  };

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (accuracy >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAndSortedCategories = data?.categories
    .filter(category => {
      if (filterBy === 'strong') return category.averageAccuracy >= 80;
      if (filterBy === 'weak') return category.averageAccuracy < 70;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'accuracy':
          return b.averageAccuracy - a.averageAccuracy;
        case 'mastery':
          return (b.masteredWords / b.totalWords) - (a.masteredWords / a.totalWords);
        case 'time':
          return b.timeSpent - a.timeSpent;
        default:
          return 0;
      }
    }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing category performance...</p>
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
          onClick={fetchPerformanceData}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || data.categories.length === 0) {
    return (
      <div className="text-center py-12">
        <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Category Data Available</h3>
        <p className="text-gray-500">Start practicing vocabulary to see your category performance!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Overall Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Category Performance</h1>
            <p className="text-indigo-100">Track your progress across vocabulary categories</p>
          </div>
          <button
            onClick={fetchPerformanceData}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{data.overallStats.totalCategories}</div>
            <div className="text-sm text-indigo-100">Total Categories</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-300">{data.overallStats.strongCategories}</div>
            <div className="text-sm text-indigo-100">Strong Categories</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-300">{data.overallStats.weakCategories}</div>
            <div className="text-sm text-indigo-100">Weak Categories</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{data.overallStats.averageAccuracy}%</div>
            <div className="text-sm text-indigo-100">Avg Accuracy</div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="strong">Strong (≥80%)</option>
                <option value="weak">Weak (&lt;70%)</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="accuracy">Accuracy</option>
                <option value="mastery">Mastery Rate</option>
                <option value="time">Time Spent</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedCategories.length} of {data.categories.length} categories
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {filteredAndSortedCategories.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Category Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category.category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {expandedCategories.has(category.category) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {category.category.replace('_', ' ')}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getTrendIcon(category.trend)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(category.priority)}`}>
                      {category.priority} priority
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold px-3 py-1 rounded-lg border ${getAccuracyColor(category.averageAccuracy)}`}>
                      {Math.round(category.averageAccuracy)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Accuracy</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {category.masteredWords}/{category.totalWords}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Mastered</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {Math.round(category.timeSpent / 60)}m
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Time Spent</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Mastery Progress</span>
                  <span>{Math.round((category.masteredWords / category.totalWords) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(category.masteredWords / category.totalWords) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedCategories.has(category.category) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-6 space-y-6">
                    {/* Subcategories */}
                    {category.subcategories.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Subcategory Breakdown</h4>
                        <div className="grid gap-3">
                          {category.subcategories.map((sub) => (
                            <div key={sub.subcategory} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-900 capitalize">
                                    {sub.subcategory.replace('_', ' ')}
                                  </h5>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                    <span>{sub.masteredWords}/{sub.totalWords} mastered</span>
                                    <span>•</span>
                                    <span>{sub.weakWords} weak words</span>
                                    <span>•</span>
                                    <span>{Math.round(sub.timeSpent / 60)}m practiced</span>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getAccuracyColor(sub.averageAccuracy)}`}>
                                  {Math.round(sub.averageAccuracy)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {category.recommendedActions.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Recommended Actions</h4>
                        <div className="space-y-2">
                          {category.recommendedActions.map((action, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <Target className="h-4 w-4 text-blue-500" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      <Link
                        href={`/student-dashboard/activities?category=${category.category}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Gamepad2 className="h-4 w-4" />
                        <span>Practice Games</span>
                      </Link>

                      <Link
                        href={`/student-dashboard/vocabulary/practice?category=${category.category}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Practice Words</span>
                      </Link>

                      <Link
                        href={`/student-dashboard/vocabulary/review?category=${category.category}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Review</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedCategories.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Categories Match Your Filter</h3>
          <p className="text-gray-500">Try adjusting your filter settings to see more categories.</p>
          <button
            onClick={() => setFilterBy('all')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show All Categories
          </button>
        </div>
      )}
    </div>
  );
}
