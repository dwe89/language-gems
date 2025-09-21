'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SpaceExplorerAnimationProps {
  board: Array<'X' | 'O' | null>;
  gameState: 'playing' | 'won' | 'lost' | 'tie';
  storyDismissed?: boolean;
  onStoryDismiss?: () => void;
}

export default function SpaceExplorerAnimation({ board, gameState, storyDismissed, onStoryDismiss }: SpaceExplorerAnimationProps) {
  const filledCells = board.filter(cell => cell !== null).length;
  const progressRatio = filledCells / 9;
  
  // Calculate mission progress
  const missionProgress = Math.round(progressRatio * 100);
  const oxygenLevel = Math.max(0, 100 - (progressRatio * 15)).toFixed(0); // Oxygen decreases slowly
  const distanceToStation = Math.max(0, 100 - (progressRatio * 100)).toFixed(0);
  
  // Astronaut position changes as game progresses - better positioning
  const astronautPosition = {
    x: 15 + (35 * progressRatio), // Moves from left to center-right
    y: 50 + (15 * Math.sin(progressRatio * Math.PI * 2)), // Gentle floating motion
    size: 90 + (30 * progressRatio), // Gets bigger as approaches station
    rotation: progressRatio * 180 // Less rotation for better visibility
  };
  
  // Determine space mission state
  const missionState = {
    engineThrust: filledCells >= 2,
    asteroidField: filledCells >= 4,
    stationSignal: filledCells >= 6,
    dockingSequence: gameState === 'won',
    emergencyDrift: gameState === 'lost',
    nebulaClouds: filledCells >= 3
  };
  
  // Get oxygen status for UI
  const getOxygenStatus = () => {
    if (progressRatio > 0.8) return { text: 'LOW', color: 'text-red-400' };
    if (progressRatio > 0.6) return { text: 'CAUTION', color: 'text-yellow-400' };
    if (progressRatio > 0.4) return { text: 'NORMAL', color: 'text-green-400' };
    return { text: 'OPTIMAL', color: 'text-cyan-400' };
  };
  
  const oxygenStatus = getOxygenStatus();
  
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
          <source src="/games/noughts-and-crosses/images/space-explorer/space-explorer-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Video overlay gradient for better readability */}
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
            className="text-center bg-black/70 backdrop-blur-md rounded-2xl px-8 py-6 border border-cyan-400/50 shadow-2xl max-w-2xl relative"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">Mission: Space Station Alpha</h2>
            <p className="text-white/90 leading-relaxed">
              You're an astronaut on a critical mission to dock with Space Station Alpha. 
              Each correct vocabulary answer brings you closer to safety. Wrong answers 
              send you drifting further into the void. Can you navigate the language 
              challenges and complete your docking sequence?
            </p>
            <div className="mt-4 text-sm text-cyan-400">
              ⚡ Current Oxygen: {oxygenLevel}% • Distance: {distanceToStation} km
            </div>
            <motion.button
              onClick={onStoryDismiss}
              className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Launch Mission 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Spaceship/Station on the right side */}
      <motion.div 
        className="absolute right-16 top-1/3 transform -translate-y-1/2 w-48 h-48"
        animate={missionState.stationSignal ? {
          scale: [1, 1.05, 1],
          filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        {/* Enhanced Space station design */}
        <div className="relative w-full h-full">
          {/* Main hub */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full border-2 border-cyan-300 shadow-lg shadow-cyan-500/50"></div>
          
          {/* Rotating rings */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-3 border-cyan-400 rounded-full shadow-lg shadow-cyan-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-2 border-blue-300 rounded-full opacity-70 shadow-lg shadow-blue-300/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Docking ports */}
          <div className="absolute top-1/2 left-0 w-6 h-3 bg-gray-400 rounded-r-lg border border-cyan-300"></div>
          <div className="absolute top-1/2 right-0 w-6 h-3 bg-gray-400 rounded-l-lg border border-cyan-300"></div>
          <div className="absolute left-1/2 top-0 w-3 h-6 bg-gray-400 rounded-b-lg border border-cyan-300 transform -translate-x-1/2"></div>
          
          {/* Enhanced Station lights */}
          {missionState.stationSignal && (
            <>
              <motion.div 
                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-300 rounded-full shadow-lg shadow-green-300/80"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-300 rounded-full shadow-lg shadow-red-300/80"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-300 rounded-full shadow-lg shadow-blue-300/80"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.25 }}
              />
            </>
          )}
        </div>
      </motion.div>
      
      {/* Astronaut moving across space - using proper PNG - Hidden on mobile for cleaner layout */}
      <motion.div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block"
        style={{
          left: `${astronautPosition.x}%`,
          top: `${astronautPosition.y}%`,
          width: `${astronautPosition.size}px`,
          height: `${astronautPosition.size}px`
        }}
        animate={{
          rotate: astronautPosition.rotation / 8, // Reduced rotation for more realistic movement
          y: [0, -10, 0, 10, 0]
        }}
        transition={{
          rotate: { duration: 8, ease: "linear", repeat: Infinity },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <img 
          src="/games/noughts-and-crosses/images/space-explorer/astronaut.png" 
          alt="Astronaut"
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: missionState.stationSignal ? 'brightness(1.2) drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))' : 'brightness(1)'
          }}
        />
        
        {/* Jetpack thrust effects */}
        {missionState.engineThrust && (
          <motion.div 
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-gradient-to-t from-blue-400 via-cyan-300 to-transparent blur-sm opacity-80"
            animate={{ 
              scaleY: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 0.3,
              repeat: Infinity
            }}
          />
        )}
      </motion.div>
      
      {/* Engine thrust effects when moving */}
      {missionState.engineThrust && (
        <motion.div 
          className="absolute left-12 top-1/2 transform -translate-y-1/2 w-16 h-24 bg-gradient-to-r from-blue-400 via-cyan-300 to-transparent blur-sm"
          animate={{ 
            scaleX: [1, 1.5, 1],
            scaleY: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity
          }}
        />
      )}
      
      {/* Enhanced floating asteroids with more detail */}
      {missionState.asteroidField && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-br from-gray-500 to-gray-700 rounded-full shadow-lg"
              style={{
                left: `${5 + i * 12}%`,
                top: `${10 + (i % 4) * 20}%`,
                width: `${12 + Math.random() * 8}px`,
                height: `${12 + Math.random() * 8}px`
              }}
              animate={{
                x: [0, -30, -60],
                rotate: [0, 180, 360],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </>
      )}
      
      {/* Enhanced nebula clouds with multiple layers */}
      {missionState.nebulaClouds && (
        <>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-pink-500/10 to-transparent"
            animate={{ 
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tl from-blue-600/10 via-cyan-500/5 to-transparent"
            animate={{ 
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              delay: 2
            }}
          />
        </>
      )}
      
      {/* Victory: Successful docking sequence */}
      <AnimatePresence>
        {missionState.dockingSequence && (
          <>
            {/* Bright docking light beam */}
            <motion.div 
              className="absolute right-16 top-1/3 w-2 h-32 bg-gradient-to-l from-green-300 via-cyan-400 to-transparent transform -translate-y-1/2 shadow-2xl shadow-green-300/50"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: [0, 1, 0.8],
                scaleX: [0, 1, 1.2],
                scaleY: [1, 1, 0.8]
              }}
              transition={{ duration: 2, times: [0, 0.5, 1] }}
            />
            
            {/* Successful mission completion burst */}
            <motion.div 
              className="absolute inset-0 bg-gradient-radial from-green-300/30 via-cyan-400/15 to-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.8, 0.4, 0.6, 0.2],
                scale: [0.5, 2, 1.5, 3, 4]
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            />
            
            {/* Mission complete message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="text-2xl font-bold text-green-300 text-center bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 border border-green-400/50 shadow-xl">
                🚀 MISSION SUCCESSFUL
                <div className="text-sm text-cyan-300 mt-1">Astronaut safely docked!</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Defeat: Emergency drift sequence */}
      <AnimatePresence>
        {missionState.emergencyDrift && (
          <>
            {/* Red alert overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-red-600/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.4, 0.8, 0.3] }}
              transition={{ duration: 3, times: [0, 0.3, 0.5, 0.7, 1] }}
            />
            
            {/* Emergency beacon flashing */}
            <motion.div 
              className="absolute right-16 top-1/3 w-6 h-6 bg-red-500 rounded-full transform -translate-y-1/2 shadow-2xl shadow-red-500/80"
              animate={{ 
                opacity: [1, 0.2, 1, 0.2, 1],
                scale: [1, 1.3, 1, 1.3, 1]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity
              }}
            />
            
            {/* Mission failed message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="text-2xl font-bold text-red-300 text-center bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 border border-red-400/50 shadow-xl">
                ⚠️ MISSION FAILED
                <div className="text-sm text-orange-300 mt-1">Astronaut lost in space...</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Enhanced Mission HUD - positioned to not interfere with game */}
      <div className="absolute top-32 right-6 z-10">
        <motion.div
          className="bg-black/60 backdrop-blur-md border border-cyan-400/50 rounded-lg px-4 py-3 shadow-xl"
          animate={{
            boxShadow: [
              '0 0 10px rgba(0, 255, 255, 0.3)',
              '0 0 20px rgba(0, 255, 255, 0.5)',
              '0 0 10px rgba(0, 255, 255, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-cyan-300 text-xs font-bold mb-2">
            MISSION CONTROL
          </div>
          
          <div className={`text-xs font-mono mb-1 ${oxygenStatus.color}`}>
            OXYGEN: {oxygenLevel}%
          </div>
          <div className={`text-xs font-mono mb-1 ${oxygenStatus.color}`}>
            STATUS: {oxygenStatus.text}
          </div>
          <div className="text-xs font-mono text-cyan-300 mb-1">
            PROGRESS: {missionProgress}%
          </div>
          <div className="text-xs font-mono text-blue-300 mb-1">
            ALTITUDE: {Math.round(350 + (progressRatio * 50))}km
          </div>
          <div className="text-xs font-mono text-purple-300 mb-1">
            VELOCITY: {Math.round(7.8 + (progressRatio * 0.3))}km/s
          </div>
          <div className="text-xs font-mono text-green-300">
            FUEL: {Math.max(95 - (filledCells * 8), 20)}%
          </div>
          
          {/* Mission phase indicator */}
          <div className="text-xs font-mono text-yellow-300 mt-2">
            PHASE: {filledCells < 3 ? 'LAUNCH' : filledCells < 6 ? 'ORBIT' : 'DOCKING'}
          </div>
          
          {/* Enhanced progress bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2 w-32">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${missionProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
