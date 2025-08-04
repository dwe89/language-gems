'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Users, Target } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { createBrowserClient } from '../../../lib/supabase-client';
import { useGlobalAudioContext } from '../../../hooks/useGlobalAudioContext';
import { createAudio, getAudioUrl } from '../../../utils/audioUtils';

// Standard interfaces for assignment integration
export interface StandardVocabularyItem {
  id: string;          // UUID from centralized_vocabulary
  word: string;        // Spanish/target language
  translation: string; // English translation
  category: string;    // Modern category field
  subcategory: string; // Modern subcategory field
  part_of_speech: string;
  language: string;
  audio_url?: string;  // Audio URL for listening activities
  word_type?: string;  // Additional word type information
  gender?: string;     // Gender for nouns
  article?: string;    // Article for nouns
  display_word?: string; // Display version of word
  order_position?: number;
}

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  game_config: any;
  vocabulary_assignment_list_id: string;
  due_date: string;
  class_name?: string;
  vocabulary_criteria: any;
  curriculum_level?: string;
}

export interface GameProgress {
  assignmentId: string;
  gameId: string;
  studentId: string;
  wordsCompleted: number;
  totalWords: number;
  score: number;
  maxScore: number;
  timeSpent: number;
  accuracy: number;
  completedAt?: Date;
  sessionData: any;
}

export interface GameAssignmentWrapperProps {
  assignmentId: string;
  gameId: string;
  studentId?: string;
  onAssignmentComplete: (progress: GameProgress) => void;
  onBackToAssignments: () => void;
  onBackToMenu?: () => void;
  children: (props: {
    assignment: AssignmentData;
    vocabulary: StandardVocabularyItem[];
    onProgressUpdate: (progress: Partial<GameProgress>) => void;
    onGameComplete: (finalProgress: GameProgress) => void;
  }) => React.ReactNode;
}

// Custom hook for assignment vocabulary loading
export const useAssignmentVocabulary = (assignmentId: string) => {
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [vocabulary, setVocabulary] = useState<StandardVocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Supabase client directly instead of API route
        const supabase = createBrowserClient();

        // Get assignment data
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            game_config,
            vocabulary_assignment_list_id,
            vocabulary_criteria,
            due_date,
            class_id,
            curriculum_level
          `)
          .eq('id', assignmentId)
          .single();

        if (assignmentError) {
          throw new Error(`Failed to load assignment: ${assignmentError.message}`);
        }

        if (!assignmentData) {
          throw new Error('Assignment not found');
        }

        // Get class name separately
        let className = '';
        if (assignmentData.class_id) {
          const { data: classData } = await supabase
            .from('classes')
            .select('name')
            .eq('id', assignmentData.class_id)
            .single();
          className = classData?.name || '';
        }

        // Get vocabulary data - handle both list-based and category-based assignments
        let vocabularyData: any[] = [];
        let vocabularyError: any = null;

        if (assignmentData.vocabulary_assignment_list_id) {
          // List-based assignment: fetch from vocabulary_assignment_items
          const { data, error } = await supabase
            .from('vocabulary_assignment_items')
            .select(`
              order_position,
              centralized_vocabulary:centralized_vocabulary(
                id,
                word,
                translation,
                category,
                subcategory,
                part_of_speech,
                language,
                audio_url,
                word_type,
                gender,
                article,
                display_word
              )
            `)
            .eq('assignment_list_id', assignmentData.vocabulary_assignment_list_id)
            .not('centralized_vocabulary_id', 'is', null)
            .order('order_position');

          vocabularyData = data || [];
          vocabularyError = error;
        } else if (assignmentData.vocabulary_criteria) {
          // Category-based assignment: fetch directly from centralized_vocabulary
          const criteria = assignmentData.vocabulary_criteria;
          console.log('Loading category-based vocabulary with criteria:', criteria);

          let query = supabase
            .from('centralized_vocabulary')
            .select(`
              id,
              word,
              translation,
              category,
              subcategory,
              part_of_speech,
              language,
              audio_url,
              word_type,
              gender,
              article,
              display_word
            `);

          // Apply filters based on criteria
          if (criteria.language) {
            query = query.eq('language', criteria.language);
          }
          if (criteria.category) {
            query = query.eq('category', criteria.category);
          }
          if (criteria.subcategory) {
            query = query.eq('subcategory', criteria.subcategory);
          }

          // Apply word count limit
          if (criteria.wordCount) {
            query = query.limit(criteria.wordCount);
          }

          const { data, error } = await query;

          // Transform to match the list-based format
          vocabularyData = data?.map((item: any) => ({
            order_position: 1,
            centralized_vocabulary: item
          })) || [];
          vocabularyError = error;
        }

        if (vocabularyError) {
          throw new Error(`Failed to load vocabulary: ${vocabularyError.message}`);
        }

        console.log(`[SERVER] GameAssignmentWrapper - Loaded ${vocabularyData.length} vocabulary items for assignment ${assignmentId}`);

        if (!vocabularyData || vocabularyData.length === 0) {
          throw new Error('No vocabulary found for this assignment');
        }

        // Transform the data
        const transformedAssignment = {
          ...assignmentData,
          class_name: className
        };

        const transformedVocabulary: StandardVocabularyItem[] = vocabularyData?.map((item: any) => ({
          id: item.centralized_vocabulary.id,
          word: item.centralized_vocabulary.word,
          translation: item.centralized_vocabulary.translation,
          category: item.centralized_vocabulary.category,
          subcategory: item.centralized_vocabulary.subcategory,
          part_of_speech: item.centralized_vocabulary.part_of_speech,
          language: item.centralized_vocabulary.language,
          audio_url: item.centralized_vocabulary.audio_url,
          word_type: item.centralized_vocabulary.word_type,
          gender: item.centralized_vocabulary.gender,
          article: item.centralized_vocabulary.article,
          display_word: item.centralized_vocabulary.display_word,
          order_position: item.order_position
        })) || [];

        setAssignment(transformedAssignment);
        setVocabulary(transformedVocabulary);
      } catch (err) {
        console.error('Error loading assignment:', err);
        setError(err instanceof Error ? err.message : 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignmentData();
    }
  }, [assignmentId]);

  return { assignment, vocabulary, loading, error };
};

// Standard assignment wrapper component
export default function GameAssignmentWrapper({
  assignmentId,
  gameId,
  studentId,
  onAssignmentComplete,
  onBackToAssignments,
  onBackToMenu,
  children
}: GameAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createBrowserClient();

  const { assignment, vocabulary, loading, error } = useAssignmentVocabulary(assignmentId);
  const audioManager = useGlobalAudioContext();

  // Initialize audio context but DON'T start background music
  // (individual games handle their own background music)
  useEffect(() => {
    console.log('🎵 GameAssignmentWrapper: Initializing audio context for assignment games');
    audioManager.initializeAudio().then(() => {
      console.log('🎵 GameAssignmentWrapper: Audio context initialized - games will handle their own music');
      // NOTE: Not starting background music here - individual games handle their own audio
    }).catch(error => {
      console.warn('🎵 GameAssignmentWrapper: Failed to initialize audio:', error);
    });

    // Cleanup function to stop any assignment music when component unmounts
    return () => {
      stopAssignmentBackgroundMusic();
    };
  }, [audioManager]);

  // Background music management for assignment mode
  const startAssignmentBackgroundMusic = () => {
    try {
      // Create and play background music for assignment mode using cross-subdomain audio utility
      const backgroundMusic = createAudio(getAudioUrl('/audio/themes/classic-ambient.mp3'));
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;

      console.log('🎵 GameAssignmentWrapper: Loading background music from:', backgroundMusic.src);

      // Store reference for cleanup
      (window as any).assignmentBackgroundMusic = backgroundMusic;

      backgroundMusic.play().catch(error => {
        console.warn('🎵 GameAssignmentWrapper: Failed to start background music:', error);
      });

      console.log('🎵 GameAssignmentWrapper: Background music started');
    } catch (error) {
      console.warn('🎵 GameAssignmentWrapper: Error creating background music:', error);
    }
  };

  const stopAssignmentBackgroundMusic = () => {
    try {
      const backgroundMusic = (window as any).assignmentBackgroundMusic;
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        (window as any).assignmentBackgroundMusic = null;
        console.log('🎵 GameAssignmentWrapper: Background music stopped');
      }
    } catch (error) {
      console.warn('🎵 GameAssignmentWrapper: Error stopping background music:', error);
    }
  };

  const [gameProgress, setGameProgress] = useState<Partial<GameProgress>>({
    assignmentId,
    gameId,
    studentId: studentId || user?.id,
    wordsCompleted: 0,
    totalWords: 0,
    score: 0,
    maxScore: 0,
    timeSpent: 0,
    accuracy: 0,
    sessionData: {}
  });

  const [startTime] = useState(Date.now());

  // Update progress handler
  const handleProgressUpdate = (progress: Partial<GameProgress>) => {
    setGameProgress(prev => ({
      ...prev,
      ...progress,
      timeSpent: Date.now() - startTime
    }));
  };

  // Game completion handler
  const handleGameComplete = async (finalProgress: GameProgress) => {
    try {
      // Save final progress to database
      const progressData = {
        ...gameProgress,
        ...finalProgress,
        timeSpent: Date.now() - startTime,
        completedAt: new Date()
      };

      console.log('GameAssignmentWrapper - Game completed:', gameId, 'Progress:', finalProgress);

      // Update individual game progress
      const { error: gameProgressError } = await supabase
        .from('assignment_game_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          game_id: gameId,
          status: 'completed',
          score: finalProgress.score || 0,
          max_score: finalProgress.maxScore || 100,
          accuracy: finalProgress.accuracy || 0,
          words_completed: finalProgress.wordsCompleted || 0,
          total_words: finalProgress.totalWords || vocabulary.length,
          time_spent: Math.floor((Date.now() - startTime) / 1000),
          attempts_count: 1,
          completed_at: new Date().toISOString(),
          session_data: finalProgress.sessionData || {}
        });

      if (gameProgressError) {
        console.error('Error updating game progress:', gameProgressError);
      } else {
        console.log('Individual game progress saved successfully');
      }

      // Check if all games in the assignment are completed
      const { data: allGameProgress, error: checkError } = await supabase
        .from('assignment_game_progress')
        .select('game_id, status')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (!checkError && allGameProgress && assignment) {
        // Get the list of games from assignment config
        const assignmentGames = assignment.game_config?.selectedGames || [];
        const completedGames = allGameProgress.filter(g => g.status === 'completed').map(g => g.game_id);

        console.log('Assignment games:', assignmentGames);
        console.log('Completed games:', completedGames);

        // Check if all games are completed
        const allGamesCompleted = assignmentGames.every((gameId: string) => completedGames.includes(gameId));

        if (allGamesCompleted) {
          console.log('All games completed! Marking assignment as complete.');

          // Update overall assignment progress
          const { error: assignmentProgressError } = await supabase
            .from('enhanced_assignment_progress')
            .upsert({
              assignment_id: assignmentId,
              student_id: studentId,
              status: 'completed',
              completed_at: new Date().toISOString(),
              progress_data: {
                ...finalProgress,
                completedGames: completedGames,
                totalGames: assignmentGames.length
              },
              best_score: finalProgress.score,
              best_accuracy: finalProgress.accuracy,
              words_mastered: finalProgress.wordsCompleted,
              session_count: completedGames.length
            });

          if (assignmentProgressError) {
            console.error('Error updating assignment progress:', assignmentProgressError);
          } else {
            console.log('Overall assignment marked as complete');
          }
        } else {
          console.log(`Assignment progress: ${completedGames.length}/${assignmentGames.length} games completed`);
        }
      }

      // Call parent completion handler
      onAssignmentComplete(progressData as GameProgress);
    } catch (err) {
      console.error('Error saving assignment progress:', err);
      // Still call completion handler even if save fails
      onAssignmentComplete(finalProgress);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading assignment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Assignment Error</h1>
          <p className="text-lg mb-6">{error || 'Assignment not found'}</p>
          <div className="space-y-3">
            <button
              onClick={onBackToAssignments}
              className="w-full bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Back to Assignments
            </button>
            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="w-full bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
              >
                Back to Game Menu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Assignment Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/student-dashboard/assignments')}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Assignments
            </button>
            
            <div className="text-center text-white">
              <h1 className="text-xl font-bold">{assignment.title}</h1>
              <p className="text-blue-200 text-sm">{assignment.description}</p>
            </div>

            <div className="flex items-center space-x-4 text-white text-sm">
              {assignment.class_name && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {assignment.class_name}
                </div>
              )}
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {vocabulary.length} words
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Due: {new Date(assignment.due_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1">
        {children({
          assignment,
          vocabulary,
          onProgressUpdate: handleProgressUpdate,
          onGameComplete: handleGameComplete
        })}
      </div>
    </div>
  );
}

// Utility function for calculating standard scores
export const calculateStandardScore = (
  correct: number,
  total: number,
  timeSpent: number,
  basePointsPerWord: number = 100
): { score: number; accuracy: number; maxScore: number } => {
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const timeBonus = Math.max(0, 1 - (timeSpent / (total * 30000))); // 30 seconds per word baseline
  const score = Math.round(correct * basePointsPerWord * (1 + timeBonus * 0.5));
  const maxScore = total * basePointsPerWord * 1.5; // Max with full time bonus

  return { score, accuracy, maxScore };
};

// Unified progress recording function
export const recordAssignmentProgress = async (
  assignmentId: string,
  gameId: string,
  studentId: string,
  progressData: GameProgress
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/assignments/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentId,
        gameId,
        studentId,
        status: progressData.completedAt ? 'completed' : 'in_progress',
        score: progressData.score,
        accuracy: progressData.accuracy,
        timeSpent: progressData.timeSpent,
        wordsCompleted: progressData.wordsCompleted || 0,
        totalWords: progressData.totalWords || 0,
        sessionData: progressData.sessionData || {},
        completedAt: progressData.completedAt
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to record progress');
    }

    return { success: true };
  } catch (error) {
    console.error('Error recording assignment progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
