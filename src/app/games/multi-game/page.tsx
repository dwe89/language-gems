'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, Clock, Users, Trophy, Sparkles, Target, Headphones, Zap, Crown, Shuffle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { createBrowserClient } from '../../../lib/supabase-client';

interface Game {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  difficulty: string;
  estimatedTime: string;
  category: string;
  assignmentSupported?: boolean;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  game_config: {
    selectedGames: string[];
    vocabularyConfig: any;
  };
  vocabulary_assignment_list_id: string;
  due_date: string;
  class_name?: string;
}

// Game metadata mapping - only games with confirmed assignment support
const GAME_INFO: Record<string, Omit<Game, 'id'> & { assignmentSupported: boolean }> = {
  'noughts-and-crosses': {
    name: 'Tic-Tac-Toe Vocabulary',
    description: 'Strategic tic-tac-toe with vocabulary questions',
    path: '/games/noughts-and-crosses',
    icon: <Target className="w-6 h-6" />,
    difficulty: 'Beginner',
    estimatedTime: '3-8 min',
    category: 'Vocabulary',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'detective-listening': {
    name: 'Detective Listening',
    description: 'Solve cases by listening to radio transmissions and identifying evidence',
    path: '/games/detective-listening',
    icon: <Headphones className="w-6 h-6" />,
    difficulty: 'Intermediate',
    estimatedTime: '8-15 min',
    category: 'Listening',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'vocab-blast': {
    name: 'Vocab Blast',
    description: 'Fast-paced vocabulary action with themed adventures',
    path: '/games/vocab-blast',
    icon: <Zap className="w-6 h-6" />,
    difficulty: 'Intermediate',
    estimatedTime: '5-12 min',
    category: 'Vocabulary',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'vocab-master': {
    name: 'VocabMaster',
    description: 'Comprehensive vocabulary learning with multiple game modes',
    path: '/games/vocab-master',
    icon: <Crown className="w-6 h-6" />,
    difficulty: 'Adaptive',
    estimatedTime: '10-20 min',
    category: 'Vocabulary',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'word-scramble': {
    name: 'Word Scramble',
    description: 'Unscramble letters to form vocabulary words',
    path: '/games/word-scramble',
    icon: <Shuffle className="w-6 h-6" />,
    difficulty: 'Beginner',
    estimatedTime: '4-8 min',
    category: 'Vocabulary',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'memory-game': {
    name: 'Memory Match',
    description: 'Match vocabulary words with their translations in this classic memory game',
    path: '/games/memory-game',
    icon: <Trophy className="w-6 h-6" />,
    difficulty: 'Beginner',
    estimatedTime: '5-10 min',
    category: 'Vocabulary',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'hangman': {
    name: 'Hangman',
    description: 'Classic word guessing game with vocabulary practice',
    path: '/games/hangman',
    icon: <Users className="w-6 h-6" />,
    difficulty: 'Beginner',
    estimatedTime: '3-7 min',
    category: 'Vocabulary',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'word-blast': {
    name: 'Word Blast',
    description: 'Launch rockets by selecting correct translations',
    path: '/games/word-blast',
    icon: <Play className="w-6 h-6" />,
    difficulty: 'Beginner',
    estimatedTime: '5-12 min',
    category: 'Vocabulary',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'speed-builder': {
    name: 'Speed Builder',
    description: 'Build sentences by dragging words into the correct order',
    path: '/games/speed-builder',
    icon: <Clock className="w-6 h-6" />,
    difficulty: 'Intermediate',
    estimatedTime: '5-10 min',
    category: 'Grammar',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'sentence-towers': {
    name: 'Sentence Towers',
    description: 'Stack sentence components to build towering grammatical structures',
    path: '/games/sentence-towers',
    icon: <Trophy className="w-6 h-6" />,
    difficulty: 'Intermediate',
    estimatedTime: '6-12 min',
    category: 'Grammar',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'conjugation-duel': {
    name: 'Conjugation Duel',
    description: 'Epic verb conjugation battles in different arenas and leagues',
    path: '/games/conjugation-duel',
    icon: <Users className="w-6 h-6" />,
    difficulty: 'Intermediate',
    estimatedTime: '10-20 min',
    category: 'Grammar',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'case-file-translator': {
    name: 'Case File Translator',
    description: 'Translate case files and evidence to solve mysteries',
    path: '/games/case-file-translator',
    icon: <Sparkles className="w-6 h-6" />,
    difficulty: 'Intermediate',
    estimatedTime: '8-15 min',
    category: 'Grammar',
    assignmentSupported: true // ✅ Assignment support implemented
  },
  'lava-temple-word-restore': {
    name: 'Lava Temple: Word Restore',
    description: 'Restore ancient stone tablets by filling in missing words',
    path: '/games/lava-temple-word-restore',
    icon: <Sparkles className="w-6 h-6" />,
    difficulty: 'Intermediate',
    estimatedTime: '8-15 min',
    category: 'Grammar',
    assignmentSupported: true // ✅ Assignment support implemented
  }
  // All games with confirmed assignment support are now included
};

export default function MultiGamePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  useEffect(() => {
    if (assignmentId && mode === 'assignment') {
      fetchAssignment();
    } else {
      setError('Invalid assignment parameters');
      setLoading(false);
    }
  }, [assignmentId, mode]);

  const fetchAssignment = async () => {
    try {
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          description,
          game_config,
          vocabulary_assignment_list_id,
          due_date,
          classes!inner(name)
        `)
        .eq('id', assignmentId)
        .single();

      if (assignmentError) {
        console.error('Assignment fetch error:', assignmentError);
        setError('Failed to load assignment');
        return;
      }

      if (!assignmentData) {
        setError('Assignment not found');
        return;
      }

      // Transform assignment data
      const assignmentWithClassName = {
        ...assignmentData,
        class_name: assignmentData.classes?.name
      };

      setAssignment(assignmentWithClassName);

      // Extract games from assignment config
      const selectedGameIds = assignmentData.game_config?.selectedGames || [];
      const gameList: Game[] = selectedGameIds.map((gameId: string) => {
        const gameInfo = GAME_INFO[gameId];
        if (!gameInfo) {
          console.warn(`Unknown game ID: ${gameId}`);
          return {
            id: gameId,
            name: gameId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: 'Language learning game',
            path: `/games/${gameId}`,
            icon: <Play className="w-6 h-6" />,
            difficulty: 'Medium',
            estimatedTime: '5-10 min',
            category: 'General',
            assignmentSupported: false
          };
        }
        return {
          id: gameId,
          ...gameInfo
        };
      });

      setGames(gameList);
    } catch (err) {
      console.error('Error fetching assignment:', err);
      setError('Error loading assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (game: Game) => {
    if (game.assignmentSupported) {
      // Navigate to the game with assignment parameters
      const gameUrl = `${game.path}?assignment=${assignmentId}&mode=assignment`;
      router.push(gameUrl);
    } else {
      // Show message for unsupported games
      alert(`${game.name} doesn't support assignment mode yet. This feature is coming soon!`);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-lg mb-6">{error}</p>
          <Link
            href="/dashboard/assignments"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Assignment Not Found</h1>
          <Link
            href="/dashboard/assignments"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/dashboard/assignments/${assignmentId}`}
            className="inline-flex items-center text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assignment
          </Link>
        </div>

        {/* Assignment Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{assignment.title}</h1>
          <p className="text-blue-100 mb-4">{assignment.description}</p>
          <div className="flex items-center space-x-6 text-blue-200">
            {assignment.class_name && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Class: {assignment.class_name}
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Due: {new Date(assignment.due_date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Play className="w-4 h-4 mr-2" />
              {games.length} Games
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => handleGameClick(game)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                  {game.icon}
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {game.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {game.name}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {game.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Difficulty: {game.difficulty}</span>
                <span>{game.estimatedTime}</span>
              </div>

              <button
                className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                  game.assignmentSupported
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                }`}
              >
                <Play className="w-4 h-4 mr-2" />
                {game.assignmentSupported ? 'Play Game' : 'Coming Soon'}
              </button>
            </motion.div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">No Games Available</h2>
            <p className="text-blue-200">This assignment doesn't have any games configured.</p>
          </div>
        )}
      </div>
    </div>
  );
}
