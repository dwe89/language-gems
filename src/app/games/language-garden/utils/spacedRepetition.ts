interface VocabularyItem {
  id: string;
  originalText: string;
  translatedText: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  contextSentence?: string;
  audioUrl?: string;
  imageUrl?: string;
  masteryLevel: number; // 0-5 for spaced repetition
  lastReviewed: Date;
  reviewCount: number;
  reviewInterval: number;
  easeFactor: number;
}

interface WordDifficulty {
  baseInterval: number;
  difficultyMultiplier: number;
  retentionTarget: number;
}

const DIFFICULTY_SETTINGS: Record<string, WordDifficulty> = {
  easy: { baseInterval: 1, difficultyMultiplier: 1.3, retentionTarget: 0.9 },
  medium: { baseInterval: 1, difficultyMultiplier: 2.5, retentionTarget: 0.8 },
  hard: { baseInterval: 1, difficultyMultiplier: 4.0, retentionTarget: 0.7 }
};

export const calculateNextReviewInterval = (
  word: VocabularyItem,
  wasCorrect: boolean,
  responseTime: number
): number => {
  const difficulty = DIFFICULTY_SETTINGS[word.difficulty];
  const currentInterval = word.reviewInterval || difficulty.baseInterval;
  
  if (wasCorrect) {
    // Successful recall - increase interval
    const speedBonus = responseTime < 3000 ? 1.2 : responseTime > 10000 ? 0.8 : 1.0;
    const masteryBonus = 1 + (word.masteryLevel * 0.1);
    return Math.ceil(currentInterval * difficulty.difficultyMultiplier * speedBonus * masteryBonus);
  } else {
    // Failed recall - reset to shorter interval
    return Math.max(1, Math.ceil(currentInterval * 0.3));
  }
};

export const getOptimalWordForReview = (words: VocabularyItem[]): VocabularyItem => {
  const now = new Date().getTime();
  
  // Calculate urgency score for each word
  const scoredWords = words.map(word => {
    const daysSinceReview = (now - word.lastReviewed.getTime()) / (1000 * 60 * 60 * 24);
    const intervalNeeded = word.reviewInterval || 1;
    const urgencyScore = daysSinceReview / intervalNeeded;
    const difficultyWeight = word.difficulty === 'hard' ? 1.5 : word.difficulty === 'medium' ? 1.2 : 1.0;
    
    return {
      word,
      score: urgencyScore * difficultyWeight * (1 / (word.masteryLevel + 1))
    };
  });

  // Sort by score and return highest priority word
  scoredWords.sort((a, b) => b.score - a.score);
  return scoredWords[0]?.word || words[0];
};

// Backward compatibility alias
export const selectOptimalWord = getOptimalWordForReview;