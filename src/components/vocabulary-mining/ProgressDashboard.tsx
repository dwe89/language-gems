'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { useSupabase } from '../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../services/vocabulary-mining';
import { 
  TopicPerformance, 
  VocabularyAchievement, 
  DailyGoal,
  GemCollection 
} from '../../types/vocabulary-mining';
import {
  ProgressSummary,
  TopicPerformanceChart,
  DailyGoalProgress,
  RecentAchievements
} from './ProgressTracking';
import { GemGrid } from './GemDisplay';
import { 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';

interface ProgressDashboardProps {
  studentId?: string; // If provided, shows progress for specific student (teacher view)
}

export function ProgressDashboard({ studentId }: ProgressDashboardProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Progress data
  const [progressSummary, setProgressSummary] = useState<{
    totalGems: number;
    masteredGems: number;
    gemsNeedingReview: number;
    averageAccuracy: number;
    totalPracticeTime: number;
    currentStreak: number;
    topicPerformance: TopicPerformance[];
    recentAchievements: VocabularyAchievement[];
    dailyGoal: DailyGoal | null;
  } | null>(null);
  
  const [gemCollection, setGemCollection] = useState<GemCollection[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mastered' | 'needs_review'>('all');

  const targetStudentId = studentId || user?.id;

  useEffect(() => {
    if (targetStudentId) {
      loadProgressData();
    }
  }, [targetStudentId, selectedTimeRange]);

  const loadProgressData = async () => {
    if (!targetStudentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load comprehensive progress summary
      const summary = await miningService.getStudentProgressSummary(targetStudentId);
      setProgressSummary(summary);
      
      // Load gem collection
      const gems = await miningService.getGemCollection(targetStudentId);
      setGemCollection(gems);
      
    } catch (err: any) {
      console.error('Error loading progress data:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProgressData();
    setRefreshing(false);
  };

  const getFilteredGems = () => {
    switch (selectedFilter) {
      case 'mastered':
        return gemCollection.filter(gem => gem.masteryLevel >= 4);
      case 'needs_review':
        return gemCollection.filter(gem => 
          gem.nextReviewAt && gem.nextReviewAt <= new Date()
        );
      default:
        return gemCollection;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading progress data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Progress</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!progressSummary) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No progress data available</div>
      </div>
    );
  }

  const filteredGems = getFilteredGems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {studentId ? 'Student Progress' : 'My Progress'}
          </h2>
          <p className="text-gray-600 mt-1">
            Track your vocabulary mining journey and achievements
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Filter */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <ProgressSummary
        totalGems={progressSummary.totalGems}
        masteredGems={progressSummary.masteredGems}
        gemsNeedingReview={progressSummary.gemsNeedingReview}
        averageAccuracy={progressSummary.averageAccuracy}
        totalPracticeTime={progressSummary.totalPracticeTime}
        currentStreak={progressSummary.currentStreak}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Topic Performance */}
        <div className="lg:col-span-2 space-y-6">
          <TopicPerformanceChart topicPerformance={progressSummary.topicPerformance} />
          
          {/* Gem Collection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Gem Collection</h3>
              
              {/* Gem Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'mastered' | 'needs_review')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Gems ({gemCollection.length})</option>
                <option value="mastered">Mastered ({gemCollection.filter(g => g.masteryLevel >= 4).length})</option>
                <option value="needs_review">Needs Review ({gemCollection.filter(g => g.nextReviewAt && g.nextReviewAt <= new Date()).length})</option>
              </select>
            </div>
            
            {filteredGems.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredGems.slice(0, 12).map((gem) => (
                    <div key={gem.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        Gem Level {gem.gemLevel}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {gem.totalEncounters} encounters • {Math.round((gem.correctEncounters / gem.totalEncounters) * 100)}% accuracy
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Streak: {gem.currentStreak}
                        </span>
                        <span className="text-xs font-medium text-indigo-600">
                          Mastery: {gem.masteryLevel}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredGems.length > 12 && (
                  <div className="text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View All {filteredGems.length} Gems
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">No gems found for the selected filter</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Goals and Achievements */}
        <div className="space-y-6">
          <DailyGoalProgress dailyGoal={progressSummary.dailyGoal} />
          <RecentAchievements achievements={progressSummary.recentAchievements} />
        </div>
      </div>
    </div>
  );
}
