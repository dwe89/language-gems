'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import SpeedBuilderGameWrapper from './components/SpeedBuilderGameWrapper';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';

export default function SpeedBuilderPage() {
  const { user } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Option B: Early assignment mode detection
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Load assignment data if in assignment mode (hook must be called unconditionally)
  const { assignment, vocabulary: assignmentVocabulary, sentences: assignmentSentences, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'speed-builder');

  // Game state management - ALWAYS initialize hooks first
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SentenceSelectionConfig | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

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
      // Extract sentence config from assignment's game_config
      const gameConfig = assignment?.game_config?.gameConfig || assignment?.game_config || {};
      const sentenceConfig = gameConfig.sentenceConfig || {};

      // Map language codes to full language names
      const languageMap: Record<string, string> = {
        'es': 'spanish',
        'fr': 'french',
        'de': 'german'
      };

      // Get language from sentenceConfig or vocabularyConfig, then map it
      const rawLanguage = gameConfig.vocabularyConfig?.language || assignment?.vocabulary_criteria?.language || 'es';
      const mappedLanguage = languageMap[rawLanguage] || rawLanguage;

      // Use sentenceConfig.theme as the category (like Lava Temple)
      const category = sentenceConfig.theme || assignment?.vocabulary_criteria?.category || 'basics_core_language';

      const assignmentConfig: SentenceSelectionConfig = {
        language: mappedLanguage,
        curriculumLevel: assignment?.curriculum_level || 'KS3',
        categoryId: category,
        subcategoryId: sentenceConfig.topic || assignment?.vocabulary_criteria?.subcategory || '',
        wordCount: sentenceConfig.sentenceCount || 20
      };

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

      const legacyTier = assignmentConfig.curriculumLevel === 'KS4' ? 'Foundation' : 'Higher';
      const legacyTheme = categoryToThemeMapping[assignmentConfig.categoryId] || 'People and lifestyle';
      const legacyTopic = subcategoryToTopicMapping[assignmentConfig.subcategoryId || ''] || 'Identity and relationships';

      assignmentJSX = (
        <div className="min-h-screen">
          <SpeedBuilderGameWrapper
            tier={legacyTier}
            theme={legacyTheme}
            topic={legacyTopic}
            onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
            assignmentId={assignmentId!}
            userId={user.id}
            isAssignmentMode={true}
            sentenceConfig={assignmentConfig}
            onOpenSettings={() => {}}
            onGameEnd={() => {
              // Don't auto-redirect - let user choose via completion modal
              console.log('Speed Builder game ended');
            }}
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
