'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';

const games = [
  {
    id: 'hangman',
    title: 'El Ahorcado (Hangman)',
    description: 'Guess the hidden word before the hangman is complete!',
    icon: '🎮',
    color: 'bg-purple-500',
    available: true,
    difficulty: 'Intermediate',
    languages: ['Spanish']
  },
  {
    id: 'memory-game',
    title: 'Memory Match',
    description: 'Match pairs of words and images to test your memory and vocabulary.',
    icon: '🧠',
    color: 'bg-blue-500',
    available: true,
    difficulty: 'Beginner',
    languages: ['Multiple']
  },
  {
    id: 'word-association',
    title: 'Word Association',
    description: 'Identify words that are semantically related to build your vocabulary.',
    icon: '🔗',
    color: 'bg-purple-600',
    available: true,
    difficulty: 'Intermediate',
    languages: ['English', 'Spanish', 'French']
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble the letters to form correct words.',
    icon: '🔤',
    color: 'bg-green-500',
    available: true,
    difficulty: 'Beginner',
    languages: ['Spanish', 'English']
  },
  {
    id: 'emoji-game',
    title: 'Emoji Challenge',
    description: 'Match emojis with their correct vocabulary words.',
    icon: '😀',
    color: 'bg-yellow-500',
    available: false,
    difficulty: 'Beginner',
    languages: ['Planned']
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    description: 'Create grammatically correct sentences from word blocks.',
    icon: '📝',
    color: 'bg-indigo-600',
    available: true,
    difficulty: 'All Levels',
    languages: ['English', 'Spanish', 'French']
  },
  {
    id: 'verb-quest',
    title: 'Verb Quest',
    description: 'Practice verb conjugations in various tenses.',
    icon: '⚔️',
    color: 'bg-indigo-500',
    available: false,
    difficulty: 'Intermediate',
    languages: ['Planned']
  },
  {
    id: 'verb-conjugation-ladder',
    title: 'Conjugation Ladder',
    description: 'Climb the ladder by correctly conjugating verbs in various tenses.',
    icon: '🪜',
    color: 'bg-orange-500',
    available: true,
    difficulty: 'All Levels',
    languages: ['Spanish', 'French', 'English']
  },
  {
    id: 'noughts-and-crosses',
    title: 'Noughts & Crosses',
    description: 'Classic tic-tac-toe with a language learning twist.',
    icon: '⭕',
    color: 'bg-pink-500',
    available: true,
    difficulty: 'Beginner',
    languages: ['Spanish', 'French', 'German', 'Italian']
  },
  {
    id: 'fill-lyrics',
    title: 'Lyric Fill',
    description: 'Fill in the missing words from popular song lyrics.',
    icon: '🎵',
    color: 'bg-teal-500',
    available: false,
    difficulty: 'Advanced',
    languages: ['Planned']
  }
];

export default function GamesPage() {
  const [filter, setFilter] = React.useState('all');
  const [difficulty, setDifficulty] = React.useState('all');
  const { user, refreshSession } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    // Explicitly refresh the auth session when component mounts
    const checkAuthStatus = async () => {
      console.log('Games page - Initial auth state:', { 
        isAuthenticated, 
        userId: user?.id,
        userMetadata: user?.user_metadata 
      });
      
      // Refresh session to ensure we have the latest auth state
      await refreshSession();
      
      console.log('Games page - Auth state after refresh:', { 
        isAuthenticated: !!user, 
        userId: user?.id,
        userMetadata: user?.user_metadata 
      });
    };
    
    checkAuthStatus();
  }, [user, isAuthenticated, refreshSession]);

  // For non-authenticated users, only show a subset of games as preview
  const previewGames = isAuthenticated ? games : games.slice(0, 3);
  
  const filteredGames = previewGames.filter(game => 
    (filter === 'all' || game.available === (filter === 'available')) &&
    (difficulty === 'all' || game.difficulty.toLowerCase() === difficulty)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Language Learning Games</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Enhance your language skills with our interactive games designed to make learning fun and effective.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-bold">Preview Mode:</span> You're viewing a limited selection of games. 
                <Link href="/auth/signup" className="ml-1 font-medium underline">Sign up</Link> or 
                <Link href="/auth/login" className="ml-1 font-medium underline">log in</Link> to access all games with full functionality.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-8 space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">Game Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Games</option>
            <option value="available">Available Games</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div 
            key={game.id} 
            className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 relative"
          >
            <div className={`${game.color} p-6 text-white h-full flex flex-col`}>
              <div className="text-5xl mb-4">{game.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
              <p className="mb-4 flex-grow">{game.description}</p>
              
              <div className="mb-4 text-sm">
                <span className="mr-2 bg-white/20 px-2 py-1 rounded">
                  Difficulty: {game.difficulty}
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  Languages: {game.languages.join(', ')}
                </span>
              </div>

              {game.available ? (
                isAuthenticated ? (
                  <Link 
                    href={`/games/${game.id}`} 
                    className="inline-block bg-white text-gray-800 font-medium py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-colors text-center"
                  >
                    Play Now
                  </Link>
                ) : (
                  <Link 
                    href="/auth/signup" 
                    className="inline-block bg-white text-gray-800 font-medium py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-colors text-center"
                  >
                    Sign Up to Play
                  </Link>
                )
              ) : (
                <button 
                  disabled 
                  className="inline-block bg-gray-200 text-gray-500 font-medium py-2 px-6 rounded-full cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!isAuthenticated && (
        <div className="mt-12 bg-blue-600 text-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Unlock all language learning games!</h2>
          <p className="mb-6 text-lg">
            Create an account to access our full collection of interactive games and track your progress.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/signup" 
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-blue-700 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-800 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 