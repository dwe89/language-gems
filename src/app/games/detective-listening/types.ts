export interface VocabularyItem {
  audio: string;
  correct: string;
  distractors: string[];
  word?: string; // The original word in the target language
}

export interface CaseData {
  [language: string]: VocabularyItem[];
}

export interface GameData {
  [caseType: string]: CaseData;
}

export interface Evidence {
  id: string;
  audio: string;
  correct: string;
  options: string[];
  answered: boolean;
  isCorrect?: boolean;
  attempts: number;
  word?: string; // The original word in the target language
}

export interface GameProgress {
  currentEvidence: number;
  totalEvidence: number;
  correctAnswers: number;
  evidenceCollected: Evidence[];
}

export interface CaseType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Language {
  id: string;
  name: string;
  flag: string;
  frequency: string;
}

export type GameScreen = 'case-selection' | 'frequency-selection' | 'detective-room' | 'case-solved';

export interface AudioManager {
  playEvidence: (audioFile: string) => Promise<void>;
  stopAudio: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
}
