'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Trophy,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../../components/supabase/SupabaseProvider';

interface TestResult {
  id: string;
  test_id: string;
  student_id: string;
  attempt_number: number;
  start_time: string;
  completion_time: string;
  total_time_seconds: number;
  raw_score: number;
  total_possible_score: number;
  percentage_score: number;
  passed: boolean;
  questions_correct: number;
  questions_incorrect: number;
  questions_skipped: number;
  hints_used: number;
  responses: any[];
  performance_by_question_type: any;
}

interface TestInfo {
  id: string;
  title: string;
  description: string;
  passing_score_percentage: number;
  max_attempts: number;
  word_count: number;
}

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useSupabase();

  const testId = params.testId as string;
  const [result, setResult] = useState<TestResult | null>(null);
  const [test, setTest] = useState<TestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && testId) {
      loadResults();
    }
  }, [user, testId]);

  const loadResults = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get the most recent result for this test
      const { data: resultData, error: resultError } = await supabase
        .from('vocabulary_test_results')
        .select('*')
        .eq('test_id', testId)
        .eq('student_id', user.id)
        .order('completion_time', { ascending: false })
        .limit(1)
        .single();

      if (resultError) throw resultError;

      // Get test info
      const { data: testData, error: testError } = await supabase
        .from('vocabulary_tests')
        .select('id, title, description, passing_score_percentage, max_attempts, word_count')
        .eq('id', testId)
        .single();

      if (testError) throw testError;

      setResult(resultData);
      setTest(testData);
    } catch (error: any) {
      console.error('Error loading results:', error);
      setError(error.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number, passingScore: number): string => {
    if (score >= passingScore) {
      if (score >= 90) return 'text-green-600';
      if (score >= 80) return 'text-blue-600';
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number, passingScore: number): string => {
    if (score >= passingScore) {
      if (score >= 90) return 'bg-green-50 border-green-200';
      if (score >= 80) return 'bg-blue-50 border-blue-200';
      return 'bg-yellow-50 border-yellow-200';
    }
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !result || !test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-4">{error || 'Results not found'}</p>
          <button
            onClick={() => router.push('/student-dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8"
        >
          <div className="text-center">
            {/* Result Icon */}
            <div className="mb-6">
              {result.passed ? (
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>
              ) : (
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {result.passed ? 'Congratulations!' : 'Test Complete'}
            </h1>
            <p className="text-gray-600 mb-2">{test.title}</p>
            <p className="text-sm text-gray-500">
              Attempt {result.attempt_number} of {test.max_attempts}
            </p>
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl shadow-sm border-2 p-8 mb-8 ${getScoreBgColor(result.percentage_score, test.passing_score_percentage)}`}
        >
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.percentage_score, test.passing_score_percentage)}`}>
              {result.percentage_score.toFixed(1)}%
            </div>
            <div className="text-gray-600 mb-4">
              {result.questions_correct} / {test.word_count} correct
            </div>
            <div className="text-sm text-gray-500">
              Passing score: {test.passing_score_percentage}%
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">
                {formatTime(result.total_time_seconds)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Time Taken</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">
                {result.questions_correct}
              </span>
            </div>
            <p className="text-sm text-gray-600">Correct Answers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">
                {result.raw_score}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Points</p>
          </motion.div>
        </div>

        {/* Performance Breakdown */}
        {result.performance_by_question_type && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance by Question Type
            </h3>
            <div className="space-y-4">
              {Object.entries(result.performance_by_question_type).map(([type, stats]: [string, any]) => (
                <div key={type} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700 capitalize">
                      {type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      {stats.correct} / {stats.total} correct
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => router.push(`/student/test/${testId}/review`)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Eye className="h-5 w-5" />
            <span>Review Answers</span>
          </button>

          {result.attempt_number < test.max_attempts && !result.passed && (
            <button
              onClick={() => router.push(`/student/test/${testId}`)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Try Again</span>
            </button>
          )}

          <button
            onClick={() => router.push('/student-dashboard')}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

