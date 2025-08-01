'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Flame, Clock, Trophy, Star, Settings,
  Volume2, VolumeX, Pause, Play, RotateCcw, Maximize, Minimize
} from 'lucide-react';
import { useSounds } from '../hooks/useSounds';
import { useGameVocabulary } from '../../../../hooks/useGameVocabulary';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { StandardVocabularyItem } from '../../../../components/games/templates/GameAssignmentWrapper';

// Enhanced Types
interface TowerBlock {
  id: string;
  type: 'standard' | 'bonus' | 'challenge' | 'fragile';
  word: string;
  translation: string;
  points: number;
  position: number;
  isShaking: boolean;
  createdAt: number;
  responseTime?: number;
}

interface GameState {
  status: 'ready' | 'playing' | 'paused' | 'failed';
  score: number;
  blocksPlaced: number;
  blocksFallen: number;
  currentHeight: number;
  maxHeight: number;
  currentLevel: number;
  accuracy: number;
  streak: number;
  multiplier: number;
  timeLeft: number;
  wordsCompleted: number;
  totalWords: number;
}

interface GameSettings {
  timeLimit: number;
  towerFalling: boolean;
  wordMode: 'vocabulary' | 'sentences';
  difficulty: 'easy' | 'medium' | 'hard';
  vocabularyId: string | null;
  gameMode: 'multiple-choice' | 'typing';
  translationDirection: 'fromNative' | 'toNative';
}

interface WordOption {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
}

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'score' | 'combo' | 'perfect';
  value?: number;
}

interface SentenceTowersMainGameProps {
  onBackToMenu?: () => void;
  assignmentMode?: {
    vocabulary: StandardVocabularyItem[];
    onProgressUpdate: (progress: any) => void;
    onGameComplete: (progress: any) => void;
  };
  isFullscreen?: boolean;
}

export function SentenceTowersMainGame({ 
  onBackToMenu, 
  assignmentMode, 
  isFullscreen = false 
}: SentenceTowersMainGameProps) {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    status: 'ready',
    score: 0,
    blocksPlaced: 0,
    blocksFallen: 0,
    currentHeight: 0,
    maxHeight: 0,
    currentLevel: 1,
    accuracy: 1,
    streak: 0,
    multiplier: 1,
    timeLeft: 180,
    wordsCompleted: 0,
    totalWords: 0
  });

  const [settings, setSettings] = useState<GameSettings>({
    timeLimit: 180,
    towerFalling: true,
    wordMode: 'vocabulary',
    difficulty: 'medium',
    vocabularyId: null,
    gameMode: 'multiple-choice',
    translationDirection: 'fromNative'
  });

  // Game data
  const [towerBlocks, setTowerBlocks] = useState<TowerBlock[]>([]);
  const [fallingBlocks, setFallingBlocks] = useState<string[]>([]);
  const [currentTargetWord, setCurrentTargetWord] = useState<any>(null);
  const [wordOptions, setWordOptions] = useState<WordOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState<'correct' | 'incorrect' | null>(null);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // UI state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [gameVocabulary, setGameVocabulary] = useState<any[]>([]);

  // Hooks
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const sounds = useSounds(soundEnabled);

  // Use assignment vocabulary if provided, otherwise use hook
  const vocabularyHook = useGameVocabulary({
    category: assignmentMode ? 'assignment' : 'basics_core_language',
    subcategory: assignmentMode ? 'assignment' : null,
    language: 'spanish',
    limit: assignmentMode ? assignmentMode.vocabulary.length : 50
  });

  // Set vocabulary based on mode
  useEffect(() => {
    if (assignmentMode) {
      // Transform assignment vocabulary to game format
      const transformedVocab = assignmentMode.vocabulary.map((item, index) => ({
        id: item.id || `word-${index}`,
        word: item.word,
        translation: item.translation,
        difficulty_level: item.difficulty_level || 'intermediate',
        correct: false
      }));
      setGameVocabulary(transformedVocab);
    } else if (vocabularyHook.vocabulary.length > 0) {
      setGameVocabulary(vocabularyHook.vocabulary.map(item => ({
        ...item,
        correct: false
      })));
    }
  }, [assignmentMode, vocabularyHook.vocabulary]);

  // Timer effect
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Game over
          return { ...prev, status: 'failed', timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status]);

  // Generate word options
  const generateWordOptions = useCallback(() => {
    const unusedWords = gameVocabulary.filter(word => !word.correct);
    
    if (unusedWords.length === 0) {
      // Game completed
      setGameState(prev => ({ ...prev, status: 'failed' })); // Will be handled as completion
      return;
    }
    
    // Select a random word as the target
    const shuffledWords = [...unusedWords].sort(() => Math.random() - 0.5);
    const targetWord = shuffledWords[0];
    setCurrentTargetWord(targetWord);
    setQuestionStartTime(Date.now());
    
    if (settings.gameMode === 'multiple-choice') {
      // For multiple choice, select additional options (3 wrong answers)
      const otherWords = shuffledWords.slice(1).slice(0, 3);
      
      // Create options array with 1 correct and 3 incorrect options
      const allOptions = [targetWord, ...otherWords].sort(() => Math.random() - 0.5);
      
      const options = allOptions.map(word => ({
        id: word.id,
        word: word.word,
        translation: word.translation,
        isCorrect: word.id === targetWord.id
      }));
      
      setWordOptions(options);
    }
    // For typing mode, we don't need additional options, just the target word
  }, [gameVocabulary, settings.gameMode]);

  // Start game
  const startGame = () => {
    setGameState({
      status: 'playing',
      score: 0,
      blocksPlaced: 0,
      blocksFallen: 0,
      currentHeight: 0,
      maxHeight: 0,
      currentLevel: 1,
      accuracy: 1,
      streak: 0,
      multiplier: 1,
      timeLeft: settings.timeLimit,
      wordsCompleted: 0,
      totalWords: gameVocabulary.length
    });
    setTowerBlocks([]);
    setFallingBlocks([]);
    setParticleEffects([]);

    // Reset vocabulary to unused state
    const resetVocabulary = gameVocabulary.map((word, index) => ({
      id: word.id || `word-${index}`,
      word: word.word,
      translation: word.translation,
      difficulty: word.difficulty_level === 'beginner' ? 1 :
                 word.difficulty_level === 'intermediate' ? 3 :
                 word.difficulty_level === 'advanced' ? 5 : 2,
      correct: false
    }));
    
    setGameVocabulary(resetVocabulary);
    generateWordOptions();
  };

  // Initialize game when vocabulary is loaded
  useEffect(() => {
    if (gameVocabulary.length > 0 && gameState.status === 'ready') {
      generateWordOptions();
    }
  }, [gameVocabulary, generateWordOptions, gameState.status]);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden`}>
      {/* Game content will be added in the next part */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">🏗️ Sentence Towers</h2>
          <p className="text-xl mb-8">Main game component loaded</p>
          {gameVocabulary.length > 0 && (
            <div>
              <p className="mb-4">Vocabulary loaded: {gameVocabulary.length} words</p>
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Start Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
