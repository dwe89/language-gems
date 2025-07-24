export interface VocabItem {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  type: 'correct' | 'decoy';
  theme?: string;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  wordsLearned: number;
  accuracy: number;
  timeLeft: number;
  totalAnswers: number;
  correctAnswers: number;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'success' | 'error' | 'combo' | 'sparkle';
}

export interface ComboEffect {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  timestamp: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  background: string;
  objectStyle: string;
  particleColors: {
    success: string;
    error: string;
    combo: string;
  };
  icon: string;
  description: string;
}

export interface GameSettings {
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number;
  language: string;
  category: string;
  subcategory?: string;
  mode: 'categories' | 'custom';
  customWords?: string[];
}

export type GameState = 'menu' | 'settings' | 'playing' | 'paused' | 'completed' | 'timeout';

export interface GameResult {
  outcome: 'win' | 'loss' | 'timeout';
  score: number;
  wordsLearned: number;
  accuracy: number;
  maxCombo: number;
  timeElapsed: number;
}

// Theme-specific object types
export interface TokyoDataPacket extends VocabItem {
  glitchEffect: boolean;
  hackProgress: number;
}

export interface PirateShip extends VocabItem {
  sailsUp: boolean;
  cannonReady: boolean;
  sinkingProgress: number;
}

export interface SpaceComet extends VocabItem {
  trailLength: number;
  glowIntensity: number;
  orbitRadius: number;
}

export interface TempleTablet extends VocabItem {
  stoneType: 'granite' | 'marble' | 'obsidian';
  crackLevel: number;
  lavaProximity: number;
}

// Audio types
export interface AudioConfig {
  backgroundMusic: boolean;
  soundEffects: boolean;
  volume: number;
  themeMusic: string;
}

// Difficulty configurations
export interface DifficultyConfig {
  objectSpeed: number;
  spawnRate: number;
  decoyCount: number;
  timeBonus: number;
  comboMultiplier: number;
}

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  beginner: {
    objectSpeed: 1,
    spawnRate: 3000,
    decoyCount: 3,
    timeBonus: 5,
    comboMultiplier: 1.2
  },
  intermediate: {
    objectSpeed: 1.5,
    spawnRate: 2500,
    decoyCount: 4,
    timeBonus: 3,
    comboMultiplier: 1.5
  },
  advanced: {
    objectSpeed: 2,
    spawnRate: 2000,
    decoyCount: 5,
    timeBonus: 2,
    comboMultiplier: 2.0
  }
};

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'Classic',
    background: 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950',
    objectStyle: 'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400 shadow-blue-500/50',
    particleColors: {
      success: '#10B981',
      error: '#EF4444',
      combo: '#F59E0B'
    },
    icon: '💎',
    description: 'Classic vocabulary gem collection'
  },
  tokyo: {
    id: 'tokyo',
    name: 'Neon Hack',
    background: 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950',
    objectStyle: 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-400 shadow-pink-500/50',
    particleColors: {
      success: '#EC4899',
      error: '#EF4444',
      combo: '#8B5CF6'
    },
    icon: '📡',
    description: 'Hack the system with data packets'
  },
  pirate: {
    id: 'pirate',
    name: 'Cannon Clash',
    background: 'bg-gradient-to-b from-amber-900 via-orange-900 to-red-900',
    objectStyle: 'bg-gradient-to-r from-amber-700 to-orange-700 border-amber-500 shadow-amber-500/50',
    particleColors: {
      success: '#F59E0B',
      error: '#EF4444',
      combo: '#F97316'
    },
    icon: '🚢',
    description: 'Sink enemy ships with translations'
  },
  space: {
    id: 'space',
    name: 'Comet Catch',
    background: 'bg-gradient-to-b from-purple-900 via-indigo-900 to-black',
    objectStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 shadow-purple-500/50',
    particleColors: {
      success: '#8B5CF6',
      error: '#EF4444',
      combo: '#06B6D4'
    },
    icon: '☄️',
    description: 'Collect cosmic vocabulary comets'
  },
  temple: {
    id: 'temple',
    name: 'Rising Lava Quiz',
    background: 'bg-gradient-to-b from-red-900 via-orange-900 to-yellow-900',
    objectStyle: 'bg-gradient-to-r from-red-700 to-orange-700 border-red-500 shadow-red-500/50',
    particleColors: {
      success: '#F97316',
      error: '#EF4444',
      combo: '#EAB308'
    },
    icon: '🗿',
    description: 'Escape rising lava with stone tablets'
  }
};
