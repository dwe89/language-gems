'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import ConjugationDuelAssignmentWrapper from './components/ConjugationDuelAssignmentWrapper';
import LanguageSelection from './components/LanguageSelection';
import LeagueSelection from './components/LeagueSelection';
import OpponentSelection from './components/OpponentSelection';
import BattleArena from './components/BattleArena';
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

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Conjugation Duel"
        gameDescription="Battle opponents by conjugating verbs correctly in fast-paced duels"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Conjugation Duel uses verb conjugation data
        minVocabularyRequired={0} // Uses verb data, not vocabulary
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Choose your league and opponent</p>
            <p>• Conjugate verbs correctly to attack</p>
            <p>• Defeat opponents to advance leagues</p>
            <p>• Master all verb tenses to become champion</p>
            <p>• Earn rewards and unlock new challenges</p>
          </div>
        </div>
      </UnifiedGameLauncher>
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
          <BattleArena
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
