'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CaseSelection from '../../detective-listening/components/CaseSelection';
import LanguageSelection from './LanguageSelection';
import TranslatorRoom from './TranslatorRoom';
import CaseSolved from './CaseSolved';
import { StandardVocabularyItem, AssignmentData, GameProgress } from '../../../../components/games/templates/GameAssignmentWrapper';

type GameScreen = 'case-selection' | 'language-selection' | 'translator-room' | 'case-solved';

interface AssignmentMode {
  assignment: AssignmentData;
  vocabulary: StandardVocabularyItem[];
  onProgressUpdate: (progress: Partial<GameProgress>) => void;
  onGameComplete: (finalProgress: GameProgress) => void;
}

interface CaseFileTranslatorGameProps {
  settings: {
    caseType: string;
    language: string;
    curriculumLevel: string;
    subcategory?: string;
    difficulty: string;
  };
  onBackToMenu: () => void;
  assignmentMode?: AssignmentMode;
}

export default function CaseFileTranslatorGame({ settings, onBackToMenu, assignmentMode }: CaseFileTranslatorGameProps) {
  // If assignment mode or settings are provided (from unified launcher), skip case selection and go straight to translator room
  const hasPreselectedSettings = assignmentMode || (settings.caseType && settings.language);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(
    hasPreselectedSettings ? 'translator-room' : 'case-selection'
  );
  
  const [selectedCase, setSelectedCase] = useState<string>(settings.caseType || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(settings.subcategory || null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(settings.language || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameProgress, setGameProgress] = useState({
    correctAnswers: 0,
    totalQuestions: 10,
    score: 0,
    timeSpent: 0,
    accuracy: 0,
    completedAt: null as string | null
  });

  const handleCaseSelection = (categoryId: string, subcategoryId: string | null) => {
    try {
      setError(null);
      setSelectedCase(categoryId);
      setSelectedSubcategory(subcategoryId);
      setCurrentScreen('language-selection');
    } catch (err) {
      setError('Failed to select case. Please try again.');
    }
  };

  const handleLanguageSelection = (language: string) => {
    try {
      setError(null);
      setIsLoading(true);
      setSelectedLanguage(language);

      // Simulate loading time for sentence preloading
      setTimeout(() => {
        setIsLoading(false);
        setCurrentScreen('translator-room');
      }, 1000);
    } catch (err) {
      setError('Failed to load translation files. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGameComplete = (progress: any) => {
    setGameProgress(progress);
    
    if (assignmentMode) {
      // Convert to assignment progress format
      const assignmentProgress: GameProgress = {
        assignmentId: assignmentMode.assignment.id,
        gameId: 'case-file-translator',
        studentId: '',
        wordsCompleted: progress.correctAnswers,
        totalWords: progress.totalQuestions,
        score: progress.score,
        maxScore: 100,
        timeSpent: progress.timeSpent,
        accuracy: progress.accuracy,
        completedAt: progress.completedAt ? new Date(progress.completedAt) : undefined,
        sessionData: progress
      };
      
      assignmentMode.onProgressUpdate(assignmentProgress);
      assignmentMode.onGameComplete(assignmentProgress);
    }
    
    setCurrentScreen('case-solved');
  };

  const handleNewCase = () => {
    setSelectedCase('');
    setSelectedSubcategory(null);
    setSelectedLanguage('');
    setGameProgress({
      correctAnswers: 0,
      totalQuestions: 10,
      score: 0,
      timeSpent: 0,
      accuracy: 0,
      completedAt: null
    });
    // Always go back to case selection for new case, regardless of how we got here
    setCurrentScreen('case-selection');
  };

  // Error boundary
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md mx-auto text-center"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-red-400 text-xl font-bold mb-4">Case File Error</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setCurrentScreen('case-selection');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Return to Case Selection
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-400 text-lg">Loading translation files...</p>
          <p className="text-amber-300/70 text-sm mt-2">Preparing intercepted communications</p>
        </motion.div>
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

        {currentScreen === 'language-selection' && (
          <motion.div
            key="language-selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-full h-full"
          >
            <LanguageSelection 
              selectedCase={selectedCase}
              onLanguageSelect={handleLanguageSelection}
              onBack={() => setCurrentScreen('case-selection')}
            />
          </motion.div>
        )}

        {currentScreen === 'translator-room' && (
          <motion.div
            key="translator-room"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full"
          >
            <TranslatorRoom
              caseType={selectedCase}
              subcategory={selectedSubcategory}
              language={selectedLanguage}
              onGameComplete={handleGameComplete}
              onBack={assignmentMode || hasPreselectedSettings ? onBackToMenu : () => setCurrentScreen('language-selection')}
              assignmentMode={assignmentMode}
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
