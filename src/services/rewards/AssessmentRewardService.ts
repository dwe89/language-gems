/**
 * Assessment Reward Service
 * Handles post-assessment gem and XP rewards based on performance
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { RewardEngine, type GemRarity } from './RewardEngine';
import { EnhancedGameSessionService } from './EnhancedGameSessionService';

export interface AssessmentResult {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  completionTime: number;
  assessmentType: 'listening' | 'reading' | 'writing' | 'speaking';
  difficultyLevel: 'foundation' | 'higher';
  examBoard?: 'AQA' | 'Edexcel';
}

export interface AssessmentReward {
  baseGems: number;
  bonusGems: number;
  totalGems: number;
  gemRarity: GemRarity;
  totalXP: number;
  achievements: string[];
}

export class AssessmentRewardService {
  private supabase: SupabaseClient;
  private sessionService: EnhancedGameSessionService;
  
  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    this.sessionService = new EnhancedGameSessionService(this.supabase);
  }
  
  /**
   * Calculate and award gems based on assessment performance
   */
  async awardAssessmentRewards(
    sessionId: string,
    studentId: string,
    result: AssessmentResult
  ): Promise<AssessmentReward> {
    try {
      // Calculate base gems (1 per correct answer)
      const baseGems = result.correctAnswers;
      
      // Calculate bonus gems based on performance thresholds
      let bonusGems = 0;
      let achievements: string[] = [];
      
      // Accuracy bonuses
      if (result.accuracy >= 95) {
        bonusGems += 5;
        achievements.push('Perfect Performance');
      } else if (result.accuracy >= 90) {
        bonusGems += 3;
        achievements.push('Excellent Performance');
      } else if (result.accuracy >= 80) {
        bonusGems += 2;
        achievements.push('Great Performance');
      } else if (result.accuracy >= 70) {
        bonusGems += 1;
        achievements.push('Good Performance');
      }
      
      // Completion bonus (finished the assessment)
      if (result.accuracy >= 50) {
        bonusGems += 1;
        achievements.push('Assessment Completed');
      }
      
      // Speed bonus for quick completion (if accuracy is good)
      if (result.accuracy >= 70) {
        const expectedTime = this.getExpectedAssessmentTime(result.assessmentType, result.difficultyLevel);
        if (result.completionTime <= expectedTime * 0.8) {
          bonusGems += 2;
          achievements.push('Speed Demon');
        } else if (result.completionTime <= expectedTime * 0.9) {
          bonusGems += 1;
          achievements.push('Quick Thinker');
        }
      }
      
      // Difficulty bonus
      if (result.difficultyLevel === 'higher') {
        bonusGems += Math.floor(baseGems * 0.2); // 20% bonus for higher tier
        achievements.push('Higher Tier Challenge');
      }
      
      const totalGems = baseGems + bonusGems;
      
      // Determine overall gem rarity based on performance
      const gemRarity = this.calculateAssessmentGemRarity(result);
      
      // Award gems to session
      if (totalGems > 0) {
        // Award base gems as individual events
        for (let i = 0; i < baseGems; i++) {
          await this.sessionService.awardBonusGem(
            sessionId,
            `assessment-${result.assessmentType}`,
            'common', // Base gems are common
            'Correct Answer',
            studentId
          );
        }
        
        // Award bonus gems with higher rarity
        if (bonusGems > 0) {
          await this.sessionService.awardBonusGem(
            sessionId,
            `assessment-${result.assessmentType}`,
            gemRarity,
            `Performance Bonus (${result.accuracy.toFixed(1)}% accuracy)`,
            studentId
          );
        }
      }
      
      // Calculate total XP
      const baseXP = baseGems * RewardEngine.getXPValue('common');
      const bonusXP = bonusGems * RewardEngine.getXPValue(gemRarity);
      const totalXP = baseXP + bonusXP;
      
      // Record achievements
      await this.recordAssessmentAchievements(studentId, sessionId, achievements, result);
      
      return {
        baseGems,
        bonusGems,
        totalGems,
        gemRarity,
        totalXP,
        achievements
      };
      
    } catch (error) {
      console.error('Error awarding assessment rewards:', error);
      throw error;
    }
  }
  
  /**
   * Calculate gem rarity for assessment performance
   */
  private calculateAssessmentGemRarity(result: AssessmentResult): GemRarity {
    // Base rarity on accuracy and completion
    if (result.accuracy >= 95) return 'legendary';
    if (result.accuracy >= 90) return 'epic';
    if (result.accuracy >= 80) return 'rare';
    if (result.accuracy >= 70) return 'uncommon';
    return 'common';
  }
  
  /**
   * Get expected completion time for assessment type
   */
  private getExpectedAssessmentTime(
    assessmentType: AssessmentResult['assessmentType'],
    difficultyLevel: AssessmentResult['difficultyLevel']
  ): number {
    // Times in seconds
    const baseTimes = {
      listening: difficultyLevel === 'foundation' ? 2700 : 3600, // 45min / 60min
      reading: difficultyLevel === 'foundation' ? 3600 : 4500,   // 60min / 75min
      writing: difficultyLevel === 'foundation' ? 4500 : 5400,   // 75min / 90min
      speaking: 900 // 15min (consistent across levels)
    };
    
    return baseTimes[assessmentType];
  }
  
  /**
   * Record assessment achievements
   */
  private async recordAssessmentAchievements(
    studentId: string,
    sessionId: string,
    achievements: string[],
    result: AssessmentResult
  ): Promise<void> {
    try {
      for (const achievement of achievements) {
        await this.supabase
          .from('student_achievements')
          .insert({
            student_id: studentId,
            session_id: sessionId,
            achievement_type: 'assessment_performance',
            achievement_category: 'performance',
            title: achievement,
            description: `Earned in ${result.assessmentType} assessment with ${result.accuracy.toFixed(1)}% accuracy`,
            icon_name: this.getAchievementIcon(achievement),
            rarity: this.getAchievementRarity(achievement),
            points_awarded: this.getAchievementPoints(achievement),
            game_type: `assessment-${result.assessmentType}`
          });
      }
    } catch (error) {
      console.error('Error recording assessment achievements:', error);
    }
  }
  
  /**
   * Get icon for achievement
   */
  private getAchievementIcon(achievement: string): string {
    const iconMap: Record<string, string> = {
      'Perfect Performance': 'Crown',
      'Excellent Performance': 'Star',
      'Great Performance': 'Award',
      'Good Performance': 'ThumbsUp',
      'Assessment Completed': 'CheckCircle',
      'Speed Demon': 'Zap',
      'Quick Thinker': 'Clock',
      'Higher Tier Challenge': 'TrendingUp'
    };
    
    return iconMap[achievement] || 'Award';
  }
  
  /**
   * Get rarity for achievement
   */
  private getAchievementRarity(achievement: string): string {
    const rarityMap: Record<string, string> = {
      'Perfect Performance': 'legendary',
      'Excellent Performance': 'epic',
      'Great Performance': 'rare',
      'Good Performance': 'uncommon',
      'Assessment Completed': 'common',
      'Speed Demon': 'epic',
      'Quick Thinker': 'rare',
      'Higher Tier Challenge': 'rare'
    };
    
    return rarityMap[achievement] || 'common';
  }
  
  /**
   * Get points for achievement
   */
  private getAchievementPoints(achievement: string): number {
    const pointsMap: Record<string, number> = {
      'Perfect Performance': 100,
      'Excellent Performance': 75,
      'Great Performance': 50,
      'Good Performance': 25,
      'Assessment Completed': 10,
      'Speed Demon': 50,
      'Quick Thinker': 25,
      'Higher Tier Challenge': 30
    };
    
    return pointsMap[achievement] || 10;
  }
  
  /**
   * Get assessment summary for display
   */
  async getAssessmentSummary(sessionId: string): Promise<any> {
    try {
      const { data: session } = await this.supabase
        .from('enhanced_game_sessions')
        .select(`
          *,
          student_achievements(*)
        `)
        .eq('id', sessionId)
        .single();
      
      const { data: gemEvents } = await this.supabase
        .from('gem_events')
        .select('*')
        .eq('session_id', sessionId);
      
      return {
        session,
        gemEvents,
        achievements: session?.student_achievements || []
      };
    } catch (error) {
      console.error('Error getting assessment summary:', error);
      return null;
    }
  }
}
