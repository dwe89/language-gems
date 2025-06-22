'use client';

import React, { useState, useEffect } from 'react';
import { 
  GemCollection, 
  MiningSession 
} from '../../types/vocabulary-mining';
import { 
  formatDuration,
  calculateNextReviewInterval 
} from '../../utils/vocabulary-mining';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  BarChart3,
  Calendar,
  Zap,
  Brain,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface SpacedRepetitionAnalyticsProps {
  studentId?: string;
  classId?: string;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

interface RetentionData {
  interval: number; // days
  totalReviews: number;
  successfulReviews: number;
  retentionRate: number;
}

interface LearningCurveData {
  date: string;
  newWords: number;
  reviewedWords: number;
  accuracy: number;
  averageInterval: number;
}

interface AnalyticsData {
  retentionByInterval: RetentionData[];
  learningCurve: LearningCurveData[];
  forgettingCurve: { day: number; retention: number }[];
  optimalIntervals: { difficulty: number; interval: number }[];
  summary: {
    totalWords: number;
    averageRetention: number;
    optimalRetentionRate: number;
    averageInterval: number;
    strongestInterval: number;
    weakestInterval: number;
  };
}

export function SpacedRepetitionAnalytics({ 
  studentId, 
  classId, 
  timeRange = 'month' 
}: SpacedRepetitionAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'retention' | 'intervals' | 'curve'>('retention');

  useEffect(() => {
    loadAnalyticsData();
  }, [studentId, classId, timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockAnalytics: AnalyticsData = {
        retentionByInterval: [
          { interval: 1, totalReviews: 150, successfulReviews: 135, retentionRate: 90 },
          { interval: 3, totalReviews: 120, successfulReviews: 102, retentionRate: 85 },
          { interval: 7, totalReviews: 100, successfulReviews: 82, retentionRate: 82 },
          { interval: 14, totalReviews: 80, successfulReviews: 62, retentionRate: 78 },
          { interval: 30, totalReviews: 60, successfulReviews: 42, retentionRate: 70 },
          { interval: 90, totalReviews: 40, successfulReviews: 26, retentionRate: 65 },
        ],
        learningCurve: [
          { date: '2024-01-01', newWords: 10, reviewedWords: 5, accuracy: 85, averageInterval: 2.5 },
          { date: '2024-01-02', newWords: 8, reviewedWords: 12, accuracy: 88, averageInterval: 3.2 },
          { date: '2024-01-03', newWords: 12, reviewedWords: 15, accuracy: 82, averageInterval: 3.8 },
          { date: '2024-01-04', newWords: 6, reviewedWords: 18, accuracy: 90, averageInterval: 4.1 },
          { date: '2024-01-05', newWords: 9, reviewedWords: 22, accuracy: 87, averageInterval: 4.5 },
        ],
        forgettingCurve: [
          { day: 0, retention: 100 },
          { day: 1, retention: 90 },
          { day: 3, retention: 85 },
          { day: 7, retention: 82 },
          { day: 14, retention: 78 },
          { day: 30, retention: 70 },
          { day: 90, retention: 65 },
        ],
        optimalIntervals: [
          { difficulty: 1, interval: 1 },
          { difficulty: 2, interval: 3 },
          { difficulty: 3, interval: 7 },
          { difficulty: 4, interval: 14 },
          { difficulty: 5, interval: 30 },
        ],
        summary: {
          totalWords: 250,
          averageRetention: 78,
          optimalRetentionRate: 85,
          averageInterval: 12.5,
          strongestInterval: 7,
          weakestInterval: 90,
        }
      };
      
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  };

  const getRetentionColor = (rate: number) => {
    if (rate >= 85) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRetentionBgColor = (rate: number) => {
    if (rate >= 85) return 'bg-green-100';
    if (rate >= 75) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Spaced Repetition Analytics</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'retention' | 'intervals' | 'curve')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="retention">Retention Rates</option>
            <option value="intervals">Optimal Intervals</option>
            <option value="curve">Learning Curve</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{analytics.summary.totalWords}</div>
          <div className="text-sm text-purple-700">Total Words</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{analytics.summary.averageRetention}%</div>
          <div className="text-sm text-green-700">Avg Retention</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{analytics.summary.averageInterval}d</div>
          <div className="text-sm text-blue-700">Avg Interval</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{analytics.summary.strongestInterval}d</div>
          <div className="text-sm text-orange-700">Best Interval</div>
        </div>
      </div>

      {/* Main Content */}
      {selectedMetric === 'retention' && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Retention by Review Interval</h4>
          <div className="space-y-3">
            {analytics.retentionByInterval.map((data) => (
              <div key={data.interval} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">{data.interval}d</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {data.interval === 1 ? 'Next Day' : 
                       data.interval === 3 ? '3 Days' :
                       data.interval === 7 ? '1 Week' :
                       data.interval === 14 ? '2 Weeks' :
                       data.interval === 30 ? '1 Month' :
                       '3 Months'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {data.successfulReviews}/{data.totalReviews} successful reviews
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        data.retentionRate >= 85 ? 'bg-green-500' :
                        data.retentionRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${data.retentionRate}%` }}
                    />
                  </div>
                  <span className={`font-bold ${getRetentionColor(data.retentionRate)}`}>
                    {data.retentionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMetric === 'intervals' && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Optimal Intervals by Difficulty</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.optimalIntervals.map((data) => (
              <div key={data.difficulty} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    Difficulty Level {data.difficulty}
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {data.interval} days
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {data.difficulty === 1 ? 'Very Easy' :
                   data.difficulty === 2 ? 'Easy' :
                   data.difficulty === 3 ? 'Medium' :
                   data.difficulty === 4 ? 'Hard' : 'Very Hard'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Recommendations</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Words with high accuracy can have longer intervals</li>
              <li>• Struggling words should be reviewed more frequently</li>
              <li>• Optimal retention rate target: 85%</li>
              <li>• Adjust intervals based on individual performance</li>
            </ul>
          </div>
        </div>
      )}

      {selectedMetric === 'curve' && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Learning Progress Over Time</h4>
          <div className="space-y-4">
            {analytics.learningCurve.map((data, index) => (
              <div key={data.date} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(data.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {data.newWords} new • {data.reviewedWords} reviewed
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{data.accuracy}%</div>
                    <div className="text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{data.averageInterval}d</div>
                    <div className="text-gray-500">Avg Interval</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">Strengths</span>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Consistent daily practice</li>
                <li>• Improving accuracy over time</li>
                <li>• Increasing review intervals</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-orange-600 mr-2" />
                <span className="font-medium text-orange-900">Areas for Improvement</span>
              </div>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Focus on difficult words</li>
                <li>• Maintain consistent review schedule</li>
                <li>• Optimize interval timing</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
