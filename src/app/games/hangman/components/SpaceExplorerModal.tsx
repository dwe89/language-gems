'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';

interface SpaceExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpaceExplorerModal({ isOpen, onClose }: SpaceExplorerModalProps) {
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <motion.div 
        className="relative bg-gradient-to-b from-indigo-900 to-slate-950 max-w-md w-full rounded-xl overflow-hidden border-2 border-blue-500 shadow-2xl z-10"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Space visual accent */}
        <div className="absolute inset-0 bg-[url('/games/hangman/images/space-explorer/space-explorer-bg.mp4')] opacity-20" />
        
        {/* Star field overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,.2)_2px,transparent_40px)] bg-[length:550px_550px] pointer-events-none"></div>
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex flex-col items-center mb-4">
            <div className="inline-block px-3 py-1 bg-indigo-900/50 border border-blue-500 rounded-md mb-2">
              <span className="text-cyan-300 text-xs">MISSION BRIEFING</span>
            </div>
            <h2 className="text-indigo-300 text-2xl font-bold text-center">DEEP SPACE EXPLORATION</h2>
          </div>
          
          {/* Intro text */}
          <p className="text-slate-300 mb-4 text-sm leading-relaxed">
            <span className="text-cyan-300">[MISSION BRIEFING]</span> You're on a spacewalk to decode an alien sequence. Each wrong guess depletes your oxygen and drifts you further from the ship.
          </p>

          {/* Challenge explanation */}
          <div className="mb-6">
            <h3 className="text-cyan-300 font-bold mb-2 text-sm">MISSION OBJECTIVE:</h3>
            <ul className="text-slate-300 space-y-1 list-disc pl-5 text-sm">
              <li>Decode the alien word correctly</li>
              <li>Survive 6 mistakes or lose oxygen connection</li>
              <li>Watch your oxygen levels and distance from ship</li>
            </ul>
          </div>

          {/* Closing question */}
          <p className="text-indigo-300 font-bold text-center mb-6 text-sm">
            Can you decode the alien language before your oxygen runs out?
          </p>
          
          {/* Begin button */}
          <button
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-cyan-100 rounded-lg font-bold transition-all border border-blue-500/50"
            onClick={() => {
              playSFX('button-click');
              onClose();
            }}
          >
            INITIATE MISSION
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
} 