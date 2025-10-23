'use client';

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
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
  isAnswered: boolean;
}

interface CannonBall {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  startX: number;
  startY: number;
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
  // --------------------------------------------------------
  // 🚢 CORE FIX: Mutable Refs for Physics and DOM Elements
  // --------------------------------------------------------
  const [pirateShips, setPirateShips] = useState<PirateShip[]>([]); // Only for initial render/cleanup
  const [cannonBalls, setCannonBalls] = useState<CannonBall[]>([]);
  const [explosions, setExplosions] = useState<any[]>([]);

  // Ref to hold the mutable physics state (x, y, etc.)
  const physicsShipsRef = useRef<PirateShip[]>([]); 
  // Ref map to link ship ID to its actual DOM element
  const objectRefsMap = useRef<Map<string, HTMLDivElement>>(new Map()); 
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  // --------------------------------------------------------
  // ⛵ Ref Setter Callback
  // --------------------------------------------------------

  // Utility to set the ref and map it to the object ID
  const setRef = useCallback((element: HTMLDivElement | null, id: string) => {
    if (element) {
        objectRefsMap.current.set(id, element);
    } else {
        objectRefsMap.current.delete(id); // Clean up on unmount
    }
  }, []);

  // --------------------------------------------------------
  // ⚓ Physics/Collision Logic
  // --------------------------------------------------------

  // Generate decoy translations
  const generateDecoys = useCallback((correctTranslation: string): string[] => {
    const otherWords = vocabulary
      .filter(word => word.translation !== correctTranslation)
      .map(word => word.translation);
    
    const decoyCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, decoyCount);
  }, [vocabulary, difficulty]);

  // Enhanced collision detection for ships
  const checkCollisions = useCallback((ships: PirateShip[]): PirateShip[] => {
    const minDistance = 180;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const waterLevel = screenHeight * 0.4;

    let adjustedShips = [...ships];
    let iterations = 0;
    const maxIterations = 5;

    do {
        let collidedInIteration = false;
        // Collision resolution logic here
        // NOTE: Keeping the collision logic simple and fast is key.
        // For the purpose of the fix, we ensure it returns a new array.

        // Standard collision check (kept simplified from original logic)
        for (let i = 0; i < adjustedShips.length; i++) {
            for (let j = i + 1; j < adjustedShips.length; j++) {
                const ship1 = adjustedShips[i];
                const ship2 = adjustedShips[j];

                const distance = Math.sqrt(
                    Math.pow(ship1.x - ship2.x, 2) + Math.pow(ship1.y - ship2.y, 2)
                );

                if (distance < minDistance) {
                    collidedInIteration = true;
                    const overlap = minDistance - distance;
                    const angle = Math.atan2(ship1.y - ship2.y, ship1.x - ship2.x);
                    const dx = Math.cos(angle) * (overlap / 2);
                    const dy = Math.sin(angle) * (overlap / 2);

                    adjustedShips[i] = {
                        ...ship1,
                        x: ship1.x + dx,
                        y: ship1.y + dy 
                    };
                    adjustedShips[j] = {
                        ...ship2,
                        x: ship2.x - dx,
                        y: ship2.y - dy
                    };
                }
            }
        }
        iterations++;
        if (!collidedInIteration) break;
    } while (iterations < maxIterations);

    // Final boundary check
    return adjustedShips.map(ship => ({
        ...ship,
        x: Math.max(-200, Math.min(screenWidth + 200, ship.x)), // Ensure within bounds
        y: Math.max(waterLevel, Math.min(screenHeight - 100, ship.y))
    }));
  }, []);

  // Spawn pirate ships with enhanced positioning
  const spawnPirateShips = useCallback(() => {
    if (!currentWord || isPaused || !gameActive) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const newShips: PirateShip[] = [];
    const waterLevel = screenHeight * 0.4;
    const usedLanes: number[] = [];
    const laneHeight = 80;

    shuffledOptions.forEach((translation, index) => {
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      const startX = direction === 'left' ? -200 : screenWidth + 200;
      let targetY = waterLevel + Math.random() * 200; // Fallback position

      // Simple lane selection
      const laneIndex = index % 3; 
      targetY = waterLevel + (laneIndex * laneHeight) + (Math.random() * 20);

      newShips.push({
        id: `ship-${currentWord.id}-${index}-${Date.now()}`,
        translation,
        isCorrect: translation === currentWord.translation,
        x: startX,
        y: targetY,
        speed: 0.8 + Math.random() * 1.2,
        sailsUp: Math.random() > 0.3,
        sinkingProgress: 0,
        size: Math.random() * 0.2 + 0.9,
        direction,
        targetY,
        firing: false,
        spawnTime: Date.now(),
        isAnswered: false
      });
    });

    const adjustedShips = checkCollisions(newShips);

    // 💡 CRITICAL FIX: Initialize both the state (for rendering) and the physics ref
    setPirateShips(adjustedShips);
    physicsShipsRef.current = adjustedShips; 

  }, [currentWord, isPaused, gameActive, generateDecoys, checkCollisions]);

  // --------------------------------------------------------
  // 💣 CRITICAL FIX: Rewrite updateShips for Direct DOM Write
  // --------------------------------------------------------

  const updateShips = useCallback(() => {
    if (isPaused || !gameActive) return;
    
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    // 1. Calculate physics based on the mutable ref
    let ships = physicsShipsRef.current;
    
    let updatedPhysicsShips = ships.map(ship => {
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
    });

    // 2. Apply collisions and update the physics ref
    let adjustedShips = checkCollisions(updatedPhysicsShips);
    physicsShipsRef.current = adjustedShips;

    // 3. DIRECT DOM WRITE: Apply transform using the map (bypasses React render)
    // This is the core of the fix to eliminate jitter.
    const removedShipIds: string[] = [];

    adjustedShips.forEach(ship => {
        const element = objectRefsMap.current.get(ship.id);
        
        // 4. Remove ships that have sailed off-screen
        const isOffScreen = ship.x < -250 || ship.x > screenWidth + 250;
        
        if (element && !isOffScreen) {
            // Use translate3d for GPU acceleration
            element.style.transform = 
                `translate3d(${ship.x}px, ${ship.y}px, 0) scale(${ship.size})`;
        } else if (isOffScreen) {
            // Prepare to remove the ship from the state array (for cleanup/unmount)
            removedShipIds.push(ship.id);
        }
    });

    // 5. Update the state array ONLY for cleanup/removal (low frequency)
    if (removedShipIds.length > 0) {
        setPirateShips(prev => prev.filter(ship => !removedShipIds.includes(ship.id)));
        physicsShipsRef.current = physicsShipsRef.current.filter(ship => !removedShipIds.includes(ship.id));
    }

  }, [isPaused, gameActive, checkCollisions]);

  // --------------------------------------------------------
  // ⚔️ Game/FX Logic
  // --------------------------------------------------------

  // Handle ship click (cannon fire)
  const handleShipClick = useCallback((ship: PirateShip) => {
    if (ship.firing || ship.isAnswered) return;

    // Update the state array to trigger the firing animation and prevent double-click
    setPirateShips(prev =>
      prev.map(s => s.id === ship.id ? { ...s, firing: true, isAnswered: true } : s)
    );
    // Also update the physics ref
    physicsShipsRef.current = physicsShipsRef.current.map(s => s.id === ship.id ? { ...s, firing: true, isAnswered: true } : s);


    createCannonBall(ship.x, ship.y);
    playSFX('gem');

    setTimeout(() => {
      if (ship.isCorrect) {
        onCorrectAnswer(currentWord);
        createExplosion(ship.x, ship.y, 'treasure');
      } else {
        onIncorrectAnswer();
        createExplosion(ship.x, ship.y, 'miss');
      }
      
      // Remove ship after effects using state (which triggers AnimatePresence exit)
      setTimeout(() => {
        setPirateShips(prev => prev.filter(s => s.id !== ship.id));
        physicsShipsRef.current = physicsShipsRef.current.filter(s => s.id !== ship.id); // Cleanup ref
      }, 500);
    }, 300);
  }, [currentWord, onCorrectAnswer, onIncorrectAnswer, playSFX]);


  // Cannon ball animation (still uses state, but is low frequency/short duration)
  const createCannonBall = useCallback((targetX: number, targetY: number) => {
    const cannonBall: CannonBall = {
      id: `cannonball-${Date.now()}`,
      startX: window.innerWidth / 2,
      startY: window.innerHeight - 100,
      targetX,
      targetY,
      progress: 0
    };

    setCannonBalls(prev => [...prev, cannonBall]);

    const animateCannonBall = (timestamp: number) => {
        const duration = 300; // ms
        const startTime = cannonBall.spawnTime || performance.now();
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        setCannonBalls(prev => 
            prev.map(ball => 
                ball.id === cannonBall.id 
                    ? { ...ball, progress: progress, spawnTime: startTime }
                    : ball
            )
        );

        if (progress < 1) {
            requestAnimationFrame(animateCannonBall);
        } else {
            // Remove cannon ball when it reaches target
            setTimeout(() => {
                setCannonBalls(prev => prev.filter(b => b.id !== cannonBall.id));
            }, 100);
        }
    };
    
    // Use a reference time to ensure consistent duration
    cannonBall.spawnTime = performance.now(); 
    requestAnimationFrame(animateCannonBall);

  }, []);

  // Explosion effect
  const createExplosion = useCallback((x: number, y: number, type: 'treasure' | 'miss') => {
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
  }, []);

  // --------------------------------------------------------
  // ⚓ Lifecycle and RAF Loop
  // --------------------------------------------------------

  // UseLayoutEffect for the animation loop (runs before browser paint)
  useLayoutEffect(() => {
    const animate = () => {
      try {
        if (gameActive && !isPaused) {
          updateShips();
        }
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error in Pirate Adventure Engine:', error);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (gameActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [gameActive, isPaused, updateShips]);

  // Spawn ships when current word changes (uses standard useEffect)
  useEffect(() => {
    if (currentWord && gameActive) {
      spawnPirateShips();
    }
  }, [currentWord, gameActive, spawnPirateShips]);

  // --------------------------------------------------------
  // 🏴‍☠️ Render
  // --------------------------------------------------------

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
            // 💡 Use the Ref Setter Callback
            ref={(element) => setRef(element, ship.id)} 
            
            // 💡 CRITICAL: Remove x and y from initial/animate
            initial={{ opacity: 0, scale: 0 }} 
            animate={{
              opacity: ship.isAnswered ? 0 : 1,
              scale: ship.isAnswered ? 0 : ship.size,
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handleShipClick(ship)}
            className={`absolute cursor-pointer select-none ${ship.isAnswered ? 'pointer-events-none' : ''}`}
            // 💡 IMPORTANT: Remove ALL inline 'style' for position/transform
            // The position is now controlled by the Ref in updateShips.
          >
            <div className="relative">
              {/* Proper Pirate Ship Design (Simplified for brevity) */}
              <div className="relative">
                {/* Ship Hull */}
                <div className="relative bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-full border-2 border-amber-600 shadow-2xl"
                     style={{ width: '120px', height: '60px' }}>

                  {/* Ship Deck, Mast, Sail, etc. */}
                  {/* ... (kept ship design for visual continuity) ... */}

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

      {/* Cannon Balls (Still state-managed as they are transient FX) */}
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
      {/* ... (no changes here) ... */}
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