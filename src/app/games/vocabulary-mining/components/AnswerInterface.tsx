'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic } from 'lucide-react';

interface AnswerInterfaceProps {
  gameState: {
    gameMode: string;
    currentWord: any;
    userAnswer: string;
    showAnswer: boolean;
    isFlashcardFlipped: boolean;
    feedback: string;
    isCorrect: boolean | null;
  };
  multipleChoiceOptions: Array<{ text: string; isCorrect: boolean }>;
  showHint: boolean;
  handleAnswer: (answer: string, isMultipleChoice?: boolean) => void;
  handleFlashcardResponse: (knew: boolean) => void;
  setGameState: (updater: (prev: any) => any) => void;
  setShowHint: (show: boolean) => void;
  getWordProperty: (word: any, property: 'spanish' | 'english') => string;
}

export const AnswerInterface: React.FC<AnswerInterfaceProps> = ({
  gameState,
  multipleChoiceOptions,
  showHint,
  handleAnswer,
  handleFlashcardResponse,
  setGameState,
  setShowHint,
  getWordProperty
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (gameState.showAnswer) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`bg-gradient-to-br backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl ${gameState.isCorrect
            ? 'from-emerald-500/20 to-green-500/20 border-emerald-500/40'
            : 'from-red-500/20 to-rose-500/20 border-red-500/40'
          }`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
            className="mb-4"
          >
            {gameState.isCorrect ? (
              <div className="text-6xl mb-2">🎉</div>
            ) : (
              <div className="text-6xl mb-2">💔</div>
            )}
          </motion.div>

          <h3 className={`text-2xl font-bold mb-3 ${gameState.isCorrect ? 'text-emerald-300' : 'text-red-300'
            }`}>
            {gameState.isCorrect ? 'Gem Mined Successfully!' : 'Mining Failed'}
          </h3>

          <p className="text-white text-lg mb-4 font-medium">
            {gameState.feedback}
          </p>

          {/* Example Sentence */}
          {gameState.currentWord.example_sentence && (
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-sm text-slate-300 space-y-2">
                <div className="italic">"{gameState.currentWord.example_sentence}"</div>
                {gameState.currentWord.example_translation && (
                  <div className="text-slate-400">"{gameState.currentWord.example_translation}"</div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl 
                 rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">🔍 Mine the Translation</h3>
        <p className="text-slate-300">Extract the English meaning</p>
      </div>

      {gameState.gameMode === 'multiple_choice' ? (
        <div className="space-y-3">
          {multipleChoiceOptions.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(index.toString(), true)}
              className="w-full bg-gradient-to-r from-slate-700/60 to-slate-800/60 hover:from-slate-600/60 hover:to-slate-700/60 
                       border-2 border-slate-600/30 hover:border-slate-500/50 rounded-xl p-4 text-white text-left 
                       transition-all duration-200 backdrop-blur-sm"
            >
              <span className="font-medium">{option.text}</span>
            </motion.button>
          ))}
        </div>
      ) : gameState.gameMode === 'dictation' ? (
        <div className="space-y-4">
          <div className="text-center text-green-200 text-sm mb-4">🎤 Listen carefully and write what you hear</div>
          <div className="text-center mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (gameState.currentWord?.audio_url) {
                  const audio = new Audio(gameState.currentWord.audio_url);
                  audio.play();
                }
              }}
              className="bg-gradient-to-r from-green-600/60 to-emerald-600/60 hover:from-green-500/60 hover:to-emerald-500/60 
                       border-2 border-green-500/30 rounded-full p-4 text-white transition-all duration-200"
            >
              <Volume2 className="h-8 w-8" />
            </motion.button>
            <div className="text-green-300 text-sm mt-2">Click to replay audio</div>
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={gameState.userAnswer}
              onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAnswer(gameState.userAnswer)}
              placeholder="Type what you heard..."
              className="w-full bg-slate-700/40 border-2 border-slate-600/30 focus:border-green-500/50 
                       rounded-xl px-6 py-4 text-white text-lg placeholder-slate-400 
                       focus:ring-4 focus:ring-green-500/20 focus:outline-none backdrop-blur-sm
                       transition-all duration-200"
              autoFocus
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(gameState.userAnswer)}
            disabled={!gameState.userAnswer.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 
                     disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl 
                     transition-all duration-200 disabled:cursor-not-allowed shadow-lg text-lg
                     disabled:opacity-50 transform hover:shadow-green-500/25"
          >
            <span className="flex items-center justify-center space-x-2">
              <Mic className="h-5 w-5" />
              <span>Submit Dictation</span>
            </span>
          </motion.button>
        </div>
      ) : gameState.gameMode === 'flashcards' ? (
        <div className="space-y-4">
          {/* Flashcard */}
          <motion.div
            className="relative h-40 w-full max-w-md mx-auto cursor-pointer"
            onClick={() => setGameState(prev => ({ ...prev, isFlashcardFlipped: !prev.isFlashcardFlipped }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full rounded-xl shadow-lg"
              initial={false}
              animate={{ rotateY: gameState.isFlashcardFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of card (Target Language) */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20
                         border-2 border-yellow-500/30 rounded-xl p-4 flex flex-col justify-center items-center
                         backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="text-yellow-300 text-xs mb-2 text-center">
                  📚 Click the card to flip it
                </div>
                <div className="text-white font-bold text-2xl text-center">
                  {gameState.currentWord?.spanish || ''}
                </div>
              </div>

              {/* Back of card (English) */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20
                         border-2 border-green-500/30 rounded-xl p-4 flex flex-col justify-center items-center
                         backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}
              >
                <div className="text-green-300 text-xs mb-2 text-center">
                  📚 Click the card to flip it
                </div>
                <div className="text-white font-bold text-2xl text-center">
                  {gameState.currentWord?.english || ''}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFlashcardResponse(true)}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                       text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg
                       transform hover:shadow-green-500/25"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✓ I knew it</span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFlashcardResponse(false)}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500
                       text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg
                       transform hover:shadow-red-500/25"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✗ I didn't know</span>
              </span>
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {gameState.gameMode === 'listening' && (
            <div className="text-center mb-4">
              <div className="text-blue-200 text-sm mb-3">🎧 Type what you heard</div>
            </div>
          )}

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={gameState.userAnswer}
              onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAnswer(gameState.userAnswer)}
              placeholder={
                gameState.gameMode === 'listening'
                  ? "Type what you heard..."
                  : gameState.gameMode === 'typing'
                    ? "Type the English translation (Double Points!)..."
                    : gameState.gameMode === 'learn'
                      ? "Type the English translation (Hints available)..."
                      : "Type the English translation..."
              }
              className="w-full bg-slate-700/40 border-2 border-slate-600/30 focus:border-blue-500/50 
                       rounded-xl px-6 py-4 text-white text-lg placeholder-slate-400 
                       focus:ring-4 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm
                       transition-all duration-200"
              autoFocus
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none" />
          </div>

          {/* Hint Display for Learn Mode */}
          {gameState.gameMode === 'learn' && showHint && gameState.currentWord && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mt-3"
            >
              <div className="flex items-center space-x-2 text-yellow-200">
                <span>💡</span>
                <span className="text-sm">
                  Hint: The answer starts with "{getWordProperty(gameState.currentWord, 'english').charAt(0).toUpperCase()}"
                </span>
              </div>
            </motion.div>
          )}

          {/* Hint Button for Learn Mode */}
          {gameState.gameMode === 'learn' && !showHint && (
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 
                         text-yellow-200 rounded-lg text-sm transition-colors flex items-center space-x-2"
              >
                <span>💡</span>
                <span>Show Hint</span>
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(gameState.userAnswer)}
            disabled={!gameState.userAnswer.trim()}
            className={`w-full font-bold py-4 px-8 rounded-xl 
                     transition-all duration-200 disabled:cursor-not-allowed shadow-lg text-lg
                     disabled:opacity-50 transform ${gameState.gameMode === 'typing'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 hover:shadow-yellow-500/25 disabled:from-gray-600 disabled:to-gray-700'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/25 disabled:from-gray-600 disabled:to-gray-700'
              } text-white`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>⛏️</span>
              <span>
                {gameState.gameMode === 'typing' ? 'Mine for Double Points!' : 'Mine This Gem'}
              </span>
              <span>{gameState.gameMode === 'typing' ? '⚡' : '💎'}</span>
            </span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
