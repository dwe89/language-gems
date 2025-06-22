export type WordItem = {
  id: string;
  word: string;
  translation: string;
  correct: boolean;
  points: number;
  category?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  difficulty?: 'easy' | 'medium' | 'hard';
};

export type GemType = 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz';

export type FallingGem = {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  gemType: GemType;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  scale: number;
  glowing: boolean;
};

export type ComboEffect = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  timestamp: number;
};

export type ParticleEffect = {
  id: string;
  type: 'sparkle' | 'explosion' | 'trail' | 'combo';
  x: number;
  y: number;
  particles: Particle[];
  duration: number;
  timestamp: number;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

export type PowerUp = {
  id: string;
  type: 'gemFreeze' | 'doubleGems' | 'slowMotion' | 'gemMagnet' | 'perfectGem';
  icon: string;
  active: boolean;
  cooldown: number;
  duration: number;
  description: string;
  gemType: GemType;
};

export type GameState = 'ready' | 'playing' | 'paused' | 'completed' | 'timeout' | 'tutorial';

export type GameSettings = {
  timeLimit: number;
  survivalMode: boolean;
  powerUpsEnabled: boolean;
  vocabularyId: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  gemSpeed: number;
  maxGems: number;
  comboMultiplier: number;
};

export type GameStats = {
  score: number;
  combo: number;
  maxCombo: number;
  gemsCollected: number;
  gemsMissed: number;
  accuracy: number;
  fastestResponse: number;
  totalPlayTime: number;
  gemsByType: Record<GemType, number>;
};

export type SoundEffect = {
  name: string;
  src: string;
  volume: number;
  loop: boolean;
};

export type GameTheme = {
  name: string;
  background: string;
  gemColors: Record<GemType, string>;
  particleColors: string[];
  music: string;
  soundEffects: SoundEffect[];
}; 