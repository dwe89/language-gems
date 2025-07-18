'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'sparkle' | 'dust' | 'star' | 'debris';
}

interface ParticleSystemProps {
  trigger: boolean;
  position: { x: number; y: number };
  type: 'success' | 'error' | 'placement' | 'destruction';
  intensity?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  trigger,
  position,
  type,
  intensity = 1
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const particleConfigs = {
    success: {
      count: 15 * intensity,
      colors: ['#FFD700', '#FFA500', '#FF6347', '#98FB98'],
      types: ['sparkle', 'star'] as const,
      velocity: { min: 2, max: 8 },
      life: { min: 800, max: 1500 }
    },
    error: {
      count: 10 * intensity,
      colors: ['#FF4500', '#DC143C', '#8B0000', '#696969'],
      types: ['debris', 'dust'] as const,
      velocity: { min: 1, max: 5 },
      life: { min: 600, max: 1200 }
    },
    placement: {
      count: 8 * intensity,
      colors: ['#87CEEB', '#4169E1', '#00CED1', '#FFFFFF'],
      types: ['dust', 'sparkle'] as const,
      velocity: { min: 1, max: 4 },
      life: { min: 500, max: 1000 }
    },
    destruction: {
      count: 20 * intensity,
      colors: ['#A0522D', '#8B4513', '#696969', '#2F4F4F'],
      types: ['debris', 'dust'] as const,
      velocity: { min: 3, max: 10 },
      life: { min: 800, max: 1800 }
    }
  };

  const createParticles = () => {
    const config = particleConfigs[type];
    const newParticles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 * i) / config.count + Math.random() * 0.5;
      const velocity = config.velocity.min + Math.random() * (config.velocity.max - config.velocity.min);
      const life = config.life.min + Math.random() * (config.life.max - config.life.min);
      
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: position.x,
        y: position.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: life,
        maxLife: life,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: 2 + Math.random() * 4,
        type: config.types[Math.floor(Math.random() * config.types.length)]
      });
    }

    setParticles(newParticles);
  };

  useEffect(() => {
    if (trigger) {
      createParticles();
    }
  }, [trigger, position, type, intensity]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.2, // gravity
            vx: particle.vx * 0.98, // air resistance
            life: particle.life - 16
          }))
          .filter(particle => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  const getParticleStyle = (particle: Particle) => {
    const opacity = particle.life / particle.maxLife;
    const scale = particle.type === 'star' ? 0.5 + (opacity * 0.5) : opacity;
    
    return {
      position: 'absolute' as const,
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      backgroundColor: particle.color,
      opacity: opacity,
      transform: `scale(${scale}) rotate(${(1 - opacity) * 180}deg)`,
      borderRadius: particle.type === 'star' ? '2px' : '50%',
      pointerEvents: 'none' as const,
      zIndex: 40
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          style={getParticleStyle(particle)}
        />
      ))}
    </div>
  );
};
