'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import DetectiveListeningGameWrapper from './components/DetectiveListeningGameWrapper';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import AssignmentLoadingScreen from '../../../components/ui/AssignmentLoadingScreen';
import AssignmentErrorScreen from '../../../components/ui/AssignmentErrorScreen';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';

export default function UnifiedDetectiveListeningPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Option B: Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Load assignment data if in assignment mode (hook must be called unconditionally)
  const { assignment, vocabulary: assignmentVocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'detective-listening');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);

  // Config panel state
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Build assignment JSX after all hooks
  let assignmentJSX: JSX.Element | null = null;

  if (isAssignmentMode) {
    if (!user) {
      assignmentJSX = <AssignmentLoadingScreen message="Please log in to access this assignment" />;
    } else if (assignmentLoading) {
      assignmentJSX = <AssignmentLoadingScreen message="Loading assignment..." />;
    } else if (assignmentError || !assignmentVocabulary || assignmentVocabulary.length === 0) {
      assignmentJSX = <AssignmentErrorScreen error={assignmentError || 'No vocabulary found'} />;
    } else {
      assignmentJSX = (
        <DetectiveListeningGameWrapper
          vocabulary={assignmentVocabulary}
          onBackToMenu={() => router.push('/student-dashboard/assignments')}
          onGameEnd={() => router.push('/student-dashboard/assignments')}
          assignmentId={assignmentId!}
          userId={user.id}
          isAssignmentMode={true}
          config={{
            language: assignment?.vocabulary_criteria?.language || 'es',
            curriculumLevel: assignment?.curriculum_level || 'KS3',
            categoryId: assignment?.vocabulary_criteria?.category || 'general',
            subcategoryId: assignment?.vocabulary_criteria?.subcategory
          }}
        />
      );
    }
  }

  // Return assignment JSX if in assignment mode
  if (assignmentJSX) {
    return assignmentJSX;
  }

  // Transform unified vocabulary to detective listening format
  const transformVocabularyForDetectiveListening = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      example_sentence_original: item.example_sentence_original,
      example_sentence_translation: item.example_sentence_translation,
      audio_url: item.audio_url
    }));
  };

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    const transformedVocabulary = transformVocabularyForDetectiveListening(vocabulary);
    
    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'default'
    });
    
    setGameStarted(true);
    
    console.log('Detective Listening started with:', {
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
  const handleGameEnd = (result: {
    correctAnswers: number;
    totalEvidence: number;
    evidenceCollected: any[];
    timeSpent?: number;
    averageResponseTime?: number;
  }) => {
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
    const transformedVocabulary = transformVocabularyForDetectiveListening(vocabulary);

    setGameConfig({
      config: newConfig,
      vocabulary: transformedVocabulary,
      theme: theme || gameConfig?.theme || 'default'
    });

    console.log('Detective Listening config changed:', {
      newConfig,
      vocabularyCount: vocabulary.length,
      theme,
      transformedCount: transformedVocabulary.length
    });
  };

  // Show loading while authenticating
  if (isLoading) {
    return <AssignmentLoadingScreen />;
  }

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Detective Listening"
        gameDescription="Solve listening mysteries by identifying vocabulary words"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={3} // Need at least 3 words for detective work
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={true}
        defaultTheme="detective"
        requiresAudio={true} // Detective listening requires audio
        gameCompatibility={{
          supportsVocabulary: true,
          supportsSentences: false,
          supportsMixed: false,
          minItems: 3,
          maxItems: 50
        }}
        preferredContentType="vocabulary"
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Listen carefully to audio clues</p>
            <p>• Solve vocabulary mysteries step by step</p>
            <p>• Use custom vocabulary for personalized cases</p>
            <p>• Complete investigations to unlock rewards</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy detective listening settings format
    const gameSettings = {
      caseType: gameConfig.config.categoryId || 'basics_core_language',
      language: gameConfig.config.language === 'es' ? 'spanish' : 
                gameConfig.config.language === 'fr' ? 'french' : 
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      difficulty: 'medium',
      category: gameConfig.config.categoryId || 'basics_core_language',
      subcategory: gameConfig.config.subcategoryId || 'greetings_introductions',
      curriculumLevel: gameConfig.config.curriculumLevel || 'KS3',
      examBoard: gameConfig.config.examBoard,
      tier: gameConfig.config.tier,
      theme: gameConfig.theme
    };

    return (
      <>
        <DetectiveListeningGameWrapper
          settings={gameSettings}
          vocabulary={gameConfig.vocabulary} // Pass the custom vocabulary
          assignmentId={assignmentId}
          userId={user?.id}
          onBackToMenu={handleBackToMenu}
          onGameEnd={handleGameEnd}
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
      </>
    );
  }

  // Fallback
  return null;
}


