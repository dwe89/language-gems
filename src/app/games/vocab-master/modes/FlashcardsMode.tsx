import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { ModeComponent } from '../types';

interface FlashcardsModeProps extends ModeComponent {
  onSelfAssessment: (isCorrect: boolean) => void;
  showAnswer: boolean;
}

export const FlashcardsMode: React.FC<FlashcardsModeProps> = ({
  gameState,
  onSelfAssessment,
  showAnswer,
  isAdventureMode,
  playPronunciation
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSelfAssess = (isCorrect: boolean) => {
    onSelfAssessment(isCorrect);
    setIsFlipped(false); // Reset for next card
  };

  const baseClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-white rounded-xl shadow-lg p-8";

  return (
    <div className="space-y-8">
      {/* Flashcard */}
      <motion.div
        key={gameState.currentWordIndex}
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        className="perspective-1000"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="relative preserve-3d cursor-pointer"
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className={`${baseClasses} backface-hidden min-h-[300px] flex flex-col justify-center`}>
            <div className="text-center space-y-6">
              <div className="text-6xl">
                📚
              </div>
              
              <h2 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
                Do you know this word?
              </h2>

              <div className="space-y-4">
                <h3 className={`text-5xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
                  {gameState.currentWord?.spanish || gameState.currentWord?.word}
                </h3>

                {/* Audio button */}
                {gameState.currentWord?.audio_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord);
                    }}
                    disabled={gameState.audioPlaying}
                    className={`p-4 rounded-full transition-colors border-2 shadow-lg ${
                      gameState.audioPlaying
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                        : isAdventureMode
                          ? 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 border-blue-400/50'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-300'
                    }`}
                  >
                    <Volume2 className="h-6 w-6" />
                  </button>
                )}
              </div>

              <div className={`text-sm ${isAdventureMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Click to reveal the answer
              </div>

              <div className="flex justify-center">
                <RotateCcw className={`h-8 w-8 ${isAdventureMode ? 'text-slate-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className={`${baseClasses} backface-hidden rotate-y-180 absolute inset-0 min-h-[300px] flex flex-col justify-center`}>
            <div className="text-center space-y-6">
              <div className="text-6xl">
                ✨
              </div>
              
              <h2 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
                Translation:
              </h2>

              <div className="space-y-4">
                <h3 className={`text-4xl font-bold ${isAdventureMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  {gameState.currentWord?.english || gameState.currentWord?.translation}
                </h3>

                {/* Example sentence if available */}
                {gameState.currentWord?.example_sentence && (
                  <div className={`p-4 rounded-lg ${
                    isAdventureMode 
                      ? 'bg-slate-700/40 border border-slate-600/30' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className={`text-sm italic ${isAdventureMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      Example: {gameState.currentWord.example_sentence}
                    </p>
                    {gameState.currentWord.example_translation && (
                      <p className={`text-sm mt-1 ${isAdventureMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {gameState.currentWord.example_translation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className={`text-sm ${isAdventureMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Click to flip back
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Self-assessment buttons */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={baseClasses}
        >
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold text-center ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
              Did you know the answer?
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={() => handleSelfAssess(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg font-semibold transition-all duration-200 ${
                  isAdventureMode
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30'
                    : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                }`}
              >
                <XCircle className="h-5 w-5" />
                <span>No, I didn't know</span>
              </motion.button>

              <motion.button
                onClick={() => handleSelfAssess(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg font-semibold transition-all duration-200 ${
                  isAdventureMode
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-200 border border-green-400/30'
                    : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                <span>Yes, I knew it!</span>
              </motion.button>
            </div>

            <div className={`text-center text-sm ${isAdventureMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Be honest with yourself - this helps improve your learning!
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions for new users */}
      {!isFlipped && (
        <div className={baseClasses}>
          <div className="text-center space-y-3">
            <h4 className={`font-semibold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
              How Flashcards Work:
            </h4>
            <div className={`text-sm space-y-1 ${isAdventureMode ? 'text-slate-300' : 'text-gray-600'}`}>
              <p>1. Look at the Spanish word and try to remember its meaning</p>
              <p>2. Click the card to reveal the English translation</p>
              <p>3. Honestly assess whether you knew the answer</p>
              <p>4. Your self-assessment helps track your progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
