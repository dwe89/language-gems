'use client';

import React, { useState, useEffect } from 'react';
import { CentralizedVocabularyService, CentralizedVocabularyWord } from 'gems/services/centralizedVocabularyService';
import { createClient } from '@supabase/supabase-js';
import HangmanGame from './HangmanGame';

interface HangmanGameWrapperProps {
  settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords?: string[];
  };
  onBackToMenu: () => void;
  onGameEnd?: (result: 'win' | 'lose') => void;
  isFullscreen?: boolean;
}

interface VocabularyPool {
  [language: string]: {
    [category: string]: {
      [difficulty: string]: CentralizedVocabularyWord[]
    }
  }
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HangmanGameWrapper(props: HangmanGameWrapperProps) {
  const [vocabularyPool, setVocabularyPool] = useState<VocabularyPool>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map category names to match our vocabulary database
  const mapCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'animals': 'animals',
      'food': 'food', 
      'family': 'family',
      'colors': 'colors',
      'numbers': 'numbers',
      'household': 'household',
      'transport': 'transport',
      'weather': 'weather',
      'clothing': 'clothing',
      'school': 'school', // For professions, etc.
      'physicaltraits': 'school', // Map to school as general category
      'personality': 'school',
      'professions': 'school',
      'countries': 'school',
      'sports': 'school',
      'rooms': 'household', // Map rooms to household
      'foods': 'food', // Alternative food spelling
      'bodyparts': 'school', // Map to school as general category
      'verbs': 'school',
      'adjectives': 'school',
      'days': 'school',
      'months': 'school',
      'greetings': 'school',
      'phrases': 'school',
      'places': 'school'
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

  // Map difficulty levels  
  const mapDifficulty = (difficulty: string): string => {
    const difficultyMap: Record<string, string> = {
      'beginner': 'beginner',
      'intermediate': 'intermediate', 
      'advanced': 'advanced'
    };
    return difficultyMap[difficulty] || 'beginner';
  };

  useEffect(() => {
    loadVocabulary();
  }, [props.settings.language, props.settings.category]);

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
          limit: 100,
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
          limit: 50,
          randomize: true
        });
      }

      // Organize vocabulary by difficulty
      const organizedVocabulary: VocabularyPool = {};
      
      // Initialize structure
      organizedVocabulary[props.settings.language] = {};
      organizedVocabulary[props.settings.language][props.settings.category] = {
        beginner: [],
        intermediate: [],
        advanced: []
      };

      // Distribute words across difficulty levels
      // Since our vocabulary doesn't have difficulty levels, we'll distribute based on word length
      vocabulary.forEach((word, index) => {
        const wordLength = word.word.length;
        let difficulty: string;
        
        if (wordLength <= 5) {
          difficulty = 'beginner';
        } else if (wordLength <= 8) {
          difficulty = 'intermediate'; 
        } else {
          difficulty = 'advanced';
        }

        // Also distribute evenly across difficulties
        const difficultyIndex = index % 3;
        const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
        const finalDifficulty = difficultyLevels[difficultyIndex];

        organizedVocabulary[props.settings.language][props.settings.category][finalDifficulty].push(word);
      });

      // Ensure each difficulty has at least some words by redistributing if needed
      const difficulties = ['beginner', 'intermediate', 'advanced'];
      difficulties.forEach(diff => {
        if (organizedVocabulary[props.settings.language][props.settings.category][diff].length === 0) {
          // Copy from beginner as fallback
          organizedVocabulary[props.settings.language][props.settings.category][diff] = 
            [...organizedVocabulary[props.settings.language][props.settings.category]['beginner']];
        }
      });

      setVocabularyPool(organizedVocabulary);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      setError('Failed to load vocabulary. Using fallback words.');
      setIsLoading(false);
    }
  };

  // Function to get vocabulary for the game  
  const getVocabularyForGame = (): string[] => {
    try {
      const words = vocabularyPool[props.settings.language]?.[props.settings.category]?.[props.settings.difficulty] || [];
      return words.map(w => w.word);
    } catch (error) {
      console.error('Error getting vocabulary for game:', error);
      return ['gato', 'perro', 'casa', 'agua', 'sol']; // Emergency fallback
    }
  };

  // Function to get audio URL for a word
  const getAudioForWord = (word: string): string | undefined => {
    try {
      const words = vocabularyPool[props.settings.language]?.[props.settings.category]?.[props.settings.difficulty] || [];
      const vocabularyWord = words.find(w => w.word.toLowerCase() === word.toLowerCase());
      return vocabularyWord?.audio_url || undefined;
    } catch (error) {
      console.error('Error getting audio for word:', error);
      return undefined;
    }
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

  if (error && Object.keys(vocabularyPool).length === 0) {
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

  // Create enhanced settings with vocabulary access
  const enhancedSettings = {
    ...props.settings,
    customWords: getVocabularyForGame(),
    category: 'custom', // Force use of custom words which are now from database
    // Add audio function for the game to use
    playAudio: (word: string) => {
      const audioUrl = getAudioForWord(word);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
          console.warn('Failed to play audio:', error);
        });
      }
    }
  };

  return (
    <HangmanGame
      {...props}
      settings={enhancedSettings}
    />
  );
}
