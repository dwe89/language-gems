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
    'hangman': 'hangman',
    'noughts-and-crosses': 'noughts-and-crosses',
    'speed-builder': 'speed-builder',
    'vocabulary-mining': 'vocabulary-mining',
    'detective-listening': 'detective-listening',

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
          .from('assignment_progress')
          .select('status, score, accuracy, time_spent, completed_at')
          .eq('assignment_id', assignmentId)
          .eq('student_id', user.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          console.error('Error fetching assignment progress:', progressError);
          // Continue without progress data
        }

        // Check if this is a multi-game assignment
        const isMultiGame = assignmentData.game_config?.multiGame && assignmentData.game_config?.selectedGames?.length > 1;
        
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

        let games: any[];
        
        if (isMultiGame) {
          // Multi-game assignment
          games = assignmentData.game_config.selectedGames.map((gameId: string) => {
            const gameInfo = gameNameMap[gameId] || { name: gameId, description: 'Language learning game' };
            // Use assignment progress for all games in multi-game assignments
            const isCompleted = assignmentProgress?.status === 'completed';
            return {
              id: gameId,
              name: gameInfo.name,
              description: gameInfo.description,
              completed: isCompleted,
              score: assignmentProgress?.score || 0,
              timeSpent: assignmentProgress?.time_spent || 0
            };
          });
        } else {
          // Single game assignment
          const gameInfo = gameNameMap[assignmentData.game_type] || { name: assignmentData.game_type, description: 'Language learning game' };
          const isCompleted = assignmentProgress?.status === 'completed';
          games = [{
            id: assignmentData.game_type,
            name: gameInfo.name,
            description: gameInfo.description,
            completed: isCompleted,
            score: assignmentProgress?.score || 0,
            timeSpent: assignmentProgress?.time_spent || 0
          }];
        }

        const completedGames = games.filter(g => g.completed).length;
        const overallProgress = games.length > 0 ? (completedGames / games.length) * 100 : 0;

        setAssignment({
          id: assignmentData.id,
          title: assignmentData.title,
          description: assignmentData.description,
          dueDate: assignmentData.due_date ? new Date(assignmentData.due_date).toLocaleDateString() : undefined,
          isMultiGame,
          games,
          totalGames: games.length,
          completedGames,
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
  }, [user, assignmentId]);

  const handlePlayGame = (gameId: string) => {
    const previewParam = isPreviewMode ? '&preview=true' : '';
    router.push(`/games/${mapGameTypeToPath(gameId)}?assignment=${assignmentId}&mode=assignment${previewParam}`);
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
                <div className="flex items-center">
                  <Gamepad2 className="h-4 w-4 mr-1" />
                  <span>{assignment.totalGames} game{assignment.totalGames !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  <span>{assignment.completedGames} / {assignment.totalGames} completed</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(assignment.overallProgress)}%
              </div>
              <div className="text-sm text-gray-500">Progress</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${assignment.overallProgress}%` }}
            ></div>
          </div>
          
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

      {/* Games List */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {assignment.isMultiGame ? 'Games to Complete' : 'Assignment Game'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignment.games.map((game: any, index: number) => (
            <div
              key={game.id}
              className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
                game.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                </div>
                
                {game.completed && (
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                )}
              </div>
              
              {game.completed && (game.score !== undefined || game.timeSpent !== undefined) && (
                <div className="bg-white rounded-lg p-3 mb-4 border border-green-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {game.score !== undefined && (
                      <div>
                        <span className="text-gray-500">Score:</span>
                        <span className="font-medium text-gray-900 ml-1">{game.score}%</span>
                      </div>
                    )}
                    {game.timeSpent !== undefined && (
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium text-gray-900 ml-1">{Math.round(game.timeSpent / 60)}m</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => handlePlayGame(game.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  game.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Play className="h-4 w-4 mr-2" />
                {game.completed ? 'Play Again' : 'Start Game'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 