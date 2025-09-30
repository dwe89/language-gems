/**
 * Gems Analytics Service
 * Provides analytics data for the new gems-first reward system
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { type GemRarity } from '../rewards/RewardEngine';
import { DualTrackAnalyticsService, type XPBreakdown } from '../rewards/DualTrackAnalyticsService';

export interface StudentGemsAnalytics {
  studentId: string;
  totalGems: number;
  gemsByRarity: Record<GemRarity, number>;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  gemsEarnedToday: number;
  gemsByRarityToday: Record<GemRarity, number>;
  gemsThisWeek: number;
  gemsThisMonth: number;
  averageGemsPerSession: number;
  favoriteGameType: string;
  recentSessions: GemsSessionSummary[];
  // Triple-track system additions
  xpBreakdown: XPBreakdown;
  activityGemsToday: number;
  masteryGemsToday: number;
  grammarGemsToday: number;
}

export interface GemsSessionSummary {
  sessionId: string;
  gameType: string;
  gemsEarned: number;
  gemsByRarity: Record<GemRarity, number>;
  xpEarned: number;
  accuracy: number;
  duration: number;
  startedAt: string;
}

export interface ClassGemsAnalytics {
  classId: string;
  totalStudents: number;
  totalGems: number;
  averageGemsPerStudent: number;
  topPerformers: Array<{
    studentId: string;
    studentName: string;
    totalGems: number;
    level: number;
  }>;
  gemDistribution: Record<GemRarity, number>;
  gameTypeBreakdown: Array<{
    gameType: string;
    totalGems: number;
    averageAccuracy: number;
  }>;
}

export class GemsAnalyticsService {
  private supabase: SupabaseClient;
  private dualTrackService: DualTrackAnalyticsService;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    this.dualTrackService = new DualTrackAnalyticsService(this.supabase);
  }
  
  /**
   * Get comprehensive gems analytics for a student
   * OPTIMIZED: Uses parallel queries and single gem_events fetch
   */
  async getStudentGemsAnalytics(studentId: string): Promise<StudentGemsAnalytics> {
    try {
      console.log('🔍 [GEMS ANALYTICS] Loading analytics for student:', studentId);
      
      // Calculate time boundaries once
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayISO = today.toISOString();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // 🚀 OPTIMIZATION: Execute all independent queries in parallel
      const [
        sessionsResult,
        gemCollectionResult,
        allGemEventsResult,
        xpBreakdown
      ] = await Promise.all([
        // Get recent sessions (limit to last 100 for performance)
        this.supabase
          .from('enhanced_game_sessions')
          .select('id, game_type, gems_total, gems_by_rarity, xp_earned, accuracy_percentage, duration_seconds, started_at')
          .eq('student_id', studentId)
          .not('gems_total', 'is', null)
          .order('started_at', { ascending: false })
          .limit(100),
        
        // Get gem collection count
        this.supabase
          .from('vocabulary_gem_collection')
          .select('mastery_level', { count: 'exact', head: true })
          .eq('student_id', studentId),
        
        // 🚀 OPTIMIZATION: Get ALL gem events in a SINGLE query instead of 4 separate queries
        // This replaces: masteryGemsData, todaysMasteryGemsData, getTodaysActivityGems, getTodaysMasteryGems, getTodaysGrammarGems
        this.supabase
          .from('gem_events')
          .select('gem_rarity, gem_type, created_at')
          .eq('student_id', studentId),
        
        // Get XP breakdown
        this.dualTrackService.getXPBreakdown(studentId)
      ]);

      if (sessionsResult.error) throw sessionsResult.error;
      if (gemCollectionResult.error) throw gemCollectionResult.error;
      if (allGemEventsResult.error) throw allGemEventsResult.error;

      const sessions = sessionsResult.data || [];
      const totalGems = gemCollectionResult.count || 0;
      const allGemEvents = allGemEventsResult.data || [];

      // Calculate totals from sessions
      const totalXP = sessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0);
      
      // Calculate level (simplified - 1000 XP per level)
      const currentLevel = Math.floor(totalXP / 1000) + 1;
      const xpToNextLevel = 1000 - (totalXP % 1000);

      // 🚀 OPTIMIZATION: Process all gem events in a single pass instead of multiple queries
      const gemsByRarity: Record<GemRarity, number> = {
        new_discovery: 0, common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0
      };
      const gemsByRarityToday: Record<GemRarity, number> = {
        new_discovery: 0, common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0
      };
      
      let todaysActivityGems = 0;
      let todaysMasteryGemsCount = 0;
      let todaysGrammarGemsCount = 0;

      allGemEvents.forEach(gem => {
        const gemDate = new Date(gem.created_at);
        const isToday = gemDate >= today;
        
        // Count mastery gems by rarity (all time)
        if (gem.gem_type === 'mastery' && gem.gem_rarity && gem.gem_rarity in gemsByRarity) {
          gemsByRarity[gem.gem_rarity as GemRarity]++;
          
          // Count today's mastery gems by rarity
          if (isToday) {
            gemsByRarityToday[gem.gem_rarity as GemRarity]++;
            todaysMasteryGemsCount++;
          }
        }
        
        // Count today's gems by type
        if (isToday) {
          if (gem.gem_type === 'activity') todaysActivityGems++;
          else if (gem.gem_type === 'grammar') todaysGrammarGemsCount++;
        }
      });

      console.log('💎 [VOCABULARY COLLECTION] Mastery Gems by rarity:', gemsByRarity);
      console.log('💎 [TODAY\'S VOCABULARY] Today\'s Mastery Gems by rarity:', gemsByRarityToday);

      // Calculate time-based session metrics
      const todaysSessions = sessions.filter(s => new Date(s.started_at) >= today);
      const gemsEarnedToday = todaysSessions.reduce((sum, s) => sum + (s.gems_total || 0), 0);
      const gemsThisWeek = sessions.filter(s => s.started_at >= oneWeekAgo).reduce((sum, s) => sum + (s.gems_total || 0), 0);
      const gemsThisMonth = sessions.filter(s => s.started_at >= oneMonthAgo).reduce((sum, s) => sum + (s.gems_total || 0), 0);
      const averageGemsPerSession = sessions.length > 0 ? totalGems / sessions.length : 0;
      
      // Find favorite game type
      const gameTypeCounts: Record<string, number> = {};
      sessions.forEach(session => {
        gameTypeCounts[session.game_type] = (gameTypeCounts[session.game_type] || 0) + 1;
      });
      const favoriteGameType = Object.entries(gameTypeCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'vocab-master';
      
      // Recent sessions summary (first 10)
      const recentSessions: GemsSessionSummary[] = sessions.slice(0, 10).map(session => ({
        sessionId: session.id,
        gameType: session.game_type,
        gemsEarned: session.gems_total || 0,
        gemsByRarity: session.gems_by_rarity || gemsByRarity,
        xpEarned: session.xp_earned || 0,
        accuracy: session.accuracy_percentage || 0,
        duration: session.duration_seconds || 0,
        startedAt: session.started_at
      }));

      console.log('📊 [TRIPLE-TRACK] Analytics loaded:', {
        studentId,
        totalXP: xpBreakdown.totalXP,
        masteryXP: xpBreakdown.masteryXP,
        activityXP: xpBreakdown.activityXP,
        grammarXP: xpBreakdown.grammarXP,
        activityGemsToday: todaysActivityGems,
        masteryGemsToday: todaysMasteryGemsCount,
        grammarGemsToday: todaysGrammarGemsCount
      });

      return {
        studentId,
        totalGems,
        gemsByRarity,
        totalXP,
        currentLevel,
        xpToNextLevel,
        gemsEarnedToday,
        gemsByRarityToday,
        gemsThisWeek,
        gemsThisMonth,
        averageGemsPerSession,
        favoriteGameType,
        recentSessions,
        xpBreakdown,
        activityGemsToday: todaysActivityGems,
        masteryGemsToday: todaysMasteryGemsCount,
        grammarGemsToday: todaysGrammarGemsCount
      };
      
    } catch (error) {
      console.error('Error fetching student gems analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get gems analytics for a class
   */
  async getClassGemsAnalytics(classId: string): Promise<ClassGemsAnalytics> {
    try {
      // Get all students in the class
      const { data: classStudents, error: studentsError } = await this.supabase
        .from('class_students')
        .select('student_id, profiles!inner(display_name)')
        .eq('class_id', classId);
      
      if (studentsError) throw studentsError;
      
      const studentIds = classStudents?.map(cs => cs.student_id) || [];
      
      if (studentIds.length === 0) {
        return this.getEmptyClassAnalytics(classId);
      }
      
      // Get sessions for all students in the class
      const { data: sessions, error: sessionsError } = await this.supabase
        .from('enhanced_game_sessions')
        .select(`
          student_id,
          game_type,
          gems_total,
          gems_by_rarity,
          xp_earned,
          accuracy_percentage
        `)
        .in('student_id', studentIds)
        .not('gems_total', 'is', null);
      
      if (sessionsError) throw sessionsError;
      
      // Calculate class totals
      const totalGems = sessions?.reduce((sum, s) => sum + (s.gems_total || 0), 0) || 0;
      const averageGemsPerStudent = studentIds.length > 0 ? totalGems / studentIds.length : 0;
      
      // Calculate gem distribution
      const gemDistribution: Record<GemRarity, number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      };
      
      sessions?.forEach(session => {
        if (session.gems_by_rarity) {
          Object.entries(session.gems_by_rarity).forEach(([rarity, count]) => {
            gemDistribution[rarity as GemRarity] += count as number;
          });
        }
      });
      
      // Calculate top performers
      const studentStats: Record<string, { gems: number; xp: number }> = {};
      sessions?.forEach(session => {
        if (!studentStats[session.student_id]) {
          studentStats[session.student_id] = { gems: 0, xp: 0 };
        }
        studentStats[session.student_id].gems += session.gems_total || 0;
        studentStats[session.student_id].xp += session.xp_earned || 0;
      });
      
      const topPerformers = Object.entries(studentStats)
        .map(([studentId, stats]) => {
          const student = classStudents?.find(cs => cs.student_id === studentId);
          return {
            studentId,
            studentName: student?.profiles?.display_name || 'Unknown',
            totalGems: stats.gems,
            level: Math.floor(stats.xp / 1000) + 1
          };
        })
        .sort((a, b) => b.totalGems - a.totalGems)
        .slice(0, 10);
      
      // Calculate game type breakdown
      const gameTypeStats: Record<string, { gems: number; accuracy: number; count: number }> = {};
      sessions?.forEach(session => {
        if (!gameTypeStats[session.game_type]) {
          gameTypeStats[session.game_type] = { gems: 0, accuracy: 0, count: 0 };
        }
        gameTypeStats[session.game_type].gems += session.gems_total || 0;
        gameTypeStats[session.game_type].accuracy += session.accuracy_percentage || 0;
        gameTypeStats[session.game_type].count += 1;
      });
      
      const gameTypeBreakdown = Object.entries(gameTypeStats).map(([gameType, stats]) => ({
        gameType,
        totalGems: stats.gems,
        averageAccuracy: stats.count > 0 ? stats.accuracy / stats.count : 0
      }));
      
      return {
        classId,
        totalStudents: studentIds.length,
        totalGems,
        averageGemsPerStudent,
        topPerformers,
        gemDistribution,
        gameTypeBreakdown
      };
      
    } catch (error) {
      console.error('Error fetching class gems analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get empty analytics structure for classes with no data
   */
  private getEmptyClassAnalytics(classId: string): ClassGemsAnalytics {
    return {
      classId,
      totalStudents: 0,
      totalGems: 0,
      averageGemsPerStudent: 0,
      topPerformers: [],
      gemDistribution: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      },
      gameTypeBreakdown: []
    };
  }
}
