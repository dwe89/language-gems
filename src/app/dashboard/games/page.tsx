'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, Search, Users, User, Loader2, PlayCircle, BookOpen, Eye, Grid3X3, List, Gamepad2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '../../../components/auth/AuthProvider';

type GameMode = 'Student Only' | 'Classroom & Student' | 'Classroom Only';
type ViewMode = 'cards' | 'table';

type Game = {
  id: string;
  name: string;
  description: string;
  mode: GameMode;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isNew?: boolean;
  isFeatured?: boolean;
  path?: string;
  icon?: string;
  color?: string;
};

type FilterType = 'All' | 'Classroom Games' | 'Student Games';

// Action buttons component based on game mode
const ActionButtons = ({ game, size = 'default' }: { game: Game; size?: 'default' | 'small' }) => {
  const gamePath = game.path || `/games/${game.name.toLowerCase().replace(/\s+/g, '-')}`;
  const buttonClass = size === 'small' 
    ? "px-2 py-1 rounded text-xs transition-colors inline-flex items-center"
    : "px-3 py-1.5 rounded text-sm transition-colors inline-flex items-center";
  const iconClass = size === 'small' ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1";
  
  const getButtons = () => {
    switch (game.mode) {
      case 'Student Only':
        return (
          <>
            <Link 
              href={`/dashboard/assignments/new?game=${game.id}`}
              className={`bg-green-600 hover:bg-green-700 text-white ${buttonClass}`}
            >
              <BookOpen className={iconClass} />
              Assign
            </Link>
            <Link 
              href={gamePath}
              className={`bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`}
            >
              <Eye className={iconClass} />
              Preview
            </Link>
          </>
        );
        
      case 'Classroom & Student':
        return (
          <>
            <Link 
              href={`/dashboard/assignments/new?game=${game.id}`}
              className={`bg-green-600 hover:bg-green-700 text-white ${buttonClass}`}
            >
              <BookOpen className={iconClass} />
              Assign
            </Link>
            <Link 
              href={gamePath + '?mode=classroom'}
              className={`bg-purple-600 hover:bg-purple-700 text-white ${buttonClass}`}
            >
              <PlayCircle className={iconClass} />
              Launch
            </Link>
            <Link 
              href={gamePath}
              className={`bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`}
            >
              <Eye className={iconClass} />
              Preview
            </Link>
          </>
        );
        
      case 'Classroom Only':
        return (
          <>
            <Link 
              href={gamePath + '?mode=classroom'}
              className={`bg-purple-600 hover:bg-purple-700 text-white ${buttonClass}`}
            >
              <PlayCircle className={iconClass} />
              Launch
            </Link>
            <Link 
              href={gamePath}
              className={`bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`}
            >
              <Eye className={iconClass} />
              Preview
            </Link>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-2 ${size === 'small' ? 'justify-center flex-wrap' : 'justify-end'}`}>
      {getButtons()}
    </div>
  );
};

// Mode badge component
const ModeBadge = ({ mode }: { mode: GameMode }) => {
  const getBadgeStyle = () => {
    switch (mode) {
      case 'Student Only':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Classroom & Student':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Classroom Only':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle()}`}>
      {mode}
    </span>
  );
};

// Game card component
const GameCard = ({ game }: { game: Game }) => {
  const getGameIcon = (gameName: string) => {
    // Simple mapping of game names to emoji icons
    const iconMap: { [key: string]: string } = {
      'Translation Tycoon': '💼',
      'Memory Game': '🧠',
      'Word Blast': '🚀',
      'Hangman': '🎯',
      'Speed Builder': '⚡',
      'Sentence Tower': '🏗️',
      'Noughts and Crosses': '⭕',
      'Verb Conjugation Ladder': '🪜',
      'Word Association': '🔗',
      'Word Scramble': '🔀'
    };
    return iconMap[gameName] || '🎮';
  };

  const getCardColor = (mode: GameMode) => {
    switch (mode) {
      case 'Student Only':
        return 'border-l-green-400';
      case 'Classroom & Student':
        return 'border-l-blue-400';
      case 'Classroom Only':
        return 'border-l-purple-400';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 border-l-4 ${getCardColor(game.mode)} hover:shadow-md transition-shadow p-4 flex flex-col h-full`}>
      {/* Header with icon and badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{getGameIcon(game.name)}</div>
        <div className="flex flex-col items-end gap-1">
          {game.isNew && (
            <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              NEW
            </span>
          )}
          {game.isFeatured && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              FEATURED
            </span>
          )}
        </div>
      </div>

      {/* Game name */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{game.name}</h3>
      
      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 flex-grow">{game.description}</p>
      
      {/* Mode badge */}
      <div className="mb-4">
        <ModeBadge mode={game.mode} />
      </div>
      
      {/* Action buttons */}
      <ActionButtons game={game} size="small" />
    </div>
  );
};

// Loading component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    <span className="ml-2 text-indigo-600">Loading games...</span>
  </div>
);

export default function TeacherGamesPage() {
  const { user } = useAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Game data with proper mode classifications
  const gameData: Game[] = [
    {
      id: '1',
      name: 'Translation Tycoon',
      description: 'Practice translating phrases and sentences',
      mode: 'Student Only',
      difficulty: 2,
      isFeatured: true,
      path: '/games/translation-tycoon'
    },
    {
      id: '2',
      name: 'Memory Game',
      description: 'Match words with their meanings',
      mode: 'Classroom & Student',
      difficulty: 2,
      path: '/games/memory-game'
    },
    {
      id: '3',
      name: 'Word Blast',
      description: 'Fast-paced vocabulary recall game',
      mode: 'Student Only',
      difficulty: 1,
      isNew: true,
      path: '/games/word-blast'
    },
    {
      id: '4',
      name: 'Hangman',
      description: 'Classic hangman with vocab words',
      mode: 'Classroom & Student',
      difficulty: 3,
      path: '/games/hangman'
    },
    {
      id: '5',
      name: 'Speed Builder',
      description: 'Quickly build sentences from words',
      mode: 'Student Only',
      difficulty: 2,
      path: '/games/speed-builder'
    },
    {
      id: '6',
      name: 'Sentence Tower',
      description: 'Stack words to form sentences',
      mode: 'Student Only',
      difficulty: 4,
      path: '/games/sentence-towers'
    },
    {
      id: '7',
      name: 'Noughts and Crosses',
      description: 'Tic-Tac-Toe style word matching game',
      mode: 'Classroom & Student',
      difficulty: 1,
      path: '/games/noughts-and-crosses'
    },
    {
      id: '8',
      name: 'Verb Conjugation Ladder',
      description: 'Climb the ladder by conjugating verbs',
      mode: 'Student Only',
      difficulty: 3,
      path: '/games/verb-conjugation-ladder'
    },
    {
      id: '9',
      name: 'Word Association',
      description: 'Match related words in pairs',
      mode: 'Classroom Only',
      difficulty: 2,
      path: '/games/word-association'
    },
    {
      id: '10',
      name: 'Word Scramble',
      description: 'Unscramble the words',
      mode: 'Classroom & Student',
      difficulty: 2,
      path: '/games/word-scramble'
    }
  ];

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For now, use the static game data
        setGames(gameData);
      } catch (error) {
        console.error('Error loading games:', error);
        setError(error instanceof Error ? error.message : 'Unknown error loading games');
        setGames(gameData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);

  // Filter games based on search term and filter type
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = () => {
      switch (filterType) {
        case 'Classroom Games':
          return game.mode === 'Classroom Only' || game.mode === 'Classroom & Student';
        case 'Student Games':
          return game.mode === 'Student Only' || game.mode === 'Classroom & Student';
        case 'All':
        default:
          return true;
      }
    };
    
    return matchesSearch && matchesFilter();
  });

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Learning Games</h1>
              <p className="text-slate-600">Engage your students with interactive language learning games</p>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Controls Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6 mb-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            {/* Search and Filter */}
            <div className="flex flex-1 max-w-3xl gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300/60 rounded-xl bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                />
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
              
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="pl-4 pr-10 py-3 border border-slate-300/60 rounded-xl bg-white/80 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-medium text-slate-700 min-w-[180px]"
                >
                  <option value="All">All Games</option>
                  <option value="Classroom Games">Classroom Games</option>
                  <option value="Student Games">Student Games</option>
                </select>
                <Filter className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-100/80 rounded-xl p-1 flex">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    viewMode === 'cards'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-2 inline" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <List className="h-4 w-4 mr-2 inline" />
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <CardsView games={filteredGames} />
        ) : (
          <TableView games={filteredGames} />
        )}

        {/* Game Count */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Showing {filteredGames.length} of {games.length} games
          </p>
        </div>
      </div>
    </div>
  );
}

// Cards View Component
function CardsView({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
            <Gamepad2 className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No games found</h3>
          <p className="text-slate-600 leading-relaxed">
            Try adjusting your search or filter settings to find games.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <ModernGameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

// Table View Component
function TableView({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
            <Gamepad2 className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No games found</h3>
          <p className="text-slate-600 leading-relaxed">
            Try adjusting your search or filter settings to find games.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/60">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Game Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Mode
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200/60">
            {games.map((game) => (
              <tr key={game.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getGameIcon(game.name)}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center">
                        {game.name}
                        {game.isNew && <span className="ml-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">NEW</span>}
                        {game.isFeatured && <span className="ml-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">FEATURED</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 max-w-md">{game.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ModernModeBadge mode={game.mode} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ModernActionButtons game={game} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Modern Game Card Component
function ModernGameCard({ game }: { game: Game }) {
  const getCardGradient = (mode: GameMode) => {
    switch (mode) {
      case 'Student Only':
        return 'from-emerald-500 to-emerald-600';
      case 'Classroom & Student':
        return 'from-indigo-500 to-purple-600';
      case 'Classroom Only':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className={`bg-gradient-to-br ${getCardGradient(game.mode)} p-6 text-white relative`}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{getGameIcon(game.name)}</div>
          <div className="flex flex-col gap-2">
            {game.isNew && (
              <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold">
                NEW
              </span>
            )}
            {game.isFeatured && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                FEATURED
              </span>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">{game.name}</h3>
      </div>

      <div className="p-6">
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">{game.description}</p>
        
        <div className="mb-6">
          <ModernModeBadge mode={game.mode} />
        </div>
        
        <ModernActionButtons game={game} />
      </div>
    </div>
  );
}

// Modern Mode Badge Component
function ModernModeBadge({ mode }: { mode: GameMode }) {
  const getBadgeStyle = () => {
    switch (mode) {
      case 'Student Only':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Classroom & Student':
        return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
      case 'Classroom Only':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle()}`}>
      {mode}
    </span>
  );
}

// Modern Action Buttons Component
function ModernActionButtons({ game }: { game: Game }) {
  const gamePath = game.path || `/games/${game.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  const getButtons = () => {
    switch (game.mode) {
      case 'Student Only':
        return (
          <>
            <Link 
              href={`/dashboard/assignments/new?game=${game.id}`}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-center inline-flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Assign</span>
            </Link>
            <Link 
              href={gamePath}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium inline-flex items-center justify-center"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </>
        );
        
      case 'Classroom & Student':
        return (
          <>
            <Link 
              href={gamePath + '?mode=classroom'}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-center inline-flex items-center justify-center space-x-2"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Launch</span>
            </Link>
            <Link 
              href={`/dashboard/assignments/new?game=${game.id}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 font-medium inline-flex items-center justify-center"
            >
              <BookOpen className="h-4 w-4" />
            </Link>
            <Link 
              href={gamePath}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium inline-flex items-center justify-center"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </>
        );
        
      case 'Classroom Only':
        return (
          <>
            <Link 
              href={gamePath + '?mode=classroom'}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-center inline-flex items-center justify-center space-x-2"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Launch</span>
            </Link>
            <Link 
              href={gamePath}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium inline-flex items-center justify-center"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2">
      {getButtons()}
    </div>
  );
}

// Helper function for game icons
function getGameIcon(gameName: string): string {
  const iconMap: { [key: string]: string } = {
    'Translation Tycoon': '💼',
    'Memory Game': '🧠',
    'Word Blast': '🚀',
    'Hangman': '🎯',
    'Speed Builder': '⚡',
    'Sentence Tower': '🏗️',
    'Noughts and Crosses': '⭕',
    'Verb Conjugation Ladder': '🪜',
    'Word Association': '🔗',
    'Word Scramble': '🔀'
  };
  return iconMap[gameName] || '🎮';
} 