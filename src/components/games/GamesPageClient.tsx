'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gamepad2, Clock } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useDemoAuth } from '../auth/DemoAuthProvider';
import DemoBanner from '../demo/DemoBanner';
import FeaturedVocabMasterCard from './FeaturedVocabMasterCard';
import SmartSignupSelector from '../auth/SmartSignupSelector';
import Image from 'next/image';
import Link from 'next/link';

type Game = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'vocabulary' | 'sentences' | 'grammar' | 'spelling' | 'listening';
  subcategories?: string[];
  popular: boolean;
  languages: string[];
  path: string;
  comingSoon?: boolean;
  themes?: string[];
};

interface GamesPageClientProps {
  games: Game[];
  categories: { value: string; label: string }[];
}

export default function GamesPageClient({ games, categories }: GamesPageClientProps) {
  const { user, isLoading } = useAuth();
  const { isDemo } = useDemoAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSignupSelector, setShowSignupSelector] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePlayNowClick = (game: Game) => {
    console.log('🚀 Navigating directly to:', game.path);
    router.push(game.path);
  };

  const handleVocabMasterChooseContent = () => {
    router.push('/games/vocab-master');
  };

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory || (game.subcategories && game.subcategories.includes(selectedCategory));
    return matchesCategory;
  });

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
            {isDemo && <span className="ml-3 bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">DEMO</span>}
          </div>
          <p className="text-gray-600 max-w-2xl">
            Engage with interactive games designed to make language learning fun and effective.
          </p>

          {isDemo && (
            <div className="mt-6 max-w-4xl mx-auto px-4 sm:px-0">
              <DemoBanner
                message="Demo Mode: Try our games with basic vocabulary. Sign up to unlock all categories, languages, and features!"
                showStats={true}
                variant="compact"
                onSignupClick={() => setShowSignupSelector(true)}
              />
            </div>
          )}
        </header>

        {/* Filter Controls */}
        <div className="flex justify-center items-center mb-6 gap-4">
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
              <FeaturedVocabMasterCard onChooseContent={handleVocabMasterChooseContent} />

              {filteredGames.filter(game => game.id !== 'vocab-master').map((game) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl overflow-hidden border shadow-lg transition-all duration-300 flex flex-col bg-white border-gray-200 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300"
                >
                  <div className="h-40 relative overflow-hidden">
                    <Image
                      src={game.thumbnail}
                      alt={game.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.className = "h-40 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center relative";
                        }
                      }}
                    />
                    {isDemo && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        DEMO
                      </div>
                    )}
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
                          onClick={() => handlePlayNowClick(game)}
                          className="flex-1 text-white text-center py-2 rounded-lg font-medium transition-all transform bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
                        >
                          <Gamepad2 className="inline-block h-4 w-4 mr-2"/>Play Now
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SmartSignupSelector
        isOpen={showSignupSelector}
        onClose={() => setShowSignupSelector(false)}
        triggerRef={buttonRef}
      />
    </div>
  );
}

