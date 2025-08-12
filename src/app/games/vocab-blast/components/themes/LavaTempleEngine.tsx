'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  // Add a property to track if the tablet has been 'answered'
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
  const [templeTablets, setTempleTablets] = useState<TempleTablet[]>([]);
  const [lavaLevel, setLavaLevel] = useState(0);
  const [lavaParticles, setLavaParticles] = useState<any[]>([]);
  const [emberEffects, setEmberEffects] = useState<any[]>([]);
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

  // Enhanced collision detection for tablets
  const checkTabletCollisions = (tablets: TempleTablet[]): TempleTablet[] => {
    const minDistance = 140; // Minimum distance between tablets
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    return tablets.map((tablet, index) => {
      let adjustedX = tablet.x;
      let adjustedY = tablet.y;
      let collisionCount = 0;

      // Check against all other tablets
      tablets.forEach((otherTablet, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(tablet.x - otherTablet.x, 2) + Math.pow(tablet.y - otherTablet.y, 2)
          );

          if (distance < minDistance) {
            collisionCount++;
            // Move tablet away from collision
            const angle = Math.atan2(tablet.y - otherTablet.y, tablet.x - otherTablet.x);
            const pushDistance = minDistance + (collisionCount * 25);

            adjustedX = Math.max(100, Math.min(screenWidth - 100,
              otherTablet.x + Math.cos(angle) * pushDistance
            ));
            adjustedY = otherTablet.y + Math.sin(angle) * pushDistance;
          }
        }
      });

      return { ...tablet, x: adjustedX, y: adjustedY };
    });
  };

  // Spawn temple tablets with enhanced positioning
  const spawnTempleTablets = () => {
    if (!currentWord || isPaused || !gameActive) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const stoneTypes: ('granite' | 'marble' | 'obsidian')[] = ['granite', 'marble', 'obsidian'];
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    // Create tablets with enhanced collision detection
    const newTablets: TempleTablet[] = [];
    const columnWidth = (screenWidth - 200) / Math.max(shuffledOptions.length, 3);

    shuffledOptions.forEach((translation, index) => {
      // Use column-based positioning for better distribution
      const baseX = 100 + (index * columnWidth) + (Math.random() * 60 - 30);
      const baseY = -100 - (index * 120) - (Math.random() * 50);

      let position = { x: baseX, y: baseY };
      let attempts = 0;

      // Fine-tune position to avoid overlaps
      while (attempts < 40) {
        const overlapping = newTablets.some(tablet => {
          const distance = Math.sqrt(
            Math.pow(position.x - tablet.x, 2) + Math.pow(position.y - tablet.y, 2)
          );
          return distance < 140;
        });

        if (!overlapping) break;

        // Adjust position
        position.x = Math.max(100, Math.min(screenWidth - 100,
          baseX + (Math.random() * 100 - 50)
        ));
        position.y = baseY + (Math.random() * 80 - 40);
        attempts++;
      }

      newTablets.push({
        id: `tablet-${currentWord.id}-${index}-${Date.now()}`,
        translation,
        isCorrect: translation === currentWord.translation,
        x: position.x,
        y: position.y,
        speed: 0.6 + Math.random() * 0.4, // More consistent speed
        stoneType: stoneTypes[Math.floor(Math.random() * stoneTypes.length)],
        crackLevel: Math.random() * 0.2, // Start with less cracking
        lavaProximity: 0,
        size: Math.random() * 0.2 + 0.9, // More consistent sizing
        spawnTime: Date.now(),
        isAnswered: false // Initialize as not answered
      });
    });

    setTempleTablets(checkTabletCollisions(newTablets));
  };

  // Update tablet positions with collision avoidance
  const updateTablets = () => {
    if (isPaused || !gameActive) return;

    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;

    // Slowly increase lava level (slightly slower)
    setLavaLevel(prev => Math.min(prev + 0.15, screenHeight * 0.7));

    setTempleTablets(prev => {
      const updatedTablets = prev.map(tablet => {
        const newY = tablet.y + tablet.speed;
        const lavaProximity = Math.max(0, (screenHeight - lavaLevel - newY) / 200);

        return {
          ...tablet,
          y: newY,
          lavaProximity,
          crackLevel: Math.min(tablet.crackLevel + (lavaProximity * 0.008), 1) // Slower cracking
        };
      });

      // Apply collision detection to moving tablets
      return checkTabletCollisions(updatedTablets);
    });
  };

  // Handle tablet click
  const handleTabletClick = (tablet: TempleTablet) => {
    // Only process if the tablet hasn't been answered yet
    if (tablet.isAnswered) return;

    setTempleTablets(prev => 
        prev.map(t => t.id === tablet.id ? { ...t, isAnswered: true } : t)
    );

    if (tablet.isCorrect) {
      onCorrectAnswer(currentWord);
      createTempleExplosion(tablet.x, tablet.y, 'treasure');
      // Temporarily lower lava level as reward
      setLavaLevel(prev => Math.max(prev - 50, 0));
    } else {
      onIncorrectAnswer();
      createTempleExplosion(tablet.x, tablet.y, 'destruction');
      // Increase lava level as penalty
      setLavaLevel(prev => Math.min(prev + 30, window.innerHeight * 0.8));
    }

    // Remove clicked tablet AFTER particles/effects are created
    setTimeout(() => {
        setTempleTablets(prev => prev.filter(t => t.id !== tablet.id));
    }, 500); // Small delay to allow particle animation to start
  };

  // Create temple explosion effect
  const createTempleExplosion = (x: number, y: number, type: 'treasure' | 'destruction') => {
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
  };

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

  // Animation loop with error handling
  useEffect(() => {
    const animate = () => {
      try {
        if (gameActive && !isPaused) {
          updateTablets();

          // Update ember positions
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
  }, [gameActive, isPaused]);

  // Spawn tablets when current word changes
  useEffect(() => {
    if (currentWord && gameActive) {
      spawnTempleTablets();
    }
  }, [currentWord, gameActive]);

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
      {/* Video Background */}
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

      {/* Temple Pattern Overlay */}
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
            initial={{ opacity: 0, scale: 0, x: tablet.x, y: tablet.y }}
            animate={{
              opacity: tablet.isAnswered ? 0 : 1, // Fade out if answered
              scale: tablet.isAnswered ? 0 : tablet.size, // Shrink if answered
              x: tablet.x,
              y: tablet.y
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handleTabletClick(tablet)}
            className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none ${tablet.isAnswered ? 'pointer-events-none' : ''}`}
          >
            <div className="relative">
              {/* Realistic Stone/Rock Design */}
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

      {/* Lava Particles */}
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

      {/* Rising Lava */}
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-600 via-orange-500 to-red-400"
        style={{ height: lavaLevel }}
        animate={{
          background: [
            'linear-gradient(to top, #dc2626, #f97316, #dc2626)',
            'linear-gradient(to top, #f97316, #dc2626, #f97316)',
            'linear-gradient(to top, #dc2626, #f97316, #dc2626)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        {/* Lava surface bubbles */}
        <div className="absolute top-0 w-full h-8 overflow-hidden">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-yellow-400 rounded-full"
              style={{
                left: `${i * 10 + Math.random() * 5}%`,
                top: Math.random() * 20
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>


    </div>
  );
}
