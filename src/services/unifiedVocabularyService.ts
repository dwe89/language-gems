import { SupabaseClient } from '@supabase/supabase-js';

export interface VocabularyStats {
  totalWords: number;
  masteredWords: number;    // mastery_level >= 4
  strugglingWords: number;  // accuracy < 70% and attempts > 0
  overdueWords: number;     // past next_review_at date
  averageAccuracy: number;
  memoryStrength: number;   // average retrievability
  wordsReadyForReview: number; // due today
}

export interface VocabularyItem {
  id: string;
  vocabularyItemId: string;
  word: string;
  translation: string;
  category: string;
  subcategory: string;
  curriculumLevel: string;
  language: string;
  masteryLevel: number;
  totalEncounters: number;
  correctEncounters: number;
  accuracy: number;
  lastEncountered: string | null;
  nextReview: string | null;
  fsrsDifficulty: number | null;
  fsrsStability: number | null;
  fsrsRetrievability: number | null;
  isOverdue: boolean;
  isDueToday: boolean;
  isMastered: boolean;
  isStruggling: boolean;
}

export class UnifiedVocabularyService {
  constructor(private supabase: SupabaseClient) {}

  async getVocabularyData(studentId: string): Promise<{
    items: VocabularyItem[];
    stats: VocabularyStats;
  }> {
    const { data: rawData, error } = await this.supabase
      .from('vocabulary_gem_collection')
      .select(`
        id,
        vocabulary_item_id,
        total_encounters,
        correct_encounters,
        mastery_level,
        last_encountered_at,
        next_review_at,
        fsrs_difficulty,
        fsrs_stability,
        fsrs_retrievability,
        centralized_vocabulary!vocabulary_gem_collection_vocabulary_item_id_fkey(
          id,
          word,
          translation,
          category,
          subcategory,
          curriculum_level,
          language
        )
      `)
      .eq('student_id', studentId);

    if (error) {
      throw error;
    }

    const now = new Date();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Process items with consistent calculations
    const items: VocabularyItem[] = (rawData || []).map(item => {
      const accuracy = item.total_encounters > 0 
        ? Math.round((item.correct_encounters / item.total_encounters) * 100)
        : 0;
      
      const nextReview = item.next_review_at ? new Date(item.next_review_at) : null;
      const isOverdue = nextReview ? nextReview < now : false;
      const isDueToday = nextReview ? nextReview <= today && nextReview >= now : false;
      const isMastered = (item.mastery_level || 0) >= 4;
      const isStruggling = accuracy < 70 && item.total_encounters > 0;

      return {
        id: item.id,
        vocabularyItemId: item.vocabulary_item_id,
        word: item.centralized_vocabulary.word,
        translation: item.centralized_vocabulary.translation,
        category: item.centralized_vocabulary.category,
        subcategory: item.centralized_vocabulary.subcategory,
        curriculumLevel: item.centralized_vocabulary.curriculum_level,
        language: item.centralized_vocabulary.language,
        masteryLevel: item.mastery_level || 0,
        totalEncounters: item.total_encounters || 0,
        correctEncounters: item.correct_encounters || 0,
        accuracy,
        lastEncountered: item.last_encountered_at,
        nextReview: item.next_review_at,
        fsrsDifficulty: item.fsrs_difficulty,
        fsrsStability: item.fsrs_stability,
        fsrsRetrievability: item.fsrs_retrievability,
        isOverdue,
        isDueToday,
        isMastered,
        isStruggling
      };
    });

    // Calculate consistent stats
    const totalWords = items.length;
    const masteredWords = items.filter(item => item.isMastered).length;
    const strugglingWords = items.filter(item => item.isStruggling).length;
    const overdueWords = items.filter(item => item.isOverdue).length;
    const wordsReadyForReview = items.filter(item => item.isDueToday).length;
    
    const totalAttempts = items.reduce((sum, item) => sum + item.totalEncounters, 0);
    const totalCorrect = items.reduce((sum, item) => sum + item.correctEncounters, 0);
    const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    
    const retrievabilityValues = items
      .map(item => item.fsrsRetrievability)
      .filter(val => val !== null) as number[];
    const memoryStrength = retrievabilityValues.length > 0
      ? Math.round(retrievabilityValues.reduce((sum, val) => sum + val, 0) / retrievabilityValues.length * 100)
      : 0;

    const stats: VocabularyStats = {
      totalWords,
      masteredWords,
      strugglingWords,
      overdueWords,
      averageAccuracy,
      memoryStrength,
      wordsReadyForReview
    };

    return { items, stats };
  }

  async getWeakWords(studentId: string, limit: number = 15): Promise<VocabularyItem[]> {
    const { items } = await this.getVocabularyData(studentId);
    
    return items
      .filter(item => item.isStruggling)
      .sort((a, b) => a.accuracy - b.accuracy) // Worst accuracy first
      .slice(0, limit);
  }

  async getStrongWords(studentId: string, limit: number = 15): Promise<VocabularyItem[]> {
    const { items } = await this.getVocabularyData(studentId);
    
    return items
      .filter(item => item.isMastered)
      .sort((a, b) => b.accuracy - a.accuracy) // Best accuracy first
      .slice(0, limit);
  }

  async getOverdueWords(studentId: string): Promise<VocabularyItem[]> {
    const { items } = await this.getVocabularyData(studentId);
    
    return items
      .filter(item => item.isOverdue)
      .sort((a, b) => {
        const aDate = new Date(a.nextReview || 0);
        const bDate = new Date(b.nextReview || 0);
        return aDate.getTime() - bDate.getTime(); // Most overdue first
      });
  }

  async getWordsForReview(studentId: string): Promise<VocabularyItem[]> {
    const { items } = await this.getVocabularyData(studentId);
    
    return items
      .filter(item => item.isDueToday || item.isOverdue)
      .sort((a, b) => {
        // Overdue first, then by review date
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        
        const aDate = new Date(a.nextReview || 0);
        const bDate = new Date(b.nextReview || 0);
        return aDate.getTime() - bDate.getTime();
      });
  }
}
