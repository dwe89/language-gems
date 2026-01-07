'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Brain, Target, Clock, Award, BarChart3, PieChart, Activity,
  RefreshCw, Filter, Download, Eye, ChevronRight, ChevronDown,
  Star, Zap, Heart, Gem, Calendar, ArrowUp, ArrowDown, FileText
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import type {
  TeacherVocabularyAnalytics,
  StudentVocabularyProgress,
  TopicAnalysis
} from '../../services/teacherVocabularyAnalytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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

  const [analytics, setAnalytics] = useState<TeacherVocabularyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'topics' | 'trends' | 'words'>('overview');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  
  // Class selector state
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classId || null);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Utility function to format category/subcategory names
  const formatTopicName = (name: string | null | undefined): string => {
    if (!name) return '';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' & ');
  };

  // Load teacher's classes
  useEffect(() => {
    if (user && supabase) {
      loadTeacherClasses();
    }
  }, [user, supabase]);

  const loadTeacherClasses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user.id)
        .order('name');

      if (error) throw error;

      const classes = data || [];
      setAvailableClasses([
        { id: 'all', name: 'All Classes' },
        ...classes
      ]);
      setLoadingClasses(false);
    } catch (err) {
      console.error('Error loading classes:', err);
      setLoadingClasses(false);
    }
  };

  // Load analytics data
  useEffect(() => {
    if (user && !loadingClasses) {
      loadAnalytics();
    }
  }, [user, selectedClassId, dateRange, loadingClasses]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [TEACHER VOCAB DASHBOARD] Loading analytics...');
      
      const params = new URLSearchParams({ teacherId: user.id });

      if (selectedClassId && selectedClassId !== 'all') {
        params.set('classId', selectedClassId);
      }

      if (dateRange?.from && dateRange?.to) {
        params.set('from', dateRange.from);
        params.set('to', dateRange.to);
      }

      const response = await fetch(`/api/dashboard/vocabulary/analytics?${params.toString()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Failed to fetch analytics (status ${response.status})`);
      }

      const body = await response.json();
      const data: TeacherVocabularyAnalytics | null = body?.analytics ?? null;

      if (!data) {
        throw new Error('Analytics payload missing');
      }

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

  const toggleStudentExpansion = (studentId: string) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedStudents(newExpanded);
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
          title="Proficient Words"
          value={analytics.classStats.proficientWords}
          icon={<Award className="h-6 w-6 text-yellow-600" />}
          subtitle="Class total"
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
          title="Learning Words"
          value={analytics.classStats.learningWords}
          icon={<Brain className="h-6 w-6 text-indigo-600" />}
          subtitle="In progress"
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
                  <p className="text-sm text-gray-600">{student.proficientWords} proficient</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Needing Support - Active students with low performance */}
        {(() => {
          const activeStudentsNeedingSupport = analytics.insights.studentsNeedingAttention
            .filter(s => s.totalWords > 0); // Only students who have attempted vocabulary
          const inactiveStudents = analytics.studentProgress
            .filter(s => s.totalWords === 0 && !s.lastActivity); // 🔥 CRITICAL: Students with no vocabulary AND no other activity

          return (
            <>
              {activeStudentsNeedingSupport.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    Students Needing Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Active students with low accuracy or many overdue words</p>
                  <div className="space-y-3">
                    {activeStudentsNeedingSupport.slice(0, 5).map((student, index) => (
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
              )}

              {/* Students Who Haven't Logged In */}
              {inactiveStudents.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                    Students Not Yet Active
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">These students have not attempted any vocabulary yet</p>
                  <div className="space-y-3">
                    {inactiveStudents.slice(0, 5).map((student) => (
                      <div key={student.studentId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.studentName}</p>
                            <p className="text-sm text-gray-600">{student.className}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-orange-700">No activity</p>
                          <p className="text-xs text-gray-500">Never logged in</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );

  const renderStudentsView = () => {
    const getStudentWordDetails = (studentId: string) => {
      return analytics.studentWordDetails?.find(s => s.studentId === studentId);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
            <p className="text-sm text-gray-600 mt-1">Individual vocabulary progress - click to see strong/weak words</p>
          </div>
          <div className="divide-y divide-gray-200">
            {analytics.studentProgress.map((student) => {
              const isExpanded = expandedStudents.has(student.studentId);
              const wordDetails = getStudentWordDetails(student.studentId);
              
              return (
                <div key={student.studentId} className="bg-white">
                  <button
                    onClick={() => toggleStudentExpansion(student.studentId)}
                    className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1 grid grid-cols-7 gap-4 items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                            <div className="text-xs text-gray-500">{student.className}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{student.totalWords}</div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-green-600">{student.proficientWords}</div>
                            <div className="text-xs text-gray-500">Proficient</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-yellow-600">{student.learningWords}</div>
                            <div className="text-xs text-gray-500">Learning</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-red-600">{student.strugglingWords}</div>
                            <div className="text-xs text-gray-500">Struggling</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-sm font-medium ${
                              student.averageAccuracy >= 80 ? 'text-green-600' :
                              student.averageAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {student.averageAccuracy}%
                            </div>
                            <div className="text-xs text-gray-500">Accuracy</div>
                          </div>
                          <div className="text-center">
                            {student.overdueWords > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {student.overdueWords} overdue
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">None</span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Never'}
                            </div>
                            <div className="text-xs text-gray-500">Last active</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && wordDetails && (
                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Strong Words */}
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Strong Words ({wordDetails.strongWords.length})
                          </h4>
                          {wordDetails.strongWords.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {wordDetails.strongWords.map((word, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-green-50 rounded px-3 py-2">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{word.word}</div>
                                    <div className="text-xs text-gray-600">{word.translation}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-semibold text-green-600">{word.accuracy.toFixed(0)}%</div>
                                    <div className="text-xs text-gray-500">
                                      {word.proficiencyLevel === 'proficient' ? '🟢 Proficient' :
                                       word.proficiencyLevel === 'learning' ? '🟡 Learning' : '🔴 Struggling'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No strong words yet</p>
                          )}
                        </div>

                        {/* Weak Words */}
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Weak Words ({wordDetails.weakWords.length})
                          </h4>
                          {wordDetails.weakWords.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {wordDetails.weakWords.map((word, idx) => (
                                <div key={idx} className="bg-red-50 rounded px-3 py-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">{word.word}</div>
                                      <div className="text-xs text-gray-600">{word.translation}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-semibold text-red-600">{word.accuracy.toFixed(0)}%</div>
                                      <div className="text-xs text-gray-500">{word.totalEncounters} attempts</div>
                                    </div>
                                  </div>
                                  {word.errorPattern && (
                                    <div className={`text-xs font-medium ${
                                      word.errorPattern === 'Frequent mistakes' ? 'text-red-600' :
                                      word.errorPattern === 'Moderate difficulty' ? 'text-orange-600' :
                                      'text-yellow-600'
                                    }`}>
                                      ⚠️ {word.errorPattern}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No weak words identified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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
                  <h4 className="font-medium text-gray-900">{formatTopicName(topic.category)}</h4>
                  <span className="text-sm font-semibold text-red-600">{topic.averageAccuracy}%</span>
                </div>
                {topic.subcategory && (
                  <p className="text-sm text-gray-600 mb-1">{formatTopicName(topic.subcategory)}</p>
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
                  <h4 className="font-medium text-gray-900">{formatTopicName(topic.category)}</h4>
                  <span className="text-sm font-semibold text-green-600">{topic.averageAccuracy}%</span>
                </div>
                {topic.subcategory && (
                  <p className="text-sm text-gray-600 mb-1">{formatTopicName(topic.subcategory)}</p>
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

      {/* All Topics - Only show topics with meaningful engagement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Topics</h3>
        <p className="text-sm text-gray-600 mb-4">
          Showing topics where at least 3 students have attempted vocabulary
        </p>
        <div className="space-y-3">
          {analytics.topicAnalysis
            .filter(topic => topic.studentsEngaged >= 3) // Only show topics with meaningful engagement
            .map((topic, index) => (
            <div key={`${topic.category}-${topic.subcategory}-${index}`} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{formatTopicName(topic.category)}</h4>
                  {topic.subcategory && (
                    <p className="text-sm text-gray-600">{formatTopicName(topic.subcategory)}</p>
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
                    {topic.proficientWords}/{topic.totalWords} proficient
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrendsView = () => {
    if (!analytics || analytics.trends.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Trend Data</h4>
            <p className="text-gray-600">Not enough historical data available yet.</p>
          </div>
        </div>
      );
    }

    const latestTrend = analytics.trends[analytics.trends.length - 1];
    const previousTrend = analytics.trends[analytics.trends.length - 8] || analytics.trends[0];

    const accuracyChange = latestTrend.averageAccuracy - previousTrend.averageAccuracy;
    const wordsChange = latestTrend.proficientWords - previousTrend.proficientWords;
    const studentsChange = latestTrend.activeStudents - previousTrend.activeStudents;

    // Get last 30 days of trends
    const recentTrends = analytics.trends.slice(-30);

    return (
      <div className="space-y-6">
        {/* Trend Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Accuracy Trend"
            value={`${latestTrend.averageAccuracy}%`}
            icon={<Target className="h-6 w-6 text-blue-600" />}
            trend={accuracyChange}
            subtitle="Class average"
            color="blue"
          />
          <StatCard
            title="Proficient Words"
            value={latestTrend.proficientWords}
            icon={<Award className="h-6 w-6 text-green-600" />}
            trend={wordsChange > 0 && previousTrend.proficientWords > 0 ? Math.round((wordsChange / previousTrend.proficientWords) * 100) : 0}
            subtitle="Recently proficient"
            color="green"
          />
          <StatCard
            title="Active Students"
            value={latestTrend.activeStudents}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            trend={studentsChange}
            subtitle="This week"
            color="purple"
          />
        </div>

        {/* Accuracy & Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            Class Performance Trends (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Active Students', angle: 90, position: 'insideRight', style: { fontSize: '12px' } }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="averageAccuracy"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Accuracy %"
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="activeStudents"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Active Students"
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vocabulary Progress by Proficiency Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-green-500 mr-2" />
            Vocabulary Progress by Proficiency Level
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Number of Words', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              />
              <Legend />
              <Bar dataKey="proficientWords" stackId="a" fill="#10b981" name="Proficient" />
              <Bar dataKey="learningWords" stackId="a" fill="#f59e0b" name="Learning" />
              <Bar dataKey="strugglingWords" stackId="a" fill="#ef4444" name="Struggling" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center text-sm text-gray-600">
            Total words learned: <span className="font-semibold">{recentTrends.reduce((sum, t) => sum + t.wordsLearned, 0)}</span> words in the last 30 days
          </div>
        </div>
      </div>
    );
  };

  const renderWordAnalysisView = () => {
    if (!analytics?.detailedWords || analytics.detailedWords.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Word Analysis Available</h3>
          <p className="text-gray-600">Word-level data will appear once students practice vocabulary.</p>
        </div>
      );
    }

    // Most challenging: words with significant exposure (min 5 encounters) AND low accuracy
    // Sort by: (1) accuracy ascending, (2) total encounters descending (more encounters = more problematic)
    const strugglingWords = [...analytics.detailedWords]
      .filter(w => w.totalEncounters >= 5) // Only words with meaningful exposure
      .sort((a, b) => {
        // Primary sort: accuracy (lowest first)
        if (Math.abs(a.accuracy - b.accuracy) > 5) {
          return a.accuracy - b.accuracy;
        }
        // Secondary sort: encounters (highest first) for words with similar accuracy
        return b.totalEncounters - a.totalEncounters;
      })
      .slice(0, 10); // Top 10 most challenging words

    // Sort by total encounters (most practiced words)
    const mostPracticedWords = [...analytics.detailedWords]
      .sort((a, b) => b.totalEncounters - a.totalEncounters)
      .slice(0, 10); // Top 10 most practiced words

    return (
      <div className="space-y-6">
        {/* Class-wide Word Difficulty Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-red-500 mr-2" />
            Most Challenging Words (Class-Wide)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Words with significant exposure (5+ encounters) and low accuracy
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Word</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Encounters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Mastery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students Struggling</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {strugglingWords.map((word, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.word}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{word.translation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {word.totalEncounters} encounters
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${word.accuracy < 30 ? 'bg-red-500' : word.accuracy < 50 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                            style={{ width: `${word.accuracy}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{word.accuracy.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {word.masteryLevel.toFixed(1)} / 5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {word.studentsStruggling} students
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Class-wide Most Practiced Words */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-blue-500 mr-2" />
            Most Practiced Words (Class-Wide)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Words with the most exposure across all students
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Word</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Encounters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Mastery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students Proficient</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mostPracticedWords.map((word, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.word}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{word.translation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {word.totalEncounters} encounters
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${word.accuracy >= 90 ? 'bg-green-500' : word.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${word.accuracy}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{word.accuracy.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {word.masteryLevel.toFixed(1)} / 5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {word.studentsProficient} students
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Per-Student Word Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            Individual Student Word Analysis
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Click on a student to see their strong and weak words
          </p>
          <div className="space-y-3">
            {analytics.studentWordDetails && analytics.studentWordDetails.map((student) => {
              const isExpanded = expandedStudents.has(student.studentId);
              
              return (
                <div key={student.studentId} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleStudentExpansion(student.studentId)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">{student.studentName}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600 font-medium">
                        {student.strongWords.length} strong words
                      </span>
                      <span className="text-red-600 font-medium">
                        {student.weakWords.length} weak words
                      </span>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Strong Words */}
                        <div>
                          <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Strong Words ({student.strongWords.length})
                          </h4>
                          {student.strongWords.length > 0 ? (
                            <div className="space-y-1">
                              {student.strongWords.map((word, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white rounded px-3 py-2 text-sm">
                                  <span className="font-medium text-gray-900">{word.word}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-600">{word.translation}</span>
                                    <span className="text-green-600 font-semibold">{word.accuracy.toFixed(0)}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No strong words yet</p>
                          )}
                        </div>

                        {/* Weak Words */}
                        <div>
                          <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Weak Words ({student.weakWords.length})
                          </h4>
                          {student.weakWords.length > 0 ? (
                            <div className="space-y-1">
                              {student.weakWords.map((word, idx) => (
                                <div key={idx} className="flex flex-col bg-white rounded px-3 py-2 text-sm">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{word.word}</span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-gray-600">{word.translation}</span>
                                      <span className="text-red-600 font-semibold">{word.accuracy.toFixed(0)}%</span>
                                    </div>
                                  </div>
                                  {word.errorPattern && (
                                    <span className={`text-xs ${
                                      word.errorPattern === 'Frequent mistakes' ? 'text-red-600' :
                                      word.errorPattern === 'Moderate difficulty' ? 'text-orange-600' :
                                      'text-yellow-600'
                                    }`}>
                                      {word.errorPattern}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No weak words identified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vocabulary Analytics</h1>
          <p className="text-gray-600 mt-1">
            {selectedClassId && selectedClassId !== 'all' 
              ? `Viewing: ${availableClasses.find(c => c.id === selectedClassId)?.name || 'Selected Class'}`
              : 'Class-wide vocabulary progress and insights'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Class Selector */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedClassId || 'all'}
              onChange={(e) => setSelectedClassId(e.target.value === 'all' ? null : e.target.value)}
              disabled={loadingClasses}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {loadingClasses ? (
                <option>Loading classes...</option>
              ) : (
                availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))
              )}
            </select>
          </div>

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
            { id: 'trends', label: 'Trends', icon: <TrendingUp className="h-4 w-4" /> },
            { id: 'words', label: 'Word Analysis', icon: <FileText className="h-4 w-4" /> }
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
          {selectedView === 'words' && renderWordAnalysisView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
