'use client';

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameVocabularyWord } from '../../../../../hooks/useGameVocabulary';

interface LavaTempleEngineProps {
  currentWord: GameVocabularyWord;
  vocabulary: GameVocabularyWord[];
  onCorrectAnswer: (word: GameVocabularyWord) => void;
  onIncorrectAnswer: () => void;
  isPaused: boolean;
  gameActive: boolean;
  difficulty: string;
}

interface TempleTablet {
  id: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  stoneType: 'granite' | 'marble' | 'obsidian';
  crackLevel: number;
  lavaProximity: number;
  size: number;
  spawnTime: number;
  isAnswered: boolean;
}

export default function LavaTempleEngine({
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty
}: LavaTempleEngineProps) {
  // --------------------------------------------------------
  // 🌋 CORE FIX: Mutable Refs for Physics and DOM Elements
  // --------------------------------------------------------
  const [templeTablets, setTempleTablets] = useState<TempleTablet[]>([]);
  const [lavaParticles, setLavaParticles] = useState<any[]>([]);
  const [emberEffects, setEmberEffects] = useState<any[]>([]);
  
  // Ref to hold the mutable physics state (x, y, etc.)
  const physicsTabletsRef = useRef<TempleTablet[]>([]); 
  // Ref map to link tablet ID to its actual DOM element
  const objectRefsMap = useRef<Map<string, HTMLDivElement>>(new Map()); 
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Utility to set the ref and map it to the object ID
  const setRef = useCallback((element: HTMLDivElement | null, id: string) => {
    if (element) {
        objectRefsMap.current.set(id, element);
    } else {
        objectRefsMap.current.delete(id);
    }
  }, []);

  // --------------------------------------------------------
  // 🧱 Physics/Collision Logic
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

  // Enhanced collision detection for tablets
  const checkTabletCollisions = useCallback((tablets: TempleTablet[]): TempleTablet[] => {
    const minDistance = 140;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    let adjustedTablets = [...tablets];
    let iterations = 0;
    const maxIterations = 5;

    do {
        let collidedInIteration = false;
        // Collision resolution logic
        for (let i = 0; i < adjustedTablets.length; i++) {
            for (let j = i + 1; j < adjustedTablets.length; j++) {
                const tab1 = adjustedTablets[i];
                const tab2 = adjustedTablets[j];

                const distance = Math.sqrt(
                    Math.pow(tab1.x - tab2.x, 2) + Math.pow(tab1.y - tab2.y, 2)
                );

                if (distance < minDistance) {
                    collidedInIteration = true;
                    const overlap = minDistance - distance;
                    const angle = Math.atan2(tab1.y - tab2.y, tab1.x - tab2.x);
                    const pushDistance = overlap / 2;

                    adjustedTablets[i] = {
                        ...tab1,
                        x: tab1.x + Math.cos(angle) * pushDistance,
                        y: tab1.y + Math.sin(angle) * pushDistance
                    };
                    adjustedTablets[j] = {
                        ...tab2,
                        x: tab2.x - Math.cos(angle) * pushDistance,
                        y: tab2.y - Math.sin(angle) * pushDistance
                    };
                }
            }
        }
        iterations++;
        if (!collidedInIteration) break;
    } while (iterations < maxIterations);

    // Final boundary check
    return adjustedTablets.map(tablet => ({
        ...tablet,
        x: Math.max(100, Math.min(screenWidth - 100, tablet.x))
    }));
  }, []);


  // Spawn temple tablets with enhanced positioning
  const spawnTempleTablets = useCallback(() => {
    if (!currentWord || isPaused || !gameActive) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const stoneTypes: ('granite' | 'marble' | 'obsidian')[] = ['granite', 'marble', 'obsidian'];
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    const newTablets: TempleTablet[] = [];
    const columnWidth = (screenWidth - 200) / Math.max(shuffledOptions.length, 3);

    shuffledOptions.forEach((translation, index) => {
      const baseX = 100 + (index * columnWidth) + (Math.random() * 60 - 30);
      const baseY = -100 - (index * 120) - (Math.random() * 50);

      newTablets.push({
        id: `tablet-${currentWord.id}-${index}-${Date.now()}`,
        translation,
        isCorrect: translation === currentWord.translation,
        x: baseX,
        y: baseY,
        // 🚀 CRITICAL FIX: Increase speed
        speed: 1.2 + Math.random() * 0.5, 
        stoneType: stoneTypes[Math.floor(Math.random() * stoneTypes.length)],
        crackLevel: Math.random() * 0.2,
        lavaProximity: 0,
        size: Math.random() * 0.2 + 0.9,
        spawnTime: Date.now(),
        isAnswered: false
      });
    });

    const adjustedTablets = checkTabletCollisions(newTablets);
    
    setTempleTablets(adjustedTablets);
    physicsTabletsRef.current = adjustedTablets;
    
  }, [currentWord, isPaused, gameActive, generateDecoys, checkTabletCollisions]);

  // --------------------------------------------------------
  // 📉 updateTablets (Lava logic removed)
  // --------------------------------------------------------
  const updateTablets = useCallback(() => {
    if (isPaused || !gameActive) return;

    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    
    let tablets = physicsTabletsRef.current;
    let removedTabletIds: string[] = [];

    let updatedPhysicsTablets = tablets.map(tablet => {
        const newY = tablet.y + tablet.speed;
        
        const lavaProximity = 0.1; 
        
        // Check if tablet has fallen off the screen
        if (newY > screenHeight + 50) { 
            removedTabletIds.push(tablet.id);
        }

        return {
            ...tablet,
            y: newY,
            lavaProximity,
            crackLevel: Math.min(tablet.crackLevel + (lavaProximity * 0.008), 1)
        };
    });

    // 2. Apply collisions and update the physics ref
    let adjustedTablets = checkTabletCollisions(updatedPhysicsTablets);
    physicsTabletsRef.current = adjustedTablets.filter(t => !removedTabletIds.includes(t.id));

    // 3. DIRECT DOM WRITE: Apply position updates
    adjustedTablets.forEach(tablet => {
        const element = objectRefsMap.current.get(tablet.id);
        if (element && !removedTabletIds.includes(tablet.id)) {
            element.style.left = `${tablet.x}px`;
            element.style.top = `${tablet.y}px`;
        }
    });

    // 4. Update the state array ONLY for cleanup/removal (low frequency)
    if (removedTabletIds.length > 0) {
        setTempleTablets(prev => prev.filter(tablet => !removedTabletIds.includes(tablet.id)));
    }

  }, [isPaused, gameActive, checkTabletCollisions]);

  // --------------------------------------------------------
  // 💎 Game/FX Logic
  // --------------------------------------------------------

  // Handle tablet click (Lava level adjustments removed)
  const handleTabletClick = useCallback((tablet: TempleTablet) => {
    if (tablet.isAnswered) return;
    
    setTempleTablets(prev => 
        prev.map(t => t.id === tablet.id ? { ...t, isAnswered: true } : t)
    );
    physicsTabletsRef.current = physicsTabletsRef.current.map(t => t.id === tablet.id ? { ...t, isAnswered: true } : t);


    if (tablet.isCorrect) {
      onCorrectAnswer(currentWord);
      createTempleExplosion(tablet.x, tablet.y, 'treasure');
    } else {
      onIncorrectAnswer();
      createTempleExplosion(tablet.x, tablet.y, 'destruction');
    }

    setTimeout(() => {
        setTempleTablets(prev => prev.filter(t => t.id !== tablet.id));
        physicsTabletsRef.current = physicsTabletsRef.current.filter(t => t.id !== tablet.id);
    }, 500);
  }, [currentWord, onCorrectAnswer, onIncorrectAnswer]);

  // Create temple explosion effect
  const createTempleExplosion = useCallback((x: number, y: number, type: 'treasure' | 'destruction') => {
    const particleCount = type === 'treasure' ? 15 : 8;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: `temple-particle-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      life: 1,
      color: type === 'treasure' ? '#F59E0B' : '#EF4444',
      size: Math.random() * 10 + 5,
      type
    }));

    setLavaParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setLavaParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1800);
  }, []);

  // Create floating embers
  useEffect(() => {
    const createEmbers = () => {
        if (!gameActive || isPaused) return;

        const newEmbers = Array.from({ length: 3 }, (_, i) => ({
            id: `ember-${Date.now()}-${i}`,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            life: 1,
            size: Math.random() * 4 + 2
        }));

        setEmberEffects(prev => [...prev.slice(-20), ...newEmbers]);
    };
    
    const emberInterval = setInterval(createEmbers, 500);
    return () => clearInterval(emberInterval);
  }, [gameActive, isPaused]);

  // --------------------------------------------------------
  // ⏳ Lifecycle and RAF Loop
  // --------------------------------------------------------

  // UseLayoutEffect for the animation loop (runs before browser paint)
  useLayoutEffect(() => {
    const animate = () => {
      try {
        if (gameActive && !isPaused) {
          updateTablets();
          
          // Update ember positions inside the main RAF loop for better sync
          setEmberEffects(prev =>
              prev.map(ember => ({
                  ...ember,
                  x: ember.x + ember.vx,
                  y: ember.y + ember.vy,
                  life: ember.life - 0.01
              })).filter(ember => ember.life > 0 && ember.y > -50)
          );
        }
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error in Lava Temple Engine:', error);
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
  }, [gameActive, isPaused, updateTablets]);

  // Spawn tablets when current word changes (uses standard useEffect)
  useEffect(() => {
    if (currentWord && gameActive) {
      spawnTempleTablets();
    }
  }, [currentWord, gameActive, spawnTempleTablets]);

  const getStoneColor = (stoneType: string) => {
    switch (stoneType) {
      case 'granite': return 'from-gray-600 to-gray-800';
      case 'marble': return 'from-gray-300 to-gray-500';
      case 'obsidian': return 'from-gray-900 to-black';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Background/Overlay unchanged */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.1)_75%),linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.1)_75%)] bg-[size:20px_20px] bg-[position:0_0,10px_10px] opacity-30"></div>
      </div>

      {/* Floating Embers */}
      <AnimatePresence>
        {emberEffects.map((ember) => (
          <motion.div
            key={ember.id}
            className="absolute bg-orange-400 rounded-full"
            style={{
              left: ember.x,
              top: ember.y,
              width: ember.size,
              height: ember.size,
              opacity: ember.life,
              boxShadow: `0 0 ${ember.size * 2}px #F97316`
            }}
            animate={{
              scale: [1, 1.2, 0.8, 1],
              opacity: [ember.life, ember.life * 0.8, ember.life]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        ))}
      </AnimatePresence>

      {/* Temple Tablets */}
      <AnimatePresence>
        {templeTablets.map((tablet) => (
          <motion.div
            key={tablet.id}
            // 💡 Use the Ref Setter Callback
            ref={(element) => setRef(element, tablet.id)}

            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: tablet.isAnswered ? 0 : 1,
              scale: tablet.isAnswered ? 0 : tablet.size,
            }}
            exit={{ opacity: 0, scale: 0 }}

            // 🚀 CRITICAL FIX: Use onPointerDown for moving elements
            onPointerDown={() => handleTabletClick(tablet)}

            className={`absolute cursor-pointer hover:scale-110 select-none ${tablet.isAnswered ? 'pointer-events-none' : ''}`}

            // 🚀 CRITICAL FIX: Pin the element's INITIAL position using top/left
            // and set the scale. The RAF loop will now overwrite the transform.
            style={{
                left: `${tablet.x}px`,
                top: `${tablet.y}px`,
                scale: tablet.size // Use the style object for scale
            }}
          >
            <div className="relative">
              {/* Stone/Rock Design */}
              <div className="relative">
                {/* Lava Glow Effect */}
                {tablet.lavaProximity > 0.3 && (
                  <div
                    className="absolute inset-0 bg-red-500 rounded-lg blur-xl"
                    style={{ opacity: tablet.lavaProximity * 0.6 }}
                  />
                )}

                {/* Stone Rock */}
                <div className={`relative ${getStoneColor(tablet.stoneType)} rounded-lg shadow-2xl border-2 border-gray-600`}
                     style={{ width: '100px', height: '80px' }}>

                  {/* Rock Texture */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-transparent rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-gray-700/20 to-transparent rounded-lg"></div>

                  {/* Rock Surface Details */}
                  <div className="absolute top-2 left-2 w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
                  <div className="absolute top-4 right-3 w-1 h-1 bg-gray-700 rounded-full opacity-80"></div>
                  <div className="absolute bottom-3 left-4 w-1.5 h-1.5 bg-gray-500 rounded-full opacity-70"></div>

                  {/* Cracks */}
                  {tablet.crackLevel > 0.3 && (
                    <>
                      <div className="absolute top-1/4 left-0 w-full h-0.5 bg-red-800/60 transform rotate-12"></div>
                      <div className="absolute top-1/2 left-1/4 w-3/4 h-0.5 bg-red-700/50 transform -rotate-6"></div>
                    </>
                  )}

                  {/* Severe Cracks */}
                  {tablet.crackLevel > 0.7 && (
                    <>
                      <div className="absolute top-3/4 left-0 w-full h-0.5 bg-red-600/70 transform rotate-6"></div>
                      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-red-700/60 transform rotate-3"></div>
                    </>
                  )}

                  {/* Molten Edges */}
                  {tablet.lavaProximity > 0.5 && (
                    <div className="absolute inset-0 rounded-lg border-2 border-orange-500/60 animate-pulse"></div>
                  )}
                </div>

                {/* Vocabulary Text on Stone */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/90 text-orange-200 px-2 py-1 rounded text-xs font-bold shadow-lg border border-orange-400/50">
                  {tablet.translation}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Lava Particles (Explosions) */}
      <AnimatePresence>
        {lavaParticles.map((particle) => (
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
              scale: particle.type === 'treasure' ? 2.5 : 1.5,
              x: particle.x + particle.vx * 35,
              y: particle.y + particle.vy * 35
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
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