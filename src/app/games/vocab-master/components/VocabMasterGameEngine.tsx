import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Gem, Lightbulb, Sparkles, Flame, Target, Star, Zap, Settings } from 'lucide-react';
import { GameState, GameConfig, VocabularyWord, GameMode, GameResult, MultipleChoiceOption, ClozeExercise } from '../types';
import { AudioManager } from '../utils/audioUtils';
import { validateGameAnswer } from '../utils/answerValidation';
import { getModeConfig, mapLauncherModeToGameMode, hasCustomComponent } from '../modes';
import { exerciseDataService } from '../services/exerciseDataService';


// Import gamification components
import GemIcon, { GemType } from '../../../../components/ui/GemIcon'; // Keep for now, though not used in new gem structure
import GemCollectionAnimation from '../../../../components/ui/GemCollectionAnimation';
import AchievementNotification from '../../../../components/ui/AchievementNotification';
import { audioFeedbackService } from '../../../../services/audioFeedbackService';
import { achievementService, Achievement } from '../../../../services/achievementService';
import { GEM_TYPES } from '../../vocabulary-mining/utils/gameConstants';
import { RewardEngine, type GemRarity } from '../../../../services/rewards/RewardEngine';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

// Import mode components
import { DictationMode } from '../modes/DictationMode';
import { ListeningMode } from '../modes/ListeningMode';
import { ClozeMode } from '../modes/ClozeMode';
import { MatchingMode } from '../modes/MatchingMode';
import { SpeedMode } from '../modes/SpeedMode';
import { MultipleChoiceMode } from '../modes/MultipleChoiceMode';
import { FlashcardsMode } from '../modes/FlashcardsMode';
import { LearnMode }
  from '../modes/LearnMode';
import { RecallMode } from '../modes/RecallMode';
import { MixedMode } from '../modes/MixedMode';
import { WordBuilderMode } from '../modes/WordBuilderMode';
import { PronunciationMode } from '../modes/PronunciationMode';
import { WordRaceMode } from '../modes/WordRaceMode';
import { StoryAdventureMode } from '../modes/StoryAdventureMode';
import { MemoryPalaceMode } from '../modes/MemoryPalaceMode';

// Calculate dynamic time based on word complexity
const calculateWordTime = (word: VocabularyWord): number => {
  const translation = word.english || word.translation || '';
  const spanish = word.spanish || word.word || '';

  // Base time: 3 seconds
  let timeSeconds = 3;

  // Add time based on translation length
  const translationLength = translation.length;
  if (translationLength <= 5) {
    timeSeconds += 1; // Short words like "cat", "dog" = 4 seconds
  } else if (translationLength <= 10) {
    timeSeconds += 2; // Medium words like "elephant" = 5 seconds
  } else if (translationLength <= 15) {
    timeSeconds += 3; // Longer words = 6 seconds
  } else {
    timeSeconds += 4; // Very long words/phrases = 7 seconds
  }

  // Add time for complex Spanish words (accents, ñ, longer words)
  if (spanish.includes('ñ') || /[áéíóúü]/.test(spanish)) {
    timeSeconds += 1; // Extra time for accented characters
  }

  // Add time for phrases (multiple words)
  if (translation.includes(' ') || spanish.includes(' ')) {
    timeSeconds += 1; // Extra time for phrases
  }

  // Minimum 3 seconds, maximum 8 seconds
  return Math.max(3, Math.min(8, timeSeconds));
};

interface VocabMasterGameEngineProps {
  config: GameConfig;
  onGameComplete: (result: GameResult) => void;
  onExit: () => void;
  isAdventureMode?: boolean;
  gameSessionId?: string | null;
  gameService?: any;
  onWordAttempt?: (
    word: string,
    translation: string,
    answer: string,
    isCorrect: boolean,
    responseTime: number,
    gameMode: string,
    masteryLevel?: number,
    vocabularyId?: string
  ) => void;
  onOpenSettings?: () => void;
}

export const VocabMasterGameEngine: React.FC<VocabMasterGameEngineProps> = ({
  config,
  onGameComplete,
  onExit,
  isAdventureMode = false,
  gameSessionId,
  gameService,
  onWordAttempt,
  onOpenSettings
}) => {

  // Core game state
  const [gameState, setGameState] = useState<GameState>(() => ({
    currentWordIndex: 0,
    currentWord: config.vocabulary[0] || null,
    currentExerciseData: null,
    answer: '',
    selectedChoice: null,
    showAnswer: false,
    isCorrect: null,
    score: 0,
    totalWords: config.vocabulary.length,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    maxStreak: 0,
    gameMode: mapLauncherModeToGameMode(config.mode),
    timeSpent: 0,
    startTime: new Date(),
    wordsLearned: [],
    wordsStruggling: [],
    feedback: '',
    audioPlaying: false,
    canReplayAudio: true,
    audioReplayCount: 0,
    isAnswerRevealed: false,
    gemsCollected: 0,
    currentGemType: 'common',
    speedModeTimeLeft: config.vocabulary[0] ? calculateWordTime(config.vocabulary[0]) : 5,
    isFlashcardFlipped: false,
    showHint: false,
    translationShown: false,
    multipleChoiceOptions: []
  }));

  // Guard against duplicate answer processing
  const lastProcessedAnswer = useRef<string>('');
  const lastAnswerKey = useRef<string>('');
  const lastAdvancementKey = useRef<string>('');

  // UI state
  const [userAnswer, setUserAnswer] = useState('');
  const [audioManager] = useState(() => new AudioManager(config.audioEnabled));
  const [currentResponseTime, setCurrentResponseTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Gamification state
  const [showGemAnimation, setShowGemAnimation] = useState(false);
  const [collectedGemType, setCollectedGemType] = useState<GemType>('common');
  const [gemPoints, setGemPoints] = useState(0);
  const [gemUpgraded, setGemUpgraded] = useState(false);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // Generate multiple choice options
  const generateMultipleChoiceOptions = useCallback((currentWord: VocabularyWord, allWords: VocabularyWord[]): MultipleChoiceOption[] => {
    if (!currentWord) return [];

    const correctAnswer = currentWord.english || currentWord.translation || '';
    if (!correctAnswer) return [];

    const otherWords = allWords.filter(w => w.id !== currentWord.id);

    // Get 3 random wrong answers
    const wrongAnswers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english || w.translation || '')
      .filter(text => text.length > 0);

    // Ensure we have enough options
    while (wrongAnswers.length < 3 && wrongAnswers.length < otherWords.length) {
      const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
      const text = randomWord.english || randomWord.translation || '';
      if (text && !wrongAnswers.includes(text) && text !== correctAnswer) {
        wrongAnswers.push(text);
      }
    }

    // Combine and shuffle
    const allOptions = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5);

    return allOptions.map((text, index) => ({
      id: index.toString(),
      text,
      isCorrect: text === correctAnswer
    }));
  }, []);

  // Generate exercise data for current word and mode
  const generateExerciseData = useCallback(async (word: VocabularyWord, mode: string) => {
    try {
      const exerciseData = await exerciseDataService.generateExerciseData(mode, word);
      setGameState(prev => ({
        ...prev,
        currentExerciseData: exerciseData
      }));
    } catch (error) {
      console.error('Failed to generate exercise data:', error);
      // Set fallback exercise data
      setGameState(prev => ({
        ...prev,
        currentExerciseData: {
          type: 'default',
          correctAnswer: word.english || word.translation || ''
        }
      }));
    }
  }, []);

  // Initialize game
  useEffect(() => {
    if (config.vocabulary.length === 0) {
      console.error('No vocabulary provided to game engine');
      return;
    }

    // Set initial word and mode
    const initialGameMode = mapLauncherModeToGameMode(config.mode);
    const firstWord = config.vocabulary[0];
    const options = generateMultipleChoiceOptions(firstWord, config.vocabulary);

    setGameState(prev => ({
      ...prev,
      currentWord: firstWord,
      gameMode: initialGameMode,
      totalWords: config.vocabulary.length,
      multipleChoiceOptions: options
    }));

    // Generate exercise data for the initial word
    generateExerciseData(firstWord, initialGameMode);
  }, []); // Remove config from dependencies to prevent re-initialization during game

  // Audio playback
  const playPronunciation = useCallback(async (
    text: string,
    language: 'es' | 'en' = 'es',
    word?: VocabularyWord
  ) => {
    if (!config.audioEnabled) return;

    setGameState(prev => ({ ...prev, audioPlaying: true }));

    try {
      await audioManager.playPronunciation(text, language, word);
    } catch (error) {
      console.error('Audio playback failed:', error);
    } finally {
      setGameState(prev => ({ ...prev, audioPlaying: false }));
    }
  }, [audioManager, config.audioEnabled]);

  // Handle answer submission
  const handleAnswer = useCallback(async (answer: string) => {
    const responseTime = Date.now() - questionStartTime;
    setCurrentResponseTime(responseTime);
    
    // Create unique identifier for this answer attempt
    const answerKey = `${gameState.currentWordIndex}-${answer}-${responseTime}`;
    
    // Prevent duplicate processing of the same answer
    if (lastProcessedAnswer.current === answerKey) {
      console.log('⚠️ [HANDLE ANSWER] Duplicate answer detected, skipping ALL processing:', answerKey);
      return;
    }

    console.log('🔍 [HANDLE ANSWER] Processing new answer:', {
      answerKey,
      lastProcessedAnswer: lastProcessedAnswer.current,
      currentWordIndex: gameState.currentWordIndex,
      currentCorrectAnswers: gameState.correctAnswers,
      currentIncorrectAnswers: gameState.incorrectAnswers
    });

    lastProcessedAnswer.current = answerKey;

    console.log('🎯 HANDLE ANSWER CALLED:', {
      answer,
      responseTime,
      answerKey
    });

    setGameState(prev => {
      console.log('🔄 STATE UPDATE - BEFORE:', {
        currentWordIndex: prev.currentWordIndex,
        currentWord: prev.currentWord?.spanish,
        showAnswer: prev.showAnswer
      });

      // Prevent double execution - if answer is already shown, don't process again
      if (prev.showAnswer) {
        console.log('⚠️ [HANDLE ANSWER] Answer already shown, skipping duplicate execution');
        return prev;
      }

      // Convert new cloze format to legacy format for validation
      let sentenceData: ClozeExercise | null = null;
      if (prev.currentExerciseData?.cloze) {
        const clozeData = prev.currentExerciseData.cloze;
        sentenceData = {
          sentence: clozeData.sourceSentence,
          blankedSentence: clozeData.blankedSentence,
          correctAnswer: clozeData.targetWord,
          position: clozeData.wordPosition
        };
      }

      const validation = validateGameAnswer(answer, prev.gameMode, prev.currentWord, sentenceData);

      console.log('🎯 [VALIDATION RESULT]:', {
        answer,
        currentWord: prev.currentWord?.spanish || prev.currentWord?.word,
        expectedAnswer: prev.currentWord?.english || prev.currentWord?.translation,
        isCorrect: validation.isCorrect,
        gameMode: prev.gameMode,
        translationShown: prev.translationShown
      });

      // Log word attempt for analytics (if callback provided)
      if (onWordAttempt && prev.currentWord) {
        const word = prev.currentWord.spanish || prev.currentWord.word || '';
        const translation = prev.currentWord.english || prev.currentWord.translation || '';
        const masteryLevel = validation.isCorrect ? 3 : 1;

        onWordAttempt(
          word,
          translation,
          answer,
          validation.isCorrect,
          responseTime,
          prev.gameMode,
          masteryLevel,
          prev.currentWord.id
        );
      }

      // If translation was shown, don't count as correct or incorrect - just neutral
      const shouldCountAnswer = !prev.translationShown;

      // Record FSRS practice for this word (works in both assignment and free play modes)
      if (prev.currentWord && shouldCountAnswer) {
        (async () => {
          try {
            const wordData = {
              id: prev.currentWord?.id || `vocab-master-${prev.currentWord?.spanish || prev.currentWord?.word}`,
              word: prev.currentWord?.spanish || prev.currentWord?.word || '',
              translation: prev.currentWord?.english || prev.currentWord?.translation || '',
              language: 'es' // Assuming Spanish for vocab master
            };

            // Calculate confidence based on response time, streak, and hints
            const baseConfidence = validation.isCorrect ? 0.7 : 0.3;
            const streakBonus = Math.min(prev.streak * 0.05, 0.2); // Up to 20% bonus for streak
            const hintPenalty = prev.translationShown ? 0.2 : 0; // 20% penalty for showing translation
            const timeFactor = responseTime > 10000 ? 0.1 : responseTime > 5000 ? 0.05 : 0; // Penalty for slow responses
            const confidence = Math.max(0.1, Math.min(0.9, baseConfidence + streakBonus - hintPenalty - timeFactor));

            // Record gem in assignment mode (GameAssignmentWrapper handles both FSRS and gem recording)
            if (config.assignmentMode && (window as any).recordVocabularyInteraction) {
              // Prevent duplicate calls with a unique key
              const answerKey = `${gameState.currentWordIndex}-${wordData.word}-${responseTime}`;
              if (lastAnswerKey.current !== answerKey) {
                lastAnswerKey.current = answerKey;
                console.log('🔮 [VOCAB MASTER] Recording gem for assignment mode...', answerKey);
                try {
                  (window as any).recordVocabularyInteraction(
                    wordData.word, // Pass the actual word text
                    wordData.translation, // Pass the translation text
                    validation.isCorrect, // correct/incorrect
                    responseTime, // responseTime in ms
                    prev.translationShown, // hintUsed - true if translation was shown
                    1 // streakCount
                  ).then((gemResult: any) => {
                    console.log('🔮 [VOCAB MASTER] Gem recorded successfully:', gemResult);
                  }).catch((gemError: any) => {
                    console.error('❌ Error recording gem (vocab master):', gemError);
                  });
                } catch (gemError) {
                  console.error('❌ Error calling recordVocabularyInteraction (vocab master):', gemError);
                }
              } else {
                console.log('🔮 [VOCAB MASTER] Skipping duplicate gem recording for:', answerKey);
              }
            } else if (config.assignmentMode) {
              console.log('⚠️ [VOCAB MASTER] Assignment mode but no recordVocabularyInteraction function available');
            } else {
              // ✅ UNIFIED: Record vocabulary attempt directly (non-assignment mode)
              console.log('🔍 [VOCAB MASTER] Recording vocabulary attempt directly...');
              if (gameSessionId) {
                const sessionService = new EnhancedGameSessionService();
                const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'vocab-master', {
                  vocabularyId: wordData.id,
                  wordText: wordData.word,
                  translationText: wordData.translation,
                  responseTimeMs: responseTime,
                  wasCorrect: validation.isCorrect,
                  hintUsed: false,
                  streakCount: gameState.streak,
                  masteryLevel: 1,
                  maxGemRarity: 'rare',
                  gameMode: config.mode,
                  difficultyLevel: 'intermediate'
                });

                if (gemEvent) {
                  console.log(`✅ Vocab Master gem awarded: ${gemEvent.rarity} (${gemEvent.xpValue} XP)`);
                }
              }

              console.log(`🔍 [FSRS] Recorded practice for ${wordData.word}:`, {
                isCorrect: validation.isCorrect,
                confidence,
                responseTime,
                fsrsResult: fsrsResult ? {
                  success: fsrsResult.success,
                  algorithm: fsrsResult.algorithm,
                  nextReviewDate: fsrsResult.nextReviewDate,
                  interval: fsrsResult.interval,
                  masteryLevel: fsrsResult.masteryLevel
                } : null
              });
            }
          } catch (error) {
            console.error('Error recording FSRS practice for vocab master:', error);
          }
        })();
      }
      const isCorrectForScoring = validation.isCorrect && shouldCountAnswer;

      // Get correct answer for this mode
      const correctAnswer = (() => {
        if (!prev.currentWord) return '';
        switch (prev.gameMode) {
          case 'dictation':
            return prev.currentWord.spanish || prev.currentWord.word || '';
          case 'listening':
            return prev.currentWord.english || prev.currentWord.translation || '';
          default:
            return prev.currentWord.english || prev.currentWord.translation || '';
        }
      })();

      // Play sound effects for correct/incorrect answers
      if (config.audioEnabled) {
        if (validation.isCorrect) {
          audioFeedbackService.playCorrectSound();
        } else {
          audioFeedbackService.playErrorSound();
        }
      }

      // Gem collection for ALL modes (not just adventure) - use new RewardEngine
      let updatedGemsCollected = prev.gemsCollected;
      let updatedGemType = prev.currentGemType;
      let gemRarity: any = 'common';

      if (validation.isCorrect && shouldCountAnswer) {
        // Use RewardEngine for consistent gem calculation
        gemRarity = RewardEngine.calculateGemRarity('vocab-master', {
          responseTimeMs: responseTime,
          streakCount: prev.streak,
          hintUsed: prev.translationShown,
          isTypingMode: prev.gameMode === 'typing',
          isDictationMode: prev.gameMode === 'dictation',
          masteryLevel: prev.currentWord?.mastery_level || 0,
        });

        const points = RewardEngine.getXPValue(gemRarity);
        setTotalXP(prevXP => prevXP + points);
        setXpGained(points);
        setShowXPGain(true);
        setTimeout(() => setShowXPGain(false), 2000);

        if (config.audioEnabled) {
          audioFeedbackService.playGemCollectionSound(gemRarity);
        }

        updatedGemsCollected = prev.gemsCollected + 1;
        updatedGemType = gemRarity as GemType;
      }

      const newState = {
        ...prev,
        isCorrect: validation.isCorrect,
        showAnswer: true,
        feedback: prev.translationShown
          ? 'Translation was shown - practice more!'
          : validation.isCorrect
            ? 'Correct!'
            : `Incorrect. The answer is: ${correctAnswer}`,
        score: isCorrectForScoring ? prev.score + (isAdventureMode ? GEM_TYPES[prev.currentGemType].points : 10) : prev.score,
        correctAnswers: isCorrectForScoring ? prev.correctAnswers + 1 : prev.correctAnswers,
        incorrectAnswers: shouldCountAnswer && !validation.isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers,
        streak: isCorrectForScoring ? prev.streak + 1 : shouldCountAnswer ? 0 : prev.streak,
        maxStreak: isCorrectForScoring ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
        gemsCollected: updatedGemsCollected,
        currentGemType: updatedGemType
      };

      console.log('🔄 STATE UPDATE - AFTER:', {
        currentWordIndex: newState.currentWordIndex,
        currentWord: newState.currentWord?.spanish,
        showAnswer: newState.showAnswer,
        isCorrect: newState.isCorrect
      });

      // Record gem in database immediately with correct gem data
      if (shouldCountAnswer && validation.isCorrect) {
        // Handle assignment mode gem recording
        if (config.assignmentMode && (window as any).recordVocabularyInteraction) {
          const answerKey = `${prev.currentWordIndex}-${prev.currentWord?.spanish || prev.currentWord?.word}-${responseTime}`;
          if (lastAnswerKey.current !== answerKey) {
            lastAnswerKey.current = answerKey;
            console.log('🔮 [VOCAB MASTER] Recording gem for assignment mode...', answerKey);
            try {
              (window as any).recordVocabularyInteraction(
                prev.currentWord?.spanish || prev.currentWord?.word || '',
                prev.currentWord?.english || prev.currentWord?.translation || '',
                validation.isCorrect,
                responseTime,
                prev.translationShown,
                1
              ).then((gemResult: any) => {
                console.log('🔮 [VOCAB MASTER] Gem recorded successfully:', gemResult);
              }).catch((gemError: any) => {
                console.error('❌ Error recording gem (vocab master):', gemError);
              });
            } catch (gemError) {
              console.error('❌ Error calling recordVocabularyInteraction (vocab master):', gemError);
            }
          }
        }
        
        // Handle non-assignment mode gem recording
        else if (gameSessionId && !config.assignmentMode) {
          console.log('🔍 [GEM COLLECTION] Recording gem in session service...');
          setTimeout(async () => {
            try {
              const sessionService = new EnhancedGameSessionService();
              const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'vocab-master', {
                vocabularyId: prev.currentWord?.id,
                wordText: prev.currentWord?.spanish || prev.currentWord?.word || '',
                translationText: prev.currentWord?.english || prev.currentWord?.translation || '',
                responseTimeMs: responseTime,
                wasCorrect: validation.isCorrect,
                hintUsed: prev.translationShown,
                streakCount: prev.streak,
                masteryLevel: prev.currentWord?.mastery_level || 0,
                maxGemRarity: 'legendary' as GemRarity,
                gameMode: prev.gameMode
              }, true);
              
              console.log('🔍 [VOCAB TRACKING] Gem recorded successfully:', gemEvent);
            } catch (error) {
              console.error('Failed to record vocabulary interaction:', error);
            }
          }, 100); // Small delay to ensure state is updated
        }
      }

      // Schedule word advancement in a separate timeout to avoid race conditions
      setTimeout(() => {
        const advancementKey = `${gameState.currentWordIndex}-${Date.now()}`;
        if (lastAdvancementKey.current === advancementKey) {
          console.log('⚠️ [WORD ADVANCEMENT] Duplicate advancement detected, skipping:', advancementKey);
          return;
        }
        lastAdvancementKey.current = advancementKey;

        console.log('⏰ ADVANCING TO NEXT WORD...', advancementKey);
        setGameState(nextPrev => {
          // CRITICAL: Use the exact same currentWordIndex from the previous state
          // to prevent any race conditions or state resets
          const nextIndex = nextPrev.currentWordIndex + 1;

          console.log('🔄 WORD ADVANCEMENT:', {
            currentIndex: nextPrev.currentWordIndex,
            nextIndex,
            totalWords: config.vocabulary.length,
            currentWord: nextPrev.currentWord?.spanish,
            nextWord: config.vocabulary[nextIndex]?.spanish
          });

          if (nextIndex >= config.vocabulary.length) {
            // Game complete
            const wordsAttempted = nextPrev.currentWordIndex + 1;
            const result: GameResult = {
              score: nextPrev.score,
              accuracy: wordsAttempted > 0 ? (nextPrev.correctAnswers / wordsAttempted) * 100 : 0,
              timeSpent: Math.floor((Date.now() - nextPrev.startTime.getTime()) / 1000),
              correctAnswers: nextPrev.correctAnswers,
              incorrectAnswers: nextPrev.incorrectAnswers,
              totalWords: wordsAttempted,
              wordsLearned: nextPrev.wordsLearned,
              wordsStruggling: nextPrev.wordsStruggling,
              gemsCollected: nextPrev.gemsCollected,
              maxStreak: nextPrev.maxStreak
            };

            onGameComplete(result);
            return nextPrev;
          }

          // Move to next word
          const nextWord = config.vocabulary[nextIndex];
          const newOptions = generateMultipleChoiceOptions(nextWord, config.vocabulary);

          // Reset question start time for response time tracking
          setQuestionStartTime(Date.now());

          // Generate exercise data for the new word
          generateExerciseData(nextWord, nextPrev.gameMode);

          setUserAnswer('');

          const nextState = {
            ...nextPrev,
            currentWordIndex: nextIndex,
            currentWord: nextWord,
            showAnswer: false,
            isCorrect: null,
            feedback: '',
            translationShown: false,
            speedModeTimeLeft: nextPrev.gameMode === 'speed' ? calculateWordTime(nextWord) : nextPrev.speedModeTimeLeft,
            multipleChoiceOptions: newOptions
          };

          console.log('🎯 FINAL NEXT WORD STATE:', {
            currentWordIndex: nextState.currentWordIndex,
            currentWord: nextState.currentWord?.spanish,
            showAnswer: nextState.showAnswer
          });

          return nextState;
        });
      }, 1000);

      return newState;
    });
  }, [questionStartTime, onWordAttempt, config, isAdventureMode, onGameComplete, generateMultipleChoiceOptions, generateExerciseData, gameState.currentWordIndex]);

  // Speed mode timer
  useEffect(() => {
    if (gameState.gameMode !== 'speed' || gameState.speedModeTimeLeft <= 0 || gameState.showAnswer) {
      return;
    }

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.speedModeTimeLeft <= 1) {
          // Time's up - submit empty answer
          setTimeout(() => handleAnswer(''), 100);
          return prev;
        }
        return {
          ...prev,
          speedModeTimeLeft: prev.speedModeTimeLeft - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameMode, gameState.speedModeTimeLeft, gameState.showAnswer, gameState.currentWordIndex, handleAnswer]);

  // Get correct answer for current word and mode
  const getCorrectAnswer = useCallback(() => {
    if (!gameState.currentWord) return '';

    switch (gameState.gameMode) {
      case 'dictation':
        return gameState.currentWord.spanish || gameState.currentWord.word || '';
      case 'listening':
        return gameState.currentWord.english || gameState.currentWord.translation || '';
      default:
        return gameState.currentWord.english || gameState.currentWord.translation || '';
    }
  }, [gameState.gameMode, gameState.currentWord]);

  // Enhanced gem collection logic using RewardEngine
  const addXP = useCallback((points: number) => {
    setTotalXP(prev => prev + points);
    setXpGained(points);
    setShowXPGain(true);

    setTimeout(() => setShowXPGain(false), 2000);
  }, []);

  // Simple next word handler for manual advancement
  const nextWord = useCallback(() => {
    // For compatibility, we can just submit an empty answer to trigger advancement
    handleAnswer('');
  }, [handleAnswer]);

  // Handle mode-specific interactions
  const handleModeSpecificAction = useCallback((action: string, data?: any) => {
    switch (action) {
      case 'time_up':
        handleAnswer('');
        break;
      case 'replay_audio':
        if (gameState.audioReplayCount < 2 && gameState.currentWord) {
          setGameState(prev => ({ ...prev, audioReplayCount: prev.audioReplayCount + 1 }));
          playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord);
        }
        break;
      case 'show_translation':
        setGameState(prev => ({ ...prev, translationShown: true }));
        break;
      case 'dont_know':
        // Mark as incorrect and move to next word
        setGameState(prev => ({
          ...prev,
          isCorrect: false,
          showAnswer: true,
          feedback: `The answer was: ${gameState.currentWord?.translation || gameState.currentWord?.english || ''}`,
          incorrectAnswers: prev.incorrectAnswers + 1,
          wordsStruggling: [...prev.wordsStruggling, gameState.currentWord].filter(Boolean)
        }));

        // Track the "don't know" attempt for analytics
        if (onWordAttempt && gameState.currentWord) {
          onWordAttempt(
            gameState.currentWord.word || gameState.currentWord.spanish || '',
            gameState.currentWord.translation || gameState.currentWord.english || '',
            '[SKIPPED - DON\'T KNOW]',
            false,
            0, // No response time for skipped words
            gameState.gameMode,
            undefined, // No mastery level for skipped
            gameState.currentWord.id
          );
        }

        // Auto-advance after a short delay to show the answer
        setTimeout(() => {
          nextWord();
        }, 2000);
        break;
      case 'word_complete':
        console.log('🎯 Word Builder: Word completed', data);
        handleAnswer('correct');
        break;
      case 'pronunciation_complete':
        console.log('🎤 Pronunciation: Assessment completed', data);
        // Already handled by the mode's onPronunciationComplete callback
        break;
      case 'race_complete':
        console.log('🏁 Word Race: Race completed', data);
        // Already handled by the mode's onWordComplete callback
        break;
    }
  }, [gameState, handleAnswer, playPronunciation, onWordAttempt, nextWord]);

  // Render mode-specific component
  const renderModeComponent = () => {
    const modeConfig = getModeConfig(gameState.gameMode);

    if (!hasCustomComponent(gameState.gameMode)) {
      // Use default rendering for basic modes
      return renderDefaultMode();
    }

    const commonProps = {
      gameState,
      vocabulary: config.vocabulary,
      onAnswer: handleAnswer,
      onNext: nextWord,
      isAdventureMode,
      playPronunciation,
      onModeSpecificAction: handleModeSpecificAction
    };

    switch (gameState.gameMode) {
      case 'dictation':
        return (
          <DictationMode
            {...commonProps}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={() => handleAnswer(userAnswer)}
            canReplayAudio={gameState.audioReplayCount < 2}
            onReplayAudio={() => handleModeSpecificAction('replay_audio')}
            audioReplayCount={gameState.audioReplayCount}
          />
        );

      case 'listening':
        return (
          <ListeningMode
            {...commonProps}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={() => handleAnswer(userAnswer)}
            canReplayAudio={gameState.audioReplayCount < 2}
            onReplayAudio={() => handleModeSpecificAction('replay_audio')}
            audioReplayCount={gameState.audioReplayCount}
          />
        );

      case 'cloze':
        return (
          <ClozeMode
            {...commonProps}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={() => handleAnswer(userAnswer)}
          />
        );

      case 'match':
        return (
          <MatchingMode
            {...commonProps}
            onMatchComplete={(isCorrect, description) =>
              handleAnswer(isCorrect ? 'correct' : 'incorrect')
            }
          />
        );

      case 'speed':
        return (
          <SpeedMode
            {...commonProps}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={() => handleAnswer(userAnswer)}
            timeLeft={gameState.speedModeTimeLeft}
            onTimeUp={() => handleModeSpecificAction('time_up')}
          />
        );

      case 'story':
        return (
          <StoryAdventureMode
            {...commonProps}
            onStoryComplete={(isCorrect, chosenPath) => {
              handleAnswer(isCorrect ? 'correct' : 'incorrect');
            }}
          />
        );

      case 'learn':
        return (
          <LearnMode
            {...commonProps}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={() => handleAnswer(userAnswer)}
            showHint={gameState.showHint}
            onToggleHint={() => setGameState(prev => ({ ...prev, showHint: !prev.showHint }))}
          />
        );

      case 'recall':
        return (
          <RecallMode
            {...commonProps}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={() => handleAnswer(userAnswer)}
            streak={gameState.streak}
          />
        );

      case 'multiple_choice':
        return (
          <MultipleChoiceMode
            {...commonProps}
            onChoiceSelect={(choiceIndex: number) => {
              const selectedOption = gameState.multipleChoiceOptions[choiceIndex];
              if (selectedOption) {
                handleAnswer(selectedOption.text);
              }
            }}
            selectedChoice={null}
            showAnswer={gameState.showAnswer}
            isCorrect={gameState.isCorrect}
          />
        );

      case 'flashcards':
        return (
          <FlashcardsMode
            {...commonProps}
            onSelfAssessment={(isCorrect) => handleAnswer(isCorrect ? 'correct' : 'incorrect')}
            showAnswer={gameState.showAnswer}
          />
        );

      case 'mixed':
        return (
          <MixedMode
            {...commonProps}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={() => handleAnswer(userAnswer)}
            onChoiceSelect={(choiceIndex: number) => {
              const selectedOption = gameState.multipleChoiceOptions[choiceIndex];
              if (selectedOption) {
                handleAnswer(selectedOption.text);
              }
            }}
            selectedChoice={null}
            showAnswer={gameState.showAnswer}
            isCorrect={gameState.isCorrect}
            canReplayAudio={gameState.audioReplayCount < 2}
            onReplayAudio={() => handleModeSpecificAction('replay_audio')}
            audioReplayCount={gameState.audioReplayCount}
            timeLeft={gameState.speedModeTimeLeft}
            onTimeUp={() => handleModeSpecificAction('time_up')}
            showHint={gameState.showHint}
            onToggleHint={() => setGameState(prev => ({ ...prev, showHint: !prev.showHint }))}
          />
        );

      case 'word_builder':
        return (
          <WordBuilderMode
            {...commonProps}
            onLetterComplete={(isCorrect, letter) => {
              // Play audio feedback for individual letters
              if (config.audioEnabled) {
                if (isCorrect) {
                  audioFeedbackService.playCorrectSound();
                } else {
                  audioFeedbackService.playErrorSound();
                }
              }
            }}
          />
        );

      case 'pronunciation':
        return (
          <PronunciationMode
            {...commonProps}
            onPronunciationComplete={(isCorrect, attempt) => {
              handleAnswer(isCorrect ? 'correct' : 'incorrect');
            }}
          />
        );

      case 'word_race':
        return (
          <WordRaceMode
            {...commonProps}
            onWordComplete={(isCorrect, timeMs, word) => {
              handleAnswer(isCorrect ? 'correct' : 'incorrect');
            }}
          />
        );

      case 'memory_palace':
        return (
          <MemoryPalaceMode
            {...commonProps}
            onMemoryComplete={(isCorrect, memoryTechnique) => {
              handleAnswer(isCorrect ? 'correct' : 'incorrect');
            }}
          />
        );

      default:
        return renderDefaultMode();
    }
  };

  // Default mode rendering (for basic modes)
  const renderDefaultMode = () => {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">
          Default Mode: {gameState.gameMode}
        </h2>
        <p>This mode uses the original unified rendering.</p>
      </div>
    );
  };

  // Adventure mode layout
  if (isAdventureMode) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950">
        {/* Ethereal Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Cosmic particles */}
          <div className="absolute top-10 left-20 w-2 h-2 bg-cyan-300 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-32 right-32 w-1 h-1 bg-blue-300 rounded-full opacity-40 animate-ping"></div>
          <div className="absolute bottom-40 left-16 w-3 h-3 bg-cyan-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-40 w-2 h-2 bg-indigo-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '3s' }}></div>

          {/* Subtle nebula effects */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-purple-400/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-blue-400/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Minimal In-Game Header for Branding and Session Context */}
        <div className="relative z-10 flex items-center justify-between p-4 px-8"> {/* Adjusted padding */}
          {/* Left Side (Branding and Session Info) */}
          <div className="flex items-center space-x-6"> {/* Keep consistent spacing with right side */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-300/30">
                <Gem className="h-4 w-4 text-white animate-pulse" /> {/* Slightly smaller gem */}
              </div>
              <span className="text-white text-xl font-bold tracking-wide drop-shadow-lg">LanguageGems</span> {/* Slightly smaller text */}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white/90 text-lg font-medium">VocabMaster</span> {/* Slightly smaller text */}
              <div className="w-px h-5 bg-white/30"></div> {/* Slightly smaller separator */}
              <span className="text-white/80 text-base font-medium"> {/* Slightly smaller text */}
                Mode: {gameState.gameMode === 'multiple_choice' ? 'Multiple Choice' :
                  gameState.gameMode === 'dictation' ? 'Dictation' :
                    gameState.gameMode === 'listening' ? 'Listening' :
                      gameState.gameMode.charAt(0).toUpperCase() + gameState.gameMode.slice(1)}
              </span>
              <div className="w-px h-5 bg-white/30"></div> {/* Slightly smaller separator */}
              <span className="text-white/80 text-base font-medium"> {/* Slightly smaller text */}
                {gameState.currentWordIndex + 1} of {gameState.totalWords}
              </span>
            </div>
          </div>

          {/* Right Side - Settings and Dashboard buttons */}
          <div className="flex items-center gap-3">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="relative px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm md:text-base font-semibold flex items-center gap-2 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
                title="Customize your game: Change Language, Level, Topic & Theme"
              >
                <Settings className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden md:inline">Game Settings</span>
                <span className="md:hidden">Settings</span>
              </button>
            )}
            <button
              onClick={onExit}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-cyan-500/30 border border-cyan-400/30 text-base"
            >
              Dashboard
            </button>
          </div>
        </div>

        <div className="relative z-10 flex gap-8 px-8 pb-8">
          {/* Left Sidebar - Enhanced Gem Collection */}
          <div className="w-72 bg-blue-900/40 backdrop-blur-xl rounded-3xl p-6 border border-blue-700/30 shadow-2xl shadow-blue-500/20 shadow-inner">
            <div className="text-center h-full flex flex-col">
              {/* XP Gain Display - Fixed above gem */}
              <div className="h-12 flex items-center justify-center mb-2">
                {showXPGain && (
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-xl font-bold text-lg shadow-lg border border-cyan-300 animate-bounce">
                    +{xpGained} XP
                  </div>
                )}
              </div>

              {/* Massive Gem Display - Takes up most of the space */}
              <div className="flex-1 flex items-center justify-center relative mb-4">
                <div className="w-48 h-40 mx-auto relative">
                  {/* Beautiful SVG Gem */}
                  <div className="w-full h-full flex items-center justify-center relative">
                    <svg
                      width="200"
                      height="200"
                      viewBox="0 0 140 140"
                      className={`transition-all duration-500 ${gameState.currentGemType === 'legendary' ? 'animate-pulse' : ''} ${gameState.isCorrect === true ? 'animate-pulse' : ''}`}
                      style={{
                        filter: `drop-shadow(0 0 20px ${gameState.currentGemType === 'common' ? 'rgba(148, 163, 184, 0.6)' :
                          gameState.currentGemType === 'uncommon' ? 'rgba(52, 211, 153, 0.6)' :
                            gameState.currentGemType === 'rare' ? 'rgba(96, 165, 250, 0.6)' :
                              gameState.currentGemType === 'epic' ? 'rgba(168, 85, 247, 0.6)' :
                                'rgba(251, 191, 36, 0.8)'
                          })`
                      }}
                    >
                      <defs>
                        {/* Gradients for each gem type */}
                        {/* Main body gradient - Blue spectrum progression */}
                        <linearGradient id={`gemGradient-${gameState.currentGemType}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          {gameState.currentGemType === 'common' ? (
                            <>
                              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                              <stop offset="50%" style={{ stopColor: '#1E40AF', stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: '#1E3A8A', stopOpacity: 1 }} />
                            </>
                          ) : gameState.currentGemType === 'uncommon' ? (
                            <>
                              <stop offset="0%" style={{ stopColor: '#0EA5E9', stopOpacity: 1 }} />
                              <stop offset="50%" style={{ stopColor: '#0284C7', stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: '#0369A1', stopOpacity: 1 }} />
                            </>
                          ) : gameState.currentGemType === 'rare' ? (
                            <>
                              <stop offset="0%" style={{ stopColor: '#22D3EE', stopOpacity: 1 }} />
                              <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
                            </>
                          ) : gameState.currentGemType === 'epic' ? (
                            <>
                              <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
                              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
                            </>
                          ) : (
                            <>
                              <stop offset="0%" style={{ stopColor: '#F0ABFC', stopOpacity: 1 }} />
                              <stop offset="50%" style={{ stopColor: '#E879F9', stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: '#D946EF', stopOpacity: 1 }} />
                            </>
                          )}
                        </linearGradient>

                        {/* Highlight gradient */}
                        <radialGradient id={`gemHighlight-${gameState.currentGemType}`} cx="30%" cy="30%" r="40%">
                          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
                          <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                        </radialGradient>

                        {/* Inner shadow */}
                        <radialGradient id={`gemShadow-${gameState.currentGemType}`} cx="70%" cy="70%" r="60%">
                          <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0 }} />
                          <stop offset="70%" style={{ stopColor: '#000000', stopOpacity: 0.1 }} />
                          <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.3 }} />
                        </radialGradient>

                        {/* Top table - very bright, almost white */}
                        <linearGradient id={`topTable-${gameState.currentGemType}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
                          <stop offset="100%" style={{ stopColor: '#67E8F9', stopOpacity: 0.7 }} />
                        </linearGradient>

                        {/* Left bright facet - this is where the main highlight is */}
                        <linearGradient id={`leftBrightFacet-${gameState.currentGemType}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
                          <stop offset="100%" style={{ stopColor: '#67E8F9', stopOpacity: 0.9 }} />
                        </linearGradient>

                        {/* Right dark facet - shadow side, much darker */}
                        <linearGradient id={`rightDarkFacet-${gameState.currentGemType}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#0E7490', stopOpacity: 1 }} />
                        </linearGradient>

                        {/* Bottom left facet */}
                        <linearGradient id={`bottomLeftFacet-${gameState.currentGemType}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
                        </linearGradient>

                        {/* Bottom right facet - darkest */}
                        <linearGradient id={`bottomRightFacet-${gameState.currentGemType}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#0E7490', stopOpacity: 1 }} />
                        </linearGradient>

                        {/* Soft highlight gradient - blends with gem color */}
                        <radialGradient id={`softHighlight-${gameState.currentGemType}`} cx="50%" cy="30%" r="70%">
                          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.7 }} />
                          <stop offset="40%" style={{ stopColor: '#67E8F9', stopOpacity: 0.4 }} />
                          <stop offset="100%" style={{ stopColor: '#67E8F9', stopOpacity: 0.1 }} />
                        </radialGradient>
                      </defs>

                      {/* Main gem body - Classic diamond cut matching reference - MUCH LARGER */}
                      <path
                        d="M70 15 L115 40 L110 85 L70 120 L30 85 L25 40 Z"
                        fill={`url(#gemGradient-${gameState.currentGemType})`}
                        stroke="none"
                      />

                      {/* Top table (flat top surface) - LARGER */}
                      <path
                        d="M50 30 L90 30 L95 40 L45 40 Z"
                        fill={`url(#topTable-${gameState.currentGemType})`}
                      />

                      {/* Left bright facet (where the highlight is) - LARGER */}
                      <path
                        d="M25 40 L45 40 L35 85 L30 85 Z"
                        fill={`url(#leftBrightFacet-${gameState.currentGemType})`}
                      />

                      {/* Right dark facet (shadow side) - LARGER */}
                      <path
                        d="M95 40 L115 40 L110 85 L90 85 Z"
                        fill={`url(#rightDarkFacet-${gameState.currentGemType})`}
                      />

                      {/* Bottom left facet - LARGER */}
                      <path
                        d="M30 85 L35 85 L70 120 Z"
                        fill={`url(#bottomLeftFacet-${gameState.currentGemType})`}
                      />

                      {/* Bottom right facet - LARGER */}
                      <path
                        d="M90 85 L110 85 L70 120 Z"
                        fill={`url(#bottomRightFacet-${gameState.currentGemType})`}
                      />



                      {/* Main highlight - softer, more integrated */}
                      <ellipse
                        cx="38" cy="60"
                        rx="8" ry="15"
                        fill={`url(#softHighlight-${gameState.currentGemType})`}
                        className="animate-pulse"
                      />
                    </svg>

                    {/* Enhanced Magical Sparkles - Many more sparkles for constant magic */}
                    {/* Regular sparkles - always present */}
                    <div className="absolute top-6 right-16 animate-pulse" style={{ animationDelay: '0s' }}>
                      <div className="relative w-4 h-4">
                        <div className="absolute inset-0 bg-white opacity-90" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                        <div className="absolute inset-0 bg-cyan-200 opacity-70 scale-75" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>
                    <div className="absolute bottom-10 left-14 animate-ping" style={{ animationDelay: '1s' }}>
                      <div className="relative w-3 h-3">
                        <div className="absolute inset-0 bg-white opacity-80" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                        <div className="absolute inset-0 bg-blue-200 opacity-60 scale-75" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>
                    <div className="absolute top-1/2 right-8 animate-pulse" style={{ animationDelay: '2s' }}>
                      <div className="relative w-2 h-2">
                        <div className="absolute inset-0 bg-cyan-100 opacity-90" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>
                    <div className="absolute top-1/4 left-10 animate-ping" style={{ animationDelay: '0.5s' }}>
                      <div className="relative w-2 h-2">
                        <div className="absolute inset-0 bg-white opacity-75" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>

                    {/* Additional regular sparkles for more magic */}
                    <div className="absolute top-8 left-8 animate-pulse" style={{ animationDelay: '1.5s' }}>
                      <div className="relative w-3 h-3">
                        <div className="absolute inset-0 bg-cyan-300 opacity-85" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 right-12 animate-ping" style={{ animationDelay: '2.5s' }}>
                      <div className="relative w-2 h-2">
                        <div className="absolute inset-0 bg-blue-100 opacity-80" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>
                    <div className="absolute top-3/4 left-6 animate-pulse" style={{ animationDelay: '3s' }}>
                      <div className="relative w-2 h-2">
                        <div className="absolute inset-0 bg-white opacity-70" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>
                    <div className="absolute top-12 right-6 animate-ping" style={{ animationDelay: '0.8s' }}>
                      <div className="relative w-1.5 h-1.5">
                        <div className="absolute inset-0 bg-cyan-200 opacity-90" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-12 animate-pulse" style={{ animationDelay: '1.8s' }}>
                      <div className="relative w-2.5 h-2.5">
                        <div className="absolute inset-0 bg-blue-200 opacity-75" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                      </div>
                    </div>

                    {/* SUPER SPARKLY ANIMATION - Only when answer is correct */}
                    {gameState.isCorrect === true && (
                      <>
                        {/* Burst of large sparkles */}
                        <div className="absolute top-4 right-20 animate-ping">
                          <div className="relative w-6 h-6">
                            <div className="absolute inset-0 bg-yellow-200 opacity-95" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                            <div className="absolute inset-0 bg-white opacity-80 scale-75" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-20 animate-ping" style={{ animationDelay: '0.2s' }}>
                          <div className="relative w-5 h-5">
                            <div className="absolute inset-0 bg-cyan-100 opacity-95" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute top-1/3 left-4 animate-ping" style={{ animationDelay: '0.4s' }}>
                          <div className="relative w-4 h-4">
                            <div className="absolute inset-0 bg-white opacity-100" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute top-2/3 right-4 animate-ping" style={{ animationDelay: '0.6s' }}>
                          <div className="relative w-5 h-5">
                            <div className="absolute inset-0 bg-yellow-100 opacity-95" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute top-1/2 left-2 animate-ping" style={{ animationDelay: '0.8s' }}>
                          <div className="relative w-3 h-3">
                            <div className="absolute inset-0 bg-cyan-200 opacity-100" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute bottom-1/3 right-2 animate-ping" style={{ animationDelay: '1s' }}>
                          <div className="relative w-4 h-4">
                            <div className="absolute inset-0 bg-white opacity-100" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>

                        {/* Extra magical sparkles around the edges */}
                        <div className="absolute -top-2 left-1/2 animate-ping" style={{ animationDelay: '0.3s' }}>
                          <div className="relative w-3 h-3">
                            <div className="absolute inset-0 bg-yellow-300 opacity-90" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 animate-ping" style={{ animationDelay: '0.7s' }}>
                          <div className="relative w-3 h-3">
                            <div className="absolute inset-0 bg-cyan-300 opacity-90" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute top-1/2 -left-2 animate-ping" style={{ animationDelay: '0.5s' }}>
                          <div className="relative w-3 h-3">
                            <div className="absolute inset-0 bg-white opacity-95" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                        <div className="absolute top-1/2 -right-2 animate-ping" style={{ animationDelay: '0.9s' }}>
                          <div className="relative w-3 h-3">
                            <div className="absolute inset-0 bg-blue-100 opacity-95" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Enhanced outer glow effects */}
                  <div className={`absolute inset-0 blur-xl scale-110 transition-all duration-500 rounded-full pointer-events-none ${gameState.isCorrect === true ? 'opacity-80 bg-yellow-400/80 animate-pulse' : 'opacity-50 bg-cyan-400/60'}`}></div>
                  <div className={`absolute inset-0 blur-2xl scale-125 transition-all duration-500 rounded-full pointer-events-none ${gameState.isCorrect === true ? 'opacity-60 bg-cyan-200/70 animate-pulse' : 'opacity-30 bg-cyan-300/50'}`}></div>

                  {/* Super glow when correct */}
                  {gameState.isCorrect === true && (
                    <>
                      <div className="absolute inset-0 blur-3xl scale-150 opacity-40 bg-white/60 rounded-full pointer-events-none animate-pulse"></div>
                      <div className="absolute inset-0 blur-xl scale-140 opacity-50 bg-yellow-300/70 rounded-full pointer-events-none animate-ping"></div>
                    </>
                  )}
                </div>
              </div>

              {/* Compact gem info at bottom - same as before */}
              <div className="space-y-3">
                <h3 className="text-blue-50 text-xl font-bold drop-shadow-lg transition-colors duration-500">
                  {gameState.currentGemType.charAt(0).toUpperCase() + gameState.currentGemType.slice(1)} Gem
                </h3>

                <div className="bg-blue-700/20 border-blue-600/30 rounded-2xl p-3 border transition-colors duration-500">
                  <p className="text-blue-100 text-lg font-semibold transition-colors duration-500">
                    Worth {GEM_TYPES[gameState.currentGemType]?.points || 10} XP
                  </p>
                </div>

                {/* Compact gem collection progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Gems Collected</span>
                    <span className="font-bold">{gameState.gemsCollected}</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${Math.min((gameState.gemsCollected / gameState.totalWords) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 space-y-8">
            {/* Spanish Word Card - Blue Gradient Theme */}
            <div className="relative bg-blue-900/40 backdrop-blur-xl rounded-3xl p-12 text-center border border-blue-700/30 shadow-2xl">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 via-blue-400/10 to-transparent rounded-3xl"></div>

              <div className="relative z-10">
                <h1 className="text-blue-50 text-7xl font-bold mb-8 drop-shadow-2xl tracking-wide">
                  {gameState.currentWord?.spanish || gameState.currentWord?.word}
                </h1>

                {/* Enhanced Audio Button */}
                {gameState.currentWord?.audio_url && (
                  <button
                    onClick={() => gameState.currentWord && playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord)}
                    disabled={gameState.audioPlaying}
                    className="bg-blue-400/30 hover:bg-blue-400/40 text-white p-6 rounded-full transition-all duration-300 border border-blue-300/40 shadow-lg backdrop-blur-sm group"
                  >
                    <Volume2 className={`h-10 w-10 ${gameState.audioPlaying ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                  </button>
                )}
              </div>
            </div>

            {/* Input Area - Blue Gradient Theme */}
            <div className="relative bg-blue-900/40 backdrop-blur-xl rounded-3xl p-8 border border-blue-700/30 shadow-2xl">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 via-blue-400/10 to-transparent rounded-3xl"></div>

              <div className="relative z-10">
                <h2 className="text-blue-100 text-2xl font-bold mb-6 drop-shadow-lg">
                  Type the English translation:
                </h2>

                <div className="space-y-6">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && userAnswer.trim() && handleAnswer(userAnswer)}
                    placeholder="Type your answer..."
                    className="w-full p-6 rounded-2xl bg-blue-400/20 text-white placeholder-white/60 border border-blue-300/40 focus:border-blue-200/60 focus:outline-none text-xl backdrop-blur-sm shadow-inner transition-all duration-300 focus:shadow-lg focus:shadow-blue-400/30"
                    autoFocus
                  />

                  <div className="flex gap-6">
                    <button
                      onClick={() => handleAnswer(userAnswer)}
                      disabled={!userAnswer.trim()}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-700/50 disabled:to-gray-700/50 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-cyan-500/30 border border-cyan-400/30 transform hover:scale-105 disabled:hover:scale-100 disabled:text-gray-400"
                    >
                      Submit Answer
                    </button>

                    <button
                      onClick={() => setGameState(prev => ({ ...prev, showHint: !prev.showHint }))}
                      className="bg-blue-400/30 hover:bg-blue-400/40 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 border border-blue-300/40 backdrop-blur-sm shadow-lg hover:shadow-blue-400/30 flex items-center space-x-2"
                    >
                      <Lightbulb className="h-5 w-5" />
                      <span>Show Hint</span>
                    </button>
                  </div>

                  {/* Enhanced Hint Display */}
                  {gameState.showHint && (
                    <div className="bg-blue-700/30 border border-blue-500/40 rounded-2xl p-6 backdrop-blur-sm">
                      <p className="text-blue-100 text-lg font-medium flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-cyan-400" />
                        <span>Hint: <span className="font-bold text-cyan-200">{gameState.currentWord?.english?.charAt(0).toUpperCase()}</span>
                          <span className="text-cyan-300/60">{'_'.repeat((gameState.currentWord?.english?.length || 1) - 1)}</span></span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Enhanced Feedback & Performance */}
          <div className="w-64 space-y-6">


            {/* Performance Stats Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-4 text-center drop-shadow-lg">
                Performance
              </h3>

              <div className="space-y-4">
                {/* Streak */}
                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 border border-cyan-400/30">
                  <div className="flex items-center space-x-3">
                    <Flame className="h-6 w-6 text-cyan-400 drop-shadow-lg animate-pulse" />
                    <span className="text-white/80 font-medium">Streak</span>
                  </div>
                  <span className="text-white font-bold text-2xl drop-shadow-lg">{gameState.streak}</span>
                </div>

                {/* Accuracy */}
                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 border border-blue-400/30">
                  <div className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-blue-400 drop-shadow-lg" />
                    <span className="text-white/80 font-medium">Accuracy</span>
                  </div>
                  <span className="text-white font-bold text-xl drop-shadow-lg">
                    {gameState.totalWords > 0 ? Math.round((gameState.correctAnswers / (gameState.currentWordIndex + 1)) * 100) : 0}%
                  </span>
                </div>

                {/* XP Progress */}
                <div className="bg-white/10 rounded-2xl p-4 border border-cyan-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="h-5 w-5 text-cyan-400" />
                    <span className="text-white font-bold">{totalXP} XP</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(totalXP % 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-white/60 text-xs mt-1">
                    Level {currentLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* Session Progress */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
              <h4 className="text-white font-bold text-center mb-4 drop-shadow-lg">Session Progress</h4>

              <div className="space-y-3">
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
                  ></div>
                </div>

                <div className="text-center text-white/80 text-lg font-medium">
                  {Math.round(((gameState.currentWordIndex + 1) / gameState.totalWords) * 100)}% Complete
                </div>

                <div className="text-center text-white/60 text-sm">
                  {gameState.totalWords - (gameState.currentWordIndex + 1)} words remaining
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Animations */}
        <GemCollectionAnimation
          gemType={collectedGemType}
          points={gemPoints}
          show={showGemAnimation}
          upgraded={gemUpgraded}
          onComplete={() => setShowGemAnimation(false)}
        />



        <AchievementNotification
          achievement={currentAchievement}
          show={showAchievement}
          onComplete={() => {
            setShowAchievement(false);
            setCurrentAchievement(null);
          }}
        />
      </div>
    );
  }

  // Regular mode layout
  return (
    <div className="min-h-screen">
      {renderModeComponent()}



      {/* Game progress */}
      <div className="fixed bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg">
        {gameState.currentWordIndex + 1} / {gameState.totalWords}
      </div>
    </div>
  );
};