'use client';

import { useRef, useEffect, useCallback } from 'react';

interface AudioFiles {
  // Gem collection sounds (core functionality)
  gems: {
    'common': string;
    'uncommon': string;
    'rare': string;
    'epic': string;
    'legendary': string;
  };
  // Achievement sounds
  achievements: {
    'unlock': string;
    'rare': string;
    'legendary': string;
  };
  // Basic feedback sounds
  feedback: {
    'correct': string;
    'incorrect': string;
    'victory': string;
  };
  // Background music
  music: {
    'background': string;
  };
}

const AUDIO_FILES: AudioFiles = {
  gems: {
    'common': '/audio/gems/gem-common.mp3',
    'uncommon': '/audio/gems/gem-uncommon.mp3',
    'rare': '/audio/gems/gem-rare.mp3',
    'epic': '/audio/gems/gem-epic.mp3',
    'legendary': '/audio/gems/gem-legendary.mp3'
  },
  achievements: {
    'unlock': '/audio/achievements/achievement-unlock.mp3',
    'rare': '/audio/achievements/achievement-rare.mp3',
    'legendary': '/audio/achievements/achievement-legendary.mp3'
  },
  feedback: {
    'correct': '/audio/battle/correct_answer.mp3',
    'incorrect': '/audio/sfx/wrong-answer.mp3',
    'victory': '/audio/battle/victory.mp3'
  },
  music: {
    'background': '/audio/themes/vocabulary-mining.mp3'
  }
};

export const useAudio = (soundEnabled: boolean = true) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio files and background music
  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    // Preload gem sounds
    Object.entries(AUDIO_FILES.gems).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.8;
      audio.loop = false;
      audioRefs.current[`gem-${key}`] = audio;
    });

    // Preload achievement sounds
    Object.entries(AUDIO_FILES.achievements).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.7;
      audio.loop = false;
      audioRefs.current[`achievement-${key}`] = audio;
    });

    // Preload feedback sounds
    Object.entries(AUDIO_FILES.feedback).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.6;
      audio.loop = false;
      audioRefs.current[`feedback-${key}`] = audio;
    });

    // Initialize and play background music
    if (!backgroundMusicRef.current) {
      const bgMusic = new Audio(AUDIO_FILES.music.background);
      bgMusic.loop = true; // Loop the background music
      bgMusic.volume = 0.3; // Set a lower volume for background music
      bgMusic.preload = 'auto';
      backgroundMusicRef.current = bgMusic;
    }

  }, []);

  // Control background music playback based on soundEnabled
  useEffect(() => {
    if (typeof window === 'undefined' || !backgroundMusicRef.current) return;

    if (soundEnabled) {
      backgroundMusicRef.current.play().catch((error) => {
        console.warn('Failed to play background music:', error);
      });
    } else {
      backgroundMusicRef.current.pause();
    }

    // Cleanup: pause music when component unmounts
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
    };
  }, [soundEnabled]);

  // Play gem collection sound
  const playGemSound = useCallback((gemType: keyof AudioFiles['gems']) => {
    if (!soundEnabled || typeof window === 'undefined') return;

    const audio = audioRefs.current[`gem-${gemType}`];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn(`Failed to play gem sound ${gemType}:`, error);
      });
    }
  }, [soundEnabled]);

  // Play achievement sound
  const playAchievementSound = useCallback((achievementType: keyof AudioFiles['achievements'] = 'unlock') => {
    if (!soundEnabled || typeof window === 'undefined') return;

    const audio = audioRefs.current[`achievement-${achievementType}`];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn(`Failed to play achievement sound ${achievementType}:`, error);
      });
    }
  }, [soundEnabled]);

  // Play feedback sound
  const playFeedbackSound = useCallback((feedbackType: keyof AudioFiles['feedback']) => {
    if (!soundEnabled || typeof window === 'undefined') return;

    const audio = audioRefs.current[`feedback-${feedbackType}`];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn(`Failed to play feedback sound ${feedbackType}:`, error);
      });
    }
  }, [soundEnabled]);

  // Play word pronunciation audio with replay tracking
  const playWordAudio = useCallback((audioUrl: string, canReplay: boolean = true) => {
    if (!soundEnabled || !audioUrl || typeof window === 'undefined') return Promise.resolve();

    return new Promise<void>((resolve) => {
      try {
        // Use ref to maintain audio element for replay control
        if (wordAudioRef.current) {
          wordAudioRef.current.pause();
          wordAudioRef.current.currentTime = 0;
        }

        wordAudioRef.current = new Audio(audioUrl);
        wordAudioRef.current.volume = 0.8;

        wordAudioRef.current.onended = () => resolve();
        wordAudioRef.current.onerror = () => {
          console.warn('Failed to load word audio:', audioUrl);
          resolve();
        };

        if (canReplay) {
          wordAudioRef.current.play().catch((error) => {
            console.warn('Failed to play word audio:', error);
            resolve();
          });
        } else {
          console.warn('Audio replay limit reached');
          resolve();
        }
      } catch (error) {
        console.warn('Failed to play word audio:', error);
        resolve();
      }
    });
  }, [soundEnabled]);

  // Auto-play word audio for specific game modes
  const autoPlayWordAudio = useCallback((audioUrl: string, gameMode: string) => {
    const autoPlayModes = ['learn', 'listening', 'dictation'];
    if (autoPlayModes.includes(gameMode)) {
      return playWordAudio(audioUrl, true);
    }
    return Promise.resolve();
  }, [playWordAudio]);

  return {
    playGemSound,
    playAchievementSound,
    playFeedbackSound,
    playWordAudio,
    autoPlayWordAudio
  };
};