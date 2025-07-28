import { SupabaseClient } from '@supabase/supabase-js';

export interface AssessmentAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'assessment' | 'skill_mastery' | 'consistency' | 'improvement' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: 'score_threshold' | 'skill_proficiency' | 'completion_streak' | 'improvement_rate' | 'perfect_assessment';
    target: number;
    skill?: 'reading' | 'writing' | 'listening' | 'speaking';
    assessmentType?: 'reading-comprehension' | 'four-skills' | 'exam-style';
  };
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
}

export interface AssessmentGamificationData {
  userId: string;
  assessmentType: 'reading-comprehension' | 'four-skills' | 'exam-style';
  skillResults?: {
    reading?: number;
    writing?: number;
    listening?: number;
    speaking?: number;
  };
  overallScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  passed: boolean;
  streak: number;
  previousBestScore?: number;
}

export class AssessmentGamificationService {
  private supabase: SupabaseClient;
  private achievements: AssessmentAchievement[];

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
    this.achievements = this.initializeAssessmentAchievements();
  }

  private initializeAssessmentAchievements(): AssessmentAchievement[] {
    return [
      // Reading Comprehension Achievements
      {
        id: 'reading_first_pass',
        name: 'Reading Scholar',
        description: 'Pass your first reading comprehension assessment',
        icon: '📚',
        category: 'milestone',
        rarity: 'common',
        requirement: { type: 'score_threshold', target: 60 },
        points: 50,
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'reading_perfectionist',
        name: 'Reading Perfectionist',
        description: 'Score 100% on a reading comprehension assessment',
        icon: '🎯',
        category: 'assessment',
        rarity: 'epic',
        requirement: { type: 'perfect_assessment', target: 100, assessmentType: 'reading-comprehension' },
        points: 200,
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'reading_streak_master',
        name: 'Reading Streak Master',
        description: 'Pass 5 reading assessments in a row',
        icon: '🔥',
        category: 'consistency',
        rarity: 'rare',
        requirement: { type: 'completion_streak', target: 5, assessmentType: 'reading-comprehension' },
        points: 150,
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },

      // Four Skills Achievements
      {
        id: 'four_skills_balanced',
        name: 'Balanced Linguist',
        description: 'Score 70%+ in all four skills in a single assessment',
        icon: '⚖️',
        category: 'skill_mastery',
        rarity: 'rare',
        requirement: { type: 'skill_proficiency', target: 70 },
        points: 175,
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'speaking_specialist',
        name: 'Speaking Specialist',
        description: 'Score 90%+ on speaking assessments 3 times',
        icon: '🎤',
        category: 'skill_mastery',
        rarity: 'epic',
        requirement: { type: 'skill_proficiency', target: 90, skill: 'speaking' },
        points: 250,
        unlocked: false,
        progress: 0,
        maxProgress: 3
      },
      {
        id: 'writing_virtuoso',
        name: 'Writing Virtuoso',
        description: 'Score 95%+ on writing assessments 3 times',
        icon: '✍️',
        category: 'skill_mastery',
        rarity: 'epic',
        requirement: { type: 'skill_proficiency', target: 95, skill: 'writing' },
        points: 250,
        unlocked: false,
        progress: 0,
        maxProgress: 3
      },
      {
        id: 'listening_expert',
        name: 'Listening Expert',
        description: 'Score 90%+ on listening assessments 5 times',
        icon: '👂',
        category: 'skill_mastery',
        rarity: 'rare',
        requirement: { type: 'skill_proficiency', target: 90, skill: 'listening' },
        points: 200,
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },

      // Exam-Style Achievements
      {
        id: 'exam_ready',
        name: 'Exam Ready',
        description: 'Pass an exam-style assessment with 80%+',
        icon: '🎓',
        category: 'assessment',
        rarity: 'rare',
        requirement: { type: 'score_threshold', target: 80, assessmentType: 'exam-style' },
        points: 200,
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'exam_master',
        name: 'Exam Master',
        description: 'Score 95%+ on exam-style assessments',
        icon: '👑',
        category: 'assessment',
        rarity: 'legendary',
        requirement: { type: 'score_threshold', target: 95, assessmentType: 'exam-style' },
        points: 500,
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },

      // Improvement Achievements
      {
        id: 'rapid_improver',
        name: 'Rapid Improver',
        description: 'Improve your assessment score by 20% or more',
        icon: '📈',
        category: 'improvement',
        rarity: 'rare',
        requirement: { type: 'improvement_rate', target: 20 },
        points: 150,
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'consistent_performer',
        name: 'Consistent Performer',
        description: 'Score 75%+ on 10 assessments',
        icon: '🎯',
        category: 'consistency',
        rarity: 'epic',
        requirement: { type: 'score_threshold', target: 75 },
        points: 300,
        unlocked: false,
        progress: 0,
        maxProgress: 10
      }
    ];
  }

  async processAssessmentCompletion(data: AssessmentGamificationData): Promise<{
    pointsEarned: number;
    achievementsUnlocked: AssessmentAchievement[];
    gemType: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    bonusMultiplier: number;
  }> {
    // Calculate base points based on performance
    const basePoints = this.calculateBasePoints(data);
    
    // Determine gem type based on performance
    const gemType = this.determineGemType(data.percentage);
    
    // Calculate bonus multiplier
    const bonusMultiplier = this.calculateBonusMultiplier(data);
    
    // Final points with bonuses
    const pointsEarned = Math.round(basePoints * bonusMultiplier);

    // Check for achievements
    const achievementsUnlocked = await this.checkAssessmentAchievements(data);

    // Save assessment progress
    await this.saveAssessmentProgress(data, pointsEarned, gemType);

    // Update user's overall gamification stats
    await this.updateUserGamificationStats(data.userId, pointsEarned, achievementsUnlocked);

    return {
      pointsEarned,
      achievementsUnlocked,
      gemType,
      bonusMultiplier
    };
  }

  private calculateBasePoints(data: AssessmentGamificationData): number {
    const { assessmentType, percentage, timeSpent } = data;
    
    // Base points by assessment type
    const basePointsByType = {
      'reading-comprehension': 100,
      'four-skills': 200,
      'exam-style': 150
    };

    let basePoints = basePointsByType[assessmentType];
    
    // Performance multiplier (0.5x to 2x based on percentage)
    const performanceMultiplier = Math.max(0.5, Math.min(2.0, percentage / 50));
    
    // Time bonus (faster completion = more points, up to 20% bonus)
    const expectedTime = this.getExpectedTime(assessmentType);
    const timeBonus = timeSpent < expectedTime ? 
      Math.min(0.2, (expectedTime - timeSpent) / expectedTime) : 0;
    
    return Math.round(basePoints * performanceMultiplier * (1 + timeBonus));
  }

  private determineGemType(percentage: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    if (percentage >= 95) return 'legendary';
    if (percentage >= 85) return 'epic';
    if (percentage >= 75) return 'rare';
    if (percentage >= 65) return 'uncommon';
    return 'common';
  }

  private calculateBonusMultiplier(data: AssessmentGamificationData): number {
    let multiplier = 1.0;
    
    // Streak bonus (up to 50% bonus for 10+ streak)
    if (data.streak > 0) {
      multiplier += Math.min(0.5, data.streak * 0.05);
    }
    
    // Perfect score bonus
    if (data.percentage === 100) {
      multiplier += 0.25;
    }
    
    // Improvement bonus
    if (data.previousBestScore && data.percentage > data.previousBestScore) {
      const improvement = data.percentage - data.previousBestScore;
      multiplier += Math.min(0.3, improvement * 0.01);
    }
    
    return multiplier;
  }

  private getExpectedTime(assessmentType: string): number {
    const expectedTimes = {
      'reading-comprehension': 20 * 60, // 20 minutes
      'four-skills': 45 * 60, // 45 minutes
      'exam-style': 35 * 60 // 35 minutes
    };
    return expectedTimes[assessmentType as keyof typeof expectedTimes] || 30 * 60;
  }

  private async checkAssessmentAchievements(data: AssessmentGamificationData): Promise<AssessmentAchievement[]> {
    const unlockedAchievements: AssessmentAchievement[] = [];

    // Get user's current achievement progress
    const { data: userAchievements } = await this.supabase
      .from('student_achievements')
      .select('achievement_type')
      .eq('student_id', data.userId)
      .eq('achievement_category', 'assessment');

    const unlockedIds = new Set(userAchievements?.map(a => a.achievement_type) || []);

    for (const achievement of this.achievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let shouldUnlock = false;
      let progress = 0;

      switch (achievement.requirement.type) {
        case 'score_threshold':
          if (!achievement.requirement.assessmentType || 
              achievement.requirement.assessmentType === data.assessmentType) {
            progress = data.percentage >= achievement.requirement.target ? 1 : 0;
            shouldUnlock = progress > 0;
          }
          break;

        case 'perfect_assessment':
          if (data.percentage === 100 && 
              (!achievement.requirement.assessmentType || 
               achievement.requirement.assessmentType === data.assessmentType)) {
            progress = 1;
            shouldUnlock = true;
          }
          break;

        case 'skill_proficiency':
          if (data.skillResults && achievement.requirement.skill) {
            const skillScore = data.skillResults[achievement.requirement.skill];
            if (skillScore && skillScore >= achievement.requirement.target) {
              progress = Math.min(achievement.progress + 1, achievement.maxProgress);
              shouldUnlock = progress >= achievement.maxProgress;
            }
          } else if (!achievement.requirement.skill) {
            // Check if all skills meet the threshold
            const allSkillsMeetThreshold = data.skillResults && 
              Object.values(data.skillResults).every(score => score >= achievement.requirement.target);
            if (allSkillsMeetThreshold) {
              progress = 1;
              shouldUnlock = true;
            }
          }
          break;

        case 'completion_streak':
          if (data.passed && 
              (!achievement.requirement.assessmentType || 
               achievement.requirement.assessmentType === data.assessmentType)) {
            progress = Math.min(data.streak, achievement.requirement.target);
            shouldUnlock = progress >= achievement.requirement.target;
          }
          break;

        case 'improvement_rate':
          if (data.previousBestScore && data.percentage > data.previousBestScore) {
            const improvement = data.percentage - data.previousBestScore;
            if (improvement >= achievement.requirement.target) {
              progress = 1;
              shouldUnlock = true;
            }
          }
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.progress = achievement.maxProgress;
        achievement.unlockedAt = new Date();
        unlockedAchievements.push({ ...achievement });

        // Save achievement to database
        await this.saveAchievement(data.userId, achievement);
      }
    }

    return unlockedAchievements;
  }

  private async saveAchievement(userId: string, achievement: AssessmentAchievement): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('student_achievements')
        .insert({
          student_id: userId,
          achievement_type: achievement.id,
          achievement_category: achievement.category,
          title: achievement.name,
          description: achievement.description,
          icon_name: achievement.icon,
          rarity: achievement.rarity,
          points_awarded: achievement.points,
          game_type: 'assessment'
        });

      if (error) {
        console.error('Error saving assessment achievement:', error);
      }
    } catch (error) {
      console.error('Error saving assessment achievement:', error);
    }
  }

  private async saveAssessmentProgress(
    data: AssessmentGamificationData, 
    pointsEarned: number, 
    gemType: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('assessment_progress')
        .insert({
          user_id: data.userId,
          assessment_type: data.assessmentType,
          score: data.overallScore,
          max_score: data.maxScore,
          percentage: data.percentage,
          time_spent: data.timeSpent,
          passed: data.passed,
          points_earned: pointsEarned,
          gem_type: gemType,
          skill_results: data.skillResults,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving assessment progress:', error);
      }
    } catch (error) {
      console.error('Error saving assessment progress:', error);
    }
  }

  private async updateUserGamificationStats(
    userId: string, 
    pointsEarned: number, 
    achievements: AssessmentAchievement[]
  ): Promise<void> {
    try {
      // Update user's total points and achievement count
      const achievementPoints = achievements.reduce((sum, a) => sum + a.points, 0);
      const totalPointsEarned = pointsEarned + achievementPoints;

      const { error } = await this.supabase.rpc('update_user_gamification_stats', {
        p_user_id: userId,
        p_points_to_add: totalPointsEarned,
        p_achievements_unlocked: achievements.length
      });

      if (error) {
        console.error('Error updating user gamification stats:', error);
      }
    } catch (error) {
      console.error('Error updating user gamification stats:', error);
    }
  }

  // Get user's assessment achievements
  async getUserAssessmentAchievements(userId: string): Promise<AssessmentAchievement[]> {
    try {
      const { data, error } = await this.supabase
        .from('student_achievements')
        .select('*')
        .eq('student_id', userId)
        .eq('game_type', 'assessment');

      if (error) {
        console.error('Error fetching user assessment achievements:', error);
        return [];
      }

      return data.map(dbAchievement => {
        const achievement = this.achievements.find(a => a.id === dbAchievement.achievement_type);
        if (achievement) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date(dbAchievement.created_at)
          };
        }
        return null;
      }).filter(Boolean) as AssessmentAchievement[];
    } catch (error) {
      console.error('Error fetching user assessment achievements:', error);
      return [];
    }
  }
}
