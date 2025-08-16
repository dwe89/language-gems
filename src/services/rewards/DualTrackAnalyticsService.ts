/**
 * Dual-Track Analytics Service
 * Provides analytics for both Mastery Gems (FSRS-driven) and Activity Gems (immediate rewards)
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { GemRarity } from './RewardEngine';

export interface XPBreakdown {
  totalXP: number;
  masteryXP: number;
  activityXP: number;
  grammarXP?: number;
  totalMasteryGems: number;
  totalActivityGems: number;
  totalGrammarGems?: number;
  totalGems: number;
}

export interface ActivityGemStats {
  totalActivityGems: number;
  totalActivityXP: number;
  commonActivityGems: number;
  uncommonActivityGems: number;
  rareActivityGems: number;
  epicActivityGems: number;
  legendaryActivityGems: number;
  avgResponseTime: number;
  maxStreak: number;
  gamesPlayed: number;
}

export interface MasteryGemStats {
  totalMasteryGems: number;
  totalMasteryXP: number;
  newDiscoveryGems: number;
  commonMasteryGems: number;
  uncommonMasteryGems: number;
  rareMasteryGems: number;
  epicMasteryGems: number;
  legendaryMasteryGems: number;
  uniqueWordsMastered: number;
}

export interface DualTrackAnalytics {
  xpBreakdown: XPBreakdown;
  activityStats: ActivityGemStats;
  masteryStats: MasteryGemStats;
  recentActivity: Array<{
    date: string;
    activityXP: number;
    masteryXP: number;
    activityGems: number;
    masteryGems: number;
  }>;
}

export class DualTrackAnalyticsService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  /**
   * Get consolidated XP breakdown for a student
   */
  async getXPBreakdown(studentId: string): Promise<XPBreakdown> {
    try {
      console.log('🔍 [DUAL-TRACK] Fetching XP breakdown for student:', studentId);

      const { data, error } = await this.supabase
        .from('student_consolidated_xp_analytics')
        .select('*')
        .eq('student_id', studentId)
        .single();

      console.log('📊 [DUAL-TRACK] Raw analytics data:', { data, error });

      if (error) {
        console.error('Error fetching XP breakdown:', error);
        return {
          totalXP: 0,
          masteryXP: 0,
          activityXP: 0,
          grammarXP: 0,
          totalMasteryGems: 0,
          totalActivityGems: 0,
          totalGrammarGems: 0,
          totalGems: 0
        };
      }

      // Handle case where no data exists for this student
      if (!data) {
        console.log('📊 [DUAL-TRACK] No analytics data found for student:', studentId);
        return {
          totalXP: 0,
          masteryXP: 0,
          activityXP: 0,
          grammarXP: 0,
          totalMasteryGems: 0,
          totalActivityGems: 0,
          totalGrammarGems: 0,
          totalGems: 0
        };
      }

      const result = {
        totalXP: data.total_xp || 0,
        masteryXP: data.mastery_xp || 0,
        activityXP: data.activity_xp || 0,
        grammarXP: data.grammar_xp || 0,
        totalMasteryGems: data.total_mastery_gems || 0,
        totalActivityGems: data.total_activity_gems || 0,
        totalGrammarGems: data.total_grammar_gems || 0,
        totalGems: data.total_gems || 0
      };

      console.log('✅ [DUAL-TRACK] XP breakdown result:', result);
      return result;
    } catch (error) {
      console.error('Error in getXPBreakdown:', error);
      return {
        totalXP: 0,
        masteryXP: 0,
        activityXP: 0,
        grammarXP: 0,
        totalMasteryGems: 0,
        totalActivityGems: 0,
        totalGrammarGems: 0,
        totalGems: 0
      };
    }
  }

  /**
   * Get Activity Gem statistics
   */
  async getActivityGemStats(studentId: string): Promise<ActivityGemStats> {
    try {
      const { data, error } = await this.supabase
        .from('student_activity_gem_analytics')
        .select('*')
        .eq('student_id', studentId)
        .order('activity_date', { ascending: false })
        .limit(30); // Last 30 days

      if (error) {
        console.error('Error fetching activity gem stats:', error);
        return this.getEmptyActivityStats();
      }

      if (!data || data.length === 0) {
        return this.getEmptyActivityStats();
      }

      // Aggregate data across all days
      const aggregated = data.reduce((acc, day) => ({
        totalActivityGems: acc.totalActivityGems + (day.total_activity_gems || 0),
        totalActivityXP: acc.totalActivityXP + (day.total_activity_xp || 0),
        commonActivityGems: acc.commonActivityGems + (day.common_activity_gems || 0),
        uncommonActivityGems: acc.uncommonActivityGems + (day.uncommon_activity_gems || 0),
        rareActivityGems: acc.rareActivityGems + (day.rare_activity_gems || 0),
        epicActivityGems: acc.epicActivityGems + (day.epic_activity_gems || 0),
        legendaryActivityGems: acc.legendaryActivityGems + (day.legendary_activity_gems || 0),
        avgResponseTime: Math.max(acc.avgResponseTime, day.avg_response_time || 0),
        maxStreak: Math.max(acc.maxStreak, day.max_streak || 0),
        gamesPlayed: Math.max(acc.gamesPlayed, day.games_played || 0)
      }), this.getEmptyActivityStats());

      return aggregated;
    } catch (error) {
      console.error('Error in getActivityGemStats:', error);
      return this.getEmptyActivityStats();
    }
  }

  /**
   * Get Mastery Gem statistics
   */
  async getMasteryGemStats(studentId: string): Promise<MasteryGemStats> {
    try {
      const { data, error } = await this.supabase
        .from('student_mastery_gem_analytics')
        .select('*')
        .eq('student_id', studentId)
        .order('mastery_date', { ascending: false })
        .limit(30); // Last 30 days

      if (error) {
        console.error('Error fetching mastery gem stats:', error);
        return this.getEmptyMasteryStats();
      }

      if (!data || data.length === 0) {
        return this.getEmptyMasteryStats();
      }

      // Aggregate data across all days
      const aggregated = data.reduce((acc, day) => ({
        totalMasteryGems: acc.totalMasteryGems + (day.total_mastery_gems || 0),
        totalMasteryXP: acc.totalMasteryXP + (day.total_mastery_xp || 0),
        newDiscoveryGems: acc.newDiscoveryGems + (day.new_discovery_gems || 0),
        commonMasteryGems: acc.commonMasteryGems + (day.common_mastery_gems || 0),
        uncommonMasteryGems: acc.uncommonMasteryGems + (day.uncommon_mastery_gems || 0),
        rareMasteryGems: acc.rareMasteryGems + (day.rare_mastery_gems || 0),
        epicMasteryGems: acc.epicMasteryGems + (day.epic_mastery_gems || 0),
        legendaryMasteryGems: acc.legendaryMasteryGems + (day.legendary_mastery_gems || 0),
        uniqueWordsMastered: Math.max(acc.uniqueWordsMastered, day.unique_words_mastered || 0)
      }), this.getEmptyMasteryStats());

      return aggregated;
    } catch (error) {
      console.error('Error in getMasteryGemStats:', error);
      return this.getEmptyMasteryStats();
    }
  }

  /**
   * Get complete dual-track analytics
   */
  async getDualTrackAnalytics(studentId: string): Promise<DualTrackAnalytics> {
    const [xpBreakdown, activityStats, masteryStats] = await Promise.all([
      this.getXPBreakdown(studentId),
      this.getActivityGemStats(studentId),
      this.getMasteryGemStats(studentId)
    ]);

    // Get recent activity (last 7 days)
    const recentActivity = await this.getRecentActivity(studentId, 7);

    return {
      xpBreakdown,
      activityStats,
      masteryStats,
      recentActivity
    };
  }

  /**
   * Get recent activity breakdown by day
   */
  private async getRecentActivity(studentId: string, days: number) {
    try {
      const { data: activityData } = await this.supabase
        .from('student_activity_gem_analytics')
        .select('activity_date, total_activity_xp, total_activity_gems')
        .eq('student_id', studentId)
        .gte('activity_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('activity_date', { ascending: true });

      const { data: masteryData } = await this.supabase
        .from('student_mastery_gem_analytics')
        .select('mastery_date, total_mastery_xp, total_mastery_gems')
        .eq('student_id', studentId)
        .gte('mastery_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('mastery_date', { ascending: true });

      // Combine and format data
      const activityMap = new Map(activityData?.map(d => [d.activity_date, d]) || []);
      const masteryMap = new Map(masteryData?.map(d => [d.mastery_date, d]) || []);

      const result = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const activity = activityMap.get(date);
        const mastery = masteryMap.get(date);

        result.push({
          date,
          activityXP: activity?.total_activity_xp || 0,
          masteryXP: mastery?.total_mastery_xp || 0,
          activityGems: activity?.total_activity_gems || 0,
          masteryGems: mastery?.total_mastery_gems || 0
        });
      }

      return result;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  private getEmptyActivityStats(): ActivityGemStats {
    return {
      totalActivityGems: 0,
      totalActivityXP: 0,
      commonActivityGems: 0,
      uncommonActivityGems: 0,
      rareActivityGems: 0,
      epicActivityGems: 0,
      legendaryActivityGems: 0,
      avgResponseTime: 0,
      maxStreak: 0,
      gamesPlayed: 0
    };
  }

  private getEmptyMasteryStats(): MasteryGemStats {
    return {
      totalMasteryGems: 0,
      totalMasteryXP: 0,
      newDiscoveryGems: 0,
      commonMasteryGems: 0,
      uncommonMasteryGems: 0,
      rareMasteryGems: 0,
      epicMasteryGems: 0,
      legendaryMasteryGems: 0,
      uniqueWordsMastered: 0
    };
  }
}
