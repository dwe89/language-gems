'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, Clock, Target, Trophy, TrendingUp, RefreshCw, Home, BarChart3 } from 'lucide-react';

interface VocabularyItem {
  id: number;
  spanish: string;
  english: string;
  theme?: string;
  topic?: string;
}

interface Card {
  id: number;
  value: string;
  type: 'spanish' | 'english';
  vocabularyId: number;
  flipped: boolean;
  matched: boolean;
  pairId: number;
}

interface WordPerformance {
  vocabularyId: number;
  spanish: string;
  english: string;
  attempts: number;
  correctMatches: number;
  avgResponseTime: number;
  lastAttempted: string;
}

interface MemoryGameWithProgressProps {
  vocabulary: VocabularyItem[];
  difficulty: string;
  assignmentId?: string;
  assignmentConfig?: {
    timeLimit?: number;
    allowRetries: boolean;
    showProgress: boolean;
    shuffleCards: boolean;
    tracking: {
      trackTime: boolean;
      trackAttempts: boolean;
      trackAccuracy: boolean;
      trackWordsLearned: boolean;
    };
  };
  onGameComplete: (results: any) => void;
  onBackToMenu: () => void;
}

// Difficulty configurations
const DIFFICULTY_CONFIG = {
  'easy-1': { pairs: 3, grid: [3, 2], timeBonus: 120 },
  'easy-2': { pairs: 4, grid: [4, 2], timeBonus: 150 },
  'medium-1': { pairs: 5, grid: [5, 2], timeBonus: 180 },
  'medium-2': { pairs: 6, grid: [4, 3], timeBonus: 240 },
  'hard-2': { pairs: 8, grid: [4, 4], timeBonus: 300 },
  'expert': { pairs: 10, grid: [5, 4], timeBonus: 360 }
};

export default function MemoryGameWithProgress({
  vocabulary,
  difficulty,
  assignmentId,
  assignmentConfig,
  onGameComplete,
  onBackToMenu
}: MemoryGameWithProgressProps) {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);

  // Progress tracking
  const [wordPerformance, setWordPerformance] = useState<Map<number, WordPerformance>>(new Map());
  const [currentPairStartTime, setCurrentPairStartTime] = useState<number>(0);
  const [achievements, setAchievements] = useState<Array<{type: string, description: string, earnedAt: string}>>([]);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameConfig = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG['medium-2'];

  // Initialize game
  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [vocabulary, difficulty]);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        
        // Check time limit if enabled
        if (assignmentConfig?.timeLimit && timeElapsed >= assignmentConfig.timeLimit) {
          handleTimeUp();
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameCompleted, timeElapsed, assignmentConfig?.timeLimit]);

  const initializeGame = useCallback(() => {
    // Select vocabulary for this difficulty
    const requiredPairs = gameConfig.pairs;
    const selectedVocab = vocabulary.slice(0, requiredPairs);
    
    // Initialize word performance tracking
    const performanceMap = new Map<number, WordPerformance>();
    selectedVocab.forEach(vocab => {
      performanceMap.set(vocab.id, {
        vocabularyId: vocab.id,
        spanish: vocab.spanish,
        english: vocab.english,
        attempts: 0,
        correctMatches: 0,
        avgResponseTime: 0,
        lastAttempted: new Date().toISOString()
      });
    });
    setWordPerformance(performanceMap);

    // Create cards
    const newCards: Card[] = [];
    selectedVocab.forEach((vocab, index) => {
      // Spanish card
      newCards.push({
        id: index * 2,
        value: vocab.spanish,
        type: 'spanish',
        vocabularyId: vocab.id,
        flipped: false,
        matched: false,
        pairId: index
      });

      // English card
      newCards.push({
        id: index * 2 + 1,
        value: vocab.english,
        type: 'english',
        vocabularyId: vocab.id,
        flipped: false,
        matched: false,
        pairId: index
      });
    });

    // Shuffle cards if enabled
    if (assignmentConfig?.shuffleCards !== false) {
      newCards.sort(() => Math.random() - 0.5);
    }

    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameStarted(false);
    setGameCompleted(false);
    setTimeElapsed(0);
    setAttempts(0);
    setScore(0);
    setAchievements([]);
  }, [vocabulary, difficulty, gameConfig.pairs, assignmentConfig?.shuffleCards]);

  const startGame = () => {
    setGameStarted(true);
    setGameStartTime(Date.now());
    setCurrentPairStartTime(Date.now());
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameCompleted || flippedCards.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update cards state
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, flipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      setCurrentPairStartTime(Date.now());
      setTimeout(() => checkMatch(newFlippedCards), 1000);
    }
  };

  const checkMatch = (flippedCardIds: number[]) => {
    const [card1Id, card2Id] = flippedCardIds;
    const card1 = cards.find(c => c.id === card1Id);
    const card2 = cards.find(c => c.id === card2Id);

    if (!card1 || !card2) return;

    const isMatch = card1.pairId === card2.pairId && card1.type !== card2.type;
    const responseTime = (Date.now() - currentPairStartTime) / 1000;

    if (isMatch) {
      // Handle correct match
      const newMatchedPairs = [...matchedPairs, card1.pairId];
      setMatchedPairs(newMatchedPairs);
      
      // Update cards state
      setCards(prev => prev.map(c => 
        (c.id === card1Id || c.id === card2Id) 
          ? { ...c, matched: true } 
          : { ...c, flipped: false }
      ));

      // Calculate score with time bonus
      const timeBonus = Math.max(0, gameConfig.timeBonus - timeElapsed);
      const matchScore = 100 + Math.floor(timeBonus / 10);
      setScore(prev => prev + matchScore);

      // Update word performance
      updateWordPerformance(card1.vocabularyId, true, responseTime);

      // Check for game completion
      if (newMatchedPairs.length === gameConfig.pairs) {
        handleGameComplete();
      }

      // Check for achievements
      checkAchievements(newMatchedPairs.length, responseTime);
    } else {
      // Handle incorrect match
      setCards(prev => prev.map(c => 
        ({ ...c, flipped: false })
      ));

      // Update word performance for both words
      updateWordPerformance(card1.vocabularyId, false, responseTime);
      updateWordPerformance(card2.vocabularyId, false, responseTime);
    }

    setFlippedCards([]);
  };

  const updateWordPerformance = (vocabularyId: number, correct: boolean, responseTime: number) => {
    setWordPerformance(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(vocabularyId);
      if (current) {
        const newAttempts = current.attempts + 1;
        const newCorrect = current.correctMatches + (correct ? 1 : 0);
        const newAvgTime = (current.avgResponseTime * current.attempts + responseTime) / newAttempts;

        newMap.set(vocabularyId, {
          ...current,
          attempts: newAttempts,
          correctMatches: newCorrect,
          avgResponseTime: newAvgTime,
          lastAttempted: new Date().toISOString()
        });
      }
      return newMap;
    });
  };

  const checkAchievements = (matchesCount: number, responseTime: number) => {
    const newAchievements: Array<{type: string, description: string, earnedAt: string}> = [];

    // Fast match achievement
    if (responseTime < 3) {
      newAchievements.push({
        type: 'speed_demon',
        description: 'Lightning Fast! Matched a pair in under 3 seconds',
        earnedAt: new Date().toISOString()
      });
    }

    // Halfway achievement
    if (matchesCount === Math.ceil(gameConfig.pairs / 2)) {
      newAchievements.push({
        type: 'halfway_hero',
        description: 'Halfway Hero! Completed half the pairs',
        earnedAt: new Date().toISOString()
      });
    }

    // Perfect start achievement
    if (matchesCount === 3 && attempts === 3) {
      newAchievements.push({
        type: 'perfect_start',
        description: 'Perfect Start! First 3 attempts were all correct',
        earnedAt: new Date().toISOString()
      });
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const handleTimeUp = () => {
    setGameCompleted(true);
    setGameStarted(false);
    saveProgress(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setGameStarted(false);

    // Completion achievements
    const completionAchievements: Array<{type: string, description: string, earnedAt: string}> = [];
    
    const accuracy = attempts > 0 ? (matchedPairs.length / attempts) * 100 : 0;
    
    if (accuracy === 100) {
      completionAchievements.push({
        type: 'perfect_game',
        description: 'Perfect Memory! Completed with 100% accuracy',
        earnedAt: new Date().toISOString()
      });
    }

    if (timeElapsed < gameConfig.timeBonus * 0.5) {
      completionAchievements.push({
        type: 'speed_master',
        description: 'Speed Master! Completed in record time',
        earnedAt: new Date().toISOString()
      });
    }

    setAchievements(prev => [...prev, ...completionAchievements]);
    saveProgress(true);
  };

  const saveProgress = async (completed: boolean) => {
    if (!assignmentConfig?.tracking) return;

    const progressData = {
      assignmentId,
      sessionData: {
        difficulty,
        vocabularyCount: gameConfig.pairs,
        timeSpent: timeElapsed,
        totalAttempts: attempts,
        correctMatches: matchedPairs.length,
        accuracy: attempts > 0 ? (matchedPairs.length / attempts) * 100 : 0,
        gameCompleted: completed,
        finalScore: score
      },
      wordProgress: Array.from(wordPerformance.values()),
      achievements
    };

    try {
      const response = await fetch('/api/games/memory-game/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });

      if (response.ok) {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }

    onGameComplete(progressData);
  };

  const restartGame = () => {
    if (assignmentConfig?.allowRetries === false && gameCompleted) {
      return; // Don't allow restart if retries are disabled
    }
    initializeGame();
  };

  const accuracy = attempts > 0 ? Math.round((matchedPairs.length / attempts) * 100) : 0;
  const progress = (matchedPairs.length / gameConfig.pairs) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToMenu}
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Menu
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-600 mr-2" />
              Memory Match Game
            </h1>
            <p className="text-gray-600">Difficulty: {difficulty} • {gameConfig.pairs} pairs</p>
          </div>

          <div className="flex items-center space-x-4">
            {assignmentConfig?.tracking.trackTime && (
              <div className="text-center">
                <div className="text-sm text-gray-600">Time</div>
                <div className="font-bold text-lg text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Stats */}
        {assignmentConfig?.showProgress && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attempts</p>
                  <p className="text-2xl font-bold text-green-600">{attempts}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-orange-600">{accuracy}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Time Limit Warning */}
        {assignmentConfig?.timeLimit && timeElapsed > assignmentConfig.timeLimit * 0.8 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Time Warning!</p>
            <p>You have {Math.max(0, assignmentConfig.timeLimit - timeElapsed)} seconds remaining</p>
          </div>
        )}

        {/* Game Start Screen */}
        {!gameStarted && !gameCompleted && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Play?</h2>
              <p className="text-gray-600 mb-6">
                Match {gameConfig.pairs} pairs of Spanish and English words
              </p>
              {assignmentConfig?.timeLimit && (
                <p className="text-sm text-orange-600 mb-4">
                  Time limit: {Math.floor(assignmentConfig.timeLimit / 60)}:{(assignmentConfig.timeLimit % 60).toString().padStart(2, '0')}
                </p>
              )}
              <button
                onClick={startGame}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Board */}
        {gameStarted && (
          <div 
            className="grid gap-4 mb-6"
            style={{
              gridTemplateColumns: `repeat(${gameConfig.grid[0]}, 1fr)`,
              gridTemplateRows: `repeat(${gameConfig.grid[1]}, 1fr)`
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${card.flipped || card.matched 
                    ? 'bg-white shadow-lg' 
                    : 'bg-gradient-to-br from-purple-400 to-blue-500 shadow-md hover:shadow-lg'
                  }
                  ${card.matched ? 'ring-4 ring-green-400' : ''}
                `}
              >
                <div className="h-full flex items-center justify-center p-4">
                  {card.flipped || card.matched ? (
                    <div className="text-center">
                      <div className={`text-lg font-bold ${card.type === 'spanish' ? 'text-red-600' : 'text-blue-600'}`}>
                        {card.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {card.type === 'spanish' ? 'ES' : 'EN'}
                      </div>
                    </div>
                  ) : (
                    <Brain className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Game Complete Screen */}
        {gameCompleted && (
          <div className="text-center py-8">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {matchedPairs.length === gameConfig.pairs ? 'Congratulations!' : 'Time\'s Up!'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Final Score</p>
                  <p className="text-2xl font-bold text-purple-600">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
                </div>
              </div>

              {achievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Achievements Unlocked!</h3>
                  {achievements.map((achievement, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                      <p className="font-medium text-yellow-800">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-4 justify-center">
                {assignmentConfig?.allowRetries !== false && (
                  <button
                    onClick={restartGame}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Play Again
                  </button>
                )}
                <button
                  onClick={onBackToMenu}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 