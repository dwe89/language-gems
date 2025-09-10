'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import CaseFileTranslatorGameWrapper from './components/CaseFileTranslatorGameWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import Link from 'next/link';

export default function CaseFileTranslatorPage() {
  const { user } = useAuth();
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
            console.log('Case File Translator assignment game completed:', gameResult);
            
            // Update progress with the game results
            onProgressUpdate({
              score: gameResult.score || 0,
              accuracy: gameResult.accuracy || 0,
              timeSpent: gameResult.timeSpent || 0,
              questionsAnswered: gameResult.totalQuestions || 0,
              questionsCorrect: gameResult.correctAnswers || 0
            });

            // Complete the assignment
            onGameComplete({
              game_score: gameResult.score || 0,
              accuracy_percentage: gameResult.accuracy || 0,
              time_spent_seconds: gameResult.timeSpent || 0,
              questions_answered: gameResult.totalQuestions || 0,
              questions_correct: gameResult.correctAnswers || 0,
              completion_status: 'completed',
              game_data: gameResult
            });
          };

          // Transform assignment vocabulary to case file translator format
          const caseFileVocabulary = vocabulary.map(item => ({
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

          const caseFileSettings = {
            difficulty: 'medium',
            category: assignment.vocabulary_criteria?.category || 'general',
            language: assignment.vocabulary_criteria?.language || 'spanish',
            theme: 'detective',
            // Add other settings as needed
          };

          return (
            <CaseFileTranslatorGameWrapper
              settings={caseFileSettings}
              vocabulary={caseFileVocabulary}
              onBackToMenu={() => router.push('/games/case-file-translator')}
              onGameEnd={handleGameComplete}
              assignmentId={assignmentId}
              userId={user?.id}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

  // Transform unified vocabulary to case file translator format
  const transformVocabularyForCaseFileTranslator = (vocabulary: UnifiedVocabularyItem[]) => {
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
    const transformedVocabulary = transformVocabularyForCaseFileTranslator(vocabulary);
    
    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'detective'
    });
    
    setGameStarted(true);
    
    console.log('Case File Translator started with:', {
      config,
      vocabularyCount: vocabulary.length,
      theme,
      transformedCount: transformedVocabulary.length
    });
  };

  const handleBackToMenu = () => {
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
        gameName="Case File Translator"
        gameDescription="Solve translation mysteries as a detective"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={5} // Need at least 5 words for case files
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={true}
        defaultTheme="detective"
        requiresAudio={false}
        gameCompatibility={{
          supportsVocabulary: true,
          supportsSentences: true,
          supportsMixed: true,
          minItems: 5,
          maxItems: 100
        }}
        preferredContentType="vocabulary"
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Examine case files and evidence</p>
            <p>• Translate clues to solve mysteries</p>
            <p>• Use custom vocabulary for personalized cases</p>
            <p>• Complete investigations to unlock rewards</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy case file translator settings format
    const caseFileSettings = {
      difficulty: 'medium', // Default difficulty
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId,
      language: gameConfig.config.language === 'es' ? 'spanish' : 
                gameConfig.config.language === 'fr' ? 'french' : 
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      theme: gameConfig.theme,
      curriculumLevel: gameConfig.config.curriculumLevel,
      examBoard: gameConfig.config.examBoard,
      tier: gameConfig.config.tier
    };

    return (
      <div className="w-full h-screen">
        <CaseFileTranslatorGameWrapper
          settings={caseFileSettings}
          vocabulary={gameConfig.vocabulary} // Pass the custom vocabulary
          onBackToMenu={handleBackToMenu}
          onGameEnd={handleGameEnd}
          assignmentId={assignmentId}
          userId={user?.id}
        />
      </div>
    );
  }

  // Fallback - shouldn't reach here
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Case File Translator</h1>
        <p className="mb-4">Something went wrong. Please try again.</p>
        <Link 
          href="/games" 
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Back to Games
        </Link>
      </div>
    </div>
  );
}
