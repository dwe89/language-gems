'use client';

import { useRef, useEffect, useCallback } from 'react';
import { createAudio, getAudioUrl } from '@/utils/audioUtils';

export interface AudioFiles {
  // Background themes
  themes: {
    'tokyo': string;
    'pirate': string;
    'space': string;
    'temple': string;
    'classic': string;
  };
  // Sound effects
  sfx: {
    'gem': string;
    'defeat': string;
    'wrong-answer': string;
  };
}

const AUDIO_FILES: AudioFiles = {
  themes: {
    'tokyo': '/audio/themes/space-explorer-ambient.mp3', // Using space-explorer as specified for tokyo nights
    'pirate': '/audio/themes/pirate-adventure-ambient.mp3',
    'space': '/audio/themes/space-explorer-ambient.mp3',
    'temple': '/audio/themes/lava-temple-ambient.mp3',
    'classic': '/audio/themes/space-explorer-ambient.mp3' // Fallback
  },
  sfx: {
    'gem': '/audio/sfx/gem.mp3',
    'defeat': '/audio/sfx/defeat.mp3',
    'wrong-answer': '/audio/sfx/wrong-answer.mp3'
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

  // Stop background music (MOVED THIS UP)
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current = null;
    }
  }, []);

  // Start background music for theme
  const startBackgroundMusic = useCallback((theme: keyof AudioFiles['themes']) => {
    if (!soundEnabled) return;

    // Stop any currently playing background music
    stopBackgroundMusic();

    const audio = audioRefs.current[`theme-${theme}`];
    if (audio) {
      backgroundMusicRef.current = audio;
      audio.play().catch(console.warn);
    }
  }, [soundEnabled, stopBackgroundMusic]); // stopBackgroundMusic is now defined

  // Update volume when sound enabled changes
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = soundEnabled ? 0.3 : 0;
    }
  }, [soundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  return {
    playSFX,
    startBackgroundMusic,
    stopBackgroundMusic
  };
};