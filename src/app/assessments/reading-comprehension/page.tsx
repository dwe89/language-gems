'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import ReadingComprehensionEngine from '../../../components/assessments/ReadingComprehensionEngine';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import { EnhancedGameSessionService } from '../../../services/rewards/EnhancedGameSessionService';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { normalizeAssessmentLanguage, resolveReadingFilters } from '@/lib/assessmentConfigUtils';

function ReadingComprehensionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If there's an assignment ID, automatically enable assignment mode
  // This makes the code more forgiving if mode=assignment is missing from URL
  const isAssignmentMode = !!assignmentId;

  // Load assignment data if in assignment mode
  const { assignment, vocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'reading-comprehension', false);

  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [sessionService, setSessionService] = useState<EnhancedGameSessionService | null>(null);

  // Initialize session service
  useEffect(() => {
    if (user) {
      const service = new EnhancedGameSessionService(supabaseBrowser);
      setSessionService(service);
    }
  }, [user]);

  // Create game session for assignment mode
  useEffect(() => {
    const createSession = async () => {
      if (isAssignmentMode && sessionService && user && assignment && !gameSessionId) {
        try {
          console.log('📖 [READING] Creating assignment session...');
          const sessionId = await sessionService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId!,
            game_type: 'reading-comprehension',
            session_mode: 'assignment',
            session_data: {
              assignmentId: assignmentId,
              assessmentType: 'reading-comprehension'
            }
          });
          setGameSessionId(sessionId);
          console.log('✅ [READING] Assignment session created:', sessionId);
        } catch (error) {
          console.error('🚨 [READING] Failed to create session:', error);
        }
      }
    };
    createSession();
  }, [isAssignmentMode, sessionService, user, assignment, gameSessionId, assignmentId]);

  // Handle assessment completion
  const handleComplete = async (results: any) => {
    console.log('📖 [READING] Assessment completed:', results);

    if (isAssignmentMode && sessionService && gameSessionId && user) {
      try {
        // Record completion with EnhancedGameSessionService
        const totalQuestions = results.totalQuestions || 1;
        const correctAnswers = results.correctAnswers || 0;

        await sessionService.endGameSession(gameSessionId, {
          student_id: user.id,
          assignment_id: assignmentId!,
          game_type: 'reading-comprehension',
          session_mode: 'assignment',
          final_score: results.score || 0,
          max_score_possible: totalQuestions * 100,
          accuracy_percentage: results.score || 0, // results.score is already a percentage (0-100)
          completion_percentage: 100,
          words_attempted: totalQuestions,
          words_correct: correctAnswers,
          unique_words_practiced: totalQuestions,
          duration_seconds: results.timeSpent || 0,
          session_data: results
        });

        console.log('✅ [READING] Progress recorded successfully');

        // Redirect to assignment page after a delay
        setTimeout(() => {
          router.push(`/student-dashboard/assignments/${assignmentId}`);
        }, 3000);
      } catch (error) {
        console.error('🚨 [READING] Failed to record progress:', error);
      }
    }
  };

  // If assignment mode, extract configuration and render with assignment data
  if (isAssignmentMode) {
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg">Please log in to access this assessment.</p>
          </div>
        </div>
      );
    }

    if (assignmentLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading assignment...</p>
          </div>
        </div>
      );
    }

    if (assignmentError || !assignment) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg text-red-300">Error loading assignment: {assignmentError || 'Assignment not found'}</p>
          </div>
        </div>
      );
    }

    // Extract configuration from assignment
    const config = assignment.game_config || {};
    const assessmentConfig = config.assessmentConfig || {};
    const selectedAssessments = assessmentConfig.selectedAssessments || [];
    const readingAssessment = selectedAssessments.find((a: any) =>
      a.type === 'reading-comprehension'
    );
    const instanceConfig = readingAssessment?.instanceConfig || {};

    const normalizedLanguage = normalizeAssessmentLanguage(instanceConfig.language) as 'spanish' | 'french' | 'german';
    const difficulty = instanceConfig.difficulty || 'foundation';
    const filters = resolveReadingFilters(instanceConfig);
    const theme = filters.category || instanceConfig.theme || instanceConfig.category || 'identity_personal_life';
    const topic = filters.subcategory || instanceConfig.topic || instanceConfig.subcategory;

    console.log('📖 [READING] Assignment config:', {
      language,
      difficulty,
      theme,
      topic,
      level: instanceConfig.level
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <ReadingComprehensionEngine
          language={normalizedLanguage}
          difficulty={difficulty as 'foundation' | 'higher'}
          theme={theme}
          topic={topic}
          assignmentMode={true}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  // Otherwise render standalone assessment
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Reading Comprehension</h1>
          <p className="text-blue-200 text-lg">Test your reading skills with comprehensive passages</p>
        </div>

        <ReadingComprehensionEngine
          language="spanish"
          difficulty="foundation"
        />
      </div>
    </div>
  );
}

export default function ReadingComprehensionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading assessment...</p>
        </div>
      </div>
    }>
      <ReadingComprehensionPageContent />
    </Suspense>
  );
}
