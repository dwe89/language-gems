'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface TokyoNightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokyoNightsModal({ isOpen, onClose }: TokyoNightsModalProps) {
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
        className="relative bg-gradient-to-b from-slate-900 to-slate-950 max-w-md w-full rounded-xl overflow-hidden border-2 border-cyan-500 shadow-2xl z-10 font-mono"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Cyber visual accent */}
        <div className="absolute inset-0 bg-[url('/games/hangman/images/tokyo-nights/tokyo-nights-bg.mp4')] opacity-20" />
        
        {/* Scanlines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0)_100%)] bg-[length:100%_4px] pointer-events-none"></div>
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex flex-col items-center mb-4">
            <div className="inline-block px-3 py-1 bg-cyan-900/50 border border-cyan-500 rounded-md mb-2">
              <span className="text-cyan-400 text-xs">SYSTEM NOTIFICATION</span>
            </div>
            <h2 className="text-pink-500 text-2xl font-bold text-center">NEURAL NETWORK BREACH</h2>
          </div>
          
          {/* Intro text */}
          <p className="text-slate-300 mb-4 text-sm leading-relaxed">
            <span className="text-cyan-400">[ALERT]</span> You've accessed a secured neural network system in Neo-Tokyo. Your mission: decrypt the passcode before the system security locks you out permanently.
          </p>
          
          {/* Challenge explanation */}
          <div className="mb-6">
            <h3 className="text-cyan-400 font-bold mb-2 text-sm">MISSION PARAMETERS:</h3>
            <ul className="text-slate-300 space-y-2 list-disc pl-5 text-sm">
              <li>Decrypt the hidden password one character at a time</li>
              <li>Each correct guess weakens the security system</li>
              <li>Each wrong attempt triggers stronger countermeasures</li>
            </ul>
          </div>
          
          {/* Warning */}
          <div className="mb-6">
            <h3 className="text-pink-500 font-bold mb-2 text-sm">SECURITY RESPONSE:</h3>
            <p className="text-slate-300 text-sm">
              The system will detect and respond to your breach attempts. After 6 failed attempts, 
              the neural firewall will initiate a complete lockdown, terminating your connection.
            </p>
          </div>
          
          {/* System Response Effects */}
          <div className="mb-6">
            <h3 className="text-cyan-400 font-bold mb-2 text-sm">SYSTEM RESPONSE SEQUENCE:</h3>
            <ul className="text-slate-300 space-y-1 list-disc pl-5 text-xs">
              <li>First mistake: SECURITY BREACH DETECTED - System begins tracing your location</li>
              <li>Second mistake: FIREWALL COMPROMISED - Backup security protocols activated</li>
              <li>Third mistake: SCANNING FOR INTRUDERS - System scans for point of entry</li>
              <li>Fourth mistake: ENCRYPTION FAILURE - Secondary firewalls deployed</li>
              <li>Fifth mistake: SYSTEM ERROR #7734 - Emergency countermeasures initialized</li>
              <li>Final mistake: EMERGENCY LOCKDOWN - Complete system shutdown and connection termination</li>
            </ul>
          </div>
          
          {/* Status indicators explanation */}
          <div className="p-3 bg-black/50 border border-slate-700 rounded mb-6 text-xs">
            <p className="text-slate-400 mb-2">SYSTEM MONITORS:</p>
            <div className="flex flex-col gap-1">
              <div>
                <span className="text-green-400">SECURITY DEFENSE</span>
                <span className="text-slate-400"> - Decreases with each mistake</span>
              </div>
              <div>
                <span className="text-blue-400">SYSTEM STABILITY</span>
                <span className="text-slate-400"> - Indicates system integrity</span>
              </div>
              <div>
                <span className="text-red-400">HACK PROGRESS</span>
                <span className="text-slate-400"> - Shows how close you are to being locked out</span>
              </div>
            </div>
          </div>
          
          {/* Closing question */}
          <p className="text-pink-500 font-bold text-center mb-6">
            Can you crack the code before the system discovers your identity?
          </p>
          
          {/* Begin button */}
          <button 
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-cyan-100 rounded-lg font-bold transition-all border border-cyan-500/50"
            onClick={onClose}
          >
            <span className="mr-2">{'>'}</span>
            INITIATE SEQUENCE
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
} 