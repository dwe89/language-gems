'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCraneProps {
  isLifting: boolean;
  liftedWord?: string;
  onLiftComplete: () => void;
  targetPosition?: { x: number; y: number };
  sourcePosition?: { x: number; y: number }; // Where to pick up the word from
  towerPosition?: { x: number; y: number }; // Where to place the word
  towerHeight?: number; // Height of the tower (number of blocks)
}

export const AnimatedCrane: React.FC<AnimatedCraneProps> = ({
  isLifting,
  liftedWord,
  onLiftComplete,
  targetPosition = { x: 50, y: 60 },
  sourcePosition = { x: 50, y: 80 }, // Default to bottom center
  towerPosition = { x: 50, y: 40 }, // Default to center-top
  towerHeight = 0 // Number of blocks in tower
}) => {
  const [craneState, setCraneState] = useState<'idle' | 'moving-to-source' | 'lowering' | 'grabbing' | 'lifting' | 'moving-to-tower' | 'placing' | 'returning'>('idle');
  const [currentPosition, setCurrentPosition] = useState({ x: 50, y: 30 }); // Crane arm position
  const [cableLength, setCableLength] = useState(25); // More realistic initial cable length

  useEffect(() => {
    if (isLifting && liftedWord) {
      setCraneState('moving-to-source');
      
      // Sequence the realistic crane animation with better positioning
      const sequence = async () => {
        // Step 1: Move crane arm to word location (realistic horizontal movement)
        setTimeout(() => {
          setCurrentPosition({ 
            x: Math.max(20, Math.min(80, sourcePosition.x)), // Constrain to realistic range
            y: sourcePosition.y 
          });
          setCraneState('lowering');
        }, 500);
        
        // Step 2: Lower cable to grab word
        setTimeout(() => {
          setCableLength(50); // Reasonable cable length
          setCraneState('grabbing');
        }, 1000);
        
        // Step 3: Grab and start lifting
        setTimeout(() => {
          setCraneState('lifting');
          setCableLength(25); // Lift up
        }, 1500);
        
        // Step 4: Move to tower position
        setTimeout(() => {
          setCurrentPosition({ 
            x: Math.max(20, Math.min(80, towerPosition.x)), // Constrain to realistic range
            y: towerPosition.y 
          });
          setCraneState('moving-to-tower');
        }, 2000);
        
        // Step 5: Lower to place on tower
        setTimeout(() => {
          setCableLength(35); // Lower to place
          setCraneState('placing');
        }, 2500);
        
        // Step 6: Release and return
        setTimeout(() => {
          setCableLength(25); // Retract cable
          setCraneState('returning');
          setCurrentPosition({ x: 50, y: 30 }); // Return to center
        }, 3000);
        
        // Step 7: Return to idle
        setTimeout(() => {
          setCraneState('idle');
          onLiftComplete();
        }, 3500);
      };
      
      sequence();
    }
  }, [isLifting, liftedWord, onLiftComplete, sourcePosition, towerPosition]);

  const getCraneRotation = () => {
    // Calculate realistic crane rotation with constrained angles
    const baseX = 50; // Crane base at center
    const deltaX = currentPosition.x - baseX;
    
    // Limit crane rotation to realistic angles (-60 to +60 degrees)
    let targetAngle = 0;
    
    switch (craneState) {
      case 'moving-to-source':
      case 'lowering':
      case 'grabbing':
      case 'lifting':
        // Calculate angle for source position with constraints
        targetAngle = Math.max(-60, Math.min(60, deltaX * 0.8)); // Gentler rotation
        break;
      case 'moving-to-tower':
      case 'placing':
        // Calculate angle for tower position with constraints
        const towerDeltaX = towerPosition.x - baseX;
        targetAngle = Math.max(-60, Math.min(60, towerDeltaX * 0.8));
        break;
      case 'returning':
      case 'idle':
      default:
        targetAngle = 0; // Return to center
        break;
    }
    
    return targetAngle;
  };

  const getCableLength = () => {
    return cableLength;
  };

  return (
    <motion.div 
      className="absolute left-1/2 transform -translate-x-1/2 z-30" 
      animate={{
        bottom: `${200 - (towerHeight * 17)}px` // Move up 17px per block (16px block height + 1px spacing)
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      {/* Crane Base - positioned on the platform */}
      <div className="relative">
        {/* Crane Base/Foundation on the platform */}
        <div className="w-12 h-6 bg-gradient-to-b from-gray-400 to-gray-700 mx-auto rounded-sm border border-gray-600 shadow-lg"></div>
        
        {/* Vertical Mast - taller and more stable */}
        <div className="w-3 h-24 bg-gradient-to-b from-gray-300 to-gray-600 mx-auto -mt-1 shadow-lg"></div>
        
        {/* Crane Arm - positioned at the top of the mast */}
        <motion.div
          className="absolute top-6 left-1/2 origin-left"
          style={{ transformOrigin: '0 0' }}
          animate={{ 
            rotate: getCraneRotation()
          }}
          transition={{ 
            duration: 1.2,
            ease: "easeInOut"
          }}
        >
          {/* Horizontal Arm - longer and more proportional */}
          <div className="w-40 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 relative shadow-lg rounded-sm">
            {/* Support struts for realism */}
            <div className="absolute left-4 top-0 w-0.5 h-6 bg-gray-600 transform -rotate-45 origin-bottom"></div>
            <div className="absolute left-8 top-0 w-0.5 h-8 bg-gray-600 transform -rotate-45 origin-bottom"></div>
            
            {/* Cable - positioned at the end of the arm */}
            <motion.div
              className="absolute right-4 top-2 w-0.5 bg-gray-800 origin-top shadow-sm"
              animate={{ 
                height: getCableLength()
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              {/* Hook */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-4 bg-gray-700 rounded-sm shadow-sm"></div>
                
                {/* Lifted Word */}
                <AnimatePresence>
                  {isLifting && liftedWord && (craneState === 'grabbing' || craneState === 'lifting' || craneState === 'moving-to-tower' || craneState === 'placing') && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 5 }}
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 
                                 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-lg
                                 border-2 border-blue-300 shadow-xl whitespace-nowrap font-bold"
                    >
                      {liftedWord}
                      {/* Loading/grab indicator */}
                      {craneState === 'grabbing' && (
                        <motion.div
                          className="absolute inset-0 border-2 border-white rounded-lg"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Crane Cab - positioned on the mast */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 
                        w-8 h-6 bg-yellow-500 rounded border border-yellow-600 shadow-md"></div>
        
        {/* Counter Weight - positioned behind the mast */}
        <div className="absolute top-8 left-1/2 transform translate-x-[-150%]
                        w-6 h-8 bg-gray-600 rounded border border-gray-700 shadow-lg"></div>
        
        {/* Support cables for visual stability */}
        <div className="absolute top-6 left-1/2 w-0.5 h-6 bg-gray-500 transform -translate-x-8 rotate-12"></div>
        <div className="absolute top-6 left-1/2 w-0.5 h-6 bg-gray-500 transform translate-x-8 -rotate-12"></div>
      </div>
    </motion.div>
  );
};
