'use client';

import React, { useEffect, useState } from 'react';
import { useProgress } from './ProgressContext';

interface VideoProgressBarProps {
  videoId: string;
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
}

export default function VideoProgressBar({
  videoId,
  currentTime,
  duration,
  onSeek
}: VideoProgressBarProps) {
  const { updateVideoProgress, getVideoProgress } = useProgress();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [savedProgress, setSavedProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  
  // Initialize progress when component mounts
  useEffect(() => {
    const savedPercentage = getVideoProgress(videoId);
    setSavedProgress(savedPercentage);
  }, [videoId, getVideoProgress]);
  
  // Update progress as the video plays
  useEffect(() => {
    if (!duration) return;
    
    const percentage = Math.round((currentTime / duration) * 100);
    setProgressPercentage(percentage);
    
    // Save progress to database every 5 seconds or when it changes by 5%
    if (
      (percentage > savedProgress + 5 || currentTime % 5 === 0) && 
      percentage > 0 &&
      percentage !== savedProgress
    ) {
      updateVideoProgress(videoId, percentage);
      setSavedProgress(percentage);
    }
  }, [currentTime, duration, videoId, savedProgress, updateVideoProgress]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setHoverPosition(percentage);
  };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = duration * percentage;
    
    onSeek(seekTime);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="video-progress-container">
      <div className="flex items-center gap-2">
        <span className="text-sm">{formatTime(currentTime)}</span>
        
        <div 
          className="relative flex-1 h-2 bg-gray-300 rounded cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          {/* Current progress */}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 rounded"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          
          {/* Saved progress marker */}
          {savedProgress > 0 && savedProgress < 100 && (
            <div
              className="absolute top-0 h-full w-1 bg-blue-800"
              style={{ left: `${savedProgress}%` }}
            ></div>
          )}
          
          {/* Hover indicator */}
          {isHovering && (
            <>
              <div
                className="absolute top-0 h-full w-1 bg-blue-400"
                style={{ left: `${hoverPosition}%` }}
              ></div>
              <div
                className="absolute -top-8 bg-black text-white text-xs py-1 px-2 rounded transform -translate-x-1/2"
                style={{ left: `${hoverPosition}%` }}
              >
                {formatTime(duration * (hoverPosition / 100))}
              </div>
            </>
          )}
        </div>
        
        <span className="text-sm">{formatTime(duration)}</span>
      </div>
      
      {savedProgress > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {savedProgress === 100 ? (
            <span>You've completed this video 🎉</span>
          ) : (
            <span>You've watched {savedProgress}% of this video</span>
          )}
        </div>
      )}
    </div>
  );
} 