'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Star, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[] | string;
  correct_answer: string;
  explanation?: string;
  difficulty_level: string;
}

interface VideoQuizGameProps {
  videoId: string;
  onComplete?: (results: QuizResults) => void;
}

interface QuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  gemsEarned: number;
}

interface GameState {
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  selectedAnswer: string | null;
  showFeedback: boolean;
  gamePhase: 'loading' | 'intro' | 'playing' | 'complete';
  startTime: number;
}

export default function VideoQuizGame({ videoId, onComplete }: VideoQuizGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    selectedAnswer: null,
    showFeedback: false,
    gamePhase: 'loading',
    startTime: Date.now()
  });

  const { supabase } = useSupabase();
  const { user } = useAuth();

  // Load quiz questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        const { data, error } = await supabase
          .from('video_quiz_questions')
          .select('*')
          .eq('video_id', videoId)
          .eq('is_active', true)
          .order('order_index');

        if (error) throw error;

        if (data && data.length > 0) {
          // Parse options if they're stored as strings
          const parsedQuestions = data.map(question => ({
            ...question,
            options: typeof question.options === 'string'
              ? JSON.parse(question.options)
              : question.options
          }));

          setQuestions(parsedQuestions);
          setGameState(prev => ({ ...prev, gamePhase: 'intro' }));
        } else {
          setGameState(prev => ({ ...prev, gamePhase: 'complete' }));
        }
      } catch (error) {
        console.error('Error loading quiz questions:', error);
        setGameState(prev => ({ ...prev, gamePhase: 'complete' }));
      }
    }

    loadQuestions();
  }, [videoId, supabase]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      startTime: Date.now()
    }));
  };

  const selectAnswer = (answer: string) => {
    if (gameState.showFeedback) return;
    
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true
    }));
  };

  const nextQuestion = () => {
    const currentQuestion = questions[gameState.currentQuestionIndex];
    const isCorrect = gameState.selectedAnswer === currentQuestion.correct_answer;
    
    const newCorrectAnswers = gameState.correctAnswers + (isCorrect ? 1 : 0);
    const newScore = gameState.score + (isCorrect ? 10 : 0);

    if (gameState.currentQuestionIndex < questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        score: newScore,
        correctAnswers: newCorrectAnswers,
        selectedAnswer: null,
        showFeedback: false
      }));
    } else {
      // Game complete
      const timeSpent = Math.floor((Date.now() - gameState.startTime) / 1000);
      const gemsEarned = Math.floor(newScore / 10);
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        correctAnswers: newCorrectAnswers,
        gamePhase: 'complete'
      }));

      // Save results and award gems
      if (user && onComplete) {
        onComplete({
          score: newScore,
          totalQuestions: questions.length,
          correctAnswers: newCorrectAnswers,
          timeSpent,
          gemsEarned
        });
      }
    }
  };

  const resetGame = () => {
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      selectedAnswer: null,
      showFeedback: false,
      gamePhase: 'intro',
      startTime: Date.now()
    });
  };

  if (gameState.gamePhase === 'loading') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Loading quiz questions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-600">No quiz questions available for this video yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameState.gamePhase === 'intro') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Video Quiz Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-lg">Test your knowledge with {questions.length} questions!</p>
            <div className="flex justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                10 points per correct answer
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1 text-purple-500" />
                Earn gems for high scores
              </div>
            </div>
            <Button onClick={startGame} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameState.gamePhase === 'complete') {
    const percentage = Math.round((gameState.correctAnswers / questions.length) * 100);
    const gemsEarned = Math.floor(gameState.score / 10);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-purple-600">{percentage}%</div>
            <p className="text-lg">
              You got {gameState.correctAnswers} out of {questions.length} questions correct!
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{gemsEarned}</div>
                <div className="text-sm text-gray-600">Gems Earned</div>
              </div>
            </div>

            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Playing phase
  const currentQuestion = questions[gameState.currentQuestionIndex];
  const progress = ((gameState.currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Question {gameState.currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <Badge variant="secondary">Score: {gameState.score}</Badge>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="text-lg font-medium">{currentQuestion.question_text}</div>
          
          <div className="space-y-3">
            {(Array.isArray(currentQuestion.options) ? currentQuestion.options : JSON.parse(currentQuestion.options as string)).map((option, index) => {
              const isSelected = gameState.selectedAnswer === option;
              const isCorrect = option === currentQuestion.correct_answer;
              const showResult = gameState.showFeedback;
              
              let buttonClass = "w-full text-left p-4 border rounded-lg transition-all ";
              
              if (showResult) {
                if (isCorrect) {
                  buttonClass += "bg-green-50 border-green-500 text-green-700";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-50 border-red-500 text-red-700";
                } else {
                  buttonClass += "bg-gray-50 border-gray-300 text-gray-600";
                }
              } else {
                buttonClass += isSelected 
                  ? "bg-purple-50 border-purple-500 text-purple-700" 
                  : "bg-white border-gray-300 hover:border-purple-300 hover:bg-purple-50";
              }

              return (
                <motion.button
                  key={index}
                  className={buttonClass}
                  onClick={() => selectAnswer(option)}
                  disabled={gameState.showFeedback}
                  whileHover={{ scale: showResult ? 1 : 1.02 }}
                  whileTap={{ scale: showResult ? 1 : 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {gameState.showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {currentQuestion.explanation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">{currentQuestion.explanation}</p>
                </div>
              )}
              
              <Button onClick={nextQuestion} className="w-full">
                {gameState.currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
