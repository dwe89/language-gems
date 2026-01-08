'use client';

import { useAudio } from '../hooks/useAudio';
import { Gamepad2, Building2, Ship, Rocket, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ThemeOption = {
  id: string;
  name: string;
  icon: LucideIcon;
  accentColor: string;
};

type ThemeSelectorProps = {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
};

const themes: ThemeOption[] = [
  {
    id: 'default',
    name: 'Classic',
    icon: Gamepad2,
    accentColor: 'bg-blue-500'
  },
  {
    id: 'tokyo',
    name: 'Tokyo Nights',
    icon: Building2,
    accentColor: 'bg-pink-600'
  },
  {
    id: 'pirate',
    name: 'Pirate Adventure',
    icon: Ship,
    accentColor: 'bg-amber-600'
  },
  {
    id: 'space',
    name: 'Space Explorer',
    icon: Rocket,
    accentColor: 'bg-purple-600'
  },
  {
    id: 'temple',
    name: 'Lava Temple',
    icon: Flame,
    accentColor: 'bg-orange-600'
  }
];

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const { playSFX } = useAudio(true);

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-white mb-4 text-center">Choose Your Adventure Theme</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                playSFX('button-click');
                onThemeChange(theme.id);
              }}
              className={`
                p-4 rounded-2xl flex flex-col items-center gap-3 transition-all transform hover:scale-105 border-2
                ${selectedTheme === theme.id
                  ? 'bg-white/20 border-white/60 text-white shadow-xl backdrop-blur-md ring-2 ring-white/50'
                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 text-white/80'
                }
              `}
            >
              <IconComponent className="w-8 h-8" strokeWidth={2} />
              <span className="text-sm font-medium text-center leading-tight">{theme.name}</span>
              <div className={`w-full h-2 rounded-full ${theme.accentColor} opacity-60`}></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}