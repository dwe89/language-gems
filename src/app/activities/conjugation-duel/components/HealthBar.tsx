'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HealthBarProps {
  current: number;
  max: number;
  label: string;
  color: 'green' | 'red';
}

export default function HealthBar({ current, max, label, color }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      border: 'border-green-600',
      text: 'text-green-700',
      shadow: 'shadow-green-500/50'
    },
    red: {
      bg: 'bg-red-500', 
      border: 'border-red-600',
      text: 'text-red-700',
      shadow: 'shadow-red-500/50'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="w-full max-w-xs">
      {/* Label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-semibold text-sm">{label}</span>
        <span className="text-white text-sm font-mono">
          {Math.max(0, current)}/{max}
        </span>
      </div>
      
      {/* Health Bar Container */}
      <div className="relative">
        <div className={`w-full h-6 bg-gray-800 rounded-full border-2 ${colors.border} overflow-hidden shadow-lg`}>
          {/* Health Bar Fill */}
          <motion.div
            className={`h-full ${colors.bg} relative overflow-hidden`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Animated Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
          
          {/* Damage Flash Effect */}
          {percentage < 30 && (
            <motion.div
              className="absolute inset-0 bg-red-500/20"
              animate={{
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          )}
        </div>
        
        {/* Health Bar Glow Effect */}
        <div className={`absolute inset-0 rounded-full blur-sm opacity-50 ${colors.bg} ${colors.shadow}`} 
             style={{ filter: 'blur(4px)' }} />
      </div>

      {/* Critical Health Warning */}
      {percentage <= 25 && (
        <motion.div
          className="text-center mt-2"
          animate={{
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity
          }}
        >
          <span className="text-red-400 text-xs font-bold uppercase tracking-wide">
            Critical!
          </span>
        </motion.div>
      )}
    </div>
  );
}
