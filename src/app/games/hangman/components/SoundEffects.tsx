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
    
    // Common sounds - using existing audio files
    soundEffects.correct = new Audio('/audio/sfx/correct-answer.mp3');
    soundEffects.wrong = new Audio('/audio/sfx/wrong-answer.mp3');
    soundEffects.win = new Audio('/audio/sfx/victory.mp3');
    soundEffects.lose = new Audio('/audio/sfx/defeat.mp3');
    soundEffects.hint = new Audio('/audio/sfx/button-click.mp3');
    soundEffects.canonFire = new Audio('/audio/sfx/canon-fire.mp3');
    
    // Theme-specific sounds
    if (theme === 'default') {
      // Classic hangman background music
      soundEffects.backgroundMusic = new Audio('/audio/themes/classic-ambient.mp3');
      if (soundEffects.backgroundMusic) {
        soundEffects.backgroundMusic.loop = true;
        soundEffects.backgroundMusic.volume = 0.3;
      }
    }
    else if (theme === 'space') {
      soundEffects.asteroidHit = new Audio('/audio/sfx/space-docking.mp3');
      soundEffects.alarm = new Audio('/audio/sfx/wrong-answer.mp3');
      soundEffects.spacePing = new Audio('/audio/sfx/space-docking.mp3');
      soundEffects.backgroundMusic = new Audio('/audio/themes/space-explorer-ambient.mp3');
      if (soundEffects.backgroundMusic) {
        soundEffects.backgroundMusic.loop = true;
        soundEffects.backgroundMusic.volume = 0.3;
      }
    }
    else if (theme === 'tokyo') {
      soundEffects.hack = new Audio('/audio/sfx/tokyo-hack.mp3');
      soundEffects.backgroundMusic = new Audio('/audio/themes/tokyo-nights-ambient.mp3');
      if (soundEffects.backgroundMusic) {
        soundEffects.backgroundMusic.loop = true;
        soundEffects.backgroundMusic.volume = 0.3;
      }
    }
    else if (theme === 'pirate') {
      soundEffects.treasure = new Audio('/audio/sfx/pirate-treasure.mp3');
      soundEffects.canonFire = new Audio('/audio/sfx/canon-fire.mp3');
      soundEffects.backgroundMusic = new Audio('/audio/themes/pirate-adventure-ambient.mp3');
      if (soundEffects.backgroundMusic) {
        soundEffects.backgroundMusic.loop = true;
        soundEffects.backgroundMusic.volume = 0.3;
      }
    }
    else if (theme === 'temple') {
      // Lava Temple specific sounds
      soundEffects.templePower = new Audio('/audio/sfx/temple-power.mp3');
      soundEffects.wrongGuess = new Audio('/audio/sfx/wrong-answer.mp3');
      soundEffects.glyphCorrect = new Audio('/audio/sfx/correct-answer.mp3');
      soundEffects.backgroundMusic = new Audio('/audio/themes/lava-temple-ambient.mp3');

      if (soundEffects.backgroundMusic) {
        soundEffects.backgroundMusic.loop = true;
        soundEffects.backgroundMusic.volume = 0.3;
      }

      // Adjust volumes for lava temple sounds
      soundEffects.templePower.volume = 0.7;
      soundEffects.wrongGuess.volume = 0.8;
      soundEffects.glyphCorrect.volume = 0.7;
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
      (window as any).playCanonFire = () => {
        const sound = sounds.canonFire;
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(err => console.error("Could not play canon fire sound:", err));
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