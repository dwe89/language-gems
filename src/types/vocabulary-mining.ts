// Vocabulary Mining System Types
// Core types for the gamified vocabulary learning system

export type GemType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;
// 0: Unknown, 1: Seen, 2: Recognized, 3: Practiced, 4: Mastered, 5: Expert

export type SessionType = 'practice' | 'review' | 'challenge' | 'assignment';

export interface VocabularyGem {
  id: string;
  term: string;
  translation: string;
  gemType: GemType;
  gemColor: string;
  frequencyScore: number;
  curriculumTags: string[];
  topicTags: string[];
  themeTags: string[];
  imageUrl?: string;
  audioUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  notes?: string;
}

export interface GemCollection {
  id: string;
  studentId: string;
  vocabularyItemId: string;
  gemLevel: number; // 1-10
  masteryLevel: MasteryLevel;
  totalEncounters: number;
  correctEncounters: number;
  incorrectEncounters: number;
  currentStreak: number;
  bestStreak: number;
  lastEncounteredAt?: Date;
  nextReviewAt?: Date;
  spacedRepetitionInterval: number; // days
  spacedRepetitionEaseFactor: number;
  difficultyRating: number; // 1-5
  firstLearnedAt: Date;
  lastMasteredAt?: Date;
  notes?: string;
}

export interface MiningSession {
  id: string;
  studentId: string;
  sessionType: SessionType;
  vocabularyListId?: string;
  assignmentId?: string;
  startedAt: Date;
  endedAt?: Date;
  totalWordsAttempted: number;
  totalWordsCorrect: number;
  gemsCollected: number;
  gemsUpgraded: number;
  sessionScore: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  sessionData: Record<string, any>;
}

export interface TopicPerformance {
  id: string;
  studentId: string;
  topicName: string;
  themeName: string;
  totalWords: number;
  masteredWords: number;
  weakWords: number;
  averageAccuracy: number;
  totalPracticeTime: number;
  lastPracticedAt?: Date;
  masteryPercentage: number;
}

export interface VocabularyAchievement {
  id: string;
  studentId: string;
  achievementType: string;
  achievementName: string;
  achievementDescription?: string;
  achievementIcon?: string;
  achievementColor: string;
  pointsAwarded: number;
  earnedAt: Date;
  metadata: Record<string, any>;
}

export interface DailyGoal {
  id: string;
  studentId: string;
  goalDate: Date;
  targetWords: number;
  targetMinutes: number;
  wordsPracticed: number;
  minutesPracticed: number;
  gemsCollected: number;
  goalCompleted: boolean;
  streakCount: number;
}

export interface ClassAnalytics {
  id: string;
  classId: string;
  teacherId: string;
  analyticsDate: Date;
  totalStudents: number;
  activeStudents: number;
  totalVocabularyItems: number;
  classAverageMastery: number;
  weakTopics: string[];
  strongTopics: string[];
  totalPracticeTime: number;
  totalGemsCollected: number;
  analyticsData: Record<string, any>;
}

// Gem rarity configuration
export const GEM_CONFIG = {
  common: {
    color: '#94a3b8', // slate-400
    name: 'Common',
    icon: '💎',
    minFrequency: 80,
    maxFrequency: 100,
    basePoints: 1,
  },
  uncommon: {
    color: '#22c55e', // green-500
    name: 'Uncommon',
    icon: '🟢',
    minFrequency: 60,
    maxFrequency: 79,
    basePoints: 2,
  },
  rare: {
    color: '#3b82f6', // blue-500
    name: 'Rare',
    icon: '🔵',
    minFrequency: 40,
    maxFrequency: 59,
    basePoints: 5,
  },
  epic: {
    color: '#a855f7', // purple-500
    name: 'Epic',
    icon: '🟣',
    minFrequency: 20,
    maxFrequency: 39,
    basePoints: 10,
  },
  legendary: {
    color: '#f59e0b', // amber-500
    name: 'Legendary',
    icon: '🟡',
    minFrequency: 0,
    maxFrequency: 19,
    basePoints: 25,
  },
} as const;

// Mastery level configuration
export const MASTERY_CONFIG = {
  0: { name: 'Unknown', color: '#6b7280', icon: '❓', description: 'Never encountered' },
  1: { name: 'Seen', color: '#ef4444', icon: '👁️', description: 'Encountered but not learned' },
  2: { name: 'Recognized', color: '#f97316', icon: '🤔', description: 'Can recognize but struggles' },
  3: { name: 'Practiced', color: '#eab308', icon: '📚', description: 'Getting familiar with the word' },
  4: { name: 'Mastered', color: '#22c55e', icon: '✅', description: 'Consistently correct' },
  5: { name: 'Expert', color: '#8b5cf6', icon: '🏆', description: 'Perfect mastery' },
} as const;

// Achievement types
export const ACHIEVEMENT_TYPES = {
  FIRST_GEM: 'first_gem',
  STREAK_MILESTONE: 'streak_milestone',
  MASTERY_MILESTONE: 'mastery_milestone',
  DAILY_GOAL: 'daily_goal',
  WEEKLY_GOAL: 'weekly_goal',
  TOPIC_MASTERY: 'topic_mastery',
  SPEED_DEMON: 'speed_demon',
  PERFECTIONIST: 'perfectionist',
  EXPLORER: 'explorer',
  COLLECTOR: 'collector',
} as const;

// Spaced repetition intervals (in days)
export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 90, 180, 365];

// Performance quality scale for spaced repetition
export const PERFORMANCE_QUALITY = {
  BLACKOUT: 0,      // Complete blackout
  INCORRECT: 1,     // Incorrect response
  DIFFICULT: 2,     // Correct but very difficult
  HESITANT: 3,      // Correct with some hesitation
  EASY: 4,          // Correct with little hesitation
  PERFECT: 5,       // Perfect response
} as const;
