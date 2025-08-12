/**
 * Unified Word Selection Service
 * Intelligently selects vocabulary words based on FSRS data to optimize learning
 * and prevent grinding of already-mastered content
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface WordSelectionFilters {
  language?: string;
  category?: string;
  subcategory?: string;
  curriculumLevel?: 'KS3' | 'KS4';
  examBoard?: string;
  tier?: string;
  difficultyRange?: [number, number];
  excludeWordIds?: number[];
}

export interface WordSelectionOptions {
  maxWords?: number;
  prioritizeReviews?: boolean;
  includeNewWords?: boolean;
  balanceRatio?: {
    reviews: number;    // e.g., 0.7 = 70% reviews
    new: number;        // e.g., 0.3 = 30% new words
  };
  gameType?: string;
  sessionMode?: 'free_play' | 'assignment' | 'practice' | 'challenge';
}

export interface SelectedWord {
  id: number;
  word: string;
  translation: string;
  language: string;
  category?: string;
  subcategory?: string;
  partOfSpeech?: string;
  audioUrl?: string;
  exampleSentence?: string;
  
  // SRS data
  masteryLevel: number;
  nextReviewAt?: string;
  fsrsDifficulty?: number;
  fsrsStability?: number;
  fsrsRetrievability?: number;
  totalEncounters: number;
  correctEncounters: number;
  
  // Selection context
  selectionReason: 'due_review' | 'struggling' | 'new_word' | 'random_practice';
  maxGemRarity: string;
}

export class UnifiedWordSelectionService {
  private supabase: SupabaseClient;
  
  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  
  /**
   * Main method to select words for a game session
   */
  async selectWordsForSession(
    studentId: string,
    filters: WordSelectionFilters = {},
    options: WordSelectionOptions = {}
  ): Promise<SelectedWord[]> {
    const {
      maxWords = 20,
      prioritizeReviews = true,
      includeNewWords = true,
      balanceRatio = { reviews: 0.7, new: 0.3 },
      sessionMode = 'free_play'
    } = options;
    
    // For assignments, use different logic (teacher-selected words)
    if (sessionMode === 'assignment') {
      return this.selectAssignmentWords(studentId, filters, maxWords);
    }

    // For assessments, use balanced selection (no SRS bias)
    if (sessionMode === 'assessment') {
      return this.selectAssessmentWords(studentId, filters, maxWords);
    }
    
    const selectedWords: SelectedWord[] = [];
    
    if (prioritizeReviews) {
      // Get words due for review
      const reviewWords = await this.getWordsForReview(studentId, filters, Math.floor(maxWords * balanceRatio.reviews));
      selectedWords.push(...reviewWords);
      
      // Get struggling words (low accuracy, high encounters)
      const strugglingWords = await this.getStrugglingWords(studentId, filters, Math.max(2, Math.floor(maxWords * 0.2)));
      selectedWords.push(...strugglingWords.filter(w => !selectedWords.find(s => s.id === w.id)));
    }
    
    // Fill remaining slots with new words if enabled
    if (includeNewWords && selectedWords.length < maxWords) {
      const remainingSlots = maxWords - selectedWords.length;
      const newWords = await this.getNewWords(studentId, filters, remainingSlots);
      selectedWords.push(...newWords);
    }
    
    // If still not enough words, get random practice words
    if (selectedWords.length < maxWords) {
      const remainingSlots = maxWords - selectedWords.length;
      const practiceWords = await this.getRandomPracticeWords(studentId, filters, remainingSlots, selectedWords.map(w => w.id));
      selectedWords.push(...practiceWords);
    }
    
    return this.shuffleArray(selectedWords);
  }
  
  /**
   * Get words that are due for review based on FSRS scheduling
   */
  private async getWordsForReview(
    studentId: string,
    filters: WordSelectionFilters,
    limit: number
  ): Promise<SelectedWord[]> {
    try {
      let query = this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          vocabulary_item_id,
          mastery_level,
          next_review_at,
          fsrs_difficulty,
          fsrs_stability,
          fsrs_retrievability,
          total_encounters,
          correct_encounters,
          max_gem_rarity,
          centralized_vocabulary!inner(
            id, word, translation, language, category, subcategory,
            part_of_speech, audio_url, example_sentence
          )
        `)
        .eq('student_id', studentId)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true })
        .limit(limit);
      
      // Apply filters
      query = this.applyFilters(query, filters);
      
      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(item => this.mapToSelectedWord(item, 'due_review'));
    } catch (error) {
      console.error('Error fetching words for review:', error);
      return [];
    }
  }
  
  /**
   * Get words the student is struggling with
   */
  private async getStrugglingWords(
    studentId: string,
    filters: WordSelectionFilters,
    limit: number
  ): Promise<SelectedWord[]> {
    try {
      let query = this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          vocabulary_item_id,
          mastery_level,
          next_review_at,
          fsrs_difficulty,
          fsrs_stability,
          fsrs_retrievability,
          total_encounters,
          correct_encounters,
          max_gem_rarity,
          centralized_vocabulary!vocabulary_gem_collection_vocabulary_item_id_fkey(
            id, word, translation, language, category, subcategory,
            part_of_speech, audio_url, example_sentence
          )
        `)
        .eq('student_id', studentId)
        .gte('total_encounters', 3) // Must have been encountered multiple times
        .lt('correct_encounters::float / total_encounters::float', 0.6) // Less than 60% accuracy
        .order('correct_encounters::float / total_encounters::float', { ascending: true })
        .limit(limit);
      
      query = this.applyFilters(query, filters);
      
      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(item => this.mapToSelectedWord(item, 'struggling'));
    } catch (error) {
      console.error('Error fetching struggling words:', error);
      return [];
    }
  }
  
  /**
   * Get new words the student hasn't encountered yet
   */
  private async getNewWords(
    studentId: string,
    filters: WordSelectionFilters,
    limit: number
  ): Promise<SelectedWord[]> {
    try {
      let query = this.supabase
        .from('centralized_vocabulary')
        .select('*')
        .not('id', 'in', 
          `(SELECT vocabulary_item_id FROM vocabulary_gem_collection WHERE student_id = '${studentId}')`
        )
        .limit(limit);
      
      // Apply vocabulary filters
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
      }
      if (filters.curriculumLevel) {
        query = query.eq('curriculum_level', filters.curriculumLevel);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        language: item.language,
        category: item.category,
        subcategory: item.subcategory,
        partOfSpeech: item.part_of_speech,
        audioUrl: item.audio_url,
        exampleSentence: item.example_sentence,
        masteryLevel: 0,
        totalEncounters: 0,
        correctEncounters: 0,
        selectionReason: 'new_word' as const,
        maxGemRarity: 'rare' // New words capped at rare initially
      }));
    } catch (error) {
      console.error('Error fetching new words:', error);
      return [];
    }
  }
  
  /**
   * Get random practice words for variety
   */
  private async getRandomPracticeWords(
    studentId: string,
    filters: WordSelectionFilters,
    limit: number,
    excludeIds: number[]
  ): Promise<SelectedWord[]> {
    try {
      let query = this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          vocabulary_item_id,
          mastery_level,
          total_encounters,
          correct_encounters,
          max_gem_rarity,
          centralized_vocabulary!vocabulary_gem_collection_vocabulary_item_id_fkey(
            id, word, translation, language, category, subcategory,
            part_of_speech, audio_url, example_sentence
          )
        `)
        .eq('student_id', studentId)
        .not('vocabulary_item_id', 'in', `(${excludeIds.join(',')})`)
        .limit(limit * 2); // Get more to randomize
      
      query = this.applyFilters(query, filters);
      
      const { data, error } = await query;
      if (error) throw error;
      
      const shuffled = this.shuffleArray(data || []);
      return shuffled.slice(0, limit).map(item => this.mapToSelectedWord(item, 'random_practice'));
    } catch (error) {
      console.error('Error fetching random practice words:', error);
      return [];
    }
  }
  
  /**
   * Handle assignment word selection (teacher-specified vocabulary)
   */
  private async selectAssignmentWords(
    studentId: string,
    filters: WordSelectionFilters,
    limit: number
  ): Promise<SelectedWord[]> {
    // For assignments, we select from the teacher's specified vocabulary
    // but still get SRS data if available to set max gem rarity
    try {
      let query = this.supabase
        .from('centralized_vocabulary')
        .select(`
          *,
          vocabulary_gem_collection!left(
            mastery_level,
            total_encounters,
            correct_encounters,
            max_gem_rarity
          )
        `)
        .limit(limit);

      // Apply assignment-specific filters
      if (filters.language) query = query.eq('language', filters.language);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.subcategory) query = query.eq('subcategory', filters.subcategory);
      if (filters.curriculumLevel) query = query.eq('curriculum_level', filters.curriculumLevel);
      if (filters.examBoard) query = query.eq('exam_board', filters.examBoard);
      if (filters.tier) query = query.eq('tier', filters.tier);

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        language: item.language,
        category: item.category,
        subcategory: item.subcategory,
        partOfSpeech: item.part_of_speech,
        audioUrl: item.audio_url,
        exampleSentence: item.example_sentence,
        masteryLevel: item.vocabulary_gem_collection?.[0]?.mastery_level || 0,
        totalEncounters: item.vocabulary_gem_collection?.[0]?.total_encounters || 0,
        correctEncounters: item.vocabulary_gem_collection?.[0]?.correct_encounters || 0,
        selectionReason: 'assignment' as any,
        maxGemRarity: item.vocabulary_gem_collection?.[0]?.max_gem_rarity || 'legendary' // Assignments allow full rarity range
      }));
    } catch (error) {
      console.error('Error fetching assignment words:', error);
      return [];
    }
  }

  /**
   * Select words for assessment mode (no gems awarded during play)
   */
  async selectAssessmentWords(
    studentId: string,
    filters: WordSelectionFilters,
    limit: number
  ): Promise<SelectedWord[]> {
    // Assessments use a balanced mix regardless of SRS status
    // to ensure fair evaluation across all vocabulary
    try {
      let query = this.supabase
        .from('centralized_vocabulary')
        .select(`
          *,
          vocabulary_gem_collection!left(
            mastery_level,
            total_encounters,
            correct_encounters
          )
        `)
        .limit(limit * 2); // Get more to randomize

      // Apply assessment filters
      if (filters.language) query = query.eq('language', filters.language);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.subcategory) query = query.eq('subcategory', filters.subcategory);
      if (filters.curriculumLevel) query = query.eq('curriculum_level', filters.curriculumLevel);
      if (filters.examBoard) query = query.eq('exam_board', filters.examBoard);
      if (filters.tier) query = query.eq('tier', filters.tier);

      const { data, error } = await query;
      if (error) throw error;

      // Randomize and limit
      const shuffled = this.shuffleArray(data || []);

      return shuffled.slice(0, limit).map(item => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        language: item.language,
        category: item.category,
        subcategory: item.subcategory,
        partOfSpeech: item.part_of_speech,
        audioUrl: item.audio_url,
        exampleSentence: item.example_sentence,
        masteryLevel: item.vocabulary_gem_collection?.[0]?.mastery_level || 0,
        totalEncounters: item.vocabulary_gem_collection?.[0]?.total_encounters || 0,
        correctEncounters: item.vocabulary_gem_collection?.[0]?.correct_encounters || 0,
        selectionReason: 'assessment' as any,
        maxGemRarity: 'common' // Assessments don't award gems during play
      }));
    } catch (error) {
      console.error('Error fetching assessment words:', error);
      return [];
    }
  }
  
  /**
   * Apply common filters to queries
   */
  private applyFilters(query: any, filters: WordSelectionFilters): any {
    if (filters.language) {
      query = query.eq('centralized_vocabulary.language', filters.language);
    }
    if (filters.category) {
      query = query.eq('centralized_vocabulary.category', filters.category);
    }
    if (filters.subcategory) {
      query = query.eq('centralized_vocabulary.subcategory', filters.subcategory);
    }
    if (filters.curriculumLevel) {
      query = query.eq('centralized_vocabulary.curriculum_level', filters.curriculumLevel);
    }
    if (filters.excludeWordIds && filters.excludeWordIds.length > 0) {
      query = query.not('vocabulary_item_id', 'in', `(${filters.excludeWordIds.join(',')})`);
    }
    
    return query;
  }
  
  /**
   * Map database result to SelectedWord interface
   */
  private mapToSelectedWord(item: any, reason: SelectedWord['selectionReason']): SelectedWord {
    const vocab = item.centralized_vocabulary;
    return {
      id: vocab.id,
      word: vocab.word,
      translation: vocab.translation,
      language: vocab.language,
      category: vocab.category,
      subcategory: vocab.subcategory,
      partOfSpeech: vocab.part_of_speech,
      audioUrl: vocab.audio_url,
      exampleSentence: vocab.example_sentence,
      masteryLevel: item.mastery_level || 0,
      nextReviewAt: item.next_review_at,
      fsrsDifficulty: item.fsrs_difficulty,
      fsrsStability: item.fsrs_stability,
      fsrsRetrievability: item.fsrs_retrievability,
      totalEncounters: item.total_encounters || 0,
      correctEncounters: item.correct_encounters || 0,
      selectionReason: reason,
      maxGemRarity: item.max_gem_rarity || 'rare'
    };
  }
  
  /**
   * Shuffle array utility
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
