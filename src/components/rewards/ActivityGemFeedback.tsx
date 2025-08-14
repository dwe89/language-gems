'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Star, Crown } from 'lucide-react';
import { GemRarity } from '@/services/rewards/RewardEngine';

interface ActivityGemFeedbackProps {
  show: boolean;
  rarity: GemRarity;
  xpValue: number;
  onComplete?: () => void;
  duration?: number;
}

const ACTIVITY_GEM_CONFIG = {
  common: {
    icon: Sparkles,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/50',
    message: 'Great job!',
    gradient: 'from-blue-400 to-blue-600'
  },
  uncommon: {
    icon: Zap,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/50',
    message: 'Nice work!',
    gradient: 'from-green-400 to-green-600'
  },
  rare: {
    icon: Star,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-400/50',
    message: 'Excellent!',
    gradient: 'from-purple-400 to-purple-600'
  },
  epic: {
    icon: Crown,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-400/50',
    message: 'Amazing streak!',
    gradient: 'from-orange-400 to-orange-600'
  },
  legendary: {
    icon: Crown,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/50',
    message: 'Incredible!',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  new_discovery: {
    icon: Sparkles,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/50',
    message: 'New discovery!',
    gradient: 'from-yellow-400 to-orange-500'
  }
};

export default function ActivityGemFeedback({
  show,
  rarity,
  xpValue,
  onComplete,
  duration = 2000
}: ActivityGemFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = ACTIVITY_GEM_CONFIG[rarity];
  const Icon = config.icon;

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className={`
            ${config.bgColor} ${config.borderColor} 
            border-2 rounded-xl p-6 backdrop-blur-sm
            shadow-2xl min-w-[200px] text-center
          `}>
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-3"
            >
              <div className={`
                w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient}
                flex items-center justify-center shadow-lg
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className={`${config.color} font-bold text-lg mb-1`}>
                {config.message}
              </h3>
              <p className="text-gray-300 text-sm">
                +{xpValue} XP Activity Gem!
              </p>
            </motion.div>

            {/* Sparkle Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    rotate: [0, 180, 360],
                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 40]
                  }}
                  transition={{ 
                    delay: 0.4 + i * 0.1, 
                    duration: 1,
                    ease: "easeOut"
                  }}
                  className={`absolute top-1/2 left-1/2 w-2 h-2 ${config.color}`}
                >
                  <Sparkles className="w-full h-full" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy integration
export function useActivityGemFeedback() {
  const [feedback, setFeedback] = useState<{
    show: boolean;
    rarity: GemRarity;
    xpValue: number;
  }>({
    show: false,
    rarity: 'common',
    xpValue: 2
  });

  const showActivityGem = (rarity: GemRarity, xpValue: number) => {
    setFeedback({ show: true, rarity, xpValue });
  };

  const hideActivityGem = () => {
    setFeedback(prev => ({ ...prev, show: false }));
  };

  return {
    feedback,
    showActivityGem,
    hideActivityGem
  };
}
