'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import ImprovedWordScrambleGame from './ImprovedWordScrambleGame';
import { UnifiedVocabularyItem } from '../../../../hooks/useUnifiedVocabulary';

interface WordScrambleFreePlayWrapperProps {
  vocabulary: UnifiedVocabularyItem[];
  userId?: string;
  language?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  config?: any;
  theme?: string;
  onBackToMenu: () => void;
  onGameComplete?: (result: any) => void;
  onOpenSettings?: () => void;
  isAssignmentMode?: boolean;
  assignmentId?: string;
  gameSessionId?: string | null; // Accept game session ID from parent
  // Theme selector props for assignment mode
  assignmentTheme?: string;
  onAssignmentThemeChange?: (theme: string) => void;
  showAssignmentThemeSelector?: boolean;
  onToggleAssignmentThemeSelector?: () => void;
  onThemeChange?: (theme: string) => void;
}

export default function WordScrambleFreePlayWrapper({
  vocabulary,
  userId,
  language = 'es',
  difficulty = 'medium',
  config,
  theme,
  onBackToMenu,
  onGameComplete,
  onOpenSettings,
  isAssignmentMode,
  assignmentId,
  gameSessionId: parentGameSessionId, // Receive from parent
  assignmentTheme,
  onAssignmentThemeChange,
  showAssignmentThemeSelector,
  onToggleAssignmentThemeSelector,
  onThemeChange
}: WordScrambleFreePlayWrapperProps) {
  const { user } = useAuth();
  const [localGameSessionId, setLocalGameSessionId] = useState<string | null>(null);
  const [sessionService] = useState(() => new EnhancedGameSessionService());
  const [gameKey, setGameKey] = useState(0); // Key to force component remount on game restart

  // Use parent session ID if provided (assignment mode), otherwise create local session (free play)
  const gameSessionId = parentGameSessionId || localGameSessionId;

  // Initialize game session for free play mode (only if no parent session ID)
  useEffect(() => {
    if (!parentGameSessionId && (userId || user?.id) && vocabulary.length > 0 && !localGameSessionId) {
      initializeGameSession();
    }
  }, [parentGameSessionId, userId, user?.id, vocabulary.length, localGameSessionId]);

  const initializeGameSession = async () => {
    try {
      const sessionId = await sessionService.startGameSession({
        student_id: userId || user?.id || '',
        assignment_id: isAssignmentMode ? assignmentId : undefined,
        game_type: 'word-scramble',
        session_mode: isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: vocabulary.length * 100, // Estimate max score
        session_data: {
          vocabularyCount: vocabulary.length,
          language,
          difficulty,
          gameMode: 'free_play'
        }
      });

      setLocalGameSessionId(sessionId);
      console.log(`🔮 [FREE PLAY] Word Scramble game session started:`, sessionId);
    } catch (error) {
      console.error(`🔮 [FREE PLAY] Failed to start Word Scramble game session:`, error);
    }
  };

  const handleGameComplete = async (result: any) => {
    // End the game session
    if (gameSessionId && sessionService) {
      try {
        await sessionService.endGameSession(gameSessionId, {
          student_id: userId || user?.id || '',
          assignment_id: isAssignmentMode ? assignmentId : undefined,
          game_type: 'word-scramble',
          session_mode: isAssignmentMode ? 'assignment' : 'free_play',
          final_score: result.score || 0,
          accuracy_percentage: result.stats?.wordsCompleted ?
            (result.stats.wordsCompleted / (result.stats.wordsCompleted + result.stats.hintsUsed)) * 100 : 0,
          completion_percentage: 100,
          words_attempted: result.stats?.wordsCompleted || 0,
          words_correct: result.stats?.wordsCompleted || 0,
          unique_words_practiced: result.stats?.wordsCompleted || 0,
          duration_seconds: Math.floor((result.stats?.timeElapsed || 0) / 1000),
          session_data: {
            finalStats: result.stats,
            gameResult: result
          }
        });

        console.log(`🔮 [${isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Word Scramble game session ended`);
      } catch (error) {
        console.error(`🔮 [${isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Failed to end Word Scramble game session:`, error);
      }
    }

    // Increment game key to force component remount for clean state reset
    setGameKey(prev => prev + 1);

    // Call the original completion handler
    onGameComplete(result);
  };

  // Transform vocabulary to the format expected by the game
  const gameVocabulary = vocabulary.map(item => ({
    id: item.id,
    word: item.word,
    translation: item.translation,
    category: item.category,
    subcategory: item.subcategory,
    language: item.language,
    part_of_speech: item.part_of_speech,
    audio_url: item.audio_url,
    isCustomVocabulary: (item as any).isCustomVocabulary ?? false // ✅ Preserve custom vocab flag
  }));

  return (
    <ImprovedWordScrambleGame
      key={gameKey}
      vocabulary={gameVocabulary}
      isAssignmentMode={isAssignmentMode}
      userId={userId || user?.id}
      gameSessionId={gameSessionId || undefined}
      language={language}
      difficulty={difficulty}
      onBackToMenu={onBackToMenu}
      onGameComplete={handleGameComplete}
      onOpenSettings={onOpenSettings}
      currentTheme={theme}
      onThemeChange={onThemeChange}
    />
  );
}
