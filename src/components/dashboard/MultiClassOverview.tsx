'use client';

// =====================================================
// MULTI-CLASS OVERVIEW DASHBOARD
// =====================================================

import React, { useState, useEffect } from 'react';
import { Users, Target, TrendingUp, AlertCircle, RefreshCw, ChevronRight, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { MetricCard } from './shared/MetricCard';

interface ClassHealthMetrics {
  classId: string;
  className: string;
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  completionRate: number;
  studentsNeverLoggedIn: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface MultiClassData {
  totalStudents: number;
  totalActiveStudents: number;
  overallAverageScore: number;
  overallCompletionRate: number;
  totalStudentsNeverLoggedIn: number;
  totalClassesWithIssues: number;
  classes: ClassHealthMetrics[];
}

interface MultiClassOverviewProps {
  teacherId: string;
  viewScope?: 'my' | 'school';
  schoolCode?: string;
  onClassClick?: (classId: string) => void;
}

export function MultiClassOverview({
  teacherId,
  viewScope = 'my',
  schoolCode,
  onClassClick,
}: MultiClassOverviewProps) {
  const [data, setData] = useState<MultiClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [teacherId, viewScope, schoolCode]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        teacherId,
        viewScope,
      });

      if (schoolCode && viewScope === 'school') {
        params.append('schoolCode', schoolCode);
      }

      const response = await fetch(
        `/api/teacher-analytics/multi-class-overview?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to load multi-class overview');
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error loading multi-class overview:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600">Loading overview...</span>
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
          <h2 className="text-xl font-semibold text-gray-900">
            All Classes Overview
          </h2>
          <p className="text-gray-500 text-sm">
            Aggregate metrics across {data.classes.length} class{data.classes.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Top Aggregate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Students"
          value={data.totalStudents}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Active Students"
          value={data.totalActiveStudents}
          unit={`/${data.totalStudents}`}
          icon={<Activity className="w-6 h-6" />}
          color={data.totalActiveStudents > data.totalStudents * 0.7 ? 'green' : 'orange'}
        />
        <MetricCard
          title="Overall Avg Score"
          value={data.overallAverageScore}
          unit="%"
          icon={<Target className="w-6 h-6" />}
          color={data.overallAverageScore >= 70 ? 'green' : data.overallAverageScore >= 50 ? 'orange' : 'red'}
        />
        <MetricCard
          title="Completion Rate"
          value={data.overallCompletionRate}
          unit="%"
          icon={<CheckCircle className="w-6 h-6" />}
          color={data.overallCompletionRate >= 70 ? 'green' : data.overallCompletionRate >= 50 ? 'orange' : 'red'}
        />
      </div>

      {/* Critical Alerts */}
      {(data.totalStudentsNeverLoggedIn > 0 || data.totalClassesWithIssues > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.totalStudentsNeverLoggedIn > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    {data.totalStudentsNeverLoggedIn} Students Never Logged In
                  </h3>
                  <p className="text-sm text-red-700">
                    These students across all classes need login credentials or support
                  </p>
                </div>
              </div>
            </div>
          )}
          {data.totalClassesWithIssues > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    {data.totalClassesWithIssues} Classes Need Attention
                  </h3>
                  <p className="text-sm text-yellow-700">
                    These classes have low engagement or completion rates
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Classes List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Classes at a Glance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.classes
            .sort((a, b) => {
              // Sort by status (critical, warning, healthy)
              const statusOrder = { critical: 0, warning: 1, healthy: 2 };
              return statusOrder[a.status] - statusOrder[b.status];
            })
            .map((classData) => (
              <ClassHealthCard
                key={classData.classId}
                classData={classData}
                onClick={() => onClassClick?.(classData.classId)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for individual class health cards
function ClassHealthCard({
  classData,
  onClick,
}: {
  classData: ClassHealthMetrics;
  onClick?: () => void;
}) {
  const statusConfig = {
    healthy: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      label: 'Healthy',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      label: 'Needs Attention',
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      label: 'Critical',
    },
  };

  const config = statusConfig[classData.status];

  return (
    <button
      onClick={onClick}
      className={`w-full ${config.bg} border-2 ${config.border} rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left group h-full flex flex-col`}
    >
      <div className="w-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/60`}>
              {config.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {classData.className}
              </h3>
              <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs font-semibold ${config.text} bg-white/50 border ${config.border}`}>
                {config.label}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/40 p-2 rounded-lg">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">Students</p>
            <p className="font-bold text-gray-900 text-lg">
              {classData.activeStudents}<span className="text-gray-400 text-sm font-normal">/{classData.totalStudents}</span>
            </p>
          </div>
          <div className="bg-white/40 p-2 rounded-lg">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">Avg Score</p>
            <p className="font-bold text-gray-900 text-lg">{classData.averageScore}%</p>
          </div>
          <div className="bg-white/40 p-2 rounded-lg">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">Completion</p>
            <p className="font-bold text-gray-900 text-lg">{classData.completionRate}%</p>
          </div>
          {classData.studentsNeverLoggedIn > 0 ? (
            <div className="bg-red-100/50 p-2 rounded-lg border border-red-100">
              <p className="text-red-600 text-xs font-medium uppercase tracking-wider mb-0.5">No Login</p>
              <p className="font-bold text-red-700 text-lg">{classData.studentsNeverLoggedIn}</p>
            </div>
          ) : (
            <div className="bg-white/40 p-2 rounded-lg opacity-50">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">Issues</p>
              <p className="font-bold text-gray-400 text-lg">-</p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
