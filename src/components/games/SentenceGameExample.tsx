/**
 * Example Sentence Game Component
 * 
 * Demonstrates how to integrate the sentence game system with vocabulary tracking.
 * Shows "Me gusta la pizza" → awards gems for "me gusta" and "la pizza"
 */

import React, { useState, useEffect } from 'react';
import { useSentenceGame } from '@/hooks/useSentenceGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gem, Star, Clock, Volume2 } from 'lucide-react';

interface SentenceGameExampleProps {
  sessionId: string;
  language: string;
  gameMode?: 'listening' | 'translation' | 'completion' | 'dictation';
}

export function SentenceGameExample({ 
  sessionId, 
  language, 
  gameMode = 'listening' 
}: SentenceGameExampleProps) {
  const sentenceGame = useSentenceGame({
    gameType: 'sentence_example',
    sessionId,
    language,
    gameMode,
    difficultyLevel: 'intermediate'
  });

  // Example sentences for demonstration
  const exampleSentences = [
    { 
      id: '1', 
      text: 'Me gusta la pizza', 
      translation: 'I like pizza',
      audio: '/audio/me-gusta-la-pizza.mp3'
    },
    { 
      id: '2', 
      text: 'Tengo que estudiar mucho', 
      translation: 'I have to study a lot',
      audio: '/audio/tengo-que-estudiar.mp3'
    },
    { 
      id: '3', 
      text: 'Por favor ayúdame', 
      translation: 'Please help me',
      audio: '/audio/por-favor-ayudame.mp3'
    }
  ];

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSentence = exampleSentences[currentSentenceIndex];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentSentenceIndex]);

  const playAudio = () => {
    setIsPlaying(true);
    // In a real implementation, you would play the audio file
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    const responseTime = Date.now() - startTime;
    const isCorrect = userAnswer.toLowerCase().trim() === currentSentence.text.toLowerCase();

    const result = await sentenceGame.processSentence(
      currentSentence.text,
      isCorrect,
      responseTime,
      false, // hintUsed
      currentSentence.id
    );

    setShowResult(true);
  };

  const nextSentence = () => {
    if (currentSentenceIndex < exampleSentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
    }
  };

  const resetGame = () => {
    setCurrentSentenceIndex(0);
    setUserAnswer('');
    setShowResult(false);
    sentenceGame.resetState();
  };

  const vocabularyStats = sentenceGame.getLastVocabularyStats();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Game Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sentence Game Example</span>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Gem className="w-4 h-4" />
                {sentenceGame.totalGems}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {sentenceGame.totalXP} XP
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Current Challenge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sentence {currentSentenceIndex + 1} of {exampleSentences.length}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={playAudio}
              disabled={isPlaying}
              className="flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              {isPlaying ? 'Playing...' : 'Play Audio'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gameMode === 'listening' && (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-600 mb-4">Listen and type what you hear:</p>
              <Button onClick={playAudio} disabled={isPlaying} size="lg">
                <Volume2 className="w-5 h-5 mr-2" />
                {isPlaying ? 'Playing...' : 'Play Audio'}
              </Button>
            </div>
          )}

          {gameMode === 'translation' && (
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-lg font-medium mb-2">Translate to {language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'German'}:</p>
              <p className="text-xl">{currentSentence.translation}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Your Answer:</label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="Type your answer here..."
              disabled={showResult}
              onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
            />
          </div>

          {!showResult && (
            <Button 
              onClick={handleSubmit} 
              disabled={!userAnswer.trim() || sentenceGame.isProcessing}
              className="w-full"
            >
              {sentenceGame.isProcessing ? 'Processing...' : 'Submit Answer'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {showResult && sentenceGame.lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              sentenceGame.lastResult.vocabularyMatches.length > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {sentenceGame.lastResult.vocabularyMatches.length > 0 ? '✅ Correct!' : '❌ Incorrect'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">Correct Answer:</p>
              <p className="text-lg">{currentSentence.text}</p>
              <p className="text-sm text-gray-600 mt-1">{currentSentence.translation}</p>
            </div>

            {/* Vocabulary Recognition Results */}
            {vocabularyStats && vocabularyStats.recognizedVocabulary.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Vocabulary Recognized & Gems Awarded:</h4>
                <div className="grid gap-2">
                  {sentenceGame.lastResult.gemsAwarded.map((gem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="font-medium">{gem.word}</span>
                        {vocabularyStats.recognizedVocabulary.find(v => v.word === gem.word)?.isMWE && (
                          <Badge variant="secondary" className="ml-2 text-xs">MWE</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`
                          ${gem.gemRarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${gem.gemRarity === 'epic' ? 'bg-purple-100 text-purple-800' : ''}
                          ${gem.gemRarity === 'rare' ? 'bg-blue-100 text-blue-800' : ''}
                          ${gem.gemRarity === 'uncommon' ? 'bg-green-100 text-green-800' : ''}
                          ${gem.gemRarity === 'common' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          <Gem className="w-3 h-3 mr-1" />
                          {gem.gemRarity}
                        </Badge>
                        <span className="text-sm font-medium">+{gem.xpAwarded} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coverage Statistics */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(sentenceGame.lastResult.coveragePercentage)}%
                </div>
                <div className="text-sm text-blue-800">Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sentenceGame.lastResult.vocabularyMatches.length}
                </div>
                <div className="text-sm text-green-800">Words Matched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {vocabularyStats?.mweCount || 0}
                </div>
                <div className="text-sm text-purple-800">MWEs Found</div>
              </div>
            </div>

            <div className="flex gap-2">
              {currentSentenceIndex < exampleSentences.length - 1 ? (
                <Button onClick={nextSentence} className="flex-1">
                  Next Sentence
                </Button>
              ) : (
                <Button onClick={resetGame} className="flex-1">
                  Play Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Statistics */}
      {sentenceGame.hasProcessedSentences && (
        <Card>
          <CardHeader>
            <CardTitle>Session Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{sentenceGame.processedSentences}</div>
                <div className="text-sm text-gray-600">Sentences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{sentenceGame.totalGems}</div>
                <div className="text-sm text-gray-600">Total Gems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{sentenceGame.totalXP}</div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(sentenceGame.averageGemsPerSentence * 10) / 10}
                </div>
                <div className="text-sm text-gray-600">Avg Gems/Sentence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {sentenceGame.error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600">
              <strong>Error:</strong> {sentenceGame.error}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
