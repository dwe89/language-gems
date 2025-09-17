import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/ToastContext';

interface Language {
  totalMinutesWatched: number;
  quizzesTaken: number;
  averageScore: number;
  level: string;
  xp: number;
}

interface ProgressData {
  user_id: string;
  languages: {
    [key: string]: Language;
  };
  videos_completed: string[];
  video_progress: {
    [key: string]: number;
  };
  achievements: any[];
}

interface TrackVideoParams {
  videoId: string;
  language: string;
  progress: number;
  duration?: number;
  completed?: boolean;
}

interface TrackQuizParams {
  videoId: string;
  language: string;
  quizScore: number;
  quizTotalQuestions: number;
}

export default function useProgress() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Initialize previous level ref to detect level-up events
  const previousLevels = useRef<Record<string, string>>({});
  
  // Load initial progress data
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data: progressData, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }
        
        const userProgress = progressData as ProgressData || {
          user_id: user.id,
          languages: {},
          videos_completed: [],
          video_progress: {},
          achievements: []
        };
        
        setProgress(userProgress);
        
        // Store current levels for level-up detection
        if (userProgress.languages) {
          Object.entries(userProgress.languages).forEach(([lang, data]) => {
            previousLevels.current[lang] = data.level;
          });
        }
      } catch (err: any) {
        console.error('Error fetching progress:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [user]);
  
  // Track video progress
  const trackVideoProgress = useCallback(async (params: TrackVideoParams) => {
    if (!user || !progress) return null;
    
    try {
      const { videoId, language, progress: videoProgress, duration, completed } = params;
      
      // Clone current progress to avoid mutation
      const updatedProgress = { ...progress };
      
      // Initialize language progress if not exists
      if (!updatedProgress.languages[language]) {
        updatedProgress.languages[language] = {
          totalMinutesWatched: 0,
          quizzesTaken: 0,
          averageScore: 0,
          level: 'beginner',
          xp: 0
        };
      }
      
      // Track video progress
      if (!updatedProgress.video_progress) {
        updatedProgress.video_progress = {};
      }
      
      updatedProgress.video_progress[videoId] = videoProgress;
      
      // Mark video as completed if applicable
      if (completed && !updatedProgress.videos_completed.includes(videoId)) {
        updatedProgress.videos_completed.push(videoId);
        
        // Add XP for completing a video
        updatedProgress.languages[language].xp += 50;
        
        // Show achievement toast
        showToast('Video Completed! You\'ve earned 50 XP.', 'success');
      }
      
      // Update watch time if duration is provided
      if (duration) {
        updatedProgress.languages[language].totalMinutesWatched += 
          duration / 60; // Convert seconds to minutes
      }
      
      // Update user level based on XP
      updateLevel(updatedProgress, language);
      
      // Save updated progress
      const { error } = await supabase
        .from('user_progress')
        .upsert(updatedProgress);
        
      if (error) {
        throw error;
      }
      
      setProgress(updatedProgress);
      return updatedProgress;
    } catch (err) {
      console.error('Error tracking video progress:', err);
      setError('Failed to update progress');
      return null;
    }
  }, [user, progress, showToast]);
  
  // Track quiz progress
  const trackQuizProgress = useCallback(async (params: TrackQuizParams) => {
    if (!user || !progress) return null;
    
    try {
      const { videoId, language, quizScore, quizTotalQuestions } = params;
      
      // Clone current progress to avoid mutation
      const updatedProgress = { ...progress };
      
      // Initialize language progress if not exists
      if (!updatedProgress.languages[language]) {
        updatedProgress.languages[language] = {
          totalMinutesWatched: 0,
          quizzesTaken: 0,
          averageScore: 0,
          level: 'beginner',
          xp: 0
        };
      }
      
      const langProgress = updatedProgress.languages[language];
      langProgress.quizzesTaken++;
      
      const percentage = (quizScore / quizTotalQuestions) * 100;
      
      // Update average score
      langProgress.averageScore = 
        ((langProgress.averageScore * (langProgress.quizzesTaken - 1)) + percentage) / 
        langProgress.quizzesTaken;
      
      // Award XP based on quiz performance
      const xpGained = Math.round(percentage / 2); // 50% of score as XP
      langProgress.xp += xpGained;
      
      // Show toast for quiz completion
      showToast(`Quiz Completed! Scored ${percentage.toFixed(1)}% & earned ${xpGained} XP!`, 'success');
      
      // Update user level based on XP
      updateLevel(updatedProgress, language);
      
      // Save updated progress
      const { error } = await supabase
        .from('user_progress')
        .upsert(updatedProgress);
        
      if (error) {
        throw error;
      }
      
      setProgress(updatedProgress);
      return updatedProgress;
    } catch (err) {
      console.error('Error tracking quiz progress:', err);
      setError('Failed to update quiz progress');
      return null;
    }
  }, [user, progress, showToast]);
  
  // Update user level based on XP
  const updateLevel = useCallback((updatedProgress: ProgressData, language: string) => {
    const xp = updatedProgress.languages[language].xp;
    let newLevel = 'beginner';
    
    if (xp >= 10000) newLevel = 'master';
    else if (xp >= 6000) newLevel = 'expert';
    else if (xp >= 3000) newLevel = 'advanced';
    else if (xp >= 1000) newLevel = 'intermediate';
    
    // Check if level changed
    const previousLevel = previousLevels.current[language] || 'beginner';
    const levelChanged = newLevel !== previousLevel;
    
    updatedProgress.languages[language].level = newLevel;
    
    // Update previous level reference
    previousLevels.current[language] = newLevel;
    
    // If level changed, show a toast notification
    if (levelChanged) {
      showToast(`Level Up! You reached ${newLevel} level in ${language}!`, 'info');
    }
    
    return newLevel;
  }, [showToast]);
  
  // Get video progress
  const getVideoProgress = useCallback((videoId: string): number => {
    if (!progress || !progress.video_progress) return 0;
    return progress.video_progress[videoId] || 0;
  }, [progress]);
  
  // Check if video is completed
  const isVideoCompleted = useCallback((videoId: string): boolean => {
    if (!progress || !progress.videos_completed) return false;
    return progress.videos_completed.includes(videoId);
  }, [progress]);
  
  // Get language progress
  const getLanguageProgress = useCallback((language: string): Language | null => {
    if (!progress || !progress.languages) return null;
    return progress.languages[language] || null;
  }, [progress]);
  
  // Get user level for a language
  const getUserLevel = useCallback((language: string): string => {
    if (!progress || !progress.languages || !progress.languages[language]) {
      return 'beginner';
    }
    return progress.languages[language].level;
  }, [progress]);
  
  // Get XP for a language
  const getXP = useCallback((language: string): number => {
    if (!progress || !progress.languages || !progress.languages[language]) {
      return 0;
    }
    return progress.languages[language].xp;
  }, [progress]);
  
  return {
    loading,
    error,
    progress,
    trackVideoProgress,
    trackQuizProgress,
    getVideoProgress,
    isVideoCompleted,
    getLanguageProgress,
    getUserLevel,
    getXP
  };
} 