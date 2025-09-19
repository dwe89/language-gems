import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Link, Zap, Target, CheckCircle2 } from 'lucide-react';
import { ModeComponent, MatchingPairs, VocabularyWord } from '../types';

interface MatchingModeProps extends ModeComponent {
  onMatchComplete: (isCorrect: boolean, matchDescription: string) => void;
}

export const MatchingMode: React.FC<MatchingModeProps> = ({
  gameState,
  vocabulary,
  onMatchComplete,
  isAdventureMode
}) => {
  const [matchingPairs, setMatchingPairs] = useState<MatchingPairs>({
    spanish: [],
    english: [],
    matched: new Set(),
    selectedSpanish: null,
    selectedEnglish: null
  });
  const [showingIncorrect, setShowingIncorrect] = useState(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);

  useEffect(() => {
    if (vocabulary.length > 0) {
      generateMatchingPairs();
    }
  }, [gameState.currentWordIndex, vocabulary]);

  const generateMatchingPairs = () => {
    // Take 5 words for matching (better for screen space)
    const startIndex = Math.max(0, gameState.currentWordIndex);
    const wordsForMatching = vocabulary.slice(startIndex, startIndex + 5);

    const spanishWords = wordsForMatching.map((w, i) => ({
      id: i,
      text: w.word || w.spanish || '',
      originalWord: w
    })).filter(item => item.text);

    const englishWords = wordsForMatching.map((w, i) => ({
      id: i,
      text: w.translation || w.english || '',
      originalWord: w
    })).filter(item => item.text);

    setMatchingPairs({
      spanish: spanishWords.sort(() => Math.random() - 0.5),
      english: englishWords.sort(() => Math.random() - 0.5),
      matched: new Set(),
      selectedSpanish: null,
      selectedEnglish: null
    });
    setMatchedPairsCount(0);
  };

  const handleMatchingClick = (type: 'spanish' | 'english', index: number) => {
    if (matchingPairs.matched.has(index) || showingIncorrect) return;

    if (type === 'spanish') {
      if (matchingPairs.selectedSpanish === index) {
        setMatchingPairs(prev => ({ ...prev, selectedSpanish: null }));
        return;
      }
      setMatchingPairs(prev => ({ ...prev, selectedSpanish: index }));
    } else {
      if (matchingPairs.selectedEnglish === index) {
        setMatchingPairs(prev => ({ ...prev, selectedEnglish: null }));
        return;
      }
      setMatchingPairs(prev => ({ ...prev, selectedEnglish: index }));
    }

    const newSelectedSpanish = type === 'spanish' ? index : matchingPairs.selectedSpanish;
    const newSelectedEnglish = type === 'english' ? index : matchingPairs.selectedEnglish;

    if (newSelectedSpanish !== null && newSelectedEnglish !== null) {
      const spanishWord = matchingPairs.spanish[newSelectedSpanish];
      const englishWord = matchingPairs.english[newSelectedEnglish];
      const isCorrectMatch = spanishWord.id === englishWord.id;

      if (isCorrectMatch) {
        const spanishMatchIndex = newSelectedSpanish;
        const englishMatchIndex = newSelectedEnglish + matchingPairs.spanish.length;

        setMatchingPairs(prev => ({
          ...prev,
          matched: new Set([...prev.matched, spanishMatchIndex, englishMatchIndex]),
          selectedSpanish: null,
          selectedEnglish: null
        }));

        const newMatchedCount = matchedPairsCount + 1;
        setMatchedPairsCount(newMatchedCount);
        
        const totalPairs = Math.min(matchingPairs.spanish.length, matchingPairs.english.length);
        if (newMatchedCount >= totalPairs) {
          setTimeout(() => {
            onMatchComplete(true, `Round completed! All ${totalPairs} pairs matched.`);
          }, 500);
        }
      } else {
        setShowingIncorrect(true);
        setTimeout(() => {
          setMatchingPairs(prev => ({
            ...prev,
            selectedSpanish: null,
            selectedEnglish: null
          }));
          setShowingIncorrect(false);
        }, 1200);
      }
    }
  };

  const totalPairs = Math.min(matchingPairs.spanish.length, matchingPairs.english.length);
  const progressPercentage = totalPairs > 0 ? (matchedPairsCount / totalPairs) * 100 : 0;
  const accuracy = gameState.correctAnswers + gameState.incorrectAnswers > 0
    ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100)
    : 0;

  // Use a single object for common themes to reduce repetition and improve readability.
  const theme = isAdventureMode
    ? {
      // Adventure Mode (Dark)
      bgGradient: 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-2xl',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      accentColor: 'text-pink-300',
      progressBg: 'bg-slate-700',
      progressFill: 'bg-gradient-to-r from-pink-500 to-rose-500',
      correctText: 'text-green-400',
      incorrectText: 'text-red-400',
      accuracyText: 'text-blue-400',
      iconBg: 'bg-pink-500/20',
    }
    : {
      // Default Mode (Light)
      bgGradient: 'bg-white shadow-xl border border-gray-100',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textTertiary: 'text-gray-500',
      accentColor: 'text-pink-600',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-gradient-to-r from-pink-500 to-rose-500',
      correctText: 'text-green-600',
      incorrectText: 'text-red-600',
      accuracyText: 'text-blue-600',
      iconBg: 'bg-pink-100',
    };

  // Helper function for button styling to simplify the JSX
  const getButtonClasses = (type: 'spanish' | 'english', index: number) => {
    const isSpanish = type === 'spanish';
    const isMatched = isSpanish
      ? matchingPairs.matched.has(index)
      : matchingPairs.matched.has(index + matchingPairs.spanish.length);
    const isSelected = isSpanish
      ? matchingPairs.selectedSpanish === index
      : matchingPairs.selectedEnglish === index;
    const isIncorrectSelection = showingIncorrect && isSelected;

    if (isMatched) {
      return `
        cursor-not-allowed
        ${isAdventureMode ? 'bg-green-500/30 border-green-400/50 text-green-200' : 'bg-green-100 border-green-300 text-green-700'}
      `;
    }

    if (isIncorrectSelection) {
      return `
        animate-pulse
        ${isAdventureMode ? 'bg-red-500/30 border-red-400/50 text-red-200' : 'bg-red-100 border-red-300 text-red-700'}
      `;
    }

    if (isSelected) {
      const selectedBg = isSpanish ? 'from-blue-500 to-indigo-500' : 'from-pink-500 to-rose-500';
      const selectedBorder = isSpanish ? 'border-blue-400' : 'border-pink-400';
      return `
        ${isAdventureMode ? 'shadow-lg' : 'shadow-lg'}
        bg-gradient-to-r ${selectedBg} text-white ${selectedBorder}
      `;
    }

    return `
      ${isAdventureMode ? 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-500/30 hover:border-slate-400/50 text-white' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-800'}
    `;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 ${theme.bgGradient}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${theme.iconBg}`}>
              <Link className={`h-6 w-6 ${theme.accentColor}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme.textPrimary}`}>
                Match-Up Challenge
              </h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                {matchedPairsCount} of {totalPairs} pairs matched
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.correctText}`}>
                {gameState.correctAnswers}
              </div>
              <div className={`text-xs ${theme.textTertiary}`}>Correct</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.incorrectText}`}>
                {gameState.incorrectAnswers}
              </div>
              <div className={`text-xs ${theme.textTertiary}`}>Incorrect</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.accuracyText}`}>
                {accuracy}%
              </div>
              <div className={`text-xs ${theme.textTertiary}`}>Accuracy</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className={`h-2.5 rounded-full overflow-hidden ${theme.progressBg}`}>
            <motion.div
              className={`h-full ${theme.progressFill} rounded-full`}
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
        className={`rounded-3xl p-8 ${theme.bgGradient}`}
      >
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mb-4"
          >
            <Target className={`h-16 w-16 mx-auto ${theme.accentColor}`} />
          </motion.div>

          <h2 className={`text-4xl font-extrabold mb-2 ${theme.textPrimary}`}>
            Connect the Pairs
          </h2>
          <p className={`text-lg ${theme.textSecondary}`}>
            Click a word, then click its translation.
          </p>
        </div>

        {/* Matching Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
          {/* Spanish Words Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <h3 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
                Español
              </h3>
            </div>
            <div className="space-y-3">
              {matchingPairs.spanish.map((word, index) => (
                <motion.button
                  key={`spanish-${index}`}
                  onClick={() => handleMatchingClick('spanish', index)}
                  disabled={matchingPairs.matched.has(index) || showingIncorrect}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ scale: matchingPairs.selectedSpanish === index ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    w-full p-4 rounded-xl font-semibold text-xl transition-all duration-200 border-2
                    ${getButtonClasses('spanish', index)}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{word.text}</span>
                    {matchingPairs.matched.has(index) && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {matchingPairs.selectedSpanish === index && !matchingPairs.matched.has(index) && <Zap className="h-5 w-5" />}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* English Words Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <h3 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
                English
              </h3>
            </div>
            <div className="space-y-3">
              {matchingPairs.english.map((word, index) => (
                <motion.button
                  key={`english-${index}`}
                  onClick={() => handleMatchingClick('english', index)}
                  disabled={matchingPairs.matched.has(index + matchingPairs.spanish.length) || showingIncorrect}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ scale: matchingPairs.selectedEnglish === index ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    w-full p-4 rounded-xl font-semibold text-xl transition-all duration-200 border-2
                    ${getButtonClasses('english', index)}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{word.text}</span>
                    {matchingPairs.matched.has(index + matchingPairs.spanish.length) && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {matchingPairs.selectedEnglish === index && !matchingPairs.matched.has(index + matchingPairs.spanish.length) && <Zap className="h-5 w-5" />}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};