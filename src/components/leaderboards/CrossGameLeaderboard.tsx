'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Star,
  Flame,
  Target,
  Clock,
  Gamepad2,
  Users,
  Filter,
  Calendar,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { CompetitionService, CrossGameLeaderboard as LeaderboardEntry } from '../../services/competitionService';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';

interface CrossGameLeaderboardProps {
  classId?: string;
  schoolId?: string;
  limit?: number;
  showFilters?: boolean;
  compact?: boolean;
  entries?: LeaderboardEntry[];
  autoFetch?: boolean;
  loadingOverride?: boolean;
  errorOverride?: string;
  timePeriod?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  onTimePeriodChange?: (period: 'daily' | 'weekly' | 'monthly' | 'all_time') => void;
  onRefresh?: () => Promise<void> | void;
}

const TIME_PERIODS = [
  { id: 'daily', label: 'Today', icon: Calendar },
  { id: 'weekly', label: 'This Week', icon: Calendar },
  { id: 'monthly', label: 'This Month', icon: Calendar },
  { id: 'all_time', label: 'All Time', icon: Trophy }
];

const RANK_COLORS = {
  1: 'from-yellow-400 to-yellow-600',
  2: 'from-gray-300 to-gray-500',
  3: 'from-orange-400 to-orange-600'
};

const RANK_ICONS = {
  1: Crown,
  2: Medal,
  3: Award
};

export default function CrossGameLeaderboard({
  classId,
  schoolId,
  limit = 10,
  showFilters = true,
  compact = false,
  entries,
  autoFetch = true,
  loadingOverride,
  errorOverride,
  timePeriod,
  onTimePeriodChange,
  onRefresh
}: CrossGameLeaderboardProps) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(entries ?? []);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState('');
  const [internalTimePeriod, setInternalTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>(timePeriod ?? 'weekly');
  const [competitionService, setCompetitionService] = useState<CompetitionService | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const activeTimePeriod = timePeriod ?? internalTimePeriod;

  // Initialize competition service
  useEffect(() => {
    if (supabaseBrowser) {
      const service = new CompetitionService(supabaseBrowser);
      setCompetitionService(service);
    }
  }, []);

  // Sync provided entries
  useEffect(() => {
    if (entries) {
      setLeaderboard(entries);
      setLoading(false);
      setError('');
    }
  }, [entries]);

  // Sync external time period
  useEffect(() => {
    if (timePeriod) {
      setInternalTimePeriod(timePeriod);
    }
  }, [timePeriod]);

  // Fetch leaderboard data
  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    if (competitionService) {
      fetchLeaderboard();
    }
  }, [competitionService, autoFetch, activeTimePeriod, classId, schoolId, limit]);

  const fetchLeaderboard = async () => {
    if (!competitionService) return;
    if (!autoFetch) return;

    try {
      setLoading(true);
      setError('');

      const data = await competitionService.getCrossGameLeaderboard({
        class_id: classId,
        school_id: schoolId,
        limit,
        time_period: activeTimePeriod
      });

      setLeaderboard(data);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTimePeriodChange = (period: 'daily' | 'weekly' | 'monthly' | 'all_time') => {
    if (!timePeriod || autoFetch) {
      setInternalTimePeriod(period);
    }

    onTimePeriodChange?.(period);
  };

  const displayedLeaderboard = entries ?? leaderboard;
  const currentLoading = loadingOverride ?? (autoFetch ? loading : false);
  const currentError = errorOverride ?? error;

  const getRankIcon = (rank: number) => {
    const IconComponent = RANK_ICONS[rank as keyof typeof RANK_ICONS];
    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
    return <span className="font-bold text-lg">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    return RANK_COLORS[rank as keyof typeof RANK_COLORS] || 'from-blue-400 to-blue-600';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-orange-600';
    if (streak >= 7) return 'text-yellow-600';
    if (streak >= 3) return 'text-green-600';
    return 'text-gray-600';
  };

  if (currentLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-red-600">
          <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Failed to load leaderboard</p>
          <p className="text-sm text-gray-500 mt-1">{currentError}</p>
          <button
            onClick={() => {
              if (onRefresh) {
                onRefresh();
              } else {
                fetchLeaderboard();
              }
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Cross-Game Leaderboard</h2>
              <p className="text-blue-100">
                {classId ? 'Class Rankings' : 'Global Rankings'} • {leaderboard.length} students
              </p>
            </div>
          </div>
          
          {showFilters && (
            <div className="flex items-center gap-2">
              <select
                value={activeTimePeriod}
                onChange={(e) => handleTimePeriodChange(e.target.value as any)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {TIME_PERIODS.map(period => (
                  <option key={period.id} value={period.id} className="text-gray-900">
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="divide-y divide-gray-100">
        {leaderboard.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rankings Yet</h3>
            <p>Students will appear here once they start playing games!</p>
          </div>
        ) : (
          displayedLeaderboard.map((entry, index) => (
            <div key={`${entry.id}-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(entry.overall_rank)} text-white font-bold shadow-lg`}>
                    {getRankIcon(entry.overall_rank)}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{entry.student_name}</h3>
                      {entry.current_streak > 0 && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 ${getStreakColor(entry.current_streak)}`}>
                          <Flame className="h-3 w-3" />
                          <span className="text-xs font-medium">{entry.current_streak}</span>
                        </div>
                      )}
                      {entry.total_achievements > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-600">
                          <Star className="h-3 w-3" />
                          <span className="text-xs font-medium">{entry.total_achievements}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span className="font-medium">{entry.total_points.toLocaleString()}</span>
                        <span>pts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{entry.average_accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gamepad2 className="h-4 w-4" />
                        <span>{entry.games_played}</span>
                      </div>
                      {!compact && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(entry.total_time_played)}</span>
                        </div>
                      )}
                      {entry.data_quality_warnings && entry.data_quality_warnings.length > 0 && (
                        <div className="flex items-center gap-1 text-amber-600" title={entry.data_quality_warnings.join(', ')}>
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs">Data issue</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Lv. {entry.current_level}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {entry.total_xp.toLocaleString()} XP
                    </div>
                  </div>

                  {/* Expand Button */}
                  {!compact && (
                    <button
                      onClick={() => setExpandedStudent(
                        expandedStudent === entry.student_id ? null : entry.student_id
                      )}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        expandedStudent === entry.student_id ? 'rotate-180' : ''
                      }`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {!compact && expandedStudent === entry.student_id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{entry.words_learned}</div>
                      <div className="text-sm text-gray-600">Words Learned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{entry.longest_streak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{entry.legendary_achievements}</div>
                      <div className="text-sm text-gray-600">Legendary</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {entry.last_activity ? new Date(entry.last_activity).toLocaleDateString() : 'Never'}
                      </div>
                      <div className="text-sm text-gray-600">Last Active</div>
                    </div>
                  </div>

                  {/* Game Breakdown */}
                  {Object.keys(entry.game_scores).length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Game Performance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(entry.game_scores).map(([gameType, scores]) => (
                          <div key={gameType} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium capitalize">
                              {gameType.replace('-', ' ')}
                            </span>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{scores.best_score}</span>
                              <span className="mx-1">•</span>
                              <span>{scores.best_accuracy.toFixed(1)}%</span>
                              <span className="mx-1">•</span>
                              <span>{scores.games_played} games</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {leaderboard.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-600">
          Rankings update in real-time based on game performance and achievements
        </div>
      )}
    </div>
  );
}
