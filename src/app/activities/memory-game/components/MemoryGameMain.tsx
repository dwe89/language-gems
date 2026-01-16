'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/client';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { getBufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { RewardEngine } from '../../../../services/rewards/RewardEngine';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useUnifiedAuth } from '../../../../hooks/useUnifiedAuth';
import { WordPair } from './CustomWordsModal';
import CustomWordsModal from './CustomWordsModal';
import { VOCABULARY } from '../data/vocabulary';
import { FALLBACK_VOCABULARY } from '../data/fallbackVocabulary';
import { THEMES, Card } from '../data/gameConstants';
import { GRID_SIZES } from '../data/gameConfig';
import { useGameVocabulary, GameVocabularyWord } from '../../../../hooks/useGameVocabulary';
import {
  Target, RotateCcw, BarChart3, Clock,
  Trophy, Play, Settings, PartyPopper, Volume2, VolumeX, ArrowLeft, Grid3x3
} from 'lucide-react';
import { useGameAudio } from '../../../../hooks/useGlobalAudioContext';
import { createAudio, getAudioUrl } from '../../../../utils/audioUtils';
import { assignmentExposureService } from '../../../../services/assignments/AssignmentExposureService';
import { useGameCompletionTrigger } from '../../../../components/assignments';
import './styles.css';

interface MemoryGameMainProps {
  language: string;
  topic: string;
  difficulty: string;
  onBackToSettings: () => void;
  customWords?: WordPair[];
  isAssignmentMode?: boolean;
  assignmentTitle?: string;
  assignmentId?: string;
  userId?: string;
  vocabulary?: GameVocabularyWord[];
  subcategory?: string;
  curriculumLevel?: 'KS3' | 'KS4';
  onOpenSettings?: () => void;
  audioManager?: any;
  gameSessionId?: string | null;
  onProgressUpdate?: (progress: any) => void;
  onGameComplete?: (progress: any) => void;
  // For exposing controls to wrapper
  onThemeModalRequest?: () => void;
  onGridSizeModalRequest?: () => void;
  onBackgroundThemeChange?: (theme: any) => void;
  onGridSizeChange?: (size: string) => void;
  // Theme selector props for assignment mode
  assignmentTheme?: string;
  onAssignmentThemeChange?: (theme: string) => void;
  showAssignmentThemeSelector?: boolean;
  onToggleAssignmentThemeSelector?: () => void;
}

export default function MemoryGameMain({
  language,
  topic,
  difficulty,
  onBackToSettings,
  customWords,
  isAssignmentMode = false,
  assignmentTitle,
  assignmentId,
  userId,
  vocabulary: providedVocabulary,
  subcategory,
  curriculumLevel = 'KS3',
  onOpenSettings,
  audioManager: externalAudioManager,
  gameSessionId: assignmentGameSessionId,
  onProgressUpdate,
  onGameComplete,
  onThemeModalRequest,
  onGridSizeModalRequest,
  onBackgroundThemeChange,
  onGridSizeChange
}: MemoryGameMainProps) {
  const { user, isLoading, isDemo } = useUnifiedAuth();

  // Initialize FSRS spaced repetition system
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Audio refs
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  // Global audio context for assignment mode compatibility
  const internalAudioManager = useGameAudio(true);
  const audioManager = externalAudioManager || internalAudioManager;

  // Initialize completion trigger
  const { triggerWordComplete } = useGameCompletionTrigger();

  // Add state for current game settings
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentTopic, setCurrentTopic] = useState(topic);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Add state for custom words
  const [currentCustomWords, setCurrentCustomWords] = useState<WordPair[]>(customWords || []);

  // Update custom words when prop changes (for assignment mode)
  useEffect(() => {
    if (customWords && customWords.length > 0) {
      setCurrentCustomWords(customWords);
    }
  }, [customWords]);

  // Add timer state for tracking time spent
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [gameTime, setGameTime] = useState(0);

  // LAYER 1: Session Deduplication - Track words used in this session
  const [usedWordsThisSession, setUsedWordsThisSession] = useState<Set<string>>(new Set());

  // Add vocabulary progress tracking
  const [vocabularyProgress, setVocabularyProgress] = useState<Map<string | number, {
    vocabularyId: string | number;
    attempts: number;
    correctAttempts: number;
    responseTime: number;
    wasCorrect: boolean;
    firstAttemptTime?: Date;
  }>>(new Map());

  // Track session-specific matches for progress display (not all-time gems)
  const [sessionMatches, setSessionMatches] = useState(0);

  // Enhanced game service integration
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  // Add state to force re-render on screen size changes for responsive grid
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Add window resize listener for responsive grid updates
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use assignment gameSessionId when in assignment mode, otherwise use own session
  const effectiveGameSessionId = isAssignmentMode ? assignmentGameSessionId : gameSessionId;

  // Modern vocabulary integration - only use for non-assignment mode
  const { vocabulary: gameVocabulary, loading: vocabularyLoading } = useGameVocabulary({
    language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en',
    categoryId: isAssignmentMode ? undefined : topic, // Don't fetch vocabulary in assignment mode
    subcategoryId: isAssignmentMode ? undefined : subcategory,
    limit: 50,
    randomize: true,
    curriculumLevel: curriculumLevel,
    enabled: !isAssignmentMode // Disable vocabulary fetching in assignment mode
  });

  // Initialize Supabase client and game service (skip in assignment mode to avoid RLS issues)
  useEffect(() => {
    if (isAssignmentMode) {
      console.log('Assignment mode: Skipping EnhancedGameService initialization - using wrapper session management');
      return;
    }

    const supabase = createClient();

    if ((userId || user?.id) && !isDemo) {
      const service = new EnhancedGameService(supabase);
      setGameService(service);
    }
  }, [userId, user?.id, isAssignmentMode]);

  // Start game session when game service is ready and game starts (only for free play mode)
  useEffect(() => {
    if (gameService && (userId || user?.id) && !isDemo && startTime && !gameSessionId && !isAssignmentMode) {
      startGameSession();
    }
  }, [gameService, userId, user?.id, startTime, gameSessionId, isAssignmentMode]);

  const startGameSession = async () => {
    if (!gameService || !(userId || user?.id) || isDemo) return;

    // Skip session creation in assignment mode to avoid RLS issues
    // Assignment mode uses GameAssignmentWrapper session management
    if (isAssignmentMode) {
      console.log('Assignment mode: Skipping game session creation - using wrapper session management');
      return;
    }

    try {
      const sessionId = await gameService.startGameSession({
        student_id: userId || user!.id,
        assignment_id: assignmentId || undefined,
        game_type: 'memory-game',
        session_mode: isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 100,
        session_data: {
          language: currentLanguage,
          topic: currentTopic,
          difficulty: currentDifficulty,
          customWordsCount: currentCustomWords.length,
          gridSize: cards.length,
          totalPairs: cards.length / 2
        }
      });
      setGameSessionId(sessionId);
      console.log('Memory game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start memory game session:', error);
    }
  };

  // Initialize game
  useEffect(() => {
    // Initialize audio context first
    if (audioManager && !audioManager.state.isInitialized) {
      audioManager.initializeAudio().catch(console.warn);
    }

    // Initialize audio using audio utility
    console.log('🎵 Initializing memory game audio files...');
    correctSoundRef.current = createAudio('/games/memory-game/sounds/correct.mp3');
    wrongSoundRef.current = createAudio('/games/memory-game/sounds/wrong.mp3');
    winSoundRef.current = createAudio('/games/memory-game/sounds/win.mp3');

    console.log('🎵 Audio refs created:', {
      correct: !!correctSoundRef.current,
      wrong: !!wrongSoundRef.current,
      win: !!winSoundRef.current
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('memoryGameTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setSelectedTheme(parsedTheme);
      } catch (e) {
        console.error('Error loading saved theme:', e);
      }
    }

    // Initialize cards
    initializeGame();

    // Set start time
    setStartTime(new Date());

    // Cleanup on unmount
    return () => {
      correctSoundRef.current = null;
      wrongSoundRef.current = null;
      winSoundRef.current = null;
    };
  }, [currentLanguage, currentTopic, currentDifficulty, currentCustomWords]);

  // LAYER 2: Record word exposures on unmount (assignment mode only)
  useEffect(() => {
    return () => {
      if (isAssignmentMode && assignmentId && userId) {
        const exposedWordIds = Array.from(usedWordsThisSession);
        if (exposedWordIds.length > 0) {
          console.log('📝 [LAYER 2] Recording word exposures on unmount:', {
            assignmentId,
            studentId: userId,
            wordCount: exposedWordIds.length
          });

          assignmentExposureService.recordWordExposures(
            assignmentId,
            userId,
            exposedWordIds
          ).then(result => {
            if (result.success) {
              console.log('✅ [LAYER 2] Exposures recorded successfully');
            } else {
              console.error('❌ [LAYER 2] Failed to record exposures:', result.error);
            }
          });
        }
      }
    };
  }, [isAssignmentMode, assignmentId, userId, usedWordsThisSession]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (startTime && !gameWon) {
      timer = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setGameTime(elapsed);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [startTime, gameWon]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (gameContainerRef.current?.requestFullscreen) {
        gameContainerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error('Error attempting to enable fullscreen:', err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error('Error attempting to exit fullscreen:', err));
      }
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Helper to calculate grid columns based on number of cards
  const calculateGridLayout = (totalCards: number, difficulty: string) => {
    // Always calculate pairs from total cards to ensure consistency
    const actualPairs = Math.floor(totalCards / 2);

    // Check if we're on a mobile device using state (more reliable for SSR)
    const isMobile = screenWidth <= 768;
    const isSmallMobile = screenWidth <= 480;

    if (isSmallMobile) {
      // For very small screens, prioritize narrow layouts and avoid cramped grids
      if (actualPairs <= 3) return { cols: 2, rows: 3 }; // 3 pairs (6 cards) in 2x3
      if (actualPairs <= 4) return { cols: 2, rows: 4 }; // 4 pairs (8 cards) in 2x4
      if (actualPairs <= 5) return { cols: 2, rows: 5 }; // 5 pairs (10 cards) in 2x5
      if (actualPairs <= 6) return { cols: 3, rows: 4 }; // 6 pairs (12 cards) in 3x4
      if (actualPairs <= 8) return { cols: 3, rows: 6 }; // 8 pairs (16 cards) in 3x6 (if needed)
      if (actualPairs <= 10) return { cols: 3, rows: 7 }; // 10 pairs (20 cards) in 3x7 - much better than 4x5
    } else if (isMobile) {
      // For tablets/mobile in portrait, use more balanced layouts
      if (actualPairs <= 3) return { cols: 3, rows: 2 }; // 3 pairs (6 cards) in 3x2
      if (actualPairs <= 4) return { cols: 3, rows: 3 }; // 4 pairs (8 cards) in 3x3 (with empty spaces)
      if (actualPairs <= 5) return { cols: 4, rows: 3 }; // 5 pairs (10 cards) in 4x3
      if (actualPairs <= 6) return { cols: 4, rows: 3 }; // 6 pairs (12 cards) in 4x3
      if (actualPairs <= 8) return { cols: 4, rows: 4 }; // 8 pairs (16 cards) in 4x4
      if (actualPairs <= 10) return { cols: 4, rows: 5 }; // 10 pairs (20 cards) in 4x5
    } else {
      // Desktop layouts (original logic)
      if (actualPairs <= 3) return { cols: 3, rows: 2 }; // 3 pairs (6 cards) in 3x2
      if (actualPairs <= 4) return { cols: 4, rows: 2 }; // 4 pairs (8 cards) in 4x2
      if (actualPairs <= 5) return { cols: 5, rows: 2 }; // 5 pairs (10 cards) in 5x2
      if (actualPairs <= 6) return { cols: 4, rows: 3 }; // 6 pairs (12 cards) in 4x3
      if (actualPairs <= 8) return { cols: 4, rows: 4 }; // 8 pairs (16 cards) in 4x4
      if (actualPairs <= 10) return { cols: 5, rows: 4 }; // 10 pairs (20 cards) in 5x4
    }

    // For larger sets, calculate a reasonable square-ish layout
    const sqrt = Math.ceil(Math.sqrt(totalCards));
    if (isMobile) {
      // On mobile, prefer more rows than columns
      return { cols: Math.min(sqrt, 4), rows: Math.ceil(totalCards / Math.min(sqrt, 4)) };
    }
    return { cols: sqrt, rows: sqrt };
  };

  // Save assignment progress when game is completed
  const saveAssignmentProgress = async (timeSpent: number, totalMatches: number, totalAttempts: number) => {
    console.log('saveAssignmentProgress called:', { isAssignmentMode, assignmentId, timeSpent, totalMatches, totalAttempts });
    console.log('vocabularyProgress:', vocabularyProgress);

    // End enhanced game session (only for free play mode - assignment mode handled by wrapper)
    if (gameService && effectiveGameSessionId && (userId || user?.id) && !isDemo && !isAssignmentMode) {
      try {
        const accuracy = totalAttempts > 0 ? (totalMatches / totalAttempts) * 100 : 0;
        const finalScore = Math.round(accuracy);

        // Use gems-first system: XP calculated from individual vocabulary interactions
        // Remove conflicting XP calculation - gems system handles all scoring through recordWordAttempt()
        const totalXP = totalMatches * 10; // 10 XP per match (gems-first)

        await gameService.endGameSession(effectiveGameSessionId!, {
          student_id: userId || user!.id,
          assignment_id: isAssignmentMode ? assignmentId : undefined,
          game_type: 'memory-game',
          session_mode: isAssignmentMode ? 'assignment' : 'free_play',
          final_score: finalScore,
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: totalAttempts,
          words_correct: totalMatches,
          unique_words_practiced: vocabularyProgress.size,
          duration_seconds: timeSpent,
          xp_earned: totalXP,
          bonus_xp: 0, // No bonus XP in gems-first system
          session_data: {
            matches: totalMatches,
            attempts: totalAttempts,
            gameType: 'memory-game',
            gridSize: cards.length,
            totalPairs: cards.length / 2,
            averageResponseTime: timeSpent / totalAttempts,
            memoryAccuracy: accuracy,
            perfectMatches: totalMatches
          }
        });

        console.log('Enhanced game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end enhanced game session:', error);
      }
    }

    if (!isAssignmentMode || !assignmentId) {
      console.log('Not saving progress - not in assignment mode or no assignment ID');
      return;
    }

    try {
      const response = await fetch(`/api/assignments/${assignmentId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          score: Math.round((totalMatches / totalAttempts) * 100), // Calculate accuracy percentage
          accuracy: Math.round((totalMatches / totalAttempts) * 100),
          timeSpent,
          attempts: totalAttempts,
          gameSession: {
            sessionData: {
              matches: totalMatches,
              attempts: totalAttempts,
              gameType: 'memory-game',
              timeSpent: timeSpent
            },
            vocabularyPracticed: Array.from(vocabularyProgress.keys()),
            wordsCorrect: totalMatches,
            wordsAttempted: totalAttempts
          },
          vocabularyProgress: Array.from(vocabularyProgress.values()).map(progress => ({
            vocabularyId: progress.vocabularyId,
            attempts: progress.attempts,
            correctAttempts: progress.correctAttempts,
            responseTime: progress.responseTime,
            wasCorrect: progress.wasCorrect
          }))
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save assignment progress:', response.status, errorText);
      } else {
        const responseData = await response.json();
        console.log('Assignment progress saved successfully:', responseData);
      }
    } catch (error) {
      console.error('Error saving assignment progress:', error);
    }
  };

  // Initialize the game with cards
  const initializeGame = () => {
    // Set start time when game begins
    setStartTime(new Date());
    let totalPairs = 0;
    let wordPairs: any[] = [];

    // First determine number of pairs based on difficulty
    switch (currentDifficulty) {
      case 'easy-1':
        totalPairs = 3;
        break;
      case 'easy-2':
        totalPairs = 4;
        break;
      case 'medium-1':
        totalPairs = 5;
        break;
      case 'medium-2':
        totalPairs = 6;
        break;
      case 'hard-2':
        totalPairs = 8;
        break;
      case 'expert':
        totalPairs = 10;
        break;
      default:
        totalPairs = 6; // Default to medium
        break;
    }

    // Then check for custom words and limit them to the determined pairs
    if (currentCustomWords && currentCustomWords.length > 0) {
      // Transform custom words and limit to totalPairs (preserve vocabulary ID for FSRS tracking)
      let transformedWords = currentCustomWords.map(pair => {
        if (pair.type === 'image') {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: true,
            id: pair.id, // ✅ Preserve vocabulary ID for FSRS
            vocabulary_id: pair.id, // ✅ Legacy compatibility
            isCustomVocabulary: (pair as any).isCustomVocabulary // ✅ Preserve custom vocabulary flag
          };
        } else {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: false,
            id: pair.id, // ✅ Preserve vocabulary ID for FSRS
            vocabulary_id: pair.id, // ✅ Legacy compatibility
            isCustomVocabulary: (pair as any).isCustomVocabulary // ✅ Preserve custom vocabulary flag
          };
        }
      });

      // LAYER 1: Filter out words already used in this session (assignment mode only)
      if (isAssignmentMode && usedWordsThisSession.size > 0) {
        const beforeFilter = transformedWords.length;
        transformedWords = transformedWords.filter(word => !usedWordsThisSession.has(word.id));
        console.log(`🎯 [LAYER 1] Session deduplication: ${beforeFilter} → ${transformedWords.length} words`);
      }

      // Limit to the determined number of pairs
      wordPairs = transformedWords.slice(0, totalPairs);
    } else {
      // Priority 1: Use provided vocabulary (for assignment mode)
      console.log('Memory Game - providedVocabulary:', providedVocabulary?.length || 0, 'items');
      if (providedVocabulary && providedVocabulary.length > 0) {
        const vocabList = providedVocabulary.map(item => ({
          term: item.word,
          translation: item.translation,
          isImage: false,
          id: item.id,
          vocabulary_id: item.id,
          audio_url: item.audio_url,
          isCustomVocabulary: item.isCustomVocabulary // ✅ Preserve custom vocabulary flag
        }));
        wordPairs = vocabList.slice(0, totalPairs);

        // If not enough pairs, duplicate some
        while (wordPairs.length < totalPairs) {
          const remaining = totalPairs - wordPairs.length;
          wordPairs = [...wordPairs, ...vocabList.slice(0, Math.min(remaining, vocabList.length))];
        }
      }
      // Priority 2: Use modern vocabulary system
      else if (gameVocabulary && gameVocabulary.length > 0) {
        console.log('Memory Game - gameVocabulary:', gameVocabulary?.length || 0, 'items');
        const vocabList = gameVocabulary.map(item => ({
          term: item.word,
          translation: item.translation,
          isImage: false,
          id: item.id,
          vocabulary_id: item.id,
          audio_url: item.audio_url,
          isCustomVocabulary: item.isCustomVocabulary // ✅ Preserve custom vocabulary flag
        }));
        wordPairs = vocabList.slice(0, totalPairs);

        // If not enough pairs, duplicate some
        while (wordPairs.length < totalPairs) {
          const remaining = totalPairs - wordPairs.length;
          wordPairs = [...wordPairs, ...vocabList.slice(0, Math.min(remaining, vocabList.length))];
        }
      }
      // Priority 3: Use legacy vocabulary system
      else if (VOCABULARY[currentTopic] && VOCABULARY[currentTopic][currentLanguage]) {
        const vocabList = VOCABULARY[currentTopic][currentLanguage];
        wordPairs = vocabList.slice(0, totalPairs);

        // If not enough pairs, duplicate some
        while (wordPairs.length < totalPairs) {
          const remaining = totalPairs - wordPairs.length;
          wordPairs = [...wordPairs, ...vocabList.slice(0, Math.min(remaining, vocabList.length))];
        }
      } else {
        // If specific topic/language combination not found, use fallback vocabulary for the current language
        const fallbackVocab = FALLBACK_VOCABULARY[currentLanguage] || FALLBACK_VOCABULARY.english;
        wordPairs = fallbackVocab;

        // Use appropriate number of pairs for the difficulty
        switch (currentDifficulty) {
          case 'easy-1': totalPairs = 3; break;
          case 'easy-2': totalPairs = 4; break;
          case 'medium-1': totalPairs = 5; break;
          case 'medium-2': totalPairs = 6; break;
          case 'hard-2': totalPairs = 8; break;
          case 'expert': totalPairs = 10; break;
          default: totalPairs = 6; break;
        }

        // Limit to available pairs
        totalPairs = Math.min(fallbackVocab.length, totalPairs);
      }
    }

    // Create card pairs
    const newCards: Card[] = [];

    // Limit to the determined number of pairs
    wordPairs = wordPairs.slice(0, totalPairs);

    // Create card pairs (term and translation cards)
    wordPairs.forEach((pair, index) => {
      console.log('Creating cards for pair:', pair);

      // First card (term)
      newCards.push({
        id: index * 2,
        value: pair.term,
        isImage: pair.isImage && pair.type === 'image',
        flipped: false,
        matched: false,
        pairId: index,
        vocabularyId: pair.id || pair.vocabulary_id, // For assignment mode
        isCustomVocabulary: pair.isCustomVocabulary // ✅ Preserve custom vocabulary flag
      });

      // Second card (translation)
      newCards.push({
        id: index * 2 + 1,
        value: pair.translation,
        isImage: pair.isImage && pair.type === 'image',
        flipped: false,
        matched: false,
        pairId: index,
        vocabularyId: pair.id || pair.vocabulary_id, // For assignment mode
        isCustomVocabulary: pair.isCustomVocabulary // ✅ Preserve custom vocabulary flag
      });
    });

    console.log('Created cards:', newCards.map(c => ({ id: c.id, value: c.value, vocabularyId: c.vocabularyId })));

    // Shuffle the cards
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
    setMatches(0);
    setAttempts(0);
    setFirstCard(null);
    setSecondCard(null);
    setCanFlip(true);
    setGameWon(false);
  };

  // Handle card click
  const handleCardClick = async (card: Card) => {
    // Ignore if can't flip or card is already flipped/matched
    if (!canFlip || card.flipped || card.matched) {
      return;
    }

    // Flip the card and set first attempt time if needed
    const now = new Date();
    const updatedCards = cards.map(c =>
      c.id === card.id ? {
        ...c,
        flipped: true,
        firstAttemptTime: c.firstAttemptTime || now
      } : c
    );
    setCards(updatedCards);

    // If it's the first card
    if (!firstCard) {
      const cardWithTime = { ...card, firstAttemptTime: card.firstAttemptTime || now };
      setFirstCard(cardWithTime);
      return;
    }

    // If it's the second card
    setSecondCard(card);
    setCanFlip(false);
    setAttempts(attempts + 1);

    // Check for match
    if (firstCard.pairId === card.pairId) {
      // It's a match
      console.log('🎵 Playing correct sound...');
      if (correctSoundRef.current) {
        audioManager.playAudio(correctSoundRef.current).catch((error: any) => {
          console.warn('Failed to play correct sound:', error);
        });
      } else {
        console.warn('correctSoundRef.current is null');
      }

      setTimeout(async () => {
        // Mark both cards as matched
        const matchedCards = cards.map(c =>
          c.pairId === firstCard.pairId ? { ...c, matched: true, flipped: true } : c
        );
        setCards(matchedCards);
        setFirstCard(null);
        setSecondCard(null);
        setCanFlip(true);
        setMatches(matches + 1);
        setSessionMatches(prev => prev + 1); // Track session matches separately

        // LAYER 1: Mark word as used in this session (assignment mode only)
        if (isAssignmentMode && firstCard.vocabularyId) {
          setUsedWordsThisSession(prev => {
            const newSet = new Set(prev);
            newSet.add(firstCard.vocabularyId!);
            console.log(`🎯 [LAYER 1] Marked word as used: ${firstCard.vocabularyId} (total: ${newSet.size})`);
            return newSet;
          });

          // Trigger completion check
          triggerWordComplete(true, firstCard.vocabularyId);
        }

        // Play audio for the vocabulary word if available
        // Try to play audio for the Spanish term (assuming it's available)
        const audioUrl = (firstCard as any).audio_url;
        if (audioUrl) {
          setTimeout(() => {
            // Use audio utility to get correct URL for vocabulary audio
            const audio = new Audio(getAudioUrl(audioUrl));
            audio.play().catch(error => {
              console.warn('Failed to play vocabulary audio:', error);
            });
          }, 500); // Delay to let the correct sound play first
        }

        // Track vocabulary progress for matched pair
        if (firstCard.vocabularyId) {
          const now = new Date();
          const responseTime = firstCard.firstAttemptTime ?
            (now.getTime() - firstCard.firstAttemptTime.getTime()) / 1000 : 0;

          // Prepare card data for tracking
          const vocabularyId = firstCard.vocabularyId;
          const cardWord = firstCard.word || firstCard.value;
          const cardTranslation = firstCard.translation || 'translation';

          // Record word practice with FSRS system (works in both assignment and free play modes)
          if (!isDemo) {
            try {
              // 🔍 INSTRUMENTATION: Debug vocabulary ID passing
              console.log('🔍 [FSRS DEBUG] Memory Game card data:', {
                firstCardVocabularyId: firstCard.vocabularyId,
                firstCardVocabularyIdType: typeof firstCard.vocabularyId,
                firstCardWord: firstCard.word,
                firstCardTranslation: firstCard.translation,
                firstCardValue: firstCard.value
              });

              if (!vocabularyId) {
                console.error('🚨 [FSRS ERROR] No vocabulary ID found for memory card:', {
                  firstCard,
                  firstCardKeys: Object.keys(firstCard)
                });
                console.log('🔍 [FSRS DEBUG] Skipping FSRS - no vocabulary ID available');
              } else {
                // Record practice for both words in the matched pair
                const wordData = {
                  id: vocabularyId,
                  word: cardWord,
                  translation: cardTranslation,
                  language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
                };

                console.log('🔍 [FSRS DEBUG] Word data being passed to FSRS:', wordData);

                // FSRS tracking happens in EnhancedGameSessionService (Layer 3)
                console.log('✅ [LAYER 3] FSRS tracking handled by EnhancedGameSessionService');
              }
            } catch (error) {
              console.error('Error recording vocabulary tracking:', error);
            }
          }

          // Record word attempt using gems system
          if (!isDemo) {
            try {
              // 🔍 INSTRUMENTATION: Log vocabulary tracking details
              console.log('🔍 [VOCAB TRACKING] Starting vocabulary tracking for memory match:', {
                vocabularyId: firstCard.vocabularyId,
                vocabularyIdType: typeof firstCard.vocabularyId,
                word: cardWord,
                translation: cardTranslation,
                wasCorrect: true,
                gameMode: 'memory_match',
                isAssignmentMode,
                isCustomVocabulary: firstCard.isCustomVocabulary
              });

              // 🎯 Always use EnhancedGameSessionService for vocabulary tracking
              if (effectiveGameSessionId) {
                const sessionService = getBufferedGameSessionService();
                const gemEvent = await sessionService.recordWordAttempt(effectiveGameSessionId, 'memory-game', {
                  // ✅ FIXED: Use correct ID field based on vocabulary source
                  vocabularyId: firstCard.isCustomVocabulary ? undefined : firstCard.vocabularyId,
                  enhancedVocabularyItemId: firstCard.isCustomVocabulary ? firstCard.vocabularyId : undefined,
                  wordText: cardWord,
                  translationText: cardTranslation,
                  responseTimeMs: Math.round(responseTime * 1000),
                  wasCorrect: true, // Always true for matched pairs
                  hintUsed: false,
                  streakCount: matches + 1,
                  difficultyLevel: 'beginner',
                  gameMode: 'memory_match',
                  maxGemRarity: 'common' // Cap at common for luck-based games
                }, false); // Enable FSRS for tracking

                // 🔍 INSTRUMENTATION: Log gem event result
                console.log('🔍 [VOCAB TRACKING] Gem event result:', {
                  gemEventExists: !!gemEvent,
                  gemEvent: gemEvent ? {
                    rarity: gemEvent.rarity,
                    xpValue: gemEvent.xpValue,
                    vocabularyId: gemEvent.vocabularyId,
                    wordText: gemEvent.wordText
                  } : null,
                  wasCorrect: true
                });

                // Show gem feedback if gem was awarded
                if (gemEvent) {
                  console.log(`🔮 Memory Game earned ${gemEvent.rarity} gem (${gemEvent.xpValue} XP) for "${cardWord}"`);
                }
              } else {
                console.log('🔍 [VOCAB TRACKING] Skipped - no session or assignment wrapper available');
              }
            } catch (error) {
              console.error('Error recording word attempt:', error);
            }
          }

          // Track vocabulary progress for assignment mode
          if (isAssignmentMode) {
            setVocabularyProgress(prev => {
              const newProgress = new Map(prev);
              const existing = newProgress.get(firstCard.vocabularyId!) || {
                vocabularyId: firstCard.vocabularyId!,
                attempts: 0,
                correctAttempts: 0,
                responseTime: 0,
                wasCorrect: false
              };

              newProgress.set(firstCard.vocabularyId!, {
                ...existing,
                attempts: existing.attempts + 1,
                correctAttempts: existing.correctAttempts + 1,
                responseTime: responseTime,
                wasCorrect: true
              });

              return newProgress;
            });
          }
        }

        // Check for win condition
        const totalPairs = cards.length / 2;
        if (matches + 1 === totalPairs) {
          setGameWon(true);
          console.log('🎵 Playing win sound...');
          if (winSoundRef.current) {
            audioManager.playAudio(winSoundRef.current).catch((error: any) => {
              console.warn('Failed to play win sound:', error);
            });
          } else {
            console.warn('winSoundRef.current is null');
          }

          // Save assignment progress if in assignment mode
          if (isAssignmentMode && startTime) {
            const endTime = new Date();
            const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000); // in seconds

            // Call the assignment wrapper callbacks if available
            if (onGameComplete) {
              const accuracy = ((matches + 1) / (attempts + 1)) * 100;
              onGameComplete({
                assignmentId: assignmentId,
                gameId: 'memory-game',
                studentId: userId || user?.id,
                wordsCompleted: matches + 1,
                totalWords: cards.length / 2,
                score: Math.round(accuracy),
                maxScore: 100,
                accuracy: accuracy,
                timeSpent: timeSpent,
                completedAt: new Date(),
                sessionData: {
                  matches: matches + 1,
                  attempts: attempts + 1,
                  gameType: 'memory-game',
                  gridSize: cards.length,
                  totalPairs: cards.length / 2
                }
              });
            } else {
              // Fallback to legacy assignment progress saving
              saveAssignmentProgress(timeSpent, matches + 1, attempts + 1);
            }
          }
        }
      }, 500);
    } else {
      // Not a match
      console.log('🎵 Playing wrong sound...');
      if (wrongSoundRef.current) {
        audioManager.playAudio(wrongSoundRef.current).catch((error: any) => {
          console.warn('Failed to play wrong sound:', error);
        });
      } else {
        console.warn('wrongSoundRef.current is null');
      }

      // Track vocabulary progress for failed attempt
      if (firstCard.vocabularyId) {
        const now = new Date();
        const responseTime = firstCard.firstAttemptTime ?
          (now.getTime() - firstCard.firstAttemptTime.getTime()) / 1000 : 0;

        // ❌ REMOVED: No FSRS tracking for failed matches in Memory Game
        // Memory games are luck-based, not knowledge-based
        // Only successful matches should be tracked for positive reinforcement
        console.log('🎮 [MEMORY GAME] Failed match - no tracking (luck-based game)');

        // Track vocabulary progress for assignment mode
        if (isAssignmentMode) {
          setVocabularyProgress(prev => {
            const newProgress = new Map(prev);
            const existing = newProgress.get(firstCard.vocabularyId!) || {
              vocabularyId: firstCard.vocabularyId!,
              attempts: 0,
              correctAttempts: 0,
              responseTime: 0,
              wasCorrect: false
            };

            newProgress.set(firstCard.vocabularyId!, {
              ...existing,
              attempts: existing.attempts + 1,
              responseTime: responseTime,
              wasCorrect: false
            });

            return newProgress;
          });
        }
      }

      setTimeout(() => {
        const resetCards = cards.map(c =>
          (c.id === firstCard.id || c.id === card.id) ? { ...c, flipped: false } : c
        );
        setCards(resetCards);
        setFirstCard(null);
        setSecondCard(null);
        setCanFlip(true);
      }, 1000);
    }
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
    setGameWon(false);
    setStartTime(new Date());
    setGameTime(0);
  };

  // Toggle theme modal
  const toggleThemeModal = () => {
    setShowThemeModal(!showThemeModal);
  };

  // Open theme modal (can be called from wrapper)
  React.useEffect(() => {
    if (onThemeModalRequest) {
      // Create a function that wrapper can call
      (window as any).__openMemoryThemeModal = () => setShowThemeModal(true);
    }
    return () => {
      delete (window as any).__openMemoryThemeModal;
    };
  }, [onThemeModalRequest]);

  // Open grid size modal (can be called from wrapper)
  React.useEffect(() => {
    if (onGridSizeModalRequest) {
      // Create a function that wrapper can call
      (window as any).__openMemoryGridModal = () => setShowSettingsModal(true);
    }
    return () => {
      delete (window as any).__openMemoryGridModal;
    };
  }, [onGridSizeModalRequest]);

  // Select theme
  const selectTheme = (theme: any) => {
    setSelectedTheme(theme);
    localStorage.setItem('memoryGameTheme', JSON.stringify(theme));
    setShowThemeModal(false);
  };

  // Toggle settings modal
  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
  };

  // Handle topic change
  const handleTopicChange = (newTopic: string) => {
    setCurrentTopic(newTopic);

    // If custom topic is selected, show the custom words modal
    if (newTopic.toLowerCase() === 'custom') {
      setShowSettingsModal(false);
      setShowCustomModal(true);
    }
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: string) => {
    setCurrentDifficulty(newDifficulty);

    // Notify wrapper if in assignment mode
    if (isAssignmentMode && onGridSizeChange) {
      onGridSizeChange(newDifficulty);
    }
  };

  // Handle custom words submission
  const handleCustomWordsSubmit = (wordPairs: WordPair[]) => {
    setCurrentCustomWords(wordPairs);
    setShowCustomModal(false);
    // Start the game with the custom words
    resetGame();
  };

  // Get performance rating based on accuracy and efficiency
  const getPerformanceRating = () => {
    const accuracy = matches / Math.max(attempts, 1);
    const efficiency = matches / Math.max(cards.length / 2, 1); // Perfect would be 1.0

    if (accuracy >= 0.8 && efficiency >= 0.9) {
      return {
        rating: 'excellent',
        stars: '⭐⭐⭐',
        text: 'Perfect Game!'
      };
    } else if (accuracy >= 0.6 && efficiency >= 0.7) {
      return {
        rating: 'good',
        stars: '⭐⭐',
        text: 'Great Job!'
      };
    } else {
      return {
        rating: 'okay',
        stars: '⭐',
        text: 'Good Try!'
      };
    }
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get the optimal grid layout for the current cards
  const gridLayout = calculateGridLayout(cards.length, currentDifficulty);

  return (
    <div
      className="game-wrapper"
      style={{
        backgroundImage: `url(${selectedTheme.path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      ref={gameContainerRef}
    >
      {/* Render header in both modes - assignment mode needs access to theme/grid settings */}
      <header className="header">
        <div className="header-content">
          <div className="left-controls">
            <button onClick={onBackToSettings} className="nav-btn">
              <i className="fas fa-home"></i>
              {isAssignmentMode && <span className="hidden md:inline ml-2">Back to Assignment</span>}
            </button>
            <button onClick={toggleThemeModal} className="nav-btn">
              <i className="fas fa-palette"></i> Theme
            </button>
            {!isAssignmentMode && (
              <button onClick={toggleSettingsModal} className="nav-btn">
                <i className="fas fa-cog"></i> Grid Size
              </button>
            )}
          </div>

          <h1 className="title">{isAssignmentMode ? (assignmentTitle || 'Assignment') : 'Memory Match'}</h1>

          <div className="right-controls">
            <div className="stats-group">
              <div className="stat-item compact header-stat">
                <i className="fas fa-star"></i>
                <span className="stat-label">{matches}</span>
              </div>
              <div className="stat-item compact header-stat">
                <i className="fas fa-redo"></i>
                <span className="stat-label">{attempts}</span>
              </div>
            </div>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="nav-btn"
                title="Change Language, Level, Topic & Theme"
              >
                <i className="fas fa-gamepad"></i>
                <span className="hidden md:inline ml-2">Game Settings</span>
              </button>
            )}
            <button onClick={toggleFullscreen} className="nav-btn">
              <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
            <button onClick={resetGame} className="nav-btn">
              <i className="fas fa-sync"></i>
            </button>
          </div>
        </div>
      </header>

      <div className={`game-container ${isAssignmentMode ? 'assignment-mode' : ''}`}>
        <div className="cards-container">
          <div
            className="cards-grid"
            style={{
              gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`
            }}
          >
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card)}
              >
                <div className="card-front">
                  <span>{index + 1}</span>
                </div>
                <div className="card-back">
                  {card.isImage ? (
                    <img src={card.value} alt="Card" className="card-image" />
                  ) : (
                    <div className="word-content">{card.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Modal - Show in both modes */}
      {showThemeModal && (
        <>
          <div className="modern-modal-overlay" onClick={toggleThemeModal}></div>
          <div className="modern-modal" role="dialog" aria-modal="true" aria-label="Select Theme">
            <div className="modern-modal-content">
              <div className="modern-modal-header">
                <h2>Select Background Theme</h2>
                <button className="modern-close-btn" onClick={toggleThemeModal} aria-label="Close theme selector">✕</button>
              </div>
              <div className="modern-modal-body">
                <div className="theme-grid">
                  {THEMES.map((theme, index) => (
                    <div
                      key={index}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectTheme(theme); }}
                      className={`theme-card ${selectedTheme.name === theme.name ? 'selected' : ''}`}
                      onClick={() => selectTheme(theme)}
                      style={{ backgroundImage: `url(${theme.path})` }}
                    >
                      <div className="theme-name">{theme.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modern-modal-footer">
                <button onClick={toggleThemeModal} className="apply-btn">Close</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Win Modal */}
      {gameWon && (
        <>
          <div className="modal-overlay"></div>

          {/* Confetti Animation */}
          <div className="confetti-container">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="confetti-piece"></div>
            ))}
          </div>

          {/* Fireworks for perfect games */}
          {getPerformanceRating().rating === 'excellent' && (
            <div className="fireworks-container">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="firework"></div>
              ))}
            </div>
          )}

          <div className="modal" id="winModal">
            <div className="modal-content win-modal-new">
              {/* Trophy Icon Header */}
              <div className="win-trophy-container">
                <Trophy className="win-trophy-icon" size={64} strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h2 className="win-title-new">
                {getPerformanceRating().rating === 'excellent' ? 'Perfect Game!' :
                  getPerformanceRating().rating === 'good' ? 'Great Job!' :
                    'Well Done!'}
              </h2>

              {/* Stars Rating */}
              <div className="win-stars-row">
                {[...Array(getPerformanceRating().rating === 'excellent' ? 3 : getPerformanceRating().rating === 'good' ? 2 : 1)].map((_, i) => (
                  <div key={i} className="win-star" style={{ animationDelay: `${i * 0.1}s` }}>
                    ⭐
                  </div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="win-stats-new">
                <div className="stat-card">
                  <Target className="stat-card-icon" size={28} />
                  <div className="stat-card-value">{matches}</div>
                  <div className="stat-card-label">Matches</div>
                </div>
                <div className="stat-card">
                  <RotateCcw className="stat-card-icon" size={28} />
                  <div className="stat-card-value">{attempts}</div>
                  <div className="stat-card-label">Attempts</div>
                </div>
                <div className="stat-card">
                  <BarChart3 className="stat-card-icon" size={28} />
                  <div className="stat-card-value">{Math.round((matches / Math.max(attempts, 1)) * 100)}%</div>
                  <div className="stat-card-label">Accuracy</div>
                </div>
                <div className="stat-card">
                  <Clock className="stat-card-icon" size={28} />
                  <div className="stat-card-value">{formatTime(gameTime)}</div>
                  <div className="stat-card-label">Time</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="win-actions-new">
                <button onClick={resetGame} className="win-btn-new win-btn-play">
                  <Play size={20} />
                  <span>Play Again</span>
                </button>
                {isAssignmentMode ? (
                  <button onClick={onBackToSettings} className="win-btn-new win-btn-back">
                    <ArrowLeft size={20} />
                    <span>Back to Assignment</span>
                  </button>
                ) : (
                  <button onClick={onBackToSettings} className="win-btn-new win-btn-settings">
                    <Settings size={20} />
                    <span>New Game</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal - Show in both modes */}
      {showSettingsModal && (
        <>
          <div className="modern-modal-overlay" onClick={toggleSettingsModal}>
            <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modern-modal-content">
                <div className="modern-modal-header">
                  <h2>Choose Grid Size</h2>
                  <button className="modern-close-btn" onClick={toggleSettingsModal}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="modern-modal-body">
                  <div className="grid-options">
                    {GRID_SIZES.map((diff: { code: string; name: string; pairs: number; grid: string }, index: number) => {
                      const isSelected = currentDifficulty === diff.code;
                      return (
                        <button
                          key={index}
                          className={`grid-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleDifficultyChange(diff.code)}
                        >
                          <div className="option-info">
                            <div className="option-name">{diff.name}</div>
                            <div className="option-details">{diff.pairs} pairs • {diff.grid} grid</div>
                          </div>
                          {isSelected && <div className="check-icon"><i className="fas fa-check"></i></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="modern-modal-footer">
                  <button onClick={toggleSettingsModal} className="apply-btn">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Audio Elements */}
      <audio id="correctSound" src="/games/memory-game/sounds/correct.mp3"></audio>
      <audio id="wrongSound" src="/games/memory-game/sounds/wrong.mp3"></audio>
      <audio id="winSound" src="/games/memory-game/sounds/win.mp3"></audio>

      {/* Add Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      {/* CustomWordsModal */}
      <CustomWordsModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onStartGame={handleCustomWordsSubmit}
      />
    </div>
  );
}
