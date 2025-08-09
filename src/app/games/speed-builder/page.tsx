'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import SpeedBuilderGameWrapper from './components/SpeedBuilderGameWrapper';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';

export default function SpeedBuilderPage() {
  const { user } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SentenceSelectionConfig | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Assignment mode handlers
  const handleAssignmentComplete = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  // Handle selection complete from sentence selector
  const handleSelectionComplete = (config: SentenceSelectionConfig) => {
    setSelectedConfig(config);
    setGameStarted(true);

    console.log('Speed Builder started with sentence config:', config);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedConfig(null);
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: SentenceSelectionConfig) => {
    console.log('🔄 Updating game configuration:', newConfig);
    setSelectedConfig(newConfig);
    setShowConfigPanel(false);
  };

  // Assignment mode: wrap with GameAssignmentWrapper
  if (assignmentId && mode === 'assignment' && user) {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="speed-builder"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={() => router.push('/games/speed-builder')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Convert assignment vocabulary to sentence config format
          const assignmentConfig: SentenceSelectionConfig = {
            language: assignment.vocabulary_selection?.language || 'spanish',
            curriculumLevel: assignment.vocabulary_selection?.curriculum_level || 'KS3',
            categoryId: assignment.vocabulary_selection?.category || 'basics_core_language',
            subcategoryId: assignment.vocabulary_selection?.subcategory || 'greetings_introductions',
            wordCount: assignment.vocabulary_selection?.word_count || 20
          };

          // Map sentence categories to Speed Builder themes
          const categoryToThemeMapping: { [key: string]: string } = {
            'basics_core_language': 'People and lifestyle',
            'identity_personal_life': 'People and lifestyle',
            'home_local_area': 'Communication and the world around us',
            'free_time_leisure': 'Popular culture',
            'food_drink': 'People and lifestyle',
            'clothes_shopping': 'People and lifestyle',
            'technology_media': 'Popular culture',
            'health_lifestyle': 'People and lifestyle',
            'holidays_travel_culture': 'Communication and the world around us',
            'nature_environment': 'Communication and the world around us',
            'social_global_issues': 'Communication and the world around us',
            'general_concepts': 'People and lifestyle',
            'daily_life': 'People and lifestyle',
            'school_jobs_future': 'People and lifestyle'
          };

          const subcategoryToTopicMapping: { [key: string]: string } = {
            'greetings_introductions': 'Identity and relationships',
            'family_friends': 'Identity and relationships',
            'personal_information': 'Identity and relationships',
            'daily_routine': 'Daily life',
            'food_drink_vocabulary': 'Food and eating',
            'meals': 'Food and eating',
            'hobbies_interests': 'Free time activities',
            'sports_ball_games': 'Free time activities',
            'school_subjects': 'School',
            'professions_jobs': 'Future Aspirations, Study and Work',
            'places_in_town': 'Local Area, Holiday and Travel',
            'transport': 'Local Area, Holiday and Travel',
            'countries': 'Local Area, Holiday and Travel',
            'weathers': 'Local Area, Holiday and Travel'
          };

          const legacyCurriculumType = assignmentConfig.curriculumLevel === 'KS4' ? 'gcse' : 'ks3';
          const legacyTier = assignmentConfig.curriculumLevel === 'KS4' ? 'Foundation' : 'Higher';
          const legacyTheme = categoryToThemeMapping[assignmentConfig.categoryId] || 'People and lifestyle';
          const legacyTopic = subcategoryToTopicMapping[assignmentConfig.subcategoryId || ''] || 'Identity and relationships';

          return (
            <div className="min-h-screen">
              <SpeedBuilderGameWrapper
                tier={legacyTier}
                theme={legacyTheme}
                topic={legacyTopic}
                onBackToMenu={() => router.push('/games/speed-builder')}
                assignmentId={assignmentId}
                userId={user.id}
                sentenceConfig={assignmentConfig}
                onOpenSettings={() => {}}
                onGameEnd={(result) => {
                  console.log('Speed Builder assignment ended:', result);
                  onGameComplete();
                }}
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
        gameName="Sentence Sprint"
        title="Sentence Sprint - Select Content"
        supportedLanguages={['spanish', 'french', 'german']}
        showCustomMode={false} // Speed Builder uses sentence data, not vocabulary
        onSelectionComplete={handleSelectionComplete}
        onBack={() => router.push('/games')}
      />
    );
  }

  // Show full GemSpeedBuilder with all original features
  if (gameStarted && selectedConfig) {
    // Convert sentence config to legacy speed builder format
    const legacyLanguage = selectedConfig.language; // Already in full form (spanish, french, german)

    const legacyCurriculumType = selectedConfig.curriculumLevel === 'KS4' ? 'gcse' : 'ks3';
    const legacyTier = selectedConfig.curriculumLevel === 'KS4' ? 'Foundation' : 'Higher';

    // Map sentence categories to Speed Builder themes
    const categoryToThemeMapping: { [key: string]: string } = {
      'basics_core_language': 'People and lifestyle',
      'identity_personal_life': 'People and lifestyle',
      'home_local_area': 'Communication and the world around us',
      'free_time_leisure': 'Popular culture',
      'food_drink': 'People and lifestyle',
      'clothes_shopping': 'People and lifestyle',
      'technology_media': 'Popular culture',
      'health_lifestyle': 'People and lifestyle',
      'holidays_travel_culture': 'Communication and the world around us',
      'nature_environment': 'Communication and the world around us',
      'social_global_issues': 'Communication and the world around us',
      'general_concepts': 'People and lifestyle',
      'daily_life': 'People and lifestyle',
      'school_jobs_future': 'People and lifestyle'
    };

    // Map subcategories to Speed Builder topics
    const subcategoryToTopicMapping: { [key: string]: string } = {
      'greetings_introductions': 'Identity and relationships',
      'family_friends': 'Identity and relationships',
      'personal_information': 'Identity and relationships',
      'daily_routine': 'Daily life',
      'food_drink_vocabulary': 'Food and eating',
      'meals': 'Food and eating',
      'hobbies_interests': 'Free time activities',
      'sports_ball_games': 'Free time activities',
      'school_subjects': 'School',
      'professions_jobs': 'Future Aspirations, Study and Work',
      'places_in_town': 'Local Area, Holiday and Travel',
      'transport': 'Local Area, Holiday and Travel',
      'countries': 'Local Area, Holiday and Travel',
      'weathers': 'Local Area, Holiday and Travel'
    };

    const legacyTheme = categoryToThemeMapping[selectedConfig.categoryId] || 'People and lifestyle';
    const legacyTopic = subcategoryToTopicMapping[selectedConfig.subcategoryId || ''] || 'Identity and relationships';

    return (
      <div className="min-h-screen">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
          >
            <svg className="h-5 w-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Back to Games
          </button>
        </div>

        <SpeedBuilderGameWrapper
          tier={legacyTier}
          theme={legacyTheme}
          topic={legacyTopic}
          onBackToMenu={handleBackToMenu}
          assignmentId={assignmentId || undefined}
          userId={user?.id}
          sentenceConfig={selectedConfig}
          onOpenSettings={handleOpenConfigPanel}
          onGameEnd={(result) => {
            console.log('Speed Builder ended:', result);
            // Could add navigation logic here if needed
          }}
        />

        {/* In-game configuration panel */}
        {selectedConfig && (
          <InGameConfigPanel
            currentConfig={selectedConfig as any}
            onConfigChange={handleConfigChange as any}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={false}
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
          />
        )}
      </div>
    );
  }

  // Fallback
  return null;
}
