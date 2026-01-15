/**
 * Game Completion Service
 * 
 * Handles the logic for marking individual games as "completed" within assignments.
 * 
 * SIMPLIFIED COMPLETION LOGIC:
 * - Each game has a FIXED number of unique correct words required to complete
 * - Thresholds are clamped to the assignment vocabulary count
 * - Assignment completes when 70% of vocabulary is seen across all games
 * 
 * For large vocabularies (>50 words), completion uses a deterministic sample.
 */

import { SupabaseClient } from '@supabase/supabase-js';

// =====================================
// GAME-SPECIFIC COMPLETION THRESHOLDS
// =====================================
// These are the default number of unique correct words needed to complete each game

export const GAME_COMPLETION_THRESHOLDS: Record<string, number> = {
  // Vocabulary Games (shorter duration)
  'memory-game': 12,        // 6 pairs = 12 words
  'memory-match': 12,       // 6 pairs = 12 words
  'hangman': 8,
  'word-scramble': 10,
  'noughts-and-crosses': 9, // 3 games worth
  'word-towers': 10,
  'vocab-blast': 12,
  'word-blast': 10,
  'vocab-master': 15,

  // Sentence/Mixed Games - ALL standardized to 10
  'sentence-towers': 10,     // 10 sentences (standardized)
  'speed-builder': 10,       // 10 sentences (standardized)
  'case-file-translator': 10,
  'lava-temple-word-restore': 10,
  'detective-listening': 10, // Changed from 12 to 10 for consistency
  'conjugation-duel': 10,

  // Default fallback
  'default': 10,
};

// Configuration constants
export const COMPLETION_CONFIG = {
  MAX_SAMPLE_SIZE: 50,              // Maximum words to track for large assignments
  ASSIGNMENT_COVERAGE_PERCENT: 70,  // % of words needed for assignment completion
  MIN_WORDS_FOR_SAMPLING: 50,       // Start sampling above this count
};

export interface GameCompletionStatus {
  gameId: string;
  isComplete: boolean;

  // Progress metrics
  uniqueCorrectWords: number;
  wordsRequired: number;
  progressPercentage: number;

  // Assignment-level metrics
  totalAssignmentWords: number;
  wordsSeenAcrossGames: number;
  assignmentProgress: number;
  isAssignmentComplete: boolean;

  // Sampling info
  isSampled: boolean;
  sampleSize: number;

  // For UI
  message: string;
  showCompletionModal: boolean;
}

export interface AssignmentCompletionInfo {
  totalWords: number;
  sampledWords: number;
  wordsRequired: number;       // 70% of sampled words
  wordsSeen: number;
  progressPercentage: number;
  isComplete: boolean;
  gamesCompleted: number;
  totalGames: number;
  isSampled: boolean;
}

export class GameCompletionService {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Get the completion threshold for a specific game type
   * Clamped to not exceed the assignment vocabulary count
   */
  getGameThreshold(gameId: string, assignmentVocabCount: number): number {
    const baseThreshold = GAME_COMPLETION_THRESHOLDS[gameId] || GAME_COMPLETION_THRESHOLDS['default'];
    // Clamp to assignment vocab count (can't require more words than exist)
    return Math.min(baseThreshold, assignmentVocabCount);
  }

  /**
   * Check if a game is complete based on unique correct words
   * 
   * IMPORTANT: Uses assignment_word_exposure table which is assignment-scoped,
   * NOT vocabulary_gem_collection which is global/all-time.
   */
  async checkGameCompletion(
    assignmentId: string,
    studentId: string,
    gameId: string
  ): Promise<GameCompletionStatus> {
    try {
      // 1. Get assignment details
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select('vocabulary_count, vocabulary_assignment_list_id, game_config, game_type')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) throw assignmentError;

      // Get ACTUAL vocabulary count from vocabulary_assignment_items (most accurate)
      let totalAssignmentWords = assignment?.vocabulary_count || 50;

      if (assignment?.vocabulary_assignment_list_id) {
        const { count, error: countError } = await this.supabase
          .from('vocabulary_assignment_items')
          .select('*', { count: 'exact', head: true })
          .eq('assignment_list_id', assignment.vocabulary_assignment_list_id);

        if (!countError && count !== null && count > 0) {
          totalAssignmentWords = count;
          console.log(`📊 [GAME COMPLETION] Using actual vocabulary count: ${totalAssignmentWords}`);
        }
      }

      const isSampled = totalAssignmentWords > COMPLETION_CONFIG.MAX_SAMPLE_SIZE;
      const sampleSize = isSampled ? COMPLETION_CONFIG.MAX_SAMPLE_SIZE : totalAssignmentWords;

      // 2. Get unique words exposed in THIS ASSIGNMENT (not all-time gems)
      // Use assignment_word_exposure which is assignment-scoped
      const { data: exposureData, error: exposureError } = await this.supabase
        .from('assignment_word_exposure')
        .select('centralized_vocabulary_id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (exposureError) throw exposureError;

      // Count unique words exposed in this assignment
      const uniqueCorrectWords = exposureData?.length || 0;

      // 3. Get the threshold for this game (clamped)
      const wordsRequired = this.getGameThreshold(gameId, sampleSize);

      // 4. Check if game is complete
      const isComplete = uniqueCorrectWords >= wordsRequired;
      const progressPercentage = Math.min(100, Math.round((uniqueCorrectWords / wordsRequired) * 100));

      // 5. Get assignment-level progress (reuse the exposure data from above)
      const wordsSeenAcrossGames = uniqueCorrectWords; // Same as uniqueCorrectWords since we already queried assignment_word_exposure
      const assignmentWordsRequired = Math.ceil(sampleSize * (COMPLETION_CONFIG.ASSIGNMENT_COVERAGE_PERCENT / 100));
      const isAssignmentComplete = wordsSeenAcrossGames >= assignmentWordsRequired;
      const assignmentProgress = Math.min(100, Math.round((wordsSeenAcrossGames / assignmentWordsRequired) * 100));

      // 6. Build status message
      let message = '';
      if (isComplete) {
        message = `🎉 You've completed ${this.getGameDisplayName(gameId)}!`;
      } else {
        const remaining = wordsRequired - uniqueCorrectWords;
        message = `${remaining} more word${remaining > 1 ? 's' : ''} to complete this game`;
      }

      console.log(`📊 [GAME COMPLETION] ${gameId}:`, {
        uniqueCorrectWords,
        wordsRequired,
        isComplete,
        assignmentProgress,
        isAssignmentComplete
      });

      return {
        gameId,
        isComplete,
        uniqueCorrectWords,
        wordsRequired,
        progressPercentage,
        totalAssignmentWords,
        wordsSeenAcrossGames,
        assignmentProgress,
        isAssignmentComplete,
        isSampled,
        sampleSize,
        message,
        showCompletionModal: isComplete
      };
    } catch (error) {
      console.error('Error checking game completion:', error);
      throw error;
    }
  }

  /**
   * Get assignment-level completion info
   */
  async getAssignmentCompletionInfo(
    assignmentId: string,
    studentId: string
  ): Promise<AssignmentCompletionInfo> {
    try {
      // Get assignment details
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('vocabulary_count, game_config')
        .eq('id', assignmentId)
        .single();

      const totalWords = assignment?.vocabulary_count || 50;
      const isSampled = totalWords > COMPLETION_CONFIG.MAX_SAMPLE_SIZE;
      const sampledWords = isSampled ? COMPLETION_CONFIG.MAX_SAMPLE_SIZE : totalWords;
      const wordsRequired = Math.ceil(sampledWords * (COMPLETION_CONFIG.ASSIGNMENT_COVERAGE_PERCENT / 100));

      // Get words seen
      const { data: exposures } = await this.supabase
        .from('assignment_word_exposure')
        .select('centralized_vocabulary_id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      const wordsSeen = exposures?.length || 0;
      const progressPercentage = Math.min(100, Math.round((wordsSeen / wordsRequired) * 100));
      const isComplete = wordsSeen >= wordsRequired;

      // Get games completed
      const { data: gameProgress } = await this.supabase
        .from('assignment_game_progress')
        .select('game_id, status')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      const gamesCompleted = gameProgress?.filter(g => g.status === 'completed').length || 0;

      // Get total games in assignment
      const selectedGames = assignment?.game_config?.selectedGames ||
        assignment?.game_config?.gameConfig?.selectedGames ||
        [];
      let totalGames = selectedGames.length;

      // Add VocabMaster if enabled
      const vocabMasterConfig = assignment?.game_config?.vocabMasterConfig;
      if (vocabMasterConfig?.enabled) {
        totalGames += 1; // VocabMaster counts as one activity
      } else if (vocabMasterConfig?.selectedModes?.length > 0) {
        totalGames += vocabMasterConfig.selectedModes.length;
      }

      return {
        totalWords,
        sampledWords,
        wordsRequired,
        wordsSeen,
        progressPercentage,
        isComplete,
        gamesCompleted,
        totalGames,
        isSampled
      };
    } catch (error) {
      console.error('Error getting assignment completion info:', error);
      throw error;
    }
  }

  /**
   * Update game completion status in database
   */
  async updateGameCompletionStatus(
    assignmentId: string,
    studentId: string,
    gameId: string
  ): Promise<GameCompletionStatus> {
    try {
      const status = await this.checkGameCompletion(assignmentId, studentId, gameId);

      // Get latest session data
      const { data: latestSession } = await this.supabase
        .from('enhanced_game_sessions')
        .select('final_score, accuracy_percentage, duration_seconds')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_type', gameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Update assignment_game_progress table
      const { error } = await this.supabase
        .from('assignment_game_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          game_id: gameId,
          status: status.isComplete ? 'completed' : (status.uniqueCorrectWords > 0 ? 'in_progress' : 'not_started'),
          score: latestSession?.final_score || 0,
          accuracy: latestSession?.accuracy_percentage || 0,
          time_spent: latestSession?.duration_seconds || 0,
          words_completed: status.uniqueCorrectWords,
          total_words: status.wordsRequired,
          completed_at: status.isComplete ? new Date().toISOString() : null,
          completion_details: {
            uniqueCorrectWords: status.uniqueCorrectWords,
            wordsRequired: status.wordsRequired,
            progressPercentage: status.progressPercentage,
            assignmentProgress: status.assignmentProgress,
            isSampled: status.isSampled,
            sampleSize: status.sampleSize
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'assignment_id,student_id,game_id'
        });

      if (error) throw error;

      console.log(`✅ [GAME COMPLETION] ${gameId} status updated:`, {
        isComplete: status.isComplete,
        progress: `${status.uniqueCorrectWords}/${status.wordsRequired}`
      });

      return status;
    } catch (error) {
      console.error('Error updating game completion status:', error);
      throw error;
    }
  }

  /**
   * Get win conditions for assignment introduction modal
   */
  async getAssignmentWinConditions(
    assignmentId: string
  ): Promise<{
    perGameThresholds: Array<{ gameId: string; gameName: string; wordsRequired: number }>;
    assignmentThreshold: { wordsRequired: number; totalWords: number; percentRequired: number };
    tips: string[];
    isGrammarAssignment?: boolean;
    grammarSteps?: Array<{ step: string; label: string; description: string }>;
  }> {
    try {
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('vocabulary_count, game_config, game_type')
        .eq('id', assignmentId)
        .single();

      // Check if this is a grammar/skills assignment
      const isGrammarAssignment = assignment?.game_type === 'skills' ||
        (assignment?.game_config?.skillsConfig?.selectedSkills?.length > 0);

      if (isGrammarAssignment) {
        // Return grammar-specific win conditions
        const selectedSkills = assignment?.game_config?.skillsConfig?.selectedSkills || [];

        const grammarSteps = [
          { step: 'lesson', label: 'Lesson', description: 'Read and understand the grammar concept' },
          { step: 'practice', label: 'Practice', description: 'Practice exercises with hints and feedback' },
          { step: 'test', label: 'Test', description: 'Test your knowledge without hints' }
        ];

        const tips = [
          'Complete all three steps for each grammar topic: Lesson → Practice → Test',
          'The lesson explains the grammar concept - read it carefully!',
          'Practice mode gives you hints and feedback to help you learn',
          'Test mode checks your understanding without help',
          'Use the navigation bar at the top or the buttons at the bottom to move between steps'
        ];

        // For grammar assignments, thresholds represent topics not words
        const perGameThresholds = selectedSkills.map((skill: any) => ({
          gameId: skill.id,
          gameName: skill.name || 'Grammar Topic',
          wordsRequired: skill.instanceConfig?.topicIds?.length || 1 // Number of topics to complete
        }));

        return {
          perGameThresholds,
          assignmentThreshold: {
            wordsRequired: selectedSkills.length,
            totalWords: selectedSkills.length,
            percentRequired: 100 // Must complete all grammar topics
          },
          tips,
          isGrammarAssignment: true,
          grammarSteps
        };
      }

      // Original vocabulary-focused logic for non-grammar assignments
      const totalWords = assignment?.vocabulary_count || 50;
      const isSampled = totalWords > COMPLETION_CONFIG.MAX_SAMPLE_SIZE;
      const sampledWords = isSampled ? COMPLETION_CONFIG.MAX_SAMPLE_SIZE : totalWords;
      const wordsRequired = Math.ceil(sampledWords * (COMPLETION_CONFIG.ASSIGNMENT_COVERAGE_PERCENT / 100));

      const selectedGames = assignment?.game_config?.selectedGames ||
        assignment?.game_config?.gameConfig?.selectedGames ||
        [];

      const perGameThresholds = selectedGames.map((gameId: string) => ({
        gameId,
        gameName: this.getGameDisplayName(gameId),
        wordsRequired: this.getGameThreshold(gameId, sampledWords)
      }));

      // Check for VocabMaster enabled (new simplified model)
      const vocabMasterConfig = assignment?.game_config?.vocabMasterConfig;
      if (vocabMasterConfig?.enabled) {
        // Add VocabMaster as a single activity (students choose modes)
        perGameThresholds.push({
          gameId: 'vocab-master',
          gameName: 'VocabMaster (13 Modes)',
          wordsRequired: this.getGameThreshold('vocab-master', sampledWords)
        });
      } else if (vocabMasterConfig?.selectedModes?.length > 0) {
        // Legacy: Add each selected VocabMaster mode
        vocabMasterConfig.selectedModes.forEach((mode: any) => {
          perGameThresholds.push({
            gameId: `vocab-master-${mode.id}`,
            gameName: `VocabMaster: ${mode.name || mode.id}`,
            wordsRequired: this.getGameThreshold('vocab-master', sampledWords)
          });
        });
      }

      const tips = [
        'Wrong answers don\'t count toward completion',
        'Words you learn in one activity count toward the whole assignment',
        'You can complete activities in any order',
        'Take your time - accuracy matters more than speed!'
      ];

      return {
        perGameThresholds,
        assignmentThreshold: {
          wordsRequired,
          totalWords: sampledWords,
          percentRequired: COMPLETION_CONFIG.ASSIGNMENT_COVERAGE_PERCENT
        },
        tips,
        isGrammarAssignment: false
      };
    } catch (error) {
      console.error('Error getting win conditions:', error);
      throw error;
    }
  }

  /**
   * Get display name for a game
   */
  private getGameDisplayName(gameId: string): string {
    const names: Record<string, string> = {
      'memory-game': 'Memory Match',
      'memory-match': 'Memory Match',
      'hangman': 'Hangman',
      'word-scramble': 'Word Scramble',
      'noughts-and-crosses': 'Noughts & Crosses',
      'word-towers': 'Word Towers',
      'vocab-blast': 'Vocab Blast',
      'word-blast': 'Word Blast',
      'vocab-master': 'VocabMaster',
      'sentence-towers': 'Sentence Towers',
      'speed-builder': 'Speed Builder',
      'case-file-translator': 'Case File Translator',
      'lava-temple-word-restore': 'Lava Temple',
      'detective-listening': 'Detective Listening',
      'conjugation-duel': 'Conjugation Duel',
    };
    return names[gameId] || gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Check completion for all games in an assignment
   */
  async checkAllGamesCompletion(
    assignmentId: string,
    studentId: string
  ): Promise<GameCompletionStatus[]> {
    try {
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('game_config')
        .eq('id', assignmentId)
        .single();

      const selectedGames = assignment?.game_config?.selectedGames ||
        assignment?.game_config?.gameConfig?.selectedGames ||
        [];

      const completionStatuses = await Promise.all(
        selectedGames.map((gameId: string) =>
          this.checkGameCompletion(assignmentId, studentId, gameId)
        )
      );

      return completionStatuses;
    } catch (error) {
      console.error('Error checking all games completion:', error);
      throw error;
    }
  }

  /**
   * Update completion status for all games in an assignment
   */
  async updateAllGamesCompletion(
    assignmentId: string,
    studentId: string
  ): Promise<void> {
    try {
      const statuses = await this.checkAllGamesCompletion(assignmentId, studentId);

      await Promise.all(
        statuses.map(status =>
          this.updateGameCompletionStatus(assignmentId, studentId, status.gameId)
        )
      );

      console.log(`✅ [GAME COMPLETION] Updated all games for assignment ${assignmentId}`);
    } catch (error) {
      console.error('Error updating all games completion:', error);
      throw error;
    }
  }
}

// Get threshold for this game
const WORDS_TO_WIN = GAME_COMPLETION_THRESHOLDS['game-id'] || 10;
