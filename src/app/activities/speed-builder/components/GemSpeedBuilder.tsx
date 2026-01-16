'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Gem,
  ArrowLeft,
  Crown,
  Play,
  Home,
  Target,
  RotateCcw,
  Trophy,
  Timer
} from 'lucide-react';
import { createBrowserClient } from '../../../../lib/supabase-client';

import confetti from 'canvas-confetti';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SoundProvider, useSound, SoundControls } from './SoundManager';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { getBufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { useSentenceGame } from '../../../../hooks/useSentenceGame';

// Types
interface WordItem {
  id: string;
  text: string;
  index: number;
  correctPosition: number;
  translation?: string;
  vocabularyId?: string | null; // UUID from centralized vocabulary
  correct?: boolean;
  gemType?: 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz';
  isCustomVocabulary?: boolean; // ✅ Track if from enhanced_vocabulary_items
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
  correctWordsPlaced: number; // Track correct words for accurate percentage calculation
  grammarErrors: Record<string, number>;
  gemsCollected: number;
  bonusMultiplier: number;
}



// Modern word box colors - sophisticated palette
const wordColors = {
  ruby: 'from-indigo-500 to-indigo-600',
  sapphire: 'from-blue-500 to-blue-600',
  emerald: 'from-teal-500 to-teal-600',
  diamond: 'from-cyan-500 to-cyan-600',
  amethyst: 'from-violet-500 to-violet-600',
  topaz: 'from-amber-500 to-amber-600'
};



// Pre-defined positions to avoid hydration errors
const backgroundGemPositions = [
  { left: 10, top: 20 }, { left: 85, top: 15 }, { left: 25, top: 70 },
  { left: 75, top: 80 }, { left: 50, top: 30 }, { left: 90, top: 50 },
  { left: 15, top: 85 }, { left: 65, top: 10 }, { left: 40, top: 90 },
  { left: 95, top: 25 }, { left: 5, top: 60 }, { left: 70, top: 45 }
];

// Removed FloatingGems component - using simplified gem collection

// Enhanced Gem Draggable Word Component with better mobile support
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

  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartTime(Date.now());
    setHasMoved(false);
  };

  const handleTouchMove = () => {
    setHasMoved(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const touchDuration = Date.now() - touchStartTime;

    // Only trigger click if it was a quick tap (not a drag) and didn't move much
    if (touchDuration < 300 && !hasMoved && !isDragging) {
      onWordClick?.(word);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only handle mouse clicks on desktop, not touch events
    if (e.type === 'click' && !isDragging) {
      onWordClick?.(word);
    }
  };

  // Cyberpunk data chip colors
  const chipColors = [
    { border: '#10b981', glow: 'rgba(16, 185, 129, 0.5)', bg: 'rgba(16, 185, 129, 0.15)' }, // green
    { border: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)', bg: 'rgba(239, 68, 68, 0.15)' }, // red
    { border: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)', bg: 'rgba(168, 85, 247, 0.15)' }, // purple
    { border: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)', bg: 'rgba(6, 182, 212, 0.15)' }, // cyan
    { border: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)', bg: 'rgba(245, 158, 11, 0.15)' }, // amber
  ];

  const chipColor = chipColors[word.index % chipColors.length];

  return (
    <motion.div
      ref={drag as any}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      initial={{ scale: 0, y: 20, opacity: 0 }}
      animate={{
        scale: 1,
        y: 0,
        opacity: 1,
      }}
      whileHover={{
        scale: 1.08,
        y: -4,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20
      }}
      className={`
        relative cursor-pointer select-none
        px-4 py-2 sm:px-6 sm:py-3 rounded-xl
        transform transition-all duration-200
        ${isDragging ? 'opacity-30 scale-90' : ''}
        text-white font-bold text-base sm:text-xl
        min-w-[100px] sm:min-w-[140px] text-center
        touch-manipulation
      `}
      style={{
        opacity: isDragging ? 0.3 : 1,
        background: chipColor.bg,
        border: `3px solid ${chipColor.border}`,
        boxShadow: isGlowing
          ? `0 0 30px ${chipColor.glow}, 0 0 60px ${chipColor.glow}, inset 0 0 20px ${chipColor.glow}`
          : `0 0 20px ${chipColor.glow}, 0 8px 25px rgba(0,0,0,0.4), inset 0 0 10px ${chipColor.glow}`
      }}
    >
      {/* Tech corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl" style={{ borderColor: chipColor.border }}></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr" style={{ borderColor: chipColor.border }}></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl" style={{ borderColor: chipColor.border }}></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br" style={{ borderColor: chipColor.border }}></div>

      {/* Animated scan line */}
      <motion.div
        animate={{
          y: ['-100%', '200%'],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
        className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none"
      >
        <div
          className="absolute w-full h-8 blur-sm"
          style={{
            background: `linear-gradient(to bottom, transparent, ${chipColor.border}, transparent)`
          }}
        />
      </motion.div>

      {/* Data chip text */}
      <span
        className="relative z-10 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] tracking-wide font-mono uppercase"
        style={{ textShadow: `0 0 10px ${chipColor.glow}` }}
      >
        {word.text}
      </span>

      {/* Pulsing glow when hinted */}
      {isGlowing && (
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${chipColor.glow}, 0 0 80px ${chipColor.glow}, inset 0 0 30px ${chipColor.glow}`
          }}
        />
      )}
    </motion.div>
  );
};

// Enhanced Drop Target with better feedback
const GemDropTarget: React.FC<{
  index: number;
  word: WordItem | null;
  onDrop: (word: WordItem, index: number) => void;
  showSentenceResult?: boolean;
  isCorrect?: boolean;
  showGhostWord?: string;
}> = ({ index, word, onDrop, showSentenceResult = false, isCorrect, showGhostWord }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'word',
    drop: (item: WordItem) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleRemoveWord = () => {
    if (word) {
      // Add the word back to available words by triggering a "drop" to index -1
      onDrop(word, -1);
    }
  };

  // Only show correctness after sentence completion
  const showFeedback = showSentenceResult && word;

  // Octagonal clip path for data slots
  const octagonPath = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";

  return (
    <motion.div
      ref={drop as any}
      onClick={handleRemoveWord}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      whileHover={{
        scale: word ? 1.05 : 1.02,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        relative min-h-[80px] sm:min-h-[100px] min-w-[110px] sm:min-w-[150px]
        flex items-center justify-center
        transition-all duration-300
        touch-manipulation
        ${word ? 'cursor-pointer' : 'cursor-default'}
      `}
      style={{
        clipPath: octagonPath,
        background: !word && !isOver
          ? 'rgba(6, 182, 212, 0.05)'
          : !word && isOver
            ? 'rgba(6, 182, 212, 0.2)'
            : word && !showFeedback
              ? 'rgba(6, 182, 212, 0.15)'
              : word && showFeedback && isCorrect
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(239, 68, 68, 0.2)',
        border: !word && !isOver
          ? '3px dashed rgba(6, 182, 212, 0.4)'
          : !word && isOver
            ? '3px dashed rgba(6, 182, 212, 0.8)'
            : word && !showFeedback
              ? '3px solid rgba(6, 182, 212, 0.6)'
              : word && showFeedback && isCorrect
                ? '3px solid rgba(16, 185, 129, 0.8)'
                : '3px solid rgba(239, 68, 68, 0.8)',
        boxShadow: !word && !isOver
          ? '0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)'
          : !word && isOver
            ? '0 0 40px rgba(6, 182, 212, 0.6), inset 0 0 30px rgba(6, 182, 212, 0.2)'
            : word && !showFeedback
              ? '0 0 25px rgba(6, 182, 212, 0.4), inset 0 0 25px rgba(6, 182, 212, 0.15)'
              : word && showFeedback && isCorrect
                ? '0 0 30px rgba(16, 185, 129, 0.6), inset 0 0 30px rgba(16, 185, 129, 0.2)'
                : '0 0 30px rgba(239, 68, 68, 0.6), inset 0 0 30px rgba(239, 68, 68, 0.2)'
      }}
    >
      {/* Slot number indicator */}
      <div
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-md font-mono font-bold text-xs"
        style={{
          background: 'rgba(6, 182, 212, 0.2)',
          border: '2px solid rgba(6, 182, 212, 0.6)',
          color: '#06b6d4',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
        }}
      >
        {index + 1}
      </div>

      {/* Animated corner markers */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: '#06b6d4' }}></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: '#06b6d4' }}></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: '#06b6d4' }}></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: '#06b6d4' }}></div>

      {/* Content */}
      {word ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="relative text-center"
        >
          <span
            className="relative z-10 font-mono font-bold text-base sm:text-xl tracking-wide uppercase"
            style={{
              color: '#00d9ff',
              textShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.4)'
            }}
          >
            {word.text}
          </span>

          {/* Correct/incorrect indicator */}
          {showFeedback && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-8 -right-8 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                border: isCorrect ? '3px solid #10b981' : '3px solid #ef4444',
                boxShadow: isCorrect
                  ? '0 0 20px rgba(16, 185, 129, 0.6)'
                  : '0 0 20px rgba(239, 68, 68, 0.6)'
              }}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              ) : (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-red-400 font-bold text-xl"
                >
                  ✕
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div className="text-center px-2">
          {showGhostWord ? (
            <div
              className="font-mono font-medium text-base sm:text-xl italic opacity-40"
              style={{ color: '#06b6d4' }}
            >
              {showGhostWord}
            </div>
          ) : (
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="font-mono font-medium text-sm sm:text-base uppercase tracking-wider"
              style={{ color: '#06b6d4' }}
            >
              Data Slot
            </motion.div>
          )}
        </div>
      )}

      {/* Drop zone highlight */}
      {isOver && canDrop && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 border-4 border-yellow-400 rounded-2xl bg-yellow-400/20"
        />
      )}
    </motion.div>
  );
};



// Internal component that uses the sound hook
const GemSpeedBuilderInternal: React.FC<{
  assignmentId?: string;
  mode?: 'assignment' | 'freeplay';
  isAssignmentMode?: boolean;
  theme?: string;
  topic?: string;
  tier?: string;
  vocabularyList?: any[];
  onGameComplete?: (stats: GameStats) => void;
  sentenceConfig?: any;
  onOpenSettings?: () => void;
  onBackToMenu?: () => void;
  gameSessionId?: string | null;
  gameService?: EnhancedGameService | null;
  userId?: string; // 🎯 NEW: For Layer 2 exposure tracking
}> = ({ assignmentId, mode = 'freeplay', isAssignmentMode, theme, topic, tier, vocabularyList, onGameComplete, sentenceConfig, onOpenSettings, onBackToMenu, gameSessionId, gameService, userId }) => {
  // Initialize supabase client for vocabulary lookups
  const supabase = createBrowserClient();

  // Initialize sentence game service for vocabulary tracking with assignment context
  const sentenceGame = useSentenceGame({
    gameType: 'sentence_sprint',
    sessionId: gameSessionId || `speed-builder-${Date.now()}`,
    language: sentenceConfig?.language || 'es',
    gameMode: 'completion',
    difficultyLevel: tier === 'foundation' ? 'beginner' : tier === 'higher' ? 'advanced' : 'intermediate',
    assignmentId: isAssignmentMode ? assignmentId : undefined, // 🎯 Pass for Layer 2
    studentId: isAssignmentMode ? userId : undefined // 🎯 Pass for Layer 2
  });

  // Sound system
  const { playSound, stopMusic } = useSound();

  // Handle back to menu with music cleanup
  const handleBackToMenu = () => {
    stopMusic();
    if (onBackToMenu) {
      onBackToMenu();
    } else if (assignmentId && mode === 'assignment') {
      // Navigate to assignment page in assignment mode
      window.location.href = `/student-dashboard/assignments/${assignmentId}`;
    }
  };

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
    correctWordsPlaced: 0, // Initialize correct words counter
    grammarErrors: {},
    gemsCollected: 0,
    bonusMultiplier: 1
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [availableSentences, setAvailableSentences] = useState<SentenceData[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showGhostMode, setShowGhostMode] = useState(false);
  const [hintWordIndex, setHintWordIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSentenceResult, setShowSentenceResult] = useState(false);
  const [wordPlacementStartTime, setWordPlacementStartTime] = useState<number>(0);
  const [sentenceStartTime, setSentenceStartTime] = useState<number>(0);
  const [targetSentenceCount] = useState(10); // Complete after 10 sentences


  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      // Load assignment config first (if in assignment mode)
      await loadAssignmentConfig();
      // Then fetch sentences with the updated config
      await fetchSentences();
      // Auto-start the game
      startGame();
    };

    initializeGame();
  }, [assignmentId, mode]);

  // Set sentence start time when sentence changes
  useEffect(() => {
    if (currentSentence && gameState === 'playing') {
      setSentenceStartTime(Date.now());
    }
  }, [currentSentenceIndex, currentSentence, gameState]);

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

  // Check for sentence completion when placedWords changes
  useEffect(() => {
    if (gameState === 'playing' && placedWords.every(w => w !== null)) {
      console.log('Sentence complete detected, checking correctness');
      checkSentenceCompleteWithWords(placedWords).catch(console.error);
    }
  }, [placedWords, gameState]);

  // Load assignment configuration for assignment mode
  const loadAssignmentConfig = async () => {
    if (!assignmentId || mode !== 'assignment') return;

    try {
      console.log('Loading assignment config for assignment:', assignmentId);

      // Get the user session for authentication
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Assignment config loaded:', data);

        // Extract game config from vocabulary_criteria field
        const gameConfig = data.assignment?.game_config || data.assignment?.vocabulary_criteria || {};
        console.log('Speed Builder game config:', gameConfig);

        // Override theme/topic from assignment config
        if (gameConfig.theme) {
          theme = gameConfig.theme;
        }
        if (gameConfig.topic) {
          topic = gameConfig.topic;
        }
        if (gameConfig.tier) {
          tier = gameConfig.tier;
        }

        console.log('Updated config from assignment - theme:', theme, 'topic:', topic, 'tier:', tier);

      } else {
        console.error('Failed to load assignment config, status:', response.status);
      }
    } catch (error) {
      console.error('Error loading assignment config:', error);
    }
  };

  const fetchSentences = async () => {
    try {
      setIsLoading(true);

      // Check if we have sentence selection config from the unified selector
      if (sentenceConfig) {
        console.log('Using unified sentence config:', sentenceConfig);

        const requestBody = {
          language: sentenceConfig.language,
          curriculumLevel: sentenceConfig.curriculumLevel,
          categoryId: sentenceConfig.categoryId,
          subcategoryId: sentenceConfig.subcategoryId,
          count: 15,
          customMode: sentenceConfig.customMode
        };

        console.log('Sending unified API request with:', requestBody);

        const response = await fetch('/api/games/speed-builder/unified-sentences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        console.log('Unified API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Unified API response data:', data);

          if (data.sentences?.length > 0) {
            setAvailableSentences(data.sentences);
            loadSentence(data.sentences[0]);
            return; // Success, exit early
          } else {
            console.log('Unified API returned no sentences, falling back to demo sentences');
          }
        } else {
          console.log('Unified API response not ok, status:', response.status);
        }
      } else {
        console.log('No unified sentence config found, using legacy API');

        // Fallback to legacy API for backward compatibility
        const themeMapping: { [key: string]: string } = {
          'Identity and Culture': 'People and lifestyle',
          'Local Area, Holiday and Travel': 'Communication and the world around us',
          'School': 'People and lifestyle',
          'Future Aspirations, Study and Work': 'People and lifestyle',
          'International and Global Dimension': 'Communication and the world around us',
          'Animals and Nature': 'Communication and the world around us',
          'Travel and Culture': 'Communication and the world around us',
          'Technology and Modern Life': 'Popular culture'
        };

        const apiTheme = themeMapping[theme || ''] || 'People and lifestyle';

        const requestBody = {
          mode,
          assignmentId,
          theme: apiTheme,
          topic: topic || 'Identity and relationships',
          tier: tier || 'Foundation',
          count: 15,
          difficulty: 'medium',
          vocabularyList: vocabularyList || []
        };

        const response = await fetch('/api/games/speed-builder/sentences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.sentences?.length > 0) {
            setAvailableSentences(data.sentences);
            loadSentence(data.sentences[0]);
            return;
          }
        }
      }

      // If all APIs fail or return no sentences, show error
      console.log('No sentences available for the selected criteria');
      setAvailableSentences([]);
    } catch (error) {
      console.error('Error fetching sentences:', error);
      setAvailableSentences([]);
    } finally {
      setIsLoading(false);
    }
  };



  // Load a sentence for the game
  const loadSentence = async (sentence: SentenceData) => {
    console.log('Loading sentence:', sentence.text);
    setCurrentSentence(sentence);
    setShowSentenceResult(false); // Reset feedback state

    // Split sentence into words and assign gem types
    const words = await Promise.all(
      sentence.text.split(' ').map(async (word, index) => {
        // Try to find vocabulary ID for this word
        let vocabularyId = null;
        try {
          // Clean the word for vocabulary lookup
          const cleanWord = word.toLowerCase().replace(/[¿¡.,!?]/g, '');

          const { data: vocabData } = await supabase
            .from('centralized_vocabulary')
            .select('id')
            .eq('word', cleanWord)
            .eq('language', 'es')
            .eq('should_track_for_fsrs', true)
            .limit(1);

          if (vocabData && vocabData.length > 0) {
            vocabularyId = vocabData[0].id;
            console.log(`✅ Found vocabulary ID for "${word}": ${vocabularyId}`);
          } else {
            console.log(`⚠️ No vocabulary found for "${word}"`);
          }
        } catch (error) {
          console.warn(`Failed to lookup vocabulary for "${word}":`, error);
        }

        return {
          id: vocabularyId || `fallback-${sentence.id}-${index}`, // Use vocabulary ID if found, fallback otherwise
          text: word,
          index,
          correctPosition: index,
          correct: false,
          vocabularyId: vocabularyId || null, // 🔧 FIX: Only store valid UUID vocabulary IDs, null for fallbacks
          gemType: (['ruby', 'sapphire', 'emerald', 'amethyst', 'topaz', 'diamond'][index % 6] as 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'diamond')
        };
      })
    );

    console.log('Created words:', words);

    // Shuffle words for gameplay - using a deterministic shuffle to avoid hydration issues
    const shuffled = [...words].sort((a, b) => a.text.length - b.text.length).reverse();
    setShuffledWords(shuffled);
    setPlacedWords(new Array(words.length).fill(null));
    setHintWordIndex(null);

    console.log('Shuffled words:', shuffled);
    console.log('Initialized placed words array with length:', words.length);
  };

  // Create gem collection effect (simplified - no floating gems)
  const createGemCollectionEffect = (value: number = 1) => {
    // Instead of floating gems, just update the gem counter with animation
    setStats(prev => ({
      ...prev,
      gemsCollected: prev.gemsCollected + value
    }));
  };

  // Track sentence completion
  const trackSentenceCompletion = async (success: boolean) => {
    if (sessionId && sessionId.startsWith('demo-')) return; // Skip for demo mode

    try {
      // This would send completion data to the API for tracking
      console.log(`Sentence ${success ? 'completed' : 'failed'}`);
    } catch (error) {
      console.error('Error tracking sentence completion:', error);
    }
  };

  // Load next sentence
  const loadNextSentence = () => {
    const nextIndex = currentSentenceIndex + 1;
    setCurrentSentenceIndex(nextIndex);

    // Check if we've completed the target number of sentences
    if (stats.sentencesCompleted >= targetSentenceCount) {
      console.log(`Target reached! Completed ${stats.sentencesCompleted}/${targetSentenceCount} sentences`);
      endGame();
      return;
    }

    if (nextIndex >= availableSentences.length) {
      // No more sentences, end the game
      endGame();
    } else {
      // Reset game state for next sentence
      setPlacedWords([]);
      setShuffledWords([]);
      setHintWordIndex(null);
      setShowGhostMode(false);
      setShowSentenceResult(false);

      // Load the next sentence
      loadSentence(availableSentences[nextIndex]);
    }
  };

  // Start game session
  const startGame = async () => {
    // Use enhanced game service if available, otherwise fall back to legacy API
    console.log('🔍 Speed Builder: Session check:', {
      hasGameService: !!gameService,
      hasGameSessionId: !!gameSessionId,
      gameSessionId: gameSessionId,
      gameServiceType: gameService?.constructor?.name
    });

    if (gameService && gameSessionId) {
      console.log('Speed Builder: Using enhanced session tracking with session ID:', gameSessionId);
      setSessionId(gameSessionId);
    } else {
      console.log('Speed Builder: Falling back to legacy session tracking');
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
              tier: tier || 'Foundation'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          setSessionId(data.sessionId);
        } else {
          // Demo mode - generate a local session ID
          setSessionId(`demo-${Date.now()}`);
        }
      } catch (error) {
        console.error('Error starting session:', error);
        // Demo mode - generate a local session ID
        setSessionId(`demo-${Date.now()}`);
      }
    }

    playSound('ui');
    playSound('bgMusic');
    setGameState('playing');
    setTimeLeft(120);
  };

  // Simplified and reliable word drop handling
  const handleWordDrop = (word: WordItem, targetIndex: number) => {
    if (gameState !== 'playing') return;

    console.log(`Dropping word "${word.text}" (id: ${word.id}) to position ${targetIndex}`);

    // Handle removing word (clicking on placed word) - targetIndex = -1
    if (targetIndex === -1) {
      console.log('Removing word from placed position');
      setPlacedWords(prevPlaced => {
        const currentIndex = prevPlaced.findIndex(w => w?.id === word.id);
        if (currentIndex !== -1) {
          const newPlacedWords = [...prevPlaced];
          newPlacedWords[currentIndex] = null;

          // Add back to shuffled words
          setShuffledWords(prevShuffled => {
            const wordExists = prevShuffled.some(w => w.id === word.id);
            return wordExists ? prevShuffled : [...prevShuffled, word];
          });

          console.log(`Removed word from position ${currentIndex}, added back to shuffled`);
          return newPlacedWords;
        }
        return prevPlaced;
      });
      playSound('drop');
      return;
    }

    // Normal drop operation - use functional updates to ensure consistency
    setPlacedWords(prevPlaced => {
      console.log('Current placed words in setter:', prevPlaced.map((w, i) => `[${i}]: ${w ? `${w.text}(${w.id})` : 'null'}`));

      const newPlacedWords = [...prevPlaced];

      // Find where the word currently is in placed words
      const currentPlacedIndex = prevPlaced.findIndex(w => w?.id === word.id);
      console.log(`Word currently at placed index: ${currentPlacedIndex}`);
      console.log(`Target position ${targetIndex} currently has:`, newPlacedWords[targetIndex] ? `${newPlacedWords[targetIndex]?.text}(${newPlacedWords[targetIndex]?.id})` : 'null');

      // Only displace if there's actually a DIFFERENT word at the target position
      if (newPlacedWords[targetIndex] && newPlacedWords[targetIndex]?.id !== word.id) {
        const displacedWord = newPlacedWords[targetIndex];
        console.log(`Displacing DIFFERENT word "${displacedWord?.text}" from position ${targetIndex}`);

        // Add displaced word back to shuffled
        setShuffledWords(prevShuffled => {
          const existsInShuffled = prevShuffled.some(w => w.id === displacedWord!.id);
          return existsInShuffled ? prevShuffled : [...prevShuffled, displacedWord!];
        });
      }

      // Remove the word from its current placed position (only if it's different from target)
      if (currentPlacedIndex !== -1 && currentPlacedIndex !== targetIndex) {
        newPlacedWords[currentPlacedIndex] = null;
        console.log(`Cleared word from its previous placed position ${currentPlacedIndex}`);
      }

      // Place the word in the target position
      newPlacedWords[targetIndex] = word;
      console.log(`Placed word "${word.text}" at position ${targetIndex}`);

      console.log('New placed words:', newPlacedWords.map((w, i) => `[${i}]: ${w ? `${w.text}(${w.id})` : 'null'}`));

      return newPlacedWords;
    });

    // Remove word from shuffled words
    setShuffledWords(prevShuffled => {
      const currentShuffledIndex = prevShuffled.findIndex(w => w.id === word.id);
      if (currentShuffledIndex !== -1) {
        const newShuffledWords = [...prevShuffled];
        newShuffledWords.splice(currentShuffledIndex, 1);
        console.log(`Removed word from shuffled position ${currentShuffledIndex}`);
        console.log('New shuffled words:', newShuffledWords.map(w => `${w.text}(${w.id})`));
        return newShuffledWords;
      }
      return prevShuffled;
    });

    // Play sound
    playSound('drop');

    // Log word-level performance if game service is available
    if (gameService && gameSessionId && targetIndex !== -1) {
      const responseTime = wordPlacementStartTime > 0 ? Date.now() - wordPlacementStartTime : 0;
      const isCorrect = word.correctPosition === targetIndex;

      // Record vocabulary interaction using gems-first system
      if (gameSessionId) {
        (async () => {
          try {
            const sessionService = getBufferedGameSessionService();

            // Use the vocabulary ID if available, otherwise skip tracking
            if (!word.vocabularyId) {
              console.log(`⚠️ Skipping tracking for "${word.text}" - no vocabulary ID found`);
              return;
            }

            const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'speed-builder', {
              // ✅ FIXED: Use correct ID field based on vocabulary source
              vocabularyId: word.isCustomVocabulary ? undefined : word.vocabularyId,
              enhancedVocabularyItemId: word.isCustomVocabulary ? word.vocabularyId : undefined,
              wordText: word.text,
              translationText: word.translation || word.text,
              responseTimeMs: Math.round(responseTime || 0), // 🔧 FIX: Ensure integer value
              wasCorrect: isCorrect,
              hintUsed: false, // No hints in speed-builder
              streakCount: stats.streak,
              masteryLevel: isCorrect ? 2 : 0, // Higher mastery for correct placements
              maxGemRarity: 'rare', // Cap at rare for sentence building
              gameMode: 'sentence_building',
              difficultyLevel: 'intermediate'
            });
            if (gemEvent) {
              console.log('✅ Speed Builder gem event recorded:', gemEvent);
            }
          } catch (err) {
            console.error('❌ Error recording gem event (continuing gameplay):', err);
            // Don't throw error - log it but continue gameplay
          }
        })();
      }

      // 🔧 FIX: Skip legacy performance logging to avoid UUID/integer conflicts
      // The new EnhancedGameSessionService handles all performance tracking
      console.log(`⚠️ Skipping legacy performance logging for "${word.text}" - handled by EnhancedGameSessionService`);

      // Update stats for rapid-fire metrics
      setStats(prev => ({
        ...prev,
        totalWordsPlaced: prev.totalWordsPlaced + 1,
        correctWordsPlaced: prev.correctWordsPlaced + (isCorrect ? 1 : 0),
        accuracy: (prev.correctWordsPlaced + (isCorrect ? 1 : 0)) / (prev.totalWordsPlaced + 1) // 🔧 FIX: Accuracy as decimal (0-1)
      }));
    }

    // Reset word placement start time for next placement
    setWordPlacementStartTime(Date.now());

    // Check if sentence is complete - we'll do this in a useEffect to ensure state is updated
  };

  // Check if sentence is complete (with words array parameter)
  const checkSentenceCompleteWithWords = async (wordsArray: (WordItem | null)[]) => {
    if (wordsArray.length === 0 || wordsArray.some(w => w === null)) return;

    const isCorrect = wordsArray.every((word, index) => {
      if (!word || !currentSentence) return false;
      return word.correctPosition === index;
    });

    // Show feedback first
    setShowSentenceResult(true);

    if (isCorrect) {
      // 🎯 Process sentence for vocabulary extraction and gem awarding
      console.log('🔍 [SPEED BUILDER] Checking sentence processing conditions:', {
        hasCurrentSentence: !!currentSentence,
        hasGameSessionId: !!gameSessionId,
        hasSentenceGame: !!sentenceGame,
        sentenceText: currentSentence?.text
      });

      if (currentSentence && gameSessionId && sentenceGame) {
        const sentenceText = currentSentence.text;
        const responseTime = Date.now() - sentenceStartTime;

        try {
          console.log(`🎯 [SPEED BUILDER] Processing sentence: "${sentenceText}"`);
          const result = await sentenceGame.processSentence(
            sentenceText,
            true, // Correct sentence
            responseTime,
            false, // No hints used
            currentSentence.id
          );

          if (result) {
            console.log(`✅ [SPEED BUILDER] Sentence processed: ${result.vocabularyMatches.length} vocabulary words found, ${result.totalGems} gems awarded`);
          }
        } catch (error) {
          console.error('❌ [SPEED BUILDER] Error processing sentence:', error);
        }
      } else {
        console.warn('⚠️ [SPEED BUILDER] Skipping sentence processing - missing required data');
      }

      // Sentence is correct - celebrate and move to next
      playSound('correct');
      createGemCollectionEffect(wordsArray.length);

      // Update stats
      const newSentencesCompleted = stats.sentencesCompleted + 1;
      const baseGemsEarned = wordsArray.length;
      const streakBonus = Math.min(stats.streak, 3);
      const totalGemsEarned = baseGemsEarned + streakBonus;

      setStats(prev => ({
        ...prev,
        score: prev.score + (wordsArray.length * 10),
        sentencesCompleted: newSentencesCompleted,
        streak: prev.streak + 1,
        highestStreak: Math.max(prev.highestStreak, prev.streak + 1),
        gemsCollected: prev.gemsCollected + totalGemsEarned
      }));

      // Track sentence completion
      trackSentenceCompletion(true);

      // Show celebration effect
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
        }

        // Move to next sentence after celebration
        setTimeout(() => {
          setShowSentenceResult(false);
          loadNextSentence();
        }, 1500);
      }, 500);

    } else {
      // Sentence has errors - give option to fix
      playSound('incorrect');

      // After 3 seconds, give option to correct or move wrong words back
      setTimeout(() => {
        // Auto-return incorrect words to available pool
        const incorrectWords = wordsArray.filter((word, index) =>
          word && word.correctPosition !== index
        );

        if (incorrectWords.length > 0) {
          // Remove incorrect words from placed positions
          const newPlacedWords = [...placedWords];
          wordsArray.forEach((word, index) => {
            if (word && word.correctPosition !== index) {
              newPlacedWords[index] = null;
            }
          });
          setPlacedWords(newPlacedWords);

          // Add incorrect words back to shuffled words
          setShuffledWords(prev => {
            const currentIds = prev.map(w => w.id);
            const newWords = incorrectWords.filter((w): w is WordItem => w !== null && !currentIds.includes(w.id));
            return [...prev, ...newWords];
          });
        }

        setShowSentenceResult(false);
      }, 3000);
    }
  };



  const endGame = async () => {
    setGameState('completed');

    // Enhanced session tracking is handled by SpeedBuilderGameWrapper
    // Legacy session tracking for backward compatibility
    if (sessionId && !sessionId.startsWith('demo-') && !gameService) {
      console.log('Speed Builder: Ending legacy session');
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
        console.error('Error ending legacy session:', error);
      }
    } else if (gameService) {
      console.log('Speed Builder: Enhanced session tracking handled by wrapper');
    }

    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });
    playSound('levelComplete');

    // Call onGameComplete callback if provided
    if (onGameComplete) {
      onGameComplete(stats);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
        >
          <Gem className="w-8 h-8 text-white" />
        </motion.div>
        <span className="ml-4 text-2xl text-white font-bold">Loading Sprint...</span>
      </div>
    );
  }

  if (!currentSentence && availableSentences.length === 0 && !isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <CheckCircle2 className="w-8 h-8 text-white opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Sentences Available</h2>
          <p className="text-white/80 mb-6">No sentences found for the selected criteria.</p>
          <button
            onClick={handleBackToMenu}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-purple-500/50 transition-all duration-300 border border-white/20 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-[#0a0e27] relative overflow-hidden flex flex-col">
        {/* Animated Circuit Board Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {/* Horizontal lines */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute h-[2px] w-full"
              style={{
                top: `${(i + 1) * 12}%`,
                background: i % 2 === 0
                  ? 'linear-gradient(90deg, transparent, #00d9ff, transparent)'
                  : 'linear-gradient(90deg, transparent, #ff6b35, transparent)'
              }}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Vertical lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute w-[2px] h-full"
              style={{
                left: `${(i + 1) * 16}%`,
                background: i % 2 === 0
                  ? 'linear-gradient(180deg, transparent, #00d9ff, transparent)'
                  : 'linear-gradient(180deg, transparent, #ff6b35, transparent)'
              }}
              animate={{
                y: ['-100%', '100%'],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Circuit nodes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`node-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#00d9ff' : i % 3 === 1 ? '#ff6b35' : '#a855f7'
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Starfield effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Mobile-Responsive Header */}
        <div className="relative z-20 p-2 sm:p-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            {/* Left side - Back button and sound controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={handleBackToMenu} className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded-lg hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base hidden sm:inline">Back</span>
              </button>
              <div className="hidden sm:block">
                <SoundControls />
              </div>
            </div>

            {/* Stats Row - Cyberpunk HUD */}
            {gameState === 'playing' && (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Compact Stats */}
                <div className="flex gap-2 sm:gap-3">
                  <div
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-mono"
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '2px solid rgba(6, 182, 212, 0.5)',
                      boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    <div className="text-xs sm:text-sm font-bold" style={{ color: '#06b6d4' }}>
                      {stats.sentencesCompleted}/{targetSentenceCount}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider hidden sm:block" style={{ color: '#06b6d4', opacity: 0.6 }}>
                      Progress
                    </div>
                  </div>

                  <div
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-mono"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '2px solid rgba(16, 185, 129, 0.5)',
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <div className="text-xs sm:text-sm font-bold" style={{ color: '#10b981' }}>
                      {Math.round(stats.accuracy * 100)}%
                    </div>
                    <div className="text-[9px] uppercase tracking-wider hidden sm:block" style={{ color: '#10b981', opacity: 0.6 }}>
                      Accuracy
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(245, 158, 11, 0.4)',
                      '0 0 30px rgba(245, 158, 11, 0.6)',
                      '0 0 20px rgba(245, 158, 11, 0.4)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-mono font-bold"
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '3px solid rgba(245, 158, 11, 0.6)',
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)"
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider" style={{ color: '#f59e0b', opacity: 0.8 }}>
                      Score
                    </span>
                    <span className="text-lg sm:text-2xl" style={{ color: '#f59e0b', textShadow: '0 0 10px rgba(245, 158, 11, 0.8)' }}>
                      {stats.score}
                    </span>
                  </div>
                </motion.div>

                {/* XP Display */}
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(239, 68, 68, 0.4)',
                      '0 0 30px rgba(239, 68, 68, 0.6)',
                      '0 0 20px rgba(239, 68, 68, 0.4)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-mono font-bold"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '3px solid rgba(239, 68, 68, 0.6)',
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)"
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider" style={{ color: '#ef4444', opacity: 0.8 }}>
                      XP
                    </span>
                    <span className="text-lg sm:text-2xl" style={{ color: '#ef4444', textShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }}>
                      +{stats.gemsCollected * 10}
                    </span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Right side - Timer */}
            <div className="flex items-center gap-2 sm:gap-3">
              {gameState === 'playing' && (
                <motion.div
                  animate={{
                    scale: timeLeft < 20 ? [1, 1.05, 1] : 1,
                    boxShadow: timeLeft < 20
                      ? ['0 0 20px rgba(239, 68, 68, 0.6)', '0 0 40px rgba(239, 68, 68, 0.8)', '0 0 20px rgba(239, 68, 68, 0.6)']
                      : '0 0 20px rgba(6, 182, 212, 0.4)'
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-mono font-bold"
                  style={{
                    background: timeLeft < 20 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                    border: timeLeft < 20 ? '3px solid rgba(239, 68, 68, 0.6)' : '3px solid rgba(6, 182, 212, 0.6)',
                    clipPath: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)",
                    color: timeLeft < 20 ? '#ef4444' : '#06b6d4',
                    textShadow: timeLeft < 20 ? '0 0 10px rgba(239, 68, 68, 0.8)' : '0 0 10px rgba(6, 182, 212, 0.8)'
                  }}
                >
                  <Timer className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </motion.div>
              )}

              {/* Hide settings button in assignment mode */}
              {onOpenSettings && mode !== 'assignment' && (
                <button
                  onClick={onOpenSettings}
                  className="px-2 py-1 sm:px-3 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition-all text-xs sm:text-sm"
                  title="Change Language, Level, Topic & Theme"
                >
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
                  <span className="hidden md:inline">Settings</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Game Content - Mobile Optimized with proper spacing */}
        <div className="relative z-10 flex-1 flex flex-col px-2 sm:px-4 pb-4 min-h-0 overflow-y-auto">
          {currentSentence && gameState === 'playing' && (
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Mission Objective - Cyberpunk Style - More Compact */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative p-4 sm:p-6 text-center flex-shrink-0"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(168, 85, 247, 0.15))',
                  border: '3px solid rgba(6, 182, 212, 0.6)',
                  boxShadow: '0 0 40px rgba(6, 182, 212, 0.4), inset 0 0 40px rgba(6, 182, 212, 0.1)'
                }}
              >
                {/* Corner tech details */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400"></div>

                {/* Animated scan lines */}
                <motion.div
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))" }}
                >
                  <div className="absolute w-full h-12 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent blur-sm"></div>
                </motion.div>

                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  >
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  </motion.div>
                  <h2
                    className="text-xs sm:text-base font-bold uppercase tracking-widest font-mono"
                    style={{
                      color: '#00d9ff',
                      textShadow: '0 0 10px rgba(0, 217, 255, 0.8)'
                    }}
                  >
                    Mission Objective
                  </h2>
                </div>

                <p
                  className="text-xl sm:text-3xl font-bold mb-3 leading-relaxed font-mono"
                  style={{
                    color: '#00d9ff',
                    textShadow: '0 0 20px rgba(0, 217, 255, 0.6), 0 0 40px rgba(0, 217, 255, 0.3)'
                  }}
                >
                  "{currentSentence.translatedText}"
                </p>

                {currentSentence.curriculum && (
                  <div className="flex flex-wrap justify-center gap-3 text-xs">
                    <span
                      className="px-4 py-2 rounded-md font-mono font-bold uppercase tracking-wider"
                      style={{
                        background: 'rgba(6, 182, 212, 0.2)',
                        border: '2px solid rgba(6, 182, 212, 0.6)',
                        color: '#06b6d4',
                        boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
                      }}
                    >
                      {currentSentence.curriculum.tier}
                    </span>
                    <span
                      className="px-4 py-2 rounded-md font-mono font-bold uppercase tracking-wider"
                      style={{
                        background: 'rgba(168, 85, 247, 0.2)',
                        border: '2px solid rgba(168, 85, 247, 0.6)',
                        color: '#a855f7',
                        boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
                      }}
                    >
                      {currentSentence.curriculum.theme.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Data Slots - Cyberpunk Style - More Compact */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative p-3 sm:p-4 flex-shrink-0"
                style={{
                  background: 'rgba(6, 182, 212, 0.05)',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.2), inset 0 0 30px rgba(6, 182, 212, 0.05)'
                }}
              >
                <h3
                  className="text-xs sm:text-base font-bold text-center mb-3 sm:mb-4 flex items-center justify-center gap-2 uppercase tracking-widest font-mono"
                  style={{
                    color: '#06b6d4',
                    textShadow: '0 0 10px rgba(6, 182, 212, 0.8)'
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ▣
                  </motion.div>
                  Data Slots
                </h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-1">
                  {placedWords.map((word, index) => (
                    <GemDropTarget
                      key={index}
                      index={index}
                      word={word}
                      onDrop={handleWordDrop}
                      showSentenceResult={showSentenceResult}
                      isCorrect={word?.index === index}
                      showGhostWord={showGhostMode ? currentSentence.text.split(' ')[index] : undefined}
                    />
                  ))}
                </div>

                {/* Bottom instruction */}
                <p
                  className="text-center mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider"
                  style={{ color: '#06b6d4', opacity: 0.7 }}
                >
                  Place data chips in sequence
                </p>
              </motion.div>

              {/* Available Data Chips - Cyberpunk Style - More Compact */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative p-3 sm:p-4 flex-shrink-0"
                style={{
                  background: 'rgba(168, 85, 247, 0.05)',
                  border: '2px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.2), inset 0 0 30px rgba(168, 85, 247, 0.05)'
                }}
              >
                <h3
                  className="text-xs sm:text-base font-bold text-center mb-3 sm:mb-4 uppercase tracking-widest font-mono"
                  style={{
                    color: '#a855f7',
                    textShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
                  }}
                >
                  Available Data Chips
                </h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 items-start content-start px-1 pb-2">
                  {shuffledWords
                    .filter(word => !placedWords.some(placed => placed?.id === word.id))
                    .map(word => (
                      <GemDraggableWord
                        key={word.id}
                        word={word}
                        isGlowing={hintWordIndex !== null && word.index === hintWordIndex}
                        onWordClick={(clickedWord) => {
                          // Find the next empty slot (left to right)
                          const nextEmptyIndex = placedWords.findIndex(w => w === null);
                          if (nextEmptyIndex !== -1) {
                            handleWordDrop(clickedWord, nextEmptyIndex);
                          }
                        }}
                      />
                    ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Game Completion Screen - Mobile Responsive */}
          {gameState === 'completed' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-white/20 shadow-xl mx-2 sm:mx-0"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-xl"
              >
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Sprint Champion!
              </h2>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 w-full max-w-md">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-2 sm:p-3 bg-blue-500/20 rounded-xl border border-blue-400/50"
                >
                  <div className="text-lg sm:text-2xl font-bold text-blue-300">{stats.score}</div>
                  <div className="text-xs sm:text-sm text-blue-200">Score</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-2 sm:p-3 bg-green-500/20 rounded-xl border border-green-400/50"
                >
                  <div className="text-lg sm:text-2xl font-bold text-green-300">{stats.sentencesCompleted}</div>
                  <div className="text-xs sm:text-sm text-green-200">Sentences</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-2 sm:p-3 bg-purple-500/20 rounded-xl border border-purple-400/50"
                >
                  <div className="text-lg sm:text-2xl font-bold text-purple-300">{Math.round(stats.accuracy * 100)}%</div>
                  <div className="text-xs sm:text-sm text-purple-200">Accuracy</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-2 sm:p-3 bg-yellow-500/20 rounded-xl border border-yellow-400/50"
                >
                  <div className="text-lg sm:text-2xl font-bold text-yellow-300">{stats.gemsCollected}</div>
                  <div className="text-xs sm:text-sm text-yellow-200">Gems</div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Reset game state to restart
                    setGameState('ready');
                    setStats({
                      score: 0,
                      accuracy: 0,
                      timeSpent: 0,
                      sentencesCompleted: 0,
                      streak: 0,
                      highestStreak: 0,
                      totalWordsPlaced: 0,
                      correctWordsPlaced: 0,
                      grammarErrors: {},
                      gemsCollected: 0,
                      bonusMultiplier: 1
                    });
                    setCurrentSentenceIndex(0);
                    setPlacedWords([]);
                    setShuffledWords([]);
                    setTimeLeft(120);
                    setShowSentenceResult(false);
                    setHintWordIndex(null);
                    setShowGhostMode(false);
                  }}
                  className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-sm sm:text-base"
                  style={{
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Play Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackToMenu}
                  className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base"
                  style={{
                    border: '2px solid rgba(6, 182, 212, 0.5)',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                  }}
                >
                  {mode === 'assignment' ? (
                    <>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Assignment
                    </>
                  ) : (
                    <>
                      <Home className="w-4 h-4 mr-2" />
                      Back to Menu
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

// Main wrapper component with SoundProvider
export const GemSpeedBuilder: React.FC<{
  assignmentId?: string;
  mode?: 'assignment' | 'freeplay';
  theme?: string;
  topic?: string;
  tier?: string;
  vocabularyList?: any[];
  onGameComplete?: (stats: GameStats) => void;
  sentenceConfig?: any;
  onOpenSettings?: () => void;
  onBackToMenu?: () => void;
  gameSessionId?: string | null;
  gameService?: EnhancedGameService | null;
}> = (props) => {
  return (
    <SoundProvider initialTheme="default">
      <GemSpeedBuilderInternal {...props} />
    </SoundProvider>
  );
};

export default GemSpeedBuilder;
