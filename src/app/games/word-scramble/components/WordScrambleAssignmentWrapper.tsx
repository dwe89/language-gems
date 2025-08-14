// Word Scramble Assignment Wrapper
// Implementation of unified assignment system for Word Scramble game

'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import ImprovedWordScrambleGame from './ImprovedWordScrambleGame';
import GameAssignmentWrapper, {
  StandardVocabularyItem,
  AssignmentData,
  GameProgress
} from '../../../../components/games/templates/GameAssignmentWrapper';
import { ArrowLeft, Clock, Target, Award, BookOpen, Shuffle } from 'lucide-react';

interface WordScrambleAssignmentWrapperProps {
  assignmentId: string;
  studentId: string;
  onAssignmentComplete: (progress: GameProgress) => void;
  onBackToAssignments: () => void;
  onBackToMenu?: () => void;
}

export default function WordScrambleAssignmentWrapper({
  assignmentId,
  studentId,
  onAssignmentComplete,
  onBackToAssignments,
  onBackToMenu
}: WordScrambleAssignmentWrapperProps) {
  const { user } = useAuth();

  // Assignment mode helper functions
  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Word Scramble assignment completed:', progress);
    // Notify parent component
    if (onAssignmentComplete) {
      onAssignmentComplete(progress);
    }
  };

  const handleBackToAssignments = () => {
    if (onBackToAssignments) {
      onBackToAssignments();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
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
      gameId="word-scramble"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={onBackToMenu}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete, gameSessionId }) => {
        // Transform vocabulary to format expected by Word Scramble Game
        const categoryVocabulary = vocabulary.map((vocab: StandardVocabularyItem) => ({
          id: vocab.id,
          word: vocab.word,
          translation: vocab.translation,
          english: vocab.translation, // For compatibility
          category: vocab.category,
          subcategory: vocab.subcategory,
          language: vocab.language,
          part_of_speech: vocab.part_of_speech,
          audio_url: vocab.audio_url,
          word_type: vocab.word_type,
          gender: vocab.gender,
          article: vocab.article,
          display_word: vocab.display_word
        }));

        console.log('Word Scramble Assignment - Vocabulary loaded:', vocabulary.length, 'items');
        console.log('Word Scramble Assignment - Category vocabulary:', categoryVocabulary);

        const handleGameEnd = (result: { won: boolean; score: number; stats: any }) => {
          try {
            // Use gems-first scoring: 10 XP per word completed
            const wordsCompleted = result.stats?.wordsCompleted || 0;
            const score = wordsCompleted * 10;
            const accuracy = vocabulary.length > 0 ? (wordsCompleted / vocabulary.length) * 100 : 0;
            const maxScore = vocabulary.length * 10;

            // Update assignment progress
            onProgressUpdate({
              wordsCompleted,
              totalWords: vocabulary.length,
              score,
              maxScore,
              accuracy,
              timeSpent: result.stats?.totalTime || 0
            });

            // Complete the assignment
            onGameComplete({
              assignmentId: assignment.id,
              gameId: 'word-scramble',
              studentId: user.id,
              wordsCompleted,
              totalWords: vocabulary.length,
              score,
              maxScore,
              accuracy,
              timeSpent: result.stats?.totalTime || 0,
              completedAt: new Date(),
              sessionData: { result, stats: result.stats }
            });

          } catch (err) {
            console.error('Error completing Word Scramble assignment:', err);
          }
        };

        return (
          <ImprovedWordScrambleGame
            vocabulary={categoryVocabulary}
            isAssignmentMode={true}
            assignmentId={assignmentId}
            assignmentTitle={assignment.title}
            userId={user.id}
            gameSessionId={gameSessionId || undefined} // Pass game session ID for tracking
            onBackToMenu={onBackToMenu || (() => {})}
            onGameComplete={handleGameEnd}
            onProgressUpdate={onProgressUpdate}
            language={vocabulary[0]?.language || 'es'}
            difficulty={assignment.game_config?.difficulty as 'easy' | 'medium' | 'hard' || 'medium'}
          />
        );
      }}
    </GameAssignmentWrapper>
  );
}
