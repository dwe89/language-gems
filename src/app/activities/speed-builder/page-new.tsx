'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import SpeedBuilderGameWrapper from './components/SpeedBuilderGameWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';

export default function SpeedBuilderPage() {
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
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // If assignment mode, use GameAssignmentWrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="speed-builder"
        studentId={user?.id}
        onAssignmentComplete={(progress) => {
          console.log('Speed Builder assignment completed:', progress);
          router.push('/student-dashboard');
        }}
        onBackToAssignments={() => router.push('/student-dashboard')}
        onBackToMenu={() => router.push('/games/speed-builder')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Convert assignment vocabulary to Speed Builder format
          const speedBuilderVocabulary = vocabulary.map(item => ({
            id: item.id,
            word: item.word,
            translation: item.translation,
            language: item.language || assignment.vocabulary_criteria?.language || 'spanish',
            category: item.category || 'general',
            subcategory: item.subcategory || 'general',
            part_of_speech: item.part_of_speech,
            example_sentence_original: item.example_sentence_original,
            example_sentence_translation: item.example_sentence_translation
          }));

          const speedBuilderSettings = {
            difficulty: 'medium',
            category: assignment.vocabulary_criteria?.category || 'general',
            language: assignment.vocabulary_criteria?.language || 'spanish',
            timeLimit: 120,
            // Add other settings as needed
          };

          return (
            <SpeedBuilderGameWrapper
              settings={speedBuilderSettings}
              vocabulary={speedBuilderVocabulary}
              onBackToMenu={() => router.push('/games/speed-builder')}
              onGameEnd={(result) => {
                console.log('Speed Builder game ended:', result);
                onGameComplete({
                  game_score: result.score || 0,
                  accuracy_percentage: result.accuracy || 0,
                  time_spent_seconds: result.timeSpent || 0,
                  questions_answered: result.totalQuestions || 0,
                  questions_correct: result.correctAnswers || 0,
                  completion_status: 'completed',
                  game_data: result
                });
              }}
              assignmentId={assignmentId}
              userId={user?.id}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

  // Transform unified vocabulary to speed builder format
  const transformVocabularyForSpeedBuilder = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      example_sentence_original: item.example_sentence_original,
      example_sentence_translation: item.example_sentence_translation
    }));
  };

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    const transformedVocabulary = transformVocabularyForSpeedBuilder(vocabulary);
    
    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'default'
    });
    
    setGameStarted(true);
    
    console.log('Speed Builder started with:', {
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
    score?: number; 
    accuracy?: number; 
    timeSpent?: number; 
    totalQuestions?: number; 
    correctAnswers?: number; 
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

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Speed Builder...</p>
        </div>
      </div>
    );
  }

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Speed Builder"
        gameDescription="Build vocabulary knowledge by racing against time"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={5} // Need at least 5 words for meaningful speed building
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        defaultTheme="default"
        requiresAudio={false}
        gameCompatibility={{
          supportsVocabulary: true,
          supportsSentences: false,
          supportsMixed: false,
          minItems: 5,
          maxItems: 200
        }}
        preferredContentType="vocabulary"
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Race against time to build vocabulary knowledge</p>
            <p>• Answer questions quickly for higher scores</p>
            <p>• Use custom vocabulary for personalized practice</p>
            <p>• Track your progress and accuracy</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy speed builder settings format
    const legacySettings = {
      difficulty: 'medium', // Default difficulty
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId,
      language: gameConfig.config.language === 'es' ? 'spanish' : 
                gameConfig.config.language === 'fr' ? 'french' : 
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      timeLimit: 120,
      playerName: user?.user_metadata?.full_name || 'Player'
    };

    return (
      <div className="w-full h-screen">
        <SpeedBuilderGameWrapper
          settings={legacySettings}
          vocabulary={gameConfig.vocabulary} // Pass the custom vocabulary
          onBackToMenu={handleBackToMenu}
          onGameEnd={handleGameEnd}
          assignmentId={assignmentId}
          userId={user?.id}
          onOpenSettings={handleOpenConfigPanel}
        />

        {/* Config Panel */}
        {showConfigPanel && (
          <InGameConfigPanel
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
            currentSettings={legacySettings}
            onSettingsChange={(newSettings) => {
              // Handle settings change if needed
              console.log('Settings changed:', newSettings);
            }}
            gameName="Speed Builder"
          />
        )}
      </div>
    );
  }

  // Fallback
  return null;
}
