'use client';

import React, { useRef, useEffect } from 'react';

interface ClassicHangmanAnimationProps {
  mistakes: number;
  maxMistakes: number;
}

export default function ClassicHangmanAnimation({ mistakes, maxMistakes }: ClassicHangmanAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing style
    ctx.strokeStyle = '#374151'; // Gray-700 for classic look
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw gallows (always visible)
    ctx.beginPath();
    // Base
    ctx.moveTo(50, 270);
    ctx.lineTo(150, 270);
    // Pole
    ctx.moveTo(100, 270);
    ctx.lineTo(100, 30);
    // Top beam
    ctx.lineTo(200, 30);
    // Noose
    ctx.lineTo(200, 60);
    ctx.stroke();

    // Draw hangman parts based on mistakes
    if (mistakes > 0) {
      // Head
      ctx.beginPath();
      ctx.arc(200, 85, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (mistakes > 1) {
      // Body
      ctx.beginPath();
      ctx.moveTo(200, 105);
      ctx.lineTo(200, 180);
      ctx.stroke();
    }

    if (mistakes > 2) {
      // Left arm
      ctx.beginPath();
      ctx.moveTo(200, 130);
      ctx.lineTo(160, 150);
      ctx.stroke();
    }

    if (mistakes > 3) {
      // Right arm
      ctx.beginPath();
      ctx.moveTo(200, 130);
      ctx.lineTo(240, 150);
      ctx.stroke();
    }

    if (mistakes > 4) {
      // Left leg
      ctx.beginPath();
      ctx.moveTo(200, 180);
      ctx.lineTo(170, 220);
      ctx.stroke();
    }

    if (mistakes > 5) {
      // Right leg
      ctx.beginPath();
      ctx.moveTo(200, 180);
      ctx.lineTo(230, 220);
      ctx.stroke();
      
      // Add X eyes for final state
      ctx.strokeStyle = '#dc2626'; // Red for dramatic effect
      ctx.lineWidth = 2;
      
      // Left X
      ctx.beginPath();
      ctx.moveTo(192, 77);
      ctx.lineTo(200, 85);
      ctx.moveTo(200, 77);
      ctx.lineTo(192, 85);
      ctx.stroke();
      
      // Right X
      ctx.beginPath();
      ctx.moveTo(200, 77);
      ctx.lineTo(208, 85);
      ctx.moveTo(208, 77);
      ctx.lineTo(200, 85);
      ctx.stroke();
    }
  }, [mistakes, maxMistakes]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
        <canvas 
          ref={canvasRef}
          className="block mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}
