import { createClient } from '@supabase/supabase-js';
import { StudentAggregatedMetrics } from './realTimeAnalyticsService';

export interface PredictionResult {
  student_id: string;
  prediction_type: 'at_risk' | 'improvement' | 'plateau' | 'excellence';
  confidence: number;
  predicted_outcome: string;
  risk_factors: string[];
  recommendations: string[];
  timeline_weeks: number;
  supporting_data: Record<string, any>;
}

export interface LearningTrend {
  metric: string;
  direction: 'improving' | 'declining' | 'stable';
  rate_of_change: number;
  confidence: number;
  data_points: number;
}

export interface RiskAssessment {
  overall_risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  primary_risk_factors: string[];
  intervention_urgency: 'immediate' | 'within_week' | 'within_month' | 'monitor';
  predicted_outcomes: {
    no_intervention: string;
    with_intervention: string;
  };
}

export class PerformancePredictionService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Generate performance predictions for all students in a class
   */
  async generateClassPredictions(classId: string, teacherId: string): Promise<PredictionResult[]> {
    try {
      // Get all students in the class with their analytics data
      const students = await this.getClassStudentsWithAnalytics(classId);
      
      const predictions: PredictionResult[] = [];
      
      for (const student of students) {
        const prediction = await this.generateStudentPrediction(student);
        predictions.push(prediction);
      }
      
      return predictions;
    } catch (error) {
      console.error('Error generating class predictions:', error);
      throw error;
    }
  }

  /**
   * Generate prediction for a specific student
   */
  async generateStudentPrediction(studentData: any): Promise<PredictionResult> {
    try {
      // Analyze learning trends
      const trends = await this.analyzeLearningTrends(studentData.id);
      
      // Assess risk factors
      const riskAssessment = await this.assessStudentRisk(studentData, trends);
      
      // Generate prediction based on trends and risk assessment
      const prediction = this.generatePredictionFromAnalysis(studentData, trends, riskAssessment);
      
      return prediction;
    } catch (error) {
      console.error(`Error generating prediction for student ${studentData.id}:`, error);
      throw error;
    }
  }

  /**
   * Analyze learning trends for a student
   */
  private async analyzeLearningTrends(studentId: string): Promise<LearningTrend[]> {
    // Get historical performance data (last 8 weeks)
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

    const { data: sessions, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('*')
      .eq('student_id', studentId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to get session data: ${error.message}`);
    }

    const { data: wordLogs, error: wordError } = await this.supabase
      .from('word_performance_logs')
      .select('*')
      .eq('student_id', studentId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (wordError) {
      throw new Error(`Failed to get word performance data: ${wordError.message}`);
    }

    const { data: assessments, error: assessmentError } = await this.supabase
      .from('assessment_skill_breakdown')
      .select('*')
      .eq('student_id', studentId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (assessmentError) {
      throw new Error(`Failed to get assessment data: ${assessmentError.message}`);
    }

    // Analyze trends in different metrics
    const trends: LearningTrend[] = [];

    // Accuracy trend
    const accuracyTrend = this.calculateTrend(
      sessions?.map(s => ({ date: s.created_at, value: s.accuracy_percentage || 0 })) || [],
      'accuracy'
    );
    trends.push(accuracyTrend);

    // Engagement trend (session frequency)
    const engagementTrend = this.calculateEngagementTrend(sessions || []);
    trends.push(engagementTrend);

    // XP earning trend
    const xpTrend = this.calculateTrend(
      sessions?.map(s => ({ date: s.created_at, value: s.xp_earned || 0 })) || [],
      'xp_earning'
    );
    trends.push(xpTrend);

    // Word mastery trend
    const wordMasteryTrend = this.calculateWordMasteryTrend(wordLogs || []);
    trends.push(wordMasteryTrend);

    // Assessment performance trend
    if (assessments && assessments.length > 0) {
      const assessmentTrend = this.calculateAssessmentTrend(assessments);
      trends.push(assessmentTrend);
    }

    return trends;
  }

  /**
   * Calculate trend for a metric over time
   */
  private calculateTrend(dataPoints: { date: string; value: number }[], metric: string): LearningTrend {
    if (dataPoints.length < 2) {
      return {
        metric,
        direction: 'stable',
        rate_of_change: 0,
        confidence: 0,
        data_points: dataPoints.length
      };
    }

    // Group by week and calculate weekly averages
    const weeklyData = this.groupByWeek(dataPoints);
    
    if (weeklyData.length < 2) {
      return {
        metric,
        direction: 'stable',
        rate_of_change: 0,
        confidence: 0.3,
        data_points: dataPoints.length
      };
    }

    // Calculate linear regression
    const regression = this.calculateLinearRegression(weeklyData);
    
    const direction = regression.slope > 0.05 ? 'improving' : 
                     regression.slope < -0.05 ? 'declining' : 'stable';
    
    const confidence = Math.min(regression.r_squared * (weeklyData.length / 8), 1);

    return {
      metric,
      direction,
      rate_of_change: regression.slope,
      confidence,
      data_points: dataPoints.length
    };
  }

  /**
   * Calculate engagement trend based on session frequency
   */
  private calculateEngagementTrend(sessions: any[]): LearningTrend {
    if (sessions.length === 0) {
      return {
        metric: 'engagement',
        direction: 'declining',
        rate_of_change: -1,
        confidence: 0.8,
        data_points: 0
      };
    }

    // Group sessions by week
    const weeklySessionCounts = this.groupSessionsByWeek(sessions);
    
    if (weeklySessionCounts.length < 2) {
      return {
        metric: 'engagement',
        direction: 'stable',
        rate_of_change: 0,
        confidence: 0.3,
        data_points: sessions.length
      };
    }

    const regression = this.calculateLinearRegression(weeklySessionCounts);
    
    const direction = regression.slope > 0.1 ? 'improving' : 
                     regression.slope < -0.1 ? 'declining' : 'stable';

    return {
      metric: 'engagement',
      direction,
      rate_of_change: regression.slope,
      confidence: Math.min(regression.r_squared * 0.8, 1),
      data_points: sessions.length
    };
  }

  /**
   * Calculate word mastery trend
   */
  private calculateWordMasteryTrend(wordLogs: any[]): LearningTrend {
    if (wordLogs.length === 0) {
      return {
        metric: 'word_mastery',
        direction: 'stable',
        rate_of_change: 0,
        confidence: 0,
        data_points: 0
      };
    }

    // Calculate weekly mastery rates
    const weeklyMastery = this.calculateWeeklyWordMastery(wordLogs);
    
    if (weeklyMastery.length < 2) {
      return {
        metric: 'word_mastery',
        direction: 'stable',
        rate_of_change: 0,
        confidence: 0.3,
        data_points: wordLogs.length
      };
    }

    const regression = this.calculateLinearRegression(weeklyMastery);
    
    const direction = regression.slope > 0.02 ? 'improving' : 
                     regression.slope < -0.02 ? 'declining' : 'stable';

    return {
      metric: 'word_mastery',
      direction,
      rate_of_change: regression.slope,
      confidence: Math.min(regression.r_squared * 0.9, 1),
      data_points: wordLogs.length
    };
  }

  /**
   * Calculate assessment performance trend
   */
  private calculateAssessmentTrend(assessments: any[]): LearningTrend {
    const overallScores = assessments.map(a => ({
      date: a.created_at,
      value: (a.listening_score + a.reading_score + a.writing_score + a.speaking_score) / 4
    }));

    return this.calculateTrend(overallScores, 'assessment_performance');
  }

  /**
   * Assess student risk factors
   */
  private async assessStudentRisk(studentData: any, trends: LearningTrend[]): Promise<RiskAssessment> {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Analyze trends for risk indicators
    trends.forEach(trend => {
      if (trend.direction === 'declining' && trend.confidence > 0.5) {
        riskFactors.push(`Declining ${trend.metric.replace('_', ' ')}`);
        riskScore += trend.confidence * 20;
      }
    });

    // Check engagement patterns
    const engagementTrend = trends.find(t => t.metric === 'engagement');
    if (engagementTrend?.direction === 'declining') {
      riskFactors.push('Decreasing engagement');
      riskScore += 25;
    }

    // Check recent activity
    const lastActivity = await this.getLastActivityDate(studentData.id);
    const daysSinceActivity = lastActivity ? 
      Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : 999;
    
    if (daysSinceActivity > 7) {
      riskFactors.push('Inactive for over a week');
      riskScore += 30;
    } else if (daysSinceActivity > 3) {
      riskFactors.push('Reduced recent activity');
      riskScore += 15;
    }

    // Check accuracy patterns
    const accuracyTrend = trends.find(t => t.metric === 'accuracy');
    if (accuracyTrend?.direction === 'declining' && accuracyTrend.confidence > 0.6) {
      riskFactors.push('Declining accuracy');
      riskScore += 20;
    }

    // Determine risk level
    const riskLevel = riskScore >= 70 ? 'critical' :
                     riskScore >= 50 ? 'high' :
                     riskScore >= 25 ? 'medium' : 'low';

    const interventionUrgency = riskLevel === 'critical' ? 'immediate' :
                               riskLevel === 'high' ? 'within_week' :
                               riskLevel === 'medium' ? 'within_month' : 'monitor';

    return {
      overall_risk_score: Math.min(riskScore, 100),
      risk_level: riskLevel,
      primary_risk_factors: riskFactors.slice(0, 3), // Top 3 risk factors
      intervention_urgency: interventionUrgency,
      predicted_outcomes: {
        no_intervention: this.generateNoInterventionPrediction(riskLevel, riskFactors),
        with_intervention: this.generateWithInterventionPrediction(riskLevel, riskFactors)
      }
    };
  }

  /**
   * Generate prediction from analysis
   */
  private generatePredictionFromAnalysis(
    studentData: any, 
    trends: LearningTrend[], 
    riskAssessment: RiskAssessment
  ): PredictionResult {
    // Determine prediction type
    let predictionType: PredictionResult['prediction_type'];
    
    if (riskAssessment.risk_level === 'high' || riskAssessment.risk_level === 'critical') {
      predictionType = 'at_risk';
    } else {
      const improvingTrends = trends.filter(t => t.direction === 'improving' && t.confidence > 0.5);
      const decliningTrends = trends.filter(t => t.direction === 'declining' && t.confidence > 0.5);
      
      if (improvingTrends.length > decliningTrends.length) {
        predictionType = 'improvement';
      } else if (decliningTrends.length > 0) {
        predictionType = 'plateau';
      } else {
        predictionType = 'excellence';
      }
    }

    // Calculate overall confidence
    const avgConfidence = trends.reduce((sum, t) => sum + t.confidence, 0) / trends.length;
    const confidence = Math.min(avgConfidence * 0.8 + (trends.length / 10) * 0.2, 1);

    // Generate recommendations
    const recommendations = this.generateRecommendations(predictionType, trends, riskAssessment);

    // Estimate timeline
    const timelineWeeks = this.estimateTimelineWeeks(predictionType, trends);

    return {
      student_id: studentData.id,
      prediction_type: predictionType,
      confidence,
      predicted_outcome: this.generatePredictedOutcome(predictionType, trends, riskAssessment),
      risk_factors: riskAssessment.primary_risk_factors,
      recommendations,
      timeline_weeks: timelineWeeks,
      supporting_data: {
        trends,
        risk_assessment: riskAssessment,
        data_quality: {
          sessions_analyzed: trends.find(t => t.metric === 'accuracy')?.data_points || 0,
          weeks_of_data: Math.min(8, trends.length)
        }
      }
    };
  }

  // Helper methods for calculations
  private groupByWeek(dataPoints: { date: string; value: number }[]): { week: number; value: number }[] {
    const weeklyData: { [week: number]: number[] } = {};
    
    dataPoints.forEach(point => {
      const date = new Date(point.date);
      const weekNumber = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
      
      if (!weeklyData[weekNumber]) {
        weeklyData[weekNumber] = [];
      }
      weeklyData[weekNumber].push(point.value);
    });

    return Object.entries(weeklyData).map(([week, values]) => ({
      week: parseInt(week),
      value: values.reduce((sum, v) => sum + v, 0) / values.length
    })).sort((a, b) => a.week - b.week);
  }

  private groupSessionsByWeek(sessions: any[]): { week: number; value: number }[] {
    const weeklyData: { [week: number]: number } = {};
    
    sessions.forEach(session => {
      const date = new Date(session.created_at);
      const weekNumber = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
      
      weeklyData[weekNumber] = (weeklyData[weekNumber] || 0) + 1;
    });

    return Object.entries(weeklyData).map(([week, count]) => ({
      week: parseInt(week),
      value: count
    })).sort((a, b) => a.week - b.week);
  }

  private calculateLinearRegression(data: { week: number; value: number }[]): { slope: number; r_squared: number } {
    if (data.length < 2) return { slope: 0, r_squared: 0 };

    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.week, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d) => sum + d.week * d.value, 0);
    const sumXX = data.reduce((sum, d) => sum + d.week * d.week, 0);
    const sumYY = data.reduce((sum, d) => sum + d.value * d.value, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const meanY = sumY / n;
    const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.value - meanY, 2), 0);
    const ssResidual = data.reduce((sum, d) => {
      const predicted = slope * d.week + intercept;
      return sum + Math.pow(d.value - predicted, 2);
    }, 0);

    const rSquared = ssTotal === 0 ? 0 : 1 - (ssResidual / ssTotal);

    return { slope, r_squared: Math.max(0, rSquared) };
  }

  private calculateWeeklyWordMastery(wordLogs: any[]): { week: number; value: number }[] {
    const weeklyData: { [week: number]: { correct: number; total: number } } = {};
    
    wordLogs.forEach(log => {
      const date = new Date(log.created_at);
      const weekNumber = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
      
      if (!weeklyData[weekNumber]) {
        weeklyData[weekNumber] = { correct: 0, total: 0 };
      }
      
      weeklyData[weekNumber].total += 1;
      if (log.is_correct) {
        weeklyData[weekNumber].correct += 1;
      }
    });

    return Object.entries(weeklyData).map(([week, data]) => ({
      week: parseInt(week),
      value: data.total > 0 ? data.correct / data.total : 0
    })).sort((a, b) => a.week - b.week);
  }

  private async getLastActivityDate(studentId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0].created_at;
  }

  private async getClassStudentsWithAnalytics(classId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('class_enrollments')
      .select(`
        student_id,
        auth.users!inner(id, email)
      `)
      .eq('class_id', classId)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to get class students: ${error.message}`);
    }

    return data?.map(enrollment => ({
      id: enrollment.student_id,
      email: enrollment.auth?.users?.email
    })) || [];
  }

  private generateNoInterventionPrediction(riskLevel: string, riskFactors: string[]): string {
    if (riskLevel === 'critical') {
      return 'Student likely to disengage completely within 2-3 weeks without immediate intervention';
    } else if (riskLevel === 'high') {
      return 'Performance likely to continue declining, potential for falling significantly behind peers';
    } else if (riskLevel === 'medium') {
      return 'Student may plateau or show slow decline without additional support';
    }
    return 'Student likely to maintain current performance level';
  }

  private generateWithInterventionPrediction(riskLevel: string, riskFactors: string[]): string {
    if (riskLevel === 'critical') {
      return 'With immediate targeted intervention, student can recover engagement and improve performance within 4-6 weeks';
    } else if (riskLevel === 'high') {
      return 'Targeted support can help student stabilize and begin improving within 3-4 weeks';
    } else if (riskLevel === 'medium') {
      return 'Additional practice and encouragement can help student achieve steady improvement';
    }
    return 'Student well-positioned for continued growth with regular support';
  }

  private generateRecommendations(
    predictionType: PredictionResult['prediction_type'], 
    trends: LearningTrend[], 
    riskAssessment: RiskAssessment
  ): string[] {
    const recommendations: string[] = [];

    if (predictionType === 'at_risk') {
      recommendations.push('Schedule immediate one-on-one check-in');
      recommendations.push('Reduce assignment difficulty temporarily');
      recommendations.push('Implement daily engagement tracking');
    }

    // Add trend-specific recommendations
    trends.forEach(trend => {
      if (trend.direction === 'declining' && trend.confidence > 0.5) {
        switch (trend.metric) {
          case 'accuracy':
            recommendations.push('Focus on foundational concepts review');
            break;
          case 'engagement':
            recommendations.push('Introduce gamification elements or rewards');
            break;
          case 'word_mastery':
            recommendations.push('Implement spaced repetition for vocabulary');
            break;
        }
      }
    });

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  private generatePredictedOutcome(
    predictionType: PredictionResult['prediction_type'], 
    trends: LearningTrend[], 
    riskAssessment: RiskAssessment
  ): string {
    switch (predictionType) {
      case 'at_risk':
        return `Student at ${riskAssessment.risk_level} risk of disengagement. ${riskAssessment.predicted_outcomes.no_intervention}`;
      case 'improvement':
        return 'Student showing positive trends and likely to continue improving with current trajectory';
      case 'plateau':
        return 'Student performance stabilizing but may benefit from new challenges or support';
      case 'excellence':
        return 'Student performing well and positioned for continued success';
      default:
        return 'Unable to determine clear prediction based on available data';
    }
  }

  private estimateTimelineWeeks(predictionType: PredictionResult['prediction_type'], trends: LearningTrend[]): number {
    switch (predictionType) {
      case 'at_risk':
        return 2; // Urgent intervention needed
      case 'improvement':
        return 6; // Expected improvement timeline
      case 'plateau':
        return 4; // Time to see change with intervention
      case 'excellence':
        return 8; // Continued growth timeline
      default:
        return 4;
    }
  }
}
