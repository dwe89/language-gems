'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameVocabularyWord } from '../../../../../hooks/useGameVocabulary';

interface TokyoNightsEngineProps {
  currentWord: GameVocabularyWord;
  vocabulary: GameVocabularyWord[];
  onCorrectAnswer: (word: GameVocabularyWord) => void;
  onIncorrectAnswer: () => void;
  isPaused: boolean;
  gameActive: boolean;
  difficulty: string;
}

interface DataPacket {
  id: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  glitchEffect: boolean;
  hackProgress: number;
  size: number;
  direction: 'left' | 'right';
  targetY: number;
}

export default function TokyoNightsEngine({
  currentWord,
  vocabulary,
  onCorrectAnswer,
  onIncorrectAnswer,
  isPaused,
  gameActive,
  difficulty
}: TokyoNightsEngineProps) {
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([]);
  const [glitchParticles, setGlitchParticles] = useState<any[]>([]);
  const [hackingEffect, setHackingEffect] = useState(false);
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

  // Spawn data packets with side-to-side movement
  const spawnDataPackets = () => {
    if (!currentWord || isPaused || !gameActive) return;

    const decoys = generateDecoys(currentWord.translation);
    const allOptions = [currentWord.translation, ...decoys];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    const newPackets: DataPacket[] = shuffledOptions.map((translation, index) => {
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      const startX = direction === 'left' ? -200 : screenWidth + 200;
      const targetY = 120 + (index * 100) + Math.random() * 40;

      return {
        id: `packet-${currentWord.id}-${index}-${Date.now()}`,
        translation,
        isCorrect: translation === currentWord.translation,
        x: startX,
        y: targetY,
        speed: 1.2 + Math.random() * 0.8, // Slower speed for longer visibility
        glitchEffect: Math.random() > 0.7,
        hackProgress: 0,
        size: Math.random() * 0.3 + 0.8,
        direction,
        targetY
      };
    });

    setDataPackets(newPackets);
  };

  // Update packet positions with side-to-side movement
  const updatePackets = () => {
    if (isPaused || !gameActive) return;

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    setDataPackets(prev =>
      prev.map(packet => {
        let newX = packet.x;

        // Move horizontally based on direction
        if (packet.direction === 'left') {
          newX = packet.x + packet.speed;
        } else {
          newX = packet.x - packet.speed;
        }

        return {
          ...packet,
          x: newX,
          glitchEffect: Math.random() > 0.95 ? !packet.glitchEffect : packet.glitchEffect,
          hackProgress: packet.hackProgress + 0.01
        };
      }).filter(packet => {
        // Remove packets that have moved off screen
        return packet.x > -300 && packet.x < screenWidth + 300;
      })
    );
  };

  // Handle packet click
  const handlePacketClick = (packet: DataPacket) => {
    if (packet.isCorrect) {
      setHackingEffect(true);
      onCorrectAnswer(currentWord);
      createHackParticles(packet.x, packet.y);
      
      // Reset hacking effect after animation
      setTimeout(() => setHackingEffect(false), 1000);
    } else {
      onIncorrectAnswer();
      createErrorGlitch(packet.x, packet.y);
    }

    // Remove clicked packet
    setDataPackets(prev => prev.filter(p => p.id !== packet.id));
  };

  // Create hack success particles
  const createHackParticles = (x: number, y: number) => {
    const particleCount = 15;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: `hack-particle-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      life: 1,
      color: Math.random() > 0.5 ? '#EC4899' : '#8B5CF6',
      size: Math.random() * 8 + 3,
      type: 'hack'
    }));

    setGlitchParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setGlitchParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1500);
  };

  // Create error glitch effect
  const createErrorGlitch = (x: number, y: number) => {
    const glitchCount = 8;
    const newGlitches = Array.from({ length: glitchCount }, (_, i) => ({
      id: `error-glitch-${Date.now()}-${i}`,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      width: Math.random() * 50 + 20,
      height: Math.random() * 10 + 5,
      life: 1,
      color: '#EF4444',
      type: 'error'
    }));

    setGlitchParticles(prev => [...prev, ...newGlitches]);

    setTimeout(() => {
      setGlitchParticles(prev => prev.filter(p => !newGlitches.some(ng => ng.id === p.id)));
    }, 800);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updatePackets();
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

  // Spawn packets when current word changes
  useEffect(() => {
    if (currentWord && gameActive) {
      spawnDataPackets();
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
          <source src="/games/noughts-and-crosses/images/tokyo-nights/tokyo-nights-bg.mp4" type="video/mp4" />
        </video>

        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Digital Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/30 font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {Math.random() > 0.5 ? '01' : '10'}
          </motion.div>
        ))}
      </div>

      {/* Hacking Effect Overlay */}
      <AnimatePresence>
        {hackingEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(236,72,153,0.1)_50%,transparent_75%)] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-400 font-mono text-2xl">
              SYSTEM HACKED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Packets */}
      <AnimatePresence>
        {dataPackets.map((packet) => (
          <motion.div
            key={packet.id}
            initial={{ opacity: 0, scale: 0, x: packet.x, y: packet.y }}
            animate={{
              opacity: 1,
              scale: packet.size,
              x: packet.x,
              y: packet.y
            }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => handlePacketClick(packet)}
            className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none ${
              packet.glitchEffect ? 'animate-pulse' : ''
            }`}
          >
            <div className="relative">
              {/* Professional Cyberpunk Drone */}
              <div className="relative">
                {/* Drone Body */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl border border-pink-500/50"
                     style={{ width: '120px', height: '60px' }}>

                  {/* Drone Core */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full shadow-lg">
                    <div className="absolute inset-1 bg-gradient-to-br from-pink-200 to-purple-400 rounded-full animate-pulse"></div>
                  </div>

                  {/* Drone Wings/Rotors */}
                  <div className="absolute top-0 left-2 w-3 h-3 bg-gray-700 rounded-full border border-pink-400/60"></div>
                  <div className="absolute top-0 right-2 w-3 h-3 bg-gray-700 rounded-full border border-pink-400/60"></div>
                  <div className="absolute bottom-0 left-2 w-3 h-3 bg-gray-700 rounded-full border border-pink-400/60"></div>
                  <div className="absolute bottom-0 right-2 w-3 h-3 bg-gray-700 rounded-full border border-pink-400/60"></div>

                  {/* LED Strips */}
                  <div className="absolute top-1 left-1 right-1 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-80"></div>
                  <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-80"></div>

                  {/* Hack Progress Indicator */}
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-800 rounded-full overflow-hidden border border-pink-500/30">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg"
                      animate={{ width: `${packet.hackProgress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>

                  {/* Neon Glow */}
                  <div className="absolute inset-0 rounded-lg border border-pink-400/60 shadow-lg shadow-pink-500/50"></div>

                  {/* Glitch Effect */}
                  {packet.glitchEffect && (
                    <>
                      <div className="absolute inset-0 bg-pink-500/30 rounded-lg animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-pink-300 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-300 animate-pulse"></div>
                    </>
                  )}
                </div>

                {/* Holographic Data Display */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/95 text-pink-300 px-3 py-1 rounded border border-pink-500/50 font-mono text-sm shadow-lg backdrop-blur-sm">
                  <div className="text-xs text-pink-400/80 mb-0.5">DATA_PKT</div>
                  <div className="font-bold">{packet.translation}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Glitch Particles */}
      <AnimatePresence>
        {glitchParticles.map((particle) => (
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
              scale: particle.type === 'hack' ? 2 : 0,
              x: particle.type === 'hack' ? particle.x + particle.vx * 50 : particle.x,
              y: particle.type === 'hack' ? particle.y + particle.vy * 50 : particle.y
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.type === 'hack' ? 1.5 : 0.8 }}
            className="absolute pointer-events-none"
            style={{ 
              backgroundColor: particle.color,
              width: particle.type === 'hack' ? particle.size : particle.width,
              height: particle.type === 'hack' ? particle.size : particle.height,
              borderRadius: particle.type === 'hack' ? '50%' : '0'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
