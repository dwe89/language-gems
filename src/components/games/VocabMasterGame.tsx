'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { SpacedRepetitionService, REVIEW_QUALITY } from '../../services/spacedRepetitionService';
import { 
  Home, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw,
  Volume2, Eye, EyeOff, Clock, Star, Brain, Target,
  Zap, TrendingUp, Award, ChevronRight
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

interface VocabularyWord {
  id: number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
  part_of_speech: string;
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
  gameMode: 'learn' | 'recall' | 'speed' | 'multiple_choice';
  timeSpent: number;
  startTime: Date;
  wordsLearned: string[];
  wordsStruggling: string[];
  feedback: string;
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
  const { supabase } = useSupabase();
  const spacedRepetitionService = new SpacedRepetitionService(supabase);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

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
    feedback: ''
  });

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<MultipleChoiceOption[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

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
    };
  }, []);

  const initializeGame = () => {
    const shuffledVocab = [...vocabulary].sort(() => Math.random() - 0.5);
    const firstWord = { ...shuffledVocab[0], startTime: Date.now() };
    
    setGameState(prev => ({
      ...prev,
      currentWord: firstWord,
      gameMode: determineGameMode(mode),
      totalWords: shuffledVocab.length
    }));

    if (mode === 'spaced_repetition' || mode === 'review_weak') {
      loadUserProgress(firstWord);
    }

    generateMultipleChoice(firstWord, shuffledVocab);
    focusInput();
  };

  const determineGameMode = (mode: string): GameState['gameMode'] => {
    switch (mode) {
      case 'speed_review':
        return 'speed';
      case 'learn_new':
        return 'learn';
      case 'review_weak':
      case 'spaced_repetition':
        return 'recall';
      default:
        return 'multiple_choice';
    }
  };

  const loadUserProgress = async (word: VocabularyWord) => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('vocabulary_id', word.id)
        .single();

      if (data) {
        word.times_seen = data.times_seen;
        word.times_correct = data.times_correct;
        word.is_learned = data.is_learned;
        word.last_seen = new Date(data.last_seen);
      }
    } catch (error) {
      console.log('No existing progress for word:', word.spanish);
    }
  };

  const generateMultipleChoice = (currentWord: VocabularyWord, allWords: VocabularyWord[]) => {
    if (!currentWord) return;

    const incorrectOptions = allWords
      .filter(w => w.id !== currentWord.id && w.english !== currentWord.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options: MultipleChoiceOption[] = [
      { text: currentWord.english, isCorrect: true },
      ...incorrectOptions.map(w => ({ text: w.english, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    setMultipleChoiceOptions(options);
  };

  // =====================================================
  // GAME LOGIC
  // =====================================================

  const handleAnswer = (answer: string) => {
    const isCorrect = answer.toLowerCase().trim() === gameState.currentWord?.english.toLowerCase();
    processAnswer(isCorrect, answer);
  };

  const handleMultipleChoiceSelect = (optionIndex: number) => {
    const selectedOption = multipleChoiceOptions[optionIndex];
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

    // Update user progress in database
    if (user && gameState.currentWord) {
      await updateUserProgress(gameState.currentWord, isCorrect, responseTime);
    }

    // Auto-advance after delay
    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  const calculateScore = (isCorrect: boolean, streak: number): number => {
    if (!isCorrect) return 0;
    
    let baseScore = 100;
    let streakBonus = Math.min(streak * 10, 100);
    let speedBonus = 0;
    
    // Speed bonus for quick answers (if in speed mode)
    if (gameState.gameMode === 'speed') {
      speedBonus = 50;
    }
    
    return baseScore + streakBonus + speedBonus;
  };

  const generateFeedback = (isCorrect: boolean, streak: number): string => {
    if (isCorrect) {
      if (streak >= 10) return 'Incredible streak! 🔥';
      if (streak >= 5) return 'Great streak! 🌟';
      if (streak >= 3) return 'Nice work! ⚡';
      return 'Correct! 👍';
    } else {
      return 'Keep trying! 💪';
    }
  };

  const updateUserProgress = async (word: VocabularyWord, isCorrect: boolean, responseTime: number = 0) => {
    if (!user) return;

    try {
      // Determine quality based on correctness and game mode
      let quality: number = isCorrect ? REVIEW_QUALITY.GOOD : REVIEW_QUALITY.INCORRECT;
      
      // Adjust quality based on response time for speed mode
      if (gameState.gameMode === 'speed' && isCorrect) {
        if (responseTime < 2000) quality = REVIEW_QUALITY.PERFECT;
        else if (responseTime > 5000) quality = REVIEW_QUALITY.HARD;
      }
      
      // Update using spaced repetition service
      await spacedRepetitionService.updateProgress(
        user.id,
        word.id,
        quality,
        responseTime
      );
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
    setGameState(prev => ({
      ...prev,
      currentWordIndex: nextIndex,
      currentWord: nextWord,
      userAnswer: '',
      selectedChoice: null,
      showAnswer: false,
      isCorrect: null,
      feedback: ''
    }));

    generateMultipleChoice(nextWord, vocabulary);
    setShowHint(false);
    focusInput();

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

  // =====================================================
  // AUDIO FEATURES
  // =====================================================

  const playPronunciation = (text: string, language: 'es' | 'en' = 'es') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // =====================================================
  // RENDER COMPONENTS
  // =====================================================

  const renderGameHeader = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <div className="text-sm opacity-75">Progress</div>
            <div className="text-lg font-bold">
              {gameState.currentWordIndex + 1} / {gameState.totalWords}
            </div>
          </div>
          <div className="text-white">
            <div className="text-sm opacity-75">Score</div>
            <div className="text-lg font-bold">{gameState.score.toLocaleString()}</div>
          </div>
          <div className="text-white">
            <div className="text-sm opacity-75">Streak</div>
            <div className="text-lg font-bold">🔥 {gameState.streak}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-white/70" />
          <span className="text-white">
            {Math.floor(gameState.timeSpent / 60)}:{(gameState.timeSpent % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
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

  const renderWordCard = () => (
    <motion.div
      key={gameState.currentWord?.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto mb-8"
    >
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-800 mb-4">
          {gameState.currentWord?.spanish}
        </div>
        
        <button
          onClick={() => playPronunciation(gameState.currentWord?.spanish || '')}
          className="flex items-center justify-center mx-auto mb-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
        >
          <Volume2 className="h-5 w-5 text-blue-600" />
        </button>

        <div className="text-sm text-gray-500 mb-2">
          {gameState.currentWord?.part_of_speech} • {gameState.currentWord?.theme}
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-600 mb-4"
          >
            💡 Hint: {gameState.currentWord?.english.charAt(0)}...
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const renderTypingInput = () => (
    <div className="max-w-md mx-auto mb-6">
      <input
        ref={inputRef}
        type="text"
        value={gameState.userAnswer}
        onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
        onKeyPress={(e) => e.key === 'Enter' && handleAnswer(gameState.userAnswer)}
        placeholder="Type the English translation..."
        className="w-full p-4 text-xl text-center rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
        disabled={gameState.showAnswer}
      />
      
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => handleAnswer(gameState.userAnswer)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
          disabled={gameState.showAnswer || !gameState.userAnswer.trim()}
        >
          Submit
        </button>
        
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
          disabled={gameState.showAnswer}
        >
          {showHint ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  const renderMultipleChoice = () => (
    <div className="max-w-md mx-auto mb-6 space-y-3">
      {multipleChoiceOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => handleMultipleChoiceSelect(index)}
          disabled={gameState.showAnswer}
          className={`w-full p-4 rounded-2xl font-semibold transition-all ${
            gameState.showAnswer 
              ? option.isCorrect
                ? 'bg-green-500 text-white'
                : gameState.selectedChoice === index
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              : 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          {option.text}
        </button>
      ))}
    </div>
  );

  const renderFeedback = () => (
    <AnimatePresence>
      {gameState.showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`max-w-md mx-auto p-6 rounded-2xl mb-6 text-center ${
            gameState.isCorrect ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <div className={`text-6xl mb-2 ${
            gameState.isCorrect ? 'text-green-500' : 'text-red-500'
          }`}>
            {gameState.isCorrect ? <CheckCircle /> : <XCircle />}
          </div>
          
          <div className="text-xl font-bold mb-2">
            {gameState.feedback}
          </div>
          
          <div className="text-lg text-gray-700 mb-4">
            <strong>{gameState.currentWord?.spanish}</strong> = <strong>{gameState.currentWord?.english}</strong>
          </div>

          {!gameState.isCorrect && (
            <button
              onClick={() => playPronunciation(gameState.currentWord?.english || '', 'en')}
              className="flex items-center justify-center mx-auto p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
            >
              <Volume2 className="h-4 w-4 text-blue-600" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderGameComplete = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center text-white max-w-2xl mx-auto"
    >
      <Trophy className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
      
      <h2 className="text-4xl font-bold mb-4">
        Excellent Work! 🎉
      </h2>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-400">
              {gameState.score.toLocaleString()}
            </div>
            <div className="text-sm opacity-75">Total Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">
              {Math.round((gameState.correctAnswers / gameState.totalWords) * 100)}%
            </div>
            <div className="text-sm opacity-75">Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">
              {gameState.wordsLearned.length}
            </div>
            <div className="text-sm opacity-75">Words Learned</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400">
              {gameState.maxStreak}
            </div>
            <div className="text-sm opacity-75">Best Streak</div>
          </div>
        </div>
      </div>

      <p className="text-lg opacity-75 mb-8">
        Your progress has been saved and will be used to optimize your future learning sessions.
      </p>
      
      <div className="text-center text-sm opacity-60">
        Returning to dashboard in a few seconds...
      </div>
    </motion.div>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 flex items-center justify-center px-4">
        {renderGameComplete()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-8">
        {renderGameHeader()}
        
        <div className="max-w-4xl mx-auto">
          {renderWordCard()}
          
          {gameState.gameMode === 'multiple_choice' || gameState.gameMode === 'speed'
            ? renderMultipleChoice()
            : renderTypingInput()
          }
          
          {renderFeedback()}
        </div>

        {/* Navigation */}
        {onExit && (
          <button
            onClick={onExit}
            className="fixed top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Home className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
