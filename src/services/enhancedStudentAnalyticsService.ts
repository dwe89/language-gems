import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface StudentAnalyticsData {
  overview: StudentOverviewMetrics;
  gamePerformance: StudentGamePerformance[];
  progressTrends: StudentProgressTrend[];
  achievements: StudentAchievement[];
  streakData: StudentStreakData;
  vocabularyMastery: VocabularyMasteryData;
  assignmentProgress: StudentAssignmentProgress[];
  weeklyActivity: WeeklyActivityData[];
  skillBreakdown: SkillBreakdownData;
  motivationalMetrics: MotivationalMetrics;
}

export interface StudentOverviewMetrics {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  averageAccuracy: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  totalGamesPlayed: number;
  wordsLearned: number;
  achievementCount: number;
  classRank: number;
  schoolRank: number;
  improvementRate: number; // percentage
}

export interface StudentGamePerformance {
  gameType: string;
  gameName: string;
  sessionsPlayed: number;
  averageScore: number;
  bestScore: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  difficultyLevel: number;
  lastPlayed: string;
  improvementTrend: 'improving' | 'stable' | 'declining';
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface StudentProgressTrend {
  date: string;
  xpEarned: number;
  accuracy: number;
  timeSpent: number;
  assignmentsCompleted: number;
  gamesPlayed: number;
}

export interface StudentAchievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  earnedAt: string;
  xpReward: number;
  isNew: boolean;
}

export interface StudentStreakData {
  currentStreak: number;
  longestStreak: number;
  streakType: 'daily' | 'weekly';
  lastActivityDate: string;
  streakGoal: number;
  daysUntilStreakLoss: number;
  streakRewards: StreakReward[];
}

export interface StreakReward {
  streakLength: number;
  reward: string;
  xpBonus: number;
  achieved: boolean;
}

export interface VocabularyMasteryData {
  totalWords: number;
  masteredWords: number;
  wordsInProgress: number;
  wordsNeedingReview: number;
  categoryBreakdown: CategoryMastery[];
  recentlyLearned: RecentWord[];
  masteryRate: number;
}

export interface CategoryMastery {
  category: string;
  totalWords: number;
  masteredWords: number;
  averageAccuracy: number;
  timeSpent: number;
}

export interface RecentWord {
  word: string;
  translation: string;
  category: string;
  masteredAt: string;
  accuracy: number;
}

export interface StudentAssignmentProgress {
  assignmentId: string;
  title: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  completionPercentage: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  gamesCompleted: number;
  totalGames: number;
  lastWorkedOn: string;
}

export interface WeeklyActivityData {
  date: string;
  minutesPlayed: number;
  xpEarned: number;
  assignmentsWorked: number;
  gamesPlayed: number;
  accuracy: number;
}

export interface SkillBreakdownData {
  vocabulary: number;
  grammar: number;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}

export interface MotivationalMetrics {
  engagementLevel: 'low' | 'medium' | 'high';
  motivationScore: number; // 0-100
  consistencyScore: number; // 0-100
  challengePreference: 'easy' | 'medium' | 'hard';
  preferredGameTypes: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  nextMilestone: {
    type: 'level' | 'achievement' | 'streak';
    description: string;
    progress: number;
    target: number;
  };
}

// =====================================================
// ENHANCED STUDENT ANALYTICS SERVICE
// =====================================================

export class EnhancedStudentAnalyticsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getStudentAnalytics(
    studentId: string,
    dateRange?: { from: string; to: string }
  ): Promise<StudentAnalyticsData> {
    try {
      const [
        overview,
        gamePerformance,
        progressTrends,
        achievements,
        streakData,
        vocabularyMastery,
        assignmentProgress,
        weeklyActivity,
        skillBreakdown,
        motivationalMetrics
      ] = await Promise.all([
        this.getStudentOverview(studentId, dateRange),
        this.getGamePerformance(studentId, dateRange),
        this.getProgressTrends(studentId, dateRange),
        this.getAchievements(studentId),
        this.getStreakData(studentId),
        this.getVocabularyMastery(studentId, dateRange),
        this.getAssignmentProgress(studentId),
        this.getWeeklyActivity(studentId, dateRange),
        this.getSkillBreakdown(studentId, dateRange),
        this.getMotivationalMetrics(studentId, dateRange)
      ]);

      return {
        overview,
        gamePerformance,
        progressTrends,
        achievements,
        streakData,
        vocabularyMastery,
        assignmentProgress,
        weeklyActivity,
        skillBreakdown,
        motivationalMetrics
      };
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      throw error;
    }
  }

  private async getStudentOverview(
    studentId: string,
    dateRange?: { from: string; to: string }
  ): Promise<StudentOverviewMetrics> {
    // Get user profile data (basic info)
    const { data: profile } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    // Get assignment data
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select(`
        id,
        title,
        status,
        enhanced_assignment_progress!inner(
          id,
          status,
          best_score,
          completed_at
        )
      `)
      .eq('enhanced_assignment_progress.student_id', studentId);

    // Get ALL game session data for accurate metrics
    const { data: sessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('*')
      .eq('student_id', studentId);

    // Get achievements count
    const { data: achievements } = await this.supabase
      .from('student_achievements')
      .select('id')
      .eq('student_id', studentId);

    // Calculate metrics from actual data
    const totalAssignments = assignments?.length || 0;
    const completedAssignments = assignments?.filter(a =>
      a.enhanced_assignment_progress.some(s => s.status === 'completed')
    ).length || 0;

    // Calculate total XP from all sessions
    const totalXP = sessions?.reduce((sum, s) => sum + (s.xp_earned || 0), 0) || 0;

    // Calculate average accuracy (already in percentage format)
    const averageAccuracy = sessions?.length > 0
      ? sessions.reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / sessions.length
      : 0;

    // Calculate total time spent in minutes
    const totalTimeSpent = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;

    // Calculate level from total XP (using same logic as dashboard)
    let level = 1;
    let xpRequired = 100;
    let totalXpForLevel = 0;
    let tempXP = totalXP;

    while (totalXpForLevel + xpRequired <= tempXP) {
      totalXpForLevel += xpRequired;
      level++;
      xpRequired = Math.floor(100 * Math.pow(1.5, level - 1));
    }

    const xpForNextLevel = Math.floor(100 * Math.pow(1.5, level - 1));
    const xpToNext = xpForNextLevel - (tempXP - totalXpForLevel);

    return {
      totalXP,
      currentLevel: level,
      xpToNextLevel: xpToNext,
      totalAssignments,
      completedAssignments,
      averageScore: Math.round(averageAccuracy || 0), // Use accuracy as "score" since final_score is raw points
      averageAccuracy: Math.round((averageAccuracy || 0) * 10) / 10,
      totalTimeSpent: Math.round(totalTimeSpent || 0),
      currentStreak: 0, // TODO: Calculate from session dates
      longestStreak: 0, // TODO: Calculate from session dates
      totalGamesPlayed: sessions?.length || 0,
      wordsLearned: 0, // TODO: Calculate from vocabulary progress
      achievementCount: achievements?.length || 0,
      classRank: 1, // TODO: Calculate actual rank
      schoolRank: 1, // TODO: Calculate actual rank
      improvementRate: 0 // TODO: Calculate improvement rate
    };
  }

  private async getGamePerformance(
    studentId: string,
    dateRange?: { from: string; to: string }
  ): Promise<StudentGamePerformance[]> {
    const { data: sessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('*')
      .eq('student_id', studentId)
      .gte('started_at', dateRange?.from || '2024-01-01')
      .lte('started_at', dateRange?.to || new Date().toISOString())
      .order('started_at', { ascending: false });

    if (!sessions) return [];

    // Group by game type
    const gameGroups = sessions.reduce((acc, session) => {
      const gameType = session.game_type;
      if (!acc[gameType]) {
        acc[gameType] = [];
      }
      acc[gameType].push(session);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(gameGroups).map(([gameType, gameSessions]) => {
      const averageScore = gameSessions.reduce((sum, s) => sum + (s.final_score || 0), 0) / gameSessions.length;
      const bestScore = Math.max(...gameSessions.map(s => s.final_score || 0));
      const averageAccuracy = gameSessions.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / gameSessions.length;
      const totalTimeSpent = gameSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;

      return {
        gameType,
        gameName: this.getGameDisplayName(gameType),
        sessionsPlayed: gameSessions.length,
        averageScore: Math.round(averageScore),
        bestScore,
        averageAccuracy: Math.round(averageAccuracy * 10) / 10, // Round to 1 decimal place
        totalTimeSpent: Math.round(totalTimeSpent),
        difficultyLevel: gameSessions[0]?.difficulty_level || 1,
        lastPlayed: gameSessions[0]?.started_at || '',
        improvementTrend: this.calculateImprovementTrend(gameSessions),
        masteryLevel: this.calculateMasteryLevel(averageAccuracy, gameSessions.length)
      };
    });
  }

  private getGameDisplayName(gameType: string): string {
    const gameNames: Record<string, string> = {
      'word_towers': 'Word Towers',
      'gem_collector': 'Gem Collector',
      'vocab_master': 'Vocab Master',
      'hangman': 'Hangman',
      'memory_match': 'Memory Match',
      'word_blast': 'Word Blast'
    };
    return gameNames[gameType] || gameType;
  }

  private calculateImprovementTrend(sessions: any[]): 'improving' | 'stable' | 'declining' {
    if (sessions.length < 3) return 'stable';
    
    const recent = sessions.slice(0, Math.floor(sessions.length / 2));
    const older = sessions.slice(Math.floor(sessions.length / 2));
    
    const recentAvg = recent.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / older.length;
    
    const improvement = recentAvg - olderAvg;
    
    if (improvement > 5) return 'improving';
    if (improvement < -5) return 'declining';
    return 'stable';
  }

  private calculateMasteryLevel(accuracy: number, sessionCount: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (sessionCount < 5) return 'beginner';
    if (accuracy < 60) return 'beginner';
    if (accuracy < 75) return 'intermediate';
    if (accuracy < 90) return 'advanced';
    return 'expert';
  }

  private async getProgressTrends(studentId: string, dateRange?: { from: string; to: string }): Promise<StudentProgressTrend[]> {
    const { data: sessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('started_at, final_score, accuracy_percentage, duration_seconds, xp_earned')
      .eq('student_id', studentId)
      .gte('started_at', dateRange?.from || '2024-01-01')
      .lte('started_at', dateRange?.to || new Date().toISOString())
      .order('started_at', { ascending: true });

    if (!sessions) return [];

    // Group by date and aggregate
    const dailyData = sessions.reduce((acc, session) => {
      const date = session.started_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          xpEarned: 0,
          accuracy: 0,
          timeSpent: 0,
          assignmentsCompleted: 0,
          gamesPlayed: 0,
          sessionCount: 0
        };
      }

      acc[date].xpEarned += session.xp_earned || 0;
      acc[date].accuracy += session.accuracy_percentage || 0;
      acc[date].timeSpent += (session.duration_seconds || 0) / 60;
      acc[date].gamesPlayed += 1;
      acc[date].sessionCount += 1;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(dailyData).map((day: any) => ({
      date: day.date,
      xpEarned: day.xpEarned,
      accuracy: Math.round(day.accuracy / day.sessionCount),
      timeSpent: Math.round(day.timeSpent),
      assignmentsCompleted: day.assignmentsCompleted,
      gamesPlayed: day.gamesPlayed
    }));
  }

  private async getAchievements(studentId: string): Promise<StudentAchievement[]> {
    const { data: achievements } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('user_id', studentId)
      .order('achieved_at', { ascending: false });

    if (!achievements) return [];

    return achievements.map(achievement => ({
      id: achievement.id,
      title: achievement.achievement_data?.name || achievement.achievement_key,
      description: achievement.achievement_data?.description || '',
      iconUrl: achievement.achievement_data?.icon || '',
      rarity: achievement.achievement_data?.rarity as 'common' | 'rare' | 'epic' | 'legendary' || 'common',
      category: achievement.achievement_data?.category || '',
      earnedAt: achievement.achieved_at,
      xpReward: achievement.achievement_data?.points_awarded || 0,
      isNew: new Date(achievement.achieved_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if earned in last 7 days
    }));
  }

  private async getStreakData(studentId: string): Promise<StudentStreakData> {
    const { data: profile } = await this.supabase
      .from('student_game_profiles')
      .select('current_streak, longest_streak, last_activity_date')
      .eq('student_id', studentId)
      .single();

    const streakRewards: StreakReward[] = [
      { streakLength: 3, reward: 'Bronze Streak Badge', xpBonus: 50, achieved: (profile?.current_streak || 0) >= 3 },
      { streakLength: 7, reward: 'Silver Streak Badge', xpBonus: 100, achieved: (profile?.current_streak || 0) >= 7 },
      { streakLength: 14, reward: 'Gold Streak Badge', xpBonus: 200, achieved: (profile?.current_streak || 0) >= 14 },
      { streakLength: 30, reward: 'Diamond Streak Badge', xpBonus: 500, achieved: (profile?.current_streak || 0) >= 30 }
    ];

    const lastActivity = profile?.last_activity_date ? new Date(profile.last_activity_date) : new Date();
    const today = new Date();
    const daysSinceActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilStreakLoss = Math.max(0, 2 - daysSinceActivity); // Streak lost after 2 days of inactivity

    return {
      currentStreak: profile?.current_streak || 0,
      longestStreak: profile?.longest_streak || 0,
      streakType: 'daily',
      lastActivityDate: profile?.last_activity_date || '',
      streakGoal: 7,
      daysUntilStreakLoss,
      streakRewards
    };
  }

  private async getVocabularyMastery(studentId: string, dateRange?: { from: string; to: string }): Promise<VocabularyMasteryData> {
    const { data: vocabularyProgress } = await this.supabase
      .from('user_vocabulary_progress')
      .select(`
        vocabulary_id,
        times_seen,
        times_correct,
        is_learned,
        last_seen,
        vocabulary:vocabulary_id (
          spanish,
          english,
          theme,
          topic
        )
      `)
      .eq('user_id', studentId);

    if (!vocabularyProgress) {
      return {
        totalWords: 0,
        masteredWords: 0,
        wordsInProgress: 0,
        wordsNeedingReview: 0,
        categoryBreakdown: [],
        recentlyLearned: [],
        masteryRate: 0
      };
    }

    const totalWords = vocabularyProgress.length;
    const masteredWords = vocabularyProgress.filter(v => v.is_learned).length;
    const wordsInProgress = vocabularyProgress.filter(v => v.times_seen > 0 && !v.is_learned).length;
    const wordsNeedingReview = vocabularyProgress.filter(v => {
      const daysSinceLastPractice = v.last_seen
        ? Math.floor((Date.now() - new Date(v.last_seen).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      return daysSinceLastPractice > 7 && v.times_seen > 0;
    }).length;

    // Category breakdown
    const categoryGroups = vocabularyProgress.reduce((acc, vocab) => {
      const category = vocab.vocabulary?.theme || 'Unknown';
      if (!acc[category]) {
        acc[category] = { total: 0, mastered: 0, totalCorrect: 0, totalAttempts: 0, timeSpent: 0 };
      }
      acc[category].total += 1;
      if (vocab.is_learned) acc[category].mastered += 1;
      acc[category].totalCorrect += vocab.times_correct;
      acc[category].totalAttempts += vocab.times_seen;
      return acc;
    }, {} as Record<string, any>);

    const categoryBreakdown: CategoryMastery[] = Object.entries(categoryGroups).map(([category, data]) => ({
      category,
      totalWords: data.total,
      masteredWords: data.mastered,
      averageAccuracy: data.totalAttempts > 0 ? Math.round((data.totalCorrect / data.totalAttempts) * 100) : 0,
      timeSpent: data.timeSpent
    }));

    // Recently learned words
    const recentlyLearned: RecentWord[] = vocabularyProgress
      .filter(v => v.is_learned && v.last_seen)
      .sort((a, b) => new Date(b.last_seen!).getTime() - new Date(a.last_seen!).getTime())
      .slice(0, 10)
      .map(vocab => ({
        word: vocab.vocabulary?.spanish || '',
        translation: vocab.vocabulary?.english || '',
        category: vocab.vocabulary?.theme || '',
        masteredAt: vocab.last_seen || '',
        accuracy: vocab.times_seen > 0
          ? Math.round((vocab.times_correct / vocab.times_seen) * 100)
          : 0
      }));

    return {
      totalWords,
      masteredWords,
      wordsInProgress,
      wordsNeedingReview,
      categoryBreakdown,
      recentlyLearned,
      masteryRate: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0
    };
  }

  private async getAssignmentProgress(studentId: string): Promise<StudentAssignmentProgress[]> {
    // Get student's class enrollments
    const { data: enrollments } = await this.supabase
      .from('class_enrollments')
      .select('class_id')
      .eq('student_id', studentId);

    if (!enrollments || enrollments.length === 0) return [];

    const classIds = enrollments.map(e => e.class_id);

    // Get assignments for student's classes
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select(`
        id,
        title,
        due_date,
        status,
        game_config
      `)
      .in('class_id', classIds)
      .eq('status', 'active');

    if (!assignments) return [];

    // Get assignment progress
    const { data: progress } = await this.supabase
      .from('enhanced_assignment_progress')
      .select('*')
      .eq('student_id', studentId)
      .in('assignment_id', assignments.map(a => a.id));

    return assignments.map(assignment => {
      const assignmentProgress = progress?.find(p => p.assignment_id === assignment.id);
      const gameConfig = assignment.game_config as any;
      const totalGames = gameConfig?.games?.length || 1;

      return {
        assignmentId: assignment.id,
        title: assignment.title,
        dueDate: assignment.due_date,
        status: assignmentProgress?.status as any || 'not_started',
        completionPercentage: assignmentProgress?.completion_percentage || 0,
        score: assignmentProgress?.best_score || 0,
        accuracy: assignmentProgress?.best_accuracy || 0,
        timeSpent: Math.round((assignmentProgress?.total_time_spent || 0) / 60),
        gamesCompleted: assignmentProgress?.games_completed || 0,
        totalGames,
        lastWorkedOn: assignmentProgress?.last_attempt_at || ''
      };
    });
  }

  private async getWeeklyActivity(studentId: string, dateRange?: { from: string; to: string }): Promise<WeeklyActivityData[]> {
    const endDate = dateRange?.to ? new Date(dateRange.to) : new Date();
    const startDate = dateRange?.from ? new Date(dateRange.from) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    const { data: sessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('started_at, duration_seconds, xp_earned, accuracy_percentage, assignment_id')
      .eq('student_id', studentId)
      .gte('started_at', startDate.toISOString())
      .lte('started_at', endDate.toISOString())
      .order('started_at', { ascending: true });

    if (!sessions) return [];

    // Group by week
    const weeklyData = sessions.reduce((acc, session) => {
      const sessionDate = new Date(session.started_at);
      const weekStart = new Date(sessionDate);
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!acc[weekKey]) {
        acc[weekKey] = {
          date: weekKey,
          minutesPlayed: 0,
          xpEarned: 0,
          assignmentsWorked: new Set(),
          gamesPlayed: 0,
          totalAccuracy: 0,
          sessionCount: 0
        };
      }

      acc[weekKey].minutesPlayed += (session.duration_seconds || 0) / 60;
      acc[weekKey].xpEarned += session.xp_earned || 0;
      if (session.assignment_id) {
        acc[weekKey].assignmentsWorked.add(session.assignment_id);
      }
      acc[weekKey].gamesPlayed += 1;
      acc[weekKey].totalAccuracy += session.accuracy_percentage || 0;
      acc[weekKey].sessionCount += 1;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(weeklyData).map((week: any) => ({
      date: week.date,
      minutesPlayed: Math.round(week.minutesPlayed),
      xpEarned: week.xpEarned,
      assignmentsWorked: week.assignmentsWorked.size,
      gamesPlayed: week.gamesPlayed,
      accuracy: week.sessionCount > 0 ? Math.round(week.totalAccuracy / week.sessionCount) : 0
    }));
  }

  private async getSkillBreakdown(studentId: string, dateRange?: { from: string; to: string }): Promise<SkillBreakdownData> {
    // Get game sessions with skill tags
    const { data: sessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('game_type, accuracy_percentage, skill_tags')
      .eq('student_id', studentId)
      .gte('started_at', dateRange?.from || '2024-01-01')
      .lte('started_at', dateRange?.to || new Date().toISOString());

    if (!sessions) {
      return {
        vocabulary: 0,
        grammar: 0,
        listening: 0,
        reading: 0,
        writing: 0,
        speaking: 0
      };
    }

    // Map game types to skills and calculate averages
    const skillData = {
      vocabulary: [] as number[],
      grammar: [] as number[],
      listening: [] as number[],
      reading: [] as number[],
      writing: [] as number[],
      speaking: [] as number[]
    };

    sessions.forEach(session => {
      const accuracy = session.accuracy_percentage || 0;

      // Map game types to primary skills
      switch (session.game_type) {
        case 'vocab_master':
        case 'word_towers':
        case 'gem_collector':
          skillData.vocabulary.push(accuracy);
          break;
        case 'hangman':
        case 'word_blast':
          skillData.vocabulary.push(accuracy);
          skillData.reading.push(accuracy);
          break;
        case 'memory_match':
          skillData.vocabulary.push(accuracy);
          skillData.grammar.push(accuracy);
          break;
        default:
          skillData.vocabulary.push(accuracy);
      }
    });

    // Calculate averages
    const calculateAverage = (scores: number[]) =>
      scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;

    return {
      vocabulary: calculateAverage(skillData.vocabulary),
      grammar: calculateAverage(skillData.grammar),
      listening: calculateAverage(skillData.listening),
      reading: calculateAverage(skillData.reading),
      writing: calculateAverage(skillData.writing),
      speaking: calculateAverage(skillData.speaking)
    };
  }

  private async getMotivationalMetrics(studentId: string, dateRange?: { from: string; to: string }): Promise<MotivationalMetrics> {
    // student_game_profiles table removed - calculate from gems system
    const profile = null; // Will calculate from gem_events and enhanced_game_sessions

    const { data: sessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('started_at, game_type, difficulty_level, completion_percentage')
      .eq('student_id', studentId)
      .gte('started_at', dateRange?.from || '2024-01-01')
      .lte('started_at', dateRange?.to || new Date().toISOString())
      .order('started_at', { ascending: false });

    // Calculate engagement level based on recent activity
    const recentSessions = sessions?.filter(s => {
      const sessionDate = new Date(s.started_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return sessionDate > weekAgo;
    }) || [];

    const engagementLevel: 'low' | 'medium' | 'high' =
      recentSessions.length >= 10 ? 'high' :
      recentSessions.length >= 3 ? 'medium' : 'low';

    // Calculate motivation score based on various factors
    const consistencyScore = this.calculateConsistencyScore(sessions || []);
    const completionRate = sessions?.reduce((sum, s) => sum + (s.completion_percentage || 0), 0) / (sessions?.length || 1);
    const motivationScore = Math.round((consistencyScore + completionRate + (profile?.current_streak || 0) * 2) / 3);

    // Determine challenge preference
    const avgDifficulty = sessions?.reduce((sum, s) => sum + (s.difficulty_level || 1), 0) / (sessions?.length || 1) || 1;
    const challengePreference: 'easy' | 'medium' | 'hard' =
      avgDifficulty < 1.5 ? 'easy' :
      avgDifficulty < 2.5 ? 'medium' : 'hard';

    // Get preferred game types
    const gameTypeCounts = sessions?.reduce((acc, s) => {
      acc[s.game_type] = (acc[s.game_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const preferredGameTypes = Object.entries(gameTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([gameType]) => gameType);

    // Calculate next milestone
    const currentLevel = profile?.current_level || 1;
    const currentXP = profile?.total_xp || 0;
    const xpToNextLevel = profile?.xp_to_next_level || 100;
    const nextLevelXP = currentXP + xpToNextLevel;

    return {
      engagementLevel,
      motivationScore: Math.min(100, Math.max(0, motivationScore)),
      consistencyScore: Math.min(100, Math.max(0, consistencyScore)),
      challengePreference,
      preferredGameTypes,
      learningStyle: 'mixed', // TODO: Implement learning style detection
      nextMilestone: {
        type: 'level',
        description: `Reach Level ${currentLevel + 1}`,
        progress: Math.round((currentXP / nextLevelXP) * 100),
        target: 100
      }
    };
  }

  private calculateConsistencyScore(sessions: any[]): number {
    if (sessions.length === 0) return 0;

    // Group sessions by date
    const dailyActivity = sessions.reduce((acc, session) => {
      const date = session.started_at.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activeDays = Object.keys(dailyActivity).length;
    const totalDays = Math.max(1, Math.floor((Date.now() - new Date(sessions[sessions.length - 1].started_at).getTime()) / (1000 * 60 * 60 * 24)));

    return Math.round((activeDays / Math.min(totalDays, 30)) * 100); // Consistency over last 30 days
  }
}
