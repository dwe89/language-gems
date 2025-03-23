'use client';

import React, { useEffect, useState } from 'react';

interface SpaceExplorerAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function SpaceExplorerAnimation({
  mistakes,
  maxMistakes,
}: SpaceExplorerAnimationProps) {
  const [astronautPosition, setAstronautPosition] = useState({ x: 40, y: 55, size: 90 });
  
  // Calculate values based on mistakes
  const mistakeRatio = mistakes / maxMistakes;
  const oxygenLevel = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  const distanceToDestination = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  
  // Move astronaut away from ship as mistakes increase
  useEffect(() => {
    setAstronautPosition({
      x: 40 + (30 * mistakeRatio), // Moves right as mistakes increase
      y: 55 - (15 * mistakeRatio), // Moves slightly up as mistakes increase
      size: 90 - (50 * mistakeRatio), // Gets smaller as moves away
    });
  }, [mistakeRatio]);
  
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
      </div>
      
      {/* Status overlay with ship information */}
      <div className="absolute top-6 left-6 w-64 h-40 bg-slate-900 bg-opacity-70 rounded-lg p-3 border border-blue-500">
        <div className="text-cyan-100 text-sm font-bold mb-2">SHIP SYSTEMS</div>
        
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-cyan-200 text-xs mb-1">LIFE SUPPORT (O₂)</div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300" 
                style={{ width: `${oxygenLevel}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-cyan-300 mt-1">
              <span>{oxygenLevel}%</span>
              <span className={mistakeRatio > 0.7 ? 'text-red-400 animate-pulse' : ''}>
                {mistakeRatio > 0.7 ? 'CRITICAL' : mistakeRatio > 0.4 ? 'WARNING' : 'NORMAL'}
              </span>
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
      <div className="absolute top-6 right-6 w-48 h-36 bg-slate-900 bg-opacity-70 rounded-lg p-2 border border-blue-500">
        <div className="text-cyan-100 text-xs">
          <div className="mb-1">MISSION CONTROL:</div>
          <div className="text-[10px] italic opacity-90">
            "Captain, navigate carefully through this asteroid field. Each mistake damages our systems. Stay focused on reaching the destination planet."
          </div>
        </div>
        
        {mistakeRatio > 0.6 && (
          <div className="mt-2 text-[10px] text-red-400 font-bold animate-pulse">
            "WARNING: HULL BREACH DETECTED!"
          </div>
        )}
        
        {mistakeRatio < 0.2 && (
          <div className="mt-2 text-[10px] text-green-400 font-bold">
            "Excellent navigation! Destination in range."
          </div>
        )}
      </div>
      
      {/* Alert messages */}
      {mistakeRatio > 0.8 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-lg animate-pulse">
          CRITICAL SYSTEMS FAILURE
        </div>
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