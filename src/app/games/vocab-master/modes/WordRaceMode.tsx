import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Timer, Target, Flame, CheckCircle2 } from 'lucide-react';
import { ModeComponent } from '../types';

interface WordRaceModeProps extends ModeComponent {
  onWordComplete: (isCorrect: boolean, timeMs: number, word: string) => void;
}

export const WordRaceMode: React.FC<WordRaceModeProps> = ({
  gameState,
  onWordComplete,
  isAdventureMode,
  playPronunciation,
  onModeSpecificAction
}) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const targetWord = gameState.currentWord?.word || gameState.currentWord?.spanish || '';
  const englishWord = gameState.currentWord?.translation || gameState.currentWord?.english || '';

  useEffect(() => {
    // Reset for new word
    setUserInput('');
    setStartTime(null);
    setCurrentTime(0);
    setIsComplete(false);
    
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.currentWordIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setCurrentTime(elapsed);
        
        // Calculate WPM (Words Per Minute)
        const minutes = elapsed / 60000;
        const wordsTyped = userInput.length / 5; // Standard: 5 characters = 1 word
        setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete, userInput.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    // Start timer on first keystroke
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }
    
    // Check for completion
    if (value.toLowerCase().trim() === targetWord.toLowerCase().trim()) {
      const completionTime = Date.now() - (startTime || Date.now());
      setIsComplete(true);
      setCurrentTime(completionTime);
      
      // Update best time
      if (!bestTime || completionTime < bestTime) {
        setBestTime(completionTime);
      }
      
      // Update streak
      setStreak(prev => prev + 1);
      
      onWordComplete(true, completionTime, targetWord);
      
      // Auto-advance after showing completion
      setTimeout(() => {
        if (onModeSpecificAction) {
          onModeSpecificAction('race_complete', { 
            word: targetWord, 
            timeMs: completionTime,
            wpm: wpm
          });
        }
      }, 2000);
    }
  };

  const getAccuracy = () => {
    if (userInput.length === 0) return 100;
    
    let correct = 0;
    const minLength = Math.min(userInput.length, targetWord.length);
    
    for (let i = 0; i < minLength; i++) {
      if (userInput[i].toLowerCase() === targetWord[i].toLowerCase()) {
        correct++;
      }
    }
    
    return Math.round((correct / userInput.length) * 100);
  };

  const getCharacterStatus = (index: number) => {
    if (index >= userInput.length) return 'pending';
    if (userInput[index].toLowerCase() === targetWord[index]?.toLowerCase()) return 'correct';
    return 'incorrect';
  };

  const progressPercentage = ((gameState.currentWordIndex + 1) / gameState.totalWords) * 100;
  const accuracy = getAccuracy();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 ${
          isAdventureMode 
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30' 
            : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-orange-500/20' : 'bg-orange-100'
            }`}>
              <Trophy className={`h-5 w-5 ${
                isAdventureMode ? 'text-orange-300' : 'text-orange-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Word Race
              </h3>
              <p className={`text-sm ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Word {gameState.currentWordIndex + 1} of {gameState.totalWords}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {streak}
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Streak
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {wpm}
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                WPM
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-green-400' : 'text-green-600'
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
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
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
            Race Against Time!
          </h2>
          
          <p className={`text-lg mb-6 ${
            isAdventureMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            English: <span className="font-semibold text-blue-500">{englishWord}</span>
          </p>

          <p className={`text-base mb-8 ${
            isAdventureMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Type the Spanish translation as fast as you can!
          </p>

          {/* Timer Display */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Timer className={`h-6 w-6 ${
              isAdventureMode ? 'text-orange-300' : 'text-orange-600'
            }`} />
            <span className={`text-3xl font-mono font-bold ${
              isAdventureMode ? 'text-orange-300' : 'text-orange-600'
            }`}>
              {(currentTime / 1000).toFixed(2)}s
            </span>
            {bestTime && (
              <span className={`text-lg ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                (Best: {(bestTime / 1000).toFixed(2)}s)
              </span>
            )}
          </div>
        </div>

        {/* Word Display with Character-by-Character Feedback */}
        <div className="mb-8">
          <div className="text-4xl font-mono font-bold mb-6 tracking-wider">
            {targetWord.split('').map((char, index) => {
              const status = getCharacterStatus(index);
              return (
                <motion.span
                  key={index}
                  className={`inline-block ${
                    status === 'correct'
                      ? isAdventureMode ? 'text-green-300 bg-green-500/20' : 'text-green-600 bg-green-100'
                      : status === 'incorrect'
                        ? isAdventureMode ? 'text-red-300 bg-red-500/20' : 'text-red-600 bg-red-100'
                        : index === userInput.length
                          ? isAdventureMode ? 'text-white bg-blue-500/30 animate-pulse' : 'text-gray-800 bg-blue-100 animate-pulse'
                          : isAdventureMode ? 'text-slate-400' : 'text-gray-400'
                  } px-1 rounded`}
                  animate={index === userInput.length ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: index === userInput.length ? Infinity : 0 }}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* Input Field */}
        <div className="mb-8">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isComplete}
            placeholder="Start typing the Spanish translation..."
            className={`w-full max-w-md mx-auto px-6 py-4 text-2xl text-center rounded-2xl border-2 transition-all duration-200 ${
              isComplete
                ? isAdventureMode
                  ? 'bg-green-500/20 border-green-400/50 text-green-300'
                  : 'bg-green-100 border-green-300 text-green-700'
                : isAdventureMode
                  ? 'bg-slate-700/50 border-slate-500/50 text-white placeholder-slate-400 focus:border-blue-400/50 focus:bg-slate-700/70'
                  : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
            } focus:outline-none focus:ring-4 ${
              isAdventureMode ? 'focus:ring-blue-500/20' : 'focus:ring-blue-500/20'
            }`}
          />
        </div>

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
                Race Complete!
              </h3>
              <div className="flex items-center justify-center space-x-6 text-lg">
                <div className={`flex items-center space-x-2 ${
                  isAdventureMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  <Timer className="h-5 w-5" />
                  <span>{(currentTime / 1000).toFixed(2)}s</span>
                </div>
                <div className={`flex items-center space-x-2 ${
                  isAdventureMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  <Zap className="h-5 w-5" />
                  <span>{wpm} WPM</span>
                </div>
                <div className={`flex items-center space-x-2 ${
                  isAdventureMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  <Target className="h-5 w-5" />
                  <span>{accuracy}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!startTime && (
          <div className={`text-center ${
            isAdventureMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            <p className="text-lg mb-2">
              ⚡ Type as fast and accurately as possible!
            </p>
            <p className="text-sm">
              Timer starts when you begin typing
            </p>
          </div>
        )}

        {/* Streak Indicator */}
        {streak > 0 && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={`flex items-center justify-center space-x-2 mt-4 ${
              isAdventureMode ? 'text-yellow-300' : 'text-yellow-600'
            }`}
          >
            <Flame className="h-5 w-5" />
            <span className="font-bold">
              {streak} word streak!
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
