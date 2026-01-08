/**
 * Game Completion Evaluator Service
 * 
 * Evaluates whether an activity (game) within an assignment should be marked as "completed"
 * based on hybrid rules:
 * 
 * Rule A (Exposure + Quality): All words seen at least once AND average accuracy ≥ 70%
 * Rule B (Mastery Sessions): 3+ sessions with ≥ 80% accuracy
 * 
 * For large vocabularies (>50 words), evaluation uses a deterministic sample of 50 words.
 */

import { SupabaseClient } from '@supabase/supabase-js';

// Configuration constants
const COMPLETION_THRESHOLDS = {
    ACCURACY_AVERAGE: 70,        // Minimum average accuracy for Rule A
    ACCURACY_MASTERY: 80,        // Session accuracy threshold for Rule B
    SESSIONS_FOR_MASTERY: 3,     // Number of high-accuracy sessions needed
    MAX_SAMPLE_SIZE: 50,         // Maximum words to evaluate when vocabulary is large
};

export interface CompletionEvaluationResult {
    gameId: string;
    assignmentId: string;
    studentId: string;

    // Completion status
    isCompleted: boolean;
    completedVia: 'rule_a' | 'rule_b' | 'not_completed';

    // Rule A metrics
    wordsExposed: number;
    totalWords: number;
    exposurePercentage: number;
    averageAccuracy: number;
    ruleAMet: boolean;

    // Rule B metrics
    highAccuracySessions: number;
    totalSessions: number;
    ruleBMet: boolean;

    // Sampling info
    isSampled: boolean;
    sampleSize: number;

    // Timestamps
    evaluatedAt: Date;
}

export class GameCompletionEvaluator {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Evaluate whether a game activity within an assignment should be marked as completed
     */
    async evaluateCompletion(
        assignmentId: string,
        studentId: string,
        gameId: string
    ): Promise<CompletionEvaluationResult> {
        console.log(`🎯 [COMPLETION] Evaluating completion for ${gameId}:`, { assignmentId, studentId });

        // Get assignment vocabulary info
        const vocabularyInfo = await this.getAssignmentVocabulary(assignmentId);
        const { vocabularyIds, totalWords } = vocabularyInfo;

        // Determine if we need to sample
        const shouldSample = totalWords > COMPLETION_THRESHOLDS.MAX_SAMPLE_SIZE;
        const sampleSize = shouldSample ? COMPLETION_THRESHOLDS.MAX_SAMPLE_SIZE : totalWords;
        const evaluationVocabIds = shouldSample
            ? this.getDeterministicSample(vocabularyIds, sampleSize, assignmentId, studentId)
            : vocabularyIds;

        // Evaluate Rule A: Exposure + Quality
        const ruleAResult = await this.evaluateRuleA(
            assignmentId,
            studentId,
            gameId,
            evaluationVocabIds
        );

        // Evaluate Rule B: Mastery Sessions
        const ruleBResult = await this.evaluateRuleB(assignmentId, studentId, gameId);

        // Determine completion status
        const isCompleted = ruleAResult.met || ruleBResult.met;
        let completedVia: 'rule_a' | 'rule_b' | 'not_completed' = 'not_completed';

        if (ruleAResult.met) {
            completedVia = 'rule_a';
        } else if (ruleBResult.met) {
            completedVia = 'rule_b';
        }

        const result: CompletionEvaluationResult = {
            gameId,
            assignmentId,
            studentId,
            isCompleted,
            completedVia,
            wordsExposed: ruleAResult.wordsExposed,
            totalWords: sampleSize,
            exposurePercentage: Math.round((ruleAResult.wordsExposed / sampleSize) * 100),
            averageAccuracy: ruleAResult.averageAccuracy,
            ruleAMet: ruleAResult.met,
            highAccuracySessions: ruleBResult.highAccuracySessions,
            totalSessions: ruleBResult.totalSessions,
            ruleBMet: ruleBResult.met,
            isSampled: shouldSample,
            sampleSize,
            evaluatedAt: new Date(),
        };

        console.log(`🎯 [COMPLETION] Result for ${gameId}:`, {
            isCompleted,
            completedVia,
            ruleA: { met: ruleAResult.met, accuracy: ruleAResult.averageAccuracy, exposed: ruleAResult.wordsExposed },
            ruleB: { met: ruleBResult.met, sessions: ruleBResult.highAccuracySessions },
        });

        return result;
    }

    /**
     * Evaluate and persist completion status to the database
     */
    async evaluateAndPersist(
        assignmentId: string,
        studentId: string,
        gameId: string
    ): Promise<CompletionEvaluationResult> {
        const result = await this.evaluateCompletion(assignmentId, studentId, gameId);

        if (result.isCompleted) {
            await this.markGameCompleted(assignmentId, studentId, gameId, result);
        } else {
            await this.updateGameProgress(assignmentId, studentId, gameId, result);
        }

        return result;
    }

    /**
     * Rule A: All words seen at least once AND average accuracy ≥ 70%
     */
    private async evaluateRuleA(
        assignmentId: string,
        studentId: string,
        gameId: string,
        vocabularyIds: string[]
    ): Promise<{ met: boolean; wordsExposed: number; averageAccuracy: number }> {
        if (vocabularyIds.length === 0) {
            return { met: false, wordsExposed: 0, averageAccuracy: 0 };
        }

        // Get word exposure and accuracy data from vocabulary_gem_collection
        const { data: gemData, error } = await this.supabase
            .from('vocabulary_gem_collection')
            .select('centralized_vocabulary_id, total_encounters, correct_encounters')
            .eq('student_id', studentId)
            .in('centralized_vocabulary_id', vocabularyIds);

        if (error) {
            console.error('Error fetching gem collection data:', error);
            return { met: false, wordsExposed: 0, averageAccuracy: 0 };
        }

        // Also check assignment_word_exposure for words that might not be in gem_collection yet
        const { data: exposureData } = await this.supabase
            .from('assignment_word_exposure')
            .select('centralized_vocabulary_id')
            .eq('assignment_id', assignmentId)
            .eq('student_id', studentId)
            .in('centralized_vocabulary_id', vocabularyIds);

        // Combine exposed words from both sources
        const exposedWordIds = new Set<string>();

        // From gem collection (words that have been practiced)
        gemData?.forEach(item => {
            if (item.total_encounters > 0) {
                exposedWordIds.add(item.centralized_vocabulary_id);
            }
        });

        // From exposure table (words that have been shown)
        exposureData?.forEach(item => {
            exposedWordIds.add(item.centralized_vocabulary_id);
        });

        const wordsExposed = exposedWordIds.size;
        const allWordsExposed = wordsExposed >= vocabularyIds.length;

        // Calculate average accuracy from words that have been attempted
        let totalCorrect = 0;
        let totalAttempts = 0;

        gemData?.forEach(item => {
            if (item.total_encounters > 0) {
                totalCorrect += item.correct_encounters || 0;
                totalAttempts += item.total_encounters || 0;
            }
        });

        const averageAccuracy = totalAttempts > 0
            ? Math.round((totalCorrect / totalAttempts) * 100)
            : 0;

        const accuracyMet = averageAccuracy >= COMPLETION_THRESHOLDS.ACCURACY_AVERAGE;
        const met = allWordsExposed && accuracyMet;

        console.log(`📊 [RULE A] Evaluation:`, {
            wordsExposed,
            totalWords: vocabularyIds.length,
            allWordsExposed,
            averageAccuracy,
            accuracyMet,
            met
        });

        return { met, wordsExposed, averageAccuracy };
    }

    /**
     * Rule B: 3+ sessions with ≥ 80% accuracy
     */
    private async evaluateRuleB(
        assignmentId: string,
        studentId: string,
        gameId: string
    ): Promise<{ met: boolean; highAccuracySessions: number; totalSessions: number }> {
        // Get all sessions for this game
        const { data: sessions, error } = await this.supabase
            .from('enhanced_game_sessions')
            .select('id, accuracy_percentage, words_attempted')
            .eq('assignment_id', assignmentId)
            .eq('student_id', studentId)
            .eq('game_type', gameId)
            .gte('words_attempted', 3); // Only count sessions with meaningful activity

        if (error) {
            console.error('Error fetching sessions:', error);
            return { met: false, highAccuracySessions: 0, totalSessions: 0 };
        }

        const totalSessions = sessions?.length || 0;
        const highAccuracySessions = sessions?.filter(
            s => (s.accuracy_percentage || 0) >= COMPLETION_THRESHOLDS.ACCURACY_MASTERY
        ).length || 0;

        const met = highAccuracySessions >= COMPLETION_THRESHOLDS.SESSIONS_FOR_MASTERY;

        console.log(`📊 [RULE B] Evaluation:`, {
            totalSessions,
            highAccuracySessions,
            threshold: COMPLETION_THRESHOLDS.SESSIONS_FOR_MASTERY,
            met
        });

        return { met, highAccuracySessions, totalSessions };
    }

    /**
     * Get vocabulary IDs for an assignment
     */
    private async getAssignmentVocabulary(
        assignmentId: string
    ): Promise<{ vocabularyIds: string[]; totalWords: number }> {
        // Try to get vocabulary from assignment_vocabulary table first
        const { data: assignmentVocab, error: vocabError } = await this.supabase
            .from('assignment_vocabulary')
            .select('vocabulary_id')
            .eq('assignment_id', assignmentId);

        if (!vocabError && assignmentVocab && assignmentVocab.length > 0) {
            const vocabularyIds = assignmentVocab.map(v => v.vocabulary_id);
            return { vocabularyIds, totalWords: vocabularyIds.length };
        }

        // Fallback: get vocabulary from word lists linked to assignment
        const { data: assignment } = await this.supabase
            .from('assignments')
            .select('wordlist_id, vocabulary_count')
            .eq('id', assignmentId)
            .single();

        if (assignment?.wordlist_id) {
            const { data: listItems } = await this.supabase
                .from('vocabulary_list_items')
                .select('centralized_vocabulary_id')
                .eq('list_id', assignment.wordlist_id);

            if (listItems && listItems.length > 0) {
                const vocabularyIds = listItems.map(v => v.centralized_vocabulary_id);
                return { vocabularyIds, totalWords: vocabularyIds.length };
            }
        }

        // Final fallback: return an empty list with the configured count
        const totalWords = assignment?.vocabulary_count || 50;
        return { vocabularyIds: [], totalWords };
    }

    /**
     * Get a deterministic random sample of vocabulary IDs
     * Uses a seeded shuffle based on assignment and student ID for consistency
     */
    private getDeterministicSample(
        vocabularyIds: string[],
        sampleSize: number,
        assignmentId: string,
        studentId: string
    ): string[] {
        if (vocabularyIds.length <= sampleSize) {
            return vocabularyIds;
        }

        // Create a deterministic seed from assignment and student IDs
        const seed = this.hashString(`${assignmentId}-${studentId}`);

        // Seeded shuffle (Fisher-Yates with seeded random)
        const shuffled = [...vocabularyIds];
        let random = seed;

        for (let i = shuffled.length - 1; i > 0; i--) {
            // Simple LCG-based pseudo-random number generator
            random = (random * 1103515245 + 12345) & 0x7fffffff;
            const j = random % (i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, sampleSize);
    }

    /**
     * Simple hash function for string to number
     */
    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Mark a game as completed in the database
     */
    private async markGameCompleted(
        assignmentId: string,
        studentId: string,
        gameId: string,
        result: CompletionEvaluationResult
    ): Promise<void> {
        const { error } = await this.supabase
            .from('assignment_game_progress')
            .upsert({
                assignment_id: assignmentId,
                student_id: studentId,
                game_id: gameId,
                status: 'completed',
                completed_at: new Date().toISOString(),
                score: result.averageAccuracy,
                accuracy: result.averageAccuracy,
                completion_details: {
                    completedVia: result.completedVia,
                    wordsExposed: result.wordsExposed,
                    totalWords: result.totalWords,
                    highAccuracySessions: result.highAccuracySessions,
                    isSampled: result.isSampled,
                    sampleSize: result.sampleSize,
                },
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'assignment_id,student_id,game_id'
            });

        if (error) {
            console.error('Error marking game as completed:', error);
        } else {
            console.log(`✅ [COMPLETION] Game ${gameId} marked as COMPLETED for student ${studentId}`);
        }
    }

    /**
     * Update game progress (when not yet completed)
     */
    private async updateGameProgress(
        assignmentId: string,
        studentId: string,
        gameId: string,
        result: CompletionEvaluationResult
    ): Promise<void> {
        const status = result.wordsExposed > 0 || result.totalSessions > 0
            ? 'in_progress'
            : 'not_started';

        const { error } = await this.supabase
            .from('assignment_game_progress')
            .upsert({
                assignment_id: assignmentId,
                student_id: studentId,
                game_id: gameId,
                status,
                score: result.averageAccuracy,
                accuracy: result.averageAccuracy,
                completion_details: {
                    wordsExposed: result.wordsExposed,
                    totalWords: result.totalWords,
                    exposurePercentage: result.exposurePercentage,
                    highAccuracySessions: result.highAccuracySessions,
                    isSampled: result.isSampled,
                },
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'assignment_id,student_id,game_id'
            });

        if (error) {
            console.error('Error updating game progress:', error);
        }
    }
}
