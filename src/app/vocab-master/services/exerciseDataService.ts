import { createBrowserClient } from '../../../lib/supabase-client';
import { VocabularyWord, ExerciseData } from '../types';

/**
 * Service for generating exercise data for different game modes
 */
export class ExerciseDataService {
  private supabase = createBrowserClient();

  /**
   * Generates exercise data based on the game mode and current word
   */
  async generateExerciseData(
    gameMode: string,
    currentWord: VocabularyWord
  ): Promise<ExerciseData> {
    switch (gameMode) {
      case 'cloze':
        return await this.generateClozeExercise(currentWord);
      
      case 'multiple_choice':
        return this.generateMultipleChoiceExercise(currentWord);
      
      case 'listening':
        return this.generateListeningExercise(currentWord);
      
      case 'dictation':
        return this.generateDictationExercise(currentWord);
      
      default:
        return this.generateDefaultExercise(currentWord);
    }
  }

  /**
   * Generates cloze exercise data with sentence context from the database
   */
  private async generateClozeExercise(currentWord: VocabularyWord): Promise<ExerciseData> {
    const targetWord = currentWord.word || currentWord.spanish || '';

    if (!targetWord) {
      return this.generateFallbackClozeExercise(currentWord);
    }

    // First, try to use the example sentence from the current word
    if (currentWord.example_sentence && currentWord.example_translation) {
      const exampleSentence = currentWord.example_sentence;
      const exampleTranslation = currentWord.example_translation;

      // Create blanked version by replacing the target word
      const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
      const match = regex.exec(exampleSentence);

      if (match) {
        const blankedSentence = exampleSentence.replace(regex, '_____');

        return {
          type: 'cloze',
          correctAnswer: match[0], // Use the actual word from the sentence
          cloze: {
            sourceSentence: exampleSentence,
            blankedSentence: blankedSentence,
            englishTranslation: exampleTranslation,
            sourceLanguage: 'spanish',
            targetWord: match[0],
            wordPosition: match.index || 0,
            sentenceId: currentWord.id || 'current-word'
          }
        };
      }
    }

    try {
      // If no example sentence, try to find other words with example sentences containing this word
      const { data: vocabularyWithSentences, error: queryError } = await this.supabase
        .from('centralized_vocabulary')
        .select('id, word, example_sentence, example_translation')
        .eq('language', 'es')
        .not('example_sentence', 'is', null)
        .not('example_translation', 'is', null)
        .ilike('example_sentence', `%${targetWord}%`)
        .limit(5);

      if (queryError || !vocabularyWithSentences || vocabularyWithSentences.length === 0) {
        console.warn('No example sentences found for word:', targetWord);
        return this.generateFallbackClozeExercise(currentWord);
      }

      // Select a random sentence from the results
      const selectedEntry = vocabularyWithSentences[Math.floor(Math.random() * vocabularyWithSentences.length)];

      // Create blanked version
      const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
      const match = regex.exec(selectedEntry.example_sentence);

      if (match) {
        const blankedSentence = selectedEntry.example_sentence.replace(regex, '_____');

        return {
          type: 'cloze',
          correctAnswer: match[0], // Use the actual word from the sentence
          cloze: {
            sourceSentence: selectedEntry.example_sentence,
            blankedSentence: blankedSentence,
            englishTranslation: selectedEntry.example_translation,
            sourceLanguage: 'spanish',
            targetWord: match[0],
            wordPosition: match.index || 0,
            sentenceId: selectedEntry.id
          }
        };
      } else {
        return this.generateFallbackClozeExercise(currentWord);
      }

    } catch (err) {
      console.error('Error fetching example sentences for cloze:', err);
      return this.generateFallbackClozeExercise(currentWord);
    }
  }

  /**
   * Generates a fallback cloze exercise when no suitable sentences are found
   */
  private generateFallbackClozeExercise(currentWord: VocabularyWord): ExerciseData {
    const targetWord = currentWord.word || currentWord.spanish || '';
    const translation = currentWord.translation || currentWord.english || '';

    // Create more engaging fallback sentences based on word type
    const fallbackSentences = [
      {
        spanish: `Me gusta mucho ${targetWord}.`,
        english: `I really like ${translation}.`
      },
      {
        spanish: `¿Dónde está ${targetWord}?`,
        english: `Where is ${translation}?`
      },
      {
        spanish: `Necesito ${targetWord} para la clase.`,
        english: `I need ${translation} for class.`
      },
      {
        spanish: `${targetWord} es muy importante.`,
        english: `${translation} is very important.`
      },
      {
        spanish: `Voy a comprar ${targetWord}.`,
        english: `I'm going to buy ${translation}.`
      }
    ];

    // Select a random fallback sentence
    const selectedSentence = fallbackSentences[Math.floor(Math.random() * fallbackSentences.length)];
    const blankedSentence = selectedSentence.spanish.replace(targetWord, '_____');

    return {
      type: 'cloze',
      correctAnswer: targetWord,
      cloze: {
        sourceSentence: selectedSentence.spanish,
        blankedSentence: blankedSentence,
        englishTranslation: selectedSentence.english,
        sourceLanguage: 'spanish',
        targetWord: targetWord,
        wordPosition: selectedSentence.spanish.indexOf(targetWord),
        sentenceId: 'fallback'
      }
    };
  }

  /**
   * Generates multiple choice exercise data
   */
  private generateMultipleChoiceExercise(currentWord: VocabularyWord): ExerciseData {
    const correctAnswer = currentWord.english || currentWord.translation || '';
    
    return {
      type: 'multiple_choice',
      correctAnswer: correctAnswer
    };
  }

  /**
   * Generates listening exercise data
   */
  private generateListeningExercise(currentWord: VocabularyWord): ExerciseData {
    const correctAnswer = currentWord.english || currentWord.translation || '';
    
    return {
      type: 'listening',
      correctAnswer: correctAnswer
    };
  }

  /**
   * Generates dictation exercise data
   */
  private generateDictationExercise(currentWord: VocabularyWord): ExerciseData {
    const correctAnswer = currentWord.spanish || currentWord.word || '';
    
    return {
      type: 'dictation',
      correctAnswer: correctAnswer
    };
  }

  /**
   * Generates default exercise data for other modes
   */
  private generateDefaultExercise(currentWord: VocabularyWord): ExerciseData {
    const correctAnswer = currentWord.english || currentWord.translation || '';
    
    return {
      type: 'default',
      correctAnswer: correctAnswer
    };
  }
}

// Export a singleton instance
export const exerciseDataService = new ExerciseDataService();
