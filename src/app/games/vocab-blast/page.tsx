'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Settings, Play } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import VocabBlastGameWrapper from './components/VocabBlastGameWrapper';
import VocabBlastAssignmentWrapper from './components/VocabBlastAssignmentWrapper';
import VocabBlastSettings from './components/VocabBlastSettings';
import { ThemeProvider } from '../noughts-and-crosses/components/ThemeProvider';
import { useAudio } from '../noughts-and-crosses/hooks/useAudio';

export type GameState = 'menu' | 'settings' | 'playing' | 'completed' | 'paused';

export interface VocabBlastGameSettings {
  difficulty: string;
  category: string;
  language: string;
  theme: string;
  subcategory?: string;
  timeLimit: number;
  mode: 'categories' | 'custom';
  customWords?: string[];
}

export default function VocabBlastPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const language = searchParams?.get('language') || 'spanish';
  const difficulty = searchParams?.get('difficulty') || 'intermediate';
  const category = searchParams?.get('category') || '';
  const theme = searchParams?.get('theme') || 'default';

  // Initialize all hooks first (before any conditional returns)
  const [gameState, setGameState] = useState<GameState>(assignmentId ? 'playing' : 'menu');
  const [gameSettings, setGameSettings] = useState<VocabBlastGameSettings>({
    difficulty: assignmentId ? difficulty : 'intermediate',
    category: assignmentId ? category : '',
    language: assignmentId ? language : 'spanish',
    theme: assignmentId ? theme : 'default',
    timeLimit: 60,
    mode: 'categories'
  });

  const [soundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);

  // Handle URL parameters (skip if in assignment mode)
  useEffect(() => {
    if (!assignmentId && searchParams) {
      const themeParam = searchParams.get('theme');
      const languageParam = searchParams.get('language');
      const categoryParam = searchParams.get('category');

      if (themeParam || languageParam || categoryParam) {
        setGameSettings(prev => ({
          ...prev,
          ...(themeParam && { theme: themeParam }),
          ...(languageParam && { language: languageParam }),
          ...(categoryParam && { category: categoryParam })
        }));
      }
    }
  }, [searchParams, assignmentId]);

  // Conditional logic after all hooks are initialized
  // Only redirect to login if not in demo mode and not authenticated
  if (!isLoading && !user && !isDemo) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Vocab Blast...</p>
        </div>
      </div>
    );
  }

  const startGame = (settings: VocabBlastGameSettings) => {
    playSFX('button-click');
    setGameSettings(settings);
    setGameState('playing');
  };

  const backToMenu = () => {
    playSFX('button-click');
    setGameState('menu');
  };

  const openSettings = () => {
    playSFX('button-click');
    setGameState('settings');
  };

  const handleGameEnd = (result: { outcome: 'win' | 'loss' | 'timeout'; score: number; wordsLearned: number }) => {
    console.log('Game ended:', result);
    setGameState('completed');
  };

  const getThemeTitle = () => {
    switch (gameSettings.theme) {
      case 'tokyo':
        return '🌃 Neon Hack';
      case 'pirate':
        return '🏴‍☠️ Cannon Clash';
      case 'space':
        return '🚀 Comet Catch';
      case 'temple':
        return '🔥 Rising Lava Quiz';
      default:
        return '💎 Vocab Blast';
    }
  };

  const getThemeDescription = () => {
    switch (gameSettings.theme) {
      case 'tokyo':
        return 'Hack the system by clicking the correct data packets';
      case 'pirate':
        return 'Sink enemy ships with accurate translations';
      case 'space':
        return 'Collect cosmic vocabulary comets';
      case 'temple':
        return 'Escape rising lava by clicking stone tablets';
      default:
        return 'Click vocabulary gems to pop and translate';
    }
  };

  return (
    <ThemeProvider themeId={gameSettings.theme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex flex-col items-center justify-center p-8"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {getThemeTitle()}
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  {getThemeDescription()}
                </p>
              </motion.div>

              {/* Menu Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-6 w-full max-w-md"
              >
                <motion.button
                  onClick={openSettings}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <Play className="w-6 h-6" />
                  Start Game
                </motion.button>

                <motion.button
                  onClick={openSettings}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-white/20"
                >
                  <Settings className="w-6 h-6" />
                  Settings
                </motion.button>

                <motion.button
                  onClick={() => window.location.href = '/games'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                >
                  <Home className="w-6 h-6" />
                  Back to Games
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {gameState === 'settings' && (
            <VocabBlastSettings
              currentSettings={gameSettings}
              onStartGame={startGame}
              onBackToMenu={backToMenu}
            />
          )}

          {gameState === 'playing' && (
            assignmentId ? (
              <VocabBlastAssignmentWrapper
                assignmentId={assignmentId}
                studentId={user?.id || ''}
                onAssignmentComplete={(progress) => {
                  console.log('Vocab Blast assignment completed:', progress);
                  setGameState('completed');
                }}
                onBackToAssignments={() => router.push('/student-dashboard/assignments')}
                onBackToMenu={backToMenu}
              />
            ) : (
              <VocabBlastGameWrapper
                settings={gameSettings}
                onBackToMenu={backToMenu}
                onGameEnd={handleGameEnd}
                assignmentId={assignmentId}
                userId={user?.id}
                isAssignmentMode={!!assignmentId}
              />
            )
          )}

          {gameState === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="min-h-screen flex flex-col items-center justify-center p-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Game Complete!</h2>
                <p className="text-xl text-slate-300 mb-8">Great job learning vocabulary!</p>
                
                <div className="flex gap-4">
                  <button
                    onClick={openSettings}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={backToMenu}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
