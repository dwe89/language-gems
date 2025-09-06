'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Trophy, BarChart3, Settings, Bell, Search,
  User, Menu, X, ChevronRight, Star, Flame, Zap, Crown,
  Calendar, Clock, Target, Award, Gem, Heart, Brain,
  PlayCircle, PauseCircle, Volume2, VolumeX, Sun, Moon,
  Maximize2, Minimize2, RefreshCw, Filter, Download,
  CheckCircle, AlertCircle, TrendingUp, Sparkles, Trophy as TrophyIcon,
  Percent, Hourglass, BarChart2, Gamepad2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthProvider';

import { useSupabase } from '../supabase/SupabaseProvider';
import StudentPerformanceDashboard from './StudentPerformanceDashboard';
import StudentProgressVisualization from './StudentProgressVisualization';

import AchievementSystem from './AchievementSystem';
import LearningStreakTracker from './LearningStreakTracker';
import AssignmentProgressTracker from './AssignmentProgressTracker';

import FSRSPersonalizedInsights from './FSRSPersonalizedInsights';
import { UnifiedStudentDashboardService, DashboardMetrics } from '../../services/unifiedStudentDashboardService';
import { UnifiedVocabularyService, VocabularyStats } from '../../services/unifiedVocabularyService';
import GemsProgressCard from '../dashboard/GemsProgressCard';
import DailyGemsGoal from './DailyGemsGoal';
import { GemsAnalyticsService } from '../../services/analytics/GemsAnalyticsService';


// =====================================================
// NEW ENHANCED ASSIGNMENT CARD COMPONENT
// =====================================================
// Minimal prop/types used by the dashboard to avoid TS errors
type ModernStudentDashboardProps = {
  initialView?: 'home' | 'assignments' | 'vocabulary' | 'grammar' | 'assessments' | 'achievements';
};

type StudentStats = {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  achievements: number;
  completedAssignments: number;
  totalAssignments: number;
  strongWords?: number;
  weakWords?: number;
  vocabularyAccuracy?: number;
};

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color: string;
  description: string;
};

const EnhancedAssignmentCard: React.FC<{
  assignment: any;
  onStart?: (assignment: any) => void;
  onContinue?: (assignment: any) => void;
  onReview?: (assignment: any) => void;
}> = ({ assignment, onStart, onContinue, onReview }) => {
  const statusColors = {
    'completed': 'bg-green-500 text-white',
    'in_progress': 'bg-blue-500 text-white',
    'not_started': 'bg-gray-400 text-white'
  };

  const statusText = {
    'completed': 'Completed',
    'in_progress': 'In Progress',
    'not_started': 'Not Started'
  };

  const statusGradients = {
    'completed': 'from-green-400 to-emerald-600',
    'in_progress': 'from-blue-400 to-indigo-600',
    'not_started': 'from-gray-400 to-slate-600'
  };

  const progressPercentage = (assignment?.score / (assignment?.maxScore || 1)) * 100 || 0;
  const router = useRouter();

  // make safe keys for TS indexing
  const statusKey = String(assignment?.status || 'not_started') as keyof typeof statusGradients;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative"
    >
      {/* Top gradient border */}
  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${statusGradients[statusKey]}`}></div>

      {/* Main content area */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 leading-snug">
            {assignment.title}
          </h3>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${statusColors[statusKey]}`}>
            {statusText[statusKey]}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-indigo-500" />
            <span>Due: {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Target className="h-4 w-4 text-purple-500" />
            <span>Points: {assignment?.maxScore ?? 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Gamepad2 className="h-4 w-4 text-green-500" />
            <span>Game Type: {assignment?.type || 'vocabulary'}</span>
          </div>
        </div>

        {assignment.status === 'in_progress' && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-400 to-indigo-600`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {assignment.status === 'completed' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-green-700">
              <div className="flex items-center"><TrophyIcon className="h-3 w-3 mr-1" /> Score: {assignment.score}</div>
              <div className="flex items-center"><Percent className="h-3 w-3 mr-1" /> Accuracy: {Math.round(assignment.bestAccuracy || 0)}%</div>
              <div className="flex items-center"><Flame className="h-3 w-3 mr-1" /> Attempts: {assignment.attempts || 0}</div>
              <div className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Time: {Math.round(assignment.totalTimeSpent / 60) || 0} min</div>
            </div>
          </div>
        )}

  <div className="flex">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (assignment.status === 'not_started' && onStart) return onStart(assignment);
              if (assignment.status === 'in_progress' && onContinue) return onContinue(assignment);
              if (assignment.status === 'completed' && onReview) return onReview(assignment);
            }}
            className={`w-full flex items-center justify-center py-3 px-6 rounded-full font-semibold transition-all duration-300 shadow-md ${
              assignment.status === 'completed'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
            }`}
          >
            Start/Continue <ArrowRight className="h-5 w-5 ml-2" />
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};

// Simple NavigationCard component (restores earlier behavior)
const NavigationCard: React.FC<{ item: NavigationItem; isActive: boolean; onClick: () => void }> = ({ item, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`relative w-full p-4 rounded-xl text-left transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl'
        : 'bg-white/50 backdrop-blur-lg border border-gray-200 text-gray-700 shadow-md hover:shadow-lg'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : `bg-gradient-to-br ${item.color} shadow`}`}>
        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-white'}`} />
      </div>

      <div className="flex-1">
        <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>{item.label}</h3>
        <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-600'}`}>{item.description}</p>
      </div>

      {item.badge && <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">{item.badge}</div>}

      <ChevronRight className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
    </div>
  </motion.button>
);

type QuickActionCardType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
  disabled?: boolean;
};
const QuickActionCard: React.FC<{ action: QuickActionCardType }> = ({ action }) => (
  <motion.button
    onClick={action.action}
    disabled={action.disabled}
    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
      action.disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white/50 backdrop-blur-lg border border-gray-200 shadow-sm hover:shadow-lg'
    }`}
    whileHover={action.disabled ? {} : { scale: 1.02 }}
    whileTap={action.disabled ? {} : { scale: 0.98 }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-3 rounded-full bg-gradient-to-br ${action.color} shadow`}>
        <action.icon className="h-6 w-6 text-white" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{action.title}</h3>
        <p className="text-sm text-gray-600">{action.description}</p>
      </div>
    </div>
  </motion.button>
);

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: string;
  progress?: number;
  isLoading?: boolean;
};
const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, progress, isLoading = false }) => (
  <div className="relative bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <div className={`absolute -inset-1 z-0 opacity-10 bg-gradient-to-br ${color} rounded-2xl`}></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-gradient-to-br ${color} shadow-md`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {progress !== undefined && (
          <div className="text-right">
            <div className="text-xs text-gray-500 font-medium">Progress</div>
            <div className="text-sm font-bold text-gray-900">{progress}%</div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-base font-semibold text-gray-600">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">
          {isLoading ? (
            <span className="animate-pulse bg-gray-200 rounded h-8 w-20 inline-block"></span>
          ) : (
            value
          )}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ModernStudentDashboard({
  initialView = 'home'
}: ModernStudentDashboardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { supabase } = useSupabase();
  
  // State
  const [currentView, setCurrentView] = useState(initialView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [gemsAnalytics, setGemsAnalytics] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dismissedNotifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);


  // Initialize unified services
  const [dashboardService] = useState(() => new UnifiedStudentDashboardService(supabase));
  const [vocabularyService] = useState(() => new UnifiedVocabularyService(supabase));

  // Level calculation function (consistent with GemsAnalyticsService - 1000 XP per level)
  const calculateLevelFromXP = (totalXP: number) => {
    const level = Math.floor(totalXP / 1000) + 1;
    const xpToNext = 1000 - (totalXP % 1000);
    const xpForNextLevel = 1000;

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

  // Load real student data using unified service
  useEffect(() => {
    if (user?.id) {
      loadUnifiedDashboardData();
      loadNotifications();
    }
  }, [user?.id]);

  const loadUnifiedDashboardData = async () => {
    if (!user?.id || !supabase) return;

    try {
      setLoading(true);

      // Load unified vocabulary data for consistent metrics
      const { stats: vocabularyStats } = await vocabularyService.getVocabularyData(user.id);

      // Load dashboard metrics for other data
      const metrics = await dashboardService.getDashboardMetrics(user.id);

      // Use vocabulary stats for vocabulary-related metrics, dashboard service for others
      const unifiedMetrics = {
        ...metrics,
        totalWordsTracked: vocabularyStats.totalWords,
        masteredWords: vocabularyStats.masteredWords,
        strugglingWords: vocabularyStats.strugglingWords,
        overdueWords: vocabularyStats.overdueWords,
        overallAccuracy: vocabularyStats.averageAccuracy,
        memoryStrength: vocabularyStats.memoryStrength,
        wordsReadyForReview: vocabularyStats.wordsReadyForReview
      };

      setDashboardMetrics(unifiedMetrics);

      // Get basic profile data for level calculation
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get total XP for level calculation
      const { data: xpSummary } = await supabase
        .from('enhanced_game_sessions')
        .select('xp_earned')
        .eq('student_id', user.id);

      const totalXP = xpSummary?.reduce((sum, session) => sum + (session.xp_earned || 0), 0) || 0;

      // Load gems analytics
      console.log('🔍 [DASHBOARD] Loading gems analytics for user:', user.id, user.email);
      const gemsService = new GemsAnalyticsService();
      const gemsData = await gemsService.getStudentGemsAnalytics(user.id);
      console.log('📊 [DASHBOARD] Gems data loaded:', gemsData);
      setGemsAnalytics(gemsData);

      // Calculate level from XP
      const { level, xpToNext } = calculateLevelFromXP(totalXP);

      // Get actual assignment counts for this student's classes only
      let totalAssignments = 0;
      let completedAssignments = 0;

      try {
        // Get student's class enrollments
        const { data: enrollments } = await supabase
          .from('class_enrollments')
          .select('class_id')
          .eq('student_id', user.id);

        if (enrollments && enrollments.length > 0) {
          const classIds = enrollments.map(e => e.class_id);

          // Get assignments for student's classes only (security: class-filtered)
          const { data: assignmentData } = await supabase
            .from('assignments')
            .select('id')
            .in('class_id', classIds);

          totalAssignments = assignmentData?.length || 0;

          // Get completed assignments for this student only
          if (totalAssignments > 0) {
            const { data: completedData } = await supabase
              .from('enhanced_assignment_progress')
              .select('assignment_id')
              .eq('student_id', user.id)
              .eq('status', 'completed')
              .in('assignment_id', assignmentData?.map(a => a.id) || []);

            completedAssignments = completedData?.length || 0;
          }
        }
      } catch (error) {
        console.error('Error loading assignment counts:', error);
        // Fallback to 0 if there's an error
        totalAssignments = 0;
        completedAssignments = 0;
      }

      // Set student stats using unified metrics and actual assignment data
      setStudentStats({
        level,
        xp: totalXP,
        xpToNext,
        streak: Math.round(unifiedMetrics.consistencyScore / 14.3), // Convert to days
        achievements: 0, // TODO: Get from achievements table
        totalAssignments, // Actual assignments for student's classes only
        completedAssignments, // Actual completed assignments for this student
        strongWords: unifiedMetrics.masteredWords,
        weakWords: unifiedMetrics.strugglingWords,
        vocabularyAccuracy: unifiedMetrics.overallAccuracy
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
        totalAssignments: 0,
        strongWords: 0,
        weakWords: 0,
        vocabularyAccuracy: 0
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

      // Get assignment notifications - assignments due in the future (class-filtered for security)
      let assignmentNotifications: any[] = [];

      // First get student's class enrollments
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', user.id);

      if (enrollments && enrollments.length > 0) {
        const classIds = enrollments.map(e => e.class_id);

        // Only get assignments from classes the student is enrolled in
        const { data: notifications } = await supabase
          .from('assignments')
          .select('id, title, due_date')
          .in('class_id', classIds) // Security: class-filtered
          .gte('due_date', new Date().toISOString())
          .order('due_date', { ascending: true })
          .limit(3);

        assignmentNotifications = notifications || [];
      }

      // Check which assignments have submissions by the current user
      const assignmentIds = assignmentNotifications?.map(a => a.id) || [];
      const { data: userSubmissions } = assignmentIds.length > 0 ? await supabase
        .from('enhanced_assignment_progress')
        .select('assignment_id')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds) : { data: [] };

      const submittedAssignmentIds = new Set(userSubmissions?.map(s => s.assignment_id) || []);

      const notifications = [
        ...(achievements || []).map(a => ({
          id: `achievement-${a.id}`,
          type: 'achievement',
          title: 'New Achievement!',
          message: `You earned the "${a.achievement_data?.name || a.name || a.title || 'Mystery Achievement'}" badge!`,
          timestamp: a.earned_at || a.achieved_at,
          isNew: true
        })),
        ...(assignmentNotifications || []).map(a => ({
          id: `assignment-${a.id}`,
          type: 'assignment',
          title: 'Assignment Due Soon',
          message: `"${a.title}" is due ${new Date(a.due_date).toLocaleDateString()}`,
          timestamp: a.due_date,
          isNew: !submittedAssignmentIds.has(a.id)
        }))
      ];

      setNotifications(notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  const dismissNotification = (notificationId: string) => {
    setDismissedNotifications(prev => {
      const newSet = new Set(prev).add(notificationId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dismissedNotifications', JSON.stringify(Array.from(newSet)));
      }
      return newSet;
    });
  };

  // Filter out dismissed notifications
  const visibleNotifications = notifications.filter(n => !dismissedNotifications.has(n.id));



  const loadAssignments = async () => {
    if (!user?.id || !supabase) return;

    try {
      setAssignmentsLoading(true);

      // Get student's class enrollments first
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', user.id);

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        setAssignments([]);
        return;
      }

      // If student has no enrollments, return empty assignments
      if (!enrollments || enrollments.length === 0) {
        setAssignments([]);
        return;
      }

      const classIds = enrollments.map(e => e.class_id);

      // Get assignments for student's classes only
      const { data: assignmentData, error } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          description,
          type,
          time_limit,
          due_date,
          points,
          game_type,
          max_attempts,
          class_id
        `)
        .in('class_id', classIds)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error loading assignments:', error);
        setAssignments([]);
        return;
      }

      // Get submissions for this student separately
      const assignmentIds = assignmentData?.map(a => a.id) || [];
      const { data: submissionData } = assignmentIds.length > 0 ? await supabase
        .from('enhanced_assignment_progress')
        .select('assignment_id, status, best_score, best_accuracy, attempts_count, completed_at, total_time_spent')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds) : { data: [] };

      // Create a map of submissions by assignment_id
      const submissionMap = new Map();
      (submissionData || []).forEach(sub => {
        submissionMap.set(sub.assignment_id, sub);
      });

      // Transform the data to match the expected format
      const transformedAssignments = (assignmentData || []).map(assignment => {
        const submission = submissionMap.get(assignment.id);
        const submissionStatus = submission?.status || 'not_started';

        return {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          type: assignment.game_type || assignment.type || 'vocabulary',
          difficulty: 'beginner', // Default since column may not exist
          estimatedTime: assignment.time_limit || 30,
          dueDate: new Date(assignment.due_date),
          status: submissionStatus,
          progress: submission?.progress || 0,
          score: submission?.best_score || 0,
          maxScore: assignment.points || 100,
          xpReward: assignment.points || 100,
          language: 'Spanish', // Default language since not stored in assignments
          topics: [], // Default topics since not stored in assignments
          requirements: [], // Default requirements since not stored in assignments
          attempts: submission?.attempts_count || 0,
          maxAttempts: assignment.max_attempts || 3,
          isLocked: false,
          totalTimeSpent: submission?.total_time_spent || 0,
          bestAccuracy: submission?.best_accuracy || 0,
          completedAt: submission?.completed_at || null
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

  // Load assignments when component mounts and when view changes to assignments
  useEffect(() => {
    if (user?.id) {
      loadAssignments();
    }
  }, [user?.id]);

  // Refresh assignments when view changes to assignments (for real-time updates)
  useEffect(() => {
    if (currentView === 'assignments' && user?.id) {
      loadAssignments();
    }
  }, [currentView]);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      description: 'Overview and quick actions'
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: BookOpen,
      badge: assignments.filter(a => a.status === 'not_started' || a.status === 'in_progress').length,
      color: 'from-green-500 to-green-600',
      description: 'Current and upcoming tasks'
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      description: 'View all your vocabulary progress'
    },
    {
      id: 'grammar',
      label: 'Grammar',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      description: 'Track your conjugation mastery'
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Track your assessment performance'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      description: 'Badges and rewards earned'
    }
  ];



  // Render home view
  const renderHomeView = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.user_metadata?.first_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'}! 👋</h1>
            <p className="mt-2 text-white/90 text-lg">Your learning journey continues here.</p>
          </div>
          
          <div className="text-right flex items-center space-x-3">
            <div className="flex flex-col items-center">
              <Crown className="h-8 w-8 text-yellow-300 drop-shadow-md" />
              <span className="text-3xl font-bold mt-1">
                {loading ? '...' : studentStats?.level || 1}
              </span>
              <span className="text-sm text-white/70">Level</span>
            </div>
            <div className="flex flex-col items-center">
              <Gem className="h-8 w-8 text-cyan-300 drop-shadow-md" />
              <span className="text-3xl font-bold mt-1">
                {loading ? '...' : (gemsAnalytics?.totalGems || 0).toLocaleString()}
              </span>
              <span className="text-sm text-white/70">Gems</span>
            </div>
          </div>
        </div>
        
        {/* Level Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-white">Level Progress</span>
            <span className="text-white/80 font-medium">
              {loading ? '...' : `${1000 - ((studentStats?.xp || 0) % 1000)} XP to Level ${(studentStats?.level || 1) + 1}`}
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <motion.div
              className="bg-white h-3 rounded-full shadow-inner"
              initial={{ width: 0 }}
              animate={{
                width: loading ? '0%' :
                  `${Math.min(((studentStats?.xp || 0) % 1000) / 10, 100)}%`
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
          value={loading ? '...' : `${studentStats?.streak || 0}`}
          subtitle="days"
          icon={Flame}
          color="from-red-500 to-pink-500"
          isLoading={loading}
        />
        <StatCard
          title="Achievements"
          value={loading ? '...' : (studentStats?.achievements || 0)}
          subtitle="badges earned"
          icon={Award}
          color="from-yellow-500 to-orange-500"
          isLoading={loading}
        />
        <StatCard
          title="Assignments"
          value={loading ? '...' : `${studentStats?.completedAssignments || 0}/${studentStats?.totalAssignments || 0}`}
          subtitle="completed"
          icon={BookOpen}
          color="from-green-500 to-teal-500"
          progress={loading ? 0 : Math.round(((studentStats?.completedAssignments || 0) / Math.max(studentStats?.totalAssignments || 1, 1)) * 100)}
          isLoading={loading}
        />
        <StatCard
          title="Avg Accuracy"
          value={loading ? '...' : `${(studentStats?.vocabularyAccuracy || 0).toFixed(1)}%`}
          subtitle="overall"
          icon={Target}
          color="from-purple-500 to-indigo-500"
          isLoading={loading}
        />
      </div>

      {/* Gems Progress Card with Dual-Track System */}
      {gemsAnalytics && (
        <GemsProgressCard
          totalGems={gemsAnalytics.totalGems}
          gemsByRarity={gemsAnalytics.gemsByRarity}
          totalXP={gemsAnalytics.totalXP}
          currentLevel={gemsAnalytics.currentLevel}
          xpToNextLevel={gemsAnalytics.xpToNextLevel}
          xpBreakdown={gemsAnalytics.xpBreakdown}
          activityGemsToday={gemsAnalytics.activityGemsToday}
          masteryGemsToday={gemsAnalytics.masteryGemsToday}
          className="mb-6"
        />
      )}

      {/* Daily Gems Goal with Dual-Track Info */}
      {gemsAnalytics && (
        <div className="mb-6">
          <DailyGemsGoal
            dailyGoal={10} // Daily goal of 10 Mastery Gems (vocabulary learning focus)
            gemsEarnedToday={gemsAnalytics.masteryGemsToday || 0} // Only count Mastery Gems
            gemsByRarityToday={gemsAnalytics.gemsByRarityToday || {}} // Shows Mastery Gem rarities
          />

          {/* Today's Triple-Track Breakdown */}
          <div className="mt-4 bg-white rounded-2xl shadow-md p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Today's Gem Breakdown</h4>
            <div className={`grid gap-4 ${gemsAnalytics.grammarGemsToday > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 shadow-sm">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-green-700">
                    {gemsAnalytics.activityGemsToday || 0}
                  </div>
                  <div className="text-sm text-green-600">Activity Gems</div>
                  <div className="text-xs text-gray-500">Performance rewards</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 shadow-sm">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-purple-700">
                    {gemsAnalytics.masteryGemsToday || 0}
                  </div>
                  <div className="text-sm text-purple-600">Mastery Gems</div>
                  <div className="text-xs text-gray-500">Vocabulary collection</div>
                </div>
              </div>

              {gemsAnalytics.grammarGemsToday > 0 && (
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 shadow-sm">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-orange-700">
                      {gemsAnalytics.grammarGemsToday || 0}
                    </div>
                    <div className="text-sm text-orange-600">Grammar Gems</div>
                    <div className="text-xs text-gray-500">Conjugation mastery</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unified Dashboard Metrics */}
      {dashboardMetrics && (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Analytics</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-blue-600">{dashboardMetrics.totalWordsTracked}</div>
              <div className="text-sm text-gray-600">Words Tracked</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-green-600">{dashboardMetrics.overallAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-purple-600">{dashboardMetrics.memoryStrength.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Memory Strength</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-orange-600">{dashboardMetrics.wordsReadyForReview}</div>
              <div className="text-sm text-gray-600">Due for Review</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/70 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Vocabulary Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mastered Words:</span>
                  <span className="text-sm font-semibold text-green-600">{dashboardMetrics.masteredWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Struggling Words:</span>
                  <span className="text-sm font-semibold text-red-600">{dashboardMetrics.strugglingWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overdue Words:</span>
                  <span className="text-sm font-semibold text-orange-600">{dashboardMetrics.overdueWords}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/70 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Study Recommendations</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recommended Study Time:</span>
                  <span className="text-sm font-semibold text-blue-600">{dashboardMetrics.recommendedStudyTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consistency Score:</span>
                  <span className="text-sm font-semibold text-purple-600">{dashboardMetrics.consistencyScore.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {dashboardMetrics.priorityWords.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Priority Words to Review</h3>
              <div className="flex flex-wrap gap-2">
                {dashboardMetrics.priorityWords.slice(0, 5).map((word, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      word.reason === 'overdue' ? 'bg-red-100 text-red-800' :
                      word.reason === 'struggling' ? 'bg-orange-100 text-orange-800' :
                      word.reason === 'inconsistent' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {word.word} ({word.reason})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Insights */}
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Vocabulary Progress</h2>
          <div className="flex items-center space-x-3">
            <Link
              href="/student-dashboard/vocabulary"
              className="bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>View All Words</span>
            </Link>
            <Link
              href="/student-dashboard/vocabulary/analysis"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>View Analysis</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-sm">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-green-800">
                  {loading ? '...' : (studentStats?.strongWords || 0)}
                </div>
                <div className="text-sm text-green-600">Strong Words</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-full shadow-sm">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-red-800">
                  {loading ? '...' : (studentStats?.weakWords || 0)}
                </div>
                <div className="text-sm text-red-600">Weak Words</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-sm">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-800">
                  {loading ? '...' : `${studentStats?.vocabularyAccuracy || 0}%`}
                </div>
                <div className="text-sm text-blue-600">Avg Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/student-dashboard/games/vocab-master?lang=es&level=KS3&mode=weak&theme=default"
            className="bg-red-600 text-white px-3 py-2 rounded-full text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Practice Weak Words</span>
          </Link>
          <Link
            href="/student-dashboard/vocabulary/dashboard"
            className="bg-orange-600 text-white px-3 py-2 rounded-full text-sm hover:bg-orange-700 transition-colors flex items-center space-x-1"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Vocabulary Dashboard</span>
          </Link>
          <Link
            href="/student-dashboard/vocabulary/progress"
            className="bg-purple-600 text-white px-3 py-2 rounded-full text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1"
          >
            <TrendingUp className="h-4 w-4" />
            <span>View Progress</span>
          </Link>
          <Link
            href="/student-dashboard/vocabulary/review"
            className="bg-green-600 text-white px-3 py-2 rounded-full text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <Clock className="h-4 w-4" />
            <span>Review Schedule</span>
          </Link>
        </div>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderHomeView();
      case 'vocabulary':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Vocabulary Progress</h2>
              <Link
                href="/student-dashboard/vocabulary/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Vocabulary Dashboard</span>
              </Link>
            </div>

            {/* Vocabulary metrics from unified dashboard */}
            {dashboardMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-sm">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalWordsTracked}</div>
                      <div className="text-sm text-gray-600">Words Tracked</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-sm">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardMetrics.overallAccuracy.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Overall Accuracy</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full shadow-sm">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardMetrics.memoryStrength.toFixed(0)}%</div>
                      <div className="text-sm text-gray-600">Memory Strength</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-sm">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardMetrics.wordsReadyForReview}</div>
                      <div className="text-sm text-gray-600">Ready to Review</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vocabulary status breakdown */}
            {dashboardMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-800">{dashboardMetrics.masteredWords}</div>
                      <div className="text-sm text-green-600">Mastered Words</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-lg border border-orange-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold text-orange-800">{dashboardMetrics.strugglingWords}</div>
                      <div className="text-sm text-orange-600">Need Practice</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-lg border border-red-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <div className="text-2xl font-bold text-red-800">{dashboardMetrics.overdueWords}</div>
                      <div className="text-sm text-red-600">Overdue Words</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick vocabulary actions */}
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/student-dashboard/games/vocab-master?lang=es&level=KS3&mode=weak&theme=default"
                  className="bg-red-600 text-white px-4 py-3 rounded-full hover:bg-red-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Practice Weak Words</span>
                </Link>
                <Link
                  href="/student-dashboard/vocabulary/dashboard"
                  className="bg-orange-600 text-white px-4 py-3 rounded-full hover:bg-orange-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Vocabulary Dashboard</span>
                </Link>
                <Link
                  href="/student-dashboard/vocabulary/progress"
                  className="bg-purple-600 text-white px-4 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>View Progress</span>
                </Link>
                <Link
                  href="/student-dashboard/vocabulary/review"
                  className="bg-green-600 text-white px-4 py-3 rounded-full hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Clock className="h-4 w-4" />
                  <span>Review Schedule</span>
                </Link>
              </div>
            </div>

            {/* Priority words section */}
            {dashboardMetrics?.priorityWords && dashboardMetrics.priorityWords.length > 0 && (
              <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Words</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardMetrics.priorityWords.slice(0, 8).map((word, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">{word.word}</span>
                        <span className="text-gray-600 ml-2">({word.translation})</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        word.reason === 'overdue' ? 'bg-red-100 text-red-800' :
                        word.reason === 'struggling' ? 'bg-orange-100 text-orange-800' :
                        word.reason === 'inconsistent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {word.reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900 student-font-display">My Assignments</h2>
              <div className="flex flex-wrap items-center gap-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {assignmentsLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 p-6 animate-pulse">
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
                  onStart={(assignment: any) => router.push(`/student-dashboard/assignments/${assignment.id}`)}
                  onContinue={(assignment: any) => router.push(`/student-dashboard/assignments/${assignment.id}`)}
                  onReview={(assignment: any) => router.push(`/student-dashboard/assignments/${assignment.id}`)}
                />
                ))
              )}
            </div>
          </div>
        );
      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Assessment Analytics</h2>
              <Link
                href="/student-dashboard/assessments"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Take Assessment</span>
              </Link>
            </div>

            <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 p-8 text-center shadow-md">
              <BarChart3 className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Analytics</h3>
              <p className="text-gray-600 mb-4">
                Track your performance across listening, reading, speaking, and writing assessments.
              </p>
              <Link
                href="/student-dashboard/assessments"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>View Full Analytics</span>
              </Link>
            </div>
          </div>
        );
      case 'grammar':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Grammar Progress</h2>
              <button
                type="button"
                onClick={() => router.push('/student-dashboard/grammar/analytics')}
                className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>View Analytics</span>
              </button>
            </div>
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200 p-6 shadow-md">
              <p className="text-gray-600 mb-4">Track your conjugation mastery and grammar skills.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/70 rounded-lg shadow-sm">
                  <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">Conjugations</div>
                  <div className="text-sm text-gray-600">Practice verb forms</div>
                </div>
                <div className="text-center p-4 bg-white/70 rounded-lg shadow-sm">
                  <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">Accuracy</div>
                  <div className="text-sm text-gray-600">Track your progress</div>
                </div>
                <div className="text-center p-4 bg-white/70 rounded-lg shadow-sm">
                  <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">Grammar Gems</div>
                  <div className="text-sm text-gray-600">Earn rewards</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'achievements':
        return <AchievementSystem studentId={user?.id} showNotifications={true} />;

      default:
        return renderHomeView();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200 mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 student-font-display">
                Welcome back, {user?.user_metadata?.first_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Level {studentStats?.level || 1} • {gemsAnalytics?.totalGems || 0} Gems • {studentStats?.streak || 0} day streak
              </p>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {visibleNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                    {visibleNotifications.length}
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
                    className="absolute right-0 mt-2 w-80 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          title="Close notifications"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {visibleNotifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        visibleNotifications.map((notification) => (
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                title="Dismiss"
                              >
                                <X className="h-3 w-3" />
                              </button>
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <aside className="lg:w-80 lg:flex-shrink-0">
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
          <main className="flex-1 min-w-0 overflow-hidden">
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
