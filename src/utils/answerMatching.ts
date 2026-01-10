/**
 * Smart answer matching utilities for assessment grading
 * Handles flexible matching for student answers
 */

/**
 * Normalizes text for comparison by:
 * - Converting to lowercase
 * - Removing extra whitespace
 * - Removing common punctuation
 * - Trimming
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,;.!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if student answer matches the expected answer with flexible matching
 * Handles cases like:
 * - "egg and toast" vs ["eggs", "toast"] - should match
 * - "tomato and cheese" vs ["tomato", "cheese"] - should match
 * - Plural/singular variations
 * - Articles (a, an, the)
 */
export function isAnswerCorrect(
  studentAnswer: string,
  correctAnswer: string | string[],
  options: {
    caseSensitive?: boolean;
    strictMode?: boolean;
    allowPartialCredit?: boolean;
  } = {}
): { isCorrect: boolean; partialCredit?: number; explanation?: string } {
  const {
    caseSensitive = false,
    strictMode = false,
    allowPartialCredit = true
  } = options;

  // Normalize answers
  const normalizedStudent = caseSensitive 
    ? studentAnswer.trim() 
    : normalizeText(studentAnswer);

  // Handle array of correct answers
  const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
  const normalizedCorrect = correctAnswers.map(ans => 
    caseSensitive ? ans.trim() : normalizeText(ans)
  );

  // Exact match check
  if (normalizedCorrect.includes(normalizedStudent)) {
    return { isCorrect: true, explanation: 'Exact match' };
  }

  // If strict mode, no fuzzy matching
  if (strictMode) {
    return { isCorrect: false };
  }

  // Split student answer into words
  const studentWords = normalizedStudent
    .split(/\s+(?:and|,|;)\s+|\s+/)
    .filter(w => w.length > 0 && !['a', 'an', 'the'].includes(w));

  const correctWords = normalizedCorrect.flatMap(ans => 
    ans
      .split(/\s+(?:and|,|;)\s+|\s+/)
      .filter(w => w.length > 0 && !['a', 'an', 'the'].includes(w))
  );

  // Check if all required words are present (order-independent)
  let matchedWords = 0;
  const unmatchedCorrectWords: string[] = [];

  for (const correctWord of correctWords) {
    const found = studentWords.some(studentWord => {
      // Direct match
      if (studentWord === correctWord) return true;
      
      // Plural/singular matching
      if (studentWord === correctWord + 's' || studentWord + 's' === correctWord) return true;
      if (studentWord === correctWord + 'es' || studentWord + 'es' === correctWord) return true;
      
      // Check if student word is very similar (Levenshtein distance <= 1)
      if (Math.abs(studentWord.length - correctWord.length) <= 1) {
        const distance = levenshteinDistance(studentWord, correctWord);
        return distance <= 1;
      }
      
      return false;
    });

    if (found) {
      matchedWords++;
    } else {
      unmatchedCorrectWords.push(correctWord);
    }
  }

  // Calculate match percentage
  const matchPercentage = correctWords.length > 0 
    ? matchedWords / correctWords.length 
    : 0;

  // Full credit if all words matched
  if (matchPercentage === 1) {
    return { 
      isCorrect: true, 
      explanation: 'All required terms present' 
    };
  }

  // Partial credit if most words matched
  if (allowPartialCredit && matchPercentage >= 0.7) {
    return {
      isCorrect: false,
      partialCredit: matchPercentage,
      explanation: `Partial match (${matchedWords}/${correctWords.length} terms correct). Missing: ${unmatchedCorrectWords.join(', ')}`
    };
  }

  return { 
    isCorrect: false,
    explanation: `Insufficient match (${matchedWords}/${correctWords.length} terms). Expected: ${correctAnswers.join(' or ')}`
  };
}

/**
 * Calculate Levenshtein distance (edit distance) between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Re-grade a question with smart matching
 */
export function regradeQuestion(
  studentAnswer: string,
  correctAnswer: string | string[],
  maxPoints: number = 1
): { score: number; isCorrect: boolean; feedback: string } {
  const result = isAnswerCorrect(studentAnswer, correctAnswer, {
    allowPartialCredit: true,
    strictMode: false
  });

  if (result.isCorrect) {
    return {
      score: maxPoints,
      isCorrect: true,
      feedback: result.explanation || 'Correct answer'
    };
  } else if (result.partialCredit && result.partialCredit > 0) {
    return {
      score: Math.round(maxPoints * result.partialCredit * 10) / 10,
      isCorrect: false,
      feedback: result.explanation || 'Partial credit awarded'
    };
  } else {
    return {
      score: 0,
      isCorrect: false,
      feedback: result.explanation || 'Incorrect answer'
    };
  }
}
