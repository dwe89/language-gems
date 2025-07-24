'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';

interface TempleGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TempleGuardianModal({ isOpen, onClose }: TempleGuardianModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <motion.div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <motion.div 
        className="relative bg-gradient-to-b from-amber-900 to-amber-950 max-w-md w-full rounded-xl overflow-hidden border-2 border-amber-600 shadow-2xl z-10"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Temple visual accent */}
        <div className="absolute inset-0 bg-[url('/games/hangman/images/lava-temple/lava-temple-bg.mp4')] opacity-20" />
        
        <div className="relative p-6">
          {/* Header */}
          <h2 className="text-amber-400 text-2xl font-bold mb-4 text-center">TEMPLE GUARDIAN CHALLENGE</h2>
          
          {/* Intro text */}
          <p className="text-amber-200 mb-4">
            You've discovered the ancient Temple of Wrath, guarded by a powerful stone sentinel.
          </p>
          
          {/* Challenge explanation */}
          <div className="mb-6">
            <h3 className="text-amber-400 font-bold mb-2">THE CHALLENGE:</h3>
            <ul className="text-amber-200 space-y-2 list-disc pl-5">
              <li>Decode the ancient word to safely pass through</li>
              <li>Each correct letter strengthens the magical seals (glyphs)</li>
              <li>Each wrong guess awakens the guardian further</li>
            </ul>
          </div>
          
          {/* Warning */}
          <div className="mb-6">
            <h3 className="text-amber-400 font-bold mb-2">BEWARE:</h3>
            <p className="text-amber-200">
              The guardian grows stronger with each mistake. After 6 wrong guesses, 
              he will fully awaken and unleash his power, ending your journey.
            </p>
          </div>
          
          {/* Temple guardian effects list */}
          <div className="mb-6">
            <h3 className="text-amber-400 font-bold mb-2">GUARDIAN AWAKENING STAGES:</h3>
            <ul className="text-amber-200 space-y-1 list-disc pl-5 text-sm">
              <li>First mistake: Guardian's eyes begin to glow</li>
              <li>Second mistake: Temple trembles, disturbing the guardian</li>
              <li>Third mistake: Left pillar begins to crumble</li>
              <li>Fourth mistake: Right pillar begins to crumble</li>
              <li>Fifth mistake: Guardian's mouth opens, energy building up</li>
              <li>Final mistake: Guardian awakens fully and attacks</li>
            </ul>
          </div>
          
          {/* Closing question */}
          <p className="text-amber-300 font-bold text-center mb-6">
            Can you decode the word before the guardian awakens?
          </p>
          
          {/* Begin button */}
          <button
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-amber-100 rounded-lg font-bold transition-colors"
            onClick={() => {
              playSFX('button-click');
              onClose();
            }}
          >
            BEGIN CHALLENGE
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
} 