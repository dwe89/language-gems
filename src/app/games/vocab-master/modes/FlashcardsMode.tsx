import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Volume2, Play, Pause, CreditCard, Zap } from 'lucide-react';
import { ModeComponent } from '../types';

interface FlashcardsModeProps extends ModeComponent {
  onSelfAssessment: (isCorrect: boolean) => void;
  showAnswer: boolean;
}

export const FlashcardsMode: React.FC<FlashcardsModeProps> = ({
  gameState,
  onSelfAssessment,
  showAnswer,
  isAdventureMode,
  playPronunciation
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Reset flip state for new card
    setIsFlipped(false);
  }, [gameState.currentWordIndex]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSelfAssess = (isCorrect: boolean) => {
    onSelfAssessment(isCorrect);
    setIsFlipped(false); // Reset for next card
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState.currentWord && !gameState.audioPlaying) {
      setIsPlaying(true);
      playPronunciation(
        gameState.currentWord?.word || '',
        'es',
        gameState.currentWord
      );
      setTimeout(() => setIsPlaying(false), 2500);
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
            : 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-orange-500/20' : 'bg-orange-100'
            }`}>
              <CreditCard className={`h-5 w-5 ${
                isAdventureMode ? 'text-orange-300' : 'text-orange-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Flashcards
              </h3>
              <p className={`text-sm ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Card {gameState.currentWordIndex + 1} of {gameState.totalWords}
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
                Known
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
                Learning
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
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Flashcard */}
      <div className="perspective-1000">
        <motion.div
          key={gameState.currentWordIndex}
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative preserve-3d"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative preserve-3d cursor-pointer"
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of card */}
            <div
              className={`backface-hidden min-h-[400px] flex flex-col justify-center rounded-3xl p-8 shadow-2xl ${
                isAdventureMode
                  ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-2 border-slate-600/30'
                  : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100'
              }`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center space-y-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-8xl"
                >
                  📚
                </motion.div>

                <h2 className={`text-2xl font-bold ${
                  isAdventureMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Do you know this word?
                </h2>

                <div className="space-y-6">
                  <motion.h3
                    className={`text-6xl font-bold ${
                      isAdventureMode ? 'text-white' : 'text-gray-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {gameState.currentWord?.word || gameState.currentWord?.spanish}
                  </motion.h3>

                  {/* Audio button */}
                  <motion.button
                    onClick={handlePlayAudio}
                    disabled={gameState.audioPlaying}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
                          <Pause className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="play"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                        >
                          <Play className="h-6 w-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <div className={`text-lg ${
                  isAdventureMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  💭 Think about the meaning, then click to reveal
                </div>

                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="flex justify-center"
                >
                  <RotateCcw className={`h-8 w-8 ${
                    isAdventureMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                </motion.div>
              </div>
            </div>

            {/* Back of card */}
            <div
              className={`backface-hidden absolute inset-0 min-h-[400px] flex flex-col justify-center rounded-3xl p-8 shadow-2xl ${
                isAdventureMode
                  ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-2 border-slate-600/30'
                  : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center space-y-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="text-8xl"
                >
                  ✨
                </motion.div>

                <h2 className={`text-2xl font-bold ${
                  isAdventureMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Translation
                </h2>

                <div className="space-y-6">
                  <motion.h3
                    className={`text-5xl font-bold ${
                      isAdventureMode ? 'text-emerald-300' : 'text-emerald-600'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  >
                    {gameState.currentWord?.translation || gameState.currentWord?.english}
                  </motion.h3>

                  {/* Example sentence if available */}
                  {gameState.currentWord?.example_sentence && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className={`p-6 rounded-2xl ${
                        isAdventureMode
                          ? 'bg-slate-700/40 border border-slate-600/30'
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <p className={`text-lg italic mb-2 ${
                        isAdventureMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        "{gameState.currentWord.example_sentence}"
                      </p>
                      {gameState.currentWord.example_translation && (
                        <p className={`text-base ${
                          isAdventureMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          "{gameState.currentWord.example_translation}"
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className={`text-lg ${
                  isAdventureMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  🔄 Click to flip back or assess yourself below
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Self-assessment buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`rounded-2xl p-6 ${
              isAdventureMode
                ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-xl'
                : 'bg-white shadow-lg border border-gray-100'
            }`}
          >
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-2xl font-bold mb-2 ${
                  isAdventureMode ? 'text-white' : 'text-gray-800'
                }`}>
                  How did you do?
                </h3>
                <p className={`text-lg ${
                  isAdventureMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Be honest - it helps you learn better!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => handleSelfAssess(false)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center space-x-3 p-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    isAdventureMode
                      ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-200 border-2 border-red-400/30 shadow-lg hover:shadow-red-500/25'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 border-2 border-red-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <XCircle className="h-6 w-6" />
                  <span>Still Learning</span>
                </motion.button>

                <motion.button
                  onClick={() => handleSelfAssess(true)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center space-x-3 p-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    isAdventureMode
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-200 border-2 border-green-400/30 shadow-lg hover:shadow-green-500/25'
                      : 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 border-2 border-green-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <CheckCircle className="h-6 w-6" />
                  <span>I Knew It!</span>
                </motion.button>
              </div>

              <div className={`text-center text-sm ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                💡 Your honest self-assessment helps our spaced repetition system show you the right words at the right time
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions for new users */}
      <AnimatePresence>
        {!isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 ${
              isAdventureMode
                ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-600/20'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
            }`}
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Zap className={`h-5 w-5 ${
                  isAdventureMode ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <h4 className={`font-bold text-lg ${
                  isAdventureMode ? 'text-white' : 'text-gray-800'
                }`}>
                  How Flashcards Work
                </h4>
                <Zap className={`h-5 w-5 ${
                  isAdventureMode ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                <div className="space-y-2">
                  <p className="flex items-center space-x-2">
                    <span className="text-blue-500 font-bold">1.</span>
                    <span>Study the Spanish word</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">2.</span>
                    <span>Think about its meaning</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center space-x-2">
                    <span className="text-purple-500 font-bold">3.</span>
                    <span>Click to reveal the answer</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-orange-500 font-bold">4.</span>
                    <span>Assess your knowledge honestly</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
