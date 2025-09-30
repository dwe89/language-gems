// Unified Student Dashboard Service
// Combines word_performance_logs (granular) + vocabulary_gem_collection (FSRS) for comprehensive insights

import { SupabaseClient } from '@supabase/supabase-js';
import { GemRarity } from './rewards/RewardEngine';

export interface DashboardMetrics {
  // Overview Stats (from both systems)
  totalWordsTracked: number;           // From vocabulary_gem_collection
  totalAttempts: number;               // From word_performance_logs
  overallAccuracy: number;             // From word_performance_logs
  averageResponseTime: number;         // From word_performance_logs
  
  // FSRS Memory Insights (from vocabulary_gem_collection)
  memoryStrength: number;              // Average retrievability
  wordsReadyForReview: number;         // Due today
  overdueWords: number;                // Past due date
  masteredWords: number;               // High stability + retrievability
  strugglingWords: number;             // Low retrievability + high difficulty
  
  // Learning Progress (from word_performance_logs)
  recentAccuracyTrend: number[];       // Last 7 days
  responseTimeImprovement: number;     // Percentage improvement
  consistencyScore: number;            // How regularly they practice
  
  // Vocabulary Categories (combined data)
  categoryBreakdown: CategoryProgress[];
  
  // Recommendations (FSRS-powered)
  recommendedStudyTime: number;        // Minutes based on due words
  priorityWords: PriorityWord[];       // Top words to focus on
}

export interface CategoryProgress {
  category: string;
  curriculum_level: string;
  // From word_performance_logs
  totalAttempts: number;
  accuracy: number;
  averageResponseTime: number;
  // From vocabulary_gem_collection
  wordsTracked: number;
  averageMemoryStrength: number;
  wordsReadyForReview: number;
}

export interface PriorityWord {
  word: string;
  translation: string;
  category: string;
  // Why it's priority (from both systems)
  reason: 'overdue' | 'struggling' | 'inconsistent' | 'new_learning';
  // FSRS data
  memoryStrength: number;
  daysSinceReview: number;
  // Performance data
  recentAccuracy: number;
  averageResponseTime: number;
  lastAttempt: string;
}

export class UnifiedStudentDashboardService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Map mastery level to gem rarity
   */
  private static masteryLevelToGemRarity(masteryLevel: number): GemRarity {
    switch (masteryLevel) {
      case 0: return 'new_discovery';
      case 1: return 'common';
      case 2: return 'uncommon';
      case 3: return 'rare';
      case 4: return 'epic';
      case 5: return 'legendary';
      default: return 'new_discovery';
    }
  }

  /**
   * Get gem collection statistics by rarity
   */
  async getGemCollectionStats(studentId: string): Promise<Record<GemRarity, number>> {
    const { data: gemData, error } = await this.supabase
      .from('vocabulary_gem_collection')
      .select('mastery_level')
      .eq('student_id', studentId);

    if (error) throw error;

    const gemCounts: Record<GemRarity, number> = {
      new_discovery: 0,
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    if (gemData) {
      gemData.forEach(item => {
        const rarity = UnifiedStudentDashboardService.masteryLevelToGemRarity(item.mastery_level || 0);
        gemCounts[rarity]++;
      });
    }

    return gemCounts;
  }

  async getDashboardMetrics(studentId: string): Promise<DashboardMetrics> {
    console.time('⏱️ getDashboardMetrics');
    
    // 🚀 OPTIMIZATION: Get session IDs first, then run everything in parallel
    console.time('⏱️ get sessions');
    const { data: recentSessions, error: sessionError } = await this.supabase
      .from('enhanced_game_sessions')
      .select('id, started_at')
      .eq('student_id', studentId)
      .order('started_at', { ascending: false })
      .limit(50);
    console.timeEnd('⏱️ get sessions');

    if (sessionError) throw sessionError;

    const sessionIds = recentSessions?.map(s => s.id) || [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessionIds = recentSessions
      ?.filter(s => new Date(s.started_at) >= sevenDaysAgo)
      .map(s => s.id) || [];

    // Run all queries in parallel using the session IDs
    console.time('⏱️ parallel queries');
    const [
      performanceLogs,
      vocabularyGems,
      recentPerformance
    ] = await Promise.all([
      this.getPerformanceLogsForSessions(sessionIds),
      this.getVocabularyGems(studentId),
      this.getPerformanceLogsForSessions(recentSessionIds)
    ]);
    console.timeEnd('⏱️ parallel queries');

    console.timeEnd('⏱️ getDashboardMetrics');
    return this.combineMetrics(performanceLogs, vocabularyGems, recentPerformance);
  }

  private async getPerformanceLogsForSessions(sessionIds: string[]) {
    if (sessionIds.length === 0) return [];

    const { data, error } = await this.supabase
      .from('word_performance_logs')
      .select(`
        word_text,
        translation_text,
        was_correct,
        response_time_ms,
        timestamp,
        language,
        curriculum_level
      `)
      .in('session_id', sessionIds)
      .order('timestamp', { ascending: false })
      .limit(200);

    if (error) throw error;
    return data || [];
  }

  private async getPerformanceLogs(studentId: string) {
    // 🚀 DEPRECATED: Use getPerformanceLogsForSessions instead
    // Keeping for backward compatibility
    const { data: sessions, error: sessionError } = await this.supabase
      .from('enhanced_game_sessions')
      .select('id')
      .eq('student_id', studentId)
      .order('started_at', { ascending: false })
      .limit(50);

    if (sessionError) throw sessionError;
    if (!sessions || sessions.length === 0) return [];

    return this.getPerformanceLogsForSessions(sessions.map(s => s.id));
  }

  private async getVocabularyGems(studentId: string) {
    // Get all vocabulary gem collection records for the student
    const { data: gemData, error: gemError } = await this.supabase
      .from('vocabulary_gem_collection')
      .select(`
        vocabulary_item_id,
        centralized_vocabulary_id,
        total_encounters,
        correct_encounters,
        mastery_level,
        fsrs_difficulty,
        fsrs_stability,
        fsrs_retrievability,
        next_review_at,
        last_encountered_at
      `)
      .eq('student_id', studentId)
      .order('last_encountered_at', { ascending: false })
      .limit(200);

    if (gemError) throw gemError;
    if (!gemData || gemData.length === 0) return [];

    // Get vocabulary details for all records using both ID systems
    const vocabularyIds = gemData
      .map(item => item.vocabulary_item_id || item.centralized_vocabulary_id)
      .filter(Boolean);

    const { data: vocabularyData, error: vocabError } = await this.supabase
      .from('centralized_vocabulary')
      .select('id, word, translation, category, curriculum_level, language')
      .in('id', vocabularyIds);

    if (vocabError) throw vocabError;

    // Create a map for quick vocabulary lookup
    const vocabularyMap = new Map(
      vocabularyData?.map(vocab => [vocab.id, vocab]) || []
    );

    // Combine gem data with vocabulary details
    const combinedData = gemData
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

    return combinedData;
  }

  private async getRecentPerformance(studentId: string, days: number) {
    // 🚀 OPTIMIZATION: Use session IDs instead of expensive join
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: sessions, error: sessionError } = await this.supabase
      .from('enhanced_game_sessions')
      .select('id')
      .eq('student_id', studentId)
      .gte('started_at', startDate.toISOString());

    if (sessionError) throw sessionError;
    if (!sessions || sessions.length === 0) return [];

    const sessionIds = sessions.map(s => s.id);

    const { data, error } = await this.supabase
      .from('word_performance_logs')
      .select(`
        word_text,
        was_correct,
        response_time_ms,
        timestamp
      `)
      .in('session_id', sessionIds)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  private combineMetrics(
    performanceLogs: any[],
    vocabularyGems: any[],
    recentPerformance: any[]
  ): DashboardMetrics {
    const now = new Date();

    // Overview Stats
    const totalWordsTracked = vocabularyGems.length;
    const totalAttempts = performanceLogs.length;
    const correctAttempts = performanceLogs.filter(log => log.was_correct).length;
    const overallAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const averageResponseTime = totalAttempts > 0 
      ? performanceLogs.reduce((sum, log) => sum + log.response_time_ms, 0) / totalAttempts 
      : 0;

    // FSRS Memory Insights
    const validGems = vocabularyGems.filter(gem => gem.fsrs_retrievability !== null);
    const memoryStrength = validGems.length > 0
      ? (validGems.reduce((sum, gem) => sum + gem.fsrs_retrievability, 0) / validGems.length) * 100
      : 0;

    const wordsReadyForReview = vocabularyGems.filter(gem => {
      if (!gem.next_review_at) return false;
      return new Date(gem.next_review_at) <= now;
    }).length;

    const overdueWords = vocabularyGems.filter(gem => {
      if (!gem.next_review_at) return false;
      const reviewDate = new Date(gem.next_review_at);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return reviewDate < oneDayAgo;
    }).length;

    const masteredWords = vocabularyGems.filter(gem => 
      gem.fsrs_retrievability > 0.9 && gem.fsrs_stability > 30
    ).length;

    const strugglingWords = vocabularyGems.filter(gem => 
      gem.fsrs_retrievability < 0.6 || gem.fsrs_difficulty > 7
    ).length;

    // Recent Accuracy Trend (last 7 days)
    const recentAccuracyTrend = this.calculateDailyAccuracy(recentPerformance, 7);

    // Response Time Improvement
    const responseTimeImprovement = this.calculateResponseTimeImprovement(performanceLogs);

    // Consistency Score (how regularly they practice)
    const consistencyScore = this.calculateConsistencyScore(recentPerformance);

    // Category Breakdown
    const categoryBreakdown = this.calculateCategoryBreakdown(performanceLogs, vocabularyGems);

    // Priority Words
    const priorityWords = this.identifyPriorityWords(performanceLogs, vocabularyGems);

    // Recommended Study Time
    const recommendedStudyTime = Math.min(30, Math.max(5, wordsReadyForReview * 2)); // 2 min per word

    return {
      totalWordsTracked,
      totalAttempts,
      overallAccuracy: Math.round(overallAccuracy * 10) / 10,
      averageResponseTime: Math.round(averageResponseTime),
      memoryStrength: Math.round(memoryStrength * 10) / 10,
      wordsReadyForReview,
      overdueWords,
      masteredWords,
      strugglingWords,
      recentAccuracyTrend,
      responseTimeImprovement,
      consistencyScore,
      categoryBreakdown,
      recommendedStudyTime,
      priorityWords: priorityWords.slice(0, 5) // Top 5 priority words
    };
  }

  private calculateDailyAccuracy(recentPerformance: any[], days: number): number[] {
    const dailyAccuracy: number[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      targetDate.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayAttempts = recentPerformance.filter(attempt => {
        const attemptDate = new Date(attempt.timestamp);
        return attemptDate >= targetDate && attemptDate < nextDate;
      });

      if (dayAttempts.length > 0) {
        const correct = dayAttempts.filter(attempt => attempt.was_correct).length;
        dailyAccuracy.push((correct / dayAttempts.length) * 100);
      } else {
        dailyAccuracy.push(0);
      }
    }

    return dailyAccuracy;
  }

  private calculateResponseTimeImprovement(performanceLogs: any[]): number {
    if (performanceLogs.length < 10) return 0;

    const recent = performanceLogs.slice(0, Math.floor(performanceLogs.length / 2));
    const older = performanceLogs.slice(Math.floor(performanceLogs.length / 2));

    const recentAvg = recent.reduce((sum, log) => sum + log.response_time_ms, 0) / recent.length;
    const olderAvg = older.reduce((sum, log) => sum + log.response_time_ms, 0) / older.length;

    return olderAvg > 0 ? ((olderAvg - recentAvg) / olderAvg) * 100 : 0;
  }

  private calculateConsistencyScore(recentPerformance: any[]): number {
    if (recentPerformance.length === 0) return 0;

    // Group by day and count practice days
    const practiceDays = new Set();
    recentPerformance.forEach(attempt => {
      const date = new Date(attempt.timestamp).toDateString();
      practiceDays.add(date);
    });

    return Math.min(100, (practiceDays.size / 7) * 100); // Out of 7 days
  }

  private calculateCategoryBreakdown(performanceLogs: any[], vocabularyGems: any[]): CategoryProgress[] {
    const categories = new Map<string, CategoryProgress>();

    // Process performance logs
    performanceLogs.forEach(log => {
      const key = `${log.curriculum_level || 'Unknown'}-${log.language || 'Unknown'}`;
      if (!categories.has(key)) {
        categories.set(key, {
          category: log.language || 'Unknown',
          curriculum_level: log.curriculum_level || 'Unknown',
          totalAttempts: 0,
          accuracy: 0,
          averageResponseTime: 0,
          wordsTracked: 0,
          averageMemoryStrength: 0,
          wordsReadyForReview: 0
        });
      }

      const cat = categories.get(key)!;
      cat.totalAttempts++;
      if (log.was_correct) cat.accuracy++;
      cat.averageResponseTime += log.response_time_ms;
    });

    // Process vocabulary gems
    vocabularyGems.forEach(gem => {
      const key = `${gem.centralized_vocabulary.curriculum_level}-${gem.centralized_vocabulary.language}`;
      if (!categories.has(key)) {
        categories.set(key, {
          category: gem.centralized_vocabulary.language,
          curriculum_level: gem.centralized_vocabulary.curriculum_level,
          totalAttempts: 0,
          accuracy: 0,
          averageResponseTime: 0,
          wordsTracked: 0,
          averageMemoryStrength: 0,
          wordsReadyForReview: 0
        });
      }

      const cat = categories.get(key)!;
      cat.wordsTracked++;
      cat.averageMemoryStrength += gem.fsrs_retrievability || 0;
      
      if (gem.next_review_at && new Date(gem.next_review_at) <= new Date()) {
        cat.wordsReadyForReview++;
      }
    });

    // Finalize calculations
    categories.forEach(cat => {
      if (cat.totalAttempts > 0) {
        cat.accuracy = (cat.accuracy / cat.totalAttempts) * 100;
        cat.averageResponseTime = cat.averageResponseTime / cat.totalAttempts;
      }
      if (cat.wordsTracked > 0) {
        cat.averageMemoryStrength = (cat.averageMemoryStrength / cat.wordsTracked) * 100;
      }
    });

    return Array.from(categories.values()).sort((a, b) => b.totalAttempts - a.totalAttempts);
  }

  private identifyPriorityWords(performanceLogs: any[], vocabularyGems: any[]): PriorityWord[] {
    const wordMap = new Map<string, any>();
    const now = new Date();

    // Build word performance map
    performanceLogs.forEach(log => {
      if (!wordMap.has(log.word_text)) {
        wordMap.set(log.word_text, {
          word: log.word_text,
          translation: log.translation_text,
          attempts: [],
          lastAttempt: log.timestamp
        });
      }
      wordMap.get(log.word_text).attempts.push(log);
    });

    // Add FSRS data and identify priorities
    const priorities: PriorityWord[] = [];

    vocabularyGems.forEach(gem => {
      const word = gem.centralized_vocabulary.word;
      const performanceData = wordMap.get(word);
      
      if (!performanceData) return;

      const recentAttempts = performanceData.attempts.slice(0, 5);
      const recentAccuracy = recentAttempts.length > 0 
        ? (recentAttempts.filter((a: any) => a.was_correct).length / recentAttempts.length) * 100 
        : 0;
      
      const averageResponseTime = recentAttempts.length > 0
        ? recentAttempts.reduce((sum: number, a: any) => sum + a.response_time_ms, 0) / recentAttempts.length
        : 0;

      let reason: PriorityWord['reason'] = 'new_learning';
      let priority = 0;

      // Determine priority reason
      if (gem.next_review_at && new Date(gem.next_review_at) < new Date(now.getTime() - 24 * 60 * 60 * 1000)) {
        reason = 'overdue';
        priority = 10;
      } else if (gem.fsrs_retrievability < 0.6 || recentAccuracy < 60) {
        reason = 'struggling';
        priority = 8;
      } else if (recentAccuracy < 80 && averageResponseTime > 3000) {
        reason = 'inconsistent';
        priority = 6;
      }

      if (priority > 0) {
        priorities.push({
          word: gem.centralized_vocabulary.word,
          translation: gem.centralized_vocabulary.translation,
          category: gem.centralized_vocabulary.category,
          reason,
          memoryStrength: (gem.fsrs_retrievability || 0) * 100,
          daysSinceReview: gem.next_review_at 
            ? Math.floor((now.getTime() - new Date(gem.next_review_at).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
          recentAccuracy,
          averageResponseTime,
          lastAttempt: performanceData.lastAttempt
        });
      }
    });

    return priorities.sort((a, b) => {
      const priorityOrder = { overdue: 4, struggling: 3, inconsistent: 2, new_learning: 1 };
      return priorityOrder[b.reason] - priorityOrder[a.reason];
    });
  }
}
