import React from 'react';
import { Trophy, Star, Target, Clock, Zap, BookOpen, TrendingUp, Award, Home, RotateCcw, ArrowLeft } from 'lucide-react';
import { GameResult } from '../types';

interface GameCompletionScreenProps {
  result: GameResult;
  isAdventureMode?: boolean;
  isAssignmentMode?: boolean;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameCompletionScreen: React.FC<GameCompletionScreenProps> = ({
  result,
  isAdventureMode = false,
  isAssignmentMode = false,
  onPlayAgain,
  onBackToMenu
}) => {
  // Calculate performance metrics
  const accuracyPercentage = Math.round(result.accuracy || 0);
  const timeSpentMinutes = Math.floor((result.timeSpent || 0) / 60);
  const timeSpentSeconds = (result.timeSpent || 0) % 60;
  const averageTimePerWord = (result.totalWords || 0) > 0 ? Math.round((result.timeSpent || 0) / (result.totalWords || 1)) : 0;

  // Determine performance level
  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: Trophy };
    if (accuracy >= 80) return { level: 'Great', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: Star };
    if (accuracy >= 70) return { level: 'Good', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: Target };
    if (accuracy >= 60) return { level: 'Fair', color: 'text-orange-400', bgColor: 'bg-orange-500/20', icon: TrendingUp };
    return { level: 'Keep Practicing', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: BookOpen };
  };

  const performance = getPerformanceLevel(accuracyPercentage);
  const PerformanceIcon = performance.icon;

  // Calculate grade based on accuracy
  const getGrade = (accuracy: number) => {
    if (accuracy >= 97) return 'A+';
    if (accuracy >= 93) return 'A';
    if (accuracy >= 90) return 'A-';
    if (accuracy >= 87) return 'B+';
    if (accuracy >= 83) return 'B';
    if (accuracy >= 80) return 'B-';
    if (accuracy >= 77) return 'C+';
    if (accuracy >= 73) return 'C';
    if (accuracy >= 70) return 'C-';
    if (accuracy >= 67) return 'D+';
    if (accuracy >= 60) return 'D';
    return 'F';
  };

  const grade = getGrade(accuracyPercentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Results Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${performance.bgColor} mb-4`}>
              <PerformanceIcon className={`h-10 w-10 ${performance.color}`} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Game Complete!</h1>
            <p className={`text-xl font-semibold ${performance.color}`}>{performance.level}</p>
          </div>

          {/* Grade Display */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 text-center shadow-xl">
              <div className="text-white text-sm font-medium mb-1">Your Grade</div>
              <div className="text-white text-6xl font-bold drop-shadow-lg">{grade}</div>
              <div className="text-yellow-100 text-sm font-medium">{accuracyPercentage}% Accuracy</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Score */}
            <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-white/80 text-sm font-medium mb-1">Final Score</div>
              <div className="text-white text-2xl font-bold">{(result.score || 0).toLocaleString()}</div>
              {isAdventureMode && (result.gemsCollected || 0) > 0 && (
                <div className="text-cyan-300 text-xs mt-1">{result.gemsCollected || 0} gems collected</div>
              )}
            </div>

            {/* Accuracy */}
            <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-white/80 text-sm font-medium mb-1">Accuracy</div>
              <div className="text-white text-2xl font-bold">{accuracyPercentage}%</div>
              <div className="text-green-300 text-xs mt-1">
                {result.correctAnswers || 0} of {result.totalWords || 0} correct
              </div>
            </div>

            {/* Time */}
            <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-white/80 text-sm font-medium mb-1">Time Spent</div>
              <div className="text-white text-2xl font-bold">
                {timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, '0')}
              </div>
              <div className="text-blue-300 text-xs mt-1">{averageTimePerWord}s per word</div>
            </div>

            {/* Streak */}
            <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-white/80 text-sm font-medium mb-1">Best Streak</div>
              <div className="text-white text-2xl font-bold">{result.maxStreak || 0}</div>
              <div className="text-purple-300 text-xs mt-1">consecutive correct</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Summary */}
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-400" />
                Performance Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Words Attempted</span>
                  <span className="text-white font-semibold">{result.totalWords || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-300">Correct Answers</span>
                  <span className="text-green-300 font-semibold">{result.correctAnswers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-300">Incorrect Answers</span>
                  <span className="text-red-300 font-semibold">{result.incorrectAnswers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Average Time per Word</span>
                  <span className="text-white font-semibold">{averageTimePerWord}s</span>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-cyan-400" />
                Learning Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Words Learned</span>
                  <span className="text-cyan-300 font-semibold">{result.wordsLearned?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Need More Practice</span>
                  <span className="text-orange-300 font-semibold">{result.wordsStruggling?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Mastery Level</span>
                  <span className="text-white font-semibold">
                    {(result.wordsLearned?.length || 0) > 0 
                      ? Math.round(((result.wordsLearned?.length || 0) / (result.totalWords || 1)) * 100) + '%'
                      : '0%'
                    }
                  </span>
                </div>
                {isAdventureMode && (result.gemsCollected || 0) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Gems Collected</span>
                    <span className="text-purple-300 font-semibold">{result.gemsCollected || 0}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Encouraging Message */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-white font-bold text-lg mb-2">
                {accuracyPercentage >= 90 ? "Outstanding work! 🌟" :
                 accuracyPercentage >= 80 ? "Great job! Keep it up! 🚀" :
                 accuracyPercentage >= 70 ? "Good progress! Practice makes perfect! 💪" :
                 "Every step counts! Keep practicing! 📚"}
              </h3>
              <p className="text-white/80 text-sm">
                {accuracyPercentage >= 90 
                  ? "You've mastered this vocabulary set. Ready for the next challenge?"
                  : accuracyPercentage >= 70 
                  ? "You're making solid progress. A few more rounds and you'll have this mastered!"
                  : "Don't worry - language learning takes time. Each practice session helps you improve!"
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onPlayAgain}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <RotateCcw className="h-5 w-5" />
              Play Again
            </button>
            <button
              onClick={onBackToMenu}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              {isAssignmentMode ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  Go back to assignment
                </>
              ) : (
                <>
                  <Home className="h-5 w-5" />
                  Back to Menu
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
