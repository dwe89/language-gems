'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthProvider';
import GameAssignmentWrapper, { 
  StandardVocabularyItem, 
  AssignmentData, 
  GameProgress,
  calculateStandardScore 
} from '../games/templates/GameAssignmentWrapper';
import ReadingComprehensionEngine from './ReadingComprehensionEngine';

interface ReadingComprehensionAssignmentWrapperProps {
  assignmentId: string;
}

export default function ReadingComprehensionAssignmentWrapper({ 
  assignmentId 
}: ReadingComprehensionAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Don't render if user is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">Please log in to access this assessment.</p>
        </div>
      </div>
    );
  }

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Reading Comprehension assignment completed:', progress);
    
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/assessments');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <button
          onClick={handleBackToAssignments}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all border border-white/30 text-white font-medium"
        >
          ← Back to Assignments
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
          📖 Reading Comprehension Assessment
        </h1>

        <div className="w-48"></div> {/* Spacer for centering */}
      </div>

      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="reading-comprehension"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={handleBackToMenu}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          console.log('Reading Comprehension Assignment - Assignment loaded:', assignment);
          console.log('Reading Comprehension Assignment - Vocabulary loaded:', vocabulary.length, 'items');

          // Extract assessment configuration from assignment
          const config = assignment.game_config || {};
          const assessmentConfig = config.assessmentConfig || config.generalSettings || {};
          
          console.log('Reading Comprehension Assignment - Config:', config);
          console.log('Reading Comprehension Assignment - Assessment Config:', assessmentConfig);
          console.log('Reading Comprehension Assignment - Assignment curriculum_level:', assignment.curriculum_level);
          console.log('Reading Comprehension Assignment - First vocabulary item:', vocabulary[0]);
          
          // Determine assessment parameters from assignment - prioritize the explicit settings
          const language = assessmentConfig.language || vocabulary[0]?.language || 'spanish';
          const difficulty = assessmentConfig.difficulty || (assignment.curriculum_level === 'KS4' ? 'higher' : 'foundation');
          
          // Use the subcategory from generalSettings as the actual category selected by user
          const userSelectedCategory = assessmentConfig.subcategory || assessmentConfig.category || vocabulary[0]?.category;
          
          // Map vocabulary categories to reading comprehension themes
          const categoryMapping: Record<string, string> = {
            'basics_core_language': 'identity_personal_life',
            'colors': 'identity_personal_life',
            'colours': 'identity_personal_life',
            'numbers': 'daily_life',
            'family': 'identity_personal_life',
            'school': 'school_jobs_future',
            'food': 'food_drink',
            'home': 'home_local_area',
            'travel': 'holidays_travel_culture',
            'hobbies': 'free_time_leisure',
            'health': 'health_lifestyle',
            'technology': 'technology_media',
            'environment': 'nature_environment',
            'shopping': 'clothes_shopping',
            // Add specific mapping for months
            'months': 'time_dates_seasons'
          };
          
          // Use the user-selected category for mapping
          const theme = categoryMapping[userSelectedCategory] || 'identity_personal_life';
          const topic = undefined; // Don't use subcategory for reading comprehension
          
          console.log('Reading Comprehension Assignment - User selected category:', userSelectedCategory);
          console.log('Reading Comprehension Assignment - Mapped theme:', theme);
          console.log('Reading Comprehension Assignment - Final params:', { language, difficulty, theme });

          return (
            <ReadingComprehensionEngine
              language={language as 'es' | 'fr' | 'de'}
              difficulty={difficulty as 'foundation' | 'higher'}
              theme={theme}
              topic={topic}
              assignmentMode={true}
              onComplete={(results) => {
                // Calculate score based on assessment results
                const { score, accuracy, maxScore } = calculateStandardScore(
                  results.correctAnswers || 0,
                  results.totalQuestions || 1,
                  Date.now(),
                  100
                );

                // Update progress
                onProgressUpdate({
                  wordsCompleted: results.correctAnswers || 0,
                  totalWords: results.totalQuestions || 1,
                  score,
                  maxScore,
                  accuracy,
                  sessionData: results
                });

                // Complete the assignment
                const progressData: GameProgress = {
                  assignmentId: assignment.id,
                  gameId: 'reading-comprehension',
                  studentId: user.id,
                  wordsCompleted: results.correctAnswers || 0,
                  totalWords: results.totalQuestions || 1,
                  score,
                  maxScore,
                  accuracy,
                  timeSpent: results.timeSpent || 0,
                  completedAt: new Date(),
                  sessionData: results
                };

                onGameComplete(progressData);
              }}
            />
          );
        }}
      </GameAssignmentWrapper>
    </div>
  );
}
