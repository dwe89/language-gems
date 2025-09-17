'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import useProgress from '@/hooks/useProgress';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthContext';

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  height?: string;
  width?: string;
  className?: string;
  onProgress?: (seconds: number, percentage: number) => void;
  language?: string; // Add language prop for tracking progress by language
}

// Define handle type for ref
export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
  getPlayerState: () => YT.PlayerState | undefined;
  pauseVideo: () => void;
  playVideo: () => void;
}

// Wrap component with forwardRef
const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ 
  videoId, 
  autoplay = false,
  height = '100%',
  width = '100%',
  className = '',
  onProgress,
  language = 'spanish' // Default to Spanish if not provided
}, ref) => {
  const playerRef = useRef<YT.Player | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { trackVideoProgress } = useProgress();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  // Helper function to save progress to our new API
  const saveProgressToDb = async (currentPercentage: number, durationSecs?: number) => {
    if (!user || !videoId) return; // Only save if user is logged in and videoId is valid

    const percentage = Math.max(0, Math.min(100, currentPercentage)); // Clamp percentage
    
    try {
      // Check if video is completed (over 90% watched)
      const completed = percentage > 90;
      
      // Call our new hook to update progress
      await trackVideoProgress({
        videoId,
        language,
        progress: percentage,
        duration: durationSecs,
        completed
      });
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  };

  // Expose functions via ref
  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(seconds, true); // true allows seek ahead
        // Optionally play after seeking if needed
        if (playerRef.current.getPlayerState() !== window.YT.PlayerState.PLAYING) {
            playerRef.current.playVideo();
        }
      } else {
        console.warn('Player not ready or seekTo not available.');
      }
    },
    getPlayerState: () => {
      if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
        return playerRef.current.getPlayerState();
      }
      return undefined;
    },
    pauseVideo: () => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      } else {
        console.warn('Player not ready or pauseVideo not available.');
      }
    },
    playVideo: () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      } else {
        console.warn('Player not ready or playVideo not available.');
      }
    }
  }));

  useEffect(() => {
    // Function to initialize the player
    const initializePlayer = () => {
      if (!containerRef.current) return;
      
      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
            cc_load_policy: 1, // Show closed captions by default
            iv_load_policy: 3, // Hide video annotations
            hl: 'en' // Set language to English
          },
          events: {
            onReady: () => {
              console.log('YouTube player ready');
              setPlayerReady(true);
              setupProgressTracking();
            },
            onError: (e) => {
              console.error('YouTube player error:', e.data);
              setError('Error loading video. Please try again later.');
            },
            onStateChange: (e) => {
              // Track when video starts playing
              if (e.data === window.YT.PlayerState.PLAYING) {
                setupProgressTracking();
              } else if (e.data === window.YT.PlayerState.PAUSED || e.data === window.YT.PlayerState.ENDED) {
                clearProgressTracking();
                // When video is paused or ends, save final progress
                if (playerRef.current) {
                  const currentTime = playerRef.current.getCurrentTime();
                  const duration = playerRef.current.getDuration();
                  const percentage = (currentTime / duration) * 100;
                  
                  if (onProgress) {
                    onProgress(currentTime, percentage);
                  }
                  
                  // Convert video ID to string in case it's numeric
                  const videoIdString = String(videoId);
                  saveProgressToDb(percentage, duration);
                }
              }
            }
          }
        });
      } catch (err) {
        console.error('Error initializing YouTube player:', err);
        setError('Failed to initialize video player');
      }
    };

    // Setup progress tracking with interval
    const setupProgressTracking = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
          try {
            const currentTime = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();
            const percentage = (currentTime / duration) * 100;
            
            if (onProgress) {
              onProgress(currentTime, percentage);
            }
            
            // Save progress to DB periodically (e.g., every ~15 seconds or significant change)
            if (Math.round(currentTime) % 15 === 0) { 
              saveProgressToDb(percentage, duration);
            }
          } catch (e) {
            console.error('Error tracking progress:', e);
          }
        }
      }, 5000); // Check progress every 5 seconds
    };
    
    // Clear progress tracking interval
    const clearProgressTracking = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      // Set up global callback function
      window.onYouTubeIframeAPIReady = initializePlayer;
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Set a timeout for API loading
      const apiTimeout = setTimeout(() => {
        if (!window.YT || !window.YT.Player) {
          setError('Player initialization timeout. Please check your internet connection.');
        }
      }, 15000);
      
      return () => clearTimeout(apiTimeout);
    } else if (window.YT && window.YT.Player) {
      // If API is already loaded
      initializePlayer();
    }
    
    // Cleanup function to destroy player and clear intervals
    return () => {
      clearProgressTracking();
      
      if (playerRef.current) {
        try {
          // @ts-ignore - YT Player doesn't have proper typings for destroy
          playerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying player:', e);
        }
      }
    };
  }, [videoId, autoplay, onProgress, language]);

  // Update player when videoId changes
  useEffect(() => {
    if (playerRef.current && playerReady && videoId) {
      try {
        // @ts-ignore - loadVideoById is not properly typed
        playerRef.current.loadVideoById(videoId);
      } catch (e) {
        console.error('Error loading new video:', e);
        setError('Error switching videos');
      }
    }
  }, [videoId, playerReady]);

  if (error) {
    return (
      <div className={`video-player-container ${className}`} style={{ width, height, position: 'relative' }}>
        <div className="error-overlay">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-player-container ${className}`} style={{ width, height, position: 'relative' }}>
      {!playerReady && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading video player...</p>
        </div>
      )}
      <div ref={containerRef} className="youtube-player" />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer'; // Add display name for DevTools
export default VideoPlayer; 