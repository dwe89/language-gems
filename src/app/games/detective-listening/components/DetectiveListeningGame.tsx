'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CaseSelection from './CaseSelection';
import RadioFrequencySelection from './RadioFrequencySelection';
import DetectiveRoom from './DetectiveRoom';
import CaseSolved from './CaseSolved';

type GameScreen = 'case-selection' | 'frequency-selection' | 'detective-room' | 'case-solved';

interface DetectiveListeningGameProps {
  settings: {
    caseType: string;
    language: string;
    difficulty: string;
  };
  onBackToMenu: () => void;
}

export default function DetectiveListeningGame({ settings, onBackToMenu }: DetectiveListeningGameProps) {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('case-selection');
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameProgress, setGameProgress] = useState({
    currentEvidence: 0,
    totalEvidence: 10,
    correctAnswers: 0,
    evidenceCollected: []
  });

  const handleCaseSelection = (caseType: string) => {
    try {
      setError(null);
      setSelectedCase(caseType);
      setCurrentScreen('frequency-selection');
    } catch (err) {
      setError('Failed to select case. Please try again.');
    }
  };

  const handleFrequencySelection = (language: string) => {
    try {
      setError(null);
      setIsLoading(true);
      setSelectedLanguage(language);

      // Simulate loading time for audio preloading
      setTimeout(() => {
        setIsLoading(false);
        setCurrentScreen('detective-room');
      }, 1000);
    } catch (err) {
      setError('Failed to connect to radio frequency. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGameComplete = (finalScore: any) => {
    setGameProgress(prev => ({ ...prev, ...finalScore }));
    setCurrentScreen('case-solved');
  };

  const handleNewCase = () => {
    setCurrentScreen('case-selection');
    setGameProgress({
      currentEvidence: 0,
      totalEvidence: 10,
      correctAnswers: 0,
      evidenceCollected: []
    });
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-screen bg-gradient-to-br from-amber-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-amber-100 mb-2">Connecting to Radio Frequency...</h2>
          <p className="text-amber-200">Preparing evidence transmission</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="w-full h-full min-h-screen bg-gradient-to-br from-red-900 to-amber-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-100 mb-4">Investigation Error</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setCurrentScreen('case-selection');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Case Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {currentScreen === 'case-selection' && (
          <motion.div
            key="case-selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-full h-full"
          >
            <CaseSelection onCaseSelect={handleCaseSelection} />
          </motion.div>
        )}

        {currentScreen === 'frequency-selection' && (
          <motion.div
            key="frequency-selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-full h-full"
          >
            <RadioFrequencySelection 
              selectedCase={selectedCase}
              onFrequencySelect={handleFrequencySelection}
              onBack={() => setCurrentScreen('case-selection')}
            />
          </motion.div>
        )}

        {currentScreen === 'detective-room' && (
          <motion.div
            key="detective-room"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full"
          >
            <DetectiveRoom 
              caseType={selectedCase}
              language={selectedLanguage}
              onGameComplete={handleGameComplete}
              onBack={() => setCurrentScreen('frequency-selection')}
            />
          </motion.div>
        )}

        {currentScreen === 'case-solved' && (
          <motion.div
            key="case-solved"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="w-full h-full"
          >
            <CaseSolved 
              caseType={selectedCase}
              gameProgress={gameProgress}
              onNewCase={handleNewCase}
              onBackToMenu={onBackToMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
