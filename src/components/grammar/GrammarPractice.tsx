'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Star,
  Gem,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Zap,
  Heart,
  ArrowRight,
  ArrowLeft,
  HeartCrack,
  Award,
  Clock
} from 'lucide-react';
import { GemButton, GemCard } from '../ui/GemTheme';

interface PracticeItem {
  id: string;
  type: 'conjugation' | 'fill_blank' | 'word_order' | 'translation' | 'multiple_choice';
  question: string;
  answer: string;
  options?: string[];
  hint?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface GrammarPracticeProps {
  language: string;
  category?: string;
  difficulty?: string;
  practiceItems: PracticeItem[];
  onComplete: (score: number, gemsEarned: number, timeSpent: number) => void;
  onExit: () => void;
  gamified?: boolean;
  topicTitle?: string;
  questionCount?: number;
  // NEW: Test mode props
  isTestMode?: boolean;
  showHints?: boolean;
  trackProgress?: boolean;
}

export default function GrammarPractice({
  language,
  category,
  difficulty,
  practiceItems,
  onComplete,
  onExit,
  gamified = true,
  topicTitle = "Grammar Practice",
  questionCount,
  // NEW: Test mode props with defaults
  isTestMode = false,
  showHints = true,
  trackProgress = false
}: GrammarPracticeProps) {
  const [currentItem, setCurrentItem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(isTestMode ? 3 : 999); // Unlimited lives in practice mode
  const [gemsEarned, setGemsEarned] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeBonus, setTimeBonus] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Check if we have valid practice items
  const hasValidItems = practiceItems && practiceItems.length > 0;

  // Keyboard navigation for multiple choice - always call hooks
  useEffect(() => {
    if (!showCompletion && hasValidItems && practiceItems[currentItem]?.options && !showFeedback) {
      const handleKeyPress = (e: KeyboardEvent) => {
        const currentQuestion = practiceItems[currentItem];
        if (e.key === '1' && currentQuestion.options && currentQuestion.options.length > 0) {
          setUserAnswer(currentQuestion.options[0]);
        } else if (e.key === '2' && currentQuestion.options && currentQuestion.options.length > 1) {
          setUserAnswer(currentQuestion.options[1]);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [currentItem, showCompletion, hasValidItems, showFeedback, practiceItems]);

  // Auto-focus input for fill-in-the-blank questions - always call hooks
  useEffect(() => {
    if (!showCompletion && hasValidItems && practiceItems[currentItem] && !practiceItems[currentItem].options) {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  }, [currentItem, showCompletion, hasValidItems, practiceItems]);

  // Add keyboard support for multiple choice
  useEffect(() => {
    if (!hasValidItems) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showFeedback) return;

      const currentPracticeItem = practiceItems[currentItem];
      if (currentPracticeItem?.options && currentPracticeItem.options.length > 0) {
        if (e.key === '1' && currentPracticeItem.options[0]) {
          setUserAnswer(currentPracticeItem.options[0]);
        } else if (e.key === '2' && currentPracticeItem.options[1]) {
          setUserAnswer(currentPracticeItem.options[1]);
        } else if (e.key === 'Enter' && userAnswer.trim()) {
          checkAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentItem, showFeedback, userAnswer, hasValidItems, practiceItems]);

  // Auto-focus management
  useEffect(() => {
    if (!hasValidItems) return;
    
    const currentPracticeItem = practiceItems[currentItem];
    if (!showFeedback && currentPracticeItem && !currentPracticeItem.options) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentItem, showFeedback, hasValidItems, practiceItems]);

  // Early return after all hooks are called
  if (!hasValidItems) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <GemCard className="max-w-md w-full text-center">
          <div className="text-gray-500 mb-4">
            <Target className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg">No practice items available</p>
            <p className="text-sm">Please try again later or contact support if this persists.</p>
          </div>
          <GemButton variant="gem" gemType="common" onClick={onExit}>
            Return to Menu
          </GemButton>
        </GemCard>
      </div>
    );
  }

  const currentPracticeItem = practiceItems[currentItem];
  const progress = ((currentItem + 1) / practiceItems.length) * 100;
  const isLastItem = currentItem === practiceItems.length - 1;



  // Completion Screen
  if (showCompletion) {
    const totalTimeSpent = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round((correctAnswers / practiceItems.length) * 100);
    const minutes = Math.floor(totalTimeSpent / 60);
    const seconds = totalTimeSpent % 60;
    const testFailed = isTestMode && lives <= 0;

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        testFailed
          ? 'bg-gradient-to-br from-red-600 to-orange-600'
          : 'bg-gradient-to-br from-purple-600 to-blue-600'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <GemCard className={`text-center p-12 shadow-2xl ${
            testFailed
              ? 'border-4 border-red-300 bg-white'
              : 'border-4 border-yellow-300 bg-white'
          }`}>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              {testFailed ? (
                <>
                  <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Test Failed
                  </h1>
                  <p className="text-xl text-gray-600">
                    You ran out of lives! Don't worry, try again to master {topicTitle}.
                  </p>
                </>
              ) : (
                <>
                  <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {isTestMode ? 'Test Complete!' : 'Practice Complete!'}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {isTestMode
                      ? `Excellent work on your ${topicTitle} test!`
                      : `Great practice session with ${topicTitle}!`
                    }
                  </p>
                </>
              )}
            </motion.div>

            {/* Stats */}
            {!testFailed && (
              <div className={`grid gap-6 mb-8 ${isTestMode ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
                {/* Only show Gems in test mode */}
                {isTestMode && (
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <Gem className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{gemsEarned}</p>
                    <p className="text-sm text-gray-600">Gems</p>
                  </div>
                )}
                <div className="bg-orange-50 p-4 rounded-xl">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </p>
                  <p className="text-sm text-gray-600">Time</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {testFailed ? (
                <>
                  <GemButton
                    variant="gem"
                    gemType="legendary"
                    onClick={() => {
                      // Reset for another attempt
                      setShowCompletion(false);
                      setCurrentItem(0);
                      setUserAnswer('');
                      setShowFeedback(false);
                      setScore(0);
                      setCorrectAnswers(0);
                      setStreak(0);
                      setLives(3);
                      setGemsEarned(0);
                      setCompletedItems(new Set());
                    }}
                    className="px-8 py-3 text-lg"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Try Again
                  </GemButton>
                  <GemButton
                    variant="secondary"
                    onClick={onExit}
                    className="px-8 py-3 text-lg"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go Back
                  </GemButton>
                </>
              ) : (
                <>
                  <GemButton
                    variant="gem"
                    gemType="legendary"
                    onClick={() => {
                      const totalTimeSpent = Math.round((Date.now() - startTime) / 1000);
                      onComplete(score, gemsEarned, totalTimeSpent);
                    }}
                    className="px-8 py-3 text-lg"
                  >
                    <Award className="w-5 h-5 mr-2" />
                    Continue
                  </GemButton>
                  <GemButton
                    variant="secondary"
                    onClick={() => {
                      // Reset for another round
                      setShowCompletion(false);
                      setCurrentItem(0);
                      setUserAnswer('');
                      setShowFeedback(false);
                      setScore(0);
                      setCorrectAnswers(0);
                      setStreak(0);
                      setLives(3);
                      setGemsEarned(0);
                      setCompletedItems(new Set());
                    }}
                    className="px-8 py-3 text-lg"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Practice Again
                  </GemButton>
                </>
              )}
            </div>
          </GemCard>
        </motion.div>
      </div>
    );
  }

  // Check if we have valid practice items before rendering
  if (!hasValidItems || !practiceItems[currentItem]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Practice Items Available</h2>
          <p className="text-gray-600 mb-8">Unable to load practice content. Please try again.</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Function to provide clear instructions based on question content
  const getInstructionText = (item: any) => {
    if (!item || !item.question) {
      return "Complete the exercise:";
    }

    const question = item.question.toLowerCase();

    // Check if it's a multiple choice question
    if (item.options && item.options.length > 0) {
      if (question.includes('_____') && question.indexOf('_____') === 0) {
        return "Choose the correct article:";
      } else {
        return "Choose the correct option:";
      }
    }

    // Fill in the blank questions
    if (question.includes('→ _____')) {
      return "Make this word plural:";
    } else if (question.includes('_____ _____')) {
      return "Complete with article and plural form:";
    } else if (question.includes('_____') && question.indexOf('_____') === 0) {
      return "Add the correct article:";
    } else if (question.includes('_____')) {
      return "Fill in the blank:";
    } else if (item.type === 'conjugation') {
      return "Conjugate the verb:";
    } else if (item.type === 'translation') {
      return "Translate to Spanish:";
    } else {
      return "Complete the exercise:";
    }
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;

    // Handle multiple correct answers (e.g., "un/una")
    const correctAnswers = currentPracticeItem.answer.toLowerCase().split('/').map(a => a.trim());
    const userAnswerLower = userAnswer.toLowerCase().trim();
    const correct = correctAnswers.includes(userAnswerLower);

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const basePoints = getDifficultyPoints(currentPracticeItem.difficulty);
      const streakBonus = Math.min(streak * 5, 50);
      const speedBonus = calculateSpeedBonus();
      const totalPoints = basePoints + streakBonus + speedBonus;

      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      setTimeBonus(speedBonus);

      // Award gems based on performance (only in test mode)
      if (isTestMode) {
        const gemsAwarded = calculateGemsAwarded(correct, streak, speedBonus);
        setGemsEarned(prev => prev + gemsAwarded);
      }

      setCompletedItems(prev => new Set([...prev, currentItem]));
    } else {
      setStreak(0);
      setTimeBonus(0);
      // Only lose lives in test mode (practice mode has unlimited attempts)
      if (gamified && isTestMode) {
        setLives(prev => Math.max(0, prev - 1));
      }
    }

    // Auto-advance after 2 seconds for both correct and incorrect answers
    const timer = setTimeout(() => {
      nextItem();
    }, 2000);
    setAutoAdvanceTimer(timer);
  };

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 10;
      case 'intermediate': return 15;
      case 'advanced': return 25;
      default: return 10;
    }
  };

  const calculateSpeedBonus = () => {
    // Award bonus points for quick answers (within 10 seconds)
    const timeSpent = (Date.now() - startTime) / 1000;
    if (timeSpent < 5) return 10;
    if (timeSpent < 10) return 5;
    return 0;
  };

  const calculateGemsAwarded = (correct: boolean, currentStreak: number, speedBonus: number) => {
    if (!correct) return 0;
    
    let gems = 1; // Base gem
    
    // Streak bonus
    if (currentStreak >= 5) gems += 2;
    else if (currentStreak >= 3) gems += 1;
    
    // Speed bonus
    if (speedBonus > 0) gems += 1;
    
    // Difficulty bonus
    if (currentPracticeItem.difficulty === 'advanced') gems += 1;
    
    return gems;
  };

  const nextItem = () => {
    // Clear any existing auto-advance timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    if (gamified && lives <= 0) {
      // Test failed - show failure screen
      setShowCompletion(true);
    } else if (isLastItem) {
      // Test passed - show completion screen
      setShowCompletion(true);
    } else {
      setCurrentItem(prev => {
        const nextIndex = prev + 1;
        // Safety check to ensure we don't go out of bounds
        return nextIndex < practiceItems.length ? nextIndex : prev;
      });
      setUserAnswer('');
      setShowFeedback(false);

      // Auto-focus the input for the next question
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const renderPracticeItem = () => {
    switch (currentPracticeItem.type) {
      case 'conjugation':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-blue-900 mb-2">Conjugate the verb:</p>
              <p className="text-xl text-blue-800">{currentPracticeItem.question}</p>
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type the conjugated form..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            />
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-lg text-green-900 leading-relaxed">
                {currentPracticeItem.question.replace('_____', '______')}
              </p>
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Fill in the blank..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            />
          </div>
        );

      case 'word_order':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-yellow-900 mb-2">Arrange the words in correct order:</p>
              <p className="text-xl text-yellow-800">{currentPracticeItem.question}</p>
            </div>
            {currentPracticeItem.options && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {currentPracticeItem.options.map((word, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserAnswer(prev => prev ? `${prev} ${word}` : word)}
                    className="p-3 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-400 transition-colors"
                  >
                    {word}
                  </motion.button>
                ))}
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg min-h-[60px] border-2 border-dashed border-gray-300">
              <p className="text-lg text-gray-700">{userAnswer || 'Click words to build your sentence...'}</p>
            </div>
            <GemButton
              variant="secondary"
              size="sm"
              onClick={() => setUserAnswer('')}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </GemButton>
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-purple-900 mb-2">Translate to {language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'German'}:</p>
              <p className="text-xl text-purple-800">{currentPracticeItem.question}</p>
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your translation..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            />
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-pink-900 mb-2">Complete the exercise:</p>
              <p className="text-xl text-pink-800">{currentPracticeItem.question}</p>
            </div>
            {currentPracticeItem.options && (
              <div className="grid grid-cols-2 gap-3">
                {currentPracticeItem.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserAnswer(option)}
                    className={`p-4 text-lg border-2 rounded-lg transition-all ${
                      userAnswer === option
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-500">{index + 1}</span>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Fixed Header */}
      <div className={`border-b shadow-lg ${isTestMode
        ? 'bg-gradient-to-r from-red-600 to-purple-700 border-red-400'
        : 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-300'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Back + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors shadow-sm flex items-center"
              >
                <ArrowLeft className="w-5 h-5 text-white mr-2" />
                <Gem className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{topicTitle}</h1>
                <p className="text-sm text-purple-100">
                  {category} • Item {currentItem + 1} of {practiceItems.length}
                </p>
              </div>
            </div>

            {/* Right: Enhanced Stats */}
            {gamified && (
              <div className="flex items-center space-x-3">
                {/* Stars/XP */}
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">{score}</span>
                </div>

                {/* Lightning/Energy */}
                <div className="flex items-center space-x-1 bg-orange-500/20 px-2 py-1 rounded-lg">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-semibold text-sm">{streak}</span>
                </div>

                {/* Gems - Only show in test mode */}
                {isTestMode && (
                  <div className="flex items-center space-x-1 bg-purple-500/20 px-2 py-1 rounded-lg">
                    <Gem className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-semibold text-sm">{gemsEarned}</span>
                  </div>
                )}

                {/* Hearts/Lives - Only show in test mode */}
                {isTestMode && (
                  <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded-lg">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Heart
                        key={i}
                        className={`w-4 h-4 ${i < lives ? 'text-red-400 fill-current' : 'text-gray-500'}`}
                      />
                    ))}
                  </div>
                )}



                {/* Streak Breaker */}
                {streak === 0 && currentItem > 0 && (
                  <div className="flex items-center space-x-1 bg-gray-500/20 px-2 py-1 rounded-lg">
                    <HeartCrack className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-semibold text-sm">0</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GemCard className={`mb-6 shadow-2xl ${isTestMode
              ? 'border-4 border-red-200/50 bg-white'
              : 'border-4 border-purple-200/50'
            }`}>
              <div className="p-8">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {isTestMode ? `Test Question ${currentItem + 1}` : `Practice Item ${currentItem + 1}`}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentPracticeItem.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      currentPracticeItem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentPracticeItem.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                      Fill Blank
                    </span>
                  </div>
                </div>

                {/* Enhanced Question Display with Clear Instructions */}
                <div className="mb-8">
                  {/* Instruction */}
                  <div className="text-center mb-6">
                    <p className="text-xl font-bold text-gray-800 mb-2">
                      {getInstructionText(currentPracticeItem)}
                    </p>
                  </div>

                  {/* Question */}
                  <div className={`p-8 rounded-2xl border-2 mb-8 ${isTestMode
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                  }`}>
                    <p className="text-3xl font-bold text-gray-800 text-center leading-relaxed">
                      {currentPracticeItem.question}
                    </p>
                  </div>

                  {/* Multiple Choice Options or Text Input */}
                  {currentPracticeItem.options && currentPracticeItem.options.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {currentPracticeItem.options.map((option: string, index: number) => (
                          <GemButton
                            key={index}
                            variant={userAnswer === option ? "gem" : "secondary"}
                            gemType={userAnswer === option ? "rare" : undefined}
                            onClick={() => setUserAnswer(option)}
                            disabled={showFeedback}
                            className="p-6 text-2xl font-bold relative"
                          >
                            <span className="absolute top-2 left-2 text-sm opacity-60">
                              {index + 1}
                            </span>
                            {option}
                          </GemButton>
                        ))}
                      </div>
                      <p className="text-center text-sm text-gray-500 mb-6">
                        Press 1 or 2 to select, or click the buttons
                      </p>
                    </div>
                  ) : (
                    /* Auto-focused Text Input */
                    <div className="mb-6">
                      <input
                        ref={inputRef}
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-6 text-2xl border-3 border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-center font-medium shadow-lg"
                        onKeyDown={(e) => e.key === 'Enter' && !showFeedback && userAnswer.trim() && checkAnswer()}
                        disabled={showFeedback}
                        autoFocus
                      />
                    </div>
                  )}
                </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-lg border ${
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <p className="text-red-700 mb-2">
                      Correct answer: {currentPracticeItem.answer}
                    </p>
                  )}
                  
                  {isCorrect && gamified && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-700">+{getDifficultyPoints(currentPracticeItem.difficulty)} points</span>
                      {streak > 1 && <span className="text-orange-700">+{Math.min(streak * 5, 50)} streak bonus</span>}
                      {timeBonus > 0 && <span className="text-blue-700">+{timeBonus} speed bonus</span>}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

                {/* Enhanced Navigation */}
                <div className="flex justify-center mt-8">
                  {showFeedback ? (
                    <GemButton
                      variant="gem"
                      gemType={isCorrect ? "legendary" : "rare"}
                      onClick={nextItem}
                      className="px-12 py-4 text-xl font-bold"
                    >
                      {isLastItem ? 'Finish Practice' : 'Next Question'}
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </GemButton>
                  ) : (
                    <GemButton
                      variant="gem"
                      gemType="rare"
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="px-12 py-4 text-xl font-bold"
                    >
                      Check Answer
                      <CheckCircle className="w-6 h-6 ml-3" />
                    </GemButton>
                  )}
                </div>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
