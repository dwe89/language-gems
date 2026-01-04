'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import VocabBlastGameWrapper from './components/VocabBlastGameWrapper';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem, loadVocabulary } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { ThemeProvider } from '../noughts-and-crosses/components/ThemeProvider';
import AssignmentThemeSelector from '../../../components/games/AssignmentThemeSelector';
import { EnhancedGameService } from '../../../services/enhancedGameService';
import { useSharedVocabulary, SharedVocabularyToast } from '../../../components/games/ShareVocabularyButton';

export type GameState = 'menu' | 'settings' | 'playing' | 'completed' | 'paused';

export interface VocabBlastGameSettings {
  difficulty: string;
  category: string;
  language: string;
  theme: string;
  subcategory?: string;
  mode: 'categories' | 'custom';
  customWords?: string[];
  timeLimit?: number;
  // KS4-specific parameters
  curriculumLevel?: string;
  examBoard?: 'AQA' | 'edexcel';
  tier?: 'foundation' | 'higher';
}

export default function VocabBlastPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Always initialize assignment hook to keep hooks order stable
  const { assignment, vocabulary: assignmentVocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'vocab-blast');

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Game state management
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);

  // In-game configuration panel
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Assignment theme state
  const [assignmentTheme, setAssignmentTheme] = useState<string>('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Assignment game session state
  const [assignmentGameSessionId, setAssignmentGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);

  // Initialize game service
  useEffect(() => {
    const service = new EnhancedGameService();
    setGameService(service);
    console.log('🎮 [VOCAB BLAST] Game service initialized');
  }, []);

  // 🔗 Shared vocabulary detection
  const { sharedVocabulary, isFromSharedLink, clearSharedVocabulary } = useSharedVocabulary();
  const [showSharedToast, setShowSharedToast] = useState(false);

  // 🔗 Handle shared vocabulary auto-start
  useEffect(() => {
    if (isFromSharedLink && sharedVocabulary && sharedVocabulary.items.length > 0 && !gameStarted && !isAssignmentMode) {
      console.log('📎 [VOCAB BLAST] Loading shared vocabulary:', sharedVocabulary.items.length, 'items');

      // Transform shared vocabulary to Vocab Blast format
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
          console.log('🎮 [VOCAB BLAST] Creating assignment game session...');
          const sessionId = await gameService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId!,
            game_type: 'vocab-blast',
            session_mode: 'assignment',
            session_data: {
              vocabularyCount: assignmentVocabulary.length,
              assignmentId: assignmentId
            }
          });
          setAssignmentGameSessionId(sessionId);
          console.log('✅ [VOCAB BLAST] Assignment game session created:', sessionId);
        } catch (error) {
          console.error('🚨 [VOCAB BLAST] Failed to create assignment game session:', error);
        }
      }
    };

    createAssignmentSession();
  }, [isAssignmentMode, gameService, user?.id, assignmentVocabulary, assignmentGameSessionId, assignmentId]);

  // Check for URL parameters from games page navigation
  const [urlParamsChecked, setUrlParamsChecked] = useState(false);

  // Check if URL parameters are present to determine initial auto-loading state
  const [isAutoLoading, setIsAutoLoading] = useState(() => {
    const hasUrlParams = searchParams?.get('lang') && searchParams?.get('level') && searchParams?.get('cat');
    return !!hasUrlParams && !assignmentId;
  });

  // Placeholder for assignment-mode content (set below; returned at end)
  let assignmentJSX: JSX.Element | null = null;

  // Transform vocabulary for vocab blast game
  const transformVocabularyForVocabBlast = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      difficulty_level: item.difficulty_level || 'intermediate'
    }));
  };

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
      const transformedVocabulary = transformVocabularyForVocabBlast(assignmentVocabulary);
      const categoryName = assignmentVocabulary[0]?.category || 'assignment';
      const subcategoryName = assignmentVocabulary[0]?.subcategory || 'assignment';

      // Derive a minimal config for the in-game settings panel
      const assignmentUiConfig: UnifiedSelectionConfig = {
        language: 'es',
        curriculumLevel: 'KS3',
        categoryId: categoryName,
        subcategoryId: subcategoryName
      };

      // Legacy settings format for VocabBlastGameWrapper
      const assignmentSettings: VocabBlastGameSettings = {
        difficulty: 'intermediate',
        category: categoryName,
        subcategory: subcategoryName,
        language: 'spanish',
        theme: assignmentTheme,
        mode: 'categories' as const
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

            <VocabBlastGameWrapper
              settings={assignmentSettings}
              onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
              onBackToAssignment={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
              onGameEnd={(result) => console.log('Assignment game ended:', result)}
              assignmentId={assignmentId!}
              userId={user.id}
              gameSessionId={assignmentGameSessionId}
              categoryVocabulary={transformedVocabulary}
              isAssignmentMode={true}
              onOpenSettings={() => setShowConfigPanel(true)}
              assignmentTheme={assignmentTheme}
              onAssignmentThemeChange={(theme) => {
                setAssignmentTheme(theme);
                setShowThemeSelector(false);
              }}
              showAssignmentThemeSelector={showThemeSelector}
              onToggleAssignmentThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
            />

            {/* In-game configuration panel */}
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
          </div>
        </ThemeProvider>
      );
    }

    // Do not return here; we will return assignmentJSX at the end to preserve hook order
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    const transformedVocabulary = transformVocabularyForVocabBlast(vocabulary);

    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'default'
    });

    setGameStarted(true);

    console.log('Vocab Blast started with:', {
      config,
      vocabularyCount: vocabulary.length,
      theme,
      transformedCount: transformedVocabulary.length
    });
  };

  // Check for URL parameters and auto-start game
  useEffect(() => {
    const checkUrlParams = async () => {
      console.log('🔍 Checking URL params...', {
        urlParamsChecked,
        gameStarted,
        assignmentId,
        isLoading,
        user: !!user,
        isDemo
      });

      if (urlParamsChecked || gameStarted || assignmentId) {
        console.log('❌ Skipping URL param check:', { urlParamsChecked, gameStarted, assignmentId });
        return;
      }

      const lang = searchParams?.get('lang');
      const level = searchParams?.get('level') as 'KS2' | 'KS3' | 'KS4' | 'KS5';
      const cat = searchParams?.get('cat');
      const subcat = searchParams?.get('subcat');
      const theme = searchParams?.get('theme') || 'default';
      const examBoard = searchParams?.get('examBoard') as 'AQA' | 'edexcel';
      const tier = searchParams?.get('tier') as 'foundation' | 'higher';

      console.log('📋 URL Parameters:', { lang, level, cat, subcat, theme, examBoard, tier });

      if (lang && level && cat) {
        setIsAutoLoading(true);
        try {
          const config: UnifiedSelectionConfig = {
            language: lang,
            curriculumLevel: level,
            categoryId: cat,
            subcategoryId: subcat || undefined,
            // KS4-specific parameters
            examBoard: examBoard || undefined,
            tier: tier || undefined
          };

          console.log('🚀 Auto-loading game with config:', config);

          const vocabulary = await loadVocabulary(config);
          console.log('📚 Vocabulary loaded:', { count: vocabulary?.length, vocabulary: vocabulary?.slice(0, 3) });

          if (vocabulary && vocabulary.length > 0) {
            console.log('✅ Starting game automatically...');
            handleGameStart(config, vocabulary, theme);
            setIsAutoLoading(false);
          } else {
            console.warn('⚠️ No vocabulary loaded for config:', config);
            setIsAutoLoading(false);
          }
        } catch (error) {
          console.error('❌ Error auto-loading game:', error);
          setIsAutoLoading(false);
        }
      } else {
        console.log('❌ Missing required URL parameters:', { lang, level, cat });
      }

      setUrlParamsChecked(true);
    };

    if (!isLoading && (user || isDemo)) {
      console.log('✅ Auth ready, checking URL params...');
      checkUrlParams();
    } else {
      console.log('⏳ Waiting for auth...', { isLoading, user: !!user, isDemo });
    }
  }, [searchParams, isLoading, user, isDemo, urlParamsChecked, assignmentId]);

  // Conditional logic after all hooks are initialized
  // Only redirect to login if not in demo mode and not authenticated and not in assignment mode
  if (!isLoading && !user && !isDemo && !isAssignmentMode) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating or auto-loading from URL parameters
  if (isLoading || isAutoLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">
            {isAutoLoading ? 'Starting game...' : 'Loading Vocab Blast...'}
          </p>
        </div>
      </div>
    );
  }



  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  const handleGameEnd = (result: { outcome: 'win' | 'loss' | 'timeout'; score: number; wordsLearned: number }) => {
    console.log('Game ended:', result);
    if (assignmentId) {
      setTimeout(() => {
        router.push('/student-dashboard/assignments');
      }, 3000);
    }
  };

  // In-game configuration handlers
  const handleConfigChange = (newConfig: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    console.log('🔄 Updating game configuration:', newConfig, 'Theme:', theme);
    const transformedVocabulary = transformVocabularyForVocabBlast(vocabulary);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary: transformedVocabulary,
      theme: theme || prev.theme
    } : null);
  };

  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  // Show unified launcher if game not started (only in free-play mode)
  if (!isAssignmentMode && !gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Vocab Blast"
        gameDescription="Click vocabulary gems to pop and translate them quickly"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1}
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
            <p>• Click on vocabulary items as they appear</p>
            <p>• Choose the correct translation at your own pace</p>
            <p>• Build combos for higher scores</p>
            <p>• Win by reaching score, word, or combo targets</p>
            <p>• Don't let your lives reach zero!</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Free-play render path
  if (!isAssignmentMode && gameStarted && gameConfig) {
    // Convert unified config to legacy vocab blast format
    const legacySettings: VocabBlastGameSettings = {
      difficulty: gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'intermediate',
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId,
      language: gameConfig.config.language === 'es' ? 'spanish' :
        gameConfig.config.language === 'fr' ? 'french' :
          gameConfig.config.language === 'de' ? 'german' : 'spanish',
      theme: gameConfig.theme,
      mode: 'categories' as const
    };

    return (
      <>
        <Head>
          <title>Vocab Blast Game | GCSE Vocabulary Learning | Language Gems</title>
          <meta name="description" content="Practice GCSE Spanish, French, and German vocabulary with Vocab Blast - an interactive word learning game. Perfect for vocabulary building and exam preparation." />
          <meta name="keywords" content="Vocab Blast, GCSE vocabulary game, Spanish vocabulary, French vocabulary, German vocabulary, language learning game, vocabulary practice" />
          <link rel="canonical" href="https://languagegems.com/games/vocab-blast" />
        </Head>
        <ThemeProvider themeId={gameConfig.theme}>
          <div className="min-h-screen">
            <VocabBlastGameWrapper
              settings={legacySettings}
              onBackToMenu={handleBackToMenu}
              onGameEnd={handleGameEnd}
              assignmentId={assignmentId}
              userId={user?.id}
              categoryVocabulary={gameConfig.vocabulary}
              onOpenSettings={handleOpenConfigPanel}
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
              gameName="Vocab Blast"
            />
          </div>
        </ThemeProvider>
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
