'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Search, Headphones, CreditCard, Music, Zap } from 'lucide-react';

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
                 rounded-3xl p-6 border-2 border-slate-600/30 shadow-2xl"
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
          {gameState.gameMode === 'multiple_choice' ? <><Search className="h-5 w-5" /> Mine the Translation</> :
           gameState.gameMode === 'dictation' ? <><Headphones className="h-5 w-5" /> Mine the Audio</> :
           gameState.gameMode === 'flashcards' ? <><CreditCard className="h-5 w-5" /> Mine the Memory</> :
           gameState.gameMode === 'listening' ? <><Music className="h-5 w-5" /> Mine the Sound</> :
           gameState.gameMode === 'typing' ? <><Zap className="h-5 w-5" /> Mine for Double Points</> :
           <><Search className="h-5 w-5" /> Mine the Translation</>}
        </h3>
        <p className="text-slate-300 text-sm">
          {gameState.gameMode === 'multiple_choice' ? 'Choose the correct English meaning' :
           gameState.gameMode === 'dictation' ? 'Type what you heard' :
           gameState.gameMode === 'flashcards' ? 'Test your memory recall' :
           gameState.gameMode === 'listening' ? 'Listen and type the translation' :
           gameState.gameMode === 'typing' ? 'Type the exact English translation' :
           'Extract the English meaning'}
        </p>
      </div>

      {gameState.gameMode === 'multiple_choice' ? (
        <div className="space-y-2 min-h-[240px] flex flex-col">
          <div className="flex-1 flex flex-col justify-center space-y-2">
            {multipleChoiceOptions.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(index.toString(), true)}
                className="w-full bg-gradient-to-r from-slate-700/60 to-slate-800/60 hover:from-slate-600/60 hover:to-slate-700/60 
                         border-2 border-slate-600/30 hover:border-slate-500/50 rounded-xl p-3 text-white text-left 
                         transition-all duration-200 backdrop-blur-sm"
              >
                <span className="font-medium text-sm">{option.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ) : gameState.gameMode === 'dictation' ? (
        <div className="space-y-3 min-h-[240px] flex flex-col">
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={gameState.userAnswer}
                onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswer(gameState.userAnswer)}
                placeholder="Type what you heard..."
                className="w-full bg-slate-700/40 border-2 border-slate-600/30 focus:border-green-500/50 
                         rounded-xl px-4 py-3 text-white text-base placeholder-slate-400 
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
                       disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl 
                       transition-all duration-200 disabled:cursor-not-allowed shadow-lg text-base
                       disabled:opacity-50 transform hover:shadow-green-500/25"
            >
              <span className="flex items-center justify-center space-x-2">
                <Mic className="h-4 w-4" />
                <span>Submit Dictation</span>
              </span>
            </motion.button>
          </div>
        </div>
      ) : gameState.gameMode === 'flashcards' ? (
        <div className="space-y-3 min-h-[240px] flex flex-col">
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {/* Flashcard */}
            <motion.div
              className="relative h-24 w-full max-w-sm mx-auto cursor-pointer"
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
                           border-2 border-yellow-500/30 rounded-xl p-3 flex flex-col justify-center items-center
                           backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-yellow-300 text-xs mb-1 text-center">
                    Click to flip
                  </div>
                  <div className="text-white font-bold text-lg text-center">
                    {gameState.currentWord?.spanish || ''}
                  </div>
                </div>

                {/* Back of card (English) */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20
                           border-2 border-green-500/30 rounded-xl p-3 flex flex-col justify-center items-center
                           backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="text-green-300 text-xs mb-1 text-center">
                    Click to flip
                  </div>
                  <div className="text-white font-bold text-lg text-center">
                    {gameState.currentWord?.english || ''}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFlashcardResponse(true)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                         text-white font-semibold py-2 px-3 rounded-xl transition-all duration-200 shadow-lg
                         transform hover:shadow-green-500/25 text-xs"
              >
                <span className="flex items-center justify-center">
                  <span>✓ I knew it</span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFlashcardResponse(false)}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500
                         text-white font-semibold py-2 px-3 rounded-xl transition-all duration-200 shadow-lg
                         transform hover:shadow-red-500/25 text-xs"
              >
                <span className="flex items-center justify-center">
                  <span>✗ Don't know</span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 min-h-[240px] flex flex-col">
          <div className="flex-1 flex flex-col justify-center space-y-3">
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
                      ? "Type the English translation"
                      : gameState.gameMode === 'learn'
                        ? "Type the English translation"
                        : "Type the English translation"
                }
                className="w-full bg-slate-700/40 border-2 border-slate-600/30 focus:border-blue-500/50 
                         rounded-xl px-4 py-3 text-white text-base placeholder-slate-400 
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
                className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2"
              >
                <div className="flex items-center space-x-2 text-yellow-200">
                  <span>💡</span>
                  <span className="text-xs">
                    Hint: The answer starts with "{getWordProperty(gameState.currentWord, 'english').charAt(0).toUpperCase()}"
                  </span>
                </div>
              </motion.div>
            )}

            {/* Hint Button for Learn Mode */}
            {gameState.gameMode === 'learn' && !showHint && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowHint(true)}
                  className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 
                           text-yellow-200 rounded-lg text-xs transition-colors flex items-center space-x-2"
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
              className={`w-full font-bold py-3 px-6 rounded-xl 
                       transition-all duration-200 disabled:cursor-not-allowed shadow-lg text-base
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
        </div>
      )}
    </motion.div>
  );
};
