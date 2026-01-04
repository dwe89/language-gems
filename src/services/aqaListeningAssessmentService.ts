import { createClient } from '@/utils/supabase/client';
import { assessmentSkillTrackingService, type ListeningSkillMetrics } from './assessmentSkillTrackingService';
import { calculateGCSEGrade } from '@/lib/gcseGrading';

export interface AQAListeningAssessmentDefinition {
  id: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  is_active: boolean;
}

export interface AQAListeningQuestionDefinition {
  id: string;
  assessment_id: string;
  question_number: number;
  sub_question_number?: string;
  question_type: string;
  title: string;
  instructions: string;
  audio_text?: string;
  audio_url?: string;
  audio_transcript?: string;
  question_data: any;
  marks: number;
  theme: string;
  topic: string;
  tts_config: any;
  difficulty_rating: number;
  sentence_audio_urls?: Record<string, string>; // For dictation: individual sentence audio URLs
}

export interface AQAListeningQuestionResponse {
  result_id: string;
  question_id: string;
  question_number: number;
  sub_question_number?: string;
  student_answer: string;
  is_correct: boolean;
  points_awarded: number;
  time_spent_seconds: number;
  audio_plays_used: number;
  question_type: string;
  theme: string;
  topic: string;
  marks_possible: number;
}

export class AQAListeningAssessmentService {
  public supabase = createClient();

  // Get all available assessments (for listing)
  async getAllAssessments(): Promise<AQAListeningAssessmentDefinition[]> {
    const { data, error } = await this.supabase
      .from('aqa_listening_assessments')
      .select('*')
      .eq('is_active', true)
      .order('level')
      .order('language')
      .order('identifier');

    if (error) {
      console.error('Error fetching all assessments:', error);
      return [];
    }

    return data || [];
  }

  // Get assessment definition by level, language, and identifier
  async getAssessmentByLevel(level: 'foundation' | 'higher', language: string = 'es', identifier: string = 'paper-1'): Promise<AQAListeningAssessmentDefinition | null> {
    const { data, error } = await this.supabase
      .from('aqa_listening_assessments')
      .select('*')
      .eq('level', level)
      .eq('language', language)
      .eq('identifier', identifier)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching assessment:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.error('No assessment found for level:', level, 'language:', language, 'identifier:', identifier);
      return null;
    }

    return data[0];
  }

  // Get all assessments for a level and language (for listing multiple papers)
  async getAssessmentsByLevel(level: 'foundation' | 'higher', language: string = 'es'): Promise<AQAListeningAssessmentDefinition[]> {
    console.log(`🔍 [AQA LISTENING SERVICE] Fetching assessments for Level: ${level}, Language: ${language}`);

    const { data, error } = await this.supabase
      .from('aqa_listening_assessments')
      .select('*')
      .eq('level', level)
      .eq('language', language)
      .eq('is_active', true)
      .order('identifier');

    if (error) {
      console.error('❌ [AQA LISTENING SERVICE] Error fetching assessments:', error);
      return [];
    }

    console.log(`✅ [AQA LISTENING SERVICE] Found ${data?.length || 0} assessments:`, data);
    return data || [];
  }

  // Get all questions for an assessment
  async getAssessmentQuestions(assessmentId: string): Promise<AQAListeningQuestionDefinition[]> {
    const { data, error } = await this.supabase
      .from('aqa_listening_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_number', { ascending: true })
      .order('sub_question_number', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return data || [];
  }

  // Create or update assessment definition
  async upsertAssessment(assessment: Partial<AQAListeningAssessmentDefinition>): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('aqa_listening_assessments')
      .upsert(assessment)
      .select('id')
      .single();

    if (error) {
      console.error('Error upserting assessment:', error);
      return null;
    }

    return data.id;
  }

  // Create or update questions for an assessment
  async upsertQuestions(questions: Partial<AQAListeningQuestionDefinition>[]): Promise<boolean> {
    const { error } = await this.supabase
      .from('aqa_listening_questions')
      .upsert(questions);

    if (error) {
      console.error('Error upserting questions:', error);
      return false;
    }

    return true;
  }

  // Start a new assessment attempt
  async startAssessment(
    studentId: string,
    assessmentId: string,
    assignmentId?: string
  ): Promise<string | null> {
    // First, check if there's an existing incomplete attempt for this assignment
    if (assignmentId) {
      const { data: existingIncomplete } = await this.supabase
        .from('aqa_listening_results')
        .select('id, attempt_number')
        .eq('student_id', studentId)
        .eq('assessment_id', assessmentId)
        .eq('assignment_id', assignmentId)
        .eq('status', 'incomplete')
        .maybeSingle();

      if (existingIncomplete) {
        console.log('Resuming existing incomplete listening assessment attempt:', existingIncomplete.id);
        return existingIncomplete.id;
      }
    }

    // Get the next attempt number for this student/assessment combination
    const { data: existingAttempts } = await this.supabase
      .from('aqa_listening_results')
      .select('attempt_number')
      .eq('student_id', studentId)
      .eq('assessment_id', assessmentId)
      .order('attempt_number', { ascending: false })
      .limit(1);

    const nextAttemptNumber = existingAttempts && existingAttempts.length > 0
      ? existingAttempts[0].attempt_number + 1
      : 1;

    const result = {
      student_id: studentId,
      assessment_id: assessmentId,
      assignment_id: assignmentId,
      attempt_number: nextAttemptNumber,
      start_time: new Date().toISOString(),
      total_time_seconds: 0,
      raw_score: 0,
      total_possible_score: 40,
      percentage_score: 0,
      status: 'incomplete' as const,
      responses: [],
      audio_play_counts: {},
      performance_by_question_type: {},
      performance_by_theme: {},
      performance_by_topic: {}
    };

    const { data, error } = await this.supabase
      .from('aqa_listening_results')
      .insert(result)
      .select('id')
      .single();

    if (error) {
      console.error('Error starting assessment:', error);
      return null;
    }

    return data.id;
  }

  // Submit completed assessment
  async submitAssessment(
    resultId: string,
    responses: AQAListeningQuestionResponse[],
    totalTimeSeconds: number,
    audioPlayCounts: Record<string, number> = {}
  ): Promise<boolean> {
    const completionTime = new Date().toISOString();

    // Calculate scores and performance summaries
    const rawScore = responses.reduce((sum, r) => sum + r.points_awarded, 0);
    const totalPossible = responses.reduce((sum, r) => sum + r.marks_possible, 0);
    const percentageScore = totalPossible > 0 ? (rawScore / totalPossible) * 100 : 0;

    // Fetch metadata required for GCSE grading and later tracking
    const { data: resultMetadata, error: resultMetadataError } = await this.supabase
      .from('aqa_listening_results')
      .select('student_id, assessment_id')
      .eq('id', resultId)
      .single();

    if (resultMetadataError) {
      console.error('Error fetching listening result metadata:', resultMetadataError);
    }

    let gcseGrade: number | null = 1; // Default grade
    let assessmentLanguage: string | undefined;

    if (resultMetadata?.assessment_id) {
      const { data: assessmentData, error: assessmentError } = await this.supabase
        .from('aqa_listening_assessments')
        .select('level, language')
        .eq('id', resultMetadata.assessment_id)
        .single();

      if (assessmentError) {
        console.error('Error fetching listening assessment metadata:', assessmentError);
      } else if (assessmentData) {
        const tier = assessmentData.level || 'higher';
        gcseGrade = percentageScore !== null ? calculateGCSEGrade(percentageScore, tier) : null;
        assessmentLanguage = assessmentData.language || undefined;
      }
    }

    // Calculate performance by question type, theme, and topic
    const performanceByType = this.calculatePerformanceByCategory(responses, 'question_type');
    const performanceByTheme = this.calculatePerformanceByCategory(responses, 'theme');
    const performanceByTopic = this.calculatePerformanceByCategory(responses, 'topic');

    // Calculate listening skill metrics for skill tracking
    const totalAudioPlays = Object.values(audioPlayCounts).reduce((sum, count) => sum + count, 0);
    const averageResponseTime = responses.length > 0 ? totalTimeSeconds / responses.length : 0;
    const correctAnswers = responses.filter(r => r.is_correct).length;

    const listeningMetrics: ListeningSkillMetrics = {
      audioComprehensionAccuracy: percentageScore,
      responseTimePerEvidence: averageResponseTime,
      listeningSkillProgression: percentageScore, // Could be enhanced with historical comparison
      audioPlaybackCount: totalAudioPlays,
      comprehensionSpeed: totalTimeSeconds > 0 ? (responses.length / totalTimeSeconds) * 60 : 0, // questions per minute
      contextualUnderstanding: percentageScore // Could be enhanced with context-specific analysis
    };

    // Update the main result record
    const { error: resultError } = await this.supabase
      .from('aqa_listening_results')
      .update({
        completion_time: completionTime,
        total_time_seconds: totalTimeSeconds,
        raw_score: rawScore,
        total_possible_score: totalPossible,
        percentage_score: percentageScore,
        gcse_grade: gcseGrade,
        status: 'completed',
        responses: responses,
        audio_play_counts: audioPlayCounts,
        performance_by_question_type: performanceByType,
        performance_by_theme: performanceByTheme,
        performance_by_topic: performanceByTopic,
        updated_at: new Date().toISOString()
      })
      .eq('id', resultId);

    if (resultError) {
      console.error('Error updating result:', resultError);
      return false;
    }

    // Insert detailed question responses
    const questionResponses = responses.map(response => ({
      ...response,
      result_id: resultId
    }));

    const { error: responsesError } = await this.supabase
      .from('aqa_listening_question_responses')
      .insert(questionResponses);

    if (responsesError) {
      console.error('Error inserting question responses:', responsesError);
      return false;
    }

    if (resultMetadata?.student_id && resultMetadata.assessment_id) {
      let languageForTracking = assessmentLanguage;

      if (!languageForTracking) {
        const { data: assessmentData } = await this.supabase
          .from('aqa_listening_assessments')
          .select('language')
          .eq('id', resultMetadata.assessment_id)
          .single();

        languageForTracking = assessmentData?.language || undefined;
      }

      if (languageForTracking) {
        await assessmentSkillTrackingService.trackListeningSkills(
          resultMetadata.student_id,
          resultMetadata.assessment_id,
          'aqa_listening',
          languageForTracking,
          listeningMetrics,
          responses.length,
          correctAnswers,
          totalTimeSeconds
        );
      }
    }

    return true;
  }

  // Helper method to calculate performance by category
  private calculatePerformanceByCategory(
    responses: AQAListeningQuestionResponse[],
    category: 'question_type' | 'theme' | 'topic'
  ): Record<string, { correct: number; total: number; percentage: number }> {
    const performance: Record<string, { correct: number; total: number }> = {};

    responses.forEach(response => {
      const key = response[category];
      if (!performance[key]) {
        performance[key] = { correct: 0, total: 0 };
      }
      performance[key].total++;
      if (response.is_correct) {
        performance[key].correct++;
      }
    });

    // Calculate percentages
    const result: Record<string, { correct: number; total: number; percentage: number }> = {};
    Object.entries(performance).forEach(([key, stats]) => {
      result[key] = {
        ...stats,
        percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
      };
    });

    return result;
  }

  // Get student results for an assessment
  async getStudentResults(studentId: string, assessmentId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('aqa_listening_results')
      .select('*')
      .eq('student_id', studentId)
      .eq('assessment_id', assessmentId)
      .order('attempt_number', { ascending: false });

    if (error) {
      console.error('Error fetching student results:', error);
      return [];
    }

    return data || [];
  }
}
