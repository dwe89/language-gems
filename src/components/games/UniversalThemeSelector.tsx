'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Play, Gamepad2, Building2, Ship, Rocket, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  icon: LucideIcon;
  accentColor: string;
  description: string;
  gradient: string;
}

interface UniversalThemeSelectorProps {
  onThemeSelect: (themeId: string) => void;
  gameTitle: string;
  availableThemes?: string[]; // Optional filter for specific games
}

const ALL_THEMES: ThemeOption[] = [
  {
    id: 'default',
    name: 'Classic',
    icon: Gamepad2,
    accentColor: 'bg-blue-500',
    description: 'Clean, timeless design',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'tokyo',
    name: 'Tokyo Nights',
    icon: Building2,
    accentColor: 'bg-pink-600',
    description: 'Neon-lit cyberpunk adventure',
    gradient: 'from-pink-500 to-purple-600'
  },
  {
    id: 'pirate',
    name: 'Pirate Adventure',
    icon: Ship,
    accentColor: 'bg-amber-600',
    description: 'High seas treasure hunt',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'space',
    name: 'Space Explorer',
    icon: Rocket,
    accentColor: 'bg-purple-600',
    description: 'Cosmic journey through stars',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'temple',
    name: 'Lava Temple',
    icon: Flame,
    accentColor: 'bg-orange-600',
    description: 'Ancient temple adventure',
    gradient: 'from-orange-500 to-red-600'
  }
];

export default function UniversalThemeSelector({ 
  onThemeSelect, 
  gameTitle,
  availableThemes 
}: UniversalThemeSelectorProps) {
  // Filter themes if specific ones are provided
  const themes = availableThemes 
    ? ALL_THEMES.filter(theme => availableThemes.includes(theme.id))
    : ALL_THEMES;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center p-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Palette className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">Choose Your Theme</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Select a theme for <span className="font-semibold text-purple-600">{gameTitle}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              🎵 Selecting a theme will enable audio and start your adventure!
            </p>
          </motion.div>
        </div>

        {/* Theme Grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme, index) => {
              const IconComponent = theme.icon;
              return (
                <motion.button
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onThemeSelect(theme.id)}
                  className="relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  
                  {/* Content */}
                  <div className="relative p-6 text-center">
                    {/* Theme Icon */}
                    <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-12 h-12 text-gray-700" strokeWidth={2} />
                    </div>
                    
                    {/* Theme Name */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                      {theme.name}
                    </h3>
                    
                    {/* Theme Description */}
                    <p className="text-sm text-gray-600 mb-4 group-hover:text-gray-700">
                      {theme.description}
                    </p>
                    
                    {/* Play Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${theme.gradient} text-white text-sm font-medium`}>
                        <Play className="h-4 w-4" />
                        Play with {theme.name}
                      </div>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-100 transition-opacity ${theme.accentColor.replace('bg-', 'text-')}`} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 rounded-b-2xl">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Each theme offers a unique visual and audio experience</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
