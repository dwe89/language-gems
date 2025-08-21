'use client';

import React, { useState, useEffect, Component } from 'react';
import { Hexagon, Clock, CheckCircle, BookOpen, Gamepad2, ArrowRight, Target, TrendingUp, Star, Award, Sparkles, Flame, Trophy, Percent, Hourglass, BarChart2 } from 'lucide-react'; // Added more icons for future use
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
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
      {/* Top gradient border */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gemColors[assignment.gemType]}`}></div>

      <div className="p-6 pt-8"> {/* Added padding top to account for gradient bar */}
        <div className="flex items-start mb-4">
          <div className={`p-3 rounded-full bg-gradient-to-br ${gemColors[assignment.gemType]} shadow-md mr-4`}>
            <Hexagon className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-xl text-gray-900 leading-snug">{assignment.title}</h3>
            {assignment.className && (
              <p className="text-sm text-gray-600 font-medium mt-1">
                Class: <span className="text-indigo-700 font-semibold">{assignment.className}</span>
              </p>
            )}
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Clock className="h-4 w-4 mr-2 text-indigo-500" />
              <span className="font-medium">Due: {assignment.dueDate}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-3 mb-4">
          {assignment.points && (
            <div className="flex items-center text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full font-semibold">
              <Trophy className="h-4 w-4 mr-1" />
              <span>{assignment.points} Points</span>
            </div>
          )}
          {assignment.curriculum_level && (
            <div className="flex items-center text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-semibold">
              <span>{assignment.curriculum_level}</span>
            </div>
          )}
          {assignment.vocabulary_count && (
            <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full font-semibold">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{assignment.vocabulary_count} Words</span>
            </div>
          )}
          {assignment.gameCount && (
            <div className="flex items-center text-blue-700 bg-blue-50 px-3 py-1 rounded-full font-semibold">
              <Gamepad2 className="h-4 w-4 mr-1" />
              <span>
                {assignment.gameCount} {
                  assignment.type === 'skills' ? 'Skill Activities' :
                  assignment.type === 'assessment' ? 'Assessments' :
                  assignment.gameCount === 1 ? 'Activity' : 'Activities'
                }
              </span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`${statusColors[assignment.status]} inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm`}>
            {assignment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-2" />}
            {statusText[assignment.status]}
          </span>
          {assignment.activities && assignment.activities.length > 0 && (
            <div className="text-xs text-gray-500 font-medium">
              Activities: {assignment.activities.slice(0, 2).join(', ')}
              {assignment.activities.length > 2 && ` +${assignment.activities.length - 2} more`}
            </div>
          )}
        </div>

        {assignment.progress && (
          <div className="mb-5 space-y-3">
            {assignment.status === 'in-progress' && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-blue-700">Progress: {Math.round(progressPercentage)}%</span>
                  <span className="text-xs text-blue-600">
                    {assignment.progress.completedGames}/{assignment.progress.totalGames} Activities
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-blue-600 mt-2">
                  <div className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span>Score: {Math.round(assignment.progress.bestScore)}</span>
                  </div>
                  <div className="flex items-center">
                    <Hourglass className="h-3 w-3 mr-1" />
                    <span>Time: {Math.round(assignment.progress.totalTimeSpent / 60)} min</span>
                  </div>
                </div>
              </div>
            )}

            {assignment.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-xs text-green-700 font-semibold">
                  <div className="flex items-center">
                    <Trophy className="h-3 w-3 mr-1" />
                    <span>Score: {Math.round(assignment.progress.bestScore)} pts</span>
                  </div>
                  <div className="flex items-center">
                    <Percent className="h-3 w-3 mr-1" />
                    <span>Accuracy: {Math.round(assignment.progress.bestAccuracy)}%</span>
                  </div>
                  <div className="flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    <span>Attempts: {assignment.progress.attemptsCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Hourglass className="h-3 w-3 mr-1" />
                    <span>Time: {Math.round(assignment.progress.totalTimeSpent / 60)} min</span>
                  </div>
                </div>
                {assignment.progress.completedAt && (
                  <div className="text-right text-xs text-green-500 mt-2">
                    Completed on: {new Date(assignment.progress.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Link
            href={`/student-dashboard/assignments/${assignment.id}`}
            className={`flex-1 ${assignment.status === 'completed' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-4 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center text-center shadow-md hover:shadow-lg`}
          >
            {assignment.status === 'completed' ? 'Review Assignment' : 'Start/Continue Assignment'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
          {assignment.status !== 'completed' && (
            <Link
              href={assignment.type === 'vocabulary-mining' ? '/games/vocabulary-mining' : '/student-dashboard/games'}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl transition-all duration-200 text-sm font-medium flex items-center justify-center text-center shadow-sm hover:shadow-md"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Free Play
            </Link>
          )}
        </div>
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
          const isMultiActivity = assignment.game_type === 'multi-game' ||
                                  assignment.game_type === 'mixed-mode' ||
                                  assignment.game_type === 'skills' ||
                                  assignment.game_type === 'assessment' ||
                                  (assignment.game_config?.multiGame && assignment.game_config?.selectedGames?.length > 1) ||
                                  (assignment.game_config?.gameConfig?.selectedGames && assignment.game_config.gameConfig.selectedGames.length > 1);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                <p className="text-gray-600">Complete teacher-set tasks to earn assignment grades</p>
              </div>
            </div>
            <Link
              href="/student-dashboard/games"
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors items-center space-x-2 font-medium"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Free Play Games</span>
            </Link>
          </div>
        </div>

        {/* Mode Info Banner */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assignment Mode</h2>
              <p className="text-gray-600">Guided learning with teacher-set goals and deadlines</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-4 w-4 text-purple-600" />
                  <p className="text-gray-700 font-medium">Assignment Benefits:</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 list-none pl-0">
                  <li className="flex items-center"><CheckCircle className="h-3 w-3 text-purple-500 mr-2 flex-shrink-0" /> Structured learning path designed by your teacher</li>
                  <li className="flex items-center"><CheckCircle className="h-3 w-3 text-purple-500 mr-2 flex-shrink-0" /> Grades count towards your course progress</li>
                  <li className="flex items-center"><CheckCircle className="h-3 w-3 text-purple-500 mr-2 flex-shrink-0" /> Targeted practice on specific topics</li>
                  <li className="flex items-center"><CheckCircle className="h-3 w-3 text-purple-500 mr-2 flex-shrink-0" /> Clear deadlines to keep you on track</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/student-dashboard/games"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span>Free Play Instead</span>
                </Link>
                <Link
                  href="/student-dashboard/progress"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>View Progress</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Current Assignments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Current Assignments</h2>
              <p className="text-sm text-gray-600">{currentAssignments.length} assignments to complete</p>
            </div>
          </div>

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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet!</h3>
              <p className="text-gray-600">Your teacher hasn't assigned any work yet. Check back later or enjoy some <Link href="/student-dashboard/games" className="text-blue-600 hover:underline">free play games</Link>!</p>
            </div>
          )}
        </div>

        {/* Completed Assignments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Completed Assignments</h2>
                <p className="text-sm text-gray-600">{completedAssignments.length} assignments completed</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold text-sm">
              <Award className="h-4 w-4" />
              <span>Total: {completedAssignments.length}</span>
            </div>
          </div>

        {completedAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No completed assignments yet. Keep up the good work!</p>
            </div>
          )}
        </div>
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