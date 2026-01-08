'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Star, Trophy } from 'lucide-react';

interface Block {
  id: string;
  type: 'standard' | 'bonus' | 'challenge' | 'fragile';
  word: string;
  translation: string;
  sprite?: PIXI.Sprite;
  container?: PIXI.Container;
  particles?: PIXI.Container;
}

interface PixiTowerGameProps {
  blocks: Block[];
  onBlockAdded: (block: Block) => void;
  onBlockFallen: (blockId: string) => void;
  gameState: 'ready' | 'playing' | 'completed' | 'failed';
}

export const PixiTowerGame: React.FC<PixiTowerGameProps> = ({
  blocks,
  onBlockAdded,
  onBlockFallen,
  gameState
}) => {
  const pixiRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const towerContainerRef = useRef<PIXI.Container | null>(null);
  const particleContainerRef = useRef<PIXI.Container | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Pixi.js application
  useEffect(() => {
    if (!pixiRef.current) return;

    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x0a0a0a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    pixiRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Create main containers
    const towerContainer = new PIXI.Container();
    const particleContainer = new PIXI.Container();
    const backgroundContainer = new PIXI.Container();

    app.stage.addChild(backgroundContainer);
    app.stage.addChild(towerContainer);
    app.stage.addChild(particleContainer);

    towerContainerRef.current = towerContainer;
    particleContainerRef.current = particleContainer;

    // Create animated background
    createAnimatedBackground(app, backgroundContainer);

    // Create base platform
    createBasePlatform(towerContainer);

    setIsReady(true);

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  // Create stunning animated background
  const createAnimatedBackground = (app: PIXI.Application, container: PIXI.Container) => {
    // Create city skyline
    for (let i = 0; i < 15; i++) {
      const building = new PIXI.Graphics();
      const height = 100 + Math.random() * 200;
      const width = 40 + Math.random() * 60;
      
      // Building gradient
      building.beginFill(0x1a1a2e + Math.random() * 0x333333);
      building.drawRect(0, 0, width, height);
      building.endFill();
      
      building.x = i * 60 - 50;
      building.y = app.screen.height - height - 50;
      
      container.addChild(building);

      // Add windows
      for (let j = 0; j < Math.floor(height / 20); j++) {
        for (let k = 0; k < Math.floor(width / 15); k++) {
          if (Math.random() > 0.6) {
            const window = new PIXI.Graphics();
            window.beginFill(0xffa500);
            window.drawRect(k * 15 + 5, j * 20 + 5, 8, 12);
            window.endFill();
            
            // Animate window flickering
            gsap.to(window, {
              alpha: 0.3 + Math.random() * 0.7,
              duration: 2 + Math.random() * 3,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut"
            });
            
            building.addChild(window);
          }
        }
      }
    }

    // Create floating particles
    for (let i = 0; i < 50; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(0xffffff);
      particle.drawCircle(0, 0, 1 + Math.random() * 2);
      particle.endFill();
      particle.alpha = 0.3 + Math.random() * 0.7;
      
      particle.x = Math.random() * app.screen.width;
      particle.y = Math.random() * app.screen.height;
      
      container.addChild(particle);

      // Animate particles floating
      gsap.to(particle, {
        y: particle.y - 200 - Math.random() * 300,
        x: particle.x + (Math.random() - 0.5) * 100,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        ease: "none",
        onComplete: () => {
          particle.y = app.screen.height + 10;
          particle.x = Math.random() * app.screen.width;
        }
      });
    }

    // Create construction crane
    const crane = createConstructionCrane();
    crane.x = app.screen.width - 200;
    crane.y = 50;
    container.addChild(crane);
  };

  // Create construction crane
  const createConstructionCrane = () => {
    const crane = new PIXI.Container();
    
    // Mast
    const mast = new PIXI.Graphics();
    mast.lineStyle(8, 0xff8c00);
    mast.moveTo(0, 0);
    mast.lineTo(0, 300);
    crane.addChild(mast);

    // Horizontal jib
    const jib = new PIXI.Graphics();
    jib.lineStyle(6, 0xff8c00);
    jib.moveTo(-100, 50);
    jib.lineTo(150, 50);
    crane.addChild(jib);

    // Support cables
    const cable1 = new PIXI.Graphics();
    cable1.lineStyle(2, 0xff8c00);
    cable1.moveTo(0, 0);
    cable1.lineTo(-80, 50);
    crane.addChild(cable1);

    const cable2 = new PIXI.Graphics();
    cable2.lineStyle(2, 0xff8c00);
    cable2.moveTo(0, 0);
    cable2.lineTo(130, 50);
    crane.addChild(cable2);

    // Hanging hook with animated block
    const hookContainer = new PIXI.Container();
    hookContainer.x = 100;
    hookContainer.y = 50;

    const hookLine = new PIXI.Graphics();
    hookLine.lineStyle(3, 0xff8c00);
    hookLine.moveTo(0, 0);
    hookLine.lineTo(0, 80);
    hookContainer.addChild(hookLine);

    // Animated construction block
    const block = new PIXI.Graphics();
    block.beginFill(0xff6b35);
    block.lineStyle(2, 0xff8c00);
    block.drawRect(-15, 70, 30, 20);
    block.endFill();
    hookContainer.addChild(block);

    // Animate the hanging block
    gsap.to(block, {
      y: 5,
      rotation: 0.1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    crane.addChild(hookContainer);
    return crane;
  };

  // Create base platform
  const createBasePlatform = (container: PIXI.Container) => {
    const platform = new PIXI.Graphics();
    platform.beginFill(0x444444);
    platform.lineStyle(4, 0x666666);
    platform.drawRoundedRect(-100, 0, 200, 30, 10);
    platform.endFill();
    
    platform.x = 400;
    platform.y = 550;
    
    container.addChild(platform);

    // Add platform glow effect
    const glow = new PIXI.Graphics();
    glow.beginFill(0x00ffff, 0.3);
    glow.drawRoundedRect(-105, -5, 210, 40, 15);
    glow.endFill();
    glow.filters = [new PIXI.BlurFilter(10)];
    
    platform.addChild(glow);
  };

  // Create amazing block with effects
  const createBlock = useCallback((block: Block, index: number) => {
    if (!towerContainerRef.current || !appRef.current) return;

    const blockContainer = new PIXI.Container();
    
    // Block base
    const blockGraphics = new PIXI.Graphics();
    let color = 0x3498db; // default blue
    
    switch (block.type) {
      case 'bonus':
        color = 0xf39c12; // orange
        break;
      case 'challenge':
        color = 0xe74c3c; // red
        break;
      case 'fragile':
        color = 0x95a5a6; // gray
        break;
      default:
        color = 0x3498db; // blue
    }
    
    // Create block with gradient effect
    blockGraphics.beginFill(color);
    blockGraphics.lineStyle(3, color + 0x222222);
    blockGraphics.drawRoundedRect(-60, -20, 120, 40, 8);
    blockGraphics.endFill();
    
    // Add inner highlight
    const highlight = new PIXI.Graphics();
    highlight.beginFill(0xffffff, 0.3);
    highlight.drawRoundedRect(-55, -15, 110, 15, 5);
    highlight.endFill();
    blockGraphics.addChild(highlight);
    
    blockContainer.addChild(blockGraphics);

    // Add text
    const text = new PIXI.Text(block.word, {
      fontFamily: 'Arial Black',
      fontSize: 14,
      fill: 0xffffff,
      fontWeight: 'bold',
      align: 'center'
    });
    text.anchor.set(0.5);
    blockContainer.addChild(text);

    // Position block
    blockContainer.x = 400;
    blockContainer.y = 520 - (index * 45);
    
    // Add to tower
    towerContainerRef.current.addChild(blockContainer);
    block.container = blockContainer;

    // Animate block falling into place
    blockContainer.y = -100;
    gsap.to(blockContainer, {
      y: 520 - (index * 45),
      duration: 0.8,
      ease: "bounce.out",
      onComplete: () => {
        // Add landing particles
        createLandingParticles(blockContainer.x, blockContainer.y, color);
        
        // Add glow effect for special blocks
        if (block.type !== 'standard') {
          const glow = new PIXI.Graphics();
          glow.beginFill(color, 0.5);
          glow.drawRoundedRect(-70, -30, 140, 60, 15);
          glow.endFill();
          glow.filters = [new PIXI.BlurFilter(15)];
          blockContainer.addChildAt(glow, 0);
          
          // Animate glow
          gsap.to(glow, {
            alpha: 0.2,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          });
        }
      }
    });

    // Scale animation
    blockContainer.scale.set(0);
    gsap.to(blockContainer.scale, {
      x: 1,
      y: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

  }, []);

  // Create particle effects
  const createLandingParticles = (x: number, y: number, color: number) => {
    if (!particleContainerRef.current) return;

    for (let i = 0; i < 20; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(color);
      particle.drawCircle(0, 0, 2 + Math.random() * 3);
      particle.endFill();
      
      particle.x = x;
      particle.y = y;
      
      particleContainerRef.current.addChild(particle);

      // Animate particles exploding outward
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 50 + Math.random() * 100;
      const targetX = x + Math.cos(angle) * speed;
      const targetY = y + Math.sin(angle) * speed;

      gsap.to(particle, {
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: 0,
        duration: 1 + Math.random(),
        ease: "power2.out",
        onComplete: () => {
          if (particleContainerRef.current?.children.includes(particle)) {
            particleContainerRef.current.removeChild(particle);
          }
        }
      });
    }
  };

  // Create explosion effect for falling blocks
  const createExplosionEffect = (x: number, y: number) => {
    if (!particleContainerRef.current) return;

    for (let i = 0; i < 50; i++) {
      const particle = new PIXI.Graphics();
      const color = [0xff6b35, 0xffa500, 0xff4444, 0xffff00][Math.floor(Math.random() * 4)];
      particle.beginFill(color);
      particle.drawStar(0, 0, 5, 3 + Math.random() * 5, 1 + Math.random() * 3);
      particle.endFill();
      
      particle.x = x;
      particle.y = y;
      
      particleContainerRef.current.addChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      const targetX = x + Math.cos(angle) * speed;
      const targetY = y + Math.sin(angle) * speed;

      gsap.to(particle, {
        x: targetX,
        y: targetY,
        rotation: Math.random() * Math.PI * 4,
        alpha: 0,
        scale: 0,
        duration: 1.5 + Math.random(),
        ease: "power2.out",
        onComplete: () => {
          if (particleContainerRef.current?.children.includes(particle)) {
            particleContainerRef.current.removeChild(particle);
          }
        }
      });
    }
  };

  // Handle falling blocks
  const handleBlockFall = useCallback((blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.container) return;

    // Create explosion effect
    createExplosionEffect(block.container.x, block.container.y);

    // Animate block falling
    gsap.to(block.container, {
      y: 700,
      rotation: Math.random() > 0.5 ? Math.PI : -Math.PI,
      x: block.container.x + (Math.random() - 0.5) * 200,
      alpha: 0,
      duration: 1.5,
      ease: "power2.in",
      onComplete: () => {
        if (towerContainerRef.current && block.container) {
          towerContainerRef.current.removeChild(block.container);
        }
        onBlockFallen(blockId);
      }
    });
  }, [blocks, onBlockFallen]);

  // Update blocks when they change
  useEffect(() => {
    if (!isReady) return;

    blocks.forEach((block, index) => {
      if (!block.container) {
        createBlock(block, index);
      }
    });
  }, [blocks, isReady, createBlock]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700">
      <div ref={pixiRef} className="w-full h-full" />
      
      {/* Overlay UI elements */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-bold">PIXI.JS POWERED</span>
          </div>
        </motion.div>
      </div>

      {/* Power indicators */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <motion.div
          className="bg-orange-500/80 backdrop-blur-md rounded-xl p-3 border border-orange-300/50"
          animate={{ 
            boxShadow: ["0 0 20px rgba(249, 115, 22, 0.5)", "0 0 40px rgba(249, 115, 22, 0.8)", "0 0 20px rgba(249, 115, 22, 0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="h-6 w-6 text-white" />
        </motion.div>
        
        <motion.div
          className="bg-blue-500/80 backdrop-blur-md rounded-xl p-3 border border-blue-300/50"
          animate={{ 
            rotate: [0, 360]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="h-6 w-6 text-white" />
        </motion.div>
        
        <motion.div
          className="bg-yellow-500/80 backdrop-blur-md rounded-xl p-3 border border-yellow-300/50"
          animate={{ 
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Star className="h-6 w-6 text-white" />
        </motion.div>
      </div>

      {/* Performance indicator */}
      <div className="absolute bottom-4 left-4 z-10">
        <motion.div
          className="bg-green-600/80 backdrop-blur-md rounded-xl p-3 border border-green-400/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-white text-sm font-bold">60 FPS</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
