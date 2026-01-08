'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LavaTempleAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function LavaTempleAnimation({ mistakes, maxMistakes }: LavaTempleAnimationProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  
  const mistakeRatio = mistakes / maxMistakes;
  const mysteryProgress = Math.min(100, mistakes * (100 / maxMistakes)).toFixed(0);
  
  // Determine guardian state based on mistakes
  const guardianState = {
    eyeGlow: mistakes >= 1 ? Math.min(0.3 + mistakes * 0.15, 1) : 0.1,
    mouthOpen: mistakes >= 4,
    energyBuild: mistakes >= 4,
    leftPillarDamage: mistakes >= 2,
    rightPillarDamage: mistakes >= 3,
    screenShake: mistakes >= 2,
    criticalState: mistakes >= maxMistakes - 1,
    dangerZone: mistakes >= Math.floor(maxMistakes * 0.7)
  };

  // Trigger shake effect when mistakes increase
  useEffect(() => {
    if (mistakes > 0 && guardianState.screenShake) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [mistakes, guardianState.screenShake]);

  // Trigger lightning effect in critical state
  useEffect(() => {
    if (guardianState.criticalState) {
      const interval = setInterval(() => {
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 200);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [guardianState.criticalState]);
  
  return (
    <div 
      className="relative w-full h-96 md:h-[28rem] lg:h-[36rem] mb-4 overflow-hidden rounded-xl"
    >
      {/* Fixed background color fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-orange-900 to-amber-900"></div>
      
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/hangman/images/lava-temple/lava-temple-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Lightning flash overlay */}
      <AnimatePresence>
        {showLightning && (
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      {/* Guardian eye glow overlay - enhanced */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(circle at 50% 38%, rgba(255, ${guardianState.criticalState ? '0' : '165'}, 0, ${guardianState.eyeGlow}) 0%, transparent 30%)`,
        }}
        animate={{
          opacity: guardianState.dangerZone ? [guardianState.eyeGlow, guardianState.eyeGlow * 1.5, guardianState.eyeGlow] : guardianState.eyeGlow
        }}
        transition={{
          duration: guardianState.dangerZone ? 1 : 0.5,
          repeat: guardianState.dangerZone ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {/* Guardian mouth energy build-up - enhanced */}
      <AnimatePresence>
        {guardianState.energyBuild && (
          <motion.div 
            className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <motion.div 
              className={`w-32 h-8 ${guardianState.criticalState ? 'bg-red-500' : 'bg-orange-500'} rounded-full blur-md`}
              animate={{ 
                opacity: [0.4, 1, 0.4], 
                scale: [1, 1.3, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: guardianState.criticalState ? 0.8 : 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            {/* Energy particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${guardianState.criticalState ? 'bg-red-400' : 'bg-orange-400'} rounded-full`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1 + i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Left pillar damage effect - enhanced */}
      <AnimatePresence>
        {guardianState.leftPillarDamage && (
          <motion.div 
            className="absolute left-[15%] top-1/2 w-12 h-60 -translate-y-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-red-500/30 to-orange-600/20 rounded-lg"
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            {/* Crack effects */}
            <div className="absolute top-1/4 left-1/2 w-1 h-8 bg-red-500/60 -translate-x-1/2 transform rotate-12"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-6 bg-orange-500/60 transform -rotate-12"></div>
            <div className="absolute top-3/4 left-3/4 w-1 h-4 bg-red-400/60 transform rotate-45"></div>
            
            {/* Falling debris particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-300 rounded-full"
                style={{
                  left: `${25 + i * 20}%`,
                  top: `${20 + i * 15}%`
                }}
                animate={{
                  y: [0, 100, 0],
                  opacity: [1, 0.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Right pillar damage effect - enhanced */}
      <AnimatePresence>
        {guardianState.rightPillarDamage && (
          <motion.div 
            className="absolute right-[15%] top-1/2 w-12 h-60 -translate-y-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-red-500/30 to-orange-600/20 rounded-lg"
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 1.8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            {/* Crack effects */}
            <div className="absolute top-1/3 left-1/2 w-1 h-10 bg-red-500/60 -translate-x-1/2 transform -rotate-12"></div>
            <div className="absolute top-1/2 left-3/4 w-1 h-8 bg-orange-500/60 transform rotate-12"></div>
            <div className="absolute top-2/3 left-1/4 w-1 h-6 bg-red-400/60 transform -rotate-45"></div>
            
            {/* Falling debris particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-300 rounded-full"
                style={{
                  left: `${25 + i * 20}%`,
                  top: `${25 + i * 15}%`
                }}
                animate={{
                  y: [0, 120, 0],
                  opacity: [1, 0.3, 1],
                  rotate: [0, -180, -360]
                }}
                transition={{
                  duration: 3.5 + i * 0.4,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mystery progress display - left side */}
      <div className="absolute bottom-32 left-8 w-56 h-36 bg-amber-800 bg-opacity-70 rounded-lg p-3 border border-amber-600">
        <div className="text-amber-100 text-sm font-bold mb-2">ANCIENT RIDDLE</div>
        
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-amber-200 text-xs mb-1">GUARDIAN AWAKENING</div>
            <div className="h-2 bg-amber-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-red-500 transition-all duration-300" 
                style={{ width: `${mysteryProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-amber-300 mt-1">
              <span>{mysteryProgress}%</span>
              <span className={mistakeRatio > 0.5 ? 'text-red-500' : ''}>
                {mistakeRatio > 0.7 ? 'CRITICAL' : mistakeRatio > 0.3 ? 'URGENT' : 'DORMANT'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Warning stones on the right side */}
      <div className="absolute bottom-32 right-8 w-52 h-28 bg-amber-800 bg-opacity-70 rounded-lg p-2 border border-amber-600">
        <div className="text-amber-100 text-sm mb-1">TEMPLE INSCRIPTION</div>
        <div className="text-amber-200 text-xs opacity-90">
          The stone guardian grows restless with each mistake. Decipher the word before it fully awakens or face its wrath.
        </div>
      </div>
      

      
      {/* Alert messages */}
      {mistakeRatio > 0.8 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-lg animate-pulse">
          GUARDIAN AWAKENING - DANGER IMMINENT!
        </div>
      )}
    </div>
  );
} 