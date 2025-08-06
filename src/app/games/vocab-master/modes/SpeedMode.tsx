import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { ModeComponent } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

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
  onTimeUp
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

  const baseClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-white rounded-xl shadow-lg p-8";

  const timerColor = timeLeft <= 3 ? 'text-red-400' : timeLeft <= 6 ? 'text-yellow-400' : 'text-green-400';
  const timerBgColor = timeLeft <= 3 ? 'bg-red-500/20' : timeLeft <= 6 ? 'bg-yellow-500/20' : 'bg-green-500/20';

  return (
    <div className="space-y-8">
      {/* Word display with timer */}
      <motion.div
        key={gameState.currentWordIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={baseClasses}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl">
            <Zap className="h-16 w-16 text-yellow-300 mx-auto" />
          </div>
          
          <h2 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
            ⚡ Speed Challenge
          </h2>

          {/* Timer display */}
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${timerBgColor}`}
          >
            <Clock className={`h-5 w-5 ${timerColor}`} />
            <div className={`text-2xl font-bold ${timerColor}`}>
              {timeLeft}s
            </div>
          </motion.div>

          {/* Word to translate */}
          <motion.div
            key={`word-${gameState.currentWordIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-2"
          >
            <h3 className={`text-4xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
              {gameState.currentWord?.spanish || gameState.currentWord?.word}
            </h3>
            <p className={`text-sm ${isAdventureMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Translate quickly!
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Input area */}
      <div className={baseClasses}>
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
            Quick translation:
          </h3>
          
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={getPlaceholderText('speed')}
              className={`w-full p-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                isAdventureMode
                  ? 'bg-slate-700/50 text-white placeholder-slate-400 border border-slate-500/30 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20'
                  : 'bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200'
              }`}
              autoFocus
              disabled={timeLeft === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-lg pointer-events-none" />
          </div>

          <button
            onClick={onSubmit}
            disabled={!userAnswer.trim() || timeLeft === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              userAnswer.trim() && timeLeft > 0
                ? isAdventureMode
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg hover:shadow-yellow-500/25'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {timeLeft === 0 ? 'Time\'s Up!' : 'Submit Fast!'}
          </button>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full transition-all duration-200 ${
                  i < timeLeft 
                    ? timerColor.replace('text-', 'bg-')
                    : isAdventureMode 
                      ? 'bg-slate-600' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
