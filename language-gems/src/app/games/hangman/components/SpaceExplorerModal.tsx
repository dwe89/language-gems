'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface SpaceExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpaceExplorerModal({ isOpen, onClose }: SpaceExplorerModalProps) {
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
            <span className="text-cyan-300">[CAPTAIN'S LOG]</span> You've embarked on a critical mission to decrypt an alien language sequence while your oxygen supply is limited. Your spacewalk has taken you from your ship – and with each mistake, you drift further away.
          </p>
          
          {/* Challenge explanation */}
          <div className="mb-6">
            <h3 className="text-cyan-300 font-bold mb-2 text-sm">MISSION PARAMETERS:</h3>
            <ul className="text-slate-300 space-y-2 list-disc pl-5 text-sm">
              <li>Decode each letter of the alien sequence correctly</li>
              <li>Each correct letter maintains your ship's tether connection</li>
              <li>Each wrong guess depletes oxygen and increases space drift</li>
            </ul>
          </div>
          
          {/* Warning */}
          <div className="mb-6">
            <h3 className="text-amber-400 font-bold mb-2 text-sm">CRITICAL WARNING:</h3>
            <p className="text-slate-300 text-sm">
              Your EVA suit's oxygen system is directly linked to your ship. After 6 mistakes, 
              you'll drift too far and your oxygen supply will be completely cut off.
            </p>
          </div>
          
          {/* Oxygen System Effects */}
          <div className="mb-6">
            <h3 className="text-cyan-300 font-bold mb-2 text-sm">OXYGEN DEPLETION SEQUENCE:</h3>
            <ul className="text-slate-300 space-y-1 list-disc pl-5 text-xs">
              <li>First mistake: Oxygen level drops to 83% - Minor tether strain</li>
              <li>Second mistake: Oxygen level drops to 66% - Ship communications faltering</li>
              <li>Third mistake: Oxygen level drops to 50% - WARNING: Halfway to critical levels</li>
              <li>Fourth mistake: Oxygen level drops to 33% - Suit systems compromised</li>
              <li>Fifth mistake: Oxygen level drops to 16% - EMERGENCY: Reserve systems activated</li>
              <li>Final mistake: Oxygen level reaches 0% - Tether disconnected, mission failure</li>
            </ul>
          </div>
          
          {/* Ship Systems Box */}
          <div className="p-3 bg-slate-900/70 border border-blue-500 rounded mb-6 text-xs">
            <p className="text-slate-400 mb-2">SHIP MONITORING SYSTEMS:</p>
            <div className="flex flex-col gap-1">
              <div>
                <span className="text-cyan-300">LIFE SUPPORT (O₂)</span>
                <span className="text-slate-400"> - Your remaining oxygen supply</span>
              </div>
              <div>
                <span className="text-green-400">MISSION PROGRESS</span>
                <span className="text-slate-400"> - Distance to mission completion</span>
              </div>
              <div>
                <span className="text-indigo-400">ASTRONAUT POSITION</span>
                <span className="text-slate-400"> - Watch as you drift further from the ship</span>
              </div>
            </div>
          </div>
          
          {/* Closing question */}
          <p className="text-indigo-300 font-bold text-center mb-6">
            Can you decode the alien language before your oxygen runs out?
          </p>
          
          {/* Begin button */}
          <button 
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-cyan-100 rounded-lg font-bold transition-all border border-blue-500/50"
            onClick={onClose}
          >
            INITIATE MISSION
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
} 