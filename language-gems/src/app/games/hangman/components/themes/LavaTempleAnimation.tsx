'use client';

import { useEffect, useState } from 'react';

type LavaTempleAnimationProps = {
  mistakes: number;
  maxMistakes: number;
};

export default function LavaTempleAnimation({ mistakes, maxMistakes }: LavaTempleAnimationProps) {
  const [animated, setAnimated] = useState(false);
  const [lavaBubbles, setLavaBubbles] = useState<Array<{id: number, left: number, size: number, delay: number}>>([]);
  const dangerPercentage = (mistakes / maxMistakes) * 100;
  
  // Animation effect when mistakes change
  useEffect(() => {
    setAnimated(true);
    const timer = setTimeout(() => setAnimated(false), 500);
    return () => clearTimeout(timer);
  }, [mistakes]);
  
  // Generate random lava bubbles
  useEffect(() => {
    const bubbleCount = 10 + Math.floor(dangerPercentage / 10);
    const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 5
    }));
    setLavaBubbles(newBubbles);
  }, [dangerPercentage]);
  
  return (
    <div className={`relative w-full h-64 overflow-hidden rounded-xl shadow-2xl mb-6 ${animated ? 'animate-pulse' : ''}`}>
      {/* Temple background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-red-800 to-red-950">
        {/* Temple pillars */}
        <div className="absolute top-0 left-1/4 w-4 h-full bg-gradient-to-b from-stone-800 to-stone-900"></div>
        <div className="absolute top-0 right-1/4 w-4 h-full bg-gradient-to-b from-stone-800 to-stone-900"></div>
        
        {/* Temple carvings on pillars */}
        <div className="absolute top-10 left-1/4 w-4 h-2 bg-amber-600"></div>
        <div className="absolute top-20 left-1/4 w-4 h-2 bg-amber-600"></div>
        <div className="absolute top-30 left-1/4 w-4 h-2 bg-amber-600"></div>
        <div className="absolute top-10 right-1/4 w-4 h-2 bg-amber-600"></div>
        <div className="absolute top-20 right-1/4 w-4 h-2 bg-amber-600"></div>
        <div className="absolute top-30 right-1/4 w-4 h-2 bg-amber-600"></div>
        
        {/* Temple wall details */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-radial from-red-700 to-transparent opacity-30"></div>
        
        {/* Stone floor tiles */}
        <div className="absolute bottom-0 inset-x-0 h-16 grid grid-cols-8 gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-stone-700 border-t border-stone-600"></div>
          ))}
        </div>
      </div>
      
      {/* Floating platform */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-stone-700 rounded-lg border-b-4 border-stone-600 shadow-md"></div>
      
      {/* Temple adventurer - improved human figure */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-36">
        <div className="relative w-20 h-32">
          {/* Body */}
          <div className="absolute bottom-0 left-5 w-10 h-16 bg-amber-800 rounded-md"></div>
          
          {/* Head with more details */}
          <div className="absolute bottom-16 left-5 w-10 h-10 bg-amber-700 rounded-t-lg">
            {/* Eyes */}
            <div className="absolute top-3 left-2 w-2 h-1 bg-amber-950 rounded-full"></div>
            <div className="absolute top-3 right-2 w-2 h-1 bg-amber-950 rounded-full"></div>
            
            {/* Mouth */}
            <div className="absolute top-6 left-3 w-4 h-1 bg-amber-950 rounded-full"></div>
            
            {/* Nose */}
            <div className="absolute top-4.5 left-4.5 w-1 h-2 bg-amber-800"></div>
            
            {/* Hair */}
            <div className="absolute top-0 left-0 w-10 h-2 bg-amber-950 rounded-t-lg"></div>
            
            {/* Statue cracks growing with mistakes */}
            {mistakes > 0 && (
              <div className="absolute top-0 right-0 w-0.5 h-3 bg-orange-600"></div>
            )}
            {mistakes > 1 && (
              <div className="absolute top-2 left-0 w-3 h-0.5 bg-orange-600"></div>
            )}
            {mistakes > 2 && (
              <div className="absolute bottom-1 right-2 w-2 h-0.5 bg-orange-600"></div>
            )}
          </div>
          
          {/* Details: Hat/helmet */}
          <div className="absolute bottom-24 left-4 w-12 h-4 bg-amber-950 rounded-t-lg"></div>
          
          {/* Arms */}
          <div className="absolute bottom-12 left-1 w-4 h-8 bg-amber-800 rounded-full">
            {/* Hand */}
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-amber-700 rounded-full"></div>
          </div>
          <div className="absolute bottom-12 right-1 w-4 h-8 bg-amber-800 rounded-full">
            {/* Hand */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-700 rounded-full"></div>
          </div>
          
          {/* Legs */}
          <div className="absolute bottom-0 left-5 w-4 h-8 bg-amber-700 rounded-full"></div>
          <div className="absolute bottom-0 right-5 w-4 h-8 bg-amber-700 rounded-full"></div>
          
          {/* Adventurer's torch */}
          <div className="absolute bottom-14 left-0 w-2 h-6 bg-amber-950 rounded-full"></div>
          <div className="absolute bottom-18 left-0 w-4 h-4 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500"></div>
          
          {/* Adventurer's backpack */}
          <div className="absolute bottom-12 left-1/2 transform translate-x-1 w-6 h-8 bg-amber-950 rounded-md"></div>
        </div>
      </div>
      
      {/* Rising lava */}
      <div 
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-orange-600 to-red-600 transition-all duration-1000"
        style={{ height: `${16 + (dangerPercentage * 0.5)}%` }}
      >
        {/* Lava bubbles */}
        {lavaBubbles.map((bubble) => (
          <div 
            key={bubble.id}
            className="absolute rounded-full bg-yellow-500 opacity-80"
            style={{ 
              left: `${bubble.left}%`, 
              bottom: `${Math.random() * 100}%`,
              width: `${bubble.size}px`, 
              height: `${bubble.size}px`,
              animation: `bubbleRise ${2 + bubble.delay}s ease-in-out infinite`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        ))}
        
        {/* Lava top wave effect */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-yellow-500 to-transparent"></div>
      </div>
      
      {/* Floating embers as mistakes increase */}
      {mistakes > maxMistakes / 3 && (
        <>
          <div className="absolute top-10 left-1/3 w-2 h-2 rounded-full bg-orange-300 opacity-80 animate-float-up"></div>
          <div className="absolute top-30 right-1/3 w-1 h-1 rounded-full bg-orange-300 opacity-80 animate-float-up" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-20 left-2/3 w-1.5 h-1.5 rounded-full bg-orange-300 opacity-80 animate-float-up" style={{ animationDelay: '1.5s' }}></div>
        </>
      )}
      
      {/* Falling debris as mistakes increase */}
      {mistakes > maxMistakes / 2 && (
        <>
          <div className="absolute top-10 left-1/3 w-2 h-2 bg-stone-700 animate-fall"></div>
          <div className="absolute top-15 right-1/3 w-3 h-3 bg-stone-700 animate-fall" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-5 left-2/3 w-2 h-2 bg-stone-700 animate-fall" style={{ animationDelay: '1.5s' }}></div>
        </>
      )}
      
      {/* Warning signs */}
      {dangerPercentage > 50 && (
        <div className="absolute top-1/3 left-1/4 text-yellow-500 font-semibold animate-pulse opacity-70">
          WARNING!
        </div>
      )}
      
      {dangerPercentage > 75 && (
        <div className="absolute top-1/4 right-1/4 text-orange-500 font-bold animate-bounce">
          DANGER!
        </div>
      )}

      {/* Floor stability indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-orange-300 text-xs mb-1 font-semibold">Floor Stability: {Math.round(100 - dangerPercentage)}%</div>
        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${100 - dangerPercentage}%`,
              backgroundColor: dangerPercentage > 66 ? 'rgb(220, 38, 38)' : dangerPercentage > 33 ? 'rgb(234, 88, 12)' : 'rgb(234, 179, 8)',
              boxShadow: `0 0 5px ${dangerPercentage > 66 ? 'rgb(220, 38, 38)' : dangerPercentage > 33 ? 'rgb(234, 88, 12)' : 'rgb(234, 179, 8)'}`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 