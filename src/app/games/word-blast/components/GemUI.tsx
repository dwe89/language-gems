'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Star, 
  Zap, 
  Shield, 
  Award,
  Gem,
  Timer,
  Target
} from 'lucide-react';
import { GameStats, GemType, PowerUp } from '../types';

interface GemUIProps {
  gameStats: GameStats;
  timeLeft: number;
  currentSentence: string;
  powerUps: PowerUp[];
  onPowerUpUse: (powerUpId: string) => void;
  combo: number;
  lives?: number;
  survivalMode?: boolean;
}

const GemIcon = ({ type, size = 24, className = "" }: { type: GemType, size?: number, className?: string }) => {
  const gemColors = {
    ruby: 'text-red-500',
    sapphire: 'text-blue-500',
    emerald: 'text-green-500',
    diamond: 'text-white',
    amethyst: 'text-purple-500',
    topaz: 'text-yellow-500'
  };

  return (
    <Gem 
      size={size} 
      className={`${gemColors[type]} ${className}`}
    />
  );
};

const ComboMeter = ({ combo, maxCombo }: { combo: number, maxCombo: number }) => {
  const comboPercentage = Math.min((combo / 10) * 100, 100);
  
  return (
    <div className="relative">
      <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${comboPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <AnimatePresence>
        {combo > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {combo}x COMBO
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {maxCombo > 0 && (
        <div className="text-xs text-slate-400 mt-1 text-center">
          Best: {maxCombo}x
        </div>
      )}
    </div>
  );
};

export const GemUI: React.FC<GemUIProps> = ({
  gameStats,
  timeLeft,
  currentSentence,
  powerUps,
  onPowerUpUse,
  combo,
  lives,
  survivalMode
}) => {
  const timePercentage = Math.max((timeLeft / 60) * 100, 0);
  const isLowTime = timeLeft <= 10;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Left Side - Current Sentence */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 max-w-md"
        >
          <div className="text-sm text-slate-400 mb-1">Translate:</div>
          <div className="text-xl font-bold text-white">{currentSentence}</div>
        </motion.div>

        {/* Right Side - Stats */}
        <div className="flex flex-col items-end space-y-3">
          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 flex items-center space-x-2"
          >
            <Star className="text-yellow-500" size={20} />
            <span className="text-2xl font-bold text-white">{gameStats.score.toLocaleString()}</span>
          </motion.div>

          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              backdrop-blur-sm rounded-xl p-3 border flex items-center space-x-2
              ${isLowTime 
                ? 'bg-red-500/20 border-red-500/30' 
                : 'bg-blue-500/20 border-blue-500/30'
              }
            `}
          >
            <Timer className={`${isLowTime ? 'text-red-500' : 'text-blue-500'}`} size={20} />
            <div className="flex flex-col items-center">
              <span className={`text-lg font-bold ${isLowTime ? 'text-red-400' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${isLowTime ? 'bg-red-500' : 'bg-blue-500'}`}
                  animate={{ width: `${timePercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar - Combo Meter */}
      <div className="absolute bottom-4 left-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50"
        >
          <div className="text-sm text-slate-400 mb-2">Combo</div>
          <ComboMeter combo={combo} maxCombo={gameStats.maxCombo} />
        </motion.div>
      </div>

      {/* Center Combo Effects */}
      <AnimatePresence>
        {combo > 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
              >
                {combo}x
              </motion.div>
              <div className="text-white text-xl font-bold mt-2">
                COMBO BLAST!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
