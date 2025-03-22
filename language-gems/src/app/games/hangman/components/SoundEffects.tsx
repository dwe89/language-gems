'use client';

import { useEffect, useState, useRef } from 'react';

type SoundEffectsProps = {
  theme: string;
  onCorrect?: boolean;
  onIncorrect?: boolean;
  onWin?: boolean;
  onLose?: boolean;
  onHint?: boolean;
  muted?: boolean;
}

// Using sounds from free CDNs
const themeSounds = {
  default: {
    correct: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
    incorrect: 'https://assets.mixkit.co/sfx/preview/mixkit-negative-tone-interface-tap-2568.mp3',
    win: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
    lose: 'https://assets.mixkit.co/sfx/preview/mixkit-failure-arcade-alert-notification-240.mp3',
    hint: 'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3',
  },
  tokyo: {
    correct: 'https://assets.mixkit.co/sfx/preview/mixkit-futuristic-technology-device-power-on-406.mp3',
    incorrect: 'https://assets.mixkit.co/sfx/preview/mixkit-tech-break-fail-notification-171.mp3',
    win: 'https://assets.mixkit.co/sfx/preview/mixkit-video-game-win-2016.mp3',
    lose: 'https://assets.mixkit.co/sfx/preview/mixkit-electronic-retro-block-hit-2185.mp3', 
    hint: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-interface-zoom-890.mp3',
  },
  pirate: {
    correct: 'https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3',
    incorrect: 'https://assets.mixkit.co/sfx/preview/mixkit-cannon-fire-shot-1678.mp3',
    win: 'https://assets.mixkit.co/sfx/preview/mixkit-medieval-show-fanfare-announcement-226.mp3',
    lose: 'https://assets.mixkit.co/sfx/preview/mixkit-wood-hard-hit-2182.mp3', 
    hint: 'https://assets.mixkit.co/sfx/preview/mixkit-coins-handling-1939.mp3',
  },
  space: {
    correct: 'https://assets.mixkit.co/sfx/preview/mixkit-space-coin-win-notification-271.mp3',
    incorrect: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3',
    win: 'https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3',
    lose: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-virus-scaner-alert-273.mp3',
    hint: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-laser-gun-shot-3113.mp3',
  },
  temple: {
    correct: 'https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3',
    incorrect: 'https://assets.mixkit.co/sfx/preview/mixkit-falling-rock-small-boulder-1272.mp3',
    win: 'https://assets.mixkit.co/sfx/preview/mixkit-medieval-show-fanfare-announcement-226.mp3',
    lose: 'https://assets.mixkit.co/sfx/preview/mixkit-lava-bubble-1328.mp3',
    hint: 'https://assets.mixkit.co/sfx/preview/mixkit-mysterious-wind-undead-ambient-2451.mp3',
  }
};

// Attribution: Sounds from Mixkit.co - Free Sound Effects
// License: Free to use in any project

export default function SoundEffects({ 
  theme = 'default', 
  onCorrect = false,
  onIncorrect = false,
  onWin = false,
  onLose = false,
  onHint = false,
  muted = false
}: SoundEffectsProps) {
  
  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const incorrectAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);
  const loseAudio = useRef<HTMLAudioElement | null>(null);
  const hintAudio = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements on client
  useEffect(() => {
    correctAudio.current = new Audio(themeSounds[theme as keyof typeof themeSounds]?.correct || themeSounds.default.correct);
    incorrectAudio.current = new Audio(themeSounds[theme as keyof typeof themeSounds]?.incorrect || themeSounds.default.incorrect);
    winAudio.current = new Audio(themeSounds[theme as keyof typeof themeSounds]?.win || themeSounds.default.win);
    loseAudio.current = new Audio(themeSounds[theme as keyof typeof themeSounds]?.lose || themeSounds.default.lose);
    hintAudio.current = new Audio(themeSounds[theme as keyof typeof themeSounds]?.hint || themeSounds.default.hint);
    
    // Set volume
    const setVolume = (audio: HTMLAudioElement | null) => {
      if (audio) audio.volume = 0.5;
    };
    
    setVolume(correctAudio.current);
    setVolume(incorrectAudio.current);
    setVolume(winAudio.current);
    setVolume(loseAudio.current);
    setVolume(hintAudio.current);
    
    // Preload sounds
    const preloadAudio = (audio: HTMLAudioElement | null) => {
      if (audio) {
        audio.preload = 'auto';
        // Listen for canplaythrough event to ensure audio is ready
        audio.addEventListener('canplaythrough', () => {
          // Audio is ready to play
        }, { once: true });
        // Force load
        audio.load();
      }
    };
    
    preloadAudio(correctAudio.current);
    preloadAudio(incorrectAudio.current);
    preloadAudio(winAudio.current);
    preloadAudio(loseAudio.current);
    preloadAudio(hintAudio.current);
    
    // Clean up on unmount
    return () => {
      correctAudio.current = null;
      incorrectAudio.current = null;
      winAudio.current = null;
      loseAudio.current = null;
      hintAudio.current = null;
    };
  }, [theme]);
  
  // Play sounds based on props
  useEffect(() => {
    if (muted) return;
    
    if (onCorrect && correctAudio.current) {
      correctAudio.current.currentTime = 0;
      correctAudio.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    if (onIncorrect && incorrectAudio.current) {
      incorrectAudio.current.currentTime = 0;
      incorrectAudio.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    if (onWin && winAudio.current) {
      winAudio.current.currentTime = 0;
      winAudio.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    if (onLose && loseAudio.current) {
      loseAudio.current.currentTime = 0;
      loseAudio.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    if (onHint && hintAudio.current) {
      hintAudio.current.currentTime = 0;
      hintAudio.current.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [onCorrect, onIncorrect, onWin, onLose, onHint, muted]);
  
  // This component doesn't render anything
  return null;
} 