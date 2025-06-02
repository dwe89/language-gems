'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Trophy, Medal, Award, Star, Clock, Users, ChevronLeft, 
  TrendingUp, Target, Zap, BookOpen, Calendar
} from 'lucide-react';
import Link from 'next/link';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'consistency' | 'social' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointsRequired: number;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
}

export default function AchievementsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // For now, we'll use mock data since this is a teacher dashboard
    // In the future, this could show class-wide achievement statistics
    const mockAchievements: Achievement[] = [
      {
        id: 'teacher_onboarding',
        name: 'Getting Started',
        description: 'Create your first class and add students',
        icon: '🎓',
        category: 'learning',
        rarity: 'common',
        pointsRequired: 10,
        unlocked: true,
        unlockedDate: '2024-01-15',
        progress: 1,
        maxProgress: 1
      },
      {
        id: 'first_assignment',
        name: 'Assignment Creator',
        description: 'Create your first assignment',
        icon: '📝',
        category: 'learning',
        rarity: 'common',
        pointsRequired: 25,
        unlocked: true,
        unlockedDate: '2024-01-16',
        progress: 1,
        maxProgress: 1
      },
      {
        id: 'active_teacher',
        name: 'Active Educator',
        description: 'Log in for 30 consecutive days',
        icon: '🔥',
        category: 'consistency',
        rarity: 'rare',
        pointsRequired: 100,
        unlocked: false,
        progress: 12,
        maxProgress: 30
      },
      {
        id: 'student_mentor',
        name: 'Student Mentor',
        description: 'Help 100 students complete assignments',
        icon: '👥',
        category: 'social',
        rarity: 'epic',
        pointsRequired: 500,
        unlocked: false,
        progress: 42,
        maxProgress: 100
      }
    ];

    setAchievements(mockAchievements);
    setLoading(false);
  }, [user]);

  const categories = [
    { id: 'all', name: 'All', icon: <Star className="h-4 w-4" /> },
    { id: 'learning', name: 'Learning', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'consistency', name: 'Consistency', icon: <Calendar className="h-4 w-4" /> },
    { id: 'social', name: 'Social', icon: <Users className="h-4 w-4" /> },
    { id: 'mastery', name: 'Mastery', icon: <Target className="h-4 w-4" /> },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.pointsRequired, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Achievements</h1>
          <p className="text-gray-600">Track your teaching milestones and progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-teal-100 p-3 rounded-full mr-4">
                <Trophy className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{unlockedCount}</h3>
                <p className="text-gray-600">Achievements Unlocked</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{totalPoints}</h3>
                <p className="text-gray-600">Achievement Points</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </h3>
                <p className="text-gray-600">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                achievement.unlocked ? 'border-l-4 border-teal-500' : 'opacity-75'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`text-3xl mr-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                      </span>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-teal-600">
                      <Medal className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
                
                {achievement.unlocked ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Unlocked {achievement.unlockedDate}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full" 
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Zap className="h-4 w-4 mr-1" />
                    {achievement.pointsRequired} points
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-500">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 