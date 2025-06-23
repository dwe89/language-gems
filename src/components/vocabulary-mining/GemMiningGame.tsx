import React, { useEffect, useRef } from 'react';
// Use dynamic import for Phaser to avoid build-time issues with Next.js SSR

interface GemMiningGameProps {
  /**
   * An incrementing key or timestamp that changes whenever the user answers a question.
   * The parent component should update this value after calling onAnswer to trigger
   * the appropriate animation inside the Phaser scene.
   */
  answerKey: number;
  wasCorrect: boolean;
}

export default function GemMiningGame({ answerKey, wasCorrect }: GemMiningGameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<any>(null);
  const createdRef = useRef(false);
  const lastAnswerKey = useRef<number>(answerKey);

  useEffect(() => {
    if (createdRef.current || !containerRef.current) return;

    let phaserInstance: any;

    (async () => {
      const PhaserMod = await import('phaser');

      class GemMiningScene extends PhaserMod.Scene {
        constructor() {
          super({ key: 'GemMiningScene' });
        }

        create() {
          sceneRef.current = this;

          // Enhanced background with depth
          const background = this.add.rectangle(200, 150, 400, 300, 0x1a1a2e);
          const gradient = this.add.graphics();
          gradient.fillGradientStyle(0x16213e, 0x16213e, 0x0f3460, 0x0f3460, 1);
          gradient.fillRect(0, 0, 400, 300);

          // Add animated background particles
          this.createBackgroundParticles();

          // Enhanced mine entrance with animated elements
          this.createMineEntrance();

          // Add title with better styling
          const title = this.add.text(200, 30, 'Gem Mine', {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            color: '#ffd700',
            stroke: '#8b4513',
            strokeThickness: 3,
            shadow: {
              offsetX: 2,
              offsetY: 2,
              color: '#000000',
              blur: 3,
              fill: true
            }
          }).setOrigin(0.5, 0.5);

          // Add sparkling effect to title
          this.tweens.add({
            targets: title,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });

          // Enhanced ground with texture
          const ground = this.add.rectangle(200, 290, 400, 20, 0x4a5d3a);
          this.physics.add.existing(ground, true);

          // Add ground details
          for (let i = 0; i < 8; i++) {
            const grassBlade = this.add.rectangle(
              50 + i * 40 + Phaser.Math.Between(-10, 10), 
              285, 
              2, 
              8, 
              0x5a6d4a
            );
            this.tweens.add({
              targets: grassBlade,
              scaleX: 0.8,
              duration: 2000 + i * 100,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }

          // Add ambient lighting effects
          this.createAmbientEffects();
        }

        createBackgroundParticles() {
          // Floating dust particles
          const particles = this.add.particles(0, 0, 'dust', {
            x: { min: 0, max: 400 },
            y: { min: 0, max: 300 },
            scale: { min: 0.1, max: 0.3 },
            alpha: { min: 0.1, max: 0.4 },
            lifespan: 8000,
            frequency: 200,
            speed: { min: 5, max: 15 },
            blendMode: 'ADD'
          });

          // Create dust texture on the fly
          this.add.graphics()
            .fillStyle(0xffffff)
            .fillCircle(1, 1, 1)
            .generateTexture('dust', 3, 3);
        }

        createMineEntrance() {
          // Mine cart tracks
          const trackLeft = this.add.rectangle(120, 280, 2, 40, 0x8B4513);
          const trackRight = this.add.rectangle(140, 280, 2, 40, 0x8B4513);
          
          // Track ties
          for (let i = 0; i < 4; i++) {
            this.add.rectangle(130, 265 + i * 10, 25, 3, 0x654321);
          }

          // Mine cart
          const cart = this.add.graphics();
          cart.fillStyle(0x666666);
          cart.fillRoundedRect(110, 250, 40, 20, 3);
          cart.fillStyle(0x444444);
          cart.fillCircle(120, 275, 5);
          cart.fillCircle(140, 275, 5);

          // Add gentle bobbing animation to cart
          this.tweens.add({
            targets: cart,
            y: cart.y - 2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });

          // Mine entrance archway
          const archway = this.add.graphics();
          archway.fillStyle(0x2d2d2d);
          archway.fillRect(260, 200, 80, 90);
          archway.fillStyle(0x1a1a1a);
          archway.fillEllipse(300, 200, 80, 40);

          // Add depth to entrance
          const innerArchway = this.add.graphics();
          innerArchway.fillStyle(0x0f0f0f);
          innerArchway.fillEllipse(300, 205, 60, 30);
        }

        createAmbientEffects() {
          // Gentle pulsing light from mine entrance
          const light = this.add.circle(300, 205, 30, 0xffff88, 0.2);
          this.tweens.add({
            targets: light,
            alpha: 0.1,
            scale: 0.8,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });

          // Random sparkles
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              const sparkle = this.add.circle(
                Phaser.Math.Between(50, 350),
                Phaser.Math.Between(80, 220),
                2,
                0xffffff,
                0.8
              );
              
              this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 2,
                duration: 1000,
                onComplete: () => sparkle.destroy()
              });
            },
            loop: true
          });
        }

        createGemParticles(x: number, y: number, color: number, isCorrect: boolean) {
          // Create gem particle system
          const particleCount = isCorrect ? 15 : 8;
          const baseSpeed = isCorrect ? 80 : 50;
          
          for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = baseSpeed + Phaser.Math.Between(-20, 20);
            
            const particle = this.add.circle(x, y, Phaser.Math.Between(2, 4), color, 0.9);
            
            this.tweens.add({
              targets: particle,
              x: x + Math.cos(angle) * speed,
              y: y + Math.sin(angle) * speed - Phaser.Math.Between(0, 30),
              alpha: 0,
              scale: 0.1,
              duration: 1500,
              ease: 'Quad.easeOut',
              onComplete: () => particle.destroy()
            });
          }

          // Add screen shake for correct answers
          if (isCorrect) {
            this.cameras.main.shake(200, 0.005);
          }
        }

        createFloatingText(x: number, y: number, text: string, color: string) {
          const floatingText = this.add.text(x, y, text, {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: color,
            stroke: '#000000',
            strokeThickness: 2
          }).setOrigin(0.5);

          this.tweens.add({
            targets: floatingText,
            y: y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 2000,
            ease: 'Quad.easeOut',
            onComplete: () => floatingText.destroy()
          });
        }

        animateGemDrop(x: number, color: number, isCorrect: boolean) {
          // Enhanced gem creation with better visual design
          const gem = this.add.graphics();
          
          // Create diamond shape
          const size = 15;
          gem.fillStyle(color);
          gem.beginPath();
          gem.moveTo(0, -size);
          gem.lineTo(size * 0.7, 0);
          gem.lineTo(0, size);
          gem.lineTo(-size * 0.7, 0);
          gem.closePath();
          gem.fillPath();
          
          // Add inner shine
          gem.fillStyle(0xffffff, 0.3);
          gem.beginPath();
          gem.moveTo(-3, -8);
          gem.lineTo(3, -8);
          gem.lineTo(1, -4);
          gem.lineTo(-1, -4);
          gem.closePath();
          gem.fillPath();
          
          gem.setPosition(x, 0);

          // Enhanced physics animation
          this.physics.add.existing(gem);
          const body = gem.body as Phaser.Physics.Arcade.Body;
          body.setVelocity(
            Phaser.Math.Between(-30, 30),
            Phaser.Math.Between(50, 100)
          );
          body.setBounce(0.6, 0.4);
          body.setCollideWorldBounds(true);

          // Spinning animation
          this.tweens.add({
            targets: gem,
            rotation: Math.PI * 4,
            duration: 3000,
            ease: 'Linear'
          });

          // Glow effect
          this.tweens.add({
            targets: gem,
            alpha: 0.7,
            duration: 300,
            yoyo: true,
            repeat: 8
          });

          // Create particle explosion on landing
          this.time.delayedCall(2000, () => {
            this.createGemParticles(gem.x, gem.y, color, isCorrect);
            
            // Add floating text
            if (isCorrect) {
              this.createFloatingText(gem.x, gem.y - 20, '+100', '#00ff00');
            } else {
              this.createFloatingText(gem.x, gem.y - 20, 'Try Again', '#ff6666');
            }
          });

          // Auto cleanup
          this.time.delayedCall(4000, () => {
            if (gem.scene) {
              this.tweens.add({
                targets: gem,
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => gem.destroy()
              });
            }
          });
        }
      }

      const config: any = {
        type: PhaserMod.AUTO,
        width: 400,
        height: 300,
        parent: containerRef.current!,
        backgroundColor: '#1e1e2f',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 200 },
            debug: false,
          },
        },
        scene: GemMiningScene
      };

      phaserInstance = new PhaserMod.Game(config);
      createdRef.current = true;
    })();

    // Cleanup on unmount
    return () => {
      if (phaserInstance) {
        phaserInstance.destroy(true);
      }
    };
  }, []);

  // Effect to handle answer animations with enhanced feedback
  useEffect(() => {
    if (!sceneRef.current || answerKey === lastAnswerKey.current) return;

    lastAnswerKey.current = answerKey;

    const scene: any = sceneRef.current;

    // Enhanced gem drop with better positioning and effects
    const x = Math.floor(Math.random() * 300) + 50;
    const color = wasCorrect ? 0x00c853 : 0xd32f2f;

    // Add environmental reaction
    if (wasCorrect) {
      // Successful mining - brighter environment
      scene.cameras.main.flash(200, 0, 255, 0, false, (camera: any, progress: number) => {
        if (progress === 1) {
          scene.tweens.add({
            targets: scene.children.list.filter((child: any) => child.type === 'Graphics'),
            alpha: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Sine.easeInOut'
          });
        }
      });
    } else {
      // Failed attempt - subtle red tint
      scene.cameras.main.flash(100, 255, 100, 100);
    }

    // Enhanced gem animation
    scene.animateGemDrop(x, color, wasCorrect);

  }, [answerKey, wasCorrect]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[300px] rounded-xl overflow-hidden border-2 border-indigo-300/50 shadow-inner bg-gradient-to-b from-slate-800 to-slate-900"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e1b4b 100%)'
      }}
    />
  );
} 