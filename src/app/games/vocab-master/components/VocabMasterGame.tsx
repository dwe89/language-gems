'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useUnifiedAuth } from '../../../../hooks/useUnifiedAuth';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { SpacedRepetitionService, REVIEW_QUALITY } from '../../../../services/spacedRepetitionService';
import { 
  Home, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw,
  Volume2, Eye, EyeOff, Clock, Star, Brain, Target,
  Zap, TrendingUp, Award, ChevronRight, Headphones, 
  BookOpen, PenTool, Lightbulb, VolumeX, Play, Pause,
  Keyboard, ToggleLeft, ToggleRight
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

interface VocabularyWord {
  id: string | number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
  part_of_speech: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  // User progress tracking
  times_seen?: number;
  times_correct?: number;
  last_seen?: Date;
  is_learned?: boolean;
  mastery_level?: number;
  difficulty_rating?: number;
}

interface GameState {
  currentWordIndex: number;
  currentWord: VocabularyWord | null;
  userAnswer: string;
  selectedChoice: number | null;
  showAnswer: boolean;
  isCorrect: boolean | null;
  score: number;
  totalWords: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  maxStreak: number;
  gameMode: 'learn' | 'recall' | 'speed' | 'multiple_choice' | 'listening' | 'cloze' | 'typing';
  timeSpent: number;
  startTime: Date;
  wordsLearned: string[];
  wordsStruggling: string[];
  feedback: string;
  audioPlaying: boolean;
  canReplayAudio: boolean;
  audioReplayCount: number;
  // Keep some Gem Collector styling elements
  isAnswerRevealed: boolean;
}

interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

interface Props {
  mode: string;
  vocabulary: VocabularyWord[];
  config?: Record<string, any>;
  onComplete?: (results: any) => void;
  onExit?: () => void;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function VocabMasterGame({
  mode,
  vocabulary,
  config = {},
  onComplete,
  onExit
}: Props) {
  const { user } = useAuth();
  const { user: unifiedUser, isDemo } = useUnifiedAuth();
  const { supabase } = useSupabase();
  const spacedRepetitionService = new SpacedRepetitionService(supabase);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State
  const [gameState, setGameState] = useState<GameState>({
    currentWordIndex: 0,
    currentWord: null,
    userAnswer: '',
    selectedChoice: null,
    showAnswer: false,
    isCorrect: null,
    score: 0,
    totalWords: vocabulary.length,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    maxStreak: 0,
    gameMode: 'learn',
    timeSpent: 0,
    startTime: new Date(),
    wordsLearned: [],
    wordsStruggling: [],
    feedback: '',
    audioPlaying: false,
    canReplayAudio: true,
    audioReplayCount: 0,
    isAnswerRevealed: false
  });

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<MultipleChoiceOption[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [accentWarning, setAccentWarning] = useState(false);
  const [clozeExercise, setClozeExercise] = useState<{
    sentence: string;
    blankedSentence: string;
    correctAnswer: string;
    position: number;
  } | null>(null);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    if (vocabulary.length > 0) {
      initializeGame();
    }
  }, [vocabulary]);

  useEffect(() => {
    // Update timer every second
    timerRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeSpent: Math.floor((new Date().getTime() - prev.startTime.getTime()) / 1000)
      }));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Clean up audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      // No need to cancel speechSynthesis since we're not using it
    };
  }, []);

  const initializeGame = () => {
    if (!vocabulary || vocabulary.length === 0) {
      console.error('No vocabulary provided to VocabMaster game');
      return;
    }

    const shuffledVocab = [...vocabulary].sort(() => Math.random() - 0.5);
    const firstWord = { ...shuffledVocab[0], startTime: Date.now() };
    
    // Validate first word
    if (!firstWord || !firstWord.spanish || !firstWord.english) {
      console.error('Invalid first word:', firstWord);
      return;
    }
    
    const selectedGameMode = determineGameMode(mode);
    
    setGameState(prev => ({
      ...prev,
      currentWord: firstWord,
      gameMode: selectedGameMode,
      totalWords: shuffledVocab.length,
      audioPlaying: false,
      canReplayAudio: true,
      audioReplayCount: 0
    }));

    if (mode === 'spaced_repetition' || mode === 'review_weak') {
      loadUserProgress(firstWord);
    }

    // Initialize exercise content based on game mode
    if (selectedGameMode === 'cloze' && firstWord.example_sentence) {
      generateClozeExercise(firstWord);
    } else {
      generateMultipleChoice(firstWord, shuffledVocab);
    }
    
    // Auto-play audio for listening mode and learn mode (but not typing mode)
    if (selectedGameMode === 'listening') {
      setTimeout(() => playPronunciation(firstWord.spanish || '', 'es', firstWord), 1000);
    } else if (selectedGameMode === 'learn') {
      setTimeout(() => playPronunciation(firstWord.spanish || '', 'es', firstWord), 2000); // Slower for learn mode
    }
    
    setShowTranslation(false);
    focusInput();
  };

  const determineGameMode = (mode: string): GameState['gameMode'] => {
    switch (mode) {
      case 'speed_review':
        return 'speed';
      case 'learn_new':
        return Math.random() > 0.7 ? 'cloze' : Math.random() > 0.5 ? 'typing' : 'learn'; // Mix learning modes
      case 'review_weak':
      case 'spaced_repetition':
        // For review modes, use variety of exercise types
        const reviewModes: GameState['gameMode'][] = ['recall', 'listening', 'multiple_choice', 'cloze', 'typing'];
        return reviewModes[Math.floor(Math.random() * reviewModes.length)];
      case 'listening_practice':
        return 'listening';
      case 'context_practice':
        return 'cloze';
      default:
        return Math.random() > 0.5 ? 'multiple_choice' : 'typing';
    }
  };

  const loadUserProgress = async (word: VocabularyWord) => {
    if (!user || isDemo) return;

    try {
      // For now, skip loading user progress since the table structure doesn't match
      // TODO: Create a proper mapping between centralized_vocabulary and user_vocabulary_progress
      console.log('Skipping user progress loading for word:', word.spanish);
    } catch (error) {
      console.log('No existing progress for word:', word.spanish);
    }
  };

  const generateMultipleChoice = (currentWord: VocabularyWord, allWords: VocabularyWord[]) => {
    if (!currentWord || !currentWord.english) {
      console.warn('Invalid current word for multiple choice:', currentWord);
      return;
    }

    const incorrectOptions = allWords
      .filter(w => w.id !== currentWord.id && w.english && w.english !== currentWord.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Ensure we have enough incorrect options
    if (incorrectOptions.length < 3) {
      console.warn('Not enough vocabulary words for multiple choice. Need at least 4 words.');
      // Fallback to typing mode if not enough options
      setGameState(prev => ({ ...prev, gameMode: 'typing' }));
      return;
    }

    const options: MultipleChoiceOption[] = [
      { text: currentWord.english.split(',')[0].trim(), isCorrect: true },
      ...incorrectOptions.map(w => ({ text: w.english.split(',')[0].trim(), isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    setMultipleChoiceOptions(options);
  };

  const generateClozeExercise = (currentWord: VocabularyWord) => {
    if (!currentWord.example_sentence || !currentWord.spanish) {
      // Fallback to regular exercise if no example sentence
      setGameState(prev => ({ ...prev, gameMode: 'learn' }));
      return;
    }

    const sentence = currentWord.example_sentence;
    const targetWord = currentWord.spanish;
    const wordIndex = sentence.toLowerCase().indexOf(targetWord.toLowerCase());
    
    if (wordIndex === -1) {
      // Word not found in sentence, create a simple sentence
      const simpleSentence = `Esta es una ${targetWord}.`;
      const blankedSentence = simpleSentence.replace(targetWord, '_____');
      setClozeExercise({
        sentence: simpleSentence,
        blankedSentence,
        correctAnswer: targetWord,
        position: wordIndex
      });
    } else {
      const blankedSentence = sentence.substring(0, wordIndex) + '_____' + sentence.substring(wordIndex + targetWord.length);
      setClozeExercise({
        sentence,
        blankedSentence,
        correctAnswer: targetWord,
        position: wordIndex
      });
    }
  };

  // =====================================================
  // GAME LOGIC
  // =====================================================

  const validateAnswer = (userAnswer: string, correctAnswer: string): { isCorrect: boolean; missingAccents: boolean } => {
    // Remove punctuation for comparison, especially important for audio mode
    const removePunctuation = (text: string) => {
      return text.replace(/[¿¡?!.,;:()""''«»\-]/g, '').trim().toLowerCase();
    };

    // Remove accents for comparison but track if accents were missing
    const removeAccents = (text: string) => {
      return text
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c');
    };

    const userAnswerClean = removePunctuation(userAnswer);
    const correctAnswerClean = removePunctuation(correctAnswer);

    // Check if user answer is missing accents
    const userAnswerNoAccents = removeAccents(userAnswerClean);
    const correctAnswerNoAccents = removeAccents(correctAnswerClean);
    const missingAccents = userAnswerClean !== userAnswerNoAccents && userAnswerNoAccents === correctAnswerNoAccents;

    // Split by multiple delimiters: comma, pipe (|), semicolon, forward slash, "and", "or"
    const correctAnswers = correctAnswer
      .split(/[,|;\/]|\band\b|\bor\b/)
      .map(ans => removePunctuation(ans))
      .filter(ans => ans.length > 0);

    // Also handle parenthetical variations and gender indicators
    const expandedAnswers = correctAnswers.flatMap(answer => {
      const variations = [answer];

      // Also add the original answer without punctuation removal for exact matching
      const originalAnswer = removePunctuation(answer);
      if (originalAnswer !== answer) {
        variations.push(originalAnswer);
      }

      // Handle "(to) verb" format - accept both "to verb" and "verb"
      const toParenMatch = answer.match(/\(to\)\s*(.+)/);
      if (toParenMatch) {
        variations.push(`to ${toParenMatch[1]}`);
        variations.push(toParenMatch[1]);
      }

      // Handle "word I other word" format - accept both parts
      if (answer.includes(' i ')) {
        const parts = answer.split(' i ').map(p => p.trim());
        variations.push(...parts);
      }

      // Remove parentheses and accept the clean version (handles gender indicators like "(male)", "(female)", "(m/f)")
      const withoutParens = answer.replace(/\([^)]*\)/g, '').trim();
      if (withoutParens !== answer && withoutParens.length > 0) {
        variations.push(withoutParens);
      }

      // Handle gender indicators in Spanish words like "compañero/a" -> "compañero"
      const withoutGenderSuffix = answer.replace(/\/[ao]\b/g, '').trim();
      if (withoutGenderSuffix !== answer && withoutGenderSuffix.length > 0) {
        variations.push(withoutGenderSuffix);
      }

      // Handle "El/La" patterns like "El compañero/a de clase" -> "compañero de clase"
      const withoutArticleAndGender = answer
        .replace(/^(el|la)\s+/i, '') // Remove article
        .replace(/\/[ao]\b/g, '') // Remove gender suffix
        .trim();
      if (withoutArticleAndGender !== answer && withoutArticleAndGender.length > 0) {
        variations.push(withoutArticleAndGender);
      }

      // Handle "=" format like "el camping = camping/campsite"
      if (answer.includes('=')) {
        const parts = answer.split('=').map(p => p.trim());
        // Add both sides of the equation
        variations.push(...parts);

        // Also handle the right side if it contains multiple options
        const rightSide = parts[1];
        if (rightSide && rightSide.includes('/')) {
          const rightOptions = rightSide.split('/').map(p => p.trim());
          variations.push(...rightOptions);
        }
      }

      // Handle "/" format for multiple options like "camping/campsite"
      if (answer.includes('/')) {
        const parts = answer.split('/').map(p => p.trim());
        variations.push(...parts);
      }

      // Handle Spanish numbers - convert written numbers to digits
      const numberMap: Record<string, string> = {
        'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5',
        'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9', 'diez': '10',
        'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14', 'quince': '15',
        'dieciséis': '16', 'diecisiete': '17', 'dieciocho': '18', 'diecinueve': '19',
        'veinte': '20', 'veintiuno': '21', 'veintidós': '22', 'veintitrés': '23',
        'veinticuatro': '24', 'veinticinco': '25', 'veintiséis': '26', 'veintisiete': '27',
        'veintiocho': '28', 'veintinueve': '29', 'treinta': '30', 'cuarenta': '40',
        'cincuenta': '50', 'sesenta': '60', 'setenta': '70', 'ochenta': '80', 'noventa': '90',
        'cien': '100', 'ciento': '100'
      };

      // Create reverse map for digit to Spanish word conversion
      const reverseNumberMap: Record<string, string[]> = {};
      Object.entries(numberMap).forEach(([spanish, digit]) => {
        if (!reverseNumberMap[digit]) {
          reverseNumberMap[digit] = [];
        }
        reverseNumberMap[digit].push(spanish);
      });

      // Handle compound numbers like "cuarenta y dos" = "42"
      const compoundNumberMatch = answer.match(/^(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)\s+y\s+(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)$/);
      if (compoundNumberMatch) {
        const tens = numberMap[compoundNumberMatch[1]] || '0';
        const ones = numberMap[compoundNumberMatch[2]] || '0';
        const numericValue = (parseInt(tens) + parseInt(ones)).toString();
        variations.push(numericValue);
      }

      // Handle simple number words to digits
      if (numberMap[answer]) {
        variations.push(numberMap[answer]);
      }

      // Handle digits to Spanish words (reverse lookup)
      if (/^\d+$/.test(answer) && reverseNumberMap[answer]) {
        variations.push(...reverseNumberMap[answer]);
      }

      return variations.filter(v => v.length > 0);
    });

    // Check if user answer matches any of the variations (exact match)
    let isMatch = expandedAnswers.some(answer => answer === userAnswerClean);
    let hasAccentIssue = false;

    // If no exact match, try without accents
    if (!isMatch) {
      const expandedAnswersNoAccents = expandedAnswers.map(answer => removeAccents(answer));
      isMatch = expandedAnswersNoAccents.some(answer => answer === userAnswerNoAccents);
      hasAccentIssue = isMatch && userAnswerClean !== userAnswerNoAccents;
    }

    // Additional check: if user entered a number, check if any correct answer is a Spanish number
    if (!isMatch && /^\d+$/.test(userAnswerClean)) {
      const userNumber = parseInt(userAnswerClean);

      // Create the same number map for consistency
      const numberMap: Record<string, string> = {
        'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5',
        'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9', 'diez': '10',
        'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14', 'quince': '15',
        'dieciséis': '16', 'diecisiete': '17', 'dieciocho': '18', 'diecinueve': '19',
        'veinte': '20', 'veintiuno': '21', 'veintidós': '22', 'veintitrés': '23',
        'veinticuatro': '24', 'veinticinco': '25', 'veintiséis': '26', 'veintisiete': '27',
        'veintiocho': '28', 'veintinueve': '29', 'treinta': '30', 'cuarenta': '40',
        'cincuenta': '50', 'sesenta': '60', 'setenta': '70', 'ochenta': '80', 'noventa': '90',
        'cien': '100', 'ciento': '100'
      };

      // Check if any correct answer is a Spanish number that matches the user's digit
      for (const correctAns of correctAnswers) {
        // Check simple number words
        if (numberMap[correctAns] === userAnswerClean) {
          return { isCorrect: true, missingAccents: false };
        }

        // Check compound numbers like "cuarenta y dos" = "42"
        const compoundMatch = correctAns.match(/^(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)\s+y\s+(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)$/);
        if (compoundMatch) {
          const tens = parseInt(numberMap[compoundMatch[1]] || '0');
          const ones = parseInt(numberMap[compoundMatch[2]] || '0');
          const compoundValue = tens + ones;

          if (compoundValue === userNumber) {
            return { isCorrect: true, missingAccents: false };
          }
        }
      }
    }

    return { isCorrect: isMatch, missingAccents: hasAccentIssue };
  };

  const handleAnswer = (answer: string) => {
    let validationResult = { isCorrect: false, missingAccents: false };

    if (gameState.gameMode === 'cloze' && clozeExercise) {
      validationResult = validateAnswer(answer, clozeExercise.correctAnswer);
    } else if (gameState.gameMode === 'listening') {
      validationResult = validateAnswer(answer, gameState.currentWord?.spanish || '');
    } else {
      validationResult = validateAnswer(answer, gameState.currentWord?.english || '');
    }

    // Show accent warning if needed
    if (validationResult.missingAccents) {
      setAccentWarning(true);
      setTimeout(() => setAccentWarning(false), 3000); // Hide after 3 seconds
    }

    processAnswer(validationResult.isCorrect, answer);
  };

  const handleMultipleChoiceSelect = (optionIndex: number) => {
    const selectedOption = multipleChoiceOptions[optionIndex];
    setGameState(prev => ({ ...prev, selectedChoice: optionIndex }));
    processAnswer(selectedOption.isCorrect, selectedOption.text);
  };

  const processAnswer = async (isCorrect: boolean, userAnswer: string) => {
    const responseTime = Date.now() - (gameState.currentWord as any)?.startTime || 0;
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const newScore = gameState.score + (isCorrect ? calculateScore(isCorrect, newStreak) : 0);

    setGameState(prev => ({
      ...prev,
      isCorrect,
      userAnswer,
      showAnswer: true,
      score: newScore,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
      streak: newStreak,
      maxStreak: Math.max(prev.maxStreak, newStreak),
      wordsLearned: isCorrect && !prev.wordsLearned.includes(prev.currentWord!.spanish) 
        ? [...prev.wordsLearned, prev.currentWord!.spanish]
        : prev.wordsLearned,
      wordsStruggling: !isCorrect && !prev.wordsStruggling.includes(prev.currentWord!.spanish)
        ? [...prev.wordsStruggling, prev.currentWord!.spanish]
        : prev.wordsStruggling,
      feedback: generateFeedback(isCorrect, newStreak)
    }));

    // Update user progress in database (only for authenticated users)
    if (user && !isDemo && gameState.currentWord) {
      await updateUserProgress(gameState.currentWord, isCorrect, responseTime);
    }

    // Play audio when answer is correct
    if (isCorrect && gameState.currentWord) {
      setTimeout(() => {
        playPronunciation(gameState.currentWord?.spanish || '', 'es');
      }, 500);
    }

    // Auto-advance after delay
    setTimeout(() => {
      nextWord();
    }, 2500);
  };

  const calculateScore = (isCorrect: boolean, streak: number): number => {
    if (!isCorrect) return 0;
    
    let baseScore = 100;
    let streakBonus = Math.min(streak * 10, 100);
    let speedBonus = 0;
    let modeBonus = 0;
    
    // Mode-specific bonuses
    switch (gameState.gameMode) {
      case 'listening':
        modeBonus = 50; // Listening is harder
        break;
      case 'cloze':
        modeBonus = 30; // Context exercises are valuable
        break;
      case 'speed':
        speedBonus = 50; // Speed bonus
        break;
      case 'typing':
        modeBonus = 100; // Double points for typing mode
        break;
      case 'learn':
        modeBonus = 0; // Standard points for learn mode
        break;
      case 'typing':
        modeBonus = 20; // Typing requires exact recall
        break;
    }
    
    // Penalty if answer was revealed
    const revealPenalty = gameState.isAnswerRevealed ? 50 : 0;
    
    return Math.max(baseScore + streakBonus + speedBonus + modeBonus - revealPenalty, 25);
  };

  const generateFeedback = (isCorrect: boolean, streak: number): string => {
    if (isCorrect) {
      if (streak >= 10) return '🔥 Incredible streak! You\'re on fire!';
      if (streak >= 5) return '⚡ Great streak! Keep it going!';
      if (streak >= 3) return '🌟 Nice work! You\'re building momentum!';
      return '✅ Correct! Well done!';
    } else {
      const encouragements = [
        '💪 Keep trying! You\'ve got this!',
        '🎯 Almost there! Practice makes perfect!',
        '📚 Learning from mistakes makes you stronger!',
        '🚀 Every expert was once a beginner!'
      ];
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
  };

  const updateUserProgress = async (word: VocabularyWord, isCorrect: boolean, responseTime: number = 0) => {
    if (!user || !supabase || isDemo) return;

    try {
      console.log('Word practice recorded:', {
        word: word.spanish,
        correct: isCorrect,
        responseTime
      });

      // Record in spaced repetition service
      const quality = isCorrect ? REVIEW_QUALITY.PERFECT : REVIEW_QUALITY.INCORRECT;
      await spacedRepetitionService.updateProgress(user.id, Number(word.id), quality, responseTime);

      // Update user vocabulary progress
      const { data: existingProgress } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('vocabulary_id', word.id)
        .single();

      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('user_vocabulary_progress')
          .update({
            times_seen: existingProgress.times_seen + 1,
            times_correct: isCorrect ? existingProgress.times_correct + 1 : existingProgress.times_correct,
            last_seen: new Date().toISOString(),
            accuracy_rate: (isCorrect ? existingProgress.times_correct + 1 : existingProgress.times_correct) / (existingProgress.times_seen + 1),
            is_learned: ((isCorrect ? existingProgress.times_correct + 1 : existingProgress.times_correct) / (existingProgress.times_seen + 1)) >= 0.8,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('vocabulary_id', word.id);
      } else {
        // Create new progress record
        await supabase
          .from('user_vocabulary_progress')
          .insert({
            user_id: user.id,
            vocabulary_id: word.id,
            times_seen: 1,
            times_correct: isCorrect ? 1 : 0,
            last_seen: new Date().toISOString(),
            accuracy_rate: isCorrect ? 1.0 : 0.0,
            is_learned: isCorrect,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  };

  const nextWord = () => {
    const nextIndex = gameState.currentWordIndex + 1;
    
    if (nextIndex >= vocabulary.length) {
      completeGame();
      return;
    }

    const nextWord = { ...vocabulary[nextIndex], startTime: Date.now() };
    const nextGameMode = determineGameMode(mode);
    
    setGameState(prev => ({
      ...prev,
      currentWordIndex: nextIndex,
      currentWord: nextWord,
      userAnswer: '',
      selectedChoice: null,
      showAnswer: false,
      isCorrect: null,
      feedback: '',
      gameMode: nextGameMode,
      audioPlaying: false,
      canReplayAudio: true,
      audioReplayCount: 0,
      isAnswerRevealed: false
    }));

    // Setup exercise content based on new mode
    if (nextGameMode === 'cloze' && nextWord.example_sentence) {
      setClozeExercise(null); // Reset first
      setTimeout(() => generateClozeExercise(nextWord), 100);
    } else {
      generateMultipleChoice(nextWord, vocabulary);
      setClozeExercise(null);
    }
    
    setShowHint(false);
    setShowTranslation(false);
    focusInput();

    // Auto-play audio for listening mode and learn mode (but not typing mode)
    if (nextGameMode === 'listening') {
      setTimeout(() => playPronunciation(nextWord.spanish || '', 'es', nextWord), 1000);
    } else if (nextGameMode === 'learn') {
      setTimeout(() => playPronunciation(nextWord.spanish || '', 'es', nextWord), 2000); // Slower for learn mode
      // Auto-show hint after 5 seconds in learn mode
      setTimeout(() => setShowHint(true), 5000);
    }

    if (mode === 'spaced_repetition' || mode === 'review_weak') {
      loadUserProgress(nextWord);
    }
  };

  const completeGame = () => {
    setGameComplete(true);
    
    const results = {
      score: gameState.score,
      accuracy: Math.round((gameState.correctAnswers / gameState.totalWords) * 100),
      wordsLearned: gameState.wordsLearned.length,
      wordsReviewed: gameState.totalWords,
      timeSpent: gameState.timeSpent,
      strengthsGained: gameState.wordsLearned,
      weaknessesIdentified: gameState.wordsStruggling,
      maxStreak: gameState.maxStreak,
      mode: mode,
      spacedRepetitionUpdates: [] // Would be populated with actual updates
    };
    
    setTimeout(() => {
      onComplete?.(results);
    }, 3000);
  };

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const revealAnswer = () => {
    setGameState(prev => ({ ...prev, isAnswerRevealed: true }));
    
    if (gameState.gameMode === 'typing' || gameState.gameMode === 'learn' || gameState.gameMode === 'recall') {
      setGameState(prev => ({
        ...prev,
        userAnswer: prev.currentWord?.english || ''
      }));
    } else if (gameState.gameMode === 'multiple_choice') {
      const correctIndex = multipleChoiceOptions.findIndex(option => option.isCorrect);
      setGameState(prev => ({ ...prev, selectedChoice: correctIndex }));
    } else if (gameState.gameMode === 'cloze' && clozeExercise) {
      setGameState(prev => ({ ...prev, userAnswer: clozeExercise.correctAnswer }));
    } else if (gameState.gameMode === 'listening') {
      setGameState(prev => ({ ...prev, userAnswer: prev.currentWord?.spanish || '' }));
    }
  };

  const toggleGameMode = () => {
    const currentModes: GameState['gameMode'][] = ['typing', 'multiple_choice'];
    const currentIndex = currentModes.indexOf(gameState.gameMode as any);
    const nextMode = currentModes[(currentIndex + 1) % currentModes.length];
    
    setGameState(prev => ({
      ...prev,
      gameMode: nextMode,
      userAnswer: '',
      selectedChoice: null,
      showAnswer: false,
      isAnswerRevealed: false
    }));
    
    if (nextMode === 'multiple_choice' && gameState.currentWord) {
      generateMultipleChoice(gameState.currentWord, vocabulary);
    }
  };

  // =====================================================
  // AUDIO FEATURES - Enhanced with Amazon Polly Support
  // =====================================================

  // Clean text for TTS to avoid issues like "barra a" for "/a"
  const cleanTextForTTS = (text: string): string => {
    return text
      .replace(/\/a\b/g, '') // Remove "/a" gender indicators
      .replace(/\/o\b/g, '') // Remove "/o" gender indicators
      .replace(/\(m\/f\)/g, '') // Remove "(m/f)" indicators
      .replace(/\(male\)/g, '') // Remove "(male)" indicators
      .replace(/\(female\)/g, '') // Remove "(female)" indicators
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };

  const playPronunciation = async (text: string, language: 'es' | 'en' = 'es', word?: VocabularyWord) => {
    if (gameState.audioPlaying) return;

    // Clean the text for TTS
    const cleanText = cleanTextForTTS(text);

    // Only use Amazon Polly audio - no fallback to Web Speech API to avoid robotic voice
    // Use the provided word or fall back to current word
    const targetWord = word || gameState.currentWord;
    const audioUrl = targetWord?.audio_url;

    if (audioUrl && language === 'es') {
      try {
        setGameState(prev => ({ ...prev, audioPlaying: true }));

        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setGameState(prev => ({ ...prev, audioPlaying: false }));
        };
        audioRef.current.onerror = () => {
          console.warn('Failed to play Amazon Polly audio for:', text);
          setGameState(prev => ({ ...prev, audioPlaying: false }));
          // No fallback - only use Amazon Polly to maintain audio quality
        };

        await audioRef.current.play();
        return;
      } catch (error) {
        console.warn('Failed to play pre-generated audio:', error);
        setGameState(prev => ({ ...prev, audioPlaying: false }));
      }
    } else {
      console.warn('No Amazon Polly audio available for:', text);
    }
  };

  const handleAudioReplay = () => {
    if (gameState.canReplayAudio && gameState.audioReplayCount < 2) {
      setGameState(prev => ({ 
        ...prev, 
        audioReplayCount: prev.audioReplayCount + 1,
        canReplayAudio: prev.audioReplayCount + 1 < 2
      }));
      
      if (gameState.gameMode === 'listening' && gameState.currentWord) {
        playPronunciation(gameState.currentWord.spanish || '', 'es');
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    setGameState(prev => ({ ...prev, audioPlaying: false }));
  };

  // =====================================================
  // RENDER COMPONENTS - Keeping Gem Collector's clean styling
  // =====================================================

  const renderGameHeader = () => {
    const getExerciseTypeInfo = () => {
      switch (gameState.gameMode) {
        case 'listening':
          return { icon: <Headphones className="h-4 w-4" />, name: 'Listening', color: 'text-blue-500' };
        case 'cloze':
          return { icon: <PenTool className="h-4 w-4" />, name: 'Context', color: 'text-green-500' };
        case 'multiple_choice':
          return { icon: <Target className="h-4 w-4" />, name: 'Multiple Choice', color: 'text-purple-500' };
        case 'speed':
          return { icon: <Zap className="h-4 w-4" />, name: 'Speed', color: 'text-yellow-500' };
        case 'learn':
          return { icon: <Lightbulb className="h-4 w-4" />, name: 'Learning', color: 'text-indigo-500' };
        case 'recall':
          return { icon: <Brain className="h-4 w-4" />, name: 'Recall', color: 'text-red-500' };
        case 'typing':
          return { icon: <Keyboard className="h-4 w-4" />, name: 'Typing', color: 'text-orange-500' };
        default:
          return { icon: <BookOpen className="h-4 w-4" />, name: 'Practice', color: 'text-gray-500' };
      }
    };

    const exerciseType = getExerciseTypeInfo();

    return (
      <div className="bg-white/10 backdrop-blur-md p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onExit}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5 text-white" />
            </button>
            
            <div className="text-white">
              <span className="text-sm opacity-80">Score: </span>
              <span className="font-bold">{gameState.score.toLocaleString()}</span>
            </div>
            
            <div className="text-white">
              <span className="text-sm opacity-80">Streak: </span>
              <span className="font-bold">🔥 {gameState.streak}</span>
            </div>
            
            <div className="text-white">
              <span className="text-sm opacity-80">Learned: </span>
              <span className="font-bold">{gameState.wordsLearned.length}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mode Toggle for typing/multiple choice */}
            {(gameState.gameMode === 'typing' || gameState.gameMode === 'multiple_choice') && (
              <button
                onClick={toggleGameMode}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
              >
                {gameState.gameMode === 'typing' ? <Keyboard className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                <span>{gameState.gameMode === 'typing' ? 'Typing' : 'Multiple Choice'}</span>
              </button>
            )}
            
            <div className="text-white">
              <div className="text-sm opacity-75 flex items-center space-x-1">
                <span>Mode</span>
                <span className={exerciseType.color}>
                  {exerciseType.icon}
                </span>
              </div>
              <div className="text-sm font-semibold">{exerciseType.name}</div>
            </div>

            <div className="flex items-center space-x-2 text-white">
              <Clock className="h-4 w-4 text-white/70" />
              <span>
                {Math.floor(gameState.timeSpent / 60)}:{(gameState.timeSpent % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="text-white text-sm">
              {gameState.currentWordIndex + 1} / {gameState.totalWords}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 max-w-4xl mx-auto">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderWordCard = () => {
    const isListeningMode = gameState.gameMode === 'listening';
    const isClozeMode = gameState.gameMode === 'cloze';
    
    return (
      <motion.div
        key={gameState.currentWord?.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center">
          {isListeningMode ? (
            <>
              <div className="text-4xl mb-6">
                <Headphones className="h-16 w-16 text-blue-600 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-4">
                🎧 Listen and Type What You Hear
              </div>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => playPronunciation(gameState.currentWord?.spanish || '', 'es')}
                  disabled={gameState.audioPlaying}
                  className={`flex items-center justify-center p-4 rounded-full transition-colors ${
                    gameState.audioPlaying 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                  }`}
                >
                  {gameState.audioPlaying ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </button>
                
                {gameState.canReplayAudio && (
                  <button
                    onClick={handleAudioReplay}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-sm">
                      Replay ({2 - gameState.audioReplayCount} left)
                    </span>
                  </button>
                )}
              </div>
            </>
          ) : isClozeMode && clozeExercise ? (
            <>
              <div className="text-4xl mb-6">
                <BookOpen className="h-16 w-16 text-green-600 mx-auto" />
              </div>
              <div className="text-xl font-bold text-gray-800 mb-4">
                📝 Fill in the Missing Word
              </div>
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {clozeExercise.blankedSentence}
                </p>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Context: {gameState.currentWord?.theme}
              </div>
              {clozeExercise.sentence !== clozeExercise.blankedSentence && (
                <button
                  onClick={() => playPronunciation(clozeExercise.sentence, 'es')}
                  className="flex items-center justify-center mx-auto p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                >
                  <Volume2 className="h-4 w-4 text-green-600" />
                </button>
              )}
            </>
          ) : (
            <>
              {/* Word progress indicator - keeping Gem Collector style */}
              <div className="mb-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  <span>Seen: {gameState.currentWord?.times_seen || 0}</span>
                  <span>•</span>
                  <span>Correct: {gameState.currentWord?.times_correct || 0}</span>
                  {gameState.currentWord?.is_learned && (
                    <>
                      <span>•</span>
                      <span className="text-green-600 font-medium">✓ Learned</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-5xl font-bold text-gray-800 mb-4">
                {gameState.currentWord?.spanish}
              </div>

              <button
                onClick={() => playPronunciation(gameState.currentWord?.spanish || '')}
                disabled={gameState.audioPlaying}
                className={`flex items-center justify-center mx-auto mb-4 p-2 rounded-full transition-colors ${
                  gameState.audioPlaying
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                }`}
              >
                {gameState.audioPlaying ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>



              <p className="text-gray-600 capitalize mb-6">
                {gameState.currentWord?.part_of_speech} • {gameState.currentWord?.topic}
              </p>

              {/* Show example sentence if available and not in cloze mode */}
              {gameState.currentWord?.example_sentence && !isClozeMode && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="text-sm text-blue-800">
                    <strong>Example:</strong> {gameState.currentWord.example_sentence}
                  </div>
                  {gameState.currentWord.example_translation && (
                    <div className="text-center mt-3">
                      {showTranslation ? (
                        <div className="text-sm text-blue-600 bg-green-50 p-2 rounded">
                          <strong>Translation:</strong> {gameState.currentWord.example_translation}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setShowTranslation(true);
                            // Deduct points for using translation hint
                            setGameState(prev => ({
                              ...prev,
                              score: Math.max(0, prev.score - 1)
                            }));
                          }}
                          className="flex items-center justify-center gap-2 mx-auto px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors rounded text-sm border border-blue-200 hover:border-blue-300"
                        >
                          <Eye className="w-3 h-3" />
                          Click to reveal translation
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {showHint && !gameState.showAnswer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-600 mb-4 bg-yellow-50 p-2 rounded-lg"
                >
                  💡 Hint: {gameState.currentWord?.english.charAt(0)}...
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTypingInput = () => {
    const isListeningMode = gameState.gameMode === 'listening';
    const isClozeMode = gameState.gameMode === 'cloze';
    
    let placeholder = "Type the English translation...";
    if (isListeningMode) {
      placeholder = "Type what you heard in Spanish...";
    } else if (isClozeMode) {
      placeholder = "Type the missing word...";
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            {gameState.gameMode === 'typing'
              ? 'Type the English translation (Double Points!):'
              : gameState.gameMode === 'learn'
                ? 'Type the English translation (Hints available):'
              : gameState.gameMode === 'recall'
                ? 'Type the English translation:'
              : isListeningMode
                ? 'What did you hear?'
                : isClozeMode
                  ? 'Fill in the blank:'
                  : 'Your answer:'}
          </label>
        </div>
        
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={gameState.userAnswer}
            onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && !gameState.showAnswer && handleAnswer(gameState.userAnswer)}
            placeholder={placeholder}
            className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={gameState.showAnswer}
          />
          <Keyboard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Accent Warning */}
        {accentWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-yellow-800 text-sm">
              ⚠️ Be careful with the accents! Your answer was correct but missing accent marks.
            </p>
          </div>
        )}

        {/* Accent Helper Buttons */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Quick accent buttons:</p>
          <div className="flex justify-center space-x-2 flex-wrap">
            {['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'].map((accent) => (
              <button
                key={accent}
                onClick={() => {
                  const input = inputRef.current;
                  if (input) {
                    const start = input.selectionStart || 0;
                    const end = input.selectionEnd || 0;
                    const newValue = gameState.userAnswer.slice(0, start) + accent + gameState.userAnswer.slice(end);
                    setGameState(prev => ({ ...prev, userAnswer: newValue }));
                    // Set cursor position after the inserted character
                    setTimeout(() => {
                      input.focus();
                      input.setSelectionRange(start + 1, start + 1);
                    }, 0);
                  }
                }}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                disabled={gameState.showAnswer}
              >
                {accent}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleAnswer(gameState.userAnswer)}
            disabled={gameState.showAnswer || !gameState.userAnswer.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>Submit</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          {!isListeningMode && !isClozeMode && !gameState.showAnswer && gameState.gameMode !== 'typing' && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              {showHint ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
          
          {!gameState.showAnswer && gameState.gameMode !== 'typing' && (
            <button
              onClick={revealAnswer}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Show Answer</span>
            </button>
          )}

          {isListeningMode && gameState.canReplayAudio && !gameState.showAnswer && (
            <button
              onClick={handleAudioReplay}
              className="px-4 py-3 bg-yellow-200 hover:bg-yellow-300 text-yellow-700 rounded-xl font-semibold transition-colors"
              disabled={gameState.audioPlaying}
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Exercise type indicator */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {isListeningMode && (
              <>
                <Headphones className="h-4 w-4" />
                <span>Listening Exercise</span>
              </>
            )}
            {isClozeMode && (
              <>
                <PenTool className="h-4 w-4" />
                <span>Context Exercise</span>
              </>
            )}
            {gameState.gameMode === 'learn' && (
              <>
                <Lightbulb className="h-4 w-4" />
                <span>Learn Mode - Guided Practice</span>
              </>
            )}
            {gameState.gameMode === 'typing' && (
              <>
                <Keyboard className="h-4 w-4" />
                <span>Typing Mode - Double Points!</span>
              </>
            )}
            {gameState.gameMode === 'recall' && (
              <>
                <Brain className="h-4 w-4" />
                <span>Recall Practice</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMultipleChoice = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Choose the correct English translation:
        </label>
      </div>
      
      <div className="space-y-3">
        {multipleChoiceOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => !gameState.showAnswer && handleMultipleChoiceSelect(index)}
            disabled={gameState.showAnswer}
            className={`w-full p-4 text-left border-2 rounded-xl transition-colors ${
              gameState.showAnswer
                ? option.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : gameState.selectedChoice === index
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                : gameState.selectedChoice === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
            <span className="ml-3">{option.text}</span>
            {gameState.showAnswer && option.isCorrect && (
              <CheckCircle className="inline h-5 w-5 text-green-600 ml-2" />
            )}
            {gameState.showAnswer && !option.isCorrect && gameState.selectedChoice === index && (
              <XCircle className="inline h-5 w-5 text-red-600 ml-2" />
            )}
          </button>
        ))}
      </div>
      
      {!gameState.showAnswer && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={revealAnswer}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Show Answer</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderFeedback = () => (
    <AnimatePresence>
      {gameState.showAnswer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
            gameState.isCorrect 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {gameState.isCorrect ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
          
          <div className="flex-1">
            <p className={`font-medium ${
              gameState.isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {gameState.feedback}
            </p>
            
            {/* Show correct answer based on exercise type */}
            {gameState.gameMode === 'listening' && (
              <div className="text-sm text-gray-700 mt-2">
                <div><strong>You heard:</strong> {gameState.currentWord?.spanish}</div>
                <div><strong>Meaning:</strong> {gameState.currentWord?.english}</div>
              </div>
            )}
            
            {gameState.gameMode === 'cloze' && clozeExercise && (
              <div className="text-sm text-gray-700 mt-2">
                <div><strong>Complete sentence:</strong> {clozeExercise.sentence}</div>
                {gameState.currentWord?.example_translation && (
                  <div><strong>Translation:</strong> {gameState.currentWord.example_translation}</div>
                )}
              </div>
            )}
            
            {(gameState.gameMode === 'learn' || gameState.gameMode === 'recall' || gameState.gameMode === 'multiple_choice' || gameState.gameMode === 'typing') && (
              <div className="text-sm text-gray-700 mt-2">
                <strong>{gameState.currentWord?.spanish}</strong> = <strong>{gameState.currentWord?.english}</strong>
                {gameState.currentWord?.example_sentence && (
                  <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                    <strong>Example:</strong> {gameState.currentWord.example_sentence}
                  </div>
                )}
              </div>
            )}

            {gameState.isAnswerRevealed && (
              <div className="text-xs text-yellow-600 mt-1">
                Score reduced for showing answer
              </div>
            )}
          </div>

          {!gameState.isCorrect && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => playPronunciation(
                  gameState.gameMode === 'listening' 
                    ? gameState.currentWord?.spanish || '' 
                    : gameState.currentWord?.english || '', 
                  gameState.gameMode === 'listening' ? 'es' : 'en'
                )}
                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
              >
                <Volume2 className="h-4 w-4 text-blue-600" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderGameComplete = () => (
    <div className="text-center text-white p-8">
      <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">Session Complete!</h1>
      
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-lg mx-auto mb-8">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {gameState.score.toLocaleString()}
            </div>
            <div className="text-sm opacity-75">Total Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {Math.round((gameState.correctAnswers / gameState.totalWords) * 100)}%
            </div>
            <div className="text-sm opacity-75">Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {gameState.wordsLearned.length}
            </div>
            <div className="text-sm opacity-75">Words Learned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {gameState.maxStreak}
            </div>
            <div className="text-sm opacity-75">Best Streak</div>
          </div>
        </div>
      </div>

      <p className="text-lg opacity-75 mb-8">
        Your progress has been saved and will be used to optimize your future learning sessions.
      </p>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Practice Again</span>
        </button>
        <button
          onClick={onExit}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Exit</span>
        </button>
      </div>
      
      <div className="text-center text-sm opacity-60 mt-4">
        Returning to dashboard in a few seconds...
      </div>
    </div>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================

  // Show loading or error state if no vocabulary
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4">
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-4">Loading VocabMaster...</div>
          <p className="text-lg opacity-75 mb-8">
            {!vocabulary ? 'Preparing vocabulary...' : 'No vocabulary available for practice.'}
          </p>
          {onExit && (
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Home className="h-4 w-4" />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 flex items-center justify-center px-4">
        {renderGameComplete()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {renderGameHeader()}

      {/* Main Game Area */}
      <div className="flex items-center justify-center p-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="max-w-2xl w-full">
          {gameState.currentWord && (
            <motion.div
              key={gameState.currentWord.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {renderWordCard()}
              
              <div className="mt-6">
                {/* Feedback */}
                {renderFeedback()}
                
                {/* Input Area */}
                {!gameState.showAnswer && (
                  <div className="bg-white rounded-2xl shadow-2xl p-6">
                    {(gameState.gameMode === 'multiple_choice' || gameState.gameMode === 'speed') && !gameState.showAnswer
                      ? renderMultipleChoice()
                      : renderTypingInput()
                    }
                  </div>
                )}

                {/* Continue Button */}
                {gameState.showAnswer && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => nextWord()}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
