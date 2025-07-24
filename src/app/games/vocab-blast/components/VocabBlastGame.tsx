'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { GameVocabularyWord } from '../../../../hooks/useGameVocabulary';
import { VocabBlastGameSettings } from '../page';
import { useTheme } from '../../noughts-and-crosses/components/ThemeProvider';
import { useAudio } from '../../noughts-and-crosses/hooks/useAudio';
import VocabBlastEngine from './VocabBlastEngine';

interface VocabBlastGameProps {
  settings: VocabBlastGameSettings;
  vocabulary: GameVocabularyWord[];
  onBackToMenu: () => void;
  onGameEnd: (result: { outcome: 'win' | 'loss' | 'timeout'; score: number; wordsLearned: number }) => void;
}

export interface VocabItem {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  type: 'correct' | 'decoy';
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  wordsLearned: number;
  accuracy: number;
  timeLeft: number;
  lives: number;
  totalAttempts: number;
}

export default function VocabBlastGame({ 
  settings, 
  vocabulary, 
  onBackToMenu, 
  onGameEnd 
}: VocabBlastGameProps) {
  const { themeClasses } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSFX, playThemeSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(soundEnabled);

  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState<GameVocabularyWord | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    wordsLearned: 0,
    accuracy: 0,
    timeLeft: settings.timeLimit,
    lives: 3,
    totalAttempts: 0
  });

  // Vocabulary management
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [availableWords, setAvailableWords] = useState<GameVocabularyWord[]>([]);

  // Timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordSpawnRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  useEffect(() => {
    if (vocabulary.length > 0) {
      setAvailableWords([...vocabulary]);
      selectNextWord();
      setGameActive(true);
      startTimer();
      startWordSpawning();
      startBackgroundMusic(settings.theme);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (wordSpawnRef.current) {
        clearInterval(wordSpawnRef.current);
      }
      stopBackgroundMusic();
    };
  }, [vocabulary]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setGameStats(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          endGame('timeout');
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  };

  const startWordSpawning = () => {
    if (wordSpawnRef.current) {
      clearInterval(wordSpawnRef.current);
    }

    // Spawn new words every 12-18 seconds (longer intervals)
    wordSpawnRef.current = setInterval(() => {
      if (gameActive && !isPaused) {
        selectNextWord();
      }
    }, 12000 + Math.random() * 6000);
  };

  const selectNextWord = () => {
    const unused = availableWords.filter(word => !usedWords.has(word.id));
    
    if (unused.length === 0) {
      // Reset if we've used all words
      setUsedWords(new Set());
      setCurrentWord(availableWords[Math.floor(Math.random() * availableWords.length)]);
    } else {
      const nextWord = unused[Math.floor(Math.random() * unused.length)];
      setCurrentWord(nextWord);
    }
  };

  const handleCorrectAnswer = (word: GameVocabularyWord) => {
    playSFX('correct-answer');
    playThemeSFX(settings.theme);

    setGameStats(prev => {
      const newWordsLearned = prev.wordsLearned + 1;
      const newTotalAttempts = prev.totalAttempts + 1;

      return {
        ...prev,
        score: prev.score + (10 * (prev.combo + 1)),
        combo: prev.combo + 1,
        maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
        wordsLearned: newWordsLearned,
        totalAttempts: newTotalAttempts,
        accuracy: (newWordsLearned / newTotalAttempts) * 100
      };
    });

    setUsedWords(prev => new Set([...prev, word.id]));
    selectNextWord();
  };

  const handleIncorrectAnswer = () => {
    playSFX('wrong-answer');

    setGameStats(prev => {
      const newLives = prev.lives - 1;
      const newTotalAttempts = prev.totalAttempts + 1;

      // Check if game should end due to no lives
      if (newLives <= 0) {
        setTimeout(() => endGame('loss'), 100);
      }

      return {
        ...prev,
        combo: 0,
        lives: newLives,
        totalAttempts: newTotalAttempts,
        accuracy: prev.wordsLearned > 0 ? (prev.wordsLearned / newTotalAttempts) * 100 : 0
      };
    });

    // Continue spawning new words even after wrong answer
    if (gameStats.lives > 1) {
      selectNextWord();
    }
  };

  const togglePause = () => {
    playSFX('button-click');
    setIsPaused(!isPaused);
    
    if (!isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      startTimer();
    }
  };

  const endGame = (outcome: 'win' | 'loss' | 'timeout') => {
    setGameActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    stopBackgroundMusic();
    
    onGameEnd({
      outcome,
      score: gameStats.score,
      wordsLearned: gameStats.wordsLearned
    });
  };

  const getThemeTitle = () => {
    switch (settings.theme) {
      case 'tokyo':
        return '🌃 Neon Hack';
      case 'pirate':
        return '🏴‍☠️ Cannon Clash';
      case 'space':
        return '🚀 Comet Catch';
      case 'temple':
        return '🔥 Rising Lava Quiz';
      default:
        return '💎 Vocab Blast';
    }
  };

  const getThemeInstruction = () => {
    switch (settings.theme) {
      case 'tokyo':
        return 'Click the correct data packet to hack the system';
      case 'pirate':
        return 'Fire at the ship with the correct translation';
      case 'space':
        return 'Collect the comet with the right answer';
      case 'temple':
        return 'Click the stone tablet before the lava rises';
      default:
        return 'Click the gem with the correct translation';
    }
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Game UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 pointer-events-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToMenu}
              className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Menu
            </button>
            
            <button
              onClick={togglePause}
              className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{getThemeTitle()}</h1>
            <p className="text-sm text-slate-300">{getThemeInstruction()}</p>
          </div>

          <div className="text-right text-white">
            <div className="text-2xl font-bold">⏱️ {Math.floor(gameStats.timeLeft / 60)}:{(gameStats.timeLeft % 60).toString().padStart(2, '0')}</div>
            <div className="text-sm">Score: {gameStats.score}</div>
            <div className="text-sm flex items-center gap-1">
              Lives: {Array.from({ length: gameStats.lives }, (_, i) => '❤️').join('')}
              {Array.from({ length: 3 - gameStats.lives }, (_, i) => '🖤').join('')}
            </div>
          </div>
        </div>

        {/* Current Word Display */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/70 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-center border border-white/20"
          >
            <div className="text-sm text-slate-300 mb-1">Translate:</div>
            <div className="text-3xl font-bold">{currentWord.word}</div>
          </motion.div>
        </div>

        {/* Game Stats */}
        <div className="absolute bottom-4 left-4 text-white pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
            <div className="text-sm">
              <div>Combo: {gameStats.combo}x</div>
              <div>Words Learned: {gameStats.wordsLearned}</div>
              <div>Accuracy: {Math.round(gameStats.accuracy)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Engine */}
      <VocabBlastEngine
        theme={settings.theme}
        currentWord={currentWord}
        vocabulary={availableWords}
        onCorrectAnswer={handleCorrectAnswer}
        onIncorrectAnswer={handleIncorrectAnswer}
        isPaused={isPaused}
        gameActive={gameActive}
        difficulty={settings.difficulty}
        playSFX={playSFX}
      />

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Game Paused</h2>
              <button
                onClick={togglePause}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Resume Game
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
