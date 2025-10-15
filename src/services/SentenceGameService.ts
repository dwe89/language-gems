/**
 * Sentence Game Service
 * 
 * Handles vocabulary tracking and gem awarding for sentence-based games.
 * Integrates with MWEVocabularyTrackingService for accurate vocabulary recognition
 * and EnhancedGameSessionService for gem tracking.
 * 
 * Example: "Me gusta la pizza" → awards gems for "me gusta" and "la pizza"
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { MWEVocabularyTrackingService, MWEVocabularyMatch, SentenceParsingResult } from './MWEVocabularyTrackingService';
import { EnhancedGameSessionService, WordAttempt } from './rewards/EnhancedGameSessionService';
import { FSRSService } from './fsrsService';
import { assignmentExposureService } from './assignments/AssignmentExposureService';

export interface SentenceGameAttempt {
  sessionId: string;
  gameType: string;
  sentenceId?: string;
  originalSentence: string;
  studentResponse?: string;
  language: string;
  isCorrect: boolean;
  responseTimeMs: number;
  hintUsed?: boolean;
  gameMode?: 'listening' | 'translation' | 'completion' | 'dictation';
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  assignmentId?: string; // 🎯 NEW: For Layer 2 exposure tracking
  studentId?: string; // 🎯 NEW: For Layer 2 exposure tracking
}

export interface SentenceGameResult {
  vocabularyMatches: MWEVocabularyMatch[];
  gemsAwarded: Array<{
    vocabularyId: string;
    word: string;
    gemRarity: string;
    xpAwarded: number;
  }>;
  fsrsUpdates: Array<{
    vocabularyId: string;
    word: string;
    updated: boolean;
  }>;
  totalGems: number;
  totalXP: number;
  coveragePercentage: number;
  unmatchedWords: string[];
}

export class SentenceGameService {
  private supabase: SupabaseClient;
  private mweService: MWEVocabularyTrackingService;
  private sessionService: EnhancedGameSessionService;
  private fsrsService: FSRSService;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.mweService = new MWEVocabularyTrackingService(supabase);
    this.sessionService = new EnhancedGameSessionService(supabase);
    this.fsrsService = new FSRSService(supabase);
  }

  /**
   * Process a sentence attempt and award gems for recognized vocabulary
   */
  async processSentenceAttempt(attempt: SentenceGameAttempt): Promise<SentenceGameResult> {
    try {
      // Add null/undefined protection
      if (!attempt || !attempt.originalSentence || typeof attempt.originalSentence !== 'string') {
        console.warn('SentenceGameService: Invalid sentence attempt received:', attempt);
        return {
          vocabularyMatches: [],
          gemsAwarded: [], // Fix: should be array, not number
          fsrsUpdates: [], // Fix: missing required field
          totalGems: 0,
          totalXP: 0,
          coveragePercentage: 0,
          unmatchedWords: [] // Fix: missing required field
        };
      }

      console.log(`SentenceGameService: Processing sentence attempt: "${attempt.originalSentence}" (${attempt.language})`);

      // Parse sentence for vocabulary matches
      const parsingResult = await this.mweService.parseSentenceWithLemmatization(
        attempt.originalSentence,
        attempt.language
      );

      // Reduced logging: Only log significant vocabulary discovery, not every sentence
      if (parsingResult.vocabularyMatches.length > 0) {
        console.log(`Found ${parsingResult.vocabularyMatches.length} vocabulary matches`);
      }

      const result: SentenceGameResult = {
        vocabularyMatches: parsingResult.vocabularyMatches,
        gemsAwarded: [],
        fsrsUpdates: [],
        totalGems: 0,
        totalXP: 0,
        coveragePercentage: parsingResult.coveragePercentage,
        unmatchedWords: parsingResult.unmatchedWords
      };

      // Only award gems and update FSRS for correct attempts
      if (attempt.isCorrect && parsingResult.vocabularyMatches.length > 0) {
        // Process each vocabulary match
        for (const match of parsingResult.vocabularyMatches) {
          if (match.should_track_for_fsrs) {
            try {
              // Calculate confidence based on game mode and performance
              const confidence = this.calculateConfidence(attempt, match);

              // Record word attempt for gem tracking
              const wordAttempt: WordAttempt = {
                vocabularyId: match.id,
                wordText: match.word,
                translationText: match.translation,
                responseTimeMs: attempt.responseTimeMs,
                wasCorrect: true, // Only processing correct attempts
                hintUsed: attempt.hintUsed || false,
                streakCount: 0, // Will be calculated by the service
                masteryLevel: 2, // Intermediate mastery for sentence recognition
                maxGemRarity: this.determineMaxGemRarity(attempt.gameMode, match),
                gameMode: attempt.gameMode || 'sentence',
                difficultyLevel: attempt.difficultyLevel || 'intermediate'
              };

              // Record with session service (handles gems) - non-blocking
              this.sessionService.recordWordAttempt(
                attempt.sessionId,
                attempt.gameType,
                wordAttempt
              ).then(gemEvent => {
                if (gemEvent) {
                  console.log(`Gem awarded for "${match.word}": ${gemEvent.rarity} (+${gemEvent.xpValue} XP)`);
                }
              }).catch(error => {
                console.warn('Gem recording failed (non-blocking):', error);
              });

              // Add to result immediately (optimistic)
              result.gemsAwarded.push({
                vocabularyId: match.id,
                word: match.word,
                gemRarity: 'common', // Default assumption
                xpAwarded: 5 // Default XP
              });
              result.totalGems++;
              result.totalXP += 5;

              // Update FSRS for spaced repetition (non-blocking)
              this.getStudentIdFromSession(attempt.sessionId).then(studentId => {
                if (studentId) {
                  return this.fsrsService.updateProgress(
                    studentId,
                    match.id,
                    true, // Correct attempt
                    attempt.responseTimeMs,
                    confidence
                  );
                }
              }).then(() => {
                console.log(`FSRS updated for "${match.word}"`);
              }).catch(fsrsError => {
                console.warn(`FSRS update failed for ${match.word}:`, fsrsError);
              });

              // Add to result immediately (optimistic)
              result.fsrsUpdates.push({
                vocabularyId: match.id,
                word: match.word,
                updated: true
              });

            } catch (error) {
              console.error(`Error processing vocabulary match ${match.word}:`, error);
            }
          }
        }
      }

      // 🎯 LAYER 2: Record word exposures for assignment progress tracking
      if (attempt.assignmentId && attempt.studentId && parsingResult.vocabularyMatches.length > 0) {
        const exposedWordIds = parsingResult.vocabularyMatches
          .filter(match => match.should_track_for_fsrs)
          .map(match => match.id);

        if (exposedWordIds.length > 0) {
          console.log(`📝 [LAYER 2] Recording ${exposedWordIds.length} word exposures for assignment ${attempt.assignmentId}`);

          // Record exposures (non-blocking)
          assignmentExposureService.recordWordExposures(
            attempt.assignmentId,
            attempt.studentId,
            exposedWordIds
          ).then(result => {
            if (result.success) {
              console.log(`✅ [LAYER 2] Exposures recorded successfully`);
            } else {
              console.error(`❌ [LAYER 2] Failed to record exposures:`, result.error);
            }
          }).catch(error => {
            console.error(`❌ [LAYER 2] Error recording exposures:`, error);
          });
        }
      }

      // Reduced logging: Only log significant processing results
      if (result.totalGems > 0) {
        console.log(`Sentence processing complete: ${result.totalGems} gems awarded, ${result.totalXP} XP`);
      }
      return result;

    } catch (error) {
      console.error('Error processing sentence attempt:', error);
      throw error;
    }
  }

  /**
   * Calculate confidence score based on game context and vocabulary match
   */
  private calculateConfidence(attempt: SentenceGameAttempt, match: MWEVocabularyMatch): number {
    let confidence = 0.7; // Base confidence for sentence recognition

    // Adjust for game mode
    switch (attempt.gameMode) {
      case 'listening':
        confidence += 0.1; // Bonus for audio comprehension
        break;
      case 'dictation':
        confidence += 0.15; // Higher bonus for spelling accuracy
        break;
      case 'translation':
        confidence += 0.05; // Slight bonus for translation
        break;
    }

    // Adjust for response time (faster = more confident)
    if (attempt.responseTimeMs < 5000) {
      confidence += 0.1;
    } else if (attempt.responseTimeMs > 15000) {
      confidence -= 0.1;
    }

    // Adjust for hint usage
    if (attempt.hintUsed) {
      confidence -= 0.2;
    }

    // Adjust for MWE complexity
    if (match.is_mwe && match.component_words && match.component_words.length > 2) {
      confidence += 0.1; // Bonus for complex expressions
    }

    // Adjust for lemmatization confidence
    if (match.lemmatizationConfidence) {
      confidence = (confidence + match.lemmatizationConfidence) / 2;
    }

    return Math.max(0.1, Math.min(0.95, confidence));
  }

  /**
   * Get student ID from session ID
   */
  private async getStudentIdFromSession(sessionId: string): Promise<string | null> {
    try {
      const { data } = await this.supabase
        .from('enhanced_game_sessions')
        .select('student_id')
        .eq('id', sessionId)
        .single();

      return data?.student_id || null;
    } catch (error) {
      console.warn('Could not get student ID from session:', error);
      return null;
    }
  }

  /**
   * Determine maximum gem rarity based on game mode and vocabulary type
   */
  private determineMaxGemRarity(gameMode?: string, match?: MWEVocabularyMatch): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    // Base rarity on game mode
    let maxRarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' = 'rare';

    switch (gameMode) {
      case 'dictation':
        maxRarity = 'epic'; // Highest for spelling accuracy
        break;
      case 'listening':
        maxRarity = 'rare'; // High for audio comprehension
        break;
      case 'translation':
        maxRarity = 'uncommon'; // Moderate for translation
        break;
      default:
        maxRarity = 'rare';
    }

    // Boost for complex MWEs
    if (match?.is_mwe && match.component_words && match.component_words.length > 2) {
      if (maxRarity === 'rare') maxRarity = 'epic';
      else if (maxRarity === 'uncommon') maxRarity = 'rare';
    }

    return maxRarity;
  }

  /**
   * Get vocabulary statistics for a sentence
   */
  async analyzeSentenceVocabulary(sentence: string, language: string): Promise<{
    totalWords: number;
    recognizedWords: number;
    mweCount: number;
    coveragePercentage: number;
    vocabularyLevel: 'beginner' | 'intermediate' | 'advanced';
  }> {
    try {
      const result = await this.mweService.parseSentenceWithLemmatization(sentence, language);
      
      const mweCount = result.vocabularyMatches.filter(m => m.is_mwe).length;
      const recognizedWords = result.matchedWords;
      
      // Determine vocabulary level based on coverage and MWE complexity
      let vocabularyLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      
      if (result.coveragePercentage > 80) {
        if (mweCount > 2) {
          vocabularyLevel = 'advanced';
        } else if (mweCount > 0) {
          vocabularyLevel = 'intermediate';
        }
      } else if (result.coveragePercentage > 60) {
        vocabularyLevel = 'intermediate';
      }

      return {
        totalWords: result.totalWords,
        recognizedWords,
        mweCount,
        coveragePercentage: result.coveragePercentage,
        vocabularyLevel
      };

    } catch (error) {
      console.error('Error analyzing sentence vocabulary:', error);
      return {
        totalWords: sentence.split(' ').length,
        recognizedWords: 0,
        mweCount: 0,
        coveragePercentage: 0,
        vocabularyLevel: 'beginner'
      };
    }
  }

  /**
   * Batch process multiple sentences (useful for assessment games)
   */
  async processBatchSentences(attempts: SentenceGameAttempt[]): Promise<{
    results: SentenceGameResult[];
    summary: {
      totalGems: number;
      totalXP: number;
      averageCoverage: number;
      uniqueVocabulary: number;
    };
  }> {
    const results: SentenceGameResult[] = [];
    const uniqueVocabulary = new Set<string>();
    let totalGems = 0;
    let totalXP = 0;
    let totalCoverage = 0;

    for (const attempt of attempts) {
      try {
        const result = await this.processSentenceAttempt(attempt);
        results.push(result);
        
        totalGems += result.totalGems;
        totalXP += result.totalXP;
        totalCoverage += result.coveragePercentage;
        
        result.vocabularyMatches.forEach(match => {
          uniqueVocabulary.add(match.id);
        });
      } catch (error) {
        console.error(`Error processing sentence attempt: ${attempt.originalSentence}`, error);
        // Add empty result to maintain array consistency
        results.push({
          vocabularyMatches: [],
          gemsAwarded: [],
          fsrsUpdates: [],
          totalGems: 0,
          totalXP: 0,
          coveragePercentage: 0,
          unmatchedWords: attempt.originalSentence.split(' ')
        });
      }
    }

    return {
      results,
      summary: {
        totalGems,
        totalXP,
        averageCoverage: attempts.length > 0 ? totalCoverage / attempts.length : 0,
        uniqueVocabulary: uniqueVocabulary.size
      }
    };
  }
}
