import { SupabaseClient, createBrowserClient } from '@supabase/ssr';

// Humanize dashed/underscored ids into Title Case fallbacks (e.g. 'vocab-master' -> 'Vocab Master')
const humanizeGameId = (id?: string) =>
  id ? id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown Game';

/**
 * Interface for game progress data
 */
export interface GameProgress {
  gameId: string;
  score: number;
  accuracy?: number;
  completionTime?: number;
  level?: number;
  metadata?: Record<string, any>;
  isAssignment?: boolean;
  assignmentId?: string;
}

/**
 * Interface for retrieving game statistics
 */
export interface GameStats {
  totalGames: number;
  highestScore: number;
  averageScore: number;
  totalTimePlayed: number;
  mostPlayedGame: string;
  recentGames: GameSummary[];
}

/**
 * Interface for a game summary
 */
export interface GameSummary {
  id: string;
  gameId: string;
  gameName: string;
  score: number;
  playedAt: string;
  accuracy?: number;
  completionTime?: number;
}

/**
 * Service for tracking and managing game progress
 */
export class GameProgressService {
  private supabase: SupabaseClient;
  private gameProgressCache: Map<string, GameSummary[]> = new Map();
  private statsCache: Map<string, GameStats> = new Map();
  
  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  
  /**
   * Save a user's game progress to the database
   */
  async saveGameProgress(userId: string, progress: GameProgress): Promise<{ success: boolean; error?: string }> {
    // Clear caches when new progress is saved
    this.gameProgressCache.delete(`${userId}-${progress.gameId}`);
    this.statsCache.delete(userId);

    try {
      // Determine whether this is an assignment or a free play
      if (progress.isAssignment && progress.assignmentId) {
        // If this is an assignment, update student vocabulary assignment progress instead of assignment_progress
        if (progress.assignmentId && progress.metadata && progress.metadata.vocabularyItems && progress.metadata.vocabularyItems.length > 0) {
          for (const vocab of progress.metadata.vocabularyItems) {
            await this.supabase
              .from('student_vocabulary_assignment_progress')
              .upsert({
                student_id: userId,
                assignment_id: progress.assignmentId,
                vocabulary_id: vocab.id,
                attempts: vocab.attempts || 1,
                correct_attempts: vocab.correct ? (vocab.attempts || 1) : 0,
                last_attempted_at: new Date().toISOString(),
                mastery_level: vocab.correct ? 'mastered' : 'learning',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('student_id', userId)
              .eq('assignment_id', progress.assignmentId)
              .eq('vocabulary_id', vocab.id);
          }

          // Update or create overall assignment progress in student_vocabulary_assignment_progress summary
          const totalVocab = progress.metadata.vocabularyItems.length;
          const masteredVocab = progress.metadata.vocabularyItems.filter(v => v.correct).length;
          const completionPercentage = Math.round((masteredVocab / totalVocab) * 100);
          
          // Store overall progress metadata in a separate record or handle differently
          // Since assignment_progress table doesn't exist, we'll track this differently
        }
      } else {
        // This is free play, record in game_progress table
        const now = new Date().toISOString();
        
        const { error } = await this.supabase
          .from('game_progress')
          .insert({
            user_id: userId,
            game_id: progress.gameId,
            score: progress.score,
            accuracy: progress.accuracy,
            completion_time: progress.completionTime,
            level: progress.level,
            metadata: progress.metadata,
            played_at: now
          });
          
        if (error) throw new Error(`Error saving game progress: ${error.message}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save game progress:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error saving game progress' 
      };
    }
  }
  
  /**
   * Get game statistics for a user
   */
  async getGameStats(userId: string): Promise<GameStats> {
    // Check cache first
    const cacheKey = userId;
    if (this.statsCache.has(cacheKey)) {
      return this.statsCache.get(cacheKey)!;
    }

    try {
      // Get all game progress records for this user
      const { data: progressData, error: progressError } = await this.supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', userId)
        .order('played_at', { ascending: false });
        
      if (progressError) throw new Error(`Error fetching game progress: ${progressError.message}`);
      
      if (!progressData || progressData.length === 0) {
        return {
          totalGames: 0,
          highestScore: 0,
          averageScore: 0,
          totalTimePlayed: 0,
          mostPlayedGame: '',
          recentGames: []
        };
      }
      
      // Calculate statistics
      const totalGames = progressData.length;
      const highestScore = Math.max(...progressData.map(p => p.score || 0));
      const totalScore = progressData.reduce((sum, p) => sum + (p.score || 0), 0);
      const averageScore = totalScore / totalGames;
      
      const totalTime = progressData.reduce((sum, p) => sum + (p.completion_time || 0), 0);
      
      // Find most played game
      const gamePlayCounts: Record<string, number> = {};
      progressData.forEach(p => {
        gamePlayCounts[p.game_id] = (gamePlayCounts[p.game_id] || 0) + 1;
      });
      
      const mostPlayedGameId = Object.entries(gamePlayCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0])[0] || '';
      
      // Get game info for recent games
      const gameIds = [...new Set(progressData.map(p => p.game_id))];
      
      const { data: gamesData, error: gamesError } = await this.supabase
        .from('games')
        .select('id, name')
        .in('id', gameIds);
        
      if (gamesError) throw new Error(`Error fetching games data: ${gamesError.message}`);
      
      const gameNameMap = (gamesData || []).reduce((map, game) => {
        map[game.id] = game.name;
        return map;
      }, {} as Record<string, string>);

      
      // Format recent games
      const recentGames: GameSummary[] = progressData
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          gameId: p.game_id,
          gameName: gameNameMap[p.game_id] || humanizeGameId(p.game_id),
          score: p.score || 0,
          playedAt: p.played_at,
          accuracy: p.accuracy,
          completionTime: p.completion_time
        }));
      
      // Cache the result
      this.statsCache.set(cacheKey, {
        totalGames,
        highestScore,
        averageScore,
        totalTimePlayed: totalTime,
  mostPlayedGame: gameNameMap[mostPlayedGameId] || humanizeGameId(mostPlayedGameId),
        recentGames
      });

      return {
        totalGames,
        highestScore,
        averageScore,
        totalTimePlayed: totalTime,
  mostPlayedGame: gameNameMap[mostPlayedGameId] || humanizeGameId(mostPlayedGameId),
        recentGames
      };
    } catch (error) {
      console.error('Failed to get game stats:', error);
      // Return empty stats in case of error
      return {
        totalGames: 0,
        highestScore: 0,
        averageScore: 0,
        totalTimePlayed: 0,
        mostPlayedGame: '',
        recentGames: []
      };
    }
  }
  
  /**
   * Get game progress for a specific game
   */
  async getGameProgress(userId: string, gameId: string): Promise<GameSummary[]> {
    // Check cache first
    const cacheKey = `${userId}-${gameId}`;
    if (this.gameProgressCache.has(cacheKey)) {
      return this.gameProgressCache.get(cacheKey)!;
    }

    try {
      // Get progress records for this game and user
      const { data, error } = await this.supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .order('played_at', { ascending: false });
        
      if (error) throw new Error(`Error fetching game progress: ${error.message}`);
      
      // Get game name
      const { data: gameData, error: gameError } = await this.supabase
        .from('games')
        .select('name')
        .eq('id', gameId)
        .single();
        
      if (gameError) throw new Error(`Error fetching game data: ${gameError.message}`);
      
      // Format data
      const gameSummary = (data || []).map(p => ({
        id: p.id,
        gameId: p.game_id,
        gameName: gameData?.name || humanizeGameId(p.game_id),
        score: p.score || 0,
        playedAt: p.played_at,
        accuracy: p.accuracy,
        completionTime: p.completion_time
      }));

      // Cache the result
      this.gameProgressCache.set(cacheKey, gameSummary);
      
      return gameSummary;
    } catch (error) {
      console.error(`Failed to get game progress for game ${gameId}:`, error);
      return [];
    }
  }
}

// Export a singleton instance
export const gameProgressService = new GameProgressService(); 