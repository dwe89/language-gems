import { supabase } from '../lib/supabase';
import type { AQAReadingQuestion } from '@/components/assessments/AQAReadingAssessment';

export interface AQAAssessmentDefinition {
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

export interface AQAQuestionDefinition {
  id: string;
  assessment_id: string;
  question_number: number;
  sub_question_number?: string;
  question_type: string;
  title: string;
  instructions: string;
  reading_text?: string;
  question_data: any;
  marks: number;
  theme: string;
  topic: string;
  difficulty_rating: number;
}

export interface AQAAssessmentResult {
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
  responses: any[];
  performance_by_question_type: any;
  performance_by_theme: any;
  performance_by_topic: any;
}

export interface AQAQuestionResponse {
  question_id: string;
  question_number: number;
  sub_question_number?: string;
  student_answer: string;
  is_correct: boolean;
  points_awarded: number;
  time_spent_seconds: number;
  question_type: string;
  theme: string;
  topic: string;
  marks_possible: number;
}

export class AQAReadingAssessmentService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  // Get assessment definition by level, language, and identifier
  async getAssessmentByLevel(level: 'foundation' | 'higher', language: string = 'es', identifier: string = 'paper-1'): Promise<AQAAssessmentDefinition | null> {
    const { data, error } = await this.supabase
      .from('aqa_reading_assessments')
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
  async getAssessmentsByLevel(level: 'foundation' | 'higher', language: string = 'es'): Promise<AQAAssessmentDefinition[]> {
    const { data, error } = await this.supabase
      .from('aqa_reading_assessments')
      .select('*')
      .eq('level', level)
      .eq('language', language)
      .eq('is_active', true)
      .order('identifier');

    if (error) {
      console.error('Error fetching assessments:', error);
      return [];
    }

    return data || [];
  }

  // Get all questions for an assessment
  async getAssessmentQuestions(assessmentId: string): Promise<AQAQuestionDefinition[]> {
    const { data, error } = await this.supabase
      .from('aqa_reading_questions')
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
  async upsertAssessment(assessment: Partial<AQAAssessmentDefinition>): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('aqa_reading_assessments')
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
  async upsertQuestions(questions: Partial<AQAQuestionDefinition>[]): Promise<boolean> {
    const { error } = await this.supabase
      .from('aqa_reading_questions')
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
    // Get the next attempt number
    const { data: existingAttempts } = await this.supabase
      .from('aqa_reading_results')
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
      performance_by_question_type: {},
      performance_by_theme: {},
      performance_by_topic: {}
    };

    const { data, error } = await this.supabase
      .from('aqa_reading_results')
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
    responses: AQAQuestionResponse[],
    totalTimeSeconds: number
  ): Promise<boolean> {
    const completionTime = new Date().toISOString();
    
    // Calculate scores and performance summaries
    const rawScore = responses.reduce((sum, r) => sum + r.points_awarded, 0);
    const totalPossible = responses.reduce((sum, r) => sum + r.marks_possible, 0);
    const percentageScore = totalPossible > 0 ? (rawScore / totalPossible) * 100 : 0;

    // Calculate performance by question type
    const performanceByType = this.calculatePerformanceByCategory(responses, 'question_type');
    const performanceByTheme = this.calculatePerformanceByCategory(responses, 'theme');
    const performanceByTopic = this.calculatePerformanceByCategory(responses, 'topic');

    // Update the main result record
    const { error: resultError } = await this.supabase
      .from('aqa_reading_results')
      .update({
        completion_time: completionTime,
        total_time_seconds: totalTimeSeconds,
        raw_score: rawScore,
        total_possible_score: totalPossible,
        percentage_score: percentageScore,
        status: 'completed',
        responses: responses,
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
      result_id: resultId,
      ...response
    }));

    const { error: responsesError } = await this.supabase
      .from('aqa_reading_question_responses')
      .insert(questionResponses);

    if (responsesError) {
      console.error('Error inserting question responses:', responsesError);
      return false;
    }

    return true;
  }

  // Get student's assessment results
  async getStudentResults(
    studentId: string, 
    assessmentId?: string
  ): Promise<AQAAssessmentResult[]> {
    let query = this.supabase
      .from('aqa_reading_results')
      .select('*')
      .eq('student_id', studentId)
      .order('submission_date', { ascending: false });

    if (assessmentId) {
      query = query.eq('assessment_id', assessmentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching student results:', error);
      return [];
    }

    return data || [];
  }

  // Get class performance analytics
  async getClassPerformance(classId: string, assessmentId: string): Promise<any> {
    // This would require a more complex query joining multiple tables
    // Implementation would depend on specific analytics requirements
    const { data, error } = await this.supabase
      .from('aqa_reading_results')
      .select(`
        *,
        aqa_reading_assignments!inner(class_id)
      `)
      .eq('aqa_reading_assignments.class_id', classId)
      .eq('assessment_id', assessmentId);

    if (error) {
      console.error('Error fetching class performance:', error);
      return null;
    }

    return this.aggregateClassPerformance(data || []);
  }

  // Helper method to calculate performance by category
  private calculatePerformanceByCategory(responses: AQAQuestionResponse[], category: keyof AQAQuestionResponse): any {
    const categoryMap = new Map();

    responses.forEach(response => {
      const categoryValue = response[category] as string;
      if (!categoryMap.has(categoryValue)) {
        categoryMap.set(categoryValue, {
          correct: 0,
          total: 0,
          totalTimeSeconds: 0,
          totalMarks: 0,
          marksAwarded: 0
        });
      }

      const stats = categoryMap.get(categoryValue);
      stats.total += 1;
      stats.totalTimeSeconds += response.time_spent_seconds;
      stats.totalMarks += response.marks_possible;
      stats.marksAwarded += response.points_awarded;
      if (response.is_correct) {
        stats.correct += 1;
      }
    });

    const result: any = {};
    categoryMap.forEach((stats, categoryValue) => {
      result[categoryValue] = {
        correct: stats.correct,
        total: stats.total,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        averageTimeSeconds: stats.total > 0 ? stats.totalTimeSeconds / stats.total : 0,
        scorePercentage: stats.totalMarks > 0 ? (stats.marksAwarded / stats.totalMarks) * 100 : 0
      };
    });

    return result;
  }

  // Helper method to aggregate class performance
  private aggregateClassPerformance(results: AQAAssessmentResult[]): any {
    if (results.length === 0) return null;

    const totalStudents = results.length;
    const completedResults = results.filter(r => r.status === 'completed');
    const averageScore = completedResults.length > 0 
      ? completedResults.reduce((sum, r) => sum + r.percentage_score, 0) / completedResults.length 
      : 0;

    return {
      totalStudents,
      completedStudents: completedResults.length,
      completionRate: (completedResults.length / totalStudents) * 100,
      averageScore,
      averageTimeMinutes: completedResults.length > 0
        ? completedResults.reduce((sum, r) => sum + r.total_time_seconds, 0) / completedResults.length / 60
        : 0
    };
  }
}
