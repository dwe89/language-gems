'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../services/vocabulary-mining';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download,
  Filter,
  RefreshCw,
  Target,
  Clock,
  Users,
  Award,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalVocabularyItems: number;
    totalGemsCollected: number;
    averageClassMastery: number;
    totalPracticeTime: number;
    activeStudentsToday: number;
  };
  trends: {
    masteryTrend: { date: string; mastery: number }[];
    activityTrend: { date: string; sessions: number; students: number }[];
    retentionTrend: { interval: number; retention: number }[];
  };
  topicAnalysis: {
    topicName: string;
    totalWords: number;
    averageMastery: number;
    studentsStruggling: number;
    improvementRate: number;
    status: 'strong' | 'moderate' | 'weak';
  }[];
  studentInsights: {
    topPerformers: { name: string; mastery: number; streak: number }[];
    needsAttention: { name: string; mastery: number; lastActive: string }[];
    fastLearners: { name: string; learningVelocity: number; recentGains: number }[];
  };
  predictions: {
    examReadiness: { topic: string; readinessScore: number; timeToReady: number }[];
    retentionRisk: { studentName: string; riskScore: number; wordsAtRisk: number }[];
    optimalReviewTiming: { studentName: string; nextReviewDate: string; wordsToReview: number }[];
  };
}

export default function AdvancedAnalyticsPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'trends' | 'topics' | 'students' | 'predictions'>('overview');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, selectedTimeRange, selectedClass]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load teacher's classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user?.id);

      if (classesError) throw classesError;
      setClasses(classesData || []);

      // Generate mock analytics data
      // In a real implementation, this would come from complex database queries
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalStudents: 45,
          totalVocabularyItems: 2500,
          totalGemsCollected: 1250,
          averageClassMastery: 78,
          totalPracticeTime: 2340, // minutes
          activeStudentsToday: 32
        },
        trends: {
          masteryTrend: [
            { date: '2024-01-01', mastery: 65 },
            { date: '2024-01-08', mastery: 68 },
            { date: '2024-01-15', mastery: 72 },
            { date: '2024-01-22', mastery: 75 },
            { date: '2024-01-29', mastery: 78 }
          ],
          activityTrend: [
            { date: '2024-01-01', sessions: 45, students: 28 },
            { date: '2024-01-08', sessions: 52, students: 32 },
            { date: '2024-01-15', sessions: 48, students: 30 },
            { date: '2024-01-22', sessions: 58, students: 35 },
            { date: '2024-01-29', sessions: 62, students: 38 }
          ],
          retentionTrend: [
            { interval: 1, retention: 92 },
            { interval: 3, retention: 87 },
            { interval: 7, retention: 82 },
            { interval: 14, retention: 76 },
            { interval: 30, retention: 68 }
          ]
        },
        topicAnalysis: [
          { topicName: 'Family & Relationships', totalWords: 150, averageMastery: 85, studentsStruggling: 3, improvementRate: 12, status: 'strong' },
          { topicName: 'School & Education', totalWords: 200, averageMastery: 78, studentsStruggling: 8, improvementRate: 8, status: 'moderate' },
          { topicName: 'Travel & Transport', totalWords: 180, averageMastery: 65, studentsStruggling: 15, improvementRate: 5, status: 'weak' },
          { topicName: 'Food & Dining', totalWords: 120, averageMastery: 82, studentsStruggling: 5, improvementRate: 10, status: 'strong' },
          { topicName: 'Technology', totalWords: 90, averageMastery: 58, studentsStruggling: 22, improvementRate: 3, status: 'weak' }
        ],
        studentInsights: {
          topPerformers: [
            { name: 'Alice Johnson', mastery: 95, streak: 28 },
            { name: 'Bob Smith', mastery: 92, streak: 21 },
            { name: 'Carol Davis', mastery: 89, streak: 19 }
          ],
          needsAttention: [
            { name: 'David Wilson', mastery: 45, lastActive: '3 days ago' },
            { name: 'Emma Brown', mastery: 52, lastActive: '5 days ago' },
            { name: 'Frank Miller', mastery: 38, lastActive: '1 week ago' }
          ],
          fastLearners: [
            { name: 'Grace Lee', learningVelocity: 8.5, recentGains: 15 },
            { name: 'Henry Chen', learningVelocity: 7.2, recentGains: 12 },
            { name: 'Ivy Taylor', learningVelocity: 6.8, recentGains: 10 }
          ]
        },
        predictions: {
          examReadiness: [
            { topic: 'Family & Relationships', readinessScore: 88, timeToReady: 2 },
            { topic: 'School & Education', readinessScore: 75, timeToReady: 4 },
            { topic: 'Travel & Transport', readinessScore: 62, timeToReady: 8 },
            { topic: 'Food & Dining', readinessScore: 80, timeToReady: 3 },
            { topic: 'Technology', readinessScore: 45, timeToReady: 12 }
          ],
          retentionRisk: [
            { studentName: 'David Wilson', riskScore: 85, wordsAtRisk: 45 },
            { studentName: 'Emma Brown', riskScore: 72, wordsAtRisk: 32 },
            { studentName: 'Frank Miller', riskScore: 68, wordsAtRisk: 28 }
          ],
          optimalReviewTiming: [
            { studentName: 'Alice Johnson', nextReviewDate: 'Tomorrow', wordsToReview: 12 },
            { studentName: 'Bob Smith', nextReviewDate: 'In 2 days', wordsToReview: 8 },
            { studentName: 'Carol Davis', nextReviewDate: 'In 3 days', wordsToReview: 15 }
          ]
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Generate CSV report
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary-mining-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSVReport = () => {
    if (!analytics) return '';
    
    let csv = 'Vocabulary Mining Analytics Report\n\n';
    csv += 'Overview\n';
    csv += 'Metric,Value\n';
    csv += `Total Students,${analytics.overview.totalStudents}\n`;
    csv += `Total Vocabulary Items,${analytics.overview.totalVocabularyItems}\n`;
    csv += `Total Gems Collected,${analytics.overview.totalGemsCollected}\n`;
    csv += `Average Class Mastery,${analytics.overview.averageClassMastery}%\n`;
    csv += `Total Practice Time,${analytics.overview.totalPracticeTime} minutes\n\n`;
    
    csv += 'Topic Analysis\n';
    csv += 'Topic,Total Words,Average Mastery,Students Struggling,Status\n';
    analytics.topicAnalysis.forEach(topic => {
      csv += `${topic.topicName},${topic.totalWords},${topic.averageMastery}%,${topic.studentsStruggling},${topic.status}\n`;
    });
    
    return csv;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'weak': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h2>
          <p className="text-gray-600">Unable to load analytics data.</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics & Reporting</h1>
              <p className="text-gray-600">Comprehensive insights into vocabulary mining performance</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Filters */}
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
              
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              
              <button
                onClick={exportReport}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              
              <button
                onClick={loadAnalyticsData}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'trends', name: 'Trends', icon: TrendingUp },
            { id: 'topics', name: 'Topic Analysis', icon: Target },
            { id: 'students', name: 'Student Insights', icon: Users },
            { id: 'predictions', name: 'Predictions', icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                selectedReport === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Overview */}
        {selectedReport === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalStudents}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Vocabulary</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalVocabularyItems}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Gems</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalGemsCollected}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageClassMastery}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Practice Time</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.overview.totalPracticeTime / 60)}h</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overview.activeStudentsToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Topic Analysis */}
        {selectedReport === 'topics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Performance Analysis</h3>
              <div className="space-y-4">
                {analytics.topicAnalysis.map((topic, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{topic.topicName}</h4>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(topic.status)}`}>
                          {topic.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{topic.totalWords} words</div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg Mastery:</span>
                        <span className={`ml-2 font-medium ${getReadinessColor(topic.averageMastery)}`}>
                          {topic.averageMastery}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Struggling:</span>
                        <span className="ml-2 font-medium text-red-600">{topic.studentsStruggling} students</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Improvement:</span>
                        <span className="ml-2 font-medium text-green-600">+{topic.improvementRate}%</span>
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/vocabulary-mining/topics/${topic.topicName.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            topic.averageMastery >= 80 ? 'bg-green-500' :
                            topic.averageMastery >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${topic.averageMastery}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Student Insights */}
        {selectedReport === 'students' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {analytics.studentInsights.topPerformers.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.streak} day streak</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">{student.mastery}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Needs Attention */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Needs Attention
              </h3>
              <div className="space-y-3">
                {analytics.studentInsights.needsAttention.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">Last active: {student.lastActive}</div>
                    </div>
                    <div className="text-lg font-bold text-red-600">{student.mastery}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Fast Learners */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-blue-500 mr-2" />
                Fast Learners
              </h3>
              <div className="space-y-3">
                {analytics.studentInsights.fastLearners.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">+{student.recentGains}% this week</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{student.learningVelocity}/10</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Predictions */}
        {selectedReport === 'predictions' && (
          <div className="space-y-6">
            {/* Exam Readiness */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 text-purple-500 mr-2" />
                Exam Readiness Predictions
              </h3>
              <div className="space-y-3">
                {analytics.predictions.examReadiness.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{prediction.topic}</div>
                      <div className="text-sm text-gray-600">
                        Estimated {prediction.timeToReady} weeks to exam readiness
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getReadinessColor(prediction.readinessScore)}`}>
                      {prediction.readinessScore}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Retention Risk */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                Retention Risk Analysis
              </h3>
              <div className="space-y-3">
                {analytics.predictions.retentionRisk.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{risk.studentName}</div>
                      <div className="text-sm text-gray-600">
                        {risk.wordsAtRisk} words at risk of being forgotten
                      </div>
                    </div>
                    <div className="text-lg font-bold text-orange-600">{risk.riskScore}% risk</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
