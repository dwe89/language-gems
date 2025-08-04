'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Calendar, Clock, Target, Zap,
  BarChart3, LineChart, PieChart, Activity, Award, Star,
  ChevronLeft, ChevronRight, Filter, Download, Share2
} from 'lucide-react';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface ProgressVisualizationProps {
  data: {
    progressTrends: Array<{
      date: string;
      xpEarned: number;
      accuracy: number;
      timeSpent: number;
      assignmentsCompleted: number;
      gamesPlayed: number;
    }>;
    gamePerformance: Array<{
      gameType: string;
      gameName: string;
      averageScore: number;
      averageAccuracy: number;
      sessionsPlayed: number;
      improvementTrend: 'improving' | 'stable' | 'declining';
    }>;
    weeklyActivity: Array<{
      date: string;
      minutesPlayed: number;
      xpEarned: number;
      gamesPlayed: number;
      accuracy: number;
    }>;
  };
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

interface LineChartProps {
  data: Array<{ date: string; value: number; label?: string }>;
  color: string;
  height?: number;
  showGrid?: boolean;
  showPoints?: boolean;
  animate?: boolean;
}

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  showValues?: boolean;
  animate?: boolean;
}

interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
  showLegend?: boolean;
  centerText?: string;
}

// =====================================================
// CHART COMPONENTS
// =====================================================

const LineChart: React.FC<LineChartProps> = ({
  data,
  color,
  height = 200,
  showGrid = true,
  showPoints = true,
  animate = true
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: ((maxValue - item.value) / range) * 80 + 10,
    value: item.value,
    date: item.date,
    label: item.label
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#6B7280" strokeWidth="0.2" />
            ))}
          </g>
        )}

        {/* Line path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0 } : {}}
          animate={animate ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data points */}
        {showPoints && points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={hoveredPoint === index ? "1.5" : "1"}
            fill={color}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint(index)}
            onMouseLeave={() => setHoveredPoint(null)}
            initial={animate ? { scale: 0 } : {}}
            animate={animate ? { scale: 1 } : {}}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredPoint !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-10"
            style={{
              left: `${points[hoveredPoint].x}%`,
              top: `${points[hoveredPoint].y}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="text-center">
              <div className="font-medium">{points[hoveredPoint].value}</div>
              <div className="opacity-75">
                {new Date(points[hoveredPoint].date).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showValues = true,
  animate = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-20 text-sm text-gray-600 text-right truncate">
            {item.label}
          </div>
          <div className="flex-1 relative">
            <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color || '#3B82F6' }}
                initial={animate ? { width: 0 } : { width: `${(item.value / maxValue) * 100}%` }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              />
              {showValues && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white"
                  initial={animate ? { opacity: 0 } : {}}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {item.value}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 120,
  showLegend = true,
  centerText
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const innerRadius = radius * 0.6;
  
  let cumulativePercentage = 0;

  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const innerStart = polarToCartesian(size / 2, size / 2, innerRadius, endAngle);
    const innerEnd = polarToCartesian(size / 2, size / 2, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <svg width={size} height={size}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = cumulativePercentage * 3.6;
            const endAngle = (cumulativePercentage + percentage) * 3.6;
            
            cumulativePercentage += percentage;
            
            return (
              <motion.path
                key={index}
                d={createArcPath(startAngle, endAngle)}
                fill={item.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
        
        {centerText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{centerText}</div>
            </div>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function StudentProgressVisualization({
  data,
  timeRange,
  onTimeRangeChange
}: ProgressVisualizationProps) {
  const [activeChart, setActiveChart] = useState<'xp' | 'accuracy' | 'time' | 'games'>('xp');
  const [showComparison, setShowComparison] = useState(false);

  // Prepare chart data
  const getChartData = (metric: string) => {
    return data.progressTrends.map(trend => ({
      date: trend.date,
      value: metric === 'xp' ? trend.xpEarned :
             metric === 'accuracy' ? trend.accuracy :
             metric === 'time' ? trend.timeSpent :
             trend.gamesPlayed,
      label: metric
    }));
  };

  const gamePerformanceData = data.gamePerformance.map(game => ({
    label: game.gameName,
    value: game.averageScore,
    color: game.improvementTrend === 'improving' ? '#10B981' :
           game.improvementTrend === 'declining' ? '#EF4444' : '#6B7280'
  }));

  const activityDistribution = [
    { label: 'Games Played', value: data.weeklyActivity.reduce((sum, w) => sum + w.gamesPlayed, 0), color: '#3B82F6' },
    { label: 'Time Spent', value: data.weeklyActivity.reduce((sum, w) => sum + w.minutesPlayed, 0), color: '#10B981' },
    { label: 'XP Earned', value: data.weeklyActivity.reduce((sum, w) => sum + w.xpEarned, 0) / 10, color: '#F59E0B' }
  ];

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Progress Visualization</h3>
          
          {/* Metric Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'xp', label: 'XP', icon: Zap },
              { id: 'accuracy', label: 'Accuracy', icon: Target },
              { id: 'time', label: 'Time', icon: Clock },
              { id: 'games', label: 'Games', icon: Activity }
            ].map((metric) => (
              <button
                key={metric.id}
                onClick={() => setActiveChart(metric.id as any)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeChart === metric.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <metric.icon className="h-4 w-4" />
                <span>{metric.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              showComparison
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Compare
          </button>
          
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Main Progress Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">
            {activeChart === 'xp' ? 'XP Earned Over Time' :
             activeChart === 'accuracy' ? 'Accuracy Trends' :
             activeChart === 'time' ? 'Study Time Progress' :
             'Games Played'}
          </h4>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Current Period</span>
            </div>
            {showComparison && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span>Previous Period</span>
              </div>
            )}
          </div>
        </div>

        <LineChart
          data={getChartData(activeChart)}
          color="#3B82F6"
          height={300}
          showGrid={true}
          showPoints={true}
          animate={true}
        />
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Game Performance</h4>
          <BarChart
            data={gamePerformanceData}
            height={250}
            showValues={true}
            animate={true}
          />
        </div>

        {/* Activity Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Activity Distribution</h4>
          <div className="flex justify-center">
            <DonutChart
              data={activityDistribution}
              size={200}
              showLegend={true}
              centerText="Total Activity"
            />
          </div>
        </div>
      </div>

      {/* Weekly Heatmap */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Weekly Activity Heatmap</h4>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-gray-600 font-medium p-2">
              {day}
            </div>
          ))}
          
          {data.weeklyActivity.slice(-28).map((activity, index) => {
            const intensity = Math.min(activity.xpEarned / 100, 1);
            return (
              <motion.div
                key={index}
                className="aspect-square rounded-sm cursor-pointer hover:scale-110 transition-transform"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                  border: intensity === 0 ? '1px solid #E5E7EB' : 'none'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                title={`${new Date(activity.date).toLocaleDateString()}: ${activity.xpEarned} XP`}
              />
            );
          })}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
          <span>Less active</span>
          <div className="flex items-center space-x-1">
            {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                  border: intensity === 0 ? '1px solid #E5E7EB' : 'none'
                }}
              />
            ))}
          </div>
          <span>More active</span>
        </div>
      </div>
    </div>
  );
}
