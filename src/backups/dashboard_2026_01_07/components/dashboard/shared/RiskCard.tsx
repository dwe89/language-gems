'use client';

// =====================================================
// RISK CARD COMPONENT - Student At-Risk Card
// =====================================================

import React from 'react';
import { AlertTriangle, TrendingDown, Clock, BookOpen } from 'lucide-react';
import type { UrgentIntervention } from '@/types/teacherAnalytics';

interface RiskCardProps {
  student: UrgentIntervention;
  onClick?: () => void;
}

export function RiskCard({ student, onClick }: RiskCardProps) {
  const riskColors = {
    critical: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50',
  };

  const riskTextColors = {
    critical: 'text-red-700',
    high: 'text-orange-700',
    medium: 'text-yellow-700',
    low: 'text-green-700',
  };

  const riskBadgeColors = {
    critical: 'bg-red-600 text-white',
    high: 'bg-orange-600 text-white',
    medium: 'bg-yellow-600 text-white',
    low: 'bg-green-600 text-white',
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
        riskColors[student.riskLevel]
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{student.studentName}</h3>
          <p className="text-sm text-gray-600">
            Avg Score: {student.averageScore}%
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-bold uppercase ${
            riskBadgeColors[student.riskLevel]
          }`}
        >
          {student.riskLevel}
        </span>
      </div>

      {/* Risk Factors */}
      <div className="space-y-2">
        {student.riskFactors.slice(0, 3).map((factor, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 text-sm ${
              riskTextColors[student.riskLevel]
            }`}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{factor}</span>
          </div>
        ))}
      </div>

      {/* Last Active */}
      {student.lastActive && (
        <div className="mt-3 pt-3 border-t border-gray-300 flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>
            Last active:{' '}
            {new Date(student.lastActive).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      )}
    </div>
  );
}

