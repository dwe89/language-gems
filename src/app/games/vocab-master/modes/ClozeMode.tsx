import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Volume2, Lightbulb } from 'lucide-react';
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
    const translation = gameState.currentWord?.english || gameState.currentWord?.translation || '';
    if (!translation) return '';
    return `Translation: "${translation}"`;
  };

  const handlePlayAudio = () => {
    if (clozeData && playPronunciation) {
      playPronunciation(clozeData.sourceSentence, 'es');
    }
  };

  // Styling based on mode
  const containerClasses = isAdventureMode
    ? "min-h-screen bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950"
    : "min-h-screen bg-gray-50 font-sans antialiased";

  const cardClasses = isAdventureMode
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-white rounded-2xl shadow-lg p-7 border border-gray-100";

  const textPrimary = isAdventureMode ? "text-white" : "text-gray-900";
  const textSecondary = isAdventureMode ? "text-white/80" : "text-gray-600";
  const textMuted = isAdventureMode ? "text-white/60" : "text-gray-500";

  // Show loading state if exercise data is not ready
  if (!clozeData) {
    return (
      <div className={`${containerClasses} flex flex-col items-center justify-center p-8`}>
        <div className={`${cardClasses} flex items-center justify-center min-h-[300px]`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`mt-4 text-lg ${textSecondary}`}>
              Preparing context practice...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main content area - optimized for no scrolling */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto w-full space-y-5">
         
         {/* Context display */}
              <motion.div
                key={gameState.currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardClasses}
              >
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <BookOpen className={`h-8 w-8 ${isAdventureMode ? 'text-green-300' : 'text-blue-500'}`} />
                    <h2 className={`text-xl font-bold ${textPrimary}`}>
                      Context Practice
                    </h2>
                  </div>

                  {/* Compact sentence and translation layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Blanked Sentence */}
                    <div className={`p-4 rounded-xl border ${isAdventureMode
                      ? 'bg-slate-700/40 border-slate-600/30'
                      : 'bg-blue-50 border-blue-200'
                      }`}>
                      <h3 className={`text-sm font-semibold mb-2 ${isAdventureMode ? 'text-blue-200' : 'text-blue-800'}`}>
                        Complete the sentence:
                      </h3>
                      <p className={`text-lg font-semibold leading-relaxed ${isAdventureMode ? 'text-white' : 'text-blue-900'}`}>
                        {clozeData.blankedSentence}
                      </p>

                      {/* Audio button */}
                      <button
                        onClick={handlePlayAudio}
                        className={`mt-3 p-2 rounded-full transition-colors border shadow-sm ${
                          gameState.audioPlaying
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                            : isAdventureMode
                              ? 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 border-blue-400/50'
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300'
                        }`}
                        disabled={gameState.audioPlaying}
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* English Translation */}
                    <div className={`p-4 rounded-xl border ${isAdventureMode
                      ? 'bg-green-800/20 border-green-600/30'
                      : 'bg-green-50 border-green-200'
                      }`}>
                      <h3 className={`text-sm font-semibold mb-2 ${isAdventureMode ? 'text-green-200' : 'text-green-800'}`}>
                        Translation:
                      </h3>
                      <p className={`text-lg font-medium leading-relaxed ${isAdventureMode ? 'text-green-100' : 'text-green-900'}`}>
                        {clozeData.englishTranslation}
                      </p>
                    </div>
                  </div> {/* Close grid div here */}
                </div> {/* Close text-center div here */}
              </motion.div> {/* Close motion.div here */}

        {/* Input area */}
        <div className={cardClasses}>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>
                Fill in the blank:
              </h3>
              
              <button
                onClick={() => setShowHint(!showHint)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-xl text-sm transition-colors border ${
                  showHint
                    ? isAdventureMode
                      ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    : isAdventureMode
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border-slate-600/30'
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
                className={`p-3 rounded-xl ${
                  isAdventureMode
                    ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}
              >
                <p className="text-sm font-mono">
                  💡 {getHintText()}
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
                placeholder={getPlaceholderText('cloze')}
                className={`w-full p-4 rounded-xl text-lg font-medium transition-all duration-200 outline-none ${isAdventureMode
                  ? 'bg-slate-700/50 text-white placeholder-slate-400 border border-slate-500/30 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20'
                  : 'bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                }`}
                autoFocus
              />
            </div>

            <button
              onClick={onSubmit}
              disabled={!userAnswer.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md ${userAnswer.trim()
                ? isAdventureMode
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar - Progress info */}
      <div className="w-80 p-6 space-y-4 bg-gray-100 border-l border-gray-200">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h4 className="text-lg font-bold mb-3 text-gray-800">Progress</h4>

          <div className="space-y-3">
            <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-700">Question</span>
              </div>
              <span className="text-lg font-bold text-blue-700">
                {gameState.currentWordIndex + 1}/{gameState.totalWords}
              </span>
            </div>

            <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 text-green-500">✓</span>
                <span className="font-medium text-green-700">Correct</span>
              </div>
              <span className="text-lg font-bold text-green-700">{gameState.correctAnswers}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <div className="text-lg font-bold text-blue-700">
                {Math.round(((gameState.currentWordIndex + 1) / gameState.totalWords) * 100)}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};