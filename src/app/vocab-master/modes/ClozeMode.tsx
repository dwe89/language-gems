import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, SkipForward } from 'lucide-react';
import { ModeComponent } from '../types';


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
  onExit,
  onModeSpecificAction
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Get cloze exercise data from gameState
  const clozeData = gameState.currentExerciseData?.cloze;



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





  // Show loading state if exercise data is not ready
  if (!clozeData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className="rounded-3xl p-8 text-center bg-white shadow-xl border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
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
        className="rounded-2xl p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-green-100">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                Context Practice
              </h3>
              <p className="text-sm text-gray-600">
                Question {gameState.currentWordIndex + 1} of {gameState.totalWords}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {gameState.correctAnswers}
              </div>
              <div className="text-xs text-gray-500">
                Correct
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {gameState.incorrectAnswers}
              </div>
              <div className="text-xs text-gray-500">
                Incorrect
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {accuracy}%
              </div>
              <div className="text-xs text-gray-500">
                Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 rounded-full overflow-hidden bg-gray-200">
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
        className="rounded-3xl p-8 bg-white shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Fill in the Blank
          </h2>
          <p className="text-lg text-gray-600">
            Complete the Spanish sentence using context clues
          </p>
        </div>

        {/* Sentence Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spanish Sentence with Blank */}
          <div className="p-6 rounded-2xl border-2 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-800">
                Spanish Sentence
              </h3>


            </div>

            <p className="text-xl font-semibold leading-relaxed text-blue-900">
              {clozeData.blankedSentence}
            </p>
          </div>

          {/* English Translation */}
          <div className="p-6 rounded-2xl border-2 bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold mb-4 text-green-800">
              English Translation
            </h3>
            <p className="text-xl font-medium leading-relaxed text-green-900">
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
        className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              Your Answer
            </h3>
            <div className="flex items-center gap-2">
              {onExit && (
                <button
                  onClick={onExit}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              <button
                onClick={() => onModeSpecificAction?.('dont_know')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-100 to-amber-100 hover:from-yellow-200 hover:to-amber-200 text-yellow-800 border border-yellow-300"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </button>
            </div>
          </div>



          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type the missing Spanish word..."
              className="w-full p-4 text-xl font-medium rounded-xl transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200/50"
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
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
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {userAnswer.trim() ? 'Submit Answer' : 'Type your answer first'}
          </motion.button>


        </div>
      </motion.div>
    </div>
  );
};