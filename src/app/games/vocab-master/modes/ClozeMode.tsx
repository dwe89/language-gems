import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Volume2, Lightbulb, Play, Pause, RotateCcw } from 'lucide-react';
import { ModeComponent } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

interface ClozeModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  playPronunciation: (text: string, language?: 'es' | 'en', word?: any) => void;
}

export const ClozeMode: React.FC<ClozeModeProps> = ({
  gameState,
  userAnswer,
  onAnswerChange,
  onSubmit,
  isAdventureMode,
  playPronunciation
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showHint, setShowHint] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get cloze exercise data from gameState
  const clozeData = gameState.currentExerciseData?.cloze;

  useEffect(() => {
    setShowHint(false); // Reset hint on new word
  }, [gameState.currentWord]);

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

  const getHintText = () => {
    const translation = gameState.currentWord?.translation || gameState.currentWord?.english || '';
    if (!translation) return '';
    return `Translation: "${translation}"`;
  };

  const handlePlayAudio = () => {
    if (clozeData && playPronunciation && !gameState.audioPlaying) {
      setIsPlaying(true);
      playPronunciation(clozeData.sourceSentence, 'es');
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  // Show loading state if exercise data is not ready
  if (!clozeData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className={`rounded-3xl p-8 text-center ${
          isAdventureMode
            ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-2xl'
            : 'bg-white shadow-xl border border-gray-100'
        }`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${
            isAdventureMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Preparing context practice...
          </p>
        </div>
      </div>
    );
  }

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
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-green-500/20' : 'bg-green-100'
            }`}>
              <BookOpen className={`h-5 w-5 ${
                isAdventureMode ? 'text-green-300' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Context Practice
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
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Context Display */}
      <motion.div
        key={gameState.currentWordIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-3xl p-8 ${
          isAdventureMode
            ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-2xl'
            : 'bg-white shadow-xl border border-gray-100'
        }`}
      >
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-4 ${
            isAdventureMode ? 'text-white' : 'text-gray-800'
          }`}>
            Fill in the Blank
          </h2>
          <p className={`text-lg ${
            isAdventureMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Complete the Spanish sentence using context clues
          </p>
        </div>

        {/* Sentence Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spanish Sentence with Blank */}
          <div className={`p-6 rounded-2xl border-2 ${
            isAdventureMode
              ? 'bg-slate-700/40 border-slate-600/30'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isAdventureMode ? 'text-blue-200' : 'text-blue-800'
              }`}>
                Spanish Sentence
              </h3>

              <motion.button
                onClick={handlePlayAudio}
                disabled={gameState.audioPlaying}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  gameState.audioPlaying || isPlaying
                    ? isAdventureMode
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isAdventureMode
                      ? 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 border border-blue-400/50'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
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
                      <Pause className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                    >
                      <Play className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            <p className={`text-xl font-semibold leading-relaxed ${
              isAdventureMode ? 'text-white' : 'text-blue-900'
            }`}>
              {clozeData.blankedSentence}
            </p>
          </div>

          {/* English Translation */}
          <div className={`p-6 rounded-2xl border-2 ${
            isAdventureMode
              ? 'bg-green-800/20 border-green-600/30'
              : 'bg-green-50 border-green-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isAdventureMode ? 'text-green-200' : 'text-green-800'
            }`}>
              English Translation
            </h3>
            <p className={`text-xl font-medium leading-relaxed ${
              isAdventureMode ? 'text-green-100' : 'text-green-900'
            }`}>
              {clozeData.englishTranslation}
            </p>
          </div>
        </div>

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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-semibold ${
              isAdventureMode ? 'text-white' : 'text-gray-800'
            }`}>
              Your Answer
            </h3>

            <motion.button
              onClick={() => setShowHint(!showHint)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                showHint
                  ? isAdventureMode
                    ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/30'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : isAdventureMode
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/30'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Need a Hint?</span>
            </motion.button>
          </div>

          {/* Hint display */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-xl border ${
                  isAdventureMode
                    ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
                    : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <p className="font-medium">
                    💡 {getHintText()}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type the missing Spanish word..."
              className={`w-full p-4 text-xl font-medium rounded-xl transition-all duration-200 ${
                isAdventureMode
                  ? 'bg-slate-700/50 text-white placeholder-slate-400 border-2 border-slate-500/30 focus:border-green-400/50 focus:ring-4 focus:ring-green-400/20'
                  : 'bg-gray-50 text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200/50'
              }`}
              autoFocus
            />

            {/* Input Enhancement */}
            <div className={`absolute inset-0 rounded-xl pointer-events-none ${
              userAnswer.trim()
                ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5'
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
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
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
            💡 Tip: Use the context from both sentences to find the right word
          </div>
        </div>
      </motion.div>
    </div>
  );
};