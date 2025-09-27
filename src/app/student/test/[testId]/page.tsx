'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Target,
  Timer
} from 'lucide-react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import VocabularyTestInterface from '../../../../components/vocabulary-tests/VocabularyTestInterface';

interface TestPreview {
  id: string;
  title: string;
  description?: string;
  language: string;
  curriculum_level: string;
  word_count: number;
  time_limit_minutes: number;
  max_attempts: number;
  passing_score_percentage: number;
  points_per_question: number;
  status: string;
}

interface StudentTestStatus {
  can_start_new_attempt: boolean;
  attempts_remaining: number;
  in_progress_attempt: any;
  student_results: any[];
  best_score?: number;
  last_attempt_date?: string;
}

export default function StudentTestPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useSupabase();

  const testId = params.testId as string;

  // State
  const [test, setTest] = useState<TestPreview | null>(null);
  const [testStatus, setTestStatus] = useState<StudentTestStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'preview' | 'test' | 'results'>('preview');
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    if (user && testId) {
      loadTestData();
    }
  }, [user, testId]);

  const loadTestData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch test data and student status
      const response = await fetch(`/api/vocabulary-tests/${testId}/start?student_id=${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load test');
      }

      setTest(data.test);
      setTestStatus({
        can_start_new_attempt: data.can_start_new_attempt,
        attempts_remaining: data.attempts_remaining,
        in_progress_attempt: data.in_progress_attempt,
        student_results: data.student_results,
        best_score: data.student_results.length > 0 
          ? Math.max(...data.student_results.map((r: any) => r.percentage_score))
          : undefined,
        last_attempt_date: data.student_results.length > 0
          ? data.student_results[0].completion_time
          : undefined
      });

      // If there's an in-progress attempt, go directly to test
      if (data.in_progress_attempt) {
        setCurrentView('test');
      }

    } catch (error: any) {
      setError(error.message || 'Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (!user || !test) return;

    try {
      const response = await fetch(`/api/vocabulary-tests/${testId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start test');
      }

      setCurrentView('test');
    } catch (error: any) {
      alert('Failed to start test: ' + error.message);
    }
  };

  const handleTestComplete = (resultId: string, score: number, passed: boolean) => {
    setTestResults({
      resultId,
      score,
      passed,
      completedAt: new Date()
    });
    setCurrentView('results');
    
    // Reload test status
    loadTestData();
  };

  const handleReturnToDashboard = () => {
    router.push('/student/dashboard');
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getScoreColor = (score: number, passingScore: number): string => {
    if (score >= passingScore) {
      if (score >= 90) return 'text-green-600';
      if (score >= 80) return 'text-blue-600';
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Test Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleReturnToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!test || !testStatus) {
    return null;
  }

  // Test Interface View
  if (currentView === 'test') {
    return (
      <VocabularyTestInterface
        testId={testId}
        onTestComplete={handleTestComplete}
        onExit={() => setCurrentView('preview')}
      />
    );
  }

  // Results View
  if (currentView === 'results' && testResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            {/* Result Icon */}
            <div className="mb-6">
              {testResults.passed ? (
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-green-600" />
                </div>
              ) : (
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              )}
            </div>

            {/* Result Message */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {testResults.passed ? 'Congratulations!' : 'Test Complete'}
            </h2>
            <p className="text-gray-600 mb-6">
              {testResults.passed 
                ? 'You passed the vocabulary test!' 
                : 'You can review your results and try again if attempts remain.'
              }
            </p>

            {/* Score Display */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold mb-2 ${getScoreColor(testResults.score, test.passing_score_percentage)}">
                {testResults.score.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                Passing score: {test.passing_score_percentage}%
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-4">
              {testStatus.attempts_remaining > 0 && !testResults.passed && (
                <button
                  onClick={() => setCurrentView('preview')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              )}
              
              <button
                onClick={handleReturnToDashboard}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Preview View (Default)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
            {test.description && (
              <p className="text-gray-600 mb-4">{test.description}</p>
            )}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{test.language.toUpperCase()} • {test.curriculum_level}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>{test.word_count} questions</span>
              </span>
              <span className="flex items-center space-x-1">
                <Timer className="h-4 w-4" />
                <span>{formatTime(test.time_limit_minutes)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Test Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Test Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{test.word_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Limit:</span>
                <span className="font-medium">{formatTime(test.time_limit_minutes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passing Score:</span>
                <span className="font-medium">{test.passing_score_percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Points per Question:</span>
                <span className="font-medium">{test.points_per_question}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Attempts:</span>
                <span className="font-medium">{test.max_attempts}</span>
              </div>
            </div>
          </div>

          {/* Your Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Attempts Used:</span>
                <span className="font-medium">
                  {testStatus.student_results.length} / {test.max_attempts}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attempts Remaining:</span>
                <span className="font-medium">{testStatus.attempts_remaining}</span>
              </div>
              {testStatus.best_score !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Score:</span>
                  <span className={`font-medium ${getScoreColor(testStatus.best_score, test.passing_score_percentage)}`}>
                    {testStatus.best_score.toFixed(1)}%
                  </span>
                </div>
              )}
              {testStatus.last_attempt_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Attempt:</span>
                  <span className="font-medium">
                    {new Date(testStatus.last_attempt_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          {testStatus.in_progress_attempt ? (
            <button
              onClick={() => setCurrentView('test')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-medium"
            >
              Resume Test
            </button>
          ) : testStatus.can_start_new_attempt ? (
            <button
              onClick={handleStartTest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium"
            >
              Start Test
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-gray-100 text-gray-600 px-8 py-4 rounded-xl text-lg font-medium inline-block">
                No Attempts Remaining
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You have used all {test.max_attempts} attempts for this test.
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <button
              onClick={handleReturnToDashboard}
              className="text-gray-600 hover:text-gray-800 px-4 py-2"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
