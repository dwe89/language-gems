/**
 * Mastery Score Service
 * 
 * Calculates quality/mastery metrics separate from completion progress.
 * This implements the HYBRID MODEL:
 * - Progress Bar = Simple word practice count (quantity)
 * - Mastery Score = Quality of learning (accuracy + completion + effort)
 * 
 * Formula: (70% Accuracy) + (20% Completion Bonus) + (10% Effort Bonus)
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface MasteryScoreBreakdown {
  totalScore: number; // 0-100
  accuracyScore: number; // 0-70 points
  completionBonus: number; // 0-20 points
  effortBonus: number; // 0-10 points
  
  // Supporting metrics
  overallAccuracy: number; // 0-100%
  isCompleted: boolean;
  sessionsCount: number;
  wordsAttempted: number;
  wordsCorrect: number;
  
  // Grade interpretation
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradeDescription: string;
}

export class MasteryScoreService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Calculate mastery score for a specific game within an assignment
   */
  async calculateGameMasteryScore(
    assignmentId: string,
    studentId: string,
    gameId: string
  ): Promise<MasteryScoreBreakdown> {
    try {
      // Get all sessions for this game
      const { data: sessions, error } = await this.supabase
        .from('enhanced_game_sessions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_type', gameId);

      if (error) throw error;

      // Calculate metrics
      const sessionsCount = sessions?.length || 0;
      const wordsAttempted = sessions?.reduce((sum, s) => sum + (s.words_attempted || 0), 0) || 0;
      const wordsCorrect = sessions?.reduce((sum, s) => sum + (s.words_correct || 0), 0) || 0;
      const overallAccuracy = wordsAttempted > 0 ? (wordsCorrect / wordsAttempted) * 100 : 0;

      // Check completion status
      const { data: gameProgress } = await this.supabase
        .from('assignment_game_progress')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_id', gameId)
        .maybeSingle();

      const isCompleted = gameProgress?.status === 'completed' || gameProgress?.completed === true;

      // Calculate score components
      const accuracyScore = this.calculateAccuracyScore(overallAccuracy);
      const completionBonus = this.calculateCompletionBonus(isCompleted);
      const effortBonus = this.calculateEffortBonus(sessionsCount);

      const totalScore = accuracyScore + completionBonus + effortBonus;
      const grade = this.getGrade(totalScore);

      return {
        totalScore: Math.round(totalScore),
        accuracyScore,
        completionBonus,
        effortBonus,
        overallAccuracy: Math.round(overallAccuracy),
        isCompleted,
        sessionsCount,
        wordsAttempted,
        wordsCorrect,
        grade: grade.letter,
        gradeDescription: grade.description
      };
    } catch (error) {
      console.error('Error calculating mastery score:', error);
      throw error;
    }
  }

  /**
   * Calculate mastery score for entire assignment (all games combined)
   */
  async calculateAssignmentMasteryScore(
    assignmentId: string,
    studentId: string
  ): Promise<MasteryScoreBreakdown> {
    try {
      // Get all sessions for this assignment
      const { data: sessions, error } = await this.supabase
        .from('enhanced_game_sessions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (error) throw error;

      // Calculate metrics across all games
      const sessionsCount = sessions?.length || 0;
      const wordsAttempted = sessions?.reduce((sum, s) => sum + (s.words_attempted || 0), 0) || 0;
      const wordsCorrect = sessions?.reduce((sum, s) => sum + (s.words_correct || 0), 0) || 0;
      const overallAccuracy = wordsAttempted > 0 ? (wordsCorrect / wordsAttempted) * 100 : 0;

      // Check overall completion status
      const { data: assignmentProgress } = await this.supabase
        .from('enhanced_assignment_progress')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .maybeSingle();

      const isCompleted = assignmentProgress?.status === 'completed';

      // Calculate score components
      const accuracyScore = this.calculateAccuracyScore(overallAccuracy);
      const completionBonus = this.calculateCompletionBonus(isCompleted);
      const effortBonus = this.calculateEffortBonus(sessionsCount);

      const totalScore = accuracyScore + completionBonus + effortBonus;
      const grade = this.getGrade(totalScore);

      return {
        totalScore: Math.round(totalScore),
        accuracyScore,
        completionBonus,
        effortBonus,
        overallAccuracy: Math.round(overallAccuracy),
        isCompleted,
        sessionsCount,
        wordsAttempted,
        wordsCorrect,
        grade: grade.letter,
        gradeDescription: grade.description
      };
    } catch (error) {
      console.error('Error calculating assignment mastery score:', error);
      throw error;
    }
  }

  /**
   * Calculate accuracy score (0-70 points)
   * This is the main component of mastery
   */
  private calculateAccuracyScore(accuracy: number): number {
    // Linear scaling: 0% accuracy = 0 points, 100% accuracy = 70 points
    return (accuracy / 100) * 70;
  }

  /**
   * Calculate completion bonus (0-20 points)
   * Awarded only when assignment is fully completed
   */
  private calculateCompletionBonus(isCompleted: boolean): number {
    return isCompleted ? 20 : 0;
  }

  /**
   * Calculate effort bonus (0-10 points)
   * Rewards sustained engagement through multiple sessions
   */
  private calculateEffortBonus(sessionsCount: number): number {
    // Award points for multiple sessions (up to 10 sessions = max 10 points)
    // 1 session = 1 point, 10+ sessions = 10 points
    return Math.min(sessionsCount, 10);
  }

  /**
   * Convert numerical score to letter grade
   */
  private getGrade(score: number): { letter: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'; description: string } {
    if (score >= 97) return { letter: 'A+', description: 'Outstanding mastery' };
    if (score >= 90) return { letter: 'A', description: 'Excellent mastery' };
    if (score >= 80) return { letter: 'B', description: 'Good understanding' };
    if (score >= 70) return { letter: 'C', description: 'Satisfactory progress' };
    if (score >= 60) return { letter: 'D', description: 'Needs improvement' };
    return { letter: 'F', description: 'Requires significant practice' };
  }

  /**
   * Get mastery score interpretation for display
   */
  getMasteryInterpretation(score: number): {
    color: string;
    icon: string;
    message: string;
  } {
    if (score >= 90) {
      return {
        color: 'text-green-600',
        icon: '🌟',
        message: 'Excellent work! You\'ve mastered this material.'
      };
    } else if (score >= 80) {
      return {
        color: 'text-blue-600',
        icon: '👍',
        message: 'Great job! You have a solid understanding.'
      };
    } else if (score >= 70) {
      return {
        color: 'text-yellow-600',
        icon: '📚',
        message: 'Good progress. Keep practicing to improve.'
      };
    } else if (score >= 60) {
      return {
        color: 'text-orange-600',
        icon: '💪',
        message: 'You\'re making progress. Focus on accuracy.'
      };
    } else {
      return {
        color: 'text-red-600',
        icon: '🎯',
        message: 'Keep practicing! Review the material and try again.'
      };
    }
  }

  /**
   * Calculate estimated time to improve mastery score
   */
  estimateTimeToImprove(
    currentScore: number,
    targetScore: number,
    currentAccuracy: number
  ): {
    estimatedMinutes: number;
    recommendedActions: string[];
  } {
    const scoreGap = targetScore - currentScore;
    
    // Most improvement comes from accuracy (70% of score)
    const accuracyNeeded = (scoreGap / 70) * 100; // How much accuracy improvement needed
    const wordsNeeded = Math.ceil(accuracyNeeded * 5); // Rough estimate: 5 words per 1% accuracy improvement
    const estimatedMinutes = Math.ceil((wordsNeeded * 8) / 60); // 8 seconds per word

    const recommendations: string[] = [];
    
    if (currentAccuracy < 70) {
      recommendations.push('Focus on understanding each word before answering');
      recommendations.push('Use hints when available to learn correct answers');
    }
    
    if (currentAccuracy < 85) {
      recommendations.push('Review words you got wrong in previous sessions');
      recommendations.push('Try different games to reinforce learning');
    }
    
    recommendations.push(`Practice approximately ${wordsNeeded} more words`);
    recommendations.push(`Estimated time: ${estimatedMinutes} minutes`);

    return {
      estimatedMinutes,
      recommendedActions: recommendations
    };
  }
}

