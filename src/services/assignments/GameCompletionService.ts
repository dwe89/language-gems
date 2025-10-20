/**
 * Game Completion Service
 * 
 * Handles the logic for marking individual games as "completed" within assignments.
 * 
 * DUAL-CRITERIA COMPLETION LOGIC:
 * A game is marked as 'completed' when BOTH conditions are met:
 * 1. Minimum Activity: sessionsPlayed >= gameRequirements.minSessions
 * 2. Content Exposure: wordsExposed >= totalAssignmentWords (100% exposure)
 * 
 * This ensures:
 * - Teacher requirements are met (activity compliance)
 * - Full curriculum coverage (learning quality)
 * - Aligns with the Completion Score (10 points for 100% exposure)
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface GameCompletionStatus {
  gameId: string;
  isComplete: boolean;
  sessionsPlayed: number;
  minSessionsRequired: number;
  activityMet: boolean;
  wordsExposed: number;
  totalWords: number;
  exposureMet: boolean;
  missingRequirements: string[];
}

export class GameCompletionService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Check if a game is complete based on dual criteria
   */
  async checkGameCompletion(
    assignmentId: string,
    studentId: string,
    gameId: string
  ): Promise<GameCompletionStatus> {
    try {
      // 1. Get assignment details
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select('vocabulary_count, game_config')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) throw assignmentError;

      const totalWords = assignment?.vocabulary_count || 0;
      const gameRequirements = assignment?.game_config?.gameConfig?.gameRequirements || {};
      const minSessionsRequired = gameRequirements[gameId]?.minSessions || 0;

      // 2. Get sessions played for this game
      const { data: sessions, error: sessionsError } = await this.supabase
        .from('enhanced_game_sessions')
        .select('id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_type', gameId);

      if (sessionsError) throw sessionsError;

      const sessionsPlayed = sessions?.length || 0;

      // 3. Get words exposed (assignment-level, not game-level)
      const { data: exposures, error: exposuresError } = await this.supabase
        .from('assignment_word_exposure')
        .select('centralized_vocabulary_id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (exposuresError) throw exposuresError;

      const wordsExposed = exposures?.length || 0;

      // 4. Check both criteria
      const activityMet = sessionsPlayed >= minSessionsRequired;
      const exposureMet = wordsExposed >= totalWords;
      const isComplete = activityMet && exposureMet;

      // 5. Build missing requirements list
      const missingRequirements: string[] = [];
      
      if (!activityMet) {
        const remaining = minSessionsRequired - sessionsPlayed;
        missingRequirements.push(
          `Play ${remaining} more session${remaining > 1 ? 's' : ''} (${sessionsPlayed}/${minSessionsRequired} played)`
        );
      }

      if (!exposureMet) {
        const remaining = totalWords - wordsExposed;
        missingRequirements.push(
          `Practice ${remaining} more word${remaining > 1 ? 's' : ''} (${wordsExposed}/${totalWords} exposed)`
        );
      }

      return {
        gameId,
        isComplete,
        sessionsPlayed,
        minSessionsRequired,
        activityMet,
        wordsExposed,
        totalWords,
        exposureMet,
        missingRequirements
      };
    } catch (error) {
      console.error('Error checking game completion:', error);
      throw error;
    }
  }

  /**
   * Update game completion status in database
   */
  async updateGameCompletionStatus(
    assignmentId: string,
    studentId: string,
    gameId: string
  ): Promise<void> {
    try {
      // Check completion status
      const status = await this.checkGameCompletion(assignmentId, studentId, gameId);

      // Get the most recent session data for score/accuracy
      const { data: latestSession } = await this.supabase
        .from('enhanced_game_sessions')
        .select('final_score, max_score_possible, accuracy_percentage, duration_seconds')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_type', gameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Update assignment_game_progress table
      const { error } = await this.supabase
        .from('assignment_game_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          game_id: gameId,
          status: status.isComplete ? 'completed' : 'in_progress',
          score: latestSession?.final_score || 0,
          max_score: latestSession?.max_score_possible || 100,
          accuracy: latestSession?.accuracy_percentage || 0,
          time_spent: latestSession?.duration_seconds || 0,
          words_completed: status.wordsExposed,
          total_words: status.totalWords,
          completed_at: status.isComplete ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'assignment_id,student_id,game_id'
        });

      if (error) throw error;

      console.log(`✅ [GAME COMPLETION] ${gameId} status updated:`, {
        assignmentId,
        studentId,
        isComplete: status.isComplete,
        activityMet: status.activityMet,
        exposureMet: status.exposureMet,
        score: latestSession?.final_score,
        accuracy: latestSession?.accuracy_percentage
      });
    } catch (error) {
      console.error('Error updating game completion status:', error);
      throw error;
    }
  }

  /**
   * Check completion for all games in an assignment
   */
  async checkAllGamesCompletion(
    assignmentId: string,
    studentId: string
  ): Promise<GameCompletionStatus[]> {
    try {
      // Get all games in the assignment
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select('game_config')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) throw assignmentError;

      const selectedGames = assignment?.game_config?.gameConfig?.selectedGames || [];

      // Check completion for each game
      const completionStatuses = await Promise.all(
        selectedGames.map((gameId: string) =>
          this.checkGameCompletion(assignmentId, studentId, gameId)
        )
      );

      return completionStatuses;
    } catch (error) {
      console.error('Error checking all games completion:', error);
      throw error;
    }
  }

  /**
   * Update completion status for all games in an assignment
   */
  async updateAllGamesCompletion(
    assignmentId: string,
    studentId: string
  ): Promise<void> {
    try {
      const statuses = await this.checkAllGamesCompletion(assignmentId, studentId);

      // Update each game's status
      await Promise.all(
        statuses.map(status =>
          this.updateGameCompletionStatus(assignmentId, studentId, status.gameId)
        )
      );

      console.log(`✅ [GAME COMPLETION] Updated all games for assignment ${assignmentId}`);
    } catch (error) {
      console.error('Error updating all games completion:', error);
      throw error;
    }
  }
}

