'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpaceExplorerAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function SpaceExplorerAnimation({
  mistakes,
  maxMistakes,
}: SpaceExplorerAnimationProps) {
  const [astronautPosition, setAstronautPosition] = useState({ x: 40, y: 55, size: 90 });
  const [showOxygenAlert, setShowOxygenAlert] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [lastMistakeCount, setLastMistakeCount] = useState(0);
  const [tetherHealth, setTetherHealth] = useState(100);
  
  // Calculate values based on mistakes
  const mistakeRatio = mistakes / maxMistakes;
  const oxygenLevel = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  const distanceToDestination = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  
  // Move astronaut away from ship as mistakes increase
  useEffect(() => {
    setAstronautPosition({
      x: 40 + (30 * mistakeRatio), // Moves right as mistakes increase
      y: 55 - (15 * mistakeRatio), // Moves slightly up as mistakes increase
      size: 90 - (40 * mistakeRatio), // Gets smaller as moves away
    });
    
    // Calculate tether health based on mistakes
    setTetherHealth(Math.max(0, 100 - (mistakeRatio * 100)));
    
    // Show oxygen alert when a new mistake is made
    if (mistakes > lastMistakeCount) {
      setShowOxygenAlert(true);
      setTimeout(() => setShowOxygenAlert(false), 3000);
      
      // Show warning popup for critical mistakes
      if (mistakes >= 4) {
        setShowWarningPopup(true);
        setTimeout(() => setShowWarningPopup(false), 4000);
      }
      
      setLastMistakeCount(mistakes);
    }
  }, [mistakes, mistakeRatio, lastMistakeCount]);
  
  // Get oxygen status text and color
  const getOxygenStatus = () => {
    if (mistakeRatio > 0.8) return { text: 'CRITICAL', color: 'text-red-500 animate-pulse' };
    if (mistakeRatio > 0.6) return { text: 'DANGER', color: 'text-red-400' };
    if (mistakeRatio > 0.4) return { text: 'WARNING', color: 'text-amber-400' };
    if (mistakeRatio > 0.2) return { text: 'CAUTION', color: 'text-yellow-300' };
    return { text: 'NORMAL', color: 'text-green-400' };
  };
  
  // Get specific warning message based on mistake count
  const getWarningMessage = () => {
    const messages = [
      "Minor tether strain detected.",
      "Ship communications faltering.",
      "WARNING: Halfway to critical oxygen levels.",
      "ALERT: Suit systems compromised.",
      "EMERGENCY: Reserve systems activated.",
      "CRITICAL: Tether disconnected. Mission failure imminent."
    ];
    
    return messages[Math.min(messages.length - 1, mistakes - 1)];
  };
  
  const oxygenStatus = getOxygenStatus();
  
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl">
      {/* Fixed background color fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-black to-purple-950"></div>
      
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/hangman/images/space-explorer/space-explorer-bg.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Spaceship on the left side */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-24 h-24">
        <div className="relative w-full h-full">
          {/* Simple spaceship made with CSS */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-20 h-10 bg-slate-700 rounded-l-full rounded-r-lg border border-slate-500"></div>
          <div className="absolute top-1/4 left-6 transform -translate-y-1/2 w-8 h-8 bg-slate-600 rounded-full border border-slate-500"></div>
          
          {/* Ship window */}
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2 w-6 h-6 bg-cyan-300 rounded-full border border-slate-400"></div>
          
          {/* Ship thrusters */}
          <motion.div 
            className="absolute top-1/3 left-0 transform -translate-y-1/2 w-3 h-2 bg-blue-500 rounded-l-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          ></motion.div>
          <motion.div 
            className="absolute top-2/3 left-0 transform -translate-y-1/2 w-3 h-2 bg-blue-500 rounded-l-full"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          ></motion.div>
        </div>
      </div>
      
      {/* Tether line connecting ship to astronaut */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 3 }}
      >
        <line 
          x1="8%" 
          y1="50%" 
          x2={`${astronautPosition.x}%`} 
          y2={`${astronautPosition.y}%`} 
          stroke={tetherHealth <= 20 ? "red" : tetherHealth <= 50 ? "yellow" : "cyan"}
          strokeWidth="2"
          strokeDasharray={tetherHealth <= 50 ? "5,5" : "0"}
          className={tetherHealth <= 20 ? "animate-pulse" : ""}
        />
      </svg>
      
      {/* Astronaut floating in space - moves away with each mistake */}
      <div 
        className="absolute transition-all duration-700"
        style={{ 
          left: `${astronautPosition.x}%`, 
          top: `${astronautPosition.y}%`,
          width: `${astronautPosition.size}px`,
          height: `${astronautPosition.size}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 5
        }}
      >
        <img 
          src="/games/hangman/images/space-explorer/astronaut.png" 
          alt="Astronaut"
          className="w-full h-full object-contain"
        />
        
        {/* Oxygen bubble effect */}
        <div 
          className="absolute inset-0 rounded-full" 
          style={{ 
            background: `radial-gradient(circle, rgba(147, 197, 253, ${0.3 - (mistakeRatio * 0.3)}) 0%, rgba(147, 197, 253, 0) 70%)`,
            animation: mistakeRatio < 0.7 ? 'pulse 2s ease-in-out infinite' : 'none',
            opacity: Math.max(0, 1 - mistakeRatio)
          }}
        ></div>
        
        {/* Astronaut O2 display */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-slate-800/80 border border-blue-400 rounded px-2 py-0.5 text-[10px] whitespace-nowrap">
          <span className="text-cyan-300">O₂:</span>
          <span className={oxygenStatus.color}> {oxygenLevel}%</span>
        </div>
      </div>
      
      {/* Status overlay with ship information */}
      <div className="absolute top-6 left-6 w-64 h-44 bg-slate-900 bg-opacity-80 rounded-lg p-3 border border-blue-500">
        <div className="text-cyan-100 text-sm font-bold mb-2">SHIP SYSTEMS</div>
        
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-cyan-200">LIFE SUPPORT (O₂)</span>
              <span className={oxygenStatus.color}>{oxygenStatus.text}</span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${mistakeRatio > 0.6 ? 'animate-pulse' : ''}`}
                style={{ 
                  width: `${oxygenLevel}%`,
                  background: mistakeRatio > 0.6 
                    ? 'linear-gradient(to right, #ef4444, #f97316)' 
                    : mistakeRatio > 0.3 
                      ? 'linear-gradient(to right, #f59e0b, #10b981)' 
                      : 'linear-gradient(to right, #06b6d4, #3b82f6)'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-cyan-300 mt-1">
              <span>{oxygenLevel}%</span>
              <span>
                {mistakeRatio === 0 ? 'FULL' : `${Math.round(100 - (oxygenLevel as unknown as number))}% DEPLETED`}
              </span>
            </div>
          </div>
          
          <div>
            <div className="text-cyan-200 text-xs mb-1">TETHER INTEGRITY</div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${tetherHealth <= 20 ? 'animate-pulse' : ''}`}
                style={{ 
                  width: `${tetherHealth}%`,
                  background: tetherHealth <= 20 
                    ? 'linear-gradient(to right, #ef4444, #f97316)' 
                    : tetherHealth <= 50 
                      ? 'linear-gradient(to right, #f59e0b, #fbbf24)' 
                      : 'linear-gradient(to right, #2dd4bf, #22d3ee)'
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="text-cyan-200 text-xs mb-1">MISSION PROGRESS</div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-300" 
                style={{ width: `${distanceToDestination}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission status */}
      <div className="absolute top-6 right-6 w-48 h-36 bg-slate-900 bg-opacity-80 rounded-lg p-2 border border-blue-500">
        <div className="text-cyan-100 text-xs">
          <div className="mb-1">MISSION CONTROL:</div>
          <div className="text-[10px] italic opacity-90">
            "Captain, navigate carefully through this asteroid field. Each mistake damages our systems. Stay focused on reaching the destination planet."
          </div>
        </div>
        
        {mistakeRatio > 0.5 && (
          <div className="mt-2 text-[10px] text-red-400 font-bold animate-pulse">
            "WARNING: OXYGEN LEVELS CRITICAL! Return to ship immediately!"
          </div>
        )}
        
        {mistakeRatio < 0.2 && (
          <div className="mt-2 text-[10px] text-green-400 font-bold">
            "Excellent navigation! Destination in range."
          </div>
        )}
      </div>
      
      {/* Distance calculator tooltip */}
      <div className="absolute bottom-6 right-6 w-36 bg-slate-900 bg-opacity-80 rounded-lg p-2 border border-blue-500 text-center">
        <div className="text-cyan-300 text-[10px] font-bold">DISTANCE FROM SHIP</div>
        <div className="text-white text-xs font-bold mt-1">
          {Math.floor(100 * mistakeRatio)} METERS
        </div>
        <div className="text-cyan-200 text-[8px] mt-1">
          MAX TETHER: 100 METERS
        </div>
      </div>
      
      {/* Oxygen Alert Popup */}
      <AnimatePresence>
        {showOxygenAlert && (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 border-2 border-red-500 rounded-lg p-4 text-center max-w-xs"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: 10 }}
          >
            <div className="text-red-500 text-lg font-bold mb-2">OXYGEN ALERT</div>
            <div className="text-cyan-300 text-sm">
              {`Oxygen level dropped to ${oxygenLevel}%`}
            </div>
            <div className="text-white text-xs mt-2">
              {getWarningMessage()}
            </div>
            <div className="mt-3 text-amber-300 text-xs font-bold">
              {`${maxMistakes - mistakes} MISTAKES REMAINING BEFORE CRITICAL FAILURE`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Warning Popup for Critical Levels */}
      <AnimatePresence>
        {showWarningPopup && mistakes >= 4 && (
          <motion.div 
            className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-red-900/70 border border-red-500 rounded-lg p-3 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ zIndex: 10 }}
          >
            <motion.div 
              className="text-red-300 text-xs font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {mistakes >= 5 ? 'EMERGENCY PROTOCOLS ENGAGED' : 'CRITICAL SYSTEMS ALERT'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Alert messages */}
      {mistakeRatio > 0.8 && (
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-lg"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          CRITICAL SYSTEMS FAILURE
        </motion.div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
} 