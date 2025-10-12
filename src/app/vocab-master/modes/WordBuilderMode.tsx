import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, CheckCircle2, XCircle, RotateCcw, Zap, ArrowLeft } from 'lucide-react';
import { ModeComponent } from '../types';

interface WordBuilderModeProps extends ModeComponent {
  onLetterComplete: (isCorrect: boolean, letter: string) => void;
}

export const WordBuilderMode: React.FC<WordBuilderModeProps> = ({
  gameState,
  onLetterComplete,
  isAdventureMode,
  playPronunciation,
  onModeSpecificAction,
  onExit
}) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongLettersForCurrentPosition, setWrongLettersForCurrentPosition] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const targetWord = gameState.currentWord?.word || gameState.currentWord?.spanish || '';
  const translation = gameState.currentWord?.translation || gameState.currentWord?.english || '';

  useEffect(() => {
    // Reset for new word
    setCurrentLetterIndex(0);
    setGuessedLetters([]);
    setWrongLettersForCurrentPosition([]);
    setIsComplete(false);
  }, [gameState.currentWordIndex]);

  // Reset wrong letters when moving to next position
  useEffect(() => {
    setWrongLettersForCurrentPosition([]);
  }, [currentLetterIndex]);

  const handleLetterGuess = (letter: string) => {
    const targetLetter = targetWord[currentLetterIndex]?.toLowerCase();
    const isCorrect = letter.toLowerCase() === targetLetter;

    if (isCorrect) {
      const newGuessedLetters = [...guessedLetters, letter.toLowerCase()];
      setGuessedLetters(newGuessedLetters);
      setCurrentLetterIndex(prev => prev + 1);
      
      // Check if word is complete
      if (currentLetterIndex + 1 >= targetWord.length) {
        setIsComplete(true);
        onLetterComplete(true, targetWord);
        
        // Auto-advance after showing success
        setTimeout(() => {
          if (onModeSpecificAction) {
            onModeSpecificAction('word_complete', { word: targetWord });
          }
        }, 2000);
      } else {
        onLetterComplete(true, letter);
      }
    } else {
      setWrongLettersForCurrentPosition(prev => [...prev, letter.toLowerCase()]);
      onLetterComplete(false, letter);
    }
  };

  const getDisplayWord = () => {
    return targetWord.split('').map((letter, index) => {
      if (index < currentLetterIndex) {
        return letter;
      } else if (index === currentLetterIndex) {
        return '_';
      } else {
        return '_';
      }
    }).join('');
  };

  const generateLetterOptions = () => {
    const targetLetter = targetWord[currentLetterIndex]?.toLowerCase();
    const options = new Set([targetLetter]);
    
    // Add some random letters
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    while (options.size < 6) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      options.add(randomLetter);
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const progressPercentage = ((gameState.currentWordIndex + 1) / gameState.totalWords) * 100;
  const wordProgress = (currentLetterIndex / targetWord.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 ${
          isAdventureMode
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30'
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onExit && (
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
            )}
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-green-500/20' : 'bg-green-100'
            }`}>
              <Keyboard className={`h-4 w-4 ${
                isAdventureMode ? 'text-green-300' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Word Builder
              </h3>
              <p className={`text-xs ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Word {gameState.currentWordIndex + 1} of {gameState.totalWords}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isAdventureMode ? 'text-green-400' : 'text-green-600'
            }`}>
              {Math.round(wordProgress)}%
            </div>
            <div className={`text-xs ${
              isAdventureMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Word Progress
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

      {/* Main Game Area */}
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
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-4 ${
            isAdventureMode ? 'text-white' : 'text-gray-800'
          }`}>
            Build the Word
          </h2>
          
          <p className={`text-2xl mb-6 font-semibold ${
            isAdventureMode ? 'text-blue-300' : 'text-blue-600'
          }`}>
            {translation}
          </p>

          {/* Word Display */}
          <div className={`text-6xl font-mono font-bold mb-8 tracking-wider ${
            isAdventureMode ? 'text-white' : 'text-gray-800'
          }`}>
            {getDisplayWord()}
          </div>

          {/* Word Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className={`h-3 rounded-full overflow-hidden ${
              isAdventureMode ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${wordProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className={`text-sm mt-2 ${
              isAdventureMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {currentLetterIndex} of {targetWord.length} letters
            </p>
          </div>
        </div>

        {/* Letter Options */}
        {!isComplete && (
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            {generateLetterOptions().map((letter, index) => (
              <motion.button
                key={`${letter}-${index}`}
                onClick={() => handleLetterGuess(letter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl text-2xl font-bold transition-all duration-200 ${
                  wrongLettersForCurrentPosition.includes(letter)
                    ? isAdventureMode
                      ? 'bg-red-500/20 text-red-300 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 cursor-not-allowed'
                    : isAdventureMode
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-500/30'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
                }`}
                disabled={wrongLettersForCurrentPosition.includes(letter)}
              >
                {letter.toUpperCase()}
              </motion.button>
            ))}
          </div>
        )}

        {/* Completion Message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className={`text-2xl font-bold mb-2 ${
                isAdventureMode ? 'text-green-300' : 'text-green-600'
              }`}>
                Word Complete!
              </h3>
              <p className={`text-lg ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Great job building "{targetWord}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>


      </motion.div>
    </div>
  );
};
