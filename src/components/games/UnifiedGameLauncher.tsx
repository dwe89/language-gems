'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import UnifiedCategorySelector, { UnifiedSelectionConfig } from './UnifiedCategorySelector';
import { useUnifiedVocabulary, validateVocabularyForGame, UnifiedVocabularyItem } from '../../hooks/useUnifiedVocabulary';

// Theme options for games that support themes
export interface GameTheme {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
}

export const GAME_THEMES: GameTheme[] = [
  { id: 'default', name: 'Classic', icon: '🎮', accentColor: 'bg-blue-500' },
  { id: 'tokyo', name: 'Tokyo Nights', icon: '🏙️', accentColor: 'bg-pink-600' },
  { id: 'pirate', name: 'Pirate Adventure', icon: '🏴‍☠️', accentColor: 'bg-amber-600' },
  { id: 'space', name: 'Space Explorer', icon: '🚀', accentColor: 'bg-purple-600' },
  { id: 'temple', name: 'Lava Temple', icon: '🌋', accentColor: 'bg-orange-600' }
];

export interface UnifiedGameLauncherProps {
  gameName: string;
  gameDescription?: string;
  supportedLanguages?: string[];
  showCustomMode?: boolean;
  minVocabularyRequired?: number;
  onGameStart: (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => void;
  onBack?: () => void;
  children?: React.ReactNode;
  customVocabulary?: UnifiedVocabularyItem[];
  requiresAudio?: boolean;
  supportsThemes?: boolean;
  defaultTheme?: string;
}

/**
 * Unified Game Launcher Component
 * 
 * This component provides a standardized way for all games to:
 * 1. Show the unified category selector
 * 2. Load vocabulary based on selection
 * 3. Validate vocabulary before starting
 * 4. Handle loading states and errors
 * 5. Start the game with proper configuration
 */
export default function UnifiedGameLauncher({
  gameName,
  gameDescription,
  supportedLanguages = ['es', 'fr', 'de'],
  showCustomMode = true,
  minVocabularyRequired = 1,
  onGameStart,
  onBack,
  children,
  customVocabulary,
  requiresAudio = false,
  supportsThemes = false,
  defaultTheme = 'default'
}: UnifiedGameLauncherProps) {
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [showSelector, setShowSelector] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>(defaultTheme);
  const [showCustomVocabInput, setShowCustomVocabInput] = useState(false);
  const [customVocabInput, setCustomVocabInput] = useState<string>('');

  // Load vocabulary based on selected configuration
  const { 
    vocabulary, 
    loading, 
    error, 
    refetch,
    isEmpty 
  } = useUnifiedVocabulary({
    config: selectedConfig || undefined,
    limit: 100, // Get plenty of vocabulary for variety
    randomize: true,
    hasAudio: requiresAudio,
    customVocabulary: selectedConfig?.customMode ? customVocabulary : undefined
  });

  const handleSelectionComplete = (config: UnifiedSelectionConfig) => {
    setSelectedConfig(config);
    setShowSelector(false);

    // If custom mode, show vocabulary input
    if (config.customMode) {
      setShowCustomVocabInput(true);
    }
  };

  const handleBackToSelector = () => {
    setSelectedConfig(null);
    setShowSelector(true);
  };

  const handleStartGame = () => {
    if (!selectedConfig) return;

    // Validate vocabulary
    const validation = validateVocabularyForGame(vocabulary, minVocabularyRequired);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // Start the game
    onGameStart(selectedConfig, vocabulary, supportsThemes ? selectedTheme : undefined);
  };

  const handleRetry = () => {
    refetch();
  };

  // Show category selector
  if (showSelector) {
    return (
      <UnifiedCategorySelector
        gameName={gameName}
        supportedLanguages={supportedLanguages}
        showCustomMode={showCustomMode}
        onSelectionComplete={handleSelectionComplete}
        onBack={onBack}
        title={gameDescription ? `${gameName} - ${gameDescription}` : undefined}
      />
    );
  }

  // Show loading/error/ready state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToSelector}
                className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{gameName}</h1>
                <p className="text-white/80 text-sm">
                  {selectedConfig?.customMode 
                    ? 'Custom vocabulary mode'
                    : `${selectedConfig?.language?.toUpperCase()} • ${selectedConfig?.curriculumLevel} • ${selectedConfig?.categoryId}`
                  }
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Loading State */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <Loader2 className="h-12 w-12 text-white mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-bold text-white mb-2">Loading Vocabulary</h2>
                <p className="text-white/80 mb-4 text-sm">
                  Preparing your {selectedConfig?.customMode ? 'custom' : 'selected'} vocabulary...
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 max-w-md mx-auto">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-white/20 h-3 w-3"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-white/20 rounded w-3/4"></div>
                      <div className="h-2 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Unable to Load Vocabulary</h2>
                <p className="text-white/80 mb-4 text-sm">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleBackToSelector}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Choose Different Content
                  </button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {isEmpty && !loading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">📚</div>
                <h2 className="text-xl font-bold text-white mb-2">No Vocabulary Found</h2>
                <p className="text-white/80 mb-4 text-sm">
                  No vocabulary items are available for your selected criteria.
                </p>
                <button
                  onClick={handleBackToSelector}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Choose Different Content
                </button>
              </motion.div>
            )}

            {/* Custom Vocabulary Input State */}
            {showCustomVocabInput && selectedConfig?.customMode && (
              <motion.div
                key="custom-input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">✏️</div>
                <h2 className="text-xl font-bold text-white mb-2">Enter Your Custom Vocabulary</h2>
                <p className="text-white/80 mb-4 text-sm">
                  Enter word pairs in the format: "Spanish word - English translation" (one per line)
                </p>

                <div className="max-w-2xl mx-auto mb-6">
                  <textarea
                    value={customVocabInput}
                    onChange={(e) => setCustomVocabInput(e.target.value)}
                    placeholder="Example:&#10;casa - house&#10;perro - dog&#10;gato - cat"
                    className="w-full h-48 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-3 items-center">
                  <button
                    onClick={() => {
                      const lines = customVocabInput.trim().split('\n').filter(line => line.trim());
                      const customVocab: UnifiedVocabularyItem[] = lines.map((line, index) => {
                        const [word, translation] = line.split('-').map(s => s.trim());
                        return {
                          id: `custom-${index}`,
                          word: word || line,
                          translation: translation || '',
                          language: selectedConfig?.language || 'es',
                          category: 'custom',
                          subcategory: undefined,
                          part_of_speech: undefined,
                          example_sentence_original: undefined,
                          example_sentence_translation: undefined,
                          difficulty_level: undefined,
                          audio_url: undefined
                        };
                      });

                      if (customVocab.length >= minVocabularyRequired) {
                        onGameStart(selectedConfig!, customVocab, supportsThemes ? selectedTheme : undefined);
                      } else {
                        alert(`Please enter at least ${minVocabularyRequired} vocabulary items.`);
                      }
                    }}
                    disabled={!customVocabInput.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
                  >
                    Start Game with Custom Vocabulary
                  </button>

                  <button
                    onClick={() => {
                      setShowCustomVocabInput(false);
                      setShowSelector(true);
                      setSelectedConfig(null);
                      setCustomVocabInput('');
                    }}
                    className="text-white/80 hover:text-white transition-colors text-sm underline"
                  >
                    Back to category selection
                  </button>
                </div>
              </motion.div>
            )}

            {/* Ready State */}
            {vocabulary.length > 0 && !loading && !error && !showCustomVocabInput && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-6"
              >
                <h2 className="text-xl font-bold text-white mb-2">Ready to Play!</h2>
                <p className="text-white/80 mb-4 text-sm">
                  Loaded <span className="font-bold text-white">{vocabulary.length}</span> vocabulary items
                  {selectedConfig?.customMode ? ' from your custom list' : ''}
                </p>
                
                {/* Vocabulary Preview */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                  <h3 className="text-base font-semibold text-white mb-3">Vocabulary Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vocabulary.slice(0, 4).map((item, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-2 text-left">
                        <div className="font-medium text-white text-sm">{item.word}</div>
                        <div className="text-white/70 text-xs">{item.translation}</div>
                      </div>
                    ))}
                  </div>
                  {vocabulary.length > 4 && (
                    <p className="text-white/60 text-xs mt-2">
                      ...and {vocabulary.length - 4} more words
                    </p>
                  )}
                </div>

                {/* Theme Selector */}
                {supportsThemes && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                    <h3 className="text-base font-semibold text-white mb-3 text-center">Choose Your Adventure Theme</h3>
                    <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                      {GAME_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all transform hover:scale-105 border-2 ${
                            selectedTheme === theme.id
                              ? 'bg-white/20 border-white/60 text-white shadow-xl backdrop-blur-md ring-2 ring-white/50'
                              : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 text-white/80'
                          }`}
                        >
                          <div className="text-2xl">{theme.icon}</div>
                          <span className="text-xs font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom content area */}
                {children}

                {/* Start Game Button */}
                <div className="flex flex-col gap-3 items-center">
                  <button
                    onClick={handleStartGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Start {gameName}
                  </button>
                  
                  <button
                    onClick={handleBackToSelector}
                    className="text-white/80 hover:text-white transition-colors text-sm underline"
                  >
                    Choose different content
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
