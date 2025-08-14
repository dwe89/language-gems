'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Users, Target } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { createBrowserClient } from '../../../lib/supabase-client';
import { useGlobalAudioContext } from '../../../hooks/useGlobalAudioContext';
import { createAudio, getAudioUrl } from '../../../utils/audioUtils';
import { EnhancedGameSessionService } from '../../../services/rewards/EnhancedGameSessionService';
// RewardEngine removed - games should handle individual vocabulary interactions

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
  exam_board?: string;
  tier?: string;
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
    gameSessionId: string | null;
  }) => React.ReactNode;
}

// Custom hook for assignment vocabulary loading
export const useAssignmentVocabulary = (assignmentId: string) => {
  console.log('🔧 [HOOK] useAssignmentVocabulary called [DEBUG-v2]:', {
    assignmentId,
    timestamp: new Date().toISOString()
  });

  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [vocabulary, setVocabulary] = useState<StandardVocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 [HOOK EFFECT] useEffect triggered [DEBUG-v3]:', {
      assignmentId,
      hasAssignmentId: !!assignmentId,
      timestamp: new Date().toISOString()
    });

    const fetchAssignmentData = async () => {
      console.log('🔄 [HOOK LOAD] Starting loadAssignmentData [DEBUG-v3]:', {
        assignmentId,
        timestamp: new Date().toISOString()
      });
      try {
        setLoading(true);
        setError(null);

        // Use Supabase client directly instead of API route
        const supabase = createBrowserClient();

        // Check authentication status
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        console.log('🔐 [AUTH] Authentication status [DEBUG-v2]:', {
          hasSession: !!session,
          userId: session?.user?.id,
          authError: authError?.message,
          timestamp: new Date().toISOString()
        });

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
            curriculum_level,
            exam_board,
            tier
          `)
          .eq('id', assignmentId)
          .single();

        console.log('📋 [ASSIGNMENT] Assignment query result:', {
          assignmentId,
          found: !!assignmentData,
          error: assignmentError?.message,
          vocabularyAssignmentListId: assignmentData?.vocabulary_assignment_list_id,
          vocabularyCriteria: assignmentData?.vocabulary_criteria
        });

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

        // Try list-based approach first if vocabulary_assignment_list_id exists
        if (assignmentData.vocabulary_assignment_list_id) {
          const { data, error } = await supabase
            .from('vocabulary_assignment_items')
            .select(`
              order_position,
              centralized_vocabulary!vocabulary_assignment_items_centralized_vocabulary_id_fkey(
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

          console.log('📋 [LIST-BASED] List-based approach result:', {
            dataCount: vocabularyData.length,
            error: vocabularyError?.message,
            hasAssignmentListId: !!assignmentData.vocabulary_assignment_list_id
          });
        }

        // If list-based approach failed or returned no data, try criteria-based approach
        console.log('🔍 [FALLBACK CHECK] Checking fallback conditions:', {
          vocabularyDataLength: vocabularyData?.length || 0,
          hasVocabularyCriteria: !!assignmentData.vocabulary_criteria,
          vocabularyCriteria: assignmentData.vocabulary_criteria
        });

        if ((!vocabularyData || vocabularyData.length === 0) && assignmentData.vocabulary_criteria) {
          // Category-based assignment: fetch directly from centralized_vocabulary
          const criteria = assignmentData.vocabulary_criteria;
          console.log('🔄 [FALLBACK] List-based approach returned empty, trying criteria-based approach');
          console.log('🔍 [FALLBACK] Loading category-based vocabulary with criteria:', criteria);

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

          console.log('🔍 [FALLBACK] Criteria-based query result:', {
            dataCount: data?.length || 0,
            error: error?.message,
            sampleData: data?.slice(0, 2)
          });

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

        console.log(`✅ [SERVER] GameAssignmentWrapper - Final result: ${vocabularyData.length} vocabulary items for assignment ${assignmentId}`);
        console.log('🔍 [SERVER] Final vocabulary data sample:', vocabularyData.slice(0, 2));

        if (!vocabularyData || vocabularyData.length === 0) {
          console.error('❌ [SERVER] No vocabulary found after both list-based and criteria-based approaches');
          console.error('🔍 [SERVER] Assignment data:', {
            assignmentId,
            hasVocabularyAssignmentListId: !!assignmentData.vocabulary_assignment_list_id,
            hasVocabularyCriteria: !!assignmentData.vocabulary_criteria,
            vocabularyCriteria: assignmentData.vocabulary_criteria
          });
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
        console.error('❌ [HOOK ERROR] Error loading assignment [DEBUG-v2]:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          assignmentId,
          timestamp: new Date().toISOString()
        });
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
  console.log('🚀 [WRAPPER] GameAssignmentWrapper called [DEBUG-v2]:', {
    assignmentId,
    gameId,
    studentId,
    timestamp: new Date().toISOString()
  });

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
  const [gemSessionService] = useState(() => new EnhancedGameSessionService(supabase));
  const [gemSessionId, setGemSessionId] = useState<string | null>(null);

  // Initialize gem session when vocabulary is loaded
  useEffect(() => {
    if (vocabulary.length > 0 && (studentId || user?.id) && !gemSessionId) {
      initializeGemSession();
    }
  }, [vocabulary.length, studentId, user?.id, gemSessionId]);

  const initializeGemSession = async () => {
    try {
      const sessionId = await gemSessionService.startGameSession({
        student_id: studentId || user?.id || '',
        assignment_id: assignmentId,
        game_type: gameId,
        session_mode: 'assignment',
        max_score_possible: 100,
        session_data: {
          vocabularyCount: vocabulary.length,
          assignmentTitle: assignment?.title
        }
      });

      setGemSessionId(sessionId);
      console.log('🔮 [WRAPPER] Gem session started for assignment:', sessionId);

      // Make vocabulary interaction recorder available to games immediately
      if (typeof window !== 'undefined') {
        (window as any).recordVocabularyInteraction = async (
          wordText: string,
          translationText: string,
          wasCorrect: boolean,
          responseTimeMs: number,
          hintUsed: boolean = false,
          streakCount: number = 1
        ) => {
          const callId = Math.random().toString(36).substr(2, 9);
          console.log(`🔮 [WRAPPER] recordVocabularyInteraction called [${callId}]:`, {
            wordText,
            wasCorrect,
            gameId,
            timestamp: new Date().toISOString()
          });
          if (gemSessionService && sessionId) {
            // Try to resolve centralized_vocabulary UUID from the assignment vocabulary list
            const normalize = (s: string) => (s || '').toString().trim().toLowerCase();
            const wt = normalize(wordText);
            const tt = normalize(translationText);
            let resolvedVocabId: string | undefined = undefined;

            // 🔍 INSTRUMENTATION: Log vocabulary ID resolution attempt
            console.log('🔍 [VOCAB ID RESOLUTION] Attempting to resolve vocabulary ID:', {
              wordText,
              translationText,
              normalizedWord: wt,
              normalizedTranslation: tt,
              vocabularyListLength: vocabulary.length,
              firstVocabItem: vocabulary[0] ? {
                id: (vocabulary[0] as any).id,
                word: (vocabulary[0] as any).word || (vocabulary[0] as any).spanish,
                translation: (vocabulary[0] as any).translation || (vocabulary[0] as any).english
              } : null
            });

            try {
              // Find exact match by word or translation
              const match = vocabulary.find((v) => {
                const vw = normalize((v as any).word || (v as any).spanish || '');
                const vt = normalize((v as any).translation || (v as any).english || '');
                return (vw && vw === wt) || (vt && vt === tt);
              });
              if (match && (match as any).id) {
                resolvedVocabId = (match as any).id;
              }

              // 🔍 INSTRUMENTATION: Log resolution result
              console.log('🔍 [VOCAB ID RESOLUTION] Resolution result:', {
                matchFound: !!match,
                resolvedVocabId,
                matchedItem: match ? {
                  id: (match as any).id,
                  word: (match as any).word || (match as any).spanish,
                  translation: (match as any).translation || (match as any).english
                } : null
              });
            } catch (e) {
              console.warn('Failed to resolve vocabulary ID from assignment list:', e);
            }

            const gemEvent = await gemSessionService.recordWordAttempt(sessionId, gameId, {
              vocabularyId: resolvedVocabId, // Use UUID when we can resolve it
              wordText,
              translationText,
              responseTimeMs,
              wasCorrect,
              hintUsed,
              streakCount,
              masteryLevel: 1, // Default mastery level
              maxGemRarity: 'common', // Cap at common for luck-based games like memory
              gameMode: 'assignment'
            });

            // Show gem feedback if gem was awarded
            if (gemEvent && wasCorrect) {
              console.log(`🔮 ${gameId} earned ${gemEvent.rarity} gem (${gemEvent.xpValue} XP) for "${wordText}"`);
            }
          }
        };

        console.log('🔮 [WRAPPER] recordVocabularyInteraction function set up for assignment games');
      }
    } catch (error) {
      console.error('🔮 [WRAPPER] Failed to initialize gem session:', error);
    }
  };

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
    console.log('🎯 [DEBUG] handleGameComplete CALLED with assignment ID:', {
      assignmentIdFromProps: assignmentId,
      assignmentIdFromProgress: finalProgress.assignmentId,
      gameId,
      studentId: studentId || user?.id,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Save final progress to database
      const progressData = {
        ...gameProgress,
        ...finalProgress,
        timeSpent: Date.now() - startTime,
        completedAt: new Date()
      };

      console.log('GameAssignmentWrapper - Game completed:', gameId, 'Progress:', finalProgress);
      console.log('GameAssignmentWrapper - Raw values:', {
        score: finalProgress.score,
        accuracy: finalProgress.accuracy,
        scoreType: typeof finalProgress.score,
        accuracyType: typeof finalProgress.accuracy
      });

      // Update individual game progress with safeguards
      const safeGameScore = Math.min(Math.max(finalProgress.score || 0, 0), 999999);
      const safeGameAccuracy = Math.min(Math.max(finalProgress.accuracy || 0, 0), 100);

      console.log('GameAssignmentWrapper - Safe values for game progress:', {
        originalScore: finalProgress.score,
        safeGameScore,
        originalAccuracy: finalProgress.accuracy,
        safeGameAccuracy
      });
      
      // Save assignment progress to database
      try {
        const { error: gameProgressError } = await supabase
          .from('assignment_game_progress')
          .upsert({
            assignment_id: assignmentId,
            student_id: studentId,
            game_id: gameId,
            status: 'completed',
            score: safeGameScore,
            max_score: finalProgress.maxScore || 100,
            accuracy: safeGameAccuracy,
            words_completed: finalProgress.wordsCompleted || 0,
            total_words: finalProgress.totalWords || vocabulary.length,
            time_spent: Math.floor((Date.now() - startTime) / 1000),
            attempts_count: 1,
            completed_at: new Date().toISOString(),
            session_data: finalProgress.sessionData || {}
          }, {
            onConflict: 'assignment_id,student_id,game_id',
            ignoreDuplicates: false
          });

        if (gameProgressError) {
          console.error('Error updating game progress:', gameProgressError);
        } else {
          console.log('Individual game progress saved successfully');

          // Integrate with gem system for assignment games
          if (gemSessionId) {
            try {
              // End the existing gem session
              await gemSessionService.endGameSession(gemSessionId, {
                student_id: studentId || user?.id || '',
                assignment_id: assignmentId,
                game_type: gameId,
                session_mode: 'assignment',
                final_score: finalProgress.score || 0,
                accuracy_percentage: finalProgress.accuracy || 0,
                completion_percentage: 100,
                words_attempted: finalProgress.totalWords || vocabulary.length,
                words_correct: finalProgress.wordsCompleted || 0,
                unique_words_practiced: finalProgress.wordsCompleted || 0,
                duration_seconds: Math.floor((Date.now() - startTime) / 1000),
                session_data: finalProgress.sessionData || {}
              });

              console.log('🔮 [WRAPPER] Gem session completed for assignment game');
            } catch (error) {
              console.error('🔮 [WRAPPER] Failed to end gem session:', error);
            }
          }
        }
      } catch (err) {
        console.error('Error updating assignment progress:', err);
      }

      // Check if all games in the assignment are completed
      const { data: allGameProgress, error: checkError } = await supabase
        .from('assignment_game_progress')
        .select('game_id, status, score, total_words, words_completed, time_spent')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (!checkError && allGameProgress && assignment) {
        // Get the list of games from assignment config - fix the path
        const assignmentGames = assignment.game_config?.gameConfig?.selectedGames || assignment.game_config?.selectedGames || [];
        const completedGames = allGameProgress.filter(g => g.status === 'completed').map(g => g.game_id);

        console.log('🎮 Assignment games from config:', assignmentGames);
        console.log('✅ Completed games:', completedGames);
        console.log('📊 Progress:', `${completedGames.length}/${assignmentGames.length} games completed`);

        // Check if all games are completed
        const allGamesCompleted = assignmentGames.length > 0 && assignmentGames.every((gameId: string) => completedGames.includes(gameId));

        // Calculate cumulative score and stats from all completed games
        const totalScore = allGameProgress.reduce((sum, game) => sum + (game.score || 0), 0);
        const totalWords = allGameProgress.reduce((sum, game) => sum + (game.total_words || 0), 0);
        const totalCorrect = allGameProgress.reduce((sum, game) => sum + (game.words_completed || 0), 0);
        const totalTimeSpent = allGameProgress.reduce((sum, game) => sum + (game.time_spent || 0), 0);
        const cumulativeAccuracy = totalWords > 0 ? (totalCorrect / totalWords) * 100 : 0;

        const safeScore = Math.min(Math.max(totalScore, 0), 99999.99);
        const safeAccuracy = Math.min(Math.max(cumulativeAccuracy, 0), 999.99);

        const assignmentStatus = allGamesCompleted ? 'completed' : 'in_progress';
        const completedAt = allGamesCompleted ? new Date().toISOString() : null;

        console.log(`🎯 Assignment status: ${assignmentStatus} (${completedGames.length}/${assignmentGames.length} games completed)`);

        console.log('GameAssignmentWrapper - Saving assignment progress:', {
          status: assignmentStatus,
          currentGameScore: finalProgress.score,
          cumulativeScore: totalScore,
          safeScore,
          currentGameAccuracy: finalProgress.accuracy,
          cumulativeAccuracy,
          safeAccuracy,
          totalWords,
          totalCorrect,
          totalTimeSpent,
          assignmentId,
          studentId,
          completedGames: completedGames.length,
          totalGames: assignmentGames.length
        });

        const { error: assignmentProgressError } = await supabase
          .from('enhanced_assignment_progress')
          .upsert({
            assignment_id: assignmentId,
            student_id: studentId,
            status: assignmentStatus,
            completed_at: completedAt,
            attempts_count: completedGames.length,
            total_time_spent: totalTimeSpent,
            progress_data: {
              ...finalProgress,
              completedGames: completedGames,
              totalGames: assignmentGames.length,
              cumulativeScore: totalScore,
              cumulativeAccuracy: cumulativeAccuracy
            },
            best_score: safeScore,
            best_accuracy: safeAccuracy,
            words_mastered: totalCorrect,
            session_count: completedGames.length
          }, {
            onConflict: 'assignment_id,student_id'
          });

        if (assignmentProgressError) {
          console.error('Error updating assignment progress:', assignmentProgressError);
        } else {
          if (allGamesCompleted) {
            console.log('🎉 Overall assignment marked as COMPLETE!');
          } else {
            console.log('📝 Assignment progress updated - still IN PROGRESS');
          }
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
          onGameComplete: handleGameComplete,
          gameSessionId: gemSessionId
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
        completed: !!progressData.completedAt,
        score: progressData.score,
        accuracy: progressData.accuracy,
        timeSpent: progressData.timeSpent,
        wordsCompleted: progressData.wordsCompleted || 0,
        totalWords: progressData.totalWords || 0,
        sessionData: progressData.sessionData || {},
        metadata: {
          gameType: gameId,
          attempts: 1
        }
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
