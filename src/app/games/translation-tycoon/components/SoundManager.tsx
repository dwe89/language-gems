'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { ThemeType } from '../types';

// Define sound types for the game
type SoundType = 
  | 'correct' 
  | 'incorrect' 
  | 'purchase' 
  | 'levelUp' 
  | 'coin' 
  | 'challenge' 
  | 'upgrade'
  | 'ui';

// Context for sound management
interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  musicEnabled: boolean;
  toggleMusic: () => void;
  playSound: (type: SoundType) => void;
  setCurrentTheme: (theme: ThemeType) => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  musicEnabled: true,
  toggleMusic: () => {},
  playSound: () => {},
  setCurrentTheme: () => {}
});

export const useSound = () => useContext(SoundContext);

// Sound Manager Provider Component
export const SoundProvider: React.FC<{
  children: React.ReactNode;
  initialSoundEnabled?: boolean;
  initialMusicEnabled?: boolean;
  initialTheme?: ThemeType;
}> = ({ 
  children, 
  initialSoundEnabled = true, 
  initialMusicEnabled = true,
  initialTheme = 'default'
}) => {
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
  const [musicEnabled, setMusicEnabled] = useState(initialMusicEnabled);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement | null }>({});
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    // Sound effects
    const soundEffects: { [key in SoundType]: string } = {
      correct: '/sounds/correct.mp3',
      incorrect: '/sounds/incorrect.mp3',
      purchase: '/sounds/purchase.mp3',
      levelUp: '/sounds/level-up.mp3',
      coin: '/sounds/coin.mp3',
      challenge: '/sounds/challenge.mp3',
      upgrade: '/sounds/upgrade.mp3',
      ui: '/sounds/ui.mp3'
    };
    
    // Create audio elements for each sound
    const audioEls: { [key: string]: HTMLAudioElement } = {};
    Object.entries(soundEffects).forEach(([type, src]) => {
      if (typeof window !== 'undefined') {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audioEls[type] = audio;
      }
    });
    
    setAudioElements(audioEls);
    
    // Background music based on theme
    if (typeof window !== 'undefined') {
      const music = new Audio(`/music/${currentTheme}.mp3`);
      music.loop = true;
      setBackgroundMusic(music);
    }
    
    // Cleanup function
    return () => {
      Object.values(audioEls).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.src = '';
      }
    };
  }, [currentTheme]);
  
  // Handle background music
  useEffect(() => {
    if (backgroundMusic) {
      if (musicEnabled) {
        backgroundMusic.play().catch(err => {
          console.log('Autoplay prevented:', err);
          // We'll handle play on user interaction
        });
      } else {
        backgroundMusic.pause();
      }
    }
  }, [musicEnabled, backgroundMusic]);
  
  // Play a sound effect
  const playSound = (type: SoundType) => {
    if (soundEnabled && audioElements[type]) {
      const audio = audioElements[type];
      if (audio) {
        // Reset in case it's already playing
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.log('Sound play error:', err);
        });
      }
    }
  };
  
  // Toggle sound effects
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  
  // Toggle background music
  const toggleMusic = () => {
    setMusicEnabled(prev => !prev);
  };
  
  const value: SoundContextType = {
    soundEnabled,
    toggleSound,
    musicEnabled,
    toggleMusic,
    playSound,
    setCurrentTheme
  };
  
  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

// Controls component for sound/music
export const SoundControls: React.FC = () => {
  const { soundEnabled, toggleSound, musicEnabled, toggleMusic } = useSound();
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSound}
        className="p-2 rounded-full hover:bg-gray-200"
        title={soundEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects'}
      >
        {soundEnabled ? (
          <Volume2 size={20} className="text-emerald-600" />
        ) : (
          <VolumeX size={20} className="text-gray-400" />
        )}
      </button>
      
      <button
        onClick={toggleMusic}
        className="p-2 rounded-full hover:bg-gray-200"
        title={musicEnabled ? 'Disable Background Music' : 'Enable Background Music'}
      >
        {musicEnabled ? (
          <Music size={20} className="text-emerald-600" />
        ) : (
          <Music2 size={20} className="text-gray-400" />
        )}
      </button>
    </div>
  );
}; 