// TypeScript types for crossword functionality

export interface WordEntry {
  id: string;
  word: string;
  clue: string;
}

export interface PlacedWord {
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
  number: number;
  length: number;
}

export interface GridCell {
  letter: string;
  isBlack: boolean;
  number?: number;
  isStart?: boolean;
  belongsToWords?: number[]; // Array of word numbers this cell belongs to
}

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
}

export interface CrosswordData {
  grid: GridCell[][];
  placedWords: PlacedWord[];
  acrossClues: CrosswordClue[];
  downClues: CrosswordClue[];
  gridSize: {
    rows: number;
    cols: number;
  };
  stats: {
    totalWords: number;
    placedWords: number;
    intersections: number;
  };
}

export interface GenerationOptions {
  maxGridSize?: number;
  minGridSize?: number;
  maxAttempts?: number;
  allowDisconnected?: boolean;
  prioritizeIntersections?: boolean;
}

export interface WordPlacement {
  word: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
  intersections: Array<{
    position: number; // Position in the word
    withWord: string;
    withPosition: number; // Position in the intersecting word
  }>;
}

export interface IntersectionPoint {
  letter: string;
  word1: string;
  word1Position: number;
  word2: string;
  word2Position: number;
  row: number;
  col: number;
}

// Utility types for the generation algorithm
export interface WordCandidate {
  word: string;
  clue: string;
  possiblePlacements: WordPlacement[];
  priority: number; // Higher priority = place first
}

export interface GridBounds {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
}

export interface GenerationState {
  grid: (string | null)[][];
  placedWords: PlacedWord[];
  availableWords: WordEntry[];
  intersections: IntersectionPoint[];
  bounds: GridBounds;
  wordNumber: number;
}

// For the crossword solver/player
export interface PlayerState {
  grid: (string | null)[][];
  selectedCell?: {
    row: number;
    col: number;
  };
  selectedWord?: {
    number: number;
    direction: 'across' | 'down';
  };
  completedWords: Set<number>;
  mistakes: number;
  startTime: Date;
  endTime?: Date;
}

// For crossword validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// For crossword statistics
export interface CrosswordStats {
  averageWordLength: number;
  longestWord: string;
  shortestWord: string;
  totalLetters: number;
  intersectionRatio: number; // Percentage of letters that are intersections
  density: number; // Percentage of grid filled
  difficulty: 'easy' | 'medium' | 'hard';
}

// Export utility functions type
export type CrosswordGenerator = (
  words: WordEntry[],
  options?: GenerationOptions
) => Promise<CrosswordData | null>;

export type CrosswordValidator = (
  data: CrosswordData
) => ValidationResult;

export type CrosswordAnalyzer = (
  data: CrosswordData
) => CrosswordStats;
