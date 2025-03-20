'use client';

import { useState, useEffect, RefObject } from 'react';

interface FullscreenToggleProps {
  containerRef: RefObject<HTMLElement | HTMLDivElement | null>;
  className?: string;
}

export default function FullscreenToggle({ containerRef, className = '' }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error('Error attempting to enable fullscreen:', err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error('Error attempting to exit fullscreen:', err));
      }
    }
  };

  // Function to handle the fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className={`p-2 transition-colors ${className}`}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a1 1 0 0 0-1 1v4a1 1 0 0 1-2 0V5a3 3 0 0 1 3-3h4a1 1 0 0 1 0 2H5zm10 10a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3h-4a1 1 0 1 1 0-2h4zM5 14a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3v-4a1 1 0 1 1 2 0v4zm10-10a1 1 0 0 0-1-1H10a1 1 0 1 1 0-2h4a3 3 0 0 1 3 3v4a1 1 0 1 1-2 0V4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H6.414l2.293 2.293a1 1 0 1 1-1.414 1.414L5 6.414V8a1 1 0 0 1-2 0V4zm13 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L13.586 5H12a1 1 0 1 1 0-2h4zm-13 13a1 1 0 0 1-1-1v-4a1 1 0 1 1 2 0v1.586l2.293-2.293a1 1 0 1 1 1.414 1.414L5.414 15H8a1 1 0 1 1 0 2H4zm13-1a1 1 0 0 1-1 1h-4a1 1 0 1 1 0-2h1.586l-2.293-2.293a1 1 0 1 1 1.414-1.414L15.586 13H14a1 1 0 1 1 0-2h4a1 1 0 0 1 1 1v4z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
} 