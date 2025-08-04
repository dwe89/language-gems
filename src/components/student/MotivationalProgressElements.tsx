'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Crown, Zap, Trophy, Target, Rocket, Gem,
  TrendingUp, Award, Heart, Brain, BookOpen, Users,
  ChevronUp, ChevronDown, Sparkles, Gift, Medal,
  Flame, Shield, Mountain, Flag, Lightning
} from 'lucide-react';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface StudentLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPForCurrentLevel: number;
  levelTitle: string;
  levelIcon: React.ComponentType<any>;
  levelColor: string;
  perks: string[];
}

interface XPGain {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
  multiplier?: number;
}

interface MotivationalMessage {
  id: string;
  type: 'encouragement' | 'celebration' | 'milestone' | 'streak' | 'achievement';
  title: string;
  message: string;
  icon: React.ComponentType<any>;
  color: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface MotivationalProgressElementsProps {
  studentId?: string;
  onLevelUp?: (newLevel: number) => void;
  onXPGain?: (xp: number) => void;
}

// =====================================================
// LEVEL SYSTEM CONFIGURATION
// =====================================================

const LEVEL_SYSTEM = {
  1: { title: 'Language Explorer', icon: BookOpen, color: 'from-green-400 to-green-600', xpRequired: 100 },
  2: { title: 'Word Collector', icon: Star, color: 'from-blue-400 to-blue-600', xpRequired: 250 },
  3: { title: 'Grammar Guardian', icon: Shield, color: 'from-purple-400 to-purple-600', xpRequired: 500 },
  4: { title: 'Conversation Starter', icon: Users, color: 'from-pink-400 to-pink-600', xpRequired: 800 },
  5: { title: 'Language Learner', icon: Brain, color: 'from-indigo-400 to-indigo-600', xpRequired: 1200 },
  6: { title: 'Fluency Fighter', icon: Zap, color: 'from-yellow-400 to-yellow-600', xpRequired: 1700 },
  7: { title: 'Culture Connoisseur', icon: Heart, color: 'from-red-400 to-red-600', xpRequired: 2300 },
  8: { title: 'Polyglot Pioneer', icon: Mountain, color: 'from-teal-400 to-teal-600', xpRequired: 3000 },
  9: { title: 'Language Legend', icon: Crown, color: 'from-orange-400 to-orange-600', xpRequired: 4000 },
  10: { title: 'Master Linguist', icon: Trophy, color: 'from-gradient-rainbow', xpRequired: 5500 }
};

// =====================================================
// XP PROGRESS BAR COMPONENT
// =====================================================

const XPProgressBar: React.FC<{
  currentXP: number;
  xpToNextLevel: number;
  totalXPForCurrentLevel: number;
  animated?: boolean;
}> = ({ currentXP, xpToNextLevel, totalXPForCurrentLevel, animated = true }) => {
  const progressPercentage = ((currentXP - totalXPForCurrentLevel) / (xpToNextLevel - totalXPForCurrentLevel)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{currentXP.toLocaleString()} XP</span>
        <span>{xpToNextLevel.toLocaleString()} XP</span>
      </div>
      
      <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
          initial={{ width: animated ? 0 : `${progressPercentage}%` }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: animated ? 2 : 0, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
        
        {/* XP particles */}
        <AnimatePresence>
          {animated && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Sparkles className="h-3 w-3 text-yellow-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center text-xs text-gray-600">
        {Math.round(progressPercentage)}% to next level
      </div>
    </div>
  );
};

// =====================================================
// LEVEL DISPLAY COMPONENT
// =====================================================

const LevelDisplay: React.FC<{
  level: StudentLevel;
  showAnimation?: boolean;
}> = ({ level, showAnimation = false }) => {
  const LevelIcon = level.levelIcon;
  
  return (
    <motion.div
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${level.levelColor} text-white overflow-hidden`}
      animate={showAnimation ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <Crown className="h-16 w-16" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Star className="h-12 w-12" />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <LevelIcon className="h-8 w-8" />
          </div>
          
          <div>
            <div className="text-3xl font-bold student-font-display">
              Level {level.currentLevel}
            </div>
            <div className="text-lg text-white/90">
              {level.levelTitle}
            </div>
          </div>
        </div>
        
        <XPProgressBar
          currentXP={level.currentXP}
          xpToNextLevel={level.xpToNextLevel}
          totalXPForCurrentLevel={level.totalXPForCurrentLevel}
          animated={showAnimation}
        />
        
        {/* Level perks */}
        {level.perks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-white/90 mb-2">Level Perks:</h4>
            <div className="space-y-1">
              {level.perks.map((perk, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-white/80">
                  <Star className="h-3 w-3" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// =====================================================
// XP GAIN ANIMATION COMPONENT
// =====================================================

const XPGainAnimation: React.FC<{
  xpGains: XPGain[];
  onComplete: (id: string) => void;
}> = ({ xpGains, onComplete }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {xpGains.map((gain) => (
          <motion.div
            key={gain.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => {
              setTimeout(() => onComplete(gain.id), 2000);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Gem className="h-4 w-4" />
              <span className="font-bold">
                +{gain.amount} XP
                {gain.multiplier && gain.multiplier > 1 && (
                  <span className="text-yellow-300"> (x{gain.multiplier})</span>
                )}
              </span>
            </div>
            <div className="text-xs text-blue-100">{gain.source}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// =====================================================
// MOTIVATIONAL MESSAGE COMPONENT
// =====================================================

const MotivationalMessage: React.FC<{
  message: MotivationalMessage;
  onDismiss: () => void;
}> = ({ message, onDismiss }) => {
  const MessageIcon = message.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-gradient-to-r ${message.color} rounded-xl p-4 text-white shadow-lg`}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <MessageIcon className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold student-font-display mb-1">
            {message.title}
          </h3>
          <p className="text-sm text-white/90 mb-3">
            {message.message}
          </p>
          
          <div className="flex items-center justify-between">
            {message.action && (
              <button
                onClick={message.action.onClick}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                {message.action.text}
              </button>
            )}
            
            <button
              onClick={onDismiss}
              className="text-white/70 hover:text-white text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// =====================================================
// MAIN MOTIVATIONAL PROGRESS ELEMENTS COMPONENT
// =====================================================

export default function MotivationalProgressElements({
  studentId,
  onLevelUp,
  onXPGain
}: MotivationalProgressElementsProps) {
  const [studentLevel, setStudentLevel] = useState<StudentLevel>({
    currentLevel: 3,
    currentXP: 650,
    xpToNextLevel: 800,
    totalXPForCurrentLevel: 500,
    levelTitle: 'Grammar Guardian',
    levelIcon: Shield,
    levelColor: 'from-purple-400 to-purple-600',
    perks: ['Unlock advanced grammar games', 'Double XP on grammar exercises', 'Special grammar badge']
  });
  
  const [xpGains, setXpGains] = useState<XPGain[]>([]);
  const [motivationalMessages, setMotivationalMessages] = useState<MotivationalMessage[]>([]);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);

  // Simulate XP gains
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 5 seconds
        const sources = [
          'Completed vocabulary quiz',
          'Perfect pronunciation',
          'Daily streak bonus',
          'Achievement unlocked',
          'Assignment completed'
        ];
        
        const newXPGain: XPGain = {
          id: Date.now().toString(),
          amount: Math.floor(Math.random() * 50) + 10,
          source: sources[Math.floor(Math.random() * sources.length)],
          timestamp: new Date(),
          multiplier: Math.random() > 0.8 ? 2 : undefined
        };
        
        setXpGains(prev => [...prev, newXPGain]);
        
        // Update student XP
        setStudentLevel(prev => {
          const newXP = prev.currentXP + newXPGain.amount * (newXPGain.multiplier || 1);
          
          // Check for level up
          if (newXP >= prev.xpToNextLevel) {
            const newLevel = prev.currentLevel + 1;
            const levelConfig = LEVEL_SYSTEM[newLevel as keyof typeof LEVEL_SYSTEM];
            
            if (levelConfig) {
              setShowLevelUpAnimation(true);
              setTimeout(() => setShowLevelUpAnimation(false), 3000);
              
              if (onLevelUp) onLevelUp(newLevel);
              
              // Add level up message
              setMotivationalMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: 'milestone',
                title: 'Level Up!',
                message: `Congratulations! You've reached Level ${newLevel}: ${levelConfig.title}`,
                icon: Crown,
                color: 'from-yellow-400 to-orange-500',
                action: {
                  text: 'View Rewards',
                  onClick: () => console.log('View level rewards')
                }
              }]);
              
              return {
                ...prev,
                currentLevel: newLevel,
                currentXP: newXP,
                xpToNextLevel: levelConfig.xpRequired,
                totalXPForCurrentLevel: prev.xpToNextLevel,
                levelTitle: levelConfig.title,
                levelIcon: levelConfig.icon,
                levelColor: levelConfig.color,
                perks: [`Unlock ${levelConfig.title} features`, 'Special level badge', 'Bonus XP multiplier']
              };
            }
          }
          
          return { ...prev, currentXP: newXP };
        });
        
        if (onXPGain) onXPGain(newXPGain.amount);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [onLevelUp, onXPGain]);

  // Add motivational messages periodically
  useEffect(() => {
    const messages: MotivationalMessage[] = [
      {
        id: '1',
        type: 'encouragement',
        title: 'Keep Going!',
        message: "You're doing great! Every word you learn brings you closer to fluency.",
        icon: Heart,
        color: 'from-pink-400 to-red-500'
      },
      {
        id: '2',
        type: 'streak',
        title: 'Streak Power!',
        message: "Your 7-day streak is amazing! Consistency is the key to language learning.",
        icon: Flame,
        color: 'from-orange-400 to-red-500'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Achievement Hunter!',
        message: "You're so close to unlocking the 'Word Master' achievement. Keep it up!",
        icon: Trophy,
        color: 'from-yellow-400 to-orange-500'
      }
    ];

    const timer = setTimeout(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMotivationalMessages(prev => [...prev, randomMessage]);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleXPGainComplete = (id: string) => {
    setXpGains(prev => prev.filter(gain => gain.id !== id));
  };

  const handleMessageDismiss = (id: string) => {
    setMotivationalMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Level Display */}
      <LevelDisplay 
        level={studentLevel} 
        showAnimation={showLevelUpAnimation}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {studentLevel.currentXP.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total XP</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
            <Crown className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {studentLevel.currentLevel}
          </div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {studentLevel.xpToNextLevel - studentLevel.currentXP}
          </div>
          <div className="text-sm text-gray-600">XP to Next Level</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
            <Rocket className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {Math.round(((studentLevel.currentXP - studentLevel.totalXPForCurrentLevel) / (studentLevel.xpToNextLevel - studentLevel.totalXPForCurrentLevel)) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Progress</div>
        </div>
      </div>

      {/* Motivational Messages */}
      <div className="space-y-4">
        <AnimatePresence>
          {motivationalMessages.map((message) => (
            <MotivationalMessage
              key={message.id}
              message={message}
              onDismiss={() => handleMessageDismiss(message.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* XP Gain Animations */}
      <XPGainAnimation
        xpGains={xpGains}
        onComplete={handleXPGainComplete}
      />
    </div>
  );
}
