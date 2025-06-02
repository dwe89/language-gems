export type WordItem = {
  id: string;
  word: string;
  translation: string;
  correct: boolean;
  points: number;
};

export type PowerUp = {
  id: string;
  type: 'superBoost' | 'timeFreeze' | 'doublePoints';
  icon: string;
  active: boolean;
  cooldown: number;
  description: string;
};

export type GameState = 'ready' | 'playing' | 'paused' | 'completed' | 'timeout';

export type GameSettings = {
  timeLimit: number;
  survivalMode: boolean;
  powerUpsEnabled: boolean;
  vocabularyId: string | null;
}; 