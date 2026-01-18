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
  isMobile?: boolean;
}

interface VocabObject {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  scale: number;
  gemColorIndex: number;
  spawnDelay: number;
  isVisible: boolean;
  shimmerPhase: number;
}

interface Rocket {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  active: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'shard' | 'spark' | 'smoke';
}

// Gorgeous gem color palette
const GEM_COLORS = [
  {
    name: 'Sapphire',
    gradient: 'linear-gradient(135deg, #e0f4ff 0%, #7dd3fc 15%, #38bdf8 30%, #0ea5e9 50%, #0284c7 70%, #0369a1 100%)',
    glow: '#38bdf8',
    sparkle: '#ffffff',
    shards: ['#38bdf8', '#0ea5e9', '#7dd3fc', '#e0f4ff']
  },
  {
    name: 'Emerald',
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 15%, #34d399 30%, #10b981 50%, #059669 70%, #047857 100%)',
    glow: '#34d399',
    sparkle: '#ffffff',
    shards: ['#34d399', '#10b981', '#6ee7b7', '#d1fae5']
  },
  {
    name: 'Topaz',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 15%, #fbbf24 30%, #f59e0b 50%, #d97706 70%, #b45309 100%)',
    glow: '#fbbf24',
    sparkle: '#ffffff',
    shards: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef3c7']
  },
  {
    name: 'Ruby',
    gradient: 'linear-gradient(135deg, #ffe4e6 0%, #fda4af 15%, #fb7185 30%, #f43f5e 50%, #e11d48 70%, #be123c 100%)',
    glow: '#fb7185',
    sparkle: '#ffffff',
    shards: ['#fb7185', '#f43f5e', '#fda4af', '#ffe4e6']
  },
  {
    name: 'Amethyst',
    gradient: 'linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 15%, #c084fc 30%, #a855f7 50%, #9333ea 70%, #7e22ce 100%)',
    glow: '#c084fc',
    sparkle: '#ffffff',
    shards: ['#c084fc', '#a855f7', '#d8b4fe', '#f3e8ff']
  },
  {
    name: 'Diamond',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 15%, #e2e8f0 30%, #cbd5e1 50%, #94a3b8 70%, #64748b 100%)',
    glow: '#e2e8f0',
    sparkle: '#ffffff',
    shards: ['#ffffff', '#e2e8f0', '#cbd5e1', '#94a3b8']
  },
];

export default function VocabBlastEngine({
  theme,
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty,
  playSFX,
  isMobile = false
}: VocabBlastEngineProps) {

  const commonProps = {
    currentWord,
    vocabulary,
    onCorrectAnswer,
    onIncorrectAnswer,
    isPaused,
    gameActive,
    difficulty,
    playSFX,
    isMobile
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

// The Ultimate Gem Shooter Engine
function DefaultEngine({
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty,
  isMobile
}: Omit<VocabBlastEngineProps, 'theme'>) {
  const [vocabObjects, setVocabObjects] = useState<VocabObject[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const physicsObjectsRef = useRef<VocabObject[]>([]);
  const objectRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video autoplay prevented:', e));
    }
  }, []);

  const generateDecoys = useCallback((correctTranslation: string): string[] => {
    const otherWords = vocabulary
      .filter(word => word.translation !== correctTranslation)
      .map(word => word.translation);
    const decoyCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
    return otherWords.sort(() => 0.5 - Math.random()).slice(0, decoyCount);
  }, [vocabulary, difficulty]);

  // Spawn gems with MUCH better mobile positioning
  const spawnVocabObjects = useCallback(() => {
    if (!currentWord || isPaused || !gameActive || screenWidth === 0) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    // FIXED: Much better mobile positioning
    const gemWidth = isMobile ? 70 : 120;
    const sidePadding = isMobile ? 50 : 80; // Extra padding on sides
    const availableWidth = screenWidth - (sidePadding * 2) - gemWidth;
    const spacing = availableWidth / Math.max(shuffledOptions.length - 1, 1);

    // Base speed
    const baseSpeed = difficulty === 'beginner' ? 1.0 : difficulty === 'intermediate' ? 1.5 : 2.0;

    const newObjects: VocabObject[] = shuffledOptions.map((translation, index) => {
      const speedVariation = 0.8 + Math.random() * 0.4;
      const spawnDelay = index * (250 + Math.random() * 350);

      // Calculate X position - ensure it's centered with proper distribution
      let x: number;
      if (shuffledOptions.length === 1) {
        x = screenWidth / 2;
      } else {
        x = sidePadding + (gemWidth / 2) + (index * spacing);
      }

      return {
        id: `${currentWord.id}-${index}-${Date.now()}`,
        word: currentWord.word,
        translation,
        isCorrect: translation === currentWord.translation,
        x: Math.max(sidePadding + gemWidth / 2, Math.min(screenWidth - sidePadding - gemWidth / 2, x)),
        y: -100 - (Math.random() * 80),
        speed: baseSpeed * speedVariation,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.015 + Math.random() * 0.02,
        scale: 1,
        gemColorIndex: index % GEM_COLORS.length,
        spawnDelay,
        isVisible: false,
        shimmerPhase: Math.random() * Math.PI * 2
      };
    });

    // Stagger visibility
    newObjects.forEach((obj) => {
      setTimeout(() => {
        setVocabObjects(prev => prev.map(o =>
          o.id === obj.id ? { ...o, isVisible: true } : o
        ));
        physicsObjectsRef.current = physicsObjectsRef.current.map(o =>
          o.id === obj.id ? { ...o, isVisible: true } : o
        );
      }, obj.spawnDelay);
    });

    setVocabObjects(newObjects);
    physicsObjectsRef.current = newObjects;
  }, [currentWord, isPaused, gameActive, screenWidth, generateDecoys, difficulty, isMobile]);

  const setRef = useCallback((element: HTMLDivElement | null, id: string) => {
    if (element) objectRefsMap.current.set(id, element);
    else objectRefsMap.current.delete(id);
  }, []);

  // Physics update
  const updateObjects = useCallback(() => {
    if (isPaused || !gameActive || screenHeight === 0) return;

    frameCountRef.current++;

    const hasMissedCorrectAnswer = physicsObjectsRef.current.some(
      obj => obj.isVisible && obj.y >= (screenHeight - 100) && obj.isCorrect
    );

    if (hasMissedCorrectAnswer) {
      onIncorrectAnswer();
      setVocabObjects([]);
      physicsObjectsRef.current = [];
      return;
    }

    let updatedObjects = physicsObjectsRef.current.map(obj => {
      if (!obj.isVisible) return obj;

      return {
        ...obj,
        y: obj.y + obj.speed,
        x: obj.x + Math.sin(frameCountRef.current * obj.wobbleSpeed + obj.wobbleOffset) * 0.4,
        shimmerPhase: obj.shimmerPhase + 0.05
      };
    }).filter(obj => obj.y < screenHeight + 100);

    physicsObjectsRef.current = updatedObjects;

    updatedObjects.forEach(obj => {
      const element = objectRefsMap.current.get(obj.id);
      if (element && obj.isVisible) {
        element.style.transform = `translate(-50%, -50%) translate3d(${obj.x}px, ${obj.y}px, 0)`;
        element.style.opacity = '1';
      }
    });

    if (updatedObjects.length !== vocabObjects.length) {
      setVocabObjects(updatedObjects);
    }
  }, [isPaused, gameActive, screenHeight, vocabObjects.length, onIncorrectAnswer]);

  // Fire rocket and handle gem hit
  const handleGemClick = useCallback((obj: VocabObject) => {
    if (!obj.isVisible) return;

    const rocketStartX = screenWidth / 2;
    const rocketStartY = screenHeight - 40;
    const rocketId = `rocket-${Date.now()}`;

    // Launch rocket
    setRockets(prev => [...prev, {
      id: rocketId,
      x: rocketStartX,
      y: rocketStartY,
      targetX: obj.x,
      targetY: obj.y,
      active: true
    }]);

    // Calculate flight time based on distance
    const distance = Math.sqrt(Math.pow(obj.x - rocketStartX, 2) + Math.pow(obj.y - rocketStartY, 2));
    const flightTime = Math.min(400, distance * 0.5);

    setTimeout(() => {
      setRockets(prev => prev.filter(r => r.id !== rocketId));

      // EPIC EXPLOSION!
      createGemExplosion(obj.x, obj.y, obj.isCorrect, GEM_COLORS[obj.gemColorIndex]);

      if (obj.isCorrect) {
        setVocabObjects([]);
        physicsObjectsRef.current = [];
        onCorrectAnswer(currentWord);
      } else {
        const filtered = physicsObjectsRef.current.filter(o => o.id !== obj.id);
        setVocabObjects(filtered);
        physicsObjectsRef.current = filtered;
        onIncorrectAnswer();
      }
    }, flightTime);
  }, [currentWord, onCorrectAnswer, onIncorrectAnswer, screenWidth, screenHeight]);

  // Epic gem explosion with shards, sparks, and smoke
  const createGemExplosion = useCallback((x: number, y: number, isCorrect: boolean, gemColor: typeof GEM_COLORS[0]) => {
    const newParticles: Particle[] = [];

    // Gem shards (angular pieces)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const velocity = 10 + Math.random() * 15;
      newParticles.push({
        id: `shard-${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 8,
        vy: Math.sin(angle) * velocity + (Math.random() - 0.5) * 8,
        color: gemColor.shards[Math.floor(Math.random() * gemColor.shards.length)],
        size: Math.random() * 15 + 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        type: 'shard'
      });
    }

    // Sparks (small, fast, bright)
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 15 + Math.random() * 20;
      newParticles.push({
        id: `spark-${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: isCorrect ? '#22c55e' : '#ffffff',
        size: Math.random() * 4 + 2,
        rotation: 0,
        rotationSpeed: 0,
        type: 'spark'
      });
    }

    // Smoke puffs
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 3 + Math.random() * 5;
      newParticles.push({
        id: `smoke-${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2,
        color: 'rgba(255,255,255,0.6)',
        size: Math.random() * 30 + 20,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        type: 'smoke'
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  }, []);

  // Animation loop
  useLayoutEffect(() => {
    const animate = () => {
      if (gameActive && !isPaused) {
        updateObjects();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    if (gameActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameActive, isPaused, updateObjects]);

  useEffect(() => {
    if (currentWord && gameActive && screenWidth > 0) {
      spawnVocabObjects();
    }
  }, [currentWord, gameActive, screenWidth, spawnVocabObjects]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/games/vocab-blast/images/vocab-blast.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ zIndex: 0 }}
      />

      {/* Dark overlay for better visibility */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1
        }}
      />

      {/* Rockets */}
      <AnimatePresence>
        {rockets.map(rocket => (
          <motion.div
            key={rocket.id}
            className="absolute z-30 pointer-events-none"
            initial={{ x: rocket.x, y: rocket.y, scale: 1, rotate: 0 }}
            animate={{
              x: rocket.targetX,
              y: rocket.targetY,
              rotate: Math.atan2(rocket.targetY - rocket.y, rocket.targetX - rocket.x) * (180 / Math.PI) + 90
            }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            style={{
              translateX: '-50%',
              translateY: '-50%',
              transformOrigin: 'center center'
            }}
          >
            {/* Rocket Body */}
            <div className="relative">
              {/* Nose cone */}
              <div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '16px solid #ef4444',
                }}
              />
              {/* Body */}
              <div
                className={`${isMobile ? 'w-4 h-8' : 'w-5 h-10'} rounded-b-lg`}
                style={{
                  background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #dc2626 100%)',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
                }}
              />
              {/* Fins */}
              <div
                className="absolute bottom-0 -left-2 w-0 h-0"
                style={{
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid #b91c1c',
                  borderRight: '8px solid #b91c1c',
                }}
              />
              <div
                className="absolute bottom-0 -right-2 w-0 h-0"
                style={{
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid #b91c1c',
                  borderLeft: '8px solid #b91c1c',
                }}
              />
              {/* Flame trail */}
              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                animate={{
                  scaleY: [1, 1.3, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ duration: 0.1, repeat: Infinity }}
              >
                <div
                  className="w-3 h-8"
                  style={{
                    background: 'linear-gradient(180deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)',
                    clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
                    filter: 'blur(1px)'
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* GEMS */}
      <AnimatePresence>
        {vocabObjects.filter(obj => obj.isVisible).map((obj) => {
          const gemColor = GEM_COLORS[obj.gemColorIndex];
          return (
            <motion.div
              key={obj.id}
              ref={(element) => setRef(element, obj.id)}
              initial={{ opacity: 0, scale: 0, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => handleGemClick(obj)}
              className="absolute cursor-pointer z-20"
              style={{
                transform: `translate(-50%, -50%) translate3d(${obj.x}px, ${obj.y}px, 0)`,
                opacity: 0,
              }}
            >
              <div
                className="relative transition-transform duration-100 hover:scale-110 active:scale-95"
                style={{
                  width: isMobile ? 65 : 100,
                  height: isMobile ? 75 : 110
                }}
              >
                {/* Outer Glow */}
                <motion.div
                  className="absolute inset-0 blur-xl"
                  style={{
                    background: gemColor.glow,
                    borderRadius: '30%',
                    transform: 'scale(1.4)'
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Main Gem */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)',
                    background: gemColor.gradient,
                    boxShadow: `inset 0 0 30px rgba(255,255,255,0.5), 0 0 40px ${gemColor.glow}80`
                  }}
                >
                  {/* Top highlight */}
                  <div
                    className="absolute top-[5%] left-[15%] w-[70%] h-[25%]"
                    style={{
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 100%)'
                    }}
                  />

                  {/* Animated sparkles */}
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        top: `${20 + i * 25}%`,
                        left: `${20 + i * 20}%`,
                        filter: 'blur(0.5px)'
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{
                        duration: 1.2 + i * 0.3,
                        repeat: Infinity,
                        delay: obj.shimmerPhase + i * 0.4
                      }}
                    />
                  ))}
                </div>

                {/* Text */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span
                    className={`font-bold text-white text-center px-1 leading-tight ${isMobile ? 'text-[10px]' : 'text-xs'}`}
                    style={{
                      textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)',
                      maxWidth: '95%'
                    }}
                  >
                    {obj.translation}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: 1,
              rotate: particle.rotation
            }}
            animate={{
              x: particle.x + particle.vx * (particle.type === 'smoke' ? 8 : 12),
              y: particle.y + particle.vy * (particle.type === 'smoke' ? 8 : 12) + (particle.type === 'smoke' ? -50 : 0),
              scale: particle.type === 'smoke' ? 2 : 0,
              opacity: 0,
              rotate: particle.rotation + particle.rotationSpeed * 20
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.type === 'smoke' ? 0.8 : particle.type === 'shard' ? 0.6 : 0.4,
              ease: "easeOut"
            }}
            className="absolute pointer-events-none z-40"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.type !== 'shard' ? particle.color : 'transparent',
              background: particle.type === 'shard'
                ? `linear-gradient(135deg, ${particle.color} 0%, rgba(255,255,255,0.8) 50%, ${particle.color} 100%)`
                : undefined,
              borderRadius: particle.type === 'smoke' ? '50%' : particle.type === 'shard' ? '2px' : '50%',
              clipPath: particle.type === 'shard' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : undefined,
              boxShadow: particle.type !== 'smoke' ? `0 0 ${particle.size}px ${particle.color}` : undefined,
              filter: particle.type === 'smoke' ? 'blur(8px)' : undefined
            }}
          />
        ))}
      </AnimatePresence>

      {/* ROCKET LAUNCHER */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <div className="relative flex flex-col items-center">
          {/* Launch pad glow */}
          <motion.div
            className="absolute -top-4 w-16 h-8"
            style={{
              background: 'radial-gradient(ellipse, rgba(239,68,68,0.5) 0%, transparent 70%)',
              filter: 'blur(8px)'
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Launcher tube */}
          <div
            className={`relative ${isMobile ? 'w-8 h-14' : 'w-12 h-20'} rounded-t-full overflow-hidden`}
            style={{
              background: 'linear-gradient(90deg, #374151 0%, #6b7280 30%, #374151 70%, #1f2937 100%)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 15px rgba(239,68,68,0.3)'
            }}
          >
            {/* Inner barrel */}
            <div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1/2 h-3/4 rounded-t-full"
              style={{
                background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)'
              }}
            />
            {/* Ready indicator */}
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ background: '#22c55e' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>

          {/* Base */}
          <div
            className={`${isMobile ? 'w-20 h-5' : 'w-28 h-6'} rounded-b-lg`}
            style={{
              background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      </div>
    </div>
  );
}