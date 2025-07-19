import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useGameStore } from '../store/gameStore';

interface SoundEffects {
  [key: string]: Howl;
}

export const useBattleAudio = () => {
  const { settings } = useGameStore();
  const soundsRef = useRef<SoundEffects>({});
  const musicRef = useRef<Howl | null>(null);
  const isMusicPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize sound effects
    if (settings.soundEnabled) {
      try {
        soundsRef.current = {
          sword_clash: new Howl({
            src: ['/audio/battle/sword_clash.mp3'],
            volume: 0.6,
            preload: true,
            html5: true, // Use HTML5 audio for better compatibility
            onloaderror: (id, error) => {
              console.warn('Could not load sword_clash.mp3', error);
              // Fallback: disable this sound
            },
            onload: () => console.log('Loaded sword_clash.mp3'),
          }),
          magic_cast: new Howl({
            src: ['/audio/battle/magic_cast.mp3'], 
            volume: 0.5,
            preload: true,
            html5: true,
            onloaderror: (id, error) => {
              console.warn('Could not load magic_cast.mp3', error);
            },
            onload: () => console.log('Loaded magic_cast.mp3'),
          }),
          correct_answer: new Howl({
            src: ['/audio/battle/correct_answer.mp3'],
            volume: 0.7,
            preload: true,
            html5: true,
            onloaderror: (id, error) => {
              console.warn('Could not load correct_answer.mp3', error);
            },
            onload: () => console.log('Loaded correct_answer.mp3'),
          }),
          wrong_answer: new Howl({
            src: ['/audio/battle/wrong_answer.mp3'],
            volume: 0.6,
            preload: true,
            html5: true,
            onloaderror: (id, error) => {
              console.warn('Could not load wrong_answer.mp3', error);
            },
            onload: () => console.log('Loaded wrong_answer.mp3'),
          }),
          victory: new Howl({
            src: ['/audio/battle/victory.mp3'],
            volume: 0.8,
            preload: true,
            html5: true,
            onloaderror: (id, error) => {
              console.warn('Could not load victory.mp3', error);
            },
            onload: () => console.log('Loaded victory.mp3'),
          }),
          defeat: new Howl({
            src: ['/audio/battle/defeat.mp3'],
            volume: 0.7,
            preload: true,
            html5: true,
            onloaderror: (id, error) => {
              console.warn('Could not load defeat.mp3', error);
            },
            onload: () => console.log('Loaded defeat.mp3'),
          }),
          level_up: new Howl({
            src: ['/audio/battle/level_up.mp3'],
            volume: 0.8,
            preload: true,
            html5: true,
            onloaderror: (id, error) => {
              console.warn('Could not load level_up.mp3', error);
            },
            onload: () => console.log('Loaded level_up.mp3'),
          })
        };
      } catch (error) {
        console.warn('Failed to initialize sound effects:', error);
      }
    }

    // Initialize background music
    if (settings.musicEnabled) {
      try {
        musicRef.current = new Howl({
          src: ['/audio/battle/battle_theme.mp3'],
          volume: 0.2, // Lower volume 
          loop: false, // Disable loop temporarily to test
          preload: true,
          html5: true,
          onloaderror: (id, error) => console.warn('Could not load battle_theme.mp3', error),
          onload: () => console.log('Loaded battle_theme.mp3'),
          onplay: () => {
            console.log('Started playing battle_theme.mp3');
            isMusicPlayingRef.current = true;
          },
          onpause: () => {
            console.log('Paused battle_theme.mp3');
            isMusicPlayingRef.current = false;
          },
          onstop: () => {
            console.log('Stopped battle_theme.mp3');
            isMusicPlayingRef.current = false;
          },
          onend: () => {
            console.log('Battle theme ended');
            isMusicPlayingRef.current = false;
          }
        });
      } catch (error) {
        console.warn('Failed to initialize background music:', error);
      }
    }

    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach(sound => sound.unload());
      if (musicRef.current) {
        musicRef.current.unload();
      }
    };
  }, [settings.soundEnabled, settings.musicEnabled]);

  const playSound = useCallback((soundName: string) => {
    console.log('Attempting to play sound:', soundName);
    console.log('Sound enabled:', settings.soundEnabled);
    console.log('Available sounds:', Object.keys(soundsRef.current));
    
    if (settings.soundEnabled && soundsRef.current[soundName]) {
      try {
        console.log('Playing sound:', soundName);
        soundsRef.current[soundName].play();
      } catch (error) {
        console.warn(`Failed to play sound ${soundName}:`, error);
      }
    } else {
      console.warn(`Sound ${soundName} not available or sound disabled`);
    }
  }, [settings.soundEnabled]);

  const playMusic = useCallback(() => {
    console.log('Attempting to play music. Enabled:', settings.musicEnabled, 'Music ref:', !!musicRef.current, 'Already playing:', isMusicPlayingRef.current);
    if (settings.musicEnabled && musicRef.current && !isMusicPlayingRef.current) {
      try {
        console.log('Playing music...');
        musicRef.current.play();
        isMusicPlayingRef.current = true;
      } catch (error) {
        console.warn('Failed to play background music:', error);
      }
    }
  }, [settings.musicEnabled]);

  const stopMusic = useCallback(() => {
    console.log('Stopping music. Music ref:', !!musicRef.current, 'Was playing:', isMusicPlayingRef.current);
    if (musicRef.current && isMusicPlayingRef.current) {
      try {
        musicRef.current.stop();
        isMusicPlayingRef.current = false;
      } catch (error) {
        console.warn('Failed to stop background music:', error);
      }
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (musicRef.current) {
      try {
        musicRef.current.pause();
      } catch (error) {
        console.warn('Failed to pause background music:', error);
      }
    }
  }, []);

  return {
    playSound,
    playMusic,
    stopMusic,
    pauseMusic,
  };
};
