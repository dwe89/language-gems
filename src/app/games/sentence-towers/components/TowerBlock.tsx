'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TowerBlock as TowerBlockType } from '../types';

interface TowerBlockProps {
  block: TowerBlockType;
  index: number;
  isFalling: boolean;
}

export const TowerBlock: React.FC<TowerBlockProps> = ({ block, index, isFalling }) => {
  const { type, word, isShaking, correct } = block;
  
  // Define animations
  const riseAnimation = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, delay: index * 0.1 }
  };
  
  const fallAnimation = {
    animate: { 
      y: [0, 500], 
      x: [0, Math.random() > 0.5 ? 100 : -100], 
      rotate: [0, Math.random() > 0.5 ? 45 : -45], 
      opacity: [1, 0] 
    },
    transition: { duration: 1.5, ease: "easeIn" }
  };
  
  // Get block style classes
  const getBlockClasses = () => {
    let classes = `tower-block ${type}`;
    
    if (isShaking) classes += ' shaking';
    if (isFalling) classes += ' falling';
    if (correct !== undefined) {
      classes += correct ? ' correct' : ' incorrect';
    }
    
    return classes;
  };
  
  return (
    <motion.div
      className={getBlockClasses()}
      {...(isFalling ? fallAnimation : riseAnimation)}
      style={{ zIndex: 100 - index }}
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-white font-semibold text-lg">{word}</span>
      </div>
    </motion.div>
  );
}; 