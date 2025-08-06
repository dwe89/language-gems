import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Volume2, Target, Lightbulb } from 'lucide-react';
import { ModeComponent } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

interface RecallModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  streak: number;
}

export const RecallMode: React.FC<RecallModeProps> = ({
  gameState,
  userAnswer,
  onAnswerChange,
  onSubmit,
  streak,
  isAdventureMode,
  playPronunciation
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when word changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.currentWordIndex]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  const getStreakColor = () => {
    if (streak >= 10) return 'text-purple-400';
    if (streak >= 5) return 'text-green-400';
    if (streak >= 3) return 'text-blue-400';
    return 'text-yellow-400';
  };

  const getStreakBg = () => {
    if (streak >= 10) return 'bg-purple-500/20 border-purple-400/30';
    if (streak >= 5) return 'bg-green-500/20 border-green-400/30';
    if (streak >= 3) return 'bg-blue-500/20 border-blue-400/30';
    return 'bg-yellow-500/20 border-yellow-400/30';
  };

  // Enhanced styling for both adventure and mastery modes
  const containerClasses = isAdventureMode 
    ? "min-h-screen bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950"
    : "min-h-screen bg-white";

  const cardClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-blue-600 rounded-3xl p-8 text-white";

  const inputCardClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-blue-600 rounded-3xl p-6 text-white";

  const textPrimary = isAdventureMode ? "text-white" : "text-white";
  const textSecondary = isAdventureMode ? "text-white/80" : "text-white/80";
  const textMuted = isAdventureMode ? "text-white/60" : "text-white/60";

  if (!isAdventureMode) {
    // Layout matching the screenshot
    return (
      <div className="min-h-screen bg-white flex">
        {/* Main content area */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto w-full space-y-8">
            {/* Word display card */}
            <motion.div
              key={gameState.currentWordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cardClasses}
            >
              <div className="text-center space-y-6">
                <h3 className="text-6xl font-bold text-white">
                  {gameState.currentWord?.spanish || gameState.currentWord?.word}
                </h3>

                {/* Audio button */}
                {gameState.currentWord?.audio_url && (
                  <button
                    onClick={() => playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord || undefined)}
                    disabled={gameState.audioPlaying}
                    className="p-6 rounded-full bg-blue-500 hover:bg-blue-400 text-white border-2 border-blue-400 transition-colors"
                  >
                    <Volume2 className="h-8 w-8" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Input area */}
            <div className={inputCardClasses}>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">
                  Type the English translation:
                </h3>
                
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your answer..."
                    className="w-full p-4 rounded-xl text-lg font-medium bg-blue-500/30 text-white placeholder-white/60 border border-blue-400/30 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                    autoFocus
                  />
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={onSubmit}
                    disabled={!userAnswer.trim()}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      userAnswer.trim()
                        ? 'bg-blue-500/40 hover:bg-blue-500/50 text-white border border-blue-400/30'
                        : 'bg-blue-500/20 text-white/50 cursor-not-allowed border border-blue-400/20'
                    }`}
                  >
                    Submit Answer
                  </button>

                  {/* Hint button */}
                  <button
                    className="px-4 py-3 rounded-xl font-medium transition-all duration-200 border border-blue-400/30 text-white/80 hover:bg-blue-500/20"
                    title="Show hint"
                  >
                    <Lightbulb className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar matching screenshot */}
        <div className="w-80 p-8 space-y-6">
          {/* Performance card */}
          <div className="bg-purple-600 rounded-3xl p-6 text-white">
            <h4 className="text-xl font-bold mb-4">Performance</h4>
            
            <div className="space-y-4">
              <div className="bg-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-cyan-300" />
                  <span className="font-medium">Streak</span>
                </div>
                <span className="text-2xl font-bold">{streak}</span>
              </div>

              <div className="bg-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="h-5 w-5 text-cyan-300">🎯</span>
                  <span className="font-medium">Accuracy</span>
                </div>
                <span className="text-2xl font-bold">
                  {gameState.totalWords > 0 ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers || 1)) * 100) : 0}%
                </span>
              </div>

              <div className="bg-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="h-5 w-5 text-cyan-300">⭐</span>
                  <span className="font-medium">0 XP</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60">Level 1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Progress card */}
          <div className="bg-purple-600 rounded-3xl p-6 text-white">
            <h4 className="text-xl font-bold mb-4">Session Progress</h4>
            
            <div className="space-y-3">
              <div className="bg-purple-500/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(((gameState.currentWordIndex + 1) / gameState.totalWords) * 100)}% Complete
                </div>
                <div className="text-sm text-white/60 mt-1">
                  {gameState.totalWords - (gameState.currentWordIndex + 1)} words remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Adventure mode layout (keep existing)
  return (
    <div className={`${containerClasses} p-6`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Word display with streak */}
        <motion.div
          key={gameState.currentWordIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cardClasses}
        >
          <div className="text-center space-y-6">
            <div className="text-6xl">
              <Brain className="h-16 w-16 text-purple-300 mx-auto" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">
              🧠 Mastery Challenge
            </h2>

            {/* Streak display */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStreakBg()}`}
              >
                <Target className={`h-4 w-4 ${getStreakColor()}`} />
                <span className={`font-bold ${getStreakColor()}`}>
                  {streak} streak!
                </span>
              </motion.div>
            )}

            <div className="space-y-4">
              <h3 className="text-5xl font-bold text-white">
                {gameState.currentWord?.spanish || gameState.currentWord?.word}
              </h3>

              {/* Part of speech */}
              {gameState.currentWord?.part_of_speech && (
                <div className="inline-block px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-200 border border-purple-400/30">
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
            </div>

            <div className="text-sm text-white/60">
              Test your memory - no hints this time!
            </div>
          </div>
        </motion.div>

        {/* Input area */}
        <div className={cardClasses}>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              What does this word mean?
            </h3>
            
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={getPlaceholderText('recall')}
                className="w-full p-4 rounded-xl text-lg font-medium transition-all duration-200 bg-slate-700/50 text-white placeholder-slate-400 border border-slate-500/30 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
                autoFocus
              />
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onSubmit}
                disabled={!userAnswer.trim()}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  userAnswer.trim()
                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/25'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Check Answer
              </button>

              {/* Hint button */}
              <button
                className="px-4 py-3 rounded-xl font-medium transition-all duration-200 border border-slate-600 text-slate-300 hover:bg-slate-700/50"
                title="Show hint"
              >
                <Lightbulb className="h-5 w-5" />
              </button>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: Math.min(streak, 10) }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-2 h-2 rounded-full ${getStreakColor().replace('text-', 'bg-')}`}
                />
              ))}
            </div>

            {streak >= 10 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-3 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/30"
              >
                <p className="text-sm font-semibold">
                  🔥 Amazing! You're on fire with a {streak} word streak!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
