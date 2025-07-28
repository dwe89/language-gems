'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, {
  GameProgress,
  calculateStandardScore,
  recordAssignmentProgress
} from '../../../../components/games/templates/GameAssignmentWrapper';
import HangmanGameWrapper from './HangmanGameWrapper';

interface HangmanAssignmentWrapperProps {
  assignmentId: string;
}

export default function HangmanAssignmentWrapper({
  assignmentId
}: HangmanAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('default');

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Hangman assignment completed:', progress);

    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/hangman');
  };

  // Format category name for display
  const formatCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'basics_core_language': 'Basics - Core Language',
      'identity_personal_life': 'Identity - Personal Life',
      'family_relationships': 'Family - Relationships',
      'home_local_area_environment': 'Home - Local Area & Environment',
      'school_jobs_future': 'School - Jobs & Future',
      'free_time_leisure': 'Free Time - Leisure',
      'travel_transport': 'Travel - Transport',
      'health_body_lifestyle': 'Health - Body & Lifestyle',
      'food_drink': 'Food - Drink',
      'technology_media': 'Technology - Media',
      'weather_nature': 'Weather - Nature',
      'animals': 'Animals',
      'colors': 'Colors',
      'numbers': 'Numbers',
      'clothing': 'Clothing',
      'sports': 'Sports',
      'hobbies': 'Hobbies',
      'emotions': 'Emotions',
      'time': 'Time',
      'places': 'Places',
      'assignment': 'Assignment Vocabulary'
    };
    return categoryMap[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format subcategory name for display
  const formatSubcategoryName = (subcategory: string) => {
    const subcategoryMap: Record<string, string> = {
      'months': 'Months',
      'days_of_week': 'Days of the Week',
      'time_expressions': 'Time Expressions',
      'numbers_1_30': 'Numbers 1-30',
      'numbers_40_100': 'Numbers 40-100',
      'family_members': 'Family Members',
      'body_parts': 'Body Parts',
      'clothing_items': 'Clothing Items',
      'food_items': 'Food Items',
      'drinks': 'Drinks',
      'animals_domestic': 'Domestic Animals',
      'animals_wild': 'Wild Animals',
      'colors_basic': 'Basic Colors',
      'colors_advanced': 'Advanced Colors',
      'assignment': 'Assignment Words'
    };
    return subcategoryMap[subcategory] || subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500">
      {/* Header - consistent with standalone game */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <button
          onClick={handleBackToAssignments}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all border border-white/30 text-white font-medium"
        >
          ← Back to Assignments
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
          🎯 Hangman Game
        </h1>

        <div className="w-48"></div> {/* Spacer for centering */}
      </div>

      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="hangman"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={handleBackToMenu}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Transform vocabulary to the format expected by HangmanGameWrapper
          const gameVocabulary = vocabulary.map(item => item.word);

          console.log('Hangman Assignment - Vocabulary loaded:', vocabulary.length, 'items');

          const categoryName = vocabulary[0]?.category || 'assignment';
          const subcategoryName = vocabulary[0]?.subcategory || 'assignment';

          return (
          <HangmanGameWrapper
              settings={{
                difficulty: 'intermediate',
                category: categoryName,
                subcategory: subcategoryName,
                language: 'spanish',
                theme: selectedTheme,
                customWords: gameVocabulary,
                categoryVocabulary: vocabulary
              }}
              isAssignmentMode={true}
              onBackToMenu={handleBackToMenu}
              onGameEnd={(result) => {
              // Calculate score based on result
              const { score, accuracy, maxScore } = calculateStandardScore(
                result === 'win' ? 1 : 0,
                1,
                Date.now(),
                100
              );

              onProgressUpdate({
                wordsCompleted: result === 'win' ? 1 : 0,
                totalWords: vocabulary.length,
                score,
                maxScore,
                accuracy
              });

              // If this was the last word, complete the assignment
              if (vocabulary.length === 1) {
                const progressData: GameProgress = {
                  assignmentId: assignment.id,
                  gameId: 'hangman',
                  studentId: user.id,
                  wordsCompleted: result === 'win' ? 1 : 0,
                  totalWords: vocabulary.length,
                  score,
                  maxScore,
                  accuracy,
                  timeSpent: 0,
                  completedAt: new Date(),
                  sessionData: { result }
                };

                // Record progress using unified function
                recordAssignmentProgress(
                  assignment.id,
                  'hangman',
                  user.id,
                  progressData
                ).then(() => {
                  onGameComplete(progressData);
                }).catch(error => {
                  console.error('Failed to record progress:', error);
                  onGameComplete(progressData); // Still complete even if recording fails
                });
              }
            }}
            isFullscreen={true}
            assignmentId={assignmentId}
            userId={user.id}
            isAssignmentMode={true}
          />
          );
        }}
      </GameAssignmentWrapper>
    </div>
  );
}
