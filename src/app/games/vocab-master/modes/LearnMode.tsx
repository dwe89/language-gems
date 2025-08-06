import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Volume2, Lightbulb, Eye, EyeOff, Target } from 'lucide-react';
import { ModeComponent } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

interface LearnModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  showHint: boolean;
  onToggleHint: () => void;
}

export const LearnMode: React.FC<LearnModeProps> = ({
  gameState,
  userAnswer,
  onAnswerChange,
  onSubmit,
  showHint,
  onToggleHint,
  isAdventureMode,
  playPronunciation
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    // Focus input when word changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Reset translation visibility for new word
    setShowTranslation(false);
  }, [gameState.currentWordIndex]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  const getHintText = () => {
    const translation = gameState.currentWord?.english || gameState.currentWord?.translation || '';
    if (!translation) return '';
    
    // Show first letter and length
    return `${translation.charAt(0).toUpperCase()}${'_'.repeat(translation.length - 1)} (${translation.length} letters)`;
  };

  // Enhanced styling for both adventure and learn modes
  const containerClasses = isAdventureMode 
    ? "min-h-screen bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950"
    : "min-h-screen bg-gray-50 font-sans antialiased"; // Lighter background for non-adventure mode

  const cardClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-white rounded-2xl shadow-lg p-7 border border-gray-100"; // Softer shadows, rounded corners, subtle border

  const textPrimary = isAdventureMode ? "text-white" : "text-gray-900"; // Darker primary text for light mode
  const textSecondary = isAdventureMode ? "text-white/80" : "text-gray-600"; // Softer secondary text
  const textMuted = isAdventureMode ? "text-white/60" : "text-gray-500";

  if (!isAdventureMode) {
    // Compact layout matching the screenshot style
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Main content area */}
        <div className="flex-1 p-8 flex flex-col justify-center items-center">
          <div className="max-w-2xl mx-auto w-full space-y-7"> {/* Increased spacing */}
            {/* Word display card */}
            <motion.div
              key={gameState.currentWordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cardClasses}
            >
              <div className="text-center space-y-6">
                <div className="text-4xl text-blue-500"> {/* Brighter icon color */}
                  <BookOpen className="h-12 w-12 mx-auto" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-800"> {/* Darker heading */}
                  📚 Learn New Words
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
                      onClick={() => setShowTranslation(!showTranslation)}
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

            {/* Practice input */}
            <div className={cardClasses}> {/* Reusing cardClasses for consistency */}
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
                    placeholder={getPlaceholderText('learn')}
                    className="w-full p-4 rounded-xl text-lg font-medium bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none" // Updated focus styles
                    autoFocus
                  />
                </div>

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
                  <span className="h-5 w-5 text-purple-500">🎯</span>
                  <span className="font-medium">Accuracy</span>
                </div>
                <span className="text-2xl font-bold text-purple-700">
                  {gameState.totalWords > 0 ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers || 1)) * 100) : 0}%
                </span>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="h-5 w-5 text-purple-500">⭐</span>
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
  }

  // Adventure mode layout (keep existing) - This section remains largely unchanged from your previous version
  return (
    <div className={`${containerClasses} p-6`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Word display */}
        <motion.div
          key={gameState.currentWordIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cardClasses}
        >
          <div className="text-center space-y-6">
            <div className="text-6xl">
              <BookOpen className={`h-16 w-16 mx-auto ${isAdventureMode ? 'text-blue-300' : 'text-blue-500'}`} />
            </div>
            
            <h2 className={`text-2xl font-bold ${textPrimary}`}>
              📚 Learn New Words
            </h2>

            <div className="space-y-4">
              <h3 className={`text-5xl font-bold ${textPrimary}`}>
                {gameState.currentWord?.spanish || gameState.currentWord?.word}
              </h3>

              {/* Part of speech */}
              {gameState.currentWord?.part_of_speech && (
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                  isAdventureMode
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                    : 'bg-blue-100 text-blue-700 font-medium' // Adjusted for consistency
                }`}>
                  {gameState.currentWord.part_of_speech}
                </div>
              )}

              {/* Audio button */}
              {gameState.currentWord?.audio_url && (
                <button
                  onClick={() => playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord || undefined)}
                  disabled={gameState.audioPlaying}
                  className={`p-4 rounded-full transition-colors border-2 shadow-lg ${
                    gameState.audioPlaying
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 border-blue-400/50'
                  }`}
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              )}

              {/* Translation toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors border ${
                    isAdventureMode
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border-slate-600/30'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100' // Adjusted for consistency
                  }`}
                >
                  {showTranslation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="text-sm">
                    {showTranslation ? 'Hide' : 'Show'} Translation
                  </span>
                </button>
              </div>

              {/* Translation display */}
              {showTranslation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${
                    isAdventureMode 
                      ? 'bg-green-500/20 border border-green-400/30' 
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <p className={`text-xl font-semibold ${isAdventureMode ? 'text-green-200' : 'text-green-800'}`}>
                    {gameState.currentWord?.english || gameState.currentWord?.translation}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
      </motion.div>

        {/* Example sentence */}
        {gameState.currentWord?.example_sentence && (
          <div className={cardClasses}>
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold ${textPrimary}`}>
                Example Usage:
              </h4>
              <div className={`p-4 rounded-xl ${
                isAdventureMode 
                  ? 'bg-slate-700/30 border border-slate-600/30' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-lg italic ${isAdventureMode ? 'text-slate-200' : 'text-blue-700'}`}>
                  "{gameState.currentWord.example_sentence}"
                </p>
                
                {gameState.currentWord.example_translation && (
                  <p className={`text-sm mt-2 ${textMuted}`}>
                    Translation: "{gameState.currentWord.example_translation}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Practice input */}
        <div className={cardClasses}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>
                Practice typing the translation:
              </h3>
              
              <button
                onClick={onToggleHint}
                className={`flex items-center space-x-2 px-3 py-1 rounded-xl text-sm transition-colors border ${
                  showHint
                    ? isAdventureMode
                      ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    : isAdventureMode
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border-slate-600/30'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100' // Adjusted for consistency
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
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200' // Adjusted for consistency
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
                placeholder={getPlaceholderText('learn')}
                className={`w-full p-4 rounded-xl text-lg font-medium transition-all duration-200 ${
                  isAdventureMode
                    ? 'bg-slate-700/50 text-white placeholder-slate-400 border border-slate-500/30 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none' // Adjusted for consistency
                }`}
                autoFocus
              />
            </div>

            <button
              onClick={onSubmit}
              disabled={!userAnswer.trim()}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                userAnswer.trim()
                  ? isAdventureMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white' // Adjusted for consistency
                  : isAdventureMode
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-300 text-white cursor-not-allowed' // Adjusted for consistency
              }`}
            >
              Check Answer
            </button>
          </div>
        </div>

        {/* Progress bar for non-adventure mode */}
        {!isAdventureMode && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"> {/* Consistent card styling */}
            <h4 className="text-gray-800 font-bold text-center mb-4">Session Progress</h4>
            <div className="space-y-3">
              <div className="bg-blue-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-blue-700 text-lg font-medium">
                {Math.round(((gameState.currentWordIndex + 1) / gameState.totalWords) * 100)}% Complete
              </div>
              <div className="text-center text-gray-500 text-sm">
                {gameState.totalWords - (gameState.currentWordIndex + 1)} words remaining
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};