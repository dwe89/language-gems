'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { AudioManager } from '../types';
import { getAudioUrl, checkAudioExists } from '../utils/audioUtils';
import { createAudio } from '@/utils/audioUtils';

export const useAudioManager = (isMuted: boolean = false): AudioManager & {
  preloadAudio: (audioFiles: string[]) => Promise<void>;
  clearCache: () => void;
  getCacheStatus: () => { cached: number; total: number };
} => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;
    
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.warn('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [volume]);

  const handleAudioFallback = useCallback(async (audioFile: string, fallbackText?: string) => {
    try {
      // Disable TTS fallback for detective listening game
      console.log(`Audio file not found: ${audioFile} - skipping TTS fallback`);
      setIsPlaying(false);
    } catch (fallbackError) {
      console.warn('Fallback audio generation failed:', fallbackError);
      setIsPlaying(false);
    }
  }, []);

  const extractTextFromFilename = (filename: string): string => {
    // Handle different filename formats
    const parts = filename.split('_');

    if (parts.length >= 3) {
      // Format: "es_animals_perro.mp3"
      return parts[2].replace('.mp3', '');
    } else if (parts.length === 2 && parts[0] === 'detective') {
      // Format: "detective_word.mp3"
      return parts[1].replace('.mp3', '');
    } else if (filename.includes('detective_')) {
      // Format: "detective_word.mp3" - extract everything after detective_
      return filename.replace('detective_', '').replace('.mp3', '');
    }

    // Fallback: try to extract any word from filename
    return filename.replace('.mp3', '').replace(/^.*_/, '') || 'word';
  };

  const extractLanguageFromFilename = (filename: string): string => {
    // Extract language code from filename
    const parts = filename.split('_');
    if (parts.length >= 1) {
      const langCode = parts[0];
      switch (langCode) {
        case 'es': return 'es-ES';
        case 'fr': return 'fr-FR';
        case 'de': return 'de-DE';
        default: return 'en-US';
      }
    }
    return 'en-US';
  };

  const playTextToSpeech = useCallback(async (text: string, language: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8; // Slower for learning
      utterance.volume = volume;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        resolve();
      };
      utterance.onerror = (error) => {
        setIsPlaying(false);
        reject(error);
      };

      speechSynthesis.speak(utterance);
    });
  }, [volume]);

  const stopAudio = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const playEvidence = useCallback(async (audioFile: string, fallbackText?: string): Promise<void> => {
    if (!audioRef.current || isMuted) return;

    try {
      // Stop current audio if playing
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Check if audioFile is already a full URL or just a filename
      let audioUrl: string;
      if (audioFile.startsWith('http')) {
        // It's already a full URL from centralized_vocabulary
        audioUrl = audioFile;
        console.log(`🎵 Loading audio from centralized vocabulary: ${audioUrl}`);
      } else {
        // It's a filename, use the Supabase Storage path
        audioUrl = getAudioUrl(audioFile);
        console.log(`🎵 Loading audio from Supabase Storage: ${audioUrl}`);
      }

      audioRef.current.src = audioUrl;

      // Add error handling for missing files
      audioRef.current.onerror = () => {
        console.warn(`Audio file not found in Supabase Storage: ${audioFile}`);
        // Try fallback: generate audio on-demand or use placeholder
        handleAudioFallback(audioFile, fallbackText);
      };

      // Play the audio
      await audioRef.current.play();
    } catch (error) {
      console.warn('Failed to play audio:', error);
      setIsPlaying(false);
      handleAudioFallback(audioFile, fallbackText);
    }
  }, [isPlaying, handleAudioFallback]);

  // Preload audio files for better performance
  const preloadAudio = useCallback(async (audioFiles: string[]): Promise<void> => {
    const promises = audioFiles.map(async (filename) => {
      if (audioCache.current.has(filename)) {
        return; // Already cached
      }

      try {
        // Get Supabase Storage URL for the audio file
        const audioUrl = getAudioUrl(filename);
        console.log(`📦 Preloading: ${filename} from ${audioUrl}`);
        
        const audio = createAudio(audioUrl);
        audio.preload = 'auto';
        audio.volume = volume;

        await new Promise<void>((resolve, reject) => {
          audio.addEventListener('canplaythrough', () => resolve());
          audio.addEventListener('error', () => {
            console.warn(`Failed to preload from Supabase: ${filename}`);
            resolve(); // Don't reject to avoid blocking other files
          });
          audio.load();
        });

        audioCache.current.set(filename, audio);
      } catch (error) {
        console.warn(`Error preloading ${filename}:`, error);
      }
    });

    await Promise.all(promises);
    console.log(`✅ Preloaded ${audioCache.current.size} audio files from Supabase Storage`);
  }, [volume]);

  // Clear audio cache
  const clearCache = useCallback(() => {
    audioCache.current.forEach(audio => {
      audio.src = '';
    });
    audioCache.current.clear();
    console.log('🗑️ Audio cache cleared');
  }, []);

  // Get cache status
  const getCacheStatus = useCallback(() => {
    return {
      cached: audioCache.current.size,
      total: audioCache.current.size // This would be total expected files in real implementation
    };
  }, []);

  // Enhanced playEvidence that uses cache
  const playEvidenceFromCache = useCallback(async (audioFile: string, fallbackText?: string): Promise<void> => {
    try {
      // Try to get from cache first
      const cachedAudio = audioCache.current.get(audioFile);

      if (cachedAudio) {
        // Stop current audio if playing
        if (isPlaying) {
          audioRef.current?.pause();
        }

        // Use cached audio
        audioRef.current = cachedAudio;
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } else {
        // Fall back to regular loading
        await playEvidence(audioFile, fallbackText);
      }
    } catch (error) {
      console.warn('Failed to play cached audio:', error);
      await playEvidence(audioFile, fallbackText);
    }
  }, [isPlaying, playEvidence]);

  return {
    playEvidence: playEvidenceFromCache,
    stopAudio,
    setVolume,
    isPlaying,
    preloadAudio,
    clearCache,
    getCacheStatus
  };
};

// Hook for managing radio static and background sounds
export const useRadioEffects = () => {
  const staticRef = useRef<HTMLAudioElement | null>(null);
  const [staticPlaying, setStaticPlaying] = useState(false);

  useEffect(() => {
    staticRef.current = createAudio('/audio/detective-listening/radio-static.mp3');
    staticRef.current.loop = true;
    staticRef.current.volume = 0.1;

    const handleStaticEnded = () => setStaticPlaying(false);
    const handleStaticPlay = () => setStaticPlaying(true);
    const handleStaticPause = () => setStaticPlaying(false);

    staticRef.current.addEventListener('ended', handleStaticEnded);
    staticRef.current.addEventListener('play', handleStaticPlay);
    staticRef.current.addEventListener('pause', handleStaticPause);

    return () => {
      if (staticRef.current) {
        staticRef.current.removeEventListener('ended', handleStaticEnded);
        staticRef.current.removeEventListener('play', handleStaticPlay);
        staticRef.current.removeEventListener('pause', handleStaticPause);
        staticRef.current.pause();
        staticRef.current.src = '';
      }
    };
  }, []);

  const playStatic = useCallback(() => {
    if (staticRef.current && !staticPlaying) {
      staticRef.current.play().catch(console.warn);
    }
  }, [staticPlaying]);

  const stopStatic = useCallback(() => {
    if (staticRef.current && staticPlaying) {
      staticRef.current.pause();
    }
  }, [staticPlaying]);

  return {
    playStatic,
    stopStatic,
    staticPlaying
  };
};

// Audio file paths configuration
export const AUDIO_PATHS = {
  BASE_PATH: '/audio/detective-listening/',
  RADIO_STATIC: 'radio-static.mp3',
  CORRECT_EVIDENCE: 'correct-evidence.mp3',
  WRONG_EVIDENCE: 'wrong-evidence.mp3',
  CASE_SOLVED: 'case-solved.mp3',
  RADIO_TUNE: 'radio-tune.mp3'
};

// Utility function to preload audio files
export const preloadAudio = (audioFiles: string[]): Promise<void[]> => {
  return Promise.all(
    audioFiles.map(file => {
      return new Promise<void>((resolve, reject) => {
        const audio = createAudio(`${AUDIO_PATHS.BASE_PATH}${file}`);
        audio.addEventListener('canplaythrough', () => resolve());
        audio.addEventListener('error', () => {
          console.warn(`Failed to preload audio: ${file}`);
          resolve(); // Resolve anyway to not block the game
        });
        audio.load();
      });
    })
  );
};
