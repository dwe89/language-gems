'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, TrendingUp, FileText, Calendar, Download,
  Target, AlertCircle, CheckCircle, Clock, Users,
  BookOpen, Brain, Zap, Star, Filter, RefreshCw,
  ChevronDown, ChevronRight, Eye, ExternalLink
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface AssignmentPerformanceReport {
  assignment_id: string;
  assignment_title: string;
  class_name: string;
  created_date: string;
  due_date: string;
  
  // Participation metrics
  total_students: number;
  students_started: number;
  students_completed: number;
  completion_rate: number;
  
  // Performance metrics
  average_score: number;
  median_score: number;
  highest_score: number;
  lowest_score: number;
  standard_deviation: number;
  
  // Time metrics
  average_time_spent: number; // minutes
  median_time_spent: number;
  
  // Difficulty analysis
  difficulty_rating: number; // 1-5 scale
  common_errors: string[];
  challenging_questions: string[];
  
  // Trends
  performance_trend: 'improving' | 'stable' | 'declining';
  engagement_score: number;
}

interface VocabularyDifficultyAnalysis {
  word: string;
  translation: string;
  language: string;
  theme: string;
  topic: string;
  
  // Difficulty metrics
  total_attempts: number;
  correct_attempts: number;
  accuracy_rate: number;
  average_response_time: number; // seconds
  difficulty_score: number; // 0-1 scale
  
  // Student impact
  students_attempted: number;
  students_struggling: number; // accuracy < 60%
  students_mastered: number; // accuracy > 90%
  
  // Learning patterns
  common_mistakes: string[];
  improvement_trend: 'improving' | 'stable' | 'declining';
  recommended_practice_time: number; // minutes
}

interface LearningPatternChart {
  period: string;
  date: string;
  
  // Class performance
  average_class_score: number;
  completion_rate: number;
  engagement_level: number;
  
  // Learning metrics
  new_words_learned: number;
  concepts_mastered: number;
  skills_improved: number;
  
  // Behavioral patterns
  peak_activity_hour: number;
  average_session_length: number;
  streak_maintenance_rate: number;
}

interface ReportFilters {
  time_period: string;
  class_id: string;
  assignment_type: string;
  language: string;
  difficulty_level: string;
  report_type: 'assignments' | 'vocabulary' | 'patterns';
}

// =====================================================
// DETAILED REPORTS & ANALYTICS COMPONENT
// =====================================================

export default function DetailedReportsAnalytics() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // State management
  const [assignmentReports, setAssignmentReports] = useState<AssignmentPerformanceReport[]>([]);
  const [vocabularyAnalysis, setVocabularyAnalysis] = useState<VocabularyDifficultyAnalysis[]>([]);
  const [learningPatterns, setLearningPatterns] = useState<LearningPatternChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'vocabulary' | 'patterns'>('assignments');
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());
  
  // Filter state
  const [filters, setFilters] = useState<ReportFilters>({
    time_period: '30_days',
    class_id: 'all',
    assignment_type: 'all',
    language: 'all',
    difficulty_level: 'all',
    report_type: 'assignments'
  });

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadReportsData();
    }
  }, [user, filters]);

  // =====================================================
  // DATA LOADING FUNCTIONS
  // =====================================================

  const loadReportsData = async () => {
    try {
      setLoading(true);
      
      const [assignments, vocabulary, patterns] = await Promise.all([
        loadAssignmentReports(),
        loadVocabularyAnalysis(),
        loadLearningPatterns()
      ]);

      setAssignmentReports(assignments);
      setVocabularyAnalysis(vocabulary);
      setLearningPatterns(patterns);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignmentReports = async (): Promise<AssignmentPerformanceReport[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        assignment_id: 'assign-1',
        assignment_title: 'French Vocabulary: Food & Drinks',
        class_name: 'Year 7 French',
        created_date: '2024-07-15T10:00:00Z',
        due_date: '2024-07-22T23:59:00Z',
        total_students: 24,
        students_started: 22,
        students_completed: 18,
        completion_rate: 75,
        average_score: 78.5,
        median_score: 82,
        highest_score: 96,
        lowest_score: 45,
        standard_deviation: 12.8,
        average_time_spent: 18.5,
        median_time_spent: 16,
        difficulty_rating: 2.8,
        common_errors: ['Incorrect gender articles', 'Spelling mistakes in "boisson"', 'Confusion between "pain" and "pâin"'],
        challenging_questions: ['Question 8: Beverage vocabulary', 'Question 12: Formal vs informal food terms'],
        performance_trend: 'improving',
        engagement_score: 8.2
      },
      {
        assignment_id: 'assign-2',
        assignment_title: 'Spanish Grammar: Past Tense Verbs',
        class_name: 'Year 8 Spanish',
        created_date: '2024-07-20T09:00:00Z',
        due_date: '2024-07-27T23:59:00Z',
        total_students: 20,
        students_started: 19,
        students_completed: 14,
        completion_rate: 70,
        average_score: 65.2,
        median_score: 68,
        highest_score: 89,
        lowest_score: 32,
        standard_deviation: 15.6,
        average_time_spent: 25.3,
        median_time_spent: 22,
        difficulty_rating: 3.6,
        common_errors: ['Irregular verb conjugations', 'Accent mark placement', 'Ser vs Estar confusion'],
        challenging_questions: ['Question 5: Irregular preterite forms', 'Question 11: Subjunctive mood usage'],
        performance_trend: 'stable',
        engagement_score: 7.1
      }
    ];
  };

  const loadVocabularyAnalysis = async (): Promise<VocabularyDifficultyAnalysis[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        word: 'boisson',
        translation: 'drink/beverage',
        language: 'French',
        theme: 'Food & Drinks',
        topic: 'Beverages',
        total_attempts: 156,
        correct_attempts: 98,
        accuracy_rate: 62.8,
        average_response_time: 4.2,
        difficulty_score: 0.72,
        students_attempted: 24,
        students_struggling: 8,
        students_mastered: 12,
        common_mistakes: ['Spelled as "boison"', 'Confused with "poison"', 'Incorrect pronunciation'],
        improvement_trend: 'improving',
        recommended_practice_time: 15
      },
      {
        word: 'conjugar',
        translation: 'to conjugate',
        language: 'Spanish',
        theme: 'Grammar Terms',
        topic: 'Verb Forms',
        total_attempts: 89,
        correct_attempts: 45,
        accuracy_rate: 50.6,
        average_response_time: 6.8,
        difficulty_score: 0.85,
        students_attempted: 20,
        students_struggling: 12,
        students_mastered: 4,
        common_mistakes: ['Confused with "conjugado"', 'Incorrect accent placement', 'Mixed up with "conjurar"'],
        improvement_trend: 'declining',
        recommended_practice_time: 25
      }
    ];
  };

  const loadLearningPatterns = async (): Promise<LearningPatternChart[]> => {
    // Mock data - replace with actual API calls
    const patterns: LearningPatternChart[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      patterns.push({
        period: `Day ${i + 1}`,
        date: date.toISOString().split('T')[0],
        average_class_score: 70 + Math.random() * 20,
        completion_rate: 60 + Math.random() * 30,
        engagement_level: 6 + Math.random() * 3,
        new_words_learned: Math.floor(Math.random() * 15) + 5,
        concepts_mastered: Math.floor(Math.random() * 8) + 2,
        skills_improved: Math.floor(Math.random() * 5) + 1,
        peak_activity_hour: Math.floor(Math.random() * 6) + 14, // 2-8 PM
        average_session_length: 15 + Math.random() * 20,
        streak_maintenance_rate: 40 + Math.random() * 40
      });
    }

    return patterns;
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const toggleReportExpansion = (reportId: string) => {
    const newExpanded = new Set(expandedReports);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedReports(newExpanded);
  };

  const handleExportReport = (reportType: string, reportId?: string) => {
    console.log(`Exporting ${reportType} report`, reportId);
    // Implement export functionality
  };

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const renderAssignmentReports = () => (
    <div className="space-y-6">
      {assignmentReports.map((report) => {
        const isExpanded = expandedReports.has(report.assignment_id);
        
        return (
          <motion.div
            key={report.assignment_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Report Header */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleReportExpansion(report.assignment_id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.assignment_title}</h3>
                    <p className="text-sm text-gray-600">{report.class_name} • Due: {new Date(report.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Quick Stats */}
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Completion Rate</div>
                    <div className="text-lg font-semibold text-gray-900">{report.completion_rate}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Avg Score</div>
                    <div className={`text-lg font-semibold ${
                      report.average_score >= 80 ? 'text-green-600' : 
                      report.average_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {report.average_score.toFixed(1)}%
                    </div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600">
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Report Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-6 space-y-6">
                    {/* Performance Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Participation</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{report.students_completed}/{report.total_students}</div>
                        <div className="text-sm text-blue-700">Students completed</div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Performance</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900">{report.average_score.toFixed(1)}%</div>
                        <div className="text-sm text-green-700">Average score</div>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Time Spent</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-900">{report.average_time_spent.toFixed(1)}</div>
                        <div className="text-sm text-yellow-700">Minutes average</div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">Difficulty</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">{report.difficulty_rating.toFixed(1)}/5</div>
                        <div className="text-sm text-purple-700">Difficulty rating</div>
                      </div>
                    </div>

                    {/* Common Errors Analysis */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Common Errors</span>
                      </h4>
                      <div className="space-y-2">
                        {report.common_errors.map((error, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-red-700">{error}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenging Questions */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span>Most Challenging Questions</span>
                      </h4>
                      <div className="space-y-2">
                        {report.challenging_questions.map((question, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-orange-700">{question}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          report.performance_trend === 'improving' ? 'bg-green-100 text-green-800' :
                          report.performance_trend === 'declining' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.performance_trend === 'improving' ? <TrendingUp className="h-3 w-3 mr-1" /> : null}
                          {report.performance_trend}
                        </span>
                        <span>•</span>
                        <span>Engagement: {report.engagement_score}/10</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleExportReport('assignment', report.assignment_id)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Report</span>
                        </button>
                        <button className="flex items-center space-x-2 text-green-600 hover:text-green-800 text-sm">
                          <ExternalLink className="h-4 w-4" />
                          <span>View Assignment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );

  const renderVocabularyAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Difficulty Analysis</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Word</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students Struggling</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vocabularyAnalysis.map((word, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-gray-900">{word.word}</div>
                        <div className="text-sm text-gray-500">{word.translation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {word.language}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              word.accuracy_rate >= 80 ? 'bg-green-500' :
                              word.accuracy_rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${word.accuracy_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{word.accuracy_rate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(word.difficulty_score * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-red-600">{word.students_struggling}</span>
                      <span className="text-sm text-gray-500">/{word.students_attempted}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        word.improvement_trend === 'improving' ? 'bg-green-100 text-green-800' :
                        word.improvement_trend === 'declining' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {word.improvement_trend === 'improving' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {word.improvement_trend}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Create Practice
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLearningPatterns = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Pattern Trends (Last 30 Days)</h3>
        
        {/* Simple Chart Visualization */}
        <div className="h-64 bg-gray-50 rounded-lg p-4 mb-6">
          <div className="h-full flex items-end justify-between space-x-2">
            {learningPatterns.slice(-7).map((pattern, index) => {
              const height = (pattern.average_class_score / 100) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`${pattern.date}: ${pattern.average_class_score.toFixed(1)}%`}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">
                    {new Date(pattern.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pattern Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Peak Learning Time</h4>
            <div className="text-2xl font-bold text-blue-900">3:00 PM</div>
            <div className="text-sm text-blue-700">Most active hour</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Average Session</h4>
            <div className="text-2xl font-bold text-green-900">22 min</div>
            <div className="text-sm text-green-700">Session length</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Streak Maintenance</h4>
            <div className="text-2xl font-bold text-purple-900">68%</div>
            <div className="text-sm text-purple-700">Students maintaining streaks</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading detailed reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detailed Reports & Analytics</h2>
            <p className="text-gray-600">Comprehensive performance analysis and insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExportReport('all')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={filters.time_period}
              onChange={(e) => handleFilterChange('time_period', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7_days">Last 7 days</option>
              <option value="30_days">Last 30 days</option>
              <option value="90_days">Last 90 days</option>
              <option value="all_time">All time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={filters.class_id}
              onChange={(e) => handleFilterChange('class_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              <option value="class-1">Year 7 French</option>
              <option value="class-2">Year 8 Spanish</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
            <select
              value={filters.assignment_type}
              onChange={(e) => handleFilterChange('assignment_type', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="grammar">Grammar</option>
              <option value="listening">Listening</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Languages</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="german">German</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={filters.difficulty_level}
              onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'assignments', label: 'Assignment Reports', icon: FileText },
              { key: 'vocabulary', label: 'Vocabulary Analysis', icon: BookOpen },
              { key: 'patterns', label: 'Learning Patterns', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'assignments' && renderAssignmentReports()}
          {activeTab === 'vocabulary' && renderVocabularyAnalysis()}
          {activeTab === 'patterns' && renderLearningPatterns()}
        </div>
      </div>
    </div>
  );
}
