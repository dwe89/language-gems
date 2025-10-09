'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { AQADictationAssessmentService, AQADictationQuestion, AQADictationQuestionResponse } from '../../services/aqaDictationAssessmentService';

interface DictationAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: 'KS3' | 'KS4';
  difficulty: 'foundation' | 'higher';
  identifier: string; // paper-1, paper-2, etc.
  onComplete: (results: any) => void;
  onQuestionComplete?: (questionId: string, answer: any, timeSpent: number) => void;
}

export default function DictationAssessment({
  language,
  difficulty,
  identifier,
  onComplete,
  onQuestionComplete
}: DictationAssessmentProps) {
  // State management
  const { user, isLoading: authLoading } = useUnifiedAuth();
  const [questions, setQuestions] = useState<AQADictationQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, AQADictationQuestionResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentService] = useState(() => new AQADictationAssessmentService());
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioType, setCurrentAudioType] = useState<'normal' | 'very_slow' | null>(null);
  const [audioPlayCounts, setAudioPlayCounts] = useState<Record<string, { normal: number; very_slow: number }>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioLoadingRef = useRef(false);
  
  // Question state
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResults, setFinalResults] = useState<any>(null);

  // Load assessment and questions
  useEffect(() => {
    // Don't load if auth is still loading
    if (authLoading) {
      return;
    }

    const loadAssessment = async () => {
      try {
        setIsLoading(true);

        // Get assessment definition
        const assessment = await assessmentService.getAssessmentByLevel(difficulty, language, identifier);
        if (!assessment) {
          console.error('Assessment not found');
          return;
        }

        setAssessmentId(assessment.id);

        // Get questions
        const assessmentQuestions = await assessmentService.getQuestionsForAssessment(assessment.id);
        setQuestions(assessmentQuestions);

        // Only start assessment attempt if user is logged in
        if (user) {
          try {
            const newResultId = await assessmentService.startAssessment(user.id, assessment.id);
            setResultId(newResultId);
          } catch (error) {
            console.warn('Could not start assessment tracking (continuing in practice mode):', error);
            // Continue without result tracking for practice mode
          }
        }

        // Set timer
        const timeLimit = assessment.time_limit_minutes * 60; // Convert to seconds
        setTimeRemaining(timeLimit);
        setIsTimerActive(true);

        // Initialize audio play counts
        const initialCounts: Record<string, { normal: number; very_slow: number }> = {};
        assessmentQuestions.forEach(q => {
          initialCounts[q.id] = { normal: 0, very_slow: 0 };
        });
        setAudioPlayCounts(initialCounts);

      } catch (error) {
        console.error('Error loading dictation assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [user, authLoading, difficulty, language, identifier, assessmentService]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isTimerActive && timeRemaining === 0) {
      handleSubmitAssessment();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isTimerActive]);

  // Initialize persistent audio element
  useEffect(() => {
    mountedRef.current = true;
    
    // Create a single persistent audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'none';
    }
    
    return () => {
      mountedRef.current = false;
      audioLoadingRef.current = false;
      
      // Cleanup audio when component unmounts
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
          audioRef.current.onloadstart = null;
          audioRef.current.oncanplay = null;
          audioRef.current.onloadeddata = null;
          audioRef.current.src = '';
          audioRef.current.load();
          audioRef.current = null;
        }
      } catch (error) {
        // Ignore cleanup errors during unmount
        console.warn('Audio cleanup error (safe to ignore):', error);
      }
    };
  }, []);

  // Audio management
  const playAudio = async (audioUrl: string, audioType: 'normal' | 'very_slow') => {
    if (!audioUrl || !audioRef.current || audioLoadingRef.current) return;

    try {
      audioLoadingRef.current = true;
      
      // Stop current audio if playing
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Clear all event handlers
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.onloadstart = null;
      audioRef.current.oncanplay = null;
      audioRef.current.onloadeddata = null;

      // Update play count - capture current question ID at time of play
      const currentQuestion = questions[currentQuestionIndex];
      const questionId = currentQuestion?.id;
      if (questionId && mountedRef.current) {
        setAudioPlayCounts(prev => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            [audioType]: (prev[questionId]?.[audioType] || 0) + 1
          }
        }));
      }

      // Set up event handlers
      const handleAudioEnd = () => {
        if (mountedRef.current) {
          setIsPlaying(false);
          setCurrentAudioType(null);
          audioLoadingRef.current = false;
        }
      };

      const handleAudioError = (error: string | Event) => {
        console.error('Error playing audio:', error);
        if (mountedRef.current) {
          setIsPlaying(false);
          setCurrentAudioType(null);
          audioLoadingRef.current = false;
        }
      };

      const handleCanPlay = () => {
        if (mountedRef.current && audioRef.current && !isPlaying) {
          audioRef.current.play().catch(handleAudioError);
        }
      };

      // Set up event listeners
      audioRef.current.onended = handleAudioEnd;
      audioRef.current.onerror = handleAudioError;
      audioRef.current.oncanplay = handleCanPlay;

      // Update state before loading
      if (mountedRef.current) {
        setCurrentAudioType(audioType);
        setIsPlaying(true);
      }

      // Load the new audio
      audioRef.current.src = audioUrl;
      audioRef.current.load();

    } catch (error) {
      console.error('Error setting up audio:', error);
      if (mountedRef.current) {
        setIsPlaying(false);
        setCurrentAudioType(null);
      }
      audioLoadingRef.current = false;
    }
  };

  const stopAudio = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (error) {
      // Ignore stop errors during rapid navigation
      console.warn('Audio stop error (safe to ignore):', error);
    }

    setIsPlaying(false);
    setCurrentAudioType(null);
    audioLoadingRef.current = false;
  };

  // Navigation
  const goToNextQuestion = () => {
    if (!mountedRef.current) return;

    stopAudio(); // Stop any playing audio before navigation
    saveCurrentResponse();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
      setQuestionStartTime(Date.now());
    } else {
      // This is the last question, submit the assessment
      handleSubmitAssessment();
    }
  };

  const goToPreviousQuestion = () => {
    if (!mountedRef.current || currentQuestionIndex <= 0) return;

    stopAudio(); // Stop any playing audio before navigation
    saveCurrentResponse();

    setCurrentQuestionIndex(prev => prev - 1);
    // Load previous answer if exists
    const prevQuestion = questions[currentQuestionIndex - 1];
    const prevResponse = responses[prevQuestion.id];
    setCurrentAnswer(prevResponse?.student_answer || '');
    setQuestionStartTime(Date.now());
  };

  // Save current response
  const saveCurrentResponse = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = currentAnswer.trim().toLowerCase() === currentQuestion.sentence_text.trim().toLowerCase();
    
    const response: AQADictationQuestionResponse = {
      question_id: currentQuestion.id,
      question_number: currentQuestion.question_number,
      student_answer: currentAnswer.trim(),
      correct_answer: currentQuestion.sentence_text,
      is_correct: isCorrect,
      points_awarded: isCorrect ? currentQuestion.marks : 0,
      time_spent_seconds: timeSpent,
      normal_audio_plays: audioPlayCounts[currentQuestion.id]?.normal || 0,
      very_slow_audio_plays: audioPlayCounts[currentQuestion.id]?.very_slow || 0,
      theme: currentQuestion.theme,
      topic: currentQuestion.topic,
      marks_possible: currentQuestion.marks
    };

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));

    onQuestionComplete?.(currentQuestion.id, response, timeSpent);
  };

  // Submit assessment
  const handleSubmitAssessment = async () => {
    // Save current response first
    saveCurrentResponse();
    setIsTimerActive(false);

    // Wait a moment for state to update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get all responses including the one we just saved
    const allResponses = Object.values(responses);

    // Add current response if it's not already included
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && !responses[currentQuestion.id]) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      const isCorrect = currentAnswer.trim().toLowerCase() === currentQuestion.sentence_text.trim().toLowerCase();

      const currentResponse: AQADictationQuestionResponse = {
        question_id: currentQuestion.id,
        question_number: currentQuestion.question_number,
        student_answer: currentAnswer.trim(),
        correct_answer: currentQuestion.sentence_text,
        is_correct: isCorrect,
        points_awarded: isCorrect ? currentQuestion.marks : 0,
        time_spent_seconds: timeSpent,
        normal_audio_plays: audioPlayCounts[currentQuestion.id]?.normal || 0,
        very_slow_audio_plays: audioPlayCounts[currentQuestion.id]?.very_slow || 0,
        theme: currentQuestion.theme,
        topic: currentQuestion.topic,
        marks_possible: currentQuestion.marks
      };

      allResponses.push(currentResponse);
    }

    const totalTimeSeconds = Math.floor((Date.now() - questionStartTime) / 1000);

    // If we have a result ID (logged in user), submit to database
    if (resultId && assessmentId) {
      try {
        await assessmentService.submitAssessment(
          resultId,
          allResponses,
          totalTimeSeconds,
          audioPlayCounts
        );
      } catch (error) {
        console.error('Error submitting dictation assessment:', error);
        // Continue anyway for practice mode
      }
    }

    // Prepare final results
    const results = {
      responses: allResponses,
      totalScore: allResponses.reduce((sum, r) => sum + r.points_awarded, 0),
      totalPossible: allResponses.reduce((sum, r) => sum + r.marks_possible, 0),
      timeSpent: totalTimeSeconds,
      audioPlayCounts,
      practiceMode: !resultId // Indicate if this was practice mode
    };

    // Set completion state to show results screen
    setFinalResults(results);
    setIsCompleted(true);

    // Also call onComplete for parent component
    onComplete(results);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Assessment...</h2>
          <p className="text-gray-600">Preparing your dictation questions</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600">This assessment doesn't have any questions yet.</p>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (isCompleted && finalResults) {
    const percentage = finalResults.totalPossible > 0 ?
      Math.round((finalResults.totalScore / finalResults.totalPossible) * 100) : 0;

    return (
      <div key="completion-screen" className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle key="complete-icon" className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
              <p className="text-gray-600">Well done! Here are your results:</p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Score</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {finalResults.totalScore}/{finalResults.totalPossible}
                </p>
                <p className="text-blue-700">{percentage}%</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Time Spent</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {formatTime(finalResults.timeSpent)}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Questions</h3>
                <p className="text-3xl font-bold text-green-600">
                  {finalResults.responses.length}
                </p>
                <p className="text-green-700">Completed</p>
              </div>
            </div>

            {/* Question-by-Question Results */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Question Results</h2>
              <div className="space-y-4">
                {finalResults.responses.map((response: AQADictationQuestionResponse, index: number) => (
                  <div key={`result-${response.question_id}`} className={`border rounded-lg p-4 ${
                    response.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Question {index + 1}</h3>
                      <div className="flex items-center">
                        {response.is_correct ? (
                          <CheckCircle key={`check-${response.question_id}`} className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle key={`x-${response.question_id}`} className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="font-semibold">
                          {response.points_awarded}/{response.marks_possible} points
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Your answer:</strong> &quot;{response.student_answer}&quot;</p>
                      <p><strong>Correct answer:</strong> &quot;{response.correct_answer}&quot;</p>
                      <p><strong>Audio plays:</strong> Normal: {response.normal_audio_plays}, Very slow: {response.very_slow_audio_plays}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Safety check for current question
  if (!currentQuestion) {
    return (
      <div key="loading-question" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Question...</h2>
          <p className="text-gray-600">Preparing your dictation question</p>
        </div>
      </div>
    );
  }

  return (
    <div key="assessment-screen" className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header with timer and progress */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock key="clock-icon" className="h-5 w-5 text-gray-500 mr-2" />
              <span className={`font-semibold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            <div className="flex-1 mx-8">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <button
              onClick={handleSubmitAssessment}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Question {currentQuestion.question_number}
            </h2>
            <p className="text-gray-600">
              Listen carefully and type exactly what you hear
            </p>
          </div>

          {/* Audio controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <Volume2 key="volume-normal" className="h-5 w-5 mr-2" />
                Normal Speed
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">
                  Played: {audioPlayCounts[currentQuestion.id]?.normal || 0} times
                </span>
                <button
                  onClick={() => currentQuestion.audio_url_normal && playAudio(currentQuestion.audio_url_normal, 'normal')}
                  disabled={!currentQuestion.audio_url_normal || isPlaying}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying && currentAudioType === 'normal' ? (
                    <>
                      <Pause key="pause-normal" className="h-4 w-4 mr-2" />
                      Playing...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Play key="play-normal-wait" className="h-4 w-4 mr-2 opacity-50" />
                      Wait...
                    </>
                  ) : (
                    <>
                      <Play key="play-normal" className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <VolumeX key="volume-slow" className="h-5 w-5 mr-2" />
                Very Slow Speed
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  Played: {audioPlayCounts[currentQuestion.id]?.very_slow || 0} times
                </span>
                <button
                  onClick={() => currentQuestion.audio_url_very_slow && playAudio(currentQuestion.audio_url_very_slow, 'very_slow')}
                  disabled={!currentQuestion.audio_url_very_slow || isPlaying}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying && currentAudioType === 'very_slow' ? (
                    <>
                      <Pause key="pause-slow" className="h-4 w-4 mr-2" />
                      Playing...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Play key="play-slow-wait" className="h-4 w-4 mr-2 opacity-50" />
                      Wait...
                    </>
                  ) : (
                    <>
                      <Play key="play-slow" className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stop audio button */}
          {isPlaying && (
            <div className="text-center mb-6">
              <button
                onClick={stopAudio}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                <Pause key="pause-stop" className="h-4 w-4 mr-2 inline" />
                Stop Audio
              </button>
            </div>
          )}

          {/* Answer input */}
          <div className="mb-8">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <textarea
              id="answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type what you hear here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              Include all punctuation marks and accents as you hear them.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft key="arrow-left" className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentAnswer('')}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                <RotateCcw key="rotate-ccw" className="h-4 w-4 mr-2" />
                Clear
              </button>
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                key="finish-button"
                onClick={handleSubmitAssessment}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <CheckCircle key="check-circle" className="h-4 w-4 mr-2" />
                Finish
              </button>
            ) : (
              <button
                key="next-button"
                onClick={goToNextQuestion}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Next
                <ArrowRight key="arrow-right" className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
