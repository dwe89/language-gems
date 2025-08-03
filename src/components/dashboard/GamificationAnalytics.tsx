'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Zap, Crown, Medal, Award, Target,
  TrendingUp, Users, Calendar, BarChart3, Gamepad2,
  ChevronRight, ExternalLink, Download, RefreshCw,
  Flame, Gift, Sparkles, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface XPProgressionData {
  student_id: string;
  student_name: string;
  class_name: string;
  current_level: number;
  current_xp: number;
  xp_to_next_level: number;
  total_xp_earned: number;
  xp_this_week: number;
  xp_last_week: number;
  level_up_date: string | null;
  progression_rate: number; // XP per day average
  rank_in_class: number;
  rank_change: number; // +/- from last week
}

interface AchievementData {
  achievement_id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'engagement' | 'social' | 'milestone';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_earned: number;
  recent_earners: {
    student_name: string;
    earned_date: string;
  }[];
  completion_rate: number; // percentage of students who earned it
  rarity_score: number; // 0-1, how rare the achievement is
}

interface CompetitionData {
  competition_id: string;
  title: string;
  type: 'weekly_challenge' | 'monthly_contest' | 'class_battle' | 'skill_tournament';
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'upcoming';
  participants: number;
  
  // Leaderboard
  top_performers: {
    rank: number;
    student_name: string;
    class_name: string;
    score: number;
    metric: string; // 'XP earned', 'Words learned', etc.
  }[];
  
  // Competition stats
  total_engagement: number;
  average_participation: number;
  completion_rate: number;
}

interface GamificationMetrics {
  total_active_students: number;
  average_level: number;
  total_xp_earned_today: number;
  achievements_unlocked_today: number;
  current_streak_leaders: {
    student_name: string;
    streak_days: number;
  }[];
  engagement_score: number; // 0-10 scale
  gamification_adoption_rate: number; // percentage actively engaging
}

// =====================================================
// GAMIFICATION ANALYTICS COMPONENT
// =====================================================

export default function GamificationAnalytics() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // State management
  const [xpProgressions, setXpProgressions] = useState<XPProgressionData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
  const [metrics, setMetrics] = useState<GamificationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'xp' | 'achievements' | 'competitions'>('xp');
  const [timeFilter, setTimeFilter] = useState('this_week');

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user, timeFilter]);

  // =====================================================
  // DATA LOADING FUNCTIONS
  // =====================================================

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      
      const [xpData, achievementData, competitionData, metricsData] = await Promise.all([
        loadXPProgressions(),
        loadAchievements(),
        loadCompetitions(),
        loadGamificationMetrics()
      ]);

      setXpProgressions(xpData);
      setAchievements(achievementData);
      setCompetitions(competitionData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadXPProgressions = async (): Promise<XPProgressionData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        student_id: '1',
        student_name: 'Emma Thompson',
        class_name: 'Year 7 French',
        current_level: 8,
        current_xp: 2450,
        xp_to_next_level: 550,
        total_xp_earned: 2450,
        xp_this_week: 320,
        xp_last_week: 280,
        level_up_date: '2024-07-28T14:30:00Z',
        progression_rate: 45.7,
        rank_in_class: 3,
        rank_change: 1
      },
      {
        student_id: '2',
        student_name: 'James Wilson',
        class_name: 'Year 7 French',
        current_level: 3,
        current_xp: 890,
        xp_to_next_level: 210,
        total_xp_earned: 890,
        xp_this_week: 85,
        xp_last_week: 120,
        level_up_date: null,
        progression_rate: 12.1,
        rank_in_class: 18,
        rank_change: -2
      },
      {
        student_id: '3',
        student_name: 'Sophia Miller',
        class_name: 'Year 8 Spanish',
        current_level: 6,
        current_xp: 1850,
        xp_to_next_level: 350,
        total_xp_earned: 1850,
        xp_this_week: 240,
        xp_last_week: 200,
        level_up_date: '2024-07-25T09:15:00Z',
        progression_rate: 34.3,
        rank_in_class: 7,
        rank_change: 2
      }
    ];
  };

  const loadAchievements = async (): Promise<AchievementData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        achievement_id: 'vocab_master',
        title: 'Vocabulary Master',
        description: 'Learn 100 new words in a single month',
        icon: '📚',
        category: 'learning',
        difficulty: 'gold',
        total_earned: 12,
        recent_earners: [
          { student_name: 'Emma Thompson', earned_date: '2024-08-01T10:00:00Z' },
          { student_name: 'Sophia Miller', earned_date: '2024-07-30T15:30:00Z' }
        ],
        completion_rate: 15.8,
        rarity_score: 0.84
      },
      {
        achievement_id: 'streak_champion',
        title: 'Streak Champion',
        description: 'Maintain a 30-day learning streak',
        icon: '🔥',
        category: 'engagement',
        difficulty: 'platinum',
        total_earned: 5,
        recent_earners: [
          { student_name: 'Emma Thompson', earned_date: '2024-07-28T12:00:00Z' }
        ],
        completion_rate: 6.6,
        rarity_score: 0.93
      },
      {
        achievement_id: 'grammar_guru',
        title: 'Grammar Guru',
        description: 'Score 95%+ on 5 consecutive grammar assignments',
        icon: '⚡',
        category: 'learning',
        difficulty: 'silver',
        total_earned: 18,
        recent_earners: [
          { student_name: 'Sophia Miller', earned_date: '2024-08-02T14:20:00Z' },
          { student_name: 'Alex Johnson', earned_date: '2024-08-01T16:45:00Z' }
        ],
        completion_rate: 23.7,
        rarity_score: 0.76
      }
    ];
  };

  const loadCompetitions = async (): Promise<CompetitionData[]> => {
    // Mock data - replace with actual API calls
    return [
      {
        competition_id: 'weekly_vocab_1',
        title: 'Weekly Vocabulary Challenge',
        type: 'weekly_challenge',
        start_date: '2024-07-29T00:00:00Z',
        end_date: '2024-08-05T23:59:59Z',
        status: 'active',
        participants: 45,
        top_performers: [
          { rank: 1, student_name: 'Emma Thompson', class_name: 'Year 7 French', score: 156, metric: 'Words learned' },
          { rank: 2, student_name: 'Sophia Miller', class_name: 'Year 8 Spanish', score: 142, metric: 'Words learned' },
          { rank: 3, student_name: 'Alex Johnson', class_name: 'Year 7 French', score: 138, metric: 'Words learned' }
        ],
        total_engagement: 89.2,
        average_participation: 78.5,
        completion_rate: 82.2
      },
      {
        competition_id: 'class_battle_1',
        title: 'French vs Spanish Class Battle',
        type: 'class_battle',
        start_date: '2024-08-01T00:00:00Z',
        end_date: '2024-08-15T23:59:59Z',
        status: 'active',
        participants: 68,
        top_performers: [
          { rank: 1, student_name: 'Year 7 French', class_name: 'Class Average', score: 2450, metric: 'Total XP' },
          { rank: 2, student_name: 'Year 8 Spanish', class_name: 'Class Average', score: 2280, metric: 'Total XP' }
        ],
        total_engagement: 94.1,
        average_participation: 85.3,
        completion_rate: 76.5
      }
    ];
  };

  const loadGamificationMetrics = async (): Promise<GamificationMetrics> => {
    // Mock data - replace with actual API calls
    return {
      total_active_students: 76,
      average_level: 5.8,
      total_xp_earned_today: 1240,
      achievements_unlocked_today: 8,
      current_streak_leaders: [
        { student_name: 'Emma Thompson', streak_days: 28 },
        { student_name: 'Sophia Miller', streak_days: 22 },
        { student_name: 'Alex Johnson', streak_days: 19 }
      ],
      engagement_score: 8.4,
      gamification_adoption_rate: 89.5
    };
  };

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const renderXPProgressions = () => (
    <div className="space-y-6">
      {/* XP Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl text-white">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">{metrics?.total_xp_earned_today.toLocaleString()}</div>
              <div className="text-yellow-100">XP Earned Today</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">{metrics?.average_level.toFixed(1)}</div>
              <div className="text-purple-100">Average Level</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">{metrics?.total_active_students}</div>
              <div className="text-green-100">Active Students</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <div className="text-2xl font-bold">{metrics?.engagement_score.toFixed(1)}/10</div>
              <div className="text-blue-100">Engagement Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progression Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Student XP Progressions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">This Week</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {xpProgressions.map((student, index) => (
                <motion.tr
                  key={student.student_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {student.student_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{student.student_name}</div>
                        <div className="text-sm text-gray-500">{student.class_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{student.current_level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{student.current_xp.toLocaleString()}</span>
                        <span className="text-gray-500">{(student.current_xp + student.xp_to_next_level).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(student.current_xp / (student.current_xp + student.xp_to_next_level)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">+{student.xp_this_week}</div>
                      <div className="text-xs text-gray-500">vs {student.xp_last_week} last week</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-lg font-semibold">#{student.rank_in_class}</span>
                      {student.rank_change !== 0 && (
                        <span className={`flex items-center text-xs ${
                          student.rank_change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {student.rank_change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          {Math.abs(student.rank_change)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-sm font-medium">{student.progression_rate.toFixed(1)} XP/day</div>
                      {student.level_up_date && (
                        <div className="text-xs text-green-600">
                          Level up: {new Date(student.level_up_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Achievement Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Achievement Analytics</h3>
          <div className="text-sm text-gray-600">
            {metrics?.achievements_unlocked_today} unlocked today
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const difficultyColors = {
              bronze: 'from-orange-400 to-orange-600',
              silver: 'from-gray-400 to-gray-600',
              gold: 'from-yellow-400 to-yellow-600',
              platinum: 'from-purple-400 to-purple-600'
            };

            return (
              <motion.div
                key={achievement.achievement_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${difficultyColors[achievement.difficulty]} rounded-full flex items-center justify-center text-white text-2xl`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-semibold">{achievement.completion_rate.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${achievement.completion_rate}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Earned</span>
                    <span className="font-semibold">{achievement.total_earned}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rarity</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(achievement.rarity_score * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {achievement.recent_earners.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Recent Earners:</div>
                      {achievement.recent_earners.slice(0, 2).map((earner, i) => (
                        <div key={i} className="text-xs text-gray-700">
                          {earner.student_name} • {new Date(earner.earned_date).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCompetitions = () => (
    <div className="space-y-6">
      {competitions.map((competition, index) => (
        <motion.div
          key={competition.competition_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{competition.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(competition.start_date).toLocaleDateString()} - {new Date(competition.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  competition.status === 'active' ? 'bg-green-100 text-green-800' :
                  competition.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {competition.status}
                </span>
                <span className="text-sm text-gray-600">{competition.participants} participants</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leaderboard */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Top Performers</h4>
                <div className="space-y-3">
                  {competition.top_performers.map((performer, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                          i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {performer.rank}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{performer.student_name}</div>
                          <div className="text-sm text-gray-500">{performer.class_name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{performer.score.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{performer.metric}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competition Stats */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Competition Stats</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Engagement Score</span>
                    <span className="font-semibold">{competition.total_engagement.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${competition.total_engagement}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Participation Rate</span>
                    <span className="font-semibold">{competition.average_participation.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${competition.average_participation}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">{competition.completion_rate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${competition.completion_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gamification analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gamification Analytics</h2>
            <p className="text-gray-600">XP progression, achievements, and competition tracking</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_term">This Term</option>
          </select>
          
          <button
            onClick={loadGamificationData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'xp', label: 'XP Progression', icon: Zap },
              { key: 'achievements', label: 'Achievements', icon: Award },
              { key: 'competitions', label: 'Competitions', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'xp' && renderXPProgressions()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'competitions' && renderCompetitions()}
        </div>
      </div>

      {/* Streak Leaders Sidebar */}
      {metrics && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Current Streak Leaders</h3>
          </div>
          
          <div className="space-y-3">
            {metrics.current_streak_leaders.map((leader, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{leader.student_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold text-orange-600">{leader.streak_days} days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
