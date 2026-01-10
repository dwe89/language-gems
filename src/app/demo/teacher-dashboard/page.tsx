'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Users, BookOpen, Trophy, TrendingUp, Clock, Target,
  Plus, Filter, Search, Download, RefreshCw, Settings,
  BarChart3, PieChart, Activity, Calendar, Bell,
  Star, Award, Zap, Heart, Brain, Gem, Eye,
  ChevronRight, ChevronDown, AlertCircle, CheckCircle,
  ArrowLeft, Gamepad2, GraduationCap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  DEMO_CLASSES,
  DEMO_CLASS_OVERVIEWS,
  DEMO_TEACHER_STATS,
  DEMO_TEACHER_NOTIFICATIONS,
  DEMO_STUDENTS,
  DEMO_ASSIGNMENTS,
  DEMO_RECENT_ACTIVITY,
  ALL_DEMO_STUDENTS,
  getDemoTeacherDashboardData,
} from '../../../lib/demo/demoData';
import { DemoProvider } from '../../../lib/demo/DemoContext';

// =====================================================
// HELPER COMPONENTS
// =====================================================

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: string;
  isLive?: boolean;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, subtitle, isLive, color = 'blue' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-center space-x-2">
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
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
            <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">{Math.abs(trend)}% this week</span>
          </div>
        )}
      </div>
      <div className={`p-4 bg-${color}-100 rounded-xl`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const ClassOverviewCard: React.FC<{ classData: typeof DEMO_CLASS_OVERVIEWS[0] }> = ({ classData }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-md p-5 border-l-4 hover:shadow-lg transition-all cursor-pointer"
    style={{ borderLeftColor: classData.color }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{classData.icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{classData.name}</h3>
          <p className="text-sm text-gray-500">{classData.studentCount} students</p>
        </div>
      </div>
      <span className="text-sm text-gray-400">{classData.lastActivity}</span>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{classData.averageScore}</p>
        <p className="text-xs text-gray-500">Avg Score</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{classData.averageAccuracy}%</p>
        <p className="text-xs text-gray-500">Accuracy</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{classData.engagementScore}%</p>
        <p className="text-xs text-gray-500">Engagement</p>
      </div>
    </div>

    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center text-amber-600">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>{classData.strugglingStudents} need help</span>
      </div>
      <div className="flex items-center text-green-600">
        <Star className="h-4 w-4 mr-1" />
        <span>{classData.topPerformers} top performers</span>
      </div>
    </div>
  </motion.div>
);

const ActivityItem: React.FC<{ activity: any }> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'assignment_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'achievement_earned':
        return <Award className="h-5 w-5 text-amber-500" />;
      case 'game_session':
        return <Gamepad2 className="h-5 w-5 text-purple-500" />;
      case 'assessment_completed':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 mt-1">{getActivityIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.studentName}</p>
        <p className="text-sm text-gray-600 truncate">{activity.description}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{activity.timestamp}</p>
        {activity.score && (
          <p className="text-sm font-semibold text-green-600">{activity.score} pts</p>
        )}
      </div>
    </div>
  );
};

const NotificationItem: React.FC<{ notification: any }> = ({ notification }) => {
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-amber-500 bg-amber-50',
    low: 'border-l-blue-500 bg-blue-50',
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${priorityColors[notification.priority as keyof typeof priorityColors]}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
        <span className="text-xs text-gray-500">{notification.timestamp}</span>
      </div>
    </div>
  );
};

const StudentTableRow: React.FC<{ student: any; index: number }> = ({ student, index }) => {
  const trendColors = {
    improving: 'text-green-600 bg-green-100',
    stable: 'text-blue-600 bg-blue-100',
    declining: 'text-red-600 bg-red-100',
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {student.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-lg font-bold text-gray-900">{student.level}</span>
          <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${(student.xp % 1000) / 10}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Gem className="h-4 w-4 text-amber-500 mr-1" />
          <span className="font-semibold">{student.totalGems}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className={`font-semibold ${student.accuracy >= 70 ? 'text-green-600' : student.accuracy >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
            {student.accuracy}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Zap className="h-4 w-4 text-orange-500 mr-1" />
          <span className="font-semibold">{student.streak}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trendColors[student.trend as keyof typeof trendColors] || trendColors.stable}`}>
          {student.trend.charAt(0).toUpperCase() + student.trend.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Details
        </button>
      </td>
    </motion.tr>
  );
};

// =====================================================
// CHART DATA
// =====================================================

const getPerformanceData = () => [
  { name: 'Mon', sessions: 45, accuracy: 72, score: 850 },
  { name: 'Tue', sessions: 52, accuracy: 75, score: 890 },
  { name: 'Wed', sessions: 38, accuracy: 68, score: 780 },
  { name: 'Thu', sessions: 61, accuracy: 79, score: 920 },
  { name: 'Fri', sessions: 55, accuracy: 81, score: 910 },
  { name: 'Sat', sessions: 28, accuracy: 76, score: 850 },
  { name: 'Sun', sessions: 32, accuracy: 74, score: 820 },
];

const getGameTypeData = () => [
  { name: 'Vocab Master', value: 35, color: '#8b5cf6' },
  { name: 'Memory Game', value: 25, color: '#3b82f6' },
  { name: 'Word Scramble', value: 15, color: '#10b981' },
  { name: 'Speed Builder', value: 12, color: '#f59e0b' },
  { name: 'Others', value: 13, color: '#6b7280' },
];

const getLanguageDistribution = () => [
  { language: 'French', students: 28, accuracy: 78, gems: 2340 },
  { language: 'Spanish', students: 24, accuracy: 82, gems: 2180 },
  { language: 'German', students: 22, accuracy: 75, gems: 1920 },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

function DemoTeacherDashboardContent() {
  const [currentView, setCurrentView] = useState<'overview' | 'classes' | 'students' | 'analytics' | 'assignments'>('overview');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const teacherData = getDemoTeacherDashboardData();
  const performanceData = getPerformanceData();
  const gameTypeData = getGameTypeData();
  const languageDistribution = getLanguageDistribution();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredStudents = selectedClassId
    ? DEMO_STUDENTS[selectedClassId]
    : ALL_DEMO_STUDENTS;

  const searchedStudents = searchQuery
    ? filteredStudents.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredStudents;

  // =====================================================
  // RENDER METHODS
  // =====================================================

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={DEMO_TEACHER_STATS.totalStudents}
          icon={<Users className="h-8 w-8 text-blue-500" />}
          trend={5.2}
          subtitle="Active learners"
        />
        <StatCard
          title="Active Assignments"
          value={DEMO_TEACHER_STATS.activeAssignments}
          icon={<BookOpen className="h-8 w-8 text-green-500" />}
          trend={2}
          subtitle="In progress"
        />
        <StatCard
          title="Average Score"
          value={DEMO_TEACHER_STATS.averageClassScore}
          icon={<Trophy className="h-8 w-8 text-amber-500" />}
          trend={12.3}
          subtitle="Class performance"
        />
        <StatCard
          title="Students Online"
          value={DEMO_TEACHER_STATS.studentsOnline}
          icon={<Activity className="h-8 w-8 text-purple-500" />}
          subtitle="Currently active"
          isLive
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'create', title: 'Create Assignment', description: 'Create a new game-based assignment', icon: Plus, color: 'bg-blue-500' },
            { id: 'analytics', title: 'View Analytics', description: 'See detailed class performance', icon: BarChart3, color: 'bg-green-500' },
            { id: 'classes', title: 'Manage Classes', description: 'View and manage your classes', icon: Users, color: 'bg-purple-500' },
            { id: 'reports', title: 'Export Reports', description: 'Download progress reports', icon: Download, color: 'bg-amber-500' },
          ].map((action) => (
            <motion.button
              key={action.id}
              onClick={() => action.id === 'analytics' ? setCurrentView('analytics') : action.id === 'classes' ? setCurrentView('classes') : null}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-left hover:shadow-md"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                <action.icon className="h-6 w-6" />
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
            {DEMO_CLASS_OVERVIEWS.map((classData) => (
              <ClassOverviewCard key={classData.id} classData={classData} />
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
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {teacherData.recentActivity.slice(0, 10).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
        <div className="space-y-3">
          {DEMO_TEACHER_NOTIFICATIONS.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Weekly Performance</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="sessions" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSessions)" name="Sessions" />
              <Area type="monotone" dataKey="accuracy" stroke="#10b981" fillOpacity={1} fill="url(#colorAccuracy)" name="Accuracy %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Type Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Game Type Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={gameTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gameTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {gameTypeData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Language Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="language" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#8b5cf6" name="Accuracy %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Gamepad2 className="h-10 w-10 opacity-80" />
            <span className="text-3xl font-bold">{DEMO_TEACHER_STATS.totalGameSessions.toLocaleString()}</span>
          </div>
          <h3 className="font-semibold text-lg">Total Game Sessions</h3>
          <p className="text-sm opacity-80">Across all classes this month</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-10 w-10 opacity-80" />
            <span className="text-3xl font-bold">{DEMO_TEACHER_STATS.averageAccuracy}%</span>
          </div>
          <h3 className="font-semibold text-lg">Overall Accuracy</h3>
          <p className="text-sm opacity-80">Average across all students</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-10 w-10 opacity-80" />
            <span className="text-3xl font-bold">+{DEMO_TEACHER_STATS.improvementRate}%</span>
          </div>
          <h3 className="font-semibold text-lg">Improvement Rate</h3>
          <p className="text-sm opacity-80">Week-over-week growth</p>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            <select
              value={selectedClassId || ''}
              onChange={(e) => setSelectedClassId(e.target.value || null)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {DEMO_CLASSES.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.icon} {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {searchedStudents.length} students
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gems</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchedStudents.slice(0, 15).map((student, index) => (
                <StudentTableRow key={student.id} student={student} index={index} />
              ))}
            </tbody>
          </table>
        </div>
        {searchedStudents.length > 15 && (
          <div className="px-6 py-4 bg-gray-50 border-t text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View all {searchedStudents.length} students
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_CLASS_OVERVIEWS.map((classData) => (
          <motion.div
            key={classData.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="p-6" style={{ backgroundColor: classData.color + '20' }}>
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{classData.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{classData.name}</h3>
                  <p className="text-sm text-gray-600">{classData.studentCount} students</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{classData.averageScore}</p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{classData.averageAccuracy}%</p>
                  <p className="text-xs text-gray-500">Accuracy</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{classData.activeAssignments}</p>
                  <p className="text-xs text-gray-500">Active Tasks</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{classData.engagementScore}%</p>
                  <p className="text-xs text-gray-500">Engagement</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{classData.strugglingStudents} need help</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Star className="h-4 w-4 mr-1" />
                  <span>{classData.topPerformers} stars</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedClassId(classData.id);
                  setCurrentView('students');
                }}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                View Students
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 text-center text-sm">
        <span className="font-semibold">🎭 Demo Mode</span> - You're viewing the Teacher Dashboard with sample data.{' '}
        <Link href="/demo" className="underline hover:no-underline">
          Back to Demo Home
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/demo" className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                  <p className="text-sm text-gray-500">Mrs. Sarah Mitchell</p>
                </div>
              </div>
              {refreshing && (
                <div className="flex items-center text-blue-600 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'classes', label: 'Classes', icon: BookOpen },
                  { id: 'students', label: 'Students', icon: Users },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
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
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {DEMO_TEACHER_NOTIFICATIONS.length}
                </span>
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
            {currentView === 'students' && renderStudents()}
            {currentView === 'classes' && renderClasses()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// =====================================================
// MAIN EXPORT
// =====================================================

export default function DemoTeacherDashboard() {
  return (
    <DemoProvider initialMode="teacher">
      <DemoTeacherDashboardContent />
    </DemoProvider>
  );
}
