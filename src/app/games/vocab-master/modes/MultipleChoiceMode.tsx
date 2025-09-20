import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { ModeComponent, MultipleChoiceOption, VocabularyWord } from '../types';

interface MultipleChoiceModeProps extends ModeComponent {
  onChoiceSelect: (choiceIndex: number) => void;
  selectedChoice: number | null;
  showAnswer: boolean;
  isCorrect: boolean | null;
}

export const MultipleChoiceMode: React.FC<MultipleChoiceModeProps> = ({
  gameState,
  vocabulary,
  onChoiceSelect,
  selectedChoice,
  showAnswer,
  isCorrect,
  playPronunciation,
  onExit
}) => {
  const [options, setOptions] = useState<MultipleChoiceOption[]>([]);

  useEffect(() => {
    if (gameState.currentWord) {
      generateMultipleChoiceOptions(gameState.currentWord);
    }
  }, [gameState.currentWord, vocabulary]);

  const generateMultipleChoiceOptions = (currentWord: VocabularyWord) => {
    if (!currentWord) return;

    const correctAnswer = currentWord.english || currentWord.translation || '';
    const incorrectOptions: string[] = [];

    // Get other vocabulary words for incorrect options
    const otherWords = vocabulary.filter(w => 
      w.id !== currentWord.id && 
      (w.english || w.translation) !== correctAnswer
    );

    // Randomly select 3 incorrect options
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
      const incorrectAnswer = shuffledOthers[i].english || shuffledOthers[i].translation || '';
      if (incorrectAnswer && !incorrectOptions.includes(incorrectAnswer)) {
        incorrectOptions.push(incorrectAnswer);
      }
    }

    // Fill remaining slots with generic options if needed
    const genericOptions = ['house', 'water', 'food', 'time', 'person', 'place', 'thing', 'good', 'bad', 'big'];
    while (incorrectOptions.length < 3) {
      const generic = genericOptions[Math.floor(Math.random() * genericOptions.length)];
      if (!incorrectOptions.includes(generic) && generic !== correctAnswer.toLowerCase()) {
        incorrectOptions.push(generic);
      }
    }

    // Create options array
    const allOptions: MultipleChoiceOption[] = [
      { id: 'correct', text: correctAnswer, isCorrect: true },
      ...incorrectOptions.slice(0, 3).map((text, index) => ({ id: `incorrect-${index}`, text, isCorrect: false }))
    ];

    // Shuffle options
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleOptionClick = (index: number) => {
    if (showAnswer) return;
    onChoiceSelect(index);
  };

  const getOptionStyle = (index: number, option: MultipleChoiceOption) => {
    const baseStyle = "w-full p-4 rounded-lg text-left font-medium transition-all duration-200 border-2";

    if (!showAnswer) {
      // Before answer is shown
      if (selectedChoice === index) {
        return `${baseStyle} bg-blue-100 border-blue-400 text-blue-800 scale-105`;
      }
      return `${baseStyle} bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100`;
    }

    // After answer is shown
    if (option.isCorrect) {
      return `${baseStyle} bg-green-100 border-green-400 text-green-800`;
    }

    if (selectedChoice === index && !option.isCorrect) {
      return `${baseStyle} bg-red-100 border-red-400 text-red-800`;
    }

    return `${baseStyle} bg-gray-50 border-gray-200 text-gray-600`;
  };

  const getOptionIcon = (index: number, option: MultipleChoiceOption) => {
    if (!showAnswer) return null;

    if (option.isCorrect) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }

    if (selectedChoice === index && !option.isCorrect) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }

    return null;
  };

  const baseClasses = "bg-white rounded-xl shadow-lg p-8";

  return (
    <div className="space-y-8">
      {/* Word display */}
      <motion.div
        key={gameState.currentWordIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={baseClasses}
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
          <div className="text-6xl">
            <HelpCircle className="h-16 w-16 text-purple-300 mx-auto" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Choose the correct translation:
          </h2>

          <div className="space-y-4">
            <h3 className="text-4xl font-bold text-gray-800">
              {gameState.currentWord?.spanish || gameState.currentWord?.word}
            </h3>

            {/* Audio button */}
            {gameState.currentWord?.audio_url && (
              <button
                onClick={() => gameState.currentWord && playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord)}
                disabled={gameState.audioPlaying}
                className={`p-3 rounded-full transition-colors border ${
                  gameState.audioPlaying
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-300'
                }`}
              >
                🔊
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Multiple choice options */}
      <div className={baseClasses}>
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={showAnswer}
              whileHover={{ scale: showAnswer ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={getOptionStyle(index, option)}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">
                  {String.fromCharCode(65 + index)}. {option.text}
                </span>
                {getOptionIcon(index, option)}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg text-center ${
              isCorrect
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-semibold">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {!isCorrect && (
              <p className="mt-2 text-sm">
                The correct answer is: <strong>{options.find(o => o.isCorrect)?.text}</strong>
              </p>
            )}
            
            {/* Example sentence display */}
            {gameState.currentWord?.example_sentence && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="text-sm font-medium mb-1 text-gray-600">
                  Example:
                </div>
                <div className="text-sm italic mb-1 text-gray-700">
                  {gameState.currentWord.example_sentence}
                </div>
                {gameState.currentWord?.example_translation && (
                  <div className="text-xs text-gray-500">
                    {gameState.currentWord.example_translation}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
