'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../../components/supabase/SupabaseProvider';

interface TestQuestion {
  id: string;
  question_number: number;
  question_type: string;
  question_text: string;
  correct_answer: string;
  options?: string[];
}

interface TestResponse {
  question_id: string;
  question_number: number;
  question_type: string;
  student_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points_awarded: number;
  time_spent_seconds: number;
  hint_used: boolean;
}

interface TestResult {
  id: string;
  test_id: string;
  percentage_score: number;
  passed: boolean;
  questions_correct: number;
  questions_incorrect: number;
  responses: TestResponse[];
}

interface TestInfo {
  id: string;
  title: string;
  description: string;
  word_count: number;
}

const formatAnswer = (answer: string | undefined | null) => {
    if (answer === undefined || answer === null || answer === '') return '(No answer provided)';
    
    // Try to parse as JSON if it looks like an object/array
    if (typeof answer === 'string' && (answer.trim().startsWith('{') || answer.trim().startsWith('['))) {
        try {
            const parsed = JSON.parse(answer);
            if (typeof parsed === 'object' && parsed !== null) {
                // Check if it's a simple key-value map
                const entries = Object.entries(parsed);
                if (entries.length > 0) {
                     return (
                        <div className="flex flex-col gap-1 mt-1 pl-2 border-l-2 border-slate-200">
                            {entries.map(([key, value]) => {
                                // Check if key is a number (index)
                                const displayKey = !isNaN(Number(key)) 
                                    ? `Q${Number(key) + 1}` 
                                    : key;
                                return (
                                    <div key={key} className="flex items-center text-sm">
                                        <span className="font-medium mr-2 min-w-[20px]">{displayKey}:</span>
                                        <span>{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
            }
        } catch (e) {
            // Not valid JSON, fall through to return string
        }
    }

    return answer;
};

export default function ReviewAnswersPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { supabase } = useSupabase();

  const testId = params?.testId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<TestInfo | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(true);

  useEffect(() => {
    if (user && testId) {
      loadReviewData();
    }
  }, [user, testId]);

  const loadReviewData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get the most recent completed result
      const { data: resultData, error: resultError } = await supabase
        .from('vocabulary_test_results')
        .select('*')
        .eq('test_id', testId)
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .order('completion_time', { ascending: false })
        .limit(1)
        .single();

      if (resultError) throw new Error('No completed test found');

      // Get test info
      const { data: testData, error: testError } = await supabase
        .from('vocabulary_tests')
        .select('id, title, description, word_count')
        .eq('id', testId)
        .single();

      if (testError) throw testError;

      // Get test questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('vocabulary_test_questions')
        .select('*')
        .eq('test_id', testId)
        .order('question_number', { ascending: true });

      if (questionsError) throw questionsError;

      setResult(resultData);
      setTest(testData);
      setQuestions(questionsData || []);

    } catch (error: any) {
      setError(error.message || 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentResponse = (): TestResponse | undefined => {
    if (!result || !questions[currentQuestionIndex]) return undefined;
    return result.responses.find(
      r => r.question_id === questions[currentQuestionIndex].id
    );
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !result || !test || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Review</h2>
          <p className="text-gray-600 mb-4">{error || 'Review data not found'}</p>
          <button
            onClick={() => router.push(`/student/test/${testId}/results`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = getCurrentResponse();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <button
            onClick={() => router.push(`/student/test/${testId}/results`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Results
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{test.title}</h1>
              <p className="text-gray-600">Review Your Answers</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{result.percentage_score.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">
                {result.questions_correct} / {test.word_count} correct
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showCorrectAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showCorrectAnswer ? 'Hide' : 'Show'} Correct Answer</span>
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const response = result.responses.find(r => r.question_number === index + 1);
              const isCorrect = response?.is_correct;
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isCurrent
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : ''
                  } ${
                    isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6"
        >
          {/* Question Type Badge */}
          <div className="mb-6">
            <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {currentQuestion.question_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuestion.question_text}
            </h2>
          </div>

          {/* Student Answer */}
          <div className={`p-6 rounded-xl mb-4 ${
            currentResponse?.is_correct
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {currentResponse?.is_correct ? (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">Your Answer:</div>
                <div className="text-lg">{formatAnswer(currentResponse?.student_answer)}</div>
              </div>
            </div>
          </div>

          {/* Correct Answer */}
          {showCorrectAnswer && !currentResponse?.is_correct && (
            <div className="p-6 rounded-xl bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">Correct Answer:</div>
                  <div className="text-lg text-blue-900 font-semibold">{formatAnswer(currentQuestion.correct_answer)}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

