'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useUnifiedAuth } from '../../../../hooks/useUnifiedAuth';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { useGameVocabulary } from '../../../../hooks/useGameVocabulary';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { SpacedRepetitionService } from '../../../../services/spacedRepetitionService';
import UnifiedVocabMasterLauncher from './UnifiedVocabMasterLauncher';
import { VocabMasterGameEngine } from './VocabMasterGameEngine';
import VocabMasterAssignmentWrapper from './VocabMasterAssignmentWrapper';
import { VocabularyWord as VocabWord, GameResult } from '../types';
import UnifiedGameLauncher from '../../../../components/games/UnifiedGameLauncher';
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
  };
}

export default function UnifiedVocabMasterWrapper({ searchParams = {} }: Props) {
  const { user } = useAuth();
  const { user: unifiedUser, isDemo } = useUnifiedAuth();
  const { supabase } = useSupabase();

  // Game state - start with launcher since we skip category selection
  const [gameState, setGameState] = useState<'selector' | 'launcher' | 'playing' | 'complete'>('launcher');
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [gameConfig, setGameConfig] = useState<Record<string, any>>({});
  const [gameResults, setGameResults] = useState<any>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  // Category selection state
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [vocabulary, setVocabulary] = useState<UnifiedVocabularyItem[]>([]);
  const [vocabularyLoading, setVocabularyLoading] = useState(false);
  const [vocabularyError, setVocabularyError] = useState<string | null>(null);

  // Services
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [spacedRepetitionService, setSpacedRepetitionService] = useState<SpacedRepetitionService | null>(null);

  // Assignment mode detection
  const isAssignmentMode = !!searchParams.assignment;

  // Standalone access detection (from /vocabmaster URL)
  const isStandaloneAccess = searchParams.standalone === 'true';

  // Check for URL parameters on mount (from games page)
  useEffect(() => {
    console.log('🔄 URL params useEffect running. Current gameState:', gameState);
    console.log('🔄 isAssignmentMode:', isAssignmentMode);
    console.log('🔄 searchParams:', searchParams);

    const checkUrlParams = () => {
      const lang = searchParams.lang;
      const level = searchParams.level as 'KS2' | 'KS3' | 'KS4' | 'KS5';
      const cat = searchParams.cat;
      const subcat = searchParams.subcat;

      console.log('🔍 VocabMaster checking URL params:', { lang, level, cat, subcat });

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
          customMode: false
        };

        console.log('🚀 Pre-setting VocabMaster config:', config);
        setSelectedConfig(config);
        // Go directly to launcher with pre-set config
        console.log('🚀 Setting gameState to launcher (with params)');
        setGameState('launcher');
      } else {
        console.log('❌ No URL parameters - will show launcher with filter selectors');
        console.log('🚀 Setting gameState to launcher (no params)');
        // Go directly to launcher without pre-set config
        setGameState('launcher');
      }
    };

    // Only run if not in assignment mode
    if (!isAssignmentMode) {
      checkUrlParams();
    } else {
      console.log('🚫 Skipping URL check - in assignment mode');
    }
  }, [searchParams, isAssignmentMode]);

  // Initialize services
  useEffect(() => {
    console.log('🔧 VocabMaster service initialization:', {
      hasSupabase: !!supabase,
      hasUser: !!user,
      hasUnifiedUser: !!unifiedUser,
      userId: user?.id || unifiedUser?.id,
      isDemo
    });

    // Always allow demo mode or when supabase is available
    if (supabase || isDemo) {
      const userId = user?.id || unifiedUser?.id;

      // Handle demo mode - don't initialize services that require real user IDs
      if (isDemo || !userId || userId === 'demo-user-id') {
        console.log('🎮 Demo mode detected - skipping service initialization');
        // For demo mode, we'll handle game sessions differently
        setGameService(null);
        setSpacedRepetitionService(null);
        return;
      }

      if (userId && userId !== 'demo-user-id' && supabase) {
        console.log('✅ Initializing VocabMaster services for user:', userId);
        setGameService(new EnhancedGameService(supabase));
        setSpacedRepetitionService(new SpacedRepetitionService(supabase));
      } else {
        console.log('⚠️ No valid user ID available for service initialization - using demo mode');
        setGameService(null);
        setSpacedRepetitionService(null);
      }
    } else {
      console.log('⚠️ No supabase available - using demo mode');
      setGameService(null);
      setSpacedRepetitionService(null);
    }
  }, [supabase, user, unifiedUser, isDemo]);

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

  // Handle back to category selector
  const handleBackToSelector = () => {
    setGameState('selector');
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

    const userId = user?.id || unifiedUser?.id;

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
        game_mode: mode,
        language_pair: `${selectedConfig?.language || 'spanish'}_english`,
        curriculum_level: selectedConfig?.curriculumLevel || 'KS3',
        category: selectedConfig?.categoryId || 'basics',
        subcategory: selectedConfig?.subcategoryId || undefined,
        theme_name: searchParams.theme || 'default',
        total_words: vocabularySubset.length,
        difficulty_level: config.difficulty || 'mixed',
        is_assignment: isAssignmentMode,
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
    userAnswer: string,
    isCorrect: boolean,
    responseTime: number,
    gameMode: string,
    masteryLevel?: number,
    spacedRepetitionUpdate?: boolean
  ) => {
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
          userAnswer,
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

      // Update spaced repetition if enabled
      if (spacedRepetitionUpdate && spacedRepetitionService && (user || unifiedUser)) {
        const userId = user?.id || unifiedUser?.id;
        if (userId) {
          await spacedRepetitionService.updateWordProgress(
            userId,
            word,
            translation,
            isCorrect,
            responseTime,
            gameMode
          );
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
      setGameState('complete');
      setGameResults(results);
      return;
    }

    try {
      // End game session
      await gameService.endGameSession(gameSessionId, {
        final_score: results.score || 0,
        words_completed: results.wordsReviewed || 0,
        accuracy_percentage: results.accuracy || 0,
        session_duration_ms: results.timeSpent || 0,
        max_streak: results.maxStreak || 0,
        completion_status: 'completed',
        bonus_points: results.gemsCollected || 0,
        performance_metrics: {
          mode: selectedMode,
          theme: results.theme,
          wordsLearned: results.wordsLearned,
          xpEarned: results.xpEarned
        }
      });

      setGameResults(results);
      setGameState('complete');
    } catch (error) {
      console.error('Failed to complete game session:', error);
      setGameState('complete');
    }
  };

  // Handle exit
  const handleExit = () => {
    if (gameState === 'playing') {
      setGameState('launcher');
    } else {
      setGameState('selector');
    }
    setSelectedMode('');
    setGameConfig({});
    setGameResults(null);
    setGameSessionId(null);
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
            onClick={() => setGameState('selector')}
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
      {gameState === 'launcher' && (
        <UnifiedVocabMasterLauncher
          onGameStart={handleGameStart}
          onBack={handleBackToSelector}
          presetConfig={selectedConfig}
          onFilterChange={handleFilterChange}
        />
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
          onGameComplete={(results: GameResult) => {
            handleGameComplete({
              score: results.score,
              accuracy: results.accuracy,
              wordsLearned: results.wordsLearned.length,
              wordsReviewed: results.totalWords,
              timeSpent: results.timeSpent,
              maxStreak: results.maxStreak,
              mode: selectedMode,
              theme: gameConfig.theme || 'adventure',
              gemsCollected: results.gemsCollected,
              xpEarned: undefined
            });
          }}
          onExit={handleExit}
          isAdventureMode={gameConfig.theme === 'adventure' || gameConfig.gamificationEnabled === true}
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
