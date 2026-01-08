import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Volume2, Lightbulb, Eye, EyeOff, Target, Star, Zap, HelpCircle, SkipForward, ArrowLeft } from 'lucide-react';
import { ModeComponent } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

interface LearnModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  showHint: boolean;
  onToggleHint: () => void;
  onExit?: () => void;
}

export const LearnMode: React.FC<LearnModeProps> = ({
  gameState,
  userAnswer,
  onAnswerChange,
  onSubmit,
  showHint,
  onToggleHint,
  playPronunciation,
  onModeSpecificAction,
  onExit
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const lastPlayedWordRef = useRef<string | null>(null);

  // DEBUG: Add comprehensive logging
  console.log('🔍 LearnMode render:', {
    currentWordIndex: gameState.currentWordIndex,
    currentWordId: gameState.currentWord?.id,
    currentWordSpanish: gameState.currentWord?.spanish,
    totalWords: gameState.totalWords,
    timestamp: Date.now()
  });

  useEffect(() => {
    // Focus input when word changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Reset translation visibility for new word
    setShowTranslation(false);

    // Auto-play audio when new word appears (but avoid playing same word multiple times)
    if (gameState.currentWord?.audio_url) {
      const currentWordKey = `${gameState.currentWord.id}`;
      
      if (lastPlayedWordRef.current !== currentWordKey) {
        lastPlayedWordRef.current = currentWordKey;
        
        const timer = setTimeout(() => {
          // Double-check the word hasn't changed while we were waiting
          if (lastPlayedWordRef.current === currentWordKey && gameState.currentWord) {
            console.log('🔊 Playing audio for word:', gameState.currentWord.spanish);
            playPronunciation(
              gameState.currentWord?.spanish || gameState.currentWord?.word || '',
              'es',
              gameState.currentWord || undefined
            );
          }
        }, 500); // Small delay to let the UI settle
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentWord, playPronunciation]); // Removed currentWordIndex from dependencies

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  const handleDontKnow = () => {
    // Use the onModeSpecificAction to handle "don't know" action
    if (onModeSpecificAction) {
      onModeSpecificAction('dont_know', {
        word: gameState.currentWord,
        wordIndex: gameState.currentWordIndex
      });
    }
  };

  const getHintText = () => {
    const translation = gameState.currentWord?.english || gameState.currentWord?.translation || '';
    if (!translation) return '';

    // Show first letter and length
    return `${translation.charAt(0).toUpperCase()}${'_'.repeat(translation.length - 1)} (${translation.length} letters)`;
  };

  // Enhanced styling for both adventure and learn modes
  

  const textPrimary = "text-gray-900"; // Darker primary text for light mode
  const textSecondary = "text-gray-600"; // Softer secondary text
  const textMuted = "text-gray-500";

  // Use standard (light theme) layout
    // Compact layout matching the screenshot style
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Main content area */}
        <div className="flex-1 p-8 flex flex-col justify-center items-center">
          <div className="max-w-2xl mx-auto w-full space-y-7"> {/* Increased spacing */}
            {/* Word display card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState.currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
              <div className="text-center space-y-6">
                {onExit && (
                  <div className="flex justify-start mb-4">
                    <button
                      onClick={onExit}
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-2 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  </div>
                )}
                <div className="text-4xl text-blue-500"> {/* Brighter icon color */}
                  <BookOpen className="h-12 w-12 mx-auto" />
                </div>

                <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center"> {/* Darker heading */}
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn New Words
                </h2>

                <div className="space-y-4">
                  <h3 className="text-5xl font-extrabold text-blue-700"> {/* More prominent word */}
                    {gameState.currentWord?.spanish || gameState.currentWord?.word}
                  </h3>

                  {/* Part of speech */}
                  {gameState.currentWord?.part_of_speech && (
                    <div className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 font-medium"> {/* Brighter, more readable */}
                      {gameState.currentWord.part_of_speech}
                    </div>
                  )}

                  {/* Audio button */}
                  {gameState.currentWord?.audio_url && (
                    <button
                      onClick={() => playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord || undefined)}
                      disabled={gameState.audioPlaying}
                      className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Volume2 className="h-7 w-7" /> {/* Slightly larger icon */}
                    </button>
                  )}

                  {/* Translation toggle */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setShowTranslation(!showTranslation);
                        if (!showTranslation && onModeSpecificAction) {
                          onModeSpecificAction('show_translation');
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      {showTranslation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="text-base font-medium"> {/* Slightly larger text */}
                        {showTranslation ? 'Hide' : 'Show'} Translation
                      </span>
                    </button>
                  </div>

                  {/* Translation display */}
                  {showTranslation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 font-semibold"
                    >
                      <p className="text-xl">
                        {gameState.currentWord?.english || gameState.currentWord?.translation}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
            </AnimatePresence>

            {/* Practice input */}
            <div className="bg-white rounded-xl shadow-lg p-6"> {/* Reusing cardClasses for consistency */}
              <div className="space-y-5"> {/* Increased spacing */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Practice typing the translation:
                  </h3>
                  
                  <button
                    onClick={onToggleHint}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-xl text-sm transition-colors border ${
                      showHint
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>Hint</span>
                  </button>
                </div>

                {/* Hint display */}
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200"
                  >
                    <p className="text-sm font-mono flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {getHintText()}
                    </p>
                  </motion.div>
                )}
                
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={getPlaceholderText('learn')}
                    className="w-full p-4 rounded-xl text-lg font-medium bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none" // Updated focus styles
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={onSubmit}
                    disabled={!userAnswer.trim()}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md ${
                      userAnswer.trim()
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-300 cursor-not-allowed'
                    }`}
                  >
                    Check Answer
                  </button>

                  <motion.button
                    onClick={handleDontKnow}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Don't Know - Skip</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - same as RecallMode */}
        <div className="w-80 p-8 space-y-6 bg-gray-100 border-l border-gray-200"> {/* Subtle sidebar background and border */}
          {/* Performance card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-800 border border-gray-100"> {/* Consistent card styling */}
            <h4 className="text-xl font-bold mb-4">Performance</h4>
            
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between"> {/* Lighter purple */}
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-purple-500" /> {/* Purple icon */}
                  <span className="font-medium">Streak</span>
                </div>
                <span className="text-2xl font-bold text-purple-700">{gameState.streak}</span> {/* Darker purple text */}
              </div>

              <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Accuracy</span>
                </div>
                <span className="text-2xl font-bold text-purple-700">
                  {gameState.totalWords > 0 ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers || 1)) * 100) : 0}%
                </span>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">0 XP</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Level 1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Progress card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-800 border border-gray-100"> {/* Consistent card styling */}
            <h4 className="text-xl font-bold mb-4">Session Progress</h4>
            
            <div className="space-y-3">
              <div className="bg-blue-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(((gameState.currentWordIndex + 1) / gameState.totalWords) * 100)}% Complete
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {gameState.totalWords - (gameState.currentWordIndex + 1)} words remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};