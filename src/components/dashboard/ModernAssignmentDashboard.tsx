'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Download, Users, CheckCircle, Clock, TrendingUp,
  AlertTriangle, Award, Target, BarChart3, ChevronDown, ChevronUp,
  XCircle, Sparkles, BookOpen, Brain, AlertCircle, Eye
} from 'lucide-react';
import type { AssignmentOverviewMetrics, WordDifficulty, StudentProgress } from '@/services/teacherAssignmentAnalytics';
import { AssessmentResultsDetailView } from './AssessmentResultsDetailView';
import GrammarAssignmentAnalyticsDashboard from '@/components/teacher/GrammarAssignmentAnalyticsDashboard';

interface ModernAssignmentDashboardProps {
  assignmentId: string;
  onBack: () => void;
}

export function ModernAssignmentDashboard({ assignmentId, onBack }: ModernAssignmentDashboardProps) {
  const [overview, setOverview] = useState<AssignmentOverviewMetrics | null>(null);
  const [wordDifficulty, setWordDifficulty] = useState<WordDifficulty[]>([]);
  const [studentRoster, setStudentRoster] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'words' | 'students' | 'grammar'>('overview');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'time' | 'accuracy'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewingStudentDetails, setViewingStudentDetails] = useState<{ studentId: string; studentName: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard/assignment-analytics/${assignmentId}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed with status ${response.status}`);
      }

      const {
        overview: overviewData,
        words: wordsData,
        students: studentsData
      }: {
        overview: AssignmentOverviewMetrics;
        words: WordDifficulty[];
        students: StudentProgress[];
      } = await response.json();

      setOverview(overviewData);
      setWordDifficulty(wordsData);
      setStudentRoster(studentsData);
    } catch (error) {
      console.error('❌ Error fetching assignment analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (type: 'students' | 'words') => {
    if (type === 'students') {
      const headers = ['Student Name', 'Status', 'Success Score', 'Failure Rate', 'Time Spent (min)', 'Intervention'];
      const rows = studentRoster.map(s => [
        s.studentName,
        s.status,
        s.successScore,
        s.failureRate,
        s.timeSpentMinutes,
        s.interventionFlag || 'None'
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadCSV(csv, `${overview?.assignmentTitle}_students.csv`);
    } else {
      const headers = ['Word', 'Translation', 'Attempts', 'Failure Rate', 'Insight'];
      const rows = wordDifficulty.map(w => [
        w.wordText,
        w.translationText,
        w.totalAttempts,
        w.failureRate,
        w.actionableInsight
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadCSV(csv, `${overview?.assignmentTitle}_vocabulary.csv`);
    }
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sortedStudents = [...studentRoster].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.studentName.localeCompare(b.studentName);
        break;
      case 'score':
        comparison = a.successScore - b.successScore;
        break;
      case 'time':
        comparison = a.timeSpentMinutes - b.timeSpentMinutes;
        break;
      case 'accuracy':
        comparison = a.failureRate - b.failureRate;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      not_started: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return styles[status as keyof typeof styles] || styles.not_started;
  };

  const getInterventionBadge = (flag: StudentProgress['interventionFlag']) => {
    if (!flag) return null;

    const badges = {
      high_failure: { icon: AlertTriangle, text: 'High Failure', color: 'bg-red-100 text-red-800 border-red-200' },
      unusually_long: { icon: Clock, text: 'Taking Too Long', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      stopped_midway: { icon: XCircle, text: 'Stopped Midway', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    };

    const badge = badges[flag];
    if (!badge) return null;

    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${badge.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <p className="font-semibold">Failed to load analytics data</p>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = overview.totalStudents > 0
    ? Math.round((overview.completedStudents / overview.totalStudents) * 100)
    : 0;

  const engagementRate = overview.totalStudents > 0
    ? Math.round(((overview.completedStudents + overview.inProgressStudents) / overview.totalStudents) * 100)
    : 0;

  // If viewing detailed results for a specific student in an assessment, show that view
  if (viewingStudentDetails) {
    return (
      <AssessmentResultsDetailView
        assignmentId={assignmentId}
        studentId={viewingStudentDetails.studentId}
        studentName={viewingStudentDetails.studentName}
        onBack={() => {
          setViewingStudentDetails(null);
          // Refresh data when returning from detail view
          fetchData();
        }}
        viewMode="teacher"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="rounded-xl border-2 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{overview.assignmentTitle}</h1>
              <p className="text-slate-600 mt-1">{overview.className}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => exportToCSV('students')}
              variant="outline"
              className="rounded-xl border-2 hover:bg-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Students
            </Button>
            <Button
              onClick={() => exportToCSV('words')}
              variant="outline"
              className="rounded-xl border-2 hover:bg-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Vocabulary
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Completion Rate */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{completionPercentage}%</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Completion Rate</h3>
              <p className="text-xs text-slate-500">
                {overview.completedStudents} of {overview.totalStudents} students
              </p>
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{engagementRate}%</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Engagement Rate</h3>
              <p className="text-xs text-slate-500">
                {overview.inProgressStudents + overview.completedStudents} students active
              </p>
            </CardContent>
          </Card>

          {/* Class Success Score */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{overview.classSuccessScore}%</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Success Score</h3>
              <p className="text-xs text-slate-500">
                Class-wide accuracy
              </p>
            </CardContent>
          </Card>

          {/* Students Needing Help */}
          <Card className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{overview.studentsNeedingHelp}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Need Intervention</h3>
              <p className="text-xs text-slate-500">
                Students struggling
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Student Performance
            </button>
            {overview?.isSkillsAssignment && (
              <button
                onClick={() => setActiveTab('grammar')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'grammar'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                <Award className="h-4 w-4 inline mr-2" />
                Grammar Skills
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress Breakdown */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Target className="h-5 w-5 mr-2 text-indigo-600" />
                  Progress Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                    <div className="text-4xl font-bold text-green-700 mb-2">{overview.completedStudents}</div>
                    <div className="text-sm font-medium text-green-600">Completed</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="text-4xl font-bold text-blue-700 mb-2">{overview.inProgressStudents}</div>
                    <div className="text-sm font-medium text-blue-600">In Progress</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="text-4xl font-bold text-gray-700 mb-2">{overview.notStartedStudents}</div>
                    <div className="text-sm font-medium text-gray-600">Not Started</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                  Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                    <div className="text-sm font-medium text-purple-600 mb-2">Average Time Spent</div>
                    <div className="text-3xl font-bold text-purple-900">
                      {overview.averageTimeMinutes > 0 ? `${overview.averageTimeMinutes}m` : 'No data yet'}
                    </div>
                    <div className="text-xs text-purple-600 mt-2">
                      ⚠️ Time tracking currently unavailable
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <div className="text-sm font-medium text-blue-600 mb-2">Expected Time</div>
                    <div className="text-3xl font-bold text-blue-900">{overview.expectedTimeMinutes}m</div>
                    <div className="text-xs text-blue-600 mt-2">
                      Based on assignment length
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Struggling Words */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Brain className="h-5 w-5 mr-2 text-indigo-600" />
                  Top 10 Most Difficult Words
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wordDifficulty.slice(0, 10).map((word, index) => (
                    <div key={word.rank} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index < 3 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{word.wordText}</div>
                          <div className="text-sm text-slate-600">{word.translationText}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-600">Failure Rate</div>
                          <div className={`text-lg font-bold ${word.failureRate >= 70 ? 'text-red-600' :
                            word.failureRate >= 50 ? 'text-orange-600' :
                              word.failureRate >= 30 ? 'text-yellow-600' :
                                'text-green-600'
                            }`}>
                            {word.failureRate}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-600">Attempts</div>
                          <div className="text-lg font-bold text-slate-900">{word.totalAttempts}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'students' && (
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Student Performance ({studentRoster.length} students)
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="score">Success Score</option>
                    <option value="name">Name</option>
                    <option value="time">Time Spent</option>
                    <option value="accuracy">Failure Rate</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Student</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Success Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Failure Rate</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Time Spent</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Intervention</th>
                      {overview?.isAssessmentAssignment && (
                        <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((student, index) => (
                      <tr key={student.studentId} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}>
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-900">{student.studentName}</div>
                          {student.keyStruggleWords.length > 0 && (
                            <div className="text-xs text-slate-500 mt-1">
                              Struggling: {student.keyStruggleWords.slice(0, 2).join(', ')}
                              {student.keyStruggleWords.length > 2 && ` +${student.keyStruggleWords.length - 2} more`}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(student.status)}`}>
                            {student.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className={`text-lg font-bold ${student.successScore >= 75 ? 'text-green-600' :
                            student.successScore >= 60 ? 'text-yellow-600' :
                              student.successScore >= 40 ? 'text-orange-600' :
                                'text-red-600'
                            }`}>
                            {student.successScore}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className={`text-lg font-bold ${student.failureRate >= 70 ? 'text-red-600' :
                            student.failureRate >= 50 ? 'text-orange-600' :
                              student.failureRate >= 30 ? 'text-yellow-600' :
                                'text-green-600'
                            }`}>
                            {student.failureRate}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="text-sm font-medium text-slate-700">
                            {student.timeSpentMinutes > 0 ? `${student.timeSpentMinutes}m` : 'No data'}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {getInterventionBadge(student.interventionFlag)}
                        </td>
                        {overview?.isAssessmentAssignment && (
                          <td className="py-4 px-4 text-center">
                            {student.status !== 'not_started' && (
                              <Button
                                onClick={() => setViewingStudentDetails({
                                  studentId: student.studentId,
                                  studentName: student.studentName
                                })}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'words' && (
          <div className="space-y-6">
            {/* Tier 1: High Confidence Problems */}
            {wordDifficulty.filter(w => w.totalAttempts >= 5).length > 0 && (
              <Card className="border-2 border-red-300 shadow-lg">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center text-xl">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    High Confidence Problems ({wordDifficulty.filter(w => w.totalAttempts >= 5).length} words, ≥5 attempts)
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-2">
                    These words have enough data to confidently identify as problematic. Sorted by failure rate, then by number of attempts.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {wordDifficulty.filter(w => w.totalAttempts >= 5).map((word) => (
                      <div key={word.rank} className={`p-4 rounded-lg border-2 ${word.insightLevel === 'problem' ? 'bg-red-50 border-red-200' :
                        word.insightLevel === 'review' ? 'bg-yellow-50 border-yellow-200' :
                          word.insightLevel === 'monitor' ? 'bg-blue-50 border-blue-200' :
                            'bg-green-50 border-green-200'
                        }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${word.insightLevel === 'problem' ? 'bg-red-200 text-red-800' :
                              word.insightLevel === 'review' ? 'bg-yellow-200 text-yellow-800' :
                                word.insightLevel === 'monitor' ? 'bg-blue-200 text-blue-800' :
                                  'bg-green-200 text-green-800'
                              }`}>
                              {word.rank}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900 text-lg">{word.wordText}</div>
                              <div className="text-sm text-slate-600">{word.translationText}</div>
                              <div className="text-xs text-slate-500 mt-1">{word.actionableInsight}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Attempts</div>
                              <div className="text-xl font-bold text-slate-900">{word.totalAttempts}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Failures</div>
                              <div className="text-xl font-bold text-red-600">{word.failureCount}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Failure Rate</div>
                              <div className={`text-2xl font-bold ${word.failureRate >= 70 ? 'text-red-600' :
                                word.failureRate >= 50 ? 'text-orange-600' :
                                  word.failureRate >= 30 ? 'text-yellow-600' :
                                    'text-green-600'
                                }`}>
                                {word.failureRate}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tier 2: Emerging Problems */}
            {wordDifficulty.filter(w => w.totalAttempts < 5 && w.failureRate >= 50).length > 0 && (
              <Card className="border-2 border-yellow-300 shadow-lg">
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="flex items-center text-xl">
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                    Emerging Problems ({wordDifficulty.filter(w => w.totalAttempts < 5 && w.failureRate >= 50).length} words, {'<'}5 attempts, ≥50% failure)
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-2">
                    Limited data, but showing high failure rates. Sorted by number of attempts (more attempts = more reliable), then by failure rate.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {wordDifficulty.filter(w => w.totalAttempts < 5 && w.failureRate >= 50).map((word) => (
                      <div key={word.rank} className="p-4 rounded-lg border-2 bg-yellow-50 border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold bg-yellow-200 text-yellow-800">
                              {word.rank}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900 text-lg">{word.wordText}</div>
                              <div className="text-sm text-slate-600">{word.translationText}</div>
                              <div className="text-xs text-slate-500 mt-1">{word.actionableInsight}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Attempts</div>
                              <div className="text-xl font-bold text-slate-900">{word.totalAttempts}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Failures</div>
                              <div className="text-xl font-bold text-red-600">{word.failureCount}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Failure Rate</div>
                              <div className="text-2xl font-bold text-orange-600">
                                {word.failureRate}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tier 3: Low Priority / Insufficient Data */}
            {wordDifficulty.filter(w => w.totalAttempts < 5 && w.failureRate < 50).length > 0 && (
              <Card className="border-2 border-slate-200 shadow-lg">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="flex items-center text-xl">
                    <BookOpen className="h-5 w-5 mr-2 text-slate-600" />
                    Insufficient Data ({wordDifficulty.filter(w => w.totalAttempts < 5 && w.failureRate < 50).length} words, {'<'}5 attempts, {'<'}50% failure)
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-2">
                    Not enough attempts to draw conclusions. Monitor as more data comes in.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {wordDifficulty.filter(w => w.totalAttempts < 5 && w.failureRate < 50).map((word) => (
                      <div key={word.rank} className="p-4 rounded-lg border-2 bg-slate-50 border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold bg-slate-200 text-slate-700">
                              {word.rank}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900 text-lg">{word.wordText}</div>
                              <div className="text-sm text-slate-600">{word.translationText}</div>
                              <div className="text-xs text-slate-500 mt-1">{word.actionableInsight}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Attempts</div>
                              <div className="text-xl font-bold text-slate-900">{word.totalAttempts}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Failures</div>
                              <div className="text-xl font-bold text-red-600">{word.failureCount}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium text-slate-600">Failure Rate</div>
                              <div className="text-2xl font-bold text-slate-600">
                                {word.failureRate}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'grammar' && (
          <GrammarAssignmentAnalyticsDashboard
            assignmentId={assignmentId}
            assignmentTitle={overview?.assignmentTitle}
            teacherId="" // Not needed for now
          />
        )}
      </div>
    </div>
  );
}

