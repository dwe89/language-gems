'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Use module-scoped variables to ensure singletons for AudioContext and initialization promise
// These will persist across renders and prevent multiple contexts from being created.
let globalAudioContext: AudioContext | null = null;
let audioInitializationPromise: Promise<void> | null = null;
let isGlobalAudioInitialized: boolean = false; // Flag to track if context has been successfully initialized/resumed

interface AudioContextState {
  isInitialized: boolean; // Has initializeAudio been called and attempted to resume?
  isEnabled: boolean;     // User's preference to have audio enabled/disabled
  audioContext: AudioContext | null;
  isRunning: boolean;     // Is the AudioContext actually in a 'running' state?
}

interface AudioContextManager {
  state: AudioContextState;
  initializeAudio: () => Promise<void>;
  enableAudio: () => void;
  disableAudio: () => void;
  playAudio: (audioElement: HTMLAudioElement) => Promise<void>;
  playSFX: (audioElement: HTMLAudioElement) => Promise<void>; // Retained from original prompt as a specific type of play
}

/**
 * Global Audio Context Hook
 *
 * This hook provides a centralized way to manage audio context across the entire application.
 * It handles browser autoplay restrictions and ensures audio works in both normal and assignment modes.
 */
export const useGlobalAudioContext = (): AudioContextManager => {
  // Use a ref for the AudioContext itself to ensure stability across renders
  const audioContextRef = useRef<AudioContext | null>(globalAudioContext);

  const [state, setState] = useState<AudioContextState>({
    isInitialized: isGlobalAudioInitialized,
    isEnabled: true, // Default to enabled
    audioContext: audioContextRef.current,
    isRunning: audioContextRef.current?.state === 'running' || false,
  });

  // Effect to keep local state in sync with global singleton on initial mount/re-renders if changed externally
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isInitialized: isGlobalAudioInitialized,
      audioContext: globalAudioContext,
      isRunning: globalAudioContext?.state === 'running' || false,
    }));
  }, []); // Only run once on mount

  // Function to initialize or resume the AudioContext
  const initializeAudio = useCallback(async (): Promise<void> => {
    // If an initialization is already in progress, return its promise
    if (audioInitializationPromise) {
      return audioInitializationPromise;
    }

    // If already successfully initialized and running, no need to re-initialize
    if (isGlobalAudioInitialized && audioContextRef.current?.state === 'running') {
      return Promise.resolve();
    }

    // Set a new promise for ongoing initialization
    audioInitializationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log('🎵 GlobalAudioContext: Initializing audio context...');

        if (typeof window === 'undefined') {
          console.warn('🎵 GlobalAudioContext: Not in browser environment, skipping initialization');
          resolve();
          return;
        }

        const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextConstructor) {
          console.warn('🎵 GlobalAudioContext: AudioContext not supported by this browser');
          resolve();
          return;
        }

        // Create context if it doesn't exist
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContextConstructor();
          globalAudioContext = audioContextRef.current; // Store globally
          console.log('🎵 GlobalAudioContext: New AudioContext created.');
        }

        // Resume context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('🎵 GlobalAudioContext: AudioContext resumed successfully.');
        }

        isGlobalAudioInitialized = true; // Mark as successfully initialized
        setState(prev => ({
          ...prev,
          isInitialized: true,
          audioContext: audioContextRef.current,
          isRunning: audioContextRef.current?.state === 'running' || false,
        }));

        console.log('✅ GlobalAudioContext: Audio context initialized successfully (and running if resumed)');
        resolve();
      } catch (error) {
        console.error('❌ GlobalAudioContext: Failed to initialize/resume audio context:', error);
        isGlobalAudioInitialized = false; // Reset if initialization fails
        setState(prev => ({
          ...prev,
          isInitialized: false,
          isRunning: false,
        }));
        reject(error);
      } finally {
        audioInitializationPromise = null; // Clear promise after completion
      }
    });

    return audioInitializationPromise;
  }, []); // Dependencies: None, as it manages its own state and refs

  // Enable audio
  const enableAudio = useCallback(() => {
    setState(prev => ({ ...prev, isEnabled: true }));
    // If previously disabled and context exists, try to resume on enable
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(e => console.warn('Failed to resume context on enable:', e));
    }
  }, []);

  // Disable audio
  const disableAudio = useCallback(() => {
    setState(prev => ({ ...prev, isEnabled: false }));
    // Suspend context when disabled, to save resources
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend().catch(e => console.warn('Failed to suspend context on disable:', e));
    }
  }, []);

  // Play audio with proper error handling and checks
  const playAudio = useCallback(async (audioElement: HTMLAudioElement): Promise<void> => {
    if (!state.isEnabled) {
      console.log('🔇 GlobalAudioContext: Audio disabled by user, skipping playback');
      return;
    }

    // Autoplay restrictions require user gesture for initial context start.
    // We try to initialize/resume here, but actual play might still be blocked
    // if a gesture hasn't happened. The useEffect below handles the first gesture.
    if (!state.isInitialized || audioContextRef.current?.state !== 'running') {
      console.warn('🎵 GlobalAudioContext: AudioContext not yet running or initialized, attempting to initialize before play...');
      try {
        await initializeAudio(); // Attempt to resume/initialize
        if (audioContextRef.current?.state !== 'running') {
          console.warn('🎵 GlobalAudioContext: AudioContext still not running after attempt. Playback may be blocked by autoplay policy.');
          // Fallback to direct HTMLAudioElement play, which might still fail without gesture
          await audioElement.play().catch(e => {
            if (e instanceof DOMException && e.name === 'NotAllowedError') {
              console.warn('🎵 GlobalAudioContext: Autoplay blocked for direct HTMLAudioElement play.');
            } else {
              console.error('🎵 GlobalAudioContext: Fallback audio play failed:', e);
            }
            throw e; // Re-throw to propagate error
          });
          return;
        }
      } catch (error) {
        console.error('🎵 GlobalAudioContext: Failed to initialize audio context before playing:', error);
        throw error; // Re-throw the initialization error
      }
    }

    try {
      await audioElement.play();
    } catch (error) {
      console.warn('🎵 GlobalAudioContext: Failed to play audio element:', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        console.log('🎵 GlobalAudioContext: Autoplay blocked for this specific play action. Ensure a user gesture occurred.');
      }
      throw error; // Re-throw to allow calling component to handle
    }
  }, [state.isEnabled, state.isInitialized, initializeAudio]);

  // playSFX is just an alias to playAudio, as they both use HTMLAudioElement now
  const playSFX = playAudio;

  // Auto-initialize on first user interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUserInteraction = async () => {
      // Only attempt to initialize if not already done
      // This listener handles the *very first* user gesture on the page.
      if (!isGlobalAudioInitialized) {
        try {
          console.log('🎵 GlobalAudioContext: User interaction detected, attempting to initialize audio context...');
          await initializeAudio();
        } catch (error) {
          console.warn('🎵 GlobalAudioContext: Failed to initialize on user interaction:', error);
        }
      }

      // If context is running or initialization failed, remove listeners.
      // If context is still suspended, it means it requires a direct interaction
      // to the element that tries to play, so we keep the listener.
      if (globalAudioContext?.state === 'running' || !globalAudioContext) {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        console.log('🎵 GlobalAudioContext: Removed initial user interaction listeners.');
      }
    };

    // Add event listeners for initial user interaction (passive for performance)
    document.addEventListener('click', handleUserInteraction, { passive: true });
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      // Cleanup listeners if component unmounts
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [initializeAudio]); // Dependency array: initializeAudio (stable due to useCallback)

  // Update `isRunning` state based on AudioContext's actual state changes
  useEffect(() => {
    const context = audioContextRef.current;
    if (context) {
      const handleStateChange = () => {
        setState(prev => ({ ...prev, isRunning: context.state === 'running' }));
        console.log(`🎵 GlobalAudioContext: AudioContext state changed to: ${context.state}`);
      };
      context.addEventListener('statechange', handleStateChange);
      return () => {
        context.removeEventListener('statechange', handleStateChange);
      };
    }
  }, []); // Run once when audioContextRef.current is stable

  return {
    state,
    initializeAudio,
    enableAudio,
    disableAudio,
    playAudio,
    playSFX,
  };
};

/**
 * Enhanced Audio Hook for Games
 *
 * This hook extends the global audio context with game-specific functionality.
 */
export const useGameAudio = (soundEnabled: boolean = true) => {
  const audioManager = useGlobalAudioContext();

  // Create a wrapper for playing audio that respects the soundEnabled flag
  const playGameAudio = useCallback(async (audioElement: HTMLAudioElement): Promise<void> => {
    if (!soundEnabled) {
      console.log('🔇 GameAudio: Sound disabled for this game, skipping playback');
      // If audio element is currently playing, pause it if sound is turned off mid-game
      if (!audioElement.paused) {
          audioElement.pause();
          audioElement.currentTime = 0; // Reset
      }
      return;
    }

    return audioManager.playAudio(audioElement);
  }, [soundEnabled, audioManager]);

  // Initialize audio on mount if sound is enabled
  // This useEffect ensures that if a game's soundEnabled flag is true,
  // it will try to initialize the global audio context.
  // The global context itself handles the autoplay policy.
  useEffect(() => {
    // Only attempt to initialize if sound is enabled for this game and global context isn't already running
    if (soundEnabled && !audioManager.state.isRunning) {
      audioManager.initializeAudio().catch(console.warn);
    }
  }, [soundEnabled, audioManager]); // Depend on soundEnabled and audioManager (which includes its state)

  return {
    ...audioManager,
    playAudio: playGameAudio,
    soundEnabled,
  };
};