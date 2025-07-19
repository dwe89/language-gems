'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PirateAdventureAnimationProps {
  board: Array<'X' | 'O' | null>;
  gameState: 'playing' | 'won' | 'lost' | 'tie';
  storyDismissed?: boolean;
  onStoryDismiss?: () => void;
}

export default function PirateAdventureAnimation({ board, gameState, storyDismissed, onStoryDismiss }: PirateAdventureAnimationProps) {
  const filledCells = board.filter(cell => cell !== null).length;
  const progressRatio = filledCells / 9;
  
  // Calculate battle progress
  const shipIntegrity = Math.max(0, 100 - (progressRatio * 30)).toFixed(0); // Ship stays strong longer
  const battleIntensity = progressRatio;
  
  // Determine battle state
  const battleState = {
    cannonSmoke: filledCells >= 2,
    shipRocking: filledCells >= 3,
    treasureGlow: filledCells >= 5,
    stormClouds: filledCells >= 6,
    victoryFireworks: gameState === 'won',
    defeatSinking: gameState === 'lost'
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
          <source src="/games/noughts-and-crosses/images/pirate-adventure/pirate-adventure-bg.mp4" type="video/mp4" />
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
            className="text-center bg-black/70 backdrop-blur-md rounded-2xl px-8 py-6 border border-amber-400/50 shadow-2xl max-w-2xl relative"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="text-4xl mb-4">🏴‍☠️</div>
            <h2 className="text-2xl font-bold text-amber-300 mb-3">Quest for the Lost Treasure</h2>
            <p className="text-white/90 leading-relaxed">
              Ahoy, matey! You're aboard the mighty vessel seeking the legendary treasure of 
              Captain Blackwater. Navigate treacherous vocabulary challenges to decode the 
              ancient treasure map. Every correct answer brings you closer to untold riches, 
              but wrong answers may send you to Davy Jones' locker!
            </p>
            <div className="mt-4 text-sm text-amber-400">
              ⚓ Ship Status: Ready to Sail • Treasure Progress: {Math.round(progressRatio * 100)}%
            </div>
            <motion.button
              onClick={onStoryDismiss}
              className="mt-6 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Set Sail! ⚓
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Player pirate ship - MUCH MUCH bigger on right side */}
      <motion.div 
        className="absolute top-1/4 right-8 transform -translate-y-1/4"
        style={{ 
          width: '650px', // MUCH MUCH bigger
          height: '500px'
        }}
        animate={battleState.shipRocking ? {
          rotate: [0, 2, -1, 1, 0],
          y: [0, -6, 3, -3, 0]
        } : {
          y: [0, -2, 0, 2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img 
          src="/games/noughts-and-crosses/images/pirate-adventure/pirate-ship.png" 
          alt="Player Pirate Ship"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        
        {/* Removed flag to clean up ship appearance */}
      </motion.div>
      
      {/* Cannon smoke effects from our ship */}
      {battleState.cannonSmoke && (
        <>
          <motion.div 
            className="absolute left-1/2 bottom-[35%] transform -translate-x-1/2 w-20 h-20 bg-gray-400 rounded-full blur-lg opacity-70"
            animate={{ 
              opacity: [0, 0.8, 0.4, 0],
              scale: [0.5, 1.8, 2.5, 3],
              x: [0, 30, 60, 90],
              y: [0, -10, -20, -30]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
          <motion.div 
            className="absolute left-1/2 bottom-[30%] transform -translate-x-1/2 w-16 h-16 bg-gray-300 rounded-full blur-md opacity-50"
            animate={{ 
              opacity: [0, 0.6, 0.3, 0],
              scale: [0.3, 1.2, 1.8, 2.2],
              x: [0, -25, -50, -75],
              y: [0, -8, -15, -25]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 1.5
            }}
          />
        </>
      )}
      
      {/* Treasure chest with uploaded image - prominently positioned */}
      <motion.div 
        className="absolute bottom-20 right-32"
        style={{ width: '160px', height: '120px' }}
        animate={{
          scale: [1, 1.05, 1],
          rotateY: [0, 5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img 
          src="/games/noughts-and-crosses/images/pirate-adventure/treasure-chest.png" 
          alt="Treasure Chest"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        
        {/* Treasure glow effect */}
        {battleState.treasureGlow && (
          <motion.div 
            className="absolute inset-0 bg-yellow-400 rounded-lg blur-xl opacity-40"
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}
          />
        )}
      </motion.div>
      
      {/* Storm clouds for intense battles */}
      {battleState.stormClouds && (
        <motion.div 
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-700 via-gray-600 to-transparent opacity-60"
          animate={{ 
            opacity: [0.4, 0.8, 0.6, 0.9, 0.4]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity
          }}
        />
      )}
      
      {/* Victory: Treasure discovery sequence */}
      <AnimatePresence>
        {battleState.victoryFireworks && (
          <>
            {/* Giant treasure chest opening */}
            <motion.div 
              className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg border-4 border-yellow-500 shadow-2xl"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5, type: "spring" }}
            >
              {/* Chest lid opening */}
              <motion.div 
                className="absolute -top-3 left-0 w-full h-6 bg-amber-500 rounded-lg border-4 border-yellow-500"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -70 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                style={{ transformOrigin: 'bottom center' }}
              />
              
              {/* Treasure glow */}
              <motion.div 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-yellow-300 rounded-full blur-xl"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
              />
              
              {/* Gold coins spilling */}
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
                  style={{
                    left: `${30 + (i % 4) * 10}%`,
                    top: `-${5 + Math.random() * 10}px`
                  }}
                  initial={{ y: 0, rotate: 0 }}
                  animate={{ 
                    y: [0, -20, 30, 15],
                    rotate: [0, 180, 360, 180],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 20)]
                  }}
                  transition={{ 
                    delay: 2 + i * 0.1, 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
              
              {/* Gems */}
              <motion.div 
                className="absolute -top-1 left-6 w-2 h-2 bg-emerald-400 rounded transform rotate-45"
                initial={{ y: 0 }}
                animate={{ y: [-8, 15, -5] }}
                transition={{ delay: 2.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div 
                className="absolute -top-1 right-6 w-2 h-2 bg-ruby-400 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: [-5, 20, -8] }}
                transition={{ delay: 3, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              />
            </motion.div>
            
            {/* Victory flag raising */}
            <motion.div
              className="absolute left-[12%] top-[20%] w-2 h-32 bg-brown-600"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1, duration: 1 }}
              style={{ transformOrigin: 'bottom' }}
            >
              <motion.div 
                className="absolute top-0 left-2 w-12 h-8 bg-red-600 border border-red-800"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                style={{ transformOrigin: 'left' }}
              >
                {/* Skull and crossbones */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-xs">💀</div>
              </motion.div>
            </motion.div>
            
            {/* Celebration fireworks */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-6 h-6 rounded-full"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${15 + (i % 3) * 15}%`,
                  background: `radial-gradient(circle, ${['#ffd700', '#ff6b35', '#4ecdc4', '#45b7d1'][i % 4]} 0%, transparent 70%)`
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
            
            {/* Victory message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <div className="text-3xl font-bold text-yellow-300 text-center bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3 border border-yellow-400/50 shadow-xl">
                🏴‍☠️ TREASURE FOUND!
                <div className="text-sm text-amber-300 mt-1">The legend is real!</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Defeat: Ship sinking sequence */}
      <AnimatePresence>
        {battleState.defeatSinking && (
          <>
            {/* Storm clouds gathering */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-800 via-gray-700 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 1] }}
              transition={{ duration: 1.5 }}
            />
            
            {/* Lightning flashes */}
            <motion.div 
              className="absolute inset-0 bg-white"
              animate={{ opacity: [0, 0.3, 0, 0.5, 0] }}
              transition={{ 
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
            
            {/* Player ship sinking */}
            <motion.div 
              className="absolute left-[5%] bottom-[15%]"
              style={{ 
                width: '320px',
                height: '240px'
              }}
              animate={{ 
                y: [0, 50, 100, 150],
                rotate: [0, -5, -15, -25]
              }}
              transition={{ duration: 3, ease: "easeIn" }}
            >
              <img 
                src="/games/noughts-and-crosses/images/pirate-adventure/pirate-ship.png" 
                alt="Sinking Player Ship"
                className="w-full h-full object-contain opacity-70"
              />
              
              {/* Water splashing around sinking ship */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-blue-300 rounded-full opacity-70"
                  style={{
                    left: `${20 + i * 15}%`,
                    bottom: '-10px'
                  }}
                  animate={{
                    y: [0, -15, -25, 0],
                    scale: [1, 1.5, 2, 0.5],
                    opacity: [0.7, 1, 0.3, 0]
                  }}
                  transition={{
                    delay: 1 + i * 0.2,
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              ))}
            </motion.div>
            
            {/* Dark ocean overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-800/60 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.9] }}
              transition={{ duration: 2.5, times: [0, 0.6, 1] }}
            />
            
            {/* Defeat message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <div className="text-3xl font-bold text-blue-200 text-center bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3 border border-blue-400/50 shadow-xl">
                ⚓ SHIP LOST AT SEA
                <div className="text-sm text-cyan-300 mt-1">Claimed by Davy Jones...</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Battle progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <div className="text-white text-xs font-bold mb-1 text-center drop-shadow-lg">
          Ship Integrity: {shipIntegrity}% • Battle Progress: {Math.round(progressRatio * 100)}%
        </div>
        <div className="h-2 bg-slate-800 bg-opacity-50 rounded-full overflow-hidden border border-blue-300">
          <motion.div 
            className="h-full rounded-full transition-all duration-500" 
            style={{ 
              width: `${shipIntegrity}%`,
              background: progressRatio > 0.7 ? 
                'linear-gradient(to right, #ef4444, #f97316)' : 
                progressRatio > 0.4 ? 
                'linear-gradient(to right, #f97316, #facc15)' : 
                'linear-gradient(to right, #22c55e, #84cc16)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
