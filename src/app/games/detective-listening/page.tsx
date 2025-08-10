'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import DetectiveListeningGameWrapper from './components/DetectiveListeningGameWrapper';
import DetectiveListeningAssignmentWrapper from './components/DetectiveListeningAssignmentWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import AssignmentModeHandler, { AssignmentLoadingScreen, AssignmentErrorScreen } from '../../../utils/assignmentModeHandler';

export default function UnifiedDetectiveListeningPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  console.log('🎯 [Detective Listening] URL params [DEBUG-v3]:', {
    assignmentId,
    mode,
    searchParams: searchParams?.toString(),
    timestamp: new Date().toISOString()
  });

  // ALWAYS initialize hooks first to prevent "more hooks than previous render" error
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
  } | null>(null);

  // Assignment mode handlers
  const handleAssignmentComplete = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

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

  // Use assignment mode handler for all cases
  if (user) {
    return (
      <AssignmentModeHandler
        assignmentId={assignmentId}
        mode={mode}
        userId={user.id}
        gameId="detective-listening"
      >
        {({ isAssignmentMode, settings, loading, error }) => {
          console.log('🎯 [Detective Listening] Assignment handler result:', {
            isAssignmentMode,
            hasSettings: !!settings,
            loading,
            error,
            timestamp: new Date().toISOString()
          });

          if (loading) {
            return <AssignmentLoadingScreen />;
          }

          if (error) {
            return <AssignmentErrorScreen error={error} onRetry={() => window.location.reload()} />;
          }

          if (!settings) {
            return <div>No settings available</div>;
          }

          // Convert settings to the format expected by DetectiveListeningGameWrapper
          const gameSettings = {
            caseType: settings.category || 'basics_core_language',
            language: settings.language || 'spanish',
            difficulty: settings.difficulty || 'medium',
            category: settings.category || 'basics_core_language',
            subcategory: settings.subcategory || 'greetings_introductions',
            curriculumLevel: settings.curriculumLevel || 'KS3',
            examBoard: settings.examBoard,
            tier: settings.tier
          };

          return (
            <DetectiveListeningGameWrapper
              settings={gameSettings}
              assignmentId={isAssignmentMode ? assignmentId : undefined}
              userId={user.id}
              onBackToMenu={() => router.push('/games/detective-listening')}
              onGameEnd={(result) => {
                console.log('Detective Listening game ended:', result);
                if (isAssignmentMode) {
                  // TODO: Handle assignment completion
                  console.log('Assignment mode game completed');
                }
                router.push('/games/detective-listening');
              }}
            />
          );
        }}
      </AssignmentModeHandler>
    );
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setGameConfig({
      config,
      vocabulary
    });
    
    setGameStarted(true);
    
    console.log('Detective Listening started with:', {
      config,
      vocabularyCount: vocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Detective Listening"
        gameDescription="Solve mysteries by listening to audio clues and answering questions"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Detective Listening uses pre-recorded audio content
        minVocabularyRequired={0} // Uses audio content, not vocabulary
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={true}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Listen carefully to audio clues and testimonies</p>
            <p>• Answer questions about what you heard</p>
            <p>• Solve the mystery by gathering evidence</p>
            <p>• Use headphones for the best experience</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to detective listening format
    const gameSettings = {
      caseType: gameConfig.config.categoryId || 'general',
      language: gameConfig.config.language === 'es' ? 'spanish' :
                gameConfig.config.language === 'fr' ? 'french' :
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      difficulty: gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'normal',
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId
    };

    return (
      <div className="min-h-screen">
        <DetectiveListeningGameWrapper
          settings={gameSettings}
          onBackToMenu={handleBackToMenu}
          onGameEnd={(result) => {
            console.log('Detective Listening ended:', result);
            if (assignmentId) {
              setTimeout(() => {
                router.push('/student-dashboard/assignments');
              }, 3000);
            }
          }}
          assignmentId={assignmentId}
          userId={user?.id}
        />
      </div>
    );
  }

  // Fallback
  return null;
}


