/**
 * Assignment Completion Service
 * 
 * Handles the logic for determining if an assignment is complete based on:
 * 1. Exposure Goal: All words have been exposed (100% vocabulary coverage)
 * 2. Activity Goal: All required games have minimum sessions met
 */

import { createBrowserClient } from '../../lib/supabase-client';
import { assignmentExposureService } from './AssignmentExposureService';

export interface AssignmentCompletionStatus {
  isComplete: boolean;
  exposureGoalMet: boolean;
  activityGoalMet: boolean;
  exposureProgress: {
    exposedWords: number;
    totalWords: number;
    percentage: number;
  };
  activityProgress: {
    requiredGames: Array<{
      gameId: string;
      gameName: string;
      required: number;
      completed: number;
      met: boolean;
    }>;
    allRequirementsMet: boolean;
  };
  missingRequirements: string[]; // Human-readable list of what's missing
}

class AssignmentCompletionService {
  private supabase = createBrowserClient();

  /**
   * Check if an assignment is complete for a student
   */
  async checkAssignmentCompletion(
    assignmentId: string,
    studentId: string
  ): Promise<AssignmentCompletionStatus> {
    try {
      // 1. Get assignment details
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select('vocabulary_count, game_config')
        .eq('id', assignmentId)
        .single();

      if (assignmentError || !assignment) {
        throw new Error('Assignment not found');
      }

      const vocabularyCount = assignment.vocabulary_count || 10;
      const gameRequirements = assignment.game_config?.gameRequirements || {};

      // 2. Check Exposure Goal (Condition 1)
      const exposureProgress = await assignmentExposureService.getAssignmentProgress(
        assignmentId,
        studentId
      );

      const exposureGoalMet = exposureProgress.exposedWords >= vocabularyCount;

      // 3. Check Activity Goal (Condition 2)
      const activityProgress = await this.checkActivityRequirements(
        assignmentId,
        studentId,
        gameRequirements
      );

      const activityGoalMet = activityProgress.allRequirementsMet;

      // 4. Determine overall completion
      const isComplete = exposureGoalMet && activityGoalMet;

      // 5. Build missing requirements list
      const missingRequirements: string[] = [];
      
      if (!exposureGoalMet) {
        const remaining = vocabularyCount - exposureProgress.exposedWords;
        missingRequirements.push(
          `Practice ${remaining} more word${remaining > 1 ? 's' : ''} (${exposureProgress.exposedWords}/${vocabularyCount} exposed)`
        );
      }

      activityProgress.requiredGames.forEach(game => {
        if (!game.met) {
          const remaining = game.required - game.completed;
          missingRequirements.push(
            `Play ${game.gameName} ${remaining} more time${remaining > 1 ? 's' : ''} (${game.completed}/${game.required} sessions)`
          );
        }
      });

      return {
        isComplete,
        exposureGoalMet,
        activityGoalMet,
        exposureProgress: {
          exposedWords: exposureProgress.exposedWords,
          totalWords: vocabularyCount,
          percentage: Math.round((exposureProgress.exposedWords / vocabularyCount) * 100)
        },
        activityProgress,
        missingRequirements
      };
    } catch (error) {
      console.error('Error checking assignment completion:', error);
      throw error;
    }
  }

  /**
   * Check if all required game sessions have been met
   */
  private async checkActivityRequirements(
    assignmentId: string,
    studentId: string,
    gameRequirements: { [gameId: string]: { minSessions: number } }
  ): Promise<{
    requiredGames: Array<{
      gameId: string;
      gameName: string;
      required: number;
      completed: number;
      met: boolean;
    }>;
    allRequirementsMet: boolean;
  }> {
    // If no requirements, activity goal is automatically met
    if (!gameRequirements || Object.keys(gameRequirements).length === 0) {
      return {
        requiredGames: [],
        allRequirementsMet: true
      };
    }

    // Get game session counts for this assignment
    const { data: sessionData, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('game_type')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .eq('session_mode', 'assignment');

    if (error) {
      console.error('Error fetching game sessions:', error);
      throw error;
    }

    // Count sessions per game
    const sessionCounts: { [gameId: string]: number } = {};
    sessionData?.forEach(session => {
      const gameId = session.game_type;
      sessionCounts[gameId] = (sessionCounts[gameId] || 0) + 1;
    });

    // Game name mapping
    const GAME_NAMES: { [key: string]: string } = {
      'noughts-and-crosses': 'Noughts & Crosses',
      'hangman': 'Hangman',
      'memory-game': 'Memory Match',
      'word-blast': 'Word Blast',
      'detective-listening': 'Detective Listening',
      'speed-builder': 'Speed Builder',
      'case-file-translator': 'Case File Translator',
      'sentence-towers': 'Sentence Towers',
      'lava-temple-word-restore': 'Lava Temple Word Restore',
      'vocab-master': 'Vocab Master',
      'word-towers': 'Word Towers'
    };

    // Check each required game
    const requiredGames = Object.entries(gameRequirements).map(([gameId, config]) => {
      const completed = sessionCounts[gameId] || 0;
      const required = config.minSessions;
      const met = completed >= required;

      return {
        gameId,
        gameName: GAME_NAMES[gameId] || gameId,
        required,
        completed,
        met
      };
    });

    const allRequirementsMet = requiredGames.every(game => game.met);

    return {
      requiredGames,
      allRequirementsMet
    };
  }

  /**
   * Get a simple boolean check for assignment completion
   */
  async isAssignmentComplete(
    assignmentId: string,
    studentId: string
  ): Promise<boolean> {
    const status = await this.checkAssignmentCompletion(assignmentId, studentId);
    return status.isComplete;
  }
}

export const assignmentCompletionService = new AssignmentCompletionService();

