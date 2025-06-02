'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hexagon, Star, Clock, Users, Loader2, PlusCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '../../../components/auth/AuthProvider';

type Game = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  playTime: string;
  gemColor: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  players: string;
  isNew?: boolean;
  isFeatured?: boolean;
  lastPlayed?: string;
  highScore?: number;
  path?: string;
};

// Component to display a game card
const GameCard = ({ game }: { game: Game }) => {
  // Generate game path based on title or use predefined path
  const gamePath = game.path || `/games/${game.title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image 
          src={game.thumbnail || '/placeholder.svg'} 
          alt={game.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={game.isFeatured}
          onError={(e) => {
            // If image fails to load, replace with placeholder
            const target = e.target as HTMLImageElement;
            target.onerror = null; // prevent infinite loop
            target.src = '/placeholder.svg';
          }}
        />
        {game.isNew && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            NEW
          </div>
        )}
        {game.isFeatured && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            FEATURED
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold">{game.title}</h3>
          <div className={`${game.gemColor} mt-1`}>
            <Hexagon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{game.description}</p>
        
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{game.playTime}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{game.players}</span>
          </div>
        </div>
        
        <div className="flex justify-end items-center mt-4">
          <div className="flex space-x-2">
            <Link 
              href={`/dashboard/assignments/new?game=${game.id}`}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              Assign
            </Link>
            <Link 
              href={gamePath}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component to show while fetching data
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    <span className="ml-2 text-indigo-600">Loading games...</span>
  </div>
);

export default function TeacherGamesPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default placeholder games in case of database error
  const placeholderGames: Game[] = [
    {
      id: '1',
      title: 'Translation Tycoon',
      description: 'Build your own translation empire and learn vocabulary in a fun, interactive way!',
      thumbnail: '/images/games/translation-tycoon.png',
      playTime: '5-15 min',
      gemColor: 'text-blue-500',
      difficulty: 2,
      players: 'Single Player',
      isFeatured: true,
      path: '/games/translation-tycoon'
    },
    {
      id: '2',
      title: 'Word Blast',
      description: 'Launch rockets by selecting the correct word translations before time runs out!',
      thumbnail: '/images/games/word-blast.jpg',
      playTime: '3-5 min',
      gemColor: 'text-green-500',
      difficulty: 1,
      players: 'Single Player',
      path: '/games/word-blast'
    },
    {
      id: '3',
      title: 'Hangman',
      description: 'Classic word guessing game to practice vocabulary.',
      thumbnail: '/images/games/hangman.jpg',
      playTime: '5-10 min',
      gemColor: 'text-purple-500',
      difficulty: 3,
      players: 'Single Player',
      path: '/games/hangman'
    },
    {
      id: '4',
      title: 'Memory Game',
      description: 'Match pairs of cards to build vocabulary and memory skills.',
      thumbnail: '/images/games/memory-game.jpg',
      playTime: '5-10 min',
      gemColor: 'text-pink-500',
      difficulty: 2,
      players: 'Single Player',
      isNew: true,
      path: '/games/memory-game'
    },
    {
      id: '5',
      title: 'Speed Builder',
      description: 'Drag and drop words to build sentences correctly before time runs out.',
      thumbnail: '/images/games/speed-builder.jpg',
      playTime: '5-10 min',
      gemColor: 'text-red-500',
      difficulty: 2,
      players: 'Single Player',
      path: '/games/speed-builder'
    },
    {
      id: '6',
      title: 'Sentence Towers',
      description: 'Build towers by matching words to translations. Wrong answers make towers fall!',
      thumbnail: '/images/games/sentence-towers.jpg',
      playTime: '5-15 min',
      gemColor: 'text-yellow-500',
      difficulty: 4,
      players: 'Single Player',
      path: '/games/sentence-towers'
    },
    {
      id: '7',
      title: 'Noughts and Crosses',
      description: 'Classic tic-tac-toe game with a language learning twist. Match words to their meanings!',
      thumbnail: '/images/games/noughts-and-crosses.jpg',
      playTime: '3-5 min',
      gemColor: 'text-indigo-500',
      difficulty: 1,
      players: '1-2 Players',
      path: '/games/noughts-and-crosses'
    },
    {
      id: '8',
      title: 'Verb Conjugation Ladder',
      description: 'Climb the ladder by correctly conjugating verbs in different tenses and forms.',
      thumbnail: '/images/games/verb-conjugation-ladder.jpg',
      playTime: '5-10 min',
      gemColor: 'text-amber-500',
      difficulty: 3,
      players: 'Single Player',
      path: '/games/verb-conjugation-ladder'
    },
    {
      id: '9',
      title: 'Word Association',
      description: 'Connect related words to build your vocabulary network and understanding.',
      thumbnail: '/images/games/word-association.jpg',
      playTime: '5-10 min',
      gemColor: 'text-emerald-500',
      difficulty: 2,
      players: 'Single Player',
      path: '/games/word-association'
    },
    {
      id: '10',
      title: 'Word Scramble',
      description: 'Unscramble jumbled letters to form words and phrases in your target language.',
      thumbnail: '/images/games/word-scramble.jpg',
      playTime: '3-8 min',
      gemColor: 'text-cyan-500',
      difficulty: 2,
      players: 'Single Player',
      path: '/games/word-scramble'
    }
  ];

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Always use placeholder games to ensure we show all actual games
        setGames(placeholderGames);
      } catch (error) {
        console.error('Error loading games:', error);
        setError(error instanceof Error ? error.message : 'Unknown error loading games');
        
        // Use placeholder games as fallback
        setGames(placeholderGames);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  const featuredGames = games.filter(game => game.isFeatured);
  const newGames = games.filter(game => game.isNew && !game.isFeatured);
  const regularGames = games.filter(game => !game.isFeatured && !game.isNew);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-900">Games Library</h1>
        <Link 
          href="/dashboard/assignments/new" 
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Assignment
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Featured Games */}
      {featuredGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-900 mb-4">Featured Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}
      
      {/* New Games */}
      {newGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-900 mb-4">New Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}
      
      {/* All Games */}
      <div>
        <h2 className="text-xl font-bold text-indigo-900 mb-4">All Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
} 