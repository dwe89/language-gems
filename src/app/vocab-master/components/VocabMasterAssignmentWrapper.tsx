'use client';

import React, { useState } from 'react';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import GameAssignmentWrapper, { GameProgress } from '../../../components/games/templates/GameAssignmentWrapper';
import { VocabMasterGameEngine } from './VocabMasterGameEngine';
import { VocabularyWord, GameResult } from '../types';
import VocabMasterAssignmentLauncher from './VocabMasterAssignmentLauncher';
import { GameCompletionScreen } from './GameCompletionScreen';

interface VocabMasterAssignmentWrapperProps {
  assignmentId: string;
  onAssignmentComplete: () => void;
  onBackToAssignments: () => void;
  onBackToMenu: () => void;
}

// Helper function to calculate standardized score
function calculateStandardScore(
  correctAnswers: number,
  totalWords: number,
  timeSpent: number,
  baseScore: number
): { score: number; accuracy: number; maxScore: number } {
  const accuracy = totalWords > 0 ? (correctAnswers / totalWords) * 100 : 0;
  const maxScore = totalWords * 100;
  
  // Base score calculation
  let score = correctAnswers * 100;
  
  // Time bonus (faster completion gets bonus points)
  const averageTimePerWord = timeSpent / totalWords;
  if (averageTimePerWord < 5) { // Less than 5 seconds per word
    score += Math.floor(score * 0.2); // 20% bonus
  } else if (averageTimePerWord < 10) { // Less than 10 seconds per word
    score += Math.floor(score * 0.1); // 10% bonus
  }
  
  return {
    score: Math.min(score, maxScore),
    accuracy: Math.round(accuracy),
    maxScore
  };
}

export default function VocabMasterAssignmentWrapper({
  assignmentId,
  onAssignmentComplete,
  onBackToAssignments,
  onBackToMenu
}: VocabMasterAssignmentWrapperProps) {
  const { user } = useUnifiedAuth();

  // Game state management
  const [gameState, setGameState] = useState<'launcher' | 'playing' | 'complete'>('launcher');
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [gameResults, setGameResults] = useState<GameResult | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to access assignments.</p>
        </div>
      </div>
    );
  }

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('VocabMaster assignment completed:', progress);
    onAssignmentComplete();
  };

  const handleBackToAssignments = () => {
    console.log('Returning to assignments from VocabMaster');
    onBackToAssignments();
  };

  const handleBackToMenu = () => {
    console.log('Returning to VocabMaster menu from assignment');
    onBackToMenu();
  };

  const handleModeSelect = (modeId: string) => {
    console.log('Mode selected:', modeId);
    setSelectedMode(modeId);
    setGameState('playing');
  };

  const handleBackToLauncher = () => {
    setGameState('launcher');
    setSelectedMode('');
  };

  return (
    <GameAssignmentWrapper
      assignmentId={assignmentId}
      gameId="vocab-master"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete, gameSessionId, onOpenSettings, toggleMusic, isMusicEnabled }) => {
        console.log('VocabMaster Assignment - Vocabulary loaded:', vocabulary.length, 'items');

        // Transform vocabulary to the format expected by VocabMasterGameEngine
        const gameVocabulary: VocabularyWord[] = vocabulary.map(item => ({
          id: item.id,
          word: item.word,           // Spanish word
          spanish: item.word,        // Spanish word
          english: item.translation, // English translation
          translation: item.translation,
          part_of_speech: item.part_of_speech,
          audio_url: item.audio_url,
          example_sentence: undefined, // Not provided in assignment vocabulary
          example_translation: undefined,
          mastery_level: 0,
          startTime: Date.now()
        }));

        // Show launcher first, then game
        if (gameState === 'launcher') {
          return (
            <VocabMasterAssignmentLauncher
              vocabulary={gameVocabulary}
              assignmentTitle={assignment.title}
              onModeSelect={handleModeSelect}
              onBack={handleBackToAssignments}
              isAssessmentMode={true}
            />
          );
        }

        // Show the selected game mode
        return (
          <VocabMasterGameEngine
            config={{
              mode: selectedMode, // Use the selected mode instead of hardcoded 'learn_new'
              vocabulary: gameVocabulary,
              audioEnabled: true,
              assignmentMode: true,
              assignmentTitle: assignment.title,
              assignmentId: assignment.id,
              gameSessionId: gameSessionId,
              userId: user.id
            }}
            onGameComplete={(results: GameResult) => {
              console.log('VocabMaster game completed with results:', results);

              // Calculate standardized score
              const { score, accuracy, maxScore } = calculateStandardScore(
                results.correctAnswers,
                results.totalWords,
                results.timeSpent,
                results.score
              );

              // Update progress during the game
              onProgressUpdate({
                wordsCompleted: results.correctAnswers,
                totalWords: results.totalWords,
                score,
                maxScore,
                accuracy,
                timeSpent: results.timeSpent
              });

              // Complete the assignment
              onGameComplete({
                assignmentId: assignment.id,
                gameId: 'vocab-master',
                studentId: user.id,
                wordsCompleted: results.correctAnswers,
                totalWords: results.totalWords,
                score,
                maxScore,
                accuracy,
                timeSpent: results.timeSpent,
                completedAt: new Date(),
                sessionData: {
                  ...results,
                  gemsCollected: results.gemsCollected,
                  maxStreak: results.maxStreak,
                  wordsLearned: results.wordsLearned,
                  wordsStruggling: results.wordsStruggling,
                  gameMode: 'assignment'
                }
              });

              // Show completion screen
              setGameResults(results);
              setGameState('complete');
            }}
            onExit={handleBackToLauncher}
          />
        );

        // Show completion screen
        if (gameState === 'complete' && gameResults) {
          return (
            <GameCompletionScreen
              result={gameResults}
              isAssignmentMode={true}
              onPlayAgain={() => {
                // Reset to launcher to start a new game
                setGameState('launcher');
                setGameResults(null);
                setSelectedMode('');
              }}
              onBackToMenu={handleBackToAssignments}
            />
          );
        }

        return null;
      }}
    </GameAssignmentWrapper>
  );
}
