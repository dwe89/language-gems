'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DictationAssessment from '../../../components/assessments/DictationAssessment';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import { EnhancedGameSessionService } from '../../../services/rewards/EnhancedGameSessionService';

function DictationPageContent() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Check if in assignment mode
  const isAssignmentMode = assignmentId && mode === 'assignment';

  if (isAssignmentMode) {
    return <DictationAssignmentMode assignmentId={assignmentId} />;
  }

  // Otherwise render standalone assessment
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Dictation Assessment</h1>
          <p className="text-blue-200 text-lg">Listen and write dictation exercises with accuracy scoring</p>
        </div>

        {/* Note: Standalone dictation needs language/difficulty/identifier props */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Configuration Required</h2>
          <p className="text-gray-600">Please select language, difficulty, and paper from the assessments page.</p>
        </div>
      </div>
    </div>
  );
}

// Assignment Mode Component
function DictationAssignmentMode({ assignmentId }: { assignmentId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load assignment data
  const { assignment, loading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId, 'dictation', false);

  useEffect(() => {
    const initializeSession = async () => {
      if (!user?.id || !assignment || loading) return;

      try {
        setIsLoading(true);
        console.log('🎤 [DICTATION] Creating assignment session...');

        const sessionService = new EnhancedGameSessionService();
        const sessionId = await sessionService.startGameSession({
          student_id: user.id,
          assignment_id: assignmentId,
          game_type: 'dictation',
          session_mode: 'assignment',
          session_data: {
            assignmentId,
            assessmentType: 'dictation',
            difficulty: (assignment.game_config as any)?.assessmentConfig?.difficulty,
            identifier: (assignment.game_config as any)?.assessmentConfig?.identifier,
            language: (assignment.game_config as any)?.assessmentConfig?.language
          }
        });

        setGameSessionId(sessionId);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('Failed to initialize assessment session');
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [user?.id, assignment, assignmentId, loading]);

  const handleComplete = async (results: any) => {
    if (!user?.id || !gameSessionId) return;

    try {
      console.log('🎤 [DICTATION] Assessment completed:', results);

      const sessionService = new EnhancedGameSessionService();

      // Calculate scores from dictation results
      const totalScore = results.totalScore || 0;
      const totalPossible = results.totalPossible || 100;
      const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

      await sessionService.endGameSession(gameSessionId, {
        student_id: user.id,
        assignment_id: assignmentId,
        game_type: 'dictation',
        session_mode: 'assignment',
        final_score: totalScore,
        max_score_possible: totalPossible,
        accuracy_percentage: percentage,
        completion_percentage: 100,
        words_attempted: results.responses?.length || 0,
        words_correct: results.responses?.filter((r: any) => r.is_correct).length || 0,
        unique_words_practiced: results.responses?.length || 0,
        duration_seconds: results.timeSpent || 0,
        session_data: results
      });

      console.log('✅ [DICTATION] Progress recorded successfully');

      // Redirect back to assignment
      router.push(`/student-dashboard/assignments/${assignmentId}`);
    } catch (err) {
      console.error('Error recording progress:', err);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Assessment...</h2>
        </div>
      </div>
    );
  }

  if (error || assignmentError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-xl">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600">{error || assignmentError}</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-xl">
          <h2 className="text-xl font-semibold mb-2">Assignment Not Found</h2>
          <p className="text-gray-600">Could not load assignment data.</p>
        </div>
      </div>
    );
  }

  // Extract assessment config from assignment
  const assessmentConfig = (assignment.game_config as any)?.assessmentConfig;
  if (!assessmentConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-xl">
          <h2 className="text-xl font-semibold mb-2">Invalid Configuration</h2>
          <p className="text-gray-600">Assessment configuration is missing.</p>
        </div>
      </div>
    );
  }

  const { difficulty, identifier, language } = assessmentConfig;

  // Render Dictation Assessment
  return (
    <DictationAssessment
      language={language}
      level="KS4"
      difficulty={difficulty}
      identifier={identifier}
      onComplete={handleComplete}
      onQuestionComplete={() => {}}
    />
  );
}

export default function DictationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading assessment...</p>
        </div>
      </div>
    }>
      <DictationPageContent />
    </Suspense>
  );
}
