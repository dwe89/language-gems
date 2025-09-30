'use client';

// =====================================================
// PROGRESS BAR COMPONENT - Horizontal Progress Bar
// =====================================================

import React from 'react';
import type { RiskLevel } from '@/types/teacherAnalytics';

interface ProgressBarProps {
  label: string;
  percentage: number;
  current: number;
  total: number;
  classAverage?: number;
  riskLevel?: RiskLevel;
  showClassAverage?: boolean;
}

export function ProgressBar({
  label,
  percentage,
  current,
  total,
  classAverage,
  riskLevel,
  showClassAverage = true,
}: ProgressBarProps) {
  const getRiskColor = () => {
    if (!riskLevel) {
      if (percentage >= 75) return 'bg-green-500';
      if (percentage >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    }

    switch (riskLevel) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  const getRiskIcon = () => {
    if (percentage >= 75) return '✅';
    if (percentage >= 60) return '⚠️';
    return '🔴';
  };

  return (
    <div className="space-y-2">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-3">
          {showClassAverage && classAverage !== undefined && (
            <span className="text-xs text-gray-500">
              Class Avg: {classAverage}%
            </span>
          )}
          <span className="text-sm font-bold text-gray-900">
            {percentage}% {getRiskIcon()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getRiskColor()} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Class Average Marker */}
        {showClassAverage && classAverage !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-700"
            style={{ left: `${Math.min(classAverage, 100)}%` }}
            title={`Class Average: ${classAverage}%`}
          />
        )}
      </div>

      {/* Count */}
      <div className="text-xs text-gray-500">
        {current} / {total} items mastered
      </div>
    </div>
  );
}

