'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { GrammarAnalyticsService, GrammarInsights } from '../../../../services/analytics/GrammarAnalyticsService';
import {
  BookOpen,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  Brain,
  Lightbulb,
  Trophy,
  Flame,
  Star,
  BarChart3,
  Calendar,
  Activity
} from 'lucide-react';

interface GrammarScoreCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: string;
  isLoading?: boolean;
}

function GrammarScoreCard({ title, value, subtitle, icon: Icon, color, isLoading }: GrammarScoreCardProps) {
  return (
    <div className={`${color} text-white rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold">
            {isLoading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-sm opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className="h-8 w-8 opacity-80" />
      </div>
    </div>
  );
}

interface ConjugationMatrixProps {
  matrixData: Array<{
    tense: string;
    person: string;
    accuracyPercentage: number;
    totalAttempts: number;
    needsPractice: boolean;
  }>;
  isLoading: boolean;
  language: string;
}

function ConjugationMatrix({ matrixData, isLoading, language }: ConjugationMatrixProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conjugation Matrix</h3>
        <div className="animate-pulse">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get unique tenses and persons
  const tenses = [...new Set(matrixData.map(d => d.tense))].sort();

  // Language-specific pronouns
  const getPersonsForLanguage = (lang: string) => {
    switch (lang) {
      case 'es':
        return ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
      case 'fr':
        return ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
      case 'de':
        return ['ich', 'du', 'er/sie', 'wir', 'ihr', 'sie'];
      default:
        return ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
    }
  };

  const persons = getPersonsForLanguage(language);

  const getMatrixCell = (tense: string, person: string) => {
    return matrixData.find(d => d.tense === tense && d.person === person);
  };

  const getColorClass = (accuracy: number, attempts: number) => {
    if (attempts === 0) return 'bg-gray-100 text-gray-400';
    if (accuracy >= 90) return 'bg-green-500 text-white';
    if (accuracy >= 80) return 'bg-green-400 text-white';
    if (accuracy >= 70) return 'bg-yellow-400 text-white';
    if (accuracy >= 60) return 'bg-orange-400 text-white';
    return 'bg-red-400 text-white';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conjugation Matrix</h3>
      <p className="text-sm text-gray-600 mb-4">
        Your performance across different tenses and pronouns. Green = strong, Red = needs practice.
      </p>
      
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-max">
          {/* Header row */}
          <div className="font-semibold text-sm text-gray-700 p-2"></div>
          {persons.map(person => (
            <div key={person} className="font-semibold text-sm text-gray-700 p-2 text-center">
              {person}
            </div>
          ))}
          
          {/* Data rows */}
          {tenses.map(tense => (
            <React.Fragment key={tense}>
              <div className="font-semibold text-sm text-gray-700 p-2 capitalize">
                {tense}
              </div>
              {persons.map(person => {
                const cell = getMatrixCell(tense, person);
                const accuracy = cell?.accuracyPercentage || 0;
                const attempts = cell?.totalAttempts || 0;
                
                return (
                  <div
                    key={`${tense}-${person}`}
                    className={`p-2 rounded text-center text-sm font-medium ${getColorClass(accuracy, attempts)}`}
                    title={`${tense} - ${person}: ${accuracy}% (${attempts} attempts)`}
                  >
                    {attempts > 0 ? `${accuracy}%` : '-'}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PerformanceBreakdownProps {
  tensePerformance: Array<{
    tense: string;
    accuracyPercentage: number;
    totalAttempts: number;
  }>;
  verbTypePerformance: Array<{
    verbType: string;
    accuracyPercentage: number;
    totalAttempts: number;
  }>;
  isLoading: boolean;
}

function PerformanceBreakdown({ tensePerformance, verbTypePerformance, isLoading }: PerformanceBreakdownProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tense Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          Tense Performance
        </h3>
        <div className="space-y-3">
          {tensePerformance.slice(0, 5).map(tense => (
            <div key={tense.tense} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {tense.tense}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${getPerformanceColor(tense.accuracyPercentage)}`}>
                  {tense.accuracyPercentage}%
                </span>
                <span className="text-xs text-gray-500">
                  ({tense.totalAttempts} attempts)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verb Type Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
          Verb Type Performance
        </h3>
        <div className="space-y-3">
          {verbTypePerformance.map(verbType => (
            <div key={verbType.verbType} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {verbType.verbType.replace('_', '-')} verbs
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${getPerformanceColor(verbType.accuracyPercentage)}`}>
                  {verbType.accuracyPercentage}%
                </span>
                <span className="text-xs text-gray-500">
                  ({verbType.totalAttempts} attempts)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// New comprehensive data interfaces
interface GrammarSession {
  id: string;
  topic_title: string;
  topic_slug: string;
  category: string;
  difficulty_level: string;
  final_score: number;
  accuracy_percentage: string;
  duration_seconds: number;
  gems_earned: number;
  xp_earned: number;
  created_at: string;
  session_data: {
    question_attempts: Array<{
      question_id: string;
      question_text: string;
      question_type: string;
      correct_answer: string;
      student_answer: string;
      is_correct: boolean;
      hint_used: boolean;
      difficulty_level: string;
      response_time_ms: number;
    }>;
  };
}

interface TopicStats {
  topic_title: string;
  topic_slug: string;
  category: string;
  sessions_count: number;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  total_gems: number;
  total_xp: number;
  avg_score: number;
  last_practiced: string;
}

interface CategoryStats {
  category: string;
  sessions_count: number;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  total_gems: number;
  topics_practiced: number;
}

export default function GrammarAnalyticsPage() {
  const { user } = useAuth();
  const [grammarData, setGrammarData] = useState<GrammarInsights | null>(null);
  const [sessions, setSessions] = useState<GrammarSession[]>([]);
  const [topicStats, setTopicStats] = useState<TopicStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedView, setSelectedView] = useState<'overview' | 'topics' | 'categories' | 'sessions'>('overview');

  useEffect(() => {
    if (user?.id) {
      loadGrammarData();
    }
  }, [user?.id, selectedLanguage]);

  const loadGrammarData = async () => {
    try {
      setLoading(true);
      console.log('📊 [GRAMMAR ANALYTICS] Loading data for student:', user!.id);

      // Load analytics service data
      const analyticsService = new GrammarAnalyticsService();
      const data = await analyticsService.getStudentGrammarAnalytics(user!.id, selectedLanguage);
      setGrammarData(data);

      // Load comprehensive session data from database
      await loadComprehensiveData();

    } catch (error) {
      console.error('Error loading grammar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComprehensiveData = async () => {
    try {
      console.log('📊 [GRAMMAR ANALYTICS] Fetching sessions for student:', user!.id);

      // Fetch all grammar sessions with topic details
      const { data: sessionsData, error: sessionsError } = await supabaseBrowser
        .from('grammar_assignment_sessions')
        .select(`
          id,
          topic_id,
          completion_status,
          final_score,
          accuracy_percentage,
          duration_seconds,
          gems_earned,
          xp_earned,
          created_at,
          session_data,
          grammar_topics (
            title,
            slug,
            category,
            difficulty_level,
            language
          )
        `)
        .eq('student_id', user!.id)
        .eq('completion_status', 'completed')
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('❌ [GRAMMAR ANALYTICS] Error fetching sessions:', sessionsError);
        return;
      }

      console.log('📊 [GRAMMAR ANALYTICS] Raw sessions data:', sessionsData?.length || 0);

      // Transform sessions data
      const transformedSessions: GrammarSession[] = (sessionsData || []).map((session: any) => {
        console.log('📊 [GRAMMAR ANALYTICS] Session:', {
          id: session.id,
          topic: session.grammar_topics,
          gems: session.gems_earned
        });

        return {
          id: session.id,
          topic_title: session.grammar_topics?.title || 'Unknown Topic',
          topic_slug: session.grammar_topics?.slug || '',
          category: session.grammar_topics?.category || 'general',
          difficulty_level: session.grammar_topics?.difficulty_level || 'beginner',
          final_score: session.final_score,
          accuracy_percentage: session.accuracy_percentage,
          duration_seconds: session.duration_seconds,
          gems_earned: session.gems_earned,
          xp_earned: session.xp_earned,
          created_at: session.created_at,
          session_data: session.session_data
        };
      });

      setSessions(transformedSessions);
      console.log('✅ [GRAMMAR ANALYTICS] Loaded sessions:', transformedSessions.length);
      console.log('✅ [GRAMMAR ANALYTICS] Total gems:', transformedSessions.reduce((sum, s) => sum + s.gems_earned, 0));

      // Calculate topic stats
      const topicStatsMap = new Map<string, TopicStats>();
      transformedSessions.forEach(session => {
        const key = session.topic_slug;
        if (!topicStatsMap.has(key)) {
          topicStatsMap.set(key, {
            topic_title: session.topic_title,
            topic_slug: session.topic_slug,
            category: session.category,
            sessions_count: 0,
            total_questions: 0,
            correct_answers: 0,
            accuracy: 0,
            total_gems: 0,
            total_xp: 0,
            avg_score: 0,
            last_practiced: session.created_at
          });
        }

        const stats = topicStatsMap.get(key)!;
        const questionAttempts = session.session_data?.question_attempts || [];
        const correctCount = questionAttempts.filter(q => q.is_correct).length;

        stats.sessions_count++;
        stats.total_questions += questionAttempts.length;
        stats.correct_answers += correctCount;
        stats.total_gems += session.gems_earned;
        stats.total_xp += session.xp_earned;
        stats.avg_score = (stats.avg_score * (stats.sessions_count - 1) + session.final_score) / stats.sessions_count;
        stats.accuracy = stats.total_questions > 0 ? (stats.correct_answers / stats.total_questions) * 100 : 0;

        if (new Date(session.created_at) > new Date(stats.last_practiced)) {
          stats.last_practiced = session.created_at;
        }
      });

      const topicStatsArray = Array.from(topicStatsMap.values()).sort((a, b) => b.sessions_count - a.sessions_count);
      setTopicStats(topicStatsArray);
      console.log('📊 [GRAMMAR ANALYTICS] Topic stats:', topicStatsArray.length);

      // Calculate category stats
      const categoryStatsMap = new Map<string, CategoryStats>();
      transformedSessions.forEach(session => {
        const category = session.category;
        if (!categoryStatsMap.has(category)) {
          categoryStatsMap.set(category, {
            category,
            sessions_count: 0,
            total_questions: 0,
            correct_answers: 0,
            accuracy: 0,
            total_gems: 0,
            topics_practiced: new Set<string>().size
          });
        }

        const stats = categoryStatsMap.get(category)!;
        const questionAttempts = session.session_data?.question_attempts || [];
        const correctCount = questionAttempts.filter(q => q.is_correct).length;

        stats.sessions_count++;
        stats.total_questions += questionAttempts.length;
        stats.correct_answers += correctCount;
        stats.total_gems += session.gems_earned;
        stats.accuracy = stats.total_questions > 0 ? (stats.correct_answers / stats.total_questions) * 100 : 0;
      });

      // Count unique topics per category
      topicStatsArray.forEach(topic => {
        const stats = categoryStatsMap.get(topic.category);
        if (stats) {
          stats.topics_practiced++;
        }
      });

      const categoryStatsArray = Array.from(categoryStatsMap.values()).sort((a, b) => b.total_gems - a.total_gems);
      setCategoryStats(categoryStatsArray);
      console.log('📊 [GRAMMAR ANALYTICS] Category stats:', categoryStatsArray.length);

    } catch (error) {
      console.error('Error loading comprehensive data:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Please log in to view your grammar progress</h2>
        </div>
      </div>
    );
  }

  // Calculate overall stats
  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce((sum, s) => sum + (s.session_data?.question_attempts?.length || 0), 0);
  const totalCorrect = sessions.reduce((sum, s) => {
    const attempts = s.session_data?.question_attempts || [];
    return sum + attempts.filter(q => q.is_correct).length;
  }, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalGems = sessions.reduce((sum, s) => sum + s.gems_earned, 0);
  const totalXP = sessions.reduce((sum, s) => sum + s.xp_earned, 0);
  const avgSessionDuration = totalSessions > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / totalSessions) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="h-8 w-8 mr-3 text-purple-600" />
                Grammar Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive tracking of your grammar mastery and progress
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedView('overview')}
                className={`${
                  selectedView === 'overview'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setSelectedView('topics')}
                className={`${
                  selectedView === 'topics'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Topics ({topicStats.length})
              </button>
              <button
                onClick={() => setSelectedView('categories')}
                className={`${
                  selectedView === 'categories'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Target className="h-4 w-4 mr-2" />
                Categories ({categoryStats.length})
              </button>
              <button
                onClick={() => setSelectedView('sessions')}
                className={`${
                  selectedView === 'sessions'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Activity className="h-4 w-4 mr-2" />
                Sessions ({totalSessions})
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <>
            {/* Grammar Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GrammarScoreCard
                title="Overall Accuracy"
                value={`${overallAccuracy}%`}
                subtitle={`${totalCorrect}/${totalQuestions} correct`}
                icon={Target}
                color="bg-gradient-to-r from-purple-500 to-indigo-600"
                isLoading={loading}
              />
              <GrammarScoreCard
                title="Grammar Gems"
                value={totalGems}
                subtitle={`${sessions.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).reduce((sum, s) => sum + s.gems_earned, 0)} today`}
                icon={Zap}
                color="bg-gradient-to-r from-yellow-500 to-orange-500"
                isLoading={loading}
              />
              <GrammarScoreCard
                title="Grammar XP"
                value={totalXP}
                subtitle={`${sessions.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).reduce((sum, s) => sum + s.xp_earned, 0)} today`}
                icon={TrendingUp}
                color="bg-gradient-to-r from-green-500 to-emerald-600"
                isLoading={loading}
              />
              <GrammarScoreCard
                title="Total Sessions"
                value={totalSessions}
                subtitle={`Avg ${avgSessionDuration}s per session`}
                icon={Activity}
                color="bg-gradient-to-r from-blue-500 to-cyan-600"
                isLoading={loading}
              />
            </div>

            {/* Conjugation Matrix */}
            <div className="mb-8">
              <ConjugationMatrix
                matrixData={grammarData?.conjugationMatrix || []}
                isLoading={loading}
                language={selectedLanguage}
              />
            </div>

            {/* Performance Breakdown */}
            <div className="mb-8">
              <PerformanceBreakdown
                tensePerformance={grammarData?.tensePerformance || []}
                verbTypePerformance={grammarData?.verbTypePerformance || []}
                isLoading={loading}
              />
            </div>
          </>
        )}

        {/* Topics Tab */}
        {selectedView === 'topics' && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : topicStats.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Topics Practiced Yet</h3>
                <p className="text-gray-600">Start practicing grammar topics to see your progress here!</p>
              </div>
            ) : (
              topicStats.map((topic, index) => (
                <div key={topic.topic_slug} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{topic.topic_title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{topic.category} • {topic.difficulty_level}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Accuracy</p>
                          <p className={`text-xl font-bold ${
                            topic.accuracy >= 80 ? 'text-green-600' :
                            topic.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Math.round(topic.accuracy)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Sessions</p>
                          <p className="text-xl font-bold text-gray-900">{topic.sessions_count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Gems Earned</p>
                          <p className="text-xl font-bold text-yellow-600">{topic.total_gems}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Questions</p>
                          <p className="text-xl font-bold text-gray-900">{topic.correct_answers}/{topic.total_questions}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Last practiced: {new Date(topic.last_practiced).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Trophy className="h-4 w-4 mr-1" />
                          Avg Score: {Math.round(topic.avg_score)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Categories Tab - Will add next */}
        {selectedView === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : categoryStats.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Practiced Yet</h3>
                <p className="text-gray-600">Start practicing to see category breakdowns!</p>
              </div>
            ) : (
              categoryStats.map((category) => (
                <div key={category.category} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{category.category}</h3>
                    <Flame className="h-6 w-6 text-orange-500" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accuracy</span>
                      <span className={`text-lg font-bold ${
                        category.accuracy >= 80 ? 'text-green-600' :
                        category.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(category.accuracy)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Topics Practiced</span>
                      <span className="text-lg font-bold text-gray-900">{category.topics_practiced}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Sessions</span>
                      <span className="text-lg font-bold text-gray-900">{category.sessions_count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gems Earned</span>
                      <span className="text-lg font-bold text-yellow-600">{category.total_gems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Questions</span>
                      <span className="text-lg font-bold text-gray-900">{category.correct_answers}/{category.total_questions}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sessions Tab - Will add next */}
        {selectedView === 'sessions' && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Yet</h3>
                <p className="text-gray-600">Complete grammar practice sessions to see them here!</p>
              </div>
            ) : (
              sessions.map((session) => {
                const questionAttempts = session.session_data?.question_attempts || [];
                const correctCount = questionAttempts.filter(q => q.is_correct).length;
                const accuracy = questionAttempts.length > 0 ? Math.round((correctCount / questionAttempts.length) * 100) : 0;

                return (
                  <div key={session.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{session.topic_title}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(session.created_at).toLocaleString()} • {session.duration_seconds}s
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Score</p>
                            <p className="text-lg font-bold text-purple-600">{session.final_score}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Accuracy</p>
                            <p className={`text-lg font-bold ${
                              accuracy >= 80 ? 'text-green-600' :
                              accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {accuracy}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Questions</p>
                            <p className="text-lg font-bold text-gray-900">{correctCount}/{questionAttempts.length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Gems</p>
                            <p className="text-lg font-bold text-yellow-600">{session.gems_earned}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">XP</p>
                            <p className="text-lg font-bold text-green-600">{session.xp_earned}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
