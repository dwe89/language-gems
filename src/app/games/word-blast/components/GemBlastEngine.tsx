'use client';

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { 
  FallingGem, 
  WordItem, 
  GameStats, 
  ComboEffect, 
  ParticleEffect, 
  GemType,
  GameSettings 
} from '../types';

interface GemBlastEngineProps {
  gameSettings: GameSettings;
  vocabulary: WordItem[];
  currentSentence: string;
  onGemClick: (gem: FallingGem) => void;
  onGameUpdate: (stats: GameStats) => void;
  onTimeUp: () => void;
  isPaused: boolean;
  gameActive: boolean;
}

class GemBlastScene extends Phaser.Scene {
  private fallingGems: FallingGem[] = [];
  private gemSprites: Phaser.GameObjects.Container[] = [];
  private particles: ParticleEffect[] = [];
  private comboEffects: ComboEffect[] = [];
  private gameStats: GameStats;
  private gameSettings: GameSettings;
  private vocabulary: WordItem[];
  private currentSentence: string;
  private onGemClickCallback: (gem: FallingGem) => void;
  private onGameUpdateCallback: (stats: GameStats) => void;
  private onTimeUpCallback: () => void;
  private lastGemSpawn: number = 0;
  private gameStartTime: number = 0;
  private combo: number = 0;
  private isPaused: boolean = false;

  constructor() {
    super({ key: 'GemBlastScene' });
    this.gameStats = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      gemsCollected: 0,
      gemsMissed: 0,
      wordsCollected: 0,
      accuracy: 0,
      fastestResponse: Infinity,
      totalPlayTime: 0,
      timeRemaining: 0,
      gemsByType: {
        ruby: 0,
        sapphire: 0,
        emerald: 0,
        diamond: 0,
        amethyst: 0,
        topaz: 0
      }
    };
  }

  init(data: any) {
    this.gameSettings = data.gameSettings;
    this.vocabulary = data.vocabulary;
    this.currentSentence = data.currentSentence;
    this.onGemClickCallback = data.onGemClick;
    this.onGameUpdateCallback = data.onGameUpdate;
    this.onTimeUpCallback = data.onTimeUp;
    this.gameStartTime = Date.now();
  }

  preload() {
    // Create gem textures programmatically
    this.createGemTextures();
  }

  create() {
    // Create magical cavern background
    this.createBackground();
    
    // Create background particle effects
    this.createBackgroundParticles();
    
    // Set up input handling
    this.input.on('pointerdown', this.handlePointerDown, this);
    
    // Spawn initial gems immediately
    this.createNewGem();
    this.lastGemSpawn = this.time.now;
  }

  update(time: number, delta: number) {
    if (this.isPaused) return;

    // Update falling gems
    this.updateFallingGems(delta);
    
    // Update particle effects
    this.updateParticleEffects(delta);
    
    // Update combo effects
    this.updateComboEffects(delta);
    
    // Spawn new gems
    this.spawnGems(time);
    
    // Update game stats
    this.updateGameStats();
  }

  private createGemTextures() {
    const gemColors = {
      ruby: '#FF4444',
      sapphire: '#4488FF',
      emerald: '#44FF44',
      diamond: '#FFFFFF',
      amethyst: '#AA44FF',
      topaz: '#FFAA44'
    };

    Object.entries(gemColors).forEach(([type, color]) => {
      const graphics = this.add.graphics();
      const colorValue = Phaser.Display.Color.HexStringToColor(color).color;
      
      // Create hexagonal gem shape
      graphics.fillStyle(colorValue);
      graphics.lineStyle(3, colorValue, 0.8);
      
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * 25;
        const y = Math.sin(angle) * 25;
        points.push(x, y);
      }
      
      graphics.fillPoints(points, true);
      graphics.strokePoints(points, true);
      
      // Add sparkle effect
      graphics.fillStyle(0xFFFFFF, 0.8);
      graphics.fillCircle(0, -8, 2);
      graphics.fillCircle(8, 4, 1.5);
      graphics.fillCircle(-6, 6, 1.5);
      
      // Generate texture from graphics
      graphics.generateTexture(type, 60, 60);
      graphics.destroy();
    });
  }

  private createBackground() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x533483, 1);
    graphics.fillRect(0, 0, width, height);
    
    // Add crystal formations
    this.createCrystalFormations();
  }

  private createCrystalFormations() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    for (let i = 0; i < 8; i++) {
      const crystal = this.add.graphics();
      crystal.fillStyle(0x4a90e2, 0.2);
      crystal.lineStyle(1, 0x6bb6ff, 0.5);
      
      const x = i < 4 ? Phaser.Math.Between(0, width * 0.15) : Phaser.Math.Between(width * 0.85, width);
      const y = Phaser.Math.Between(height * 0.2, height * 0.9);
      
      // Create crystal shape
      const size = Phaser.Math.Between(20, 40);
      crystal.beginPath();
      crystal.moveTo(x, y);
      crystal.lineTo(x + size * 0.3, y - size);
      crystal.lineTo(x + size * 0.7, y - size * 0.8);
      crystal.lineTo(x + size, y - size * 0.2);
      crystal.lineTo(x + size * 0.8, y + size * 0.2);
      crystal.lineTo(x - size * 0.2, y + size * 0.1);
      crystal.closePath();
      crystal.fillPath();
      crystal.strokePath();
    }
  }

  private createBackgroundParticles() {
    // Create floating sparkles
    for (let i = 0; i < 50; i++) {
      const sparkle = this.add.graphics();
      sparkle.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.1, 0.4));
      sparkle.fillCircle(0, 0, 1);
      
      sparkle.x = Phaser.Math.Between(0, this.cameras.main.width);
      sparkle.y = Phaser.Math.Between(0, this.cameras.main.height);
      
      // Animate sparkles
      this.tweens.add({
        targets: sparkle,
        alpha: { from: 0, to: 1 },
        scale: { from: 0.5, to: 1.5 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }

  private updateFallingGems(delta: number) {
    this.fallingGems.forEach((gem, index) => {
      gem.y += gem.speed * (delta / 1000);
      gem.rotation += 0.02;
      
      // Update sprite position
      const sprite = this.gemSprites[index];
      if (sprite) {
        sprite.x = gem.x;
        sprite.y = gem.y;
        sprite.rotation = gem.rotation;
      }
      
      // Check if gem reached bottom
      if (gem.y > this.cameras.main.height + 50) {
        this.handleGemMissed(gem);
        this.removeGem(index);
      }
    });
  }

  private updateParticleEffects(delta: number) {
    this.particles.forEach((effect, index) => {
      if (Date.now() - effect.timestamp > effect.duration) {
        this.particles.splice(index, 1);
      }
    });
  }

  private updateComboEffects(delta: number) {
    this.comboEffects.forEach((effect, index) => {
      if (Date.now() - effect.timestamp > 1500) {
        this.comboEffects.splice(index, 1);
      }
    });
  }

  private spawnGems(time: number) {
    const spawnDelay = Math.max(300, 200 - (this.gameStats.score / 50));
    
    if (time - this.lastGemSpawn > spawnDelay && this.fallingGems.length < this.gameSettings.maxGems) {
      this.createNewGem();
      this.lastGemSpawn = time;
    }
  }

  private createNewGem() {
    if (this.vocabulary.length === 0) return;
    
    const correctWord = this.vocabulary[Math.floor(Math.random() * this.vocabulary.length)];
    const incorrectWords = this.vocabulary.filter(w => w.id !== correctWord.id);
    
    // Create 3-4 gems (1 correct, 2-3 incorrect)
    const gemCount = Phaser.Math.Between(3, 4);
    const correctIndex = Math.floor(Math.random() * gemCount);
    
    for (let i = 0; i < gemCount; i++) {
      const isCorrect = i === correctIndex;
      const word = isCorrect ? correctWord : incorrectWords[Math.floor(Math.random() * incorrectWords.length)];
      
      const gem: FallingGem = {
        id: `gem-${Date.now()}-${i}`,
        word: word.word,
        translation: word.translation,
        isCorrect,
        gemType: this.getGemTypeForCategory(word.category || 'noun'),
        x: Phaser.Math.Between(80, this.cameras.main.width - 80),
        y: -50,
        speed: this.gameSettings.gemSpeed + Phaser.Math.Between(-20, 20),
        rotation: 0,
        scale: 1,
        glowing: false // Never glow based on 'isCorrect' or 'next in order'
      };
      
      // Create sprite
      const sprite = this.add.sprite(gem.x, gem.y, gem.gemType);
      sprite.setInteractive();
      sprite.setScale(0.8);
      
      // Add text label
      const text = this.add.text(gem.x, gem.y, gem.translation, {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2
      });
      text.setOrigin(0.5);
      
      // Group sprite and text
      const container = this.add.container(gem.x, gem.y, [sprite, text]);
      container.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
      
      this.fallingGems.push(gem);
      this.gemSprites.push(container);
    }
  }

  private getGemTypeForCategory(category: string): GemType {
    const categoryMap: Record<string, GemType> = {
      noun: 'ruby',
      verb: 'sapphire',
      adjective: 'emerald',
      adverb: 'amethyst',
      phrase: 'diamond'
    };
    
    return categoryMap[category] || 'topaz';
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const clickedGemIndex = this.findGemAtPosition(pointer.x, pointer.y);
    
    if (clickedGemIndex !== -1) {
      const gem = this.fallingGems[clickedGemIndex];
      this.handleGemClick(gem, clickedGemIndex);
    }
  }

  private findGemAtPosition(x: number, y: number): number {
    return this.fallingGems.findIndex(gem => {
      const distance = Phaser.Math.Distance.Between(x, y, gem.x, gem.y);
      return distance < 40;
    });
  }

  private handleGemClick(gem: FallingGem, index: number) {
    if (gem.isCorrect) {
      this.handleCorrectGem(gem);
    } else {
      this.handleIncorrectGem(gem);
    }
    
    // Remove gem
    this.removeGem(index);
    
    // Trigger callback
    this.onGemClickCallback(gem);
  }

  private handleCorrectGem(gem: FallingGem) {
    this.combo++;
    this.gameStats.combo = this.combo;
    this.gameStats.maxCombo = Math.max(this.gameStats.maxCombo, this.combo);
    this.gameStats.gemsCollected++;
    this.gameStats.gemsByType[gem.gemType]++;
    
    // Calculate score with combo multiplier
    const baseScore = 100;
    const comboBonus = this.combo * 25;
    const score = baseScore + comboBonus;
    this.gameStats.score += score;
    
    // Create success effect
    this.createSuccessEffect(gem.x, gem.y);
    
    // Create combo effect
    if (this.combo > 1) {
      this.createComboEffect(gem.x, gem.y, this.combo);
    }
  }

  private handleIncorrectGem(gem: FallingGem) {
    this.combo = 0;
    this.gameStats.combo = 0;
    
    // Create error effect
    this.createErrorEffect(gem.x, gem.y);
  }

  private handleGemMissed(gem: FallingGem) {
    if (gem.isCorrect) {
      this.combo = 0;
      this.gameStats.combo = 0;
      this.gameStats.gemsMissed++;
    }
  }

  private removeGem(index: number) {
    this.fallingGems.splice(index, 1);
    const sprite = this.gemSprites.splice(index, 1)[0];
    if (sprite) {
      sprite.destroy();
    }
  }

  private createSuccessEffect(x: number, y: number) {
    // Create particle burst
    const colors = [0xFFD700, 0xFFA500, 0xFF69B4, 0x00CED1];
    
    for (let i = 0; i < 15; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(colors[Math.floor(Math.random() * colors.length)]);
      particle.fillCircle(0, 0, Phaser.Math.Between(2, 4));
      
      particle.x = x;
      particle.y = y;
      
      const angle = (Math.PI * 2 * i) / 15;
      const speed = Phaser.Math.Between(50, 100);
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: { from: 1, to: 0 },
        scale: { from: 1, to: 0 },
        duration: 800,
        onComplete: () => particle.destroy()
      });
    }
  }

  private createErrorEffect(x: number, y: number) {
    // Create crack effect
    const crack = this.add.graphics();
    crack.lineStyle(3, 0xFF4444, 0.8);
    
    // Draw crack lines
    crack.beginPath();
    crack.moveTo(x - 20, y - 20);
    crack.lineTo(x + 20, y + 20);
    crack.moveTo(x + 20, y - 20);
    crack.lineTo(x - 20, y + 20);
    crack.strokePath();
    
    // Fade out crack
    this.tweens.add({
      targets: crack,
      alpha: { from: 1, to: 0 },
      duration: 1000,
      onComplete: () => crack.destroy()
    });
  }

  private createComboEffect(x: number, y: number, combo: number) {
    const comboText = this.add.text(x, y, `COMBO x${combo}!`, {
      fontSize: '24px',
      color: combo > 5 ? '#FFD700' : '#FFA500',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 3
    });
    
    comboText.setOrigin(0.5);
    comboText.setScale(0);
    
    // Animate combo text
    this.tweens.add({
      targets: comboText,
      scale: { from: 0, to: 1.5 },
      y: y - 50,
      alpha: { from: 1, to: 0 },
      duration: 1500,
      ease: 'Back.easeOut',
      onComplete: () => comboText.destroy()
    });
    
    const effect: ComboEffect = {
      id: `combo-${Date.now()}`,
      x,
      y,
      text: `COMBO x${combo}!`,
      color: combo > 5 ? '#FFD700' : '#FFA500',
      timestamp: Date.now()
    };
    
    this.comboEffects.push(effect);
  }

  private updateGameStats() {
    this.gameStats.totalPlayTime = Date.now() - this.gameStartTime;
    const total = this.gameStats.gemsCollected + this.gameStats.gemsMissed;
    this.gameStats.accuracy = total > 0 ? (this.gameStats.gemsCollected / total) * 100 : 0;
    
    this.onGameUpdateCallback(this.gameStats);
  }

  public pauseGame() {
    this.isPaused = true;
    this.scene.pause();
  }

  public resumeGame() {
    this.isPaused = false;
    this.scene.resume();
  }

  public getGameStats(): GameStats {
    return { ...this.gameStats };
  }
}

export const GemBlastEngine: React.FC<GemBlastEngineProps> = ({
  gameSettings,
  vocabulary,
  currentSentence,
  onGemClick,
  onGameUpdate,
  onTimeUp,
  isPaused,
  gameActive
}) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<GemBlastScene | null>(null);

  useEffect(() => {
    if (!gameRef.current || !gameActive) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameRef.current.clientWidth || 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#1a1a2e',
      scene: GemBlastScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    phaserGameRef.current = new Phaser.Game(config);
    
    // Get scene reference after game is created
    setTimeout(() => {
      sceneRef.current = phaserGameRef.current?.scene.getScene('GemBlastScene') as GemBlastScene;
      
      if (sceneRef.current) {
        sceneRef.current.scene.restart({
          gameSettings,
          vocabulary,
          currentSentence,
          onGemClick,
          onGameUpdate,
          onTimeUp
        });
      }
    }, 100);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, [gameActive]);

  useEffect(() => {
    if (sceneRef.current) {
      if (isPaused) {
        sceneRef.current.pauseGame();
      } else {
        sceneRef.current.resumeGame();
      }
    }
  }, [isPaused]);

  return (
    <div 
      ref={gameRef} 
      className="w-full h-full min-h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900"
      style={{ minHeight: '600px' }}
    />
  );
}; 