// Vocabulary Mining Service
// Service layer for managing vocabulary mining operations

import { SupabaseClient } from '@supabase/supabase-js';
import {
  VocabularyGem,
  GemCollection,
  MiningSession,
  TopicPerformance,
  VocabularyAchievement,
  DailyGoal,
  ClassAnalytics,
  SessionType,
  GemType,
  MasteryLevel
} from '../types/vocabulary-mining';
import {
  calculateGemRarity,
  calculatePointsEarned,
  calculateNextReviewInterval,
  determinePerformanceQuality,
  calculateMasteryLevel,
  shouldUpgradeGem,
  checkForAchievements
} from '../utils/vocabulary-mining';

export class VocabularyMiningService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get student's gem collection
   */
  async getGemCollection(studentId: string): Promise<GemCollection[]> {
    // Get all vocabulary gem collection records for the student
    const { data: gemData, error: gemError } = await this.supabase
      .from('vocabulary_gem_collection')
      .select('*')
      .eq('student_id', studentId)
      .order('last_encountered_at', { ascending: false });

    if (gemError) throw gemError;
    if (!gemData || gemData.length === 0) return [];

    // Get vocabulary details for all records using both ID systems
    const vocabularyIds = gemData
      .map(item => item.vocabulary_item_id || item.centralized_vocabulary_id)
      .filter(Boolean);

    if (vocabularyIds.length === 0) return [];

    // Try to get vocabulary from centralized_vocabulary first
    const { data: centralizedVocab, error: centralizedError } = await this.supabase
      .from('centralized_vocabulary')
      .select('id, word as term, translation, category as gem_type, subcategory as gem_color, audio_url, example_sentence, example_translation')
      .in('id', vocabularyIds);

    // If centralized vocabulary fails, try legacy vocabulary_items table
    let vocabularyData = centralizedVocab;
    if (centralizedError || !centralizedVocab || centralizedVocab.length === 0) {
      const { data: legacyVocab, error: legacyError } = await this.supabase
        .from('vocabulary_items')
        .select('id, term, translation, gem_type, gem_color, frequency_score, curriculum_tags, topic_tags, theme_tags, image_url, audio_url, example_sentence, example_translation, notes')
        .in('id', vocabularyIds);

      if (legacyError) throw legacyError;
      vocabularyData = legacyVocab;
    }

    // Create a map for quick vocabulary lookup
    const vocabularyMap = new Map(
      vocabularyData?.map(vocab => [vocab.id, vocab]) || []
    );

    // Combine gem data with vocabulary details
    const data = gemData
      .map(gem => {
        const vocabularyId = gem.vocabulary_item_id || gem.centralized_vocabulary_id;
        const vocabulary = vocabularyMap.get(vocabularyId);

        if (!vocabulary) return null;

        return {
          ...gem,
          vocabulary_items: vocabulary
        };
      })
      .filter(Boolean);
    
    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      vocabularyItemId: item.vocabulary_item_id,
      gemLevel: item.gem_level,
      masteryLevel: item.mastery_level,
      totalEncounters: item.total_encounters,
      correctEncounters: item.correct_encounters,
      incorrectEncounters: item.incorrect_encounters,
      currentStreak: item.current_streak,
      bestStreak: item.best_streak,
      lastEncounteredAt: item.last_encountered_at ? new Date(item.last_encountered_at) : undefined,
      nextReviewAt: item.next_review_at ? new Date(item.next_review_at) : undefined,
      spacedRepetitionInterval: item.spaced_repetition_interval,
      spacedRepetitionEaseFactor: item.spaced_repetition_ease_factor,
      difficultyRating: item.difficulty_rating,
      firstLearnedAt: new Date(item.first_learned_at),
      lastMasteredAt: item.last_mastered_at ? new Date(item.last_mastered_at) : undefined,
      notes: item.notes
    })) || [];
  }

  /**
   * Get vocabulary gems for practice
   */
  async getVocabularyGems(
    filters?: {
      listId?: string;
      theme?: string;
      topic?: string;
      gemType?: GemType;
      limit?: number;
    }
  ): Promise<VocabularyGem[]> {
    let query = this.supabase
      .from('vocabulary_items')
      .select('*');

    if (filters?.listId) {
      query = query.eq('list_id', filters.listId);
    }
    if (filters?.theme) {
      query = query.contains('theme_tags', [filters.theme]);
    }
    if (filters?.topic) {
      query = query.contains('topic_tags', [filters.topic]);
    }
    if (filters?.gemType) {
      query = query.eq('gem_type', filters.gemType);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      term: item.term,
      translation: item.translation,
      gemType: item.gem_type,
      gemColor: item.gem_color,
      frequencyScore: item.frequency_score,
      curriculumTags: item.curriculum_tags || [],
      topicTags: item.topic_tags || [],
      themeTags: item.theme_tags || [],
      imageUrl: item.image_url,
      audioUrl: item.audio_url,
      exampleSentence: item.example_sentence,
      exampleTranslation: item.example_translation,
      notes: item.notes
    })) || [];
  }

  /**
   * Start a new mining session
   */
  async startMiningSession(
    studentId: string,
    sessionType: SessionType,
    vocabularyListId?: string,
    assignmentId?: string
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from('vocabulary_mining_sessions')
      .insert({
        student_id: studentId,
        session_type: sessionType,
        vocabulary_list_id: vocabularyListId,
        assignment_id: assignmentId,
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * Record vocabulary practice result
   */
  async recordPracticeResult(
    sessionId: string,
    studentId: string,
    vocabularyItemId: string,
    wasCorrect: boolean,
    responseTime?: number,
    hintsUsed?: number
  ): Promise<void> {
    // Determine performance quality
    const performanceQuality = determinePerformanceQuality(wasCorrect, responseTime, hintsUsed);

    // Update gem collection using the race-condition-safe database function
    const { error: updateError } = await this.supabase.rpc('update_vocabulary_gem_collection_atomic', {
      p_student_id: studentId,
      p_vocabulary_item_id: vocabularyItemId,
      p_was_correct: wasCorrect,
      p_response_time_ms: responseTime
    });

    if (updateError) throw updateError;

    // Update session statistics using RPC function
    const { error: sessionError } = await this.supabase.rpc('increment_session_stats', {
      session_id: sessionId,
      was_correct: wasCorrect
    });

    if (sessionError) {
      console.warn('Failed to update session stats via RPC, falling back to manual update');
      // Get current session data first
      const { data: currentSession } = await this.supabase
        .from('vocabulary_mining_sessions')
        .select('total_words_attempted, total_words_correct')
        .eq('id', sessionId)
        .single();
      
      if (currentSession) {
        await this.supabase
          .from('vocabulary_mining_sessions')
          .update({
            total_words_attempted: (currentSession.total_words_attempted || 0) + 1,
            total_words_correct: (currentSession.total_words_correct || 0) + (wasCorrect ? 1 : 0),
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionId);
      }
    }
  }

  /**
   * End mining session and calculate final statistics
   */
  async endMiningSession(sessionId: string): Promise<MiningSession> {
    // Get session data
    const { data: sessionData, error: sessionError } = await this.supabase
      .from('vocabulary_mining_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    // Calculate final statistics
    const accuracyPercentage = sessionData.total_words_attempted > 0 
      ? Math.round((sessionData.total_words_correct / sessionData.total_words_attempted) * 100)
      : 0;

    const sessionScore = calculatePointsEarned(
      'common', // Base calculation, will be adjusted per gem
      sessionData.total_words_correct > 0,
      undefined,
      sessionData.total_words_correct
    );

    // Update session with final statistics
    const { error: updateError } = await this.supabase
      .from('vocabulary_mining_sessions')
      .update({
        ended_at: new Date().toISOString(),
        accuracy_percentage: accuracyPercentage,
        session_score: sessionScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) throw updateError;

    return {
      id: sessionData.id,
      studentId: sessionData.student_id,
      sessionType: sessionData.session_type,
      vocabularyListId: sessionData.vocabulary_list_id,
      assignmentId: sessionData.assignment_id,
      startedAt: new Date(sessionData.started_at),
      endedAt: new Date(),
      totalWordsAttempted: sessionData.total_words_attempted,
      totalWordsCorrect: sessionData.total_words_correct,
      gemsCollected: sessionData.gems_collected,
      gemsUpgraded: sessionData.gems_upgraded,
      sessionScore,
      accuracyPercentage,
      timeSpentSeconds: sessionData.time_spent_seconds,
      sessionData: sessionData.session_data || {}
    };
  }

  /**
   * Get items needing review for spaced repetition
   */
  async getItemsForReview(studentId: string, limit = 20): Promise<GemCollection[]> {
    // Get all vocabulary gem collection records needing review
    const { data: gemData, error: gemError } = await this.supabase
      .from('vocabulary_gem_collection')
      .select('*')
      .eq('student_id', studentId)
      .lte('next_review_at', new Date().toISOString())
      .order('next_review_at', { ascending: true })
      .limit(limit);

    if (gemError) throw gemError;
    if (!gemData || gemData.length === 0) return [];

    // Get vocabulary details for all records using both ID systems
    const vocabularyIds = gemData
      .map(item => item.vocabulary_item_id || item.centralized_vocabulary_id)
      .filter(Boolean);

    if (vocabularyIds.length === 0) return [];

    // Try to get vocabulary from centralized_vocabulary first
    const { data: centralizedVocab, error: centralizedError } = await this.supabase
      .from('centralized_vocabulary')
      .select('id, word as term, translation, category as gem_type, subcategory as gem_color, audio_url, example_sentence, example_translation')
      .in('id', vocabularyIds);

    // If centralized vocabulary fails, try legacy vocabulary_items table
    let vocabularyData = centralizedVocab;
    if (centralizedError || !centralizedVocab || centralizedVocab.length === 0) {
      const { data: legacyVocab, error: legacyError } = await this.supabase
        .from('vocabulary_items')
        .select('id, term, translation, gem_type, gem_color, image_url, audio_url, example_sentence, example_translation')
        .in('id', vocabularyIds);

      if (legacyError) throw legacyError;
      vocabularyData = legacyVocab;
    }

    // Create a map for quick vocabulary lookup
    const vocabularyMap = new Map(
      vocabularyData?.map(vocab => [vocab.id, vocab]) || []
    );

    // Combine gem data with vocabulary details
    const data = gemData
      .map(gem => {
        const vocabularyId = gem.vocabulary_item_id || gem.centralized_vocabulary_id;
        const vocabulary = vocabularyMap.get(vocabularyId);

        if (!vocabulary) return null;

        return {
          ...gem,
          vocabulary_items: vocabulary
        };
      })
      .filter(Boolean);
    
    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      vocabularyItemId: item.vocabulary_item_id,
      gemLevel: item.gem_level,
      masteryLevel: item.mastery_level,
      totalEncounters: item.total_encounters,
      correctEncounters: item.correct_encounters,
      incorrectEncounters: item.incorrect_encounters,
      currentStreak: item.current_streak,
      bestStreak: item.best_streak,
      lastEncounteredAt: item.last_encountered_at ? new Date(item.last_encountered_at) : undefined,
      nextReviewAt: item.next_review_at ? new Date(item.next_review_at) : undefined,
      spacedRepetitionInterval: item.spaced_repetition_interval,
      spacedRepetitionEaseFactor: item.spaced_repetition_ease_factor,
      difficultyRating: item.difficulty_rating,
      firstLearnedAt: new Date(item.first_learned_at),
      lastMasteredAt: item.last_mastered_at ? new Date(item.last_mastered_at) : undefined,
      notes: item.notes
    })) || [];
  }

  /**
   * Get student's daily goal
   */
  async getDailyGoal(studentId: string, date?: Date): Promise<DailyGoal | null> {
    const targetDate = date || new Date();
    const dateString = targetDate.toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('vocabulary_daily_goals')
      .select('*')
      .eq('student_id', studentId)
      .eq('goal_date', dateString)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    
    if (!data) return null;

    return {
      id: data.id,
      studentId: data.student_id,
      goalDate: new Date(data.goal_date),
      targetWords: data.target_words,
      targetMinutes: data.target_minutes,
      wordsPracticed: data.words_practiced,
      minutesPracticed: data.minutes_practiced,
      gemsCollected: data.gems_collected,
      goalCompleted: data.goal_completed,
      streakCount: data.streak_count
    };
  }

  /**
   * Update daily goal progress
   */
  async updateDailyGoal(
    studentId: string,
    wordsPracticed: number,
    minutesPracticed: number,
    gemsCollected: number,
    date?: Date
  ): Promise<void> {
    const targetDate = date || new Date();
    const dateString = targetDate.toISOString().split('T')[0];

    const { error } = await this.supabase
      .from('vocabulary_daily_goals')
      .upsert({
        student_id: studentId,
        goal_date: dateString,
        words_practiced: wordsPracticed,
        minutes_practiced: minutesPracticed,
        gems_collected: gemsCollected,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'student_id,goal_date'
      });

    if (error) throw error;
  }

  /**
   * Get topic performance analytics for a student
   */
  async getTopicPerformance(studentId: string): Promise<TopicPerformance[]> {
    const { data, error } = await this.supabase
      .from('vocabulary_topic_performance')
      .select('*')
      .eq('student_id', studentId)
      .order('mastery_percentage', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      topicName: item.topic_name,
      themeName: item.theme_name,
      totalWords: item.total_words,
      masteredWords: item.mastered_words,
      weakWords: item.weak_words,
      averageAccuracy: item.average_accuracy,
      totalPracticeTime: item.total_practice_time,
      lastPracticedAt: item.last_practiced_at ? new Date(item.last_practiced_at) : undefined,
      masteryPercentage: item.mastery_percentage
    })) || [];
  }

  /**
   * Update topic performance based on practice session
   */
  async updateTopicPerformance(
    studentId: string,
    topicName: string,
    themeName: string,
    wordsAttempted: number,
    wordsCorrect: number,
    timeSpent: number
  ): Promise<void> {
    // Get current topic performance or create new record
    const { data: existing } = await this.supabase
      .from('vocabulary_topic_performance')
      .select('*')
      .eq('student_id', studentId)
      .eq('topic_name', topicName)
      .eq('theme_name', themeName)
      .single();

    if (existing) {
      // Update existing record
      const newTotalWords = existing.total_words + wordsAttempted;
      const newMasteredWords = existing.mastered_words + wordsCorrect;
      const newTotalTime = existing.total_practice_time + timeSpent;
      const newAccuracy = newTotalWords > 0 ? (newMasteredWords / newTotalWords) * 100 : 0;
      const newMasteryPercentage = newTotalWords > 0 ? (newMasteredWords / newTotalWords) * 100 : 0;

      const { error } = await this.supabase
        .from('vocabulary_topic_performance')
        .update({
          total_words: newTotalWords,
          mastered_words: newMasteredWords,
          weak_words: newTotalWords - newMasteredWords,
          average_accuracy: newAccuracy,
          total_practice_time: newTotalTime,
          last_practiced_at: new Date().toISOString(),
          mastery_percentage: newMasteryPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new record
      const accuracy = wordsAttempted > 0 ? (wordsCorrect / wordsAttempted) * 100 : 0;
      const masteryPercentage = wordsAttempted > 0 ? (wordsCorrect / wordsAttempted) * 100 : 0;

      const { error } = await this.supabase
        .from('vocabulary_topic_performance')
        .insert({
          student_id: studentId,
          topic_name: topicName,
          theme_name: themeName,
          total_words: wordsAttempted,
          mastered_words: wordsCorrect,
          weak_words: wordsAttempted - wordsCorrect,
          average_accuracy: accuracy,
          total_practice_time: timeSpent,
          last_practiced_at: new Date().toISOString(),
          mastery_percentage: masteryPercentage
        });

      if (error) throw error;
    }
  }

  /**
   * Get student's achievements
   */
  async getAchievements(studentId: string): Promise<VocabularyAchievement[]> {
    const { data, error } = await this.supabase
      .from('vocabulary_achievements')
      .select('*')
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      achievementType: item.achievement_type,
      achievementName: item.achievement_name,
      achievementDescription: item.achievement_description,
      achievementIcon: item.achievement_icon,
      achievementColor: item.achievement_color,
      pointsAwarded: item.points_awarded,
      earnedAt: new Date(item.earned_at),
      metadata: item.metadata || {}
    })) || [];
  }

  /**
   * Award achievement to student
   */
  async awardAchievement(
    studentId: string,
    achievementType: string,
    achievementName: string,
    achievementDescription?: string,
    achievementIcon?: string,
    achievementColor = '#fbbf24',
    pointsAwarded = 0,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await this.supabase
      .from('vocabulary_achievements')
      .insert({
        student_id: studentId,
        achievement_type: achievementType,
        achievement_name: achievementName,
        achievement_description: achievementDescription,
        achievement_icon: achievementIcon,
        achievement_color: achievementColor,
        points_awarded: pointsAwarded,
        metadata,
        earned_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  /**
   * Get comprehensive student progress summary
   */
  async getStudentProgressSummary(studentId: string): Promise<{
    totalGems: number;
    masteredGems: number;
    gemsNeedingReview: number;
    averageAccuracy: number;
    totalPracticeTime: number;
    currentStreak: number;
    topicPerformance: TopicPerformance[];
    recentAchievements: VocabularyAchievement[];
    dailyGoal: DailyGoal | null;
  }> {
    // Get gem collection
    const gemCollection = await this.getGemCollection(studentId);

    // Get topic performance
    const topicPerformance = await this.getTopicPerformance(studentId);

    // Get recent achievements (last 10)
    const { data: achievementsData } = await this.supabase
      .from('vocabulary_achievements')
      .select('*')
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false })
      .limit(10);

    const recentAchievements = achievementsData?.map(item => ({
      id: item.id,
      studentId: item.student_id,
      achievementType: item.achievement_type,
      achievementName: item.achievement_name,
      achievementDescription: item.achievement_description,
      achievementIcon: item.achievement_icon,
      achievementColor: item.achievement_color,
      pointsAwarded: item.points_awarded,
      earnedAt: new Date(item.earned_at),
      metadata: item.metadata || {}
    })) || [];

    // Get daily goal
    const dailyGoal = await this.getDailyGoal(studentId);

    // Calculate summary statistics
    const totalGems = gemCollection.length;
    const masteredGems = gemCollection.filter(gem => gem.masteryLevel >= 4).length;
    const gemsNeedingReview = gemCollection.filter(gem =>
      gem.nextReviewAt && gem.nextReviewAt <= new Date()
    ).length;

    const totalCorrect = gemCollection.reduce((sum, gem) => sum + gem.correctEncounters, 0);
    const totalAttempts = gemCollection.reduce((sum, gem) => sum + gem.totalEncounters, 0);
    const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    const totalPracticeTime = topicPerformance.reduce((sum, topic) => sum + topic.totalPracticeTime, 0);
    const currentStreak = Math.max(...gemCollection.map(gem => gem.currentStreak), 0);

    return {
      totalGems,
      masteredGems,
      gemsNeedingReview,
      averageAccuracy,
      totalPracticeTime,
      currentStreak,
      topicPerformance,
      recentAchievements,
      dailyGoal
    };
  }

  /**
   * Get student's gem collection from vocabulary practice (fallback for old vocabulary table)
   */
  async getVocabularyPracticeGems(studentId: string): Promise<GemCollection[]> {
    const { data, error } = await this.supabase
      .from('student_vocabulary_practice')
      .select('*')
      .eq('student_id', studentId)
      .order('last_practiced_at', { ascending: false });

    if (error) throw error;
    
    return data?.map(item => ({
      id: `practice-${item.id}`,
      studentId: item.student_id,
      vocabularyItemId: item.vocabulary_id,
      gemLevel: item.gem_level || 1,
      masteryLevel: item.mastery_level || 1,
      totalEncounters: item.total_attempts || 0,
      correctEncounters: item.correct_attempts || 0,
      incorrectEncounters: (item.total_attempts || 0) - (item.correct_attempts || 0),
      currentStreak: item.current_streak || 0,
      bestStreak: item.best_streak || 0,
      lastEncounteredAt: item.last_practiced_at ? new Date(item.last_practiced_at) : undefined,
      nextReviewAt: undefined, // Not implemented for practice tracking
      spacedRepetitionInterval: 0,
      spacedRepetitionEaseFactor: 2.5,
      difficultyRating: (item.correct_attempts || 0) / Math.max(item.total_attempts || 1, 1) > 0.8 ? 1 : 
                       (item.correct_attempts || 0) / Math.max(item.total_attempts || 1, 1) > 0.5 ? 2 : 3,
      firstLearnedAt: new Date(item.first_practiced_at),
      lastMasteredAt: (item.mastery_level || 0) >= 4 ? new Date(item.last_practiced_at) : undefined,
      notes: ''
    })) || [];
  }

  /**
   * Get combined gem collection from both sources
   */
  async getCombinedGemCollection(studentId: string): Promise<GemCollection[]> {
    try {
      // Try to get gems from the main collection first
      const mainGems = await this.getGemCollection(studentId);
      
      // Also get gems from vocabulary practice
      const practiceGems = await this.getVocabularyPracticeGems(studentId);
      
      // Combine and return
      return [...mainGems, ...practiceGems];
    } catch (error) {
      console.warn('Error getting main gem collection, falling back to practice only:', error);
      // If main collection fails, just return practice gems
      return await this.getVocabularyPracticeGems(studentId);
    }
  }

  /**
   * Get combined student progress summary from both sources
   */
  async getCombinedProgressSummary(studentId: string) {
    try {
      // Try main progress summary first
      const mainSummary = await this.getStudentProgressSummary(studentId);
      
      // Get additional stats from vocabulary practice
      const { data: practiceStats, error: practiceError } = await this.supabase
        .from('student_vocabulary_practice')
        .select('*')
        .eq('student_id', studentId);
      
      if (!practiceError && practiceStats) {
        const practiceGems = practiceStats.length;
        const practiceMastered = practiceStats.filter(p => (p.mastery_level || 0) >= 4).length;
        const practiceStreak = Math.max(...practiceStats.map(p => p.current_streak || 0), 0);
        
        return {
          ...mainSummary,
          totalGems: mainSummary.totalGems + practiceGems,
          masteredGems: mainSummary.masteredGems + practiceMastered,
          currentStreak: Math.max(mainSummary.currentStreak, practiceStreak),
          totalPracticeTime: mainSummary.totalPracticeTime
        };
      }
      
      return mainSummary;
    } catch (error) {
      console.warn('Error getting combined progress summary:', error);
      // Fall back to just practice stats
      const { data: practiceStats } = await this.supabase
        .from('student_vocabulary_practice')
        .select('*')
        .eq('student_id', studentId);
      
      if (practiceStats) {
        const practiceGems = practiceStats.length;
        const practiceMastered = practiceStats.filter(p => (p.mastery_level || 0) >= 4).length;
        const averageAccuracy = practiceStats.length > 0 
          ? practiceStats.reduce((sum, p) => sum + ((p.correct_attempts || 0) / Math.max(p.total_attempts || 1, 1)), 0) / practiceStats.length * 100
          : 0;
        
        return {
          totalGems: practiceGems,
          masteredGems: practiceMastered,
          gemsNeedingReview: 0,
          averageAccuracy,
          totalPracticeTime: 0,
          currentStreak: Math.max(...practiceStats.map(p => p.current_streak || 0), 0),
          topicPerformance: [],
          recentAchievements: [],
          dailyGoal: null
        };
      }
      
      // Ultimate fallback
      return {
        totalGems: 0,
        masteredGems: 0,
        gemsNeedingReview: 0,
        averageAccuracy: 0,
        totalPracticeTime: 0,
        currentStreak: 0,
        topicPerformance: [],
        recentAchievements: [],
        dailyGoal: null
      };
    }
  }
}
