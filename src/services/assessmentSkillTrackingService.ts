import { createClient } from '@/utils/supabase/client';

export interface AssessmentSkillBreakdown {
  id?: string;
  student_id: string;
  assessment_id: string;
  assessment_type: string;
  language: string;
  listening_score?: number;
  reading_score?: number;
  writing_score?: number;
  speaking_score?: number;
  vocabulary_comprehension?: number;
  grammar_accuracy?: number;
  pronunciation_accuracy?: number;
  fluency_score?: number;
  text_comprehension?: number;
  inference_ability?: number;
  structural_coherence?: number;
  total_questions?: number;
  correct_answers?: number;
  completion_time_seconds?: number;
  attempts_count?: number;
  skill_data?: Record<string, any>;
  completed_at?: Date;
}

export interface ListeningSkillMetrics {
  audioComprehensionAccuracy: number;
  responseTimePerEvidence: number;
  listeningSkillProgression: number;
  audioPlaybackCount: number;
  comprehensionSpeed: number;
  contextualUnderstanding: number;
}

export interface ReadingSkillMetrics {
  textComprehensionAccuracy: number;
  inferenceAbility: number;
  vocabularyInContext: number;
  readingSpeed: number;
  detailRetention: number;
  criticalAnalysis: number;
}

export interface WritingSkillMetrics {
  grammarAccuracy: number;
  vocabularyUsage: number;
  structuralCoherence: number;
  creativityScore: number;
  wordCountAccuracy: number;
  taskCompletion: number;
}

export interface SpeakingSkillMetrics {
  pronunciationAccuracy: number;
  fluencyScore: number;
  conversationalCompetence: number;
  vocabularyRange: number;
  grammarInSpeech: number;
  confidenceLevel: number;
}

export class AssessmentSkillTrackingService {
  private supabase = createClient();

  // Track listening assessment skills
  async trackListeningSkills(
    studentId: string,
    assessmentId: string,
    assessmentType: string,
    language: string,
    metrics: ListeningSkillMetrics,
    totalQuestions: number,
    correctAnswers: number,
    completionTimeSeconds: number
  ): Promise<string | null> {
    try {
      const skillBreakdown: AssessmentSkillBreakdown = {
        student_id: studentId,
        assessment_id: assessmentId,
        assessment_type: assessmentType,
        language: language,
        listening_score: metrics.audioComprehensionAccuracy,
        vocabulary_comprehension: metrics.contextualUnderstanding,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        completion_time_seconds: completionTimeSeconds,
        skill_data: {
          listening_metrics: {
            audio_comprehension_accuracy: metrics.audioComprehensionAccuracy,
            response_time_per_evidence: metrics.responseTimePerEvidence,
            listening_skill_progression: metrics.listeningSkillProgression,
            audio_playback_count: metrics.audioPlaybackCount,
            comprehension_speed: metrics.comprehensionSpeed,
            contextual_understanding: metrics.contextualUnderstanding
          }
        }
      };

      const { data, error } = await this.supabase
        .from('assessment_skill_breakdown')
        .insert(skillBreakdown)
        .select('id')
        .single();

      if (error) {
        console.error('Error tracking listening skills:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in trackListeningSkills:', error);
      return null;
    }
  }

  // Track reading assessment skills
  async trackReadingSkills(
    studentId: string,
    assessmentId: string,
    assessmentType: string,
    language: string,
    metrics: ReadingSkillMetrics,
    totalQuestions: number,
    correctAnswers: number,
    completionTimeSeconds: number
  ): Promise<string | null> {
    try {
      const skillBreakdown: AssessmentSkillBreakdown = {
        student_id: studentId,
        assessment_id: assessmentId,
        assessment_type: assessmentType,
        language: language,
        reading_score: metrics.textComprehensionAccuracy,
        text_comprehension: metrics.textComprehensionAccuracy,
        inference_ability: metrics.inferenceAbility,
        vocabulary_comprehension: metrics.vocabularyInContext,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        completion_time_seconds: completionTimeSeconds,
        skill_data: {
          reading_metrics: {
            text_comprehension_accuracy: metrics.textComprehensionAccuracy,
            inference_ability: metrics.inferenceAbility,
            vocabulary_in_context: metrics.vocabularyInContext,
            reading_speed: metrics.readingSpeed,
            detail_retention: metrics.detailRetention,
            critical_analysis: metrics.criticalAnalysis
          }
        }
      };

      const { data, error } = await this.supabase
        .from('assessment_skill_breakdown')
        .insert(skillBreakdown)
        .select('id')
        .single();

      if (error) {
        console.error('Error tracking reading skills:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in trackReadingSkills:', error);
      return null;
    }
  }

  // Track writing assessment skills
  async trackWritingSkills(
    studentId: string,
    assessmentId: string,
    assessmentType: string,
    language: string,
    metrics: WritingSkillMetrics,
    totalQuestions: number,
    correctAnswers: number,
    completionTimeSeconds: number
  ): Promise<string | null> {
    try {
      const skillBreakdown: AssessmentSkillBreakdown = {
        student_id: studentId,
        assessment_id: assessmentId,
        assessment_type: assessmentType,
        language: language,
        writing_score: metrics.grammarAccuracy,
        grammar_accuracy: metrics.grammarAccuracy,
        vocabulary_comprehension: metrics.vocabularyUsage,
        structural_coherence: metrics.structuralCoherence,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        completion_time_seconds: completionTimeSeconds,
        skill_data: {
          writing_metrics: {
            grammar_accuracy: metrics.grammarAccuracy,
            vocabulary_usage: metrics.vocabularyUsage,
            structural_coherence: metrics.structuralCoherence,
            creativity_score: metrics.creativityScore,
            word_count_accuracy: metrics.wordCountAccuracy,
            task_completion: metrics.taskCompletion
          }
        }
      };

      const { data, error } = await this.supabase
        .from('assessment_skill_breakdown')
        .insert(skillBreakdown)
        .select('id')
        .single();

      if (error) {
        console.error('Error tracking writing skills:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in trackWritingSkills:', error);
      return null;
    }
  }

  // Track speaking assessment skills
  async trackSpeakingSkills(
    studentId: string,
    assessmentId: string,
    assessmentType: string,
    language: string,
    metrics: SpeakingSkillMetrics,
    totalQuestions: number,
    correctAnswers: number,
    completionTimeSeconds: number
  ): Promise<string | null> {
    try {
      const skillBreakdown: AssessmentSkillBreakdown = {
        student_id: studentId,
        assessment_id: assessmentId,
        assessment_type: assessmentType,
        language: language,
        speaking_score: metrics.fluencyScore,
        pronunciation_accuracy: metrics.pronunciationAccuracy,
        fluency_score: metrics.fluencyScore,
        grammar_accuracy: metrics.grammarInSpeech,
        vocabulary_comprehension: metrics.vocabularyRange,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        completion_time_seconds: completionTimeSeconds,
        skill_data: {
          speaking_metrics: {
            pronunciation_accuracy: metrics.pronunciationAccuracy,
            fluency_score: metrics.fluencyScore,
            conversational_competence: metrics.conversationalCompetence,
            vocabulary_range: metrics.vocabularyRange,
            grammar_in_speech: metrics.grammarInSpeech,
            confidence_level: metrics.confidenceLevel
          }
        }
      };

      const { data, error } = await this.supabase
        .from('assessment_skill_breakdown')
        .insert(skillBreakdown)
        .select('id')
        .single();

      if (error) {
        console.error('Error tracking speaking skills:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in trackSpeakingSkills:', error);
      return null;
    }
  }

  // Get skill breakdown for a student
  async getStudentSkillBreakdown(
    studentId: string,
    language?: string,
    assessmentType?: string,
    limit: number = 10
  ): Promise<AssessmentSkillBreakdown[]> {
    try {
      let query = this.supabase
        .from('assessment_skill_breakdown')
        .select('*')
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (language) {
        query = query.eq('language', language);
      }

      if (assessmentType) {
        query = query.eq('assessment_type', assessmentType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching student skill breakdown:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStudentSkillBreakdown:', error);
      return [];
    }
  }

  // Get aggregated skill scores for a student
  async getAggregatedSkillScores(
    studentId: string,
    language?: string
  ): Promise<{
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    vocabulary: number;
    grammar: number;
  }> {
    try {
      let query = this.supabase
        .from('assessment_skill_breakdown')
        .select('*')
        .eq('student_id', studentId);

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching aggregated skill scores:', error);
        return {
          listening: 0,
          reading: 0,
          writing: 0,
          speaking: 0,
          vocabulary: 0,
          grammar: 0
        };
      }

      if (!data || data.length === 0) {
        return {
          listening: 0,
          reading: 0,
          writing: 0,
          speaking: 0,
          vocabulary: 0,
          grammar: 0
        };
      }

      // Calculate averages
      const totals = data.reduce((acc, record) => {
        acc.listening += record.listening_score || 0;
        acc.reading += record.reading_score || 0;
        acc.writing += record.writing_score || 0;
        acc.speaking += record.speaking_score || 0;
        acc.vocabulary += record.vocabulary_comprehension || 0;
        acc.grammar += record.grammar_accuracy || 0;
        acc.count += 1;
        return acc;
      }, {
        listening: 0,
        reading: 0,
        writing: 0,
        speaking: 0,
        vocabulary: 0,
        grammar: 0,
        count: 0
      });

      return {
        listening: totals.count > 0 ? totals.listening / totals.count : 0,
        reading: totals.count > 0 ? totals.reading / totals.count : 0,
        writing: totals.count > 0 ? totals.writing / totals.count : 0,
        speaking: totals.count > 0 ? totals.speaking / totals.count : 0,
        vocabulary: totals.count > 0 ? totals.vocabulary / totals.count : 0,
        grammar: totals.count > 0 ? totals.grammar / totals.count : 0
      };
    } catch (error) {
      console.error('Error in getAggregatedSkillScores:', error);
      return {
        listening: 0,
        reading: 0,
        writing: 0,
        speaking: 0,
        vocabulary: 0,
        grammar: 0
      };
    }
  }
}

export const assessmentSkillTrackingService = new AssessmentSkillTrackingService();
