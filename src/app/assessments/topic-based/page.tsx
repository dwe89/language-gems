'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import ReadingComprehensionEngine from '../../../components/assessments/ReadingComprehensionEngine';
import { EnhancedGameSessionService } from '../../../services/rewards/EnhancedGameSessionService';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { normalizeAssessmentLanguage, resolveReadingFilters } from '@/lib/assessmentConfigUtils';

function TopicBasedAssessmentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  const isAssignmentMode = !!assignmentId;

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [sessionService, setSessionService] = useState<EnhancedGameSessionService | null>(null);

  // Initialize session service
  useEffect(() => {
    if (user) {
      const service = new EnhancedGameSessionService(supabaseBrowser);
      setSessionService(service);
    }
  }, [user]);

  // Load assignment data
  useEffect(() => {
    const loadAssignment = async () => {
      if (!assignmentId) {
        setLoading(false);
        return;
      }

      try {
        const { data: assignmentData, error: assignmentError } = await supabaseBrowser
          .from('assignments')
          .select('*')
          .eq('id', assignmentId)
          .single();

        if (assignmentError) throw assignmentError;

        // Find the topic-based assessment config
        const selectedAssessments = assignmentData.game_config?.assessmentConfig?.selectedAssessments || [];
        const topicBasedConfig = selectedAssessments.find((a: any) => a.type === 'topic-based');

        if (!topicBasedConfig) {
          throw new Error('Topic-based assessment configuration not found');
        }

        const instanceConfig = topicBasedConfig.instanceConfig || {};
        const normalizedLanguageFull = normalizeAssessmentLanguage(instanceConfig.language) as 'spanish' | 'french' | 'german';
        const filters = resolveReadingFilters(instanceConfig);
        const resolvedCategory = filters.category || instanceConfig.category || instanceConfig.theme;
        const resolvedSubcategory = filters.subcategory || instanceConfig.subcategory || instanceConfig.topic;

        setAssignment({
          ...assignmentData,
          assessmentConfig: {
            ...instanceConfig,
            language: normalizedLanguageFull,
            category: resolvedCategory,
            subcategory: resolvedSubcategory
          }
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading topic-based assessment:', err);
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
        setLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId]);

  // Create game session for assignment mode
  useEffect(() => {
    const createSession = async () => {
      if (isAssignmentMode && sessionService && user && assignment && !gameSessionId) {
        try {
          console.log('📚 [TOPIC-BASED] Creating assignment session...');
          const sessionId = await sessionService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId!,
            game_type: 'topic-based',
            session_mode: 'assignment',
            session_data: {
              assignmentId: assignmentId,
              assessmentType: 'topic-based',
              category: assignment.assessmentConfig?.category,
              subcategory: assignment.assessmentConfig?.subcategory
            }
          });
          setGameSessionId(sessionId);
          console.log('✅ [TOPIC-BASED] Assignment session created:', sessionId);
        } catch (error) {
          console.error('🚨 [TOPIC-BASED] Failed to create session:', error);
        }
      }
    };
    createSession();
  }, [isAssignmentMode, sessionService, user, assignment, gameSessionId, assignmentId]);

  // Handle assessment completion
  const handleComplete = async (results: any) => {
    console.log('📚 [TOPIC-BASED] Assessment completed:', results);

    if (isAssignmentMode && sessionService && gameSessionId && user) {
      try {
        const totalQuestions = results.totalQuestions || 1;
        const correctAnswers = results.correctAnswers || 0;

        await sessionService.endGameSession(gameSessionId, {
          student_id: user.id,
          assignment_id: assignmentId!,
          game_type: 'topic-based',
          session_mode: 'assignment',
          final_score: results.score || 0,
          max_score_possible: totalQuestions * 100,
          accuracy_percentage: results.score || 0,
          completion_percentage: 100,
          words_attempted: totalQuestions,
          words_correct: correctAnswers,
          unique_words_practiced: totalQuestions,
          duration_seconds: results.timeSpent || 0,
          session_data: results
        });

        console.log('✅ [TOPIC-BASED] Assignment session completed');

        // Navigate back to assignment
        router.push(`/student-dashboard/assignments/${assignmentId}`);
      } catch (error) {
        console.error('🚨 [TOPIC-BASED] Failed to save results:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!isAssignmentMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Topic-based assessments are only available through assignments.
        </div>
      </div>
    );
  }

  if (!assignment?.assessmentConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Topic-based assessment configuration is missing from this assignment.
        </div>
      </div>
    );
  }

  const language = assignment?.assessmentConfig?.language || 'spanish';
  const difficulty = assignment?.assessmentConfig?.difficulty || 'foundation';
  const category = assignment?.assessmentConfig?.category;
  const subcategory = assignment?.assessmentConfig?.subcategory;

  return (
    <ReadingComprehensionEngine
      language={language}
      difficulty={difficulty}
      theme={category}
      topic={subcategory}
      assignmentMode={isAssignmentMode}
      onComplete={handleComplete}
    />
  );
}

export default function TopicBasedAssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <TopicBasedAssessmentPageContent />
    </Suspense>
  );
}
