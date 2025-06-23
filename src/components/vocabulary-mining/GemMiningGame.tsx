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
  const sceneRef = useRef<Phaser.Scene | null>(null);
  const createdRef = useRef(false);
  const lastAnswerKey = useRef<number>(answerKey);

  useEffect(() => {
    if (createdRef.current || !containerRef.current) return;

    let phaserInstance: any;

    (async () => {
      const PhaserMod = await import('phaser');

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
        scene: {
          create: function create(this: any) {
            sceneRef.current = this;

            this.add
              .text(200, 25, 'Gem Mine', {
                fontFamily: 'Verdana',
                fontSize: '18px',
                color: '#ffffff',
              })
              .setOrigin(0.5, 0.5);

            // Add ground
            const ground = this.add.rectangle(200, 290, 400, 20, 0x6b4f31);
            this.physics.add.existing(ground, true);
          },
        },
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

  // Effect to handle answer animations
  useEffect(() => {
    if (!sceneRef.current || answerKey === lastAnswerKey.current) return;

    lastAnswerKey.current = answerKey;

    const scene: any = sceneRef.current;

    const x = Math.floor(Math.random() * 300) + 50;
    const color = wasCorrect ? 0x00c853 : 0xd32f2f;

    const diamondWidth = 20;
    const diamondHeight = 25;

    const graphics = scene.add.graphics({ fillStyle: { color } });
    const points = [
      { x: 0, y: -diamondHeight / 2 },
      { x: diamondWidth / 2, y: 0 },
      { x: 0, y: diamondHeight / 2 },
      { x: -diamondWidth / 2, y: 0 },
    ];

    graphics.fillPoints(points, true);
    graphics.setPosition(x, 0);

    scene.tweens.add({
      targets: graphics,
      y: 260,
      alpha: 0,
      duration: 2000,
      ease: 'Quad.easeIn',
      onComplete: () => graphics.destroy(),
    });
  }, [answerKey, wasCorrect]);

  return <div ref={containerRef} className="w-full h-[300px]" />;
} 