'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import { UnifiedSelectionConfig } from '../../../hooks/useUnifiedVocabulary';
import CaseFileTranslatorGameWrapper from './components/CaseFileTranslatorGameWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import Link from 'next/link';

export default function CaseFileTranslatorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

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

  // If assignment mode, use GameAssignmentWrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="case-file-translator"
        studentId={user?.id}
        onAssignmentComplete={(progress) => {
          console.log('Case File Translator assignment completed:', progress);
          router.push('/student-dashboard');
        }}
        onBackToAssignments={() => router.push('/student-dashboard')}
        onBackToMenu={() => router.push('/games/case-file-translator')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          const handleGameComplete = (gameResult: any) => {
            // Calculate standardized progress metrics
            const wordsCompleted = gameResult.correctAnswers || 0;
            const totalWords = gameResult.totalQuestions || vocabulary.length;
            const score = gameResult.score || 0;
            const accuracy = gameResult.accuracy || 0;

            // Update progress
            onProgressUpdate({
              wordsCompleted,
              totalWords,
              score,
              maxScore: totalWords * 100, // 100 points per word
              accuracy
            });

            // Complete assignment
            onGameComplete({
              assignmentId: assignment.id,
              gameId: 'case-file-translator',
              studentId: user?.id || '',
              wordsCompleted,
              totalWords,
              score,
              maxScore: totalWords * 100,
              accuracy,
              timeSpent: gameResult.timeSpent || 0,
              completedAt: new Date(),
              sessionData: gameResult
            });
          };

          const handleBackToAssignments = () => {
            router.push('/student-dashboard');
          };

          // For sentence-based games like Case File Translator, we use the assignment's sentence configuration
          // Extract sentence config from game_config
          const gameConfig = assignment.game_config?.gameConfig || assignment.game_config || {};
          const sentenceConfig = gameConfig.sentenceConfig || {};

          // Map sentence config to legacy settings format
          let caseType = 'basics_core_language'; // Default category
          let subcategory = 'common_phrases'; // Default subcategory

          if (sentenceConfig.source === 'topic' && sentenceConfig.topic) {
            // Map topics to their correct categories based on database structure
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
            // For theme-based selection, use theme as category
            caseType = sentenceConfig.theme;
            subcategory = undefined;
          }

          const legacySettings = {
            caseType,
            language: assignment.vocabulary_criteria?.language || 'spanish',
            curriculumLevel: (assignment.curriculum_level as string) || 'KS3',
            subcategory,
            difficulty: sentenceConfig.difficulty || 'intermediate',
            // KS4-specific parameters
            examBoard: assignment.exam_board as 'AQA' | 'edexcel',
            tier: assignment.tier as 'foundation' | 'higher'
          };

          console.log('🎯 Case File Translator assignment settings:', {
            originalSentenceConfig: sentenceConfig,
            mappedSettings: legacySettings,
            assignmentId: assignment.id
          });

          return (
            <div className="min-h-screen">
              <CaseFileTranslatorGameWrapper
                settings={legacySettings}
                onBackToMenu={handleBackToAssignments}
                onGameEnd={handleGameComplete}
                assignmentId={assignment.id}
                userId={user?.id}
                onOpenSettings={handleOpenConfigPanel}
              />
            </div>
          );
        }}
      </GameAssignmentWrapper>
    );
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
