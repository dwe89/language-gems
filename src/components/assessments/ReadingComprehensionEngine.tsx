'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';

interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  language: string;
  difficulty: 'foundation' | 'higher';
  theme: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
}

interface ComprehensionQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'matching' | 'gap-fill';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

interface ReadingAssessment {
  id: string;
  passage: ReadingPassage;
  questions: ComprehensionQuestion[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
}

interface ReadingComprehensionEngineProps {
  assessmentId?: string;
  language: string;
  difficulty: 'foundation' | 'higher';
  theme?: string;
  topic?: string;
  onComplete?: (results: AssessmentResults) => void;
  assignmentMode?: boolean;
}

interface AssessmentResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  detailedResults: QuestionResult[];
}

interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  timeSpent: number;
}

export default function ReadingComprehensionEngine({
  assessmentId,
  language,
  difficulty,
  theme,
  topic,
  onComplete,
  assignmentMode = false
}: ReadingComprehensionEngineProps) {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<ReadingAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, Date>>({});

  // Load assessment data
  useEffect(() => {
    loadAssessment();
  }, [assessmentId, language, difficulty, theme, topic]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isCompleted) {
      handleSubmitAssessment();
    }
  }, [timeRemaining, isCompleted]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      
      // If specific assessment ID is provided, load that
      if (assessmentId) {
        const response = await fetch(`/api/assessments/reading/${assessmentId}`);
        const data = await response.json();
        setAssessment(data);
      } else {
        // Generate assessment based on criteria
        const response = await fetch('/api/assessments/reading/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, difficulty, theme, topic })
        });
        const data = await response.json();
        setAssessment(data);
      }
      
      setTimeRemaining(assessment?.timeLimit ? assessment.timeLimit * 60 : 1800); // Default 30 minutes
      setStartTime(new Date());
      setQuestionStartTimes({ [assessment?.questions[0]?.id || '']: new Date() });
    } catch (error) {
      console.error('Error loading assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestionId = assessment?.questions[nextIndex]?.id;
      if (nextQuestionId) {
        setQuestionStartTimes(prev => ({
          ...prev,
          [nextQuestionId]: new Date()
        }));
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = (): AssessmentResults => {
    if (!assessment) {
      return {
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        timeSpent: 0,
        passed: false,
        detailedResults: []
      };
    }

    const detailedResults: QuestionResult[] = assessment.questions.map(question => {
      const userAnswer = userAnswers[question.id] || '';
      const isCorrect = checkAnswer(question, userAnswer);
      const questionStartTime = questionStartTimes[question.id];
      const timeSpent = questionStartTime ? Date.now() - questionStartTime.getTime() : 0;

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
        timeSpent: Math.round(timeSpent / 1000) // Convert to seconds
      };
    });

    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const totalPoints = detailedResults.reduce((sum, r) => sum + r.points, 0);
    const maxPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const score = Math.round((totalPoints / maxPoints) * 100);
    const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
    const passed = score >= assessment.passingScore;

    return {
      score,
      totalQuestions: assessment.questions.length,
      correctAnswers,
      timeSpent,
      passed,
      detailedResults
    };
  };

  const checkAnswer = (question: ComprehensionQuestion, userAnswer: string | string[]): boolean => {
    const correctAnswer = question.correctAnswer;
    
    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      return correctAnswer.length === userAnswer.length && 
             correctAnswer.every(answer => userAnswer.includes(answer));
    }
    
    if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
      return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
    }
    
    return false;
  };

  const handleSubmitAssessment = async () => {
    const assessmentResults = calculateResults();
    setResults(assessmentResults);
    setIsCompleted(true);

    // Save results to database
    try {
      await fetch('/api/assessments/reading/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          assessmentId: assessment?.id,
          results: assessmentResults,
          assignmentMode
        })
      });
    } catch (error) {
      console.error('Error saving results:', error);
    }

    // Call completion callback
    if (onComplete) {
      onComplete(assessmentResults);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading reading assessment...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Assessment not found</p>
      </div>
    );
  }

  if (isCompleted && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Assessment Complete!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{results.score}%</div>
              <div className="text-gray-600">Final Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-gray-600">Time Spent</div>
            </div>
          </div>

          <div className={`text-center p-4 rounded-lg mb-6 ${
            results.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="text-xl font-semibold">
              {results.passed ? '🎉 Congratulations! You passed!' : '📚 Keep practicing! You can do better!'}
            </div>
            <div className="text-sm mt-1">
              Passing score: {assessment.passingScore}%
            </div>
          </div>

          {!assignmentMode && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with timer and progress */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{assessment.passage.title}</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-semibold ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}`}>
              Time: {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading passage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
          <div className="prose max-w-none">
            <div className="text-sm text-gray-500 mb-4">
              {assessment.passage.wordCount} words • {assessment.passage.estimatedReadingTime} min read
            </div>
            <div className="whitespace-pre-line leading-relaxed">
              {assessment.passage.content}
            </div>
          </div>
        </div>

        {/* Current question */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1}</h2>
          
          <div className="mb-6">
            <p className="text-lg mb-4">{currentQuestion.question}</p>
            
            {/* Render question based on type */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={userAnswers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={userAnswers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter your answer here..."
                value={userAnswers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              />
            )}

            {currentQuestion.type === 'gap-fill' && (
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Fill in the blank..."
                  value={userAnswers[currentQuestion.id] as string || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {currentQuestionIndex === assessment.questions.length - 1 ? (
              <button
                onClick={handleSubmitAssessment}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
