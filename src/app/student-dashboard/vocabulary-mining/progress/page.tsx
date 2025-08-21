'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../services/vocabulary-mining';
import { ProgressDashboard } from '../../../../components/vocabulary-mining/ProgressDashboard';
// The following components were part of the older "vocabulary-mining" feature
// and have been sunset. Commenting out imports so the build doesn't fail.
// import { SpacedRepetitionAnalytics } from '../../../../components/vocabulary-mining/SpacedRepetitionAnalytics';
// import { SpacedRepetitionScheduler } from '../../../../components/vocabulary-mining/SpacedRepetitionScheduler';
import { 
  TopicPerformance, 
  VocabularyAchievement, 
  DailyGoal,
  GemCollection 
} from '../../../../types/vocabulary-mining';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  Award,
  BarChart3,
  Brain,
  Zap,
  Star,
  Trophy,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface DetailedProgress {
  totalGems: number;
  masteredGems: number;
  gemsNeedingReview: number;
  averageAccuracy: number;
  totalPracticeTime: number;
  currentStreak: number;
  bestStreak: number;
  topicPerformance: TopicPerformance[];
  recentAchievements: VocabularyAchievement[];
  dailyGoal: DailyGoal | null;
  weeklyStats: {
    wordsLearned: number;
    practiceTime: number;
    accuracy: number;
    streakDays: number;
  };
  monthlyTrends: {
    date: string;
    wordsLearned: number;
    accuracy: number;
    practiceTime: number;
  }[];
}

export default function VocabularyMiningProgressPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<DetailedProgress | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'analytics' | 'schedule'>('overview');

  useEffect(() => {
    if (user) {
      loadDetailedProgress();
    }
  }, [user]);

  const loadDetailedProgress = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load comprehensive progress data
      const summary = await miningService.getStudentProgressSummary(user.id);
      const gemCollection = await miningService.getGemCollection(user.id);
      
      // Calculate additional statistics
      const bestStreak = Math.max(...gemCollection.map(gem => gem.bestStreak), 0);
      
      // Calculate weekly stats from actual data
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);

      const weeklyStats = {
        wordsLearned: gemCollection.filter(gem =>
          gem.lastMasteredAt && gem.lastMasteredAt >= weekStart
        ).length,
        practiceTime: Math.round(summary.totalPracticeTime / 60), // Convert to minutes
        accuracy: summary.averageAccuracy,
        streakDays: summary.currentStreak
      };

      // Generate monthly trends from available data (simplified)
      const monthlyTrends = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const weekGems = gemCollection.filter(gem =>
          gem.lastMasteredAt &&
          gem.lastMasteredAt >= new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000) &&
          gem.lastMasteredAt < date
        );

        monthlyTrends.push({
          date: date.toISOString().split('T')[0],
          wordsLearned: weekGems.length,
          // Compute accuracy from correctEncounters / totalEncounters since GemCollection doesn't have an 'accuracy' field
          accuracy: (function() {
            if (weekGems.length === 0) return 0;
            const totalCorrect = weekGems.reduce((sum, gem) => sum + (gem.correctEncounters || 0), 0);
            const totalAttempts = weekGems.reduce((sum, gem) => sum + (gem.totalEncounters || 0), 0);
            return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
          })(),
          practiceTime: Math.round(Math.random() * 60 + 30) // Placeholder for practice time
        });
      }
      
      setProgress({
        ...summary,
        bestStreak,
        weeklyStats,
        monthlyTrends
      });
      
    } catch (err: any) {
      console.error('Error loading detailed progress:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Progress</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDetailedProgress}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">No Progress Data</h2>
          <p className="text-indigo-200 mb-6">Start practicing to see your progress!</p>
          <Link
            href="/student-dashboard/vocabulary-mining/practice"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
          >
            Start Mining
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/student-dashboard/vocabulary-mining"
                className="text-white/80 hover:text-white mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">My Progress</h1>
                <p className="text-indigo-200">Detailed insights into your vocabulary mining journey</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {progress.currentStreak > 0 && (
                <div className="flex items-center bg-yellow-500/20 text-yellow-100 px-3 py-2 rounded-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{progress.currentStreak} day streak!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-1 bg-white/10 backdrop-blur-sm rounded-lg mb-8">
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              selectedView === 'overview'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setSelectedView('analytics')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              selectedView === 'analytics'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Brain className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setSelectedView('schedule')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              selectedView === 'schedule'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </button>
        </div>

        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">{progress.totalGems}</div>
                <div className="text-indigo-200 text-sm">Total Gems</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-green-400 mb-2">{progress.masteredGems}</div>
                <div className="text-indigo-200 text-sm">Mastered</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{progress.bestStreak}</div>
                <div className="text-indigo-200 text-sm">Best Streak</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">{progress.averageAccuracy}%</div>
                <div className="text-indigo-200 text-sm">Accuracy</div>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                This Week's Progress
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{progress.weeklyStats.wordsLearned}</div>
                  <div className="text-sm text-indigo-200">Words Learned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{Math.round(progress.weeklyStats.practiceTime / 60)}h</div>
                  <div className="text-sm text-indigo-200">Practice Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{progress.weeklyStats.accuracy}%</div>
                  <div className="text-sm text-indigo-200">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{progress.weeklyStats.streakDays}</div>
                  <div className="text-sm text-indigo-200">Streak Days</div>
                </div>
              </div>
            </div>

            {/* Topic Performance */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Topic Performance
              </h3>
              <div className="space-y-3">
                {progress.topicPerformance.slice(0, 5).map((topic) => (
                  <div key={`${topic.themeName}-${topic.topicName}`} className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{topic.topicName}</span>
                      <span className="text-indigo-300 text-sm ml-2">({topic.themeName})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-white/20 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            topic.masteryPercentage >= 80 ? 'bg-green-400' :
                            topic.masteryPercentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${topic.masteryPercentage}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-medium w-12">
                        {topic.masteryPercentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            {progress.recentAchievements.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Recent Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progress.recentAchievements.slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className="flex items-center p-3 bg-white/10 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                        style={{ backgroundColor: achievement.achievementColor }}
                      >
                        {achievement.achievementIcon || '🏆'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">{achievement.achievementName}</h4>
                        <p className="text-xs text-indigo-200">{achievement.earnedAt.toLocaleDateString()}</p>
                      </div>
                      {achievement.pointsAwarded > 0 && (
                        <div className="text-sm font-medium text-yellow-400">
                          +{achievement.pointsAwarded}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {selectedView === 'analytics' && (
          <div className="space-y-6">
            {/* SpacedRepetitionAnalytics has been temporarily disabled/sunset. */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-indigo-100">
              <h3 className="text-lg font-semibold mb-2">Analytics (temporarily disabled)</h3>
              <p className="text-sm text-indigo-200">The spaced repetition analytics component is currently disabled — it was part of the older vocabulary-mining feature. The code is commented out in this file so it can be restored later if needed.</p>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {selectedView === 'schedule' && (
          <div className="space-y-6">
            {/* SpacedRepetitionScheduler has been temporarily disabled/sunset. */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-indigo-100">
              <h3 className="text-lg font-semibold mb-2">Schedule (temporarily disabled)</h3>
              <p className="text-sm text-indigo-200">The spaced repetition scheduler is currently disabled. It has been commented out to prevent build errors while preserving the original code for later restoration.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
