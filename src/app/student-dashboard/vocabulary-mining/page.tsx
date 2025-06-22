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

interface VocabularyTopic {
  theme: string;
  topic: string;
  word_count: number;
}

export default function VocabularyMiningPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hybrid Learning Model State
  const [selectedTab, setSelectedTab] = useState<'assignments' | 'practice' | 'vault' | 'achievements'>('assignments');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [vocabularyTopics, setVocabularyTopics] = useState<VocabularyTopic[]>([]);
  const [vocabularyByTheme, setVocabularyByTheme] = useState<{[key: string]: VocabularyTopic[]}>({});
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
        topicPerformance: [] as TopicPerformance[],
        recentAchievements: [] as any[],
        dailyGoal: null as DailyGoal | null
      };
      
      try {
        gems = await miningService.getCombinedGemCollection(user.id);
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
        summary = await miningService.getCombinedProgressSummary(user.id);
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

      // Load available vocabulary topics organized by theme
      try {
        // Use the RPC function to get topic counts
        const { data: vocabTopics, error: vocabError } = await supabase
          .rpc('get_vocabulary_topic_counts');

        if (!vocabError && vocabTopics) {
          setVocabularyTopics(vocabTopics);
          
          // Group by theme
          const byTheme = vocabTopics.reduce((acc: {[key: string]: VocabularyTopic[]}, topic: VocabularyTopic) => {
            if (!acc[topic.theme]) {
              acc[topic.theme] = [];
            }
            acc[topic.theme].push(topic);
            return acc;
          }, {} as {[key: string]: VocabularyTopic[]});
          
          setVocabularyByTheme(byTheme);
        }
      } catch (vocabError) {
        console.warn('Failed to load vocabulary topics:', vocabError);
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
      
      setQuickStats(prev => ({
        ...prev,
        totalGems: gems.length,
        masteredGems: masteredCount,
        currentStreak: maxStreak,
        reviewsDue: reviewItems.length,
        weeklyProgress: summary.averageAccuracy
      }));
      
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
                🌟 Free Practice - Vocabulary by Topic
              </h3>
              <p className="text-indigo-200 mb-6">
                Explore and practice vocabulary organized by theme and topic. Each session will turn vocabulary into collectible gems!
              </p>

              {Object.keys(vocabularyByTheme).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(vocabularyByTheme).map(([theme, topics]) => (
                    <div key={theme} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="font-semibold text-white mb-4 text-lg">🎯 {theme}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topics.map((topic) => (
                          <div key={`${theme}-${topic.topic}`} className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors">
                            <h5 className="font-medium text-white mb-2">{topic.topic}</h5>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-indigo-200 text-sm">{topic.word_count} words</span>
                              <div className="flex items-center text-yellow-400 text-sm">
                                <Gem className="w-4 h-4 mr-1" />
                                <span>Gems Available</span>
                              </div>
                            </div>
                            <Link
                              href={`/student-dashboard/vocabulary-mining/practice?theme=${encodeURIComponent(theme)}&topic=${encodeURIComponent(topic.topic)}`}
                              className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 block text-center font-medium"
                            >
                              Start Mining Session
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-indigo-200 mb-4">Loading vocabulary topics...</p>
                  <p className="text-indigo-300 text-sm">Organize vocabulary by theme and topic for targeted practice!</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gemCollection.slice(0, 12).map((gem) => (
                      <VocabularyGemCard key={gem.id} gem={gem} />
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
    </div>
  );
}

// Component to display individual vocabulary gems with vocabulary info
function VocabularyGemCard({ gem }: { gem: GemCollection }) {
  const [vocabularyInfo, setVocabularyInfo] = React.useState<{ spanish: string; english: string } | null>(null);
  const { supabase } = useSupabase();

  React.useEffect(() => {
    const loadVocabularyInfo = async () => {
      if (gem.id.startsWith('practice-')) {
        // This is from the practice table, get vocabulary info
        const { data, error } = await supabase
          .from('student_vocabulary_practice')
          .select('spanish_term, english_translation')
          .eq('id', gem.id.replace('practice-', ''))
          .single();
        
        if (!error && data) {
          setVocabularyInfo({ 
            spanish: data.spanish_term, 
            english: data.english_translation 
          });
        }
      } else {
        // This is from the main collection, get vocabulary_items info
        const { data, error } = await supabase
          .from('vocabulary_items')
          .select('term, translation')
          .eq('id', gem.vocabularyItemId)
          .single();
        
        if (!error && data) {
          setVocabularyInfo({ 
            spanish: data.term, 
            english: data.translation 
          });
        }
      }
    };

    loadVocabularyInfo();
  }, [gem.id, gem.vocabularyItemId, supabase]);

  return (
    <div className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors">
      <div className="text-center mb-3">
        <div className="text-3xl mb-2">
          {gem.masteryLevel >= 5 ? '👑' :
           gem.masteryLevel >= 4 ? '💍' :
           gem.masteryLevel >= 3 ? '💎' :
           gem.masteryLevel >= 2 ? '🔹' : '🪨'}
        </div>
        <div className="text-xs font-medium text-indigo-300">
          Level {gem.masteryLevel}
        </div>
      </div>
      
      {vocabularyInfo ? (
        <div className="space-y-2">
          <div className="text-center">
            <div className="text-sm font-medium text-white">{vocabularyInfo.spanish}</div>
            <div className="text-xs text-indigo-200">{vocabularyInfo.english}</div>
          </div>
          <div className="flex justify-between text-xs text-indigo-300">
            <span>{gem.correctEncounters}/{gem.totalEncounters}</span>
            <span>🔥{gem.currentStreak}</span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-xs text-indigo-300">Loading...</div>
        </div>
      )}
    </div>
  );
}
