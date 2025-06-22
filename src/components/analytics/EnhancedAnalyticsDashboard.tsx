'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Trophy, Users, Target, Clock, Zap, TrendingUp, TrendingDown,
  Award, BookOpen, CheckCircle, AlertCircle, Star, Gem,
  Calendar, Filter, Download, RefreshCw, Eye, BarChart3,
  PieChart as PieChartIcon, Activity, Brain, Heart
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { EnhancedGameService } from '../../services/enhancedGameService';
import { EnhancedAssignmentService, ClassPerformanceMetrics } from '../../services/enhancedAssignmentService';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface AnalyticsData {
  overview: {
    totalSessions: number;
    totalStudents: number;
    averageScore: number;
    averageAccuracy: number;
    totalTimeSpent: number;
    completionRate: number;
    improvementRate: number;
    engagementScore: number;
  };
  gamePerformance: GamePerformanceData[];
  studentProgress: StudentProgressData[];
  wordAnalytics: WordAnalyticsData[];
  timeAnalytics: TimeAnalyticsData[];
  achievementStats: AchievementStatsData[];
  leaderboards: LeaderboardData[];
  trends: TrendData[];
}

interface GamePerformanceData {
  gameType: string;
  sessions: number;
  averageScore: number;
  averageAccuracy: number;
  averageTime: number;
  completionRate: number;
  difficulty: number;
  engagement: number;
}

interface StudentProgressData {
  studentId: string;
  studentName: string;
  totalSessions: number;
  averageScore: number;
  averageAccuracy: number;
  improvementRate: number;
  currentStreak: number;
  level: number;
  wordsLearned: number;
  timeSpent: number;
  achievements: number;
  lastActive: string;
  trend: 'improving' | 'stable' | 'declining';
}

interface WordAnalyticsData {
  word: string;
  translation: string;
  attempts: number;
  correctAttempts: number;
  accuracy: number;
  averageResponseTime: number;
  difficultyRating: number;
  studentsStruggling: number;
  improvementRate: number;
}

interface TimeAnalyticsData {
  hour: number;
  day: string;
  sessions: number;
  averageScore: number;
  averageAccuracy: number;
  engagement: number;
}

interface AchievementStatsData {
  achievementType: string;
  title: string;
  category: string;
  rarity: string;
  timesEarned: number;
  studentsEarned: number;
  averageTimeToEarn: number;
}

interface LeaderboardData {
  rank: number;
  studentId: string;
  studentName: string;
  score: number;
  accuracy: number;
  gamesPlayed: number;
  timeSpent: number;
  achievements: number;
  level: number;
}

interface TrendData {
  date: string;
  sessions: number;
  averageScore: number;
  averageAccuracy: number;
  newStudents: number;
  completionRate: number;
  engagementScore: number;
}

interface EnhancedAnalyticsDashboardProps {
  classId?: string;
  assignmentId?: string;
  gameType?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  viewMode?: 'teacher' | 'student';
  studentId?: string;
}

// =====================================================
// ENHANCED ANALYTICS DASHBOARD COMPONENT
// =====================================================

export default function EnhancedAnalyticsDashboard({
  classId,
  assignmentId,
  gameType,
  dateRange,
  viewMode = 'teacher',
  studentId
}: EnhancedAnalyticsDashboardProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // Services
  const [gameService] = useState(() => new EnhancedGameService(supabase));
  const [assignmentService] = useState(() => new EnhancedAssignmentService(supabase));
  
  // State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedGameType, setSelectedGameType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  // =====================================================
  // DATA LOADING
  // =====================================================

  useEffect(() => {
    loadAnalyticsData();
  }, [classId, assignmentId, gameType, dateRange, selectedTimeframe, selectedGameType]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load different data based on view mode
      if (viewMode === 'teacher') {
        await loadTeacherAnalytics();
      } else {
        await loadStudentAnalytics();
      }
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeacherAnalytics = async () => {
    // Load comprehensive teacher analytics
    const [
      overviewData,
      gamePerformanceData,
      studentProgressData,
      wordAnalyticsData,
      timeAnalyticsData,
      achievementStatsData,
      leaderboardData,
      trendData
    ] = await Promise.all([
      loadOverviewData(),
      loadGamePerformanceData(),
      loadStudentProgressData(),
      loadWordAnalyticsData(),
      loadTimeAnalyticsData(),
      loadAchievementStatsData(),
      loadLeaderboardData(),
      loadTrendData()
    ]);

    setAnalyticsData({
      overview: overviewData,
      gamePerformance: gamePerformanceData,
      studentProgress: studentProgressData,
      wordAnalytics: wordAnalyticsData,
      timeAnalytics: timeAnalyticsData,
      achievementStats: achievementStatsData,
      leaderboards: leaderboardData,
      trends: trendData
    });
  };

  const loadStudentAnalytics = async () => {
    // Load student-specific analytics
    if (!studentId) return;
    
    // Simplified analytics for student view
    const overviewData = await loadStudentOverviewData(studentId);
    const gamePerformanceData = await loadStudentGamePerformanceData(studentId);
    const progressData = await loadStudentDetailedProgressData(studentId);
    
    setAnalyticsData({
      overview: overviewData,
      gamePerformance: gamePerformanceData,
      studentProgress: [progressData],
      wordAnalytics: [],
      timeAnalytics: [],
      achievementStats: [],
      leaderboards: [],
      trends: []
    });
  };

  // =====================================================
  // DATA LOADING HELPERS
  // =====================================================

  const loadOverviewData = async () => {
    // Mock data - replace with actual API calls
    return {
      totalSessions: 1247,
      totalStudents: 32,
      averageScore: 847,
      averageAccuracy: 78.5,
      totalTimeSpent: 15420, // minutes
      completionRate: 85.2,
      improvementRate: 12.3,
      engagementScore: 82.1
    };
  };

  const loadGamePerformanceData = async (): Promise<GamePerformanceData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        gameType: 'Gem Collector',
        sessions: 456,
        averageScore: 892,
        averageAccuracy: 81.2,
        averageTime: 8.5,
        completionRate: 87.3,
        difficulty: 3.2,
        engagement: 85.7
      },
      {
        gameType: 'Memory Game',
        sessions: 324,
        averageScore: 756,
        averageAccuracy: 74.8,
        averageTime: 6.2,
        completionRate: 82.1,
        difficulty: 2.8,
        engagement: 79.4
      },
      {
        gameType: 'Speed Builder',
        sessions: 287,
        averageScore: 923,
        averageAccuracy: 83.6,
        averageTime: 5.8,
        completionRate: 91.2,
        difficulty: 3.5,
        engagement: 88.9
      },
      {
        gameType: 'Word Scramble',
        sessions: 180,
        averageScore: 678,
        averageAccuracy: 69.3,
        averageTime: 7.1,
        completionRate: 76.8,
        difficulty: 2.5,
        engagement: 72.6
      }
    ];
  };

  const loadStudentProgressData = async (): Promise<StudentProgressData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        studentId: '1',
        studentName: 'Alice Johnson',
        totalSessions: 45,
        averageScore: 923,
        averageAccuracy: 87.2,
        improvementRate: 15.3,
        currentStreak: 7,
        level: 8,
        wordsLearned: 156,
        timeSpent: 420,
        achievements: 12,
        lastActive: '2024-06-19',
        trend: 'improving'
      },
      {
        studentId: '2',
        studentName: 'Bob Smith',
        totalSessions: 38,
        averageScore: 756,
        averageAccuracy: 72.8,
        improvementRate: 8.7,
        currentStreak: 3,
        level: 6,
        wordsLearned: 124,
        timeSpent: 380,
        achievements: 8,
        lastActive: '2024-06-18',
        trend: 'stable'
      },
      {
        studentId: '3',
        studentName: 'Carol Davis',
        totalSessions: 52,
        averageScore: 1045,
        averageAccuracy: 91.5,
        improvementRate: 22.1,
        currentStreak: 12,
        level: 10,
        wordsLearned: 203,
        timeSpent: 520,
        achievements: 18,
        lastActive: '2024-06-19',
        trend: 'improving'
      }
    ];
  };

  const loadWordAnalyticsData = async (): Promise<WordAnalyticsData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        word: 'gato',
        translation: 'cat',
        attempts: 156,
        correctAttempts: 142,
        accuracy: 91.0,
        averageResponseTime: 2.3,
        difficultyRating: 2.1,
        studentsStruggling: 3,
        improvementRate: 8.5
      },
      {
        word: 'perro',
        translation: 'dog',
        attempts: 134,
        correctAttempts: 118,
        accuracy: 88.1,
        averageResponseTime: 2.1,
        difficultyRating: 2.0,
        studentsStruggling: 4,
        improvementRate: 12.3
      },
      {
        word: 'casa',
        translation: 'house',
        attempts: 98,
        correctAttempts: 76,
        accuracy: 77.6,
        averageResponseTime: 3.2,
        difficultyRating: 2.8,
        studentsStruggling: 8,
        improvementRate: 5.2
      }
    ];
  };

  const loadTimeAnalyticsData = async (): Promise<TimeAnalyticsData[]> => {
    // Mock data - replace with actual API calls
    return [
      { hour: 9, day: 'Monday', sessions: 45, averageScore: 823, averageAccuracy: 78.2, engagement: 82.1 },
      { hour: 10, day: 'Monday', sessions: 67, averageScore: 856, averageAccuracy: 81.5, engagement: 85.3 },
      { hour: 11, day: 'Monday', sessions: 52, averageScore: 834, averageAccuracy: 79.8, engagement: 83.7 },
      { hour: 14, day: 'Monday', sessions: 38, averageScore: 798, averageAccuracy: 76.3, engagement: 79.2 },
      { hour: 15, day: 'Monday', sessions: 41, averageScore: 812, averageAccuracy: 77.9, engagement: 80.8 }
    ];
  };

  const loadAchievementStatsData = async (): Promise<AchievementStatsData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        achievementType: 'perfect_score',
        title: 'Perfect Score',
        category: 'performance',
        rarity: 'rare',
        timesEarned: 23,
        studentsEarned: 15,
        averageTimeToEarn: 8.5
      },
      {
        achievementType: 'speed_demon',
        title: 'Speed Demon',
        category: 'performance',
        rarity: 'epic',
        timesEarned: 12,
        studentsEarned: 8,
        averageTimeToEarn: 15.2
      },
      {
        achievementType: 'week_warrior',
        title: 'Week Warrior',
        category: 'consistency',
        rarity: 'rare',
        timesEarned: 18,
        studentsEarned: 12,
        averageTimeToEarn: 7.0
      }
    ];
  };

  const loadLeaderboardData = async (): Promise<LeaderboardData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        rank: 1,
        studentId: '3',
        studentName: 'Carol Davis',
        score: 1045,
        accuracy: 91.5,
        gamesPlayed: 52,
        timeSpent: 520,
        achievements: 18,
        level: 10
      },
      {
        rank: 2,
        studentId: '1',
        studentName: 'Alice Johnson',
        score: 923,
        accuracy: 87.2,
        gamesPlayed: 45,
        timeSpent: 420,
        achievements: 12,
        level: 8
      },
      {
        rank: 3,
        studentId: '2',
        studentName: 'Bob Smith',
        score: 756,
        accuracy: 72.8,
        gamesPlayed: 38,
        timeSpent: 380,
        achievements: 8,
        level: 6
      }
    ];
  };

  const loadTrendData = async (): Promise<TrendData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        date: '2024-06-13',
        sessions: 45,
        averageScore: 823,
        averageAccuracy: 78.2,
        newStudents: 2,
        completionRate: 82.1,
        engagementScore: 79.5
      },
      {
        date: '2024-06-14',
        sessions: 52,
        averageScore: 856,
        averageAccuracy: 81.5,
        newStudents: 1,
        completionRate: 85.3,
        engagementScore: 82.8
      },
      {
        date: '2024-06-15',
        sessions: 38,
        averageScore: 834,
        averageAccuracy: 79.8,
        newStudents: 0,
        completionRate: 83.7,
        engagementScore: 81.2
      },
      {
        date: '2024-06-16',
        sessions: 61,
        averageScore: 892,
        averageAccuracy: 84.2,
        newStudents: 3,
        completionRate: 87.9,
        engagementScore: 86.1
      },
      {
        date: '2024-06-17',
        sessions: 47,
        averageScore: 867,
        averageAccuracy: 82.6,
        newStudents: 1,
        completionRate: 86.4,
        engagementScore: 84.7
      },
      {
        date: '2024-06-18',
        sessions: 55,
        averageScore: 901,
        averageAccuracy: 85.8,
        newStudents: 2,
        completionRate: 89.2,
        engagementScore: 87.3
      },
      {
        date: '2024-06-19',
        sessions: 49,
        averageScore: 878,
        averageAccuracy: 83.4,
        newStudents: 1,
        completionRate: 87.6,
        engagementScore: 85.9
      }
    ];
  };

  const loadStudentOverviewData = async (studentId: string) => {
    // Mock data for student overview
    return {
      totalSessions: 45,
      totalStudents: 1,
      averageScore: 923,
      averageAccuracy: 87.2,
      totalTimeSpent: 420,
      completionRate: 89.3,
      improvementRate: 15.3,
      engagementScore: 88.7
    };
  };

  const loadStudentGamePerformanceData = async (studentId: string): Promise<GamePerformanceData[]> => {
    // Mock data for student game performance
    return [
      {
        gameType: 'Gem Collector',
        sessions: 18,
        averageScore: 945,
        averageAccuracy: 89.2,
        averageTime: 7.8,
        completionRate: 92.1,
        difficulty: 3.4,
        engagement: 91.5
      },
      {
        gameType: 'Memory Game',
        sessions: 15,
        averageScore: 867,
        averageAccuracy: 84.6,
        averageTime: 6.5,
        completionRate: 87.8,
        difficulty: 3.1,
        engagement: 86.2
      },
      {
        gameType: 'Speed Builder',
        sessions: 12,
        averageScore: 1023,
        averageAccuracy: 91.8,
        averageTime: 5.2,
        completionRate: 95.4,
        difficulty: 3.7,
        engagement: 94.1
      }
    ];
  };

  const loadStudentDetailedProgressData = async (studentId: string): Promise<StudentProgressData> => {
    // Mock data for detailed student progress
    return {
      studentId,
      studentName: 'Current Student',
      totalSessions: 45,
      averageScore: 923,
      averageAccuracy: 87.2,
      improvementRate: 15.3,
      currentStreak: 7,
      level: 8,
      wordsLearned: 156,
      timeSpent: 420,
      achievements: 12,
      lastActive: '2024-06-19',
      trend: 'improving'
    };
  };
