'use client';

import React from 'react';
import { 
  TopicPerformance, 
  VocabularyAchievement, 
  DailyGoal,
  MasteryLevel 
} from '../../types/vocabulary-mining';
import { 
  getMasteryInfo, 
  calculateDailyGoalProgress,
  formatDuration 
} from '../../utils/vocabulary-mining';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Award, 
  Calendar,
  BarChart3,
  Zap,
  Star,
  Trophy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ProgressSummaryProps {
  totalGems: number;
  masteredGems: number;
  gemsNeedingReview: number;
  averageAccuracy: number;
  totalPracticeTime: number;
  currentStreak: number;
}

export function ProgressSummary({
  totalGems,
  masteredGems,
  gemsNeedingReview,
  averageAccuracy,
  totalPracticeTime,
  currentStreak
}: ProgressSummaryProps) {
  const masteryPercentage = totalGems > 0 ? Math.round((masteredGems / totalGems) * 100) : 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Star className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Total Gems</p>
            <p className="text-2xl font-bold text-gray-900">{totalGems}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Trophy className="w-5 h-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Mastered</p>
            <p className="text-2xl font-bold text-gray-900">{masteredGems}</p>
            <p className="text-xs text-green-600">{masteryPercentage}%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Need Review</p>
            <p className="text-2xl font-bold text-gray-900">{gemsNeedingReview}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Accuracy</p>
            <p className="text-2xl font-bold text-gray-900">{averageAccuracy}%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Practice Time</p>
            <p className="text-2xl font-bold text-gray-900">{formatDuration(totalPracticeTime)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Streak</p>
            <p className="text-2xl font-bold text-gray-900">{currentStreak}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TopicPerformanceChartProps {
  topicPerformance: TopicPerformance[];
}

export function TopicPerformanceChart({ topicPerformance }: TopicPerformanceChartProps) {
  const sortedTopics = [...topicPerformance].sort((a, b) => b.masteryPercentage - a.masteryPercentage);
  const weakTopics = sortedTopics.filter(topic => topic.masteryPercentage < 70);
  const strongTopics = sortedTopics.filter(topic => topic.masteryPercentage >= 80);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Performance</h3>
      
      {/* Strong Topics */}
      {strongTopics.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Strong Topics ({strongTopics.length})
          </h4>
          <div className="space-y-2">
            {strongTopics.slice(0, 5).map((topic) => (
              <div key={`${topic.themeName}-${topic.topicName}`} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{topic.topicName}</span>
                  <span className="text-xs text-gray-500 ml-2">({topic.themeName})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${topic.masteryPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-green-600">{topic.masteryPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
            <TrendingDown className="w-4 h-4 mr-2" />
            Needs Attention ({weakTopics.length})
          </h4>
          <div className="space-y-2">
            {weakTopics.slice(0, 5).map((topic) => (
              <div key={`${topic.themeName}-${topic.topicName}`} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{topic.topicName}</span>
                  <span className="text-xs text-gray-500 ml-2">({topic.themeName})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${topic.masteryPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-red-600">{topic.masteryPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* All Topics Overview */}
      {sortedTopics.length > 10 && (
        <div className="text-center">
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All {sortedTopics.length} Topics
          </button>
        </div>
      )}
    </div>
  );
}

interface DailyGoalProgressProps {
  dailyGoal: DailyGoal | null;
}

export function DailyGoalProgress({ dailyGoal }: DailyGoalProgressProps) {
  if (!dailyGoal) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Goal</h3>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No daily goal set</p>
          <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            Set Daily Goal
          </button>
        </div>
      </div>
    );
  }
  
  const progress = calculateDailyGoalProgress(
    dailyGoal.wordsPracticed,
    dailyGoal.targetWords,
    dailyGoal.minutesPracticed,
    dailyGoal.targetMinutes
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Daily Goal</h3>
        {dailyGoal.goalCompleted && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Completed!</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Words Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Words Practiced</span>
            <span className="text-sm text-gray-600">
              {dailyGoal.wordsPracticed} / {dailyGoal.targetWords}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress.wordsProgress)}%` }}
            />
          </div>
        </div>
        
        {/* Time Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Practice Time</span>
            <span className="text-sm text-gray-600">
              {dailyGoal.minutesPracticed} / {dailyGoal.targetMinutes} min
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress.timeProgress)}%` }}
            />
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-lg font-bold text-indigo-600">{progress.overallProgress}%</span>
          </div>
        </div>
        
        {/* Streak */}
        {dailyGoal.streakCount > 0 && (
          <div className="flex items-center justify-center pt-2 border-t">
            <Zap className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {dailyGoal.streakCount} day streak!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface RecentAchievementsProps {
  achievements: VocabularyAchievement[];
}

export function RecentAchievements({ achievements }: RecentAchievementsProps) {
  if (achievements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No achievements yet</p>
          <p className="text-sm text-gray-500 mt-2">Keep practicing to earn your first achievement!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
      <div className="space-y-3">
        {achievements.slice(0, 5).map((achievement) => (
          <div key={achievement.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: achievement.achievementColor }}
            >
              {achievement.achievementIcon || '🏆'}
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-gray-900">{achievement.achievementName}</h4>
              {achievement.achievementDescription && (
                <p className="text-xs text-gray-600">{achievement.achievementDescription}</p>
              )}
              <p className="text-xs text-gray-500">
                {achievement.earnedAt.toLocaleDateString()}
              </p>
            </div>
            {achievement.pointsAwarded > 0 && (
              <div className="text-sm font-medium text-indigo-600">
                +{achievement.pointsAwarded} pts
              </div>
            )}
          </div>
        ))}
      </div>
      
      {achievements.length > 5 && (
        <div className="text-center mt-4">
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All Achievements
          </button>
        </div>
      )}
    </div>
  );
}
