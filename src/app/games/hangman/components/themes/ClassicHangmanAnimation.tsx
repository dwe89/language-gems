'use client';

import React, { useEffect, useRef } from 'react';

interface ClassicHangmanAnimationProps {
    mistakes: number;
    maxMistakes: number;
    className?: string;
}

type Star = { x: number; y: number; radius: number; twinkleOffset: number };
type Firefly = { x: number; y: number; drift: number; baseAlpha: number; phase: number };
type Bird = { x: number; y: number; speed: number; wingPhase: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function ClassicHangmanAnimation({ mistakes, maxMistakes, className }: ClassicHangmanAnimationProps) {
        const containerRef = useRef<HTMLDivElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const animationFrameId = useRef<number>();
    const stateRef = useRef({
        width: 0,
        height: 0,
        stars: [] as Star[],
        fireflies: [] as Firefly[],
        birds: [] as Bird[],
        ghost: { y: 0, alpha: 0 }
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const win = container.ownerDocument?.defaultView;
        if (!win) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const state = stateRef.current;

        const buildStars = () => {
            const starCount = Math.floor((state.width * state.height) / 3000);
            state.stars = Array.from({ length: starCount }, () => ({
                x: Math.random() * state.width,
                y: Math.random() * state.height * 0.6,
                radius: Math.random() * 1.6 + 0.2,
                twinkleOffset: Math.random() * Math.PI * 2
            }));
        };

        const buildFireflies = () => {
            state.fireflies = Array.from({ length: 25 }, () => ({
                x: Math.random() * state.width,
                y: state.height * 0.4 + Math.random() * state.height * 0.5,
                drift: (Math.random() - 0.5) * 0.4,
                baseAlpha: 0.3 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2
            }));
        };

        const buildBirds = () => {
            state.birds = Array.from({ length: 5 }, (_, index) => ({
                x: state.width * Math.random(),
                y: state.height * (0.2 + index * 0.05 + Math.random() * 0.04),
                speed: 0.25 + Math.random() * 0.2,
                wingPhase: Math.random() * Math.PI * 2
            }));
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = win.devicePixelRatio || 1;

            const width = Math.max(rect.width, 200);
            const height = Math.max(rect.height, 200);

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            state.width = width;
            state.height = height;
            state.ghost = { y: height * 0.52, alpha: 0 };

            buildStars();
            buildFireflies();
            buildBirds();
        };

        resize();

        let cleanupResize: () => void = () => {};
            if (typeof win.ResizeObserver !== 'undefined') {
                const observer = new win.ResizeObserver(() => resize());
            observer.observe(container);
            cleanupResize = () => observer.disconnect();
        } else {
            const handleResize = () => resize();
                win.addEventListener('resize', handleResize);
                cleanupResize = () => win.removeEventListener('resize', handleResize);
        }

        const drawSky = (progress: number, time: number) => {
            const { width, height } = state;
            const topColor = progress < 0.5
                ? `rgba(${clamp(120 + progress * 180, 0, 255)}, ${clamp(180 - progress * 120, 0, 255)}, ${clamp(255 - progress * 140, 0, 255)}, 1)`
                : `rgba(${clamp(80 - (progress - 0.5) * 100, 0, 255)}, ${clamp(60 - (progress - 0.5) * 80, 0, 255)}, ${clamp(140 + (progress - 0.5) * 220, 0, 255)}, 1)`;
            const bottomColor = progress < 0.5 ? '#fdf3d8' : '#1a1f3b';

            const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
            skyGradient.addColorStop(0, topColor);
            skyGradient.addColorStop(progress < 0.5 ? 0.7 : 0.5, bottomColor);
            skyGradient.addColorStop(1, '#1b1b29');

            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            if (progress > 0.55) {
                ctx.save();
                ctx.globalAlpha = clamp((progress - 0.55) * 2, 0, 0.9);
                state.stars.forEach((star) => {
                    const twinkle = Math.sin(time / 800 + star.twinkleOffset) * 0.4 + 0.6;
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, ${Math.floor(220 + twinkle * 35)}, ${0.3 + twinkle * 0.7})`;
                    ctx.arc(star.x, star.y, star.radius * twinkle, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.restore();
            }

            const sunPosition = {
                x: width * 0.15 + Math.cos(progress * Math.PI) * width * 0.12,
                y: height * 0.15 + Math.sin(progress * Math.PI) * height * 0.25
            };
            const sunRadius = width * 0.07;
            const sunGlow = ctx.createRadialGradient(
                sunPosition.x,
                sunPosition.y,
                0,
                sunPosition.x,
                sunPosition.y,
                sunRadius * 3
            );

            const sunIsMoon = progress > 0.75;
            sunGlow.addColorStop(0, sunIsMoon ? 'rgba(245,245,255, 0.85)' : 'rgba(255, 230, 150, 0.95)');
            sunGlow.addColorStop(0.6, sunIsMoon ? 'rgba(200, 220, 255, 0.4)' : 'rgba(255, 180, 120, 0.5)');
            sunGlow.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = sunGlow;
            ctx.beginPath();
            ctx.arc(sunPosition.x, sunPosition.y, sunRadius * (sunIsMoon ? 0.8 : 1.2), 0, Math.PI * 2);
            ctx.fill();
        };

        const drawMountains = (progress: number, time: number) => {
            const { width, height } = state;
            const horizonY = height * 0.65;

            const drawRange = (offset: number, amplitude: number, colorStops: string[], shadowOpacity: number, blur: number) => {
                ctx.save();
                ctx.filter = `blur(${blur}px)`;
                const gradient = ctx.createLinearGradient(0, horizonY - 80, 0, height);
                colorStops.forEach((color, index) => gradient.addColorStop(index / (colorStops.length - 1), color));
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(0, horizonY);
                for (let x = 0; x <= width; x += 20) {
                    const noise = Math.sin((x + offset + time * 0.05) / (120 - amplitude * 20));
                    const y = horizonY - noise * amplitude * 60 - Math.sin(x / 50) * 8;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                ctx.fill();

                ctx.globalAlpha = shadowOpacity;
                ctx.fillStyle = '#0b0b16';
                ctx.fill();
                ctx.restore();
            };

            const eveningFactor = clamp((progress - 0.4) * 2, 0, 1);

            drawRange(0, 1.1, ['#3b4a6b', '#2a2e50', '#171830'], 0.08 + eveningFactor * 0.1, 15);
            drawRange(140, 0.8, ['#4c5c7d', '#2c3450', '#1b1d36'], 0.12 + eveningFactor * 0.15, 8);
            drawRange(320, 0.55, ['#556485', '#333a54', '#1f2238'], 0.2 + eveningFactor * 0.2, 3);
        };

        const drawGround = (progress: number, time: number) => {
            const { width, height } = state;
            const groundY = height * 0.84;
            const gradient = ctx.createLinearGradient(0, groundY, 0, height);
            gradient.addColorStop(0, progress < 0.6 ? '#3f7d4a' : '#1c2f27');
            gradient.addColorStop(1, '#0a1311');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, groundY, width, height - groundY);

            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 0; x <= width; x += 24) {
                const wave = Math.sin((time / 600) + x / 40) * 4;
                ctx.moveTo(x, groundY + wave);
                ctx.lineTo(x + 12, groundY + 8 + wave);
            }
            ctx.stroke();

            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 12]);
            ctx.beginPath();
            ctx.moveTo(width * 0.35, height * 0.84);
            ctx.quadraticCurveTo(width * 0.52, height * 0.78 + Math.sin(time / 500) * 10, width * 0.7, height * 0.84);
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(width * 0.45, groundY + 20);
            ctx.lineTo(width * 0.47, groundY + 10 + Math.sin(time / 300) * 3);
            ctx.lineTo(width * 0.48, groundY + 15);
            ctx.stroke();
            ctx.restore();
        };

        const drawFireflies = (progress: number, time: number) => {
            if (progress < 0.55) return;
            const { fireflies } = state;
            fireflies.forEach((fly) => {
                fly.phase += 0.02;
                fly.x += Math.sin(fly.phase) * fly.drift;
                fly.y += Math.cos(fly.phase * 0.75) * 0.3;

                ctx.beginPath();
                const sparkle = Math.sin(time / 200 + fly.phase) * 0.5 + 0.6;
                const alpha = fly.baseAlpha * clamp((progress - 0.55) * 2, 0, 1);
                ctx.fillStyle = `rgba(255, 220, 120, ${alpha * sparkle})`;
                ctx.shadowColor = 'rgba(255, 200, 120, 0.8)';
                ctx.shadowBlur = 6;
                ctx.arc(fly.x, fly.y, 2.5 * sparkle, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        };

        const drawBirds = (progress: number, time: number) => {
            if (progress > 0.7) return;
            const { width, height } = state;
            ctx.save();
            ctx.strokeStyle = 'rgba(40,40,40,0.7)';
            ctx.lineWidth = 1.5;

            state.birds.forEach((bird) => {
                bird.x += bird.speed;
                if (bird.x > width + 40) {
                    bird.x = -60;
                    bird.y = height * (0.18 + Math.random() * 0.12);
                }
                bird.wingPhase += 0.25;
                const wingSpan = 18 + Math.sin(time / 200 + bird.wingPhase) * 6;

                ctx.beginPath();
                ctx.moveTo(bird.x, bird.y);
                ctx.quadraticCurveTo(bird.x + wingSpan, bird.y - 6, bird.x + wingSpan * 2, bird.y);
                ctx.moveTo(bird.x, bird.y);
                ctx.quadraticCurveTo(bird.x - wingSpan, bird.y - 6, bird.x - wingSpan * 2, bird.y);
                ctx.stroke();
            });
            ctx.restore();
        };

        const drawGallows = (_progress: number, time: number) => {
            const { width, height } = state;
            const baseX = width * 0.17;
            const baseY = height * 0.68;
            const poleHeight = height * 0.55;
            const beamLength = width * 0.37;

            const gradient = ctx.createLinearGradient(baseX, baseY - poleHeight, baseX + 25, baseY);
            gradient.addColorStop(0, '#4b2d14');
            gradient.addColorStop(0.5, '#7a4a1e');
            gradient.addColorStop(1, '#3a1f0c');

            ctx.fillStyle = gradient;
            ctx.strokeStyle = 'rgba(20,10,5,0.7)';
            ctx.lineWidth = 3.5;

            ctx.save();
            ctx.translate(0, Math.sin(time / 1200) * 1.8);
            ctx.beginPath();
            ctx.moveTo(baseX - 40, baseY + 10);
            ctx.lineTo(baseX + beamLength + 10, baseY + 10);
            ctx.lineTo(baseX + beamLength + 5, baseY + 30);
            ctx.lineTo(baseX - 50, baseY + 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillRect(baseX, baseY - poleHeight, 25, poleHeight);
            ctx.strokeRect(baseX, baseY - poleHeight, 25, poleHeight);

            ctx.save();
            ctx.translate(baseX, baseY - poleHeight);
            ctx.rotate(-0.04);
            ctx.fillRect(0, -20, beamLength, 22);
            ctx.strokeRect(0, -20, beamLength, 22);
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(baseX + beamLength - 5, baseY - poleHeight + 10);
            ctx.lineTo(baseX + 60, baseY - poleHeight + 60);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(56,32,16,0.8)';
            ctx.stroke();
            ctx.restore();
        };

        const drawRopeAndCharacter = (progress: number, time: number) => {
            const { width, height, ghost } = state;
            const isGameOver = progress >= 1;
            const anchorX = width * 0.54;
            const anchorY = height * 0.13;
            const sway = Math.sin(time / 520) * (isGameOver ? 10 : 4);

            ctx.strokeStyle = '#d6b483';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(anchorX, anchorY);
            ctx.quadraticCurveTo(anchorX + sway * 0.4, anchorY + height * 0.18, anchorX + sway, anchorY + height * 0.28);
            ctx.stroke();

            const headX = anchorX + sway;
            const headY = anchorY + height * 0.3;
            const bodyLength = height * 0.25;

            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#fde1bd';
            ctx.lineWidth = 4;
            ctx.arc(headX, headY, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.save();
            if (!isGameOver) {
                ctx.beginPath();
                ctx.fillStyle = '#000';
                const blink = Math.sin(time / 2400) > 0.92;
                if (blink) {
                    ctx.fillRect(headX - 12, headY - 10, 10, 3);
                    ctx.fillRect(headX + 2, headY - 10, 10, 3);
                } else {
                    ctx.arc(headX - 10, headY - 6, 3, 0, Math.PI * 2);
                    ctx.arc(headX + 10, headY - 6, 3, 0, Math.PI * 2);
                }
                ctx.fill();

                ctx.beginPath();
                const sadness = clamp(progress, 0, 1);
                ctx.arc(headX, headY + 12, 10, Math.PI * (0.15 + sadness * 0.3), Math.PI * (0.85 - sadness * 0.3));
                ctx.stroke();
            } else {
                ctx.strokeStyle = '#321010';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(headX - 12, headY - 8);
                ctx.lineTo(headX - 4, headY);
                ctx.moveTo(headX - 4, headY - 8);
                ctx.lineTo(headX - 12, headY);
                ctx.moveTo(headX + 4, headY - 8);
                ctx.lineTo(headX + 12, headY);
                ctx.moveTo(headX + 12, headY - 8);
                ctx.lineTo(headX + 4, headY);
                ctx.stroke();
            }
            ctx.restore();

            const breathing = isGameOver ? 0 : Math.sin(time / 480) * 3;
            const bodyTop = headY + 24 + breathing;
            const bodyBottom = bodyTop + bodyLength;

            ctx.beginPath();
            ctx.moveTo(headX, bodyTop);
            ctx.lineTo(headX, bodyBottom);
            ctx.stroke();

            if (progress > 0.2) {
                ctx.beginPath();
                ctx.moveTo(headX, bodyTop + 30);
                ctx.lineTo(headX - 45, bodyTop + 70);
                ctx.stroke();
            }
            if (progress > 0.35) {
                ctx.beginPath();
                ctx.moveTo(headX, bodyTop + 30);
                ctx.lineTo(headX + 45, bodyTop + 70);
                ctx.stroke();
            }
            if (progress > 0.55) {
                ctx.beginPath();
                ctx.moveTo(headX, bodyBottom);
                ctx.lineTo(headX - 35, bodyBottom + 70);
                ctx.stroke();
            }
            if (progress > 0.75) {
                ctx.beginPath();
                ctx.moveTo(headX, bodyBottom);
                ctx.lineTo(headX + 35, bodyBottom + 70);
                ctx.stroke();
            }
        };

        const drawWeather = (progress: number, time: number) => {
            const { width, height } = state;
            const cloudOpacity = clamp(0.3 + progress * 0.6, 0.3, 0.9);
            for (let i = 0; i < 4; i++) {
                const baseX = (i * width * 0.35 + (time / 30) * (1 + progress)) % (width + 400) - 200;
                const baseY = height * (0.15 + i * 0.04);
                ctx.fillStyle = `rgba(255,255,255,${cloudOpacity})`;
                ctx.beginPath();
                ctx.ellipse(baseX, baseY, 110, 55, 0, 0, Math.PI * 2);
                ctx.ellipse(baseX + 70, baseY - 15, 80, 40, 0, 0, Math.PI * 2);
                ctx.ellipse(baseX - 60, baseY - 10, 70, 35, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            if (progress >= 1) {
                ctx.strokeStyle = 'rgba(200, 230, 255, 0.9)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 70; i++) {
                    const x = Math.random() * width;
                    const y = (Math.random() * height + time / 4) % height;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + 14);
                    ctx.stroke();
                }

                if (Math.random() > 0.96) {
                    const boltX = width * (0.3 + Math.random() * 0.4);
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(boltX, height * 0.05);
                    ctx.lineTo(boltX - 20, height * 0.25);
                    ctx.lineTo(boltX + 10, height * 0.4);
                    ctx.lineTo(boltX - 15, height * 0.55);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        };

        const drawUI = (progress: number) => {
            const { width, height } = state;
            const barWidth = width * 0.72;
            const barX = width * 0.14;
            const barY = height * 0.06;

            ctx.fillStyle = 'rgba(20,20,35,0.45)';
            ctx.fillRect(barX, barY, barWidth, 12);

            const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
            gradient.addColorStop(0, '#38d39f');
            gradient.addColorStop(0.5, '#f5d742');
            gradient.addColorStop(1, '#ff4b5c');
            ctx.fillStyle = gradient;
            ctx.fillRect(barX, barY, barWidth * (1 - progress), 12);

            ctx.strokeStyle = 'rgba(255,255,255,0.35)';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, 12);
        };

        const drawGameOver = (time: number) => {
            const { width, height, ghost } = state;
            if (ghost.alpha < 1) {
                ghost.alpha += 0.015;
                ghost.y -= 0.4;
            }

            ctx.save();
            ctx.globalAlpha = ghost.alpha;
            const x = width * 0.54 + Math.sin(time / 400) * 6;
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.beginPath();
            ctx.moveTo(x - 25, ghost.y);
            ctx.quadraticCurveTo(x - 25, ghost.y - 35, x + 25, ghost.y - 35);
            ctx.quadraticCurveTo(x + 25, ghost.y + 25, x + 18, ghost.y + 38);
            ctx.lineTo(x + 12, ghost.y + 28);
            ctx.lineTo(x + 4, ghost.y + 38);
            ctx.lineTo(x - 4, ghost.y + 28);
            ctx.lineTo(x - 12, ghost.y + 38);
            ctx.lineTo(x - 18, ghost.y + 28);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(30,30,60,0.85)';
            ctx.beginPath();
            ctx.arc(x - 8, ghost.y - 15, 4, 0, Math.PI * 2);
            ctx.arc(x + 8, ghost.y - 15, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(30,30,60,0.85)';
            ctx.lineWidth = 2;
            ctx.moveTo(x - 6, ghost.y - 2);
            ctx.quadraticCurveTo(x, ghost.y + 6, x + 6, ghost.y - 2);
            ctx.stroke();

            ctx.restore();

            ctx.save();
            ctx.font = `bold ${width * 0.12}px 'Poppins', 'Inter', sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.shadowColor = 'rgba(255,60,90,0.8)';
            ctx.shadowBlur = 25;
            ctx.fillText('Game Over', width / 2, height * 0.45);
            ctx.shadowBlur = 0;
            ctx.restore();
        };

        const animate = (time: number) => {
            const { width, height } = state;
            if (!width || !height) {
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            const progress = clamp(mistakes / maxMistakes, 0, 1);

            drawSky(progress, time);
            drawMountains(progress, time);
            drawBirds(progress, time);
            drawWeather(progress, time);
            drawGround(progress, time);
            drawGallows(progress, time);
            drawRopeAndCharacter(progress, time);
            drawFireflies(progress, time);
            drawUI(progress);

            if (progress >= 1) {
                drawGameOver(time);
            } else {
                state.ghost = { y: height * 0.52, alpha: 0 };
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            cleanupResize();
        };
    }, [mistakes, maxMistakes]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full max-w-full h-full aspect-[4/5] md:aspect-[3/4] lg:aspect-square rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.9)] overflow-hidden ${className ?? ''}`}
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.06),_transparent_55%)]" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.2),_transparent_60%)]" />
        </div>
    );
}

