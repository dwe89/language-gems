'use client';

import React, { useState, useEffect } from 'react';
import { useGameVocabulary, GameVocabularyWord } from '../../../../hooks/useGameVocabulary';
import { VocabBlastGameSettings } from '../page';
import VocabBlastGame from './VocabBlastGame';

interface VocabBlastGameWrapperProps {
  settings: VocabBlastGameSettings;
  onBackToMenu: () => void;
  onGameEnd: (result: { outcome: 'win' | 'loss' | 'timeout'; score: number; wordsLearned: number }) => void;
}

// Language mapping function
const mapLanguage = (language: string): string => {
  const mapping: Record<string, string> = {
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt'
  };
  return mapping[language] || 'es';
};

// Category mapping function
const mapCategory = (category: string): string => {
  const mapping: Record<string, string> = {
    'animals': 'animals',
    'food': 'food_drink',
    'colors': 'colors',
    'numbers': 'numbers_1_30',
    'family': 'family',
    'body': 'body_parts',
    'clothes': 'clothing',
    'house': 'house_home',
    'school': 'school_education',
    'transport': 'transport',
    'weather': 'weather',
    'time': 'time',
    'sports': 'sports_activities',
    'emotions': 'emotions_feelings'
  };
  return mapping[category] || category;
};

export default function VocabBlastGameWrapper(props: VocabBlastGameWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the unified vocabulary hook
  const { vocabulary, loading: vocabularyLoading, error: vocabularyError } = useGameVocabulary({
    language: mapLanguage(props.settings.language),
    categoryId: mapCategory(props.settings.category),
    subcategoryId: props.settings.subcategory,
    limit: 100, // Get more words for variety
    randomize: true,
    hasAudio: false, // Audio not required for vocab blast
    difficultyLevel: 'intermediate' // Fixed difficulty
  });

  // Transform vocabulary for the game
  const [gameVocabulary, setGameVocabulary] = useState<GameVocabularyWord[]>([]);

  useEffect(() => {
    console.log('VocabBlast: Vocabulary loaded:', vocabulary.length, 'words');
    console.log('VocabBlast: Settings:', {
      language: props.settings.language,
      category: props.settings.category,
      mappedLanguage: mapLanguage(props.settings.language),
      mappedCategory: mapCategory(props.settings.category)
    });

    if (vocabulary && vocabulary.length > 0) {
      // Use all vocabulary without difficulty filtering for now
      const limitedVocabulary = vocabulary.slice(0, 50);

      console.log('VocabBlast: Using vocabulary:', limitedVocabulary.length, 'words');
      setGameVocabulary(limitedVocabulary);
      setIsLoading(false);
    } else if (!vocabularyLoading) {
      console.log('VocabBlast: No vocabulary found, vocabulary loading:', vocabularyLoading);
      setIsLoading(false);
    }
  }, [vocabulary, vocabularyLoading]);

  useEffect(() => {
    if (vocabularyError) {
      setError(vocabularyError);
      setIsLoading(false);
    }
  }, [vocabularyError]);

  useEffect(() => {
    setIsLoading(vocabularyLoading);
  }, [vocabularyLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading vocabulary...</p>
          <p className="text-slate-400 text-sm mt-2">
            Language: {props.settings.language} | Category: {props.settings.category}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && gameVocabulary.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">⚠️ {error}</p>
          <p className="text-slate-300 mb-6">
            Could not load vocabulary for {props.settings.language} - {props.settings.category}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={props.onBackToMenu}
              className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No vocabulary found
  if (gameVocabulary.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No vocabulary found</p>
          <p className="text-slate-300 mb-6">
            No words available for {props.settings.language} - {props.settings.category}
          </p>
          <button
            onClick={props.onBackToMenu}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <VocabBlastGame
      settings={props.settings}
      vocabulary={gameVocabulary}
      onBackToMenu={props.onBackToMenu}
      onGameEnd={props.onGameEnd}
    />
  );
}
