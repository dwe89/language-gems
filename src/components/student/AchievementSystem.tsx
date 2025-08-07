'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Star, Crown, Zap, Target, Award, Medal,
  Flame, Heart, Brain, BookOpen, Clock, Users,
  TrendingUp, CheckCircle, Lock, Sparkles,
  Gift, Calendar, Gem, Shield, Rocket, Mountain
} from 'lucide-react';
import { useSupabase } from '../supabase/SupabaseProvider';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'learning' | 'streak' | 'social' | 'mastery' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  studentId?: string;
  showNotifications?: boolean;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

// =====================================================
// ACHIEVEMENT NOTIFICATION COMPONENT
// =====================================================

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getTierColor = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-amber-800';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-blue-400 to-blue-600';
      case 'diamond': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <div className={`bg-gradient-to-r ${getTierColor(achievement.tier)} p-1 rounded-xl shadow-2xl`}>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full bg-gradient-to-r ${getTierColor(achievement.tier)}`}>
              <achievement.icon className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-gray-900 student-font-display">
                  Achievement Unlocked!
                </h3>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="font-semibold text-gray-800">{achievement.title}</p>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs font-medium text-blue-600">
                  +{achievement.points} XP
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  achievement.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                  achievement.rarity === 'epic' ? 'bg-orange-100 text-orange-800' :
                  achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {achievement.rarity}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// =====================================================
// ACHIEVEMENT CARD COMPONENT
// =====================================================

const AchievementCard: React.FC<{
  achievement: Achievement;
  onClick?: () => void;
}> = ({ achievement, onClick }) => {
  const getTierColor = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-amber-800';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-blue-400 to-blue-600';
      case 'diamond': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return BookOpen;
      case 'streak': return Flame;
      case 'social': return Users;
      case 'mastery': return Crown;
      case 'special': return Star;
      default: return Trophy;
    }
  };

  const CategoryIcon = getCategoryIcon(achievement.category);
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <motion.div
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        achievement.unlocked
          ? `bg-gradient-to-br ${getTierColor(achievement.tier)} text-white shadow-lg hover:shadow-xl`
          : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Rarity Indicator */}
      {achievement.unlocked && achievement.rarity !== 'common' && (
        <div className="absolute top-2 right-2">
          <Sparkles className={`h-4 w-4 ${
            achievement.rarity === 'legendary' ? 'text-purple-200' :
            achievement.rarity === 'epic' ? 'text-orange-200' :
            'text-blue-200'
          }`} />
        </div>
      )}

      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${
          achievement.unlocked 
            ? 'bg-white/20' 
            : 'bg-gray-300'
        }`}>
          {achievement.unlocked ? (
            <achievement.icon className="h-6 w-6 text-white" />
          ) : (
            <Lock className="h-6 w-6 text-gray-500" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-bold student-font-display ${
            achievement.unlocked ? 'text-white' : 'text-gray-900'
          }`}>
            {achievement.title}
          </h3>
          <div className="flex items-center space-x-2">
            <CategoryIcon className={`h-3 w-3 ${
              achievement.unlocked ? 'text-white/80' : 'text-gray-500'
            }`} />
            <span className={`text-xs ${
              achievement.unlocked ? 'text-white/80' : 'text-gray-500'
            }`}>
              {achievement.category}
            </span>
          </div>
        </div>
      </div>

      <p className={`text-sm mb-3 ${
        achievement.unlocked ? 'text-white/90' : 'text-gray-600'
      }`}>
        {achievement.description}
      </p>

      {/* Progress Bar */}
      {!achievement.unlocked && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{achievement.progress}/{achievement.maxProgress}</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Points and Date */}
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${
          achievement.unlocked ? 'text-white' : 'text-gray-700'
        }`}>
          {achievement.points} XP
        </span>
        
        {achievement.unlocked && achievement.unlockedAt && (
          <span className="text-xs text-white/70">
            {achievement.unlockedAt.toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// =====================================================
// MAIN ACHIEVEMENT SYSTEM COMPONENT
// =====================================================

export default function AchievementSystem({
  studentId,
  showNotifications = true
}: AchievementSystemProps) {
  const { supabase } = useSupabase();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Helper function to calculate streak
  const calculateStreak = async (sessions: any[]): Promise<number> => {
    if (!sessions || sessions.length === 0) return 0;

    const sortedSessions = sessions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].created_at);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  };

  // Load real achievements data
  useEffect(() => {
    loadRealAchievements();
  }, [studentId]);

  const loadRealAchievements = async () => {
    if (!studentId) return;

    try {
      // Get student's actual progress data
      const { data: sessions } = await supabase
        .from('enhanced_game_sessions')
        .select('*')
        .eq('student_id', studentId);

      const { data: vocabularyProgress } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', studentId);

      const { data: assignments } = await supabase
        .from('enhanced_assignment_progress')
        .select('*')
        .eq('student_id', studentId);

      // Calculate real achievement progress
      const completedAssignments = assignments?.filter(a => a.status === 'completed').length || 0;
      const totalSessions = sessions?.length || 0;
      const learnedWords = vocabularyProgress?.filter(v => v.is_learned).length || 0;
      const totalXP = sessions?.reduce((sum, s) => sum + (s.xp_earned || 0), 0) || 0;
      const perfectScores = sessions?.filter(s => s.accuracy_percentage === 100).length || 0;
      const currentStreak = await calculateStreak(sessions || []);

      const realAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first assignment',
        icon: BookOpen,
        category: 'learning',
        tier: 'bronze',
        points: 50,
        progress: Math.min(completedAssignments, 1),
        maxProgress: 1,
        unlocked: completedAssignments >= 1,
        unlockedAt: completedAssignments >= 1 ? new Date(assignments?.[0]?.completed_at || Date.now()) : undefined,
        rarity: 'common'
      },
      {
        id: '2',
        title: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        icon: Flame,
        category: 'streak',
        tier: 'gold',
        points: 200,
        progress: Math.min(currentStreak, 7),
        maxProgress: 7,
        unlocked: currentStreak >= 7,
        unlockedAt: currentStreak >= 7 ? new Date() : undefined,
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'Word Wizard',
        description: 'Learn 100 new vocabulary words',
        icon: Brain,
        category: 'mastery',
        tier: 'silver',
        points: 150,
        progress: Math.min(learnedWords, 100),
        maxProgress: 100,
        unlocked: learnedWords >= 100,
        rarity: 'common'
      },
      {
        id: '4',
        title: 'Speed Demon',
        description: 'Complete 5 games in under 2 minutes each',
        icon: Zap,
        category: 'special',
        tier: 'platinum',
        points: 300,
        progress: Math.min(sessions?.filter(s => s.duration_seconds <= 120).length || 0, 5),
        maxProgress: 5,
        unlocked: (sessions?.filter(s => s.duration_seconds <= 120).length || 0) >= 5,
        rarity: 'epic'
      },
      {
        id: '5',
        title: 'Perfect Score',
        description: 'Get 100% on any assignment',
        icon: Target,
        category: 'mastery',
        tier: 'gold',
        points: 250,
        progress: Math.min(perfectScores, 1),
        maxProgress: 1,
        unlocked: perfectScores >= 1,
        rarity: 'rare'
      },
      {
        id: '6',
        title: 'Session Master',
        description: 'Complete 25 game sessions',
        icon: Users,
        category: 'learning',
        tier: 'silver',
        points: 175,
        progress: Math.min(totalSessions, 25),
        maxProgress: 25,
        unlocked: totalSessions >= 25,
        rarity: 'common'
      },
      {
        id: '7',
        title: 'XP Legend',
        description: 'Earn 2000 total XP',
        icon: Crown,
        category: 'special',
        tier: 'diamond',
        points: 500,
        progress: Math.min(totalXP, 2000),
        maxProgress: 2000,
        unlocked: totalXP >= 2000,
        rarity: 'legendary'
      }
    ];

    setAchievements(realAchievements);

    } catch (error) {
      console.error('Error loading achievements:', error);
      setAchievements([]);
    }
  };

  // Simulate new achievement unlock
  useEffect(() => {
    if (showNotifications && achievements.length > 0) {
      const timer = setTimeout(() => {
        const streakAchievement = achievements.find(a => a.id === '2');
        if (streakAchievement) {
          setNewAchievement(streakAchievement);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotifications, achievements]);

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'mastery', label: 'Mastery', icon: Crown },
    { id: 'special', label: 'Special', icon: Star }
  ];

  const tiers = [
    { id: 'all', label: 'All Tiers' },
    { id: 'bronze', label: 'Bronze' },
    { id: 'silver', label: 'Silver' },
    { id: 'gold', label: 'Gold' },
    { id: 'platinum', label: 'Platinum' },
    { id: 'diamond', label: 'Diamond' }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const tierMatch = selectedTier === 'all' || achievement.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold student-font-display">Achievements</h3>
              <p className="text-blue-100">{unlockedCount} of {achievements.length} unlocked</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <Gem className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold student-font-display">Total XP</h3>
              <p className="text-green-100">{totalPoints.toLocaleString()} points earned</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <Star className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold student-font-display">Completion</h3>
              <p className="text-orange-100">{Math.round((unlockedCount / achievements.length) * 100)}% complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {tiers.map((tier) => (
            <option key={tier.id} value={tier.id}>
              {tier.label}
            </option>
          ))}
        </select>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClick={() => console.log('Achievement clicked:', achievement.title)}
          />
        ))}
      </div>

      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementNotification
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
