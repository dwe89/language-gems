'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Star,
  Gem,
  Trophy
} from 'lucide-react';
import { readingComprehensionContent, ReadingText, ComprehensionQuestion } from '../../data/reading-comprehension-content';
import { AssessmentGamificationService } from '../../services/assessmentGamificationService';
import { createClient } from '@supabase/supabase-js';

interface ReadingComprehensionTaskProps {
  language: 'spanish' | 'french' | 'german';
  category?: string;
  subcategory?: string;
  difficulty?: 'foundation' | 'intermediate' | 'higher';
  assignmentMode?: boolean;
  onComplete?: (results: TaskResults) => void;
}

interface TaskResults {
  textId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  questionResults: QuestionResult[];
  passed: boolean;
}

interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  timeSpent: number;
}

export default function ReadingComprehensionTask({
  language,
  category,
  subcategory,
  difficulty,
  assignmentMode = false,
  onComplete
}: ReadingComprehensionTaskProps) {
  const { user } = useAuth();
  const [selectedText, setSelectedText] = useState<ReadingText | null>(null);
  const [questions, setQuestions] = useState<ComprehensionQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<TaskResults | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, Date>>({});
  const [timeSpent, setTimeSpent] = useState(0);

  // Gamification state
  const [gamificationService, setGamificationService] = useState<AssessmentGamificationService | null>(null);
  const [gamificationResults, setGamificationResults] = useState<{
    pointsEarned: number;
    achievementsUnlocked: any[];
    gemType: string;
    bonusMultiplier: number;
  } | null>(null);
  const [showGamificationResults, setShowGamificationResults] = useState(false);

  // Timer effect
  useEffect(() => {
    if (startTime && !showResults) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, showResults]);

  // Load content on component mount
  useEffect(() => {
    loadContent();
  }, [language, category, subcategory, difficulty]);

  const loadContent = () => {
    const languageKey = language === 'spanish' ? 'spanish' : language === 'french' ? 'french' : 'german';
    let availableTexts = readingComprehensionContent.texts[languageKey] || [];

    // Filter by category and subcategory if provided
    if (category) {
      availableTexts = availableTexts.filter(text => text.category === category);
    }
    if (subcategory) {
      availableTexts = availableTexts.filter(text => text.subcategory === subcategory);
    }
    if (difficulty) {
      availableTexts = availableTexts.filter(text => text.difficulty === difficulty);
    }

    if (availableTexts.length === 0) {
      // Fallback to any text in the language
      availableTexts = readingComprehensionContent.texts[languageKey] || [];
    }

    // Select a random text
    const randomText = availableTexts[Math.floor(Math.random() * availableTexts.length)];
    setSelectedText(randomText);

    // Load questions for this text
    const textQuestions = readingComprehensionContent.questions[languageKey]?.filter(
      q => q.textId === randomText?.id
    ) || [];
    setQuestions(textQuestions);

    // Initialize timing
    setStartTime(new Date());
    if (textQuestions.length > 0) {
      setQuestionStartTimes({ [textQuestions[0].id]: new Date() });
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestionId = questions[nextIndex].id;
      setQuestionStartTimes(prev => ({
        ...prev,
        [nextQuestionId]: new Date()
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = (): TaskResults => {
    const questionResults: QuestionResult[] = questions.map(question => {
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
        timeSpent: Math.round(timeSpent / 1000)
      };
    });

    const correctAnswers = questionResults.filter(r => r.isCorrect).length;
    const totalPoints = questionResults.reduce((sum, r) => sum + r.points, 0);
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const score = Math.round((totalPoints / maxPoints) * 100);
    const passed = score >= 60; // 60% pass rate

    return {
      textId: selectedText?.id || '',
      totalQuestions: questions.length,
      correctAnswers,
      score,
      timeSpent,
      questionResults,
      passed
    };
  };

  const checkAnswer = (question: ComprehensionQuestion, userAnswer: string | string[]): boolean => {
    const correctAnswer = question.correctAnswer;
    
    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      return correctAnswer.length === userAnswer.length && 
             correctAnswer.every(answer => 
               userAnswer.some(ua => ua.toLowerCase().trim() === answer.toLowerCase().trim())
             );
    }
    
    if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
      return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
    }
    
    return false;
  };

  const handleSubmit = async () => {
    const taskResults = calculateResults();
    setResults(taskResults);

    // Process gamification if user is logged in
    if (user?.id && !assignmentMode) {
      try {
        // Initialize gamification service
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const gamificationSvc = new AssessmentGamificationService(supabase);

        // Get user's previous best score for improvement tracking
        const { data: previousResults } = await supabase
          .from('assessment_progress')
          .select('percentage')
          .eq('user_id', user.id)
          .eq('assessment_type', 'reading-comprehension')
          .order('completed_at', { ascending: false })
          .limit(1);

        const previousBestScore = previousResults?.[0]?.percentage || 0;

        // Get current streak
        const { data: currentStreak } = await supabase.rpc('update_assessment_streak', {
          p_user_id: user.id,
          p_passed: taskResults.passed,
          p_perfect: taskResults.score === 100
        });

        // Process gamification
        const gamificationData = {
          userId: user.id,
          assessmentType: 'reading-comprehension' as const,
          overallScore: taskResults.correctAnswers,
          maxScore: taskResults.totalQuestions,
          percentage: taskResults.score,
          timeSpent,
          passed: taskResults.passed,
          streak: currentStreak || 0,
          previousBestScore
        };

        const gamificationResult = await gamificationSvc.processAssessmentCompletion(gamificationData);
        setGamificationResults(gamificationResult);

        // Show gamification results after a brief delay
        setTimeout(() => {
          setShowGamificationResults(true);
        }, 1000);

      } catch (error) {
        console.error('Error processing gamification:', error);
      }
    }

    setShowResults(true);

    // Save results to database
    try {
      await fetch('/api/reading-comprehension/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          textId: selectedText?.id,
          results: taskResults,
          assignmentMode
        })
      });
    } catch (error) {
      console.error('Error saving results:', error);
    }

    if (onComplete) {
      onComplete(taskResults);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setResults(null);
    setTimeSpent(0);
    loadContent();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!selectedText || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Content Available</h2>
          <p className="text-gray-500">No reading comprehension content found for the selected criteria.</p>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              results.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {results.passed ? 'Excellent Work!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-600">
              {results.passed ? 'You have successfully completed the task' : 'You can improve with more practice'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{results.score}%</div>
              <div className="text-gray-600">Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <div className="text-gray-600">Correct</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-gray-600">Time</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {results.passed ? 'PASSED' : 'FAILED'}
              </div>
              <div className="text-gray-600">Status</div>
            </div>
          </div>

          {/* Question by question results */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Question Results</h3>
            <div className="space-y-4">
              {results.questionResults.map((result, index) => {
                const question = questions.find(q => q.id === result.questionId);
                return (
                  <div key={result.questionId} className={`p-4 rounded-lg border ${
                    result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {result.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          )}
                          <span className="font-medium">Question {index + 1}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({result.points} {result.points === 1 ? 'point' : 'points'})
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{question?.question}</p>
                        <div className="text-sm">
                          <div className="mb-1">
                            <span className="font-medium">Your answer: </span>
                            <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {Array.isArray(result.userAnswer)
                                ? result.userAnswer.join(', ')
                                : result.userAnswer || 'No answer'}
                            </span>
                          </div>
                          {!result.isCorrect && (
                            <div>
                              <span className="font-medium">Correct answer: </span>
                              <span className="text-green-600">
                                {Array.isArray(result.correctAnswer)
                                  ? result.correctAnswer.join(', ')
                                  : result.correctAnswer}
                              </span>
                            </div>
                          )}
                          {question?.explanation && !result.isCorrect && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamification Results */}
          {showGamificationResults && gamificationResults && !assignmentMode && (
            <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
                Rewards Earned!
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{gamificationResults.pointsEarned}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Gem className={`h-8 w-8 ${
                      gamificationResults.gemType === 'legendary' ? 'text-yellow-500' :
                      gamificationResults.gemType === 'epic' ? 'text-purple-500' :
                      gamificationResults.gemType === 'rare' ? 'text-blue-500' :
                      gamificationResults.gemType === 'uncommon' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="text-sm font-medium capitalize">{gamificationResults.gemType} Gem</div>
                  <div className="text-xs text-gray-600">Collected</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{gamificationResults.bonusMultiplier.toFixed(1)}x</div>
                  <div className="text-sm text-gray-600">Bonus Multiplier</div>
                </div>
              </div>

              {gamificationResults.achievementsUnlocked.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    New Achievements Unlocked!
                  </h4>
                  <div className="space-y-2">
                    {gamificationResults.achievementsUnlocked.map((achievement, index) => (
                      <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <span className="text-2xl mr-3">{achievement.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{achievement.name}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                          <div className="text-xs text-yellow-600 font-medium">+{achievement.points} points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!assignmentMode && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestart}
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{selectedText.title}</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{selectedText.wordCount} words</span>
              <Clock className="h-4 w-4 ml-4 mr-1" />
              <span>{selectedText.estimatedReadingTime} min read</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700">
              Time: {formatTime(timeSpent)}
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
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading text */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Reading Text</h2>
          <div className="prose max-w-none">
            <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {selectedText.category.replace('_', ' ')}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {selectedText.subcategory.replace('_', ' ')}
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                {selectedText.difficulty}
              </span>
            </div>
            <div className="whitespace-pre-line leading-relaxed text-gray-800">
              {selectedText.content}
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
                  <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border">
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
                  <label key={option} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border">
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
                placeholder="Write your answer here..."
                value={userAnswers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              />
            )}

            {currentQuestion.type === 'gap-fill' && (
              <div className="space-y-3">
                {Array.isArray(currentQuestion.correctAnswer) ? (
                  currentQuestion.correctAnswer.map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Answer ${index + 1}...`}
                      value={(userAnswers[currentQuestion.id] as string[])?.[index] || ''}
                      onChange={(e) => {
                        const currentAnswers = (userAnswers[currentQuestion.id] as string[]) || [];
                        const newAnswers = [...currentAnswers];
                        newAnswers[index] = e.target.value;
                        handleAnswerChange(currentQuestion.id, newAnswers);
                      }}
                    />
                  ))
                ) : (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fill in the blank..."
                    value={userAnswers[currentQuestion.id] as string || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Award className="h-4 w-4 mr-2" />
                Finish Task
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
