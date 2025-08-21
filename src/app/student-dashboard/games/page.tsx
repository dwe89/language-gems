'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gamepad2, Search, Hexagon, Star, Clock, Users, Loader2, BookOpen, Play, Target, BarChart3 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useGameProgress } from '../../../hooks/useGameProgress';
import { GameSummary } from '../../../services/gameProgressService';
import GameSelectionSidebar, { SelectionState } from '../../../components/games/FilterSidebar';
import MobileGameSelectionModal from '../../../components/games/MobileGameSelectionModal';
import FeaturedVocabMasterCard from '../../../components/games/FeaturedVocabMasterCard';

type Game = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  subcategories?: string[];
  popular: boolean;
  languages: string[];
  path: string;
  playTime?: string;
  gemColor?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  players?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  lastPlayed?: string;
  highScore?: number;
  comingSoon?: boolean;
};

// Component to display a game card
const GameCard = ({ game, isSelected, isDisabled, onPlayNowClick }: {
  game: Game;
  isSelected: boolean;
  isDisabled: boolean;
  onPlayNowClick: (game: Game) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl overflow-hidden border shadow-lg transition-all duration-300 flex flex-col
        ${isSelected
          ? 'bg-green-50 border-green-500 shadow-xl ring-2 ring-green-200'
          : isDisabled
          ? 'bg-white border-gray-200 opacity-50 pointer-events-none'
          : 'bg-white border-gray-200 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300'
        }`}
    >
      <div className="h-40 relative overflow-hidden">
        <Image
          src={game.thumbnail}
          alt={game.name}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to gradient background if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.className = "h-40 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center relative";
              const fallback = document.createElement('div');
              fallback.innerHTML = `<svg class="h-16 w-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`;
              parent.appendChild(fallback);
            }
          }}
        />
        {game.isNew && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            NEW
          </div>
        )}
        {game.popular && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            POPULAR
          </div>
        )}
        {game.highScore !== undefined && (
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            High Score: {game.highScore}
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {game.category === 'sentences' ? 'Sentences' : game.category.charAt(0).toUpperCase() + game.category.slice(1)}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{game.description}</p>

        <div className="flex space-x-3 mt-auto">
          {game.comingSoon ? (
            <div className="flex-1 text-center py-2 rounded-lg font-medium text-gray-600 bg-gray-100 border border-gray-200 flex items-center justify-center space-x-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span>Coming soon</span>
            </div>
          ) : (
            <button
              onClick={() => onPlayNowClick(game)}
              className={`flex-1 text-white text-center py-2 rounded-lg font-medium transition-all transform
                ${isSelected
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105'
                }`}
            >
              {isSelected ? (<><Gamepad2 className="inline-block h-4 w-4 mr-2"/>Change Game</>) : (<><Gamepad2 className="inline-block h-4 w-4 mr-2"/>Play Now</>)}
            </button>
          )}
        </div>
      </div>
    </motion.div>
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  const { getGameProgress, getStats } = useGameProgress();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameProgressMap, setGameProgressMap] = useState<Record<string, GameSummary[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGameForSetup, setSelectedGameForSetup] = useState<Game | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<SelectionState>({
    language: null,
    curriculumLevel: null,
    categoryId: null,
    subcategoryId: null,
    theme: null
  });

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Define categories
  const categories = [
    { value: 'all', label: 'All Games' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'grammar', label: 'Grammar' },
    { value: 'listening', label: 'Listening' },
    { value: 'spelling', label: 'Spelling' },
    { value: 'sentences', label: 'Sentences' },
  ];

  // Updated games list to match main site
  const actualGames: Game[] = [
    {
      id: 'vocab-master',
      name: 'VocabMaster',
      description: 'Master vocabulary with smart, personalized reviews, adaptive learning, and 8 engaging game modes.',
      thumbnail: '/images/games/vocabulary-mining.jpg',
      category: 'vocabulary',
      popular: true,
      languages: ['English', 'Spanish', 'French', 'German'],
      path: '/student-dashboard/games/vocab-master',
      playTime: '5-15 min',
      gemColor: 'text-yellow-500',
      difficulty: 2,
      players: 'Single Player',
      isFeatured: true
    },
    {
      id: 'speed-builder',
      name: 'Sentence Sprint',
      description: 'Drag and drop words to build sentences correctly before time runs out.',
      thumbnail: '/images/games/speed-builder.jpg',
      category: 'sentences',
      subcategories: ['sentences'],
      popular: true,
      languages: ['English', 'Spanish', 'French', 'German'],
      path: '/student-dashboard/games/speed-builder',
      playTime: '5-10 min',
      gemColor: 'text-red-500',
      difficulty: 2,
      players: 'Single Player'
    },
    {
      id: 'word-blast',
      name: 'Word Blast',
      description: 'Launch rockets with correct word translations before time runs out!',
      thumbnail: '/images/games/word-blast.jpg',
      category: 'vocabulary',
      popular: true,
      languages: ['English', 'Spanish', 'French'],
      path: '/student-dashboard/games/word-blast',
      playTime: '3-5 min',
      gemColor: 'text-green-500',
      difficulty: 1,
      players: 'Single Player'
    },
    {
      id: 'sentence-towers',
      name: 'Word Towers',
      description: 'Build towers by matching words to translations. Wrong answers make towers fall!',
      thumbnail: '/images/games/sentence-towers.jpg',
      category: 'vocabulary',
      popular: true,
      languages: ['English', 'Spanish', 'French', 'German'],
      path: '/student-dashboard/games/sentence-towers',
      playTime: '5-15 min',
      gemColor: 'text-yellow-500',
      difficulty: 4,
      players: 'Single Player'
    },
    {
      id: 'hangman',
      name: 'Hangman',
      description: 'Guess the word before the hangman is complete. Excellent for vocabulary practice.',
      thumbnail: '/images/games/hangman.jpg',
      category: 'vocabulary',
      popular: true,
      languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese'],
      path: '/student-dashboard/games/hangman',
      playTime: '5-10 min',
      gemColor: 'text-purple-500',
      difficulty: 3,
      players: 'Single Player'
    },
    {
      id: 'memory-game',
      name: 'Memory Match',
      description: 'Match pairs of cards to build vocabulary and memory skills.',
      thumbnail: '/images/games/memory-match.jpg',
      category: 'vocabulary',
      popular: false,
      languages: ['English', 'Spanish', 'French', 'German'],
      path: '/student-dashboard/games/memory-game',
      playTime: '5-10 min',
      gemColor: 'text-pink-500',
      difficulty: 2,
      players: 'Single Player',
      isNew: true
    },
    {
      id: 'noughts-and-crosses',
      name: 'Noughts and Crosses',
      description: 'Play tic-tac-toe while practicing language terms.',
      thumbnail: '/images/games/noughts-and-crosses.jpg',
      category: 'vocabulary',
      popular: false,
      languages: ['English', 'Spanish', 'French', 'German'],
      path: '/student-dashboard/games/noughts-and-crosses',
      playTime: '3-5 min',
      gemColor: 'text-indigo-500',
      difficulty: 1,
      players: '1-2 Players'
    },
    {
      id: 'conjugation-duel',
      name: 'Conjugation Duel',
      description: 'Epic verb conjugation battles in different arenas and leagues.',
      thumbnail: '/images/games/conjugation-duel.jpg',
      category: 'grammar',
      popular: true,
      languages: ['Spanish'],
      path: '/student-dashboard/games/conjugation-duel',
      playTime: '8-12 min',
      gemColor: 'text-orange-500',
      difficulty: 4,
      players: 'Single Player'
    },
    {
      id: 'word-scramble',
      name: 'Word Scramble',
      description: 'Unscramble jumbled words to improve spelling and word recognition.',
      thumbnail: '/images/games/word-scramble.jpg',
      category: 'spelling',
      popular: true,
      languages: ['English', 'Spanish', 'French'],
      path: '/student-dashboard/games/word-scramble',
      playTime: '4-8 min',
      gemColor: 'text-cyan-500',
      difficulty: 2,
      players: 'Single Player'
    },
    {
      id: 'detective-listening',
      name: 'Detective Listening Game',
      description: 'Solve cases by identifying evidence through listening to words in Spanish, French, or German and finding their English translations.',
      thumbnail: '/images/games/detective-listening.jpg',
      category: 'listening',
      popular: true,
      languages: ['Spanish', 'French', 'German'],
      path: '/student-dashboard/games/detective-listening',
      playTime: '6-10 min',
      gemColor: 'text-amber-500',
      difficulty: 3,
      players: 'Single Player'
    },
    {
      id: 'case-file-translator',
      name: 'Case File Translator',
      description: 'Solve detective cases by translating intercepted communications from Spanish, French, or German to English.',
      thumbnail: '/images/games/case-file-translator.jpg',
      category: 'sentences',
      subcategories: ['sentences'],
      popular: true,
      languages: ['Spanish', 'French', 'German'],
      path: '/student-dashboard/games/case-file-translator',
      playTime: '8-12 min',
      gemColor: 'text-emerald-500',
      difficulty: 4,
      players: 'Single Player'
    },
    {
      id: 'lava-temple-word-restore',
      name: 'Lava Temple: Word Restore',
      description: 'Restore ancient inscriptions by filling in missing words. Become a linguistic archaeologist and unlock temple secrets!',
      thumbnail: '/images/games/lava-temple-word-restore.jpg',
      category: 'sentences',
      subcategories: ['sentences'],
      popular: true,
      languages: ['Spanish', 'French', 'German'],
      path: '/student-dashboard/games/lava-temple-word-restore',
      playTime: '10-15 min',
      gemColor: 'text-red-500',
      difficulty: 4,
      players: 'Single Player'
    },
    {
      id: 'verb-quest',
      name: 'Verb Quest',
      description: 'Embark on an epic RPG adventure to master verb conjugations!',
      thumbnail: '/images/games/verb-quest.jpg',
      category: 'grammar',
      popular: true,
      languages: ['Spanish', 'French', 'German'],
      path: '/student-dashboard/games/verb-quest',
      playTime: '12-20 min',
      gemColor: 'text-violet-500',
      difficulty: 5,
      players: 'Single Player'
    },
    {
      id: 'vocab-blast',
      name: 'Vocab-Blast',
      description: 'Click vocabulary gems to pop and translate them quickly',
      thumbnail: '/images/games/vocab-blast.jpg',
      category: 'vocabulary',
      popular: true,
      languages: ['English', 'Spanish', 'French', 'German'],
      path: '/student-dashboard/games/vocab-blast',
      playTime: '3-6 min',
      gemColor: 'text-lime-500',
      difficulty: 2,
      players: 'Single Player'
    }
  ];

  // Handle URL parameters for direct category/subcategory access or game selection
  useEffect(() => {
    const category = searchParams?.get('category');
    const subcategory = searchParams?.get('subcategory');
    const gameParam = searchParams?.get('game');

    if ((category && subcategory && !selectedGameForSetup) || (gameParam && !selectedGameForSetup)) {
      // Auto-select VocabMaster when category/subcategory parameters are present or game=vocab-master
      const vocabMasterGame = actualGames.find(game => game.id === 'vocab-master');
      if (vocabMasterGame) {
        setSelectedGameForSetup(vocabMasterGame);

        // Pre-fill the selection with URL parameters
        setCurrentSelection({
          language: 'es', // Default to Spanish
          curriculumLevel: 'KS3', // Default to KS3
          categoryId: category || 'basics_core_language',
          subcategoryId: subcategory || 'greetings_introductions',
          theme: 'default'
        });
      }
    }
  }, [searchParams, selectedGameForSetup, actualGames]);

  // Game selection handlers
  const handleDeselectGame = () => {
    setSelectedGameForSetup(null);
    setCurrentSelection({
      language: null,
      curriculumLevel: null,
      categoryId: null,
      subcategoryId: null,
      theme: null
    });
  };

  const handlePlayNowClick = (game: Game) => {
    // If the same game is clicked again, deselect it.
    if (selectedGameForSetup?.id === game.id) {
        handleDeselectGame();
        return;
    }

    setSelectedGameForSetup(game);
    // On mobile, open modal immediately
    if (window.innerWidth < 768) {
      setIsMobileModalOpen(true);
    } else {
      // On desktop, scroll to the sidebar to indicate next step
      if (sidebarRef.current) {
        sidebarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSelectionChange = (selection: SelectionState) => {
    setCurrentSelection(selection);
  };

  const handleSelectionComplete = (selection: SelectionState) => {
    if (!selectedGameForSetup) return;

    // Construct URL with parameters
    const params = new URLSearchParams({
      lang: selection.language!,
      level: selection.curriculumLevel!,
      cat: selection.categoryId!,
      subcat: selection.subcategoryId!,
      theme: selection.theme || 'default'
    });

    const url = `${selectedGameForSetup.path}?${params.toString()}`;
    console.log('🚀 Navigating to:', url);
    window.location.href = url; // Use window.location for cross-domain navigation
  };

  const handleVocabMasterChooseContent = () => {
    const vocabMasterGame = actualGames.find(game => game.id === 'vocab-master');
    if (vocabMasterGame) {
      setSelectedGameForSetup(vocabMasterGame);
      if (window.innerWidth < 768) {
        setIsMobileModalOpen(true);
      } else {
        if (sidebarRef.current) {
          sidebarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use our updated games list
        setGames(actualGames);

        // If user is logged in, fetch game progress
        let allGameProgress: Record<string, GameSummary[]> = {};
        if (user) {
          try {
            const stats = await getStats();

            if (stats.recentGames && stats.recentGames.length > 0) {
              stats.recentGames.forEach(progress => {
                if (!allGameProgress[progress.gameId]) {
                  allGameProgress[progress.gameId] = [];
                }
                allGameProgress[progress.gameId].push(progress);
              });
            }

            setGameProgressMap(allGameProgress);

            // Update games with user progress data
            const gamesWithProgress = actualGames.map(game => {
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
        setGames(actualGames);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  // Filtering logic
  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory || (game.subcategories && game.subcategories.includes(selectedCategory));
    const matchesSearch = searchQuery === '' ||
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center mb-2">
            <Gamepad2 className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Games Library</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Choose any game and start earning gems! All progress counts towards your level and achievements.
          </p>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-blue-800">
                <span className="font-bold">💡 Student Tip:</span> Play regularly to improve your vocabulary and climb the leaderboards!
              </p>
              <Link
                href="/student-dashboard/assignments"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>Check Assignments</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              className="pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 w-full sm:w-80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category filter boxes */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${selectedCategory === category.value
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: Select Content Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setIsMobileModalOpen(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>🎮</span>
            <span>Select Content & Start Game</span>
          </button>
        </div>

        {/* Hybrid Layout: Desktop Sidebar + Mobile Full Width */}
        <div className="flex gap-8">
          {/* Desktop: Game Selection Sidebar */}
          <div ref={sidebarRef} className="hidden md:block w-80 flex-shrink-0">
            {selectedGameForSetup ? (
              <>
                <div className="p-6 bg-green-50 rounded-xl shadow-lg sticky top-6 text-center">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Selected Game:</h3>
                  <p className="text-lg font-bold text-green-600 mb-4">{selectedGameForSetup.name}</p>
                  <button
                    onClick={handleDeselectGame}
                    className="w-full bg-green-200 hover:bg-green-300 text-green-800 font-bold py-2 px-6 rounded-lg transition-all"
                  >
                    Change Game
                  </button>
                </div>
                <div className="mt-4">
                  <GameSelectionSidebar
                    onSelectionComplete={handleSelectionComplete}
                    onSelectionChange={handleSelectionChange}
                    selectedGame={{
                      id: selectedGameForSetup.id,
                      name: selectedGameForSetup.name,
                      supportsThemes: selectedGameForSetup.id.includes('vocab-blast')
                    }}
                    className="sticky top-6"
                  />
                </div>
              </>
            ) : (
              <div className="p-6 bg-white rounded-xl shadow-lg sticky top-6 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Ready to Play?</h3>
                <p className="text-gray-600 text-sm">
                  Choose a game from the list to start configuring your learning adventure!
                </p>
              </div>
            )}
          </div>

          {/* Games Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No games found</h3>
                <p className="text-gray-600">Try adjusting your search or category filters.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured VocabMaster Card */}
                <FeaturedVocabMasterCard onChooseContent={handleVocabMasterChooseContent} />

                {/* Regular Games Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGames.filter(game => game.id !== 'vocab-master').map((game) => {
                    const isSelected = selectedGameForSetup?.id === game.id;
                    const isDisabled = !!selectedGameForSetup && !isSelected;

                    return (
                      <GameCard
                        key={game.id}
                        game={game}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        onPlayNowClick={handlePlayNowClick}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Modal */}
        <MobileGameSelectionModal
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
          onSelectionComplete={handleSelectionComplete}
          selectedGame={selectedGameForSetup ? {
            id: selectedGameForSetup.id,
            name: selectedGameForSetup.name,
            supportsThemes: selectedGameForSetup.id.includes('vocab-blast')
          } : null}
        />

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
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
    </div>
  );
}

// Force client-side rendering to avoid build issues with Supabase
export const dynamic = 'force-dynamic'; 