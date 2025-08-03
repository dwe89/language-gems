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
import FourSkillsAssessment from './FourSkillsAssessment';

interface FourSkillsAssignmentWrapperProps {
  assignmentId: string;
}

export default function FourSkillsAssignmentWrapper({ 
  assignmentId 
}: FourSkillsAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Four Skills assignment completed:', progress);
    
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
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <button
          onClick={handleBackToAssignments}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all border border-white/30 text-white font-medium"
        >
          ← Back to Assignments
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
          🎯 Four Skills Assessment
        </h1>

        <div className="w-48"></div> {/* Spacer for centering */}
      </div>

      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="four-skills"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={handleBackToMenu}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          console.log('Four Skills Assignment - Assignment loaded:', assignment);
          console.log('Four Skills Assignment - Vocabulary loaded:', vocabulary.length, 'items');

          // Extract assessment configuration from assignment
          const config = assignment.config || {};
          const assessmentConfig = config.assessmentConfig || config;
          
          // Determine assessment parameters from assignment
          const language = assessmentConfig.language || vocabulary[0]?.language || 'es';
          const level = assessmentConfig.level || assignment.curriculum_level || 'KS3';
          const difficulty = assessmentConfig.difficulty || (level === 'KS4' ? 'higher' : 'foundation');
          const skills = assessmentConfig.skills || ['reading', 'writing', 'listening', 'speaking'];
          const category = assessmentConfig.category || vocabulary[0]?.category;
          const subcategory = assessmentConfig.subcategory || vocabulary[0]?.subcategory;
          const examBoard = assessmentConfig.examBoard || 'AQA';

          return (
            <FourSkillsAssessment
              language={language as 'es' | 'fr' | 'de'}
              level={level as 'KS3' | 'KS4'}
              skills={skills as ('reading' | 'writing' | 'listening' | 'speaking')[]}
              category={category}
              subcategory={subcategory}
              difficulty={difficulty as 'foundation' | 'higher'}
              examBoard={examBoard as 'AQA' | 'Edexcel' | 'Eduqas' | 'General'}
              assignmentMode={true}
              onComplete={(results) => {
                // Calculate overall score from all skills
                const totalScore = Object.values(results.skillScores).reduce((sum: number, score: any) => sum + (score.score || 0), 0);
                const totalPossible = Object.values(results.skillScores).reduce((sum: number, score: any) => sum + (score.maxScore || 0), 0);
                
                const { score, accuracy, maxScore } = calculateStandardScore(
                  totalScore,
                  totalPossible || 1,
                  Date.now(),
                  100
                );

                // Update progress
                onProgressUpdate({
                  wordsCompleted: totalScore,
                  totalWords: totalPossible || 1,
                  score,
                  maxScore,
                  accuracy,
                  sessionData: results
                });

                // Complete the assignment
                const progressData: GameProgress = {
                  assignmentId: assignment.id,
                  gameId: 'four-skills',
                  studentId: user.id,
                  wordsCompleted: totalScore,
                  totalWords: totalPossible || 1,
                  score,
                  maxScore,
                  accuracy,
                  timeSpent: results.totalTimeSpent || 0,
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
