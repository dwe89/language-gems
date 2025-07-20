'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hexagon, Star, Clock, Users, Loader2, BookOpen } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useGameProgress } from '../../../hooks/useGameProgress';
import { GameSummary } from '../../../services/gameProgressService';

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
  path?: string; // Add path property for direct linking
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
        {game.highScore !== undefined && (
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            High Score: {game.highScore}
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
          <Link 
            href={gamePath}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Play Now
          </Link>
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

export default function GamesPage() {
  const { user } = useAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  const { getGameProgress, getStats } = useGameProgress();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameProgressMap, setGameProgressMap] = useState<Record<string, GameSummary[]>>({});

  // Default placeholder games in case of database error
  const placeholderGames: Game[] = [
    {
      id: '1',
      title: 'Gem Collector',
      description: 'Move up and down to collect the correct translation gems while avoiding wrong ones! A fast-paced language learning adventure.',
      thumbnail: '/images/games/gem-collector.png',
      playTime: '3-8 min',
      gemColor: 'text-blue-500',
      difficulty: 1,
      players: 'Single Player',
      isFeatured: true,
      path: '/games/gem-collector'
    },
    {
      id: '2',
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
      id: '3',
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
      id: '4',
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
      id: '5',
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
      id: '6',
      title: 'Sentence Sprint',
      description: 'Drag and drop words to build sentences correctly before time runs out.',
      thumbnail: '/images/games/speed-builder.jpg',
      playTime: '5-10 min',
      gemColor: 'text-red-500',
      difficulty: 2,
      players: 'Single Player',
      path: '/games/speed-builder'
    },
    {
      id: '7',
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
      id: '8',
      title: 'Noughts and Crosses',
      description: 'Classic tic-tac-toe game with a language learning twist. Match words to their meanings!',
      thumbnail: '/images/games/noughts-and-crosses.jpg',
      playTime: '3-5 min',
      gemColor: 'text-indigo-500',
      difficulty: 1,
      players: '1-2 Players',
      path: '/games/noughts-and-crosses'
    },
  ];

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Always use our placeholder games to ensure we show all available games
        setGames(placeholderGames);
        
        // If user is logged in, fetch game progress
        let allGameProgress: Record<string, GameSummary[]> = {};
        if (user) {
          try {
            // Get game stats which already contains recent games and avoids extra fetches
            const stats = await getStats();
            
            // Group game progress by gameId
            if (stats.recentGames && stats.recentGames.length > 0) {
              stats.recentGames.forEach(progress => {
                if (!allGameProgress[progress.gameId]) {
                  allGameProgress[progress.gameId] = [];
                }
                allGameProgress[progress.gameId].push(progress);
              });
            }
            
            setGameProgressMap(allGameProgress);
            
            // Update placeholder games with user progress data
            const gamesWithProgress = placeholderGames.map(game => {
              // If we have progress for this game, add high score and last played
              if (allGameProgress[game.id] && allGameProgress[game.id].length > 0) {
                const gameProgress = allGameProgress[game.id];
                const highScore = Math.max(...gameProgress.map(p => p.score));
                const lastPlayed = gameProgress[0].playedAt;
                
                return {
                  ...game,
                  highScore,
                  lastPlayed
                };
              }
              return game;
            });
            
            setGames(gamesWithProgress);
          } catch (progressError) {
            console.error('Failed to fetch game progress:', progressError);
          }
        }
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
  }, [user]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🎮 Games Library</h1>
          <p className="text-indigo-100 mt-2">Choose any game and start earning gems!</p>
        </div>
        <Link 
          href="/student-dashboard/assignments"
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <BookOpen className="h-4 w-4" />
          <span>Check Assignments</span>
        </Link>
      </div>

      {/* Mode Selection Banner */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Hexagon className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">🎯 Free Play Mode</h2>
            <p className="text-gray-600">Play any game for fun and practice - all progress counts!</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <p className="text-gray-700 font-medium mb-2">✨ How Free Play Works:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Play any game below to earn gems and XP</li>
                <li>• Practice weak vocabulary topics</li>
                <li>• All progress contributes to your level and leaderboard ranking</li>
                <li>• No time limits or pressure - learn at your own pace!</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link 
                href="/student-dashboard/assignments"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                📚 View Homework Instead
              </Link>
              <Link 
                href="/student-dashboard/vocabulary"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                📖 Study Vocabulary
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Games Section */}
      {games.filter(game => game.isFeatured).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">⭐ Featured Games</h2>
            <span className="text-sm text-gray-500">Most popular with students</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.filter(game => game.isFeatured).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* All Games Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🎮 All Games</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{games.length} games available</span>
          </div>
        </div>
        
        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Hexagon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Games Available</h3>
            <p className="text-gray-500 mb-4">
              {error ? 'There was an error loading games. Please try again later.' : 'Games are being added. Check back soon!'}
            </p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">💡 Learning Tips</h3>
            <p className="text-gray-600 text-sm">Get the most out of your LanguageGems experience</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-gray-900">🎯 Focus on weak areas:</p>
            <p className="text-gray-600">Check your vocabulary progress to see which topics need more practice.</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">⚡ Play regularly:</p>
            <p className="text-gray-600">Short, frequent sessions are more effective than long cramming sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force client-side rendering to avoid build issues with Supabase
export const dynamic = 'force-dynamic'; 