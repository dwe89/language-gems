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

  // 🔄 PHASE 1: Progressive Saving
  protected lastSaveTime: number = 0;
  protected autoSaveInterval: NodeJS.Timeout | null = null;
  protected readonly AUTOSAVE_INTERVAL_MS = 30000; // 30 seconds
  protected readonly MIN_SAVE_INTERVAL_MS = 5000; // Minimum 5 seconds between saves

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

      // 🔄 PHASE 1: Start auto-save interval
      this.startAutoSave();

      console.log(`✅ [PHASE 1] Game session started with auto-save: ${this.sessionId}`);
      return this.sessionId;

    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  /**
   * Update progress during gameplay
   * 🔄 PHASE 1: Now triggers smart progressive saving
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

      // 🔄 PHASE 1: Smart progressive saving
      // Save immediately on significant events, otherwise rely on auto-save
      const isSignificantEvent =
        progressData.wordsCorrect !== undefined || // Word completed
        progressData.score !== undefined; // Score changed

      if (isSignificantEvent) {
        await this.saveProgressIfReady();
      }

    } catch (error) {
      console.error('Error updating progress:', error);
      // Don't throw to avoid breaking gameplay
    }
  }

  /**
   * 🔄 PHASE 1: Save progress if enough time has passed since last save
   */
  private async saveProgressIfReady(): Promise<void> {
    const now = Date.now();
    const timeSinceLastSave = now - this.lastSaveTime;

    // Prevent too-frequent saves (minimum 5 seconds between saves)
    if (timeSinceLastSave < this.MIN_SAVE_INTERVAL_MS) {
      console.log(`⏭️ [PHASE 1] Skipping save (${timeSinceLastSave}ms since last save)`);
      return;
    }

    await this.saveProgress();
  }

  /**
   * 🔄 PHASE 1: Actually save progress to database
   */
  private async saveProgress(): Promise<void> {
    try {
      console.log('💾 [PHASE 1] Saving progress:', {
        wordsAttempted: this.currentProgress.wordsAttempted,
        wordsCorrect: this.currentProgress.wordsCorrect,
        score: this.currentProgress.score,
        timeSpent: this.currentProgress.timeSpent
      });

      await this.assignmentService.recordProgress(this.currentProgress);
      this.lastSaveTime = Date.now();

      console.log('✅ [PHASE 1] Progress saved successfully');
    } catch (error) {
      console.error('❌ [PHASE 1] Failed to save progress:', error);
      // Don't throw - we'll try again on next auto-save
    }
  }

  /**
   * 🔄 PHASE 1: Start automatic progress saving every 30 seconds
   */
  private startAutoSave(): void {
    // Clear any existing interval
    this.stopAutoSave();

    this.autoSaveInterval = setInterval(async () => {
      console.log('⏰ [PHASE 1] Auto-save triggered');
      await this.saveProgress();
    }, this.AUTOSAVE_INTERVAL_MS);

    console.log('✅ [PHASE 1] Auto-save started (every 30 seconds)');
  }

  /**
   * 🔄 PHASE 1: Stop automatic progress saving
   */
  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('🛑 [PHASE 1] Auto-save stopped');
    }
  }

  /**
   * Complete the session and submit final progress
   * 🔄 PHASE 1: Stops auto-save and does final save
   */
  async completeSession(finalProgress: GameProgressData): Promise<void> {
    try {
      // 🔄 PHASE 1: Stop auto-save before final save
      this.stopAutoSave();

      this.currentProgress = {
        ...this.currentProgress,
        ...finalProgress,
        completedAt: new Date(),
        status: 'completed',
        accuracy: this.calculateAccuracy(),
        timeSpent: Date.now() - this.currentProgress.startedAt.getTime()
      };

      // Record final progress (force save regardless of timing)
      await this.assignmentService.recordProgress(this.currentProgress);

      console.log(`✅ [PHASE 1] Session completed: ${this.sessionId}`, {
        score: this.currentProgress.score,
        accuracy: this.currentProgress.accuracy,
        wordsLearned: this.currentProgress.wordsLearned,
        totalSaves: 'auto-save + final'
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
      // 🔄 PHASE 1: Ensure auto-save is stopped
      this.stopAutoSave();

      await this.assignmentService.updateAssignmentStatus(
        this.assignment.assignmentId,
        this.userId,
        'completed'
      );

      console.log(`✅ [PHASE 1] Assignment completed: ${this.assignment.assignmentId}`);

    } catch (error) {
      console.error('Error completing assignment:', error);
      throw error;
    }
  }

  /**
   * 🔄 PHASE 1: Cleanup method to stop auto-save when component unmounts
   */
  cleanup(): void {
    this.stopAutoSave();
    console.log('🧹 [PHASE 1] BaseGameAssignment cleanup complete');
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
