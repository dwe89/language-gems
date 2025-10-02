'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Target, TrendingUp, AlertCircle } from 'lucide-react';
import type { AssignmentAnalysisData, TimeRange } from '@/types/teacherAnalytics';

interface AssignmentAnalysisProps {
  assignmentId: string;
  onBack: () => void;
}

export function AssignmentAnalysis({ assignmentId, onBack }: AssignmentAnalysisProps) {
  const [data, setData] = useState<any | null>(null); // Using any for backward compatibility fields
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('last_30_days');

  useEffect(() => {
    fetchData();
  }, [assignmentId, timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/teacher-analytics/assignment-analysis?assignmentId=${assignmentId}&timeRange=${timeRange}`
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching assignment analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading assignment analysis...</div>
      </div>
    );
  }

  if (!data) {
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
            Back to Class Summary
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{data.assignmentName}</h1>
            <p className="text-sm text-gray-600">
              {data.totalStudents} students • {data.completedCount} completed
            </p>
          </div>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="current_term">Current Term</option>
          <option value="all_time">All Time</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {data.completedCount} of {data.totalStudents} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageScore}%</div>
            <p className="text-xs text-gray-500 mt-1">Across all completed attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageTimeMinutes}m</div>
            <p className="text-xs text-gray-500 mt-1">Per completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Struggling Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.strugglingStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Score below 60%</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Breakdown - Only shown for quiz-style assignments */}
      {data.questionBreakdown && data.questionBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Question-by-Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.questionBreakdown.map((question: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium">Question {question.questionNumber}</div>
                      <div className="text-sm text-gray-600 mt-1">{question.questionText}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${
                        question.successRate >= 75 ? 'text-green-600' :
                        question.successRate >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {question.successRate}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {question.correctCount}/{question.totalAttempts} correct
                      </div>
                    </div>
                  </div>

                  {/* Distractor Analysis */}
                  {question.distractorAnalysis && question.distractorAnalysis.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm font-medium mb-2">Common Wrong Answers:</div>
                      <div className="space-y-1">
                        {question.distractorAnalysis.map((distractor: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{distractor.answer}</span>
                            <span className="text-gray-500">
                              {distractor.count} students ({distractor.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Distribution */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Avg: {question.averageTimeSeconds}s</span>
                      </div>
                      <div className="text-gray-400">|</div>
                      <div className="text-gray-600">
                        Range: {question.minTimeSeconds}s - {question.maxTimeSeconds}s
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Performance List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.studentPerformance.map((student: any) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{student.studentName}</div>
                    <div className="text-sm text-gray-500">
                      {student.status === 'completed' ? 'Completed' : 
                       student.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {student.score !== null && (
                    <div className={`text-lg font-bold ${
                      student.score >= 75 ? 'text-green-600' :
                      student.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.score}%
                    </div>
                  )}
                  {student.timeSpentMinutes !== null && (
                    <div className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {student.timeSpentMinutes}m
                    </div>
                  )}
                  {student.attempts > 1 && (
                    <div className="text-sm text-gray-500">
                      {student.attempts} attempts
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

