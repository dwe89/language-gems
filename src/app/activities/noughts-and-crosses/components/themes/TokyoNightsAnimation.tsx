'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TokyoNightsAnimationProps {
  board: Array<'X' | 'O' | null>;
  gameState: 'playing' | 'won' | 'lost' | 'tie';
  storyDismissed: boolean;
  onStoryDismiss: () => void;
}

export default function TokyoNightsAnimation({ board, gameState, storyDismissed, onStoryDismiss }: TokyoNightsAnimationProps) {
  const [neonSigns, setNeonSigns] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const filledCells = board.filter(cell => cell !== null).length;
  const progressRatio = filledCells / 9;
  
  useEffect(() => {
    // Create neon sign effects
    const neonArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + (Math.random() * 80),
      y: 10 + (Math.random() * 80),
      color: ['#ff0080', '#00ff80', '#0080ff', '#ff8000', '#8000ff'][Math.floor(Math.random() * 5)]
    }));
    setNeonSigns(neonArray);
  }, []);

  // Determine city state based on game progress
  const cityState = {
    neonIntensity: 0.3 + (progressRatio * 0.7),
    trafficFlow: filledCells >= 3,
    buildingLights: filledCells >= 5,
    rainEffect: filledCells >= 6,
    victoryLights: gameState === 'won',
    cityPowerOut: gameState === 'lost'
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-screen video background */}
      <div className="absolute inset-0">
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/noughts-and-crosses/images/tokyo-nights/tokyo-nights-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Story Introduction - Show when game starts and not dismissed */}
      {filledCells === 0 && gameState === 'playing' && !storyDismissed && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          <motion.div
            className="text-center bg-black/80 backdrop-blur-md rounded-2xl px-8 py-6 border border-pink-400/50 shadow-2xl max-w-2xl relative"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="text-4xl mb-4">🏙️</div>
            <h2 className="text-2xl font-bold text-pink-300 mb-3">Neon City Data Heist</h2>
            <p className="text-white/90 leading-relaxed">
              Welcome to Neo-Tokyo 2087. You're a cyberpunk hacker infiltrating the city's 
              central data core. Each vocabulary challenge cracks another encryption layer. 
              Success grants you access to the ultimate prize, but failure triggers the 
              security system's digital wrath!
            </p>
            <div className="mt-4 text-sm text-pink-400">
              💾 System Access: Active • Encryption Progress: {Math.round(progressRatio * 100)}%
            </div>
            <motion.button
              onClick={onStoryDismiss}
              className="mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Begin Infiltration 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Neon Light Effects */}
      <AnimatePresence>
        {neonSigns.map((sign, index) => (
          <motion.div
            key={sign.id}
            className="absolute w-4 h-4 rounded-full blur-sm"
            style={{
              left: `${sign.x}%`,
              top: `${sign.y}%`,
              backgroundColor: sign.color,
              boxShadow: `0 0 20px ${sign.color}, 0 0 40px ${sign.color}`
            }}
            animate={{
              opacity: [cityState.neonIntensity, cityState.neonIntensity + 0.3, cityState.neonIntensity],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + index * 0.3,
              repeat: Infinity,
              delay: index * 0.5
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* City skyline silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-gray-900 to-transparent opacity-60">
        {/* Building silhouettes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-black opacity-80"
            style={{
              left: `${i * 8 + 2}%`,
              width: `${6 + Math.random() * 4}%`,
              height: `${30 + Math.random() * 60}%`
            }}
          >
            {/* Building lights */}
            {cityState.buildingLights && (
              <>
                {[...Array(Math.floor(Math.random() * 6) + 2)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute w-1 h-1 bg-yellow-300"
                    style={{
                      left: `${20 + j * 15}%`,
                      top: `${10 + j * 20}%`
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.3, 1]
                    }}
                    transition={{
                      duration: 3 + j,
                      repeat: Infinity,
                      delay: i * 0.2 + j * 0.5
                    }}
                  />
                ))}
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Traffic flow (moving lights) */}
      {cityState.trafficFlow && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-16 w-2 h-1 bg-white rounded-full blur-sm"
              style={{ top: `${70 + i * 5}%` }}
              animate={{
                x: ['-10px', '100vw']
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2
              }}
            />
          ))}
        </>
      )}
      
      {/* Rain effect */}
      {cityState.rainEffect && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-4 bg-blue-200 opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: ['0vh', '120vh']
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}
      
      {/* Victory: Successful hack sequence */}
      <AnimatePresence>
        {cityState.victoryLights && (
          <>
            {/* Data streams flowing */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-gradient-to-b from-green-400 via-cyan-300 to-transparent"
                style={{
                  left: `${10 + i * 7}%`,
                  height: '100%',
                  top: 0
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.7, 1, 0.3],
                  scaleY: [0, 1, 0.8, 1.2, 1]
                }}
                transition={{ 
                  delay: i * 0.1,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
            
            {/* Matrix-style digital rain */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-400 font-mono text-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`
                }}
                animate={{
                  y: [0, 200],
                  opacity: [1, 0.7, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </motion.div>
            ))}
            
            {/* Neon victory burst */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  background: `radial-gradient(circle, ${['#ff0080', '#00ff80', '#0080ff', '#ff8000'][i % 4]} 0%, transparent 70%)`
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 3, 0],
                  opacity: [1, 0.8, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
            
            {/* Hack successful message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="text-3xl font-bold text-cyan-300 text-center bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-cyan-400/70 shadow-xl">
                🌆 ACCESS GRANTED
                <div className="text-sm text-green-300 mt-1">Mainframe successfully hacked!</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* City power out effect - hack failed */}
      <AnimatePresence>
        {cityState.cityPowerOut && (
          <>
            {/* Security alerts flashing */}
            <motion.div 
              className="absolute inset-0 border-8 border-red-500"
              animate={{ 
                opacity: [0, 1, 0, 1, 0],
                borderColor: ['#ef4444', '#dc2626', '#ef4444', '#dc2626', '#ef4444']
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity
              }}
            />
            
            {/* Digital glitch effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-red-500/20 backdrop-blur-sm"
                style={{
                  left: `${i * 16}%`,
                  top: `${10 + (i % 3) * 30}%`,
                  width: '15%',
                  height: `${10 + Math.random() * 20}%`
                }}
                animate={{
                  opacity: [0, 0.8, 0, 0.6, 0],
                  x: [0, 5, -3, 7, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
            
            {/* Power failure darkness */}
            <motion.div 
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.7, 0.9] }}
              transition={{ duration: 2, times: [0, 0.4, 0.8, 1] }}
            />
            
            {/* Hack failed message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="text-3xl font-bold text-red-300 text-center bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-red-400/70 shadow-xl">
                🚨 SECURITY BREACH
                <div className="text-sm text-orange-300 mt-1">Detected and traced!</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Cyberpunk HUD */}
      <div className="absolute top-32 right-6 z-10">
        <motion.div
          className="bg-black/70 backdrop-blur-md border border-cyan-500/50 rounded-lg px-4 py-3 shadow-xl font-mono"
          animate={{
            boxShadow: [
              '0 0 10px rgba(0, 255, 255, 0.3)',
              '0 0 20px rgba(0, 255, 255, 0.6)',
              '0 0 10px rgba(0, 255, 255, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-cyan-300 text-xs mb-1">
            HACK PROGRESS
          </div>
          <div className="text-cyan-100 text-lg">
            {Math.round(progressRatio * 100)}%
          </div>
          
          {/* Data nodes indicator */}
          <div className="flex gap-1 mt-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded border border-cyan-400 ${
                  i < filledCells 
                    ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' 
                    : 'bg-cyan-900/50'
                }`}
              />
            ))}
          </div>
          
          {/* System status */}
          <div className="text-xs text-cyan-400 mt-2">
            {filledCells === 0 ? 'System idle...' :
             filledCells < 3 ? 'Initializing hack...' :
             filledCells < 6 ? 'Bypassing security...' :
             filledCells < 9 ? 'Breaking encryption...' :
             'Access achieved!'}
          </div>
          
          {/* Neon power level */}
          <div className="text-xs text-purple-400 mt-1">
            NEON: {Math.round(cityState.neonIntensity * 100)}%
          </div>
        </motion.div>
      </div>
    </div>
  );
}
