'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { GameCompletionService, GameCompletionStatus } from '@/services/assignments/GameCompletionService';
import GameCompletionModal from './GameCompletionModal';
import ExitGameModal from './ExitGameModal';

interface AssignmentGameCompletionWrapperProps {
    children: React.ReactNode;
    assignmentId: string | null;
    studentId: string | null;
    gameId: string;
    gameName: string;
    isAssignmentMode: boolean;
    onBackToAssignment?: () => void;
    checkInterval?: number; // How often to check completion (in correct words count)
}

/**
 * Wrapper component that handles game completion logic for assignments
 * Wraps any game component and adds completion/exit modals
 */
export default function AssignmentGameCompletionWrapper({
    children,
    assignmentId,
    studentId,
    gameId,
    gameName,
    isAssignmentMode,
    onBackToAssignment,
    checkInterval = 3, // Check every 3 correct words by default
}: AssignmentGameCompletionWrapperProps) {
    const router = useRouter();
    const [gameStatus, setGameStatus] = useState<GameCompletionStatus | null>(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [correctWordCount, setCorrectWordCount] = useState(0);
    const [lastCheckCount, setLastCheckCount] = useState(0);
    const [hasCompletedOnce, setHasCompletedOnce] = useState(false);

    // Check completion status
    const checkCompletion = useCallback(async () => {
        if (!assignmentId || !studentId || !isAssignmentMode) return;

        try {
            const supabase = createClient();
            const service = new GameCompletionService(supabase);
            const status = await service.updateGameCompletionStatus(assignmentId, studentId, gameId);
            setGameStatus(status);

            // Show completion modal if just completed for the first time
            if (status.isComplete && !hasCompletedOnce) {
                setShowCompletionModal(true);
                setHasCompletedOnce(true);
            }

            console.log('📊 [COMPLETION WRAPPER] Checked:', {
                isComplete: status.isComplete,
                progress: `${status.uniqueCorrectWords}/${status.wordsRequired}`,
                assignmentProgress: status.assignmentProgress
            });
        } catch (error) {
            console.error('Error checking completion:', error);
        }
    }, [assignmentId, studentId, gameId, isAssignmentMode, hasCompletedOnce]);

    // Initial check on mount
    useEffect(() => {
        if (isAssignmentMode && assignmentId && studentId) {
            checkCompletion();
        }
    }, [isAssignmentMode, assignmentId, studentId]);

    // Listen for word completion events
    useEffect(() => {
        if (!isAssignmentMode) return;

        const handleWordComplete = (event: CustomEvent) => {
            const { wasCorrect } = event.detail;
            if (wasCorrect) {
                setCorrectWordCount(prev => prev + 1);
            }
        };

        // Listen for custom event from games
        window.addEventListener('gameWordComplete' as any, handleWordComplete as any);
        return () => {
            window.removeEventListener('gameWordComplete' as any, handleWordComplete as any);
        };
    }, [isAssignmentMode]);

    // Check completion periodically based on correct word count
    useEffect(() => {
        if (correctWordCount > 0 && correctWordCount !== lastCheckCount) {
            if (correctWordCount % checkInterval === 0 || correctWordCount >= (gameStatus?.wordsRequired || 10)) {
                setLastCheckCount(correctWordCount);
                checkCompletion();
            }
        }
    }, [correctWordCount, lastCheckCount, checkInterval, checkCompletion, gameStatus?.wordsRequired]);

    // Handle back/exit button click
    const handleBackClick = () => {
        if (isAssignmentMode && gameStatus && !gameStatus.isComplete && gameStatus.uniqueCorrectWords > 0) {
            // Show exit confirmation if they have progress but haven't completed
            setShowExitModal(true);
        } else {
            handleConfirmExit();
        }
    };

    const handleConfirmExit = () => {
        setShowExitModal(false);
        if (onBackToAssignment) {
            onBackToAssignment();
        } else if (assignmentId) {
            router.push(`/student-dashboard/assignments/${assignmentId}`);
        }
    };

    const handleContinuePlaying = () => {
        setShowCompletionModal(false);
        setShowExitModal(false);
    };

    // Expose handleBackClick to child components
    const contextValue = {
        checkCompletion,
        handleBackClick,
        gameStatus,
        isComplete: gameStatus?.isComplete ?? false,
        progressPercentage: gameStatus?.progressPercentage ?? 0,
    };

    return (
        <>
            {/* Pass context to children via data attribute */}
            <div
                data-assignment-mode={isAssignmentMode}
                data-completion-ready="true"
            >
                {children}
            </div>

            {/* Completion Modal */}
            {showCompletionModal && gameStatus && (
                <GameCompletionModal
                    isOpen={showCompletionModal}
                    gameId={gameId}
                    gameName={gameName}
                    uniqueCorrectWords={gameStatus.uniqueCorrectWords}
                    wordsRequired={gameStatus.wordsRequired}
                    assignmentProgress={gameStatus.assignmentProgress}
                    isAssignmentComplete={gameStatus.isAssignmentComplete}
                    onGoBack={handleConfirmExit}
                    onContinue={handleContinuePlaying}
                />
            )}

            {/* Exit Modal */}
            {showExitModal && gameStatus && (
                <ExitGameModal
                    isOpen={showExitModal}
                    gameName={gameName}
                    currentProgress={gameStatus.progressPercentage}
                    wordsRequired={gameStatus.wordsRequired}
                    uniqueCorrectWords={gameStatus.uniqueCorrectWords}
                    onConfirmExit={handleConfirmExit}
                    onCancel={handleContinuePlaying}
                />
            )}
        </>
    );
}

/**
 * Hook to trigger word completion event from inside games
 */
export function useGameCompletionTrigger() {
    const triggerWordComplete = useCallback((wasCorrect: boolean, vocabularyId?: string) => {
        const event = new CustomEvent('gameWordComplete', {
            detail: { wasCorrect, vocabularyId }
        });
        window.dispatchEvent(event);
    }, []);

    return { triggerWordComplete };
}
