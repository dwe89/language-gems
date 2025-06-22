'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../services/vocabulary-mining';
import { 
  TopicPerformance, 
  ClassAnalytics,
  VocabularyAchievement 
} from '../../../types/vocabulary-mining';
import { 
  Pickaxe, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Award,
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  averageMastery: number;
  totalGems: number;
  activeStudents: number;
  weakTopics: string[];
  strongTopics: string[];
}

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  totalGems: number;
  masteredGems: number;
  currentStreak: number;
  averageAccuracy: number;
  lastActive: Date | null;
  weakTopics: string[];
}

export default function TeacherVocabularyMiningPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('month');
  
  // Data state
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics | null>(null);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);
  
  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageClassMastery: 0,
    totalGemsCollected: 0,
    weakTopicsCount: 0,
    strongTopicsCount: 0
  });

  useEffect(() => {
    if (user) {
      loadTeacherData();
    }
  }, [user, selectedClass, selectedTimeRange]);

  const loadTeacherData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load teacher's classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select(`
          id, name,
          class_enrollments(count)
        `)
        .eq('teacher_id', user.id);

      if (classesError) throw classesError;

      // Process classes data
      const processedClasses: ClassData[] = await Promise.all(
        (classesData || []).map(async (cls) => {
          // Get class analytics
          const { data: analytics } = await supabase
            .from('vocabulary_class_analytics')
            .select('*')
            .eq('class_id', cls.id)
            .order('analytics_date', { ascending: false })
            .limit(1)
            .single();

          return {
            id: cls.id,
            name: cls.name,
            studentCount: cls.class_enrollments?.length || 0,
            averageMastery: analytics?.class_average_mastery || 0,
            totalGems: analytics?.total_vocabulary_items || 0,
            activeStudents: analytics?.active_students || 0,
            weakTopics: analytics?.weak_topics || [],
            strongTopics: analytics?.strong_topics || []
          };
        })
      );

      setClasses(processedClasses);

      // Load student progress for selected class
      if (selectedClass !== 'all') {
        await loadClassStudentProgress(selectedClass);
      } else {
        // Load all students across all classes
        await loadAllStudentProgress();
      }

      // Calculate summary stats
      const totalStudents = processedClasses.reduce((sum, cls) => sum + cls.studentCount, 0);
      const activeStudents = processedClasses.reduce((sum, cls) => sum + cls.activeStudents, 0);
      const averageClassMastery = processedClasses.length > 0 
        ? processedClasses.reduce((sum, cls) => sum + cls.averageMastery, 0) / processedClasses.length
        : 0;
      const totalGemsCollected = processedClasses.reduce((sum, cls) => sum + cls.totalGems, 0);
      const allWeakTopics = [...new Set(processedClasses.flatMap(cls => cls.weakTopics))];
      const allStrongTopics = [...new Set(processedClasses.flatMap(cls => cls.strongTopics))];

      setSummaryStats({
        totalStudents,
        activeStudents,
        averageClassMastery: Math.round(averageClassMastery),
        totalGemsCollected,
        weakTopicsCount: allWeakTopics.length,
        strongTopicsCount: allStrongTopics.length
      });

    } catch (err: any) {
      console.error('Error loading teacher data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadClassStudentProgress = async (classId: string) => {
    // Get students in the class
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('class_enrollments')
      .select(`
        student_id,
        user_profiles!inner(display_name, email)
      `)
      .eq('class_id', classId)
      .eq('status', 'active');

    if (enrollmentsError) throw enrollmentsError;

    // Get progress for each student
    const studentProgressData: StudentProgress[] = await Promise.all(
      (enrollments || []).map(async (enrollment) => {
        const summary = await miningService.getStudentProgressSummary(enrollment.student_id);
        
        return {
          id: enrollment.student_id,
          name: enrollment.user_profiles.display_name || 'Unknown',
          email: enrollment.user_profiles.email || '',
          totalGems: summary.totalGems,
          masteredGems: summary.masteredGems,
          currentStreak: summary.currentStreak,
          averageAccuracy: summary.averageAccuracy,
          lastActive: null, // Would need to track this separately
          weakTopics: summary.topicPerformance
            .filter(topic => topic.masteryPercentage < 70)
            .map(topic => topic.topicName)
        };
      })
    );

    setStudentProgress(studentProgressData);
  };

  const loadAllStudentProgress = async () => {
    // For "all classes" view, we'll show a summary
    setStudentProgress([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary mining analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTeacherData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500 rounded-xl">
                <Pickaxe className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Vocabulary Mining Analytics</h1>
                <p className="text-gray-600">Monitor student progress and identify learning opportunities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Class Filter */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              
              {/* Time Range Filter */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
              
              {/* Refresh Button */}
              <button
                onClick={loadTeacherData}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              
              {/* Export Button */}
              <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.activeStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Mastery</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.averageClassMastery}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Gems</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalGemsCollected}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Weak Topics</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.weakTopicsCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Strong Topics</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.strongTopicsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Class Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Classes Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Classes Overview</h3>
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{cls.name}</h4>
                      <span className="text-sm text-gray-500">{cls.studentCount} students</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg Mastery:</span>
                        <span className="ml-1 font-medium">{cls.averageMastery}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Active:</span>
                        <span className="ml-1 font-medium">{cls.activeStudents}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Gems:</span>
                        <span className="ml-1 font-medium">{cls.totalGems}</span>
                      </div>
                    </div>
                    
                    {cls.weakTopics.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-red-600 font-medium">Weak Topics: </span>
                        <span className="text-xs text-gray-600">{cls.weakTopics.slice(0, 3).join(', ')}</span>
                        {cls.weakTopics.length > 3 && <span className="text-xs text-gray-500"> +{cls.weakTopics.length - 3} more</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Student Progress */}
            {selectedClass !== 'all' && studentProgress.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 text-sm font-medium text-gray-600">Student</th>
                        <th className="py-2 text-sm font-medium text-gray-600">Gems</th>
                        <th className="py-2 text-sm font-medium text-gray-600">Mastered</th>
                        <th className="py-2 text-sm font-medium text-gray-600">Accuracy</th>
                        <th className="py-2 text-sm font-medium text-gray-600">Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentProgress.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                          </td>
                          <td className="py-3 text-sm">{student.totalGems}</td>
                          <td className="py-3 text-sm">
                            <span className="text-green-600 font-medium">{student.masteredGems}</span>
                            <span className="text-gray-500 ml-1">
                              ({student.totalGems > 0 ? Math.round((student.masteredGems / student.totalGems) * 100) : 0}%)
                            </span>
                          </td>
                          <td className="py-3 text-sm">{student.averageAccuracy}%</td>
                          <td className="py-3 text-sm">
                            {student.currentStreak > 0 && (
                              <span className="flex items-center text-yellow-600">
                                <Zap className="w-3 h-3 mr-1" />
                                {student.currentStreak}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard/vocabulary-mining/curriculum"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Import Curriculum
                </Link>
                
                <Link
                  href="/dashboard/assignments/new?type=vocabulary-mining"
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Create Mining Assignment
                </Link>
                
                <Link
                  href="/dashboard/vocabulary-mining/reports"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Detailed Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
