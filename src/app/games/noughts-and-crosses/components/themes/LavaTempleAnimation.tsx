'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LavaTempleAnimationProps {
  board: Array<'X' | 'O' | null>;
  gameState: 'playing' | 'won' | 'lost' | 'tie';
  storyDismissed?: boolean;
  onStoryDismiss?: () => void;
}

export default function LavaTempleAnimation({ board, gameState, storyDismissed, onStoryDismiss }: LavaTempleAnimationProps) {
  // Ancient glyphs that represent puzzle elements
  const glyphs = ['𓀀', '𓁹', '𓃒', '𓆣', '𓇯', '𓊖', '𓉐', '𓂀'];
  
  const filledCells = board.filter(cell => cell !== null).length;
  const progressRatio = filledCells / 9;
  
  // Determine guardian state based on game progress
  const guardianState = {
    eyeGlow: filledCells >= 2 ? `${Math.min(0.3 + filledCells * 0.1, 1)}` : '0.2',
    torchFlicker: filledCells >= 3 ? true : false,
    runeGlow: filledCells >= 5 ? true : false,
    leftPillarDamage: filledCells >= 4 ? true : false,
    rightPillarDamage: filledCells >= 6 ? true : false,
    templeShake: gameState !== 'playing' ? true : false,
    victoryBurst: gameState === 'won' ? true : false,
    defeatCrumble: gameState === 'lost' ? true : false
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
          <source src="/games/noughts-and-crosses/images/lava-temple/lava-temple-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Story Introduction Modal - Dismissible */}
      <AnimatePresence>
        {!storyDismissed && onStoryDismiss && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/80 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-4 border border-orange-400/50 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="text-center">
                <div className="text-6xl mb-6">🌋</div>
                <h2 className="text-3xl font-bold text-orange-300 mb-4">Temple of the Ancient Guardians</h2>
                <p className="text-white/90 leading-relaxed mb-6 text-lg">
                  Deep within the molten temple lies the Sacred Treasure, guarded by ancient spirits. 
                  The temple's guardian eyes watch your every move, testing your knowledge. Answer 
                  correctly to prove your worth and claim the treasure, but fail and face the 
                  guardian's wrath as the temple crumbles around you!
                </p>
                
                <motion.button
                  onClick={onStoryDismiss}
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-full text-lg transition-all shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 165, 0, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enter Temple 🔥
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Guardian eyes glow overlay - enhanced */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 25% 30%, rgba(255, 165, 0, 0.6) 0%, transparent 12%), radial-gradient(circle at 75% 30%, rgba(255, 165, 0, 0.6) 0%, transparent 12%)',
        }}
        animate={{
          opacity: guardianState.eyeGlow
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Removed temple pillars to create more space */}
      
      {/* Ancient runes that appear as game progresses */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4 w-48 h-48">
          {glyphs.slice(0, Math.min(filledCells, 8)).map((glyph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{ 
                opacity: guardianState.runeGlow ? [0.3, 0.8, 0.3] : 0.5, 
                scale: 1, 
                rotate: 0 
              }}
              transition={{ 
                duration: index * 0.2 + 0.5,
                opacity: guardianState.runeGlow ? {
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                } : {}
              }}
              className="flex items-center justify-center text-amber-400 text-2xl font-bold"
            >
              {glyph}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Torch flickering effects on sides */}
      {guardianState.torchFlicker && (
        <>
          <motion.div 
            className="absolute left-4 top-1/4 w-6 h-32 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent"
            animate={{ 
              opacity: [0.6, 1, 0.8, 1, 0.7],
              scaleY: [1, 1.1, 0.9, 1.05, 1],
              scaleX: [1, 0.8, 1.2, 0.9, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
          />
          <motion.div 
            className="absolute right-4 top-1/4 w-6 h-32 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent"
            animate={{ 
              opacity: [0.8, 1, 0.6, 1, 0.9],
              scaleY: [1, 0.9, 1.1, 1, 0.95],
              scaleX: [1, 1.1, 0.9, 1.2, 1]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
          />
        </>
      )}
      
      {/* Victory: Temple door opening and treasure reveal */}
      <AnimatePresence>
        {guardianState.victoryBurst && (
          <>
            {/* Golden temple door opening */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-gradient-to-b from-yellow-600 via-amber-500 to-yellow-700 rounded-t-lg border-4 border-amber-400 shadow-2xl"
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: [0, 0.2, 0.8, 1] }}
              transition={{ duration: 2, times: [0, 0.3, 0.7, 1] }}
            >
              {/* Door hieroglyphs */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-amber-200 text-2xl">𓃒</div>
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-amber-200 text-xl">𓂀</div>
              
              {/* Door handles */}
              <div className="absolute top-1/2 left-2 w-3 h-8 bg-gold-600 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-2 w-3 h-8 bg-gold-600 rounded-full transform -translate-y-1/2"></div>
            </motion.div>
            
            {/* Treasure chest emerging */}
            <motion.div
              className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg border-2 border-yellow-500 shadow-xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              {/* Chest lid */}
              <motion.div 
                className="absolute -top-2 left-0 w-full h-4 bg-amber-500 rounded-lg border-2 border-yellow-500"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -60 }}
                transition={{ delay: 2, duration: 1 }}
                style={{ transformOrigin: 'bottom' }}
              />
              
              {/* Treasure glow */}
              <motion.div 
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 rounded-full blur-lg"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
              />
              
              {/* Gold coins */}
              <motion.div 
                className="absolute -top-1 left-4 w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: [-5, 5, -3] }}
                transition={{ delay: 2.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div 
                className="absolute -top-1 right-4 w-2 h-2 bg-yellow-300 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: [-3, 7, -5] }}
                transition={{ delay: 3, duration: 1, repeat: Infinity, repeatType: "reverse" }}
              />
            </motion.div>
            
            {/* Victory golden burst */}
            <motion.div 
              className="absolute inset-0 bg-gradient-radial from-yellow-300/40 via-orange-400/20 to-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.8, 0.4, 0.6, 0.2],
                scale: [0.5, 2, 1.5, 2.5, 3.5]
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            />
            
            {/* Victory message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <div className="text-3xl font-bold text-amber-300 text-center bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 border border-amber-400/50 shadow-xl">
                🏛️ TEMPLE CONQUERED
                <div className="text-sm text-yellow-300 mt-1">Ancient treasure unlocked!</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Defeat: Temple collapse and lava flood */}
      <AnimatePresence>
        {guardianState.defeatCrumble && (
          <>
            {/* Collapsing debris */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-stone-600 rounded"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${10 + (i % 3) * 10}%`
                }}
                initial={{ y: 0, rotate: 0 }}
                animate={{ 
                  y: ['0vh', '100vh'],
                  rotate: [0, 360 + i * 45]
                }}
                transition={{ 
                  delay: i * 0.2,
                  duration: 2 + i * 0.3,
                  ease: "easeIn"
                }}
              />
            ))}
            
            {/* Lava flood rising */}
            <motion.div 
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-700 via-orange-600 to-red-500"
              initial={{ height: 0 }}
              animate={{ height: ['0%', '30%', '60%', '100%'] }}
              transition={{ 
                duration: 3,
                times: [0, 0.4, 0.7, 1],
                ease: "easeOut"
              }}
            />
            
            {/* Lava bubbles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-orange-400 rounded-full"
                style={{
                  left: `${15 + i * 12}%`,
                  bottom: '10%'
                }}
                animate={{ 
                  y: [0, -20, -40, -60],
                  opacity: [1, 0.8, 0.4, 0],
                  scale: [1, 1.2, 1.5, 0.5]
                }}
                transition={{ 
                  delay: 1 + i * 0.3,
                  duration: 2,
                  repeat: Infinity
                }}
              />
            ))}
            
            {/* Defeat overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-red-800/40 to-orange-900/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0.8, 1] }}
              transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1] }}
            />
            
            {/* Defeat message */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="text-3xl font-bold text-red-300 text-center bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 border border-red-400/50 shadow-xl">
                🌋 TEMPLE COLLAPSED
                <div className="text-sm text-orange-300 mt-1">Consumed by ancient fury...</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Enhanced Temple Power HUD - moved to right side under header */}
      <div className="absolute top-32 right-6 z-10">
        <motion.div
          className="bg-black/60 backdrop-blur-md border border-amber-500/50 rounded-lg px-4 py-3 shadow-xl"
          animate={{
            boxShadow: [
              '0 0 10px rgba(245, 158, 11, 0.3)',
              '0 0 20px rgba(245, 158, 11, 0.5)',
              '0 0 10px rgba(245, 158, 11, 0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-amber-300 text-xs font-bold mb-2">
            TEMPLE POWER CORE
          </div>
          <div className="text-amber-200 text-lg font-mono mb-1">
            {Math.round(progressRatio * 100)}%
          </div>
          
          {/* Enhanced temple statistics */}
          <div className="text-xs font-mono text-amber-300 mb-1">
            HEAT: {Math.round(800 + (progressRatio * 400))}°C
          </div>
          <div className="text-xs font-mono text-orange-300 mb-1">
            CRYSTALS: {filledCells}/9
          </div>
          <div className="text-xs font-mono text-yellow-300 mb-1">
            MANA FLOW: {Math.round(25 + (progressRatio * 75))}%
          </div>
          <div className="text-xs font-mono text-red-300">
            GUARDIAN: {guardianState.eyeGlow ? 'ACTIVE' : 'DORMANT'}
          </div>
          
          {/* Ancient power crystals indicator */}
          <div className="flex gap-1 mt-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full border border-amber-400 ${
                  i < filledCells 
                    ? 'bg-amber-400 shadow-sm shadow-amber-400/50' 
                    : 'bg-amber-900/50'
                }`}
              />
            ))}
          </div>
          
          {/* Enhanced guardian mood indicator */}
          <div className="text-xs text-amber-400 mt-2">
            {filledCells === 0 ? '🗿 Guardian slumbers...' :
             filledCells < 3 ? '👁️ Guardian stirs...' :
             filledCells < 6 ? '🔥 Guardian awakens!' :
             filledCells < 9 ? '⚡ Guardian fury rises!' :
             '💀 Ancient power unleashed!'}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
