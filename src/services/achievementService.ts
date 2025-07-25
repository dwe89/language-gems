import { GemType } from '../components/ui/GemIcon';
import { SupabaseClient } from '@supabase/supabase-js';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'gems' | 'streak' | 'level' | 'practice' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: 'gem_count' | 'gem_type_count' | 'streak' | 'level' | 'words_practiced' | 'perfect_session';
    target: number;
    gemType?: GemType;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export class AchievementService {
  private supabase: SupabaseClient | null = null;
  private userId: string | null = null;
  private unlockedAchievementIds: Set<string> = new Set();
  private achievements: Achievement[] = [
    // Gem Collection Achievements
    {
      id: 'first_gem',
      name: 'First Gem',
      description: 'Collect your first gem',
      icon: '💎',
      category: 'gems',
      rarity: 'common',
      requirement: { type: 'gem_count', target: 1 },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'gem_collector',
      name: 'Gem Collector',
      description: 'Collect 10 gems',
      icon: '💍',
      category: 'gems',
      rarity: 'common',
      requirement: { type: 'gem_count', target: 10 },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'gem_hoarder',
      name: 'Gem Hoarder',
      description: 'Collect 50 gems',
      icon: '👑',
      category: 'gems',
      rarity: 'rare',
      requirement: { type: 'gem_count', target: 50 },
      unlocked: false,
      progress: 0,
      maxProgress: 50
    },
    {
      id: 'first_uncommon',
      name: 'Rising Star',
      description: 'Earn your first Uncommon gem',
      icon: '⭐',
      category: 'gems',
      rarity: 'common',
      requirement: { type: 'gem_type_count', target: 1, gemType: 'uncommon' },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'first_rare',
      name: 'Rare Collector',
      description: 'Earn your first Rare gem',
      icon: '🔮',
      category: 'gems',
      rarity: 'rare',
      requirement: { type: 'gem_type_count', target: 1, gemType: 'rare' },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'first_epic',
      name: 'Epic Master',
      description: 'Earn your first Epic gem',
      icon: '💜',
      category: 'gems',
      rarity: 'epic',
      requirement: { type: 'gem_type_count', target: 1, gemType: 'epic' },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'first_legendary',
      name: 'Legendary Scholar',
      description: 'Earn your first Legendary gem',
      icon: '🏆',
      category: 'gems',
      rarity: 'legendary',
      requirement: { type: 'gem_type_count', target: 1, gemType: 'legendary' },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    
    // Streak Achievements
    {
      id: 'streak_5',
      name: 'On Fire',
      description: 'Get 5 correct answers in a row',
      icon: '🔥',
      category: 'streak',
      rarity: 'common',
      requirement: { type: 'streak', target: 5 },
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'streak_10',
      name: 'Unstoppable',
      description: 'Get 10 correct answers in a row',
      icon: '⚡',
      category: 'streak',
      rarity: 'rare',
      requirement: { type: 'streak', target: 10 },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    
    // Level Achievements
    {
      id: 'level_5',
      name: 'Rising Student',
      description: 'Reach level 5',
      icon: '📚',
      category: 'level',
      rarity: 'common',
      requirement: { type: 'level', target: 5 },
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'level_10',
      name: 'Dedicated Learner',
      description: 'Reach level 10',
      icon: '🎓',
      category: 'level',
      rarity: 'rare',
      requirement: { type: 'level', target: 10 },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    
    // Practice Achievements
    {
      id: 'words_100',
      name: 'Vocabulary Builder',
      description: 'Practice 100 words',
      icon: '📖',
      category: 'practice',
      rarity: 'common',
      requirement: { type: 'words_practiced', target: 100 },
      unlocked: false,
      progress: 0,
      maxProgress: 100
    },
    {
      id: 'perfect_session',
      name: 'Perfectionist',
      description: 'Complete a session with 100% accuracy',
      icon: '✨',
      category: 'mastery',
      rarity: 'epic',
      requirement: { type: 'perfect_session', target: 1 },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    }
  ];

  private unlockedAchievements: Achievement[] = [];

  // Initialize with Supabase client and user ID
  async initialize(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
    await this.loadUnlockedAchievements();
  }

  // Load unlocked achievements from database
  private async loadUnlockedAchievements() {
    if (!this.supabase || !this.userId) return;

    try {
      const { data, error } = await this.supabase
        .from('achievements')
        .select('achievement_key, achieved_at')
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error loading achievements:', error);
        return;
      }

      this.unlockedAchievementIds.clear();
      data?.forEach(achievement => {
        this.unlockedAchievementIds.add(achievement.achievement_key);
      });

    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }

  // Save achievement to database
  private async saveAchievement(achievement: Achievement) {
    if (!this.supabase || !this.userId) return;

    try {
      const { error } = await this.supabase
        .from('achievements')
        .insert({
          user_id: this.userId,
          achievement_key: achievement.id,
          game_type: 'vocabulary-mining',
          achievement_data: {
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            category: achievement.category,
            rarity: achievement.rarity,
            points_awarded: this.getPointsForRarity(achievement.rarity)
          },
          criteria: {
            requirement: achievement.requirement,
            progress: achievement.progress,
            maxProgress: achievement.maxProgress
          }
        });

      if (error) {
        console.error('Error saving achievement:', error);
      } else {
        console.log('Achievement saved:', achievement.name);
        this.unlockedAchievementIds.add(achievement.id);
      }
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  }

  // Get points for rarity
  private getPointsForRarity(rarity: string): number {
    const pointsMap = {
      'common': 10,
      'rare': 25,
      'epic': 50,
      'legendary': 100
    };
    return pointsMap[rarity as keyof typeof pointsMap] || 10;
  }

  // Check for newly unlocked achievements
  async checkAchievements(stats: {
    gemsCollected: number;
    gemsByType: Record<GemType, number>;
    currentStreak: number;
    maxStreak: number;
    currentLevel: number;
    wordsPracticed: number;
    sessionAccuracy: number;
  }): Promise<Achievement[]> {
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of this.achievements) {
      // Skip if already unlocked
      if (this.unlockedAchievementIds.has(achievement.id)) continue;

      let progress = 0;
      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'gem_count':
          progress = stats.gemsCollected;
          shouldUnlock = progress >= achievement.requirement.target;
          break;
          
        case 'gem_type_count':
          if (achievement.requirement.gemType) {
            progress = stats.gemsByType[achievement.requirement.gemType] || 0;
            shouldUnlock = progress >= achievement.requirement.target;
          }
          break;
          
        case 'streak':
          progress = stats.maxStreak;
          shouldUnlock = progress >= achievement.requirement.target;
          break;
          
        case 'level':
          progress = stats.currentLevel;
          shouldUnlock = progress >= achievement.requirement.target;
          break;
          
        case 'words_practiced':
          progress = stats.wordsPracticed;
          shouldUnlock = progress >= achievement.requirement.target;
          break;
          
        case 'perfect_session':
          progress = stats.sessionAccuracy >= 1.0 ? 1 : 0;
          shouldUnlock = progress >= achievement.requirement.target;
          break;
      }

      achievement.progress = Math.min(progress, achievement.maxProgress);

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push({ ...achievement });
        
        // Save to database
        await this.saveAchievement(achievement);
      }
    }

    return newlyUnlocked;
  }

  // Get all achievements
  getAllAchievements(): Achievement[] {
    return [...this.achievements];
  }

  // Get unlocked achievements
  getUnlockedAchievements(): Achievement[] {
    return [...this.unlockedAchievements];
  }

  // Get achievements by category
  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  // Get achievement progress percentage
  getOverallProgress(): number {
    const unlockedCount = this.achievements.filter(a => a.unlocked).length;
    return (unlockedCount / this.achievements.length) * 100;
  }

  // Reset achievements (for testing)
  reset(): void {
    this.achievements.forEach(achievement => {
      achievement.unlocked = false;
      achievement.unlockedAt = undefined;
      achievement.progress = 0;
    });
    this.unlockedAchievements = [];
  }
}

// Singleton instance
export const achievementService = new AchievementService();
