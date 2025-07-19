'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';
import LeagueSelection from './components/LeagueSelection';
import OpponentSelection from './components/OpponentSelection';
import BattleArena from './components/BattleArena';

type GameState = 'league-select' | 'opponent-select' | 'battle' | 'results';

export default function ConjugationDuelPage() {
  const router = useRouter();
  const {
    leagues,
    verbs,
    battleState,
    loadLeagues,
    loadVerbs,
    startBattle,
    setBattleState,
  } = useGameStore();

  const [gameState, setGameState] = useState<GameState>('league-select');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedOpponent, setSelectedOpponent] = useState<any>(null);

  // Load game data on mount
  useEffect(() => {
    const loadGameData = async () => {
      try {
        // Load leagues
        const leaguesResponse = await fetch('/data/leagues.json');
        const leaguesData = await leaguesResponse.json();
        loadLeagues(leaguesData.leagues);

        // Load verbs
        const verbsResponse = await fetch('/data/verbs.json');
        const verbsData = await verbsResponse.json();
        loadVerbs(verbsData);
      } catch (error) {
        console.error('Failed to load game data:', error);
      }
    };

    loadGameData();
  }, [loadLeagues, loadVerbs]);

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

  // Loading state
  if (!leagues.length || !verbs) {
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
        {gameState === 'league-select' && (
          <motion.div
            key="league-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LeagueSelection onLeagueSelect={handleLeagueSelect} />
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
            <BattleArena onBattleEnd={handleBattleEnd} />
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
