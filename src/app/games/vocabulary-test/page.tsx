'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Play,
  RotateCcw,
  Target,
  BookOpen,
  Volume2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { VocabularyTestService } from '../../../services/vocabularyTestService';

interface TestQuestion {
  id: string;
  question_text: string;
  question_type: 'translation_to_english' | 'translation_to_target' | 'multiple_choice' | 'audio_spelling';
  correct_answer: string;
  options?: string[];
  audio_url?: string;
  vocabulary_id: string;
}

interface TestAttempt {
  id: string;
  test_id: string;
  student_id: string;
  questions: TestQuestion[];
  answers: Record<string, string>;
  score: number;
  total_questions: number;
  time_spent: number;
  completed_at: string | null;
  started_at: string;
}

export default function VocabularyTestPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  const isAssignmentMode = mode === 'assignment';
  
  const [testService, setTestService] = useState<VocabularyTestService | null>(null);
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<any>(null);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');


  // Load test data
  useEffect(() => {
    if (!supabase || !user || !assignmentId) return;

    const loadTestData = async () => {
      try {
        setLoading(true);

        // Initialize service if not already done
        let service = testService;
        if (!service) {
          service = new VocabularyTestService(supabase);
          setTestService(service);
        }

        // Get assignment details to find the vocabulary test ID
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select('game_config')
          .eq('id', assignmentId)
          .single();

        if (assignmentError || !assignmentData) {
          setError('Assignment not found');
          return;
        }

        const vocabularyTestId = assignmentData.game_config?.vocabulary_test_id;
        if (!vocabularyTestId) {
          setError('Vocabulary test not found in assignment');
          return;
        }

        // Load test details
        const test = await service.getTestById(vocabularyTestId);
        if (!test) {
          setError('Test not found');
          return;
        }

        setTestData(test);
        
        // Check if student has an existing attempt
        const existingAttempt = await service.getStudentAttempt(vocabularyTestId, user.id);
        if (existingAttempt && !existingAttempt.completed_at) {
          // Resume existing attempt
          setCurrentAttempt(existingAttempt);
          setAnswers(existingAttempt.answers || {});
          setTestStarted(true);

          // Calculate time remaining
          if (test.settings?.time_limit_minutes) {
            const startTime = new Date(existingAttempt.started_at).getTime();
            const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
            const remaining = Math.max(0, test.settings.time_limit_minutes - elapsed);
            setTimeRemaining(remaining * 60); // convert to seconds
          }
        }

      } catch (err) {
        console.error('Error loading test data:', err);
        setError('Failed to load test');
      } finally {
        setLoading(false);
      }
    };

    loadTestData();
  }, [user, assignmentId, supabase]);

  // Timer effect
  useEffect(() => {
    if (!testStarted || testCompleted || timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          // Time's up - auto submit
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testCompleted, timeRemaining]);

  const handleStartTest = async () => {
    if (!supabase || !testData || !user) return;

    try {
      // Initialize service if not already done
      let service = testService;
      if (!service) {
        service = new VocabularyTestService(supabase);
        setTestService(service);
      }

      const attempt = await service.startTest(testData.id, user.id);
      setCurrentAttempt(attempt);
      setTestStarted(true);

      if (testData.settings?.time_limit_minutes) {
        setTimeRemaining(testData.settings.time_limit_minutes * 60);
      }
    } catch (err) {
      console.error('Error starting test:', err);
      setError('Failed to start test');
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitTest = async () => {
    if (!supabase || !currentAttempt || !testData) return;

    try {
      // Initialize service if not already done
      let service = testService;
      if (!service) {
        service = new VocabularyTestService(supabase);
        setTestService(service);
      }

      const timeSpent = testData.settings?.time_limit_minutes
        ? (testData.settings.time_limit_minutes * 60) - (timeRemaining || 0)
        : 0;

      const results = await service.submitTestResults(
        currentAttempt.id,
        answers,
        timeSpent
      );

      setResults(results);
      setTestCompleted(true);
      setShowResults(true);

      // If this is an assignment, update assignment progress
      if (isAssignmentMode && assignmentId) {
        await updateAssignmentProgress(results);
      }

    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test');
    }
  };

  const updateAssignmentProgress = async (testResults: any) => {
    try {
      const { error } = await supabase
        .from('enhanced_assignment_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: user?.id,
          status: 'completed',
          best_score: testResults.score,
          best_accuracy: testResults.accuracy,
          total_time_spent: testResults.time_spent,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating assignment progress:', error);
      }
    } catch (err) {
      console.error('Error updating assignment progress:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full mx-4">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full mx-4">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h2>
            <p className="text-gray-600 mb-6">The vocabulary test could not be loaded.</p>
            <button
              onClick={() => router.back()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white hover:text-indigo-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Assignment
          </button>
          
          {timeRemaining !== null && testStarted && !testCompleted && (
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Clock className="h-5 w-5 text-white mr-2" />
              <span className={`text-white font-mono text-lg ${timeRemaining < 300 ? 'text-red-300' : ''}`}>
                {formatTime(Math.floor(timeRemaining))}
              </span>
            </div>
          )}
        </div>

        {/* Test Content */}
        <div className="max-w-4xl mx-auto">
          {!testStarted ? (
            // Test Start Screen
            <div className="bg-white rounded-xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <Target className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{testData.title}</h1>
                {testData.description && (
                  <p className="text-gray-600 text-lg">{testData.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Test Details</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {testData.question_count} questions</li>
                    <li>• {testData.test_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</li>
                    {testData.settings?.time_limit_minutes && (
                      <li>• {testData.settings.time_limit_minutes} minute time limit</li>
                    )}
                    <li>• {testData.settings?.max_attempts || 'Unlimited'} attempts allowed</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Answer all questions to the best of your ability</li>
                    <li>• You can navigate between questions</li>
                    {testData.settings?.show_correct_answers && (
                      <li>• Correct answers will be shown after submission</li>
                    )}
                    <li>• Make sure to submit before time runs out</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleStartTest}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Play className="h-5 w-5 mr-2 inline" />
                  Start Test
                </button>
              </div>
            </div>
          ) : showResults ? (
            // Results Screen
            <div className="bg-white rounded-xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h1>
                <p className="text-gray-600">Here are your results</p>
              </div>

              {results && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{results.score}</div>
                    <div className="text-sm text-blue-800">Score (XP)</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(results.accuracy)}%</div>
                    <div className="text-sm text-green-800">Accuracy</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(results.time_spent / 60)}m</div>
                    <div className="text-sm text-purple-800">Time Spent</div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => router.back()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Return to Assignment
                </button>
              </div>
            </div>
          ) : (
            // Test Taking Interface
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Progress Bar */}
              <div className="bg-gray-100 px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestionIndex + 1} of {currentAttempt?.questions.length || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Object.keys(answers).length} answered
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / (currentAttempt?.questions.length || 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Question Content */}
              {currentAttempt?.questions[currentQuestionIndex] && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {currentAttempt.questions[currentQuestionIndex].question_text}
                    </h2>
                    
                    {/* Answer Input based on question type */}
                    {currentAttempt.questions[currentQuestionIndex].question_type === 'multiple_choice' ? (
                      <div className="space-y-3">
                        {currentAttempt.questions[currentQuestionIndex].options?.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${currentAttempt.questions[currentQuestionIndex].id}`}
                              value={option}
                              checked={answers[currentAttempt.questions[currentQuestionIndex].id] === option}
                              onChange={(e) => handleAnswerChange(currentAttempt.questions[currentQuestionIndex].id, e.target.value)}
                              className="mr-3"
                            />
                            <span className="text-gray-900">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          value={answers[currentAttempt.questions[currentQuestionIndex].id] || ''}
                          onChange={(e) => handleAnswerChange(currentAttempt.questions[currentQuestionIndex].id, e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex space-x-4">
                      {currentQuestionIndex === (currentAttempt?.questions.length || 1) - 1 ? (
                        <button
                          onClick={handleSubmitTest}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200"
                        >
                          Submit Test
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentQuestionIndex(prev => Math.min((currentAttempt?.questions.length || 1) - 1, prev + 1))}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
