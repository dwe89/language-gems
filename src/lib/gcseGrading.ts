/**
 * GCSE Grading Utilities
 * Converts percentage scores to GCSE 1-9 grades (9 = highest)
 * Based on AQA grade boundaries for MFL (Modern Foreign Languages)
 */

/**
 * Foundation Tier Grade Boundaries (approximate)
 * Based on typical AQA Spanish/French/German papers
 * 
 * Grade boundaries vary by year and subject, but these are typical:
 * - Grade 5: ~70%
 * - Grade 4: ~55%
 * - Grade 3: ~40%
 * - Grade 2: ~25%
 * - Grade 1: ~10%
 */
const FOUNDATION_BOUNDARIES = {
  5: 70,
  4: 55,
  3: 40,
  2: 25,
  1: 10,
};

/**
 * Higher Tier Grade Boundaries (approximate)
 * Based on typical AQA Spanish/French/German papers
 * 
 * - Grade 9: ~80%
 * - Grade 8: ~70%
 * - Grade 7: ~60%
 * - Grade 6: ~50%
 * - Grade 5: ~40%
 * - Grade 4: ~30%
 */
const HIGHER_BOUNDARIES = {
  9: 80,
  8: 70,
  7: 60,
  6: 50,
  5: 40,
  4: 30,
};

/**
 * Calculate GCSE grade from percentage score
 * @param percentageScore - Score as a percentage (0-100)
 * @param tier - 'foundation' or 'higher'
 * @returns GCSE grade (1-9) or null if below grade 1
 */
export function calculateGCSEGrade(
  percentageScore: number,
  tier: 'foundation' | 'higher' = 'higher'
): number | null {
  // Round to 1 decimal place
  const score = Math.round(percentageScore * 10) / 10;

  if (tier === 'foundation') {
    // Foundation tier: grades 1-5
    if (score >= FOUNDATION_BOUNDARIES[5]) return 5;
    if (score >= FOUNDATION_BOUNDARIES[4]) return 4;
    if (score >= FOUNDATION_BOUNDARIES[3]) return 3;
    if (score >= FOUNDATION_BOUNDARIES[2]) return 2;
    if (score >= FOUNDATION_BOUNDARIES[1]) return 1;
    return null; // Below grade 1 (U - ungraded)
  } else {
    // Higher tier: grades 4-9
    if (score >= HIGHER_BOUNDARIES[9]) return 9;
    if (score >= HIGHER_BOUNDARIES[8]) return 8;
    if (score >= HIGHER_BOUNDARIES[7]) return 7;
    if (score >= HIGHER_BOUNDARIES[6]) return 6;
    if (score >= HIGHER_BOUNDARIES[5]) return 5;
    if (score >= HIGHER_BOUNDARIES[4]) return 4;
    return 3; // Below grade 4 on higher tier typically gets grade 3
  }
}

/**
 * Get grade descriptor for GCSE grade
 * @param grade - GCSE grade (1-9)
 * @returns Human-readable description
 */
export function getGradeDescriptor(grade: number | null): string {
  if (grade === null) return 'U (Ungraded)';
  
  const descriptors: Record<number, string> = {
    9: 'Grade 9 - Exceptional',
    8: 'Grade 8 - Excellent',
    7: 'Grade 7 - Very Good',
    6: 'Grade 6 - Good',
    5: 'Grade 5 - Strong Pass',
    4: 'Grade 4 - Standard Pass',
    3: 'Grade 3 - Developing',
    2: 'Grade 2 - Basic',
    1: 'Grade 1 - Foundation',
  };

  return descriptors[grade] || 'Unknown';
}

/**
 * Get percentage needed for next grade
 * @param currentPercentage - Current score as percentage
 * @param tier - 'foundation' or 'higher'
 * @returns Object with next grade and percentage needed
 */
export function getNextGradeInfo(
  currentPercentage: number,
  tier: 'foundation' | 'higher' = 'higher'
): { nextGrade: number | null; percentageNeeded: number | null } {
  const currentGrade = calculateGCSEGrade(currentPercentage, tier);
  
  if (currentGrade === null) {
    // Below grade 1, aim for grade 1
    return {
      nextGrade: 1,
      percentageNeeded: tier === 'foundation' ? FOUNDATION_BOUNDARIES[1] : HIGHER_BOUNDARIES[4],
    };
  }

  if (tier === 'foundation') {
    if (currentGrade >= 5) {
      // Already at max foundation grade
      return { nextGrade: null, percentageNeeded: null };
    }
    const nextGrade = (currentGrade + 1) as 2 | 3 | 4 | 5;
    return {
      nextGrade,
      percentageNeeded: FOUNDATION_BOUNDARIES[nextGrade],
    };
  } else {
    if (currentGrade >= 9) {
      // Already at max grade
      return { nextGrade: null, percentageNeeded: null };
    }
    const nextGrade = (currentGrade + 1) as 4 | 5 | 6 | 7 | 8 | 9;
    return {
      nextGrade,
      percentageNeeded: HIGHER_BOUNDARIES[nextGrade],
    };
  }
}

/**
 * Get color coding for grade (for UI display)
 * @param grade - GCSE grade (1-9)
 * @returns Tailwind CSS color class
 */
export function getGradeColor(grade: number | null): string {
  if (grade === null) return 'text-gray-400';
  if (grade >= 7) return 'text-green-600'; // 7-9: Excellent
  if (grade >= 5) return 'text-blue-600'; // 5-6: Good/Pass
  if (grade >= 4) return 'text-yellow-600'; // 4: Pass
  return 'text-orange-600'; // 1-3: Below pass
}

/**
 * Calculate average GCSE grade from multiple results
 * @param results - Array of objects with percentage_score and tier
 * @returns Average grade rounded to nearest integer
 */
export function calculateAverageGrade(
  results: Array<{ percentage_score: number; tier?: 'foundation' | 'higher' }>
): number | null {
  if (results.length === 0) return null;

  const grades = results
    .map((r) => calculateGCSEGrade(r.percentage_score, r.tier || 'higher'))
    .filter((g): g is number => g !== null);

  if (grades.length === 0) return null;

  const average = grades.reduce((sum, g) => sum + g, 0) / grades.length;
  return Math.round(average);
}

/**
 * Get improvement suggestions based on current grade
 * @param grade - Current GCSE grade
 * @param tier - Current tier
 * @returns Array of improvement suggestions
 */
export function getImprovementSuggestions(
  grade: number | null,
  tier: 'foundation' | 'higher'
): string[] {
  if (grade === null) {
    return [
      'Focus on basic vocabulary and grammar',
      'Practice simple translation exercises',
      'Review fundamental language structures',
    ];
  }

  if (grade <= 3) {
    return [
      'Build core vocabulary across all themes',
      'Practice reading short texts regularly',
      'Focus on understanding question types',
      'Work on basic grammar patterns',
    ];
  }

  if (grade <= 5) {
    return [
      'Expand vocabulary in weaker themes',
      'Practice inference questions',
      'Improve reading speed while maintaining accuracy',
      'Review complex grammar structures',
    ];
  }

  if (grade <= 7) {
    return [
      'Master advanced vocabulary',
      'Practice with authentic materials',
      'Focus on critical analysis of texts',
      'Work on time management in assessments',
    ];
  }

  return [
    'Challenge yourself with complex texts',
    'Aim for perfect accuracy in all question types',
    'Read widely in the target language',
    'Focus on nuanced understanding',
  ];
}
