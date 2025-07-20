'use client';

import React, { useState, useEffect } from 'react';
import { CentralizedVocabularyService, CentralizedVocabularyWord } from 'gems/services/centralizedVocabularyService';
import { createClient } from '@supabase/supabase-js';
import TicTacToeGameThemed from './TicTacToeGameThemed';

interface TicTacToeGameWrapperProps {
  settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    playerMark: string;
    computerMark: string;
  };
  onBackToMenu: () => void;
  onGameEnd: (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number; perfectGame?: boolean }) => void;
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TicTacToeGameWrapper(props: TicTacToeGameWrapperProps) {
  const [vocabularyWords, setVocabularyWords] = useState<CentralizedVocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map category names to match our vocabulary database
  const mapCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'animals': 'animals',
      'food': 'food',
      'colors': 'colors',
      'numbers': 'numbers',
      'family': 'family',
      'household': 'household',
      'transport': 'transport',
      'weather': 'weather',
      'clothing': 'clothing'
    };
    return categoryMap[category] || 'animals'; // Default fallback
  };

  // Map language codes
  const mapLanguage = (language: string): string => {
    const languageMap: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'english': 'en', // We'll fallback to Spanish if English not available
      'german': 'de'
    };
    return languageMap[language] || 'es';
  };

  useEffect(() => {
    loadVocabulary();
  }, [props.settings.language, props.settings.category, props.settings.difficulty]);

  const loadVocabulary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const vocabularyService = new CentralizedVocabularyService(supabase);
      const mappedLanguage = mapLanguage(props.settings.language);
      const mappedCategory = mapCategory(props.settings.category);

      // Load vocabulary for the specified language and category
      let vocabulary: CentralizedVocabularyWord[] = [];

      try {
        vocabulary = await vocabularyService.getVocabulary({
          language: mappedLanguage,
          category: mappedCategory,
          hasAudio: true, // Prefer words with audio
          limit: 20, // TicTacToe doesn't need many words
          randomize: true
        });
      } catch (error) {
        console.warn(`Failed to load vocabulary for ${mappedLanguage}/${mappedCategory}, trying fallback`);
      }

      // Fallback to Spanish animals if no vocabulary found
      if (vocabulary.length === 0) {
        vocabulary = await vocabularyService.getVocabulary({
          language: 'es',
          category: 'animals',
          hasAudio: true,
          limit: 20,
          randomize: true
        });
      }

      setVocabularyWords(vocabulary);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading vocabulary:', error);
      setError('Failed to load vocabulary. Using fallback words.');
      setIsLoading(false);
    }
  };

  // Transform vocabulary words to the format expected by TicTacToeGameThemed
  const getFormattedVocabulary = () => {
    const formatted = vocabularyWords.map(word => ({
      word: word.word,
      translation: word.translation,
      difficulty: word.difficulty_level || 'beginner',
      audio_url: word.audio_url,
      // Add audio playback function
      playAudio: () => {
        if (word.audio_url) {
          const audio = new Audio(word.audio_url);
          audio.play().catch(error => {
            console.warn('Failed to play audio:', error);
          });
        }
      }
    }));

    return formatted;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading vocabulary...</p>
          <p className="text-white/80 text-sm mt-2">
            {props.settings.language} • {props.settings.category} • {props.settings.difficulty}
          </p>
        </div>
      </div>
    );
  }

  if (error && vocabularyWords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={() => loadVocabulary()}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors mr-4"
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
    );
  }

  return (
    <TicTacToeGameThemed
      {...props}
      vocabularyWords={getFormattedVocabulary()}
    />
  );
}
