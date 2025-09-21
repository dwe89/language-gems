'use client';

import { motion } from 'framer-motion';
import { Gamepad2, PartyPopper } from 'lucide-react';

interface ClassicAnimationProps {
  board: Array<'X' | 'O' | null>;
  gameState: 'playing' | 'won' | 'lost' | 'tie';
  storyDismissed?: boolean;
  onStoryDismiss?: () => void;
}

export default function ClassicAnimation({ board, gameState, storyDismissed, onStoryDismiss }: ClassicAnimationProps) {
  const filledCells = board.filter(cell => cell !== null).length;
  const progressRatio = filledCells / 9;
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced full-screen classic background */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
          animate={{
            backgroundImage: [
              "radial-gradient(circle at 20% 50%, rgb(30, 58, 138, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgb(30, 58, 138, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgb(30, 58, 138, 0.3) 0%, transparent 50%)",
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Animated circuit board pattern */}
        <div className="absolute inset-0 opacity-10">
          {/* Dynamic grid lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute w-full h-px bg-blue-400"
              style={{ top: `${8 + i * 8}%` }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scaleX: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute h-full w-px bg-blue-400"
              style={{ left: `${8 + i * 8}%` }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scaleY: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              width: '60px',
              height: '60px'
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.8
            }}
          >
            <div className={`w-full h-full border-2 ${i % 3 === 0 ? 'border-blue-400 rounded-full' : i % 3 === 1 ? 'border-purple-400 rounded-lg' : 'border-green-400 rounded-sm rotate-45'} bg-white/5`} />
          </motion.div>
        ))}

        {/* Central energy core */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-blue-400/50 rounded-full bg-blue-400/10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.7, 0.3],
            borderColor: ["rgba(96, 165, 250, 0.5)", "rgba(147, 197, 253, 0.8)", "rgba(96, 165, 250, 0.5)"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        >
          <div className="absolute inset-4 border border-blue-300/30 rounded-full"></div>
        </motion.div>
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
            className="text-center bg-black/70 backdrop-blur-md rounded-2xl px-8 py-6 border border-blue-400/50 shadow-2xl max-w-2xl relative"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="text-4xl mb-4"><Gamepad2 size={48} /></div>
            <h2 className="text-2xl font-bold text-blue-300 mb-3">Classic Learning Arena</h2>
            <p className="text-white/90 leading-relaxed">
              Enter the timeless digital arena where knowledge meets strategy! This classic 
              environment has trained countless minds. Master vocabulary through strategic 
              gameplay in the purest form of the challenge.
            </p>
            <div className="mt-4 text-sm text-blue-400">
              ⚡ System Status: Online • Progress: {Math.round(progressRatio * 100)}%
            </div>
            <motion.button
              onClick={onStoryDismiss}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Arena <Gamepad2 size={16} className="inline" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Animated elements based on game progress */}
      {filledCells >= 2 && (
        <motion.div
          className="absolute top-32 left-6 w-4 h-4 bg-blue-400 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}
        />
      )}
      
      {filledCells >= 4 && (
        <motion.div
          className="absolute top-32 right-6 w-4 h-4 bg-green-400 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
      )}
      
      {filledCells >= 6 && (
        <motion.div
          className="absolute bottom-6 left-6 w-4 h-4 bg-purple-400 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 1
          }}
        />
      )}
      
      {filledCells >= 8 && (
        <motion.div
          className="absolute bottom-6 right-6 w-4 h-4 bg-orange-400 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 1.5
          }}
        />
      )}
      
      {/* Victory effect */}
      {gameState === 'won' && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute inset-0 bg-green-400/20"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 1,
              repeat: Infinity
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 text-3xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            <PartyPopper size={24} className="inline" /> VICTORY! <PartyPopper size={24} className="inline" />
          </motion.div>
        </div>
      )}
      
      {/* Defeat effect */}
      {gameState === 'lost' && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute inset-0 bg-red-400/20"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            Game Over
          </motion.div>
        </div>
      )}
      
      {/* Tie effect */}
      {gameState === 'tie' && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute inset-0 bg-yellow-400/20"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-600 text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            It's a Draw!
          </motion.div>
        </div>
      )}
      
      {/* Game progress indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
          <div className="flex justify-between text-gray-600 text-sm mb-1">
            <span>Game Progress</span>
            <span>{filledCells}/9</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
