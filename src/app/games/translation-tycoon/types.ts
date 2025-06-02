export type GameState = 'ready' | 'playing' | 'paused' | 'completed' | 'timeout' | 'gameover';

export type ThemeType = 'default' | 'modern' | 'retro' | 'fantasy';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type TranslationDirection = 'fromNative' | 'toNative';

export interface GameSettings {
  timeLimit: number;
  theme: ThemeType;
  difficulty: DifficultyLevel;
  powerUpsEnabled: boolean;
  vocabularyId: string | null;
  challengeWordsEnabled: boolean;
  translationDirection: TranslationDirection;
  soundEffects: boolean;
  backgroundMusic: boolean;
  startingCurrency: number;
}

export interface GameStats {
  score: number;
  currency: number;
  translationsCompleted: number;
  accuracy: number;
  timeSpent: number;
  streak: number;
  highestStreak: number;
  upgrades: string[];
  challengeWordsCompleted: number;
}

export interface VocabularyItem {
  id: string;
  originalText: string;
  translatedText: string;
  difficulty: DifficultyLevel;
  category?: string;
  isChallenge?: boolean;
}

export interface Building {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  baseIncome: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  effect: string;
  icon: string;
  purchased: boolean;
  active: boolean;
  cooldown: number;
}

export interface BuildingUpgrade {
  id: string;
  name: string;
  description: string;
  price: number;
  incomeMultiplier: number;
  icon: string;
  purchased: boolean;
  level: number;
  maxLevel: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: number;
} 