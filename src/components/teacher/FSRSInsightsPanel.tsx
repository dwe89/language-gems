// FSRS Insights Panel for Teacher Dashboard
// Displays FSRS-powered analytics and recommendations

import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingDown,
  AlertTriangle,
  Target,
  Clock,
  Users,
  BookOpen,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { FSRSAnalyticsService, FSRSStudentAnalytics, FSRSInsight } from '../../services/fsrsAnalyticsService';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';

interface FSRSInsightsPanelProps {
  classId?: string;
  studentId?: string;
}

export const FSRSInsightsPanel: React.FC<FSRSInsightsPanelProps> = ({
  classId,
  studentId
}) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<FSRSInsight[]>([]);
  const [studentAnalytics, setStudentAnalytics] = useState<FSRSStudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fsrsAnalyticsService = new FSRSAnalyticsService(supabaseBrowser);

  useEffect(() => {
    if (user?.id) {
      loadFSRSData();
    }
  }, [user?.id, classId, studentId]);

  const loadFSRSData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (studentId) {
        // Load individual student analytics
        const analytics = await fsrsAnalyticsService.generateStudentAnalytics(studentId);
        setStudentAnalytics(analytics);
      }

      // Load teacher insights
      const teacherInsights = await fsrsAnalyticsService.generateFSRSInsights(user!.id);
      setInsights(teacherInsights);

    } catch (err) {
      console.error('Error loading FSRS data:', err);
      setError('Failed to load FSRS insights');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'memory_decay': return <TrendingDown className="w-5 h-5" />;
      case 'learning_velocity': return <Zap className="w-5 h-5" />;
      case 'difficulty_spike': return <AlertTriangle className="w-5 h-5" />;
      case 'mastery_plateau': return <Target className="w-5 h-5" />;
      case 'optimal_timing': return <Clock className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <XCircle className="w-5 h-5" />
          <span className="font-medium">Error Loading FSRS Insights</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={loadFSRSData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* FSRS Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">FSRS Memory Analytics</h2>
            <p className="text-purple-100">
              Advanced spaced repetition insights powered by memory science
            </p>
          </div>
        </div>
      </div>

      {/* Student Analytics (if viewing individual student) */}
      {studentAnalytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              {studentAnalytics.studentName} - Memory Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Memory Strength */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Memory Strength</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {Math.round(studentAnalytics.memoryStrengthProfile.averageStability)}d
              </div>
              <div className="text-xs text-blue-600">Average Stability</div>
            </div>

            {/* Learning Efficiency */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Retention Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {Math.round(studentAnalytics.learningEfficiency.retentionRate)}%
              </div>
              <div className="text-xs text-green-600">Words Retained</div>
            </div>

            {/* Risk Level */}
            <div className={`rounded-lg p-4 ${
              studentAnalytics.predictions.riskLevel === 'high' ? 'bg-red-50' :
              studentAnalytics.predictions.riskLevel === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${
                  studentAnalytics.predictions.riskLevel === 'high' ? 'text-red-600' :
                  studentAnalytics.predictions.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <span className={`text-sm font-medium ${
                  studentAnalytics.predictions.riskLevel === 'high' ? 'text-red-800' :
                  studentAnalytics.predictions.riskLevel === 'medium' ? 'text-yellow-800' : 'text-green-800'
                }`}>Risk Level</span>
              </div>
              <div className={`text-2xl font-bold capitalize ${
                studentAnalytics.predictions.riskLevel === 'high' ? 'text-red-900' :
                studentAnalytics.predictions.riskLevel === 'medium' ? 'text-yellow-900' : 'text-green-900'
              }`}>
                {studentAnalytics.predictions.riskLevel}
              </div>
              <div className={`text-xs ${
                studentAnalytics.predictions.riskLevel === 'high' ? 'text-red-600' :
                studentAnalytics.predictions.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>Memory Risk</div>
            </div>
          </div>

          {/* Vocabulary Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {studentAnalytics.learningEfficiency.masteredWords.length}
              </div>
              <div className="text-sm text-gray-600">Mastered Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {studentAnalytics.learningEfficiency.strugglingWords.length}
              </div>
              <div className="text-sm text-gray-600">Struggling Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {studentAnalytics.learningEfficiency.overdueWords.length}
              </div>
              <div className="text-sm text-gray-600">Overdue Reviews</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};