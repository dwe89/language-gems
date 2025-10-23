'use client';

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameVocabularyWord } from '../../../../hooks/useGameVocabulary';
import TokyoNightsEngine from './themes/TokyoNightsEngine';
import PirateAdventureEngine from './themes/PirateAdventureEngine';
import SpaceExplorerEngine from './themes/SpaceExplorerEngine';
import LavaTempleEngine from './themes/LavaTempleEngine';

interface VocabBlastEngineProps {
  theme: string;
  currentWord: GameVocabularyWord;
  vocabulary: GameVocabularyWord[];
  onCorrectAnswer: (word: GameVocabularyWord) => void;
  onIncorrectAnswer: () => void;
  isPaused: boolean;
  gameActive: boolean;
  difficulty: string;
  playSFX: (sound: string) => void;
}

interface VocabObject {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  scale: number;
}

export default function VocabBlastEngine({
  theme,
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty,
  playSFX
}: VocabBlastEngineProps) {

  // Route to theme-specific engines
  const commonProps = {
    currentWord,
    vocabulary,
    onCorrectAnswer,
    onIncorrectAnswer,
    isPaused,
    gameActive,
    difficulty,
    playSFX
  };

  switch (theme) {
    case 'tokyo':
      return <TokyoNightsEngine {...commonProps} />;
    case 'pirate':
      return <PirateAdventureEngine {...commonProps} />;
    case 'space':
      return <SpaceExplorerEngine {...commonProps} />;
    case 'temple':
      return <LavaTempleEngine {...commonProps} />;
    default:
      return <DefaultEngine {...commonProps} />;
  }
}

// Default engine for themes not yet implemented
function DefaultEngine({
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty
}: Omit<VocabBlastEngineProps, 'theme'>) {
  const [vocabObjects, setVocabObjects] = useState<VocabObject[]>([]);
  const [particles, setParticles] = useState<any[]>([]);
  const [starPositions, setStarPositions] = useState<Array<{left: string, top: string}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [screenWidth, setScreenWidth] = useState(0); // State to store screen width
  const [screenHeight, setScreenHeight] = useState(0); // State to store screen height

  // Generate star positions once on mount
  useEffect(() => {
    const positions = Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
    setStarPositions(positions);
  }, []);
  
  // Refs for decoupled physics and DOM manipulation
  const physicsObjectsRef = useRef<VocabObject[]>([]);
  const objectRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

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

  // Generate decoy words
  const generateDecoys = useCallback((correctTranslation: string): string[] => {
    const otherWords = vocabulary
      .filter(word => word.translation !== correctTranslation)
      .map(word => word.translation);

    // Shuffle and take 3-5 decoys based on difficulty
    const decoyCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, decoyCount);
  }, [vocabulary, difficulty]); // Depend on vocabulary and difficulty

  // Enhanced collision detection for vocab objects
  const checkObjectCollisions = useCallback((objects: VocabObject[]): VocabObject[] => {
    if (screenWidth === 0) return objects; // Don't process until screenWidth is known

    const minDistance = 180; // Increased minimum distance to give more room
    const padding = 50; // Padding from screen edges

    let adjustedObjects = [...objects];
    let iterations = 0;
    const maxIterations = 5; // Prevent infinite loops

    do {
      let collidedInIteration = false;
      for (let i = 0; i < adjustedObjects.length; i++) {
        for (let j = i + 1; j < adjustedObjects.length; j++) {
          const obj1 = adjustedObjects[i];
          const obj2 = adjustedObjects[j];

          const distance = Math.sqrt(
            Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
          );

          if (distance < minDistance) {
            collidedInIteration = true;

            // Calculate overlap
            const overlap = minDistance - distance;

            // Determine push direction (prioritize horizontal separation)
            const angle = Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x);
            const dx = Math.cos(angle) * (overlap / 2);
            const dy = Math.sin(angle) * (overlap / 2);

            // Apply half the push to each object to separate them
            adjustedObjects[i] = {
              ...obj1,
              x: Math.max(padding, Math.min(screenWidth - padding, obj1.x + dx)),
              y: obj1.y + dy // Let Y movement continue, mainly focus on X for initial spread
            };
            adjustedObjects[j] = {
              ...obj2,
              x: Math.max(padding, Math.min(screenWidth - padding, obj2.x - dx)),
              y: obj2.y - dy
            };
          }
        }
      }
      iterations++;
      if (!collidedInIteration) break; // If no collisions in an iteration, we're done
    } while (iterations < maxIterations);

    // Final boundary check after all collision adjustments
    return adjustedObjects.map(obj => ({
      ...obj,
      x: Math.max(padding, Math.min(screenWidth - padding, obj.x)),
      y: Math.max(-100, Math.min(screenHeight + 100, obj.y)) // Ensure it's not too high up either
    }));
  }, [screenWidth, screenHeight]); // Depend on screenWidth for accurate calculations

  // Spawn new vocab objects with enhanced positioning
  const spawnVocabObjects = useCallback(() => {
    if (!currentWord || isPaused || !gameActive || screenWidth === 0) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const padding = 100; // Consistent padding from the sides
    const usableWidth = screenWidth - (padding * 2);
    const columnWidth = usableWidth / shuffledOptions.length;

    const newObjects: VocabObject[] = shuffledOptions.map((translation, index) => {
      // Use column-based positioning for better distribution
      const baseX = padding + (index * columnWidth) + (columnWidth / 2); // Center in column
      const finalX = Math.max(padding, Math.min(screenWidth - padding, baseX + (Math.random() * 40 - 20))); // Smaller random offset

      return {
        id: `${currentWord.id}-${index}-${Date.now()}`,
        word: currentWord.word,
        translation,
        isCorrect: translation === currentWord.translation,
        x: finalX,
        y: -100 - (Math.random() * 50), // Slight vertical stagger, starting off-screen
        speed: difficulty === 'beginner' ? 0.8 : difficulty === 'intermediate' ? 1.2 : 1.6,
        rotation: Math.random() * 360,
        scale: 1
      };
    });

    const collisionAdjusted = checkObjectCollisions(newObjects);
    setVocabObjects(collisionAdjusted);
    physicsObjectsRef.current = collisionAdjusted;
  }, [currentWord, isPaused, gameActive, screenWidth, generateDecoys, checkObjectCollisions, difficulty]);

  // Callback ref function to manage the DOM elements map
  const setRef = useCallback((element: HTMLDivElement | null, id: string) => {
    if (element) {
      objectRefsMap.current.set(id, element);
    } else {
      objectRefsMap.current.delete(id);
    }
  }, []);

  // Update object positions with collision avoidance
  const updateObjects = useCallback(() => {
    if (isPaused || !gameActive || screenHeight === 0) return;

    // Use the mutable ref for physics calculations
    let livingObjects = physicsObjectsRef.current.filter(obj => obj.y < (screenHeight + 100));

    let updatedObjects = livingObjects.map(obj => ({
      ...obj,
      y: obj.y + obj.speed,
      rotation: obj.rotation + 1
    }));
    
    let adjustedObjects = checkObjectCollisions(updatedObjects);

    // Update the mutable ref for the next frame
    physicsObjectsRef.current = adjustedObjects;
    
    // Apply transform directly to DOM using the refs map
    adjustedObjects.forEach(obj => {
      const element = objectRefsMap.current.get(obj.id);
      if (element) {
        element.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) rotate(${obj.rotation}deg)`;
      }
    });

    // Update state only when objects are removed (for React to re-render with correct count)
    if (adjustedObjects.length !== vocabObjects.length) {
      setVocabObjects(adjustedObjects);
    }
  }, [isPaused, gameActive, screenHeight, checkObjectCollisions, vocabObjects.length]);

  // Handle object click
  const handleObjectClick = useCallback((obj: VocabObject) => {
    if (obj.isCorrect) {
      // ✅ CRITICAL FIX: Clear ALL objects when correct answer is clicked
      // This prevents the user from being forced to click wrong answers (old decoys)
      setVocabObjects([]);
      physicsObjectsRef.current = [];
      onCorrectAnswer(currentWord);
      // Create success particles
      createParticles(obj.x, obj.y, 'success');
    } else {
      onIncorrectAnswer();
      // Create error particles
      createParticles(obj.x, obj.y, 'error');
      // Only remove the clicked wrong object from both state and physics ref
      const filtered = physicsObjectsRef.current.filter(o => o.id !== obj.id);
      setVocabObjects(filtered);
      physicsObjectsRef.current = filtered;
    }
  }, [onCorrectAnswer, onIncorrectAnswer, currentWord]);

  // Create particle effects
  const createParticles = useCallback((x: number, y: number, type: 'success' | 'error') => {
    const particleCount = 10;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
      color: type === 'success' ? '#10B981' : '#EF4444',
      size: Math.random() * 6 + 2
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  }, []);

  // Animation loop with error handling
  useLayoutEffect(() => {
    const animate = () => {
      try {
        if (gameActive && !isPaused) {
          updateObjects();
        }
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error in Default Engine:', error);
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
  }, [gameActive, isPaused, updateObjects]); // Added updateObjects to dependencies

  // Spawn objects when current word changes (and screen dimensions are known)
  useEffect(() => {
    if (currentWord && gameActive && screenWidth > 0) { // Only spawn if screenWidth is known
      spawnVocabObjects();
    }
  }, [currentWord, gameActive, screenWidth, spawnVocabObjects]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {starPositions.map((position, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50"
            style={{
              left: position.left,
              top: position.top
            }}
          />
        ))}
      </div>

      {/* Vocab Objects */}
      <AnimatePresence>
        {vocabObjects.map((obj) => (
          <motion.div
            key={obj.id}
            ref={(element) => setRef(element, obj.id)}
            initial={{ 
              opacity: 0, 
              scale: 0
            }}
            animate={{
              opacity: 1,
              scale: obj.scale
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handleObjectClick(obj)}
            className="absolute cursor-pointer hover:scale-110 select-none bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-3 border-blue-300 shadow-2xl shadow-blue-400/80 rounded-xl px-6 py-3 font-bold backdrop-blur-sm bg-opacity-95"
            style={{
              transform: `translate3d(${obj.x}px, ${obj.y}px, 0) rotate(${obj.rotation}deg)`
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl drop-shadow-lg">💎</span>
              <span className="font-bold text-lg drop-shadow-md text-white">{obj.translation}</span>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-blue-200/50"></div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
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
              scale: 0,
              x: particle.x + particle.vx * 50,
              y: particle.y + particle.vy * 50
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}