'use client';

// =====================================================
// CLASS SUMMARY DASHBOARD (TIER 1)
// =====================================================

import React, { useState, useEffect } from 'react';
import { Users, Target, TrendingUp, Calendar, RefreshCw, Filter, AlertTriangle, UserX } from 'lucide-react';
import { MetricCard } from './shared/MetricCard';
import { RiskCard } from './shared/RiskCard';
import { WeaknessBanner } from './shared/WeaknessBanner';
import { AssignmentStatusRow } from './shared/AssignmentStatusRow';
import type { ClassSummaryData, TimeRange } from '@/types/teacherAnalytics';

interface ClassSummaryDashboardProps {
  teacherId: string;
  classId?: string;
  viewScope?: 'my' | 'school';
  schoolCode?: string;
  onStudentClick?: (studentId: string) => void;
  onAssignmentClick?: (assignmentId: string) => void;
}

export function ClassSummaryDashboard({
  teacherId,
  classId,
  viewScope = 'my',
  schoolCode,
  onStudentClick,
  onAssignmentClick,
}: ClassSummaryDashboardProps) {
  const [data, setData] = useState<ClassSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('all_time');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [teacherId, classId, timeRange, viewScope, schoolCode]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        teacherId,
        timeRange,
        viewScope,
      });

      if (classId) {
        params.append('classId', classId);
      }

      if (schoolCode && viewScope === 'school') {
        params.append('schoolCode', schoolCode);
      }

      const response = await fetch(
        `/api/teacher-analytics/class-summary?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to load class summary');
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error loading class summary:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-semibold">Error: {error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-600 py-12">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Intelligence Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            60-second health check for your class
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="current_term">Current Term</option>
            <option value="all_time">All Time</option>
          </select>
          <button
            onClick={loadData}
            className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Class Average"
          value={data.topMetrics.averageScore}
          unit="%"
          trend={{
            direction: data.topMetrics.trendDirection,
            percentage: data.topMetrics.trendPercentage,
          }}
          icon={<Target className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Assignments Overdue"
          value={data.topMetrics.assignmentsOverdue}
          icon={<Calendar className="w-6 h-6" />}
          color={data.topMetrics.assignmentsOverdue > 0 ? 'red' : 'green'}
        />
        <MetricCard
          title="Current Streak"
          value={data.topMetrics.currentStreak}
          unit="days"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Active Students"
          value={data.topMetrics.activeStudents || 0}
          unit={`/${data.topMetrics.totalStudents || 0}`}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Critical Alert: Students Never Logged In */}
      {data.studentsNeverLoggedIn && data.studentsNeverLoggedIn.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <UserX className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                CRITICAL: {data.studentsNeverLoggedIn.length} Student{data.studentsNeverLoggedIn.length !== 1 ? 's' : ''} Never Logged In
              </h2>
              <p className="text-red-800 mb-4">
                These students have not completed any learning activities {timeRange === 'all_time' ? 'yet' : timeRange === 'last_7_days' ? 'in the last 7 days' : timeRange === 'last_30_days' ? 'in the last 30 days' : 'this term'}.
                They may need login credentials or technical support.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // TODO: Navigate to a page showing all students who never logged in
                    alert(`Students who never logged in:\n\n${data.studentsNeverLoggedIn.map(s => s.studentName).join('\n')}`);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  View All {data.studentsNeverLoggedIn.length} Students
                </button>
                <span className="text-sm text-red-700">
                  First 5: {data.studentsNeverLoggedIn.slice(0, 5).map(s => s.studentName).join(', ')}
                  {data.studentsNeverLoggedIn.length > 5 && ` +${data.studentsNeverLoggedIn.length - 5} more`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Interventions - Active Students At Risk */}
      {data.urgentInterventions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🚨 Urgent Interventions (Top 5 At-Risk Students)
          </h2>
          <p className="text-gray-600 mb-4">
            Students who ARE engaging but struggling with low accuracy or declining performance
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.urgentInterventions.map((student) => (
              <RiskCard
                key={student.studentId}
                student={student}
                onClick={() => onStudentClick?.(student.studentId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Class Weakness */}
      {data.topClassWeakness && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎯 Top Class Weakness
          </h2>
          <WeaknessBanner
            weakness={data.topClassWeakness}
            onAssignPractice={() => {
              console.log('Assign practice for:', data.topClassWeakness?.skillName);
            }}
          />
        </div>
      )}

      {/* Recent Assignments */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📝 Recent Assignments
        </h2>
        <div className="space-y-3">
          {data.recentAssignments.map((assignment) => (
            <AssignmentStatusRow
              key={assignment.assignmentId}
              assignment={assignment}
              onClick={() => onAssignmentClick?.(assignment.assignmentId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

