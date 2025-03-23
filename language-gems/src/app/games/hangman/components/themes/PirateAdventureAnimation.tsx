'use client';

import React, { useState } from 'react';

interface PirateAdventureAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function PirateAdventureAnimation({
  mistakes,
  maxMistakes,
}: PirateAdventureAnimationProps) {
  // Calculate the danger level based on mistakes
  const mistakeRatio = mistakes / maxMistakes;
  const shipIntegrity = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl">
      {/* Fixed background color fallback */}
      <div className="absolute inset-0 bg-blue-900"></div>
      
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/hangman/images/pirate-adventure/pirate-adventure-bg.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Player ship - bigger size */}
      <div 
        className="absolute left-[10%] bottom-[20%]"
        style={{ 
          width: '350px',
          height: '280px'
        }}
      >
        <img 
          src="/games/hangman/images/pirate-adventure/pirate-ship.png" 
          alt="Pirate Ship"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Enemy ship - bigger size */}
      <div 
        className="absolute right-[10%] bottom-[20%]"
        style={{ 
          width: '350px',
          height: '280px'
        }}
      >
        <img 
          src="/games/hangman/images/pirate-adventure/enemy-pirate-ship.png" 
          alt="Enemy Pirate Ship"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Ship integrity indicator bar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <div className="text-white text-sm font-bold mb-1 text-center">Ship Integrity: {shipIntegrity}%</div>
        <div className="h-2 bg-slate-800 bg-opacity-30 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300" 
            style={{ 
              width: `${shipIntegrity}%`,
              background: mistakeRatio > 0.7 ? 
                'linear-gradient(to right, #ef4444, #f97316)' : 
                mistakeRatio > 0.4 ? 
                'linear-gradient(to right, #f97316, #facc15)' : 
                'linear-gradient(to right, #22c55e, #84cc16)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 