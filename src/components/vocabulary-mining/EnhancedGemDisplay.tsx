'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VocabularyGem } from '../../types/vocabulary-mining';
import { getGemInfo } from '../../utils/vocabulary-mining';

interface EnhancedGemDisplayProps {
  gem: VocabularyGem;
  masteryLevel?: number;
  size?: 'small' | 'medium' | 'large' | 'xl';
  showDetails?: boolean;
  className?: string;
  isReviewing?: boolean;
  onLevelUp?: (newLevel: number) => void;
  showParticles?: boolean;
  interactive?: boolean;
}

interface GemStage {
  stage: number;
  name: string;
  emoji: string;
  description: string;
  color: string;
  glowColor: string;
  scale: number;
  soundFile: string;
}

const GEM_STAGES: GemStage[] = [
  { 
    stage: 1, 
    name: 'Rock', 
    emoji: '🪨', 
    description: 'Initial encounter', 
    color: '#6B7280', 
    glowColor: '#9CA3AF', 
    scale: 1.0,
    soundFile: '/sounds/rock.mp3'
  },
  { 
    stage: 2, 
    name: 'Crystal', 
    emoji: '🔹', 
    description: 'Basic recognition', 
    color: '#3B82F6', 
    glowColor: '#60A5FA', 
    scale: 1.1,
    soundFile: '/sounds/crystal.mp3'
  },
  { 
    stage: 3, 
    name: 'Gemstone', 
    emoji: '💎', 
    description: 'Good understanding', 
    color: '#8B5CF6', 
    glowColor: '#A78BFA', 
    scale: 1.2,
    soundFile: '/sounds/gemstone.mp3'
  },
  { 
    stage: 4, 
    name: 'Jewel', 
    emoji: '💍', 
    description: 'Strong mastery', 
    color: '#F59E0B', 
    glowColor: '#FBBF24', 
    scale: 1.3,
    soundFile: '/sounds/jewel.mp3'
  },
  { 
    stage: 5, 
    name: 'Crown Jewel', 
    emoji: '👑', 
    description: 'Complete mastery', 
    color: '#EF4444', 
    glowColor: '#F87171', 
    scale: 1.4,
    soundFile: '/sounds/crown-jewel.mp3'
  }
];

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

export function EnhancedGemDisplay({ 
  gem, 
  masteryLevel = 1,
  size = 'medium', 
  showDetails = false, 
  className = '',
  isReviewing = false,
  onLevelUp,
  showParticles = false,
  interactive = true
}: EnhancedGemDisplayProps) {
  const gemInfo = getGemInfo(gem.gemType);
  const stage = GEM_STAGES[Math.max(0, Math.min(4, masteryLevel - 1))];
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const levelUpAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl'
  };

  useEffect(() => {
    // Initialize audio files
    audioRef.current = new Audio(stage.soundFile);
    levelUpAudioRef.current = new Audio('/sounds/gem-levelup.mp3');
  }, [stage.soundFile]);

  useEffect(() => {
    if (showParticles) {
      generateParticles();
    }
  }, [showParticles]);

  const generateParticles = () => {
    const particleEmojis = ['✨', '⭐', '💫', '🌟', '💎', '🔥'];
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100, // -100 to 100
      y: Math.random() * 200 - 100,
      emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
      delay: Math.random() * 0.5
    }));
    
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => setParticles([]), 3000);
  };

  const handleLevelUp = (newLevel: number) => {
    setIsLevelingUp(true);
    
    // Play level up sound
    if (levelUpAudioRef.current) {
      levelUpAudioRef.current.play().catch(console.error);
    }
    
    // Generate particles
    generateParticles();
    
    // Call parent callback
    if (onLevelUp) {
      onLevelUp(newLevel);
    }
    
    // Reset level up animation
    setTimeout(() => setIsLevelingUp(false), 2000);
  };

  const playStageSound = () => {
    if (audioRef.current && interactive) {
      audioRef.current.play().catch(console.error);
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none z-20"
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: 0,
              y: 0,
              rotate: 0
            }}
            animate={{ 
              opacity: 0, 
              scale: [0, 1.5, 0],
              x: particle.x,
              y: particle.y,
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5, 
              ease: "easeOut",
              delay: particle.delay
            }}
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <span className="text-lg">{particle.emoji}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Gem Display */}
      <motion.div 
        className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center text-white font-bold
          shadow-lg border-2 border-white/30 relative overflow-hidden
          ${interactive ? 'cursor-pointer' : ''}
        `}
        style={{ 
          backgroundColor: stage.color,
        }}
        title={`${stage.name}: ${gem.term} (Level ${masteryLevel}/5)`}
        animate={{
          scale: isReviewing 
            ? [stage.scale, stage.scale * 1.15, stage.scale] 
            : isHovered && interactive
              ? stage.scale * 1.1
              : stage.scale,
          boxShadow: isReviewing 
            ? [
                `0 0 0px ${stage.glowColor}`, 
                `0 0 30px ${stage.glowColor}`, 
                `0 0 0px ${stage.glowColor}`
              ]
            : `0 0 15px ${stage.glowColor}60`
        }}
        transition={{
          scale: { 
            duration: isReviewing ? 2 : 0.3, 
            repeat: isReviewing ? Infinity : 0,
            ease: "easeInOut"
          },
          boxShadow: { 
            duration: isReviewing ? 2 : 0.3, 
            repeat: isReviewing ? Infinity : 0 
          }
        }}
        whileHover={interactive ? { scale: stage.scale * 1.1 } : {}}
        whileTap={interactive ? { scale: stage.scale * 0.95 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={interactive ? playStageSound : undefined}
      >
        {/* Gem Stage Emoji */}
        <motion.span
          className="text-2xl relative z-10"
          animate={isLevelingUp ? {
            scale: [1, 1.8, 1],
            rotate: [0, 720, 0]
          } : {}}
          transition={{ duration: 2 }}
        >
          {stage.emoji}
        </motion.span>

        {/* Pulsing Glow Effect */}
        {isReviewing && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: stage.glowColor }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.3, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Rainbow Prism Effect for Crown Jewels */}
        {masteryLevel === 5 && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: 'conic-gradient(from 0deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        {/* Sparkle Effect for High Levels */}
        {masteryLevel >= 4 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <div className="absolute top-1 left-1 text-yellow-300 text-xs">✨</div>
            <div className="absolute top-1 right-1 text-yellow-300 text-xs">✨</div>
            <div className="absolute bottom-1 left-1 text-yellow-300 text-xs">✨</div>
            <div className="absolute bottom-1 right-1 text-yellow-300 text-xs">✨</div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Level Up Animation */}
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 2 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              animate={{
                y: [-10, -20, -10],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1,
                repeat: 1
              }}
            >
              🎉 Level Up! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Details */}
      {showDetails && (
        <motion.div 
          className="ml-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="font-medium text-gray-900">{gem.term}</div>
          <div className="text-sm text-gray-600">{gem.translation}</div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">{stage.name}</span>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < masteryLevel ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{stage.description}</div>
        </motion.div>
      )}
    </div>
  );
}

// Utility function to trigger level up animation
export function triggerGemLevelUp(gemId: string, newLevel: number) {
  const event = new CustomEvent('gemLevelUp', { 
    detail: { gemId, newLevel } 
  });
  window.dispatchEvent(event);
}

// Hook to listen for level up events
export function useGemLevelUp(onLevelUp: (gemId: string, newLevel: number) => void) {
  useEffect(() => {
    const handleLevelUp = (event: CustomEvent) => {
      onLevelUp(event.detail.gemId, event.detail.newLevel);
    };

    window.addEventListener('gemLevelUp', handleLevelUp as EventListener);
    return () => {
      window.removeEventListener('gemLevelUp', handleLevelUp as EventListener);
    };
  }, [onLevelUp]);
}
