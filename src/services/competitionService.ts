import { SupabaseClient } from '@supabase/supabase-js';

export interface CrossGameLeaderboard {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  class_id?: string;
  class_name?: string;
  
  // Cross-game statistics
  total_points: number;
  total_xp: number;
  total_gems?: number;
  current_level: number;
  games_played: number;
  average_accuracy: number;
  average_completion?: number;
  total_time_played: number;
  
  // Streaks and consistency
  current_streak: number;
  longest_streak: number;
  last_activity: string | null;
  
  // Achievements
  total_achievements: number;
  rare_achievements: number;
  epic_achievements: number;
  legendary_achievements: number;
  
  // Rankings
  overall_rank: number;
  class_rank?: number;
  weekly_rank?: number;
  monthly_rank?: number;
  
  // Game-specific best scores
  game_scores: Record<string, {
    best_score: number;
    best_accuracy: number;
    games_played: number;
    last_played: string | null;
  }>;
  words_learned?: number;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  status: 'upcoming' | 'active' | 'completed';
  
  // Time period
  start_date: string;
  end_date: string;
  
  // Rules
  game_types: string[];
  scoring_method: 'total_points' | 'best_score' | 'average_score' | 'improvement';
  min_games_required: number;
  
  // Rewards
  rewards: {
    rank: number;
    title: string;
    xp_bonus: number;
    achievement_id?: string;
    badge_icon?: string;
  }[];
  
  // Participation
  participant_count: number;
  class_id?: string;
  is_public: boolean;
  
  // Metadata
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CompetitionEntry {
  id: string;
  competition_id: string;
  student_id: string;
  student_name: string;
  
  // Performance
  total_score: number;
  games_played: number;
  average_accuracy: number;
  improvement_percentage: number;
  
  // Ranking
  current_rank: number;
  previous_rank?: number;
  rank_change: number;
  
  // Game breakdown
  game_performances: Record<string, {
    score: number;
    accuracy: number;
    games_played: number;
  }>;
  
  // Timestamps
  last_updated: string;
  joined_at: string;
}

export interface StudentProfile {
  id: string;
  student_id: string;
  display_name: string;
  avatar_url?: string;
  title?: string;
  
  // Experience and levels
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  
  // Statistics
  total_games_played: number;
  total_time_played: number;
  words_learned: number;
  accuracy_average: number;
  
  // Streaks
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  
  // Social
  friends_count: number;
  challenges_won: number;
  challenges_lost: number;
  
  // Achievements
  total_achievements: number;
  badge_showcase: string[];
  recent_achievements: Array<{
    id: string;
    title: string;
    icon_name: string;
    earned_at: string;
  }>;
}

export class CompetitionService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // =====================================================
  // CROSS-GAME LEADERBOARDS
  // =====================================================

  async getCrossGameLeaderboard(options: {
    class_id?: string;
    school_id?: string;
    limit?: number;
    time_period?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  } = {}): Promise<CrossGameLeaderboard[]> {
    try {
      const { class_id, school_id, limit = 50, time_period = 'all_time' } = options;

      // Build the query to get student profiles with aggregated game data
      let query = this.supabase
        .from('student_game_profiles')
        .select(`
          *
        `);

      // Filter by class if specified
      if (class_id) {
        const { data: classStudents } = await this.supabase
          .from('class_enrollments')
          .select('student_id')
          .eq('class_id', class_id);

        const studentIds = classStudents?.map(cs => cs.student_id) || [];
        if (studentIds.length > 0) {
          query = query.in('student_id', studentIds);
        } else {
          return []; // No students in class
        }
      } else if (school_id) {
        // Filter by school - get all students in classes belonging to the school
        const { data: schoolClasses } = await this.supabase
          .from('classes')
          .select('id')
          .eq('school_id', school_id);

        const classIds = schoolClasses?.map(c => c.id) || [];

        if (classIds.length > 0) {
          const { data: schoolStudents } = await this.supabase
            .from('class_enrollments')
            .select('student_id')
            .in('class_id', classIds);

          const studentIds = schoolStudents?.map(cs => cs.student_id) || [];
          if (studentIds.length > 0) {
            query = query.in('student_id', studentIds);
          } else {
            return []; // No students in school
          }
        } else {
          return []; // No classes in school
        }
      }

      query = query
        .order('total_xp', { ascending: false })
        .limit(limit);

      const { data: profiles, error } = await query;

      if (error) throw error;

      // Get user profiles for display names
      const studentIds = profiles?.map(p => p.student_id) || [];
      const { data: userProfiles } = await this.supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .in('user_id', studentIds);

      const profileMap = userProfiles?.reduce((acc, up) => {
        acc[up.user_id] = up.display_name;
        return acc;
      }, {} as Record<string, string>) || {};

      // Get game-specific scores for each student
      const leaderboard: CrossGameLeaderboard[] = [];

      for (const profile of profiles || []) {
        const gameScores = await this.getStudentGameScores(profile.student_id, time_period);

        leaderboard.push({
          id: profile.id,
          student_id: profile.student_id,
          student_name: profile.display_name ||
            profileMap[profile.student_id] || 'Unknown Student',
          student_avatar: profile.avatar_url,
          class_id,
          
          // Cross-game statistics
          total_points: this.calculateTotalPoints(profile.total_xp, profile.total_achievements),
          total_xp: profile.total_xp,
          current_level: profile.current_level,
          games_played: profile.total_games_played,
          average_accuracy: profile.accuracy_average,
          total_time_played: profile.total_time_played,
          
          // Streaks
          current_streak: profile.current_streak,
          longest_streak: profile.longest_streak,
          last_activity: profile.last_activity_date,
          
          // Achievements
          total_achievements: profile.total_achievements,
          rare_achievements: profile.rare_achievements,
          epic_achievements: profile.epic_achievements,
          legendary_achievements: profile.legendary_achievements,
          
          // Rankings (will be calculated)
          overall_rank: 0,
          class_rank: 0,
          
          // Game scores
          game_scores: gameScores
        });
      }

      // Calculate rankings
      leaderboard.sort((a, b) => b.total_points - a.total_points);
      leaderboard.forEach((entry, index) => {
        entry.overall_rank = index + 1;
        entry.class_rank = index + 1; // Same as overall if filtered by class
      });

      return leaderboard;
    } catch (error) {
      console.error('Error fetching cross-game leaderboard:', error);
      throw error;
    }
  }

  private async getStudentGameScores(
    studentId: string, 
    timePeriod: string
  ): Promise<Record<string, any>> {
    try {
      // Get date range for time period
      const { startDate } = this.getTimePeriodRange(timePeriod);

      const { data: sessions, error } = await this.supabase
        .from('enhanced_game_sessions')
        .select('game_type, final_score, accuracy_percentage, ended_at')
        .eq('student_id', studentId)
        .gte('started_at', startDate.toISOString())
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false });

      if (error) throw error;

      const gameScores: Record<string, any> = {};

      sessions?.forEach(session => {
        const gameType = session.game_type;
        
        if (!gameScores[gameType]) {
          gameScores[gameType] = {
            best_score: session.final_score,
            best_accuracy: session.accuracy_percentage,
            games_played: 1,
            last_played: session.ended_at
          };
        } else {
          gameScores[gameType].best_score = Math.max(
            gameScores[gameType].best_score, 
            session.final_score
          );
          gameScores[gameType].best_accuracy = Math.max(
            gameScores[gameType].best_accuracy, 
            session.accuracy_percentage
          );
          gameScores[gameType].games_played += 1;
          
          if (new Date(session.ended_at) > new Date(gameScores[gameType].last_played)) {
            gameScores[gameType].last_played = session.ended_at;
          }
        }
      });

      return gameScores;
    } catch (error) {
      console.error('Error fetching student game scores:', error);
      return {};
    }
  }

  private calculateTotalPoints(xp: number, achievements: number): number {
    // Points = XP + (achievements * 50)
    return xp + (achievements * 50);
  }

  private getTimePeriodRange(period: string): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = new Date(now);

    switch (period) {
      case 'daily':
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        return { startDate: startOfDay, endDate };

      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return { startDate: startOfWeek, endDate };

      case 'monthly':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { startDate: startOfMonth, endDate };

      case 'all_time':
      default:
        return { startDate: new Date('2024-01-01'), endDate };
    }
  }

  // =====================================================
  // COMPETITIONS
  // =====================================================

  async getActiveCompetitions(classId?: string): Promise<Competition[]> {
    try {
      let query = this.supabase
        .from('competitions')
        .select('*')
        .eq('status', 'active')
        .order('end_date', { ascending: true });

      if (classId) {
        query = query.or(`class_id.eq.${classId},is_public.eq.true`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching active competitions:', error);
      throw error;
    }
  }

  async getCompetitionLeaderboard(competitionId: string): Promise<CompetitionEntry[]> {
    try {
      const { data, error } = await this.supabase
        .from('competition_entries')
        .select(`
          *,
          user_profiles(
            display_name
          )
        `)
        .eq('competition_id', competitionId)
        .order('current_rank', { ascending: true });

      if (error) throw error;

      return data?.map(entry => ({
        ...entry,
        student_name: entry.user_profiles?.display_name || 'Unknown Student'
      })) || [];
    } catch (error) {
      console.error('Error fetching competition leaderboard:', error);
      throw error;
    }
  }

  // =====================================================
  // STUDENT PROFILES
  // =====================================================

  async getStudentProfile(studentId: string): Promise<StudentProfile | null> {
    try {
      // student_game_profiles table removed - use user_profiles instead
      const { data: profile, error } = await this.supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .eq('user_id', studentId)
        .single();

      if (error) {
        console.warn('Student profile not found:', error);
        return null;
      }
      if (!profile) return null;

      const profileRecord = profile as any;

      // Get recent achievements (achievements table still exists)
      const { data: achievements } = await this.supabase
        .from('achievements')
        .select('id, achievement_key, game_type, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(5);

      const recentAchievements = (achievements || []).map(achievement => ({
        id: achievement.id ?? `generated-${Math.random().toString(36).slice(2)}`,
        title: achievement.achievement_key ?? 'Achievement Unlocked',
        icon_name: achievement.game_type ?? 'trophy',
        earned_at: achievement.created_at ?? new Date().toISOString()
      }));

      return {
        id: profileRecord.id ?? profileRecord.user_id ?? studentId,
        student_id: profileRecord.student_id ?? studentId,
        display_name: profileRecord.display_name ||
          profileRecord.user_profiles?.display_name ||
          'Unknown Student',
        avatar_url: profileRecord.avatar_url ?? null,
        title: profileRecord.title ?? null,
        
        // Experience and levels
        total_xp: profileRecord.total_xp ?? 0,
        current_level: profileRecord.current_level ?? 1,
        xp_to_next_level: profileRecord.xp_to_next_level ?? 0,
        
        // Statistics
        total_games_played: profileRecord.total_games_played ?? 0,
        total_time_played: profileRecord.total_time_played ?? 0,
        words_learned: profileRecord.words_learned ?? 0,
        accuracy_average: profileRecord.accuracy_average ?? 0,
        
        // Streaks
        current_streak: profileRecord.current_streak ?? 0,
        longest_streak: profileRecord.longest_streak ?? 0,
        last_activity_date: profileRecord.last_activity_date ?? null,
        
        // Social
        friends_count: profileRecord.friends_count ?? 0,
        challenges_won: profileRecord.challenges_won ?? 0,
        challenges_lost: profileRecord.challenges_lost ?? 0,
        
        // Achievements
        total_achievements: profileRecord.total_achievements ?? 0,
        badge_showcase: profileRecord.badge_showcase || [],
        recent_achievements: recentAchievements
      };
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  async updateStudentRankings(): Promise<void> {
    try {
      // This would be called periodically to update all rankings
      // Implementation would recalculate ranks across all leaderboards
      console.log('Updating student rankings...');
      
      // Get all students and recalculate their rankings
      const leaderboard = await this.getCrossGameLeaderboard({ limit: 1000 });
      
      // Update rankings in database
      for (const entry of leaderboard) {
        await this.supabase
          .from('student_game_profiles')
          .update({
            // Could add ranking fields to the profile table
            updated_at: new Date().toISOString()
          })
          .eq('student_id', entry.student_id);
      }
    } catch (error) {
      console.error('Error updating student rankings:', error);
      throw error;
    }
  }
}
