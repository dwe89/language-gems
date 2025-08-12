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
  Trophy, Play, Settings, PartyPopper
} from 'lucide-react';
import { useGameAudio } from '../../../../hooks/useGlobalAudioContext';
import { createAudio, getAudioUrl } from '../../../../utils/audioUtils';
import { useUnifiedSpacedRepetition } from '../../../../hooks/useUnifiedSpacedRepetition';
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
  audioManager: externalAudioManager
}: MemoryGameMainProps) {
  const { user, isLoading, isDemo } = useUnifiedAuth();

  // Initialize FSRS spaced repetition system
  const { recordWordPractice, algorithm } = useUnifiedSpacedRepetition('memory-game');
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

  // Initialize Supabase client and game service (skip in assignment mode)
  useEffect(() => {
    if (isAssignmentMode) {
      console.log('Assignment mode: Skipping EnhancedGameService initialization');
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

  // Start game session when game service is ready and game starts
  useEffect(() => {
    if (gameService && (userId || user?.id) && !isDemo && startTime && !gameSessionId) {
      startGameSession();
    }
  }, [gameService, userId, user?.id, startTime, gameSessionId]);

  const startGameSession = async () => {
    if (!gameService || !(userId || user?.id) || isDemo) return;

    // Skip session creation in assignment mode to avoid RLS issues
    if (isAssignmentMode) {
      console.log('Assignment mode: Skipping game session creation');
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
    // For custom words: create an appropriate grid layout
    if (currentCustomWords && currentCustomWords.length > 0) {
      const totalPairs = currentCustomWords.length;
      
      // For custom words, use grid layouts matching our difficulty patterns
      if (totalPairs <= 3) return { cols: 3, rows: 2 }; // 3 pairs (6 cards) in 3x2
      if (totalPairs <= 4) return { cols: 4, rows: 2 }; // 4 pairs (8 cards) in 4x2
      if (totalPairs <= 5) return { cols: 5, rows: 2 }; // 5 pairs (10 cards) in 5x2
      if (totalPairs <= 6) return { cols: 4, rows: 3 }; // 6 pairs (12 cards) in 4x3
      if (totalPairs <= 8) return { cols: 4, rows: 4 }; // 8 pairs (16 cards) in 4x4
      if (totalPairs <= 10) return { cols: 5, rows: 4 }; // 10 pairs (20 cards) in 5x4
      
      // For larger custom sets, calculate a reasonable square-ish layout
      return { cols: Math.ceil(Math.sqrt(totalPairs * 2)), rows: Math.ceil(Math.sqrt(totalPairs * 2)) };
    }
    
    // For predefined difficulty levels
    switch (difficulty) {
      case 'easy-1':
        return { cols: 3, rows: 2 }; // 3 pairs (6 cards)
      case 'easy-2':
        return { cols: 4, rows: 2 }; // 4 pairs (8 cards)
      case 'medium-1':
        return { cols: 5, rows: 2 }; // 5 pairs (10 cards)
      case 'medium-2':
        return { cols: 4, rows: 3 }; // 6 pairs (12 cards)
      case 'hard-2':
        return { cols: 4, rows: 4 }; // 8 pairs (16 cards)
      case 'expert':
        return { cols: 5, rows: 4 }; // 10 pairs (20 cards)
      default:
        return { cols: 4, rows: 3 }; // Default to medium size
    }
  };
  
  // Save assignment progress when game is completed
  const saveAssignmentProgress = async (timeSpent: number, totalMatches: number, totalAttempts: number) => {
    console.log('saveAssignmentProgress called:', { isAssignmentMode, assignmentId, timeSpent, totalMatches, totalAttempts });
    console.log('vocabularyProgress:', vocabularyProgress);

    // End enhanced game session
    if (gameService && gameSessionId && (userId || user?.id) && !isDemo) {
      try {
        const accuracy = totalAttempts > 0 ? (totalMatches / totalAttempts) * 100 : 0;
        const finalScore = Math.round(accuracy);

        // Use gems-first system: XP calculated from individual vocabulary interactions
        // Remove conflicting XP calculation - gems system handles all scoring through recordWordAttempt()
        const totalXP = totalMatches * 10; // 10 XP per match (gems-first)

        await gameService.endGameSession(gameSessionId, {
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
    
    // Determine number of pairs based on difficulty or custom words
    if (currentCustomWords && currentCustomWords.length > 0) {
      // Use all custom words
      wordPairs = currentCustomWords.map(pair => {
        if (pair.type === 'image') {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: true
          };
        } else {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: false
          };
        }
      });
      
      totalPairs = wordPairs.length;
    } else {
      // Determine number of pairs based on difficulty
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

          // Record word practice with FSRS system
          if (!isDemo && !isAssignmentMode) {
            try {
              // Record practice for both words in the matched pair
              const wordData = {
                id: firstCard.vocabularyId || `${firstCard.word}-${firstCard.translation}`,
                word: firstCard.word,
                translation: firstCard.translation,
                language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
              };

              // Record successful match with FSRS
              const fsrsResult = await recordWordPractice(
                wordData,
                true, // Always correct for matched pairs
                responseTime * 1000, // Convert to milliseconds
                0.7 // Moderate confidence for memory games (luck-based)
              );

              if (fsrsResult) {
                console.log(`FSRS recorded for ${firstCard.word}:`, {
                  algorithm: fsrsResult.algorithm,
                  points: fsrsResult.points,
                  nextReview: fsrsResult.nextReviewDate,
                  interval: fsrsResult.interval,
                  masteryLevel: fsrsResult.masteryLevel
                });
              }
            } catch (error) {
              console.error('Error recording FSRS practice:', error);
            }
          }

          // Record word attempt using new gems system (exposure only for memory game)
          if (gameSessionId && !isDemo && !isAssignmentMode) {
            try {
              const sessionService = new EnhancedGameSessionService();
              await sessionService.recordWordAttempt(gameSessionId, 'memory-game', {
                vocabularyId: firstCard.vocabularyId,
                wordText: firstCard.word,
                translationText: firstCard.translation,
                responseTimeMs: Math.round(responseTime * 1000),
                wasCorrect: true, // Always true for matched pairs
                hintUsed: false,
                streakCount: matches + 1,
                difficultyLevel: 'beginner',
                gameMode: 'memory_match',
                contextData: {
                  isLuckBased: true, // Flag for exposure tracking
                  pairId: firstCard.pairId,
                  totalMatches: matches + 1,
                  totalCards: cards.length,
                  gridSize: `${gridSize}x${gridSize}`,
                  theme: selectedTheme
                }
              });
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

        // Record failed match with FSRS system (for learning purposes)
        if (!isDemo && !isAssignmentMode) {
          try {
            const wordData = {
              id: firstCard.vocabularyId || `${firstCard.word}-${firstCard.translation}`,
              word: firstCard.word,
              translation: firstCard.translation,
              language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
            };

            // Record failed attempt with FSRS (helps with difficulty assessment)
            const fsrsResult = await recordWordPractice(
              wordData,
              false, // Incorrect match
              responseTime * 1000, // Convert to milliseconds
              0.3 // Lower confidence for failed matches
            );

            if (fsrsResult) {
              console.log(`FSRS recorded failed match for ${firstCard.word}:`, {
                algorithm: fsrsResult.algorithm,
                nextReview: fsrsResult.nextReviewDate,
                interval: fsrsResult.interval
              });
            }
          } catch (error) {
            console.error('Error recording FSRS failed practice:', error);
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
              <div className="stat-item">
                <i className="fas fa-star"></i>
                <span>Matches: <span id="matchCount">{matches}</span></span>
              </div>
              <div className="stat-item">
                <i className="fas fa-redo"></i>
                <span>Attempts: <span id="attempts">{attempts}</span></span>
              </div>
            </div>
            {onOpenSettings && (
              <button onClick={onOpenSettings} className="nav-btn">
                <i className="fas fa-cog"></i>
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
          <div className="modal-overlay" onClick={toggleThemeModal}></div>
          <div className="modal" id="themeModal">
            <div className="modal-content">
              <h2 className="modal-title">Select Theme</h2>
              <div className="theme-grid">
                {THEMES.map((theme, index) => (
                  <div 
                    key={index}
                    className={`theme-option ${selectedTheme.name === theme.name ? 'selected' : ''}`}
                    onClick={() => selectTheme(theme)}
                  >
                    <img src={theme.path} alt={theme.name} />
                    <div className="theme-name">{theme.name}</div>
                  </div>
                ))}
              </div>
              <div className="modal-buttons">
                <button onClick={toggleThemeModal} className="btn btn-secondary">Close</button>
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
          <div className="modal-overlay" onClick={toggleSettingsModal}></div>
          <div className="modal" id="settingsModal">
            <div className="modal-content">
              <h2 className="modal-title">Grid Size Settings</h2>
          
              
              <div className="settings-section">
                <h3>Grid Size</h3>
                <div className="settings-grid">
                  {GRID_SIZES.map((diff: { code: string; name: string; pairs: number; grid: string }, index: number) => (
                    <button 
                      key={index} 
                      className={`difficulty-option ${currentDifficulty === diff.code ? 'selected' : ''}`}
                      onClick={() => handleDifficultyChange(diff.code)}
                    >
                      <div className="difficulty-option-info">
                        <div>{diff.name}</div>
                        <div className="difficulty-option-detail">{diff.pairs} pairs ({diff.grid})</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="modal-buttons">
                <button onClick={toggleSettingsModal} className="btn btn-secondary">Apply</button>
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