export type WordGuesserSettings = {
  language: string;
  difficulty: string;
  category: string;
  maxAttempts: number;
  customWords?: string[];
};

export type LetterState = 'correct' | 'present' | 'absent' | 'unused';

export type GameSettings = {
  wordLength: number;
  maxAttempts: number;
};

export type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  maxStreak: number;
  winDistribution: number[];
};

export type GuessRow = {
  letter: string;
  state: LetterState;
}[]; 