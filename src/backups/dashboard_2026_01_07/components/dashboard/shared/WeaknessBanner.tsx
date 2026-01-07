'use client';

// =====================================================
// WEAKNESS BANNER COMPONENT - Class Weakness Banner
// =====================================================

import React from 'react';
import { AlertCircle, Users, Target } from 'lucide-react';
import type { ClassWeakness } from '@/types/teacherAnalytics';

interface WeaknessBannerProps {
  weakness: ClassWeakness;
  onAssignPractice?: () => void;
}

export function WeaknessBanner({ weakness, onAssignPractice }: WeaknessBannerProps) {
  return (
    <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-red-100 rounded-lg">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-900 mb-1">
            Top Class Weakness: {weakness.skillName}
          </h3>
          <p className="text-sm text-red-700">{weakness.commonError}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-gray-600">
              Students Affected
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {weakness.studentsAffected}
            <span className="text-sm text-gray-600">
              /{weakness.totalStudents}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-gray-600">
              Failure Rate
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {weakness.failureRate}%
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-gray-600">
              Recent Tests
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {weakness.recentOccurrences}
          </p>
        </div>
      </div>

      {/* Action Button */}
      {onAssignPractice && (
        <button
          onClick={onAssignPractice}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5" />
          Assign Targeted Practice
        </button>
      )}
    </div>
  );
}

