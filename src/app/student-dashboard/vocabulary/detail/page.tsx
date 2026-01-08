// Student Vocabulary Detail Page
// Shows detailed information about a specific vocabulary word with FSRS data

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Volume2,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Star,
  Brain,
  Calendar,
  BarChart3,
  Play,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';

interface VocabularyDetail {
  id: string;
  word: string;
  translation: string;
  language: string;
  category: string;
  subcategory: string;
  curriculum_level: string;
  part_of_speech: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  
  // FSRS Data
  fsrs_difficulty: number;
  fsrs_stability: number;
  fsrs_retrievability: number;
  fsrs_last_review?: string;
  fsrs_review_count: number;
  fsrs_lapse_count: number;
  fsrs_state: string;
  
  // Performance Data
  total_encounters: number;
  correct_encounters: number;
  incorrect_encounters: number;
  current_streak: number;
  best_streak: number;
  mastery_level: number;
  gem_level: number;
  last_encountered_at?: string;
  next_review_at?: string;
}

export default function VocabularyDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [vocabularyDetail, setVocabularyDetail] = useState<VocabularyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemId = searchParams.get('item');

  useEffect(() => {
    if (user?.id && itemId) {
      loadVocabularyDetail();
    }
  }, [user?.id, itemId]);

  const loadVocabularyDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get vocabulary gem collection record using both ID systems
      // First try with centralized_vocabulary_id, then with vocabulary_item_id
      let gemData = null;
      let gemError = null;

      // Try centralized vocabulary ID first
      const { data: centralizedData, error: centralizedError } = await supabase
        .from('vocabulary_gem_collection')
        .select('*')
        .eq('student_id', user!.id)
        .eq('centralized_vocabulary_id', itemId)
        .maybeSingle();

      if (centralizedData) {
        gemData = centralizedData;
      } else {
        // Try legacy vocabulary_item_id
        const { data: legacyData, error: legacyError } = await supabase
          .from('vocabulary_gem_collection')
          .select('*')
          .eq('student_id', user!.id)
          .eq('vocabulary_item_id', itemId)
          .maybeSingle();

        if (legacyData) {
          gemData = legacyData;
        } else {
          gemError = legacyError || centralizedError || new Error('Vocabulary record not found');
        }
      }

      if (gemError) {
        console.error('Error loading vocabulary gem collection:', gemError);
        throw gemError;
      }

      if (!gemData) {
        console.error('No vocabulary gem collection record found for:', { itemId, userId: user!.id });
        throw new Error('Vocabulary record not found. This word may not have been practiced yet.');
      }

      // Get vocabulary details using the appropriate ID
      const vocabularyId = gemData.vocabulary_item_id || gemData.centralized_vocabulary_id;
      const { data: vocabularyData, error: vocabError } = await supabase
        .from('centralized_vocabulary')
        .select(`
          id,
          word,
          translation,
          language,
          category,
          subcategory,
          curriculum_level,
          part_of_speech,
          example_sentence,
          example_translation,
          audio_url
        `)
        .eq('id', vocabularyId)
        .single();

      if (vocabError) {
        throw vocabError;
      }

      // Combine the data
      const data = {
        ...gemData,
        centralized_vocabulary: vocabularyData
      };

      if (data) {
        const detail: VocabularyDetail = {
          id: data.vocabulary_item_id,
          word: data.centralized_vocabulary.word,
          translation: data.centralized_vocabulary.translation,
          language: data.centralized_vocabulary.language,
          category: data.centralized_vocabulary.category,
          subcategory: data.centralized_vocabulary.subcategory,
          curriculum_level: data.centralized_vocabulary.curriculum_level,
          part_of_speech: data.centralized_vocabulary.part_of_speech,
          example_sentence: data.centralized_vocabulary.example_sentence,
          example_translation: data.centralized_vocabulary.example_translation,
          audio_url: data.centralized_vocabulary.audio_url,
          
          fsrs_difficulty: data.fsrs_difficulty || 5,
          fsrs_stability: data.fsrs_stability || 1,
          fsrs_retrievability: data.fsrs_retrievability || 1,
          fsrs_last_review: data.fsrs_last_review,
          fsrs_review_count: data.fsrs_review_count || 0,
          fsrs_lapse_count: data.fsrs_lapse_count || 0,
          fsrs_state: data.fsrs_state || 'new',
          
          total_encounters: data.total_encounters || 0,
          correct_encounters: data.correct_encounters || 0,
          incorrect_encounters: data.incorrect_encounters || 0,
          current_streak: data.current_streak || 0,
          best_streak: data.best_streak || 0,
          mastery_level: data.mastery_level || 0,
          gem_level: data.gem_level || 1,
          last_encountered_at: data.last_encountered_at,
          next_review_at: data.next_review_at
        };

        setVocabularyDetail(detail);
      }

    } catch (err) {
      console.error('Error loading vocabulary detail:', err);
      setError('Failed to load vocabulary details');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (vocabularyDetail?.audio_url) {
      const audio = new Audio(vocabularyDetail.audio_url);
      audio.play().catch(console.error);
    }
  };

  const getAccuracyPercentage = () => {
    if (!vocabularyDetail || vocabularyDetail.total_encounters === 0) return 0;
    return Math.round((vocabularyDetail.correct_encounters / vocabularyDetail.total_encounters) * 100);
  };

  const getMasteryLabel = (level: number) => {
    if (level === 0) return 'New';
    if (level <= 2) return 'Learning';
    if (level <= 4) return 'Familiar';
    if (level <= 6) return 'Confident';
    if (level <= 8) return 'Strong';
    return 'Mastered';
  };

  const getRetrievabilityColor = (retrievability: number) => {
    if (retrievability >= 0.8) return 'text-green-600 bg-green-50';
    if (retrievability >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary details...</p>
        </div>
      </div>
    );
  }

  if (error || !vocabularyDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Word Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This vocabulary word could not be found.'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vocabulary Details</h1>
              <p className="text-gray-600">{vocabularyDetail.category} • {vocabularyDetail.curriculum_level}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Word Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h2 className="text-4xl font-bold text-gray-900">{vocabularyDetail.word}</h2>
              {vocabularyDetail.audio_url && (
                <button
                  onClick={playAudio}
                  className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <Volume2 className="w-6 h-6 text-blue-600" />
                </button>
              )}
            </div>
            <p className="text-2xl text-gray-600 mb-2">{vocabularyDetail.translation}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {vocabularyDetail.part_of_speech} • {vocabularyDetail.language}
            </p>
          </div>

          {vocabularyDetail.example_sentence && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 mb-1 italic">"{vocabularyDetail.example_sentence}"</p>
              {vocabularyDetail.example_translation && (
                <p className="text-gray-600 text-sm">"{vocabularyDetail.example_translation}"</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Accuracy */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{getAccuracyPercentage()}%</div>
            <div className="text-sm text-gray-500">
              {vocabularyDetail.correct_encounters}/{vocabularyDetail.total_encounters} correct
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-900">Current Streak</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{vocabularyDetail.current_streak}</div>
            <div className="text-sm text-gray-500">
              Best: {vocabularyDetail.best_streak}
            </div>
          </div>

          {/* Mastery Level */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Mastery</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{vocabularyDetail.mastery_level}</div>
            <div className="text-sm text-gray-500">
              {getMasteryLabel(vocabularyDetail.mastery_level)}
            </div>
          </div>

          {/* Memory Strength */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Memory Strength</span>
            </div>
            <div className={`text-3xl font-bold ${getRetrievabilityColor(vocabularyDetail.fsrs_retrievability).split(' ')[0]}`}>
              {Math.round(vocabularyDetail.fsrs_retrievability * 100)}%
            </div>
            <div className="text-sm text-gray-500">
              Retrievability
            </div>
          </div>
        </div>

        {/* FSRS Memory Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Memory Analytics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Difficulty Level</div>
              <div className="text-2xl font-bold text-gray-900">{vocabularyDetail.fsrs_difficulty.toFixed(1)}</div>
              <div className="text-xs text-gray-500">1 = Easy, 10 = Hard</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Memory Stability</div>
              <div className="text-2xl font-bold text-gray-900">{vocabularyDetail.fsrs_stability.toFixed(1)} days</div>
              <div className="text-xs text-gray-500">How long memory lasts</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Review Count</div>
              <div className="text-2xl font-bold text-gray-900">{vocabularyDetail.fsrs_review_count}</div>
              <div className="text-xs text-gray-500">Times practiced</div>
            </div>
          </div>

          {vocabularyDetail.next_review_at && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Next Review</span>
              </div>
              <p className="text-blue-800 mt-1">
                {new Date(vocabularyDetail.next_review_at).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Practice Button */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/student-dashboard/activities?word=${vocabularyDetail.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Practice This Word</span>
          </button>
        </div>
      </div>
    </div>
  );
}
