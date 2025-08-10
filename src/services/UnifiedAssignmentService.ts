// Unified Assignment Service for Language Gems
// This service handles all assignment-related operations across games

import { SupabaseClient } from '@supabase/supabase-js';
import {
  UnifiedAssignment,
  AssignmentVocabularyConfig,
  VocabularyItem,
  GameProgressData,
  AssignmentService,
  VocabularySource,
  CurriculumLevel,
  DifficultyLevel
} from '../interfaces/UnifiedAssignmentInterface';

export class UnifiedAssignmentService implements AssignmentService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Get assignment for a specific student
   */
  async getAssignment(assignmentId: string, studentId: string): Promise<UnifiedAssignment> {
    try {
      // Get assignment details
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select(`
          *,
          classes(name),
          vocabulary_assignment_lists(*)
        `)
        .eq('id', assignmentId)
        .single();

      if (assignmentError || !assignment) {
        throw new Error(`Assignment not found: ${assignmentError?.message}`);
      }

      // Check if student is enrolled in the class
      const { data: enrollment } = await this.supabase
        .from('class_enrollments')
        .select('*')
        .eq('class_id', assignment.class_id)
        .eq('student_id', studentId)
        .single();

      if (!enrollment) {
        throw new Error('Student not enrolled in assignment class');
      }

      // Get assignment progress
      const { data: progress } = await this.supabase
        .from('assignment_progress')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .single();

      // Transform to unified assignment format
      const unifiedAssignment: UnifiedAssignment = {
        assignmentId: assignment.id,
        title: assignment.title,
        description: assignment.description,
        gameType: assignment.type || assignment.game_type,
        gameMode: 'assignment',
        gameConfig: assignment.vocabulary_criteria || {},
        vocabularyConfig: {
          source: assignment.vocabulary_selection_type === 'custom_list' ? 'custom_list' : 'category',
          customListId: assignment.vocabulary_assignment_list_id,
          categoryId: assignment.vocabulary_criteria?.category,
          subcategoryId: assignment.vocabulary_criteria?.subcategory,
          wordCount: assignment.vocabulary_count || assignment.vocabulary_criteria?.wordCount || 20,
          difficultyLevel: assignment.vocabulary_criteria?.difficulty || 'intermediate',
          curriculumLevel: assignment.vocabulary_criteria?.curriculumLevel || 'KS3',
          randomize: true,
          includeAudio: true
        },
        progressConfig: {
          trackTime: true,
          trackAttempts: true,
          trackAccuracy: true,
          trackWordsLearned: true,
          trackStreaks: true,
          enableGemProgression: true,
          enableSpacedRepetition: true,
          recordDetailedMetrics: true
        },
        dueDate: assignment.due_date ? new Date(assignment.due_date) : undefined,
        createdBy: assignment.created_by,
        classId: assignment.class_id,
        studentId: studentId,
        status: progress?.status || 'active',
        startedAt: progress?.started_at ? new Date(progress.started_at) : undefined,
        completedAt: progress?.completed_at ? new Date(progress.completed_at) : undefined
      };

      return unifiedAssignment;
    } catch (error) {
      console.error('Error getting assignment:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary items based on assignment configuration
   */
  async getAssignmentVocabulary(config: AssignmentVocabularyConfig): Promise<VocabularyItem[]> {
    try {
      let vocabulary: VocabularyItem[] = [];

      switch (config.source) {
        case 'custom_list':
          vocabulary = await this.getCustomListVocabulary(config.customListId!);
          // If custom list is empty, fall back to category-based vocabulary
          if (vocabulary.length === 0 && config.categoryId) {
            vocabulary = await this.getCategoryVocabulary(
              config.categoryId,
              config.subcategoryId,
              config.curriculumLevel,
              config.difficultyLevel
            );
          }
          break;

        case 'category':
          vocabulary = await this.getCategoryVocabulary(
            config.categoryId!,
            config.subcategoryId,
            config.curriculumLevel,
            config.difficultyLevel
          );
          break;

        case 'manual_selection':
          vocabulary = config.vocabularyItems || [];
          break;

        default:
          throw new Error(`Unsupported vocabulary source: ${config.source}`);
      }

      // Apply filters and limits
      if (config.includeAudio) {
        vocabulary = vocabulary.filter(item => item.audio_url);
      }

      if (config.difficultyLevel) {
        vocabulary = vocabulary.filter(item => 
          !item.difficulty_level || item.difficulty_level === config.difficultyLevel
        );
      }

      if (config.randomize) {
        vocabulary = this.shuffleArray(vocabulary);
      }

      if (config.wordCount && vocabulary.length > config.wordCount) {
        vocabulary = vocabulary.slice(0, config.wordCount);
      }

      return vocabulary;
    } catch (error) {
      console.error('Error getting assignment vocabulary:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary from custom list
   */
  private async getCustomListVocabulary(listId: string): Promise<VocabularyItem[]> {
    if (!listId) {
      return [];
    }

    // First get the vocabulary assignment list
    const { data: listItems, error } = await this.supabase
      .from('vocabulary_assignment_lists')
      .select('vocabulary_items')
      .eq('id', listId)
      .single();

    if (error) {
      console.warn(`Custom list not found: ${error.message}`);
      return [];
    }

    if (!listItems || !listItems.vocabulary_items || listItems.vocabulary_items.length === 0) {
      // Empty vocabulary list - return empty array to fall back to category-based vocabulary
      return [];
    }

    // Get vocabulary items by IDs from the old vocabulary table
    const { data: vocabulary, error: vocabError } = await this.supabase
      .from('vocabulary')
      .select('*')
      .in('id', listItems.vocabulary_items);

    if (vocabError) {
      console.warn(`Error loading vocabulary: ${vocabError.message}`);
      return [];
    }

    // Transform old vocabulary format to new format
    return (vocabulary || []).map(item => ({
      id: item.id,
      word: item.spanish || item.french || item.german || item.italian || '',
      translation: item.english || '',
      language: item.spanish ? 'es' : item.french ? 'fr' : item.german ? 'de' : item.italian ? 'it' : 'es',
      category: item.theme || 'general',
      subcategory: item.topic || 'basic',
      part_of_speech: item.part_of_speech || 'noun',
      difficulty_level: 'intermediate',
      audio_url: null,
      image_url: null,
      example_sentence: null,
      example_translation: null
    }));
  }

  /**
   * Get vocabulary from category/subcategory
   */
  private async getCategoryVocabulary(
    categoryId: string,
    subcategoryId?: string,
    curriculumLevel?: CurriculumLevel,
    difficultyLevel?: DifficultyLevel
  ): Promise<VocabularyItem[]> {
    let query = this.supabase
      .from('centralized_vocabulary')
      .select('*')
      .eq('category', categoryId);

    if (subcategoryId) {
      query = query.eq('subcategory', subcategoryId);
    }

    if (curriculumLevel) {
      query = query.eq('curriculum_level', curriculumLevel);
    }

    // Note: difficulty_level column doesn't exist in centralized_vocabulary table
    // Filtering by difficulty is not supported for this table

    const { data: vocabulary, error } = await query.limit(100);

    if (error) {
      throw new Error(`Error loading category vocabulary: ${error.message}`);
    }

    return this.transformVocabularyItems(vocabulary || []);
  }

  /**
   * Transform database vocabulary to unified format
   */
  private transformVocabularyItems(items: any[]): VocabularyItem[] {
    return items.map(item => ({
      id: item.id.toString(),
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      example_sentence: item.example_sentence,
      example_translation: item.example_translation,
      audio_url: item.audio_url,
      difficulty_level: 'intermediate' as DifficultyLevel, // Default since column doesn't exist
      curriculum_level: item.curriculum_level as CurriculumLevel,
      metadata: item.metadata || {}
    }));
  }

  /**
   * Record game progress
   */
  async recordProgress(progressData: GameProgressData): Promise<void> {
    try {
      // Update assignment progress
      if (progressData.assignmentId) {
        await this.supabase
          .from('enhanced_assignment_progress')
          .upsert({
            assignment_id: progressData.assignmentId,
            student_id: progressData.studentId,
            best_score: progressData.score,
            best_accuracy: progressData.accuracy,
            attempts_count: progressData.attempts,
            total_time_spent: progressData.timeSpent,
            status: progressData.status === 'completed' ? 'completed' : 'in_progress',
            completed_at: progressData.completedAt?.toISOString(),
            updated_at: new Date().toISOString(),
            progress_data: {
              wordsAttempted: progressData.wordsAttempted,
              wordsCorrect: progressData.wordsCorrect,
              wordsLearned: progressData.wordsLearned,
              currentStreak: progressData.currentStreak,
              bestStreak: progressData.bestStreak,
              gameMetrics: progressData.gameMetrics
            },
            words_mastered: progressData.wordsLearned || 0,
            words_attempted: progressData.wordsAttempted || 0,
            words_correct: progressData.wordsCorrect || 0,
            current_streak: progressData.currentStreak || 0
          }, {
            onConflict: 'assignment_id,student_id'
          });
      }

      // Record detailed word progress for gem progression
      for (const wordProgress of progressData.wordProgress) {
        await this.recordWordProgress(progressData.studentId, wordProgress);
      }

      // Record game session
      await this.supabase
        .from('game_sessions')
        .insert({
          student_id: progressData.studentId,
          assignment_id: progressData.assignmentId,
          game_type: progressData.gameType,
          session_data: {
            score: progressData.score,
            accuracy: progressData.accuracy,
            timeSpent: progressData.timeSpent,
            wordsLearned: progressData.wordsLearned,
            gameMetrics: progressData.gameMetrics
          },
          started_at: progressData.startedAt.toISOString(),
          completed_at: progressData.completedAt?.toISOString()
        });

    } catch (error) {
      console.error('Error recording progress:', error);
      throw error;
    }
  }

  /**
   * Record individual word progress for gem progression
   */
  private async recordWordProgress(studentId: string, wordProgress: any): Promise<void> {
    try {
      // Update vocabulary gem collection
      await this.supabase
        .from('vocabulary_gem_collection')
        .upsert({
          student_id: studentId,
          vocabulary_item_id: parseInt(wordProgress.vocabularyId),
          total_encounters: 1, // Will be incremented by database trigger
          correct_encounters: wordProgress.isCorrect ? 1 : 0,
          incorrect_encounters: wordProgress.isCorrect ? 0 : 1,
          last_encountered_at: wordProgress.timestamp.toISOString(),
          response_time_ms: wordProgress.responseTime,
          hints_used: wordProgress.hintsUsed
        });

      // Record in student vocabulary practice table
      await this.supabase
        .from('student_vocabulary_practice')
        .insert({
          student_id: studentId,
          vocabulary_id: parseInt(wordProgress.vocabularyId),
          is_correct: wordProgress.isCorrect,
          response_time_ms: wordProgress.responseTime,
          attempts_count: wordProgress.attempts,
          hints_used: wordProgress.hintsUsed,
          practiced_at: wordProgress.timestamp.toISOString()
        });

    } catch (error) {
      console.error('Error recording word progress:', error);
      // Don't throw here to avoid breaking the main progress recording
    }
  }

  /**
   * Update assignment status
   */
  async updateAssignmentStatus(assignmentId: string, studentId: string, status: string): Promise<void> {
    await this.supabase
      .from('assignment_progress')
      .upsert({
        assignment_id: assignmentId,
        student_id: studentId,
        status: status,
        updated_at: new Date().toISOString()
      });
  }

  /**
   * Get student assignments
   */
  async getStudentAssignments(studentId: string, status?: string): Promise<UnifiedAssignment[]> {
    // Get student's classes
    const { data: enrollments } = await this.supabase
      .from('class_enrollments')
      .select('class_id')
      .eq('student_id', studentId);

    if (!enrollments || enrollments.length === 0) {
      return [];
    }

    const classIds = enrollments.map(e => e.class_id);

    // Get assignments for these classes
    let query = this.supabase
      .from('assignments')
      .select(`
        *,
        assignment_progress!inner(status, started_at, completed_at)
      `)
      .in('class_id', classIds)
      .eq('assignment_progress.student_id', studentId);

    if (status) {
      query = query.eq('assignment_progress.status', status);
    }

    const { data: assignments } = await query;

    // Transform to unified format
    return (assignments || []).map(assignment => ({
      assignmentId: assignment.id,
      title: assignment.title,
      description: assignment.description,
      gameType: assignment.type || assignment.game_type,
      gameMode: 'assignment' as const,
      gameConfig: assignment.vocabulary_criteria || {},
      vocabularyConfig: {
        source: assignment.vocabulary_assignment_list_id ? 'custom_list' : 'category',
        customListId: assignment.vocabulary_assignment_list_id,
        wordCount: assignment.vocabulary_count || 20
      } as AssignmentVocabularyConfig,
      progressConfig: {
        trackTime: true,
        trackAttempts: true,
        trackAccuracy: true,
        trackWordsLearned: true,
        enableGemProgression: true
      },
      dueDate: assignment.due_date ? new Date(assignment.due_date) : undefined,
      createdBy: assignment.created_by,
      classId: assignment.class_id,
      studentId: studentId,
      status: assignment.assignment_progress[0]?.status || 'active',
      startedAt: assignment.assignment_progress[0]?.started_at ? 
        new Date(assignment.assignment_progress[0].started_at) : undefined,
      completedAt: assignment.assignment_progress[0]?.completed_at ? 
        new Date(assignment.assignment_progress[0].completed_at) : undefined
    }));
  }

  /**
   * Get assignment analytics
   */
  async getAssignmentAnalytics(assignmentId: string): Promise<any> {
    const { data: analytics } = await this.supabase
      .from('assignment_progress')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (!analytics) return null;

    const totalStudents = analytics.length;
    const completedStudents = analytics.filter(a => a.status === 'completed').length;
    const averageScore = analytics.reduce((sum, a) => sum + (a.score || 0), 0) / totalStudents;
    const averageAccuracy = analytics.reduce((sum, a) => sum + (a.accuracy || 0), 0) / totalStudents;

    return {
      totalStudents,
      completedStudents,
      completionRate: (completedStudents / totalStudents) * 100,
      averageScore,
      averageAccuracy,
      analytics
    };
  }

  /**
   * Utility function to shuffle array
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
