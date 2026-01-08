'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import { ThemeProvider } from './components/ThemeProvider';
import TicTacToeGameWrapper from './components/TicTacToeGameWrapper';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import { useAudio } from './hooks/useAudio';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import AssignmentThemeSelector from '../../../components/games/AssignmentThemeSelector';
import { EnhancedGameService } from '../../../services/enhancedGameService';
import ChunkLoadErrorBoundary from '../../../components/errors/ChunkLoadErrorBoundary';
import { useSharedVocabulary, SharedVocabularyToast } from '../../../components/games/ShareVocabularyButton';
import GameCompletionModal from '../../../components/games/GameCompletionModal';

function UnifiedNoughtsAndCrossesPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Early assignment mode detection to prevent flash
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Always initialize assignment hook to keep hooks order stable
  // filterOutstanding=true filters out mastered words (accuracy ≥ 80% AND encounters ≥ 3)
  const { assignment, vocabulary: assignmentVocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'noughts-and-crosses', true);

  // ALWAYS initialize ALL hooks first to prevent "more hooks than previous render" error
  const [soundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);

  // Game state management - must be initialized BEFORE any conditional returns
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher - must be initialized BEFORE any conditional returns
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [gameMode, setGameMode] = useState<'computer' | '2-player'>('computer');

  // Assignment theme state
  const [assignmentTheme, setAssignmentTheme] = useState<string>('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Assignment game session state
  const [assignmentGameSessionId, setAssignmentGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);

  // Modal state for assignment completion
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState({
    wordsLearned: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    timeSpent: 0,
    perfectGame: false
  });

  // Initialize game service
  useEffect(() => {
    const service = new EnhancedGameService(); // No parameters needed, uses default Supabase client
    setGameService(service);
    console.log('🎮 [NOUGHTS] Game service initialized');
  }, []);

  // 🔗 Shared vocabulary detection
  const { sharedVocabulary, isFromSharedLink, clearSharedVocabulary } = useSharedVocabulary();
  const [showSharedToast, setShowSharedToast] = useState(false);

  // 🔗 Handle shared vocabulary auto-start
  useEffect(() => {
    if (isFromSharedLink && sharedVocabulary && sharedVocabulary.items.length > 0 && !gameStarted && !isAssignmentMode) {
      console.log('📎 [NOUGHTS] Loading shared vocabulary:', sharedVocabulary.items.length, 'items');

      // Transform shared vocabulary to Tic-Tac-Toe format
      const transformedVocabulary: UnifiedVocabularyItem[] = sharedVocabulary.items.map((item, index) => ({
        id: `shared-${index}`,
        word: item.term,
        translation: item.translation,
        language: sharedVocabulary.language || 'spanish',
        category: 'Shared',
        subcategory: 'Custom',
        difficulty: 'intermediate'
      }));

      // Set up game config for shared vocabulary
      const sharedConfig: UnifiedSelectionConfig = {
        language: sharedVocabulary.language || 'es',
        curriculumLevel: 'KS3',
        categoryId: 'custom',
        customMode: true,
        customContentType: sharedVocabulary.contentType || 'vocabulary',
      };

      setGameConfig({
        config: sharedConfig,
        vocabulary: transformedVocabulary,
        theme: 'default'
      });
      setGameStarted(true);
      setShowSharedToast(true);

      // Clear the URL param without reloading
      clearSharedVocabulary();
    }
  }, [isFromSharedLink, sharedVocabulary, gameStarted, isAssignmentMode, clearSharedVocabulary]);

  // Create game session for assignment mode
  useEffect(() => {
    const createAssignmentSession = async () => {
      if (isAssignmentMode && gameService && user?.id && assignmentVocabulary?.length > 0 && !assignmentGameSessionId) {
        try {
          console.log('🎮 [NOUGHTS] Creating assignment game session...');
          const sessionId = await gameService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId!,
            game_type: 'noughts-and-crosses',
            session_mode: 'assignment',
            session_data: {
              vocabularyCount: assignmentVocabulary.length,
              assignmentId: assignmentId
            }
          });
          setAssignmentGameSessionId(sessionId);
          console.log('✅ [NOUGHTS] Assignment game session created:', sessionId);
        } catch (error) {
          console.error('🚨 [NOUGHTS] Failed to create assignment game session:', error);
        }
      }
    };

    createAssignmentSession();
  }, [isAssignmentMode, gameService, user?.id, assignmentVocabulary, assignmentGameSessionId, assignmentId]);

  // Placeholder for assignment-mode content (set below; returned at end)
  let assignmentJSX: JSX.Element | null = null;

  // If assignment mode, build assignment content (after all hooks are initialized)
  if (isAssignmentMode) {
    if (!user) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      );
    } else if (assignmentLoading) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading assignment…</p>
          </div>
        </div>
      );
    } else if (assignmentError || !assignmentVocabulary?.length) {
      assignmentJSX = (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
          <div className="text-white text-center">
            <p className="text-lg font-semibold mb-2">Unable to load assignment vocabulary.</p>
            <p className="text-sm opacity-80">{assignmentError || 'This assignment has no vocabulary.'}</p>
          </div>
        </div>
      );
    } else {
      const categoryName = assignmentVocabulary[0]?.category || 'assignment';
      const subcategoryName = assignmentVocabulary[0]?.subcategory || 'assignment';

      // Derive a minimal config for the in-game settings panel in assignment mode
      const assignmentUiConfig: UnifiedSelectionConfig = {
        language: 'es',
        curriculumLevel: 'KS3',
        categoryId: categoryName,
        subcategoryId: subcategoryName
      };

      // Convert assignment vocabulary to TicTacToe format
      const transformedAssignmentVocab = assignmentVocabulary.map(item => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        language: item.language,
        category: item.category,
        subcategory: item.subcategory,
        part_of_speech: item.part_of_speech,
        example_sentence_original: '',
        example_sentence_translation: ''
      }));

      // Legacy settings format for TicTacToeGameWrapper
      const assignmentSettings = {
        difficulty: 'beginner',
        category: categoryName,
        subcategory: subcategoryName,
        language: 'spanish',
        theme: assignmentTheme,
        playerMark: 'X',
        computerMark: 'O',
        gameMode: gameMode
      };

      assignmentJSX = (
        <ThemeProvider themeId={assignmentTheme}>
          <div className="w-full h-screen relative">
            {/* Assignment Theme Selector */}
            <AssignmentThemeSelector
              currentTheme={assignmentTheme}
              onThemeChange={(theme) => {
                setAssignmentTheme(theme);
                setShowThemeSelector(false);
              }}
              isOpen={showThemeSelector}
              onClose={() => setShowThemeSelector(false)}
            />

            <TicTacToeGameWrapper
              settings={assignmentSettings}
              vocabulary={transformedAssignmentVocab}
              onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
              onGameEnd={async (result) => {
                console.log('Assignment game ended (round):', result);
                const extendedResult = result as any;

                // Accumulate stats for local display
                const newWordsLearned = completionData.wordsLearned + result.wordsLearned;
                const newCorrectAnswers = completionData.correctAnswers + (extendedResult.correctAnswers || 0);
                const newTotalQuestions = completionData.totalQuestions + (extendedResult.totalQuestions || 0);
                const newTimeSpent = completionData.timeSpent + (extendedResult.timeSpent || 0);

                setCompletionData(prev => ({
                  wordsLearned: prev.wordsLearned + result.wordsLearned,
                  correctAnswers: prev.correctAnswers + (extendedResult.correctAnswers || 0),
                  totalQuestions: prev.totalQuestions + (extendedResult.totalQuestions || 0),
                  timeSpent: prev.timeSpent + (extendedResult.timeSpent || 0),
                  perfectGame: result.perfectGame || false
                }));

                // Check if this session has reached the completion threshold (9 words for noughts-and-crosses)
                // Use uniqueWordsThisSession from the result, NOT database queries (which count historical data)
                const uniqueWordsThisSession = extendedResult.uniqueWordsThisSession || 0;
                const GAME_COMPLETION_THRESHOLD = 9; // Matches GAME_COMPLETION_THRESHOLDS['noughts-and-crosses']

                console.log(`📊 [NOUGHTS] Session progress: ${uniqueWordsThisSession}/${GAME_COMPLETION_THRESHOLD} unique words this session`);

                if (uniqueWordsThisSession >= GAME_COMPLETION_THRESHOLD) {
                  console.log('🎉 [NOUGHTS] Game complete! Showing completion modal...');
                  setShowCompletionModal(true);
                }
                // Otherwise, the player sees the in-game win/loss screen and can click "Play Again"
              }}
              assignmentId={assignmentId!}
              userId={user.id}
              gameSessionId={assignmentGameSessionId}
              isAssignmentMode={true}
              onOpenSettings={() => setShowConfigPanel(true)}
              onGameModeChange={setGameMode}
              assignmentTheme={assignmentTheme}
              onAssignmentThemeChange={(theme) => {
                setAssignmentTheme(theme);
                setShowThemeSelector(false);
              }}
              showAssignmentThemeSelector={showThemeSelector}
              onToggleAssignmentThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
            />

            {/* In-game configuration panel (read-only topics for assignments; theme/music still useful) */}
            <InGameConfigPanel
              currentConfig={assignmentUiConfig}
              onConfigChange={(newConfig, _vocab, theme) => {
                if (theme) setAssignmentTheme(theme);
              }}
              supportedLanguages={['es', 'fr', 'de']}
              supportsThemes={true}
              currentTheme={assignmentTheme}
              isOpen={showConfigPanel}
              onClose={() => setShowConfigPanel(false)}
            />

            {/* Completion Modal */}
            <GameCompletionModal
              isOpen={showCompletionModal}
              gameName="Noughts & Crosses"
              wordsCompleted={completionData.wordsLearned}
              threshold={assignmentVocabulary.length}
              accuracy={completionData.totalQuestions > 0
                ? (completionData.correctAnswers / completionData.totalQuestions) * 100
                : 0}
              timeSpent={completionData.timeSpent}
              onBackToAssignment={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
              onPlayAgain={() => {
                setShowCompletionModal(false);
                // Force a re-render/reset if needed, but wrapper handles reset usually
                // Or we can just reload the page or implement a reset callback
                window.location.reload();
              }}
            />
          </div>
        </ThemeProvider>
      );
    }

    // Do not return here; we will return assignmentJSX at the end to preserve hook order
  }

  // Authentication check (only redirect if not in demo mode and not in assignment mode)
  if (!isLoading && !user && !isDemo && !isAssignmentMode) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Vocabulary Tic-Tac-Toe...</p>
        </div>
      </div>
    );
  }

  // Transform unified vocabulary to noughts and crosses format
  const transformVocabularyForTicTacToe = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      example_sentence_original: item.example_sentence_original,
      example_sentence_translation: item.example_sentence_translation
    }));
  };

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    const transformedVocabulary = transformVocabularyForTicTacToe(vocabulary);

    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'default'
    });

    setGameStarted(true);

    console.log('Noughts and Crosses started with:', {
      config,
      vocabularyCount: vocabulary.length,
      theme,
      transformedCount: transformedVocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Handle game end
  const handleGameEnd = (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number; perfectGame?: boolean }) => {
    console.log('Game ended:', result);

    // If in assignment mode, redirect back to assignments
    if (assignmentId) {
      setTimeout(() => {
        router.push('/student-dashboard/assignments');
      }, 3000);
    }
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    console.log('🔄 Updating noughts and crosses configuration:', newConfig, 'Theme:', theme);
    const transformedVocabulary = transformVocabularyForTicTacToe(vocabulary);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary: transformedVocabulary,
      theme: theme || prev.theme // Update theme if provided, otherwise keep current
    } : null);
  };

  // Show unified launcher if game not started (only in free-play mode)
  if (!isAssignmentMode && !gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Vocabulary Tic-Tac-Toe"
        gameDescription="Answer vocabulary questions correctly to claim squares and get three in a row"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1} // Can work with minimal vocabulary
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={true}
        defaultTheme="default"
        requiresAudio={false}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Answer vocabulary questions correctly to claim squares</p>
            <p>• Get three squares in a row to win</p>
            <p>• Choose your adventure theme for immersive gameplay</p>
            <p>• Compete against the AI in themed environments</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Free-play render path
  if (!isAssignmentMode && gameStarted && gameConfig) {
    // Convert unified config to legacy tic-tac-toe settings format
    const legacySettings = {
      difficulty: 'beginner', // Default difficulty
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId,
      language: gameConfig.config.language === 'es' ? 'spanish' :
        gameConfig.config.language === 'fr' ? 'french' :
          gameConfig.config.language === 'de' ? 'german' : 'spanish',
      theme: gameConfig.theme,
      playerMark: 'X',
      computerMark: 'O',
      gameMode: gameMode // Use the state variable
    };

    return (
      <ThemeProvider themeId={gameConfig.theme}>
        <div className="w-full h-screen relative">
          <TicTacToeGameWrapper
            settings={legacySettings}
            vocabulary={gameConfig.vocabulary}
            onBackToMenu={handleBackToMenu}
            onGameEnd={handleGameEnd}
            assignmentId={assignmentId}
            userId={user?.id}
            onOpenSettings={handleOpenConfigPanel}
            onGameModeChange={setGameMode}
            onThemeChange={(newTheme) => {
              setGameConfig(prev => prev ? { ...prev, theme: newTheme } : null);
            }}
          />

          {/* In-game configuration panel */}
          <InGameConfigPanel
            currentConfig={gameConfig.config}
            onConfigChange={handleConfigChange}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={true}
            currentTheme={gameConfig.theme}
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
            currentVocabulary={gameConfig.vocabulary}
            gameName="Noughts and Crosses"
          />
        </div>
      </ThemeProvider>
    );
  }

  // If we built assignment content, return it now (after all hooks)
  if (assignmentJSX) {
    return assignmentJSX;
  }

  // Fallback
  return null;
}

// Wrap the component with ChunkLoadErrorBoundary to handle chunk loading errors
// This is especially important for Windows PC users experiencing 403 chunk errors
export default function NoughtsAndCrossesPageWithErrorBoundary() {
  return (
    <ChunkLoadErrorBoundary>
      <UnifiedNoughtsAndCrossesPage />
    </ChunkLoadErrorBoundary>
  );
}
