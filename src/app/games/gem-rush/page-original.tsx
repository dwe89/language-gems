'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../services/vocabulary-mining';
import { 
  VocabularyGem, 
  SessionType 
} from '../../../types/vocabulary-mining';
import { 
  calculatePointsEarned,
  getGemInfo 
} from '../../../utils/vocabulary-mining';
import { 
  Pickaxe, 
  Clock, 
  Target, 
  Zap,
  Trophy,
  Gem,
  Home,
  RotateCcw,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface GemRushCard {
  id: number;
  gem: VocabularyGem;
  isCorrect: boolean;
  answered: boolean;
}

interface GameState {
  sessionId: string;
  currentQuestion: VocabularyGem | null;
  options: string[];
  correctAnswer: string;
  score: number;
  streak: number;
  timeLeft: number;
  questionsAnswered: number;
  gemsCollected: VocabularyGem[];
  gameOver: boolean;
}

export default function GemRushGame() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [availableGems, setAvailableGems] = useState<VocabularyGem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game settings
  const GAME_DURATION = 60; // seconds
  const QUESTIONS_PER_GAME = 20;

  useEffect(() => {
    if (user) {
      loadVocabularyGems();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState && gameStarted && !gameState.gameOver && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (!prev) return null;
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            return { ...prev, timeLeft: 0, gameOver: true };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, gameStarted]);

  const loadVocabularyGems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const gems = await miningService.getVocabularyGems({ limit: 50 });
      setAvailableGems(gems);
      setLoading(false);
    } catch (error) {
      console.error('Error loading vocabulary gems:', error);
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!user || availableGems.length === 0) return;
    
    try {
      const sessionId = await miningService.startMiningSession(
        user.id,
        'challenge' as SessionType
      );
      
      const initialState: GameState = {
        sessionId,
        currentQuestion: null,
        options: [],
        correctAnswer: '',
        score: 0,
        streak: 0,
        timeLeft: GAME_DURATION,
        questionsAnswered: 0,
        gemsCollected: [],
        gameOver: false
      };
      
      setGameState(initialState);
      setGameStarted(true);
      generateQuestion(initialState);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const generateQuestion = useCallback((currentState: GameState) => {
    if (availableGems.length === 0) return;
    
    // Select random gem for question
    const randomGem = availableGems[Math.floor(Math.random() * availableGems.length)];
    
    // Generate options (3 wrong + 1 correct)
    const correctAnswer = randomGem.translation;
    const wrongAnswers = availableGems
      .filter(gem => gem.id !== randomGem.id)
      .map(gem => gem.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setGameState(prev => prev ? {
      ...prev,
      currentQuestion: randomGem,
      options: allOptions,
      correctAnswer
    } : null);
    
    setSelectedAnswer('');
    setShowResult(false);
  }, [availableGems]);

  const handleAnswerSelect = async (answer: string) => {
    if (!gameState || !gameState.currentQuestion || showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === gameState.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Record the result
    try {
      await miningService.recordPracticeResult(
        gameState.sessionId,
        user!.id,
        gameState.currentQuestion.id,
        correct,
        1000 // Approximate response time
      );
    } catch (error) {
      console.error('Error recording result:', error);
    }
    
    // Update game state
    const newStreak = correct ? gameState.streak + 1 : 0;
    const points = correct ? calculatePointsEarned(
      gameState.currentQuestion.gemType,
      true,
      1000,
      newStreak
    ) : 0;
    
    const newGemsCollected = correct 
      ? [...gameState.gemsCollected, gameState.currentQuestion]
      : gameState.gemsCollected;
    
    const newQuestionsAnswered = gameState.questionsAnswered + 1;
    const gameOver = newQuestionsAnswered >= QUESTIONS_PER_GAME || gameState.timeLeft <= 0;
    
    setGameState(prev => prev ? {
      ...prev,
      score: prev.score + points,
      streak: newStreak,
      questionsAnswered: newQuestionsAnswered,
      gemsCollected: newGemsCollected,
      gameOver
    } : null);
    
    // Move to next question after delay
    setTimeout(() => {
      if (!gameOver) {
        generateQuestion({
          ...gameState,
          score: gameState.score + points,
          streak: newStreak,
          questionsAnswered: newQuestionsAnswered,
          gemsCollected: newGemsCollected,
          gameOver: false
        });
      } else {
        endGame();
      }
    }, 1500);
  };

  const endGame = async () => {
    if (!gameState) return;
    
    try {
      await miningService.endMiningSession(gameState.sessionId);
    } catch (error) {
      console.error('Error ending game session:', error);
    }
  };

  const resetGame = () => {
    setGameState(null);
    setGameStarted(false);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading Gem Rush...</p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gem Rush</h1>
          <p className="text-gray-600 mb-6">
            Race against time to collect as many vocabulary gems as possible! 
            Answer questions correctly to collect gems and build your streak.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="font-bold text-yellow-800">⏱️ {GAME_DURATION}s</div>
              <div className="text-yellow-600">Time Limit</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="font-bold text-blue-800">🎯 {QUESTIONS_PER_GAME}</div>
              <div className="text-blue-600">Max Questions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="font-bold text-green-800">💎 Gems</div>
              <div className="text-green-600">Collect & Earn</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="font-bold text-purple-800">🔥 Streaks</div>
              <div className="text-purple-600">Bonus Points</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={startGame}
              disabled={availableGems.length === 0}
              className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Rush!
            </button>
            
            <Link
              href="/student-dashboard/games"
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (gameState?.gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rush Complete!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{gameState.gemsCollected.length}</div>
              <div className="text-sm text-gray-600">Gems Collected</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{gameState.questionsAnswered}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{Math.round((gameState.gemsCollected.length / gameState.questionsAnswered) * 100)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetGame}
              className="flex-1 bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-700 flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </button>
            
            <Link
              href="/student-dashboard/games"
              className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState?.currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-white">Loading question...</div>
      </div>
    );
  }

  const currentGem = gameState.currentQuestion;
  const gemInfo = getGemInfo(currentGem.gemType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-xl font-bold">{formatTime(gameState.timeLeft)}</span>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              <span>{gameState.questionsAnswered}/{QUESTIONS_PER_GAME}</span>
            </div>
            <div className="flex items-center">
              <Gem className="w-5 h-5 mr-2" />
              <span>{gameState.gemsCollected.length}</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              <span>{gameState.streak}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              <span>{gameState.score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          {/* Gem Display */}
          <div className="mb-6">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl border-4"
              style={{ 
                backgroundColor: gemInfo.color + '20',
                borderColor: gemInfo.color,
                color: gemInfo.color
              }}
            >
              {gemInfo.icon}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              {gemInfo.name} Gem
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {currentGem.term}
            </h2>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-4">
              What does this word mean in English?
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {gameState.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`
                  p-4 rounded-lg text-left font-medium transition-all
                  ${showResult
                    ? option === gameState.correctAnswer
                      ? 'bg-green-100 text-green-800 border-2 border-green-500'
                      : option === selectedAnswer && !isCorrect
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-gray-100 text-gray-600'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-2 border-transparent hover:border-gray-300'
                  }
                  disabled:cursor-not-allowed
                `}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                {option}
                {showResult && option === gameState.correctAnswer && (
                  <span className="ml-2">✓</span>
                )}
                {showResult && option === selectedAnswer && !isCorrect && (
                  <span className="ml-2">✗</span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <div className="text-lg font-bold">
                {isCorrect ? '🎉 Correct! Gem collected!' : '❌ Incorrect'}
              </div>
              {!isCorrect && (
                <div className="text-sm mt-1">
                  The correct answer was: {gameState.correctAnswer}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
