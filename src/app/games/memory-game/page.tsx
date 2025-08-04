'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import MemoryGameMain from './components/MemoryGameMain';
import { WordPair } from './components/CustomWordsModal';
import GameAssignmentWrapper, {
  StandardVocabularyItem,
  AssignmentData,
  GameProgress,
  calculateStandardScore
} from '../../../components/games/templates/GameAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { useGameAudio } from '../../../hooks/useGlobalAudioContext';
import './styles.css';

export default function UnifiedMemoryGamePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Game state management - ALWAYS initialize hooks first
  const [gameStarted, setGameStarted] = useState(false);
  const [customWords, setCustomWords] = useState<WordPair[]>([]);

  // Initialize audio for assignment mode compatibility
  const audioManager = useGameAudio(true);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Assignment mode helper functions
  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Memory Game assignment completed:', progress);
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  // If assignment mode, render assignment wrapper (after all hooks are initialized)
  if (assignmentId && mode === 'assignment') {
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="memory-game"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={() => router.push('/games/memory-game')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Transform vocabulary to WordPair format for Memory Game
          const wordPairs: WordPair[] = vocabulary.map((vocab: StandardVocabularyItem) => ({
            id: vocab.id,
            term: vocab.word,
            translation: vocab.translation,
            type: 'word' as const,
            category: vocab.category,
            subcategory: vocab.subcategory
          }));

          console.log('Memory Game Assignment - Vocabulary loaded:', vocabulary.length, 'items');
          console.log('Memory Game Assignment - Word pairs:', wordPairs);

          return (
            <MemoryGameMain
              language={vocabulary[0]?.language || "spanish"}
              topic="Assignment"
              difficulty="medium"
              onBackToSettings={() => router.push('/games/memory-game')}
              customWords={wordPairs}
              isAssignmentMode={true}
              assignmentTitle={assignment.title}
              assignmentId={assignmentId}
              userId={user.id}
              audioManager={audioManager}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

  // Transform unified vocabulary to memory game format
  const transformVocabularyForMemoryGame = (vocabulary: UnifiedVocabularyItem[]): WordPair[] => {
    return vocabulary.map(item => ({
      id: item.id,
      term: item.word,
      translation: item.translation,
      type: 'word' as const,
      category: item.category || 'general',
      subcategory: item.subcategory
    }));
  };

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    if (config.customMode && vocabulary.length > 0) {
      // For custom mode, convert vocabulary to WordPair format
      const customWordPairs = transformVocabularyForMemoryGame(vocabulary);
      setCustomWords(customWordPairs);
    }
    
    setGameConfig({
      config,
      vocabulary
    });
    
    setGameStarted(true);
    
    console.log('Memory Game started with:', {
      config,
      vocabularyCount: vocabulary.length,
      customMode: config.customMode
    });
  };

  // Handle back to menu
  const handleBackToSettings = () => {
    // In assignment mode, don't allow going back to selector
    if (assignmentId) {
      window.history.back(); // Go back to previous page (likely dashboard)
      return;
    }
    setGameStarted(false);
    setGameConfig(null);
    setCustomWords([]);
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    console.log('🔄 Updating game configuration:', newConfig);
    const transformedVocabulary = transformVocabularyForMemoryGame(vocabulary);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary
    } : null);
    setCustomWords(transformedVocabulary);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Memory Match"
        gameDescription="Match vocabulary words with their translations by flipping cards"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1} // Can work with minimal vocabulary
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false} // Memory game doesn't have themes like hangman/tic-tac-toe
        requiresAudio={false}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Click cards to flip them and reveal words</p>
            <p>• Match vocabulary words with their translations</p>
            <p>• Find all pairs to complete the game</p>
            <p>• Try to complete with the fewest moves possible</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy memory game format
    const legacyLanguage = gameConfig.config.language === 'es' ? 'spanish' : 
                          gameConfig.config.language === 'fr' ? 'french' : 
                          gameConfig.config.language === 'de' ? 'german' : 'spanish';

    const legacyTopic = gameConfig.config.categoryId || 'general';
    const legacyDifficulty = gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'medium';

    return (
      <div className="memory-game-container">
        <MemoryGameMain
          language={legacyLanguage}
          topic={legacyTopic}
          difficulty={legacyDifficulty}
          onBackToSettings={handleBackToSettings}
          customWords={customWords.length > 0 ? customWords : undefined}
          isAssignmentMode={false}
          userId={user?.id}
          onOpenSettings={handleOpenConfigPanel}
          audioManager={audioManager}
        />

        {/* In-game configuration panel */}
        <InGameConfigPanel
          currentConfig={gameConfig.config}
          onConfigChange={handleConfigChange}
          supportedLanguages={['es', 'fr', 'de']}
          supportsThemes={false}
          isOpen={showConfigPanel}
          onClose={handleCloseConfigPanel}
        />
      </div>
    );
  }

  // Fallback
  return null;
}
