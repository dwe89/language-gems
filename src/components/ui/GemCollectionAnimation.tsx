import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GemIcon, { GemType } from './GemIcon';
import { audioFeedbackService } from '../../services/audioFeedbackService';

interface GemCollectionAnimationProps {
  gemType: GemType;
  points: number;
  show: boolean;
  onComplete?: () => void;
  upgraded?: boolean;
  previousGemType?: GemType;
}

const GemCollectionAnimation: React.FC<GemCollectionAnimationProps> = ({
  gemType,
  points,
  show,
  onComplete,
  upgraded = false,
  previousGemType
}) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (show && upgraded && previousGemType) {
      // Show upgrade animation after initial collection
      setTimeout(() => setShowUpgrade(true), 800);
      // Don't play additional sound - already played in main game
    }
  }, [show, upgraded, previousGemType]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, upgraded ? 3000 : 2000);
      return () => clearTimeout(timer);
    }
  }, [show, upgraded, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Particle Effects Background */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                initial={{
                  x: '50vw',
                  y: '50vh',
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: `${50 + (Math.cos(i * 30 * Math.PI / 180) * 200)}vw`,
                  y: `${50 + (Math.sin(i * 30 * Math.PI / 180) * 200)}vh`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.2 + i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Main Collection Animation */}
          <div className="relative">
            {/* Gem Collection */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.1 
              }}
            >
              {/* Gem Icon */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut"
                }}
              >
                <GemIcon 
                  type={gemType} 
                  size="xl" 
                  animated={true}
                  collected={true}
                />
              </motion.div>

              {/* Points Animation */}
              <motion.div
                className="mt-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  +{points} XP
                </div>
              </motion.div>
            </motion.div>

            {/* Upgrade Animation */}
            <AnimatePresence>
              {showUpgrade && previousGemType && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Transformation Effect */}
                  <div className="relative">
                    {/* Previous Gem (shrinking) */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <GemIcon type={previousGemType} size="xl" />
                    </motion.div>

                    {/* Arrow/Transformation Indicator */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <div className="text-4xl text-yellow-300">→</div>
                    </motion.div>

                    {/* New Gem (growing) */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <GemIcon type={gemType} size="xl" animated={true} />
                    </motion.div>
                  </div>

                  {/* Upgrade Text */}
                  <motion.div
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-300">
                        Upgraded to {gemType.charAt(0).toUpperCase() + gemType.slice(1)}!
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Radial Glow Effect */}
            <motion.div
              className="absolute inset-0 -m-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className={`w-full h-full rounded-full bg-gradient-radial from-yellow-400 to-transparent`} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GemCollectionAnimation;
