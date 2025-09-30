import OpenAI from 'openai';
import { SupabaseClient } from '@supabase/supabase-js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
  last_active?: string;
  total_sessions?: number;
  average_accuracy?: number;
  is_at_risk?: boolean;
  risk_factors?: string[];
  game_sessions?: any[];
  word_performance?: any[];
  assessment_skills?: any[];
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

        max_completion_tokens: 500
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
    try {
      console.time('⏱️ [AI INSIGHTS] gatherTeacherAnalyticsData');

      // ✅ USE THE OPTIMIZED SimpleStudentDataService INSTEAD!
      // The old code was querying a non-existent 'students' table with slow nested JOINs
      const { SimpleStudentDataService } = await import('./studentDataService');
      const studentDataService = new SimpleStudentDataService();

      const studentData = await studentDataService.getStudentAnalyticsData(teacherId);

      console.timeEnd('⏱️ [AI INSIGHTS] gatherTeacherAnalyticsData');
      console.log(`✅ [AI INSIGHTS] Loaded ${studentData.length} students for analysis`);

      // Transform to StudentAnalyticsData format expected by insight generators
      return studentData.map(student => ({
        student_id: student.student_id,
        student_name: student.student_name,
        class_id: student.class_id,
        class_name: student.class_name,
        average_score: student.average_score,
        average_accuracy: student.average_accuracy,
        total_time_spent: student.total_time_spent,
        assignments_completed: student.assignments_completed,
        assignments_total: student.assignments_total,
        last_active: student.last_active,
        is_at_risk: student.is_at_risk,
        risk_factors: student.risk_factors,
        recent_sessions: student.recent_sessions || [],
        vocabulary_stats: student.vocabulary_stats || {
          words_attempted: 0,
          words_mastered: 0,
          retention_rate: 0,
          struggling_words: []
        },
        skill_breakdown: {}, // Would need to be calculated from sessions
        engagement_metrics: {
          login_frequency: student.login_frequency || 0,
          session_duration_avg: student.session_duration_avg || 0,
          current_streak: student.current_streak || 0
        }
      }));
    } catch (error) {
      console.error('❌ [AI INSIGHTS] Error gathering teacher analytics data:', error);
      return [];
    }
  }

  // DEPRECATED: Old method that queried non-existent 'students' table
  // Keeping for reference but should not be used
  private async gatherTeacherAnalyticsData_OLD_SLOW(teacherId: string): Promise<StudentAnalyticsData[]> {
    try {
      // Get all classes for this teacher
      const { data: classes } = await this.supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', teacherId);

      if (!classes || classes.length === 0) {
        return [];
      }

      const classIds = classes.map(c => c.id);

      // ❌ THIS TABLE DOESN'T EXIST! That's why it was taking 9 seconds!
      const { data: students } = await this.supabase
        .from('students')
        .select(`
          id,
          first_name,
          last_name,
          class_id,
          created_at,
          last_active_timestamp,
          total_sessions_weekly,
          average_accuracy_weekly,
          is_at_risk,
          risk_factors,
          enhanced_game_sessions (
            id,
            game_id,
            session_start,
            session_end,
            total_score,
            accuracy_percentage,
            xp_earned,
            bonus_xp,
            xp_multiplier
          ),
          word_performance_logs (
            id,
            word_id,
            is_correct,
            response_time_ms,
            error_type,
            grammar_concept,
            difficulty_level,
            created_at
          ),
          assessment_skill_breakdown (
            id,
            assessment_type,
            language,
            listening_score,
            reading_score,
            writing_score,
            speaking_score,
            vocabulary_comprehension,
            grammar_accuracy,
            pronunciation_accuracy,
            fluency_score,
            text_comprehension,
            inference_ability,
            structural_coherence,
            total_questions,
            correct_answers,
            completion_time_seconds,
            skill_data,
            created_at
          )
        `)
        .in('class_id', classIds);

      if (!students) {
        return [];
      }

      // ❌ OLD SLOW CODE - Transform the data from non-existent 'students' table
      return students.map(student => {
        const gameSessions = student.enhanced_game_sessions || [];
        const wordPerformance = student.word_performance_logs || [];
        const assessmentSkills = student.assessment_skill_breakdown || [];

        const recentSessions = gameSessions.slice(-10);
        const totalScore = recentSessions.reduce((sum, session) => sum + (session.total_score || 0), 0);
        const avgScore = recentSessions.length > 0 ? totalScore / recentSessions.length : 0;
        const avgAccuracy = recentSessions.length > 0 ?
          recentSessions.reduce((sum, session) => sum + (session.accuracy_percentage || 0), 0) / recentSessions.length : 0;

        const skillBreakdown: { [skill: string]: number } = {};
        if (assessmentSkills.length > 0) {
          const latestSkills = assessmentSkills.slice(-5);
          skillBreakdown.listening = latestSkills.reduce((sum, skill) => sum + (skill.listening_score || 0), 0) / latestSkills.length;
          skillBreakdown.reading = latestSkills.reduce((sum, skill) => sum + (skill.reading_score || 0), 0) / latestSkills.length;
          skillBreakdown.writing = latestSkills.reduce((sum, skill) => sum + (skill.writing_score || 0), 0) / latestSkills.length;
          skillBreakdown.speaking = latestSkills.reduce((sum, skill) => sum + (skill.speaking_score || 0), 0) / latestSkills.length;
          skillBreakdown.vocabulary = latestSkills.reduce((sum, skill) => sum + (skill.vocabulary_comprehension || 0), 0) / latestSkills.length;
          skillBreakdown.grammar = latestSkills.reduce((sum, skill) => sum + (skill.grammar_accuracy || 0), 0) / latestSkills.length;
        }

        const correctWords = wordPerformance.filter(w => w.is_correct).length;
        const totalWords = wordPerformance.length;
        const retentionRate = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;
        const difficultWords = wordPerformance.filter(w => !w.is_correct).map(w => w.word_id).slice(0, 10);

        return {
          student_id: student.id,
          student_name: `${student.first_name} ${student.last_name}`,
          class_id: student.class_id,
          last_active: student.last_active_timestamp,
          total_sessions: student.total_sessions_weekly || 0,
          average_accuracy: student.average_accuracy_weekly || 0,
          is_at_risk: student.is_at_risk || false,
          risk_factors: student.risk_factors || [],
          game_sessions: gameSessions,
          word_performance: wordPerformance,
          assessment_skills: assessmentSkills,
          recent_performance: {
            assignments_completed: gameSessions.length,
            average_score: avgScore,
            average_accuracy: avgAccuracy,
            time_spent: recentSessions.reduce((sum, session) => {
              const start = new Date(session.session_start);
              const end = new Date(session.session_end);
              return sum + (end.getTime() - start.getTime()) / 1000;
            }, 0),
            last_active: student.last_active_timestamp ? new Date(student.last_active_timestamp) : new Date()
          },
          skill_breakdown: skillBreakdown,
          vocabulary_performance: {
            words_attempted: totalWords,
            words_mastered: correctWords,
            retention_rate: retentionRate,
            difficult_words: difficultWords
          },
          engagement_metrics: {
            login_frequency: student.total_sessions_weekly || 0,
            session_duration: recentSessions.length > 0 ?
              recentSessions.reduce((sum, session) => {
                const start = new Date(session.session_start);
                const end = new Date(session.session_end);
                return sum + (end.getTime() - start.getTime()) / 1000;
              }, 0) / recentSessions.length : 0,
            streak_current: 0,
            motivation_indicators: student.is_at_risk ? ['at_risk'] : ['engaged']
          }
        };
      });
    } catch (error) {
      console.error('❌ [OLD METHOD] Error gathering teacher analytics data:', error);
      return [];
    }
  }

  private calculateRiskFactors(student: any): { riskScore: number; factors: string[]; primaryWeakness: string } {
    const factors: string[] = [];
    let riskScore = 0;

    // Analyze performance metrics using actual data structure
    const accuracy = student.average_accuracy || 0;
    const totalSessions = student.total_sessions || 0;
    const avgDuration = student.average_session_duration || 0;
    const totalXp = student.total_xp || 0;

    // Check accuracy (main performance indicator)
    if (accuracy < 60) {
      factors.push('Low accuracy rate (below 60%)');
      riskScore += 0.4;
    } else if (accuracy < 70) {
      factors.push('Moderate accuracy concerns (below 70%)');
      riskScore += 0.2;
    }

    // Check engagement based on session count and duration
    if (totalSessions < 5) {
      factors.push('Low session count');
      riskScore += 0.3;
    }

    if (avgDuration < 120) { // Less than 2 minutes average
      factors.push('Very short session duration');
      riskScore += 0.2;
    }

    // Check XP earning rate (indicator of progress)
    const xpPerSession = totalSessions > 0 ? totalXp / totalSessions : 0;
    if (xpPerSession < 50) {
      factors.push('Low XP earning rate');
      riskScore += 0.2;
    }

    // Check recent activity pattern
    const lastActive = student.last_active ? new Date(student.last_active) : null;
    if (lastActive) {
      const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActive > 7) {
        factors.push('Inactive for over a week');
        riskScore += 0.3;
      } else if (daysSinceActive > 3) {
        factors.push('Inactive for several days');
        riskScore += 0.1;
      }
    }

    // Determine primary weakness based on available data
    let primaryWeakness = 'general';
    if (accuracy < 60) {
      primaryWeakness = 'accuracy';
    } else if (avgDuration < 120) {
      primaryWeakness = 'engagement';
    } else if (totalSessions < 5) {
      primaryWeakness = 'consistency';
    }

    return {
      riskScore: Math.min(riskScore, 1.0),
      factors,
      primaryWeakness
    };
  }

  private identifyWeaknessHotspots(data: StudentAnalyticsData[]): WeaknessHotspot[] {
    const hotspots: WeaknessHotspot[] = [];

    if (data.length === 0) return hotspots;

    // Analyze skill performance across all students
    const skillThresholds = {
      listening: 70,
      reading: 70,
      writing: 65,
      speaking: 65,
      vocabulary: 75,
      grammar: 70
    };

    // Check each skill area for widespread weakness
    Object.entries(skillThresholds).forEach(([skill, threshold]) => {
      const studentsWithSkillData = data.filter(student =>
        student.skill_breakdown && student.skill_breakdown[skill] !== undefined
      );

      if (studentsWithSkillData.length === 0) return;

      const strugglingStudents = studentsWithSkillData.filter(student =>
        student.skill_breakdown[skill] < threshold
      );

      const affectedPercentage = (strugglingStudents.length / studentsWithSkillData.length) * 100;

      // If more than 40% of students are struggling with this skill
      if (affectedPercentage > 40) {
        const averageScore = studentsWithSkillData.reduce((sum, student) =>
          sum + student.skill_breakdown[skill], 0) / studentsWithSkillData.length;

        const severityScore = Math.max(0, (threshold - averageScore) / threshold);

        // Analyze common errors from assessment skill data
        const commonErrors: string[] = [];
        strugglingStudents.forEach(student => {
          if (student.assessment_skills) {
            student.assessment_skills.forEach((assessment: any) => {
              if (assessment.skill_data && assessment.skill_data[`${skill}_metrics`]) {
                // Extract specific error patterns based on skill type
                const metrics = assessment.skill_data[`${skill}_metrics`];
                if (skill === 'listening' && metrics.audio_comprehension_accuracy < threshold) {
                  commonErrors.push('Audio comprehension difficulties');
                }
                if (skill === 'reading' && metrics.text_comprehension_accuracy < threshold) {
                  commonErrors.push('Text comprehension challenges');
                }
                if (skill === 'writing' && metrics.grammar_accuracy < threshold) {
                  commonErrors.push('Grammar accuracy issues');
                }
                if (skill === 'speaking' && metrics.pronunciation_accuracy < threshold) {
                  commonErrors.push('Pronunciation difficulties');
                }
              }
            });
          }
        });

        hotspots.push({
          area: skill,
          type: ['vocabulary', 'grammar'].includes(skill) ? skill as 'vocabulary' | 'grammar' : 'skill',
          affected_students: strugglingStudents.length,
          severity_score: severityScore,
          common_errors: [...new Set(commonErrors)].slice(0, 5), // Remove duplicates, limit to 5
          recommended_actions: this.getRecommendedActions(skill, severityScore)
        });
      }
    });

    return hotspots.sort((a, b) => b.severity_score - a.severity_score);
  }

  private getRecommendedActions(skill: string, severityScore: number): string[] {
    const baseActions: { [key: string]: string[] } = {
      listening: [
        'Provide additional audio comprehension exercises',
        'Use varied audio speeds and accents',
        'Implement listening strategy training'
      ],
      reading: [
        'Focus on reading comprehension strategies',
        'Provide texts at appropriate difficulty levels',
        'Practice inference and analysis skills'
      ],
      writing: [
        'Review grammar fundamentals',
        'Practice structured writing exercises',
        'Provide writing templates and frameworks'
      ],
      speaking: [
        'Increase speaking practice opportunities',
        'Focus on pronunciation drills',
        'Build confidence through guided conversations'
      ],
      vocabulary: [
        'Implement systematic vocabulary building',
        'Use contextual learning approaches',
        'Increase exposure to target vocabulary'
      ],
      grammar: [
        'Review specific grammar rules',
        'Provide targeted grammar exercises',
        'Use communicative grammar practice'
      ]
    };

    const actions = baseActions[skill] || ['Provide additional practice and support'];

    if (severityScore > 0.7) {
      actions.unshift('Consider intensive intervention program');
    }

    return actions;
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

      // First, check for existing active insights to avoid duplicates
      const { data: existingInsights } = await this.supabase
        .from('ai_insights')
        .select('student_id, class_id, insight_type, title')
        .eq('teacher_id', teacherId)
        .eq('status', 'active')
        .gte('generated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

      const existingInsightKeys = new Set(
        (existingInsights || []).map(insight =>
          `${insight.insight_type}-${insight.student_id || insight.class_id}-${insight.title}`
        )
      );

      // Analyze at-risk students
      const atRiskStudents = studentData.filter(student => student.is_at_risk);

      for (const student of atRiskStudents.slice(0, 3)) { // Limit to top 3 most critical
        const riskScore = student.risk_factors.length;
        const priority = riskScore >= 3 ? 'urgent' : riskScore >= 2 ? 'high' : 'medium';
        const title = `${student.student_name} needs attention`;
        const insightKey = `at_risk_student-${student.student_id}-${title}`;

        // Skip if we already have this insight
        if (existingInsightKeys.has(insightKey)) {
          continue;
        }

        const insight: AIInsight = {
          teacher_id: teacherId,
          insight_type: 'at_risk_student',
          priority: priority as any,
          status: 'active',
          title,
          description: `Performance concerns: ${student.risk_factors.join(', ')}. Last active: ${new Date(student.last_active).toLocaleDateString()}`,
          recommendation: `Consider one-on-one support or targeted assignments focusing on ${student.risk_factors[0]?.toLowerCase()}`,
          confidence_score: Math.min(0.95, 0.70 + (riskScore * 0.05)), // Store as decimal (0.70-0.95)
          student_id: student.student_id,
          generated_at: new Date(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        };

        insights.push(insight);
      }

      // Analyze class-level trends (limit to 1 class insight to avoid overwhelming)
      const classWithMostRisk = classAnalytics
        .filter(classData => classData.at_risk_students > classData.total_students * 0.3)
        .sort((a, b) => (b.at_risk_students / b.total_students) - (a.at_risk_students / a.total_students))[0];

      if (classWithMostRisk) {
        const title = `${classWithMostRisk.class_name} has high risk student count`;
        const insightKey = `engagement_alert-${classWithMostRisk.class_id}-${title}`;

        // Skip if we already have this insight
        if (!existingInsightKeys.has(insightKey)) {
          const insight: AIInsight = {
            teacher_id: teacherId,
            insight_type: 'engagement_alert',
            priority: 'high',
            status: 'active',
            title,
            description: `${classWithMostRisk.at_risk_students} out of ${classWithMostRisk.total_students} students are at risk. Common struggles: ${classWithMostRisk.common_struggles.join(', ')}`,
            recommendation: `Review class-wide teaching strategy and consider additional support materials`,
            confidence_score: 0.85, // Store as decimal
            class_id: classWithMostRisk.class_id,
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
