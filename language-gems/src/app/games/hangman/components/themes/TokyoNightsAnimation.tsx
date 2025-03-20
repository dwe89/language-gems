'use client';

import { useEffect, useState } from 'react';

type TokyoNightsAnimationProps = {
  mistakes: number;
  maxMistakes: number;
};

export default function TokyoNightsAnimation({ mistakes, maxMistakes }: TokyoNightsAnimationProps) {
  const [animated, setAnimated] = useState(false);
  const dangerPercentage = (mistakes / maxMistakes) * 100;
  const [flickeringWindows, setFlickeringWindows] = useState<number[]>([]);
  
  // Animation effect when mistakes change
  useEffect(() => {
    setAnimated(true);
    const timer = setTimeout(() => setAnimated(false), 500);
    return () => clearTimeout(timer);
  }, [mistakes]);
  
  // Set up flickering windows effect
  useEffect(() => {
    // Randomly select window indices to flicker
    const getRandomWindows = () => {
      const windowCount = 15 + 32 + 18 + 45 + 8;
      const flickerCount = Math.floor(windowCount * 0.2); // 20% of windows flicker
      const indices = [];
      
      for (let i = 0; i < flickerCount; i++) {
        indices.push(Math.floor(Math.random() * windowCount));
      }
      
      return indices;
    };
    
    // Update flickering windows every 2 seconds
    const interval = setInterval(() => {
      setFlickeringWindows(getRandomWindows());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Window flickering function
  const shouldFlicker = (index: number) => {
    return flickeringWindows.includes(index);
  };
  
  return (
    <div className={`relative w-full h-64 overflow-hidden rounded-xl shadow-2xl mb-6 ${animated ? 'animate-pulse' : ''}`}>
      {/* Cityscape background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950">
        {/* Stars with twinkling effect */}
        <div className="absolute h-1.5 w-1.5 bg-white rounded-full top-5 left-10 animate-[twinkle_4s_ease-in-out_infinite]"></div>
        <div className="absolute h-1 w-1 bg-white rounded-full top-15 left-50 animate-[twinkle_3s_ease-in-out_infinite]" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute h-2 w-2 bg-white rounded-full top-8 left-70 animate-[twinkle_5s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
        <div className="absolute h-1 w-1 bg-white rounded-full top-20 left-30 animate-[twinkle_3.5s_ease-in-out_infinite]" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute h-1.5 w-1.5 bg-white rounded-full top-12 left-80 animate-[twinkle_4.5s_ease-in-out_infinite]" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute h-1 w-1 bg-white rounded-full top-25 left-20 animate-[twinkle_3.2s_ease-in-out_infinite]" style={{animationDelay: '1.2s'}}></div>
        
        {/* Moon */}
        <div className="absolute h-10 w-10 rounded-full bg-blue-100 top-6 right-20 opacity-60 shadow-lg shadow-blue-100/30"></div>
        
        {/* Buildings */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between">
          <div className="w-14 h-28 bg-slate-900 relative">
            <div className="absolute inset-0 grid grid-rows-5 grid-cols-3 gap-1 p-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className={`
                  ${shouldFlicker(i) ? 'bg-yellow-300 animate-pulse' : 'bg-yellow-400 opacity-70'}
                  ${i % 7 === 0 ? 'bg-pink-400' : ''}
                `}></div>
              ))}
            </div>
            <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="w-20 h-40 bg-slate-800 relative">
            <div className="absolute inset-0 grid grid-rows-8 grid-cols-4 gap-1 p-1">
              {[...Array(32)].map((_, i) => (
                <div key={i + 15} className={`
                  ${shouldFlicker(i + 15) ? 'bg-blue-300 animate-pulse' : 'bg-blue-400 opacity-60'}
                  ${i % 9 === 0 ? 'bg-purple-400' : ''}
                `}></div>
              ))}
            </div>
            <div className="absolute top-0 left-1/2 h-3 w-3 bg-red-500 rounded-full animate-pulse transform -translate-x-1/2"></div>
          </div>
          <div className="w-16 h-36 bg-slate-900 relative">
            <div className="absolute inset-0 grid grid-rows-6 grid-cols-3 gap-1 p-1">
              {[...Array(18)].map((_, i) => (
                <div key={i + 47} className={`
                  ${shouldFlicker(i + 47) ? 'bg-pink-300 animate-pulse' : 'bg-pink-400 opacity-50'}
                  ${i % 6 === 0 ? 'bg-cyan-400' : ''}
                `}></div>
              ))}
            </div>
            <div className="absolute top-2 left-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="w-24 h-48 bg-slate-800 relative">
            <div className="absolute inset-0 grid grid-rows-9 grid-cols-5 gap-1 p-1">
              {[...Array(45)].map((_, i) => (
                <div key={i + 65} className={`
                  ${shouldFlicker(i + 65) ? 'bg-purple-300 animate-pulse' : 'bg-purple-400 opacity-40'}
                  ${i % 11 === 0 ? 'bg-yellow-400' : ''}
                `}></div>
              ))}
            </div>
            <div className="absolute top-0 left-1/2 h-3 w-3 bg-red-500 rounded-full animate-pulse transform -translate-x-1/2"></div>
          </div>
          <div className="w-12 h-24 bg-slate-900 relative">
            <div className="absolute inset-0 grid grid-rows-4 grid-cols-2 gap-1 p-1">
              {[...Array(8)].map((_, i) => (
                <div key={i + 110} className={`
                  ${shouldFlicker(i + 110) ? 'bg-green-300 animate-pulse' : 'bg-green-400 opacity-60'}
                  ${i % 4 === 0 ? 'bg-blue-400' : ''}
                `}></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Neon signs */}
        <div className="absolute left-20 bottom-40 text-xs text-pink-500 font-bold animate-glow">CYBER</div>
        <div className="absolute right-30 bottom-50 text-xs text-cyan-500 font-bold animate-glow">TOKYO</div>
        
        {/* Floating drones/holograms */}
        <div className="absolute left-1/4 top-1/3 w-3 h-1 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute right-1/3 top-2/5 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* Futuristic platform */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-gray-800 rounded-lg border border-pink-500 shadow-lg shadow-pink-500/20">
        {/* Platform lights */}
        <div className="absolute left-3 top-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse transform -translate-y-1/2"></div>
        <div className="absolute left-12 top-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse transform -translate-y-1/2"></div>
        <div className="absolute left-24 top-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse transform -translate-y-1/2"></div>
        <div className="absolute left-36 top-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse transform -translate-y-1/2"></div>
        <div className="absolute left-45 top-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse transform -translate-y-1/2"></div>
      </div>
      
      {/* Cyber character */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20">
        <div className="relative w-16 h-24">
          {/* Body */}
          <div className="absolute bottom-0 left-4 w-8 h-12 bg-black rounded-lg border border-cyan-500 shadow-md shadow-cyan-500/20"></div>
          
          {/* Head */}
          <div className="absolute bottom-12 left-3 w-10 h-10 bg-black rounded-lg border border-pink-500 overflow-hidden shadow-md shadow-pink-500/20">
            {/* Visor */}
            <div className="absolute top-3 left-0 w-full h-3 bg-cyan-500 animate-pulse"></div>
            
            {/* Energy shield depleting */}
            <div 
              className="absolute top-0 left-0 w-full bg-pink-500 opacity-30"
              style={{ 
                height: `${100 - dangerPercentage}%`, 
                transition: 'height 0.7s ease-in-out'
              }}
            ></div>
          </div>
          
          {/* Arms */}
          <div className="absolute bottom-8 left-1 w-3 h-6 bg-black rounded-full border border-cyan-500"></div>
          <div className="absolute bottom-8 right-1 w-3 h-6 bg-black rounded-full border border-cyan-500"></div>
          
          {/* Energy core */}
          <div 
            className={`absolute bottom-6 left-6 w-4 h-4 rounded-full transition-colors duration-700 ${
              dangerPercentage > 66 ? 'animate-pulse' : dangerPercentage > 33 ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''
            }`}
            style={{ 
              backgroundColor: dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'cyan',
              boxShadow: `0 0 10px ${dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'cyan'}`
            }}
          ></div>
        </div>
      </div>
      
      {/* Digital barrier */}
      <div 
        className="absolute top-0 inset-x-0 bg-gradient-to-b from-pink-500 to-transparent"
        style={{ height: `${dangerPercentage / 3}%` }}
      >
        {/* Grid lines in the barrier */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-3 gap-3 opacity-40">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="border border-white"></div>
          ))}
        </div>
      </div>
      
      {/* Holographic warnings */}
      {dangerPercentage > 50 && (
        <div className="absolute top-1/3 left-1/4 text-red-500 font-mono text-xs animate-ping opacity-50">
          WARNING
        </div>
      )}
      
      {dangerPercentage > 66 && (
        <div className="absolute top-1/4 right-1/4 text-red-500 font-mono text-xs animate-pulse">
          CRITICAL
        </div>
      )}
      
      {/* Digital rain effect - enhanced */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/5 text-cyan-500 font-mono text-xs animate-[fall_5s_linear_infinite]">
          10010111
        </div>
        <div className="absolute top-0 left-2/5 text-cyan-500 font-mono text-xs animate-[fall_7s_linear_infinite]" style={{ animationDelay: '0.5s' }}>
          01101001
        </div>
        <div className="absolute top-0 left-3/5 text-cyan-500 font-mono text-xs animate-[fall_4s_linear_infinite]" style={{ animationDelay: '1s' }}>
          11001010
        </div>
        <div className="absolute top-0 left-4/5 text-cyan-500 font-mono text-xs animate-[fall_6s_linear_infinite]" style={{ animationDelay: '1.5s' }}>
          00101101
        </div>
        <div className="absolute top-0 left-1/6 text-pink-500 font-mono text-xs animate-[fall_5.5s_linear_infinite]" style={{ animationDelay: '0.7s' }}>
          11110000
        </div>
        <div className="absolute top-0 left-5/6 text-pink-500 font-mono text-xs animate-[fall_6.5s_linear_infinite]" style={{ animationDelay: '1.2s' }}>
          00001111
        </div>
      </div>

      {/* Danger indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-pink-400 text-xs mb-1 font-mono">Energy Shield: {Math.round(100 - dangerPercentage)}%</div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-pink-500">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${100 - dangerPercentage}%`,
              backgroundColor: dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'cyan',
              boxShadow: `0 0 5px ${dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'cyan'}`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 