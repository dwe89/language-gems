'use client';

import { useRef, useEffect, useCallback } from 'react';
import { createAudio, getAudioUrl } from '@/utils/audioUtils';

interface AudioFiles {
  // Background themes
  themes: {
    'tokyo-nights': string;
    'pirate-adventure': string;
    'space-explorer': string;
    'lava-temple': string;
    'classic': string;
  };
  // Sound effects
  sfx: {
    'button-click': string;
    'square-select': string;
    'correct-answer': string;
    'wrong-answer': string;
    'victory': string;
    'defeat': string;
    'tie-game': string;
    'tokyo-hack': string;
    'pirate-treasure': string;
    'space-docking': string;
    'temple-power': string;
  };
}

const AUDIO_FILES: AudioFiles = {
  themes: {
    'tokyo-nights': '/audio/themes/tokyo-nights-ambient.mp3',
    'pirate-adventure': '/audio/themes/pirate-adventure-ambient.mp3',
    'space-explorer': '/audio/themes/space-explorer-ambient.mp3',
    'lava-temple': '/audio/themes/lava-temple-ambient.mp3',
    'classic': '/audio/themes/vocab-blast.mp3'
  },
  sfx: {
    'button-click': '/audio/sfx/button-click.mp3',
    'square-select': '/audio/sfx/square-select.mp3',
    'correct-answer': '/audio/sfx/correct-answer.mp3',
    'wrong-answer': '/audio/sfx/wrong-answer.mp3',
    'victory': '/audio/sfx/victory.mp3',
    'defeat': '/audio/sfx/defeat.mp3',
    'tie-game': '/audio/sfx/tie-game.mp3',
    'tokyo-hack': '/audio/sfx/tokyo-hack.mp3',
    'pirate-treasure': '/audio/sfx/pirate-treasure.mp3',
    'space-docking': '/audio/sfx/space-docking.mp3',
    'temple-power': '/audio/sfx/temple-power.mp3'
  }
};

export const useAudio = (soundEnabled: boolean = true) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio files
  useEffect(() => {
    // Preload all sound effects using cross-subdomain audio utility
    Object.entries(AUDIO_FILES.sfx).forEach(([key, src]) => {
      const audio = createAudio(src);
      audio.preload = 'auto';
      audio.volume = 0.6;
      audioRefs.current[key] = audio;
    });

    // Preload theme music using cross-subdomain audio utility
    Object.entries(AUDIO_FILES.themes).forEach(([key, src]) => {
      const audio = createAudio(src);
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = 0.3;
      audioRefs.current[`theme-${key}`] = audio;
    });
  }, []);

  // Play sound effect
  const playSFX = useCallback((soundName: keyof AudioFiles['sfx']) => {
    if (!soundEnabled) return;
    
    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.warn);
    }
  }, [soundEnabled]);

  // Play theme-specific sound effect
  const playThemeSFX = useCallback((theme: string, gameState?: string) => {
    if (!soundEnabled) return;

    let soundName: keyof AudioFiles['sfx'] | null = null;

    switch (theme) {
      case 'tokyo':
        soundName = 'tokyo-hack';
        break;
      case 'pirate':
        soundName = 'pirate-treasure';
        break;
      case 'space':
        soundName = 'space-docking';
        break;
      case 'temple':
        soundName = 'temple-power';
        break;
    }

    if (soundName) {
      playSFX(soundName);
    }
  }, [soundEnabled, playSFX]);

  // Start background music for theme
  const startBackgroundMusic = useCallback((theme: string) => {
    if (!soundEnabled) return;

    // Stop current background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    }

    let themeKey: keyof AudioFiles['themes'];
    switch (theme) {
      case 'tokyo':
        themeKey = 'tokyo-nights';
        break;
      case 'pirate':
        themeKey = 'pirate-adventure';
        break;
      case 'space':
        themeKey = 'space-explorer';
        break;
      case 'temple':
        themeKey = 'lava-temple';
        break;
      default:
        themeKey = 'classic';
    }

    const audio = audioRefs.current[`theme-${themeKey}`];
    if (audio) {
      backgroundMusicRef.current = audio;
      audio.play().catch(console.warn);
    }
  }, [soundEnabled]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
  }, []);

  // Update volume when sound enabled changes
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = soundEnabled ? 0.3 : 0;
    }
  }, [soundEnabled]);

  return {
    playSFX,
    playThemeSFX,
    startBackgroundMusic,
    stopBackgroundMusic
  };
};
