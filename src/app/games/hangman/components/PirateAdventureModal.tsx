'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';

interface PirateAdventureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PirateAdventureModal({ isOpen, onClose }: PirateAdventureModalProps) {
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
        className="relative bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 max-w-md w-full rounded-xl overflow-hidden border-2 border-amber-600 shadow-2xl z-10"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Pirate visual accent */}
        <div className="absolute inset-0 bg-[url('/games/hangman/images/pirate-adventure/pirate-adventure-bg.mp4')] opacity-20" />
        
        {/* Floating boats animation overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 text-4xl animate-bounce">🏴‍☠️</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-pulse">⚓</div>
        </div>
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex flex-col items-center mb-4">
            <div className="inline-block px-3 py-1 bg-amber-900/50 border border-amber-600 rounded-md mb-2">
              <span className="text-amber-300 text-xs">AHOY MATEY!</span>
            </div>
            <h2 className="text-amber-400 text-2xl font-bold text-center">PIRATE ADVENTURE</h2>
          </div>
          
          {/* Intro text */}
          <p className="text-blue-200 mb-4 text-sm leading-relaxed">
            <span className="text-amber-300">[CAPTAIN'S LOG]</span> Ye've stumbled upon a fierce sea battle! Two pirate ships clash on the high seas, and only the smartest buccaneer will claim the treasure.
          </p>
          
          {/* Challenge explanation */}
          <div className="mb-6">
            <h3 className="text-amber-400 font-bold mb-2 text-sm">THE CHALLENGE:</h3>
            <ul className="text-blue-200 space-y-1 list-disc pl-5 text-xs">
              <li>Decode the secret word to win the battle</li>
              <li>Each correct letter strengthens your ship</li>
              <li>Each wrong guess damages your vessel</li>
              <li>Survive 6 mistakes or walk the plank!</li>
            </ul>
          </div>
          
          {/* Ship damage effects */}
          <div className="mb-6">
            <h3 className="text-amber-400 font-bold mb-2 text-sm">SHIP DAMAGE SEQUENCE:</h3>
            <ul className="text-blue-200 space-y-1 list-disc pl-5 text-xs">
              <li>First mistake: Minor hull damage - 83% integrity</li>
              <li>Second mistake: Sail tears - 66% integrity</li>
              <li>Third mistake: Mast damage - 50% integrity</li>
              <li>Fourth mistake: Major hull breach - 33% integrity</li>
              <li>Fifth mistake: Critical damage - 16% integrity</li>
              <li>Final mistake: Ship sinks - Game over!</li>
            </ul>
          </div>
          
          {/* Closing question */}
          <p className="text-amber-300 font-bold text-center mb-6 text-sm">
            Can ye decode the word before yer ship meets Davy Jones' locker?
          </p>
          
          {/* Begin button */}
          <button 
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-amber-100 rounded-lg font-bold transition-all border border-amber-500/50"
            onClick={() => {
              playSFX('button-click');
              onClose();
            }}
          >
            ⚔️ HOIST THE COLORS!
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
