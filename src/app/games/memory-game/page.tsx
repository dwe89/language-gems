'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import MemoryGameMain from './components/MemoryGameMain';
import { WordPair } from './components/CustomWordsModal';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { useGameAudio } from '../../../hooks/useGlobalAudioContext';
import AssignmentThemeSelector from '../../../components/games/AssignmentThemeSelector';
import { getGameCompatibility } from '../../../components/games/gameCompatibility';
import { EnhancedGameService } from '../../../services/enhancedGameService';
import { useSharedVocabulary, SharedVocabularyToast } from '../../../components/games/ShareVocabularyButton';
import './styles.css';

export default function UnifiedMemoryGamePage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  const filterOutstanding = searchParams?.get('filterOutstanding') === 'true';

  // Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // 🔗 Shared vocabulary detection
  const { sharedVocabulary, isFromSharedLink, clearSharedVocabulary } = useSharedVocabulary();
  const [showSharedToast, setShowSharedToast] = useState(false);

  // Always initialize assignment hook to keep hooks order stable
  const { assignment, vocabulary: assignmentVocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'memory-game', filterOutstanding);

  // Game state management - ALWAYS initialize hooks first
  const [gameStarted, setGameStarted] = useState(false);
  const [customWords, setCustomWords] = useState<WordPair[]>([]);

  // Initialize audio for assignment mode compatibility
  const audioManager = useGameAudio(true);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Assignment theme state
  const [assignmentTheme, setAssignmentTheme] = useState<string>('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // 🎯 Assignment game session state
  const [assignmentGameSessionId, setAssignmentGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);

  // Initialize game service
  useEffect(() => {
    const service = new EnhancedGameService();
    setGameService(service);
  }, []);

  // 🔗 Handle shared vocabulary auto-start
  useEffect(() => {
    if (isFromSharedLink && sharedVocabulary && sharedVocabulary.items.length > 0 && !gameStarted) {
      console.log('📎 [Memory Match] Loading shared vocabulary:', sharedVocabulary.items.length, 'items');

      // Transform shared vocabulary to WordPair format
      const transformedWords: WordPair[] = sharedVocabulary.items.map((item, index) => ({
        id: `shared-${index}`,
        term: item.term,
        translation: item.translation,
        type: 'word' as const,
        category: 'Shared',
        subcategory: 'Custom'
      }));

      // Set up game config for shared vocabulary
      const sharedConfig: UnifiedSelectionConfig = {
        language: sharedVocabulary.language || 'es',
        curriculumLevel: 'KS3',
        categoryId: 'custom',
        customMode: true,
        customContentType: sharedVocabulary.contentType || 'vocabulary',
        customVocabulary: sharedVocabulary.items.map((item, index) => ({
          id: `shared-${index}`,
          term: item.term,
          translation: item.translation,
        }))
      };

      setCustomWords(transformedWords);
      setGameConfig({
        config: sharedConfig,
        vocabulary: transformedWords.map(w => ({
          id: w.id || `shared-${Math.random()}`,
          word: w.term,
          translation: w.translation,
          language: sharedVocabulary.language || 'spanish',
          category: 'Shared',
          subcategory: 'Custom',
          difficulty: 'intermediate'
        }))
      });
      setGameStarted(true);
      setShowSharedToast(true);

      // Clear the URL param without reloading
      clearSharedVocabulary();
    }
  }, [isFromSharedLink, sharedVocabulary, gameStarted, clearSharedVocabulary]);

  // Create game session for assignment mode
  useEffect(() => {
    const createAssignmentSession = async () => {
      if (assignmentId && gameService && user?.id && assignmentVocabulary?.length > 0 && !assignmentGameSessionId) {
        try {
          console.log('🎮 [MEMORY MATCH] Creating assignment game session...');
          const sessionId = await gameService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId,
            game_type: 'memory-game',
            session_mode: 'assignment',
            session_data: {
              vocabularyCount: assignmentVocabulary.length,
              assignmentId: assignmentId
            }
          });
          setAssignmentGameSessionId(sessionId);
          console.log('✅ [MEMORY MATCH] Assignment game session created:', sessionId);
        } catch (error) {
          console.error('🚨 [MEMORY MATCH] Failed to create assignment game session:', error);
        }
      }
    };

    createAssignmentSession();
  }, [assignmentId, gameService, user?.id, assignmentVocabulary, assignmentGameSessionId]);

  // Placeholder for assignment-mode content (set below; returned at end)
  let assignmentJSX: JSX.Element | null = null;

  // Transform vocabulary to WordPair format for Memory Game (single definition)
  const transformVocabularyForMemoryGame = (vocabulary: UnifiedVocabularyItem[]): WordPair[] => {
    return vocabulary.map((vocab) => ({
      id: vocab.id,
      term: vocab.word,
      translation: vocab.translation,
      type: 'word' as const,
      category: vocab.category || 'general',
      subcategory: vocab.subcategory
    }));
  };

  // If assignment mode, build assignment content (after all hooks are initialized)
  if (isAssignmentMode) {
    if (!user) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      );
    } else if (assignmentLoading) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
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
      const wordPairs = transformVocabularyForMemoryGame(assignmentVocabulary);

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

          <MemoryGameMain
            language={assignmentVocabulary[0]?.language || "spanish"}
            topic="Assignment"
            difficulty="medium"
            onBackToSettings={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
            customWords={wordPairs}
            isAssignmentMode={true}
            assignmentTitle={assignment?.title || 'Assignment'}
            assignmentId={assignmentId!}
            userId={user.id}
            audioManager={audioManager}
            onThemeModalRequest={() => setShowThemeSelector(true)}
            onGridSizeModalRequest={() => { }}
            assignmentTheme={assignmentTheme}
            onAssignmentThemeChange={(theme) => {
              setAssignmentTheme(theme);
              setShowThemeSelector(false);
            }}
            showAssignmentThemeSelector={showThemeSelector}
            onToggleAssignmentThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
            gameSessionId={assignmentGameSessionId} // 🎯 Pass session ID for tracking
          />
        </div>
      );
    }

    // Do not return here; we will return assignmentJSX at the end to preserve hook order
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    // Always convert vocabulary to WordPair format if we have vocabulary
    if (vocabulary.length > 0) {
      const transformedWordPairs = transformVocabularyForMemoryGame(vocabulary);
      setCustomWords(transformedWordPairs);
      console.log('Transformed vocabulary for memory game:', {
        originalCount: vocabulary.length,
        transformedCount: transformedWordPairs.length,
        sampleItems: transformedWordPairs.slice(0, 3)
      });
    }

    setGameConfig({
      config,
      vocabulary
    });

    setGameStarted(true);

    console.log('Memory Game started with:', {
      config,
      vocabularyCount: vocabulary.length,
      customMode: config.customMode
    });
  };

  // Handle back to menu
  const handleBackToSettings = () => {
    // In assignment mode, don't allow going back to selector
    if (assignmentId) {
      window.history.back(); // Go back to previous page (likely dashboard)
      return;
    }
    setGameStarted(false);
    setGameConfig(null);
    setCustomWords([]);
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    console.log('🔄 Updating game configuration:', newConfig);
    const transformedVocabulary = transformVocabularyForMemoryGame(vocabulary);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary
    } : null);
    setCustomWords(transformedVocabulary);
  };

  // Show unified launcher if game not started (only in free-play mode)
  if (!isAssignmentMode && !gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Memory Match"
        gameDescription="Match vocabulary words with their translations by flipping cards"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={8} // Memory game needs at least 8 words for 4 pairs
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false} // Memory game doesn't have themes like hangman/tic-tac-toe
        requiresAudio={false}
        gameCompatibility={getGameCompatibility('memory-game') || undefined}
        preferredContentType="vocabulary"
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Click cards to flip them and reveal words</p>
            <p>• Match vocabulary words with their translations</p>
            <p>• Find all pairs to complete the game</p>
            <p>• Try to complete with the fewest moves possible</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Free-play render path
  if (!isAssignmentMode && gameStarted && gameConfig) {
    // Convert unified config to legacy memory game format
    const legacyLanguage = gameConfig.config.language === 'es' ? 'spanish' :
      gameConfig.config.language === 'fr' ? 'french' :
        gameConfig.config.language === 'de' ? 'german' : 'spanish';

    const legacyTopic = gameConfig.config.categoryId || 'general';
    const legacyDifficulty = gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'medium';

    return (
      <>
        <Head>
          <title>Memory Match Game | GCSE Language Learning | Language Gems</title>
          <meta name="description" content="Test your memory with our GCSE language learning Memory Match game. Match vocabulary pairs in Spanish, French, and German. Perfect for improving language recall." />
          <meta name="keywords" content="Memory Match game, GCSE language games, Spanish memory game, French memory game, German memory game, vocabulary matching, language learning games" />
          <link rel="canonical" href="https://languagegems.com/games/memory-game" />
        </Head>
        <div className="memory-game-container">
          <MemoryGameMain
            language={legacyLanguage}
            topic={legacyTopic}
            difficulty={legacyDifficulty}
            onBackToSettings={handleBackToSettings}
            customWords={customWords.length > 0 ? customWords : undefined}
            isAssignmentMode={false}
            userId={user?.id}
            onOpenSettings={handleOpenConfigPanel}
            audioManager={audioManager}
          />

          {/* In-game configuration panel */}
          <InGameConfigPanel
            currentConfig={gameConfig.config}
            onConfigChange={handleConfigChange}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={false}
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
            currentVocabulary={gameConfig.vocabulary}
            gameName="Memory Match"
          />

          {/* Show toast when vocabulary is loaded from shared link */}
          {showSharedToast && (
            <SharedVocabularyToast
              vocabularyCount={customWords.length}
              onDismiss={() => setShowSharedToast(false)}
            />
          )}
        </div>
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
