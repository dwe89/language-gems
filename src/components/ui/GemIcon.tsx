import React from 'react';
import { motion } from 'framer-motion';

export type GemType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface GemIconProps {
  type: GemType;
  size?: 'small' | 'medium' | 'large' | 'xl';
  animated?: boolean;
  collected?: boolean;
  className?: string;
}

const GemIcon: React.FC<GemIconProps> = ({ 
  type, 
  size = 'medium', 
  animated = false, 
  collected = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const gemConfigs = {
    common: {
      primaryColor: '#3B82F6',
      secondaryColor: '#60A5FA',
      accentColor: '#93C5FD',
      shadowColor: '#1E40AF',
      name: 'Common Gem'
    },
    uncommon: {
      primaryColor: '#10B981',
      secondaryColor: '#34D399',
      accentColor: '#6EE7B7',
      shadowColor: '#047857',
      name: 'Uncommon Gem'
    },
    rare: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#A78BFA',
      accentColor: '#C4B5FD',
      shadowColor: '#5B21B6',
      name: 'Rare Gem'
    },
    epic: {
      primaryColor: '#EC4899',
      secondaryColor: '#F472B6',
      accentColor: '#F9A8D4',
      shadowColor: '#BE185D',
      name: 'Epic Gem'
    },
    legendary: {
      primaryColor: '#F59E0B',
      secondaryColor: '#FBBF24',
      accentColor: '#FCD34D',
      shadowColor: '#D97706',
      name: 'Legendary Gem'
    }
  };

  const config = gemConfigs[type];

  const sparkleAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const collectAnimation = {
    scale: [1, 1.3, 1],
    rotate: [0, 360],
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      animate={collected ? collectAnimation : (animated ? sparkleAnimation : {})}
      title={config.name}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gem Shadow */}
        <ellipse
          cx="50"
          cy="85"
          rx="25"
          ry="8"
          fill={config.shadowColor}
          opacity="0.3"
        />
        
        {/* Main Gem Body */}
        <path
          d="M50 15 L70 35 L65 70 L35 70 L30 35 Z"
          fill={`url(#gradient-${type})`}
          stroke={config.primaryColor}
          strokeWidth="1"
        />
        
        {/* Gem Top Facet */}
        <path
          d="M50 15 L70 35 L50 25 Z"
          fill={config.accentColor}
          opacity="0.8"
        />
        
        {/* Gem Left Facet */}
        <path
          d="M50 15 L30 35 L50 25 Z"
          fill={config.secondaryColor}
          opacity="0.9"
        />
        
        {/* Gem Highlight */}
        <path
          d="M45 20 L55 20 L60 30 L40 30 Z"
          fill="white"
          opacity="0.4"
        />
        
        {/* Inner Sparkle */}
        <circle
          cx="48"
          cy="45"
          r="3"
          fill="white"
          opacity="0.6"
        />
        
        <circle
          cx="55"
          cy="50"
          r="2"
          fill="white"
          opacity="0.4"
        />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.accentColor} />
            <stop offset="50%" stopColor={config.primaryColor} />
            <stop offset="100%" stopColor={config.shadowColor} />
          </linearGradient>
        </defs>
      </svg>

      {/* Sparkle Effects for Animated Gems */}
      {animated && (
        <>
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute top-1/2 -right-2 w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </>
      )}

      {/* Special Crown for Legendary Gems */}
      {type === 'legendary' && (
        <svg
          viewBox="0 0 20 20"
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12 L4 6 L7 10 L10 4 L13 10 L16 6 L18 12 Z"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="0.5"
          />
          <circle cx="7" cy="8" r="1" fill="#FFD700" />
          <circle cx="10" cy="6" r="1" fill="#FFD700" />
          <circle cx="13" cy="8" r="1" fill="#FFD700" />
        </svg>
      )}
    </motion.div>
  );
};

export default GemIcon;
