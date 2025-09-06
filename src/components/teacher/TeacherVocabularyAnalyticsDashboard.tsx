'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Brain, Target, Clock, Award, BarChart3, PieChart, Activity,
  RefreshCw, Filter, Download, Eye, ChevronRight, ChevronDown,
  Star, Zap, Heart, Gem, Calendar, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { 
  TeacherVocabularyAnalyticsService, 
  TeacherVocabularyAnalytics,
  StudentVocabularyProgress,
  TopicAnalysis
} from '../../services/teacherVocabularyAnalytics';

interface TeacherVocabularyAnalyticsDashboardProps {
  classId?: string;
  dateRange?: { from: string; to: string };
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  subtitle, 
  color = 'blue' 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        {icon}
      </div>
    </div>
    {trend !== undefined && (
      <div className="mt-4 flex items-center">
        {trend > 0 ? (
          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(trend)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    )}
  </motion.div>
);

export default function TeacherVocabularyAnalyticsDashboard({
  classId,
  dateRange
}: TeacherVocabularyAnalyticsDashboardProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [analyticsService] = useState(() => new TeacherVocabularyAnalyticsService(supabase));
  const [analytics, setAnalytics] = useState<TeacherVocabularyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'topics' | 'trends'>('overview');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Load analytics data
  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, classId, dateRange]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setError(null);
      console.log('🔄 [TEACHER VOCAB DASHBOARD] Loading analytics...');
      
      const data = await analyticsService.getTeacherVocabularyAnalytics(
        user.id,
        classId,
        dateRange
      );
      
      setAnalytics(data);
      console.log('📊 [TEACHER VOCAB DASHBOARD] Analytics loaded:', data);
      
    } catch (err) {
      console.error('❌ [TEACHER VOCAB DASHBOARD] Error loading analytics:', err);
      setError('Failed to load vocabulary analytics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
  };

  const toggleTopicExpansion = (topicKey: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicKey)) {
      newExpanded.delete(topicKey);
    } else {
      newExpanded.add(topicKey);
    }
    setExpandedTopics(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">No vocabulary data found for your classes.</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={analytics.classStats.totalStudents}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          subtitle="Across all classes"
          color="blue"
        />
        <StatCard
          title="Total Words Tracked"
          value={analytics.classStats.totalWords}
          icon={<BookOpen className="h-6 w-6 text-green-600" />}
          subtitle="Class-wide vocabulary"
          color="green"
        />
        <StatCard
          title="Average Mastered"
          value={analytics.classStats.averageMasteredWords}
          icon={<Award className="h-6 w-6 text-yellow-600" />}
          subtitle="Words per student"
          color="yellow"
        />
        <StatCard
          title="Class Accuracy"
          value={`${analytics.classStats.averageAccuracy}%`}
          icon={<Target className="h-6 w-6 text-purple-600" />}
          subtitle="Average performance"
          color="purple"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Memory Strength"
          value={`${analytics.classStats.classAverageMemoryStrength}%`}
          icon={<Brain className="h-6 w-6 text-indigo-600" />}
          subtitle="FSRS-based retention"
          color="indigo"
        />
        <StatCard
          title="Words Due for Review"
          value={analytics.classStats.totalWordsReadyForReview}
          icon={<Clock className="h-6 w-6 text-orange-600" />}
          subtitle="Across all students"
          color="orange"
        />
        <StatCard
          title="Students with Overdue"
          value={analytics.classStats.studentsWithOverdueWords}
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          subtitle="Need attention"
          color="red"
        />
      </div>

      {/* Insights Section */}
      {analytics.insights.classRecommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Class Insights & Recommendations
          </h3>
          <div className="space-y-2">
            {analytics.insights.classRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top and Struggling Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {analytics.classStats.topPerformingStudents.slice(0, 5).map((student, index) => (
              <div key={student.studentId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-green-700">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.studentName}</p>
                    <p className="text-sm text-gray-600">{student.className}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-700">{student.averageAccuracy}%</p>
                  <p className="text-sm text-gray-600">{student.masteredWords} mastered</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Needing Support */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            Students Needing Support
          </h3>
          <div className="space-y-3">
            {analytics.insights.studentsNeedingAttention.slice(0, 5).map((student, index) => (
              <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.studentName}</p>
                    <p className="text-sm text-gray-600">{student.className}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-700">{student.averageAccuracy}%</p>
                  <p className="text-sm text-gray-600">{student.overdueWords} overdue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
          <p className="text-sm text-gray-600 mt-1">Individual vocabulary progress</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Words
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mastered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Memory Strength
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overdue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.studentProgress.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{student.className}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.totalWords}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.masteredWords}</div>
                    <div className="text-xs text-gray-500">
                      {student.totalWords > 0 ? Math.round((student.masteredWords / student.totalWords) * 100) : 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      student.averageAccuracy >= 80 ? 'text-green-600' :
                      student.averageAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {student.averageAccuracy}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.memoryStrength}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.overdueWords > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {student.overdueWords}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTopicsView = () => (
    <div className="space-y-6">
      {/* Weak Topics */}
      {analytics.insights.weakestTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
            Topics Needing Attention
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.insights.weakestTopics.map((topic, index) => (
              <div key={`${topic.category}-${topic.subcategory}-${index}`} className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{topic.category}</h4>
                  <span className="text-sm font-semibold text-red-600">{topic.averageAccuracy}%</span>
                </div>
                {topic.subcategory && (
                  <p className="text-sm text-gray-600 mb-1">{topic.subcategory}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{topic.studentsEngaged}/{topic.totalStudents} students</span>
                  <span>{topic.totalWords} words</span>
                </div>
                <p className="text-xs text-red-700 mt-2">{topic.recommendedAction}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong Topics */}
      {analytics.insights.strongestTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            Strong Performance Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.insights.strongestTopics.map((topic, index) => (
              <div key={`${topic.category}-${topic.subcategory}-${index}`} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{topic.category}</h4>
                  <span className="text-sm font-semibold text-green-600">{topic.averageAccuracy}%</span>
                </div>
                {topic.subcategory && (
                  <p className="text-sm text-gray-600 mb-1">{topic.subcategory}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{topic.studentsEngaged}/{topic.totalStudents} students</span>
                  <span>{topic.totalWords} words</span>
                </div>
                <p className="text-xs text-green-700 mt-2">{topic.recommendedAction}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Topics</h3>
        <div className="space-y-3">
          {analytics.topicAnalysis.map((topic, index) => (
            <div key={`${topic.category}-${topic.subcategory}-${index}`} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{topic.category}</h4>
                  {topic.subcategory && (
                    <p className="text-sm text-gray-600">{topic.subcategory}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{topic.language.toUpperCase()}</span>
                    <span>{topic.curriculumLevel}</span>
                    <span>{topic.studentsEngaged}/{topic.totalStudents} students</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    topic.averageAccuracy >= 80 ? 'text-green-600' :
                    topic.averageAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {topic.averageAccuracy}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {topic.masteredWords}/{topic.totalWords} mastered
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrendsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 text-blue-500 mr-2" />
          Vocabulary Learning Trends
        </h3>
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Trends Visualization</h4>
          <p className="text-gray-600">Interactive charts showing vocabulary progress over time will be available soon.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vocabulary Analytics</h1>
          <p className="text-gray-600 mt-1">
            Class-wide vocabulary progress and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> },
            { id: 'topics', label: 'Topics', icon: <BookOpen className="h-4 w-4" /> },
            { id: 'trends', label: 'Trends', icon: <TrendingUp className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${selectedView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {selectedView === 'overview' && renderOverview()}
          {selectedView === 'students' && renderStudentsView()}
          {selectedView === 'topics' && renderTopicsView()}
          {selectedView === 'trends' && renderTrendsView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
