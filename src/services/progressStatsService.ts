import { SupabaseClient } from '@supabase/supabase-js';
import { GemType } from '../components/ui/GemIcon';

export interface ProgressStats {
  // Overall Progress
  totalWordsLearned: number;
  totalXP: number;
  currentLevel: number;
  
  // Gem Statistics
  gemsByType: Record<GemType, number>;
  totalGems: number;
  
  // Mastery Statistics
  wordsMastered: number; // Legendary gems
  wordsInProgress: number; // Common to Epic gems
  accuracyRate: number;
  
  // Streak Statistics
  currentStreak: number;
  longestStreak: number;
  streakThisWeek: number;
  
  // Time-based Statistics
  practiceTimeToday: number; // minutes
  practiceTimeThisWeek: number; // minutes
  practiceTimeTotal: number; // minutes
  
  // Daily Goals
  dailyGoalProgress: {
    wordsTarget: number;
    wordsCompleted: number;
    minutesTarget: number;
    minutesCompleted: number;
    streakTarget: number;
    streakCompleted: number;
  };
  
  // Recent Activity
  recentSessions: Array<{
    date: Date;
    wordsLearned: number;
    accuracy: number;
    timeSpent: number;
    xpGained: number;
  }>;
}

export class ProgressStatsService {
  constructor(private supabase: SupabaseClient) {}

  async getUserProgressStats(userId: string): Promise<ProgressStats> {
    try {
      // Get gem collection data
      const { data: gemData } = await this.supabase
        .from('vocabulary_gem_collection')
        .select('mastery_level, total_encounters, correct_encounters, current_streak, best_streak')
        .eq('student_id', userId);

      // Calculate gem statistics
      const gemsByType: Record<GemType, number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      };

      let totalGems = 0;
      let wordsMastered = 0;
      let wordsInProgress = 0;
      let totalCorrect = 0;
      let totalAttempts = 0;
      let longestStreak = 0;

      gemData?.forEach(gem => {
        totalGems++;
        totalCorrect += gem.correct_encounters || 0;
        totalAttempts += gem.total_encounters || 0;
        longestStreak = Math.max(longestStreak, gem.best_streak || 0);

        const masteryLevel = gem.mastery_level || 0;
        if (masteryLevel >= 4) {
          gemsByType.legendary++;
          wordsMastered++;
        } else if (masteryLevel >= 3) {
          gemsByType.epic++;
          wordsInProgress++;
        } else if (masteryLevel >= 2) {
          gemsByType.rare++;
          wordsInProgress++;
        } else if (masteryLevel >= 1) {
          gemsByType.uncommon++;
          wordsInProgress++;
        } else {
          gemsByType.common++;
          wordsInProgress++;
        }
      });

      // Calculate accuracy rate
      const accuracyRate = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

      // Get daily goals (mock data for now)
      const dailyGoalProgress = {
        wordsTarget: 20,
        wordsCompleted: Math.min(totalGems, 20),
        minutesTarget: 30,
        minutesCompleted: 15, // This would come from session tracking
        streakTarget: 5,
        streakCompleted: Math.min(longestStreak, 5)
      };

      // Mock recent sessions (in a real app, this would come from session tracking)
      const recentSessions = [
        {
          date: new Date(),
          wordsLearned: 8,
          accuracy: 0.85,
          timeSpent: 15,
          xpGained: 120
        },
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          wordsLearned: 12,
          accuracy: 0.92,
          timeSpent: 22,
          xpGained: 180
        }
      ];

      return {
        totalWordsLearned: totalGems,
        totalXP: totalCorrect * 25, // Rough XP calculation
        currentLevel: Math.floor(totalCorrect / 10) + 1,
        gemsByType,
        totalGems,
        wordsMastered,
        wordsInProgress,
        accuracyRate,
        currentStreak: 0, // Would need to track current session
        longestStreak,
        streakThisWeek: longestStreak, // Simplified
        practiceTimeToday: 15,
        practiceTimeThisWeek: 45,
        practiceTimeTotal: 180,
        dailyGoalProgress,
        recentSessions
      };
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      
      // Return default stats on error
      return {
        totalWordsLearned: 0,
        totalXP: 0,
        currentLevel: 1,
        gemsByType: {
          common: 0,
          uncommon: 0,
          rare: 0,
          epic: 0,
          legendary: 0
        },
        totalGems: 0,
        wordsMastered: 0,
        wordsInProgress: 0,
        accuracyRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        streakThisWeek: 0,
        practiceTimeToday: 0,
        practiceTimeThisWeek: 0,
        practiceTimeTotal: 0,
        dailyGoalProgress: {
          wordsTarget: 20,
          wordsCompleted: 0,
          minutesTarget: 30,
          minutesCompleted: 0,
          streakTarget: 5,
          streakCompleted: 0
        },
        recentSessions: []
      };
    }
  }

  async updateDailyGoals(userId: string, goals: {
    wordsTarget?: number;
    minutesTarget?: number;
    streakTarget?: number;
  }): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if daily goal exists for today
      const { data: existingGoal } = await this.supabase
        .from('vocabulary_daily_goals')
        .select('*')
        .eq('student_id', userId)
        .eq('goal_date', today)
        .single();

      if (existingGoal) {
        // Update existing goal
        await this.supabase
          .from('vocabulary_daily_goals')
          .update({
            target_words: goals.wordsTarget || existingGoal.target_words,
            target_minutes: goals.minutesTarget || existingGoal.target_minutes,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', userId)
          .eq('goal_date', today);
      } else {
        // Create new goal
        await this.supabase
          .from('vocabulary_daily_goals')
          .insert({
            student_id: userId,
            goal_date: today,
            target_words: goals.wordsTarget || 20,
            target_minutes: goals.minutesTarget || 30,
            words_practiced: 0,
            minutes_practiced: 0,
            gems_collected: 0,
            goal_completed: false,
            streak_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error updating daily goals:', error);
    }
  }

  async recordPracticeSession(userId: string, sessionData: {
    wordsLearned: number;
    timeSpent: number; // minutes
    gemsCollected: number;
    accuracy: number;
  }): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Update daily goals progress
      const { data: dailyGoal } = await this.supabase
        .from('vocabulary_daily_goals')
        .select('*')
        .eq('student_id', userId)
        .eq('goal_date', today)
        .single();

      if (dailyGoal) {
        const newWordsCount = dailyGoal.words_practiced + sessionData.wordsLearned;
        const newMinutesCount = dailyGoal.minutes_practiced + sessionData.timeSpent;
        const newGemsCount = dailyGoal.gems_collected + sessionData.gemsCollected;
        
        const goalCompleted = 
          newWordsCount >= dailyGoal.target_words && 
          newMinutesCount >= dailyGoal.target_minutes;

        await this.supabase
          .from('vocabulary_daily_goals')
          .update({
            words_practiced: newWordsCount,
            minutes_practiced: newMinutesCount,
            gems_collected: newGemsCount,
            goal_completed: goalCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', userId)
          .eq('goal_date', today);
      }
    } catch (error) {
      console.error('Error recording practice session:', error);
    }
  }
}

export const progressStatsService = new ProgressStatsService(
  // This would be injected in a real app
  {} as SupabaseClient
);
