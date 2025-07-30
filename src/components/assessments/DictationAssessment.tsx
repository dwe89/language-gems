'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthProvider';
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
  level,
  difficulty,
  identifier,
  onComplete,
  onQuestionComplete
}: DictationAssessmentProps) {
  // State management
  const { user } = useAuth();
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
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioType, setCurrentAudioType] = useState<'normal' | 'very_slow' | null>(null);
  const [audioPlayCounts, setAudioPlayCounts] = useState<Record<string, { normal: number; very_slow: number }>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Question state
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Load assessment and questions
  useEffect(() => {
    const loadAssessment = async () => {
      if (!user) return;
      
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
        
        // Start assessment attempt
        const newResultId = await assessmentService.startAssessment(user.id, assessment.id);
        setResultId(newResultId);
        
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
  }, [user, difficulty, language, identifier, assessmentService]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitAssessment();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isTimerActive]);

  // Audio management
  const playAudio = async (audioUrl: string, audioType: 'normal' | 'very_slow') => {
    if (!audioUrl) return;
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setCurrentAudioType(audioType);
      setIsPlaying(true);
      
      // Update play count
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        setAudioPlayCounts(prev => ({
          ...prev,
          [currentQuestion.id]: {
            ...prev[currentQuestion.id],
            [audioType]: prev[currentQuestion.id][audioType] + 1
          }
        }));
      }
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudioType(null);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudioType(null);
        console.error('Error playing audio');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setCurrentAudioType(null);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAudioType(null);
  };

  // Navigation
  const goToNextQuestion = () => {
    saveCurrentResponse();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
      setQuestionStartTime(Date.now());
    }
  };

  const goToPreviousQuestion = () => {
    saveCurrentResponse();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Load previous answer if exists
      const prevQuestion = questions[currentQuestionIndex - 1];
      const prevResponse = responses[prevQuestion.id];
      setCurrentAnswer(prevResponse?.student_answer || '');
      setQuestionStartTime(Date.now());
    }
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
    if (!resultId || !assessmentId) return;
    
    saveCurrentResponse();
    setIsTimerActive(false);
    
    const allResponses = Object.values(responses);
    const totalTimeSeconds = questions.length > 0 ? 
      (questions[0].assessment_id === assessmentId ? 
        Math.floor((Date.now() - questionStartTime) / 1000) : 0) : 0;
    
    try {
      await assessmentService.submitAssessment(
        resultId,
        allResponses,
        totalTimeSeconds,
        audioPlayCounts
      );
      
      onComplete({
        responses: allResponses,
        totalScore: allResponses.reduce((sum, r) => sum + r.points_awarded, 0),
        totalPossible: allResponses.reduce((sum, r) => sum + r.marks_possible, 0),
        timeSpent: totalTimeSeconds,
        audioPlayCounts
      });
    } catch (error) {
      console.error('Error submitting dictation assessment:', error);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header with timer and progress */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
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
                <Volume2 className="h-5 w-5 mr-2" />
                Normal Speed
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">
                  Played: {audioPlayCounts[currentQuestion.id]?.normal || 0} times
                </span>
                <button
                  onClick={() => currentQuestion.audio_url_normal && playAudio(currentQuestion.audio_url_normal, 'normal')}
                  disabled={!currentQuestion.audio_url_normal || (isPlaying && currentAudioType === 'normal')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isPlaying && currentAudioType === 'normal' ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <VolumeX className="h-5 w-5 mr-2" />
                Very Slow Speed
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  Played: {audioPlayCounts[currentQuestion.id]?.very_slow || 0} times
                </span>
                <button
                  onClick={() => currentQuestion.audio_url_very_slow && playAudio(currentQuestion.audio_url_very_slow, 'very_slow')}
                  disabled={!currentQuestion.audio_url_very_slow || (isPlaying && currentAudioType === 'very_slow')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isPlaying && currentAudioType === 'very_slow' ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
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
                <Pause className="h-4 w-4 mr-2 inline" />
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
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentAnswer('')}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </button>
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitAssessment}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Finish
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
