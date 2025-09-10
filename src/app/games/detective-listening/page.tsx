'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import DetectiveListeningGameWrapper from './components/DetectiveListeningGameWrapper';
import DetectiveListeningAssignmentWrapper from './components/DetectiveListeningAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import AssignmentLoadingScreen from '../../../components/ui/AssignmentLoadingScreen';
import AssignmentErrorScreen from '../../../components/ui/AssignmentErrorScreen';

export default function UnifiedDetectiveListeningPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);

  console.log('🎯 [Detective Listening] URL params [DEBUG-v3]:', {
    assignmentId,
    mode,
    searchParams: searchParams?.toString(),
    timestamp: new Date().toISOString()
  });

  console.log('🎯 [Detective Listening] Assignment mode check [DEBUG-v6]:', {
    assignmentId,
    mode,
    hasUser: !!user,
    userId: user?.id,
    searchParams: searchParams?.toString(),
    timestamp: new Date().toISOString()
  });

  // If assignment mode, use the assignment wrapper directly
  if (assignmentId && mode === 'assignment' && user) {
    return (
      <DetectiveListeningAssignmentWrapper assignmentId={assignmentId} />
    );
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
      <DetectiveListeningGameWrapper
        settings={gameSettings}
        vocabulary={gameConfig.vocabulary} // Pass the custom vocabulary
        assignmentId={assignmentId}
        userId={user?.id}
        onBackToMenu={handleBackToMenu}
        onGameEnd={handleGameEnd}
      />
    );
  }

  // Fallback
  return null;
}


