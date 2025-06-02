'use client';

import { createContext, useContext, ReactNode } from 'react';

type ThemeContextType = {
  themeId: string;
  themeClasses: {
    background: string;
    accent: string;
    text: string;
    button: string;
    dangerText: string;
    winMessage: string;
    loseMessage: string;
  };
};

const themeData = {
  default: {
    background: 'bg-white',
    accent: 'bg-blue-600',
    text: 'text-gray-800',
    button: 'bg-blue-600 hover:bg-blue-700',
    dangerText: 'Danger Level',
    winMessage: 'Congratulations!',
    loseMessage: 'Game Over',
  },
  tokyo: {
    background: 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950',
    accent: 'bg-pink-600',
    text: 'text-white',
    button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
    dangerText: 'Energy Shield',
    winMessage: 'Mission Complete!',
    loseMessage: 'System Failure!',
  },
  pirate: {
    background: 'bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950',
    accent: 'bg-amber-600',
    text: 'text-white',
    button: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600',
    dangerText: 'Ship Integrity',
    winMessage: 'Treasure Found!',
    loseMessage: 'Ship Sunk!',
  },
  space: {
    background: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black',
    accent: 'bg-purple-600',
    text: 'text-white',
    button: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    dangerText: 'Distance to Ship',
    winMessage: 'Mission Successful!',
    loseMessage: 'Lost in Space!',
  },
  temple: {
    name: 'Lava Temple', 
    background: 'bg-gradient-to-b from-red-800 via-red-900 to-red-950', 
    accent: 'bg-orange-600', 
    accentHover: 'hover:bg-orange-700', 
    text: 'text-white',
    button: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
    textAccent: 'text-orange-400', 
    buttonGradient: 'bg-gradient-to-r from-orange-600 to-red-600', 
    dangerText: 'Floor Stability', 
    winMessage: 'Temple Conquered!', 
    loseMessage: 'Consumed by Lava!',
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