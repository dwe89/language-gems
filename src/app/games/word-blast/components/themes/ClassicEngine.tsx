'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlastEngineProps } from '../WordBlastEngine';
import { WordObject, ParticleEffect, BaseThemeEngine } from '../BaseThemeEngine';

interface ClassicGem extends WordObject {
  gemType: 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz';
  glowing: boolean;
  sparkleIntensity: number;
}

export default function ClassicEngine(props: WordBlastEngineProps) {
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

  const [gems, setGems] = useState<ClassicGem[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [wordsCollected, setWordsCollected] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Track which word in sequence we need next
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const themeEngine = useRef(new ClassicThemeEngine());

  // Spawn gems with words
  const spawnGems = () => {
    if (!currentChallenge || isPaused || !gameActive) {
      console.log('[ClassicEngine] spawnGems skipped:', { currentChallenge, isPaused, gameActive });
      return;
    }

    const correctWords = currentChallenge.words;
    const decoys = themeEngine.current.generateDecoys(correctWords, challenges, difficulty);
    const allWords = [...correctWords, ...decoys];
    const shuffledWords = allWords.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const gemTypes: ('ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz')[] = 
      ['ruby', 'sapphire', 'emerald', 'diamond', 'amethyst', 'topaz'];

    const newGems: ClassicGem[] = [];

    shuffledWords.forEach((word, index) => {
      const position = themeEngine.current.findNonOverlappingPosition(
        newGems,
        screenWidth,
        800,
        120
      );

      newGems.push({
        id: `gem-${currentChallenge.id}-${index}-${Date.now()}`,
        word,
        isCorrect: correctWords.includes(word),
        x: position.x,
        y: position.y - (index * 80), // Stagger spawn times
        speed: 1 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        scale: 0.9 + Math.random() * 0.2,
        spawnTime: Date.now(),
        clicked: false,
        gemType: gemTypes[Math.floor(Math.random() * gemTypes.length)],
        glowing: Math.random() > 0.5,
        sparkleIntensity: Math.random() * 0.5 + 0.5
      });
    });

    console.log('[ClassicEngine] Gems spawned:', newGems);
    setGems(newGems);
  };

  // Update gem positions
  const updateGems = () => {
    if (isPaused || !gameActive) return;

    setGems(prev =>
      prev.map(gem => ({
        ...gem,
        y: gem.y + gem.speed,
        rotation: gem.rotation + 2,
        sparkleIntensity: gem.sparkleIntensity + Math.sin(Date.now() * 0.01) * 0.1
      })).filter(gem => gem.y < (typeof window !== 'undefined' ? window.innerHeight + 100 : 900))
    );
  };

  // Handle gem click
  const handleGemClick = (gem: ClassicGem) => {
    if (gem.clicked) return;

    // Mark as clicked to prevent double-clicks
    setGems(prev =>
      prev.map(g => g.id === gem.id ? { ...g, clicked: true } : g)
    );

    // Check if this is the correct word in the sequence
    const expectedWord = currentChallenge.words[currentWordIndex];
    const isCorrectSequence = gem.word === expectedWord;

    if (gem.isCorrect && isCorrectSequence) {
      // Correct word clicked in correct sequence
      const newWordsCollected = [...wordsCollected, gem.word];
      setWordsCollected(newWordsCollected);
      setCurrentWordIndex(prev => prev + 1);

      // Create success particles
      const successParticles = themeEngine.current.createParticleEffect(
        gem.x, gem.y, 'success', 12
      );
      setParticles(prev => [...prev, ...successParticles]);

      // Play success sound
      playSFX('gem-collect');

      // Award points (bonus for sequence)
      const sequenceBonus = currentWordIndex * 2; // Bonus for maintaining sequence
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
    } else if (gem.isCorrect && !isCorrectSequence) {
      // Correct word but wrong sequence - give feedback but don't penalize heavily
      const warningParticles = themeEngine.current.createParticleEffect(
        gem.x, gem.y, 'ambient', 6
      );
      setParticles(prev => [...prev, ...warningParticles]);

      // Play warning sound (less harsh than error)
      playSFX('gem-collect');

      // Small penalty but don't lose life
      onCorrectAnswer(-2); // Small point deduction
    } else {
      // Incorrect word clicked (decoy)
      const errorParticles = themeEngine.current.createParticleEffect(
        gem.x, gem.y, 'error', 8
      );
      setParticles(prev => [...prev, ...errorParticles]);

      // Play error sound
      playSFX('gem-break');

      onIncorrectAnswer();
    }

    // Remove clicked gem after animation
    setTimeout(() => {
      setGems(prev => prev.filter(g => g.id !== gem.id));
    }, 300);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateGems();
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

  // Spawn gems when challenge changes
  useEffect(() => {
    if (currentChallenge && gameActive) {
      setWordsCollected([]);
      setChallengeProgress(0);
      setCurrentWordIndex(0); // Reset word sequence
      spawnGems();
    }
  }, [currentChallenge, gameActive]);

  // Spawn gems when unpausing if no gems are present
  useEffect(() => {
    if (
      currentChallenge &&
      gameActive &&
      !isPaused &&
      gems.length === 0
    ) {
      spawnGems();
    }
  }, [isPaused, gameActive, currentChallenge, gems.length]);

  if (!currentChallenge) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-900 text-blue-200 text-xl">
        No challenge loaded. Please start a game or check your data source.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Classic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950"></div>

      {/* English Sentence Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-1">Translate this sentence:</div>
            <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
            <div className="text-sm text-blue-300 mt-2">
              Click the {currentChallenge.targetLanguage} words in the correct order
            </div>
          </div>
        </div>
      </div>

      {/* Progress Display */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
          <div className="text-center">
            <div className="text-sm text-gray-300">Progress:</div>
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

      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Floating stars */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
      </div>

      {/* Gems */}
      <AnimatePresence>
        {gems.map((gem) => (
          <GemComponent
            key={gem.id}
            gem={gem}
            onClick={() => handleGemClick(gem)}
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
        <div className="bg-black/50 rounded-lg p-4 backdrop-blur-sm border border-blue-300/30">
          <div className="text-blue-200 text-lg font-bold mb-2">
            {currentChallenge?.english}
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${challengeProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-blue-300 text-sm mt-1">
            Words collected: {wordsCollected.length} / {currentChallenge?.words.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

// Gem Component
const GemComponent: React.FC<{
  gem: ClassicGem;
  onClick: () => void;
}> = ({ gem, onClick }) => {
  const gemColors = {
    ruby: 'from-red-500 to-red-700',
    sapphire: 'from-blue-500 to-blue-700',
    emerald: 'from-green-500 to-green-700',
    diamond: 'from-gray-200 to-gray-400',
    amethyst: 'from-purple-500 to-purple-700',
    topaz: 'from-yellow-500 to-yellow-700'
  };

  const gemBorders = {
    ruby: 'border-red-300',
    sapphire: 'border-blue-300',
    emerald: 'border-green-300',
    diamond: 'border-gray-300',
    amethyst: 'border-purple-300',
    topaz: 'border-yellow-300'
  };

  const gemShadows = {
    ruby: 'shadow-red-400/80',
    sapphire: 'shadow-blue-400/80',
    emerald: 'shadow-green-400/80',
    diamond: 'shadow-gray-400/80',
    amethyst: 'shadow-purple-400/80',
    topaz: 'shadow-yellow-400/80'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: gem.x, y: gem.y, rotate: gem.rotation }}
      animate={{
        opacity: gem.clicked ? 0 : 1,
        scale: gem.clicked ? 0.5 : gem.scale,
        x: gem.x,
        y: gem.y,
        rotate: gem.rotation
      }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
      className="absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none"
    >
      <div className={`bg-gradient-to-r ${gemColors[gem.gemType]} text-white border-3 ${gemBorders[gem.gemType]} shadow-2xl ${gemShadows[gem.gemType]} rounded-xl px-6 py-3 font-bold backdrop-blur-sm bg-opacity-95 min-w-[120px] text-center relative overflow-hidden`}>
        {/* Sparkle effect */}
        {gem.glowing && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse" />
        )}
        
        {/* Gem icon */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl drop-shadow-lg">💎</span>
          <span className="font-bold text-lg drop-shadow-md">{gem.word}</span>
        </div>

        {/* Glow effect */}
        <div 
          className={`absolute inset-0 rounded-xl border-2 ${gemBorders[gem.gemType]}/50`}
          style={{
            boxShadow: `inset 0 0 ${gem.sparkleIntensity * 20}px rgba(255, 255, 255, 0.3)`
          }}
        />
      </div>
    </motion.div>
  );
};

// Theme engine implementation
class ClassicThemeEngine extends BaseThemeEngine {
  // Inherits all base functionality
}
