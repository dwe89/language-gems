import { useState } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { 
  gameProgressService, 
  GameProgress, 
  GameStats, 
  GameSummary 
} from '../services/gameProgressService';

/**
 * Hook for using game progress tracking functionality
 */
export function useGameProgress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Save game progress for the current user
   */
  const saveProgress = async (progress: GameProgress) => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await gameProgressService.saveGameProgress(user.id, progress);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error saving progress';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get game statistics for the current user
   */
  const getStats = async (): Promise<GameStats> => {
    if (!user) {
      setError('User not authenticated');
      return {
        totalGames: 0,
        highestScore: 0,
        averageScore: 0,
        totalTimePlayed: 0,
        mostPlayedGame: '',
        recentGames: []
      };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      return await gameProgressService.getGameStats(user.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error getting stats';
      setError(errorMessage);
      return {
        totalGames: 0,
        highestScore: 0,
        averageScore: 0,
        totalTimePlayed: 0,
        mostPlayedGame: '',
        recentGames: []
      };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get progress for a specific game
   */
  const getGameProgress = async (gameId: string): Promise<GameSummary[]> => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      return await gameProgressService.getGameProgress(user.id, gameId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error getting game progress';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  return {
    saveProgress,
    getStats,
    getGameProgress,
    loading,
    error
  };
} 