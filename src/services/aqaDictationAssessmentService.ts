import { createClient } from '@supabase/supabase-js';
import { assessmentSkillTrackingService, type ListeningSkillMetrics } from './assessmentSkillTrackingService';

// Types for dictation assessments
export interface AQADictationAssessmentDefinition {
  id: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AQADictationQuestion {
  id: string;
  assessment_id: string;
  question_number: number;
  sentence_text: string;
  audio_url_normal?: string;
  audio_url_very_slow?: string;
  marks: number;
  theme: string;
  topic: string;
  tts_config?: any;
  difficulty_rating: number;
  created_at: string;
  updated_at: string;
}

export interface AQADictationQuestionResponse {
  question_id: string;
  question_number: number;
  student_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points_awarded: number;
  time_spent_seconds: number;
  normal_audio_plays: number;
  very_slow_audio_plays: number;
  theme: string;
  topic: string;
  marks_possible: number;
}

export interface AQADictationResult {
  id: string;
  student_id: string;
  assessment_id: string;
  assignment_id?: string;
  attempt_number: number;
  start_time: string;
  completion_time?: string;
  total_time_seconds: number;
  raw_score: number;
  total_possible_score: number;
  percentage_score: number;
  status: 'completed' | 'incomplete' | 'abandoned';
  responses: AQADictationQuestionResponse[];
  audio_play_counts: Record<string, { normal: number; very_slow: number }>;
  performance_by_theme: Record<string, any>;
  performance_by_topic: Record<string, any>;
}

export class AQADictationAssessmentService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get all assessments by level and language
  async getAssessmentsByLevel(level: 'foundation' | 'higher', language: string = 'es'): Promise<AQADictationAssessmentDefinition[]> {
    const { data, error } = await this.supabase
      .from('aqa_dictation_assessments')
      .select('*')
      .eq('level', level)
      .eq('language', language)
      .eq('is_active', true)
      .order('identifier');

    if (error) {
      console.error('Error fetching dictation assessments:', error);
      return [];
    }

    return data || [];
  }

  // Get assessment definition by level, language, and identifier
  async getAssessmentByLevel(level: 'foundation' | 'higher', language: string = 'es', identifier: string = 'paper-1'): Promise<AQADictationAssessmentDefinition | null> {
    const { data, error } = await this.supabase
      .from('aqa_dictation_assessments')
      .select('*')
      .eq('level', level)
      .eq('language', language)
      .eq('identifier', identifier)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching dictation assessment:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.error('No dictation assessment found for level:', level, 'language:', language, 'identifier:', identifier);
      return null;
    }

    return data[0];
  }

  // Get questions for an assessment
  async getQuestionsForAssessment(assessmentId: string): Promise<AQADictationQuestion[]> {
    const { data, error } = await this.supabase
      .from('aqa_dictation_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_number');

    if (error) {
      console.error('Error fetching dictation questions:', error);
      return [];
    }

    return data || [];
  }

  // Create a new assessment attempt
  async startAssessment(
    studentId: string,
    assessmentId: string,
    assignmentId?: string
  ): Promise<string | null> {
    // Get the next attempt number for this student and assessment
    const { data: existingResults } = await this.supabase
      .from('aqa_dictation_results')
      .select('attempt_number')
      .eq('student_id', studentId)
      .eq('assessment_id', assessmentId)
      .order('attempt_number', { ascending: false })
      .limit(1);

    const nextAttemptNumber = existingResults && existingResults.length > 0 
      ? existingResults[0].attempt_number + 1 
      : 1;

    const result = {
      student_id: studentId,
      assessment_id: assessmentId,
      assignment_id: assignmentId,
      attempt_number: nextAttemptNumber,
      start_time: new Date().toISOString(),
      total_time_seconds: 0,
      raw_score: 0,
      total_possible_score: 5,
      percentage_score: 0,
      status: 'incomplete' as const,
      responses: [],
      audio_play_counts: {},
      performance_by_theme: {},
      performance_by_topic: {}
    };

    const { data, error } = await this.supabase
      .from('aqa_dictation_results')
      .insert(result)
      .select('id')
      .single();

    if (error) {
      console.error('Error starting dictation assessment:', error);
      return null;
    }

    return data.id;
  }

  // Submit completed assessment
  async submitAssessment(
    resultId: string,
    responses: AQADictationQuestionResponse[],
    totalTimeSeconds: number,
    audioPlayCounts: Record<string, { normal: number; very_slow: number }> = {}
  ): Promise<boolean> {
    const completionTime = new Date().toISOString();
    
    // Calculate scores and performance summaries
    const rawScore = responses.reduce((sum, r) => sum + r.points_awarded, 0);
    const totalPossible = responses.reduce((sum, r) => sum + r.marks_possible, 0);
    const percentageScore = totalPossible > 0 ? (rawScore / totalPossible) * 100 : 0;

    // Calculate performance by theme and topic
    const performanceByTheme: Record<string, any> = {};
    const performanceByTopic: Record<string, any> = {};

    responses.forEach(response => {
      // Theme performance
      if (!performanceByTheme[response.theme]) {
        performanceByTheme[response.theme] = { correct: 0, total: 0, percentage: 0 };
      }
      performanceByTheme[response.theme].total += 1;
      if (response.is_correct) {
        performanceByTheme[response.theme].correct += 1;
      }

      // Topic performance
      if (!performanceByTopic[response.topic]) {
        performanceByTopic[response.topic] = { correct: 0, total: 0, percentage: 0 };
      }
      performanceByTopic[response.topic].total += 1;
      if (response.is_correct) {
        performanceByTopic[response.topic].correct += 1;
      }
    });

    // Calculate percentages
    Object.keys(performanceByTheme).forEach(theme => {
      const perf = performanceByTheme[theme];
      perf.percentage = perf.total > 0 ? (perf.correct / perf.total) * 100 : 0;
    });

    Object.keys(performanceByTopic).forEach(topic => {
      const perf = performanceByTopic[topic];
      perf.percentage = perf.total > 0 ? (perf.correct / perf.total) * 100 : 0;
    });

    // Update the result record
    const { error: updateError } = await this.supabase
      .from('aqa_dictation_results')
      .update({
        completion_time: completionTime,
        total_time_seconds: totalTimeSeconds,
        raw_score: rawScore,
        total_possible_score: totalPossible,
        percentage_score: percentageScore,
        status: 'completed',
        responses: responses,
        audio_play_counts: audioPlayCounts,
        performance_by_theme: performanceByTheme,
        performance_by_topic: performanceByTopic,
        updated_at: completionTime
      })
      .eq('id', resultId);

    if (updateError) {
      console.error('Error updating dictation result:', updateError);
      return false;
    }

    // Insert individual question responses
    const questionResponses = responses.map(response => ({
      result_id: resultId,
      question_id: response.question_id,
      question_number: response.question_number,
      student_answer: response.student_answer,
      correct_answer: response.correct_answer,
      is_correct: response.is_correct,
      points_awarded: response.points_awarded,
      time_spent_seconds: response.time_spent_seconds,
      normal_audio_plays: response.normal_audio_plays,
      very_slow_audio_plays: response.very_slow_audio_plays,
      theme: response.theme,
      topic: response.topic,
      marks_possible: response.marks_possible
    }));

    const { error: responsesError } = await this.supabase
      .from('aqa_dictation_question_responses')
      .insert(questionResponses);

    if (responsesError) {
      console.error('Error inserting dictation question responses:', responsesError);
      return false;
    }

    // Get the assessment result to extract student_id and assessment_id for skill tracking
    const { data: resultData, error: resultFetchError } = await this.supabase
      .from('aqa_dictation_results')
      .select('student_id, assessment_id')
      .eq('id', resultId)
      .single();

    if (!resultFetchError && resultData) {
      // Get assessment details for language
      const { data: assessmentData } = await this.supabase
        .from('aqa_dictation_assessments')
        .select('language')
        .eq('id', resultData.assessment_id)
        .single();

      if (assessmentData) {
        // Calculate dictation-specific listening metrics
        const totalAudioPlays = Object.values(audioPlayCounts).reduce((sum, counts) =>
          sum + (counts.normal || 0) + (counts.very_slow || 0), 0);
        const correctAnswers = responses.filter(r => r.is_correct).length;

        const listeningMetrics: ListeningSkillMetrics = {
          audioComprehensionAccuracy: percentageScore,
          responseTimePerEvidence: responses.length > 0 ? totalTimeSeconds / responses.length : 0,
          listeningSkillProgression: percentageScore,
          audioPlaybackCount: totalAudioPlays,
          comprehensionSpeed: totalTimeSeconds > 0 ? (responses.length / totalTimeSeconds) * 60 : 0,
          contextualUnderstanding: percentageScore // Dictation tests contextual listening comprehension
        };

        // Track listening skills (dictation is primarily a listening assessment)
        await assessmentSkillTrackingService.trackListeningSkills(
          resultData.student_id,
          resultData.assessment_id,
          'aqa_dictation',
          assessmentData.language,
          listeningMetrics,
          responses.length,
          correctAnswers,
          totalTimeSeconds
        );
      }
    }

    return true;
  }

  // Get results for a student
  async getStudentResults(studentId: string, assessmentId?: string): Promise<AQADictationResult[]> {
    let query = this.supabase
      .from('aqa_dictation_results')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (assessmentId) {
      query = query.eq('assessment_id', assessmentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching dictation results:', error);
      return [];
    }

    return data || [];
  }
}
