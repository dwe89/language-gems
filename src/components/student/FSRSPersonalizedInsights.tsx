// FSRS-Powered Personalized Learning Insights for Student Dashboard
// Enhances existing student dashboard with memory-based recommendations

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Target,
  Clock,
  TrendingUp,
  Star,
  Zap,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Trophy,
  Flame,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { FSRSRecommendationService, WordRecommendation } from '../../services/fsrsRecommendationService';
import { FSRSAnalyticsService, FSRSStudentAnalytics } from '../../services/fsrsAnalyticsService';

interface PersonalizedInsight {
  type: 'review_due' | 'struggling_words' | 'mastery_milestone' | 'study_streak' | 'optimal_timing';
  title: string;
  description: string;
  actionText: string;
  actionUrl?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  data?: any;
}

interface FSRSPersonalizedInsightsProps {
  className?: string;
}

export default function FSRSPersonalizedInsights({ className = '' }: FSRSPersonalizedInsightsProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [recommendationService] = useState(() => new FSRSRecommendationService(supabase));
  const [analyticsService] = useState(() => new FSRSAnalyticsService(supabase));
  
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [fsrsAnalytics, setFsrsAnalytics] = useState<FSRSStudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadPersonalizedInsights();
    }
  }, [user?.id]);

  const loadPersonalizedInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load FSRS analytics for the student
      const analytics = await analyticsService.generateStudentAnalytics(user!.id);
      setFsrsAnalytics(analytics);

      // Get word recommendations
      const recommendations = await recommendationService.getWordRecommendations(user!.id, {
        maxWords: 20,
        includeNewWords: true,
        includeReviews: true,
        includeStrugglingWords: true
      });

      // Generate personalized insights
      const generatedInsights = generateInsights(analytics, recommendations);
      setInsights(generatedInsights);

    } catch (err) {
      console.error('Error loading personalized insights:', err);
      setError('Failed to load personalized insights');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (analytics: FSRSStudentAnalytics, recommendations: WordRecommendation[]): PersonalizedInsight[] => {
    const insights: PersonalizedInsight[] = [];

    // 1. Review Due Insight
    const dueWords = recommendations.filter(w => w.reason === 'due_review');
    if (dueWords.length > 0) {
      insights.push({
        type: 'review_due',
        title: `${dueWords.length} words ready for review`,
        description: `Your memory is strongest when you review at the optimal time. These words are ready now!`,
        actionText: 'Start Review Session',
        actionUrl: `/student-dashboard/activities?fsrs=true&mode=review`,
        priority: 'high',
        icon: <Clock className="w-5 h-5" />,
        data: { wordCount: dueWords.length, estimatedTime: dueWords.reduce((sum, w) => sum + w.estimatedStudyTime, 0) }
      });
    }

    // 2. Struggling Words Insight
    const strugglingWords = analytics.learningEfficiency.strugglingWords;
    if (strugglingWords.length > 0) {
      insights.push({
        type: 'struggling_words',
        title: `Focus on ${strugglingWords.length} challenging words`,
        description: `These words need extra attention. Targeted practice will help you master them faster.`,
        actionText: 'Practice Difficult Words',
        actionUrl: `/student-dashboard/activities?fsrs=true&mode=struggling`,
        priority: 'high',
        icon: <Target className="w-5 h-5" />,
        data: { wordCount: strugglingWords.length }
      });
    }

    // 3. Mastery Milestone Insight
    const masteredWords = analytics.learningEfficiency.masteredWords;
    if (masteredWords.length > 0) {
      const recentMastery = masteredWords.length >= 5;
      if (recentMastery) {
        insights.push({
          type: 'mastery_milestone',
          title: `🎉 You've mastered ${masteredWords.length} words!`,
          description: `Great progress! These words are now in your long-term memory.`,
          actionText: 'See Mastered Words',
          actionUrl: `/student-dashboard/vocabulary?filter=mastered`,
          priority: 'medium',
          icon: <Trophy className="w-5 h-5" />,
          data: { masteredCount: masteredWords.length }
        });
      }
    }

    // 4. Optimal Study Time Insight
    const currentHour = new Date().getHours();
    const isOptimalTime = currentHour >= 9 && currentHour <= 11; // Morning is often best for learning
    if (isOptimalTime && recommendations.length > 0) {
      insights.push({
        type: 'optimal_timing',
        title: 'Perfect time to study!',
        description: `Morning hours are great for learning. Your brain is fresh and ready to absorb new information.`,
        actionText: 'Start Learning Session',
        actionUrl: `/student-dashboard/activities?fsrs=true`,
        priority: 'medium',
        icon: <Zap className="w-5 h-5" />,
        data: { optimalTime: true }
      });
    }

    // 5. Learning Efficiency Insight
    const efficiency = analytics.memoryStrengthProfile.learningVelocity;
    if (efficiency > 0) {
      insights.push({
        type: 'study_streak',
        title: `Learning ${Math.round(efficiency)} words per week`,
        description: `You're making steady progress! Keep up the consistent practice to maintain this pace.`,
        actionText: 'Continue Learning',
        actionUrl: `/student-dashboard/activities`,
        priority: 'low',
        icon: <TrendingUp className="w-5 h-5" />,
        data: { velocity: efficiency }
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-orange-800';
      case 'low': return 'text-green-800';
      default: return 'text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your personalized insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={loadPersonalizedInsights}
          className="mt-3 text-red-600 hover:text-red-800 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Your Learning Insights</h3>
        <span className="text-sm text-gray-500">Powered by memory science</span>
      </div>

      {/* Insights Grid */}
      {insights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {insights.map((insight, index) => (
              <motion.div
                key={`${insight.type}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${getPriorityTextColor(insight.priority)} mt-1`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${getPriorityTextColor(insight.priority)} mb-1`}>
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {insight.description}
                    </p>
                    
                    {/* Action Button */}
                    {insight.actionUrl ? (
                      <a
                        href={insight.actionUrl}
                        className={`inline-flex items-center space-x-2 text-sm font-medium ${getPriorityTextColor(insight.priority)} hover:underline`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{insight.actionText}</span>
                      </a>
                    ) : (
                      <span className={`text-sm font-medium ${getPriorityTextColor(insight.priority)}`}>
                        {insight.actionText}
                      </span>
                    )}

                    {/* Additional Data */}
                    {insight.data && (
                      <div className="mt-2 text-xs text-gray-500">
                        {insight.data.wordCount && (
                          <span>{insight.data.wordCount} words</span>
                        )}
                        {insight.data.estimatedTime && (
                          <span> • ~{insight.data.estimatedTime} min</span>
                        )}
                        {insight.data.velocity && (
                          <span>Velocity: {Math.round(insight.data.velocity)} words/week</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            You're all caught up! 🎉
          </h4>
          <p className="text-gray-600">
            No urgent reviews needed. Keep up the great work!
          </p>
        </div>
      )}

      {/* Memory Stats Summary */}
      {fsrsAnalytics && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {fsrsAnalytics.vocabularyMastery.length}
              </div>
              <div className="text-sm text-gray-600">Words Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(fsrsAnalytics.memoryStrengthProfile.averageRetrievability * 100)}%
              </div>
              <div className="text-sm text-gray-600">Memory Strength</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(fsrsAnalytics.memoryStrengthProfile.learningVelocity)}
              </div>
              <div className="text-sm text-gray-600">Words/Week</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
