import { supabase } from '../lib/supabase';
import { assessmentSkillTrackingService, type ListeningSkillMetrics } from './assessmentSkillTrackingService';

export interface EdexcelListeningAssessmentDefinition {
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

export interface EdexcelListeningQuestion {
  id: string;
  question_type: 'multiple-choice' | 'multiple-response' | 'word-cloud' | 'open-response-a' | 'open-response-b' | 'open-response-c' | 'multi-part' | 'dictation';
  title: string;
  instructions: string;
  section: 'A' | 'B'; // Section A: Listening comprehension, Section B: Dictation
  question_number: number;
  audioUrl?: string;
  audioText?: string;
  audioTranscript?: string;
  timeLimit?: number;
  data: any;
  marks: number;
  ttsConfig?: {
    voiceName?: string;
    multiSpeaker?: boolean;
    speakers?: Array<{ name: string; voiceName: string }>;
    style?: string;
  };
}

export interface EdexcelListeningQuestionResponse {
  question_id: string;
  question_number: number;
  student_answer: any;
  correct_answer: any;
  is_correct: boolean;
  points_awarded: number;
  marks_possible: number;
  time_spent_seconds: number;
  audio_play_count: number;
  theme?: string;
  topic?: string;
}

export class EdexcelListeningAssessmentService {
  private supabase = supabase;

  // Get assessments by level and language
  async getAssessmentsByLevel(level: 'foundation' | 'higher', language: string): Promise<EdexcelListeningAssessmentDefinition[]> {
    try {
      const { data, error } = await this.supabase
        .from('edexcel_listening_assessments')
        .select('*')
        .eq('level', level)
        .eq('language', language)
        .eq('is_active', true)
        .order('identifier');

      if (error) {
        console.error('Error fetching Edexcel listening assessments:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getAssessmentsByLevel:', err);
      return [];
    }
  }

  // Get specific assessment by ID
  async getAssessmentById(assessmentId: string): Promise<EdexcelListeningAssessmentDefinition | null> {
    try {
      const { data, error } = await this.supabase
        .from('edexcel_listening_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) {
        console.error('Error fetching assessment:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in getAssessmentById:', err);
      return null;
    }
  }

  // Get questions for an assessment
  async getQuestionsByAssessmentId(assessmentId: string): Promise<EdexcelListeningQuestion[]> {
    try {
      const { data, error } = await this.supabase
        .from('edexcel_listening_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('question_number');

      if (error) {
        console.error('Error fetching questions:', error);
        return [];
      }

      // Map database fields to interface
      const mappedQuestions: EdexcelListeningQuestion[] = (data || []).map(q => ({
        id: q.id,
        question_type: q.question_type,
        title: q.title,
        instructions: q.instructions,
        section: q.section,
        question_number: q.question_number,
        audioUrl: q.audio_url,
        audioText: q.audio_text,
        audioTranscript: q.audio_transcript,
        timeLimit: q.time_limit_seconds,
        data: q.question_data, // Map question_data to data
        marks: q.marks,
        ttsConfig: q.tts_config
      }));

      console.log('Mapped questions:', mappedQuestions);
      return mappedQuestions;
    } catch (err) {
      console.error('Error in getQuestionsByAssessmentId:', err);
      return [];
    }
  }

  // Find assessment by language, level, and identifier
  async findAssessment(language: string, level: 'foundation' | 'higher', identifier: string): Promise<EdexcelListeningAssessmentDefinition | null> {
    try {
      const { data, error } = await this.supabase
        .from('edexcel_listening_assessments')
        .select('*')
        .eq('language', language)
        .eq('level', level)
        .eq('identifier', identifier)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error finding assessment:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in findAssessment:', err);
      return null;
    }
  }

  // Start a new assessment attempt
  async startAssessment(
    assessmentId: string,
    studentId?: string,
    assignmentId?: string
  ): Promise<string | null> {
    try {
      // Get next attempt number
      const { data: existingAttempts } = await this.supabase
        .from('edexcel_listening_results')
        .select('attempt_number')
        .eq('assessment_id', assessmentId)
        .eq('student_id', studentId || 'anonymous')
        .order('attempt_number', { ascending: false })
        .limit(1);

      const nextAttemptNumber = existingAttempts && existingAttempts.length > 0 
        ? existingAttempts[0].attempt_number + 1 
        : 1;

      const result = {
        student_id: studentId || 'anonymous',
        assessment_id: assessmentId,
        assignment_id: assignmentId,
        attempt_number: nextAttemptNumber,
        start_time: new Date().toISOString(),
        total_time_seconds: 0,
        raw_score: 0,
        total_possible_score: 50, // Edexcel total marks
        percentage_score: 0,
        status: 'incomplete' as const,
        responses: [],
        audio_play_counts: {},
        performance_by_question_type: {},
        performance_by_theme: {},
        performance_by_topic: {},
        section_a_score: 0, // Section A: Listening comprehension (40 marks)
        section_b_score: 0  // Section B: Dictation (10 marks)
      };

      const { data, error } = await this.supabase
        .from('edexcel_listening_results')
        .insert(result)
        .select('id')
        .single();

      if (error) {
        console.error('Error starting assessment:', error);
        return null;
      }

      return data.id;
    } catch (err) {
      console.error('Error in startAssessment:', err);
      return null;
    }
  }

  // Submit completed assessment
  async submitAssessment(
    resultId: string,
    responses: EdexcelListeningQuestionResponse[],
    totalTimeSeconds: number,
    audioPlayCounts: Record<string, number> = {}
  ): Promise<boolean> {
    try {
      const completionTime = new Date().toISOString();

      // Calculate scores and performance summaries
      const rawScore = responses.reduce((sum, r) => sum + r.points_awarded, 0);
      const totalPossible = responses.reduce((sum, r) => sum + r.marks_possible, 0);
      const percentageScore = totalPossible > 0 ? (rawScore / totalPossible) * 100 : 0;

      // Calculate section scores
      const sectionAResponses = responses.filter(r => r.question_number <= (assessment.level === 'foundation' ? 11 : 9)); // Foundation Q1-11, Higher Q1-9
      const sectionBResponses = responses.filter(r => r.question_number > (assessment.level === 'foundation' ? 11 : 9)); // Dictation questions
      
      const sectionAScore = sectionAResponses.reduce((sum, r) => sum + r.points_awarded, 0);
      const sectionBScore = sectionBResponses.reduce((sum, r) => sum + r.points_awarded, 0);

      // Performance by question type
      const performanceByQuestionType: Record<string, any> = {};
      const questionTypes = ['multiple-choice', 'multiple-response', 'word-cloud', 'open-response-a', 'open-response-b', 'open-response-c', 'multi-part', 'dictation'];
      
      questionTypes.forEach(type => {
        const typeResponses = responses.filter(r => {
          // Map question numbers to types based on Edexcel structure
          if (type === 'dictation') return r.question_number > 11;
          // This would need to be mapped based on actual question structure
          return false;
        });
        
        if (typeResponses.length > 0) {
          const typeScore = typeResponses.reduce((sum, r) => sum + r.points_awarded, 0);
          const typePossible = typeResponses.reduce((sum, r) => sum + r.marks_possible, 0);
          performanceByQuestionType[type] = {
            score: typeScore,
            possible: typePossible,
            percentage: typePossible > 0 ? (typeScore / typePossible) * 100 : 0,
            questions: typeResponses.length
          };
        }
      });

      // Performance by theme and topic
      const performanceByTheme: Record<string, any> = {};
      const performanceByTopic: Record<string, any> = {};

      responses.forEach(response => {
        if (response.theme) {
          if (!performanceByTheme[response.theme]) {
            performanceByTheme[response.theme] = { score: 0, possible: 0, questions: 0 };
          }
          performanceByTheme[response.theme].score += response.points_awarded;
          performanceByTheme[response.theme].possible += response.marks_possible;
          performanceByTheme[response.theme].questions += 1;
        }

        if (response.topic) {
          if (!performanceByTopic[response.topic]) {
            performanceByTopic[response.topic] = { score: 0, possible: 0, questions: 0 };
          }
          performanceByTopic[response.topic].score += response.points_awarded;
          performanceByTopic[response.topic].possible += response.marks_possible;
          performanceByTopic[response.topic].questions += 1;
        }
      });

      // Calculate percentages for themes and topics
      Object.keys(performanceByTheme).forEach(theme => {
        const perf = performanceByTheme[theme];
        perf.percentage = perf.possible > 0 ? (perf.score / perf.possible) * 100 : 0;
      });

      Object.keys(performanceByTopic).forEach(topic => {
        const perf = performanceByTopic[topic];
        perf.percentage = perf.possible > 0 ? (perf.score / perf.possible) * 100 : 0;
      });

      const { error } = await this.supabase
        .from('edexcel_listening_results')
        .update({
          completion_time: completionTime,
          total_time_seconds: totalTimeSeconds,
          raw_score: rawScore,
          percentage_score: percentageScore,
          status: 'complete',
          responses: responses,
          audio_play_counts: audioPlayCounts,
          performance_by_question_type: performanceByQuestionType,
          performance_by_theme: performanceByTheme,
          performance_by_topic: performanceByTopic,
          section_a_score: sectionAScore,
          section_b_score: sectionBScore
        })
        .eq('id', resultId);

      if (error) {
        console.error('Error submitting assessment:', error);
        return false;
      }

      // Track listening skills for analytics
      const correctAnswers = responses.filter(r => r.is_correct).length;
      const totalAudioPlays = Object.values(audioPlayCounts).reduce((sum, count) => sum + count, 0);
      const listeningMetrics: ListeningSkillMetrics = {
        audioComprehensionAccuracy: (correctAnswers / responses.length) * 100,
        responseTimePerEvidence: totalTimeSeconds / responses.length,
        listeningSkillProgression: percentageScore,
        audioPlaybackCount: totalAudioPlays,
        comprehensionSpeed: totalTimeSeconds > 0 ? (responses.length / totalTimeSeconds) * 60 : 0,
        contextualUnderstanding: sectionAScore / 40 * 100 // Section A performance
      };

      // Get result data for skill tracking
      const { data: resultData, error: resultFetchError } = await this.supabase
        .from('edexcel_listening_results')
        .select('student_id, assessment_id')
        .eq('id', resultId)
        .single();

      if (!resultFetchError && resultData) {
        // Get assessment details for language
        const { data: assessmentData } = await this.supabase
          .from('edexcel_listening_assessments')
          .select('language')
          .eq('id', resultData.assessment_id)
          .single();

        if (assessmentData) {
          // Track listening skills in assessment_skill_breakdown table
          await assessmentSkillTrackingService.trackListeningSkills(
            resultData.student_id,
            resultData.assessment_id,
            'edexcel_listening',
            assessmentData.language,
            listeningMetrics,
            responses.length,
            correctAnswers,
            totalTimeSeconds
          );
        }
      }

      return true;
    } catch (err) {
      console.error('Error in submitAssessment:', err);
      return false;
    }
  }

  // Get assessment results
  async getAssessmentResults(resultId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('edexcel_listening_results')
        .select('*')
        .eq('id', resultId)
        .single();

      if (error) {
        console.error('Error fetching results:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in getAssessmentResults:', err);
      return null;
    }
  }
}
