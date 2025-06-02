'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeType } from '../types';
import { Laptop, Castle, Ship, Rocket, Monitor, Cpu, Anchor, TreePine, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  playSound?: (soundType: 'ui') => void;
}

interface ThemeOption {
  value: ThemeType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const themes: ThemeOption[] = [
  { 
    value: 'default', 
    label: 'Default', 
    icon: <Monitor size={20} />,
    description: 'Clean, minimal design'
  },
  { 
    value: 'cyber', 
    label: 'Cyber City', 
    icon: <Cpu size={20} />,
    description: 'Neon-lit futuristic style'
  },
  { 
    value: 'medieval', 
    label: 'Medieval', 
    icon: <Sparkles size={20} />,
    description: 'Ancient castle vibes'
  },
  { 
    value: 'pirate', 
    label: 'Pirate', 
    icon: <Anchor size={20} />,
    description: 'High seas adventure'
  },
  { 
    value: 'space', 
    label: 'Space', 
    icon: <Rocket size={20} />,
    description: 'Cosmic exploration theme'
  },
  { 
    value: 'forest', 
    label: 'Forest', 
    icon: <TreePine size={20} />,
    description: 'Serene natural environment'
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  playSound
}) => {
  const handleThemeChange = (theme: ThemeType) => {
    if (playSound) playSound('ui');
    onSelectTheme(theme);
  };
  
  return (
    <div className="theme-selector">
      <h3 className="text-lg font-semibold mb-2">Choose Theme</h3>
      <div className="theme-options flex flex-wrap gap-2 justify-center">
        {themes.map((theme) => (
          <motion.button
            key={theme.value}
            className={`theme-option p-3 rounded-lg flex flex-col items-center transition-all duration-300 ${
              currentTheme === theme.value 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/70'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeChange(theme.value)}
            aria-label={`Select ${theme.label} theme`}
            title={theme.description}
          >
            {theme.icon}
            <span className="mt-1 text-sm">{theme.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}; 