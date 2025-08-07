// FSRS-Enhanced Analytics Service for LanguageGems
// Leverages FSRS memory states for precise teacher recommendations and insights

import { SupabaseClient } from '@supabase/supabase-js';
import { FSRSCard } from './fsrsService';

// ============================================================================
// FSRS ANALYTICS INTERFACES
// ============================================================================

export interface FSRSStudentAnalytics {
  studentId: string;
  studentName: string;
  vocabularyMastery: {
    wordId: string;
    word: string;
    translation: string;
    difficulty: number;      // Personal difficulty for this student (1-10)
    stability: number;       // Memory strength in days
    retrievability: number;  // Current recall probability (0-1)
    optimalInterval: number; // Days until next review
    masteryLevel: 'new' | 'learning' | 'review' | 'relearning';
    lastReview: Date;
    reviewCount: number;
    lapseCount: number;
  }[];

  learningEfficiency: {
    reviewsPerDay: number;
    retentionRate: number;
    timeToMastery: number;   // Average days to master new words
    strugglingWords: string[]; // Words with high difficulty (>7)
    masteredWords: string[];   // Words with high stability (>30 days)
    overdueWords: string[];    // Words past optimal review time
  };

  memoryStrengthProfile: {
    averageDifficulty: number;
    averageStability: number;
    averageRetrievability: number;
    memoryDecayRate: number;
    learningVelocity: number; // Words mastered per week
  };

  predictions: {
    wordsToReview: number;   // Words due for review in next 7 days
    studyTimeNeeded: number; // Minutes needed for optimal learning
    masteryForecast: {       // Predicted mastery in X days
      in7Days: number;
      in30Days: number;
      in90Days: number;
    };
    riskLevel: 'low' | 'medium' | 'high'; // Risk of forgetting learned words
  };
}

export interface FSRSClassAnalytics {
  classId: string;
  className: string;
  totalStudents: number;

  classPerformance: {
    averageDifficulty: number;
    averageStability: number;
    averageRetrievability: number;
    classRetentionRate: number;
    vocabularyMasteryRate: number;
  };

  strugglingConcepts: {
    wordId: string;
    word: string;
    translation: string;
    averageDifficulty: number;
    studentsStruggling: number;
    recommendedAction: string;
  }[];

  atRiskStudents: {
    studentId: string;
    studentName: string;
    riskFactors: string[];
    recommendedIntervention: string;
    urgency: 'low' | 'medium' | 'high';
  }[];

  teachingRecommendations: {
    priority: 'high' | 'medium' | 'low';
    category: 'vocabulary' | 'pacing' | 'intervention' | 'reinforcement';
    title: string;
    description: string;
    actionItems: string[];
    expectedImpact: string;
  }[];
}

export interface FSRSInsight {
  id: string;
  teacherId: string;
  insightType: 'memory_decay' | 'learning_velocity' | 'difficulty_spike' | 'mastery_plateau' | 'optimal_timing';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  affectedStudents: string[];
  memoryMetrics: {
    averageDifficulty?: number;
    averageStability?: number;
    retrievabilityTrend?: number;
    forgettingRate?: number;
  };
  actionable: boolean;
  confidence: number;
  generatedAt: Date;
  expiresAt: Date;
}

// ============================================================================
// FSRS ANALYTICS SERVICE
// ============================================================================

export class FSRSAnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generate comprehensive FSRS analytics for a student
   */
  async generateStudentAnalytics(studentId: string): Promise<FSRSStudentAnalytics> {
    try {
      // Get student's FSRS data
      const { data: fsrsData, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          centralized_vocabulary!inner(word, translation, language)
        `)
        .eq('student_id', studentId)
        .not('fsrs_difficulty', 'is', null);

      if (error) throw error;

      // Get student name
      const { data: studentData } = await this.supabase
        .from('student_credentials')
        .select('student_name')
        .eq('student_id', studentId)
        .single();

      const studentName = studentData?.student_name || 'Unknown Student';

      // Process FSRS data into analytics
      const vocabularyMastery = fsrsData.map(item => ({
        wordId: item.vocabulary_item_id,
        word: item.centralized_vocabulary.word,
        translation: item.centralized_vocabulary.translation,
        difficulty: item.fsrs_difficulty || 5.0,
        stability: item.fsrs_stability || 1.0,
        retrievability: item.fsrs_retrievability || 1.0,
        optimalInterval: Math.round(item.fsrs_stability * (Math.log(0.9) / Math.log(0.9))),
        masteryLevel: item.fsrs_state || 'new',
        lastReview: item.fsrs_last_review ? new Date(item.fsrs_last_review) : new Date(),
        reviewCount: item.fsrs_review_count || 0,
        lapseCount: item.fsrs_lapse_count || 0
      }));

      // Calculate learning efficiency metrics
      const learningEfficiency = this.calculateLearningEfficiency(vocabularyMastery);

      // Calculate memory strength profile
      const memoryStrengthProfile = this.calculateMemoryStrengthProfile(vocabularyMastery);

      // Generate predictions
      const predictions = this.generateStudentPredictions(vocabularyMastery);

      return {
        studentId,
        studentName,
        vocabularyMastery,
        learningEfficiency,
        memoryStrengthProfile,
        predictions
      };

    } catch (error) {
      console.error('Error generating FSRS student analytics:', error);
      throw error;
    }
  }

  /**
   * Calculate learning efficiency metrics from FSRS data
   */
  private calculateLearningEfficiency(vocabularyMastery: any[]): any {
    const totalWords = vocabularyMastery.length;
    if (totalWords === 0) {
      return {
        reviewsPerDay: 0,
        retentionRate: 0,
        timeToMastery: 0,
        strugglingWords: [],
        masteredWords: [],
        overdueWords: []
      };
    }

    // Calculate retention rate (words with low lapse count)
    const retainedWords = vocabularyMastery.filter(word =>
      word.lapseCount <= 1 && word.reviewCount > 0
    ).length;
    const retentionRate = totalWords > 0 ? (retainedWords / totalWords) * 100 : 0;

    // Identify struggling words (high difficulty)
    const strugglingWords = vocabularyMastery
      .filter(word => word.difficulty > 7)
      .map(word => word.word);

    // Identify mastered words (high stability)
    const masteredWords = vocabularyMastery
      .filter(word => word.stability > 30)
      .map(word => word.word);

    // Identify overdue words
    const now = new Date();
    const overdueWords = vocabularyMastery
      .filter(word => {
        const daysSinceReview = (now.getTime() - word.lastReview.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceReview > word.optimalInterval;
      })
      .map(word => word.word);

    // Calculate average time to mastery
    const masteredWordsData = vocabularyMastery.filter(word => word.stability > 30);
    const timeToMastery = masteredWordsData.length > 0
      ? masteredWordsData.reduce((sum, word) => sum + word.reviewCount, 0) / masteredWordsData.length
      : 0;

    // Estimate reviews per day based on recent activity
    const reviewsPerDay = vocabularyMastery.reduce((sum, word) => sum + word.reviewCount, 0) / 30; // Last 30 days estimate

    return {
      reviewsPerDay,
      retentionRate,
      timeToMastery,
      strugglingWords,
      masteredWords,
      overdueWords
    };
  }

  /**
   * Calculate memory strength profile from FSRS data
   */
  private calculateMemoryStrengthProfile(vocabularyMastery: any[]): any {
    if (vocabularyMastery.length === 0) {
      return {
        averageDifficulty: 5.0,
        averageStability: 1.0,
        averageRetrievability: 1.0,
        memoryDecayRate: 0,
        learningVelocity: 0
      };
    }

    const averageDifficulty = vocabularyMastery.reduce((sum, word) => sum + word.difficulty, 0) / vocabularyMastery.length;
    const averageStability = vocabularyMastery.reduce((sum, word) => sum + word.stability, 0) / vocabularyMastery.length;
    const averageRetrievability = vocabularyMastery.reduce((sum, word) => sum + word.retrievability, 0) / vocabularyMastery.length;

    // Calculate memory decay rate (words with declining retrievability)
    const decliningWords = vocabularyMastery.filter(word => word.retrievability < 0.8).length;
    const memoryDecayRate = (decliningWords / vocabularyMastery.length) * 100;

    // Calculate learning velocity (words mastered per week)
    const masteredWords = vocabularyMastery.filter(word => word.stability > 30).length;
    const learningVelocity = masteredWords / 4; // Assume 4 weeks of data

    return {
      averageDifficulty,
      averageStability,
      averageRetrievability,
      memoryDecayRate,
      learningVelocity
    };
  }

  /**
   * Generate predictions based on FSRS data
   */
  private generateStudentPredictions(vocabularyMastery: any[]): any {
    const now = new Date();

    // Words due for review in next 7 days
    const wordsToReview = vocabularyMastery.filter(word => {
      const daysSinceReview = (now.getTime() - word.lastReview.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceReview >= word.optimalInterval;
    }).length;

    // Estimate study time needed (30 seconds per word on average)
    const studyTimeNeeded = wordsToReview * 0.5; // minutes

    // Mastery forecast based on current learning velocity
    const currentMastered = vocabularyMastery.filter(word => word.stability > 30).length;
    const learningRate = currentMastered / Math.max(vocabularyMastery.length, 1);

    const masteryForecast = {
      in7Days: Math.round(currentMastered + (learningRate * vocabularyMastery.length * 0.1)),
      in30Days: Math.round(currentMastered + (learningRate * vocabularyMastery.length * 0.3)),
      in90Days: Math.round(currentMastered + (learningRate * vocabularyMastery.length * 0.6))
    };

    // Risk level based on overdue words and memory decay
    const overdueWords = vocabularyMastery.filter(word => {
      const daysSinceReview = (now.getTime() - word.lastReview.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceReview > word.optimalInterval * 1.5;
    }).length;

    const overduePercentage = (overdueWords / Math.max(vocabularyMastery.length, 1)) * 100;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (overduePercentage > 30) riskLevel = 'high';
    else if (overduePercentage > 15) riskLevel = 'medium';

    return {
      wordsToReview,
      studyTimeNeeded,
      masteryForecast,
      riskLevel
    };
  }

  /**
   * Generate FSRS-powered insights for teachers
   */
  async generateFSRSInsights(teacherId: string): Promise<FSRSInsight[]> {
    try {
      const insights: FSRSInsight[] = [];

      // Get all students for this teacher
      const { data: students, error: studentsError } = await this.supabase
        .from('student_credentials')
        .select('student_id, student_name, class_id')
        .eq('teacher_id', teacherId);

      if (studentsError) throw studentsError;

      if (!students || students.length === 0) {
        return insights;
      }

      // Get FSRS data for all students
      const studentIds = students.map(s => s.student_id);
      const { data: fsrsData, error: fsrsError } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          centralized_vocabulary!inner(word, translation, language)
        `)
        .in('student_id', studentIds)
        .not('fsrs_difficulty', 'is', null);

      if (fsrsError) throw fsrsError;

      // Generate memory decay insights
      const memoryDecayInsight = this.generateMemoryDecayInsight(teacherId, students, fsrsData);
      if (memoryDecayInsight) insights.push(memoryDecayInsight);

      return insights;

    } catch (error) {
      console.error('Error generating FSRS insights:', error);
      return [];
    }
  }

  /**
   * Generate memory decay insight based on FSRS retrievability data
   */
  private generateMemoryDecayInsight(teacherId: string, students: any[], fsrsData: any[]): FSRSInsight | null {
    // Find words with declining retrievability
    const decliningWords = fsrsData.filter(item =>
      item.fsrs_retrievability && item.fsrs_retrievability < 0.7
    );

    if (decliningWords.length === 0) return null;

    const affectedStudents = [...new Set(decliningWords.map(item => item.student_id))];
    const averageRetrievability = decliningWords.reduce((sum, item) =>
      sum + (item.fsrs_retrievability || 0), 0
    ) / decliningWords.length;

    return {
      id: `memory_decay_${Date.now()}`,
      teacherId,
      insightType: 'memory_decay',
      priority: averageRetrievability < 0.5 ? 'urgent' : 'high',
      title: `Memory Decay Detected in ${decliningWords.length} Words`,
      description: `${decliningWords.length} vocabulary words show declining memory strength across ${affectedStudents.length} students. Average retrievability has dropped to ${Math.round(averageRetrievability * 100)}%.`,
      recommendation: `Schedule immediate review sessions for affected words. Consider using spaced repetition games to reinforce memory before complete forgetting occurs.`,
      affectedStudents,
      memoryMetrics: {
        retrievabilityTrend: averageRetrievability,
        forgettingRate: (1 - averageRetrievability) * 100
      },
      actionable: true,
      confidence: 0.9,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    };
  }
}