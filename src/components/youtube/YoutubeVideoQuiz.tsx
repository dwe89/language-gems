'use client';

import React, { useState, useRef, useEffect } from 'react';
import VideoPlayer, { VideoPlayerHandle } from './VideoPlayer';
import VideoQuizOverlay, { QuizPoint } from './VideoQuizOverlay';
import VideoLyricsOverlay, { LyricLine } from './VideoLyricsOverlay';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface YoutubeVideoQuizProps {
  youtubeId: string;
  videoId?: string; // Database ID if the video is stored in our system
  quizPoints?: QuizPoint[];
  lyrics?: LyricLine[];
  initialMode?: 'quiz' | 'lyrics' | 'normal';
  autoplay?: boolean;
  onQuizComplete?: (score: number, total: number) => void;
}

const YoutubeVideoQuiz: React.FC<YoutubeVideoQuizProps> = ({
  youtubeId,
  videoId,
  quizPoints = [],
  lyrics = [],
  initialMode = 'normal',
  autoplay = false,
  onQuizComplete
}) => {
  const { user } = useAuth();
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [mode, setMode] = useState<'quiz' | 'lyrics' | 'normal'>(initialMode);
  const [quizActive, setQuizActive] = useState(false);
  const [lyricsActive, setLyricsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [filledGaps, setFilledGaps] = useState<string[]>([]);

  // Set the initial active state based on the mode
  useEffect(() => {
    setQuizActive(initialMode === 'quiz');
    setLyricsActive(initialMode === 'lyrics');
  }, [initialMode]);

  // Handle video progress updates
  const handleVideoProgress = (seconds: number, percentage: number) => {
    setCurrentTime(seconds);
    
    // Activate quiz mode if there's a quiz point at the current time
    if (mode === 'quiz' && !quizActive) {
      const shouldShowQuiz = quizPoints.some(
        quiz => seconds >= quiz.timestamp && 
                seconds <= quiz.timestamp + 2 &&
                !answeredQuestions.includes(quiz.id)
      );
      
      if (shouldShowQuiz) {
        setQuizActive(true);
      }
    }
    
    // Save progress to database if logged in and videoId is provided
    if (user && videoId) {
      saveVideoProgress(seconds, percentage);
    }
  };

  // Save video progress to the database
  const saveVideoProgress = async (seconds: number, percentage: number) => {
    if (!user || !videoId) return;
    
    try {
      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          progress: Math.round(percentage),
          last_position: seconds,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving video progress:', error);
      }
    } catch (error) {
      console.error('Exception while saving video progress:', error);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (quizPointId: number, isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTotalQuestions(prev => prev + 1);
    setAnsweredQuestions(prev => [...prev, quizPointId]);
    
    // Save quiz result to database if logged in and videoId is provided
    if (user && videoId) {
      saveQuizResult(quizPointId, isCorrect);
    }
  };

  // Save quiz result to database
  const saveQuizResult = async (quizPointId: number, isCorrect: boolean) => {
    if (!user || !videoId) return;
    
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          video_id: videoId,
          quiz_id: quizPointId,
          is_correct: isCorrect,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving quiz result:', error);
      }
    } catch (error) {
      console.error('Exception while saving quiz result:', error);
    }
  };

  // Handle gap filled in lyrics
  const handleGapFilled = (lineId: number, word: string, isCorrect: boolean) => {
    const gapKey = `${lineId}-${word}`;
    
    if (!filledGaps.includes(gapKey)) {
      setFilledGaps(prev => [...prev, gapKey]);
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      
      // Save gap result to database if logged in and videoId is provided
      if (user && videoId) {
        saveLyricsGapResult(lineId, word, isCorrect);
      }
    }
  };

  // Save lyrics gap result to database
  const saveLyricsGapResult = async (lineId: number, word: string, isCorrect: boolean) => {
    if (!user || !videoId) return;
    
    try {
      const { error } = await supabase
        .from('lyrics_results')
        .insert({
          user_id: user.id,
          video_id: videoId,
          lyrics_line_id: lineId,
          word: word,
          is_correct: isCorrect,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving lyrics result:', error);
      }
    } catch (error) {
      console.error('Exception while saving lyrics result:', error);
    }
  };

  // Toggle between different modes
  const toggleMode = (newMode: 'quiz' | 'lyrics' | 'normal') => {
    setMode(newMode);
    setQuizActive(newMode === 'quiz');
    setLyricsActive(newMode === 'lyrics');
    
    if (newMode === 'normal') {
      setQuizActive(false);
      setLyricsActive(false);
    }
  };

  // Close quiz overlay
  const handleCloseQuiz = () => {
    setQuizActive(false);
  };

  return (
    <div className="youtube-video-quiz w-full h-full">
      <div className="video-container relative w-full h-full youtube-responsive">
        {/* Video Player */}
        <VideoPlayer
          ref={videoPlayerRef}
          videoId={youtubeId}
          autoplay={autoplay}
          onProgress={handleVideoProgress}
          className="video-player absolute inset-0 w-full h-full"
          width="100%"
          height="100%"
        />
        
        {/* Quiz Overlay */}
        {mode === 'quiz' && (
          <VideoQuizOverlay
            videoPlayerRef={videoPlayerRef}
            quizPoints={quizPoints}
            isActive={quizActive}
            onQuizComplete={handleQuizComplete}
            onClose={handleCloseQuiz}
            currentTimestamp={currentTime}
          />
        )}
        
        {/* Lyrics Overlay */}
        {mode === 'lyrics' && (
          <VideoLyricsOverlay
            lyrics={lyrics}
            isActive={lyricsActive}
            onGapFilled={handleGapFilled}
            currentTimestamp={currentTime}
          />
        )}
      </div>
      
      {/* Mode Controls */}
      <div className="video-controls">
        <div className="mode-toggles">
          <button 
            className={`mode-toggle ${mode === 'normal' ? 'active' : ''}`}
            onClick={() => toggleMode('normal')}
          >
            Normal
          </button>
          <button 
            className={`mode-toggle ${mode === 'quiz' ? 'active' : ''}`}
            onClick={() => toggleMode('quiz')}
          >
            Quiz Mode
          </button>
          <button 
            className={`mode-toggle ${mode === 'lyrics' ? 'active' : ''}`}
            onClick={() => toggleMode('lyrics')}
          >
            Lyrics Game
          </button>
        </div>
        
        <div className="score-display">
          Score: {score} {mode === 'quiz' && `/ ${totalQuestions}`}
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideoQuiz; 