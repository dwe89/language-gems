import { createBrowserClient } from '../lib/supabase-client';

export interface GameProgress {
  assignmentId: string;
  gameId: string;
  studentId: string;
  wordsCompleted: number;
  totalWords: number;
  score: number;
  maxScore: number;
  timeSpent: number;
  accuracy: number;
  completedAt?: Date;
  sessionData: any;
}

/**
 * Assignment Progress Service
 * 
 * Handles all database persistence for assignment progress tracking.
 * Consolidates the three different progress tables into a single service.
 */
export class AssignmentProgressService {
  private supabase = createBrowserClient();

  /**
   * Record progress for an assignment game session
   * Updates three tables:
   * 1. assignment_game_progress - Overall assignment completion status
   * 2. assignment_session_history - Individual session records
   * 3. enhanced_assignment_progress - Detailed progress metrics
   */
  async recordProgress(progress: GameProgress): Promise<{ success: boolean; error?: string }> {
    console.log('💾 [PROGRESS SERVICE] Recording progress:', progress);

    try {
      const {
        assignmentId,
        gameId,
        studentId,
        wordsCompleted,
        totalWords,
        score,
        maxScore,
        accuracy,
        timeSpent,
        completedAt,
        sessionData
      } = progress;

      const isCompleted = !!completedAt;

      // 1. Update assignment_game_progress (overall status)
      const { error: progressError } = await this.supabase
        .from('assignment_game_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          game_id: gameId,
          completed: isCompleted,
          score,
          accuracy,
          time_spent: timeSpent,
          words_completed: wordsCompleted,
          total_words: totalWords,
          session_data: sessionData,
          completed_at: completedAt?.toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'assignment_id,student_id,game_id'
        });

      if (progressError) {
        console.error('❌ Error updating assignment_game_progress:', progressError);
        throw progressError;
      }

      // 2. Insert into assignment_session_history (session record)
      const { error: historyError } = await this.supabase
        .from('assignment_session_history')
        .insert({
          assignment_id: assignmentId,
          student_id: studentId,
          game_id: gameId,
          score,
          accuracy,
          time_spent: timeSpent,
          words_completed: wordsCompleted,
          total_words: totalWords,
          session_data: sessionData,
          completed: isCompleted,
          created_at: new Date().toISOString()
        });

      if (historyError) {
        console.error('❌ Error inserting into assignment_session_history:', historyError);
        // Don't throw - this is less critical
      }

      // 3. Update enhanced_assignment_progress (detailed metrics)
      const { error: enhancedError } = await this.supabase
        .from('enhanced_assignment_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          game_id: gameId,
          total_score: score,
          max_score: maxScore,
          accuracy_percentage: accuracy,
          total_time_spent: timeSpent,
          words_mastered: wordsCompleted,
          total_words: totalWords,
          completed: isCompleted,
          last_played_at: new Date().toISOString(),
          metadata: {
            ...sessionData,
            gameType: gameId,
            completedAt: completedAt?.toISOString()
          }
        }, {
          onConflict: 'assignment_id,student_id,game_id'
        });

      if (enhancedError) {
        console.error('❌ Error updating enhanced_assignment_progress:', enhancedError);
        // Don't throw - this is less critical
      }

      console.log('✅ [PROGRESS SERVICE] Progress recorded successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ [PROGRESS SERVICE] Failed to record progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update vocabulary-level progress for a specific word
   * Used by games to track individual word interactions
   */
  async recordVocabularyProgress(
    assignmentId: string,
    studentId: string,
    vocabularyId: string,
    correct: boolean
  ): Promise<void> {
    try {
      // Load current progress
      const { data: existing } = await this.supabase
        .from('assignment_vocabulary_progress')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('vocabulary_id', vocabularyId)
        .single();

      const seenCount = (existing?.seen_count || 0) + 1;
      const correctCount = (existing?.correct_count || 0) + (correct ? 1 : 0);

      await this.supabase
        .from('assignment_vocabulary_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          vocabulary_id: vocabularyId,
          seen_count: seenCount,
          correct_count: correctCount,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'assignment_id,student_id,vocabulary_id'
        });

      console.log('✅ [PROGRESS SERVICE] Vocabulary progress updated:', {
        vocabularyId,
        seenCount,
        correctCount,
        accuracy: (correctCount / seenCount * 100).toFixed(1) + '%'
      });
    } catch (error) {
      console.error('❌ [PROGRESS SERVICE] Failed to update vocabulary progress:', error);
    }
  }

  /**
   * Get student's progress for an assignment
   */
  async getProgress(assignmentId: string, studentId: string, gameId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('assignment_game_progress')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .eq('game_id', gameId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Error loading progress:', error);
      return null;
    }

    return data;
  }
}

// Export singleton instance
export const assignmentProgressService = new AssignmentProgressService();

