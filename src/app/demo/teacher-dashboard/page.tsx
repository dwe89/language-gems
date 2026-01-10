'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, PenTool, BarChart2, Users, CheckCircle, Plus, MinusCircle,
  GraduationCap, Sparkles, ArrowRight, Target, Upload, Gamepad2, Trophy,
  Award, ClipboardCheck, X, Home, Settings, Swords, MessageSquare,
  TrendingUp, Activity, Filter, Search, Download, RefreshCw, Bell, ArrowLeft, AlertCircle
} from 'lucide-react';

import {
  DEMO_CLASSES,
  DEMO_CLASS_OVERVIEWS,
  DEMO_TEACHER_STATS,
  DEMO_TEACHER_NOTIFICATIONS,
  DEMO_STUDENTS,
  ALL_DEMO_STUDENTS,
} from '../../../lib/demo/demoData';
import { DemoProvider } from '../../../lib/demo/DemoContext';
import {
  DEMO_CLASS_SUMMARIES,
  DEMO_MULTI_CLASS_DATA,
  DEMO_VOCAB_ANALYTICS,
  DEMO_GRAMMAR_ANALYTICS
} from '../../../lib/demo/demoAnalyticsData';
import { DemoMultiClassOverview } from './components/DemoMultiClassOverview';
import { DemoClassSummaryDashboard } from './components/DemoClassSummaryDashboard';
import { DemoTeacherVocabularyAnalyticsDashboard } from './components/DemoTeacherVocabularyAnalyticsDashboard';
import { DemoTeacherGrammarAnalyticsDashboard } from './components/DemoTeacherGrammarAnalyticsDashboard';
import { DemoContentManager } from './components/DemoContentManager';
import { DemoAssessments } from './components/DemoAssessments';
import { DemoCompetitions } from './components/DemoCompetitions';

// =====================================================
// HELPER COMPONENTS (Adapted from Production)
// =====================================================

function StatCard({
  label,
  value,
  icon,
  iconBg,
  cardBg,
  borderColor,
  trend,
  trendColor
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  cardBg: string;
  borderColor: string;
  trend?: string;
  trendColor?: string;
}) {
  return (
    <div className={`relative p-6 rounded-3xl ${cardBg} backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 group`}>
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 box-border border-2 ${borderColor}`}></div>

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${iconBg} bg-gradient-to-br from-white/40 to-white/10 flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        <div>
          <div className="text-4xl font-bold text-slate-800 tracking-tight mb-2">{value}</div>
          <div className="text-slate-600 font-medium text-base">{label}</div>
          {trend && (
            <div className={`text-sm font-semibold mt-3 ${trendColor || 'text-emerald-500'} flex items-center`}>
              ↑ {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  subtitle,
  icon,
  cardBg,
  hoverBorder,
  hoverShadow,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  cardBg: string;
  hoverBorder: string;
  hoverShadow: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative ${cardBg} backdrop-blur-md rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 overflow-hidden flex flex-col items-center text-center ${hoverBorder} hover:border-transparent w-full`}
    >
      {/* Icon Container with Shadow Lift */}
      <div className={`relative z-10 w-24 h-24 rounded-3xl bg-white/80 shadow-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${hoverShadow}`}>
        {icon}
      </div>

      {/* Text Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-slate-900 text-2xl mb-2 group-hover:text-indigo-900 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-base leading-relaxed max-w-[240px] mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Bottom Indicator */}
      <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
        <div className="w-12 h-1 rounded-full bg-slate-400 group-hover:bg-indigo-400"></div>
      </div>
    </button>
  );
}

const NotificationItem: React.FC<{ notification: any }> = ({ notification }) => {
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-amber-500 bg-amber-50',
    low: 'border-l-blue-500 bg-blue-50',
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${priorityColors[notification.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
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
          <Trophy className="h-4 w-4 text-amber-500 mr-1" />
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
          <Sparkles className="h-4 w-4 text-orange-500 mr-1" />
          <span className="font-semibold">{student.streak}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trendColors[student.trend as keyof typeof trendColors] || trendColors.stable}`}>
          {student.trend.charAt(0).toUpperCase() + student.trend.slice(1)}
        </span>
      </td>
    </motion.tr>
  );
};


// =====================================================
// MAIN COMPONENT
// =====================================================

function DemoTeacherDashboardContent() {
  const [currentView, setCurrentView] = useState<'overview' | 'classes' | 'students' | 'analytics' | 'assignments' | 'content' | 'assessments' | 'competitions'>('overview');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Analytics State
  const [analyticsTab, setAnalyticsTab] = useState<'overview' | 'vocabulary' | 'grammar'>('overview');
  const [analyticsClassId, setAnalyticsClassId] = useState<string>('all');

  const filteredStudents = selectedClassId
    ? DEMO_STUDENTS[selectedClassId]
    : ALL_DEMO_STUDENTS;

  const searchedStudents = searchQuery
    ? filteredStudents.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : filteredStudents;

  // Render Methods

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <StatCard
          label="Total Classes"
          value={DEMO_TEACHER_STATS.totalClasses.toString()}
          icon={<BookOpen className="h-6 w-6 text-white" />}
          iconBg="bg-blue-500"
          cardBg="bg-blue-50/80"
          borderColor="border-blue-100"
          trend="12% from last month"
          trendColor="text-emerald-600"
        />
        <StatCard
          label="Active Students"
          value={DEMO_TEACHER_STATS.totalStudents.toString()}
          icon={<Users className="h-6 w-6 text-emerald-900" />}
          iconBg="bg-emerald-200"
          cardBg="bg-emerald-50/80"
          borderColor="border-emerald-100"
          trend="16% from last month"
          trendColor="text-emerald-600"
        />
        <StatCard
          label="Active Assignments"
          value={DEMO_TEACHER_STATS.activeAssignments.toString()}
          icon={<CheckCircle className="h-6 w-6 text-lime-900" />}
          iconBg="bg-lime-200"
          cardBg="bg-lime-50/80"
          borderColor="border-lime-100"
          trend="8% from last month"
          trendColor="text-emerald-600"
        />
        <StatCard
          label="Game Sessions"
          value={DEMO_TEACHER_STATS.totalGameSessions.toLocaleString()}
          icon={<Gamepad2 className="h-6 w-6 text-rose-900" />}
          iconBg="bg-rose-200"
          cardBg="bg-rose-50/80"
          borderColor="border-rose-100"
          trend="24% from last month"
          trendColor="text-emerald-600"
        />
        <StatCard
          label="Words Practiced"
          value={DEMO_TEACHER_STATS.totalWords.toLocaleString()}
          icon={<Award className="h-6 w-6 text-amber-900" />}
          iconBg="bg-amber-200"
          cardBg="bg-amber-50/80"
          borderColor="border-amber-100"
          trend="19% from last month"
          trendColor="text-emerald-600"
        />
      </section>

      {/* Main Dashboard Actions Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
        <DashboardCard
          title="Manage Classes"
          subtitle="Organize your classroom & students"
          icon={<BookOpen className="h-10 w-10 text-blue-600" />}
          cardBg="bg-blue-50/80"
          hoverBorder="group-hover:border-blue-200"
          hoverShadow="group-hover:shadow-blue-500/10"
          onClick={() => setCurrentView('classes')}
        />
        <DashboardCard
          title="Track Assignments"
          subtitle="Monitor progress & set objectives"
          icon={<PenTool className="h-10 w-10 text-emerald-600" />}
          cardBg="bg-emerald-50/80"
          hoverBorder="group-hover:border-emerald-200"
          hoverShadow="group-hover:shadow-emerald-500/10"
          onClick={() => setCurrentView('assignments')}
        />
        <DashboardCard
          title="Advanced Analytics"
          subtitle="Deep dive into student performance"
          icon={<BarChart2 className="h-10 w-10 text-purple-600" />}
          cardBg="bg-purple-50/80"
          hoverBorder="group-hover:border-purple-200"
          hoverShadow="group-hover:shadow-purple-500/10"
          onClick={() => setCurrentView('analytics')}
        />
        <DashboardCard
          title="Content Manager"
          subtitle="Build custom vocabulary & sentences"
          icon={<Upload className="h-10 w-10 text-amber-600" />}
          cardBg="bg-amber-50/80"
          hoverBorder="group-hover:border-amber-200"
          hoverShadow="group-hover:shadow-amber-500/10"
          onClick={() => setCurrentView('content')}
        />
        <DashboardCard
          title="Tests & Quizzes"
          subtitle="Create assessments & grading"
          icon={<ClipboardCheck className="h-10 w-10 text-rose-600" />}
          cardBg="bg-rose-50/80"
          hoverBorder="group-hover:border-rose-200"
          hoverShadow="group-hover:shadow-rose-500/10"
          onClick={() => setCurrentView('assessments')}
        />
        <DashboardCard
          title="Competitions"
          subtitle="Badges, leaderboards & challenges"
          icon={<Trophy className="h-10 w-10 text-indigo-600" />}
          cardBg="bg-indigo-50/80"
          hoverBorder="group-hover:border-indigo-200"
          hoverShadow="group-hover:shadow-indigo-500/10"
          onClick={() => setCurrentView('competitions')}
        />
      </section>

      {/* Notifications Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-600" />
          Recent Notifications
        </h2>
        <div className="space-y-3">
          {DEMO_TEACHER_NOTIFICATIONS.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </section>
    </>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('overview')}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      {/* Header: Title and Class Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Hub</h2>
          <p className="text-gray-500">Monitor class performance and student progress</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={analyticsClassId}
            onChange={(e) => setAnalyticsClassId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          >
            <option value="all">All Classes</option>
            {DEMO_CLASSES.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg px-4 pt-2">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'vocabulary', 'grammar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setAnalyticsTab(tab as any)}
              className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${analyticsTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${analyticsTab}-${analyticsClassId}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {analyticsTab === 'overview' && (
              analyticsClassId === 'all' ? (
                <DemoMultiClassOverview
                  viewScope="my"
                  onClassClick={(id) => setAnalyticsClassId(id)}
                  demoData={DEMO_MULTI_CLASS_DATA}
                />
              ) : (
                <DemoClassSummaryDashboard
                  classId={analyticsClassId}
                  viewScope="my"
                  demoData={DEMO_CLASS_SUMMARIES[analyticsClassId]}
                />
              )
            )}
            {analyticsTab === 'vocabulary' && (
              <DemoTeacherVocabularyAnalyticsDashboard
                classId={analyticsClassId === 'all' ? undefined : analyticsClassId}
                vocabularySource="all"
                // For 'all', we use the first class's data as a placeholder in this demo since we don't have aggregate demo data generator yet
                demoData={DEMO_VOCAB_ANALYTICS[analyticsClassId === 'all' ? DEMO_CLASSES[0].id : analyticsClassId]}
              />
            )}
            {analyticsTab === 'grammar' && (
              <DemoTeacherGrammarAnalyticsDashboard
                classId={analyticsClassId === 'all' ? undefined : analyticsClassId}
                // For 'all', we use the first class's data as a placeholder
                demoData={DEMO_GRAMMAR_ANALYTICS[analyticsClassId === 'all' ? DEMO_CLASSES[0].id : analyticsClassId]}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('overview')}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchedStudents.map((student, index) => (
                <StudentTableRow key={student.id} student={student} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('overview')}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_CLASSES.map((classData) => {
          const overview = DEMO_CLASS_OVERVIEWS.find(o => o.id === classData.id);
          if (!overview) return null;

          return (
            <motion.div
              key={classData.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="p-6" style={{ backgroundColor: overview.color + '20' }}>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{overview.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{overview.name}</h3>
                    <p className="text-sm text-gray-600">{overview.studentCount} students</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{overview.averageScore}</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{overview.averageAccuracy}%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{overview.engagementScore}%</p>
                    <p className="text-xs text-gray-500">Engagement</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{overview.strugglingStudents} need help</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{overview.topPerformers} stars</span>
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
          )
        })}
      </div>
    </div>
  );

  const renderContentManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('overview')}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      <DemoContentManager />
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('overview')}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      <DemoAssessments />
    </div>
  );

  const renderCompetitions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('overview')}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      <DemoCompetitions />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F5F9] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 text-center text-sm rounded-lg shadow-md mb-6">
          <span className="font-semibold">🎭 Demo Mode</span> - You're viewing the Teacher Dashboard with sample data.{' '}
          <Link href="/demo" className="underline hover:no-underline">
            Back to Demo Home
          </Link>
        </div>

        {/* Top Navigation Bar */}
        <nav className="flex items-center justify-end space-x-8 mb-8 text-slate-500 font-medium text-sm">
          <button onClick={() => setCurrentView('overview')} className="flex items-center hover:text-indigo-600 transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Home
          </button>
          <button onClick={() => setCurrentView('competitions')} className="flex items-center hover:text-indigo-600 transition-colors">
            <Swords className="w-4 h-4 mr-2" />
            Competitions
          </button>
          <button onClick={() => alert("Settings not available in demo")} className="flex items-center hover:text-indigo-600 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </nav>

        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Welcome back, Sarah!
              </h1>
            </div>
            <p className="text-slate-500 text-lg">
              Reimagined with the LanguageGems dashboard
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-200 shadow-sm flex items-center">
            <span className="text-slate-500 font-medium mr-2">School Code:</span>
            <span className="text-slate-900 font-bold">SCH-DEMO-01</span>
          </div>
        </header>

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
            {currentView === 'content' && renderContentManager()}
            {currentView === 'assessments' && renderAssessments()}
            {currentView === 'competitions' && renderCompetitions()}
            {currentView === 'assignments' && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-700">Assignments View Placeholder</h2>
                <p className="text-gray-500">The Assignments dashboard demo is under construction.</p>
                <button
                  onClick={() => setCurrentView('overview')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back Home
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating Action Button for Help/Beta */}
        <div className="fixed bottom-8 right-8 z-50 flex gap-4">
          <button
            onClick={() => window.open('https://forms.gle/xyz', '_blank')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <MessageSquare className="w-5 h-5" />
            Beta Feedback
          </button>
        </div>
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
