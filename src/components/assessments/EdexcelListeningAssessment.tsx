'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';
import { EdexcelListeningAssessmentService, type EdexcelListeningQuestion, type EdexcelListeningQuestionResponse } from '../../services/edexcelListeningAssessmentService';
import {
  EdexcelMultipleChoiceQuestion,
  EdexcelMultipleResponseQuestion,
  EdexcelWordCloudQuestion,
  EdexcelOpenResponseAQuestion,
  EdexcelOpenResponseBQuestion,
  EdexcelOpenResponseCQuestion,
  EdexcelMultiPartQuestion,
  EdexcelDictationQuestion
} from './EdexcelListeningQuestionTypes';

interface EdexcelListeningAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: string;
  difficulty: 'foundation' | 'higher';
  identifier: string;
  onComplete: (results: any) => void;
  onQuestionComplete: (questionId: string, answer: any, timeSpent: number) => void;
}

interface QuestionComponentProps {
  question: EdexcelListeningQuestion;
  userAnswer: any;
  onAnswerChange: (answer: any) => void;
}

export default function EdexcelListeningAssessment({
  language,
  difficulty,
  identifier,
  onComplete,
  onQuestionComplete
}: EdexcelListeningAssessmentProps) {
  // State management
  const { user, isLoading: authLoading } = useUnifiedAuth();
  const [questions, setQuestions] = useState<EdexcelListeningQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentService] = useState(() => new EdexcelListeningAssessmentService());
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  
  // Timer and audio state
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioPlayCounts, setAudioPlayCounts] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const totalQuestions = questions.length;

  // Get section information
  const getSectionInfo = (questionNumber: number, tier: 'foundation' | 'higher') => {
    if (tier === 'foundation') {
      return questionNumber <= 11 ? 'A' : 'B';
    } else {
      return questionNumber <= 9 ? 'A' : 'B';
    }
  };

  const getSectionTitle = (section: 'A' | 'B') => {
    return section === 'A' ? 'Section A: Listening Comprehension (40 marks)' : 'Section B: Dictation (10 marks)';
  };

  // Load assessment and questions
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Find the assessment
        const assessment = await assessmentService.findAssessment(language, difficulty, identifier);
        if (!assessment) {
          setError('Assessment not found');
          return;
        }

        setAssessmentId(assessment.id);
        
        // Set timer based on difficulty
        const timeLimit = difficulty === 'foundation' ? 45 : 60; // minutes
        setTimeRemaining(timeLimit * 60); // convert to seconds
        setIsTimerActive(true);

        // Load questions
        const questionsData = await assessmentService.getQuestionsByAssessmentId(assessment.id);
        console.log('Loaded questions data:', questionsData);

        if (!questionsData || questionsData.length === 0) {
          setError('No questions found for this assessment');
          return;
        }

        // Log the first question to debug data structure
        if (questionsData.length > 0) {
          console.log('First question data:', questionsData[0]);
          console.log('First question data.data:', questionsData[0].data);
        }

        setQuestions(questionsData);
        setQuestionStartTime(Date.now());

        // Start assessment attempt
        const newResultId = await assessmentService.startAssessment(
          assessment.id,
          user?.id || 'anonymous'
        );
        
        if (newResultId) {
          setResultId(newResultId);
        }

      } catch (err) {
        console.error('Error loading assessment:', err);
        setError('Failed to load assessment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [language, difficulty, identifier, assessmentService, user]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          handleSubmitAssessment(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer changes
  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle audio playback
  const handlePlayAudio = () => {
    if (!currentQuestion?.audioUrl) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Stop any existing audio first
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);

        // Track audio play count
        setAudioPlayCounts(prev => ({
          ...prev,
          [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1
        }));
      }
    }
  };

  // Handle navigation
  const handleNextQuestion = () => {
    // Stop any playing audio when navigating
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }

    if (currentQuestion) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      onQuestionComplete(currentQuestion.id, userAnswers[currentQuestion.id], timeSpent);
    }

    if (isLastQuestion) {
      handleSubmitAssessment();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePreviousQuestion = () => {
    // Stop any playing audio when navigating
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  // Submit assessment
  const handleSubmitAssessment = async () => {
    if (!resultId || !assessmentId) return;

    try {
      setIsLoading(true);
      
      const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      // Create responses for all questions
      const responses: EdexcelListeningQuestionResponse[] = questions.map(question => {
        const userAnswer = userAnswers[question.id];
        const isCorrect = false; // This would need proper answer checking logic
        
        return {
          question_id: question.id,
          question_number: question.question_number,
          student_answer: userAnswer,
          correct_answer: null, // Would come from question data
          is_correct: isCorrect,
          points_awarded: isCorrect ? question.marks : 0,
          marks_possible: question.marks,
          time_spent_seconds: 0, // Would track per question
          audio_play_count: audioPlayCounts[question.id] || 0
        };
      });

      const success = await assessmentService.submitAssessment(
        resultId,
        responses,
        totalTimeSpent,
        audioPlayCounts
      );

      if (success) {
        const results = await assessmentService.getAssessmentResults(resultId);
        setFinalResults(results);
        setIsAssessmentComplete(true);
        setIsTimerActive(false);
        onComplete(results);
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render question based on type
  const renderQuestion = (question: EdexcelListeningQuestion) => {
    const props: QuestionComponentProps = {
      question,
      userAnswer: userAnswers[question.id],
      onAnswerChange: (answer) => handleAnswerChange(question.id, answer)
    };

    switch (question.question_type) {
      case 'multiple-choice':
        return <EdexcelMultipleChoiceQuestion {...props} />;
      case 'multiple-response':
        return <EdexcelMultipleResponseQuestion {...props} />;
      case 'word-cloud':
        return <EdexcelWordCloudQuestion {...props} />;
      case 'open-response-a':
        return <EdexcelOpenResponseAQuestion {...props} />;
      case 'open-response-b':
        return <EdexcelOpenResponseBQuestion {...props} />;
      case 'open-response-c':
        return <EdexcelOpenResponseCQuestion {...props} />;
      case 'multi-part':
        return <EdexcelMultiPartQuestion {...props} />;
      case 'dictation':
        return <EdexcelDictationQuestion {...props} />;
      default:
        return (
          <div className="text-center text-gray-500 p-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Question type not supported: {question.question_type}</p>
          </div>
        );
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Assessment...</h2>
          <p className="text-gray-600">Preparing your Edexcel listening test</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isAssessmentComplete && finalResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
              <p className="text-gray-600">Your Edexcel listening assessment has been submitted.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Score</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {finalResults.raw_score}/{finalResults.total_possible_score}
                </p>
                <p className="text-sm text-blue-700">
                  {Math.round(finalResults.percentage_score)}%
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Section A</h3>
                <p className="text-3xl font-bold text-green-600">
                  {finalResults.section_a_score}/40
                </p>
                <p className="text-sm text-green-700">Listening Comprehension</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Section B</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {finalResults.section_b_score}/10
                </p>
                <p className="text-sm text-purple-700">Dictation</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.location.href = '/exam-style-assessment'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Another Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600">This assessment doesn't have any questions yet.</p>
        </div>
      </div>
    );
  }

  const currentSection = getSectionInfo(currentQuestion.question_number, difficulty);
  const sectionTitle = getSectionTitle(currentSection);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Edexcel Listening Assessment
              </h1>
              <p className="text-sm text-gray-600">
                {language.toUpperCase()} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} • {identifier}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-mono font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress and Section Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{sectionTitle}</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        {currentQuestion.audioUrl && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayAudio}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play Audio'}
                </button>
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Played {audioPlayCounts[currentQuestion.id] || 0} time{(audioPlayCounts[currentQuestion.id] || 0) !== 1 ? 's' : ''}
              </div>
            </div>
            
            <audio
              ref={audioRef}
              src={currentQuestion.audioUrl}
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}

        {/* Question Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
            <p className="text-gray-700 mb-4">{currentQuestion.instructions}</p>
          </div>

          {renderQuestion(currentQuestion)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleNextQuestion}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLastQuestion ? 'Submit Assessment' : 'Next Question'}
              {!isLastQuestion && <ArrowRight className="h-5 w-5 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
