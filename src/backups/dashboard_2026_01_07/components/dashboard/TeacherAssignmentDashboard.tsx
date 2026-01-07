'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Clock, Target, TrendingUp, AlertCircle, Users, CheckCircle, 
  XCircle, AlertTriangle, Download, ChevronDown, ChevronRight 
} from 'lucide-react';
import type { AssignmentOverviewMetrics, WordDifficulty, StudentProgress } from '@/services/teacherAssignmentAnalytics';

interface TeacherAssignmentDashboardProps {
  assignmentId: string;
  onBack: () => void;
}

export function TeacherAssignmentDashboard({ assignmentId, onBack }: TeacherAssignmentDashboardProps) {
  const [overview, setOverview] = useState<AssignmentOverviewMetrics | null>(null);
  const [wordDifficulty, setWordDifficulty] = useState<WordDifficulty[]>([]);
  const [studentRoster, setStudentRoster] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'words' | 'students'>('overview');
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const fetchData = async () => {
    setLoading(true);
    console.log('🔍 [DASHBOARD] Fetching data for assignment:', assignmentId);
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

      console.log('✅ [DASHBOARD] Data fetched successfully:', { overviewData, wordsData, studentsData });
      setOverview(overviewData);
      setWordDifficulty(wordsData);
      setStudentRoster(studentsData);
    } catch (error) {
      console.error('❌ [DASHBOARD] Error fetching assignment analytics:', error);
      console.error('❌ [DASHBOARD] Error details:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    // Simple CSV export
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const getInterventionIcon = (flag: StudentProgress['interventionFlag']) => {
    switch (flag) {
      case 'high_failure':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'unusually_long':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'stopped_midway':
        return <XCircle className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getInsightColor = (level: WordDifficulty['insightLevel']) => {
    switch (level) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'monitor':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'review':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'problem':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading assignment analytics...</div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Failed to load assignment data</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{overview.assignmentTitle}</h1>
            <p className="text-sm text-gray-600">
              {overview.className} • {overview.totalStudents} students
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assignment Overview
          </button>
          <button
            onClick={() => setActiveTab('words')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'words'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Word Mastery
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Student Roster
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards - The Triage Zone */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.completionRate}%</div>
                <p className="text-xs text-gray-500 mt-1">
                  {overview.completedStudents} of {overview.totalStudents} students
                </p>
                <div className="mt-2 text-xs text-gray-600">
                  <div>✅ {overview.completedStudents} Completed</div>
                  <div>⚠️ {overview.inProgressStudents} In Progress</div>
                  <div>❌ {overview.notStartedStudents} Not Started</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Time Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.averageTimeMinutes}m</div>
                <p className="text-xs text-gray-500 mt-1">
                  Expected: {overview.expectedTimeMinutes}m
                </p>
                <p className="text-xs mt-2 font-medium">
                  {overview.averageTimeMinutes > overview.expectedTimeMinutes * 1.5 ? (
                    <span className="text-red-600">⚠️ Too difficult</span>
                  ) : overview.averageTimeMinutes < overview.expectedTimeMinutes * 0.5 ? (
                    <span className="text-yellow-600">⚡ Too easy</span>
                  ) : (
                    <span className="text-green-600">✅ Just right</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Class Success Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  overview.classSuccessScore >= 75 ? 'text-green-600' :
                  overview.classSuccessScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {overview.classSuccessScore}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Strong + Weak Retrieval
                </p>
                <p className="text-xs mt-2 font-medium">
                  {overview.classSuccessScore >= 75 ? (
                    <span className="text-green-600">🎯 Assignment landed well</span>
                  ) : overview.classSuccessScore >= 60 ? (
                    <span className="text-yellow-600">📚 Needs review</span>
                  ) : (
                    <span className="text-red-600">🛑 Major issues</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Students Needing Help</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  overview.studentsNeedingHelp > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {overview.studentsNeedingHelp}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Failure rate &gt; 30%
                </p>
                {overview.studentsNeedingHelp > 0 && (
                  <p className="text-xs mt-2 font-medium text-red-600">
                    🚨 Intervention required
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV([overview], `assignment-overview-${assignmentId}.csv`)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export to Sheets
            </Button>
          </div>
        </div>
      )}

      {/* Word Mastery Tab */}
      {activeTab === 'words' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Class Struggle Words (Ranked by Failure Rate)</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(wordDifficulty, `word-difficulty-${assignmentId}.csv`)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export to Sheets
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Word</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failure Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strong Retrieval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actionable Insight</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wordDifficulty.map((word) => (
                  <tr key={word.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.wordText}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{word.translationText}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        word.failureRate > 35 ? 'bg-red-100 text-red-800' :
                        word.failureRate > 25 ? 'bg-orange-100 text-orange-800' :
                        word.failureRate > 15 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {word.failureRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{word.strongRetrievalCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getInsightColor(word.insightLevel)}`}>
                        {word.actionableInsight}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Roster Tab */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Student Roster (Sorted by Intervention Priority)</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(studentRoster, `student-roster-${assignmentId}.csv`)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export to Sheets
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failure Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Struggle Words</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentRoster.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'completed' ? 'bg-green-100 text-green-800' :
                        student.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status === 'completed' ? '✅ Complete' :
                         student.status === 'in_progress' ? '⚠️ In Progress' :
                         '❌ Not Started'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.timeSpentMinutes}m</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        student.successScore >= 75 ? 'text-green-600' :
                        student.successScore >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {student.successScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        student.failureRate > 30 ? 'text-red-600' :
                        student.failureRate > 15 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {student.failureRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {student.keyStruggleWords.length > 0 ? student.keyStruggleWords.join(', ') : 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getInterventionIcon(student.interventionFlag)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

