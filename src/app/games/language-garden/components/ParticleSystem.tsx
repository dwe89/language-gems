import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect, memo } from 'react';

interface Particle {
  id: string;
  type: 'success' | 'growth' | 'magic' | 'water' | 'sparkle' | 'gem' | 'xp' | 'heart';
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  velocity: { x: number; y: number };
  gravity: number;
  emoji?: string;
}

interface ParticleSystemOptions {
  count?: number;
  spread?: number;
  velocity?: { min: number; max: number };
  gravity?: number;
  size?: { min: number; max: number };
  duration?: { min: number; max: number };
}

export const useParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const cleanupTimeouts = useRef<Set<NodeJS.Timeout>>(new Set());

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      cleanupTimeouts.current.forEach(timeout => clearTimeout(timeout));
      cleanupTimeouts.current.clear();
    };
  }, []);

  const createParticles = useCallback((
    type: Particle['type'],
    position: { x: number; y: number },
    options: ParticleSystemOptions = {}
  ) => {
    const {
      count = 10,
      spread = 100,
      velocity = { min: -2, max: 2 },
      gravity = 0.1,
      size = { min: 4, max: 12 },
      duration = { min: 1000, max: 2000 }
    } = options;

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 3 + 1;

      return {
        id: `${type}-${Date.now()}-${i}`,
        type,
        x: position.x + (Math.random() - 0.5) * spread,
        y: position.y + (Math.random() - 0.5) * spread,
        color: getParticleColor(type),
        size: Math.random() * (size.max - size.min) + size.min,
        duration: Math.random() * (duration.max - duration.min) + duration.min,
        velocity: {
          x: Math.cos(angle) * speed + (Math.random() - 0.5) * velocity.max,
          y: Math.sin(angle) * speed + (Math.random() - 0.5) * velocity.max
        },
        gravity,
        emoji: getParticleEmoji(type)
      };
    });

    setParticles(prev => [...prev, ...newParticles]);

    // Auto-cleanup with performance optimization
    const maxDuration = Math.max(...newParticles.map(p => p.duration));
    const timeout = setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
      cleanupTimeouts.current.delete(timeout);
    }, maxDuration + 500);

    cleanupTimeouts.current.add(timeout);
  }, []);

  const ParticleRenderer = memo(() => (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {particles.map((particle) => (
          <ParticleComponent key={particle.id} particle={particle} />
        ))}
      </AnimatePresence>
    </div>
  ));

  ParticleRenderer.displayName = 'ParticleRenderer';

  return { createParticles, ParticleRenderer };
};

// Memoized particle component for better performance
const ParticleComponent = memo(({ particle }: { particle: Particle }) => {
  const isEmoji = particle.emoji && particle.type !== 'sparkle';

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        left: particle.x,
        top: particle.y,
        width: particle.size,
        height: particle.size,
        fontSize: isEmoji ? particle.size * 0.8 : undefined,
        backgroundColor: isEmoji ? 'transparent' : particle.color,
        borderRadius: isEmoji ? '0' : '50%',
        boxShadow: isEmoji ? 'none' : `0 0 ${particle.size * 2}px ${particle.color}`,
        filter: isEmoji ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : undefined
      }}
      initial={{
        opacity: 1,
        scale: 0,
        x: 0,
        y: 0
      }}
      animate={{
        opacity: [1, 0.9, 0.7, 0],
        scale: [0, 1.2, 1, 0.3],
        x: particle.velocity.x * 50,
        y: particle.velocity.y * 50 + particle.gravity * 100,
        rotate: isEmoji ? [0, 360] : [0, 180]
      }}
      exit={{
        opacity: 0,
        scale: 0
      }}
      transition={{
        duration: particle.duration / 1000,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {isEmoji ? particle.emoji : null}
    </motion.div>
  );
});

ParticleComponent.displayName = 'ParticleComponent';

const getParticleColor = (type: Particle['type']): string => {
  const colors: Record<Particle['type'], string> = {
    success: '#10b981',
    growth: '#22c55e',
    magic: '#a855f7',
    water: '#3b82f6',
    sparkle: '#fbbf24',
    gem: '#06b6d4',
    xp: '#f59e0b',
    heart: '#ef4444'
  };
  return colors[type];
};

const getParticleEmoji = (type: Particle['type']): string | undefined => {
  const emojis: Partial<Record<Particle['type'], string>> = {
    success: '✨',
    growth: '🌱',
    magic: '✨',
    gem: '💎',
    xp: '⭐',
    heart: '❤️'
  };
  return emojis[type];
};