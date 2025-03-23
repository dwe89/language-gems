'use client';

import { useState } from 'react';

interface LavaTempleAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function LavaTempleAnimation({ mistakes, maxMistakes }: LavaTempleAnimationProps) {
  // Ancient glyphs that represent puzzle elements
  const glyphs = ['𓀀', '𓁹', '𓃒', '𓆣', '𓇯', '𓊖', '𓉐', '𓂀'];
  
  const mistakeRatio = mistakes / maxMistakes;
  const mysteryProgress = Math.min(100, mistakes * (100 / maxMistakes)).toFixed(0);
  
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl">
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
      
      {/* Mystery progress display - left side */}
      <div className="absolute top-8 left-8 w-56 h-36 bg-amber-800 bg-opacity-70 rounded-lg p-3 border border-amber-600">
        <div className="text-amber-100 text-sm font-bold mb-2">ANCIENT RIDDLE</div>
        
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-amber-200 text-xs mb-1">MYSTERY UNRAVELING</div>
            <div className="h-2 bg-amber-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-red-500 transition-all duration-300" 
                style={{ width: `${mysteryProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-amber-300 mt-1">
              <span>{mysteryProgress}%</span>
              <span className={mistakeRatio > 0.5 ? 'text-red-500' : ''}>
                {mistakeRatio > 0.7 ? 'CRITICAL' : mistakeRatio > 0.3 ? 'URGENT' : 'HIDDEN'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Warning stones on the right side */}
      <div className="absolute top-8 right-8 w-52 h-28 bg-amber-800 bg-opacity-70 rounded-lg p-2 border border-amber-600">
        <div className="text-amber-100 text-sm mb-1">TEMPLE INSCRIPTION</div>
        <div className="text-amber-200 text-xs opacity-90">
          Ancient warnings speak of trials ahead. Each wrong step brings the mystery closer to revelation. Choose your path with wisdom.
        </div>
      </div>
      
      {/* Glyphs at the bottom of the screen - 4 on left, 4 on right */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-xl flex justify-between">
        {/* Left wall glyphs */}
        <div className="flex gap-4">
          {glyphs.slice(0, 4).map((glyph, index) => (
            <div 
              key={`left-${index}`}
              className="w-12 h-12 bg-amber-800 rounded-lg flex items-center justify-center text-amber-200 text-2xl border border-amber-600"
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
              className="w-12 h-12 bg-amber-800 rounded-lg flex items-center justify-center text-amber-200 text-2xl border border-amber-600"
            >
              {glyph}
            </div>
          ))}
        </div>
      </div>
      
      {/* Alert messages */}
      {mistakeRatio > 0.8 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-lg animate-pulse">
          MYSTERY UNRAVELING - DANGER AHEAD!
        </div>
      )}
    </div>
  );
} 