'use client';

import React, { useEffect, useState } from 'react';

interface PirateAdventureAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function PirateAdventureAnimation({
  mistakes,
  maxMistakes,
}: PirateAdventureAnimationProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  const [showCannonFire, setShowCannonFire] = useState(false);
  const [showCannonball, setShowCannonball] = useState(false);
  const [cannonballPosition, setCannonballPosition] = useState({ x: 25, y: 50 });
  const [shipTilt, setShipTilt] = useState(0);
  const [shipSinkLevel, setShipSinkLevel] = useState(0);
  const [birdPosition, setBirdPosition] = useState({ x: 10, y: 20 });
  const [treasureGlow, setTreasureGlow] = useState(false);
  const [showBlast, setShowBlast] = useState(false);
  
  // Calculate the danger level based on mistakes
  const mistakeRatio = mistakes / maxMistakes;
  const shipIntegrity = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  const stormSeverity = Math.min(100, mistakeRatio * 100);
  
  // Storm intensity and ship damage increases with mistakes
  useEffect(() => {
    // Increase ship tilt with more mistakes
    setShipTilt(Math.min(8, mistakeRatio * 12));
    
    // Increase ship sinking with more mistakes
    setShipSinkLevel(Math.min(20, mistakeRatio * 25));
    
    // Trigger splash effect when mistakes change
    if (mistakes > 0) {
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 700);
    }
  }, [mistakes, mistakeRatio]);
  
  // Random lightning in the background when storm intensifies
  useEffect(() => {
    if (mistakeRatio > 0.3) {
      const lightningInterval = setInterval(() => {
        if (Math.random() < (mistakeRatio * 0.4)) {
        setShowLightning(true);
          setTimeout(() => setShowLightning(false), 300);
        }
      }, 3000);
      
      return () => clearInterval(lightningInterval);
    }
  }, [mistakeRatio]);

  // Cannon fire on mistakes
  useEffect(() => {
    if (mistakes > 0) {
      // Fire cannon
      setShowCannonFire(true);
      setTimeout(() => setShowCannonFire(false), 500);
      
      // Show cannonball
      setCannonballPosition({ x: 25, y: 50 });
      setShowCannonball(true);
      
      // Animate cannonball
      const cannonballInterval = setInterval(() => {
        setCannonballPosition(prev => {
          const newX = prev.x + 3;
          const newY = prev.y + 0.5;
          
          if (newX > 45) {
            clearInterval(cannonballInterval);
            setShowCannonball(false);
            // Show blast effect when cannonball hits
            setShowBlast(true);
            setTimeout(() => setShowBlast(false), 500);
            return prev;
          }
          
          return { x: newX, y: newY };
        });
      }, 50);
      
      // Create splash effect when ship is hit and sinks deeper
      setTimeout(() => {
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 700);
      }, 800); // Delay splash until after cannonball hits
      
      return () => clearInterval(cannonballInterval);
    }
  }, [mistakes, mistakeRatio]);
  
  // Flying bird animation
  useEffect(() => {
    const birdInterval = setInterval(() => {
      setBirdPosition(prev => ({
        x: (prev.x + 2) % 100,
        y: prev.y + (Math.random() * 2 - 1)
      }));
    }, 100);
    
    return () => clearInterval(birdInterval);
  }, []);

  // Treasure chest glow effect
  useEffect(() => {
    const treasureInterval = setInterval(() => {
      setTreasureGlow(prev => !prev);
      }, 2000);
    
    return () => clearInterval(treasureInterval);
  }, []);
  
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl">
      {/* Sky background with weather effects */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(to bottom, 
            ${mistakeRatio > 0.7 ? 'rgb(30, 41, 59)' : mistakeRatio > 0.4 ? 'rgb(51, 65, 85)' : 'rgb(186, 230, 253)'}, 
            ${mistakeRatio > 0.5 ? 'rgb(15, 23, 42)' : 'rgb(144, 224, 255)'} 70%)`
        }}
      >
        {/* Lightning flash when there's a storm */}
        {showLightning && mistakeRatio > 0.4 && (
          <div className="absolute inset-0 bg-yellow-300 opacity-40 z-10"></div>
        )}
        
        {/* Lightning bolt strikes in bad weather */}
        {showLightning && mistakeRatio > 0.5 && (
          <div className="absolute inset-0 z-10">
            <div 
              className="absolute lightning-bolt" 
            style={{ 
                left: `${30 + Math.random() * 40}%`, 
                top: 0, 
                height: `${30 + Math.random() * 30}%`,
                boxShadow: '0 0 10px 2px rgba(250, 204, 21, 0.7)'
                }}
              ></div>
          </div>
        )}
        
        {/* Clouds that appear and darken with storm severity */}
        <div 
          className="absolute top-5 left-10 w-60 h-20 rounded-t-[50px] rounded-b-[30px] bg-white transition-opacity duration-1000"
          style={{ opacity: Math.min(mistakeRatio * 0.8 + 0.2, 0.9) }}
        ></div>
        <div 
          className="absolute top-10 left-[30%] w-80 h-24 rounded-t-[60px] rounded-b-[40px] bg-white transition-opacity duration-1000"
          style={{ opacity: Math.min(mistakeRatio * 0.8 + 0.1, 0.8) }}
        ></div>
        <div 
          className="absolute top-8 right-20 w-70 h-16 rounded-t-[40px] rounded-b-[30px] bg-white transition-opacity duration-1000"
          style={{ opacity: Math.min(mistakeRatio * 0.8 + 0.1, 0.7) }}
        ></div>
        
        {/* Dark storm clouds that appear with higher mistake counts */}
        {mistakeRatio > 0.3 && (
          <>
            <div 
              className="absolute top-12 left-[20%] w-100 h-30 rounded-full bg-slate-700 transition-opacity duration-1000" 
              style={{ opacity: Math.min((mistakeRatio - 0.3) * 1.4, 0.6) }}
            ></div>
            <div 
              className="absolute top-16 right-[30%] w-90 h-25 rounded-full bg-slate-800 transition-opacity duration-1000"
              style={{ opacity: Math.min((mistakeRatio - 0.3) * 1.4, 0.7) }}
            ></div>
          </>
        )}
        
        {mistakeRatio > 0.5 && (
          <>
            <div 
              className="absolute top-4 left-20 w-90 h-20 rounded-full bg-slate-900 transition-opacity duration-1000"
              style={{ opacity: Math.min((mistakeRatio - 0.5) * 2, 0.8) }}
            ></div>
            <div 
              className="absolute top-2 right-10 w-60 h-18 rounded-full bg-slate-950 animate-drift transition-opacity duration-1000"
              style={{ opacity: Math.min((mistakeRatio - 0.5) * 2, 0.9) }}
            ></div>
          </>
        )}
        
        {/* Flying birds */}
        <div 
          className="absolute w-6 h-2 transition-opacity duration-1000" 
          style={{ 
            top: `${birdPosition.y}%`, 
            left: `${birdPosition.x}%`,
            opacity: Math.max(0, 1 - mistakeRatio * 1.2)
          }}
        >
          <div className="absolute top-0 left-0 w-2 h-1 bg-black rotate-[20deg]"></div>
          <div className="absolute top-0 left-2 w-2 h-1 bg-black -rotate-[20deg]"></div>
        </div>
      </div>
      
      {/* Ocean with dynamic waves simulation - refined for perfection */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50%] transition-all duration-1000 overflow-hidden"
        style={{ 
          background: `linear-gradient(to bottom, 
            ${mistakeRatio > 0.7 ? 'rgb(8, 47, 73)' : mistakeRatio > 0.4 ? 'rgb(3, 105, 161)' : 'rgb(56, 189, 248)'}, 
            ${mistakeRatio > 0.7 ? 'rgb(3, 30, 47)' : mistakeRatio > 0.4 ? 'rgb(1, 65, 101)' : 'rgb(14, 116, 144)'} 85%,
            rgb(2, 44, 70) 100%)`
        }}
      >
        {/* Simple clean water effect */}
        <div className="absolute inset-0 ocean-depth"></div>
        
        {/* Refined wave simulation - more subtle animation matching image */}
        <div className="absolute inset-x-0 top-[-65px] h-[100px] wave-container">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" 
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" 
                style={{
                  fill: `rgba(255,255,255,${0.25 + mistakeRatio * 0.2})`,
                  animationDuration: `${Math.max(6, 18 - mistakeRatio * 8)}s`
                }} 
              />
              <use xlinkHref="#gentle-wave" x="48" y="3" 
                style={{
                  fill: `rgba(255,255,255,${0.2 + mistakeRatio * 0.2})`,
                  animationDuration: `${Math.max(7, 20 - mistakeRatio * 8)}s`
                }} 
              />
            </g>
          </svg>
        </div>
        
        {/* Second set of waves - more dramatic but only visible with mistakes */}
        {mistakeRatio > 0.2 && (
          <div className="absolute inset-x-0 top-[-60px] h-[100px] wave-container">
            <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" 
                  style={{
                    fill: `rgba(255,255,255,${Math.min((mistakeRatio - 0.2) * 0.5, 0.4)})`,
                    animationDuration: `${Math.max(4, 10 - mistakeRatio * 5)}s`,
                    transform: `scaleY(${1 + mistakeRatio * 0.8})`
                  }} 
                />
              </g>
            </svg>
          </div>
        )}
        
        {/* Water splashes when ship is hit */}
        {showSplash && (
          <>
            <div className="absolute top-[45%] left-[45%] w-16 h-20 splash-effect"></div>
            <div className="absolute top-[44%] left-[47%] w-14 h-18 splash-effect" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute top-[46%] left-[43%] w-12 h-16 splash-effect" style={{ animationDelay: '0.2s' }}></div>
          </>
        )}
      </div>
      
      {/* Left island - perfectly positioned */}
      <div className="absolute bottom-[49%] left-[12%] w-30 h-16 bg-amber-800 rounded-t-full">
        {/* Sand details */}
        <div className="absolute top-0 inset-x-0 h-2 bg-amber-200 rounded-t-full"></div>
        
        {/* Palm tree */}
        <div className="absolute top-1 left-10 w-1.5 h-8 bg-amber-900"></div>
        <div className="absolute top-1 left-10 w-8 h-4 bg-green-800 rounded-full -rotate-15 origin-bottom-left"></div>
        <div className="absolute top-1 left-10 w-8 h-4 bg-green-800 rounded-full rotate-15 origin-bottom-left"></div>
        <div className="absolute top-0 left-10 w-6 h-3 bg-green-800 rounded-full -rotate-30 origin-bottom-left"></div>
      </div>
      
      {/* Right island - perfectly positioned */}
      <div className="absolute bottom-[49%] right-[12%] w-30 h-16 bg-amber-800 rounded-t-full">
        {/* Sand details */}
        <div className="absolute top-0 inset-x-0 h-2 bg-amber-200 rounded-t-full"></div>
        
        {/* Palm tree */}
        <div className="absolute top-1 right-5 w-1.5 h-8 bg-amber-900"></div>
        <div className="absolute top-1 right-5 w-8 h-4 bg-green-800 rounded-full -rotate-15 origin-bottom-left"></div>
        <div className="absolute top-1 right-5 w-8 h-4 bg-green-800 rounded-full rotate-15 origin-bottom-left"></div>
        <div className="absolute top-0 right-5 w-6 h-3 bg-green-800 rounded-full -rotate-30 origin-bottom-left"></div>
      </div>
      
      {/* Simplified ship design - perfectly positioned */}
      <div 
        className="absolute left-[50%] bottom-[49%] transform -translate-x-1/2 transition-all duration-500"
        style={{ 
          transform: `translateX(-50%) rotate(${shipTilt}deg)`,
          width: '40px',
          height: '36px'
        }}
      >
        {/* Ship hull */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-amber-800 rounded-b-full">
          {/* Hull damage indicators */}
          {Array.from({ length: Math.ceil(mistakeRatio * 5) }).map((_, index) => (
            <div 
              key={index}
              className="absolute bg-slate-950 rounded-full opacity-80"
              style={{ 
                width: `${4 + Math.random() * 3}px`,
                height: `${3 + Math.random() * 4}px`,
                bottom: `${Math.random() * 14}px`,
                left: `${5 + (index * 7) + Math.random() * 5}px`
              }}
            ></div>
          ))}
        </div>
          
        {/* Mast */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-2 h-32 bg-amber-900"></div>
          
        {/* Sail - crisp white with clear skull */}
        <div 
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-28 h-24 bg-white rounded-sm"
          style={{ 
            clipPath: mistakeRatio > 0.5 ? 
              'polygon(0% 0%, 100% 0%, 100% 100%, 75% 80%, 65% 100%, 30% 70%, 0% 100%)' : 
              'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        >
          {/* Clearer pirate symbol on sail */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-black">☠</div>
        </div>
      </div>
      
      {/* Ship integrity indicator bar - perfectly styled */}
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
      
      {/* Warning messages that appear with high mistake counts */}
      {mistakeRatio > 0.8 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-2xl animate-pulse">
          ABANDON SHIP!
        </div>
      )}
      
      {/* CSS for animations - perfect subtle animations */}
      <style jsx>{`
        @keyframes wave-animation {
          0% { background-position: 0 0; }
          100% { background-position: 200px 0; }
        }
        
        @keyframes drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        
        @keyframes splash {
          0% { transform: scale(0.3) translateY(0); opacity: 0.9; }
          50% { transform: scale(1.2) translateY(-25px); opacity: 0.8; }
          100% { transform: scale(2) translateY(-40px); opacity: 0; }
        }
        
        @keyframes cannonfire {
          0% { transform: scaleX(0.3); opacity: 0.9; }
          50% { transform: scaleX(1.5); opacity: 0.8; }
          100% { transform: scaleX(2.5); opacity: 0; }
        }
        
        @keyframes blast {
          0% { transform: scale(0.3); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        .lightning-bolt {
          position: absolute;
          width: 3px;
          background: linear-gradient(to bottom, rgba(250, 204, 21, 0.9), rgba(250, 204, 21, 0.7));
          clip-path: polygon(
            0% 0%, 100% 0%, 80% 20%, 100% 20%, 
            70% 40%, 100% 40%, 60% 60%, 
            80% 60%, 40% 80%, 60% 80%, 
            20% 100%, 40% 100%, 0% 100%
          );
        }
        
        /* Refined wave animations */
        .wave-container {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          right: 0;
        }
        
        .waves {
          position: relative;
          width: 100%;
          height: 100%;
          margin-bottom: -7px;
          min-height: 100px;
          max-height: 150px;
        }
        
        .parallax > use {
          animation: move-forever linear infinite;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes move-forever {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
        
        .ocean-depth {
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.15) 85%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }
        
        .splash-effect {
          border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
          background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0) 100%);
          animation: splash-rise 1.5s ease-out forwards;
          opacity: 0;
          filter: blur(2px);
        }
        
        @keyframes splash-rise {
          0% { opacity: 0.8; transform: scale(0.3) translateY(0); border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          50% { opacity: 0.9; transform: scale(1.5) translateY(-50px); border-radius: 38% 62% 64% 36% / 58% 42% 58% 42%; }
          100% { opacity: 0; transform: scale(2) translateY(-70px); border-radius: 24% 76% 35% 65% / 72% 28% 72% 28%; }
        }
        
        .whitecap-container {
          height: 20%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
} 