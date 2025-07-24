'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showGlitch, setShowGlitch] = useState(false);
  const [showRedAlert, setShowRedAlert] = useState(false);
  const [showSecurityGrid, setShowSecurityGrid] = useState(false);
  
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
          "EMERGENCY LOCKDOWN ENGAGED"
        ];
        
        const newMessage = messages[Math.min(messages.length - 1, mistakes - 1)];
        return [...prev.slice(-6), newMessage];
      });
      
      // Trigger glitch effect when a new mistake is made
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 1000);
    }
    
    // Set visual effects based on mistake level
    setShowRedAlert(mistakes >= 4);
    setShowSecurityGrid(mistakes >= 2);
    
  }, [mistakes, mistakeRatio]);
  
  // Determine security state based on mistakes
  const securityState = {
    gridOverlay: mistakes >= 2,
    scanlines: true,
    warningFlash: mistakes >= 3,
    criticalAlert: mistakes >= 5,
    faceDetection: mistakes >= 1,
    matrixRain: mistakes >= 4
  };
  
  return (
    <div className="relative w-full h-96 md:h-[28rem] lg:h-[36rem] mb-4 overflow-hidden rounded-xl">
      {/* Fixed background color fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950"></div>
      
{/* Video background */}
<div className="absolute inset-0 overflow-hidden">
  <video
    className="absolute inset-0 w-full h-full object-cover scale-110 md:scale-100 translate-y-16 md:translate-y-8"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="/games/hangman/images/tokyo-nights/tokyo-nights-bg.mp4" type="video/mp4" />
  </video>
</div>

      
      {/* Glitch effect overlay when a mistake is made */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div 
            className="absolute inset-0 bg-cyan-500/20 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      {/* Security grid overlay */}
      {securityState.gridOverlay && (
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24px,rgba(0,255,255,0.1)_25px),linear-gradient(90deg,transparent_24px,rgba(0,255,255,0.1)_25px)] bg-[size:25px_25px]"></div>
      )}
      
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(0,0,0,0.3)_50%,transparent_51%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>
      
      {/* Warning flash for critical levels */}
      {securityState.warningFlash && (
        <motion.div 
          className="absolute inset-0 bg-red-500/10 mix-blend-overlay pointer-events-none"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Critical alert overlay */}
      {securityState.criticalAlert && (
        <motion.div 
          className="absolute inset-0 border-8 border-red-500/50 pointer-events-none"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      
      {/* Face detection grid - appears after first mistake */}
      {securityState.faceDetection && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-32">
          <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-md"></div>
          <div className="absolute inset-4 border border-cyan-400/40 rounded-sm"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              boxShadow: [
                '0 0 0 1px rgba(6, 182, 212, 0.2)', 
                '0 0 0 2px rgba(6, 182, 212, 0.4)', 
                '0 0 0 1px rgba(6, 182, 212, 0.2)'
              ] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          
          <motion.div
            className="absolute top-1 right-1 w-1 h-1 bg-cyan-400"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          ></motion.div>
          
          <motion.div 
            className="absolute bottom-2 left-0 right-0 h-4 bg-pink-500/10 flex justify-center items-center"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="text-[8px] text-pink-500 tracking-wider">FACIAL SCAN FAILED</div>
          </motion.div>
        </div>
      )}
      
      {/* Matrix-style code rain - appears at high mistake levels */}
      {securityState.matrixRain && (
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-cyan-400 text-sm font-mono"
              initial={{ 
                top: "-20%", 
                left: `${Math.random() * 100}%`,
                opacity: 0.7
              }}
              animate={{ 
                top: "120%",
                opacity: [0.7, 0.3, 0.7]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              {Array.from({ length: Math.floor(Math.random() * 10) + 3 }).map((_, j) => (
                <div key={j} className="text-center leading-tight">
                  {String.fromCharCode(Math.floor(Math.random() * 10) + 48)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Terminal information overlay */}
      <div className="hidden sm:block absolute bottom-4 md:bottom-32 left-2 md:left-6 w-64 md:w-72 h-48 md:h-56 bg-black bg-opacity-70 rounded-lg p-2 md:p-3 border border-cyan-500 font-mono text-xs">
        <div className="text-cyan-400 mb-2 text-[10px] md:text-xs">{"> SYSTEM STATUS"}</div>

        <div className="flex flex-col gap-1 md:gap-2 mb-2 md:mb-3">
          <div>
            <div className="text-green-400 mb-1 text-[8px] md:text-[10px]">SECURITY DEFENSE</div>
            <div className="h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${securityDefense}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-slate-300 mt-1 text-[7px] md:text-[8px]">
              <span>{securityDefense}%</span>
              <span className={mistakeRatio > 0.7 ? 'text-red-400 animate-pulse' : ''}>
                {mistakeRatio > 0.7 ? 'CRITICAL' : mistakeRatio > 0.4 ? 'ALERT' : 'STABLE'}
              </span>
            </div>
          </div>

          <div>
            <div className="text-blue-400 mb-1 text-[8px] md:text-[10px]">SYSTEM STABILITY</div>
            <div className="h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300"
                style={{ width: `${systemStability}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="text-red-400 mb-1 text-[8px] md:text-[10px]">HACK PROGRESS</div>
            <div className="h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${mistakeRatio > 0.7 ? 'animate-pulse' : ''}`}
                style={{
                  width: `${hackProgress}%`,
                  background: mistakeRatio > 0.7
                    ? 'linear-gradient(to right, #ef4444, #f97316)'
                    : 'linear-gradient(to right, #dc2626, #ea580c)'
                }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="text-yellow-400 mb-1 text-[10px] md:text-xs">{"> TERMINAL"}</div>
        <div className="text-slate-300 h-16 md:h-20 overflow-hidden bg-black/50 p-1 rounded">
          {terminalMessages.map((msg, i) => (
            <div key={i} className="text-[8px] md:text-[9px] opacity-90 mb-1">
              [{new Date().toLocaleTimeString()}] <span className={i === terminalMessages.length - 1 ? 'text-red-400' : 'text-green-400'}>{msg}</span>
            </div>
          ))}
          {!terminalMessages.length && (
            <div className="text-[8px] md:text-[9px] opacity-90 mb-1">
              SYSTEM RUNNING...
            </div>
          )}
          <div className="text-green-400 inline-block text-[8px] md:text-[9px]">$</div>
          <div className="inline-block ml-1 animate-pulse text-[8px] md:text-[9px]">_</div>
        </div>
      </div>
      
      {/* Warning message */}
      <div className="hidden sm:block absolute bottom-4 md:bottom-32 right-2 md:right-6 w-48 md:w-56 h-24 md:h-28 bg-black bg-opacity-70 rounded-lg p-2 border border-pink-500 font-mono text-xs">
        <div className="text-pink-400 mb-1 text-[9px] md:text-xs">{"> WARNING"}</div>
        <div className="text-slate-300 text-[8px] md:text-[10px] opacity-90">
          Unauthorized access detected. Facial recognition scan failed. Neural firewall compromised. Continue password attempts at your own risk.
        </div>

        {mistakeRatio > 0.5 && (
          <div className="mt-2 text-red-400 text-[8px] md:text-[10px] font-bold animate-pulse">
            SECURITY COUNTERMEASURES ACTIVE
          </div>
        )}
      </div>
      
      {/* Countdown to lockdown - appears at high mistake levels */}
      {mistakeRatio > 0.7 && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/70 border border-red-500 rounded px-3 py-1 font-mono text-xs z-50">
          <motion.div
            className="text-red-500 font-bold"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            LOCKDOWN IMMINENT: {Math.max(0, maxMistakes - mistakes)} ATTEMPTS REMAINING
          </motion.div>
        </div>
      )}
      
      {/* Alert messages */}
      {mistakeRatio > 0.8 && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-6xl font-mono z-50"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          SYSTEM OVERRIDE IMMINENT
        </motion.div>
      )}
    </div>
  );
} 