'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  BookOpen,
  Trophy,
  Star,
  Zap,
  Target,
  Clock,
  TrendingUp,
  Play,
  Brain,
  Gem,
  Flame,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

// Independent learner dashboard - no class/teacher dependencies
export default function LearnerDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    wordsLearned: 0,
    gamesPlayed: 0,
    accuracy: 0,
    totalTime: 0
  });
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/learn');
    }
  }, [user, isLoading, router]);

  // Load learner data from database
  useEffect(() => {
    if (user) {
      loadLearnerData();
    }
  }, [user]);

  const loadLearnerData = async () => {
    try {
      // Use the imported supabase client

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
          accuracy: 85, // Calculate from sessions
          totalTime: progress.total_study_time
        });
      }

      // Load today's challenges
      const today = new Date().toISOString().split('T')[0];
      const { data: challenges } = await supabase
        .from('daily_challenges')
        .select(`
          *,
          learner_challenge_progress(*)
        `)
        .eq('challenge_date', today)
        .eq('is_active', true);

      setDailyChallenges(challenges || []);

      // Load learning paths
      const { data: paths } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learner_path_progress(*)
        `)
        .eq('is_active', true);

      setLearningPaths(paths || []);

    } catch (error) {
      console.error('Error loading learner data:', error);
    }
  };

  // Quick action cards for independent learners
  const quickActions = [
    {
      title: 'Practice Vocabulary',
      description: 'Learn new words with spaced repetition',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      href: '/games/vocab-master',
      badge: 'Popular'
    },
    {
      title: 'Play Games',
      description: 'Choose from 15+ interactive games',
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-600',
      href: '/games',
      badge: null
    },
    {
      title: 'Daily Challenge',
      description: 'Complete today\'s language challenge',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      href: '/challenges/daily',
      badge: 'New'
    },
    {
      title: 'Progress Review',
      description: 'See your learning analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      href: '/learner-dashboard/progress',
      badge: null
    }
  ];

  // Color mapping for languages
  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'spanish': return 'bg-red-500';
      case 'french': return 'bg-blue-500';
      case 'german': return 'bg-green-500';
      default: return 'bg-purple-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner'}!
              </h1>
              <p className="text-purple-100 mt-2">
                Level {stats.level} • {stats.streak} day streak • {stats.wordsLearned} words learned
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.xp}</div>
                <div className="text-purple-200 text-sm">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.accuracy}%</div>
                <div className="text-purple-200 text-sm">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer relative">
                    {action.badge && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {action.badge}
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => {
              const pathProgress = path.learner_path_progress?.[0];
              const progress = pathProgress ? pathProgress.progress_percentage : 0;
              const wordsCompleted = pathProgress ? pathProgress.words_completed : 0;

              return (
                <motion.div
                  key={path.id || path.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{path.name || path.title}</h3>
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(path.language)}`}></div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{path.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{wordsCompleted} / {path.total_words || path.totalWords} words</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getLanguageColor(path.language)}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link
                    href={`/games?language=${path.language}&curriculum=${path.curriculum_type}`}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                  >
                    {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Completed VocabMaster session</p>
                <p className="text-gray-600 text-sm">Learned 15 new Spanish words • 2 hours ago</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">+50 XP</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Played Word Blast</p>
                <p className="text-gray-600 text-sm">High score: 1,250 points • Yesterday</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">+25 XP</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">7-day streak achieved!</p>
                <p className="text-gray-600 text-sm">Keep it up! • 2 days ago</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">+100 XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
