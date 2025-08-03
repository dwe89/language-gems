'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import ConjugationDuelAssignmentWrapper from './components/ConjugationDuelAssignmentWrapper';
import LanguageSelection from './components/LanguageSelection';
import LeagueSelection from './components/LeagueSelection';
import OpponentSelection from './components/OpponentSelection';
import ConjugationDuelGameWrapper from './components/ConjugationDuelGameWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

type GameState = 'language-select' | 'league-select' | 'opponent-select' | 'battle' | 'results';

export default function ConjugationDuelPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <ConjugationDuelAssignmentWrapper assignmentId={assignmentId} />;
  }

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [gameState, setGameState] = useState<GameState>('league-select');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedOpponent, setSelectedOpponent] = useState<any>(null);

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setSelectedConfig(config);
    setSelectedLanguage(config.language === 'es' ? 'spanish' : 
                      config.language === 'fr' ? 'french' : 
                      config.language === 'de' ? 'german' : 'spanish');
    setGameStarted(true);
    
    console.log('Conjugation Duel started with unified config:', {
      config,
      vocabularyCount: vocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedConfig(null);
    setGameState('league-select');
    setSelectedLanguage('');
    setSelectedLeague('');
    setSelectedOpponent(null);
  };

  // Show language selection if game not started
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border-4 border-white/20 text-center max-w-2xl mx-4">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            ⚔️ Conjugation Duel
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Battle opponents by conjugating verbs correctly in fast-paced duels
          </p>

          {/* Game-specific instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h4 className="text-white font-semibold mb-4 text-center">How to Play</h4>
            <div className="text-white/80 text-sm space-y-2">
              <p>• Choose your language and start dueling</p>
              <p>• Conjugate verbs correctly to attack opponents</p>
              <p>• Defeat opponents to advance through leagues</p>
              <p>• Master all verb tenses to become champion</p>
              <p>• Earn rewards and unlock new challenges</p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-xl mb-4">Choose Your Language</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { code: 'es', name: 'Spanish', flag: '🇪🇸' },
                { code: 'fr', name: 'French', flag: '🇫🇷' },
                { code: 'de', name: 'German', flag: '🇩🇪' }
              ].map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    // Create a minimal config for language-only selection
                    const config: UnifiedSelectionConfig = {
                      language: language.code,
                      curriculumLevel: 'KS3',
                      categoryId: 'verbs', // Not used but required
                      subcategoryId: undefined
                    };
                    handleGameStart(config, []); // Empty vocabulary array since we don't need it
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{language.flag}</div>
                  <div>{language.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => router.push('/games')}
              className="mt-6 text-white/80 hover:text-white transition-colors text-sm underline"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show game flow if started
  if (gameStarted && selectedConfig) {
    // Back button for all states
    const BackButton = () => (
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
        >
          <svg className="h-5 w-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Back to Games
        </button>
      </div>
    );

    // League selection
    if (gameState === 'league-select') {
      return (
        <div className="min-h-screen">
          <BackButton />
          <LeagueSelection
            language={selectedLanguage}
            onLeagueSelect={(league) => {
              setSelectedLeague(league);
              setGameState('opponent-select');
            }}
            onBack={handleBackToMenu}
          />
        </div>
      );
    }

    // Opponent selection
    if (gameState === 'opponent-select') {
      return (
        <div className="min-h-screen">
          <BackButton />
          <OpponentSelection
            language={selectedLanguage}
            league={selectedLeague}
            onOpponentSelect={(opponent) => {
              setSelectedOpponent(opponent);
              setGameState('battle');
            }}
            onBack={() => setGameState('league-select')}
          />
        </div>
      );
    }

    // Battle arena
    if (gameState === 'battle') {
      return (
        <div className="min-h-screen">
          <ConjugationDuelGameWrapper
            language={selectedLanguage}
            league={selectedLeague}
            opponent={selectedOpponent}
            onBackToMenu={handleBackToMenu}
            onGameEnd={(result) => {
              console.log('Conjugation Duel ended:', result);
              if (assignmentId) {
                setTimeout(() => {
                  router.push('/student-dashboard/assignments');
                }, 3000);
              } else {
                setGameState('results');
              }
            }}
            assignmentId={assignmentId}
            userId={user?.id}
          />
        </div>
      );
    }
  }

  // Fallback
  return null;
}
