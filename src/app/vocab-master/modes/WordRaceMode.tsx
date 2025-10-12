import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Timer, Target, Flame, CheckCircle2, SkipForward, ArrowLeft } from 'lucide-react';
import { ModeComponent } from '../types';

interface WordRaceModeProps extends ModeComponent {
  onWordComplete: (isCorrect: boolean, timeMs: number, word: string) => void;
}

export const WordRaceMode: React.FC<WordRaceModeProps> = ({
  gameState,
  onWordComplete,
  playPronunciation,
  onModeSpecificAction,
  onExit
}) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accentTip, setAccentTip] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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

  // Keyboard shortcut: Esc to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isComplete) {
        e.preventDefault();
        onModeSpecificAction?.('dont_know');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isComplete, onModeSpecificAction]);

  const processValue = (value: string) => {
    // Start timer on first input
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    const valNorm = normalize(value.toLowerCase().trim());
    const targetNorm = normalize(targetWord.toLowerCase().trim());

    if (valNorm === targetNorm) {
      const completionTime = Date.now() - (startTime || Date.now());
      setIsComplete(true);
      setCurrentTime(completionTime);

      // Accent-only differences trigger a gentle tip
      const accentDiff = value.trim() !== targetWord.trim() && normalize(value.trim()) === normalize(targetWord.trim());
      setAccentTip(accentDiff ? 'Nice! Watch accents like á, é, í, ó, ú, ü, ñ next time.' : null);

      if (!bestTime || completionTime < bestTime) setBestTime(completionTime);
      setStreak(prev => prev + 1);
      onWordComplete(true, completionTime, targetWord);

      setTimeout(() => {
        onModeSpecificAction?.('race_complete', { word: targetWord, timeMs: completionTime, wpm });
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    processValue(value);
  };

  const insertAccent = (ch: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? userInput.length;
    const end = el.selectionEnd ?? userInput.length;
    const next = userInput.slice(0, start) + ch + userInput.slice(end);
    setUserInput(next);
    requestAnimationFrame(() => {
      el.focus();
      try { el.setSelectionRange(start + 1, start + 1); } catch {}
    });
    processValue(next);
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
        className="rounded-2xl p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onExit && (
              <button
                onClick={onExit}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-2 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <div className="p-2 rounded-full bg-orange-100">
              <Trophy className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-800">
                Word Race
              </h3>
              <p className="text-xs text-gray-600">
                Word {gameState.currentWordIndex + 1} of {gameState.totalWords}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {streak}
              </div>
              <div className="text-xs text-gray-500">
                Streak
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {wpm}
              </div>
              <div className="text-xs text-gray-500">
                WPM
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
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
        className="rounded-3xl p-8 text-center bg-white shadow-xl border border-gray-100"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Race Against Time!
          </h2>

          {/* Updated English Word Styling */}
          <p className="text-xl mb-6 text-gray-600">
            English: <span className="font-extrabold text-3xl md:text-4xl text-blue-700">{englishWord}</span>
          </p>

          <p className="text-base mb-8 text-gray-500">
            Type the Spanish translation as fast as you can!
          </p>

          {/* Timer Display */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Timer className="h-6 w-6 text-orange-600" />
            <span className="text-3xl font-mono font-bold text-orange-600">
              {(currentTime / 1000).toFixed(2)}s
            </span>
            {bestTime && (
              <span className="text-lg text-gray-500">
                (Best: {(bestTime / 1000).toFixed(2)}s)
              </span>
            )}
          </div>
        </div>

        {/* Updated Word Display with Character-by-Character Feedback */}
        <div className="mb-8">
          <div className="text-4xl font-mono font-bold mb-6 tracking-wider">
            {targetWord.split('').map((char, index) => {
              const status = getCharacterStatus(index);
              return (
                <motion.span
                  key={index}
                  className={`inline-block ${
                    status === 'correct'
                      ? 'text-green-600'
                      : status === 'incorrect'
                        ? 'text-red-600'
                        : 'text-gray-400'
                  } px-1 rounded transition-colors duration-200`}
                  animate={index === userInput.length ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: index === userInput.length ? Infinity : 0 }}
                >
                  {index < userInput.length ? userInput[index] : '_'}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* Quick accents */}
        <div className="mb-4 flex justify-center flex-wrap gap-2">
          {['á','é','í','ó','ú','ü','ñ'].map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => insertAccent(ch)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-3 py-1 rounded-lg text-lg font-semibold"
            >
              {ch}
            </button>
          ))}
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
                ? 'bg-green-100 border-green-300 text-green-700'
                : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
            } focus:outline-none focus:ring-4 focus:ring-blue-500/20`}
          />
        </div>

        {/* Skip Button */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <button
              aria-label="Skip word (Esc)"
              title="Skip word (Esc)"
              onClick={() => {
                onModeSpecificAction?.('dont_know');
              }}
              className="px-6 py-2 rounded-xl font-semibold inline-flex items-center transition-all duration-200 shadow-sm bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              <span>Skip</span>
              <span className="ml-3 text-xs opacity-70">(Esc)</span>
            </button>
          </motion.div>
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
              <h3 className="text-2xl font-bold mb-2 text-green-600">
                Race Complete!
              </h3>
              <div className="flex items-center justify-center space-x-6 text-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Timer className="h-5 w-5" />
                  <span>{(currentTime / 1000).toFixed(2)}s</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Zap className="h-5 w-5" />
                  <span>{wpm} WPM</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Target className="h-5 w-5" />
                  <span>{accuracy}%</span>
                </div>
              </div>
              {accentTip && (
                <div className="text-yellow-700 text-sm mt-3">
                  {accentTip}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!startTime && (
          <div className="text-center text-gray-500">
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
            className="flex items-center justify-center space-x-2 mt-4 text-yellow-600"
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
