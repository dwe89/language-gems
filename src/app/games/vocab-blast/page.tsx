'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import VocabBlastGameWrapper from './components/VocabBlastGameWrapper';
import VocabBlastAssignmentWrapper from './components/VocabBlastAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem, loadVocabulary } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { ThemeProvider } from '../noughts-and-crosses/components/ThemeProvider';

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

  console.log('🎮 VocabBlastPage mounted');
  console.log('🔍 SearchParams:', searchParams?.toString());
  console.log('📋 URL params:', {
    lang: searchParams?.get('lang'),
    level: searchParams?.get('level'),
    cat: searchParams?.get('cat'),
    subcat: searchParams?.get('subcat')
  });

  // Temporary alert for debugging
  if (searchParams?.get('lang')) {
    console.log('🚨 FOUND URL PARAMS - should auto-start game!');
    // For now, let's see if we can at least detect the params
  }

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

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

  // Check for URL parameters from games page navigation
  const [urlParamsChecked, setUrlParamsChecked] = useState(false);

  // Check if URL parameters are present to determine initial auto-loading state
  const [isAutoLoading, setIsAutoLoading] = useState(() => {
    const hasUrlParams = searchParams?.get('lang') && searchParams?.get('level') && searchParams?.get('cat');
    return !!hasUrlParams && !assignmentId;
  });

  // Assignment mode handlers
  const handleAssignmentComplete = () => {
    // No auto-redirect - let completion screen handle navigation
  };

  const handleBackToAssignments = () => {
    router.push(`/student-dashboard/assignments/${assignmentId}`);
  };

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

  // Assignment mode: use dedicated assignment wrapper
  // THIS MUST COME AFTER ALL HOOKS
  if (assignmentId && mode === 'assignment' && user) {
    return (
      <VocabBlastAssignmentWrapper
        assignmentId={assignmentId}
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={() => router.push('/games/vocab-blast')}
      />
    );
  }

  // Conditional logic after all hooks are initialized
  // Only redirect to login if not in demo mode and not authenticated
  if (!isLoading && !user && !isDemo) {
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

  // Show unified launcher if game not started
  if (!gameStarted) {
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

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
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
          />
        </div>
      </ThemeProvider>
      </>
    );
  }

  // Fallback
  return null;
}
