import { useRef, useEffect, useCallback } from 'react';

export interface SoundEffects {
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playBlockPlacement: () => void;
  playBlockFalling: () => void;
  playCorrectAnswer: () => void;
  playWrongAnswer: () => void;
  playCraneMovement: () => void;
  setVolume: (volume: number) => void;
  mute: (shouldMute: boolean) => void;
}

export const useSounds = (enabled: boolean = true): SoundEffects => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const isMuted = useRef<boolean>(false);

  useEffect(() => {
    // Preload all sound files
    const sounds = {
      backgroundmusic: '/games/sentence-towers/sounds/backgroundmusic.mp3',
      blockplacement: '/games/sentence-towers/sounds/blockplacement.mp3',
      blockfalling: '/games/sentence-towers/sounds/blockfalling.mp3',
      correctanswer: '/games/sentence-towers/sounds/correctanswer.mp3',
      wronganswer: '/games/sentence-towers/sounds/wronganswer.mp3',
      cranemovement: '/games/sentence-towers/sounds/cranemovement.mp3',
    };

    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.7;
      audioRefs.current[key] = audio;
    });

    // Set background music to loop
    if (audioRefs.current.backgroundmusic) {
      audioRefs.current.backgroundmusic.loop = true;
      audioRefs.current.backgroundmusic.volume = 0.3; // Lower volume for background music
    }

    return () => {
      // Cleanup audio objects
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = useCallback((soundKey: string) => {
    if (!enabled || isMuted.current) return;
    
    const audio = audioRefs.current[soundKey];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn('Failed to play sound:', soundKey, error);
      });
    }
  }, [enabled]);

  const playBackgroundMusic = useCallback(() => {
    if (!enabled || isMuted.current) return;
    
    const audio = audioRefs.current.backgroundmusic;
    if (audio && audio.paused) {
      audio.play().catch(error => {
        console.warn('Failed to play background music:', error);
      });
    }
  }, [enabled]);

  const stopBackgroundMusic = useCallback(() => {
    const audio = audioRefs.current.backgroundmusic;
    if (audio && !audio.paused) {
      audio.pause();
    }
  }, []);

  const playBlockPlacement = useCallback(() => {
    playSound('blockplacement');
  }, [playSound]);

  const playBlockFalling = useCallback(() => {
    playSound('blockfalling');
  }, [playSound]);

  const playCorrectAnswer = useCallback(() => {
    playSound('correctanswer');
  }, [playSound]);

  const playWrongAnswer = useCallback(() => {
    playSound('wronganswer');
  }, [playSound]);

  const playCraneMovement = useCallback(() => {
    playSound('cranemovement');
  }, [playSound]);

  const setVolume = useCallback((volume: number) => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio === audioRefs.current.backgroundmusic) {
        audio.volume = volume * 0.3; // Keep background music quieter
      } else {
        audio.volume = volume;
      }
    });
  }, []);

  const mute = useCallback((shouldMute: boolean) => {
    isMuted.current = shouldMute;
    if (shouldMute) {
      stopBackgroundMusic();
    }
  }, [stopBackgroundMusic]);

  return {
    playBackgroundMusic,
    stopBackgroundMusic,
    playBlockPlacement,
    playBlockFalling,
    playCorrectAnswer,
    playWrongAnswer,
    playCraneMovement,
    setVolume,
    mute,
  };
};
