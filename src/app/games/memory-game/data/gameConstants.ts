// Background themes
export const THEMES = [
  { name: 'Default', path: '/games/memory-game/backgrounds/default.jpg' },
  { name: 'Spanish Theme', path: '/games/memory-game/backgrounds/everything-spanish.jpg' },
  { name: 'French Theme', path: '/games/memory-game/backgrounds/everything-france.jpg' },
  { name: 'Classroom', path: '/games/memory-game/backgrounds/typical-classroom.jpg' },
  { name: 'Forest', path: '/games/memory-game/backgrounds/forest.jpg' },
  { name: 'Temple', path: '/games/memory-game/backgrounds/temple_of_chaos.jpg' },
  { name: 'Cave', path: '/games/memory-game/backgrounds/cave_of_memories.jpg' }
];

export const DIFFICULTIES = [
  { code: 'easy-1', name: 'Easy (3×2)', pairs: 3, grid: '3x2' },
  { code: 'easy-2', name: 'Easy (4×2)', pairs: 4, grid: '4x2' },
  { code: 'medium-1', name: 'Medium (5×2)', pairs: 5, grid: '5x2' },
  { code: 'medium-2', name: 'Medium (4×3)', pairs: 6, grid: '4x3' },
  { code: 'hard-2', name: 'Hard (4×4)', pairs: 8, grid: '4x4' },
  { code: 'expert', name: 'Expert (5×4)', pairs: 10, grid: '5x4' }
];

// Card data structure interface
export interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
  pairId: number;
  isImage: boolean;
  vocabularyId?: string; // UUID for FSRS compatibility
  firstAttemptTime?: Date;
  word?: string;
  translation?: string;
}
