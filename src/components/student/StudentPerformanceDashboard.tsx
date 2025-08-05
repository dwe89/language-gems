'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Trophy, Target, Clock, Star, Zap, Brain, Heart,
  BookOpen, Award, Flame, Calendar, BarChart3, PieChart,
  ChevronRight, ChevronDown, RefreshCw, Filter, Eye,
  Gem, Crown, Medal, Sparkles, Activity, Users, PlayCircle
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { 
  EnhancedStudentAnalyticsService, 
  StudentAnalyticsData,
  StudentOverviewMetrics,
  StudentGamePerformance,
  StudentAchievement,
  StudentStreakData,
  VocabularyMasteryData,
  SkillBreakdownData,
  MotivationalMetrics
} from '../../services/enhancedStudentAnalyticsService';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface StudentPerformanceDashboardProps {
  studentId?: string;
  dateRange?: { from: string; to: string };
  viewMode?: 'overview' | 'detailed' | 'progress' | 'achievements';
  showComparisons?: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  isLoading?: boolean;
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

// =====================================================
// UTILITY COMPONENTS
// =====================================================

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  isLoading = false
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center text-sm font-medium ${
          trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      {isLoading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  </motion.div>
);

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function StudentPerformanceDashboard({
  studentId,
  dateRange,
  viewMode = 'overview',
  showComparisons = false
}: StudentPerformanceDashboardProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // State
  const [analyticsService] = useState(() => new EnhancedStudentAnalyticsService(supabase));
  const [analyticsData, setAnalyticsData] = useState<StudentAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState(viewMode);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  const effectiveStudentId = studentId || user?.id;

  // Load analytics data
  useEffect(() => {
    if (effectiveStudentId) {
      loadAnalyticsData();
    }
  }, [effectiveStudentId, dateRange, selectedTimeRange]);

  const loadAnalyticsData = async () => {
    if (!effectiveStudentId) return;

    try {
      setLoading(true);
      
      const timeRange = dateRange || getDateRangeFromSelection(selectedTimeRange);
      const data = await analyticsService.getStudentAnalytics(effectiveStudentId, timeRange);
      
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load student analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const getDateRangeFromSelection = (range: string) => {
    const now = new Date();
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[range] || 30;

    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return {
      from: from.toISOString(),
      to: now.toISOString()
    };
  };

  // Render overview section
  const renderOverview = () => {
    if (!analyticsData) return null;

    const { overview, streakData, motivationalMetrics } = analyticsData;

    return (
      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Current Level"
            value={overview.currentLevel}
            subtitle={`${overview.xpToNextLevel} XP to next level`}
            icon={<Crown className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            isLoading={loading}
          />
          <MetricCard
            title="Learning Streak"
            value={`${streakData.currentStreak} days`}
            subtitle={`Best: ${streakData.longestStreak} days`}
            icon={<Flame className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-red-500 to-pink-500"
            isLoading={loading}
          />
          <MetricCard
            title="Total XP"
            value={overview.totalXP.toLocaleString()}
            subtitle="Experience points earned"
            icon={<Zap className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-blue-500 to-purple-500"
            trend={motivationalMetrics.motivationScore > 75 ? 15 : motivationalMetrics.motivationScore > 50 ? 5 : -2}
            isLoading={loading}
          />
          <MetricCard
            title="Achievements"
            value={overview.achievementCount}
            subtitle="Badges earned"
            icon={<Award className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-green-500 to-teal-500"
            isLoading={loading}
          />
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assignment Progress</h3>
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <ProgressRing
                progress={(overview.completedAssignments / Math.max(overview.totalAssignments, 1)) * 100}
                color="#10B981"
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {overview.completedAssignments}/{overview.totalAssignments}
              </p>
              <p className="text-sm text-gray-600">Assignments completed</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="text-lg font-semibold text-gray-900">{overview.averageScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overview.averageScore}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="text-lg font-semibold text-gray-900">{overview.averageAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overview.averageAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Time & Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{Math.round(overview.totalTimeSpent / 60)}h</p>
                <p className="text-sm text-gray-600">Total learning time</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-900">{overview.totalGamesPlayed}</p>
                  <p className="text-xs text-gray-600">Games played</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-900">{overview.wordsLearned}</p>
                  <p className="text-xs text-gray-600">Words learned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Performance</h2>
          <p className="text-gray-600 mt-1">Track your learning progress and achievements</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'progress', label: 'Progress', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'detailed', label: 'Detailed', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentView === 'overview' && renderOverview()}
          {currentView === 'progress' && renderProgress()}
          {currentView === 'achievements' && renderAchievements()}
          {currentView === 'detailed' && renderDetailed()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Render progress section
  function renderProgress() {
    if (!analyticsData) return null;

    const { progressTrends, vocabularyMastery, skillBreakdown, weeklyActivity } = analyticsData;

    return (
      <div className="space-y-6">
        {/* Skill Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Breakdown</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Object.entries(skillBreakdown).map(([skill, score]) => (
              <div key={skill} className="text-center">
                <div className="mb-3">
                  <ProgressRing
                    progress={score}
                    size={80}
                    strokeWidth={6}
                    color={getSkillColor(skill)}
                    showPercentage={false}
                  />
                </div>
                <h4 className="text-sm font-medium text-gray-900 capitalize">{skill}</h4>
                <p className="text-lg font-bold text-gray-900">{score}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vocabulary Mastery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vocabulary Mastery</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mastery Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mastered Words</span>
                <span className="text-lg font-semibold text-green-600">
                  {vocabularyMastery.masteredWords}/{vocabularyMastery.totalWords}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${vocabularyMastery.masteryRate}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{vocabularyMastery.wordsInProgress}</p>
                  <p className="text-xs text-gray-600">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-orange-600">{vocabularyMastery.wordsNeedingReview}</p>
                  <p className="text-xs text-gray-600">Need Review</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{vocabularyMastery.masteredWords}</p>
                  <p className="text-xs text-gray-600">Mastered</p>
                </div>
              </div>
            </div>

            {/* Recently Learned */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Recently Learned</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {vocabularyMastery.recentlyLearned.map((word, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{word.word}</p>
                      <p className="text-sm text-gray-600">{word.translation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{word.accuracy}%</p>
                      <p className="text-xs text-gray-500">{word.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h3>

          <div className="space-y-4">
            {weeklyActivity.map((week, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">
                  {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">XP Earned</span>
                    <span className="text-sm font-medium">{week.xpEarned}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (week.xpEarned / 500) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{week.minutesPlayed}min</p>
                  <p className="text-xs text-gray-500">{week.gamesPlayed} games</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render achievements section
  function renderAchievements() {
    if (!analyticsData) return null;

    const { achievements, streakData } = analyticsData;

    return (
      <div className="space-y-6">
        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Achievements"
            value={achievements.length}
            icon={<Trophy className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
          <MetricCard
            title="Rare Badges"
            value={achievements.filter(a => a.rarity === 'rare' || a.rarity === 'epic').length}
            icon={<Medal className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <MetricCard
            title="Recent Achievements"
            value={achievements.filter(a => a.isNew).length}
            subtitle="Last 7 days"
            icon={<Sparkles className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-green-500 to-teal-500"
          />
          <MetricCard
            title="XP from Achievements"
            value={achievements.reduce((sum, a) => sum + a.xpReward, 0)}
            icon={<Zap className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
        </div>

        {/* Achievements Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Achievements</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative p-4 rounded-lg border-2 ${
                  achievement.isNew
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                } hover:shadow-md transition-shadow`}
              >
                {achievement.isNew && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    New!
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                    <Award className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRarityBadgeColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                      <span className="text-sm font-medium text-blue-600">+{achievement.xpReward} XP</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Streak Rewards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Streak Rewards</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {streakData.streakRewards.map((reward, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  reward.achieved
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-full mb-3 ${
                    reward.achieved ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <Flame className="h-6 w-6 text-white" />
                  </div>

                  <h4 className="font-medium text-gray-900">{reward.streakLength} Day Streak</h4>
                  <p className="text-sm text-gray-600 mt-1">{reward.reward}</p>
                  <p className="text-sm font-medium text-blue-600 mt-2">+{reward.xpBonus} XP</p>

                  {reward.achieved ? (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Achieved!
                    </span>
                  ) : (
                    <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {reward.streakLength - streakData.currentStreak} days to go
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Helper functions
  function getSkillColor(skill: string): string {
    const colors: Record<string, string> = {
      vocabulary: '#3B82F6',
      grammar: '#10B981',
      listening: '#F59E0B',
      reading: '#EF4444',
      writing: '#8B5CF6',
      speaking: '#06B6D4'
    };
    return colors[skill] || '#6B7280';
  }

  function getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity] || 'bg-gray-500';
  }

  function getRarityBadgeColor(rarity: string): string {
    const colors: Record<string, string> = {
      common: 'bg-gray-100 text-gray-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-yellow-100 text-yellow-800'
    };
    return colors[rarity] || 'bg-gray-100 text-gray-800';
  }

  // Render detailed section with real analytics
  function renderDetailed() {
    if (!analyticsData) return null;

    const { overview, gamePerformance, vocabularyMastery, weeklyActivity } = analyticsData;

    return (
      <div className="space-y-6">
        {/* Performance Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Breakdown</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Accuracy Trends */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Accuracy Trends</h4>
              <div className="text-2xl font-bold text-green-600">
                {overview.averageAccuracy.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">
                Average accuracy across all games
              </p>
            </div>

            {/* Time Efficiency */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Study Time</h4>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(overview.totalTimeSpent)} min
              </div>
              <p className="text-sm text-gray-600">
                Total time spent learning
              </p>
            </div>

            {/* Games Completed */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Games Played</h4>
              <div className="text-2xl font-bold text-purple-600">
                {overview.totalGamesPlayed}
              </div>
              <p className="text-sm text-gray-600">
                Total game sessions completed
              </p>
            </div>
          </div>
        </div>

        {/* Vocabulary Mastery Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vocabulary Analysis</h3>

          {vocabularyMastery && vocabularyMastery.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Strong Categories</h4>
                  <div className="space-y-2">
                    {vocabularyMastery
                      .filter(v => v.masteryLevel >= 3)
                      .slice(0, 3)
                      .map((vocab, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{vocab.category}</span>
                          <span className="text-xs text-green-600 font-medium">
                            {Math.round(vocab.accuracy)}% accuracy
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                  <div className="space-y-2">
                    {vocabularyMastery
                      .filter(v => v.masteryLevel < 3)
                      .slice(0, 3)
                      .map((vocab, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{vocab.category}</span>
                          <span className="text-xs text-orange-600 font-medium">
                            {Math.round(vocab.accuracy)}% accuracy
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No vocabulary data available yet</p>
              <p className="text-xs">Play more games to see detailed vocabulary analysis!</p>
            </div>
          )}
        </div>

        {/* Learning Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personalized Recommendations</h3>

          <div className="space-y-4">
            {overview.averageAccuracy < 70 && (
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Focus on Accuracy</h4>
                  <p className="text-sm text-blue-700">
                    Your accuracy is {overview.averageAccuracy.toFixed(1)}%. Try slowing down and focusing on correct answers rather than speed.
                  </p>
                </div>
              </div>
            )}

            {overview.totalGamesPlayed < 10 && (
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <PlayCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Keep Playing!</h4>
                  <p className="text-sm text-green-700">
                    You've played {overview.totalGamesPlayed} games. Try to play regularly to build consistency and improve your skills.
                  </p>
                </div>
              </div>
            )}

            {overview.currentStreak === 0 && (
              <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Build a Learning Streak</h4>
                  <p className="text-sm text-orange-700">
                    Start a daily learning streak! Even 5-10 minutes of practice each day can make a big difference.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
