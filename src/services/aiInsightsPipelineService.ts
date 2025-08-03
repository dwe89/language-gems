import { createClient } from '@supabase/supabase-js';
import { RealTimeAnalyticsService } from './realTimeAnalyticsService';
import { AIInsightsService } from './aiInsightsService';

export interface PipelineInsight {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  confidence_score: number;
  priority: 'high' | 'medium' | 'low';
  affected_students: string[];
  status: 'new' | 'acknowledged' | 'resolved';
  teacher_id: string;
  class_id?: string;
  insight_type: 'at_risk_student' | 'weakness_hotspot' | 'engagement_drop' | 'performance_decline' | 'achievement_opportunity';
  data_source: string;
  created_at: string;
  expires_at?: string;
}

export interface PipelineConfig {
  enabled: boolean;
  interval_minutes: number;
  max_insights_per_teacher: number;
  confidence_threshold: number;
  priority_weights: {
    at_risk_student: number;
    weakness_hotspot: number;
    engagement_drop: number;
    performance_decline: number;
    achievement_opportunity: number;
  };
}

export class AIInsightsPipelineService {
  private supabase;
  private realTimeAnalytics: RealTimeAnalyticsService;
  private aiInsights: AIInsightsService;
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.realTimeAnalytics = new RealTimeAnalyticsService();
    this.aiInsights = new AIInsightsService();
  }

  /**
   * Start the automated insights pipeline
   */
  async startPipeline(config: PipelineConfig = this.getDefaultConfig()): Promise<void> {
    if (this.isRunning) {
      console.log('AI Insights Pipeline is already running');
      return;
    }

    console.log(`Starting AI Insights Pipeline with ${config.interval_minutes} minute intervals`);
    this.isRunning = true;

    // Run immediately on start
    await this.runPipelineIteration(config);

    // Set up recurring execution
    this.intervalId = setInterval(async () => {
      try {
        await this.runPipelineIteration(config);
      } catch (error) {
        console.error('Error in pipeline iteration:', error);
      }
    }, config.interval_minutes * 60 * 1000);
  }

  /**
   * Stop the automated insights pipeline
   */
  stopPipeline(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
    console.log('AI Insights Pipeline stopped');
  }

  /**
   * Run a single iteration of the pipeline
   */
  private async runPipelineIteration(config: PipelineConfig): Promise<void> {
    console.log('Running AI Insights Pipeline iteration...');

    try {
      // 1. Get all active teachers
      const teachers = await this.getActiveTeachers();
      console.log(`Processing insights for ${teachers.length} teachers`);

      // 2. Process each teacher's data
      for (const teacher of teachers) {
        await this.processTeacherInsights(teacher.id, config);
      }

      // 3. Clean up expired insights
      await this.cleanupExpiredInsights();

      console.log('AI Insights Pipeline iteration completed successfully');
    } catch (error) {
      console.error('Error in pipeline iteration:', error);
      throw error;
    }
  }

  /**
   * Process insights for a specific teacher
   */
  private async processTeacherInsights(teacherId: string, config: PipelineConfig): Promise<void> {
    try {
      // 1. Aggregate latest analytics data for teacher's students
      const classes = await this.getTeacherClasses(teacherId);
      
      for (const classData of classes) {
        // Update analytics cache for this class
        await this.realTimeAnalytics.aggregateClassMetrics(classData.id, teacherId);
        
        // Generate AI insights for this class
        const insights = await this.aiInsights.generateProactiveInsights(teacherId, classData.id);
        
        // Filter and prioritize insights
        const filteredInsights = this.filterInsightsByConfig(insights, config);
        
        // Store new insights
        for (const insight of filteredInsights) {
          await this.storeInsight(insight, teacherId, classData.id);
        }
      }
    } catch (error) {
      console.error(`Error processing insights for teacher ${teacherId}:`, error);
    }
  }

  /**
   * Get all active teachers
   */
  private async getActiveTeachers(): Promise<{ id: string; email: string }[]> {
    const { data, error } = await this.supabase
      .from('classes')
      .select('teacher_id')
      .not('teacher_id', 'is', null);

    if (error) {
      throw new Error(`Failed to get active teachers: ${error.message}`);
    }

    // Get unique teacher IDs and their details
    const uniqueTeacherIds = [...new Set(data.map(c => c.teacher_id))];
    
    const { data: teachers, error: teachersError } = await this.supabase.auth.admin.listUsers();
    
    if (teachersError) {
      throw new Error(`Failed to get teacher details: ${teachersError.message}`);
    }

    return teachers.users
      .filter(user => uniqueTeacherIds.includes(user.id))
      .map(user => ({ id: user.id, email: user.email || '' }));
  }

  /**
   * Get classes for a specific teacher
   */
  private async getTeacherClasses(teacherId: string): Promise<{ id: string; name: string }[]> {
    const { data, error } = await this.supabase
      .from('classes')
      .select('id, name')
      .eq('teacher_id', teacherId);

    if (error) {
      throw new Error(`Failed to get teacher classes: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Filter insights based on configuration
   */
  private filterInsightsByConfig(insights: any[], config: PipelineConfig): PipelineInsight[] {
    return insights
      .filter(insight => insight.confidence_score >= config.confidence_threshold)
      .map(insight => this.mapToePipelineInsight(insight))
      .sort((a, b) => this.calculateInsightScore(b, config) - this.calculateInsightScore(a, config))
      .slice(0, config.max_insights_per_teacher);
  }

  /**
   * Calculate insight priority score
   */
  private calculateInsightScore(insight: PipelineInsight, config: PipelineConfig): number {
    const typeWeight = config.priority_weights[insight.insight_type] || 1;
    const confidenceWeight = insight.confidence_score;
    const priorityWeight = insight.priority === 'high' ? 3 : insight.priority === 'medium' ? 2 : 1;
    
    return typeWeight * confidenceWeight * priorityWeight;
  }

  /**
   * Map AI insight to pipeline insight format
   */
  private mapToePipelineInsight(insight: any): PipelineInsight {
    return {
      id: insight.id || crypto.randomUUID(),
      title: insight.title,
      description: insight.description,
      recommendation: insight.recommendation,
      confidence_score: insight.confidence_score,
      priority: insight.priority || 'medium',
      affected_students: insight.affected_students || [],
      status: 'new',
      teacher_id: insight.teacher_id,
      class_id: insight.class_id,
      insight_type: insight.insight_type || 'performance_decline',
      data_source: 'ai_pipeline',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
  }

  /**
   * Store insight in database
   */
  private async storeInsight(insight: PipelineInsight, teacherId: string, classId: string): Promise<void> {
    // Check if similar insight already exists
    const existingInsight = await this.findSimilarInsight(insight, teacherId);
    
    if (existingInsight) {
      // Update existing insight
      await this.updateInsight(existingInsight.id, insight);
    } else {
      // Create new insight
      await this.createInsight(insight);
    }
  }

  /**
   * Find similar existing insight
   */
  private async findSimilarInsight(insight: PipelineInsight, teacherId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('ai_insights')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('insight_type', insight.insight_type)
      .eq('status', 'new')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(1);

    if (error) {
      console.error('Error finding similar insight:', error);
      return null;
    }

    return data?.[0] || null;
  }

  /**
   * Create new insight
   */
  private async createInsight(insight: PipelineInsight): Promise<void> {
    const { error } = await this.supabase
      .from('ai_insights')
      .insert([insight]);

    if (error) {
      console.error('Error creating insight:', error);
      throw error;
    }
  }

  /**
   * Update existing insight
   */
  private async updateInsight(insightId: string, newInsight: PipelineInsight): Promise<void> {
    const { error } = await this.supabase
      .from('ai_insights')
      .update({
        description: newInsight.description,
        recommendation: newInsight.recommendation,
        confidence_score: newInsight.confidence_score,
        priority: newInsight.priority,
        affected_students: newInsight.affected_students,
        updated_at: new Date().toISOString()
      })
      .eq('id', insightId);

    if (error) {
      console.error('Error updating insight:', error);
      throw error;
    }
  }

  /**
   * Clean up expired insights
   */
  private async cleanupExpiredInsights(): Promise<void> {
    const { error } = await this.supabase
      .from('ai_insights')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired insights:', error);
    }
  }

  /**
   * Get default pipeline configuration
   */
  private getDefaultConfig(): PipelineConfig {
    return {
      enabled: true,
      interval_minutes: 5,
      max_insights_per_teacher: 10,
      confidence_threshold: 0.7,
      priority_weights: {
        at_risk_student: 5,
        weakness_hotspot: 4,
        engagement_drop: 4,
        performance_decline: 3,
        achievement_opportunity: 2
      }
    };
  }

  /**
   * Get pipeline status
   */
  getStatus(): { isRunning: boolean; hasInterval: boolean } {
    return {
      isRunning: this.isRunning,
      hasInterval: !!this.intervalId
    };
  }
}
