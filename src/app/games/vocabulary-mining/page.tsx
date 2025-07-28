'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import VocabularyMiningGame from './components/VocabularyMiningGame';
import VocabularyMiningAssignmentWrapper from './components/VocabMiningAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, useUnifiedVocabulary, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { generateGameStructuredData } from '../../../components/seo/GamePageSEO';

// Convert UnifiedVocabularyItem to VocabularyWord format expected by the game
const convertToVocabularyWord = (item: UnifiedVocabularyItem) => ({
  id: item.id,
  spanish: item.word,
  english: item.translation,
  theme: item.category || 'general',
  topic: item.subcategory || 'general',
  part_of_speech: item.part_of_speech || 'noun',
  example_sentence: item.example_sentence_original,
  example_translation: item.example_sentence_translation,
  audio_url: item.audio_url,
  times_seen: 0,
  times_correct: 0,
  last_seen: undefined,
  is_learned: false,
  mastery_level: 0,
  difficulty_rating: 1
});

export default function VocabularyMiningPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  const isPreview = searchParams?.get('preview') === 'true';

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [gameVocabulary, setGameVocabulary] = useState<any[]>([]);

  // Load vocabulary for the selected config when game starts
  const {
    vocabulary: loadedVocabulary,
    loading: vocabularyLoading,
    error: vocabularyError
  } = useUnifiedVocabulary({
    config: selectedConfig && gameStarted ? {
      language: selectedConfig.language,
      curriculumLevel: selectedConfig.curriculumLevel,
      categoryId: selectedConfig.categoryId,
      subcategoryId: selectedConfig.subcategoryId
    } : undefined,
    limit: 100,
    randomize: true
  });

  // Update game vocabulary when loaded vocabulary changes
  React.useEffect(() => {
    if (loadedVocabulary && loadedVocabulary.length > 0) {
      setGameVocabulary(loadedVocabulary.map(convertToVocabularyWord));
    }
  }, [loadedVocabulary]);

  // Generate structured data for the game
  const structuredData = generateGameStructuredData('vocabulary-mining') || undefined;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Games', url: '/games' },
    { name: 'Vocabulary Mining', url: '/games/vocabulary-mining' }
  ];

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <SEOWrapper structuredData={structuredData} breadcrumbs={breadcrumbs}>
        <VocabularyMiningAssignmentWrapper
          assignmentId={assignmentId}
          isPreview={isPreview}
        />
      </SEOWrapper>
    );
  }

  // Handle game start from unified launcher - go directly to game
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setSelectedConfig(config);
    setGameVocabulary(vocabulary.map(convertToVocabularyWord));
    setGameStarted(true);

    console.log('Vocabulary Mining started with unified config:', {
      config,
      vocabularyCount: vocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedConfig(null);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <SEOWrapper structuredData={structuredData} breadcrumbs={breadcrumbs}>
        <UnifiedGameLauncher
          gameName="Vocabulary Mining"
          gameDescription="Discover rare vocabulary gems through spaced repetition"
          supportedLanguages={['es', 'fr', 'de']}
          showCustomMode={false} // Vocabulary Mining uses its own spaced repetition system
          minVocabularyRequired={0} // Uses its own vocabulary loading
          onGameStart={handleGameStart}
          onBack={() => router.push('/games')}
          supportsThemes={false}
          requiresAudio={true}
        >
          {/* Game-specific instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
            <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
            <div className="text-white/80 text-sm space-y-2">
              <p>• Mine for vocabulary gems using spaced repetition</p>
              <p>• Track your learning progress and streaks</p>
              <p>• Collect different gem types as you master words</p>
              <p>• Complete daily goals and achievements</p>
              <p>• Listen to pronunciation and practice speaking</p>
            </div>
          </div>
        </UnifiedGameLauncher>
      </SEOWrapper>
    );
  }

  // Show vocabulary mining game directly with integrated learning modes
  if (gameStarted && selectedConfig) {
    return (
      <SEOWrapper structuredData={structuredData} breadcrumbs={breadcrumbs}>
        <VocabularyMiningGame
          mode="learn"
          vocabulary={gameVocabulary}
          config={{
            language: selectedConfig.language,
            curriculumLevel: selectedConfig.curriculumLevel,
            category: selectedConfig.categoryId,
            subcategory: selectedConfig.subcategoryId,
            showLearningModeSelector: true
          }}
          onExit={handleBackToMenu}
        />
      </SEOWrapper>
    );
  }

  // Fallback
  return null;
}
