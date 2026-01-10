'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, Trophy, TrendingUp, Clock, Target,
  Plus, Filter, Search, Download, RefreshCw, Settings,
  BarChart3, PieChart, Activity, Calendar, Bell,
  Star, Award, Zap, Heart, Brain, Gem, Eye, Sparkles,
  ChevronRight, ChevronDown, AlertCircle, CheckCircle, TrendingDown,
  GraduationCap, UserCheck, UserX, Mail, MoreVertical, Play
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { EnhancedGameService } from '../../services/enhancedGameService';
import { EnhancedAssignmentService, ClassPerformanceMetrics } from '../../services/enhancedAssignmentService';
import { GemsAnalyticsService } from '../../services/analytics/GemsAnalyticsService';
import TeacherVocabularyAnalyticsDashboard from '../teacher/TeacherVocabularyAnalyticsDashboard';
import EnhancedAnalyticsDashboard from '../analytics/EnhancedAnalyticsDashboard';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Cell, Pie } from 'recharts';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface DashboardStats {
  totalStudents: number;
  activeAssignments: number;
  completedAssignments: number;
  averageClassScore: number;
  averageAccuracy: number;
  totalGameSessions: number;
  studentsOnline: number;
  improvementRate: number;
}

interface ClassOverview {
  id: string;
  name: string;
  studentCount: number;
  activeAssignments: number;
  averageScore: number;
  averageAccuracy: number;
  lastActivity: string;
  engagementScore: number;
  strugglingStudents: number;
  topPerformers: number;
}

interface RecentActivity {
  id: string;
  type: 'assignment_completed' | 'achievement_earned' | 'new_student' | 'game_session';
  studentName: string;
  description: string;
  timestamp: string;
  score?: number;
  achievement?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  className: string;
  classId: string;
  gemsCollected: number;
  accuracy: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  streak: number;
  lastActive: string;
  trend: 'up' | 'down' | 'stable';
  level: number;
}

interface AssignmentData {
  id: string;
  title: string;
  className: string;
  classId: string;
  dueDate: string;
  status: 'active' | 'completed' | 'draft';
  submissionRate: number;
  averageScore: number;
  totalStudents: number;
  completedStudents: number;
  gameType: string;
}

interface EnhancedTeacherDashboardProps {
  initialView?: 'overview' | 'classes' | 'assignments' | 'analytics' | 'students';
}

// =====================================================
// ENHANCED TEACHER DASHBOARD COMPONENT
// =====================================================

export default function EnhancedTeacherDashboard({
  initialView = 'overview'
}: EnhancedTeacherDashboardProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // Services
  const [gameService] = useState(() => new EnhancedGameService(supabase));
  const [assignmentService] = useState(() => new EnhancedAssignmentService(supabase));
  const [gemsAnalyticsService] = useState(() => new GemsAnalyticsService());
  
  // State
  const [currentView, setCurrentView] = useState(initialView);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [classOverviews, setClassOverviews] = useState<ClassOverview[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [gemsAnalytics, setGemsAnalytics] = useState<any>(null);
  
  // New state for enhanced views
  const [students, setStudents] = useState<StudentData[]>([]);
  const [allAssignments, setAllAssignments] = useState<AssignmentData[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentSortBy, setStudentSortBy] = useState<'name' | 'accuracy' | 'gems' | 'streak'>('name');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [weeklyActivityData, setWeeklyActivityData] = useState<any[]>([]);
  const [performanceDistribution, setPerformanceDistribution] = useState<any[]>([]);

  // =====================================================
  // DATA LOADING
  // =====================================================

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      refreshDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [stats, classes, activities, notifs, studentsData, assignmentsData, weeklyData, perfData] = await Promise.all([
        loadDashboardStats(),
        loadClassOverviews(),
        loadRecentActivities(),
        loadNotifications(),
        loadStudentsData(),
        loadAssignmentsData(),
        loadWeeklyActivityData(),
        loadPerformanceDistribution()
      ]);

      setDashboardStats(stats);
      setClassOverviews(classes);
      setRecentActivities(activities);
      setNotifications(notifs);
      setStudents(studentsData);
      setAllAssignments(assignmentsData);
      setWeeklyActivityData(weeklyData);
      setPerformanceDistribution(perfData);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboardData = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadDashboardStats = async (): Promise<DashboardStats> => {
    // Mock data - replace with actual API calls
    return {
      totalStudents: 156,
      activeAssignments: 12,
      completedAssignments: 45,
      averageClassScore: 847,
      averageAccuracy: 78.5,
      totalGameSessions: 1247,
      studentsOnline: 23,
      improvementRate: 12.3
    };
  };

  const loadClassOverviews = async (): Promise<ClassOverview[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        id: '1',
        name: 'Spanish 101 - Morning',
        studentCount: 28,
        activeAssignments: 3,
        averageScore: 892,
        averageAccuracy: 82.1,
        lastActivity: '2 minutes ago',
        engagementScore: 85.7,
        strugglingStudents: 4,
        topPerformers: 8
      },
      {
        id: '2',
        name: 'Spanish 102 - Afternoon',
        studentCount: 32,
        activeAssignments: 4,
        averageScore: 756,
        averageAccuracy: 74.8,
        lastActivity: '15 minutes ago',
        engagementScore: 79.4,
        strugglingStudents: 7,
        topPerformers: 6
      },
      {
        id: '3',
        name: 'Advanced Spanish',
        studentCount: 24,
        activeAssignments: 2,
        averageScore: 923,
        averageAccuracy: 88.6,
        lastActivity: '5 minutes ago',
        engagementScore: 91.2,
        strugglingStudents: 2,
        topPerformers: 12
      }
    ];
  };

  const loadRecentActivities = async (): Promise<RecentActivity[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        id: '1',
        type: 'assignment_completed',
        studentName: 'Alice Johnson',
        description: 'Completed "Spanish Food Vocabulary" assignment',
        timestamp: '2 minutes ago',
        score: 923
      },
      {
        id: '2',
        type: 'achievement_earned',
        studentName: 'Bob Smith',
        description: 'Earned "Speed Demon" achievement',
        timestamp: '5 minutes ago',
        achievement: 'Speed Demon'
      },
      {
        id: '3',
        type: 'game_session',
        studentName: 'Carol Davis',
        description: 'Played Gem Collector game',
        timestamp: '8 minutes ago',
        score: 1045
      },
      {
        id: '4',
        type: 'new_student',
        studentName: 'David Wilson',
        description: 'Joined Spanish 101 - Morning class',
        timestamp: '1 hour ago'
      }
    ];
  };

  const loadNotifications = async () => {
    // Mock data - replace with actual API calls
    return [
      {
        id: '1',
        type: 'assignment_due',
        title: 'Assignment Due Soon',
        message: '3 assignments are due within 24 hours',
        priority: 'high',
        timestamp: '1 hour ago'
      },
      {
        id: '2',
        type: 'student_struggling',
        title: 'Students Need Help',
        message: '5 students are struggling with current assignments',
        priority: 'medium',
        timestamp: '2 hours ago'
      },
      {
        id: '3',
        type: 'achievement_milestone',
        title: 'Class Milestone',
        message: 'Spanish 101 reached 1000 total game sessions!',
        priority: 'low',
        timestamp: '1 day ago'
      }
    ];
  };

  const loadStudentsData = async (): Promise<StudentData[]> => {
    // Try to load real data first, fallback to mock
    try {
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select(`
          student_id,
          class:classes(id, name)
        `);

      if (enrollments && enrollments.length > 0) {
        const studentIds = [...new Set(enrollments.map(e => e.student_id))];
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .in('id', studentIds);

        if (profiles && profiles.length > 0) {
          return profiles.map((profile, index) => {
            const enrollment = enrollments.find(e => e.student_id === profile.id);
            return {
              id: profile.id,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email?.split('@')[0] || 'Student',
              email: profile.email || '',
              className: (enrollment?.class as any)?.name || 'Unassigned',
              classId: (enrollment?.class as any)?.id || '',
              gemsCollected: Math.floor(Math.random() * 5000) + 500,
              accuracy: Math.floor(Math.random() * 30) + 65,
              assignmentsCompleted: Math.floor(Math.random() * 15) + 5,
              totalAssignments: 20,
              streak: Math.floor(Math.random() * 30) + 1,
              lastActive: ['2 min ago', '15 min ago', '1 hour ago', 'Yesterday'][index % 4],
              trend: ['up', 'down', 'stable'][index % 3] as 'up' | 'down' | 'stable',
              level: Math.floor(Math.random() * 15) + 5
            };
          });
        }
      }
    } catch (error) {
      console.error('Error loading real student data:', error);
    }

    // Fallback mock data
    const mockNames = [
      'Emma Thompson', 'Liam Garcia', 'Sophia Martinez', 'Noah Johnson', 'Olivia Williams',
      'James Brown', 'Isabella Davis', 'Lucas Wilson', 'Mia Taylor', 'Ethan Anderson',
      'Charlotte Thomas', 'Mason Jackson', 'Amelia White', 'Alexander Harris', 'Harper Martin'
    ];

    return mockNames.map((name, index) => ({
      id: `student-${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@school.edu`,
      className: ['Spanish 101 - Morning', 'Spanish 102 - Afternoon', 'Advanced Spanish'][index % 3],
      classId: `class-${(index % 3) + 1}`,
      gemsCollected: Math.floor(Math.random() * 5000) + 500,
      accuracy: Math.floor(Math.random() * 30) + 65,
      assignmentsCompleted: Math.floor(Math.random() * 15) + 5,
      totalAssignments: 20,
      streak: Math.floor(Math.random() * 30) + 1,
      lastActive: ['2 min ago', '15 min ago', '1 hour ago', 'Yesterday'][index % 4],
      trend: ['up', 'down', 'stable'][index % 3] as 'up' | 'down' | 'stable',
      level: Math.floor(Math.random() * 15) + 5
    }));
  };

  const loadAssignmentsData = async (): Promise<AssignmentData[]> => {
    try {
      const { data: assignments } = await supabase
        .from('assignments')
        .select(`
          id, title, due_date, game_type, points,
          class:classes(id, name)
        `)
        .order('due_date', { ascending: false })
        .limit(20);

      if (assignments && assignments.length > 0) {
        return assignments.map((a, index) => ({
          id: a.id,
          title: a.title,
          className: (a.class as any)?.name || 'Unknown Class',
          classId: (a.class as any)?.id || '',
          dueDate: a.due_date,
          status: new Date(a.due_date) < new Date() ? 'completed' : 'active',
          submissionRate: Math.floor(Math.random() * 40) + 60,
          averageScore: Math.floor(Math.random() * 300) + 700,
          totalStudents: Math.floor(Math.random() * 15) + 20,
          completedStudents: Math.floor(Math.random() * 15) + 10,
          gameType: a.game_type || 'vocabulary'
        }));
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    }

    // Fallback mock data
    const mockAssignments = [
      'Food Vocabulary Quiz', 'Colors & Numbers Practice', 'Family Members Challenge',
      'Verb Conjugations Test', 'Travel Phrases Master', 'Weather Expressions',
      'Body Parts Review', 'Daily Routines', 'Clothing Vocabulary'
    ];

    return mockAssignments.map((title, index) => ({
      id: `assignment-${index + 1}`,
      title,
      className: ['Spanish 101 - Morning', 'Spanish 102 - Afternoon', 'Advanced Spanish'][index % 3],
      classId: `class-${(index % 3) + 1}`,
      dueDate: new Date(Date.now() + (index - 3) * 24 * 60 * 60 * 1000).toISOString(),
      status: index < 3 ? 'completed' : index < 7 ? 'active' : 'draft',
      submissionRate: Math.floor(Math.random() * 40) + 60,
      averageScore: Math.floor(Math.random() * 300) + 700,
      totalStudents: Math.floor(Math.random() * 15) + 20,
      completedStudents: Math.floor(Math.random() * 15) + 10,
      gameType: ['vocab-master', 'memory-game', 'word-scramble', 'hangman'][index % 4]
    }));
  };

  const loadWeeklyActivityData = async () => {
    return [
      { day: 'Mon', gameSessions: 145, assignments: 23, avgScore: 847 },
      { day: 'Tue', gameSessions: 132, assignments: 18, avgScore: 892 },
      { day: 'Wed', gameSessions: 178, assignments: 31, avgScore: 823 },
      { day: 'Thu', gameSessions: 156, assignments: 27, avgScore: 867 },
      { day: 'Fri', gameSessions: 198, assignments: 42, avgScore: 901 },
      { day: 'Sat', gameSessions: 89, assignments: 12, avgScore: 876 },
      { day: 'Sun', gameSessions: 67, assignments: 8, avgScore: 845 }
    ];
  };

  const loadPerformanceDistribution = async () => {
    return [
      { name: 'Excellent (90%+)', value: 35, color: '#10B981' },
      { name: 'Good (75-89%)', value: 42, color: '#3B82F6' },
      { name: 'Average (60-74%)', value: 18, color: '#F59E0B' },
      { name: 'Needs Help (<60%)', value: 5, color: '#EF4444' }
    ];
  };

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const quickActions: QuickAction[] = [
    {
      id: 'create_assignment',
      title: 'Create Assignment',
      description: 'Create a new game-based assignment',
      icon: <Plus className="h-6 w-6" />,
      action: () => {
        // Navigate to assignment creation
        window.location.href = '/dashboard/assignments/create';
      },
      color: 'bg-blue-500'
    },
    {
      id: 'view_analytics',
      title: 'View Analytics',
      description: 'See detailed class performance',
      icon: <BarChart3 className="h-6 w-6" />,
      action: () => setCurrentView('analytics'),
      color: 'bg-green-500'
    },
    {
      id: 'manage_classes',
      title: 'Manage Classes',
      description: 'View and manage your classes',
      icon: <Users className="h-6 w-6" />,
      action: () => setCurrentView('classes'),
      color: 'bg-purple-500'
    },
    {
      id: 'create_template',
      title: 'Create Template',
      description: 'Save assignment as template',
      icon: <Star className="h-6 w-6" />,
      action: () => {
        // Navigate to template creation
        window.location.href = '/dashboard/templates/create';
      },
      color: 'bg-yellow-500'
    }
  ];

  // =====================================================
  // RENDER METHODS
  // =====================================================

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Grid with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold mt-1">{dashboardStats?.totalStudents || 0}</p>
              <div className="flex items-center mt-2 text-blue-200 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5.2% this month</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white shadow-lg shadow-green-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Active Assignments</p>
              <p className="text-3xl font-bold mt-1">{dashboardStats?.activeAssignments || 0}</p>
              <div className="flex items-center mt-2 text-emerald-200 text-sm">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{dashboardStats?.completedAssignments || 0} completed</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Average Score</p>
              <p className="text-3xl font-bold mt-1">{dashboardStats?.averageClassScore || 0}</p>
              <div className="flex items-center mt-2 text-amber-200 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{dashboardStats?.improvementRate || 0}% improvement</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Trophy className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Students Online</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold">{dashboardStats?.studentsOnline || 0}</p>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/30 rounded-full text-xs font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="flex items-center mt-2 text-purple-200 text-sm">
                <Activity className="h-4 w-4 mr-1" />
                <span>Active now</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Activity className="h-8 w-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              onClick={action.action}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all text-left group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Class Overviews and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Overviews */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Class Overview</h2>
            <button
              onClick={() => setCurrentView('classes')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {classOverviews.slice(0, 3).map((classItem) => (
              <ClassOverviewCard key={classItem.id} classData={classItem} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="flex items-center space-x-3">
          <select
            value={selectedClass || ''}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Classes</option>
            {classOverviews.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          <button
            onClick={refreshDashboardData}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <EnhancedAnalyticsDashboard
        classId={selectedClass || undefined}
        viewMode="teacher"
      />
    </div>
  );

  // Filtered and sorted students for the Students view
  const filteredStudents = useMemo(() => {
    let result = [...students];
    
    // Filter by search query
    if (studentSearchQuery) {
      const query = studentSearchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.email.toLowerCase().includes(query) ||
        s.className.toLowerCase().includes(query)
      );
    }

    // Filter by selected class
    if (selectedClass) {
      result = result.filter(s => s.classId === selectedClass);
    }

    // Sort
    result.sort((a, b) => {
      switch (studentSortBy) {
        case 'accuracy': return b.accuracy - a.accuracy;
        case 'gems': return b.gemsCollected - a.gemsCollected;
        case 'streak': return b.streak - a.streak;
        default: return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [students, studentSearchQuery, selectedClass, studentSortBy]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    if (assignmentFilter === 'all') return allAssignments;
    return allAssignments.filter(a => a.status === assignmentFilter);
  }, [allAssignments, assignmentFilter]);

  const renderClasses = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all your classes</p>
        </div>
        <Link
          href="/dashboard/classes/create"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Class
        </Link>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {classOverviews.map((classItem, index) => {
          const languageColors: Record<string, string> = {
            'Spanish': 'from-red-500 to-orange-500',
            'French': 'from-blue-500 to-indigo-500',
            'German': 'from-yellow-500 to-amber-600'
          };
          const language = classItem.name.includes('Spanish') ? 'Spanish' : 
                          classItem.name.includes('French') ? 'French' : 'German';
          const gradient = languageColors[language] || 'from-purple-500 to-indigo-500';

          return (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Class Header */}
              <div className={`bg-gradient-to-r ${gradient} p-5 text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{classItem.name}</h3>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                    {classItem.lastActivity}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{classItem.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{classItem.activeAssignments} active</span>
                  </div>
                </div>
              </div>

              {/* Class Stats */}
              <div className="p-5">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">{classItem.averageScore}</div>
                    <div className="text-xs text-blue-600/70">Avg Score</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-xl font-bold text-green-600">{classItem.averageAccuracy}%</div>
                    <div className="text-xs text-green-600/70">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-xl font-bold text-purple-600">{classItem.engagementScore}%</div>
                    <div className="text-xs text-purple-600/70">Engagement</div>
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{classItem.strugglingStudents} need attention</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Star className="h-4 w-4" />
                      <span>{classItem.topPerformers} excelling</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/classes/${classItem.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium text-center transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedClass(classItem.id);
                      setCurrentView('students');
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium text-center transition-colors"
                  >
                    View Students
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Class Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyActivityData}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="gameSessions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#colorSessions)" 
                name="Game Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => {
    const trendColors = {
      up: 'text-green-600 bg-green-100',
      down: 'text-red-600 bg-red-100',
      stable: 'text-gray-600 bg-gray-100'
    };

    const trendIcons = {
      up: <TrendingUp className="h-3 w-3" />,
      down: <TrendingDown className="h-3 w-3" />,
      stable: <span className="text-xs">—</span>
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Progress</h2>
            <p className="text-gray-600 mt-1">Track individual student performance across all classes</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshDashboardData}
              disabled={refreshing}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name, email, or class..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            {/* Class Filter */}
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value || null)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {classOverviews.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={studentSortBy}
              onChange={(e) => setStudentSortBy(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="accuracy">Sort by Accuracy</option>
              <option value="gems">Sort by Gems</option>
              <option value="streak">Sort by Streak</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gems</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Streak</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student, index) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {student.className}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                        <Crown className="h-3 w-3" />
                        <span className="text-sm font-semibold">{student.level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 text-yellow-600">
                        <Gem className="h-4 w-4" />
                        <span className="font-semibold">{student.gemsCollected.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-lg ${
                        student.accuracy >= 85 ? 'bg-green-100 text-green-700' :
                        student.accuracy >= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <span className="font-semibold">{student.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 text-orange-600">
                        <Zap className="h-4 w-4" />
                        <span className="font-semibold">{student.streak}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            style={{ width: `${(student.assignmentsCompleted / student.totalAssignments) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {student.assignmentsCompleted}/{student.totalAssignments}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[student.trend as keyof typeof trendColors] || trendColors.stable}`}>
                        {trendIcons[student.trend as keyof typeof trendIcons] || trendIcons.stable}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      {student.lastActive}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No students found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
              </div>
              <Users className="h-10 w-10 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Avg Accuracy</p>
                <p className="text-3xl font-bold">
                  {students.length > 0 ? Math.round(students.reduce((a, s) => a + s.accuracy, 0) / students.length) : 0}%
                </p>
              </div>
              <Target className="h-10 w-10 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Total Gems</p>
                <p className="text-3xl font-bold">{students.reduce((a, s) => a + s.gemsCollected, 0).toLocaleString()}</p>
              </div>
              <Gem className="h-10 w-10 text-yellow-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Streaks</p>
                <p className="text-3xl font-bold">{students.filter(s => s.streak > 0).length}</p>
              </div>
              <Zap className="h-10 w-10 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssignments = () => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-600 border-gray-200',
      draft: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };

    const gameTypeLabels: Record<string, string> = {
      'vocab-master': 'Vocab Master',
      'memory-game': 'Memory Game',
      'word-scramble': 'Word Scramble',
      'hangman': 'Hangman',
      'speed-builder': 'Speed Builder',
      'vocabulary': 'Vocabulary'
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assignment Management</h2>
            <p className="text-gray-600 mt-1">Create and track all class assignments</p>
          </div>
          <Link
            href="/dashboard/assignments/create"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Assignment
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100 inline-flex gap-1">
          {(['all', 'active', 'completed', 'draft'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setAssignmentFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                assignmentFilter === filter
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-black/10">
                {filter === 'all' ? allAssignments.length : allAssignments.filter(a => a.status === filter).length}
              </span>
            </button>
          ))}
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Assignment Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">{assignment.className}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{gameTypeLabels[assignment.gameType] || assignment.gameType}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[assignment.status]}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Assignment Stats */}
              <div className="p-5 bg-gray-50/50">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{assignment.submissionRate}%</div>
                    <div className="text-xs text-gray-500">Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{assignment.averageScore}</div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{assignment.completedStudents}/{assignment.totalStudents}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">{Math.round((assignment.completedStudents / assignment.totalStudents) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${(assignment.completedStudents / assignment.totalStudents) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Due Date & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/assignments/${assignment.id}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      View
                    </Link>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500 mb-4">
              {assignmentFilter === 'all' 
                ? "You haven't created any assignments yet."
                : `No ${assignmentFilter} assignments found.`}
            </p>
            <Link
              href="/dashboard/assignments/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Your First Assignment
            </Link>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enhanced dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Teacher Dashboard</h1>
                  <p className="text-xs text-white/70">Welcome back, {user?.user_metadata?.first_name || 'Teacher'}!</p>
                </div>
              </div>
              {refreshing && (
                <div className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                  <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                  Updating...
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4 mr-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">{dashboardStats?.totalStudents || 0} Students</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                  <Activity className="h-4 w-4 text-green-300" />
                  <span className="text-sm font-medium">{dashboardStats?.studentsOnline || 0} Online</span>
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Settings */}
              <Link href="/dashboard/settings" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 py-3 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'classes', label: 'Classes', icon: <GraduationCap className="h-4 w-4" /> },
              { id: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> },
              { id: 'assignments', label: 'Assignments', icon: <BookOpen className="h-4 w-4" /> },
              { id: 'vocabulary', label: 'Vocabulary', icon: <Brain className="h-4 w-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                  ${currentView === item.id
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'overview' && renderOverview()}
            {currentView === 'analytics' && renderAnalytics()}
            {currentView === 'classes' && renderClasses()}
            {currentView === 'assignments' && renderAssignments()}
            {currentView === 'vocabulary' && <TeacherVocabularyAnalyticsDashboard classId={selectedClass || undefined} />}
            {currentView === 'students' && renderStudents()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// =====================================================
// HELPER COMPONENTS
// =====================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: string;
  isLive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, subtitle, isLive }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-center space-x-2">
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {isLive && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 ml-1">Live</span>
            </div>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {trend !== undefined && trend !== 0 && (
          <div className={`flex items-center mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="flex-shrink-0">
        {icon}
      </div>
    </div>
  </div>
);

interface ClassOverviewCardProps {
  classData: ClassOverview;
}

const ClassOverviewCard: React.FC<ClassOverviewCardProps> = ({ classData }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-gray-800">{classData.name}</h3>
      <span className="text-xs text-gray-500">{classData.lastActivity}</span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-3">
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">{classData.studentCount}</p>
        <p className="text-xs text-gray-600">Students</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{classData.activeAssignments}</p>
        <p className="text-xs text-gray-600">Active</p>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Avg Score:</span>
        <span className="font-medium">{classData.averageScore}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Accuracy:</span>
        <span className="font-medium">{classData.averageAccuracy}%</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Engagement:</span>
        <span className="font-medium">{classData.engagementScore}%</span>
      </div>
    </div>

    <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center text-red-600">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span className="text-sm">{classData.strugglingStudents} struggling</span>
      </div>
      <div className="flex items-center text-green-600">
        <Star className="h-4 w-4 mr-1" />
        <span className="text-sm">{classData.topPerformers} top performers</span>
      </div>
    </div>
  </div>
);

interface ActivityItemProps {
  activity: RecentActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'assignment_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'achievement_earned':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'game_session':
        return <Gem className="h-5 w-5 text-blue-500" />;
      case 'new_student':
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{activity.studentName}</span> {activity.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{activity.timestamp}</p>
          {activity.score && (
            <span className="text-xs font-medium text-blue-600">Score: {activity.score}</span>
          )}
        </div>
      </div>
    </div>
  );
};

interface NotificationItemProps {
  notification: any;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityIcon = () => {
    switch (notification.priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getPriorityColor()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getPriorityIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
        </div>
      </div>
    </div>
  );
};
