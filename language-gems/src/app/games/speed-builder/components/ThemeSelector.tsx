'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeType } from '../types';
import { Laptop, Castle, Ship, Rocket, Monitor } from 'lucide-react';
import Image from 'next/image';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  playSound?: (soundType: 'ui') => void;
}

const themes: Array<{
  id: ThemeType;
  name: string;
  icon: React.ElementType;
  description: string;
  bgColor: string;
  textColor: string;
  previewImage?: string;
}> = [
  {
    id: 'default',
    name: 'Default',
    icon: Monitor,
    description: 'Clean and simple',
    bgColor: 'bg-gradient-to-r from-blue-50 to-sky-100',
    textColor: 'text-sky-700',
    previewImage: '/images/themes/default-preview.png'
  },
  {
    id: 'cyber',
    name: 'Cyber City',
    icon: Laptop,
    description: 'Futuristic neon style',
    bgColor: 'bg-gradient-to-r from-blue-900 to-cyan-900',
    textColor: 'text-cyan-400',
    previewImage: '/images/themes/cyber-preview.png'
  },
  {
    id: 'medieval',
    name: 'Medieval Quest',
    icon: Castle,
    description: 'Old scroll & stone',
    bgColor: 'bg-gradient-to-r from-amber-100 to-yellow-100',
    textColor: 'text-amber-800',
    previewImage: '/images/themes/medieval-preview.png'
  },
  {
    id: 'pirate',
    name: 'Pirate Adventure',
    icon: Ship,
    description: 'Wooden planks & treasure',
    bgColor: 'bg-gradient-to-r from-amber-700 to-yellow-600',
    textColor: 'text-amber-100',
    previewImage: '/images/themes/pirate-preview.png'
  },
  {
    id: 'space',
    name: 'Space Mission',
    icon: Rocket,
    description: 'Zero gravity floating words',
    bgColor: 'bg-gradient-to-r from-indigo-900 to-purple-900',
    textColor: 'text-indigo-200',
    previewImage: '/images/themes/space-preview.png'
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
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Select Theme</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;
          
          return (
            <motion.div
              key={theme.id}
              className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                isActive ? 'ring-4 ring-indigo-500 scale-105' : 'hover:scale-102'
              }`}
              whileHover={{ 
                scale: isActive ? 1.05 : 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeChange(theme.id)}
            >
              <div className={`${theme.bgColor} p-4 h-full flex flex-col items-center text-center`}>
                {theme.previewImage ? (
                  <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 rounded-lg z-10"></div>
                    <Image 
                      src={theme.previewImage} 
                      alt={`${theme.name} theme`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-full h-24 mb-3 rounded-lg flex items-center justify-center ${theme.bgColor}`}>
                    <Icon size={36} className={theme.textColor} />
                  </div>
                )}
                
                <h4 className={`font-medium text-base ${theme.textColor}`}>{theme.name}</h4>
                <p className="text-xs mt-1 opacity-75">{theme.description}</p>
                
                {isActive && (
                  <div className="absolute bottom-2 right-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      ✓
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}; 