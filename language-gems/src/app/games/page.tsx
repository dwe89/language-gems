'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, Search, Filter, ChevronDown, BookOpen, Clock, Star, Users, Building2, Rocket, Castle, DollarSign, CircleOff, DoorOpen, Puzzle, TagIcon } from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';

type Game = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToComplete: string;
  rating: number;
  playCount: number;
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
  const { user } = useAuth();
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
          id: 'translation-tycoon',
          name: 'Translation Tycoon',
          description: 'Build your translation empire! Earn coins by translating words correctly, then invest in buildings and upgrades to grow your business.',
          thumbnail: '/images/games/translation-tycoon.png',
          category: 'vocabulary',
          difficulty: 'beginner',
          timeToComplete: '5-15 min',
          rating: 4.8,
          playCount: 12000,
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German', 'Italian'],
          path: '/games/translation-tycoon'
        },
        {
          id: 'speed-builder',
          name: 'Speed Builder',
          description: 'Drag and drop words to build sentences correctly before time runs out.',
          thumbnail: '/images/games/speed-builder.jpg',
          category: 'vocabulary',
          difficulty: 'beginner',
          timeToComplete: '5-10 min',
          rating: 4.9,
          playCount: 15200,
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
          difficulty: 'beginner',
          timeToComplete: '3-8 min',
          rating: 4.8,
          playCount: 9700,
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
          difficulty: 'intermediate',
          timeToComplete: '5-10 min',
          rating: 4.7,
          playCount: 8600,
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
          difficulty: 'beginner',
          timeToComplete: '5-10 min',
          rating: 4.8,
          playCount: 14500,
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
          difficulty: 'beginner',
          timeToComplete: '5-10 min',
          rating: 4.7,
          playCount: 12800,
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
          difficulty: 'beginner',
          timeToComplete: '3-5 min',
          rating: 4.5,
          playCount: 9700,
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
          difficulty: 'intermediate',
          timeToComplete: '10-15 min',
          rating: 4.6,
          playCount: 8200,
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
          difficulty: 'intermediate',
          timeToComplete: '8-12 min',
          rating: 4.4,
          playCount: 7500,
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
          difficulty: 'intermediate',
          timeToComplete: '5-8 min',
          rating: 4.3,
          playCount: 6800,
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
          difficulty: 'beginner',
          timeToComplete: '5-10 min',
          rating: 4.5,
          playCount: 10200,
          popular: true,
          languages: ['English', 'Spanish', 'French'],
          path: '/games/word-scramble'
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

  const filteredGames = filter === 'all' 
    ? games 
    : games.filter(game => game.category === filter || game.difficulty === filter);

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
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
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
                  <div className="absolute top-2 right-2 bg-slate-800/80 text-xs px-2 py-1 rounded-full">
                    {game.category}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">{game.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-xs text-slate-300">
                    <div className="flex items-center">
                      <BookOpen className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                      <span className={
                        game.difficulty === 'beginner' ? 'text-green-400' :
                        game.difficulty === 'intermediate' ? 'text-amber-400' :
                        'text-red-400'
                      }>
                        {game.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                      <span>{game.timeToComplete}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 mr-1 text-amber-400" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-xs text-slate-400">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>{game.playCount.toLocaleString()} plays</span>
                    </div>
                  </div>
                  
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