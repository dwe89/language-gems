'use client';

import React, { useState, useEffect, Component } from 'react';
import { Hexagon, Clock, CheckCircle, BookOpen, Gamepad2, ArrowRight, Target, TrendingUp, Award, Sparkles, Trophy, Percent } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { logError } from '../../../lib/utils';

// Simple Error Boundary Component (kept as is)
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
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                  <p className="text-gray-600">Something went wrong loading assignments</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>An unexpected error occurred. Please refresh the page or try again later.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Map game types to actual game directory paths with assignment support (kept as is)
const mapGameTypeToPath = (gameType: string | null): string => {
  if (!gameType) return 'memory-game';

  const gameTypeMap: Record<string, string> = {
    'memory-game': 'memory-game',
    'word-scramble': 'word-scramble',
    'vocab-blast': 'vocab-blast',
    'hangman': 'hangman',
    'noughts-and-crosses': 'noughts-and-crosses',
    'speed-builder': 'speed-builder',
    'vocabulary-mining': 'vocabulary-mining',
    'word-guesser': 'word-guesser',
    'quiz': 'memory-game',
    'word-blast': 'vocab-blast',
    'tic-tac-toe': 'noughts-and-crosses',
    'tictactoe': 'noughts-and-crosses',
    'gem-collector': 'vocabulary-mining',
    'translation-tycoon': 'speed-builder',
    'conjugation-duel': 'hangman',
    'sentence-towers': 'speed-builder',
    'sentence-builder': 'speed-builder',
    'word-association': 'memory-game',
  };

  return gameTypeMap[gameType] || 'memory-game';
};

// Check if game supports assignment mode (kept as is)
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
  type?: string;
  curriculum_level?: 'KS3' | 'KS4';
  vocabulary_count?: number;
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

// Assignment Card Component (Refactored for improved aesthetics)
const AssignmentCard = ({
  assignment
}: {
  assignment: Assignment
}) => {
  const gemColors = {
    'purple': 'from-purple-400 to-indigo-500',
    'blue': 'from-blue-400 to-cyan-500',
    'yellow': 'from-yellow-400 to-amber-500',
    'green': 'from-green-400 to-emerald-500',
    'red': 'from-red-400 to-rose-500'
  };

  const statusColors = {
    'completed': 'bg-green-500 text-white',
    'in-progress': 'bg-blue-500 text-white',
    'not-started': 'bg-gray-400 text-white'
  };

  const statusText = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'not-started': 'Not Started'
  };

  // Calculate progress percentage for the bar
  const progressPercentage = assignment.progress && assignment.progress.totalGames > 0
    ? (assignment.progress.completedGames / assignment.progress.totalGames) * 100
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
      {/* Top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gemColors[assignment.gemType]}`}></div>

      <div className="p-6 pt-7">
        {/* Header with icon and title */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${gemColors[assignment.gemType]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Hexagon className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2 line-clamp-2">{assignment.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Due {assignment.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`${statusColors[assignment.status]} inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide`}>
            {assignment.status === 'completed' && <CheckCircle className="h-3.5 w-3.5 mr-1.5" />}
            {statusText[assignment.status]}
          </span>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {!!assignment.curriculum_level && (
            <div className="inline-flex items-center text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg text-xs font-semibold border border-purple-100">
              <span>{assignment.curriculum_level}</span>
            </div>
          )}
          {(assignment.vocabulary_count && assignment.vocabulary_count > 0) && (
            <div className="inline-flex items-center text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-100">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              <span>{assignment.vocabulary_count} words</span>
            </div>
          )}
          {(assignment.gameCount && assignment.gameCount > 0) && (
            <div className="inline-flex items-center text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100">
              <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />
              <span>
                {assignment.gameCount} {
                  assignment.gameCount !== 1 && assignment.type !== 'skills' && assignment.type !== 'assessment' ? 'activities' :
                  assignment.type === 'skills' ? 'skill' :
                  assignment.type === 'assessment' ? 'test' :
                  'activity'
                }{assignment.gameCount !== 1 ? (
                  assignment.type === 'skills' ? 's' :
                  assignment.type === 'assessment' ? 's' :
                  ''
                ) : ''}
              </span>
            </div>
          )}
          {(assignment.points && assignment.points > 0) && (
            <div className="inline-flex items-center text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-100">
              <Trophy className="h-3.5 w-3.5 mr-1.5" />
              <span>{assignment.points} pts</span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        {assignment.progress && (
          <div className="mb-5">
            {assignment.status === 'in-progress' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-blue-900">Progress</span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-md">
                    {assignment.progress.completedGames}/{assignment.progress.totalGames} done
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5 mb-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center text-blue-700">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{Math.round(assignment.progress.bestScore)}</div>
                      <div className="text-blue-600">Best score</div>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-700">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{Math.round(assignment.progress.totalTimeSpent / 60)}m</div>
                      <div className="text-blue-600">Time spent</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {assignment.status === 'completed' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-green-900">Completed!</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center text-green-700">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-2">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{Math.round(assignment.progress.bestScore)}</div>
                      <div className="text-green-600">Score</div>
                    </div>
                  </div>
                  <div className="flex items-center text-green-700">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-2">
                      <Percent className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{Math.round(assignment.progress.bestAccuracy)}%</div>
                      <div className="text-green-600">Accuracy</div>
                    </div>
                  </div>
                </div>
                {assignment.progress.completedAt && (
                  <div className="mt-3 pt-3 border-t border-green-200 text-xs text-green-700 text-center">
                    Finished {new Date(assignment.progress.completedAt).toLocaleDateString('en-GB')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/student-dashboard/assignments/${assignment.id}`}
          className={`
            group/btn w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl
            font-semibold text-sm transition-all duration-200
            ${assignment.status === 'completed'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
            }
          `}
        >
          <span>{assignment.status === 'completed' ? 'Review' : 'Start'} Assignment</span>
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

// Main page content component (kept largely as is, only updated section titles for consistency)
function AssignmentsPageContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchAssignments = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError('');

        const supabase = supabaseBrowser;

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

        const { data: assignmentProgress, error: progressError } = await supabase
          .from('enhanced_assignment_progress')
          .select(`
            assignment_id,
            status,
            best_score,
            best_accuracy,
            total_time_spent,
            completed_at,
            session_count,
            progress_data
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
        }

        const classNameMap = new Map();

        console.log('Fetched assignments:', assignments);
        console.log('Fetched assignment progress:', assignmentProgress);

        const progressMap = new Map();
        assignmentProgress?.forEach(progress => {
          progressMap.set(progress.assignment_id, progress);
        });

        const processedAssignments: Assignment[] = (assignments || []).map((assignment: any, index) => {
          const selectedGames = assignment.game_config?.selectedGames ||
                               assignment.game_config?.gameConfig?.selectedGames ||
                               [];

          const selectedAssessments = assignment.game_config?.assessmentConfig?.selectedAssessments || [];
          const selectedSkills = assignment.game_config?.skillsConfig?.selectedSkills || [];

          const totalActivities = selectedGames.length + selectedAssessments.length + selectedSkills.length;
          const activityCount = totalActivities > 0 ? totalActivities : 1;

          const activityNames = [];

          selectedGames.forEach((gameId: string) => {
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
            activityNames.push(gameNameMap[gameId] || gameId);
          });

          selectedAssessments.forEach((assessment: any) => {
            activityNames.push(assessment.name || 'Assessment');
          });

          selectedSkills.forEach((skill: any) => {
            activityNames.push(skill.name || 'Grammar Activity');
          });

          if (activityNames.length === 0) {
            if (assignment.game_type === 'skills') {
              activityNames.push('Grammar Activity');
            } else if (assignment.game_type === 'assessment') {
              activityNames.push('Assessment');
            } else {
              activityNames.push(assignment.game_type || 'Activity');
            }
          }

          const progress = progressMap.get(assignment.id);

          let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
          if (progress) {
            if (progress.status === 'completed') {
              status = 'completed';
            } else if (progress.status === 'in_progress' || progress.best_score > 0) {
              status = 'in-progress';
            }
          }

          return {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('en-GB') : 'No due date', // Changed to en-GB for DD/MM/YYYY
            status: status as 'not-started' | 'in-progress' | 'completed',
            gemType: ['purple', 'blue', 'yellow', 'green', 'red'][index % 5] as any,
            gameCount: activityCount,
            activities: activityNames,
            className: classNameMap.get(assignment.class_id) || 'Your Class',
            points: assignment.points,
            type: assignment.game_type,
            curriculum_level: (assignment.curriculum_level || assignment.game_config?.curriculumLevel) as 'KS3' | 'KS4',
            vocabulary_count: assignment.game_type === 'skills' ? null : (assignment.vocabulary_count || assignment.vocabulary_criteria?.wordCount || assignment.game_config?.gameConfig?.vocabularyConfig?.wordCount),
            progress: progress ? {
              bestScore: progress.best_score || 0,
              bestAccuracy: progress.best_accuracy || 0,
              completedAt: progress.completed_at || null,
              attemptsCount: progress.session_count || 0, // Using session_count for attempts
              totalTimeSpent: progress.total_time_spent || 0,
              completedGames: (progress.progress_data?.completedActivities || 0), // Assuming progress_data tracks this
              totalGames: activityCount, // Total activities for the assignment
            } : null
          };
        });

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

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                <p className="text-gray-600">Loading your assignments...</p>
              </div>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                <p className="text-gray-600">Error loading assignments</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">My Assignments</h1>
                <p className="text-gray-600 text-sm">Complete your teacher-set tasks and track your progress</p>
              </div>
            </div>
            <Link
              href="/student-dashboard/games"
              className="inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all items-center gap-2 font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Free Play</span>
            </Link>
          </div>
        </div>

        {/* Current Assignments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Target className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Active Assignments</h2>
                <p className="text-sm text-gray-600">{currentAssignments.length} {currentAssignments.length === 1 ? 'assignment' : 'assignments'} to complete</p>
              </div>
            </div>
          </div>

          {currentAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No active assignments</h3>
              <p className="text-gray-600 mb-4">Your teacher hasn't assigned any work yet.</p>
              <Link
                href="/student-dashboard/games"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                <Gamepad2 className="h-4 w-4" />
                <span>Play Free Games</span>
              </Link>
            </div>
          )}
        </div>

        {/* Completed Assignments */}
        {completedAssignments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Completed</h2>
                  <p className="text-sm text-gray-600">{completedAssignments.length} {completedAssignments.length === 1 ? 'assignment' : 'assignments'} finished</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 font-bold text-sm">
                <Award className="h-4 w-4" />
                <span>{completedAssignments.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {completedAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapped component with error boundary (kept as is)
export default function AssignmentsPage() {
  return (
    <AssignmentErrorBoundary>
      <AssignmentsPageContent />
    </AssignmentErrorBoundary>
  );
}