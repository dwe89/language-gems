import { createClient } from '@/utils/supabase/client';
import { assessmentSkillTrackingService, type WritingSkillMetrics } from './assessmentSkillTrackingService';
import { calculateGCSEGrade } from '@/lib/gcseGrading';

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
  private supabase = createClient();

  /**
   * Get all available writing assessments
   */
  async getAssessments(): Promise<AQAWritingAssessmentDefinition[]> {
    try {
      const { data, error } = await this.supabase
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
      let query = this.supabase
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
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
  async createResult(assessmentId: string, studentId: string, schoolId?: string, assignmentId?: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_writing_results')
        .insert({
          assessment_id: assessmentId,
          student_id: studentId,
          school_id: schoolId,
          assignment_id: assignmentId || null,
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
      const { error } = await this.supabase
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
    totalTimeSpent: number,
    maxScore: number = 50
  ): Promise<boolean> {
    try {
      // Calculate percentage and GCSE grade
      const percentageScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      
      // Get assessment tier for GCSE grading
      const { data: resultData } = await this.supabase
        .from('aqa_writing_results')
        .select('assessment_id')
        .eq('id', resultId)
        .single();

      let gcseGrade = 1; // Default grade
      if (resultData) {
        const { data: assessmentData } = await this.supabase
          .from('aqa_writing_assessments')
          .select('level')
          .eq('id', resultData.assessment_id)
          .single();
        
        const tier = assessmentData?.level || 'higher';
        gcseGrade = calculateGCSEGrade(percentageScore, tier);
      }

      const { error } = await this.supabase
        .from('aqa_writing_results')
        .update({
          total_score: totalScore,
          questions_completed: questionsCompleted,
          time_spent_seconds: totalTimeSpent,
          percentage_score: percentageScore,
          gcse_grade: gcseGrade,
          completed_at: new Date().toISOString(),
          is_completed: true
        })
        .eq('id', resultId);

      if (error) {
        console.error('Error completing writing assessment:', error);
        return false;
      }

      // Get the assessment result to extract student_id and assessment_id for skill tracking
      const { data: skillResultData, error: resultFetchError } = await this.supabase
        .from('aqa_writing_results')
        .select('student_id, assessment_id')
        .eq('id', resultId)
        .single();

      if (!resultFetchError && skillResultData) {
        // Get assessment details for language
        const { data: assessmentData } = await this.supabase
          .from('aqa_writing_assessments')
          .select('language')
          .eq('id', skillResultData.assessment_id)
          .single();

        if (assessmentData) {
          // Calculate writing skill metrics
          const averageTimePerQuestion = questionsCompleted > 0 ? totalTimeSpent / questionsCompleted : 0;

          const writingMetrics: WritingSkillMetrics = {
            grammarAccuracy: percentageScore * 0.8, // Estimate grammar component
            vocabularyUsage: percentageScore * 0.9, // Estimate vocabulary component
            structuralCoherence: percentageScore * 0.85, // Estimate structure component
            creativityScore: percentageScore * 0.7, // Estimate creativity component
            wordCountAccuracy: 85, // Default - could be enhanced with actual word count analysis
            taskCompletion: questionsCompleted > 0 ? 100 : 0 // Task completion percentage
          };

          // Track writing skills in assessment_skill_breakdown table
          await assessmentSkillTrackingService.trackWritingSkills(
            skillResultData.student_id,
            skillResultData.assessment_id,
            'aqa_writing',
            assessmentData.language,
            writingMetrics,
            questionsCompleted,
            Math.round(questionsCompleted * (percentageScore / 100)), // Estimate correct answers
            totalTimeSpent
          );
        }
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
      const { data, error } = await this.supabase
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

  /**
   * Save completed writing assessment results (for assignment mode)
   * This creates a complete record in one go, used when assessment is submitted
   */
  async saveCompletedResults(params: {
    assessmentId: string;
    studentId: string;
    assignmentId: string;
    totalScore: number;
    maxScore: number;
    questionsCompleted: number;
    timeSpentSeconds: number;
    questionResults?: any[];
    schoolId?: string;
  }): Promise<string | null> {
    try {
      const {
        assessmentId,
        studentId,
        assignmentId,
        totalScore,
        maxScore,
        questionsCompleted,
        timeSpentSeconds,
        questionResults,
        schoolId
      } = params;

      // Calculate percentage and GCSE grade
      const percentageScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      
      // Get assessment tier for GCSE grading
      const { data: assessmentData } = await this.supabase
        .from('aqa_writing_assessments')
        .select('level')
        .eq('id', assessmentId)
        .single();
      
      const tier = assessmentData?.level || 'foundation';
      const gcseGrade = calculateGCSEGrade(percentageScore, tier);

      console.log('📝 [Writing] Saving completed results:', {
        assessmentId,
        studentId,
        assignmentId,
        totalScore,
        maxScore,
        percentageScore,
        gcseGrade
      });

      // Insert the result record
      // NOTE: percentage_score is a generated column, do NOT include it in insert
      const { data, error } = await this.supabase
        .from('aqa_writing_results')
        .insert({
          assessment_id: assessmentId,
          student_id: studentId,
          assignment_id: assignmentId,
          school_id: schoolId || null,
          total_score: totalScore,
          max_score: maxScore,
          // percentage_score is auto-generated by DB
          gcse_grade: gcseGrade,
          questions_completed: questionsCompleted,
          time_spent_seconds: timeSpentSeconds,
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ Error saving writing results:', error);
        return null;
      }

      console.log('✅ [Writing] Results saved with ID:', data.id);

      // Save individual question responses if provided
      if (questionResults && questionResults.length > 0) {
        console.log('📝 [Writing] Saving', questionResults.length, 'question responses...');
        for (let i = 0; i < questionResults.length; i++) {
          const qr = questionResults[i];
          
          // Build comprehensive AI feedback including detailed feedback
          let aiFeedback = qr.feedback || '';
          if (qr.detailedFeedback) {
            const details = qr.detailedFeedback;
            if (details.strengths && details.strengths.length > 0) {
              aiFeedback += '\n\nStrengths: ' + details.strengths.join('; ');
            }
            if (details.improvements && details.improvements.length > 0) {
              aiFeedback += '\n\nAreas for improvement: ' + details.improvements.join('; ');
            }
            if (details.grammarErrors && details.grammarErrors.length > 0) {
              aiFeedback += '\n\nGrammar points: ' + details.grammarErrors.join('; ');
            }
          }

          console.log(`   Q${i + 1}: ${qr.questionId} - Score: ${qr.score}/${qr.maxScore}`);

          const { error: insertError } = await this.supabase
            .from('aqa_writing_question_responses')
            .insert({
              result_id: data.id,
              question_id: qr.questionId || `q${i + 1}`,
              student_id: studentId,
              response_data: qr.response || {},
              score: qr.score || 0,
              max_score: qr.maxScore || 0,
              time_spent_seconds: qr.timeSpent || 0,
              feedback: aiFeedback || null,  // Column is 'feedback' not 'ai_feedback'
              is_correct: (qr.score || 0) > 0
            });

          if (insertError) {
            console.error(`   ❌ Error saving Q${i + 1}:`, insertError);
          }
        }
        console.log('✅ [Writing] All question responses saved');
      }

      return data.id;
    } catch (error) {
      console.error('❌ Error in saveCompletedResults:', error);
      return null;
    }
  }
}
