// Mode registry for VocabMaster game modes

import { GameMode, ModeConfig } from '../types';
import { DictationMode } from './DictationMode';
import { ListeningMode } from './ListeningMode';
import { ClozeMode } from './ClozeMode';
import { MatchingMode } from './MatchingMode';
import { SpeedMode } from './SpeedMode';
import { MultipleChoiceMode } from './MultipleChoiceMode';
import { FlashcardsMode } from './FlashcardsMode';
import { LearnMode } from './LearnMode';
import { RecallMode } from './RecallMode';

/**
 * Registry of all available game modes
 */
export const MODE_REGISTRY: Record<GameMode, ModeConfig> = {
  learn: {
    id: 'learn',
    name: 'Learn',
    component: LearnMode as any,
    requiresInput: true,
    autoAdvance: false,
    hasTimer: false
  },

  recall: {
    id: 'recall',
    name: 'Recall',
    component: RecallMode as any,
    requiresInput: true,
    autoAdvance: false,
    hasTimer: false
  },

  typing: {
    id: 'typing',
    name: 'Typing',
    component: LearnMode as any, // Use learn mode for typing
    requiresInput: true,
    autoAdvance: false,
    hasTimer: false
  },

  multiple_choice: {
    id: 'multiple_choice',
    name: 'Multiple Choice',
    component: MultipleChoiceMode as any,
    requiresInput: false,
    autoAdvance: false,
    hasTimer: false
  },

  flashcards: {
    id: 'flashcards',
    name: 'Flashcards',
    component: FlashcardsMode as any,
    requiresInput: false,
    autoAdvance: false,
    hasTimer: false
  },
  
  dictation: {
    id: 'dictation',
    name: 'Dictation',
    component: DictationMode as any,
    requiresInput: true,
    autoAdvance: false,
    hasTimer: false
  },
  
  listening: {
    id: 'listening',
    name: 'Listening',
    component: ListeningMode as any,
    requiresInput: true,
    autoAdvance: false,
    hasTimer: false
  },
  
  cloze: {
    id: 'cloze',
    name: 'Context Practice',
    component: ClozeMode as any,
    requiresInput: true,
    autoAdvance: false,
    hasTimer: false
  },
  
  match: {
    id: 'match',
    name: 'Word Matching',
    component: MatchingMode as any,
    requiresInput: false,
    autoAdvance: true,
    hasTimer: false
  },
  
  speed: {
    id: 'speed',
    name: 'Speed Challenge',
    component: SpeedMode as any,
    requiresInput: true,
    autoAdvance: false,
    hasTimer: true
  }
};

/**
 * Gets mode configuration by game mode
 */
export function getModeConfig(gameMode: GameMode): ModeConfig {
  return MODE_REGISTRY[gameMode];
}

/**
 * Checks if a mode has a custom component
 */
export function hasCustomComponent(gameMode: GameMode): boolean {
  const config = getModeConfig(gameMode);
  return config.component !== null;
}

/**
 * Checks if a mode requires text input
 */
export function requiresInput(gameMode: GameMode): boolean {
  const config = getModeConfig(gameMode);
  return config.requiresInput;
}

/**
 * Checks if a mode auto-advances to next word
 */
export function autoAdvances(gameMode: GameMode): boolean {
  const config = getModeConfig(gameMode);
  return config.autoAdvance;
}

/**
 * Checks if a mode has a timer
 */
export function hasTimer(gameMode: GameMode): boolean {
  const config = getModeConfig(gameMode);
  return config.hasTimer;
}

/**
 * Maps launcher mode IDs to game modes
 */
export function mapLauncherModeToGameMode(launcherMode: string): GameMode {
  switch (launcherMode) {
    case 'learn_new':
    case 'review_weak':
    case 'mixed_review':
      return 'learn';
    case 'context_practice':
      return 'cloze';
    case 'listening_comprehension':
      return 'listening';
    case 'dictation_practice':
      return 'dictation';
    case 'flashcard_review':
      return 'flashcards';
    case 'multiple_choice_quiz':
      return 'multiple_choice';
    case 'speed_challenge':
      return 'speed';
    case 'word_matching':
      return 'match';
    default:
      return 'learn';
  }
}

/**
 * Gets all available modes
 */
export function getAllModes(): ModeConfig[] {
  return Object.values(MODE_REGISTRY);
}

/**
 * Gets modes that require custom components
 */
export function getCustomModes(): ModeConfig[] {
  return getAllModes().filter(mode => mode.component !== null);
}
