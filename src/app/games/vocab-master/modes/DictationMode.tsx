import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Volume2, RotateCcw, Play, Pause } from 'lucide-react';
import { ModeComponent } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

interface DictationModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  canReplayAudio: boolean;
  onReplayAudio: () => void;
  audioReplayCount: number;
}

export const DictationMode: React.FC<DictationModeProps> = ({
  gameState,
  userAnswer,
  onAnswerChange,
  onSubmit,
  isAdventureMode,
  playPronunciation,
  canReplayAudio,
  onReplayAudio,
  audioReplayCount
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastPlayedWordRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedInitial, setHasPlayedInitial] = useState(false);

  useEffect(() => {
    // Auto-play audio when word loads
    if (gameState.currentWord && !hasPlayedInitial) {
      const currentWordKey = `${gameState.currentWord.id}-dictation`;

      if (lastPlayedWordRef.current !== currentWordKey) {
        lastPlayedWordRef.current = currentWordKey;
        setHasPlayedInitial(false);

        const timer = setTimeout(() => {
          // Double-check the word hasn't changed while we were waiting
          if (lastPlayedWordRef.current === currentWordKey && gameState.currentWord) {
            setIsPlaying(true);
            playPronunciation(
              gameState.currentWord?.word || '',
              'es',
              gameState.currentWord || undefined
            );
            setHasPlayedInitial(true);
            setTimeout(() => setIsPlaying(false), 2000);
          }
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentWord, playPronunciation, hasPlayedInitial]);

  useEffect(() => {
    // Reset for new word
    setHasPlayedInitial(false);
  }, [gameState.currentWordIndex]);

  useEffect(() => {
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.currentWordIndex]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  const handlePlayAudio = () => {
    if (gameState.currentWord && !gameState.audioPlaying) {
      setIsPlaying(true);
      playPronunciation(
        gameState.currentWord?.word || '',
        'es',
        gameState.currentWord || undefined
      );
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const progressPercentage = ((gameState.currentWordIndex + 1) / gameState.totalWords) * 100;
  const accuracy = gameState.correctAnswers + gameState.incorrectAnswers > 0
    ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 ${
          isAdventureMode
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <Headphones className={`h-5 w-5 ${
                isAdventureMode ? 'text-blue-300' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Dictation Challenge
              </h3>
              <p className={`text-sm ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Question {gameState.currentWordIndex + 1} of {gameState.totalWords}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {gameState.correctAnswers}
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Correct
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {gameState.incorrectAnswers}
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Incorrect
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {accuracy}%
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className={`h-2 rounded-full overflow-hidden ${
            isAdventureMode ? 'bg-slate-700' : 'bg-gray-200'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Audio Interface */}
      <motion.div
        key={gameState.currentWordIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-3xl p-8 text-center ${
          isAdventureMode
            ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-2xl'
            : 'bg-white shadow-xl border border-gray-100'
        }`}
      >
        {/* Audio Visualization */}
        <div className="mb-8">
          <motion.div
            animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.6, repeat: isPlaying ? Infinity : 0 }}
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              isAdventureMode
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/30'
                : 'bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-200'
            }`}
          >
            <Headphones className={`h-12 w-12 ${
              isAdventureMode ? 'text-blue-300' : 'text-blue-600'
            }`} />
          </motion.div>
        </div>

        <h2 className={`text-3xl font-bold mb-4 ${
          isAdventureMode ? 'text-white' : 'text-gray-800'
        }`}>
          Listen & Type
        </h2>

        <p className={`text-lg mb-8 ${
          isAdventureMode ? 'text-slate-300' : 'text-gray-600'
        }`}>
          Listen carefully to the Spanish word and type exactly what you hear
        </p>

        {/* Audio Controls */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <motion.button
            onClick={handlePlayAudio}
            disabled={gameState.audioPlaying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-full transition-all duration-200 ${
              gameState.audioPlaying || isPlaying
                ? isAdventureMode
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAdventureMode
                  ? 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 border-2 border-blue-400/50 shadow-lg hover:shadow-blue-500/25'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <AnimatePresence mode="wait">
              {gameState.audioPlaying || isPlaying ? (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <Pause className="h-8 w-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <Play className="h-8 w-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {canReplayAudio && audioReplayCount < 2 && (
            <motion.button
              onClick={onReplayAudio}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 ${
                isAdventureMode
                  ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-500/30'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200'
              }`}
            >
              <RotateCcw className="h-5 w-5" />
            </motion.button>
          )}
        </div>

        {/* Replay Counter */}
        {canReplayAudio && (
          <div className={`text-sm mb-6 ${
            isAdventureMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            {2 - audioReplayCount} replays remaining
          </div>
        )}
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-6 ${
          isAdventureMode
            ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-xl'
            : 'bg-white shadow-lg border border-gray-100'
        }`}
      >
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold ${
            isAdventureMode ? 'text-white' : 'text-gray-800'
          }`}>
            Your Answer
          </h3>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type what you heard in Spanish..."
              className={`w-full p-4 text-xl font-medium rounded-xl transition-all duration-200 ${
                isAdventureMode
                  ? 'bg-slate-700/50 text-white placeholder-slate-400 border-2 border-slate-500/30 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/20'
                  : 'bg-gray-50 text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50'
              }`}
              autoFocus
            />

            {/* Input Enhancement */}
            <div className={`absolute inset-0 rounded-xl pointer-events-none ${
              userAnswer.trim()
                ? 'bg-gradient-to-r from-green-500/5 to-blue-500/5'
                : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
            }`} />

            {/* Character Count */}
            {userAnswer.length > 0 && (
              <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-400'
              }`}>
                {userAnswer.length}
              </div>
            )}
          </div>

          <motion.button
            onClick={onSubmit}
            disabled={!userAnswer.trim()}
            whileHover={userAnswer.trim() ? { scale: 1.02 } : {}}
            whileTap={userAnswer.trim() ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              userAnswer.trim()
                ? isAdventureMode
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                : isAdventureMode
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {userAnswer.trim() ? 'Submit Answer' : 'Type your answer first'}
          </motion.button>

          {/* Helpful Tips */}
          <div className={`text-center text-sm ${
            isAdventureMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            💡 Tip: Press Enter to submit your answer quickly
          </div>
        </div>
      </motion.div>
    </div>
  );
};
