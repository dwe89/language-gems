import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
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
  isAdventureMode,
  playPronunciation
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
      { text: correctAnswer, isCorrect: true },
      ...incorrectOptions.slice(0, 3).map(text => ({ text, isCorrect: false }))
    ];

    // Shuffle options
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleOptionClick = (index: number) => {
    if (showAnswer) return;
    onChoiceSelect(index);
  };

  const getOptionStyle = (index: number, option: MultipleChoiceOption) => {
    const baseStyle = isAdventureMode
      ? "w-full p-4 rounded-lg text-left font-medium transition-all duration-200 border-2"
      : "w-full p-4 rounded-lg text-left font-medium transition-all duration-200 border-2";

    if (!showAnswer) {
      // Before answer is shown
      if (selectedChoice === index) {
        return `${baseStyle} ${isAdventureMode 
          ? 'bg-blue-500/30 border-blue-400 text-white scale-105' 
          : 'bg-blue-100 border-blue-400 text-blue-800 scale-105'
        }`;
      }
      return `${baseStyle} ${isAdventureMode
        ? 'bg-slate-700/50 border-slate-600/30 text-white hover:bg-slate-600/50'
        : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
      }`;
    }

    // After answer is shown
    if (option.isCorrect) {
      return `${baseStyle} ${isAdventureMode
        ? 'bg-green-500/30 border-green-400 text-green-200'
        : 'bg-green-100 border-green-400 text-green-800'
      }`;
    }

    if (selectedChoice === index && !option.isCorrect) {
      return `${baseStyle} ${isAdventureMode
        ? 'bg-red-500/30 border-red-400 text-red-200'
        : 'bg-red-100 border-red-400 text-red-800'
      }`;
    }

    return `${baseStyle} ${isAdventureMode
      ? 'bg-slate-700/30 border-slate-600/20 text-slate-300'
      : 'bg-gray-50 border-gray-200 text-gray-600'
    }`;
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

  const baseClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-white rounded-xl shadow-lg p-8";

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
          <div className="text-6xl">
            <HelpCircle className="h-16 w-16 text-purple-300 mx-auto" />
          </div>
          
          <h2 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
            Choose the correct translation:
          </h2>

          <div className="space-y-4">
            <h3 className={`text-4xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
              {gameState.currentWord?.spanish || gameState.currentWord?.word}
            </h3>

            {/* Audio button */}
            {gameState.currentWord?.audio_url && (
              <button
                onClick={() => playPronunciation(gameState.currentWord?.spanish || '', 'es', gameState.currentWord)}
                disabled={gameState.audioPlaying}
                className={`p-3 rounded-full transition-colors border ${
                  gameState.audioPlaying
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                    : isAdventureMode
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/30'
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
                ? isAdventureMode
                  ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                  : 'bg-green-100 text-green-800 border border-green-300'
                : isAdventureMode
                  ? 'bg-red-500/20 text-red-200 border border-red-400/30'
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
          </motion.div>
        )}
      </div>
    </div>
  );
};
