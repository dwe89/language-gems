'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Generate decoy words
  const generateDecoys = (correctTranslation: string): string[] => {
    const otherWords = vocabulary
      .filter(word => word.translation !== correctTranslation)
      .map(word => word.translation);

    // Shuffle and take 3-5 decoys based on difficulty
    const decoyCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
    const shuffled = otherWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, decoyCount);
  };

  // Spawn new vocab objects
  const spawnVocabObjects = () => {
    if (!currentWord || isPaused || !gameActive) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    const newObjects: VocabObject[] = shuffledOptions.map((translation, index) => ({
      id: `${currentWord.id}-${index}-${Date.now()}`,
      word: currentWord.word,
      translation,
      isCorrect: translation === currentWord.translation,
      x: Math.random() * (screenWidth - 200) + 100,
      y: -100,
      speed: difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 1.5 : 2,
      rotation: Math.random() * 360,
      scale: 1
    }));

    setVocabObjects(newObjects);
  };

  // Update object positions
  const updateObjects = () => {
    if (isPaused || !gameActive) return;

    setVocabObjects(prev =>
      prev.map(obj => ({
        ...obj,
        y: obj.y + obj.speed,
        rotation: obj.rotation + 1
      })).filter(obj => obj.y < (typeof window !== 'undefined' ? window.innerHeight + 100 : 1000))
    );
  };

  // Handle object click
  const handleObjectClick = (obj: VocabObject) => {
    if (obj.isCorrect) {
      onCorrectAnswer(currentWord);
      // Create success particles
      createParticles(obj.x, obj.y, 'success');
    } else {
      onIncorrectAnswer();
      // Create error particles
      createParticles(obj.x, obj.y, 'error');
    }

    // Remove clicked object
    setVocabObjects(prev => prev.filter(o => o.id !== obj.id));
  };

  // Create particle effects
  const createParticles = (x: number, y: number, type: 'success' | 'error') => {
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
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateObjects();
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

  // Spawn objects when current word changes
  useEffect(() => {
    if (currentWord && gameActive) {
      spawnVocabObjects();
    }
  }, [currentWord, gameActive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
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
      </div>

      {/* Vocab Objects */}
      <AnimatePresence>
        {vocabObjects.map((obj) => (
          <motion.div
            key={obj.id}
            initial={{ opacity: 0, scale: 0, x: obj.x, y: obj.y, rotate: obj.rotation }}
            animate={{
              opacity: 1,
              scale: obj.scale,
              x: obj.x,
              y: obj.y,
              rotate: obj.rotation
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handleObjectClick(obj)}
            className="absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-3 border-blue-300 shadow-2xl shadow-blue-400/80 rounded-xl px-6 py-3 font-bold backdrop-blur-sm bg-opacity-95"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl drop-shadow-lg">💎</span>
              <span className="font-bold text-lg drop-shadow-md text-white">{obj.translation}</span>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-blue-200/50 animate-pulse"></div>
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
