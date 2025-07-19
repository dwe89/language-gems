'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Opponent {
  id: string;
  name: string;
  sprite: string;
  health: number;
  difficulty: number;
  weapons: string[];
  description: string;
}

interface CharacterSpriteProps {
  type: 'player' | 'opponent';
  opponent?: Opponent;
  health: number;
  maxHealth: number;
  isAttacking: boolean;
}

export default function CharacterSprite({ 
  type, 
  opponent, 
  health, 
  maxHealth, 
  isAttacking 
}: CharacterSpriteProps) {
  const [isHurt, setIsHurt] = useState(false);
  const [prevHealth, setPrevHealth] = useState(health);

  // Detect damage taken
  useEffect(() => {
    if (health < prevHealth) {
      setIsHurt(true);
      setTimeout(() => setIsHurt(false), 300);
    }
    setPrevHealth(health);
  }, [health, prevHealth]);

  // Calculate health percentage for visual effects
  const healthPercentage = (health / maxHealth) * 100;

  if (type === 'player') {
    return (
      <motion.div
        className="relative"
        animate={{
          x: isAttacking ? 20 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Player Character */}
        <motion.div
          className={`w-24 h-32 rounded-lg flex items-center justify-center text-6xl relative ${
            isHurt ? 'animate-pulse' : ''
          }`}
          style={{
            background: isHurt 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            boxShadow: isHurt 
              ? '0 0 20px rgba(239, 68, 68, 0.5)'
              : '0 0 20px rgba(59, 130, 246, 0.3)'
          }}
          animate={{
            scale: isAttacking ? 1.1 : 1,
          }}
        >
          {/* Player Avatar */}
          <span className="filter drop-shadow-lg">⚔️</span>
          
          {/* Damage Flash */}
          <AnimatePresence>
            {isHurt && (
              <motion.div
                className="absolute inset-0 bg-red-500/50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            )}
          </AnimatePresence>

          {/* Low Health Effect */}
          {healthPercentage <= 25 && (
            <motion.div
              className="absolute inset-0 border-2 border-red-500 rounded-lg"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity
              }}
            />
          )}
        </motion.div>

        {/* Attack Effect */}
        <AnimatePresence>
          {isAttacking && (
            <motion.div
              className="absolute -right-8 top-1/2 transform -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.5, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 10 }}
            >
              <span className="text-3xl">💥</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Opponent Character
  return (
    <motion.div
      className="relative"
      animate={{
        x: isAttacking ? -20 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Opponent Character */}
      <motion.div
        className={`w-24 h-32 rounded-lg flex items-center justify-center text-5xl relative ${
          isHurt ? 'animate-pulse' : ''
        }`}
        style={{
          background: isHurt 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
            : getOpponentBackground(opponent?.difficulty || 1),
          boxShadow: isHurt 
            ? '0 0 20px rgba(239, 68, 68, 0.5)'
            : `0 0 20px ${getOpponentGlow(opponent?.difficulty || 1)}`
        }}
        animate={{
          scale: isAttacking ? 1.1 : 1,
        }}
      >
        {/* Opponent Avatar - Show Image or Emoji Fallback */}
        {opponent?.sprite ? (
          <img 
            src={`/images/battle/${opponent.sprite}`}
            alt={opponent.name}
            className="w-full h-full object-contain filter drop-shadow-lg"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.emoji-fallback')) {
                const emoji = document.createElement('span');
                emoji.className = 'emoji-fallback filter drop-shadow-lg text-5xl';
                emoji.textContent = getOpponentEmoji(opponent?.difficulty || 1);
                parent.appendChild(emoji);
              }
            }}
          />
        ) : (
          <span className="filter drop-shadow-lg">
            {getOpponentEmoji(opponent?.difficulty || 1)}
          </span>
        )}
        
        {/* Damage Flash */}
        <AnimatePresence>
          {isHurt && (
            <motion.div
              className="absolute inset-0 bg-red-500/50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Low Health Effect */}
        {healthPercentage <= 25 && (
          <motion.div
            className="absolute inset-0 border-2 border-red-500 rounded-lg"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity
            }}
          />
        )}

        {/* Difficulty Indicator */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-800">
          {opponent?.difficulty || 1}
        </div>
      </motion.div>

      {/* Attack Effect */}
      <AnimatePresence>
        {isAttacking && (
          <motion.div
            className="absolute -left-8 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -10 }}
          >
            <span className="text-3xl">💥</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opponent Name */}
      <div className="text-center mt-2">
        <span className="text-white text-sm font-medium">
          {opponent?.name || 'Enemy'}
        </span>
      </div>
    </motion.div>
  );
}

// Helper functions for opponent styling
function getOpponentBackground(difficulty: number): string {
  switch (difficulty) {
    case 1: return 'linear-gradient(135deg, #cd7f32, #8b4513)'; // Bronze
    case 2: return 'linear-gradient(135deg, #c0c0c0, #808080)'; // Silver  
    case 3: return 'linear-gradient(135deg, #ffd700, #daa520)'; // Gold
    case 4: return 'linear-gradient(135deg, #b9f2ff, #4169e1)'; // Diamond
    case 5: return 'linear-gradient(135deg, #9b59b6, #8e44ad)'; // Legendary
    default: return 'linear-gradient(135deg, #6b7280, #4b5563)'; // Default
  }
}

function getOpponentGlow(difficulty: number): string {
  switch (difficulty) {
    case 1: return 'rgba(205, 127, 50, 0.3)'; // Bronze
    case 2: return 'rgba(192, 192, 192, 0.3)'; // Silver
    case 3: return 'rgba(255, 215, 0, 0.3)'; // Gold
    case 4: return 'rgba(185, 242, 255, 0.3)'; // Diamond
    case 5: return 'rgba(155, 89, 182, 0.3)'; // Legendary
    default: return 'rgba(107, 114, 128, 0.3)'; // Default
  }
}

function getOpponentEmoji(difficulty: number): string {
  switch (difficulty) {
    case 1: return '🛡️'; // Bronze
    case 2: return '⚔️'; // Silver
    case 3: return '🏺'; // Gold (Temple Guardian)
    case 4: return '💎'; // Diamond
    case 5: return '👑'; // Legendary
    default: return '🤖'; // Default
  }
}
