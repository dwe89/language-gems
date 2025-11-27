'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import ReadingComprehensionEngine from '../../../components/assessments/ReadingComprehensionEngine';
import AQATopicReadingAssessment from '../../../components/assessments/AQATopicReadingAssessment';
import { AQATopicAssessmentService } from '../../../services/aqaTopicAssessmentService';
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

  const [topicAssessment, setTopicAssessment] = useState<any>(null);
  const [checkingTopicAssessment, setCheckingTopicAssessment] = useState(true);

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

  // Check for specific topic assessment
  useEffect(() => {
    const checkTopicAssessment = async () => {
      if (!assignment?.assessmentConfig) return;

      setCheckingTopicAssessment(true);
      try {
        const { language, difficulty, category, subcategory } = assignment.assessmentConfig;

        const service = new AQATopicAssessmentService();
        const langCode = language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'de';

        // Try to find a matching assessment
        const assessments = await service.getAssessmentsByFilters(
          difficulty,
          langCode,
          category,
          subcategory
        );

        if (assessments && assessments.length > 0) {
          console.log('✅ Found specific topic assessment:', assessments[0]);
          setTopicAssessment(assessments[0]);
        } else {
          console.log('⚠️ No specific topic assessment found, falling back to reading comprehension engine');
        }
      } catch (err) {
        console.error('Error checking for topic assessment:', err);
      } finally {
        setCheckingTopicAssessment(false);
      }
    };

    if (assignment) {
      checkTopicAssessment();
    }
  }, [assignment]);

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
              subcategory: assignment.assessmentConfig?.subcategory,
              specificAssessmentId: topicAssessment?.id
            }
          });
          setGameSessionId(sessionId);
          console.log('✅ [TOPIC-BASED] Assignment session created:', sessionId);
        } catch (error) {
          console.error('🚨 [TOPIC-BASED] Failed to create session:', error);
        }
      }
    };

    // Only create session once we've finished checking for the specific assessment type
    if (!checkingTopicAssessment) {
      createSession();
    }
  }, [isAssignmentMode, sessionService, user, assignment, gameSessionId, assignmentId, checkingTopicAssessment, topicAssessment]);

  // Handle assessment completion
  const handleComplete = async (results: any) => {
    console.log('📚 [TOPIC-BASED] Assessment completed:', results);

    if (isAssignmentMode && sessionService && gameSessionId && user) {
      try {
        const totalQuestions = results.totalQuestions || 1;
        const correctAnswers = results.correctAnswers || (results.score && results.totalMarks ? Math.round((results.score / results.totalMarks) * totalQuestions) : 0);

        await sessionService.endGameSession(gameSessionId, {
          student_id: user.id,
          assignment_id: assignmentId!,
          game_type: 'topic-based',
          session_mode: 'assignment',
          final_score: results.score || 0,
          max_score_possible: results.totalMarks || (totalQuestions * 100),
          accuracy_percentage: results.percentage || 0,
          completion_percentage: 100,
          words_attempted: totalQuestions,
          words_correct: correctAnswers,
          unique_words_practiced: totalQuestions,
          duration_seconds: results.totalTimeSpent || results.timeSpent || 0,
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

  if (loading || checkingTopicAssessment) {
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

  // If we found a specific topic assessment, render that engine
  if (topicAssessment) {
    return (
      <AQATopicReadingAssessment
        language={language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'de'}
        level="KS4" // Type requirement, though unused for KS3 logic
        difficulty={difficulty}
        theme={category}
        topic={subcategory}
        identifier={topicAssessment.identifier}
        onComplete={handleComplete}
      />
    );
  }

  // Fallback to standard reading comprehension engine
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
