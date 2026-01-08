'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_COMPLETION_THRESHOLDS } from '@/services/assignments/GameCompletionService';
import { createClient } from '@/utils/supabase/client';

interface UseGameEndConditionProps {
  gameId: string;
  isAssignmentMode: boolean;
  assignmentId?: string | null;
  studentId?: string | null;
  vocabularyCount?: number;
}

interface UseGameEndConditionReturn {
  threshold: number;
  correctWordsCount: number;
  setCorrectWordsCount: (count: number | ((prev: number) => number)) => void;
  incrementCorrectWords: () => void;
  isComplete: boolean;
  showCompletionModal: boolean;
  setShowCompletionModal: (show: boolean) => void;
  progressText: string;
  progressPercentage: number;
  markGameComplete: () => Promise<void>;
}

/**
 * Hook to manage game end conditions for assignment mode
 * Tracks correct words and triggers completion modal when threshold is met
 */
export function useGameEndCondition({
  gameId,
  isAssignmentMode,
  assignmentId,
  studentId,
  vocabularyCount = 50
}: UseGameEndConditionProps): UseGameEndConditionReturn {
  // Get threshold for this game (clamped to vocabulary count)
  const baseThreshold = GAME_COMPLETION_THRESHOLDS[gameId] || GAME_COMPLETION_THRESHOLDS['default'];
  const threshold = Math.min(baseThreshold, vocabularyCount);

  const [correctWordsCount, setCorrectWordsCount] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const hasShownModalRef = useRef(false);

  // Calculate if complete
  const isComplete = correctWordsCount >= threshold;
  const progressPercentage = Math.min(100, Math.round((correctWordsCount / threshold) * 100));
  const progressText = isAssignmentMode 
    ? `${correctWordsCount}/${threshold}` 
    : `${correctWordsCount} words`;

  // Increment helper
  const incrementCorrectWords = useCallback(() => {
    setCorrectWordsCount(prev => prev + 1);
  }, []);

  // Check for completion and show modal
  useEffect(() => {
    if (isAssignmentMode && isComplete && !hasShownModalRef.current) {
      hasShownModalRef.current = true;
      setShowCompletionModal(true);
      
      console.log(`🎉 [GAME END] ${gameId} completed! ${correctWordsCount}/${threshold} words`);
    }
  }, [isAssignmentMode, isComplete, correctWordsCount, threshold, gameId]);

  // Mark game as complete in database
  const markGameComplete = useCallback(async () => {
    if (!assignmentId || !studentId || !isAssignmentMode) return;

    try {
      const supabase = createClient();
      
      await supabase
        .from('assignment_game_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          game_id: gameId,
          status: 'completed',
          words_completed: correctWordsCount,
          total_words: threshold,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'assignment_id,student_id,game_id'
        });

      console.log(`✅ [GAME END] ${gameId} marked complete in database`);
    } catch (error) {
      console.error('Error marking game complete:', error);
    }
  }, [assignmentId, studentId, gameId, isAssignmentMode, correctWordsCount, threshold]);

  // Auto-mark complete when threshold reached
  useEffect(() => {
    if (isComplete && isAssignmentMode) {
      markGameComplete();
    }
  }, [isComplete, isAssignmentMode, markGameComplete]);

  return {
    threshold,
    correctWordsCount,
    setCorrectWordsCount,
    incrementCorrectWords,
    isComplete,
    showCompletionModal,
    setShowCompletionModal,
    progressText,
    progressPercentage,
    markGameComplete
  };
}
