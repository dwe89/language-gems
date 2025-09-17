'use client';

import React, { useState } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';

interface VocabularyWordButtonProps {
  word: string;
  translation: string;
  language: string;
  context?: string;
  videoId?: string;
  videoTitle?: string;
}

export default function VocabularyWordButton({
  word,
  translation,
  language,
  context,
  videoId,
  videoTitle
}: VocabularyWordButtonProps) {
  const { addWord } = useVocabulary();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleAddWord = async () => {
    setIsAdding(true);
    
    try {
      const result = await addWord(word, translation, language, context, videoId, videoTitle);
      if (result) {
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 3000); // Reset after 3 seconds
      }
    } catch (error) {
      console.error('Error adding word:', error);
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <span className="relative inline-block">
      <span 
        className="cursor-pointer underline decoration-dotted decoration-indigo-300 hover:text-indigo-600 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleAddWord}
      >
        {word}
      </span>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-white rounded shadow-lg text-xs text-gray-700 border border-gray-200">
          <div className="font-medium text-sm mb-1">{word}</div>
          <div className="text-gray-600 mb-2">{translation}</div>
          <button
            onClick={handleAddWord}
            disabled={isAdding || isAdded}
            className={`w-full px-2 py-1 rounded text-xs font-medium ${
              isAdded
                ? 'bg-green-100 text-green-700'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {isAdding ? 'Adding...' : isAdded ? 'Added to Vocabulary!' : 'Add to Vocabulary'}
          </button>
        </div>
      )}
      
      {/* Success indicator */}
      {isAdded && (
        <span className="inline-flex ml-1 text-green-500 text-xs">✓</span>
      )}
    </span>
  );
} 