import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Link, Zap, Target, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ModeComponent, MatchingPairs, VocabularyWord } from '../types';

interface MatchingModeProps extends ModeComponent {
  onMatchComplete: (isCorrect: boolean, matchDescription: string) => void;
}

interface MatchCard {
  id: string;
  originalId: string;
  text: string;
  isMatched: boolean;
  isSelected: boolean;
  isIncorrect: boolean;
}

export const MatchingMode: React.FC<MatchingModeProps> = ({
  gameState,
  vocabulary,
  onMatchComplete,
  onExit,
  onModeSpecificAction
}) => {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchCard | null>(null);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [showingIncorrect, setShowingIncorrect] = useState(false);

  // Generate a shuffled set of matching pairs
  const generateCards = (words: VocabularyWord[]): MatchCard[] => {
    const pairs: MatchCard[] = [];
    let uniqueIdCounter = 0;

    words.forEach(word => {
      const originalId = `pair-${uniqueIdCounter}`;
      pairs.push({
        id: `spanish-${uniqueIdCounter}`,
        originalId: originalId,
        text: word.spanish || word.word || '',
        isMatched: false,
        isSelected: false,
        isIncorrect: false,
      });
      pairs.push({
        id: `english-${uniqueIdCounter}`,
        originalId: originalId,
        text: word.english || word.translation || '',
        isMatched: false,
        isSelected: false,
        isIncorrect: false,
      });
      uniqueIdCounter++;
    });

    return pairs.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (vocabulary.length > 0) {
      const wordsForMatching = vocabulary.slice(0, 10);
      setCards(generateCards(wordsForMatching));
      setMatchedPairsCount(0);
      setSelectedCard(null);
    }
  }, [gameState.currentWordIndex, vocabulary]);

  const handleCardClick = (clickedCard: MatchCard) => {
    // Don't allow clicks on matched cards or when showing incorrect feedback
    if (clickedCard.isMatched || showingIncorrect) {
      return;
    }

    // If clicking the same card that's already selected, deselect it
    if (selectedCard && selectedCard.id === clickedCard.id) {
      setSelectedCard(null);
      setCards(prevCards => prevCards.map(c =>
        c.id === clickedCard.id ? { ...c, isSelected: false } : c
      ));
      return;
    }

    if (!selectedCard) {
      // First card selected
      setSelectedCard(clickedCard);
      setCards(prevCards => prevCards.map(c =>
        c.id === clickedCard.id ? { ...c, isSelected: true } : c
      ));
    } else {
      // Second card selected, check for match
      const isCorrectMatch = selectedCard.originalId === clickedCard.originalId;

      if (isCorrectMatch) {
        // Correct match
        if (onModeSpecificAction) onModeSpecificAction('play_sound', { soundType: 'correct' });
        setMatchedPairsCount(prev => prev + 1);
        setCards(prevCards => prevCards.map(c =>
          c.originalId === selectedCard.originalId ? { ...c, isMatched: true, isSelected: false } : c
        ));
        setSelectedCard(null);

        // Check for round completion
        const newMatchedCount = matchedPairsCount + 1;
        const totalPairs = Math.floor(cards.length / 2);
        if (newMatchedCount >= totalPairs) {
          setTimeout(() => {
            onMatchComplete(true, `Round completed! All ${totalPairs} pairs matched.`);
          }, 800);
        }
      } else {
        // Incorrect match - mark both cards as incorrect
        if (onModeSpecificAction) onModeSpecificAction('play_sound', { soundType: 'incorrect' });
        setShowingIncorrect(true);
        setCards(prevCards => prevCards.map(c =>
          c.id === clickedCard.id || c.id === selectedCard.id
            ? { ...c, isIncorrect: true, isSelected: false }
            : c
        ));

        // Reset after showing incorrect feedback
        setTimeout(() => {
          setCards(prevCards => prevCards.map(c =>
            c.id === clickedCard.id || c.id === selectedCard.id
              ? { ...c, isIncorrect: false }
              : c
          ));
          setSelectedCard(null);
          setShowingIncorrect(false);
        }, 1000);
      }
    }
  };

  const totalPairs = cards.length / 2;
  const progressPercentage = totalPairs > 0 ? (matchedPairsCount / totalPairs) * 100 : 0;
  const accuracy = gameState.correctAnswers + gameState.incorrectAnswers > 0
    ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100)
    : 0;

  // Use standard (light theme) styling
  const theme = {
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

  const getCardClasses = (card: MatchCard) => {
    if (card.isMatched) {
      return `
        cursor-not-allowed
        bg-green-100 border-green-300 text-green-700
      `;
    }

    if (card.isIncorrect) {
      return `
        animate-pulse
        bg-red-100 border-red-300 text-red-700
      `;
    }

    if (card.isSelected) {
      return `
        shadow-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-gray-800 border-indigo-400/50
      `;
    }

    return `
      bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-800
    `;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 ${theme.bgGradient}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-3">
            {onExit && (
              <button
                onClick={onExit}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-2 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <div className={`p-2 rounded-full ${theme.iconBg}`}>
              <Link className={`h-5 w-5 ${theme.accentColor}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${theme.textPrimary}`}>
                Match-Up Challenge
              </h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                {matchedPairsCount} of {totalPairs} pairs matched
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${theme.correctText}`}>
                {gameState.correctAnswers}
              </div>
              <div className={`text-xs ${theme.textTertiary}`}>Correct</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${theme.incorrectText}`}>
                {gameState.incorrectAnswers}
              </div>
              <div className={`text-xs ${theme.textTertiary}`}>Incorrect</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${theme.accuracyText}`}>
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
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mb-3"
          >
            <Target className={`h-10 w-10 mx-auto ${theme.accentColor}`} />
          </motion.div>

          <h2 className={`text-2xl font-extrabold mb-2 ${theme.textPrimary}`}>
            Connect the Pairs
          </h2>
          <p className={`text-sm ${theme.textSecondary}`}>
            Find the matching translations.
          </p>
        </div>

        {/* Unified Matching Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          <AnimatePresence>
            {cards.map(card => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card)}
                whileHover={card.isMatched ? {} : { scale: 1.02, y: -2 }}
                whileTap={card.isMatched ? {} : { scale: 0.98 }}
                animate={{
                  scale: card.isSelected ? 1.05 : 1,
                  rotate: card.isIncorrect ? 5 : 0,
                  opacity: 1,
                  y: 0
                }}
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  rotate: { duration: 0.2 }
                }}
                className={`w-full p-4 rounded-xl font-semibold text-lg md:text-xl transition-all duration-200 border-2 ${getCardClasses(card)}`}
              >
                {card.text}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
