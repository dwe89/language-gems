'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';

interface TokyoNightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokyoNightsModal({ isOpen, onClose }: TokyoNightsModalProps) {
  const { playSFX } = useAudio(true);

  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Portal to render at the document body level
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      {/* Backdrop with blur effect */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Modal content */}
      <motion.div 
        className="relative bg-gradient-to-b from-slate-900 to-slate-950 max-w-xs w-full rounded-lg overflow-hidden border border-cyan-500 shadow-xl z-10 font-mono"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Cyber visual accent */}
        <div className="absolute inset-0 opacity-10" />
        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none"></div>
        <div className="relative p-3">
          {/* Header */}
          <div className="flex flex-col items-center mb-2">
            <div className="inline-block px-2 py-0.5 bg-cyan-900/50 border border-cyan-500 rounded mb-1">
              <span className="text-cyan-400 text-[10px]">SYSTEM</span>
            </div>
            <h2 className="text-pink-500 text-lg font-bold text-center">NEURAL BREACH</h2>
          </div>
          {/* Essential instructions only */}
          <p className="text-slate-300 mb-2 text-xs leading-snug text-center">
            Guess the password one letter at a time. 6 mistakes = lockout.
          </p>
          <ul className="text-slate-300 list-disc pl-4 text-xs mb-2">
            <li>Correct = progress</li>
            <li>Wrong = danger rises</li>
          </ul>
          <p className="text-cyan-400 text-xs text-center mb-3">Can you crack the code?</p>
          {/* Begin button */}
          <button
            className="w-full py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-cyan-100 rounded font-bold transition-all border border-cyan-500/50 text-xs"
            onClick={() => {
              playSFX('button-click');
              onClose();
            }}
          >
            <span className="mr-1">{'>'}</span>
            INITIATE
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
} 