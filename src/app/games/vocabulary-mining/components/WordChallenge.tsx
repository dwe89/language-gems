'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, EyeOff, Lightbulb, Clock, RotateCcw } from 'lucide-react';
import { VocabularyWord, MultipleChoiceOption } from '../hooks/useGameLogic';

interface WordChallengeProps {
  currentWord: VocabularyWord | null;
  gameMode: string;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onPlayAudio: () => void;
  onToggleHint: () => void;
  showHint: boolean;
  showAnswer: boolean;
  isCorrect: boolean | null;
  feedback: string;
  multipleChoiceOptions: MultipleChoiceOption[];
  selectedChoice: number | null;
  onChoiceSelect: (index: number) => void;
  speedModeTimeLeft: number;
  isFlashcardFlipped: boolean;
  onFlashcardFlip: () => void;
  onFlashcardResponse: (knew: boolean) => void;
  canReplayAudio: boolean;
  audioReplayCount: number;
  maxAudioReplays?: number;
}

export const WordChallenge: React.FC<WordChallengeProps> = ({
  currentWord,
  gameMode,
  userAnswer,
  onAnswerChange,
  onSubmit,
  onPlayAudio,
  onToggleHint,
  showHint,
  showAnswer,
  isCorrect,
  feedback,
  multipleChoiceOptions,
  selectedChoice,
  onChoiceSelect,
  speedModeTimeLeft,
  isFlashcardFlipped,
  onFlashcardFlip,
  onFlashcardResponse,
  canReplayAudio,
  audioReplayCount,
  maxAudioReplays = 3
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when component mounts or word changes
  useEffect(() => {
    if (inputRef.current && !showAnswer && gameMode !== 'multiple_choice' && gameMode !== 'flashcards') {
      inputRef.current.focus();
    }
  }, [currentWord, showAnswer, gameMode]);

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading word...</div>
      </div>
    );
  }

  const getWordToDisplay = () => {
    if (gameMode === 'dictation' || gameMode === 'listening') {
      return '🎧 Listen and respond';
    }
    return currentWord.spanish || currentWord.word || '';
  };

  const getPlaceholderText = () => {
    switch (gameMode) {
      case 'dictation':
        return 'Type what you hear...';
      case 'listening':
        return 'Type the English translation...';
      case 'typing':
        return 'Type the translation (double points!)...';
      default:
        return 'Type your answer...';
    }
  };

  const renderSpeedTimer = () => {
    if (gameMode !== 'speed') return null;

    const timePercentage = (speedModeTimeLeft / 10) * 100;
    const isUrgent = speedModeTimeLeft <= 3;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500' : 'text-blue-500'}`} />
            <span className={`text-sm font-medium ${isUrgent ? 'text-red-500' : 'text-gray-600'}`}>
              Time: {speedModeTimeLeft}s
            </span>
          </div>
        </div>
        
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${timePercentage}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    );
  };

  const renderFlashcard = () => {
    if (gameMode !== 'flashcards') return null;

    return (
      <div className="space-y-6">
        <motion.div
          className="relative h-48 cursor-pointer"
          onClick={onFlashcardFlip}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <div className="flex items-center justify-center h-full text-white">
              <AnimatePresence mode="wait">
                {!isFlashcardFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold mb-2">{currentWord.spanish}</div>
                    <div className="text-sm opacity-75">Click to reveal translation</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold mb-2">{currentWord.english}</div>
                    {currentWord.example_sentence && (
                      <div className="text-sm opacity-75 max-w-xs">
                        "{currentWord.example_sentence}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {isFlashcardFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-4"
          >
            <button
              onClick={() => onFlashcardResponse(false)}
              className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              I didn't know
            </button>
            <button
              onClick={() => onFlashcardResponse(true)}
              className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              I knew it
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  const renderMultipleChoice = () => {
    if (gameMode !== 'multiple_choice') return null;

    return (
      <div className="space-y-3">
        {multipleChoiceOptions.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onChoiceSelect(index)}
            className={`
              w-full p-4 text-left rounded-lg border-2 transition-all
              ${selectedChoice === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${selectedChoice === index
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300'
                }
              `}>
                {selectedChoice === index && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="font-medium">{option.text}</span>
            </div>
          </motion.button>
        ))}
      </div>
    );
  };

  const renderTextInput = () => {
    if (gameMode === 'multiple_choice' || gameMode === 'flashcards') return null;

    return (
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          placeholder={getPlaceholderText()}
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={showAnswer}
        />
        
        <button
          onClick={onSubmit}
          disabled={!userAnswer.trim() || showAnswer}
          className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
        >
          Submit Answer
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {renderSpeedTimer()}
      
      {/* Word Display */}
      <div className="text-center mb-6">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          {getWordToDisplay()}
        </motion.div>
        
        {/* Audio and Hint Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          {currentWord.audio_url && (
            <button
              onClick={onPlayAudio}
              disabled={!canReplayAudio}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${canReplayAudio
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Volume2 className="w-4 h-4" />
              <span>
                Play Audio {!canReplayAudio && `(${audioReplayCount}/${maxAudioReplays})`}
              </span>
            </button>
          )}
          
          {gameMode === 'learn' && (
            <button
              onClick={onToggleHint}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
          )}
        </div>
        
        {/* Hint Display */}
        {showHint && gameMode === 'learn' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700 mb-4"
          >
            💡 The answer starts with "{currentWord.english?.charAt(0) || '?'}"
          </motion.div>
        )}
      </div>
      
      {/* Game Mode Specific Content */}
      {renderFlashcard()}
      {renderMultipleChoice()}
      {renderTextInput()}
      
      {/* Feedback */}
      {showAnswer && feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mt-4 p-4 rounded-lg text-center font-medium
            ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}
        >
          {feedback}
          {currentWord.example_sentence && (
            <div className="mt-2 text-sm opacity-75">
              Example: "{currentWord.example_sentence}"
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
