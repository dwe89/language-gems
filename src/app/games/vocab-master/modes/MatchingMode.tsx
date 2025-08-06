import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
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

  useEffect(() => {
    if (vocabulary.length > 0) {
      generateMatchingPairs();
    }
  }, [gameState.currentWordIndex, vocabulary]);

  const generateMatchingPairs = () => {
    // Take 6 words for matching (3 pairs visible at once)
    const startIndex = Math.max(0, gameState.currentWordIndex);
    const wordsForMatching = vocabulary.slice(startIndex, startIndex + 6);
    
    const spanish = wordsForMatching.map(w => w.spanish || w.word || '').filter(Boolean);
    const english = wordsForMatching.map(w => w.english || w.translation || '').filter(Boolean);
    
    setMatchingPairs({
      spanish: spanish.sort(() => Math.random() - 0.5),
      english: english.sort(() => Math.random() - 0.5),
      matched: new Set(),
      selectedSpanish: null,
      selectedEnglish: null
    });
  };

  const handleMatchingClick = (type: 'spanish' | 'english', index: number) => {
    if (matchingPairs.matched.has(index)) return;

    if (type === 'spanish') {
      setMatchingPairs(prev => ({ ...prev, selectedSpanish: index }));
    } else {
      setMatchingPairs(prev => ({ ...prev, selectedEnglish: index }));
    }
    
    // Check if we have both selections
    const newSelectedSpanish = type === 'spanish' ? index : matchingPairs.selectedSpanish;
    const newSelectedEnglish = type === 'english' ? index : matchingPairs.selectedEnglish;
    
    if (newSelectedSpanish !== null && newSelectedEnglish !== null) {
      // Check if it's a correct match
      const spanishWord = matchingPairs.spanish[newSelectedSpanish];
      const englishWord = matchingPairs.english[newSelectedEnglish];
      
      // Find the vocabulary word that matches
      const matchingWord = vocabulary.find(w => 
        (w.spanish === spanishWord || w.word === spanishWord) && 
        (w.english === englishWord || w.translation === englishWord)
      );
      
      if (matchingWord) {
        // Correct match
        setMatchingPairs(prev => ({
          ...prev,
          matched: new Set([...prev.matched, newSelectedSpanish, newSelectedEnglish]),
          selectedSpanish: null,
          selectedEnglish: null
        }));
        
        onMatchComplete(true, `${spanishWord} = ${englishWord}`);
      } else {
        // Incorrect match - show briefly then reset
        setTimeout(() => {
          setMatchingPairs(prev => ({
            ...prev,
            selectedSpanish: null,
            selectedEnglish: null
          }));
        }, 1000);
        
        onMatchComplete(false, `${spanishWord} ≠ ${englishWord}`);
      }
    }
  };

  const baseClasses = isAdventureMode 
    ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-600/30 shadow-2xl"
    : "bg-white rounded-xl shadow-lg p-8";

  const completedPairs = matchingPairs.matched.size / 2;
  const totalPairs = Math.min(matchingPairs.spanish.length, matchingPairs.english.length);

  return (
    <motion.div
      key={gameState.currentWordIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={baseClasses}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl">
            <Shuffle className="h-16 w-16 text-purple-300 mx-auto" />
          </div>
          
          <h2 className={`text-2xl font-bold ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
            🔗 Match Words with Translations
          </h2>

          <div className={`text-sm ${isAdventureMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Progress: {completedPairs} / {totalPairs} pairs matched
          </div>
        </div>

        {/* Matching grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Spanish words column */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold text-center ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
              Spanish
            </h3>
            {matchingPairs.spanish.map((word, index) => (
              <motion.button
                key={`spanish-${index}`}
                onClick={() => handleMatchingClick('spanish', index)}
                disabled={matchingPairs.matched.has(index)}
                whileHover={{ scale: matchingPairs.matched.has(index) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-lg font-medium transition-all duration-200 ${
                  matchingPairs.matched.has(index)
                    ? isAdventureMode
                      ? 'bg-green-500/50 text-green-200 cursor-not-allowed'
                      : 'bg-green-100 text-green-700 cursor-not-allowed'
                    : matchingPairs.selectedSpanish === index
                      ? isAdventureMode
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-purple-500 text-white shadow-lg scale-105'
                      : isAdventureMode
                        ? 'bg-slate-600/50 hover:bg-slate-500/50 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {word}
              </motion.button>
            ))}
          </div>
          
          {/* English words column */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold text-center ${isAdventureMode ? 'text-white' : 'text-gray-800'}`}>
              English
            </h3>
            {matchingPairs.english.map((word, index) => (
              <motion.button
                key={`english-${index}`}
                onClick={() => handleMatchingClick('english', index)}
                disabled={matchingPairs.matched.has(index)}
                whileHover={{ scale: matchingPairs.matched.has(index) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-lg font-medium transition-all duration-200 ${
                  matchingPairs.matched.has(index)
                    ? isAdventureMode
                      ? 'bg-green-500/50 text-green-200 cursor-not-allowed'
                      : 'bg-green-100 text-green-700 cursor-not-allowed'
                    : matchingPairs.selectedEnglish === index
                      ? isAdventureMode
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-purple-500 text-white shadow-lg scale-105'
                      : isAdventureMode
                        ? 'bg-slate-600/50 hover:bg-slate-500/50 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {word}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className={`text-center text-sm ${isAdventureMode ? 'text-slate-400' : 'text-gray-500'}`}>
          Click a Spanish word, then click its English translation to make a match
        </div>
      </div>
    </motion.div>
  );
};
