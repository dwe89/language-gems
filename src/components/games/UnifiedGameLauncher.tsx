'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import UnifiedCategorySelector, { UnifiedSelectionConfig } from './UnifiedCategorySelector';
import { useUnifiedVocabulary, validateVocabularyForGame, UnifiedVocabularyItem } from '../../hooks/useUnifiedVocabulary';

export interface UnifiedGameLauncherProps {
  gameName: string;
  gameDescription?: string;
  supportedLanguages?: string[];
  showCustomMode?: boolean;
  minVocabularyRequired?: number;
  onGameStart: (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => void;
  onBack?: () => void;
  children?: React.ReactNode;
  customVocabulary?: UnifiedVocabularyItem[];
  requiresAudio?: boolean;
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
  requiresAudio = false
}: UnifiedGameLauncherProps) {
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [showSelector, setShowSelector] = useState(true);

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
    onGameStart(selectedConfig, vocabulary);
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToSelector}
                className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">{gameName}</h1>
                <p className="text-white/80 mt-1">
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
                className="text-center py-16"
              >
                <Loader2 className="h-16 w-16 text-white mx-auto mb-6 animate-spin" />
                <h2 className="text-2xl font-bold text-white mb-4">Loading Vocabulary</h2>
                <p className="text-white/80 mb-6">
                  Preparing your {selectedConfig?.customMode ? 'custom' : 'selected'} vocabulary...
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-white/20 h-4 w-4"></div>
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
                className="text-center py-16"
              >
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Vocabulary</h2>
                <p className="text-white/80 mb-6">{error}</p>
                <div className="space-y-4">
                  <button
                    onClick={handleRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                  <div>
                    <button
                      onClick={handleBackToSelector}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Choose Different Content
                    </button>
                  </div>
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
                className="text-center py-16"
              >
                <div className="text-6xl mb-6">📚</div>
                <h2 className="text-2xl font-bold text-white mb-4">No Vocabulary Found</h2>
                <p className="text-white/80 mb-6">
                  No vocabulary items are available for your selected criteria.
                </p>
                <button
                  onClick={handleBackToSelector}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Choose Different Content
                </button>
              </motion.div>
            )}

            {/* Ready State */}
            {vocabulary.length > 0 && !loading && !error && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-6">🎮</div>
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Play!</h2>
                <p className="text-white/80 mb-6">
                  Loaded <span className="font-bold text-white">{vocabulary.length}</span> vocabulary items
                  {selectedConfig?.customMode ? ' from your custom list' : ''}
                </p>
                
                {/* Vocabulary Preview */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-white mb-4">Vocabulary Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vocabulary.slice(0, 6).map((item, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-3 text-left">
                        <div className="font-medium text-white">{item.word}</div>
                        <div className="text-white/70 text-sm">{item.translation}</div>
                      </div>
                    ))}
                  </div>
                  {vocabulary.length > 6 && (
                    <p className="text-white/60 text-sm mt-4">
                      ...and {vocabulary.length - 6} more words
                    </p>
                  )}
                </div>

                {/* Custom content area */}
                {children}

                {/* Start Game Button */}
                <div className="space-y-4">
                  <button
                    onClick={handleStartGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Start {gameName}
                  </button>
                  
                  <div>
                    <button
                      onClick={handleBackToSelector}
                      className="text-white/80 hover:text-white transition-colors text-sm underline"
                    >
                      Choose different content
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
