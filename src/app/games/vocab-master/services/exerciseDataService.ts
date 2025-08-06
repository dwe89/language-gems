import { createBrowserClient } from '../../../../lib/supabase-client';
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
    const targetWord = currentWord.spanish || currentWord.word || '';
    
    if (!targetWord) {
      return this.generateFallbackClozeExercise(currentWord);
    }

    try {
      // Query for sentences containing the target word
      const { data: sentences, error: queryError } = await this.supabase
        .from('sentences')
        .select('*')
        .eq('source_language', 'spanish') // TODO: Make this dynamic based on word language
        .ilike('source_sentence', `%${targetWord}%`)
        .eq('is_active', true)
        .limit(5);

      if (queryError || !sentences || sentences.length === 0) {
        console.warn('No sentences found for word:', targetWord);
        return this.generateFallbackClozeExercise(currentWord);
      }

      // Select a random sentence from the results
      const selectedSentence = sentences[Math.floor(Math.random() * sentences.length)];
      
      // Create blanked version
      const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
      const match = regex.exec(selectedSentence.source_sentence);
      
      if (match) {
        const blankedSentence = selectedSentence.source_sentence.replace(regex, '_____');
        
        return {
          type: 'cloze',
          correctAnswer: match[0], // Use the actual word from the sentence
          cloze: {
            sourceSentence: selectedSentence.source_sentence,
            blankedSentence: blankedSentence,
            englishTranslation: selectedSentence.english_translation,
            sourceLanguage: selectedSentence.source_language,
            targetWord: match[0],
            wordPosition: match.index,
            sentenceId: selectedSentence.id
          }
        };
      } else {
        return this.generateFallbackClozeExercise(currentWord);
      }
      
    } catch (err) {
      console.error('Error fetching sentences for cloze:', err);
      return this.generateFallbackClozeExercise(currentWord);
    }
  }

  /**
   * Generates a fallback cloze exercise when no suitable sentences are found
   */
  private generateFallbackClozeExercise(currentWord: VocabularyWord): ExerciseData {
    const targetWord = currentWord.spanish || currentWord.word || '';
    const translation = currentWord.english || currentWord.translation || '';
    
    const simpleSentence = `Esta palabra es ${targetWord} en español.`;
    const blankedSentence = simpleSentence.replace(targetWord, '_____');
    
    return {
      type: 'cloze',
      correctAnswer: targetWord,
      cloze: {
        sourceSentence: simpleSentence,
        blankedSentence: blankedSentence,
        englishTranslation: `This word is ${translation} in Spanish.`,
        sourceLanguage: 'spanish',
        targetWord: targetWord,
        wordPosition: simpleSentence.indexOf(targetWord),
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
