'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeType } from '../types';

// Define our sounds
const SOUNDS = {
  drag: '/games/verb-quest/sounds/click.mp3',
  drop: '/games/verb-quest/sounds/click.mp3',
  correct: '/games/sentence-towers/sounds/correctanswer.mp3',
  incorrect: '/audio/sfx/wrong-answer.mp3',
  powerup: '/audio/sfx/button-click.mp3',
  levelComplete: '/audio/sfx/victory.mp3',
  gameOver: '/audio/sfx/defeat.mp3',
  ui: '/games/verb-quest/sounds/click.mp3',
  bgMusic: {
    default: '/audio/sentence-sprint.mp3',
    cyber: '/audio/themes/tokyo-nights-ambient.mp3',
    medieval: '/audio/themes/classic-ambient.mp3',
    pirate: '/audio/themes/pirate-adventure-ambient.mp3',
    space: '/audio/themes/space-explorer-ambient.mp3',
  }
};

// Type definitions for our context
interface SoundContextType {
  playSound: (soundName: keyof typeof SOUNDS | 'bgMusic') => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  setCurrentTheme: (theme: ThemeType) => void;
}

// Create context
const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Provider component
export const SoundProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: ThemeType;
}> = ({ children, initialTheme = 'default' }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  const [bgMusic, setBgMusic] = useState<HTMLAudioElement | null>(null);
  
  // Initialize audio elements for all our sounds
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const audioElems: Record<string, HTMLAudioElement> = {};
    
    // Create audio elements for each sound
    Object.entries(SOUNDS).forEach(([key, value]) => {
      if (key !== 'bgMusic') {
        const audio = new Audio(value as string);
        audio.preload = 'auto';
        audioElems[key] = audio;
      }
    });
    
    setAudioElements(audioElems);
    
    // Initialize background music
    const music = new Audio(SOUNDS.bgMusic.default);
    music.loop = true;
    music.volume = 0.3;
    setBgMusic(music);
    
    return () => {
      // Cleanup
      Object.values(audioElems).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      
      if (bgMusic) {
        bgMusic.pause();
        bgMusic.src = '';
      }
    };
  }, []);
  
  // Handle background music when theme changes
  useEffect(() => {
    if (!bgMusic || !musicEnabled) return;
    
    // Update the music source based on the current theme
    const newMusicSrc = SOUNDS.bgMusic[currentTheme] || SOUNDS.bgMusic.default;
    
    // If it's a different track, update it
    if (bgMusic.src !== newMusicSrc) {
      const currentTime = bgMusic.currentTime;
      const wasPlaying = !bgMusic.paused;
      
      bgMusic.src = newMusicSrc;
      bgMusic.load();
      
      if (wasPlaying) {
        bgMusic.play().catch(err => console.error('Failed to play background music:', err));
      }
    }
  }, [currentTheme, bgMusic, musicEnabled]);
  
  // Handle music enabled/disabled
  useEffect(() => {
    if (!bgMusic) return;
    
    if (musicEnabled) {
      bgMusic.play().catch(err => console.error('Failed to play background music:', err));
    } else {
      bgMusic.pause();
    }
  }, [musicEnabled, bgMusic]);
  
  // Function to play a sound
  const playSound = useCallback((soundName: keyof typeof SOUNDS | 'bgMusic') => {
    if (!soundEnabled && soundName !== 'bgMusic') return;
    if (soundName === 'bgMusic' && !musicEnabled) return;
    
    if (soundName === 'bgMusic') {
      if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch(err => console.error('Failed to play background music:', err));
      }
      return;
    }
    
    const audio = audioElements[soundName];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error(`Failed to play sound ${soundName}:`, err));
    }
  }, [soundEnabled, musicEnabled, audioElements, bgMusic]);
  
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);
  
  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => !prev);
  }, []);
  
  const value = {
    playSound,
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    setCurrentTheme
  };
  
  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

// Custom hook to use the context
export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

// Sound controls UI component
export const SoundControls: React.FC = () => {
  const { soundEnabled, musicEnabled, toggleSound, toggleMusic } = useSound();
  
  return (
    <div className="flex items-center space-x-2">
      <motion.button
        className={`sound-control p-2 rounded-full ${!soundEnabled ? 'off' : ''}`}
        onClick={toggleSound}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </motion.button>
      
      <motion.button
        className={`sound-control p-2 rounded-full ${!musicEnabled ? 'off' : ''}`}
        onClick={toggleMusic}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Music size={18} />
      </motion.button>
    </div>
  );
}; 