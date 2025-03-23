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
  const [hackProgress, setHackProgress] = useState(0);
  const [terminalMessages, setTerminalMessages] = useState<string[]>([]);
  
  // Calculate progress values
  const mistakeRatio = mistakes / maxMistakes;
  const securityDefense = Math.max(0, 100 - (mistakeRatio * 100)).toFixed(0);
  const systemStability = Math.max(0, 100 - (mistakeRatio * 120)).toFixed(0);
  
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
  
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem] mb-4 overflow-hidden rounded-xl">
      {/* Fixed background color fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950"></div>
      
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/hangman/images/tokyo-nights/tokyo-nights-bg.mp4" type="video/mp4" />
        </video>
      </div>
      
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
    </div>
  );
} 