'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useUnifiedAuth } from '../../../../hooks/useUnifiedAuth';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { useGameVocabulary } from '../../../../hooks/useGameVocabulary';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { StudentVocabularyAnalyticsService } from '../../../../services/StudentVocabularyAnalyticsService';
import UnifiedVocabMasterLauncher from './UnifiedVocabMasterLauncher';
import { VocabMasterGameEngine } from './VocabMasterGameEngine';
import { GameCompletionScreen } from './GameCompletionScreen';
import VocabMasterAssignmentWrapper from './VocabMasterAssignmentWrapper';

import { VocabularyWord as VocabWord, GameResult } from '../types';
import UnifiedGameLauncher from '../../../../components/games/UnifiedGameLauncher';
import InGameConfigPanel from '../../../../components/games/InGameConfigPanel';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../../hooks/useUnifiedVocabulary';

interface Props {
  searchParams?: {
    lang?: string;
    level?: string;
    cat?: string;
    subcat?: string;
    theme?: string;
    assignment?: string;
    standalone?: string;
    // KS4-specific parameters
    examBoard?: string;
    tier?: string;
  };
}

export default function UnifiedVocabMasterWrapper({ searchParams = {} }: Props) {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const { supabase } = useSupabase();

  // Assignment mode detection
  const isAssignmentMode = !!searchParams.assignment;

  // Game state - always start with launcher
  const [gameState, setGameState] = useState<'launcher' | 'playing' | 'complete'>('launcher');
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [gameConfig, setGameConfig] = useState<Record<string, any>>({});
  const [gameResults, setGameResults] = useState<any>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  // Category selection state
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [vocabulary, setVocabulary] = useState<UnifiedVocabularyItem[]>([]);
  const [vocabularyLoading, setVocabularyLoading] = useState(false);
  const [vocabularyError, setVocabularyError] = useState<string | null>(null);

  // Track whether URL params have been processed to prevent premature rendering
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Config panel state
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Services
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);

  // Standalone access detection (from /vocabmaster URL)
  const isStandaloneAccess = searchParams.standalone === 'true';

  // ✅ UNIFIED: Vocabulary tracking handled by EnhancedGameSessionService

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for URL parameters on mount (from games page)
  useEffect(() => {
    if (!isClient) {
      console.log('🔄 Skipping URL params processing - not on client yet');
      return;
    }

    console.log('🔄 URL params useEffect running. Current gameState:', gameState);
    console.log('🔄 isAssignmentMode:', isAssignmentMode);
    console.log('🔄 searchParams:', searchParams);
    console.log('🔄 urlParamsProcessed:', urlParamsProcessed);

    const checkUrlParams = () => {
      const lang = searchParams.lang;
      const level = searchParams.level as 'KS2' | 'KS3' | 'KS4' | 'KS5';
      const cat = searchParams.cat;
      const subcat = searchParams.subcat;
      const examBoard = searchParams.examBoard as 'AQA' | 'edexcel' | undefined;
      const tier = searchParams.tier as 'foundation' | 'higher' | undefined;

      console.log('🔍 VocabMaster checking URL params:', { lang, level, cat, subcat, examBoard, tier });

      if (lang && level && cat && !isAssignmentMode) {
        console.log('✅ Found URL parameters, pre-setting VocabMaster filters...');

        // Map language codes to full names
        const languageMap: { [key: string]: string } = {
          'es': 'spanish',
          'fr': 'french',
          'de': 'german'
        };

        const fullLanguage = languageMap[lang] || lang;

        const config: UnifiedSelectionConfig = {
          language: fullLanguage,
          curriculumLevel: level,
          categoryId: cat,
          subcategoryId: subcat || undefined,
          customMode: false,
          // KS4-specific parameters
          examBoard: examBoard || undefined,
          tier: tier || undefined
        };

        console.log('🚀 Pre-setting VocabMaster config:', config);
        setSelectedConfig(config);
        // Go directly to launcher with pre-set config
        console.log('🚀 Setting gameState to launcher (with params)');
        setGameState('launcher');
        setUrlParamsProcessed(true);
      } else {
        console.log('❌ No URL parameters - will show launcher with filter selectors');
        console.log('🚀 Setting gameState to launcher (no params)');
        // Go directly to launcher without pre-set config
        setGameState('launcher');
        setUrlParamsProcessed(true);
      }
    };

    // Only run if not in assignment mode
    if (!isAssignmentMode) {
      checkUrlParams();
    } else {
      console.log('🚫 Skipping URL check - in assignment mode');
      setUrlParamsProcessed(true);
    }
  }, [searchParams, isAssignmentMode, isClient]);

  // Initialize services
  useEffect(() => {
    console.log('🔧 VocabMaster service initialization:', {
      hasSupabase: !!supabase,
      hasUser: !!user,
  hasUnifiedUser: !!user,
  userId: user?.id,
      isDemo
    });

    // Always allow demo mode or when supabase is available
    if (supabase || isDemo) {
  const userId = user?.id;

      // Handle demo mode - don't initialize services that require real user IDs
      if (isDemo || !userId || userId === 'demo-user-id') {
        console.log('🎮 Demo mode detected - skipping service initialization');
        // For demo mode, we'll handle game sessions differently
        setGameService(null);
        return;
      }

      if (userId && userId !== 'demo-user-id' && supabase) {
        console.log('✅ Initializing VocabMaster services for user:', userId);
        setGameService(new EnhancedGameService(supabase));
      } else {
        console.log('⚠️ No valid user ID available for service initialization - using demo mode');
        setGameService(null);
      }
    } else {
      console.log('⚠️ No supabase available - using demo mode');
      setGameService(null);
    }
  }, [supabase, user, isDemo]);

  // Handle category selection complete
  const handleSelectionComplete = async (config: UnifiedSelectionConfig, vocabData: UnifiedVocabularyItem[]) => {
    console.log('🎯 VocabMaster selection complete:', {
      config,
      vocabularyCount: vocabData.length,
      gameState: 'launcher'
    });
    setSelectedConfig(config);
    setVocabulary(vocabData);
    setGameState('launcher');
  };

  // Handle filter changes from launcher (stable function reference)
  const handleFilterChange = useCallback((newConfig: UnifiedSelectionConfig) => {
    console.log('🔄 VocabMaster filter changed:', newConfig);
    setSelectedConfig(newConfig);
  }, []);

  // Handle back to launcher
  const handleBackToSelector = () => {
    setGameState('launcher');
    setSelectedConfig(null);
    setVocabulary([]);
  };

  // Start game session
  const handleGameStart = async (mode: string, vocabularySubset: any[], config: Record<string, any>) => {
    console.log('🎮 VocabMaster handleGameStart called:', {
      mode,
      vocabularyCount: vocabularySubset.length,
      config,
      hasGameService: !!gameService,
      hasSelectedConfig: !!selectedConfig,
      selectedConfig,
      isDemo
    });

    if (!selectedConfig) {
      console.error('❌ Selected config not available');
      return;
    }

    // Set the vocabulary from the subset BEFORE starting the game
    setVocabulary(vocabularySubset);
    console.log('✅ VocabMaster vocabulary set:', vocabularySubset.length, 'items');

  const userId = user?.id;

    // Handle demo mode
    if (isDemo || !gameService || userId === 'demo-user-id') {
      console.log('🎮 Starting VocabMaster in demo mode');
      setGameSessionId('demo-session-' + Date.now());
      setSelectedMode(mode);
      setGameConfig(config);
      setGameState('playing');
      return;
    }

    if (!userId) {
      console.error('❌ No user ID available');
      return;
    }

    try {
      // Create game session for authenticated users
      const sessionId = await gameService.startGameSession({
        student_id: userId,
        game_type: 'vocab-master',
        session_mode: isAssignmentMode ? 'assignment' : 'free_play',
        category: selectedConfig?.categoryId || 'basics',
        subcategory: selectedConfig?.subcategoryId || undefined,
        started_at: new Date(),
        duration_seconds: 0,
        final_score: 0,
        max_score_possible: vocabularySubset.length * 10,
        accuracy_percentage: 0,
        completion_percentage: 0,
        completion_status: 'in_progress',
        words_attempted: 0,
        words_correct: 0,
        unique_words_practiced: vocabularySubset.length,
        assignment_id: searchParams.assignment || undefined
      });

      setGameSessionId(sessionId);
      setSelectedMode(mode);
      setGameConfig(config);
      setGameState('playing');
    } catch (error) {
      console.error('❌ Failed to start game session:', error);
      // Fallback to demo mode if session creation fails
      console.log('🎮 Falling back to demo mode');
      setGameSessionId('demo-session-' + Date.now());
      setSelectedMode(mode);
      setGameConfig(config);
      setGameState('playing');
    }
  };

  // Handle vocabulary mastery (word-level performance logging)
  const handleVocabularyMastery = async (
    word: string,
    translation: string,
    answer: string,
    isCorrect: boolean,
    responseTime: number,
    gameMode: string,
    masteryLevel?: number,
    vocabularyId?: string
  ) => {
    // Record word practice with FSRS system first (works in all modes)
    if (!isDemo) {
      try {
        const wordData = {
          id: vocabularyId || `${word}-${translation}`,
          word: word,
          translation: translation,
          language: selectedConfig?.language === 'spanish' ? 'es' : selectedConfig?.language === 'french' ? 'fr' : 'en'
        };

        // Calculate confidence based on game mode and response time
        let confidence = 0.7; // Default confidence

        // Adjust confidence based on game mode
        switch (gameMode) {
          case 'speed':
            confidence = isCorrect ? (responseTime < 2000 ? 0.9 : responseTime < 4000 ? 0.8 : 0.6) : 0.1;
            break;
          case 'multiple_choice':
            confidence = isCorrect ? 0.5 : 0.2; // Lower confidence due to guessing
            break;
          case 'dictation':
            confidence = isCorrect ? 0.9 : 0.2; // High confidence for typing accuracy
            break;
          case 'listening':
            confidence = isCorrect ? 0.6 : 0.2; // Audio comprehension
            break;
          default:
            confidence = isCorrect ? 0.7 : 0.3;
        }

        // ✅ UNIFIED: Vocabulary tracking handled by EnhancedGameSessionService
        console.log('✅ [VOCAB MASTER] Vocabulary tracking handled by unified system');

      } catch (error) {
        console.error('Error in vocabulary tracking:', error);
      }
    }

    // Skip database operations in demo mode
    if (isDemo || !gameService || !gameSessionId) {
      console.log('🎮 Demo mode: Skipping vocabulary mastery recording for word:', word);
      return;
    }

    try {
      // Log word performance using unified system
      await gameService.logWordPerformance({
        session_id: gameSessionId,
        vocabulary_id: undefined, // Will be derived from word_text if possible
        word_text: word,
        translation_text: translation,
        language_pair: `${selectedConfig?.language || 'spanish'}_english`,
        attempt_number: 1, // Could be enhanced to track multiple attempts
        response_time_ms: responseTime,
        was_correct: isCorrect,
        confidence_level: isCorrect ? (responseTime < 2000 ? 5 : responseTime < 4000 ? 4 : 3) : 1,
        difficulty_level: selectedConfig?.curriculumLevel || 'KS3',
        hint_used: false, // Could be enhanced based on game mode
        power_up_active: undefined,
        streak_count: 0, // Will be calculated by the service
        previous_attempts: 0, // Could be enhanced
        mastery_level: masteryLevel || (isCorrect ? 3 : 1),
        error_type: isCorrect ? undefined : getErrorType(gameMode),
        grammar_concept: getGrammarConcept(gameMode),
        error_details: isCorrect ? undefined : {
          userAnswer: answer,
          correctAnswer: translation,
          gameMode,
          responseTime
        },
        context_data: {
          gameType: 'vocab-master',
          mode: selectedMode,
          theme: gameConfig.theme || 'mastery',
          category: selectedConfig?.categoryId,
          subcategory: selectedConfig?.subcategoryId,
          isAssignment: isAssignmentMode
        },
        timestamp: new Date()
      });

      // ✅ UNIFIED: Spaced repetition handled by EnhancedGameSessionService
      console.log('✅ [VOCAB MASTER] Spaced repetition handled by unified system');

      // 🔄 PHASE 2: Record to unified vocabulary analytics
      if (vocabularyId && userId) {
        try {
          const analyticsService = new StudentVocabularyAnalyticsService(supabase);
          await analyticsService.recordInteraction(
            userId,
            vocabularyId,
            isCorrect,
            'vocab_master',
            {
              topic: selectedConfig?.categoryId,
              subtopic: selectedConfig?.subcategoryId,
              difficulty: selectedConfig?.curriculumLevel,
              curriculumLevel: selectedConfig?.curriculumLevel
            }
          );
          console.log('✅ [PHASE 2] VocabMaster interaction recorded to unified analytics');
        } catch (error) {
          console.error('❌ [PHASE 2] Failed to record interaction:', error);
          // Don't throw - analytics failure shouldn't break the game
        }
      }
    } catch (error) {
      console.error('Failed to log vocabulary mastery:', error);
    }
  };

  // Helper functions for error categorization
  const getErrorType = (gameMode: string): string => {
    switch (gameMode) {
      case 'listening':
        return 'listening_comprehension';
      case 'dictation':
        return 'spelling_error';
      case 'typing':
        return 'typing_error';
      case 'speed':
        return 'time_pressure';
      default:
        return 'translation_error';
    }
  };

  const getGrammarConcept = (gameMode: string): string => {
    switch (gameMode) {
      case 'listening':
        return 'listening_skills';
      case 'dictation':
        return 'spelling_skills';
      case 'typing':
        return 'typing_skills';
      case 'cloze':
        return 'context_comprehension';
      default:
        return 'vocabulary_translation';
    }
  };

  // Handle game completion
  const handleGameComplete = async (results: any) => {
    console.log('🎯 VocabMaster game completed:', results);

    // Skip database operations in demo mode
    if (isDemo || !gameService || !gameSessionId) {
      console.log('🎮 Demo mode: Skipping game completion recording');
      // Don't set state here - it's handled in the onGameComplete callback
      return;
    }

    try {
      // End game session
      await gameService.endGameSession(gameSessionId, {
        final_score: results.score || 0,
        words_attempted: results.wordsReviewed || 0,
        words_correct: results.correctAnswers || 0,
        accuracy_percentage: results.accuracy || 0,
        duration_seconds: Math.floor((results.timeSpent || 0) / 1000), // Convert ms to seconds
        max_streak: results.maxStreak || 0,
        completion_status: 'completed',
        performance_metrics: {
          mode: selectedMode,
          theme: results.theme,
          wordsLearned: results.wordsLearned,
          xpEarned: results.xpEarned,
          gemsCollected: results.gemsCollected || 0
        }
      });

      // Don't set game state here - it's handled in the onGameComplete callback
    } catch (error) {
      console.error('Failed to complete game session:', error);
      // Only set state on error
      setGameState('complete');
    }
  };

  // Handle exit
  const handleExit = () => {
    setGameState('launcher');
    setSelectedMode('');
    setGameConfig({});
    setGameResults(null);
    setGameSessionId(null);
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    setSelectedConfig(config);
    setVocabulary(vocabulary);
    if (theme) {
      setGameConfig(prev => ({ ...prev, theme }));
    }
    setShowConfigPanel(false);
  };

  // Loading state
  if (vocabularyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (vocabularyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load vocabulary: {vocabularyError}</p>
          <button
            onClick={() => setGameState('launcher')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Assignment mode wrapper
  if (isAssignmentMode && user) {
    return (
      <VocabMasterAssignmentWrapper
        assignmentId={searchParams.assignment!}
        onAssignmentComplete={() => window.location.href = '/student-dashboard/assignments'}
        onBackToAssignments={() => window.location.href = '/student-dashboard/assignments'}
        onBackToMenu={() => window.location.href = '/games/vocab-master'}
      />
    );
  }

  // Skip the separate category selector - go directly to dynamic hub

  // Debug current state
  console.log('🔍 VocabMaster render state:', {
    gameState,
    hasSelectedConfig: !!selectedConfig,
    vocabularyCount: vocabulary.length,
    hasGameService: !!gameService,
    isAssignmentMode,
    isStandaloneAccess
  });

  // Regular game mode
  return (
    <div>
      {gameState === 'launcher' && isClient && urlParamsProcessed && (
        <UnifiedVocabMasterLauncher
          onGameStart={handleGameStart}
          onBack={handleBackToSelector}
          presetConfig={selectedConfig}
          onFilterChange={handleFilterChange}
        />
      )}

      {gameState === 'launcher' && (!isClient || !urlParamsProcessed) && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vocabulary filters...</p>
          </div>
        </div>
      )}

      {gameState === 'playing' && vocabulary.length > 0 && (
        <VocabMasterGameEngine
          config={{
            mode: selectedMode,
            vocabulary: vocabulary.map(item => ({
              id: item.id,
              word: item.word,
              spanish: item.word,
              english: item.translation,
              translation: item.translation,
              part_of_speech: item.part_of_speech,
              audio_url: item.audio_url,
              example_sentence: undefined,
              example_translation: undefined,
              mastery_level: 0,
              startTime: Date.now()
            })),
            audioEnabled: gameConfig.enableAudio ?? true,
            assignmentMode: false
          }}
          gameSessionId={gameSessionId}
          gameService={gameService}
          onGameComplete={(results: GameResult) => {
            // Pass the results in the format expected by GameCompletionScreen
            const completionResults = {
              score: results.score,
              accuracy: results.accuracy,
              totalWords: results.totalWords, // Keep original field name for completion screen
              correctAnswers: results.correctAnswers,
              incorrectAnswers: results.incorrectAnswers,
              timeSpent: results.timeSpent,
              maxStreak: results.maxStreak,
              wordsLearned: results.wordsLearned, // Keep as array for completion screen
              wordsStruggling: results.wordsStruggling,
              gemsCollected: results.gemsCollected,
              mode: selectedMode
            };

            // Also call handleGameComplete for database operations
            handleGameComplete({
              score: results.score,
              accuracy: results.accuracy,
              wordsLearned: results.wordsLearned.length,
              wordsReviewed: results.totalWords,
              correctAnswers: results.correctAnswers,
              timeSpent: results.timeSpent,
              maxStreak: results.maxStreak,
              mode: selectedMode,
              gemsCollected: results.gemsCollected,
              xpEarned: undefined
            });

            // Set the results for the completion screen
            setGameResults(completionResults);
            setGameState('complete');
          }}
          onExit={handleExit}
          onWordAttempt={handleVocabularyMastery}
          onOpenSettings={handleOpenConfigPanel}
        />
      )}

      {gameState === 'complete' && gameResults && (
        <GameCompletionScreen
          result={gameResults}
          onPlayAgain={() => {
            // Reset to launcher to start a new game
            setGameState('launcher');
            setGameResults(null);
            setGameSessionId(null);
            setSelectedMode('');
            setGameConfig({});
          }}
          onBackToMenu={() => {
            // Reset to launcher
            setGameState('launcher');
            setGameResults(null);
            setGameSessionId(null);
            setSelectedMode('');
            setGameConfig({});
          }}
        />
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          State: {gameState} | Config: {selectedConfig ? '✅' : '❌'} | Service: {gameService ? '✅' : '❌'}
        </div>
      )}
    </div>
  );
}
