// Assignment Analytics Service
// Tracks usage patterns and collects feedback for the consolidated assignment system

import { SupabaseClient } from '@supabase/supabase-js';

export interface AssignmentCreationEvent {
  userId: string;
  creatorType: 'consolidated' | 'standard' | 'enhanced';
  mode?: 'quick' | 'standard' | 'advanced';
  curriculumLevel: 'KS3' | 'KS4';
  gameCount: number;
  vocabularyCount: number;
  timeToComplete: number; // in seconds
  completedSuccessfully: boolean;
  errorMessage?: string;
}

export interface TeacherFeedback {
  userId: string;
  creatorType: 'consolidated' | 'standard' | 'enhanced';
  mode?: 'quick' | 'standard' | 'advanced';
  rating: number; // 1-5 stars
  feedback: string;
  suggestedImprovements?: string;
  wouldRecommend: boolean;
}

export interface UsageAnalytics {
  totalAssignments: number;
  creatorTypeBreakdown: Record<string, number>;
  modeBreakdown: Record<string, number>;
  curriculumLevelBreakdown: Record<string, number>;
  averageTimeToComplete: number;
  successRate: number;
  averageRating: number;
  topFeedbackThemes: string[];
}

export class AssignmentAnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Track assignment creation event
   */
  async trackAssignmentCreation(event: AssignmentCreationEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('assignment_creation_analytics')
        .insert([{
          user_id: event.userId,
          creator_type: event.creatorType,
          mode: event.mode,
          curriculum_level: event.curriculumLevel,
          game_count: event.gameCount,
          vocabulary_count: event.vocabularyCount,
          time_to_complete: event.timeToComplete,
          completed_successfully: event.completedSuccessfully,
          error_message: event.errorMessage,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error tracking assignment creation:', error);
      }
    } catch (error) {
      console.error('Error tracking assignment creation:', error);
    }
  }

  /**
   * Submit teacher feedback
   */
  async submitFeedback(feedback: TeacherFeedback): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('teacher_feedback')
        .insert([{
          user_id: feedback.userId,
          creator_type: feedback.creatorType,
          mode: feedback.mode,
          rating: feedback.rating,
          feedback: feedback.feedback,
          suggested_improvements: feedback.suggestedImprovements,
          would_recommend: feedback.wouldRecommend,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error submitting feedback:', error);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  }

  /**
   * Get usage analytics for dashboard
   */
  async getUsageAnalytics(dateRange?: { start: Date; end: Date }): Promise<UsageAnalytics> {
    try {
      let query = this.supabase
        .from('assignment_creation_analytics')
        .select('*');

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start.toISOString())
          .lte('created_at', dateRange.end.toISOString());
      }

      const { data: events, error } = await query;

      if (error) {
        console.error('Error fetching analytics:', error);
        return this.getEmptyAnalytics();
      }

      // Calculate analytics
      const totalAssignments = events?.length || 0;
      const successfulAssignments = events?.filter(e => e.completed_successfully).length || 0;
      
      const creatorTypeBreakdown = events?.reduce((acc, event) => {
        acc[event.creator_type] = (acc[event.creator_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const modeBreakdown = events?.reduce((acc, event) => {
        if (event.mode) {
          acc[event.mode] = (acc[event.mode] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const curriculumLevelBreakdown = events?.reduce((acc, event) => {
        acc[event.curriculum_level] = (acc[event.curriculum_level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const averageTimeToComplete = events?.length 
        ? events.reduce((sum, event) => sum + (event.time_to_complete || 0), 0) / events.length
        : 0;

      const successRate = totalAssignments > 0 ? (successfulAssignments / totalAssignments) * 100 : 0;

      // Get feedback data
      const { data: feedbackData } = await this.supabase
        .from('teacher_feedback')
        .select('rating, feedback');

      const averageRating = feedbackData?.length
        ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length
        : 0;

      const topFeedbackThemes = this.extractFeedbackThemes(feedbackData || []);

      return {
        totalAssignments,
        creatorTypeBreakdown,
        modeBreakdown,
        curriculumLevelBreakdown,
        averageTimeToComplete,
        successRate,
        averageRating,
        topFeedbackThemes
      };

    } catch (error) {
      console.error('Error getting usage analytics:', error);
      return this.getEmptyAnalytics();
    }
  }

  /**
   * Get teacher feedback summary
   */
  async getFeedbackSummary(): Promise<{
    totalFeedback: number;
    averageRating: number;
    recommendationRate: number;
    recentFeedback: any[];
  }> {
    try {
      const { data: feedback, error } = await this.supabase
        .from('teacher_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        return {
          totalFeedback: 0,
          averageRating: 0,
          recommendationRate: 0,
          recentFeedback: []
        };
      }

      const totalFeedback = feedback?.length || 0;
      const averageRating = feedback?.length
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        : 0;
      
      const recommendationRate = feedback?.length
        ? (feedback.filter(f => f.would_recommend).length / feedback.length) * 100
        : 0;

      const recentFeedback = feedback?.slice(0, 10) || [];

      return {
        totalFeedback,
        averageRating,
        recommendationRate,
        recentFeedback
      };

    } catch (error) {
      console.error('Error getting feedback summary:', error);
      return {
        totalFeedback: 0,
        averageRating: 0,
        recommendationRate: 0,
        recentFeedback: []
      };
    }
  }

  /**
   * Track mode selection in consolidated creator
   */
  async trackModeSelection(userId: string, mode: 'quick' | 'standard' | 'advanced'): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('mode_selection_analytics')
        .insert([{
          user_id: userId,
          mode: mode,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error tracking mode selection:', error);
      }
    } catch (error) {
      console.error('Error tracking mode selection:', error);
    }
  }

  /**
   * Get mode popularity analytics
   */
  async getModePopularity(): Promise<Record<string, number>> {
    try {
      const { data, error } = await this.supabase
        .from('mode_selection_analytics')
        .select('mode');

      if (error) {
        console.error('Error fetching mode popularity:', error);
        return {};
      }

      return data?.reduce((acc, item) => {
        acc[item.mode] = (acc[item.mode] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    } catch (error) {
      console.error('Error getting mode popularity:', error);
      return {};
    }
  }

  private getEmptyAnalytics(): UsageAnalytics {
    return {
      totalAssignments: 0,
      creatorTypeBreakdown: {},
      modeBreakdown: {},
      curriculumLevelBreakdown: {},
      averageTimeToComplete: 0,
      successRate: 0,
      averageRating: 0,
      topFeedbackThemes: []
    };
  }

  private extractFeedbackThemes(feedback: any[]): string[] {
    // Simple keyword extraction for feedback themes
    const keywords = feedback
      .map(f => f.feedback?.toLowerCase() || '')
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const keywordCounts = keywords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }
}

// Create database tables for analytics (run these migrations)
export const ANALYTICS_MIGRATIONS = {
  assignment_creation_analytics: `
    CREATE TABLE IF NOT EXISTS assignment_creation_analytics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      creator_type TEXT NOT NULL,
      mode TEXT,
      curriculum_level TEXT NOT NULL,
      game_count INTEGER NOT NULL,
      vocabulary_count INTEGER NOT NULL,
      time_to_complete INTEGER NOT NULL,
      completed_successfully BOOLEAN NOT NULL,
      error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  teacher_feedback: `
    CREATE TABLE IF NOT EXISTS teacher_feedback (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      creator_type TEXT NOT NULL,
      mode TEXT,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      feedback TEXT NOT NULL,
      suggested_improvements TEXT,
      would_recommend BOOLEAN NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  mode_selection_analytics: `
    CREATE TABLE IF NOT EXISTS mode_selection_analytics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      mode TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
};
