import { SupabaseClient } from '@supabase/supabase-js';

export interface DataVerificationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    totalXP: number;
    calculatedLevel: number;
    gamesPlayed: number;
    averageAccuracy: number;
    totalTimeSpent: number;
    achievementCount: number;
    assignmentCount: number;
  };
}

export class StudentDataVerificationService {
  constructor(private supabase: SupabaseClient) {}

  async verifyStudentData(studentId: string): Promise<DataVerificationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      // Fetch all relevant data
      const [
        gameSessionsData,
        achievementsData,
        assignmentsData,
        profileData
      ] = await Promise.all([
        this.getGameSessionsData(studentId),
        this.getAchievementsData(studentId),
        this.getAssignmentsData(studentId),
        this.getProfileData(studentId)
      ]);

      // Calculate metrics from raw data
      const totalXP = gameSessionsData.reduce((sum, session) => sum + (session.xp_earned || 0), 0);
      const calculatedLevel = this.calculateLevel(totalXP);
      const gamesPlayed = gameSessionsData.length;
      const averageAccuracy = gamesPlayed > 0
        ? gameSessionsData.reduce((sum, session) => sum + (session.accuracy_percentage || 0), 0) / gamesPlayed
        : 0;
      const totalTimeSpent = gameSessionsData.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
      const achievementCount = achievementsData.length;
      const assignmentCount = assignmentsData.length;

      // Verification checks
      this.verifyXPConsistency(totalXP, profileData, errors, warnings);
      this.verifyLevelConsistency(calculatedLevel, profileData, errors, warnings);
      this.verifyGameSessionConsistency(gameSessionsData, errors, warnings);
      this.verifyAchievementConsistency(achievementsData, totalXP, errors, warnings);
      this.verifyAccuracyBounds(averageAccuracy, errors, warnings);
      this.verifyTimeConsistency(totalTimeSpent, gamesPlayed, errors, warnings);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        metrics: {
          totalXP,
          calculatedLevel,
          gamesPlayed,
          averageAccuracy: Math.round(averageAccuracy * 10) / 10,
          totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
          achievementCount,
          assignmentCount
        }
      };
    } catch (error) {
      errors.push(`Data verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        errors,
        warnings,
        metrics: {
          totalXP: 0,
          calculatedLevel: 1,
          gamesPlayed: 0,
          averageAccuracy: 0,
          totalTimeSpent: 0,
          achievementCount: 0,
          assignmentCount: 0
        }
      };
    }
  }

  private async getGameSessionsData(studentId: string) {
    const { data, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('*')
      .eq('student_id', studentId);
    
    if (error) throw error;
    return data || [];
  }

  private async getAchievementsData(studentId: string) {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('user_id', studentId);
    
    if (error) throw error;
    return data || [];
  }

  private async getAssignmentsData(studentId: string) {
    const { data, error } = await this.supabase
      .from('assignments')
      .select('*')
      .eq('student_id', studentId);

    if (error && error.code !== 'PGRST116') {
      // Try alternative assignment tables if main one fails
      const { data: altData } = await this.supabase
        .from('enhanced_assignment_progress')
        .select('*')
        .eq('student_id', studentId);
      return altData || [];
    }
    return data || [];
  }

  private async getProfileData(studentId: string) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  private calculateLevel(totalXP: number): number {
    // Using exponential growth: Level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  }

  private verifyXPConsistency(calculatedXP: number, profile: any, errors: string[], warnings: string[]) {
    if (profile?.total_xp && Math.abs(profile.total_xp - calculatedXP) > 10) {
      errors.push(`XP mismatch: Profile shows ${profile.total_xp} XP, but game sessions total ${calculatedXP} XP`);
    }
  }

  private verifyLevelConsistency(calculatedLevel: number, profile: any, errors: string[], warnings: string[]) {
    if (profile?.current_level && profile.current_level !== calculatedLevel) {
      warnings.push(`Level mismatch: Profile shows level ${profile.current_level}, but calculated level is ${calculatedLevel}`);
    }
  }

  private verifyGameSessionConsistency(sessions: any[], errors: string[], warnings: string[]) {
    sessions.forEach((session, index) => {
      if (session.accuracy_percentage < 0 || session.accuracy_percentage > 100) {
        errors.push(`Session ${index + 1}: Invalid accuracy ${session.accuracy_percentage}% (must be 0-100%)`);
      }
      if (session.final_score < 0) {
        errors.push(`Session ${index + 1}: Invalid negative score ${session.final_score}`);
      }
      if (session.duration_seconds < 0) {
        errors.push(`Session ${index + 1}: Invalid negative duration ${session.duration_seconds}`);
      }
      if (session.xp_earned < 0) {
        errors.push(`Session ${index + 1}: Invalid negative XP ${session.xp_earned}`);
      }
    });
  }

  private verifyAchievementConsistency(achievements: any[], totalXP: number, errors: string[], warnings: string[]) {
    const achievementXP = achievements.reduce((sum, achievement) => 
      sum + (achievement.achievement_data?.points_awarded || 0), 0);
    
    if (achievementXP > totalXP) {
      warnings.push(`Achievement XP (${achievementXP}) exceeds total XP (${totalXP})`);
    }
  }

  private verifyAccuracyBounds(averageAccuracy: number, errors: string[], warnings: string[]) {
    if (averageAccuracy < 0 || averageAccuracy > 100) {
      errors.push(`Invalid average accuracy: ${averageAccuracy}% (must be 0-100%)`);
    }
    if (averageAccuracy > 95) {
      warnings.push(`Unusually high accuracy: ${averageAccuracy}% - verify data integrity`);
    }
  }

  private verifyTimeConsistency(totalTime: number, gamesPlayed: number, errors: string[], warnings: string[]) {
    if (gamesPlayed > 0) {
      const avgTimePerGame = totalTime / gamesPlayed;
      if (avgTimePerGame < 10) { // Less than 10 seconds per game
        warnings.push(`Very short average game time: ${Math.round(avgTimePerGame)}s per game`);
      }
      if (avgTimePerGame > 3600) { // More than 1 hour per game
        warnings.push(`Very long average game time: ${Math.round(avgTimePerGame / 60)}min per game`);
      }
    }
  }

  async generateVerificationReport(studentId: string): Promise<string> {
    const result = await this.verifyStudentData(studentId);
    
    let report = `# Student Data Verification Report\n`;
    report += `Student ID: ${studentId}\n`;
    report += `Verification Status: ${result.isValid ? '✅ PASSED' : '❌ FAILED'}\n\n`;
    
    report += `## Calculated Metrics\n`;
    report += `- Total XP: ${result.metrics.totalXP}\n`;
    report += `- Calculated Level: ${result.metrics.calculatedLevel}\n`;
    report += `- Games Played: ${result.metrics.gamesPlayed}\n`;
    report += `- Average Accuracy: ${result.metrics.averageAccuracy}%\n`;
    report += `- Total Time Spent: ${result.metrics.totalTimeSpent} minutes\n`;
    report += `- Achievement Count: ${result.metrics.achievementCount}\n`;
    report += `- Assignment Count: ${result.metrics.assignmentCount}\n\n`;
    
    if (result.errors.length > 0) {
      report += `## ❌ Errors (${result.errors.length})\n`;
      result.errors.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`;
      });
      report += `\n`;
    }
    
    if (result.warnings.length > 0) {
      report += `## ⚠️ Warnings (${result.warnings.length})\n`;
      result.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`;
      });
      report += `\n`;
    }
    
    if (result.isValid && result.warnings.length === 0) {
      report += `## ✅ All Checks Passed\n`;
      report += `Student data is consistent and accurate.\n`;
    }
    
    return report;
  }
}
