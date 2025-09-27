'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Brain,
  Lightbulb,
  Download,
  Filter,
  Search,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { 
  VocabularyTestService, 
  VocabularyTestAnalytics, 
  ProblemWord, 
  MasteryWord, 
  RemediationSuggestion 
} from '../../services/vocabularyTestService';

interface VocabularyTestAnalyticsProps {
  testId: string;
  assignmentId?: string;
}

interface StudentResult {
  id: string;
  student_name: string;
  student_email: string;
  attempt_number: number;
  percentage_score: number;
  passed: boolean;
  total_time_seconds: number;
  questions_correct: number;
  questions_incorrect: number;
  completion_time: string;
  error_patterns: string[];
}

interface ClassPerformanceMetrics {
  totalStudents: number;
  studentsCompleted: number;
  studentsNotStarted: number;
  averageScore: number;
  passRate: number;
  averageTime: number;
  scoreDistribution: { range: string; count: number }[];
}

export default function VocabularyTestAnalytics({
  testId,
  assignmentId
}: VocabularyTestAnalyticsProps) {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [testService] = useState(() => new VocabularyTestService(supabase));

  // State
  const [analytics, setAnalytics] = useState<VocabularyTestAnalytics | null>(null);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [classMetrics, setClassMetrics] = useState<ClassPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'words' | 'insights'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'name'>('score');

  useEffect(() => {
    if (user && testId) {
      loadAnalytics();
    }
  }, [user, testId, assignmentId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load test analytics
      const analyticsData = await testService.getTestAnalytics(testId);
      setAnalytics(analyticsData);

      // Load detailed student results
      await loadStudentResults();
      
    } catch (error: any) {
      setError(error.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentResults = async () => {
    try {
      // This would be implemented to fetch detailed student results
      // For now, using mock data structure
      const { data, error } = await supabase
        .from('vocabulary_test_results')
        .select(`
          *,
          student:student_id (
            id,
            email,
            user_metadata
          )
        `)
        .eq('test_id', testId)
        .order('percentage_score', { ascending: false });

      if (error) throw error;

      const results: StudentResult[] = data?.map(result => ({
        id: result.id,
        student_name: result.student?.user_metadata?.full_name || result.student?.email || 'Unknown',
        student_email: result.student?.email || '',
        attempt_number: result.attempt_number,
        percentage_score: result.percentage_score,
        passed: result.passed,
        total_time_seconds: result.total_time_seconds,
        questions_correct: result.questions_correct,
        questions_incorrect: result.questions_incorrect,
        completion_time: result.completion_time,
        error_patterns: Object.keys(result.error_analysis || {})
      })) || [];

      setStudentResults(results);
      calculateClassMetrics(results);
    } catch (error) {
      console.error('Error loading student results:', error);
    }
  };

  const calculateClassMetrics = (results: StudentResult[]) => {
    if (results.length === 0) return;

    const totalStudents = results.length;
    const studentsCompleted = results.filter(r => r.completion_time).length;
    const studentsNotStarted = totalStudents - studentsCompleted;
    const averageScore = results.reduce((sum, r) => sum + r.percentage_score, 0) / totalStudents;
    const passRate = (results.filter(r => r.passed).length / totalStudents) * 100;
    const averageTime = results.reduce((sum, r) => sum + r.total_time_seconds, 0) / totalStudents;

    // Score distribution
    const scoreRanges = [
      { range: '90-100%', min: 90, max: 100 },
      { range: '80-89%', min: 80, max: 89 },
      { range: '70-79%', min: 70, max: 79 },
      { range: '60-69%', min: 60, max: 69 },
      { range: '0-59%', min: 0, max: 59 }
    ];

    const scoreDistribution = scoreRanges.map(range => ({
      range: range.range,
      count: results.filter(r => r.percentage_score >= range.min && r.percentage_score <= range.max).length
    }));

    setClassMetrics({
      totalStudents,
      studentsCompleted,
      studentsNotStarted,
      averageScore,
      passRate,
      averageTime,
      scoreDistribution
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{classMetrics?.totalStudents || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {classMetrics?.averageScore.toFixed(1) || 0}%
              </p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pass Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {classMetrics?.passRate.toFixed(1) || 0}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {classMetrics ? formatTime(classMetrics.averageTime) : '0m 0s'}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
        <div className="space-y-3">
          {classMetrics?.scoreDistribution.map((range, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{range.range}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${classMetrics.totalStudents > 0 ? (range.count / classMetrics.totalStudents) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{range.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentResults = () => {
    const filteredResults = studentResults.filter(student =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedResults = [...filteredResults].sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.percentage_score - a.percentage_score;
        case 'time':
          return a.total_time_seconds - b.total_time_seconds;
        case 'name':
          return a.student_name.localeCompare(b.student_name);
        default:
          return 0;
      }
    });

    return (
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="score">Sort by Score</option>
              <option value="time">Sort by Time</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Student Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correct/Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedResults.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.student_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.student_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(student.percentage_score)}`}>
                        {student.percentage_score.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.passed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.passed ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Passed
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Failed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(student.total_time_seconds)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.questions_correct}/{student.questions_correct + student.questions_incorrect}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{student.attempt_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderProblemWords = () => (
    <div className="space-y-6">
      {/* Problem Words */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Problem Words
          </h3>
          <span className="text-sm text-gray-500">
            Words with lowest success rates
          </span>
        </div>
        
        <div className="space-y-3">
          {analytics?.problem_words.slice(0, 10).map((word, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{word.word}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-700">{word.translation}</span>
                </div>
                {word.common_errors.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Common errors: {word.common_errors.join(', ')}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-red-600">
                  {word.success_rate.toFixed(1)}% success
                </div>
                <div className="text-xs text-gray-500">
                  {word.total_attempts} attempts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mastery Words */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Mastery Words
          </h3>
          <span className="text-sm text-gray-500">
            Words with highest success rates
          </span>
        </div>
        
        <div className="space-y-3">
          {analytics?.mastery_words.slice(0, 10).map((word, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{word.word}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-700">{word.translation}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  {word.success_rate.toFixed(1)}% success
                </div>
                <div className="text-xs text-gray-500">
                  {word.total_attempts} attempts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Remediation Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            Remediation Suggestions
          </h3>
        </div>
        
        <div className="space-y-4">
          {analytics?.remediation_suggestions.map((suggestion, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      suggestion.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : suggestion.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {suggestion.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-sm text-gray-500">
                      {suggestion.affected_students} students affected
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  
                  {suggestion.recommended_games && suggestion.recommended_games.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500">Recommended games:</span>
                      {suggestion.recommended_games.map((game, gameIndex) => (
                        <span key={gameIndex} className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                          {game}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Create Assignment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadAnalytics}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Analytics</h1>
          <p className="text-gray-600">Comprehensive performance insights and recommendations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadAnalytics}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'students', name: 'Student Results', icon: Users },
            { id: 'words', name: 'Word Analysis', icon: BookOpen },
            { id: 'insights', name: 'Insights', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                selectedView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={selectedView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'students' && renderStudentResults()}
        {selectedView === 'words' && renderProblemWords()}
        {selectedView === 'insights' && renderInsights()}
      </motion.div>
    </div>
  );
}
