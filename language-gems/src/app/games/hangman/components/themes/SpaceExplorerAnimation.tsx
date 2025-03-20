'use client';

import { useEffect, useState } from 'react';

type SpaceExplorerAnimationProps = {
  mistakes: number;
  maxMistakes: number;
};

export default function SpaceExplorerAnimation({ mistakes, maxMistakes }: SpaceExplorerAnimationProps) {
  const [animated, setAnimated] = useState(false);
  const [stars, setStars] = useState<Array<{id: number, top: number, left: number, size: number, opacity: number}>>([]);
  const [planets, setPlanets] = useState<Array<{id: number, top: number, left: number, size: number, color: string, hasMoon: boolean, moonSize: number, moonOrbit: number, moonSpeed: number, rings?: boolean}>>([]);
  const dangerPercentage = (mistakes / maxMistakes) * 100;
  const distancePercentage = 100 - dangerPercentage;
  
  // Animation effect when mistakes change
  useEffect(() => {
    setAnimated(true);
    const timer = setTimeout(() => setAnimated(false), 500);
    return () => clearTimeout(timer);
  }, [mistakes]);
  
  // Generate random stars and planets
  useEffect(() => {
    // Generate stars
    const starCount = 50;
    const newStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setStars(newStars);
    
    // Generate planets
    const planetCount = 4;
    const newPlanets = Array.from({ length: planetCount }, (_, i) => {
      const planetColors = ['bg-red-400', 'bg-blue-300', 'bg-amber-400', 'bg-teal-400', 'bg-purple-300'];
      return {
        id: i,
        top: 10 + Math.random() * 60,
        left: 5 + Math.random() * 85,
        size: 8 + Math.random() * 15,
        color: planetColors[Math.floor(Math.random() * planetColors.length)],
        hasMoon: Math.random() > 0.5,
        moonSize: 2 + Math.random() * 4,
        moonOrbit: 10 + Math.random() * 8,
        moonSpeed: 5 + Math.random() * 10,
        rings: Math.random() > 0.7
      };
    });
    setPlanets(newPlanets);
  }, []);
  
  return (
    <div className={`relative w-full h-64 overflow-hidden rounded-xl shadow-2xl mb-6 ${animated ? 'animate-pulse' : ''}`}>
      {/* Space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-black">
        {/* Stars */}
        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ 
              top: `${star.top}%`, 
              left: `${star.left}%`, 
              width: `${star.size}px`, 
              height: `${star.size}px`, 
              opacity: star.opacity,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`
            }}
          />
        ))}
        
        {/* Planets */}
        {planets.map((planet) => (
          <div key={planet.id}>
            {/* Planet */}
            <div 
              className={`absolute rounded-full ${planet.color}`}
              style={{ 
                top: `${planet.top}%`, 
                left: `${planet.left}%`, 
                width: `${planet.size}px`, 
                height: `${planet.size}px`, 
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
              }}
            >
              {/* Planet surface details */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
                <div className="absolute h-1/3 w-2/3 bg-white top-1/4 left-1/4 rounded-full"></div>
                <div className="absolute h-1/4 w-1/4 bg-white top-2/3 left-1/3 rounded-full"></div>
              </div>
            </div>
            
            {/* Rings for some planets */}
            {planet.rings && (
              <div 
                className="absolute bg-gray-300 opacity-40"
                style={{ 
                  top: `${planet.top + planet.size/2 - 1}%`, 
                  left: `${planet.left - planet.size/4}%`, 
                  width: `${planet.size * 1.5}px`, 
                  height: `2px`,
                  transform: 'rotate(-15deg)'
                }}
              ></div>
            )}
            
            {/* Moon */}
            {planet.hasMoon && (
              <div 
                className="absolute rounded-full bg-gray-300"
                style={{ 
                  top: `${planet.top}%`, 
                  left: `${planet.left}%`, 
                  width: `${planet.moonSize}px`, 
                  height: `${planet.moonSize}px`,
                  animation: `orbit ${planet.moonSpeed}s linear infinite`,
                  transformOrigin: `${planet.size/2}px ${planet.size/2}px`
                }}
              ></div>
            )}
          </div>
        ))}
        
        {/* Distant nebula */}
        <div className="absolute top-10 left-20 w-40 h-20 rounded-full bg-purple-500 opacity-20 blur-xl"></div>
        <div className="absolute bottom-30 right-10 w-30 h-20 rounded-full bg-blue-500 opacity-10 blur-xl"></div>
        
        {/* Shooting star occasionally */}
        <div 
          className="absolute h-0.5 w-20 bg-white"
          style={{
            top: '20%',
            left: '70%',
            transform: 'rotate(-45deg)',
            opacity: Math.random() > 0.5 ? 0.7 : 0,
            boxShadow: '0 0 4px white',
            animation: 'fall 3s linear infinite'
          }}
        ></div>
      </div>
      
      {/* Main Spaceship (fixed position) */}
      <div className="absolute top-1/3 left-15 transform -translate-y-1/2">
        {/* Ship body - bigger size */}
        <div className="relative">
          <div className="w-40 h-18 bg-gray-200 rounded-lg border-2 border-gray-300">
            {/* Ship details */}
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-500"></div>
            
            {/* Ship windows */}
            <div className="absolute top-4 left-6 w-3 h-3 bg-cyan-300 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-4 left-12 w-3 h-3 bg-cyan-300 rounded-full opacity-70" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-4 left-18 w-3 h-3 bg-cyan-300 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-4 left-24 w-3 h-3 bg-cyan-300 rounded-full opacity-70" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-4 left-30 w-3 h-3 bg-cyan-300 rounded-full opacity-70 animate-pulse" style={{animationDelay: '0.7s'}}></div>
            
            {/* Control panel lights */}
            <div className="absolute top-10 left-8 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute top-10 left-12 w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-10 left-16 w-1 h-1 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-10 left-20 w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          {/* Ship cockpit */}
          <div className="absolute top-2 left-28 w-10 h-12 bg-cyan-300 rounded-t-full opacity-80 border border-gray-400"></div>
          
          {/* Ship wings */}
          <div className="absolute top-3 left-2 w-8 h-20 bg-gray-300 rounded-l-lg transform -translate-y-2"></div>
          <div className="absolute top-3 right-2 w-8 h-20 bg-gray-300 rounded-r-lg transform -translate-y-2"></div>
          
          {/* Ship engines with animated thrusters */}
          <div className="absolute bottom-0 left-12 w-5 h-6 bg-gray-400 rounded-b-lg">
            <div className="absolute -bottom-3 left-0 w-5 h-5 bg-orange-500 rounded-full animate-pulse opacity-80"></div>
          </div>
          <div className="absolute bottom-0 left-22 w-5 h-6 bg-gray-400 rounded-b-lg">
            <div className="absolute -bottom-3 left-0 w-5 h-5 bg-orange-500 rounded-full animate-pulse opacity-80" style={{animationDelay: '0.3s'}}></div>
          </div>
          <div className="absolute bottom-0 right-12 w-5 h-6 bg-gray-400 rounded-b-lg">
            <div className="absolute -bottom-3 left-0 w-5 h-5 bg-orange-500 rounded-full animate-pulse opacity-80" style={{animationDelay: '0.6s'}}></div>
          </div>
          
          {/* Ship details: radar and antenna */}
          <div className="absolute -top-4 left-8 w-1 h-4 bg-gray-400">
            <div className="absolute -top-1 -left-1 w-3 h-1 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute -top-6 right-10 w-6 h-6 bg-transparent border-2 border-gray-400 rounded-full">
            <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-500 animate-spin" style={{transformOrigin: 'left', transform: 'translateY(-50%)'}}></div>
          </div>
        </div>
      </div>
      
      {/* Astronaut (drifts away as mistakes increase) */}
      <div 
        className="absolute transition-all duration-1000"
        style={{ 
          top: '50%',
          left: `${45 + (dangerPercentage * 0.4)}%`,
          transform: `scale(${1 - (dangerPercentage * 0.005)}) translateY(-50%)`
        }}
      >
        <div className="relative w-16 h-20">
          {/* Spacesuit */}
          <div className="absolute inset-0 bg-gray-300 rounded-lg"></div>
          
          {/* Helmet */}
          <div className="absolute top-0 left-3 w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-400">
            {/* Visor */}
            <div className="absolute top-3 left-1 w-8 h-4 bg-cyan-400 rounded-full opacity-70"></div>
            
            {/* Face details */}
            {dangerPercentage > 50 && (
              <div className="absolute top-4 left-3 w-4 h-1 bg-gray-800 rounded-full opacity-70"></div>
            )}
            
            {/* Oxygen depleting */}
            <div 
              className="absolute top-0 left-0 w-full bg-cyan-300 opacity-30 transition-all duration-1000"
              style={{ height: `${distancePercentage}%` }}
            ></div>
          </div>
          
          {/* Oxygen tank */}
          <div className="absolute top-8 left-2 w-4 h-8 bg-gray-500 rounded"></div>
          <div className="absolute top-8 right-2 w-4 h-8 bg-gray-500 rounded"></div>
          
          {/* Equipment details */}
          <div className="absolute top-14 left-6 w-4 h-2 bg-blue-500 rounded"></div>
          <div className="absolute top-5 right-1 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
          
          {/* Arms - make them flail more as mistakes increase */}
          <div 
            className="absolute top-8 left-0 w-2 h-6 bg-gray-400 rounded-full"
            style={{ 
              transform: `rotate(${-20 - (mistakes * 8)}deg)`, 
              transformOrigin: 'top'
            }}
          ></div>
          <div 
            className="absolute top-8 right-0 w-2 h-6 bg-gray-400 rounded-full"
            style={{ 
              transform: `rotate(${20 + (mistakes * 8)}deg)`,
              transformOrigin: 'top'
            }}
          ></div>
          
          {/* Legs */}
          <div 
            className="absolute bottom-0 left-3 w-3 h-6 bg-gray-400 rounded-full"
            style={{ 
              transform: `rotate(${-5 - (mistakes * 3)}deg)`
            }}
          ></div>
          <div 
            className="absolute bottom-0 right-3 w-3 h-6 bg-gray-400 rounded-full"
            style={{ 
              transform: `rotate(${5 + (mistakes * 3)}deg)`
            }}
          ></div>
        </div>
        
        {/* Connecting tether that breaks as mistakes increase */}
        {dangerPercentage < 70 && (
          <div 
            className="absolute right-full top-1/2 h-1 bg-white"
            style={{ 
              width: `${Math.max(100 - dangerPercentage * 2, 10)}px`,
              opacity: 1 - (dangerPercentage / 100)
            }}
          ></div>
        )}
      </div>
      
      {/* Space debris floating (appears with more mistakes) */}
      {mistakes > 1 && (
        <div 
          className="absolute w-3 h-2 bg-gray-500 rounded"
          style={{ 
            top: '30%', 
            left: '60%',
            animation: 'float-up 15s linear infinite',
            transform: 'rotate(45deg)'
          }}
        ></div>
      )}
      
      {mistakes > 2 && (
        <div 
          className="absolute w-4 h-4 bg-gray-600 rounded"
          style={{ 
            top: '60%', 
            left: '70%',
            animation: 'float-up 20s linear infinite',
            animationDelay: '2s',
            transform: 'rotate(-30deg)'
          }}
        ></div>
      )}
      
      {/* Oxygen warning */}
      {dangerPercentage > 50 && (
        <div className="absolute top-1/3 right-1/4 text-red-500 font-mono text-xs animate-pulse">
          OXYGEN LOW
        </div>
      )}
      
      {dangerPercentage > 75 && (
        <div className="absolute top-1/4 right-1/3 text-red-500 font-mono text-xs animate-bounce">
          CRITICAL
        </div>
      )}

      {/* Distance indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-cyan-300 text-xs mb-1 font-mono">Astronaut Distance: {Math.round(dangerPercentage)}%</div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${dangerPercentage}%`,
              backgroundColor: dangerPercentage < 33 ? 'rgb(74, 222, 128)' : dangerPercentage < 66 ? 'rgb(234, 88, 12)' : 'rgb(220, 38, 38)',
              boxShadow: `0 0 5px ${dangerPercentage < 33 ? 'rgb(74, 222, 128)' : dangerPercentage < 66 ? 'rgb(234, 88, 12)' : 'rgb(220, 38, 38)'}`
            }}
          ></div>
        </div>
      </div>

      {/* Mission control communication (appears when critical) */}
      {dangerPercentage > 80 && (
        <div className="absolute top-5 left-5 text-white text-xs font-mono opacity-70 animate-pulse">
          MISSION CONTROL: RETURN IMMEDIATELY
        </div>
      )}
    </div>
  );
} 