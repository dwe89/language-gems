/**
 * Mastery Score Service
 *
 * Calculates quality/mastery metrics separate from completion progress.
 * This implements the THREE-COMPONENT FEEDBACK MODEL:
 * - Progress Bar = Simple word exposure count (quantity)
 * - Mastery Score = Quality of learning with actionable feedback
 *
 * Formula: (70% Accuracy) + (20% Activity/Compliance) + (10% Completion)
 *
 * 1. Accuracy (70%): Quality of answers - how well student knows the material
 * 2. Activity/Compliance (20%): Meeting teacher-set minimum session requirements
 * 3. Completion (10%): Finishing the assignment (100% exposure)
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface MasteryScoreBreakdown {
  totalScore: number; // 0-100
  accuracyScore: number; // 0-70 points
  activityScore: number; // 0-20 points (compliance with teacher requirements)
  completionBonus: number; // 0-10 points

  // Supporting metrics
  overallAccuracy: number; // 0-100%
  isCompleted: boolean;
  sessionsCount: number;
  wordsAttempted: number;
  wordsCorrect: number;

  // Activity/Compliance tracking
  requiredSessionsMet: number; // How many required games have been played
  totalRequiredGames: number; // How many games have minimum session requirements

  // Completion tracking
  exposedWords: number; // How many unique words have been seen
  totalWords: number; // Total words in assignment

  // Grade interpretation
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradeDescription: string;

  // Actionable feedback
  feedback: {
    accuracyFeedback: string;
    activityFeedback: string;
    completionFeedback: string;
    nextSteps: string[];
  };
}

export class MasteryScoreService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Calculate mastery score for a specific game within an assignment
   * Note: Game-level scores don't include activity/compliance (that's assignment-level only)
   */
  async calculateGameMasteryScore(
    assignmentId: string,
    studentId: string,
    gameId: string
  ): Promise<MasteryScoreBreakdown> {
    try {
      // Get assignment details for total words
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('vocabulary_count')
        .eq('id', assignmentId)
        .single();

      const totalWords = assignment?.vocabulary_count || 0;

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

      // Get exposure for this game (not available at game level, use 0)
      const exposedWords = 0;

      // Calculate score components (game-level doesn't have activity score)
      const accuracyScore = this.calculateAccuracyScore(overallAccuracy);
      const activityScore = 0; // Not applicable at game level
      const completionBonus = this.calculateCompletionBonus(isCompleted);

      const totalScore = accuracyScore + activityScore + completionBonus;
      const grade = this.getGrade(totalScore);

      return {
        totalScore: Math.round(totalScore),
        accuracyScore,
        activityScore,
        completionBonus,
        overallAccuracy: Math.round(overallAccuracy),
        isCompleted,
        sessionsCount,
        wordsAttempted,
        wordsCorrect,
        requiredSessionsMet: 0,
        totalRequiredGames: 0,
        exposedWords,
        totalWords,
        grade: grade.letter,
        gradeDescription: grade.description,
        feedback: {
          accuracyFeedback: '',
          activityFeedback: '',
          completionFeedback: '',
          nextSteps: []
        }
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
      // Get assignment details
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select('vocabulary_count, game_config')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) throw assignmentError;

      const totalWords = assignment?.vocabulary_count || 0;
      // Fix: gameRequirements is nested under gameConfig
      const gameRequirements = assignment?.game_config?.gameConfig?.gameRequirements || {};

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

      // Get exposure progress
      const { data: exposures } = await this.supabase
        .from('assignment_word_exposure')
        .select('centralized_vocabulary_id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      const exposedWords = exposures?.length || 0;
      const isCompleted = exposedWords >= totalWords;

      // Calculate activity/compliance score
      const { activityScore, requiredSessionsMet, totalRequiredGames } =
        await this.calculateActivityScore(assignmentId, studentId, gameRequirements);

      // Calculate score components
      const accuracyScore = this.calculateAccuracyScore(overallAccuracy);
      const completionBonus = this.calculateCompletionBonus(isCompleted);

      const totalScore = accuracyScore + activityScore + completionBonus;
      const grade = this.getGrade(totalScore);

      // Generate actionable feedback
      const feedback = this.generateFeedback({
        accuracyScore,
        overallAccuracy,
        activityScore,
        requiredSessionsMet,
        totalRequiredGames,
        completionBonus,
        isCompleted,
        exposedWords,
        totalWords,
        gameRequirements,
        assignmentId,
        studentId
      });

      return {
        totalScore: Math.round(totalScore),
        accuracyScore,
        activityScore,
        completionBonus,
        overallAccuracy: Math.round(overallAccuracy),
        isCompleted,
        sessionsCount,
        wordsAttempted,
        wordsCorrect,
        requiredSessionsMet,
        totalRequiredGames,
        exposedWords,
        totalWords,
        grade: grade.letter,
        gradeDescription: grade.description,
        feedback
      };
    } catch (error) {
      console.error('Error calculating assignment mastery score:', error);
      throw error;
    }
  }

  /**
   * Calculate accuracy score (0-70 points)
   * This is the main component of mastery - quality of learning
   */
  private calculateAccuracyScore(accuracy: number): number {
    // Linear scaling: 0% accuracy = 0 points, 100% accuracy = 70 points
    return (accuracy / 100) * 70;
  }

  /**
   * Calculate activity/compliance score (0-20 points)
   * Based on meeting teacher-set minimum session requirements
   */
  private async calculateActivityScore(
    assignmentId: string,
    studentId: string,
    gameRequirements: Record<string, { minSessions: number }>
  ): Promise<{ activityScore: number; requiredSessionsMet: number; totalRequiredGames: number }> {
    // Get all games with requirements
    const requiredGames = Object.entries(gameRequirements).filter(
      ([_, req]) => req.minSessions > 0
    );

    if (requiredGames.length === 0) {
      // No requirements set - award full points
      return { activityScore: 20, requiredSessionsMet: 0, totalRequiredGames: 0 };
    }

    // Check how many required games have been completed
    let requiredSessionsMet = 0;

    for (const [gameId, requirement] of requiredGames) {
      const { data: sessions } = await this.supabase
        .from('enhanced_game_sessions')
        .select('id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_type', gameId);

      const sessionsPlayed = sessions?.length || 0;
      if (sessionsPlayed >= requirement.minSessions) {
        requiredSessionsMet++;
      }
    }

    // Calculate score: proportional to requirements met
    const activityScore = (requiredSessionsMet / requiredGames.length) * 20;

    return {
      activityScore,
      requiredSessionsMet,
      totalRequiredGames: requiredGames.length
    };
  }

  /**
   * Calculate completion bonus (0-10 points)
   * Awarded only when assignment is fully completed (100% exposure)
   */
  private calculateCompletionBonus(isCompleted: boolean): number {
    return isCompleted ? 10 : 0;
  }

  /**
   * Generate actionable feedback based on score components
   */
  private generateFeedback(params: {
    accuracyScore: number;
    overallAccuracy: number;
    activityScore: number;
    requiredSessionsMet: number;
    totalRequiredGames: number;
    completionBonus: number;
    isCompleted: boolean;
    exposedWords: number;
    totalWords: number;
    gameRequirements: Record<string, { minSessions: number }>;
    assignmentId: string;
    studentId: string;
  }): {
    accuracyFeedback: string;
    activityFeedback: string;
    completionFeedback: string;
    nextSteps: string[];
  } {
    const nextSteps: string[] = [];

    // 1. Accuracy Feedback (70% component)
    let accuracyFeedback = '';
    if (params.overallAccuracy >= 90) {
      accuracyFeedback = `Excellent accuracy! You're getting ${Math.round(params.overallAccuracy)}% of questions correct.`;
    } else if (params.overallAccuracy >= 75) {
      accuracyFeedback = `Good accuracy at ${Math.round(params.overallAccuracy)}%. Keep practicing to reach 90%+.`;
      nextSteps.push('Review words you got wrong to improve accuracy');
    } else if (params.overallAccuracy >= 60) {
      accuracyFeedback = `Your accuracy is ${Math.round(params.overallAccuracy)}%. You're missing too many questions.`;
      nextSteps.push('Focus on the words you got wrong multiple times');
      nextSteps.push('Use VocabMaster to practice low-mastery words');
    } else {
      accuracyFeedback = `Your accuracy is ${Math.round(params.overallAccuracy)}%. This needs significant improvement.`;
      nextSteps.push('Review the vocabulary list carefully before playing');
      nextSteps.push('Use VocabMaster flashcards to learn the words first');
    }

    // 2. Activity/Compliance Feedback (20% component)
    let activityFeedback = '';
    if (params.totalRequiredGames === 0) {
      activityFeedback = 'No specific game requirements set by your teacher.';
    } else if (params.requiredSessionsMet === params.totalRequiredGames) {
      activityFeedback = `Perfect! You've met all ${params.totalRequiredGames} required game sessions.`;
    } else {
      const remaining = params.totalRequiredGames - params.requiredSessionsMet;
      activityFeedback = `Activity score: ${params.requiredSessionsMet}/${params.totalRequiredGames} required games completed. You're missing ${remaining} required session${remaining > 1 ? 's' : ''}.`;

      // Find which games still need to be played
      // TODO: Add specific game names in next steps
      nextSteps.push(`ACTION REQUIRED: Complete ${remaining} more required game session${remaining > 1 ? 's' : ''} to earn full activity points`);
    }

    // 3. Completion Feedback (10% component)
    let completionFeedback = '';
    if (params.isCompleted) {
      completionFeedback = 'Assignment complete! You earned the 10% completion bonus.';
    } else {
      const remaining = params.totalWords - params.exposedWords;
      const percentage = params.totalWords > 0
        ? Math.round((params.exposedWords / params.totalWords) * 100)
        : 0;

      completionFeedback = `Assignment ${percentage}% complete. You still need to practice ${remaining} more unique word${remaining > 1 ? 's' : ''} to earn the 10% completion bonus.`;
      nextSteps.push(`Practice ${remaining} more word${remaining > 1 ? 's' : ''} to complete the assignment`);
    }

    return {
      accuracyFeedback,
      activityFeedback,
      completionFeedback,
      nextSteps
    };
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

