'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, AlertCircle } from 'lucide-react';
import { ProgressBar } from './shared/ProgressBar';
import type { StudentProfileData } from '@/types/teacherAnalytics';

interface StudentDrillDownProps {
  studentId: string;
  onBack: () => void;
}

export function StudentDrillDown({ studentId, onBack }: StudentDrillDownProps) {
  const [data, setData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/teacher-analytics/student-profile?studentId=${studentId}&timeRange=last_30_days`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch student profile');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading student profile...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error || 'No data available'}</div>
      </div>
    );
  }

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (direction === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.studentName}</h1>
            <p className="text-sm text-gray-600">Student Performance Analysis</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Last Active</div>
          <div className="text-lg font-semibold text-gray-900">
            {data.lastActive ? new Date(data.lastActive).toLocaleDateString() : 'Never'}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Average Score</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-gray-900">{data.averageScore}%</div>
            {data.performanceTrend.percentage !== 0 && getTrendIcon(data.performanceTrend.direction)}
          </div>
          {data.performanceTrend.percentage !== 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {data.performanceTrend.percentage > 0 ? '+' : ''}{data.performanceTrend.percentage}% vs last period
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
          <div className="text-3xl font-bold text-gray-900">{data.totalSessions}</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Current Streak</div>
          <div className="text-3xl font-bold text-gray-900">{data.currentStreak}</div>
          <div className="text-xs text-gray-500 mt-1">Days active</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Risk Level</div>
          <div className={`text-3xl font-bold ${
            data.riskLevel === 'critical' ? 'text-red-600' :
            data.riskLevel === 'high' ? 'text-orange-600' :
            data.riskLevel === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Risk score: {Math.round(data.riskScore * 100)}%</div>
        </div>
      </div>

      {/* Vocabulary Mastery Map */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Mastery</h2>
        <div className="space-y-3">
          {data.vocabularyMastery.map((category) => (
            <div key={category.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{category.categoryName}</span>
                <span className="text-gray-600">
                  {category.masteryPercentage}% (Class Avg: {category.classAverage}%)
                </span>
              </div>
              <ProgressBar
                value={category.masteryPercentage}
                classAverage={category.classAverage}
                color={category.masteryPercentage >= 75 ? 'green' : category.masteryPercentage >= 60 ? 'yellow' : 'red'}
              />
            </div>
          ))}
          {data.vocabularyMastery.length === 0 && (
            <div className="text-center text-gray-500 py-4">No vocabulary data available</div>
          )}
        </div>
      </div>

      {/* Grammar Mastery */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grammar Mastery</h2>
        <div className="space-y-3">
          {data.grammarMastery.map((concept) => (
            <div key={concept.concept}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{concept.conceptName}</span>
                <span className="text-gray-600">
                  {concept.masteryPercentage}% (Class Avg: {concept.classAverage}%)
                </span>
              </div>
              <ProgressBar
                value={concept.masteryPercentage}
                classAverage={concept.classAverage}
                color={concept.masteryPercentage >= 75 ? 'green' : concept.masteryPercentage >= 60 ? 'yellow' : 'red'}
              />
            </div>
          ))}
          {data.grammarMastery.length === 0 && (
            <div className="text-center text-gray-500 py-4">No grammar data available</div>
          )}
        </div>
      </div>

      {/* Weak Skills & Words */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weak Skills</h2>
          <div className="space-y-2">
            {data.weakSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">{skill.skillName}</span>
                </div>
                <span className="text-sm text-red-600">{skill.accuracy}% accuracy</span>
              </div>
            ))}
            {data.weakSkills.length === 0 && (
              <div className="text-center text-gray-500 py-4">No weak skills identified</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Missed Words</h2>
          <div className="space-y-2">
            {data.weakWords.map((word, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">{word.word}</div>
                  <div className="text-xs text-gray-600">{word.translation}</div>
                </div>
                <span className="text-sm text-yellow-600">{word.attempts} attempts</span>
              </div>
            ))}
            {data.weakWords.length === 0 && (
              <div className="text-center text-gray-500 py-4">No frequently missed words</div>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Log */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {data.engagementLog.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{activity.activityType}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                {activity.score !== null && (
                  <div className="text-sm text-gray-500 mt-1">Score: {activity.score}%</div>
                )}
              </div>
            </div>
          ))}
          {data.engagementLog.length === 0 && (
            <div className="text-center text-gray-500 py-4">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}

