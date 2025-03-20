'use client';

import { useEffect, useState } from 'react';

type PirateAdventureAnimationProps = {
  mistakes: number;
  maxMistakes: number;
};

export default function PirateAdventureAnimation({ mistakes, maxMistakes }: PirateAdventureAnimationProps) {
  const [animated, setAnimated] = useState(false);
  const [clouds, setClouds] = useState<Array<{id: number, top: number, left: number, width: number, height: number, speed: number}>>([]);
  const [birds, setBirds] = useState<Array<{id: number, top: number, left: number, size: number, speed: number}>>([]);
  const dangerPercentage = (mistakes / maxMistakes) * 100;
  
  // Animation effect when mistakes change
  useEffect(() => {
    setAnimated(true);
    const timer = setTimeout(() => setAnimated(false), 500);
    return () => clearTimeout(timer);
  }, [mistakes]);
  
  // Generate clouds and birds
  useEffect(() => {
    // Generate clouds
    const cloudCount = 5;
    const newClouds = Array.from({ length: cloudCount }, (_, i) => ({
      id: i,
      top: 5 + Math.random() * 20,
      left: Math.random() * 100,
      width: 30 + Math.random() * 40,
      height: 15 + Math.random() * 10,
      speed: 0.2 + Math.random() * 0.3
    }));
    setClouds(newClouds);
    
    // Generate birds
    const birdCount = 4;
    const newBirds = Array.from({ length: birdCount }, (_, i) => ({
      id: i,
      top: 5 + Math.random() * 15,
      left: 10 + Math.random() * 80,
      size: 3 + Math.random() * 2,
      speed: 1 + Math.random() * 2
    }));
    setBirds(newBirds);
  }, []);
  
  return (
    <div className={`relative w-full h-64 overflow-hidden rounded-xl shadow-2xl mb-6 ${animated ? 'animate-pulse' : ''}`}>
      {/* Ocean background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900">
        {/* Sky */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-sky-400 to-blue-500"></div>
        
        {/* Sun */}
        <div className="absolute top-5 right-10 w-12 h-12 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
        
        {/* Clouds */}
        {clouds.map((cloud) => (
          <div 
            key={cloud.id}
            className="absolute bg-white rounded-full opacity-80"
            style={{ 
              top: `${cloud.top}%`, 
              left: `${cloud.left}%`, 
              width: `${cloud.width}px`, 
              height: `${cloud.height}px`,
              animation: `float ${10 / cloud.speed}s linear infinite`,
              animationDelay: `${cloud.id * 2}s`
            }}
          >
            {/* Cloud details */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white rounded-full opacity-90"></div>
            <div className="absolute top-0 left-1/3 w-1/3 h-2/3 bg-white rounded-full opacity-90"></div>
            <div className="absolute top-1/3 left-1/6 w-1/3 h-1/3 bg-white rounded-full opacity-90"></div>
            <div className="absolute top-1/4 right-1/6 w-1/3 h-1/2 bg-white rounded-full opacity-90"></div>
          </div>
        ))}
        
        {/* Birds */}
        {birds.map((bird) => (
          <div 
            key={bird.id}
            className="absolute"
            style={{ 
              top: `${bird.top}%`, 
              left: `${bird.left}%`,
              animation: `float ${8 / bird.speed}s linear infinite`,
              animationDelay: `${bird.id}s`
            }}
          >
            {/* Simple bird shape */}
            <div className="relative">
              <div 
                className="absolute bg-black"
                style={{ 
                  width: `${bird.size}px`, 
                  height: `${bird.size/2}px`,
                  borderRadius: '50% 50% 0 0',
                  transform: 'rotate(45deg)'
                }}
              ></div>
              <div 
                className="absolute bg-black"
                style={{ 
                  width: `${bird.size}px`, 
                  height: `${bird.size/2}px`,
                  borderRadius: '50% 50% 0 0',
                  transform: 'rotate(-45deg)',
                  left: `${bird.size * 0.7}px`
                }}
              ></div>
            </div>
          </div>
        ))}
        
        {/* Islands */}
        {/* Island 1 */}
        <div className="absolute bottom-16 left-10 w-40 h-16 bg-yellow-700 rounded-t-full rounded-r-full">
          {/* Sand details */}
          <div className="absolute top-0 left-10 w-20 h-4 bg-yellow-600 rounded-full"></div>
          <div className="absolute top-2 left-5 w-10 h-2 bg-yellow-600 rounded-full"></div>
          
          {/* Palm tree 1 */}
          <div className="absolute bottom-5 left-5 w-2 h-10 bg-amber-800 rounded-full transform rotate-6"></div>
          <div className="absolute bottom-14 left-2 w-8 h-5 bg-green-700 rounded-full"></div>
          <div className="absolute bottom-12 left-0 w-6 h-4 bg-green-700 rounded-full"></div>
          <div className="absolute bottom-13 left-6 w-7 h-4 bg-green-700 rounded-full"></div>
          
          {/* Palm tree 2 */}
          <div className="absolute bottom-6 right-10 w-2 h-12 bg-amber-800 rounded-full transform -rotate-6"></div>
          <div className="absolute bottom-16 right-7 w-8 h-5 bg-green-700 rounded-full"></div>
          <div className="absolute bottom-14 right-12 w-6 h-4 bg-green-700 rounded-full"></div>
          <div className="absolute bottom-15 right-5 w-7 h-4 bg-green-700 rounded-full"></div>
          
          {/* Treasure chest */}
          <div className="absolute bottom-4 left-20 w-6 h-4 bg-amber-900 rounded-sm border border-amber-700"></div>
          <div className="absolute bottom-6 left-20 w-6 h-2 bg-amber-800 rounded-b-sm border border-amber-700"></div>
          <div className="absolute bottom-5 left-22 w-2 h-1 bg-yellow-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Island 2 */}
        <div className="absolute bottom-12 right-5 w-30 h-12 bg-yellow-700 rounded-t-full rounded-l-full">
          {/* Sand details */}
          <div className="absolute top-0 right-8 w-15 h-3 bg-yellow-600 rounded-full"></div>
          
          {/* Palm tree */}
          <div className="absolute bottom-4 right-10 w-2 h-8 bg-amber-800 rounded-full transform -rotate-12"></div>
          <div className="absolute bottom-11 right-7 w-8 h-5 bg-green-700 rounded-full"></div>
          <div className="absolute bottom-9 right-12 w-6 h-4 bg-green-700 rounded-full"></div>
          
          {/* Animal (crab) */}
          <div className="absolute bottom-2 right-20 w-4 h-3 bg-red-500 rounded-full animate-bobUpDown"></div>
          <div className="absolute bottom-3 right-18 w-1 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute bottom-3 right-23 w-1 h-2 bg-red-500 rounded-full"></div>
        </div>
        
        {/* Animated waves - improved with multiple layers */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-blue-600 opacity-70"
          style={{
            clipPath: 'polygon(0% 100%, 0% 40%, 2% 45%, 4% 40%, 6% 45%, 8% 40%, 10% 45%, 12% 40%, 14% 45%, 16% 40%, 18% 45%, 20% 40%, 22% 45%, 24% 40%, 26% 45%, 28% 40%, 30% 45%, 32% 40%, 34% 45%, 36% 40%, 38% 45%, 40% 40%, 42% 45%, 44% 40%, 46% 45%, 48% 40%, 50% 45%, 52% 40%, 54% 45%, 56% 40%, 58% 45%, 60% 40%, 62% 45%, 64% 40%, 66% 45%, 68% 40%, 70% 45%, 72% 40%, 74% 45%, 76% 40%, 78% 45%, 80% 40%, 82% 45%, 84% 40%, 86% 45%, 88% 40%, 90% 45%, 92% 40%, 94% 45%, 96% 40%, 98% 45%, 100% 40%, 100% 100%)',
            animation: 'waveMotion 10s infinite linear'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 bg-blue-500 opacity-60"
          style={{
            clipPath: 'polygon(0% 100%, 0% 45%, 2% 40%, 4% 45%, 6% 40%, 8% 45%, 10% 40%, 12% 45%, 14% 40%, 16% 45%, 18% 40%, 20% 45%, 22% 40%, 24% 45%, 26% 40%, 28% 45%, 30% 40%, 32% 45%, 34% 40%, 36% 45%, 38% 40%, 40% 45%, 42% 40%, 44% 45%, 46% 40%, 48% 45%, 50% 40%, 52% 45%, 54% 40%, 56% 45%, 58% 40%, 60% 45%, 62% 40%, 64% 45%, 66% 40%, 68% 45%, 70% 40%, 72% 45%, 74% 40%, 76% 45%, 78% 40%, 80% 45%, 82% 40%, 84% 40%, 86% 45%, 88% 40%, 90% 45%, 92% 45%, 94% 40%, 96% 45%, 98% 40%, 100% 45%, 100% 100%)',
            animation: 'waveMotion 8s infinite linear reverse'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-blue-400 opacity-50"
          style={{
            clipPath: 'polygon(0% 100%, 0% 45%, 2% 50%, 4% 45%, 6% 50%, 8% 45%, 10% 50%, 12% 45%, 14% 50%, 16% 45%, 18% 50%, 20% 45%, 22% 50%, 24% 45%, 26% 50%, 28% 45%, 30% 50%, 32% 45%, 34% 50%, 36% 45%, 38% 50%, 40% 45%, 42% 50%, 44% 45%, 46% 50%, 48% 45%, 50% 50%, 52% 45%, 54% 50%, 56% 45%, 58% 50%, 60% 45%, 62% 50%, 64% 45%, 66% 50%, 68% 45%, 70% 50%, 72% 45%, 74% 50%, 76% 45%, 78% 50%, 80% 45%, 82% 50%, 84% 45%, 86% 50%, 88% 45%, 90% 50%, 92% 45%, 94% 50%, 96% 45%, 98% 50%, 100% 45%, 100% 100%)',
            animation: 'waveMotion 6s infinite linear'
          }}
        ></div>
        
        {/* Wave foam/splash effects as mistakes increase */}
        {mistakes > 2 && (
          <>
            <div className="absolute bottom-16 left-1/4 w-3 h-3 rounded-full bg-white opacity-80 animate-bobUpDown"></div>
            <div className="absolute bottom-14 left-1/3 w-2 h-2 rounded-full bg-white opacity-70" style={{animationDelay: '0.5s'}}></div>
          </>
        )}
        
        {mistakes > 4 && (
          <>
            <div className="absolute bottom-18 left-2/3 w-4 h-4 rounded-full bg-white opacity-80 animate-bobUpDown"></div>
            <div className="absolute bottom-16 left-1/2 w-3 h-3 rounded-full bg-white opacity-70" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute bottom-14 right-1/4 w-2 h-2 rounded-full bg-white opacity-60" style={{animationDelay: '0.7s'}}></div>
          </>
        )}
      </div>
      
      {/* Ship */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000" 
        style={{
          bottom: `${Math.max(20 - mistakes * 5, 0)}%`,
          transform: `translateX(-50%) rotate(${mistakes > 3 ? (mistakes - 3) * 3 : 0}deg)`,
        }}
      >
        <div className="relative w-48 h-32">
          {/* Ship hull */}
          <div className="w-48 h-24 bg-amber-800 rounded-b-xl rounded-t-lg border-t-2 border-amber-700 relative overflow-hidden">
            {/* Ship damage */}
            {mistakes >= 1 && (
              <div className="absolute top-2 right-5 w-8 h-5 bg-amber-900 rounded-full"></div>
            )}
            {mistakes >= 2 && (
              <div className="absolute top-10 left-8 w-10 h-6 bg-amber-900 rounded-full"></div>
            )}
            {mistakes >= 3 && (
              <div className="absolute bottom-2 right-12 w-9 h-7 bg-amber-900 rounded-full"></div>
            )}
            {mistakes >= 4 && (
              <div className="absolute bottom-5 left-3 w-8 h-7 bg-blue-800 rounded-full animate-pulse"></div>
            )}
            {mistakes >= 5 && (
              <div className="absolute top-5 left-20 w-9 h-8 bg-blue-800 rounded-full animate-pulse"></div>
            )}
            
            {/* Water inside ship based on wrong guesses */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-700"
              style={{ 
                height: `${mistakes * 20}%`,
                opacity: 0.7
              }}
            ></div>
            
            {/* Cabin */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-10 bg-amber-700 rounded-t-lg"></div>
            {/* Windows */}
            <div className="absolute top-3 left-1/3 w-4 h-4 bg-yellow-300 rounded-full opacity-70"></div>
            <div className="absolute top-3 right-1/3 w-4 h-4 bg-yellow-300 rounded-full opacity-70"></div>
            
            {/* Ship details */}
            <div className="absolute bottom-2 left-6 w-36 h-2 bg-amber-900"></div>
            <div className="absolute bottom-6 left-4 w-40 h-2 bg-amber-900"></div>
          </div>
          
          {/* Mast */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-3 h-36 bg-amber-900"></div>
          
          {/* Sail */}
          <div className="absolute bottom-36 left-1/4 w-24 h-24 bg-gray-200 rounded-l-full overflow-hidden animate-sway" style={{transformOrigin: 'center left'}}>
            {/* Skull and crossbones */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">☠️</div>
            {/* Sail details */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-300"></div>
            <div className="absolute top-15 left-0 w-full h-1 bg-gray-300"></div>
          </div>
          
          {/* Crow's nest */}
          <div className="absolute bottom-45 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-amber-800 rounded-full"></div>
          {/* Pirate in crow's nest */}
          {mistakes < 4 && (
            <div className="absolute bottom-47 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full">
              {/* Eye patch */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-amber-700 rounded-full"></div>
            </div>
          )}
          
          {/* Flag */}
          <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-black">
            <div className="absolute inset-0 flex items-center justify-center text-sm">🏴‍☠️</div>
          </div>
        </div>
      </div>
      
      {/* Fish jumping occasionally */}
      {Math.random() > 0.7 && (
        <div 
          className="absolute w-6 h-3 bg-silver-400 rounded-full"
          style={{ 
            bottom: '20%', 
            left: '30%',
            transform: 'rotate(45deg)',
            animation: 'bobUpDown 1.5s ease-in-out infinite'
          }}
        >
          <div className="absolute right-0 w-2 h-3 bg-silver-400 rounded-r-full" style={{transform: 'skew(0, 30deg)'}}></div>
        </div>
      )}
      
      {/* Seagull occasionally */}
      {Math.random() > 0.5 && (
        <div 
          className="absolute"
          style={{ 
            bottom: '70%', 
            left: Math.random() * 80 + '%',
            animation: 'float 20s linear infinite'
          }}
        >
          <div className="relative">
            <div className="absolute bg-white w-6 h-2" style={{borderRadius: '50% 50% 0 0', transform: 'rotate(30deg)'}}></div>
            <div className="absolute bg-white w-6 h-2 left-4" style={{borderRadius: '50% 50% 0 0', transform: 'rotate(-30deg)'}}></div>
            <div className="absolute top-1 left-3 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}
      
      {/* Storm effects with more mistakes */}
      {mistakes > 3 && (
        <>
          <div className="absolute top-1/4 left-1/4 w-screen h-1 bg-white opacity-50 animate-pulse transform rotate-45"></div>
          {mistakes > 4 && (
            <>
              <div className="absolute top-1/3 right-1/3 w-screen h-1 bg-white opacity-40 animate-pulse transform -rotate-45"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-10"></div>
            </>
          )}
        </>
      )}
      
      {/* Ship integrity meter */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-amber-300 text-xs mb-1 font-bold">Ship Integrity: {Math.round(100 - (mistakes / maxMistakes * 100))}%</div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${100 - (mistakes / maxMistakes * 100)}%`,
              backgroundColor: mistakes > (maxMistakes * 0.6) ? 'rgb(220, 38, 38)' : mistakes > (maxMistakes * 0.3) ? 'rgb(234, 88, 12)' : 'rgb(74, 222, 128)',
              boxShadow: `0 0 5px ${mistakes > (maxMistakes * 0.6) ? 'rgb(220, 38, 38)' : mistakes > (maxMistakes * 0.3) ? 'rgb(234, 88, 12)' : 'rgb(74, 222, 128)'}`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 