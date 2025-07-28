'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3,
  PieChart,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReadingAnalytics {
  totalAssessments: number;
  totalStudents: number;
  averageScore: number;
  averageTimeSpent: number;
  passRate: number;
  difficultyBreakdown: {
    foundation: { completed: number; averageScore: number };
    higher: { completed: number; averageScore: number };
  };
  languageBreakdown: {
    [language: string]: { completed: number; averageScore: number };
  };
  recentResults: AssessmentResult[];
  topPerformers: StudentPerformance[];
  strugglingStudents: StudentPerformance[];
}

interface AssessmentResult {
  id: string;
  studentName: string;
  assessmentTitle: string;
  score: number;
  timeSpent: number;
  completedAt: string;
  passed: boolean;
  language: string;
  difficulty: string;
}

interface StudentPerformance {
  studentId: string;
  studentName: string;
  assessmentsCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  passRate: number;
}

export default function ReadingComprehensionAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ReadingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30'); // days
  const [selectedClass, setSelectedClass] = useState('all');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
      loadClasses();
    }
  }, [user, selectedTimeframe, selectedClass]);

  const loadClasses = async () => {
    try {
      const response = await fetch(`/api/teacher/classes?teacherId=${user?.id}`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        teacherId: user?.id || '',
        timeframe: selectedTimeframe,
        classId: selectedClass
      });

      const response = await fetch(`/api/teacher/analytics/reading-comprehension?${params}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Reading Data Available</h2>
        <p className="text-gray-500">Students haven't completed any reading assessments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reading Comprehension Analytics</h1>
          <p className="text-gray-600 mt-1">Track student progress in reading assessments</p>
        </div>
        
        <div className="flex space-x-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAssessments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Time</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageTimeSpent / 60)}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.passRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Difficulty</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="font-medium">Foundation</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{analytics.difficultyBreakdown.foundation.averageScore}%</div>
                <div className="text-sm text-gray-500">{analytics.difficultyBreakdown.foundation.completed} completed</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${analytics.difficultyBreakdown.foundation.averageScore}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="font-medium">Higher</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{analytics.difficultyBreakdown.higher.averageScore}%</div>
                <div className="text-sm text-gray-500">{analytics.difficultyBreakdown.higher.completed} completed</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${analytics.difficultyBreakdown.higher.averageScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Language</h3>
          <div className="space-y-4">
            {Object.entries(analytics.languageBreakdown).map(([language, data], index) => {
              const colors = ['bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
              const color = colors[index % colors.length];
              
              return (
                <div key={language}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 ${color} rounded mr-3`}></div>
                      <span className="font-medium capitalize">{language}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{data.averageScore}%</div>
                      <div className="text-sm text-gray-500">{data.completed} completed</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`${color} h-2 rounded-full`} 
                      style={{ width: `${data.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {analytics.topPerformers.map((student, index) => (
              <div key={student.studentId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{student.studentName}</div>
                    <div className="text-sm text-gray-500">{student.assessmentsCompleted} assessments</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{student.averageScore}%</div>
                  <div className="text-sm text-gray-500">{student.passRate}% pass rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Struggling Students */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold">Students Needing Support</h3>
          </div>
          <div className="space-y-3">
            {analytics.strugglingStudents.map((student) => (
              <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                  <div>
                    <div className="font-medium">{student.studentName}</div>
                    <div className="text-sm text-gray-500">{student.assessmentsCompleted} assessments</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-600">{student.averageScore}%</div>
                  <div className="text-sm text-gray-500">{student.passRate}% pass rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Assessment Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.recentResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{result.assessmentTitle}</div>
                    <div className="text-xs text-gray-400">{result.language} • {result.difficulty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-semibold ${result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {result.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round(result.timeSpent / 60)}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.passed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.passed ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Passed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Failed
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
