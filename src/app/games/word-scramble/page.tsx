'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import WordScrambleFreePlayWrapper from './components/WordScrambleFreePlayWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import AssignmentThemeSelector from '../../../components/games/AssignmentThemeSelector';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import { EnhancedGameService } from '../../../services/enhancedGameService';

interface GameConfig {
  config: UnifiedSelectionConfig;
  vocabulary: UnifiedVocabularyItem[];
  theme?: string;
}

export default function WordScramblePage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Always initialize assignment hook to keep hooks order stable
  const { assignment, vocabulary: assignmentVocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'word-scramble');

  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Assignment theme state
  const [assignmentTheme, setAssignmentTheme] = useState<string>('classic');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Assignment game session state
  const [assignmentGameSessionId, setAssignmentGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);

  // Initialize game service
  useEffect(() => {
    const service = new EnhancedGameService();
    setGameService(service);
    console.log('🎮 [WORD SCRAMBLE] Game service initialized');
  }, []);

  // Create game session for assignment mode
  useEffect(() => {
    const createAssignmentSession = async () => {
      if (isAssignmentMode && gameService && user?.id && assignmentVocabulary?.length > 0 && !assignmentGameSessionId) {
        try {
          console.log('🎮 [WORD SCRAMBLE] Creating assignment game session...');
          const sessionId = await gameService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId!,
            game_type: 'word-scramble',
            session_mode: 'assignment',
            session_data: {
              vocabularyCount: assignmentVocabulary.length,
              assignmentId: assignmentId
            }
          });
          setAssignmentGameSessionId(sessionId);
          console.log('✅ [WORD SCRAMBLE] Assignment game session created:', sessionId);
        } catch (error) {
          console.error('🚨 [WORD SCRAMBLE] Failed to create assignment game session:', error);
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
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      );
    } else if (assignmentLoading) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
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
      assignmentJSX = (
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

          <WordScrambleFreePlayWrapper
            vocabulary={assignmentVocabulary}
            config={{
              language: assignmentVocabulary[0]?.language || 'es',
              curriculumLevel: 'KS3',
              categoryId: assignmentVocabulary[0]?.category || 'general',
              subcategoryId: assignmentVocabulary[0]?.subcategory || 'general'
            }}
            theme={assignmentTheme}
            onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
            onOpenSettings={() => setShowThemeSelector(true)}
            isAssignmentMode={true}
            assignmentId={assignmentId!}
            userId={user.id}
            gameSessionId={assignmentGameSessionId}
            assignmentTheme={assignmentTheme}
            onAssignmentThemeChange={(theme) => {
              setAssignmentTheme(theme);
              setShowThemeSelector(false);
            }}
            showAssignmentThemeSelector={showThemeSelector}
            onToggleAssignmentThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
          />
        </div>
      );
    }

    // Do not return here; we will return assignmentJSX at the end to preserve hook order
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    setGameConfig({ config, vocabulary, theme: theme || 'classic' });
    setGameStarted(true);
    console.log('Word Scramble started with:', { config, vocabularyCount: vocabulary.length, theme });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Handle config panel
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    setGameConfig({
      config,
      vocabulary,
      theme: theme || gameConfig?.theme || 'classic'
    });
    setShowConfigPanel(false);
  };

  // Show unified launcher if game not started (only in free-play mode)
  if (!isAssignmentMode && (!gameStarted || !gameConfig)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <UnifiedGameLauncher
          gameId="word-scramble"
          gameTitle="Word Scramble"
          gameDescription="Unscramble letters to form words and improve your vocabulary!"
          supportedLanguages={['es', 'fr', 'de']}
          supportedCurriculumLevels={['KS3', 'KS4']}
          onGameStart={handleGameStart}
          onBackToGames={() => router.push('/games')}
          requiresVocabulary={true}
          minVocabularyCount={5}
          maxVocabularyCount={50}
          defaultVocabularyCount={20}
        />
      </div>
    );
  }

  // Free-play render path
  if (!isAssignmentMode && gameStarted && gameConfig) {
    return (
      <>
        <div className="min-h-screen">
          <WordScrambleFreePlayWrapper
            vocabulary={gameConfig.vocabulary}
            userId={user?.id}
            language={gameConfig.config.language}
            difficulty={gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'medium'}
            onBackToMenu={handleBackToMenu}
            onGameComplete={(result) => {
              console.log('Word Scramble ended:', result);
              handleBackToMenu();
            }}
            onOpenSettings={handleOpenConfigPanel}
          />
        </div>

        {/* In-game configuration panel */}
        <InGameConfigPanel
          currentConfig={gameConfig?.config}
          onConfigChange={handleConfigChange}
          supportedLanguages={['es', 'fr', 'de']}
          supportsThemes={true}
          currentTheme={gameConfig?.theme}
          isOpen={showConfigPanel}
          onClose={handleCloseConfigPanel}
          showCustomMode={false}
        />
      </>
    );
  }

  // If we built assignment content, return it now (after all hooks)
  if (assignmentJSX) {
    return assignmentJSX;
  }

  // Fallback
  return null;
}
