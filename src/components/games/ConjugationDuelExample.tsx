/**
 * Example Conjugation Duel Component
 * 
 * Demonstrates the complete conjugation game system with verb selection,
 * challenge generation, answer validation, and gem/FSRS tracking.
 */

import React, { useState, useEffect } from 'react';
import { useConjugationDuel } from '@/hooks/useConjugationDuel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gem, Star, Clock, Zap, Target, Trophy } from 'lucide-react';

interface ConjugationDuelExampleProps {
  sessionId: string;
  language: 'es' | 'fr' | 'de';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
}

export function ConjugationDuelExample({ 
  sessionId, 
  language, 
  difficulty = 'mixed' 
}: ConjugationDuelExampleProps) {
  const conjugationDuel = useConjugationDuel({
    sessionId,
    language,
    difficulty,
    tenses: ['present', 'preterite'],
    challengeCount: 10,
    timeLimit: 15 // 15 seconds per challenge
  });

  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (conjugationDuel.currentChallenge && !showResult) {
      setStartTime(Date.now());
      setUserAnswer('');
    }
  }, [conjugationDuel.currentChallenge, showResult]);

  const handleStartDuel = async () => {
    await conjugationDuel.startDuel();
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !conjugationDuel.currentChallenge) return;

    const responseTime = Date.now() - startTime;
    const result = await conjugationDuel.submitAnswer(userAnswer, responseTime, false);
    
    setLastResult(result);
    setShowResult(true);
  };

  const handleNextChallenge = () => {
    setShowResult(false);
    setLastResult(null);
    conjugationDuel.nextChallenge();
  };

  const handleSkip = async () => {
    await conjugationDuel.skipChallenge();
    setShowResult(false);
    setLastResult(null);
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'es': return 'Spanish';
      case 'fr': return 'French';
      case 'de': return 'German';
      default: return lang;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Pre-game setup
  if (!conjugationDuel.hasStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Conjugation Duel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚔️</div>
              <h2 className="text-2xl font-bold">Ready for the Challenge?</h2>
              <p className="text-gray-600">
                Test your {getLanguageName(language)} verb conjugation skills!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">10</div>
                <div className="text-sm text-blue-800">Challenges</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">15s</div>
                <div className="text-sm text-orange-800">Per Challenge</div>
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
              </Badge>
              <div className="text-sm text-gray-600">
                Includes: Present tense, Preterite tense
              </div>
            </div>

            <Button 
              onClick={handleStartDuel} 
              disabled={conjugationDuel.isLoading}
              className="w-full"
              size="lg"
            >
              {conjugationDuel.isLoading ? 'Preparing Challenges...' : 'Start Duel'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game complete
  if (conjugationDuel.isComplete) {
    const stats = conjugationDuel.getPerformanceStats();
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Duel Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎉</div>
              <h2 className="text-2xl font-bold">Well Done!</h2>
              <p className="text-gray-600">
                You completed the {getLanguageName(language)} conjugation duel!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.correctAnswers}/{stats.totalChallenges}
                </div>
                <div className="text-sm text-green-800">Correct</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(stats.accuracy)}%
                </div>
                <div className="text-sm text-blue-800">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                  <Gem className="w-5 h-5" />
                  {stats.totalGems}
                </div>
                <div className="text-sm text-purple-800">Gems Earned</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                  <Star className="w-5 h-5" />
                  {stats.totalXP}
                </div>
                <div className="text-sm text-yellow-800">XP Earned</div>
              </div>
            </div>

            {stats.maxStreak > 1 && (
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5" />
                  {stats.maxStreak}
                </div>
                <div className="text-sm text-orange-800">Best Streak</div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={conjugationDuel.resetDuel} className="flex-1">
                Play Again
              </Button>
              <Button variant="outline" className="flex-1">
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active game
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Game Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Conjugation Duel</span>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Gem className="w-4 h-4" />
                {conjugationDuel.totalGems}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {conjugationDuel.totalXP} XP
              </Badge>
              {conjugationDuel.streakCount > 1 && (
                <Badge variant="outline" className="flex items-center gap-1 bg-orange-50 text-orange-700">
                  <Zap className="w-4 h-4" />
                  {conjugationDuel.streakCount}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{conjugationDuel.currentChallengeIndex + 1} / {conjugationDuel.challenges.length}</span>
            </div>
            <Progress value={conjugationDuel.progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Current Challenge */}
      {conjugationDuel.currentChallenge && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Challenge {conjugationDuel.currentChallengeIndex + 1}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor(conjugationDuel.currentChallenge.difficulty)}>
                  {conjugationDuel.currentChallenge.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {conjugationDuel.timeRemaining}s
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-2">Conjugate this verb:</div>
                <div className="text-3xl font-bold text-blue-800 mb-2">
                  {conjugationDuel.currentChallenge.infinitive}
                </div>
                <div className="text-sm text-blue-600">
                  ({conjugationDuel.currentChallenge.translation})
                </div>
              </div>

              <div className="text-lg">
                <span className="font-medium">{conjugationDuel.currentChallenge.person}</span>
                <span className="mx-2">+</span>
                <span className="font-medium">{conjugationDuel.currentChallenge.infinitive}</span>
                <span className="mx-2">→</span>
                <span className="text-gray-400">?</span>
              </div>

              <div className="text-sm text-gray-600">
                {conjugationDuel.currentChallenge.tense} tense • {conjugationDuel.currentChallenge.verbType} verb
              </div>
            </div>

            {!showResult && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Your Answer:</label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-3 border rounded-lg text-lg text-center"
                    placeholder="Type the conjugated form..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={!userAnswer.trim()}
                    className="flex-1"
                  >
                    Submit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSkip}
                    className="px-6"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResult && lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              lastResult.isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {lastResult.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">Correct Answer:</p>
              <p className="text-2xl font-bold">{lastResult.expectedAnswer}</p>
              {lastResult.explanation && (
                <p className="text-sm text-gray-600 mt-2">{lastResult.explanation}</p>
              )}
            </div>

            {lastResult.gemAwarded && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Gem Earned!</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`
                      ${lastResult.gemAwarded.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${lastResult.gemAwarded.rarity === 'epic' ? 'bg-purple-100 text-purple-800' : ''}
                      ${lastResult.gemAwarded.rarity === 'rare' ? 'bg-blue-100 text-blue-800' : ''}
                      ${lastResult.gemAwarded.rarity === 'uncommon' ? 'bg-green-100 text-green-800' : ''}
                      ${lastResult.gemAwarded.rarity === 'common' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      <Gem className="w-3 h-3 mr-1" />
                      {lastResult.gemAwarded.rarity}
                    </Badge>
                    <span className="text-sm font-medium">+{lastResult.gemAwarded.xpValue} XP</span>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleNextChallenge} className="w-full">
              {conjugationDuel.remainingChallenges > 0 ? 'Next Challenge' : 'Finish Duel'}
            </Button>
          </CardContent>
        </Card>
      )}

      {conjugationDuel.error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600">
              <strong>Error:</strong> {conjugationDuel.error}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
