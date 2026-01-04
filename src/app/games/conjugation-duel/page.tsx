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

          // Get grammar config from assignment (new location)
          const grammarConfig = assignment.game_config?.grammarConfig || assignment.game_config?.gameConfig?.grammarConfig;

          // Convert assignment language to game format
          // Priority: grammarConfig.language > vocabulary_criteria.language > default to spanish
          const gameLanguage = grammarConfig?.language ||
            (assignment.vocabulary_criteria?.language === 'spanish' ? 'spanish' :
              assignment.vocabulary_criteria?.language === 'french' ? 'french' :
                assignment.vocabulary_criteria?.language === 'german' ? 'german' : 'spanish');

          console.log('🎯 [CONJUGATION DUEL] Assignment grammar config:', {
            fullGameConfig: assignment.game_config,
            grammarConfig,
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
                grammarConfig={grammarConfig}
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
      <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center py-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-slate-900/60 to-slate-950 animate-pulse-slow"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] opacity-10"></div>
          {/* Floating particles or sparks could go here */}
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-700">
            <div className="inline-block mb-4 px-6 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm tracking-wider uppercase backdrop-blur-sm">
              Enter the Arena
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-t from-yellow-600 via-yellow-400 to-yellow-200 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-6 font-serif tracking-tight">
              CONJUGATION<br />DUEL
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Master the art of verb conjugation in intense linguistic combat.
              <span className="block mt-2 text-yellow-500/80">Choose your weapon (language) to begin.</span>
            </p>
          </div>

          {/* Language Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
            {[
              { code: 'es', name: 'Spanish', flag: '🇪🇸', color: 'from-amber-700 to-red-900', userCount: '12k+' },
              { code: 'fr', name: 'French', flag: '🇫🇷', color: 'from-blue-700 to-indigo-900', userCount: '10k+' },
              { code: 'de', name: 'German', flag: '🇩🇪', color: 'from-yellow-700 to-neutral-900', userCount: '8k+' }
            ].map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  const config: UnifiedSelectionConfig = {
                    language: language.code,
                    curriculumLevel: 'KS3',
                    categoryId: 'verbs',
                    subcategoryId: undefined
                  };
                  handleGameStart(config, []);
                }}
                className={`group relative overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${language.code === 'es' ? 'red' : language.code === 'fr' ? 'blue' : 'yellow'}-900/50`}
              >
                {/* Card Border Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${language.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {/* Card Content */}
                <div className="relative h-full bg-slate-900/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center border border-white/5 group-hover:border-white/20 transition-colors">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
                    {language.flag}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {language.name}
                  </h3>

                  {/* Hover Effect Light */}
                  <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] group-hover:animate-shine" />
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-10 h-10 rounded-full bg-yellow-900/50 flex items-center justify-center border border-yellow-500/30">
                🏆
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current League</p>
                <p className="text-yellow-400 font-bold">Bronze Arena</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block"></div>

            <button
              onClick={() => router.push('/games')}
              className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all font-medium text-sm border border-white/10 hover:border-white/20"
            >
              Return to Hub
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
