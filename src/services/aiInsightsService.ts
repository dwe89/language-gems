import OpenAI from 'openai';
import { SupabaseClient } from '@supabase/supabase-js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface AIInsight {
  id?: string;
  teacher_id: string;
  insight_type: 'at_risk_student' | 'weakness_hotspot' | 'performance_prediction' | 
                'engagement_alert' | 'mastery_recommendation' | 'assignment_optimization';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  title: string;
  description: string;
  recommendation?: string;
  confidence_score: number;
  student_id?: string;
  class_id?: string;
  assignment_id?: string;
  vocabulary_theme?: string;
  skill_area?: string;
  action_taken?: string;
  generated_at: Date;
  expires_at?: Date;
}

export interface PredictiveAnalytics {
  id?: string;
  student_id: string;
  teacher_id: string;
  prediction_type: 'assignment_completion' | 'performance_forecast' | 'vocabulary_retention' |
                   'engagement_risk' | 'mastery_timeline' | 'difficulty_adaptation';
  context_id?: string;
  context_type?: string;
  predicted_value: number;
  confidence_interval_lower?: number;
  confidence_interval_upper?: number;
  probability: number;
  prediction_date: Date;
  target_date?: Date;
}

export interface StudentAnalyticsData {
  student_id: string;
  student_name: string;
  class_id: string;
  recent_performance: {
    assignments_completed: number;
    average_score: number;
    average_accuracy: number;
    time_spent: number;
    last_active: Date;
  };
  skill_breakdown: {
    [skill: string]: number;
  };
  vocabulary_performance: {
    words_attempted: number;
    words_mastered: number;
    retention_rate: number;
    difficult_words: string[];
  };
  engagement_metrics: {
    login_frequency: number;
    session_duration: number;
    streak_current: number;
    motivation_indicators: string[];
  };
}

export interface WeaknessHotspot {
  area: string;
  type: 'vocabulary' | 'grammar' | 'skill' | 'topic';
  affected_students: number;
  severity_score: number;
  common_errors: string[];
  recommended_actions: string[];
}

// =====================================================
// AI INSIGHTS SERVICE
// =====================================================

export class AIInsightsService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // =====================================================
  // MAIN INSIGHT GENERATION
  // =====================================================

  async generateInsightsForTeacher(teacherId: string): Promise<AIInsight[]> {
    try {
      // Gather comprehensive data for analysis
      const analyticsData = await this.gatherTeacherAnalyticsData(teacherId);
      
      // Generate different types of insights
      const insights = await Promise.all([
        this.generateAtRiskStudentInsights(teacherId, analyticsData),
        this.generateWeaknessHotspotInsights(teacherId, analyticsData),
        this.generatePerformancePredictions(teacherId, analyticsData),
        this.generateEngagementAlerts(teacherId, analyticsData),
        this.generateMasteryRecommendations(teacherId, analyticsData)
      ]);

      // Flatten and sort by priority
      const allInsights = insights.flat().sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // Store insights in database
      await this.storeInsights(allInsights);

      return allInsights;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return [];
    }
  }

  // =====================================================
  // SPECIFIC INSIGHT GENERATORS
  // =====================================================

  private async generateAtRiskStudentInsights(
    teacherId: string, 
    data: StudentAnalyticsData[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    for (const student of data) {
      const riskFactors = this.calculateRiskFactors(student);
      
      if (riskFactors.riskScore > 0.6) {
        const aiAnalysis = await this.getAIAnalysis('at_risk_student', {
          student: student,
          riskFactors: riskFactors.factors
        });

        insights.push({
          teacher_id: teacherId,
          insight_type: 'at_risk_student',
          priority: riskFactors.riskScore > 0.8 ? 'urgent' : 'high',
          status: 'active',
          title: `${student.student_name} may be struggling`,
          description: aiAnalysis.description,
          recommendation: aiAnalysis.recommendation,
          confidence_score: aiAnalysis.confidence,
          student_id: student.student_id,
          class_id: student.class_id,
          skill_area: riskFactors.primaryWeakness,
          generated_at: new Date(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
      }
    }

    return insights;
  }

  private async generateWeaknessHotspotInsights(
    teacherId: string,
    data: StudentAnalyticsData[]
  ): Promise<AIInsight[]> {
    const hotspots = this.identifyWeaknessHotspots(data);
    const insights: AIInsight[] = [];

    for (const hotspot of hotspots) {
      if (hotspot.affected_students >= 3 && hotspot.severity_score > 0.5) {
        const aiAnalysis = await this.getAIAnalysis('weakness_hotspot', {
          hotspot: hotspot,
          affectedStudents: hotspot.affected_students
        });

        insights.push({
          teacher_id: teacherId,
          insight_type: 'weakness_hotspot',
          priority: hotspot.severity_score > 0.7 ? 'high' : 'medium',
          status: 'active',
          title: `Class struggling with ${hotspot.area}`,
          description: aiAnalysis.description,
          recommendation: aiAnalysis.recommendation,
          confidence_score: aiAnalysis.confidence,
          vocabulary_theme: hotspot.type === 'vocabulary' ? hotspot.area : undefined,
          skill_area: hotspot.type === 'skill' ? hotspot.area : undefined,
          generated_at: new Date(),
          expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
        });
      }
    }

    return insights;
  }

  private async generatePerformancePredictions(
    teacherId: string,
    data: StudentAnalyticsData[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    for (const student of data) {
      const prediction = await this.predictStudentPerformance(student);
      
      if (prediction.probability < 0.4) { // Low success probability
        const aiAnalysis = await this.getAIAnalysis('performance_prediction', {
          student: student,
          prediction: prediction
        });

        insights.push({
          teacher_id: teacherId,
          insight_type: 'performance_prediction',
          priority: 'medium',
          status: 'active',
          title: `${student.student_name} may underperform on upcoming assignments`,
          description: aiAnalysis.description,
          recommendation: aiAnalysis.recommendation,
          confidence_score: aiAnalysis.confidence,
          student_id: student.student_id,
          class_id: student.class_id,
          generated_at: new Date(),
          expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
        });
      }
    }

    return insights;
  }

  private async generateEngagementAlerts(
    teacherId: string,
    data: StudentAnalyticsData[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    for (const student of data) {
      const engagementScore = this.calculateEngagementScore(student);
      
      if (engagementScore < 0.3) {
        const aiAnalysis = await this.getAIAnalysis('engagement_alert', {
          student: student,
          engagementScore: engagementScore
        });

        insights.push({
          teacher_id: teacherId,
          insight_type: 'engagement_alert',
          priority: 'high',
          status: 'active',
          title: `${student.student_name} showing low engagement`,
          description: aiAnalysis.description,
          recommendation: aiAnalysis.recommendation,
          confidence_score: aiAnalysis.confidence,
          student_id: student.student_id,
          class_id: student.class_id,
          generated_at: new Date(),
          expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        });
      }
    }

    return insights;
  }

  private async generateMasteryRecommendations(
    teacherId: string,
    data: StudentAnalyticsData[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Analyze class-wide mastery patterns
    const masteryAnalysis = this.analyzeMasteryPatterns(data);
    
    if (masteryAnalysis.opportunities.length > 0) {
      const aiAnalysis = await this.getAIAnalysis('mastery_recommendation', {
        opportunities: masteryAnalysis.opportunities,
        classSize: data.length
      });

      insights.push({
        teacher_id: teacherId,
        insight_type: 'mastery_recommendation',
        priority: 'medium',
        status: 'active',
        title: 'Optimization opportunities identified',
        description: aiAnalysis.description,
        recommendation: aiAnalysis.recommendation,
        confidence_score: aiAnalysis.confidence,
        generated_at: new Date(),
        expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days
      });
    }

    return insights;
  }

  // =====================================================
  // AI ANALYSIS HELPER
  // =====================================================

  private async getAIAnalysis(
    insightType: string, 
    context: any
  ): Promise<{ description: string; recommendation: string; confidence: number }> {
    const prompt = this.buildAnalysisPrompt(insightType, context);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        description: result.description || 'Analysis generated',
        recommendation: result.recommendation || 'Review student progress',
        confidence: Math.min(Math.max(result.confidence || 0.7, 0.0), 1.0)
      };
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      return {
        description: 'Automated analysis detected an issue requiring attention',
        recommendation: 'Please review the student data and consider appropriate interventions',
        confidence: 0.5
      };
    }
  }

  private buildAnalysisPrompt(insightType: string, context: any): string {
    const basePrompt = `You are an AI teaching assistant analyzing student performance data for a language learning platform. `;

    switch (insightType) {
      case 'at_risk_student':
        return `${basePrompt}

Student: ${context.student.student_name}
Recent Performance: ${JSON.stringify(context.student.recent_performance)}
Risk Factors: ${context.riskFactors.join(', ')}

Provide a concise analysis and specific recommendation for this at-risk student. Focus on actionable steps the teacher can take.

Format as JSON:
{
  "description": "Brief description of the issue (max 100 words)",
  "recommendation": "Specific actionable recommendation (max 80 words)",
  "confidence": 0.85
}`;

      case 'weakness_hotspot':
        return `${basePrompt}

Weakness Area: ${context.hotspot.area}
Students Affected: ${context.affectedStudents}
Common Errors: ${context.hotspot.common_errors.join(', ')}

Analyze this class-wide weakness and provide targeted teaching recommendations.

Format as JSON:
{
  "description": "Analysis of the weakness pattern (max 100 words)",
  "recommendation": "Teaching strategy recommendation (max 80 words)",
  "confidence": 0.80
}`;

      default:
        return `${basePrompt}Analyze the provided context and give educational insights. Format as JSON with description, recommendation, and confidence fields.`;
    }
  }

  // =====================================================
  // DATA ANALYSIS HELPERS
  // =====================================================

  private async gatherTeacherAnalyticsData(teacherId: string): Promise<StudentAnalyticsData[]> {
    // This would gather real data from your database
    // For now, returning mock data structure
    return [];
  }

  private calculateRiskFactors(student: StudentAnalyticsData): { riskScore: number; factors: string[]; primaryWeakness: string } {
    const factors: string[] = [];
    let riskScore = 0;

    // Analyze performance metrics
    if (student.recent_performance.average_score < 60) {
      factors.push('Low average score');
      riskScore += 0.3;
    }

    if (student.recent_performance.average_accuracy < 70) {
      factors.push('Low accuracy rate');
      riskScore += 0.2;
    }

    if (student.engagement_metrics.login_frequency < 3) {
      factors.push('Infrequent logins');
      riskScore += 0.2;
    }

    if (student.engagement_metrics.streak_current === 0) {
      factors.push('No current learning streak');
      riskScore += 0.1;
    }

    // Determine primary weakness
    const skillScores = Object.entries(student.skill_breakdown);
    const lowestSkill = skillScores.reduce((min, [skill, score]) =>
      score < min.score ? { skill, score } : min,
      { skill: 'general', score: 100 }
    );

    return {
      riskScore: Math.min(riskScore, 1.0),
      factors,
      primaryWeakness: lowestSkill.skill
    };
  }

  private identifyWeaknessHotspots(data: StudentAnalyticsData[]): WeaknessHotspot[] {
    // Analyze common weaknesses across students
    const hotspots: WeaknessHotspot[] = [];

    // This would implement actual hotspot detection logic
    // For now, returning empty array

    return hotspots;
  }

  private async predictStudentPerformance(student: StudentAnalyticsData): Promise<{ probability: number; factors: string[] }> {
    // Implement performance prediction logic
    return {
      probability: 0.7, // Mock value
      factors: ['Recent performance trend', 'Engagement level']
    };
  }

  private calculateEngagementScore(student: StudentAnalyticsData): number {
    const loginScore = Math.min(student.engagement_metrics.login_frequency / 7, 1);
    const streakScore = Math.min(student.engagement_metrics.streak_current / 10, 1);
    const sessionScore = Math.min(student.engagement_metrics.session_duration / 30, 1);

    return (loginScore + streakScore + sessionScore) / 3;
  }

  private analyzeMasteryPatterns(data: StudentAnalyticsData[]): { opportunities: string[] } {
    // Analyze mastery patterns and identify optimization opportunities
    return {
      opportunities: [] // Mock implementation
    };
  }

  private async storeInsights(insights: AIInsight[]): Promise<void> {
    if (insights.length === 0) return;

    try {
      const { error } = await this.supabase
        .from('ai_insights')
        .insert(insights);

      if (error) {
        console.error('Error storing insights:', error);
      }
    } catch (error) {
      console.error('Error storing insights:', error);
    }
  }

  // =====================================================
  // PUBLIC METHODS FOR DASHBOARD
  // =====================================================

  async getActiveInsights(teacherId: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await this.supabase
        .from('ai_insights')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('status', 'active')
        .order('priority', { ascending: false })
        .order('generated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active insights:', error);
      return [];
    }
  }

  async acknowledgeInsight(insightId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_insights')
        .update({
          status: 'acknowledged',
          updated_at: new Date().toISOString()
        })
        .eq('id', insightId);

      if (error) throw error;
    } catch (error) {
      console.error('Error acknowledging insight:', error);
    }
  }

  async dismissInsight(insightId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_insights')
        .update({
          status: 'dismissed',
          updated_at: new Date().toISOString()
        })
        .eq('id', insightId);

      if (error) throw error;
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  }

  async recordAction(insightId: string, action: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_insights')
        .update({
          status: 'resolved',
          action_taken: action,
          action_taken_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', insightId);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording action:', error);
    }
  }

  /**
   * Generate insights from real student data
   */
  async generateInsightsFromData(teacherId: string, studentData: any[], classAnalytics: any[]): Promise<AIInsight[]> {
    try {
      const insights: AIInsight[] = [];

      // Analyze at-risk students
      const atRiskStudents = studentData.filter(student => student.is_at_risk);

      for (const student of atRiskStudents.slice(0, 3)) { // Limit to top 3 most critical
        const riskScore = student.risk_factors.length;
        const priority = riskScore >= 3 ? 'urgent' : riskScore >= 2 ? 'high' : 'medium';

        const insight: AIInsight = {
          teacher_id: teacherId,
          insight_type: 'at_risk_student',
          priority: priority as any,
          status: 'active',
          title: `${student.student_name} needs attention`,
          description: `Performance concerns: ${student.risk_factors.join(', ')}. Last active: ${new Date(student.last_active).toLocaleDateString()}`,
          recommendation: `Consider one-on-one support or targeted assignments focusing on ${student.risk_factors[0]?.toLowerCase()}`,
          confidence_score: Math.min(0.95, 0.7 + (riskScore * 0.1)),
          student_id: student.student_id,
          generated_at: new Date(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        };

        insights.push(insight);
      }

      // Analyze class-level trends
      for (const classData of classAnalytics) {
        if (classData.at_risk_students > classData.total_students * 0.3) {
          const insight: AIInsight = {
            teacher_id: teacherId,
            insight_type: 'engagement_alert',
            priority: 'high',
            status: 'active',
            title: `${classData.class_name} has high risk student count`,
            description: `${classData.at_risk_students} out of ${classData.total_students} students are at risk. Common struggles: ${classData.common_struggles.join(', ')}`,
            recommendation: `Review class-wide teaching strategy and consider additional support materials`,
            confidence_score: 0.85,
            class_id: classData.class_id,
            generated_at: new Date(),
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
          };

          insights.push(insight);
        }
      }

      // Store insights in database
      if (insights.length > 0) {
        const { error } = await this.supabase
          .from('ai_insights')
          .insert(insights.map(insight => ({
            teacher_id: insight.teacher_id,
            insight_type: insight.insight_type,
            priority: insight.priority,
            status: insight.status,
            title: insight.title,
            description: insight.description,
            recommendation: insight.recommendation,
            confidence_score: insight.confidence_score,
            student_id: insight.student_id,
            class_id: insight.class_id,
            generated_at: insight.generated_at.toISOString(),
            expires_at: insight.expires_at?.toISOString()
          })));

        if (error) {
          console.error('Error storing insights:', error);
        }
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights from data:', error);
      return [];
    }
  }
}
