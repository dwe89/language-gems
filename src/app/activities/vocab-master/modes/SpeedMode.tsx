import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, ArrowLeft } from 'lucide-react';
import { ModeComponent, VocabularyWord } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

// Calculate dynamic time based on word complexity - simplified formula
const calculateWordTime = (word: VocabularyWord): number => {
  const translation = word.english || word.translation || '';
  const spanish = word.spanish || word.word || '';
  
  // Simple, transparent formula: 2 seconds base + 0.25 seconds per letter
  const baseTime = 2;
  const timePerLetter = 0.25;
  const letterCount = Math.max(translation.length, spanish.length);
  
  const calculatedTime = baseTime + (timePerLetter * letterCount);
  
  // Minimum 3 seconds, maximum 8 seconds
  return Math.max(3, Math.min(8, Math.round(calculatedTime)));
};

interface SpeedModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  timeLeft: number;
  onTimeUp: () => void;
}

export const SpeedMode: React.FC<SpeedModeProps> = ({
  gameState,
  userAnswer,
  onAnswerChange,
  onSubmit,
  isAdventureMode,
  timeLeft,
  onTimeUp,
  onExit
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when word changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.currentWordIndex]);

  useEffect(() => {
    // Handle time up
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  // Calculate dynamic time for current word
  const dynamicTime = gameState.currentWord ? calculateWordTime(gameState.currentWord) : 5;
  const timePercentage = (timeLeft / dynamicTime) * 100;


  // Helper function to get letter-by-letter feedback
  const getLetterFeedback = () => {
    const correctAnswer = (gameState.currentWord?.english || gameState.currentWord?.translation || '').toLowerCase();
    const userInput = userAnswer.toLowerCase();
    
    return userInput.split('').map((letter, index) => {
      if (index >= correctAnswer.length) {
        return { letter: userAnswer[index], status: 'extra' };
      }
      if (letter === correctAnswer[index]) {
        return { letter: userAnswer[index], status: 'correct' }; // Keep original case
      }
      return { letter: userAnswer[index], status: 'incorrect' }; // Keep original case
    });
  };

  const letterFeedback = getLetterFeedback();

  const timerColor = timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 6 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className={`${isAdventureMode ? adventureTheme.background : "bg-gray-50"} min-h-screen relative`}>
      {/* Full-width timer progress bar at the top */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-300 z-50">
        <motion.div
          className={`h-full ${timerColor} origin-left`}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: timePercentage / 100 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-8 pt-16">
        {/* Back button and header */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          {onExit && (
            <div className="flex justify-start mb-4">
              <button
                onClick={onExit}
                className={`${
                  isAdventureMode
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/30'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                } px-2 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          )}
          {/* Adventure Mode Header - Simplified */}
          {isAdventureMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-white mb-2">
                {adventureTheme.emoji} Speed Challenge
              </h1>
            </motion.div>
          )}
        </div>

        {/* Main game area - focused on the word */}
        <div className="max-w-2xl mx-auto w-full space-y-8 text-center">
          
          {/* Timer display - compact */}
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm"
          >
            <Clock className={`h-4 w-4 ${timeLeft <= 3 ? 'text-red-400' : timeLeft <= 6 ? 'text-yellow-400' : 'text-green-400'}`} />
            <div className={`text-lg font-bold ${timeLeft <= 3 ? 'text-red-400' : timeLeft <= 6 ? 'text-yellow-400' : 'text-green-400'}`}>
              {timeLeft}s
            </div>
          </motion.div>

          {/* The Spanish Word - CENTERPIECE */}
          <motion.div
            key={`word-${gameState.currentWordIndex}`}
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className={`text-8xl font-bold tracking-tight ${isAdventureMode ? 'text-white' : 'text-gray-800'} drop-shadow-lg`}>
              {gameState.currentWord?.spanish || gameState.currentWord?.word}
            </div>
            <div className={`text-lg ${isAdventureMode ? 'text-white/80' : 'text-gray-600'}`}>
              Type the English translation quickly!
            </div>
          </motion.div>

          {/* Input with instant visual feedback */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Visual feedback display */}
            <div className="min-h-[3rem] flex items-center justify-center">
              <div className={`text-3xl font-mono tracking-wide ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
                {letterFeedback.length > 0 ? (
                  letterFeedback.map((item, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        item.status === 'correct' 
                          ? 'text-green-500 bg-green-500/20' 
                          : item.status === 'incorrect'
                          ? 'text-red-500 bg-red-500/20'
                          : 'text-orange-500 bg-orange-500/20'
                      } px-1 rounded transition-colors duration-200`}
                    >
                      {item.letter}
                    </motion.span>
                  ))
                ) : (
                  <span className={`${isAdventureMode ? 'text-white/40' : 'text-gray-400'}`}>
                    Start typing...
                  </span>
                )}
              </div>
            </div>
            
            {/* Hidden input for keyboard capture */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type here and press Enter..."
                className={`w-full p-4 rounded-xl text-lg font-medium text-center transition-all duration-200 ${
                  isAdventureMode
                    ? 'bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border-2 border-white/20 focus:border-white/40 focus:ring-4 focus:ring-white/20'
                    : 'bg-white text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 shadow-lg'
                }`}
                autoFocus
                disabled={timeLeft === 0}
              />
              
              {/* Subtle submit button for mobile users */}
              <button
                onClick={onSubmit}
                disabled={!userAnswer.trim() || timeLeft === 0}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 md:hidden ${
                  userAnswer.trim() && timeLeft > 0
                    ? isAdventureMode
                      ? 'bg-white/20 hover:bg-white/30 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ↵
              </button>
            </div>

            {/* Keyboard hint */}
            <div className={`text-sm ${isAdventureMode ? 'text-white/60' : 'text-gray-500'}`}>
              Press <kbd className={`px-2 py-1 rounded text-xs ${isAdventureMode ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>Enter</kbd> to submit
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
