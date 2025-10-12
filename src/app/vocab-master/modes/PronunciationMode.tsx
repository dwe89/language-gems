import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Play, Pause, RotateCcw, CheckCircle2, XCircle, Ear, ArrowLeft } from 'lucide-react';
import { ModeComponent } from '../types';

interface PronunciationModeProps extends ModeComponent {
  onPronunciationComplete: (isCorrect: boolean, attempt: string) => void;
  onExit?: () => void;
}

export const PronunciationMode: React.FC<PronunciationModeProps> = ({
  gameState,
  onPronunciationComplete,
  isAdventureMode,
  playPronunciation,
  onModeSpecificAction,
  onExit
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [audioWaves, setAudioWaves] = useState([1, 1, 1, 1, 1]);

  const targetWord = gameState.currentWord?.word || gameState.currentWord?.spanish || '';
  const translation = gameState.currentWord?.translation || gameState.currentWord?.english || '';

  useEffect(() => {
    // Reset for new word
    setIsListening(false);
    setHasAttempted(false);
    setFeedback(null);
  }, [gameState.currentWordIndex]);

  // Animate audio waves when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying || gameState.audioPlaying) {
      interval = setInterval(() => {
        setAudioWaves(prev => prev.map(() => Math.random() * 3 + 0.5));
      }, 150);
    } else {
      setAudioWaves([1, 1, 1, 1, 1]);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameState.audioPlaying]);

  const handlePlayAudio = () => {
    if (gameState.currentWord && !gameState.audioPlaying) {
      setIsPlaying(true);
      playPronunciation(
        targetWord,
        'es',
        gameState.currentWord
      );
      setTimeout(() => setIsPlaying(false), 2500);
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    setHasAttempted(true);
    
    // Simulate speech recognition (in a real app, you'd use Web Speech API)
    setTimeout(() => {
      setIsListening(false);
      
      // Simulate pronunciation feedback (random for demo)
      const isCorrect = Math.random() > 0.3; // 70% success rate for demo
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      
      onPronunciationComplete(isCorrect, targetWord);
      
      // Auto-advance after feedback
      setTimeout(() => {
        if (onModeSpecificAction) {
          onModeSpecificAction('pronunciation_complete', { 
            word: targetWord, 
            isCorrect 
          });
        }
      }, 2500);
    }, 3000);
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
            : 'bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100'
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
              isAdventureMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Mic className={`h-4 w-4 ${
                isAdventureMode ? 'text-purple-300' : 'text-purple-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Pronunciation Master
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
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
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
            Perfect Your Pronunciation
          </h2>
          
          <p className={`text-lg mb-8 ${
            isAdventureMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Listen carefully, then speak the Spanish word
          </p>
        </div>

        {/* Word Display */}
        <div className="mb-8">
          <div className={`text-6xl font-bold mb-4 ${
            isAdventureMode ? 'text-white' : 'text-gray-800'
          }`}>
            {targetWord}
          </div>
          
          <div className={`text-2xl mb-8 ${
            isAdventureMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            "{translation}"
          </div>
        </div>

        {/* Audio Visualization */}
        <div className="mb-8">
          <motion.div
            animate={isPlaying || gameState.audioPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 0.8, repeat: isPlaying || gameState.audioPlaying ? Infinity : 0 }}
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center relative ${
              isAdventureMode 
                ? 'bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-2 border-purple-400/30' 
                : 'bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-purple-200'
            }`}
          >
            <Ear className={`h-16 w-16 ${
              isAdventureMode ? 'text-purple-300' : 'text-purple-600'
            }`} />
            
            {/* Audio Waves */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-1">
                {audioWaves.map((height, index) => (
                  <motion.div
                    key={index}
                    className={`w-1 rounded-full ${
                      isAdventureMode ? 'bg-purple-400/60' : 'bg-purple-500/60'
                    }`}
                    animate={{
                      height: isPlaying || gameState.audioPlaying ? `${height * 8}px` : '4px'
                    }}
                    transition={{ duration: 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          {/* Play Audio Button */}
          <motion.button
            onClick={handlePlayAudio}
            disabled={gameState.audioPlaying || isListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-full transition-all duration-200 ${
              gameState.audioPlaying || isPlaying || isListening
                ? isAdventureMode
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAdventureMode
                  ? 'bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 border-2 border-purple-400/50 shadow-lg hover:shadow-purple-500/25'
                  : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl'
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
                  <Pause className="h-8 w-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <Play className="h-8 w-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Record Button */}
          <motion.button
            onClick={handleStartListening}
            disabled={isListening || !hasAttempted && gameState.audioPlaying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/25'
                : hasAttempted && feedback
                  ? feedback === 'correct'
                    ? isAdventureMode
                      ? 'bg-green-500/30 text-green-200 border-2 border-green-400/50'
                      : 'bg-green-500 text-white'
                    : isAdventureMode
                      ? 'bg-red-500/30 text-red-200 border-2 border-red-400/50'
                      : 'bg-red-500 text-white'
                  : isAdventureMode
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-white border-2 border-slate-500/30'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-200'
            }`}
          >
            <Mic className="h-10 w-10" />
          </motion.button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`text-lg font-semibold ${
                isAdventureMode ? 'text-red-300' : 'text-red-600'
              }`}
            >
              🎤 Listening... Speak now!
            </motion.div>
          )}
          
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center space-x-2"
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <span className={`text-xl font-bold ${
                    isAdventureMode ? 'text-green-300' : 'text-green-600'
                  }`}>
                    Excellent pronunciation!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-red-500" />
                  <span className={`text-xl font-bold ${
                    isAdventureMode ? 'text-red-300' : 'text-red-600'
                  }`}>
                    Try again - listen carefully
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!hasAttempted && (
          <div className={`text-center mt-8 ${
            isAdventureMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            <p className="text-lg mb-2">
              🎧 First, listen to the pronunciation
            </p>
            <p className="text-sm">
              Then click the microphone and speak the word clearly
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
