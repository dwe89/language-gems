'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlastEngineProps } from '../WordBlastEngine';
import { WordObject, ParticleEffect, BaseThemeEngine } from '../BaseThemeEngine';

interface PirateShip extends WordObject {
  shipType: 'galleon' | 'frigate' | 'sloop';
  sailsUp: boolean;
  treasureValue: number;
  weathered: number;
  floating: boolean;
}

interface CannonBall {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
}

export default function PirateAdventureEngine(props: WordBlastEngineProps) {
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

  const [pirateShips, setPirateShips] = useState<PirateShip[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [cannonBalls, setCannonBalls] = useState<CannonBall[]>([]);
  const [wordsCollected, setWordsCollected] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const themeEngine = useRef(new PirateAdventureThemeEngine());

  // Spawn pirate ships with words
  const spawnPirateShips = () => {
    if (!currentChallenge || isPaused || !gameActive) return;

    const correctWords = currentChallenge.words;
    const decoys = themeEngine.current.generateDecoys(correctWords, challenges, difficulty);
    const allWords = [...correctWords, ...decoys];
    const shuffledWords = allWords.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const shipTypes: ('galleon' | 'frigate' | 'sloop')[] = ['galleon', 'frigate', 'sloop'];

    const newShips: PirateShip[] = [];

    shuffledWords.forEach((word, index) => {
      const position = themeEngine.current.findNonOverlappingPosition(
        newShips,
        screenWidth,
        800,
        160
      );

      newShips.push({
        id: `ship-${currentChallenge.id}-${index}-${Date.now()}`,
        word,
        isCorrect: correctWords.includes(word),
        x: position.x,
        y: position.y - (index * 120), // Stagger spawn times
        speed: 0.6 + Math.random() * 0.3,
        rotation: (Math.random() - 0.5) * 5, // Slight rocking motion
        scale: 0.8 + Math.random() * 0.3,
        spawnTime: Date.now(),
        clicked: false,
        shipType: shipTypes[Math.floor(Math.random() * shipTypes.length)],
        sailsUp: Math.random() > 0.3,
        treasureValue: Math.floor(Math.random() * 100) + 50,
        weathered: Math.random() * 0.5 + 0.3,
        floating: true
      });
    });

    setPirateShips(newShips);
  };

  // Update ship positions and floating motion
  const updateShips = () => {
    if (isPaused || !gameActive) return;

    setPirateShips(prev =>
      prev.map(ship => ({
        ...ship,
        y: ship.y + ship.speed,
        rotation: ship.rotation + Math.sin(Date.now() * 0.003) * 0.5, // Rocking motion
        x: ship.x + Math.sin(Date.now() * 0.002 + ship.spawnTime * 0.001) * 0.3 // Side-to-side drift
      })).filter(ship => ship.y < (typeof window !== 'undefined' ? window.innerHeight + 100 : 900))
    );
  };

  // Update cannon balls
  const updateCannonBalls = () => {
    setCannonBalls(prev =>
      prev.map(ball => ({
        ...ball,
        progress: Math.min(ball.progress + 0.05, 1),
        x: ball.x + (ball.targetX - ball.x) * 0.05,
        y: ball.y + (ball.targetY - ball.y) * 0.05
      })).filter(ball => ball.progress < 1)
    );
  };

  // Handle ship click (cannon fire)
  const handleShipClick = (ship: PirateShip) => {
    if (ship.clicked) return;

    // Mark as clicked to prevent double-clicks
    setPirateShips(prev =>
      prev.map(s => s.id === ship.id ? { ...s, clicked: true } : s)
    );

    // Fire cannon ball
    const cannonBall: CannonBall = {
      id: `cannon-${Date.now()}`,
      x: 50, // Cannon position (left side)
      y: window.innerHeight - 100,
      targetX: ship.x,
      targetY: ship.y,
      progress: 0
    };
    setCannonBalls(prev => [...prev, cannonBall]);

    // Delayed hit effect
    setTimeout(() => {
      if (ship.isCorrect) {
        // Correct word clicked - ship destroyed
        const newWordsCollected = [...wordsCollected, ship.word];
        setWordsCollected(newWordsCollected);
        
        // Create success particles (treasure explosion)
        const successParticles = themeEngine.current.createParticleEffect(
          ship.x, ship.y, 'success', 20
        );
        setParticles(prev => [...prev, ...successParticles]);
        
        // Create water splash effect
        createWaterSplash(ship.x, ship.y);
        
        // Play cannon fire sound
        playSFX('cannon-fire');
        
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
          ship.x, ship.y, 'error', 12
        );
        setParticles(prev => [...prev, ...errorParticles]);
        
        // Play miss sound
        playSFX('cannon-miss');
        
        onIncorrectAnswer();
      }

      // Remove clicked ship after animation
      setTimeout(() => {
        setPirateShips(prev => prev.filter(s => s.id !== ship.id));
      }, 300);
    }, 800); // Delay for cannon ball travel time
  };

  // Create water splash effect
  const createWaterSplash = (x: number, y: number) => {
    const splashParticles = Array.from({ length: 15 }, (_, i) => ({
      id: `splash-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 8 - 3,
      life: 1,
      maxLife: 1,
      color: '#3B82F6',
      size: Math.random() * 6 + 3,
      type: 'ambient' as const
    }));

    setParticles(prev => [...prev, ...splashParticles]);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateShips();
      updateCannonBalls();
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

  // Spawn ships when challenge changes
  useEffect(() => {
    if (currentChallenge && gameActive) {
      setWordsCollected([]);
      setChallengeProgress(0);
      spawnPirateShips();
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
          <source src="/games/noughts-and-crosses/images/pirate-adventure/pirate-adventure-bg.mp4" type="video/mp4" />
        </video>

        {/* Video overlay gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

      {/* English Sentence Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 border border-amber-500/30">
          <div className="text-center">
            <div className="text-sm text-amber-300 mb-1">🏴‍☠️ Decode this treasure map:</div>
            <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
            <div className="text-sm text-blue-300 mt-2">
              Click the {currentChallenge.targetLanguage} pirate ships in the correct order
            </div>
          </div>
        </div>
      </div>

      {/* Progress Display */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-amber-500/20">
          <div className="text-center">
            <div className="text-sm text-amber-300">Treasure Map:</div>
            <div className="text-lg font-bold text-white">
              {wordsCollected.join(' ')}
              {currentWordIndex < currentChallenge.words.length && (
                <span className="text-blue-400 ml-2">
                  (Next: {currentChallenge.words[currentWordIndex]})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Ocean Background */}
      <div className="absolute inset-0">
        {/* Clouds */}
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/20 rounded-full"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 30 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30}%`
            }}
            animate={{
              x: [-50, window.innerWidth + 50]
            }}
            transition={{
              duration: Math.random() * 20 + 30,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
        
        {/* Water waves */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 opacity-60"
            animate={{
              scaleY: [1, 1.1, 1],
              scaleX: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
        
        {/* Seagulls */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-white text-sm"
            animate={{
              x: [-20, window.innerWidth + 20],
              y: [Math.random() * 100 + 50, Math.random() * 100 + 100]
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 10
            }}
          >
            🕊️
          </motion.div>
        ))}
      </div>

      {/* Cannon (fixed position) */}
      <div className="absolute bottom-20 left-10">
        <div className="text-6xl transform rotate-12">🔫</div>
        <div className="text-amber-800 font-bold text-sm mt-2">CANNON</div>
      </div>

      {/* Pirate Ships */}
      <AnimatePresence>
        {pirateShips.map((ship) => (
          <PirateShipComponent
            key={ship.id}
            ship={ship}
            onClick={() => handleShipClick(ship)}
          />
        ))}
      </AnimatePresence>

      {/* Cannon Balls */}
      <AnimatePresence>
        {cannonBalls.map((ball) => (
          <motion.div
            key={ball.id}
            className="absolute w-4 h-4 bg-gray-800 rounded-full shadow-lg"
            style={{ x: ball.x, y: ball.y }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
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
            transition={{ duration: 1.5 }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
      </AnimatePresence>

      {/* Challenge Progress - Pirate Map Style */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-amber-100/90 rounded-lg p-4 backdrop-blur-sm border-2 border-amber-800 shadow-lg" style={{ fontFamily: 'serif' }}>
          <div className="text-amber-900 text-lg font-bold mb-2">
            🗺️ Quest: {currentChallenge?.english}
          </div>
          <div className="w-full bg-amber-800/30 rounded-full h-3 border border-amber-800">
            <motion.div
              className="bg-gradient-to-r from-amber-600 to-yellow-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${challengeProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-amber-800 text-sm mt-1">
            ⚓ Ships Sunk: {wordsCollected.length} / {currentChallenge?.words.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pirate Ship Component
const PirateShipComponent: React.FC<{
  ship: PirateShip;
  onClick: () => void;
}> = ({ ship, onClick }) => {
  const shipEmojis = {
    galleon: '🚢',
    frigate: '⛵',
    sloop: '🛥️'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: ship.x, y: ship.y, rotate: ship.rotation }}
      animate={{
        opacity: ship.clicked ? 0 : 1,
        scale: ship.clicked ? 0.5 : ship.scale,
        x: ship.x,
        y: ship.y,
        rotate: ship.rotation
      }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
      className="absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none"
    >
      <div className="bg-amber-100 border-2 border-amber-800 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm min-w-[160px] text-center relative overflow-hidden">
        {/* Weathered texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/50 to-amber-800/30" />
        
        {/* Ship content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">{shipEmojis[ship.shipType]}</span>
            <span className="text-xs text-amber-700">
              {ship.sailsUp ? '⛵' : '🏴‍☠️'}
            </span>
          </div>
          <div className="font-bold text-amber-900 text-lg drop-shadow-sm">
            {ship.word}
          </div>
          <div className="text-xs text-amber-700 mt-1">
            💰 {ship.treasureValue} doubloons
          </div>
        </div>
        
        {/* Rope border effect */}
        <div className="absolute inset-0 rounded-lg border-2 border-amber-600/50" />
      </div>
    </motion.div>
  );
};

// Theme engine implementation
class PirateAdventureThemeEngine extends BaseThemeEngine {
  // Inherits all base functionality
}
