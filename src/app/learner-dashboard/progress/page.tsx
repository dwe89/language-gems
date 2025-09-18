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
  Zap
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabase } from '../../../lib/supabase';

export default function LearnerProgressPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    wordsLearned: 0,
    gamesPlayed: 0,
    totalTime: 0,
    accuracy: 0
  });
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    try {
      setLoading(true);

      // Load learner progress
      const { data: progress } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (progress) {
        setStats({
          level: progress.current_level,
          xp: progress.total_xp,
          streak: progress.current_streak,
          wordsLearned: progress.words_learned,
          gamesPlayed: progress.games_played,
          totalTime: progress.total_study_time,
          accuracy: 85 // Calculate from sessions
        });
      }

      // Load recent study sessions
      const { data: sessions } = await supabase
        .from('learner_study_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false })
        .limit(10);

      setRecentSessions(sessions || []);

      // Load achievements
      const { data: userAchievements } = await supabase
        .from('learner_achievement_progress')
        .select(`
          *,
          learner_achievements(*)
        `)
        .eq('user_id', user?.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      setAchievements(userAchievements || []);

      // Generate weekly progress data (mock for now)
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        weekData.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          xp: Math.floor(Math.random() * 100) + 20,
          minutes: Math.floor(Math.random() * 60) + 10
        });
      }
      setWeeklyProgress(weekData);

    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getXPToNextLevel = () => {
    const baseXP = 100;
    const nextLevelXP = baseXP * stats.level;
    const currentLevelXP = baseXP * (stats.level - 1);
    const progressXP = stats.xp - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    return { progressXP, neededXP, percentage: (progressXP / neededXP) * 100 };
  };

  const levelProgress = getXPToNextLevel();

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
              <span className="text-2xl font-bold text-gray-900">Level {stats.level}</span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{levelProgress.progressXP} XP</span>
                <span>{levelProgress.neededXP} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(levelProgress.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Progress to next level</p>
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
              <span className="text-2xl font-bold text-gray-900">{stats.streak}</span>
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
              <span className="text-2xl font-bold text-gray-900">{stats.wordsLearned}</span>
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
              <span className="text-2xl font-bold text-gray-900">{Math.floor(stats.totalTime / 60)}h</span>
            </div>
            <p className="text-sm text-gray-600">Study time</p>
          </motion.div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Weekly Activity
            </h3>
            <div className="space-y-4">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-12">{day.date}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.xp / 120) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-16 text-right">{day.xp} XP</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {achievements.length > 0 ? (
                achievements.slice(0, 5).map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{achievement.learner_achievements?.name}</p>
                      <p className="text-sm text-gray-600">{achievement.learner_achievements?.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No achievements yet</p>
                  <p className="text-sm text-gray-400">Keep learning to unlock your first achievement!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Recent Study Sessions
          </h3>
          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{session.session_type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.started_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">+{session.xp_earned} XP</p>
                    <p className="text-sm text-gray-600">{session.duration_minutes}m</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No study sessions yet</p>
                <p className="text-sm text-gray-400">Start playing games to see your progress here!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
