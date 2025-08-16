'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import LanguageSelection from './components/LanguageSelection';
import LeagueSelection from './components/LeagueSelection';
import OpponentSelection from './components/OpponentSelection';
import ConjugationDuelGameWrapper from './components/ConjugationDuelGameWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import Link from 'next/link';
import { useGameStore } from '../../../store/gameStore';

type GameState = 'language-select' | 'league-select' | 'opponent-select' | 'battle' | 'results';

export default function ConjugationDuelPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Load leagues and verbs data into the store
  const { loadLeagues, loadVerbs, leagues, verbs } = useGameStore();
  const [dataLoaded, setDataLoaded] = useState(false);

  // For assignment mode, we don't need static data - set loaded immediately
  useEffect(() => {
    if (assignmentId && mode === 'assignment') {
      console.log('🎯 [CONJUGATION DUEL] Assignment mode detected - skipping static data loading', {
        assignmentId,
        mode,
        message: 'Will use grammar database instead of static JSON files'
      });
      setDataLoaded(true);
      return;
    }
  }, [assignmentId, mode]);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        // Skip static data loading for assignments - they use grammar database
        if (assignmentId && mode === 'assignment') {
          return; // Already handled in above useEffect
        }

        console.log('🎮 Conjugation Duel: Loading game data for free play...');
        const [leaguesRes, verbsRes] = await Promise.all([
          fetch('/data/leagues.json'),
          fetch('/data/verbs.json')
        ]);

        if (!leaguesRes.ok || !verbsRes.ok) {
          throw new Error(`Failed to fetch data: leagues ${leaguesRes.status}, verbs ${verbsRes.status}`);
        }

        const leaguesJson = await leaguesRes.json();
        const verbsJson = await verbsRes.json();

        if (!cancelled) {
          // leagues.json has shape { leagues: [...] }
          loadLeagues(leaguesJson.leagues);
          loadVerbs(verbsJson);
          setDataLoaded(true);
          console.log('✅ Conjugation Duel: Game data loaded successfully', {
            leaguesCount: leaguesJson.leagues?.length,
            verbsKeys: Object.keys(verbsJson)
          });
        }
      } catch (e) {
        console.error('❌ Failed to load Conjugation Duel data:', e);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [loadLeagues, loadVerbs, assignmentId, mode]);

  // If assignment mode, use GameAssignmentWrapper
  if (assignmentId && mode === 'assignment') {
    // Show loading state until game data is loaded
    if (!dataLoaded) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-700 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-yellow-200 text-lg">Loading Conjugation Duel data...</p>
            <p className="text-yellow-300 text-sm mt-2">Preparing leagues and verbs...</p>
          </div>
        </div>
      );
    }

    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="conjugation-duel"
        studentId={user?.id}
        onAssignmentComplete={(progress) => {
          console.log('Conjugation Duel assignment completed:', progress);
          router.push('/student-dashboard');
        }}
        onBackToAssignments={() => router.push('/student-dashboard')}
        onBackToMenu={() => router.push('/games/conjugation-duel')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Filter vocabulary to only include verbs
          const verbs = vocabulary.filter(word =>
            word.part_of_speech === 'v' ||
            word.part_of_speech === 'verb' ||
            word.word.includes('(to)')
          );

          const handleGameComplete = (gameResult: any) => {
            // Calculate standardized progress metrics
            const wordsCompleted = gameResult.verbsCompleted || gameResult.correctAnswers || 0;
            const totalWords = verbs.length;
            const score = gameResult.score || 0;
            const accuracy = gameResult.accuracy || 0;

            // Update progress
            onProgressUpdate({
              wordsCompleted,
              totalWords,
              score,
              maxScore: totalWords * 100, // 100 points per verb
              accuracy
            });

            // Complete assignment
            onGameComplete({
              assignmentId: assignment.id,
              gameId: 'conjugation-duel',
              studentId: user?.id || '',
              wordsCompleted,
              totalWords,
              score,
              maxScore: totalWords * 100,
              accuracy,
              timeSpent: gameResult.timeSpent || 0,
              completedAt: new Date(),
              sessionData: gameResult
            });
          };

          const handleBackToAssignments = () => {
            router.push('/student-dashboard');
          };

          // Convert assignment language to game format
          const gameLanguage = assignment.vocabulary_criteria?.language === 'spanish' ? 'spanish' :
                               assignment.vocabulary_criteria?.language === 'french' ? 'french' :
                               assignment.vocabulary_criteria?.language === 'german' ? 'german' : 'spanish';

          console.log('🎯 [CONJUGATION DUEL] Assignment grammar config:', {
            fullGameConfig: assignment.game_config,
            grammarConfig: assignment.game_config?.gameConfig?.grammarConfig,
            gameLanguage,
            vocabularyCount: vocabulary.length
          });

          return (
            <div className="min-h-screen">
              <ConjugationDuelGameWrapper
                language={gameLanguage}
                league="bronze_arena" // Use bronze arena for assignments
                opponent={{ name: "Assignment Challenge", difficulty: "medium" }}
                onBackToMenu={handleBackToAssignments}
                onGameEnd={handleGameComplete}
                assignmentId={assignment.id}
                userId={user?.id}
                assignmentVocabulary={vocabulary}
                grammarConfig={assignment.game_config?.gameConfig?.grammarConfig}
              />
            </div>
          );
        }}
      </GameAssignmentWrapper>
    );
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
            selectedLanguage={selectedLanguage}
            onLeagueSelect={(league) => {
              setSelectedLeague(league);
              setGameState('opponent-select');
            }}
            onBackToLanguages={handleBackToMenu}
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
            leagueId={selectedLeague}
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
            assignmentId={assignmentId || undefined}
            userId={user?.id}
          />
        </div>
      );
    }
  }

  // Fallback
  return null;
}
