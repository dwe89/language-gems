'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useGameProgress } from '../../../../hooks/useGameProgress';
import { GameProgress, GameSummary } from '../../../../services/gameProgressService';
import { 
  ArrowLeft, Loader2, Trophy, Check, Timer, XCircle, 
  BarChart, RotateCcw, Save, Clock, Play
} from 'lucide-react';

// Component for game leaderboard entry
const LeaderboardEntry = ({ entry, rank }: { entry: GameSummary; rank: number }) => {
  return (
    <div className="flex items-center py-2 border-b border-indigo-100">
      <div className="w-8 text-center font-bold text-gray-500">{rank}</div>
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mx-3">
        <span className="font-bold text-indigo-800">{entry.gameName[0]}</span>
      </div>
      <div className="flex-grow font-medium">{entry.gameName}</div>
      <div className="text-indigo-600 font-bold">{entry.score}</div>
    </div>
  );
};

// Simple game component
const SimpleGame = ({ 
  gameId, 
  onSaveProgress
}: { 
  gameId: string; 
  onSaveProgress: (progress: GameProgress) => void;
}) => {
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Store the onSaveProgress callback in a ref to prevent unnecessary rerenders
  const onSaveProgressRef = React.useRef(onSaveProgress);
  
  // Update the ref when the callback changes
  React.useEffect(() => {
    onSaveProgressRef.current = onSaveProgress;
  }, [onSaveProgress]);
  
  // Start the game
  const startGame = () => {
    setScore(0);
    setGameTime(0);
    setGameActive(true);
    setGameComplete(false);
  };
  
  // End the game - using useCallback to avoid dependency loops
  const endGame = useCallback(() => {
    setGameActive(false);
    setGameComplete(true);
    
    // Save progress using the ref to the latest callback
    onSaveProgressRef.current({
      gameId,
      score,
      completionTime: gameTime,
      accuracy: Math.min(100, score * 10), // Simulate accuracy
      metadata: {
        clicks: score,
        timeSpent: gameTime
      }
    });
  }, [gameId, score, gameTime]);
  
  // Handle user action (clicking the button)
  const handleAction = () => {
    if (!gameActive) return;
    setScore(prev => prev + 1);
  };
  
  // Start the game timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (gameActive && !gameComplete) {
      timerId = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameActive, gameComplete]);
  
  // Handle game end when time is up
  useEffect(() => {
    if (gameActive && gameTime >= 10 && !gameComplete) {
      endGame();
    }
  }, [gameActive, gameTime, gameComplete, endGame]);
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Word Clicker</h2>
        <p className="text-gray-600">Click the button as many times as you can in 10 seconds!</p>
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="text-center p-3 bg-indigo-100 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Score</div>
          <div className="text-2xl font-bold text-indigo-700">{score}</div>
        </div>
        
        <div className="text-center p-3 bg-indigo-100 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Time</div>
          <div className="text-2xl font-bold text-indigo-700">
            {gameActive ? (10 - Math.min(10, Math.floor(gameTime))) : 10}s
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        {!gameActive && !gameComplete && (
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-bold transition-colors flex items-center"
          >
            <Play className="mr-2 h-5 w-5" /> Start Game
          </button>
        )}
        
        {gameActive && (
          <button
            onClick={handleAction}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-8 rounded-lg text-xl font-bold transition-transform active:scale-95 w-full"
          >
            Click Me!
          </button>
        )}
        
        {gameComplete && (
          <button
            onClick={startGame}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-bold transition-colors flex items-center"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Play Again
          </button>
        )}
      </div>
      
      {gameComplete && (
        <div className="text-center p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-800 mb-2">Game Over!</h3>
          <p className="text-gray-700 mb-1">Your score: <span className="font-bold">{score}</span></p>
          <p className="text-gray-700">Time: <span className="font-bold">{gameTime} seconds</span></p>
        </div>
      )}
    </div>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    <span className="ml-2 text-indigo-600">Loading game...</span>
  </div>
);

export default function GameDetailPage() {
  const params = useParams<{ gameId: string }>();
  const gameId = params?.gameId || '';
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const { saveProgress, getGameProgress, loading: progressLoading } = useGameProgress();
  
  const [game, setGame] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [historyFetched, setHistoryFetched] = useState(false);

  // Fetch game data
  useEffect(() => {
    if (!gameId) return;
    
    const fetchGameData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch game from database
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();
          
        if (error) {
          throw new Error(`Error fetching game: ${error.message}`);
        }
        
        if (data) {
          setGame(data);
        } else {
          // If no game found, create a sample game
          setGame({
            id: gameId,
            name: 'Word Clicker',
            description: 'Click the button as many times as you can in 10 seconds!',
            difficulty: 1,
            max_players: 1,
            thumbnail_url: '/placeholder.svg',
            estimated_time: '30 sec'
          });
        }
      } catch (error) {
        console.error('Error fetching game:', error);
        setError(error instanceof Error ? error.message : 'Failed to load game');
        
        // Set fallback game data
        setGame({
          id: gameId,
          name: 'Word Clicker',
          description: 'Click the button as many times as you can in 10 seconds!',
          difficulty: 1,
          max_players: 1,
          thumbnail_url: '/placeholder.svg',
          estimated_time: '30 sec'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGameData();
  }, [gameId, supabase]);

  // Fetch game history separately to avoid repeated API calls
  useEffect(() => {
    if (!gameId || !user || historyFetched) return;
    
    const fetchGameHistory = async () => {
      try {
        const history = await getGameProgress(gameId);
        setGameHistory(history);
        setHistoryFetched(true);
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };
    
    fetchGameHistory();
  }, [gameId, user, historyFetched]);

  // Handle saving game progress
  const handleSaveProgress = useCallback(async (progress: GameProgress) => {
    if (!user) {
      setError('You must be logged in to save progress');
      return;
    }
    
    setSaveStatus('saving');
    
    try {
      const result = await saveProgress(progress);
      
      if (result.success) {
        setSaveStatus('success');
        
        // Refresh game history
        if (gameId) {
          const history = await getGameProgress(gameId);
          setGameHistory(history);
        }
      } else {
        setSaveStatus('error');
        setError(result.error || 'Failed to save progress');
      }
    } catch (error) {
      setSaveStatus('error');
      setError(error instanceof Error ? error.message : 'Failed to save progress');
    }
  }, [user, saveProgress, getGameProgress, gameId]);

  if (loading || progressLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => router.back()} 
          className="text-indigo-100 hover:text-white flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Games
        </button>
      </div>
      
      <h1 className="text-3xl font-bold text-white">{game?.name || 'Game'}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          {saveStatus === 'error' && (
            <button 
              onClick={() => setSaveStatus('idle')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
      
      {saveStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Progress saved successfully!</span>
          <button 
            onClick={() => setSaveStatus('idle')}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleGame gameId={gameId} onSaveProgress={handleSaveProgress} />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            Your History
          </h2>
          
          {gameHistory.length > 0 ? (
            <div className="space-y-2">
              {gameHistory.map((entry, index) => (
                <div key={entry.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium">{entry.score} points</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(entry.playedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    {index === 0 ? 'Latest' : `Play #${gameHistory.length - index}`}
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <h3 className="font-bold text-gray-700">Statistics</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-indigo-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Best Score</div>
                    <div className="font-bold text-indigo-800">
                      {Math.max(...gameHistory.map(h => h.score))}
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Games Played</div>
                    <div className="font-bold text-indigo-800">{gameHistory.length}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No history available yet.
              <div className="mt-2 text-sm">Play your first game to see your stats!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 