// Database sentence structure
export interface DatabaseSentence {
  id: string;
  source_language: string;
  source_sentence: string;
  english_translation: string;
  category: string;
  subcategory: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  curriculum_level: 'KS3' | 'KS4' | 'KS5';
  word_count: number;
  complexity_score: number;
}

// Sentence challenge for Word Blast
export interface SentenceChallenge {
  id: string;
  english: string;
  targetLanguage: string;
  targetSentence: string;
  words: string[];
  category: string;
  subcategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  curriculumLevel: 'KS3' | 'KS4' | 'KS5';
}

// Theme configuration
export interface ThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  effects: {
    particles: boolean;
    animations: boolean;
    sounds: boolean;
  };
}

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
  powerUpType?: PowerUpType;
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

export type PowerUpType = 'slowTime' | 'clearDecoys' | 'hintNext' | 'shieldLife' | 'recoverLife';

export type PowerUp = {
  id: string;
  type: PowerUpType;
  icon: string;
  active: boolean;
  cooldown: number;
  duration: number;
  description: string;
};

export type GameState = 'ready' | 'playing' | 'active' | 'paused' | 'completed' | 'timeout' | 'tutorial';

export type GameSettings = {
  timeLimit: number;
  survivalMode: boolean;
  powerUpsEnabled: boolean;
  vocabularyId: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  gemSpeed: number;
  maxGems: number;
  comboMultiplier: number;
  sentenceComplexity: 'simple' | 'medium' | 'complex';
  audioEnabled: boolean;
};

export type GameStats = {
  score: number;
  combo: number;
  maxCombo: number;
  gemsCollected: number;
  gemsMissed: number;
  wordsCollected: number;
  accuracy: number;
  fastestResponse: number;
  totalPlayTime: number;
  timeRemaining: number;
  gemsByType: Record<GemType, number>;
};

export type SoundEffect = {
  name: string;
  src: string;
  volume: number;
  loop: boolean;
};

export type Challenge = {
  english: string;
  spanish: string;
  words: string[];
};

export type GameTheme = {
  name: string;
  background: string;
  gemColors: Record<GemType, string>;
  particleColors: string[];
  music: string;
  soundEffects: SoundEffect[];
}; 