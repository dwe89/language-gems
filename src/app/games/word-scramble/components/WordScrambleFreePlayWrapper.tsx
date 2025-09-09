'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import ImprovedWordScrambleGame from './ImprovedWordScrambleGame';
import { UnifiedVocabularyItem } from '../../../../hooks/useUnifiedVocabulary';

interface WordScrambleFreePlayWrapperProps {
  vocabulary: UnifiedVocabularyItem[];
  userId?: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onBackToMenu: () => void;
  onGameComplete: (result: any) => void;
  onOpenSettings?: () => void;
}

export default function WordScrambleFreePlayWrapper({
  vocabulary,
  userId,
  language,
  difficulty,
  onBackToMenu,
  onGameComplete,
  onOpenSettings
}: WordScrambleFreePlayWrapperProps) {
  const { user } = useAuth();
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [sessionService] = useState(() => new EnhancedGameSessionService());

  // Initialize game session for free play mode
  useEffect(() => {
    if ((userId || user?.id) && vocabulary.length > 0 && !gameSessionId) {
      initializeGameSession();
    }
  }, [userId, user?.id, vocabulary.length, gameSessionId]);

  const initializeGameSession = async () => {
    try {
      const sessionId = await sessionService.startGameSession({
        student_id: userId || user?.id || '',
        game_type: 'word-scramble',
        session_mode: 'free_play',
        max_score_possible: vocabulary.length * 100, // Estimate max score
        session_data: {
          vocabularyCount: vocabulary.length,
          language,
          difficulty,
          gameMode: 'free_play'
        }
      });

      setGameSessionId(sessionId);
      console.log('🔮 [FREE PLAY] Word Scramble game session started:', sessionId);
    } catch (error) {
      console.error('🔮 [FREE PLAY] Failed to start Word Scramble game session:', error);
    }
  };

  const handleGameComplete = async (result: any) => {
    // End the game session
    if (gameSessionId && sessionService) {
      try {
        await sessionService.endGameSession(gameSessionId, {
          student_id: userId || user?.id || '',
          game_type: 'word-scramble',
          session_mode: 'free_play',
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

        console.log('🔮 [FREE PLAY] Word Scramble game session ended');
      } catch (error) {
        console.error('🔮 [FREE PLAY] Failed to end Word Scramble game session:', error);
      }
    }

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
    audio_url: item.audio_url
  }));

  return (
    <ImprovedWordScrambleGame
      vocabulary={gameVocabulary}
      isAssignmentMode={false}
      userId={userId || user?.id}
      gameSessionId={gameSessionId || undefined}
      language={language}
      difficulty={difficulty}
      onBackToMenu={onBackToMenu}
      onGameComplete={handleGameComplete}
      onOpenSettings={onOpenSettings}
    />
  );
}
