'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
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
  Trophy, Play, Settings, PartyPopper, Music, VolumeX
} from 'lucide-react';
import { useGameAudio } from '../../../../hooks/useGlobalAudioContext';
import { createAudio, getAudioUrl } from '../../../../utils/audioUtils';
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
  gameSessionId: assignmentGameSessionId
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
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Global audio context for assignment mode compatibility
  const internalAudioManager = useGameAudio(true);
  const audioManager = externalAudioManager || internalAudioManager;
  
  // Add state for current game settings
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentTopic, setCurrentTopic] = useState(topic);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  
  // Add state for custom words
  const [currentCustomWords, setCurrentCustomWords] = useState<WordPair[]>(customWords || []);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Update custom words when prop changes (for assignment mode)
  useEffect(() => {
    if (customWords && customWords.length > 0) {
      setCurrentCustomWords(customWords);
    }
  }, [customWords]);

  // Add timer state for tracking time spent
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [gameTime, setGameTime] = useState(0);

  // Add vocabulary progress tracking
  const [vocabularyProgress, setVocabularyProgress] = useState<Map<number, {
    vocabularyId: number;
    attempts: number;
    correctAttempts: number;
    responseTime: number;
    wasCorrect: boolean;
    firstAttemptTime?: Date;
  }>>(new Map());

  // Enhanced game service integration
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    
    // Initialize background music
    backgroundMusicRef.current = createAudio('/games/memory-game/sounds/background-music.mp3');
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3; // Lower volume for background music
    }
    
    console.log('🎵 Audio refs created:', {
      correct: !!correctSoundRef.current,
      wrong: !!wrongSoundRef.current,
      win: !!winSoundRef.current,
      backgroundMusic: !!backgroundMusicRef.current
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
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, [currentLanguage, currentTopic, currentDifficulty, currentCustomWords]);
  
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
  
  // Auto-start background music when game starts
  useEffect(() => {
    const autoStartMusic = async () => {
      if (!gameWon && startTime && backgroundMusicRef.current && audioManager && !isMusicPlaying) {
        // Add a small delay to ensure audio context is ready
        setTimeout(() => {
          startBackgroundMusic();
        }, 1000);
      }
    };
    
    autoStartMusic();
  }, [startTime, gameWon, audioManager]);
  
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
    
    // Use the same grid layout logic for both custom and database modes
    // This ensures consistent card sizing regardless of content source
    if (actualPairs <= 3) return { cols: 3, rows: 2 }; // 3 pairs (6 cards) in 3x2
    if (actualPairs <= 4) return { cols: 4, rows: 2 }; // 4 pairs (8 cards) in 4x2
    if (actualPairs <= 5) return { cols: 5, rows: 2 }; // 5 pairs (10 cards) in 5x2
    if (actualPairs <= 6) return { cols: 4, rows: 3 }; // 6 pairs (12 cards) in 4x3
    if (actualPairs <= 8) return { cols: 4, rows: 4 }; // 8 pairs (16 cards) in 4x4
    if (actualPairs <= 10) return { cols: 5, rows: 4 }; // 10 pairs (20 cards) in 5x4
    
    // For larger sets, calculate a reasonable square-ish layout
    return { cols: Math.ceil(Math.sqrt(totalCards)), rows: Math.ceil(Math.sqrt(totalCards)) };
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
      const transformedWords = currentCustomWords.map(pair => {
        if (pair.type === 'image') {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: true,
            id: pair.id, // ✅ Preserve vocabulary ID for FSRS
            vocabulary_id: pair.id // ✅ Legacy compatibility
          };
        } else {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: false,
            id: pair.id, // ✅ Preserve vocabulary ID for FSRS
            vocabulary_id: pair.id // ✅ Legacy compatibility
          };
        }
      });

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
          audio_url: item.audio_url
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
          audio_url: item.audio_url
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
        vocabularyId: pair.id || pair.vocabulary_id // For assignment mode
      });

      // Second card (translation)
      newCards.push({
        id: index * 2 + 1,
        value: pair.translation,
        isImage: pair.isImage && pair.type === 'image',
        flipped: false,
        matched: false,
        pairId: index,
        vocabularyId: pair.id || pair.vocabulary_id // For assignment mode
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

                // Record successful match with FSRS

                if (fsrsResult) {
                  console.log(`FSRS recorded for memory-game "${cardWord}":`, {
                    algorithm: fsrsResult.algorithm,
                    points: fsrsResult.points,
                    nextReview: fsrsResult.nextReviewDate,
                    interval: fsrsResult.interval,
                    masteryLevel: fsrsResult.masteryLevel
                  });
                }
              }
            } catch (error) {
              console.error('Error recording FSRS practice:', error);
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
                isAssignmentMode
              });

              if (isAssignmentMode && typeof window !== 'undefined' && (window as any).recordVocabularyInteraction) {
                // Use GameAssignmentWrapper's vocabulary interaction recorder for assignment mode
                await (window as any).recordVocabularyInteraction(
                  cardWord,
                  cardTranslation,
                  true, // wasCorrect
                  Math.round(responseTime * 1000), // responseTimeMs
                  false, // hintUsed
                  matches + 1 // streakCount
                );

                console.log('🔍 [VOCAB TRACKING] Used assignment wrapper recordVocabularyInteraction');
                console.log(`🔮 Memory Game earned gem for "${cardWord}" (assignment mode)`);
              } else if (effectiveGameSessionId) {
                // Use direct EnhancedGameSessionService for both assignment and free play modes
                const sessionService = new EnhancedGameSessionService();
                const gemEvent = await sessionService.recordWordAttempt(effectiveGameSessionId, 'memory-game', {
                  vocabularyId: firstCard.vocabularyId,
                  wordText: cardWord,
                  translationText: cardTranslation,
                  responseTimeMs: Math.round(responseTime * 1000),
                  wasCorrect: true, // Always true for matched pairs
                  hintUsed: false,
                  streakCount: matches + 1,
                  difficultyLevel: 'beginner',
                  gameMode: 'memory_match',
                  maxGemRarity: 'common' // Cap at common for luck-based games
                }, true); // Skip spaced repetition - FSRS handles it

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
          // Stop background music when game is won
          stopBackgroundMusic();
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
            saveAssignmentProgress(timeSpent, matches + 1, attempts + 1);
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
    // Restart background music after a short delay
    setTimeout(() => {
      if (!isMusicPlaying) {
        startBackgroundMusic();
      }
    }, 500);
  };
  
  // Background music control functions
  const startBackgroundMusic = async () => {
    if (backgroundMusicRef.current && audioManager) {
      try {
        await audioManager.playAudio(backgroundMusicRef.current);
        setIsMusicPlaying(true);
        console.log('🎵 Background music started');
      } catch (error) {
        console.warn('Failed to start background music:', error);
      }
    }
  };
  
  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      setIsMusicPlaying(false);
      console.log('🎵 Background music stopped');
    }
  };
  
  const toggleBackgroundMusic = () => {
    if (isMusicPlaying) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  };
  
  // Toggle theme modal
  const toggleThemeModal = () => {
    setShowThemeModal(!showThemeModal);
  };
  
  // Select theme
  const selectTheme = (theme: any) => {
    setSelectedTheme(theme);
    localStorage.setItem('memoryGameTheme', JSON.stringify(theme));
    toggleThemeModal();
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
      <header className="header">
        <div className="header-content">
          <div className="left-controls">
            <button onClick={onBackToSettings} className="nav-btn">
              <i className={`fas ${isAssignmentMode ? 'fa-arrow-left' : 'fa-home'}`}></i>
              {isAssignmentMode ? ' Back' : ''}
            </button>
            {!isAssignmentMode && (
              <>
                <button onClick={toggleThemeModal} className="nav-btn">
                  <i className="fas fa-palette"></i> Theme
                </button>
                <button onClick={toggleSettingsModal} className="nav-btn">
                  <i className="fas fa-cog"></i> Grid Size
                </button>
                <button onClick={toggleBackgroundMusic} className="nav-btn">
                  {isMusicPlaying ? <VolumeX size={16} /> : <Music size={16} />}
                  <span className="ml-1">{isMusicPlaying ? 'Mute' : 'Music'}</span>
                </button>
              </>
            )}
          </div>

          <h1 className="title">
            {isAssignmentMode ? (
              <div className="assignment-title">
                <div className="assignment-badge">Assignment</div>
                <div className="assignment-name">{assignmentTitle}</div>
                <div className="game-subtitle">Memory Match Game</div>
              </div>
            ) : (
              'Memory Match'
            )}
          </h1>

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
                <i className="fas fa-cog"></i>
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

      <div className="game-container">
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

      {/* Theme Modal */}
      {showThemeModal && (
        <>
          <div className="modern-modal-overlay" onClick={toggleThemeModal}></div>
          <div className="modern-modal" role="dialog" aria-modal="true" aria-label="Select Theme">
            <div className="modern-modal-content">
              <div className="modern-modal-header">
                <h2>Select Theme</h2>
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
            <div className="modal-content win-modal">
              <div className="win-header">
                <PartyPopper className="win-icon" size={48} />
                <h2 className="win-title">Congratulations!</h2>
                <PartyPopper className="win-icon" size={48} />
              </div>
              
              {/* Performance Rating */}
              <div className={`performance-rating rating-${getPerformanceRating().rating}`}>
                <div className="performance-stars">
                  {[...Array(getPerformanceRating().rating === 'excellent' ? 3 : getPerformanceRating().rating === 'good' ? 2 : 1)].map((_, i) => (
                    <Trophy key={i} size={24} className="star-icon" />
                  ))}
                </div>
                <div className="performance-text">{getPerformanceRating().text}</div>
              </div>
              
              {/* Enhanced Stats Grid */}
              <div className="win-stats">
                <div className="stat-item">
                  <Target className="stat-icon" size={32} />
                  <div className="stat-label">Matches</div>
                  <div className="stat-value">{matches}</div>
                </div>
                <div className="stat-item">
                  <RotateCcw className="stat-icon" size={32} />
                  <div className="stat-label">Attempts</div>
                  <div className="stat-value">{attempts}</div>
                </div>
                <div className="stat-item">
                  <BarChart3 className="stat-icon" size={32} />
                  <div className="stat-label">Accuracy</div>
                  <div className="stat-value">{Math.round((matches / Math.max(attempts, 1)) * 100)}%</div>
                </div>
                <div className="stat-item">
                  <Clock className="stat-icon" size={32} />
                  <div className="stat-label">Time</div>
                  <div className="stat-value">{formatTime(gameTime)}</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="win-actions">
                <button onClick={resetGame} className="win-btn win-btn-primary">
                  <Play size={20} />
                  Play Again
                </button>
                <button onClick={onBackToSettings} className="win-btn win-btn-secondary">
                  <Settings size={20} />
                  New Game
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettingsModal && !isAssignmentMode && (
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
