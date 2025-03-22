'use client';

import { useEffect, useState } from 'react';

interface LavaTempleAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function LavaTempleAnimation({ mistakes, maxMistakes }: LavaTempleAnimationProps) {
  const [showLavaWave, setShowLavaWave] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const [activeTrap, setActiveTrap] = useState<number | null>(null);
  const [templeRumble, setTempleRumble] = useState(false);
  const [stoneSlide, setStoneSlide] = useState(false);
  
  // Trigger lava wave on mistake
  useEffect(() => {
    if (mistakes > 0) {
      setShowLavaWave(true);
      setTempleRumble(true);
      
      const waveTimer = setTimeout(() => setShowLavaWave(false), 1500);
      const rumbleTimer = setTimeout(() => setTempleRumble(false), 800);
      
      return () => {
        clearTimeout(waveTimer);
        clearTimeout(rumbleTimer);
      };
    }
  }, [mistakes]);
  
  // Trigger sparks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparks(true);
      setTimeout(() => setShowSparks(false), 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Activate random trap based on mistakes
  useEffect(() => {
    if (mistakes > 0) {
      const randomTrap = Math.floor(Math.random() * 4);
      setActiveTrap(randomTrap);
      
      const trapTimer = setTimeout(() => setActiveTrap(null), 2000);
      
      return () => clearTimeout(trapTimer);
    }
  }, [mistakes]);
  
  // Stone sliding effect for puzzle elements
  useEffect(() => {
    const interval = setInterval(() => {
      setStoneSlide(true);
      setTimeout(() => setStoneSlide(false), 2500);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const mistakeRatio = mistakes / maxMistakes;
  const floorStability = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  
  return (
    <div className={`relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl ${templeRumble ? 'animate-shake' : ''}`}>
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-amber-950 via-red-900 to-red-950"
      ></div>
      
      {/* Lava pools */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-600 to-amber-700 overflow-hidden">
        {/* Lava bubbles */}
        <div className="absolute top-2 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-4 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3 left-3/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        
        {/* Lava wave animation */}
        {showLavaWave && (
          <div className="absolute inset-x-0 top-0 h-12 bg-orange-500 animate-rise"></div>
        )}
      </div>
      
      {/* Temple structures */}
      <div className="absolute left-4 bottom-16 w-32 h-60 bg-amber-800 opacity-80 rounded-t-lg"></div>
      <div className="absolute left-[calc(50%-32px)] bottom-16 w-64 h-80 bg-amber-900 opacity-90 rounded-t-lg"></div>
      <div className="absolute right-4 bottom-16 w-32 h-60 bg-amber-800 opacity-80 rounded-t-lg"></div>
      
      {/* Temple details */}
      <div className="absolute left-8 bottom-32 w-24 h-36 bg-amber-950 opacity-70"></div>
      <div className="absolute left-[calc(50%-24px)] bottom-48 w-48 h-32 bg-amber-950 opacity-70 rounded-t-lg"></div>
      <div className="absolute right-8 bottom-32 w-24 h-36 bg-amber-950 opacity-70"></div>
      
      {/* Temple face carving */}
      <div className="absolute left-[calc(50%-20px)] bottom-64 w-40 h-40">
        <div className="absolute top-4 left-4 w-32 h-24 bg-amber-800 rounded-lg"></div>
        <div className="absolute top-8 left-8 w-8 h-6 bg-black rounded-lg"></div>
        <div className="absolute top-8 right-8 w-8 h-6 bg-black rounded-lg"></div>
        <div className="absolute top-18 left-10 right-10 h-4 bg-black rounded-lg"></div>
      </div>
      
      {/* Ancient symbols */}
      <div className="absolute top-8 left-8 text-amber-600 text-2xl font-bold">
        𓀠 𓁐 𓃒 𓅓
      </div>
      <div className="absolute top-8 right-8 text-amber-600 text-2xl font-bold">
        𓆣 𓇯 𓊖 𓉐
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-amber-600 text-3xl font-bold">
        TEMPLE OF FIRE
      </div>
      
      {/* Central altar with ancient artifact */}
      <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 w-32 h-12 bg-amber-700 rounded-lg"></div>
      <div className="absolute left-1/2 bottom-32 transform -translate-x-1/2 w-8 h-12 bg-amber-950 rounded"></div>
      <div className="absolute left-1/2 bottom-44 transform -translate-x-1/2 w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-orange-600 animate-pulse"></div>
        <div className="absolute inset-3 rounded-full bg-red-700"></div>
        <div className="absolute inset-5 rounded-full bg-yellow-500 animate-ping"></div>
      </div>
      
      {/* Temple pillars */}
      <div className="absolute left-1/4 bottom-16 w-12 h-48 bg-amber-800 rounded-t-lg"></div>
      <div className="absolute right-1/4 bottom-16 w-12 h-48 bg-amber-800 rounded-t-lg"></div>
      
      {/* Traps based on mistakes */}
      {activeTrap === 0 && (
        <div className="absolute bottom-16 left-10 right-10 h-2 bg-red-500 animate-pulse"></div>
      )}
      {activeTrap === 1 && (
        <div className="absolute left-1/4 top-1/3 w-2 h-24 bg-red-500 animate-ping"></div>
      )}
      {activeTrap === 2 && (
        <div className="absolute right-1/4 top-1/3 w-2 h-24 bg-red-500 animate-ping"></div>
      )}
      {activeTrap === 3 && (
        <div className="absolute bottom-32 left-1/3 right-1/3 h-2 bg-red-500 animate-pulse"></div>
      )}
      
      {/* Floor tiles with ancient puzzle */}
      <div className="absolute bottom-16 left-1/4 right-1/4 h-4 grid grid-cols-5 gap-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`bg-amber-700 ${stoneSlide && i === 2 ? 'animate-slide-right' : ''}`}
          ></div>
        ))}
      </div>
      
      {/* Status display carved in stone */}
      <div className="absolute top-24 left-8 w-64 h-36 bg-amber-800 bg-opacity-70 rounded-lg p-3 border border-amber-600">
        <div className="text-amber-100 text-sm font-bold mb-2">ANCIENT TEMPLE STATUS</div>
        
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-amber-200 text-xs mb-1">FLOOR STABILITY</div>
            <div className="h-2 bg-amber-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300" 
                style={{ width: `${floorStability}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-amber-300 mt-1">
              <span>{floorStability}%</span>
              <span className={mistakeRatio > 0.5 ? 'text-red-500 animate-pulse' : ''}>
                {mistakeRatio > 0.7 ? 'CRITICAL' : mistakeRatio > 0.3 ? 'UNSTABLE' : 'STABLE'}
              </span>
            </div>
          </div>
          
          <div>
            <div className="text-amber-200 text-xs mb-1">LAVA LEVEL</div>
            <div className="h-2 bg-amber-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-300" 
                style={{ width: `${Math.min(100, mistakeRatio * 100 + 20)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="text-amber-200 text-xs mb-1">ESCAPE ROUTE</div>
            <div className="h-2 bg-amber-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-amber-500 transition-all duration-300" 
                style={{ width: `${100 - Math.min(100, mistakeRatio * 100 + 10)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ancient riddle or warning text */}
      <div className="absolute top-24 right-8 w-48 h-28 bg-amber-800 bg-opacity-50 rounded-lg p-2 border border-amber-600">
        <div className="text-amber-100 text-xs">
          <div className="mb-1">ANCIENT WARNING:</div>
          <div className="text-[10px] italic opacity-80">
            "Those who fail the test of knowledge shall meet the wrath of fire. Choose wisely, for each mistake weakens the temple's foundation."
          </div>
        </div>
      </div>
      
      {/* Floating fire particles and embers */}
      <div className="absolute inset-0 pointer-events-none ember-particles"></div>
      
      {/* Fire sparks */}
      {showSparks && (
        <div className="absolute left-1/2 bottom-40 transform -translate-x-1/2 w-24 h-24">
          <div className="absolute inset-0 bg-yellow-500 rounded-full animate-spark opacity-30"></div>
          <div className="absolute inset-4 bg-orange-500 rounded-full animate-spark opacity-50" style={{ animationDelay: '0.1s' }}></div>
        </div>
      )}
      
      {/* Warning indicator for dangerous mistake level */}
      {mistakeRatio > 0.6 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-red-500 text-sm font-bold animate-pulse">
          DANGER: TEMPLE COLLAPSING
        </div>
      )}
      
      {/* CSS for animation effects */}
      <style jsx>{`
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        
        .animate-rise {
          animation: rise 1.5s ease-in-out;
        }
        
        @keyframes rise {
          0% { transform: translateY(100%); }
          40% { transform: translateY(-20%); }
          60% { transform: translateY(-10%); }
          80% { transform: translateY(-5%); }
          100% { transform: translateY(-15%); }
        }
        
        .animate-spark {
          animation: spark 0.5s ease-out forwards;
        }
        
        @keyframes spark {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-slide-right {
          animation: slideRight 2.5s ease-in-out;
        }
        
        @keyframes slideRight {
          0% { transform: translateX(0); }
          40% { transform: translateX(120%); }
          60% { transform: translateX(120%); }
          100% { transform: translateX(0); }
        }
        
        .ember-particles {
          background-image: 
            radial-gradient(circle, rgba(255, 180, 0, 0.5) 1px, transparent 1px),
            radial-gradient(circle, rgba(255, 120, 0, 0.3) 1px, transparent 1px);
          background-size: 20px 20px, 35px 35px;
          animation: float-up 15s linear infinite;
        }
        
        @keyframes float-up {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 0 -150px, 0 -150px;
          }
        }
      `}</style>
    </div>
  );
} 