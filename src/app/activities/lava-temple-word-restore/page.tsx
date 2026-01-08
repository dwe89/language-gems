'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import LavaTempleWordRestoreGameWrapper from './components/LavaTempleWordRestoreGameWrapper';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import { useAuth } from '../../../components/auth/AuthProvider';
import { GameConfig } from './components/LavaTempleWordRestoreGame';

export default function LavaTempleWordRestorePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Option B: Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Load assignment data if in assignment mode (hook must be called unconditionally)
  // filterOutstanding=true filters out mastered words (accuracy ≥ 80% AND encounters ≥ 3)
  const { assignment, vocabulary: assignmentVocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'lava-temple-word-restore', true);

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  // Build assignment JSX after all hooks
  let assignmentJSX: JSX.Element | null = null;

  if (isAssignmentMode) {
    if (!user) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-xl">Please log in to access this assignment</div>
        </div>
      );
    } else if (assignmentLoading) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-xl">Loading assignment...</div>
        </div>
      );
    } else if (assignmentError || !assignmentVocabulary || assignmentVocabulary.length === 0) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-xl">Error loading assignment: {assignmentError || 'No vocabulary found'}</div>
        </div>
      );
    } else {
      // Extract sentence config from game_config
      const gameConfig = assignment?.game_config?.gameConfig || assignment?.game_config || {};
      const sentenceConfig = gameConfig.sentenceConfig || {};

      // Map sentence config to legacy game config format
      let category = 'basics_core_language';
      let subcategory = undefined;

      if (sentenceConfig.source === 'topic' && sentenceConfig.topic) {
        const topicToCategoryMap: Record<string, string> = {
          'family_friends': 'identity_personal_life',
          'relationships': 'identity_personal_life',
          'personal_details': 'identity_personal_life',
          'hobbies_interests': 'identity_personal_life',
          'food_drink': 'basics_core_language',
          'shopping': 'basics_core_language',
          'travel': 'basics_core_language',
          'school_work': 'education_work',
          'future_plans': 'education_work',
          'technology': 'modern_life',
          'environment': 'modern_life'
        };

        category = topicToCategoryMap[sentenceConfig.topic] || 'basics_core_language';
        subcategory = sentenceConfig.topic;
      } else if (sentenceConfig.source === 'theme' && sentenceConfig.theme) {
        category = sentenceConfig.theme;
        subcategory = undefined;
      }

      const legacyGameConfig: GameConfig = {
        language: (assignment?.vocabulary_criteria?.language || 'spanish') as 'spanish' | 'french' | 'german',
        category,
        subcategory,
        difficulty: sentenceConfig.difficulty || 'beginner'
      };

      assignmentJSX = (
        <LavaTempleWordRestoreGameWrapper
          gameConfig={legacyGameConfig}
          onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
          onGameEnd={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
          assignmentId={assignmentId!}
          userId={user.id}
          isAssignmentMode={true}
        />
      );
    }
  }

  // Return assignment JSX if in assignment mode
  if (assignmentJSX) {
    return assignmentJSX;
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    // Convert unified config to legacy game config format
    const legacyGameConfig: GameConfig = {
      language: config.language === 'es' ? 'spanish' :
                config.language === 'fr' ? 'french' :
                config.language === 'de' ? 'german' : 'spanish',
      category: config.categoryId || 'general',
      subcategory: config.subcategoryId || 'general',
      difficulty: 'beginner' // Default difficulty
    };
    
    setGameConfig(legacyGameConfig);
    setGameStarted(true);
    
    console.log('Lava Temple Word Restore started with config:', legacyGameConfig);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
    router.push('/games');
  };

  const handleBackToLauncher = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Handle game end
  const handleGameEnd = (result: any) => {
    console.log('Game ended:', result);

    // If in assignment mode, redirect back to assignments
    if (assignmentId) {
      setTimeout(() => {
        router.push('/student-dashboard/assignments');
      }, 3000);
    }
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Lava Temple Word Restore"
        gameDescription="Restore ancient vocabulary words in the mystical lava temple"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Custom vocab not yet supported - needs sentence database integration
        minVocabularyRequired={5}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
        gameCompatibility={{
          supportsVocabulary: true,
          supportsSentences: true,
          supportsMixed: false,
          minItems: 5,
          maxItems: 50
        }}
        preferredContentType="sentences"
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Explore the ancient lava temple</p>
            <p>• Restore broken sentences and vocabulary</p>
            <p>• Navigate through challenging puzzles</p>
            <p>• Collect treasures and ancient knowledge</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    return (
      <div className="w-full h-screen">
        <LavaTempleWordRestoreGameWrapper
          gameConfig={gameConfig}
          onBackToMenu={handleBackToLauncher}
          onGameEnd={handleGameEnd}
          assignmentId={assignmentId}
          userId={user?.id}
        />
      </div>
    );
  }

  // Fallback - shouldn't reach here
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Lava Temple Word Restore</h1>
        <p className="mb-4">Something went wrong. Please try again.</p>
        <button 
          onClick={() => router.push('/games')}
          className="inline-block px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
}
