'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Send,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { 
  VocabularyTestService, 
  VocabularyTest, 
  VocabularyTestQuestion, 
  VocabularyTestResponse 
} from '../../services/vocabularyTestService';

interface VocabularyTestInterfaceProps {
  testId: string;
  assignmentId?: string;
  onTestComplete?: (resultId: string, score: number, passed: boolean) => void;
  onExit?: () => void;
}

interface TestSession {
  resultId: string;
  test: VocabularyTest;
  questions: VocabularyTestQuestion[];
  startTime: Date;
  timeRemaining: number;
}

export default function VocabularyTestInterface({
  testId,
  assignmentId,
  onTestComplete,
  onExit
}: VocabularyTestInterfaceProps) {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [testService] = useState(() => new VocabularyTestService(supabase));

  // Test session state
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<VocabularyTestResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize test session
  useEffect(() => {
    if (user) {
      initializeTest();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [user, testId]);

  // Start timer
  useEffect(() => {
    if (session && session.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSession(prev => {
          if (!prev || prev.timeRemaining <= 1) {
            handleTimeUp();
            return prev;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [session]);

  const initializeTest = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get test and questions
      const testData = await testService.getTestWithQuestions(testId);
      if (!testData) {
        throw new Error('Test not found');
      }

      // Start test attempt
      const resultId = await testService.startTestAttempt(testId, user.id, assignmentId);
      if (!resultId) {
        throw new Error('Failed to start test');
      }

      // Initialize session
      const startTime = new Date();
      const timeRemaining = testData.test.time_limit_minutes * 60;

      setSession({
        resultId,
        test: testData.test,
        questions: testData.questions,
        startTime,
        timeRemaining
      });

      // Initialize responses array
      const initialResponses: VocabularyTestResponse[] = testData.questions.map((question, index) => ({
        question_id: question.id,
        question_number: question.question_number,
        question_type: question.question_type,
        student_answer: '',
        correct_answer: question.correct_answer,
        is_correct: false,
        points_awarded: 0,
        time_spent_seconds: 0,
        hint_used: false
      }));

      setResponses(initialResponses);
    } catch (error: any) {
      setError(error.message || 'Failed to initialize test');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    handleSubmitTest();
  };

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
  };

  const handleAnswerSubmit = () => {
    if (!session) return;

    const currentQuestion = session.questions[currentQuestionIndex];
    const questionStartTime = responses[currentQuestionIndex]?.time_spent_seconds || 0;
    const timeSpent = Math.floor((Date.now() - session.startTime.getTime()) / 1000) - questionStartTime;

    // Validate answer
    const isCorrect = validateAnswer(currentAnswer, currentQuestion);
    const pointsAwarded = isCorrect ? session.test.points_per_question : 0;

    // Update response
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = {
      ...updatedResponses[currentQuestionIndex],
      student_answer: currentAnswer,
      is_correct: isCorrect,
      points_awarded: pointsAwarded,
      time_spent_seconds: timeSpent,
      hint_used: showHint
    };

    setResponses(updatedResponses);

    // Show immediate feedback if enabled
    if (session.test.show_immediate_feedback) {
      // Could show a brief feedback modal here
    }

    // Move to next question or finish
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
      setShowHint(false);
    } else {
      handleSubmitTest();
    }
  };

  const validateAnswer = (studentAnswer: string, question: VocabularyTestQuestion): boolean => {
    const normalizedStudent = studentAnswer.toLowerCase().trim();
    const normalizedCorrect = question.correct_answer.toLowerCase().trim();

    // Exact match
    if (normalizedStudent === normalizedCorrect) {
      return true;
    }

    // For translation questions, allow some flexibility
    if (question.question_type.includes('translation')) {
      // Remove common articles and check
      const cleanStudent = normalizedStudent.replace(/^(the|a|an|el|la|los|las|le|la|les|der|die|das)\s+/, '');
      const cleanCorrect = normalizedCorrect.replace(/^(the|a|an|el|la|los|las|le|la|les|der|die|das)\s+/, '');
      
      if (cleanStudent === cleanCorrect) {
        return true;
      }

      // Check if student answer is contained in correct answer or vice versa
      if (cleanStudent.length > 3 && cleanCorrect.includes(cleanStudent)) {
        return true;
      }
    }

    return false;
  };

  const handleSubmitTest = async () => {
    if (!session || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const totalTimeSpent = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
      
      const success = await testService.submitTestResults(
        session.resultId,
        responses,
        totalTimeSpent
      );

      if (!success) {
        throw new Error('Failed to submit test');
      }

      // Calculate final score
      const totalPoints = responses.reduce((sum, r) => sum + r.points_awarded, 0);
      const maxPoints = session.questions.length * session.test.points_per_question;
      const percentage = (totalPoints / maxPoints) * 100;
      const passed = percentage >= session.test.passing_score_percentage;

      onTestComplete?.(session.resultId, percentage, passed);
    } catch (error: any) {
      setError(error.message || 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const playAudio = async (url?: string, speed: 'normal' | 'slow' = 'normal') => {
    if (!url || !audioRef.current) return;

    try {
      setIsPlaying(true);
      audioRef.current.src = url;
      audioRef.current.playbackRate = speed === 'slow' ? 0.7 : 1.0;
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          {onExit && (
            <button
              onClick={onExit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{session.test.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {session.questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className={`h-5 w-5 ${session.timeRemaining < 300 ? 'text-red-500' : 'text-gray-500'}`} />
                <span className={`font-mono text-lg ${session.timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}`}>
                  {formatTime(session.timeRemaining)}
                </span>
              </div>

              {/* Exit button */}
              {onExit && (
                <button
                  onClick={onExit}
                  className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded"
                >
                  Exit
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {currentQuestion.question_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  
                  {currentQuestion.audio_url && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => playAudio(currentQuestion.audio_url, 'normal')}
                        className="flex items-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span>Normal</span>
                      </button>
                      <button
                        onClick={() => playAudio(currentQuestion.audio_url, 'slow')}
                        className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span>Slow</span>
                      </button>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentQuestion.question_text}
                </h2>
              </div>

              {/* Answer Input */}
              <div className="mb-8">
                {currentQuestion.question_type === 'multiple_choice' ? (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option}
                          checked={currentAnswer === option}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-lg">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={currentAnswer}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-full text-xl border-2 border-gray-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your answer..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAnswerSubmit();
                        }
                      }}
                    />
                    
                    {session.test.allow_hints && (
                      <div className="mt-4">
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                        </button>
                        
                        {showHint && (
                          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              The answer starts with: {currentQuestion.correct_answer.charAt(0).toUpperCase()}...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(prev => prev - 1);
                      setCurrentAnswer(responses[currentQuestionIndex - 1]?.student_answer || '');
                      setShowHint(false);
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleAnswerSubmit}
                  disabled={!currentAnswer.trim() || isSubmitting}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : currentQuestionIndex === session.questions.length - 1 ? (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Test</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
    </div>
  );
}
