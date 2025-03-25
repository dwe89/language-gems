'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PowerUp, ThemeType } from '../types';
import { LucideIcon } from 'lucide-react';

interface PowerUpButtonProps {
  powerUp: PowerUp;
  theme: ThemeType;
  onClick: () => void;
  disabled?: boolean;
  playSound?: (soundType: 'powerup') => void;
  icon: LucideIcon;
}

export const PowerUpButton: React.FC<PowerUpButtonProps> = ({
  powerUp,
  theme,
  onClick,
  disabled = false,
  playSound,
  icon: Icon
}) => {
  const [isActive, setIsActive] = useState(false);
  const [cooldownPercent, setCooldownPercent] = useState(0);
  
  // Handle activation and cooldown
  const handleClick = () => {
    if (disabled || cooldownPercent > 0) return;
    
    if (playSound) playSound('powerup');
    setIsActive(true);
    setCooldownPercent(100);
    
    onClick();
    
    // Reset active state after a brief period
    setTimeout(() => {
      setIsActive(false);
    }, 1000);
  };
  
  // Cooldown timer effect
  useEffect(() => {
    if (cooldownPercent <= 0) return;
    
    const interval = setInterval(() => {
      setCooldownPercent((prev) => {
        const newValue = prev - (100 / powerUp.cooldown / 10);
        return newValue <= 0 ? 0 : newValue;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [cooldownPercent, powerUp.cooldown]);
  
  return (
    <motion.button
      className={`power-up-button relative p-3 rounded-lg shadow-md 
        ${isActive ? 'active' : ''} 
        ${cooldownPercent > 0 ? 'cooldown' : ''}
        theme-${theme}-powerup`}
      whileHover={{ scale: cooldownPercent > 0 ? 1 : 1.05 }}
      whileTap={{ scale: cooldownPercent > 0 ? 1 : 0.95 }}
      onClick={handleClick}
      disabled={disabled || cooldownPercent > 0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center">
        <Icon size={24} className="mb-1" />
        <span className="text-xs font-medium">{powerUp.type}</span>
      </div>
      
      {cooldownPercent > 0 && (
        <div 
          className="cooldown-overlay absolute bottom-0 left-0 w-full bg-gray-800/50 rounded-b-lg"
          style={{ height: `${cooldownPercent}%` }}
        />
      )}
      
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={false}
        animate={{
          boxShadow: isActive 
            ? ['0px 0px 0px rgba(120, 120, 255, 0)', '0px 0px 20px rgba(120, 120, 255, 0.7)', '0px 0px 0px rgba(120, 120, 255, 0)']
            : '0px 0px 0px rgba(120, 120, 255, 0)'
        }}
        transition={{ duration: 1, times: [0, 0.5, 1] }}
      />
    </motion.button>
  );
}; 