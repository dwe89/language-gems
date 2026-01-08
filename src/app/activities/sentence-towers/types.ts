export type BlockType = 'standard' | 'bonus' | 'challenge' | 'fragile';

export type TowerBlock = {
  id: string;
  type: BlockType;
  word: string;
  translation: string;
  correct: boolean;
  points: number;
  position: number; // position in the tower
  isShaking: boolean;
};

export type TowerLevel = {
  id: string;
  blocks: TowerBlock[];
  completed: boolean;
};

export type GameState = 'ready' | 'playing' | 'paused' | 'levelCompleted' | 'completed' | 'failed';

export type GameMode = 'multiple-choice' | 'typing';

export type TranslationDirection = 'fromNative' | 'toNative';

export type GameSettings = {
  timeLimit: number;
  towerFalling: boolean;
  wordMode: 'vocabulary' | 'sentences';
  difficulty: 'easy' | 'medium' | 'hard';
  vocabularyId: string | null;
  gameMode: GameMode;
  translationDirection: TranslationDirection;
};

export type GameStats = {
  score: number;
  blocksPlaced: number;
  blocksFallen: number;
  currentHeight: number;
  maxHeight: number;
  currentLevel: number;
  accuracy: number;
}; 