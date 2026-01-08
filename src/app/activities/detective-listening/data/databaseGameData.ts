import { GameData, CaseType, Language, Evidence, VocabularyItem, CaseData } from '../types';
import { createClient } from 'gems/lib/supabase-server';
import { CentralizedVocabularyService, CentralizedVocabularyWord } from 'gems/services/centralizedVocabularyService';
import { supabaseClient } from '../utils/audioUtils';

// Case types that map to vocabulary categories
export const caseTypes: CaseType[] = [
  {
    id: 'animals',
    name: 'Animals Case',
    description: 'Identify animal evidence from radio transmissions',
    icon: '🐾',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'food',
    name: 'Food Case', 
    description: 'Solve the mystery of missing food items',
    icon: '🍎',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'family',
    name: 'Family Case',
    description: 'Track down family member evidence',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'colors',
    name: 'Colors Case',
    description: 'Investigate colorful evidence',
    icon: '🎨',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'clothing',
    name: 'Clothing Case',
    description: 'Find clothing evidence scattered around',
    icon: '👕',
    color: 'from-yellow-500 to-orange-600'
  }
];

// Language options for the game - mapped to our vocabulary language codes
export const languages: Language[] = [
  {
    id: 'es', // Updated to match vocabulary language codes
    name: 'Spanish Station',
    flag: '🇪🇸',
    frequency: '101.5 FM'
  },
  {
    id: 'fr', // Updated to match vocabulary language codes
    name: 'French Station',
    flag: '🇫🇷',
    frequency: '102.3 FM'
  },
  {
    id: 'de', // Updated to match vocabulary language codes
    name: 'German Station',
    flag: '🇩🇪',
    frequency: '103.7 FM'
  }
];

/**
 * Convert centralized vocabulary word to VocabularyItem format
 */
function vocabularyToVocabularyItem(word: CentralizedVocabularyWord): VocabularyItem {
  // Generate plausible distractors based on the category
  const commonDistractors = generateDistractors(word.translation, word.category);
  
  return {
    id: word.id, // ✅ CRITICAL: Include UUID for vocabulary tracking
    audio: word.audio_url || `${word.word.toLowerCase().replace(/\s+/g, '_')}.mp3`,
    correct: word.translation,
    distractors: commonDistractors,
    word: word.word
  };
}

/**
 * Generate plausible distractors for a given word based on category
 */
function generateDistractors(correctAnswer: string, category?: string): string[] {
  // Category-based distractors for better game experience
  const categoryDistractors: Record<string, string[]> = {
    'animals': ['cat', 'dog', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'rabbit', 'mouse', 'elephant', 'lion', 'tiger', 'bear'],
    'food': ['apple', 'bread', 'cheese', 'chicken', 'rice', 'fish', 'meat', 'vegetables', 'fruit', 'water', 'milk', 'egg', 'potato', 'tomato'],
    'family': ['mother', 'father', 'brother', 'sister', 'grandmother', 'grandfather', 'uncle', 'aunt', 'cousin', 'son', 'daughter', 'parent'],
    'colors': ['red', 'blue', 'green', 'yellow', 'black', 'white', 'brown', 'pink', 'purple', 'orange', 'gray', 'silver'],
    'clothing': ['shirt', 'pants', 'dress', 'shoes', 'hat', 'coat', 'socks', 'jacket', 'skirt', 'sweater', 'belt', 'scarf']
  };

  // Get distractors from the same category if available
  const categoryOptions = categoryDistractors[category || ''] || categoryDistractors['animals'];
  
  // Filter out the correct answer and get 2 random distractors
  const availableDistractors = categoryOptions.filter(option => 
    option.toLowerCase() !== correctAnswer.toLowerCase()
  );
  
  // Shuffle and take first 2
  const shuffled = [...availableDistractors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

/**
 * Generate game data using centralized vocabulary service
 */
export async function generateGameData(
  caseTypeId: string, 
  languageId: string = 'es', // Default to Spanish
  evidenceCount: number = 15
): Promise<GameData> {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    
    // Fetch vocabulary words for the specific language and category
    const vocabularyWords = await vocabularyService.getVocabulary({
      language: languageId,
      category: caseTypeId, // Case type ID maps directly to category
      limit: evidenceCount,
      randomize: true,
      difficulty_level: 'beginner',
      hasAudio: true // Only get words with audio URLs for Detective Listening
    });

    // If we don't have enough words for this specific category, get more from the same language
    let finalWords = vocabularyWords;
    if (vocabularyWords.length < evidenceCount) {
      const additionalWords = await vocabularyService.getVocabulary({
        language: languageId,
        limit: evidenceCount - vocabularyWords.length,
        randomize: true,
        excludeIds: vocabularyWords.map((w: CentralizedVocabularyWord) => w.id),
        difficulty_level: 'beginner',
        hasAudio: true // Only get words with audio URLs for Detective Listening
      });
      finalWords = [...vocabularyWords, ...additionalWords];
    }

    // Convert vocabulary to VocabularyItems
    const vocabularyItems = finalWords
      .slice(0, evidenceCount)
      .map((word: CentralizedVocabularyWord) => vocabularyToVocabularyItem(word));

    // Create GameData structure: { caseType: { language: VocabularyItem[] } }
    const gameData: GameData = {
      [caseTypeId]: {
        [languageId]: vocabularyItems
      }
    };

    return gameData;
  } catch (error) {
    console.error('Error generating game data:', error);
    
    // Fallback to empty data with error indication
    const gameData: GameData = {
      [caseTypeId]: {
        [languageId]: []
      }
    };
    return gameData;
  }
}

/**
 * Get available case types based on vocabulary categories
 */
export async function getAvailableCaseTypes(languageId: string = 'es'): Promise<CaseType[]> {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    const availableCategories = await vocabularyService.getCategoriesForLanguage(languageId);
    
    // Filter case types to only those with available categories
    return caseTypes.filter(caseType => 
      availableCategories.includes(caseType.id)
    );
  } catch (error) {
    console.error('Error getting available case types:', error);
    return caseTypes; // Return all case types as fallback
  }
}

/**
 * Get available languages
 */
export async function getAvailableLanguages(): Promise<Language[]> {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    const availableLanguageCodes = await vocabularyService.getAvailableLanguages();
    
    // Filter languages to only those with available vocabulary
    return languages.filter(language => 
      availableLanguageCodes.includes(language.id)
    );
  } catch (error) {
    console.error('Error getting available languages:', error);
    return languages; // Return all languages as fallback
  }
}

/**
 * Get vocabulary statistics for the game
 */
export async function getGameVocabularyStats() {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    return await vocabularyService.getVocabularyStats();
  } catch (error) {
    console.error('Error getting vocabulary stats:', error);
    return {
      totalWords: 0,
      totalLanguages: 0,
      totalCategories: 0,
      languages: [],
      categories: [],
      languageStats: []
    };
  }
}

/**
 * Get Detective Listening specific vocabulary for a language
 */
export async function getDetectiveListeningVocabulary(
  languageId: string = 'es',
  count: number = 10
): Promise<CentralizedVocabularyWord[]> {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    return await vocabularyService.getDetectiveListeningVocabulary(languageId, count);
  } catch (error) {
    console.error('Error getting Detective Listening vocabulary:', error);
    return [];
  }
}
