'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthContext';

interface UserProgress {
  videoProgress: Record<string, number>; // video_id -> percentage completed
  quizScores: Record<string, number>; // quiz_id -> score
  exerciseCompletions: Record<string, boolean>; // exercise_id -> completed
  languageProgress: Record<string, number>; // language_code -> percentage completed
}

interface ProgressContextType {
  progress: UserProgress;
  isLoading: boolean;
  updateVideoProgress: (videoId: string, percentage: number) => Promise<void>;
  updateQuizScore: (quizId: string, score: number) => Promise<void>;
  markExerciseComplete: (exerciseId: string) => Promise<void>;
  getVideoProgress: (videoId: string) => number;
  getQuizScore: (quizId: string) => number;
  getLanguageProgress: (languageCode: string) => number;
  isExerciseComplete: (exerciseId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const defaultProgress: UserProgress = {
  videoProgress: {},
  quizScores: {},
  exerciseCompletions: {},
  languageProgress: {
    spanish: 0,
    french: 0,
    german: 0
  }
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load progress when user changes
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setProgress(defaultProgress);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching progress for user:', user.id);
        
        // Fetch video progress from the correct video_progress table
        const { data: videoData, error: videoError } = await supabase
          .from('video_progress')
          .select('video_id, progress')
          .eq('user_id', user.id);

        if (videoError) {
          console.error('Error fetching video progress:', {
            message: videoError.message,
            details: videoError.details,
            hint: videoError.hint
          });
          throw videoError;
        }

        // Use consistent table names based on actual schema
        const { data: quizData, error: quizError } = await supabase
          .from('user_video_stats')
          .select('video_id, quiz_accuracy')
          .eq('user_id', user.id);

        if (quizError) {
          console.error('Error fetching quiz scores:', {
            message: quizError.message,
            details: quizError.details,
            hint: quizError.hint
          });
          throw quizError;
        }

        // Fetch exercise completions from learning_progress
        // Use the category and sub_category fields instead of exercise_id
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('learning_progress')
          .select('category, sub_category, mastery_level')
          .eq('user_id', user.id)
          .eq('category', 'exercise')
          .gte('mastery_level', 100); // Consider fully completed when mastery level is 100%

        if (exerciseError) {
          console.error('Error fetching exercise completions:', {
            message: exerciseError.message,
            details: exerciseError.details,
            hint: exerciseError.hint
          });
          throw exerciseError;
        }

        // Fetch language progress from learning_progress table where category is 'language'
        const { data: languageData, error: languageError } = await supabase
          .from('learning_progress')
          .select('sub_category, mastery_level')
          .eq('user_id', user.id)
          .eq('category', 'language');

        if (languageError) {
          console.error('Error fetching language progress:', {
            message: languageError.message,
            details: languageError.details,
            hint: languageError.hint
          });
          throw languageError;
        }

        // Initialize empty progress objects
        const videoProgress: Record<string, number> = {};
        const quizScores: Record<string, number> = {};
        const exerciseCompletions: Record<string, boolean> = {};
        const languageProgress: Record<string, number> = {
          spanish: 0,
          french: 0,
          german: 0
        };

        // Transform data into the format we need
        if (videoData && videoData.length > 0) {
          videoData.forEach(item => {
            videoProgress[item.video_id] = item.progress;
          });
        }

        if (quizData && quizData.length > 0) {
          quizData.forEach(item => {
            // Convert the integer video_id to string for consistency
            quizScores[String(item.video_id)] = item.quiz_accuracy;
          });
        }

        if (exerciseData && exerciseData.length > 0) {
          exerciseData.forEach(item => {
            // Create a unique key from category and sub_category
            const exerciseKey = `exercise:${item.sub_category}`;
            exerciseCompletions[exerciseKey] = true;
          });
        }

        if (languageData && languageData.length > 0) {
          languageData.forEach(item => {
            const language = item.sub_category?.toLowerCase();
            if (language && language in languageProgress) {
              languageProgress[language] = item.mastery_level || 0;
            }
          });
        }

        // Set the combined progress state
        setProgress({
          videoProgress,
          quizScores,
          exerciseCompletions,
          languageProgress
        });
        
        console.log('Progress loaded successfully');
      } catch (error: any) {
        console.error('Error fetching user progress:', error);
        // Continue with default progress if there's an error
        setProgress(defaultProgress);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const updateVideoProgress = async (videoId: string, percentage: number) => {
    if (!user) return;

    try {
      // Round percentage to an integer as the schema expects an integer
      const roundedPercentage = Math.round(percentage);
      
      // Update in database using the correct table name (video_progress)
      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          progress: roundedPercentage,
          language: 'auto', // Required field in schema
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating video progress:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      // Update local state
      setProgress(prev => ({
        ...prev,
        videoProgress: {
          ...prev.videoProgress,
          [videoId]: roundedPercentage
        }
      }));

      console.log(`Video progress updated: ${videoId} - ${roundedPercentage}%`);

      // Update overall language progress
      await updateOverallLanguageProgress();
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  const updateQuizScore = async (quizId: string, score: number) => {
    if (!user) return;

    try {
      // Update in the user_video_stats table instead of user_quiz_scores
      const { error } = await supabase
        .from('user_video_stats')
        .upsert({
          user_id: user.id,
          video_id: quizId, // Using video_id as the field name
          quiz_accuracy: score, // Using quiz_accuracy as the field name
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating quiz score:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      // Update local state
      setProgress(prev => ({
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizId]: score
        }
      }));

      // Update overall language progress
      await updateOverallLanguageProgress();
    } catch (error) {
      console.error('Error updating quiz score:', error);
    }
  };

  const markExerciseComplete = async (exerciseId: string) => {
    if (!user) return;

    try {
      // Parse exerciseId to get category and sub_category
      // Expected format: 'category:sub_category'
      let category = 'exercise';
      let subCategory = exerciseId;
      
      if (exerciseId.includes(':')) {
        const parts = exerciseId.split(':');
        category = parts[0];
        subCategory = parts[1];
      }

      // Update in learning_progress table
      const { error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: user.id,
          category,
          sub_category: subCategory,
          mastery_level: 100, // Mark as 100% complete
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error marking exercise complete:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      // Update local state
      setProgress(prev => ({
        ...prev,
        exerciseCompletions: {
          ...prev.exerciseCompletions,
          [exerciseId]: true
        }
      }));

      // Update overall language progress
      await updateOverallLanguageProgress();
    } catch (error) {
      console.error('Error marking exercise complete:', error);
    }
  };

  const updateOverallLanguageProgress = async () => {
    if (!user) return;

    try {
      // Update language progress in the learning_progress table
      // We'll calculate a simulated progress for each language
      // In a real app, you would calculate this based on actual progress metrics
      const languages = ['spanish', 'french', 'german'];
      const updates = languages.map(language => {
        // Simulate progress calculation (replace with actual calculation)
        const progressValue = Math.min(Math.floor(Math.random() * 100), 100);
        
        return supabase
          .from('learning_progress')
          .upsert({
            user_id: user.id,
            category: 'language',
            sub_category: language,
            mastery_level: progressValue,
            updated_at: new Date().toISOString()
          });
      });

      await Promise.all(updates);

      // Calculate updated language progress
      const spanishProgress = Math.min(Math.floor(Math.random() * 100), 100);
      const frenchProgress = Math.min(Math.floor(Math.random() * 100), 100);
      const germanProgress = Math.min(Math.floor(Math.random() * 100), 100);

      // Update local state
      setProgress(prev => ({
        ...prev,
        languageProgress: {
          spanish: spanishProgress,
          french: frenchProgress,
          german: germanProgress
        }
      }));
    } catch (error) {
      console.error('Error updating language progress:', error);
    }
  };

  const getVideoProgress = (videoId: string): number => {
    return progress.videoProgress[videoId] || 0;
  };

  const getQuizScore = (quizId: string): number => {
    return progress.quizScores[quizId] || 0;
  };

  const isExerciseComplete = (exerciseId: string): boolean => {
    // If exerciseId contains a colon, it's already in the format we store
    // Otherwise, prefix with 'exercise:' for consistency with the new format
    const key = exerciseId.includes(':') ? exerciseId : `exercise:${exerciseId}`;
    return progress.exerciseCompletions[key] || false;
  };

  const getLanguageProgress = (languageCode: string): number => {
    return progress.languageProgress[languageCode] || 0;
  };

  const value = {
    progress,
    isLoading,
    updateVideoProgress,
    updateQuizScore,
    markExerciseComplete,
    getVideoProgress,
    getQuizScore,
    isExerciseComplete,
    getLanguageProgress
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
} 