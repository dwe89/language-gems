'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Calendar, Clock, Target, Zap, Star,
  CheckCircle, AlertCircle, Gift, Crown, Heart,
  TrendingUp, Award, Gem, Shield, Rocket
} from 'lucide-react';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakGoal: number;
  weeklyActivity: boolean[];
  monthlyActivity: { date: Date; completed: boolean; xp: number }[];
  streakRewards: StreakReward[];
}

interface StreakReward {
  id: string;
  streakLength: number;
  title: string;
  description: string;
  xpBonus: number;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  claimed: boolean;
}

interface LearningStreakTrackerProps {
  studentId?: string;
  onStreakUpdate?: (streak: number) => void;
}

// =====================================================
// STREAK CALENDAR COMPONENT
// =====================================================

const StreakCalendar: React.FC<{
  monthlyActivity: StreakData['monthlyActivity'];
}> = ({ monthlyActivity }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const activity = monthlyActivity.find(a => 
      a.date.getDate() === day && 
      a.date.getMonth() === currentMonth
    );
    
    days.push({
      day,
      date,
      completed: activity?.completed || false,
      xp: activity?.xp || 0,
      isToday: day === today.getDate(),
      isPast: date < today
    });
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <h3 className="font-bold text-gray-900 mb-4 student-font-display">
        {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h3>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <motion.div
            key={index}
            className={`aspect-square flex items-center justify-center text-sm rounded-lg relative ${
              !day ? '' :
              day.completed ? 'bg-green-500 text-white' :
              day.isToday ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' :
              day.isPast ? 'bg-gray-100 text-gray-400' :
              'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            whileHover={day ? { scale: 1.1 } : {}}
            whileTap={day ? { scale: 0.95 } : {}}
          >
            {day && (
              <>
                <span className="font-medium">{day.day}</span>
                {day.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Flame className="h-3 w-3 text-orange-400" />
                  </motion.div>
                )}
                {day.xp > 0 && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs bg-blue-500 text-white px-1 rounded">
                      +{day.xp}
                    </span>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// STREAK REWARD COMPONENT
// =====================================================

const StreakRewardCard: React.FC<{
  reward: StreakReward;
  currentStreak: number;
  onClaim?: () => void;
}> = ({ reward, currentStreak, onClaim }) => {
  const isUnlocked = currentStreak >= reward.streakLength;
  const canClaim = isUnlocked && !reward.claimed;

  return (
    <motion.div
      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
        reward.claimed ? 'bg-green-50 border-green-200' :
        canClaim ? 'bg-blue-50 border-blue-200 shadow-md' :
        isUnlocked ? 'bg-yellow-50 border-yellow-200' :
        'bg-gray-50 border-gray-200'
      }`}
      whileHover={canClaim ? { scale: 1.02 } : {}}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${
          reward.claimed ? 'bg-green-500' :
          canClaim ? 'bg-blue-500' :
          isUnlocked ? 'bg-yellow-500' :
          'bg-gray-400'
        }`}>
          <reward.icon className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 student-font-display">
            {reward.title}
          </h4>
          <p className="text-sm text-gray-600">{reward.description}</p>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-orange-600">
            {reward.streakLength}
          </div>
          <div className="text-xs text-gray-500">days</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-600">
          +{reward.xpBonus} XP Bonus
        </span>
        
        {reward.claimed ? (
          <span className="text-sm text-green-600 font-medium">Claimed ✓</span>
        ) : canClaim ? (
          <button
            onClick={onClaim}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Claim Reward
          </button>
        ) : isUnlocked ? (
          <span className="text-sm text-yellow-600 font-medium">Available</span>
        ) : (
          <span className="text-sm text-gray-500">
            {reward.streakLength - currentStreak} more days
          </span>
        )}
      </div>
    </motion.div>
  );
};

// =====================================================
// MAIN LEARNING STREAK TRACKER COMPONENT
// =====================================================

export default function LearningStreakTracker({
  studentId,
  onStreakUpdate
}: LearningStreakTrackerProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 7,
    longestStreak: 12,
    lastActivityDate: new Date(),
    streakGoal: 30,
    weeklyActivity: [true, true, false, true, true, true, true],
    monthlyActivity: [],
    streakRewards: []
  });
  
  const [showStreakSaver, setShowStreakSaver] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  // Initialize data
  useEffect(() => {
    // Generate mock monthly activity
    const monthlyActivity = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const completed = Math.random() > 0.3; // 70% chance of completion
      const xp = completed ? Math.floor(Math.random() * 50) + 25 : 0;
      
      monthlyActivity.push({ date, completed, xp });
    }

    // Define streak rewards
    const streakRewards: StreakReward[] = [
      {
        id: '1',
        streakLength: 3,
        title: 'Getting Started',
        description: 'Complete 3 days in a row',
        xpBonus: 50,
        icon: Star,
        unlocked: true,
        claimed: true
      },
      {
        id: '2',
        streakLength: 7,
        title: 'Week Warrior',
        description: 'Complete a full week',
        xpBonus: 100,
        icon: Crown,
        unlocked: true,
        claimed: false
      },
      {
        id: '3',
        streakLength: 14,
        title: 'Fortnight Fighter',
        description: 'Two weeks of dedication',
        xpBonus: 200,
        icon: Shield,
        unlocked: false,
        claimed: false
      },
      {
        id: '4',
        streakLength: 30,
        title: 'Monthly Master',
        description: 'A full month of learning',
        xpBonus: 500,
        icon: Rocket,
        unlocked: false,
        claimed: false
      }
    ];

    setStreakData(prev => ({
      ...prev,
      monthlyActivity,
      streakRewards
    }));
  }, []);

  // Update time until streak reset
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeLeft = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check if streak saver should be shown
  useEffect(() => {
    const lastActivity = streakData.lastActivityDate;
    const now = new Date();
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    
    // Show streak saver if no activity for 18+ hours and streak > 0
    setShowStreakSaver(hoursSinceActivity >= 18 && streakData.currentStreak > 0);
  }, [streakData.lastActivityDate, streakData.currentStreak]);

  const handleClaimReward = (rewardId: string) => {
    setStreakData(prev => ({
      ...prev,
      streakRewards: prev.streakRewards.map(reward =>
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      )
    }));
  };

  const progressToNextReward = () => {
    const nextReward = streakData.streakRewards.find(r => !r.unlocked);
    if (!nextReward) return 100;
    
    return (streakData.currentStreak / nextReward.streakLength) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Streak Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-white/20 rounded-full"
            >
              <Flame className="h-8 w-8" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-bold student-font-display">
                {streakData.currentStreak} Day Streak
              </h2>
              <p className="text-orange-100">
                Longest: {streakData.longestStreak} days
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-orange-100">Resets in</div>
            <div className="text-lg font-bold">{timeUntilReset}</div>
          </div>
        </div>
        
        {/* Progress to Goal */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Goal: {streakData.streakGoal} days</span>
            <span>{streakData.currentStreak}/{streakData.streakGoal}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-white h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(streakData.currentStreak / streakData.streakGoal) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {/* Streak Saver Alert */}
        <AnimatePresence>
          {showStreakSaver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/20 rounded-lg p-3 border border-white/30"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-300" />
                <div className="flex-1">
                  <p className="font-medium">Streak in danger!</p>
                  <p className="text-sm text-orange-100">
                    Complete an activity to save your {streakData.currentStreak}-day streak
                  </p>
                </div>
                <button className="px-3 py-1 bg-white text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                  Save Streak
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 student-font-display">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs font-medium text-gray-500 mb-2">{day}</div>
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  streakData.weeklyActivity[index]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {streakData.weeklyActivity[index] ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Calendar */}
      <StreakCalendar monthlyActivity={streakData.monthlyActivity} />

      {/* Streak Rewards */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 student-font-display">Streak Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {streakData.streakRewards.map((reward) => (
            <StreakRewardCard
              key={reward.id}
              reward={reward}
              currentStreak={streakData.currentStreak}
              onClaim={() => handleClaimReward(reward.id)}
            />
          ))}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{streakData.currentStreak}</div>
          <div className="text-sm text-gray-600">Current</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <Crown className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{streakData.longestStreak}</div>
          <div className="text-sm text-gray-600">Best</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{streakData.streakGoal}</div>
          <div className="text-sm text-gray-600">Goal</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{Math.round(progressToNextReward())}%</div>
          <div className="text-sm text-gray-600">Next Reward</div>
        </div>
      </div>
    </div>
  );
}
