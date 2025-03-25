'use client';

import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { WordItem, ThemeType } from '../types';

interface WordTargetProps {
  index: number;
  expectedWordId: string | null;
  onDrop: (wordId: string, targetIndex: number, correct: boolean) => void;
  isOccupied: boolean;
  placedWord: WordItem | null;
  highlightAsNext?: boolean;
  theme: ThemeType;
}

export const WordTarget: React.FC<WordTargetProps> = ({
  index,
  expectedWordId,
  onDrop,
  isOccupied,
  placedWord,
  highlightAsNext = false,
  theme = 'default'
}) => {
  // Setup the drop target
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'WORD',
    drop: (item: { id: string; text: string }) => {
      const isCorrect = item.id === expectedWordId;
      onDrop(item.id, index, isCorrect);
      return { targetIndex: index, correct: isCorrect };
    },
    canDrop: () => !isOccupied,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  
  // Determine classes based on state
  let className = `word-target p-3 rounded-lg m-1`;
  if (canDrop && !isOccupied) className += ' can-drop';
  if (isOver) className += ' is-over';
  if (highlightAsNext) className += ' pulse-animation';
  
  const dropIndicatorVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 0.8,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };
  
  const wordPlaceholderVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 17
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.2
      } 
    }
  };
  
  return (
    <motion.div
      ref={dropRef}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          delay: index * 0.03,
          duration: 0.3
        }
      }}
      exit={{ opacity: 0, y: -10 }}
    >
      {isOccupied && placedWord ? (
        <motion.div
          variants={wordPlaceholderVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`w-full text-center font-medium ${placedWord.correct ? 'text-green-600' : 'text-red-500'}`}
        >
          {placedWord.text}
        </motion.div>
      ) : (
        <>
          {canDrop && (
            <motion.div
              variants={dropIndicatorVariants}
              initial="hidden"
              animate={isOver ? "visible" : "hidden"}
              className="absolute inset-0 rounded-lg bg-blue-100 bg-opacity-50 border-2 border-blue-300 border-dashed pointer-events-none"
            />
          )}
          <div className="h-8 w-full min-w-[80px]"></div>
        </>
      )}
    </motion.div>
  );
}; 