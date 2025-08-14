// Student Vocabulary Progress Page
// Shows detailed progress tracking with FSRS insights

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Clock,
  Brain,
  Star,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';

interface ProgressData {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  newWords: number;
  averageAccuracy: number;
  totalPracticeTime: number;
  currentStreak: number;
  wordsThisWeek: number;
  weeklyProgress: Array<{
    week: string;
    wordsLearned: number;
    accuracy: number;
  }>;
  categoryProgress: Array<{
    category: string;
    total: number;
    mastered: number;
    accuracy: number;
  }>;
}

export default function VocabularyProgressPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadProgressData();
    }
  }, [user?.id]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get vocabulary collection data
      const { data: gemData, error: gemError } = await supabase
        .from('vocabulary_gem_collection')
        .select(`
          *
        `)
        .eq('student_id', user!.id);

      if (gemError) throw gemError;

      if (!gemData || gemData.length === 0) {
        // Set empty progress data structure
        setProgressData({
          totalWords: 0,
          masteredWords: 0,
          learningWords: 0,
          newWords: 0,
          averageAccuracy: 0,
          totalPracticeTime: 0,
          currentStreak: 0,
          wordsThisWeek: 0,
          weeklyProgress: [],
          categoryProgress: []
        });
        setLoading(false);
        return;
      }

      // Get vocabulary details for all records using both ID systems
      const vocabularyIds = gemData
        .map(item => item.vocabulary_item_id || item.centralized_vocabulary_id)
        .filter(Boolean);

      const { data: vocabularyData, error: vocabError } = await supabase
        .from('centralized_vocabulary')
        .select('id, category, curriculum_level')
        .in('id', vocabularyIds);

      if (vocabError) throw vocabError;

      // Create a map for quick vocabulary lookup
      const vocabularyMap = new Map(
        vocabularyData?.map(vocab => [vocab.id, vocab]) || []
      );

      // Combine gem data with vocabulary details
      const vocabData = gemData
        .map(gem => {
          const vocabularyId = gem.vocabulary_item_id || gem.centralized_vocabulary_id;
          const vocabulary = vocabularyMap.get(vocabularyId);

          if (!vocabulary) return null;

          return {
            ...gem,
            centralized_vocabulary: vocabulary
          };
        })
        .filter(Boolean);

      // Get recent game sessions for weekly progress
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('enhanced_game_sessions')
        .select('started_at, accuracy_percentage, duration_seconds')
        .eq('student_id', user!.id)
        .order('started_at', { ascending: false })
        .limit(100);

      if (sessionsError) throw sessionsError;

      // Process the data
      const processedData = processProgressData(vocabData || [], sessionsData || []);
      setProgressData(processedData);

    } catch (err) {
      console.error('Error loading progress data:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const processProgressData = (vocabData: any[], sessionsData: any[]): ProgressData => {
    // Calculate word statistics
    const totalWords = vocabData.length;
    const masteredWords = vocabData.filter(w => w.mastery_level >= 8).length;
    const learningWords = vocabData.filter(w => w.mastery_level > 0 && w.mastery_level < 8).length;
    const newWords = vocabData.filter(w => w.mastery_level === 0).length;

    // Calculate average accuracy
    const totalEncounters = vocabData.reduce((sum, w) => sum + (w.total_encounters || 0), 0);
    const correctEncounters = vocabData.reduce((sum, w) => sum + (w.correct_encounters || 0), 0);
    const averageAccuracy = totalEncounters > 0 ? Math.round((correctEncounters / totalEncounters) * 100) : 0;

    // Calculate total practice time (in minutes)
    const totalPracticeTime = Math.round(
      sessionsData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
    );

    // Calculate current streak
    const currentStreak = Math.max(...vocabData.map(w => w.current_streak || 0));

    // Calculate words practiced this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const wordsThisWeek = vocabData.filter(w => 
      w.last_encountered_at && new Date(w.last_encountered_at) > oneWeekAgo
    ).length;

    // Generate weekly progress (last 8 weeks)
    const weeklyProgress = generateWeeklyProgress(vocabData, sessionsData);

    // Generate category progress
    const categoryProgress = generateCategoryProgress(vocabData);

    return {
      totalWords,
      masteredWords,
      learningWords,
      newWords,
      averageAccuracy,
      totalPracticeTime,
      currentStreak,
      wordsThisWeek,
      weeklyProgress,
      categoryProgress
    };
  };

  const generateWeeklyProgress = (vocabData: any[], sessionsData: any[]) => {
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekSessions = sessionsData.filter(s => {
        const sessionDate = new Date(s.started_at);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      const wordsLearned = vocabData.filter(w => {
        if (!w.first_learned_at) return false;
        const learnedDate = new Date(w.first_learned_at);
        return learnedDate >= weekStart && learnedDate <= weekEnd;
      }).length;

      const accuracy = weekSessions.length > 0 
        ? Math.round(weekSessions.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / weekSessions.length)
        : 0;

      weeks.push({
        week: weekStart.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
        wordsLearned,
        accuracy
      });
    }
    return weeks;
  };

  const generateCategoryProgress = (vocabData: any[]) => {
    const categoryMap = new Map();

    vocabData.forEach(word => {
      const category = word.centralized_vocabulary?.category || 'Other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { total: 0, mastered: 0, correct: 0, encounters: 0 });
      }

      const cat = categoryMap.get(category);
      cat.total++;
      if (word.mastery_level >= 8) cat.mastered++;
      cat.correct += word.correct_encounters || 0;
      cat.encounters += word.total_encounters || 0;
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      mastered: data.mastered,
      accuracy: data.encounters > 0 ? Math.round((data.correct / data.encounters) * 100) : 0
    })).sort((a, b) => b.total - a.total);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load progress data'}</p>
          <button
            onClick={loadProgressData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Learning Progress</h1>
          <p className="text-gray-600 mt-2">Track your vocabulary mastery journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Total Words</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{progressData.totalWords}</div>
            <div className="text-sm text-gray-500">In your collection</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Mastered</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{progressData.masteredWords}</div>
            <div className="text-sm text-gray-500">
              {progressData.totalWords > 0 ? Math.round((progressData.masteredWords / progressData.totalWords) * 100) : 0}% complete
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{progressData.averageAccuracy}%</div>
            <div className="text-sm text-gray-500">Overall average</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Practice Time</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{progressData.totalPracticeTime}</div>
            <div className="text-sm text-gray-500">Minutes total</div>
          </motion.div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
          <div className="grid grid-cols-8 gap-2">
            {progressData.weeklyProgress.map((week, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{week.week}</div>
                <div 
                  className="bg-blue-100 rounded-lg p-2 mb-1"
                  style={{ height: `${Math.max(20, week.wordsLearned * 10)}px` }}
                >
                  <div className="text-xs font-medium text-blue-800">{week.wordsLearned}</div>
                </div>
                <div className="text-xs text-gray-600">{week.accuracy}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Category</h3>
          <div className="space-y-4">
            {progressData.categoryProgress.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{category.category}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{category.mastered}/{category.total} mastered</span>
                    <span className="text-sm text-gray-600">{category.accuracy}% accuracy</span>
                  </div>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(category.mastered / category.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
