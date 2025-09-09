'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Gamepad2, Palette, Play, BookOpen, MessageSquare, Sparkles, Clock } from 'lucide-react';
import UnifiedCategorySelector, { UnifiedSelectionConfig } from './UnifiedCategorySelector';
import { getGameCompatibility, GAME_COMPATIBILITY } from './gameCompatibility';

// Game interface matching the main games page
export interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'vocabulary' | 'sentences' | 'grammar';
  subcategories?: string[];
  popular?: boolean;
  languages: string[];
  path: string;
  themes?: string[];
  comingSoon?: boolean;
}

// Theme options for games that support themes
export interface GameTheme {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

const GAME_THEMES: GameTheme[] = [
  { id: 'default', name: 'Classic', description: 'Clean and simple design', color: 'from-blue-500 to-indigo-600', icon: '🎮' },
  { id: 'tokyo', name: 'Tokyo Nights', description: 'Neon cyberpunk aesthetic', color: 'from-purple-500 to-pink-600', icon: '🌃' },
  { id: 'pirate', name: 'Pirate Adventure', description: 'Swashbuckling theme', color: 'from-amber-600 to-red-700', icon: '🏴‍☠️' },
  { id: 'space', name: 'Space Explorer', description: 'Cosmic adventure', color: 'from-indigo-600 to-purple-700', icon: '🚀' },
  { id: 'temple', name: 'Lava Temple', description: 'Ancient temple adventure', color: 'from-orange-600 to-red-700', icon: '🏛️' }
];

export interface ReversedGameSelectionProps {
  games: Game[];
  onGameStart: (gameId: string, config: UnifiedSelectionConfig, theme?: string) => void;
  onBack?: () => void;
}

type SelectionStep = 'content' | 'games' | 'theme';

export default function ReversedGameSelection({
  games,
  onGameStart,
  onBack
}: ReversedGameSelectionProps) {
  const [step, setStep] = useState<SelectionStep>('content');
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('default');

  // Filter games based on selected content type
  const getCompatibleGames = (config: UnifiedSelectionConfig): Game[] => {
    if (!config.customMode) {
      // For regular categories, show all games
      return games;
    }

    // For custom mode, filter by content type compatibility
    const contentType = config.customContentType || 'vocabulary';
    return games.filter(game => {
      const compatibility = getGameCompatibility(game.id);
      if (!compatibility) return false;

      switch (contentType) {
        case 'vocabulary':
          return compatibility.supportsVocabulary;
        case 'sentences':
          return compatibility.supportsSentences;
        case 'mixed':
          return compatibility.supportsMixed;
        default:
          return false;
      }
    });
  };

  const handleContentSelection = (config: UnifiedSelectionConfig) => {
    setSelectedConfig(config);
    setStep('games');
  };

  const handleGameSelection = (game: Game) => {
    setSelectedGame(game);
    
    // Check if game supports themes
    const gameSupportsThemes = game.themes && game.themes.length > 0;
    
    if (gameSupportsThemes) {
      setStep('theme');
    } else {
      // Start game immediately
      onGameStart(game.id, selectedConfig!, 'default');
    }
  };

  const handleThemeSelection = (themeId: string) => {
    setSelectedTheme(themeId);
    onGameStart(selectedGame!.id, selectedConfig!, themeId);
  };

  const goBack = () => {
    switch (step) {
      case 'games':
        setStep('content');
        setSelectedConfig(null);
        break;
      case 'theme':
        setStep('games');
        setSelectedGame(null);
        break;
      default:
        onBack?.();
    }
  };

  const compatibleGames = selectedConfig ? getCompatibleGames(selectedConfig) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">

        {/* Back Button */}
        {(step !== 'content' || onBack) && (
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 'content' && (
            <UnifiedCategorySelector
              gameName="Language Games"
              supportedLanguages={['es', 'fr', 'de']}
              showCustomMode={true}
              onSelectionComplete={handleContentSelection}
              onBack={onBack}
              title="Select Your Learning Content"
              preferredContentType="vocabulary"
            />
          )}

          {step === 'games' && selectedConfig && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Gamepad2 className="h-12 w-12 text-white mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Game</h2>
                <p className="text-gray-300">
                  {selectedConfig.customMode 
                    ? `Games compatible with ${selectedConfig.customContentType || 'vocabulary'} content`
                    : `Games for ${selectedConfig.categoryId} vocabulary`
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {compatibleGames.map((game, index) => {
                  const compatibility = getGameCompatibility(game.id);
                  
                  return (
                    <motion.div
                      key={game.id}
                      onClick={() => handleGameSelection(game)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 flex flex-col"
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
                              const fallback = document.createElement('div');
                              fallback.innerHTML = `<div class="text-4xl">${game.category === 'vocabulary' ? '📝' : game.category === 'sentences' ? '💬' : '📚'}</div>`;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {game.category === 'sentences' ? 'Sentences' : game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{game.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">{game.description}</p>
                        
                        {compatibility && (
                          <div className="text-xs text-gray-500 mb-3">
                            {compatibility.minItems && `Min: ${compatibility.minItems} items`}
                            {compatibility.maxItems && ` • Max: ${compatibility.maxItems} items`}
                          </div>
                        )}
                        
                        <div className="flex space-x-3 mt-auto">
                          {game.comingSoon ? (
                            <div className="flex-1 text-center py-2 rounded-lg font-medium text-gray-600 bg-gray-100 border border-gray-200 flex items-center justify-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-600" />
                              <span>Coming soon</span>
                            </div>
                          ) : (
                            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-center py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                              <Gamepad2 className="h-4 w-4" />
                              <span>Play Now</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {compatibleGames.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎮</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Compatible Games</h3>
                  <p className="text-gray-300">
                    No games support {selectedConfig.customContentType || 'this content type'} yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {step === 'theme' && selectedGame && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Theme</h2>
                <p className="text-gray-300">Customize the look and feel of {selectedGame.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {GAME_THEMES.map((theme, index) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeSelection(theme.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gradient-to-br ${theme.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                  >
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">{theme.icon}</div>
                      <h3 className="text-lg font-bold mb-2">{theme.name}</h3>
                      <p className="text-white/90 text-sm mb-4">{theme.description}</p>
                      <div className="flex items-center justify-center">
                        <Play className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Start Game</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}