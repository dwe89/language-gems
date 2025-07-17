'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, Search, Filter, ChevronDown, Building2, Rocket, Castle, DollarSign, CircleOff, DoorOpen, Puzzle, TagIcon, Lock, Trophy, Target, BarChart3, Play, BookOpen, Users, Star, Flower } from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';

// Login Required Component
const LoginRequiredGate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Lock className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            🎮 Ready to Play <span className="text-indigo-600">LanguageGems</span> Games?
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our games are designed to track your progress, award gems, and help you master new languages.
            Sign in to unlock the full learning experience!
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Gems & XP</h3>
              <p className="text-sm text-gray-600">Every game awards points and gems for correct answers</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">See your vocabulary mastery and weak areas</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compete & Climb</h3>
              <p className="text-sm text-gray-600">Join class leaderboards and compete with friends</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Assignments</h3>
              <p className="text-sm text-gray-600">Games integrate with teacher-set homework</p>
            </div>
          </div>

          {/* Game Preview Cards */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🌟 Popular Games Waiting for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500 to-transparent opacity-20 rounded-bl-full"></div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Rocket className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">Gem Collector</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Race to collect translation gems while avoiding wrong answers!</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center"><Users className="h-3 w-3 mr-1" />11.5k players</span>
                  <span className="flex items-center"><Star className="h-3 w-3 mr-1" />4.9★</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500 to-transparent opacity-20 rounded-bl-full"></div>
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">BETA</div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Flower className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg">Language Garden</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Plant vocabulary seeds and watch them grow as you learn!</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center"><Users className="h-3 w-3 mr-1" />2.1k players</span>
                  <span className="flex items-center"><Star className="h-3 w-3 mr-1" />4.9★</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500 to-transparent opacity-20 rounded-bl-full"></div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg">Speed Builder</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Drag and drop words to build perfect sentences before time runs out!</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center"><Users className="h-3 w-3 mr-1" />15.2k players</span>
                  <span className="flex items-center"><Star className="h-3 w-3 mr-1" />4.9★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Video Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎬 See LanguageGems in Action</h3>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                  <Play className="h-8 w-8 text-indigo-600 ml-1" />
                </div>
                <p className="text-gray-700 font-medium">Watch students learn and play</p>
                <p className="text-sm text-gray-500 mt-1">Demo video coming soon</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Sign In to Play Now
            </Link>
            <Link
              href="/auth/signup"
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-indigo-200 transition-all transform hover:scale-105"
            >
              📝 Create Free Account
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            🔒 <strong>Why do I need to sign in?</strong><br />
            Games track your progress, award gems, integrate with teacher assignments, and provide personalized learning recommendations.
            This requires knowing who you are!
          </p>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

type Game = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  popular: boolean;
  languages: string[];
  path: string;
};

const gameCategories = [
  { id: 'all', name: 'All Games' },
  { id: 'popular', name: 'Popular' },
  { id: 'new', name: 'New' },
  { id: 'vocabulary', name: 'Vocabulary' },
  { id: 'grammar', name: 'Grammar' },
  { id: 'verbs', name: 'Verbs' },
];

const games = [
  {
    id: 'speed-builder',
    title: 'Speed Builder 🏗️',
    description: 'Drag and drop words to build sentences before time runs out',
    category: ['new', 'vocabulary', 'grammar'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <Building2 className="text-indigo-500" size={20} />,
    popular: true,
    languages: ['English', 'Spanish', 'French', 'German'],
    path: '/games/speed-builder'
  },
  {
    id: 'word-blast',
    title: 'Word Blast 🚀',
    description: 'Launch rockets by selecting the correct word translations',
    category: ['new', 'vocabulary'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <Rocket className="text-orange-500" size={20} />,
    popular: false,
    languages: ['English', 'Spanish', 'French'],
    path: '/games/word-blast',
  },
  {
    id: 'sentence-towers',
    title: 'Sentence Towers 🏰',
    description: 'Build towers by answering vocabulary questions correctly',
    category: ['vocabulary', 'grammar'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <Castle className="text-amber-500" size={20} />,
    popular: false,
    languages: ['English', 'Spanish', 'Japanese'],
    path: '/games/sentence-towers',
  },
  {
    id: 'translation-tycoon',
    title: 'Translation Tycoon 💰',
    description: 'Earn virtual money by translating words and sentences',
    category: ['vocabulary'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <DollarSign className="text-emerald-500" size={20} />,
    popular: true,
    languages: ['English', 'Spanish', 'French', 'German', 'Italian'],
    path: '/games/translation-tycoon',
  },
  {
    id: 'balloon-pop',
    title: 'Balloon Pop Quiz 🎈',
    description: 'Pop balloons with correct word translations',
    category: ['vocabulary'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <CircleOff className="text-pink-500" size={20} />,
    popular: false,
    languages: ['English', 'Spanish', 'French'],
    path: '/games/balloon-pop',
  },
  {
    id: 'escape-translation',
    title: 'Escape Translation Trap 🏃‍♀️🔐',
    description: 'Translate words correctly to escape the room',
    category: ['new', 'vocabulary'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <DoorOpen className="text-purple-500" size={20} />,
    popular: false,
    languages: ['English', 'Spanish', 'French', 'German'],
    path: '/games/escape-translation',
  },
  {
    id: 'hangman',
    title: 'Hangman',
    description: 'Classic word guessing game to practice vocabulary',
    category: ['popular', 'vocabulary'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <Puzzle className="text-cyan-500" size={20} />,
    popular: true,
    languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese'],
    path: '/games/hangman',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble letters to form words',
    category: ['vocabulary'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <TagIcon className="text-blue-500" size={20} />,
    popular: true,
    languages: ['English', 'Spanish', 'French'],
    path: '/games/word-scramble',
  },
  {
    id: 'memory-game',
    title: 'Memory Match',
    description: 'Match word pairs in this classic memory game',
    category: ['vocabulary'],
    imageSrc: '/images/games/placeholder.jpg',
    icon: <Gamepad2 className="text-green-500" size={20} />,
    popular: false,
    languages: ['English', 'Spanish', 'French', 'German'],
    path: '/games/memory-game',
  },

];

export default function GamesPage() {
  const { user, isLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchGames = async () => {
      setLoading(true);

      // Real games that are implemented in the codebase
      const actualGames: Game[] = [
        {
          id: 'language-garden',
          name: 'Language Garden',
          description: 'Plant vocabulary seeds and watch them grow into beautiful plants as you learn! Water your plants by answering questions correctly.',
          thumbnail: '/images/games/language-garden.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'],
          path: '/games/language-garden'
        },
        {
          id: 'gem-collector',
          name: 'Gem Collector',
          description: 'Move up and down to collect the correct translation gems while avoiding wrong ones! A fast-paced language learning adventure.',
          thumbnail: '/images/games/gem-collector.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'],
          path: '/games/gem-collector'
        },
        {
          id: 'speed-builder',
          name: 'Speed Builder',
          description: 'Drag and drop words to build sentences correctly before time runs out.',
          thumbnail: '/images/games/speed-builder.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/speed-builder'
        },
        {
          id: 'word-blast',
          name: 'Word Blast',
          description: 'Launch rockets with correct word translations before time runs out!',
          thumbnail: '/images/games/word-blast.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French'],
          path: '/games/word-blast'
        },
        {
          id: 'sentence-towers',
          name: 'Sentence Towers',
          description: 'Build towers by matching words to translations. Wrong answers make towers fall!',
          thumbnail: '/images/games/sentence-towers.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/sentence-towers'
        },
        {
          id: 'hangman',
          name: 'Hangman',
          description: 'Guess the word before the hangman is complete. Excellent for vocabulary practice.',
          thumbnail: '/images/games/hangman.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese'],
          path: '/games/hangman'
        },
        {
          id: 'memory-game',
          name: 'Memory Game',
          description: 'Match pairs of cards to build vocabulary and memory skills.',
          thumbnail: '/images/games/memory-game.jpg',
          category: 'vocabulary',
          popular: false,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/memory-game'
        },
        {
          id: 'noughts-and-crosses',
          name: 'Noughts and Crosses',
          description: 'Play tic-tac-toe while practicing language terms.',
          thumbnail: '/images/games/noughts-and-crosses.jpg',
          category: 'vocabulary',
          popular: false,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/noughts-and-crosses'
        },
        {
          id: 'verb-conjugation-ladder',
          name: 'Verb Conjugation Ladder',
          description: 'Practice verb conjugations in a fun, ladder-climbing game.',
          thumbnail: '/images/games/verb-conjugation-ladder.jpg',
          category: 'grammar',
          popular: false,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/verb-conjugation-ladder'
        },
        {
          id: 'sentence-builder',
          name: 'Sentence Builder',
          description: 'Put words in the correct order to form grammatically correct sentences.',
          thumbnail: '/images/games/sentence-builder.jpg',
          category: 'grammar',
          popular: false,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/sentence-builder'
        },
        {
          id: 'word-association',
          name: 'Word Association',
          description: 'Connect related words to build vocabulary networks and associations.',
          thumbnail: '/images/games/word-association.jpg',
          category: 'vocabulary',
          popular: false,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/word-association'
        },
        {
          id: 'word-scramble',
          name: 'Word Scramble',
          description: 'Unscramble jumbled words to improve spelling and word recognition.',
          thumbnail: '/images/games/word-scramble.jpg',
          category: 'spelling',
          popular: true,
          languages: ['English', 'Spanish', 'French'],
          path: '/games/word-scramble'
        },
        {
          id: 'word-guesser',
          name: 'Word Guesser',
          description: 'Guess the word in limited attempts, with color hints revealing letter positions.',
          thumbnail: '/images/games/word-guesser.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Mandarin', 'Arabic'],
          path: '/games/word-guesser'
        }
      ];

      // Simulate API call delay
      setTimeout(() => {
        setGames(actualGames);
        setLoading(false);
      }, 800);
    };

    fetchGames();
  }, []);

  // If user is not authenticated, show login gate
  if (!isLoading && !user) {
    return <LoginRequiredGate />;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredGames = filter === 'all'
    ? games
    : games.filter(game => game.category === filter);

  // Filter games based on active category and search query
  const filteredGamesByCategory = games.filter(game =>
    (activeCategory === 'all' || (activeCategory === 'popular' && game.popular) || game.category.includes(activeCategory)) &&
    (game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center mb-2">
            <Gamepad2 className="h-6 w-6 text-cyan-400 mr-2" />
            <h1 className="text-3xl font-bold">Language Learning Games</h1>
          </div>
          <p className="text-slate-300 max-w-2xl">
            Engage with interactive games designed to make language learning fun and effective.
            All games are available to teachers and students with an active account.
          </p>

          {user && (
            <div className="mt-4 p-4 bg-gradient-to-r from-cyan-800 to-indigo-800 rounded-lg">
              <p className="text-cyan-200">
                <span className="font-bold">Pro Tip:</span> As a teacher, you can assign any of these games to your students
                from the assignments page or directly from each game.
              </p>
            </div>
          )}
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search games..."
              className="pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white w-full sm:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <div className="relative">
              <button className="flex items-center space-x-1 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Filter dropdown would go here */}
            </div>

            <select
              className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Games</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="grammar">Grammar</option>
              <option value="listening">Listening</option>
              <option value="spelling">Spelling</option>

            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGamesByCategory.map((game) => (
              <div
                key={game.id}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-40 bg-slate-700 flex items-center justify-center relative">
                  {/* This would be an image in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-900 to-indigo-900">
                    <Gamepad2 className="h-16 w-16 text-slate-300/50" />
                  </div>
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    BETA
                  </div>
                  <div className="absolute top-2 right-2 bg-slate-800/80 text-xs px-2 py-1 rounded-full">
                    {game.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">{game.description}</p>



                  <div className="flex space-x-3">
                    <Link
                      href={game.path}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-center py-2 rounded-lg font-medium"
                    >
                      Play Now
                    </Link>

                    {user?.user_metadata?.role === 'teacher' && (
                      <Link
                        href={`/dashboard/assignments/new?gameId=${game.id}`}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg font-medium"
                      >
                        Assign
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 