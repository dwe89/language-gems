'use client';

import React, { useState, useEffect, useRef } from 'react'; // Removed useRef as backgroundMusicRef is gone
import { ThemeProvider, useTheme } from './ThemeProvider';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Zap, Volume2, VolumeX, Settings, Palette } from 'lucide-react';
import TokyoNightsAnimation from './themes/TokyoNightsAnimation';
import LavaTempleAnimation from './themes/LavaTempleAnimation';
import SpaceExplorerAnimation from './themes/SpaceExplorerAnimation';
import PirateAdventureAnimation from './themes/PirateAdventureAnimation';
import ClassicHangmanAnimation from './themes/ClassicHangmanAnimation';
import TempleGuardianModal from './TempleGuardianModal';
import QuickThemeSelector from '../../../../components/games/QuickThemeSelector';
import TokyoNightsModal from './TokyoNightsModal';
import SpaceExplorerModal from './SpaceExplorerModal';
import PirateAdventureModal from './PirateAdventureModal';
import { assignmentExposureService } from '../../../../services/assignments/AssignmentExposureService'; // Confirm this path and component name
import { CentralizedVocabularyService, CentralizedVocabularyWord } from 'gems/services/centralizedVocabularyService';
import { createClient } from '@supabase/supabase-js';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

// Removed: import { useAudio } from '../hooks/useAudio'; // This hook is used in the parent now

// Defined here so GameContent can use it
interface AudioFiles {
  themes: {
    'tokyo-nights': string;
    'pirate-adventure': string;
    'space-explorer': string;
    'lava-temple': string;
    'classic': string;
  };
  sfx: {
    'button-click': string;
    'correct-answer': string;
    'wrong-answer': string;
    'victory': string;
    'defeat': string;
    'tokyo-hack': string;
    'pirate-treasure': string;
    'space-docking': string;
    'temple-power': string;
  };
}

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  category?: string;
  subcategory?: string;
  difficulty_level?: string;
  audio_url?: string;
  isCustomVocabulary?: boolean; // TRUE if from enhanced_vocabulary_items (custom/teacher vocabulary)
}

interface HangmanGameProps {
  settings: {
    difficulty: string;
    category: string;
    subcategory?: string;
    language: string;
    theme: string;
    customWords?: string[];
    playAudio?: (word: string) => void;
  };
  vocabulary?: VocabularyItem[];
  onBackToMenu: () => void;
  onGameEnd?: (result: 'win' | 'lose', gameStats?: {
    wordsCompleted?: number;
    totalWords?: number;
    correctGuesses?: number;
    totalGuesses?: number;
    timeSpent?: number;
    currentWord?: string;
    vocabularyId?: string; // Changed from number to string for UUID support
    wrongGuesses?: number;
    isCustomVocabulary?: boolean; // TRUE if from enhanced_vocabulary_items
  }) => void;
  isFullscreen?: boolean;
  isAssignmentMode?: boolean;
  playSFX: (soundName: keyof AudioFiles['sfx']) => void; // Passed from parent (HangmanPage.tsx)
  onOpenSettings?: () => void;
  gameSessionId?: string;
  userId?: string;
  assignmentId?: string | null; // For exposure tracking
  toggleMusic?: () => void;
  isMusicEnabled?: boolean;
  onThemeChange?: (theme: string) => void;
}

const MAX_ATTEMPTS = 6;

// Update the ExtendedThemeContextType interface
type ExtendedThemeContextType = {
  themeId: string;
  themeClasses: {
    background: string;
    accent: string;
    text: string;
    button: string;
    dangerText: string;
    winMessage: string;
    loseMessage: string;
  };
};

export function GameContent({ settings, vocabulary, onBackToMenu, onGameEnd, isFullscreen, isAssignmentMode, playSFX, onOpenSettings, gameSessionId, userId, assignmentId, toggleMusic, isMusicEnabled, onThemeChange }: HangmanGameProps) {


  const { themeId, themeClasses } = useTheme() as ExtendedThemeContextType;
  const [themeClassesState, setThemeClassesState] = useState(themeClasses);
  const [word, setWord] = useState('');
  const [wordLetters, setWordLetters] = useState<string[]>([]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(() => {
    return parseInt(localStorage.getItem('hangmanTotalScore') || '0', 10);
  });
  const [hints, setHints] = useState(3);
  const [showPowerupEffect, setShowPowerupEffect] = useState(false);
  const [animation, setAnimation] = useState<'correct' | 'wrong' | null>(null);

  const [musicEnabled, setMusicEnabled] = useState(true); // Default to true, as background music is handled by parent

  // Add a state to track correct guesses for the Tokyo Nights theme
  const [correctLetterCounter, setCorrectLetterCounter] = useState(0);

  const [showTempleGuardianModal, setShowTempleGuardianModal] = useState(false);
  const [showTokyoNightsModal, setShowTokyoNightsModal] = useState(false);
  const [showSpaceExplorerModal, setShowSpaceExplorerModal] = useState(false);
  const [showPirateAdventureModal, setShowPirateAdventureModal] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);

  // LAYER 1: Session Deduplication - Track word IDs used in THIS game session
  const [usedWordsThisSession, setUsedWordsThisSession] = useState<Set<string>>(new Set());

  // Helper functions for exact letter matching (no accent normalization)
  const isLetterGuessed = (letter: string, guessedLetters: string[]): boolean => {
    const lowerLetter = letter.toLowerCase();
    return guessedLetters.includes(lowerLetter);
  };

  const doesWordContainLetter = (word: string, letter: string): boolean => {
    const lowerWord = word.toLowerCase();
    const lowerLetter = letter.toLowerCase();
    return lowerWord.includes(lowerLetter);
  };

  // Helper function to get a non-repeating word with LAYER 1 session deduplication
  const getRandomWordNoRepeats = (): { word: string; id: string } => {
    let availableVocab: VocabularyItem[] = [];

    // 🎯 Get available words - PRIORITY: vocabulary prop (has proper UUIDs) > customWords (creates temp IDs)
    if (vocabulary && vocabulary.length > 0) {
      // Priority 1: Use vocabulary prop (from wrapper - has proper UUIDs)
      availableVocab = vocabulary;
    } else if (settings.customWords && settings.customWords.length > 0) {
      // Priority 2: For custom words, create temporary vocabulary items
      availableVocab = settings.customWords.map((word, index) => ({
        id: `custom-${index}`,
        word,
        translation: '',
        language: settings.language
      }));
    } else {
      return { word: 'fallback', id: 'fallback-id' };
    }

    // LAYER 1: Filter out words already used in this session
    const availableItems = availableVocab.filter(item => {
      const wordId = item.id;
      return wordId && !usedWordsThisSession.has(wordId);
    });

    // If all words have been used, reset the session filter
    const itemsToUse = availableItems.length > 0 ? availableItems : availableVocab;

    // Select a random word from available items
    const randomIndex = Math.floor(Math.random() * itemsToUse.length);
    const selectedItem = itemsToUse[randomIndex];

    // LAYER 1: Mark this word as used in this session
    if (selectedItem.id) {
      setUsedWordsThisSession(prev => new Set([...prev, selectedItem.id]));
      console.log('🎯 [SESSION DEDUP] Word marked as used:', {
        word: selectedItem.word,
        id: selectedItem.id,
        totalUsedThisSession: usedWordsThisSession.size + 1
      });
    }

    return { word: selectedItem.word, id: selectedItem.id };
  };

  // Initialize game
  useEffect(() => {
    const { word: newWord, id: wordId } = getRandomWordNoRepeats();
    setWord(newWord.toLowerCase());

    // Get unique letters excluding spaces, apostrophes, and hyphens
    const uniqueLetters = [...new Set(newWord.split('').filter((char: string) => char !== ' ' && char !== "'" && char !== '-'))] as string[];
    setWordLetters(uniqueLetters);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setTimer(0);

    // Start the timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    timerIntervalRef.current = interval;

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [settings, vocabulary]);

  // Reset used words when vocabulary source changes
  useEffect(() => {
    setUsedWords([]);
  }, [settings.customWords, vocabulary]);

  // Check win/lose conditions
  useEffect(() => {
    if (gameStatus !== 'playing' || guessedLetters.length === 0) return;

    // Check if all letters in the word have been guessed
    const hasWon = wordLetters.every(letter =>
      letter === ' ' || letter === '-' || letter === "'" || isLetterGuessed(letter, guessedLetters)
    );

    if (hasWon) {
      console.log('🎉 [HANGMAN] WORD WON! Starting recording process...', { word, gameSessionId, userId, assignmentId });
      setGameStatus('won');
      playSFX('victory'); // Use passed-in playSFX

      // ✅ OPTION 1: Record successful word completion ONLY (works in both assignment and free play modes)
      try {
        const currentVocabItem = vocabulary?.find(v => v.word.toLowerCase() === word.toLowerCase());
        console.log('🔍 [HANGMAN] Found vocabulary item:', currentVocabItem);

        // ✅ Record successful word completion with gem award
        if (gameSessionId && currentVocabItem?.id) {
          const recordGemAttempt = async () => {
            try {
              console.log('🎮 [HANGMAN] Recording successful word completion:', {
                word,
                vocabularyId: currentVocabItem.id,
                isCustomVocabulary: currentVocabItem.isCustomVocabulary,
                gameSessionId,
                wrongGuesses,
                timer
              });

              const sessionService = new EnhancedGameSessionService();
              const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'hangman', {
                // ✅ FIXED: Use correct ID field based on vocabulary source
                vocabularyId: currentVocabItem.isCustomVocabulary ? undefined : currentVocabItem.id,
                enhancedVocabularyItemId: currentVocabItem.isCustomVocabulary ? currentVocabItem.id : undefined,
                wordText: word,
                translationText: currentVocabItem.translation || word,
                responseTimeMs: timer * 1000,
                wasCorrect: true,
                hintUsed: false,
                streakCount: 0,
                masteryLevel: 1,
                maxGemRarity: 'common', // Luck-based game
                gameMode: 'word_completion',
                difficultyLevel: settings.difficulty
              }, false); // Enable FSRS for progress tracking

              if (gemEvent) {
                console.log(`✅ [HANGMAN] Gem awarded: ${gemEvent.rarity} (${gemEvent.xpValue} XP) - Wrong guesses: ${wrongGuesses}, Time: ${timer}s`);
              } else {
                console.warn('⚠️ [HANGMAN] No gem event returned');
              }
            } catch (error) {
              console.error('🚨 [HANGMAN] Error recording vocabulary attempt:', error);
            }
          };
          recordGemAttempt();
        } else {
          console.warn('⚠️ [HANGMAN] Skipping gem recording:', {
            hasGameSessionId: !!gameSessionId,
            hasVocabularyId: !!currentVocabItem?.id,
            gameSessionId,
            vocabularyId: currentVocabItem?.id
          });
        }
      } catch (error) {
        console.error('🚨 [HANGMAN] Error setting up recording for successful completion:', error);
      }

      // Play audio for the completed word
      if (settings.playAudio) {
        setTimeout(() => {
          settings.playAudio!(word);
        }, 500); // Delay slightly to let the confetti start
      }

      // Stop timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 300);

      if (onGameEnd) {
        const currentVocabItem = vocabulary?.find(v => v.word.toLowerCase() === word.toLowerCase());
        onGameEnd('win', {
          wordsCompleted: 1,
          totalWords: 1,
          correctGuesses: guessedLetters.filter(letter => word.toLowerCase().includes(letter)).length,
          totalGuesses: guessedLetters.length,
          timeSpent: timer,
          currentWord: word,
          vocabularyId: currentVocabItem?.id, // Use UUID directly, not parseInt
          wrongGuesses: wrongGuesses,
          isCustomVocabulary: currentVocabItem?.isCustomVocabulary // Pass custom vocab flag
        });
      }
    } else if (wrongGuesses >= MAX_ATTEMPTS) {
      setGameStatus('lost');
      playSFX('defeat'); // Use passed-in playSFX

      // ✅ OPTION 1: Do NOT record failed attempts - they can try again
      // Failed attempts don't prove they don't know the word (could be unlucky guessing)
      console.log('🎮 [HANGMAN] Word failed - no recording (student can try again):', {
        word,
        wrongGuesses,
        timer
      });

      // Stop timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      if (onGameEnd) {
        const currentVocabItem = vocabulary?.find(v => v.word.toLowerCase() === word.toLowerCase());
        onGameEnd('lose', {
          wordsCompleted: 0,
          totalWords: 1,
          correctGuesses: guessedLetters.filter(letter => word.toLowerCase().includes(letter)).length,
          totalGuesses: guessedLetters.length,
          timeSpent: timer,
          currentWord: word,
          vocabularyId: currentVocabItem?.id, // Use UUID directly, not parseInt
          wrongGuesses: wrongGuesses,
          isCustomVocabulary: currentVocabItem?.isCustomVocabulary // Pass custom vocab flag
        });
      }
    }
  }, [guessedLetters, wordLetters, wrongGuesses, gameStatus, onGameEnd, playSFX, settings.playAudio, word]);

  // Cleanup timer on unmount AND record exposures
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      // LAYER 2: Record word exposures for assignment progress
      if (isAssignmentMode && assignmentId && userId) {
        const exposedWordIds = Array.from(usedWordsThisSession);
        if (exposedWordIds.length > 0) {
          console.log('📝 [LAYER 2] Recording word exposures:', {
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

  const handleLetterGuess = (letter: string) => {
    const lowerLetter = letter.toLowerCase();

    if (gameStatus !== 'playing' || guessedLetters.includes(lowerLetter)) {
      return;
    }

    const newGuessedLetters = [...guessedLetters, lowerLetter];
    setGuessedLetters(newGuessedLetters);

    if (doesWordContainLetter(word, lowerLetter)) {
      // Correct guess
      playSFX('correct-answer'); // Use passed-in playSFX

      // Increment correct letter counter for the Tokyo Nights theme
      if (themeId === 'tokyo') {
        setCorrectLetterCounter(prev => prev + 1);
      }

      // Check if the player has won - check if all non-space letters are guessed
      const isWin = wordLetters.every(letter => isLetterGuessed(letter, newGuessedLetters));
      if (isWin) {
        playSFX('victory'); // Use passed-in playSFX
        setGameStatus('won');
        const newScore = calculateScore();
        setScore(newScore);

        // FSRS Recording for successful completion
        console.log('🎯 [HANGMAN WIN] Starting FSRS recording for word:', word);
        try {
          const currentVocabItem = vocabulary?.find(v => v.word.toLowerCase() === word.toLowerCase());
          const wordData = {
            id: currentVocabItem?.id || `hangman-${word}`,
            word: word,
            translation: currentVocabItem?.translation || word, // Use translation if available
            language: settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en'
          };

          console.log('🎯 [HANGMAN WIN] Word data prepared:', wordData);

          // Calculate confidence based on performance
          const correctGuessCount = newGuessedLetters.filter(letter => word.toLowerCase().includes(letter)).length;
          const totalGuessCount = newGuessedLetters.length;
          const accuracy = totalGuessCount > 0 ? correctGuessCount / totalGuessCount : 1;
          const timeBonus = timer < 60 ? 0.1 : timer < 120 ? 0.05 : 0; // Bonus for quick completion
          const mistakesPenalty = wrongGuesses * 0.1; // Penalty for wrong guesses
          const confidence = Math.max(0.1, Math.min(0.95, accuracy + timeBonus - mistakesPenalty));

          console.log('🎯 [HANGMAN WIN] Confidence calculated:', confidence, {
            accuracy,
            timeBonus,
            mistakesPenalty,
            timer,
            wrongGuesses
          });

          // ✅ Record successful word completion with gem award
          if (gameSessionId && currentVocabItem?.id) {
            const recordGemAttempt = async () => {
              try {
                console.log('🎮 [HANGMAN] Recording successful word completion:', {
                  word,
                  vocabularyId: currentVocabItem.id,
                  isCustomVocabulary: currentVocabItem.isCustomVocabulary,
                  gameSessionId,
                  wrongGuesses,
                  timer
                });

                const sessionService = new EnhancedGameSessionService();
                const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'hangman', {
                  // ✅ FIXED: Use correct ID field based on vocabulary source
                  vocabularyId: currentVocabItem.isCustomVocabulary ? undefined : currentVocabItem.id,
                  enhancedVocabularyItemId: currentVocabItem.isCustomVocabulary ? currentVocabItem.id : undefined,
                  wordText: word,
                  translationText: currentVocabItem.translation || word,
                  responseTimeMs: timer * 1000,
                  wasCorrect: true,
                  hintUsed: false,
                  streakCount: 0,
                  masteryLevel: 1,
                  maxGemRarity: 'common', // Luck-based game
                  gameMode: 'word_completion',
                  difficultyLevel: settings.difficulty
                }, false); // Enable FSRS for progress tracking

                if (gemEvent) {
                  console.log(`✅ [HANGMAN] Gem awarded: ${gemEvent.rarity} (${gemEvent.xpValue} XP) - Wrong guesses: ${wrongGuesses}, Time: ${timer}s`);
                } else {
                  console.warn('⚠️ [HANGMAN] No gem event returned');
                }
              } catch (error) {
                console.error('🚨 [HANGMAN] Error recording vocabulary attempt:', error);
              }
            };
            recordGemAttempt();
          } else {
            console.warn('⚠️ [HANGMAN] Skipping gem recording:', {
              hasGameSessionId: !!gameSessionId,
              hasVocabularyId: !!currentVocabItem?.id,
              gameSessionId,
              vocabularyId: currentVocabItem?.id
            });
          }
        } catch (error) {
          console.error('❌ Error setting up FSRS recording for hangman:', error);
        }

        // Play audio for the completed word
        if (settings.playAudio) {
          setTimeout(() => {
            settings.playAudio!(word);
          }, 500); // Delay slightly to let the win sound effects play first
        }

        // Add the newScore to totalScore
        const currentTotal = parseInt(localStorage.getItem('hangmanTotalScore') || '0', 10);
        const updatedTotal = currentTotal + newScore;
        localStorage.setItem('hangmanTotalScore', updatedTotal.toString());

        // Save the score to localStorage
        const savedScores = JSON.parse(localStorage.getItem('hangmanScores') || '[]');
        const newSavedScores = [
          ...savedScores,
          {
            date: new Date().toISOString(),
            category: settings.category,
            difficulty: settings.difficulty,
            score: newScore,
            word: word
          }
        ];
        localStorage.setItem('hangmanScores', JSON.stringify(newSavedScores));
      }
    } else {
      // Wrong guess
      playSFX('wrong-answer'); // Use passed-in playSFX

      setWrongGuesses(prev => prev + 1);

      // Check if the player has lost
      if (wrongGuesses + 1 >= MAX_ATTEMPTS) {
        playSFX('defeat'); // Use passed-in playSFX
        setGameStatus('lost');

        // FSRS Recording for failed completion
        console.log('🎯 [HANGMAN LOSE] Starting FSRS recording for word:', word);
        try {
          const currentVocabItem = vocabulary?.find(v => v.word.toLowerCase() === word.toLowerCase());
          const wordData = {
            id: currentVocabItem?.id || `hangman-${word}`,
            word: word,
            translation: currentVocabItem?.translation || word, // Use translation if available
            language: settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en'
          };

          console.log('🎯 [HANGMAN LOSE] Word data prepared:', wordData);

          // Calculate confidence based on performance (lower for failed attempts)
          const correctGuessCount = newGuessedLetters.filter(letter => word.toLowerCase().includes(letter)).length;
          const totalGuessCount = newGuessedLetters.length;
          const accuracy = totalGuessCount > 0 ? correctGuessCount / totalGuessCount : 0;
          const confidence = Math.max(0.1, Math.min(0.4, accuracy * 0.5)); // Much lower confidence for failed attempts

          console.log('🎯 [HANGMAN LOSE] Confidence calculated:', confidence, {
            accuracy,
            timer,
            wrongGuesses: wrongGuesses + 1
          });

          // 🔧 FIX: Do NOT record failed attempts - Hangman should not penalize accuracy
          // Students should only get credit for correct completions, not penalized for failures
          console.log('⏭️ [HANGMAN LOSE] Skipping FSRS recording for failed attempt to avoid accuracy penalty');
        } catch (error) {
          console.error('❌ Error setting up FSRS recording for hangman (lose):', error);
        }
      }
    }
  };

  const handleHint = () => {
    if (hints <= 0 || gameStatus !== 'playing') return;

    const unguessedLetters = wordLetters.filter(letter => !guessedLetters.includes(letter));
    if (unguessedLetters.length === 0) return;

    const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
    const hintLetter = unguessedLetters[randomIndex];

    setHints(prev => prev - 1);
    playSFX('button-click'); // Use passed-in playSFX
    setShowPowerupEffect(true);
    setTimeout(() => setShowPowerupEffect(false), 800);
    handleLetterGuess(hintLetter);
  };

  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setTimer(0);
    setScore(0);

    const { word: newWord, id: wordId } = getRandomWordNoRepeats();
    setWord(newWord.toLowerCase());
    setWordLetters([...new Set(newWord.split('').filter((char: string) => char !== ' ' && char !== "'" && char !== '-'))] as string[]);

    // Restart the timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    timerIntervalRef.current = interval;
  };

  const calculateScore = () => {
    // Base score based on difficulty
    let baseScore = 100;
    if (settings.difficulty === 'intermediate') baseScore = 200;
    if (settings.difficulty === 'advanced') baseScore = 300;
    if (settings.difficulty === 'expert') baseScore = 400;

    // Decrease score based on wrong guesses and time
    const wrongGuessPenalty = wrongGuesses * 10;
    const timePenalty = Math.floor(timer / 10);

    return Math.max(baseScore - wrongGuessPenalty - timePenalty, 50);
  };

  // Removed toggleSound as it's now handled by the parent useAudio hook via playSFX
  // and music mute is also handled by the parent `useAudio` if passed in

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderThematicAnimation = () => {
    if (themeId === 'default') {
      return (
        <ClassicHangmanAnimation
          mistakes={wrongGuesses}
          maxMistakes={MAX_ATTEMPTS}
          className="w-full h-full"
        />
      );
    }

    if (themeId === 'tokyo') {
      return <TokyoNightsAnimation
        mistakes={wrongGuesses}
        maxMistakes={MAX_ATTEMPTS}
      />;
    }

    if (themeId === 'temple') {
      return <LavaTempleAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
    }

    if (themeId === 'space') {
      return <SpaceExplorerAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
    }

    // Pirate theme animation
    return <PirateAdventureAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
  };


  // Helper to get allowed letters based on language
  const getAllowedLetters = () => {
    const baseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let accentedLetters: string[] = [];
    const specialCharacters = ['/', '(', ')'];

    switch (settings.language) {
      case 'spanish':
        accentedLetters = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ñ'];
        break;
      case 'french':
        accentedLetters = ['É', 'È', 'Ê', 'À', 'Ç', 'Œ'];
        break;
      case 'german':
        accentedLetters = ['Ä', 'Ö', 'Ü', 'ß'];
        break;
      case 'portuguese':
        accentedLetters = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ã', 'Ç'];
        break;
      default:
        accentedLetters = [];
    }
    return {
      allLetters: [...baseAlphabet, ...accentedLetters],
      specialCharacters
    };
  };

  // Add keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modifiers are pressed (ctrl, alt, meta)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (gameStatus !== 'playing') return;

      const key = e.key.toUpperCase();
      const { allLetters } = getAllowedLetters();

      if (allLetters.includes(key)) {
        handleLetterGuess(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, handleLetterGuess, settings.language]);

  const renderKeyboard = () => {
    // Two-row layout with accented letters based on language
    const getKeyboardLayout = () => {
      const { allLetters, specialCharacters } = getAllowedLetters();

      // Split into two rows
      const midPoint = Math.ceil(allLetters.length / 2);
      return {
        row1: allLetters.slice(0, midPoint),
        row2: allLetters.slice(midPoint),
        row3: specialCharacters // Third row for special characters
      };
    };

    const { row1, row2, row3 } = getKeyboardLayout();

    const renderRow = (letters: string[]) => (
      <div className={`flex flex-wrap justify-center gap-1 md:gap-3`}>
        {letters.map((letter) => {
          const lowerLetter = letter.toLowerCase();
          const isUsed = guessedLetters.includes(lowerLetter);
          const isCorrect = isUsed && doesWordContainLetter(word, lowerLetter);
          const isWrong = isUsed && !doesWordContainLetter(word, lowerLetter);

          let buttonClass = `w-10 h-10 md:w-16 md:h-16 text-lg md:text-2xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95`;

          if (isCorrect) {
            // Apply theme-specific styles for correct letters
            if (themeId === 'tokyo') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-pink-500/50 ring-2 ring-pink-400/50`;
            } else if (themeId === 'space') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/50`;
            } else if (themeId === 'temple') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-orange-500/50 ring-2 ring-orange-400/50`;
            } else if (themeId === 'pirate') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-amber-500/50 ring-2 ring-amber-400/50`;
            } else {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg`;
            }
          } else if (isWrong) {
            // Apply styles for wrong letters
            buttonClass += " bg-red-600 text-white shadow-lg";
          } else if (!isUsed) {
            // Apply styles for unused letters
            buttonClass += " bg-white/90 hover:bg-white text-gray-800 shadow-md border border-white/50 backdrop-blur-sm";
          } else {
            // Fallback style
            buttonClass += " bg-gray-400 text-gray-600 shadow-sm";
          }

          return (
            <button
              key={letter}
              onClick={() => {
                playSFX('button-click'); // Use passed-in playSFX
                handleLetterGuess(letter);
              }}
              disabled={isUsed || gameStatus !== 'playing'}
              className={buttonClass}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );

    return (
      <div className={`space-y-2 md:space-y-6 mt-2 md:mt-4`}>
        {renderRow(row1)}
        {renderRow(row2)}
        {/* Special characters row - only show if word contains these characters */}
        {(word.includes('/') || word.includes('(') || word.includes(')')) && (
          <div className="flex justify-center">
            {renderRow(row3)}
          </div>
        )}
      </div>
    );
  };

  const renderWord = () => {
    return (
      <div className={`flex justify-center flex-wrap gap-2 md:gap-4`}>
        {word.split('').map((letter, index) => {
          if (letter === ' ') {
            // Render a space character
            return (
              <div key={index} className="w-4 md:w-6 flex items-end justify-center">
                <div className="w-4 h-4 md:w-6 md:h-6"></div>
              </div>
            );
          }

          if (letter === "'" || letter === '-') {
            // Render apostrophes and hyphens directly (always visible)
            return (
              <div key={index} className="w-4 md:w-6 flex items-end justify-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {letter}
                </div>
              </div>
            );
          }

          const isRevealed = isLetterGuessed(letter, guessedLetters);

          // Enhanced theme-specific glow effects for word squares
          let squareClass = `w-10 h-12 md:w-14 md:h-16 flex items-center justify-center rounded-xl transition-all duration-300 backdrop-blur-sm`;

          if (isRevealed) {
            // Theme-specific styling for revealed letters
            if (themeId === 'tokyo') {
              squareClass += ' bg-pink-600/90 text-white shadow-2xl shadow-pink-500/60 ring-2 ring-pink-400/70 glow-pink';
            } else if (themeId === 'space') {
              squareClass += ' bg-purple-600/90 text-white shadow-2xl shadow-purple-500/60 ring-2 ring-purple-400/70 glow-purple';
            } else if (themeId === 'temple') {
              squareClass += ' bg-orange-600/90 text-white shadow-2xl shadow-orange-500/60 ring-2 ring-orange-400/70 glow-orange';
            } else if (themeId === 'pirate') {
              squareClass += ' bg-amber-600/90 text-white shadow-2xl shadow-amber-500/60 ring-2 ring-amber-400/70 glow-amber';
            } else {
              squareClass += ' bg-blue-600/90 text-white shadow-2xl shadow-blue-500/60 ring-2 ring-blue-400/70';
            }
          } else {
            // Unrevealed letter styling with subtle theme hints
            if (themeId === 'tokyo') {
              squareClass += ' bg-white/70 border-2 border-pink-300/50 shadow-lg shadow-pink-500/20';
            } else if (themeId === 'space') {
              squareClass += ' bg-white/70 border-2 border-purple-300/50 shadow-lg shadow-purple-500/20';
            } else if (themeId === 'temple') {
              squareClass += ' bg-white/70 border-2 border-orange-300/50 shadow-lg shadow-orange-500/20';
            } else if (themeId === 'pirate') {
              squareClass += ' bg-white/70 border-2 border-amber-300/50 shadow-lg shadow-amber-500/20';
            } else {
              squareClass += ' bg-white/70 border-2 border-blue-300/50 shadow-lg shadow-blue-500/20';
            }
          }

          return (
            <div key={index} className="text-center">
              <div className={squareClass}>
                <span className={`text-lg md:text-2xl font-bold`}>
                  {isRevealed ? letter.toUpperCase() : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Customize text based on theme
  useEffect(() => {
    if (themeId === 'tokyo') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-slate-900',
        text: 'text-cyan-50',
        accent: 'bg-pink-600',
        button: 'bg-cyan-600 hover:bg-cyan-700',
        dangerText: 'Password Attempts',
        winMessage: 'Hack Successful!',
        loseMessage: 'System Breached!'
      });
    } else if (themeId === 'temple') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-amber-900',
        text: 'text-amber-50',
        accent: 'bg-amber-600',
        button: 'bg-amber-700 hover:bg-amber-800',
        dangerText: 'Escape Chances',
        winMessage: 'Ancient Secret Unlocked!',
        loseMessage: 'Trapped in the Temple!'
      });
    } else if (themeId === 'space') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-slate-800',
        text: 'text-purple-50',
        accent: 'bg-purple-600',
        button: 'bg-purple-700 hover:bg-purple-800',
        dangerText: 'Oxygen Level',
        winMessage: 'Mission Accomplished!',
        loseMessage: 'Lost in Space!'
      });
    } else if (themeId === 'pirate') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-blue-900',
        text: 'text-amber-50',
        accent: 'bg-amber-600',
        button: 'bg-amber-700 hover:bg-amber-800',
        dangerText: 'Lives Remaining',
        winMessage: 'Treasure Found!',
        loseMessage: 'Walk the Plank!'
      });
    } else { // Default / Classic theme
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-gray-800',
        text: 'text-white',
        accent: 'bg-blue-600',
        button: 'bg-blue-700 hover:bg-blue-800',
        dangerText: 'Lives Remaining',
        winMessage: 'You Won!',
        loseMessage: 'Game Over!'
      });
    }
  }, [themeId, themeClasses]);

  // Add an effect to show the theme-specific modals when theme is selected
  useEffect(() => {
    // Only show modal once per session
    const showModalOnce = (modalKey: string, setShowModal: (state: boolean) => void) => {
      const hasSeenModal = sessionStorage.getItem(modalKey);
      if (!hasSeenModal) {
        setShowModal(true);
        sessionStorage.setItem(modalKey, 'true');
      }
    };

    if (settings.theme === 'lava-temple') {
      showModalOnce('has-seen-temple-guardian-modal', setShowTempleGuardianModal);
    } else if (settings.theme === 'tokyo') {
      showModalOnce('has-seen-tokyo-nights-modal', setShowTokyoNightsModal);
    } else if (settings.theme === 'space') {
      showModalOnce('has-seen-space-explorer-modal', setShowSpaceExplorerModal);
    } else if (settings.theme === 'pirate') {
      showModalOnce('has-seen-pirate-adventure-modal', setShowPirateAdventureModal);
    }
  }, [settings.theme]);

  return (
    <div className={`flex flex-col ${isAssignmentMode ? 'h-auto min-h-[750px]' : 'min-h-screen'} ${themeClassesState.background} ${themeClassesState.text} ${isAssignmentMode ? 'relative' : 'overflow-hidden'}`}>
      {/* Custom CSS for glow effects */}
      <style jsx>{`
        .glow-pink {
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(236, 72, 153, 0.4), 0 0 60px rgba(236, 72, 153, 0.2);
        }
        .glow-purple {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.4), 0 0 60px rgba(147, 51, 234, 0.2);
        }
        .glow-orange {
          box-shadow: 0 0 20px rgba(234, 88, 12, 0.6), 0 0 40px rgba(234, 88, 12, 0.4), 0 0 60px rgba(234, 88, 12, 0.2);
        }
        .glow-amber {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.2);
        }
      `}</style>

      {/* Background video/animation - render in ALL modes and themes */}
      <div className="absolute inset-0 z-0">
        {renderThematicAnimation()}
      </div>

      {/* Top navigation and info bar - render in ALL modes (both assignment and standard) */}
      <div className="relative z-50 flex justify-between items-center p-3 md:p-4 bg-black/30 backdrop-blur-sm">
        {!isFullscreen && (
          <button
            onClick={onBackToMenu}
            className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center text-sm md:text-base"
          >
            <span className="md:hidden">←</span>
            <span className="hidden md:inline">{isAssignmentMode ? 'Back to Assignment' : 'Back to Games'}</span>
          </button>
        )}

        {/* Game info - responsive layout */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 mx-2 md:mx-4">
          <div className="text-xs md:text-sm font-medium text-center">
            {settings.category.charAt(0).toUpperCase() + settings.category.slice(1)} - {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
          </div>

          <div className="text-xs md:text-sm opacity-75">
            {formatTime(timer)}
          </div>

          {/* Lives remaining in top bar */}
          {gameStatus === 'playing' && (
            <div className="text-xs md:text-sm font-medium">
              <span className="opacity-75">Lives:</span> {MAX_ATTEMPTS - wrongGuesses}/{MAX_ATTEMPTS}
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Settings button - Enhanced visibility */}
          {onOpenSettings && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSFX('button-click');
                onOpenSettings();
              }}
              className="relative px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm md:text-base font-semibold flex items-center gap-2 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
              title={isAssignmentMode ? "Choose your theme" : "Customize your game: Change Language, Level, Topic & Theme"}
            >
              {isAssignmentMode ? (
                <Palette className="h-5 w-5 md:h-6 md:w-6" />
              ) : (
                <Settings className="h-5 w-5 md:h-6 md:w-6" />
              )}
              <span className="hidden md:inline">Game Settings</span>
              <span className="md:hidden">Settings</span>

              {/* Optional: Add a small indicator if settings are default */}
              {settings.language === 'english' && settings.theme === 'default' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"
                  title="Try customizing your game settings!"
                />
              )}
            </motion.button>
          )}

          {/* Quick Theme Selector */}
          {!isAssignmentMode && onThemeChange && (
            <QuickThemeSelector
              currentTheme={settings.theme}
              onThemeChange={(theme) => {
                playSFX('button-click');
                onThemeChange(theme);
              }}
              variant="button"
              className="relative z-50"
              customButtonClass="relative px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white text-sm md:text-base font-semibold flex items-center gap-2 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
            />
          )}

          {/* Music toggle button - show in all modes */}
          <button
            onClick={() => {
              playSFX('button-click'); // SFX for the button click itself
              if (toggleMusic) {
                toggleMusic();
              } else {
                setMusicEnabled(prev => !prev); // Fallback to local state
              }
            }}
            className="p-1.5 md:p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            title={(isMusicEnabled ?? musicEnabled) ? "Mute music" : "Play music"}
          >
            {(isMusicEnabled ?? musicEnabled) ? <Volume2 size={14} className="md:w-4 md:h-4" /> : <VolumeX size={14} className="md:w-4 md:h-4" />}
          </button>

          {/* Hint button */}
          <button
            onClick={() => {
              playSFX('button-click'); // Use passed-in playSFX
              handleHint();
            }}
            disabled={hints <= 0 || gameStatus !== 'playing'}
            className={`
            relative flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg
            ${hints > 0 && gameStatus === 'playing'
                ? `${themeClassesState.button}`
                : 'bg-gray-400 opacity-50'
              }
            text-white text-xs md:text-sm font-medium
          `}
          >
            <Zap size={14} className="md:w-4 md:h-4" />
            <span className="hidden md:inline">Hint</span>
            <span className="md:ml-1">({hints})</span>

            {showPowerupEffect && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 2], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-lg bg-white bg-opacity-30 pointer-events-none"
              />
            )}
          </button>
        </div>
      </div>

      {/* Progress bar - on top of the header */}
      <div className="relative z-60 px-3 md:px-4 pb-3 md:pb-4">
        <div className="w-full h-2 md:h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${100 - (wrongGuesses / MAX_ATTEMPTS * 100)}%`,
              backgroundColor: wrongGuesses > 4 ? 'red' : wrongGuesses > 2 ? 'orange' : 'green',
            }}
          ></div>
        </div>
      </div>

      {/* Main game content area - Unified layout */}
      <div className="relative z-40 flex-1 flex flex-col">
        <div className="flex-1"></div>

        {/* Word display positioned much lower */}
        {gameStatus === 'playing' && (
          <div className="px-2 md:px-4 pb-4 md:pb-8">
            {renderWord()}
          </div>
        )}

        {/* Keyboard/Controls area */}
        <div className="px-2 md:px-4 pb-4 md:pb-8">
          {gameStatus === 'playing' ? (
            <div className={`transition-all duration-300 ${animation === 'wrong' ? 'scale-105' : animation === 'correct' ? 'scale-95' : ''}`}>
              {renderKeyboard()}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {gameStatus === 'won'
                  ? (themeClassesState.winMessage)
                  : (themeClassesState.loseMessage)}
              </h2>

              <p className="text-xl mb-4">
                {gameStatus === 'won'
                  ? `Great job! You guessed the word correctly.`
                  : `The word was: ${word.toUpperCase()}`}
              </p>

              {gameStatus === 'won' && (
                <div className="my-4 text-lg">
                  <p>Score: <span className="font-bold">{calculateScore()}</span></p>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    playSFX('button-click'); // Use passed-in playSFX
                    resetGame();
                  }}
                  className={`${themeClassesState.button} py-3 px-6 rounded-lg font-bold text-white`}
                >
                  Play Again
                </button>

                <button
                  onClick={() => {
                    playSFX('button-click'); // Use passed-in playSFX
                    onBackToMenu();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 py-3 px-6 rounded-lg font-bold text-white"
                >
                  {isAssignmentMode ? 'Back to Assignment' : 'Back to Games'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme-specific Modals */}
      <TempleGuardianModal
        isOpen={showTempleGuardianModal}
        onClose={() => setShowTempleGuardianModal(false)}
      />

      <TokyoNightsModal
        isOpen={showTokyoNightsModal}
        onClose={() => setShowTokyoNightsModal(false)}
      />

      <SpaceExplorerModal
        isOpen={showSpaceExplorerModal}
        onClose={() => setShowSpaceExplorerModal(false)}
      />

      <PirateAdventureModal
        isOpen={showPirateAdventureModal}
        onClose={() => setShowPirateAdventureModal(false)}
      />
    </div>
  );
}

export default function HangmanGame({ playSFX, ...props }: HangmanGameProps) { // <--- FIXED HERE
  return (
    <ThemeProvider themeId={props.settings.theme}>
      <GameContent playSFX={playSFX} {...props} /> {/* <--- FIXED HERE */}
    </ThemeProvider>
  );
}
