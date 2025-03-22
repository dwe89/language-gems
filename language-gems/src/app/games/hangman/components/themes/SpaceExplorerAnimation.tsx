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
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);
  const [asteroids, setAsteroids] = useState<Array<{id: number, x: number, y: number, size: number, rotation: number}>>([]);
  const [shipShield, setShipShield] = useState(100);
  const [enginePower, setEnginePower] = useState(100);
  const [alienAttack, setAlienAttack] = useState(false);
  const [meteorShower, setMeteorShower] = useState(false);
  const [warpEffect, setWarpEffect] = useState(false);
  const [planetGlow, setPlanetGlow] = useState(false);
  
  // Calculate values based on mistakes
  const mistakeRatio = mistakes / maxMistakes;
  const oxygenLevel = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  const distanceToDestination = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  const shipDamage = Math.min(100, mistakeRatio * 120).toFixed(0);
  
  // Initialize stars
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.4 + Math.random() * 0.6
    }));
    
    setStars(newStars);
  }, []);
  
  // Initialize asteroids
  useEffect(() => {
    const newAsteroids = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 5 + Math.random() * 15,
      rotation: Math.random() * 360
    }));
    
    setAsteroids(newAsteroids);
  }, []);
  
  // Update ship shield and engine power based on mistakes
  useEffect(() => {
    setShipShield(Math.max(0, 100 - (mistakeRatio * 120)));
    setEnginePower(Math.max(0, 100 - (mistakeRatio * 80)));
    
    // Trigger alien attack when mistakes are made
    if (mistakes > 0) {
      setAlienAttack(true);
      setTimeout(() => setAlienAttack(false), 1000);
    }
    
    // Trigger meteor shower with high mistake count
    if (mistakeRatio > 0.5 && Math.random() > 0.7) {
      setMeteorShower(true);
      setTimeout(() => setMeteorShower(false), 2000);
    }
  }, [mistakes, mistakeRatio]);
  
  // Periodic warp effect
  useEffect(() => {
    const warpInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setWarpEffect(true);
        setTimeout(() => setWarpEffect(false), 700);
      }
    }, 5000);
    
    return () => clearInterval(warpInterval);
  }, []);
  
  // Planet glow effect
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setPlanetGlow(prev => !prev);
    }, 3000);
    
    return () => clearInterval(glowInterval);
  }, []);
  
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl">
      {/* Space background with stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-black to-purple-950">
        {/* Stars */}
        {stars.map(star => (
          <div 
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{ 
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`, 
              height: `${star.size}px`, 
              opacity: star.opacity,
              animationDelay: `${(star.id % 10) * 0.3}s`
            }}
          />
        ))}
        
        {/* Warp effect */}
        {warpEffect && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-2 h-2 rounded-full bg-blue-400 animate-warp-center"></div>
            <div className="absolute w-screen h-screen border-4 border-blue-300 rounded-full animate-warp-ring"></div>
            <div className="absolute w-screen h-screen border-2 border-blue-500 rounded-full animate-warp-ring" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute w-screen h-screen border border-cyan-400 rounded-full animate-warp-ring" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        
        {/* Distant planets */}
        <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-gradient-to-br from-red-800 to-red-500 opacity-70">
          {/* Planet rings */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-red-300 opacity-40 transform -rotate-12"></div>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-200 opacity-30 transform -rotate-15"></div>
        </div>
        
        <div 
          className={`absolute bottom-10 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-green-700 to-emerald-400 ${planetGlow ? 'opacity-80' : 'opacity-60'} transition-opacity duration-1000`}
        >
          {/* Planet details */}
          <div className="absolute top-2 left-4 w-8 h-8 rounded-full bg-emerald-300 opacity-30"></div>
          <div className="absolute top-10 right-5 w-10 h-5 rounded-full bg-emerald-300 opacity-20"></div>
      </div>
      
        {/* Destination planet - gets closer as you make fewer mistakes */}
        <div 
          className={`absolute ${mistakeRatio < 0.3 ? 'top-20 left-1/2 transform -translate-x-1/2 w-48 h-48' : 'top-5 left-1/2 transform -translate-x-1/2 w-20 h-20'} rounded-full bg-gradient-to-br from-blue-700 to-cyan-400 transition-all duration-1000`}
        >
          {/* Planet details */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 rounded-full bg-cyan-300 opacity-30"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1/3 h-1/4 rounded-full bg-cyan-300 opacity-20"></div>
          
          {/* Atmosphere glow */}
          <div className={`absolute -inset-2 rounded-full bg-cyan-500 opacity-20 ${mistakeRatio < 0.3 ? 'animate-pulse' : ''}`}></div>
        </div>
      </div>
      
      {/* Asteroids that move faster and become more dangerous with mistakes */}
      {asteroids.map(asteroid => (
        <div 
          key={asteroid.id}
          className="absolute bg-gray-700 rounded-full"
          style={{
            left: `${asteroid.x}%`,
            top: `${asteroid.y}%`,
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            animation: `float-asteroid ${8 - mistakeRatio * 4}s linear infinite`,
            animationDelay: `${asteroid.id * 0.5}s`,
            transform: `rotate(${asteroid.rotation}deg)`
          }}
        >
          {/* Asteroid details */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-800 rounded-full"></div>
          <div className="absolute top-1/3 right-1/5 w-1/5 h-1/5 bg-gray-600 rounded-full"></div>
        </div>
      ))}
      
      {/* Meteor shower during high mistake counts */}
      {meteorShower && (
        <>
          {[...Array(10)].map((_, i) => (
            <div 
              key={`meteor-${i}`}
              className="absolute w-1 h-6 bg-orange-500 rounded-full animate-meteor"
              style={{ 
                top: `${Math.random() * -10}%`, 
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.7
              }}
            >
              <div className="absolute top-0 w-2 h-2 bg-yellow-300 rounded-full"></div>
            </div>
          ))}
        </>
      )}
      
      {/* Spaceship */}
      <div 
        className={`absolute left-1/2 bottom-20 transform -translate-x-1/2 transition-all duration-500 ${
          mistakes > 0 ? 'animate-ship-wobble' : ''
        }`}
        style={{ 
          transform: `translateX(-50%) rotate(${mistakeRatio > 0.5 ? (Math.random() * 6 - 3) : 0}deg)`
        }}
      >
        {/* Ship body */}
        <div className="relative">
          <div className="w-32 h-16 bg-slate-800 rounded-t-3xl"></div>
          <div className="w-32 h-8 bg-slate-700 rounded-b-lg"></div>
          
          {/* Cockpit */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-cyan-300 rounded-t-full opacity-70"></div>
          
          {/* Wings */}
          <div className="absolute top-6 left-0 w-12 h-4 bg-slate-600 -skew-y-12 transform -translate-x-8"></div>
          <div className="absolute top-6 right-0 w-12 h-4 bg-slate-600 skew-y-12 transform translate-x-8"></div>
            
          {/* Engine exhausts */}
          <div className="absolute bottom-0 left-8 w-4 h-6 flex justify-center overflow-hidden">
            <div 
              className={`w-2 animate-flame ${enginePower > 70 ? 'h-10' : enginePower > 40 ? 'h-6' : 'h-3'}`}
              style={{ 
                background: 'linear-gradient(to bottom, #3b82f6, #60a5fa, #93c5fd)',
                opacity: enginePower / 100
              }}
            ></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-6 flex justify-center overflow-hidden">
            <div 
              className={`w-2 animate-flame ${enginePower > 70 ? 'h-12' : enginePower > 40 ? 'h-8' : 'h-4'}`}
            style={{ 
                background: 'linear-gradient(to bottom, #3b82f6, #60a5fa, #93c5fd)',
                opacity: enginePower / 100
            }}
          ></div>
          </div>
          <div className="absolute bottom-0 right-8 w-4 h-6 flex justify-center overflow-hidden">
          <div 
              className={`w-2 animate-flame ${enginePower > 70 ? 'h-10' : enginePower > 40 ? 'h-6' : 'h-3'}`}
            style={{ 
                background: 'linear-gradient(to bottom, #3b82f6, #60a5fa, #93c5fd)',
                opacity: enginePower / 100
            }}
          ></div>
        </div>
        
          {/* Shield effect */}
          {shipShield > 30 && (
          <div 
              className="absolute -inset-2 rounded-full animate-pulse-slow"
            style={{ 
                background: `radial-gradient(circle, rgba(96, 165, 250, ${shipShield / 500}) 0%, rgba(96, 165, 250, 0) 70%)`,
                opacity: shipShield / 100
            }}
          ></div>
        )}
          
          {/* Damage effects */}
          {mistakeRatio > 0.3 && (
            <div className="absolute top-10 left-5 w-4 h-4 bg-orange-500 rounded-full animate-flicker opacity-70"></div>
          )}
          
          {mistakeRatio > 0.5 && (
            <div className="absolute top-4 right-8 w-6 h-3 bg-orange-600 rounded-full animate-flicker opacity-80"></div>
          )}
          
          {mistakeRatio > 0.7 && (
            <>
              <div className="absolute bottom-2 left-3 w-5 h-5 bg-orange-700 rounded-full animate-flicker opacity-90"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full animate-flicker opacity-80"></div>
            </>
          )}
        </div>
      </div>
      
      {/* Alien attack effects */}
      {alienAttack && (
        <>
          <div className="absolute left-10 top-1/3 w-2 h-20 bg-green-500 animate-laser"></div>
          <div className="absolute right-10 top-1/3 w-2 h-20 bg-green-500 animate-laser" style={{ animationDelay: '0.2s' }}></div>
          
          {/* Alien ship */}
          <div className="absolute left-10 top-1/4 w-20 h-8 bg-slate-900 rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-4 bg-green-700 rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-green-500 animate-pulse-fast"></div>
          </div>
          
          <div className="absolute right-10 top-1/4 w-20 h-8 bg-slate-900 rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-4 bg-green-700 rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-green-500 animate-pulse-fast"></div>
          </div>
        </>
      )}
      
      {/* Space station that appears when close to victory */}
      {mistakeRatio < 0.3 && (
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
          <div className="relative w-40 h-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-300 rounded-full"></div>
            <div className="absolute left-1/2 top-5 transform -translate-x-1/2 w-6 h-20 bg-gray-400"></div>
            <div className="absolute left-1/2 top-8 transform -translate-x-1/2 w-24 h-4 bg-gray-300 rounded-full"></div>
            
            {/* Solar panels */}
            <div className="absolute top-8 left-2 w-12 h-4 bg-blue-900"></div>
            <div className="absolute top-8 right-2 w-12 h-4 bg-blue-900"></div>
            
            {/* Docking port with light */}
            <div className="absolute left-1/2 top-12 transform -translate-x-1/2 w-8 h-4 bg-gray-600 rounded-b-lg">
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      
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
            <div className="text-cyan-200 text-xs mb-1">SHIELD INTEGRITY</div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-300" 
                style={{ width: `${shipShield}%` }}
              ></div>
            </div>
        </div>
          
          <div>
            <div className="text-cyan-200 text-xs mb-1">DESTINATION PROXIMITY</div>
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
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes warp-ring {
          0% { transform: scale(0); opacity: 0.7; }
          100% { transform: scale(3); opacity: 0; }
        }
        
        @keyframes warp-center {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(5); opacity: 0.8; }
          100% { transform: scale(10); opacity: 0; }
        }
        
        @keyframes float-asteroid {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-100px, 100px) rotate(360deg); }
        }
        
        @keyframes meteor {
          0% { transform: translateY(0) rotate(15deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(15deg); opacity: 0; }
        }
        
        @keyframes flame {
          0% { transform: scaleX(0.8) translateY(0); }
          50% { transform: scaleX(1.2) translateY(1px); }
          100% { transform: scaleX(0.8) translateY(0); }
        }
        
        @keyframes ship-wobble {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-52%) rotate(-2deg); }
          75% { transform: translateX(-48%) rotate(2deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.4; }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          25% { opacity: 0.6; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
          75% { opacity: 0.7; transform: scale(0.95); }
        }
        
        @keyframes laser {
          0% { height: 0; opacity: 0.9; }
          50% { height: 50vh; opacity: 0.7; }
          100% { height: 0; opacity: 0; }
        }
      `}</style>
    </div>
  );
} 