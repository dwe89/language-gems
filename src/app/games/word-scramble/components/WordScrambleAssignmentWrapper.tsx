// Word Scramble Assignment Wrapper
// Implementation of unified assignment system for Word Scramble game

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import {
  BaseGameAssignment,
  BaseGameAssignmentProps,
  useGameAssignment
} from '../../../../components/games/BaseGameAssignment';
import {
  UnifiedAssignment,
  VocabularyItem,
  GameProgressData
} from '../../../../interfaces/UnifiedAssignmentInterface';
import WordScrambleGameEnhanced from './WordScrambleGameEnhanced';
import { ArrowLeft, Clock, Target, Award, BookOpen, Shuffle } from 'lucide-react';

// Word Scramble-specific assignment implementation
class WordScrambleAssignmentImpl extends BaseGameAssignment {
  validateAssignment(assignment: UnifiedAssignment): boolean {
    return assignment.gameType === 'word-scramble' && 
           assignment.vocabularyConfig.source !== undefined;
  }

  calculateMaxScore(): number {
    const wordCount = this.vocabulary.length;
    const basePointsPerWord = 50;
    const difficultyMultiplier = this.assignment?.gameConfig.gameSettings?.shuffleCount 
      ? (this.assignment.gameConfig.gameSettings.shuffleCount * 0.3) + 1
      : 1.5;
    
    return Math.round(wordCount * basePointsPerWord * difficultyMultiplier);
  }
}

interface WordScrambleAssignmentWrapperProps extends BaseGameAssignmentProps {
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
  const [gameImplementation, setGameImplementation] = useState<WordScrambleAssignmentImpl | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState({
    wordsCompleted: 0,
    totalWords: 0,
    currentScore: 0,
    accuracy: 0,
    averageTime: 0
  });

  // Use the assignment hook
  const {
    assignment,
    vocabulary,
    loading,
    error,
    recordProgress,
    completeAssignment
  } = useGameAssignment(assignmentId);

  // Initialize game implementation
  useEffect(() => {
    if (assignment && vocabulary.length > 0 && user) {
      initializeGame();
    }
  }, [assignment, vocabulary, user]);

  const initializeGame = async () => {
    try {
      const impl = new WordScrambleAssignmentImpl(supabaseBrowser, user!.id);
      await impl.initializeAssignment(assignment!);
      setGameImplementation(impl);
      setGameStats(prev => ({ ...prev, totalWords: vocabulary.length }));
    } catch (err) {
      console.error('Error initializing Word Scramble assignment:', err);
    }
  };

  const handleStartGame = async () => {
    if (!gameImplementation) return;

    try {
      const newSessionId = await gameImplementation.startSession();
      setSessionId(newSessionId);
      setGameStarted(true);
    } catch (err) {
      console.error('Error starting game session:', err);
    }
  };

  const handleGameEnd = async (result: { won: boolean; score: number; stats: any }) => {
    if (!gameImplementation) return;

    try {
      // Calculate final progress
      const finalProgress = gameImplementation.getCurrentProgress();
      finalProgress.score = result.score;
      finalProgress.wordsAttempted = result.stats.wordsCompleted;
      finalProgress.wordsCorrect = result.stats.perfectWords;
      finalProgress.completedAt = new Date();
      finalProgress.status = 'completed';

      // Complete session
      await gameImplementation.completeSession(finalProgress);
      
      // Complete assignment
      await gameImplementation.completeAssignment();

      // Update stats
      setGameStats({
        wordsCompleted: result.stats.wordsCompleted,
        totalWords: vocabulary.length,
        currentScore: result.score,
        accuracy: result.stats.wordsCompleted > 0 ? 
          Math.round((result.stats.perfectWords / result.stats.wordsCompleted) * 100) : 0,
        averageTime: result.stats.avgSolveTime || 0
      });

      // Notify parent component
      if (onAssignmentComplete) {
        onAssignmentComplete(finalProgress);
      }

    } catch (err) {
      console.error('Error completing assignment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignment Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBackToAssignments}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  if (!assignment || !vocabulary.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg">No assignment data available</p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToAssignments}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Assignments
            </button>
            <div className="text-sm text-gray-500">Assignment Mode</div>
          </div>

          {/* Assignment Info */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                <Shuffle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            {assignment.description && (
              <p className="text-lg text-gray-600 mb-4">{assignment.description}</p>
            )}
            
            <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{vocabulary.length} words</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Word Scramble</span>
              </div>
              {assignment.dueDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Game Preview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Vocabulary:</span>
                <span className="ml-2 text-gray-600">
                  {assignment.vocabularyConfig.categoryId || 'Custom List'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Difficulty:</span>
                <span className="ml-2 text-gray-600">
                  {assignment.vocabularyConfig.difficultyLevel || 'Mixed'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Game Mode:</span>
                <span className="ml-2 text-gray-600">
                  {assignment.gameConfig.gameSettings?.gameMode || 'Classic'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Hints:</span>
                <span className="ml-2 text-gray-600">
                  {assignment.gameConfig.hintsAllowed ? 'Allowed' : 'Not allowed'}
                </span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Assignment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game is started - render the actual Word Scramble game
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Assignment Progress Header */}
      <div className="bg-black bg-opacity-20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToAssignments}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Exit Assignment
            </button>
            <div className="text-sm">
              <span className="font-medium">{assignment.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div>
              Words: {gameStats.wordsCompleted}/{gameStats.totalWords}
            </div>
            <div>
              Score: {gameStats.currentScore}
            </div>
            <div>
              Accuracy: {gameStats.accuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Word Scramble Game */}
      <WordScrambleGameEnhanced
        settings={{
          difficulty: assignment.vocabularyConfig.difficultyLevel as any || 'medium',
          category: assignment.vocabularyConfig.categoryId || 'custom',
          language: vocabulary[0]?.language || 'spanish',
          gameMode: assignment.gameConfig.gameSettings?.gameMode || 'classic',
          subcategory: assignment.vocabularyConfig.subcategoryId,
          curriculumLevel: assignment.vocabularyConfig.curriculumLevel || 'KS3'
        }}
        onBackToMenu={onBackToMenu || (() => {})}
        onGameEnd={handleGameEnd}
        categoryVocabulary={vocabulary}
        assignmentId={assignmentId}
        userId={user?.id}
        isAssignmentMode={true}
      />
    </div>
  );
}
