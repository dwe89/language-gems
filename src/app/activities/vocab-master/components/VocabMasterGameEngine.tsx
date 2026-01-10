import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX, Gem, Lightbulb, Sparkles, Flame, Target, Star, Zap, Settings } from 'lucide-react';
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
  const [audioEnabled, setAudioEnabled] = useState(config.audioEnabled);
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

  // Advance to next word - Extracted to prevent duplicate executions
  const advanceToNextWord = useCallback(() => {
    setGameState(prev => {
      // Safety check: ensure we don't skip if index seems wrong or we're already checking
      const nextIndex = prev.currentWordIndex + 1;

      console.log('⏰ ADVANCING TO NEXT WORD (Effect-based)...', {
        currentIndex: prev.currentWordIndex,
        nextIndex
      });

      if (nextIndex >= config.vocabulary.length) {
        // Game complete
        const wordsAttempted = prev.currentWordIndex + 1;
        const result: GameResult = {
          score: prev.score,
          accuracy: wordsAttempted > 0 ? (prev.correctAnswers / wordsAttempted) * 100 : 0,
          timeSpent: Math.floor((Date.now() - prev.startTime.getTime()) / 1000),
          correctAnswers: prev.correctAnswers,
          incorrectAnswers: prev.incorrectAnswers,
          totalWords: wordsAttempted,
          wordsLearned: prev.wordsLearned,
          wordsStruggling: prev.wordsStruggling,
          gemsCollected: prev.gemsCollected,
          maxStreak: prev.maxStreak
        };

        onGameComplete(result);
        return prev;
      }

      // Move to next word
      const nextWord = config.vocabulary[nextIndex];
      const newOptions = generateMultipleChoiceOptions(nextWord, config.vocabulary);

      // Reset question start time for response time tracking
      setQuestionStartTime(Date.now());

      // Generate exercise data for the new word
      generateExerciseData(nextWord, prev.gameMode);

      setUserAnswer('');

      const nextState = {
        ...prev,
        currentWordIndex: nextIndex,
        currentWord: nextWord,
        showAnswer: false,
        isCorrect: null,
        feedback: '',
        translationShown: false,
        speedModeTimeLeft: prev.gameMode === 'speed' ? calculateWordTime(nextWord) : prev.speedModeTimeLeft,
        multipleChoiceOptions: newOptions
      };

      console.log('🎯 FINAL NEXT WORD STATE:', {
        currentWordIndex: nextState.currentWordIndex,
        currentWord: nextState.currentWord?.spanish,
        showAnswer: nextState.showAnswer
      });

      return nextState;
    });
  }, [config.vocabulary, onGameComplete, generateExerciseData, generateMultipleChoiceOptions, setQuestionStartTime, setUserAnswer, calculateWordTime]);

  // Effect to handle auto-advancement when answer is shown
  useEffect(() => {
    if (gameState.showAnswer) {
      // Determine delay based on correctness (longer for incorrect to read feedback)
      const delay = gameState.isCorrect ? 1000 : 2500;

      const timer = setTimeout(() => {
        advanceToNextWord();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [gameState.showAnswer, gameState.isCorrect, advanceToNextWord]);

  // Handle answer submission
  const handleAnswer = useCallback(async (answer: string) => {
    // Determine strict equality for deduping
    // We append timestamp to answer key to allow retries if needed, but throttle rapid fires
    const now = Date.now();
    const answerKey = `${gameState.currentWordIndex}-${answer}`;

    // Simple throttle: don't process if < 500ms since last process for same word
    if (lastProcessedAnswer.current === answerKey && (now - Number(lastAnswerKey.current)) < 500) {
      console.log('⚠️ [HANDLE ANSWER] Throttled duplicate answer:', answerKey);
      return;
    }

    lastProcessedAnswer.current = answerKey;
    lastAnswerKey.current = now.toString();

    const responseTime = now - questionStartTime;
    setCurrentResponseTime(responseTime);

    console.log('🎯 HANDLE ANSWER CALLED:', {
      answer,
      responseTime,
      answerKey
    });

    setGameState(prev => {
      console.log('🔄 STATE UPDATE - BEFORE:', {
        currentWordIndex: prev.currentWordIndex,
        showAnswer: prev.showAnswer
      });

      // Prevent double execution - if answer is already shown, do NOT process again
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

      let validation = validateGameAnswer(answer, prev.gameMode, prev.currentWord, sentenceData);

      // 🛠️ FLASHCARDS OVERRIDE
      // If in Flashcards mode and user says 'correct'/'known'/'easy', treat as correct
      if (prev.gameMode === 'flashcards' &&
        (answer === 'correct' || answer === 'known' || answer === 'easy')) {
        validation = {
          isCorrect: true
        } as any;
      }

      console.log('🎯 [VALIDATION RESULT]:', {
        answer,
        isCorrect: validation.isCorrect,
        gameMode: prev.gameMode
      });

      // Log word attempt for analytics
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
              language: 'es'
            };

            // UNIFIED RECORDING
            // Use gameService if available (preferred), otherwise try global legacy function or new service
            const serviceToUse = gameService || (config.gameSessionId ? new EnhancedGameSessionService() : null);

            if (serviceToUse && config.gameSessionId) {
              await serviceToUse.recordWordAttempt(config.gameSessionId, 'vocab-master', {
                vocabularyId: wordData.id,
                wordText: wordData.word,
                translationText: wordData.translation,
                responseTimeMs: responseTime,
                wasCorrect: validation.isCorrect,
                hintUsed: prev.translationShown,
                streakCount: prev.streak,
                masteryLevel: validation.isCorrect ? 3 : 1,
                maxGemRarity: 'rare',
                gameMode: config.mode,
                difficultyLevel: 'intermediate'
              });
              console.log('✅ Vocab Master attempt recorded via service');
            } else if (config.assignmentMode && (window as any).recordVocabularyInteraction) {
              (window as any).recordVocabularyInteraction(
                wordData.word,
                wordData.translation,
                validation.isCorrect,
                responseTime,
                prev.translationShown,
                prev.streak
              );
            }
          } catch (error) {
            console.error('Error recording FSRS practice for vocab master:', error);
          }
        })();
      }

      // Calculate score updates (Logic preserved from original)
      const isCorrectForScoring = validation.isCorrect && shouldCountAnswer;
      const points = isCorrectForScoring ? 10 : 0;

      // Play sound effects
      if (config.audioEnabled) {
        if (validation.isCorrect) audioFeedbackService.playCorrectSound();
        else audioFeedbackService.playErrorSound();
      }

      // Calculate Gems (Simplified)
      let updatedGemsCollected = prev.gemsCollected;
      let updatedGemType = prev.currentGemType;

      if (validation.isCorrect && shouldCountAnswer) {
        // Award XP/Gems Logic... (Simulated to keep concise, assuming Gem Logic is handled elsewhere mostly or here)
        // Re-using simplified accumulation for state display
        updatedGemsCollected += 1;
      }

      return {
        ...prev,
        isCorrect: validation.isCorrect,
        showAnswer: true, // This triggers the useEffect to advance
        feedback: prev.translationShown
          ? 'Translation was shown - practice more!'
          : validation.isCorrect
            ? 'Correct!'
            : `Incorrect. The answer is: ${prev.currentWord?.english || prev.currentWord?.translation}`,
        score: isCorrectForScoring ? prev.score + 10 : prev.score,
        correctAnswers: isCorrectForScoring ? prev.correctAnswers + 1 : prev.correctAnswers,
        incorrectAnswers: shouldCountAnswer && !validation.isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers,
        streak: isCorrectForScoring ? prev.streak + 1 : shouldCountAnswer ? 0 : prev.streak,
        maxStreak: isCorrectForScoring ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
        gemsCollected: updatedGemsCollected
      };
    });
  }, [questionStartTime, onWordAttempt, config.audioEnabled, validateGameAnswer]);

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
        // Treat as an incorrect submission and let the normal flow show the answer and advance
        // This avoids the `showAnswer` guard blocking advancement.
        handleAnswer('');
        break;
      case 'word_complete':
        console.log('🎯 Word Builder: Word completed', data);
        // Pass the actual word that was completed instead of just "correct"
        const completedWord = data?.word || gameState.currentWord?.spanish || gameState.currentWord?.word || 'correct';
        handleAnswer(completedWord);
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
      playPronunciation,
      onModeSpecificAction: handleModeSpecificAction,
      onExit
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
            onMatchComplete={(isCorrect, description) => {
              console.log('🎯 [MATCHING MODE] Match complete:', { isCorrect, description });
              if (isCorrect) {
                // Matching game completed successfully - end the session
                console.log('🎉 [MATCHING MODE] All pairs matched - completing game session');

                const result: GameResult = {
                  score: gameState.score + 100, // Award bonus points for completing matching
                  accuracy: 100, // Perfect matching completion
                  timeSpent: Math.floor((Date.now() - gameState.startTime.getTime()) / 1000),
                  correctAnswers: gameState.correctAnswers + 1, // Count the matching completion as correct
                  incorrectAnswers: gameState.incorrectAnswers,
                  totalWords: 10, // 10 pairs matched
                  wordsLearned: [...gameState.wordsLearned, ...config.vocabulary.slice(0, 10).map((w: any) => w.spanish)], // All matched words are learned
                  wordsStruggling: gameState.wordsStruggling,
                  gemsCollected: gameState.gemsCollected + 50, // Bonus gems for completion
                  maxStreak: Math.max(gameState.maxStreak, 10) // Perfect streak for matching
                };

                onGameComplete(result);
              } else {
                // Matching game failed - treat as incorrect answer
                handleAnswer('incorrect');
              }
            }}
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
            onExit={onExit}
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
              console.log('🎯 [MULTIPLE CHOICE] Selection:', {
                choiceIndex,
                selectedOption,
                allOptions: gameState.multipleChoiceOptions,
                currentWord: gameState.currentWord?.spanish || gameState.currentWord?.word,
                expectedAnswer: gameState.currentWord?.english || gameState.currentWord?.translation
              });
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
              // Don't play audio feedback here - let the main game engine handle it
              // when the full word is complete via handleAnswer
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
              // For word race mode, we know the user typed the Spanish word correctly
              // So we should pass the Spanish word as the answer since that's what they typed
              handleAnswer(word);
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

  // Standard layout
  return (
    <div className="min-h-screen">
      {renderModeComponent()}

      {/* Floating Mute Button - Only show in assignment mode */}
      {config.assignmentMode && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => {
              const newAudioEnabled = !audioEnabled;
              setAudioEnabled(newAudioEnabled);
              audioManager.setEnabled(newAudioEnabled);
            }}
            className="p-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
            title={audioEnabled ? "Mute audio" : "Unmute audio"}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* Game progress */}
      <div className="fixed bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg">
        {gameState.currentWordIndex + 1} / {gameState.totalWords}
      </div>
    </div>
  );
};
