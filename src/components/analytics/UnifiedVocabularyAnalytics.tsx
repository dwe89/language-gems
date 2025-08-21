'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, BookOpen, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface AnalyticsData {
  totalWords: number;
  categorizedWords: number;
  uncategorizedWords: number;
  averageConfidence: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    confidence: number;
  }>;
  sourceBreakdown: Array<{
    source: 'centralized' | 'enhanced';
    count: number;
    percentage: number;
  }>;
  performanceByCategory: Array<{
    category: string;
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
  }>;
  studentEngagement: Array<{
    date: string;
    activeStudents: number;
    wordsLearned: number;
  }>;
}

interface UnifiedVocabularyAnalyticsProps {
  teacherId?: string;
  classId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export default function UnifiedVocabularyAnalytics({
  teacherId,
  classId,
  timeRange = '30d'
}: UnifiedVocabularyAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchAnalyticsData();
  }, [teacherId, classId, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch unified vocabulary analytics
      const { data: vocabularyData, error: vocabError } = await supabase
        .from('unified_vocabulary_analytics')
        .select('*')
        .gte('created_at', getDateRange(timeRange));

      if (vocabError) throw vocabError;

      // Fetch performance data
      const { data: performanceData, error: perfError } = await supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          enhanced_vocabulary_items!inner(effective_category, effective_subcategory),
          centralized_vocabulary!inner(category, subcategory)
        `)
        .gte('created_at', getDateRange(timeRange));

      if (perfError) throw perfError;

      // Process the data
      const analytics = processAnalyticsData(vocabularyData, performanceData);
      setAnalyticsData(analytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range: string): string => {
    const now = new Date();
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[range] || 30;
    
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return startDate.toISOString();
  };

  const processAnalyticsData = (vocabularyData: any[], performanceData: any[]): AnalyticsData => {
    // Calculate basic metrics
    const totalWords = vocabularyData.length;
    const categorizedWords = vocabularyData.filter(item => 
      item.category && item.category !== 'Uncategorized'
    ).length;
    const uncategorizedWords = totalWords - categorizedWords;
    
    const averageConfidence = vocabularyData.reduce((sum, item) => 
      sum + (item.category_confidence || 0), 0
    ) / totalWords;

    // Category breakdown
    const categoryMap = new Map<string, { count: number; confidenceSum: number }>();
    vocabularyData.forEach(item => {
      const category = item.category || 'Uncategorized';
      const existing = categoryMap.get(category) || { count: 0, confidenceSum: 0 };
      categoryMap.set(category, {
        count: existing.count + 1,
        confidenceSum: existing.confidenceSum + (item.category_confidence || 0)
      });
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      confidence: data.confidenceSum / data.count
    }));

    // Source breakdown
    const sourceMap = new Map<string, number>();
    vocabularyData.forEach(item => {
      const source = item.source_type;
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });

    const sourceBreakdown = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source: source as 'centralized' | 'enhanced',
      count,
      percentage: (count / totalWords) * 100
    }));

    // Performance by category (mock data for now)
    const performanceByCategory = categoryBreakdown.map(cat => ({
      category: cat.category,
      totalAttempts: Math.floor(Math.random() * 100) + 50,
      correctAttempts: Math.floor(Math.random() * 80) + 20,
      accuracy: Math.random() * 0.4 + 0.6 // 60-100%
    }));

    // Student engagement (mock data for now)
    const studentEngagement = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        activeStudents: Math.floor(Math.random() * 20) + 10,
        wordsLearned: Math.floor(Math.random() * 50) + 25
      };
    });

    return {
      totalWords,
      categorizedWords,
      uncategorizedWords,
      averageConfidence,
      categoryBreakdown,
      sourceBreakdown,
      performanceByCategory,
      studentEngagement
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vocabulary Analytics</h2>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => {/* Handle time range change */}}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Vocabulary</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalWords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Categorized</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.categorizedWords}</p>
              <p className="text-xs text-gray-500">
                {Math.round((analyticsData.categorizedWords / analyticsData.totalWords) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.uncategorizedWords}</p>
              <p className="text-xs text-gray-500">Uncategorized</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">AI Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(analyticsData.averageConfidence * 100)}%
              </p>
              <p className="text-xs text-gray-500">Average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, count }) => `${category}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.sourceBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.performanceByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value, name) => [
              name === 'accuracy' ? `${Math.round(value as number * 100)}%` : value,
              name === 'accuracy' ? 'Accuracy' : name
            ]} />
            <Bar dataKey="totalAttempts" fill="#94A3B8" name="Total Attempts" />
            <Bar dataKey="correctAttempts" fill="#10B981" name="Correct Attempts" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Engagement Trend */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Engagement Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.studentEngagement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="activeStudents" stroke="#3B82F6" name="Active Students" />
            <Line type="monotone" dataKey="wordsLearned" stroke="#10B981" name="Words Learned" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
