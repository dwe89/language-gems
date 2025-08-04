'use client';

import React, { useState, useEffect, Component } from 'react';
import { Hexagon, Clock, CheckCircle, BookOpen, Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { logError } from '../../../lib/utils';

// Simple Error Boundary Component
class AssignmentErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError('Assignment page error:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📚 Assignments</h1>
            <p className="text-indigo-100 mt-2">Something went wrong loading assignments</p>
          </div>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>An unexpected error occurred. Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Map game types to actual game directory paths with assignment support
const mapGameTypeToPath = (gameType: string | null): string => {
  if (!gameType) return 'memory-game';

  const gameTypeMap: Record<string, string> = {
    // Direct mappings for existing games with assignment support
    'memory-game': 'memory-game',
    'word-scramble': 'word-scramble',
    'vocab-blast': 'vocab-blast',
    'hangman': 'hangman',
    'noughts-and-crosses': 'noughts-and-crosses',
    'speed-builder': 'speed-builder',
    'vocabulary-mining': 'vocabulary-mining',
    'word-guesser': 'word-guesser',

    // Legacy mappings for potential mismatches
    'quiz': 'memory-game', // Fallback for quiz to memory game
    'word-blast': 'vocab-blast', // Map word-blast to vocab-blast
    'tic-tac-toe': 'noughts-and-crosses', // Alternative name
    'tictactoe': 'noughts-and-crosses', // Alternative name
    'gem-collector': 'vocabulary-mining', // Map gem collector to vocabulary mining
    'translation-tycoon': 'speed-builder', // Map to closest equivalent
    'conjugation-duel': 'hangman', // Map to closest equivalent
    'sentence-towers': 'speed-builder', // Map to closest equivalent
    'sentence-builder': 'speed-builder', // Map to closest equivalent
    'word-association': 'memory-game', // Map to closest equivalent
  };

  return gameTypeMap[gameType] || 'memory-game'; // Default fallback
};

// Check if game supports assignment mode
const supportsAssignmentMode = (gameType: string | null): boolean => {
  const supportedGames = [
    'memory-game',
    'word-scramble',
    'hangman',
    'vocab-blast',
    'word-guesser',
    'noughts-and-crosses'
  ];
  return gameType ? supportedGames.includes(gameType) : false;
};

type Assignment = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'not-started';
  gemType: 'purple' | 'blue' | 'yellow' | 'green' | 'red';
  gameCount?: number;
  activities?: string[];
  className?: string;
  points?: number;
  type?: string; // Game type like "memory-game", "speed-builder", etc.
  curriculum_level?: 'KS3' | 'KS4'; // Curriculum level support
  vocabulary_count?: number; // Number of vocabulary items
  progress?: {
    bestScore: number;
    bestAccuracy: number;
    completedAt: string | null;
    attemptsCount: number;
    totalTimeSpent: number;
    completedGames: number;
    totalGames: number;
  } | null;
};

// Assignment Card Component
const AssignmentCard = ({ 
  assignment 
}: { 
  assignment: Assignment 
}) => {
  const gemColors = {
    'purple': 'text-purple-500',
    'blue': 'text-blue-500',
    'yellow': 'text-yellow-500',
    'green': 'text-green-500',
    'red': 'text-red-500'
  };
  
  const statusColors = {
    'completed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'not-started': 'bg-gray-100 text-gray-800'
  };
  
  const statusText = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'not-started': 'Not Started'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-center mb-4">
        <div className={`${gemColors[assignment.gemType]} mr-4`}>
          <Hexagon className="h-10 w-10" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{assignment.title}</h3>
          {assignment.className && (
            <div className="text-sm text-gray-600 font-medium">
              Class: {assignment.className}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>Due: {assignment.dueDate}</span>
          </div>
          <div className="flex items-center gap-4 text-sm mt-1">
            {assignment.points && (
              <div className="text-indigo-600">
                <span>Points: {assignment.points}</span>
              </div>
            )}
            {assignment.curriculum_level && (
              <div className="text-purple-600">
                <span>{assignment.curriculum_level}</span>
              </div>
            )}
            {assignment.vocabulary_count && (
              <div className="text-green-600">
                <BookOpen className="h-3 w-3 inline mr-1" />
                <span>{assignment.vocabulary_count} words</span>
              </div>
            )}
          </div>
          {assignment.gameCount && (
            <div className="flex items-center text-sm text-indigo-600 mt-1">
              <Gamepad2 className="h-4 w-4 mr-1" />
              <span>{assignment.gameCount} games included</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`${statusColors[assignment.status]} inline-flex items-center px-3 py-1 rounded-full text-xs font-medium`}>
          {assignment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
          {statusText[assignment.status]}
        </div>
        
        {assignment.activities && assignment.activities.length > 0 && (
          <div className="text-xs text-gray-500">
            {assignment.activities.slice(0, 2).join(', ')}
            {assignment.activities.length > 2 && ` +${assignment.activities.length - 2} more`}
          </div>
        )}
      </div>
      
      {assignment.progress && (
        <div className="mb-4 space-y-2">
          {assignment.status === 'completed' && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              <div className="flex justify-between">
                <span>Best Score: {Math.round(assignment.progress.bestScore)}%</span>
                <span>Accuracy: {Math.round(assignment.progress.bestAccuracy)}%</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Attempts: {assignment.progress.attemptsCount}</span>
                <span>Time: {Math.round(assignment.progress.totalTimeSpent / 60)}min</span>
              </div>
              {assignment.progress.completedAt && (
                <div className="text-xs text-green-500 mt-1">
                  Completed: {new Date(assignment.progress.completedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          {assignment.status === 'in-progress' && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <div className="flex justify-between">
                <span>Current Score: {Math.round(assignment.progress.bestScore)}%</span>
                <span>Attempts: {assignment.progress.attemptsCount}</span>
              </div>
              <div className="text-xs text-blue-500 mt-1">
                Time spent: {Math.round(assignment.progress.totalTimeSpent / 60)} minutes
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex space-x-2">
        <Link
          href={`/student-dashboard/assignments/${assignment.id}`}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center"
        >
          {assignment.status === 'completed' ? 'Review Assignment' : 'Continue Assignment'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
        {assignment.status !== 'completed' && (
          <Link
            href={assignment.type === 'vocabulary-mining' ? '/games/vocabulary-mining' : '/student-dashboard/games'}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            Free Play
          </Link>
        )}
      </div>
    </div>
  );
};

function AssignmentsPageContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) return;

    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchAssignments = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(''); // Clear any previous errors
        
        const supabase = supabaseBrowser;

        // Get student's class enrollments
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('class_enrollments')
          .select('class_id')
          .eq('student_id', user.id);

        if (enrollmentError) {
          logError('Error fetching enrollments:', enrollmentError);
          if (isMounted) {
            setError('Failed to load class data');
            setLoading(false);
          }
          return;
        }

        // Handle case where student has no enrollments
        if (!enrollments || enrollments.length === 0) {
          console.log('Student has no class enrollments');
          if (isMounted) {
            setCurrentAssignments([]);
            setCompletedAssignments([]);
            setLoading(false);
          }
          return;
        }

        const classIds = enrollments.map(e => e.class_id);

        // Fetch assignments for student's classes
        const { data: assignments, error: assignmentError } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            due_date,
            points,
            status,
            game_type,
            game_config,
            class_id,
            curriculum_level,
            vocabulary_count
          `)
          .in('class_id', classIds)
          .order('created_at', { ascending: false });

        // Fetch assignment progress using the new game-based completion system
        const { data: assignmentProgress, error: progressError } = await supabase
          .from('assignment_completion_status')
          .select(`
            assignment_id,
            status,
            completed_games,
            total_games,
            last_completed_at
          `)
          .eq('student_id', user.id);

        // Also fetch enhanced assignment progress for additional details
        const { data: enhancedProgress, error: enhancedProgressError } = await supabase
          .from('enhanced_assignment_progress')
          .select(`
            assignment_id,
            best_score,
            best_accuracy,
            attempts_count,
            total_time_spent
          `)
          .eq('student_id', user.id);

        if (assignmentError) {
          logError('Error fetching assignments:', assignmentError);
          if (isMounted) {
            setError('Failed to load assignments');
            setLoading(false);
          }
          return;
        }

        if (progressError) {
          logError('Error fetching assignment progress:', progressError);
          // Continue without progress data rather than failing completely
        }

        if (enhancedProgressError) {
          logError('Error fetching enhanced assignment progress:', enhancedProgressError);
          // Continue without enhanced progress data
        }

        // Skip class names for now to avoid permission issues
        // TODO: Get class names through a different approach or API endpoint
        const classNameMap = new Map();

        console.log('Fetched assignments:', assignments);
        console.log('Fetched assignment progress:', assignmentProgress);
        console.log('Fetched enhanced progress:', enhancedProgress);

        // Create maps for quick lookup
        const progressMap = new Map();
        assignmentProgress?.forEach(progress => {
          progressMap.set(progress.assignment_id, progress);
        });

        const enhancedProgressMap = new Map();
        enhancedProgress?.forEach(progress => {
          enhancedProgressMap.set(progress.assignment_id, progress);
        });

        // Transform assignments to match our type
        const processedAssignments: Assignment[] = (assignments || []).map((assignment: any, index) => {
          // Check if this is a multi-game assignment using the same logic as the detail page
          const isMultiGame = assignment.game_type === 'multi-game' ||
                             assignment.game_type === 'mixed-mode' ||
                             (assignment.game_config?.multiGame && assignment.game_config?.selectedGames?.length > 1) ||
                             (assignment.game_config?.gameConfig?.selectedGames && assignment.game_config.gameConfig.selectedGames.length > 1);

          // Get the selected games from the correct config structure
          const selectedGames = assignment.game_config?.selectedGames ||
                               assignment.game_config?.gameConfig?.selectedGames ||
                               [];

          const gameCount = isMultiGame ? selectedGames.length : 1;
          const gameNames = isMultiGame
            ? selectedGames.map((gameId: string) => {
                // Convert game IDs to readable names
                const gameNameMap: Record<string, string> = {
                  'memory-game': 'Memory Match',
                  'word-blast': 'Word Blast',
                  'speed-builder': 'Speed Builder',
                  'translation-tycoon': 'Translation Tycoon',
                  'conjugation-duel': 'Conjugation Duel',
                  'word-scramble': 'Word Scramble',
                  'gem-collector': 'Gem Collector',
                  'hangman': 'Hangman',
                  'word-guesser': 'Word Guesser',
                  'sentence-towers': 'Sentence Towers',
                  'sentence-builder': 'Sentence Builder',
                  'word-association': 'Word Association'
                };
                return gameNameMap[gameId] || gameId;
              })
            : [assignment.game_type || 'Game'];

          // Get progress data for this assignment
          const progress = progressMap.get(assignment.id);
          const enhancedProgressData = enhancedProgressMap.get(assignment.id);

          // Determine status based on game completion
          let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
          if (progress) {
            if (progress.status === 'completed') {
              status = 'completed';
            } else if (progress.completed_games > 0) {
              status = 'in-progress';
            }
          }

          return {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date',
            status: status as 'not-started' | 'in-progress' | 'completed',
            gemType: ['purple', 'blue', 'yellow', 'green', 'red'][index % 5] as any,
            gameCount: gameCount,
            activities: gameNames,
            className: classNameMap.get(assignment.class_id) || 'Your Class',
            points: assignment.points,
            type: assignment.game_type,
            curriculum_level: (assignment.curriculum_level || assignment.game_config?.curriculumLevel) as 'KS3' | 'KS4',
            vocabulary_count: assignment.vocabulary_count || assignment.vocabulary_criteria?.wordCount || assignment.game_config?.gameConfig?.vocabularyConfig?.wordCount,
            progress: progress || enhancedProgressData ? {
              bestScore: enhancedProgressData?.best_score || 0,
              bestAccuracy: enhancedProgressData?.best_accuracy || 0,
              completedAt: progress?.last_completed_at || null,
              attemptsCount: enhancedProgressData?.attempts_count || 0,
              totalTimeSpent: enhancedProgressData?.total_time_spent || 0,
              completedGames: progress?.completed_games || 0,
              totalGames: progress?.total_games || gameCount
            } : null
          };
        });

        // Separate assignments based on completion status
        const currentAssignments = processedAssignments.filter(assignment =>
          assignment.status === 'not-started' || assignment.status === 'in-progress'
        );
        const completedAssignments = processedAssignments.filter(assignment =>
          assignment.status === 'completed'
        );

        if (isMounted) {
          setCurrentAssignments(currentAssignments);
          setCompletedAssignments(completedAssignments);
        }

      } catch (err) {
        logError('Error in fetchAssignments:', err);
        if (isMounted) {
          setError('Failed to load assignments');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAssignments();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 Assignments</h1>
          <p className="text-indigo-100 mt-2">Loading your assignments...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 Assignments</h1>
          <p className="text-indigo-100 mt-2">Error loading assignments</p>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 Assignments</h1>
          <p className="text-indigo-100 mt-2">Complete teacher-set tasks to earn assignment grades</p>
        </div>
        <Link 
          href="/student-dashboard/games"
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Gamepad2 className="h-4 w-4" />
          <span>Free Play Games</span>
        </Link>
      </div>

      {/* Mode Info Banner */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">🎯 Assignment Mode</h2>
            <p className="text-gray-600">Guided learning with teacher-set goals and deadlines</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <p className="text-gray-700 font-medium mb-2">✨ Assignment Benefits:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structured learning path designed by your teacher</li>
                <li>• Grades count towards your course progress</li>
                <li>• Targeted practice on specific topics</li>
                <li>• Clear deadlines to keep you on track</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link 
                href="/student-dashboard/games"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                🎮 Free Play Instead
              </Link>
              <Link 
                href="/student-dashboard/progress"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                📊 View Progress
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
            <BookOpen className="h-5 w-5" />
          </span>
          Current Assignments ({currentAssignments.length})
        </h2>
        
        {currentAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600">Your teacher hasn't assigned any work yet. Check back later!</p>
          </div>
        )}
      </div>
      
      {/* Completed Assignments */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✅ Completed Assignments</h2>
          <span className="text-green-600 font-medium">{completedAssignments.length} completed</span>
        </div>
        
        {completedAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed assignments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapped component with error boundary
export default function AssignmentsPage() {
  return (
    <AssignmentErrorBoundary>
      <AssignmentsPageContent />
    </AssignmentErrorBoundary>
  );
} 