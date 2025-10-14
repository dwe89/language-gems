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
  vocabularyItemId: string | null; // Can be null for centralized vocabulary
  actualVocabularyId: string; // The actual vocabulary ID to use for queries
  word: string;
  translation: string;
  category: string;
  subcategory: string;
  curriculumLevel: string;
  language: string;
  themeName: string | null;
  unitName: string | null;
  examBoardCode: string | null;
  tier: string | null;
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
    console.time('⏱️ [VOCAB] getVocabularyData');
    console.log('🔍 [UNIFIED VOCAB] Getting vocabulary data for student:', studentId);

    // 🚀 OPTIMIZATION: Limit query to reduce load time
    const { data: gemData, error: gemError } = await this.supabase
      .from('vocabulary_gem_collection')
      .select(`
        id,
        vocabulary_item_id,
        centralized_vocabulary_id,
        total_encounters,
        correct_encounters,
        mastery_level,
        last_encountered_at,
        next_review_at,
        fsrs_difficulty,
        fsrs_stability,
        fsrs_retrievability
      `)
      .eq('student_id', studentId)
      .limit(300); // Limit for dashboard performance

    console.log('🔍 [UNIFIED VOCAB] Gem data query result:', {
      gemDataLength: gemData?.length || 0,
      error: gemError?.message,
      sampleGemData: gemData?.slice(0, 2)
    });

    if (gemError) {
      throw gemError;
    }

    if (!gemData || gemData.length === 0) {
      return {
        items: [],
        stats: {
          totalWords: 0,
          masteredWords: 0,
          strugglingWords: 0,
          overdueWords: 0,
          averageAccuracy: 0,
          memoryStrength: 0,
          wordsReadyForReview: 0
        }
      };
    }

    // Get vocabulary details for all records using both ID systems
    const centralizedIds = gemData
      .map(item => item.centralized_vocabulary_id)
      .filter(Boolean);

    const enhancedIds = gemData
      .map(item => item.vocabulary_item_id)
      .filter(Boolean);

    // Query centralized vocabulary
    let centralizedVocabularyData = [];
    if (centralizedIds.length > 0) {
      const { data, error } = await this.supabase
        .from('centralized_vocabulary')
        .select('id, word, translation, category, subcategory, curriculum_level, language, theme_name, unit_name, exam_board_code, tier')
        .in('id', centralizedIds);

      if (error) throw error;
      centralizedVocabularyData = data || [];
    }

    // Query enhanced vocabulary items
    let enhancedVocabularyData = [];
    if (enhancedIds.length > 0) {
      const { data, error } = await this.supabase
        .from('enhanced_vocabulary_items')
        .select(`
          id,
          term,
          translation,
          difficulty_level,
          enhanced_vocabulary_lists!inner(language)
        `)
        .in('id', enhancedIds);

      if (error) throw error;

      // Transform enhanced vocabulary data to match centralized format
      enhancedVocabularyData = (data || []).map(item => ({
        id: item.id,
        word: item.term,
        translation: item.translation,
        category: item.difficulty_level || 'enhanced',
        subcategory: 'enhanced',
        curriculum_level: 'intermediate',
        language: item.enhanced_vocabulary_lists?.language || 'spanish'
      }));
    }

    // Combine both vocabulary sources
    const allVocabularyData = [...centralizedVocabularyData, ...enhancedVocabularyData];

    console.log('🔍 [UNIFIED VOCAB] Vocabulary data fetched:', {
      centralizedCount: centralizedVocabularyData.length,
      enhancedCount: enhancedVocabularyData.length,
      totalCount: allVocabularyData.length,
      sampleCentralized: centralizedVocabularyData.slice(0, 2),
      sampleEnhanced: enhancedVocabularyData.slice(0, 2)
    });

    // Create a map for quick vocabulary lookup
    const vocabularyMap = new Map(
      allVocabularyData.map(vocab => [vocab.id, vocab])
    );

    // Combine gem data with vocabulary details
    const rawData = gemData
      .map(gem => {
        const vocabularyId = gem.vocabulary_item_id || gem.centralized_vocabulary_id;
        const vocabulary = vocabularyMap.get(vocabularyId);

        if (!vocabulary) return null;

        return {
          ...gem,
          centralized_vocabulary: vocabulary
        };
      })
      .filter(Boolean);

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
      // Improved struggling logic: only struggling if they've had multiple attempts and low accuracy
      const isStruggling = accuracy < 70 && item.total_encounters >= 3;

      return {
        id: item.id,
        vocabularyItemId: item.vocabulary_item_id || item.centralized_vocabulary_id, // Use either ID system
        actualVocabularyId: item.vocabulary_item_id || item.centralized_vocabulary_id, // The actual vocabulary ID for queries
        word: item.centralized_vocabulary.word,
        translation: item.centralized_vocabulary.translation,
        category: item.centralized_vocabulary.category,
        subcategory: item.centralized_vocabulary.subcategory,
        curriculumLevel: item.centralized_vocabulary.curriculum_level,
        language: item.centralized_vocabulary.language,
        themeName: item.centralized_vocabulary.theme_name,
        unitName: item.centralized_vocabulary.unit_name,
        examBoardCode: item.centralized_vocabulary.exam_board_code,
        tier: item.centralized_vocabulary.tier,
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

    console.timeEnd('⏱️ [VOCAB] getVocabularyData');
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
