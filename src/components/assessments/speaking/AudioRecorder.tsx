'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check, Loader2, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  maxDuration?: number; // Maximum recording duration in seconds
  minDuration?: number; // Minimum recording duration in seconds
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onRecordingStart?: () => void;
  disabled?: boolean;
  showPlayback?: boolean;
  className?: string;
}

type RecordingState = 'idle' | 'recording' | 'stopped' | 'playing';

export function AudioRecorder({
  maxDuration = 120, // 2 minutes default
  minDuration = 3, // 3 seconds minimum
  onRecordingComplete,
  onRecordingStart,
  disabled = false,
  showPlayback = true,
  className = '',
}: AudioRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Check for microphone permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasPermission(result.state === 'granted');
        
        result.addEventListener('change', () => {
          setHasPermission(result.state === 'granted');
        });
      } catch {
        // Permissions API not supported, we'll check when recording starts
        setHasPermission(null);
      }
    };
    checkPermission();
  }, []);

  // Format duration as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      // Create MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stopped
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setRecordingState('recording');
      setDuration(0);
      onRecordingStart?.();

      // Start timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setDuration(elapsed);

        // Auto-stop at max duration
        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 1000);

    } catch (err: any) {
      console.error('Error starting recording:', err);
      setHasPermission(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow access to record.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError('Failed to start recording. Please try again.');
      }
    }
  }, [maxDuration, onRecordingStart]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    setRecordingState('stopped');

    // Notify parent after a short delay to ensure blob is ready
    setTimeout(() => {
      if (audioChunksRef.current.length > 0) {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        onRecordingComplete(audioBlob, duration);
      }
    }, 100);
  }, [duration, onRecordingComplete]);

  // Play/pause recorded audio
  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (recordingState === 'playing') {
      audioRef.current.pause();
      setRecordingState('stopped');
    } else {
      audioRef.current.play();
      setRecordingState('playing');
    }
  }, [recordingState]);

  // Handle audio ended
  const handleAudioEnded = useCallback(() => {
    setRecordingState('stopped');
  }, []);

  // Re-record
  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
    setRecordingState('idle');
    setError(null);
    audioChunksRef.current = [];
  }, [audioUrl]);

  // Calculate progress percentage
  const progressPercentage = (duration / maxDuration) * 100;
  const isMinDurationMet = duration >= minDuration;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Timer display */}
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
          {formatTime(duration)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {recordingState === 'recording' && `Max: ${formatTime(maxDuration)}`}
          {recordingState === 'stopped' && 'Recording complete'}
          {recordingState === 'idle' && 'Ready to record'}
          {recordingState === 'playing' && 'Playing...'}
        </div>
      </div>

      {/* Progress bar */}
      {recordingState === 'recording' && (
        <div className="w-full max-w-xs h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              progressPercentage > 80 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Recording controls */}
      <div className="flex items-center gap-4">
        {recordingState === 'idle' && (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white rounded-full shadow-lg transition-all duration-200
                     hover:scale-105 active:scale-95"
            aria-label="Start recording"
          >
            <Mic className="w-8 h-8" />
          </button>
        )}

        {recordingState === 'recording' && (
          <button
            onClick={stopRecording}
            disabled={!isMinDurationMet}
            className={`flex items-center justify-center w-16 h-16 
                      ${isMinDurationMet 
                        ? 'bg-gray-800 hover:bg-gray-900' 
                        : 'bg-gray-400 cursor-not-allowed'
                      }
                      text-white rounded-full shadow-lg transition-all duration-200
                      hover:scale-105 active:scale-95`}
            aria-label="Stop recording"
            title={!isMinDurationMet ? `Record at least ${minDuration} seconds` : 'Stop recording'}
          >
            <Square className="w-8 h-8" />
          </button>
        )}

        {recordingState === 'stopped' && showPlayback && (
          <>
            <button
              onClick={togglePlayback}
              className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 
                       text-white rounded-full shadow-lg transition-all duration-200
                       hover:scale-105 active:scale-95"
              aria-label={recordingState === 'playing' ? 'Pause' : 'Play'}
            >
              {recordingState === 'playing' ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={resetRecording}
              className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 
                       dark:bg-gray-700 dark:hover:bg-gray-600
                       text-gray-700 dark:text-gray-300 rounded-full shadow transition-all duration-200
                       hover:scale-105 active:scale-95"
              aria-label="Re-record"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </>
        )}

        {recordingState === 'playing' && (
          <>
            <button
              onClick={togglePlayback}
              className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 
                       text-white rounded-full shadow-lg transition-all duration-200
                       hover:scale-105 active:scale-95"
              aria-label="Pause"
            >
              <Pause className="w-6 h-6" />
            </button>

            <button
              onClick={resetRecording}
              className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 
                       dark:bg-gray-700 dark:hover:bg-gray-600
                       text-gray-700 dark:text-gray-300 rounded-full shadow transition-all duration-200
                       hover:scale-105 active:scale-95"
              aria-label="Re-record"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Recording indicator */}
      {recordingState === 'recording' && (
        <div className="flex items-center gap-2 text-red-500">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Recording...</span>
        </div>
      )}

      {/* Min duration warning */}
      {recordingState === 'recording' && !isMinDurationMet && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Record at least {minDuration} seconds to submit
        </p>
      )}
    </div>
  );
}

export default AudioRecorder;
