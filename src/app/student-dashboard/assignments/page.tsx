'use client';

import React, { useState, useEffect } from 'react';
import { Hexagon, Clock, CheckCircle, BookOpen, Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { logError } from '../../../lib/utils';

// Map game types to actual game directory paths
const mapGameTypeToPath = (gameType: string | null): string => {
  if (!gameType) return 'memory-game';

  const gameTypeMap: Record<string, string> = {
    // Direct mappings for existing games
    'memory-game': 'memory-game',
    'vocab-blast': 'vocab-blast',
    'hangman': 'hangman',
    'noughts-and-crosses': 'noughts-and-crosses',
    'speed-builder': 'speed-builder',
    'vocabulary-mining': 'vocabulary-mining',

    // Legacy mappings for potential mismatches
    'quiz': 'memory-game', // Fallback for quiz to memory game
    'word-blast': 'vocab-blast', // Map word-blast to vocab-blast
    'tic-tac-toe': 'noughts-and-crosses', // Alternative name
    'tictactoe': 'noughts-and-crosses', // Alternative name
    'gem-collector': 'vocabulary-mining', // Map gem collector to vocabulary mining
    'translation-tycoon': 'speed-builder', // Map to closest equivalent
    'conjugation-duel': 'hangman', // Map to closest equivalent
    'word-scramble': 'hangman', // Map to closest equivalent
    'word-guesser': 'hangman', // Map to closest equivalent
    'sentence-towers': 'speed-builder', // Map to closest equivalent
    'sentence-builder': 'speed-builder', // Map to closest equivalent
    'word-association': 'memory-game', // Map to closest equivalent
  };

  return gameTypeMap[gameType] || 'memory-game'; // Default fallback
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
  progress?: {
    bestScore: number;
    bestAccuracy: number;
    completedAt: string | null;
    attemptsCount: number;
    totalTimeSpent: number;
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
          {assignment.points && (
            <div className="flex items-center text-sm text-indigo-600 mt-1">
              <span>Points: {assignment.points}</span>
            </div>
          )}
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
          href={assignment.gameCount && assignment.gameCount > 1
            ? `/student-dashboard/assignments/${assignment.id}`
            : `/games/${mapGameTypeToPath(assignment.type)}?assignment=${assignment.id}`}
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

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) return;

    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const supabase = supabaseBrowser;

        // Get student's class enrollments
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('class_enrollments')
          .select('class_id')
          .eq('student_id', user.id);

        if (enrollmentError) {
          logError('Error fetching enrollments:', enrollmentError);
          setError('Failed to load class data');
          return;
        }

        // Handle case where student has no enrollments
        if (!enrollments || enrollments.length === 0) {
          console.log('Student has no class enrollments');
          setCurrentAssignments([]);
          setCompletedAssignments([]);
          setLoading(false);
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
            class_id
          `)
          .in('class_id', classIds)
          .order('created_at', { ascending: false });

        // Fetch assignment progress for the current student
        const { data: assignmentProgress, error: progressError } = await supabase
          .from('enhanced_assignment_progress')
          .select(`
            assignment_id,
            status,
            best_score,
            best_accuracy,
            completed_at,
            attempts_count,
            total_time_spent
          `)
          .eq('student_id', user.id);

        if (assignmentError) {
          logError('Error fetching assignments:', assignmentError);
          setError('Failed to load assignments');
          return;
        }

        if (progressError) {
          logError('Error fetching assignment progress:', progressError);
          // Continue without progress data rather than failing completely
        }

        // Skip class names for now to avoid permission issues
        // TODO: Get class names through a different approach or API endpoint
        const classNameMap = new Map();

        console.log('Fetched assignments:', assignments);
        console.log('Fetched assignment progress:', assignmentProgress);

        // Create a map of assignment progress for quick lookup
        const progressMap = new Map();
        assignmentProgress?.forEach(progress => {
          progressMap.set(progress.assignment_id, progress);
        });

        // Transform assignments to match our type
        const processedAssignments: Assignment[] = (assignments || []).map((assignment: any, index) => {
          const isMultiGame = assignment.game_config?.multiGame && assignment.game_config?.selectedGames?.length > 1;
          const gameCount = isMultiGame ? assignment.game_config.selectedGames.length : 1;
          const gameNames = isMultiGame 
            ? assignment.game_config.selectedGames.map((gameId: string) => {
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
          const status = progress?.status || 'not-started';

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
            progress: progress ? {
              bestScore: progress.best_score,
              bestAccuracy: progress.best_accuracy,
              completedAt: progress.completed_at,
              attemptsCount: progress.attempts_count,
              totalTimeSpent: progress.total_time_spent
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

        setCurrentAssignments(currentAssignments);
        setCompletedAssignments(completedAssignments);

      } catch (err) {
        logError('Error in fetchAssignments:', err);
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
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