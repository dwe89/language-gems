'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Star, 
  Gem, 
  Clock, 
  CheckCircle, 
  XCircle,
  Shuffle,
  RotateCcw,
  Trophy,
  Zap,
  Heart,
  ArrowRight
} from 'lucide-react';
import { GemButton, GemCard } from '../ui/GemTheme';

interface PracticeItem {
  id: string;
  type: 'conjugation' | 'fill_blank' | 'word_order' | 'translation';
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
}

export default function GrammarPractice({ 
  language, 
  category, 
  difficulty, 
  practiceItems, 
  onComplete, 
  onExit,
  gamified = true 
}: GrammarPracticeProps) {
  const [currentItem, setCurrentItem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeBonus, setTimeBonus] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

  const currentPracticeItem = practiceItems[currentItem];
  const progress = ((currentItem + 1) / practiceItems.length) * 100;
  const isLastItem = currentItem === practiceItems.length - 1;

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;

    const correct = userAnswer.toLowerCase().trim() === currentPracticeItem.answer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const basePoints = getDifficultyPoints(currentPracticeItem.difficulty);
      const streakBonus = Math.min(streak * 5, 50);
      const speedBonus = calculateSpeedBonus();
      const totalPoints = basePoints + streakBonus + speedBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setTimeBonus(speedBonus);
      
      // Award gems based on performance
      const gemsAwarded = calculateGemsAwarded(correct, streak, speedBonus);
      setGemsEarned(prev => prev + gemsAwarded);
      
      setCompletedItems(prev => new Set([...prev, currentItem]));
    } else {
      setStreak(0);
      setTimeBonus(0);
      if (gamified) {
        setLives(prev => Math.max(0, prev - 1));
      }
    }
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
    if (isLastItem || (gamified && lives <= 0)) {
      const totalTimeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete(score, gemsEarned, totalTimeSpent);
    } else {
      setCurrentItem(prev => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const shuffleItems = () => {
    // Shuffle remaining items
    const remaining = practiceItems.slice(currentItem + 1);
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
    // This would need to be implemented properly with state management
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Grammar Practice</h1>
                <p className="text-sm text-gray-600">
                  {category && `${category} • `}Item {currentItem + 1} of {practiceItems.length}
                </p>
              </div>
            </div>

            {gamified && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-800 font-semibold">{score}</span>
                </div>
                <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-800 font-semibold">{streak}</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                  <Gem className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-800 font-semibold">{gemsEarned}</span>
                </div>
                <div className="flex items-center space-x-1 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <GemCard className="mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Practice Item {currentItem + 1}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentPracticeItem.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    currentPracticeItem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentPracticeItem.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium capitalize">
                    {currentPracticeItem.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            {renderPracticeItem()}
            
            {/* Hint */}
            {currentPracticeItem.hint && (
              <div className="mt-6">
                <GemButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                </GemButton>
                
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-blue-800">{currentPracticeItem.hint}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

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
          </GemCard>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <GemButton
                variant="secondary"
                size="sm"
                onClick={shuffleItems}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </GemButton>
            </div>
            
            {showFeedback ? (
              <GemButton
                variant="gem"
                gemType="rare"
                onClick={nextItem}
              >
                {isLastItem ? 'Finish Practice' : 'Next Item'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </GemButton>
            ) : (
              <GemButton
                variant="gem"
                gemType="uncommon"
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
              >
                Check Answer
              </GemButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
