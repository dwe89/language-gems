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

export default function SoundEffects({ 
  theme = 'default', 
  onCorrect = false,
  onIncorrect = false,
  onWin = false,
  onLose = false,
  onHint = false,
  muted = false
}: SoundEffectsProps) {
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement | null>>({});
  const [loaded, setLoaded] = useState(false);
  
  // Initialize sound effects based on theme
  useEffect(() => {
    // Only load sounds if not muted
    if (muted) return;
    
    const soundEffects: Record<string, HTMLAudioElement | null> = {};
    
    // Common sounds
    soundEffects.correct = new Audio('/games/hangman/sounds/common/correct.mp3');
    soundEffects.wrong = new Audio('/games/hangman/sounds/common/wrong.mp3');
    soundEffects.win = new Audio('/games/hangman/sounds/common/win.mp3');
    soundEffects.lose = new Audio('/games/hangman/sounds/common/lose.mp3');
    soundEffects.hint = new Audio('/games/hangman/sounds/common/hint.mp3');
    
    // Theme-specific sounds
    if (theme === 'space') {
      soundEffects.asteroidHit = new Audio('/games/hangman/sounds/space/asteroid-hit.mp3');
      soundEffects.alarm = new Audio('/games/hangman/sounds/space/alarm.mp3');
      soundEffects.spacePing = new Audio('/games/hangman/sounds/space/space-ping.mp3');
    } 
    else if (theme === 'underwater') {
      soundEffects.bubble = new Audio('/games/hangman/sounds/underwater/bubble.mp3');
      soundEffects.splash = new Audio('/games/hangman/sounds/underwater/splash.mp3');
      soundEffects.sonar = new Audio('/games/hangman/sounds/underwater/sonar.mp3');
    }
    else if (theme === 'temple') {
      // Lava Temple specific sounds
      soundEffects.lavaWave = new Audio('/games/hangman/sounds/lava-temple/lava-wave.mp3');
      soundEffects.wrongGuess = new Audio('/games/hangman/sounds/lava-temple/wrong-guess.mp3');
      soundEffects.glyphCorrect = new Audio('/games/hangman/sounds/lava-temple/glyph-correct.mp3');
      
      // Stone sliding sounds for puzzle elements
      soundEffects.stoneSlide1 = new Audio('/games/hangman/sounds/lava-temple/stone-slide-1.mp3');
      soundEffects.stoneSlide2 = new Audio('/games/hangman/sounds/lava-temple/stone-slide-2.mp3');
      soundEffects.stoneSlide3 = new Audio('/games/hangman/sounds/lava-temple/stone-slide-3.mp3');
      
      // Lava bubble sounds
      soundEffects.lavaBubble1 = new Audio('/games/hangman/sounds/lava-temple/lava-bubble-1.mp3');
      soundEffects.lavaBubble2 = new Audio('/games/hangman/sounds/lava-temple/lava-bubble-2.mp3');
      
      // Door unlock sound
      soundEffects.doorUnlock = new Audio('/games/hangman/sounds/lava-temple/door-unlock.mp3');
      
      // Trap activation sounds
      soundEffects.trapActivate = new Audio('/games/hangman/sounds/lava-temple/trap-activate.mp3');
      
      // Adjust volumes for lava temple sounds
      soundEffects.lavaWave.volume = 0.7;
      soundEffects.wrongGuess.volume = 0.8;
      soundEffects.glyphCorrect.volume = 0.7;
      soundEffects.stoneSlide1.volume = 0.6;
      soundEffects.stoneSlide2.volume = 0.6;
      soundEffects.stoneSlide3.volume = 0.6;
      soundEffects.lavaBubble1.volume = 0.5;
      soundEffects.lavaBubble2.volume = 0.5;
      soundEffects.doorUnlock.volume = 0.8;
      soundEffects.trapActivate.volume = 0.7;
    }
    
    // Set volume for common sounds
    Object.values(soundEffects).forEach(sound => {
      if (sound) sound.volume = 0.5;
    });
    
    // Set all sounds
    setSounds(soundEffects);
    setLoaded(true);
    
    // Cleanup function to stop all sounds
    return () => {
      Object.values(soundEffects).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, [theme, muted]);
  
  // Play sounds based on props
  useEffect(() => {
    if (muted || !loaded) return;
    
    const playSound = (soundName: string) => {
      const sound = sounds[soundName];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => console.error("Could not play sound:", err));
      }
    };
    
    if (onCorrect) {
      playSound(theme === 'temple' ? 'glyphCorrect' : 'correct');
    }
    
    if (onIncorrect) {
      playSound(theme === 'temple' ? 'wrongGuess' : 'wrong');
    }
    
    if (onWin) {
      playSound('win');
      if (theme === 'temple') {
        playSound('doorUnlock');
      }
    }
    
    if (onLose) {
      playSound('lose');
      if (theme === 'temple') {
        playSound('lavaWave');
      }
    }
    
    if (onHint) {
      playSound('hint');
    }
    
  }, [onCorrect, onIncorrect, onWin, onLose, onHint, sounds, muted, loaded, theme]);
  
  // Expose sound playing function to window for other components
  useEffect(() => {
    if (typeof window !== 'undefined' && loaded && !muted) {
      (window as any).playHangmanSound = (soundName: string) => {
        const sound = sounds[soundName];
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(err => console.error("Could not play sound:", err));
        }
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).playHangmanSound;
      }
    };
  }, [loaded, sounds, muted]);
  
  // No visible UI, this is just for sound management
  return null;
} 