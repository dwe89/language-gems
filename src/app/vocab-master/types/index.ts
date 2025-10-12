// Shared types for VocabMaster game modes

export interface VocabularyWord {
  id: string;
  word?: string;
  spanish?: string;
  english?: string;
  translation?: string;
  part_of_speech?: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  mastery_level?: number;
  startTime?: number;
}

export type GameMode =
  | 'learn'
  | 'recall'
  | 'speed'
  | 'multiple_choice'
  | 'listening'
  | 'cloze'
  | 'typing'
  | 'dictation'
  | 'flashcards'
  | 'match'
  | 'mixed'
  | 'word_builder'
  | 'pronunciation'
  | 'word_race'
  | 'story'
  | 'memory_palace';

export interface GameState {
  currentWordIndex: number;
  currentWord: VocabularyWord | null;
  userAnswer: string;
  selectedChoice: number | null;
  showAnswer: boolean;
  isCorrect: boolean | null;
  score: number;
  totalWords: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  maxStreak: number;
  gameMode: GameMode;
  timeSpent: number;
  startTime: Date;
  wordsLearned: string[];
  wordsStruggling: string[];
  feedback: string;
  audioPlaying: boolean;
  canReplayAudio: boolean;
  audioReplayCount: number;
  isAnswerRevealed: boolean;
  // Adventure mode specific
  gemsCollected: number;
  currentGemType: import('../../../../components/ui/GemIcon').GemType;
  speedModeTimeLeft: number;
  isFlashcardFlipped: boolean;
  // Mode-specific state
  showHint: boolean;
  translationShown: boolean;
  multipleChoiceOptions: MultipleChoiceOption[];
  // Dynamic exercise data for different modes
  currentExerciseData: ExerciseData | null;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ClozeExercise {
  sentence: string;
  blankedSentence: string;
  correctAnswer: string;
  position: number;
}

// Dynamic exercise data for different game modes
export interface ExerciseData {
  type: 'cloze' | 'sentence' | 'multiple_choice' | 'listening' | 'dictation' | 'default';
  correctAnswer: string;
  // Cloze-specific data
  cloze?: {
    sourceSentence: string;
    blankedSentence: string;
    englishTranslation: string;
    sourceLanguage: string;
    targetWord: string;
    wordPosition: number;
    sentenceId: string;
  };
  // Future: other mode-specific data can be added here
  // multipleChoice?: { options: string[]; correctIndex: number; };
  // listening?: { audioUrl: string; transcript: string; };
}

export interface MatchingWord {
  id: number;
  text: string;
  originalWord: VocabularyWord;
}

export interface MatchingPairs {
  spanish: MatchingWord[];
  english: MatchingWord[];
  matched: Set<number>;
  selectedSpanish: number | null;
  selectedEnglish: number | null;
}

export interface GameConfig {
  mode: string;
  vocabulary: VocabularyWord[];
  audioEnabled?: boolean;
  assignmentMode?: boolean;
  assignmentTitle?: string;
  assignmentId?: string;
  enableAudio?: boolean;
  gameSessionId?: string | null;
  userId?: string;
}

export interface GameResult {
  score: number;
  accuracy: number;
  timeSpent: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalWords: number;
  wordsLearned: string[];
  wordsStruggling: string[];
  gemsCollected: number;
  maxStreak: number;
}

// Mode-specific interfaces
export interface ModeComponent {
  gameState: GameState;
  vocabulary: VocabularyWord[];
  onAnswer: (answer: string) => void;
  onNext: () => void;
  playPronunciation: (text: string, language?: 'es' | 'en', word?: VocabularyWord) => void;
  onModeSpecificAction?: (action: string, data?: any) => void;
  onExit?: () => void; // Allow modes to render a Back button
}

export interface ModeConfig {
  id: string;
  name: string;
  component: React.ComponentType<ModeComponent> | null;
  requiresInput: boolean;
  autoAdvance: boolean;
  hasTimer: boolean;
}
