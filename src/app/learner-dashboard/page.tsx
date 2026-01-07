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
  Flame,
  Award,
  Calendar,
  BarChart3,
  Crown,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
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

interface DailyChallenge {
  id: string;
  type: 'games' | 'words' | 'time' | 'accuracy';
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
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

export default function LearnerDashboard() {
  const { user, isLoading, hasSubscription } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [achievements, setAchievements] = useState<LearnerAchievement[]>([]);
  const [languageStats, setLanguageStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/learners');
    }
  }, [user, isLoading, router]);

  // Fetch all learner data
  useEffect(() => {
    if (user) {
      fetchLearnerData();
    }
  }, [user]);

  const fetchLearnerData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/learner/progress?type=all');

      if (!response.ok) {
        throw new Error('Failed to fetch learner data');
      }

      const data = await response.json();

      setStats(data.stats);
      setRecentActivity(data.activity || []);
      setDailyChallenges(data.challenges || []);
      setAchievements(data.achievements || []);
      setLanguageStats(data.languages || {});
    } catch (error) {
      console.error('Error fetching learner data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick action cards
  const quickActions = [
    {
      title: 'Practice Vocabulary',
      description: hasSubscription ? 'Learn unlimited words with spaced repetition' : 'Start learning new words',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      href: '/games/vocab-master',
      badge: null
    },
    {
      title: 'Play Games',
      description: `Choose from ${hasSubscription ? '15+' : '5'} interactive games`,
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-600',
      href: '/games',
      badge: null
    },
    {
      title: 'Daily Challenges',
      description: 'Complete challenges to earn bonus XP',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      href: '#challenges',
      badge: dailyChallenges.filter(c => !c.completed).length > 0
        ? `${dailyChallenges.filter(c => !c.completed).length} Active`
        : null
    },
    {
      title: 'View Progress',
      description: 'See your learning analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      href: '/learner-dashboard/progress',
      badge: null
    }
  ];

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  // Format time ago
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

  // Challenge icon by type
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'games': return Gamepad2;
      case 'words': return BookOpen;
      case 'time': return Clock;
      case 'accuracy': return Target;
      default: return Star;
    }
  };

  if (isLoading || loading) {
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
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner'}!
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-300 mr-1" />
                  Level {stats?.level || 1}
                </span>
                <span className="flex items-center">
                  <Flame className="h-5 w-5 text-orange-300 mr-1" />
                  {stats?.streak || 0} day streak
                </span>
                <span className="flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-300 mr-1" />
                  {stats?.wordsLearned || 0} words learned
                </span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full md:w-64">
              <div className="flex justify-between text-sm mb-1">
                <span>Level {stats?.level || 1}</span>
                <span>{stats?.xp || 0} XP</span>
              </div>
              <div className="w-full bg-purple-400/30 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.xpProgress || 0}%` }}
                />
              </div>
              <div className="text-right text-sm mt-1 text-purple-200">
                {stats?.xpToNextLevel || 100} XP to Level {(stats?.level || 1) + 1}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold">{stats?.gamesPlayed || 0}</div>
              <div className="text-purple-200">Games Played</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold">{stats?.accuracy || 0}%</div>
              <div className="text-purple-200">Accuracy</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold">{stats?.totalTimeMinutes || 0}m</div>
              <div className="text-purple-200">Study Time</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold">{stats?.longestStreak || 0}</div>
              <div className="text-purple-200">Best Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Learning Language</h2>
          <div className="flex space-x-2">
            {[
              { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
              { code: 'french', name: 'French', flag: '🇫🇷' },
              { code: 'german', name: 'German', flag: '🇩🇪' }
            ].map((lang) => {
              const langStats = languageStats[lang.code];
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedLanguage === lang.code
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-50 border border-gray-200'
                    }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {langStats && (
                    <span className={`text-xs ${selectedLanguage === lang.code ? 'text-purple-200' : 'text-gray-400'}`}>
                      ({langStats.gamesPlayed} games)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Banner - Only show if not premium */}
        {!hasSubscription && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Unlock Premium Features</h3>
                  <p className="text-purple-100">Access all 15+ games, unlimited vocabulary, and advanced analytics</p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer relative h-full">
                    {action.badge && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Challenges */}
          <div id="challenges" className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Daily Challenges</h2>
                <span className="text-sm text-gray-500">
                  {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length} Complete
                </span>
              </div>

              {dailyChallenges.length > 0 ? (
                <div className="space-y-4">
                  {dailyChallenges.map((challenge) => {
                    const Icon = getChallengeIcon(challenge.type);
                    const progressPercent = (challenge.current / challenge.target) * 100;

                    return (
                      <div
                        key={challenge.id}
                        className={`p-4 rounded-xl border-2 transition-all ${challenge.completed
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:border-purple-200'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${challenge.completed ? 'bg-green-100' : 'bg-purple-100'
                              }`}>
                              {challenge.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Icon className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                              <p className="text-sm text-gray-500">{challenge.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold ${challenge.completed ? 'text-green-600' : 'text-purple-600'}`}>
                              +{challenge.xpReward} XP
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {challenge.current} / {challenge.target}
                            </span>
                            <span className={challenge.completed ? 'text-green-600' : 'text-gray-400'}>
                              {Math.min(100, Math.round(progressPercent))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${challenge.completed ? 'bg-green-500' : 'bg-purple-500'
                                }`}
                              style={{ width: `${Math.min(100, progressPercent)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No challenges available</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>

              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.slice(0, 5).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
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
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No achievements yet</p>
                  <p className="text-gray-400 text-sm mt-1">Play games to earn badges!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link
                href="/learner-dashboard/progress"
                className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-700"
              >
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {recentActivity.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">Game</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Accuracy</th>
                      <th className="pb-3 font-medium">Words</th>
                      <th className="pb-3 font-medium">XP Earned</th>
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
                          <span className="text-purple-600 font-medium">+{activity.xpEarned} XP</span>
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
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Activity</h3>
                <p className="text-gray-500 mb-6">Start playing games to see your progress here!</p>
                <Link
                  href="/games"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Play Games
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
