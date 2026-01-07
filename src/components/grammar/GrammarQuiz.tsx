'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Target,
  Brain,
  Gem,
  ChevronRight,
  RotateCcw,
  Home
} from 'lucide-react';
import { GemButton, GemCard } from '../ui/GemTheme';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'drag_drop';
  correct_answer: string;
  options?: string[];
  explanation: string;
  difficulty_level: string;
  hint_text?: string;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration: number;
  questions: QuizQuestion[];
}

interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

interface GrammarQuizProps {
  quizData: QuizData;
  onComplete: (score: number, answers: QuizAnswer[], timeSpent: number) => void;
  onExit: () => void;
  showHints?: boolean;
  timeLimit?: number; // in seconds
}

export default function GrammarQuiz({
  quizData,
  onComplete,
  onExit,
  showHints = true,
  timeLimit
}: GrammarQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Guard against undefined or empty quizData.questions
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <GemCard className="max-w-md w-full text-center">
          <div className="text-gray-500 mb-4">
            <Target className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg">No quiz questions available</p>
            <p className="text-sm">Please try again later or contact support if this persists.</p>
          </div>
          <GemButton variant="gem" gemType="common" onClick={onExit}>
            Return to Menu
          </GemButton>
        </GemCard>
      </div>
    );
  }

  const currentQuestionData = quizData.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLimit && timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isCompleted, timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    const isCorrect = currentAnswer.toLowerCase().trim() === currentQuestionData.correct_answer.toLowerCase().trim();
    const timeSpent = Date.now() - questionStartTime;

    const answerData: QuizAnswer = {
      questionId: currentQuestionData.id,
      answer: currentAnswer,
      isCorrect,
      timeSpent,
      hintsUsed: showHint ? 1 : 0
    };

    setAnswers(prev => [...prev, answerData]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleQuizComplete();
    } else {
      setCurrentQuestion(prev => {
        const nextIndex = prev + 1;
        // Safety check to ensure we don't go out of bounds
        return nextIndex < quizData.questions.length ? nextIndex : prev;
      });
      setCurrentAnswer('');
      setShowFeedback(false);
      setShowHint(false);
      setHintsUsed(0);
      setQuestionStartTime(Date.now());
    }
  };

  const handleQuizComplete = () => {
    setIsCompleted(true);
    const totalTimeSpent = Math.round((Date.now() - startTime) / 1000);
    const score = calculateScore();
    onComplete(score, answers, totalTimeSpent);
  };

  const calculateScore = () => {
    if (answers.length === 0) return 0;
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    return Math.round((correctAnswers / quizData.questions.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGemType = (score: number) => {
    if (score >= 95) return 'legendary';
    if (score >= 85) return 'epic';
    if (score >= 75) return 'rare';
    if (score >= 65) return 'uncommon';
    return 'common';
  };

  const renderQuestion = () => {
    switch (currentQuestionData.question_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestionData.options?.map((option, index) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${currentAnswer === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <input
                  type="radio"
                  name="quiz-answer"
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="text-purple-600"
                />
                <span className="text-gray-700 font-medium">{option}</span>
              </motion.label>
            ))}
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg text-gray-800 leading-relaxed">
                {currentQuestionData.question_text.replace('_____', '______')}
              </p>
            </div>
            <input
              type="text"
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full p-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
            />
          </div>
        );

      case 'true_false':
        return (
          <div className="grid grid-cols-2 gap-4">
            {['True', 'False'].map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentAnswer(option)}
                className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all ${currentAnswer === option
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            placeholder="Type your answer..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full p-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
          />
        );
    }
  };

  if (isCompleted) {
    const finalScore = calculateScore();
    const gemType = getGemType(finalScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl mx-auto p-8"
        >
          <GemCard className="text-center">
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <Award className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
              <p className="text-gray-600">Great job on completing the {quizData.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(finalScore)}`}>
                  {finalScore}%
                </div>
                <p className="text-gray-600">Final Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {answers.filter(a => a.isCorrect).length}/{quizData.questions.length}
                </div>
                <p className="text-gray-600">Correct Answers</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-8">
              <Gem className={`w-6 h-6 text-${gemType === 'legendary' ? 'yellow' : gemType === 'epic' ? 'purple' : gemType === 'rare' ? 'blue' : 'green'}-500`} />
              <span className="text-lg font-semibold text-gray-700">
                {gemType.charAt(0).toUpperCase() + gemType.slice(1)} Gem Earned!
              </span>
            </div>

            <div className="flex justify-center space-x-4">
              <GemButton
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </GemButton>
              <GemButton
                variant="gem"
                gemType="rare"
                onClick={onExit}
              >
                <Home className="w-4 h-4 mr-2" />
                Continue Learning
              </GemButton>
            </div>
          </GemCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Home className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{quizData.title}</h1>
                <p className="text-sm text-purple-200">
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {timeLimit && (
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span className={timeRemaining < 60 ? 'text-red-300' : ''}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              <div className="text-sm text-purple-200">
                {Math.round(progress)}% complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <GemCard className="mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Question {currentQuestion + 1}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentQuestionData.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                    currentQuestionData.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {currentQuestionData.difficulty_level}
                </span>
              </div>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {currentQuestionData.question_text}
              </p>
            </div>

            {renderQuestion()}

            {/* Hint */}
            {showHints && currentQuestionData.hint_text && (
              <div className="mt-6">
                <GemButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                </GemButton>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-blue-800">{currentQuestionData.hint_text}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-lg border ${answers[answers.length - 1]?.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {answers[answers.length - 1]?.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${answers[answers.length - 1]?.isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                      {answers[answers.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>

                  {!answers[answers.length - 1]?.isCorrect && (
                    <p className="text-red-700 mb-2">
                      Correct answer: {currentQuestionData.correct_answer}
                    </p>
                  )}

                  <p className="text-gray-700">{currentQuestionData.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </GemCard>

          {/* Navigation */}
          <div className="flex justify-between">
            <div className="text-sm text-purple-200">
              {answers.filter(a => a.isCorrect).length} correct out of {answers.length} answered
            </div>

            {showFeedback ? (
              <GemButton
                variant="gem"
                gemType="rare"
                onClick={handleNextQuestion}
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </GemButton>
            ) : (
              <GemButton
                variant="gem"
                gemType="uncommon"
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
              >
                Submit Answer
              </GemButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
