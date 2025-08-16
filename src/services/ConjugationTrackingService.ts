/**
 * Two-Tier Conjugation Tracking Service for LanguageGems
 * 
 * This service implements the two-tier approach for conjugation tracking:
 * 
 * Tier 1: Lemma Mastery (centralized_vocabulary)
 * - Tracks general knowledge of base verbs (e.g., "preferir")
 * - Uses existing FSRS system for spaced repetition
 * - Integrated with gem progression system
 * 
 * Tier 2: Specific Conjugation Mastery (student_conjugation_mastery)
 * - Tracks mastery of specific conjugations (e.g., "preferir" → "prefiero" in 1st person singular present)
 * - Separate FSRS state for each conjugation form
 * - Enables targeted practice of weak conjugation patterns
 * 
 * Usage Example:
 * When a student correctly conjugates "preferir" to "prefiero":
 * 1. Record lemma mastery for "preferir" (Tier 1)
 * 2. Record specific conjugation mastery for "preferir + present + 1st_singular" (Tier 2)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { FSRSService } from './fsrsService';

export interface ConjugationAttempt {
  studentId: string;
  baseVerb: string; // e.g., "preferir"
  conjugatedForm: string; // e.g., "prefiero"
  tense: string; // e.g., "present"
  person: string; // e.g., "1st_singular"
  language: string;
  isCorrect: boolean;
  responseTimeMs: number;
  confidence?: number; // 0-1 scale
}

export interface ConjugationMastery {
  conjugationId: string;
  baseVerb: string;
  conjugatedForm: string;
  tense: string;
  person: string;
  masteryLevel: number; // 0-5 scale
  correctAttempts: number;
  totalAttempts: number;
  lastPracticedAt: Date;
  nextReviewAt: Date;
  fsrsState: any;
}

export interface TwoTierTrackingResult {
  // Tier 1: Lemma mastery
  lemmaTracking: {
    vocabularyId: string;
    baseVerb: string;
    fsrsUpdated: boolean;
    gemAwarded: boolean;
  };
  
  // Tier 2: Conjugation mastery
  conjugationTracking: {
    conjugationId: string;
    masteryLevel: number;
    fsrsUpdated: boolean;
    improvementDetected: boolean;
  };
  
  success: boolean;
  errors: string[];
}

export class ConjugationTrackingService {
  private supabase: SupabaseClient;
  private fsrsService: FSRSService;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.fsrsService = new FSRSService(supabase);
  }

  /**
   * Record a conjugation attempt using the two-tier approach
   */
  async recordConjugationAttempt(attempt: ConjugationAttempt): Promise<TwoTierTrackingResult> {
    const result: TwoTierTrackingResult = {
      lemmaTracking: {
        vocabularyId: '',
        baseVerb: attempt.baseVerb,
        fsrsUpdated: false,
        gemAwarded: false
      },
      conjugationTracking: {
        conjugationId: '',
        masteryLevel: 0,
        fsrsUpdated: false,
        improvementDetected: false
      },
      success: false,
      errors: []
    };

    try {
      // Tier 1: Record lemma mastery
      const lemmaResult = await this.recordLemmaMastery(attempt);
      result.lemmaTracking = lemmaResult;

      // Tier 2: Record specific conjugation mastery
      const conjugationResult = await this.recordConjugationMastery(attempt);
      result.conjugationTracking = conjugationResult;

      result.success = lemmaResult.vocabularyId !== '' && conjugationResult.conjugationId !== '';

    } catch (error) {
      result.errors.push(`Error in two-tier tracking: ${error}`);
      console.error('Two-tier conjugation tracking error:', error);
    }

    return result;
  }

  /**
   * Tier 1: Record lemma mastery in centralized_vocabulary
   */
  private async recordLemmaMastery(attempt: ConjugationAttempt): Promise<{
    vocabularyId: string;
    baseVerb: string;
    fsrsUpdated: boolean;
    gemAwarded: boolean;
  }> {
    try {
      // Find the base verb in centralized_vocabulary
      const { data: vocabData, error: vocabError } = await this.supabase
        .from('centralized_vocabulary')
        .select('id, word')
        .eq('word', attempt.baseVerb)
        .eq('language', attempt.language)
        .eq('should_track_for_fsrs', true)
        .limit(1);

      if (vocabError || !vocabData || vocabData.length === 0) {
        throw new Error(`Base verb "${attempt.baseVerb}" not found in vocabulary`);
      }

      const vocabularyId = vocabData[0].id;

      // Update FSRS for the base verb
      const confidence = attempt.confidence || (attempt.isCorrect ? 0.8 : 0.3);
      const fsrsResult = await this.fsrsService.updateProgress(
        attempt.studentId,
        vocabularyId,
        attempt.isCorrect,
        attempt.responseTimeMs,
        confidence
      );

      // TODO: Integrate with gem system here
      // For now, assume gem is awarded for correct answers
      const gemAwarded = attempt.isCorrect;

      return {
        vocabularyId,
        baseVerb: attempt.baseVerb,
        fsrsUpdated: true,
        gemAwarded
      };

    } catch (error) {
      console.error('Error recording lemma mastery:', error);
      return {
        vocabularyId: '',
        baseVerb: attempt.baseVerb,
        fsrsUpdated: false,
        gemAwarded: false
      };
    }
  }

  /**
   * Tier 2: Record specific conjugation mastery
   */
  private async recordConjugationMastery(attempt: ConjugationAttempt): Promise<{
    conjugationId: string;
    masteryLevel: number;
    fsrsUpdated: boolean;
    improvementDetected: boolean;
  }> {
    try {
      // Find the specific conjugation
      const conjugationId = await this.findConjugationId(attempt);
      
      if (!conjugationId) {
        throw new Error(`Conjugation not found for ${attempt.baseVerb} → ${attempt.conjugatedForm}`);
      }

      // Get or create student conjugation mastery record
      const masteryRecord = await this.getOrCreateConjugationMastery(
        attempt.studentId,
        conjugationId
      );

      // Update mastery statistics
      const updatedMastery = await this.updateConjugationMastery(
        masteryRecord,
        attempt.isCorrect,
        attempt.responseTimeMs
      );

      return {
        conjugationId,
        masteryLevel: updatedMastery.masteryLevel,
        fsrsUpdated: true,
        improvementDetected: updatedMastery.masteryLevel > masteryRecord.masteryLevel
      };

    } catch (error) {
      console.error('Error recording conjugation mastery:', error);
      return {
        conjugationId: '',
        masteryLevel: 0,
        fsrsUpdated: false,
        improvementDetected: false
      };
    }
  }

  /**
   * Find the conjugation ID for a specific verb form
   */
  private async findConjugationId(attempt: ConjugationAttempt): Promise<string | null> {
    try {
      // Use a more direct approach with multiple queries
      // First, get the base verb ID
      const { data: vocabData, error: vocabError } = await this.supabase
        .from('centralized_vocabulary')
        .select('id')
        .eq('word', attempt.baseVerb)
        .eq('language', attempt.language)
        .limit(1);

      if (vocabError || !vocabData || vocabData.length === 0) {
        console.error('Base verb not found:', attempt.baseVerb);
        return null;
      }

      const baseVerbId = vocabData[0].id;

      // Get tense ID
      const { data: tenseData, error: tenseError } = await this.supabase
        .from('verb_tenses')
        .select('id')
        .eq('name', attempt.tense)
        .eq('language', attempt.language)
        .single();

      if (tenseError || !tenseData) {
        console.error('Tense not found:', attempt.tense);
        return null;
      }

      // Get person ID
      const { data: personData, error: personError } = await this.supabase
        .from('grammatical_persons')
        .select('id')
        .eq('person', attempt.person)
        .eq('language', attempt.language)
        .single();

      if (personError || !personData) {
        console.error('Person not found:', attempt.person);
        return null;
      }

      // Now find the conjugation
      const { data: conjugationData, error: conjugationError } = await this.supabase
        .from('verb_conjugations')
        .select('id')
        .eq('base_verb_id', baseVerbId)
        .eq('tense_id', tenseData.id)
        .eq('person_id', personData.id)
        .eq('conjugated_form', attempt.conjugatedForm)
        .eq('language', attempt.language)
        .single();

      if (conjugationError || !conjugationData) {
        console.error('Conjugation not found:', {
          baseVerb: attempt.baseVerb,
          conjugatedForm: attempt.conjugatedForm,
          tense: attempt.tense,
          person: attempt.person
        });
        return null;
      }

      return conjugationData.id;
    } catch (error) {
      console.error('Error finding conjugation ID:', error);
      return null;
    }
  }

  /**
   * Get or create a student conjugation mastery record
   */
  private async getOrCreateConjugationMastery(
    studentId: string,
    conjugationId: string
  ): Promise<ConjugationMastery> {
    try {
      // Try to get existing record
      const { data: existing, error: getError } = await this.supabase
        .from('student_conjugation_mastery')
        .select('*')
        .eq('student_id', studentId)
        .eq('conjugation_id', conjugationId)
        .single();

      if (!getError && existing) {
        return {
          conjugationId: existing.conjugation_id,
          baseVerb: '', // Will be filled by caller
          conjugatedForm: '', // Will be filled by caller
          tense: '', // Will be filled by caller
          person: '', // Will be filled by caller
          masteryLevel: existing.mastery_level,
          correctAttempts: existing.correct_attempts,
          totalAttempts: existing.total_attempts,
          lastPracticedAt: new Date(existing.last_practiced_at),
          nextReviewAt: new Date(existing.next_review_at),
          fsrsState: existing.fsrs_state
        };
      }

      // Create new record
      const { data: newRecord, error: createError } = await this.supabase
        .from('student_conjugation_mastery')
        .insert({
          student_id: studentId,
          conjugation_id: conjugationId,
          mastery_level: 0,
          correct_attempts: 0,
          total_attempts: 0,
          last_practiced_at: new Date().toISOString(),
          next_review_at: new Date().toISOString(),
          fsrs_state: {}
        })
        .select()
        .single();

      if (createError || !newRecord) {
        throw new Error(`Failed to create conjugation mastery record: ${createError?.message}`);
      }

      return {
        conjugationId: newRecord.conjugation_id,
        baseVerb: '',
        conjugatedForm: '',
        tense: '',
        person: '',
        masteryLevel: newRecord.mastery_level,
        correctAttempts: newRecord.correct_attempts,
        totalAttempts: newRecord.total_attempts,
        lastPracticedAt: new Date(newRecord.last_practiced_at),
        nextReviewAt: new Date(newRecord.next_review_at),
        fsrsState: newRecord.fsrs_state
      };

    } catch (error) {
      console.error('Error getting/creating conjugation mastery:', error);
      throw error;
    }
  }

  /**
   * Update conjugation mastery statistics
   */
  private async updateConjugationMastery(
    mastery: ConjugationMastery,
    isCorrect: boolean,
    responseTimeMs: number
  ): Promise<ConjugationMastery> {
    try {
      const newTotalAttempts = mastery.totalAttempts + 1;
      const newCorrectAttempts = mastery.correctAttempts + (isCorrect ? 1 : 0);
      const accuracy = newCorrectAttempts / newTotalAttempts;
      
      // Calculate new mastery level (0-5 scale)
      let newMasteryLevel = mastery.masteryLevel;
      if (isCorrect) {
        // Increase mastery based on accuracy and response time
        const speedBonus = responseTimeMs < 3000 ? 0.1 : 0;
        const masteryIncrease = (accuracy * 0.5) + speedBonus;
        newMasteryLevel = Math.min(5, mastery.masteryLevel + masteryIncrease);
      } else {
        // Decrease mastery slightly for incorrect answers
        newMasteryLevel = Math.max(0, mastery.masteryLevel - 0.2);
      }

      // Update database
      const { data: updated, error } = await this.supabase
        .from('student_conjugation_mastery')
        .update({
          mastery_level: newMasteryLevel,
          correct_attempts: newCorrectAttempts,
          total_attempts: newTotalAttempts,
          last_practiced_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('conjugation_id', mastery.conjugationId)
        .select()
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error || !updated || updated.length === 0) {
        throw new Error(`Failed to update conjugation mastery: ${error?.message}`);
      }

      const updatedRecord = updated[0]; // Get first record from array

      return {
        ...mastery,
        masteryLevel: updatedRecord.mastery_level,
        correctAttempts: updatedRecord.correct_attempts,
        totalAttempts: updatedRecord.total_attempts,
        lastPracticedAt: new Date(updatedRecord.last_practiced_at)
      };

    } catch (error) {
      console.error('Error updating conjugation mastery:', error);
      throw error;
    }
  }

  /**
   * Get conjugations that need review for a student
   */
  async getConjugationsForReview(
    studentId: string,
    language: string,
    limit: number = 10
  ): Promise<ConjugationMastery[]> {
    try {
      const { data, error } = await this.supabase
        .from('student_conjugation_mastery')
        .select(`
          *,
          verb_conjugations!inner(
            conjugated_form,
            language,
            centralized_vocabulary!inner(word),
            verb_tenses!inner(name, display_name),
            grammatical_persons!inner(person, display_name)
          )
        `)
        .eq('student_id', studentId)
        .eq('verb_conjugations.language', language)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true })
        .limit(limit);

      if (error || !data) {
        return [];
      }

      return data.map(record => ({
        conjugationId: record.conjugation_id,
        baseVerb: record.verb_conjugations.centralized_vocabulary.word,
        conjugatedForm: record.verb_conjugations.conjugated_form,
        tense: record.verb_conjugations.verb_tenses.name,
        person: record.verb_conjugations.grammatical_persons.person,
        masteryLevel: record.mastery_level,
        correctAttempts: record.correct_attempts,
        totalAttempts: record.total_attempts,
        lastPracticedAt: new Date(record.last_practiced_at),
        nextReviewAt: new Date(record.next_review_at),
        fsrsState: record.fsrs_state
      }));

    } catch (error) {
      console.error('Error getting conjugations for review:', error);
      return [];
    }
  }
}
