"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

interface GemOption {
  id: string;
  text: string;
  isCorrect: boolean;
  lane: number; // 0, 1, or 2 (top, middle, bottom)
  position: number; // x position
}

interface Question {
  id: string;
  sentence: string;
  language: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

const questions: Question[] = [
  {
    id: '1',
    sentence: 'We recycle paper to be environmentally friendly',
    language: 'Spanish',
    options: [
      { text: 'Reciclamos', isCorrect: true },
      { text: 'Comemos', isCorrect: false },
      { text: 'Bailamos', isCorrect: false }
    ]
  },
  {
    id: '2',
    sentence: 'The cat is sleeping on the sofa',
    language: 'French',
    options: [
      { text: 'Le chat', isCorrect: true },
      { text: 'Le chien', isCorrect: false },
      { text: 'La voiture', isCorrect: false }
    ]
  },
  {
    id: '3',
    sentence: 'I like to eat pizza',
    language: 'Italian',
    options: [
      { text: 'Mi piace', isCorrect: true },
      { text: 'Non mi piace', isCorrect: false },
      { text: 'Forse', isCorrect: false }
    ]
  },
  {
    id: '4',
    sentence: 'The weather is beautiful today',
    language: 'German',
    options: [
      { text: 'Das Wetter', isCorrect: true },
      { text: 'Der Hund', isCorrect: false },
      { text: 'Die Katze', isCorrect: false }
    ]
  },
  {
    id: '5',
    sentence: 'My family lives in the city',
    language: 'Portuguese',
    options: [
      { text: 'Minha família', isCorrect: true },
      { text: 'Meu carro', isCorrect: false },
      { text: 'Minha escola', isCorrect: false }
    ]
  }
];

export default function GemCollectorGame() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); // 0=top, 1=middle, 2=bottom
  const [gems, setGems] = useState<GemOption[]>([]);
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; text: string }>({ type: null, text: '' });
  const [lives, setLives] = useState(3);
  const [backgroundPosition, setBackgroundPosition] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading game...</p>
        </div>
      </div>
    );
  }

  // Don't render the game if user is not authenticated
  if (!user) {
    return null;
  }

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setPlayerLane(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setPlayerLane(prev => Math.min(2, prev + 1));
        break;
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move background
      setBackgroundPosition(prev => prev - gameSpeed);

      // Move gems and check collisions
      setGems(prevGems => {
        const updatedGems = prevGems.map(gem => ({
          ...gem,
          position: gem.position - gameSpeed
        })).filter(gem => gem.position > -100);

        // Check for collisions
        const playerGem = updatedGems.find(gem => 
          gem.lane === playerLane && 
          gem.position >= 200 && 
          gem.position <= 300
        );

        if (playerGem) {
          // Remove the collected gem
          const filteredGems = updatedGems.filter(g => g.id !== playerGem.id);
          
          if (playerGem.isCorrect) {
            setScore(prev => prev + 100);
            setFeedback({ type: 'correct', text: 'Correct! +100 points' });
            
            // Move to next question
            setTimeout(() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setGameSpeed(prev => prev + 0.2);
              } else {
                setGameOver(true);
              }
              setFeedback({ type: null, text: '' });
            }, 1000);
          } else {
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameOver(true);
              }
              return newLives;
            });
            setFeedback({ type: 'wrong', text: 'Wrong! Try again' });
            setTimeout(() => setFeedback({ type: null, text: '' }), 1000);
          }
          
          return filteredGems;
        }

        return updatedGems;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, playerLane, gameSpeed, currentQuestion]);

  // Generate gems for current question
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const generateGems = () => {
      const question = questions[currentQuestion];
      const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
      
      const newGems = shuffledOptions.map((option, index) => ({
        id: `${currentQuestion}-${index}-${Date.now()}`,
        text: option.text,
        isCorrect: option.isCorrect,
        lane: index,
        position: 800 + (index * 200)
      }));

      setGems(prev => [...prev, ...newGems]);
    };

    generateGems();
    const gemGenerator = setInterval(generateGems, 3000);

    return () => clearInterval(gemGenerator);
  }, [currentQuestion, gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setCurrentQuestion(0);
    setPlayerLane(1);
    setGems([]);
    setGameSpeed(2);
    setFeedback({ type: null, text: '' });
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setCurrentQuestion(0);
    setPlayerLane(1);
    setGems([]);
    setGameSpeed(2);
    setFeedback({ type: null, text: '' });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">💎</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Gem Collector</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Move up and down with the arrow keys to collect the correct translation gems! 
            Avoid the wrong gems or you'll lose a life.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-slate-800 mb-2">How to Play:</h3>
            <ul className="text-sm text-slate-600 space-y-1 text-left">
              <li>• Use ↑ and ↓ arrow keys to move</li>
              <li>• Collect gems with correct translations</li>
              <li>• Avoid wrong translation gems</li>
              <li>• You have 3 lives to complete all levels</li>
            </ul>
          </div>
          
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
          >
            Start Collecting! 💎
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/games" className="text-white hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <div className="flex items-center gap-6 text-white">
            <div className="text-center">
              <div className="text-sm opacity-80">Score</div>
              <div className="text-xl font-bold">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Lives</div>
              <div className="text-xl font-bold flex items-center gap-1">
                {Array.from({ length: lives }).map((_, i) => (
                  <span key={i} className="text-red-400">❤️</span>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Level</div>
              <div className="text-xl font-bold">{currentQuestion + 1}/{questions.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Question */}
      <div className="absolute top-20 left-0 right-0 z-20 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mx-4 shadow-lg">
          <div className="text-sm text-blue-600 font-semibold mb-2">
            Translate to {questions[currentQuestion]?.language}
          </div>
          <div className="text-xl font-bold text-slate-800">
            {questions[currentQuestion]?.sentence}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-32">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 52px)',
            transform: `translateX(${backgroundPosition % 100}px)`
          }}
        />

        {/* Lane Dividers */}
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-96">
          <div className="h-full relative">
            {/* Top Lane */}
            <div className="absolute top-0 left-0 right-0 h-1/3 border-b-2 border-white/20" />
            {/* Middle Lane */}
            <div className="absolute top-1/3 left-0 right-0 h-1/3 border-b-2 border-white/20" />
            {/* Bottom Lane */}
            <div className="absolute top-2/3 left-0 right-0 h-1/3" />
          </div>
        </div>

        {/* Player Character */}
        <div 
          className="absolute left-12 transition-all duration-200 z-10"
          style={{
            top: `calc(50% - 160px + ${playerLane * 128}px)`,
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <span className="text-2xl">🏃</span>
          </div>
        </div>

        {/* Gems */}
        {gems.map((gem) => (
          <div
            key={gem.id}
            className="absolute transition-all duration-100 z-10"
            style={{
              left: `${gem.position}px`,
              top: `calc(50% - 160px + ${gem.lane * 128}px)`,
            }}
          >
            <div className={`
              w-20 h-16 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg transform hover:scale-110 transition-all
              ${gem.isCorrect 
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-green-500/30' 
                : 'bg-gradient-to-br from-red-400 to-pink-500 shadow-red-500/30'
              }
            `}>
              <div className="text-center">
                <div className="text-xl mb-1">
                  {gem.isCorrect ? '💎' : '💣'}
                </div>
                <div className="text-xs leading-tight">
                  {gem.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {feedback.type && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className={`
            px-6 py-4 rounded-2xl font-bold text-lg shadow-lg
            ${feedback.type === 'correct' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
            }
          `}>
            {feedback.text}
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🏆</span>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              {currentQuestion >= questions.length - 1 ? 'Congratulations!' : 'Game Over!'}
            </h2>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">Final Score</div>
              <div className="text-4xl font-bold text-slate-800">{score}</div>
              <div className="text-sm text-slate-600 mt-2">
                Completed {currentQuestion + 1} of {questions.length} levels
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
              >
                Play Again
              </button>
              <Link
                href="/games"
                className="flex-1 bg-slate-200 text-slate-700 font-semibold rounded-xl px-6 py-3 text-center hover:bg-slate-300 transition-colors"
              >
                Back to Games
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-sm">
          Use ↑ and ↓ arrow keys to move
        </div>
      </div>
    </div>
  );
} 