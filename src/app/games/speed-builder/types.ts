export type WordItem = {
  id: string;
  text: string;
  index: number;
  translation?: string; // Optional translation of the word
  correct?: boolean; // Track if the word has been placed correctly
}

export type GameState = 'ready' | 'playing' | 'paused' | 'completed' | 'timeout' | 'error';

export type ThemeType = 'cyber' | 'medieval' | 'pirate' | 'space' | 'default' | 'forest';

export type PowerUpType = 'shuffle' | 'hint' | 'glow' | 'timeBoost';

export type PowerUp = {
  id: string;
  type: PowerUpType;
  active: boolean;
  cooldown: number;
  description: string;
  icon: string;
}

export type TranslationDirection = 'fromNative' | 'toNative';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameSettings = {
  timeLimit: number;
  ghostMode: boolean;
  ghostDuration: number; // How long the sentence is visible in ghost mode (seconds)
  theme: ThemeType;
  difficulty: DifficultyLevel;
  powerUpsEnabled: boolean;
  vocabularyId: string | null;
  translationDirection: TranslationDirection;
  soundEffects: boolean;
  backgroundMusic: boolean;
  persistCustomSentence?: boolean;
}

export type GameStats = {
  score: number;
  wordsPlaced: number;
  accuracy: number;
  timeSpent: number;
  streak: number;
  highestStreak: number;
  completedLevels: number;
}

export type SentenceData = {
  id: string;
  text: string;
  originalText: string;
  translatedText: string;
  language: string;
  difficulty?: DifficultyLevel;
}; 