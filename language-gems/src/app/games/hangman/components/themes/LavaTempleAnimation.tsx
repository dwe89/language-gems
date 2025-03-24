'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LavaTempleAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function LavaTempleAnimation({ mistakes, maxMistakes }: LavaTempleAnimationProps) {
  // Ancient glyphs that represent puzzle elements
  const glyphs = ['𓀀', '𓁹', '𓃒', '𓆣', '𓇯', '𓊖', '𓉐', '𓂀'];
  
  const mistakeRatio = mistakes / maxMistakes;
  const mysteryProgress = Math.min(100, mistakes * (100 / maxMistakes)).toFixed(0);
  
  // Determine guardian state based on mistakes
  const guardianState = {
    eyeGlow: mistakes >= 1 ? `${Math.min(0.5 + mistakes * 0.1, 1)}` : '0.3',
    mouthOpen: mistakes >= 5 ? true : false,
    energyBuild: mistakes >= 5 ? true : false,
    leftPillarDamage: mistakes >= 3 ? true : false,
    rightPillarDamage: mistakes >= 4 ? true : false,
    screenShake: mistakes >= 2
  };
  
  return (
    <div className={`relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl ${guardianState.screenShake ? 'animate-shake' : ''}`}>
      {/* Fixed background color fallback */}
      <div className="absolute inset-0 bg-amber-900"></div>
      
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/hangman/images/lava-temple/lava-temple-bg.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Guardian eye glow overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500`}
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 38%, rgba(255, 165, 0, 0.6) 0%, transparent 25%)',
          opacity: guardianState.eyeGlow
        }}
      ></div>
      
      {/* Guardian mouth energy build-up for final stage */}
      {guardianState.energyBuild && (
        <motion.div 
          className="absolute left-1/2 top-[55%] w-32 h-8 -translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full blur-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.4, 0.8, 0.4], 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
      )}
      
      {/* Left pillar damage effect */}
      {guardianState.leftPillarDamage && (
        <div className="absolute left-[15%] top-1/2 w-8 h-60 -translate-y-1/2">
          <motion.div 
            className="absolute inset-0 bg-orange-600 bg-opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <div className="absolute top-1/3 left-0 w-full h-4 bg-orange-600 bg-opacity-30"></div>
          <div className="absolute top-2/3 left-0 w-full h-3 bg-orange-600 bg-opacity-30"></div>
        </div>
      )}
      
      {/* Right pillar damage effect */}
      {guardianState.rightPillarDamage && (
        <div className="absolute right-[15%] top-1/2 w-8 h-60 -translate-y-1/2">
          <motion.div 
            className="absolute inset-0 bg-orange-600 bg-opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <div className="absolute top-1/4 left-0 w-full h-4 bg-orange-600 bg-opacity-30"></div>
          <div className="absolute top-1/2 left-0 w-full h-4 bg-orange-600 bg-opacity-30"></div>
        </div>
      )}
      
      {/* Mystery progress display - left side */}
      <div className="absolute top-8 left-8 w-56 h-36 bg-amber-800 bg-opacity-70 rounded-lg p-3 border border-amber-600">
        <div className="text-amber-100 text-sm font-bold mb-2">ANCIENT RIDDLE</div>
        
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-amber-200 text-xs mb-1">GUARDIAN AWAKENING</div>
            <div className="h-2 bg-amber-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-red-500 transition-all duration-300" 
                style={{ width: `${mysteryProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-amber-300 mt-1">
              <span>{mysteryProgress}%</span>
              <span className={mistakeRatio > 0.5 ? 'text-red-500' : ''}>
                {mistakeRatio > 0.7 ? 'CRITICAL' : mistakeRatio > 0.3 ? 'URGENT' : 'DORMANT'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Warning stones on the right side */}
      <div className="absolute top-8 right-8 w-52 h-28 bg-amber-800 bg-opacity-70 rounded-lg p-2 border border-amber-600">
        <div className="text-amber-100 text-sm mb-1">TEMPLE INSCRIPTION</div>
        <div className="text-amber-200 text-xs opacity-90">
          The stone guardian grows restless with each mistake. Decipher the word before it fully awakens or face its wrath.
        </div>
      </div>
      
      {/* Glyphs at the bottom of the screen - now representing seals */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-xl flex justify-between">
        {/* Left wall glyphs */}
        <div className="flex gap-4">
          {glyphs.slice(0, 4).map((glyph, index) => (
            <div 
              key={`left-${index}`}
              className={`w-12 h-12 bg-amber-800 rounded-lg flex items-center justify-center text-2xl border border-amber-600 transition-all duration-300
                ${index < mistakes ? 'text-red-500 border-red-500 animate-pulse' : 'text-amber-200'}`}
            >
              {glyph}
            </div>
          ))}
        </div>
        
        {/* Right wall glyphs */}
        <div className="flex gap-4">
          {glyphs.slice(4, 8).map((glyph, index) => (
            <div 
              key={`right-${index}`}
              className={`w-12 h-12 bg-amber-800 rounded-lg flex items-center justify-center text-2xl border border-amber-600 transition-all duration-300
                ${index + 4 < mistakes ? 'text-red-500 border-red-500 animate-pulse' : 'text-amber-200'}`}
            >
              {glyph}
            </div>
          ))}
        </div>
      </div>
      
      {/* Alert messages */}
      {mistakeRatio > 0.8 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-lg animate-pulse">
          GUARDIAN AWAKENING - DANGER IMMINENT!
        </div>
      )}
    </div>
  );
} 