'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Palette } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'default', name: 'Classic', icon: '🎯', accentColor: 'bg-blue-500' },
  { id: 'tokyo', name: 'Tokyo Nights', icon: '🏙️', accentColor: 'bg-pink-600' },
  { id: 'pirate', name: 'Pirate Adventure', icon: '🏴‍☠️', accentColor: 'bg-amber-600' },
  { id: 'space', name: 'Space Explorer', icon: '🚀', accentColor: 'bg-purple-600' },
  { id: 'temple', name: 'Lava Temple', icon: '🏛️', accentColor: 'bg-orange-600' }
];

interface AssignmentThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignmentThemeSelector({
  currentTheme,
  onThemeChange,
  isOpen,
  onClose
}: AssignmentThemeSelectorProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Choose Theme</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {THEME_OPTIONS.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onThemeChange(theme.id);
                onClose();
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                currentTheme === theme.id
                  ? `border-purple-400 bg-purple-500/20 ${theme.accentColor} text-white shadow-lg`
                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{theme.icon}</span>
                <div>
                  <div className="font-semibold">{theme.name}</div>
                  {currentTheme === theme.id && (
                    <div className="text-sm opacity-75">Current theme</div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}