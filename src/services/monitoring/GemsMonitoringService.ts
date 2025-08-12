/**
 * Gems Monitoring Service
 * Provides monitoring, alerts, and validation for the gems-first reward system
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface SystemHealthMetrics {
  totalSessions: number;
  sessionsWithGems: number;
  gemsIntegrityScore: number; // 0-100 score
  averageGemsPerSession: number;
  gemDistributionHealth: Record<string, number>;
  antiGrindingEffectiveness: number;
  learningEffectivenessScore: number;
  alerts: SystemAlert[];
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  category: 'integrity' | 'performance' | 'learning' | 'grinding';
  message: string;
  details: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface LearningEffectivenessMetrics {
  retentionRate: number;
  masteryProgression: number;
  engagementScore: number;
  srsEffectiveness: number;
  vocabularyGrowthRate: number;
  accuracyTrends: Array<{
    date: string;
    averageAccuracy: number;
    sessionCount: number;
  }>;
}

export interface AntiGrindingMetrics {
  suspiciousPatterns: Array<{
    studentId: string;
    pattern: string;
    severity: 'low' | 'medium' | 'high';
    details: string;
  }>;
  masteryCapEffectiveness: number;
  wordSelectionDistribution: Record<string, number>;
  averageSessionDuration: number;
  repeatWordFrequency: number;
}

export class GemsMonitoringService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Get comprehensive system health metrics
   */
  async getSystemHealthMetrics(): Promise<SystemHealthMetrics> {
    try {
      const [
        sessionMetrics,
        gemIntegrity,
        distributionHealth,
        antiGrindingMetrics,
        learningMetrics
      ] = await Promise.all([
        this.getSessionMetrics(),
        this.validateGemIntegrity(),
        this.analyzeGemDistribution(),
        this.getAntiGrindingMetrics(),
        this.getLearningEffectivenessMetrics()
      ]);

      const alerts = await this.generateSystemAlerts({
        sessionMetrics,
        gemIntegrity,
        distributionHealth,
        antiGrindingMetrics,
        learningMetrics
      });

      return {
        totalSessions: sessionMetrics.totalSessions,
        sessionsWithGems: sessionMetrics.sessionsWithGems,
        gemsIntegrityScore: gemIntegrity.score,
        averageGemsPerSession: sessionMetrics.averageGemsPerSession,
        gemDistributionHealth: distributionHealth,
        antiGrindingEffectiveness: antiGrindingMetrics.masteryCapEffectiveness,
        learningEffectivenessScore: learningMetrics.engagementScore,
        alerts
      };
    } catch (error) {
      console.error('Error getting system health metrics:', error);
      throw error;
    }
  }

  /**
   * Validate gem integrity (gems total matches XP calculations)
   */
  private async validateGemIntegrity(): Promise<{ score: number; issues: string[] }> {
    const { data: sessions, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('id, gems_total, gems_by_rarity, xp_earned')
      .not('gems_total', 'is', null)
      .limit(1000);

    if (error || !sessions) {
      return { score: 0, issues: ['Failed to fetch session data'] };
    }

    const issues: string[] = [];
    let validSessions = 0;

    sessions.forEach(session => {
      // Calculate expected XP from gems
      const gemsByRarity = session.gems_by_rarity || {};
      const expectedXP = 
        (gemsByRarity.common || 0) * 10 +
        (gemsByRarity.uncommon || 0) * 25 +
        (gemsByRarity.rare || 0) * 50 +
        (gemsByRarity.epic || 0) * 100 +
        (gemsByRarity.legendary || 0) * 200;

      // Allow for some variance due to bonus XP
      const actualXP = session.xp_earned || 0;
      const variance = Math.abs(actualXP - expectedXP) / Math.max(expectedXP, 1);

      if (variance > 0.5) { // More than 50% variance
        issues.push(`Session ${session.id}: XP mismatch (expected: ${expectedXP}, actual: ${actualXP})`);
      } else {
        validSessions++;
      }
    });

    const score = sessions.length > 0 ? (validSessions / sessions.length) * 100 : 100;
    return { score, issues };
  }

  /**
   * Analyze gem distribution for health indicators
   */
  private async analyzeGemDistribution(): Promise<Record<string, number>> {
    const { data: sessions, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('gems_by_rarity')
      .not('gems_by_rarity', 'is', null)
      .limit(1000);

    if (error || !sessions) {
      return {};
    }

    const distribution = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
    
    sessions.forEach(session => {
      if (session.gems_by_rarity) {
        Object.entries(session.gems_by_rarity).forEach(([rarity, count]) => {
          distribution[rarity as keyof typeof distribution] += count as number;
        });
      }
    });

    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    // Convert to percentages and return health scores
    return {
      commonPercentage: total > 0 ? (distribution.common / total) * 100 : 0,
      uncommonPercentage: total > 0 ? (distribution.uncommon / total) * 100 : 0,
      rarePercentage: total > 0 ? (distribution.rare / total) * 100 : 0,
      epicPercentage: total > 0 ? (distribution.epic / total) * 100 : 0,
      legendaryPercentage: total > 0 ? (distribution.legendary / total) * 100 : 0,
      distributionBalance: this.calculateDistributionBalance(distribution, total)
    };
  }

  /**
   * Calculate distribution balance score (0-100)
   */
  private calculateDistributionBalance(distribution: Record<string, number>, total: number): number {
    if (total === 0) return 100;

    // Expected healthy distribution (approximate)
    const expected = {
      common: 0.60,    // 60% common
      uncommon: 0.25,  // 25% uncommon  
      rare: 0.10,      // 10% rare
      epic: 0.04,      // 4% epic
      legendary: 0.01  // 1% legendary
    };

    let deviationSum = 0;
    Object.entries(expected).forEach(([rarity, expectedPercent]) => {
      const actualPercent = (distribution[rarity] || 0) / total;
      deviationSum += Math.abs(actualPercent - expectedPercent);
    });

    // Convert deviation to health score (lower deviation = higher score)
    return Math.max(0, 100 - (deviationSum * 200));
  }

  /**
   * Get basic session metrics
   */
  private async getSessionMetrics(): Promise<{
    totalSessions: number;
    sessionsWithGems: number;
    averageGemsPerSession: number;
  }> {
    const { data: sessions, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('gems_total')
      .limit(1000);

    if (error || !sessions) {
      return { totalSessions: 0, sessionsWithGems: 0, averageGemsPerSession: 0 };
    }

    const totalSessions = sessions.length;
    const sessionsWithGems = sessions.filter(s => s.gems_total && s.gems_total > 0).length;
    const totalGems = sessions.reduce((sum, s) => sum + (s.gems_total || 0), 0);
    const averageGemsPerSession = sessionsWithGems > 0 ? totalGems / sessionsWithGems : 0;

    return { totalSessions, sessionsWithGems, averageGemsPerSession };
  }

  /**
   * Get anti-grinding effectiveness metrics
   */
  private async getAntiGrindingMetrics(): Promise<AntiGrindingMetrics> {
    // This would analyze patterns in vocabulary_gem_collection and sessions
    // For now, return mock data structure
    return {
      suspiciousPatterns: [],
      masteryCapEffectiveness: 85, // 85% effectiveness
      wordSelectionDistribution: {},
      averageSessionDuration: 0,
      repeatWordFrequency: 0
    };
  }

  /**
   * Get learning effectiveness metrics
   */
  private async getLearningEffectivenessMetrics(): Promise<LearningEffectivenessMetrics> {
    // This would analyze learning outcomes and retention
    // For now, return mock data structure
    return {
      retentionRate: 78,
      masteryProgression: 82,
      engagementScore: 85,
      srsEffectiveness: 88,
      vocabularyGrowthRate: 15,
      accuracyTrends: []
    };
  }

  /**
   * Generate system alerts based on metrics
   */
  private async generateSystemAlerts(metrics: any): Promise<SystemAlert[]> {
    const alerts: SystemAlert[] = [];

    // Gem integrity alerts
    if (metrics.gemIntegrity.score < 90) {
      alerts.push({
        id: `integrity-${Date.now()}`,
        type: 'warning',
        category: 'integrity',
        message: 'Gem-XP integrity below threshold',
        details: `Integrity score: ${metrics.gemIntegrity.score.toFixed(1)}%. Some sessions have mismatched gem totals and XP values.`,
        timestamp: new Date().toISOString(),
        severity: metrics.gemIntegrity.score < 80 ? 'high' : 'medium'
      });
    }

    // Distribution health alerts
    if (metrics.distributionHealth.distributionBalance < 70) {
      alerts.push({
        id: `distribution-${Date.now()}`,
        type: 'warning',
        category: 'performance',
        message: 'Gem distribution imbalance detected',
        details: `Distribution balance score: ${metrics.distributionHealth.distributionBalance.toFixed(1)}%. Gem rarity distribution may need adjustment.`,
        timestamp: new Date().toISOString(),
        severity: 'medium'
      });
    }

    return alerts;
  }
}
