/**
 * AssignmentExposureService
 * 
 * Manages Layer 2: Assignment Progress (Exposure-Based Completion)
 * 
 * This service tracks unique word exposures per student per assignment.
 * Assignment completion is based on exposure (seeing each word at least once),
 * NOT mastery (80%+ accuracy over 3+ encounters).
 * 
 * Key Concepts:
 * - Exposure: Student has seen the word at least once in this assignment
 * - Progress: (unique words exposed / total words) × 100
 * - Completion: Progress reaches 100%
 * 
 * @see ASSIGNMENT_EXPOSURE_ARCHITECTURE.md for full documentation
 */

import { createBrowserClient } from '../../lib/supabase-client';

export interface WordExposure {
  id: string;
  assignment_id: string;
  student_id: string;
  centralized_vocabulary_id: string;
  first_exposed_at: string;
  exposure_count: number;
  last_exposed_at: string;
}

export interface AssignmentProgress {
  totalWords: number;
  exposedWords: number;
  unexposedWords: number;
  progress: number; // 0-100
  isComplete: boolean;
  exposedWordIds: string[];
  unexposedWordIds: string[];
}

export class AssignmentExposureService {
  private supabase = createBrowserClient();

  /**
   * Record word exposures for a student in an assignment
   * 
   * This is called at the end of each game session to record which words
   * the student was exposed to during that session.
   * 
   * Uses UPSERT to increment exposure_count if word was already exposed.
   * 
   * @param assignmentId - The assignment ID
   * @param studentId - The student's user ID
   * @param exposedWordIds - Array of centralized_vocabulary_id values shown in this session
   */
  async recordWordExposures(
    assignmentId: string,
    studentId: string,
    exposedWordIds: string[]
  ): Promise<{ success: boolean; error?: string }> {
    const callId = Math.random().toString(36).substring(7);
    console.log(`📝 [EXPOSURE SERVICE] Recording exposures [${callId}]:`, {
      assignmentId,
      studentId,
      wordCount: exposedWordIds.length,
      wordIds: exposedWordIds
    });

    try {
      // Use upsert to handle both new exposures and updates
      const records = exposedWordIds.map(wordId => ({
        assignment_id: assignmentId,
        student_id: studentId,
        centralized_vocabulary_id: wordId,
        last_exposed_at: new Date().toISOString()
      }));

      const { data, error } = await this.supabase
        .from('assignment_word_exposure')
        .upsert(records, {
          onConflict: 'assignment_id,student_id,centralized_vocabulary_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error(`❌ [EXPOSURE SERVICE] Failed to record exposures [${callId}]:`, error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [EXPOSURE SERVICE] Recorded ${exposedWordIds.length} exposures [${callId}]`);
      return { success: true };
    } catch (error) {
      console.error(`❌ [EXPOSURE SERVICE] Exception recording exposures [${callId}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get assignment progress for a student
   * 
   * Calculates:
   * - Total words in assignment
   * - Number of words exposed
   * - Progress percentage
   * - Completion status
   * - Lists of exposed and unexposed word IDs
   * 
   * @param assignmentId - The assignment ID
   * @param studentId - The student's user ID
   */
  async getAssignmentProgress(
    assignmentId: string,
    studentId: string
  ): Promise<AssignmentProgress | null> {
    const callId = Math.random().toString(36).substring(7);
    console.log(`📊 [EXPOSURE SERVICE] Getting progress [${callId}]:`, {
      assignmentId,
      studentId
    });

    try {
      // Get assignment details
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select('vocabulary_count, vocabulary_assignment_list_id')
        .eq('id', assignmentId)
        .single();

      if (assignmentError || !assignment) {
        console.error(`❌ [EXPOSURE SERVICE] Assignment not found [${callId}]:`, assignmentError);
        return null;
      }

      // Try to get actual vocabulary count from the assignment list (most accurate)
      let totalWords = assignment.vocabulary_count || 10;

      if (assignment.vocabulary_assignment_list_id) {
        const { count, error: countError } = await this.supabase
          .from('vocabulary_assignment_items')
          .select('*', { count: 'exact', head: true })
          .eq('assignment_list_id', assignment.vocabulary_assignment_list_id);

        if (!countError && count !== null && count > 0) {
          totalWords = count;
          console.log(`📊 [EXPOSURE SERVICE] Using actual vocabulary count: ${totalWords} [${callId}]`);
        }
      }

      // Get exposed words for this student
      const { data: exposures, error: exposuresError } = await this.supabase
        .from('assignment_word_exposure')
        .select('centralized_vocabulary_id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (exposuresError) {
        console.error(`❌ [EXPOSURE SERVICE] Failed to get exposures [${callId}]:`, exposuresError);
        return null;
      }

      let exposedWordIds = (exposures || []).map(e => e.centralized_vocabulary_id);
      let exposedWords = exposedWordIds.length;

      // 🔧 SELF-REPAIR: If 0 exposures but we might have history (legacy data fix)
      if (exposedWords === 0 && studentId && assignmentId) {
        try {
          exposedWordIds = await this.attemptExposureRepair(assignmentId, studentId, exposedWordIds);
          exposedWords = exposedWordIds.length;
        } catch (repairError) {
          console.warn(`⚠️ [EXPOSURE SERVICE] Repair attempt failed [${callId}]:`, repairError);
        }
      }
      const unexposedWords = totalWords - exposedWords;
      const progress = totalWords > 0 ? (exposedWords / totalWords) * 100 : 0;
      const isComplete = progress >= 100;

      const result: AssignmentProgress = {
        totalWords,
        exposedWords,
        unexposedWords,
        progress,
        isComplete,
        exposedWordIds,
        unexposedWordIds: [] // We don't track unexposed word IDs anymore
      };

      console.log(`📊 [EXPOSURE SERVICE] Progress calculated [${callId}]:`, {
        totalWords,
        exposedWords,
        unexposedWords,
        progress: `${progress.toFixed(1)}%`,
        isComplete
      });

      return result;
    } catch (error) {
      console.error(`❌ [EXPOSURE SERVICE] Exception getting progress [${callId}]:`, error);
      return null;
    }
  }

  /**
   * Get unexposed words for a student in an assignment
   * 
   * Returns the list of words that the student has NOT yet been exposed to.
   * This is used by games to select which words to show.
   * 
   * @param assignmentId - The assignment ID
   * @param studentId - The student's user ID
   * @returns Array of unexposed word IDs, or null if error
   */
  async getUnexposedWords(
    assignmentId: string,
    studentId: string
  ): Promise<string[] | null> {
    const progress = await this.getAssignmentProgress(assignmentId, studentId);

    if (!progress) {
      return null;
    }

    return progress.unexposedWordIds;
  }

  /**
   * Check if an assignment is complete for a student
   * 
   * @param assignmentId - The assignment ID
   * @param studentId - The student's user ID
   * @returns true if 100% of words have been exposed, false otherwise
   */
  async isAssignmentComplete(
    assignmentId: string,
    studentId: string
  ): Promise<boolean> {
    const progress = await this.getAssignmentProgress(assignmentId, studentId);
    return progress?.isComplete ?? false;
  }

  /**
   * Get detailed exposure data for all words in an assignment
   * 
   * This is useful for teacher dashboards to see which words
   * students have been exposed to and how many times.
   * 
   * @param assignmentId - The assignment ID
   * @param studentId - The student's user ID
   */
  async getDetailedExposures(
    assignmentId: string,
    studentId: string
  ): Promise<WordExposure[] | null> {
    try {
      const { data, error } = await this.supabase
        .from('assignment_word_exposure')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .order('last_exposed_at', { ascending: false });

      if (error) {
        console.error('❌ [EXPOSURE SERVICE] Failed to get detailed exposures:', error);
        return null;
      }

      return data as WordExposure[];
    } catch (error) {
      console.error('❌ [EXPOSURE SERVICE] Exception getting detailed exposures:', error);
      return null;
    }
  }

  /**
   * Reset exposure tracking for a student in an assignment
   * 
   * WARNING: This deletes all exposure records for the student in this assignment.
   * Only use this for testing or if a teacher explicitly requests a reset.
   * 
   * @param assignmentId - The assignment ID
   * @param studentId - The student's user ID
   */
  async resetExposures(
    assignmentId: string,
    studentId: string
  ): Promise<{ success: boolean; error?: string }> {
    console.warn('⚠️ [EXPOSURE SERVICE] Resetting exposures:', { assignmentId, studentId });

    try {
      const { error } = await this.supabase
        .from('assignment_word_exposure')
        .delete()
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (error) {
        console.error('❌ [EXPOSURE SERVICE] Failed to reset exposures:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ [EXPOSURE SERVICE] Exposures reset successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ [EXPOSURE SERVICE] Exception resetting exposures:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Attempt to repair missing exposures by scanning session history
   * This handles cases where VocabMaster games didn't record exposures properly
   */
  private async attemptExposureRepair(
    assignmentId: string,
    studentId: string,
    currentExposedIds: string[]
  ): Promise<string[]> {
    // 1. Check if user has ANY progress using the old metric
    const { count } = await this.supabase
      .from('assignment_game_progress')
      .select('*', { count: 'exact', head: true })
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .gt('score', 0);

    if (!count || count === 0) return currentExposedIds;

    console.log(`🔧 [EXPOSURE SERVICE] Detected missing exposures for active student. Attempting repair for ${assignmentId}...`);

    // 2. Fetch assignment vocabulary (to map words -> IDs)
    const { data: assignment } = await this.supabase
      .from('assignments')
      .select('vocabulary_assignment_list_id')
      .eq('id', assignmentId)
      .single();

    if (!assignment?.vocabulary_assignment_list_id) return currentExposedIds;

    const { data: vocabItems } = await this.supabase
      .from('vocabulary_assignment_items')
      .select('centralized_vocabulary_id')
      .eq('assignment_list_id', assignment.vocabulary_assignment_list_id);

    if (!vocabItems || vocabItems.length === 0) return currentExposedIds;

    const vocabIds = vocabItems
      .map(item => item.centralized_vocabulary_id)
      .filter(id => id); // Filter nulls

    if (vocabIds.length === 0) return currentExposedIds;

    // Fetch actual words to map back from session strings
    const { data: vocabDetails } = await this.supabase
      .from('centralized_vocabulary')
      .select('id, word, translation')
      .in('id', vocabIds);

    if (!vocabDetails) return currentExposedIds;

    const wordToIdMap = new Map<string, string>();
    vocabDetails.forEach(item => {
      // Map both Spanish and English words to the ID for robustness
      if (item.word) wordToIdMap.set(item.word.toLowerCase().trim(), item.id);
      if (item.translation) wordToIdMap.set(item.translation.toLowerCase().trim(), item.id);
    });

    // 3. Fetch session history to find learned words
    const { data: sessions } = await this.supabase
      .from('assignment_session_history')
      .select('session_data')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId);

    if (!sessions) return currentExposedIds;

    const recoveredIds = new Set<string>(currentExposedIds);
    let recoveredCount = 0;

    sessions.forEach(session => {
      const data = session.session_data;
      if (data?.wordsLearned && Array.isArray(data.wordsLearned)) {
        data.wordsLearned.forEach((w: any) => {
          if (typeof w === 'string') {
            const id = wordToIdMap.get(w.toLowerCase().trim());
            if (id) {
              recoveredIds.add(id);
              recoveredCount++;
            }
          }
        });
      }
    });

    if (recoveredIds.size > currentExposedIds.length) {
      console.log(`🔧 [EXPOSURE SERVICE] Recovered ${recoveredIds.size - currentExposedIds.length} unique words from history.`);
      const idsToSave = Array.from(recoveredIds);

      // Save recovered exposures
      await this.recordWordExposures(assignmentId, studentId, idsToSave);
      return idsToSave;
    }

    return currentExposedIds;
  }
}

// Export singleton instance
export const assignmentExposureService = new AssignmentExposureService();

