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
  Crown
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function LearnerChallengesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user) {
      loadChallengesData();
    }
  }, [user]);

  const loadChallengesData = async () => {
    try {
      setLoading(true);

      // Check premium status
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status, plan')
        .eq('user_id', user?.id)
        .single();
      
      setIsPremium(profile?.subscription_status === 'active' || profile?.plan === 'premium');

      // For now, create mock daily challenges since the table might not have data
      const mockChallenges = [
        {
          id: 1,
          title: 'Word Master',
          description: 'Learn 10 new vocabulary words',
          target_value: 10,
          current_progress: 3,
          xp_reward: 50,
          challenge_type: 'vocabulary',
          completed: false,
          icon: 'BookOpen',
          color: 'blue'
        },
        {
          id: 2,
          title: 'Game Champion',
          description: 'Play 3 different games',
          target_value: 3,
          current_progress: 1,
          xp_reward: 75,
          challenge_type: 'games',
          completed: false,
          icon: 'Gamepad2',
          color: 'purple'
        },
        {
          id: 3,
          title: 'Speed Learner',
          description: 'Study for 30 minutes',
          target_value: 30,
          current_progress: 15,
          xp_reward: 100,
          challenge_type: 'time',
          completed: false,
          icon: 'Clock',
          color: 'green'
        }
      ];

      // Add premium-only challenges
      if (isPremium) {
        mockChallenges.push({
          id: 4,
          title: 'Perfect Score',
          description: 'Achieve 100% accuracy in any game',
          target_value: 100,
          current_progress: 85,
          xp_reward: 200,
          challenge_type: 'accuracy',
          completed: false,
          icon: 'Star',
          color: 'yellow'
        });
      }

      setDailyChallenges(mockChallenges);

      // Generate weekly progress
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        weekData.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          completed: Math.random() > 0.3,
          challenges: Math.floor(Math.random() * 4) + 1
        });
      }
      setWeeklyProgress(weekData);

    } catch (error) {
      console.error('Error loading challenges data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons = {
      BookOpen,
      Gamepad2,
      Clock,
      Star,
      Target
    };
    return icons[iconName as keyof typeof icons] || Target;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

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
          <p className="text-gray-600">Complete challenges to earn XP and unlock achievements</p>
        </div>

        {/* Premium Banner */}
        {!isPremium && (
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
                href="/learner-dashboard/upgrade"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyChallenges.map((challenge, index) => {
              const IconComponent = getIcon(challenge.icon);
              const progress = (challenge.current_progress / challenge.target_value) * 100;
              const isLocked = !isPremium && challenge.id > 3;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-6 shadow-lg relative ${isLocked ? 'opacity-60' : ''}`}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(challenge.color)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-purple-600">+{challenge.xp_reward}</span>
                      <p className="text-sm text-gray-600">XP</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{challenge.current_progress} / {challenge.target_value}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {challenge.completed ? (
                    <div className="flex items-center justify-center py-2 bg-green-100 text-green-600 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Completed!</span>
                    </div>
                  ) : isLocked ? (
                    <div className="flex items-center justify-center py-2 bg-gray-100 text-gray-500 rounded-lg">
                      <Lock className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Premium Only</span>
                    </div>
                  ) : (
                    <Link
                      href="/games"
                      className="block text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Start Challenge
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  day.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {day.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Target className="w-6 h-6" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{day.challenges} challenges</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
