'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { 
  Home, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  Keyboard,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight
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
  // User progress
  times_seen: number;
  times_correct: number;
  last_seen?: Date;
  is_learned: boolean;
}

interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

interface GameState {
  currentWord: VocabularyWord | null;
  userAnswer: string;
  selectedChoice: number | null;
  showAnswer: boolean;
  isAnswerRevealed: boolean;
  score: number;
  wordsLearned: number;
  currentWordIndex: number;
  isComplete: boolean;
  gameMode: 'typing' | 'multiple_choice';
  multipleChoiceOptions: MultipleChoiceOption[];
  feedback: { type: 'correct' | 'incorrect' | null; message: string };
}

interface Props {
  mode?: 'free_play' | 'assignment';
  assignmentId?: string;
  config?: Record<string, any>;
  onGameComplete?: (results: any) => void;
  onExit?: () => void;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function EnhancedGemCollector({
  mode = 'free_play',
  assignmentId,
  config = {},
  onGameComplete,
  onExit
}: Props) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [gameState, setGameState] = useState<GameState>({
    currentWord: null,
    userAnswer: '',
    selectedChoice: null,
    showAnswer: false,
    isAnswerRevealed: false,
    score: 0,
    wordsLearned: 0,
    currentWordIndex: 0,
    isComplete: false,
    gameMode: 'typing',
    multipleChoiceOptions: [],
    feedback: { type: null, message: '' }
  });

  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      setLoading(true);
      
      const words = config.vocabulary || [];
      if (words.length === 0) {
        setGameState(prev => ({ 
          ...prev, 
          feedback: { type: 'incorrect', message: 'No vocabulary selected!' } 
        }));
        setLoading(false);
        return;
      }

      // Load user progress for these words
      const wordsWithProgress = await loadWordProgress(words);
      setVocabularyWords(wordsWithProgress);
      
      // Start with first word
      loadNextWord(wordsWithProgress, 0);
      setLoading(false);
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setLoading(false);
    }
  };

  const loadWordProgress = async (words: any[]): Promise<VocabularyWord[]> => {
    if (!user) {
      // Guest mode - no progress tracking
      return words.map((word: any) => ({
        ...word,
        times_seen: 0,
        times_correct: 0,
        is_learned: false
      }));
    }

    try {
      const { data: progress } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('vocabulary_id', words.map((w: any) => w.id));

      return words.map((word: any) => {
        const userProgress = progress?.find(p => p.vocabulary_id === word.id);
        return {
          ...word,
          times_seen: userProgress?.times_seen || 0,
          times_correct: userProgress?.times_correct || 0,
          last_seen: userProgress?.last_seen ? new Date(userProgress.last_seen) : undefined,
          is_learned: userProgress?.is_learned || false
        };
      });
    } catch (error) {
      console.error('Failed to load progress:', error);
      return words.map((word: any) => ({
        ...word,
        times_seen: 0,
        times_correct: 0,
        is_learned: false
      }));
    }
  };

  // =====================================================
  // GAME LOGIC
  // =====================================================

  const validateAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    const userAnswerClean = userAnswer.trim().toLowerCase();
    
    // Split by multiple delimiters: comma, pipe (|), semicolon
    const correctAnswers = correctAnswer
      .split(/[,|;]/)
      .map(ans => ans.trim().toLowerCase())
      .filter(ans => ans.length > 0);
    
    // Also handle parenthetical variations like "(to) turn on"
    const expandedAnswers = correctAnswers.flatMap(answer => {
      const variations = [answer];
      
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
      
      // Remove parentheses and accept the clean version
      const withoutParens = answer.replace(/[()]/g, '').trim();
      if (withoutParens !== answer) {
        variations.push(withoutParens);
      }
      
      return variations;
    });
    
    // Check if user answer matches any of the variations
    return expandedAnswers.some(answer => answer === userAnswerClean);
  };

  const generateMultipleChoiceOptions = (correctWord: VocabularyWord, allWords: VocabularyWord[]): MultipleChoiceOption[] => {
    const options: MultipleChoiceOption[] = [];
    
    // Add correct answer
    options.push({ text: correctWord.english, isCorrect: true });
    
    // Add 3 wrong answers from other words
    const wrongAnswers = allWords
      .filter(w => w.id !== correctWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => ({ text: w.english.split(',')[0].trim(), isCorrect: false }));
    
    options.push(...wrongAnswers);
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  const toggleGameMode = () => {
    setGameState(prev => ({
      ...prev,
      gameMode: prev.gameMode === 'typing' ? 'multiple_choice' : 'typing',
      userAnswer: '',
      selectedChoice: null,
      showAnswer: false,
      isAnswerRevealed: false,
      feedback: { type: null, message: '' }
    }));
    
    // Regenerate options if switching to multiple choice
    if (gameState.gameMode === 'typing' && gameState.currentWord) {
      const options = generateMultipleChoiceOptions(gameState.currentWord, vocabularyWords);
      setGameState(prev => ({ ...prev, multipleChoiceOptions: options }));
    }
  };

  const loadNextWord = (words: VocabularyWord[] = vocabularyWords, index: number = gameState.currentWordIndex) => {
    if (index >= words.length) {
      completeGame();
      return;
    }

    const word = words[index];
    const options = gameState.gameMode === 'multiple_choice' 
      ? generateMultipleChoiceOptions(word, words)
      : [];

    setGameState(prev => ({
      ...prev,
      currentWord: word,
      userAnswer: '',
      selectedChoice: null,
      showAnswer: false,
      isAnswerRevealed: false,
      currentWordIndex: index,
      multipleChoiceOptions: options,
      feedback: { type: null, message: '' }
    }));

    // Focus input for typing mode
    if (gameState.gameMode === 'typing') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

    const handleSubmit = async () => {
    if (!gameState.currentWord) return;
    
    let isCorrect = false;
    let userAnswer = '';

    if (gameState.gameMode === 'typing') {
      if (gameState.userAnswer.trim() === '') return;
      userAnswer = gameState.userAnswer;
      isCorrect = validateAnswer(gameState.userAnswer, gameState.currentWord.english);
    } else {
      if (gameState.selectedChoice === null) return;
      const selectedOption = gameState.multipleChoiceOptions[gameState.selectedChoice];
      userAnswer = selectedOption.text;
      isCorrect = selectedOption.isCorrect;
    }

    const points = isCorrect ? (gameState.isAnswerRevealed ? 50 : 100) : 0;

    // Update word progress
    const updatedWord = {
      ...gameState.currentWord,
      times_seen: gameState.currentWord.times_seen + 1,
      times_correct: gameState.currentWord.times_correct + (isCorrect ? 1 : 0),
      last_seen: new Date(),
      is_learned: isCorrect && (gameState.currentWord.times_correct + 1) >= 3 // Learned after 3 correct
    };

    // Update vocabulary array
    const updatedVocab = vocabularyWords.map(word => 
      word.id === updatedWord.id ? updatedWord : word
    );
    setVocabularyWords(updatedVocab);

    // Save progress
    if (user) {
      await saveWordProgress(updatedWord, isCorrect);
    }

    // Update game state
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      wordsLearned: updatedVocab.filter(w => w.is_learned).length,
      feedback: {
        type: isCorrect ? 'correct' : 'incorrect',
        message: isCorrect 
          ? `Correct! +${points} points` 
          : `Correct answer: "${gameState.currentWord?.english || ''}"`
      }
    }));

    // Move to next word after delay
    setTimeout(() => {
      loadNextWord(updatedVocab, gameState.currentWordIndex + 1);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const revealAnswer = () => {
    if (gameState.gameMode === 'typing') {
      setGameState(prev => ({
        ...prev,
        showAnswer: true,
        isAnswerRevealed: true,
        userAnswer: prev.currentWord?.english || ''
      }));
    } else {
      // For multiple choice, highlight the correct answer
      const correctIndex = gameState.multipleChoiceOptions.findIndex(option => option.isCorrect);
      setGameState(prev => ({
        ...prev,
        showAnswer: true,
        isAnswerRevealed: true,
        selectedChoice: correctIndex
      }));
    }
  };

  const saveWordProgress = async (word: VocabularyWord, correct: boolean) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_vocabulary_progress')
        .upsert({
          user_id: user.id,
          vocabulary_id: word.id,
          times_seen: word.times_seen,
          times_correct: word.times_correct,
          last_seen: word.last_seen,
          is_learned: word.is_learned,
          updated_at: new Date()
        });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const completeGame = () => {
    setGameState(prev => ({ ...prev, isComplete: true }));
    
    const results = {
      score: gameState.score,
      totalWords: vocabularyWords.length,
      wordsLearned: gameState.wordsLearned,
      accuracy: vocabularyWords.length > 0 
        ? (vocabularyWords.reduce((sum, w) => sum + w.times_correct, 0) / vocabularyWords.reduce((sum, w) => sum + w.times_seen, 0)) * 100 
        : 0
    };

    setTimeout(() => onGameComplete?.(results), 3000);
  };

  const restartGame = () => {
    setGameState({
      currentWord: null,
      userAnswer: '',
      selectedChoice: null,
      showAnswer: false,
      isAnswerRevealed: false,
      score: 0,
      wordsLearned: 0,
      currentWordIndex: 0,
      isComplete: false,
      gameMode: 'typing',
      multipleChoiceOptions: [],
      feedback: { type: null, message: '' }
    });
    loadNextWord(vocabularyWords, 0);
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  if (gameState.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Session Complete!</h1>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-lg mx-auto mb-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-bold">{gameState.score}</span>
              </div>
              <div className="flex justify-between">
                <span>Words Learned:</span>
                <span className="font-bold">{gameState.wordsLearned}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Words:</span>
                <span className="font-bold">{vocabularyWords.length}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={restartGame}
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Header */}
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
              <span className="font-bold">{gameState.score}</span>
            </div>
            
            <div className="text-white">
              <span className="text-sm opacity-80">Learned: </span>
              <span className="font-bold">{gameState.wordsLearned}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mode Toggle */}
            <button
              onClick={toggleGameMode}
              className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
            >
              {gameState.gameMode === 'typing' ? <Keyboard className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
              <span>{gameState.gameMode === 'typing' ? 'Typing' : 'Multiple Choice'}</span>
            </button>
            
            <div className="text-white text-sm">
              {gameState.currentWordIndex + 1} / {vocabularyWords.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex items-center justify-center p-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-2xl w-full">
          {gameState.currentWord && (
            <motion.div
              key={gameState.currentWord.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              {/* Word Display */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    <span>Seen: {gameState.currentWord.times_seen}</span>
                    <span>•</span>
                    <span>Correct: {gameState.currentWord.times_correct}</span>
                  </div>
                </div>
                
                <h2 className="text-5xl font-bold text-gray-800 mb-4">
                  {gameState.currentWord.spanish}
                </h2>
                
                <p className="text-gray-600 capitalize mb-6">
                  {gameState.currentWord.part_of_speech} • {gameState.currentWord.topic}
                </p>

                {gameState.currentWord.is_learned && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Learned
                    </span>
                  </div>
                )}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {gameState.feedback.type && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                      gameState.feedback.type === 'correct' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {gameState.feedback.type === 'correct' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <p className={`font-medium ${
                      gameState.feedback.type === 'correct' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {gameState.feedback.message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              {!gameState.feedback.type && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      {gameState.gameMode === 'typing' 
                        ? 'Type the English translation:' 
                        : 'Choose the correct English translation:'}
                    </label>
                  </div>
                  
                  {gameState.gameMode === 'typing' ? (
                    // Typing Mode
                    <>
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={gameState.userAnswer}
                          onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                          onKeyPress={handleKeyPress}
                          className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Type your answer..."
                          disabled={gameState.showAnswer}
                        />
                        <Keyboard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={handleSubmit}
                          disabled={gameState.userAnswer.trim() === ''}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <span>Submit</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={revealAnswer}
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          {gameState.showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span>Show Answer</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    // Multiple Choice Mode
                    <>
                      <div className="space-y-3">
                        {gameState.multipleChoiceOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => !gameState.showAnswer && setGameState(prev => ({ ...prev, selectedChoice: index }))}
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

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={handleSubmit}
                          disabled={gameState.selectedChoice === null}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <span>Submit</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={revealAnswer}
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          {gameState.showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span>Show Answer</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Continue Button */}
              {gameState.feedback.type && (
                <div className="text-center">
                  <button
                    onClick={() => loadNextWord(vocabularyWords, gameState.currentWordIndex + 1)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
