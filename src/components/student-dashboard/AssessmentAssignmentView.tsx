'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Target, CheckCircle, Clock, Activity, Play } from 'lucide-react';
import Link from 'next/link';
import { supabaseBrowser } from '../auth/AuthProvider';

interface AssessmentData {
  score: number;
  accuracy: number;
  timeSpent: number;
  questionsCorrect: number;
  totalQuestions: number;
  attemptsUsed: number;
  maxAttempts: number;
  status: string;
}

interface AssessmentAssignmentViewProps {
  assignmentId: string;
  studentId: string;
  assignmentTitle: string;
  assignmentDescription?: string;
  dueDate?: string;
}

export default function AssessmentAssignmentView({
  assignmentId,
  studentId,
  assignmentTitle,
  assignmentDescription,
  dueDate
}: AssessmentAssignmentViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAssessmentData();
  }, [assignmentId, studentId]);

  const fetchAssessmentData = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser;

      // Get the latest session data
      const { data: latestSession, error: sessionError } = await supabase
        .from('enhanced_game_sessions')
        .select('session_data, final_score, accuracy_percentage, duration_seconds')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError && sessionError.code !== 'PGRST116') {
        console.error('Error fetching session:', sessionError);
      }

      // Get all sessions to count attempts
      const { data: allSessions } = await supabase
        .from('enhanced_game_sessions')
        .select('id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      // Get assignment config for max attempts
      const { data: assignment } = await supabase
        .from('assignments')
        .select('game_config')
        .eq('id', assignmentId)
        .single();

      const sessionData = latestSession?.session_data as any;
      const maxAttempts = assignment?.game_config?.assessmentConfig?.generalMaxAttempts || 3;

      setAssessmentData({
        score: latestSession?.final_score || 0,
        accuracy: parseFloat(latestSession?.accuracy_percentage || '0'),
        timeSpent: latestSession?.duration_seconds || 0,
        questionsCorrect: sessionData?.correctAnswers || 0,
        totalQuestions: sessionData?.totalQuestions || 10,
        attemptsUsed: allSessions?.length || 0,
        maxAttempts,
        status: latestSession ? 'completed' : 'not_started'
      });

      setLoading(false);
    } catch (err) {
      console.error('Error loading assessment data:', err);
      setError('Failed to load assessment data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceFeedback = (score: number, attemptsUsed: number, maxAttempts: number) => {
    if (score >= 70) {
      return {
        title: 'Excellent work!',
        message: 'You demonstrated strong comprehension skills.',
        canRetake: attemptsUsed < maxAttempts,
        color: 'green'
      };
    } else if (score >= 50) {
      return {
        title: 'Good effort!',
        message: "You're making progress.",
        canRetake: attemptsUsed < maxAttempts,
        color: 'yellow'
      };
    } else {
      return {
        title: 'Keep practicing!',
        message: 'This material needs more review.',
        canRetake: attemptsUsed < maxAttempts,
        color: 'red'
      };
    }
  };

  const feedback = assessmentData ? getPerformanceFeedback(
    assessmentData.score,
    assessmentData.attemptsUsed,
    assessmentData.maxAttempts
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/student-dashboard/assignments"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignmentTitle}</h1>
          {assignmentDescription && (
            <p className="text-gray-600">{assignmentDescription}</p>
          )}
          {dueDate && (
            <p className="text-sm text-gray-500 mt-2">Due: {dueDate}</p>
          )}
        </div>

        {/* Assessment Results Card */}
        {assessmentData && assessmentData.status !== 'not_started' ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Assessment Results</h2>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${getScoreColor(assessmentData.score)}`}>
                  {assessmentData.score}%
                </div>
                <div className="text-sm font-medium text-gray-600">Final Score</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Correct Answers</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {assessmentData.questionsCorrect}/{assessmentData.totalQuestions}
                </div>
                <div className="text-sm text-gray-600 mt-1">{assessmentData.accuracy}% accuracy</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Time Spent</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {Math.floor(assessmentData.timeSpent / 60)}:{String(assessmentData.timeSpent % 60).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600 mt-1">minutes</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">Attempts</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {assessmentData.attemptsUsed}/{assessmentData.maxAttempts}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {assessmentData.attemptsUsed < assessmentData.maxAttempts
                    ? `${assessmentData.maxAttempts - assessmentData.attemptsUsed} remaining`
                    : 'All used'}
                </div>
              </div>
            </div>

            {/* Performance Feedback */}
            {feedback && (
              <div className={`bg-${feedback.color}-50 border-2 border-${feedback.color}-200 rounded-xl p-6`}>
                <div className="text-lg font-bold text-gray-900 mb-2">
                  <span className={`text-${feedback.color}-600`}>{feedback.title}</span>
                </div>
                <p className="text-gray-700 mb-3">
                  {feedback.message}
                  {feedback.canRetake && ' You can retake this assessment to improve your score.'}
                </p>
                {feedback.canRetake && (
                  <Link
                    href={`/assessments/reading-comprehension?assignment=${assignmentId}`}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <Play className="h-5 w-5" />
                    Retake Assessment
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
              <p className="text-gray-600 mb-6">You haven't started this assessment yet.</p>
              <Link
                href={`/assessments/reading-comprehension?assignment=${assignmentId}`}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
              >
                <Play className="h-6 w-6" />
                Start Assessment
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

