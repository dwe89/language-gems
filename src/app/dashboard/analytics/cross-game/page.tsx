'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Trophy, 
  Clock, 
  Target,
  ArrowLeft,
  Gamepad2,
  Star,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface GameSession {
  id: string;
  game_type: string;
  student_id: string;
  final_score: number;
  accuracy_percentage: number;
  duration_seconds: number;
  words_correct: number;
  words_attempted: number;
  created_at: string;
  student_name?: string;
}

interface GameStats {
  game_type: string;
  total_sessions: number;
  avg_score: number;
  avg_accuracy: number;
  avg_duration: number;
  total_words_practiced: number;
  unique_students: number;
}

interface StudentPerformance {
  student_id: string;
  student_name: string;
  total_sessions: number;
  avg_score: number;
  avg_accuracy: number;
  total_words_practiced: number;
  favorite_game: string;
}

const GAME_NAMES: Record<string, string> = {
  'noughts-and-crosses': 'Vocabulary Tic-Tac-Toe',
  'memory-game': 'Memory Game',
  'hangman': 'Hangman',
  'word-scramble': 'Word Scramble',
  'word-guesser': 'Word Guesser',
  'vocab-blast': 'Vocab Blast',
  'vocab-master': 'VocabMaster',
  'detective-listening': 'Detective Listening',
  'speed-builder': 'Speed Builder',
  'sentence-towers': 'Sentence Towers'
};

export default function CrossGameAnalyticsPage() {
  const { user } = useAuth();
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      console.log('=== Fetching cross-game analytics ===');
      setLoading(true);
      const supabase = supabaseBrowser;

      // Calculate date range
      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      // Get teacher's classes
      const { data: classes } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', user.id);

      const classIds = classes?.map(c => c.id) || [];
      console.log('Found classes:', classIds.length);

      if (classIds.length === 0) {
        console.log('No classes found for teacher');
        setLoading(false);
        return;
      }

      // Get students in teacher's classes
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .in('class_id', classIds);

      const studentIds = enrollments?.map(e => e.student_id) || [];
      console.log('Found students:', studentIds.length);

      // Get student names from user_profiles
      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .in('user_id', studentIds);

      const studentNames = userProfiles?.reduce((acc, profile) => {
        acc[profile.user_id] = profile.display_name;
        return acc;
      }, {} as Record<string, string>) || {};

      if (studentIds.length === 0) {
        console.log('No students found in classes');
        setLoading(false);
        return;
      }

      // Fetch game sessions
      const { data: sessions, error } = await supabase
        .from('enhanced_game_sessions')
        .select('*')
        .in('student_id', studentIds)
        .gte('created_at', startDate.toISOString())
        .not('final_score', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching game sessions:', error);
        setLoading(false);
        return;
      }

      console.log('Found game sessions:', sessions?.length || 0);

      const sessionsWithNames = sessions?.map(session => ({
        ...session,
        student_name: studentNames[session.student_id] || 'Unknown Student'
      })) || [];

      // Calculate game statistics
      const gameStatsMap = new Map<string, {
        sessions: GameSession[];
        total_score: number;
        total_accuracy: number;
        total_duration: number;
        total_words: number;
        unique_students: Set<string>;
      }>();

      sessionsWithNames.forEach(session => {
        const gameType = session.game_type;
        if (!gameStatsMap.has(gameType)) {
          gameStatsMap.set(gameType, {
            sessions: [],
            total_score: 0,
            total_accuracy: 0,
            total_duration: 0,
            total_words: 0,
            unique_students: new Set()
          });
        }

        const stats = gameStatsMap.get(gameType)!;
        stats.sessions.push(session);
        stats.total_score += session.final_score || 0;
        stats.total_accuracy += session.accuracy_percentage || 0;
        stats.total_duration += session.duration_seconds || 0;
        stats.total_words += session.words_correct || 0;
        stats.unique_students.add(session.student_id);
      });

      const gameStatsArray: GameStats[] = Array.from(gameStatsMap.entries()).map(([gameType, data]) => ({
        game_type: gameType,
        total_sessions: data.sessions.length,
        avg_score: data.sessions.length > 0 ? Math.round(data.total_score / data.sessions.length) : 0,
        avg_accuracy: data.sessions.length > 0 ? Math.round(data.total_accuracy / data.sessions.length) : 0,
        avg_duration: data.sessions.length > 0 ? Math.round(data.total_duration / data.sessions.length) : 0,
        total_words_practiced: data.total_words,
        unique_students: data.unique_students.size
      })).sort((a, b) => b.total_sessions - a.total_sessions);

      // Calculate student performance
      const studentStatsMap = new Map<string, {
        sessions: GameSession[];
        total_score: number;
        total_accuracy: number;
        total_words: number;
        game_counts: Map<string, number>;
      }>();

      sessionsWithNames.forEach(session => {
        const studentId = session.student_id;
        if (!studentStatsMap.has(studentId)) {
          studentStatsMap.set(studentId, {
            sessions: [],
            total_score: 0,
            total_accuracy: 0,
            total_words: 0,
            game_counts: new Map()
          });
        }

        const stats = studentStatsMap.get(studentId)!;
        stats.sessions.push(session);
        stats.total_score += session.final_score || 0;
        stats.total_accuracy += session.accuracy_percentage || 0;
        stats.total_words += session.words_correct || 0;
        
        const gameCount = stats.game_counts.get(session.game_type) || 0;
        stats.game_counts.set(session.game_type, gameCount + 1);
      });

      const studentPerformanceArray: StudentPerformance[] = Array.from(studentStatsMap.entries()).map(([studentId, data]) => {
        const favoriteGame = Array.from(data.game_counts.entries())
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

        return {
          student_id: studentId,
          student_name: studentNames[studentId] || 'Unknown Student',
          total_sessions: data.sessions.length,
          avg_score: data.sessions.length > 0 ? Math.round(data.total_score / data.sessions.length) : 0,
          avg_accuracy: data.sessions.length > 0 ? Math.round(data.total_accuracy / data.sessions.length) : 0,
          total_words_practiced: data.total_words,
          favorite_game: favoriteGame
        };
      }).sort((a, b) => b.avg_score - a.avg_score);

      setGameStats(gameStatsArray);
      setStudentPerformance(studentPerformanceArray);
      setRecentSessions(sessionsWithNames.slice(0, 10));
      setLoading(false);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading cross-game analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart2 className="h-8 w-8 text-blue-600" />
                Cross-Game Analytics
              </h1>
              <p className="text-gray-600 mt-1">Track student performance across all vocabulary games</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-white rounded-lg shadow-sm border">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                } ${range === '7d' ? 'rounded-l-lg' : range === '90d' ? 'rounded-r-lg' : ''}`}
              >
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>
            ))}
          </div>
        </div>

        {gameStats.length === 0 ? (
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Game Data Available</h3>
            <p className="text-gray-500">Students haven't played any games in the selected time period.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {gameStats.reduce((sum, game) => sum + game.total_sessions, 0)}
                    </p>
                  </div>
                  <Gamepad2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-3xl font-bold text-green-600">
                      {studentPerformance.length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Words Practiced</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {gameStats.reduce((sum, game) => sum + game.total_words_practiced, 0)}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {Math.round(
                        gameStats.reduce((sum, game) => sum + game.avg_accuracy * game.total_sessions, 0) /
                        gameStats.reduce((sum, game) => sum + game.total_sessions, 0)
                      ) || 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Game Performance Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Game Performance Overview
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Accuracy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Words Practiced</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gameStats.map((game, index) => (
                      <tr key={game.game_type} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Gamepad2 className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {GAME_NAMES[game.game_type] || game.game_type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.total_sessions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.avg_score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.avg_accuracy}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDuration(game.avg_duration)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.total_words_practiced}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.unique_students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Performance and Recent Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Students */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Top Performing Students
                  </h2>
                </div>
                <div className="p-6">
                  {studentPerformance.slice(0, 5).map((student, index) => (
                    <div key={student.student_id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.student_name}</p>
                          <p className="text-sm text-gray-500">
                            {student.total_sessions} sessions • {student.total_words_practiced} words
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{student.avg_score} pts</p>
                        <p className="text-sm text-gray-500">{student.avg_accuracy}% accuracy</p>
                      </div>
                    </div>
                  ))}
                  {studentPerformance.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No student data available</p>
                  )}
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Recent Game Sessions
                  </h2>
                </div>
                <div className="p-6">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{session.student_name}</p>
                        <p className="text-sm text-gray-500">
                          {GAME_NAMES[session.game_type] || session.game_type}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(session.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{session.final_score} pts</p>
                        <p className="text-sm text-gray-500">{session.accuracy_percentage}% accuracy</p>
                        <p className="text-xs text-gray-400">{formatDuration(session.duration_seconds)}</p>
                      </div>
                    </div>
                  ))}
                  {recentSessions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent sessions</p>
                  )}
                </div>
              </div>
            </div>

            {/* Game Popularity Chart */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Game Popularity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {gameStats.map((game) => {
                    const maxSessions = Math.max(...gameStats.map(g => g.total_sessions));
                    const percentage = maxSessions > 0 ? (game.total_sessions / maxSessions) * 100 : 0;

                    return (
                      <div key={game.game_type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {GAME_NAMES[game.game_type] || game.game_type}
                          </span>
                          <span className="text-sm text-gray-500">{game.total_sessions} sessions</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
