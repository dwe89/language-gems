'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlastEngineProps } from '../WordBlastEngine';
import { WordObject, ParticleEffect, BaseThemeEngine } from '../BaseThemeEngine';

interface StoneTablet extends WordObject {
  stoneType: 'granite' | 'marble' | 'obsidian';
  crackLevel: number;
  lavaProximity: number;
  runeGlow: number;
  cracking: boolean;
}

interface LavaParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  temperature: number;
}

export default function LavaTempleEngine(props: WordBlastEngineProps) {
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

  const [stoneTablets, setStoneTablets] = useState<StoneTablet[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [lavaParticles, setLavaParticles] = useState<LavaParticle[]>([]);
  const [emberEffects, setEmberEffects] = useState<any[]>([]);
  const [wordsCollected, setWordsCollected] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const themeEngine = useRef(new LavaTempleThemeEngine());

  // Spawn stone tablets with words
  const spawnStoneTablets = () => {
    if (!currentChallenge || isPaused || !gameActive) return;

    const correctWords = currentChallenge.words;
    const decoys = themeEngine.current.generateDecoys(correctWords, challenges, difficulty);
    const allWords = [...correctWords, ...decoys];
    const shuffledWords = allWords.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const stoneTypes: ('granite' | 'marble' | 'obsidian')[] = ['granite', 'marble', 'obsidian'];

    const newTablets: StoneTablet[] = [];

    shuffledWords.forEach((word, index) => {
      const position = themeEngine.current.findNonOverlappingPosition(
        newTablets,
        screenWidth,
        800,
        150
      );

      newTablets.push({
        id: `tablet-${currentChallenge.id}-${index}-${Date.now()}`,
        word,
        isCorrect: correctWords.includes(word),
        x: position.x,
        y: position.y - (index * 100), // Stagger spawn times
        speed: 0.5 + Math.random() * 0.3,
        rotation: (Math.random() - 0.5) * 10,
        scale: 0.9 + Math.random() * 0.2,
        spawnTime: Date.now(),
        clicked: false,
        stoneType: stoneTypes[Math.floor(Math.random() * stoneTypes.length)],
        crackLevel: Math.random() * 0.2,
        lavaProximity: 0,
        runeGlow: Math.random() * 0.5 + 0.5,
        cracking: false
      });
    });

    setStoneTablets(newTablets);
  };

  // Update tablet positions and effects
  const updateTablets = () => {
    if (isPaused || !gameActive) return;

    setStoneTablets(prev =>
      prev.map(tablet => {
        const newY = tablet.y + tablet.speed;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        
        // Increase lava proximity as tablet falls
        const lavaProximity = Math.max(0, (newY - screenHeight * 0.6) / (screenHeight * 0.4));
        
        return {
          ...tablet,
          y: newY,
          lavaProximity,
          runeGlow: tablet.runeGlow + Math.sin(Date.now() * 0.005) * 0.1,
          rotation: tablet.rotation + 0.5
        };
      }).filter(tablet => tablet.y < (typeof window !== 'undefined' ? window.innerHeight + 100 : 900))
    );
  };

  // Handle tablet click
  const handleTabletClick = (tablet: StoneTablet) => {
    if (tablet.clicked) return;

    // Mark as clicked to prevent double-clicks
    setStoneTablets(prev =>
      prev.map(t => t.id === tablet.id ? { ...t, clicked: true, cracking: true } : t)
    );

    // Check if this is the correct word in the sequence
    const expectedWord = currentChallenge.words[currentWordIndex];
    const isCorrectSequence = tablet.word === expectedWord;

    if (tablet.isCorrect && isCorrectSequence) {
      // Correct word clicked in correct sequence
      const newWordsCollected = [...wordsCollected, tablet.word];
      setWordsCollected(newWordsCollected);
      setCurrentWordIndex(prev => prev + 1);

      // Create success particles
      const successParticles = themeEngine.current.createParticleEffect(
        tablet.x, tablet.y, 'success', 15
      );
      setParticles(prev => [...prev, ...successParticles]);

      // Create lava eruption effect
      createLavaEruption(tablet.x, tablet.y);

      // Play success sound
      playSFX('stone-crack');

      // Award points (bonus for sequence)
      const sequenceBonus = currentWordIndex * 2;
      onCorrectAnswer(10 + sequenceBonus + (difficulty === 'advanced' ? 5 : 0));

      // Check if challenge is complete
      if (newWordsCollected.length === currentChallenge.words.length) {
        setTimeout(() => {
          onChallengeComplete();
          setWordsCollected([]);
          setChallengeProgress(0);
          setCurrentWordIndex(0);
        }, 500);
      } else {
        setChallengeProgress(newWordsCollected.length / currentChallenge.words.length);
      }
    } else if (tablet.isCorrect && !isCorrectSequence) {
      // Correct word but wrong sequence
      const warningParticles = themeEngine.current.createParticleEffect(
        tablet.x, tablet.y, 'ambient', 8
      );
      setParticles(prev => [...prev, ...warningParticles]);

      // Play warning sound
      playSFX('stone-crack');

      // Small penalty
      onCorrectAnswer(-2);
    } else {
      // Incorrect word clicked (decoy)
      const errorParticles = themeEngine.current.createParticleEffect(
        tablet.x, tablet.y, 'error', 10
      );
      setParticles(prev => [...prev, ...errorParticles]);

      // Play error sound
      playSFX('stone-break');

      onIncorrectAnswer();
    }

    // Remove clicked tablet after animation
    setTimeout(() => {
      setStoneTablets(prev => prev.filter(t => t.id !== tablet.id));
    }, 300);
  };

  // Create lava eruption effect
  const createLavaEruption = (x: number, y: number) => {
    const lavaParticleCount = 20;
    const newLavaParticles: LavaParticle[] = Array.from({ length: lavaParticleCount }, (_, i) => ({
      id: `lava-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 10 - 5,
      life: 1,
      size: Math.random() * 8 + 4,
      temperature: Math.random() * 0.5 + 0.5
    }));

    setLavaParticles(prev => [...prev, ...newLavaParticles]);

    // Remove lava particles after animation
    setTimeout(() => {
      setLavaParticles(prev => 
        prev.filter(p => !newLavaParticles.some(np => np.id === p.id))
      );
    }, 2000);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateTablets();
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

  // Spawn tablets when challenge changes
  useEffect(() => {
    if (currentChallenge && gameActive) {
      setWordsCollected([]);
      setChallengeProgress(0);
      setCurrentWordIndex(0);
      spawnStoneTablets();
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
          <source src="/games/noughts-and-crosses/images/lava-temple/lava-temple-bg.mp4" type="video/mp4" />
        </video>

        {/* Video overlay gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

      {/* English Sentence Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 border border-orange-500/30">
          <div className="text-center">
            <div className="text-sm text-orange-300 mb-1">🔥 Translate this ancient text:</div>
            <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
            <div className="text-sm text-orange-300 mt-2">
              Click the {currentChallenge.targetLanguage} stone tablets in the correct order
            </div>
          </div>
        </div>
      </div>

      {/* Progress Display */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-orange-500/20">
          <div className="text-center">
            <div className="text-sm text-orange-300">Ancient Translation:</div>
            <div className="text-lg font-bold text-white">
              {wordsCollected.join(' ')}
              {currentWordIndex < currentChallenge.words.length && (
                <span className="text-orange-400 ml-2">
                  (Next: {currentChallenge.words[currentWordIndex]})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lava Temple Background Effects */}
      <div className="absolute inset-0">
        {/* Temple pillars */}
        <div className="absolute left-10 top-0 w-16 h-full bg-gradient-to-b from-amber-900 to-orange-800 opacity-30" />
        <div className="absolute right-10 top-0 w-16 h-full bg-gradient-to-b from-amber-900 to-orange-800 opacity-30" />
        
        {/* Lava glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600 via-orange-500 to-transparent opacity-60" />
        
        {/* Floating embers */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full"
            animate={{
              y: [-20, -window.innerHeight - 20],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Stone Tablets */}
      <AnimatePresence>
        {stoneTablets.map((tablet) => (
          <StoneTabletComponent
            key={tablet.id}
            tablet={tablet}
            onClick={() => handleTabletClick(tablet)}
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

      {/* Challenge Progress */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-amber-200 text-lg font-bold mb-2">
            {currentChallenge?.english}
          </div>
          <div className="w-full bg-amber-900/50 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${challengeProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-amber-300 text-sm mt-1">
            Words collected: {wordsCollected.length} / {currentChallenge?.words.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stone Tablet Component
const StoneTabletComponent: React.FC<{
  tablet: StoneTablet;
  onClick: () => void;
}> = ({ tablet, onClick }) => {
  const stoneColors = {
    granite: 'from-gray-600 to-gray-800',
    marble: 'from-gray-300 to-gray-500',
    obsidian: 'from-gray-900 to-black'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: tablet.x, y: tablet.y, rotate: tablet.rotation }}
      animate={{
        opacity: tablet.clicked ? 0 : 1,
        scale: tablet.clicked ? 0.5 : tablet.scale,
        x: tablet.x,
        y: tablet.y,
        rotate: tablet.rotation
      }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
      className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none`}
      style={{
        filter: `brightness(${1 + tablet.lavaProximity * 0.5}) drop-shadow(0 0 ${tablet.runeGlow * 10}px rgba(255, 140, 0, 0.8))`
      }}
    >
      <div className={`bg-gradient-to-br ${stoneColors[tablet.stoneType]} border-2 border-amber-600 rounded-lg px-4 py-3 min-w-[120px] text-center relative overflow-hidden`}>
        {/* Crack overlay */}
        {tablet.cracking && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500/30 to-orange-500/50" />
        )}
        
        {/* Rune-like text */}
        <div className="relative z-10">
          <div className="text-amber-100 font-bold text-lg drop-shadow-lg">
            {tablet.word}
          </div>
        </div>
        
        {/* Stone texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent" />
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-lg border border-orange-400/50"
          style={{
            boxShadow: `inset 0 0 ${tablet.runeGlow * 20}px rgba(255, 140, 0, 0.3)`
          }}
        />
      </div>
    </motion.div>
  );
};

// Theme engine implementation
class LavaTempleThemeEngine extends BaseThemeEngine {
  // Inherits all base functionality
}
