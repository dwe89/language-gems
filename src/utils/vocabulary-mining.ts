// Vocabulary Mining System Utilities
// Core utility functions for the gamified vocabulary learning system

import { 
  GemType, 
  MasteryLevel, 
  GEM_CONFIG, 
  MASTERY_CONFIG, 
  SPACED_REPETITION_INTERVALS,
  PERFORMANCE_QUALITY,
  VocabularyGem,
  GemCollection,
  TopicPerformance
} from '../types/vocabulary-mining';

/**
 * Calculate gem rarity based on frequency score and other factors
 */
export function calculateGemRarity(
  frequencyScore: number, 
  difficultyLevel?: string,
  wordLength?: number
): GemType {
  let adjustedScore = frequencyScore;
  
  // Adjust score based on difficulty level
  if (difficultyLevel) {
    switch (difficultyLevel.toLowerCase()) {
      case 'advanced':
        adjustedScore -= 20;
        break;
      case 'intermediate':
        adjustedScore -= 10;
        break;
      case 'beginner':
        adjustedScore += 10;
        break;
    }
  }
  
  // Adjust score based on word length (longer words are typically rarer)
  if (wordLength) {
    if (wordLength > 10) adjustedScore -= 15;
    else if (wordLength > 8) adjustedScore -= 10;
    else if (wordLength > 6) adjustedScore -= 5;
    else if (wordLength <= 3) adjustedScore += 10;
  }
  
  // Ensure score stays within bounds
  adjustedScore = Math.max(0, Math.min(100, adjustedScore));
  
  // Determine rarity based on adjusted score
  if (adjustedScore >= 80) return 'common';
  if (adjustedScore >= 60) return 'uncommon';
  if (adjustedScore >= 40) return 'rare';
  if (adjustedScore >= 20) return 'epic';
  return 'legendary';
}

/**
 * Get gem color based on gem type
 */
export function getGemColor(gemType: GemType): string {
  return GEM_CONFIG[gemType].color;
}

/**
 * Get gem display information
 */
export function getGemInfo(gemType: GemType) {
  return GEM_CONFIG[gemType];
}

/**
 * Get mastery level display information
 */
export function getMasteryInfo(masteryLevel: MasteryLevel) {
  return MASTERY_CONFIG[masteryLevel];
}

/**
 * Calculate points earned for a vocabulary interaction
 */
export function calculatePointsEarned(
  gemType: GemType,
  wasCorrect: boolean,
  responseTime?: number,
  currentStreak?: number
): number {
  if (!wasCorrect) return 0;
  
  let points = GEM_CONFIG[gemType].basePoints;
  
  // Bonus for quick responses (under 3 seconds)
  if (responseTime && responseTime < 3000) {
    points += Math.floor(points * 0.5);
  }
  
  // Streak bonus
  if (currentStreak && currentStreak > 0) {
    const streakMultiplier = Math.min(2.0, 1 + (currentStreak * 0.1));
    points = Math.floor(points * streakMultiplier);
  }
  
  return points;
}

/**
 * Calculate next spaced repetition interval
 */
export function calculateNextReviewInterval(
  currentInterval: number,
  easeFactor: number,
  performanceQuality: number
): { interval: number; easeFactor: number } {
  // Adjust ease factor based on performance
  let newEaseFactor = easeFactor + (0.1 - (5 - performanceQuality) * (0.08 + (5 - performanceQuality) * 0.02));
  
  // Ensure ease factor stays within reasonable bounds
  newEaseFactor = Math.max(1.3, newEaseFactor);
  
  let newInterval: number;
  
  if (performanceQuality < 3) {
    // Poor performance, reset to 1 day
    newInterval = 1;
  } else {
    // Good performance, increase interval
    newInterval = Math.round(currentInterval * newEaseFactor);
  }
  
  // Ensure minimum interval of 1 day
  newInterval = Math.max(1, newInterval);
  
  return { interval: newInterval, easeFactor: newEaseFactor };
}

/**
 * Determine performance quality based on response
 */
export function determinePerformanceQuality(
  wasCorrect: boolean,
  responseTime?: number,
  hintsUsed?: number
): number {
  if (!wasCorrect) {
    return PERFORMANCE_QUALITY.INCORRECT;
  }
  
  // Adjust based on response time and hints
  let quality = PERFORMANCE_QUALITY.PERFECT;
  
  if (responseTime) {
    if (responseTime > 10000) quality = PERFORMANCE_QUALITY.DIFFICULT;
    else if (responseTime > 5000) quality = PERFORMANCE_QUALITY.HESITANT;
    else if (responseTime > 3000) quality = PERFORMANCE_QUALITY.EASY;
  }
  
  if (hintsUsed && hintsUsed > 0) {
    quality = Math.max(PERFORMANCE_QUALITY.HESITANT, quality - hintsUsed);
  }
  
  return quality;
}

/**
 * Calculate mastery level based on performance history
 */
export function calculateMasteryLevel(
  correctEncounters: number,
  totalEncounters: number,
  currentStreak: number
): MasteryLevel {
  if (totalEncounters === 0) return 0;
  
  const accuracy = correctEncounters / totalEncounters;
  
  if (accuracy >= 0.95 && currentStreak >= 5 && totalEncounters >= 10) return 5; // Expert
  if (accuracy >= 0.85 && currentStreak >= 3 && totalEncounters >= 8) return 4;  // Mastered
  if (accuracy >= 0.70 && totalEncounters >= 5) return 3;                       // Practiced
  if (accuracy >= 0.50 && totalEncounters >= 3) return 2;                       // Recognized
  if (totalEncounters >= 1) return 1;                                           // Seen
  return 0; // Unknown
}

/**
 * Check if a gem should be upgraded to next level
 */
export function shouldUpgradeGem(
  currentLevel: number,
  correctEncounters: number,
  currentStreak: number
): boolean {
  if (currentLevel >= 10) return false;
  
  const requiredCorrect = currentLevel * 2; // Increasing requirement
  const requiredStreak = Math.min(5, currentLevel + 1);
  
  return correctEncounters >= requiredCorrect && currentStreak >= requiredStreak;
}

/**
 * Calculate topic mastery percentage
 */
export function calculateTopicMastery(performance: TopicPerformance): number {
  if (performance.totalWords === 0) return 0;
  return Math.round((performance.masteredWords / performance.totalWords) * 100);
}

/**
 * Determine if vocabulary item needs review based on spaced repetition
 */
export function needsReview(nextReviewAt?: Date): boolean {
  if (!nextReviewAt) return true;
  return new Date() >= nextReviewAt;
}

/**
 * Get vocabulary items that need review
 */
export function getItemsNeedingReview(gemCollection: GemCollection[]): GemCollection[] {
  return gemCollection.filter(gem => needsReview(gem.nextReviewAt));
}

/**
 * Calculate daily goal progress
 */
export function calculateDailyGoalProgress(
  wordsPracticed: number,
  targetWords: number,
  minutesPracticed: number,
  targetMinutes: number
): { wordsProgress: number; timeProgress: number; overallProgress: number } {
  const wordsProgress = Math.min(100, (wordsPracticed / targetWords) * 100);
  const timeProgress = Math.min(100, (minutesPracticed / targetMinutes) * 100);
  const overallProgress = (wordsProgress + timeProgress) / 2;
  
  return {
    wordsProgress: Math.round(wordsProgress),
    timeProgress: Math.round(timeProgress),
    overallProgress: Math.round(overallProgress)
  };
}

/**
 * Generate achievement based on performance
 */
export function checkForAchievements(
  gemCollection: GemCollection[],
  sessionData: any
): string[] {
  const achievements: string[] = [];
  
  // First gem achievement
  if (gemCollection.length === 1) {
    achievements.push('FIRST_GEM');
  }
  
  // Streak milestones
  const maxStreak = Math.max(...gemCollection.map(g => g.currentStreak));
  if (maxStreak >= 10) achievements.push('STREAK_10');
  if (maxStreak >= 25) achievements.push('STREAK_25');
  if (maxStreak >= 50) achievements.push('STREAK_50');
  
  // Mastery milestones
  const masteredCount = gemCollection.filter(g => g.masteryLevel >= 4).length;
  if (masteredCount >= 10) achievements.push('MASTERY_10');
  if (masteredCount >= 50) achievements.push('MASTERY_50');
  if (masteredCount >= 100) achievements.push('MASTERY_100');
  
  // Perfect session
  if (sessionData.accuracyPercentage === 100 && sessionData.totalWordsAttempted >= 10) {
    achievements.push('PERFECT_SESSION');
  }
  
  return achievements;
}

/**
 * Format time duration for display
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Get next review date as human-readable string
 */
export function getNextReviewText(nextReviewAt?: Date): string {
  if (!nextReviewAt) return 'Ready for review';
  
  const now = new Date();
  const diffMs = nextReviewAt.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Ready for review';
  
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  return `In ${Math.ceil(diffDays / 30)} months`;
}
