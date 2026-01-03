'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gamepad2, Building2, Rocket, Lock, Trophy, Target, BarChart3, Play, BookOpen, Users, Star, Clock } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useDemoAuth } from '../auth/DemoAuthProvider';
import Footer from '../layout/Footer';
import DemoBanner from '../demo/DemoBanner';
import SmartSignupSelector from '../auth/SmartSignupSelector';
import GamesDevWarningDialog from './GamesDevWarningDialog';

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
            Ready to Play <span className="text-indigo-600">LanguageGems</span> Games?
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6"><Star className="inline-block h-6 w-6 text-yellow-400 mr-2" />Popular Games Waiting for You</h2>
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
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500 to-transparent opacity-20 rounded-bl-full"></div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg">Sentence Sprint</h3>
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
            <h3 className="text-xl font-bold text-gray-900 mb-4"><Play className="inline-block h-5 w-5 text-indigo-600 mr-2" />See LanguageGems in Action</h3>
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <Rocket className="h-5 w-5" />
              <span>Sign In to Play Now</span>
            </Link>
            <Link
              href="/auth/signup"
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-indigo-200 transition-all transform hover:scale-105"
            >
              <span className="inline-flex items-center space-x-2"><BookOpen className="h-5 w-5" /><span>Create Free Account</span></span>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            <Lock className="inline-block h-4 w-4 text-gray-600 mr-2" /> <strong>Why do I need to sign in?</strong><br />
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
  category: 'vocabulary' | 'sentences' | 'grammar' | 'spelling' | 'listening';
  subcategories?: string[]; // New: for more specific categorization like 'sentences'
  popular: boolean;
  languages: string[];
  path: string;
  comingSoon?: boolean;
  themes?: string[]; // Add themes support
};

export default function GamesPageClient() {
  const { user, isLoading } = useAuth();
  const { isDemo } = useDemoAuth();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Renamed from 'filter' for clarity
  const [showSignupSelector, setShowSignupSelector] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);


  // Define your main categories
  const categories = [
    { value: 'all', label: 'All Games' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'grammar', label: 'Grammar' },
    { value: 'listening', label: 'Listening' },
    { value: 'spelling', label: 'Spelling' },
    { value: 'sentences', label: 'Sentences' }, // New category
  ];

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);

      const actualGames: Game[] = [
        {
          id: 'speed-builder',
          name: 'Sentence Sprint',
          description: 'Drag and drop words to build sentences correctly before time runs out.',
          thumbnail: '/images/games/speed-builder.jpg',
          category: 'sentences',
          subcategories: ['sentences'],
          popular: true,
          languages: ['es', 'fr', 'de'],
          path: '/games/speed-builder'
        },
        {
          id: 'word-towers',
          name: 'Word Towers',
          description: 'Build towers by matching vocabulary words to translations. Wrong answers make towers fall!',
          thumbnail: '/images/games/sentence-towers.jpg',
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German'],
          path: '/games/word-towers'
        },
        {
          id: 'sentence-towers',
          name: 'Sentence Towers',
          description: 'Build towers by matching full sentences to translations. Practice sentence comprehension!',
          thumbnail: '/images/games/sentence-towers.jpg',
          category: 'sentences',
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
          path: '/games/hangman',
          themes: ['default', 'tokyo', 'pirate', 'space', 'temple']
        },
        {
          id: 'memory-game',
          name: 'Memory Match', // Renamed for consistency
          description: 'Match pairs of cards to build vocabulary and memory skills.',
          thumbnail: '/images/games/memory-match.jpg',
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
          id: 'detective-listening',
          name: 'Detective Listening Game',
          description: 'Solve cases by identifying evidence through listening to words in Spanish, French, or German and finding their English translations.',
          thumbnail: '/images/games/detective-listening.jpg',
          category: 'listening',
          popular: true,
          languages: ['Spanish', 'French', 'German'],
          path: '/games/detective-listening'
        },
        {
          id: 'case-file-translator',
          name: 'Case File Translator',
          description: 'Solve detective cases by translating intercepted communications from Spanish, French, or German to English.',
          thumbnail: '/images/games/case-file-translator.jpg',
          category: 'sentences', // Changed category
          subcategories: ['sentences'],
          popular: true,
          languages: ['Spanish', 'French', 'German'],
          path: '/games/case-file-translator'
        },
        {
          id: 'lava-temple-word-restore',
          name: 'Lava Temple: Word Restore',
          description: 'Restore ancient inscriptions by filling in missing words. Become a linguistic archaeologist and unlock temple secrets!',
          thumbnail: '/images/games/lava-temple-word-restore.jpg',
          category: 'sentences', // Changed category
          subcategories: ['sentences'],
          popular: true,
          languages: ['Spanish', 'French', 'German'],
          path: '/games/lava-temple-word-restore'
        },
        {
          id: 'vocab-blast', // New game ID
          name: 'Vocab Blast', // New game name
          description: 'Click vocabulary gems to pop and translate them quickly', // New game description
          thumbnail: '/images/games/vocab-blast.jpg', // New thumbnail
          category: 'vocabulary',
          popular: true,
          languages: ['English', 'Spanish', 'French', 'German'], // Example languages
          path: '/games/vocab-blast' // New path
        },
        {
          id: 'conjugation-duel',
          name: 'Conjugation Duel',
          description: 'Epic verb conjugation battles in different arenas and leagues.',
          thumbnail: '/images/games/conjugation-duel.jpg',
          category: 'grammar',
          popular: true,
          comingSoon: true,
          languages: ['Spanish'],
          path: '/games/conjugation-duel'
        },
        {
          id: 'verb-quest',
          name: 'Verb Quest',
          description: 'Embark on an epic RPG adventure to master verb conjugations!',
          thumbnail: '/images/games/verb-quest.jpg',
          category: 'grammar',
          popular: true,
          comingSoon: true,
          languages: ['Spanish', 'French', 'German'],
          path: '/games/verb-quest'
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

  // Simple handler for direct game navigation
  const handlePlayNowClick = (game: Game) => {
    console.log('🚀 Navigating directly to:', game.path);
    router.push(game.path);
  };

  // Combined filtering logic for category filter
  const filteredGames = games.filter(game => {
    // Apply category filter
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory || (game.subcategories && game.subcategories.includes(selectedCategory));

    return matchesCategory;
  });

  // If user is not authenticated and not in demo mode, show login gate
  if (!isLoading && !user && !isDemo) {
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

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center mb-2">
            <Gamepad2 className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Language Learning Games</h1>
            {(isDemo || !user) && (
              <span className="ml-3 bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-bold">BETA</span>
            )}
          </div>
          <p className="text-gray-600 max-w-2xl">
            Engage with interactive games designed to make language learning fun and effective.
          </p>

          {/* Demo Banner */}
          {isDemo && (
            <div className="mt-6 max-w-4xl mx-auto px-4 sm:px-0">
              <DemoBanner
                message="Open Beta: Enjoy full access to all games and categories! Sign up to save your progress."
                showStats={true}
                variant="compact"
                onSignupClick={() => setShowSignupSelector(true)}
              />
            </div>
          )}
        </header>



        {/* Filter Controls */}
        <div className="flex justify-center items-center mb-6 gap-4">
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

        {/* Games Grid */}
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Gamepad2 className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No games found</h3>
              <p className="text-gray-600">Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* All Games */}
              {filteredGames.map((game) => {
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden border shadow-lg transition-all duration-300 flex flex-col bg-white border-gray-200 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300"
                  >
                    <div className="h-40 relative overflow-hidden">
                      {/* Game thumbnail */}
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
                      {/* Display 'DEMO' tag based on isDemo prop or other logic */}
                      {(isDemo || !user) && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          BETA
                        </div>
                      )}
                      {/* Display the main category, or a subcategory if it's a sentences game */}
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
                          <>
                            <button
                              onClick={() => handlePlayNowClick(game)}
                              className="flex-1 text-white text-center py-2 rounded-lg font-medium transition-all transform bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
                            >
                              <Gamepad2 className="inline-block h-4 w-4 mr-2" />Play Now
                            </button>

                            {user?.user_metadata?.role === 'teacher' && (
                              <Link
                                href={`/dashboard/assignments/new?gameId=${game.id}`}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-center py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                              >
                                <BookOpen className="h-4 w-4" />
                                <span>Assign</span>
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <SmartSignupSelector
        isOpen={showSignupSelector}
        onClose={() => setShowSignupSelector(false)}
        triggerRef={buttonRef}
      />
      <GamesDevWarningDialog />
    </div>
  );
}
