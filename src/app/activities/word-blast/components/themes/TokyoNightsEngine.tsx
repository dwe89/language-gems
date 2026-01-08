'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlastEngineProps } from '../WordBlastEngine';
import { WordObject, ParticleEffect, BaseThemeEngine } from '../BaseThemeEngine';

interface DataPacket extends WordObject {
  packetType: 'data' | 'encrypted' | 'corrupted';
  hackingProgress: number;
  neonGlow: number;
  digitalTrail: boolean;
}

export default function TokyoNightsEngine(props: WordBlastEngineProps) {
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

  const [dataPackets, setDataPackets] = useState<DataPacket[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [digitalRain, setDigitalRain] = useState<any[]>([]);
  const [wordsCollected, setWordsCollected] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const themeEngine = useRef(new TokyoNightsThemeEngine());

  // Initialize digital rain effect
  useEffect(() => {
    const rainDrops = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    }));
    setDigitalRain(rainDrops);
  }, []);

  // Spawn data packets with words
  const spawnDataPackets = () => {
    if (!currentChallenge || isPaused || !gameActive) return;

    const correctWords = currentChallenge.words;
    const decoys = themeEngine.current.generateDecoys(correctWords, challenges, difficulty, currentChallenge.targetLanguage);
    const allWords = [...correctWords, ...decoys];
    const shuffledWords = allWords.sort(() => 0.5 - Math.random());

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const packetTypes: ('data' | 'encrypted' | 'corrupted')[] = ['data', 'encrypted', 'corrupted'];

    const newPackets: DataPacket[] = [];

    shuffledWords.forEach((word, index) => {
      const position = themeEngine.current.findNonOverlappingPosition(
        newPackets,
        screenWidth,
        800,
        140
      );

      newPackets.push({
        id: `packet-${currentChallenge.id}-${index}-${Date.now()}`,
        word,
        isCorrect: correctWords.includes(word),
        x: position.x,
        y: position.y - (index * 90), // Stagger spawn times
        speed: 0.8 + Math.random() * 0.4,
        rotation: 0,
        scale: 0.9 + Math.random() * 0.2,
        spawnTime: Date.now(),
        clicked: false,
        packetType: packetTypes[Math.floor(Math.random() * packetTypes.length)],
        hackingProgress: 0,
        neonGlow: Math.random() * 0.5 + 0.5,
        digitalTrail: Math.random() > 0.5
      });
    });

    setDataPackets(newPackets);
  };

  // Update packet positions and effects
  const updatePackets = () => {
    if (isPaused || !gameActive) return;

    setDataPackets(prev =>
      prev.map(packet => ({
        ...packet,
        y: packet.y + packet.speed,
        neonGlow: packet.neonGlow + Math.sin(Date.now() * 0.008) * 0.2,
        hackingProgress: packet.hackingProgress + 0.01
      })).filter(packet => packet.y < (typeof window !== 'undefined' ? window.innerHeight + 100 : 900))
    );
  };

  // Handle packet click (hacking)
  const handlePacketClick = (packet: DataPacket) => {
    if (packet.clicked) return;

    // Mark as clicked to prevent double-clicks
    setDataPackets(prev =>
      prev.map(p => p.id === packet.id ? { ...p, clicked: true, hackingProgress: 1 } : p)
    );

    if (packet.isCorrect) {
      // Correct word clicked - successful hack
      const newWordsCollected = [...wordsCollected, packet.word];
      setWordsCollected(newWordsCollected);
      
      // Create success particles (digital explosion)
      const successParticles = themeEngine.current.createParticleEffect(
        packet.x, packet.y, 'success', 15
      );
      setParticles(prev => [...prev, ...successParticles]);
      
      // Create digital hack effect
      createHackEffect(packet.x, packet.y);
      
      // Play success sound
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
      // Incorrect word clicked - hack failed
      const errorParticles = themeEngine.current.createParticleEffect(
        packet.x, packet.y, 'error', 10
      );
      setParticles(prev => [...prev, ...errorParticles]);
      
      // Play error sound
      playSFX('wrong-answer');
      
      onIncorrectAnswer();
    }

    // Remove clicked packet after animation
    setTimeout(() => {
      setDataPackets(prev => prev.filter(p => p.id !== packet.id));
    }, 400);
  };

  // Create digital hack effect
  const createHackEffect = (x: number, y: number) => {
    // Create expanding digital rings
    const hackRings = Array.from({ length: 3 }, (_, i) => ({
      id: `hack-ring-${Date.now()}-${i}`,
      x,
      y,
      delay: i * 100
    }));

    // Add visual effect (could be implemented with additional state)
    console.log('Hack effect at', x, y);
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

  // Spawn packets when challenge changes
  useEffect(() => {
    if (currentChallenge && gameActive) {
      setWordsCollected([]);
      setChallengeProgress(0);
      spawnDataPackets();
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
          <source src="/games/noughts-and-crosses/images/tokyo-nights/tokyo-nights-bg.mp4" type="video/mp4" />
        </video>

        {/* Video overlay gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

{/* English Sentence Display */}
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-50">

        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 border border-pink-500/30">
          <div className="text-center">
            <div className="text-sm text-pink-300 mb-1">💻 Decode this message:</div>
            <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
            <div className="text-sm text-cyan-300 mt-2">
              Click the {currentChallenge.targetLanguage} data packets in the correct order
            </div>
          </div>
        </div>
      </div>

      {/* Tokyo Nights Background */}
      <div className="absolute inset-0">
        {/* Digital rain effect */}
        {digitalRain.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-px bg-gradient-to-b from-pink-500 via-purple-500 to-transparent"
            style={{
              left: `${drop.x}%`,
              height: '100px'
            }}
            animate={{
              y: [-100, window.innerHeight + 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: 'linear'
            }}
          />
        ))}
        
        {/* Neon grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }, (_, i) => (
              <div key={i} className="border border-pink-500/20" />
            ))}
          </div>
        </div>
        
        {/* Cyberpunk glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10" />
      </div>

      {/* Data Packets */}
      <AnimatePresence>
        {dataPackets.map((packet) => (
          <DataPacketComponent
            key={packet.id}
            packet={packet}
            onClick={() => handlePacketClick(packet)}
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
              height: particle.size,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
          />
        ))}
      </AnimatePresence>


    </div>
  );
}

// Data Packet Component
const DataPacketComponent: React.FC<{
  packet: DataPacket;
  onClick: () => void;
}> = ({ packet, onClick }) => {
  const packetStyles = {
    data: {
      bg: 'from-cyan-500 to-blue-600',
      border: 'border-cyan-400',
      shadow: 'shadow-cyan-400/60',
      icon: '📦'
    },
    encrypted: {
      bg: 'from-pink-500 to-purple-600',
      border: 'border-pink-400',
      shadow: 'shadow-pink-400/60',
      icon: '🔒'
    },
    corrupted: {
      bg: 'from-red-500 to-orange-600',
      border: 'border-red-400',
      shadow: 'shadow-red-400/60',
      icon: '⚠️'
    }
  };

  const style = packetStyles[packet.packetType];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: packet.x, y: packet.y }}
      animate={{
        opacity: packet.clicked ? 0 : 1,
        scale: packet.clicked ? 0.5 : packet.scale,
        x: packet.x,
        y: packet.y
      }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
      className="absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none"
    >
      <div className={`bg-gradient-to-r ${style.bg} text-white border-2 ${style.border} shadow-2xl ${style.shadow} rounded-lg px-4 py-3 font-mono backdrop-blur-sm bg-opacity-90 min-w-[140px] text-center relative overflow-hidden`}>
        {/* Scanning lines effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-4"
          animate={{ y: [-20, 80] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Digital glitch effect */}
        {packet.clicked && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">{style.icon}</span>
            <span className="text-xs text-gray-300">PKT_{packet.id.slice(-4)}</span>
          </div>
          <div className="font-bold text-sm drop-shadow-md">
            {packet.word.toUpperCase()}
          </div>
        </div>
        
        {/* Neon glow effect */}
        <div 
          className={`absolute inset-0 rounded-lg border ${style.border}/50`}
          style={{
            boxShadow: `inset 0 0 ${packet.neonGlow * 15}px rgba(236, 72, 153, 0.3), 0 0 ${packet.neonGlow * 20}px ${style.shadow.includes('cyan') ? 'rgba(6, 182, 212, 0.4)' : style.shadow.includes('pink') ? 'rgba(236, 72, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
          }}
        />
      </div>
    </motion.div>
  );
};

// Theme engine implementation
class TokyoNightsThemeEngine extends BaseThemeEngine {
  // Inherits all base functionality
}
