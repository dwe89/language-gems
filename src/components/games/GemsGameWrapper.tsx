/**
 * Gems Game Wrapper
 * Provides session management and word selection for games using the new gems system
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { EnhancedGameSessionService } from '../../services/rewards/EnhancedGameSessionService';
import { UnifiedWordSelectionService, type SelectedWord } from '../../services/srs/UnifiedWordSelectionService';

interface GemsGameWrapperProps {
  gameType: string;
  sessionMode?: 'free_play' | 'assignment' | 'practice' | 'challenge';
  assignmentId?: string;
  language?: string;
  category?: string;
  subcategory?: string;
  maxWords?: number;
  onSessionStart?: (sessionId: string) => void;
  onSessionEnd?: (sessionData: any) => void;
  children: (props: {
    sessionId: string | null;
    selectedWords: SelectedWord[];
    isLoading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export default function GemsGameWrapper({
  gameType,
  sessionMode = 'free_play',
  assignmentId,
  language = 'spanish',
  category,
  subcategory,
  maxWords = 20,
  onSessionStart,
  onSessionEnd,
  children
}: GemsGameWrapperProps) {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sessionService = new EnhancedGameSessionService();
  const wordSelectionService = new UnifiedWordSelectionService();
  
  // Initialize session and select words
  useEffect(() => {
    if (!user?.id) return;
    
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Start game session
        const newSessionId = await sessionService.startGameSession({
          student_id: user.id,
          assignment_id: assignmentId,
          game_type: gameType,
          session_mode: sessionMode
        });
        
        setSessionId(newSessionId);
        
        // Make session service globally available for games
        if (typeof window !== 'undefined') {
          (window as any).gameSessionService = sessionService;
          (window as any).currentSessionId = newSessionId;
        }
        
        // Select words based on SRS and filters
        const words = await wordSelectionService.selectWordsForSession(
          user.id,
          {
            language,
            category,
            subcategory
          },
          {
            maxWords,
            sessionMode
          }
        );
        
        setSelectedWords(words);
        onSessionStart?.(newSessionId);
        
      } catch (err) {
        console.error('Error initializing game session:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeSession();
  }, [user?.id, gameType, sessionMode, assignmentId, language, category, subcategory, maxWords]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).gameSessionService;
        delete (window as any).currentSessionId;
      }
    };
  }, []);
  
  // End session helper
  const endSession = useCallback(async (finalData: any) => {
    if (!sessionId || !user?.id) return;
    
    try {
      await sessionService.endGameSession(sessionId, {
        student_id: user.id,
        game_type: gameType,
        session_mode: sessionMode,
        assignment_id: assignmentId,
        ...finalData
      });
      
      onSessionEnd?.(finalData);
    } catch (err) {
      console.error('Error ending game session:', err);
    }
  }, [sessionId, user?.id, gameType, sessionMode, assignmentId, onSessionEnd]);
  
  // Make endSession available globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).endGameSession = endSession;
    }
  }, [endSession]);
  
  return (
    <>
      {children({
        sessionId,
        selectedWords,
        isLoading,
        error
      })}
    </>
  );
}
