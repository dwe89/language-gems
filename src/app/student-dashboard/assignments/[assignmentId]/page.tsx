'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, CheckCircle, Clock, Gamepad2, Target, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';

// Map game types to actual game directory paths
const mapGameTypeToPath = (gameType: string | null): string => {
  if (!gameType) return 'memory-game';

  const gameTypeMap: Record<string, string> = {
    // Direct mappings for existing games
    'memory-game': 'memory-game',
    'vocab-blast': 'vocab-blast',
    'vocab-master': 'vocab-master', // ✅ VocabMaster assignment support
    'hangman': 'hangman',
    'noughts-and-crosses': 'noughts-and-crosses',
    'speed-builder': 'speed-builder',
    'vocabulary-mining': 'vocabulary-mining',
    'detective-listening': 'detective-listening',
    'word-scramble': 'word-scramble', // ✅ Word Scramble assignment support
    'memory-game': 'memory-game', // ✅ Memory Game assignment support
    'hangman': 'hangman', // ✅ Hangman assignment support
    'word-blast': 'word-blast', // ✅ Word Blast assignment support
    'speed-builder': 'speed-builder', // ✅ Speed Builder assignment support
    'sentence-towers': 'sentence-towers', // ✅ Sentence Towers assignment support
    'conjugation-duel': 'conjugation-duel', // ✅ Conjugation Duel assignment support
    'case-file-translator': 'case-file-translator', // ✅ Case File Translator assignment support
    'lava-temple-word-restore': 'lava-temple-word-restore', // ✅ Lava Temple assignment support

    // Legacy mappings for potential mismatches
    'quiz': 'memory-game', // Fallback for quiz to memory game
    'word-blast': 'vocab-blast', // Map word-blast to vocab-blast
    'tic-tac-toe': 'noughts-and-crosses', // Alternative name
    'tictactoe': 'noughts-and-crosses', // Alternative name
    'gem-collector': 'vocabulary-mining', // Map gem collector to vocabulary mining
    'translation-tycoon': 'speed-builder', // Map to closest equivalent
    'conjugation-duel': 'conjugation-duel',
    'word-scramble': 'word-scramble',
    'word-guesser': 'hangman', // Map to closest equivalent
    'sentence-towers': 'sentence-towers',
    'sentence-builder': 'speed-builder', // Map to closest equivalent
    'word-association': 'memory-game', // Map to closest equivalent
  };

  return gameTypeMap[gameType] || 'memory-game'; // Default fallback
};

export default function StudentAssignmentDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.assignmentId as string;
  
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Check if this is a preview mode (teacher viewing the assignment)
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  useEffect(() => {
    // Check if preview mode is enabled from URL params
    const urlParams = new URLSearchParams(window.location.search);
    setIsPreviewMode(urlParams.get('preview') === 'true');
  }, []);

  useEffect(() => {
    if (!user || !assignmentId) return;

    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        const supabase = supabaseBrowser;

        // Get assignment details
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            due_date,
            game_type,
            game_config
          `)
          .eq('id', assignmentId)
          .single();

        if (assignmentError) {
          console.error('Error fetching assignment:', assignmentError);
          setError('Failed to load assignment details');
          return;
        }

        if (!assignmentData) {
          setError('Assignment not found');
          return;
        }

        // Get assignment completion status for this student
        const { data: assignmentProgress, error: progressError } = await supabase
          .from('enhanced_assignment_progress')
          .select('status, best_score, best_accuracy, total_time_spent, completed_at')
          .eq('assignment_id', assignmentId)
          .eq('student_id', user.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          console.error('Error fetching assignment progress:', progressError);
          // Continue without progress data
        }

        // Get individual game progress for multi-game assignments
        const { data: gameProgressData, error: gameProgressError } = await supabase
          .from('assignment_game_progress')
          .select('game_id, status, score, accuracy, time_spent, completed_at')
          .eq('assignment_id', assignmentId)
          .eq('student_id', user.id);

        if (gameProgressError) {
          console.error('Error fetching game progress:', gameProgressError);
          // Continue without game progress data
        }

        // Check if this is a multi-game assignment
        const isMultiGame = assignmentData.game_type === 'multi-game' ||
                           assignmentData.game_type === 'mixed-mode' ||
                           (assignmentData.game_config?.multiGame && assignmentData.game_config?.selectedGames?.length > 1) ||
                           (assignmentData.game_config?.gameConfig?.selectedGames && assignmentData.game_config.gameConfig.selectedGames.length > 1);
        
        const gameNameMap: Record<string, { name: string; description: string }> = {
          'vocabulary-mining': { name: 'Vocabulary Mining', description: 'Mine vocabulary gems to build your collection' },
          'memory-game': { name: 'Memory Match', description: 'Match vocabulary pairs to improve recall' },
          'memory-match': { name: 'Memory Match', description: 'Match vocabulary pairs to improve recall' },
          'word-blast': { name: 'Word Blast', description: 'Fast-paced sentence building with falling words' },
          'vocab-blast': { name: 'Vocab Blast', description: 'Click vocabulary objects in themed environments' },
          'speed-builder': { name: 'Speed Builder', description: 'Build sentences quickly and accurately' },
          'translation-tycoon': { name: 'Translation Tycoon', description: 'Build your business empire with vocabulary' },
          'conjugation-duel': { name: 'Conjugation Duel', description: 'Epic verb battles in different arenas' },
          'word-scramble': { name: 'Word Scramble', description: 'Unscramble letters to form words' },
          'gem-collector': { name: 'Gem Collector', description: 'Collect gems by translating words correctly' },
          'hangman': { name: 'Hangman', description: 'Guess the word before the drawing is complete' },
          'word-guesser': { name: 'Word Guesser', description: 'Guess words based on definitions and clues' },
          'sentence-towers': { name: 'Sentence Towers', description: 'Build towers by constructing sentences' },
          'sentence-builder': { name: 'Sentence Builder', description: 'Drag and drop words to build sentences' },
          'word-association': { name: 'Word Association', description: 'Connect related words and concepts' }
        };

        let games: any[] = [];
        let assessments: any[] = [];

        if (isMultiGame) {
          // Multi-game assignment - handle both old and new config structures
          const selectedGames = assignmentData.game_config?.selectedGames ||
                               assignmentData.game_config?.gameConfig?.selectedGames ||
                               [];

          games = selectedGames.map((gameId: string) => {
            const gameInfo = gameNameMap[gameId] || { name: gameId, description: 'Language learning game' };

            // Find individual game progress
            const gameProgress = gameProgressData?.find(gp => gp.game_id === gameId);
            const isCompleted = gameProgress?.status === 'completed';

            return {
              id: gameId,
              name: gameInfo.name,
              description: gameInfo.description,
              type: 'game',
              completed: isCompleted,
              score: gameProgress?.score || 0,
              accuracy: gameProgress?.accuracy || 0,
              timeSpent: gameProgress?.time_spent || 0,
              completedAt: gameProgress?.completed_at
            };
          });

          // Extract assessments from the assignment config
          const selectedAssessments = assignmentData.game_config?.assessmentConfig?.selectedAssessments || [];

          assessments = selectedAssessments.map((assessment: any) => {
            // Find individual assessment progress
            const assessmentProgress = gameProgressData?.find(gp => gp.game_id === assessment.id);
            const isCompleted = assessmentProgress?.status === 'completed';

            return {
              id: assessment.id,
              name: assessment.name,
              description: `${assessment.estimatedTime} • ${assessment.skills?.join(', ') || 'Assessment'}`,
              type: 'assessment',
              assessmentType: assessment.type,
              completed: isCompleted,
              score: assessmentProgress?.score || 0,
              accuracy: assessmentProgress?.accuracy || 0,
              timeSpent: assessmentProgress?.time_spent || 0,
              completedAt: assessmentProgress?.completed_at
            };
          });
        } else {
          // Single game assignment - use overall assignment progress
          const gameInfo = gameNameMap[assignmentData.game_type] || { name: assignmentData.game_type, description: 'Language learning game' };
          const isCompleted = assignmentProgress?.status === 'completed';
          games = [{
            id: assignmentData.game_type,
            name: gameInfo.name,
            description: gameInfo.description,
            type: 'game',
            completed: isCompleted,
            score: assignmentProgress?.best_score || 0,
            accuracy: assignmentProgress?.best_accuracy || 0,
            timeSpent: assignmentProgress?.total_time_spent || 0,
            completedAt: assignmentProgress?.completed_at
          }];
        }

        const allActivities = [...games, ...assessments];
        const completedActivities = allActivities.filter(a => a.completed).length;
        const overallProgress = allActivities.length > 0 ? Math.round((completedActivities / allActivities.length) * 100) : 0;

        console.log('Assignment progress calculation:', {
          totalGames: games.length,
          totalAssessments: assessments.length,
          totalActivities: allActivities.length,
          completedActivities,
          overallProgress,
          games: games.map(g => ({ id: g.id, name: g.name, completed: g.completed })),
          assessments: assessments.map(a => ({ id: a.id, name: a.name, completed: a.completed }))
        });

        setAssignment({
          id: assignmentData.id,
          title: assignmentData.title,
          description: assignmentData.description,
          dueDate: assignmentData.due_date ? new Date(assignmentData.due_date).toLocaleDateString() : undefined,
          isMultiGame,
          games,
          assessments,
          allActivities,
          totalGames: games.length,
          totalAssessments: assessments.length,
          totalActivities: allActivities.length,
          completedGames: games.filter(g => g.completed).length,
          completedAssessments: assessments.filter(a => a.completed).length,
          completedActivities,
          overallProgress
        });

      } catch (err) {
        console.error('Error in fetchAssignmentDetail:', err);
        setError('Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetail();
  }, [user, assignmentId, refreshKey]);

  // Function to refresh assignment data (called when returning from games)
  const refreshAssignmentData = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    // Reset refreshing state after a delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Listen for focus events to refresh data when returning from games
  useEffect(() => {
    const handleFocus = () => {
      // Small delay to ensure any database updates have been processed
      setTimeout(() => {
        refreshAssignmentData();
      }, 1000);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handlePlayGame = (gameId: string) => {
    const previewParam = isPreviewMode ? '&preview=true' : '';
    router.push(`/games/${mapGameTypeToPath(gameId)}?assignment=${assignmentId}&mode=assignment${previewParam}`);
  };

  const handlePlayAssessment = (assessment: any) => {
    const previewParam = isPreviewMode ? '&preview=true' : '';
    let assessmentUrl = '';

    switch (assessment.assessmentType) {
      case 'reading-comprehension':
        assessmentUrl = `/assessments/reading-comprehension?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'aqa-reading':
        assessmentUrl = `/assessments/aqa-reading?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'aqa-listening':
        assessmentUrl = `/assessments/aqa-listening?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'dictation':
        assessmentUrl = `/assessments/dictation?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'four-skills':
        assessmentUrl = `/assessments/four-skills?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'listening-comprehension':
        assessmentUrl = `/assessments/listening-comprehension?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'exam-style-questions':
        assessmentUrl = `/assessments/exam-style-questions?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      default:
        alert(`Assessment type "${assessment.assessmentType}" is not yet supported.`);
        return;
    }

    router.push(assessmentUrl);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="space-y-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Assignment not found'}
        </div>
        <Link
          href="/student-dashboard/assignments"
          className="inline-flex items-center text-white hover:text-indigo-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        {isPreviewMode ? (
          <Link
            href="/dashboard/assignments"
            className="inline-flex items-center text-white hover:text-indigo-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teacher Dashboard
          </Link>
        ) : (
          <Link
            href="/student-dashboard/assignments"
            className="inline-flex items-center text-white hover:text-indigo-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
        )}
        
        {isPreviewMode && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="w-5 h-5 text-yellow-600 mr-2">ℹ️</div>
              <div>
                <p className="font-medium">Teacher Preview Mode</p>
                <p className="text-sm">You are viewing this assignment as your students would see it.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
              {assignment.description && (
                <p className="text-gray-600 text-lg mb-4">{assignment.description}</p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                {assignment.dueDate && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                )}
                {assignment.totalGames > 0 && (
                  <div className="flex items-center">
                    <Gamepad2 className="h-4 w-4 mr-1" />
                    <span>{assignment.totalGames} game{assignment.totalGames !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {assignment.totalAssessments > 0 && (
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    <span>{assignment.totalAssessments} assessment{assignment.totalAssessments !== 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>{assignment.completedActivities} / {assignment.totalActivities} completed</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-3xl font-bold ${assignment.overallProgress === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                {Math.round(assignment.overallProgress)}%
              </div>
              <div className="text-sm text-gray-500">
                Progress
                {isRefreshing && (
                  <span className="ml-2 text-xs text-blue-600 animate-pulse">Updating...</span>
                )}
              </div>
              {assignment.overallProgress === 100 && (
                <div className="flex items-center justify-end mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-xs font-medium text-green-700">Complete!</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 shadow-inner">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${
                assignment.overallProgress === 100
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${assignment.overallProgress}%` }}
            ></div>
          </div>

          {assignment.overallProgress === 100 && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                🎉 Congratulations! You've completed all games in this assignment.
              </p>
            </div>
          )}
          
          {assignment.isMultiGame && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">Multi-Game Assignment</p>
                  <p className="text-sm text-blue-700">Complete all games to finish this assignment. You can play them in any order!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {assignment.isMultiGame ? 'Activities to Complete' : 'Assignment Activity'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignment.allActivities.map((activity: any, index: number) => (
            <div
              key={activity.id}
              className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                activity.completed
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100 shadow-green-100'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-indigo-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${
                      activity.type === 'game'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {activity.type === 'game' ? 'GAME' : 'ASSESSMENT'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
                </div>

                {activity.completed && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                      COMPLETED
                    </span>
                  </div>
                )}
              </div>

              {activity.completed && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-green-200 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {activity.score !== undefined && (
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div>
                          <span className="text-gray-500">Score:</span>
                          <span className="font-bold text-green-700 ml-1">{activity.score} XP</span>
                        </div>
                      </div>
                    )}
                    {activity.accuracy !== undefined && activity.accuracy > 0 && (
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <div>
                          <span className="text-gray-500">Accuracy:</span>
                          <span className="font-bold text-blue-700 ml-1">{Math.round(activity.accuracy)}%</span>
                        </div>
                      </div>
                    )}
                    {activity.timeSpent !== undefined && activity.timeSpent > 0 && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <span className="font-bold text-purple-700 ml-1">{Math.round(activity.timeSpent / 60)}m</span>
                        </div>
                      </div>
                    )}
                    {activity.completedAt && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <span className="font-medium text-gray-700 ml-1">
                            {new Date(activity.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => activity.type === 'game' ? handlePlayGame(activity.id) : handlePlayAssessment(activity)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 ${
                  activity.completed
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                    : activity.type === 'game'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg'
                }`}
              >
                <Play className="h-4 w-4 mr-2" />
                {activity.completed
                  ? (activity.type === 'game' ? 'Play Again' : 'Retake Assessment')
                  : (activity.type === 'game' ? 'Start Game' : 'Start Assessment')
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 