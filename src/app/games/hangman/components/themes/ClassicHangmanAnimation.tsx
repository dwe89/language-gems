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

    // Set canvas size with higher DPI for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 300 * dpr;
    canvas.height = 300 * dpr;
    canvas.style.width = '300px';
    canvas.style.height = '300px';
    ctx.scale(dpr, dpr);

    // Clear canvas with subtle background
    ctx.fillStyle = '#fefefe';
    ctx.fillRect(0, 0, 300, 300);

    // Helper function for smoother lines
    const drawSmoothLine = (x1: number, y1: number, x2: number, y2: number, width: number = 4) => {
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // Draw ground with texture
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, 270, 300, 30);

    // Add grass texture
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    for (let i = 0; i < 300; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 270);
      ctx.lineTo(i + Math.random() * 3, 266 - Math.random() * 4);
      ctx.stroke();
    }

    // Draw enhanced gallows with wood texture
    ctx.strokeStyle = '#8b4513';
    ctx.fillStyle = '#a0522d';

    // Base with 3D effect
    ctx.fillRect(60, 262, 90, 15);
    ctx.strokeRect(60, 262, 90, 15);

    // Main pole with wood grain
    ctx.fillRect(105, 38, 15, 232);
    ctx.strokeRect(105, 38, 15, 232);

    // Add wood grain lines
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for (let i = 45; i < 262; i += 11) {
      ctx.beginPath();
      ctx.moveTo(107, i);
      ctx.lineTo(118, i + 6);
      ctx.stroke();
    }

    // Top beam with shadow
    ctx.fillStyle = '#a0522d';
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 3;
    ctx.fillRect(105, 30, 90, 15);
    ctx.strokeRect(105, 30, 90, 15);

    // Rope with realistic texture
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 4;
    drawSmoothLine(188, 45, 188, 75, 4);

    // Add rope texture
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1;
    for (let i = 49; i < 71; i += 2) {
      ctx.beginPath();
      ctx.moveTo(186, i);
      ctx.lineTo(190, i);
      ctx.stroke();
    }

    // Noose loop
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(188, 83, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Shadow under gallows
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.ellipse(113, 277, 45, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw hangman parts with improved styling
    const drawFigure = () => {
      ctx.strokeStyle = '#2d1810';
      ctx.fillStyle = '#f4d1a6'; // Skin tone

      if (mistakes > 0) {
        // Head with face
        ctx.beginPath();
        ctx.arc(188, 98, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#f4d1a6';
        ctx.fill();
        ctx.strokeStyle = '#2d1810';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eyes (alive state)
        if (mistakes < 6) {
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(183, 94, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(193, 94, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Mouth (gets sadder with more mistakes)
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (mistakes < 3) {
            // Neutral mouth
            ctx.moveTo(184, 101);
            ctx.lineTo(192, 101);
          } else {
            // Sad mouth
            ctx.arc(188, 99, 4, 0.2, Math.PI - 0.2);
          }
          ctx.stroke();
        }
      }

      if (mistakes > 1) {
        // Body with shirt
        ctx.strokeStyle = '#4169e1';
        ctx.lineWidth = 6;
        drawSmoothLine(188, 111, 188, 173, 6);

        // Add shirt details
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(185, 120);
        ctx.lineTo(191, 120);
        ctx.moveTo(185, 135);
        ctx.lineTo(191, 135);
        ctx.stroke();
      }

      if (mistakes > 2) {
        // Left arm with sleeve
        ctx.strokeStyle = '#4169e1';
        ctx.lineWidth = 4;
        drawSmoothLine(188, 128, 165, 146, 4);

        // Hand
        ctx.fillStyle = '#f4d1a6';
        ctx.beginPath();
        ctx.arc(165, 146, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2d1810';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (mistakes > 3) {
        // Right arm with sleeve
        ctx.strokeStyle = '#4169e1';
        ctx.lineWidth = 4;
        drawSmoothLine(188, 128, 211, 146, 4);

        // Hand
        ctx.fillStyle = '#f4d1a6';
        ctx.beginPath();
        ctx.arc(211, 146, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2d1810';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (mistakes > 4) {
        // Left leg with pants
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 5;
        drawSmoothLine(188, 173, 169, 210, 5);

        // Shoe
        ctx.fillStyle = '#000';
        ctx.fillRect(165, 206, 11, 6);
        ctx.strokeRect(165, 206, 11, 6);
      }

      if (mistakes > 5) {
        // Right leg with pants
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 5;
        drawSmoothLine(188, 173, 207, 210, 5);

        // Shoe
        ctx.fillStyle = '#000';
        ctx.fillRect(203, 206, 11, 6);
        ctx.strokeRect(203, 206, 11, 6);

        // Replace eyes with X's
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;

        // Left X
        drawSmoothLine(180, 91, 186, 97, 1.5);
        drawSmoothLine(186, 91, 180, 97, 1.5);

        // Right X
        drawSmoothLine(190, 91, 196, 97, 1.5);
        drawSmoothLine(196, 91, 190, 97, 1.5);

        // Tongue sticking out
        ctx.fillStyle = '#ff69b4';
        ctx.fillRect(186, 104, 3, 4);

        // Add dramatic shadow
        ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
        ctx.beginPath();
        ctx.arc(188, 98, 19, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawFigure();

    // Add atmospheric effects
    if (mistakes >= maxMistakes) {
      // Dark clouds
      ctx.fillStyle = 'rgba(75, 85, 99, 0.3)';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(38 + i * 60, 23 + Math.sin(i) * 8, 23 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lightning effect
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(75, 15);
      ctx.lineTo(71, 30);
      ctx.lineTo(79, 34);
      ctx.lineTo(68, 53);
      ctx.stroke();
    } else if (mistakes > 3) {
      // Gray clouds building up
      ctx.fillStyle = 'rgba(156, 163, 175, 0.2)';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(75 + i * 75, 30, 19, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Progress indicator
    const progressWidth = 225;
    const progressHeight = 6;
    const progressX = 38;
    const progressY = 15;

    // Background
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight);

    // Progress fill
    const progress = mistakes / maxMistakes;
    const fillWidth = progressWidth * progress;

    // Color gradient based on progress
    const gradient = ctx.createLinearGradient(progressX, 0, progressX + progressWidth, 0);
    if (progress < 0.3) {
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#34d399');
    } else if (progress < 0.7) {
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(1, '#fbbf24');
    } else {
      gradient.addColorStop(0, '#dc2626');
      gradient.addColorStop(1, '#ef4444');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(progressX, progressY, fillWidth, progressHeight);

    // Progress border
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.strokeRect(progressX, progressY, progressWidth, progressHeight);

  }, [mistakes, maxMistakes]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-16">
      <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-xl shadow-2xl p-4 border border-gray-200">
        <canvas
          ref={canvasRef}
          className="block mx-auto rounded-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      <div className="text-center">
        {mistakes >= maxMistakes && (
          <div className="text-red-600 font-bold mt-1 animate-pulse">
            Game Over!
          </div>
        )}
      </div>
    </div>
  );
}