'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Target, CheckCircle, Clock, Activity, Play } from 'lucide-react';
import Link from 'next/link';
import { supabaseBrowser } from '../auth/AuthProvider';
import { AssessmentResultsDetailView } from '../dashboard/AssessmentResultsDetailView';

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

interface AssessmentPart {
  id: string;
  name: string;
  type: string;
  instanceConfig: any;
  resultsTable: string;
  assessmentUrl: string;
  result?: AssessmentData | null;
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
  const [assessmentParts, setAssessmentParts] = useState<AssessmentPart[]>([]);
  const [error, setError] = useState<string>('');
  const [assessmentUrl, setAssessmentUrl] = useState<string>('/assessments/gcse-listening');

  useEffect(() => {
    fetchAssessmentData();
  }, [assignmentId, studentId]);

  const fetchAssessmentData = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser;

      // Get assignment to determine assessment type
      const { data: assignment, error: assignmentError } = await supabase
        .from('assignments')
        .select('game_config, type')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) {
        console.error('Error fetching assignment:', assignmentError);
        setError('Failed to load assignment');
        setLoading(false);
        return;
      }

      // Determine which assessment results table to query based on game_config
      const gameConfig = assignment?.game_config as any;
      const selectedAssessments = gameConfig?.assessmentConfig?.selectedAssessments || [];

      // Build per-selectedAssessment parts so students can see each sub-assessment
      const parts: AssessmentPart[] = [];

      // Build parts for each selected assessment
      for (const sel of selectedAssessments) {
        const assessmentType = sel?.type || sel?.id || '';
        const instanceConfig = sel?.instanceConfig || {};

        let resultsTable = 'aqa_listening_results'; // default
        let assessmentPath = '/assessments/gcse-listening';
        const language = instanceConfig.language || 'es';
        const level = instanceConfig.level || 'KS4';
        const difficulty = instanceConfig.difficulty || 'foundation';
        const examBoard = instanceConfig.examBoard || 'AQA';
        const paper = instanceConfig.paper || instanceConfig.identifier || 'paper-1';

        if (assessmentType === 'gcse-reading') {
          resultsTable = 'aqa_reading_results';
          assessmentPath = `/assessments/gcse-reading?assignment=${assignmentId}&mode=assignment&language=${language}&level=${level}&difficulty=${difficulty}&identifier=${paper}`;
        } else if (assessmentType === 'reading-comprehension') {
          resultsTable = 'reading_comprehension_results';
          assessmentPath = `/assessments/reading-comprehension?assignment=${assignmentId}&mode=assignment`;
        } else if (assessmentType === 'gcse-writing' || assessmentType === 'writing') {
          resultsTable = 'aqa_writing_results';
          assessmentPath = `/assessments/gcse-writing?assignment=${assignmentId}&mode=assignment&language=${language}&level=${level}&difficulty=${difficulty}`;
        } else if (assessmentType === 'gcse-speaking' || assessmentType === 'speaking') {
          resultsTable = 'aqa_speaking_results';
          assessmentPath = `/assessments/gcse-speaking?assignment=${assignmentId}&mode=assignment&language=${language}&level=${level}&difficulty=${difficulty}`;
        } else if (assessmentType === 'gcse-listening') {
          resultsTable = 'aqa_listening_results';
          assessmentPath = `/assessments/gcse-listening?assignment=${assignmentId}&mode=assignment&language=${language}&level=${level}&difficulty=${difficulty}&identifier=${paper}`;
        } else if (assessmentType === 'topic-based') {
          resultsTable = 'aqa_reading_results';
          assessmentPath = `/assessments/topic-based?assignment=${assignmentId}&mode=assignment&language=${language}&level=${level}&difficulty=${difficulty}`;
        } else if (assessmentType === 'dictation') {
          resultsTable = 'aqa_listening_results';
          assessmentPath = `/assessments/dictation?assignment=${assignmentId}&mode=assignment&language=${language}&level=${level}&difficulty=${difficulty}`;
        } else if (assessmentType === 'four-skills') {
          resultsTable = 'aqa_reading_results';
          assessmentPath = `/assessments/four-skills?assignment=${assignmentId}&mode=assignment&language=${language}&level=${level}&difficulty=${difficulty}`;
        }

        parts.push({
          id: sel.id || '',
          name: sel.name || sel.id || 'Assessment',
          type: assessmentType,
          instanceConfig,
          resultsTable,
          assessmentUrl: assessmentPath,
          result: null
        });
      }

      setAssessmentParts(parts);

      // For each part, fetch latest result for that specific assessment
      for (const part of parts) {
        try {
          const studentIdColumn = part.type === 'reading-comprehension' ? 'user_id' : 'student_id';

          console.log('🔍 [ASSESSMENT FETCH]', {
            partName: part.name,
            partType: part.type,
            resultsTable: part.resultsTable,
            studentIdColumn,
            assignmentId,
            studentId
          });

          const { data: latestResult, error: resultError } = await supabase
            .from(part.resultsTable)
            .select('*')
            .eq('assignment_id', assignmentId)
            .eq(studentIdColumn, studentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          console.log('📊 [ASSESSMENT RESULT]', {
            partName: part.name,
            found: !!latestResult,
            error: resultError,
            result: latestResult
          });

          if (resultError && resultError.code !== 'PGRST116') {
            console.error('Error fetching assessment result for', part.name, resultError);
          }

          // Get all results to count attempts for this part
          const { data: allResults } = await supabase
            .from(part.resultsTable)
            .select('id')
            .eq('assignment_id', assignmentId)
            .eq(studentIdColumn, studentId);

          const maxAttempts = gameConfig?.assessmentConfig?.generalMaxAttempts || 3;

          if (latestResult) {
            if (part.type === 'reading-comprehension') {
              part.result = {
                score: latestResult.score || 0,
                accuracy: latestResult.score || 0,
                timeSpent: latestResult.time_spent || 0,
                questionsCorrect: latestResult.correct_answers || 0,
                totalQuestions: latestResult.total_questions || 10, // Default to 10 for RC
                attemptsUsed: allResults?.length || 1,
                maxAttempts,
                status: latestResult.completed_at ? 'completed' : 'in_progress'
              };
              console.log('✅ [RC RESULT MAPPED]', part.result);
            } else {
              part.result = {
                score: latestResult.percentage_score || 0,
                accuracy: latestResult.percentage_score || 0,
                timeSpent: latestResult.time_spent_seconds || latestResult.total_time_seconds || 0,
                questionsCorrect: latestResult.total_marks_awarded || latestResult.raw_score || 0,
                totalQuestions: latestResult.total_marks_possible || latestResult.total_possible_score || 40,
                attemptsUsed: allResults?.length || 1,
                maxAttempts,
                status: latestResult.status || 'completed'
              };
            }

            // If result exists, update URL to point to review mode
            if (part.assessmentUrl.includes('?')) {
              part.assessmentUrl += '&review=true';
            } else {
              part.assessmentUrl += '?review=true';
            }
          } else {
            part.result = {
              score: 0,
              accuracy: 0,
              timeSpent: 0,
              questionsCorrect: 0,
              totalQuestions: part.type === 'reading-comprehension' ? 10 : 40,
              attemptsUsed: 0,
              maxAttempts,
              status: 'not_started'
            };
            console.log('❌ [NO RESULT] Defaulting to not_started for', part.name);
          }
        } catch (err) {
          console.error('Error fetching results for part', part, err);
        }
      }

      setAssessmentParts(parts);

      // If there is an aggregate/latest overall result (use first non-null part result as main summary)
      const anyCompletedPart = parts.find(p => p.result && p.result.status !== 'not_started');
      if (anyCompletedPart && anyCompletedPart.result) {
        setAssessmentData(anyCompletedPart.result);
        setAssessmentUrl(anyCompletedPart.assessmentUrl);
      } else if (parts.length > 0) {
        // Set default summary from the first part
        setAssessmentData(parts[0].result || null);
        setAssessmentUrl(parts[0].assessmentUrl || '/assessments/gcse-listening');
      }

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

  if (assessmentData && assessmentData.status === 'completed') {
    return (
      <AssessmentResultsDetailView
        assignmentId={assignmentId}
        studentId={studentId}
        studentName="My Results"
        onBack={() => router.push('/student-dashboard/assessments')}
        viewMode="student"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/student-dashboard/assessments"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
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
                    href={assessmentUrl}
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
                href={assessmentUrl}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
              >
                <Play className="h-6 w-6" />
                Start Assessment
              </Link>
            </div>
          </div>
        )}

        {/* Per-Part Breakdown */}
        {assessmentParts.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Parts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessmentParts.map((part) => (
                <div key={part.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm text-gray-500">{part.name}</div>
                      <div className="text-lg font-semibold text-gray-900">{part.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(part.result?.score || 0)}`}>{part.result?.score || 0}%</div>
                      <div className="text-xs text-gray-500">{part.result?.status}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <div>Correct: {part.result?.questionsCorrect}/{part.result?.totalQuestions}</div>
                      <div>Time: {Math.floor((part.result?.timeSpent || 0) / 60)}:{String((part.result?.timeSpent || 0) % 60).padStart(2, '0')}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={part.assessmentUrl} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">
                        {part.result?.status === 'not_started' ? 'Start' : 'Review'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

