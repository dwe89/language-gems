/**
 * =====================================================
 * PHASE 2: STUDENT VOCABULARY ANALYTICS SERVICE
 * =====================================================
 * 
 * Single source of truth for all vocabulary tracking.
 * Replaces fragmented tracking across multiple tables.
 * 
 * Purpose: Enable simple teacher queries like:
 * - "How many times has Student X seen word Y?"
 * - "What words is Student X struggling with?"
 * - "What are Student X's strong/weak topics?"
 */

import { SupabaseClient } from '@supabase/supabase-js';

// =====================================================
// TYPES
// =====================================================

export type MasteryLevel = 'new' | 'learning' | 'practiced' | 'mastered' | 'struggling';

export interface VocabularyAnalytics {
  id: string;
  studentId: string;
  vocabularyId: string;
  
  // Counters
  totalExposures: number;
  correctCount: number;
  incorrectCount: number;
  
  // Timing
  firstSeen: Date;
  lastSeen: Date;
  lastCorrect?: Date;
  lastIncorrect?: Date;
  
  // Context
  seenInVocabMaster: boolean;
  seenInGames: boolean;
  seenInAssignments: string[];
  
  // Source breakdown
  vocabMasterExposures: number;
  gamesExposures: number;
  assignmentsExposures: number;
  
  // Derived metrics
  accuracyPercentage: number;
  masteryLevel: MasteryLevel;
  
  // Classification
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  curriculumLevel?: string;
}

export interface WordMasteryDetail extends VocabularyAnalytics {
  word: string;
  translation: string;
  language: string;
  studentName: string;
}

export interface TopicAnalysis {
  studentId: string;
  topic: string;
  wordsInTopic: number;
  topicAccuracy: number;
  masteredWords: number;
  strugglingWords: number;
  totalTopicExposures: number;
}

export interface StudentVocabularyReport {
  studentId: string;
  studentName: string;
  
  // Summary stats
  totalWordsEncountered: number;
  masteredWords: number;
  strugglingWords: number;
  averageAccuracy: number;
  
  // Word lists
  allWords: WordMasteryDetail[];
  weakWords: WordMasteryDetail[]; // < 50% accuracy
  strongWords: WordMasteryDetail[]; // > 80% accuracy
  
  // Topic breakdown
  topicStrengths: TopicAnalysis[];
}

// =====================================================
// SERVICE CLASS
// =====================================================

export class StudentVocabularyAnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * 🎯 CORE METHOD: Record a vocabulary interaction
   * Call this from VocabMaster, games, and assignments
   */
  async recordInteraction(
    studentId: string,
    vocabularyId: string,
    wasCorrect: boolean,
    source: 'vocab_master' | 'game' | string, // string for assignment UUID
    metadata?: {
      topic?: string;
      subtopic?: string;
      difficulty?: string;
      curriculumLevel?: string;
    }
  ): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('record_vocabulary_interaction', {
        p_student_id: studentId,
        p_vocabulary_id: vocabularyId,
        p_was_correct: wasCorrect,
        p_source: source,
        p_topic: metadata?.topic || null,
        p_subtopic: metadata?.subtopic || null,
        p_difficulty: metadata?.difficulty || null,
        p_curriculum_level: metadata?.curriculumLevel || null
      });

      if (error) throw error;

      console.log('✅ [PHASE 2] Vocabulary interaction recorded:', {
        vocabularyId,
        wasCorrect,
        source
      });
    } catch (error) {
      console.error('❌ [PHASE 2] Failed to record interaction:', error);
      throw error;
    }
  }

  /**
   * 📊 Get complete vocabulary report for a student
   */
  async getStudentReport(studentId: string): Promise<StudentVocabularyReport> {
    try {
      // Get all word mastery data
      const { data: wordData, error: wordError } = await this.supabase
        .from('teacher_student_word_mastery')
        .select('*')
        .eq('student_id', studentId);

      if (wordError) throw wordError;

      const allWords = (wordData || []).map(this.mapToWordMasteryDetail);

      // Get topic analysis
      const { data: topicData, error: topicError } = await this.supabase
        .from('teacher_topic_analysis')
        .select('*')
        .eq('student_id', studentId);

      if (topicError) throw topicError;

      const topicStrengths = (topicData || []).map(this.mapToTopicAnalysis);

      // Calculate summary stats
      const totalWordsEncountered = allWords.length;
      const masteredWords = allWords.filter(w => w.masteryLevel === 'mastered').length;
      const strugglingWords = allWords.filter(w => w.masteryLevel === 'struggling').length;
      const averageAccuracy = allWords.length > 0
        ? allWords.reduce((sum, w) => sum + w.accuracyPercentage, 0) / allWords.length
        : 0;

      return {
        studentId,
        studentName: allWords[0]?.studentName || 'Unknown',
        totalWordsEncountered,
        masteredWords,
        strugglingWords,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        allWords,
        weakWords: allWords.filter(w => w.accuracyPercentage < 50),
        strongWords: allWords.filter(w => w.accuracyPercentage > 80),
        topicStrengths
      };
    } catch (error) {
      console.error('❌ [PHASE 2] Failed to get student report:', error);
      throw error;
    }
  }

  /**
   * 🔍 Get specific word analytics for a student
   */
  async getWordAnalytics(
    studentId: string,
    vocabularyId: string
  ): Promise<VocabularyAnalytics | null> {
    try {
      const { data, error } = await this.supabase
        .from('student_vocabulary_analytics')
        .select('*')
        .eq('student_id', studentId)
        .eq('vocabulary_id', vocabularyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return this.mapToVocabularyAnalytics(data);
    } catch (error) {
      console.error('❌ [PHASE 2] Failed to get word analytics:', error);
      throw error;
    }
  }

  /**
   * 📋 Get all struggling words for a student
   */
  async getStrugglingWords(studentId: string): Promise<WordMasteryDetail[]> {
    try {
      const { data, error } = await this.supabase
        .from('teacher_student_word_mastery')
        .select('*')
        .eq('student_id', studentId)
        .eq('mastery_level', 'struggling')
        .order('accuracy_percentage', { ascending: true });

      if (error) throw error;

      return (data || []).map(this.mapToWordMasteryDetail);
    } catch (error) {
      console.error('❌ [PHASE 2] Failed to get struggling words:', error);
      throw error;
    }
  }

  /**
   * 🎯 Get topic analysis for a student
   */
  async getTopicAnalysis(studentId: string): Promise<TopicAnalysis[]> {
    try {
      const { data, error } = await this.supabase
        .from('teacher_topic_analysis')
        .select('*')
        .eq('student_id', studentId)
        .order('topic_accuracy', { ascending: true });

      if (error) throw error;

      return (data || []).map(this.mapToTopicAnalysis);
    } catch (error) {
      console.error('❌ [PHASE 2] Failed to get topic analysis:', error);
      throw error;
    }
  }

  /**
   * 📊 Get class-wide analytics (for teachers)
   */
  async getClassAnalytics(classId: string): Promise<{
    studentReports: StudentVocabularyReport[];
    classAverageAccuracy: number;
    totalWordsTracked: number;
    weakestTopics: TopicAnalysis[];
  }> {
    try {
      // Get all students in class
      const { data: enrollments, error: enrollError } = await this.supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', classId);

      if (enrollError) throw enrollError;

      const studentIds = enrollments?.map(e => e.student_id) || [];

      // Get reports for all students
      const studentReports = await Promise.all(
        studentIds.map(id => this.getStudentReport(id))
      );

      // Calculate class-wide metrics
      const classAverageAccuracy = studentReports.length > 0
        ? studentReports.reduce((sum, r) => sum + r.averageAccuracy, 0) / studentReports.length
        : 0;

      const totalWordsTracked = new Set(
        studentReports.flatMap(r => r.allWords.map(w => w.vocabularyId))
      ).size;

      // Aggregate topic weaknesses across all students
      const topicMap = new Map<string, TopicAnalysis>();
      studentReports.forEach(report => {
        report.topicStrengths.forEach(topic => {
          const existing = topicMap.get(topic.topic);
          if (!existing || topic.topicAccuracy < existing.topicAccuracy) {
            topicMap.set(topic.topic, topic);
          }
        });
      });

      const weakestTopics = Array.from(topicMap.values())
        .sort((a, b) => a.topicAccuracy - b.topicAccuracy)
        .slice(0, 5);

      return {
        studentReports,
        classAverageAccuracy: Math.round(classAverageAccuracy * 100) / 100,
        totalWordsTracked,
        weakestTopics
      };
    } catch (error) {
      console.error('❌ [PHASE 2] Failed to get class analytics:', error);
      throw error;
    }
  }

  // =====================================================
  // PRIVATE MAPPING METHODS
  // =====================================================

  private mapToVocabularyAnalytics(data: any): VocabularyAnalytics {
    return {
      id: data.id,
      studentId: data.student_id,
      vocabularyId: data.vocabulary_id,
      totalExposures: data.total_exposures,
      correctCount: data.correct_count,
      incorrectCount: data.incorrect_count,
      firstSeen: new Date(data.first_seen),
      lastSeen: new Date(data.last_seen),
      lastCorrect: data.last_correct ? new Date(data.last_correct) : undefined,
      lastIncorrect: data.last_incorrect ? new Date(data.last_incorrect) : undefined,
      seenInVocabMaster: data.seen_in_vocab_master,
      seenInGames: data.seen_in_games,
      seenInAssignments: data.seen_in_assignments || [],
      vocabMasterExposures: data.vocab_master_exposures,
      gamesExposures: data.games_exposures,
      assignmentsExposures: data.assignments_exposures,
      accuracyPercentage: parseFloat(data.accuracy_percentage),
      masteryLevel: data.mastery_level,
      topic: data.topic,
      subtopic: data.subtopic,
      difficulty: data.difficulty,
      curriculumLevel: data.curriculum_level
    };
  }

  private mapToWordMasteryDetail(data: any): WordMasteryDetail {
    return {
      ...this.mapToVocabularyAnalytics(data),
      word: data.word,
      translation: data.translation,
      language: data.language,
      studentName: data.student_name
    };
  }

  private mapToTopicAnalysis(data: any): TopicAnalysis {
    return {
      studentId: data.student_id,
      topic: data.topic,
      wordsInTopic: data.words_in_topic,
      topicAccuracy: parseFloat(data.topic_accuracy),
      masteredWords: data.mastered_words,
      strugglingWords: data.struggling_words,
      totalTopicExposures: data.total_topic_exposures
    };
  }
}

