'use client';

import { createContext, useContext, ReactNode } from 'react';

type ThemeContextType = {
  themeId: string;
  themeClasses: {
    background: string;
    accent: string;
    text: string;
    button: string;
    cellEmpty: string;
    cellX: string;
    cellO: string;
    cellWinning: string;
    winMessage: string;
    loseMessage: string;
    tieMessage: string;
  };
};

const themeData = {
  default: {
    background: 'bg-white',
    accent: 'bg-blue-600',
    text: 'text-gray-800',
    button: 'bg-blue-600 hover:bg-blue-700',
    cellEmpty: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300',
    cellX: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 text-blue-600',
    cellO: 'bg-gradient-to-br from-red-100 to-red-200 border-red-200 text-red-600',
    cellWinning: 'bg-gradient-to-br from-yellow-300 to-orange-400 border-yellow-400 shadow-lg shadow-yellow-300/50',
    winMessage: 'Victory!',
    loseMessage: 'Defeat!',
    tieMessage: 'Draw!',
  },
  tokyo: {
    background: 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950',
    accent: 'bg-pink-600',
    text: 'text-white',
    button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
    cellEmpty: 'bg-gradient-to-br from-slate-800/50 to-blue-900/50 border-slate-600 hover:from-pink-900/30 hover:to-purple-900/30 hover:border-pink-500',
    cellX: 'bg-gradient-to-br from-pink-900/60 to-purple-900/60 border-pink-500 text-pink-300',
    cellO: 'bg-gradient-to-br from-blue-900/60 to-cyan-900/60 border-cyan-500 text-cyan-300',
    cellWinning: 'bg-gradient-to-br from-pink-500 to-purple-500 border-pink-400 shadow-lg shadow-pink-500/50',
    winMessage: 'Neural Link Established!',
    loseMessage: 'System Override!',
    tieMessage: 'Network Draw!',
  },
  pirate: {
    background: 'bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950',
    accent: 'bg-amber-600',
    text: 'text-white',
    button: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600',
    cellEmpty: 'bg-gradient-to-br from-blue-800/50 to-blue-900/50 border-blue-600 hover:from-amber-900/30 hover:to-yellow-900/30 hover:border-amber-500',
    cellX: 'bg-gradient-to-br from-amber-800/60 to-yellow-800/60 border-amber-500 text-amber-300',
    cellO: 'bg-gradient-to-br from-red-800/60 to-red-900/60 border-red-500 text-red-300',
    cellWinning: 'bg-gradient-to-br from-amber-500 to-yellow-500 border-amber-400 shadow-lg shadow-amber-500/50',
    winMessage: 'Treasure Claimed!',
    loseMessage: 'Walk the Plank!',
    tieMessage: 'Parley!',
  },
  space: {
    background: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black',
    accent: 'bg-purple-600',
    text: 'text-white',
    button: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    cellEmpty: 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-600 hover:from-purple-800/30 hover:to-indigo-800/30 hover:border-purple-500',
    cellX: 'bg-gradient-to-br from-purple-800/60 to-indigo-800/60 border-purple-500 text-purple-300',
    cellO: 'bg-gradient-to-br from-indigo-800/60 to-blue-900/60 border-indigo-500 text-indigo-300',
    cellWinning: 'bg-gradient-to-br from-purple-500 to-indigo-500 border-purple-400 shadow-lg shadow-purple-500/50',
    winMessage: 'Mission Success!',
    loseMessage: 'Lost in Space!',
    tieMessage: 'Cosmic Balance!',
  },
  temple: {
    name: 'Lava Temple', 
    background: 'bg-gradient-to-b from-red-800 via-red-900 to-red-950', 
    accent: 'bg-orange-600', 
    text: 'text-white',
    button: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
    cellEmpty: 'bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-600 hover:from-orange-900/30 hover:to-red-900/30 hover:border-orange-500',
    cellX: 'bg-gradient-to-br from-orange-800/60 to-red-800/60 border-orange-500 text-orange-300',
    cellO: 'bg-gradient-to-br from-red-800/60 to-red-900/60 border-red-500 text-red-300',
    cellWinning: 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400 shadow-lg shadow-orange-500/50',
    winMessage: 'Temple Mastered!', 
    loseMessage: 'Consumed by Lava!',
    tieMessage: 'Ancient Balance!',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  themeId: 'default',
  themeClasses: themeData.default,
});

export function useTheme() {
  return useContext(ThemeContext);
}

type ThemeProviderProps = {
  themeId: string;
  children: ReactNode;
};

export function ThemeProvider({ themeId, children }: ThemeProviderProps) {
  const themeClasses = themeData[themeId as keyof typeof themeData] || themeData.default;
  
  return (
    <ThemeContext.Provider value={{ themeId, themeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
}
