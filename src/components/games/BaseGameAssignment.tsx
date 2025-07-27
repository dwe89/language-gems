// Base Game Assignment Component
// This provides a standardized foundation for all games to implement assignment mode

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import {
  UnifiedAssignment,
  VocabularyItem,
  GameProgressData,
  GameAssignmentInterface,
  GameSpecificConfig
} from '../../interfaces/UnifiedAssignmentInterface';
import { UnifiedAssignmentService } from '../../services/UnifiedAssignmentService';

export interface BaseGameAssignmentProps {
  assignmentId: string;
  studentId?: string;
  onAssignmentComplete?: (result: GameProgressData) => void;
  onBackToAssignments?: () => void;
}

export interface GameImplementationProps {
  assignment: UnifiedAssignment;
  vocabulary: VocabularyItem[];
  gameConfig: GameSpecificConfig;
  onProgressUpdate: (progress: Partial<GameProgressData>) => void;
  onGameComplete: (finalProgress: GameProgressData) => void;
  sessionId: string;
}

export abstract class BaseGameAssignment implements GameAssignmentInterface {
  protected assignment: UnifiedAssignment | null = null;
  protected vocabulary: VocabularyItem[] = [];
  protected sessionId: string = '';
  protected currentProgress: GameProgressData;
  protected assignmentService: UnifiedAssignmentService;

  constructor(protected supabase: any, protected userId: string) {
    this.assignmentService = new UnifiedAssignmentService(supabase);
    this.currentProgress = this.initializeProgress();
  }

  /**
   * Initialize the assignment
   */
  async initializeAssignment(assignment: UnifiedAssignment): Promise<void> {
    try {
      this.assignment = assignment;
      
      // Load vocabulary for the assignment
      this.vocabulary = await this.assignmentService.getAssignmentVocabulary(
        assignment.vocabularyConfig
      );

      if (this.vocabulary.length === 0) {
        throw new Error('No vocabulary found for assignment');
      }

      // Validate assignment compatibility
      if (!this.validateAssignment(assignment)) {
        throw new Error('Assignment not compatible with this game');
      }

      console.log(`Assignment initialized: ${assignment.title}`, {
        vocabularyCount: this.vocabulary.length,
        gameType: assignment.gameType
      });

    } catch (error) {
      console.error('Error initializing assignment:', error);
      throw error;
    }
  }

  /**
   * Start a new game session
   */
  async startSession(): Promise<string> {
    if (!this.assignment) {
      throw new Error('Assignment not initialized');
    }

    try {
      // Generate session ID
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Initialize progress
      this.currentProgress = {
        sessionId: this.sessionId,
        assignmentId: this.assignment.assignmentId,
        studentId: this.userId,
        gameType: this.assignment.gameType,
        score: 0,
        maxScore: this.calculateMaxScore(),
        accuracy: 0,
        timeSpent: 0,
        attempts: 0,
        wordsAttempted: 0,
        wordsCorrect: 0,
        wordsLearned: 0,
        currentStreak: 0,
        bestStreak: 0,
        wordProgress: [],
        gameMetrics: {},
        startedAt: new Date(),
        status: 'in_progress'
      };

      // Update assignment status to started
      await this.assignmentService.updateAssignmentStatus(
        this.assignment.assignmentId,
        this.userId,
        'in_progress'
      );

      console.log(`Game session started: ${this.sessionId}`);
      return this.sessionId;

    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  /**
   * Update progress during gameplay
   */
  async updateProgress(progressData: Partial<GameProgressData>): Promise<void> {
    try {
      // Merge with current progress
      this.currentProgress = {
        ...this.currentProgress,
        ...progressData,
        accuracy: this.calculateAccuracy(),
        timeSpent: Date.now() - this.currentProgress.startedAt.getTime()
      };

      // Record progress periodically (every 30 seconds or significant events)
      const shouldRecord = 
        progressData.wordsCorrect !== undefined ||
        progressData.score !== undefined ||
        (Date.now() - this.currentProgress.startedAt.getTime()) % 30000 < 1000;

      if (shouldRecord) {
        await this.assignmentService.recordProgress(this.currentProgress);
      }

    } catch (error) {
      console.error('Error updating progress:', error);
      // Don't throw to avoid breaking gameplay
    }
  }

  /**
   * Complete the session and submit final progress
   */
  async completeSession(finalProgress: GameProgressData): Promise<void> {
    try {
      this.currentProgress = {
        ...this.currentProgress,
        ...finalProgress,
        completedAt: new Date(),
        status: 'completed',
        accuracy: this.calculateAccuracy(),
        timeSpent: Date.now() - this.currentProgress.startedAt.getTime()
      };

      // Record final progress
      await this.assignmentService.recordProgress(this.currentProgress);

      console.log(`Session completed: ${this.sessionId}`, {
        score: this.currentProgress.score,
        accuracy: this.currentProgress.accuracy,
        wordsLearned: this.currentProgress.wordsLearned
      });

    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }

  /**
   * Complete the assignment
   */
  async completeAssignment(): Promise<void> {
    if (!this.assignment) return;

    try {
      await this.assignmentService.updateAssignmentStatus(
        this.assignment.assignmentId,
        this.userId,
        'completed'
      );

      console.log(`Assignment completed: ${this.assignment.assignmentId}`);

    } catch (error) {
      console.error('Error completing assignment:', error);
      throw error;
    }
  }

  /**
   * Get current progress
   */
  getCurrentProgress(): GameProgressData {
    return { ...this.currentProgress };
  }

  /**
   * Validate assignment compatibility (to be implemented by each game)
   */
  abstract validateAssignment(assignment: UnifiedAssignment): boolean;

  /**
   * Calculate maximum possible score (to be implemented by each game)
   */
  abstract calculateMaxScore(): number;

  /**
   * Record word-level progress
   */
  protected recordWordProgress(
    vocabularyId: string,
    word: string,
    translation: string,
    isCorrect: boolean,
    attempts: number = 1,
    responseTime: number = 0,
    hintsUsed: number = 0
  ): void {
    this.currentProgress.wordProgress.push({
      vocabularyId,
      word,
      translation,
      isCorrect,
      attempts,
      responseTime,
      hintsUsed,
      timestamp: new Date()
    });

    // Update overall stats
    this.currentProgress.wordsAttempted++;
    if (isCorrect) {
      this.currentProgress.wordsCorrect++;
      this.currentProgress.currentStreak++;
      this.currentProgress.bestStreak = Math.max(
        this.currentProgress.bestStreak,
        this.currentProgress.currentStreak
      );
    } else {
      this.currentProgress.currentStreak = 0;
    }

    this.currentProgress.attempts += attempts;
  }

  /**
   * Calculate accuracy percentage
   */
  private calculateAccuracy(): number {
    if (this.currentProgress.wordsAttempted === 0) return 0;
    return Math.round(
      (this.currentProgress.wordsCorrect / this.currentProgress.wordsAttempted) * 100
    );
  }

  /**
   * Initialize progress object
   */
  private initializeProgress(): GameProgressData {
    return {
      sessionId: '',
      assignmentId: '',
      studentId: this.userId,
      gameType: '',
      score: 0,
      maxScore: 0,
      accuracy: 0,
      timeSpent: 0,
      attempts: 0,
      wordsAttempted: 0,
      wordsCorrect: 0,
      wordsLearned: 0,
      currentStreak: 0,
      bestStreak: 0,
      wordProgress: [],
      gameMetrics: {},
      startedAt: new Date(),
      status: 'in_progress'
    };
  }
}

/**
 * React Hook for using the assignment system in games
 */
export function useGameAssignment(assignmentId: string) {
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<UnifiedAssignment | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignmentService] = useState(() => new UnifiedAssignmentService(supabaseBrowser));

  useEffect(() => {
    if (user && assignmentId) {
      loadAssignment();
    }
  }, [user, assignmentId]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load assignment
      const assignmentData = await assignmentService.getAssignment(assignmentId, user!.id);
      setAssignment(assignmentData);

      // Load vocabulary
      const vocabularyData = await assignmentService.getAssignmentVocabulary(
        assignmentData.vocabularyConfig
      );
      setVocabulary(vocabularyData);

    } catch (err: any) {
      console.error('Error loading assignment:', err);
      setError(err.message || 'Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const recordProgress = async (progressData: GameProgressData) => {
    try {
      await assignmentService.recordProgress(progressData);
    } catch (err) {
      console.error('Error recording progress:', err);
    }
  };

  const completeAssignment = async () => {
    if (!assignment || !user) return;
    
    try {
      await assignmentService.updateAssignmentStatus(
        assignment.assignmentId,
        user.id,
        'completed'
      );
    } catch (err) {
      console.error('Error completing assignment:', err);
    }
  };

  return {
    assignment,
    vocabulary,
    loading,
    error,
    recordProgress,
    completeAssignment,
    assignmentService
  };
}
