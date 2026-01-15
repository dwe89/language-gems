'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GameCompletionService, GameCompletionStatus, AssignmentCompletionInfo } from '@/services/assignments/GameCompletionService';

interface UseAssignmentCompletionProps {
    assignmentId: string | null;
    studentId: string | null;
    gameId: string;
    enabled?: boolean;
}

interface UseAssignmentCompletionReturn {
    // Game-level completion
    gameStatus: GameCompletionStatus | null;
    isGameComplete: boolean;
    gameProgress: number;
    wordsRemaining: number;

    // Assignment-level completion
    assignmentInfo: AssignmentCompletionInfo | null;
    isAssignmentComplete: boolean;
    assignmentProgress: number;

    // Modal states
    showCompletionModal: boolean;
    setShowCompletionModal: (show: boolean) => void;
    showExitModal: boolean;
    setShowExitModal: (show: boolean) => void;

    // Actions
    checkCompletion: () => Promise<void>;
    refreshCompletion: () => Promise<void>;

    // Loading state
    isLoading: boolean;
    error: string | null;
}

export function useAssignmentCompletion({
    assignmentId,
    studentId,
    gameId,
    enabled = true
}: UseAssignmentCompletionProps): UseAssignmentCompletionReturn {
    const [gameStatus, setGameStatus] = useState<GameCompletionStatus | null>(null);
    const [assignmentInfo, setAssignmentInfo] = useState<AssignmentCompletionInfo | null>(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previouslyCompleted, setPreviouslyCompleted] = useState(false);

    const checkCompletion = useCallback(async () => {
        if (!assignmentId || !studentId || !enabled) return;

        try {
            setIsLoading(true);
            setError(null);

            const supabase = createClient();
            const service = new GameCompletionService(supabase);

            // Check game completion and update database
            const status = await service.updateGameCompletionStatus(assignmentId, studentId, gameId);
            setGameStatus(status);

            // Get assignment-level info
            const info = await service.getAssignmentCompletionInfo(assignmentId, studentId);
            setAssignmentInfo(info);

            // Show completion modal if just completed (wasn't complete before, is now)
            if (status.isComplete && !previouslyCompleted) {
                setShowCompletionModal(true);
                setPreviouslyCompleted(true);
            }

            console.log('📊 [COMPLETION CHECK] Updated:', {
                game: { isComplete: status.isComplete, progress: status.progressPercentage },
                assignment: { isComplete: info.isComplete, progress: info.progressPercentage }
            });

        } catch (err) {
            console.error('Error checking completion:', err);
            setError(err instanceof Error ? err.message : 'Failed to check completion');
        } finally {
            setIsLoading(false);
        }
    }, [assignmentId, studentId, gameId, enabled, previouslyCompleted]);

    const refreshCompletion = useCallback(async () => {
        await checkCompletion();
    }, [checkCompletion]);

    // Initial check on mount
    useEffect(() => {
        if (assignmentId && studentId && enabled) {
            // Initial check
            checkCompletion();
        }
    }, [assignmentId, studentId, enabled]); // Don't include checkCompletion to avoid loops

    // Derived values
    const isGameComplete = gameStatus?.isComplete ?? false;
    const gameProgress = gameStatus?.progressPercentage ?? 0;
    const wordsRemaining = gameStatus ? Math.max(0, gameStatus.wordsRequired - gameStatus.uniqueCorrectWords) : 0;
    const isAssignmentComplete = assignmentInfo?.isComplete ?? false;
    const assignmentProgress = assignmentInfo?.progressPercentage ?? 0;

    return {
        gameStatus,
        isGameComplete,
        gameProgress,
        wordsRemaining,
        assignmentInfo,
        isAssignmentComplete,
        assignmentProgress,
        showCompletionModal,
        setShowCompletionModal,
        showExitModal,
        setShowExitModal,
        checkCompletion,
        refreshCompletion,
        isLoading,
        error
    };
}

/**
 * Hook to track win conditions for intro modal
 */
export function useAssignmentWinConditions(assignmentId: string | null) {
    const [winConditions, setWinConditions] = useState<{
        perGameThresholds: Array<{ gameId: string; gameName: string; wordsRequired: number }>;
        assignmentThreshold: { wordsRequired: number; totalWords: number; percentRequired: number };
        tips: string[];
        isGrammarAssignment?: boolean;
        grammarSteps?: Array<{ step: string; label: string; description: string }>;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!assignmentId) return;

        const fetchWinConditions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/assignments/${assignmentId}/win-conditions`);
                const data = await response.json();

                if (data.success) {
                    setWinConditions({
                        perGameThresholds: data.perGameThresholds,
                        assignmentThreshold: data.assignmentThreshold,
                        tips: data.tips,
                        isGrammarAssignment: data.isGrammarAssignment,
                        grammarSteps: data.grammarSteps
                    });
                } else {
                    throw new Error(data.error);
                }
            } catch (err) {
                console.error('Error fetching win conditions:', err);
                setError(err instanceof Error ? err.message : 'Failed to load win conditions');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWinConditions();
    }, [assignmentId]);

    return { winConditions, isLoading, error };
}
