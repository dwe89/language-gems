/**
 * Assignment Time Estimation Utilities
 * 
 * Calculates estimated completion time for assignments based on:
 * - Number of words in assignment
 * - Repetitions required per word
 * - Average time per word attempt (8 seconds)
 */

export interface TimeEstimation {
  totalExposures: number;
  estimatedMinutes: number;
  estimatedMinutesRange: { min: number; max: number };
  displayText: string;
  detailedBreakdown: string;
}

/**
 * Calculate estimated time to complete an assignment
 * 
 * @param vocabularyCount - Number of unique words in the assignment
 * @param repetitionsRequired - How many times each word should be practiced (default: 5)
 * @param secondsPerWord - Average time per word attempt (default: 8 seconds)
 * @returns Time estimation with breakdown
 */
export function calculateAssignmentTime(
  vocabularyCount: number,
  repetitionsRequired: number = 5,
  secondsPerWord: number = 8
): TimeEstimation {
  // Calculate total exposures needed
  const totalExposures = vocabularyCount * repetitionsRequired;
  
  // Calculate time in seconds
  const totalSeconds = totalExposures * secondsPerWord;
  
  // Convert to minutes
  const exactMinutes = totalSeconds / 60;
  const estimatedMinutes = Math.ceil(exactMinutes);
  
  // Provide a range (±20% for variability in student speed)
  const minMinutes = Math.floor(exactMinutes * 0.8);
  const maxMinutes = Math.ceil(exactMinutes * 1.2);
  
  // Create display text
  let displayText: string;
  if (estimatedMinutes < 5) {
    displayText = `${estimatedMinutes} minutes`;
  } else if (estimatedMinutes < 60) {
    displayText = `${minMinutes}-${maxMinutes} minutes`;
  } else {
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    if (minutes === 0) {
      displayText = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      displayText = `${hours}h ${minutes}m`;
    }
  }
  
  // Create detailed breakdown
  const detailedBreakdown = `${vocabularyCount} words × ${repetitionsRequired} repetitions = ${totalExposures} total attempts (≈${secondsPerWord}s each)`;
  
  return {
    totalExposures,
    estimatedMinutes,
    estimatedMinutesRange: { min: minMinutes, max: maxMinutes },
    displayText,
    detailedBreakdown
  };
}

/**
 * Calculate remaining time for a partially completed assignment
 * 
 * @param totalExposures - Total exposures required
 * @param completedExposures - Exposures already completed
 * @param secondsPerWord - Average time per word attempt (default: 8 seconds)
 * @returns Remaining time estimation
 */
export function calculateRemainingTime(
  totalExposures: number,
  completedExposures: number,
  secondsPerWord: number = 8
): TimeEstimation {
  const remainingExposures = Math.max(0, totalExposures - completedExposures);
  
  // Calculate time in seconds
  const totalSeconds = remainingExposures * secondsPerWord;
  
  // Convert to minutes
  const exactMinutes = totalSeconds / 60;
  const estimatedMinutes = Math.ceil(exactMinutes);
  
  // Provide a range
  const minMinutes = Math.floor(exactMinutes * 0.8);
  const maxMinutes = Math.ceil(exactMinutes * 1.2);
  
  // Create display text
  let displayText: string;
  if (remainingExposures === 0) {
    displayText = 'Complete!';
  } else if (estimatedMinutes < 5) {
    displayText = `${estimatedMinutes} minutes remaining`;
  } else if (estimatedMinutes < 60) {
    displayText = `${minMinutes}-${maxMinutes} minutes remaining`;
  } else {
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    if (minutes === 0) {
      displayText = `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    } else {
      displayText = `${hours}h ${minutes}m remaining`;
    }
  }
  
  const detailedBreakdown = `${remainingExposures} attempts remaining (≈${secondsPerWord}s each)`;
  
  return {
    totalExposures: remainingExposures,
    estimatedMinutes,
    estimatedMinutesRange: { min: minMinutes, max: maxMinutes },
    displayText,
    detailedBreakdown
  };
}

/**
 * Get time estimation category for UI display
 */
export function getTimeCategory(minutes: number): {
  category: 'quick' | 'short' | 'medium' | 'long';
  icon: string;
  color: string;
  description: string;
} {
  if (minutes <= 10) {
    return {
      category: 'quick',
      icon: '⚡',
      color: 'text-green-600',
      description: 'Quick practice'
    };
  } else if (minutes <= 30) {
    return {
      category: 'short',
      icon: '📝',
      color: 'text-blue-600',
      description: 'Short session'
    };
  } else if (minutes <= 60) {
    return {
      category: 'medium',
      icon: '📚',
      color: 'text-yellow-600',
      description: 'Medium session'
    };
  } else {
    return {
      category: 'long',
      icon: '🎯',
      color: 'text-red-600',
      description: 'Extended session'
    };
  }
}

/**
 * Format time for display in various contexts
 */
export function formatTime(minutes: number, format: 'short' | 'long' = 'short'): string {
  if (minutes < 1) {
    return format === 'short' ? '<1 min' : 'Less than 1 minute';
  }
  
  if (minutes < 60) {
    return format === 'short' ? `${minutes} min` : `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (format === 'short') {
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  } else {
    const hourText = `${hours} hour${hours > 1 ? 's' : ''}`;
    const minText = mins > 0 ? ` ${mins} minute${mins > 1 ? 's' : ''}` : '';
    return hourText + minText;
  }
}

