'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../services/vocabulary-mining';
import { ProgressDashboard } from '../../../components/vocabulary-mining/ProgressDashboard';
import { GemDisplay, GemGrid } from '../../../components/vocabulary-mining/GemDisplay';
import { 
  VocabularyGem, 
  GemCollection, 
  DailyGoal,
  TopicPerformance 
} from '../../../types/vocabulary-mining';
import { 
  calculateDailyGoalProgress,
  getItemsNeedingReview,
  formatDuration 
} from '../../../utils/vocabulary-mining';
import {
  Pickaxe,
  Target,
  Zap,
  Calendar,
  TrendingUp,
  AlertCircle,
  Play,
  BookOpen,
  Award,
  Clock,
  Star,
  ChevronRight,
  RefreshCw,
  Gem,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

export default function VocabularyMiningPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hybrid Learning Model State
  const [selectedTab, setSelectedTab] = useState<'assignments' | 'practice' | 'vault' | 'achievements'>('assignments');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [vocabularyTopics, setVocabularyTopics] = useState<any[]>([]);
  const [vocabularyByTheme, setVocabularyByTheme] = useState<{[key: string]: any[]}>({});
  const [achievements, setAchievements] = useState<any[]>([]);

  // Dashboard data
  const [gemCollection, setGemCollection] = useState<GemCollection[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);
  const [itemsNeedingReview, setItemsNeedingReview] = useState<GemCollection[]>([]);

  // Quick stats
  const [quickStats, setQuickStats] = useState({
    totalGems: 0,
    masteredGems: 0,
    currentStreak: 0,
    reviewsDue: 0,
    weeklyProgress: 0,
    pendingAssignments: 0,
    completedAssignments: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load all dashboard data with individual error handling
      let gems: GemCollection[] = [];
      let goal: DailyGoal | null = null;
      let topics: TopicPerformance[] = [];
      let summary = {
        totalGems: 0,
        masteredGems: 0,
        gemsNeedingReview: 0,
        averageAccuracy: 0,
        totalPracticeTime: 0,
        currentStreak: 0,
        topicPerformance: [],
        recentAchievements: [],
        dailyGoal: null
      };
      
      try {
        gems = await miningService.getGemCollection(user.id);
      } catch (gemsError) {
        console.warn('Failed to load gem collection:', gemsError);
      }
      
      try {
        goal = await miningService.getDailyGoal(user.id);
      } catch (goalError) {
        console.warn('Failed to load daily goal:', goalError);
      }
      
      try {
        topics = await miningService.getTopicPerformance(user.id);
      } catch (topicsError) {
        console.warn('Failed to load topic performance:', topicsError);
      }
      
      try {
        summary = await miningService.getStudentProgressSummary(user.id);
      } catch (summaryError) {
        console.warn('Failed to load progress summary:', summaryError);
      }

      // Load assignments
      try {
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            id, title, description, due_date, points, game_type,
            assignment_submissions!left(id, completed_at, score)
          `)
          .eq('class_id', user.id) // This would need proper class membership logic
          .order('due_date', { ascending: true });

        if (!assignmentsError && assignmentsData) {
          setAssignments(assignmentsData);
          const pending = assignmentsData.filter(a => !a.assignment_submissions?.length).length;
          const completed = assignmentsData.filter(a => a.assignment_submissions?.length > 0).length;

          setQuickStats(prev => ({
            ...prev,
            pendingAssignments: pending,
            completedAssignments: completed
          }));
        }
      } catch (assignmentsError) {
        console.warn('Failed to load assignments:', assignmentsError);
      }

      // Load available vocabulary sets for free practice
      try {
        const { data: vocabSets, error: vocabError } = await supabase
          .from('vocabulary_lists')
          .select('id, name, description, language, difficulty, total_words')
          .eq('is_public', true)
          .order('name');

        if (!vocabError && vocabSets) {
          setAvailableVocabularySets(vocabSets);
        }
      } catch (vocabError) {
        console.warn('Failed to load vocabulary sets:', vocabError);
      }

      // Load achievements
      try {
        const achievementsData = await miningService.getAchievements(user.id);
        setAchievements(achievementsData);
      } catch (achievementsError) {
        console.warn('Failed to load achievements:', achievementsError);
      }

      setGemCollection(gems);
      setDailyGoal(goal);
      setTopicPerformance(topics);
      
      // Calculate items needing review
      const reviewItems = getItemsNeedingReview(gems);
      setItemsNeedingReview(reviewItems);
      
      // Calculate quick stats
      const masteredCount = gems.filter(gem => gem.masteryLevel >= 4).length;
      const maxStreak = gems.length > 0 ? Math.max(...gems.map(gem => gem.currentStreak), 0) : 0;
      
      setQuickStats({
        totalGems: gems.length,
        masteredGems: masteredCount,
        currentStreak: maxStreak,
        reviewsDue: reviewItems.length,
        weeklyProgress: summary.averageAccuracy,
        pendingAssignments: 0, // Will be loaded separately
        completedAssignments: 0 // Will be loaded separately
      });
      
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Some vocabulary mining features may not be available yet.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading your mining dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Vocabulary Mining Not Available</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-3">
              <button
                onClick={loadDashboardData}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
              >
                Try Again
              </button>
              <Link
                href="/student-dashboard"
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 block text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dailyProgress = dailyGoal ? calculateDailyGoalProgress(
    dailyGoal.wordsPracticed,
    dailyGoal.targetWords,
    dailyGoal.minutesPracticed,
    dailyGoal.targetMinutes
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500 rounded-xl">
                <Pickaxe className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Vocabulary Mining</h1>
                <p className="text-indigo-200">Master vocabulary through assignments, practice, and collection</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {quickStats.currentStreak > 0 && (
                <div className="flex items-center bg-yellow-500/20 text-yellow-100 px-3 py-2 rounded-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{quickStats.currentStreak} day streak!</span>
                </div>
              )}

              <Link
                href="/student-dashboard/vocabulary-mining/practice"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Mining
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 p-1 bg-white/10 backdrop-blur-sm rounded-lg mb-8">
          <button
            onClick={() => setSelectedTab('assignments')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              selectedTab === 'assignments'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            📚 Required Assignments
            {quickStats.pendingAssignments > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {quickStats.pendingAssignments}
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedTab('practice')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              selectedTab === 'practice'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star className="w-4 h-4 mr-2" />
            🌟 Free Practice
          </button>
          <button
            onClick={() => setSelectedTab('vault')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              selectedTab === 'vault'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Gem className="w-4 h-4 mr-2" />
            💎 My Gem Vault
            <span className="ml-2 text-xs">({quickStats.totalGems})</span>
          </button>
          <button
            onClick={() => setSelectedTab('achievements')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              selectedTab === 'achievements'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-4 h-4 mr-2" />
            🏆 Achievements
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">{quickStats.totalGems}</div>
            <div className="text-indigo-200 text-xs">Total Gems</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-green-400 mb-1">{quickStats.masteredGems}</div>
            <div className="text-indigo-200 text-xs">Mastered</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{quickStats.currentStreak}</div>
            <div className="text-indigo-200 text-xs">Day Streak</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-orange-400 mb-1">{quickStats.reviewsDue}</div>
            <div className="text-indigo-200 text-xs">Reviews Due</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-400 mb-1">{quickStats.pendingAssignments}</div>
            <div className="text-indigo-200 text-xs">Assignments</div>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                📚 Required Assignments
              </h3>

              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{assignment.title}</h4>
                        <div className="flex items-center space-x-2">
                          {assignment.assignment_submissions?.length > 0 ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                              Completed
                            </span>
                          ) : (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                              Pending
                            </span>
                          )}
                          <span className="text-yellow-400 text-sm">{assignment.points} pts</span>
                        </div>
                      </div>
                      <p className="text-indigo-200 text-sm mb-3">{assignment.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-indigo-300">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/student-dashboard/assignments/${assignment.id}`}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                        >
                          {assignment.assignment_submissions?.length > 0 ? 'View Results' : 'Start Assignment'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-indigo-200 mb-4">No assignments yet!</p>
                  <p className="text-indigo-300 text-sm">Your teacher will assign vocabulary mining tasks here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'practice' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                🌟 Free Practice
              </h3>
              <p className="text-indigo-200 mb-6">
                Explore and practice any vocabulary set to expand your knowledge beyond assignments.
              </p>

              {availableVocabularySets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableVocabularySets.map((set) => (
                    <div key={set.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h4 className="font-medium text-white mb-2">{set.name}</h4>
                      <p className="text-indigo-200 text-sm mb-3">{set.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-indigo-300">{set.language}</span>
                        <span className="text-xs text-indigo-300">{set.total_words} words</span>
                      </div>
                      <Link
                        href={`/student-dashboard/vocabulary-mining/practice?set=${set.id}`}
                        className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 block text-center"
                      >
                        Practice Now
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-indigo-200 mb-4">No vocabulary sets available for free practice yet.</p>
                  <p className="text-indigo-300 text-sm">Check back later for new content!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'vault' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Gem className="w-5 h-5 mr-2" />
                  💎 My Gem Vault
                </h3>
                <Link
                  href="/student-dashboard/vocabulary-mining/collection"
                  className="text-indigo-300 hover:text-indigo-200 text-sm font-medium"
                >
                  View Full Collection →
                </Link>
              </div>

              {gemCollection.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{quickStats.totalGems}</div>
                      <div className="text-sm text-indigo-200">Total Gems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{quickStats.masteredGems}</div>
                      <div className="text-sm text-indigo-200">Mastered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {quickStats.totalGems > 0 ? Math.round((quickStats.masteredGems / quickStats.totalGems) * 100) : 0}%
                      </div>
                      <div className="text-sm text-indigo-200">Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{quickStats.reviewsDue}</div>
                      <div className="text-sm text-indigo-200">Need Review</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {gemCollection.slice(0, 12).map((gem) => (
                      <div key={gem.id} className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">
                          {gem.masteryLevel >= 5 ? '👑' :
                           gem.masteryLevel >= 4 ? '💍' :
                           gem.masteryLevel >= 3 ? '💎' :
                           gem.masteryLevel >= 2 ? '🔹' : '🪨'}
                        </div>
                        <div className="text-xs font-medium text-white mb-1">
                          {gem.vocabularyGem.term}
                        </div>
                        <div className="text-xs text-indigo-200">
                          Level {gem.masteryLevel}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💎</div>
                  <p className="text-indigo-200 mb-4">Your gem vault is empty!</p>
                  <p className="text-indigo-300 text-sm mb-6">Start practicing to collect your first vocabulary gems.</p>
                  <Link
                    href="/student-dashboard/vocabulary-mining/practice"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                  >
                    Start Mining
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                🏆 Achievements
              </h3>
              <p className="text-indigo-200 mb-6">
                Unlock achievements across all vocabulary activities and games.
              </p>

              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-center mb-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3"
                          style={{ backgroundColor: achievement.achievementColor }}
                        >
                          {achievement.achievementIcon || '🏆'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{achievement.achievementName}</h4>
                          <p className="text-sm text-indigo-200">{achievement.description}</p>
                        </div>
                        {achievement.pointsAwarded > 0 && (
                          <div className="text-yellow-400 font-bold">
                            +{achievement.pointsAwarded}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-indigo-300">
                        Earned: {achievement.earnedAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-indigo-200 mb-4">No achievements yet!</p>
                  <p className="text-indigo-300 text-sm">Complete vocabulary activities to unlock achievements.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Daily Goal & Quick Actions */}
          <div className="space-y-6">
            {/* Daily Goal */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Daily Goal
                </h3>
                {dailyGoal?.goalCompleted && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Completed!
                  </div>
                )}
              </div>
              
              {dailyGoal && dailyProgress ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-indigo-200 mb-2">
                      <span>Words: {dailyGoal.wordsPracticed}/{dailyGoal.targetWords}</span>
                      <span>{dailyProgress.wordsProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, dailyProgress.wordsProgress)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-indigo-200 mb-2">
                      <span>Time: {dailyGoal.minutesPracticed}/{dailyGoal.targetMinutes}min</span>
                      <span>{dailyProgress.timeProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, dailyProgress.timeProgress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-indigo-200 mb-4">No daily goal set</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                    Set Goal
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/student-dashboard/vocabulary-mining/practice"
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center">
                    <Play className="w-5 h-5 mr-3" />
                    <span className="font-medium">Practice New Words</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                
                {itemsNeedingReview.length > 0 && (
                  <Link
                    href="/student-dashboard/vocabulary-mining/review"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center">
                      <RefreshCw className="w-5 h-5 mr-3" />
                      <span className="font-medium">Review ({itemsNeedingReview.length})</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
                
                <Link
                  href="/student-dashboard/vocabulary-mining/progress"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <span className="font-medium">View Progress</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Gems & Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Gems */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Gems</h3>
                <Link
                  href="/student-dashboard/vocabulary-mining/collection"
                  className="text-indigo-300 hover:text-indigo-200 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              
              {gemCollection.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gemCollection.slice(0, 8).map((gem) => (
                    <div key={gem.id} className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">💎</div>
                      <div className="text-sm font-medium text-white mb-1">Level {gem.gemLevel}</div>
                      <div className="text-xs text-indigo-200">
                        {Math.round((gem.correctEncounters / gem.totalEncounters) * 100)}% accuracy
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">⛏️</div>
                  <p className="text-indigo-200 mb-4">Start mining to collect your first gems!</p>
                  <Link
                    href="/student-dashboard/vocabulary-mining/practice"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                  >
                    Start Mining
                  </Link>
                </div>
              )}
            </div>

            {/* Topic Performance */}
            {topicPerformance.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Topic Performance</h3>
                <div className="space-y-3">
                  {topicPerformance.slice(0, 5).map((topic) => (
                    <div key={`${topic.themeName}-${topic.topicName}`} className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">{topic.topicName}</span>
                        <span className="text-indigo-300 text-sm ml-2">({topic.themeName})</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-20 bg-white/20 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              topic.masteryPercentage >= 80 ? 'bg-green-400' :
                              topic.masteryPercentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${topic.masteryPercentage}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium w-12">
                          {topic.masteryPercentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
