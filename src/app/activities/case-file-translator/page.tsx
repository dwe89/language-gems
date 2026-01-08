'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import { UnifiedSelectionConfig } from '../../../hooks/useUnifiedVocabulary';
import CaseFileTranslatorGameWrapper from './components/CaseFileTranslatorGameWrapper';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import Link from 'next/link';

export default function CaseFileTranslatorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Option B: Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Load assignment data if in assignment mode (hook must be called unconditionally)
  // filterOutstanding=true filters out mastered words (accuracy ≥ 80% AND encounters ≥ 3)
  const { assignment, vocabulary: assignmentVocabulary, sentences: assignmentSentences, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'case-file-translator', true);

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from sentence selector
  const [gameConfig, setGameConfig] = useState<SentenceSelectionConfig | null>(null);

  // Config panel state
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const handleSelectionComplete = (config: SentenceSelectionConfig) => {
    console.log('Case File Translator starting with config:', config);
    setGameConfig(config);
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  // Convert SentenceSelectionConfig to UnifiedSelectionConfig for the config panel
  const convertToUnifiedConfig = (sentenceConfig: SentenceSelectionConfig): UnifiedSelectionConfig => {
    return {
      language: sentenceConfig.language,
      curriculumLevel: sentenceConfig.curriculumLevel,
      categoryId: sentenceConfig.categoryId,
      subcategoryId: sentenceConfig.subcategoryId
    };
  };

  // Convert UnifiedSelectionConfig back to SentenceSelectionConfig
  const convertFromUnifiedConfig = (unifiedConfig: UnifiedSelectionConfig): SentenceSelectionConfig => {
    return {
      language: unifiedConfig.language,
      curriculumLevel: unifiedConfig.curriculumLevel,
      categoryId: unifiedConfig.categoryId,
      subcategoryId: unifiedConfig.subcategoryId
    };
  };

  const handleConfigChange = (newConfig: UnifiedSelectionConfig, vocabulary: any[], theme?: string) => {
    const sentenceConfig = convertFromUnifiedConfig(newConfig);
    setGameConfig(sentenceConfig);

    console.log('Case File Translator config changed:', {
      newConfig,
      sentenceConfig,
      theme
    });
  };

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
    } else if (assignmentError || (!assignmentVocabulary || assignmentVocabulary.length === 0) && (!assignmentSentences || assignmentSentences.length === 0)) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-xl">Error loading assignment: {assignmentError || 'No content found'}</div>
        </div>
      );
    } else {
      // Extract sentence config from game_config
      const gameConfig = assignment?.game_config?.gameConfig || assignment?.game_config || {};
      const sentenceConfig = gameConfig.sentenceConfig || {};

      // Map sentence config to legacy settings format
      let caseType = 'basics_core_language';
      let subcategory = 'common_phrases';

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

        caseType = topicToCategoryMap[sentenceConfig.topic] || 'basics_core_language';
        subcategory = sentenceConfig.topic;
      } else if (sentenceConfig.source === 'theme' && sentenceConfig.theme) {
        caseType = sentenceConfig.theme;
        subcategory = undefined;
      }

      const legacySettings = {
        caseType,
        language: assignment?.vocabulary_criteria?.language || 'spanish',
        curriculumLevel: (assignment?.curriculum_level as string) || 'KS3',
        subcategory,
        difficulty: sentenceConfig.difficulty || 'intermediate',
        examBoard: assignment?.exam_board as 'AQA' | 'edexcel',
        tier: assignment?.tier as 'foundation' | 'higher'
      };

      assignmentJSX = (
        <div className="min-h-screen">
          <CaseFileTranslatorGameWrapper
            settings={legacySettings}
            onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
            onGameEnd={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
            assignmentId={assignmentId!}
            userId={user.id}
            isAssignmentMode={true}
            onOpenSettings={handleOpenConfigPanel}
          />
        </div>
      );
    }
  }

  // Return assignment JSX if in assignment mode
  if (assignmentJSX) {
    return assignmentJSX;
  }

  // Show sentence category selector if game not started
  if (!gameStarted) {
    return (
      <UnifiedSentenceCategorySelector
        gameName="Case File Translator"
        title="Case File Translator - Select Content"
        supportedLanguages={['spanish', 'french', 'german']}
        showCustomMode={false} // Uses pre-generated sentence database
        onSelectionComplete={handleSelectionComplete}
        onBack={() => router.push('/games')}
      />
    );
  }

  // Game started - show the actual game
  if (gameConfig) {
    // Convert sentence config to legacy settings format
    const legacySettings = {
      caseType: gameConfig.categoryId,
      language: gameConfig.language,
      curriculumLevel: gameConfig.curriculumLevel,
      subcategory: gameConfig.subcategoryId,
      difficulty: 'beginner' // Default difficulty
    };

    return (
      <>
        <div className="min-h-screen">
          <CaseFileTranslatorGameWrapper
            settings={legacySettings}
            onBackToMenu={handleBackToMenu}
            onGameEnd={(result) => {
              console.log('Case File Translator ended:', result);
              if (assignmentId) {
                setTimeout(() => {
                  router.push('/student-dashboard/assignments');
                }, 3000);
              }
            }}
            assignmentId={assignmentId}
            userId={user?.id}
            onOpenSettings={handleOpenConfigPanel}
          />
        </div>

        {/* In-game configuration panel */}
        {gameConfig && (
          <InGameConfigPanel
            currentConfig={convertToUnifiedConfig(gameConfig)}
            onConfigChange={handleConfigChange}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={false}
            currentTheme="default"
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
            gameType="sentence"
          />
        )}
      </>
    );
  }

  // Fallback
  return null;
}
