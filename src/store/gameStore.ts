import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface Verb {
  infinitive: string;
  english: string;
  difficulty: number;
  conjugations: {
    [tense: string]: {
      [pronoun: string]: string;
    };
  };
}

interface Opponent {
  id: string;
  name: string;
  sprite: string;
  health: number;
  difficulty: number;
  weapons: string[];
  description: string;
}

interface League {
  id: string;
  name: string;
  description: string;
  minLevel: number;
  maxLevel: number;
  background: string;
  theme: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  verbTypes: string[];
  tenses: string[];
  opponents: Opponent[];
  promotionRequirement: {
    winsNeeded: number;
    accuracyRequired: number;
  };
}

interface PlayerStats {
  level: number;
  experience: number;
  totalWins: number;
  totalLosses: number;
  currentLeague: string;
  accuracy: number;
  longestWinStreak: number;
  currentWinStreak: number;
  masteryCounts: {
    [verbType: string]: number;
  };
}

interface BattleState {
  isInBattle: boolean;
  currentOpponent: Opponent | null;
  playerHealth: number;
  opponentHealth: number;
  currentQuestion: {
    verb: Verb;
    pronoun: string;
    tense: string;
    correctAnswer: string;
    options: string[];
  } | null;
  battleLog: string[];
  roundsWon: number;
  roundsLost: number;
}

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: true;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'spanish' | 'french' | 'german';
}

interface GameStore {
  // Player data
  playerStats: PlayerStats;
  
  // Battle state
  battleState: BattleState;
  
  // Game settings
  settings: GameSettings;
  
  // Leagues and verbs (loaded from JSON)
  leagues: League[];
  verbs: any;
  
  // Actions
  setPlayerStats: (stats: Partial<PlayerStats>) => void;
  setBattleState: (state: Partial<BattleState>) => void;
  setSettings: (settings: Partial<GameSettings>) => void;
  
  // Battle actions
  startBattle: (opponent: Opponent) => void;
  endBattle: (won: boolean) => void;
  takeDamage: (target: 'player' | 'opponent', damage: number) => void;
  addBattleLog: (message: string) => void;
  
  // Progress actions
  gainExperience: (amount: number) => void;
  updateAccuracy: (correct: boolean) => void;
  checkLevelUp: () => boolean;
  
  // Data loading
  loadLeagues: (leagues: League[]) => void;
  loadVerbs: (verbs: any) => void;
}

const initialPlayerStats: PlayerStats = {
  level: 1,
  experience: 0,
  totalWins: 0,
  totalLosses: 0,
  currentLeague: 'bronze_arena',
  accuracy: 0,
  longestWinStreak: 0,
  currentWinStreak: 0,
  masteryCounts: {
    regular: 0,
    stemChanging: 0,
    irregular: 0,
    reflexive: 0
  }
};

const initialBattleState: BattleState = {
  isInBattle: false,
  currentOpponent: null,
  playerHealth: 100,
  opponentHealth: 100,
  currentQuestion: null,
  battleLog: [],
  roundsWon: 0,
  roundsLost: 0
};

const initialSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  animationsEnabled: true,
  difficulty: 'medium',
  language: 'spanish'
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      playerStats: initialPlayerStats,
      battleState: initialBattleState,
      settings: initialSettings,
      leagues: [],
      verbs: null,

      // Basic setters
      setPlayerStats: (stats) =>
        set((state) => ({
          playerStats: { ...state.playerStats, ...stats }
        })),

      setBattleState: (battleState) =>
        set((state) => ({
          battleState: { ...state.battleState, ...battleState }
        })),

      setSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings }
        })),

      // Battle actions
      startBattle: (opponent) =>
        set(() => ({
          battleState: {
            ...initialBattleState,
            isInBattle: true,
            currentOpponent: opponent,
            opponentHealth: opponent.health,
            battleLog: [`Battle started against ${opponent.name}!`]
          }
        })),

      endBattle: (won) => {
        const state = get();
        const newStats = { ...state.playerStats };
        
        if (won) {
          newStats.totalWins += 1;
          newStats.currentWinStreak += 1;
          newStats.longestWinStreak = Math.max(newStats.longestWinStreak, newStats.currentWinStreak);
        } else {
          newStats.totalLosses += 1;
          newStats.currentWinStreak = 0;
        }

        // Keep battle state but mark as ended, preserve health values for victory screen
        set({
          playerStats: newStats,
          battleState: {
            ...state.battleState,
            isInBattle: false,
            battleLog: [...state.battleState.battleLog, won ? 'Victory!' : 'Defeat!']
          }
        });
      },

      takeDamage: (target, damage) =>
        set((state) => {
          const newBattleState = { ...state.battleState };
          if (target === 'player') {
            newBattleState.playerHealth = Math.max(0, newBattleState.playerHealth - damage);
          } else {
            newBattleState.opponentHealth = Math.max(0, newBattleState.opponentHealth - damage);
          }
          return { battleState: newBattleState };
        }),

      addBattleLog: (message) =>
        set((state) => ({
          battleState: {
            ...state.battleState,
            battleLog: [...state.battleState.battleLog, message].slice(-10) // Keep last 10 messages
          }
        })),

      // Progress actions
      gainExperience: (amount) => {
        const state = get();
        const newExp = state.playerStats.experience + amount;
        const newLevel = Math.floor(newExp / 100) + 1; // Level up every 100 XP
        
        set({
          playerStats: {
            ...state.playerStats,
            experience: newExp,
            level: newLevel
          }
        });
      },

      updateAccuracy: (correct) => {
        const state = get();
        const totalAnswers = state.playerStats.totalWins + state.playerStats.totalLosses;
        const correctAnswers = correct ? totalAnswers * (state.playerStats.accuracy / 100) + 1 : totalAnswers * (state.playerStats.accuracy / 100);
        const newAccuracy = totalAnswers > 0 ? (correctAnswers / (totalAnswers + 1)) * 100 : 0;
        
        set({
          playerStats: {
            ...state.playerStats,
            accuracy: Math.round(newAccuracy * 100) / 100 // Round to 2 decimal places
          }
        });
      },

      checkLevelUp: () => {
        const state = get();
        const currentLevel = Math.floor(state.playerStats.experience / 100) + 1;
        return currentLevel > state.playerStats.level;
      },

      // Data loading
      loadLeagues: (leagues) => set({ leagues }),
      loadVerbs: (verbs) => set({ verbs }),
    }),
    {
      name: 'conjugation-duel-storage',
      partialize: (state) => ({
        playerStats: state.playerStats,
        settings: state.settings,
      }),
    }
  )
);
