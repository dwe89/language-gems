'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useVocabularyByCategory } from '../../../hooks/useVocabulary';
import HangmanGameWrapper from './components/HangmanGameWrapper';
import HangmanAssignmentWrapper from './components/HangmanAssignmentWrapper';
import GameSettings from './components/GameSettings';

export default function HangmanPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  const language = searchParams?.get('language') || 'spanish';
  const difficulty = searchParams?.get('difficulty') || 'beginner';
  const category = searchParams?.get('category') || 'animals';

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <HangmanAssignmentWrapper assignmentId={assignmentId} />;
  }

  // Initialize all hooks first (before any conditional returns)
  const [settings, setSettings] = useState({
    difficulty: assignmentId ? difficulty : 'beginner',
    category: assignmentId ? category : 'animals',
    language: assignmentId ? language : 'spanish',
    theme: 'default',
    customWords: [] as string[],
  });
  const [gameStarted, setGameStarted] = useState(!!assignmentId); // Auto-start for assignments
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    streak: 0,
    bestStreak: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Category selection state
  const [selectedCategory, setSelectedCategory] = useState<string>('basics_core_language');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('spanish');

  // Map language for vocabulary loading
  const mapLanguageForVocab = (lang: string) => {
    const mapping: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'italian': 'it',
      'english': 'en',
      'portuguese': 'pt'
    };
    return mapping[lang] || 'es';
  };

  // Use category-based vocabulary when categories are selected
  const {
    vocabulary: categoryVocabulary,
    loading: vocabularyLoading
  } = useVocabularyByCategory({
    language: mapLanguageForVocab(selectedLanguage),
    categoryId: selectedCategory || undefined,
    subcategoryId: selectedSubcategory || undefined
  });

  // Debug vocabulary selection
  console.log('Hangman Page - Vocabulary Selection Debug:', {
    selectedLanguage,
    selectedCategory,
    selectedSubcategory,
    mappedLanguage: mapLanguageForVocab(selectedLanguage),
    vocabularyCount: categoryVocabulary?.length || 0,
    vocabularyLoading
  });

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('hangmanStats');
      if (savedStats) {
        try {
          setGameStats(JSON.parse(savedStats));
        } catch (error) {
          console.error('Failed to parse saved stats', error);
        }
      }
    }
  }, []);

  // Setup fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Conditional logic after all hooks are initialized
  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Hangman Game...</p>
        </div>
      </div>
    );
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleStartGame = (settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords: string[];
    subcategory?: string;
  }) => {
    console.log('handleStartGame called with settings:', settings);
    console.log('Current page state before update:', {
      selectedCategory,
      selectedSubcategory,
      selectedLanguage
    });

    setSettings(settings);
    // Update page state to match game settings
    setSelectedCategory(settings.category);
    setSelectedLanguage(settings.language);
    if (settings.subcategory) {
      setSelectedSubcategory(settings.subcategory);
    }

    console.log('Page state should be updated to:', {
      category: settings.category,
      subcategory: settings.subcategory,
      language: settings.language
    });

    startGame();
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  const handleGameEnd = (result: 'win' | 'lose') => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed += 1;
    
    if (result === 'win') {
      newStats.gamesWon += 1;
      newStats.streak += 1;
      if (newStats.streak > newStats.bestStreak) {
        newStats.bestStreak = newStats.streak;
      }
    } else {
      newStats.gamesLost += 1;
      newStats.streak = 0;
    }
    
    setGameStats(newStats);
    
    // Save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hangmanStats', JSON.stringify(newStats));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500">
      
      {/* Header - Always show when not in game */}
      {!gameStarted && (
        <motion.div 
          className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/games" className="text-white hover:text-white/80 transition-colors">
            <motion.div
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all border border-white/30"
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoChevronBackOutline className="w-5 h-5" />
              <span className="font-medium">Back to Games</span>
            </motion.div>
          </Link>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            🎯 Vocabulary Hangman
          </motion.h1>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </motion.div>
      )}

      {/* Main Content Area */}
      {!gameStarted && (
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <GameSettings
                onStartGame={handleStartGame}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategoryChange={setSelectedCategory}
                onSubcategoryChange={setSelectedSubcategory}
                categoryVocabulary={categoryVocabulary}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                vocabularyLoading={vocabularyLoading}
                inModal={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Main Game Area - Full Width */}
      <AnimatePresence mode="wait">
        {gameStarted && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full"
          >
            <HangmanGameWrapper
              settings={{
                ...settings,
                subcategory: selectedSubcategory,
                categoryVocabulary: selectedCategory && selectedCategory !== '' ? categoryVocabulary : []
              }}
              onBackToMenu={handleBackToMenu}
              onGameEnd={handleGameEnd}
              isFullscreen={isFullscreen}
              assignmentId={assignmentId}
              userId={user?.id}
              isAssignmentMode={!!assignmentId}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
} 
