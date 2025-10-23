'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameVocabularyWord } from '../../../../../hooks/useGameVocabulary';

interface SpaceExplorerEngineProps {
  currentWord: GameVocabularyWord;
  vocabulary: GameVocabularyWord[];
  onCorrectAnswer: (word: GameVocabularyWord) => void;
  onIncorrectAnswer: () => void;
  isPaused: boolean;
  gameActive: boolean;
  difficulty: string;
}

interface SpaceComet {
  id: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  trailLength: number;
  glowIntensity: number;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  spawnTime: number;
  // Add a property to track if the comet has been 'answered'
  isAnswered: boolean;
}

export default function SpaceExplorerEngine({
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty
}: SpaceExplorerEngineProps) {
  const [spaceComets, setSpaceComets] = useState<SpaceComet[]>([]);
  const [starField, setStarField] = useState<any[]>([]);
  const [cosmicParticles, setCosmicParticles] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null); // Corrected type here
  const animationRef = useRef<number>();

  // State to store actual screen dimensions dynamically
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  // Effect to update screen dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      }
    };

    updateDimensions(); // Set initial dimensions

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateDimensions);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateDimensions);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Initialize star field
  useEffect(() => {
    if (screenWidth > 0 && screenHeight > 0) { // Ensure screen dimensions are known
      const stars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * screenWidth,
        y: Math.random() * screenHeight,
        size: Math.random() * 3 + 1,
        twinkle: Math.random() * 2 + 1
      }));
      setStarField(stars);
    }
  }, [screenWidth, screenHeight]); // Re-initialize if screen size changes

  // Generate decoy translations
  const generateDecoys = useCallback((correctTranslation: string): string[] => {
    const otherWords = vocabulary
      .filter(word => word.translation !== correctTranslation)
      .map(word => word.translation);
    
    const decoyCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, decoyCount);
  }, [vocabulary, difficulty]); // Depend on vocabulary and difficulty

  // Enhanced collision detection for comets
  const checkCometCollisions = useCallback((comets: SpaceComet[]): SpaceComet[] => {
    if (screenWidth === 0 || screenHeight === 0) return comets; // Don't process until dimensions are known

    const minDistance = 180; // Minimum distance between comets (can be adjusted)
    const viewportPadding = 20; // How close to the edge comets are allowed to be pushed by collisions

    let adjustedComets = [...comets];
    let iterations = 0;
    const maxIterations = 10; // Increased iterations for more stable collision resolution

    do {
      let collidedInIteration = false;
      for (let i = 0; i < adjustedComets.length; i++) {
        for (let j = i + 1; j < adjustedComets.length; j++) {
          const comet1 = adjustedComets[i];
          const comet2 = adjustedComets[j];

          // Skip collision detection if either comet has been answered
          if (comet1.isAnswered || comet2.isAnswered) continue; 

          const distance = Math.sqrt(
            Math.pow(comet1.x - comet2.x, 2) + Math.pow(comet1.y - comet2.y, 2)
          );

          if (distance < minDistance) {
            collidedInIteration = true;

            const overlap = minDistance - distance;
            const angle = Math.atan2(comet1.y - comet2.y, comet1.x - comet2.x);

            // Push each comet away by half the overlap along the collision axis
            const pushX = Math.cos(angle) * (overlap / 2);
            const pushY = Math.sin(angle) * (overlap / 2);

            // Apply push, then clamp immediately within the viewport + a small margin
            adjustedComets[i] = {
              ...comet1,
              x: Math.max(viewportPadding, Math.min(screenWidth - viewportPadding, comet1.x + pushX)),
              y: Math.max(viewportPadding, Math.min(screenHeight - viewportPadding, comet1.y + pushY))
            };
            adjustedComets[j] = {
              ...comet2,
              x: Math.max(viewportPadding, Math.min(screenWidth - viewportPadding, comet2.x - pushX)),
              y: Math.max(viewportPadding, Math.min(screenHeight - viewportPadding, comet2.y - pushY))
            };
          }
        }
      }
      iterations++;
      if (!collidedInIteration) break; // If no collisions in an iteration, we're done
    } while (iterations < maxIterations);

    // Final clamp to ensure they stay within a reasonable visible range after all pushes
    return adjustedComets.map(comet => ({
      ...comet,
      x: Math.max(-viewportPadding, Math.min(screenWidth + viewportPadding, comet.x)),
      y: Math.max(-viewportPadding, Math.min(screenHeight + viewportPadding, comet.y))
    }));
  }, [screenWidth, screenHeight]); // Depend on screen dimensions

  // Create cosmic explosion effect (MOVED THIS UP)
  const createCosmicExplosion = useCallback((x: number, y: number, type: 'success' | 'error') => {
    const particleCount = type === 'success' ? 20 : 10;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: `cosmic-particle-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 25,
      vy: (Math.random() - 0.5) * 25,
      life: 1,
      color: type === 'success' ? '#8B5CF6' : '#EF4444',
      size: Math.random() * 12 + 4,
      type
    }));

    setCosmicParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setCosmicParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2000);
  }, []);

  // Handle comet click (NOW createCosmicExplosion IS DEFINED)
  const handleCometClick = useCallback((comet: SpaceComet) => {
    // Only process if the comet hasn't been answered yet
    if (comet.isAnswered) return; 

    setSpaceComets(prev => 
        prev.map(c => c.id === comet.id ? { ...c, isAnswered: true } : c)
    );

    if (comet.isCorrect) {
      onCorrectAnswer(currentWord);
      createCosmicExplosion(comet.x, comet.y, 'success');
    } else {
      onIncorrectAnswer();
      createCosmicExplosion(comet.x, comet.y, 'error');
    }

    // Remove clicked comet AFTER particles/effects are created
    // This delay allows exit animation to play
    setTimeout(() => {
        setSpaceComets(prev => prev.filter(c => c.id !== comet.id));
    }, 500); // Small delay to allow particle animation to start
  }, [onCorrectAnswer, onIncorrectAnswer, currentWord, createCosmicExplosion]); // Dependency array is correct

  // Spawn space comets with enhanced positioning
  const spawnSpaceComets = useCallback(() => {
    if (!currentWord || isPaused || !gameActive || screenWidth === 0 || screenHeight === 0) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const newComets: SpaceComet[] = [];
    const minSpawnDistance = 350; // Increased from 250 for more initial separation

    shuffledOptions.forEach((translation, index) => {
      // Initialize startX and startY to a default numerical value
      let startX: number = 0; 
      let startY: number = 0;
      let validPositionFound = false;
      let attempts = 0;

      // Define entry points slightly outside the screen, always aiming inwards
      // We'll choose a side (top, right, bottom, left) and a random point along that side
      // Then ensure the initial velocity points roughly towards the screen center.

      const entryBuffer = 100; // How far off-screen they start
      const targetCenterX = screenWidth / 2; // Not used directly in loop, but conceptual
      const targetCenterY = screenHeight / 2; // Not used directly in loop, but conceptual

      while (!validPositionFound && attempts < 100) { // Limit attempts to avoid infinite loops
        const entrySide = Math.floor(Math.random() * 4); // 0: Top, 1: Right, 2: Bottom, 3: Left

        switch (entrySide) {
          case 0: // Top edge
            startX = Math.random() * screenWidth;
            startY = -entryBuffer;
            break;
          case 1: // Right edge
            startX = screenWidth + entryBuffer;
            startY = Math.random() * screenHeight;
            break;
          case 2: // Bottom edge
            startX = Math.random() * screenWidth;
            startY = screenHeight + entryBuffer;
            break;
          case 3: // Left edge
            startX = -entryBuffer;
            startY = Math.random() * screenHeight;
            break;
        }

        // Check distance from existing new comets
        let tooClose = false;
        for (const existingComet of newComets) {
          const distance = Math.sqrt(Math.pow(startX - existingComet.x, 2) + Math.pow(startY - existingComet.y, 2));
          if (distance < minSpawnDistance) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          validPositionFound = true;
        }
        attempts++;
      }

      // If a valid position isn't found after many attempts, just place it randomly
      if (!validPositionFound) {
        // Ensure startX and startY are assigned even if validPositionFound remains false
        startX = Math.random() * screenWidth;
        startY = -entryBuffer; // Default to top if all attempts fail
        console.warn('Could not find non-overlapping spawn position for comet. Defaulting.');
      }

      // Determine initial velocity to move towards the center-ish area
      const targetX = (screenWidth * 0.2) + (Math.random() * (screenWidth * 0.6)); // Aim for 20%-80% width
      const targetY = (screenHeight * 0.2) + (Math.random() * (screenHeight * 0.6)); // Aim for 20%-80% height
      
      const angleToTarget = Math.atan2(targetY - startY, targetX - startX);
      const baseSpeed = difficulty === 'beginner' ? 1.0 : difficulty === 'intermediate' ? 1.5 : 2.0;
      const speed = baseSpeed + (Math.random() * 0.5); // Add slight variation

      const velocityX = Math.cos(angleToTarget) * speed;
      const velocityY = Math.sin(angleToTarget) * speed;

      newComets.push({
        id: `comet-${currentWord.id}-${index}-${Date.now()}`,
        translation,
        isCorrect: translation === currentWord.translation,
        x: startX,
        y: startY,
        speed,
        trailLength: Math.random() * 30 + 40,
        glowIntensity: Math.random() * 0.3 + 0.7,
        size: Math.random() * 0.2 + 0.9,
        rotation: Math.random() * 360,
        velocityX,
        velocityY,
        spawnTime: Date.now(),
        isAnswered: false // Initialize as not answered
      });
    });

    setSpaceComets(checkCometCollisions(newComets));
  }, [currentWord, isPaused, gameActive, screenWidth, screenHeight, generateDecoys, checkCometCollisions, difficulty]);

  // Update comet positions (NO LONGER FILTERING BY POSITION HERE)
  const updateComets = useCallback(() => {
    if (isPaused || !gameActive || screenWidth === 0 || screenHeight === 0) return;

    setSpaceComets(prev => {
      // We no longer filter by position here. Comets will persist until answered.
      const updatedComets = prev.map(comet => ({
        ...comet,
        x: comet.x + comet.velocityX,
        y: comet.y + comet.velocityY,
        glowIntensity: Math.sin(Date.now() * 0.005 + comet.x * 0.005) * 0.3 + 0.7,
        rotation: comet.rotation + 0.5
      }));

      // Apply collision detection to moving comets (excluding already answered ones)
      return checkCometCollisions(updatedComets);
    });
  }, [isPaused, gameActive, screenWidth, screenHeight, checkCometCollisions]);

  // Animation loop with error handling
  useEffect(() => {
    const animate = () => {
      try {
        if (gameActive && !isPaused) {
          updateComets();
        }
        animationRef.current = requestAnimationFrame(animate); // CORRECTED TYPO
      } catch (error) {
        console.error('Animation error in Space Explorer Engine:', error);
        // Continue animation even if there's an error
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
  }, [gameActive, isPaused, updateComets]);

  // Spawn comets when current word changes (and screen dimensions are known)
  useEffect(() => {
    if (currentWord && gameActive && screenWidth > 0 && screenHeight > 0) { // Only spawn if dimensions are known
      spawnSpaceComets();
    }
  }, [currentWord, gameActive, screenWidth, screenHeight, spawnSpaceComets]);

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
          <source src="/games/noughts-and-crosses/images/space-explorer/space-explorer-bg.mp4" type="video/mp4" />
        </video>

        {/* Video overlay gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Star Field Overlay */}
      <div className="absolute inset-0">
        {starField.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: star.twinkle,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Nebula Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Space Comets */}
      <AnimatePresence>
        {spaceComets.map((comet) => (
          <motion.div
            key={comet.id}
            initial={{ opacity: 0, scale: 0, x: comet.x, y: comet.y, rotate: comet.rotation }}
            animate={{
              opacity: comet.isAnswered ? 0 : 1, // Fade out if answered
              scale: comet.isAnswered ? 0 : comet.size, // Shrink if answered
              x: comet.x,
              y: comet.y,
              rotate: comet.rotation
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handleCometClick(comet)}
            // Disable pointer events if already answered, to prevent multiple clicks
            className={`absolute cursor-pointer hover:scale-110 select-none ${comet.isAnswered ? 'pointer-events-none' : ''}`}
            style={{ x: comet.x, y: comet.y }} // Explicitly setting for Framer Motion
          >
            <div className="relative">
              {/* Realistic Comet Design */}
              <div className="relative">
                {/* Comet Trail - More realistic tapered design */}
                <div
                  className="absolute opacity-90"
                  style={{
                    width: `${comet.trailLength}px`,
                    height: '20px',
                    left: `-${comet.trailLength}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(147, 197, 253, 0.8) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.9) 80%, transparent 100%)',
                    borderRadius: '50% 0 0 50%',
                    filter: 'blur(1px)',
                    clipPath: 'polygon(0% 30%, 70% 20%, 100% 50%, 70% 80%, 0% 70%)'
                  }}
                />

                {/* Secondary Dust Trail */}
                <div
                  className="absolute opacity-60"
                  style={{
                    width: `${comet.trailLength * 0.8}px`,
                    height: '12px',
                    left: `-${comet.trailLength * 0.8}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.4) 30%, rgba(6, 182, 212, 0.5) 70%, transparent 100%)',
                    borderRadius: '50% 0 0 50%',
                    filter: 'blur(2px)',
                    clipPath: 'polygon(0% 40%, 60% 30%, 100% 50%, 60% 70%, 0% 60%)'
                  }}
                />

                {/* Comet Nucleus */}
                <div className="relative w-12 h-12">
                  {/* Main Nucleus */}
                  <div className="absolute inset-0 bg-gradient-radial from-yellow-100 via-orange-200 to-red-400 rounded-full shadow-2xl">
                    {/* Rocky Surface Texture */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 rounded-full"></div>
                    {/* Bright Core */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-radial from-white to-yellow-200 rounded-full"></div>
                  </div>

                  {/* Comet Atmosphere/Glow */}
                  <div
                    className="absolute inset-0 bg-gradient-radial from-cyan-200/60 via-blue-300/40 to-purple-400/20 rounded-full blur-md"
                    style={{
                      opacity: comet.glowIntensity,
                      transform: 'scale(1.8)'
                    }}
                  />
                </div>

                {/* Ice Particles Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/80 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: Math.random() * 0.8 + 0.2
                      }}
                    />
                  ))}
                </div>

                {/* Vocabulary Text - Counter-rotated to stay upright */}
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-gray-900/95 text-white px-3 py-1.5 rounded-lg border border-cyan-400/50 font-bold text-sm shadow-xl backdrop-blur-sm"
                  style={{ transform: `translateX(-50%) rotate(-${comet.rotation}deg)` }}
                >
                  {comet.translation}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Cosmic Particles */}
      <AnimatePresence>
        {cosmicParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              scale: 1,
              x: particle.x,
              y: particle.y
            }}
            animate={{ 
              opacity: 0, 
              scale: particle.type === 'success' ? 3 : 1.5,
              x: particle.x + particle.vx * 40,
              y: particle.y + particle.vy * 40
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute pointer-events-none rounded-full"
            style={{ 
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              boxShadow: `0 0 ${particle.size}px ${particle.color}`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}