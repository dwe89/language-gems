'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  BookOpen,
  Gamepad2,
  Clock,
  Flame,
  BarChart3,
  Star,
  Trophy,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import Link from 'next/link';

// Types matching the LearnerProgressService
interface LearnerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpProgress: number;
  streak: number;
  longestStreak: number;
  wordsLearned: number;
  gamesPlayed: number;
  accuracy: number;
  totalTimeMinutes: number;
  lastActivityDate: string | null;
}

interface RecentActivity {
  id: string;
  gameType: string;
  score: number;
  accuracy: number;
  wordsCorrect: number;
  duration: number;
  xpEarned: number;
  createdAt: string;
  category?: string;
}

interface LearnerAchievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Game type display names
const GAME_DISPLAY_NAMES: Record<string, string> = {
  'vocab-master': 'VocabMaster',
  'memory-match': 'Memory Match',
  'hangman': 'Hangman',
  'conjugation-duel': 'Conjugation Duel',
  'word-scramble': 'Word Scramble',
  'sentence-builder': 'Sentence Builder',
  'speed-builder': 'Speed Builder',
  'word-guesser': 'Word Guesser',
  'vocab-blast': 'Vocab Blast',
  'tic-tac-toe': 'Tic Tac Toe',
  'sentence-towers': 'Sentence Towers',
  'word-towers': 'Word Towers'
};

export default function LearnerProgressPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [achievements, setAchievements] = useState<LearnerAchievement[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ date: string; xp: number; games: number }[]>([]);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);

      // Fetch stats and activity from the API
      const response = await fetch('/api/learner/progress?type=all');

      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }

      const data = await response.json();

      setStats(data.stats || null);
      setRecentActivity(data.activity || []);
      setAchievements(data.achievements || []);

      // Generate weekly data from recent activity
      generateWeeklyData(data.activity || []);

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = (activity: RecentActivity[]) => {
    const weekData: { date: string; xp: number; games: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      // Filter activities for this day
      const dayActivities = activity.filter(a =>
        a.createdAt.startsWith(dateStr)
      );

      const dayXP = dayActivities.reduce((sum, a) => sum + (a.xpEarned || 0), 0);
      const dayGames = dayActivities.length;

      weekData.push({
        date: dayName,
        xp: dayXP,
        games: dayGames
      });
    }

    setWeeklyData(weekData);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const maxWeeklyXP = Math.max(...weeklyData.map(d => d.xp), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your language learning journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Level {stats?.level || 1}</span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{stats?.xp || 0} XP</span>
                <span>{stats?.xpProgress?.toFixed(0) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats?.xpProgress || 0}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{stats?.xpToNextLevel || 100} XP to next level</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{stats?.streak || 0}</span>
                <p className="text-sm text-gray-500">Best: {stats?.longestStreak || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Day streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.wordsLearned || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Words learned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.totalTimeMinutes || 0}m</span>
            </div>
            <p className="text-sm text-gray-600">Study time</p>
          </motion.div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.gamesPlayed || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Games played</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.accuracy || 0}%</span>
            </div>
            <p className="text-sm text-gray-600">Average accuracy</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{achievements.length}</span>
            </div>
            <p className="text-sm text-gray-600">Achievements earned</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Weekly Activity
            </h3>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-12">{day.date}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.xp / maxWeeklyXP) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-32 justify-end">
                    <span className="text-sm font-bold text-purple-600">{day.xp} XP</span>
                    <span className="text-xs text-gray-400">{day.games} games</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.length > 0 ? (
                <>
                  {achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{achievement.name}</p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  {achievements.length > 5 && (
                    <Link
                      href="/learner-dashboard/achievements"
                      className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-700"
                    >
                      View all {achievements.length} achievements
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No achievements yet</p>
                  <p className="text-sm text-gray-400 mt-1">Keep playing to unlock badges!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Game Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Recent Game Sessions
          </h3>
          {recentActivity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Game</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Accuracy</th>
                    <th className="pb-3 font-medium">Words</th>
                    <th className="pb-3 font-medium">XP</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentActivity.map((activity) => (
                    <tr key={activity.id} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <Gamepad2 className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-gray-900">
                            {GAME_DISPLAY_NAMES[activity.gameType] || activity.gameType}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-700">{activity.score}</td>
                      <td className="py-3">
                        <span className={`font-medium ${activity.accuracy >= 90 ? 'text-green-600' :
                            activity.accuracy >= 70 ? 'text-yellow-600' :
                              'text-red-600'
                          }`}>
                          {Math.round(activity.accuracy)}%
                        </span>
                      </td>
                      <td className="py-3 text-gray-700">{activity.wordsCorrect}</td>
                      <td className="py-3">
                        <span className="text-purple-600 font-medium">+{activity.xpEarned}</span>
                      </td>
                      <td className="py-3 text-gray-500">{formatDuration(activity.duration)}</td>
                      <td className="py-3 text-gray-400">{formatTimeAgo(activity.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Game Sessions Yet</h3>
              <p className="text-gray-500 mb-6">Start playing games to track your progress!</p>
              <Link
                href="/games"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play Games
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
