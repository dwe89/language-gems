'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress'; // Component doesn't exist
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface VideoVocabularyGameProps {
  videoId: string;
  vocabularyWords: Array<{
    id: string;
    word: string;
    translation: string;
    timestamp: number;
    context: string;
  }>;
  assignmentId?: string;
  onComplete?: (results: GameResults) => void;
}

interface GameResults {
  score: number;
  totalWords: number;
  correctAnswers: number;
  timeSpent: number;
  gemsEarned: number;
}

interface GameState {
  currentWordIndex: number;
  score: number;
  correctAnswers: number;
  showingWord: boolean;
  gamePhase: 'intro' | 'playing' | 'complete';
  selectedAnswer: string | null;
  showFeedback: boolean;
}

export default function VideoVocabularyGame({
  videoId,
  vocabularyWords,
  assignmentId,
  onComplete
}: VideoVocabularyGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentWordIndex: 0,
    score: 0,
    correctAnswers: 0,
    showingWord: false,
    gamePhase: 'intro',
    selectedAnswer: null,
    showFeedback: false
  });

  const [videoPlayer, setVideoPlayer] = useState<YT.Player | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());

  const { supabase } = useSupabase();
  const { user } = useAuth();

  const currentWord = vocabularyWords[gameState.currentWordIndex];
  const progress = ((gameState.currentWordIndex + 1) / vocabularyWords.length) * 100;

  // Initialize YouTube player
  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
      
      (window as any).onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (videoPlayer) {
        videoPlayer.destroy();
      }
    };
  }, []);

  const initializePlayer = () => {
    if (!playerRef.current) return;

    const player = new window.YT.Player(playerRef.current, {
      height: '315',
      width: '560',
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: (event: any) => {
          setVideoPlayer(event.target);
          event.target.mute();
          setIsMuted(true);
        },
        onStateChange: (event: any) => {
          setIsVideoPlaying(event.data === window.YT.PlayerState.PLAYING);
        }
      }
    });
  };

  const startGame = async () => {
    setGameState(prev => ({ ...prev, gamePhase: 'playing' }));
    startTime.current = Date.now();

    // Start with first word
    showNextWord();
  };

  const showNextWord = () => {
    if (!currentWord || !videoPlayer) return;

    // Seek to word timestamp and play
    videoPlayer.seekTo(Math.max(0, currentWord.timestamp - 2), true);
    videoPlayer.playVideo();

    setGameState(prev => ({
      ...prev,
      showingWord: true,
      selectedAnswer: null,
      showFeedback: false
    }));

    // Pause after 5 seconds to show question
    setTimeout(() => {
      videoPlayer.pauseVideo();
      setGameState(prev => ({ ...prev, showingWord: false }));
    }, 5000);
  };

  const handleAnswerSelect = (answer: string) => {
    if (gameState.showFeedback) return;

    const isCorrect = answer === currentWord.translation;
    const points = isCorrect ? 10 : 0;

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: prev.score + points,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
    }));

    // Award gems for correct answers
    if (isCorrect) {
      setGemsEarned(prev => prev + 5);
    }

    // Move to next word after feedback
    setTimeout(() => {
      if (gameState.currentWordIndex < vocabularyWords.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentWordIndex: prev.currentWordIndex + 1,
          showFeedback: false
        }));
        showNextWord();
      } else {
        completeGame();
      }
    }, 2000);
  };

  const completeGame = async () => {
    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    const accuracy = (gameState.correctAnswers / vocabularyWords.length) * 100;

    // Calculate gems based on performance
    const baseGems = Math.floor(gameState.score / 10);
    const bonusGems = accuracy >= 80 ? 5 : accuracy >= 60 ? 3 : 1;
    const totalGemsEarned = baseGems + bonusGems;

    const results: GameResults = {
      score: gameState.score,
      totalWords: vocabularyWords.length,
      correctAnswers: gameState.correctAnswers,
      timeSpent,
      gemsEarned: totalGemsEarned
    };

    setGameState(prev => ({ ...prev, gamePhase: 'complete' }));
    onComplete?.(results);
  };

  const toggleVideoPlayback = () => {
    if (!videoPlayer) return;
    
    if (isVideoPlaying) {
      videoPlayer.pauseVideo();
    } else {
      videoPlayer.playVideo();
    }
  };

  const toggleMute = () => {
    if (!videoPlayer) return;
    
    if (isMuted) {
      videoPlayer.unMute();
      setIsMuted(false);
    } else {
      videoPlayer.mute();
      setIsMuted(true);
    }
  };

  const generateAnswerOptions = (correctAnswer: string) => {
    // Get 3 random wrong answers from other vocabulary words
    const wrongAnswers = vocabularyWords
      .filter(word => word.translation !== correctAnswer)
      .map(word => word.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Combine and shuffle
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    return options;
  };

  if (gameState.gamePhase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Video Vocabulary Challenge</h2>
            <p className="text-gray-600">
              Watch video clips and identify the vocabulary words you hear!
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span>Words to learn:</span>
              <Badge variant="secondary">{vocabularyWords.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span>Points per word:</span>
              <Badge variant="secondary">10</Badge>
            </div>
          </div>
          
          <Button onClick={startGame} size="lg" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        </motion.div>
      </div>
    );
  }

  if (gameState.gamePhase === 'complete') {
    const accuracy = (gameState.correctAnswers / vocabularyWords.length) * 100;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="mb-6">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
            <p className="text-gray-600">Great job learning with video content!</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-bold">{gameState.score}/{vocabularyWords.length * 10}</span>
            </div>
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="font-bold">{accuracy.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Words Correct:</span>
              <span className="font-bold">{gameState.correctAnswers}/{vocabularyWords.length}</span>
            </div>
            <div className="flex justify-between text-yellow-600">
              <span>Gems Earned:</span>
              <span className="font-bold">+{Math.floor(gameState.score / 10) + (accuracy >= 80 ? 5 : accuracy >= 60 ? 3 : 1)}</span>
            </div>
          </div>
          
          <Button onClick={() => window.location.reload()} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Playing phase
  const answerOptions = currentWord ? generateAnswerOptions(currentWord.translation) : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Video Vocabulary Game</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {gameState.currentWordIndex + 1} / {vocabularyWords.length}
            </Badge>
            <Badge variant="secondary">
              Score: {gameState.score}
            </Badge>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Video Player */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <div ref={playerRef} className="w-full aspect-video bg-black rounded-lg" />
            
            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleVideoPlayback}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleMute}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Content */}
      <AnimatePresence mode="wait">
        {gameState.showingWord ? (
          <motion.div
            key="watching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold mb-4">Listen carefully...</h3>
            <p className="text-gray-600">Pay attention to the vocabulary word in the video</p>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">What does "{currentWord?.word}" mean?</h3>
                {currentWord?.context && (
                  <p className="text-gray-600 mb-6 italic">Context: "{currentWord.context}"</p>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  {answerOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        gameState.showFeedback
                          ? option === currentWord?.translation
                            ? 'default'
                            : gameState.selectedAnswer === option
                            ? 'destructive'
                            : 'outline'
                          : 'outline'
                      }
                      className="h-12 text-left justify-start"
                      onClick={() => handleAnswerSelect(option)}
                      disabled={gameState.showFeedback}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                
                {gameState.showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-lg ${
                      gameState.selectedAnswer === currentWord?.translation
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {gameState.selectedAnswer === currentWord?.translation
                      ? '✅ Correct! Well done!'
                      : `❌ Incorrect. The correct answer is "${currentWord?.translation}"`
                    }
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
