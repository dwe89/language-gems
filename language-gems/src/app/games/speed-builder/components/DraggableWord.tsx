'use client';

import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { WordItem, ThemeType } from '../types';

interface DraggableWordProps {
  word: WordItem;
  index: number;
  onPickup?: () => void;
  onDrop?: () => void;
  onCorrectPlacement?: () => void;
  onIncorrectPlacement?: () => void;
  disabled?: boolean;
  theme: ThemeType;
}

export const DraggableWord: React.FC<DraggableWordProps> = ({
  word,
  index,
  onPickup,
  onDrop,
  onCorrectPlacement,
  onIncorrectPlacement,
  disabled = false,
  theme = 'default'
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [{ isDragging }, dragRef] = useDrag({
    type: 'WORD',
    item: () => {
      if (onPickup) onPickup();
      return { id: word.id, text: word.text };
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as { targetIndex: number; correct: boolean } | null;
      
      if (onDrop) onDrop();
      
      if (dropResult) {
        setIsCorrect(dropResult.correct);
        
        if (dropResult.correct) {
          if (onCorrectPlacement) onCorrectPlacement();
        } else {
          if (onIncorrectPlacement) onIncorrectPlacement();
        }
      }
    },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  useEffect(() => {
    if (isCorrect !== null) {
      const timer = setTimeout(() => {
        setIsCorrect(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);
  
  const variants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      y: 20,
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.08,
      y: -5,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  // Apply any theme-specific classes or styles
  let className = `draggable-word font-medium px-3 py-2 m-1 text-center flex items-center justify-center`;
  
  if (isDragging) className += ' dragging';
  if (isCorrect === true) className += ' correct-placement';
  if (isCorrect === false) className += ' incorrect-placement';
  if (disabled) className += ' opacity-50 cursor-not-allowed';
  
  return (
    <motion.div
      ref={dragRef}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      layoutId={`word-${word.id}`}
      style={{ "--index": index } as React.CSSProperties}
      className={className}
    >
      {word.text}
    </motion.div>
  );
}; 