'use client';

// =====================================================
// METRIC CARD COMPONENT - Large Number Card
// =====================================================

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TrendDirection } from '@/types/teacherAnalytics';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: {
    direction: TrendDirection;
    percentage: number;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  icon,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === 'up')
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend.direction === 'down')
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.direction === 'up') return 'text-green-600';
    if (trend.direction === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div
      className={`border-2 rounded-lg p-6 ${colorClasses[color]}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {icon && <div className="text-gray-600">{icon}</div>}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-lg text-gray-600">{unit}</span>}
      </div>

      {/* Trend */}
      {trend && (
        <div className="mt-3 flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend.percentage}%
          </span>
          <span className="text-sm text-gray-600">vs last period</span>
        </div>
      )}
    </div>
  );
}

