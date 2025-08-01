'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameVocabularyWord } from '../../../../../hooks/useGameVocabulary';

interface PirateAdventureEngineProps {
  currentWord: GameVocabularyWord;
  vocabulary: GameVocabularyWord[];
  onCorrectAnswer: (word: GameVocabularyWord) => void;
  onIncorrectAnswer: () => void;
  isPaused: boolean;
  gameActive: boolean;
  difficulty: string;
  playSFX: (sound: string) => void;
}

interface PirateShip {
  id: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  sailsUp: boolean;
  sinkingProgress: number;
  size: number;
  direction: 'left' | 'right';
  targetY: number;
  firing: boolean;
  spawnTime: number;
}

interface CannonBall {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
}

export default function PirateAdventureEngine({
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty,
  playSFX
}: PirateAdventureEngineProps) {
  const [pirateShips, setPirateShips] = useState<PirateShip[]>([]);
  const [cannonBalls, setCannonBalls] = useState<any[]>([]);
  const [explosions, setExplosions] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Generate decoy translations
  const generateDecoys = (correctTranslation: string): string[] => {
    const otherWords = vocabulary
      .filter(word => word.translation !== correctTranslation)
      .map(word => word.translation);
    
    const decoyCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, decoyCount);
  };

  // Check for collisions between ships
  const checkCollisions = (ships: PirateShip[]): PirateShip[] => {
    const minDistance = 150; // Minimum distance between ships

    return ships.map((ship, index) => {
      let adjustedX = ship.x;
      let adjustedY = ship.y;

      // Check against all other ships
      ships.forEach((otherShip, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(ship.x - otherShip.x, 2) + Math.pow(ship.y - otherShip.y, 2)
          );

          if (distance < minDistance) {
            // Move ship away from collision
            const angle = Math.atan2(ship.y - otherShip.y, ship.x - otherShip.x);
            adjustedX = otherShip.x + Math.cos(angle) * minDistance;
            adjustedY = otherShip.y + Math.sin(angle) * minDistance;
          }
        }
      });

      return { ...ship, x: adjustedX, y: adjustedY };
    });
  };

  // Spawn pirate ships with side-to-side movement
  const spawnPirateShips = () => {
    if (!currentWord || isPaused || !gameActive) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Create ships with collision detection
    const newShips: PirateShip[] = [];
    const waterLevel = screenHeight * 0.4; // Water starts at 60% down the screen

    shuffledOptions.forEach((translation, index) => {
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      const startX = direction === 'left' ? -200 : screenWidth + 200;

      // Find non-overlapping Y position
      let targetY = waterLevel + Math.random() * 200;
      let attempts = 0;

      while (
        attempts < 30 &&
        newShips.some(ship => Math.abs(targetY - ship.targetY) < 100)
      ) {
        targetY = waterLevel + Math.random() * 200;
        attempts++;
      }

      newShips.push({
        id: `ship-${currentWord.id}-${index}-${Date.now()}`,
        translation,
        isCorrect: translation === currentWord.translation,
        x: startX,
        y: targetY,
        speed: 1 + Math.random() * 3, // Slower speed for longer visibility
        sailsUp: Math.random() > 0.3,
        sinkingProgress: 0,
        size: Math.random() * 0.3 + 0.8,
        direction,
        targetY,
        firing: false,
        spawnTime: Date.now()
      });
    });

    setPirateShips(checkCollisions(newShips));
  };

  // Update ship positions with side-to-side movement
  const updateShips = () => {
    if (isPaused || !gameActive) return;

    setPirateShips(prev =>
      prev.map(ship => {
        let newX = ship.x;

        // Move horizontally based on direction
        if (ship.direction === 'left') {
          newX = ship.x + ship.speed;
        } else {
          newX = ship.x - ship.speed;
        }

        return {
          ...ship,
          x: newX,
          sailsUp: Math.random() > 0.98 ? !ship.sailsUp : ship.sailsUp
        };
      }).filter(ship => {
        // Remove ships only after 10 seconds timeout
        const timeElapsed = Date.now() - ship.spawnTime;
        if (timeElapsed > 10000) {
          // Trigger wrong answer for timeout
          if (ship.isCorrect) {
            setTimeout(() => onIncorrectAnswer(), 0);
          }
          return false;
        }
        return true;
      })
    );
  };

  // Handle ship click (cannon fire)
  const handleShipClick = (ship: PirateShip) => {
    if (ship.firing) return; // Prevent double clicks

    // Trigger firing animation
    setPirateShips(prev =>
      prev.map(s => s.id === ship.id ? { ...s, firing: true } : s)
    );

    // Create cannon ball effect
    createCannonBall(ship.x, ship.y);

    // Play cannon fire sound immediately
    playSFX('gem');

    // Delay the result to show firing animation
    setTimeout(() => {
      if (ship.isCorrect) {
        onCorrectAnswer(currentWord);
        createExplosion(ship.x, ship.y, 'treasure');
        
        // Remove clicked ship immediately after correct answer
        setPirateShips(prev => prev.filter(s => s.id !== ship.id));
      } else {
        onIncorrectAnswer();
        createExplosion(ship.x, ship.y, 'miss');
        
        // Remove clicked ship immediately after incorrect answer
        setPirateShips(prev => prev.filter(s => s.id !== ship.id));
      }
    }, 300);
  };

  // Create cannon ball effect
  const createCannonBall = (targetX: number, targetY: number) => {
    const cannonBall = {
      id: `cannonball-${Date.now()}`,
      startX: window.innerWidth / 2,
      startY: window.innerHeight - 100,
      targetX,
      targetY,
      progress: 0
    };

    setCannonBalls(prev => [...prev, cannonBall]);

    // Animate cannon ball
    const animateCannonBall = () => {
      setCannonBalls(prev => 
        prev.map(ball => 
          ball.id === cannonBall.id 
            ? { ...ball, progress: Math.min(ball.progress + 0.05, 1) }
            : ball
        )
      );

      if (cannonBall.progress < 1) {
        requestAnimationFrame(animateCannonBall);
      } else {
        // Remove cannon ball when it reaches target
        setTimeout(() => {
          setCannonBalls(prev => prev.filter(b => b.id !== cannonBall.id));
        }, 100);
      }
    };

    requestAnimationFrame(animateCannonBall);
  };

  // Create explosion effect
  const createExplosion = (x: number, y: number, type: 'treasure' | 'miss') => {
    const explosionCount = type === 'treasure' ? 12 : 6;
    const newExplosions = Array.from({ length: explosionCount }, (_, i) => ({
      id: `explosion-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      life: 1,
      color: type === 'treasure' ? '#F59E0B' : '#EF4444',
      size: Math.random() * 10 + 5,
      type
    }));

    setExplosions(prev => [...prev, ...newExplosions]);

    setTimeout(() => {
      setExplosions(prev => prev.filter(e => !newExplosions.some(ne => ne.id === e.id)));
    }, 1500);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateShips();

      // Spawn new ships periodically if we have fewer than 3 ships
      if (pirateShips.length < 3 && Math.random() < 0.02) {
        spawnPirateShips();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (gameActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameActive, isPaused, pirateShips.length]);

  // Spawn ships when current word changes
  useEffect(() => {
    if (currentWord && gameActive) {
      spawnPirateShips();
    }
  }, [currentWord, gameActive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Video Background */}
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

      {/* Pirate Ships */}
      <AnimatePresence>
        {pirateShips.map((ship) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, scale: 0, x: ship.x, y: ship.y }}
            animate={{
              opacity: 1,
              scale: ship.size,
              x: ship.x,
              y: ship.y
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handleShipClick(ship)}
            className="absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none"
          >
            <div className="relative">
              {/* Proper Pirate Ship Design */}
              <div className="relative">
                {/* Ship Hull */}
                <div className="relative bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-full border-2 border-amber-600 shadow-2xl"
                     style={{ width: '120px', height: '60px' }}>

                  {/* Ship Deck */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-amber-700 rounded-t-lg"></div>

                  {/* Main Mast */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-1 h-12 bg-amber-900"></div>

                  {/* Main Sail */}
                  {ship.sailsUp && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-8 h-10 bg-gradient-to-b from-gray-100 to-gray-200 rounded border border-gray-300 shadow-md"></div>
                  )}

                  {/* Cannon */}
                  <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-4 h-2 bg-gray-800 rounded-full transition-all duration-200 ${ship.firing ? 'scale-110 bg-orange-500' : ''}`}></div>

                  {/* Cannon Smoke Effect */}
                  {ship.firing && (
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 w-6 h-6 bg-gray-400 rounded-full opacity-60 animate-ping"></div>
                  )}

                  {/* Ship Flag */}
                  <div className="absolute top-0 right-2 transform -translate-y-6 w-3 h-2 bg-red-600 border-l border-amber-900"></div>
                </div>

                {/* Vocabulary Text on Ship */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-100 text-amber-900 px-3 py-1 rounded-lg border border-amber-600 font-bold text-sm shadow-lg">
                  {ship.translation}
                </div>

                {/* Ship Wake */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white/30 rounded-full blur-sm"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full blur-xs"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Cannon Balls */}
      <AnimatePresence>
        {cannonBalls.map((ball) => {
          const currentX = ball.startX + (ball.targetX - ball.startX) * ball.progress;
          const currentY = ball.startY + (ball.targetY - ball.startY) * ball.progress;
          
          return (
            <motion.div
              key={ball.id}
              className="absolute w-3 h-3 bg-gray-800 rounded-full shadow-lg"
              style={{
                left: currentX,
                top: currentY
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            />
          );
        })}
      </AnimatePresence>

      {/* Explosions */}
      <AnimatePresence>
        {explosions.map((explosion) => (
          <motion.div
            key={explosion.id}
            initial={{ 
              opacity: 1, 
              scale: 1,
              x: explosion.x,
              y: explosion.y
            }}
            animate={{ 
              opacity: 0, 
              scale: explosion.type === 'treasure' ? 3 : 1.5,
              x: explosion.x + explosion.vx * 30,
              y: explosion.y + explosion.vy * 30
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute pointer-events-none"
            style={{ 
              backgroundColor: explosion.color,
              width: explosion.size,
              height: explosion.size,
              borderRadius: '50%'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Player Cannon (bottom center) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          {/* Cannon Base */}
          <div className="w-16 h-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-full border-2 border-gray-600 shadow-2xl"></div>

          {/* Cannon Barrel */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-3 h-8 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-lg border border-gray-500 shadow-lg"></div>

          {/* Cannon Wheels */}
          <div className="absolute -bottom-2 left-1 w-4 h-4 bg-amber-800 rounded-full border-2 border-amber-600"></div>
          <div className="absolute -bottom-2 right-1 w-4 h-4 bg-amber-800 rounded-full border-2 border-amber-600"></div>

          {/* Cannon Details */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
