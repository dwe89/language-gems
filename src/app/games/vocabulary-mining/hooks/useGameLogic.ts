'use client';

import { useState, useCallback, useRef } from 'react';
import { GemType } from '../../../../components/ui/GemIcon';

// =====================================================
// TYPES
// =====================================================

export interface VocabularyWord {
  id: string | number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
  part_of_speech: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  times_seen?: number;
  times_correct?: number;
  last_seen?: Date;
  is_learned?: boolean;
  mastery_level?: number;
  difficulty_rating?: number;
}

export interface GameState {
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
  gameMode: 'learn' | 'recall' | 'speed' | 'multiple_choice' | 'listening' | 'cloze' | 'typing' | 'match_up' | 'match' | 'dictation' | 'flashcards';
  timeSpent: number;
  startTime: Date;
  wordsLearned: string[];
  wordsStruggling: string[];
  feedback: string;
  audioPlaying: boolean;
  canReplayAudio: boolean;
  audioReplayCount: number;
  isAnswerRevealed: boolean;
  gemsCollected: number;
  currentGemType: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  speedModeTimeLeft: number;
  isFlashcardFlipped: boolean;
}

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Helper function to handle different vocabulary data structures
export const getWordProperty = (word: any, property: 'spanish' | 'english'): string => {
  if (property === 'spanish') {
    return word.spanish || word.word || '';
  } else {
    return word.english || word.translation || '';
  }
};

// Comprehensive answer validation
export const validateAnswer = (userAnswer: string, correctAnswer: string): { isCorrect: boolean; missingAccents: boolean } => {
  // Remove punctuation and text in brackets/parentheses for comparison
  const removePunctuation = (text: string) => {
    // First remove text in brackets/parentheses (informal, formal, etc.)
    const withoutBrackets = text.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
    // Normalize curly quotes to straight quotes before removing punctuation
    const normalizedQuotes = withoutBrackets.replace(/['']/g, "'").replace(/[""]/g, '"');
    return normalizedQuotes.replace(/[¿¡?!.,;:()""''«»\-]/g, '').trim().toLowerCase();
  };

  const normalizeAccents = (text: string) => {
    return text
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c');
  };

  const normalizeNumbers = (text: string) => {
    const numberWords: Record<string, string> = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
      'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
      'eighteen': '18', 'nineteen': '19', 'twenty': '20'
    };

    let result = text;
    Object.entries(numberWords).forEach(([word, num]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, num);
    });
    return result;
  };

  const processAnswer = (text: string) => {
    return normalizeNumbers(normalizeAccents(removePunctuation(text)));
  };

  const processedUser = processAnswer(userAnswer);
  const processedCorrect = processAnswer(correctAnswer);

  // Check for exact match first
  if (processedUser === processedCorrect) {
    return { isCorrect: true, missingAccents: false };
  }

  // Check if it's correct without accents
  const userWithoutAccents = normalizeAccents(removePunctuation(userAnswer));
  const correctWithoutAccents = normalizeAccents(removePunctuation(correctAnswer));
  
  if (userWithoutAccents === correctWithoutAccents) {
    return { isCorrect: true, missingAccents: true };
  }

  // Handle multiple correct answers separated by commas or slashes
  const correctAnswers = correctAnswer.split(/[,/]/).map(ans => processAnswer(ans.trim()));
  const isCorrect = correctAnswers.some(ans => processedUser === ans);

  if (isCorrect) {
    return { isCorrect: true, missingAccents: false };
  }

  // Check without accents for multiple answers
  const correctAnswersNoAccents = correctAnswer.split(/[,/]/).map(ans => 
    normalizeAccents(removePunctuation(ans.trim()))
  );
  const isCorrectNoAccents = correctAnswersNoAccents.some(ans => userWithoutAccents === ans);

  return { 
    isCorrect: isCorrectNoAccents, 
    missingAccents: isCorrectNoAccents 
  };
};

// Determine gem type based on correct encounters
export const determineGemType = (correctEncounters: number): GemType => {
  if (correctEncounters >= 10) return 'legendary';
  if (correctEncounters >= 7) return 'epic';
  if (correctEncounters >= 5) return 'rare';
  if (correctEncounters >= 3) return 'uncommon';
  return 'common';
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useGameLogic = (vocabulary: VocabularyWord[]) => {
  const timerRef = useRef<NodeJS.Timeout>();
  const speedTimerRef = useRef<NodeJS.Timeout>();

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
    isAnswerRevealed: false,
    gemsCollected: 0,
    currentGemType: 'common',
    speedModeTimeLeft: 10,
    isFlashcardFlipped: false
  });

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<MultipleChoiceOption[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Initialize game with first word
  const initializeGame = useCallback(() => {
    if (vocabulary.length > 0) {
      setGameState(prev => ({
        ...prev,
        currentWord: vocabulary[0],
        currentWordIndex: 0,
        startTime: new Date()
      }));
    }
  }, [vocabulary]);

  // Generate multiple choice options
  const generateMultipleChoiceOptions = useCallback((currentWord: VocabularyWord): MultipleChoiceOption[] => {
    const correctAnswer = getWordProperty(currentWord, 'english');
    const options: MultipleChoiceOption[] = [{ text: correctAnswer, isCorrect: true }];
    
    // Get 3 random incorrect options from other words
    const otherWords = vocabulary.filter(w => w.id !== currentWord.id);
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
      const incorrectAnswer = getWordProperty(shuffledOthers[i], 'english');
      if (!options.some(opt => opt.text === incorrectAnswer)) {
        options.push({ text: incorrectAnswer, isCorrect: false });
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  }, [vocabulary]);

  return {
    gameState,
    setGameState,
    multipleChoiceOptions,
    setMultipleChoiceOptions,
    gameComplete,
    setGameComplete,
    showHint,
    setShowHint,
    timerRef,
    speedTimerRef,
    initializeGame,
    generateMultipleChoiceOptions
  };
};
