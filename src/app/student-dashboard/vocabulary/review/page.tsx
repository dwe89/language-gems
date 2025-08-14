// Student Vocabulary Review Page
// Shows words due for review based on FSRS scheduling

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Brain,
  Target,
  Play,
  Calendar,
  AlertCircle,
  CheckCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';

interface ReviewWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  curriculum_level: string;
  fsrs_retrievability: number;
  fsrs_difficulty: number;
  fsrs_stability: number;
  next_review_at: string;
  days_overdue: number;
  priority: 'high' | 'medium' | 'low';
}

export default function VocabularyReviewPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [reviewWords, setReviewWords] = useState<ReviewWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'high-priority'>('all');

  useEffect(() => {
    if (user?.id) {
      loadReviewWords();
    }
  }, [user?.id]);

  const loadReviewWords = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all vocabulary gem collection records for review
      const { data: gemData, error: gemError } = await supabase
        .from('vocabulary_gem_collection')
        .select(`
          vocabulary_item_id,
          centralized_vocabulary_id,
          next_review_at,
          fsrs_retrievability,
          fsrs_difficulty,
          fsrs_stability
        `)
        .eq('student_id', user!.id)
        .filter('fsrs_difficulty', 'not.is', 'null')
        .not('next_review_at', 'is', null)
        .order('next_review_at', { ascending: true });

      if (gemError) throw gemError;

      if (!gemData || gemData.length === 0) {
        setWords([]);
        setLoading(false);
        return;
      }

      // Get vocabulary details for all records using both ID systems
      const vocabularyIds = gemData
        .map(item => item.vocabulary_item_id || item.centralized_vocabulary_id)
        .filter(Boolean);

      const { data: vocabularyData, error: vocabError } = await supabase
        .from('centralized_vocabulary')
        .select('id, word, translation, category, curriculum_level')
        .in('id', vocabularyIds);

      if (vocabError) throw vocabError;

      // Create a map for quick vocabulary lookup
      const vocabularyMap = new Map(
        vocabularyData?.map(vocab => [vocab.id, vocab]) || []
      );

      // Combine gem data with vocabulary details
      const data = gemData
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

      const now = new Date();
      const processedWords: ReviewWord[] = (data || []).map(item => {
        const reviewDate = new Date(item.next_review_at);
        const daysOverdue = Math.max(0, Math.ceil((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        let priority: 'high' | 'medium' | 'low' = 'low';
        if (daysOverdue > 3 || item.fsrs_retrievability < 0.6) {
          priority = 'high';
        } else if (daysOverdue > 0 || item.fsrs_retrievability < 0.8) {
          priority = 'medium';
        }

        return {
          id: item.vocabulary_item_id,
          word: item.centralized_vocabulary.word,
          translation: item.centralized_vocabulary.translation,
          category: item.centralized_vocabulary.category,
          curriculum_level: item.centralized_vocabulary.curriculum_level,
          fsrs_retrievability: item.fsrs_retrievability,
          fsrs_difficulty: item.fsrs_difficulty,
          fsrs_stability: item.fsrs_stability,
          next_review_at: item.next_review_at,
          days_overdue: daysOverdue,
          priority
        };
      });

      setReviewWords(processedWords);

    } catch (err) {
      console.error('Error loading review words:', err);
      setError('Failed to load review words');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredWords = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'overdue':
        return reviewWords.filter(w => w.days_overdue > 0);
      case 'today':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return reviewWords.filter(w => {
          const reviewDate = new Date(w.next_review_at);
          return reviewDate >= today && reviewDate < tomorrow;
        });
      case 'high-priority':
        return reviewWords.filter(w => w.priority === 'high');
      default:
        return reviewWords;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-orange-800';
      default: return 'text-green-800';
    }
  };

  const getRetrievabilityColor = (retrievability: number) => {
    if (retrievability >= 0.8) return 'text-green-600';
    if (retrievability >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredWords = getFilteredWords();
  const overdueCount = reviewWords.filter(w => w.days_overdue > 0).length;
  const todayCount = reviewWords.filter(w => {
    const today = new Date();
    const reviewDate = new Date(w.next_review_at);
    return reviewDate.toDateString() === today.toDateString();
  }).length;
  const highPriorityCount = reviewWords.filter(w => w.priority === 'high').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your review schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadReviewWords}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Schedule</h1>
              <p className="text-gray-600 mt-2">Words ready for review based on memory science</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{reviewWords.length}</div>
                <div className="text-sm text-gray-500">Total words</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-900">Overdue</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{overdueCount}</div>
            <div className="text-sm text-gray-500">Need immediate review</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Due Today</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{todayCount}</div>
            <div className="text-sm text-gray-500">Scheduled for today</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">High Priority</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{highPriorityCount}</div>
            <div className="text-sm text-gray-500">Need extra attention</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">On Track</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{reviewWords.length - overdueCount - highPriorityCount}</div>
            <div className="text-sm text-gray-500">Good progress</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All Words', count: reviewWords.length },
            { key: 'overdue', label: 'Overdue', count: overdueCount },
            { key: 'today', label: 'Due Today', count: todayCount },
            { key: 'high-priority', label: 'High Priority', count: highPriorityCount }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Review Words List */}
        {filteredWords.length > 0 ? (
          <div className="space-y-4">
            {filteredWords.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-6 ${getPriorityColor(word.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{word.word}</h3>
                      <span className="text-lg text-gray-600">{word.translation}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(word.priority)} ${getPriorityTextColor(word.priority)}`}>
                        {word.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>{word.category} • {word.curriculum_level}</span>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-4 h-4" />
                        <span className={getRetrievabilityColor(word.fsrs_retrievability)}>
                          {Math.round(word.fsrs_retrievability * 100)}% memory strength
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {word.days_overdue > 0 
                            ? `${word.days_overdue} days overdue`
                            : `Due ${new Date(word.next_review_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => window.location.href = `/student-dashboard/games?word=${word.id}&mode=review`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Review</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No words to review!' : `No ${filter.replace('-', ' ')} words`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Great job! All your words are up to date.'
                : 'Try selecting a different filter to see more words.'
              }
            </p>
          </div>
        )}

        {/* Start Review Session Button */}
        {filteredWords.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = `/student-dashboard/games?mode=review&filter=${filter}`}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg flex items-center space-x-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start Review Session ({filteredWords.length} words)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
