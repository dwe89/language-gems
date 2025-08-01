import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for AQA Writing Assessment
export interface AQAWritingAssessmentDefinition {
  id: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  total_marks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AQAWritingQuestion {
  id: string;
  assessment_id: string;
  question_number: number;
  sub_question_number?: string;
  question_type: 'photo-description' | 'short-message' | 'gap-fill' | 'translation' | 'extended-writing';
  title: string;
  instructions: string;
  question_data: any;
  marks: number;
  word_count_requirement?: number;
  theme: string;
  topic: string;
  difficulty_rating: number;
  created_at: string;
  updated_at: string;
}

export interface AQAWritingResult {
  id: string;
  assessment_id: string;
  assignment_id?: string;
  student_id: string;
  school_id?: string;
  total_score: number;
  max_score: number;
  percentage_score: number;
  time_spent_seconds: number;
  questions_completed: number;
  started_at: string;
  completed_at?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AQAWritingQuestionResponse {
  id: string;
  result_id: string;
  question_id: string;
  student_id: string;
  response_data: any;
  score: number;
  max_score: number;
  time_spent_seconds: number;
  is_correct: boolean;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export type AQAQuestionResponse = {
  questionId: string;
  response: any;
  timeSpent: number;
  score?: number;
  maxScore: number;
};

export class AQAWritingAssessmentService {
  /**
   * Get all available writing assessments
   */
  async getAssessments(): Promise<AQAWritingAssessmentDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_writing_assessments')
        .select('*')
        .eq('is_active', true)
        .order('language')
        .order('level')
        .order('identifier');

      if (error) {
        console.error('Error fetching writing assessments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessments:', error);
      return [];
    }
  }

  /**
   * Get assessments by level and language
   */
  async getAssessmentsByLevel(level: 'foundation' | 'higher', language?: string): Promise<AQAWritingAssessmentDefinition[]> {
    try {
      let query = supabase
        .from('aqa_writing_assessments')
        .select('*')
        .eq('is_active', true)
        .eq('level', level);

      if (language) {
        query = query.eq('language', language);
      }

      query = query.order('identifier');

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching writing assessments by level:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsByLevel:', error);
      return [];
    }
  }

  /**
   * Get a specific assessment by level, language, and identifier
   */
  async getAssessment(level: 'foundation' | 'higher', language: string, identifier: string): Promise<AQAWritingAssessmentDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_writing_assessments')
        .select('*')
        .eq('level', level)
        .eq('language', language)
        .eq('identifier', identifier)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching specific writing assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessment:', error);
      return null;
    }
  }

  /**
   * Get questions for a specific assessment
   */
  async getQuestions(assessmentId: string): Promise<AQAWritingQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_writing_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('question_number')
        .order('sub_question_number');

      if (error) {
        console.error('Error fetching writing questions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestions:', error);
      return [];
    }
  }

  /**
   * Create a new assessment result (when student starts)
   */
  async createResult(assessmentId: string, studentId: string, schoolId?: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_writing_results')
        .insert({
          assessment_id: assessmentId,
          student_id: studentId,
          school_id: schoolId,
          total_score: 0,
          max_score: 50, // Default for Foundation
          time_spent_seconds: 0,
          questions_completed: 0,
          is_completed: false
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating writing result:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in createResult:', error);
      return null;
    }
  }

  /**
   * Save question response
   */
  async saveQuestionResponse(
    resultId: string,
    questionId: string,
    studentId: string,
    response: any,
    timeSpent: number,
    score: number = 0,
    maxScore: number = 10
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('aqa_writing_question_responses')
        .upsert({
          result_id: resultId,
          question_id: questionId,
          student_id: studentId,
          response_data: response,
          score: score,
          max_score: maxScore,
          time_spent_seconds: timeSpent,
          is_correct: score > 0
        });

      if (error) {
        console.error('Error saving writing question response:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveQuestionResponse:', error);
      return false;
    }
  }

  /**
   * Complete assessment and update final scores
   */
  async completeAssessment(
    resultId: string,
    totalScore: number,
    questionsCompleted: number,
    totalTimeSpent: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('aqa_writing_results')
        .update({
          total_score: totalScore,
          questions_completed: questionsCompleted,
          time_spent_seconds: totalTimeSpent,
          completed_at: new Date().toISOString(),
          is_completed: true
        })
        .eq('id', resultId);

      if (error) {
        console.error('Error completing writing assessment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in completeAssessment:', error);
      return false;
    }
  }

  /**
   * Get student's previous results for an assessment
   */
  async getStudentResults(assessmentId: string, studentId: string): Promise<AQAWritingResult[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_writing_results')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching student writing results:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStudentResults:', error);
      return [];
    }
  }
}
