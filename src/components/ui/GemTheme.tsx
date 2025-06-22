'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gem, Diamond, Sparkles, Crown, Star, Zap,
  Trophy, Target, BookOpen, Users, Clock,
  Award, Heart, Brain, Eye, Shield
} from 'lucide-react';

// =====================================================
// GEM THEME CONFIGURATION
// =====================================================

export const GEM_THEME = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87'
    },
    gems: {
      common: {
        color: 'from-blue-400 to-blue-600',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      uncommon: {
        color: 'from-green-400 to-green-600',
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      rare: {
        color: 'from-purple-400 to-purple-600',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      epic: {
        color: 'from-pink-400 to-pink-600',
        bg: 'bg-pink-50',
        text: 'text-pink-600',
        border: 'border-pink-200'
      },
      legendary: {
        color: 'from-yellow-400 to-yellow-600',
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        border: 'border-yellow-200'
      }
    }
  },
  gradients: {
    primary: 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700',
    secondary: 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50',
    mining: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
    crystal: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600',
    treasure: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500'
  },
  animations: {
    sparkle: 'animate-pulse',
    float: 'animate-bounce',
    glow: 'animate-ping'
  }
};

// =====================================================
// GEM COMPONENTS
// =====================================================

interface GemIconProps {
  type: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const GemIcon: React.FC<GemIconProps> = ({ 
  type, 
  size = 'md', 
  animated = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const gemConfig = GEM_THEME.colors.gems[type];
  const icons = {
    common: <Gem className="text-white" />,
    uncommon: <Sparkles className="text-white" />,
    rare: <Star className="text-white" />,
    epic: <Diamond className="text-white" />,
    legendary: <Crown className="text-white" />
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-r ${gemConfig.color} 
        flex items-center justify-center 
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {icons[type]}
    </div>
  );
};

interface GemButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gem';
  gemType?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GemButton: React.FC<GemButtonProps> = ({
  children,
  variant = 'primary',
  gemType = 'common',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white',
    secondary: 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700',
    gem: `bg-gradient-to-r ${GEM_THEME.colors.gems[gemType].color} hover:scale-105 text-white`
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg
        font-medium
        transition-all
        duration-200
        shadow-lg
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

interface GemCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gemType?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const GemCard: React.FC<GemCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  gemType,
  className = '',
  onClick,
  selected = false
}) => {
  const gemConfig = gemType ? GEM_THEME.colors.gems[gemType] : null;

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={`
        bg-white
        rounded-xl
        border-2
        ${selected 
          ? gemConfig 
            ? `${gemConfig.border} ${gemConfig.bg}` 
            : 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
        }
        p-6
        transition-all
        duration-200
        shadow-lg
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>
          {gemType && <GemIcon type={gemType} size="md" />}
        </div>
      )}
      {children}
    </motion.div>
  );
};

interface GemBadgeProps {
  children: React.ReactNode;
  type?: 'achievement' | 'level' | 'streak' | 'score';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const GemBadge: React.FC<GemBadgeProps> = ({
  children,
  type = 'achievement',
  variant = 'primary',
  size = 'md',
  animated = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
    secondary: 'bg-gray-100 text-gray-700',
    success: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
    danger: 'bg-gradient-to-r from-red-400 to-red-600 text-white'
  };

  const typeIcons = {
    achievement: <Award className="h-3 w-3" />,
    level: <Star className="h-3 w-3" />,
    streak: <Zap className="h-3 w-3" />,
    score: <Trophy className="h-3 w-3" />
  };

  return (
    <div 
      className={`
        inline-flex items-center space-x-1
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        font-medium
        shadow-sm
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {typeIcons[type]}
      <span>{children}</span>
    </div>
  );
};

interface GemProgressBarProps {
  value: number;
  max: number;
  label?: string;
  gemType?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const GemProgressBar: React.FC<GemProgressBarProps> = ({
  value,
  max,
  label,
  gemType = 'common',
  size = 'md',
  animated = true,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const gemConfig = GEM_THEME.colors.gems[gemType];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
          className={`${sizeClasses[size]} bg-gradient-to-r ${gemConfig.color} rounded-full`}
        />
      </div>
    </div>
  );
};

// =====================================================
// THEME PROVIDER
// =====================================================

interface GemThemeProviderProps {
  children: React.ReactNode;
  theme?: 'mining' | 'crystal' | 'treasure' | 'default';
}

export const GemThemeProvider: React.FC<GemThemeProviderProps> = ({
  children,
  theme = 'default'
}) => {
  const themeClasses = {
    mining: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white',
    crystal: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50',
    treasure: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50',
    default: 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50'
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme]}`}>
      {children}
    </div>
  );
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export const getGemTypeFromScore = (score: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' => {
  if (score >= 95) return 'legendary';
  if (score >= 85) return 'epic';
  if (score >= 75) return 'rare';
  if (score >= 65) return 'uncommon';
  return 'common';
};

export const getGemTypeFromFrequency = (frequency: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' => {
  if (frequency > 80) return 'common';
  if (frequency > 60) return 'uncommon';
  if (frequency > 40) return 'rare';
  if (frequency > 20) return 'epic';
  return 'legendary';
};

export const formatGemCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export const getAchievementRarity = (type: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' => {
  const rarityMap: Record<string, 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'> = {
    'first_game': 'common',
    'perfect_score': 'rare',
    'speed_demon': 'epic',
    'week_warrior': 'rare',
    'improvement_surge': 'epic',
    'milestone_100': 'epic',
    'milestone_500': 'legendary'
  };
  
  return rarityMap[type] || 'common';
};
