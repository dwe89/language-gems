'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Initialize star field
  useEffect(() => {
    const stars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      twinkle: Math.random() * 2 + 1
    }));
    setStarField(stars);
  }, []);

  // Generate decoy translations
  const generateDecoys = (correctTranslation: string): string[] => {
    const otherWords = vocabulary
      .filter(word => word.translation !== correctTranslation)
      .map(word => word.translation);
    
    const decoyCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, decoyCount);
  };

  // Spawn space comets with diagonal movement
  const spawnSpaceComets = () => {
    if (!currentWord || isPaused || !gameActive) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Create comets with collision detection
    const newComets: SpaceComet[] = [];

    shuffledOptions.forEach((translation, index) => {
      // Random diagonal angles (45-135 degrees and 225-315 degrees)
      const angle = Math.random() > 0.5
        ? (Math.PI / 4) + (Math.random() * Math.PI / 2)  // 45-135 degrees
        : (5 * Math.PI / 4) + (Math.random() * Math.PI / 2); // 225-315 degrees

      const speed = 2.5 + Math.random() * 1.5; // Faster speed as requested
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;

      // Find non-overlapping starting position
      let startX, startY;
      let attempts = 0;

      do {
        if (Math.random() > 0.5) {
          startX = Math.random() > 0.5 ? -100 : screenWidth + 100;
          startY = Math.random() * screenHeight;
        } else {
          startX = Math.random() * screenWidth;
          startY = Math.random() > 0.5 ? -100 : screenHeight + 100;
        }
        attempts++;
      } while (
        attempts < 30 &&
        newComets.some(comet => {
          const distance = Math.sqrt(Math.pow(startX - comet.x, 2) + Math.pow(startY - comet.y, 2));
          return distance < 150; // Minimum distance between comets
        })
      );

      newComets.push({
        id: `comet-${currentWord.id}-${index}-${Date.now()}`,
        translation,
        isCorrect: translation === currentWord.translation,
        x: startX,
        y: startY,
        speed,
        trailLength: Math.random() * 50 + 30,
        glowIntensity: Math.random() * 0.5 + 0.5,
        size: Math.random() * 0.3 + 0.8,
        rotation: Math.random() * 360,
        velocityX,
        velocityY,
        spawnTime: Date.now()
      });
    });

    setSpaceComets(newComets);
  };

  // Update comet positions with diagonal movement
  const updateComets = () => {
    if (isPaused || !gameActive) return;

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    setSpaceComets(prev =>
      prev.map(comet => ({
        ...comet,
        x: comet.x + comet.velocityX,
        y: comet.y + comet.velocityY,
        glowIntensity: Math.sin(Date.now() * 0.01 + comet.x * 0.01) * 0.3 + 0.7
      })).filter(comet => {
        // Remove comets only after 10 seconds timeout
        const timeElapsed = Date.now() - comet.spawnTime;
        if (timeElapsed > 10000) {
          // Trigger wrong answer for timeout
          if (comet.isCorrect) {
            setTimeout(() => onIncorrectAnswer(), 0);
          }
          return false;
        }
        return true;
      })
    );
  };

  // Handle comet click
  const handleCometClick = (comet: SpaceComet) => {
    if (comet.isCorrect) {
      onCorrectAnswer(currentWord);
      createCosmicExplosion(comet.x, comet.y, 'success');
    } else {
      onIncorrectAnswer();
      createCosmicExplosion(comet.x, comet.y, 'error');
    }

    // Remove clicked comet
    setSpaceComets(prev => prev.filter(c => c.id !== comet.id));
  };

  // Create cosmic explosion effect
  const createCosmicExplosion = (x: number, y: number, type: 'success' | 'error') => {
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
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateComets();
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
  }, [gameActive, isPaused]);

  // Spawn comets when current word changes
  useEffect(() => {
    if (currentWord && gameActive) {
      spawnSpaceComets();
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
              opacity: 1,
              scale: comet.size,
              x: comet.x,
              y: comet.y,
              rotate: comet.rotation
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handleCometClick(comet)}
            className="absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none"
          >
            <div className="relative">
              {/* Realistic Comet Design */}
              <div className="relative">
                {/* Comet Trail */}
                <div
                  className="absolute bg-gradient-to-r from-transparent via-blue-300 to-white opacity-80 blur-sm"
                  style={{
                    width: `${comet.trailLength}px`,
                    height: '3px',
                    left: `-${comet.trailLength}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(147, 197, 253, 0.6) 30%, rgba(255, 255, 255, 0.9) 100%)'
                  }}
                />

                {/* Secondary Trail */}
                <div
                  className="absolute bg-gradient-to-r from-transparent via-purple-300 to-cyan-200 opacity-60 blur-md"
                  style={{
                    width: `${comet.trailLength * 0.7}px`,
                    height: '6px',
                    left: `-${comet.trailLength * 0.7}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />

                {/* Comet Head */}
                <div className="relative w-16 h-16 bg-gradient-radial from-white via-blue-200 to-purple-400 rounded-full shadow-2xl">
                  {/* Inner Core */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-radial from-white to-blue-100 rounded-full"></div>

                  {/* Glow Effect */}
                  <div
                    className="absolute inset-0 bg-blue-300 rounded-full blur-lg opacity-70"
                    style={{ opacity: comet.glowIntensity }}
                  />
                </div>

                {/* Vocabulary Text - Counter-rotated to stay upright */}
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900/90 text-white px-3 py-1 rounded-lg border border-blue-400 font-bold text-sm shadow-lg backdrop-blur-sm"
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

      {/* Space Station (player) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
          className="text-6xl"
        >
          🛸
        </motion.div>
        <div className="text-center text-purple-200 font-bold text-sm mt-2">Space Station</div>
      </div>
    </div>
  );
}
