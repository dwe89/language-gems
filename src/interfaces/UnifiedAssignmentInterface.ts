// Unified Assignment Interface for Language Gems
// This interface standardizes how all games receive and handle vocabulary assignments

export type VocabularySource = 'category' | 'custom_list' | 'manual_selection' | 'assignment';
export type CurriculumLevel = 'KS3' | 'KS4';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type GameMode = 'free_play' | 'assignment' | 'practice';

// Core vocabulary item structure
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  category?: string;
  subcategory?: string;
  part_of_speech?: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  difficulty_level?: DifficultyLevel;
  curriculum_level?: CurriculumLevel;
  metadata?: Record<string, any>;
}

// Assignment-specific vocabulary configuration
export interface AssignmentVocabularyConfig {
  source: VocabularySource;
  categoryId?: string;
  subcategoryId?: string;
  customListId?: string;
  vocabularyItems?: VocabularyItem[];
  wordCount?: number;
  difficultyLevel?: DifficultyLevel;
  curriculumLevel?: CurriculumLevel;
  randomize?: boolean;
  includeAudio?: boolean;
}

// Game-specific configuration that can be customized per assignment
export interface GameSpecificConfig {
  timeLimit?: number; // in seconds, 0 for no limit
  maxAttempts?: number;
  hintsAllowed?: boolean;
  powerUpsEnabled?: boolean;
  showProgress?: boolean;
  autoGrade?: boolean;
  feedbackEnabled?: boolean;
  
  // Game-specific settings
  gameSettings?: {
    // Memory Game
    cardPairs?: number;
    flipTime?: number;
    
    // Hangman
    maxWrongGuesses?: number;
    showWordLength?: boolean;
    
    // Word Scramble
    shuffleCount?: number;
    showHints?: boolean;
    
    // Vocab Blast
    objectSpeed?: number;
    spawnRate?: number;
    
    // Word Guesser
    maxGuesses?: number;
    wordLength?: number;
    
    // Sentence Towers
    typingMode?: boolean;
    doublePoints?: boolean;
  };
}

// Progress tracking configuration
export interface ProgressTrackingConfig {
  trackTime?: boolean;
  trackAttempts?: boolean;
  trackAccuracy?: boolean;
  trackWordsLearned?: boolean;
  trackStreaks?: boolean;
  enableGemProgression?: boolean;
  enableSpacedRepetition?: boolean;
  recordDetailedMetrics?: boolean;
}

// Main assignment interface that games receive
export interface UnifiedAssignment {
  // Assignment identification
  assignmentId: string;
  title: string;
  description?: string;
  
  // Game configuration
  gameType: string;
  gameMode: GameMode;
  gameConfig: GameSpecificConfig;
  
  // Vocabulary configuration
  vocabularyConfig: AssignmentVocabularyConfig;
  
  // Progress tracking
  progressConfig: ProgressTrackingConfig;
  
  // Assignment metadata
  dueDate?: Date;
  createdBy: string;
  classId?: string;
  studentId?: string;
  
  // Status
  status: 'active' | 'completed' | 'overdue' | 'draft';
  startedAt?: Date;
  completedAt?: Date;
}

// Progress data that games should report back
export interface GameProgressData {
  // Session identification
  sessionId: string;
  assignmentId?: string;
  studentId: string;
  gameType: string;
  
  // Performance metrics
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpent: number; // in seconds
  attempts: number;
  
  // Vocabulary-specific progress
  wordsAttempted: number;
  wordsCorrect: number;
  wordsLearned: number;
  currentStreak: number;
  bestStreak: number;
  
  // Detailed word-level progress
  wordProgress: Array<{
    vocabularyId: string;
    word: string;
    translation: string;
    isCorrect: boolean;
    attempts: number;
    responseTime: number;
    hintsUsed: number;
    timestamp: Date;
  }>;
  
  // Game-specific metrics
  gameMetrics?: Record<string, any>;
  
  // Session metadata
  startedAt: Date;
  completedAt?: Date;
  status: 'in_progress' | 'completed' | 'abandoned';
}

// Interface that all games must implement
export interface GameAssignmentInterface {
  // Initialize game with assignment
  initializeAssignment(assignment: UnifiedAssignment): Promise<void>;
  
  // Start game session
  startSession(): Promise<string>; // Returns session ID
  
  // Update progress during gameplay
  updateProgress(progressData: Partial<GameProgressData>): Promise<void>;
  
  // Complete session and submit final progress
  completeSession(finalProgress: GameProgressData): Promise<void>;
  
  // Handle assignment completion
  completeAssignment(): Promise<void>;
  
  // Get current progress
  getCurrentProgress(): GameProgressData;
  
  // Validate assignment compatibility
  validateAssignment(assignment: UnifiedAssignment): boolean;
}

// Service interface for managing assignments
export interface AssignmentService {
  // Get assignment for student
  getAssignment(assignmentId: string, studentId: string): Promise<UnifiedAssignment>;
  
  // Get vocabulary for assignment
  getAssignmentVocabulary(config: AssignmentVocabularyConfig): Promise<VocabularyItem[]>;
  
  // Record game progress
  recordProgress(progressData: GameProgressData): Promise<void>;
  
  // Update assignment status
  updateAssignmentStatus(assignmentId: string, studentId: string, status: string): Promise<void>;
  
  // Get student assignments
  getStudentAssignments(studentId: string, status?: string): Promise<UnifiedAssignment[]>;
  
  // Get assignment analytics
  getAssignmentAnalytics(assignmentId: string): Promise<any>;
}

// Factory function for creating game-specific configurations
export function createGameConfig(gameType: string, customSettings?: any): GameSpecificConfig {
  const baseConfig: GameSpecificConfig = {
    timeLimit: 0,
    maxAttempts: 3,
    hintsAllowed: true,
    powerUpsEnabled: true,
    showProgress: true,
    autoGrade: true,
    feedbackEnabled: true
  };

  // Game-specific defaults
  switch (gameType) {
    case 'memory-game':
      return {
        ...baseConfig,
        gameSettings: {
          cardPairs: 6,
          flipTime: 1000,
          ...customSettings
        }
      };
    
    case 'hangman':
      return {
        ...baseConfig,
        gameSettings: {
          maxWrongGuesses: 6,
          showWordLength: true,
          ...customSettings
        }
      };
    
    case 'word-scramble':
      return {
        ...baseConfig,
        gameSettings: {
          shuffleCount: 3,
          showHints: true,
          ...customSettings
        }
      };
    
    case 'vocab-blast':
      return {
        ...baseConfig,
        gameSettings: {
          objectSpeed: 1.5,
          spawnRate: 2000,
          ...customSettings
        }
      };
    
    case 'word-guesser':
      return {
        ...baseConfig,
        gameSettings: {
          maxGuesses: 6,
          wordLength: 5,
          ...customSettings
        }
      };
    
    case 'sentence-towers':
      return {
        ...baseConfig,
        gameSettings: {
          typingMode: false,
          doublePoints: false,
          ...customSettings
        }
      };
    
    default:
      return { ...baseConfig, gameSettings: customSettings };
  }
}

// Helper function to validate vocabulary configuration
export function validateVocabularyConfig(config: AssignmentVocabularyConfig): boolean {
  if (config.source === 'category' && !config.categoryId) {
    return false;
  }
  
  if (config.source === 'custom_list' && !config.customListId) {
    return false;
  }
  
  if (config.source === 'manual_selection' && (!config.vocabularyItems || config.vocabularyItems.length === 0)) {
    return false;
  }
  
  return true;
}
