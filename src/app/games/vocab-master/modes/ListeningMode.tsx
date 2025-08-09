import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Volume2 } from 'lucide-react';
import { ModeComponent } from '../types';
import { getPlaceholderText } from '../utils/answerValidation';

interface ListeningModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  canReplayAudio: boolean;
  onReplayAudio: () => void;
  audioReplayCount: number;
}

export const ListeningMode: React.FC<ListeningModeProps> = ({
  gameState,
  userAnswer,
  onAnswerChange,
  onSubmit,
  isAdventureMode,
  playPronunciation,
  canReplayAudio,
  onReplayAudio,
  audioReplayCount
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastPlayedWordRef = useRef<string | null>(null);

  useEffect(() => {
    // Auto-play audio when word loads
    if (gameState.currentWord) {
      const currentWordKey = `${gameState.currentWord.id}-listening`;
      
      if (lastPlayedWordRef.current !== currentWordKey) {
        lastPlayedWordRef.current = currentWordKey;
        
        const timer = setTimeout(() => {
          // Double-check the word hasn't changed while we were waiting
          if (lastPlayedWordRef.current === currentWordKey && gameState.currentWord) {
            playPronunciation(
              gameState.currentWord?.spanish || '', 
              'es', 
              gameState.currentWord
            );
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentWord, playPronunciation]);

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

  const baseClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-white rounded-xl shadow-lg p-8";

  return (
    <div className="space-y-8">
      {/* Audio-only interface */}
      <motion.div
        key={gameState.currentWordIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={baseClasses}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl">
            <Headphones className="h-16 w-16 text-blue-300 mx-auto" />
          </div>
          
          <h2 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
            🎧 Listen and Type the Translation
          </h2>

          <p className={`text-sm ${isAdventureMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Listen to the Spanish word and type its English translation
          </p>

          {/* Single audio control */}
          <div className="flex justify-center">
            <button
              onClick={() => playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord || undefined)}
              disabled={gameState.audioPlaying}
              className={`p-6 rounded-full transition-colors border-2 shadow-lg ${
                gameState.audioPlaying
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : isAdventureMode
                    ? 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 border-blue-400/50'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-300'
              }`}
            >
              <Volume2 className="h-8 w-8" />
            </button>
          </div>

          {/* Replay info */}
          {canReplayAudio && (
            <div className={`text-center text-sm ${isAdventureMode ? 'text-white/60' : 'text-gray-500'}`}>
              {2 - audioReplayCount} replays remaining
            </div>
          )}
        </div>
      </motion.div>

      {/* Input area */}
      <div className={baseClasses}>
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
            English translation:
          </h3>
          
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={getPlaceholderText('listening')}
              className={`w-full p-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                isAdventureMode
                  ? 'bg-slate-700/50 text-white placeholder-slate-400 border border-slate-500/30 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20'
                  : 'bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
              autoFocus
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg pointer-events-none" />
          </div>

          <button
            onClick={onSubmit}
            disabled={!userAnswer.trim()}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              userAnswer.trim()
                ? isAdventureMode
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Translation
          </button>
        </div>
      </div>
    </div>
  );
};
