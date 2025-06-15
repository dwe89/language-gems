export type WordItem = {
  id: string;
  text: string;
  index: number;
  translation?: string; // Optional translation of the word
  correct?: boolean; // Track if the word has been placed correctly
}

export type GameState = 'ready' | 'playing' | 'paused' | 'completed' | 'timeout' | 'error';

export type ThemeType = 'cyber' | 'medieval' | 'pirate' | 'space' | 'default' | 'forest' | 'chalkboard' | 'notebook' | 'spanish-street' | 'galaxy-grammar';

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

export type GCSETier = 'Foundation' | 'Higher';

export type GameMode = 'assignment' | 'freeplay';

// GCSE Curriculum Metadata
export type CurriculumMetadata = {
  tier: GCSETier;
  theme: string;
  topic: string;
  unit?: string;
  vocabSet?: string;
  grammarFocus?: string;
  difficultyLevel?: DifficultyLevel;
}

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
  gameMode: GameMode;
  assignmentId?: string | null;
  curriculum?: CurriculumMetadata;
  adaptiveLearning?: boolean;
  showExplanations?: boolean;
}

export type GameStats = {
  score: number;
  wordsPlaced: number;
  accuracy: number;
  timeSpent: number;
  streak: number;
  highestStreak: number;
  completedLevels: number;
  grammarErrors?: { [key: string]: number }; // Track specific grammar error types
  wordUsageErrors?: { [key: string]: number }; // Track word usage errors
}

export type SentenceData = {
  id: string;
  text: string;
  originalText: string;
  translatedText: string;
  language: string;
  difficulty?: DifficultyLevel;
  curriculum?: CurriculumMetadata;
  explanation?: string; // Grammar explanation for this sentence
  hints?: string[]; // Contextual hints for this sentence
  vocabularyWords?: VocabularyWord[];
}

export type VocabularyWord = {
  id: number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
  part_of_speech: string;
}

// Assignment-specific types
export type AssignmentData = {
  id: string;
  title: string;
  description?: string;
  curriculum: CurriculumMetadata;
  sentenceCount: number;
  timeLimit?: number;
  dueDate?: string;
  classId?: string;
}

// Free play configuration
export type FreePlayConfig = {
  selectedTheme?: string;
  selectedTopic?: string;
  selectedTier: GCSETier;
  grammarFocus?: string;
  enableStars: boolean;
  enableLeaderboard: boolean;
  enableAdaptiveLearning: boolean;
}

// Session tracking for analytics
export type GameSession = {
  id: string;
  gameMode: GameMode;
  assignmentId?: string;
  startTime: Date;
  endTime?: Date;
  stats: GameStats;
  sentencesCompleted: SentenceData[];
  curriculum?: CurriculumMetadata;
} 