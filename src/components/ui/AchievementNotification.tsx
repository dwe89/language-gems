import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Achievement } from '../../services/achievementService';
import { audioFeedbackService } from '../../services/audioFeedbackService';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  show: boolean;
  onComplete?: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  show,
  onComplete
}) => {
  const timerRef = useRef<NodeJS.Timeout>();
  const soundPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    if (show && achievement && !soundPlayedRef.current) {
      // Sound is handled by the parent game component to avoid double-playing
      soundPlayedRef.current = true;

      // Auto-hide after 5 seconds
      timerRef.current = setTimeout(() => {
        onComplete?.();
      }, 5000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }

    // Reset sound flag when achievement is hidden
    if (!show) {
      soundPlayedRef.current = false;
    }
  }, [show, achievement, onComplete]);

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onComplete?.();
  };

  if (!achievement) return null;

  const rarityColors = {
    common: 'from-blue-500 to-blue-600',
    rare: 'from-purple-500 to-purple-600',
    epic: 'from-pink-500 to-pink-600',
    legendary: 'from-yellow-500 to-yellow-600'
  };

  const rarityBorders = {
    common: 'border-blue-400',
    rare: 'border-purple-400',
    epic: 'border-pink-400',
    legendary: 'border-yellow-400'
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Achievement card */}
          <motion.div
            className={`relative bg-gradient-to-br ${rarityColors[achievement.rarity]} p-1 rounded-2xl shadow-2xl max-w-md mx-4`}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              duration: 0.6 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10"
              title="Dismiss"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
              {/* Achievement unlocked header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <h2 className="text-white text-lg font-bold mb-1">
                  🏆 Achievement Unlocked!
                </h2>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border-2 ${rarityBorders[achievement.rarity]} text-white`}>
                  {achievement.rarity.toUpperCase()}
                </div>
              </motion.div>

              {/* Achievement icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                className="text-6xl mb-4"
              >
                {achievement.icon}
              </motion.div>

              {/* Achievement details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-white text-xl font-bold mb-2">
                  {achievement.name}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {achievement.description}
                </p>
                
                {/* Progress indicator */}
                <div className="bg-white/20 rounded-full h-2 mb-3">
                  <motion.div
                    className="bg-white h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                </div>
                
                <p className="text-white/60 text-xs">
                  {achievement.progress} / {achievement.maxProgress}
                </p>
              </motion.div>
            </div>

            {/* Sparkle effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    x: `${50 + (Math.cos(i * 45 * Math.PI / 180) * 100)}%`,
                    y: `${50 + (Math.sin(i * 45 * Math.PI / 180) * 100)}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Glow effect - reduced animation */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]} rounded-2xl -z-10`}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.05, opacity: 0.2 }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Click to dismiss hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="text-white/60 text-sm text-center">
              Click anywhere to dismiss or wait 5 seconds
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
