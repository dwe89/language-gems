'use client';

import React, { useEffect, useState } from 'react';

interface TokyoNightsAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function TokyoNightsAnimation({
  mistakes,
  maxMistakes,
}: TokyoNightsAnimationProps) {
  const [neonFlicker, setNeonFlicker] = useState<Array<boolean>>([false, false, false, false]);
  const [rainIntensity, setRainIntensity] = useState(1);
  const [showLightning, setShowLightning] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [terminalMessages, setTerminalMessages] = useState<string[]>([]);
  const [windowsFlickering, setWindowsFlickering] = useState<Array<boolean>>([false, false]);
  
  // Calculate progress values
  const mistakeRatio = mistakes / maxMistakes;
  const securityDefense = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  const systemStability = Math.max(0, 100 - (mistakeRatio * 120)).toFixed(0);
  
  // Random neon sign flickering
  useEffect(() => {
    const intervalIds = neonFlicker.map((_, index) => {
      return setInterval(() => {
        setNeonFlicker(prev => {
          const newState = [...prev];
          newState[index] = !newState[index];
          return newState;
        });
      }, 500 + Math.random() * 2000);
    });
    
    return () => {
      intervalIds.forEach(id => clearInterval(id));
    };
  }, []);
  
  // Increase rain intensity with mistakes
  useEffect(() => {
    setRainIntensity(1 + mistakeRatio * 2);
  }, [mistakeRatio]);
  
  // Lightning effect on mistake
  useEffect(() => {
    if (mistakes > 0) {
      setShowLightning(true);
      setTimeout(() => setShowLightning(false), 200);
    }
  }, [mistakes]);
  
  // Update hack progress based on mistakes
  useEffect(() => {
    setHackProgress(Math.min(100, mistakeRatio * 100));
    
    // Add terminal messages
    if (mistakes > 0) {
      setTerminalMessages(prev => {
        const messages = [
          "SECURITY BREACH DETECTED",
          "FIREWALL COMPROMISED",
          "SCANNING FOR INTRUDERS",
          "ENCRYPTION FAILURE",
          "SYSTEM ERROR #7734",
          "ACCESS DENIED... RETRYING",
          "BACKUP SYSTEMS FAILING",
          "INITIATING COUNTERMEASURES",
          "DATA CORRUPTION DETECTED",
          "EMERGENCY LOCKDOWN ENGAGED"
        ];
        
        const newMessage = messages[Math.min(messages.length - 1, mistakes - 1)];
        return [...prev.slice(-6), newMessage];
      });
    }
  }, [mistakes, mistakeRatio]);
  
  // Random window flickering in buildings
  useEffect(() => {
    const windowIntervals = windowsFlickering.map((_, index) => {
      return setInterval(() => {
        setWindowsFlickering(prev => {
          const newState = [...prev];
          newState[index] = !newState[index];
          return newState;
        });
      }, 300 + Math.random() * 1000);
    });
    
    return () => {
      windowIntervals.forEach(id => clearInterval(id));
    };
  }, []);
  
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl">
      {/* Night sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950">
        {/* Stars */}
        <div className="stars absolute inset-0 opacity-80"></div>
        
        {/* Distant moon */}
        <div className="absolute top-8 right-16 w-16 h-16 rounded-full bg-slate-200 opacity-70 blur-[1px]">
          <div className="absolute top-2 left-3 w-10 h-5 rounded-full bg-slate-400 opacity-30"></div>
        </div>
        
        {/* Lightning effect */}
        {showLightning && (
          <div className="absolute inset-0 bg-cyan-50 opacity-20 z-10"></div>
        )}
            </div>
      
      {/* City skyline with buildings */}
      <div className="absolute inset-x-0 bottom-0 h-3/4">
        {/* Distant mountains */}
        <div className="absolute left-0 right-0 bottom-1/2 h-1/4">
          <div className="absolute left-0 w-full h-full bg-slate-900 opacity-80" 
               style={{ clipPath: 'polygon(0% 100%, 15% 70%, 30% 85%, 45% 60%, 60% 80%, 75% 65%, 90% 75%, 100% 70%, 100% 100%)' }}>
          </div>
        </div>
        
        {/* Skyscrapers */}
        <div className="absolute left-5 bottom-0 w-20 h-56 bg-slate-900">
          {/* Windows */}
          <div className="grid grid-cols-4 gap-1 p-2 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-yellow-300 opacity-${windowsFlickering[0] && i % 7 === 0 ? '10' : Math.random() > 0.3 ? '60' : '10'}`}
                style={{ height: '6px' }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="absolute left-28 bottom-0 w-16 h-72 bg-slate-800">
          {/* Windows */}
          <div className="grid grid-cols-3 gap-1 p-1 h-full">
            {Array.from({ length: 45 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-cyan-300 opacity-${windowsFlickering[1] && i % 5 === 0 ? '10' : Math.random() > 0.4 ? '50' : '10'}`}
                style={{ height: '5px' }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="absolute left-48 bottom-0 w-24 h-64 bg-slate-950">
          {/* Windows */}
          <div className="grid grid-cols-5 gap-1 p-1 h-full">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-yellow-100 opacity-${Math.random() > 0.3 ? '40' : '10'}`}
                style={{ height: '4px' }}
              ></div>
            ))}
          </div>
          {/* Antenna */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-slate-600">
            <div className="absolute top-0 w-4 h-1 bg-red-500 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
          </div>
        </div>
        
        <div className="absolute right-10 bottom-0 w-28 h-80 bg-slate-900">
          {/* Windows */}
          <div className="grid grid-cols-6 gap-1 p-1 h-full">
            {Array.from({ length: 70 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-yellow-200 opacity-${Math.random() > 0.3 ? '50' : '10'}`}
                style={{ height: '4px' }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="absolute right-40 bottom-0 w-20 h-60 bg-slate-800">
          {/* Windows */}
          <div className="grid grid-cols-4 gap-1 p-1 h-full">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-blue-100 opacity-${Math.random() > 0.4 ? '40' : '10'}`}
                style={{ height: '5px' }}
              ></div>
            ))}
      </div>
        </div>
        
        <div className="absolute right-64 bottom-0 w-14 h-48 bg-slate-700">
          {/* Windows */}
          <div className="grid grid-cols-3 gap-1 p-1 h-full">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-yellow-100 opacity-${Math.random() > 0.5 ? '30' : '10'}`}
                style={{ height: '5px' }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Flying car with lights */}
      <div 
        className="absolute"
        style={{ 
          top: '40%',
          left: `${50 + (mistakeRatio > 0.5 ? (Math.random() * 4 - 2) : 0)}%`,
          transform: `translateX(-50%) rotate(${mistakeRatio > 0.7 ? (Math.random() * 10 - 5) : 0}deg)`
        }}
      >
        <div className="relative w-24 h-8">
          <div className="absolute inset-0 bg-slate-800 rounded-full"></div>
          <div className="absolute bottom-2 left-0 w-4 h-2 bg-red-500 rounded-l-full opacity-80 animate-pulse"></div>
          <div className="absolute bottom-2 right-0 w-4 h-2 bg-blue-400 rounded-r-full opacity-80 animate-pulse"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-slate-700 rounded-t-lg"></div>
          
          {/* Hover effect lights */}
          <div className="absolute -bottom-2 left-4 w-16 h-1 bg-cyan-400 opacity-60 blur-[2px]"></div>
        </div>
      </div>
      
      {/* Neon signs */}
      <div className={`absolute top-20 left-1/4 text-2xl font-bold text-pink-500 ${neonFlicker[0] ? 'opacity-50' : 'opacity-90'}`}
           style={{ textShadow: '0 0 5px #ec4899, 0 0 10px #ec4899' }}>
        CYBER
      </div>
      
      <div className={`absolute top-30 right-1/4 text-xl font-bold text-cyan-400 ${neonFlicker[1] ? 'opacity-50' : 'opacity-90'}`}
           style={{ textShadow: '0 0 5px #22d3ee, 0 0 10px #22d3ee' }}>
        NEXUS
      </div>
      
      <div className={`absolute top-40 left-1/3 text-2xl font-bold text-purple-500 ${neonFlicker[2] ? 'opacity-40' : 'opacity-80'}`}
           style={{ textShadow: '0 0 5px #a855f7, 0 0 10px #a855f7' }}>
        ニオン
      </div>
      
      <div className={`absolute top-32 right-1/3 text-3xl font-bold text-blue-500 ${neonFlicker[3] ? 'opacity-50' : 'opacity-90'}`}
           style={{ textShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6' }}>
        東京
      </div>
      
      {/* Additional neon with game status */}
      <div className={`absolute bottom-20 right-10 text-xl font-bold text-red-500 ${mistakes > maxMistakes * 0.7 ? 'animate-pulse' : ''}`}
           style={{ textShadow: '0 0 5px #ef4444, 0 0 10px #ef4444' }}>
        {parseInt(systemStability) < 30 ? 'DANGER' : 'セキュリティ'}
      </div>
      
      {/* Larger modern street with hover cars */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-900 flex items-center justify-center">
        <div className="w-4/5 h-1 bg-yellow-400 opacity-50"></div>
        {/* Street light */}
        <div className="absolute bottom-0 left-12 w-1 h-24 bg-slate-700">
          <div className="absolute -top-1 w-8 h-1 bg-slate-700"></div>
          <div className="absolute -top-3 right-0 w-2 h-2 rounded-full bg-amber-300" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)' }}></div>
        </div>
        <div className="absolute bottom-0 right-12 w-1 h-24 bg-slate-700">
          <div className="absolute -top-1 w-8 h-1 bg-slate-700"></div>
          <div className="absolute -top-3 left-0 w-2 h-2 rounded-full bg-amber-300" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)' }}></div>
        </div>
      </div>
      
      {/* Cyberpunk rain effect */}
      <div className="rain absolute inset-0 z-10" style={{ opacity: 0.4 * rainIntensity }}></div>
      
      {/* Terminal information overlay */}
      <div className="absolute top-6 left-6 w-72 h-56 bg-black bg-opacity-70 rounded-lg p-3 border border-cyan-500 font-mono text-xs">
        <div className="text-cyan-400 mb-2">{"> SYSTEM STATUS"}</div>
        
        <div className="flex flex-col gap-2 mb-3">
          <div>
            <div className="text-green-400 mb-1">SECURITY DEFENSE</div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-cyan-400 transition-all duration-300" 
                style={{ width: `${securityDefense}%` }}
            ></div>
            </div>
            <div className="flex justify-between text-slate-300 mt-1">
              <span>{securityDefense}%</span>
              <span className={mistakeRatio > 0.7 ? 'text-red-400 animate-pulse' : ''}>
                {mistakeRatio > 0.7 ? 'CRITICAL' : mistakeRatio > 0.4 ? 'ALERT' : 'STABLE'}
              </span>
            </div>
          </div>
          
          <div>
            <div className="text-blue-400 mb-1">SYSTEM STABILITY</div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300" 
                style={{ width: `${systemStability}%` }}
              ></div>
          </div>
          </div>
          
          <div>
            <div className="text-red-400 mb-1">HACK PROGRESS</div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-400 transition-all duration-300" 
                style={{ width: `${hackProgress}%` }}
          ></div>
            </div>
          </div>
        </div>
        
        <div className="text-yellow-400 mb-1">{"> TERMINAL"}</div>
        <div className="text-slate-300 h-20 overflow-hidden">
          {terminalMessages.map((msg, i) => (
            <div key={i} className="text-[9px] opacity-90 mb-1">
              [{new Date().toLocaleTimeString()}] {msg}
            </div>
          ))}
          {!terminalMessages.length && (
            <div className="text-[9px] opacity-90 mb-1">
              SYSTEM RUNNING...
            </div>
          )}
          <div className="text-green-400 inline-block">$</div>
          <div className="inline-block ml-1 animate-pulse">_</div>
        </div>
      </div>
      
      {/* Warning message */}
      <div className="absolute top-6 right-6 w-56 h-28 bg-black bg-opacity-70 rounded-lg p-2 border border-pink-500 font-mono text-xs">
        <div className="text-pink-400 mb-1">{"> WARNING"}</div>
        <div className="text-slate-300 text-[10px] opacity-90">
          Unauthorized access detected. Facial recognition scan failed. Neural firewall compromised. Continue password attempts at your own risk.
        </div>
        
        {mistakeRatio > 0.5 && (
          <div className="mt-2 text-red-400 text-[10px] font-bold animate-pulse">
            SECURITY COUNTERMEASURES ACTIVE
          </div>
        )}
      </div>
      
      {/* Alert messages */}
      {mistakeRatio > 0.8 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-lg animate-pulse font-mono">
          SYSTEM OVERRIDE IMMINENT
        </div>
      )}
      
      {/* CSS for cyberpunk effects */}
      <style jsx>{`
        .stars {
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                           radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                           radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
                           radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
        }
        
        .rain {
          position: absolute;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          background: linear-gradient(to bottom, transparent 0%, rgba(22, 41, 79, 0.6) 100%);
          background-size: ${0.5 * rainIntensity}px 1000px;
          animation: rain ${2 / rainIntensity}s linear infinite;
          background-image: 
            linear-gradient(to bottom, rgba(0, 230, 255, 0.2) 0%, rgba(0, 230, 255, 0) 100%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
          background-size: 10px 100%, 20px 200px;
        }
        
        @keyframes rain {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: ${50 * rainIntensity}px 1000px;
          }
        }
      `}</style>
    </div>
  );
} 