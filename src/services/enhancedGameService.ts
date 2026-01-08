import { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface EnhancedGameSession {
  id?: string;
  student_id: string;
  assignment_id?: string;
  game_type: string;
  session_mode: 'free_play' | 'assignment' | 'practice' | 'challenge';

  // Content metadata
  category?: string;
  subcategory?: string;

  // Session metadata
  started_at: Date;
  ended_at?: Date;
  duration_seconds: number;

  // Performance metrics
  final_score: number;
  max_score_possible: number;
  accuracy_percentage: number;
  completion_percentage: number;
  completion_status?: 'not_started' | 'in_progress' | 'completed' | 'abandoned';

  // Game-specific data
  level_reached: number;
  lives_used: number;
  power_ups_used: PowerUpUsage[];
  achievements_earned: string[];

  // Learning metrics
  words_attempted: number;
  words_correct: number;
  unique_words_practiced: number;
  average_response_time_ms: number;

  // Engagement metrics
  pause_count: number;
  hint_requests: number;
  retry_attempts: number;

  // XP and gamification (new fields)
  xp_earned?: number;
  bonus_xp?: number;
  xp_multiplier?: number;

  // Streak tracking
  max_streak?: number;

  // Performance metadata
  performance_metrics?: Record<string, any>;

  // Session data
  session_data: Record<string, any>;
  device_info: Record<string, any>;

  // Timestamps
  created_at?: Date;
  updated_at?: Date;
}

export interface WordPerformanceLog {
  id?: string;
  session_id: string;
  vocabulary_id?: string; // Changed from number to string for UUID support

  // Word details
  word_text: string;
  translation_text: string;
  language_pair: string;

  // Performance data
  attempt_number: number;
  response_time_ms: number;
  was_correct: boolean;
  confidence_level?: number;

  // Context
  difficulty_level: string;
  hint_used: boolean;
  power_up_active?: string;
  streak_count: number;

  // Learning data
  previous_attempts: number;
  mastery_level: number;

  // Error analysis (new fields)
  error_type?: string;
  grammar_concept?: string;
  error_details?: Record<string, any>;

  // Metadata
  context_data: Record<string, any>;
  language?: string;
  curriculum_level?: string;
  timestamp: Date;
}

export interface PowerUpUsage {
  type: string;
  used_at: Date;
  effect_duration?: number;
  effectiveness_score?: number;
}

export interface GameLeaderboard {
  id?: string;
  game_type: string;
  leaderboard_type: 'daily' | 'weekly' | 'monthly' | 'all_time' | 'class';
  class_id?: string;

  // Ranking data
  student_id: string;
  rank_position: number;
  score: number;
  accuracy: number;

  // Time period
  period_start: Date;
  period_end: Date;

  // Metadata
  games_played: number;
  total_time_played: number;
  achievements_count: number;
}

export interface StudentAchievement {
  id?: string;
  student_id: string;
  achievement_type: string;
  achievement_category: 'performance' | 'consistency' | 'improvement' | 'social' | 'milestone';

  // Achievement details
  title: string;
  description: string;
  icon_name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points_awarded: number;

  // Context
  game_type?: string;
  session_id?: string;
  assignment_id?: string;

  // Achievement data
  progress_data: Record<string, any>;
  earned_at: Date;
}

export interface StudentGameProfile {
  id?: string;
  student_id: string;

  // Experience and levels
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;

  // Streaks and consistency
  current_streak: number;
  longest_streak: number;
  last_activity_date: Date;

  // Game statistics
  total_games_played: number;
  total_time_played: number;
  favorite_game_type?: string;

  // Achievement counts
  total_achievements: number;
  rare_achievements: number;
  epic_achievements: number;
  legendary_achievements: number;

  // Learning metrics
  words_learned: number;
  accuracy_average: number;
  improvement_rate: number;

  // Social features
  friends_count: number;
  challenges_won: number;
  challenges_lost: number;

  // Preferences
  preferred_difficulty: string;
  preferred_language_pair: string;
  notification_preferences: Record<string, any>;

  // Profile customization
  avatar_url?: string;
  display_name?: string;
  title?: string;
  badge_showcase: string[];
}

export interface DailyChallenge {
  id?: string;
  challenge_date: Date;
  challenge_type: string;
  game_type: string;

  // Configuration
  title: string;
  description: string;
  difficulty_level: string;
  target_metric: string;
  target_value: number;

  // Rewards
  xp_reward: number;
  achievement_id?: string;

  // Metadata
  participation_count: number;
  completion_count: number;
}

export interface AssignmentAnalytics {
  id?: string;
  assignment_id: string;

  // Class performance
  total_students: number;
  students_started: number;
  students_completed: number;
  completion_rate: number;

  // Performance metrics
  average_score: number;
  average_accuracy: number;
  average_time_spent: number;

  // Difficulty analysis
  difficulty_rating: number;
  words_causing_difficulty: string[];
  common_mistakes: Record<string, any>;

  // Engagement metrics
  average_attempts: number;
  dropout_rate: number;
  help_requests: number;

  // Time analysis
  peak_activity_hours: number[];
  average_session_length: number;

  last_calculated_at: Date;
}

// =====================================================
// ENHANCED GAME SERVICE CLASS
// =====================================================

export class EnhancedGameService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  // =====================================================
  // GAME SESSION MANAGEMENT
  // =====================================================

  async startGameSession(sessionData: Partial<EnhancedGameSession>): Promise<string> {
    // Extract database columns from session data
    const {
      id,
      student_id,
      assignment_id,
      game_type,
      session_mode,
      category,
      subcategory,
      started_at,
      ended_at,
      duration_seconds,
      final_score,
      max_score_possible,
      accuracy_percentage,
      completion_percentage,
      completion_status,
      level_reached,
      lives_used,
      power_ups_used,
      achievements_earned,
      words_attempted,
      words_correct,
      unique_words_practiced,
      average_response_time_ms,
      pause_count,
      hint_requests,
      retry_attempts,
      session_data,
      device_info,
      created_at,
      updated_at,
      xp_earned,
      bonus_xp,
      xp_multiplier,
      ...extraData // All other fields go into session_data
    } = sessionData;

    const session: Partial<EnhancedGameSession> = {
      student_id,
      assignment_id,
      game_type,
      session_mode,
      category,
      subcategory,
      started_at: new Date(),
      duration_seconds: 0,
      final_score: 0,
      accuracy_percentage: 0,
      completion_percentage: 0,
      completion_status: completion_status || 'in_progress',
      level_reached: 1,
      lives_used: 0,
      power_ups_used: [],
      achievements_earned: [],
      words_attempted: 0,
      words_correct: 0,
      unique_words_practiced: 0,
      average_response_time_ms: 0,
      pause_count: 0,
      hint_requests: 0,
      retry_attempts: 0,
      session_data: {
        ...extraData, // Include extra fields like game_mode, language_pair, etc.
        ...(session_data || {})
      },
      device_info: this.getDeviceInfo()
    };

    const { data, error } = await this.supabase
      .from('enhanced_game_sessions')
      .insert(session)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to start game session: ${error.message}`);
    }

    return data.id;
  }

  async updateGameSession(sessionId: string, updates: Partial<EnhancedGameSession>): Promise<void> {
    // Auto-calculate accuracy if counts are provided to ensure data integrity
    if (typeof updates.words_correct === 'number' && typeof updates.words_attempted === 'number') {
      if (updates.words_attempted > 0) {
        updates.accuracy_percentage = Math.round((updates.words_correct / updates.words_attempted) * 100 * 10) / 10;
      } else {
        updates.accuracy_percentage = 0;
      }
    }

    const { error } = await this.supabase
      .from('enhanced_game_sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) {
      throw new Error(`Failed to update game session: ${error.message}`);
    }
  }

  async endGameSession(sessionId: string, finalData: Partial<EnhancedGameSession>): Promise<void> {
    const endData = {
      ...finalData,
      ended_at: new Date()
    };

    await this.updateGameSession(sessionId, endData);

    // Process achievements and update student profile
    if (finalData.student_id) {
      await this.processSessionAchievements(sessionId, finalData.student_id);
      await this.updateStudentProfile(finalData.student_id, finalData);
    }
  }

  // =====================================================
  // WORD PERFORMANCE TRACKING
  // =====================================================

  async logWordPerformance(performanceData: WordPerformanceLog): Promise<void> {
    try {
      // Extract vocabulary_id to handle UUID vs integer correctly
      // The database has vocabulary_id (INTEGER) and centralized_vocabulary_id (UUID)
      const { vocabulary_id, ...restData } = performanceData;

      // Determine if the vocabulary_id is a UUID or legacy integer
      const isUUID = vocabulary_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vocabulary_id);

      // Build the enriched data with correct column mapping
      const enrichedData: Record<string, any> = {
        ...restData,
        language: performanceData.language || this.deriveLanguageFromContext(performanceData),
        curriculum_level: performanceData.curriculum_level || await this.deriveCurriculumLevel(performanceData),
        timestamp: new Date()
      };

      // Map vocabulary ID to the correct column based on type
      if (isUUID) {
        // Use the UUID column for UUID-format IDs
        enrichedData.centralized_vocabulary_id = vocabulary_id;
        // Also set vocabulary_uuid for compatibility
        enrichedData.vocabulary_uuid = vocabulary_id;
        // Leave vocabulary_id (integer) as null
      } else if (vocabulary_id) {
        // Legacy integer ID - parse and use integer column
        const numericId = parseInt(vocabulary_id, 10);
        if (!isNaN(numericId)) {
          enrichedData.vocabulary_id = numericId;
        }
      }

      const { error } = await this.supabase
        .from('word_performance_logs')
        .insert(enrichedData);

      if (error) {
        throw new Error(`Failed to log word performance: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in logWordPerformance:', error);
      throw error;
    }
  }

  async getWordPerformanceHistory(
    studentId: string,
    vocabularyId?: number,
    limit: number = 50
  ): Promise<WordPerformanceLog[]> {
    let query = this.supabase
      .from('word_performance_logs')
      .select(`
        *,
        enhanced_game_sessions!inner(student_id)
      `)
      .eq('enhanced_game_sessions.student_id', studentId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (vocabularyId) {
      query = query.eq('vocabulary_id', vocabularyId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get word performance history: ${error.message}`);
    }

    return data || [];
  }

  // =====================================================
  // HELPER METHODS FOR DATA DERIVATION
  // =====================================================

  /**
   * Derives language from performance data context
   * Priority: performanceData.language > language_pair extraction > fallback
   */
  private deriveLanguageFromContext(performanceData: WordPerformanceLog): string {
    // First priority: explicit language field
    if (performanceData.language) {
      return performanceData.language;
    }

    // Second priority: extract from language_pair (e.g., "es_english" -> "es")
    if (performanceData.language_pair) {
      const parts = performanceData.language_pair.split('_');
      if (parts.length >= 2 && parts[0] !== 'english') {
        return parts[0];
      }
    }

    // Fallback: default to Spanish
    return 'es';
  }

  /**
   * Derives curriculum level from various data sources
   * Priority: vocabulary lookup > assignment lookup > fallback
   */
  private async deriveCurriculumLevel(performanceData: WordPerformanceLog): Promise<string> {
    try {
      // First priority: lookup from centralized_vocabulary using vocabulary_id
      if (performanceData.vocabulary_id) {
        const { data: vocabData, error: vocabError } = await this.supabase
          .from('centralized_vocabulary')
          .select('curriculum_level')
          .eq('id', performanceData.vocabulary_id)
          .single();

        if (!vocabError && vocabData?.curriculum_level) {
          return vocabData.curriculum_level;
        }
      }

      // Second priority: lookup from assignments via session_id
      if (performanceData.session_id) {
        const { data: sessionData, error: sessionError } = await this.supabase
          .from('enhanced_game_sessions')
          .select(`
            assignment_id,
            assignments(curriculum_level)
          `)
          .eq('id', performanceData.session_id)
          .single();

        if (!sessionError && sessionData?.assignments?.curriculum_level) {
          return sessionData.assignments.curriculum_level;
        }
      }

      // Fallback: default to KS3
      return 'KS3';
    } catch (error) {
      console.error('Error deriving curriculum level:', error);
      return 'KS3';
    }
  }

  // =====================================================
  // ACHIEVEMENT SYSTEM
  // =====================================================

  async processSessionAchievements(sessionId: string, studentId: string): Promise<StudentAchievement[]> {
    // Get session data
    const { data: session, error: sessionError } = await this.supabase
      .from('enhanced_game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error('Failed to get session data for achievement processing');
    }

    const achievements: StudentAchievement[] = [];

    // Check for various achievement conditions
    const achievementChecks = [
      this.checkPerformanceAchievements(session),
      this.checkConsistencyAchievements(studentId, session),
      this.checkImprovementAchievements(studentId, session),
      this.checkMilestoneAchievements(studentId, session)
    ];

    const allAchievements = await Promise.all(achievementChecks);
    achievements.push(...allAchievements.flat());

    // Save new achievements
    for (const achievement of achievements) {
      await this.awardAchievement(achievement);
    }

    return achievements;
  }

  private async checkPerformanceAchievements(session: any): Promise<StudentAchievement[]> {
    const achievements: StudentAchievement[] = [];

    // Perfect Score Achievement
    if (session.accuracy_percentage >= 100) {
      achievements.push({
        student_id: session.student_id,
        achievement_type: 'perfect_score',
        achievement_category: 'performance',
        title: 'Perfect Score!',
        description: 'Achieved 100% accuracy in a game session',
        icon_name: 'trophy',
        rarity: 'rare',
        points_awarded: 100,
        game_type: session.game_type,
        session_id: session.id,
        progress_data: { accuracy: session.accuracy_percentage },
        earned_at: new Date()
      });
    }

    // Speed Demon Achievement
    if (session.average_response_time_ms < 2000 && session.words_attempted >= 10) {
      achievements.push({
        student_id: session.student_id,
        achievement_type: 'speed_demon',
        achievement_category: 'performance',
        title: 'Speed Demon',
        description: 'Average response time under 2 seconds',
        icon_name: 'zap',
        rarity: 'epic',
        points_awarded: 150,
        game_type: session.game_type,
        session_id: session.id,
        progress_data: { average_time: session.average_response_time_ms },
        earned_at: new Date()
      });
    }

    return achievements;
  }

  private async checkConsistencyAchievements(studentId: string, session: any): Promise<StudentAchievement[]> {
    const achievements: StudentAchievement[] = [];

    // Get student's current streak
    const { data: profile } = await this.supabase
      .from('student_game_profiles')
      .select('current_streak, longest_streak')
      .eq('student_id', studentId)
      .single();

    if (profile && profile.current_streak >= 7) {
      achievements.push({
        student_id: studentId,
        achievement_type: 'week_warrior',
        achievement_category: 'consistency',
        title: 'Week Warrior',
        description: 'Played games for 7 days in a row',
        icon_name: 'calendar',
        rarity: 'rare',
        points_awarded: 200,
        progress_data: { streak: profile.current_streak },
        earned_at: new Date()
      });
    }

    return achievements;
  }

  private async checkImprovementAchievements(studentId: string, session: any): Promise<StudentAchievement[]> {
    const achievements: StudentAchievement[] = [];

    // Get recent sessions to check improvement
    const { data: recentSessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('accuracy_percentage, final_score')
      .eq('student_id', studentId)
      .eq('game_type', session.game_type)
      .order('started_at', { ascending: false })
      .limit(5);

    if (recentSessions && recentSessions.length >= 3) {
      const averageAccuracy = recentSessions.slice(1).reduce((sum, s) => sum + s.accuracy_percentage, 0) / (recentSessions.length - 1);

      if (session.accuracy_percentage > averageAccuracy + 20) {
        achievements.push({
          student_id: studentId,
          achievement_type: 'improvement_surge',
          achievement_category: 'improvement',
          title: 'Improvement Surge',
          description: 'Improved accuracy by 20% or more',
          icon_name: 'trending-up',
          rarity: 'epic',
          points_awarded: 175,
          game_type: session.game_type,
          session_id: session.id,
          progress_data: {
            previous_average: averageAccuracy,
            current_accuracy: session.accuracy_percentage,
            improvement: session.accuracy_percentage - averageAccuracy
          },
          earned_at: new Date()
        });
      }
    }

    return achievements;
  }

  private async checkMilestoneAchievements(studentId: string, session: any): Promise<StudentAchievement[]> {
    const achievements: StudentAchievement[] = [];

    // Get total games played
    const { data: totalGames } = await this.supabase
      .from('enhanced_game_sessions')
      .select('id', { count: 'exact' })
      .eq('student_id', studentId);

    const gamesPlayed = totalGames?.length || 0;

    // Milestone achievements
    const milestones = [
      { count: 10, title: 'Getting Started', rarity: 'common', points: 50 },
      { count: 50, title: 'Dedicated Learner', rarity: 'rare', points: 100 },
      { count: 100, title: 'Century Club', rarity: 'epic', points: 200 },
      { count: 500, title: 'Game Master', rarity: 'legendary', points: 500 }
    ];

    for (const milestone of milestones) {
      if (gamesPlayed === milestone.count) {
        achievements.push({
          student_id: studentId,
          achievement_type: `milestone_${milestone.count}`,
          achievement_category: 'milestone',
          title: milestone.title,
          description: `Played ${milestone.count} games`,
          icon_name: 'star',
          rarity: milestone.rarity as any,
          points_awarded: milestone.points,
          progress_data: { games_played: gamesPlayed },
          earned_at: new Date()
        });
      }
    }

    return achievements;
  }

  async awardAchievement(achievement: StudentAchievement): Promise<void> {
    // Check if achievement already exists
    const { data: existing } = await this.supabase
      .from('student_achievements')
      .select('id')
      .eq('student_id', achievement.student_id)
      .eq('achievement_type', achievement.achievement_type)
      .single();

    if (existing) {
      return; // Achievement already awarded
    }

    // Insert new achievement
    const { error } = await this.supabase
      .from('student_achievements')
      .insert(achievement);

    if (error) {
      console.error('Award achievement error:', error);
      throw new Error(`Failed to award achievement: ${error.message || JSON.stringify(error)}`);
    }

    // Update student profile with XP and achievement count
    await this.addXPToStudent(achievement.student_id, achievement.points_awarded);
  }

  // =====================================================
  // STUDENT PROFILE MANAGEMENT
  // =====================================================

  async getStudentProfile(studentId: string): Promise<StudentGameProfile | null> {
    // student_game_profiles table removed - use user_profiles instead
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn(`Student profile not found in user_profiles: ${error.message}`);
      return null;
    }

    // Map user_profiles data to StudentGameProfile format
    return data ? {
      id: data.id,
      student_id: studentId,
      total_xp: 0, // Will be calculated from gem_events
      current_level: 1,
      xp_to_next_level: 100,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: new Date(),
      total_games_played: 0,
      total_time_played: 0,
      favorite_game_type: null,
      total_achievements: 0,
      rare_achievements: 0,
      epic_achievements: 0,
      legendary_achievements: 0,
      words_learned: 0,
      accuracy_average: 0,
      improvement_rate: 0,
      friends_count: 0,
      challenges_won: 0,
      challenges_lost: 0,
      preferred_difficulty: 'intermediate',
      preferred_language_pair: 'english_spanish',
      notification_preferences: {},
      avatar_url: null,
      display_name: data.display_name,
      title: null,
      badge_showcase: [],
      created_at: data.created_at,
      updated_at: data.updated_at
    } : null;
  }

  async createStudentProfile(studentId: string): Promise<StudentGameProfile> {
    const profile: Partial<StudentGameProfile> = {
      student_id: studentId,
      total_xp: 0,
      current_level: 1,
      xp_to_next_level: 100,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: new Date(),
      total_games_played: 0,
      total_time_played: 0,
      total_achievements: 0,
      rare_achievements: 0,
      epic_achievements: 0,
      legendary_achievements: 0,
      words_learned: 0,
      accuracy_average: 0,
      improvement_rate: 0,
      friends_count: 0,
      challenges_won: 0,
      challenges_lost: 0,
      preferred_difficulty: 'intermediate',
      preferred_language_pair: 'english_spanish',
      notification_preferences: {},
      badge_showcase: []
    };

    // student_game_profiles table removed - return default profile without database insertion
    return {
      id: studentId,
      student_id: studentId,
      total_xp: 0,
      current_level: 1,
      xp_to_next_level: 100,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: new Date(),
      total_games_played: 0,
      total_time_played: 0,
      favorite_game_type: null,
      total_achievements: 0,
      rare_achievements: 0,
      epic_achievements: 0,
      legendary_achievements: 0,
      words_learned: 0,
      accuracy_average: 0,
      improvement_rate: 0,
      friends_count: 0,
      challenges_won: 0,
      challenges_lost: 0,
      preferred_difficulty: 'intermediate',
      preferred_language_pair: 'english_spanish',
      notification_preferences: {},
      avatar_url: null,
      display_name: null,
      title: null,
      badge_showcase: [],
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  async updateStudentProfile(studentId: string, sessionData: Partial<EnhancedGameSession>): Promise<void> {
    // student_game_profiles table removed - profile updates now handled by gems system
    // Student profile data is calculated dynamically from:
    // - gem_events (for XP and achievements)
    // - enhanced_game_sessions (for game statistics)
    // - vocabulary_gem_collection (for learning progress)

    console.log('Student profile update skipped - using gems-first system for all tracking');
  }

  async addXPToStudent(studentId: string, xpAmount: number): Promise<void> {
    let profile = await this.getStudentProfile(studentId);

    if (!profile) {
      profile = await this.createStudentProfile(studentId);
    }

    const newTotalXP = profile.total_xp + xpAmount;
    let newLevel = profile.current_level;
    let xpToNextLevel = profile.xp_to_next_level;

    // Calculate level progression
    while (newTotalXP >= this.getXPRequiredForLevel(newLevel + 1)) {
      newLevel++;
      xpToNextLevel = this.getXPRequiredForLevel(newLevel + 1) - newTotalXP;
    }

    const { error } = await this.supabase
      .from('student_game_profiles')
      .update({
        total_xp: newTotalXP,
        current_level: newLevel,
        xp_to_next_level: xpToNextLevel
      })
      .eq('student_id', studentId);

    if (error) {
      throw new Error(`Failed to add XP to student: ${error.message}`);
    }
  }

  private getXPRequiredForLevel(level: number): number {
    // Exponential XP curve: level^2 * 100
    return level * level * 100;
  }

  // =====================================================
  // LEADERBOARD MANAGEMENT
  // =====================================================

  async updateLeaderboards(sessionData: EnhancedGameSession): Promise<void> {
    const leaderboardTypes = ['daily', 'weekly', 'monthly', 'all_time'];

    for (const type of leaderboardTypes) {
      await this.updateLeaderboard(sessionData, type as any);
    }
  }

  private async updateLeaderboard(
    sessionData: EnhancedGameSession,
    leaderboardType: 'daily' | 'weekly' | 'monthly' | 'all_time'
  ): Promise<void> {
    const { periodStart, periodEnd } = this.getLeaderboardPeriod(leaderboardType);

    // Get or create leaderboard entry
    const { data: existing, error: fetchError } = await this.supabase
      .from('game_leaderboards')
      .select('*')
      .eq('game_type', sessionData.game_type)
      .eq('leaderboard_type', leaderboardType)
      .eq('student_id', sessionData.student_id)
      .eq('period_start', periodStart.toISOString())
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch leaderboard entry: ${fetchError.message}`);
    }

    if (existing) {
      // Update existing entry
      const newScore = Math.max(existing.score, sessionData.final_score);
      const newAccuracy = (existing.accuracy * existing.games_played + sessionData.accuracy_percentage) / (existing.games_played + 1);

      const { error } = await this.supabase
        .from('game_leaderboards')
        .update({
          score: newScore,
          accuracy: Math.round(newAccuracy * 100) / 100,
          games_played: existing.games_played + 1,
          total_time_played: existing.total_time_played + sessionData.duration_seconds
        })
        .eq('id', existing.id);

      if (error) {
        throw new Error(`Failed to update leaderboard entry: ${error.message}`);
      }
    } else {
      // Create new entry
      const { error } = await this.supabase
        .from('game_leaderboards')
        .insert({
          game_type: sessionData.game_type,
          leaderboard_type: leaderboardType,
          student_id: sessionData.student_id,
          rank_position: 1, // Will be updated by rank calculation
          score: sessionData.final_score,
          accuracy: sessionData.accuracy_percentage,
          period_start: periodStart,
          period_end: periodEnd,
          games_played: 1,
          total_time_played: sessionData.duration_seconds,
          achievements_count: sessionData.achievements_earned.length
        });

      if (error) {
        throw new Error(`Failed to create leaderboard entry: ${error.message}`);
      }
    }

    // Recalculate ranks for this leaderboard
    await this.recalculateLeaderboardRanks(sessionData.game_type, leaderboardType, periodStart);
  }

  private getLeaderboardPeriod(type: 'daily' | 'weekly' | 'monthly' | 'all_time'): { periodStart: Date; periodEnd: Date } {
    const now = new Date();

    switch (type) {
      case 'daily':
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
        return { periodStart: dayStart, periodEnd: dayEnd };

      case 'weekly':
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
        return { periodStart: weekStart, periodEnd: weekEnd };

      case 'monthly':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { periodStart: monthStart, periodEnd: monthEnd };

      case 'all_time':
        return {
          periodStart: new Date('2024-01-01'),
          periodEnd: new Date('2099-12-31')
        };
    }
  }

  private async recalculateLeaderboardRanks(
    gameType: string,
    leaderboardType: string,
    periodStart: Date
  ): Promise<void> {
    // Get all entries for this leaderboard, ordered by score desc
    const { data: entries, error } = await this.supabase
      .from('game_leaderboards')
      .select('id, score')
      .eq('game_type', gameType)
      .eq('leaderboard_type', leaderboardType)
      .eq('period_start', periodStart.toISOString())
      .order('score', { ascending: false });

    if (error) {
      throw new Error(`Failed to get leaderboard entries: ${error.message}`);
    }

    // Update ranks
    for (let i = 0; i < entries.length; i++) {
      const { error: updateError } = await this.supabase
        .from('game_leaderboards')
        .update({ rank_position: i + 1 })
        .eq('id', entries[i].id);

      if (updateError) {
        console.error(`Failed to update rank for entry ${entries[i].id}:`, updateError);
      }
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  private getDeviceInfo(): Record<string, any> {
    if (typeof window === 'undefined') {
      return {};
    }

    return {
      userAgent: navigator.userAgent,
      screenWidth: screen.width,
      screenHeight: screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }
}
