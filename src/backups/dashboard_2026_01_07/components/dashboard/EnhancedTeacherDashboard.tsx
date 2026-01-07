'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, Trophy, TrendingUp, Clock, Target,
  Plus, Filter, Search, Download, RefreshCw, Settings,
  BarChart3, PieChart, Activity, Calendar, Bell,
  Star, Award, Zap, Heart, Brain, Gem, Eye,
  ChevronRight, ChevronDown, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { EnhancedGameService } from '../../services/enhancedGameService';
import { EnhancedAssignmentService, ClassPerformanceMetrics } from '../../services/enhancedAssignmentService';
import { GemsAnalyticsService } from '../../services/analytics/GemsAnalyticsService';
import TeacherVocabularyAnalyticsDashboard from '../teacher/TeacherVocabularyAnalyticsDashboard';
import EnhancedAnalyticsDashboard from '../analytics/EnhancedAnalyticsDashboard';

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
      
      const [stats, classes, activities, notifs] = await Promise.all([
        loadDashboardStats(),
        loadClassOverviews(),
        loadRecentActivities(),
        loadNotifications()
      ]);

      setDashboardStats(stats);
      setClassOverviews(classes);
      setRecentActivities(activities);
      setNotifications(notifs);
      
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={dashboardStats?.totalStudents || 0}
          icon={<Users className="h-8 w-8 text-blue-500" />}
          trend={+5.2}
          subtitle="Active learners"
        />
        <StatCard
          title="Active Assignments"
          value={dashboardStats?.activeAssignments || 0}
          icon={<BookOpen className="h-8 w-8 text-green-500" />}
          trend={+2}
          subtitle="In progress"
        />
        <StatCard
          title="Average Score"
          value={dashboardStats?.averageClassScore || 0}
          icon={<Trophy className="h-8 w-8 text-yellow-500" />}
          trend={+12.3}
          subtitle="Class performance"
        />
        <StatCard
          title="Students Online"
          value={dashboardStats?.studentsOnline || 0}
          icon={<Activity className="h-8 w-8 text-purple-500" />}
          trend={0}
          subtitle="Currently active"
          isLive
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              onClick={action.action}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-left"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-3`}>
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
        <div className="bg-white rounded-xl shadow-lg p-6">
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Teacher Dashboard</h1>
              {refreshing && (
                <div className="flex items-center text-blue-600 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation */}
              <nav className="flex space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
                  { id: 'classes', label: 'Classes', icon: <Users className="h-4 w-4" /> },
                  { id: 'assignments', label: 'Assignments', icon: <BookOpen className="h-4 w-4" /> },
                  { id: 'vocabulary', label: 'Vocabulary', icon: <Brain className="h-4 w-4" /> },
                  { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
                  { id: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
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
            {currentView === 'classes' && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Classes View</h3>
                <p className="text-gray-600">Detailed class management interface coming soon...</p>
              </div>
            )}
            {currentView === 'assignments' && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Assignments View</h3>
                <p className="text-gray-600">Enhanced assignment management interface coming soon...</p>
              </div>
            )}
            {currentView === 'vocabulary' && <TeacherVocabularyAnalyticsDashboard classId={selectedClass || undefined} />}
            {currentView === 'students' && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Students View</h3>
                <p className="text-gray-600">Individual student progress tracking coming soon...</p>
              </div>
            )}
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
