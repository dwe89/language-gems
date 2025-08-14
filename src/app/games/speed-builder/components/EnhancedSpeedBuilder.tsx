'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Star, 
  CheckCircle2, 
  Zap, 
  Shuffle,
  Award,
  Settings,
  Home,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Timer,
  Trophy,
  Brain,
  Sparkles,
  Gem,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { createBrowserClient } from '@supabase/ssr';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { useSearchParams } from 'next/navigation';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import confetti from 'canvas-confetti';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

// Types
interface WordItem {
  id: string;
  text: string;
  index: number;
  translation?: string;
  correct?: boolean;
  gemType?: 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz';
}

interface SentenceData {
  id: string;
  text: string;
  originalText: string;
  translatedText: string;
  language: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  curriculum?: {
    tier: 'Foundation' | 'Higher';
    theme: string;
    topic: string;
    grammarFocus?: string;
  };
  explanation?: string;
  vocabularyWords?: any[];
  isTeacherCreated?: boolean;
}

interface GameStats {
  score: number;
  accuracy: number;
  timeSpent: number;
  sentencesCompleted: number;
  streak: number;
  highestStreak: number;
  totalWordsPlaced: number;
  grammarErrors: Record<string, number>;
  powerUpsUsed: Record<string, number>;
  gemsCollected: number;
  bonusMultiplier: number;
}

interface PowerUp {
  id: string;
  type: 'shuffle' | 'hint' | 'glow' | 'timeBoost';
  active: boolean;
  cooldown: number;
  description: string;
  icon: string;
  gemCost: number;
}

interface FloatingGem {
  id: string;
  x: number;
  y: number;
  type: 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz';
  value: number;
}

// Gem colors and effects
const gemColors = {
  ruby: 'from-red-400 to-red-600',
  sapphire: 'from-blue-400 to-blue-600',
  emerald: 'from-green-400 to-green-600',
  diamond: 'from-gray-200 to-white',
  amethyst: 'from-purple-400 to-purple-600',
  topaz: 'from-yellow-400 to-yellow-600'
};

const gemGlow = {
  ruby: 'drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]',
  sapphire: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]',
  emerald: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.7)]',
  diamond: 'drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]',
  amethyst: 'drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]',
  topaz: 'drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]'
};

// Floating Gems Component
const FloatingGems: React.FC<{ gems: FloatingGem[]; onCollect: (gem: FloatingGem) => void }> = ({ gems, onCollect }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {gems.map(gem => (
        <motion.div
          key={gem.id}
          initial={{ x: gem.x, y: gem.y, scale: 0, rotate: 0 }}
          animate={{ 
            y: gem.y - 100, 
            scale: [0, 1.2, 1], 
            rotate: 360,
            opacity: [0, 1, 0.8, 0]
          }}
          transition={{ 
            duration: 2,
            ease: "easeOut"
          }}
          className={`absolute w-8 h-8 pointer-events-auto cursor-pointer ${gemGlow[gem.type]}`}
          onClick={() => onCollect(gem)}
          onAnimationComplete={() => onCollect(gem)}
        >
          <div className={`w-full h-full bg-gradient-to-br ${gemColors[gem.type]} rounded-lg transform rotate-45 border-2 border-white/30`}>
            <div className="absolute inset-1 bg-white/20 rounded border border-white/40"></div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 bg-white/10 rounded"
            />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {gem.value}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Gem Draggable Word Component
const GemDraggableWord: React.FC<{
  word: WordItem;
  isGlowing?: boolean;
  onWordClick?: (word: WordItem) => void;
}> = ({ word, isGlowing, onWordClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'word',
    item: word,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const gemType = word.gemType || (['ruby', 'sapphire', 'emerald', 'amethyst', 'topaz'][word.index % 5] as any);

  return (
    <motion.div
      ref={drag as any}
      onClick={() => onWordClick?.(word)}
      initial={{ scale: 0, y: 20, rotateY: -180 }}
      animate={{ 
        scale: 1, 
        y: 0,
        rotateY: 0,
        boxShadow: isGlowing ? '0 0 30px #fbbf24, 0 0 60px #fbbf24' : `0 8px 25px rgba(0,0,0,0.15)`,
      }}
      whileHover={{ 
        scale: 1.08, 
        y: -5,
        rotateY: 10,
        boxShadow: `0 12px 30px rgba(0,0,0,0.2)`,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17,
        rotateY: { duration: 0.6 }
      }}
      className={`
        relative px-6 py-4 bg-gradient-to-br ${gemColors[gemType]} 
        text-white rounded-2xl cursor-pointer select-none
        shadow-xl border-2 border-white/30 backdrop-blur-sm
        ${isDragging ? 'opacity-50 rotate-12' : ''}
        ${isGlowing ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
        ${word.correct ? 'from-green-400 to-green-600 border-green-300' : ''}
        font-bold text-lg transform-gpu perspective-1000
        ${gemGlow[gemType]}
      `}
      style={{
        opacity: isDragging ? 0.7 : 1,
        transform: isDragging ? 'rotateY(15deg) rotateX(10deg)' : undefined,
      }}
    >
      {/* Gem facet effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-black/20 via-transparent to-transparent rounded-2xl"></div>
      
      {/* Word content */}
      <div className="relative flex items-center gap-3">
        <Gem className="w-6 h-6 text-white/90" />
        <span className="text-shadow-sm">{word.text}</span>
        {word.translation && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1 }}
            className="text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20"
          >
            {word.translation}
          </motion.span>
        )}
      </div>
      
      {/* Magic sparkles effect */}
      {word.correct && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -right-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Crown className="w-6 h-6 text-yellow-300" />
          </motion.div>
        </motion.div>
      )}

      {/* Particle effect overlay */}
      <motion.div
        animate={{ 
          background: [
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)'
          ]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute inset-0 rounded-2xl"
      />
    </motion.div>
  );
};

// Gem Drop Target Component
const GemDropTarget: React.FC<{
  index: number;
  word: WordItem | null;
  onDrop: (word: WordItem, index: number) => void;
  isCorrect?: boolean;
  showGhostWord?: string;
}> = ({ index, word, onDrop, isCorrect, showGhostWord }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'word',
    drop: (item: WordItem) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <motion.div
      ref={drop as any}
      initial={{ scale: 0.8, opacity: 0, rotateX: -90 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
      className={`
        relative min-h-[80px] min-w-[120px] p-4 rounded-2xl border-3 border-dashed
        flex items-center justify-center text-center
        transition-all duration-300 transform-gpu perspective-1000
        ${isOver ? 'border-yellow-400 bg-yellow-400/20 scale-110 shadow-2xl' : ''}
        ${word ? 'border-solid border-white/30' : 'border-purple-300/50'}
        ${isCorrect ? 'border-green-400 bg-green-400/20 shadow-green-400/30' : 'bg-purple-900/20 backdrop-blur-sm'}
        ${!word && showGhostWord ? 'bg-yellow-400/10 border-yellow-300/60' : ''}
        hover:scale-105 hover:shadow-xl
      `}
    >
      {/* Magical portal effect */}
      <div className="absolute inset-0 rounded-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute inset-2 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"
        />
      </div>

      {word ? (
        <motion.div
          initial={{ scale: 0, rotateY: -90 }}
          animate={{ scale: 1, rotateY: 0 }}
          className={`
            relative px-4 py-3 rounded-xl text-white font-bold text-lg z-10
            ${isCorrect ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}
            shadow-xl border-2 border-white/30
          `}
        >
          <Gem className="inline w-5 h-5 mr-2" />
          {word.text}
        </motion.div>
      ) : showGhostWord ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative text-yellow-300 font-medium text-lg italic z-10"
        >
          {showGhostWord}
        </motion.div>
      ) : (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative text-purple-300/60 font-medium z-10"
        >
          <Gem className="w-8 h-8 opacity-50" />
        </motion.div>
      )}

      {/* Slot number indicator */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
        {index + 1}
      </div>
    </motion.div>
  );
};

// Enhanced Gem Power-up Button
const GemPowerUpButton: React.FC<{
  powerUp: PowerUp;
  onActivate: (id: string) => void;
  disabled?: boolean;
  gemsAvailable: number;
}> = ({ powerUp, onActivate, disabled, gemsAvailable }) => {
  const canAfford = gemsAvailable >= powerUp.gemCost;
  const isDisabled = disabled || !canAfford || powerUp.active || powerUp.cooldown > 0;

  const iconMap = {
    shuffle: Shuffle,
    hint: Lightbulb,
    glow: Sparkles,
    timeBoost: Zap
  };

  const Icon = iconMap[powerUp.type];

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.1, rotateZ: 5 } : {}}
      whileTap={!isDisabled ? { scale: 0.9 } : {}}
      onClick={() => !isDisabled && onActivate(powerUp.id)}
      disabled={isDisabled}
      className={`
        relative p-4 rounded-2xl border-2 transition-all duration-300 transform-gpu
        ${isDisabled 
          ? 'bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-br from-purple-600 to-pink-600 border-white/30 text-white hover:shadow-xl hover:shadow-purple-500/50'
        }
        ${powerUp.active ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
      `}
    >
      {/* Gem cost indicator */}
      <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
        {powerUp.gemCost}
      </div>

      <Icon className="w-8 h-8 mb-2" />
      <div className="text-sm font-medium">{powerUp.description}</div>
      
      {powerUp.cooldown > 0 && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
          <div className="text-white font-bold">{powerUp.cooldown}s</div>
        </div>
      )}

      {/* Magical aura effect */}
      {!isDisabled && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-2xl -z-10"
        />
      )}
    </motion.button>
  );
};

// Main Enhanced Speed Builder Component
export const EnhancedSpeedBuilder: React.FC<{
  assignmentId?: string;
  mode?: 'assignment' | 'freeplay';
}> = ({ assignmentId, mode = 'freeplay' }) => {
  // Initialize FSRS spaced repetition system

  // State
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'completed'>('ready');
  const [currentSentence, setCurrentSentence] = useState<SentenceData | null>(null);
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [placedWords, setPlacedWords] = useState<(WordItem | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    accuracy: 0,
    timeSpent: 0,
    sentencesCompleted: 0,
    streak: 0,
    highestStreak: 0,
    totalWordsPlaced: 0,
    grammarErrors: {},
    powerUpsUsed: {},
    gemsCollected: 0,
    bonusMultiplier: 1
  });
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { id: 'shuffle', type: 'shuffle', active: false, cooldown: 0, description: 'Rearrange words', icon: 'shuffle', gemCost: 1 },
    { id: 'hint', type: 'hint', active: false, cooldown: 0, description: 'Highlight next word', icon: 'lightbulb', gemCost: 2 },
    { id: 'glow', type: 'glow', active: false, cooldown: 0, description: 'Show sentence preview', icon: 'sparkles', gemCost: 3 },
    { id: 'timeBoost', type: 'timeBoost', active: false, cooldown: 0, description: '+30 seconds', icon: 'zap', gemCost: 4 }
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [availableSentences, setAvailableSentences] = useState<SentenceData[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showGhostMode, setShowGhostMode] = useState(false);
  const [hintWordIndex, setHintWordIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [floatingGems, setFloatingGems] = useState<FloatingGem[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const searchParams = useSearchParams();

  // Initialize game
  useEffect(() => {
    fetchSentences();
  }, [assignmentId, mode]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft]);

  // Fetch sentences from API
  const fetchSentences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/games/speed-builder/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          assignmentId,
          tier: 'Foundation',
          count: 10,
          difficulty: 'medium'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableSentences(data.sentences || []);
        if (data.sentences?.length > 0) {
          loadSentence(data.sentences[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching sentences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load a sentence for the game
  const loadSentence = (sentence: SentenceData) => {
    setCurrentSentence(sentence);
    
    // Split sentence into words
    const words = sentence.text.split(' ').map((word, index) => ({
      id: `word-${index}`,
      text: word,
      index,
      correct: false,
      gemType: ['ruby', 'sapphire', 'emerald', 'amethyst', 'topaz'][index % 5] as any
    }));
    
    // Shuffle words for gameplay
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setPlacedWords(new Array(words.length).fill(null));
    setHintWordIndex(null);
  };

  // Start game session
  const startGame = async () => {
    try {
      const response = await fetch('/api/games/speed-builder/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          assignmentId,
          gameMode: mode,
          settings: {
            timeLimit: 120,
            difficulty: 'medium',
            tier: 'Foundation'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }

    setGameState('playing');
    setTimeLeft(120);
  };

  // End game session
  const endGame = async () => {
    setGameState('completed');
    
    if (sessionId) {
      try {
        await fetch('/api/games/speed-builder/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'end',
            sessionId,
            stats,
            sentences: availableSentences.slice(0, currentSentenceIndex + 1).map(sentence => ({
              id: sentence.id,
              text: sentence.text,
              englishTranslation: sentence.originalText,
              timeToComplete: 10,
              attempts: 1,
              correctOnFirstTry: true,
              grammarFocus: sentence.curriculum?.grammarFocus,
              curriculum: {
                tier: sentence.curriculum?.tier,
                theme: sentence.curriculum?.theme,
                topic: sentence.curriculum?.topic
              }
            }))
          })
        });
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }

    // Trigger celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handle word drop
  const handleWordDrop = (word: WordItem, targetIndex: number) => {
    if (gameState !== 'playing') return;

    const newPlacedWords = [...placedWords];
    
    // If target position is occupied, swap the words
    if (newPlacedWords[targetIndex]) {
      // Find current position of the word being dropped
      const currentIndex = newPlacedWords.findIndex(w => w?.id === word.id);
      if (currentIndex !== -1) {
        // Swap the words
        newPlacedWords[currentIndex] = newPlacedWords[targetIndex];
      }
    } else {
      // Remove word from its current position if it's already placed
      const currentIndex = newPlacedWords.findIndex(w => w?.id === word.id);
      if (currentIndex !== -1) {
        newPlacedWords[currentIndex] = null;
      }
    }

    // Place word in new position
    newPlacedWords[targetIndex] = word;
    setPlacedWords(newPlacedWords);

    // Update stats
    const isCorrect = word.index === targetIndex;
    setStats(prev => ({
      ...prev,
      totalWordsPlaced: prev.totalWordsPlaced + 1,
      accuracy: (prev.totalWordsPlaced * prev.accuracy + (isCorrect ? 1 : 0)) / (prev.totalWordsPlaced + 1),
      score: prev.score + (isCorrect ? 10 + prev.streak : -2),
      streak: isCorrect ? prev.streak + 1 : 0,
      highestStreak: Math.max(prev.highestStreak, isCorrect ? prev.streak + 1 : prev.streak)
    }));

    // Check if sentence is complete
    if (newPlacedWords.every(w => w !== null)) {
      checkSentenceCompletion(newPlacedWords);
    }
  };

  // Check if sentence is completed correctly
  const checkSentenceCompletion = (words: (WordItem | null)[]) => {
    const isCorrect = words.every((word, index) => word?.index === index);

    // Record FSRS practice for the completed sentence
    if (currentSentence) {
      (async () => {
        try {
          const wordData = {
            id: currentSentence.id || `speed-builder-${currentSentence.text}`,
            word: currentSentence.text,
            translation: currentSentence.translatedText || currentSentence.text,
            language: currentSentence.language || 'es'
          };

          // Calculate confidence based on accuracy and streak
          const baseConfidence = isCorrect ? 0.8 : 0.2;
          const streakBonus = Math.min(stats.streak * 0.05, 0.15); // Up to 15% bonus for streak
          const confidence = Math.max(0.1, Math.min(0.9, baseConfidence + streakBonus));

          // Record practice with FSRS

          console.log(`🔍 [FSRS] Recorded sentence practice for speed-builder:`, {
            sentence: currentSentence.text,
            isCorrect,
            confidence,
            fsrsResult: fsrsResult ? {
              due: fsrsResult.due,
              stability: fsrsResult.stability,
              difficulty: fsrsResult.difficulty
            } : null
          });
        } catch (error) {
          console.error('Error recording FSRS practice for speed builder:', error);
        }
      })();
    }

    if (isCorrect) {
      setStats(prev => ({
        ...prev,
        sentencesCompleted: prev.sentencesCompleted + 1,
        score: prev.score + 50 + (prev.streak * 5)
      }));

      // Move to next sentence
      setTimeout(() => {
        const nextIndex = currentSentenceIndex + 1;
        if (nextIndex < availableSentences.length) {
          setCurrentSentenceIndex(nextIndex);
          loadSentence(availableSentences[nextIndex]);
        } else {
          endGame();
        }
      }, 1500);

      // Success effects
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Activate power-up
  const activatePowerUp = (powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.active || powerUp.cooldown > 0) return;

    setPowerUps(prev => 
      prev.map(p => 
        p.id === powerUpId 
          ? { ...p, active: true, cooldown: 15 }
          : p
      )
    );

    setStats(prev => ({
      ...prev,
      powerUpsUsed: {
        ...prev.powerUpsUsed,
        [powerUpId]: (prev.powerUpsUsed[powerUpId] || 0) + 1
      }
    }));

    // Execute power-up effect
    switch (powerUpId) {
      case 'shuffle':
        setShuffledWords(prev => [...prev].sort(() => Math.random() - 0.5));
        break;
      case 'hint':
        const nextCorrectIndex = placedWords.findIndex(w => w === null);
        setHintWordIndex(nextCorrectIndex);
        setTimeout(() => setHintWordIndex(null), 3000);
        break;
      case 'glow':
        setShowGhostMode(true);
        setTimeout(() => setShowGhostMode(false), 3000);
        break;
      case 'timeBoost':
        setTimeLeft(prev => prev + 30);
        break;
    }

    // Deactivate power-up after use
    setTimeout(() => {
      setPowerUps(prev => 
        prev.map(p => 
          p.id === powerUpId 
            ? { ...p, active: false }
            : p
        )
      );
    }, 1000);
  };

  // Power-up cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerUps(prev => 
        prev.map(p => 
          p.cooldown > 0 
            ? { ...p, cooldown: p.cooldown - 1 }
            : p
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-sm border-b border-blue-200 p-4"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/games" className="text-blue-600 hover:text-blue-800">
                <Home className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Speed Builder Pro
              </h1>
              {mode === 'assignment' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Assignment Mode
                </span>
              )}
            </div>

            {/* Game Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-bold">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className={timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-blue-600'}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-lg font-bold text-purple-600">
                <Trophy className="w-5 h-5" />
                <span>{stats.score}</span>
              </div>

              {gameState === 'ready' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Start Game
                </motion.button>
              )}

              {gameState === 'playing' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('paused')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-xl"
                >
                  <Pause className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Game Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Stats Bar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-blue-200"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.sentencesCompleted}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(stats.accuracy * 100)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
                <div className="text-sm text-gray-600">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.highestStreak}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
            </div>
          </motion.div>

          {currentSentence && gameState === 'playing' && (
            <>
              {/* Current Sentence Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-200"
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Arrange these words to form the sentence:
                  </h2>
                  <div className="text-xl font-medium text-blue-600 mb-2">
                    "{currentSentence.originalText}"
                  </div>
                  {currentSentence.curriculum && (
                    <div className="flex flex-wrap justify-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {currentSentence.curriculum.tier}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        {currentSentence.curriculum.theme}
                      </span>
                      {currentSentence.curriculum.grammarFocus && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {currentSentence.curriculum.grammarFocus}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Power-ups */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center gap-3 mb-6"
              >
                {powerUps.map(powerUp => (
                  <GemPowerUpButton
                    key={powerUp.id}
                    powerUp={powerUp}
                    onActivate={activatePowerUp}
                    disabled={gameState !== 'playing'}
                    gemsAvailable={stats.gemsCollected}
                  />
                ))}
              </motion.div>

              {/* Drop Targets */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
                  Drop the words in the correct order:
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {placedWords.map((word, index) => (
                    <GemDropTarget
                      key={index}
                      index={index}
                      word={word}
                      onDrop={handleWordDrop}
                      isCorrect={word?.index === index}
                      showGhostWord={showGhostMode ? currentSentence.text.split(' ')[index] : undefined}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Available Words */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
                  Available Words:
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {shuffledWords
                    .filter(word => !placedWords.some(placed => placed?.id === word.id))
                    .map(word => (
                      <GemDraggableWord
                        key={word.id}
                        word={word}
                        isGlowing={hintWordIndex !== null && word.index === hintWordIndex}
                        onWordClick={(clickedWord) => {
                          // Auto-place on mobile/touch devices
                          const nextEmptyIndex = placedWords.findIndex(w => w === null);
                          if (nextEmptyIndex !== -1) {
                            handleWordDrop(clickedWord, nextEmptyIndex);
                          }
                        }}
                      />
                    ))}
                </div>
              </motion.div>
            </>
          )}

          {/* Game Over Screen */}
          {gameState === 'completed' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-blue-200"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Excelente! Game Complete!
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{stats.score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{stats.sentencesCompleted}</div>
                  <div className="text-sm text-gray-600">Sentences</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(stats.accuracy * 100)}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{stats.highestStreak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium"
                >
                  <RefreshCw className="w-5 h-5 inline mr-2" />
                  Play Again
                </motion.button>
                
                <Link
                  href="/games"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors inline-flex items-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Games
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DndProvider>
  );
