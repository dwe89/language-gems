'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import SentenceTowersAssignmentWrapper from './components/SentenceTowersAssignmentWrapper';
import SentenceTowersMainGame from './components/SentenceTowersMainGame';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

export default function SentenceTowersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <SentenceTowersAssignmentWrapper assignmentId={assignmentId} />;
  }

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [vocabulary, setVocabulary] = useState<UnifiedVocabularyItem[]>([]);

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabularyItems: UnifiedVocabularyItem[]) => {
    setSelectedConfig(config);
    setVocabulary(vocabularyItems);
    setGameStarted(true);
    
    console.log('Sentence Towers started with unified config:', {
      config,
      vocabularyCount: vocabularyItems.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedConfig(null);
    setVocabulary([]);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Sentence Towers"
        gameDescription="Build towers by stacking vocabulary blocks"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={20}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Stack vocabulary blocks to build towers</p>
            <p>• Answer questions correctly to place blocks</p>
            <p>• Build higher towers for more points</p>
            <p>• Don't let your tower fall!</p>
            <p>• Use special blocks for bonus effects</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && selectedConfig && vocabulary.length > 0) {
    // Convert unified vocabulary to sentence towers format
    const transformedVocabulary = vocabulary.map(item => ({
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

        <SentenceTowersMainGame
          vocabulary={transformedVocabulary}
          language={selectedConfig.language === 'es' ? 'spanish' : 
                   selectedConfig.language === 'fr' ? 'french' : 
                   selectedConfig.language === 'de' ? 'german' : 'spanish'}
          category={selectedConfig.categoryId}
          subcategory={selectedConfig.subcategoryId}
          onBackToMenu={handleBackToMenu}
          onGameEnd={(result) => {
            console.log('Sentence Towers ended:', result);
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
