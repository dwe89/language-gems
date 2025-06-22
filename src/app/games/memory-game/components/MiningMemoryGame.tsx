'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../services/vocabulary-mining';
import { GemDisplay } from '../../../../components/vocabulary-mining/GemDisplay';
import { 
  VocabularyGem, 
  SessionType 
} from '../../../../types/vocabulary-mining';
import { 
  calculatePointsEarned,
  getGemInfo,
  determinePerformanceQuality 
} from '../../../../utils/vocabulary-mining';
import { 
  Pickaxe, 
  Star, 
  Clock, 
  Target, 
  Zap,
  Trophy,
  Gem,
  ArrowRight,
  Home
} from 'lucide-react';
import './styles.css';

interface MiningMemoryGameProps {
  difficulty: string;
  theme: string;
  language: string;
  onBackToMenu: () => void;
  onGameComplete: (time: number, moves: number, gemsCollected: number) => void;
}

interface GameCard {
  id: number;
  vocabularyGem: VocabularyGem;
  content: string;
  type: 'term' | 'translation';
  matched: boolean;
  flipped: boolean;
  pairId: number;
}

interface MiningSession {
  sessionId: string;
  startTime: Date;
  gemsCollected: VocabularyGem[];
  totalMatches: number;
  perfectMatches: number;
}

export default function MiningMemoryGame({
  difficulty,
  theme,
  language,
  onBackToMenu,
  onGameComplete
}: MiningMemoryGameProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  // Game state
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mining state
  const [miningSession, setMiningSession] = useState<MiningSession | null>(null);
  const [gemsCollected, setGemsCollected] = useState<VocabularyGem[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showGemAnimation, setShowGemAnimation] = useState<VocabularyGem | null>(null);
  
  // Refs
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const gemCollectSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Difficulty settings
  const difficultySettings = {
    easy: { pairs: 6, timeBonus: 1.5 },
    medium: { pairs: 8, timeBonus: 1.2 },
    hard: { pairs: 12, timeBonus: 1.0 }
  };
  
  const currentDifficulty = difficultySettings[difficulty as keyof typeof difficultySettings] || difficultySettings.medium;

  useEffect(() => {
    if (user) {
      initializeGame();
    }
  }, [user, difficulty, theme, language]);

  useEffect(() => {
    // Initialize audio
    correctSoundRef.current = new Audio('/games/memory-game/sounds/correct.mp3');
    gemCollectSoundRef.current = new Audio('/games/memory-game/sounds/gem-collect.mp3');
    
    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const initializeGame = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get vocabulary gems for the game
      const vocabularyGems = await miningService.getVocabularyGems({
        theme: theme !== 'custom' ? theme : undefined,
        limit: currentDifficulty.pairs
      });
      
      if (vocabularyGems.length < currentDifficulty.pairs) {
        console.warn('Not enough vocabulary items for selected difficulty');
        // Pad with duplicates if needed
        while (vocabularyGems.length < currentDifficulty.pairs) {
          vocabularyGems.push(...vocabularyGems.slice(0, currentDifficulty.pairs - vocabularyGems.length));
        }
      }
      
      // Start mining session
      const sessionId = await miningService.startMiningSession(
        user.id,
        'practice' as SessionType
      );
      
      setMiningSession({
        sessionId,
        startTime: new Date(),
        gemsCollected: [],
        totalMatches: 0,
        perfectMatches: 0
      });
      
      // Create game cards
      const gameCards: GameCard[] = [];
      vocabularyGems.slice(0, currentDifficulty.pairs).forEach((gem, index) => {
        // Term card
        gameCards.push({
          id: index * 2,
          vocabularyGem: gem,
          content: gem.term,
          type: 'term',
          matched: false,
          flipped: false,
          pairId: index
        });
        
        // Translation card
        gameCards.push({
          id: index * 2 + 1,
          vocabularyGem: gem,
          content: gem.translation,
          type: 'translation',
          matched: false,
          flipped: false,
          pairId: index
        });
      });
      
      // Shuffle cards
      const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setLoading(false);
      
    } catch (error) {
      console.error('Error initializing mining memory game:', error);
      setLoading(false);
    }
  };

  const handleCardClick = useCallback((cardId: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);
      
      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        handleMatch(firstCard, secondCard);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, matchedCards, cards]);

  const handleMatch = async (card1: GameCard, card2: GameCard) => {
    const newMatchedCards = [...matchedCards, card1.id, card2.id];
    setMatchedCards(newMatchedCards);
    setFlippedCards([]);
    setCurrentStreak(prev => prev + 1);
    
    // Play correct sound
    if (correctSoundRef.current) {
      correctSoundRef.current.play().catch(console.error);
    }
    
    // Collect gem
    const gem = card1.vocabularyGem;
    const responseTime = 2000; // Approximate time for memory match
    const points = calculatePointsEarned(gem.gemType, true, responseTime, currentStreak);
    
    setGemsCollected(prev => [...prev, gem]);
    setTotalPoints(prev => prev + points);
    setShowGemAnimation(gem);
    
    // Play gem collect sound
    if (gemCollectSoundRef.current) {
      gemCollectSoundRef.current.play().catch(console.error);
    }
    
    // Record the practice result
    if (miningSession && user) {
      try {
        await miningService.recordPracticeResult(
          miningSession.sessionId,
          user.id,
          gem.id,
          true,
          responseTime
        );
      } catch (error) {
        console.error('Error recording practice result:', error);
      }
    }
    
    // Hide gem animation after delay
    setTimeout(() => {
      setShowGemAnimation(null);
    }, 2000);
    
    // Check if game is complete
    if (newMatchedCards.length === cards.length) {
      handleGameComplete();
    }
  };

  const handleGameComplete = async () => {
    setGameOver(true);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // End mining session
    if (miningSession && user) {
      try {
        await miningService.endMiningSession(miningSession.sessionId);
      } catch (error) {
        console.error('Error ending mining session:', error);
      }
    }
    
    // Call completion callback
    onGameComplete(timer, moves, gemsCollected.length);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Preparing your mining adventure...</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mining Complete!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{gemsCollected.length}</div>
              <div className="text-sm text-gray-600">Gems Collected</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timer)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{moves}</div>
              <div className="text-sm text-gray-600">Moves</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
          
          {/* Collected Gems Display */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gems Collected</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {gemsCollected.map((gem, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: gem.gemColor }}
                  >
                    💎
                  </div>
                  <span className="text-xs text-gray-600">{gem.term}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={initializeGame}
              className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center"
            >
              <Pickaxe className="w-5 h-5 mr-2" />
              Mine Again
            </button>
            
            <button
              onClick={onBackToMenu}
              className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gridCols = Math.ceil(Math.sqrt(cards.length));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Pickaxe className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-white font-medium">Vocabulary Mining</span>
            </div>
            
            <div className="flex items-center space-x-4 text-white text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTime(timer)}</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                <span>{moves} moves</span>
              </div>
              <div className="flex items-center">
                <Gem className="w-4 h-4 mr-1" />
                <span>{gemsCollected.length} gems</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                <span>{currentStreak} streak</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onBackToMenu}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="max-w-4xl mx-auto">
        <div 
          className="grid gap-4 justify-center"
          style={{ 
            gridTemplateColumns: `repeat(${gridCols}, minmax(120px, 1fr))`,
            maxWidth: `${gridCols * 140}px`,
            margin: '0 auto'
          }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className={`
                relative h-32 cursor-pointer rounded-lg shadow-lg
                ${flippedCards.includes(card.id) || matchedCards.includes(card.id) 
                  ? 'bg-white' 
                  : 'bg-gradient-to-br from-indigo-600 to-purple-600'
                }
                ${matchedCards.includes(card.id) ? 'ring-4 ring-yellow-400' : ''}
              `}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: matchedCards.includes(card.id) ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-2">
                {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? (
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {card.content}
                    </div>
                    <div className="text-xs text-gray-600">
                      {card.type === 'term' ? 'Term' : 'Translation'}
                    </div>
                    {matchedCards.includes(card.id) && (
                      <div className="mt-1">
                        <div 
                          className="w-4 h-4 rounded-full mx-auto"
                          style={{ backgroundColor: card.vocabularyGem.gemColor }}
                        >
                          💎
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-white text-3xl">?</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gem Collection Animation */}
      <AnimatePresence>
        {showGemAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 text-center">
              <div className="text-4xl mb-2">💎</div>
              <div className="text-lg font-bold text-gray-900">Gem Collected!</div>
              <div className="text-sm text-gray-600">{showGemAnimation.term}</div>
              <div 
                className="w-8 h-8 rounded-full mx-auto mt-2"
                style={{ backgroundColor: showGemAnimation.gemColor }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
