'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  Trophy,
  Star,
  Zap,
  Clock,
  BookOpen,
  Gamepad2,
  CheckCircle,
  Lock,
  Crown,
  Flame
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import Link from 'next/link';

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

interface LearnerStats {
  level: number;
  xp: number;
  streak: number;
  gamesPlayed: number;
  wordsLearned: number;
}

export default function LearnerChallengesPage() {
  const { user, hasSubscription } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<{ date: string; completed: boolean; challengesCompleted: number }[]>([]);

  useEffect(() => {
    if (user) {
      fetchChallengesData();
    }
  }, [user]);

  const fetchChallengesData = async () => {
    try {
      setLoading(true);

      // Fetch challenges and stats from the API
      const response = await fetch('/api/learner/progress?type=all');

      if (!response.ok) {
        throw new Error('Failed to fetch challenges data');
      }

      const data = await response.json();

      setDailyChallenges(data.challenges || []);
      setStats(data.stats || null);

      // Generate weekly progress from challenges
      generateWeeklyProgress();

    } catch (error) {
      console.error('Error fetching challenges data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyProgress = () => {
    const weekData: { date: string; completed: boolean; challengesCompleted: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // For past days, we'd need historical challenge data
      // For now, mark today based on completed challenges
      const isToday = i === 0;
      const completedCount = isToday
        ? dailyChallenges.filter(c => c.completed).length
        : 0; // Would need historical data for past days

      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount >= 2, // 2+ challenges = day completed
        challengesCompleted: completedCount
      });
    }

    setWeeklyProgress(weekData);
  };

  // Update weekly progress when challenges change
  useEffect(() => {
    if (dailyChallenges.length > 0) {
      generateWeeklyProgress();
    }
  }, [dailyChallenges]);

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'games': return Gamepad2;
      case 'words': return BookOpen;
      case 'time': return Clock;
      case 'accuracy': return Target;
      default: return Star;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'games': return 'bg-purple-100 text-purple-600';
      case 'words': return 'bg-blue-100 text-blue-600';
      case 'time': return 'bg-green-100 text-green-600';
      case 'accuracy': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalXPAvailable = dailyChallenges.reduce((sum, c) => sum + c.xpReward, 0);
  const earnedXP = dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.xpReward, 0);
  const completedCount = dailyChallenges.filter(c => c.completed).length;

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Challenges</h1>
          <p className="text-gray-600">Complete challenges to earn XP and maintain your streak</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{completedCount}/{dailyChallenges.length}</span>
            </div>
            <p className="text-sm text-gray-600">Challenges completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{earnedXP}/{totalXPAvailable}</span>
            </div>
            <p className="text-sm text-gray-600">XP earned today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats?.streak || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Day streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Level {stats?.level || 1}</span>
            </div>
            <p className="text-sm text-gray-600">Current level</p>
          </motion.div>
        </div>

        {/* Premium Banner */}
        {!hasSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Unlock Premium Challenges</h3>
                  <p className="text-purple-100">Get access to exclusive challenges and bigger rewards</p>
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

        {/* Today's Challenges */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            Today's Challenges
          </h2>

          {dailyChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dailyChallenges.map((challenge, index) => {
                const IconComponent = getChallengeIcon(challenge.type);
                const progress = (challenge.current / challenge.target) * 100;

                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl p-6 shadow-lg relative ${challenge.completed ? 'ring-2 ring-green-500' : ''
                      }`}
                  >
                    {challenge.completed && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getChallengeColor(challenge.type)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-purple-600">+{challenge.xpReward}</span>
                        <p className="text-sm text-gray-600">XP</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{challenge.current} / {challenge.target}</span>
                        <span>{Math.round(Math.min(progress, 100))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${challenge.completed ? 'bg-green-500' : 'bg-purple-600'
                            }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {challenge.completed ? (
                      <div className="flex items-center justify-center py-2 bg-green-100 text-green-600 rounded-lg">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Completed!</span>
                      </div>
                    ) : (
                      <Link
                        href="/games"
                        className="block text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                      >
                        Continue
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Challenges Yet</h3>
              <p className="text-gray-500 mb-6">Play some games to generate your daily challenges!</p>
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

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Weekly Challenge Progress
          </h3>
          <div className="grid grid-cols-7 gap-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">{day.date}</p>
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${day.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                  {day.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Target className="w-6 h-6" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {day.challengesCompleted > 0 ? `${day.challengesCompleted} done` : '-'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
