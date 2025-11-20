'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Clock, FileText, Award, CheckCircle, Settings } from 'lucide-react';
import FlagIcon from '../../../components/ui/FlagIcon';
import { AQAReadingAssessmentService, type AQAAssessmentDefinition } from '../../../services/aqaReadingAssessmentService';
import { useAuth } from '@/components/auth/AuthProvider';
import AQAReadingAdminModal from '@/components/admin/AQAReadingAdminModal';
import AQAReadingAssessment from '@/components/assessments/AQAReadingAssessment';
import { useAssignmentVocabulary } from '@/hooks/useAssignmentVocabulary';
import { EnhancedGameSessionService } from '@/services/rewards/EnhancedGameSessionService';
import { supabaseBrowser } from '@/components/auth/AuthProvider';
import { normalizeAssessmentLanguage, normalizeExamBoard, extractAssessmentInstance } from '@/lib/assessmentConfigUtils';
import { AssessmentResultsDetailView } from '@/components/dashboard/AssessmentResultsDetailView';

const AVAILABLE_LANGUAGES = [
  { code: 'es', countryCode: 'ES', name: 'Spanish' },
  { code: 'fr', countryCode: 'FR', name: 'French' },
  { code: 'de', countryCode: 'DE', name: 'German' },
];

function GCSEReadingExamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  const review = searchParams?.get('review') === 'true';

  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Load assignment data if in assignment mode
  const { assignment, vocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'gcse-reading', false);

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
          console.log('📖 [GCSE READING] Creating assignment session...');
          const sessionId = await sessionService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId!,
            game_type: 'gcse-reading',
            session_mode: 'assignment',
            session_data: {
              assignmentId: assignmentId,
              assessmentType: 'gcse-reading'
            }
          });
          setGameSessionId(sessionId);
          console.log('✅ [GCSE READING] Assignment session created:', sessionId);
        } catch (error) {
          console.error('🚨 [GCSE READING] Failed to create session:', error);
        }
      }
    };
    createSession();
  }, [isAssignmentMode, sessionService, user, assignment, gameSessionId, assignmentId]);

  // Handle assessment completion
  const handleComplete = async (results: any) => {
    console.log('📖 [GCSE READING] Assessment completed:', results);

    if (isAssignmentMode && sessionService && gameSessionId && user) {
      try {
        // Record completion with EnhancedGameSessionService
        const totalQuestions = results.questionsCompleted || 0;
        const totalTimeSpent = results.totalTimeSpent || 0;

        // Use scoring data from results if available
        const totalScore = results.totalScore || 0;
        const totalPossibleScore = results.totalPossibleScore || (totalQuestions * 100); // Fallback
        const percentage = results.percentageScore || 0;

        await sessionService.endGameSession(gameSessionId, {
          student_id: user.id,
          assignment_id: assignmentId!,
          game_type: 'gcse-reading',
          session_mode: 'assignment',
          final_score: totalScore,
          max_score_possible: totalPossibleScore,
          accuracy_percentage: percentage,
          completion_percentage: 100,
          words_attempted: totalQuestions,
          words_correct: totalScore, // Using score as proxy for "words correct" in this context
          unique_words_practiced: totalQuestions,
          duration_seconds: totalTimeSpent,
          session_data: results
        });

        console.log('✅ [GCSE READING] Progress recorded successfully');

        // Redirect to assignment page after a delay
        setTimeout(() => {
          router.push(`/student-dashboard/assignments/${assignmentId}`);
        }, 3000);
      } catch (error) {
        console.error('🚨 [GCSE READING] Failed to record progress:', error);
      }
    }
  };

  // Handle review mode
  if (review && assignmentId && user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
          <AssessmentResultsDetailView
            assignmentId={assignmentId}
            studentId={user.id}
            onBack={() => router.push('/dashboard/student')}
            viewMode="student"
          />
        </div>
      </div>
    );
  }

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
    const instance = extractAssessmentInstance(assignment.game_config, 'gcse-reading')
      || extractAssessmentInstance(assignment.game_config, 'aqa-reading');

    if (!instance) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg text-red-200">This assignment does not include a GCSE reading assessment configuration.</p>
          </div>
        </div>
      );
    }

    const instanceConfig = instance.instanceConfig || {};
    const normalizedExamBoard = normalizeExamBoard(instanceConfig.examBoard);
    const normalizedLanguage = normalizeAssessmentLanguage(instanceConfig.language, 'iso') as 'es' | 'fr' | 'de';
    const difficulty = (instanceConfig.difficulty || 'foundation') as 'foundation' | 'higher';
    const identifier = instanceConfig.paper || instanceConfig.identifier || 'paper-1';

    if (normalizedExamBoard !== 'AQA') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg">Only AQA GCSE reading papers are available in assignment mode right now. Please edit the assignment and choose an AQA paper.</p>
          </div>
        </div>
      );
    }

    console.log('📖 [GCSE READING] Assignment config:', {
      language: normalizedLanguage,
      difficulty,
      identifier,
      examBoard: normalizedExamBoard
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <AQAReadingAssessment
          language={normalizedLanguage}
          level="KS4"
          difficulty={difficulty}
          identifier={identifier}
          studentId={user.id}
          assignmentId={assignmentId}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  // Otherwise, show the standalone exam selection page
  return <GCSEReadingStandalonePage />;
}

function GCSEReadingStandalonePage() {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedExamBoard, setSelectedExamBoard] = useState('');
  const [availableAssessments, setAvailableAssessments] = useState<AQAAssessmentDefinition[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [assessmentService] = useState(() => new AQAReadingAssessmentService());
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  // Load available assessments when filters change
  useEffect(() => {
    const loadAssessments = async () => {
      if (selectedLanguage && selectedTier && selectedExamBoard === 'AQA') {
        setIsLoadingAssessments(true);
        try {
          const assessments = await assessmentService.getAssessmentsByLevel(
            selectedTier as 'foundation' | 'higher',
            selectedLanguage as 'es' | 'fr' | 'de'
          );
          setAvailableAssessments(assessments);
        } catch (error) {
          console.error('Error loading assessments:', error);
          setAvailableAssessments([]);
        } finally {
          setIsLoadingAssessments(false);
        }
      } else {
        setAvailableAssessments([]);
      }
    };

    loadAssessments();
  }, [selectedLanguage, selectedTier, selectedExamBoard, assessmentService]);

  const handleRefreshPapers = async () => {
    // Reload assessments when admin makes changes
    if (selectedLanguage && selectedTier && selectedExamBoard === 'AQA') {
      setIsLoadingAssessments(true);
      try {
        const assessments = await assessmentService.getAssessmentsByLevel(
          selectedTier as 'foundation' | 'higher',
          selectedLanguage as 'es' | 'fr' | 'de'
        );
        setAvailableAssessments(assessments);
      } catch (error) {
        console.error('Error loading assessments:', error);
        setAvailableAssessments([]);
      } finally {
        setIsLoadingAssessments(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Admin Button */}
      {isAdmin && (
        <button
          onClick={() => setShowAdminModal(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
          title="Manage AQA Reading Papers (Admin only)"
        >
          <Settings className="w-5 h-5" />
          <span>Manage Papers</span>
        </button>
      )}

      {/* Admin Modal */}
      {isAdmin && (
        <AQAReadingAdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onRefresh={handleRefreshPapers}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/assessments"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Link>

          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">GCSE Reading Exam</h1>
              <p className="text-xl text-gray-600 mt-2">
                Practice with official exam-style reading papers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Exam</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exam Board Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Board
              </label>
              <select
                value={selectedExamBoard}
                onChange={(e) => setSelectedExamBoard(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose exam board...</option>
                <option value="AQA">AQA</option>
                <option value="Edexcel">Edexcel (Coming Soon)</option>
              </select>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedExamBoard}
              >
                <option value="">Choose language...</option>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedLanguage}
              >
                <option value="">Choose tier...</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </select>
            </div>
          </div>
        </div>

        {/* Available Papers Section - AQA */}
        {selectedExamBoard === 'AQA' && selectedLanguage && selectedTier && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Papers</h2>

            {isLoadingAssessments ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading assessments...</p>
              </div>
            ) : availableAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableAssessments.map((assessment) => (
                  <Link
                    key={assessment.identifier}
                    href={`/aqa-reading-test/${selectedLanguage}/${selectedTier}/${assessment.identifier}`}
                    className="block bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{assessment.title}</h3>
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{assessment.time_limit_minutes} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{assessment.total_questions} questions</span>
                      </div>
                    </div>

                    <div className="mt-4 text-blue-600 font-semibold flex items-center">
                      Start Paper
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No papers available for this combination.</p>
              </div>
            )}
          </div>
        )}

        {/* Edexcel Coming Soon */}
        {selectedExamBoard === 'Edexcel' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Edexcel reading papers are currently in development and will be available soon.
            </p>
          </div>
        )}

        {/* Info Section */}
        {!selectedExamBoard && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              About GCSE Reading Exams
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Expect</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Authentic reading passages in your target language</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multiple question types including multiple choice and short answer</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Timed exam conditions to simulate the real experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Instant feedback and detailed explanations</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exam Details</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-1">Foundation Tier</p>
                    <p className="text-sm">45 minutes • 60 marks</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-1">Higher Tier</p>
                    <p className="text-sm">60 minutes • 60 marks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GCSEReadingExamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    }>
      <GCSEReadingExamContent />
    </Suspense>
  );
}
