'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlastEngineProps } from '../WordBlastEngine';
import { WordObject, ParticleEffect, BaseThemeEngine } from '../BaseThemeEngine';

interface SpaceComet extends WordObject {
  cometType: 'ice' | 'rock' | 'metal';
  tailLength: number;
  glowIntensity: number;
  trajectory: number;
  spinning: boolean;
}

interface LaserBeam {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  color: string;
}

export default function SpaceExplorerEngine(props: WordBlastEngineProps) {
  const {
    currentChallenge,
    challenges,
    onCorrectAnswer,
    onIncorrectAnswer,
    onChallengeComplete,
    isPaused,
    gameActive,
    difficulty,
    playSFX
  } = props;

  const [spaceComets, setSpaceComets] = useState<SpaceComet[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [laserBeams, setLaserBeams] = useState<LaserBeam[]>([]);
  const [wordsCollected, setWordsCollected] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const themeEngine = useRef(new SpaceExplorerThemeEngine());

  // Spawn space comets with words
  const spawnSpaceComets = () => {
    if (!currentChallenge || isPaused || !gameActive) return;

    const correctWords = currentChallenge.words;
    const decoys = themeEngine.current.generateDecoys(correctWords, challenges, difficulty, currentChallenge.targetLanguage);
    const allWords = [...correctWords, ...decoys];
    const shuffledWords = allWords.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const cometTypes: ('ice' | 'rock' | 'metal')[] = ['ice', 'rock', 'metal'];

    const newComets: SpaceComet[] = [];

    shuffledWords.forEach((word, index) => {
      const position = themeEngine.current.findNonOverlappingPosition(
        newComets,
        screenWidth,
        800,
        150
      );

      newComets.push({
        id: `comet-${currentChallenge.id}-${index}-${Date.now()}`,
        word,
        isCorrect: correctWords.includes(word),
        x: position.x,
        y: position.y - (index * 100), // Stagger spawn times
        speed: 0.8 + Math.random() * 0.4,
        scale: 0.8 + Math.random() * 0.3,
        spawnTime: Date.now(),
        clicked: false,
        cometType: cometTypes[Math.floor(Math.random() * cometTypes.length)],
        tailLength: Math.random() * 50 + 30,
        glowIntensity: Math.random() * 0.5 + 0.5,
        trajectory: (Math.random() - 0.5) * 2, // Slight diagonal movement
        spinning: Math.random() > 0.5
      });
    });

    setSpaceComets(newComets);
  };

  // Update comet positions and effects
  const updateComets = () => {
    if (isPaused || !gameActive) return;

    setSpaceComets(prev =>
      prev.map(comet => ({
        ...comet,
        y: comet.y + comet.speed,
        x: comet.x + comet.trajectory * 0.5,
        glowIntensity: comet.glowIntensity + Math.sin(Date.now() * 0.01) * 0.1
      })).filter(comet => comet.y < (typeof window !== 'undefined' ? window.innerHeight + 100 : 900))
    );
  };

  // Update laser beams
  const updateLaserBeams = () => {
    setLaserBeams(prev =>
      prev.map(beam => ({
        ...beam,
        progress: Math.min(beam.progress + 0.08, 1),
        x: beam.x + (beam.targetX - beam.x) * 0.08,
        y: beam.y + (beam.targetY - beam.y) * 0.08
      })).filter(beam => beam.progress < 1)
    );
  };

  // Handle comet click (laser blast)
  const handleCometClick = (comet: SpaceComet) => {
    if (comet.clicked) return;

    // Mark as clicked to prevent double-clicks
    setSpaceComets(prev =>
      prev.map(c => c.id === comet.id ? { ...c, clicked: true } : c)
    );

    // Fire laser beam
    const laserBeam: LaserBeam = {
      id: `laser-${Date.now()}`,
      x: window.innerWidth / 2, // Spaceship position (center bottom)
      y: window.innerHeight - 80,
      targetX: comet.x,
      targetY: comet.y,
      progress: 0,
      color: comet.isCorrect ? '#00FF00' : '#FF0000'
    };
    setLaserBeams(prev => [...prev, laserBeam]);

    // Delayed hit effect
    setTimeout(() => {
      if (comet.isCorrect) {
        // Correct word clicked - comet destroyed
        const newWordsCollected = [...wordsCollected, comet.word];
        setWordsCollected(newWordsCollected);
        
        // Create success particles (space explosion)
        const successParticles = themeEngine.current.createParticleEffect(
          comet.x, comet.y, 'success', 25
        );
        setParticles(prev => [...prev, ...successParticles]);
        
        // Create cosmic explosion effect
        createCosmicExplosion(comet.x, comet.y);
        
        // Play laser hit sound
        playSFX('gem');
        
        // Award points
        onCorrectAnswer(10 + (difficulty === 'advanced' ? 5 : 0));
        
        // Check if challenge is complete
        if (newWordsCollected.length === currentChallenge.words.length) {
          setTimeout(() => {
            onChallengeComplete();
            setWordsCollected([]);
            setChallengeProgress(0);
          }, 500);
        } else {
          setChallengeProgress(newWordsCollected.length / currentChallenge.words.length);
        }
      } else {
        // Incorrect word clicked - missed shot
        const errorParticles = themeEngine.current.createParticleEffect(
          comet.x, comet.y, 'error', 15
        );
        setParticles(prev => [...prev, ...errorParticles]);
        
        // Play laser miss sound
        playSFX('wrong-answer');
        
        onIncorrectAnswer();
      }

      // Remove clicked comet after animation
      setTimeout(() => {
        setSpaceComets(prev => prev.filter(c => c.id !== comet.id));
      }, 400);
    }, 600); // Delay for laser beam travel time
  };

  // Create cosmic explosion effect
  const createCosmicExplosion = (x: number, y: number) => {
    const explosionParticles = Array.from({ length: 20 }, (_, i) => ({
      id: `explosion-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      life: 1,
      maxLife: 1,
      color: ['#FFD700', '#FF6B35', '#F7931E', '#FFFF00'][Math.floor(Math.random() * 4)],
      size: Math.random() * 8 + 4,
      type: 'ambient' as const
    }));

    setParticles(prev => [...prev, ...explosionParticles]);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateComets();
      updateLaserBeams();
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

  // Spawn comets when challenge changes
  useEffect(() => {
    if (currentChallenge && gameActive) {
      setWordsCollected([]);
      setChallengeProgress(0);
      spawnSpaceComets();
    }
  }, [currentChallenge, gameActive]);

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

      {/* English Sentence Display */}
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-50">

        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 border border-blue-500/30">
          <div className="text-center">
            <div className="text-sm text-blue-300 mb-1">🚀 Decode this space transmission:</div>
            <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
            <div className="text-sm text-cyan-300 mt-2">
              Click the {currentChallenge.targetLanguage} space comets in the correct order
            </div>
          </div>
        </div>
      </div>

      {/* Space Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
        
        {/* Nebula clouds */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 150 + 75}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${['#FF6B35', '#F7931E', '#FFD700'][i]} 0%, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
        
        {/* Distant planets */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-60" />
        <div className="absolute top-40 left-10 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-50" />
      </div>

      {/* Space Comets */}
      <AnimatePresence>
        {spaceComets.map((comet) => (
          <SpaceCometComponent
            key={comet.id}
            comet={comet}
            onClick={() => handleCometClick(comet)}
          />
        ))}
      </AnimatePresence>

      {/* Laser Beams */}
      <AnimatePresence>
        {laserBeams.map((beam) => (
          <motion.div
            key={beam.id}
            className="absolute w-1 h-20 rounded-full"
            style={{
              x: beam.x,
              y: beam.y,
              background: `linear-gradient(to top, ${beam.color}, transparent)`,
              boxShadow: `0 0 10px ${beam.color}`
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
          />
        ))}
      </AnimatePresence>

      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
            animate={{
              opacity: 0,
              scale: 0,
              x: particle.x + particle.vx * 50,
              y: particle.y + particle.vy * 50
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
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

// Space Comet Component
const SpaceCometComponent: React.FC<{
  comet: SpaceComet;
  onClick: () => void;
}> = ({ comet, onClick }) => {
  const cometStyles = {
    ice: {
      bg: 'from-cyan-400 to-blue-600',
      border: 'border-cyan-300',
      shadow: 'shadow-cyan-400/60',
      emoji: '🧊'
    },
    rock: {
      bg: 'from-gray-500 to-gray-700',
      border: 'border-gray-400',
      shadow: 'shadow-gray-400/60',
      emoji: '🪨'
    },
    metal: {
      bg: 'from-yellow-400 to-orange-600',
      border: 'border-yellow-300',
      shadow: 'shadow-yellow-400/60',
      emoji: '⚡'
    }
  };

  const style = cometStyles[comet.cometType];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: comet.x, y: comet.y, rotate: 0 }}
      animate={{
        opacity: comet.clicked ? 0 : 1,
        scale: comet.clicked ? 0.5 : comet.scale,
        x: comet.x,
        y: comet.y,
      }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
      className="absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none"
    >
      {/* Comet tail */}
      <div
        className="absolute bg-gradient-to-t from-white/30 to-transparent rounded-full"
        style={{
          width: '4px',
          height: `${comet.tailLength}px`,
          left: '50%',
          top: '100%',
          transform: 'translateX(-50%)',
          filter: 'blur(2px)'
        }}
      />
      
      {/* Comet body */}
      <div className={`bg-gradient-to-r ${style.bg} text-white border-2 ${style.border} shadow-2xl ${style.shadow} rounded-full px-4 py-3 font-bold backdrop-blur-sm bg-opacity-90 min-w-[150px] text-center relative overflow-hidden`}>
        {/* Cosmic glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">{style.emoji}</span>
            <span className="text-xs text-gray-200">COMET_{comet.id.slice(-4)}</span>
          </div>
          <div className="font-bold text-sm drop-shadow-md">
            {comet.word.toUpperCase()}
          </div>
        </div>
        
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 rounded-full border ${style.border}/50`}
          style={{
            boxShadow: `inset 0 0 ${comet.glowIntensity * 20}px rgba(255, 255, 255, 0.3), 0 0 ${comet.glowIntensity * 25}px ${style.shadow.includes('cyan') ? 'rgba(6, 182, 212, 0.4)' : style.shadow.includes('gray') ? 'rgba(156, 163, 175, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`
          }}
        />
      </div>
    </motion.div>
  );
};

// Theme engine implementation
class SpaceExplorerThemeEngine extends BaseThemeEngine {
  // Inherits all base functionality
}
