'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';
import LanguageSelection from './components/LanguageSelection';
import LeagueSelection from './components/LeagueSelection';
import OpponentSelection from './components/OpponentSelection';
import BattleArena from './components/BattleArena';
import ConjugationDuelAssignmentWrapper from './components/ConjugationDuelAssignmentWrapper';

type GameState = 'language-select' | 'league-select' | 'opponent-select' | 'battle' | 'results';

export default function ConjugationDuelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <ConjugationDuelAssignmentWrapper assignmentId={assignmentId} />;
  }
  const {
    leagues,
    verbs,
    battleState,
    loadLeagues,
    loadVerbs,
    startBattle,
    setBattleState,
  } = useGameStore();

  const [gameState, setGameState] = useState<GameState>('language-select');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedOpponent, setSelectedOpponent] = useState<any>(null);

  // Load game data when language is selected
  useEffect(() => {
    if (!selectedLanguage) return;

    const loadGameData = async () => {
      try {
        // Load leagues for selected language
        const leaguesResponse = await fetch('/data/leagues.json');
        const leaguesData = await leaguesResponse.json();
        const languageLeagues = leaguesData[selectedLanguage] || leaguesData.spanish || [];
        loadLeagues(languageLeagues);

        // Load verbs for selected language
        const verbsResponse = await fetch('/data/verbs.json');
        const verbsData = await verbsResponse.json();
        // Keep the full structure with language key for useBattle hook compatibility
        loadVerbs(verbsData);
      } catch (error) {
        console.error('Failed to load game data:', error);
      }
    };

    loadGameData();
  }, [selectedLanguage, loadLeagues, loadVerbs]);

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    setGameState('league-select');
  };

  const handleLeagueSelect = (leagueId: string) => {
    setSelectedLeague(leagueId);
    setGameState('opponent-select');
  };

  const handleOpponentSelect = (opponent: any) => {
    setSelectedOpponent(opponent);
    startBattle(opponent);
    setGameState('battle');
  };

  const handleBackToLeagues = () => {
    setSelectedLeague('');
    setGameState('league-select');
  };

  const handleBackToLanguages = () => {
    setSelectedLanguage('');
    setSelectedLeague('');
    setGameState('language-select');
  };

  const handleBackToOpponents = () => {
    setBattleState({ isInBattle: false });
    setGameState('opponent-select');
  };

  const handleBattleEnd = () => {
    setGameState('results');
    
    // Auto-return to opponent selection after a delay
    setTimeout(() => {
      setGameState('opponent-select');
    }, 3000);
  };

  const handleBackToMenu = () => {
    router.push('/games');
  };

  // Loading state (only show loading if language is selected but data isn't loaded)
  if (selectedLanguage && (!leagues.length || !verbs)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            ⚔️
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Preparing Battle Arena...
          </h2>
          <p className="text-gray-300">
            Loading weapons and opponents
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back to Games Button */}
      {gameState === 'league-select' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleBackToMenu}
          className="fixed top-4 left-4 z-50 p-3 bg-black/20 hover:bg-black/30 rounded-lg transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {gameState === 'language-select' && (
          <motion.div
            key="language-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LanguageSelection onLanguageSelect={handleLanguageSelect} />
          </motion.div>
        )}

        {gameState === 'league-select' && (
          <motion.div
            key="league-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LeagueSelection
              onLeagueSelect={handleLeagueSelect}
              onBackToLanguages={handleBackToLanguages}
              selectedLanguage={selectedLanguage}
            />
          </motion.div>
        )}

        {gameState === 'opponent-select' && (
          <motion.div
            key="opponent-select"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <OpponentSelection
              leagueId={selectedLeague}
              onOpponentSelect={handleOpponentSelect}
              onBack={handleBackToLeagues}
            />
          </motion.div>
        )}

        {gameState === 'battle' && (
          <motion.div
            key="battle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <BattleArena onBattleEnd={handleBattleEnd} language={selectedLanguage} />
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="text-8xl mb-6"
              >
                {battleState.opponentHealth === 0 ? '🏆' : '💀'}
              </motion.div>
              
              <motion.h2
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-4"
              >
                {battleState.opponentHealth === 0 ? 'Victory!' : 'Defeat!'}
              </motion.h2>
              
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-300 mb-8"
              >
                {battleState.opponentHealth === 0 
                  ? `You have defeated ${selectedOpponent?.name}!`
                  : `${selectedOpponent?.name} has defeated you!`
                }
              </motion.p>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-400"
              >
                Returning to opponent selection...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
