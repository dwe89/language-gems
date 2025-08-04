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
import AQAReadingAssessment from './AQAReadingAssessment';
import AQAListeningAssessment from './AQAListeningAssessment';

interface AQAAssignmentWrapperProps {
  assignmentId: string;
  assessmentType: 'reading' | 'listening';
}

export default function AQAAssignmentWrapper({ 
  assignmentId,
  assessmentType 
}: AQAAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log(`AQA ${assessmentType} assignment completed:`, progress);
    
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/assessments');
  };

  const getAssessmentTitle = () => {
    return assessmentType === 'reading' 
      ? '📖 AQA Reading Assessment' 
      : '🎧 AQA Listening Assessment';
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
          {getAssessmentTitle()}
        </h1>

        <div className="w-48"></div> {/* Spacer for centering */}
      </div>

      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId={`aqa-${assessmentType}`}
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={handleBackToMenu}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          console.log(`AQA ${assessmentType} Assignment - Assignment loaded:`, assignment);
          console.log(`AQA ${assessmentType} Assignment - Vocabulary loaded:`, vocabulary.length, 'items');

          // Extract assessment configuration from assignment
          const config = assignment.config || {};
          const assessmentConfig = config.assessmentConfig || config;
          
          // Determine assessment parameters from assignment
          const language = assessmentConfig.language || vocabulary[0]?.language || 'es';
          const difficulty = assessmentConfig.difficulty || assignment.curriculum_level === 'KS4' ? 'higher' : 'foundation';
          const identifier = assessmentConfig.identifier || 'paper-1';

          const handleAssessmentComplete = (results: any) => {
            // Calculate score based on assessment results
            const { score, accuracy, maxScore } = calculateStandardScore(
              results.totalScore || 0,
              results.totalPossible || 1,
              Date.now(),
              100
            );

            // Update progress
            onProgressUpdate({
              wordsCompleted: results.totalScore || 0,
              totalWords: results.totalPossible || 1,
              score,
              maxScore,
              accuracy,
              sessionData: results
            });

            // Complete the assignment
            const progressData: GameProgress = {
              assignmentId: assignment.id,
              gameId: `aqa-${assessmentType}`,
              studentId: user.id,
              wordsCompleted: results.totalScore || 0,
              totalWords: results.totalPossible || 1,
              score,
              maxScore,
              accuracy,
              timeSpent: results.timeSpent || 0,
              completedAt: new Date(),
              sessionData: results
            };

            onGameComplete(progressData);
          };

          // Render the appropriate AQA assessment component
          if (assessmentType === 'reading') {
            return (
              <AQAReadingAssessment
                language={language as 'es' | 'fr' | 'de'}
                difficulty={difficulty as 'foundation' | 'higher'}
                identifier={identifier}
                onComplete={handleAssessmentComplete}
                assignmentMode={true}
              />
            );
          } else {
            return (
              <AQAListeningAssessment
                language={language as 'es' | 'fr' | 'de'}
                difficulty={difficulty as 'foundation' | 'higher'}
                identifier={identifier}
                onComplete={handleAssessmentComplete}
                assignmentMode={true}
              />
            );
          }
        }}
      </GameAssignmentWrapper>
    </div>
  );
}
