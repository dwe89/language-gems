import { GameMode } from '../types';

export interface AdventureTheme {
  name: string;
  background: string;
  cardStyle: string;
  accentColor: string;
  emoji: string;
  description: string;
}

/**
 * Get mode-specific adventure theme
 */
export function getAdventureTheme(gameMode: GameMode): AdventureTheme {
  switch (gameMode) {
    case 'learn':
      return {
        name: 'Crystal Caverns',
        background: 'bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950',
        cardStyle: 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border-2 border-slate-600/30 shadow-2xl',
        accentColor: 'blue',
        emoji: '💎',
        description: 'Discover new vocabulary treasures in the crystal caves'
      };

    case 'recall':
      return {
        name: 'Memory Temple',
        background: 'bg-gradient-to-br from-purple-900 via-violet-950 to-indigo-950',
        cardStyle: 'bg-gradient-to-br from-violet-800/60 to-purple-900/60 backdrop-blur-xl rounded-3xl border-2 border-violet-600/30 shadow-2xl',
        accentColor: 'purple',
        emoji: '🧠',
        description: 'Test your memory in the ancient temple of knowledge'
      };

    case 'speed':
      return {
        name: 'Lightning Arena',
        background: 'bg-gradient-to-br from-yellow-900 via-orange-950 to-red-950',
        cardStyle: 'bg-gradient-to-br from-yellow-800/60 to-orange-900/60 backdrop-blur-xl rounded-3xl border-2 border-yellow-600/30 shadow-2xl',
        accentColor: 'yellow',
        emoji: '⚡',
        description: 'Race against time in the lightning-fast arena'
      };

    case 'multiple_choice':
      return {
        name: 'Mystic Forest',
        background: 'bg-gradient-to-br from-green-900 via-emerald-950 to-teal-950',
        cardStyle: 'bg-gradient-to-br from-emerald-800/60 to-green-900/60 backdrop-blur-xl rounded-3xl border-2 border-emerald-600/30 shadow-2xl',
        accentColor: 'green',
        emoji: '🌟',
        description: 'Choose your path through the mystical forest'
      };

    case 'listening':
      return {
        name: 'Echo Chambers',
        background: 'bg-gradient-to-br from-cyan-900 via-blue-950 to-indigo-950',
        cardStyle: 'bg-gradient-to-br from-cyan-800/60 to-blue-900/60 backdrop-blur-xl rounded-3xl border-2 border-cyan-600/30 shadow-2xl',
        accentColor: 'cyan',
        emoji: '🎧',
        description: 'Listen carefully in the resonating echo chambers'
      };

    case 'dictation':
      return {
        name: 'Scribes Hall',
        background: 'bg-gradient-to-br from-amber-900 via-yellow-950 to-orange-950',
        cardStyle: 'bg-gradient-to-br from-amber-800/60 to-yellow-900/60 backdrop-blur-xl rounded-3xl border-2 border-amber-600/30 shadow-2xl',
        accentColor: 'amber',
        emoji: '📝',
        description: 'Transcribe the ancient words in the scribes hall'
      };

    case 'cloze':
      return {
        name: 'Puzzle Vault',
        background: 'bg-gradient-to-br from-rose-900 via-pink-950 to-purple-950',
        cardStyle: 'bg-gradient-to-br from-rose-800/60 to-pink-900/60 backdrop-blur-xl rounded-3xl border-2 border-rose-600/30 shadow-2xl',
        accentColor: 'rose',
        emoji: '🧩',
        description: 'Complete the missing pieces in the puzzle vault'
      };

    case 'flashcards':
      return {
        name: 'Flip Dimension',
        background: 'bg-gradient-to-br from-teal-900 via-cyan-950 to-blue-950',
        cardStyle: 'bg-gradient-to-br from-teal-800/60 to-cyan-900/60 backdrop-blur-xl rounded-3xl border-2 border-teal-600/30 shadow-2xl',
        accentColor: 'teal',
        emoji: '🔄',
        description: 'Flip between realities in the dimension portal'
      };

    case 'match':
      return {
        name: 'Connection Nexus',
        background: 'bg-gradient-to-br from-violet-900 via-purple-950 to-fuchsia-950',
        cardStyle: 'bg-gradient-to-br from-violet-800/60 to-purple-900/60 backdrop-blur-xl rounded-3xl border-2 border-violet-600/30 shadow-2xl',
        accentColor: 'violet',
        emoji: '🔗',
        description: 'Connect the matching pairs in the nexus network'
      };

    case 'mixed':
      return {
        name: 'Chaos Realm',
        background: 'bg-gradient-to-br from-slate-900 via-gray-950 to-neutral-950',
        cardStyle: 'bg-gradient-to-br from-slate-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl border-2 border-slate-600/30 shadow-2xl',
        accentColor: 'slate',
        emoji: '🌪️',
        description: 'Navigate the ever-changing chaos realm challenges'
      };

    default:
      return {
        name: 'Adventure Realm',
        background: 'bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950',
        cardStyle: 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border-2 border-slate-600/30 shadow-2xl',
        accentColor: 'blue',
        emoji: '🗡️',
        description: 'Embark on your vocabulary adventure'
      };
  }
}

/**
 * Get accent color classes for buttons and interactive elements
 */
export function getAccentColorClasses(accentColor: string, variant: 'button' | 'text' | 'border' | 'bg' = 'button') {
  const colorMap: Record<string, Record<string, string>> = {
    blue: {
      button: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25',
      text: 'text-blue-300',
      border: 'border-blue-400/50',
      bg: 'bg-blue-500/20'
    },
    purple: {
      button: 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/25',
      text: 'text-purple-300',
      border: 'border-purple-400/50',
      bg: 'bg-purple-500/20'
    },
    yellow: {
      button: 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg hover:shadow-yellow-500/25',
      text: 'text-yellow-300',
      border: 'border-yellow-400/50',
      bg: 'bg-yellow-500/20'
    },
    green: {
      button: 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25',
      text: 'text-green-300',
      border: 'border-green-400/50',
      bg: 'bg-green-500/20'
    },
    cyan: {
      button: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-cyan-500/25',
      text: 'text-cyan-300',
      border: 'border-cyan-400/50',
      bg: 'bg-cyan-500/20'
    },
    amber: {
      button: 'bg-amber-500 hover:bg-amber-600 text-black shadow-lg hover:shadow-amber-500/25',
      text: 'text-amber-300',
      border: 'border-amber-400/50',
      bg: 'bg-amber-500/20'
    },
    rose: {
      button: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-rose-500/25',
      text: 'text-rose-300',
      border: 'border-rose-400/50',
      bg: 'bg-rose-500/20'
    },
    teal: {
      button: 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-500/25',
      text: 'text-teal-300',
      border: 'border-teal-400/50',
      bg: 'bg-teal-500/20'
    },
    violet: {
      button: 'bg-violet-500 hover:bg-violet-600 text-white shadow-lg hover:shadow-violet-500/25',
      text: 'text-violet-300',
      border: 'border-violet-400/50',
      bg: 'bg-violet-500/20'
    },
    slate: {
      button: 'bg-slate-500 hover:bg-slate-600 text-white shadow-lg hover:shadow-slate-500/25',
      text: 'text-slate-300',
      border: 'border-slate-400/50',
      bg: 'bg-slate-500/20'
    }
  };

  return colorMap[accentColor]?.[variant] || colorMap.blue[variant];
}
