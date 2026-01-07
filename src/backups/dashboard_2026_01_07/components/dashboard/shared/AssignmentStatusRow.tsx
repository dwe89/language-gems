'use client';

// =====================================================
// ASSIGNMENT STATUS ROW COMPONENT
// =====================================================

import React from 'react';
import { CheckCircle, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { RecentAssignment } from '@/types/teacherAnalytics';

interface AssignmentStatusRowProps {
  assignment: RecentAssignment;
  onClick?: () => void;
}

export function AssignmentStatusRow({ assignment, onClick }: AssignmentStatusRowProps) {
  const statusConfig = {
    complete: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Complete',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'In Progress',
    },
    overdue: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Overdue',
    },
  };

  const efficacyConfig = {
    high: {
      icon: TrendingUp,
      color: 'text-green-600',
      label: 'High Efficacy',
    },
    medium: {
      icon: Minus,
      color: 'text-yellow-600',
      label: 'Medium Efficacy',
    },
    low: {
      icon: TrendingDown,
      color: 'text-red-600',
      label: 'Low Efficacy',
    },
  };

  const config = statusConfig[assignment.status];
  const efficacy = efficacyConfig[assignment.efficacy];
  const StatusIcon = config.icon;
  const EfficacyIcon = efficacy.icon;

  // Traffic light color for score
  const getScoreColor = () => {
    if (assignment.averageScore >= 75) return 'text-green-600 bg-green-50';
    if (assignment.averageScore >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div
      className={`border-2 ${config.borderColor} ${config.bgColor} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {/* Left: Assignment Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <StatusIcon className={`w-5 h-5 ${config.color}`} />
            <h3 className="font-semibold text-gray-900">
              {assignment.assignmentName}
            </h3>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${config.color} ${config.bgColor} border ${config.borderColor}`}
            >
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>
              Completed: {assignment.completedCount}/{assignment.totalStudents}
            </span>
            {assignment.dueDate && (
              <span>
                Due:{' '}
                {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        {/* Right: Score & Efficacy */}
        <div className="flex items-center gap-4">
          {/* Average Score */}
          <div className="text-center">
            <div
              className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor()}`}
            >
              {assignment.averageScore}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Avg Score</p>
          </div>

          {/* Efficacy */}
          <div className="flex items-center gap-2">
            <EfficacyIcon className={`w-5 h-5 ${efficacy.color}`} />
            <span className={`text-sm font-medium ${efficacy.color}`}>
              {efficacy.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

