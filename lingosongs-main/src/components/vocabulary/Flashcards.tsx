'use client';

import React, { useState, useEffect } from 'react';
import { useVocabulary, VocabularyItem } from '@/hooks/useVocabulary';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardsProps {
  language?: string;
  limit?: number;
}

export default function Flashcards({ language = 'spanish', limit = 10 }: FlashcardsProps) {
  const { vocabulary, loading, stats, reviewWord, getDueWords } = useVocabulary();
  const [dueWords, setDueWords] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Load due words filtered by language
  useEffect(() => {
    if (loading) return;
    
    const allDueWords = getDueWords().filter(word => word.language === language);
    
    // Limit the number of cards in a session
    setDueWords(allDueWords.slice(0, limit));
  }, [vocabulary, loading, language, limit]);
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleReview = async (quality: number) => {
    if (currentIndex >= dueWords.length) return;
    
    const currentWord = dueWords[currentIndex];
    
    // Update with review quality
    await reviewWord(currentWord.id, quality);
    
    // Show result briefly
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setFlipped(false);
      
      // Move to next card or complete session
      if (currentIndex < dueWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    }, 1000);
  };
  
  const resetSession = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setCompleted(false);
    setShowResult(false);
  };
  
  const getResultColor = (quality: number) => {
    if (quality <= 1) return 'bg-red-100 text-red-800';
    if (quality <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  const getResultText = (quality: number) => {
    if (quality <= 1) return 'Hard';
    if (quality <= 3) return 'Good';
    return 'Easy';
  };
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse h-64 w-full max-w-md bg-gray-100 rounded-xl"></div>
      </div>
    );
  }
  
  if (dueWords.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cards due for review!</h3>
          <p className="text-gray-500">
            You've reviewed all your vocabulary for now. Check back later for more cards.
          </p>
        </div>
      </div>
    );
  }
  
  if (completed) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Session Completed!</h3>
          <p className="text-gray-500 mb-6">
            You've reviewed {dueWords.length} vocabulary cards.
          </p>
          <button
            onClick={resetSession}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }
  
  const currentWord = dueWords[currentIndex];
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Progress</span>
          <span>{currentIndex + 1} of {dueWords.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / dueWords.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Flashcard */}
      <div className="relative h-64 w-full perspective-1000 my-4">
        <AnimatePresence>
          {showResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className={`text-center p-6 rounded-xl ${getResultColor(currentWord.srs_level)}`}>
                <p className="text-2xl font-bold">{getResultText(currentWord.srs_level)}</p>
                <p className="text-sm mt-2">Next review in {currentWord.srs_level + 1} days</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="card"
              onClick={handleFlip}
              className={`w-full h-full rounded-xl shadow-lg cursor-pointer relative transition-transform duration-500 preserve-3d ${
                flipped ? 'rotate-y-180' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s'
              }}
            >
              {/* Front of card */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex flex-col items-center justify-center p-6 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <h3 className="text-white text-2xl font-bold mb-4">{currentWord.word}</h3>
                
                {currentWord.context && (
                  <p className="text-indigo-100 text-center italic">"{currentWord.context}"</p>
                )}
                
                <p className="mt-auto text-indigo-200 text-sm">Tap to flip</p>
              </div>
              
              {/* Back of card */}
              <div 
                className="absolute inset-0 bg-white rounded-xl flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <h3 className="text-gray-800 text-2xl font-bold mb-4">{currentWord.translation}</h3>
                
                {currentWord.context && (
                  <p className="text-gray-600 text-center italic mb-6">"{currentWord.context}"</p>
                )}
                
                <div className="flex space-x-2 mt-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReview(1); }}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  >
                    Hard
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReview(3); }}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                  >
                    Good
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReview(5); }}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                  >
                    Easy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Info text */}
      <p className="text-center text-gray-500 text-sm mt-6">
        Tap the card to reveal the translation, then rate how well you knew it.
      </p>
    </div>
  );
} 