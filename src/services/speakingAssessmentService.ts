import { createClient } from '@/utils/supabase/client';
import { calculateGCSEGrade } from '@/lib/gcseGrading';

// =====================================================
// Type Definitions
// =====================================================

export type SectionType = 'roleplay' | 'reading_aloud' | 'short_conversation' | 'photocard' | 'general_conversation';
export type Tier = 'foundation' | 'higher';
export type Language = 'es' | 'fr' | 'de';

export interface SpeakingAssessmentDefinition {
  id: string;
  title: string;
  description?: string;
  language: Language;
  level: Tier;
  identifier: string;
  version: string;
  total_sections: number;
  total_marks: number;
  time_limit_minutes: number;
  prep_time_minutes: number;
  is_active: boolean;
  is_practice: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleplayTask {
  task_number: number;
  student_prompt_en: string;       // What the student needs to say (in English)
  examiner_question: string;       // The examiner's question (in target language)
  examiner_question_audio_url?: string;  // Pre-generated TTS audio (optional)
  expected_keywords?: string[];    // Keywords to look for in response
}

export interface SpeakingQuestion {
  id: string;
  assessment_id: string;
  section_type: SectionType;
  section_number: number;
  question_number: number;
  title?: string;
  prompt_text: string;
  prompt_audio_url?: string;
  context_text?: string;
  reading_text?: string;
  photo_urls?: string[];
  theme?: string;
  bullet_points?: string[];
  marks: number;
  time_limit_seconds?: number;
  rubric_type: string;
  rubric_config?: any;
  difficulty_rating?: number;
  roleplay_tasks?: RoleplayTask[];  // Structured roleplay sub-questions
}

export interface SpeakingResult {
  id: string;
  assessment_id: string;
  student_id: string;
  assignment_id?: string;
  school_id?: string;
  total_score: number;
  max_score: number;
  percentage_score: number;
  gcse_grade?: number;
  roleplay_score: number;
  roleplay_max: number;
  reading_aloud_score: number;
  reading_aloud_max: number;
  short_conversation_score: number;
  short_conversation_max: number;
  photocard_score: number;
  photocard_max: number;
  general_conversation_score: number;
  general_conversation_max: number;
  total_time_seconds: number;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'pending_review' | 'completed' | 'reviewed' | 'overridden';
  reviewed_by?: string;
  reviewed_at?: string;
  teacher_notes?: string;
  performance_metrics?: any;
}

export interface SpeakingResponse {
  id: string;
  result_id: string;
  question_id: string;
  student_id: string;
  audio_file_url?: string;
  audio_duration_seconds?: number;
  audio_format: string;
  original_transcription?: string;
  transcription_confidence?: number;
  student_edited_transcription?: string;
  final_transcription?: string;
  student_verified: boolean;
  transcription_verified_at?: string;
  score: number;
  max_score: number;
  is_graded: boolean;
  graded_at?: string;
  communication_score?: number;
  communication_max?: number;
  language_quality_score?: number;
  language_quality_max?: number;
  criteria_scores?: Record<string, any>;
  ai_feedback?: string;
  ai_suggestions?: string[];
  errors_detected?: any[];
  teacher_override_score?: number;
  teacher_override_reason?: string;
  time_spent_seconds: number;
  attempt_number: number;
}

export interface TranscriptionResult {
  transcription: string;
  confidence: number;
  duration: number;
  language: string;
}

export type ErrorType = 'grammar' | 'vocabulary' | 'pronunciation' | 'structure';

export interface ErrorDetail {
  type: ErrorType;
  issue: string;
  correction?: string;
  example?: string;
}

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  criteriaScores: Record<string, { score: number; max: number; feedback?: string }>;
  criteriaMet: Record<string, boolean>;
  errors: ErrorDetail[];
  feedback: string;
  suggestions: string[];
}

// =====================================================
// Speaking Assessment Service
// =====================================================

export class SpeakingAssessmentService {
  private supabase = createClient();

  // =====================================================
  // Assessment Definition Methods
  // =====================================================

  /**
   * Get all active speaking assessments
   */
  async getAssessments(): Promise<SpeakingAssessmentDefinition[]> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_assessments')
        .select('*')
        .eq('is_active', true)
        .order('language')
        .order('level')
        .order('identifier');

      if (error) {
        console.error('Error fetching speaking assessments:', error);
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
  async getAssessmentsByLevel(level: Tier, language?: Language): Promise<SpeakingAssessmentDefinition[]> {
    try {
      let query = this.supabase
        .from('aqa_speaking_assessments')
        .select('*')
        .eq('is_active', true)
        .eq('level', level);

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query.order('identifier');

      if (error) {
        console.error('Error fetching speaking assessments by level:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsByLevel:', error);
      return [];
    }
  }

  /**
   * Get a specific assessment
   */
  async getAssessment(level: Tier, language: Language, identifier: string): Promise<SpeakingAssessmentDefinition | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_assessments')
        .select('*')
        .eq('level', level)
        .eq('language', language)
        .eq('identifier', identifier)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching speaking assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessment:', error);
      return null;
    }
  }

  /**
   * Get assessment by ID
   */
  async getAssessmentById(assessmentId: string): Promise<SpeakingAssessmentDefinition | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) {
        console.error('Error fetching speaking assessment by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessmentById:', error);
      return null;
    }
  }

  // =====================================================
  // Question Methods
  // =====================================================

  /**
   * Get all questions for an assessment
   */
  async getQuestions(assessmentId: string): Promise<SpeakingQuestion[]> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('section_number')
        .order('question_number');

      if (error) {
        console.error('Error fetching speaking questions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestions:', error);
      return [];
    }
  }

  /**
   * Get questions by section
   */
  async getQuestionsBySection(assessmentId: string, sectionType: SectionType): Promise<SpeakingQuestion[]> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('section_type', sectionType)
        .order('question_number');

      if (error) {
        console.error('Error fetching speaking questions by section:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestionsBySection:', error);
      return [];
    }
  }

  /**
   * Get a specific question by ID
   */
  async getQuestionById(questionId: string): Promise<SpeakingQuestion | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (error) {
        console.error('Error fetching speaking question:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getQuestionById:', error);
      return null;
    }
  }

  // =====================================================
  // Result Methods
  // =====================================================

  /**
   * Start a new speaking exam
   */
  async startExam(
    assessmentId: string,
    studentId: string,
    assignmentId?: string,
    schoolId?: string
  ): Promise<SpeakingResult | null> {
    try {
      // Get the assessment to know max scores
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        console.error('Assessment not found');
        return null;
      }

      const { data, error } = await this.supabase
        .from('aqa_speaking_results')
        .insert({
          assessment_id: assessmentId,
          student_id: studentId,
          assignment_id: assignmentId,
          school_id: schoolId,
          max_score: assessment.total_marks,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting speaking exam:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in startExam:', error);
      return null;
    }
  }

  /**
   * Get an existing result or start a new exam
   */
  async getOrStartExam(
    assessmentId: string,
    studentId: string,
    assignmentId?: string,
    schoolId?: string
  ): Promise<SpeakingResult | null> {
    try {
      // Check for existing in-progress result
      const { data: existingResult } = await this.supabase
        .from('aqa_speaking_results')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('student_id', studentId)
        .eq('status', 'in_progress')
        .single();

      if (existingResult) {
        return existingResult;
      }

      // Start new exam
      return await this.startExam(assessmentId, studentId, assignmentId, schoolId);
    } catch (error) {
      // No existing result, start new
      return await this.startExam(assessmentId, studentId, assignmentId, schoolId);
    }
  }

  /**
   * Get student's result for an assessment
   */
  async getStudentResult(assessmentId: string, studentId: string): Promise<SpeakingResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_results')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get result by ID
   */
  async getResultById(resultId: string): Promise<SpeakingResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_results')
        .select('*')
        .eq('id', resultId)
        .single();

      if (error) {
        console.error('Error fetching result:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getResultById:', error);
      return null;
    }
  }

  /**
   * Get responses for a result with question details
   */
  async getResponsesForResult(resultId: string): Promise<(SpeakingResponse & { question?: SpeakingQuestion })[]> {
    try {
      const { data: responses, error } = await this.supabase
        .from('aqa_speaking_responses')
        .select('*')
        .eq('result_id', resultId)
        .order('created_at', { ascending: true });

      if (error || !responses) {
        console.error('Error fetching responses:', error);
        return [];
      }

      // Get question details for each response
      const questionIds = [...new Set(responses.map(r => r.question_id))];
      const { data: questions } = await this.supabase
        .from('aqa_speaking_questions')
        .select('*')
        .in('id', questionIds);

      const questionsMap = new Map(questions?.map(q => [q.id, q]) || []);

      return responses.map(r => ({
        ...r,
        question: questionsMap.get(r.question_id),
      }));
    } catch (error) {
      console.error('Error in getResponsesForResult:', error);
      return [];
    }
  }

  /**
   * Update result scores
   */
  async updateResultScores(resultId: string): Promise<SpeakingResult | null> {
    try {
      // Get all responses for this result
      const { data: responses, error: responsesError } = await this.supabase
        .from('aqa_speaking_responses')
        .select('*')
        .eq('result_id', resultId)
        .eq('is_graded', true);

      if (responsesError || !responses) {
        console.error('Error fetching responses:', responsesError);
        return null;
      }

      // Get questions to determine section types
      const questionIds = responses.map(r => r.question_id);
      const { data: questions } = await this.supabase
        .from('aqa_speaking_questions')
        .select('id, section_type, marks')
        .in('id', questionIds);

      const questionMap = new Map(questions?.map(q => [q.id, q]) || []);

      // Calculate section scores
      const sectionScores: Record<SectionType, { score: number; max: number }> = {
        roleplay: { score: 0, max: 0 },
        reading_aloud: { score: 0, max: 0 },
        short_conversation: { score: 0, max: 0 },
        photocard: { score: 0, max: 0 },
        general_conversation: { score: 0, max: 0 },
      };

      for (const response of responses) {
        const question = questionMap.get(response.question_id);
        if (question) {
          const sectionType = question.section_type as SectionType;
          const finalScore = response.teacher_override_score ?? response.score;
          sectionScores[sectionType].score += finalScore;
          sectionScores[sectionType].max += response.max_score;
        }
      }

      // Calculate totals
      const totalScore = Object.values(sectionScores).reduce((sum, s) => sum + s.score, 0);
      const maxScore = Object.values(sectionScores).reduce((sum, s) => sum + s.max, 0);
      const percentageScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

      // Calculate GCSE grade
      const gcseGrade = calculateGCSEGrade(percentageScore);

      // Update the result
      const { data, error } = await this.supabase
        .from('aqa_speaking_results')
        .update({
          total_score: totalScore,
          max_score: maxScore,
          percentage_score: percentageScore,
          gcse_grade: gcseGrade,
          roleplay_score: sectionScores.roleplay.score,
          roleplay_max: sectionScores.roleplay.max,
          reading_aloud_score: sectionScores.reading_aloud.score,
          reading_aloud_max: sectionScores.reading_aloud.max,
          short_conversation_score: sectionScores.short_conversation.score,
          short_conversation_max: sectionScores.short_conversation.max,
          photocard_score: sectionScores.photocard.score,
          photocard_max: sectionScores.photocard.max,
          general_conversation_score: sectionScores.general_conversation.score,
          general_conversation_max: sectionScores.general_conversation.max,
        })
        .eq('id', resultId)
        .select()
        .single();

      if (error) {
        console.error('Error updating result scores:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateResultScores:', error);
      return null;
    }
  }

  /**
   * Complete an exam
   */
  async completeExam(resultId: string, totalTimeSeconds: number): Promise<SpeakingResult | null> {
    try {
      // First update scores
      await this.updateResultScores(resultId);

      // Then mark as completed
      const { data, error } = await this.supabase
        .from('aqa_speaking_results')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_time_seconds: totalTimeSeconds,
        })
        .eq('id', resultId)
        .select()
        .single();

      if (error) {
        console.error('Error completing exam:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in completeExam:', error);
      return null;
    }
  }

  // =====================================================
  // Response Methods
  // =====================================================

  /**
   * Save a speaking response (before grading)
   */
  async saveResponse(
    resultId: string,
    questionId: string,
    studentId: string,
    audioFileUrl: string,
    audioDurationSeconds: number,
    audioFormat: string = 'webm'
  ): Promise<SpeakingResponse | null> {
    try {
      // Get question to know max score
      const question = await this.getQuestionById(questionId);
      if (!question) {
        console.error('Question not found');
        return null;
      }

      // Upsert the response
      const { data, error } = await this.supabase
        .from('aqa_speaking_responses')
        .upsert({
          result_id: resultId,
          question_id: questionId,
          student_id: studentId,
          audio_file_url: audioFileUrl,
          audio_duration_seconds: audioDurationSeconds,
          audio_format: audioFormat,
          max_score: question.marks,
          started_at: new Date().toISOString(),
        }, {
          onConflict: 'result_id,question_id',
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving response:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in saveResponse:', error);
      return null;
    }
  }

  /**
   * Update response with transcription
   */
  async updateTranscription(
    responseId: string,
    transcription: string,
    confidence: number
  ): Promise<SpeakingResponse | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_responses')
        .update({
          original_transcription: transcription,
          transcription_confidence: confidence,
          final_transcription: transcription, // Will be updated if student edits
        })
        .eq('id', responseId)
        .select()
        .single();

      if (error) {
        console.error('Error updating transcription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateTranscription:', error);
      return null;
    }
  }

  /**
   * Student verifies/edits transcription
   */
  async verifyTranscription(
    responseId: string,
    editedTranscription?: string
  ): Promise<SpeakingResponse | null> {
    try {
      const updateData: any = {
        student_verified: true,
        transcription_verified_at: new Date().toISOString(),
      };

      if (editedTranscription) {
        updateData.student_edited_transcription = editedTranscription;
        updateData.final_transcription = editedTranscription;
      }

      const { data, error } = await this.supabase
        .from('aqa_speaking_responses')
        .update(updateData)
        .eq('id', responseId)
        .select()
        .single();

      if (error) {
        console.error('Error verifying transcription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in verifyTranscription:', error);
      return null;
    }
  }

  /**
   * Update response with AI grading
   */
  async gradeResponse(
    responseId: string,
    gradingResult: AssessmentResult
  ): Promise<SpeakingResponse | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_responses')
        .update({
          score: gradingResult.totalScore,
          is_graded: true,
          graded_at: new Date().toISOString(),
          communication_score: gradingResult.criteriaScores.communication?.score,
          communication_max: gradingResult.criteriaScores.communication?.max,
          language_quality_score: gradingResult.criteriaScores.language_quality?.score,
          language_quality_max: gradingResult.criteriaScores.language_quality?.max,
          criteria_scores: gradingResult.criteriaScores,
          ai_feedback: gradingResult.feedback,
          ai_suggestions: gradingResult.suggestions,
          errors_detected: gradingResult.errors,
        })
        .eq('id', responseId)
        .select()
        .single();

      if (error) {
        console.error('Error grading response:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in gradeResponse:', error);
      return null;
    }
  }

  /**
   * Get all responses for a result
   */
  async getResponses(resultId: string): Promise<SpeakingResponse[]> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_responses')
        .select('*')
        .eq('result_id', resultId)
        .order('created_at');

      if (error) {
        console.error('Error fetching responses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getResponses:', error);
      return [];
    }
  }

  /**
   * Get response by question
   */
  async getResponseByQuestion(resultId: string, questionId: string): Promise<SpeakingResponse | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_responses')
        .select('*')
        .eq('result_id', resultId)
        .eq('question_id', questionId)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  // =====================================================
  // Teacher Review Methods
  // =====================================================

  /**
   * Teacher override for a response score
   */
  async teacherOverride(
    responseId: string,
    newScore: number,
    reason: string,
    teacherId: string
  ): Promise<SpeakingResponse | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_responses')
        .update({
          teacher_override_score: newScore,
          teacher_override_reason: reason,
          overridden_by: teacherId,
          overridden_at: new Date().toISOString(),
        })
        .eq('id', responseId)
        .select()
        .single();

      if (error) {
        console.error('Error overriding score:', error);
        return null;
      }

      // Update result totals
      if (data) {
        await this.updateResultScores(data.result_id);
      }

      return data;
    } catch (error) {
      console.error('Error in teacherOverride:', error);
      return null;
    }
  }

  /**
   * Teacher marks result as reviewed
   */
  async markAsReviewed(
    resultId: string,
    teacherId: string,
    notes?: string
  ): Promise<SpeakingResult | null> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_results')
        .update({
          status: 'reviewed',
          reviewed_by: teacherId,
          reviewed_at: new Date().toISOString(),
          teacher_notes: notes,
        })
        .eq('id', resultId)
        .select()
        .single();

      if (error) {
        console.error('Error marking as reviewed:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in markAsReviewed:', error);
      return null;
    }
  }

  // =====================================================
  // Audio File Management
  // =====================================================

  /**
   * Upload audio file to Supabase storage
   */
  async uploadAudioFile(
    audioBlob: Blob,
    studentId: string,
    assessmentId: string,
    questionId: string
  ): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const fileName = `speaking/${assessmentId}/${studentId}/${questionId}_${timestamp}.webm`;

      const { data, error } = await this.supabase.storage
        .from('audio-files')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          upsert: true,
        });

      if (error) {
        console.error('Error uploading audio file:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('audio-files')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadAudioFile:', error);
      return null;
    }
  }

  // =====================================================
  // Transcription and Assessment API Calls
  // =====================================================

  /**
   * Transcribe audio using the API
   */
  async transcribeAudio(audioBlob: Blob, language: Language): Promise<TranscriptionResult | null> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('language', language);

      const response = await fetch('/api/speaking/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Transcription API error:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (!data.success) {
        console.error('Transcription failed:', data.error);
        return null;
      }

      return {
        transcription: data.transcription,
        confidence: data.confidence,
        duration: data.duration,
        language: data.language,
      };
    } catch (error) {
      console.error('Error in transcribeAudio:', error);
      return null;
    }
  }

  /**
   * Assess a response using the API
   */
  async assessResponse(
    transcription: string,
    question: SpeakingQuestion,
    tier: Tier,
    language: Language
  ): Promise<AssessmentResult | null> {
    try {
      const response = await fetch('/api/speaking/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription,
          sectionType: question.section_type,
          tier,
          language,
          questionText: question.prompt_text,
          questionNumber: question.question_number,
          expectedContent: question.context_text,
          originalText: question.reading_text,
          theme: question.theme,
          bulletPoints: question.bullet_points,
          topic: question.theme, // Use theme as topic for general conversation
        }),
      });

      if (!response.ok) {
        console.error('Assessment API error:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (!data.success) {
        console.error('Assessment failed:', data.error);
        return null;
      }

      return {
        totalScore: data.totalScore,
        maxScore: data.maxScore,
        percentage: data.percentage,
        criteriaScores: data.criteriaScores,
        criteriaMet: data.criteriaMet,
        errors: data.errors,
        feedback: data.feedback,
        suggestions: data.suggestions,
      };
    } catch (error) {
      console.error('Error in assessResponse:', error);
      return null;
    }
  }

  // =====================================================
  // Analytics Methods
  // =====================================================

  /**
   * Get student's speaking exam history
   */
  async getStudentHistory(studentId: string, limit: number = 10): Promise<SpeakingResult[]> {
    try {
      const { data, error } = await this.supabase
        .from('aqa_speaking_results')
        .select(`
          *,
          aqa_speaking_assessments (
            title,
            language,
            level,
            identifier
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching student history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStudentHistory:', error);
      return [];
    }
  }

  /**
   * Get class results for a teacher
   */
  async getClassResults(
    assessmentId: string,
    schoolId?: string
  ): Promise<SpeakingResult[]> {
    try {
      let query = this.supabase
        .from('aqa_speaking_results')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name,
            email
          )
        `)
        .eq('assessment_id', assessmentId)
        .in('status', ['completed', 'reviewed'])
        .order('completed_at', { ascending: false });

      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching class results:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getClassResults:', error);
      return [];
    }
  }

  /**
   * Get pending reviews for a teacher
   */
  async getPendingReviews(schoolId?: string): Promise<SpeakingResult[]> {
    try {
      let query = this.supabase
        .from('aqa_speaking_results')
        .select(`
          *,
          aqa_speaking_assessments (
            title,
            language,
            level
          ),
          user_profiles (
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending_review')
        .order('completed_at', { ascending: true });

      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching pending reviews:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingReviews:', error);
      return [];
    }
  }
}

// Export singleton instance
export const speakingAssessmentService = new SpeakingAssessmentService();
