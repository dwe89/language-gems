'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import DetectiveListeningGame from './components/DetectiveListeningGame';
import DetectiveListeningAssignmentWrapper from './components/DetectiveListeningAssignmentWrapper';

export default function DetectiveListeningPage() {
  // Check for assignment mode
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // ALWAYS initialize hooks first to prevent "more hooks than previous render" error
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    caseType: '',
    language: '',
    difficulty: 'normal'
  });

  // If assignment mode, render assignment wrapper (after all hooks are initialized)
  if (assignmentId && mode === 'assignment') {
    return <DetectiveListeningAssignmentWrapper assignmentId={assignmentId} />;
  }

  const startGame = (settings: any) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  const backToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/games"
                className="flex items-center space-x-2 text-amber-700 hover:text-amber-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Games</span>
              </Link>
              <div className="h-6 w-px bg-amber-300"></div>
              <h1 className="text-2xl font-bold text-amber-900">
                🕵️ Detective Listening Game
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {/* Game intro and case selection will go here */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">
                  Welcome, Detective!
                </h2>
                <p className="text-lg text-amber-700 mb-8">
                  Choose your case and radio frequency to begin solving mysteries through language!
                </p>
                <button
                  onClick={() => startGame({ caseType: 'basics_core_language', language: 'spanish', difficulty: 'normal' })}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Investigation
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-screen"
            >
              <DetectiveListeningGame 
                settings={gameSettings}
                onBackToMenu={backToMenu}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
