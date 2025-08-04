'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Trophy, BarChart3, Settings, Bell, Search,
  User, Menu, X, ChevronRight, Star, Flame, Zap, Crown,
  Calendar, Clock, Target, Award, Gem, Heart, Brain,
  PlayCircle, PauseCircle, Volume2, VolumeX, Sun, Moon,
  Maximize2, Minimize2, RefreshCw, Filter, Download
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../theme/ThemeProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import StudentPerformanceDashboard from './StudentPerformanceDashboard';
import StudentProgressVisualization from './StudentProgressVisualization';

import AchievementSystem from './AchievementSystem';
import LearningStreakTracker from './LearningStreakTracker';
import EnhancedAssignmentCard from './EnhancedAssignmentCard';
import AssignmentProgressTracker from './AssignmentProgressTracker';
import DataVerificationPanel from './DataVerificationPanel';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface ModernStudentDashboardProps {
  initialView?: 'home' | 'assignments' | 'progress' | 'achievements' | 'settings';
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color: string;
  description: string;
}

interface QuickActionCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
  disabled?: boolean;
}

interface StudentStats {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  achievements: number;
  completedAssignments: number;
  totalAssignments: number;
}

// =====================================================
// UTILITY COMPONENTS
// =====================================================

const NavigationCard: React.FC<{
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`relative w-full p-4 rounded-xl text-left transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${
        isActive ? 'bg-white/20' : item.color
      }`}>
        <item.icon className={`h-5 w-5 ${
          isActive ? 'text-white' : 'text-white'
        }`} />
      </div>
      
      <div className="flex-1">
        <h3 className={`font-medium ${
          isActive ? 'text-white' : 'text-gray-900'
        }`}>
          {item.label}
        </h3>
        <p className={`text-sm ${
          isActive ? 'text-white/80' : 'text-gray-600'
        }`}>
          {item.description}
        </p>
      </div>
      
      {item.badge && (
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {item.badge}
        </div>
      )}
      
      <ChevronRight className={`h-4 w-4 ${
        isActive ? 'text-white' : 'text-gray-400'
      }`} />
    </div>
  </motion.button>
);

const QuickActionCard: React.FC<{ action: QuickActionCard }> = ({ action }) => (
  <motion.button
    onClick={action.action}
    disabled={action.disabled}
    className={`p-4 rounded-xl text-left transition-all duration-200 ${
      action.disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
    }`}
    whileHover={action.disabled ? {} : { scale: 1.02 }}
    whileTap={action.disabled ? {} : { scale: 0.98 }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-3 rounded-lg ${action.color}`}>
        <action.icon className="h-6 w-6 text-white" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{action.title}</h3>
        <p className="text-sm text-gray-600">{action.description}</p>
      </div>
    </div>
  </motion.button>
);

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: string;
  progress?: number;
  isLoading?: boolean;
}> = ({ title, value, subtitle, icon: Icon, color, progress, isLoading = false }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      {progress !== undefined && (
        <div className="text-right">
          <div className="text-xs text-gray-500">Progress</div>
          <div className="text-sm font-medium text-gray-900">{progress}%</div>
        </div>
      )}
    </div>
    
    <div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-xl font-bold text-gray-900">
        {isLoading ? (
          <span className="animate-pulse bg-gray-200 rounded h-6 w-16 inline-block"></span>
        ) : (
          value
        )}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
    
    {progress !== undefined && (
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    )}
  </div>
);

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ModernStudentDashboard({
  initialView = 'home'
}: ModernStudentDashboardProps) {
  const { user } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { supabase } = useSupabase();
  
  // State
  const [currentView, setCurrentView] = useState(initialView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Level calculation function (exponential growth)
  const calculateLevelFromXP = (totalXP: number) => {
    let level = 1;
    let xpRequired = 100;
    let totalXpForLevel = 0;

    while (totalXpForLevel + xpRequired <= totalXP) {
      totalXpForLevel += xpRequired;
      level++;
      xpRequired = Math.floor(100 * Math.pow(1.5, level - 1));
    }

    const xpForNextLevel = Math.floor(100 * Math.pow(1.5, level - 1));
    const xpToNext = xpForNextLevel - (totalXP - totalXpForLevel);

    return { level, xpToNext, xpForNextLevel };
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string | null | undefined) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Load real student data
  useEffect(() => {
    if (user?.id) {
      loadStudentData();
      loadNotifications();
    }
  }, [user?.id]);

  const loadStudentData = async () => {
    if (!user?.id || !supabase) return;

    try {
      setLoading(true);

      // Get student profile data
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get assignment progress
      const { data: assignments } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          status,
          due_date,
          assignment_submissions!inner(
            id,
            status,
            score,
            submitted_at
          )
        `)
        .eq('assignment_submissions.student_id', user.id);

      // Get recent game sessions for streak calculation
      const { data: recentSessions } = await supabase
        .from('enhanced_game_sessions')
        .select('started_at, xp_earned')
        .eq('student_id', user.id)
        .order('started_at', { ascending: false })
        .limit(30);

      // Get ALL game sessions for total XP calculation
      const { data: allSessions } = await supabase
        .from('enhanced_game_sessions')
        .select('xp_earned')
        .eq('student_id', user.id);

      // Calculate current streak
      const currentStreak = calculateStreak(recentSessions || []);

      // Load recent activity (game sessions and achievements)
      const recentActivityData = [];

      // Add recent game sessions
      if (recentSessions && recentSessions.length > 0) {
        recentSessions.slice(0, 3).forEach(session => {
          recentActivityData.push({
            type: 'game',
            title: `Played vocabulary game`,
            time: formatTimeAgo(session.started_at),
            xp: session.xp_earned
          });
        });
      }

      // Get recent achievements
      const { data: recentAchievements } = await supabase
        .from('achievements')
        .select('achievement_data, achieved_at')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false })
        .limit(2);

      if (recentAchievements) {
        recentAchievements.forEach(achievement => {
          const achievementData = JSON.parse(achievement.achievement_data);
          recentActivityData.push({
            type: 'achievement',
            title: `Earned "${achievementData.name}"`,
            time: formatTimeAgo(achievement.achieved_at),
            xp: achievementData.xp_reward || 50
          });
        });
      }

      // Sort by time and take most recent 3
      setRecentActivity(recentActivityData.slice(0, 3));

      // Calculate stats
      const completedAssignments = assignments?.filter(a =>
        a.assignment_submissions.some(s => s.status === 'completed')
      ).length || 0;

      const totalAssignments = assignments?.length || 0;
      const totalXP = allSessions?.reduce((sum, session) => sum + (session.xp_earned || 0), 0) || 0;

      // Calculate proper level and XP to next level based on total XP
      const { level, xpToNext } = calculateLevelFromXP(totalXP);

      setStudentStats({
        level,
        xp: totalXP,
        xpToNext,
        streak: currentStreak,
        achievements: profile?.total_achievements || 0,
        completedAssignments,
        totalAssignments
      });

    } catch (error) {
      console.error('Error loading student data:', error);
      // Set fallback data with proper level calculation
      const { level, xpToNext } = calculateLevelFromXP(0);
      setStudentStats({
        level,
        xp: 0,
        xpToNext,
        streak: 0,
        achievements: 0,
        completedAssignments: 0,
        totalAssignments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    if (!user?.id || !supabase) return;

    try {
      // Get recent achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false })
        .limit(5);

      // Get assignment notifications
      const { data: assignmentNotifications } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          due_date,
          assignment_submissions!left(status)
        `)
        .eq('assignment_submissions.student_id', user.id)
        .gte('due_date', new Date().toISOString())
        .order('due_date', { ascending: true })
        .limit(3);

      const notifications = [
        ...(achievements || []).map(a => ({
          id: `achievement-${a.id}`,
          type: 'achievement',
          title: 'New Achievement!',
          message: `You earned the "${a.name || a.title || 'Unknown Achievement'}" badge!`,
          timestamp: a.earned_at || a.achieved_at,
          isNew: true
        })),
        ...(assignmentNotifications || []).map(a => ({
          id: `assignment-${a.id}`,
          type: 'assignment',
          title: 'Assignment Due Soon',
          message: `"${a.title}" is due ${new Date(a.due_date).toLocaleDateString()}`,
          timestamp: a.due_date,
          isNew: !a.assignment_submissions?.some(s => s.status === 'completed')
        }))
      ];

      setNotifications(notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  const calculateStreak = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const sortedSessions = sessions.sort((a, b) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );

    // Group sessions by date
    const sessionsByDate = new Map();
    sortedSessions.forEach(session => {
      const date = new Date(session.started_at).toDateString();
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date).push(session);
    });

    // Calculate consecutive days
    let currentDate = new Date(today);
    while (true) {
      const dateStr = currentDate.toDateString();
      if (sessionsByDate.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const loadAssignments = async () => {
    if (!user?.id || !supabase) return;

    try {
      setAssignmentsLoading(true);

      // Get assignments for this student
      const { data: assignmentData, error } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          description,
          type,
          difficulty,
          estimated_time,
          due_date,
          max_score,
          xp_reward,
          language,
          topics,
          requirements,
          max_attempts,
          assignment_submissions!left(
            id,
            status,
            score,
            progress,
            attempts,
            submitted_at
          )
        `)
        .eq('assignment_submissions.student_id', user.id)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error loading assignments:', error);
        setAssignments([]);
        return;
      }

      // Transform the data to match the expected format
      const transformedAssignments = (assignmentData || []).map(assignment => {
        const submission = assignment.assignment_submissions?.[0];

        return {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          type: assignment.type || 'vocabulary',
          difficulty: assignment.difficulty || 'beginner',
          estimatedTime: assignment.estimated_time || 30,
          dueDate: new Date(assignment.due_date),
          status: submission?.status || 'not_started',
          progress: submission?.progress || 0,
          score: submission?.score || 0,
          maxScore: assignment.max_score || 100,
          xpReward: assignment.xp_reward || 100,
          language: assignment.language || 'Spanish',
          topics: assignment.topics || [],
          requirements: assignment.requirements || [],
          attempts: submission?.attempts || 0,
          maxAttempts: assignment.max_attempts || 3,
          isLocked: false
        };
      });

      setAssignments(transformedAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  // Load assignments when view changes to assignments
  useEffect(() => {
    if (currentView === 'assignments' && user?.id) {
      loadAssignments();
    }
  }, [currentView, user?.id]);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: 'Overview and quick actions'
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: BookOpen,
      badge: assignments.length,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      description: 'Current and upcoming tasks'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      description: 'Track your learning journey'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      description: 'Badges and rewards earned'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      description: 'Customize your experience'
    }
  ];

  // Quick actions - defined as a function to avoid null reference errors
  const getQuickActions = (): QuickActionCard[] => {
    const activeAssignment = assignments.find(a => a.status === 'active');

    return [
      {
        id: 'continue-assignment',
        title: activeAssignment ? 'Continue Assignment' : 'No Active Assignment',
        description: activeAssignment
          ? `${activeAssignment.title || 'Reading Comprehension assessment'} - Due ${new Date(activeAssignment.due_date).toLocaleDateString()}`
          : 'Complete your current assignments',
        icon: PlayCircle,
        color: 'bg-gradient-to-r from-green-500 to-green-600',
        action: () => {
          if (activeAssignment) {
            window.location.href = `/student-dashboard/assignments/${activeAssignment.id}`;
          } else {
            window.location.href = '/student-dashboard/assignments';
          }
        },
        disabled: !activeAssignment
      },
      {
        id: 'daily-challenge',
        title: 'Daily Challenge',
        description: 'Earn bonus XP today!',
        icon: Target,
        color: 'bg-gradient-to-r from-orange-500 to-red-500',
        action: () => console.log('Start daily challenge')
      },
      {
        id: 'practice-mode',
        title: 'Practice Mode',
        description: 'Review learned vocabulary',
        icon: Brain,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        action: () => console.log('Start practice')
      },
      {
        id: 'streak-saver',
        title: 'Streak Saver',
        description: `Keep your ${studentStats?.streak || 0}-day streak alive!`,
        icon: Flame,
        color: 'bg-gradient-to-r from-red-500 to-pink-500',
        action: () => console.log('Save streak'),
        disabled: (studentStats?.streak || 0) === 0
      }
    ];
  };

  // Render home view
  const renderHomeView = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.user_metadata?.first_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'}! 👋</h1>
            <p className="text-blue-100 mt-1">Ready to continue your learning journey?</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-300" />
              <span className="text-lg font-bold">
                Level {loading ? '...' : studentStats?.level || 1}
              </span>
            </div>
            <div className="text-sm text-blue-100">
              {loading ? 'Loading...' : `${studentStats?.xpToNext || 100} XP to next level`}
            </div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Experience Points</span>
            <span>{loading ? '...' : (studentStats?.xp || 0).toLocaleString()} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-white h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: loading ? '0%' :
                  `${Math.min(((studentStats?.xp || 0) / ((studentStats?.xp || 0) + (studentStats?.xpToNext || 100))) * 100, 100)}%`
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Learning Streak"
          value={loading ? '...' : `${studentStats?.streak || 0} days`}
          subtitle="Keep it up!"
          icon={Flame}
          color="bg-gradient-to-r from-red-500 to-pink-500"
          isLoading={loading}
        />
        <StatCard
          title="Achievements"
          value={loading ? '...' : (studentStats?.achievements || 0)}
          subtitle="Badges earned"
          icon={Award}
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
          isLoading={loading}
        />
        <StatCard
          title="Assignments"
          value={loading ? '...' : `${studentStats?.completedAssignments || 0}/${studentStats?.totalAssignments || 0}`}
          subtitle="Completed"
          icon={BookOpen}
          color="bg-gradient-to-r from-green-500 to-teal-500"
          progress={loading ? 0 : Math.round(((studentStats?.completedAssignments || 0) / Math.max(studentStats?.totalAssignments || 1, 1)) * 100)}
          isLoading={loading}
        />
        <StatCard
          title="Total XP"
          value={loading ? '...' : (studentStats?.xp || 0).toLocaleString()}
          subtitle="Experience earned"
          icon={Zap}
          color="bg-gradient-to-r from-blue-500 to-purple-500"
          isLoading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getQuickActions().map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </div>

      {/* Learning Streak & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini Streak Tracker */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 bg-white/20 rounded-full"
              >
                <Flame className="h-6 w-6" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold student-font-display">
                  {studentStats?.streak || 0} Day Streak
                </h3>
                <p className="text-orange-100 text-sm">Keep it going!</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('achievements')}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              View All
            </button>
          </div>

          {/* Weekly Progress */}
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs mb-1 text-orange-200">{day}</div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  index < 5 ? 'bg-white text-orange-600' : 'bg-white/20 text-white'
                }`}>
                  {index < 5 ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 student-font-display">Recent Activity</h3>

          <div className="space-y-3">
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'assignment' ? 'bg-green-500' :
                  activity.type === 'achievement' ? 'bg-yellow-500' :
                  activity.type === 'game' ? 'bg-blue-500' : 'bg-red-500'
                }`}>
                  {activity.type === 'assignment' && <BookOpen className="h-4 w-4 text-white" />}
                  {activity.type === 'achievement' && <Trophy className="h-4 w-4 text-white" />}
                  {activity.type === 'game' && <PlayCircle className="h-4 w-4 text-white" />}
                  {activity.type === 'streak' && <Flame className="h-4 w-4 text-white" />}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>

                <div className="text-right">
                  {activity.score && (
                    <span className="text-xs font-medium text-green-600">{activity.score}%</span>
                  )}
                  {activity.xp && (
                    <span className="text-xs font-medium text-blue-600">+{activity.xp} XP</span>
                  )}
                  {activity.bonus && (
                    <span className="text-xs font-medium text-orange-600">+{activity.bonus}</span>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <PlayCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No recent activity yet</p>
                <p className="text-xs">Start playing games to see your activity here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderHomeView();
      case 'progress':
        return <StudentPerformanceDashboard />;
      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 student-font-display">My Assignments</h2>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Subjects</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Status</option>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            {/* Assignment Progress Tracker */}
            <AssignmentProgressTracker studentId={user?.id} />

            {/* Enhanced Assignment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignmentsLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                ))
              ) : assignments.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                  <p className="text-gray-600">Your teacher hasn't assigned any work yet. Check back later!</p>
                </div>
              ) : (
                assignments.map((assignment) => (
                <EnhancedAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onStart={(id) => console.log('Start assignment:', id)}
                  onContinue={(id) => console.log('Continue assignment:', id)}
                  onReview={(id) => console.log('Review assignment:', id)}
                />
                ))
              )}
            </div>
          </div>
        );
      case 'achievements':
        return <AchievementSystem studentId={user?.id} showNotifications={true} />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={user?.user_metadata?.first_name || user?.user_metadata?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact your teacher to change your name</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="student">Student (Colorful)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                    <span className="text-sm text-gray-700">Enable achievement notifications</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                    <span className="text-sm text-gray-700">Enable assignment reminders</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Verification Panel */}
            <DataVerificationPanel studentId={user?.id} showDetailed={true} />
          </div>
        );
      default:
        return renderHomeView();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 student-font-display">
                Welcome back, {user?.user_metadata?.first_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Level {studentStats?.level || 1} • {studentStats?.totalXP || 0} XP • {studentStats?.currentStreak || 0} day streak
              </p>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className={`p-1 rounded-full ${
                                notification.type === 'achievement' ? 'bg-yellow-100' : 'bg-blue-100'
                              }`}>
                                {notification.type === 'achievement' ? (
                                  <Award className="h-4 w-4 text-yellow-600" />
                                ) : (
                                  <BookOpen className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.timestamp ? new Date(notification.timestamp).toLocaleDateString() : 'Recently'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <NavigationCard
                  key={item.id}
                  item={item}
                  isActive={currentView === item.id}
                  onClick={() => setCurrentView(item.id as any)}
                />
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderCurrentView()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
